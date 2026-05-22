/**
 * CBSE Class 5 Mathematics — Topic DAG seed
 * 14 nodes for grade "5". Safe to re-run.
 * Usage: node config/seedMath5TopicDAG.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Topic } from "../models/index.js";

dotenv.config();

const topics = [
  { topicId: "math5_ch1",  subject: "Mathematics", grade: "5", level: 1, prerequisites: [] },
  { topicId: "math5_ch2",  subject: "Mathematics", grade: "5", level: 1, prerequisites: [] },
  { topicId: "math5_ch3",  subject: "Mathematics", grade: "5", level: 1, prerequisites: [] },
  { topicId: "math5_ch4",  subject: "Mathematics", grade: "5", level: 1, prerequisites: ["math5_ch1"] },
  { topicId: "math5_ch5",  subject: "Mathematics", grade: "5", level: 1, prerequisites: ["math5_ch2"] },
  { topicId: "math5_ch6",  subject: "Mathematics", grade: "5", level: 2, prerequisites: ["math5_ch1"] },
  { topicId: "math5_ch7",  subject: "Mathematics", grade: "5", level: 2, prerequisites: ["math5_ch1", "math5_ch6"] },
  { topicId: "math5_ch8",  subject: "Mathematics", grade: "5", level: 2, prerequisites: ["math5_ch2"] },
  { topicId: "math5_ch9",  subject: "Mathematics", grade: "5", level: 2, prerequisites: ["math5_ch2", "math5_ch5"] },
  { topicId: "math5_ch10", subject: "Mathematics", grade: "5", level: 2, prerequisites: ["math5_ch4"] },
  { topicId: "math5_ch11", subject: "Mathematics", grade: "5", level: 2, prerequisites: ["math5_ch3"] },
  { topicId: "math5_ch12", subject: "Mathematics", grade: "5", level: 2, prerequisites: ["math5_ch1"] },
  { topicId: "math5_ch13", subject: "Mathematics", grade: "5", level: 3, prerequisites: ["math5_ch1", "math5_ch6"] },
  { topicId: "math5_ch14", subject: "Mathematics", grade: "5", level: 3, prerequisites: ["math5_ch1", "math5_ch10"] },
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

  console.log(`\nSeeded ${topics.length} Topic nodes for Class 5 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
