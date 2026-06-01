// ============================================================
// BUILD RAG FROM PRO TRACK — index ProTopic teaching content
// into NcertChunk for AI tutor retrieval.
//
// Reads ProTopic documents from MongoDB and chunks their teaching
// blocks into NcertChunk with subject="Java" so the AI tutor can
// surface relevant Java content when a learner asks for help.
//
// Chunks produced per topic (up to ~6):
//   overview  — hook.real_world_problem + what_you_will_build
//   concept   — teaching.concept_explanation (intro, why_it_matters, analogy)
//   concept   — each syntax_breakdown annotation
//   concept   — industry applications
//   concept   — interview relevance
//   concept   — each common gap / misconception
//
// Safe to re-run: deletes chunks with subject="Java" + topicId=/^java_m/
// before reinserting, never touches school content chunks.
//
// Usage:
//   node backend/scripts/buildRagFromProTrack.js
//   node backend/scripts/buildRagFromProTrack.js --track=pro_java
// ============================================================

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const { NcertChunk } = await import("../models/index.js");
const { ProTopic }   = await import("../models/proModels.js");

const args = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("="))
);
const trackKey = args.track || "pro_java";
const SUBJECT  = "Java";

// Safely coerce a value to a trimmed string (caps at maxLen chars).
function str(v, maxLen = 800) {
  if (!v) return "";
  if (typeof v === "string") return v.trim().slice(0, maxLen);
  if (Array.isArray(v)) return v.map(x => str(x, 200)).filter(Boolean).join(". ").slice(0, maxLen);
  if (typeof v === "object") {
    // Try common text fields before falling back to JSON
    const text = v.text || v.description || v.content || v.explanation || v.summary;
    if (text) return str(text, maxLen);
    return JSON.stringify(v).slice(0, maxLen);
  }
  return String(v).trim().slice(0, maxLen);
}

function chunksFor(topic) {
  const out  = [];
  const base = {
    subject:       SUBJECT,
    grade:         "pro",
    chapterNumber: topic.topicNumber || 0,
    chapterTitle:  topic.name,
    conceptName:   topic.name,
    topicId:       topic.topicId,
    source:        `Pro Java — ${topic.moduleId} — ${topic.name}`,
  };

  // 1. Overview — hook block
  const hook     = topic.hook || {};
  const hookText = [str(hook.real_world_problem), str(hook.what_you_will_build)]
    .filter(Boolean).join(" ");
  if (hookText.length > 15) {
    out.push({ ...base, chunkType: "overview",
      text: `${topic.name}: ${hookText}` });
  }

  // 2. Concept explanation
  const teaching = topic.teaching || {};
  const ce       = teaching.concept_explanation || {};
  const ceText   = [str(ce.intro), str(ce.why_it_matters), str(ce.analogy)]
    .filter(Boolean).join(" ");
  if (ceText.length > 15) {
    out.push({ ...base, chunkType: "concept",
      text: `Concept (${topic.name}): ${ceText.slice(0, 1000)}` });
  }

  // 3. Syntax breakdown annotations (one chunk per annotation)
  const annotations = teaching.syntax_breakdown?.annotations || [];
  for (const ann of annotations) {
    const t = `${str(ann.code_part, 100)}: ${str(ann.explanation, 400)}`;
    if (t.length > 15) {
      out.push({ ...base, chunkType: "concept",
        text: `Syntax (${topic.name}): ${t}` });
    }
  }

  // 4. Industry applications
  const apps    = topic.industryApplications || {};
  const appText = Array.isArray(apps)
    ? apps.map(a => str(a, 200)).filter(Boolean).join(". ")
    : str(apps.real_world_context || apps.examples || apps);
  if (appText.length > 15) {
    out.push({ ...base, chunkType: "concept",
      text: `Industry (${topic.name}): ${appText.slice(0, 800)}` });
  }

  // 5. Interview relevance
  const ir = typeof topic.interviewRelevance === "string"
    ? topic.interviewRelevance.trim()
    : str(topic.interviewRelevance);
  if (ir.length > 15) {
    out.push({ ...base, chunkType: "concept",
      text: `Interview (${topic.name}): ${ir.slice(0, 600)}` });
  }

  // 6. Common gaps / misconceptions
  const gaps     = topic.commonGaps || {};
  const gapItems = Array.isArray(gaps)
    ? gaps
    : (gaps.gaps || gaps.common_mistakes || gaps.mistakes || []);
  for (const g of gapItems) {
    const gText = str(g.mistake || g.description || g.text || g, 400);
    if (gText.length > 15) {
      out.push({ ...base, chunkType: "concept",
        text: `Common gap (${topic.name}): ${gText}` });
    }
  }

  return out;
}

async function build() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const topics = await ProTopic.find({ trackKey }).lean();
  if (!topics.length) {
    console.log(`No ProTopic docs for trackKey=${trackKey}. Run npm run seed:pro-java-pilot first.`);
    await mongoose.disconnect();
    return;
  }

  // Clear only Java pro chunks — never touches school content
  const deleted = await NcertChunk.deleteMany({
    subject: SUBJECT,
    topicId: /^java_m/,
  });
  if (deleted.deletedCount) {
    console.log(`Cleared ${deleted.deletedCount} existing Java RAG chunks`);
  }

  const allChunks = topics.flatMap(chunksFor);
  if (allChunks.length) {
    await NcertChunk.insertMany(allChunks, { ordered: false });
  }

  // Per-chunk-type summary
  const byType = {};
  for (const c of allChunks) byType[c.chunkType] = (byType[c.chunkType] || 0) + 1;
  console.log(`\nRAG index built: ${topics.length} topics → ${allChunks.length} chunks (${trackKey})`);
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type.padEnd(10)} ${count}`);
  }

  await mongoose.disconnect();
}

build().catch(err => {
  console.error("buildRagFromProTrack failed:", err.message);
  process.exit(1);
});
