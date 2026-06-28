import crypto from "crypto";
import Razorpay from "razorpay";
import Booking from "../model/booking.model.js";
import Payment from "../model/payment.model.js";
import { AppError } from "../middleware/errorHandler.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createPaymentIntent = async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findOne({ _id: bookingId, user: req.user._id }).populate("car", "name brand");
  if (!booking) throw new AppError("Booking not found", 404);
  if (booking.paymentStatus === "paid") throw new AppError("Booking already paid", 400);

  const amountInPaise = Math.round(booking.totalAmount * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${bookingId}`,
    notes: {
      bookingId: bookingId.toString(),
      userId: req.user._id.toString(),
    },
  });

  await Payment.findOneAndUpdate(
    { booking: bookingId },
    {
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalAmount,
      razorpayOrderId: order.id,
      status: "pending",
      method: "card",
    },
    { upsert: true, new: true }
  );

  res.json({
    success: true,
    data: {
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    },
  });
};

export const confirmPayment = async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, bookingId } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new AppError("Payment verification failed: invalid signature", 400);
  }

  // Fix #2: bind lookup to the requesting user so user A cannot confirm user B's payment
  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId, user: req.user._id },
    { status: "succeeded", razorpayPaymentId, razorpaySignature },
    { new: true }
  );

  if (!payment) throw new AppError("Payment record not found", 404);

  await Booking.findByIdAndUpdate(payment.booking, {
    status: "confirmed",
    paymentStatus: "paid",
    razorpayOrderId,
  });

  res.json({ success: true, message: "Payment verified and confirmed", data: { payment } });
};

export const getPaymentHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const [payments, total] = await Promise.all([
    Payment.find({ user: req.user._id })
      .populate({
        path: "booking",
        select: "bookingNumber pickupDate dropDate status",
        populate: { path: "car", select: "name brand model" },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit)),
    Payment.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    success: true,
    data: {
      payments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    },
  });
};

export const razorpayWebhook = async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }

  const { event, payload } = req.body;

  if (event === "payment.captured") {
    const { order_id, id: paymentId } = payload.payment.entity;
    const payment = await Payment.findOne({ razorpayOrderId: order_id });
    if (payment && payment.status !== "succeeded") {
      payment.status = "succeeded";
      payment.razorpayPaymentId = paymentId;
      await payment.save();
      await Booking.findByIdAndUpdate(payment.booking, {
        status: "confirmed",
        paymentStatus: "paid",
        razorpayOrderId: order_id,
      });
    }
  }

  res.json({ received: true });
};

export const refundPayment = async (req, res) => {
  const { bookingId, reason } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new AppError("Booking not found", 404);

  const payment = await Payment.findOne({ booking: bookingId, status: "succeeded" });
  if (!payment) throw new AppError("No successful payment found", 404);

  const refundAmount = booking.refundAmount || 0;
  if (refundAmount <= 0) throw new AppError("No refund applicable", 400);

  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: Math.round(refundAmount * 100),
    notes: { reason: reason || "Customer requested refund" },
  });

  payment.status = "refunded";
  payment.refundAmount = refundAmount;
  payment.refundedAt = new Date();
  payment.refundReason = reason;
  payment.razorpayRefundId = refund.id;
  await payment.save();

  await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "refunded", refundedAt: new Date() });

  res.json({ success: true, message: "Refund processed", data: { refundAmount, refundId: refund.id } });
};
