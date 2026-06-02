/**
 * fixM36TestcaseExpectations.js — Fix 2 wrong expected_stdout_contains values in
 * ORIGINAL M36 (Heaps) T2 exercises, found by the Judge0 smoke test (2026-06-03).
 *
 * Both reference programs are algorithmically correct (canonical LeetCode
 * solutions); the testcase expectations were stale, so a CORRECT student
 * submission would have been graded wrong in production.
 *
 *   java_m36_t2_ex_1 (Kth Largest in Stream #703): prints 4,5,5,8 — expected list
 *     wrongly required "9" (never output). Removed "9".
 *   java_m36_t2_ex_9 (Furthest Building #1642): with bricks=10 the program prints
 *     6,7 — expected list wrongly required "4" (the answer for bricks=5). 4 -> 6.
 *
 * Verified: both PASS on Judge0 (JDK 21) after the fix. Idempotent.
 * Usage: node config/fixM36TestcaseExpectations.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const FIXES = [
  { exerciseId: "java_m36_t2_ex_1", testCases: [{ type: "execution", expected_stdout_contains: ["4", "5", "8", "O(log k)"] }] },
  { exerciseId: "java_m36_t2_ex_9", testCases: [{ type: "execution", expected_stdout_contains: ["6", "7", "Greedy: use ladders"] }] },
];

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const E = mongoose.connection.collection("proexercises");
  for (const f of FIXES) {
    const r = await E.updateOne({ exerciseId: f.exerciseId }, { $set: { testCases: f.testCases } });
    console.log(`${r.matchedCount ? "✓" : "✗ MISSING"} ${f.exerciseId}`);
  }
  console.log("\n✅ M36 testcase expectations fixed.");
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
