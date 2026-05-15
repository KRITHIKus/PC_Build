import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { uploadImageToComponent, deleteImage } from "./media.service.js";
import { AppError } from "../../utils/appError.js";

// 🔹 Upload image and update component
export const upload = asyncHandler(async (req, res) => {
  const { folder,  } = req.query; // pass componentId from frontend
const {componentId}=req.body
  if (!componentId) {
    throw new AppError("Component ID is required", 400);
  }

  const result = await uploadImageToComponent(componentId, req.file.buffer, { folder });

  sendSuccess(res, 201, "Image uploaded and component updated successfully", result);
});

// 🔹 Delete image (unchanged)
export const remove = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  const result = await deleteImage(publicId);
  sendSuccess(res, 200, "Image deleted successfully", result);
});