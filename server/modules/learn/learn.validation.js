import { VALID_DIFFICULTIES, VALID_CATEGORIES } from "./learn.model.js";

const URL_REGEX = /^https?:\/\/.+/;

export const validateCreateArticle = (req, res, next) => {
  const { title, category, difficulty, content, coverImageUrl } = req.body;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("title is required");
  } else if (title.trim().length > 200) {
    errors.push("title must not exceed 200 characters");
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  if (difficulty !== undefined && !VALID_DIFFICULTIES.includes(difficulty)) {
    errors.push(`difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}`);
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    errors.push("content body is required");
  }

  if (coverImageUrl !== undefined && coverImageUrl !== null && !URL_REGEX.test(coverImageUrl)) {
    errors.push("coverImageUrl must be a valid URL");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};

export const validateUpdateArticle = (req, res, next) => {
  const { category, difficulty, coverImageUrl } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "No update fields provided" });
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  if (difficulty !== undefined && !VALID_DIFFICULTIES.includes(difficulty)) {
    errors.push(`difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}`);
  }

  if (coverImageUrl !== undefined && coverImageUrl !== null && !URL_REGEX.test(coverImageUrl)) {
    errors.push("coverImageUrl must be a valid URL");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};