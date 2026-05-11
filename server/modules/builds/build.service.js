import Build from "./build.model.js";
import Component from "../components/component.model.js";
import { AppError } from "../../utils/appError.js";
import { paginate, paginateMeta } from "../../utils/pagination.js";
import { checkBuildCompatibility } from "../compatibility/compatibility.service.js";

const SINGLE_PART_SLOTS = ["cpu", "gpu", "ram", "motherboard", "psu", "cabinet", "cooling"];

const assertOwner = (build, userId) => {
  if (!build) throw new AppError("Build not found", 404);
  if (build.user.toString() !== userId) throw new AppError("Access denied", 403);
};

const collectComponentIds = (parts = {}) => {
  const ids = [];
  for (const slot of SINGLE_PART_SLOTS) {
    if (parts[slot]) ids.push(parts[slot].toString());
  }
  if (Array.isArray(parts.storage)) {
    for (const id of parts.storage) ids.push(id.toString());
  }
  return ids;
};

const calculateTotalPrice = (components = []) =>
  components.reduce((sum, c) => sum + (c?.estimatedPrice ?? 0), 0);

const runCompatibility = async (parts = {}) => {
  const ids = collectComponentIds(parts);
  if (ids.length < 2) return null;
  const components = await Component.find({ _id: { $in: ids } });
  return checkBuildCompatibility(components);
};

const populateBuild = (build) =>
  build.populate([
    { path: "parts.cpu" },
    { path: "parts.gpu" },
    { path: "parts.ram" },
    { path: "parts.motherboard" },
    { path: "parts.storage" },
    { path: "parts.psu" },
    { path: "parts.cabinet" },
    { path: "parts.cooling" },
  ]);

// services/build.service.js

export const enrichBuildWithComponents = async (build) => {
  const ids = collectComponentIds(build.parts.toObject ? build.parts.toObject() : build.parts);
  const components = ids.length > 0 ? await Component.find({ _id: { $in: ids } }) : [];

  build.totalEstimatedPrice = calculateTotalPrice(components);
  build.currency = components[0]?.currency ?? "INR";
  build.compatibilityResult = components.length >= 2 ? checkBuildCompatibility(components) : null;

  await build.save();
  return populateBuild(build);
};

export const createBuild = async (userId, { title, description, source = "manual", parts }) => {
  let build = await Build.create({
    user: userId,
    title: title.trim(),
    description: description?.trim() ?? null,
    source,
    parts: parts || { storage: [] },
  });

  // NEW: enrich price & compatibility
  build = await enrichBuildWithComponents(build);

  return build;
};

export const createScratchBuild = async (userId, { title, description, parts }) => {
  return createBuild(userId, {
    title,
    description,
    source: "scratch",
    parts,
  });
};



export const getMyBuilds = async (userId, query) => {
  const { page, limit, skip } = paginate(query);

  const filter = { user: userId };
  if (query.journeyStatus) filter.journeyStatus = query.journeyStatus;
  if (query.isFavorite === "true") filter.isFavorite = true;
  if (query.isDreamBuild === "true") filter.isDreamBuild = true;

  const [builds, total] = await Promise.all([
    Build.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("parts.cpu", "name brand estimatedPrice")
      .populate("parts.gpu", "name brand estimatedPrice")
      .populate("parts.motherboard", "name brand estimatedPrice"),
    Build.countDocuments(filter),
  ]);

  return { builds, meta: paginateMeta(total, page, limit) };
};

export const getBuildById = async (userId, buildId) => {
  const build = await Build.findById(buildId);
  assertOwner(build, userId);
  return populateBuild(build);
};

export const updateBuildMeta = async (userId, buildId, updates) => {
  const build = await Build.findById(buildId);
  assertOwner(build, userId);

  const ALLOWED = ["title", "description", "journeyStatus", "isFavorite", "isDreamBuild"];
  for (const key of ALLOWED) {
    if (updates[key] !== undefined) {
      build[key] = typeof updates[key] === "string" ? updates[key].trim() : updates[key];
    }
  }

  await build.save();
  return build;
};

export const updateBuildParts = async (userId, buildId, parts) => {
  const build = await Build.findById(buildId);
  assertOwner(build, userId);

  for (const slot of SINGLE_PART_SLOTS) {
    if (parts[slot] !== undefined) {
      build.parts[slot] = parts[slot] ?? null;
    }
  }
  if (parts.storage !== undefined) {
    build.parts.storage = parts.storage;
  }

  const ids = collectComponentIds(build.parts.toObject ? build.parts.toObject() : build.parts);
  const components = ids.length > 0 ? await Component.find({ _id: { $in: ids } }) : [];

  build.totalEstimatedPrice = calculateTotalPrice(components);
  build.currency = components[0]?.currency ?? "INR";
  build.compatibilityResult = components.length >= 2 ? checkBuildCompatibility(components) : null;

  await build.save();
  return populateBuild(build);
};

export const renameBuild = async (userId, buildId, title) => {
  const build = await Build.findById(buildId);
  assertOwner(build, userId);
  build.title = title.trim();
  await build.save();
  return build;
};

export const toggleFavorite = async (userId, buildId, { isFavorite, isDreamBuild }) => {
  const build = await Build.findById(buildId);
  assertOwner(build, userId);
  if (isFavorite !== undefined) build.isFavorite = isFavorite;
  if (isDreamBuild !== undefined) build.isDreamBuild = isDreamBuild;
  await build.save();
  return build;
};

export const updateJourneyStatus = async (userId, buildId, journeyStatus) => {
  const build = await Build.findById(buildId);
  assertOwner(build, userId);
  build.journeyStatus = journeyStatus;
  await build.save();
  return build;
};

export const duplicateBuild = async (userId, buildId) => {
  const original = await Build.findById(buildId);
  assertOwner(original, userId);

  const copy = await Build.create({
    user: userId,
    title: `${original.title} (Copy)`,
    description: original.description,
    source: original.source,
    journeyStatus: "planning",
    isFavorite: false,
    isDreamBuild: false,
    parts: original.parts.toObject ? original.parts.toObject() : original.parts,
    totalEstimatedPrice: original.totalEstimatedPrice,
    currency: original.currency,
    compatibilityResult: original.compatibilityResult,
  });

  return copy;
};

export const deleteBuild = async (userId, buildId) => {
  const build = await Build.findById(buildId);
  assertOwner(build, userId);
  await build.deleteOne();
};

export const getFeaturedBuilds = async (query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const skip = (page - 1) * limit;

  const filter = { isFeatured: true };

  const [builds, total] = await Promise.all([
    Build.find(filter)
      .populate("parts.cpu", "name brand model type estimatedPrice specs imageUrl")
      .populate("parts.gpu", "name brand model type estimatedPrice specs imageUrl")
      .populate("parts.ram", "name brand model type estimatedPrice specs imageUrl")
      .populate("parts.motherboard", "name brand model type estimatedPrice specs imageUrl")
      .populate("parts.storage", "name brand model type estimatedPrice specs imageUrl")
      .populate("parts.psu", "name brand model type estimatedPrice specs imageUrl")
      .populate("parts.cabinet", "name brand model type estimatedPrice specs imageUrl")
      .populate("parts.cooling", "name brand model type estimatedPrice specs imageUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Build.countDocuments(filter),
  ]);

  return {
    builds,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const getFeaturedBuildById = async (id) => {
  const build = await Build.findOne({ _id: id, isFeatured: true })
    .populate("parts.cpu")
    .populate("parts.gpu")
    .populate("parts.ram")
    .populate("parts.motherboard")
    .populate("parts.storage")
    .populate("parts.psu")
    .populate("parts.cabinet")
    .populate("parts.cooling");

  if (!build) {
    throw new AppError("Featured build not found", 404);
  }

  return build;
};