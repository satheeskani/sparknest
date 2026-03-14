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
router.patch("/:orderId/status", updateOrderStatus);

export default router;
