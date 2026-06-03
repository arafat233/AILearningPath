/**
 * AP SSC Class 8 Mathematics — Ph1 Curriculum Skeleton (NcertChapter docs)
 *
 * AP SSC follows the NCERT Class 8 syllabus, split across two semester
 * textbooks (SEM-1 = Ch1–8, SEM-2 = Ch9–16). 16 chapters.
 *
 * chapterId format: ap_ssc_math8_ch{N}
 * board: "AP_SSC" · grade: "8" · subject: "Mathematics"
 *
 * Safe to re-run (upserts on chapterId).
 * Usage: node config/seedApSscMath8NcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const CHAPTERS = [
  // ── SEM-1 ──
  { chapterId: "ap_ssc_math8_ch1",  number: 1,  title: "Rational Numbers" },
  { chapterId: "ap_ssc_math8_ch2",  number: 2,  title: "Linear Equations in One Variable" },
  { chapterId: "ap_ssc_math8_ch3",  number: 3,  title: "Understanding Quadrilaterals" },
  { chapterId: "ap_ssc_math8_ch4",  number: 4,  title: "Practical Geometry" },
  { chapterId: "ap_ssc_math8_ch5",  number: 5,  title: "Data Handling" },
  { chapterId: "ap_ssc_math8_ch6",  number: 6,  title: "Squares and Square Roots" },
  { chapterId: "ap_ssc_math8_ch7",  number: 7,  title: "Cubes and Cube Roots" },
  { chapterId: "ap_ssc_math8_ch8",  number: 8,  title: "Comparing Quantities" },
  // ── SEM-2 ──
  { chapterId: "ap_ssc_math8_ch9",  number: 9,  title: "Algebraic Expressions and Identities" },
  { chapterId: "ap_ssc_math8_ch10", number: 10, title: "Visualising Solid Shapes" },
  { chapterId: "ap_ssc_math8_ch11", number: 11, title: "Mensuration" },
  { chapterId: "ap_ssc_math8_ch12", number: 12, title: "Exponents and Powers" },
  { chapterId: "ap_ssc_math8_ch13", number: 13, title: "Direct and Inverse Proportions" },
  { chapterId: "ap_ssc_math8_ch14", number: 14, title: "Factorisation" },
  { chapterId: "ap_ssc_math8_ch15", number: 15, title: "Introduction to Graphs" },
  { chapterId: "ap_ssc_math8_ch16", number: 16, title: "Playing with Numbers" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  let upserted = 0;
  for (const ch of CHAPTERS) {
    await NcertChapter.findOneAndUpdate(
      { chapterId: ch.chapterId },
      { chapterId: ch.chapterId, number: ch.number, title: ch.title,
        board: "AP_SSC", grade: "8", subject: "Mathematics", overview: "" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${ch.chapterId}: ${ch.title}`);
    upserted++;
  }
  console.log(`\nSeeded ${upserted} NcertChapter docs for AP SSC Class 8 Mathematics.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
