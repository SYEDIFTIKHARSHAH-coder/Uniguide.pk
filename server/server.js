import "dotenv/config"; // MUST BE FIRST to load .env before other imports
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";
import rateLimit from "express-rate-limit";

// Route imports
import adminRoutes from "./routes/admin.routes.js";
import universityRoutes from "./routes/university.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import courseRoutes from "./routes/course.routes.js";
import entryTestRoutes from "./routes/entryTest.routes.js";
import guidanceRoutes from "./routes/guidance.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import utilityRoutes from "./routes/utility.routes.js";
import scholarshipRoutes from "./routes/scholarship.routes.js";
import aiAdmissionRoutes from "./routes/aiAdmission.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import { initCronJobs } from "./cron/aiCrawler.cron.js";
import { initExpiryCronJobs } from "./cron/expiryCheck.cron.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Performance Middleware ───────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

import { sanitizeInput } from "./middleware/auth.middleware.js";
app.use(cookieParser());
app.use(sanitizeInput);

const apiLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 10000, 
  message: { success: false, message: 'Too many requests, please try again later.' } 
});
const authLimiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: { success: false, message: 'Too many authentication attempts.' } 
});

app.use("/api/", apiLimiter);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://uniguid-pk.web.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "UniGuid.pk API v1.0 — Built by Syed Iftikhar Shah",
    timestamp: new Date().toISOString(),
    admin: "Syed Iftikhar Shah",
    contact: "ifitkharbusiness100@gmail.com",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "healthy", uptime: process.uptime() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/entry-tests", entryTestRoutes);
app.use("/api/guidance", guidanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/utilities", utilityRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/ai-admissions", aiAdmissionRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 UniGuid.pk Server running on Port ${PORT}`);
  console.log(`👤 Admin: ${process.env.ADMIN_USERNAME}`);
  console.log(`📧 Contact: ifitkharbusiness100@gmail.com`);
  console.log(`📋 Routes registered: admin, universities, applications, courses, entry-tests, guidance, notifications, utilities, ai-admissions\n`);
  
  // Initialize scheduled jobs
  initCronJobs();
  initExpiryCronJobs();
});

export default app;