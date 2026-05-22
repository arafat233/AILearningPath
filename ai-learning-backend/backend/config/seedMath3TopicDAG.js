/**
 * CBSE Class 3 Mathematics — Topic DAG seed
 * 14 nodes for grade "3". Safe to re-run.
 * Usage: node config/seedMath3TopicDAG.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/index.js";

dotenv.config();

const topics = [
  { topicId: "math3_ch1",  subject: "Mathematics", grade: "3", level: 1, prerequisites: [] },
  { topicId: "math3_ch2",  subject: "Mathematics", grade: "3", level: 1, prerequisites: [] },
  { topicId: "math3_ch3",  subject: "Mathematics", grade: "3", level: 1, prerequisites: ["math3_ch2"] },
  { topicId: "math3_ch4",  subject: "Mathematics", grade: "3", level: 1, prerequisites: ["math3_ch2"] },
  { topicId: "math3_ch5",  subject: "Mathematics", grade: "3", level: 1, prerequisites: [] },
  { topicId: "math3_ch6",  subject: "Mathematics", grade: "3", level: 2, prerequisites: ["math3_ch3"] },
  { topicId: "math3_ch7",  subject: "Mathematics", grade: "3", level: 1, prerequisites: ["math3_ch2"] },
  { topicId: "math3_ch8",  subject: "Mathematics", grade: "3", level: 1, prerequisites: ["math3_ch2"] },
  { topicId: "math3_ch9",  subject: "Mathematics", grade: "3", level: 2, prerequisites: ["math3_ch3"] },
  { topicId: "math3_ch10", subject: "Mathematics", grade: "3", level: 2, prerequisites: ["math3_ch2"] },
  { topicId: "math3_ch11", subject: "Mathematics", grade: "3", level: 1, prerequisites: ["math3_ch2"] },
  { topicId: "math3_ch12", subject: "Mathematics", grade: "3", level: 2, prerequisites: ["math3_ch9"] },
  { topicId: "math3_ch13", subject: "Mathematics", grade: "3", level: 2, prerequisites: ["math3_ch2"] },
  { topicId: "math3_ch14", subject: "Mathematics", grade: "3", level: 2, prerequisites: ["math3_ch3", "math3_ch2"] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  for (const t of topics) {
    await Topic.findOneAndUpdate(
      { topicId: t.topicId },
      t,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${t.topicId}`);
  }
  console.log(`\nSeeded ${topics.length} Topic nodes for Class 3 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
