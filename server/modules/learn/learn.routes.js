import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth.middleware.js";
import { uploadFile } from "../../middlewares/upload.middleware.js";
import { create, getAll, getByCategory, getBySlug, update, remove,uploadImage } from "./learn.controller.js";
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
// Admin only route for image upload
router.post(
  "/upload-image",
  protect,
  restrictTo("admin"),
  uploadFile("image", 5), // max 5MB
  uploadImage
);

export default router;

