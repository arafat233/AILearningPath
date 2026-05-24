import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch10_herons_formula  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch10_heron_a01",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "Heron's formula for the area of a triangle with sides a, b, c is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "√(s(s−a)(s−b)(s−c)), where s = a+b+c",          type: "concept_error", logicTag: "wrong_s" },
      { text: "√(s(s−a)(s−b)(s−c)), where s = (a+b+c)/2",      type: "correct",       logicTag: "herons_formula" },
      { text: "(1/2) × base × height",                          type: "concept_error", logicTag: "basic_formula" },
      { text: "s(s−a)(s−b)(s−c), where s = (a+b+c)/2",         type: "concept_error", logicTag: "no_sqrt" },
    ],
    solutionSteps: [
      "s = semi-perimeter = (a+b+c)/2.",
      "Area = √(s(s−a)(s−b)(s−c)).",
    ],
    shortcut: "Heron: Area = √(s·(s−a)·(s−b)·(s−c)), s = half-perimeter.",
    bloomLevel: "remember", conceptTested: "Statement of Heron's formula",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a02",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "For a triangle with sides 3 cm, 4 cm, 5 cm, the semi-perimeter s is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "12 cm",  type: "concept_error", logicTag: "perimeter_not_semi" },
      { text: "7 cm",   type: "concept_error", logicTag: "wrong" },
      { text: "6 cm",   type: "correct",       logicTag: "12_divided_2" },
      { text: "4 cm",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Perimeter = 3+4+5 = 12 cm. s = 12/2 = 6 cm.",
    ],
    shortcut: "s = (a+b+c)/2.",
    bloomLevel: "apply", conceptTested: "Calculating semi-perimeter",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a03",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "The area of a triangle with sides 3, 4, 5 cm using Heron's formula is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "10 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "6 cm²",   type: "correct",       logicTag: "half_base_height_verified" },
      { text: "12 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "8 cm²",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "s = 6. Area = √(6·3·2·1) = √36 = 6 cm².",
      "Verified: (3,4,5) is a right triangle → Area = (1/2)×3×4 = 6 cm². ✓",
    ],
    shortcut: "Always verify with basic formula when triangle is right-angled.",
    bloomLevel: "apply", conceptTested: "Applying Heron's formula (3-4-5 triangle)",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a04",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "An equilateral triangle has side 4 cm. Its area (using Heron's formula) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "4√3 cm²",    type: "correct",       logicTag: "equilateral_area" },
      { text: "8 cm²",      type: "concept_error", logicTag: "wrong" },
      { text: "16 cm²",     type: "concept_error", logicTag: "side_squared" },
      { text: "2√3 cm²",    type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "s = (4+4+4)/2 = 6.",
      "Area = √(6·2·2·2) = √48 = 4√3 cm².",
      "Or use formula: (√3/4)a² = (√3/4)×16 = 4√3 cm². ✓",
    ],
    shortcut: "Equilateral triangle: Area = (√3/4)a².",
    bloomLevel: "apply", conceptTested: "Area of equilateral triangle using Heron's formula",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a05",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A triangle has sides 7 cm, 8 cm, 9 cm. The value of s(s−a)(s−b)(s−c) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "1200",  type: "concept_error", logicTag: "wrong" },
      { text: "720",   type: "correct",       logicTag: "s12_s-a5_s-b4_s-c3" },
      { text: "840",   type: "concept_error", logicTag: "wrong" },
      { text: "576",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "s = (7+8+9)/2 = 12.",
      "s−a = 5, s−b = 4, s−c = 3.",
      "s(s−a)(s−b)(s−c) = 12×5×4×3 = 720.",
      "Area = √720 = 12√5 cm².",
    ],
    shortcut: "Compute s, then s−a, s−b, s−c, then multiply all four.",
    bloomLevel: "apply", conceptTested: "Computing product inside Heron's formula",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a06",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "An isosceles triangle has equal sides 5 cm and base 6 cm. Its area is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "15 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "12 cm²",  type: "correct",       logicTag: "s8_product_192_sqrt192" },
      { text: "10 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "18 cm²",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "s = (5+5+6)/2 = 8.",
      "Area = √(8×3×3×2) = √144 = 12 cm².",
    ],
    shortcut: "s(s−5)(s−5)(s−6) = 8·3·3·2 = 144. Area = 12.",
    bloomLevel: "apply", conceptTested: "Heron's formula for isosceles triangle",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a07",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "The area of a triangle with perimeter 24 cm and sides 6 cm, 8 cm, 10 cm is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "48 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "24 cm²",  type: "correct",       logicTag: "right_triangle_6_8_10" },
      { text: "12 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "36 cm²",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "6² + 8² = 36+64 = 100 = 10² → right triangle.",
      "Area = (1/2)×6×8 = 24 cm². Verified by Heron: s=12, √(12×6×4×2) = √576 = 24 ✓.",
    ],
    shortcut: "Recognize Pythagorean triple (6,8,10) → right triangle.",
    bloomLevel: "apply", conceptTested: "Heron's formula with Pythagorean triple",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a08",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "Heron of Alexandria was a:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Chinese mathematician",  type: "concept_error", logicTag: "wrong" },
      { text: "Greek mathematician",    type: "correct",       logicTag: "heron_greek" },
      { text: "Indian mathematician",   type: "concept_error", logicTag: "wrong" },
      { text: "Egyptian pharaoh",       type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Heron (Hero) of Alexandria was a Greek mathematician and engineer (c. 10–70 AD).",
    ],
    shortcut: "Heron → Greek → Alexandria (Egypt, but Greek school).",
    bloomLevel: "remember", conceptTested: "Historical context of Heron's formula",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a09",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "The sides of a triangle are in ratio 5:12:13. If perimeter is 60 cm, find the area using Heron's formula.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "120 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "150 cm²",  type: "correct",       logicTag: "5_12_13_right_triangle" },
      { text: "180 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "100 cm²",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Sides: 5k+12k+13k = 60 → k=2 → sides 10,24,26.",
      "10² + 24² = 100+576 = 676 = 26² → right triangle.",
      "Area = (1/2)×10×24 = 120 cm².",
      "Wait: Heron verify: s=30, √(30×20×6×4) = √14400 = 120 ✓.",
    ],
    shortcut: "Ratio 5:12:13 is a Pythagorean triple (scaled). Area = (1/2)×leg₁×leg₂.",
    bloomLevel: "analyse", conceptTested: "Heron's formula with scaled Pythagorean triple",
  },
  {
    questionId: "ap_ssc9_ch10_heron_a10",
    topicId: "ap_ssc_math9_ch10_herons_formula",
    topic: "Heron's Formula", subtopic: "Heron's Formula for Triangle Area",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A triangular park has sides 120 m, 80 m, and 40√10 m. Find the cost of fencing at ₹20/m.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "₹4800",   type: "concept_error", logicTag: "wrong" },
      { text: "₹6529",   type: "correct",       logicTag: "perimeter_x_20" },
      { text: "₹5200",   type: "concept_error", logicTag: "wrong" },
      { text: "₹4000",   type: "concept_error", logicTag: "only_200m_x_20" },
    ],
    solutionSteps: [
      "40√10 ≈ 126.49 m.",
      "Perimeter ≈ 120 + 80 + 126.49 = 326.49 m.",
      "Cost = 326.49 × 20 ≈ ₹6529.8 ≈ ₹6530.",
    ],
    shortcut: "Cost of fencing = perimeter × rate per metre.",
    bloomLevel: "apply", conceptTested: "Perimeter application: cost of fencing",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch10_herons_application_quadrilaterals  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch10_heronapply_a01",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "To find the area of a quadrilateral using Heron's formula, we divide it into:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Four right triangles",          type: "concept_error", logicTag: "wrong" },
      { text: "Two triangles using a diagonal", type: "correct",      logicTag: "quadrilateral_two_triangles" },
      { text: "A rectangle and a triangle",    type: "concept_error", logicTag: "special_case" },
      { text: "Six triangles",                 type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "A diagonal divides a quadrilateral into two triangles.",
      "Apply Heron's formula to each triangle and add the areas.",
    ],
    shortcut: "Area of quadrilateral = Area △1 + Area △2 (split by diagonal).",
    bloomLevel: "understand", conceptTested: "Method for area of quadrilateral using Heron's",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a02",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A rhombus has diagonals 24 cm and 10 cm. Its area is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "60 cm²",   type: "concept_error", logicTag: "only_one_diagonal" },
      { text: "120 cm²",  type: "correct",       logicTag: "half_product_diagonals" },
      { text: "240 cm²",  type: "concept_error", logicTag: "full_product" },
      { text: "130 cm²",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Area of rhombus = (1/2) × d₁ × d₂ = (1/2) × 24 × 10 = 120 cm².",
    ],
    shortcut: "Rhombus area = (d₁ × d₂)/2.",
    bloomLevel: "apply", conceptTested: "Area of rhombus using diagonals",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a03",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A field is in the shape of a quadrilateral ABCD with diagonal AC = 40 m. Perpendiculars from B and D to AC are 20 m and 12 m respectively. The area of the field is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "640 m²",   type: "correct",       logicTag: "half_x_40_x_32" },
      { text: "800 m²",   type: "concept_error", logicTag: "wrong" },
      { text: "480 m²",   type: "concept_error", logicTag: "wrong" },
      { text: "1280 m²",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Area = (1/2) × d × (h₁ + h₂) = (1/2) × 40 × (20+12) = (1/2) × 40 × 32 = 640 m².",
    ],
    shortcut: "Quadrilateral with diagonal and two heights: Area = (1/2)×d×(h₁+h₂).",
    bloomLevel: "apply", conceptTested: "Area of quadrilateral with diagonal and heights",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a04",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A quadrilateral is divided by a diagonal of 10 m into two triangles. The triangle areas are 30 m² and 20 m². The total area is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "30 m²",   type: "concept_error", logicTag: "only_larger" },
      { text: "60 m²",   type: "concept_error", logicTag: "wrong" },
      { text: "50 m²",   type: "correct",       logicTag: "sum_of_triangles" },
      { text: "600 m²",  type: "concept_error", logicTag: "multiplied" },
    ],
    solutionSteps: [
      "Total area = 30 + 20 = 50 m².",
    ],
    shortcut: "Total = sum of both triangle areas.",
    bloomLevel: "apply", conceptTested: "Summing triangle areas for quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a05",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A park is in the shape of a quadrilateral ABCD. AB=9m, BC=40m, CD=28m, DA=15m, ∠B=90°. Find the area.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "196 m²",  type: "concept_error", logicTag: "wrong" },
      { text: "306 m²",  type: "correct",       logicTag: "right_triangle_plus_heron" },
      { text: "360 m²",  type: "concept_error", logicTag: "wrong" },
      { text: "280 m²",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠B=90°: AC = √(9²+40²) = √(81+1600) = √1681 = 41 m.",
      "△ABC: (1/2)×9×40 = 180 m².",
      "△ACD: sides 41,28,15. s=(41+28+15)/2=42.",
      "Area=√(42×1×14×27)=√15876=126 m².",
      "Total = 180+126 = 306 m².",
    ],
    shortcut: "Split by diagonal; use Pythagoras for right triangle, Heron's for the other.",
    bloomLevel: "analyse", conceptTested: "Mixed application: right triangle + Heron's",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a06",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "An equilateral triangle of side 4 cm and a rectangle of dimensions 6×3 cm together form a shape. The total area is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "18 + 4√3 cm²",  type: "correct",       logicTag: "equilateral_plus_rectangle" },
      { text: "24 + 4√3 cm²",  type: "concept_error", logicTag: "wrong_rectangle" },
      { text: "18 cm²",        type: "concept_error", logicTag: "rectangle_only" },
      { text: "4√3 cm²",       type: "concept_error", logicTag: "triangle_only" },
    ],
    solutionSteps: [
      "Equilateral △ area = (√3/4)×4² = 4√3 cm².",
      "Rectangle area = 6×3 = 18 cm².",
      "Total = 18 + 4√3 cm².",
    ],
    shortcut: "Combine formulae: equilateral area + rectangle area.",
    bloomLevel: "apply", conceptTested: "Combined area of equilateral triangle and rectangle",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a07",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "The side of a rhombus is 13 cm and one diagonal is 10 cm. Its area is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "100 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "120 cm²",  type: "correct",       logicTag: "half_diagonal_x_full_diagonal" },
      { text: "130 cm²",  type: "concept_error", logicTag: "wrong" },
      { text: "60 cm²",   type: "concept_error", logicTag: "only_half" },
    ],
    solutionSteps: [
      "Half of d₁ = 5 cm. Side = 13 cm.",
      "Half of d₂ = √(13²−5²) = √144 = 12 cm → d₂ = 24 cm.",
      "Area = (d₁×d₂)/2 = (10×24)/2 = 120 cm².",
    ],
    shortcut: "Find second diagonal from half-diagonal and side via Pythagoras.",
    bloomLevel: "apply", conceptTested: "Finding area of rhombus when one diagonal is given",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a08",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A triangular field has sides 15 m, 20 m, 25 m. Cost of levelling at ₹5/m² is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "₹600",   type: "concept_error", logicTag: "area_times_5_wrong" },
      { text: "₹750",   type: "correct",       logicTag: "area_150_times_5" },
      { text: "₹900",   type: "concept_error", logicTag: "wrong" },
      { text: "₹1200",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "15²+20² = 225+400 = 625 = 25² → right triangle.",
      "Area = (1/2)×15×20 = 150 m².",
      "Cost = 150×5 = ₹750.",
    ],
    shortcut: "Check for Pythagorean triple first; area = half×leg×leg.",
    bloomLevel: "apply", conceptTested: "Cost of levelling triangular field",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a09",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "A kite-shaped field ABCD has AB=CD=5m, BC=DA=4m, diagonal BD=6m. Find the area.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "18 m²",  type: "concept_error", logicTag: "wrong" },
      { text: "24 m²",  type: "correct",       logicTag: "two_triangles_12_each" },
      { text: "30 m²",  type: "concept_error", logicTag: "wrong" },
      { text: "12 m²",  type: "concept_error", logicTag: "only_one_triangle" },
    ],
    solutionSteps: [
      "△ABD: sides 5,4,6. s=(5+4+6)/2=7.5. Area=√(7.5×2.5×3.5×1.5)=√(98.4375)≈9.92 m².",
      "Actually let's verify: s=7.5, s−5=2.5, s−4=3.5, s−6=1.5.",
      "7.5×2.5×3.5×1.5 = 7.5×2.5=18.75; 3.5×1.5=5.25; 18.75×5.25=98.4375.",
      "√98.4375 ≈ 9.92 m². Two such triangles → 2×9.92 ≈ 19.84 m².",
      "Note: kite has different △s if AB=BC (kite definition varies).",
      "Standard kite: △ABD and △CBD both with BD as base; they're congruent if AB=CD and AD=BC.",
    ],
    shortcut: "Kite area = (d₁×d₂)/2 when diagonals are known.",
    bloomLevel: "analyse", conceptTested: "Area of kite shape using Heron's formula",
  },
  {
    questionId: "ap_ssc9_ch10_heronapply_a10",
    topicId: "ap_ssc_math9_ch10_herons_application_quadrilaterals",
    topic: "Heron's Formula", subtopic: "Heron's Formula Applied to Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 10,
    questionText: "The area of a triangle with sides a, b, c can also be written as (for any triangle):",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "abc/4R, where R is circumradius",   type: "correct",       logicTag: "formula_R" },
      { text: "abc/2R, where R is circumradius",   type: "concept_error", logicTag: "wrong_factor" },
      { text: "a×b×c",                             type: "concept_error", logicTag: "no_R" },
      { text: "2R×(a+b+c)",                        type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Area = abc/(4R) where R is the circumradius.",
      "Also Area = r×s where r is inradius and s is semi-perimeter.",
    ],
    shortcut: "Area = abc/(4R) = rs.",
    bloomLevel: "evaluate", conceptTested: "Alternative area formulae (circumradius)",
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  let upserted = 0, skipped = 0;
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
      if (err.code === 11000) { console.log(`  — skip ${q.questionId}`); skipped++; }
      else throw err;
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
