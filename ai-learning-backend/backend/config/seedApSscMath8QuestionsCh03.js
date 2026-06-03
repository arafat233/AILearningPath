/**
 * AP SSC Class 8 Math — Ch3 Understanding Quadrilaterals — Questions (MCQ).
 * 5 MCQ × 4 topics = 20. Usage: node config/seedApSscMath8QuestionsCh03.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 3, CHAP = "Understanding Quadrilaterals";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (text, logicTag) => ({ text, type: "correct", logicTag });
const W = (text, logicTag) => ({ text, type: "concept_error", logicTag });
const T1 = "ap_ssc_math8_ch3_polygons_classification", T2 = "ap_ssc_math8_ch3_angle_sum_property",
      T3 = "ap_ssc_math8_ch3_kinds_of_quadrilaterals", T4 = "ap_ssc_math8_ch3_parallelogram_properties";

const QUESTIONS = [
  mcq("ap_ssc8_ch3_pc_a01", T1, "Polygons", "Diagonal count formula", "medium", "apply",
    "How many diagonals does a hexagon (6 sides) have?", [C("9", "n_n3_2"), W("6", "sides"), W("12", "double"), W("18", "n_n3")]),
  mcq("ap_ssc8_ch3_pc_a02", T1, "Polygons", "Regular polygon definition", "easy", "understand",
    "A regular polygon has:", [C("all sides equal AND all angles equal", "both"), W("only all sides equal", "sides"), W("only all angles equal", "angles"), W("all diagonals equal", "diag")]),
  mcq("ap_ssc8_ch3_pc_a03", T1, "Polygons", "Convex vs concave", "medium", "understand",
    "A polygon with at least one interior angle greater than 180° is called:", [C("Concave", "concave"), W("Convex", "convex"), W("Regular", "regular"), W("Equilateral", "equi")]),
  mcq("ap_ssc8_ch3_pc_a04", T1, "Polygons", "Diagonals of a quadrilateral", "easy", "apply",
    "The number of diagonals of a quadrilateral is:", [C("2", "ok"), W("4", "sides"), W("1", "wrong"), W("0", "triangle")]),
  mcq("ap_ssc8_ch3_pc_a05", T1, "Polygons", "What is a polygon", "easy", "remember",
    "Which of these is NOT a polygon?", [C("A figure with one curved side", "curved"), W("A triangle", "tri"), W("A pentagon", "pent"), W("A square", "sq")]),

  mcq("ap_ssc8_ch3_as_a01", T2, "Angle Sum", "Interior angle sum", "easy", "apply",
    "The sum of the interior angles of a pentagon is:", [C("540°", "ok"), W("360°", "quad"), W("720°", "hex"), W("180°", "tri")]),
  mcq("ap_ssc8_ch3_as_a02", T2, "Angle Sum", "Exterior angle sum", "easy", "remember",
    "The sum of the exterior angles of any convex polygon is:", [C("360°", "ok"), W("180°", "tri"), W("depends on sides", "depends"), W("540°", "pent")]),
  mcq("ap_ssc8_ch3_as_a03", T2, "Angle Sum", "Interior angle of regular polygon", "medium", "apply",
    "Each interior angle of a regular hexagon is:", [C("120°", "ok"), W("108°", "pent"), W("135°", "oct"), W("90°", "sq")]),
  mcq("ap_ssc8_ch3_as_a04", T2, "Angle Sum", "Sides from exterior angle", "medium", "apply",
    "A regular polygon has each exterior angle 72°. The number of sides is:", [C("5", "ok"), W("6", "wrong"), W("8", "wrong2"), W("72", "literal")]),
  mcq("ap_ssc8_ch3_as_a05", T2, "Angle Sum", "Exterior angle of regular pentagon", "medium", "apply",
    "Each exterior angle of a regular pentagon is:", [C("72°", "ok"), W("108°", "interior"), W("60°", "wrong"), W("90°", "wrong2")]),

  mcq("ap_ssc8_ch3_kq_a01", T3, "Kinds of Quadrilaterals", "Rhombus", "easy", "understand",
    "A parallelogram with all four sides equal but no right angles is a:", [C("Rhombus", "ok"), W("Square", "right_angles"), W("Rectangle", "rect"), W("Trapezium", "trap")]),
  mcq("ap_ssc8_ch3_kq_a02", T3, "Kinds of Quadrilaterals", "Trapezium", "easy", "remember",
    "A quadrilateral with exactly one pair of parallel sides is a:", [C("Trapezium", "ok"), W("Parallelogram", "para"), W("Rhombus", "rhom"), W("Kite", "kite")]),
  mcq("ap_ssc8_ch3_kq_a03", T3, "Kinds of Quadrilaterals", "Rectangle definition", "medium", "understand",
    "A parallelogram with all angles equal to 90° is always a:", [C("Rectangle", "ok"), W("Rhombus", "rhom"), W("Trapezium", "trap"), W("Kite", "kite")]),
  mcq("ap_ssc8_ch3_kq_a04", T3, "Kinds of Quadrilaterals", "Square in the hierarchy", "medium", "analyze",
    "Which statement is FALSE?", [C("A square is not a rectangle", "false_stmt"), W("A square is a rhombus", "true1"), W("A square is a parallelogram", "true2"), W("A square is a rectangle", "true3")]),
  mcq("ap_ssc8_ch3_kq_a05", T3, "Kinds of Quadrilaterals", "Kite", "medium", "understand",
    "A kite is a quadrilateral with:", [C("two pairs of adjacent equal sides", "ok"), W("both pairs of opposite sides parallel", "para"), W("all sides equal", "rhom"), W("all angles 90°", "rect")]),

  mcq("ap_ssc8_ch3_pp_a01", T4, "Parallelogram Properties", "Opposite angles", "easy", "remember",
    "In a parallelogram, opposite angles are:", [C("equal", "ok"), W("supplementary", "adjacent"), W("complementary", "wrong"), W("always 90°", "rect")]),
  mcq("ap_ssc8_ch3_pp_a02", T4, "Parallelogram Properties", "Adjacent angles", "medium", "apply",
    "In parallelogram ABCD, ∠A = 70°. Then ∠B =", [C("110°", "ok"), W("70°", "equal"), W("20°", "complement"), W("290°", "wrong")]),
  mcq("ap_ssc8_ch3_pp_a03", T4, "Parallelogram Properties", "Diagonals bisect", "easy", "understand",
    "The diagonals of a parallelogram:", [C("bisect each other", "ok"), W("are always equal", "rect"), W("are always perpendicular", "rhom"), W("never intersect", "wrong")]),
  mcq("ap_ssc8_ch3_pp_a04", T4, "Parallelogram Properties", "Equal diagonals", "medium", "analyze",
    "In which quadrilateral are the diagonals EQUAL?", [C("Rectangle", "ok"), W("Rhombus", "rhom"), W("General parallelogram", "para"), W("Kite", "kite")]),
  mcq("ap_ssc8_ch3_pp_a05", T4, "Parallelogram Properties", "Perpendicular diagonals", "medium", "analyze",
    "In which quadrilateral are the diagonals PERPENDICULAR?", [C("Rhombus", "ok"), W("Rectangle", "rect"), W("General parallelogram", "para"), W("Trapezium", "trap")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch3 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
