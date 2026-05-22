// READ-ONLY dump of every collection in ai_learning -> JSONL files.
// No writes. No drops. No updates. Pure find({}) per collection.
import mongoose from "mongoose";
import { EJSON } from "bson";
import fs from "fs";
import path from "path";

const URI  = "mongodb://localhost:27017/ai_learning";
const DEST = "C:/Users/LENOVO/OneDrive/Desktop/DB Data/ai_learning";

fs.mkdirSync(DEST, { recursive: true });

await mongoose.connect(URI);
const db = mongoose.connection.db;
const cols = (await db.listCollections().toArray()).map(c => c.name).sort();

console.log(`DB: ${db.databaseName}`);
console.log(`Collections: ${cols.length}`);
console.log(`Destination: ${DEST}\n`);

const summary = [];
for (const name of cols) {
  const docs = await db.collection(name).find({}).toArray();
  const file = path.join(DEST, `${name}.json`);
  const lines = docs.map(d => EJSON.stringify(d)).join("\n");
  fs.writeFileSync(file, lines);
  const bytes = fs.statSync(file).size;
  summary.push({ name, count: docs.length, bytes });
  console.log(`  ${name.padEnd(35)} ${String(docs.length).padStart(6)} docs   ${(bytes/1024).toFixed(1)} KB`);
}

const totalDocs  = summary.reduce((s, x) => s + x.count, 0);
const totalBytes = summary.reduce((s, x) => s + x.bytes, 0);
console.log(`\nTOTAL: ${totalDocs} docs, ${(totalBytes/1024/1024).toFixed(2)} MB across ${cols.length} files`);

fs.writeFileSync(path.join(DEST, "_manifest.json"), JSON.stringify({
  dumpedAt: new Date().toISOString(),
  sourceUri: URI,
  database: db.databaseName,
  collections: summary,
  totalDocs,
  totalBytes,
}, null, 2));

await mongoose.disconnect();
console.log("\nDump complete. No DB modifications were made.");
