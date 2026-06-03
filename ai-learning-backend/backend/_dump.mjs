import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
await mongoose.connect(process.env.MONGO_URI);
const T = mongoose.connection.collection("protopics");
const out = {};
for (const id of process.argv.slice(2)) { const t = await T.findOne({ topicId: id }); out[id] = (t && t.teaching && t.teaching.visual_aid && t.teaching.visual_aid.svg) || "(none)"; }
fs.writeFileSync("E:/AILearningPath/ai-learning-frontend/frontend/_r.json", JSON.stringify(out));
console.log("dumped", Object.keys(out).length);
await mongoose.disconnect();
