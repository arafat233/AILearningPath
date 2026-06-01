#!/usr/bin/env node
/**
 * Pro-track Java v3 — end-to-end acceptance for the Phase 1.C Pattern
 * Recognition module.
 *
 * WHY THIS EXISTS:
 *   The pattern_match exercises shipped with `_pm_` IDs (java_m30_t1_pm_1),
 *   but the route param validator only accepted `_ex_` IDs — so every
 *   pattern_match exercise returned 422 at the API boundary and was
 *   completely unreachable. The frontend bundle built fine and the DB seed
 *   succeeded, so no existing check caught it. This script adds the missing
 *   gate: an actual HTTP round-trip through the param validator.
 *
 *   TEST 1 below is the exact assertion that would have caught that bug.
 *
 * Assumes (same as v1/v2):
 *   - Backend on $BACKEND_URL (default localhost:5001) is up
 *   - Judge0 NOT required (pattern_match never touches the sandbox)
 *   - pilot_acceptance@stellar.dev is on PRO_TRACKS_ENABLED_FOR_EMAILS
 *   - `npm run seed:pattern-match` has been run (20 exercises seeded)
 *
 * Deliberately does NOT exercise /tutor/ask — that calls the Claude API
 * (token cost). The tutor route shares `exerciseIdPattern` with the exercise
 * routes, so the validator fix is transitively covered by TEST 1.
 *
 * Usage: node scripts/acceptanceTestV3.mjs
 */
import "dotenv/config";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

// A known seeded pattern_match exercise (M30-T1) + its answer key, mirroring
// config/seedPatternMatchExercises.js. If the seed changes, update these.
const PM_EXERCISE   = "java_m30_t1_pm_1";
const PM_TOPIC      = "java_m30_t1";
const PM_CORRECT    = "two_pointer";
const PM_WRONG      = "hash_map";

let cookies = "";

async function http(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookies ? { Cookie: cookies } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookies = setCookie.split(";")[0] + "; " + (cookies || "");
  let payload;
  try { payload = await res.json(); } catch { payload = null; }
  return { status: res.status, payload };
}

const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 60)} ${detail}`);
  if (!ok) process.exitCode = 1;
}

console.log("PRO-TRACK JAVA v3 — Pattern Recognition acceptance");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── Login (register on first run) ──────────────────────────────────────────
let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else {
  step("Login as test user", true);
}

// ── Enrol (idempotent) ─────────────────────────────────────────────────────
r = await http("POST", "/v1/pro/enroll", { trackKey: "pro_java" });
step("Enrol in pro_java (idempotent)", r.status === 200);

// ── TEST 1 — the regression guard: _pm_ ID passes the param validator ──────
//
// Pre-fix this returned 422 ("fails to match the required pattern ..._ex_N").
// A 200 here proves exerciseIdPattern accepts _pm_ IDs AND that the exercise
// is reachable end-to-end.
console.log("\nTEST 1 — GET pattern_match exercise (validator + client-safe payload)");
r = await http("GET", `/v1/pro/exercises/${PM_EXERCISE}`);
const ex = r.payload?.data;
step("GET returns 200 (NOT 422 — the bug)", r.status === 200, `status=${r.status}`);
step("type is pattern_match", ex?.type === "pattern_match", `type=${ex?.type}`);
step("options exposed to client", Array.isArray(ex?.blanks?.[0]?.options) && ex.blanks[0].options.length > 0,
  `options=${JSON.stringify(ex?.blanks?.[0]?.options || [])}`);
// The answer key must NEVER reach the client.
const leaked = JSON.stringify(ex || {});
step("testCases NOT leaked to client", !("testCases" in (ex || {})) && !leaked.includes("\"correct\""),
  ("testCases" in (ex || {})) ? "LEAK: testCases present" : "clean");

// ── TEST 2 — topic exercise list includes the pm exercise WITH options ─────
//
// Guards the proService.getExercises `blanks` projection — if blanks is
// dropped from the select(), the radio buttons have nothing to render.
console.log("\nTEST 2 — topic exercise list returns options (blanks projection)");
r = await http("GET", `/v1/pro/topics/${PM_TOPIC}/exercises`);
const list = r.payload?.data || [];
step("topic exercises returns 200", r.status === 200, `count=${list.length}`);
const pmInList = list.find((e) => e.exerciseId === PM_EXERCISE);
step("pattern_match exercise present in list", !!pmInList);
step("list entry carries blanks.options", Array.isArray(pmInList?.blanks?.[0]?.options) && pmInList.blanks[0].options.length > 0,
  `options=${JSON.stringify(pmInList?.blanks?.[0]?.options || [])}`);

// ── TEST 3 — wrong answer → passed:false + reveals the correct pattern ─────
console.log("\nTEST 3 — submit WRONG pattern (no sandbox, returns explanation)");
r = await http("POST", `/v1/pro/exercises/${PM_EXERCISE}/submit`, { code: PM_WRONG });
let data = r.payload?.data;
step("Submit returns 200", r.status === 200, `status=${r.status}`);
step("Marked failed (passed=false)", data?.passed === false);
const wrongMsg = data?.testResults?.[0]?.message || "";
step("Message reveals the correct pattern", /two pointer/i.test(wrongMsg),
  `msg="${wrongMsg.slice(0, 80)}"`);
step("No XP for a wrong answer", (data?.xpAwarded || 0) === 0, `xp=${data?.xpAwarded}`);

// ── TEST 4 — correct answer → passed:true + XP awarded ─────────────────────
console.log("\nTEST 4 — submit CORRECT pattern");
r = await http("POST", `/v1/pro/exercises/${PM_EXERCISE}/submit`, { code: PM_CORRECT });
data = r.payload?.data;
step("Submit returns 200", r.status === 200);
step("Marked passed (passed=true)", data?.passed === true);
step("XP awarded for correct answer", (data?.xpAwarded || 0) > 0, `xp=${data?.xpAwarded}`);
const okMsg = data?.testResults?.[0]?.message || "";
step("Correct message includes explanation", /correct/i.test(okMsg), `msg="${okMsg.slice(0, 80)}"`);

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — Pattern Recognition verified end-to-end");
}
