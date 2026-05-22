import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const OLD_TOPIC_IDS = [
  "math5_ch1","math5_ch2","math5_ch3","math5_ch4","math5_ch5",
  "math5_ch6","math5_ch7","math5_ch8","math5_ch9","math5_ch10",
  "math5_ch11","math5_ch12","math5_ch13","math5_ch14",
];

async function cleanup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  const result = await NcertTopicContent.deleteMany({ topicId: { $in: OLD_TOPIC_IDS } });
  console.log(`Deleted ${result.deletedCount} old Class 5 v1 topic content entries.`);
  await mongoose.disconnect();
  console.log("Done.");
}

cleanup().catch((err) => { console.error(err); process.exit(1); });
