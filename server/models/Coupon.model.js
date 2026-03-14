import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code:        { type: String, required: true, unique: true, uppercase: true, trim: true },
    type:        { type: String, enum: ["percentage", "fixed"], required: true },
    value:       { type: Number, required: true },        // % or ₹ amount
    minOrder:    { type: Number, default: 0 },            // minimum order total
    maxUses:     { type: Number, default: 100 },          // max times usable
    usedCount:   { type: Number, default: 0 },            // times used so far
    isActive:    { type: Boolean, default: true },
    expiresAt:   { type: Date, default: null },           // null = never expires
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
