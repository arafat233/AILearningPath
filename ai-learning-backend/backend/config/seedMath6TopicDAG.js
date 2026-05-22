/**
 * CBSE Class 6 Mathematics — Topic DAG seed
 * 10 nodes for grade "6". Safe to re-run.
 * Usage: node config/seedMath6TopicDAG.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/index.js";

dotenv.config();

const topics = [
  {
    topicId: "math6_ch1",
    subject: "Mathematics",
    grade: "6",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math6_ch2",
    subject: "Mathematics",
    grade: "6",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math6_ch3",
    subject: "Mathematics",
    grade: "6",
    level: 1,
    prerequisites: ["math6_ch1"],
  },
  {
    topicId: "math6_ch4",
    subject: "Mathematics",
    grade: "6",
    level: 2,
    prerequisites: ["math6_ch3"],
  },
  {
    topicId: "math6_ch5",
    subject: "Mathematics",
    grade: "6",
    level: 2,
    prerequisites: ["math6_ch3"],
  },
  {
    topicId: "math6_ch6",
    subject: "Mathematics",
    grade: "6",
    level: 2,
    prerequisites: ["math6_ch2"],
  },
  {
    topicId: "math6_ch7",
    subject: "Mathematics",
    grade: "6",
    level: 2,
    prerequisites: ["math6_ch3", "math6_ch5"],
  },
  {
    topicId: "math6_ch8",
    subject: "Mathematics",
    grade: "6",
    level: 2,
    prerequisites: ["math6_ch2", "math6_ch6"],
  },
  {
    topicId: "math6_ch9",
    subject: "Mathematics",
    grade: "6",
    level: 3,
    prerequisites: ["math6_ch2", "math6_ch8"],
  },
  {
    topicId: "math6_ch10",
    subject: "Mathematics",
    grade: "6",
    level: 3,
    prerequisites: ["math6_ch3"],
  },
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

  console.log(`\nSeeded ${topics.length} Topic nodes for Class 6 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
