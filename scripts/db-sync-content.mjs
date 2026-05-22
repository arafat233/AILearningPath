// One-shot content-sync tool.
// Usage:
//   node scripts/db-sync-content.mjs export <mongo-uri> <output-file>
//   node scripts/db-sync-content.mjs import <mongo-uri> <input-file>
//
// Touches ONLY content collections (NCERT chapters, topics, questions, chunks,
// chapters legacy, topics legacy, lessons). Never modifies user collections.

import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";

const CONTENT_COLLECTIONS = [
  "ncertchapters",
  "ncerttopiccontents",
  "questions",
  "ncertchunks",
  "chapters",
  "topics",
  "lessons",
];

const [, , mode, uri, file] = process.argv;
if (!["export", "import"].includes(mode) || !uri || !file) {
  console.error("Usage: node db-sync-content.mjs <export|import> <mongo-uri> <file>");
  process.exit(1);
}

await mongoose.connect(uri);
const db = mongoose.connection.db;

if (mode === "export") {
  const out = {};
  for (const name of CONTENT_COLLECTIONS) {
    const docs = await db.collection(name).find({}).toArray();
    out[name] = docs;
    console.log(`  ${name}: exported ${docs.length}`);
  }
  fs.writeFileSync(file, JSON.stringify(out));
  const stat = fs.statSync(file);
  console.log(`Total: ${(stat.size / 1024 / 1024).toFixed(1)} MB → ${file}`);
} else {
  if (!fs.existsSync(file)) {
    console.error(`Input file not found: ${file}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const name of CONTENT_COLLECTIONS) {
    if (!data[name]) { console.log(`  ${name}: skipped (not in archive)`); continue; }
    const col = db.collection(name);
    const beforeCount = await col.countDocuments();
    await col.deleteMany({}); // wipe content collection only
    if (data[name].length) {
      await col.insertMany(data[name], { ordered: false });
    }
    const afterCount = await col.countDocuments();
    console.log(`  ${name}: ${beforeCount} → ${afterCount}`);
  }
  console.log("Restore complete.");
}

await mongoose.disconnect();
