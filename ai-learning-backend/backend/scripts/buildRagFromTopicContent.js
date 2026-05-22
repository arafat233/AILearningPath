// ============================================================
// BUILD RAG FROM TOPIC CONTENT — index standardized NcertTopicContent
//
// The legacy RAG builders (buildRagIndex.js, buildRagFromCurriculum.js)
// index NcertChapter / Chapter documents. The standardized Math pipeline
// (SPEC_MATH_STANDARDIZATION) stores its teaching content in
// NcertTopicContent — this script chunks THAT into NcertChunk so the
// AI tutor's RAG retrieval can surface the standardized content.
//
// Ownership: this script owns only the chunks whose topicId matches the
// prefix (default ^cbse_math9_). buildRagIndex.js is patched to never
// delete those, so the two indexers coexist regardless of run order.
//
// Usage:
//   node backend/scripts/buildRagFromTopicContent.js
//   node backend/scripts/buildRagFromTopicContent.js --prefix=cbse_math9_
// ============================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const { NcertChunk } = await import("../models/index.js");
const { NcertTopicContent } = await import("../models/ncertTopicContentModel.js");

const args = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("="))
);
const prefix = args.prefix || "cbse_math9_";
const idRegex = new RegExp("^" + prefix);

// Content collections are arrays in the standardized seeds but keyed objects
// in the legacy CBSE-10 docs (e.g. worked_example) — normalize to an array.
const asArray = (x) => (Array.isArray(x) ? x : (x && typeof x === "object" ? Object.values(x) : []));

// Derive grade from a board-prefixed id: cbse_math9_ch1_x -> "9"
function gradeFromId(id) {
  const m = (id || "").match(/^[a-z]+_[a-z]+(\d+)_/);
  return m ? m[1] : "10";
}

// Turn one NcertTopicContent doc into a handful of searchable chunks.
function chunksFor(topic) {
  const out = [];
  const tc = topic.teaching_content || {};
  const base = {
    subject:       topic.subject || "Mathematics",
    grade:         gradeFromId(topic.topicId),
    chapterNumber: topic.chapterNumber,
    chapterTitle:  topic.name,
    conceptName:   topic.name,
    topicId:       topic.topicId,
    source:        `Standardized ${topic.subject || "Mathematics"} — ${topic.name}`,
  };

  // 1. Overview — elevator pitch + key takeaway
  const pitch    = tc.intuition?.elevator_pitch?.trim();
  const takeaway = tc.key_takeaway?.trim();
  if (pitch || takeaway) {
    out.push({ ...base, chunkType: "overview",
      text: `${topic.name}: ${[pitch, takeaway].filter(Boolean).join(" ")}` });
  }

  // 2. Formulas
  for (const f of asArray(topic.key_formulas)) {
    const formula = typeof f === "string" ? f : f?.formula;
    const expl    = typeof f === "object" ? f?.explanation : "";
    if (formula?.trim()) {
      out.push({ ...base, chunkType: "formula",
        text: `Formula (${topic.name}): ${formula.trim()}${expl ? " — " + expl.trim() : ""}` });
    }
  }

  // 3. Worked examples → QA chunks
  for (const ex of asArray(tc.worked_example)) {
    if (ex?.problem?.trim()) {
      out.push({ ...base, chunkType: "qa",
        text: `Q (${topic.name}): ${ex.problem.trim()}\nA: ${String(ex.answer || "").trim()}` });
    }
  }

  // 4. Common misconceptions → concept chunks
  for (const m of asArray(tc.common_misconceptions)) {
    if (m?.wrong_idea?.trim()) {
      out.push({ ...base, chunkType: "concept",
        text: `Common misconception (${topic.name}): ${m.wrong_idea.trim()} → Correction: ${String(m.correction || "").trim()}` });
    }
  }

  return out;
}

async function build() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const topics = await NcertTopicContent.find({ topicId: idRegex }).lean();
  if (!topics.length) {
    console.log(`No NcertTopicContent docs match /^${prefix}/. Nothing to index.`);
    await mongoose.disconnect();
    return;
  }

  // Clear only this prefix's chunks (never touches the NcertChapter-based ones)
  const deleted = await NcertChunk.deleteMany({ topicId: idRegex });
  if (deleted.deletedCount) console.log(`Cleared ${deleted.deletedCount} old chunks for ${prefix}*`);

  const allChunks = topics.flatMap(chunksFor);
  if (allChunks.length) await NcertChunk.insertMany(allChunks, { ordered: false });

  console.log(`RAG topic-content index built: ${topics.length} topics → ${allChunks.length} chunks (${prefix}*)`);
  await mongoose.disconnect();
}

build().catch((err) => {
  console.error("buildRagFromTopicContent failed:", err.message);
  process.exit(1);
});
