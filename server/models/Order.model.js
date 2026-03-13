import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name:    { type: String, required: true },
      phone:   { type: String, required: true },
      email:   { type: String, default: "" },
      address: { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name:      { type: String, required: true },
        image:     { type: String },
        price:     { type: Number, required: true },
        originalPrice: { type: Number },
        quantity:  { type: Number, required: true, default: 1 },
        category:  { type: String },
      },
    ],
    pricing: {
      itemTotal:  { type: Number, required: true },
      discount:   { type: Number, default: 0 },
      shipping:   { type: Number, default: 0 },
      grandTotal: { type: Number, required: true },
    },
    paymentMethod: { type: String, enum: ["UPI", "Bank Transfer"], default: "UPI" },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Screenshot Received", "Confirmed", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
