import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch4_linear_equation_solutions  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch4_linearsol_a01",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "How many solutions does a linear equation in two variables have?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Exactly one",      type: "concept_error", logicTag: "one_variable_thinking" },
      { text: "Exactly two",      type: "concept_error", logicTag: "wrong" },
      { text: "Infinitely many",  type: "correct",       logicTag: "line_infinite_points" },
      { text: "None",             type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "A linear equation in two variables represents a line.",
      "Every point on the line is a solution → infinitely many solutions.",
    ],
    shortcut: "1 equation in 2 unknowns → infinitely many solutions.",
    bloomLevel: "understand", conceptTested: "Number of solutions of linear equation in 2 variables",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a02",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Which of the following is a solution of 2x + 3y = 12?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "(1, 3)",    type: "concept_error", logicTag: "2+9=11_not_12" },
      { text: "(3, 2)",    type: "correct",       logicTag: "6+6=12" },
      { text: "(2, 3)",    type: "concept_error", logicTag: "4+9=13" },
      { text: "(4, 1)",    type: "concept_error", logicTag: "8+3=11" },
    ],
    solutionSteps: [
      "Substitute (3, 2): 2(3) + 3(2) = 6 + 6 = 12 ✓.",
    ],
    shortcut: "Substitute and verify LHS = RHS.",
    bloomLevel: "apply", conceptTested: "Verifying a solution of a linear equation",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a03",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The standard form of a linear equation in two variables is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "ax² + bx + c = 0",  type: "concept_error", logicTag: "quadratic" },
      { text: "ax + by + c = 0",   type: "correct",       logicTag: "standard_linear_2var" },
      { text: "ax + b = 0",        type: "concept_error", logicTag: "one_variable" },
      { text: "ax + by = a + b",   type: "concept_error", logicTag: "non_standard" },
    ],
    solutionSteps: [
      "Standard form: ax + by + c = 0, where a, b are not both zero.",
    ],
    shortcut: "Linear in 2 vars: ax + by + c = 0.",
    bloomLevel: "remember", conceptTested: "Standard form of linear equation",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a04",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Express x + 2y = 6 in the form y = mx + c. What is m?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "2",     type: "concept_error", logicTag: "confused_m_with_coefficient" },
      { text: "−1/2",  type: "correct",       logicTag: "slope_of_line" },
      { text: "3",     type: "concept_error", logicTag: "c_not_m" },
      { text: "1",     type: "concept_error", logicTag: "x_coefficient" },
    ],
    solutionSteps: [
      "x + 2y = 6 → 2y = −x + 6 → y = (−1/2)x + 3.",
      "m = −1/2.",
    ],
    shortcut: "Rearrange to y = mx + c form by isolating y.",
    bloomLevel: "apply", conceptTested: "Expressing in slope-intercept form",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a05",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "If y = 3x − 2, find y when x = 2.",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "8",   type: "concept_error", logicTag: "3x_plus_2" },
      { text: "6",   type: "concept_error", logicTag: "only_3x" },
      { text: "4",   type: "correct",       logicTag: "6_minus_2" },
      { text: "−4",  type: "concept_error", logicTag: "sign_error" },
    ],
    solutionSteps: [
      "y = 3(2) − 2 = 6 − 2 = 4.",
    ],
    shortcut: "Direct substitution.",
    bloomLevel: "apply", conceptTested: "Evaluating a linear expression",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a06",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The y-intercept of 3x − 2y = 6 is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "3",    type: "concept_error", logicTag: "x_intercept" },
      { text: "−3",   type: "correct",       logicTag: "set_x=0" },
      { text: "2",    type: "concept_error", logicTag: "coefficient_y" },
      { text: "−2",   type: "concept_error", logicTag: "coefficient_with_sign" },
    ],
    solutionSteps: [
      "y-intercept: set x = 0.",
      "−2y = 6 → y = −3.",
    ],
    shortcut: "y-intercept: set x = 0 and solve.",
    bloomLevel: "apply", conceptTested: "Finding y-intercept",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a07",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Which of the following is NOT a solution of x − y = 0?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "(1, 1)",   type: "concept_error", logicTag: "is_a_solution" },
      { text: "(3, 3)",   type: "concept_error", logicTag: "is_a_solution" },
      { text: "(2, 3)",   type: "correct",       logicTag: "2_minus_3_equals_minus1" },
      { text: "(0, 0)",   type: "concept_error", logicTag: "is_a_solution" },
    ],
    solutionSteps: [
      "x − y = 0 requires x = y.",
      "(2, 3): 2 − 3 = −1 ≠ 0 → NOT a solution.",
    ],
    shortcut: "x − y = 0 means x = y; check if both coordinates are equal.",
    bloomLevel: "apply", conceptTested: "Identifying non-solutions",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a08",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "If (k, 3) is a solution of 2x + y = 7, then k =",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "1",   type: "concept_error", logicTag: "wrong" },
      { text: "2",   type: "correct",       logicTag: "2k+3=7" },
      { text: "3",   type: "concept_error", logicTag: "wrong" },
      { text: "5",   type: "concept_error", logicTag: "ignored_y" },
    ],
    solutionSteps: [
      "Substitute (k, 3): 2k + 3 = 7 → 2k = 4 → k = 2.",
    ],
    shortcut: "Substitute the known coordinate and solve for the unknown.",
    bloomLevel: "apply", conceptTested: "Finding unknown in a solution pair",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a09",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Represent 'five times a number x equals 3 more than twice y' as a linear equation.",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "5x = 2y + 3",    type: "correct",       logicTag: "word_to_equation" },
      { text: "5x + 3 = 2y",    type: "concept_error", logicTag: "wrong_arrangement" },
      { text: "5x = 3y + 2",    type: "concept_error", logicTag: "coefficients_swapped" },
      { text: "2y + 5x = 0",    type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "'Five times x' = 5x.",
      "'3 more than twice y' = 2y + 3.",
      "Equation: 5x = 2y + 3.",
    ],
    shortcut: "Translate phrase by phrase: 'n more than' = + n.",
    bloomLevel: "apply", conceptTested: "Translating word problem to linear equation",
  },
  {
    questionId: "ap_ssc9_ch4_linearsol_a10",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables", subtopic: "Solutions of Linear Equations",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "If ax + 3y = 9 passes through (3, 0), what is a?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "3",    type: "correct",       logicTag: "3a=9" },
      { text: "9",    type: "concept_error", logicTag: "wrong" },
      { text: "−3",   type: "concept_error", logicTag: "sign_error" },
      { text: "1",    type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Substitute (3, 0): a(3) + 3(0) = 9 → 3a = 9 → a = 3.",
    ],
    shortcut: "Point lies on line → substitute and solve.",
    bloomLevel: "apply", conceptTested: "Finding coefficient given a point on the line",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch4_graph_of_linear_equation  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch4_graphlin_a01",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The graph of a linear equation in two variables is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "A parabola",      type: "concept_error", logicTag: "quadratic" },
      { text: "A straight line", type: "correct",       logicTag: "linear_is_line" },
      { text: "A circle",        type: "concept_error", logicTag: "circle_equation" },
      { text: "A hyperbola",     type: "concept_error", logicTag: "conic" },
    ],
    solutionSteps: [
      "Every linear equation ax + by + c = 0 represents a straight line in the plane.",
    ],
    shortcut: "Linear equation = straight line.",
    bloomLevel: "remember", conceptTested: "Graph of linear equation",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a02",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The graph of y = 3 is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "A line parallel to y-axis",           type: "concept_error", logicTag: "x=k_is_vertical" },
      { text: "A line parallel to x-axis",           type: "correct",       logicTag: "y=k_is_horizontal" },
      { text: "A line passing through origin",       type: "concept_error", logicTag: "wrong" },
      { text: "A point at (0, 3)",                   type: "concept_error", logicTag: "point_not_line" },
    ],
    solutionSteps: [
      "y = 3 means y is always 3, regardless of x.",
      "This gives a horizontal line 3 units above x-axis.",
    ],
    shortcut: "y = k → horizontal line; x = k → vertical line.",
    bloomLevel: "understand", conceptTested: "Graph of y = constant",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a03",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "How many points are needed to uniquely draw a straight line?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "1",  type: "concept_error", logicTag: "infinitely_many_lines" },
      { text: "2",  type: "correct",       logicTag: "two_points_define_line" },
      { text: "3",  type: "concept_error", logicTag: "collinear_redundant" },
      { text: "4",  type: "concept_error", logicTag: "too_many" },
    ],
    solutionSteps: [
      "Two distinct points uniquely determine a straight line.",
    ],
    shortcut: "2 points → 1 unique line.",
    bloomLevel: "remember", conceptTested: "Minimum points to draw a line",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a04",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The x-intercept of the line 2x − 3y = 6 is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "−2",  type: "concept_error", logicTag: "y_intercept" },
      { text: "3",   type: "correct",       logicTag: "set_y=0" },
      { text: "−3",  type: "concept_error", logicTag: "wrong_sign" },
      { text: "2",   type: "concept_error", logicTag: "coefficient" },
    ],
    solutionSteps: [
      "x-intercept: set y = 0.",
      "2x = 6 → x = 3.",
    ],
    shortcut: "x-intercept: set y = 0.",
    bloomLevel: "apply", conceptTested: "Finding x-intercept",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a05",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The line y = −2x passes through the origin. Is (1, −2) on the line?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "No, because the slope is wrong",  type: "concept_error", logicTag: "wrong_reasoning" },
      { text: "Yes, because −2 = −2(1)",         type: "correct",       logicTag: "substitution" },
      { text: "No, because (1,−2) is in Q4",     type: "concept_error", logicTag: "wrong_reasoning" },
      { text: "Yes, because it has two coordinates", type: "concept_error", logicTag: "irrelevant" },
    ],
    solutionSteps: [
      "Substitute x=1, y=−2: −2 = −2(1) = −2 ✓. Yes, the point lies on the line.",
    ],
    shortcut: "Check by substituting x and y into the equation.",
    bloomLevel: "apply", conceptTested: "Checking if a point lies on a line",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a06",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The slope of the line passing through (0, 0) and (3, 6) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "3",   type: "concept_error", logicTag: "x_coordinate" },
      { text: "1/2", type: "concept_error", logicTag: "inverted" },
      { text: "2",   type: "correct",       logicTag: "rise_over_run" },
      { text: "6",   type: "concept_error", logicTag: "y_coordinate" },
    ],
    solutionSteps: [
      "Slope = (y₂−y₁)/(x₂−x₁) = (6−0)/(3−0) = 6/3 = 2.",
    ],
    shortcut: "Slope = Δy/Δx = rise/run.",
    bloomLevel: "apply", conceptTested: "Calculating slope from two points",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a07",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Two lines in a plane that never intersect are called:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Perpendicular lines",  type: "concept_error", logicTag: "intersect_at_90" },
      { text: "Concurrent lines",     type: "concept_error", logicTag: "pass_through_one_point" },
      { text: "Parallel lines",       type: "correct",       logicTag: "never_intersect" },
      { text: "Coincident lines",     type: "concept_error", logicTag: "overlap" },
    ],
    solutionSteps: [
      "Parallel lines have equal slopes and never meet.",
    ],
    shortcut: "Parallel → same slope, different intercept.",
    bloomLevel: "remember", conceptTested: "Definition of parallel lines",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a08",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The graph of 2x + y = 4 has x-intercept and y-intercept respectively:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "(4, 2)",  type: "concept_error", logicTag: "switched" },
      { text: "(2, 4)",  type: "correct",       logicTag: "x_int_y_int" },
      { text: "(1, 2)",  type: "concept_error", logicTag: "wrong" },
      { text: "(2, 2)",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "x-intercept: y=0 → 2x = 4 → x = 2.",
      "y-intercept: x=0 → y = 4.",
      "Answer: (2, 4).",
    ],
    shortcut: "Set each variable to zero alternately.",
    bloomLevel: "apply", conceptTested: "Finding both intercepts",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a09",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "A line has slope −3 and passes through (0, 5). Which equation represents it?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "y = −3x",       type: "concept_error", logicTag: "missing_intercept" },
      { text: "y = −3x + 5",   type: "correct",       logicTag: "slope_intercept" },
      { text: "y = 3x − 5",    type: "concept_error", logicTag: "wrong_signs" },
      { text: "y = 3x + 5",    type: "concept_error", logicTag: "wrong_slope_sign" },
    ],
    solutionSteps: [
      "y = mx + c with m = −3 and c = 5 (y-intercept at (0,5)).",
      "y = −3x + 5.",
    ],
    shortcut: "y = mx + c: m = slope, c = y-intercept.",
    bloomLevel: "apply", conceptTested: "Writing equation of a line given slope and y-intercept",
  },
  {
    questionId: "ap_ssc9_ch4_graphlin_a10",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables", subtopic: "Graph of a Linear Equation",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Lines 2x + 3y = 6 and 4x + 6y = 12 are:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "Perpendicular",   type: "concept_error", logicTag: "wrong" },
      { text: "Parallel",        type: "concept_error", logicTag: "same_slope_wrong_check" },
      { text: "Coincident",      type: "correct",       logicTag: "same_line_multiple_of_2" },
      { text: "Intersecting at one point", type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "4x + 6y = 12 is exactly 2 × (2x + 3y = 6).",
      "Both equations represent the same line → coincident lines.",
    ],
    shortcut: "If one equation is a scalar multiple of another → coincident (same) line.",
    bloomLevel: "analyse", conceptTested: "Identifying coincident lines",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 3: ap_ssc_math9_ch4_equations_of_special_lines  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch4_speclines_a01",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The equation of the y-axis is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "y = 0",  type: "concept_error", logicTag: "x_axis" },
      { text: "x = 0",  type: "correct",       logicTag: "y_axis_x_equals_0" },
      { text: "x = y",  type: "concept_error", logicTag: "diagonal" },
      { text: "x = 1",  type: "concept_error", logicTag: "shifted_vertical" },
    ],
    solutionSteps: [
      "On the y-axis, x = 0 for all values of y.",
      "Equation: x = 0.",
    ],
    shortcut: "y-axis: x = 0. x-axis: y = 0.",
    bloomLevel: "remember", conceptTested: "Equation of y-axis",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a02",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The graph of x = 5 is a line:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Horizontal, 5 units above x-axis",    type: "concept_error", logicTag: "y=5_confusion" },
      { text: "Vertical, 5 units to the right of y-axis", type: "correct", logicTag: "x=k_vertical" },
      { text: "Through origin with slope 5",          type: "concept_error", logicTag: "y=5x" },
      { text: "Passing through (0, 5)",               type: "concept_error", logicTag: "y_intercept_confusion" },
    ],
    solutionSteps: [
      "x = 5 is a vertical line passing through (5, 0) — parallel to y-axis.",
    ],
    shortcut: "x = k → vertical line parallel to y-axis at distance k.",
    bloomLevel: "understand", conceptTested: "Graph of x = constant",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a03",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The slope of a horizontal line is:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Undefined",  type: "concept_error", logicTag: "vertical_line_slope" },
      { text: "1",          type: "concept_error", logicTag: "diagonal_line" },
      { text: "0",          type: "correct",       logicTag: "no_rise" },
      { text: "−1",         type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Horizontal line has no rise (Δy = 0).",
      "Slope = Δy/Δx = 0/Δx = 0.",
    ],
    shortcut: "Horizontal → slope 0; Vertical → slope undefined.",
    bloomLevel: "remember", conceptTested: "Slope of horizontal line",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a04",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Write the equation of a line parallel to the x-axis at a distance of 4 units above it.",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "x = 4",    type: "concept_error", logicTag: "vertical_not_horizontal" },
      { text: "y = 4",    type: "correct",       logicTag: "horizontal_4_above" },
      { text: "y = −4",   type: "concept_error", logicTag: "below_x_axis" },
      { text: "y = 4x",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Parallel to x-axis → horizontal → y = constant.",
      "4 units above x-axis → y = 4.",
    ],
    shortcut: "Parallel to x-axis at height k → y = k.",
    bloomLevel: "apply", conceptTested: "Equation of horizontal line at given height",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a05",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "A line passing through the origin has the equation:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "y = mx + 5",   type: "concept_error", logicTag: "non_zero_intercept" },
      { text: "y = m",        type: "concept_error", logicTag: "horizontal_constant" },
      { text: "y = mx",       type: "correct",       logicTag: "through_origin_form" },
      { text: "x = m",        type: "concept_error", logicTag: "vertical_constant" },
    ],
    solutionSteps: [
      "Through origin means (0, 0) satisfies the equation → c = 0.",
      "y = mx + 0 = mx.",
    ],
    shortcut: "Line through origin: y = mx (zero intercept).",
    bloomLevel: "understand", conceptTested: "Equation of line through origin",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a06",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The slope of a vertical line is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "0",          type: "concept_error", logicTag: "horizontal_slope" },
      { text: "1",          type: "concept_error", logicTag: "wrong" },
      { text: "Undefined",  type: "correct",       logicTag: "division_by_zero" },
      { text: "−1",         type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Vertical line: x = k. Any two points have same x → Δx = 0.",
      "Slope = Δy/0 → undefined.",
    ],
    shortcut: "Vertical line: slope is undefined (division by zero).",
    bloomLevel: "understand", conceptTested: "Slope of vertical line",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a07",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "The equation of a line passing through (0, 0) with slope 1/2 is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "x = 2y",     type: "concept_error", logicTag: "inverted_slope" },
      { text: "y = 2x",     type: "concept_error", logicTag: "slope_2" },
      { text: "y = x/2",    type: "correct",       logicTag: "slope_half" },
      { text: "2x + y = 0", type: "concept_error", logicTag: "slope_minus2" },
    ],
    solutionSteps: [
      "Through origin with slope 1/2: y = (1/2)x = x/2.",
    ],
    shortcut: "y = (1/2)x and y = x/2 are equivalent.",
    bloomLevel: "apply", conceptTested: "Writing equation through origin with given slope",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a08",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Which of the following equations represents a line passing through both axes?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "x = 3",    type: "concept_error", logicTag: "vertical_no_x_intercept_conflict" },
      { text: "y = 5",    type: "concept_error", logicTag: "horizontal_no_y_intercept_conflict" },
      { text: "y = x + 1",type: "correct",       logicTag: "crosses_both_axes" },
      { text: "y = 2x",   type: "concept_error", logicTag: "passes_through_origin_only" },
    ],
    solutionSteps: [
      "y = x+1 has x-int at (−1,0) and y-int at (0,1) — crosses both axes at different points.",
      "y = 2x passes through the origin (0,0) — it crosses both axes at the same point.",
    ],
    shortcut: "Line through origin crosses both axes at origin (one point), not 'through' both axes separately.",
    bloomLevel: "analyse", conceptTested: "Lines crossing both axes at distinct points",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a09",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Lines x = 3 and y = 5 intersect at the point:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "(5, 3)",   type: "concept_error", logicTag: "swapped" },
      { text: "(3, 5)",   type: "correct",       logicTag: "x=3_y=5" },
      { text: "(0, 0)",   type: "concept_error", logicTag: "origin" },
      { text: "(8, 0)",   type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "x = 3 → every point on this line has x = 3.",
      "y = 5 → every point on this line has y = 5.",
      "Intersection: (3, 5).",
    ],
    shortcut: "Intersection of x=a and y=b is always (a, b).",
    bloomLevel: "apply", conceptTested: "Intersection of horizontal and vertical lines",
  },
  {
    questionId: "ap_ssc9_ch4_speclines_a10",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables", subtopic: "Equations of Special Lines",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 4,
    questionText: "Which equation represents a line parallel to y = 2x + 1?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "y = 2x + 5",   type: "correct",       logicTag: "same_slope_different_intercept" },
      { text: "y = −(1/2)x",  type: "concept_error", logicTag: "perpendicular_slope" },
      { text: "y = 3x + 1",   type: "concept_error", logicTag: "different_slope" },
      { text: "y = 2x + 1",   type: "concept_error", logicTag: "same_line" },
    ],
    solutionSteps: [
      "Parallel lines have equal slopes but different intercepts.",
      "y = 2x + 1 has slope 2.",
      "y = 2x + 5 also has slope 2 but intercept 5 → parallel.",
    ],
    shortcut: "Parallel → same slope, different intercept.",
    bloomLevel: "apply", conceptTested: "Finding equation of parallel line",
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
