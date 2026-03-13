import Order from "../models/Order.model.js";

// POST /api/orders  — create order (called on Confirm Order)
export const createOrder = async (req, res) => {
  try {
    const { orderId, customer, items, pricing } = req.body;

    if (!orderId || !customer || !items?.length || !pricing) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Basic validation
    const { name, phone, address, city, state, pincode } = customer;
    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: "Incomplete customer details" });
    }

    const order = await Order.create({ orderId, customer, items, pricing });

    res.status(201).json({ success: true, order });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Order ID already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:orderId  — get single order by orderId string
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders  — admin: list all orders
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

// PATCH /api/orders/:orderId/status  — admin: update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
