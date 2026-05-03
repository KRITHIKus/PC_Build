import mongoose from "mongoose";

const URL_REGEX = /^https?:\/\/.+/;

export const validateCreatePricing = (req, res, next) => {
  const { component, price, currency, country, sourceName, checkedAt, sourceUrl } = req.body;
  const errors = [];

  if (!component || !mongoose.Types.ObjectId.isValid(component)) {
    errors.push("Valid component ID is required");
  }

  if (price === undefined || price === null) {
    errors.push("price is required");
  } else if (typeof price !== "number" || isNaN(price) || price < 0) {
    errors.push("price must be a non-negative number");
  }

  if (currency !== undefined && (typeof currency !== "string" || currency.trim().length === 0)) {
    errors.push("currency must be a non-empty string");
  }

  if (country !== undefined && (typeof country !== "string" || country.trim().length === 0)) {
    errors.push("country must be a non-empty string");
  }

  if (!sourceName || typeof sourceName !== "string" || sourceName.trim().length === 0) {
    errors.push("sourceName is required");
  }

  if (checkedAt !== undefined && isNaN(Date.parse(checkedAt))) {
    errors.push("checkedAt must be a valid date string");
  }

  if (sourceUrl !== undefined && sourceUrl !== null && !URL_REGEX.test(sourceUrl)) {
    errors.push("sourceUrl must be a valid URL");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};