#!/usr/bin/env node
/**
 * Acceptance — LLD track (pro_lld), GAP #4 MVP. Live HTTP round-trip per
 * PRO_EXERCISE_TYPE_CHECKLIST.md + memory feedback_api_roundtrip_validation:
 * a green build + DB seed is NOT enough — new id formats / enums / route shapes
 * must be proven against a running server (the `_pm_`/`_fb_` 422 incident).
 *
 * Proves: pro_lld is listed + enrollable; the module + 12 topics are reachable;
 * one exercise of EVERY type returns 200 (not 422 — the id-pattern trap);
 * the client payload hides the answer key; pattern_match + predict_output
 * grading work. (code_scratch is GET-only here — grading needs the Judge0
 * sandbox, which isn't wired in local dev.)
 *
 * No Claude tokens, no Judge0. Usage: node scripts/acceptanceLld.mjs
 */
import "dotenv/config";

const BASE = process.env.ACCEPTANCE_API_URL
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
    } catch { await new Promise((r) => setTimeout(r, 1200)); }
  }
  throw new Error(`network: gave up on ${method} ${path}`);
}
const pad = (s, n) => String(s).padEnd(n);
function step(label, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"}  ${pad(label, 60)} ${detail}`);
  if (!ok) process.exitCode = 1;
}
async function submit(exerciseId, code) {
  return http("POST", `/v1/pro/exercises/${exerciseId}/submit`, { code });
}

console.log("LLD TRACK (pro_lld) — acceptance");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

// ── Auth ──
let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) {
  r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
  step("Register/login test user", r.status === 200 || r.status === 201, `status=${r.status}`);
} else { step("Login as test user", true); }

// ── Enroll ──
r = await http("POST", "/v1/pro/enroll", { trackKey: "pro_lld" });
step("Enroll in pro_lld", r.status === 200, `status=${r.status}`);

// ── Listed + enrolled ──
r = await http("GET", "/v1/pro/tracks");
const tracks = r.payload?.data || [];
const lld = tracks.find((t) => t.key === "pro_lld");
step("pro_lld appears in track list", !!lld, lld ? `name="${lld.name}"` : "missing");
step("pro_lld marked enrolled + totals set", !!lld?.enrolled && lld.totalTopics === 36 && lld.totalExercises === 112,
  `enrolled=${lld?.enrolled} topics=${lld?.totalTopics} ex=${lld?.totalExercises}`);

// ── Every module reachable with the expected topic count ──
console.log("\nModule reachability (all 5)");
const MODULES = [["lld_m1", 12], ["lld_m2", 3], ["lld_m3", 5], ["lld_m4", 8], ["lld_m5", 8]];
for (const [mid, n] of MODULES) {
  r = await http("GET", `/v1/pro/tracks/lld/modules/${mid}`);
  const tps = r.payload?.data?.topics || [];
  step(`${mid} → 200 with ${n} topics`, r.status === 200 && tps.length === n, `status=${r.status} topics=${tps.length}`);
}

// ── One exercise of EVERY type → 200 (the id-pattern 422 trap) ──
console.log("\nExercise reachability — one of each type (must be 200, not 422)");
const SAMPLES = [
  ["lld_m1_t1_pm_1", "M1 pattern_match"],
  ["lld_m1_t4_ex_1", "M1 code_scratch"],
  ["lld_m2_t1_ex_1", "M2 predict_output"],
  ["lld_m2_t1_ex_2", "M2 code_scratch"],
  ["lld_m3_t2_ex_1", "M3 predict_output"],
  ["lld_m4_t1_ex_1", "M4 code_scratch"],
  ["lld_m4_t8_pm_1", "M4 pattern_match"],
  ["lld_m5_t4_ex_1", "M5 code_scratch"],
  ["lld_m5_t8_pm_3", "M5 pattern_match"],
];
for (const [id, type] of SAMPLES) {
  r = await http("GET", `/v1/pro/exercises/${id}`);
  step(`GET ${id} (${type}) → 200`, r.status === 200, `status=${r.status}`);
}

// ── UML visual aids reach the client (GAP #4 polish) ──
console.log("\nUML visual aids");
r = await http("GET", "/v1/pro/topics/lld_m1_t4");
const va = r.payload?.data?.teaching?.visual_aid;
step("Strategy topic ships a UML svg", r.status === 200 && typeof va?.svg === "string" && va.svg.startsWith("<svg"),
  `type="${va?.type}" svgLen=${va?.svg?.length || 0}`);
r = await http("GET", "/v1/pro/topics/lld_m4_t8");
const va2 = r.payload?.data?.teaching?.visual_aid;
step("Visitor topic ships a UML svg", r.status === 200 && typeof va2?.svg === "string" && va2.svg.startsWith("<svg"),
  `svgLen=${va2?.svg?.length || 0}`);

// ── Client-safe payload (answer key hidden) ──
console.log("\nClient-safe payload");
r = await http("GET", "/v1/pro/exercises/lld_m1_t1_pm_1");
const ex = r.payload?.data;
step("pattern_match GET → has options", (ex?.blanks?.[0]?.options || []).length >= 2, `options=${(ex?.blanks?.[0]?.options || []).length}`);
step("answer key NOT leaked", !("testCases" in (ex || {})) && !JSON.stringify(ex || {}).includes("\"correct\""), "checked");

// ── Grading: pattern_match ──
console.log("\nGrading — pattern_match");
r = await submit("lld_m1_t1_pm_1", "Encapsulation");
step("correct answer → passed=true", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);
r = await submit("lld_m1_t1_pm_1", "Inheritance");
step("wrong answer → passed=false", r.status === 200 && r.payload?.data?.passed === false, `passed=${r.payload?.data?.passed}`);

r = await submit("lld_m3_t2_pm_1", "Composite");
step("M3 pattern_match correct → passed=true", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);

// ── Grading: predict_output (text_match — no compiler) ──
console.log("\nGrading — predict_output (text_match, no compiler)");
r = await submit("lld_m1_t1_ex_1", "Circle\nSquare");
step("M1 predict correct output → passed=true", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);
r = await submit("lld_m4_t4_ex_1", "Manager approves 50\nDirector approves 500");
step("M4 chain-of-responsibility predict → passed=true", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);

console.log("\n──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) {
  console.log("✗  Acceptance FAILED — see failed lines above");
  process.exit(1);
} else {
  console.log("✓  Acceptance PASSED — pro_lld verified end-to-end");
}
