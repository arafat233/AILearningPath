/**
 * CBSE Class 1 Mathematics — NcertChapter bridge seed
 * Links chapterId (math1_chN) to chapter metadata. Safe to re-run.
 * Usage: node config/seedMath1NcertChapters.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const chapters = [
  { chapterId: "math1_ch1",  number: 1,  title: "Shapes and Space",                  subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch2",  number: 2,  title: "Numbers from One to Nine",           subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch3",  number: 3,  title: "Addition",                           subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch4",  number: 4,  title: "Subtraction",                        subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch5",  number: 5,  title: "Numbers from Ten to Twenty",         subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch6",  number: 6,  title: "Time",                               subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch7",  number: 7,  title: "Measurement",                        subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch8",  number: 8,  title: "Numbers from Twenty-one to Fifty",   subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch9",  number: 9,  title: "Data Handling",                      subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch10", number: 10, title: "Patterns",                           subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch11", number: 11, title: "Numbers",                            subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch12", number: 12, title: "Money",                              subject: "Mathematics", grade: "1" },
  { chapterId: "math1_ch13", number: 13, title: "How Many",                           subject: "Mathematics", grade: "1" },
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
  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 1 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
