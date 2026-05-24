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
// Name resolution (in priority order):
//   1. topic.name — present on CBSE NcertTopicContent docs
//   2. topics collection — queried via nameMap; covers ICSE docs that have
//      no name field on NcertTopicContent
//   3. deriveNameFromId() — last-resort readable label from topicId segments
//
// Usage:
//   node backend/scripts/buildRagFromTopicContent.js
//   node backend/scripts/buildRagFromTopicContent.js --prefix=cbse_math9_
//   node backend/scripts/buildRagFromTopicContent.js --prefix=icse_math10_
// ============================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const { NcertChunk, Topic } = await import("../models/index.js");
const { NcertTopicContent } = await import("../models/ncertTopicContentModel.js");

const args = Object.fromEntries(
  process.argv.slice(2).filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("="))
);
const prefix = args.prefix || "cbse_math9_";
const idRegex = new RegExp("^" + prefix);

// Content collections are arrays in the standardized seeds but keyed objects
// in the legacy CBSE-10 docs (e.g. worked_example) — normalize to an array.
const asArray = (x) => (Array.isArray(x) ? x : (x && typeof x === "object" ? Object.values(x) : []));

// Derive grade from a topicId.
//   Board-prefixed new format:  cbse_math9_ch1_x  icse_math10_ch1_x  → "9", "10"
//   Legacy v2 format:           math8_ch1_squares                      → "8"
function gradeFromId(id) {
  const m1 = (id || "").match(/^[a-z]+_[a-z]+(\d+)_/);
  if (m1) return m1[1];
  const m2 = (id || "").match(/^math(\d+)_/);
  if (m2) return m2[1];
  return "10";
}

// Last-resort name derivation from topicId:
//   icse_math10_ch22_angles_elevation_depression
//   → segments after ch{n}: "angles elevation depression"
//   → Title Cased: "Angles Elevation Depression"
function deriveNameFromId(id) {
  const segs = (id || "").split("_");
  // Drop board/subject prefix (icse, math10) and chapter segment (ch22)
  const chIdx = segs.findIndex((s) => /^ch\d+$/.test(s));
  const words  = chIdx >= 0 ? segs.slice(chIdx + 1) : segs;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || id;
}

// Turn one NcertTopicContent doc into a handful of searchable chunks.
// nameMap — topicId → name — supplements topic.name for content types
// that store no name on the NcertTopicContent doc (e.g. ICSE Math 10).
function chunksFor(topic, nameMap) {
  const out = [];

  // Normalize v2 flat format (math{N}_ seeds) into the same shape as the standardized
  // teaching_content format so the rest of the function is format-agnostic.
  // v2 stores: topic.title, topic.intuition, topic.worked_example,
  //            topic.common_misconceptions, topic.shortcuts_and_tricks, topic.key_takeaway
  const tc = topic.teaching_content
    ? topic.teaching_content
    : {
        intuition:             { elevator_pitch: String(topic.intuition || "") },
        worked_example:        topic.worked_example
                                 ? [{ problem: String(topic.worked_example), answer: String(topic.process_explanation || "") }]
                                 : [],
        common_misconceptions: topic.common_misconceptions
                                 ? [{ wrong_idea: String(topic.common_misconceptions), correction: String(topic.shortcuts_and_tricks || "") }]
                                 : [],
        key_takeaway:          String(topic.key_takeaway || ""),
      };

  // Resolve best available name (priority order):
  //   1. topic.title  — v2 flat seeds store title not name
  //   2. topic.name   — new standardised seeds (cbse_math9_, icse_math10_)
  //   3. nameMap      — ICSE NcertTopicContent has no name field; queried from topics collection
  //   4. deriveNameFromId — last resort readable label
  const resolvedName =
    (topic.title && topic.title !== topic.topicId ? topic.title : null)
    || (topic.name  && topic.name  !== topic.topicId ? topic.name  : null)
    || nameMap?.get(topic.topicId)
    || deriveNameFromId(topic.topicId);

  const base = {
    subject:       topic.subject || "Mathematics",
    grade:         gradeFromId(topic.topicId),
    chapterNumber: topic.chapterNumber,
    chapterTitle:  resolvedName,
    conceptName:   resolvedName,
    topicId:       topic.topicId,
    source:        `Standardized ${topic.subject || "Mathematics"} — ${resolvedName}`,
  };

  // 1. Overview — elevator pitch + key takeaway
  const pitch    = tc.intuition?.elevator_pitch?.trim();
  const takeaway = tc.key_takeaway?.trim();
  if (pitch || takeaway) {
    out.push({ ...base, chunkType: "overview",
      text: `${resolvedName}: ${[pitch, takeaway].filter(Boolean).join(" ")}` });
  }

  // 2. Formulas
  for (const f of asArray(topic.key_formulas)) {
    const formula = typeof f === "string" ? f : f?.formula;
    const expl    = typeof f === "object" ? f?.explanation : "";
    if (formula?.trim()) {
      out.push({ ...base, chunkType: "formula",
        text: `Formula (${resolvedName}): ${formula.trim()}${expl ? " — " + expl.trim() : ""}` });
    }
  }

  // 3. Worked examples → QA chunks
  for (const ex of asArray(tc.worked_example)) {
    if (ex?.problem?.trim()) {
      out.push({ ...base, chunkType: "qa",
        text: `Q (${resolvedName}): ${ex.problem.trim()}\nA: ${String(ex.answer || "").trim()}` });
    }
  }

  // 4. Common misconceptions → concept chunks
  for (const m of asArray(tc.common_misconceptions)) {
    if (m?.wrong_idea?.trim()) {
      out.push({ ...base, chunkType: "concept",
        text: `Common misconception (${resolvedName}): ${m.wrong_idea.trim()} → Correction: ${String(m.correction || "").trim()}` });
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

  // Build a name fallback map from the `topics` collection — needed for
  // content types (e.g. ICSE Math 10) that have no `name` on NcertTopicContent.
  const topicDocs = await Topic.find({ topicId: idRegex }, { topicId: 1, name: 1 }).lean();
  const nameMap = new Map(topicDocs.map((t) => [t.topicId, t.name]));
  if (topicDocs.length) {
    console.log(`Name fallback map loaded: ${topicDocs.length} entries from topics collection`);
  }

  // Clear only this prefix's chunks (never touches the NcertChapter-based ones)
  const deleted = await NcertChunk.deleteMany({ topicId: idRegex });
  if (deleted.deletedCount) console.log(`Cleared ${deleted.deletedCount} old chunks for ${prefix}*`);

  const allChunks = topics.flatMap((t) => chunksFor(t, nameMap));
  if (allChunks.length) await NcertChunk.insertMany(allChunks, { ordered: false });

  console.log(`RAG topic-content index built: ${topics.length} topics → ${allChunks.length} chunks (${prefix}*)`);
  await mongoose.disconnect();
}

build().catch((err) => {
  console.error("buildRagFromTopicContent failed:", err.message);
  process.exit(1);
});
