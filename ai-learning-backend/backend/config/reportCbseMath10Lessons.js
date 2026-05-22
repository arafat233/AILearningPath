/**
 * Report: For CBSE Class 10 Math — every topic that has a Lesson record,
 * grouped by chapter, showing whether short (5-10 min) and long (20+ min)
 * versions exist and how many slides each contains.
 *
 * Usage: node config/reportCbseMath10Lessons.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Lesson } from "../models/lessonModel.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const CBSE_CH_NAMES = {
  1: "Real Numbers", 2: "Polynomials", 3: "Pair of Linear Equations in Two Variables",
  4: "Quadratic Equations", 5: "Arithmetic Progressions", 6: "Triangles",
  7: "Coordinate Geometry", 8: "Introduction to Trigonometry",
  9: "Some Applications of Trigonometry", 10: "Circles", 11: "Areas Related to Circles",
  12: "Surface Areas and Volumes", 13: "Statistics", 14: "Probability",
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. All CBSE Class 10 Math NcertTopicContent records (topicId starts with "ch")
  //    and not the v2-style "math{N}_*" prefix.
  const allTopics = await NcertTopicContent.find({
    subject: "Mathematics",
    topicId: { $regex: /^ch\d+_/, $not: /^icse\d+_/ },
  }).select("topicId name chapterNumber").lean();

  // 2. Build a chapter → topic[] map
  const byChapter = new Map();
  for (let ch = 1; ch <= 14; ch++) byChapter.set(ch, []);
  for (const t of allTopics) {
    if (!byChapter.has(t.chapterNumber)) byChapter.set(t.chapterNumber, []);
    byChapter.get(t.chapterNumber).push(t);
  }

  // 3. Pull all Lesson docs once, index by topic field (name match)
  const lessons = await Lesson.find({ subject: "Math", grade: "10" })
    .select("topic title tagline shortLesson longLesson")
    .lean();
  const lessonByTopic = new Map();
  for (const l of lessons) lessonByTopic.set(l.topic, l);

  // Also try matching by lesson.topic vs ncert.name (case-insensitive)
  function findLesson(topicName) {
    if (!topicName) return null;
    if (lessonByTopic.has(topicName)) return lessonByTopic.get(topicName);
    const lower = topicName.toLowerCase().trim();
    for (const [t, l] of lessonByTopic) {
      if (t.toLowerCase().trim() === lower) return l;
    }
    return null;
  }

  // 4. Print report
  let totalTopics = 0;
  let topicsWithLesson = 0;
  let topicsWithShort = 0;
  let topicsWithLong = 0;
  let topicsWithBoth = 0;

  console.log("\n" + "═".repeat(110));
  console.log("CBSE Class 10 Math — Lesson Inventory (Short 5-10min vs Long 20-25min)");
  console.log("═".repeat(110));

  const sortedChapters = [...byChapter.keys()].sort((a, b) => a - b);
  for (const ch of sortedChapters) {
    const chTopics = byChapter.get(ch).sort((a, b) => a.topicId.localeCompare(b.topicId));
    const chName = CBSE_CH_NAMES[ch] || `Chapter ${ch}`;
    if (!chTopics.length) continue;
    console.log(`\nCh ${String(ch).padStart(2)}: ${chName}`);
    console.log("─".repeat(110));
    console.log(
      "  " + "Topic".padEnd(52) + "│ " +
      "Short".padEnd(14) + "│ " +
      "Long".padEnd(14) + "│ " + "Lesson ID"
    );
    console.log("  " + "─".repeat(52) + "┼─" + "─".repeat(13) + "┼─" + "─".repeat(13) + "┼─" + "─".repeat(20));

    for (const t of chTopics) {
      totalTopics++;
      const lesson = findLesson(t.name);
      const shortSlides = lesson?.shortLesson?.slides?.length || 0;
      const longSlides = lesson?.longLesson?.slides?.length || 0;
      const shortMin = lesson?.shortLesson?.estimatedMinutes;
      const longMin = lesson?.longLesson?.estimatedMinutes;

      const shortCell = shortSlides
        ? `${shortSlides} slides${shortMin ? ` ~${shortMin}m` : ""}`
        : "—";
      const longCell = longSlides
        ? `${longSlides} slides${longMin ? ` ~${longMin}m` : ""}`
        : "—";

      const name = (t.name || t.topicId || "").slice(0, 50);
      const idCol = lesson ? lesson._id.toString().slice(-8) : "no lesson";

      console.log(
        "  " + name.padEnd(52) + "│ " +
        shortCell.padEnd(14) + "│ " +
        longCell.padEnd(14) + "│ " + idCol
      );

      if (lesson) topicsWithLesson++;
      if (shortSlides) topicsWithShort++;
      if (longSlides) topicsWithLong++;
      if (shortSlides && longSlides) topicsWithBoth++;
    }
  }

  console.log("\n" + "═".repeat(110));
  console.log("SUMMARY");
  console.log("─".repeat(110));
  console.log(`Total CBSE Class 10 Math topics:           ${totalTopics}`);
  console.log(`Topics with ANY Lesson doc:                ${topicsWithLesson} (${pct(topicsWithLesson, totalTopics)})`);
  console.log(`Topics with SHORT lesson (5-10 min):       ${topicsWithShort} (${pct(topicsWithShort, totalTopics)})`);
  console.log(`Topics with LONG lesson (20-25 min):       ${topicsWithLong} (${pct(topicsWithLong, totalTopics)})`);
  console.log(`Topics with BOTH short + long:             ${topicsWithBoth} (${pct(topicsWithBoth, totalTopics)})`);
  console.log("═".repeat(110));

  await mongoose.disconnect();
}

function pct(part, total) { return total ? `${Math.round(part / total * 100)}%` : "—"; }

run().catch((err) => { console.error(err); process.exit(1); });
