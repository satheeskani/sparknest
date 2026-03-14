import express from "express";
import { createOrder, getOrder, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { validateOrder, duplicateOrderGuard } from "../middleware/orderProtection.middleware.js";

const router = express.Router();

// POST /api/orders — protected by 2 layers:
// 1. validateOrder       — validates payload structure
// 2. duplicateOrderGuard — blocks same phone+items within 10 minutes
router.post("/", validateOrder, duplicateOrderGuard, createOrder);

router.get("/",            getAllOrders);
router.get("/:orderId",    getOrder);

// Public: track order by orderId + phone (for customer tracking page)
router.post("/track", async (req, res) => {
  try {
    const { orderId, phone } = req.body;
    if (!orderId || !phone)
      return res.status(400).json({ success: false, message: "Order ID and phone are required" });

    const order = await (await import("../models/Order.model.js")).default
      .findOne({ orderId: orderId.toUpperCase().trim() });

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found. Please check your Order ID." });

    // Verify phone matches
    if (order.customer?.phone?.replace(/\D/g,"") !== phone.replace(/\D/g,""))
      return res.status(403).json({ success: false, message: "Phone number does not match this order." });

    // Return safe subset — no sensitive payment info
    res.json({
      success: true,
      order: {
        orderId:       order.orderId,
        orderStatus:   order.orderStatus,
        paymentStatus: order.paymentStatus,
        createdAt:     order.createdAt,
        items:         order.items.map(i => ({ name:i.name, quantity:i.quantity, price:i.price })),
        pricing:       order.pricing,
        customer: {
          name:    order.customer.name,
          city:    order.customer.city,
          state:   order.customer.state,
          pincode: order.customer.pincode,
        },
      },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
router.patch("/:orderId/status", updateOrderStatus);

export default router;
