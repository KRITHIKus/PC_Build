import { Router } from "express";
import {
  fetchProfile,
  patchProfile,
  updatePassword, // ✅ NEW
  updateAvatar
} from "./user.controller.js";

import {
  validateUpdateProfile,
  validateUpdatePassword, // ✅ NEW

} from "./user.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadAvatar } from "../../middlewares/uploadAvatar.middleware.js";

const router = Router();

router.use(protect);

router.get("/profile", fetchProfile);
router.patch("/profile", validateUpdateProfile, patchProfile);

// ✅ NEW ROUTE
router.patch("/profile/password", validateUpdatePassword, updatePassword);

router.patch(
  "/profile/avatar",
  uploadAvatar.single("avatar"),
  updateAvatar
);

export default router;