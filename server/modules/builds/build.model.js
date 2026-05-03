import mongoose from "mongoose";

const JOURNEY_STATUSES = ["planning", "in-progress", "completed", "on-hold"];
const BUILD_SOURCES = ["manual", "scratch", "recommendation"];

const partsSchema = new mongoose.Schema(
  {
    cpu: { type: mongoose.Schema.Types.ObjectId, ref: "Component", default: null },
    gpu: { type: mongoose.Schema.Types.ObjectId, ref: "Component", default: null },
    ram: { type: mongoose.Schema.Types.ObjectId, ref: "Component", default: null },
    motherboard: { type: mongoose.Schema.Types.ObjectId, ref: "Component", default: null },
    storage: [{ type: mongoose.Schema.Types.ObjectId, ref: "Component" }],
    psu: { type: mongoose.Schema.Types.ObjectId, ref: "Component", default: null },
    cabinet: { type: mongoose.Schema.Types.ObjectId, ref: "Component", default: null },
    cooling: { type: mongoose.Schema.Types.ObjectId, ref: "Component", default: null },
  },
  { _id: false }
);

const buildSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Build must belong to a user"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Build title is required"],
      trim: true,
      maxlength: [100, "Title must not exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    parts: {
      type: partsSchema,
      default: () => ({ storage: [] }),
    },
    totalEstimatedPrice: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    source: {
      type: String,
      enum: BUILD_SOURCES,
      default: "manual",
    },
    journeyStatus: {
      type: String,
      enum: JOURNEY_STATUSES,
      default: "planning",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isDreamBuild: {
      type: Boolean,
      default: false,
    },
    compatibilityResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
     isFeatured:{
      type:Boolean,
      default:false,
      index:true
    }
  },
  { timestamps: true }
);

buildSchema.index({ user: 1, createdAt: -1 });

export const VALID_JOURNEY_STATUSES = JOURNEY_STATUSES;

const Build = mongoose.model("Build", buildSchema);

export default Build;