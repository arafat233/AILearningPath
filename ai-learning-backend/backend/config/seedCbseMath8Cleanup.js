/**
 * Cleanup: delete all legacy math8_* topic content, questions, chunks, and Topic DAG nodes
 * for CBSE Math Class 8 before seeding the standardised cbse_math8_* set.
 * Run ONCE before seed:cbse-math8-content.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { Question, NcertChunk, Topic } from "../models/index.js";
dotenv.config();

const LEGACY_REGEX = /^math8_/;

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🧹  Cleaning up legacy CBSE Math 8 (math8_*) documents…");

  const [c1, c2, c3, c4] = await Promise.all([
    NcertTopicContent.deleteMany({ topicId: { $regex: LEGACY_REGEX } }),
    Question.deleteMany({ topicId: { $regex: LEGACY_REGEX } }),
    NcertChunk.deleteMany({ topicId: { $regex: LEGACY_REGEX } }),
    Topic.deleteMany({ topicId: { $regex: LEGACY_REGEX } }),
  ]);

  console.log(`  NcertTopicContent deleted: ${c1.deletedCount}`);
  console.log(`  Question deleted:          ${c2.deletedCount}`);
  console.log(`  NcertChunk deleted:        ${c3.deletedCount}`);
  console.log(`  Topic (DAG) deleted:       ${c4.deletedCount}`);
  console.log("✅  Legacy math8_* cleanup complete.");
  await mongoose.disconnect();
}

cleanup().catch((err) => { console.error(err); process.exit(1); });
