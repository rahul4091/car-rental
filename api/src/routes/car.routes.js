import { Router } from "express";
import {
  getCars,
  getCarById,
  getFeaturedCars,
  checkCarAvailability,
  getCarBookedDates,
  createCar,
  updateCar,
  addCarImages,
  deleteCarImage,
  deleteCar,
  getCarFilters,
  uploadCarDocument,
  verifyCarDocument,
} from "../controllers/car.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { uploadCarImages, uploadCarDocument as uploadCarDocMiddleware } from "../middleware/upload.middleware.js";

const router = Router();

router.get("/", getCars);
router.get("/featured", getFeaturedCars);
router.get("/filters", getCarFilters);
router.get("/:id", getCarById);
router.get("/:id/availability", checkCarAvailability);
router.get("/:id/booked-dates", getCarBookedDates);

router.use(protect, authorize("admin"));
router.post("/", uploadCarImages, createCar);
router.patch("/:id", updateCar);
router.post("/:id/images", uploadCarImages, addCarImages);
router.delete("/:id/images/:imageId", deleteCarImage);
router.post("/:id/documents/:docType", uploadCarDocMiddleware, uploadCarDocument);
router.patch("/:id/documents/:docType/verify", verifyCarDocument);
router.delete("/:id", deleteCar);

export default router;
