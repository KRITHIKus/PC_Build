import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  createBuild,
  createScratchBuild,
  getMyBuilds,
  getBuildById,
  updateBuildMeta,
  updateBuildParts,
  renameBuild,
  toggleFavorite,
  updateJourneyStatus,
  duplicateBuild,
  deleteBuild,
  getFeaturedBuilds,
getFeaturedBuildById,
} from "./build.service.js";

export const create = asyncHandler(async (req, res) => {
  const build = await createBuild(req.user.id, req.body);
  sendSuccess(res, 201, "Build created", build);
});

export const createScratch = asyncHandler(async (req, res) => {
  const build = await createScratchBuild(req.user.id, req.body);
  sendSuccess(res, 201, "Scratch build created", build);
});

export const getAll = asyncHandler(async (req, res) => {
  const { builds, meta } = await getMyBuilds(req.user.id, req.query);
  sendSuccess(res, 200, "Builds fetched", builds, meta);
});

export const getOne = asyncHandler(async (req, res) => {
  const build = await getBuildById(req.user.id, req.params.id);
  sendSuccess(res, 200, "Build fetched", build);
});

export const updateMeta = asyncHandler(async (req, res) => {
  const build = await updateBuildMeta(req.user.id, req.params.id, req.body);
  sendSuccess(res, 200, "Build updated", build);
});

export const updateParts = asyncHandler(async (req, res) => {
  const build = await updateBuildParts(req.user.id, req.params.id, req.body.parts);
  sendSuccess(res, 200, "Build parts updated", build);
});

export const rename = asyncHandler(async (req, res) => {
  const build = await renameBuild(req.user.id, req.params.id, req.body.title);
  sendSuccess(res, 200, "Build renamed", build);
});

export const favorite = asyncHandler(async (req, res) => {
  const { isFavorite, isDreamBuild } = req.body;
  const build = await toggleFavorite(req.user.id, req.params.id, { isFavorite, isDreamBuild });
  sendSuccess(res, 200, "Build updated", build);
});

export const journeyStatus = asyncHandler(async (req, res) => {
  const build = await updateJourneyStatus(req.user.id, req.params.id, req.body.journeyStatus);
  sendSuccess(res, 200, "Journey status updated", build);
});

export const duplicate = asyncHandler(async (req, res) => {
  const build = await duplicateBuild(req.user.id, req.params.id);
  sendSuccess(res, 201, "Build duplicated", build);
});

export const remove = asyncHandler(async (req, res) => {
  await deleteBuild(req.user.id, req.params.id);
  sendSuccess(res, 200, "Build deleted");
});

export const getFeatured = asyncHandler(async (req, res) => {
  const { builds, meta } = await getFeaturedBuilds(req.query);
  sendSuccess(res, 200, "Featured builds fetched", builds, meta);
});

export const getFeaturedOne = asyncHandler(async (req, res) => {
  const build = await getFeaturedBuildById(req.params.id);
  sendSuccess(res, 200, "Featured build fetched", build);
});