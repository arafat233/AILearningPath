import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertChapter } from "../models/ncertChapterModel.js";

dotenv.config();

const chapters = [
  { chapterId: "math9_ch1", number: 1, title: "Orienting Yourself: The Use of Coordinates", grade: "9", subject: "Mathematics" },
  { chapterId: "math9_ch2", number: 2, title: "Introduction to Linear Polynomials", grade: "9", subject: "Mathematics" },
  { chapterId: "math9_ch3", number: 3, title: "The World of Numbers", grade: "9", subject: "Mathematics" },
  { chapterId: "math9_ch4", number: 4, title: "Exploring Algebraic Identities", grade: "9", subject: "Mathematics" },
  { chapterId: "math9_ch5", number: 5, title: "I'm Up and Down, and Round and Round", grade: "9", subject: "Mathematics" },
  { chapterId: "math9_ch6", number: 6, title: "Measuring Space: Perimeter and Area", grade: "9", subject: "Mathematics" },
  { chapterId: "math9_ch7", number: 7, title: "The Mathematics of Maybe: Introduction to Probability", grade: "9", subject: "Mathematics" },
  { chapterId: "math9_ch8", number: 8, title: "Predicting What Comes Next: Exploring Sequences and Progressions", grade: "9", subject: "Mathematics" },
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

  console.log(`\nSeeded ${chapters.length} NcertChapters for Class 9 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
