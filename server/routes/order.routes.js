import express from "express";
import { createOrder, getOrder, getAllOrders, updateOrderStatus } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/",                       createOrder);
router.get("/",                        getAllOrders);       // admin
router.get("/:orderId",                getOrder);
router.patch("/:orderId/status",       updateOrderStatus); // admin

export default router;
