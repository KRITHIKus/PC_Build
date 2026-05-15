import User from "./user.model.js";
import { AppError } from "../../utils/appError.js";
import bcrypt from "bcryptjs";
 import cloudinary from "../../config/cloudinary.js";

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



export const changePassword = async (userId, body) => {
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Both current and new password are required", 400);
  }

    if (currentPassword === newPassword) {
    throw new AppError(
      "New password cannot be same as current password",
      400
    );
  }
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  user.password = newPassword; // 🔥 triggers pre-save hash
  await user.save();

  return true;
};

  export const updateProfile = async (userId, body) => {
    const updates = {};

    for (const field of ALLOWED_UPDATE_FIELDS) {
      if (body[field] !== undefined) {
        updates[field] =
          typeof body[field] === "string" ? body[field].trim() : body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError("No valid update fields provided", 400);
    }

    // ✅ NEW: prevent duplicate username
    if (updates.username) {
      const existing = await User.findOne({ username: updates.username });
      if (existing && existing._id.toString() !== userId) {
        throw new AppError("Username already taken", 400);
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) throw new AppError("User not found", 404);

    return formatUser(user);
  };


 

export const updateUserAvatar = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  // 🔥 Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "buildlab/avatars",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(file.buffer);
  });

  // 🔥 Delete old image (if exists)
  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId);
  }

  // 🔥 Save new data
  user.avatar = result.secure_url;
  user.avatarPublicId = result.public_id;

  await user.save();

  return user.toSafeObject();
};