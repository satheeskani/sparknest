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
import Category from "../models/Category.model.js";

const router = express.Router();

// ── Public ────────────────────────────────────────────────────────────────────
router.get("/",         getProducts);
router.get("/featured", getFeaturedProducts);

// Public categories endpoint — used on home page
router.get("/categories/public", async (req, res) => {
  try {
    const [cats, stats] = await Promise.all([
      Category.find().sort({ order: 1, name: 1 }),
      (await import("../models/Product.model.js")).default.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),
    ]);
    const statsMap = {};
    stats.forEach(s => { statsMap[s._id] = s.count; });
    const categories = cats.map(c => ({
      _id:   c._id,
      name:  c.name,
      image: c.image || "",
      color: c.color || "#FF6B00",
      bg:    c.bg    || "#FFE0CC",
      order: c.order || 0,
      count: statsMap[c.name] || 0,
    }));
    res.json({ success: true, categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get("/:slug",    getProductBySlug);

// ── Admin only ────────────────────────────────────────────────────────────────
router.post("/upload-image", protect, adminOnly, upload.single("image"), uploadImage);
router.post("/",             protect, adminOnly, createProduct);
router.patch("/:id",         protect, adminOnly, updateProduct);
router.delete("/:id",        protect, adminOnly, deleteProduct);

export default router;
