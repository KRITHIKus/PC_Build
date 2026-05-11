import mongoose from "mongoose";

const COMPONENT_TYPES = [
  "CPU",
  "GPU",
  "RAM",
  "Motherboard",
  "Storage",
  "PSU",
  "Cabinet",
  "Cooling",
];

const componentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: COMPONENT_TYPES,
      required: [true, "Component type is required"],
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },

    // ✅ IMPORTANT: keep but FIX it
    estimatedPrice: {
      type: Number,
      default: 0, // 🔥 allows creation without price
      min: [0, "Price cannot be negative"],
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    compatibility: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

componentSchema.index({ type: 1 });
componentSchema.index({ brand: 1 });
componentSchema.index({ estimatedPrice: 1 }); // keep this (useful for sorting)
componentSchema.index({ name: "text", model: "text", brand: "text" });

export const VALID_COMPONENT_TYPES = COMPONENT_TYPES;

const Component = mongoose.model("Component", componentSchema);

export default Component;