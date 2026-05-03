import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth.middleware.js";
import { create, getAll, getByCategory, getBySlug, update, remove } from "./learn.controller.js";
import { validateCreateArticle, validateUpdateArticle } from "./learn.validation.js";

const router = Router();

// Public
router.get("/", getAll);
router.get("/category/:category", getByCategory);
router.get("/:slug", getBySlug);

// Protected — admin only
router.post("/", protect, restrictTo("admin"), validateCreateArticle, create);
router.patch("/:id", protect, restrictTo("admin"), validateUpdateArticle, update);
router.delete("/:id", protect, restrictTo("admin"), remove);

export default router;