import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    slug:          { type: String, required: true, unique: true, lowercase: true },
    description:   { type: String, required: true },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    category: {
      type: String,
      required: true,
      enum: ["Sparklers","Rockets","Bombs","Flower Pots","Sky Shots","Kids Special","Combo Packs","Gift Boxes"],
    },
    // Cloudinary secure URL (or any fallback URL for legacy/seed data)
    image:          { type: String, required: true },
    // Cloudinary public_id — used to delete the old image when updating/deleting
    // e.g. "sparknest/products/abc123xyz"
    imagePublicId:  { type: String, default: "" },
    stock:          { type: Number, required: true, default: 0 },
    isFeatured:     { type: Boolean, default: false },
    isSafeForKids:  { type: Boolean, default: false },
    rating:         { type: Number, default: 0 },
    numReviews:     { type: Number, default: 0 },
    tags:           [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
