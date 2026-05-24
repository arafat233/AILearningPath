/**
 * AP SSC Class 10 Mathematics — Topic DAG seed
 *
 * 14 chapters × topics = 54 nodes total (mirrors CBSE Math 10 structure exactly).
 * Prerequisite chain is linear within each chapter.
 * Cross-chapter prerequisites follow the standard NCERT learning order.
 *
 * Safe to re-run (upsert by topicId).
 * Usage: node config/seedApSscMath10TopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

// 14 chapters in order: [chapterId, chapterNumber, [[topicId, name], ...]]
const CHAPTERS = [
  ["ap_ssc_math10_ch1",  1, [
    ["ap_ssc_math10_ch1_euclid_division_lemma", "Euclid's Division Lemma"],
    ["ap_ssc_math10_ch1_prime_factorisation",   "Prime Factorisation (FTA)"],
    ["ap_ssc_math10_ch1_lcm_and_hcf",           "LCM and HCF"],
    ["ap_ssc_math10_ch1_proving_irrationality",  "Proving Irrationality"],
    ["ap_ssc_math10_ch1_decimal_expansions",     "Decimal Expansions of Rationals"],
  ]],
  ["ap_ssc_math10_ch2",  2, [
    ["ap_ssc_math10_ch2_degree_and_types",          "Degree and Types of Polynomials"],
    ["ap_ssc_math10_ch2_zeroes_from_graphs",        "Zeroes from Graphs"],
    ["ap_ssc_math10_ch2_zeroes_and_coefficients",   "Zeroes and Coefficients Relationship"],
    ["ap_ssc_math10_ch2_polynomial_from_zeroes",    "Building Polynomial from Zeroes"],
    ["ap_ssc_math10_ch2_division_algorithm",        "Division Algorithm for Polynomials"],
  ]],
  ["ap_ssc_math10_ch3",  3, [
    ["ap_ssc_math10_ch3_graphical_method",       "Graphical Method of Solving"],
    ["ap_ssc_math10_ch3_consistency_of_pairs",   "Consistency and Nature of Pairs"],
    ["ap_ssc_math10_ch3_substitution_method",    "Substitution Method"],
    ["ap_ssc_math10_ch3_elimination_method",     "Elimination Method"],
    ["ap_ssc_math10_ch3_cross_multiplication",   "Cross-Multiplication Method"],
  ]],
  ["ap_ssc_math10_ch4",  4, [
    ["ap_ssc_math10_ch4_identifying_quadratics", "Identifying Quadratic Equations"],
    ["ap_ssc_math10_ch4_forming_quadratics",     "Forming Quadratic Equations"],
    ["ap_ssc_math10_ch4_factorisation_method",   "Factorisation Method"],
    ["ap_ssc_math10_ch4_discriminant_and_roots", "Discriminant and Nature of Roots"],
    ["ap_ssc_math10_ch4_completing_the_square",  "Completing the Square / Quadratic Formula"],
  ]],
  ["ap_ssc_math10_ch5",  5, [
    ["ap_ssc_math10_ch5_identifying_ap",          "Identifying Arithmetic Progressions"],
    ["ap_ssc_math10_ch5_nth_term",                "nth Term of an AP"],
    ["ap_ssc_math10_ch5_sum_of_ap",               "Sum of First n Terms"],
    ["ap_ssc_math10_ch5_arithmetic_mean_combined","Arithmetic Mean and Combined Problems"],
  ]],
  ["ap_ssc_math10_ch6",  6, [
    ["ap_ssc_math10_ch6_similar_figures",            "Similar Figures and Scale Factor"],
    ["ap_ssc_math10_ch6_basic_proportionality",      "Basic Proportionality Theorem"],
    ["ap_ssc_math10_ch6_similarity_criteria",        "Similarity Criteria (AA/SAS/SSS)"],
    ["ap_ssc_math10_ch6_areas_of_similar_triangles", "Areas of Similar Triangles"],
    ["ap_ssc_math10_ch6_pythagoras_theorem",         "Pythagoras Theorem and Converse"],
  ]],
  ["ap_ssc_math10_ch7",  7, [
    ["ap_ssc_math10_ch7_distance_formula",      "Distance Formula"],
    ["ap_ssc_math10_ch7_section_formula",       "Section Formula"],
    ["ap_ssc_math10_ch7_area_and_collinearity", "Area of Triangle and Collinearity"],
  ]],
  ["ap_ssc_math10_ch8",  8, [
    ["ap_ssc_math10_ch8_trigonometric_ratios",      "Trigonometric Ratios"],
    ["ap_ssc_math10_ch8_ratios_of_special_angles",  "Ratios of Special Angles (0°,30°,45°,60°,90°)"],
    ["ap_ssc_math10_ch8_trigonometric_identities",  "Trigonometric Identities"],
    ["ap_ssc_math10_ch8_complementary_angles",      "Trigonometric Ratios of Complementary Angles"],
  ]],
  ["ap_ssc_math10_ch9",  9, [
    ["ap_ssc_math10_ch9_single_triangle_heights", "Single Triangle — Heights and Distances"],
    ["ap_ssc_math10_ch9_two_triangle_heights",    "Two Triangles — Combined Heights"],
  ]],
  ["ap_ssc_math10_ch10", 10, [
    ["ap_ssc_math10_ch10_tangent_properties", "Tangent to a Circle — Properties"],
    ["ap_ssc_math10_ch10_tangent_lengths",    "Tangent Lengths from External Point"],
  ]],
  ["ap_ssc_math10_ch11", 11, [
    ["ap_ssc_math10_ch11_sectors_and_segments",    "Area of Sectors and Segments"],
    ["ap_ssc_math10_ch11_combined_plane_figures",  "Area of Combined Plane Figures"],
  ]],
  ["ap_ssc_math10_ch12", 12, [
    ["ap_ssc_math10_ch12_surface_area_of_solids", "Surface Area of Combined Solids"],
    ["ap_ssc_math10_ch12_volume_of_solids",       "Volume of Combined Solids"],
    ["ap_ssc_math10_ch12_frustum_of_a_cone",      "Frustum of a Cone"],
  ]],
  ["ap_ssc_math10_ch13", 13, [
    ["ap_ssc_math10_ch13_mean_of_grouped_data",   "Mean of Grouped Data"],
    ["ap_ssc_math10_ch13_mode_of_grouped_data",   "Mode of Grouped Data"],
    ["ap_ssc_math10_ch13_median_of_grouped_data", "Median of Grouped Data"],
    ["ap_ssc_math10_ch13_empirical_relationship",  "Empirical Relationship: Mean, Median, Mode"],
    ["ap_ssc_math10_ch13_ogives",                  "Cumulative Frequency and Ogives"],
  ]],
  ["ap_ssc_math10_ch14", 14, [
    ["ap_ssc_math10_ch14_probability_basics",       "Classical Probability Basics"],
    ["ap_ssc_math10_ch14_dice_coins_spinners",      "Probability — Dice, Coins, Spinners"],
    ["ap_ssc_math10_ch14_cards_and_balls",          "Probability — Cards and Balls"],
    ["ap_ssc_math10_ch14_equally_likely_events",    "Equally Likely Events and Complements"],
  ]],
];

// Cross-chapter prerequisites (first topic of ChN has cross-chapter prereq)
const CROSS_CHAPTER_PREREQS = {
  "ap_ssc_math10_ch2_degree_and_types":          ["ap_ssc_math10_ch1_decimal_expansions"],
  "ap_ssc_math10_ch3_graphical_method":           ["ap_ssc_math10_ch2_division_algorithm"],
  "ap_ssc_math10_ch4_identifying_quadratics":     ["ap_ssc_math10_ch3_cross_multiplication"],
  "ap_ssc_math10_ch5_identifying_ap":             ["ap_ssc_math10_ch1_prime_factorisation"],
  "ap_ssc_math10_ch6_similar_figures":            ["ap_ssc_math10_ch4_factorisation_method"],
  "ap_ssc_math10_ch7_distance_formula":           ["ap_ssc_math10_ch6_pythagoras_theorem"],
  "ap_ssc_math10_ch8_trigonometric_ratios":       ["ap_ssc_math10_ch6_pythagoras_theorem"],
  "ap_ssc_math10_ch9_single_triangle_heights":    ["ap_ssc_math10_ch8_complementary_angles"],
  "ap_ssc_math10_ch10_tangent_properties":        ["ap_ssc_math10_ch6_similarity_criteria"],
  "ap_ssc_math10_ch11_sectors_and_segments":      ["ap_ssc_math10_ch10_tangent_lengths"],
  "ap_ssc_math10_ch12_surface_area_of_solids":    ["ap_ssc_math10_ch11_combined_plane_figures"],
  "ap_ssc_math10_ch13_mean_of_grouped_data":      ["ap_ssc_math10_ch5_arithmetic_mean_combined"],
  "ap_ssc_math10_ch14_probability_basics":        ["ap_ssc_math10_ch13_ogives"],
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("\n══════════════════════════════════════════════════════════════════");
  console.log("  AP SSC Math 10 — Topic DAG Seed");
  console.log("══════════════════════════════════════════════════════════════════\n");

  let upserted = 0;

  for (const [chapterId, chapterNumber, topics] of CHAPTERS) {
    for (let i = 0; i < topics.length; i++) {
      const [topicId, name] = topics[i];

      // Prerequisites: previous topic in chapter + any cross-chapter prereqs
      const prereqs = [];
      if (i > 0) prereqs.push(topics[i - 1][0]);
      if (CROSS_CHAPTER_PREREQS[topicId]) {
        prereqs.push(...CROSS_CHAPTER_PREREQS[topicId]);
      }

      await Topic.findOneAndUpdate(
        { topicId },
        {
          $set: {
            topicId,
            name,
            chapterId,
            chapterNumber,
            subject:       "Mathematics",
            grade:         "10",
            examBoard:     "AP_SSC",
            prerequisites: prereqs,
            description:   `AP SSC Class 10 Mathematics — Chapter ${chapterNumber}: ${name}`,
          },
        },
        { upsert: true, new: true }
      );
      upserted++;
    }
  }

  const total = CHAPTERS.reduce((s, [,, topics]) => s + topics.length, 0);
  console.log(`  ✓ Upserted ${upserted} / ${total} Topic DAG nodes.`);
  console.log("\n  Next: npm run rag:build-ap-ssc-math10");
  console.log("═".repeat(68) + "\n");
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
