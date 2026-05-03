import jwt from "jsonwebtoken";
import User from "../users/user.model.js";
import { AppError } from "../../utils/appError.js";
import { env } from "../../config/env.js";

const signToken = (id) =>
  jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? "strict" : "lax",
  maxAge: env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
});

export const registerUser = async ({ username, email, password }) => {
  const existing = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });

  if (existing) {
    const field = existing.email === email.toLowerCase() ? "Email" : "Username";
    throw new AppError(`${field} is already in use`, 409);
  }

  const user = await User.create({ username, email, password });
  return user.toSafeObject();
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user._id);
  return { token, user: user.toSafeObject() };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user.toSafeObject();
};

export { cookieOptions };