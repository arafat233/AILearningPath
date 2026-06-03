/**
 * auditEdgeCases.mjs — ground-truth coverage audit for GAP #6 (per-problem
 * edge-case catalog). Same scope/denominator as auditAnimations.mjs (the 598
 * animatable DSA problems). Run AFTER EVERY batch; prints done/total per pattern
 * from the live DB + an integrity check so the checklist is never hand-estimated.
 *
 * "done" = the problem has a well-formed edge_cases array (≥2 entries, each with
 * a non-empty `case` AND `handling` string). Malformed entries count as broken.
 *
 * Usage: node config/auditEdgeCases.mjs            (local)
 *   prod: docker exec ailearningpath-api-1 node config/auditEdgeCases.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const DSA = /^java_m(29|3[0-9]|30_5|4[0-8]|41_5)_/;
const MOCK = /^java_m(42|45)_/;
const MIN = 2; // a real catalog needs at least two edge cases

function wellFormed(ec) {
  if (!Array.isArray(ec) || ec.length < MIN) return false;
  return ec.every((e) => e && typeof e.case === "string" && e.case.trim()
    && typeof e.handling === "string" && e.handling.trim());
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const E = mongoose.connection.collection("proexercises");
  const raw = await E.find({ trackKey: "pro_java", topicId: DSA, type: { $in: ["code_scratch", "algorithm"] } })
    .project({ topicId: 1, pattern: 1, edge_cases: 1 }).toArray();
  const mockCount = raw.filter((e) => MOCK.test(e.topicId)).length;
  const code = raw.filter((e) => !MOCK.test(e.topicId));

  const tot = {}, done = {};
  code.forEach((e) => {
    const p = e.pattern || "(untagged)";
    tot[p] = (tot[p] || 0) + 1;
    if (wellFormed(e.edge_cases)) done[p] = (done[p] || 0) + 1;
  });

  // integrity: any edge_cases present but NOT well-formed (wrong type, <MIN, or
  // an entry missing case/handling) is broken — must be 0.
  const broken = code.filter((e) => e.edge_cases != null
    && (Array.isArray(e.edge_cases) ? e.edge_cases.length > 0 : true)
    && !wellFormed(e.edge_cases));

  const totalCode = code.length;
  const animatable = totalCode - (tot["complexity-analysis"] || 0);
  const totalDone = code.filter((e) => wellFormed(e.edge_cases)).length;

  console.log(`\n=== EDGE-CASE CATALOG AUDIT ===`);
  console.log(`code=${totalCode} in-scope=${animatable} cataloged=${totalDone} remaining=${animatable - totalDone} pct=${Math.round(100 * totalDone / animatable)}%`);
  console.log(`integrity: malformed edge_cases (bad shape / <${MIN} entries / missing case|handling) = ${broken.length}${broken.length ? " → " + broken.map((e) => e.topicId).slice(0, 10).join(",") : " ✓"}`);
  console.log(`\npattern                 done/total   gaps`);
  Object.keys(tot).sort((a, b) => tot[b] - tot[a]).forEach((p) => {
    if (p === "complexity-analysis") return;
    const d = done[p] || 0, t = tot[p];
    const flag = d === 0 ? " ⬅ ZERO" : d < t ? "" : " ✅ FULL";
    console.log(`  ${p.padEnd(24)}${String(d).padStart(3)}/${String(t).padEnd(4)}${flag}`);
  });
  console.log(`\nout of scope: complexity-analysis ${tot["complexity-analysis"] || 0} (Big-O reasoning) + M42/M45 mock/interview ${mockCount} (timed practice)`);
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
