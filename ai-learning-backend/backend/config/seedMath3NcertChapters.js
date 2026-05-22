/**
 * CBSE Class 3 Mathematics — NcertChapter bridge seed
 * "Math Magic Grade 3" (NCERT) — 14 chapters. Safe to re-run.
 * Usage: node config/seedMath3NcertChapters.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertChapter } from "../models/ncertChapterModel.js";

dotenv.config();

const chapters = [
  { chapterId: "math3_ch1",  number: 1,  title: "Where to Look From",    subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch2",  number: 2,  title: "Fun with Numbers",       subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch3",  number: 3,  title: "Give and Take",          subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch4",  number: 4,  title: "Long and Short",         subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch5",  number: 5,  title: "Shapes and Designs",     subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch6",  number: 6,  title: "Fun with Give and Take", subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch7",  number: 7,  title: "Time Goes On",           subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch8",  number: 8,  title: "Who is Heavier?",        subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch9",  number: 9,  title: "How Many Times?",        subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch10", number: 10, title: "Play with Patterns",     subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch11", number: 11, title: "Jugs and Mugs",          subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch12", number: 12, title: "Can We Share?",          subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch13", number: 13, title: "Smart Charts!",          subject: "Mathematics", grade: "3" },
  { chapterId: "math3_ch14", number: 14, title: "Rupees and Paise",       subject: "Mathematics", grade: "3" },
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
  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 3 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
