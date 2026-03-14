import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, unique: true, trim: true },
    emoji: { type: String, default: "🎆" },
    color: { type: String, default: "#FF6B00" },
    bg:    { type: String, default: "#FFE0CC" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
