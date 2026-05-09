/**
 * Bridge: Social Science Chapter → NcertChapter
 *
 * Reads the 22 Social Science chapters from the Chapter collection
 * (seeded by seedSocialScienceCurriculum.js) and upserts them into
 * NcertChapter so the /api/v1/ncert/chapters endpoint returns them.
 *
 * chapterId format: sst_ch1 … sst_ch22  (avoids collision with Math ch1-ch14)
 *
 * Safe to re-run — upserts on { chapterId }.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedSocialScienceNcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Chapter }      from "../models/chapterModel.js";
import { NcertChapter } from "../models/ncertChapterModel.js";

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  const chapters = await Chapter.find({ subject: "Social Science", grade: "10" })
    .sort({ chapterNumber: 1 })
    .lean();

  if (!chapters.length) {
    console.error("No Social Science chapters found — run seed:social-science-curriculum first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const ch of chapters) {
    const chapterId = `sst_ch${ch.chapterNumber}`;

    const subchapters = (ch.sections || []).map((sec) => ({
      id:     sec.sectionNumber,
      number: sec.sectionNumber,
      title:  sec.title,
      concepts: (sec.microConcepts || []).map((mc, idx) => ({
        id:     `${sec.sectionNumber}_c${idx + 1}`,
        name:   mc.title,
        definition: mc.explanation || "",
        topics: [],
      })),
    }));

    const doc = {
      chapterId,
      number:     ch.chapterNumber,
      title:      ch.title,
      overview:   ch.overview || "",
      board:      "CBSE",
      grade:      "10",
      subject:    "Social Science",
      subchapters,
    };

    const existing = await NcertChapter.findOne({ chapterId });
    if (existing) {
      await NcertChapter.updateOne({ chapterId }, { $set: doc });
      updated++;
    } else {
      await NcertChapter.create(doc);
      created++;
    }

    console.log(`  ✓ Ch${ch.chapterNumber} — ${ch.title}`);
  }

  console.log(`\nDone: ${created} created, ${updated} updated (${chapters.length} total)`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
