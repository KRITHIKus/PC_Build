import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { AppError } from "../../utils/appError.js";
import Component from "../components/component.model.js";
import { checkBuildCompatibility } from "./compatibility.service.js";

export const checkCompatibility = asyncHandler(async (req, res) => {
  const { componentIds } = req.body;

  if (!Array.isArray(componentIds) || componentIds.length < 2) {
    throw new AppError("Provide at least 2 componentIds to check compatibility", 400);
  }

  const components = await Component.find({ _id: { $in: componentIds } });

  if (components.length !== componentIds.length) {
    throw new AppError("One or more component IDs are invalid", 404);
  }

  const result = checkBuildCompatibility(components);

  sendSuccess(res, 200, "Compatibility check complete", result);
});