import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import {
  create,
  createScratch,
  getAll,
  getOne,
  updateMeta,
  updateParts,
  rename,
  favorite,
  journeyStatus,
  duplicate,
  remove,
  getFeatured,getFeaturedOne
  
} from "./build.controller.js";
import {
  validateCreateBuild,
  validateUpdateParts,
  validateUpdateMeta,
} from "./build.validation.js";




const router = Router();

router.get("/featured", getFeatured);
router.get("/featured/:id", getFeaturedOne);

router.use(protect);

router.post("/", validateCreateBuild, create);
router.post("/scratch", validateCreateBuild, createScratch);
router.get("/", getAll);
router.get("/:id", getOne); 
router.patch("/:id", validateUpdateMeta, updateMeta);
router.patch("/:id/parts", validateUpdateParts, updateParts);
router.patch("/:id/rename", rename);
router.patch("/:id/favorite", favorite);
router.patch("/:id/journey-status", journeyStatus);
router.post("/:id/duplicate", duplicate);
router.delete("/:id", remove);

export default router;