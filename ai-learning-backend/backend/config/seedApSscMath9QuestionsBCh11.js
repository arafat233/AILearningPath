import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Surface Areas of Solids (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch11_surface_b01",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Surface Areas of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A hall is 20 m long, 15 m wide, and 5 m high. Find the cost of whitewashing the four walls and the ceiling at ₹8 per m². (Assume no doors/windows.)",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Area of four walls = 2(l + b) × h = 2(20 + 15) × 5 = 2 × 35 × 5 = 350 m².",
      "Area of ceiling = l × b = 20 × 15 = 300 m².",
      "Total area = 350 + 300 = 650 m².",
      "Cost = 650 × 8 = ₹5200.",
    ],
    shortcut: "Lateral surface of cuboid = 2(l+b)h. Add ceiling area = lb.",
    bloomLevel: "apply",
    conceptTested: "Cuboid surface area — real-life",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch11_surface_b02",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Surface Areas of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A cylindrical pillar has diameter 50 cm and height 3.5 m. Find the curved surface area. (Use π = 22/7.)",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "r = 25 cm = 0.25 m; h = 3.5 m.",
      "CSA = 2πrh = 2 × (22/7) × 0.25 × 3.5.",
      "= 2 × (22/7) × (7/8) × (7/2) = 2 × 22 × (7/8) × (1/2) = 2 × 22 × 7/16.",
      "Let's compute directly: 2 × (22/7) × 0.25 × 3.5 = 2 × 22/7 × 0.875 = 2 × 2.75 = 5.5 m².",
    ],
    shortcut: "CSA of cylinder = 2πrh. Convert all units to the same system first.",
    bloomLevel: "apply",
    conceptTested: "Curved surface area of cylinder",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch11_surface_b03",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Surface Areas of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A conical tent is 10 m high and base radius is 24 m. Find: (i) its slant height, (ii) curved surface area, (iii) cost of canvas at ₹70 per m². (π = 3.14)",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 5,
    options: [],
    solutionSteps: [
      "(i) l = √(r² + h²) = √(24² + 10²) = √(576 + 100) = √676 = 26 m.",
      "(ii) CSA = πrl = 3.14 × 24 × 26 = 3.14 × 624 = 1959.36 m².",
      "(iii) Cost = 1959.36 × 70 = ₹1,37,155.20.",
    ],
    shortcut: "Cone slant height l = √(r² + h²). CSA = πrl.",
    bloomLevel: "apply",
    conceptTested: "Cone surface area — real-life application",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch11_surface_b04",
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Surface Areas of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A sphere of radius 6 cm is melted and recast into a hemisphere. Find the radius of the hemisphere and compare the total surface areas of both solids. (π = 22/7)",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Volume of sphere = (4/3)πr³ = (4/3)π(6)³ = 288π cm³.",
      "Volume of hemisphere = (2/3)πR³ = 288π → R³ = 432 → R = ∛432 = 6∛2 ≈ 7.56 cm.",
      "TSA of sphere = 4πr² = 4π(36) = 144π cm².",
      "TSA of hemisphere = 3πR² = 3π(432^(2/3)) = 3π(6∛2)² = 3π × 36 × ∛4 = 108π∛4 cm².",
      "∛4 ≈ 1.587 → TSA of hemisphere ≈ 108 × 3.14 × 1.587 ≈ 538.5 cm².",
      "TSA of sphere = 144π ≈ 452.4 cm².",
      "The hemisphere has a larger TSA than the original sphere.",
    ],
    shortcut: "Equate volumes to find new radius. TSA sphere = 4πr², TSA hemisphere = 3πR².",
    bloomLevel: "analyse",
    conceptTested: "Volume conservation + surface area comparison",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Volumes of Solids (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch11_volume_b01",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Volumes of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A cuboidal water tank is 6 m long, 5 m wide, and 4.5 m deep. How many litres of water can it hold? (1 m³ = 1000 litres)",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Volume = l × b × h = 6 × 5 × 4.5 = 135 m³.",
      "Capacity = 135 × 1000 = 1,35,000 litres.",
    ],
    shortcut: "Volume of cuboid = lbh. Multiply by 1000 to convert m³ to litres.",
    bloomLevel: "apply",
    conceptTested: "Volume of cuboid — real-life",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch11_volume_b02",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Volumes of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A metallic sphere of radius 4.2 cm is melted and recast into small spheres of radius 0.6 cm. Find the number of small spheres. (π = 22/7)",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Volume of large sphere = (4/3)π(4.2)³.",
      "4.2³ = 74.088. Volume = (4/3)(22/7)(74.088) = (4 × 22 × 74.088)/(3 × 7) = 6522.1/21 = 310.6 cm³.",
      "Volume of small sphere = (4/3)π(0.6)³ = (4/3)(22/7)(0.216) = (4 × 22 × 0.216)/21 = 19.008/21 = 0.905 cm³.",
      "Number of spheres = 310.6/0.905 ≈ 343.",
      "Exact: (4.2/0.6)³ = 7³ = 343 spheres.",
    ],
    shortcut: "n = (R/r)³ when melting one sphere into smaller ones of radius r.",
    bloomLevel: "apply",
    conceptTested: "Volume conservation — sphere recasting",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch11_volume_b03",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Volumes of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A cone and a cylinder have the same base radius and height. What is the ratio of their volumes? How many cones of water can fill the cylinder?",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Volume of cone = (1/3)πr²h.",
      "Volume of cylinder = πr²h.",
      "Ratio = (1/3)πr²h : πr²h = 1 : 3.",
      "So the cylinder's volume is 3 times that of the cone.",
      "It takes 3 full cones of water to fill the cylinder completely.",
    ],
    shortcut: "V_cone : V_cylinder = 1 : 3 (same base and height). Always 3 cones = 1 cylinder.",
    bloomLevel: "understand",
    conceptTested: "Volume ratio of cone and cylinder",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch11_volume_b04",
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    topic: "Surface Areas and Volumes",
    subtopic: "Volumes of Solids",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 11,
    questionText:
      "A wall 30 m long, 12 m high, and 0.3 m thick is to be built using bricks measuring 30 cm × 15 cm × 8 cm. If the mortar fills 10% of the volume, find the number of bricks needed.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Volume of wall = 30 × 12 × 0.3 = 108 m³.",
      "Volume occupied by bricks = 90% of wall volume = 0.9 × 108 = 97.2 m³.",
      "Convert brick dimensions to metres: 0.30 m × 0.15 m × 0.08 m.",
      "Volume of one brick = 0.30 × 0.15 × 0.08 = 0.0036 m³.",
      "Number of bricks = 97.2 / 0.0036 = 27,000.",
    ],
    shortcut: "Subtract mortar volume (10%) from wall; divide remaining by one brick volume.",
    bloomLevel: "apply",
    conceptTested: "Practical volume calculation — bricks",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 11 (Surface Areas and Volumes)…");

  let upserted = 0;
  let skipped = 0;

  for (const q of questions) {
    try {
      await Question.findOneAndUpdate(
        { questionId: q.questionId },
        { $set: q },
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${q.questionId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  — skip ${q.questionId}`);
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
