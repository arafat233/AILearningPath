/**
 * CBSE Class 4 Mathematics — Topic DAG seed
 * 14 nodes for grade "4". Safe to re-run.
 * Usage: node config/seedMath4TopicDAG.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/index.js";

dotenv.config();

const topics = [
  { topicId: "math4_ch1",  subject: "Mathematics", grade: "4", level: 1, prerequisites: [] },
  { topicId: "math4_ch2",  subject: "Mathematics", grade: "4", level: 1, prerequisites: [] },
  { topicId: "math4_ch3",  subject: "Mathematics", grade: "4", level: 1, prerequisites: [] },
  { topicId: "math4_ch4",  subject: "Mathematics", grade: "4", level: 1, prerequisites: [] },
  { topicId: "math4_ch5",  subject: "Mathematics", grade: "4", level: 1, prerequisites: ["math4_ch1"] },
  { topicId: "math4_ch6",  subject: "Mathematics", grade: "4", level: 2, prerequisites: ["math4_ch3"] },
  { topicId: "math4_ch7",  subject: "Mathematics", grade: "4", level: 2, prerequisites: ["math4_ch2"] },
  { topicId: "math4_ch8",  subject: "Mathematics", grade: "4", level: 2, prerequisites: ["math4_ch2"] },
  { topicId: "math4_ch9",  subject: "Mathematics", grade: "4", level: 2, prerequisites: ["math4_ch3"] },
  { topicId: "math4_ch10", subject: "Mathematics", grade: "4", level: 2, prerequisites: ["math4_ch1", "math4_ch3"] },
  { topicId: "math4_ch11", subject: "Mathematics", grade: "4", level: 2, prerequisites: ["math4_ch3", "math4_ch9"] },
  { topicId: "math4_ch12", subject: "Mathematics", grade: "4", level: 2, prerequisites: ["math4_ch6"] },
  { topicId: "math4_ch13", subject: "Mathematics", grade: "4", level: 3, prerequisites: ["math4_ch2", "math4_ch11"] },
  { topicId: "math4_ch14", subject: "Mathematics", grade: "4", level: 3, prerequisites: ["math4_ch10"] },
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
  console.log(`\nSeeded ${topics.length} Topic nodes for Class 4 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
