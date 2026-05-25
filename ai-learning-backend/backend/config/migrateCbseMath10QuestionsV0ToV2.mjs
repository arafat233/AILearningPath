/**
 * migrateCbseMath10QuestionsV0ToV2.mjs — re-key v0 descriptive topicIds to v2.
 *
 * Background
 * ──────────
 * CBSE Class 10 Math is the oldest content in the codebase. The questions for
 * it were originally tagged with FREEFORM DESCRIPTIVE topicIds like
 * "Algebra Basics" or "Prime factorisation" (v0 convention). Later, all newer
 * boards (CBSE 8/9, AP_SSC, ICSE) standardised on
 * `<board>_math<grade>_ch<N>_<descriptor>` (v2). A previous migration
 * (`migrateCbseMath10TopicIds.mjs`) covered v1 → v2 (the `ch1_s1_c1_t1` form),
 * but never touched the v0 descriptive ids — so 416 of the 423 CBSE 10 Math
 * questions stayed under v0 and the audit script can't find them via the v2
 * NcertTopicContent.topicId join.
 *
 * What this script does
 * ─────────────────────
 * For each sub-topic-level v0 descriptive topicId (Question.topicId), look up
 * the corresponding standardised v2 topicId from the MAP below, and rewrite
 * Question.topicId in place. All other fields (topic, examBoard, subject,
 * grade, answers, etc.) are unchanged.
 *
 * What this script does NOT do
 * ────────────────────────────
 * - Chapter-level catch-all legacy entries ("Algebra Basics", "Linear
 *   Equations", "Surface Areas & Volumes", "Trigonometry", "Applications of
 *   Trigonometry") each have 16 Qs that span multiple sub-topics. These are
 *   used for full-chapter practice mode and don't map cleanly to one v2
 *   sub-topic — left alone.
 * - Questions with topicId = null (uncategorised) — left alone.
 * - User-history collections (Attempt, SeenQuestion, …) — those reference
 *   topicId too but per-user-history rewriting is out of scope.
 *
 * Idempotent: re-running after success finds 0 v0 ids and exits clean.
 *
 * Usage:
 *   node config/migrateCbseMath10QuestionsV0ToV2.mjs --dry    (report only)
 *   node config/migrateCbseMath10QuestionsV0ToV2.mjs          (perform rewrite)
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const isDry = process.argv.includes("--dry");

// ── v0 → v2 map. Keys are the exact Question.topicId string in DB. ───────────
// Every key is a SUB-TOPIC level descriptor; chapter-level catch-alls
// ("Algebra Basics", "Linear Equations", etc.) are deliberately omitted.
const MAP = {
  // Ch1 — Real Numbers
  "Euclid's Division Lemma":                                              "cbse_math10_ch1_euclid_division_lemma",
  "Prime factorisation":                                                  "cbse_math10_ch1_prime_factorisation",
  "LCM/HCF":                                                              "cbse_math10_ch1_lcm_and_hcf",
  "Irrationality proofs":                                                 "cbse_math10_ch1_proving_irrationality",
  "Decimal expansions":                                                   "cbse_math10_ch1_decimal_expansions",

  // Ch2 — Polynomials
  "Polynomial basics & types":                                            "cbse_math10_ch2_degree_and_types",
  "Reading zeros from graphs":                                            "cbse_math10_ch2_zeroes_from_graphs",
  "Find zeros & verify Vieta's":                                          "cbse_math10_ch2_zeroes_and_coefficients",
  "Construct quadratic from S, P":                                        "cbse_math10_ch2_polynomial_from_zeroes",
  "Division algorithm":                                                   "cbse_math10_ch2_division_algorithm",

  // Ch3 — Pair of Linear Equations in Two Variables
  "Graphical method (linear pair)":                                       "cbse_math10_ch3_graphical_method",
  "Classify pairs by ratios":                                             "cbse_math10_ch3_consistency_of_pairs",
  "Substitution method":                                                  "cbse_math10_ch3_substitution_method",
  "Elimination method":                                                   "cbse_math10_ch3_elimination_method",
  "Cross-multiplication method + reducible-to-linear equations":          "cbse_math10_ch3_cross_multiplication",

  // Ch4 — Quadratic Equations
  "Quadratic equation basics":                                            "cbse_math10_ch4_identifying_quadratics",
  "Form quadratic from real life":                                        "cbse_math10_ch4_forming_quadratics",
  "Factorisation method":                                                 "cbse_math10_ch4_factorisation_method",
  "Quadratic formula & discriminant":                                     "cbse_math10_ch4_discriminant_and_roots",
  "Completing the square":                                                "cbse_math10_ch4_completing_the_square",

  // Ch5 — Arithmetic Progressions
  "AP basics (recognize, common diff)":                                   "cbse_math10_ch5_identifying_ap",
  "Sum of n terms of AP":                                                 "cbse_math10_ch5_sum_of_ap",

  // Ch6 — Triangles
  "Similar triangles definition":                                         "cbse_math10_ch6_similar_figures",
  "Basic Proportionality Theorem":                                        "cbse_math10_ch6_basic_proportionality",
  "Similarity criteria (AA, SSS, SAS)":                                   "cbse_math10_ch6_similarity_criteria",
  "Areas of similar triangles":                                           "cbse_math10_ch6_areas_of_similar_triangles",
  "Pythagoras theorem":                                                   "cbse_math10_ch6_pythagoras_theorem",

  // Ch7 — Coordinate Geometry
  "Distance formula":                                                     "cbse_math10_ch7_distance_formula",
  "Section formula":                                                      "cbse_math10_ch7_section_formula",
  "Area of triangle from coordinates":                                    "cbse_math10_ch7_area_and_collinearity",

  // Ch8 — Introduction to Trigonometry
  "Trig ratios definitions":                                              "cbse_math10_ch8_trigonometric_ratios",
  "Trig at standard angles":                                              "cbse_math10_ch8_ratios_of_special_angles",
  "Trigonometric identities":                                             "cbse_math10_ch8_trigonometric_identities",
  "Trigonometric ratios of complementary angles":                         "cbse_math10_ch8_complementary_angles",

  // Ch9 — Some Applications of Trigonometry
  "Single-triangle elevation/depression":                                 "cbse_math10_ch9_single_triangle_heights",
  "Two-triangle elevation problems":                                      "cbse_math10_ch9_two_triangle_heights",

  // Ch10 — Circles
  "Tangent counting & perpendicularity":                                  "cbse_math10_ch10_tangent_properties",
  "Tangent length applications":                                          "cbse_math10_ch10_tangent_lengths",

  // Ch11 — Areas Related to Circles
  "Sectors, segments, areas":                                             "cbse_math10_ch11_sectors_and_segments",
  "Combinations of plane figures — shaded region areas":                  "cbse_math10_ch11_combined_plane_figures",

  // Ch12 — Surface Areas and Volumes
  "Surface area of composite solids":                                     "cbse_math10_ch12_surface_area_of_solids",
  "Volume of composite solids":                                           "cbse_math10_ch12_volume_of_solids",
  "Frustum of a cone — slant height, surface areas, and volume":          "cbse_math10_ch12_frustum_of_a_cone",

  // Ch13 — Statistics
  "Mean of grouped data":                                                 "cbse_math10_ch13_mean_of_grouped_data",
  "Median of grouped data":                                               "cbse_math10_ch13_median_of_grouped_data",
  "Mode of grouped data":                                                 "cbse_math10_ch13_mode_of_grouped_data",
  "Ogives":                                                               "cbse_math10_ch13_ogives",

  // Ch14 — Probability
  "Cards/balls":                                                          "cbse_math10_ch14_cards_and_balls",
  "Dice/coins/spinners":                                                  "cbse_math10_ch14_dice_coins_spinners",
  "Equally-likely & geometric prob.":                                     "cbse_math10_ch14_equally_likely_events",
  "Probability axiomatic basics":                                         "cbse_math10_ch14_probability_basics",
};

const total = Object.keys(MAP).length;
console.log(`v0 → v2 map: ${total} sub-topic mappings\n`);

await mongoose.connect(process.env.MONGO_URI);

let totalUpdated = 0;
const perKey = [];

for (const [oldId, newId] of Object.entries(MAP)) {
  const matchFilter = {
    examBoard: "CBSE",
    subject: "Mathematics",
    grade: "10",
    topicId: oldId,
  };
  const count = await Question.countDocuments(matchFilter);
  if (count === 0) {
    perKey.push({ oldId, newId, before: 0, updated: 0 });
    continue;
  }

  if (isDry) {
    console.log(`  ${oldId.padEnd(60)} → ${newId}   (${count} Qs, dry-run)`);
    perKey.push({ oldId, newId, before: count, updated: 0 });
    continue;
  }

  const res = await Question.updateMany(matchFilter, { $set: { topicId: newId } });
  console.log(`  ✓ ${oldId.padEnd(60)} → ${newId}   (${res.modifiedCount} Qs)`);
  totalUpdated += res.modifiedCount;
  perKey.push({ oldId, newId, before: count, updated: res.modifiedCount });
}

console.log("\n──────────────────────────────────────────────");
const matched = perKey.filter((r) => r.before > 0).length;
const matchedQs = perKey.reduce((s, r) => s + r.before, 0);
console.log(`Map keys touched : ${matched} / ${total}`);
console.log(`Questions in scope: ${matchedQs}`);
console.log(`Questions updated : ${isDry ? 0 : totalUpdated}${isDry ? " (dry-run)" : ""}`);

if (!isDry && matchedQs !== totalUpdated) {
  console.warn(`⚠ ${matchedQs - totalUpdated} expected updates didn't apply — investigate.`);
}

await mongoose.disconnect();
process.exit(0);
