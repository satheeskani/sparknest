import express from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/", protect, (req, res) => res.json({ message: "Get cart - coming soon" }));
router.post("/add", protect, (req, res) => res.json({ message: "Add to cart - coming soon" }));
router.delete("/remove/:id", protect, (req, res) => res.json({ message: "Remove from cart - coming soon" }));

export default router;