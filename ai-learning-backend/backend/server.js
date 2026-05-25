import express from "express";
import { alertOnError } from "./utils/errorAlert.js";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { initSocket } from "./utils/socket.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { csrfProtect } from "./middleware/csrf.js";
import { runOnboardingEmails } from "./services/onboardingEmailService.js";
import { sendRevisionReminders, sendStudyReminders, sendStreakRiskReminders } from "./services/pushService.js";
import { runWeeklyParentEmails } from "./services/weeklyParentEmailService.js";
import pushRoutes from "./routes/pushRoutes.js";
import logger from "./utils/logger.js";
import { validateEnv } from "./utils/validateEnv.js";
import { connectRedis, isUsingFallback, acquireCronLock, pingRedis, getRedisClient } from "./utils/redisClient.js";
import { checkAndAlertBudget } from "./utils/tokenBudget.js";
import { initSentry } from "./utils/sentry.js";
import { getFlagsForUser } from "./utils/featureFlags.js";
import jwt from "jsonwebtoken";
import { TOKEN_COOKIE } from "./utils/cookieNames.js";

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
import { NcertChapter } from "./models/ncertChapterModel.js";
import paymentRoutes    from "./routes/paymentRoutes.js";
import webhookRoutes    from "./routes/webhookRoutes.js";
import companyRoutes    from "./routes/companyRoutes.js";
import pyqRoutes        from "./routes/pyqRoutes.js";
import feedbackRoutes     from "./routes/feedbackRoutes.js";
import placementRoutes    from "./routes/placementRoutes.js";
import recommenderRoutes  from "./routes/recommenderRoutes.js";
import schoolRoutes       from "./routes/schoolRoutes.js";
import publicRoutes      from "./routes/publicRoutes.js";
import bookmarkRoutes    from "./routes/bookmarkRoutes.js";
import profileV2Routes   from "./routes/profileV2Routes.js";
import lessonsV2Routes   from "./routes/lessonsV2Routes.js";
import analyticsV2Routes from "./routes/analyticsV2Routes.js";
import dashboardV2Routes from "./routes/dashboardV2Routes.js";
import competitionV2Routes from "./routes/competitionV2Routes.js";
import liveRoomV2Routes  from "./routes/liveRoomV2Routes.js";
import parentV2Routes    from "./routes/parentV2Routes.js";
import schoolGroupV2Routes from "./routes/schoolGroupV2Routes.js";
import proRoutes         from "./routes/proRoutes.js";
import { setupSwagger } from "./utils/swagger.js";

dotenv.config();
initSentry();   // no-op when SENTRY_DSN is not set
validateEnv(); // crash fast if required env vars are missing
initPassport(); // register Google strategy after env vars are loaded

const app    = express();
const server = http.createServer(app);

// Node.js default keepAliveTimeout is 5 s — too short for users who pause to read.
// Raise to 65 s so the browser's TCP connection stays alive between requests.
server.keepAliveTimeout = 65_000;
server.headersTimeout   = 66_000; // must be slightly above keepAliveTimeout

app.use(compression());

app.use(helmet({
  hsts: {
    maxAge:            63072000, // 2 years
    includeSubDomains: true,
    preload:           true,
  },
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
      reportTo:       "csp-endpoint",
    },
    reportOnly: false,
  },
}));

// CSP violation reports endpoint (add Reporting-Endpoints header for modern browsers)
app.use((req, res, next) => {
  res.setHeader("Reporting-Endpoints", `csp-endpoint="${process.env.CSP_REPORT_URI || "/api/csp-report"}"`);
  next();
});
app.post("/api/csp-report", express.json({ type: "application/csp-report" }), (req, res) => {
  logger.warn("CSP violation", { report: req.body?.["csp-report"] });
  res.status(204).end();
});
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Dev convenience: allow common local variants (kept permissive only in non-prod)
if (process.env.NODE_ENV !== "production") {
  frontendOrigins.push("http://127.0.0.1:5173");
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

// Rate limit — Redis-backed in production (counter survives restarts + shared
// across pods); falls back to in-memory store when REDIS_URL isn't set.
// The real limiter is built AFTER connectRedis() resolves so that the
// rate-limit-redis store's eager loadIncrementScript call sees a ready client.
// Until then we pass requests through via a lazy wrapper.
let _limiter = null;
app.use((req, res, next) => (_limiter ? _limiter(req, res, next) : next()));

mongoose
  .connect(process.env.MONGO_URI, { maxPoolSize: 10, minPoolSize: 2, serverSelectionTimeoutMS: 5000 })
  .then(() => logger.info("MongoDB connected"))
  .catch((err) => { logger.error("MongoDB connection failed", { err: err.message }); process.exit(1); });

connectRedis().then(() => {
  const isProd = process.env.NODE_ENV === "production";
  const opts = {
    windowMs: 15 * 60 * 1000,
    max: isProd ? 300 : 5000,
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting entirely for localhost in development
    skip: (req) => !isProd && ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.ip),
  };
  const c = getRedisClient();
  if (c) {
    opts.store = new RedisStore({
      prefix: "rl:",
      sendCommand: (...args) => c.call(...args),
    });
    logger.info("Rate limiter using Redis store");
  } else {
    logger.warn("Rate limiter using in-memory store (no Redis)");
  }
  _limiter = rateLimit(opts);
});

initSocket(server);

// Attach a per-request trace ID so all log lines for one request share the same ID
app.use((req, _res, next) => {
  req.traceId = req.headers["x-request-id"] || crypto.randomUUID();
  next();
});

// Gate: return 503 until MongoDB is ready so early requests don't hit unhandled rejections
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Service starting — please retry in a moment" });
  }
  next();
});

// CSRF: skip safe methods and auth/webhook routes (auth routes issue the token)
app.use((req, res, next) => {
  const safe    = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  const excluded = req.path.startsWith("/api/auth") || req.path.startsWith("/api/webhooks");
  if (safe || excluded) return next();
  return csrfProtect(req, res, next);
});

// REST API routes
app.use("/api/public",      publicRoutes);
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
app.use("/api/feedback",         feedbackRoutes);
app.use("/api/push",             pushRoutes);
app.use("/api/v1/placement-quiz", placementRoutes);
app.use("/api/v1/recommender",    recommenderRoutes);
app.use("/api/v1/schools",        schoolRoutes);
app.use("/api/v1/bookmarks",      bookmarkRoutes);
app.use("/api/v1/profile",        profileV2Routes);
app.use("/api/v1/lessons-v2",     lessonsV2Routes);
app.use("/api/v1/analytics-v2",   analyticsV2Routes);
app.use("/api/v1/dashboard-v2",   dashboardV2Routes);
app.use("/api/v1/competition-v2", competitionV2Routes);
app.use("/api/v1/live-room",      liveRoomV2Routes);
app.use("/api/v1/parent",         parentV2Routes);
app.use("/api/v1/school-group",   schoolGroupV2Routes);
app.use("/api/v1/pro",            proRoutes);

// API docs — only in non-production or when ENABLE_SWAGGER=true
if (process.env.NODE_ENV !== "production" || process.env.ENABLE_SWAGGER === "true") {
  setupSwagger(app);
}

// Dynamic sitemap — public, no auth, includes NCERT chapter slugs for future SEO pages
app.get("/sitemap.xml", async (_req, res) => {
  const base = (process.env.SITE_URL || "https://ailearningpath.in").replace(/\/$/, "");
  const static_pages = [
    { loc: "/",        priority: "1.0", changefreq: "weekly"  },
    { loc: "/start",   priority: "0.8", changefreq: "monthly" },
    { loc: "/pricing", priority: "0.9", changefreq: "monthly" },
    { loc: "/terms",   priority: "0.3", changefreq: "yearly"  },
    { loc: "/privacy", priority: "0.3", changefreq: "yearly"  },
  ];
  const chapter_pages = [];
  try {
    const chapters = await NcertChapter.find({}, { chapterId: 1, _id: 0 }).lean();
    for (const ch of chapters) {
      chapter_pages.push({ loc: `/chapters/${ch.chapterId}`, priority: "0.7", changefreq: "monthly" });
    }
  } catch { /* skip if DB not ready */ }

  const urls = [...static_pages, ...chapter_pages];
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) =>
      `  <url><loc>${base}${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
    ),
    "</urlset>",
  ].join("\n");

  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

// Feature flags — public endpoint, user-aware when authenticated
app.get("/api/flags", (req, res) => {
  let user = null;
  try {
    const token = req.cookies?.[TOKEN_COOKIE];
    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      user = { id: payload.id, role: payload.role };
    }
  } catch { /* unauthenticated — flags use defaults */ }
  res.json({ data: getFlagsForUser(user) });
});

app.get("/api/health", async (_req, res) => {
  const health = { status: "ok", checks: { mongodb: "unknown", redis: "unknown", anthropic: "unknown" } };

  try {
    await mongoose.connection.db.admin().ping();
    health.checks.mongodb = "ok";
  } catch {
    health.checks.mongodb = "error";
    health.status = "degraded";
  }

  if (isUsingFallback()) {
    health.checks.redis = "fallback (in-memory)";
    health.status = "degraded";
  } else {
    const redisAlive = await pingRedis().catch(() => false);
    health.checks.redis = redisAlive ? "ok" : "error";
    if (!redisAlive) health.status = "degraded";
  }

  health.checks.anthropic = process.env.ANTHROPIC_API_KEY ? "key-set" : "missing";

  res.status(health.status === "ok" ? 200 : 503).json(health);
});
app.use((req, res) => res.status(404).json({ error: `${req.method} ${req.path} not found` }));

// Centralised error handler — must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const httpServer = server.listen(PORT, () => {
  logger.info("Server + WebSocket started", { port: PORT, env: process.env.NODE_ENV || "development" });

  // Each cron acquires a Redis distributed lock so only one pod runs it.
  // TTL is set slightly shorter than the interval so the next pod can acquire on time.

  // Onboarding emails: daily — lock for 23 h so pod picks it up the next day
  const runOnboarding = async () => {
    if (await acquireCronLock("onboarding_emails", 23 * 60 * 60))
      runOnboardingEmails().catch(() => {});
  };
  runOnboarding();
  setInterval(runOnboarding, 24 * 60 * 60 * 1000);

  // Revision push notifications: daily — lock for 23 h
  const runRevision = async () => {
    if (await acquireCronLock("revision_reminders", 23 * 60 * 60))
      sendRevisionReminders().catch(() => {});
  };
  runRevision();
  setInterval(runRevision, 24 * 60 * 60 * 1000);

  // Study reminders: per-minute — lock for 55 s so it re-fires each minute
  setInterval(async () => {
    if (await acquireCronLock("study_reminders", 55))
      sendStudyReminders().catch(() => {});
  }, 60 * 1000);

  // Streak-risk reminders: daily at 8 PM — lock for 23 h
  const runStreakRisk = async () => {
    const hour = new Date().getHours();
    if (hour !== 20) return; // only fire at 8 PM server time
    if (await acquireCronLock("streak_risk_reminders", 23 * 60 * 60))
      sendStreakRiskReminders().catch(() => {});
  };
  setInterval(runStreakRisk, 60 * 60 * 1000); // check every hour, fire only at 20:00

  // Weekly parent digest: every 7 days — lock for 6 d 23 h
  const runWeekly = async () => {
    if (await acquireCronLock("weekly_parent_emails", 6 * 24 * 60 * 60 + 23 * 60 * 60))
      runWeeklyParentEmails().catch(() => {});
  };
  runWeekly();
  setInterval(runWeekly, 7 * 24 * 60 * 60 * 1000);

  // Token budget alert: hourly — emails when monthly usage crosses 80%
  setInterval(() => checkAndAlertBudget().catch(() => {}), 60 * 60 * 1000);
});

// Graceful shutdown — drain in-flight requests before exiting
function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`);
  httpServer.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
  // Force exit after 10 s if connections are still open
  setTimeout(() => { logger.error("Forced exit after timeout"); process.exit(1); }, 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

// Catch anything that escaped the Express error handler
process.on("uncaughtException", (err) => {
  logger.error("uncaughtException", { err: err.message, stack: err.stack?.split("\n").slice(0, 4).join(" | ") });
  alertOnError(err, { route: "process", method: "uncaughtException" });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  const err = reason instanceof Error ? reason : new Error(String(reason));
  logger.error("unhandledRejection", { err: err.message, stack: err.stack?.split("\n").slice(0, 4).join(" | ") });
  alertOnError(err, { route: "process", method: "unhandledRejection" });
});
