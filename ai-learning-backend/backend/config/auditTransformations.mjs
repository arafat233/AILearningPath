/**
 * Transformations Audit — coverage + integrity of the cross-user transformation cache.
 *
 * Enumerates EVERY NcertTopicContent topic × every transformation kind and reports:
 *   - cached/total per subject and per kind (coverage of the shared cache)
 *   - 0 malformed payloads (every cached entry parses and matches its kind's shape)
 * Read-only — re-running never changes state (idempotent by construction).
 *
 * Usage:
 *   node config/auditTransformations.mjs             # full report
 *   node config/auditTransformations.mjs --missing   # list uncached topic×kind pairs
 *
 * Exit code: 0 clean · 1 malformed entries found (coverage gaps alone don't fail —
 * the cache fills lazily as students click; malformed cached JSON is a real defect).
 */

import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import { AIResponseCache } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const KINDS = ["flashcards", "examqs", "eli5", "revision", "podcast"];
const GRADE = "10";

// Must mirror the subject string the frontend sends (TransformChips.jsx)
// and therefore the cache key in aiService.generateTransformation.
// ponytail: topicId-prefix mapping duplicated from NcertTopicView — if a new
// subject prefix is added there, add it here too.
const subjectForTopic = (topicId) =>
  topicId.startsWith("sci_") ? "Science"
  : topicId.startsWith("eng_") ? "English"
  : topicId.startsWith("hin_") ? "Hindi"
  : "Math";

const cacheKey = (topic, kind, subject, grade) =>
  `transform::${crypto.createHash("md5").update(`${topic.toLowerCase().trim()}::${kind}::${subject}::${grade}`).digest("hex")}`;

// Per-kind shape validators — a cached entry failing these is malformed.
const VALID = {
  flashcards: (d) => Array.isArray(d.cards) && d.cards.length > 0 && d.cards.every((c) => c.front && c.back),
  examqs:     (d) => Array.isArray(d.questions) && d.questions.length > 0 && d.questions.every((q) => q.question && q.answer),
  eli5:       (d) => typeof d.explanation === "string" && d.explanation.length > 0,
  revision:   (d) => Array.isArray(d.sections) && d.sections.length > 0 && d.sections.every((s) => s.heading && Array.isArray(s.points) && s.points.length > 0),
  podcast:    (d) => Array.isArray(d.lines) && d.lines.length >= 2
                  && d.lines.every((l) => l.line && (l.speaker === "teacher" || l.speaker === "student"))
                  && new Set(d.lines.map((l) => l.speaker)).size >= 2,
};

const showMissing = process.argv.includes("--missing");

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not set — create backend/.env or run inside the API container (see docs/AUDITS.md).");
  process.exit(2);
}
await mongoose.connect(process.env.MONGO_URI);

const topics = await NcertTopicContent.find({}, { topicId: 1, name: 1 }).lean();
const bySubject = {}; // subject -> { total, cached }
const byKind = Object.fromEntries(KINDS.map((k) => [k, { total: 0, cached: 0 }]));
const malformed = [];
const missing = [];
// Topics with no name can never be transformed (the cache key and the prompt
// both need it) — enumerate them instead of silently skipping.
const unnamed = topics.filter((t) => !t.name?.trim()).map((t) => t.topicId || t._id.toString());

for (const t of topics.filter((t) => t.name?.trim())) {
  const subject = subjectForTopic(t.topicId);
  bySubject[subject] ??= { total: 0, cached: 0 };
  for (const kind of KINDS) {
    bySubject[subject].total++;
    byKind[kind].total++;
    const hit = await AIResponseCache.findOne({ cacheKey: cacheKey(t.name, kind, subject, GRADE) }, { response: 1 }).lean();
    if (!hit) { missing.push(`${t.topicId} × ${kind}`); continue; }
    bySubject[subject].cached++;
    byKind[kind].cached++;
    try {
      const parsed = JSON.parse(hit.response);
      if (!VALID[kind](parsed)) malformed.push(`${t.topicId} × ${kind}: shape invalid`);
    } catch {
      malformed.push(`${t.topicId} × ${kind}: unparseable JSON`);
    }
  }
}

const pct = (c, t) => (t ? `${Math.round((c / t) * 100)}%` : "n/a");
console.log(`\n═══ TRANSFORMATIONS AUDIT ═══ (${topics.length} topics × ${KINDS.length} kinds = ${topics.length * KINDS.length} units)\n`);
console.log("By subject:");
for (const [s, v] of Object.entries(bySubject)) console.log(`  ${s.padEnd(10)} ${v.cached}/${v.total} cached (${pct(v.cached, v.total)})`);
console.log("By kind:");
for (const [k, v] of Object.entries(byKind)) console.log(`  ${k.padEnd(10)} ${v.cached}/${v.total} cached (${pct(v.cached, v.total)})`);
console.log(`\nIntegrity: ${malformed.length} malformed cached entries · ${unnamed.length} topics with no name (untransformable)`);
malformed.forEach((m) => console.log(`  ✗ ${m}`));
unnamed.forEach((id) => console.log(`  ✗ unnamed topic: ${id}`));
if (showMissing) { console.log(`\nMissing (${missing.length}):`); missing.forEach((m) => console.log(`  - ${m}`)); }

await mongoose.disconnect();
process.exit(malformed.length || unnamed.length ? 1 : 0);
