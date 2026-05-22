/**
 * CBSE Class 6 Mathematics — NcertChapters bridge seed
 * Textbook: "Ganita Prakash Grade 6" (NCERT 2026, single book)
 * 10 chapters. Safe to re-run.
 * Usage: node config/seedMath6NcertChapters.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertChapter } from "../models/ncertChapterModel.js";

dotenv.config();

const chapters = [
  { chapterId: "math6_ch1",  number: 1,  title: "Patterns in Mathematics",       grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch2",  number: 2,  title: "Lines and Angles",               grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch3",  number: 3,  title: "Number Play",                    grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch4",  number: 4,  title: "Data Handling and Presentation", grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch5",  number: 5,  title: "Prime Time",                     grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch6",  number: 6,  title: "Perimeter and Area",             grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch7",  number: 7,  title: "Fractions",                      grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch8",  number: 8,  title: "Playing with Constructions",     grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch9",  number: 9,  title: "Symmetry",                       grade: "6", subject: "Mathematics" },
  { chapterId: "math6_ch10", number: 10, title: "The Other Side of Zero",         grade: "6", subject: "Mathematics" },
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

  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 6 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
