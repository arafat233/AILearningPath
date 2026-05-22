/**
 * migrateCbseMath10TopicIds.mjs — CBSE Class 10 Mathematics re-key
 *
 * Renames all 54 CBSE Class 10 Math topicIds from the legacy
 *   ch{N}_s{S}_c{C}_t{T}
 * form to the standardized board-prefixed convention (SPEC_MATH_STANDARDIZATION §2)
 *   cbse_math10_ch{N}_{descriptor}
 *
 * This is a PURE RE-KEY — no teaching content or questions are rewritten,
 * only the topicId string (and the topicId references that depend on it).
 *
 * Collections touched:
 *   - NcertTopicContent  topicId
 *   - Question           topicId  (the 54 canonical ids AND their `_pN`
 *                                  practice-variant ids) + prerequisites[]
 *   - NcertChunk         topicId
 *   - Topic              topicId  + prerequisites[]  (the prerequisite DAG)
 *
 * NOT touched (flagged for the operator, out of spec scope):
 *   - User-history collections (Attempt, SeenQuestion, UserTopicMastery,
 *     StudyPlan, …) may still reference legacy ch* topicIds.
 *   - Two stray legacy question topics — `ch5_s1_c2_t1` and `ch6_s4_c1_t1`
 *     (16 questions each) — have NO NcertTopicContent and duplicate existing
 *     canonical topics. They are pre-existing cruft, NOT re-keyed here; the
 *     leftover report lists them so the operator can delete/merge them.
 *
 * Idempotent: re-running after a successful migration finds 0 legacy ids
 * and exits cleanly.
 *
 * Usage:
 *   node config/migrateCbseMath10TopicIds.mjs --dry   (report only, no writes)
 *   node config/migrateCbseMath10TopicIds.mjs         (perform the migration)
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
import { Question, Topic, NcertChunk } from "../models/index.js";

// ── OLD → NEW map (all 54 CBSE Class 10 Math sub-topics) ─────────────────────
const MAP = {
  // Ch1 — Real Numbers
  "ch1_s1_c1_t1":  "cbse_math10_ch1_euclid_division_lemma",
  "ch1_s2_c1_t1":  "cbse_math10_ch1_prime_factorisation",
  "ch1_s2_c1_t2":  "cbse_math10_ch1_lcm_and_hcf",
  "ch1_s3_c1_t1":  "cbse_math10_ch1_proving_irrationality",
  "ch1_s4_c1_t1":  "cbse_math10_ch1_decimal_expansions",
  // Ch2 — Polynomials
  "ch2_s1_c1_t1":  "cbse_math10_ch2_degree_and_types",
  "ch2_s2_c1_t1":  "cbse_math10_ch2_zeroes_from_graphs",
  "ch2_s3_c1_t1":  "cbse_math10_ch2_zeroes_and_coefficients",
  "ch2_s3_c1_t2":  "cbse_math10_ch2_polynomial_from_zeroes",
  "ch2_s4_c1_t1":  "cbse_math10_ch2_division_algorithm",
  // Ch3 — Pair of Linear Equations in Two Variables
  "ch3_s1_c1_t1":  "cbse_math10_ch3_graphical_method",
  "ch3_s1_c1_t2":  "cbse_math10_ch3_consistency_of_pairs",
  "ch3_s2_c1_t1":  "cbse_math10_ch3_substitution_method",
  "ch3_s3_c1_t1":  "cbse_math10_ch3_elimination_method",
  "ch3_s4_c1_t1":  "cbse_math10_ch3_cross_multiplication",
  // Ch4 — Quadratic Equations
  "ch4_s1_c1_t1":  "cbse_math10_ch4_identifying_quadratics",
  "ch4_s1_c1_t2":  "cbse_math10_ch4_forming_quadratics",
  "ch4_s2_c1_t1":  "cbse_math10_ch4_factorisation_method",
  "ch4_s3_c1_t1":  "cbse_math10_ch4_discriminant_and_roots",
  "ch4_s4_c1_t1":  "cbse_math10_ch4_completing_the_square",
  // Ch5 — Arithmetic Progressions
  "ch5_s1_c1_t1":  "cbse_math10_ch5_identifying_ap",
  "ch5_s2_c1_t1":  "cbse_math10_ch5_nth_term",
  "ch5_s3_c1_t1":  "cbse_math10_ch5_sum_of_ap",
  "ch5_s4_c1_t1":  "cbse_math10_ch5_arithmetic_mean_combined",
  // Ch6 — Triangles
  "ch6_s1_c1_t1":  "cbse_math10_ch6_similar_figures",
  "ch6_s2_c1_t1":  "cbse_math10_ch6_basic_proportionality",
  "ch6_s3_c1_t1":  "cbse_math10_ch6_similarity_criteria",
  "ch6_s5_c1_t1":  "cbse_math10_ch6_areas_of_similar_triangles",
  "ch6_s6_c1_t1":  "cbse_math10_ch6_pythagoras_theorem",
  // Ch7 — Coordinate Geometry
  "ch7_s1_c1_t1":  "cbse_math10_ch7_distance_formula",
  "ch7_s2_c1_t1":  "cbse_math10_ch7_section_formula",
  "ch7_s3_c1_t1":  "cbse_math10_ch7_area_and_collinearity",
  // Ch8 — Introduction to Trigonometry
  "ch8_s1_c1_t1":  "cbse_math10_ch8_trigonometric_ratios",
  "ch8_s2_c1_t1":  "cbse_math10_ch8_ratios_of_special_angles",
  "ch8_s3_c1_t1":  "cbse_math10_ch8_trigonometric_identities",
  "ch8_s4_c1_t1":  "cbse_math10_ch8_complementary_angles",
  // Ch9 — Some Applications of Trigonometry
  "ch9_s1_c1_t1":  "cbse_math10_ch9_single_triangle_heights",
  "ch9_s1_c1_t2":  "cbse_math10_ch9_two_triangle_heights",
  // Ch10 — Circles
  "ch10_s1_c1_t1": "cbse_math10_ch10_tangent_properties",
  "ch10_s2_c1_t1": "cbse_math10_ch10_tangent_lengths",
  // Ch11 — Areas Related to Circles
  "ch11_s1_c1_t1": "cbse_math10_ch11_sectors_and_segments",
  "ch11_s2_c1_t1": "cbse_math10_ch11_combined_plane_figures",
  // Ch12 — Surface Areas and Volumes
  "ch12_s1_c1_t1": "cbse_math10_ch12_surface_area_of_solids",
  "ch12_s2_c1_t1": "cbse_math10_ch12_volume_of_solids",
  "ch12_s3_c1_t1": "cbse_math10_ch12_frustum_of_a_cone",
  // Ch13 — Statistics
  "ch13_s1_c1_t1": "cbse_math10_ch13_mean_of_grouped_data",
  "ch13_s2_c1_t1": "cbse_math10_ch13_mode_of_grouped_data",
  "ch13_s3_c1_t1": "cbse_math10_ch13_median_of_grouped_data",
  "ch13_s4_c1_t1": "cbse_math10_ch13_empirical_relationship",
  "ch13_s5_c1_t1": "cbse_math10_ch13_ogives",
  // Ch14 — Probability
  "ch14_s1_c1_t1": "cbse_math10_ch14_probability_basics",
  "ch14_s1_c1_t2": "cbse_math10_ch14_dice_coins_spinners",
  "ch14_s1_c1_t3": "cbse_math10_ch14_cards_and_balls",
  "ch14_s1_c1_t4": "cbse_math10_ch14_equally_likely_events",
};

const OLD_IDS = Object.keys(MAP);
const dry = process.argv.includes("--dry");
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`migrateCbseMath10TopicIds — ${dry ? "DRY RUN (no writes)" : "LIVE"} — ${OLD_IDS.length} topics in map\n`);

  // Regex matching a `_pN` practice-variant of any of the 54 canonical ids.
  const pnRegexFor = (oldId) => new RegExp("^" + esc(oldId) + "_p\\d+$");

  // ── Pre-migration counts ──────────────────────────────────────────────────
  const ctcN   = await NcertTopicContent.countDocuments({ topicId: { $in: OLD_IDS } });
  const chunkN = await NcertChunk.countDocuments({ topicId: { $in: OLD_IDS } });
  const topicN = await Topic.countDocuments({ topicId: { $in: OLD_IDS } });
  const qExact = await Question.countDocuments({ topicId: { $in: OLD_IDS } });
  let qVariants = 0;
  for (const oldId of OLD_IDS) qVariants += await Question.countDocuments({ topicId: pnRegexFor(oldId) });
  const qAllCh = await Question.countDocuments({ topicId: /^ch\d+_/ });
  const qStray = qAllCh - qExact - qVariants;
  const topicPrereqN = await Topic.countDocuments({ prerequisites: { $in: OLD_IDS } });
  const qPrereqN     = await Question.countDocuments({ prerequisites: { $in: OLD_IDS } });

  console.log(`  ${"NcertTopicContent".padEnd(22)} ${ctcN} docs (canonical)`);
  console.log(`  ${"Question".padEnd(22)} ${qExact} canonical + ${qVariants} _pN variants = ${qExact + qVariants} to re-key`);
  console.log(`  ${"NcertChunk".padEnd(22)} ${chunkN} docs`);
  console.log(`  ${"Topic".padEnd(22)} ${topicN} docs  (+ ${topicPrereqN} with legacy prerequisites[])`);
  console.log(`  ${"Question.prerequisites".padEnd(22)} ${qPrereqN} docs with legacy prerequisites[]`);
  if (qStray > 0) {
    console.log(`  ⚠ ${qStray} stray ^ch* questions are NOT in the map (e.g. ch5_s1_c2_t1, ch6_s4_c1_t1) — left as-is.`);
  }

  if (dry) {
    console.log("\nOLD → NEW:");
    for (const [o, n] of Object.entries(MAP)) console.log(`  ${o.padEnd(16)} → ${n}`);
    console.log("\n[dry] no writes performed.");
    await mongoose.disconnect();
    return;
  }

  // ── Re-key topicId on NcertTopicContent + NcertChunk (exact match) ─────────
  for (const [label, Model] of [["NcertTopicContent", NcertTopicContent], ["NcertChunk", NcertChunk]]) {
    let changed = 0;
    for (const [oldId, newId] of Object.entries(MAP)) {
      const r = await Model.updateMany({ topicId: oldId }, { $set: { topicId: newId } });
      changed += r.modifiedCount;
    }
    console.log(`✓ ${label}: ${changed} docs re-keyed`);
  }

  // ── Re-key Question topicId — canonical ids AND their `_pN` variants ───────
  // e.g. ch1_s1_c1_t1_p3 → cbse_math10_ch1_euclid_division_lemma_p3
  {
    let exact = 0, variants = 0;
    for (const [oldId, newId] of Object.entries(MAP)) {
      const r = await Question.updateMany({ topicId: oldId }, { $set: { topicId: newId } });
      exact += r.modifiedCount;
      const vDocs = await Question.find({ topicId: pnRegexFor(oldId) }, { _id: 1, topicId: 1 }).lean();
      for (const d of vDocs) {
        await Question.updateOne({ _id: d._id }, { $set: { topicId: newId + d.topicId.slice(oldId.length) } });
      }
      variants += vDocs.length;
    }
    console.log(`✓ Question: ${exact} canonical + ${variants} _pN variant docs re-keyed`);
  }

  // ── Remap prerequisite arrays (DAG edges) ─────────────────────────────────
  for (const [label, Model] of [["Topic", Topic], ["Question", Question]]) {
    const docs = await Model.find({ prerequisites: { $in: OLD_IDS } }, { _id: 1, prerequisites: 1 }).lean();
    for (const d of docs) {
      const remapped = (d.prerequisites || []).map((p) => MAP[p] || p);
      await Model.updateOne({ _id: d._id }, { $set: { prerequisites: remapped } });
    }
    console.log(`✓ ${label}.prerequisites: ${docs.length} docs remapped`);
  }

  // ── Re-key Topic.topicId ──────────────────────────────────────────────────
  let topicChanged = 0;
  for (const [oldId, newId] of Object.entries(MAP)) {
    const r = await Topic.updateMany({ topicId: oldId }, { $set: { topicId: newId } });
    topicChanged += r.modifiedCount;
  }
  console.log(`✓ Topic: ${topicChanged} docs re-keyed`);

  // ── Leftover check ────────────────────────────────────────────────────────
  // A leftover NcertTopicContent doc means a CANONICAL topic was missed — a real
  // problem. Leftover Topic/Question ids are the known pre-existing strays
  // (ch5_s1_c2_t1, ch6_s4_c1_t1 + their _pN variants): no teaching content,
  // duplicate canonical topics — re-key skips them by design.
  const leftCtc   = await NcertTopicContent.countDocuments({ topicId: /^ch\d+_/ });
  const leftTopic = await Topic.distinct("topicId", { topicId: /^ch\d+_/ });
  const leftQ     = await Question.distinct("topicId", { topicId: /^ch\d+_/ });
  console.log("");
  if (leftCtc > 0) {
    console.log(`⚠ ${leftCtc} NcertTopicContent doc(s) still on a legacy ch* id — a canonical topic was MISSED. Investigate.`);
  } else {
    console.log("✓ All 54 canonical CBSE-10 topics re-keyed (0 NcertTopicContent leftovers).");
  }
  const strays = [...new Set([...leftTopic, ...leftQ])].sort();
  if (strays.length) {
    console.log(`ℹ ${strays.length} pre-existing stray ch* topic id(s) remain (no teaching content,`);
    console.log(`  duplicate canonical topics) — re-key skipped them by design. Delete or merge manually:`);
    for (const id of strays) console.log(`    ${id}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
