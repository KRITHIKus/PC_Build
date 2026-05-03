import mongoose from "mongoose";
import { VALID_JOURNEY_STATUSES } from "./build.model.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateCreateBuild = (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Build title is required" });
  }
  if (title.trim().length > 100) {
    return res.status(400).json({ success: false, message: "Title must not exceed 100 characters" });
  }

  next();
};

export const validateUpdateParts = (req, res, next) => {
  const { parts } = req.body;
  const errors = [];

  if (!parts || typeof parts !== "object" || Array.isArray(parts)) {
    return res.status(400).json({ success: false, message: "parts must be an object" });
  }

  const singleSlots = ["cpu", "gpu", "ram", "motherboard", "psu", "cabinet", "cooling"];

  for (const slot of singleSlots) {
    if (parts[slot] !== undefined && parts[slot] !== null) {
      if (!isValidId(parts[slot])) {
        errors.push(`Invalid component ID for ${slot}`);
      }
    }
  }

  if (parts.storage !== undefined) {
    if (!Array.isArray(parts.storage)) {
      errors.push("storage must be an array of component IDs");
    } else {
      for (const id of parts.storage) {
        if (!isValidId(id)) errors.push(`Invalid storage component ID: ${id}`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};

export const validateUpdateMeta = (req, res, next) => {
  const { title, description, journeyStatus, isFavorite, isDreamBuild } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "No update fields provided" });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      errors.push("title cannot be empty");
    } else if (title.trim().length > 100) {
      errors.push("title must not exceed 100 characters");
    }
  }

  if (journeyStatus !== undefined && !VALID_JOURNEY_STATUSES.includes(journeyStatus)) {
    errors.push(`journeyStatus must be one of: ${VALID_JOURNEY_STATUSES.join(", ")}`);
  }

  if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
    errors.push("isFavorite must be a boolean");
  }

  if (isDreamBuild !== undefined && typeof isDreamBuild !== "boolean") {
    errors.push("isDreamBuild must be a boolean");
  }

  if (description !== undefined && typeof description !== "string") {
    errors.push("description must be a string");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};