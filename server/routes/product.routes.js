import express from "express";
import {
  getProducts, getProduct, createProduct,
  updateProduct, deleteProduct, addReview
} from "../controllers/product.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);
router.post("/:id/review", protect, addReview);

export default router;