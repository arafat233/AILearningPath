/**
 * seedMath1CleanupV1.js
 * Removes the old single-topic Class 1 NcertTopicContent entries (math1_ch1–math1_ch13)
 * superseded by the v2 sub-topic expansion (4 topics per chapter).
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const OLD_TOPIC_IDS = [
  "math1_ch1","math1_ch2","math1_ch3","math1_ch4","math1_ch5","math1_ch6","math1_ch7",
  "math1_ch8","math1_ch9","math1_ch10","math1_ch11","math1_ch12","math1_ch13",
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const result = await NcertTopicContent.deleteMany({ topicId: { $in: OLD_TOPIC_IDS } });
  console.log(`Deleted ${result.deletedCount} old Class 1 v1 topic content entries.`);
  await mongoose.disconnect();
  console.log("Done.");
}

cleanup().catch((err) => { console.error(err); process.exit(1); });
