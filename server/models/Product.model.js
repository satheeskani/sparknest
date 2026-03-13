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
    image:         { type: String, required: true },
    stock:         { type: Number, required: true, default: 0 },
    isFeatured:    { type: Boolean, default: false },
    isSafeForKids: { type: Boolean, default: false },
    rating:        { type: Number, default: 0 },
    numReviews:    { type: Number, default: 0 },
    tags:          [{ type: String }],
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
productSchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.model("Product", productSchema);
