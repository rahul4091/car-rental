import { Router } from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  razorpayWebhook,
  refundPayment,
} from "../controllers/payment.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/webhook", razorpayWebhook);

router.use(protect);
router.post("/create-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/history", getPaymentHistory);

router.post("/refund", authorize("admin"), refundPayment);

export default router;
