/**
 * One-off: enrol the child "surya" in pro_java to validate the multi-track
 * sidebar end-to-end. Uses the same proService.enroll path the HTTP route
 * does, so it exercises the real code (activeTrack write, progress upsert).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/index.js";
import { enroll } from "../services/proService.js";

await mongoose.connect(process.env.MONGO_URI);

const surya = await User.findOne({ name: /surya/i }).select("_id name grade examBoard tracks activeTrack").lean();
if (!surya) {
  console.error("Could not find a user named surya.");
  await mongoose.disconnect();
  process.exit(1);
}

console.log("Before:");
console.log({
  _id:         String(surya._id),
  name:        surya.name,
  grade:       surya.grade,
  examBoard:   surya.examBoard,
  tracks:      surya.tracks?.map((t) => t.key),
  activeTrack: surya.activeTrack,
});

const result = await enroll(String(surya._id), "pro_java");
console.log("\nEnrol result:", result);

const after = await User.findById(surya._id).select("tracks activeTrack").lean();
console.log("\nAfter:");
console.log({
  tracks:      after.tracks?.map((t) => t.key),
  activeTrack: after.activeTrack,
});

await mongoose.disconnect();
process.exit(0);
