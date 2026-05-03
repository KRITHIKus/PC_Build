import mongoose from "mongoose";

const TOPICS = [
  "cpu-history", "gpu-history", "ram-history", "storage-history",
  "motherboard-history", "cooling-history", "cabinet-history",
  "pc-evolution", "desktop-culture", "custom-building-history",
];

const ERAS = [
  "early-computing", "1980s", "1990s", "2000s", "2010s", "modern-era",
];

const historySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title must not exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      enum: TOPICS,
    },
    era: {
      type: String,
      required: [true, "Era is required"],
      enum: ERAS,
    },
    timelineOrder: {
      type: Number,
      required: [true, "Timeline order is required"],
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [500, "Summary must not exceed 500 characters"],
      default: null,
    },
    content: {
      type: String,
      required: [true, "Content body is required"],
    },
    coverImageUrl: {
      type: String,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

historySchema.index({ slug: 1 });
historySchema.index({ topic: 1, timelineOrder: 1 });
historySchema.index({ era: 1, timelineOrder: 1 });
historySchema.index({ isPublished: 1, timelineOrder: 1 });
historySchema.index({ title: "text", summary: "text" });

export const VALID_TOPICS = TOPICS;
export const VALID_ERAS = ERAS;

const History = mongoose.model("History", historySchema);

export default History;