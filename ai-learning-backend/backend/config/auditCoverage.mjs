/**
 * Coverage Audit Script — Stellar Content Pipeline
 *
 * Compares what NCERT textbook requires vs what is in the DB.
 * Run at any time to find gaps in teaching content, questions, or diagrams.
 *
 * Usage:
 *   node config/auditCoverage.mjs                        # audits all subjects
 *   node config/auditCoverage.mjs Science                # Science only
 *   node config/auditCoverage.mjs Mathematics            # Math only
 *   node config/auditCoverage.mjs Science --detail       # show per-topic question counts
 *   node config/auditCoverage.mjs Science --missing-only # show only gaps
 */

import "dotenv/config";
import mongoose from "mongoose";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const filterSubject = args.find(a => !a.startsWith("--")) || null;
const showDetail    = args.includes("--detail");
const missingOnly   = args.includes("--missing-only");

// ─── Expected topics per chapter (CBSE 2023-24 syllabus) ─────────────────────
// Update this table when adding a new subject/class.
// Format: { chapterId, chapterName, subject, grade, expectedTopicIds: [...] }
const EXPECTED = [

  // ══════════════════════════════════════════════════════
  // SCIENCE — Class 10 (CBSE 2023-24)
  // ══════════════════════════════════════════════════════
  {
    chapterId: "sci_ch1", chapterName: "Chemical Reactions and Equations",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch1_signs_and_types",
      "sci_ch1_balancing_equations",
      "sci_ch1_oxidation_reduction",
      "sci_ch1_thermal_decomposition",
    ],
  },
  {
    chapterId: "sci_ch2", chapterName: "Acids, Bases and Salts",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch2_acids_bases_indicators",
      "sci_ch2_ph_scale",
      "sci_ch2_acids_reactions",
      "sci_ch2_salts",
    ],
  },
  {
    chapterId: "sci_ch3", chapterName: "Metals and Non-metals",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch3_physical_properties",
      "sci_ch3_reactivity_series",
      "sci_ch3_ionic_bonding",
      "sci_ch3_extraction_metallurgy",
    ],
  },
  {
    chapterId: "sci_ch4", chapterName: "Carbon and Its Compounds",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch4_covalent_bonding",
      "sci_ch4_homologous_series",
      "sci_ch4_carbon_reactions",
      "sci_ch4_ethanol_and_ethanoic_acid",
      "sci_ch4_carbon_allotropes",
    ],
  },
  {
    chapterId: "sci_ch5", chapterName: "Life Processes",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch5_photosynthesis",
      "sci_ch5_human_digestion",
      "sci_ch5_respiration",
      "sci_ch5_transport_blood",
      "sci_ch5_transport_plants",
      "sci_ch5_excretion",
    ],
  },
  {
    chapterId: "sci_ch6", chapterName: "Control and Coordination",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch6_nervous_system",
      "sci_ch6_reflex_arc",
      "sci_ch6_brain",
      "sci_ch6_plant_hormones",
      "sci_ch6_endocrine_system",
    ],
  },
  {
    chapterId: "sci_ch7", chapterName: "How do Organisms Reproduce?",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch7_asexual_reproduction",
      "sci_ch7_sexual_reproduction_plants",
      "sci_ch7_human_reproduction",
      "sci_ch7_reproductive_health",
    ],
  },
  {
    chapterId: "sci_ch8", chapterName: "Heredity",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch8_variation",
      "sci_ch8_mendels_laws",
      "sci_ch8_sex_determination",
    ],
  },
  {
    chapterId: "sci_ch9", chapterName: "Light — Reflection and Refraction",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch9_reflection_mirrors",
      "sci_ch9_mirror_formula",
      "sci_ch9_refraction_snells_law",
      "sci_ch9_lenses",
    ],
  },
  {
    chapterId: "sci_ch10", chapterName: "The Human Eye and the Colourful World",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch10_human_eye",
      "sci_ch10_eye_defects",
      "sci_ch10_dispersion_scattering",
    ],
  },
  {
    chapterId: "sci_ch11", chapterName: "Electricity",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch11_current_potential",
      "sci_ch11_ohms_law_resistance",
      "sci_ch11_series_parallel",
      "sci_ch11_power_heating",
    ],
  },
  {
    chapterId: "sci_ch12", chapterName: "Magnetic Effects of Electric Current",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch12_magnetic_field",
      "sci_ch12_force_on_conductor",
      "sci_ch12_electric_motor",
      "sci_ch12_electromagnetic_induction",
      "sci_ch12_domestic_circuits",
    ],
  },
  {
    chapterId: "sci_ch13", chapterName: "Our Environment",
    subject: "Science", grade: "10",
    expectedTopicIds: [
      "sci_ch13_ecosystem",
      "sci_ch13_energy_flow",
      "sci_ch13_biodegradability",
      "sci_ch13_ozone",
    ],
  },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 10 (CBSE 2023-24)
  // ══════════════════════════════════════════════════════
  {
    chapterId: "ch1", chapterName: "Real Numbers",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch1_s1_c1_t1", "ch1_s2_c1_t1", "ch1_s2_c1_t2",
      "ch1_s3_c1_t1", "ch1_s4_c1_t1",
    ],
  },
  {
    chapterId: "ch2", chapterName: "Polynomials",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch2_s1_c1_t1", "ch2_s2_c1_t1",
      "ch2_s3_c1_t1", "ch2_s3_c1_t2", "ch2_s4_c1_t1",
    ],
  },
  {
    chapterId: "ch3", chapterName: "Pair of Linear Equations",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch3_s1_c1_t1", "ch3_s1_c1_t2",
      "ch3_s2_c1_t1", "ch3_s3_c1_t1", "ch3_s4_c1_t1",
    ],
  },
  {
    chapterId: "ch4", chapterName: "Quadratic Equations",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch4_s1_c1_t1", "ch4_s1_c1_t2",
      "ch4_s2_c1_t1", "ch4_s3_c1_t1", "ch4_s4_c1_t1",
    ],
  },
  {
    chapterId: "ch5", chapterName: "Arithmetic Progressions",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch5_s1_c1_t1", "ch5_s2_c1_t1",
      "ch5_s3_c1_t1", "ch5_s4_c1_t1",
    ],
  },
  {
    chapterId: "ch6", chapterName: "Triangles",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch6_s1_c1_t1", "ch6_s2_c1_t1", "ch6_s3_c1_t1",
      "ch6_s5_c1_t1", "ch6_s6_c1_t1",
    ],
  },
  {
    chapterId: "ch7", chapterName: "Coordinate Geometry",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch7_s1_c1_t1", "ch7_s2_c1_t1", "ch7_s3_c1_t1",
    ],
  },
  {
    chapterId: "ch8", chapterName: "Introduction to Trigonometry",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch8_s1_c1_t1", "ch8_s2_c1_t1",
      "ch8_s3_c1_t1", "ch8_s4_c1_t1",
    ],
  },
  {
    chapterId: "ch9", chapterName: "Some Applications of Trigonometry",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [ "ch9_s1_c1_t1", "ch9_s1_c1_t2" ],
  },
  {
    chapterId: "ch10", chapterName: "Circles",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [ "ch10_s1_c1_t1", "ch10_s2_c1_t1" ],
  },
  {
    chapterId: "ch11", chapterName: "Areas Related to Circles",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [ "ch11_s1_c1_t1", "ch11_s2_c1_t1" ],
  },
  {
    chapterId: "ch12", chapterName: "Surface Areas and Volumes",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [ "ch12_s1_c1_t1", "ch12_s2_c1_t1", "ch12_s3_c1_t1" ],
  },
  {
    chapterId: "ch13", chapterName: "Statistics",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch13_s1_c1_t1", "ch13_s2_c1_t1", "ch13_s3_c1_t1",
      "ch13_s4_c1_t1", "ch13_s5_c1_t1",
    ],
  },
  {
    chapterId: "ch14", chapterName: "Probability",
    subject: "Mathematics", grade: "10",
    expectedTopicIds: [
      "ch14_s1_c1_t1", "ch14_s1_c1_t2",
      "ch14_s1_c1_t3", "ch14_s1_c1_t4",
    ],
  },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — ICSE Class 10 (Selina/Concise — 25 chapters, 7 units)
  // ══════════════════════════════════════════════════════
  { chapterId: "icse10_ch1",  chapterName: "Value Added Tax",                                 subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch1_vat_intro","icse10_ch1_vat_calculations","icse10_ch1_vat_invoice","icse10_ch1_vat_word_problems"] },
  { chapterId: "icse10_ch2",  chapterName: "Banking (Recurring Deposit Account)",             subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch2_banking_intro","icse10_ch2_banking_si_formula","icse10_ch2_banking_maturity","icse10_ch2_banking_word_problems"] },
  { chapterId: "icse10_ch3",  chapterName: "Shares and Dividend",                             subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch3_shares_basics","icse10_ch3_shares_dividend","icse10_ch3_shares_market_value","icse10_ch3_shares_word_problems"] },
  { chapterId: "icse10_ch4",  chapterName: "Linear Inequations (In one variable)",            subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch4_inequations_intro","icse10_ch4_inequations_solving","icse10_ch4_inequations_number_line","icse10_ch4_inequations_word"] },
  { chapterId: "icse10_ch5",  chapterName: "Quadratic Equations",                             subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch5_quadratic_intro","icse10_ch5_quadratic_factorization","icse10_ch5_quadratic_formula","icse10_ch5_quadratic_nature"] },
  { chapterId: "icse10_ch6",  chapterName: "Solving (Simple) Problems on Quadratic Equations",subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch6_word_problems_quad","icse10_ch6_age_problems","icse10_ch6_speed_problems","icse10_ch6_geometry_problems"] },
  { chapterId: "icse10_ch7",  chapterName: "Ratio and Proportion",                            subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch7_ratio_basics","icse10_ch7_proportion_properties","icse10_ch7_continued_proportion","icse10_ch7_proportion_applications"] },
  { chapterId: "icse10_ch8",  chapterName: "Remainder and Factor Theorems",                   subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch8_remainder_theorem","icse10_ch8_factor_theorem","icse10_ch8_factorization_cubic","icse10_ch8_polynomial_division"] },
  { chapterId: "icse10_ch9",  chapterName: "Matrices",                                        subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch9_matrix_basics","icse10_ch9_matrix_operations","icse10_ch9_matrix_multiplication","icse10_ch9_matrix_determinant"] },
  { chapterId: "icse10_ch10", chapterName: "Arithmetic Progression",                          subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch10_ap_intro","icse10_ch10_ap_nth_term","icse10_ch10_ap_sum","icse10_ch10_ap_applications"] },
  { chapterId: "icse10_ch11", chapterName: "Geometric Progression",                           subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch11_gp_intro","icse10_ch11_gp_nth_term","icse10_ch11_gp_sum","icse10_ch11_gp_applications"] },
  { chapterId: "icse10_ch12", chapterName: "Reflection",                                      subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch12_reflection_x_axis","icse10_ch12_reflection_y_axis","icse10_ch12_reflection_origin","icse10_ch12_invariant_points"] },
  { chapterId: "icse10_ch13", chapterName: "Section and Mid-Point Formula",                   subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch13_section_formula","icse10_ch13_midpoint","icse10_ch13_dividing_line","icse10_ch13_section_applications"] },
  { chapterId: "icse10_ch14", chapterName: "Equation of a Line",                              subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch14_slope_intercept","icse10_ch14_two_point_form","icse10_ch14_parallel_perpendicular","icse10_ch14_line_problems"] },
  { chapterId: "icse10_ch15", chapterName: "Similarity (with Maps and Models)",               subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch15_similarity_intro","icse10_ch15_similar_triangles","icse10_ch15_maps_models","icse10_ch15_area_ratio"] },
  { chapterId: "icse10_ch16", chapterName: "Loci (Locus and Its Constructions)",              subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch16_locus_intro","icse10_ch16_perpendicular_bisector_locus","icse10_ch16_angle_bisector_locus","icse10_ch16_circle_locus"] },
  { chapterId: "icse10_ch17", chapterName: "Circles",                                         subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch17_chord_properties","icse10_ch17_arcs_angles","icse10_ch17_cyclic_quadrilateral","icse10_ch17_circle_theorems"] },
  { chapterId: "icse10_ch18", chapterName: "Tangents and Intersecting Chords",                subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch18_tangent_properties","icse10_ch18_two_tangents","icse10_ch18_intersecting_chords","icse10_ch18_alternate_segment"] },
  { chapterId: "icse10_ch19", chapterName: "Constructions (Circles)",                         subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch19_construct_tangent","icse10_ch19_construct_circumscribe","icse10_ch19_construct_inscribe","icse10_ch19_construct_problems"] },
  { chapterId: "icse10_ch20", chapterName: "Cylinder, Cone and Sphere (Surface Area & Volume)",subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch20_cylinder_volume","icse10_ch20_cone_surface","icse10_ch20_sphere_area","icse10_ch20_combined_solids"] },
  { chapterId: "icse10_ch21", chapterName: "Trigonometrical Identities",                      subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch21_basic_identities","icse10_ch21_complementary_angles","icse10_ch21_trig_tables","icse10_ch21_identity_proofs"] },
  { chapterId: "icse10_ch22", chapterName: "Heights and Distances",                           subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch22_angle_elevation","icse10_ch22_angle_depression","icse10_ch22_height_problems","icse10_ch22_distance_problems"] },
  { chapterId: "icse10_ch23", chapterName: "Graphical Representation",                        subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch23_histograms","icse10_ch23_frequency_polygon","icse10_ch23_ogives","icse10_ch23_comparison_graphs"] },
  { chapterId: "icse10_ch24", chapterName: "Measures of Central Tendency",                    subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch24_mean","icse10_ch24_median","icse10_ch24_mode","icse10_ch24_quartiles"] },
  { chapterId: "icse10_ch25", chapterName: "Probability",                                     subject: "Mathematics", grade: "10-ICSE", skipDiagram: true, expectedTopicIds: ["icse10_ch25_probability_intro","icse10_ch25_simple_events","icse10_ch25_compound_events","icse10_ch25_probability_problems"] },

  // ══════════════════════════════════════════════════════
  // SOCIAL SCIENCE — Class 10 (CBSE 2023-24)
  // History (Ch1-5) | Geography (Ch6-12) | Economics (Ch13-17) | Political Science (Ch18-22)
  // ══════════════════════════════════════════════════════

  // ── History ──────────────────────────────────────────
  {
    chapterId: "sst_ch1", chapterName: "The Rise of Nationalism in Europe",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch1_french_revolution",
      "sst_ch1_nationalism_europe",
      "sst_ch1_unification",
      "sst_ch1_visualising_nation",
    ],
  },
  {
    chapterId: "sst_ch2", chapterName: "Nationalism in India",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch2_non_cooperation",
      "sst_ch2_civil_disobedience",
      "sst_ch2_collective_belonging",
    ],
  },
  {
    chapterId: "sst_ch3", chapterName: "The Making of a Global World",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch3_premodern_world",
      "sst_ch3_interwar_economy",
      "sst_ch3_post_war",
    ],
  },
  {
    chapterId: "sst_ch4", chapterName: "The Age of Industrialisation",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch4_proto_industrialisation",
      "sst_ch4_factory_system",
      "sst_ch4_india_industrialisation",
    ],
  },
  {
    chapterId: "sst_ch5", chapterName: "Print Culture and the Modern World",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch5_print_revolution",
      "sst_ch5_india_print",
    ],
  },

  // ── Geography ─────────────────────────────────────────
  {
    chapterId: "sst_ch6", chapterName: "Resources and Development",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch6_types_resources",
      "sst_ch6_land_resources",
      "sst_ch6_soil_types",
    ],
  },
  {
    chapterId: "sst_ch7", chapterName: "Forest and Wildlife Resources",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch7_forest_types",
      "sst_ch7_biodiversity",
      "sst_ch7_conservation",
    ],
  },
  {
    chapterId: "sst_ch8", chapterName: "Water Resources",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch8_water_scarcity",
      "sst_ch8_multipurpose_projects",
      "sst_ch8_rainwater_harvesting",
    ],
  },
  {
    chapterId: "sst_ch9", chapterName: "Agriculture",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch9_types_farming",
      "sst_ch9_major_crops",
      "sst_ch9_tech_reforms",
    ],
  },
  {
    chapterId: "sst_ch10", chapterName: "Minerals and Energy Resources",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch10_minerals",
      "sst_ch10_energy_resources",
    ],
  },
  {
    chapterId: "sst_ch11", chapterName: "Manufacturing Industries",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch11_industries_types",
      "sst_ch11_textile_industry",
      "sst_ch11_environment",
    ],
  },
  {
    chapterId: "sst_ch12", chapterName: "Lifelines of National Economy",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch12_transport",
      "sst_ch12_communication",
      "sst_ch12_international_trade",
    ],
  },

  // ── Economics ─────────────────────────────────────────
  {
    chapterId: "sst_ch13", chapterName: "Development",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch13_development_goals",
      "sst_ch13_hdi",
    ],
  },
  {
    chapterId: "sst_ch14", chapterName: "Sectors of the Indian Economy",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch14_sectors",
      "sst_ch14_employment",
      "sst_ch14_services_sector",
    ],
  },
  {
    chapterId: "sst_ch15", chapterName: "Money and Credit",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch15_money",
      "sst_ch15_banking",
      "sst_ch15_credit",
    ],
  },
  {
    chapterId: "sst_ch16", chapterName: "Globalisation and the Indian Economy",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch16_globalisation",
      "sst_ch16_impact",
      "sst_ch16_fair_globalisation",
    ],
  },
  {
    chapterId: "sst_ch17", chapterName: "Consumer Rights",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch17_consumer_awareness",
      "sst_ch17_consumer_rights",
      "sst_ch17_consumer_protection",
    ],
  },

  // ── Political Science ─────────────────────────────────
  {
    chapterId: "sst_ch18", chapterName: "Power Sharing",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch18_power_sharing",
      "sst_ch18_forms",
    ],
  },
  {
    chapterId: "sst_ch19", chapterName: "Federalism",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch19_federalism",
      "sst_ch19_how_it_works",
      "sst_ch19_decentralisation",
    ],
  },
  {
    chapterId: "sst_ch20", chapterName: "Democracy and Diversity",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch20_social_differences",
      "sst_ch20_politics_division",
    ],
  },
  {
    chapterId: "sst_ch21", chapterName: "Gender, Religion and Caste",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch21_gender",
      "sst_ch21_religion_politics",
      "sst_ch21_caste",
    ],
  },
  {
    chapterId: "sst_ch22", chapterName: "Popular Struggles and Movements",
    subject: "Social Science", grade: "10",
    expectedTopicIds: [
      "sst_ch22_struggles",
      "sst_ch22_movements",
    ],
  },

  // ── English Grade 10 (no diagrams required) ──────────────────────────────
  // First Flight — Prose
  { chapterId: "eng_ff_ch1", chapterName: "A Letter to God", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch1_prose"] },
  { chapterId: "eng_ff_ch2", chapterName: "Nelson Mandela: Long Walk to Freedom", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch2_prose"] },
  { chapterId: "eng_ff_ch3", chapterName: "Two Stories about Flying", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch3_prose"] },
  { chapterId: "eng_ff_ch4", chapterName: "From the Diary of Anne Frank", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch4_prose"] },
  { chapterId: "eng_ff_ch5", chapterName: "Glimpses of India", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch5_prose"] },
  { chapterId: "eng_ff_ch6", chapterName: "Mijbil the Otter", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch6_prose"] },
  { chapterId: "eng_ff_ch7", chapterName: "Madam Rides the Bus", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch7_prose"] },
  { chapterId: "eng_ff_ch8", chapterName: "The Sermon at Benares", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch8_prose"] },
  { chapterId: "eng_ff_ch9", chapterName: "The Proposal", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch9_prose"] },
  // First Flight — Poems
  { chapterId: "eng_ff_poem1", chapterName: "Dust of Snow + Fire and Ice", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch1_poem"] },
  { chapterId: "eng_ff_poem2", chapterName: "A Tiger in the Zoo", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch2_poem"] },
  { chapterId: "eng_ff_poem3", chapterName: "How to Tell Wild Animals + The Ball Poem", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch3_poem"] },
  { chapterId: "eng_ff_poem4", chapterName: "Amanda!", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch4_poem"] },
  { chapterId: "eng_ff_poem5", chapterName: "The Trees", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch5_poem"] },
  { chapterId: "eng_ff_poem6", chapterName: "Fog", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch6_poem"] },
  { chapterId: "eng_ff_poem7", chapterName: "The Tale of Custard the Dragon", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch7_poem"] },
  { chapterId: "eng_ff_poem8", chapterName: "For Anne Gregory", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_ff_ch8_poem"] },
  // Footprints Without Feet
  { chapterId: "eng_fw_ch1", chapterName: "A Triumph of Surgery", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch1"] },
  { chapterId: "eng_fw_ch2", chapterName: "The Thief's Story", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch2"] },
  { chapterId: "eng_fw_ch3", chapterName: "The Midnight Visitor", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch3"] },
  { chapterId: "eng_fw_ch4", chapterName: "A Question of Trust", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch4"] },
  { chapterId: "eng_fw_ch5", chapterName: "Footprints Without Feet", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch5"] },
  { chapterId: "eng_fw_ch6", chapterName: "The Making of a Scientist", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch6"] },
  { chapterId: "eng_fw_ch7", chapterName: "The Necklace", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch7"] },
  { chapterId: "eng_fw_ch8", chapterName: "Bholi", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch8"] },
  { chapterId: "eng_fw_ch9", chapterName: "The Book That Saved the Earth", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_fw_ch9"] },
  // Words and Expressions 2 — Grammar/Writing
  { chapterId: "eng_wb_unit1", chapterName: "Workbook Unit 1 — Sequencing & Narrative", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar1"] },
  { chapterId: "eng_wb_unit2", chapterName: "Workbook Unit 2 — Verb Forms & Tenses", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar2"] },
  { chapterId: "eng_wb_unit3", chapterName: "Workbook Unit 3 — Relative Clauses", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar3"] },
  { chapterId: "eng_wb_unit4", chapterName: "Workbook Unit 4 — Active and Passive Voice", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar4"] },
  { chapterId: "eng_wb_unit5", chapterName: "Workbook Unit 5 — Conditionals", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar5"] },
  { chapterId: "eng_wb_unit6", chapterName: "Workbook Unit 6 — Reported Speech", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar6"] },
  { chapterId: "eng_wb_unit7", chapterName: "Workbook Unit 7 — Article Writing", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar7"] },
  { chapterId: "eng_wb_unit8", chapterName: "Workbook Unit 8 — Report Writing", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar8"] },
  { chapterId: "eng_wb_unit9", chapterName: "Workbook Unit 9 — Speech Writing", subject: "English", grade: "10", skipDiagram: true,
    expectedTopicIds: ["eng_wb_grammar9"] },

  // ── Hindi Grade 10 (no diagrams required) ────────────────────────────────
  // Kshitij Bhaag 2
  { chapterId: "hin_ks_ch1",  chapterName: "सूरदास के पद",                   subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch1"] },
  { chapterId: "hin_ks_ch2",  chapterName: "तुलसीदास के पद",                 subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch2"] },
  { chapterId: "hin_ks_ch3",  chapterName: "देव के पद",                      subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch3"] },
  { chapterId: "hin_ks_ch4",  chapterName: "जयशंकर प्रसाद — आत्मकथ्य",     subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch4"] },
  { chapterId: "hin_ks_ch5",  chapterName: "निराला — उत्साह, अट नहीं रही",  subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch5"] },
  { chapterId: "hin_ks_ch6",  chapterName: "नागार्जुन — दंतुरित मुस्कान, फसल", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch6"] },
  { chapterId: "hin_ks_ch7",  chapterName: "फ़िराक़ — रुबाइयाँ, गज़ल",       subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch7"] },
  { chapterId: "hin_ks_ch8",  chapterName: "मंगलेश डबराल — संगतकार",        subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch8"] },
  { chapterId: "hin_ks_ch9",  chapterName: "स्वयं प्रकाश — नेताजी का चश्मा", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch9"] },
  { chapterId: "hin_ks_ch10", chapterName: "बेनीपुरी — बालगोबिन भगत",       subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch10"] },
  { chapterId: "hin_ks_ch11", chapterName: "यशपाल — लखनवी अंदाज़",          subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch11"] },
  { chapterId: "hin_ks_ch12", chapterName: "मन्नू भंडारी — एक कहानी यह भी", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_ks_ch12"] },
  // Sparsh Bhaag 2
  { chapterId: "hin_sp_ch13", chapterName: "कबीर की साखियाँ",                subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch13"] },
  { chapterId: "hin_sp_ch14", chapterName: "मीरा के पद",                     subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch14"] },
  { chapterId: "hin_sp_ch15", chapterName: "बिहारी के दोहे",                 subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch15"] },
  { chapterId: "hin_sp_ch16", chapterName: "मैथिलीशरण गुप्त — मनुष्यता",    subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch16"] },
  { chapterId: "hin_sp_ch17", chapterName: "पंत — पर्वत प्रदेश में पावस",   subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch17"] },
  { chapterId: "hin_sp_ch18", chapterName: "महादेवी — मधुर-मधुर मेरे दीपक जल", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch18"] },
  { chapterId: "hin_sp_ch19", chapterName: "वीरेन डंगवाल — तोप",             subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch19"] },
  { chapterId: "hin_sp_ch20", chapterName: "प्रेमचंद — बड़े भाई साहब",      subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch20"] },
  { chapterId: "hin_sp_ch21", chapterName: "सेकसरिया — डायरी का एक पन्ना",  subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch21"] },
  { chapterId: "hin_sp_ch22", chapterName: "लीलाधर — तताँरा-वामीरो कथा",    subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch22"] },
  { chapterId: "hin_sp_ch23", chapterName: "प्रहलाद — तीसरी कसम के शिल्पकार", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch23"] },
  { chapterId: "hin_sp_ch24", chapterName: "मंटो — अब कहाँ दूसरे के दुख से", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch24"] },
  { chapterId: "hin_sp_ch25", chapterName: "सर्वेश्वर — पतझर में टूटी पत्तियाँ", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch25"] },
  { chapterId: "hin_sp_ch26", chapterName: "हबीब तनवीर — कारतूस",            subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sp_ch26"] },
  // Kritika Bhaag 2
  { chapterId: "hin_kr_ch27", chapterName: "शिवपूजन सहाय — माता का आँचल",   subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_kr_ch27"] },
  { chapterId: "hin_kr_ch28", chapterName: "कमलेश्वर — जॉर्ज पंचम की नाक", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_kr_ch28"] },
  { chapterId: "hin_kr_ch29", chapterName: "मधु कांकरिया — साना-साना हाथ जोड़ि", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_kr_ch29"] },
  // Sanchayan Bhaag 2
  { chapterId: "hin_sy_ch30", chapterName: "मिथिलेश्वर — हरिहर काका",        subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sy_ch30"] },
  { chapterId: "hin_sy_ch31", chapterName: "गुरदयाल सिंह — सपनों के से दिन", subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sy_ch31"] },
  { chapterId: "hin_sy_ch32", chapterName: "राही मासूम रज़ा — टोपी शुक्ला",  subject: "Hindi", grade: "10", skipDiagram: true, expectedTopicIds: ["hin_sy_ch32"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 1 v2 (Math Magic, NCERT) — sub-topic expansion
  // 4 sub-topics per chapter × 13 chapters = 52 topics, ~416 questions
  // ══════════════════════════════════════════════════════
  { chapterId: "math1_ch1",  chapterName: "Shapes and Space",                 subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch1_2d_shapes","math1_ch1_comparing_shapes","math1_ch1_position_words","math1_ch1_sorting_shapes"] },
  { chapterId: "math1_ch2",  chapterName: "Numbers from One to Nine",         subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch2_counting_1_to_5","math1_ch2_counting_6_to_9","math1_ch2_number_names","math1_ch2_ordering_numbers"] },
  { chapterId: "math1_ch3",  chapterName: "Addition",                         subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch3_joining_sets","math1_ch3_addition_with_pictures","math1_ch3_addition_facts","math1_ch3_addition_word_problems"] },
  { chapterId: "math1_ch4",  chapterName: "Subtraction",                      subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch4_taking_away","math1_ch4_subtraction_with_pictures","math1_ch4_subtraction_facts","math1_ch4_subtraction_word_problems"] },
  { chapterId: "math1_ch5",  chapterName: "Numbers from Ten to Twenty",       subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch5_number_ten","math1_ch5_numbers_11_to_15","math1_ch5_numbers_16_to_20","math1_ch5_ordering_to_20"] },
  { chapterId: "math1_ch6",  chapterName: "Time",                             subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch6_days_of_week","math1_ch6_parts_of_day","math1_ch6_reading_clock","math1_ch6_sequencing_events"] },
  { chapterId: "math1_ch7",  chapterName: "Measurement",                      subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch7_comparing_lengths","math1_ch7_non_standard_units","math1_ch7_comparing_weights","math1_ch7_comparing_capacities"] },
  { chapterId: "math1_ch8",  chapterName: "Numbers from Twenty-one to Fifty", subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch8_numbers_21_to_30","math1_ch8_numbers_31_to_40","math1_ch8_numbers_41_to_50","math1_ch8_ordering_to_50"] },
  { chapterId: "math1_ch9",  chapterName: "Data Handling",                    subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch9_collecting_data","math1_ch9_sorting_and_grouping","math1_ch9_tally_marks","math1_ch9_pictographs"] },
  { chapterId: "math1_ch10", chapterName: "Patterns",                         subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch10_repeating_patterns","math1_ch10_growing_patterns","math1_ch10_number_patterns","math1_ch10_shape_patterns"] },
  { chapterId: "math1_ch11", chapterName: "Numbers",                          subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch11_tens_and_ones","math1_ch11_numbers_51_to_75","math1_ch11_numbers_76_to_99","math1_ch11_comparing_two_digit"] },
  { chapterId: "math1_ch12", chapterName: "Money",                            subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch12_coins_and_notes","math1_ch12_value_of_coins","math1_ch12_making_amounts","math1_ch12_simple_money_problems"] },
  { chapterId: "math1_ch13", chapterName: "How Many",                         subject: "Mathematics", grade: "1", skipDiagram: true, expectedTopicIds: ["math1_ch13_counting_large_groups","math1_ch13_counting_in_groups","math1_ch13_estimation","math1_ch13_comparing_quantities"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 2 (Math Magic, NCERT)
  // ══════════════════════════════════════════════════════
  { chapterId: "math2_ch1",  chapterName: "What is Long, What is Round?", subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch1_long_vs_round","math2_ch1_rolling_sliding","math2_ch1_flat_vs_curved","math2_ch1_3d_shapes"] },
  { chapterId: "math2_ch2",  chapterName: "Counting in Groups",            subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch2_counting_by_2s","math2_ch2_counting_by_5s","math2_ch2_counting_by_10s","math2_ch2_odd_and_even"] },
  { chapterId: "math2_ch3",  chapterName: "How Much Can You Carry?",       subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch3_heavy_vs_light","math2_ch3_comparing_weights","math2_ch3_standard_units_weight","math2_ch3_estimating_weight"] },
  { chapterId: "math2_ch4",  chapterName: "Counting in Tens",              subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch4_tens_place","math2_ch4_ones_place","math2_ch4_numbers_to_99","math2_ch4_expanded_form"] },
  { chapterId: "math2_ch5",  chapterName: "Patterns",                      subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch5_color_patterns","math2_ch5_number_patterns","math2_ch5_growing_patterns","math2_ch5_pattern_rules"] },
  { chapterId: "math2_ch6",  chapterName: "Footprints",                    subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch6_footprint_shapes","math2_ch6_symmetry","math2_ch6_measuring_length","math2_ch6_comparing_sizes"] },
  { chapterId: "math2_ch7",  chapterName: "Jugs and Mugs",                 subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch7_full_and_empty","math2_ch7_comparing_capacity","math2_ch7_litres_intro","math2_ch7_measuring_capacity"] },
  { chapterId: "math2_ch8",  chapterName: "Tens and Ones",                 subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch8_regrouping","math2_ch8_addition_2digit","math2_ch8_subtraction_2digit","math2_ch8_carrying_borrowing"] },
  { chapterId: "math2_ch9",  chapterName: "My Funbook",                    subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch9_number_puzzles","math2_ch9_magic_squares","math2_ch9_math_games","math2_ch9_crossword_numbers"] },
  { chapterId: "math2_ch10", chapterName: "Add our Points",                subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch10_adding_scores","math2_ch10_addition_3digit","math2_ch10_word_problems_add","math2_ch10_mental_math_add"] },
  { chapterId: "math2_ch11", chapterName: "Lines and Lines",               subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch11_straight_curved","math2_ch11_horizontal_vertical","math2_ch11_parallel_lines","math2_ch11_shapes_from_lines"] },
  { chapterId: "math2_ch12", chapterName: "Give and Take",                 subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch12_subtraction_meaning","math2_ch12_subtraction_word_problems","math2_ch12_mental_math_subtract","math2_ch12_addition_subtraction_link"] },
  { chapterId: "math2_ch13", chapterName: "The Longest Step",              subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch13_measuring_length","math2_ch13_cm_and_m","math2_ch13_ruler_use","math2_ch13_comparing_lengths"] },
  { chapterId: "math2_ch14", chapterName: "Birds Come, Birds Go",          subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch14_data_collection","math2_ch14_tally_marks","math2_ch14_bar_graphs","math2_ch14_pictographs"] },
  { chapterId: "math2_ch15", chapterName: "How Many Ponytails?",           subject: "Mathematics", grade: "2", skipDiagram: true, expectedTopicIds: ["math2_ch15_survey_data","math2_ch15_sorting_data","math2_ch15_interpreting_data","math2_ch15_making_graphs"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 3 (Math Magic, NCERT)
  // ══════════════════════════════════════════════════════
  { chapterId: "math3_ch1",  chapterName: "Where to Look From",    subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch1_top_view","math3_ch1_front_view","math3_ch1_side_view","math3_ch1_mirror_images"] },
  { chapterId: "math3_ch2",  chapterName: "Fun with Numbers",       subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch2_three_digit_numbers","math3_ch2_place_value","math3_ch2_comparing_numbers","math3_ch2_expanded_form"] },
  { chapterId: "math3_ch3",  chapterName: "Give and Take",          subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch3_addition_3digit","math3_ch3_subtraction_3digit","math3_ch3_carrying","math3_ch3_borrowing"] },
  { chapterId: "math3_ch4",  chapterName: "Long and Short",         subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch4_units_cm_m","math3_ch4_measuring_length","math3_ch4_comparing_lengths","math3_ch4_estimating"] },
  { chapterId: "math3_ch5",  chapterName: "Shapes and Designs",     subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch5_2d_shapes","math3_ch5_3d_shapes","math3_ch5_tiling","math3_ch5_symmetry"] },
  { chapterId: "math3_ch6",  chapterName: "Fun with Give and Take", subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch6_word_problems_add","math3_ch6_word_problems_sub","math3_ch6_mental_math","math3_ch6_estimation"] },
  { chapterId: "math3_ch7",  chapterName: "Time Goes On",           subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch7_reading_clock","math3_ch7_am_pm","math3_ch7_calendar","math3_ch7_duration"] },
  { chapterId: "math3_ch8",  chapterName: "Who is Heavier?",        subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch8_heavier_lighter","math3_ch8_grams_kilograms","math3_ch8_balance_scale","math3_ch8_weight_word"] },
  { chapterId: "math3_ch9",  chapterName: "How Many Times?",        subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch9_repeated_addition","math3_ch9_times_tables","math3_ch9_multiplication_word","math3_ch9_arrays"] },
  { chapterId: "math3_ch10", chapterName: "Play with Patterns",     subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch10_number_patterns","math3_ch10_shape_patterns","math3_ch10_growing_patterns","math3_ch10_pattern_rules"] },
  { chapterId: "math3_ch11", chapterName: "Jugs and Mugs",          subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch11_ml_litres","math3_ch11_measuring_capacity","math3_ch11_comparing_capacity","math3_ch11_capacity_word"] },
  { chapterId: "math3_ch12", chapterName: "Can We Share?",          subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch12_sharing_equally","math3_ch12_division_facts","math3_ch12_remainders","math3_ch12_division_word"] },
  { chapterId: "math3_ch13", chapterName: "Smart Charts!",          subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch13_pictographs","math3_ch13_bar_graphs","math3_ch13_reading_charts","math3_ch13_data_collection"] },
  { chapterId: "math3_ch14", chapterName: "Rupees and Paise",       subject: "Mathematics", grade: "3", skipDiagram: true, expectedTopicIds: ["math3_ch14_rupees_paise","math3_ch14_money_conversion","math3_ch14_money_addition","math3_ch14_money_problems"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 4 (Math Magic, NCERT)
  // ══════════════════════════════════════════════════════
  { chapterId: "math4_ch1",  chapterName: "Building with Bricks",              subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch1_brick_patterns","math4_ch1_brick_walls","math4_ch1_top_views","math4_ch1_brick_designs"] },
  { chapterId: "math4_ch2",  chapterName: "Long and Short",                    subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch2_units_length","math4_ch2_cm_m_km","math4_ch2_measuring_distance","math4_ch2_comparing_long"] },
  { chapterId: "math4_ch3",  chapterName: "A Trip to Bhopal",                  subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch3_four_digit_numbers","math4_ch3_distances","math4_ch3_travel_problems","math4_ch3_place_value_thousands"] },
  { chapterId: "math4_ch4",  chapterName: "Tick-Tick-Tick",                    subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch4_reading_time","math4_ch4_24_hour_clock","math4_ch4_time_intervals","math4_ch4_calendar_year"] },
  { chapterId: "math4_ch5",  chapterName: "The Way The World Looks",           subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch5_top_view","math4_ch5_side_view","math4_ch5_maps","math4_ch5_directions"] },
  { chapterId: "math4_ch6",  chapterName: "The Junk Seller",                   subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch6_money_calculations","math4_ch6_buying_selling","math4_ch6_change_money","math4_ch6_money_word_problems"] },
  { chapterId: "math4_ch7",  chapterName: "Jugs and Mugs",                     subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch7_ml_l_conversion","math4_ch7_measuring_capacity","math4_ch7_comparing_capacity","math4_ch7_capacity_problems"] },
  { chapterId: "math4_ch8",  chapterName: "Carts and Wheels",                  subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch8_circles","math4_ch8_circle_parts","math4_ch8_circular_objects","math4_ch8_rotation"] },
  { chapterId: "math4_ch9",  chapterName: "Halves and Quarters",               subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch9_fractions_intro","math4_ch9_halves","math4_ch9_quarters","math4_ch9_fraction_word"] },
  { chapterId: "math4_ch10", chapterName: "Play with Patterns",                subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch10_number_patterns","math4_ch10_shape_patterns","math4_ch10_skipping_patterns","math4_ch10_pattern_rules"] },
  { chapterId: "math4_ch11", chapterName: "Tables and Shares",                 subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch11_times_tables","math4_ch11_division_tables","math4_ch11_sharing","math4_ch11_grouping"] },
  { chapterId: "math4_ch12", chapterName: "How Heavy? How Light?",             subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch12_weight_units","math4_ch12_grams_kilograms","math4_ch12_comparing_weights","math4_ch12_weight_problems"] },
  { chapterId: "math4_ch13", chapterName: "Fields and Fences",                 subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch13_perimeter_intro","math4_ch13_perimeter_shapes","math4_ch13_area_intro","math4_ch13_area_squares"] },
  { chapterId: "math4_ch14", chapterName: "Smart Charts",                      subject: "Mathematics", grade: "4", skipDiagram: true, expectedTopicIds: ["math4_ch14_pictographs","math4_ch14_bar_graphs","math4_ch14_reading_charts","math4_ch14_data_collection"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 5 (Maths Magic, NCERT)
  // ══════════════════════════════════════════════════════
  { chapterId: "math5_ch1",  chapterName: "The Fish Tale",                       subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch1_large_numbers","math5_ch1_weight_fish","math5_ch1_money_fish","math5_ch1_scale_distance"] },
  { chapterId: "math5_ch2",  chapterName: "Shapes and Angles",                   subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch2_angles_intro","math5_ch2_types_angles","math5_ch2_measuring_angles","math5_ch2_shapes_angles"] },
  { chapterId: "math5_ch3",  chapterName: "How Many Squares?",                   subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch3_area_grids","math5_ch3_area_rectangles","math5_ch3_area_irregular","math5_ch3_perimeter_area"] },
  { chapterId: "math5_ch4",  chapterName: "Parts and Wholes",                    subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch4_fractions_review","math5_ch4_equivalent_fractions","math5_ch4_comparing_fractions","math5_ch4_fraction_operations"] },
  { chapterId: "math5_ch5",  chapterName: "Does it Look the Same?",              subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch5_symmetry_intro","math5_ch5_line_symmetry","math5_ch5_rotational_symmetry","math5_ch5_symmetry_designs"] },
  { chapterId: "math5_ch6",  chapterName: "Be My Multiple, I'll Be Your Factor", subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch6_multiples","math5_ch6_factors","math5_ch6_common_multiples","math5_ch6_common_factors"] },
  { chapterId: "math5_ch7",  chapterName: "Can You See the Pattern?",            subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch7_number_patterns","math5_ch7_shape_patterns","math5_ch7_growing_patterns","math5_ch7_rotational_patterns"] },
  { chapterId: "math5_ch8",  chapterName: "Mapping Your Way",                    subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch8_maps_reading","math5_ch8_map_scale","math5_ch8_directions_compass","math5_ch8_route_planning"] },
  { chapterId: "math5_ch9",  chapterName: "Boxes and Sketches",                  subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch9_3d_shapes","math5_ch9_nets_cube","math5_ch9_views_objects","math5_ch9_building_models"] },
  { chapterId: "math5_ch10", chapterName: "Tenths and Hundredths",               subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch10_decimals_intro","math5_ch10_tenths","math5_ch10_hundredths","math5_ch10_decimal_operations"] },
  { chapterId: "math5_ch11", chapterName: "Area and Its Boundary",               subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch11_area_calculation","math5_ch11_perimeter_calculation","math5_ch11_area_vs_perimeter","math5_ch11_real_problems"] },
  { chapterId: "math5_ch12", chapterName: "Smart Charts",                        subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch12_tables_data","math5_ch12_bar_graphs","math5_ch12_pie_charts","math5_ch12_data_analysis"] },
  { chapterId: "math5_ch13", chapterName: "Ways to Multiply and Divide",         subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch13_multiplication_strategies","math5_ch13_long_division","math5_ch13_word_problems_mul","math5_ch13_word_problems_div"] },
  { chapterId: "math5_ch14", chapterName: "How Big? How Heavy?",                 subject: "Mathematics", grade: "5", skipDiagram: true, expectedTopicIds: ["math5_ch14_volume_intro","math5_ch14_weight_review","math5_ch14_capacity_review","math5_ch14_measurement_problems"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 6 (Ganita Prakash, NCERT 2026)
  // ══════════════════════════════════════════════════════
  { chapterId: "math6_ch1",  chapterName: "Patterns in Mathematics",       subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch1_number_patterns","math6_ch1_shape_patterns","math6_ch1_fibonacci","math6_ch1_pattern_rules"] },
  { chapterId: "math6_ch2",  chapterName: "Lines and Angles",               subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch2_lines_types","math6_ch2_angles_types","math6_ch2_parallel_perpendicular","math6_ch2_measuring_angles"] },
  { chapterId: "math6_ch3",  chapterName: "Number Play",                    subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch3_number_properties","math6_ch3_divisibility_rules","math6_ch3_factors_multiples","math6_ch3_number_games"] },
  { chapterId: "math6_ch4",  chapterName: "Data Handling and Presentation", subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch4_collecting_data","math6_ch4_bar_graphs","math6_ch4_pictographs","math6_ch4_data_interpretation"] },
  { chapterId: "math6_ch5",  chapterName: "Prime Time",                     subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch5_prime_numbers","math6_ch5_composite_numbers","math6_ch5_prime_factorization","math6_ch5_co_prime"] },
  { chapterId: "math6_ch6",  chapterName: "Perimeter and Area",             subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch6_perimeter_basics","math6_ch6_area_rectangles","math6_ch6_area_triangles","math6_ch6_real_problems"] },
  { chapterId: "math6_ch7",  chapterName: "Fractions",                      subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch7_fractions_review","math6_ch7_equivalent_fractions","math6_ch7_fraction_operations","math6_ch7_mixed_numbers"] },
  { chapterId: "math6_ch8",  chapterName: "Playing with Constructions",     subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch8_basic_constructions","math6_ch8_triangles_construction","math6_ch8_angle_bisector","math6_ch8_perpendicular_bisector"] },
  { chapterId: "math6_ch9",  chapterName: "Symmetry",                       subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch9_line_symmetry","math6_ch9_rotational_symmetry","math6_ch9_point_symmetry","math6_ch9_symmetric_shapes"] },
  { chapterId: "math6_ch10", chapterName: "The Other Side of Zero",         subject: "Mathematics", grade: "6", skipDiagram: true, expectedTopicIds: ["math6_ch10_negative_numbers","math6_ch10_number_line","math6_ch10_negative_operations","math6_ch10_real_world_negatives"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 7 (Ganita Prakash, NCERT 2026)
  // ══════════════════════════════════════════════════════
  { chapterId: "math7_ch1",  chapterName: "Large Numbers Around Us",           subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch1_lakhs_crores","math7_ch1_place_value","math7_ch1_comparing_large","math7_ch1_rounding"] },
  { chapterId: "math7_ch2",  chapterName: "Arithmetic Expressions",             subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch2_expressions_intro","math7_ch2_order_operations","math7_ch2_brackets","math7_ch2_evaluating"] },
  { chapterId: "math7_ch3",  chapterName: "A Peek Beyond the Point",            subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch3_decimals_review","math7_ch3_place_value_decimal","math7_ch3_comparing_decimals","math7_ch3_decimal_fractions"] },
  { chapterId: "math7_ch4",  chapterName: "Letter-Numbers",                     subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch4_variables_intro","math7_ch4_writing_expressions","math7_ch4_simple_equations","math7_ch4_substituting"] },
  { chapterId: "math7_ch5",  chapterName: "Parallel and Intersecting Lines",    subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch5_parallel_lines","math7_ch5_intersecting_lines","math7_ch5_angles_intersection","math7_ch5_transversal"] },
  { chapterId: "math7_ch6",  chapterName: "Number Play",                        subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch6_number_patterns","math7_ch6_magic_squares","math7_ch6_number_puzzles","math7_ch6_divisibility"] },
  { chapterId: "math7_ch7",  chapterName: "A Tale of Three Intersecting Lines", subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch7_triangle_basics","math7_ch7_angle_sum","math7_ch7_triangle_types","math7_ch7_triangle_properties"] },
  { chapterId: "math7_ch8",  chapterName: "Working with Fractions",             subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch8_fraction_operations","math7_ch8_mixed_numbers","math7_ch8_fraction_word","math7_ch8_fraction_decimal"] },
  { chapterId: "math7_ch9",  chapterName: "Geometric Twins",                   subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch9_congruence_intro","math7_ch9_congruent_triangles","math7_ch9_sss_sas","math7_ch9_real_congruence"] },
  { chapterId: "math7_ch10", chapterName: "Operations with Integers",           subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch10_integers_intro","math7_ch10_addition_subtraction","math7_ch10_multiplication","math7_ch10_division"] },
  { chapterId: "math7_ch11", chapterName: "Finding Common Ground",              subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch11_hcf","math7_ch11_lcm","math7_ch11_hcf_lcm_relation","math7_ch11_word_problems"] },
  { chapterId: "math7_ch12", chapterName: "Another Peek Beyond the Point",      subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch12_decimal_addition","math7_ch12_decimal_subtraction","math7_ch12_decimal_multiplication","math7_ch12_decimal_division"] },
  { chapterId: "math7_ch13", chapterName: "Connecting the Dots",                subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch13_collecting_data","math7_ch13_bar_graphs","math7_ch13_mean_median","math7_ch13_mode"] },
  { chapterId: "math7_ch14", chapterName: "Constructions and Tilings",          subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch14_construction_basics","math7_ch14_construction_triangles","math7_ch14_tilings","math7_ch14_tessellation"] },
  { chapterId: "math7_ch15", chapterName: "Finding the Unknown",                subject: "Mathematics", grade: "7", skipDiagram: true, expectedTopicIds: ["math7_ch15_equations_intro","math7_ch15_solving_simple","math7_ch15_word_problems","math7_ch15_balance_method"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 8 (Ganita Prakash, NCERT 2026)
  // ══════════════════════════════════════════════════════
  { chapterId: "math8_ch1",  chapterName: "A Square and A Cube",                      subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch1_squares","math8_ch1_cubes","math8_ch1_square_roots","math8_ch1_cube_roots"] },
  { chapterId: "math8_ch2",  chapterName: "Power Play",                               subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch2_exponents","math8_ch2_laws_exponents","math8_ch2_negative_powers","math8_ch2_scientific_notation"] },
  { chapterId: "math8_ch3",  chapterName: "A Story of Numbers",                       subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch3_number_history","math8_ch3_integers_review","math8_ch3_rational_numbers","math8_ch3_irrational_numbers"] },
  { chapterId: "math8_ch4",  chapterName: "Quadrilaterals",                           subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch4_quadrilateral_types","math8_ch4_quadrilateral_properties","math8_ch4_quadrilateral_angles","math8_ch4_parallelograms"] },
  { chapterId: "math8_ch5",  chapterName: "Number Play",                              subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch5_patterns","math8_ch5_primes_composites","math8_ch5_divisibility_rules","math8_ch5_magic_arithmetic"] },
  { chapterId: "math8_ch6",  chapterName: "We Distribute, Yet Things Multiply",       subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch6_distributive","math8_ch6_factorization","math8_ch6_like_terms","math8_ch6_simplification"] },
  { chapterId: "math8_ch7",  chapterName: "Proportional Reasoning - 1",              subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch7_ratios","math8_ch7_proportions","math8_ch7_unitary","math8_ch7_percentages"] },
  { chapterId: "math8_ch8",  chapterName: "Fractions in Disguise",                   subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch8_complex_fractions","math8_ch8_ratios_fractions","math8_ch8_fraction_division","math8_ch8_word_problems"] },
  { chapterId: "math8_ch9",  chapterName: "The Baudhayana-Pythagoras Theorem",        subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch9_right_triangle","math8_ch9_pythagoras_theorem","math8_ch9_pythagoras_applications","math8_ch9_pythagoras_distances"] },
  { chapterId: "math8_ch10", chapterName: "Proportional Reasoning - 2",              subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch10_more_proportions","math8_ch10_scale","math8_ch10_similar_shapes","math8_ch10_direct_inverse"] },
  { chapterId: "math8_ch11", chapterName: "Exploring Some Geometric Themes",         subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch11_angles_polygons","math8_ch11_polygons_types","math8_ch11_symmetry_review","math8_ch11_transformations"] },
  { chapterId: "math8_ch12", chapterName: "Tales by Dots and Lines",                 subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch12_graph_theory_intro","math8_ch12_paths","math8_ch12_euler","math8_ch12_trees"] },
  { chapterId: "math8_ch13", chapterName: "Algebra Play",                            subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch13_expressions","math8_ch13_equations","math8_ch13_inequalities","math8_ch13_identities"] },
  { chapterId: "math8_ch14", chapterName: "Area",                                    subject: "Mathematics", grade: "8", skipDiagram: true, expectedTopicIds: ["math8_ch14_rectangle_area","math8_ch14_triangle_area","math8_ch14_trapezium_area","math8_ch14_circle_area"] },

  // ══════════════════════════════════════════════════════
  // MATHEMATICS — Class 9 v2 (Ganita Manjari, NCERT 2026) — sub-topic expansion
  // 4 sub-topics per chapter × 8 chapters = 32 topics, ~256 questions
  // ══════════════════════════════════════════════════════
  { chapterId: "math9_ch1", chapterName: "Orienting Yourself: The Use of Coordinates",            subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch1_cartesian_plane","math9_ch1_plotting_points","math9_ch1_distance_formula","math9_ch1_section_formula"] },
  { chapterId: "math9_ch2", chapterName: "Introduction to Linear Polynomials",                     subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch2_poly_basics","math9_ch2_zeroes","math9_ch2_remainder_theorem","math9_ch2_factor_theorem"] },
  { chapterId: "math9_ch3", chapterName: "The World of Numbers",                                   subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch3_number_systems","math9_ch3_irrational_representation","math9_ch3_surds_rationalisation","math9_ch3_laws_of_exponents"] },
  { chapterId: "math9_ch4", chapterName: "Exploring Algebraic Identities",                         subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch4_standard_identities","math9_ch4_expansion","math9_ch4_factorisation_identities","math9_ch4_applications"] },
  { chapterId: "math9_ch5", chapterName: "I'm Up and Down, and Round and Round",                  subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch5_basic_properties","math9_ch5_angles_in_circle","math9_ch5_cyclic_quadrilateral","math9_ch5_tangents"] },
  { chapterId: "math9_ch6", chapterName: "Measuring Space: Perimeter and Area",                   subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch6_heron_formula","math9_ch6_quadrilateral_area","math9_ch6_surface_area","math9_ch6_volume"] },
  { chapterId: "math9_ch7", chapterName: "The Mathematics of Maybe: Introduction to Probability", subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch7_probability_basics","math9_ch7_experimental_theoretical","math9_ch7_sample_space_events","math9_ch7_probability_rules"] },
  { chapterId: "math9_ch8", chapterName: "Predicting What Comes Next: Exploring Sequences",       subject: "Mathematics", grade: "9", skipDiagram: true, expectedTopicIds: ["math9_ch8_sequences_intro","math9_ch8_ap_basics","math9_ch8_nth_term","math9_ch8_sum_of_ap"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function colGreen(s)  { return `\x1b[32m${s}\x1b[0m`; }
function colRed(s)    { return `\x1b[31m${s}\x1b[0m`; }
function colYellow(s) { return `\x1b[33m${s}\x1b[0m`; }
function colBold(s)   { return `\x1b[1m${s}\x1b[0m`; }
function colDim(s)    { return `\x1b[2m${s}\x1b[0m`; }

function pad(s, n) { return String(s).padEnd(n); }
function center(s, n) { const p = Math.max(0, n - String(s).length); return " ".repeat(Math.floor(p/2)) + s + " ".repeat(Math.ceil(p/2)); }

// ─── Read DIAGRAM_MAP from DiagramLibrary.jsx ────────────────────────────────

async function getDiagramTopicIds() {
  const filePath = path.resolve(__dirname, "../../../ai-learning-frontend/frontend/src/components/DiagramLibrary.jsx");
  try {
    const content = await readFile(filePath, "utf-8");
    const matches = [...content.matchAll(/^\s+(sci_\w+|sst_\w+|ch\d+[\w_]+):\s*\{/gm)];
    return new Set(matches.map(m => m[1].trim()));
  } catch {
    return new Set();
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });

const { NcertTopicContent } = await import("../models/ncertTopicContentModel.js");
const db = mongoose.connection.db;

// Fetch all topic content
const allTopics = await NcertTopicContent.find({}, { topicId: 1, name: 1, subject: 1, _id: 0 }).lean();
const topicMap  = new Map(allTopics.map(t => [t.topicId, t]));

// Fetch question counts per topicId
const qDocs = await db.collection("questions").find({}, { projection: { topic_ids: 1, topicId: 1 } }).toArray();
const qCount = {};
for (const doc of qDocs) {
  const ids = doc.topic_ids || (doc.topicId ? [doc.topicId] : []);
  for (const id of ids) { qCount[id] = (qCount[id] || 0) + 1; }
}

// Fetch diagram coverage
const diagramIds = await getDiagramTopicIds();

await mongoose.disconnect();

// Filter by subject if requested
const chapters = filterSubject
  ? EXPECTED.filter(c => c.subject.toLowerCase().includes(filterSubject.toLowerCase()))
  : EXPECTED;

if (chapters.length === 0) {
  console.log(colRed(`No chapters found for subject "${filterSubject}". Available: Science, Mathematics, Social Science, English, Hindi`));
  process.exit(1);
}

// ─── Output ──────────────────────────────────────────────────────────────────

const subjects = [...new Set(chapters.map(c => `${c.subject} Grade ${c.grade}`))];

for (const subjectGrade of subjects) {
  const subjectChapters = chapters.filter(c => `${c.subject} Grade ${c.grade}` === subjectGrade);

  console.log("\n" + "═".repeat(90));
  console.log(colBold(` ${subjectGrade} — Coverage Audit`));
  console.log("═".repeat(90));
  console.log(
    colBold(pad("Chapter", 38)) +
    colBold(center("NCERT", 8)) +
    colBold(center("In DB", 8)) +
    colBold(center("Missing", 9)) +
    colBold(center("Qs", 6)) +
    colBold(center("Diagrams", 10))
  );
  console.log("─".repeat(90));

  let totalExpected = 0, totalInDb = 0, totalMissing = 0, totalQs = 0, totalDiag = 0;
  const allMissingTopics = [];

  for (const ch of subjectChapters) {
    const expected  = ch.expectedTopicIds.length;
    const inDb      = ch.expectedTopicIds.filter(id => topicMap.has(id)).length;
    const missing   = expected - inDb;
    const missingIds = ch.expectedTopicIds.filter(id => !topicMap.has(id));
    const totalQsForChapter = ch.expectedTopicIds.reduce((s, id) => s + (qCount[id] || 0), 0);
    const noDiagram = ch.skipDiagram === true;
    const diagCount = noDiagram ? expected : ch.expectedTopicIds.filter(id => diagramIds.has(id)).length;

    totalExpected += expected;
    totalInDb     += inDb;
    totalMissing  += missing;
    totalQs       += totalQsForChapter;
    totalDiag     += diagCount;
    if (missingIds.length) allMissingTopics.push(...missingIds.map(id => ({ chapter: ch.chapterName, id })));

    const missingOk  = missing === 0;
    const qOk        = totalQsForChapter >= expected * 4;
    const diagOk     = diagCount === expected;
    const missingStr = missingOk ? colGreen(center("0", 9)) : colRed(center(String(missing), 9));
    const qStr       = qOk ? colGreen(center(String(totalQsForChapter), 6)) : colYellow(center(String(totalQsForChapter), 6));
    const diagStr    = noDiagram
      ? colGreen(center("N/A", 10))
      : (diagOk ? colGreen(center(`${diagCount}/${expected}`, 10)) : colRed(center(`${diagCount}/${expected}`, 10)));

    if (!missingOnly || missing > 0 || !qOk || !diagOk) {
      console.log(
        pad(ch.chapterName.slice(0, 37), 38) +
        center(String(expected), 8) +
        (inDb === expected ? colGreen(center(String(inDb), 8)) : colRed(center(String(inDb), 8))) +
        missingStr + qStr + diagStr
      );
    }

    if (showDetail && !missingOnly) {
      for (const id of ch.expectedTopicIds) {
        const exists = topicMap.has(id);
        const q      = qCount[id] || 0;
        const diag   = diagramIds.has(id);
        const status = exists ? colGreen("✓") : colRed("✗");
        const qMark  = q >= 4 ? colGreen(`${q}q`) : colRed(`${q}q`);
        const dMark  = ch.skipDiagram ? colGreen("N/A") : (diag ? colGreen("📊") : colRed("no diagram"));
        console.log(colDim(`    ${status} ${pad(id, 45)} ${qMark}  ${dMark}`));
      }
    }
  }

  console.log("─".repeat(90));
  const allOk = totalMissing === 0 && totalDiag === totalExpected;
  console.log(
    colBold(pad("TOTAL", 38)) +
    colBold(center(String(totalExpected), 8)) +
    colBold(totalInDb === totalExpected ? colGreen(center(String(totalInDb), 8)) : colRed(center(String(totalInDb), 8))) +
    colBold(totalMissing === 0 ? colGreen(center("0", 9)) : colRed(center(String(totalMissing), 9))) +
    colBold(center(String(totalQs), 6)) +
    colBold(totalDiag === totalExpected ? colGreen(center(`${totalDiag}/${totalExpected}`, 10)) : colRed(center(`${totalDiag}/${totalExpected}`, 10)))
  );

  if (allMissingTopics.length > 0) {
    console.log("\n" + colRed(colBold("  MISSING TOPICS:")));
    for (const { chapter, id } of allMissingTopics) {
      console.log(colRed(`    ✗ ${id}`) + colDim(`  (${chapter})`));
    }
  }

  // Summary verdict
  console.log();
  if (totalMissing === 0 && totalDiag === totalExpected && totalQs >= totalExpected * 4) {
    console.log(colGreen(colBold("  ✅ FULLY COVERED — all topics present, all diagrams, sufficient questions.")));
  } else {
    const issues = [];
    if (totalMissing > 0) issues.push(colRed(`${totalMissing} teaching content topics missing`));
    if (totalDiag < totalExpected) issues.push(colRed(`${totalExpected - totalDiag} diagrams missing`));
    if (totalQs < totalExpected * 4) issues.push(colYellow(`questions low (${totalQs} total, target ≥${totalExpected * 4})`));
    console.log(colYellow(colBold(`  ⚠  GAPS FOUND: ${issues.join(", ")}`)));
  }
}

console.log("\n" + colDim("Tip: node config/auditCoverage.mjs Science --detail      → per-topic breakdown"));
console.log(colDim("     node config/auditCoverage.mjs Science --missing-only → gaps only\n"));
