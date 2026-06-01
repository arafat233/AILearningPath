#!/usr/bin/env node
/**
 * Pro-track Java — acceptance for the parallel D3/D5 features:
 *   D3.1 Bitwise module (M47)        — content reachable via pro routes
 *   D3.2 Recursion Patterns (M48)    — content reachable via pro routes
 *   D3.4 Pattern Atlas               — GET /v1/pro/pattern-atlas
 *   D5.1 Free-tier public access     — GET /api/public/pro/topics/:id
 *
 * All token-free (pure DB reads — none of these endpoints call Claude).
 * Live round-trip through the mounted routers per PRO_EXERCISE_TYPE_CHECKLIST.md.
 *
 * Prereq: seeds run — npm run seed:bitwise-module, seed:recursion-patterns,
 * seed:lighthouse-topics.
 *
 * Usage: node scripts/acceptanceParallelFeatures.mjs
 */
import "dotenv/config";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

const FREE_TOPIC     = "java_m1_t1";   // freeAccess:true (lighthouse)
const NON_FREE_TOPIC = "java_m2_t1";   // freeAccess:false

let cookies = "";
async function http(method, path, body, { auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth && cookies) headers.Cookie = cookies;
  // Retry transient network failures (a parallel dev session restarting the
  // backend nodemon briefly drops connections — not a feature failure).
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
      const sc = res.headers.get("set-cookie");
      if (sc) cookies = sc.split(";")[0] + "; " + (cookies || "");
      let payload; try { payload = await res.json(); } catch { payload = null; }
      return { status: res.status, payload };
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1200));
    }
  }
  throw new Error(`network: gave up on ${method} ${path}`);
}

const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 60)} ${detail}`);
  if (!ok) process.exitCode = 1;
}

console.log("PRO-TRACK JAVA — parallel D3/D5 feature acceptance (token-free)");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── D5.1 Free-tier (no auth) ────────────────────────────────────────────────
console.log("\nD5.1 — Free-tier public topic access (no auth)");
let r = await http("GET", `/public/pro/topics/${FREE_TOPIC}`, null, { auth: false });
step("free topic served without auth → 200", r.status === 200, `status=${r.status}`);
step("returns the topic payload", !!r.payload?.data?.topicId, `topicId=${r.payload?.data?.topicId}`);
r = await http("GET", `/public/pro/topics/${NON_FREE_TOPIC}`, null, { auth: false });
step("non-free topic blocked → 403", r.status === 403, `status=${r.status}`);
r = await http("GET", `/public/pro/topics/${FREE_TOPIC}/exercises`, null, { auth: false });
step("free topic exercises → 200 array", r.status === 200 && Array.isArray(r.payload?.data), `count=${(r.payload?.data || []).length}`);

// ── Login for the authed checks ─────────────────────────────────────────────
r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else {
  step("Login as test user", true);
}
await http("POST", "/v1/pro/enroll", { trackKey: "pro_java" });

// ── D3.4 Pattern Atlas ──────────────────────────────────────────────────────
console.log("\nD3.4 — Pattern Atlas");
r = await http("GET", "/v1/pro/pattern-atlas?trackKey=pro_java");
const atlas = r.payload?.data;
step("pattern-atlas → 200", r.status === 200, `status=${r.status}`);
step("groups exercises by pattern (byPattern object)", atlas && typeof atlas.byPattern === "object" && Object.keys(atlas.byPattern).length > 0,
  `patterns=${Object.keys(atlas?.byPattern || {}).length}`);
step("totalExercises > 0", (atlas?.totalExercises || 0) > 0, `total=${atlas?.totalExercises}`);
step("includes bit_manipulation (Bitwise pattern_match indexed)", !!atlas?.byPattern?.bit_manipulation,
  `bit_manipulation entries=${(atlas?.byPattern?.bit_manipulation || []).length}`);

// ── D3.1 Bitwise module (M47) ───────────────────────────────────────────────
console.log("\nD3.1 — Bitwise module (java_m47)");
r = await http("GET", "/v1/pro/tracks/java/modules/java_m47");
step("module java_m47 → 200", r.status === 200, `status=${r.status}`);
step("module has 5 topics", (r.payload?.data?.topics || []).length === 5, `topics=${(r.payload?.data?.topics || []).length}`);
r = await http("GET", "/v1/pro/topics/java_m47_t1");
step("topic java_m47_t1 → 200", r.status === 200, `status=${r.status}`);
step("topic carries the bitwise visualizer", r.payload?.data?.visualizer?.kind === "bitwise",
  `visualizer=${JSON.stringify(r.payload?.data?.visualizer)}`);

// ── D3.2 Recursion Patterns module (M48) ────────────────────────────────────
console.log("\nD3.2 — Recursion Patterns module (java_m48)");
r = await http("GET", "/v1/pro/tracks/java/modules/java_m48");
step("module java_m48 → 200", r.status === 200, `status=${r.status}`);
step("module has 5 topics", (r.payload?.data?.topics || []).length === 5, `topics=${(r.payload?.data?.topics || []).length}`);
r = await http("GET", "/v1/pro/topics/java_m48_t1");
step("topic java_m48_t1 → 200", r.status === 200, `status=${r.status}`);

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — D3.1/D3.2/D3.4/D5.1 verified end-to-end (token-free)");
}
