// ============================================================
// SEED — Science, English, Social Science, Hindi topics
// Run: node config/seedSubjects.js
// ============================================================
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const topicSchema = new mongoose.Schema({
  name: String, subject: String, grade: String,
  prerequisites: [String], examFrequency: Number,
  estimatedHours: Number, examMarks: Number,
  realWorldUse: String, whyMatters: String,
});
const Topic = mongoose.model("Topic", topicSchema);

const TOPICS = [
  // ── SCIENCE (Physics) ────────────────────────────────────────
  { name: "Light — Reflection and Refraction", subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.95, estimatedHours: 4, examMarks: 8, realWorldUse: "Cameras, glasses, mirrors", whyMatters: "Usually 8 marks in board exam — must do" },
  { name: "Human Eye and Colourful World",      subject: "Science", grade: "10", prerequisites: ["Light — Reflection and Refraction"], examFrequency: 0.85, estimatedHours: 3, examMarks: 5, realWorldUse: "Vision correction, rainbows", whyMatters: "Frequently tested — connects to light chapter" },
  { name: "Electricity",                        subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.95, estimatedHours: 5, examMarks: 8, realWorldUse: "Circuits, wiring, appliances", whyMatters: "Ohm's law numericals are guaranteed" },
  { name: "Magnetic Effects of Electric Current", subject: "Science", grade: "10", prerequisites: ["Electricity"], examFrequency: 0.90, estimatedHours: 4, examMarks: 7, realWorldUse: "Motors, generators, MRI", whyMatters: "Fleming rules appear every year" },
  { name: "Sources of Energy",                  subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Renewable energy, environment", whyMatters: "Good scoring topic — mostly theory" },

  // ── SCIENCE (Chemistry) ──────────────────────────────────────
  { name: "Chemical Reactions and Equations",   subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.90, estimatedHours: 3, examMarks: 6, realWorldUse: "Cooking, rusting, medicine", whyMatters: "Balancing equations is always tested" },
  { name: "Acids, Bases and Salts",             subject: "Science", grade: "10", prerequisites: ["Chemical Reactions and Equations"], examFrequency: 0.90, estimatedHours: 3, examMarks: 7, realWorldUse: "Digestion, cleaning, soil", whyMatters: "pH and neutralisation come every year" },
  { name: "Metals and Non-metals",              subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.85, estimatedHours: 3, examMarks: 6, realWorldUse: "Mining, alloys, wires", whyMatters: "Reactivity series questions are frequent" },
  { name: "Carbon and Its Compounds",           subject: "Science", grade: "10", prerequisites: ["Metals and Non-metals"], examFrequency: 0.80, estimatedHours: 4, examMarks: 6, realWorldUse: "Fuels, plastics, medicines", whyMatters: "Homologous series naming tested yearly" },
  { name: "Periodic Classification of Elements", subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 2, examMarks: 4, realWorldUse: "Chemistry foundation", whyMatters: "Trends in periodic table — short questions" },

  // ── SCIENCE (Biology) ────────────────────────────────────────
  { name: "Life Processes",                     subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.90, estimatedHours: 4, examMarks: 7, realWorldUse: "Health, nutrition, plant biology", whyMatters: "Nutrition, respiration, circulation — all tested" },
  { name: "Control and Coordination",           subject: "Science", grade: "10", prerequisites: ["Life Processes"], examFrequency: 0.85, estimatedHours: 3, examMarks: 6, realWorldUse: "Nervous system, hormones", whyMatters: "Reflex arc diagram is classic exam question" },
  { name: "How Do Organisms Reproduce",         subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.80, estimatedHours: 3, examMarks: 5, realWorldUse: "Biology, medicine", whyMatters: "STD and reproductive diagrams frequently tested" },
  { name: "Heredity and Evolution",             subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.80, estimatedHours: 3, examMarks: 6, realWorldUse: "Genetics, medicine", whyMatters: "Mendel's laws and evolution always appear" },
  { name: "Our Environment",                    subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Ecology, conservation", whyMatters: "Food chain and ozone layer — short answers" },
  { name: "Sustainable Management of Natural Resources", subject: "Science", grade: "10", prerequisites: [], examFrequency: 0.65, estimatedHours: 2, examMarks: 3, realWorldUse: "Environment, policy", whyMatters: "Less marks but easy scoring" },

  // ── ENGLISH ──────────────────────────────────────────────────
  { name: "A Letter to God",                    subject: "English", grade: "10", prerequisites: [], examFrequency: 0.60, estimatedHours: 1, examMarks: 5, realWorldUse: "Reading comprehension", whyMatters: "First Flight — passage and questions" },
  { name: "Nelson Mandela: Long Walk to Freedom", subject: "English", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 1, examMarks: 5, realWorldUse: "History, values", whyMatters: "Very frequently set for comprehension" },
  { name: "Two Stories About Flying",           subject: "English", grade: "10", prerequisites: [], examFrequency: 0.65, estimatedHours: 1, examMarks: 5, realWorldUse: "Life lessons", whyMatters: "Short answer questions common" },
  { name: "From the Diary of Anne Frank",       subject: "English", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 1, examMarks: 5, realWorldUse: "Historical context, empathy", whyMatters: "Character and theme questions" },
  { name: "The Hundred Dresses",                subject: "English", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 1, examMarks: 5, realWorldUse: "Social values", whyMatters: "Often asked for character analysis" },
  { name: "Dust of Snow",                       subject: "English", grade: "10", prerequisites: [], examFrequency: 0.80, estimatedHours: 0.5, examMarks: 4, realWorldUse: "Poetry appreciation", whyMatters: "Very short poem — always tested" },
  { name: "Fire and Ice",                       subject: "English", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 0.5, examMarks: 4, realWorldUse: "Poetry, symbolism", whyMatters: "Poem meaning questions" },
  { name: "Grammar — Tenses and Voice",         subject: "English", grade: "10", prerequisites: [], examFrequency: 0.95, estimatedHours: 3, examMarks: 8, realWorldUse: "Communication, writing", whyMatters: "Grammar section is guaranteed 10+ marks" },
  { name: "Writing Skills — Letter and Essay",  subject: "English", grade: "10", prerequisites: [], examFrequency: 0.95, estimatedHours: 3, examMarks: 10, realWorldUse: "Professional communication", whyMatters: "Highest marks section in English paper" },
  { name: "A Triumph of Surgery",               subject: "English", grade: "10", prerequisites: [], examFrequency: 0.65, estimatedHours: 1, examMarks: 4, realWorldUse: "Empathy, pets", whyMatters: "Footprints Without Feet — MCQs" },

  // ── SOCIAL SCIENCE ───────────────────────────────────────────
  { name: "The Rise of Nationalism in Europe",  subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.85, estimatedHours: 3, examMarks: 6, realWorldUse: "History, politics", whyMatters: "French Revolution, Bismarck — long answers" },
  { name: "Nationalism in India",               subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.90, estimatedHours: 3, examMarks: 7, realWorldUse: "Indian history", whyMatters: "Gandhi, Non-cooperation — always tested" },
  { name: "The Making of a Global World",       subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 2, examMarks: 5, realWorldUse: "Globalisation history", whyMatters: "Trade routes and colonialism questions" },
  { name: "The Age of Industrialisation",       subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 5, realWorldUse: "Industrial revolution", whyMatters: "Factory system and labour — medium weight" },
  { name: "Print Culture and the Modern World", subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.65, estimatedHours: 2, examMarks: 4, realWorldUse: "Media, communication", whyMatters: "Press and reform — short questions" },
  { name: "Resources and Development",          subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.85, estimatedHours: 3, examMarks: 6, realWorldUse: "Environment, geography", whyMatters: "Map work and soil types are tested" },
  { name: "Forest and Wildlife Resources",      subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Conservation", whyMatters: "Reserved/protected forest distinction" },
  { name: "Water Resources",                    subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.80, estimatedHours: 2, examMarks: 5, realWorldUse: "Irrigation, dams", whyMatters: "Multipurpose dams and rainwater harvesting" },
  { name: "Agriculture",                        subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.85, estimatedHours: 2, examMarks: 6, realWorldUse: "Food security, economy", whyMatters: "Kharif/Rabi crops and Green Revolution" },
  { name: "Minerals and Energy Resources",      subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 2, examMarks: 5, realWorldUse: "Mining, energy policy", whyMatters: "Map work — mineral locations" },
  { name: "Manufacturing Industries",           subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 2, examMarks: 5, realWorldUse: "Economy, trade", whyMatters: "Steel and textile industry questions" },
  { name: "Power Sharing",                      subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.85, estimatedHours: 2, examMarks: 6, realWorldUse: "Democracy, governance", whyMatters: "Belgium and Sri Lanka case studies" },
  { name: "Federalism",                         subject: "Social Science", grade: "10", prerequisites: ["Power Sharing"], examFrequency: 0.80, estimatedHours: 2, examMarks: 5, realWorldUse: "Indian constitution", whyMatters: "Centre-state relations always tested" },
  { name: "Democracy and Diversity",            subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Social justice", whyMatters: "Civil rights examples — short questions" },
  { name: "Gender, Religion and Caste",         subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Social awareness", whyMatters: "Short answer questions" },
  { name: "Popular Struggles and Movements",    subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.65, estimatedHours: 2, examMarks: 4, realWorldUse: "Democratic movements", whyMatters: "Bolivia water wars case study" },
  { name: "Political Parties",                  subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 2, examMarks: 5, realWorldUse: "Civics, elections", whyMatters: "Functions and challenges of political parties" },
  { name: "Outcomes of Democracy",              subject: "Social Science", grade: "10", prerequisites: ["Political Parties"], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Governance", whyMatters: "Democracy vs dictatorship comparison" },
  { name: "Development",                        subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.85, estimatedHours: 2, examMarks: 6, realWorldUse: "Economics, policy", whyMatters: "HDI and national income — always in exam" },
  { name: "Sectors of the Indian Economy",      subject: "Social Science", grade: "10", prerequisites: ["Development"], examFrequency: 0.85, estimatedHours: 2, examMarks: 6, realWorldUse: "Employment, GDP", whyMatters: "Primary/secondary/tertiary sector questions" },
  { name: "Money and Credit",                   subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.80, estimatedHours: 2, examMarks: 5, realWorldUse: "Banking, finance", whyMatters: "Credit and formal/informal sector" },
  { name: "Globalisation and the Indian Economy", subject: "Social Science", grade: "10", prerequisites: ["Money and Credit"], examFrequency: 0.80, estimatedHours: 2, examMarks: 5, realWorldUse: "Trade, MNCs", whyMatters: "MNCs and WTO questions" },
  { name: "Consumer Rights",                    subject: "Social Science", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Legal rights, shopping", whyMatters: "COPRA and consumer forums" },

  // ── HINDI ────────────────────────────────────────────────────
  { name: "Surdas — Pad",                       subject: "Hindi", grade: "10", prerequisites: [], examFrequency: 0.80, estimatedHours: 2, examMarks: 5, realWorldUse: "Hindi literature", whyMatters: "Sparsh — kavyaansh always comes" },
  { name: "Tulsidas — Ram-Lakshman-Parshuram Samvad", subject: "Hindi", grade: "10", prerequisites: [], examFrequency: 0.85, estimatedHours: 2, examMarks: 5, realWorldUse: "Hindi poetry", whyMatters: "Dialogue poem — character questions" },
  { name: "Devdas — Mitaibai",                  subject: "Hindi", grade: "10", prerequisites: [], examFrequency: 0.70, estimatedHours: 2, examMarks: 4, realWorldUse: "Literature", whyMatters: "Sparsh — gadyansh and prashna" },
  { name: "Vyakaran — Vakya Bhed",              subject: "Hindi", grade: "10", prerequisites: [], examFrequency: 0.95, estimatedHours: 3, examMarks: 8, realWorldUse: "Language skills", whyMatters: "Guaranteed marks — grammar section" },
  { name: "Lekhan Kaushal — Patra aur Nibandh", subject: "Hindi", grade: "10", prerequisites: [], examFrequency: 0.95, estimatedHours: 3, examMarks: 10, realWorldUse: "Communication", whyMatters: "Highest marks section in Hindi paper" },
  { name: "Sana Sana Haath Jodi",               subject: "Hindi", grade: "10", prerequisites: [], examFrequency: 0.75, estimatedHours: 1, examMarks: 4, realWorldUse: "Travel writing", whyMatters: "Kritika — frequently set" },
  { name: "Hari Hansa",                         subject: "Hindi", grade: "10", prerequisites: [], examFrequency: 0.65, estimatedHours: 1, examMarks: 3, realWorldUse: "Short story", whyMatters: "Sanchayan — MCQs" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  let added = 0, skipped = 0;
  for (const t of TOPICS) {
    const exists = await Topic.findOne({ name: t.name, subject: t.subject });
    if (exists) { skipped++; continue; }
    await Topic.create(t);
    added++;
    console.log(`  ✅ ${t.subject}: ${t.name}`);
  }

  console.log(`\nDone. Added: ${added}, Skipped (already exist): ${skipped}`);
  await mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
