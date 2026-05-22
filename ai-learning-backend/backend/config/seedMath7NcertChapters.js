/**
 * CBSE Class 7 Mathematics — NcertChapters bridge seed
 * Textbook: "Ganita Prakash Grade 7 Part I + Part II" (NCERT 2026)
 * 15 chapters. Safe to re-run.
 * Usage: node config/seedMath7NcertChapters.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertChapter } from "../models/ncertChapterModel.js";

dotenv.config();

const chapters = [
  { chapterId: "math7_ch1",  number: 1,  title: "Large Numbers Around Us",           grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch2",  number: 2,  title: "Arithmetic Expressions",             grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch3",  number: 3,  title: "A Peek Beyond the Point",            grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch4",  number: 4,  title: "Letter-Numbers",                     grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch5",  number: 5,  title: "Parallel and Intersecting Lines",    grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch6",  number: 6,  title: "Number Play",                        grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch7",  number: 7,  title: "A Tale of Three Intersecting Lines", grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch8",  number: 8,  title: "Working with Fractions",             grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch9",  number: 9,  title: "Geometric Twins",                   grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch10", number: 10, title: "Operations with Integers",           grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch11", number: 11, title: "Finding Common Ground",              grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch12", number: 12, title: "Another Peek Beyond the Point",      grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch13", number: 13, title: "Connecting the Dots",                grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch14", number: 14, title: "Constructions and Tilings",          grade: "7", subject: "Mathematics" },
  { chapterId: "math7_ch15", number: 15, title: "Finding the Unknown",                grade: "7", subject: "Mathematics" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const ch of chapters) {
    await NcertChapter.findOneAndUpdate(
      { chapterId: ch.chapterId },
      ch,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${ch.chapterId}: ${ch.title}`);
  }

  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 7 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
