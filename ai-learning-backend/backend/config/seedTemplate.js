/**
 * SEED TEMPLATE — copy this file, rename it, fill in the TODOs.
 *
 * Naming convention:
 *   seedCbseMath{Grade}Content.js     ← CBSE Math teaching content (NcertTopicContent)
 *   seedCbseMath{Grade}Questions.js   ← CBSE Math questions (Question)
 *   seedIcse{Subject}{Grade}Content.js
 *   seedIcse{Subject}{Grade}Questions.js
 *
 * Board guards (do not remove):
 *   - Every NcertTopicContent doc MUST carry { subject, examBoard, grade }
 *   - Every Question doc MUST carry { examBoard, grade }
 *   - topicId prefix MUST match the board:
 *       CBSE  → no prefix restriction (e.g. math10_ch1_..., sci_ch1_...)
 *       ICSE  → icse_<subject><grade>_<ch>_<slug>  (e.g. icse_math10_ch1_gst_basics)
 *       SSC   → ssc_<grade>_<subject>_...
 *       IB    → ib_<grade>_<subject>_...
 *
 * Run: node config/seedThisFile.js
 *
 * Re-running is safe — all writes use upsert (updateOne + upsert:true or findOneAndUpdate).
 */

import mongoose from "mongoose";
import dotenv   from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// ── env ───────────────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ── models ────────────────────────────────────────────────────────────────────
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
// import { Question } from "../models/index.js";  // uncomment for question seeds

// ── CONFIG — fill these in ────────────────────────────────────────────────────
const BOARD = "CBSE";    // TODO: "CBSE" | "ICSE" | "IB" | "SSC" | "State Board"
const GRADE = "10";      // TODO: grade string, e.g. "10", "9"
const SUBJECT = "Mathematics"; // TODO: full subject name
const TOPIC_ID_PREFIX = `math${GRADE}_`;
// ICSE example: const TOPIC_ID_PREFIX = `icse_math${GRADE}_`;

// ── BOARD GUARD — do not remove ───────────────────────────────────────────────
const ALLOWED_BOARDS = ["CBSE", "ICSE", "IB", "SSC", "State Board"];
if (!ALLOWED_BOARDS.includes(BOARD)) {
  console.error(`❌ Invalid BOARD "${BOARD}". Allowed: ${ALLOWED_BOARDS.join(", ")}`);
  process.exit(1);
}

// Verify topicId prefix matches the board
const BOARD_PREFIX_CHECKS = {
  ICSE:  (prefix) => prefix.startsWith("icse_") || prefix.startsWith("icse"),
  SSC:   (prefix) => prefix.startsWith("ssc_"),
  IB:    (prefix) => prefix.startsWith("ib_"),
  CBSE:  (prefix) => !prefix.startsWith("icse") && !prefix.startsWith("ssc_") && !prefix.startsWith("ib_"),
  "State Board": (prefix) => true,
};
if (!BOARD_PREFIX_CHECKS[BOARD]?.(TOPIC_ID_PREFIX)) {
  console.error(`❌ topicId prefix "${TOPIC_ID_PREFIX}" does not match board "${BOARD}".`);
  console.error(`   ICSE prefixes start with "icse_", SSC with "ssc_", IB with "ib_".`);
  process.exit(1);
}

// ── CONTENT — fill this in ────────────────────────────────────────────────────
/**
 * @type {Array<{
 *   topicId: string,
 *   chapterNumber: number,
 *   name: string,
 *   subject: string,
 *   examBoard: string,
 *   grade: string,
 *   overview: string,
 *   keyFormulas: string[],
 *   workedExamples: Array<{ question: string, solution: string }>,
 *   conceptNotes: string[],
 * }>}
 */
const TOPICS = [
  // TODO: fill in topic objects. Each topic must include examBoard and grade.
  // Example:
  // {
  //   topicId:       `${TOPIC_ID_PREFIX}ch1_topic_slug`,
  //   chapterNumber: 1,
  //   name:          "Topic Name",
  //   subject:       SUBJECT,
  //   examBoard:     BOARD,
  //   grade:         GRADE,
  //   overview:      "...",
  //   keyFormulas:   ["formula1", "formula2"],
  //   workedExamples: [
  //     { question: "Q?", solution: "Ans." },
  //   ],
  //   conceptNotes:  ["note1", "note2"],
  // },
];

// ── SEED ──────────────────────────────────────────────────────────────────────
async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI not set. Check your .env file.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  if (TOPICS.length === 0) {
    console.warn("⚠️  TOPICS array is empty. Nothing to seed.");
    await mongoose.disconnect();
    return;
  }

  let upserted = 0;
  let errors   = 0;

  for (const topic of TOPICS) {
    // Runtime board guard — catch accidental mismatches inside the array
    if (topic.examBoard !== BOARD) {
      console.error(`❌ Topic ${topic.topicId} has examBoard "${topic.examBoard}" but script BOARD is "${BOARD}". Fix and re-run.`);
      errors++;
      continue;
    }
    if (!topic.topicId.startsWith(TOPIC_ID_PREFIX)) {
      console.error(`❌ Topic ${topic.topicId} does not start with prefix "${TOPIC_ID_PREFIX}". Fix topicId or TOPIC_ID_PREFIX.`);
      errors++;
      continue;
    }

    try {
      await NcertTopicContent.findOneAndUpdate(
        { topicId: topic.topicId },
        { $set: topic },
        { upsert: true, new: true }
      );
      upserted++;
    } catch (err) {
      console.error(`❌ Failed to upsert ${topic.topicId}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Done — ${upserted} upserted, ${errors} errors (total: ${TOPICS.length} topics)`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
