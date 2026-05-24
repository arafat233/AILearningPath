/**
 * AP SSC Class 9 Mathematics — Ph1 Curriculum Skeleton (NcertChapter docs)
 *
 * AP SSC follows the traditional NCERT Class 9 syllabus (rationalized 2024-25),
 * translated into Telugu medium. 12 chapters.
 *
 * chapterId format: ap_ssc_math9_ch{N}
 * board: "AP_SSC" · grade: "9" · subject: "Mathematics"
 *
 * Safe to re-run (upserts on chapterId).
 * Usage: node config/seedApSscMath9NcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const CHAPTERS = [
  { chapterId: "ap_ssc_math9_ch1",  number: 1,  title: "Number Systems" },
  { chapterId: "ap_ssc_math9_ch2",  number: 2,  title: "Polynomials" },
  { chapterId: "ap_ssc_math9_ch3",  number: 3,  title: "Coordinate Geometry" },
  { chapterId: "ap_ssc_math9_ch4",  number: 4,  title: "Linear Equations in Two Variables" },
  { chapterId: "ap_ssc_math9_ch5",  number: 5,  title: "Introduction to Euclid's Geometry" },
  { chapterId: "ap_ssc_math9_ch6",  number: 6,  title: "Lines and Angles" },
  { chapterId: "ap_ssc_math9_ch7",  number: 7,  title: "Triangles" },
  { chapterId: "ap_ssc_math9_ch8",  number: 8,  title: "Quadrilaterals" },
  { chapterId: "ap_ssc_math9_ch9",  number: 9,  title: "Circles" },
  { chapterId: "ap_ssc_math9_ch10", number: 10, title: "Heron's Formula" },
  { chapterId: "ap_ssc_math9_ch11", number: 11, title: "Surface Areas and Volumes" },
  { chapterId: "ap_ssc_math9_ch12", number: 12, title: "Statistics" },
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
        grade:     "9",
        subject:   "Mathematics",
        overview:  "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${ch.chapterId}: ${ch.title}`);
    upserted++;
  }

  console.log(`\nSeeded ${upserted} NcertChapter docs for AP SSC Class 9 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
