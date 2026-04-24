import logger from "./logger.js";

const REQUIRED = [
  "MONGO_URI",
  "JWT_SECRET",
  "ANTHROPIC_API_KEY",
];

const OPTIONAL_WITH_DEFAULTS = {
  PORT:           "5000",
  FRONTEND_URL:   "http://localhost:5173",
  NODE_ENV:       "development",
  CLAUDE_MODEL:   "claude-haiku-4-5-20251001",
};

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    logger.error("Missing required environment variables — server cannot start", { missing });
    process.exit(1);
  }

  // SEC-25: Enforce minimum JWT_SECRET length
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.error("JWT_SECRET must be at least 32 characters — server cannot start safely");
    process.exit(1);
  }

  for (const [key, fallback] of Object.entries(OPTIONAL_WITH_DEFAULTS)) {
    if (!process.env[key]) {
      logger.warn(`Env var ${key} not set — using default: ${fallback}`);
    }
  }

  if (!process.env.REDIS_URL) {
    logger.warn("REDIS_URL not set — session store will use in-memory fallback (not safe for multi-instance)");
  }

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    logger.warn("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET not set — payment endpoints will return 503");
  }

  if (!process.env.RESEND_API_KEY) {
    logger.warn("RESEND_API_KEY not set — emails will fall back to console log (no real delivery)");
  }

  if (!process.env.CLERK_SECRET_KEY) {
    logger.warn("CLERK_SECRET_KEY not set — Clerk auth integration disabled, using local JWT");
  }

  if (!process.env.CLERK_WEBHOOK_SECRET) {
    logger.warn("CLERK_WEBHOOK_SECRET not set — Clerk webhook endpoint will reject all events");
  }
}
