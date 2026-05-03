import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { getProfile, updateProfile } from "./user.service.js";

export const fetchProfile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);
  sendSuccess(res, 200, "Profile fetched", user);
});

export const patchProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);
  sendSuccess(res, 200, "Profile updated", user);
});