import Pricing from "./pricing.model.js";
import Component from "../components/component.model.js";
import { AppError } from "../../utils/appError.js";
import { paginate, paginateMeta } from "../../utils/pagination.js";

export const createPricingRecord = async (data) => {
  const {
    component,
    price,
    currency,
    country,
    region,
    sourceName,
    sourceUrl,
    checkedAt,
    disclaimer,
    notes,
  } = data;

  const exists = await Component.exists({ _id: component });
  if (!exists) throw new AppError("Component not found", 404);

  // ✅ Step 1: Create pricing record
  const record = await Pricing.create({
    component,
    price,
    currency: currency ?? "INR",
    country: country ?? "India",
    region: region ?? null,
    sourceName: sourceName.trim(),
    sourceUrl: sourceUrl ?? null,
    checkedAt: checkedAt ? new Date(checkedAt) : new Date(),
    disclaimer: disclaimer ?? null,
    notes: notes ?? null,
  });

  // 🔥 Step 2: SYNC COMPONENT PRICE (IMPORTANT)
  await Component.findByIdAndUpdate(component, {
    estimatedPrice: price,
    currency: currency ?? 'INR'
  });

  return record;
};

export const getLatestPrice = async (component, region) => {
  const normalizedRegion =
    region && region.trim() !== '' ? region : null;

  let record;

  // ✅ If region is provided → STRICT match
  if (normalizedRegion) {
    record = await Pricing.findOne({
      component,
      region: normalizedRegion,
    }).sort({ checkedAt: -1 });

    // ❌ DO NOT fallback silently
    if (!record) {
      throw new AppError(
        `No pricing data found for region: ${normalizedRegion}`,
        404
      );
    }
  } else {
    // ✅ No region → global latest
    record = await Pricing.findOne({ component }).sort({
      checkedAt: -1,
    });

    if (!record) {
      throw new AppError(
        "No pricing data found for this component",
        404
      );
    }
  }

  return record;
};

export const getPricingHistory = async (componentId, query = {}) => {
  const exists = await Component.exists({ _id: componentId });
  if (!exists) throw new AppError("Component not found", 404);

  const { page, limit, skip } = paginate(query);

  const filter = { component: componentId };
  if (query.country) filter.country = query.country;
  if (query.region) filter.region = query.region;
  if (query.sourceName) filter.sourceName = new RegExp(query.sourceName, "i");

  const [records, total] = await Promise.all([
    Pricing.find(filter)
      .sort({ checkedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("component", "name brand model type"),
    Pricing.countDocuments(filter),
  ]);

  return { records, meta: paginateMeta(total, page, limit) };
};