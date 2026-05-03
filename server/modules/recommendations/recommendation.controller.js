import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { generateRecommendation } from "./recommendation.service.js";

export const recommend = asyncHandler(async (req, res) => {
  const { purpose, budget, style, preferences } = req.body;

  const result = await generateRecommendation({
    purpose,
    budget,
    style: style ?? "balanced",
    preferences: preferences ?? {},
  });

  if (result.fallback) {
    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        fallback: true,
        missing: result.missing,
        suggestion: result.suggestion,
      },
    });
  }

  sendSuccess(res, 200, "Recommendation generated", result);
});