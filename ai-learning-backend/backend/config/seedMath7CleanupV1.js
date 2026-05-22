import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const OLD_TOPIC_IDS = [
  "math7_ch1","math7_ch2","math7_ch3","math7_ch4","math7_ch5",
  "math7_ch6","math7_ch7","math7_ch8","math7_ch9","math7_ch10",
  "math7_ch11","math7_ch12","math7_ch13","math7_ch14","math7_ch15",
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const result = await NcertTopicContent.deleteMany({ topicId: { $in: OLD_TOPIC_IDS } });
  console.log(`Deleted ${result.deletedCount} old Class 7 v1 topic content entries.`);
  await mongoose.disconnect();
  console.log("Done.");
}

cleanup().catch((err) => { console.error(err); process.exit(1); });
