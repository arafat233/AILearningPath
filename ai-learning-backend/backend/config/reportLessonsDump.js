import mongoose from "mongoose";
import dotenv from "dotenv";
import { Lesson } from "../models/lessonModel.js";
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const total = await Lesson.countDocuments();
  console.log(`Total Lesson docs in DB: ${total}`);
  if (total > 0) {
    const sample = await Lesson.find().select("topic subject grade shortLesson.slides longLesson.slides").limit(30).lean();
    console.log("\nFirst 30 lessons:");
    for (const l of sample) {
      const s = l.shortLesson?.slides?.length || 0;
      const lo = l.longLesson?.slides?.length || 0;
      console.log(`  [${l.subject}/${l.grade}] ${l.topic}  →  short:${s} slides, long:${lo} slides`);
    }
    // Stats
    const subjects = await Lesson.aggregate([
      { $group: { _id: { subject: "$subject", grade: "$grade" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    console.log("\nBy subject/grade:");
    for (const s of subjects) console.log(`  ${s._id.subject}/${s._id.grade}: ${s.count}`);
  }
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
