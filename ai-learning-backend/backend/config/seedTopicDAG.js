/**
 * Seed: Fine-grained topic DAG (43 nodes, prerequisite graph)
 * Source: recommender_prerequisites.json
 *
 * Creates one Topic document per fine-grained topic (e.g. "Euclid's Division Lemma").
 * Each document stores:
 *   - topicId  — machine key used by adaptive routing ("ch1_s1_c1_t1")
 *   - level    — DAG depth 0-7 (0 = no prerequisites)
 *   - prerequisites — array of topicId strings that must be mastered first
 *
 * These are separate from the broad chapter-level Topic documents (e.g. "Real Numbers").
 * Safe to re-run — upserts on { topicId }.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedTopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { join } from "path";
import { Topic } from "../models/index.js";

const DATA_DIR = process.env.QUESTIONS_DIR || "C:\\Users\\LENOVO\\Downloads\\Algo for question";

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");

  const raw    = JSON.parse(readFileSync(join(DATA_DIR, "recommender_prerequisites.json"), "utf8"));
  const topics = raw.topics;

  const ops = Object.entries(topics).map(([topicId, data]) => ({
    updateOne: {
      filter: { topicId },
      update: {
        $setOnInsert: {
          topicId,
          name:          data.name,
          prerequisites: data.prerequisites,
          level:         data.level,
          subject:       "Mathematics",
          grade:         "10",
        },
      },
      upsert: true,
    },
  }));

  const result   = await Topic.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount ?? 0;
  const skipped  = ops.length - inserted;
  console.log(`Topic DAG: +${inserted} inserted, ${skipped} already existed (${ops.length} total nodes)`);
  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
