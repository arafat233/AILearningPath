/**
 * Audit — pro-track exercise GRADING integrity (pattern_match).
 * The structural track audits check counts/orphans/dupes; this one verifies
 * each pattern_match exercise will actually GRADE CORRECTLY:
 *   1. testCases[0].type === "pattern_match"
 *   2. testCases[0].correct === expectedSolution           (grader uses testCase.correct)
 *   3. correct answer IS one of blanks[0].options          (selectable / not orphaned)
 *   4. options has >= 2 entries, all non-empty, no duplicates
 *   5. an explanation is present
 * Per [[project_pro_exercise_grading]]: pattern_match grades on testCase.correct.
 * Usage:  node config/auditProGrading.mjs   ·   npm: npm run audit:pro-grading
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProExercise } from "../models/proModels.js";

const TRACKS = ["pro_lld", "pro_sysd"];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("=== PRO EXERCISE GRADING AUDIT (pattern_match) ===\n");
  let grandTotal = 0, grandBad = 0;
  for (const trackKey of TRACKS) {
    const exs = await ProExercise.find({ trackKey, type: "pattern_match" }).lean();
    const problems = [];
    for (const ex of exs) {
      const tc = (ex.testCases || [])[0];
      const opts = ((ex.blanks || [])[0] || {}).options || [];
      const id = ex.exerciseId;
      if (!tc || tc.type !== "pattern_match") { problems.push(`${id}: missing/wrong testCase type`); continue; }
      if (tc.correct == null || tc.correct === "") { problems.push(`${id}: empty testCase.correct`); continue; }
      if (tc.correct !== ex.expectedSolution) { problems.push(`${id}: testCase.correct !== expectedSolution`); }
      if (!opts.includes(tc.correct)) { problems.push(`${id}: correct answer NOT in options`); }
      if (opts.length < 2) { problems.push(`${id}: <2 options`); }
      if (opts.some((o) => o == null || o === "")) { problems.push(`${id}: empty option`); }
      if (new Set(opts).size !== opts.length) { problems.push(`${id}: duplicate options`); }
      if (!tc.explanation || tc.explanation === "") { problems.push(`${id}: missing explanation`); }
    }
    grandTotal += exs.length; grandBad += problems.length;
    console.log(`${trackKey}: ${exs.length} pattern_match exercises`);
    console.log(`  grading-correct = ${exs.length - new Set(problems.map((p) => p.split(":")[0])).size}/${exs.length}`);
    if (problems.length) {
      console.log(`  ✗ ${problems.length} issue(s):`);
      problems.slice(0, 30).forEach((p) => console.log(`     - ${p}`));
      if (problems.length > 30) console.log(`     … +${problems.length - 30} more`);
    } else {
      console.log(`  ✓ every exercise grades correctly (correct ∈ options, == expectedSolution, has explanation)`);
    }
    console.log("");
  }
  console.log(grandBad === 0
    ? `✓ PASS — ${grandTotal} pattern_match exercises across both tracks all grade correctly.`
    : `✗ FAIL — ${grandBad} grading issue(s) across ${grandTotal} exercises.`);
  await mongoose.disconnect();
  process.exit(grandBad === 0 ? 0 : 1);
}
run().catch((err) => { console.error(err.message); process.exit(1); });
