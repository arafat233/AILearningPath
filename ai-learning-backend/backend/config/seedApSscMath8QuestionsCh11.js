/**
 * AP SSC Class 8 Math — Ch11 Mensuration — Questions (MCQ). 5×4 = 20.
 * Usage: node config/seedApSscMath8QuestionsCh11.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 11, CHAP = "Mensuration";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch11_area_trapezium_polygon", T2 = "ap_ssc_math8_ch11_surface_area_cuboid_cube",
      T3 = "ap_ssc_math8_ch11_surface_area_cylinder", T4 = "ap_ssc_math8_ch11_volume";

const QUESTIONS = [
  mcq("ap_ssc8_ch11_at_a01", T1, "Area of Trapezium", "Trapezium area formula", "easy", "remember", "The area of a trapezium is:", [C("½ × (sum of parallel sides) × height", "ok"), W("base × height", "para"), W("½ × base × height", "tri"), W("side²", "sq")]),
  mcq("ap_ssc8_ch11_at_a02", T1, "Area of Trapezium", "Compute area", "medium", "apply", "A trapezium has parallel sides 8 cm and 12 cm and height 5 cm. Its area is:", [C("50 cm²", "ok"), W("100 cm²", "no_half"), W("40 cm²", "wrong"), W("25 cm²", "wrong2")]),
  mcq("ap_ssc8_ch11_at_a03", T1, "Area of Polygon", "Split into shapes", "easy", "understand", "The area of an irregular polygon is found by:", [C("splitting it into triangles/trapeziums and adding", "ok"), W("multiplying its sides", "wrong"), W("using πr²", "circle"), W("counting vertices", "wrong2")]),
  mcq("ap_ssc8_ch11_at_a04", T1, "Area of Rhombus", "Rhombus by diagonals", "medium", "apply", "A rhombus has diagonals 6 cm and 8 cm. Its area is:", [C("24 cm²", "ok"), W("48 cm²", "no_half"), W("14 cm²", "sum"), W("12 cm²", "wrong")]),
  mcq("ap_ssc8_ch11_at_a05", T1, "Area of Trapezium", "Height role", "easy", "understand", "In the trapezium area formula, the height is the:", [C("perpendicular distance between the parallel sides", "ok"), W("longer parallel side", "wrong"), W("slant side", "slant"), W("diagonal", "diag")]),

  mcq("ap_ssc8_ch11_cu_a01", T2, "Surface Area — Cuboid/Cube", "Cuboid TSA", "easy", "remember", "The total surface area of a cuboid is:", [C("2(lb + bh + hl)", "ok"), W("lbh", "volume"), W("6a²", "cube"), W("2(l + b + h)", "wrong")]),
  mcq("ap_ssc8_ch11_cu_a02", T2, "Surface Area — Cuboid/Cube", "Cube TSA", "easy", "remember", "The total surface area of a cube of side a is:", [C("6a²", "ok"), W("a³", "volume"), W("4a²", "wrong"), W("6a", "wrong2")]),
  mcq("ap_ssc8_ch11_cu_a03", T2, "Surface Area — Cuboid/Cube", "Compute cube TSA", "medium", "apply", "The surface area of a cube of side 5 cm is:", [C("150 cm²", "ok"), W("125 cm²", "volume"), W("100 cm²", "wrong"), W("25 cm²", "one_face")]),
  mcq("ap_ssc8_ch11_cu_a04", T2, "Surface Area — Cuboid/Cube", "Lateral surface area", "medium", "understand", "The lateral surface area of a cuboid excludes the:", [C("top and bottom faces", "ok"), W("four side faces", "wrong"), W("all faces", "wrong2"), W("none", "wrong3")]),
  mcq("ap_ssc8_ch11_cu_a05", T2, "Surface Area — Cuboid/Cube", "Compute cuboid TSA", "medium", "apply", "A cuboid is 4 × 3 × 2 cm. Its total surface area is:", [C("52 cm²", "ok"), W("24 cm²", "volume"), W("26 cm²", "half"), W("48 cm²", "wrong")]),

  mcq("ap_ssc8_ch11_cy_a01", T3, "Surface Area — Cylinder", "Curved SA", "easy", "remember", "The curved surface area of a cylinder is:", [C("2πrh", "ok"), W("πr²h", "volume"), W("2πr²", "wrong"), W("πr²", "circle")]),
  mcq("ap_ssc8_ch11_cy_a02", T3, "Surface Area — Cylinder", "Total SA", "medium", "remember", "The total surface area of a closed cylinder is:", [C("2πr(h + r)", "ok"), W("2πrh", "curved"), W("πr²h", "volume"), W("2πr²", "ends")]),
  mcq("ap_ssc8_ch11_cy_a03", T3, "Surface Area — Cylinder", "Compute CSA", "medium", "apply", "A cylinder has r = 7 cm, h = 10 cm. Using π = 22/7, its CSA is:", [C("440 cm²", "ok"), W("220 cm²", "half"), W("154 cm²", "wrong"), W("770 cm²", "wrong2")]),
  mcq("ap_ssc8_ch11_cy_a04", T3, "Surface Area — Cylinder", "Net of a cylinder", "easy", "understand", "When opened out, the curved surface of a cylinder is a:", [C("rectangle", "ok"), W("circle", "wrong"), W("triangle", "cone"), W("square", "wrong2")]),
  mcq("ap_ssc8_ch11_cy_a05", T3, "Surface Area — Cylinder", "Width of the rectangle", "hard", "analyze", "When the curved surface of a cylinder is unrolled, the length of the rectangle equals the:", [C("circumference of the base (2πr)", "ok"), W("radius", "wrong"), W("diameter", "wrong2"), W("height", "wrong3")]),

  mcq("ap_ssc8_ch11_vo_a01", T4, "Volume", "Cuboid volume", "easy", "remember", "The volume of a cuboid is:", [C("l × b × h", "ok"), W("2(lb + bh + hl)", "tsa"), W("lb", "area"), W("l + b + h", "wrong")]),
  mcq("ap_ssc8_ch11_vo_a02", T4, "Volume", "Cylinder volume", "easy", "remember", "The volume of a cylinder is:", [C("πr²h", "ok"), W("2πrh", "csa"), W("2πr²", "wrong"), W("πrh", "wrong2")]),
  mcq("ap_ssc8_ch11_vo_a03", T4, "Volume", "Compute cube volume", "easy", "apply", "The volume of a cube of side 4 cm is:", [C("64 cm³", "ok"), W("16 cm³", "square"), W("96 cm³", "tsa"), W("12 cm³", "wrong")]),
  mcq("ap_ssc8_ch11_vo_a04", T4, "Volume", "Compute cuboid volume", "medium", "apply", "A tank is 5 × 4 × 2 m. Its volume is:", [C("40 m³", "ok"), W("22 m³", "wrong"), W("76 m³", "tsa"), W("11 m³", "wrong2")]),
  mcq("ap_ssc8_ch11_vo_a05", T4, "Volume", "Capacity in litres", "medium", "apply", "1 cubic metre equals how many litres?", [C("1000 L", "ok"), W("100 L", "wrong"), W("10 L", "wrong2"), W("1,000,000 L", "cm3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch11 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
