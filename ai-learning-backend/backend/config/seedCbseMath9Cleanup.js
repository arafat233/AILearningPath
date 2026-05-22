/**
 * seedCbseMath9Cleanup.js
 *
 * Removes the OLD CBSE Class 9 Mathematics documents (v1 single-topic and v2
 * sub-topic expansion, all keyed `math9_*`) that the standardized pilot
 * replaces. The new content uses board-prefixed `cbse_math9_*` IDs — those are
 * NOT touched, because `cbse_math9_...` does not match the `^math9_` filter.
 *
 * Cleared collections:
 *   - NcertTopicContent  (topicId  ^math9_)   — old teaching content
 *   - Question           (topicId  ^math9_)   — old MCQs
 *   - Topic              (topicId  ^math9_)   — old prerequisite-DAG nodes
 *
 * NcertChapter / Chapter docs are intentionally left in place: they are not
 * consumed by the standardized `cbse_math9_*` rendering path, and removing them
 * would also strip grade-9 context from the legacy NcertChapter-based RAG index.
 *
 * Safe to re-run (idempotent — after the first run there is nothing to delete).
 *
 * Usage:
 *   node config/seedCbseMath9Cleanup.js          (delete)
 *   node config/seedCbseMath9Cleanup.js --dry    (report counts only, no writes)
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { Question, Topic } from "../models/index.js";

const OLD_ID = /^math9_/;          // legacy v1 + v2 — NOT cbse_math9_
const dryRun = process.argv.includes("--dry");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const targets = [
    ["NcertTopicContent", NcertTopicContent, { topicId: OLD_ID }],
    ["Question",          Question,          { topicId: OLD_ID }],
    ["Topic",             Topic,             { topicId: OLD_ID }],
  ];

  let totalDeleted = 0;
  for (const [label, Model, filter] of targets) {
    const count = await Model.countDocuments(filter);
    if (dryRun) {
      console.log(`[dry-run] ${label.padEnd(20)} would delete ${count}`);
      continue;
    }
    const { deletedCount } = await Model.deleteMany(filter);
    totalDeleted += deletedCount;
    console.log(`✓ ${label.padEnd(20)} deleted ${deletedCount}`);
  }

  if (!dryRun) console.log(`\n${totalDeleted} old math9_* documents removed.`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
