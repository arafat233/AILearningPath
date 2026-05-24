import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Linear Equation Solutions (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch4_solutions_b01",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables",
    subtopic: "Solutions of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "Write four solutions for the equation 2x + y = 7. Verify that each satisfies the equation.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "x = 0 → y = 7. Check: 0 + 7 = 7 ✓. Solution: (0, 7).",
      "x = 1 → y = 5. Check: 2 + 5 = 7 ✓. Solution: (1, 5).",
      "x = 2 → y = 3. Check: 4 + 3 = 7 ✓. Solution: (2, 3).",
      "x = 3 → y = 1. Check: 6 + 1 = 7 ✓. Solution: (3, 1).",
    ],
    shortcut: "Choose any value of x, compute y = 7 − 2x. Infinite solutions exist.",
    bloomLevel: "apply",
    conceptTested: "Finding solutions of a linear equation in two variables",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_solutions_b02",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables",
    subtopic: "Solutions of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "The cost of a notebook is twice the cost of a pen. Write a linear equation in two variables for this statement. Also express it in standard form ax + by + c = 0.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "Let cost of pen = x rupees and cost of notebook = y rupees.",
      "Condition: y = 2x  ⟹  y − 2x = 0.",
      "Standard form: −2x + y + 0 = 0, i.e., a = −2, b = 1, c = 0.",
    ],
    shortcut: "Translate the word condition into an equation; rearrange to ax + by + c = 0.",
    bloomLevel: "understand",
    conceptTested: "Forming linear equations from word problems",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_solutions_b03",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables",
    subtopic: "Solutions of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "Check whether (2, −3) and (0, 1) are solutions of 3x + 2y = 0.",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 2,
    options: [],
    solutionSteps: [
      "For (2, −3): 3(2) + 2(−3) = 6 − 6 = 0. ✓ Solution.",
      "For (0, 1): 3(0) + 2(1) = 0 + 2 = 2 ≠ 0. ✗ Not a solution.",
    ],
    shortcut: "Substitute and check if LHS = RHS.",
    bloomLevel: "apply",
    conceptTested: "Verifying solutions of linear equation",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_solutions_b04",
    topicId: "ap_ssc_math9_ch4_linear_equation_solutions",
    topic: "Linear Equations in Two Variables",
    subtopic: "Solutions of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "If (3, k) and (k, 5) are both solutions of the equation 2x − 3y + 1 = 0, find k in each case. Are they the same?",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "For (3, k): 2(3) − 3k + 1 = 0 → 6 − 3k + 1 = 0 → 3k = 7 → k = 7/3.",
      "For (k, 5): 2k − 3(5) + 1 = 0 → 2k − 15 + 1 = 0 → 2k = 14 → k = 7.",
      "The two values of k are 7/3 and 7, which are NOT the same.",
    ],
    shortcut: "Substitute each ordered pair into the equation and solve for k independently.",
    bloomLevel: "apply",
    conceptTested: "Finding unknowns in solution pairs",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Graph of a Linear Equation (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch4_graph_b01",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables",
    subtopic: "Graph of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "Draw the graph of 3x + 4y = 12. Find the x-intercept and y-intercept from the graph. Verify algebraically.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "y = 0: 3x = 12 → x = 4. x-intercept: (4, 0).",
      "x = 0: 4y = 12 → y = 3. y-intercept: (0, 3).",
      "Plot (4, 0) and (0, 3); draw a straight line through them.",
      "A third point check: x = 2 → 6 + 4y = 12 → y = 3/2. Point (2, 3/2) lies on the line. ✓",
    ],
    shortcut: "Set y = 0 for x-intercept; set x = 0 for y-intercept. Plot both to draw the line.",
    bloomLevel: "apply",
    conceptTested: "Graphing linear equations and finding intercepts",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_graph_b02",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables",
    subtopic: "Graph of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "The graph of the equation y = mx passes through the point (3, −6). Find m. What does the graph look like?",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "Substitute (3, −6): −6 = m × 3 → m = −2.",
      "Equation: y = −2x.",
      "It is a straight line through the origin with slope −2.",
      "It passes through (0, 0), (1, −2), (−1, 2), etc.",
    ],
    shortcut: "y = mx always passes through origin; substitute known point to find slope.",
    bloomLevel: "apply",
    conceptTested: "Lines through the origin",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_graph_b03",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables",
    subtopic: "Graph of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "Rohan earns ₹300 per day as a daily-wage worker. Write a linear equation for his total earnings (y) after x days. Draw its graph and find when his earnings will reach ₹2100.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Equation: y = 300x.",
      "Table of values: (0, 0), (1, 300), (2, 600), (3, 900), (7, 2100).",
      "Plot these points and draw a straight line through the origin.",
      "Set y = 2100: 300x = 2100 → x = 7. He reaches ₹2100 after 7 days.",
    ],
    shortcut: "Read from the graph: find x when the line hits y = 2100.",
    bloomLevel: "apply",
    conceptTested: "Real-life application of linear equation graphs",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_graph_b04",
    topicId: "ap_ssc_math9_ch4_graph_of_linear_equation",
    topic: "Linear Equations in Two Variables",
    subtopic: "Graph of a Linear Equation",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "Two equations are given: 2x + y = 6 and x − y = 3. Plot both on the same axes and find their point of intersection.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "Line 1 (2x + y = 6): x-intercept (3, 0); y-intercept (0, 6).",
      "Line 2 (x − y = 3): x-intercept (3, 0); y-intercept (0, −3).",
      "Both lines pass through (3, 0)! So one intersection point is (3, 0).",
      "Verify: 2(3) + 0 = 6 ✓ and 3 − 0 = 3 ✓.",
      "Intersection: (3, 0).",
    ],
    shortcut: "Plot intercepts for each line; visual intersection = algebraic solution.",
    bloomLevel: "analyse",
    conceptTested: "Graphical solution of simultaneous equations",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 3 — Equations of Special Lines (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch4_special_b01",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables",
    subtopic: "Equations of Special Lines",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "Write the equation of:\n(i) a line parallel to the x-axis at a distance of 4 units above it\n(ii) a line parallel to the y-axis passing through (−3, 5)\n(iii) the x-axis\n(iv) the y-axis",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 4,
    options: [],
    solutionSteps: [
      "(i) Parallel to x-axis, 4 units above → y = 4.",
      "(ii) Parallel to y-axis through (−3, 5) → x = −3.",
      "(iii) x-axis → y = 0.",
      "(iv) y-axis → x = 0.",
    ],
    shortcut: "Horizontal lines: y = constant. Vertical lines: x = constant.",
    bloomLevel: "remember",
    conceptTested: "Equations of horizontal and vertical lines",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_special_b02",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables",
    subtopic: "Equations of Special Lines",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "Explain why the equation x = 5 represents a line in two-variable coordinate geometry but a point on a number line. Draw both representations.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "On a number line (1-D): x = 5 is a single point (the value 5 on the axis).",
      "In a coordinate plane (2-D): x = 5 means 'all points whose x-coordinate is 5', regardless of y.",
      "This gives the set {(5, y) : y ∈ ℝ} — an infinite set of points forming a vertical line at x = 5.",
      "Thus, in 2-D, x = 5 is drawn as a vertical straight line passing through (5, 0), (5, 1), (5, −2), etc.",
    ],
    shortcut: "In 2-D, one equation in two variables → a line (one degree of freedom remaining).",
    bloomLevel: "understand",
    conceptTested: "Interpreting a single-variable equation in 2-D",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_special_b03",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables",
    subtopic: "Equations of Special Lines",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "The temperature T (°C) and the number of chirps n per minute of a cricket are related by T = n/4 + 5. Plot the graph. What temperature corresponds to 60 chirps per minute?",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Table: n = 0 → T = 5; n = 20 → T = 10; n = 40 → T = 15; n = 60 → T = 20.",
      "Plot n on x-axis, T on y-axis. Points: (0,5), (20,10), (40,15), (60,20).",
      "At n = 60: T = 60/4 + 5 = 15 + 5 = 20°C.",
    ],
    shortcut: "Substitute n = 60 directly into the formula.",
    bloomLevel: "apply",
    conceptTested: "Real-life graph of linear equation",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch4_special_b04",
    topicId: "ap_ssc_math9_ch4_equations_of_special_lines",
    topic: "Linear Equations in Two Variables",
    subtopic: "Equations of Special Lines",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 4,
    questionText:
      "A line is parallel to the y-axis and passes through (7, −3). Another line is parallel to the x-axis and passes through (−1, 4). Find their point of intersection.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 3,
    options: [],
    solutionSteps: [
      "Line 1 (parallel to y-axis through (7, −3)): equation x = 7.",
      "Line 2 (parallel to x-axis through (−1, 4)): equation y = 4.",
      "Intersection: x = 7 and y = 4 simultaneously → point (7, 4).",
    ],
    shortcut: "Vertical line x = a and horizontal line y = b always intersect at (a, b).",
    bloomLevel: "apply",
    conceptTested: "Intersection of horizontal and vertical lines",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 4 (Linear Equations)…");

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
