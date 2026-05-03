import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    component: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Component",
      required: [true, "Component reference is required"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
      uppercase: true,
      trim: true,
      default: "INR",
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      default: "India",
    },
    region: {
      type: String,
      trim: true,
      default: null,
    },
    sourceName: {
      type: String,
      required: [true, "Source or store name is required"],
      trim: true,
    },
    sourceUrl: {
      type: String,
      default: null,
    },
    checkedAt: {
      type: Date,
      required: [true, "checkedAt date is required"],
      default: Date.now,
    },
    disclaimer: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

pricingSchema.index({ component: 1, checkedAt: -1 });
pricingSchema.index({ component: 1, country: 1, checkedAt: -1 });

const Pricing = mongoose.model("Pricing", pricingSchema);

export default Pricing;