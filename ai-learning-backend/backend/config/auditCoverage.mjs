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
  console.log(colRed(`No chapters found for subject "${filterSubject}". Available: Science, Mathematics, Social Science, English`));
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
