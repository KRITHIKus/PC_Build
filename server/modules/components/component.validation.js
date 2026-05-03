import { VALID_COMPONENT_TYPES } from "./component.model.js";

const URL_REGEX = /^https?:\/\/.+/;

export const validateCreateComponent = (req, res, next) => {
  const { type, brand, model, name, estimatedPrice, imageUrl } = req.body;
  const errors = [];

  if (!type || !VALID_COMPONENT_TYPES.includes(type)) {
    errors.push(`type must be one of: ${VALID_COMPONENT_TYPES.join(", ")}`);
  }

  if (!brand || typeof brand !== "string" || brand.trim().length === 0) {
    errors.push("brand is required");
  }

  if (!model || typeof model !== "string" || model.trim().length === 0) {
    errors.push("model is required");
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("name is required");
  }

  if (estimatedPrice === undefined || estimatedPrice === null) {
    errors.push("estimatedPrice is required");
  } else if (typeof estimatedPrice !== "number" || isNaN(estimatedPrice) || estimatedPrice < 0) {
    errors.push("estimatedPrice must be a non-negative number");
  }

  if (imageUrl !== undefined && imageUrl !== null && !URL_REGEX.test(imageUrl)) {
    errors.push("imageUrl must be a valid URL starting with http or https");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};

export const validateUpdateComponent = (req, res, next) => {
  const { type, estimatedPrice, imageUrl } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "No update fields provided" });
  }

  if (type !== undefined && !VALID_COMPONENT_TYPES.includes(type)) {
    errors.push(`type must be one of: ${VALID_COMPONENT_TYPES.join(", ")}`);
  }

  if (estimatedPrice !== undefined) {
    if (typeof estimatedPrice !== "number" || isNaN(estimatedPrice) || estimatedPrice < 0) {
      errors.push("estimatedPrice must be a non-negative number");
    }
  }

  if (imageUrl !== undefined && imageUrl !== null && !URL_REGEX.test(imageUrl)) {
    errors.push("imageUrl must be a valid URL starting with http or https");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};