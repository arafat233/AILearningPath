/**
 * CBSE Class 8 Mathematics — Topic DAG seed
 * Textbook: "Ganita Prakash Grade 8 Part I + Part II" (NCERT 2026)
 * 14 topic nodes with prerequisite relationships. Safe to re-run.
 * Usage: node config/seedMath8TopicDAG.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/index.js";

dotenv.config();

const topics = [
  {
    topicId: "math8_ch1",
    subject: "Mathematics",
    grade: "8",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math8_ch2",
    subject: "Mathematics",
    grade: "8",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math8_ch3",
    subject: "Mathematics",
    grade: "8",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math8_ch4",
    subject: "Mathematics",
    grade: "8",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math8_ch5",
    subject: "Mathematics",
    grade: "8",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math8_ch6",
    subject: "Mathematics",
    grade: "8",
    level: 2,
    prerequisites: ["math8_ch5"],
  },
  {
    topicId: "math8_ch7",
    subject: "Mathematics",
    grade: "8",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math8_ch8",
    subject: "Mathematics",
    grade: "8",
    level: 2,
    prerequisites: ["math8_ch7"],
  },
  {
    topicId: "math8_ch9",
    subject: "Mathematics",
    grade: "8",
    level: 2,
    prerequisites: ["math8_ch1"],
  },
  {
    topicId: "math8_ch10",
    subject: "Mathematics",
    grade: "8",
    level: 2,
    prerequisites: ["math8_ch7"],
  },
  {
    topicId: "math8_ch11",
    subject: "Mathematics",
    grade: "8",
    level: 2,
    prerequisites: ["math8_ch4"],
  },
  {
    topicId: "math8_ch12",
    subject: "Mathematics",
    grade: "8",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math8_ch13",
    subject: "Mathematics",
    grade: "8",
    level: 2,
    prerequisites: ["math8_ch6"],
  },
  {
    topicId: "math8_ch14",
    subject: "Mathematics",
    grade: "8",
    level: 2,
    prerequisites: ["math8_ch4"],
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

  console.log(`\nSeeded ${topics.length} Topic nodes for Class 8 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
