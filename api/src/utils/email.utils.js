import nodemailer from "nodemailer";
import { logger } from "./logger.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"DriveEase" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to}`);
  } catch (err) {
    logger.error(`Email failed to ${to}: ${err.message}`);
    throw err;
  }
};

export const sendOtpEmail = async (email, otp, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a56db, #7e3af2); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">DriveEase</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937;">Hello, ${name}!</h2>
        <p style="color: #6b7280;">Your OTP for password reset is:</p>
        <div style="background: white; border: 2px dashed #1a56db; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: bold; color: #1a56db; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #6b7280;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;
  await sendEmail({ to: email, subject: "DriveEase — Password Reset OTP", html });
};

export const sendBookingConfirmationEmail = async (email, name, booking) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a56db, #7e3af2); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Booking Confirmed!</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p style="color: #6b7280;">Your booking has been confirmed. Here are the details:</p>
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p><strong>Booking #:</strong> ${booking.bookingNumber}</p>
          <p><strong>Car:</strong> ${booking.carName}</p>
          <p><strong>Pickup:</strong> ${new Date(booking.pickupDate).toLocaleString()}</p>
          <p><strong>Drop:</strong> ${new Date(booking.dropDate).toLocaleString()}</p>
          <p><strong>Total:</strong> ₹${booking.totalAmount}</p>
        </div>
        <p style="color: #6b7280;">Thank you for choosing DriveEase!</p>
      </div>
    </div>
  `;
  await sendEmail({ to: email, subject: `Booking Confirmed — #${booking.bookingNumber}`, html });
};

export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a56db, #7e3af2); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to DriveEase!</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p style="color: #6b7280;">Welcome aboard! Your account has been created successfully.</p>
        <p style="color: #6b7280;">Start exploring our fleet of premium cars and book your next ride with ease.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}" style="background: #1a56db; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Explore Cars</a>
        </div>
      </div>
    </div>
  `;
  await sendEmail({ to: email, subject: "Welcome to DriveEase!", html });
};
