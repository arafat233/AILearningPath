/**
 * migrateCbseClass10OrphanQuestions.mjs
 *
 * Cleans up the two remaining orphan-question groups in CBSE Class 10:
 *
 *   GROUP A — 80 chapter-level catch-all questions (Math)
 *     Today they live under freeform descriptive topicIds like
 *     "Algebra Basics", "Linear Equations", "Trigonometry",
 *     "Applications of Trigonometry", "Surface Areas & Volumes" — 16 each.
 *     They're chapter-wide mixed-practice questions, not tied to one
 *     sub-topic. We rename them to canonical `cbse_math10_ch<N>_mixed`.
 *
 *     Two chapterNumber bugs are fixed at the same time:
 *       - "Algebra Basics"           was chapterNumber=0   → 2 (Polynomials)
 *       - "Surface Areas & Volumes"  was chapterNumber=13  → 12
 *
 *   GROUP B — 62 questions with topicId = null  (Math + Science)
 *     Each one already has a chapter-level `topic` field (e.g. "Real
 *     Numbers", "Light — Reflection and Refraction") which we use to
 *     route it to the canonical chapter-mixed bucket. After migration
 *     no CBSE 10 question has a null topicId.
 *
 * Net effect: every CBSE 10 Math + Science question carries a canonical
 * topicId that the v2 audit / dashboard / chapter views can recognise.
 * `cbse_math10_ch<N>_mixed` / `cbse_sci10_ch<N>_mixed` are NEW topicIds
 * that don't exist in NcertTopicContent — that's intentional. They
 * represent chapter-wide mixed-practice question pools, not sub-topics.
 * The 15-check content audit only iterates NcertTopicContent and stays
 * green; the chapter-mixed pool just provides extra Q variety.
 *
 * Idempotent: re-running after success makes 0 changes.
 *
 * Usage:
 *   node config/migrateCbseClass10OrphanQuestions.mjs --dry
 *   node config/migrateCbseClass10OrphanQuestions.mjs
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const isDry = process.argv.includes("--dry");

// ── Group A: chapter-level catch-all renames ────────────────────────────────
const CATCHALL_RENAMES = [
  { oldTopicId: "Algebra Basics",              newTopicId: "cbse_math10_ch2_mixed",  forceChapter: 2,  topicName: "Polynomials" },
  { oldTopicId: "Linear Equations",            newTopicId: "cbse_math10_ch3_mixed",  forceChapter: 3,  topicName: "Linear Equations" },
  { oldTopicId: "Trigonometry",                newTopicId: "cbse_math10_ch8_mixed",  forceChapter: 8,  topicName: "Trigonometry" },
  { oldTopicId: "Applications of Trigonometry",newTopicId: "cbse_math10_ch9_mixed",  forceChapter: 9,  topicName: "Applications of Trigonometry" },
  { oldTopicId: "Surface Areas & Volumes",     newTopicId: "cbse_math10_ch12_mixed", forceChapter: 12, topicName: "Surface Areas & Volumes" },
];

// ── Group B: null-topicId routing by `topic` field ──────────────────────────
// Each row maps (subject, topic field) → canonical chapter-mixed topicId.
const NULL_ROUTING = [
  // Math
  { subject: ["Math","Mathematics"], topic: "Real Numbers",                       newTopicId: "cbse_math10_ch1_mixed",  forceChapter: 1  },
  { subject: ["Math","Mathematics"], topic: "Polynomials",                        newTopicId: "cbse_math10_ch2_mixed",  forceChapter: 2  },
  { subject: ["Math","Mathematics"], topic: "Algebra Basics",                     newTopicId: "cbse_math10_ch2_mixed",  forceChapter: 2  },
  { subject: ["Math","Mathematics"], topic: "Linear Equations",                   newTopicId: "cbse_math10_ch3_mixed",  forceChapter: 3  },
  { subject: ["Math","Mathematics"], topic: "Quadratic Equations",                newTopicId: "cbse_math10_ch4_mixed",  forceChapter: 4  },
  { subject: ["Math","Mathematics"], topic: "Arithmetic Progressions",            newTopicId: "cbse_math10_ch5_mixed",  forceChapter: 5  },
  { subject: ["Math","Mathematics"], topic: "Triangles",                          newTopicId: "cbse_math10_ch6_mixed",  forceChapter: 6  },
  { subject: ["Math","Mathematics"], topic: "Coordinate Geometry",                newTopicId: "cbse_math10_ch7_mixed",  forceChapter: 7  },
  { subject: ["Math","Mathematics"], topic: "Trigonometry",                       newTopicId: "cbse_math10_ch8_mixed",  forceChapter: 8  },
  { subject: ["Math","Mathematics"], topic: "Applications of Trigonometry",       newTopicId: "cbse_math10_ch9_mixed",  forceChapter: 9  },
  { subject: ["Math","Mathematics"], topic: "Circles",                            newTopicId: "cbse_math10_ch10_mixed", forceChapter: 10 },
  { subject: ["Math","Mathematics"], topic: "Areas Related to Circles",           newTopicId: "cbse_math10_ch11_mixed", forceChapter: 11 },
  { subject: ["Math","Mathematics"], topic: "Surface Areas & Volumes",            newTopicId: "cbse_math10_ch12_mixed", forceChapter: 12 },
  { subject: ["Math","Mathematics"], topic: "Statistics",                         newTopicId: "cbse_math10_ch13_mixed", forceChapter: 13 },
  { subject: ["Math","Mathematics"], topic: "Probability",                        newTopicId: "cbse_math10_ch14_mixed", forceChapter: 14 },
  // Science
  { subject: ["Science"],            topic: "Chemical Reactions and Equations",   newTopicId: "cbse_sci10_ch1_mixed",   forceChapter: 1  },
  { subject: ["Science"],            topic: "Life Processes",                     newTopicId: "cbse_sci10_ch5_mixed",   forceChapter: 5  },
  { subject: ["Science"],            topic: "Control and Coordination",           newTopicId: "cbse_sci10_ch6_mixed",   forceChapter: 6  },
  { subject: ["Science"],            topic: "Heredity and Evolution",             newTopicId: "cbse_sci10_ch8_mixed",   forceChapter: 8  },
  { subject: ["Science"],            topic: "Light — Reflection and Refraction",  newTopicId: "cbse_sci10_ch9_mixed",   forceChapter: 9  },
  { subject: ["Science"],            topic: "Electricity",                        newTopicId: "cbse_sci10_ch11_mixed",  forceChapter: 11 },
];

await mongoose.connect(process.env.MONGO_URI);

let totalRenamed = 0;
let totalChapterFixes = 0;

console.log(`\n=== GROUP A: chapter-level catch-all renames ${isDry ? "(dry-run)" : ""} ===`);
for (const r of CATCHALL_RENAMES) {
  const filter = { topicId: r.oldTopicId };
  const before = await Question.countDocuments(filter);
  if (before === 0) {
    console.log(`  · ${r.oldTopicId.padEnd(33)} → ${r.newTopicId}   (0 to update — already migrated?)`);
    continue;
  }
  if (isDry) {
    console.log(`  · ${r.oldTopicId.padEnd(33)} → ${r.newTopicId}   (${before} Qs, would set chapter=${r.forceChapter})`);
    continue;
  }
  const res = await Question.updateMany(filter, {
    $set: { topicId: r.newTopicId, chapterNumber: r.forceChapter, topic: r.topicName },
  });
  console.log(`  ✓ ${r.oldTopicId.padEnd(33)} → ${r.newTopicId}   (${res.modifiedCount} Qs, chapter→${r.forceChapter})`);
  totalRenamed += res.modifiedCount;
}

console.log(`\n=== GROUP B: null-topicId routing by topic field ${isDry ? "(dry-run)" : ""} ===`);
for (const r of NULL_ROUTING) {
  const filter = {
    examBoard: { $in: ["CBSE", null, ""] },
    grade: "10",
    subject: { $in: r.subject },
    topic: r.topic,
    $or: [{ topicId: null }, { topicId: "" }, { topicId: { $exists: false } }],
  };
  const before = await Question.countDocuments(filter);
  if (before === 0) {
    continue; // silently skip — topic combination has no orphan rows
  }
  if (isDry) {
    console.log(`  · [${r.subject[0]}] "${r.topic}" → ${r.newTopicId}   (${before} Qs)`);
    continue;
  }
  const res = await Question.updateMany(filter, {
    $set: { topicId: r.newTopicId, chapterNumber: r.forceChapter },
  });
  console.log(`  ✓ [${r.subject[0]}] "${r.topic}" → ${r.newTopicId}   (${res.modifiedCount} Qs)`);
  totalRenamed += res.modifiedCount;
}

// ── Verify state after ───────────────────────────────────────────────────────
const remainingNull = await Question.countDocuments({
  examBoard: { $in: ["CBSE", null, ""] },
  grade: "10",
  subject: { $in: ["Math", "Mathematics", "Science"] },
  $or: [{ topicId: null }, { topicId: "" }, { topicId: { $exists: false } }],
});
const remainingCatchall = await Question.countDocuments({
  topicId: { $in: ["Algebra Basics", "Linear Equations", "Trigonometry", "Applications of Trigonometry", "Surface Areas & Volumes"] },
});

console.log("\n──────────────────────────────────────────────");
console.log(`Total Qs renamed       : ${isDry ? "(dry-run)" : totalRenamed}`);
console.log(`Remaining null-topicId : ${remainingNull}  ${remainingNull === 0 ? "✓" : "⚠"}`);
console.log(`Remaining catch-all v0 : ${remainingCatchall}  ${remainingCatchall === 0 ? "✓" : "⚠"}`);

await mongoose.disconnect();
process.exit(0);
