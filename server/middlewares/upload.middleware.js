import multer from "multer";
import path from "path";
import { AppError } from "../utils/appError.js";

// Allowed MIME types
const FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp"],
};

export const uploadFile = (type = "image", maxSizeMB = 5) => {
  if (!FILE_TYPES[type]) throw new Error(`Unsupported file type: ${type}`);

  const storage = multer.memoryStorage(); // store in memory to upload to Cloudinary directly

  const fileFilter = (req, file, cb) => {
    if (FILE_TYPES[type].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError(`Invalid file type. Allowed: ${FILE_TYPES[type].join(", ")}`, 400), false);
    }
  };

  const limits = { fileSize: maxSizeMB * 1024 * 1024 }; // size in bytes

  return multer({ storage, fileFilter, limits }).single(type); // expects field named "image" for images
};