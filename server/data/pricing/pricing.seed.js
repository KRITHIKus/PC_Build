import cabinetPricing from "./cabinet.pricing.seed.js";
import coolingPricing from "./cooling.pricing.seed.js";
import cpuPricing from "./cpu.pricing.seed.js";
import gpuPricing from "./gpu.pricing.seed.js";
import motherboardPricing from "./motherboard.pricing.seed.js";
import psuPricing from "./psu.pricing.seed.js";
import ramPricing from "./ram.pricing.seed.js";
import storagePricing from "./storage.pricing.seed.js";

const pricingSeedData = [
  ...cabinetPricing,
  ...coolingPricing,
  ...cpuPricing,
  ...gpuPricing,
  ...motherboardPricing,
  ...psuPricing,
  ...ramPricing,
  ...storagePricing,
];

export default pricingSeedData;