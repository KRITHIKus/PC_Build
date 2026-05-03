import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { upload as uploadCtrl, remove } from "./media.controller.js";
import { upload, requireFile } from "./media.validation.js";

const router = Router();

router.post(
  "/upload",
  protect,
  upload.single("image"),
  requireFile,
  uploadCtrl
);

router.delete(
  "/:publicId(*)",
  protect,
  remove
);

export default router;