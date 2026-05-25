/**
 * CBSE Class 10 Science — Ph1 NcertChapter skeleton.
 *
 * Mirrors the AP_SSC / ICSE skeleton-seed pattern. Topic content lives in
 * NcertTopicContent under the `sci_ch{N}_*` topicId prefix (legacy CBSE
 * default — no board prefix). 13 chapters.
 *
 * chapterId format: cbse_sci10_ch{N}
 * board: "CBSE" · grade: "10" · subject: "Science"
 *
 * Safe to re-run (upserts on chapterId).
 * Usage: node config/seedCbseScience10NcertChapters.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const CHAPTERS = [
  // Chemistry
  { chapterId: "cbse_sci10_ch1",  number: 1,  title: "Chemical Reactions and Equations" },
  { chapterId: "cbse_sci10_ch2",  number: 2,  title: "Acids, Bases and Salts" },
  { chapterId: "cbse_sci10_ch3",  number: 3,  title: "Metals and Non-metals" },
  { chapterId: "cbse_sci10_ch4",  number: 4,  title: "Carbon and its Compounds" },
  // Biology
  { chapterId: "cbse_sci10_ch5",  number: 5,  title: "Life Processes" },
  { chapterId: "cbse_sci10_ch6",  number: 6,  title: "Control and Coordination" },
  { chapterId: "cbse_sci10_ch7",  number: 7,  title: "How do Organisms Reproduce?" },
  { chapterId: "cbse_sci10_ch8",  number: 8,  title: "Heredity" },
  // Physics
  { chapterId: "cbse_sci10_ch9",  number: 9,  title: "Light — Reflection and Refraction" },
  { chapterId: "cbse_sci10_ch10", number: 10, title: "The Human Eye and the Colourful World" },
  { chapterId: "cbse_sci10_ch11", number: 11, title: "Electricity" },
  { chapterId: "cbse_sci10_ch12", number: 12, title: "Magnetic Effects of Electric Current" },
  // Biology (continued)
  { chapterId: "cbse_sci10_ch13", number: 13, title: "Our Environment" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  let upserted = 0;
  for (const ch of CHAPTERS) {
    await NcertChapter.findOneAndUpdate(
      { chapterId: ch.chapterId },
      {
        chapterId: ch.chapterId,
        number:    ch.number,
        title:     ch.title,
        board:     "CBSE",
        grade:     "10",
        subject:   "Science",
        overview:  "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${ch.chapterId}: ${ch.title}`);
    upserted++;
  }

  console.log(`\nSeeded ${upserted} NcertChapter docs for CBSE Class 10 Science.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
