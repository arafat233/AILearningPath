/**
 * AP SSC Class 10 Mathematics — Ph1 Curriculum Skeleton (NcertChapter docs)
 *
 * AP SSC Math 10 = NCERT Class 10 Mathematics (identical curriculum, Telugu-medium).
 * Same 14 chapters as CBSE Math 10. chapterId uses ap_ssc_math10_ prefix to avoid
 * collision with existing CBSE chapter entries.
 *
 * chapterId format: ap_ssc_math10_ch{N}
 * board: "AP_SSC" · grade: "10" · subject: "Mathematics"
 *
 * Safe to re-run (upserts on chapterId).
 * Usage: node config/seedApSscMath10NcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const CHAPTERS = [
  { chapterId: "ap_ssc_math10_ch1",  number: 1,  title: "Real Numbers" },
  { chapterId: "ap_ssc_math10_ch2",  number: 2,  title: "Polynomials" },
  { chapterId: "ap_ssc_math10_ch3",  number: 3,  title: "Pair of Linear Equations in Two Variables" },
  { chapterId: "ap_ssc_math10_ch4",  number: 4,  title: "Quadratic Equations" },
  { chapterId: "ap_ssc_math10_ch5",  number: 5,  title: "Arithmetic Progressions" },
  { chapterId: "ap_ssc_math10_ch6",  number: 6,  title: "Triangles" },
  { chapterId: "ap_ssc_math10_ch7",  number: 7,  title: "Coordinate Geometry" },
  { chapterId: "ap_ssc_math10_ch8",  number: 8,  title: "Introduction to Trigonometry" },
  { chapterId: "ap_ssc_math10_ch9",  number: 9,  title: "Some Applications of Trigonometry" },
  { chapterId: "ap_ssc_math10_ch10", number: 10, title: "Circles" },
  { chapterId: "ap_ssc_math10_ch11", number: 11, title: "Areas Related to Circles" },
  { chapterId: "ap_ssc_math10_ch12", number: 12, title: "Surface Areas and Volumes" },
  { chapterId: "ap_ssc_math10_ch13", number: 13, title: "Statistics" },
  { chapterId: "ap_ssc_math10_ch14", number: 14, title: "Probability" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  let upserted = 0;
  for (const ch of CHAPTERS) {
    await NcertChapter.findOneAndUpdate(
      { chapterId: ch.chapterId },
      {
        chapterId: ch.chapterId,
        number:    ch.number,
        title:     ch.title,
        board:     "AP_SSC",
        grade:     "10",
        subject:   "Mathematics",
        overview:  "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${ch.chapterId}: ${ch.title}`);
    upserted++;
  }

  console.log(`\nSeeded ${upserted} NcertChapter docs for AP SSC Class 10 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
