/**
 * Pro Java — Topic DAG validator (Ph5)
 *
 * The seedJavaPilot.js seed already writes ProTopic.prerequisites from
 * topic.json metadata.prerequisites. This script validates that the
 * stored graph is coherent:
 *   1. Every prerequisite topicId references an existing ProTopic.
 *   2. No cycles exist (Kahn's algorithm).
 *   3. Reports per-module node counts and total edge count.
 *
 * Exits 0 if valid, 1 if gaps found.
 *
 * Usage: node config/seedJavaTopicDAG.mjs
 * npm:   npm run audit:pro-java-dag
 */

import "dotenv/config";
import mongoose from "mongoose";
import { ProTopic } from "../models/proModels.js";

const TRACK_KEY = "pro_java";

// Kahn's topological sort — returns true if a cycle exists.
function hasCycle(nodeIds, edges) {
  const inDegree = new Map(nodeIds.map(id => [id, 0]));
  const adj      = new Map(nodeIds.map(id => [id, []]));
  for (const [from, to] of edges) {
    adj.get(from)?.push(to);
    inDegree.set(to, (inDegree.get(to) || 0) + 1);
  }
  const queue   = nodeIds.filter(id => inDegree.get(id) === 0);
  let   visited = 0;
  while (queue.length) {
    const node = queue.shift();
    visited++;
    for (const nb of adj.get(node) || []) {
      const deg = (inDegree.get(nb) || 0) - 1;
      inDegree.set(nb, deg);
      if (deg === 0) queue.push(nb);
    }
  }
  return visited < nodeIds.length;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const topics = await ProTopic
    .find({ trackKey: TRACK_KEY }, { topicId: 1, moduleId: 1, name: 1, prerequisites: 1 })
    .lean();

  const topicIds = new Set(topics.map(t => t.topicId));

  console.log("\n══════════════════════════════════════════════════════════════════════");
  console.log("PRO JAVA TOPIC DAG — Ph5 Validation");
  console.log("══════════════════════════════════════════════════════════════════════");
  console.log(`Topics loaded: ${topics.length}`);

  const edges         = [];
  const danglingRefs  = [];
  let   totalEdges    = 0;
  let   topicsWithPre = 0;

  for (const topic of topics) {
    const prereqs = topic.prerequisites || [];
    if (prereqs.length) topicsWithPre++;
    for (const prereqId of prereqs) {
      totalEdges++;
      if (!topicIds.has(prereqId)) {
        danglingRefs.push({ topicId: topic.topicId, missing: prereqId });
      } else {
        edges.push([prereqId, topic.topicId]); // prereq → topic
      }
    }
  }

  console.log(`Nodes (ProTopic): ${topics.length}`);
  console.log(`Edges (prereq → topic): ${totalEdges}`);
  console.log(`Topics with prerequisites: ${topicsWithPre}`);
  console.log(`Topics with no prerequisites (roots): ${topics.length - topicsWithPre}`);

  let hasErrors = false;

  // Dangling refs
  if (danglingRefs.length) {
    hasErrors = true;
    console.log(`\n✗ DANGLING REFS (${danglingRefs.length}):`);
    for (const { topicId, missing } of danglingRefs) {
      console.log(`  ${topicId} → missing prereq: ${missing}`);
    }
  } else {
    console.log("\n✓ No dangling prerequisite references");
  }

  // Cycle detection
  const cycleDetected = hasCycle([...topicIds], edges);
  if (cycleDetected) {
    hasErrors = true;
    console.log("✗ CYCLE DETECTED in prerequisite graph");
  } else {
    console.log("✓ No cycles detected");
  }

  // Per-module breakdown
  const byModule = {};
  for (const t of topics) {
    byModule[t.moduleId] = (byModule[t.moduleId] || 0) + 1;
  }
  console.log("\nTopics per module:");
  for (const [mod, count] of Object.entries(byModule).sort()) {
    console.log(`  ${mod.padEnd(12)} ${count} topic${count !== 1 ? "s" : ""}`);
  }

  console.log("\n══════════════════════════════════════════════════════════════════════");
  if (hasErrors) {
    console.log("RESULT: ✗ FAIL — DAG has issues (see above)");
  } else {
    console.log(`RESULT: ✅ PASS — DAG valid (${topics.length} nodes, ${totalEdges} edges, no cycles)`);
  }
  console.log("══════════════════════════════════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(hasErrors ? 1 : 0);
}

run().catch(err => {
  console.error("seedJavaTopicDAG failed:", err.message);
  process.exit(1);
});
