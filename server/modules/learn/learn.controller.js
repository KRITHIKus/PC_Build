import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/apiResponse.js";
import {
  createArticle,
  getAllArticles,
  getArticlesByCategory,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
} from "./learn.service.js";

export const create = asyncHandler(async (req, res) => {
  const article = await createArticle(req.body);
  sendSuccess(res, 201, "Article created", article);
});

export const getAll = asyncHandler(async (req, res) => {
  const { articles, meta } = await getAllArticles(req.query);
  sendSuccess(res, 200, "Articles fetched", articles, meta);
});

export const getByCategory = asyncHandler(async (req, res) => {
  const { articles, meta } = await getArticlesByCategory(req.params.category, req.query);
  sendSuccess(res, 200, "Articles fetched", articles, meta);
});

export const getBySlug = asyncHandler(async (req, res) => {
  const article = await getArticleBySlug(req.params.slug);
  sendSuccess(res, 200, "Article fetched", article);
});

export const update = asyncHandler(async (req, res) => {
  const article = await updateArticle(req.params.id, req.body);
  sendSuccess(res, 200, "Article updated", article);
});

export const remove = asyncHandler(async (req, res) => {
  await deleteArticle(req.params.id);
  sendSuccess(res, 200, "Article deleted");
});