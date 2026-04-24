import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { initSocket } from "./utils/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";
import { validateEnv } from "./utils/validateEnv.js";
import { connectRedis, isUsingFallback } from "./utils/redisClient.js";

import authRoutes        from "./routes/authRoutes.js";
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
import paymentRoutes    from "./routes/paymentRoutes.js";

dotenv.config();
validateEnv(); // crash fast if required env vars are missing

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
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => { logger.error("MongoDB connection failed", { err: err.message }); process.exit(1); });

connectRedis();

initSocket(server);

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
app.use("/api/v1/payment",   paymentRoutes);

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
server.listen(PORT, () => logger.info("Server + WebSocket started", { port: PORT, env: process.env.NODE_ENV || "development" }));
