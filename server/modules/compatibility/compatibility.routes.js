import { Router } from "express";
import { checkCompatibility } from "./compatibility.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/check", protect, checkCompatibility);

export default router;