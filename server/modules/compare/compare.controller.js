import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { compareBuilds,compareFeaturedBuilds,compareHybridBuilds } from "./compare.service.js";

export const compare = asyncHandler(async (req, res) => {
  const { buildIds } = req.body;
  const result = await compareBuilds(req.user.id, buildIds);
  sendSuccess(res, 200, "Comparison complete", result);
});

export const comparePublic = asyncHandler(async (req, res) => {
  const { buildIds } = req.body;
  const result = await compareFeaturedBuilds(buildIds);

  sendSuccess(res, 200, "Featured comparison complete", result);
});

export const compareHybrid = asyncHandler(async (req, res) => {
  const result = await compareHybridBuilds(
    req.body.buildIds,
    req.user.id
  )

  res.status(200).json({
    success: true,
    data: result,
  })
})