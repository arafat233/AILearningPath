/**
 * auditAnimations.mjs — ground-truth coverage audit for GAP #1 (DSA animations).
 * Run AFTER EVERY batch. Prints done/total per pattern from the live DB so the
 * checklist is never hand-estimated. Enumerates EVERY pattern incl. untagged,
 * so a zero-coverage pattern or the no-tag bucket can't hide.
 *
 * Usage: node config/auditAnimations.mjs            (local)
 *   prod: docker exec ailearningpath-api-1 node config/auditAnimations.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const DSA = /^java_m(29|3[0-9]|30_5|4[0-8]|41_5)_/;
// M42 (Interview Prep) + M45 (Mock Coding) are timed mock/practice rounds, not
// algorithm-concept problems → out of scope for per-problem animations (like
// complexity-analysis). They account for the "untagged" bucket.
const MOCK = /^java_m(42|45)_/;

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const E = mongoose.connection.collection("proexercises");
  const raw = await E.find({ trackKey: "pro_java", topicId: DSA, type: { $in: ["code_scratch", "algorithm"] } })
    .project({ topicId: 1, pattern: 1, animation: 1 }).toArray();
  const mockCount = raw.filter((e) => MOCK.test(e.topicId)).length;
  const code = raw.filter((e) => !MOCK.test(e.topicId));
  const tot = {}, anim = {};
  code.forEach((e) => { const p = e.pattern || "(untagged)"; tot[p] = (tot[p] || 0) + 1; if (e.animation) anim[p] = (anim[p] || 0) + 1; });

  // integrity: every animation must use a registered renderer and have steps
  const VALID = ["array-pointers", "stack", "grid", "linked-list", "tree"];
  const withAnim = code.filter((e) => e.animation);
  const broken = withAnim.filter((e) => !VALID.includes(e.animation.kind) || !(e.animation.steps && e.animation.steps.length));

  const totalCode = code.length;
  const totalAnim = withAnim.length;
  const animatable = totalCode - (tot["complexity-analysis"] || 0);

  console.log(`\n=== ANIMATION COVERAGE AUDIT ===`);
  console.log(`code=${totalCode} animatable=${animatable} animated=${totalAnim} remaining=${animatable - totalAnim} pct=${Math.round(100 * totalAnim / animatable)}%`);
  console.log(`integrity: broken animations (bad kind or no steps) = ${broken.length}${broken.length ? " → " + broken.map((e) => e.pattern).join(",") : " ✓"}`);
  console.log(`\npattern                 done/total   gaps`);
  Object.keys(tot).sort((a, b) => tot[b] - tot[a]).forEach((p) => {
    if (p === "complexity-analysis") return;
    const d = anim[p] || 0, t = tot[p];
    const flag = d === 0 ? " ⬅ ZERO" : d < t ? "" : " ✅ FULL";
    console.log(`  ${p.padEnd(24)}${String(d).padStart(3)}/${String(t).padEnd(4)}${flag}`);
  });
  console.log(`\nout of scope: complexity-analysis ${tot["complexity-analysis"] || 0} (Big-O reasoning) + M42/M45 mock/interview ${mockCount} (timed practice, not concept problems)`);
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
