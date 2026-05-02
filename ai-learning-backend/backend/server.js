import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { initSocket } from "./utils/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { csrfProtect } from "./middleware/csrf.js";
import { runOnboardingEmails } from "./services/onboardingEmailService.js";
import { sendRevisionReminders, sendStudyReminders } from "./services/pushService.js";
import { runWeeklyParentEmails } from "./services/weeklyParentEmailService.js";
import pushRoutes from "./routes/pushRoutes.js";
import logger from "./utils/logger.js";
import { validateEnv } from "./utils/validateEnv.js";
import { connectRedis, isUsingFallback } from "./utils/redisClient.js";

import authRoutes        from "./routes/authRoutes.js";
import { initPassport }  from "./controllers/authController.js";
import practiceRoutes    from "./routes/practiceRoutes.js";
import analysisRoutes    from "./routes/analysisRoutes.js";
import examRoutes        from "./routes/examRoutes.js";
import plannerRoutes     from "./routes/plannerRoutes.js";
import aiRoutes          from "./routes/aiRoutes.js";
import userRoutes        from "./routes/userRoutes.js";
import revisionRoutes    from "./routes/revisionRoutes.js";
import lessonRoutes      from "./routes/lessonRoutes.js";
import topicRoutes       from "./routes/topicRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import adminRoutes       from "./routes/adminRoutes.js";
import badgeRoutes       from "./routes/badgeRoutes.js";
import doubtRoutes       from "./routes/doubtRoutes.js";
import portalRoutes      from "./routes/portalRoutes.js";
import curriculumRoutes  from "./routes/curriculumRoutes.js";
import ncertRoutes       from "./routes/ncertRoutes.js";
import paymentRoutes    from "./routes/paymentRoutes.js";
import webhookRoutes    from "./routes/webhookRoutes.js";
import companyRoutes    from "./routes/companyRoutes.js";
import pyqRoutes        from "./routes/pyqRoutes.js";
import feedbackRoutes   from "./routes/feedbackRoutes.js";

dotenv.config();
validateEnv(); // crash fast if required env vars are missing
initPassport(); // register Google strategy after env vars are loaded

const app    = express();
const server = http.createServer(app);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'"],
      imgSrc:         ["'self'", "data:"],
      connectSrc:     ["'self'"],
      fontSrc:        ["'self'"],
      objectSrc:      ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
}));
app.use(morgan("dev"));
const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Dev convenience: allow common local variants (kept permissive only in non-prod)
if (process.env.NODE_ENV !== "production") {
  frontendOrigins.push("http://127.0.0.1:5173");
  // If you open Vite via LAN IP, the origin will be that IP
  frontendOrigins.push("http://192.168.29.223:5173");
}

const allowedOrigins = Array.from(new Set(frontendOrigins));

app.use(cors({
  origin: (origin, cb) => {
    // Same-origin / server-to-server requests may have no Origin header
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(passport.initialize());

// Webhooks need raw body for signature verification — mount BEFORE express.json()
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => { logger.error("MongoDB connection failed", { err: err.message }); process.exit(1); });

connectRedis();

initSocket(server);

// CSRF: skip safe methods and auth/webhook routes (auth routes issue the token)
app.use((req, res, next) => {
  const safe    = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  const excluded = req.path.startsWith("/api/auth") || req.path.startsWith("/api/webhooks");
  if (safe || excluded) return next();
  return csrfProtect(req, res, next);
});

// REST API routes
app.use("/api/auth",        authRoutes);
app.use("/api/practice",    practiceRoutes);
app.use("/api/analysis",    analysisRoutes);
app.use("/api/exam",        examRoutes);
app.use("/api/planner",     plannerRoutes);
app.use("/api/ai",          aiRoutes);
app.use("/api/user",        userRoutes);
app.use("/api/revision",    revisionRoutes);
app.use("/api/lessons",     lessonRoutes);
app.use("/api/topics",      topicRoutes);
app.use("/api/competition", competitionRoutes);
app.use("/api/admin",       adminRoutes);
app.use("/api/badges",      badgeRoutes);
app.use("/api/doubt",       doubtRoutes);
app.use("/api/portal",      portalRoutes);
app.use("/api/v1/curriculum", curriculumRoutes);
app.use("/api/v1/ncert",      ncertRoutes);
app.use("/api/v1/payment",   paymentRoutes);
app.use("/api/company",     companyRoutes);
app.use("/api/v1/pyq",      pyqRoutes);
app.use("/api/feedback",   feedbackRoutes);
app.use("/api/push",       pushRoutes);

app.get("/api/health", async (_req, res) => {
  const health = { status: "ok", checks: { mongodb: "unknown", redis: "unknown", anthropic: "unknown" } };

  try {
    await mongoose.connection.db.admin().ping();
    health.checks.mongodb = "ok";
  } catch {
    health.checks.mongodb = "error";
    health.status = "degraded";
  }

  health.checks.redis = isUsingFallback() ? "fallback (in-memory)" : "ok";
  health.checks.anthropic = process.env.ANTHROPIC_API_KEY ? "key-set" : "missing";

  res.status(health.status === "ok" ? 200 : 503).json(health);
});
app.use((req, res) => res.status(404).json({ error: `${req.method} ${req.path} not found` }));

// Centralised error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info("Server + WebSocket started", { port: PORT, env: process.env.NODE_ENV || "development" });
  // Onboarding emails: run at startup + every 24 hours
  runOnboardingEmails().catch(() => {});
  setInterval(() => runOnboardingEmails().catch(() => {}), 24 * 60 * 60 * 1000);
  // Revision push notifications: run daily
  sendRevisionReminders().catch(() => {});
  setInterval(() => sendRevisionReminders().catch(() => {}), 24 * 60 * 60 * 1000);
  // Study reminders: check every minute (fires push when parent's HH:MM matches)
  setInterval(() => sendStudyReminders().catch(() => {}), 60 * 1000);
  // Weekly parent digest: run every 7 days (Monday 8am IST is the natural day, but
  // the service skips parents whose email was sent within the last 7 days, so the
  // exact start time doesn't matter — it fires daily and is idempotent).
  runWeeklyParentEmails().catch(() => {});
  setInterval(() => runWeeklyParentEmails().catch(() => {}), 7 * 24 * 60 * 60 * 1000);
});
