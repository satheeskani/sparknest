import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    email: { type: String, default: "", lowercase: true, trim: true },

    // All unique addresses this customer has delivered to
    addresses: [
      {
        street:  String,
        city:    String,
        state:   String,
        pincode: String,
      },
    ],

    // Summary stats
    totalOrders:  { type: Number, default: 1 },
    totalSpent:   { type: Number, default: 0 },
    lastOrderAt:  { type: Date,   default: Date.now },
    lastOrderId:  { type: String, default: "" },
  },
  { timestamps: true }
);

// Index for fast lookup by phone or email
customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });

export default mongoose.model("Customer", customerSchema);
