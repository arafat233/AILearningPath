#!/usr/bin/env node
/**
 * Pro-track Java — Interview Simulator acceptance (ROADMAP H).
 *
 * IMPORTANT — token-free by design:
 *   createSession (opening line), sendMessage (interviewer reply), and
 *   endSession (rubric) ALL call Claude Sonnet and count against a 3/day
 *   limit. This script deliberately does NOT exercise those happy paths —
 *   spending API tokens in an acceptance run is wasteful and the operator is
 *   sensitive to API-key cost. Instead it verifies the full route wiring via
 *   the surfaces that never reach Claude:
 *
 *     GET  /problems                 — public, static bank (no LLM)
 *     GET  /history                  — reads sessions (no LLM)
 *     GET  /sessions/:id             — reads a session (no LLM)
 *     POST /sessions {bad problemId} — getProblem() throws 404 BEFORE the
 *                                      Claude call → proves auth + route +
 *                                      controller + service are wired, with
 *                                      zero tokens spent.
 *
 *   The LLM happy paths remain manually verified in the browser.
 *
 * Honors the api-round-trip lesson (PRO_EXERCISE_TYPE_CHECKLIST.md): these are
 * live requests through the mounted router + auth middleware, not unit tests.
 *
 * Assumes: backend up on $BACKEND_URL, test user allowed.
 * Usage: node scripts/acceptanceInterview.mjs
 */
import "dotenv/config";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

// A syntactically-valid but non-existent Mongo ObjectId (24 hex chars).
const FAKE_OBJECT_ID = "0123456789abcdef01234567";

let cookies = "";
async function http(method, path, body, { auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && cookies) headers.Cookie = cookies;
  const res = await fetch(`${BASE}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookies = setCookie.split(";")[0] + "; " + (cookies || "");
  let payload; try { payload = await res.json(); } catch { payload = null; }
  return { status: res.status, payload };
}

const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 60)} ${detail}`);
  if (!ok) process.exitCode = 1;
}

console.log("PRO-TRACK JAVA — Interview Simulator acceptance (token-free)");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── TEST 1 — public problem bank, no auth, no LLM, no leaked internals ──────
console.log("\nTEST 1 — GET /problems (public, static bank)");
let r = await http("GET", "/v1/pro/interview/problems", null, { auth: false });
const problems = r.payload?.data || [];
step("returns 200 without auth", r.status === 200, `status=${r.status}`);
step("problem bank is non-empty", problems.length > 0, `count=${problems.length}`);
const sample = problems[0] || {};
step("items expose id/title/difficulty/topic",
  !!(sample.id && sample.title && sample.difficulty && sample.topic),
  `e.g. ${sample.id} "${sample.title}" (${sample.difficulty}/${sample.topic})`);
step("internal followUps NOT leaked to client",
  !problems.some((p) => "followUps" in p),
  problems.some((p) => "followUps" in p) ? "LEAK: followUps present" : "clean");

// ── TEST 2 — difficulty filter ──────────────────────────────────────────────
console.log("\nTEST 2 — GET /problems?difficulty=easy filter");
r = await http("GET", "/v1/pro/interview/problems?difficulty=easy", null, { auth: false });
const easy = r.payload?.data || [];
step("filter returns 200", r.status === 200);
step("every returned problem is easy", easy.length > 0 && easy.every((p) => p.difficulty === "easy"),
  `count=${easy.length}`);

// ── TEST 3 — auth gating ────────────────────────────────────────────────────
console.log("\nTEST 3 — session routes require auth");
r = await http("GET", "/v1/pro/interview/history", null, { auth: false });
step("GET /history without auth → 401", r.status === 401, `status=${r.status}`);

// ── Login for the authed (still token-free) checks ──────────────────────────
r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else {
  step("Login as test user", true);
}

// ── TEST 4 — create with a bad problemId → 404 BEFORE any Claude call ───────
//
// createSession increments the daily rate counter, then getProblem() throws
// 404 for an unknown id — all before anthropic.messages.create(). So this
// proves the route mounts + auth passes + service is reached, spending ZERO
// tokens. After 3 calls/day the rate limiter returns 429 first, which equally
// proves "reached the service without an LLM call" — so accept either.
console.log("\nTEST 4 — POST /sessions {bad problemId} → 404/429 (no LLM reached)");
r = await http("POST", "/v1/pro/interview/sessions", { problemId: "__does_not_exist__" });
step("rejected before any Claude call (404 or 429)", [404, 429].includes(r.status), `status=${r.status}`);
step("did NOT 200 (no session created / no tokens spent)", r.status !== 200, `status=${r.status}`);

// ── TEST 5 — get a non-existent session → 404 (no LLM) ──────────────────────
console.log("\nTEST 5 — GET /sessions/:id for a non-existent session");
r = await http("GET", `/v1/pro/interview/sessions/${FAKE_OBJECT_ID}`);
step("non-existent session → 404", r.status === 404, `status=${r.status}`);

// ── TEST 6 — history for the authed user → 200 array (no LLM) ───────────────
console.log("\nTEST 6 — GET /history (authed) returns an array");
r = await http("GET", "/v1/pro/interview/history");
step("history returns 200", r.status === 200, `status=${r.status}`);
step("history payload is an array", Array.isArray(r.payload?.data), `type=${typeof r.payload?.data}`);

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — Interview Simulator routes verified (token-free)");
  console.log("   NOTE: LLM happy paths (opening line, interviewer replies, rubric) are");
  console.log("   manually verified in-browser — intentionally not exercised here.");
}
