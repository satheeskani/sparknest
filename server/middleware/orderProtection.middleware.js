// ── Layer 1: Lightweight payload sanity check ────────────────────────────────
// Only blocks clearly malicious/malformed requests — not real customers
export const validateOrder = async (req, res, next) => {
  const { customer, items, pricing } = req.body;

  // Must have all top-level fields (orderId now generated server-side)
  if (!customer || !items || !pricing) {
    return res.status(400).json({ success: false, message: "Invalid order payload" });
  }

  // Items must be a non-empty array
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Order must have at least one item" });
  }

  // Hard cap: max 50 items — purely anti-flood, not a real restriction
  if (items.length > 50) {
    return res.status(400).json({ success: false, message: "Too many items in order" });
  }

  // grandTotal must be a positive number
  const { grandTotal } = pricing;
  if (typeof grandTotal !== "number" || grandTotal <= 0) {
    return res.status(400).json({ success: false, message: "Invalid pricing" });
  }

  // Stock validation
  try {
    for (const item of items) {
      const product = await Product.findOne({ name: item.name });
      if (!product) continue;
      if (product.stock <= 0) {
        return res.status(400).json({ success: false, message: `"${item.name}" is out of stock` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Only ${product.stock} units of "${item.name}" available` });
      }
    }
  } catch (err) { console.error("Stock check failed:", err.message); }

  next();
};

// ── Layer 3: Duplicate order guard ────────────────────────────────────────────
// Same phone + same items within 10 minutes = likely duplicate/bot
const recentOrders = new Map();

export const duplicateOrderGuard = (req, res, next) => {
  const phone = req.body?.customer?.phone;
  const items = req.body?.items;
  if (!phone || !items) return next();

  const key      = `${phone}-${items.map(i => `${i.name}:${i.quantity}`).join(",")}`;
  const now      = Date.now();
  const lastTime = recentOrders.get(key);
  const TEN_MIN  = 10 * 60 * 1000;

  if (lastTime && now - lastTime < TEN_MIN) {
    return res.status(429).json({
      success: false,
      message: "Duplicate order detected. If this is intentional, please wait 10 minutes.",
    });
  }

  recentOrders.set(key, now);

  // Clean up old entries to prevent memory leak
  if (recentOrders.size > 1000) {
    for (const [k, t] of recentOrders.entries()) {
      if (now - t > TEN_MIN) recentOrders.delete(k);
    }
  }

  next();
};
