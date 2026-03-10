import express from "express";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", protect, (req, res) => res.json({ message: "Place order - coming soon" }));
router.get("/my", protect, (req, res) => res.json({ message: "My orders - coming soon" }));
router.get("/", protect, adminOnly, (req, res) => res.json({ message: "All orders - coming soon" }));
router.put("/:id/status", protect, adminOnly, (req, res) => res.json({ message: "Update status - coming soon" }));

export default router;