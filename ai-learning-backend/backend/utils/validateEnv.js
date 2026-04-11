// Validates required environment variables at startup.
// Crashes immediately with a clear message rather than failing
// silently on the first request that needs the missing value.
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
  // REDIS_URL is optional — if absent, session store falls back to in-memory
};

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error("Missing required environment variables — server cannot start", { missing });
    process.exit(1);
  }

  // Warn about optional vars that are absent (not fatal)
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
}
