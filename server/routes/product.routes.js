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

const router = express.Router();

// Public
router.get("/",          getProducts);
router.get("/featured",  getFeaturedProducts);
router.get("/:slug",     getProductBySlug);

// Image-only upload — returns Cloudinary URL
// POST /api/products/upload-image  (multipart, field "image")
router.post("/upload-image", upload.single("image"), uploadImage);

// Admin CRUD
// POST   — JSON body with image URL already uploaded
// PATCH  — JSON body, optional new image URL
router.post("/",      createProduct);
router.patch("/:id",  updateProduct);
router.delete("/:id", deleteProduct);

export default router;
