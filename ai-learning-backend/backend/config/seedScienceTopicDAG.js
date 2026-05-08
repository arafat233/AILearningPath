/**
 * Seed: Science Topic DAG — 50 nodes (prerequisite graph)
 * Covers all 13 CBSE Class 10 Science chapters (Chemistry Ch1-4, Biology Ch5-8+13, Physics Ch9-12)
 *
 * Each node stores:
 *   - topicId  — machine key matching NcertTopicContent and question topicIds
 *   - name     — human-readable topic name
 *   - level    — DAG depth (0 = no prerequisites)
 *   - prerequisites — array of topicId strings that must be mastered first
 *   - subject  — "Science"
 *   - grade    — "10"
 *
 * Safe to re-run — upserts on { topicId }.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedScienceTopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

const TOPICS = {
  // ─────────────────────────── CHEMISTRY (Ch 1-4) ──────────────────────────────

  // Chapter 1: Chemical Reactions and Equations
  sci_ch1_signs_and_types: {
    name: "Signs and Types of Chemical Reactions",
    level: 0,
    prerequisites: [],
  },
  sci_ch1_balancing_equations: {
    name: "Balancing Chemical Equations",
    level: 1,
    prerequisites: ["sci_ch1_signs_and_types"],
  },
  sci_ch1_thermal_decomposition: {
    name: "Thermal, Electrolytic and Photolytic Decomposition",
    level: 1,
    prerequisites: ["sci_ch1_signs_and_types"],
  },
  sci_ch1_oxidation_reduction: {
    name: "Oxidation, Reduction and Redox Reactions",
    level: 2,
    prerequisites: ["sci_ch1_balancing_equations", "sci_ch1_signs_and_types"],
  },

  // Chapter 2: Acids, Bases and Salts
  sci_ch2_acids_bases_indicators: {
    name: "Acids, Bases and Indicators",
    level: 0,
    prerequisites: [],
  },
  sci_ch2_ph_scale: {
    name: "pH Scale and Universal Indicator",
    level: 1,
    prerequisites: ["sci_ch2_acids_bases_indicators"],
  },
  sci_ch2_acids_reactions: {
    name: "Reactions of Acids and Bases",
    level: 2,
    prerequisites: ["sci_ch2_acids_bases_indicators", "sci_ch1_signs_and_types"],
  },
  sci_ch2_salts: {
    name: "Important Salts and their Preparation",
    level: 2,
    prerequisites: ["sci_ch2_acids_reactions", "sci_ch1_balancing_equations"],
  },

  // Chapter 3: Metals and Non-metals
  sci_ch3_physical_properties: {
    name: "Physical Properties of Metals and Non-metals",
    level: 0,
    prerequisites: [],
  },
  sci_ch3_reactivity_series: {
    name: "Reactivity Series and Displacement Reactions",
    level: 2,
    prerequisites: ["sci_ch3_physical_properties", "sci_ch2_acids_reactions"],
  },
  sci_ch3_ionic_bonding: {
    name: "Ionic Bonding and Ionic Compounds",
    level: 1,
    prerequisites: ["sci_ch3_physical_properties"],
  },
  sci_ch3_extraction_metallurgy: {
    name: "Occurrence and Extraction of Metals",
    level: 3,
    prerequisites: [
      "sci_ch3_reactivity_series",
      "sci_ch3_ionic_bonding",
      "sci_ch1_oxidation_reduction",
    ],
  },

  // Chapter 4: Carbon and its Compounds
  sci_ch4_covalent_bonding: {
    name: "Covalent Bonding and Carbon",
    level: 1,
    prerequisites: ["sci_ch3_ionic_bonding"],
  },
  sci_ch4_homologous_series: {
    name: "Homologous Series and Functional Groups",
    level: 2,
    prerequisites: ["sci_ch4_covalent_bonding"],
  },
  sci_ch4_carbon_reactions: {
    name: "Chemical Reactions of Carbon Compounds",
    level: 2,
    prerequisites: ["sci_ch4_homologous_series", "sci_ch1_signs_and_types"],
  },
  sci_ch4_ethanol_and_ethanoic_acid: {
    name: "Ethanol, Ethanoic Acid and Soaps",
    level: 3,
    prerequisites: ["sci_ch4_carbon_reactions", "sci_ch4_homologous_series"],
  },

  // ─────────────────────────── BIOLOGY (Ch 5-8, 13) ────────────────────────────

  // Chapter 5: Life Processes
  sci_ch5_photosynthesis: {
    name: "Photosynthesis",
    level: 0,
    prerequisites: [],
  },
  sci_ch5_human_digestion: {
    name: "Human Digestive System",
    level: 0,
    prerequisites: [],
  },
  sci_ch5_respiration: {
    name: "Aerobic and Anaerobic Respiration",
    level: 1,
    prerequisites: ["sci_ch5_photosynthesis"],
  },
  sci_ch5_transport_blood: {
    name: "Transportation — Blood and Circulatory System",
    level: 1,
    prerequisites: ["sci_ch5_respiration"],
  },
  sci_ch5_transport_plants: {
    name: "Transportation in Plants — Xylem and Phloem",
    level: 1,
    prerequisites: ["sci_ch5_photosynthesis"],
  },
  sci_ch5_excretion: {
    name: "Excretion and the Nephron",
    level: 2,
    prerequisites: ["sci_ch5_transport_blood"],
  },

  // Chapter 6: Control and Coordination
  sci_ch6_nervous_system: {
    name: "Nervous System and Neuron",
    level: 0,
    prerequisites: [],
  },
  sci_ch6_reflex_arc: {
    name: "Reflex Arc and Reflex Actions",
    level: 1,
    prerequisites: ["sci_ch6_nervous_system"],
  },
  sci_ch6_brain: {
    name: "Human Brain — Forebrain, Midbrain, Hindbrain",
    level: 1,
    prerequisites: ["sci_ch6_nervous_system"],
  },
  sci_ch6_plant_hormones: {
    name: "Plant Hormones and Tropic Movements",
    level: 0,
    prerequisites: [],
  },

  // Chapter 7: How do Organisms Reproduce?
  sci_ch7_asexual_reproduction: {
    name: "Asexual Reproduction",
    level: 0,
    prerequisites: [],
  },
  sci_ch7_sexual_reproduction_plants: {
    name: "Sexual Reproduction in Flowering Plants",
    level: 0,
    prerequisites: [],
  },
  sci_ch7_human_reproduction: {
    name: "Human Reproductive System",
    level: 1,
    prerequisites: ["sci_ch7_asexual_reproduction"],
  },

  // Chapter 8: Heredity
  sci_ch8_mendels_laws: {
    name: "Mendel's Laws of Heredity",
    level: 1,
    prerequisites: ["sci_ch7_human_reproduction"],
  },
  sci_ch8_sex_determination: {
    name: "Sex Determination in Humans",
    level: 2,
    prerequisites: ["sci_ch8_mendels_laws"],
  },

  // Chapter 13: Our Environment
  sci_ch13_ecosystem: {
    name: "Ecosystem — Biotic and Abiotic",
    level: 0,
    prerequisites: [],
  },
  sci_ch13_energy_flow: {
    name: "Food Chains, Food Webs and Energy Flow",
    level: 1,
    prerequisites: ["sci_ch13_ecosystem"],
  },
  sci_ch13_biodegradability: {
    name: "Biodegradable and Non-biodegradable Waste",
    level: 1,
    prerequisites: ["sci_ch13_ecosystem"],
  },
  sci_ch13_ozone: {
    name: "Ozone Layer and Environmental Impacts",
    level: 0,
    prerequisites: [],
  },

  // ─────────────────────────── PHYSICS (Ch 9-12) ───────────────────────────────

  // Chapter 9: Light — Reflection and Refraction
  sci_ch9_reflection_mirrors: {
    name: "Reflection and Spherical Mirrors",
    level: 0,
    prerequisites: [],
  },
  sci_ch9_mirror_formula: {
    name: "Mirror Formula and Magnification",
    level: 1,
    prerequisites: ["sci_ch9_reflection_mirrors"],
  },
  sci_ch9_refraction_snells_law: {
    name: "Refraction and Snell's Law",
    level: 1,
    prerequisites: ["sci_ch9_reflection_mirrors"],
  },
  sci_ch9_lenses: {
    name: "Refraction through Lenses — Formula and Power",
    level: 2,
    prerequisites: ["sci_ch9_refraction_snells_law"],
  },

  // Chapter 10: The Human Eye
  sci_ch10_human_eye: {
    name: "Structure and Working of the Human Eye",
    level: 3,
    prerequisites: ["sci_ch9_lenses"],
  },
  sci_ch10_eye_defects: {
    name: "Defects of Vision and Correction",
    level: 4,
    prerequisites: ["sci_ch10_human_eye", "sci_ch9_lenses"],
  },
  sci_ch10_dispersion_scattering: {
    name: "Dispersion, Scattering and Atmospheric Phenomena",
    level: 2,
    prerequisites: ["sci_ch9_refraction_snells_law"],
  },

  // Chapter 11: Electricity
  sci_ch11_current_potential: {
    name: "Electric Current, Charge and Potential Difference",
    level: 0,
    prerequisites: [],
  },
  sci_ch11_ohms_law_resistance: {
    name: "Ohm's Law and Resistance",
    level: 1,
    prerequisites: ["sci_ch11_current_potential"],
  },
  sci_ch11_series_parallel: {
    name: "Resistors in Series and Parallel",
    level: 2,
    prerequisites: ["sci_ch11_ohms_law_resistance"],
  },
  sci_ch11_power_heating: {
    name: "Electric Power and Joule's Heating Effect",
    level: 3,
    prerequisites: ["sci_ch11_series_parallel", "sci_ch11_ohms_law_resistance"],
  },

  // Chapter 12: Magnetic Effects of Electric Current
  sci_ch12_magnetic_field: {
    name: "Magnetic Field due to Current",
    level: 1,
    prerequisites: ["sci_ch11_current_potential"],
  },
  sci_ch12_force_on_conductor: {
    name: "Force on Current-Carrying Conductor",
    level: 2,
    prerequisites: ["sci_ch12_magnetic_field"],
  },
  sci_ch12_electric_motor: {
    name: "Electric Motor",
    level: 3,
    prerequisites: ["sci_ch12_force_on_conductor"],
  },
  sci_ch12_electromagnetic_induction: {
    name: "Electromagnetic Induction and Generator",
    level: 3,
    prerequisites: ["sci_ch12_magnetic_field", "sci_ch11_current_potential"],
  },
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("MongoDB connected");

  const ops = Object.entries(TOPICS).map(([topicId, data]) => ({
    updateOne: {
      filter: { topicId },
      update: {
        $setOnInsert: {
          topicId,
          name:          data.name,
          prerequisites: data.prerequisites,
          level:         data.level,
          subject:       "Science",
          grade:         "10",
        },
      },
      upsert: true,
    },
  }));

  const result   = await Topic.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount ?? 0;
  const skipped  = ops.length - inserted;

  console.log(`Science Topic DAG: +${inserted} inserted, ${skipped} already existed (${ops.length} total nodes)`);

  // Print level distribution
  const byLevel = Object.values(TOPICS).reduce((acc, t) => {
    acc[t.level] = (acc[t.level] || 0) + 1;
    return acc;
  }, {});
  console.log("Nodes by level:", Object.entries(byLevel).map(([l, c]) => `L${l}:${c}`).join(" "));

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
