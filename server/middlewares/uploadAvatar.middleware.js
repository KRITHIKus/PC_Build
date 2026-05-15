import multer from "multer";
import { AppError } from "../utils/appError.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new AppError("Only .png, .jpg, .jpeg files are allowed", 400),
      false
    );
  }

  cb(null, true);
};
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});