// export_content.mjs — run as: node export_content.mjs
import mongoose from "mongoose";
import fs from "fs";

const MONGO_URI = "mongodb://localhost:27017/ai_learning";
await mongoose.connect(MONGO_URI);

const cols = ["questions", "topics", "ncerttopiccontents", "lessons", "chapters", "ncertchapters", "exams"];
for (const col of cols) {
  const docs = await mongoose.connection.db.collection(col).find({}).toArray();
  fs.writeFileSync(`C:/Users/LENOVO/AppData/Local/Temp/${col}.json`, docs.map(d => JSON.stringify(d)).join("\n"));
  console.log(`${col}: ${docs.length} docs`);
}

await mongoose.disconnect();
console.log("Done.");
