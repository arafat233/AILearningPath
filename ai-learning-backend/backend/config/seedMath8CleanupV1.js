import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const OLD_TOPIC_IDS = [
  "math8_ch1","math8_ch2","math8_ch3","math8_ch4","math8_ch5",
  "math8_ch6","math8_ch7","math8_ch8","math8_ch9","math8_ch10",
  "math8_ch11","math8_ch12","math8_ch13","math8_ch14",
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const result = await NcertTopicContent.deleteMany({ topicId: { $in: OLD_TOPIC_IDS } });
  console.log(`Deleted ${result.deletedCount} old Class 8 v1 topic content entries.`);
  await mongoose.disconnect();
  console.log("Done.");
}

cleanup().catch((err) => { console.error(err); process.exit(1); });
