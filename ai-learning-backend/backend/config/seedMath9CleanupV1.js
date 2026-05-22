/**
 * seedMath9CleanupV1.js
 * Removes the old single-topic Class 9 NcertTopicContent entries (math9_ch1–math9_ch8)
 * that were superseded by the v2 sub-topic expansion (4 topics per chapter).
 * Safe to run multiple times (idempotent).
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const OLD_TOPIC_IDS = [
  "math9_ch1",
  "math9_ch2",
  "math9_ch3",
  "math9_ch4",
  "math9_ch5",
  "math9_ch6",
  "math9_ch7",
  "math9_ch8",
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const result = await NcertTopicContent.deleteMany({ topicId: { $in: OLD_TOPIC_IDS } });
  console.log(`Deleted ${result.deletedCount} old Class 9 v1 topic content entries.`);

  await mongoose.disconnect();
  console.log("Done.");
}

cleanup().catch((err) => {
  console.error(err);
  process.exit(1);
});
