import express from "express";
import Coupon  from "../models/Coupon.model.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// ── Public: validate coupon at checkout ──────────────────────────────────────
router.post("/validate", async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });

    if (!coupon)
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    if (!coupon.isActive)
      return res.status(400).json({ success: false, message: "This coupon is no longer active" });
    if (coupon.usedCount >= coupon.maxUses)
      return res.status(400).json({ success: false, message: "This coupon has reached its usage limit" });
    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt))
      return res.status(400).json({ success: false, message: "This coupon has expired" });
    if (orderTotal < coupon.minOrder)
      return res.status(400).json({ success: false, message: `Minimum order of ₹${coupon.minOrder} required for this coupon` });

    // Calculate discount
    let discount = coupon.type === "percentage"
      ? Math.round((orderTotal * coupon.value) / 100)
      : coupon.value;

    // Discount can't exceed order total
    discount = Math.min(discount, orderTotal);

    res.json({
      success:     true,
      code:        coupon.code,
      type:        coupon.type,
      value:       coupon.value,
      discount,
      description: coupon.description,
      message:     coupon.type === "percentage"
        ? `${coupon.value}% off applied! You save ₹${discount}`
        : `₹${coupon.value} off applied!`,
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── Admin CRUD ────────────────────────────────────────────────────────────────
router.use(protect, adminOnly);

// GET all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST create coupon
router.post("/", async (req, res) => {
  try {
    const { code, type, value, minOrder, maxUses, expiresAt, description } = req.body;
    if (!code || !type || !value)
      return res.status(400).json({ success: false, message: "Code, type and value are required" });

    const existing = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existing)
      return res.status(409).json({ success: false, message: "Coupon code already exists" });

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      type, value,
      minOrder:    minOrder    || 0,
      maxUses:     maxUses     || 100,
      expiresAt:   expiresAt   || null,
      description: description || "",
    });
    res.status(201).json({ success: true, coupon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// PATCH update coupon
router.patch("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.json({ success: true, coupon });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// DELETE coupon
router.delete("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
    res.json({ success: true, message: "Coupon deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

export default router;
