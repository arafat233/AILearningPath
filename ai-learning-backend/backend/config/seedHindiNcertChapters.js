/**
 * Bridge: Hindi Chapter → NcertChapter
 *
 * Reads the 32 Hindi chapters from the Chapter collection
 * (seeded by seedHindiCurriculum.js) and upserts into NcertChapter
 * so /api/v1/ncert/chapters?subject=Hindi returns them.
 *
 * Books (folder → textbook name → chapter range):
 *   jhks1dd → Kshitij Bhaag 2    → Ch 1–12  → hin_ks_ch1  … hin_ks_ch12
 *   jhsp1dd → Sparsh Bhaag 2     → Ch 13–26 → hin_sp_ch13 … hin_sp_ch26
 *   jhkr1dd → Kritika Bhaag 2    → Ch 27–29 → hin_kr_ch27 … hin_kr_ch29
 *   jhsy1dd → Sanchayan Bhaag 2  → Ch 30–32 → hin_sy_ch30 … hin_sy_ch32
 *
 * Safe to re-run — upserts on { chapterId }.
 * Usage: node config/seedHindiNcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Chapter }      from "../models/chapterModel.js";
import { NcertChapter } from "../models/ncertChapterModel.js";

function buildChapterId(num) {
  if (num >= 1  && num <= 12) return `hin_ks_ch${num}`;
  if (num >= 13 && num <= 26) return `hin_sp_ch${num}`;
  if (num >= 27 && num <= 29) return `hin_kr_ch${num}`;
  if (num >= 30 && num <= 32) return `hin_sy_ch${num}`;
  return `hin_ch${num}`;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  const chapters = await Chapter.find({ subject: "Hindi", grade: "10" })
    .sort({ chapterNumber: 1 })
    .lean();

  if (!chapters.length) {
    console.error("No Hindi chapters found — run seed:hindi-curriculum first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const ch of chapters) {
    const chapterId = buildChapterId(ch.chapterNumber);

    const subchapters = (ch.sections || []).map((sec) => ({
      id:     `${chapterId}_${String(sec.sectionNumber).replace(/\s+/g, "_").toLowerCase()}`,
      number: sec.sectionNumber,
      title:  sec.title,
      concepts: (sec.microConcepts || []).map((mc, idx) => ({
        id:         `${chapterId}_c${idx + 1}`,
        name:       mc.title,
        definition: mc.explanation || "",
        topics:     [],
      })),
    }));

    const existing = await NcertChapter.findOne({ chapterId });
    if (existing) {
      await NcertChapter.updateOne(
        { chapterId },
        { $set: { subchapters, title: ch.title, overview: ch.overview || "" } }
      );
      updated++;
    } else {
      await NcertChapter.create({
        chapterId,
        number:     ch.chapterNumber,
        title:      ch.title,
        overview:   ch.overview || "",
        board:      "CBSE",
        grade:      "10",
        subject:    "Hindi",
        subchapters,
      });
      created++;
    }
    console.log(`  ✓ Ch${ch.chapterNumber} [${ch.unit}] ${chapterId} — ${ch.title}`);
  }

  console.log(`\nDone: ${created} created, ${updated} updated (${chapters.length} total)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
