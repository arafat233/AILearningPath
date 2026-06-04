#!/usr/bin/env node
/**
 * Acceptance — System Design track (pro_sysd), GAP #2. Live HTTP round-trip:
 * pro_sysd is listed + enrollable; module + 12 topics reachable; pattern_match
 * exercises return 200 (not 422); answer key hidden; grading correct; an
 * architecture flow visual_aid reaches the client.
 *
 * Usage: node scripts/acceptanceSysd.mjs   (backend running)
 */
import "dotenv/config";

const BASE = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

let cookies = "";
async function http(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (cookies) headers.Cookie = cookies;
  for (let a = 0; a < 5; a++) {
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
function step(label, ok, detail = "") { console.log(`${ok ? "✓" : "✗"}  ${pad(label, 58)} ${detail}`); if (!ok) process.exitCode = 1; }
const submit = (id, code) => http("POST", `/v1/pro/exercises/${id}/submit`, { code });

console.log("SYSTEM DESIGN TRACK (pro_sysd) — acceptance");
console.log("Backend:", BASE);
console.log("──────────────────────────────────────────────────────────────────");

let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) { r = await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS }); step("Register/login test user", r.status === 200 || r.status === 201, `status=${r.status}`); }
else step("Login as test user", true);

r = await http("POST", "/v1/pro/enroll", { trackKey: "pro_sysd" });
step("Enroll in pro_sysd", r.status === 200, `status=${r.status}`);

r = await http("GET", "/v1/pro/tracks");
const tr = (r.payload?.data || []).find((t) => t.key === "pro_sysd");
step("pro_sysd appears in track list", !!tr, tr ? `name="${tr.name}"` : "missing");
step("enrolled + totals set (34 topics, 104 ex)", !!tr?.enrolled && tr.totalTopics === 34 && tr.totalExercises === 104,
  `enrolled=${tr?.enrolled} topics=${tr?.totalTopics} ex=${tr?.totalExercises}`);

console.log("\nModule reachability (all 4)");
for (const [mid, n] of [["sysd_m1", 12], ["sysd_m2", 10], ["sysd_m3", 6], ["sysd_m4", 6]]) {
  r = await http("GET", `/v1/pro/tracks/system-design/modules/${mid}`);
  const tps = r.payload?.data?.topics || [];
  step(`${mid} → 200 with ${n} topics`, r.status === 200 && tps.length === n, `status=${r.status} topics=${tps.length}`);
}

console.log("\nExercise reachability (pattern_match → 200, not 422)");
for (const id of ["sysd_m1_t1_pm_1", "sysd_m2_t8_pm_1", "sysd_m3_t1_pm_2", "sysd_m4_t5_pm_2"]) {
  r = await http("GET", `/v1/pro/exercises/${id}`);
  step(`GET ${id} → 200`, r.status === 200, `status=${r.status}`);
}

console.log("\nClient-safe payload");
r = await http("GET", "/v1/pro/exercises/sysd_m1_t1_pm_1");
const ex = r.payload?.data;
step("has options", (ex?.blanks?.[0]?.options || []).length >= 2, `options=${(ex?.blanks?.[0]?.options || []).length}`);
step("answer key NOT leaked", !("testCases" in (ex || {})) && !JSON.stringify(ex || {}).includes("\"correct\""), "checked");

console.log("\nArchitecture visual aid reaches client");
r = await http("GET", "/v1/pro/topics/sysd_m1_t3");
const va = r.payload?.data?.teaching?.visual_aid;
step("scaling topic ships a flow visual_aid", r.status === 200 && typeof va?.description === "string" && va.description.includes("→"),
  `type="${va?.type}"`);

console.log("\nGrading — pattern_match");
r = await submit("sysd_m1_t8_pm_1", "Network partitions are unavoidable, so P is mandatory — leaving C vs A during a partition");
step("CAP correct answer → passed=true", r.status === 200 && r.payload?.data?.passed === true, `passed=${r.payload?.data?.passed}`);
r = await submit("sysd_m1_t8_pm_1", "Because you can freely pick any two of the three");
step("CAP wrong answer → passed=false", r.status === 200 && r.payload?.data?.passed === false, `passed=${r.payload?.data?.passed}`);

console.log("──────────────────────────────────────────────────────────────────");
if (process.exitCode === 1) { console.log("✗  Acceptance FAILED"); process.exit(1); }
else console.log("✓  Acceptance PASSED — pro_sysd verified end-to-end");
