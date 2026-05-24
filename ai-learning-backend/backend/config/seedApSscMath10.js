/**
 * AP SSC Class 10 Mathematics — Content + Question Migration
 *
 * Strategy: AP SSC Math 10 = NCERT Math 10 (identical curriculum, Telugu-medium
 * state schools use the same NCERT textbook with Telugu translation).
 * This script clones all cbse_math10_* NcertTopicContent docs and Questions
 * into ap_ssc_math10_* equivalents with examBoard="AP_SSC".
 *
 * Safe to re-run (upsert by topicId for content, questionId for questions).
 * Run AFTER confirming CBSE Math 10 content is complete (npm run audit:math:cbse10).
 *
 * Usage: node config/seedApSscMath10.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { Question } from "../models/index.js";

const SRC_PREFIX = "cbse_math10_";
const DST_PREFIX = "ap_ssc_math10_";
const DST_BOARD  = "AP_SSC";

function swapPrefix(str) {
  if (!str) return str;
  if (str.startsWith(SRC_PREFIX)) return DST_PREFIX + str.slice(SRC_PREFIX.length);
  return str;
}

async function cloneTopicContent() {
  const src = await NcertTopicContent.find({ topicId: { $regex: /^cbse_math10_/ } }).lean();
  console.log(`  Found ${src.length} CBSE Math 10 NcertTopicContent docs to clone.`);
  if (src.length === 0) {
    console.warn("  ⚠ No source content found. Run CBSE Math 10 seeds first.");
    return 0;
  }

  let upserted = 0;
  for (const doc of src) {
    const newTopicId = swapPrefix(doc.topicId);
    // Strip _id so Mongoose creates a new doc
    const { _id, __v, createdAt, updatedAt, ...rest } = doc;
    await NcertTopicContent.findOneAndUpdate(
      { topicId: newTopicId },
      { $set: { ...rest, topicId: newTopicId } },
      { upsert: true, new: true }
    );
    upserted++;
  }
  console.log(`  ✓ Upserted ${upserted} AP SSC NcertTopicContent docs.`);
  return upserted;
}

async function cloneQuestions() {
  const src = await Question.find({ topicId: { $regex: /^cbse_math10_/ } }).lean();
  console.log(`  Found ${src.length} CBSE Math 10 questions to clone.`);
  if (src.length === 0) {
    console.warn("  ⚠ No source questions found with cbse_math10_ prefix.");
    console.warn("    Questions using old topic-name topicIds will not be cloned.");
    console.warn("    Run separate AP SSC question seed if needed.");
    return 0;
  }

  let upserted = 0;
  let skipped  = 0;
  for (const doc of src) {
    const newTopicId    = swapPrefix(doc.topicId);
    const newQuestionId = doc.questionId
      ? doc.questionId.replace("cbse10", "ap_ssc10").replace("cbse_math10", "ap_ssc_math10")
      : null;
    const { _id, __v, createdAt, updatedAt, ...rest } = doc;

    // Dedup by questionId (if present) or by topicId+questionText
    const filter = newQuestionId
      ? { questionId: newQuestionId }
      : { topicId: newTopicId, questionText: doc.questionText };

    try {
      await Question.findOneAndUpdate(
        filter,
        {
          $set: {
            ...rest,
            topicId:    newTopicId,
            topic:      swapPrefix(doc.topic)      || doc.topic,
            subtopic:   swapPrefix(doc.subtopic)   || doc.subtopic,
            examBoard:  DST_BOARD,
            questionId: newQuestionId,
          },
        },
        { upsert: true, new: true }
      );
      upserted++;
    } catch (err) {
      if (err.code === 11000) { skipped++; }
      else throw err;
    }
  }
  console.log(`  ✓ Upserted ${upserted} AP SSC questions. Skipped ${skipped} (already exist).`);
  return upserted;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("\n══════════════════════════════════════════════════════════════════");
  console.log("  AP SSC Math 10 — Content + Question Migration");
  console.log("  Source prefix : cbse_math10_  (CBSE Class 10 NCERT)");
  console.log("  Target prefix : ap_ssc_math10_ (AP SSC Class 10)");
  console.log("══════════════════════════════════════════════════════════════════\n");

  console.log("Step 1/2 — Cloning NcertTopicContent...");
  const contentCount = await cloneTopicContent();

  console.log("\nStep 2/2 — Cloning Questions...");
  const questionCount = await cloneQuestions();

  console.log("\n══════════════════════════════════════════════════════════════════");
  console.log(`  DONE  — ${contentCount} topics  |  ${questionCount} questions migrated`);
  console.log("  Next:  npm run seed:ap-ssc-math10-dag");
  console.log("         npm run rag:build-ap-ssc-math10");
  console.log("         npm run audit:math:ap-ssc-10");
  console.log("══════════════════════════════════════════════════════════════════\n");

  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
