/**
 * seedRevealTopics — standalone seed for Problem-First Reveal (ROADMAP G).
 *
 * Sets revealStrategy="first_attempt" + a neutral problemTitle on the 11
 * reveal-gated topics. These flags previously lived ONLY in seedJavaPilot's
 * REVEAL_TOPICS map, which forced a full 232-topic re-seed to apply them.
 * This standalone script applies just the 11 flags — idempotent upserts,
 * no exercise/content churn. Keep REVEAL in sync with seedJavaPilot.js.
 */
import "dotenv/config";
import mongoose from "mongoose";

const REVEAL = {
  java_m30_t1: "Find a pair that sums to a target — without nested loops",
  java_m30_t2: "Best score over any fixed-size window of a stream",
  java_m31_t2: "Locate a pattern inside a huge string, fast",
  java_m33_t2: "For each element, find the next larger one to its right",
  java_m34_t1: "Look up any item by key in near-constant time",
  java_m35_t1: "Visit every node of a tree in a meaningful order",
  java_m36_t1: "Always pull out the smallest item — efficiently",
  java_m37_t1: "Find the fewest hops between two points in a network",
  java_m38_t1: "Put a large list in order as fast as possible",
  java_m39_t1: "Search 5 million sorted items in microseconds",
  java_m41_t1: "Solve a problem riddled with overlapping subproblems",
};

await mongoose.connect(process.env.MONGO_URI);
const col = mongoose.connection.db.collection("protopics");

let matched = 0, modified = 0, missing = [];
for (const [topicId, problemTitle] of Object.entries(REVEAL)) {
  const r = await col.updateOne(
    { topicId },
    { $set: { revealStrategy: "first_attempt", problemTitle } }
  );
  if (r.matchedCount === 0) missing.push(topicId);
  matched  += r.matchedCount;
  modified += r.modifiedCount;
  console.log(`  ${topicId}: matched=${r.matchedCount} modified=${r.modifiedCount}`);
}
console.log(`\nDone — ${matched}/${Object.keys(REVEAL).length} matched, ${modified} updated.`);
if (missing.length) console.log("  ⚠ not found:", missing.join(", "));

await mongoose.disconnect();
process.exit(0);
