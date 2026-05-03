import { VALID_TOPICS, VALID_ERAS } from "./history.model.js";

const URL_REGEX = /^https?:\/\/.+/;

export const validateCreateEntry = (req, res, next) => {
  const { title, topic, era, timelineOrder, content, coverImageUrl } = req.body;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    errors.push("title is required");
  } else if (title.trim().length > 200) {
    errors.push("title must not exceed 200 characters");
  }

  if (!topic || !VALID_TOPICS.includes(topic)) {
    errors.push(`topic must be one of: ${VALID_TOPICS.join(", ")}`);
  }

  if (!era || !VALID_ERAS.includes(era)) {
    errors.push(`era must be one of: ${VALID_ERAS.join(", ")}`);
  }

  if (timelineOrder === undefined || timelineOrder === null) {
    errors.push("timelineOrder is required");
  } else if (typeof timelineOrder !== "number" || !Number.isFinite(timelineOrder)) {
    errors.push("timelineOrder must be a number");
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

export const validateUpdateEntry = (req, res, next) => {
  const { topic, era, timelineOrder, coverImageUrl } = req.body;
  const errors = [];

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ success: false, message: "No update fields provided" });
  }

  if (topic !== undefined && !VALID_TOPICS.includes(topic)) {
    errors.push(`topic must be one of: ${VALID_TOPICS.join(", ")}`);
  }

  if (era !== undefined && !VALID_ERAS.includes(era)) {
    errors.push(`era must be one of: ${VALID_ERAS.join(", ")}`);
  }

  if (timelineOrder !== undefined && (typeof timelineOrder !== "number" || !Number.isFinite(timelineOrder))) {
    errors.push("timelineOrder must be a number");
  }

  if (coverImageUrl !== undefined && coverImageUrl !== null && !URL_REGEX.test(coverImageUrl)) {
    errors.push("coverImageUrl must be a valid URL");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};