/**
 * auditUserChunks.mjs — integrity audit for chat-with-own-uploads (U7).
 *
 * Enumerates EVERY UserSource and asserts:
 *   - chunkCount matches the actual UserChunk count for that source
 *   - no orphan chunks (chunks whose source is gone)
 *   - no source exceeds the per-source chunk cap
 *   - the UserChunk text index exists (retrieval depends on it)
 *   - a live retrieval round-trip works for a synthetic user (insert -> $text find -> clean up)
 *
 * Exit non-zero on any violation. Usage: npm run audit:uploads
 */
import "dotenv/config";
import mongoose from "mongoose";
import { UserSource, UserChunk } from "../models/userChunkModels.js";
import { LIMITS } from "../services/uploadService.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await UserChunk.init();

  const sources = await UserSource.find({}).lean();
  const chunkAgg = await UserChunk.aggregate([{ $group: { _id: "$sourceId", n: { $sum: 1 } } }]);
  const bySource = new Map(chunkAgg.map((c) => [String(c._id), c.n]));
  const sourceIds = new Set(sources.map((s) => String(s._id)));

  let mismatches = 0, overCap = 0;
  for (const s of sources) {
    const actual = bySource.get(String(s._id)) || 0;
    if (actual !== s.chunkCount) { mismatches++; console.log(`  ✗ ${s._id} (${s.name}): chunkCount=${s.chunkCount} actual=${actual}`); }
    if (actual > LIMITS.maxChunksPerSource) overCap++;
  }
  const orphans = chunkAgg.filter((c) => !sourceIds.has(String(c._id))).reduce((a, c) => a + c.n, 0);

  const indexes = await UserChunk.collection.indexes();
  const hasTextIndex = indexes.some((i) => Object.values(i.key || {}).includes("text"));

  // Live retrieval round-trip with a synthetic user (cleaned up after)
  const probeUser = new mongoose.Types.ObjectId();
  const probeSource = new mongoose.Types.ObjectId();
  await UserChunk.create({ userId: probeUser, sourceId: probeSource, sourceName: "audit-probe", chunkIndex: 0, text: "auditprobe quadratic discriminant retrieval check" });
  const hits = await UserChunk.find({ $text: { $search: "auditprobe discriminant" }, userId: probeUser }).lean();
  const crossUser = await UserChunk.find({ $text: { $search: "auditprobe discriminant" }, userId: new mongoose.Types.ObjectId() }).lean();
  await UserChunk.deleteMany({ sourceId: probeSource });

  console.log(`\n=== USER UPLOADS AUDIT ===`);
  console.log(`sources: ${sources.length} | chunks: ${chunkAgg.reduce((a, c) => a + c.n, 0)}`);
  console.log(`chunkCount mismatches: ${mismatches} | orphan chunks: ${orphans} | over-cap sources: ${overCap}`);
  console.log(`text index present: ${hasTextIndex} | retrieval round-trip: ${hits.length === 1} | user isolation: ${crossUser.length === 0}`);

  const fail = mismatches || orphans || overCap || !hasTextIndex || hits.length !== 1 || crossUser.length !== 0;
  console.log(fail ? `\n✗ FAIL` : `\n✓ PASS — uploads store consistent, retrieval + isolation verified.`);
  await mongoose.disconnect();
  process.exit(fail ? 1 : 0);
}
run().catch((e) => { console.error(e.message); process.exit(1); });
