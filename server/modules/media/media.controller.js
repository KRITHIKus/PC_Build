import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { uploadImage, deleteImage } from "./media.service.js";

export const upload = asyncHandler(async (req, res) => {
  const { folder } = req.query;
  const result = await uploadImage(req.file.buffer, { folder });
  sendSuccess(res, 201, "Image uploaded successfully", result);
});

export const remove = asyncHandler(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  const result = await deleteImage(publicId);
  sendSuccess(res, 200, "Image deleted successfully", result);
});