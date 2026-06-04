/**
 * auditNotes.mjs — conformance + integrity audit for GAP #3 (Notes / Highlights
 * / Notebook). Notes are user-generated, so this is a SCHEMA-conformance scan:
 * it enumerates EVERY note document and asserts the model invariants hold, with
 * a malformed count that must be 0. (Coverage % is N/A — there is no fixed
 * denominator of "things to note".)
 *
 * Invariants checked per document:
 *   - required: userId, refId
 *   - scope ∈ {pro, k12}; kind ∈ {exercise,topic,lesson,question,project}; type ∈ {note,highlight}
 *   - type=note      → non-empty body
 *   - type=highlight → non-empty quote
 *   - tags is an array; pinned is a boolean
 *
 * Usage: node config/auditNotes.mjs            (local)
 *   prod: docker exec ailearningpath-api-1 node config/auditNotes.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const SCOPES = new Set(["pro", "k12"]);
const KINDS = new Set(["exercise", "topic", "lesson", "question", "project"]);
const TYPES = new Set(["note", "highlight"]);

function problems(d) {
  const p = [];
  if (!d.userId) p.push("no userId");
  if (!d.refId) p.push("no refId");
  if (!SCOPES.has(d.scope)) p.push(`bad scope=${d.scope}`);
  if (!KINDS.has(d.kind)) p.push(`bad kind=${d.kind}`);
  if (!TYPES.has(d.type)) p.push(`bad type=${d.type}`);
  if (d.type === "note" && !(d.body || "").trim()) p.push("note with empty body");
  if (d.type === "highlight" && !(d.quote || "").trim()) p.push("highlight with empty quote");
  if (d.tags != null && !Array.isArray(d.tags)) p.push("tags not an array");
  if (d.pinned != null && typeof d.pinned !== "boolean") p.push("pinned not boolean");
  return p;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const C = mongoose.connection.collection("notes");
  const docs = await C.find({}).toArray();

  const byType = {}, byScope = {}, byKind = {};
  const malformed = [];
  for (const d of docs) {
    byType[d.type] = (byType[d.type] || 0) + 1;
    byScope[d.scope] = (byScope[d.scope] || 0) + 1;
    byKind[d.kind] = (byKind[d.kind] || 0) + 1;
    const p = problems(d);
    if (p.length) malformed.push({ id: String(d._id), p });
  }

  const fmt = (o) => Object.keys(o).sort().map((k) => `${k}=${o[k]}`).join(" ") || "(none)";
  console.log(`\n=== NOTES / NOTEBOOK CONFORMANCE AUDIT ===`);
  console.log(`total notes = ${docs.length}`);
  console.log(`by type:  ${fmt(byType)}`);
  console.log(`by scope: ${fmt(byScope)}`);
  console.log(`by kind:  ${fmt(byKind)}`);
  console.log(`integrity: malformed documents = ${malformed.length}${malformed.length ? "" : " ✓"}`);
  if (malformed.length) {
    malformed.slice(0, 20).forEach((m) => console.log(`  ✗ ${m.id}: ${m.p.join("; ")}`));
    process.exitCode = 1;
  }
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
