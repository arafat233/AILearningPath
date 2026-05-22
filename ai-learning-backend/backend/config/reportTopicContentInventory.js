/**
 * Report: For CBSE Class 10 Math, what fields each topic has populated.
 * Tells us exactly what's missing when a user clicks "Study →" on a topic.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { Question } from "../models/index.js";
dotenv.config();

const CBSE_CH = {
  1: "Real Numbers", 2: "Polynomials", 3: "Pair of Linear Equations",
  4: "Quadratic Equations", 5: "AP", 6: "Triangles",
  7: "Coordinate Geometry", 8: "Trigonometry", 9: "Trig Applications",
  10: "Circles", 11: "Areas Related to Circles", 12: "Surface Areas & Volumes",
  13: "Statistics", 14: "Probability",
};

function has(v) {
  if (v == null) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v).length > 0;
  return Boolean(v);
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const topics = await NcertTopicContent.find({
    subject: "Mathematics",
    topicId: { $regex: /^ch\d+_/, $not: /^icse\d+_/ },
  }).lean();

  // Question counts per topicId
  const qAgg = await Question.aggregate([
    { $match: { topicId: { $regex: /^ch\d+_/ } } },
    { $group: { _id: "$topicId", count: { $sum: 1 } } },
  ]);
  const qCount = new Map(qAgg.map((x) => [x._id, x.count]));

  // Group by chapter
  const byChapter = new Map();
  for (const t of topics) {
    if (!byChapter.has(t.chapterNumber)) byChapter.set(t.chapterNumber, []);
    byChapter.get(t.chapterNumber).push(t);
  }

  console.log("\n" + "═".repeat(125));
  console.log("CBSE Class 10 Math — Per-Topic Content Inventory");
  console.log("What each topic has when you click Study →");
  console.log("═".repeat(125));
  console.log(
    "  " + "Topic".padEnd(50) +
    "│ Intuition│ Process │ Example │ Mistakes│ Shortcut│ Takeaway│ Formula │ Prereq │ #Qs"
  );
  console.log("  " + "─".repeat(50) + "┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼────────┼────");

  let stats = {
    total: 0, intuition: 0, process: 0, example: 0, mistakes: 0, shortcut: 0,
    takeaway: 0, formula: 0, prereq: 0, withQs: 0
  };

  const sortedChapters = [...byChapter.keys()].sort((a, b) => a - b);
  for (const ch of sortedChapters) {
    console.log(`\nCh ${String(ch).padStart(2)} ${CBSE_CH[ch] || ""}`);
    const chTopics = byChapter.get(ch).sort((a, b) => a.topicId.localeCompare(b.topicId));
    for (const t of chTopics) {
      stats.total++;
      const tc = t.teaching_content || {};
      const hi = has(tc.intuition || t.intuition);
      const hp = has(tc.process_explanation || t.process_explanation);
      const he = has(tc.worked_example || t.worked_example);
      const hm = has(tc.common_misconceptions || t.common_misconceptions);
      const hs = has(tc.shortcuts_and_tricks || t.shortcuts_and_tricks);
      const hk = has(tc.key_takeaway || t.key_takeaway);
      const hf = has(t.key_formulas);
      const hpr = has(t.prerequisite_knowledge);
      const qN = qCount.get(t.topicId) || 0;

      if (hi) stats.intuition++;
      if (hp) stats.process++;
      if (he) stats.example++;
      if (hm) stats.mistakes++;
      if (hs) stats.shortcut++;
      if (hk) stats.takeaway++;
      if (hf) stats.formula++;
      if (hpr) stats.prereq++;
      if (qN > 0) stats.withQs++;

      const m = (b) => b ? " ✓ " : " — ";
      const name = (t.name || t.topicId || "").slice(0, 48);
      console.log(
        "  " + name.padEnd(50) +
        "│" + m(hi).padEnd(9) +
        "│" + m(hp).padEnd(9) +
        "│" + m(he).padEnd(9) +
        "│" + m(hm).padEnd(9) +
        "│" + m(hs).padEnd(9) +
        "│" + m(hk).padEnd(9) +
        "│" + m(hf).padEnd(9) +
        "│" + m(hpr).padEnd(8) +
        "│ " + String(qN).padStart(3)
      );
    }
  }

  const pct = (n) => `${Math.round(n / stats.total * 100)}%`;
  console.log("\n" + "═".repeat(125));
  console.log("COVERAGE SUMMARY (out of " + stats.total + " topics)");
  console.log("─".repeat(125));
  console.log(`  Intuition (the "hook"):           ${stats.intuition.toString().padStart(2)} (${pct(stats.intuition)})`);
  console.log(`  Process explanation:              ${stats.process.toString().padStart(2)} (${pct(stats.process)})`);
  console.log(`  Worked example:                   ${stats.example.toString().padStart(2)} (${pct(stats.example)})`);
  console.log(`  Common misconceptions:            ${stats.mistakes.toString().padStart(2)} (${pct(stats.mistakes)})`);
  console.log(`  Shortcuts/tricks:                 ${stats.shortcut.toString().padStart(2)} (${pct(stats.shortcut)})`);
  console.log(`  Key takeaway:                     ${stats.takeaway.toString().padStart(2)} (${pct(stats.takeaway)})`);
  console.log(`  Key formulas:                     ${stats.formula.toString().padStart(2)} (${pct(stats.formula)})`);
  console.log(`  Prerequisite knowledge:           ${stats.prereq.toString().padStart(2)} (${pct(stats.prereq)})`);
  console.log(`  Has practice questions:           ${stats.withQs.toString().padStart(2)} (${pct(stats.withQs)})`);
  console.log("═".repeat(125));

  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
