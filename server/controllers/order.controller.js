import Order    from "../models/Order.model.js";
import Customer from "../models/Customer.model.js";
import Counter  from "../models/Counter.model.js";
import Coupon   from "../models/Coupon.model.js";

// POST /api/orders  — create order
export const createOrder = async (req, res) => {
  try {
    const { customer, items, pricing, couponCode } = req.body;

    if (!customer || !items?.length || !pricing) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const { name, phone, email, address, city, state, pincode } = customer;
    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: "Incomplete customer details" });
    }

    // ── 1. Generate sequential order ID ──────────────────────────────────────
    const counter = await Counter.findByIdAndUpdate(
      "orderId",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = `SN${999 + counter.seq}`; // starts at SN1000

    // ── 2. Save order ────────────────────────────────────────────────────────
    const order = await Order.create({ orderId, customer, items, pricing });

    // ── 2. Decrement stock for each ordered item ─────────────────────────────────
    try {
      const Product = (await import("../models/Product.model.js")).default;
      for (const item of items) {
        await Product.findOneAndUpdate(
          { name: item.name, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } }
        );
      }
    } catch (err) { console.error("Stock update failed:", err.message); }

    // ── 3. Increment coupon usage (non-blocking) ────────────────────────────────
    if (couponCode) {
      Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase().trim() },
        { $inc: { usedCount: 1 } }
      ).catch(err => console.error("Coupon update failed:", err));
    }

    // ── 4. Upsert customer record (non-blocking) ─────────────────────────────
    try {
      const grandTotal = pricing?.grandTotal || 0;

      // Find by phone (primary key for guest customers)
      let cust = await Customer.findOne({ phone });

      if (cust) {
        // Update existing customer
        cust.name        = name;           // keep name up to date
        if (email) cust.email = email.toLowerCase();
        cust.totalOrders += 1;
        cust.totalSpent  += grandTotal;
        cust.lastOrderAt  = new Date();
        cust.lastOrderId  = orderId;

        // Add address if not duplicate
        const addrExists = cust.addresses.some(
          a => a.pincode === pincode && a.street === address
        );
        if (!addrExists) {
          cust.addresses.push({ street: address, city, state, pincode });
          if (cust.addresses.length > 10) cust.addresses.shift(); // keep last 10
        }

        await cust.save();
      } else {
        // Create new customer record
        await Customer.create({
          name,
          phone,
          email:       email ? email.toLowerCase() : "",
          addresses:   [{ street: address, city, state, pincode }],
          totalOrders: 1,
          totalSpent:  grandTotal,
          lastOrderAt: new Date(),
          lastOrderId: orderId,
        });
      }
    } catch (custErr) {
      // Non-fatal — order already saved
      console.error("Customer record update failed:", custErr.message);
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Order ID already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:orderId
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders — admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { orderStatus: status } : {};
    const skip   = (Number(page) - 1) * Number(limit);
    const total  = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/orders/:orderId/status — admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (orderStatus)   order.orderStatus   = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
