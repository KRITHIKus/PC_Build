import {AppError} from "../../utils/appError.js"

export const validateUpdateProfile = (req, res, next) => {
  const { username } = req.body;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "No update fields provided" });
  }

  if (username !== undefined) {
    if (typeof username !== "string" || username.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Username cannot be empty" });
    }
    if (username.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters" });
    }
    if (username.trim().length > 30) {
      return res.status(400).json({ success: false, message: "Username must not exceed 30 characters" });
    }
  }

  next();
};

export const validateUpdatePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError("Both passwords are required", 400));
  }

  if (newPassword.length < 8) {
    return next(new AppError("Password must be at least 8 characters", 400));
  }

  next();
};