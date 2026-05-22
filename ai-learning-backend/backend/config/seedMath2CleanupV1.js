import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const OLD_TOPIC_IDS = [
  "math2_ch1","math2_ch2","math2_ch3","math2_ch4","math2_ch5",
  "math2_ch6","math2_ch7","math2_ch8","math2_ch9","math2_ch10",
  "math2_ch11","math2_ch12","math2_ch13","math2_ch14","math2_ch15",
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const result = await NcertTopicContent.deleteMany({ topicId: { $in: OLD_TOPIC_IDS } });
  console.log(`Deleted ${result.deletedCount} old Class 2 v1 topic content entries.`);
  await mongoose.disconnect();
  console.log("Done.");
}

cleanup().catch((err) => { console.error(err); process.exit(1); });
