import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch7_congruence_of_triangles  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch7_congruence_a01",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "Two triangles are congruent if they have:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Same angles only",               type: "concept_error", logicTag: "similar_not_congruent" },
      { text: "Same perimeter only",            type: "concept_error", logicTag: "wrong" },
      { text: "Exactly the same shape and size", type: "correct",      logicTag: "congruence_definition" },
      { text: "Equal areas only",               type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Congruent triangles are identical in shape and size — one can be superimposed on the other exactly.",
    ],
    shortcut: "Congruent = same shape AND same size.",
    bloomLevel: "remember", conceptTested: "Definition of congruent triangles",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a02",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "Which congruence criterion uses two sides and the included angle?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "SSS",  type: "concept_error", logicTag: "three_sides" },
      { text: "SAS",  type: "correct",       logicTag: "two_sides_included_angle" },
      { text: "ASA",  type: "concept_error", logicTag: "two_angles_included_side" },
      { text: "RHS",  type: "concept_error", logicTag: "right_angle" },
    ],
    solutionSteps: [
      "SAS (Side-Angle-Side): two sides and the angle between them (included angle).",
    ],
    shortcut: "SAS = 2 sides + included angle.",
    bloomLevel: "remember", conceptTested: "SAS congruence criterion",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a03",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "Which is NOT a valid congruence criterion for triangles?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "SSS",  type: "concept_error", logicTag: "valid" },
      { text: "ASA",  type: "concept_error", logicTag: "valid" },
      { text: "AAA",  type: "correct",       logicTag: "similar_not_congruent" },
      { text: "SAS",  type: "concept_error", logicTag: "valid" },
    ],
    solutionSteps: [
      "AAA (Angle-Angle-Angle) proves similarity, NOT congruence — the triangles could be different sizes.",
    ],
    shortcut: "AAA → similar (same shape), not necessarily congruent (same size).",
    bloomLevel: "understand", conceptTested: "AAA is not a congruence criterion",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a04",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "The RHS congruence rule is applicable to:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "All triangles",          type: "concept_error", logicTag: "too_broad" },
      { text: "Isosceles triangles",    type: "concept_error", logicTag: "wrong" },
      { text: "Right-angled triangles", type: "correct",       logicTag: "rhs_for_right" },
      { text: "Equilateral triangles",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "RHS = Right angle, Hypotenuse, Side — applicable only to right-angled triangles.",
    ],
    shortcut: "RHS only works when one angle is 90°.",
    bloomLevel: "remember", conceptTested: "RHS congruence condition",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a05",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In △ABC ≅ △PQR, which side corresponds to AB?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "QR",  type: "concept_error", logicTag: "wrong_order" },
      { text: "PR",  type: "concept_error", logicTag: "wrong_order" },
      { text: "PQ",  type: "correct",       logicTag: "corresponding_order" },
      { text: "RP",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "△ABC ≅ △PQR → A↔P, B↔Q, C↔R.",
      "AB corresponds to PQ.",
    ],
    shortcut: "In △ABC ≅ △PQR, read the vertices in order: 1st↔1st, 2nd↔2nd, 3rd↔3rd.",
    bloomLevel: "apply", conceptTested: "Corresponding parts in congruent triangles",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a06",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "△ABC and △DEF have AB = DE, BC = EF, AC = DF. They are congruent by:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "SAS",  type: "concept_error", logicTag: "only_two_sides" },
      { text: "ASA",  type: "concept_error", logicTag: "wrong" },
      { text: "SSS",  type: "correct",       logicTag: "three_sides_equal" },
      { text: "RHS",  type: "concept_error", logicTag: "right_angle_not_given" },
    ],
    solutionSteps: [
      "All three pairs of sides are equal → SSS criterion.",
    ],
    shortcut: "3 sides equal → SSS.",
    bloomLevel: "apply", conceptTested: "Identifying the congruence criterion (SSS)",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a07",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "CPCT stands for:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Common Parts Can Transfer",                  type: "concept_error", logicTag: "wrong" },
      { text: "Corresponding Parts of Congruent Triangles", type: "correct",       logicTag: "cpct" },
      { text: "Congruent Pairs Can Transform",              type: "concept_error", logicTag: "wrong" },
      { text: "Calculated Parts of Consistent Triangles",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "CPCT = Corresponding Parts of Congruent Triangles (are equal).",
    ],
    shortcut: "CPCT justifies equalities between corresponding sides/angles once congruence is established.",
    bloomLevel: "remember", conceptTested: "CPCT abbreviation and meaning",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a08",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "△ABC has AB = AC. The perpendicular from A to BC bisects BC. This proves (by CPCT) that:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "∠ABC = ∠ACB",  type: "concept_error", logicTag: "related_but_not_shown_here" },
      { text: "BD = DC",       type: "correct",       logicTag: "perpendicular_bisects" },
      { text: "AB = BC",       type: "concept_error", logicTag: "equilateral_assumption" },
      { text: "AD = AB",       type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "△ABD ≅ △ACD (by SAS: AB=AC, ∠ADB=∠ADC=90°, AD common).",
      "By CPCT: BD = DC.",
    ],
    shortcut: "Perpendicular from apex of isosceles triangle bisects the base → CPCT.",
    bloomLevel: "apply", conceptTested: "CPCT in isosceles triangle proof",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a09",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In right △ABC with ∠B = 90°, hypotenuse AC = 10 cm and BC = 6 cm. In right △DEF with ∠E = 90°, DF = 10 cm and EF = 6 cm. The triangles are congruent by:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "SSS",  type: "concept_error", logicTag: "need_all_three" },
      { text: "SAS",  type: "concept_error", logicTag: "need_included_angle" },
      { text: "RHS",  type: "correct",       logicTag: "right_hyp_side" },
      { text: "ASA",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Both have a right angle, equal hypotenuses (10), and one equal leg (6) → RHS criterion.",
    ],
    shortcut: "Right angle + Hypotenuse + one Side → RHS.",
    bloomLevel: "apply", conceptTested: "Applying RHS congruence criterion",
  },
  {
    questionId: "ap_ssc9_ch7_congruence_a10",
    topicId: "ap_ssc_math9_ch7_congruence_of_triangles",
    topic: "Triangles", subtopic: "Congruence of Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "If △PQR ≅ △XYZ, and ∠P = 50°, ∠Q = 70°, then ∠Z =",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "70°",  type: "concept_error", logicTag: "z_corresponds_to_q" },
      { text: "50°",  type: "concept_error", logicTag: "z_corresponds_to_p" },
      { text: "60°",  type: "correct",       logicTag: "180_minus_50_minus_70" },
      { text: "120°", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "△PQR ≅ △XYZ → P↔X, Q↔Y, R↔Z.",
      "∠R = 180° − 50° − 70° = 60°.",
      "∠Z = ∠R = 60°.",
    ],
    shortcut: "Find the missing angle using angle sum = 180°, then use CPCT.",
    bloomLevel: "analyse", conceptTested: "Finding angle using congruence and angle sum",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch7_congruence_criteria  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch7_criteria_a01",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In an isosceles triangle, the angles opposite to the equal sides are:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Supplementary",  type: "concept_error", logicTag: "sum_180" },
      { text: "Equal",          type: "correct",       logicTag: "isosceles_base_angles" },
      { text: "Complementary",  type: "concept_error", logicTag: "sum_90" },
      { text: "Unequal",        type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Isosceles Triangle Theorem: In △ABC, AB = AC → ∠B = ∠C (base angles equal).",
    ],
    shortcut: "Equal sides → equal opposite angles.",
    bloomLevel: "remember", conceptTested: "Isosceles triangle theorem",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a02",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In isosceles △ABC with AB = AC, if ∠A = 40°, then ∠B =",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "40°",  type: "concept_error", logicTag: "apex_angle" },
      { text: "70°",  type: "correct",       logicTag: "half_of_140" },
      { text: "80°",  type: "concept_error", logicTag: "wrong" },
      { text: "50°",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠B + ∠C = 180° − 40° = 140°.",
      "∠B = ∠C (isosceles) → ∠B = 70°.",
    ],
    shortcut: "Base angles = (180° − apex angle) / 2.",
    bloomLevel: "apply", conceptTested: "Finding base angle of isosceles triangle",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a03",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "The converse of the isosceles triangle theorem states: If two angles of a triangle are equal, then:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "The triangle is equilateral",                           type: "concept_error", logicTag: "too_specific" },
      { text: "The sides opposite to those angles are equal",          type: "correct",       logicTag: "converse_isosceles" },
      { text: "The triangle is a right triangle",                      type: "concept_error", logicTag: "wrong" },
      { text: "The third angle must be 60°",                           type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Converse: if ∠B = ∠C, then AB = AC (sides opposite equal angles are equal).",
    ],
    shortcut: "Equal angles → equal opposite sides.",
    bloomLevel: "understand", conceptTested: "Converse of isosceles triangle theorem",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a04",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "△ABC has ∠A = ∠B = ∠C = 60°. What type of triangle is it?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Right triangle",      type: "concept_error", logicTag: "wrong" },
      { text: "Isosceles triangle",  type: "concept_error", logicTag: "all_equal_is_more" },
      { text: "Equilateral triangle", type: "correct",      logicTag: "all_60_equilateral" },
      { text: "Scalene triangle",    type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "All angles = 60° → all sides equal → equilateral triangle.",
    ],
    shortcut: "All angles equal → equilateral.",
    bloomLevel: "apply", conceptTested: "Equilateral triangle from equal angles",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a05",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "ASA congruence criterion requires:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Two angles and any side",           type: "concept_error", logicTag: "aas_not_asa" },
      { text: "Two angles and the included side",  type: "correct",       logicTag: "asa" },
      { text: "Two sides and any angle",           type: "concept_error", logicTag: "wrong" },
      { text: "One angle and two sides",           type: "concept_error", logicTag: "sas" },
    ],
    solutionSteps: [
      "ASA = Angle-Side-Angle: two angles and the side between them (included side).",
    ],
    shortcut: "ASA = 2 angles + included side (the side sandwiched between the angles).",
    bloomLevel: "remember", conceptTested: "ASA congruence criterion",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a06",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In △ABC and △PQR, if AB = PQ, ∠A = ∠P, and ∠B = ∠Q, the criterion used is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "SSS",  type: "concept_error", logicTag: "three_sides" },
      { text: "SAS",  type: "concept_error", logicTag: "two_sides" },
      { text: "AAS",  type: "correct",       logicTag: "two_angles_non_included_side" },
      { text: "RHS",  type: "concept_error", logicTag: "right_angle" },
    ],
    solutionSteps: [
      "AB = PQ (side), ∠A = ∠P (angle at A), ∠B = ∠Q (angle at B).",
      "Side AB is between ∠A and ∠B → it's the included side → ASA… but wait.",
      "AB is opposite ∠C and ∠R, not the included side — this is AAS (Angle-Angle-Side).",
    ],
    shortcut: "Check if the side is between the two angles (ASA) or not (AAS).",
    bloomLevel: "analyse", conceptTested: "Distinguishing ASA from AAS",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a07",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "An isosceles triangle has a base angle of 50°. Find the apex angle.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "80°",  type: "correct",       logicTag: "180_minus_100" },
      { text: "50°",  type: "concept_error", logicTag: "all_equal" },
      { text: "100°", type: "concept_error", logicTag: "doubled_base" },
      { text: "60°",  type: "concept_error", logicTag: "equilateral" },
    ],
    solutionSteps: [
      "Apex = 180° − 2(50°) = 180° − 100° = 80°.",
    ],
    shortcut: "Apex angle = 180° − 2 × base angle.",
    bloomLevel: "apply", conceptTested: "Finding apex angle of isosceles triangle",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a08",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "The perpendicular from the vertex of an isosceles triangle to the base bisects the vertex angle. This is proved by which congruence?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "SSS",  type: "concept_error", logicTag: "only_sides" },
      { text: "SAS",  type: "correct",       logicTag: "sas_proving_bisector" },
      { text: "RHS",  type: "concept_error", logicTag: "only_right_triangles" },
      { text: "ASA",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "In △ABD and △ACD: AB = AC, AD common, ∠ADB = ∠ADC = 90°.",
      "→ SAS congruence → ∠BAD = ∠CAD by CPCT (vertex angle bisected).",
    ],
    shortcut: "Equal sides + right angle + common side → SAS.",
    bloomLevel: "apply", conceptTested: "Perpendicular from apex bisects vertex angle",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a09",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "△ABC is equilateral with side 6 cm. △PQR has all sides 6 cm. The congruence criterion is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "SAS",  type: "concept_error", logicTag: "partial" },
      { text: "ASA",  type: "concept_error", logicTag: "angles_not_given" },
      { text: "SSS",  type: "correct",       logicTag: "all_sides_equal" },
      { text: "RHS",  type: "concept_error", logicTag: "no_right_angle" },
    ],
    solutionSteps: [
      "All three sides of both triangles equal (6 cm each) → SSS criterion.",
    ],
    shortcut: "All sides given and equal → SSS.",
    bloomLevel: "apply", conceptTested: "Applying SSS to equilateral triangles",
  },
  {
    questionId: "ap_ssc9_ch7_criteria_a10",
    topicId: "ap_ssc_math9_ch7_congruence_criteria",
    topic: "Triangles", subtopic: "Congruence Criteria and Isosceles Triangles",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In △ABC and △DEF: ∠A = ∠D = 90°, BC = EF = 13, AB = DE = 5. Name the congruence and find AC.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "SAS; AC = 12",  type: "concept_error", logicTag: "wrong_rule" },
      { text: "RHS; AC = 12",  type: "correct",       logicTag: "rhs_pythagorean" },
      { text: "SSS; AC = 8",   type: "concept_error", logicTag: "wrong" },
      { text: "RHS; AC = 8",   type: "concept_error", logicTag: "wrong_calc" },
    ],
    solutionSteps: [
      "∠A = 90°, hypotenuse BC = EF = 13, leg AB = DE = 5 → RHS congruence.",
      "AC² = BC² − AB² = 169 − 25 = 144 → AC = 12.",
    ],
    shortcut: "RHS: use Pythagorean theorem to find the missing side.",
    bloomLevel: "analyse", conceptTested: "RHS congruence and Pythagorean theorem",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 3: ap_ssc_math9_ch7_triangle_properties_inequalities  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch7_inequality_a01",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "The sum of all interior angles of a triangle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "90°",   type: "concept_error", logicTag: "right_angle" },
      { text: "180°",  type: "correct",       logicTag: "angle_sum_property" },
      { text: "270°",  type: "concept_error", logicTag: "wrong" },
      { text: "360°",  type: "concept_error", logicTag: "quadrilateral" },
    ],
    solutionSteps: [
      "Angle Sum Property: ∠A + ∠B + ∠C = 180° for any triangle.",
    ],
    shortcut: "Triangle angle sum = 180°.",
    bloomLevel: "remember", conceptTested: "Angle sum property of triangle",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a02",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "An exterior angle of a triangle equals:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "The adjacent interior angle",                type: "concept_error", logicTag: "linear_pair_confusion" },
      { text: "Sum of the two non-adjacent interior angles", type: "correct",      logicTag: "exterior_angle_theorem" },
      { text: "Half the sum of all three angles",           type: "concept_error", logicTag: "wrong" },
      { text: "180° minus all interior angles",             type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Exterior Angle Theorem: exterior angle = sum of the two remote interior angles.",
    ],
    shortcut: "Exterior angle = sum of two opposite interior angles.",
    bloomLevel: "remember", conceptTested: "Exterior angle theorem",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a03",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "If the exterior angle of a triangle is 115° and one non-adjacent interior angle is 50°, the other non-adjacent angle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "50°",  type: "concept_error", logicTag: "equal_to_given" },
      { text: "65°",  type: "correct",       logicTag: "115_minus_50" },
      { text: "75°",  type: "concept_error", logicTag: "wrong" },
      { text: "180°", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Ext. angle = sum of two remote interior angles.",
      "115° = 50° + x → x = 65°.",
    ],
    shortcut: "Missing remote interior angle = exterior angle − given remote angle.",
    bloomLevel: "apply", conceptTested: "Applying exterior angle theorem",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a04",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In a triangle, the side opposite to the largest angle is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "The shortest side",     type: "concept_error", logicTag: "inverted" },
      { text: "The longest side",      type: "correct",       logicTag: "angle_side_inequality" },
      { text: "Any side",              type: "concept_error", logicTag: "wrong" },
      { text: "A side equal to another", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "In a triangle: larger angle → longer opposite side.",
      "The largest angle is opposite the longest side.",
    ],
    shortcut: "Bigger angle ↔ longer opposite side.",
    bloomLevel: "understand", conceptTested: "Angle-side relationship in triangles",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a05",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "Which set of lengths can form a valid triangle?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "1 cm, 2 cm, 3 cm",  type: "concept_error", logicTag: "1+2=3_not_greater" },
      { text: "3 cm, 4 cm, 5 cm",  type: "correct",       logicTag: "3+4>5" },
      { text: "5 cm, 5 cm, 11 cm", type: "concept_error", logicTag: "5+5<11" },
      { text: "7 cm, 3 cm, 4 cm",  type: "concept_error", logicTag: "3+4=7_not_greater" },
    ],
    solutionSteps: [
      "Triangle inequality: sum of any two sides > third side.",
      "3+4=7>5 ✓, 3+5=8>4 ✓, 4+5=9>3 ✓ → (3,4,5) valid.",
      "(1,2,3): 1+2=3, not > → invalid.",
    ],
    shortcut: "Check: sum of two smallest sides > largest side.",
    bloomLevel: "apply", conceptTested: "Triangle inequality theorem",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a06",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "The difference of any two sides of a triangle is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Greater than the third side",  type: "concept_error", logicTag: "inverted_inequality" },
      { text: "Less than the third side",     type: "correct",       logicTag: "difference_inequality" },
      { text: "Equal to the third side",      type: "concept_error", logicTag: "wrong" },
      { text: "Greater than or equal",        type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "For any triangle: |AB − BC| < AC (difference of two sides < third side).",
    ],
    shortcut: "Triangle inequality (difference form): |a−b| < c < a+b.",
    bloomLevel: "understand", conceptTested: "Difference of sides inequality",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a07",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In △ABC, AB = 7, BC = 5, AC = 9. The largest angle is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "∠A",  type: "concept_error", logicTag: "opposite_to_BC=5" },
      { text: "∠B",  type: "correct",       logicTag: "opposite_to_AC=9" },
      { text: "∠C",  type: "concept_error", logicTag: "opposite_to_AB=7" },
      { text: "All equal", type: "concept_error", logicTag: "equilateral" },
    ],
    solutionSteps: [
      "Longest side = AC = 9, opposite ∠B → ∠B is largest.",
    ],
    shortcut: "Largest side → largest opposite angle.",
    bloomLevel: "apply", conceptTested: "Identifying largest angle from side lengths",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a08",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "A triangle has sides in ratio 1:1:√2. This is a:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Equilateral right triangle",    type: "concept_error", logicTag: "contradiction" },
      { text: "Isosceles right triangle",      type: "correct",       logicTag: "45_45_90" },
      { text: "Scalene obtuse triangle",       type: "concept_error", logicTag: "wrong" },
      { text: "Isosceles acute triangle",      type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Ratio 1:1:√2 → sides a, a, a√2.",
      "a² + a² = 2a² = (a√2)² ✓ → right angle. Two sides equal → isosceles.",
      "Isosceles right triangle (45-45-90).",
    ],
    shortcut: "Sides 1:1:√2 → 45°-45°-90° right isosceles triangle.",
    bloomLevel: "analyse", conceptTested: "Identifying triangle type from side ratios",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a09",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "Two sides of a triangle are 8 cm and 5 cm. The third side can be:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "2 cm",   type: "concept_error", logicTag: "fails_difference_check" },
      { text: "13 cm",  type: "concept_error", logicTag: "fails_sum_check" },
      { text: "4 cm",   type: "correct",       logicTag: "3_to_13_exclusive" },
      { text: "14 cm",  type: "concept_error", logicTag: "exceeds_sum" },
    ],
    solutionSteps: [
      "Third side must satisfy: |8−5| < x < 8+5 → 3 < x < 13.",
      "Only 4 cm lies in (3, 13).",
    ],
    shortcut: "Third side range: (|a−b|, a+b) exclusive.",
    bloomLevel: "apply", conceptTested: "Finding valid third side using triangle inequality",
  },
  {
    questionId: "ap_ssc9_ch7_inequality_a10",
    topicId: "ap_ssc_math9_ch7_triangle_properties_inequalities",
    topic: "Triangles", subtopic: "Properties of Triangles and Inequalities",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 7,
    questionText: "In △ABC, ∠A > ∠B. Which is true about the sides?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "AB > AC",  type: "concept_error", logicTag: "angle_A_opposite_BC" },
      { text: "BC > AC",  type: "correct",       logicTag: "larger_angle_A_opposite_BC" },
      { text: "AC > BC",  type: "concept_error", logicTag: "inverted" },
      { text: "AB = BC",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "∠A is opposite BC, ∠B is opposite AC.",
      "∠A > ∠B → BC > AC (side opposite larger angle is longer).",
    ],
    shortcut: "Bigger angle → longer OPPOSITE side.",
    bloomLevel: "analyse", conceptTested: "Triangle inequality from angle comparison",
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
