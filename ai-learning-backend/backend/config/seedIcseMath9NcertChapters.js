/**
 * ICSE Class 9 Mathematics — Ph1 Curriculum Skeleton (NcertChapter docs)
 *
 * Source: Selina Concise Mathematics Class 9 (ICSE). 28 chapters.
 *
 * chapterId format: icse_math9_ch{N}
 * board: "ICSE" · grade: "9" · subject: "Mathematics"
 *
 * Safe to re-run (upserts on chapterId).
 * Usage: node config/seedIcseMath9NcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const CHAPTERS = [
  { chapterId: "icse_math9_ch1",  number: 1,  title: "Rational and Irrational Numbers" },
  { chapterId: "icse_math9_ch2",  number: 2,  title: "Compound Interest (Without Formula)" },
  { chapterId: "icse_math9_ch3",  number: 3,  title: "Compound Interest (Using Formula)" },
  { chapterId: "icse_math9_ch4",  number: 4,  title: "Expansions (Identities)" },
  { chapterId: "icse_math9_ch5",  number: 5,  title: "Factorisation" },
  { chapterId: "icse_math9_ch6",  number: 6,  title: "Simultaneous (Linear) Equations" },
  { chapterId: "icse_math9_ch7",  number: 7,  title: "Indices (Exponents)" },
  { chapterId: "icse_math9_ch8",  number: 8,  title: "Logarithms" },
  { chapterId: "icse_math9_ch9",  number: 9,  title: "Triangles (Congruency in Triangles)" },
  { chapterId: "icse_math9_ch10", number: 10, title: "Isosceles Triangles" },
  { chapterId: "icse_math9_ch11", number: 11, title: "Inequalities" },
  { chapterId: "icse_math9_ch12", number: 12, title: "Mid-Point and Its Converse; Equal Intercept Theorem" },
  { chapterId: "icse_math9_ch13", number: 13, title: "Pythagoras Theorem" },
  { chapterId: "icse_math9_ch14", number: 14, title: "Rectilinear Figures (Quadrilaterals: Parallelogram, Rectangle, Rhombus, Square and Trapezium)" },
  { chapterId: "icse_math9_ch15", number: 15, title: "Construction of Polygons (Using Ruler and Compass Only)" },
  { chapterId: "icse_math9_ch16", number: 16, title: "Area Theorems (Proof and Use)" },
  { chapterId: "icse_math9_ch17", number: 17, title: "Circle" },
  { chapterId: "icse_math9_ch18", number: 18, title: "Statistics" },
  { chapterId: "icse_math9_ch19", number: 19, title: "Mean and Median (For Ungrouped Data Only)" },
  { chapterId: "icse_math9_ch20", number: 20, title: "Area and Perimeter of Plane Figures" },
  { chapterId: "icse_math9_ch21", number: 21, title: "Solids (Surface Area and Volume of 3-D Solids)" },
  { chapterId: "icse_math9_ch22", number: 22, title: "Trigonometrical Ratios (sin θ, cos θ, tan θ and their Reciprocals)" },
  { chapterId: "icse_math9_ch23", number: 23, title: "Trigonometrical Ratios of Standard Angles (Including Evaluation of an Expression Involving Trigonometric Ratios)" },
  { chapterId: "icse_math9_ch24", number: 24, title: "Solution of Right Triangles (Simple 2-D Problems Involving One Right-Angled Triangle)" },
  { chapterId: "icse_math9_ch25", number: 25, title: "Complementary Angles" },
  { chapterId: "icse_math9_ch26", number: 26, title: "Co-ordinate Geometry (In 2-D)" },
  { chapterId: "icse_math9_ch27", number: 27, title: "Graphical Solution (Solution of Simultaneous Linear Equations, Graphically)" },
  { chapterId: "icse_math9_ch28", number: 28, title: "Distance Formula" },
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
        grade:     "9",
        subject:   "Mathematics",
        overview:  "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${ch.chapterId}: ${ch.title}`);
    upserted++;
  }

  console.log(`\nSeeded ${upserted} NcertChapter docs for ICSE Class 9 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
