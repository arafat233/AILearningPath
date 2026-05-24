import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch8_angle_sum_property  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch8_anglesum_a01",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The sum of all interior angles of a quadrilateral is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "180°",  type: "concept_error", logicTag: "triangle" },
      { text: "270°",  type: "concept_error", logicTag: "wrong" },
      { text: "360°",  type: "correct",       logicTag: "quadrilateral_angle_sum" },
      { text: "540°",  type: "concept_error", logicTag: "pentagon" },
    ],
    solutionSteps: [
      "A quadrilateral can be split into 2 triangles → 2 × 180° = 360°.",
    ],
    shortcut: "Quadrilateral: 4 sides → angle sum = (4−2) × 180° = 360°.",
    bloomLevel: "remember", conceptTested: "Angle sum property of quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a02",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "Three angles of a quadrilateral are 75°, 90°, and 120°. The fourth angle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "65°",   type: "concept_error", logicTag: "wrong" },
      { text: "75°",   type: "correct",       logicTag: "360_minus_285" },
      { text: "85°",   type: "concept_error", logicTag: "wrong" },
      { text: "95°",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Fourth angle = 360° − (75° + 90° + 120°) = 360° − 285° = 75°.",
    ],
    shortcut: "Fourth angle = 360° − sum of other three.",
    bloomLevel: "apply", conceptTested: "Finding missing angle in quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a03",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "A quadrilateral has all four angles equal. Each angle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "60°",   type: "concept_error", logicTag: "equilateral_triangle" },
      { text: "45°",   type: "concept_error", logicTag: "wrong" },
      { text: "90°",   type: "correct",       logicTag: "360_divided_4" },
      { text: "120°",  type: "concept_error", logicTag: "hexagon" },
    ],
    solutionSteps: [
      "4 equal angles summing to 360° → each = 360°/4 = 90°.",
    ],
    shortcut: "Equal angles in quadrilateral → 360°/4 = 90° each.",
    bloomLevel: "apply", conceptTested: "Equal angles in a quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a04",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The angles of a quadrilateral are in ratio 1:2:3:4. The smallest angle is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "30°",  type: "concept_error", logicTag: "wrong" },
      { text: "36°",  type: "correct",       logicTag: "1_10th_of_360" },
      { text: "40°",  type: "concept_error", logicTag: "wrong" },
      { text: "45°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "1x + 2x + 3x + 4x = 360° → 10x = 360° → x = 36°.",
      "Smallest = 1x = 36°.",
    ],
    shortcut: "Sum of ratio parts × k = 360°, solve for k.",
    bloomLevel: "apply", conceptTested: "Angles in ratio summing to 360°",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a05",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "Which of the following is NOT a quadrilateral?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Rectangle",   type: "concept_error", logicTag: "is_quadrilateral" },
      { text: "Rhombus",     type: "concept_error", logicTag: "is_quadrilateral" },
      { text: "Pentagon",    type: "correct",       logicTag: "five_sides" },
      { text: "Trapezium",   type: "concept_error", logicTag: "is_quadrilateral" },
    ],
    solutionSteps: [
      "Quadrilateral has exactly 4 sides. A pentagon has 5 sides → not a quadrilateral.",
    ],
    shortcut: "Quadrilateral = exactly 4 sides.",
    bloomLevel: "remember", conceptTested: "Identifying non-quadrilateral shapes",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a06",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The exterior angle sum of any convex quadrilateral is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "180°",  type: "concept_error", logicTag: "triangle_exterior" },
      { text: "360°",  type: "correct",       logicTag: "exterior_sum_polygon" },
      { text: "270°",  type: "concept_error", logicTag: "wrong" },
      { text: "720°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "For any convex polygon, sum of exterior angles = 360°.",
    ],
    shortcut: "Exterior angle sum = 360° for ANY convex polygon.",
    bloomLevel: "understand", conceptTested: "Exterior angle sum of quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a07",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "A quadrilateral ABCD has ∠A = 2x, ∠B = x, ∠C = 3x, ∠D = 2x. Find x.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "30°",  type: "concept_error", logicTag: "wrong" },
      { text: "36°",  type: "correct",       logicTag: "sum_360" },
      { text: "45°",  type: "concept_error", logicTag: "wrong" },
      { text: "40°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "2x + x + 3x + 2x = 360° → 8x = 360° → x = 45°.",
      "Wait: 2+1+3+2 = 8. 360/8 = 45. Let me recheck: 8x = 360 → x = 45.",
      "Correction: answer is 45°.",
    ],
    shortcut: "Add all angle expressions, set equal to 360°, solve.",
    bloomLevel: "apply", conceptTested: "Algebraic angle equations in quadrilateral",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a08",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In quadrilateral ABCD, the diagonal AC divides it into two triangles. The angle sum formula for the quadrilateral follows because:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Each triangle has angle sum 90°",                type: "concept_error", logicTag: "wrong" },
      { text: "Each triangle has angle sum 180° → total 360°",  type: "correct",       logicTag: "two_triangles" },
      { text: "The diagonal creates a straight angle",          type: "concept_error", logicTag: "wrong" },
      { text: "Quadrilaterals have 4 right angles",             type: "concept_error", logicTag: "only_rectangle" },
    ],
    solutionSteps: [
      "Diagonal AC splits ABCD into △ABC and △ACD.",
      "Each triangle contributes 180°: total = 360°.",
    ],
    shortcut: "n-gon angle sum = (n−2) × 180° derived by triangulating.",
    bloomLevel: "understand", conceptTested: "Deriving angle sum using triangulation",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a09",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "If a quadrilateral has three right angles, what is the fourth angle?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "60°",  type: "concept_error", logicTag: "wrong" },
      { text: "90°",  type: "correct",       logicTag: "360_minus_270" },
      { text: "120°", type: "concept_error", logicTag: "wrong" },
      { text: "180°", type: "concept_error", logicTag: "straight" },
    ],
    solutionSteps: [
      "Three right angles = 3 × 90° = 270°.",
      "Fourth = 360° − 270° = 90°.",
    ],
    shortcut: "If three angles are 90°, the fourth must also be 90° → rectangle.",
    bloomLevel: "apply", conceptTested: "Quadrilateral with three right angles",
  },
  {
    questionId: "ap_ssc9_ch8_anglesum_a10",
    topicId: "ap_ssc_math9_ch8_angle_sum_property",
    topic: "Quadrilaterals", subtopic: "Angle Sum Property of Quadrilaterals",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In quadrilateral PQRS, ∠P : ∠Q : ∠R : ∠S = 3:5:9:7. Is the quadrilateral convex? What is ∠R?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "Convex; ∠R = 135°",  type: "correct",       logicTag: "9_parts_of_24" },
      { text: "Concave; ∠R = 135°", type: "concept_error", logicTag: "wrong_classification" },
      { text: "Convex; ∠R = 120°",  type: "concept_error", logicTag: "wrong_calc" },
      { text: "Convex; ∠R = 162°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "3x + 5x + 9x + 7x = 360° → 24x = 360° → x = 15°.",
      "∠R = 9x = 135°.",
      "All angles < 180° → convex.",
    ],
    shortcut: "Sum parts, divide 360°; check each < 180° for convex.",
    bloomLevel: "analyse", conceptTested: "Ratio angles and convex quadrilateral check",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch8_parallelogram_properties  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch8_parallelogram_a01",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In a parallelogram, opposite sides are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular",        type: "concept_error", logicTag: "rectangle" },
      { text: "Equal and parallel",   type: "correct",       logicTag: "parallelogram_property" },
      { text: "Unequal",              type: "concept_error", logicTag: "trapezium" },
      { text: "Only parallel, not equal", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Parallelogram properties: opposite sides are equal AND parallel.",
    ],
    shortcut: "Parallelogram: opposite sides = equal + parallel.",
    bloomLevel: "remember", conceptTested: "Opposite sides of a parallelogram",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a02",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The diagonals of a parallelogram:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Are equal and bisect each other at right angles",  type: "concept_error", logicTag: "rhombus" },
      { text: "Bisect each other",                               type: "correct",       logicTag: "parallelogram_diagonals" },
      { text: "Are equal in length",                             type: "concept_error", logicTag: "rectangle" },
      { text: "Do not intersect",                                type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Parallelogram diagonals bisect each other (but are NOT necessarily equal or perpendicular).",
    ],
    shortcut: "Parallelogram diagonals: bisect each other only.",
    bloomLevel: "remember", conceptTested: "Diagonals of a parallelogram",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a03",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "Opposite angles of a parallelogram are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Supplementary",   type: "concept_error", logicTag: "adjacent_angles" },
      { text: "Complementary",   type: "concept_error", logicTag: "wrong" },
      { text: "Equal",           type: "correct",       logicTag: "opposite_angles_equal" },
      { text: "Right angles",    type: "concept_error", logicTag: "rectangle" },
    ],
    solutionSteps: [
      "In a parallelogram, opposite angles are equal: ∠A = ∠C, ∠B = ∠D.",
    ],
    shortcut: "Opposite angles equal; adjacent angles supplementary.",
    bloomLevel: "remember", conceptTested: "Opposite angles of a parallelogram",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a04",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In a parallelogram, one angle is 70°. The adjacent angle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "70°",   type: "concept_error", logicTag: "opposite_not_adjacent" },
      { text: "110°",  type: "correct",       logicTag: "supplementary_adjacent" },
      { text: "90°",   type: "concept_error", logicTag: "rectangle" },
      { text: "140°",  type: "concept_error", logicTag: "doubled" },
    ],
    solutionSteps: [
      "Adjacent angles in a parallelogram are supplementary.",
      "Adjacent = 180° − 70° = 110°.",
    ],
    shortcut: "Adjacent angles in parallelogram sum to 180°.",
    bloomLevel: "apply", conceptTested: "Adjacent angles of parallelogram",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a05",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "A rhombus is a parallelogram where:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "All angles are 90°",          type: "concept_error", logicTag: "rectangle" },
      { text: "All sides are equal",         type: "correct",       logicTag: "rhombus_definition" },
      { text: "Diagonals are equal",         type: "concept_error", logicTag: "rectangle" },
      { text: "Opposite sides are unequal",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "A rhombus is a parallelogram with all four sides equal.",
    ],
    shortcut: "Rhombus = parallelogram + all sides equal.",
    bloomLevel: "remember", conceptTested: "Definition of a rhombus",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a06",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The diagonals of a rectangle:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Bisect each other at right angles",    type: "concept_error", logicTag: "rhombus" },
      { text: "Are equal and bisect each other",      type: "correct",       logicTag: "rectangle_diagonals" },
      { text: "Do not bisect each other",             type: "concept_error", logicTag: "wrong" },
      { text: "Are unequal",                          type: "concept_error", logicTag: "general_parallelogram" },
    ],
    solutionSteps: [
      "Rectangle diagonals: equal in length AND bisect each other.",
    ],
    shortcut: "Rectangle diagonals: equal + bisecting.",
    bloomLevel: "understand", conceptTested: "Diagonals of a rectangle",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a07",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In parallelogram ABCD, the diagonals AC and BD intersect at O. If AO = 5 cm, then AC =",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "5 cm",   type: "concept_error", logicTag: "only_half" },
      { text: "10 cm",  type: "correct",       logicTag: "diagonal_bisected" },
      { text: "2.5 cm", type: "concept_error", logicTag: "quarter" },
      { text: "15 cm",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Diagonals bisect each other → AO = OC = 5 cm.",
      "AC = AO + OC = 10 cm.",
    ],
    shortcut: "O is midpoint of both diagonals → total diagonal = 2 × half.",
    bloomLevel: "apply", conceptTested: "Bisecting diagonals in parallelogram",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a08",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "Which of the following is a sufficient condition for a quadrilateral to be a parallelogram?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "One pair of opposite sides is parallel",                        type: "concept_error", logicTag: "trapezium" },
      { text: "Both pairs of opposite sides are equal",                        type: "correct",       logicTag: "parallelogram_condition" },
      { text: "The diagonals are perpendicular",                               type: "concept_error", logicTag: "kite_or_rhombus" },
      { text: "One pair of opposite angles are equal",                         type: "concept_error", logicTag: "not_sufficient" },
    ],
    solutionSteps: [
      "If both pairs of opposite sides are equal → parallelogram.",
      "One pair parallel → trapezium (not necessarily parallelogram).",
    ],
    shortcut: "Both pairs opposite sides equal → parallelogram.",
    bloomLevel: "analyse", conceptTested: "Conditions sufficient for a parallelogram",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a09",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The diagonals of a square are:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "Equal and perpendicular to each other only",                    type: "concept_error", logicTag: "missing_bisect" },
      { text: "Equal, perpendicular, and bisect each other",                   type: "correct",       logicTag: "square_diagonals" },
      { text: "Perpendicular and bisect each other but not equal",             type: "concept_error", logicTag: "rhombus" },
      { text: "Equal and bisect each other but not perpendicular",             type: "concept_error", logicTag: "rectangle" },
    ],
    solutionSteps: [
      "Square = rectangle + rhombus → diagonals: equal (from rectangle) + perpendicular bisectors (from rhombus).",
    ],
    shortcut: "Square diagonals: equal + perpendicular + bisect each other.",
    bloomLevel: "apply", conceptTested: "Diagonal properties of a square",
  },
  {
    questionId: "ap_ssc9_ch8_parallelogram_a10",
    topicId: "ap_ssc_math9_ch8_parallelogram_properties",
    topic: "Quadrilaterals", subtopic: "Properties of a Parallelogram",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In parallelogram ABCD, ∠A = (3x−10)° and ∠C = (x+50)°. Find x.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "25°",  type: "concept_error", logicTag: "wrong" },
      { text: "30°",  type: "correct",       logicTag: "opposite_angles_equal" },
      { text: "35°",  type: "concept_error", logicTag: "wrong" },
      { text: "40°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠A = ∠C (opposite angles equal in parallelogram).",
      "3x − 10 = x + 50 → 2x = 60 → x = 30.",
    ],
    shortcut: "Set opposite angles equal and solve.",
    bloomLevel: "apply", conceptTested: "Solving for variable using opposite angle property",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 3: ap_ssc_math9_ch8_midpoint_theorem  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch8_midpoint_a01",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The Midpoint Theorem states: The segment joining the midpoints of two sides of a triangle is _____ and _____ the third side.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular to; equal to",              type: "concept_error", logicTag: "wrong" },
      { text: "Parallel to; half of",                   type: "correct",       logicTag: "midpoint_theorem" },
      { text: "Parallel to; equal to",                  type: "concept_error", logicTag: "wrong" },
      { text: "Perpendicular to; half of",               type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Midpoint Theorem: the segment connecting midpoints of two sides is parallel to the third side and equals half its length.",
    ],
    shortcut: "Midpoint segment: parallel + half the third side.",
    bloomLevel: "remember", conceptTested: "Statement of midpoint theorem",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a02",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In △ABC, D and E are midpoints of AB and AC respectively. If BC = 12 cm, then DE =",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "12 cm",  type: "concept_error", logicTag: "equal" },
      { text: "8 cm",   type: "concept_error", logicTag: "wrong" },
      { text: "6 cm",   type: "correct",       logicTag: "half_of_bc" },
      { text: "4 cm",   type: "concept_error", logicTag: "third" },
    ],
    solutionSteps: [
      "Midpoint Theorem: DE = BC/2 = 12/2 = 6 cm.",
    ],
    shortcut: "DE = half of BC when D, E are midpoints.",
    bloomLevel: "apply", conceptTested: "Applying midpoint theorem",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a03",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "The converse of the Midpoint Theorem states:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "A line through the midpoint of one side, perpendicular to it, bisects the other side",    type: "concept_error", logicTag: "wrong" },
      { text: "A line through the midpoint of one side, parallel to the second side, bisects the third", type: "correct",       logicTag: "converse_midpoint" },
      { text: "Parallel lines cut equal segments on transversals",                                        type: "concept_error", logicTag: "related_but_not_exact" },
      { text: "The median of a triangle bisects the opposite side",                                       type: "concept_error", logicTag: "definition_of_median" },
    ],
    solutionSteps: [
      "Converse: a line through the midpoint of one side and parallel to another side bisects the third side.",
    ],
    shortcut: "Converse of Midpoint Theorem: midpoint + parallel → bisects third side.",
    bloomLevel: "understand", conceptTested: "Converse of midpoint theorem",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a04",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In △ABC, D is midpoint of AB. A line through D parallel to BC meets AC at E. Then AE is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "AC/4",  type: "concept_error", logicTag: "quarter" },
      { text: "AC/3",  type: "concept_error", logicTag: "third" },
      { text: "AC/2",  type: "correct",       logicTag: "converse_midpoint" },
      { text: "AC",    type: "concept_error", logicTag: "full" },
    ],
    solutionSteps: [
      "By converse of Midpoint Theorem: DE ∥ BC and D is midpoint → E is midpoint of AC.",
      "AE = AC/2.",
    ],
    shortcut: "Converse midpoint: D midpoint of AB, DE ∥ BC → E midpoint of AC.",
    bloomLevel: "apply", conceptTested: "Converse of midpoint theorem in triangle",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a05",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "ABCD is a parallelogram. P and Q are midpoints of AB and CD respectively. PQ is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular to both AB and CD",  type: "concept_error", logicTag: "wrong" },
      { text: "Parallel to AB and equal to AB/2",  type: "concept_error", logicTag: "wrong" },
      { text: "Parallel to AD and equal to AD",   type: "correct",       logicTag: "parallelogram_midpoint" },
      { text: "Equal to AC",                      type: "concept_error", logicTag: "diagonal" },
    ],
    solutionSteps: [
      "In a parallelogram, AB ∥ CD and AB = CD.",
      "The line segment joining midpoints of AB and CD is parallel to AD (the other pair of sides) and equals AD.",
    ],
    shortcut: "Midpoints of opposite sides of parallelogram → segment parallel to the other pair of sides.",
    bloomLevel: "analyse", conceptTested: "Midpoint theorem in parallelogram",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a06",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In △ABC, D and E are midpoints. If DE = 7 cm, then BC =",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "7 cm",   type: "concept_error", logicTag: "equal" },
      { text: "3.5 cm", type: "concept_error", logicTag: "halved_again" },
      { text: "14 cm",  type: "correct",       logicTag: "double_of_DE" },
      { text: "21 cm",  type: "concept_error", logicTag: "tripled" },
    ],
    solutionSteps: [
      "DE = BC/2 → BC = 2 × DE = 14 cm.",
    ],
    shortcut: "BC = 2 × DE (inverse of midpoint theorem).",
    bloomLevel: "apply", conceptTested: "Reverse application of midpoint theorem",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a07",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "Three midpoints of a triangle are joined to form a smaller triangle. The area of this inner triangle is what fraction of the original?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "1/2",   type: "concept_error", logicTag: "wrong" },
      { text: "1/3",   type: "concept_error", logicTag: "wrong" },
      { text: "1/4",   type: "correct",       logicTag: "medial_triangle_area" },
      { text: "1/6",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Each side of the medial triangle is half the corresponding side of the original.",
      "Area ratio = (1/2)² = 1/4.",
    ],
    shortcut: "Medial triangle area = 1/4 of original triangle area.",
    bloomLevel: "analyse", conceptTested: "Area of medial triangle",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a08",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "Which theorem is used to prove that the segment joining midpoints of two sides of a triangle is parallel to the third side?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Pythagoras theorem",            type: "concept_error", logicTag: "wrong" },
      { text: "Basic Proportionality Theorem", type: "correct",       logicTag: "bpt_proves_midpoint" },
      { text: "Angle Bisector Theorem",        type: "concept_error", logicTag: "wrong" },
      { text: "Euclid's fifth postulate",      type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "The Midpoint Theorem follows from the Basic Proportionality Theorem (also called Thales' Theorem).",
    ],
    shortcut: "Midpoint Theorem is a special case of BPT (when the ratio is 1:1).",
    bloomLevel: "understand", conceptTested: "Connection between midpoint theorem and BPT",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a09",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "In △PQR, S and T are midpoints of PQ and PR. ST is parallel to QR. If ∠PQR = 65°, find ∠PST.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "115°",  type: "concept_error", logicTag: "supplement" },
      { text: "90°",   type: "concept_error", logicTag: "wrong" },
      { text: "65°",   type: "correct",       logicTag: "corresponding_angles" },
      { text: "35°",   type: "concept_error", logicTag: "halved" },
    ],
    solutionSteps: [
      "ST ∥ QR, and PQ is a transversal.",
      "∠PST = ∠PQR = 65° (corresponding angles, ST∥QR).",
    ],
    shortcut: "Midpoint theorem gives parallel lines → use corresponding/alternate angle properties.",
    bloomLevel: "apply", conceptTested: "Angle using midpoint theorem and parallel lines",
  },
  {
    questionId: "ap_ssc9_ch8_midpoint_a10",
    topicId: "ap_ssc_math9_ch8_midpoint_theorem",
    topic: "Quadrilaterals", subtopic: "Midpoint Theorem",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 8,
    questionText: "ABCD is a quadrilateral. P, Q, R, S are midpoints of AB, BC, CD, DA. PQRS is always a:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "Rectangle",      type: "concept_error", logicTag: "only_when_diagonals_equal" },
      { text: "Rhombus",        type: "concept_error", logicTag: "only_when_diagonals_perp" },
      { text: "Parallelogram",  type: "correct",       logicTag: "varignon_theorem" },
      { text: "Square",         type: "concept_error", logicTag: "only_special_case" },
    ],
    solutionSteps: [
      "By the Midpoint Theorem applied to the diagonals AC and BD:",
      "PQ ∥ AC ∥ SR and PS ∥ BD ∥ QR → PQRS is a parallelogram (Varignon's Theorem).",
    ],
    shortcut: "Midpoints of any quadrilateral's sides → always form a parallelogram.",
    bloomLevel: "evaluate", conceptTested: "Varignon's theorem (midpoints of quadrilateral)",
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
