import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth.middleware.js";
import { create, getAll, getBySlug, update, remove } from "./history.controller.js";
import { validateCreateEntry, validateUpdateEntry } from "./history.validation.js";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:slug", getBySlug);

// Admin only
router.post("/", protect, restrictTo("admin"), validateCreateEntry, create);
router.patch("/:id", protect, restrictTo("admin"), validateUpdateEntry, update);
router.delete("/:id", protect, restrictTo("admin"), remove);

export default router;