import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const carImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "car-rental/cars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "fill", quality: "auto" }],
  },
});

export const profileImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "car-rental/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
  },
});

export const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "car-rental/documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

export { cloudinary };
