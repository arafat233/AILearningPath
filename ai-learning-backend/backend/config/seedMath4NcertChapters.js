/**
 * CBSE Class 4 Mathematics — NcertChapters bridge seed
 * Textbook: "Math Magic Grade 4" (NCERT)
 * 14 chapters. Safe to re-run.
 * Usage: node config/seedMath4NcertChapters.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertChapter } from "../models/ncertChapterModel.js";

dotenv.config();

const chapters = [
  { chapterId: "math4_ch1",  number: 1,  title: "Building with Bricks",              grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch2",  number: 2,  title: "Long and Short",                    grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch3",  number: 3,  title: "A Trip to Bhopal",                  grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch4",  number: 4,  title: "Tick-Tick-Tick",                    grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch5",  number: 5,  title: "The Way The World Looks",           grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch6",  number: 6,  title: "The Junk Seller",                   grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch7",  number: 7,  title: "Jugs and Mugs",                     grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch8",  number: 8,  title: "Carts and Wheels",                  grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch9",  number: 9,  title: "Halves and Quarters",               grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch10", number: 10, title: "Play with Patterns",                grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch11", number: 11, title: "Tables and Shares",                 grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch12", number: 12, title: "How Heavy? How Light?",             grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch13", number: 13, title: "Fields and Fences",                 grade: "4", subject: "Mathematics" },
  { chapterId: "math4_ch14", number: 14, title: "Smart Charts",                      grade: "4", subject: "Mathematics" },
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
  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 4 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
