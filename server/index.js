import express    from "express";
import cors       from "cors";
import helmet     from "helmet";
import morgan     from "morgan";
import dotenv     from "dotenv";
import rateLimit      from "express-rate-limit";
import mongoSanitize  from "express-mongo-sanitize";
import { connectDB }    from "./config/db.js";
import productRoutes    from "./routes/product.routes.js";
import orderRoutes      from "./routes/order.routes.js";
import authRoutes       from "./routes/auth.routes.js";
import adminRoutes      from "./routes/admin.routes.js";
import couponRoutes     from "./routes/coupon.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet());

// ── Trust proxy (needed for correct IP on Render) ─────────────────────────────
app.set("trust proxy", 1);

// ── Global rate limit — 120 req / 15 min per IP ──────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ success:false, message:"Too many requests, slow down." }),
}));

// ── Tighter limit on auth routes (login/register) ─────────────────────────────
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 login attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ success:false, message:"Too many auth attempts. Try again later." }),
});

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin.startsWith("http://localhost")) return cb(null, true);
    if (origin.endsWith(".vercel.app")) return cb(null, true);
    if (origin.endsWith("sparknest.co.in")) return cb(null, true); // covers www + non-www
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));        // reject huge payloads
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ── MongoDB injection protection ──────────────────────────────────────────────
// Strips $ and . from user input to prevent NoSQL injection attacks
// e.g. { "phone": { "$gt": "" } } → stripped to safe value
app.use(mongoSanitize({
  replaceWith: "_",          // replace $ and . with _ instead of removing
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  Sanitized key "${key}" from ${req.ip}`);
  },
}));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/auth",     authLimit, authRoutes);
app.use("/api/admin",    adminRoutes);
app.use("/api/coupons",  couponRoutes);

// ── Health / keep-alive ───────────────────────────────────────────────────────
app.get("/api/ping", (_req, res) => {
  res.json({ success: true, message: "pong 🏓", ts: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({ success: true, message: "🎆 SparkNest API is running!" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SparkNest server running on port ${PORT}`);
});
