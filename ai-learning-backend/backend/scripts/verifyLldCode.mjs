#!/usr/bin/env node
/**
 * verifyLldCode — compile-and-run every code_scratch exercise's REFERENCE
 * SOLUTION through the real grader (Judge0) and assert it passes its own
 * expected_stdout. Catches authoring bugs the structural audit can't: a
 * non-compiling solution or a wrong expected output. Requires JUDGE0_URL.
 *
 * Reads expectedSolution straight from the DB (the answer key is never exposed
 * over the API) and submits it via the enrolled-user flow.
 *
 * Usage: node scripts/verifyLldCode.mjs   (backend must be running + enrolled)
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProExercise } from "../models/proModels.js";

const BASE = process.env.ACCEPTANCE_API_URL
  || `${(process.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "")}/api`;
const TEST_EMAIL = process.env.PILOT_TEST_EMAIL || "pilot_acceptance@stellar.dev";
const TEST_PASS  = process.env.PILOT_TEST_PASS  || "PilotPass1!";

let cookies = "";
async function http(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  if (cookies) headers.Cookie = cookies;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const sc = res.headers.get("set-cookie");
  if (sc) cookies = sc.split(";")[0] + "; " + (cookies || "");
  let payload; try { payload = await res.json(); } catch { payload = null; }
  return { status: res.status, payload };
}

await mongoose.connect(process.env.MONGO_URI);
const exercises = await ProExercise.find({ trackKey: "pro_lld", type: "code_scratch" })
  .select("exerciseId expectedSolution testCases").sort({ exerciseId: 1 }).lean();
await mongoose.disconnect();

console.log(`Verifying ${exercises.length} code_scratch reference solutions via Judge0`);
console.log("Backend:", BASE, "·  Judge0:", process.env.JUDGE0_URL || "(unset!)");
console.log("──────────────────────────────────────────────────────────────────");

let r = await http("POST", "/auth/login", { email: TEST_EMAIL, password: TEST_PASS });
if (r.status !== 200) await http("POST", "/auth/register", { name: "Pilot Tester", email: TEST_EMAIL, password: TEST_PASS });
await http("POST", "/v1/pro/enroll", { trackKey: "pro_lld" });

let pass = 0, fail = 0;
for (const ex of exercises) {
  const expectedStdout = ex.testCases?.[0]?.expected_stdout ?? "(none)";
  // eslint-disable-next-line no-await-in-loop
  r = await http("POST", `/v1/pro/exercises/${ex.exerciseId}/submit`, { code: ex.expectedSolution });
  const passed = r.payload?.data?.passed === true;
  const status = r.payload?.data?.sandboxResult?.status || r.status;
  console.log(`${passed ? "✓" : "✗"}  ${ex.exerciseId.padEnd(20)} passed=${passed}  [${status}]`);
  if (!passed) {
    console.log(`     expected_stdout: ${JSON.stringify(expectedStdout)}`);
    const got = r.payload?.data?.sandboxResult?.stdout;
    if (got != null) console.log(`     got stdout:      ${JSON.stringify(got)}`);
    const msgs = (r.payload?.data?.testResults || []).map((t) => t.message).filter(Boolean);
    if (msgs.length) console.log(`     ${msgs.join(" | ")}`);
    fail++;
  } else pass++;
}

console.log("──────────────────────────────────────────────────────────────────");
console.log(`${fail === 0 ? "✓" : "✗"}  code_scratch reference solutions: ${pass}/${exercises.length} pass`);
process.exit(fail === 0 ? 0 : 1);
