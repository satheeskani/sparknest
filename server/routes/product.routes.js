import express from "express";
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Public
router.get("/",          getProducts);
router.get("/featured",  getFeaturedProducts);
router.get("/:slug",     getProductBySlug);

// Admin — wrap with upload.single("image") so Cloudinary handles the file
// Add your auth middleware here when ready: router.post("/", authMiddleware, upload.single("image"), createProduct)
router.post("/",         upload.single("image"), createProduct);
router.patch("/:id",     upload.single("image"), updateProduct);
router.delete("/:id",    deleteProduct);

export default router;
