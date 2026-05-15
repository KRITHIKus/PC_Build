import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  getProfile,
  updateProfile,
  changePassword, // ✅ NEW
  updateUserAvatar
} from "./user.service.js";

export const fetchProfile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);
  sendSuccess(res, 200, "Profile fetched", user);
});

export const patchProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);
  sendSuccess(res, 200, "Profile updated", user);
});

// ✅ NEW CONTROLLER
export const updatePassword = asyncHandler(async (req, res) => {
  await changePassword(req.user.id, req.body);
  sendSuccess(res, 200, "Password updated successfully");
});

export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const user = await updateUserAvatar(req.user.id, req.file);

  sendSuccess(res, 200, "Avatar updated successfully", user);
});