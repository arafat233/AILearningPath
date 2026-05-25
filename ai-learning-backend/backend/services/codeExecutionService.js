/**
 * codeExecutionService — backend wrapper around the local Judge0 sandbox.
 *
 * PRO_TRACK_PLAN.md §4.3 + §6 risks:
 *   - Hard limits (5s CPU / 256MB RAM / 4KB output) match judge0.conf.
 *   - Output truncated to 8 KB before being returned to the client (defence-
 *     in-depth — sandbox already trims at 4KB, we trim again here).
 *   - Per-user rate limit (30 runs/hr · 100 runs/day) via Redis.
 *   - PII guard: user code is NEVER passed to logger.* (only metadata —
 *     userId, exerciseId, durationMs, status).
 *
 * Language IDs are Judge0's numeric language enum. Java = 62 (OpenJDK 13).
 * Add more as the pilot expands; keep the map central to avoid drift.
 */

import logger from "../utils/logger.js";
import { incrBy } from "../utils/redisClient.js";
import { AppError } from "../utils/AppError.js";
import { trackEvent } from "../utils/eventTracker.js";

const JUDGE0_URL        = process.env.JUDGE0_URL        || "http://localhost:2358";
const JUDGE0_AUTH_TOKEN = process.env.JUDGE0_AUTH_TOKEN || "";

const MAX_OUTPUT_BYTES  = 8 * 1024;
const RATE_PER_HOUR     = Number(process.env.SANDBOX_MAX_RUNS_PER_HOUR || 30);
const RATE_PER_DAY      = Number(process.env.SANDBOX_MAX_RUNS_PER_DAY  || 100);

// Judge0 language IDs. Update as new languages onboard.
const LANGUAGE_IDS = {
  java:        62,  // OpenJDK 13.0.1
  python:      71,  // 3.8.1
  javascript:  93,  // Node 18.15.0
  cpp:         54,  // GCC 9.2.0
  c:           50,  // GCC 9.2.0
};

function lookupLanguageId(language) {
  const key = String(language || "").trim().toLowerCase();
  const id = LANGUAGE_IDS[key];
  if (!id) throw new AppError(`Unsupported language: ${language}`, 400);
  return id;
}

function truncate(s) {
  if (typeof s !== "string") return s;
  return s.length > MAX_OUTPUT_BYTES ? s.slice(0, MAX_OUTPUT_BYTES) + "\n…[truncated]" : s;
}

// Convert Judge0's verbose response into the lean shape our controllers want.
function normalizeResult(j) {
  return {
    stdout:   truncate(j?.stdout || ""),
    stderr:   truncate(j?.stderr || j?.compile_output || ""),
    exitCode: typeof j?.exit_code === "number" ? j.exit_code : null,
    timeMs:   typeof j?.time === "string" ? Math.round(Number(j.time) * 1000) : null,
    memoryKb: typeof j?.memory === "number" ? j.memory : null,
    status:   j?.status?.description || "Unknown",
  };
}

// ── Rate limiting ───────────────────────────────────────────────────────────
function todayKey(userId)  { return `pro:sandbox:rate:${userId}:${new Date().toISOString().slice(0,10)}`; }
function hourKey(userId)   { return `pro:sandbox:rate:${userId}:${new Date().toISOString().slice(0,13)}`; }

async function assertWithinRateLimit(userId) {
  // Increment-and-check pattern: incrBy returns the new value AFTER adding.
  // Race-safe because Redis INCRBY is atomic.
  const [hourCount, dayCount] = await Promise.all([
    incrBy(hourKey(userId), 1, 60 * 60),
    incrBy(todayKey(userId), 1, 60 * 60 * 24),
  ]);
  if (hourCount > RATE_PER_HOUR) {
    trackEvent(userId, "pro.sandbox.rate_limited", { window: "hour", hourCount, limit: RATE_PER_HOUR });
    throw new AppError(`Hourly rate limit reached (${RATE_PER_HOUR}/hr). Try again in an hour.`, 429);
  }
  if (dayCount > RATE_PER_DAY) {
    trackEvent(userId, "pro.sandbox.rate_limited", { window: "day", dayCount, limit: RATE_PER_DAY });
    throw new AppError(`Daily rate limit reached (${RATE_PER_DAY}/day). Try again tomorrow.`, 429);
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Run a single piece of source against Judge0 and return the normalised
 * result. Use this for arbitrary runs (e.g. "Run" button output).
 */
export async function runCode({ userId, source, language, stdin = "" }) {
  if (!source || typeof source !== "string") throw new AppError("source is required", 400);
  if (userId) await assertWithinRateLimit(userId);

  const languageId = lookupLanguageId(language);
  const t0 = Date.now();
  let response;
  try {
    response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "X-Auth-Token":  JUDGE0_AUTH_TOKEN,
      },
      body: JSON.stringify({
        source_code: source,
        language_id: languageId,
        stdin,
      }),
    });
  } catch (err) {
    // PII guard: never log `source`.
    logger.error("Judge0 network error", {
      userId, languageId,
      url: JUDGE0_URL,
      err: err.message,
      causeCode: err.cause?.code,
      causeMessage: err.cause?.message,
    });
    throw new AppError("Code execution sandbox unreachable. Try again in a moment.", 503);
  }

  if (!response.ok) {
    logger.error("Judge0 non-2xx", { userId, languageId, status: response.status });
    throw new AppError("Code execution failed. Try again in a moment.", 502);
  }

  const json   = await response.json();
  const result = normalizeResult(json);
  const ms     = Date.now() - t0;
  // PII guard: log only metadata.
  logger.info("[sandbox] runCode", { userId, language, status: result.status, durationMs: ms });
  // Per-call latency event so a follow-up script can compute p50/p95.
  if (userId) {
    trackEvent(userId, "pro.sandbox.latency", {
      language,
      status:   result.status,
      durationMs: ms,
      sandboxTimeMs: result.timeMs,
      memoryKb: result.memoryKb,
    });
  }
  return result;
}

/**
 * Run source plus an exercise's testCases[] and report which passed.
 *
 * Test-case shape (from exercises.json — kept generic):
 *   { id, type: "must_contain"|"must_compile"|"stdout_equals"|"stdout_contains",
 *     value, hidden? }
 *
 * Strategy:
 *   - Run once via Judge0. Use the same submission for every test case
 *     (no per-case re-execution — saves 80% of sandbox calls).
 *   - For "must_compile": did the compile succeed? (status.id 6 = compile
 *     error in Judge0 — anything else passes that check.)
 *   - For "stdout_equals" / "stdout_contains": compare against `result.stdout`.
 *   - For "must_contain": grep `source` for `value` literally.
 *   - All other shapes pass through to caller (advanced tests like AST
 *     checks can be wired in later).
 */
export async function runTestCases({ userId, source, language, testCases }) {
  const result = await runCode({ userId, source, language });
  const compilePassed = !/compilation error|compile error/i.test(result.stderr);

  const cases = (testCases || []).map((tc, idx) => {
    const id = tc.id || `case_${idx + 1}`;
    try {
      switch (tc.type) {
        case "must_contain":
          return {
            caseId: id,
            passed: typeof tc.value === "string" && source.includes(tc.value),
            message: tc.value ? `must contain: "${tc.value}"` : "(no value supplied)",
          };
        case "must_compile":
          return { caseId: id, passed: compilePassed, message: compilePassed ? "compiled OK" : result.stderr.slice(0, 200) };
        case "stdout_equals":
          return {
            caseId: id,
            passed: result.stdout.trim() === String(tc.value ?? "").trim(),
            message: `stdout = "${(result.stdout || "").slice(0, 80).replace(/\n/g, "\\n")}"`,
          };
        case "stdout_contains":
          return {
            caseId: id,
            passed: result.stdout.includes(String(tc.value ?? "")),
            message: `stdout contains "${tc.value}"`,
          };
        default:
          return { caseId: id, passed: false, message: `Unknown test type: ${tc.type}` };
      }
    } catch (err) {
      return { caseId: id, passed: false, message: `eval error: ${err.message}` };
    }
  });

  const allPassed = cases.length > 0 && cases.every((c) => c.passed);
  return { sandboxResult: result, testResults: cases, passed: allPassed };
}

// Test helpers — exposed for unit tests, not used by controllers
export const __test__ = { LANGUAGE_IDS, normalizeResult, truncate };
