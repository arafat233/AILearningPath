/**
 * auditCommunity.mjs — conformance + integrity audit for the Community engine
 * (GAP #8). Posts are user-generated, so this is a SCHEMA-conformance scan over
 * EVERY CommunityPost: malformed count must be 0. (No fixed denominator — like
 * auditNotes.mjs.) Output is the source of truth (CLAUDE.md §5).
 *
 * Per-doc invariants:
 *   - userId + authorName present
 *   - kind ∈ {article, question}; status ∈ {published, removed}
 *   - non-empty title AND body
 *   - tags is an array; every comment has userId + non-empty body
 *   - denormalized counts in sync: upvoteCount == upvoters.length,
 *     commentCount == comments.length
 *   - reports well-formed (each has a userId)
 *
 * Usage: node config/auditCommunity.mjs            (local)
 *   prod: docker exec ailearningpath-api-1 node config/auditCommunity.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";

const KINDS = new Set(["article", "question"]);
const STATUS = new Set(["published", "removed"]);

function problems(d) {
  const p = [];
  if (!d.userId) p.push("no userId");
  if (!d.authorName) p.push("no authorName");
  if (!KINDS.has(d.kind)) p.push(`bad kind=${d.kind}`);
  if (!STATUS.has(d.status)) p.push(`bad status=${d.status}`);
  if (!(d.title || "").trim()) p.push("empty title");
  if (!(d.body || "").trim()) p.push("empty body");
  if (!Array.isArray(d.tags)) p.push("tags not array");
  if (!Array.isArray(d.upvoters)) p.push("upvoters not array");
  else if ((d.upvoteCount ?? 0) !== d.upvoters.length) p.push(`upvoteCount ${d.upvoteCount} != ${d.upvoters.length}`);
  if (!Array.isArray(d.comments)) p.push("comments not array");
  else {
    if ((d.commentCount ?? 0) !== d.comments.length) p.push(`commentCount ${d.commentCount} != ${d.comments.length}`);
    d.comments.forEach((c, i) => {
      if (!c?.userId) p.push(`comment ${i} no userId`);
      if (!(c?.body || "").trim()) p.push(`comment ${i} empty body`);
    });
  }
  if (d.reports != null) {
    if (!Array.isArray(d.reports)) p.push("reports not array");
    else d.reports.forEach((r, i) => { if (!r?.userId) p.push(`report ${i} no userId`); });
  }
  return p;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const C = mongoose.connection.collection("communityposts");
  const docs = await C.find({}).toArray();

  console.log(`\n=== COMMUNITY AUDIT (communityposts) ===`);
  console.log(`total posts = ${docs.length}`);

  const byKind = {}, byStatus = {};
  let malformed = 0, comments = 0, reported = 0;
  const fails = [];
  for (const d of docs) {
    byKind[d.kind] = (byKind[d.kind] || 0) + 1;
    byStatus[d.status] = (byStatus[d.status] || 0) + 1;
    comments += (d.comments || []).length;
    if ((d.reports || []).length) reported++;
    const probs = problems(d);
    if (probs.length) { malformed++; fails.push(`${d._id}: ${probs.join("; ")}`); }
  }

  console.log(`by kind:`);   Object.keys(byKind).sort().forEach((k) => console.log(`  ${k.padEnd(10)} ${byKind[k]}`));
  console.log(`by status:`); Object.keys(byStatus).sort().forEach((k) => console.log(`  ${k.padEnd(10)} ${byStatus[k]}`));
  console.log(`comments total = ${comments}`);
  console.log(`posts with reports = ${reported}`);
  console.log(`\nintegrity: malformed = ${malformed}${malformed ? "" : " ✓"}`);
  if (malformed) { fails.slice(0, 30).forEach((f) => console.log(`  ✗ ${f}`)); }
  else console.log(`✓ PASS — ${docs.length} posts, all well-formed.`);

  await mongoose.disconnect();
  process.exit(malformed ? 1 : 0);
}
run().catch((err) => { console.error(err.message); process.exit(1); });
