import mongoose from "mongoose";
import { env } from "../config/env.js";
import Pricing from "../modules/pricing/pricing.model.js";
import pricingSeedData from "../data/pricing/pricing.seed.js";

const seedPricing = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");

    // 🔥 Reset old pricing (safe now since you're seeding full dataset)
    await Pricing.deleteMany({});
    console.log("Old pricing data cleared");

    const inserted = await Pricing.insertMany(pricingSeedData);
    console.log(`✅ Seeded ${inserted.length} pricing records`);

    // Breakdown by state (important check)
    const stateSummary = inserted.reduce((acc, item) => {
      acc[item.region] = (acc[item.region] || 0) + 1;
      return acc;
    }, {});

    console.log("📊 State breakdown:", stateSummary);

  } catch (err) {
    console.error("❌ Pricing seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedPricing();