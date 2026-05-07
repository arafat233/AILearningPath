// ============================================================
// BUILD RAG INDEX — one-time script
//
// Reads NcertChapter documents from MongoDB, extracts text
// chunks (overviews, concept definitions, Q&A pairs, formulas),
// and writes them to the NcertChunk collection.
//
// Safe to re-run: drops existing chunks for each subject before
// re-inserting so you don't get duplicates.
//
// Usage:
//   node backend/scripts/buildRagIndex.js
//   node backend/scripts/buildRagIndex.js --subject=Mathematics
// ============================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Import after dotenv so MONGO_URI is available
const { default: NcertChapterModel } = await import("../models/ncertTopicContentModel.js").catch(() => ({ default: null }));
const { NcertChunk } = await import("../models/index.js");

// ── Parse CLI args ─────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => a.slice(2).split("="))
);
const targetSubject = args.subject || null;

// ── MongoDB chapter model (inline import) ─────────────────────
import("mongoose").then(() => {});

const ncertChapterSchema = new mongoose.Schema({}, { strict: false });
const NcertChapter = mongoose.models.NcertChapter ||
  mongoose.model("NcertChapter", ncertChapterSchema, "nccrtchapters");

// ── Chunking helpers ───────────────────────────────────────────
function makeChunks(chapter) {
  const chunks = [];
  const base = {
    subject:       chapter.subject || "Mathematics",
    grade:         chapter.grade   || "10",
    chapterNumber: chapter.number,
    chapterTitle:  chapter.title,
    source:        `NCERT ${chapter.subject || "Mathematics"} Ch.${chapter.number}`,
  };

  // 1. Chapter overview
  if (chapter.overview?.trim()) {
    chunks.push({
      ...base,
      chunkType: "overview",
      text: `${chapter.title}: ${chapter.overview.trim()}`,
    });
  }

  // 2. Walk subchapters → concepts → topics → questions
  for (const sub of chapter.subchapters || []) {
    for (const concept of sub.concepts || []) {
      // Concept definition
      if (concept.definition?.trim()) {
        chunks.push({
          ...base,
          chunkType: "concept",
          conceptName: concept.name,
          text: `${concept.name}: ${concept.definition.trim()}`,
        });
      }

      for (const topic of concept.topics || []) {
        // Key formulas
        for (const formula of topic.key_formulas || []) {
          const f = typeof formula === "string" ? formula : JSON.stringify(formula);
          if (f.trim()) {
            chunks.push({
              ...base,
              chunkType: "formula",
              conceptName: concept.name,
              topicId: topic.id,
              text: `Formula (${topic.name || concept.name}): ${f.trim()}`,
            });
          }
        }

        // Q&A pairs
        for (const q of topic.questions || []) {
          if (!q.question?.trim()) continue;
          const answer = typeof q.answer === "string"
            ? q.answer.trim()
            : JSON.stringify(q.answer);
          chunks.push({
            ...base,
            chunkType: "qa",
            conceptName: concept.name,
            topicId: topic.id,
            source: q.source || base.source,
            text: `Q: ${q.question.trim()}\nA: ${answer}`,
          });
        }
      }
    }
  }

  return chunks;
}

// ── Main ───────────────────────────────────────────────────────
async function build() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  // Use the actual NcertChapter collection name
  const chaptersCollection = mongoose.connection.collection("nccrtchapters");
  const query = targetSubject ? { subject: targetSubject } : {};
  const chapters = await chaptersCollection.find(query).toArray();

  if (!chapters.length) {
    // Try alternate collection name
    const alt = mongoose.connection.collection("ncertchapters");
    const altChapters = await alt.find(query).toArray();
    if (altChapters.length) chapters.push(...altChapters);
  }

  if (!chapters.length) {
    console.log("No NcertChapter documents found. Run seedNcertContent.js first.");
    process.exit(0);
  }

  console.log(`Found ${chapters.length} chapters to index`);

  let totalChunks = 0;
  const subjects = [...new Set(chapters.map((c) => c.subject || "Mathematics"))];

  for (const subject of subjects) {
    // Clear existing chunks for this subject to avoid duplicates
    const deleted = await NcertChunk.deleteMany({ subject });
    if (deleted.deletedCount) console.log(`  Cleared ${deleted.deletedCount} old chunks for ${subject}`);

    const subjectChapters = chapters.filter((c) => (c.subject || "Mathematics") === subject);
    const allChunks = subjectChapters.flatMap(makeChunks);

    if (allChunks.length) {
      await NcertChunk.insertMany(allChunks, { ordered: false });
      console.log(`  ${subject}: inserted ${allChunks.length} chunks`);
      totalChunks += allChunks.length;
    }
  }

  console.log(`\nRAG index built: ${totalChunks} total chunks across ${subjects.length} subject(s)`);
  await mongoose.disconnect();
}

build().catch((err) => {
  console.error("buildRagIndex failed:", err.message);
  process.exit(1);
});
