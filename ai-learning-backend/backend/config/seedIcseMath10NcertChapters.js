/**
 * ICSE Class 10 Mathematics — Ph1 Curriculum Skeleton (NcertChapter docs)
 *
 * Source: Selina Concise Mathematics Class 10 (ICSE). 25 chapters.
 *
 * chapterId format: icse_math10_ch{N}
 * board: "ICSE" · grade: "10" · subject: "Mathematics"
 *
 * Safe to re-run (upserts on chapterId).
 * Usage: node config/seedIcseMath10NcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const CHAPTERS = [
  { chapterId: "icse_math10_ch1",  number: 1,  title: "Value Added Tax" },
  { chapterId: "icse_math10_ch2",  number: 2,  title: "Banking (Recurring Deposit Account)" },
  { chapterId: "icse_math10_ch3",  number: 3,  title: "Shares and Dividend" },
  { chapterId: "icse_math10_ch4",  number: 4,  title: "Linear Inequations (In one variable)" },
  { chapterId: "icse_math10_ch5",  number: 5,  title: "Quadratic Equations" },
  { chapterId: "icse_math10_ch6",  number: 6,  title: "Solving (Simple) Problems on Quadratic Equations" },
  { chapterId: "icse_math10_ch7",  number: 7,  title: "Ratio and Proportion" },
  { chapterId: "icse_math10_ch8",  number: 8,  title: "Remainder and Factor Theorems" },
  { chapterId: "icse_math10_ch9",  number: 9,  title: "Matrices" },
  { chapterId: "icse_math10_ch10", number: 10, title: "Arithmetic Progression" },
  { chapterId: "icse_math10_ch11", number: 11, title: "Geometric Progression" },
  { chapterId: "icse_math10_ch12", number: 12, title: "Reflection" },
  { chapterId: "icse_math10_ch13", number: 13, title: "Section and Mid-Point Formula" },
  { chapterId: "icse_math10_ch14", number: 14, title: "Equation of a Line" },
  { chapterId: "icse_math10_ch15", number: 15, title: "Similarity (with Maps and Models)" },
  { chapterId: "icse_math10_ch16", number: 16, title: "Loci (Locus and Its Constructions)" },
  { chapterId: "icse_math10_ch17", number: 17, title: "Circles" },
  { chapterId: "icse_math10_ch18", number: 18, title: "Tangents and Intersecting Chords" },
  { chapterId: "icse_math10_ch19", number: 19, title: "Constructions (Circles)" },
  { chapterId: "icse_math10_ch20", number: 20, title: "Cylinder, Cone and Sphere (Surface Area & Volume)" },
  { chapterId: "icse_math10_ch21", number: 21, title: "Trigonometrical Identities" },
  { chapterId: "icse_math10_ch22", number: 22, title: "Heights and Distances" },
  { chapterId: "icse_math10_ch23", number: 23, title: "Graphical Representation" },
  { chapterId: "icse_math10_ch24", number: 24, title: "Measures of Central Tendency" },
  { chapterId: "icse_math10_ch25", number: 25, title: "Probability" },
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
        board:     "ICSE",
        grade:     "10",
        subject:   "Mathematics",
        overview:  "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${ch.chapterId}: ${ch.title}`);
    upserted++;
  }

  console.log(`\nSeeded ${upserted} NcertChapter docs for ICSE Class 10 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
