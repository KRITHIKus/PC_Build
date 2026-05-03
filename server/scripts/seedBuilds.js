import mongoose from "mongoose";
import { env } from "../config/env.js";
import Build from "../modules/builds/build.model.js";
import buildsSeedData from "../data/builds/builds.seed.js";

const seedBuilds = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");

    await Build.deleteMany({});
    console.log("Old build data cleared");

    const inserted = await Build.insertMany(buildsSeedData);
    console.log(`✅ Seeded ${inserted.length} builds successfully`);

    const summaryBySource = inserted.reduce((acc, build) => {
      acc[build.source] = (acc[build.source] || 0) + 1;
      return acc;
    }, {});

    const summaryByUser = inserted.reduce((acc, build) => {
      const userId = build.user.toString();
      acc[userId] = (acc[userId] || 0) + 1;
      return acc;
    }, {});

    console.log("📊 Breakdown by source:", summaryBySource);
    console.log("📊 Breakdown by user:", summaryByUser);
  } catch (err) {
    console.error("❌ Build seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seedBuilds();