import User from "./user.model.js";
import { AppError } from "../../utils/appError.js";

const ALLOWED_UPDATE_FIELDS = ["username"];

const formatUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return formatUser(user);
};

export const updateProfile = async (userId, body) => {
  const updates = {};

  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (body[field] !== undefined) {
      updates[field] = typeof body[field] === "string" ? body[field].trim() : body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid update fields provided", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!user) throw new AppError("User not found", 404);
  return formatUser(user);
};