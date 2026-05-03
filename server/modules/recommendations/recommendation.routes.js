import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { recommend } from "./recommendation.controller.js";
import { validateRecommendation } from "./recommendation.validation.js";

const router = Router();

router.post("/", protect, validateRecommendation, recommend);

export default router;