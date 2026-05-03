import Learn from "./learn.model.js";
import { AppError } from "../../utils/appError.js";
import { paginate, paginateMeta } from "../../utils/pagination.js";

const generateSlug = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const ensureUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Learn.findOne(query);
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const createArticle = async (data) => {
  const { title, category, difficulty, content, summary, coverImageUrl, isPublished, tags, slug: customSlug } = data;

  const baseSlug = customSlug ? generateSlug(customSlug) : generateSlug(title);
  const slug = await ensureUniqueSlug(baseSlug);

  const article = await Learn.create({
    title: title.trim(),
    slug,
    category,
    difficulty: difficulty ?? "beginner",
    content: content.trim(),
    summary: summary?.trim() ?? null,
    coverImageUrl: coverImageUrl ?? null,
    isPublished: isPublished ?? false,
    tags: tags ?? [],
  });

  return article;
};

export const getAllArticles = async (query) => {
  const { page, limit, skip } = paginate(query);

  const filter = {};

  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === "true";
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.tag) filter.tags = query.tag;
  if (query.search) filter.$text = { $search: query.search };

  const [articles, total] = await Promise.all([
    Learn.find(filter)
      .select("-content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Learn.countDocuments(filter),
  ]);

  return { articles, meta: paginateMeta(total, page, limit) };
};

export const getArticlesByCategory = async (category, query) => {
  const { page, limit, skip } = paginate(query);

  const filter = { category };
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === "true";

  const [articles, total] = await Promise.all([
    Learn.find(filter)
      .select("-content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Learn.countDocuments(filter),
  ]);

  return { articles, meta: paginateMeta(total, page, limit) };
};

export const getArticleBySlug = async (slug) => {
  const article = await Learn.findOne({ slug: slug.toLowerCase() });
  if (!article) throw new AppError("Article not found", 404);
  return article;
};

export const getArticleById = async (id) => {
  const article = await Learn.findById(id);
  if (!article) throw new AppError("Article not found", 404);
  return article;
};

export const updateArticle = async (id, data) => {
  const ALLOWED = [
    "title", "category", "difficulty", "content",
    "summary", "coverImageUrl", "isPublished", "tags",
  ];

  const updates = {};
  for (const key of ALLOWED) {
    if (data[key] !== undefined) {
      updates[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
    }
  }

  if (data.title && !data.slug) {
    const baseSlug = generateSlug(data.title);
    updates.slug = await ensureUniqueSlug(baseSlug, id);
  }

  const article = await Learn.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!article) throw new AppError("Article not found", 404);
  return article;
};

export const deleteArticle = async (id) => {
  const article = await Learn.findByIdAndDelete(id);
  if (!article) throw new AppError("Article not found", 404);
};