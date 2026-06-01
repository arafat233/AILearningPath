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
//
// Java's ID is env-configurable (JUDGE0_JAVA_LANGUAGE_ID) so a JDK upgrade on
// the sandbox is a one-env-var flip — no code deploy. Stock Judge0 1.13 ships
// only OpenJDK 13.0.1 (id 62), which CANNOT compile Java 14–21 features
// (records, text blocks, switch expressions, sealed, pattern matching). Once a
// newer JDK is registered as a new language ID on the sandbox, set
// JUDGE0_JAVA_LANGUAGE_ID to it. See infra/judge0/JDK_UPGRADE.md.
const JAVA_LANGUAGE_ID = Number(process.env.JUDGE0_JAVA_LANGUAGE_ID) || 62;

const LANGUAGE_IDS = {
  java:        JAVA_LANGUAGE_ID,  // default 62 = OpenJDK 13.0.1
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
/**
 * Judge0 always writes Java source to `/box/Main.java`, but Java's rule says
 * `public class Foo` MUST live in `Foo.java`. Exercises (e.g. "Refactor
 * verbose code" with `public class ServerStartup`) name their class freely.
 * Rewrite the public class identifier to `Main` everywhere in the CODE
 * before sandboxing so the compile succeeds — but NOT inside string or char
 * literals (e.g. `System.out.println("Square: " + n*n)` must keep the word
 * "Square" in the output).
 *
 * Important: code_analysis `must_contain` checks run against the ORIGINAL
 * source (the student's actual text), so test cases that look for
 * "public class FirstProgram" still match after this rewrite.
 */
function normalizeJavaForJudge0(source) {
  const m = source.match(/public\s+class\s+(\w+)/);
  if (!m) return source;
  const original = m[1];
  if (original === "Main") return source;

  // Skip string literals ("..."), char literals ('...'), and // + /* */
  // comments so the class-name replacement only hits actual identifiers.
  // The alternation order matters: we try to match a literal/comment first
  // and emit it unchanged; only the bare-identifier branch is rewritten.
  const re = new RegExp(
    [
      `"(?:\\\\.|[^"\\\\])*"`,         // double-quoted string with escape handling
      `'(?:\\\\.|[^'\\\\])'`,            // single-quoted char
      `//[^\\n]*`,                       // single-line comment
      `/\\*[\\s\\S]*?\\*/`,            // block comment
      `\\b${original}\\b`,             // the identifier we want to rename
    ].join("|"),
    "g"
  );
  return source.replace(re, (match) => (match === original ? "Main" : match));
}

export async function runCode({ userId, source, language, stdin = "" }) {
  if (!source || typeof source !== "string") throw new AppError("source is required", 400);
  if (userId) await assertWithinRateLimit(userId);

  const languageId = lookupLanguageId(language);
  const sandboxSource = language === "java" ? normalizeJavaForJudge0(source) : source;
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
        source_code: sandboxSource,
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
 * Supported test-case shapes (from exercises.json):
 *   Pilot content uses:
 *     { type: "execution",     expected_stdout, must_compile? }
 *     { type: "code_analysis", must_contain: [str...], must_compile? }
 *   Legacy / future shapes (kept for back-compat):
 *     { type: "must_contain"|"must_compile"|"stdout_equals"|"stdout_contains", value }
 *
 * Strategy:
 *   - Run once via Judge0. Use the same submission for every test case
 *     (no per-case re-execution — saves 80% of sandbox calls).
 *   - For "must_compile" / `must_compile: true`: did the compile succeed?
 *     (Judge0 status.id 6 = Compilation Error. Any other status passes.)
 *   - For stdout matches: compare result.stdout to expected_stdout / value.
 *   - For source matches: grep the ORIGINAL student source (NOT the
 *     normalized Main-rewritten version) so "public class FirstProgram"
 *     style assertions still hit the student's real text.
 *   - Unknown shapes fail loudly with the type name so content authors
 *     spot the typo instead of seeing a silent pass.
 */
// Test types that genuinely need the sandbox (compile + run + stdout).
// `text_match` and bare `code_analysis` operate purely on student text.
// `compilation` / `compile_check` are compile-only checks (no need to look
// at stdout, but Judge0 still has to compile, so we sandbox them).
function needsSandbox(testCases) {
  return (testCases || []).some((tc) => {
    if (!tc || !tc.type) return false;
    if ([
      "execution", "stdout_equals", "stdout_contains", "must_compile",
      "compilation", "compile_check", "compilation_and_run",
    ].includes(tc.type)) return true;
    if (tc.type === "code_analysis" && tc.must_compile) return true;
    return false;
  });
}

// Truthy "any test case wants to feed input to the program" — when true we
// must re-run Judge0 per test case (different stdin = different stdout).
// 95%+ of test cases have no stdin, so the single-run path stays the default.
function anyTestCaseHasStdin(testCases) {
  return (testCases || []).some((tc) => tc && typeof tc.stdin === "string" && tc.stdin.length > 0);
}

// Whitespace-tolerant stdout compare. The exact-match approach was failing
// students for trailing newlines and double-spaces that don't change meaning.
// Default behaviour:
//   - CRLF → LF
//   - trim trailing whitespace on each line
//   - collapse trailing blank lines
// Opt-in via test case flags:
//   - case_insensitive: true     — lowercase both sides before comparing
//   - normalize_whitespace: true — collapse all runs of whitespace to one space
function normalizeStdout(s, { caseInsensitive, normalizeWhitespace } = {}) {
  if (typeof s !== "string") return "";
  let out = s.replace(/\r\n/g, "\n").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n");
  // Drop trailing blank lines (Judge0 sometimes adds one).
  out = out.replace(/\n+$/, "");
  if (normalizeWhitespace) out = out.replace(/\s+/g, " ").trim();
  if (caseInsensitive) out = out.toLowerCase();
  return out;
}

// Does the actual stdout contain ALL of the required substrings? Each needle
// is matched against the normalised stdout (whitespace + case as configured).
// Returns the missing substrings (empty array = pass).
function checkStdoutContains(actualStdout, needles, opts) {
  const actualNorm = normalizeStdout(actualStdout, opts);
  const list = Array.isArray(needles) ? needles : [];
  return list.filter((needle) => {
    if (typeof needle !== "string") return false;
    const needleNorm = normalizeStdout(needle, opts);
    return !actualNorm.includes(needleNorm);
  });
}

export async function runTestCases({ userId, source, language, testCases }) {
  const cases = testCases || [];

  // Skip the Judge0 call entirely for predict_output / text-only exercises.
  // Charging the user the rate-limit slot + 1-2s of latency to "compile"
  // their predicted output text was both wasteful AND showed a confusing
  // "Compilation Error" badge in the sandbox panel.
  const sandbox = needsSandbox(cases);
  const perCaseRun = sandbox && anyTestCaseHasStdin(cases);

  // Default single-run path: one Judge0 call shared across all test cases.
  // Per-case path (when stdin varies): one Judge0 call per test case, since
  // different inputs produce different stdouts.
  let sharedResult = null;
  const perCaseResults = new Map();
  if (sandbox && !perCaseRun) {
    sharedResult = await runCode({ userId, source, language });
  } else if (perCaseRun) {
    for (let i = 0; i < cases.length; i++) {
      const tc = cases[i];
      const stdin = (tc && typeof tc.stdin === "string") ? tc.stdin : "";
      // eslint-disable-next-line no-await-in-loop
      const r = await runCode({ userId, source, language, stdin });
      perCaseResults.set(i, r);
    }
  }

  const noRun = { stdout: "", stderr: "", status: "Not run", timeMs: 0, memoryKb: 0, exitCode: null };

  // Judge0 reports compilation errors via status.id=6; falling back to
  // string-matching stderr keeps this working if status normalization changes.
  function compileOf(result) {
    return result.status !== "Compilation Error"
      && !/compilation error|compile error/i.test(result.stderr || "");
  }

  const out = cases.map((tc, idx) => {
    const id = tc.id || `case_${idx + 1}`;
    const result = perCaseRun ? (perCaseResults.get(idx) || noRun) : (sharedResult || noRun);
    const compilePassed = compileOf(result);
    const stderrTrim = (result.stderr || "").slice(0, 200);
    const normOpts = {
      caseInsensitive:     tc.case_insensitive === true,
      normalizeWhitespace: tc.normalize_whitespace === true,
    };

    try {
      switch (tc.type) {
        case "execution":
        case "compilation_and_run": {
          // Three flavours, all under the same case:
          //   1. expected_stdout       — exact (whitespace-tolerant) match
          //   2. expected_stdout_contains — array, all substrings must appear
          //   3. expected_output_pattern  — regex (rare; 1 case across content)
          // must_compile + stdin are optional regardless of which is set.
          const expected   = tc.expected_stdout != null ? String(tc.expected_stdout) : null;
          const contains   = Array.isArray(tc.expected_stdout_contains) ? tc.expected_stdout_contains : null;
          const pattern    = typeof tc.expected_output_pattern === "string" ? tc.expected_output_pattern : null;
          const actualNorm = normalizeStdout(result.stdout || "", normOpts);
          const compileOk  = tc.must_compile ? compilePassed : true;

          // Decide which assertion drives the pass/fail message:
          let stdoutOk = true;
          let mismatchMsg = "";
          if (expected != null) {
            const expectedNorm = normalizeStdout(expected, normOpts);
            stdoutOk = actualNorm === expectedNorm;
            if (!stdoutOk) {
              mismatchMsg = `Expected: "${expected.slice(0, 60).replace(/\n/g, "\\n")}"  ·  Got: "${(result.stdout || "").slice(0, 60).replace(/\n/g, "\\n")}"`;
            }
          } else if (contains) {
            const missing = checkStdoutContains(result.stdout || "", contains, normOpts);
            stdoutOk = missing.length === 0;
            if (!stdoutOk) {
              mismatchMsg = `Output missing: ${missing.slice(0, 3).map((s) => `"${s.slice(0, 30)}"`).join(", ")}`;
            }
          } else if (pattern) {
            try {
              stdoutOk = new RegExp(pattern, normOpts.caseInsensitive ? "i" : "").test(result.stdout || "");
              if (!stdoutOk) mismatchMsg = `Output does not match pattern: /${pattern.slice(0, 60)}/`;
            } catch (rx) {
              stdoutOk = false;
              mismatchMsg = `Bad regex in test case: ${rx.message}`;
            }
          }
          // No assertion supplied → just check compile (treat like must_compile)
          return {
            caseId: id,
            passed: stdoutOk && compileOk,
            message: !compileOk
              ? `Did not compile: ${stderrTrim}`
              : stdoutOk
                ? "Output matches expected"
                : mismatchMsg,
          };
        }
        case "code_analysis": {
          // must_contain (array of strings), must_compile (optional).
          // We grep the ORIGINAL student source so identifier-based asserts
          // ("public class FirstProgram") still match after Main-rewrite.
          const needles  = Array.isArray(tc.must_contain) ? tc.must_contain : [];
          const missing  = needles.filter((s) => typeof s === "string" && !source.includes(s));
          const compileOk = tc.must_compile ? compilePassed : true;
          const passed   = missing.length === 0 && compileOk;
          return {
            caseId: id,
            passed,
            message: !compileOk
              ? `Did not compile: ${stderrTrim}`
              : missing.length > 0
                ? `Missing in your code: ${missing.map((s) => `"${s}"`).join(", ")}`
                : "All required pieces present",
          };
        }
        case "text_match": {
          // predict_output exercises: student types the expected stdout as
          // plain text. We compare `source` (student input) to `tc.expected`
          // (or check `tc.expected_contains` as substrings).
          // CRLF is always normalized to LF.
          const expected         = tc.expected != null ? String(tc.expected) : null;
          const expectedContains = Array.isArray(tc.expected_contains) ? tc.expected_contains : null;
          const actualNorm       = normalizeStdout(source, normOpts);

          let passed = true;
          let mismatchMsg = "";
          if (expected != null) {
            passed = actualNorm === normalizeStdout(expected, normOpts);
            if (!passed) {
              mismatchMsg = `Expected: "${expected.slice(0, 80).replace(/\n/g, "\\n")}"  ·  Got: "${source.slice(0, 80).replace(/\n/g, "\\n")}"`;
            }
          } else if (expectedContains) {
            const missing = checkStdoutContains(source, expectedContains, normOpts);
            passed = missing.length === 0;
            if (!passed) {
              mismatchMsg = `Your response is missing: ${missing.slice(0, 3).map((s) => `"${s.slice(0, 40)}"`).join(", ")}`;
            }
          }
          return {
            caseId: id,
            passed,
            message: passed ? "Output matches expected" : mismatchMsg,
          };
        }
        case "must_contain":
          return {
            caseId: id,
            passed: typeof tc.value === "string" && source.includes(tc.value),
            message: tc.value ? `must contain: "${tc.value}"` : "(no value supplied)",
          };
        case "must_compile":
        case "compilation":
        case "compile_check":
          return { caseId: id, passed: compilePassed, message: compilePassed ? "compiled OK" : stderrTrim };
        case "stdout_equals":
          return {
            caseId: id,
            passed: normalizeStdout(result.stdout || "", normOpts)
                  === normalizeStdout(String(tc.value ?? ""), normOpts),
            message: `stdout = "${(result.stdout || "").slice(0, 80).replace(/\n/g, "\\n")}"`,
          };
        case "stdout_contains":
          return {
            caseId: id,
            passed: normalizeStdout(result.stdout || "", normOpts)
                     .includes(normalizeStdout(String(tc.value ?? ""), normOpts)),
            message: `stdout contains "${tc.value}"`,
          };
        case "pattern_match": {
          // source = the learner's selected pattern ID (e.g. "sliding_window")
          // tc.correct = the correct pattern ID
          // tc.explanation = why this pattern fits (shown after submit)
          const selected = String(source || "").trim();
          const correct  = String(tc.correct || "").trim();
          const passed   = selected === correct;
          const label    = correct.replace(/_/g, " ");
          return {
            caseId: id,
            passed,
            message: passed
              ? `Correct! ${tc.explanation || ""}`.trim()
              : `The right pattern is "${label}". ${tc.explanation || ""}`.trim(),
          };
        }
        default:
          return { caseId: id, passed: false, message: `Unknown test type: ${tc.type}` };
      }
    } catch (err) {
      return { caseId: id, passed: false, message: `eval error: ${err.message}` };
    }
  });

  const allPassed = out.length > 0 && out.every((c) => c.passed);
  // For backward compat, return a sandbox result. When we ran per-case, return
  // the first case's result (used by the UI to show the last sandbox stdout).
  const sandboxResult = perCaseRun ? (perCaseResults.get(0) || noRun) : (sharedResult || noRun);
  return { sandboxResult, testResults: out, passed: allPassed };
}

// Test helpers — exposed for unit tests, not used by controllers
export const __test__ = {
  LANGUAGE_IDS, normalizeResult, truncate,
  normalizeStdout, checkStdoutContains, needsSandbox, anyTestCaseHasStdin,
};
