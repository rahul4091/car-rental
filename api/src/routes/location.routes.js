import { Router } from "express";
import {
  getLocations,
  getCities,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../controllers/location.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getLocations);
router.get("/cities", getCities);
router.get("/:id", getLocationById);

router.use(protect, authorize("admin"));
router.post("/", createLocation);
router.patch("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;
