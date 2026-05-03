import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import { createPricingRecord, getLatestPrice, getPricingHistory } from "./pricing.service.js";

export const create = asyncHandler(async (req, res) => {
  const record = await createPricingRecord(req.body);
  sendSuccess(res, 201, "Pricing record created", record);
});

export const latestPrice = asyncHandler(async (req, res) => {
  const record = await getLatestPrice(req.params.componentId, req.query);
  sendSuccess(res, 200, "Latest price fetched", record);
});

export const pricingHistory = asyncHandler(async (req, res) => {
  const { records, meta } = await getPricingHistory(req.params.componentId, req.query);
  sendSuccess(res, 200, "Pricing history fetched", records, meta);
});