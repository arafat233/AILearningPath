import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC", GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────────────────
  // TOPIC 1: ap_ssc_math9_ch3_cartesian_system  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch3_cartesian_a01",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The point (0, 0) is called the:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "x-intercept",  type: "concept_error", logicTag: "wrong" },
      { text: "Origin",       type: "correct",       logicTag: "definition" },
      { text: "y-intercept",  type: "concept_error", logicTag: "wrong" },
      { text: "Vertex",       type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "The intersection of the x-axis and y-axis is called the origin, (0, 0).",
    ],
    shortcut: "Origin = (0, 0).",
    bloomLevel: "remember", conceptTested: "Definition of origin",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a02",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The point (−3, 4) lies in which quadrant?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Quadrant I",   type: "concept_error", logicTag: "both_positive" },
      { text: "Quadrant II",  type: "correct",       logicTag: "neg_x_pos_y" },
      { text: "Quadrant III", type: "concept_error", logicTag: "both_negative" },
      { text: "Quadrant IV",  type: "concept_error", logicTag: "pos_x_neg_y" },
    ],
    solutionSteps: [
      "x < 0, y > 0 → Quadrant II.",
    ],
    shortcut: "Q1:(+,+), Q2:(−,+), Q3:(−,−), Q4:(+,−).",
    bloomLevel: "apply", conceptTested: "Quadrant identification",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a03",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "A point on the x-axis has its y-coordinate equal to:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "Any value",   type: "concept_error", logicTag: "wrong" },
      { text: "0",           type: "correct",       logicTag: "x_axis_y=0" },
      { text: "1",           type: "concept_error", logicTag: "wrong" },
      { text: "Its x-value", type: "concept_error", logicTag: "confused" },
    ],
    solutionSteps: [
      "Every point on the x-axis has y = 0. Form: (x, 0).",
    ],
    shortcut: "On x-axis: y=0. On y-axis: x=0.",
    bloomLevel: "remember", conceptTested: "Points on axes",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a04",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "How many quadrants does a Cartesian plane have?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "2",  type: "concept_error", logicTag: "half_plane" },
      { text: "3",  type: "concept_error", logicTag: "wrong" },
      { text: "4",  type: "correct",       logicTag: "four_quadrants" },
      { text: "8",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "The two axes divide the plane into 4 quadrants: I, II, III, IV.",
    ],
    shortcut: "Two axes → 4 regions = 4 quadrants.",
    bloomLevel: "remember", conceptTested: "Number of quadrants",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a05",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The abscissa of a point is its:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "y-coordinate",    type: "concept_error", logicTag: "ordinate" },
      { text: "x-coordinate",    type: "correct",       logicTag: "abscissa_definition" },
      { text: "Distance from origin", type: "concept_error", logicTag: "confused" },
      { text: "Slope",           type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Abscissa = x-coordinate. Ordinate = y-coordinate.",
    ],
    shortcut: "Abscissa = x (think: 'A before O' → x before y).",
    bloomLevel: "remember", conceptTested: "Terminology: abscissa and ordinate",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a06",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The point (5, 0) lies on the:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "y-axis",          type: "concept_error", logicTag: "x=0_is_y_axis" },
      { text: "x-axis",          type: "correct",       logicTag: "y=0_means_x_axis" },
      { text: "Origin",          type: "concept_error", logicTag: "both_must_be_zero" },
      { text: "Quadrant I",      type: "concept_error", logicTag: "on_axis_not_quadrant" },
    ],
    solutionSteps: [
      "y = 0 → point lies on x-axis.",
    ],
    shortcut: "y=0 → x-axis; x=0 → y-axis.",
    bloomLevel: "apply", conceptTested: "Locating points on axes",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a07",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "Which of the following points is equidistant from both axes?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "(3, 5)",    type: "concept_error", logicTag: "not_equal" },
      { text: "(4, −4)",   type: "correct",       logicTag: "abs_x_equals_abs_y" },
      { text: "(2, 6)",    type: "concept_error", logicTag: "not_equal" },
      { text: "(0, 7)",    type: "concept_error", logicTag: "on_y_axis" },
    ],
    solutionSteps: [
      "Distance from x-axis = |y|, distance from y-axis = |x|.",
      "For equidistance: |x| = |y|.",
      "|(4)| = |−4| = 4 ✓.",
    ],
    shortcut: "Equidistant from both axes → |x| = |y|.",
    bloomLevel: "apply", conceptTested: "Equidistance from both axes",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a08",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "In which quadrant are both coordinates negative?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "Quadrant I",   type: "concept_error", logicTag: "both_positive" },
      { text: "Quadrant II",  type: "concept_error", logicTag: "x_neg_y_pos" },
      { text: "Quadrant III", type: "correct",       logicTag: "both_negative" },
      { text: "Quadrant IV",  type: "concept_error", logicTag: "x_pos_y_neg" },
    ],
    solutionSteps: [
      "Q3: x < 0 and y < 0 — both negative.",
    ],
    shortcut: "Q3 = (−, −).",
    bloomLevel: "remember", conceptTested: "Signs of coordinates in Quadrant III",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a09",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The reflection of the point (2, −3) across the x-axis is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "(−2, −3)", type: "concept_error", logicTag: "reflected_about_y" },
      { text: "(2, 3)",   type: "correct",       logicTag: "y_sign_flipped" },
      { text: "(−2, 3)",  type: "concept_error", logicTag: "both_flipped" },
      { text: "(3, −2)",  type: "concept_error", logicTag: "swapped" },
    ],
    solutionSteps: [
      "Reflection across x-axis: (x, y) → (x, −y).",
      "(2, −3) → (2, 3).",
    ],
    shortcut: "Across x-axis → flip y sign. Across y-axis → flip x sign.",
    bloomLevel: "apply", conceptTested: "Reflection across x-axis",
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_a10",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry", subtopic: "Cartesian System",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "If a point P(x, y) satisfies x = y, it lies on:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "The x-axis",              type: "concept_error", logicTag: "y=0" },
      { text: "The y-axis",              type: "concept_error", logicTag: "x=0" },
      { text: "The line y = x",          type: "correct",       logicTag: "diagonal" },
      { text: "A circle centered at origin", type: "concept_error", logicTag: "x^2+y^2=const" },
    ],
    solutionSteps: [
      "x = y is the equation of the diagonal line through the origin at 45°.",
      "Points like (1,1), (2,2), (−3,−3) all satisfy x=y.",
    ],
    shortcut: "x=y → the 45° line through origin; passes through Q1 and Q3.",
    bloomLevel: "analyse", conceptTested: "Locus of points with x=y",
  },

  // ─────────────────────────────────────────────────────────
  // TOPIC 2: ap_ssc_math9_ch3_plotting_points  (10 MCQs)
  // ─────────────────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch3_plotting_a01",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "To plot the point (3, −4), you move 3 units along the x-axis and then:",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "4 units up",    type: "concept_error", logicTag: "wrong_direction" },
      { text: "4 units down",  type: "correct",       logicTag: "negative_y_downward" },
      { text: "3 units right", type: "concept_error", logicTag: "x_again" },
      { text: "4 units left",  type: "concept_error", logicTag: "wrong_axis" },
    ],
    solutionSteps: [
      "x = 3 → 3 units right. y = −4 → 4 units down.",
    ],
    shortcut: "Positive y → up; negative y → down. Positive x → right; negative x → left.",
    bloomLevel: "apply", conceptTested: "Plotting procedure for a point",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a02",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "What are the coordinates of a point 5 units above the origin on the y-axis?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "(5, 0)",   type: "concept_error", logicTag: "on_x_axis" },
      { text: "(0, 5)",   type: "correct",       logicTag: "y_axis_x=0" },
      { text: "(5, 5)",   type: "concept_error", logicTag: "wrong" },
      { text: "(0, −5)",  type: "concept_error", logicTag: "below_origin" },
    ],
    solutionSteps: [
      "On y-axis: x = 0. 5 units above: y = 5. Point: (0, 5).",
    ],
    shortcut: "On y-axis: always x = 0.",
    bloomLevel: "apply", conceptTested: "Coordinates of points on y-axis",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a03",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "Which pair of points are symmetric about the y-axis?",
    questionType: "mcq", difficulty: "easy", difficultyScore: 0.2, marks: 1, isAIGenerated: true,
    options: [
      { text: "(3, 4) and (3, −4)",  type: "concept_error", logicTag: "symmetric_x_axis" },
      { text: "(3, 4) and (−3, 4)",  type: "correct",       logicTag: "y_axis_symmetry" },
      { text: "(3, 4) and (−3, −4)", type: "concept_error", logicTag: "origin_symmetry" },
      { text: "(3, 4) and (4, 3)",   type: "concept_error", logicTag: "swapped" },
    ],
    solutionSteps: [
      "Symmetric about y-axis: (x,y) and (−x, y) — x changes sign, y stays.",
    ],
    shortcut: "y-axis symmetry: flip x sign only.",
    bloomLevel: "apply", conceptTested: "Symmetry about y-axis",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a04",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The distance of the point (−4, 3) from the x-axis is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "4",  type: "concept_error", logicTag: "x_coordinate" },
      { text: "3",  type: "correct",       logicTag: "y_coordinate_distance" },
      { text: "5",  type: "concept_error", logicTag: "distance_from_origin" },
      { text: "7",  type: "concept_error", logicTag: "sum" },
    ],
    solutionSteps: [
      "Distance from x-axis = |y| = |3| = 3.",
    ],
    shortcut: "Distance from x-axis = |y|; from y-axis = |x|.",
    bloomLevel: "apply", conceptTested: "Distance of a point from an axis",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a05",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "Which of the following points lies in Quadrant IV?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "(−2, 3)",  type: "concept_error", logicTag: "quadrant_2" },
      { text: "(3, 2)",   type: "concept_error", logicTag: "quadrant_1" },
      { text: "(4, −5)",  type: "correct",       logicTag: "pos_x_neg_y_quadrant_4" },
      { text: "(−1, −2)", type: "concept_error", logicTag: "quadrant_3" },
    ],
    solutionSteps: [
      "Q4: x > 0, y < 0. Only (4, −5) satisfies this.",
    ],
    shortcut: "Q4 = (+, −).",
    bloomLevel: "apply", conceptTested: "Identifying point in Quadrant IV",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a06",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The distance between points (0, 0) and (3, 4) is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "3",   type: "concept_error", logicTag: "x_only" },
      { text: "4",   type: "concept_error", logicTag: "y_only" },
      { text: "5",   type: "correct",       logicTag: "pythagoras_3_4_5" },
      { text: "7",   type: "concept_error", logicTag: "sum" },
    ],
    solutionSteps: [
      "Distance = √(3²+4²) = √(9+16) = √25 = 5.",
    ],
    shortcut: "Recognize 3-4-5 right triangle.",
    bloomLevel: "apply", conceptTested: "Distance from origin using Pythagorean theorem",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a07",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "A point P is at (−6, 0). Its distance from the origin is:",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "0",   type: "concept_error", logicTag: "confused_with_y" },
      { text: "6",   type: "correct",       logicTag: "abs_x_value" },
      { text: "−6",  type: "concept_error", logicTag: "distance_negative" },
      { text: "36",  type: "concept_error", logicTag: "squared" },
    ],
    solutionSteps: [
      "Distance = √((−6)²+0²) = √36 = 6.",
    ],
    shortcut: "Point on x-axis: distance from origin = |x|.",
    bloomLevel: "apply", conceptTested: "Distance of axis point from origin",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a08",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "Three vertices of a rectangle are (1,1), (5,1) and (5,4). What is the fourth vertex?",
    questionType: "mcq", difficulty: "medium", difficultyScore: 0.5, marks: 1, isAIGenerated: true,
    options: [
      { text: "(1, 5)",  type: "concept_error", logicTag: "swapped_y" },
      { text: "(1, 4)",  type: "correct",       logicTag: "completing_rectangle" },
      { text: "(4, 1)",  type: "concept_error", logicTag: "wrong" },
      { text: "(5, 5)",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Given: (1,1), (5,1), (5,4). The fourth vertex must complete the rectangle.",
      "Opposite to (5,4) relative to sides: x=1, y=4 → (1, 4).",
    ],
    shortcut: "In a rectangle, opposite sides are parallel and equal.",
    bloomLevel: "apply", conceptTested: "Completing a rectangle on coordinate plane",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a09",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "The midpoint of the line segment joining (2, 4) and (6, 8) is:",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "(8, 12)",  type: "concept_error", logicTag: "added_not_averaged" },
      { text: "(4, 4)",   type: "concept_error", logicTag: "subtracted" },
      { text: "(4, 6)",   type: "correct",       logicTag: "midpoint_formula" },
      { text: "(3, 5)",   type: "concept_error", logicTag: "wrong_computation" },
    ],
    solutionSteps: [
      "Midpoint = ((2+6)/2, (4+8)/2) = (8/2, 12/2) = (4, 6).",
    ],
    shortcut: "Midpoint = (average of x-coords, average of y-coords).",
    bloomLevel: "apply", conceptTested: "Midpoint formula",
  },
  {
    questionId: "ap_ssc9_ch3_plotting_a10",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry", subtopic: "Plotting Points",
    subject: "Mathematics", grade: GRADE, examBoard: BOARD, chapterNumber: 3,
    questionText: "Points (1,2), (2,4), (3,6) all lie on which line?",
    questionType: "mcq", difficulty: "hard", difficultyScore: 0.8, marks: 2, isAIGenerated: true,
    options: [
      { text: "y = x + 1",  type: "concept_error", logicTag: "wrong" },
      { text: "y = x",      type: "concept_error", logicTag: "wrong" },
      { text: "y = 2x",     type: "correct",       logicTag: "linear_pattern" },
      { text: "y = x + 2",  type: "concept_error", logicTag: "wrong" },
    ],
    solutionSteps: [
      "Check: y = 2x.",
      "x=1: y=2 ✓, x=2: y=4 ✓, x=3: y=6 ✓.",
      "All points satisfy y = 2x.",
    ],
    shortcut: "Check ratio y/x for collinear points through origin.",
    bloomLevel: "analyse", conceptTested: "Recognising collinear points on a line through origin",
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
