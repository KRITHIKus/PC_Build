import mongoose from "mongoose";
import Build from "../builds/build.model.js";
import { AppError } from "../../utils/appError.js";
import { checkBuildCompatibility } from "../compatibility/compatibility.service.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SINGLE_SLOTS = ["cpu", "gpu", "ram", "motherboard", "psu", "cabinet", "cooling"];

const keySpecs = (component, type) => {
  if (!component) return null;
  const s = component.specs ?? {};
  switch (type) {
    case "cpu":
      return { cores: s.cores, threads: s.threads, boostClock: s.boostClock, socket: component.compatibility?.socket };
    case "gpu":
      return { vram: s.vram, vramType: s.vramType, boostClock: s.boostClock, tdp: s.tdp };
    case "ram":
      return { capacity: s.capacity, speed: s.speed, type: s.type };
    case "motherboard":
      return { formFactor: s.formFactor, chipset: s.chipset, ramType: component.compatibility?.ramType, socket: component.compatibility?.socket };
    case "storage":
      return { capacity: s.capacity, type: s.type, readSpeed: s.readSpeed, interface: s.interface };
    case "psu":
      return { wattage: s.wattage, efficiency: s.efficiency, modular: s.modular };
    case "cabinet":
      return { formFactor: s.formFactor, maxGpuLength: s.maxGpuLength, maxCpuCoolerHeight: s.maxCpuCoolerHeight };
    case "cooling":
      return { type: s.type, tdpRating: s.tdpRating, fanSize: s.fanSize };
    default:
      return null;
  }
};

const slotSummary = (component, slot) => {
  if (!component) return null;
  return {
    _id: component._id,
    name: component.name,
    brand: component.brand,
    model: component.model,
    estimatedPrice: component.estimatedPrice,
    specs: keySpecs(component, slot),
  };
};

const getPsuHeadroom = (build) => {
  const psuWattage = build.parts?.psu?.specs?.wattage;
  const cpuTdp = build.parts?.cpu?.specs?.tdp ?? 95;
  const gpuTdp = build.parts?.gpu?.specs?.tdp ?? 0;
  const base = 75;
  if (!psuWattage) return null;
  const draw = base + cpuTdp + gpuTdp;
  const headroomPct = Math.round(((psuWattage - draw) / psuWattage) * 100);
  return { psuWattage, estimatedDraw: draw, headroomPercent: headroomPct };
};

const upgradeFlexibility = (build) => {
  const headroom = getPsuHeadroom(build);
  const socket = build.parts?.cpu?.compatibility?.socket ?? "";
  const chipset = build.parts?.motherboard?.specs?.chipset ?? "";

  const modernSockets = ["AM5", "LGA1700"];
  const highEndChipsets = ["X670", "X670E", "Z790", "Z690", "X570", "B550"];

  const isModernPlatform =
    modernSockets.some((s) => socket.includes(s)) ||
    highEndChipsets.some((c) => chipset.includes(c));

  const goodHeadroom = headroom && headroom.headroomPercent >= 25;
  const tightHeadroom = headroom && headroom.headroomPercent < 10;

  if (isModernPlatform && goodHeadroom) return "good";
  if (tightHeadroom || (!isModernPlatform && !goodHeadroom)) return "limited";
  return "moderate";
};

const inferUseCases = (build) => {
  const useCases = [];
  const gpu = build.parts?.gpu;
  const cpu = build.parts?.cpu;
  const ram = build.parts?.ram;

  const gpuVram = gpu?.specs?.vram ?? 0;
  const cpuCores = cpu?.specs?.cores ?? 0;
  const ramCapacity = ram?.specs?.capacity ?? 0;

  if (gpuVram >= 8) useCases.push("gaming");
  if (gpuVram >= 12) useCases.push("3D-rendering");
  if (cpuCores >= 8 && ramCapacity >= 32) useCases.push("video-editing");
  if (cpuCores >= 6 && ramCapacity >= 16) useCases.push("programming");
  if (gpuVram >= 6 && cpuCores >= 6) useCases.push("streaming");
  if (cpuCores >= 4 && ramCapacity >= 8) useCases.push("office");

  return useCases.length > 0 ? [...new Set(useCases)] : ["general"];
};

const buildSummary = (builds, priceComparison, insights) => {
  const parts = [];

  if (insights.bestForBudget) {
    parts.push(`${insights.bestForBudget} is the most budget-friendly option at ₹${priceComparison.cheapest.price.toLocaleString("en-IN")}.`);
  }
  if (insights.bestForPerformance) {
    parts.push(`${insights.bestForPerformance} offers the highest-spec configuration.`);
  }
  if (insights.bestForGaming) {
    parts.push(`${insights.bestForGaming} is best suited for gaming.`);
  }
  if (insights.bestForUpgrade) {
    parts.push(`${insights.bestForUpgrade} has the most upgrade headroom.`);
  }

  const incompatible = builds.filter((b) => b.compatibility?.valid === false).map((b) => b.title);
  if (incompatible.length > 0) {
    parts.push(`Note: ${incompatible.join(", ")} ${incompatible.length > 1 ? "have" : "has"} compatibility blockers that should be resolved.`);
  }

  return parts.join(" ");
};


const buildComparisonResponse = (builds) => {
  const buildData = builds.map((build) => {
    const parts = build.parts ?? {}

    const allComponents = [
      parts.cpu,
      parts.gpu,
      parts.ram,
      parts.motherboard,
      parts.psu,
      parts.cabinet,
      parts.cooling,
      ...(Array.isArray(parts.storage) ? parts.storage : []),
    ].filter(Boolean)

    const compatibility =
      allComponents.length >= 2
        ? checkBuildCompatibility(allComponents)
        : build.compatibilityResult ?? null

    return {
      _id: build._id,
      title: build.title,
      journeyStatus: build.journeyStatus,
      isFavorite: build.isFavorite,
      isDreamBuild: build.isDreamBuild,
      totalEstimatedPrice: build.totalEstimatedPrice,
      currency: build.currency,
      compatibility,
      useCases: inferUseCases(build),
      upgradeFlexibility: upgradeFlexibility(build),
      psuHeadroom: getPsuHeadroom(build),
    }
  })

  const sorted = [...buildData].sort(
    (a, b) => a.totalEstimatedPrice - b.totalEstimatedPrice
  )

  const priceComparison = {
    cheapest: {
      title: sorted[0].title,
      price: sorted[0].totalEstimatedPrice,
    },
    mostExpensive: {
      title: sorted[sorted.length - 1].title,
      price: sorted[sorted.length - 1].totalEstimatedPrice,
    },
    priceDifference:
      sorted[sorted.length - 1].totalEstimatedPrice -
      sorted[0].totalEstimatedPrice,

    breakdown: buildData.map((b) => ({
      title: b.title,
      totalEstimatedPrice: b.totalEstimatedPrice,
      currency: b.currency,
    })),
  }

  const componentComparison = {}

  for (const slot of SINGLE_SLOTS) {
    componentComparison[slot] = builds.map((build) => ({
      buildTitle: build.title,
      component: slotSummary(build.parts?.[slot], slot),
    }))
  }

  componentComparison.storage = builds.map((build) => ({
    buildTitle: build.title,
    components: Array.isArray(build.parts?.storage)
      ? build.parts.storage.map((s) => slotSummary(s, "storage"))
      : [],
  }))

  const compatibilityComparison = {
    results: buildData.map((b) => ({
      title: b.title,
      valid: b.compatibility?.valid ?? null,
      blockers: b.compatibility?.blockers ?? [],
      warnings: b.compatibility?.warnings ?? [],
    })),

    hasBlockers: buildData.some(
      (b) => b.compatibility?.valid === false
    ),
  }

  const bestForGaming =
    buildData
      .filter((b) => b.useCases.includes("gaming"))
      .sort((a, b) => {
        const aVram =
          builds.find((x) => x._id.toString() === a._id.toString())
            ?.parts?.gpu?.specs?.vram ?? 0

        const bVram =
          builds.find((x) => x._id.toString() === b._id.toString())
            ?.parts?.gpu?.specs?.vram ?? 0

        return bVram - aVram
      })[0]?.title ?? null

  const bestForBudget = sorted[0].title
  const bestForPerformance = sorted[sorted.length - 1].title

  const bestForUpgrade =
    buildData
      .filter((b) => b.upgradeFlexibility === "good")
      .sort(
        (a, b) =>
          (b.psuHeadroom?.headroomPercent ?? 0) -
          (a.psuHeadroom?.headroomPercent ?? 0)
      )[0]?.title ??
    buildData.sort(
      (a, b) =>
        (b.psuHeadroom?.headroomPercent ?? 0) -
        (a.psuHeadroom?.headroomPercent ?? 0)
    )[0]?.title ??
    null

  const insights = {
    bestForGaming,
    bestForBudget,
    bestForPerformance,
    bestForUpgrade,

    useCaseMap: buildData.map((b) => ({
      title: b.title,
      useCases: b.useCases,
    })),

    upgradeFlexibilityMap: buildData.map((b) => ({
      title: b.title,
      upgradeFlexibility: b.upgradeFlexibility,
    })),
  }

  const summary = buildSummary(
    buildData,
    priceComparison,
    insights
  )

  return {
    builds: buildData,
    priceComparison,
    componentComparison,
    compatibility: compatibilityComparison,
    insights,
    summary,
  }
}

// ─── Main Service ─────────────────────────────────────────────────────────────

export const compareBuilds = async (userId, buildIds) => {
  if (!buildIds || !Array.isArray(buildIds) || buildIds.length < 2) {
    throw new AppError("Provide at least 2 build IDs to compare", 400);
  }
  if (buildIds.length > 4) {
    throw new AppError("Maximum 4 builds can be compared at once", 400);
  }
  for (const id of buildIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid build ID: ${id}`, 400);
    }
  }

  const builds = await Build.find({ _id: { $in: buildIds } }).populate([
    { path: "parts.cpu" },
    { path: "parts.gpu" },
    { path: "parts.ram" },
    { path: "parts.motherboard" },
    { path: "parts.storage" },
    { path: "parts.psu" },
    { path: "parts.cabinet" },
    { path: "parts.cooling" },
  ]);

  if (builds.length !== buildIds.length) {
    throw new AppError("One or more build IDs not found", 404);
  }

  for (const build of builds) {
    if (build.user.toString() !== userId) {
      throw new AppError("You do not have access to one or more of these builds", 403);
    }
  }

  // ── Per-build data ──────────────────────────────────────────────────────────

  const buildData = builds.map((build) => {
    const parts = build.parts ?? {};

    const allComponents = [
      parts.cpu, parts.gpu, parts.ram, parts.motherboard,
      parts.psu, parts.cabinet, parts.cooling,
      ...(Array.isArray(parts.storage) ? parts.storage : []),
    ].filter(Boolean);

    const compatibility =
      allComponents.length >= 2
        ? checkBuildCompatibility(allComponents)
        : build.compatibilityResult ?? null;

    return {
      _id: build._id,
      title: build.title,
      journeyStatus: build.journeyStatus,
      isFavorite: build.isFavorite,
      isDreamBuild: build.isDreamBuild,
      totalEstimatedPrice: build.totalEstimatedPrice,
      currency: build.currency,
      compatibility,
      useCases: inferUseCases(build),
      upgradeFlexibility: upgradeFlexibility(build),
      psuHeadroom: getPsuHeadroom(build),
    };
  });

  // ── Price comparison ────────────────────────────────────────────────────────

  const sorted = [...buildData].sort((a, b) => a.totalEstimatedPrice - b.totalEstimatedPrice);
  const priceComparison = {
    cheapest: { title: sorted[0].title, price: sorted[0].totalEstimatedPrice },
    mostExpensive: { title: sorted[sorted.length - 1].title, price: sorted[sorted.length - 1].totalEstimatedPrice },
    priceDifference: sorted[sorted.length - 1].totalEstimatedPrice - sorted[0].totalEstimatedPrice,
    breakdown: buildData.map((b) => ({ title: b.title, totalEstimatedPrice: b.totalEstimatedPrice, currency: b.currency })),
  };

  // ── Component comparison ────────────────────────────────────────────────────

  const componentComparison = {};
  for (const slot of SINGLE_SLOTS) {
    componentComparison[slot] = builds.map((build) => ({
      buildTitle: build.title,
      component: slotSummary(build.parts?.[slot], slot),
    }));
  }

  componentComparison.storage = builds.map((build) => ({
    buildTitle: build.title,
    components: Array.isArray(build.parts?.storage)
      ? build.parts.storage.map((s) => slotSummary(s, "storage"))
      : [],
  }));

  // ── Compatibility summary ───────────────────────────────────────────────────

  const compatibilityComparison = {
    results: buildData.map((b) => ({
      title: b.title,
      valid: b.compatibility?.valid ?? null,
      blockers: b.compatibility?.blockers ?? [],
      warnings: b.compatibility?.warnings ?? [],
    })),
    hasBlockers: buildData.some((b) => b.compatibility?.valid === false),
  };

  // ── Insights ────────────────────────────────────────────────────────────────

  const bestForGaming = buildData
    .filter((b) => b.useCases.includes("gaming"))
    .sort((a, b) => {
      const aVram = builds.find((x) => x._id.toString() === a._id.toString())?.parts?.gpu?.specs?.vram ?? 0;
      const bVram = builds.find((x) => x._id.toString() === b._id.toString())?.parts?.gpu?.specs?.vram ?? 0;
      return bVram - aVram;
    })[0]?.title ?? null;

  const bestForBudget = sorted[0].title;

  const bestForPerformance = sorted[sorted.length - 1].title;

  const bestForUpgrade = buildData
    .filter((b) => b.upgradeFlexibility === "good")
    .sort((a, b) => (b.psuHeadroom?.headroomPercent ?? 0) - (a.psuHeadroom?.headroomPercent ?? 0))[0]?.title
    ?? buildData.sort((a, b) => (b.psuHeadroom?.headroomPercent ?? 0) - (a.psuHeadroom?.headroomPercent ?? 0))[0]?.title
    ?? null;

  const insights = {
    bestForGaming,
    bestForBudget,
    bestForPerformance,
    bestForUpgrade,
    useCaseMap: buildData.map((b) => ({ title: b.title, useCases: b.useCases })),
    upgradeFlexibilityMap: buildData.map((b) => ({ title: b.title, upgradeFlexibility: b.upgradeFlexibility })),
  };

  const summary = buildSummary(buildData, priceComparison, insights);

  return {
    builds: buildData,
    priceComparison,
    componentComparison,
    compatibility: compatibilityComparison,
    insights,
    summary,
  };
};
export const compareFeaturedBuilds = async (buildIds) => {
  if (!buildIds || !Array.isArray(buildIds) || buildIds.length < 2) {
    throw new AppError(
      "Provide at least 2 featured build IDs to compare",
      400
    )
  }

  if (buildIds.length > 4) {
    throw new AppError(
      "Maximum 4 featured builds can be compared at once",
      400
    )
  }

  for (const id of buildIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid build ID: ${id}`, 400)
    }
  }

  const builds = await Build.find({
    _id: { $in: buildIds },
    isFeatured: true,
  }).populate([
    { path: "parts.cpu" },
    { path: "parts.gpu" },
    { path: "parts.ram" },
    { path: "parts.motherboard" },
    { path: "parts.storage" },
    { path: "parts.psu" },
    { path: "parts.cabinet" },
    { path: "parts.cooling" },
  ])

  if (builds.length !== buildIds.length) {
    throw new AppError(
      "One or more builds are not public featured builds",
      403
    )
  }

  return buildComparisonResponse(builds)
}

export const compareHybridBuilds = async (
  buildIds,
  userId
) => {
  if (!buildIds || !Array.isArray(buildIds) || buildIds.length < 2) {
    throw new AppError(
      "Provide at least 2 build IDs to compare",
      400
    )
  }

  if (buildIds.length > 4) {
    throw new AppError(
      "Maximum 4 builds can be compared at once",
      400
    )
  }

  for (const id of buildIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(`Invalid build ID: ${id}`, 400)
    }
  }

  const builds = await Build.find({
    _id: { $in: buildIds },
  }).populate([
    { path: "parts.cpu" },
    { path: "parts.gpu" },
    { path: "parts.ram" },
    { path: "parts.motherboard" },
    { path: "parts.storage" },
    { path: "parts.psu" },
    { path: "parts.cabinet" },
    { path: "parts.cooling" },
  ])

  if (builds.length !== buildIds.length) {
    throw new AppError(
      "One or more builds were not found",
      404
    )
  }

  for (const build of builds) {
    const isPublic = build.isFeatured === true

    const isOwner =
      build.user?.toString() === userId.toString()

    if (!isPublic && !isOwner) {
      throw new AppError(
        "You are not allowed to compare one or more selected builds",
        403
      )
    }
  }

  return buildComparisonResponse(builds)
}