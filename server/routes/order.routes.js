import express from "express";
import { createOrder, getOrder, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { orderRateLimit, validateOrder, duplicateOrderGuard } from "../middleware/orderProtection.middleware.js";

const router = express.Router();

// POST /api/orders — protected by 3 layers:
// 1. orderRateLimit  — max 5 orders/hour per IP
// 2. validateOrder   — validates all fields, quantities, pricing
// 3. duplicateOrderGuard — blocks same phone+items within 10 minutes
router.post("/", orderRateLimit, validateOrder, duplicateOrderGuard, createOrder);

router.get("/",            getAllOrders);
router.get("/:orderId",    getOrder);
router.patch("/:orderId/status", updateOrderStatus);

export default router;
