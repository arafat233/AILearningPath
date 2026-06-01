/**
 * seedLighthouseTopics — set freeAccess=true on the 10 designated topics.
 * Idempotent. Run whenever the list changes.
 *
 * D5.1 (ROADMAP): Open landmark topics for unauthenticated browsing so
 * newcomers can experience the teaching content before signing up.
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProTopic } from "../models/proModels.js";

const LIGHTHOUSE = [
  "java_m1_t1",   // Hello World & Setup
  "java_m4_t1",   // Classes & Objects (memory-model visualizer)
  "java_m5_t1",   // Inheritance Basics
  "java_m6_t1",   // ArrayList
  "java_m30_t1",  // Two Pointers (array-pointers visualizer)
  "java_m35_t1",  // Tree Traversals (tree-traversal visualizer)
  "java_m36_t1",  // Heap Fundamentals (heap visualizer)
  "java_m37_t1",  // Graph Representation (graph visualizer)
  "java_m38_t1",  // Comparison Sorts (sorting-sandbox visualizer)
  "java_m39_t1",  // Binary Search Basics (binary-search visualizer)
];

await mongoose.connect(process.env.MONGO_URI);

// Clear any previously freed topics not in the current list
await ProTopic.updateMany({ freeAccess: true, topicId: { $nin: LIGHTHOUSE } }, { $set: { freeAccess: false } });

const result = await ProTopic.updateMany(
  { topicId: { $in: LIGHTHOUSE } },
  { $set: { freeAccess: true } }
);

console.log(`Lighthouse topics set: ${result.modifiedCount} updated, ${result.matchedCount} matched`);

// Verify
const confirmed = await ProTopic.find({ freeAccess: true }).select("topicId name").lean();
console.log("Free-access topics:");
confirmed.forEach(t => console.log(`  ✓ ${t.topicId}: ${t.name}`));

await mongoose.disconnect();
process.exit(0);
