import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Security
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true }));

// CORS — allow all Vercel deployments (production + previews) + localhost
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

// ── Health / keep-alive ────────────────────────────────────────────────────
// cron-job.org pings GET https://sparknest-kaml.onrender.com/api/ping every 5 min
// to prevent Render's free-tier spin-down.
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
