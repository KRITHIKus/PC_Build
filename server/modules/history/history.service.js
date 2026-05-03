import History from "./history.model.js";
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
    const existing = await History.findOne(query);
    if (!existing) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const createEntry = async (data) => {
  const { title, topic, era, timelineOrder, content, summary, coverImageUrl, isPublished, tags, slug: customSlug } = data;

  const baseSlug = customSlug ? generateSlug(customSlug) : generateSlug(title);
  const slug = await ensureUniqueSlug(baseSlug);

  const entry = await History.create({
    title: title.trim(),
    slug,
    topic,
    era,
    timelineOrder,
    content: content.trim(),
    summary: summary?.trim() ?? null,
    coverImageUrl: coverImageUrl ?? null,
    isPublished: isPublished ?? false,
    tags: tags ?? [],
  });

  return entry;
};

export const getAllEntries = async (query) => {
  const { page, limit, skip } = paginate(query);

  const filter = {};
  if (query.topic) filter.topic = query.topic;
  if (query.era) filter.era = query.era;
  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === "true";
  if (query.tag) filter.tags = query.tag;
  if (query.search) filter.$text = { $search: query.search };

  const [entries, total] = await Promise.all([
    History.find(filter)
      .select("-content")
      .sort({ timelineOrder: 1 })
      .skip(skip)
      .limit(limit),
    History.countDocuments(filter),
  ]);

  return { entries, meta: paginateMeta(total, page, limit) };
};

export const getEntryBySlug = async (slug) => {
  const entry = await History.findOne({ slug: slug.toLowerCase() });
  if (!entry) throw new AppError("History entry not found", 404);
  return entry;
};

export const getEntryById = async (id) => {
  const entry = await History.findById(id);
  if (!entry) throw new AppError("History entry not found", 404);
  return entry;
};

export const updateEntry = async (id, data) => {
  const ALLOWED = [
    "title", "topic", "era", "timelineOrder", "content",
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

  const entry = await History.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!entry) throw new AppError("History entry not found", 404);
  return entry;
};

export const deleteEntry = async (id) => {
  const entry = await History.findByIdAndDelete(id);
  if (!entry) throw new AppError("History entry not found", 404);
};