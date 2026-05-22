import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const OLD_TOPIC_IDS = [
  "math3_ch1","math3_ch2","math3_ch3","math3_ch4","math3_ch5",
  "math3_ch6","math3_ch7","math3_ch8","math3_ch9","math3_ch10",
  "math3_ch11","math3_ch12","math3_ch13","math3_ch14",
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const result = await NcertTopicContent.deleteMany({ topicId: { $in: OLD_TOPIC_IDS } });
  console.log(`Deleted ${result.deletedCount} old Class 3 v1 topic content entries.`);
  await mongoose.disconnect();
  console.log("Done.");
}

cleanup().catch((err) => { console.error(err); process.exit(1); });
