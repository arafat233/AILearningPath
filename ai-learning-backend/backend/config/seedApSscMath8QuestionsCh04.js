/**
 * AP SSC Class 8 Math — Ch4 Practical Geometry — Questions (MCQ).
 * 5 MCQ × 3 topics = 15. Usage: node config/seedApSscMath8QuestionsCh04.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 4, CHAP = "Practical Geometry";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (text, logicTag) => ({ text, type: "correct", logicTag });
const W = (text, logicTag) => ({ text, type: "concept_error", logicTag });
const T1 = "ap_ssc_math8_ch4_five_measurements", T2 = "ap_ssc_math8_ch4_construct_quadrilaterals",
      T3 = "ap_ssc_math8_ch4_special_quadrilaterals";

const QUESTIONS = [
  mcq("ap_ssc8_ch4_fm_a01", T1, "Five Measurements", "Number to construct", "easy", "remember",
    "How many independent measurements are needed to construct a unique quadrilateral?", [C("5", "ok"), W("4", "sides"), W("3", "triangle"), W("6", "wrong")]),
  mcq("ap_ssc8_ch4_fm_a02", T1, "Five Measurements", "Diagonal splits", "medium", "understand",
    "A diagonal divides a quadrilateral into:", [C("2 triangles", "ok"), W("2 rectangles", "wrong"), W("4 triangles", "both_diag"), W("3 triangles", "wrong2")]),
  mcq("ap_ssc8_ch4_fm_a03", T1, "Five Measurements", "Counting data", "easy", "apply",
    "'4 sides and 1 diagonal' is how many measurements?", [C("5", "ok"), W("4", "sides_only"), W("6", "wrong"), W("3", "wrong2")]),
  mcq("ap_ssc8_ch4_fm_a04", T1, "Five Measurements", "Triangle measurements", "easy", "remember",
    "A triangle is uniquely constructed from how many measurements?", [C("3", "ok"), W("2", "wrong"), W("4", "wrong2"), W("5", "quad")]),
  mcq("ap_ssc8_ch4_fm_a05", T1, "Five Measurements", "Why 5 = 3 + 2", "medium", "understand",
    "Why does a quadrilateral need 5 (not 6) measurements?", [C("The two triangles share the diagonal", "share"), W("Angles don't count", "angles"), W("One side is always known", "wrong"), W("Quadrilaterals are rigid", "rigid")]),

  mcq("ap_ssc8_ch4_cq_a01", T2, "Constructing Quadrilaterals", "Locating a vertex", "easy", "understand",
    "To locate a vertex from two known side lengths, you draw:", [C("two arcs that intersect", "arcs"), W("a single straight line", "line"), W("a circle through the origin", "circle"), W("a perpendicular bisector only", "perp")]),
  mcq("ap_ssc8_ch4_cq_a02", T2, "Constructing Quadrilaterals", "Opposite sides of diagonal", "medium", "apply",
    "In constructing ABCD from 4 sides + diagonal AC, vertices B and D are placed:", [C("on opposite sides of AC", "opposite"), W("on the same side of AC", "same"), W("both on AC", "on_line"), W("at the midpoint of AC", "mid")]),
  mcq("ap_ssc8_ch4_cq_a03", T2, "Constructing Quadrilaterals", "Tool for angles", "easy", "remember",
    "Which instrument is used to draw a given angle?", [C("Protractor", "ok"), W("Compass only", "compass"), W("Set square", "setsq"), W("Divider", "divider")]),
  mcq("ap_ssc8_ch4_cq_a04", T2, "Constructing Quadrilaterals", "Construction impossible", "medium", "analyze",
    "If the two arc radii for a vertex sum to LESS than the diagonal, then:", [C("the arcs don't meet — construction is impossible", "impossible"), W("the figure becomes a square", "square"), W("the diagonal must be redrawn", "redraw"), W("the answer is still unique", "unique")]),
  mcq("ap_ssc8_ch4_cq_a05", T2, "Constructing Quadrilaterals", "Match tool to data", "easy", "understand",
    "Given side lengths, you use arcs; given angles, you use:", [C("a protractor", "protractor"), W("more arcs", "arcs"), W("a ruler only", "ruler"), W("guesswork", "guess")]),

  mcq("ap_ssc8_ch4_sq_a01", T3, "Special Quadrilaterals", "Square needs 1", "easy", "understand",
    "The minimum number of measurements needed to construct a square is:", [C("1 (the side)", "ok"), W("5", "general"), W("2", "rect"), W("4", "sides")]),
  mcq("ap_ssc8_ch4_sq_a02", T3, "Special Quadrilaterals", "Rhombus from diagonals", "medium", "apply",
    "A rhombus can be constructed knowing only:", [C("its two diagonals", "ok"), W("one side", "side"), W("one angle", "angle"), W("its perimeter", "perimeter")]),
  mcq("ap_ssc8_ch4_sq_a03", T3, "Special Quadrilaterals", "Rhombus diagonals angle", "easy", "remember",
    "The diagonals of a rhombus intersect at:", [C("90°", "ok"), W("60°", "wrong"), W("45°", "wrong2"), W("any angle", "any")]),
  mcq("ap_ssc8_ch4_sq_a04", T3, "Special Quadrilaterals", "Rectangle needs 2", "medium", "understand",
    "To construct a rectangle you need:", [C("length and breadth (2 measurements)", "two"), W("only one side", "one"), W("five measurements", "five"), W("the two diagonals only", "diag")]),
  mcq("ap_ssc8_ch4_sq_a05", T3, "Special Quadrilaterals", "Parallelogram data", "medium", "apply",
    "A parallelogram is fixed by two adjacent sides and:", [C("the included angle", "angle"), W("nothing more", "nothing"), W("the perimeter", "perimeter"), W("one diagonal length only as well as both", "wrong")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch4 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
