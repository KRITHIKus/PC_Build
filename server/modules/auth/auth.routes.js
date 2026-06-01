import { Router } from "express";
import { register, login, logout, getMe ,googleAuth} from "./auth.controller.js";
import { validateRegister, validateLogin } from "./auth.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/google", googleAuth);
export default router;