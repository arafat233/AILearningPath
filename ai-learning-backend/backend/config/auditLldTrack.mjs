/**
 * auditLldTrack.mjs — conformance + integrity audit for the LLD track
 * (COMPETITIVE_GAP_ANALYSIS.md GAP #4). Recomputes done/total from the DB and
 * fails (exit 1) on any malformed unit, orphan, duplicate, or totals mismatch.
 * The audit's output — not a hand tally — is the source of truth (CLAUDE.md §5).
 *
 * Enumerates EVERY topic and exercise of track `pro_lld` and asserts:
 *   Track   : exactly 1, status=live, slug=lld.
 *   Module  : ≥1, status=live, belongs to the track.
 *   Topics  : name+slug; hook; interviewRelevance; commonGaps.gaps non-empty;
 *             teaching.blocks non-empty, each block has kind∈{concept,code}+heading+body.
 *   Exercises (per type):
 *     all          → title, scenario, level∈{warmup,easy,medium,hard}, position>0, xpReward>0
 *     pattern_match→ blanks[0].options (≥2), expectedSolution ∈ options,
 *                    testCases[0].correct === expectedSolution
 *     predict_output→ expectedSolution non-empty, a testCase carries the same expected
 *     fill_blank   → expectedSolution non-empty, ≥1 blank each with placeholder+answer
 *     code_scratch → starterCode + expectedSolution + a testCase with non-empty expected_stdout
 *   Integrity: every exercise.topicId exists; no duplicate ids; track totals match counts.
 *
 * Idempotency: the seed upserts by unique id, so re-running changes nothing.
 * Verify out-of-band by running `npm run seed:lld` twice — the 2nd run reports
 * "0 inserted". This audit asserts the resulting steady state.
 *
 * Usage: node config/auditLldTrack.mjs            (local)
 *   prod: docker exec ailearningpath-api-1 node config/auditLldTrack.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProTrack, ProModule, ProTopic, ProExercise } from "../models/proModels.js";

const TRACK_KEY = "pro_lld";
const LEVELS = new Set(["warmup", "easy", "medium", "hard"]);
const BLOCK_KINDS = new Set(["concept", "code"]);

function topicProblems(t) {
  const p = [];
  if (!t.name?.trim()) p.push("no name");
  if (!t.slug?.trim()) p.push("no slug");
  if (!t.hook || (!t.hook.question && !t.hook.insight)) p.push("empty hook");
  if (!(t.interviewRelevance || "").trim()) p.push("no interviewRelevance");
  if (!Array.isArray(t.commonGaps?.gaps) || t.commonGaps.gaps.length === 0) p.push("no commonGaps.gaps");
  const blocks = t.teaching?.blocks;
  if (!Array.isArray(blocks) || blocks.length === 0) {
    p.push("no teaching blocks");
  } else {
    blocks.forEach((b, i) => {
      if (!BLOCK_KINDS.has(b?.kind)) p.push(`block ${i} bad kind=${b?.kind}`);
      if (!b?.heading?.trim()) p.push(`block ${i} no heading`);
      if (!b?.body?.trim()) p.push(`block ${i} no body`);
    });
  }
  return p;
}

function exerciseProblems(e) {
  const p = [];
  if (!e.title?.trim()) p.push("no title");
  if (!e.scenario?.trim()) p.push("no scenario");
  if (!LEVELS.has(e.level)) p.push(`bad level=${e.level}`);
  if (!(e.position > 0)) p.push("position not > 0");
  if (!(e.xpReward > 0)) p.push("xpReward not > 0");

  const tc = Array.isArray(e.testCases) ? e.testCases : [];
  switch (e.type) {
    case "pattern_match": {
      const opts = e.blanks?.[0]?.options;
      if (!Array.isArray(opts) || opts.length < 2) p.push("pm: <2 options");
      else if (!opts.includes(e.expectedSolution)) p.push("pm: expectedSolution not in options");
      if (!tc.some((c) => c.correct === e.expectedSolution)) p.push("pm: testCase.correct != expectedSolution");
      break;
    }
    case "predict_output": {
      if (!(e.expectedSolution || "").trim()) p.push("predict: empty expectedSolution");
      if (!tc.some((c) => (c.expected || "") === e.expectedSolution)) p.push("predict: testCase.expected mismatch");
      break;
    }
    case "fill_blank": {
      if (!(e.expectedSolution || "").trim()) p.push("fill: empty expectedSolution");
      if (!Array.isArray(e.blanks) || e.blanks.length === 0) p.push("fill: no blanks");
      else e.blanks.forEach((b, i) => {
        if (!b?.placeholder?.trim()) p.push(`fill: blank ${i} no placeholder`);
        if (!b?.answer?.trim()) p.push(`fill: blank ${i} no answer`);
      });
      break;
    }
    case "code_scratch": {
      if (!(e.starterCode || "").trim()) p.push("code: no starterCode");
      if (!(e.expectedSolution || "").trim()) p.push("code: no expectedSolution");
      if (!tc.some((c) => (c.expected_stdout || "").length > 0)) p.push("code: no testCase expected_stdout");
      break;
    }
    default:
      p.push(`unknown type=${e.type}`);
  }
  return p;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const [track, modules, topics, exercises] = await Promise.all([
    ProTrack.findOne({ key: TRACK_KEY }).lean(),
    ProModule.find({ trackKey: TRACK_KEY }).lean(),
    ProTopic.find({ trackKey: TRACK_KEY }).sort({ topicNumber: 1 }).lean(),
    ProExercise.find({ trackKey: TRACK_KEY }).sort({ topicId: 1, position: 1 }).lean(),
  ]);

  console.log(`\n=== LLD TRACK AUDIT (${TRACK_KEY}) ===`);

  let fail = false;
  const fails = [];

  // ── Track ──
  if (!track) { console.log("✗ track pro_lld NOT FOUND"); await mongoose.disconnect(); process.exit(1); }
  if (track.status !== "live") fails.push(`track status=${track.status} (expected live)`);
  if (track.slug !== "lld") fails.push(`track slug=${track.slug} (expected lld)`);
  console.log(`track:  ${track.name}  [status=${track.status}, slug=${track.slug}]`);

  // ── Module ──
  const liveModules = modules.filter((m) => m.status === "live");
  if (liveModules.length === 0) fails.push("no live module");
  console.log(`modules: ${modules.length} (${liveModules.length} live)`);

  // ── Topics ──
  const topicIds = new Set();
  const dupTopics = [];
  let malformedTopics = 0;
  for (const t of topics) {
    if (topicIds.has(t.topicId)) dupTopics.push(t.topicId); else topicIds.add(t.topicId);
    const probs = topicProblems(t);
    if (probs.length) { malformedTopics++; fails.push(`topic ${t.topicId}: ${probs.join("; ")}`); }
  }
  console.log(`topics: ${topics.length - malformedTopics}/${topics.length} well-formed`);

  // ── Exercises ──
  const exIds = new Set();
  const dupEx = [];
  const orphans = [];
  let malformedEx = 0;
  const byType = {};
  for (const e of exercises) {
    byType[e.type] = (byType[e.type] || 0) + 1;
    if (exIds.has(e.exerciseId)) dupEx.push(e.exerciseId); else exIds.add(e.exerciseId);
    if (!topicIds.has(e.topicId)) orphans.push(`${e.exerciseId}→${e.topicId}`);
    const probs = exerciseProblems(e);
    if (probs.length) { malformedEx++; fails.push(`ex ${e.exerciseId}: ${probs.join("; ")}`); }
  }
  console.log(`exercises: ${exercises.length - malformedEx}/${exercises.length} well-formed`);
  console.log(`  by type:`);
  Object.keys(byType).sort().forEach((k) => console.log(`    ${k.padEnd(16)} ${byType[k]}`));

  // ── Coverage: every topic has ≥1 exercise ──
  const topicsWithEx = new Set(exercises.map((e) => e.topicId));
  const emptyTopics = [...topicIds].filter((id) => !topicsWithEx.has(id));
  if (emptyTopics.length) fails.push(`topics with 0 exercises: ${emptyTopics.join(",")}`);

  // ── Visual aids: count + validate any authored SVG is well-formed ──
  let withVisualAid = 0, badSvg = 0;
  for (const t of topics) {
    const va = t.teaching?.visual_aid;
    if (!va) continue;
    withVisualAid++;
    if (va.svg) {
      const s = String(va.svg);
      const opens = (s.match(/<[a-zA-Z]/g) || []).length;
      const closes = (s.match(/<\//g) || []).length + (s.match(/\/>/g) || []).length;
      if (!s.startsWith("<svg") || !s.trimEnd().endsWith("</svg>") || closes !== opens) {
        badSvg++; fails.push(`topic ${t.topicId}: malformed visual_aid.svg`);
      }
    }
  }

  // ── Track totals consistency ──
  if (track.totalTopics !== topics.length) fails.push(`track.totalTopics=${track.totalTopics} != ${topics.length}`);
  if (track.totalExercises !== exercises.length) fails.push(`track.totalExercises=${track.totalExercises} != ${exercises.length}`);
  if (track.totalModules !== liveModules.length) fails.push(`track.totalModules=${track.totalModules} != ${liveModules.length}`);

  // ── Integrity summary ──
  console.log(`\nintegrity:`);
  console.log(`  malformed topics    = ${malformedTopics}${malformedTopics ? "" : " ✓"}`);
  console.log(`  malformed exercises = ${malformedEx}${malformedEx ? "" : " ✓"}`);
  console.log(`  duplicate topic ids = ${dupTopics.length}${dupTopics.length ? " → " + dupTopics.join(",") : " ✓"}`);
  console.log(`  duplicate ex ids    = ${dupEx.length}${dupEx.length ? " → " + dupEx.join(",") : " ✓"}`);
  console.log(`  orphan exercises    = ${orphans.length}${orphans.length ? " → " + orphans.join(",") : " ✓"}`);
  console.log(`  topics w/o exercise = ${emptyTopics.length}${emptyTopics.length ? " → " + emptyTopics.join(",") : " ✓"}`);
  console.log(`  topics w/ visual_aid= ${withVisualAid} (malformed svg = ${badSvg}${badSvg ? "" : " ✓"})`);
  console.log(`  track totals match  = ${track.totalTopics === topics.length && track.totalExercises === exercises.length ? "✓" : "✗"}`);
  console.log(`  total XP            = ${track.totalXp}`);

  fail = fails.length > 0 || dupTopics.length > 0 || dupEx.length > 0 || orphans.length > 0;

  if (fail) {
    console.log(`\n✗ FAIL (${fails.length} issue${fails.length === 1 ? "" : "s"}):`);
    fails.slice(0, 40).forEach((f) => console.log(`   - ${f}`));
  } else {
    console.log(`\n✓ PASS — ${topics.length} topics, ${exercises.length} exercises, all well-formed.`);
  }

  await mongoose.disconnect();
  process.exit(fail ? 1 : 0);
}

run().catch((err) => { console.error(err.message); process.exit(1); });
