import multer from "multer";
import { AppError } from "../../utils/appError.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only jpg, png, and webp images are allowed", 400), false);
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter,
});

export const requireFile = (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file provided", 400));
  }
  next();
};