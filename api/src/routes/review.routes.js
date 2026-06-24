import { Router } from "express";
import {
  createReview,
  getCarReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  voteHelpful,
  reportReview,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadCarImages } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/car/:carId", getCarReviews);

router.use(protect);
router.post("/", uploadCarImages, createReview);
router.get("/my", getMyReviews);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);
router.post("/:id/helpful", voteHelpful);
router.post("/:id/report", reportReview);

export default router;
