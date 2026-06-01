#!/usr/bin/env node
/**
 * Pro-track Java — acceptance for the J-series content modules:
 *   J1 M49 Modern Java Features   (predict_output + pattern_match — see note)
 *   J2 M50 Engineering Hygiene    (pattern_match + text_match, no sandbox)
 *   J3 M51 Technical Communication (pattern_match + text_match, no sandbox)
 *
 * No Claude tokens, no Judge0. NOTE: the Judge0 sandbox runs OpenJDK 13, which
 * cannot compile the Java 14–21 features M49 teaches (records, text blocks,
 * switch expressions, sealed, pattern matching). So M49 uses predict_output
 * (read the modern syntax, predict the output → text_match), which needs no
 * compiler — verified here via text_match grading rather than execution.
 *
 * Live round-trip per PRO_EXERCISE_TYPE_CHECKLIST.md.
 * Usage: node scripts/acceptanceContentModules.mjs
 */
import "dotenv/config";

const BASE       = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

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
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 62)} ${detail}`);
  if (!ok) process.exitCode = 1;
}
async function submit(exerciseId, code) {
  const r = await http("POST", `/v1/pro/exercises/${exerciseId}/submit`, { code });
  return r;
}

console.log("PRO-TRACK JAVA — J-series content modules (M49/M50/M51)");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register fresh test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else { step("Login as test user", true); }
await http("POST", "/v1/pro/enroll", { trackKey: "pro_java" });

// ── Module reachability (all three) ─────────────────────────────────────────
console.log("\nModule reachability");
for (const [mod, name] of [["java_m49", "Modern Java"], ["java_m50", "Engineering Hygiene"], ["java_m51", "Technical Communication"]]) {
  r = await http("GET", `/v1/pro/tracks/java/modules/${mod}`);
  const topics = r.payload?.data?.topics || [];
  step(`${mod} (${name}) → 200 with 5 topics`, r.status === 200 && topics.length === 5, `status=${r.status} topics=${topics.length}`);
}

// ── pattern_match grading — one per module (correct → pass) ─────────────────
console.log("\npattern_match grading (correct answer → passed)");
const PM = [
  ["java_m49_t1_pm_1", "records"],
  ["java_m50_t1_pm_1", "mvn package"],
  ["java_m51_t1_pm_1", "fix_n_plus_one_orders"],
];
for (const [id, correct] of PM) {
  r = await submit(id, correct);
  step(`${id} correct → passed`, r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);
}
// one wrong answer → not passed
r = await submit("java_m50_t1_pm_1", "mvn compile");
step("java_m50_t1_pm_1 wrong → passed=false", r.status === 200 && r.payload?.data?.passed === false, `passed=${r.payload?.data?.passed}`);

// ── client-safe payload: pattern_match exercise hides the answer key ────────
console.log("\nclient-safe payload");
r = await http("GET", "/v1/pro/exercises/java_m51_t1_pm_1");
const ex = r.payload?.data;
step("GET exercise → 200 with options", r.status === 200 && (ex?.blanks?.[0]?.options || []).length > 0, `options=${(ex?.blanks?.[0]?.options || []).length}`);
step("testCases / correct NOT leaked", !("testCases" in (ex || {})) && !JSON.stringify(ex || {}).includes("\"correct\""), "checked");

// ── text_match grading (predict_output) ─────────────────────────────────────
console.log("\ntext_match grading");
r = await submit("java_m50_t1_ex_1", "mvn clean");
step("java_m50_t1_ex_1 'mvn clean' → passed", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);
r = await submit("java_m51_t4_ex_1", "feat: add retry to PaymentClient");
step("java_m51_t4_ex_1 commit subject → passed", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);

// ── M49 predict_output grading (no compiler — works on any JDK) ─────────────
console.log("\nM49 predict_output grading (text_match — no Judge0 / JDK-version-proof)");
r = await submit("java_m49_t5_ex_2", "2");                 // switch expression result
step("java_m49_t5_ex_2 switch-expr output '2' → passed", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);
r = await submit("java_m49_t1_ex_1", "Point[x=3, y=4]\ntrue"); // record toString + equals
step("java_m49_t1_ex_1 record output → passed", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — M49/M50/M51 content verified end-to-end");
}
