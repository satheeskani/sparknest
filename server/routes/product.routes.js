import express from "express";
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",         getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug",    getProductBySlug);

// ── Admin only ────────────────────────────────────────────────────────────────
router.post("/upload-image", protect, adminOnly, upload.single("image"), uploadImage);
router.post("/",             protect, adminOnly, createProduct);
router.patch("/:id",         protect, adminOnly, updateProduct);
router.delete("/:id",        protect, adminOnly, deleteProduct);

export default router;
