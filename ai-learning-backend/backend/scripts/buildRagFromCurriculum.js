// ============================================================
// BUILD RAG FROM CURRICULUM — index Chapter docs for non-Math subjects
//
// Reads Chapter documents (seeded by seedScienceCurriculum.js etc.)
// and writes NcertChunk documents so RAG context works for all subjects.
//
// Math already has richer NcertChapter data — skip it here.
// Safe to re-run: clears old chunks per subject before re-inserting.
//
// Usage:
//   node backend/scripts/buildRagFromCurriculum.js
//   node backend/scripts/buildRagFromCurriculum.js --subject=Science
// ============================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const { NcertChunk } = await import("../models/index.js");
const { Chapter }    = await import("../models/chapterModel.js");

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => a.slice(2).split("="))
);
const targetSubject = args.subject || null;

const NON_MATH_SUBJECTS = ["Science", "English", "Hindi", "Social Science"];

function makeChunksFromChapter(ch) {
  const chunks = [];
  const base = {
    subject:       ch.subject,
    grade:         ch.grade || "10",
    chapterNumber: ch.chapterNumber,
    chapterTitle:  ch.title,
    source:        `NCERT ${ch.subject} Ch.${ch.chapterNumber}`,
  };

  // 1. Chapter overview
  if (ch.overview?.trim()) {
    chunks.push({
      ...base,
      chunkType: "overview",
      text: `${ch.title}: ${ch.overview.trim()}`,
    });
  }

  // 2. Sections + microConcepts
  for (const sec of ch.sections || []) {
    const secText = [sec.title, ...((sec.microConcepts || []).map((mc) => {
      const parts = [mc.title];
      if (mc.explanation?.trim()) parts.push(mc.explanation.trim());
      return parts.join(" — ");
    }))].filter(Boolean).join(". ");

    if (secText.trim()) {
      chunks.push({
        ...base,
        chunkType:   "concept",
        conceptName: sec.title,
        text:        `${sec.sectionNumber || ""} ${sec.title}: ${secText}`.trim(),
      });
    }
  }

  // 3. Theorems
  for (const thm of ch.theorems || []) {
    if (thm.name?.trim() || thm.statement?.trim()) {
      chunks.push({
        ...base,
        chunkType:   "concept",
        conceptName: thm.name,
        text:        `Theorem — ${thm.name}: ${thm.statement || ""}`.trim(),
      });
    }
  }

  // 4. Key formulas
  for (const formula of ch.keyFormulas || []) {
    if (formula?.trim()) {
      chunks.push({
        ...base,
        chunkType:   "formula",
        conceptName: ch.title,
        text:        `Formula (${ch.title}): ${formula.trim()}`,
      });
    }
  }

  // 5. Exam tips as QA-style chunks
  for (const tip of ch.examTips || []) {
    if (tip?.trim()) {
      chunks.push({
        ...base,
        chunkType:   "qa",
        conceptName: ch.title,
        text:        `Exam tip — ${ch.title}: ${tip.trim()}`,
      });
    }
  }

  return chunks;
}

async function build() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const subjectsToIndex = targetSubject
    ? [targetSubject]
    : NON_MATH_SUBJECTS;

  let totalChunks = 0;

  for (const subject of subjectsToIndex) {
    const chapters = await Chapter.find({ subject }).lean();

    if (!chapters.length) {
      console.log(`  ${subject}: no Chapter documents found — run seed:${subject.toLowerCase().replace(" ", "-")}-curriculum first`);
      continue;
    }

    // Clear old chunks for this subject
    const { deletedCount } = await NcertChunk.deleteMany({ subject });
    if (deletedCount) console.log(`  Cleared ${deletedCount} old chunks for ${subject}`);

    const allChunks = chapters.flatMap(makeChunksFromChapter);
    if (allChunks.length) {
      await NcertChunk.insertMany(allChunks, { ordered: false });
      console.log(`  ${subject}: inserted ${allChunks.length} chunks from ${chapters.length} chapters`);
      totalChunks += allChunks.length;
    } else {
      console.log(`  ${subject}: 0 chunks generated (chapters may have empty content)`);
    }
  }

  console.log(`\nRAG curriculum index built: ${totalChunks} total chunks`);
  await mongoose.disconnect();
}

build().catch((err) => {
  console.error("buildRagFromCurriculum failed:", err.message);
  process.exit(1);
});
