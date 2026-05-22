/**
 * cbseMath10IdMap.mjs — single source of truth for the CBSE Class 10 Math re-key.
 *
 * MAP: the 54 canonical sub-topics, legacy ch{N}_s{S}_c{C}_t{T} → standardized
 *      cbse_math10_ch{N}_{descriptor} (SPEC_MATH_STANDARDIZATION §2).
 *
 * STRAY_MERGE: 2 pre-existing stray legacy topics that have NO teaching content
 *      and duplicate a canonical topic — merged into their canonical equivalent.
 *
 * Imported by migrateCbseMath10TopicIds.mjs (DB re-key) and
 * finalizeCbseMath10Rekey.mjs (stray merge + source-file codemod).
 */

export const MAP = {
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

// Stray legacy topics — no NcertTopicContent, duplicate a canonical topic.
// Their questions/chunks merge INTO the canonical topic (the _pN suffix is
// dropped — they become plain extra questions of the canonical topic).
export const STRAY_MERGE = {
  "ch5_s1_c2_t1": "cbse_math10_ch5_nth_term",          // duplicate "nth term of an AP"
  "ch6_s4_c1_t1": "cbse_math10_ch6_pythagoras_theorem", // duplicate "Pythagoras theorem"
};
