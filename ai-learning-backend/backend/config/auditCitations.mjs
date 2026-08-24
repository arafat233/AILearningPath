/**
 * Citations Audit — provenance completeness of the RAG store.
 *
 * The citation footer on AI explanations is built from NcertChunk provenance
 * fields (source / chapterNumber / chapterTitle / conceptName). This audit
 * enumerates EVERY chunk and reports, per subject:
 *   - labeled/total: chunks that can produce a citation label
 *     (has `source`, or `chapterTitle`/`conceptName`)
 *   - chapterNumber coverage (nice-to-have, used for "Ch.N" labels)
 * Integrity check: 0 unlabeled chunks — an unlabeled chunk grounds answers
 * silently with no citation, which defeats the trust feature.
 * Read-only and idempotent.
 *
 * Usage:  node config/auditCitations.mjs [--detail]
 * Exit code: 0 clean · 1 unlabeled chunks exist.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChunk } from "../models/index.js";

const showDetail = process.argv.includes("--detail");

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not set — create backend/.env or run inside the API container (see docs/AUDITS.md).");
  process.exit(2);
}
await mongoose.connect(process.env.MONGO_URI);

const chunks = await NcertChunk.find({}, { subject: 1, chapterNumber: 1, chapterTitle: 1, conceptName: 1, source: 1 }).lean();

const bySubject = {}; // subject -> { total, labeled, hasChapterNum }
const unlabeled = [];

for (const c of chunks) {
  const s = c.subject || "(none)";
  bySubject[s] ??= { total: 0, labeled: 0, hasChapterNum: 0 };
  bySubject[s].total++;
  const canLabel = !!(c.source || c.chapterTitle || c.conceptName);
  if (canLabel) bySubject[s].labeled++;
  else unlabeled.push(c._id.toString());
  if (c.chapterNumber != null) bySubject[s].hasChapterNum++;
}

const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "n/a");
console.log(`\n═══ CITATIONS AUDIT ═══ (${chunks.length} NcertChunk docs)\n`);
for (const [s, v] of Object.entries(bySubject)) {
  console.log(`  ${s.padEnd(16)} labeled ${v.labeled}/${v.total} (${pct(v.labeled, v.total)}) · chapterNumber ${v.hasChapterNum}/${v.total} (${pct(v.hasChapterNum, v.total)})`);
}
console.log(`\nIntegrity: ${unlabeled.length} unlabeled chunks (cannot produce a citation)`);
if (showDetail) unlabeled.forEach((id) => console.log(`  ✗ ${id}`));

await mongoose.disconnect();
process.exit(unlabeled.length ? 1 : 0);
