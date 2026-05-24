/**
 * ICSE Class 10 Mathematics — Topic DAG (prerequisite graph)
 *
 * Creates / updates one Topic node per standardised sub-topic (icse_math10_*),
 * with a linear prerequisite chain WITHIN each chapter (t0 → t1 → t2 → t3).
 * Chapters are independent — each chapter's first topic has no prerequisites —
 * so the planner can schedule chapters in parallel or sequence as it sees fit.
 *
 * Topic `name` is read from the `topics` collection (NOT NcertTopicContent,
 * which has no `name` field for ICSE content).  Topics seeded with the raw
 * topicId as their name (ch19–ch25 batch) are overridden via NAME_OVERRIDES
 * so the graph UI shows human-readable labels.
 *
 * Safe to re-run — all writes are upserts keyed on `topicId`.
 *
 * Usage: node config/seedIcseMath10TopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

// ─── Human-readable name overrides ────────────────────────────────────────────
// Required for ch19–ch25 topics that were seeded with the topicId as the name.
const NAME_OVERRIDES = {
  // Ch 19 — Constructions (Circles)
  icse_math10_ch19_constructions_basics:        "Circle Construction Basics",
  icse_math10_ch19_constructions_tangents:      "Tangent Construction",
  icse_math10_ch19_constructions_inscribed:     "Inscribed Circle Construction",
  icse_math10_ch19_constructions_circumscribed: "Circumscribed Circle Construction",

  // Ch 20 — Cylinder, Cone and Sphere
  icse_math10_ch20_cylinder: "Cylinder: Surface Area and Volume",
  icse_math10_ch20_cone:     "Cone: Surface Area and Volume",
  icse_math10_ch20_sphere:   "Sphere: Surface Area and Volume",
  icse_math10_ch20_combined: "Combined Solids",

  // Ch 21 — Trigonometrical Identities
  icse_math10_ch21_trig_ratios_review:        "Trigonometric Ratios Review",
  icse_math10_ch21_trig_identities_basic:     "Basic Trigonometric Identities",
  icse_math10_ch21_trig_identities_problems:  "Trigonometric Identity Problems",
  icse_math10_ch21_trig_identities_proofs:    "Trigonometric Identity Proofs",

  // Ch 22 — Heights and Distances
  icse_math10_ch22_angles_elevation_depression: "Angles of Elevation and Depression",
  icse_math10_ch22_single_observer:             "Single Observer Problems",
  icse_math10_ch22_buildings_towers:            "Buildings and Towers",
  icse_math10_ch22_two_positions:               "Two Observer Positions",

  // Ch 23 — Graphical Representation
  icse_math10_ch23_histogram:         "Histogram",
  icse_math10_ch23_frequency_polygon: "Frequency Polygon",
  icse_math10_ch23_ogive:             "Ogive (Cumulative Frequency)",
  icse_math10_ch23_ogive_statistics:  "Statistics from Ogive",

  // Ch 24 — Measures of Central Tendency
  icse_math10_ch24_mean_grouped:             "Mean (Grouped Data)",
  icse_math10_ch24_median_grouped:           "Median (Grouped Data)",
  icse_math10_ch24_mode_grouped:             "Mode (Grouped Data)",
  icse_math10_ch24_central_tendency_problems:"Central Tendency Problems",

  // Ch 25 — Probability
  icse_math10_ch25_probability_basics:          "Probability Basics",
  icse_math10_ch25_theoretical_probability:     "Theoretical Probability",
  icse_math10_ch25_experimental_probability:    "Experimental Probability",
  icse_math10_ch25_probability_problems:        "Probability Problems",
};

// ─── Chapter → ordered sub-topic arrays ───────────────────────────────────────
// Order within each chapter = logical study sequence.
// 25 chapters × 4 topics = 100 nodes.
const CHAPTERS = [
  // Ch 1 — Commercial Arithmetic: Value Added Tax / GST
  [
    "icse_math10_ch1_vat_concepts",
    "icse_math10_ch1_vat_computation",
    "icse_math10_ch1_gst_concepts",
    "icse_math10_ch1_gst_computation",
  ],
  // Ch 2 — Banking (Recurring Deposit Account)
  [
    "icse_math10_ch2_rd_concept",
    "icse_math10_ch2_rd_interest",
    "icse_math10_ch2_rd_maturity",
    "icse_math10_ch2_rd_problems",
  ],
  // Ch 3 — Shares and Dividend
  [
    "icse_math10_ch3_shares_basics",
    "icse_math10_ch3_dividend_income",
    "icse_math10_ch3_return_and_yield",
    "icse_math10_ch3_share_problems",
  ],
  // Ch 4 — Linear Inequations (one variable)
  [
    "icse_math10_ch4_ineq_basics",
    "icse_math10_ch4_ineq_solving",
    "icse_math10_ch4_ineq_combined",
    "icse_math10_ch4_ineq_number_line",
  ],
  // Ch 5 — Quadratic Equations
  [
    "icse_math10_ch5_quad_basics",
    "icse_math10_ch5_quad_factoring",
    "icse_math10_ch5_quad_formula",
    "icse_math10_ch5_quad_problems",
  ],
  // Ch 6 — Solving Problems on Quadratic Equations
  [
    "icse_math10_ch6_qprob_numbers",
    "icse_math10_ch6_qprob_geometry",
    "icse_math10_ch6_qprob_motion",
    "icse_math10_ch6_qprob_work",
  ],
  // Ch 7 — Ratio and Proportion
  [
    "icse_math10_ch7_ratio_basics",
    "icse_math10_ch7_proportion_basics",
    "icse_math10_ch7_proportion_properties",
    "icse_math10_ch7_proportion_problems",
  ],
  // Ch 8 — Remainder and Factor Theorems
  [
    "icse_math10_ch8_remainder_theorem",
    "icse_math10_ch8_factor_theorem",
    "icse_math10_ch8_polynomial_factorisation",
    "icse_math10_ch8_polynomial_problems",
  ],
  // Ch 9 — Matrices
  [
    "icse_math10_ch9_matrix_basics",
    "icse_math10_ch9_matrix_operations",
    "icse_math10_ch9_matrix_multiplication",
    "icse_math10_ch9_matrix_problems",
  ],
  // Ch 10 — Arithmetic Progression
  [
    "icse_math10_ch10_ap_basics",
    "icse_math10_ch10_ap_nth_term",
    "icse_math10_ch10_ap_sum",
    "icse_math10_ch10_ap_problems",
  ],
  // Ch 11 — Geometric Progression
  [
    "icse_math10_ch11_gp_basics",
    "icse_math10_ch11_gp_nth_term",
    "icse_math10_ch11_gp_sum",
    "icse_math10_ch11_gp_problems",
  ],
  // Ch 12 — Reflection (Co-ordinate Geometry)
  [
    "icse_math10_ch12_reflection_basics",
    "icse_math10_ch12_reflection_axes",
    "icse_math10_ch12_reflection_lines",
    "icse_math10_ch12_reflection_problems",
  ],
  // Ch 13 — Section and Mid-Point Formula
  [
    "icse_math10_ch13_section_internal",
    "icse_math10_ch13_section_external",
    "icse_math10_ch13_midpoint",
    "icse_math10_ch13_section_problems",
  ],
  // Ch 14 — Equation of a Line
  [
    "icse_math10_ch14_slope",
    "icse_math10_ch14_line_forms",
    "icse_math10_ch14_special_lines",
    "icse_math10_ch14_line_problems",
  ],
  // Ch 15 — Similarity (with Maps and Models)
  [
    "icse_math10_ch15_similarity_basics",
    "icse_math10_ch15_similarity_criteria",
    "icse_math10_ch15_similarity_applications",
    "icse_math10_ch15_similarity_problems",
  ],
  // Ch 16 — Loci (Locus and Its Constructions)
  [
    "icse_math10_ch16_loci_concepts",
    "icse_math10_ch16_loci_properties",
    "icse_math10_ch16_loci_constructions",
    "icse_math10_ch16_loci_problems",
  ],
  // Ch 17 — Circles
  [
    "icse_math10_ch17_circle_theorems",
    "icse_math10_ch17_circle_chord_properties",
    "icse_math10_ch17_circle_arc_angle",
    "icse_math10_ch17_circle_cyclic_quad",
  ],
  // Ch 18 — Tangents and Intersecting Chords
  [
    "icse_math10_ch18_tangent_basics",
    "icse_math10_ch18_tangent_properties",
    "icse_math10_ch18_tangent_chord_angle",
    "icse_math10_ch18_intersecting_chords",
  ],
  // Ch 19 — Constructions (Circles)
  [
    "icse_math10_ch19_constructions_basics",
    "icse_math10_ch19_constructions_tangents",
    "icse_math10_ch19_constructions_inscribed",
    "icse_math10_ch19_constructions_circumscribed",
  ],
  // Ch 20 — Cylinder, Cone and Sphere
  [
    "icse_math10_ch20_cylinder",
    "icse_math10_ch20_cone",
    "icse_math10_ch20_sphere",
    "icse_math10_ch20_combined",
  ],
  // Ch 21 — Trigonometrical Identities
  [
    "icse_math10_ch21_trig_ratios_review",
    "icse_math10_ch21_trig_identities_basic",
    "icse_math10_ch21_trig_identities_problems",
    "icse_math10_ch21_trig_identities_proofs",
  ],
  // Ch 22 — Heights and Distances
  [
    "icse_math10_ch22_angles_elevation_depression",
    "icse_math10_ch22_single_observer",
    "icse_math10_ch22_buildings_towers",
    "icse_math10_ch22_two_positions",
  ],
  // Ch 23 — Graphical Representation (Statistics)
  [
    "icse_math10_ch23_histogram",
    "icse_math10_ch23_frequency_polygon",
    "icse_math10_ch23_ogive",
    "icse_math10_ch23_ogive_statistics",
  ],
  // Ch 24 — Measures of Central Tendency
  [
    "icse_math10_ch24_mean_grouped",
    "icse_math10_ch24_median_grouped",
    "icse_math10_ch24_mode_grouped",
    "icse_math10_ch24_central_tendency_problems",
  ],
  // Ch 25 — Probability
  [
    "icse_math10_ch25_probability_basics",
    "icse_math10_ch25_theoretical_probability",
    "icse_math10_ch25_experimental_probability",
    "icse_math10_ch25_probability_problems",
  ],
];

// ─── Seed ────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  // Read existing topic names from `topics` collection
  const existingTopics = await Topic.find(
    { topicId: /^icse_math10_/ },
    { topicId: 1, name: 1 },
  ).lean();

  const dbNameOf = new Map(existingTopics.map((t) => [t.topicId, t.name]));

  let upserts = 0;
  let missing = 0;
  let overridden = 0;

  for (const chapter of CHAPTERS) {
    for (let idx = 0; idx < chapter.length; idx++) {
      const topicId = chapter[idx];

      // 1. Check NAME_OVERRIDES first (covers ch19–ch25 bad names)
      // 2. Fall back to DB name if it looks real (not equal to the topicId)
      // 3. Skip with a warning if nothing usable
      let name = NAME_OVERRIDES[topicId];
      if (name) {
        overridden++;
      } else {
        const dbName = dbNameOf.get(topicId);
        if (dbName && dbName !== topicId) {
          name = dbName;
        } else {
          console.warn(`⚠  no usable name for ${topicId} — node skipped`);
          missing++;
          continue;
        }
      }

      await Topic.updateOne(
        { topicId },
        {
          $set: {
            topicId,
            name,
            subject:       "Mathematics",
            grade:         "10",
            examBoard:     "ICSE",
            level:         idx,
            prerequisites: idx > 0 ? [chapter[idx - 1]] : [],
          },
        },
        { upsert: true },
      );

      upserts++;
      console.log(
        `✓ ${topicId}  [${name}]  (level ${idx}, prereq: ${
          idx > 0 ? chapter[idx - 1] : "none"
        })`,
      );
    }
  }

  console.log(
    `\nICSE Math 10 TopicDAG: ${upserts} nodes upserted` +
    (overridden ? `, ${overridden} name-overrides applied` : "") +
    (missing    ? `, ${missing} missing/skipped` : "") +
    ".",
  );
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
