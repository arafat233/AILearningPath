import "dotenv/config";
import mongoose from "mongoose";
import { Question } from "../models/index.js";

const BOARD = "AP_SSC";
const GRADE = "9";

const questions = [
  // ─────────────────────────────────────────────
  // TOPIC 1 — Cartesian System (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch3_cartesian_b01",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry",
    subtopic: "Cartesian System",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "Name the quadrant or axis for each point:\n(i) (−3, 5)  (ii) (4, −7)  (iii) (0, −2)  (iv) (−1, −1)  (v) (6, 0)",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 5,
    options: [],
    solutionSteps: [
      "(i) (−3, 5): x < 0, y > 0 → Quadrant II.",
      "(ii) (4, −7): x > 0, y < 0 → Quadrant IV.",
      "(iii) (0, −2): x = 0, y < 0 → Negative y-axis.",
      "(iv) (−1, −1): x < 0, y < 0 → Quadrant III.",
      "(v) (6, 0): y = 0, x > 0 → Positive x-axis.",
    ],
    shortcut: "Q I: (+,+)  Q II: (−,+)  Q III: (−,−)  Q IV: (+,−). On axis when one coordinate is 0.",
    bloomLevel: "remember",
    conceptTested: "Quadrant and axis identification",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_b02",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry",
    subtopic: "Cartesian System",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "The point P(a, b) lies in Quadrant III. What can you say about the signs of a and b? If P is reflected in the x-axis, give the coordinates of the image. If P is then reflected in the y-axis, give the final coordinates.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 3,
    options: [],
    solutionSteps: [
      "Q III means both coordinates are negative: a < 0 and b < 0.",
      "Reflection in x-axis: y-coordinate changes sign → image is P'(a, −b). Since b < 0, −b > 0 → P' is in Q II.",
      "Reflection of P'(a, −b) in y-axis: x-coordinate changes sign → final point is (−a, −b). Since a < 0, −a > 0 and −b > 0 → Q I.",
    ],
    shortcut: "x-axis reflection: (x, y) → (x, −y). y-axis reflection: (x, y) → (−x, y).",
    bloomLevel: "apply",
    conceptTested: "Reflections in coordinate axes",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_b03",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry",
    subtopic: "Cartesian System",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "Write the abscissa and ordinate of each point. Also state its distance from the x-axis and from the y-axis:\n(i) (−5, 3)  (ii) (0, 7)  (iii) (4, −4)",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "(i) Abscissa = −5, ordinate = 3. Distance from x-axis = |3| = 3. Distance from y-axis = |−5| = 5.",
      "(ii) Abscissa = 0, ordinate = 7. Distance from x-axis = 7. Distance from y-axis = 0 (point is on y-axis).",
      "(iii) Abscissa = 4, ordinate = −4. Distance from x-axis = 4. Distance from y-axis = 4.",
    ],
    shortcut: "Abscissa = x-coordinate; ordinate = y-coordinate. Distance from x-axis = |y|; distance from y-axis = |x|.",
    bloomLevel: "understand",
    conceptTested: "Abscissa, ordinate, and distances from axes",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch3_cartesian_b04",
    topicId: "ap_ssc_math9_ch3_cartesian_system",
    topic: "Coordinate Geometry",
    subtopic: "Cartesian System",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "Three vertices of a rectangle are A(1, 3), B(5, 3), and C(5, −2). Find the fourth vertex D. Also find the area of the rectangle.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "A rectangle has opposite sides equal and all angles 90°.",
      "AB is horizontal (same y = 3): length = 5 − 1 = 4.",
      "BC is vertical (same x = 5): length = 3 − (−2) = 5.",
      "D must have x = 1 (same as A) and y = −2 (same as C). So D = (1, −2).",
      "Area = AB × BC = 4 × 5 = 20 square units.",
    ],
    shortcut: "In a rectangle, the fourth vertex shares one coordinate with each adjacent vertex.",
    bloomLevel: "apply",
    conceptTested: "Using coordinates to find missing vertex and area",
    isAIGenerated: true,
  },

  // ─────────────────────────────────────────────
  // TOPIC 2 — Plotting Points (4 free-text)
  // ─────────────────────────────────────────────
  {
    questionId: "ap_ssc9_ch3_plotting_b01",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry",
    subtopic: "Plotting Points",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "Plot the points A(2, 3), B(−3, 2), C(−3, −4), D(2, −4) on a coordinate plane. Join them in order. Identify the shape and find its area.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "AB: from (2,3) to (−3,2) — slant side (not horizontal/vertical).",
      "BC: from (−3,2) to (−3,−4) — vertical side, length = 6.",
      "CD: from (−3,−4) to (2,−4) — horizontal side, length = 5.",
      "DA: from (2,−4) to (2,3) — vertical side, length = 7.",
      "Wait — checking: this is NOT a rectangle since AB is slant.",
      "Correct shape: The figure ABCD with AB slant is a quadrilateral (trapezium/irregular). Let's compute using the Shoelace formula.",
      "Area = ½|x_A(y_B − y_D) + x_B(y_C − y_A) + x_C(y_D − y_B) + x_D(y_A − y_C)|",
      "= ½|2(2−(−4)) + (−3)(−4−3) + (−3)(−4−2) + 2(3−(−4))|",
      "= ½|2(6) + (−3)(−7) + (−3)(−6) + 2(7)|",
      "= ½|12 + 21 + 18 + 14| = ½ × 65 = 32.5 sq units.",
    ],
    shortcut: "Use Shoelace formula for any polygon given coordinates.",
    bloomLevel: "apply",
    conceptTested: "Plotting and computing area using coordinates",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch3_plotting_b02",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry",
    subtopic: "Plotting Points",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "On a coordinate plane, show that the points (1, 2), (3, 4), and (5, 2) form an isosceles triangle. Find its area.",
    questionType: "free_text",
    difficulty: "medium",
    difficultyScore: 0.5,
    marks: 4,
    options: [],
    solutionSteps: [
      "Let A(1, 2), B(3, 4), C(5, 2).",
      "AB = √[(3−1)² + (4−2)²] = √[4 + 4] = 2√2.",
      "BC = √[(5−3)² + (2−4)²] = √[4 + 4] = 2√2.",
      "AC = √[(5−1)² + (2−2)²] = √16 = 4.",
      "AB = BC = 2√2 → the triangle is isosceles. ✓",
      "Area using coordinate formula = ½|x_A(y_B − y_C) + x_B(y_C − y_A) + x_C(y_A − y_B)|",
      "= ½|1(4−2) + 3(2−2) + 5(2−4)| = ½|2 + 0 − 10| = ½ × 8 = 4 sq units.",
    ],
    shortcut: "Compute all three sides using distance formula. Equal sides → isosceles.",
    bloomLevel: "apply",
    conceptTested: "Properties of triangles using coordinate geometry",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch3_plotting_b03",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry",
    subtopic: "Plotting Points",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "What is the distance between the points P(a, b) and Q(−a, −b)? What does this tell you geometrically about O, P, and Q?",
    questionType: "free_text",
    difficulty: "easy",
    difficultyScore: 0.2,
    marks: 3,
    options: [],
    solutionSteps: [
      "PQ = √[(−a − a)² + (−b − b)²] = √[(−2a)² + (−2b)²] = √[4a² + 4b²] = 2√(a² + b²).",
      "OP = √[a² + b²] and OQ = √[a² + b²] = OP.",
      "Also PQ = 2 × OP, so O is the midpoint of PQ.",
      "Geometrically: P and Q are symmetric about the origin O. O lies on PQ and bisects it.",
    ],
    shortcut: "Q = −P means P and Q are symmetric about the origin.",
    bloomLevel: "understand",
    conceptTested: "Symmetry about the origin",
    isAIGenerated: true,
  },
  {
    questionId: "ap_ssc9_ch3_plotting_b04",
    topicId: "ap_ssc_math9_ch3_plotting_points",
    topic: "Coordinate Geometry",
    subtopic: "Plotting Points",
    subject: "Mathematics",
    grade: GRADE,
    examBoard: BOARD,
    chapterNumber: 3,
    questionText:
      "Show that the points A(0, −1), B(2, 1) and C(0, 3) are vertices of an isosceles right triangle. Find its hypotenuse length.",
    questionType: "free_text",
    difficulty: "hard",
    difficultyScore: 0.8,
    marks: 5,
    options: [],
    solutionSteps: [
      "AB = √[(2−0)² + (1−(−1))²] = √[4 + 4] = 2√2.",
      "BC = √[(0−2)² + (3−1)²] = √[4 + 4] = 2√2.",
      "AC = √[(0−0)² + (3−(−1))²] = √[0 + 16] = 4.",
      "AB = BC → isosceles. ✓",
      "Check right angle: AB² + BC² = 8 + 8 = 16 = AC². ✓ (By converse of Pythagoras)",
      "The right angle is at B. Hypotenuse = AC = 4.",
    ],
    shortcut: "Verify equal legs for isosceles; check a² + b² = c² for right angle.",
    bloomLevel: "analyse",
    conceptTested: "Isosceles right triangle verification via coordinates",
    isAIGenerated: true,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding AP SSC Math 9 — Layer B — Chapter 3 (Coordinate Geometry)…");

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
