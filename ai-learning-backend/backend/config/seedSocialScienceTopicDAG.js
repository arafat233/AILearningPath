/**
 * Seed: Social Science Topic DAG — 55 nodes (prerequisite graph)
 * Covers CBSE Class 10 SST: History (Ch1–5), Geography (Ch6–12),
 * Economics (Ch13–17), Political Science (Ch18–22)
 *
 * Safe to re-run — upserts on { topicId } using $setOnInsert.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedSocialScienceTopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

const TOPICS = {
  // ─────────────────────────── HISTORY (Ch 1–5) ────────────────────────────

  // Chapter 1: The Rise of Nationalism in Europe
  sst_ch1_french_revolution: {
    name: "French Revolution and the Idea of the Nation",
    level: 0,
    prerequisites: [],
  },
  sst_ch1_nationalism_europe: {
    name: "Nationalism in Europe — Romanticism and Revolutions",
    level: 1,
    prerequisites: ["sst_ch1_french_revolution"],
  },
  sst_ch1_german_unification: {
    name: "German and Italian Unification",
    level: 2,
    prerequisites: ["sst_ch1_nationalism_europe"],
  },

  // Chapter 2: Nationalism in India
  sst_ch2_non_cooperation: {
    name: "Non-Cooperation Movement 1920–22",
    level: 0,
    prerequisites: [],
  },
  sst_ch2_civil_disobedience: {
    name: "Civil Disobedience Movement and Salt March",
    level: 1,
    prerequisites: ["sst_ch2_non_cooperation"],
  },
  sst_ch2_quit_india: {
    name: "Quit India Movement 1942",
    level: 2,
    prerequisites: ["sst_ch2_civil_disobedience"],
  },

  // Chapter 3: The Making of a Global World (mapped as print culture in this pipeline)
  sst_ch3_print_culture: {
    name: "Print Culture — Gutenberg to the Press",
    level: 0,
    prerequisites: [],
  },
  sst_ch3_novel: {
    name: "Rise of the Novel and Print Capitalism",
    level: 1,
    prerequisites: ["sst_ch3_print_culture"],
  },

  // Chapter 4: The Age of Industrialisation
  sst_ch4_industrialisation: {
    name: "Proto-industrialisation and Factory System",
    level: 0,
    prerequisites: [],
  },
  sst_ch4_working_conditions: {
    name: "Workers, Wages and Working Conditions",
    level: 1,
    prerequisites: ["sst_ch4_industrialisation"],
  },

  // Chapter 5: Print Culture and the Modern World (mapped as urbanisation)
  sst_ch5_urbanisation: {
    name: "Urbanisation — London, Paris and Bombay",
    level: 1,
    prerequisites: ["sst_ch4_industrialisation"],
  },
  sst_ch5_social_changes: {
    name: "Social Change — Housing, Health and Gender",
    level: 2,
    prerequisites: ["sst_ch5_urbanisation", "sst_ch4_working_conditions"],
  },

  // ─────────────────────────── GEOGRAPHY (Ch 6–12) ─────────────────────────

  // Chapter 6: Resources and Development
  sst_ch6_resources_types: {
    name: "Types of Resources — Natural, Human, Man-made",
    level: 0,
    prerequisites: [],
  },
  sst_ch6_land_resources: {
    name: "Land Use Pattern and Degradation",
    level: 1,
    prerequisites: ["sst_ch6_resources_types"],
  },
  sst_ch6_soil_resources: {
    name: "Soil Types and Conservation",
    level: 1,
    prerequisites: ["sst_ch6_resources_types"],
  },

  // Chapter 7: Forest and Wildlife Resources
  sst_ch7_forest_types: {
    name: "Forest Cover — Types and Depletion",
    level: 1,
    prerequisites: ["sst_ch6_resources_types"],
  },
  sst_ch7_wildlife_conservation: {
    name: "Wildlife Conservation — Biosphere Reserves and National Parks",
    level: 2,
    prerequisites: ["sst_ch7_forest_types"],
  },

  // Chapter 8: Water Resources
  sst_ch8_water_resources: {
    name: "Fresh Water Resources and Scarcity",
    level: 1,
    prerequisites: ["sst_ch6_resources_types"],
  },
  sst_ch8_multipurpose_projects: {
    name: "Multipurpose River Projects — Dams and Controversies",
    level: 2,
    prerequisites: ["sst_ch8_water_resources"],
  },

  // Chapter 9: Agriculture
  sst_ch9_agriculture_types: {
    name: "Types of Farming — Subsistence to Commercial",
    level: 2,
    prerequisites: ["sst_ch6_land_resources", "sst_ch8_water_resources"],
  },
  sst_ch9_major_crops: {
    name: "Major Crops of India — Rice, Wheat, Cotton, Jute",
    level: 3,
    prerequisites: ["sst_ch9_agriculture_types"],
  },

  // Chapter 10: Minerals and Energy Resources
  sst_ch10_minerals_types: {
    name: "Minerals — Types, Distribution and Mining",
    level: 0,
    prerequisites: [],
  },
  sst_ch10_energy_resources: {
    name: "Conventional and Non-conventional Energy Sources",
    level: 1,
    prerequisites: ["sst_ch10_minerals_types"],
  },

  // Chapter 11: Manufacturing Industries
  sst_ch11_industries_types: {
    name: "Types of Industries — Large, Small, Agro-based",
    level: 2,
    prerequisites: ["sst_ch10_minerals_types", "sst_ch10_energy_resources"],
  },
  sst_ch11_textile_industry: {
    name: "Textile Industry — Cotton and Jute",
    level: 3,
    prerequisites: ["sst_ch11_industries_types"],
  },
  sst_ch11_environment: {
    name: "Industrial Pollution and Environmental Degradation",
    level: 3,
    prerequisites: ["sst_ch11_industries_types"],
  },

  // Chapter 12: Lifelines of National Economy
  sst_ch12_transport: {
    name: "Transport — Roads, Railways, Waterways, Airways",
    level: 0,
    prerequisites: [],
  },
  sst_ch12_communication: {
    name: "Communication — Mass Media and Telecom",
    level: 1,
    prerequisites: ["sst_ch12_transport"],
  },
  sst_ch12_international_trade: {
    name: "India's Foreign Trade — Exports, Imports, Ports",
    level: 2,
    prerequisites: ["sst_ch12_transport", "sst_ch11_industries_types"],
  },

  // ─────────────────────────── ECONOMICS (Ch 13–17) ────────────────────────

  // Chapter 13: Development
  sst_ch13_development_goals: {
    name: "Development — Goals and Per Capita Income",
    level: 0,
    prerequisites: [],
  },
  sst_ch13_hdi: {
    name: "Human Development Index — Income, Education and Health",
    level: 1,
    prerequisites: ["sst_ch13_development_goals"],
  },

  // Chapter 14: Sectors of the Indian Economy
  sst_ch14_sectors: {
    name: "Three Sectors — Primary, Secondary, Tertiary",
    level: 0,
    prerequisites: [],
  },
  sst_ch14_employment: {
    name: "Organised vs Unorganised Sector Employment",
    level: 1,
    prerequisites: ["sst_ch14_sectors"],
  },
  sst_ch14_services_sector: {
    name: "Growth of the Services Sector and GDP",
    level: 2,
    prerequisites: ["sst_ch14_employment", "sst_ch14_sectors"],
  },

  // Chapter 15: Money and Credit
  sst_ch15_money: {
    name: "From Barter to Modern Money",
    level: 0,
    prerequisites: [],
  },
  sst_ch15_banking: {
    name: "Banking — Credit Creation and RBI Regulation",
    level: 1,
    prerequisites: ["sst_ch15_money"],
  },
  sst_ch15_credit: {
    name: "Formal vs Informal Credit Sources",
    level: 2,
    prerequisites: ["sst_ch15_banking"],
  },

  // Chapter 16: Globalisation and the Indian Economy
  sst_ch16_globalisation: {
    name: "Globalisation — MNCs and Global Production",
    level: 2,
    prerequisites: ["sst_ch13_development_goals", "sst_ch14_sectors"],
  },
  sst_ch16_impact: {
    name: "India 1991 LPG Reforms — Impact of Liberalisation",
    level: 3,
    prerequisites: ["sst_ch16_globalisation"],
  },
  sst_ch16_fair_globalisation: {
    name: "WTO, Trade Barriers and Fair Globalisation",
    level: 4,
    prerequisites: ["sst_ch16_globalisation", "sst_ch16_impact"],
  },

  // Chapter 17: Consumer Rights
  sst_ch17_consumer_awareness: {
    name: "Consumer Exploitation and COPRA 1986",
    level: 2,
    prerequisites: ["sst_ch13_development_goals"],
  },
  sst_ch17_consumer_rights: {
    name: "Six Consumer Rights",
    level: 3,
    prerequisites: ["sst_ch17_consumer_awareness"],
  },
  sst_ch17_consumer_protection: {
    name: "3-tier Consumer Redressal Forum",
    level: 4,
    prerequisites: ["sst_ch17_consumer_rights"],
  },

  // ─────────────────────────── POLITICAL SCIENCE (Ch 18–22) ─────────────────

  // Chapter 18: Power Sharing
  sst_ch18_power_sharing: {
    name: "Belgium vs Sri Lanka — Power Sharing Case Studies",
    level: 0,
    prerequisites: [],
  },
  sst_ch18_forms: {
    name: "Four Forms of Power Sharing",
    level: 1,
    prerequisites: ["sst_ch18_power_sharing"],
  },

  // Chapter 19: Federalism
  sst_ch19_federalism: {
    name: "Federalism — Union, State and Concurrent Lists",
    level: 1,
    prerequisites: ["sst_ch18_power_sharing"],
  },
  sst_ch19_how_it_works: {
    name: "India's Federal Structure — Holding Together",
    level: 2,
    prerequisites: ["sst_ch19_federalism"],
  },
  sst_ch19_decentralisation: {
    name: "73rd/74th Amendment — 3-tier Panchayati Raj",
    level: 3,
    prerequisites: ["sst_ch19_how_it_works"],
  },

  // Chapter 20: Gender, Religion and Caste
  sst_ch20_social_differences: {
    name: "Overlapping vs Cross-cutting Social Divisions",
    level: 0,
    prerequisites: [],
  },
  sst_ch20_politics_division: {
    name: "Three Factors — Outcomes of Social Division in Politics",
    level: 1,
    prerequisites: ["sst_ch20_social_differences"],
  },

  // Chapter 21: Popular Struggles and Movements
  sst_ch21_gender: {
    name: "Gender Division — Patriarchy and Women in Politics",
    level: 1,
    prerequisites: ["sst_ch20_social_differences"],
  },
  sst_ch21_religion_politics: {
    name: "Secularism vs Communalism",
    level: 1,
    prerequisites: ["sst_ch20_social_differences"],
  },
  sst_ch21_caste: {
    name: "Caste and OBC Reservations — Mandal Commission",
    level: 2,
    prerequisites: ["sst_ch20_social_differences", "sst_ch20_politics_division"],
  },

  // Chapter 22: Political Parties
  sst_ch22_struggles: {
    name: "Bolivia Water War 2000 — Popular Struggles",
    level: 2,
    prerequisites: ["sst_ch18_forms", "sst_ch20_politics_division"],
  },
  sst_ch22_movements: {
    name: "Pressure Groups vs Political Parties",
    level: 3,
    prerequisites: ["sst_ch22_struggles"],
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
          subject:       "Social Science",
          grade:         "10",
        },
      },
      upsert: true,
    },
  }));

  const result   = await Topic.bulkWrite(ops, { ordered: false });
  const inserted = result.upsertedCount ?? 0;
  const skipped  = ops.length - inserted;

  console.log(`Social Science Topic DAG: +${inserted} inserted, ${skipped} already existed (${ops.length} total nodes)`);

  const byLevel = Object.values(TOPICS).reduce((acc, t) => {
    acc[t.level] = (acc[t.level] || 0) + 1;
    return acc;
  }, {});
  console.log("Nodes by level:", Object.entries(byLevel).map(([l, c]) => `L${l}:${c}`).join(" "));

  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
