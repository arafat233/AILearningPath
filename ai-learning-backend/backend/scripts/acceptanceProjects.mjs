#!/usr/bin/env node
/**
 * Pro-track Java — Projects acceptance.
 *
 * Projects are SELF-ASSESSED: submitProject awards XP = sum of checked
 * requirement weights, with NO Judge0 and NO Claude. So this whole suite is
 * token-free AND sandbox-free — fully safe to run anywhere.
 *
 * Live round-trip through the mounted router + auth + Joi validators per
 * PRO_EXERCISE_TYPE_CHECKLIST.md.
 *
 * Routes:
 *   GET  /v1/pro/projects/:projectId
 *   POST /v1/pro/projects/:projectId/submit  { code, checkedReqs[] }
 *
 * Usage: node scripts/acceptanceProjects.mjs
 */
import "dotenv/config";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

const REAL_PROJECT = "java_m10_t1_proj";       // seeded; core_req_1=15 + core_req_3=20
const EXPECTED_XP  = 35;
const MISSING_PROJECT = "java_m99_t9_proj";    // valid id format, does not exist
const BAD_FORMAT      = "not-a-valid-project"; // fails the param validator

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

console.log("PRO-TRACK JAVA — Projects acceptance (token-free, sandbox-free)");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── Auth gating ─────────────────────────────────────────────────────────────
let r = await http("GET", `/v1/pro/projects/${REAL_PROJECT}`, null, { auth: false });
step("GET /projects/:id without auth → 401", r.status === 401, `status=${r.status}`);

r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else {
  step("Login as test user", true);
}
await http("POST", "/v1/pro/enroll", { trackKey: "pro_java" });

// ── TEST 1 — fetch a real project ───────────────────────────────────────────
console.log("\nTEST 1 — GET a seeded project");
r = await http("GET", `/v1/pro/projects/${REAL_PROJECT}`);
const proj = r.payload?.data;
step("GET real project → 200", r.status === 200, `status=${r.status}`);
step("returns projectId + requirements[]", proj?.projectId === REAL_PROJECT && Array.isArray(proj?.requirements) && proj.requirements.length > 0,
  `reqs=${(proj?.requirements || []).length}`);

// ── TEST 2 — missing project (valid id format) → 404 ────────────────────────
console.log("\nTEST 2 — GET a non-existent project (valid format)");
r = await http("GET", `/v1/pro/projects/${MISSING_PROJECT}`);
step("non-existent project → 404", r.status === 404, `status=${r.status}`);

// ── TEST 3 — bad id format rejected by the param validator → 422 ────────────
console.log("\nTEST 3 — malformed projectId rejected by validator");
r = await http("GET", `/v1/pro/projects/${BAD_FORMAT}`);
step("malformed projectId → 422", r.status === 422, `status=${r.status}`);

// ── TEST 4 — submit with no code → 422 (body validator) ─────────────────────
console.log("\nTEST 4 — submit with no code rejected");
r = await http("POST", `/v1/pro/projects/${REAL_PROJECT}/submit`, { checkedReqs: [] });
step("submit without code → 422", r.status === 422, `status=${r.status}`);

// ── TEST 5 — valid self-assessed submission → XP from checked weights ───────
console.log("\nTEST 5 — submit with checked requirements awards correct XP");
r = await http("POST", `/v1/pro/projects/${REAL_PROJECT}/submit`, {
  code: "public class Main { public static void main(String[] a){} }",
  checkedReqs: ["core_req_1", "core_req_3"],   // 15 + 20 = 35
});
const sub = r.payload?.data;
step("submit → 200", r.status === 200, `status=${r.status}`);
step(`xpAwarded === ${EXPECTED_XP} (sum of checked weights)`, sub?.xpAwarded === EXPECTED_XP, `xpAwarded=${sub?.xpAwarded}`);
// Self-assessed projects return { xpAwarded, checkedCount, totalReqs } — no "passed".
step("checkedCount === 2", sub?.checkedCount === 2, `checkedCount=${sub?.checkedCount}`);
step("totalReqs reported", (sub?.totalReqs || 0) > 0, `totalReqs=${sub?.totalReqs}`);

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — Projects verified end-to-end (self-assessed, no sandbox)");
}
