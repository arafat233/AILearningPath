/**
 * CBSE Class 1 Mathematics — TopicDAG seed
 * Creates Topic nodes for the prerequisite graph. Safe to re-run.
 * Usage: node config/seedMath1TopicDAG.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

const topics = [
  { topicId: "math1_ch1",  subject: "Mathematics", grade: "1", level: 1, prerequisites: [] },
  { topicId: "math1_ch2",  subject: "Mathematics", grade: "1", level: 1, prerequisites: [] },
  { topicId: "math1_ch3",  subject: "Mathematics", grade: "1", level: 2, prerequisites: ["math1_ch2"] },
  { topicId: "math1_ch4",  subject: "Mathematics", grade: "1", level: 3, prerequisites: ["math1_ch3"] },
  { topicId: "math1_ch5",  subject: "Mathematics", grade: "1", level: 2, prerequisites: ["math1_ch2"] },
  { topicId: "math1_ch6",  subject: "Mathematics", grade: "1", level: 1, prerequisites: [] },
  { topicId: "math1_ch7",  subject: "Mathematics", grade: "1", level: 1, prerequisites: [] },
  { topicId: "math1_ch8",  subject: "Mathematics", grade: "1", level: 3, prerequisites: ["math1_ch5"] },
  { topicId: "math1_ch9",  subject: "Mathematics", grade: "1", level: 2, prerequisites: ["math1_ch2"] },
  { topicId: "math1_ch10", subject: "Mathematics", grade: "1", level: 1, prerequisites: [] },
  { topicId: "math1_ch11", subject: "Mathematics", grade: "1", level: 4, prerequisites: ["math1_ch8"] },
  { topicId: "math1_ch12", subject: "Mathematics", grade: "1", level: 3, prerequisites: ["math1_ch3"] },
  { topicId: "math1_ch13", subject: "Mathematics", grade: "1", level: 2, prerequisites: ["math1_ch2"] },
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
  console.log(`\nSeeded ${topics.length} Topic nodes for CBSE Class 1 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
