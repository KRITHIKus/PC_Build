import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { compare,comparePublic } from "./compare.controller.js";

const router = Router();

router.post("/public", comparePublic);

router.post("/", protect, compare);

export default router;