import { Router } from "express";
import { create, getAll, getById, update, remove } from "./component.controller.js";
import { validateCreateComponent, validateUpdateComponent } from "./component.validation.js";
import { protect, restrictTo } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);

router.post("/", protect, restrictTo("admin"), validateCreateComponent, create);
router.patch("/:id", protect, restrictTo("admin"), validateUpdateComponent, update);
router.delete("/:id", protect, restrictTo("admin"), remove);

export default router;