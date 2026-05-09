/**
 * Bridge: English Chapter → NcertChapter
 *
 * Reads the 27 English chapters from the Chapter collection
 * (seeded by seedEnglishCurriculum.js) and upserts them into
 * NcertChapter so the /api/v1/ncert/chapters endpoint returns them.
 *
 * Books:
 *   First Flight       (Ch 1–9)   → chapterId eng_ff_ch1 … eng_ff_ch9
 *   Footprints Without Feet (Ch 10–18) → eng_fw_ch1 … eng_fw_ch9
 *   Words and Expressions 2 (Ch 19–27) → eng_wb_unit1 … eng_wb_unit9
 *
 * Safe to re-run — upserts on { chapterId }.
 * Usage: node config/seedEnglishNcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Chapter }      from "../models/chapterModel.js";
import { NcertChapter } from "../models/ncertChapterModel.js";

function buildChapterId(num) {
  if (num >= 1  && num <= 9)  return `eng_ff_ch${num}`;
  if (num >= 10 && num <= 18) return `eng_fw_ch${num - 9}`;
  if (num >= 19 && num <= 27) return `eng_wb_unit${num - 18}`;
  return `eng_ch${num}`;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  const chapters = await Chapter.find({ subject: "English", grade: "10" })
    .sort({ chapterNumber: 1 })
    .lean();

  if (!chapters.length) {
    console.error("No English chapters found — run seed:english-curriculum first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const ch of chapters) {
    const chapterId = buildChapterId(ch.chapterNumber);

    const subchapters = (ch.sections || []).map((sec) => ({
      id:     `${chapterId}_${sec.sectionNumber}`.replace(/\s+/g, "_").toLowerCase(),
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
      await NcertChapter.updateOne({ chapterId }, { $set: { subchapters, title: ch.title, overview: ch.overview || "" } });
      updated++;
    } else {
      await NcertChapter.create({
        chapterId,
        number:     ch.chapterNumber,
        title:      ch.title,
        overview:   ch.overview || "",
        board:      "CBSE",
        grade:      "10",
        subject:    "English",
        subchapters,
      });
      created++;
    }
    console.log(`  ✓ Ch${ch.chapterNumber} [${ch.unit || "English"}] ${chapterId} — ${ch.title}`);
  }

  console.log(`\nDone: ${created} created, ${updated} updated (${chapters.length} total)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
