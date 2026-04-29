/**
 * Import NCERT CBSE Class 10 Math content into MongoDB.
 *
 * Usage:
 *   node backend/config/importNcert.js
 *
 * Re-running is safe — it upserts (insert or replace) every document.
 *
 * Data sources (hardcoded paths — change if files move):
 *   Textbook JSONs : C:/Users/LENOVO/Downloads/textbook/
 *   Topic content  : C:/Users/LENOVO/Downloads/Topic wise/
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { NcertChapter } from "../models/ncertChapterModel.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TEXTBOOK_DIR  = "C:/Users/LENOVO/Downloads/textbook";
const TOPICWISE_DIR = "C:/Users/LENOVO/Downloads/Topic wise";

async function importChapters() {
  const files = (await readdir(TEXTBOOK_DIR)).filter((f) => f.endsWith(".json"));
  let total = 0;

  for (const file of files) {
    const raw  = await readFile(path.join(TEXTBOOK_DIR, file), "utf-8");
    const data = JSON.parse(raw);
    const chapters = data.chapters ?? [];

    for (const ch of chapters) {
      await NcertChapter.findOneAndUpdate(
        { chapterId: ch.id },
        {
          chapterId:   ch.id,
          number:      ch.number,
          title:       ch.title,
          overview:    ch.overview ?? "",
          board:       data.metadata?.board    ?? "CBSE",
          grade:       String(data.metadata?.class ?? "10"),
          subject:     data.metadata?.subject  ?? "Mathematics",
          subchapters: ch.subchapters ?? [],
        },
        { upsert: true, new: true }
      );
      total++;
      console.log(`  Chapter upserted: ${ch.id} — ${ch.title}`);
    }
  }

  return total;
}

async function importTopicContent() {
  const files = (await readdir(TOPICWISE_DIR)).filter((f) => f.endsWith(".json"));
  let total = 0;

  for (const file of files) {
    const raw  = await readFile(path.join(TOPICWISE_DIR, file), "utf-8");
    const data = JSON.parse(raw);
    const { metadata, topic } = data;

    if (!metadata?.topic_id || !topic) {
      console.warn(`  Skipping ${file} — missing topic_id or topic`);
      continue;
    }

    await NcertTopicContent.findOneAndUpdate(
      { topicId: metadata.topic_id },
      {
        topicId:                metadata.topic_id,
        chapterNumber:          metadata.chapter ?? 0,
        name:                   topic.name ?? "",
        prerequisite_knowledge: topic.prerequisite_knowledge ?? [],
        key_formulas:           topic.key_formulas ?? [],
        teaching_content:       topic.teaching_content ?? {},
      },
      { upsert: true, new: true }
    );
    total++;
    console.log(`  Topic content upserted: ${metadata.topic_id}`);
  }

  return total;
}

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) { console.error("MONGO_URI not set"); process.exit(1); }

  await mongoose.connect(uri);
  console.log("MongoDB connected");

  console.log("\n── Importing textbook chapters ──");
  const chCount = await importChapters();

  console.log("\n── Importing topic teaching content ──");
  const tcCount = await importTopicContent();

  console.log(`\nDone. ${chCount} chapters, ${tcCount} topic-content documents upserted.`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
