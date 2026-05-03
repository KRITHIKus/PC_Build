const VALID_PURPOSES = [
  "gaming",
  "streaming",
  "video-editing",
  "programming",
  "office",
  "mixed-use",
];

const VALID_STYLES = ["balanced", "budget-first", "performance-first"];

export { VALID_PURPOSES, VALID_STYLES };

export const validateRecommendation = (req, res, next) => {
  const { purpose, budget, style, preferences } = req.body;
  const errors = [];

  if (!purpose || !VALID_PURPOSES.includes(purpose)) {
    errors.push(`purpose must be one of: ${VALID_PURPOSES.join(", ")}`);
  }

  if (budget === undefined || budget === null) {
    errors.push("budget is required");
  } else if (typeof budget !== "number" || isNaN(budget) || budget < 10000) {
    errors.push("budget must be a number and at least 10000 (INR)");
  }

  if (style !== undefined && !VALID_STYLES.includes(style)) {
    errors.push(`style must be one of: ${VALID_STYLES.join(", ")}`);
  }

  if (preferences !== undefined) {
    if (typeof preferences !== "object" || Array.isArray(preferences)) {
      errors.push("preferences must be an object");
    } else {
      const allowedPrefs = ["cpuBrand", "gpuBrand", "upgradePreference", "rgbPreference"];
      for (const key of Object.keys(preferences)) {
        if (!allowedPrefs.includes(key)) {
          errors.push(`Unknown preference field: ${key}`);
        }
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }

  next();
};