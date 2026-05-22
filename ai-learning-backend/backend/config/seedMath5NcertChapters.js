/**
 * CBSE Class 5 Mathematics — NcertChapters bridge seed
 * Textbook: "Maths Magic Grade 5" (NCERT)
 * 14 chapters. Safe to re-run.
 * Usage: node config/seedMath5NcertChapters.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertChapter } from "../models/ncertChapterModel.js";

dotenv.config();

const chapters = [
  { chapterId: "math5_ch1",  number: 1,  title: "The Fish Tale",                       grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch2",  number: 2,  title: "Shapes and Angles",                   grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch3",  number: 3,  title: "How Many Squares?",                   grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch4",  number: 4,  title: "Parts and Wholes",                    grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch5",  number: 5,  title: "Does it Look the Same?",              grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch6",  number: 6,  title: "Be My Multiple, I'll Be Your Factor", grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch7",  number: 7,  title: "Can You See the Pattern?",            grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch8",  number: 8,  title: "Mapping Your Way",                    grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch9",  number: 9,  title: "Boxes and Sketches",                  grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch10", number: 10, title: "Tenths and Hundredths",               grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch11", number: 11, title: "Area and Its Boundary",               grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch12", number: 12, title: "Smart Charts",                        grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch13", number: 13, title: "Ways to Multiply and Divide",         grade: "5", subject: "Mathematics" },
  { chapterId: "math5_ch14", number: 14, title: "How Big? How Heavy?",                 grade: "5", subject: "Mathematics" },
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

  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 5 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
