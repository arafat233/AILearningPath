/**
 * finalizeCbseMath10Rekey.mjs — close out the CBSE Class 10 re-key.
 *
 * migrateCbseMath10TopicIds.mjs re-keyed the 54 canonical topics in the DB.
 * Two loose ends remain — this script fixes both:
 *
 *  1. DB — merge the 2 pre-existing STRAY legacy topics (no teaching content,
 *     each a duplicate of a canonical topic) into their canonical equivalent:
 *       ch5_s1_c2_t1*  → cbse_math10_ch5_nth_term
 *       ch6_s4_c1_t1*  → cbse_math10_ch6_pythagoras_theorem
 *     Their Questions + NcertChunks are re-pointed (the _pN suffix is dropped —
 *     they become plain extra questions of the canonical topic); the orphan
 *     Topic DAG nodes are deleted (the canonical node already exists).
 *
 *  2. SOURCE — re-key every legacy ch{N}_s{S}_c{C}_t{T} id still hard-coded in
 *     runtime services, seed scripts, tests and schema comments, so re-running
 *     a seed (or shipping the service) no longer reintroduces stale ids.
 *     questionId strings (q_ch...) are deliberately NOT touched — the migration
 *     kept questionIds stable, so seeds stay idempotent (upsert by questionId).
 *
 * Idempotent: a second run finds 0 strays and 0 legacy ids.
 *
 * Usage:
 *   node config/finalizeCbseMath10Rekey.mjs --dry
 *   node config/finalizeCbseMath10Rekey.mjs
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { Question, Topic, NcertChunk } from "../models/index.js";
import { MAP, STRAY_MERGE } from "./cbseMath10IdMap.mjs";

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const backendDir  = path.join(__dirname, "..");
const dry         = process.argv.includes("--dry");

// Combined lookup for the source codemod: 54 canonical + 2 stray merges.
const FULL = { ...MAP, ...STRAY_MERGE };

// Files that still hard-code legacy ch* ids. NOT included: migrateCbseMath10-
// TopicIds.mjs / cbseMath10IdMap.mjs (the map itself) and seedTopicDAG.js
// (its ids live in an out-of-repo JSON; it already carries a staleness warning).
const SOURCE_FILES = [
  "services/questionTemplateService.js",
  "services/adaptiveRecommenderService.js",
  "services/schoolVariantService.js",
  "config/seedCbseMath10ZeroQGaps.js",
  "config/patchCbseMath10Gaps.js",
  "config/seedMathMissingTopics.js",
  "models/index.js",
  "models/ncertTopicContentModel.js",
  "__tests__/retentionService.test.js",
  "__tests__/eventTracker.test.js",
];

// Matches a legacy id ONLY when not preceded by a word char — so the ch-id
// embedded inside a questionId (q_ch1_s1_c1_t1_...) is left untouched, while
// a fresh token (topicId: "ch1...", "ch1..._misc_1", prerequisites, comments)
// is re-keyed. A trailing suffix like _misc_1 / _p1 is preserved automatically.
const ID_RE = /(?<![\w])ch\d+_s\d+_c\d+_t\d+/g;
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function mergeStrays() {
  for (const [coll, Model] of [["Question", Question], ["NcertChunk", NcertChunk]]) {
    let n = 0;
    for (const [stray, canonical] of Object.entries(STRAY_MERGE)) {
      const re = new RegExp("^" + escapeRe(stray) + "(_p\\d+)?$");
      if (dry) {
        n += await Model.countDocuments({ topicId: re });
      } else {
        const r = await Model.updateMany({ topicId: re }, { $set: { topicId: canonical } });
        n += r.modifiedCount;
      }
    }
    console.log(`  ${dry ? "[dry] " : "✓ "}${coll}: ${n} stray doc(s) ${dry ? "would merge" : "merged"} into canonical topics`);
  }
  for (const [stray, canonical] of Object.entries(STRAY_MERGE)) {
    const strayNode = await Topic.findOne({ topicId: stray });
    if (!strayNode) continue;
    const canonicalExists = (await Topic.countDocuments({ topicId: canonical })) > 0;
    if (dry) {
      console.log(`  [dry] Topic ${stray}: would ${canonicalExists ? "DELETE (canonical node exists)" : `re-key → ${canonical}`}`);
    } else if (canonicalExists) {
      await Topic.deleteOne({ _id: strayNode._id });
      console.log(`  ✓ Topic ${stray}: deleted (canonical ${canonical} already a DAG node)`);
    } else {
      await Topic.updateOne({ _id: strayNode._id }, { $set: { topicId: canonical } });
      console.log(`  ✓ Topic ${stray}: re-keyed → ${canonical}`);
    }
  }
}

function codemodFiles() {
  for (const rel of SOURCE_FILES) {
    const abs = path.join(backendDir, rel);
    let text;
    try { text = readFileSync(abs, "utf8"); }
    catch { console.log(`  – ${rel}: not found, skipped`); continue; }

    const unmapped = new Set();
    let count = 0;
    const out = text.replace(ID_RE, (m) => {
      if (FULL[m]) { count++; return FULL[m]; }
      unmapped.add(m);
      return m;
    });
    if (unmapped.size) console.log(`  ⚠ ${rel}: ${unmapped.size} UNMAPPED id(s) left as-is: ${[...unmapped].join(", ")}`);
    if (count === 0) { console.log(`  – ${rel}: no legacy ids`); continue; }
    if (dry) {
      console.log(`  [dry] ${rel}: ${count} legacy id reference(s) would be re-keyed`);
    } else {
      writeFileSync(abs, out);
      console.log(`  ✓ ${rel}: ${count} legacy id reference(s) re-keyed`);
    }
  }
}

async function run() {
  console.log(`finalizeCbseMath10Rekey — ${dry ? "DRY RUN (no writes)" : "LIVE"}\n`);
  await mongoose.connect(process.env.MONGO_URI);

  console.log("1. DB — merge stray topics into their canonical equivalents:");
  await mergeStrays();

  console.log("\n2. SOURCE — re-key legacy ch* ids hard-coded in services / seeds / tests:");
  codemodFiles();

  await mongoose.disconnect();
  console.log(`\n${dry ? "[dry] no changes written." : "✓ Done — CBSE 10 re-key fully finalized."}`);
}

run().catch((err) => { console.error(err); process.exit(1); });
