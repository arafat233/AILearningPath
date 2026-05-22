/**
 * CBSE Class 7 Mathematics — Topic DAG seed
 * Textbook: "Ganita Prakash Grade 7 Part I + Part II" (NCERT 2026)
 * 15 topic nodes with prerequisite relationships. Safe to re-run.
 * Usage: node config/seedMath7TopicDAG.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/index.js";

dotenv.config();

const topics = [
  { topicId: "math7_ch1",  subject: "Mathematics", grade: "7", level: 1, prerequisites: [] },
  { topicId: "math7_ch2",  subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch1"] },
  { topicId: "math7_ch3",  subject: "Mathematics", grade: "7", level: 1, prerequisites: [] },
  { topicId: "math7_ch4",  subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch2"] },
  { topicId: "math7_ch5",  subject: "Mathematics", grade: "7", level: 1, prerequisites: [] },
  { topicId: "math7_ch6",  subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch1"] },
  { topicId: "math7_ch7",  subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch5"] },
  { topicId: "math7_ch8",  subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch3"] },
  { topicId: "math7_ch9",  subject: "Mathematics", grade: "7", level: 3, prerequisites: ["math7_ch5", "math7_ch7"] },
  { topicId: "math7_ch10", subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch2"] },
  { topicId: "math7_ch11", subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch6"] },
  { topicId: "math7_ch12", subject: "Mathematics", grade: "7", level: 3, prerequisites: ["math7_ch3", "math7_ch8"] },
  { topicId: "math7_ch13", subject: "Mathematics", grade: "7", level: 2, prerequisites: ["math7_ch1"] },
  { topicId: "math7_ch14", subject: "Mathematics", grade: "7", level: 3, prerequisites: ["math7_ch5", "math7_ch7"] },
  { topicId: "math7_ch15", subject: "Mathematics", grade: "7", level: 3, prerequisites: ["math7_ch4", "math7_ch10"] },
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

  console.log(`\nSeeded ${topics.length} Topic nodes for Class 7 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
