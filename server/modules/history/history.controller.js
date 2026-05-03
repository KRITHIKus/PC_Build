import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  createEntry,
  getAllEntries,
  getEntryBySlug,
  updateEntry,
  deleteEntry,
} from "./history.service.js";

export const create = asyncHandler(async (req, res) => {
  const entry = await createEntry(req.body);
  sendSuccess(res, 201, "History entry created", entry);
});

export const getAll = asyncHandler(async (req, res) => {
  const { entries, meta } = await getAllEntries(req.query);
  sendSuccess(res, 200, "History entries fetched", entries, meta);
});

export const getBySlug = asyncHandler(async (req, res) => {
  const entry = await getEntryBySlug(req.params.slug);
  sendSuccess(res, 200, "History entry fetched", entry);
});

export const update = asyncHandler(async (req, res) => {
  const entry = await updateEntry(req.params.id, req.body);
  sendSuccess(res, 200, "History entry updated", entry);
});

export const remove = asyncHandler(async (req, res) => {
  await deleteEntry(req.params.id);
  sendSuccess(res, 200, "History entry deleted");
});