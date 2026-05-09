/**
 * Seed: CBSE Class 10 English — Topic DAG (35 nodes)
 * Upserts into Topic collection with prerequisite graph (levels 0-4)
 * Safe to re-run — upserts on { topicId }
 * Usage: node config/seedEnglishTopicDAG.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";

const ENG_TOPICS = {
  // ── First Flight Prose ──────────────────────────────────────────────────
  eng_ff_ch1_prose: {
    name: "A Letter to God — Faith, Irony, and Human Goodness",
    level: 0,
    prerequisites: [],
  },
  eng_ff_ch2_prose: {
    name: "Nelson Mandela: Long Walk to Freedom — Courage and Liberation",
    level: 0,
    prerequisites: [],
  },
  eng_ff_ch3_prose: {
    name: "Two Stories about Flying — Overcoming Fear and Mystery",
    level: 1,
    prerequisites: ["eng_ff_ch1_prose"],
  },
  eng_ff_ch4_prose: {
    name: "From the Diary of Anne Frank — Identity, Friendship, and Resilience",
    level: 1,
    prerequisites: ["eng_ff_ch2_prose"],
  },
  eng_ff_ch5_prose: {
    name: "Glimpses of India — Cultural Diversity and Regional Identity",
    level: 1,
    prerequisites: ["eng_ff_ch1_prose"],
  },
  eng_ff_ch6_prose: {
    name: "Mijbil the Otter — Human-Animal Bond and Empathy",
    level: 1,
    prerequisites: ["eng_ff_ch5_prose"],
  },
  eng_ff_ch7_prose: {
    name: "Madam Rides the Bus — Innocence, Loss, and Coming of Age",
    level: 2,
    prerequisites: ["eng_ff_ch3_prose", "eng_ff_ch4_prose"],
  },
  eng_ff_ch8_prose: {
    name: "The Sermon at Benares — Universal Truth and Acceptance of Loss",
    level: 2,
    prerequisites: ["eng_ff_ch2_prose", "eng_ff_ch4_prose"],
  },
  eng_ff_ch9_prose: {
    name: "The Proposal — Satire, Farce, and Social Commentary",
    level: 2,
    prerequisites: ["eng_ff_ch7_prose", "eng_ff_ch8_prose"],
  },

  // ── First Flight Poems ──────────────────────────────────────────────────
  eng_ff_ch1_poem: {
    name: "Dust of Snow + Fire and Ice — Nature as Symbol and Human Emotion",
    level: 0,
    prerequisites: [],
  },
  eng_ff_ch2_poem: {
    name: "A Tiger in the Zoo — Captivity, Freedom, and Animal Rights",
    level: 0,
    prerequisites: [],
  },
  eng_ff_ch3_poem: {
    name: "How to Tell Wild Animals + The Ball Poem — Humour, Loss, and Growing Up",
    level: 1,
    prerequisites: ["eng_ff_ch1_poem"],
  },
  eng_ff_ch4_poem: {
    name: "Amanda! — Childhood Freedom and Over-Parenting",
    level: 1,
    prerequisites: ["eng_ff_ch2_poem"],
  },
  eng_ff_ch5_poem: {
    name: "The Trees — Feminist Symbolism and Liberation",
    level: 2,
    prerequisites: ["eng_ff_ch3_poem", "eng_ff_ch4_poem"],
  },
  eng_ff_ch6_poem: {
    name: "Fog — Extended Metaphor and Economy of Language",
    level: 1,
    prerequisites: ["eng_ff_ch1_poem"],
  },
  eng_ff_ch7_poem: {
    name: "The Tale of Custard the Dragon — Irony, Bravery, and Comic Satire",
    level: 2,
    prerequisites: ["eng_ff_ch3_poem", "eng_ff_ch6_poem"],
  },
  eng_ff_ch8_poem: {
    name: "For Anne Gregory — Soul vs. Beauty and Philosophical Love",
    level: 2,
    prerequisites: ["eng_ff_ch4_poem", "eng_ff_ch5_poem"],
  },

  // ── Footprints Without Feet ─────────────────────────────────────────────
  eng_fw_ch1: {
    name: "A Triumph of Surgery — Misplaced Love and Common Sense",
    level: 0,
    prerequisites: [],
  },
  eng_fw_ch2: {
    name: "The Thief's Story — Trust, Education, and Moral Transformation",
    level: 0,
    prerequisites: [],
  },
  eng_fw_ch3: {
    name: "The Midnight Visitor — Wit Over Force and Subverted Expectations",
    level: 1,
    prerequisites: ["eng_fw_ch2"],
  },
  eng_fw_ch4: {
    name: "A Question of Trust — Irony, Deception, and Consequences of Dishonesty",
    level: 1,
    prerequisites: ["eng_fw_ch2", "eng_fw_ch3"],
  },
  eng_fw_ch5: {
    name: "Footprints Without Feet — Science Without Ethics and Invisibility",
    level: 1,
    prerequisites: ["eng_fw_ch1"],
  },
  eng_fw_ch6: {
    name: "The Making of a Scientist — Curiosity, Mentorship, and Scientific Method",
    level: 2,
    prerequisites: ["eng_fw_ch5"],
  },
  eng_fw_ch7: {
    name: "The Necklace — Vanity, Irony, and Consequences of Pride",
    level: 2,
    prerequisites: ["eng_fw_ch4"],
  },
  eng_fw_ch8: {
    name: "Bholi — Education as Empowerment and Social Liberation",
    level: 2,
    prerequisites: ["eng_fw_ch2", "eng_fw_ch6"],
  },
  eng_fw_ch9: {
    name: "The Book That Saved the Earth — Books as Power and Comic Sci-Fi",
    level: 3,
    prerequisites: ["eng_fw_ch5", "eng_fw_ch7", "eng_fw_ch8"],
  },

  // ── Workbook Grammar ────────────────────────────────────────────────────
  eng_wb_grammar1: {
    name: "Sequencing and Narrative Writing — Process Writing and Paragraphs",
    level: 0,
    prerequisites: [],
  },
  eng_wb_grammar2: {
    name: "Verb Forms and Tenses — Simple, Perfect, Continuous, and Modal",
    level: 0,
    prerequisites: [],
  },
  eng_wb_grammar3: {
    name: "Relative Clauses — Who, Which, That, Whose, Where",
    level: 1,
    prerequisites: ["eng_wb_grammar2"],
  },
  eng_wb_grammar4: {
    name: "Active and Passive Voice — Transformation Across Tenses",
    level: 1,
    prerequisites: ["eng_wb_grammar2"],
  },
  eng_wb_grammar5: {
    name: "Conditionals — Zero, First, Second, Third, and Mixed",
    level: 2,
    prerequisites: ["eng_wb_grammar2", "eng_wb_grammar3"],
  },
  eng_wb_grammar6: {
    name: "Reported Speech — Tense Backshift, Pronouns, and Time Expressions",
    level: 2,
    prerequisites: ["eng_wb_grammar2", "eng_wb_grammar4"],
  },
  eng_wb_grammar7: {
    name: "Article Writing — Format, Headline, By-line, and Formal Register",
    level: 1,
    prerequisites: ["eng_wb_grammar1"],
  },
  eng_wb_grammar8: {
    name: "Report Writing — Event Reports, Factual Style, and 5Ws",
    level: 2,
    prerequisites: ["eng_wb_grammar7"],
  },
  eng_wb_grammar9: {
    name: "Speech Writing — Salutation, Rhetorical Devices, and Persuasion",
    level: 3,
    prerequisites: ["eng_wb_grammar7", "eng_wb_grammar8"],
  },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10_000 });
  console.log("MongoDB connected");

  let inserted = 0;
  let already = 0;

  for (const [topicId, meta] of Object.entries(ENG_TOPICS)) {
    const exists = await Topic.findOne({ topicId });
    if (exists) { already++; continue; }

    await Topic.create({
      topicId,
      name: meta.name,
      subject: "English",
      grade: "10",
      board: "CBSE",
      level: meta.level,
      prerequisites: meta.prerequisites,
      chapterId: topicId.split("_").slice(0, 3).join("_"),
    });
    inserted++;
  }

  console.log(`\n✅ English TopicDAG: ${inserted} inserted, ${already} already existed (${Object.keys(ENG_TOPICS).length} total)`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
