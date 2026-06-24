import { Router } from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllBookings,
  updateBookingStatus,
  getAllPayments,
  moderateReviews,
  approveReview,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  getFleetStats,
} from "../controllers/admin.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/fleet-stats", getFleetStats);

router.get("/users", getAllUsers);
router.patch("/users/:id/toggle-status", toggleUserStatus);

router.get("/bookings", getAllBookings);
router.patch("/bookings/:id/status", updateBookingStatus);

router.get("/payments", getAllPayments);

router.get("/reviews", moderateReviews);
router.patch("/reviews/:id/moderate", approveReview);

router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.patch("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

export default router;
