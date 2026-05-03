import mongoose from "mongoose";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "../config/env.js";
import Component from "../modules/components/component.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "../data/mapping");

const FILE_NAMES = {
  CPU: "cpu.map.json",
  GPU: "gpu.map.json",
  RAM: "ram.map.json",
  Motherboard: "motherboard.map.json",
  Storage: "storage.map.json",
  PSU: "psu.map.json",
  Cabinet: "cabinet.map.json",
  Cooling: "cooling.map.json",
};

const normalizeComponent = (component) => ({
  _id: component._id.toString(),
  type: component.type,
  brand: component.brand,
  model: component.model,
  name: component.name,
  estimatedPrice: component.estimatedPrice,
  currency: component.currency ?? "INR",
});

const exportComponentMaps = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");

    const components = await Component.find(
      {},
      {
        _id: 1,
        type: 1,
        brand: 1,
        model: 1,
        name: 1,
        estimatedPrice: 1,
        currency: 1,
      }
    )
      .sort({ type: 1, brand: 1, model: 1 })
      .lean();

    if (!components.length) {
      console.log("No components found in database");
      return;
    }

    const normalized = components.map(normalizeComponent);

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Write master file
    const masterPath = path.join(OUTPUT_DIR, "components.map.json");
    await fs.writeFile(masterPath, JSON.stringify(normalized, null, 2), "utf-8");
    console.log(`Created: ${masterPath}`);

    // Group by type
    const grouped = normalized.reduce((acc, component) => {
      if (!acc[component.type]) acc[component.type] = [];
      acc[component.type].push(component);
      return acc;
    }, {});

    // Write category files
    for (const [type, records] of Object.entries(grouped)) {
      const fileName = FILE_NAMES[type];
      if (!fileName) {
        console.warn(`Skipping unknown component type: ${type}`);
        continue;
      }

      const filePath = path.join(OUTPUT_DIR, fileName);
      await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");
      console.log(`Created: ${filePath} (${records.length} records)`);
    }

    // Console summary
    const summary = normalized.reduce((acc, component) => {
      acc[component.type] = (acc[component.type] || 0) + 1;
      return acc;
    }, {});

    console.log("Export summary:", summary);
  } catch (error) {
    console.error("Export failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
};

exportComponentMaps();