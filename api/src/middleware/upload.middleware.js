import multer from "multer";
import { carImageStorage, profileImageStorage, documentStorage } from "../config/cloudinary.js";

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WebP and PDF are allowed."), false);
  }
};

export const uploadCarImages = multer({
  storage: carImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array("images", 10);

export const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
}).single("avatar");

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
}).single("document")

export const uploadCarDocument = multer({
  storage: documentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
}).single("document");
