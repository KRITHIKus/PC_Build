import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  cookieOptions,
} from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await registerUser({ username, email, password });

  sendSuccess(res, 201, "Account created successfully", user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { token, user } = await loginUser({ email, password });

  res.cookie("token", token, cookieOptions());
  sendSuccess(res, 200, "Logged in successfully", user);
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", { ...cookieOptions(), maxAge: 0 });
  sendSuccess(res, 200, "Logged out successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  sendSuccess(res, 200, "Current user fetched", user);
});