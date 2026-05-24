import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Heron's Formula (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch10_herons_b01",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula",
    subtopic: "Heron's Formula",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "State Heron's formula. Use it to find the area of a triangle with sides 13 cm, 14 cm, and 15 cm.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Heron's formula: Area = √[s(s−a)(s−b)(s−c)] where s = (a+b+c)/2.",
      "s = (13 + 14 + 15)/2 = 42/2 = 21.",
      "Area = √[21 × (21−13) × (21−14) × (21−15)]",
      "     = √[21 × 8 × 7 × 6]",
      "     = √[21 × 8 × 42]",
      "     = √7056 = 84 cm².",
    ],
    shortcut: "Compute s first. Then multiply the four factors and take square root.",
    bloomLevel: "apply",
    conceptTested: "Heron's formula — standard triangle",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch10_herons_b02",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula",
    subtopic: "Heron's Formula",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "A triangular park has sides 120 m, 80 m, and 50 m. Find its area using Heron's formula. Also find the cost of planting grass at ₹5 per m².",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "s = (120 + 80 + 50)/2 = 250/2 = 125 m.",
      "s − a = 125 − 120 = 5, s − b = 125 − 80 = 45, s − c = 125 − 50 = 75.",
      "Area = √[125 × 5 × 45 × 75] = √[125 × 5 × 3375].",
      "125 × 5 = 625; 625 × 3375 = 2109375.",
      "Area = √2109375 = 375√15 ≈ 1452.4 m².",
      "Cost = 1452.4 × 5 ≈ ₹7261.9 ≈ ₹7262.",
    ],
    shortcut: "Compute s, then s−a, s−b, s−c. Multiply the four factors and take √. Cost = Area × rate.",
    bloomLevel: "apply",
    conceptTested: "Heron's formula — real-life application",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch10_herons_b03",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula",
    subtopic: "Heron's Formula",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "An equilateral triangle has perimeter 60 cm. Find its area using Heron's formula.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Each side = 60/3 = 20 cm.",
      "s = (20 + 20 + 20)/2 = 30.",
      "Area = √[30 × 10 × 10 × 10] = √30000 = 100√3 cm².",
      "≈ 100 × 1.732 = 173.2 cm².",
    ],
    shortcut: "For equilateral side a: Area = (√3/4)a². Or use Heron with s = 3a/2.",
    bloomLevel: "apply",
    conceptTested: "Equilateral triangle area via Heron's formula",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch10_herons_b04",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula",
    subtopic: "Heron's Formula",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "The perimeter of an isosceles triangle is 32 cm. If the base is 12 cm, find the area using Heron's formula.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Perimeter = 32, base = 12 → two equal sides: (32 − 12)/2 = 10 cm each.",
      "Sides: 10, 10, 12.",
      "s = (10 + 10 + 12)/2 = 32/2 = 16.",
      "Area = √[16 × (16−10) × (16−10) × (16−12)] = √[16 × 6 × 6 × 4] = √2304 = 48 cm².",
    ],
    shortcut: "Find the equal sides from the perimeter; apply Heron's formula.",
    bloomLevel: "apply",
    conceptTested: "Isosceles triangle area via Heron's formula",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Heron's Formula for Quadrilaterals (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch10_quad_b01",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula",
    subtopic: "Application of Heron's Formula to Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "A quadrilateral ABCD has AB = 9 cm, BC = 40 cm, CD = 28 cm, DA = 15 cm, and diagonal AC = 41 cm. Find its area.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Check △ABC: AB = 9, BC = 40, AC = 41. Is it right-angled?",
      "9² + 40² = 81 + 1600 = 1681 = 41². ✓ Right-angled at B.",
      "Area of △ABC = (1/2) × 9 × 40 = 180 cm².",
      "For △ACD: sides 28, 15, 41.",
      "s = (28 + 15 + 41)/2 = 42.",
      "Area = √[42 × (42−28) × (42−15) × (42−41)] = √[42 × 14 × 27 × 1] = √15876 = 126 cm².",
      "Total area of ABCD = 180 + 126 = 306 cm².",
    ],
    shortcut: "Split quadrilateral along diagonal into two triangles. Use right-triangle shortcut or Heron for each.",
    bloomLevel: "apply",
    conceptTested: "Quadrilateral area by splitting into triangles",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch10_quad_b02",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula",
    subtopic: "Application of Heron's Formula to Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "A rhombus-shaped field has diagonals of 12 m and 16 m. Find its area and perimeter.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Diagonals of a rhombus bisect each other at right angles.",
      "Half-diagonals: 6 m and 8 m.",
      "Area = (1/2) × d₁ × d₂ = (1/2) × 12 × 16 = 96 m².",
      "Side of rhombus = √(6² + 8²) = √(36 + 64) = √100 = 10 m.",
      "Perimeter = 4 × 10 = 40 m.",
    ],
    shortcut: "Rhombus area = (1/2)d₁d₂. Side = √((d₁/2)² + (d₂/2)²).",
    bloomLevel: "apply",
    conceptTested: "Rhombus area and perimeter from diagonals",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch10_quad_b03",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula",
    subtopic: "Application of Heron's Formula to Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "A field is in the shape of a trapezium with parallel sides 25 m and 10 m, and the non-parallel sides are 14 m and 13 m. Find the area of the field.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Let the trapezium be ABCD with AB = 25 m (longer base), CD = 10 m (shorter base), BC = 13 m, AD = 14 m.",
      "Draw CE ⊥ AB and DF ⊥ AB from D and C.",
      "EF = CD = 10 m. Let AF = x → EB = 25 − 10 − x = 15 − x.",
      "From △ADF: x² + h² = 14². From △BCE: (15−x)² + h² = 13².",
      "Subtracting: (15−x)² − x² = 13² − 14² = 169 − 196 = −27.",
      "225 − 30x + x² − x² = −27 → 225 − 30x = −27 → 30x = 252 → x = 8.4.",
      "h² = 14² − 8.4² = 196 − 70.56 = 125.44 → h = 11.2 m.",
      "Area = (1/2)(AB + CD) × h = (1/2)(25 + 10) × 11.2 = (1/2)(35)(11.2) = 196 m².",
    ],
    shortcut: "Drop perpendiculars from shorter base; use Pythagoras to find height, then Area = (1/2)(sum of parallel sides) × height.",
    bloomLevel: "analyse",
    conceptTested: "Trapezium area using height from non-parallel sides",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch10_quad_b04",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula",
    subtopic: "Application of Heron's Formula to Quadrilaterals",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 10,
    questionText:
      "A park is in the shape of a quadrilateral ABCD. ∠C = 90°, AB = 9 m, BC = 12 m, CD = 5 m, AD = 8 m. Find its area.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "∠C = 90° → right angle at C between BC and CD.",
      "In △BCD: BC = 12, CD = 5, ∠BCD = 90°.",
      "BD = √(12² + 5²) = √(144 + 25) = √169 = 13 m.",
      "Area of △BCD = (1/2) × 12 × 5 = 30 m².",
      "In △ABD: AB = 9, BD = 13, AD = 8.",
      "s = (9 + 13 + 8)/2 = 30/2 = 15.",
      "Area of △ABD = √[15 × 6 × 2 × 7] = √1260 = 6√35 ≈ 35.5 m².",
      "Total area ≈ 30 + 35.5 = 65.5 m².",
    ],
    shortcut: "Use right-angle shortcut for one triangle; Heron's formula for the other.",
    bloomLevel: "apply",
    conceptTested: "Quadrilateral area with one right angle",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 10 (Heron's Formula)…");

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
