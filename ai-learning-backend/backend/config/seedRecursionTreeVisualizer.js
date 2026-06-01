/**
 * seedRecursionTreeVisualizer — wire the `recursion-tree` visualizer (I1) to
 * M40-T1 (Backtracking Template) and M41-T1 (DP Fundamentals), the two
 * interview-critical topics that had no visualizer.
 *
 * Integration concern (like all visualizer wiring) — kept out of topic.json.
 * Idempotent: re-running just re-sets the same field.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProTopic } from "../models/proModels.js";

const WIRES = [
  { topicId: "java_m40_t1", kind: "recursion-tree", config: { defaultDemo: "subsets" } },
  { topicId: "java_m41_t1", kind: "recursion-tree", config: { defaultDemo: "fib_memo" } },
];

await mongoose.connect(process.env.MONGO_URI);

let updated = 0;
for (const w of WIRES) {
  const res = await ProTopic.updateOne(
    { topicId: w.topicId },
    { $set: { visualizer: { kind: w.kind, config: w.config } } }
  );
  if (res.matchedCount === 0) {
    console.warn(`  ⚠ ${w.topicId} not found — skipped`);
  } else {
    updated += res.modifiedCount;
    console.log(`  ✓ ${w.topicId} → ${w.kind}`);
  }
}

console.log(`\nDone — ${updated} topic(s) wired to recursion-tree.`);
await mongoose.disconnect();
process.exit(0);
