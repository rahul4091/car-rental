import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updateAvatar,
  changePassword,
  getRentalHistory,
  saveCar,
  saveLocation,
  updateDrivingLicense,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadProfileImage, uploadDocument } from "../middleware/upload.middleware.js";

const router = Router();

router.use(protect);

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.patch("/avatar", uploadProfileImage, updateAvatar);
router.patch("/change-password", changePassword);
router.get("/rental-history", getRentalHistory);
router.post("/save-car/:carId", saveCar);
router.post("/save-location/:locationId", saveLocation);
router.patch("/driving-license", uploadDocument, updateDrivingLicense);

export default router;
