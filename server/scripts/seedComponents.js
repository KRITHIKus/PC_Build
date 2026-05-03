import mongoose from "mongoose";
import { env } from "../config/env.js";
import Component from "../modules/components/component.model.js";
import  componentsSeedData  from "../data/components.seed.js";

const seed = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");

    const inserted = await Component.insertMany(componentsSeedData);
    console.log(`Seeded ${inserted.length} components successfully`);

    const summary = inserted.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {});

    console.log("Breakdown:", summary);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

seed();