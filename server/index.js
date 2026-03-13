import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes   from "./routes/order.routes.js";
import authRoutes    from "./routes/auth.routes.js";
import adminRoutes   from "./routes/admin.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin.startsWith("http://localhost")) return cb(null, true);
    if (origin.endsWith(".vercel.app")) return cb(null, true);
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/admin",    adminRoutes);

// ── Health / keep-alive ────────────────────────────────────────────────────
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
