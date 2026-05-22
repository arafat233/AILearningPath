import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/index.js";

dotenv.config();

const topics = [
  {
    topicId: "math9_ch1",
    subject: "Mathematics",
    grade: "9",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math9_ch2",
    subject: "Mathematics",
    grade: "9",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math9_ch3",
    subject: "Mathematics",
    grade: "9",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math9_ch4",
    subject: "Mathematics",
    grade: "9",
    level: 2,
    prerequisites: ["math9_ch2"],
  },
  {
    topicId: "math9_ch5",
    subject: "Mathematics",
    grade: "9",
    level: 2,
    prerequisites: ["math9_ch1"],
  },
  {
    topicId: "math9_ch6",
    subject: "Mathematics",
    grade: "9",
    level: 2,
    prerequisites: ["math9_ch3"],
  },
  {
    topicId: "math9_ch7",
    subject: "Mathematics",
    grade: "9",
    level: 1,
    prerequisites: [],
  },
  {
    topicId: "math9_ch8",
    subject: "Mathematics",
    grade: "9",
    level: 2,
    prerequisites: ["math9_ch2"],
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

  console.log(`\nSeeded ${topics.length} Topic nodes for Class 9 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
