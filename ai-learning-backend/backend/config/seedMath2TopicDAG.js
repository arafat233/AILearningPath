/**
 * CBSE Class 2 Mathematics — TopicDAG seed
 * Creates Topic nodes for the prerequisite graph. Safe to re-run.
 * Usage: node config/seedMath2TopicDAG.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

const topics = [
  { topicId: "math2_ch1",  subject: "Mathematics", grade: "2", level: 1,  prerequisites: [] },
  { topicId: "math2_ch2",  subject: "Mathematics", grade: "2", level: 1,  prerequisites: [] },
  { topicId: "math2_ch3",  subject: "Mathematics", grade: "2", level: 1,  prerequisites: [] },
  { topicId: "math2_ch4",  subject: "Mathematics", grade: "2", level: 2,  prerequisites: ["math2_ch2"] },
  { topicId: "math2_ch5",  subject: "Mathematics", grade: "2", level: 1,  prerequisites: [] },
  { topicId: "math2_ch6",  subject: "Mathematics", grade: "2", level: 2,  prerequisites: ["math2_ch1"] },
  { topicId: "math2_ch7",  subject: "Mathematics", grade: "2", level: 1,  prerequisites: [] },
  { topicId: "math2_ch8",  subject: "Mathematics", grade: "2", level: 3,  prerequisites: ["math2_ch4"] },
  { topicId: "math2_ch9",  subject: "Mathematics", grade: "2", level: 3,  prerequisites: ["math2_ch4"] },
  { topicId: "math2_ch10", subject: "Mathematics", grade: "2", level: 4,  prerequisites: ["math2_ch8"] },
  { topicId: "math2_ch11", subject: "Mathematics", grade: "2", level: 2,  prerequisites: ["math2_ch1"] },
  { topicId: "math2_ch12", subject: "Mathematics", grade: "2", level: 5,  prerequisites: ["math2_ch10"] },
  { topicId: "math2_ch13", subject: "Mathematics", grade: "2", level: 3,  prerequisites: ["math2_ch6"] },
  { topicId: "math2_ch14", subject: "Mathematics", grade: "2", level: 6,  prerequisites: ["math2_ch12"] },
  { topicId: "math2_ch15", subject: "Mathematics", grade: "2", level: 3,  prerequisites: ["math2_ch4"] },
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
  console.log(`\nSeeded ${topics.length} Topic nodes for CBSE Class 2 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
