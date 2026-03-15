import Order    from "../models/Order.model.js";
import User     from "../models/User.model.js";
import Product  from "../models/Product.model.js";
import Category from "../models/Category.model.js";
import Customer from "../models/Customer.model.js";

// GET /api/admin/dashboard
export const getDashboard = async (req, res) => {
  try {
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      totalCustomers,
      recentOrders,
      ordersByStatus,
      allOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      Customer.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5),
      Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }]),
      Order.find({ orderStatus: "Delivered" }, "pricing.grandTotal createdAt orderStatus"),
    ]);

    // Only count revenue from Delivered orders — confirmed payment + dispatch
    const totalRevenue = allOrders
      .filter(o => o.pricing?.grandTotal)
      .reduce((sum, o) => sum + o.pricing.grandTotal, 0);

    // Revenue by month (last 6 months)
    const now = new Date();
    const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
      const d     = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString("en-IN", { month: "short" });
      const total = allOrders
        .filter(o => {
          const od = new Date(o.createdAt);
          return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
        })
        .reduce((sum, o) => sum + (o.pricing?.grandTotal || 0), 0);
      return { label, total };
    });

    // Category breakdown
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, totalStock: { $sum: "$stock" } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      stats: { totalOrders, totalUsers, totalProducts, totalRevenue, totalCustomers },
      recentOrders,
      ordersByStatus,
      monthlyRevenue,
      categoryBreakdown,
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] }
      : {};
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter, "-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user","admin"].includes(role))
      return res.status(400).json({ success: false, message: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, select: "-password" });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/admin/orders
export const getAdminOrders = async (req, res) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)        filter.orderStatus   = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) filter.$or = [
      { orderId:           { $regex: search, $options: "i" } },
      { "customer.name":   { $regex: search, $options: "i" } },
      { "customer.phone":  { $regex: search, $options: "i" } },
    ];
    const skip   = (Number(page) - 1) * Number(limit);
    const total  = await Order.countDocuments(filter);
    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PATCH /api/admin/orders/:orderId/status
export const updateAdminOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (orderStatus)   order.orderStatus   = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// GET /api/admin/categories
export const getCategories = async (req, res) => {
  try {
    const [dbCats, productStats] = await Promise.all([
      Category.find().sort({ order: 1, name: 1 }),
      Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 }, totalStock: { $sum: "$stock" }, avgPrice: { $avg: "$price" }, featured: { $sum: { $cond: ["$isFeatured", 1, 0] } }, kidsSafe: { $sum: { $cond: ["$isSafeForKids", 1, 0] } } } },
      ]),
    ]);

    const statsMap = {};
    productStats.forEach(s => { statsMap[s._id] = s; });

    const categories = dbCats.map(c => ({
      _id:        c._id,
      name:       c.name,
      image:      c.image  || "",
      color:      c.color  || "#FF6B00",
      bg:         c.bg     || "#FFE0CC",
      order:      c.order  || 0,
      count:      statsMap[c.name]?.count      || 0,
      totalStock: statsMap[c.name]?.totalStock || 0,
      avgPrice:   statsMap[c.name]?.avgPrice   || 0,
      featured:   statsMap[c.name]?.featured   || 0,
      kidsSafe:   statsMap[c.name]?.kidsSafe   || 0,
    }));

    res.json({ success: true, categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};


// POST /api/admin/categories
export const createCategory = async (req, res) => {
  try {
    const { name, image, color, bg, order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const existing = await Category.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) return res.status(409).json({ success: false, message: "Category already exists" });
    const cat = await Category.create({ name, image: image || "", color, bg, order: order || 0 });
    res.status(201).json({ success: true, category: cat });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PATCH /api/admin/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const { name, image, color, bg, order } = req.body;
    const cat = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, color, bg, order },
      { new: true, runValidators: true }
    );
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, category: cat });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/admin/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
// GET /api/admin/customers
export const getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = search
      ? { $or: [
          { name:  { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ]}
      : {};
    const skip      = (Number(page) - 1) * Number(limit);
    const total     = await Customer.countDocuments(filter);
    const customers = await Customer.find(filter)
      .sort({ lastOrderAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.json({ success: true, customers, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// POST /api/admin/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, addresses } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, message: "Name and phone are required" });
    const existing = await Customer.findOne({ phone });
    if (existing) return res.status(409).json({ success: false, message: "Customer with this phone already exists" });
    const customer = await Customer.create({ name, phone, email: email||"", addresses: addresses||[] });
    res.status(201).json({ success: true, customer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// PATCH /api/admin/customers/:id — also syncs name/phone/email in their orders
export const updateCustomer = async (req, res) => {
  try {
    // Get old phone BEFORE updating
    const existing = await Customer.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Customer not found" });
    const oldPhone = existing.phone;

    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Sync name, phone, email in all matching orders
    const { name, phone, email } = req.body;
    const updateFields = {};
    if (name)  updateFields["customer.name"]  = name;
    if (phone) updateFields["customer.phone"] = phone;
    if (email) updateFields["customer.email"] = email;

    if (Object.keys(updateFields).length > 0) {
      // Match both exact phone and phone with spaces stripped
      const cleanOld = oldPhone.replace(/\D/g, "");
      const result = await Order.updateMany(
        { $or: [
          { "customer.phone": oldPhone },
          { "customer.phone": cleanOld },
        ]},
        { $set: updateFields }
      );
      console.log(`✅ Updated ${result.modifiedCount} orders for customer phone ${oldPhone}`);
    }

    res.json({ success: true, customer });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// DELETE /api/admin/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found" });
    res.json({ success: true, message: "Customer deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
