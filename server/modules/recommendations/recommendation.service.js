import Component from "../components/component.model.js";
import { checkBuildCompatibility } from "../compatibility/compatibility.service.js";

// ─── Budget Allocation Profiles ───────────────────────────────────────────────

const ALLOCATIONS = {
  gaming: {
    balanced:          { CPU: 0.20, GPU: 0.35, RAM: 0.08, Motherboard: 0.12, Storage: 0.08, PSU: 0.07, Cabinet: 0.06, Cooling: 0.04 },
    "budget-first":    { CPU: 0.18, GPU: 0.32, RAM: 0.07, Motherboard: 0.10, Storage: 0.10, PSU: 0.08, Cabinet: 0.08, Cooling: 0.07 },
    "performance-first":{ CPU: 0.22, GPU: 0.40, RAM: 0.08, Motherboard: 0.12, Storage: 0.07, PSU: 0.06, Cabinet: 0.03, Cooling: 0.02 },
  },
  streaming: {
    balanced:          { CPU: 0.28, GPU: 0.25, RAM: 0.10, Motherboard: 0.13, Storage: 0.09, PSU: 0.07, Cabinet: 0.05, Cooling: 0.03 },
    "budget-first":    { CPU: 0.26, GPU: 0.22, RAM: 0.10, Motherboard: 0.12, Storage: 0.12, PSU: 0.08, Cabinet: 0.06, Cooling: 0.04 },
    "performance-first":{ CPU: 0.32, GPU: 0.28, RAM: 0.12, Motherboard: 0.13, Storage: 0.07, PSU: 0.05, Cabinet: 0.02, Cooling: 0.01 },
  },
  "video-editing": {
    balanced:          { CPU: 0.30, GPU: 0.22, RAM: 0.14, Motherboard: 0.12, Storage: 0.10, PSU: 0.06, Cabinet: 0.04, Cooling: 0.02 },
    "budget-first":    { CPU: 0.28, GPU: 0.18, RAM: 0.14, Motherboard: 0.11, Storage: 0.13, PSU: 0.07, Cabinet: 0.05, Cooling: 0.04 },
    "performance-first":{ CPU: 0.33, GPU: 0.25, RAM: 0.16, Motherboard: 0.12, Storage: 0.08, PSU: 0.05, Cabinet: 0.01, Cooling: 0.00 },
  },
  programming: {
    balanced:          { CPU: 0.28, GPU: 0.10, RAM: 0.14, Motherboard: 0.14, Storage: 0.14, PSU: 0.08, Cabinet: 0.07, Cooling: 0.05 },
    "budget-first":    { CPU: 0.25, GPU: 0.08, RAM: 0.13, Motherboard: 0.13, Storage: 0.18, PSU: 0.09, Cabinet: 0.08, Cooling: 0.06 },
    "performance-first":{ CPU: 0.34, GPU: 0.12, RAM: 0.17, Motherboard: 0.15, Storage: 0.12, PSU: 0.06, Cabinet: 0.03, Cooling: 0.01 },
  },
  office: {
    balanced:          { CPU: 0.28, GPU: 0.00, RAM: 0.14, Motherboard: 0.18, Storage: 0.18, PSU: 0.10, Cabinet: 0.08, Cooling: 0.04 },
    "budget-first":    { CPU: 0.25, GPU: 0.00, RAM: 0.13, Motherboard: 0.16, Storage: 0.22, PSU: 0.10, Cabinet: 0.09, Cooling: 0.05 },
    "performance-first":{ CPU: 0.35, GPU: 0.00, RAM: 0.18, Motherboard: 0.20, Storage: 0.15, PSU: 0.08, Cabinet: 0.04, Cooling: 0.00 },
  },
  "mixed-use": {
    balanced:          { CPU: 0.24, GPU: 0.22, RAM: 0.10, Motherboard: 0.13, Storage: 0.12, PSU: 0.08, Cabinet: 0.07, Cooling: 0.04 },
    "budget-first":    { CPU: 0.22, GPU: 0.20, RAM: 0.10, Motherboard: 0.12, Storage: 0.14, PSU: 0.09, Cabinet: 0.08, Cooling: 0.05 },
    "performance-first":{ CPU: 0.26, GPU: 0.28, RAM: 0.10, Motherboard: 0.13, Storage: 0.10, PSU: 0.07, Cabinet: 0.04, Cooling: 0.02 },
  },
};

// ─── Purpose → Tag Hints ──────────────────────────────────────────────────────

const PURPOSE_TAGS = {
  gaming:          ["gaming"],
  streaming:       ["gaming", "streaming"],
  "video-editing": ["workstation", "content-creation"],
  programming:     ["workstation"],
  office:          ["budget", "entry-level"],
  "mixed-use":     ["gaming", "mid-range"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const pickBest = (candidates, budgetForSlot, style) => {
  if (!candidates || candidates.length === 0) return null;

  const affordable = candidates.filter((c) => c.estimatedPrice <= budgetForSlot);
  const pool = affordable.length > 0 ? affordable : candidates;

  if (style === "budget-first") {
    return pool.reduce((a, b) => (a.estimatedPrice <= b.estimatedPrice ? a : b));
  }
  if (style === "performance-first") {
    return pool.reduce((a, b) => (a.estimatedPrice >= b.estimatedPrice ? a : b));
  }
  // balanced — pick closest-to-budget from affordable, else cheapest overall
  return pool.reduce((a, b) =>
    Math.abs(a.estimatedPrice - budgetForSlot) <= Math.abs(b.estimatedPrice - budgetForSlot) ? a : b
  );
};

const buildComponentQuery = (type, budgetForSlot, brandPref, purposeTags, style) => {
  const query = { type, inStock: true };

  if (brandPref) query.brand = new RegExp(`^${brandPref}$`, "i");

  // For budget-first expand price window, else use 2x as ceiling for performance
  const ceiling =
    style === "budget-first"
      ? budgetForSlot * 1.2
      : style === "performance-first"
      ? budgetForSlot * 2.5
      : budgetForSlot * 1.5;

  query.estimatedPrice = { $lte: ceiling };

  if (purposeTags.length > 0) {
    query.tags = { $in: purposeTags };
  }

  return query;
};

const fetchCandidates = async (type, budgetForSlot, brandPref, purposeTags, style) => {
  const query = buildComponentQuery(type, budgetForSlot, brandPref, purposeTags, style);
  let results = await Component.find(query).lean();

  // Fallback: if tag filter yields nothing, drop tag constraint
  if (results.length === 0 && purposeTags.length > 0) {
    const relaxed = { ...query };
    delete relaxed.tags;
    results = await Component.find(relaxed).lean();
  }

  // Fallback: if brand filter yields nothing, drop brand constraint
  if (results.length === 0 && brandPref) {
    const relaxed = { ...query };
    delete relaxed.brand;
    results = await Component.find(relaxed).lean();
  }

  return results;
};

// ─── Compatibility-safe CPU + Motherboard pairing ────────────────────────────

const pickCompatibleCpuMotherboard = async (cpuBudget, mbBudget, brandPref, purposeTags, style) => {
  const cpus = await fetchCandidates("CPU", cpuBudget, brandPref?.cpuBrand, purposeTags, style);
  if (cpus.length === 0) return { cpu: null, motherboard: null };

  const cpu = pickBest(cpus, cpuBudget, style);
  const cpuSocket = cpu?.compatibility?.socket;
  const cpuRamType = cpu?.compatibility?.ramType;

  const mbQuery = {
    type: "Motherboard",
    inStock: true,
    estimatedPrice: { $lte: style === "budget-first" ? mbBudget * 1.2 : mbBudget * 1.5 },
    "compatibility.socket": cpuSocket,
  };
  if (cpuRamType) {
    const ramTypes = cpuRamType.split("/").map((s) => s.trim());
    mbQuery["compatibility.ramType"] = { $in: ramTypes };
  }

  let motherboards = await Component.find(mbQuery).lean();

  // Fallback: relax price ceiling
  if (motherboards.length === 0) {
    delete mbQuery.estimatedPrice;
    motherboards = await Component.find(mbQuery).lean();
  }

  const motherboard = motherboards.length > 0 ? pickBest(motherboards, mbBudget, style) : null;

  return { cpu, motherboard };
};

// ─── Compatible RAM picker ────────────────────────────────────────────────────

const pickCompatibleRam = async (motherboard, ramBudget, purposeTags, style) => {
  const ramType = motherboard?.compatibility?.ramType;
  const query = {
    type: "RAM",
    inStock: true,
    estimatedPrice: { $lte: ramBudget * 1.5 },
  };
  if (ramType) query["specs.type"] = ramType;

  let rams = await Component.find(query).lean();
  if (rams.length === 0) {
    delete query["specs.type"];
    rams = await Component.find(query).lean();
  }
  return rams.length > 0 ? pickBest(rams, ramBudget, style) : null;
};

// ─── Explanation builders ─────────────────────────────────────────────────────

const buildExplanations = (selected, purpose, style, budget) => {
  const parts = [];

  if (selected.CPU) {
    parts.push(
      `${selected.CPU.name} was selected as the CPU — it fits the ${purpose} workload and stays within the CPU budget allocation.`
    );
  }
  if (selected.GPU) {
    parts.push(
      `${selected.GPU.name} was chosen for GPU duties — suitable for ${purpose === "gaming" || purpose === "streaming" ? "gaming and rendering" : "accelerated workloads"}.`
    );
  }
  if (selected.RAM) {
    parts.push(`${selected.RAM.name} provides sufficient memory for ${purpose}.`);
  }
  if (selected.Motherboard) {
    parts.push(
      `${selected.Motherboard.name} was paired for socket and RAM type compatibility with the selected CPU.`
    );
  }
  if (selected.Storage) {
    parts.push(`${selected.Storage.name} handles primary storage needs.`);
  }
  if (selected.PSU) {
    parts.push(`${selected.PSU.name} supplies adequate and safe wattage for this configuration.`);
  }
  if (selected.Cabinet) {
    parts.push(`${selected.Cabinet.name} accommodates the selected motherboard form factor.`);
  }
  if (selected.Cooling) {
    parts.push(`${selected.Cooling.name} keeps thermals in check for the selected CPU.`);
  }

  const styleNote = {
    balanced: "This is a balanced build optimised across performance and value.",
    "budget-first": "This build prioritises cost efficiency across all components.",
    "performance-first": "This build maximises performance within the given budget.",
  }[style];

  return [...parts, styleNote];
};

// ─── Main Recommendation Service ──────────────────────────────────────────────

export const generateRecommendation = async ({ purpose, budget, style = "balanced", preferences = {} }) => {
  const allocation = ALLOCATIONS[purpose]?.[style] ?? ALLOCATIONS["mixed-use"]["balanced"];
  const purposeTags = PURPOSE_TAGS[purpose] ?? [];
  const needsGpu = purpose !== "office" && purpose !== "programming";

  // Slot budgets
  const slotBudget = (slot) => Math.floor(budget * (allocation[slot] ?? 0));

  const selected = {};
  const missing = [];

  // CPU + Motherboard (compatibility-paired)
  const cpuMbResult = await pickCompatibleCpuMotherboard(
    slotBudget("CPU"),
    slotBudget("Motherboard"),
    preferences,
    purposeTags,
    style
  );

  if (cpuMbResult.cpu) selected.CPU = cpuMbResult.cpu;
  else missing.push("CPU");

  if (cpuMbResult.motherboard) selected.Motherboard = cpuMbResult.motherboard;
  else missing.push("Motherboard");

  // RAM (matched to motherboard)
  const ram = await pickCompatibleRam(cpuMbResult.motherboard, slotBudget("RAM"), purposeTags, style);
  if (ram) selected.RAM = ram;
  else missing.push("RAM");

  // GPU
  if (needsGpu && allocation["GPU"] > 0) {
    const gpus = await fetchCandidates("GPU", slotBudget("GPU"), preferences?.gpuBrand, purposeTags, style);
    const gpu = pickBest(gpus, slotBudget("GPU"), style);
    if (gpu) selected.GPU = gpu;
    else missing.push("GPU");
  }

  // Storage
  const storages = await fetchCandidates("Storage", slotBudget("Storage"), null, [], style);
  const storage = pickBest(storages, slotBudget("Storage"), style);
  if (storage) selected.Storage = storage;
  else missing.push("Storage");

  // PSU
  const psus = await fetchCandidates("PSU", slotBudget("PSU"), null, [], style);
  const psu = pickBest(psus, slotBudget("PSU"), style);
  if (psu) selected.PSU = psu;
  else missing.push("PSU");

  // Cabinet (matched to motherboard form factor)
  const mbFormFactor = cpuMbResult.motherboard?.specs?.formFactor;
  const cabinetQuery = { type: "Cabinet", inStock: true, estimatedPrice: { $lte: slotBudget("Cabinet") * 1.5 } };
  if (mbFormFactor) cabinetQuery["specs.supportedMotherboards"] = mbFormFactor;
  let cabinets = await Component.find(cabinetQuery).lean();
  if (cabinets.length === 0) {
    delete cabinetQuery["specs.supportedMotherboards"];
    cabinets = await Component.find(cabinetQuery).lean();
  }
  const cabinet = pickBest(cabinets, slotBudget("Cabinet"), style);
  if (cabinet) selected.Cabinet = cabinet;
  else missing.push("Cabinet");

  // Cooling (matched to CPU socket)
  const cpuSocket = cpuMbResult.cpu?.compatibility?.socket;
  const coolingQuery = { type: "Cooling", inStock: true, estimatedPrice: { $lte: slotBudget("Cooling") * 1.5 } };
  if (cpuSocket) coolingQuery["compatibility.sockets"] = cpuSocket;
  let coolings = await Component.find(coolingQuery).lean();
  if (coolings.length === 0) {
    delete coolingQuery["compatibility.sockets"];
    coolings = await Component.find(coolingQuery).lean();
  }
  const cooling = pickBest(coolings, slotBudget("Cooling"), style);
  if (cooling) selected.Cooling = cooling;

  // Fallback check
  const criticalMissing = ["CPU", "RAM", "Motherboard", "Storage", "PSU"].filter((s) =>
    missing.includes(s)
  );

  if (criticalMissing.length >= 3) {
    return {
      success: false,
      fallback: true,
      message: "Catalog does not have enough components to build a meaningful recommendation for this configuration.",
      missing: criticalMissing,
      suggestion: "Try increasing the budget or adding more components to the catalog.",
    };
  }

  // Total price
  const allComponents = Object.values(selected);
  const totalEstimatedPrice = allComponents.reduce((sum, c) => sum + (c.estimatedPrice ?? 0), 0);

  // Compatibility
  const compatibilityResult = allComponents.length >= 2
    ? checkBuildCompatibility(allComponents)
    : null;

  // Explanations
  const explanations = buildExplanations(selected, purpose, style, budget);

  return {
    success: true,
    fallback: false,
    purpose,
    style,
    budget,
    totalEstimatedPrice,
    currency: "INR",
    withinBudget: totalEstimatedPrice <= budget,
    components: selected,
    compatibility: compatibilityResult,
    explanations,
    missing: missing.length > 0 ? missing : undefined,
  };
};