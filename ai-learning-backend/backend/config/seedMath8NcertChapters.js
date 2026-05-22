/**
 * CBSE Class 8 Mathematics — NcertChapter bridge seed
 * Textbook: "Ganita Prakash Grade 8 Part I + Part II" (NCERT 2026)
 * 14 chapters. Safe to re-run (upserts on chapterId).
 * Usage: node config/seedMath8NcertChapters.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertChapter } from "../models/ncertChapterModel.js";

dotenv.config();

const chapters = [
  { chapterId: "math8_ch1",  number: 1,  title: "A Square and A Cube",                       grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch2",  number: 2,  title: "Power Play",                                 grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch3",  number: 3,  title: "A Story of Numbers",                         grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch4",  number: 4,  title: "Quadrilaterals",                             grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch5",  number: 5,  title: "Number Play",                                grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch6",  number: 6,  title: "We Distribute, Yet Things Multiply",         grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch7",  number: 7,  title: "Proportional Reasoning - 1",                grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch8",  number: 8,  title: "Fractions in Disguise",                      grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch9",  number: 9,  title: "The Baudhayana-Pythagoras Theorem",          grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch10", number: 10, title: "Proportional Reasoning - 2",                grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch11", number: 11, title: "Exploring Some Geometric Themes",           grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch12", number: 12, title: "Tales by Dots and Lines",                   grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch13", number: 13, title: "Algebra Play",                              grade: "8", subject: "Mathematics" },
  { chapterId: "math8_ch14", number: 14, title: "Area",                                      grade: "8", subject: "Mathematics" },
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

  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 8 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
