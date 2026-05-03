import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
} from "./component.service.js";

export const create = asyncHandler(async (req, res) => {
  const component = await createComponent(req.body);
  sendSuccess(res, 201, "Component created", component);
});

export const getAll = asyncHandler(async (req, res) => {
  const { components, meta } = await getAllComponents(req.query);
  sendSuccess(res, 200, "Components fetched", components, meta);
});

export const getById = asyncHandler(async (req, res) => {
  const component = await getComponentById(req.params.id);
  sendSuccess(res, 200, "Component fetched", component);
});

export const update = asyncHandler(async (req, res) => {
  const component = await updateComponent(req.params.id, req.body);
  sendSuccess(res, 200, "Component updated", component);
});

export const remove = asyncHandler(async (req, res) => {
  await deleteComponent(req.params.id);
  sendSuccess(res, 200, "Component deleted");
});