import express from "express";
import { getProducts, getProductBySlug, getFeaturedProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/",          getProducts);
router.get("/featured",  getFeaturedProducts);
router.get("/:slug",     getProductBySlug);

export default router;
