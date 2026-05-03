import cpu from "./components/cpu.seed.js";
import gpu from "./components/gpu.seed.js";
import ram from "./components/ram.seed.js";
import motherboard from "./components/motherboard.seed.js";
import storage from "./components/storage.seed.js";
import psu from "./components/psu.seed.js";
import cabinet from "./components/cabinet.seed.js";
import cooling from "./components/cooling.seed.js";

const componentsSeedData = [
  ...cpu,
  ...gpu,
  ...ram,
  ...motherboard,
  ...storage,
  ...psu,
  ...cabinet,
  ...cooling,
];

export default componentsSeedData;