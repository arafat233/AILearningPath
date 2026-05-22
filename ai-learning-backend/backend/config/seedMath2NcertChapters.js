/**
 * CBSE Class 2 Mathematics — NcertChapter bridge seed
 * Links chapterId (math2_chN) to chapter metadata. Safe to re-run.
 * Usage: node config/seedMath2NcertChapters.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const chapters = [
  { chapterId: "math2_ch1",  number: 1,  title: "What is Long, What is Round?", subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch2",  number: 2,  title: "Counting in Groups",            subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch3",  number: 3,  title: "How Much Can You Carry?",       subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch4",  number: 4,  title: "Counting in Tens",              subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch5",  number: 5,  title: "Patterns",                      subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch6",  number: 6,  title: "Footprints",                    subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch7",  number: 7,  title: "Jugs and Mugs",                 subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch8",  number: 8,  title: "Tens and Ones",                 subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch9",  number: 9,  title: "My Funbook",                    subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch10", number: 10, title: "Add our Points",                subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch11", number: 11, title: "Lines and Lines",               subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch12", number: 12, title: "Give and Take",                 subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch13", number: 13, title: "The Longest Step",              subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch14", number: 14, title: "Birds Come, Birds Go",          subject: "Mathematics", grade: "2" },
  { chapterId: "math2_ch15", number: 15, title: "How Many Ponytails?",           subject: "Mathematics", grade: "2" },
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
  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 2 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
