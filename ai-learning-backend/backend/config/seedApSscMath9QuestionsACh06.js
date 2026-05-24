import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch6_basic_terms_angles  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch6_angles_a01",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Two angles are supplementary if their sum is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "90°",   type: "concept_error", logicTag: "complementary" },
      { text: "180°",  type: "correct",       logicTag: "supplementary" },
      { text: "270°",  type: "concept_error", logicTag: "wrong" },
      { text: "360°",  type: "concept_error", logicTag: "full_angle" },
    ],
    solutionSteps: [
      "Supplementary angles sum to 180°.",
      "Complementary angles sum to 90°.",
    ],
    shortcut: "Supplementary → 180° (S comes after C; Supplementary > Complementary).",
    bloomLevel: "remember", conceptTested: "Definition of supplementary angles",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a02",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "The complement of 37° is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "143°",  type: "concept_error", logicTag: "supplement" },
      { text: "53°",   type: "correct",       logicTag: "90_minus_37" },
      { text: "63°",   type: "concept_error", logicTag: "wrong" },
      { text: "47°",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Complement = 90° − 37° = 53°.",
    ],
    shortcut: "Complement = 90° − angle.",
    bloomLevel: "apply", conceptTested: "Finding the complement of an angle",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a03",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Vertically opposite angles are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Supplementary",  type: "concept_error", logicTag: "wrong" },
      { text: "Complementary",  type: "concept_error", logicTag: "wrong" },
      { text: "Equal",          type: "correct",       logicTag: "vertical_angles_equal" },
      { text: "Adjacent",       type: "concept_error", logicTag: "sharing_side" },
    ],
    solutionSteps: [
      "Vertically opposite angles are formed when two lines intersect and are always equal.",
    ],
    shortcut: "Vertical angles (X-shape) → always equal.",
    bloomLevel: "remember", conceptTested: "Vertically opposite angles",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a04",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "An angle greater than 180° but less than 360° is called:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Obtuse angle",  type: "concept_error", logicTag: "between_90_180" },
      { text: "Right angle",   type: "concept_error", logicTag: "90_degrees" },
      { text: "Reflex angle",  type: "correct",       logicTag: "greater_than_180" },
      { text: "Straight angle", type: "concept_error", logicTag: "exactly_180" },
    ],
    solutionSteps: [
      "Reflex angle: 180° < angle < 360°.",
    ],
    shortcut: "Reflex = 'beyond straight'. Acute < 90 < Right = 90 < Obtuse < 180 < Reflex < 360.",
    bloomLevel: "remember", conceptTested: "Types of angles",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a05",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Two angles forming a linear pair sum to:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "90°",   type: "concept_error", logicTag: "complementary" },
      { text: "180°",  type: "correct",       logicTag: "linear_pair" },
      { text: "360°",  type: "concept_error", logicTag: "full_rotation" },
      { text: "270°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "A linear pair of angles is formed when two rays have a common vertex and their non-common sides form a straight line.",
      "They always sum to 180°.",
    ],
    shortcut: "Linear pair → on a straight line → 180°.",
    bloomLevel: "remember", conceptTested: "Linear pair of angles",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a06",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "If two adjacent angles are supplementary and form a straight line, they are called:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Vertically opposite angles",  type: "concept_error", logicTag: "opposite_not_adjacent" },
      { text: "Complementary angles",        type: "concept_error", logicTag: "sum_90" },
      { text: "A linear pair",               type: "correct",       logicTag: "linear_pair_definition" },
      { text: "Alternate angles",            type: "concept_error", logicTag: "transversal" },
    ],
    solutionSteps: [
      "Adjacent supplementary angles on a straight line form a linear pair.",
    ],
    shortcut: "Adjacent + supplementary on straight line = linear pair.",
    bloomLevel: "understand", conceptTested: "Definition of a linear pair",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a07",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "If one angle of a linear pair is 75°, the other angle is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "15°",   type: "concept_error", logicTag: "complement" },
      { text: "105°",  type: "correct",       logicTag: "180_minus_75" },
      { text: "75°",   type: "concept_error", logicTag: "equal_angles_wrong" },
      { text: "285°",  type: "concept_error", logicTag: "reflex" },
    ],
    solutionSteps: [
      "Linear pair sums to 180°.",
      "Other angle = 180° − 75° = 105°.",
    ],
    shortcut: "Other angle of linear pair = 180° − given angle.",
    bloomLevel: "apply", conceptTested: "Calculating angle in a linear pair",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a08",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Three rays OA, OB, OC emanate from point O. If ∠AOB = 55° and ∠BOC = 35°, what is ∠AOC?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "20°",   type: "concept_error", logicTag: "subtracted" },
      { text: "90°",   type: "correct",       logicTag: "55_plus_35" },
      { text: "180°",  type: "concept_error", logicTag: "straight_line" },
      { text: "100°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠AOC = ∠AOB + ∠BOC = 55° + 35° = 90°.",
    ],
    shortcut: "Angles sharing a common ray add up (angle addition postulate).",
    bloomLevel: "apply", conceptTested: "Angle addition postulate",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a09",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "When two lines intersect, the sum of all four angles formed is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "180°",  type: "concept_error", logicTag: "only_two_angles" },
      { text: "270°",  type: "concept_error", logicTag: "three_angles" },
      { text: "360°",  type: "correct",       logicTag: "full_rotation" },
      { text: "720°",  type: "concept_error", logicTag: "double_counted" },
    ],
    solutionSteps: [
      "The four angles around a point sum to 360°.",
    ],
    shortcut: "Angles at a point (all around) = 360°.",
    bloomLevel: "apply", conceptTested: "Sum of angles at a point",
  },
  {
    questionId: "ap_ssc9_ch6_angles_a10",
    topicId: "ap_ssc_math9_ch6_basic_terms_angles",
    topic: "Lines and Angles", subtopic: "Basic Terms and Angles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Two complementary angles are in the ratio 2:3. The larger angle is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "36°",  type: "concept_error", logicTag: "smaller_angle" },
      { text: "54°",  type: "correct",       logicTag: "3_parts_of_90" },
      { text: "60°",  type: "concept_error", logicTag: "wrong" },
      { text: "72°",  type: "concept_error", logicTag: "supplementary_ratio" },
    ],
    solutionSteps: [
      "Ratio 2:3 → parts: 2x + 3x = 90° → 5x = 90° → x = 18°.",
      "Larger angle = 3x = 54°.",
    ],
    shortcut: "Set up 2x + 3x = 90, solve for x, find 3x.",
    bloomLevel: "apply", conceptTested: "Finding angles in a given ratio",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch6_parallel_lines_transversal  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a01",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Alternate interior angles formed when a transversal crosses parallel lines are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Supplementary",  type: "concept_error", logicTag: "co_interior" },
      { text: "Complementary",  type: "concept_error", logicTag: "wrong" },
      { text: "Equal",          type: "correct",       logicTag: "alternate_interior_equal" },
      { text: "Unrelated",      type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "When a transversal crosses parallel lines, alternate interior angles are equal (Z-angles).",
    ],
    shortcut: "Alternate = Z-shape angles → equal.",
    bloomLevel: "remember", conceptTested: "Alternate interior angles",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a02",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Co-interior angles (same-side interior angles) are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Equal",          type: "concept_error", logicTag: "alternate_not_co" },
      { text: "Supplementary",  type: "correct",       logicTag: "co_interior_180" },
      { text: "Complementary",  type: "concept_error", logicTag: "wrong" },
      { text: "Vertically opposite", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Co-interior (same-side interior) angles sum to 180° when lines are parallel.",
    ],
    shortcut: "Co-interior = C-shape angles → supplementary (sum 180°).",
    bloomLevel: "remember", conceptTested: "Co-interior angles",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a03",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Corresponding angles formed by a transversal and parallel lines are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Supplementary",  type: "concept_error", logicTag: "co_interior" },
      { text: "Vertically opposite", type: "concept_error", logicTag: "wrong" },
      { text: "Equal",          type: "correct",       logicTag: "corresponding_equal" },
      { text: "Complementary",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Corresponding angles (F-shape) are equal when lines are parallel.",
    ],
    shortcut: "Corresponding = F-shape → equal.",
    bloomLevel: "remember", conceptTested: "Corresponding angles",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a04",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "A transversal makes an angle of 65° with one parallel line. The alternate interior angle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "25°",   type: "concept_error", logicTag: "complement" },
      { text: "115°",  type: "concept_error", logicTag: "supplement" },
      { text: "65°",   type: "correct",       logicTag: "alternate_equal" },
      { text: "130°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Alternate interior angles are equal → 65°.",
    ],
    shortcut: "Alternate interior = same angle value.",
    bloomLevel: "apply", conceptTested: "Finding alternate interior angle",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a05",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "If co-interior angles are (3x + 10)° and (2x + 20)°, find x if lines are parallel.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "24",  type: "concept_error", logicTag: "wrong" },
      { text: "30",  type: "correct",       logicTag: "sum_180" },
      { text: "32",  type: "concept_error", logicTag: "wrong" },
      { text: "36",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Co-interior angles sum to 180°.",
      "(3x+10) + (2x+20) = 180.",
      "5x + 30 = 180 → 5x = 150 → x = 30.",
    ],
    shortcut: "Set up co-interior sum = 180°, solve for variable.",
    bloomLevel: "apply", conceptTested: "Solving for variable using co-interior angles",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a06",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Alternate exterior angles are:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Always supplementary",   type: "concept_error", logicTag: "co_interior" },
      { text: "Always equal",           type: "correct",       logicTag: "alternate_exterior" },
      { text: "Never equal",            type: "concept_error", logicTag: "wrong" },
      { text: "Always complementary",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "When lines are parallel, alternate exterior angles are equal (like alternate interior angles, but outside the parallel lines).",
    ],
    shortcut: "All 'alternate' pairs (interior or exterior) are equal when lines are parallel.",
    bloomLevel: "understand", conceptTested: "Alternate exterior angles",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a07",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "A transversal cuts two parallel lines. If one of the co-interior angles is 110°, the other is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "110°",  type: "concept_error", logicTag: "alternate_not_co_interior" },
      { text: "70°",   type: "correct",       logicTag: "180_minus_110" },
      { text: "80°",   type: "concept_error", logicTag: "wrong" },
      { text: "90°",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Co-interior angles sum to 180°.",
      "Other = 180° − 110° = 70°.",
    ],
    shortcut: "Co-interior: 180° − one = the other.",
    bloomLevel: "apply", conceptTested: "Finding co-interior angle",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a08",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "If corresponding angles are equal, then the lines cut by the transversal are:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular",   type: "concept_error", logicTag: "wrong" },
      { text: "Parallel",        type: "correct",       logicTag: "converse_corresponding" },
      { text: "Intersecting",    type: "concept_error", logicTag: "wrong" },
      { text: "Coincident",      type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Converse: if corresponding angles are equal → lines are parallel.",
    ],
    shortcut: "Corresponding equal → parallel (and vice versa).",
    bloomLevel: "apply", conceptTested: "Converse of corresponding angles theorem",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a09",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Two parallel lines are cut by a transversal. The ratio of co-interior angles is 2:7. The smaller angle is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "20°",  type: "concept_error", logicTag: "wrong" },
      { text: "40°",  type: "correct",       logicTag: "2_9th_of_180" },
      { text: "45°",  type: "concept_error", logicTag: "wrong" },
      { text: "70°",  type: "concept_error", logicTag: "larger" },
    ],
    solutionSteps: [
      "2x + 7x = 180° → 9x = 180° → x = 20°.",
      "Smaller = 2x = 40°.",
    ],
    shortcut: "Set ratio parts × k so they sum to 180°.",
    bloomLevel: "apply", conceptTested: "Finding angles in a ratio (co-interior)",
  },
  {
    questionId: "ap_ssc9_ch6_paralleltrans_a10",
    topicId: "ap_ssc_math9_ch6_parallel_lines_transversal",
    topic: "Lines and Angles", subtopic: "Parallel Lines and a Transversal",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Lines l ∥ m. A transversal t cuts both. If ∠1 = 3x and ∠2 = (2x + 40)° are alternate interior angles, find x.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "30",  type: "concept_error", logicTag: "wrong" },
      { text: "35",  type: "concept_error", logicTag: "wrong" },
      { text: "40",  type: "correct",       logicTag: "3x_equals_2x_plus_40" },
      { text: "45",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Alternate interior angles are equal: 3x = 2x + 40.",
      "x = 40.",
    ],
    shortcut: "Alternate angles equal → set expressions equal and solve.",
    bloomLevel: "apply", conceptTested: "Solving algebraic angle equation with parallel lines",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 3: ap_ssc_math9_ch6_lines_parallel_to_same_line  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a01",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "If line l ∥ line m and line m ∥ line n, then:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "l ⊥ n",    type: "concept_error", logicTag: "perpendicular" },
      { text: "l ∥ n",    type: "correct",       logicTag: "transitive_parallel" },
      { text: "l and n intersect at one point", type: "concept_error", logicTag: "wrong" },
      { text: "l = n",    type: "concept_error", logicTag: "coincident_wrong" },
    ],
    solutionSteps: [
      "Transitivity of parallel lines: l ∥ m and m ∥ n → l ∥ n.",
    ],
    shortcut: "Parallel is transitive: l∥m, m∥n → l∥n.",
    bloomLevel: "understand", conceptTested: "Transitivity of parallel lines",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a02",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "If two lines are perpendicular to the same line, they are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular to each other",  type: "concept_error", logicTag: "wrong" },
      { text: "Parallel to each other",       type: "correct",       logicTag: "perp_to_same_parallel" },
      { text: "Coincident",                   type: "concept_error", logicTag: "wrong" },
      { text: "Cannot be determined",         type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "If l ⊥ t and m ⊥ t, then l and m make equal angles (90°) with t → l ∥ m.",
    ],
    shortcut: "Two lines perpendicular to the same transversal → parallel to each other.",
    bloomLevel: "apply", conceptTested: "Lines perpendicular to the same line are parallel",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a03",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Three parallel lines a, b, c are cut by a transversal. The transversal makes an angle of 70° with line a. The angle with line c is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "110°",  type: "concept_error", logicTag: "supplement" },
      { text: "35°",   type: "concept_error", logicTag: "halved" },
      { text: "70°",   type: "correct",       logicTag: "parallel_same_angle" },
      { text: "140°",  type: "concept_error", logicTag: "doubled" },
    ],
    solutionSteps: [
      "All three lines are parallel → corresponding angles with the transversal are all equal.",
      "Angle with c = 70°.",
    ],
    shortcut: "Parallel lines cut by same transversal → same corresponding angles.",
    bloomLevel: "apply", conceptTested: "Angle made by transversal with parallel lines",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a04",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "The angle bisectors of two parallel lines are:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular to each other",    type: "concept_error", logicTag: "wrong" },
      { text: "Parallel to each other",         type: "correct",       logicTag: "bisectors_parallel" },
      { text: "Always intersecting at 90°",     type: "concept_error", logicTag: "wrong" },
      { text: "At 45° to the parallel lines",   type: "concept_error", logicTag: "specific_case" },
    ],
    solutionSteps: [
      "If l ∥ m, their angle bisectors (when a transversal cuts them) are also parallel to each other — as they make equal angles with the transversal.",
    ],
    shortcut: "Bisectors of co-interior angles are perpendicular to each other (important property).",
    bloomLevel: "analyse", conceptTested: "Angle bisectors of parallel lines",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a05",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "In the figure, l ∥ m ∥ n. A transversal cuts them at angles ∠1, ∠2, ∠3 respectively. Which relationship is correct?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "∠1 + ∠2 + ∠3 = 180°",   type: "concept_error", logicTag: "wrong" },
      { text: "∠1 = ∠2 = ∠3",           type: "correct",       logicTag: "all_corresponding_equal" },
      { text: "∠1 × ∠2 × ∠3 = 360°",   type: "concept_error", logicTag: "wrong" },
      { text: "∠1 = ∠3 only",           type: "concept_error", logicTag: "only_alternate" },
    ],
    solutionSteps: [
      "All three lines are parallel → the transversal makes the same corresponding angle with each.",
      "∠1 = ∠2 = ∠3.",
    ],
    shortcut: "Same transversal, parallel lines → all corresponding angles equal.",
    bloomLevel: "apply", conceptTested: "Angles with multiple parallel lines",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a06",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Lines p and q are both parallel to line r. Then p and q are:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular",   type: "concept_error", logicTag: "wrong" },
      { text: "Parallel",        type: "correct",       logicTag: "transitivity" },
      { text: "Intersecting",    type: "concept_error", logicTag: "wrong" },
      { text: "Cannot determine", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Theorem: Lines parallel to the same line are parallel to each other (transitivity).",
    ],
    shortcut: "p∥r and q∥r → p∥q.",
    bloomLevel: "apply", conceptTested: "Lines parallel to the same line theorem",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a07",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Which theorem proves: 'If two lines are cut by a transversal such that a pair of alternate interior angles are equal, then the lines are parallel'?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Converse of the corresponding angles theorem",    type: "concept_error", logicTag: "different" },
      { text: "Converse of the alternate interior angles theorem", type: "correct",    logicTag: "converse_alternate" },
      { text: "Euclid's fifth postulate directly",               type: "concept_error", logicTag: "related_but_not_exact" },
      { text: "The angle bisector theorem",                      type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Converse of Alternate Interior Angles Theorem: if alternate interior angles are equal → lines are parallel.",
    ],
    shortcut: "Converse of AIA theorem → parallel lines.",
    bloomLevel: "understand", conceptTested: "Converse of alternate interior angles theorem",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a08",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "Three lines l, m, n in a plane. l ∥ m and n intersects both. How many intersection points does n make with l and m?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "0",  type: "concept_error", logicTag: "wrong" },
      { text: "1",  type: "concept_error", logicTag: "parallel_share_only_1" },
      { text: "2",  type: "correct",       logicTag: "two_distinct_intersections" },
      { text: "3",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "n crosses l at one point and m at another (since l ∥ m, they don't share intersection points).",
      "Total: 2 intersection points.",
    ],
    shortcut: "Transversal cutting 2 parallel lines → 2 intersection points.",
    bloomLevel: "apply", conceptTested: "Intersections of transversal with parallel lines",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a09",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "In triangle ABC, DE is drawn parallel to BC where D is on AB and E is on AC. If ∠BDE = 70°, find ∠ABC.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "110°",  type: "concept_error", logicTag: "supplement" },
      { text: "70°",   type: "correct",       logicTag: "corresponding_angles" },
      { text: "35°",   type: "concept_error", logicTag: "halved" },
      { text: "140°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "DE ∥ BC, with AB as transversal.",
      "∠BDE and ∠ABC are corresponding angles.",
      "∠ABC = ∠BDE = 70°.",
    ],
    shortcut: "Parallel line inside triangle → corresponding angles with sides.",
    bloomLevel: "apply", conceptTested: "Corresponding angles with parallel line in triangle",
  },
  {
    questionId: "ap_ssc9_ch6_parallelsameline_a10",
    topicId: "ap_ssc_math9_ch6_lines_parallel_to_same_line",
    topic: "Lines and Angles", subtopic: "Lines Parallel to the Same Line",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 6,
    questionText: "If l ∥ m and a transversal t is perpendicular to l, then the angle between t and m is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "45°",  type: "concept_error", logicTag: "wrong" },
      { text: "60°",  type: "concept_error", logicTag: "wrong" },
      { text: "90°",  type: "correct",       logicTag: "perpendicular_to_parallel" },
      { text: "180°", type: "concept_error", logicTag: "straight_line" },
    ],
    solutionSteps: [
      "t ⊥ l means t makes 90° with l.",
      "l ∥ m → corresponding angles: t also makes 90° with m.",
    ],
    shortcut: "A line perpendicular to one of two parallel lines is perpendicular to both.",
    bloomLevel: "analyse", conceptTested: "Perpendicularity and parallel lines",
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
