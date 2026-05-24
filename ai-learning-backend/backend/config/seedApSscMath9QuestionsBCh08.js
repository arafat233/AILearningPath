import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Angle Sum Property of Quadrilaterals (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch8_anglesum_b01",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals",
    subtopic: "Angle Sum Property of a Quadrilateral",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "The four angles of a quadrilateral are in the ratio 2 : 3 : 4 : 6. Find each angle.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Sum of angles = 360°.",
      "Let angles be 2x, 3x, 4x, 6x.",
      "2x + 3x + 4x + 6x = 360 → 15x = 360 → x = 24.",
      "Angles: 48°, 72°, 96°, 144°.",
    ],
    shortcut: "Sum ratio parts (2+3+4+6 = 15); divide 360° by 15 to get x.",
    bloomLevel: "apply",
    conceptTested: "Angle sum of quadrilateral — ratio problems",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_b02",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals",
    subtopic: "Angle Sum Property of a Quadrilateral",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "Prove that the sum of interior angles of a quadrilateral is 360°.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Given: Quadrilateral ABCD.",
      "Construction: Draw diagonal AC, dividing ABCD into △ABC and △ACD.",
      "In △ABC: ∠BAC + ∠ABC + ∠BCA = 180°. … (1)",
      "In △ACD: ∠CAD + ∠ACD + ∠ADC = 180°. … (2)",
      "Adding (1) and (2):",
      "(∠BAC + ∠CAD) + ∠ABC + (∠BCA + ∠ACD) + ∠ADC = 360°.",
      "∠BAD + ∠ABC + ∠BCD + ∠CDA = 360°.",
      "Hence the sum of interior angles of quadrilateral ABCD = 360°. ∎",
    ],
    shortcut: "Diagonal splits quadrilateral into 2 triangles; each has 180° → total = 360°.",
    bloomLevel: "analyse",
    conceptTested: "Proof of angle sum of quadrilateral",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_b03",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals",
    subtopic: "Angle Sum Property of a Quadrilateral",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "In a quadrilateral ABCD, ∠A = 110°, ∠C = 70°. If ∠B : ∠D = 5 : 3, find ∠B and ∠D.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "∠A + ∠B + ∠C + ∠D = 360°.",
      "110 + ∠B + 70 + ∠D = 360.",
      "∠B + ∠D = 180°.",
      "Let ∠B = 5k, ∠D = 3k. Then 8k = 180 → k = 22.5.",
      "∠B = 112.5° and ∠D = 67.5°.",
    ],
    shortcut: "Find ∠B + ∠D first from angle sum; then apply ratio.",
    bloomLevel: "apply",
    conceptTested: "Angle sum property with ratio",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_b04",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals",
    subtopic: "Angle Sum Property of a Quadrilateral",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "ABCD is a quadrilateral in which all four sides are equal. ∠DAB = 70°. Find all other angles, giving reasons.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 4,
    options: [],
    solutionSteps: [
      "ABCD is a rhombus (all sides equal).",
      "In a rhombus, opposite angles are equal: ∠DAB = ∠BCD = 70°.",
      "Adjacent angles are supplementary: ∠ABC + ∠DAB = 180° → ∠ABC = 110°.",
      "∠ADC = ∠ABC = 110° (opposite angles in rhombus).",
      "Verification: 70 + 110 + 70 + 110 = 360°. ✓",
    ],
    shortcut: "Rhombus: opposite angles equal; adjacent angles supplementary.",
    bloomLevel: "apply",
    conceptTested: "Properties of a rhombus",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Properties of a Parallelogram (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch8_parallelogram_b01",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals",
    subtopic: "Properties of a Parallelogram",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "Prove that the diagonals of a parallelogram bisect each other.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given: Parallelogram ABCD with diagonals AC and BD meeting at O.",
      "To prove: OA = OC and OB = OD.",
      "In △AOB and △COD:",
      "  AB = CD (opposite sides of parallelogram).",
      "  ∠OAB = ∠OCD (alternate interior angles, AB ∥ CD).",
      "  ∠OBA = ∠ODC (alternate interior angles, AB ∥ CD).",
      "By ASA: △AOB ≅ △COD.",
      "By CPCT: OA = OC and OB = OD.",
      "Therefore the diagonals bisect each other. ∎",
    ],
    shortcut: "ASA using alternate angles (from parallel sides) and opposite sides.",
    bloomLevel: "analyse",
    conceptTested: "Proof that parallelogram diagonals bisect each other",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_b02",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals",
    subtopic: "Properties of a Parallelogram",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "In parallelogram ABCD, ∠A = 75°. Find all four angles, giving reasons for each step.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "∠A = 75° (given).",
      "∠B + ∠A = 180° (co-interior angles, AD ∥ BC) → ∠B = 105°.",
      "∠C = ∠A = 75° (opposite angles of a parallelogram are equal).",
      "∠D = ∠B = 105° (opposite angles of a parallelogram are equal).",
      "Check: 75 + 105 + 75 + 105 = 360°. ✓",
    ],
    shortcut: "Parallelogram: opposite angles equal; adjacent angles supplementary.",
    bloomLevel: "apply",
    conceptTested: "Angle properties of a parallelogram",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_b03",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals",
    subtopic: "Properties of a Parallelogram",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "Show that if the diagonals of a quadrilateral bisect each other, it is a parallelogram.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Given: Quadrilateral ABCD with diagonals AC and BD bisecting each other at O (OA = OC, OB = OD).",
      "To prove: ABCD is a parallelogram (AB ∥ CD and AD ∥ BC).",
      "In △AOB and △COD:",
      "  OA = OC (given), OB = OD (given), ∠AOB = ∠COD (v.o.a.).",
      "By SAS: △AOB ≅ △COD → ∠OAB = ∠OCD (CPCT).",
      "These are alternate interior angles for AB and CD cut by transversal AC → AB ∥ CD.",
      "Similarly, in △AOD and △COB:",
      "  OA = OC, OD = OB, ∠AOD = ∠COB (v.o.a.).",
      "By SAS: △AOD ≅ △COB → ∠OAD = ∠OCB (CPCT) → AD ∥ BC.",
      "Both pairs of opposite sides are parallel → ABCD is a parallelogram. ∎",
    ],
    shortcut: "SAS at the diagonal intersection → CPCT gives alternate angles → parallel sides.",
    bloomLevel: "analyse",
    conceptTested: "Converse: diagonals bisect → parallelogram",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_b04",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals",
    subtopic: "Properties of a Parallelogram",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "In rectangle ABCD, diagonals AC and BD meet at O. If OA = 4x − 3 and OB = 2x + 5, find the length of each diagonal.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Diagonals of a rectangle are equal and bisect each other.",
      "OA = OC and OB = OD, and also OA = OB (since diagonals are equal, their halves are equal).",
      "4x − 3 = 2x + 5 → 2x = 8 → x = 4.",
      "OA = 4(4) − 3 = 13; OB = 2(4) + 5 = 13. ✓",
      "Each half-diagonal = 13, so each full diagonal = 26.",
    ],
    shortcut: "In a rectangle, diagonals are equal, so the two half-diagonals must also be equal.",
    bloomLevel: "apply",
    conceptTested: "Rectangle diagonal properties",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Midpoint Theorem (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch8_midpoint_b01",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals",
    subtopic: "Midpoint Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "State and prove the Midpoint Theorem for triangles.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 6,
    options: [],
    solutionSteps: [
      "Statement: The line segment joining the midpoints of two sides of a triangle is parallel to the third side and half its length.",
      "Given: △ABC with D and E as midpoints of AB and AC respectively.",
      "To prove: DE ∥ BC and DE = (1/2)BC.",
      "Construction: Extend DE to F such that EF = DE. Join CF.",
      "In △ADE and △CFE:",
      "  AE = CE (E is midpoint of AC).",
      "  DE = FE (construction).",
      "  ∠AED = ∠CEF (vertically opposite).",
      "By SAS: △ADE ≅ △CFE.",
      "By CPCT: AD = CF and ∠DAE = ∠FCE (alternate interior angles) → AD ∥ CF.",
      "AD = DB (D is midpoint) → CF = DB and CF ∥ DB.",
      "BDFC is a parallelogram (one pair of opposite sides both equal and parallel).",
      "Therefore DF ∥ BC and DF = BC.",
      "DE = DF/2 = BC/2 and DE ∥ BC. ∎",
    ],
    shortcut: "Extend the midpoint segment to double length; form a parallelogram with the third side.",
    bloomLevel: "analyse",
    conceptTested: "Proof of Midpoint Theorem",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_b02",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals",
    subtopic: "Midpoint Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "In △ABC, D, E, F are midpoints of BC, CA, AB respectively. If AB = 10, BC = 12, CA = 8, find the perimeter of △DEF.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "By Midpoint Theorem: EF = (1/2)BC = 6, DF = (1/2)CA = 4, DE = (1/2)AB = 5.",
      "Perimeter of △DEF = DE + EF + DF = 5 + 6 + 4 = 15.",
    ],
    shortcut: "Each side of the medial triangle = half the opposite side of the original.",
    bloomLevel: "apply",
    conceptTested: "Midpoint theorem — medial triangle perimeter",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_b03",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals",
    subtopic: "Midpoint Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "ABCD is a trapezium with AB ∥ DC. E and F are midpoints of AD and BC. Prove that EF ∥ AB ∥ DC and EF = (AB + DC)/2.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Join diagonal AC. Let P be the midpoint of AC.",
      "In △ABC: F is midpoint of BC, P is midpoint of AC → by Midpoint Theorem: FP ∥ AB and FP = AB/2.",
      "In △ACD: E is midpoint of AD, P is midpoint of AC → by Midpoint Theorem: EP ∥ DC and EP = DC/2.",
      "Both FP and EP are parallel to AB and DC respectively, and all are parallel to each other.",
      "EF = EP + PF = DC/2 + AB/2 = (AB + DC)/2.",
      "Also EF is the straight line segment through E, P, F, so EF ∥ AB ∥ DC. ∎",
    ],
    shortcut: "Use diagonal to create two sub-triangles; apply Midpoint Theorem to each, then add.",
    bloomLevel: "analyse",
    conceptTested: "Midpoint theorem applied to trapezium — mid-segment formula",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_b04",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals",
    subtopic: "Midpoint Theorem",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 8,
    questionText:
      "In a trapezium ABCD, AB ∥ CD, AB = 9 cm, CD = 5 cm. E and F are midpoints of AD and BC. Find EF.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 2,
    options: [],
    solutionSteps: [
      "By the trapezium mid-segment theorem: EF = (AB + CD)/2 = (9 + 5)/2 = 14/2 = 7 cm.",
    ],
    shortcut: "Mid-segment of trapezium = average of the two parallel sides.",
    bloomLevel: "apply",
    conceptTested: "Trapezium mid-segment length",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 8 (Quadrilaterals)…");

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
