import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth.middleware.js";
import { create, latestPrice, pricingHistory } from "./pricing.controller.js";
import { validateCreatePricing } from "./pricing.validation.js";

const router = Router();

// Public
router.get("/component/:componentId/latest", latestPrice);
router.get("/component/:componentId/history", pricingHistory);

// Admin only
router.post("/", protect, restrictTo("admin"), validateCreatePricing, create);

export default router;