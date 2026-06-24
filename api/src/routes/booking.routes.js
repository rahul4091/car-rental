import { Router } from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  applyCoupon,
  rescheduleBooking,
  trackRental,
} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/apply-coupon", applyCoupon);
router.post("/", createBooking);
router.get("/", getMyBookings);
router.get("/:id/track", trackRental);
router.get("/:id", getBookingById);
router.post("/:id/cancel", cancelBooking);
router.patch("/:id/reschedule", rescheduleBooking);

export default router;
