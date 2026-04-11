// ============================================================
// LOGGER — structured, level-aware, zero dependencies
//
// Dev  → pretty human-readable output with level prefix
// Prod → JSON one-line per entry (works with any log aggregator)
//
// Usage:
//   logger.info("Server started", { port: 5000 })
//   logger.warn("Cache miss", { cacheKey })
//   logger.error("Claude failed", { userId, err: err.message })
//   logger.debug("Adapter selected question", { questionId, difficulty })
// ============================================================

const IS_PROD = process.env.NODE_ENV === "production";

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const MIN_LEVEL = LEVELS[process.env.LOG_LEVEL] ?? (IS_PROD ? LEVELS.info : LEVELS.debug);

const PREFIX = { debug: "DEBUG", info: "INFO ", warn: "WARN ", error: "ERROR" };

function write(level, msg, ctx = {}) {
  if (LEVELS[level] < MIN_LEVEL) return;

  const ts = new Date().toISOString();

  if (IS_PROD) {
    // Structured JSON — one line, parseable by Datadog / CloudWatch / Loki etc.
    const entry = { level, ts, msg, ...ctx };
    if (ctx.err instanceof Error) entry.err = ctx.err.message;
    process.stdout.write(JSON.stringify(entry) + "\n");
  } else {
    // Pretty human-readable for local development
    const ctxStr = Object.keys(ctx).length
      ? "  " + JSON.stringify(ctx, (_, v) => (v instanceof Error ? v.message : v))
      : "";
    const out = `[${ts}] ${PREFIX[level]}  ${msg}${ctxStr}\n`;
    level === "error" ? process.stderr.write(out) : process.stdout.write(out);
  }
}

const logger = {
  debug: (msg, ctx) => write("debug", msg, ctx),
  info:  (msg, ctx) => write("info",  msg, ctx),
  warn:  (msg, ctx) => write("warn",  msg, ctx),
  error: (msg, ctx) => write("error", msg, ctx),
};

export default logger;
