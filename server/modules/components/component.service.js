import Component from "./component.model.js";
import { AppError } from "../../utils/appError.js";
import { paginate, paginateMeta } from "../../utils/pagination.js";

const ALLOWED_SORT_FIELDS = ["createdAt", "estimatedPrice", "name"];

export const createComponent = async (data) => {
  const component = await Component.create(data);
  return component;
};

export const getAllComponents = async (query) => {
  const { page, limit, skip } = paginate(query);

  const filter = {};

  if (query.type) filter.type = query.type;
  if (query.brand) filter.brand = new RegExp(query.brand, "i");
  if (query.inStock !== undefined) filter.inStock = query.inStock === "true";
  if (query.tag) filter.tags = query.tag;

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.estimatedPrice = {};
    if (query.minPrice !== undefined) filter.estimatedPrice.$gte = Number(query.minPrice);
    if (query.maxPrice !== undefined) filter.estimatedPrice.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  let sortField = "createdAt";
  let sortOrder = -1;

  if (query.sortBy && ALLOWED_SORT_FIELDS.includes(query.sortBy)) {
    sortField = query.sortBy;
  }
  if (query.order === "asc") sortOrder = 1;

  const [components, total] = await Promise.all([
    Component.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit),
    Component.countDocuments(filter),
  ]);

  return { components, meta: paginateMeta(total, page, limit) };
};

export const getComponentById = async (id) => {
  const component = await Component.findById(id);
  if (!component) throw new AppError("Component not found", 404);
  return component;
};

export const updateComponent = async (id, data) => {
  const component = await Component.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!component) throw new AppError("Component not found", 404);
  return component;
};

export const deleteComponent = async (id) => {
  const component = await Component.findByIdAndDelete(id);
  if (!component) throw new AppError("Component not found", 404);
};