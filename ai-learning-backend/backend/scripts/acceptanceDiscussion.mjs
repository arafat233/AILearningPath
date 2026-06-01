#!/usr/bin/env node
/**
 * Pro-track Java — Community Discussion acceptance (ROADMAP D5.3).
 *
 * Verifies the parallel-session discussion feature end-to-end. Pure CRUD —
 * no Claude, no Judge0. Live round-trip through the mounted /api/v1/pro
 * router + auth + Joi validators per PRO_EXERCISE_TYPE_CHECKLIST.md.
 *
 * Routes under test:
 *   GET    /v1/pro/topics/:topicId/discussions
 *   POST   /v1/pro/topics/:topicId/discussions      { body }
 *   POST   /v1/pro/discussions/:threadId/replies     { body }
 *   POST   /v1/pro/discussions/:threadId/upvote
 *   DELETE /v1/pro/discussions/:threadId
 *
 * Usage: node scripts/acceptanceDiscussion.mjs
 */
import "dotenv/config";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";
const TOPIC      = "java_m1_t1";
const FAKE_ID    = "0123456789abcdef01234567"; // valid ObjectId format, won't exist

let cookies = "";
async function http(method, path, body, { auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && cookies) headers.Cookie = cookies;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
      const sc = res.headers.get("set-cookie");
      if (sc) cookies = sc.split(";")[0] + "; " + (cookies || "");
      let payload; try { payload = await res.json(); } catch { payload = null; }
      return { status: res.status, payload };
    } catch (e) { await new Promise((r) => setTimeout(r, 1200)); }
  }
  throw new Error(`network: gave up on ${method} ${path}`);
}
const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 60)} ${detail}`);
  if (!ok) process.exitCode = 1;
}

console.log("PRO-TRACK JAVA — Community Discussion acceptance (D5.3, token-free)");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── Auth gating ─────────────────────────────────────────────────────────────
let r = await http("GET", `/v1/pro/topics/${TOPIC}/discussions`, null, { auth: false });
step("GET discussions without auth → 401", r.status === 401, `status=${r.status}`);

r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else { step("Login as test user", true); }
await http("POST", "/v1/pro/enroll", { trackKey: "pro_java" });

// ── Create a thread ─────────────────────────────────────────────────────────
console.log("\nTEST 1 — create a thread");
r = await http("POST", `/v1/pro/topics/${TOPIC}/discussions`, { body: "Is HashMap thread-safe?" });
const thread = r.payload?.data;
step("create → 201", r.status === 201, `status=${r.status}`);
step("returns id + body + isMine + upvotes=0 + empty replies",
  !!thread?.id && thread?.body === "Is HashMap thread-safe?" && thread?.isMine === true && thread?.upvotes === 0 && Array.isArray(thread?.replies) && thread.replies.length === 0,
  `id=${thread?.id?.slice(-6)} isMine=${thread?.isMine} upvotes=${thread?.upvotes}`);
step("does NOT leak raw upvoters array", !("upvoters" in (thread || {})), "upvoters" in (thread || {}) ? "LEAK" : "clean");
const threadId = thread?.id;

// ── List includes it ────────────────────────────────────────────────────────
console.log("\nTEST 2 — list includes the thread");
r = await http("GET", `/v1/pro/topics/${TOPIC}/discussions`);
step("list → 200", r.status === 200, `count=${(r.payload?.data || []).length}`);
step("created thread present in list", (r.payload?.data || []).some((t) => t.id === threadId));

// ── Reply ────────────────────────────────────────────────────────────────────
console.log("\nTEST 3 — reply to the thread");
r = await http("POST", `/v1/pro/discussions/${threadId}/replies`, { body: "No — use ConcurrentHashMap." });
const afterReply = r.payload?.data;
step("reply → 200", r.status === 200, `status=${r.status}`);
step("thread now has 1 reply with body", (afterReply?.replies || []).length === 1 && afterReply.replies[0].body === "No — use ConcurrentHashMap.",
  `replies=${(afterReply?.replies || []).length}`);

// ── Upvote toggle ────────────────────────────────────────────────────────────
console.log("\nTEST 4 — upvote toggles");
r = await http("POST", `/v1/pro/discussions/${threadId}/upvote`);
step("upvote → upvotes=1, upvotedByMe=true", r.status === 200 && r.payload?.data?.upvotes === 1 && r.payload?.data?.upvotedByMe === true,
  `upvotes=${r.payload?.data?.upvotes} byMe=${r.payload?.data?.upvotedByMe}`);
r = await http("POST", `/v1/pro/discussions/${threadId}/upvote`);
step("upvote again → upvotes=0, upvotedByMe=false", r.status === 200 && r.payload?.data?.upvotes === 0 && r.payload?.data?.upvotedByMe === false,
  `upvotes=${r.payload?.data?.upvotes} byMe=${r.payload?.data?.upvotedByMe}`);

// ── Validation + error paths ─────────────────────────────────────────────────
console.log("\nTEST 5 — validation & error paths");
r = await http("POST", `/v1/pro/topics/${TOPIC}/discussions`, { body: "" });
step("empty body → 422", r.status === 422, `status=${r.status}`);
r = await http("POST", `/v1/pro/discussions/not-an-objectid/upvote`);
step("malformed threadId → 422", r.status === 422, `status=${r.status}`);
r = await http("POST", `/v1/pro/discussions/${FAKE_ID}/replies`, { body: "hi" });
step("reply to non-existent thread → 404", r.status === 404, `status=${r.status}`);

// ── Delete own thread ────────────────────────────────────────────────────────
console.log("\nTEST 6 — delete own thread");
r = await http("DELETE", `/v1/pro/discussions/${threadId}`);
step("delete own thread → 200 ok", r.status === 200 && r.payload?.data?.ok === true, `status=${r.status}`);
r = await http("GET", `/v1/pro/topics/${TOPIC}/discussions`);
step("thread gone from list after delete", !(r.payload?.data || []).some((t) => t.id === threadId));

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — Community Discussion (D5.3) verified end-to-end");
}
