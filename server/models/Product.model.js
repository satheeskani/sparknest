import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Sparklers",
        "Ground Chakkar",
        "Rockets",
        "Bombs",
        "Flower Pots",
        "Sky Shots",
        "Combo Packs",
        "Kids Special",
        "Gift Boxes",
      ],
    },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isSafeForKids: { type: Boolean, default: false },
    occasion: [{ type: String }],
    brand: { type: String, default: "Sivakasi" },
    weight: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);