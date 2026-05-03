import { Router } from "express";
import { fetchProfile, patchProfile } from "./user.controller.js";
import { validateUpdateProfile } from "./user.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/profile", fetchProfile);
router.patch("/profile", validateUpdateProfile, patchProfile);

export default router;