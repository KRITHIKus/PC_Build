import mongoose from "mongoose";

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

const CATEGORIES = [
  "cpu", "gpu", "ram", "motherboard", "storage", "psu",
  "cooling", "cabinet", "pc-building-basics", "Buying-guidance", "Troubleshooting", "Guide", "Tutorial", "Refrence",
  "Build Tips", "News","Reviews"
];

const learnSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTIES,
      default: "beginner",
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

learnSchema.index({ slug: 1 });
learnSchema.index({ category: 1 });
learnSchema.index({ isPublished: 1, createdAt: -1 });
learnSchema.index({ title: "text", summary: "text" });

export const VALID_DIFFICULTIES = DIFFICULTIES;
export const VALID_CATEGORIES = CATEGORIES;

const Learn = mongoose.model("Learn", learnSchema);

export default Learn;
