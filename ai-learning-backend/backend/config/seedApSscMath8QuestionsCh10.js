/**
 * AP SSC Class 8 Math — Ch10 Visualising Solid Shapes — Questions (MCQ). 5×3 = 15.
 * Usage: node config/seedApSscMath8QuestionsCh10.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 10, CHAP = "Visualising Solid Shapes";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch10_views_and_nets", T2 = "ap_ssc_math8_ch10_prisms_pyramids",
      T3 = "ap_ssc_math8_ch10_polyhedra_euler";

const QUESTIONS = [
  mcq("ap_ssc8_ch10_vn_a01", T1, "Views and Nets", "Net of a cube", "easy", "understand", "A net of a cube consists of:", [C("6 squares", "ok"), W("4 squares", "wrong"), W("6 rectangles", "rect"), W("8 triangles", "wrong2")]),
  mcq("ap_ssc8_ch10_vn_a02", T1, "Views and Nets", "Standard views", "easy", "remember", "The three standard views of a solid are top, front and:", [C("side", "ok"), W("inside", "wrong"), W("diagonal", "wrong2"), W("back-only", "wrong3")]),
  mcq("ap_ssc8_ch10_vn_a03", T1, "Views and Nets", "What is a net", "easy", "understand", "A net is:", [C("a 2-D figure that folds into a solid", "ok"), W("a 3-D solid", "wrong"), W("the shadow of a solid", "wrong2"), W("a cross-section", "wrong3")]),
  mcq("ap_ssc8_ch10_vn_a04", T1, "Views and Nets", "Top view of a cylinder", "medium", "apply", "The top view of a cylinder standing upright is a:", [C("circle", "ok"), W("rectangle", "side"), W("triangle", "cone"), W("square", "wrong")]),
  mcq("ap_ssc8_ch10_vn_a05", T1, "Views and Nets", "Net of a cylinder", "medium", "understand", "The net of a cylinder is made of two circles and one:", [C("rectangle", "ok"), W("triangle", "cone"), W("square", "cube"), W("circle", "wrong")]),

  mcq("ap_ssc8_ch10_pp_a01", T2, "Prisms and Pyramids", "Faces of triangular prism", "medium", "apply", "A triangular prism has how many faces?", [C("5", "ok"), W("6", "cube"), W("4", "tetra"), W("3", "wrong")]),
  mcq("ap_ssc8_ch10_pp_a02", T2, "Prisms and Pyramids", "Apex of a pyramid", "easy", "remember", "A pyramid has a base and a single point called the:", [C("apex", "ok"), W("vertex base", "wrong"), W("edge", "wrong2"), W("face", "wrong3")]),
  mcq("ap_ssc8_ch10_pp_a03", T2, "Prisms and Pyramids", "Prism cross-section", "medium", "understand", "A prism has the same cross-section throughout because its two ends are:", [C("identical and parallel", "ok"), W("circular", "wrong"), W("triangular only", "wrong2"), W("perpendicular", "wrong3")]),
  mcq("ap_ssc8_ch10_pp_a04", T2, "Prisms and Pyramids", "Square pyramid faces", "medium", "apply", "A square pyramid has how many faces in total?", [C("5", "ok"), W("4", "wrong"), W("6", "wrong2"), W("8", "wrong3")]),
  mcq("ap_ssc8_ch10_pp_a05", T2, "Prisms and Pyramids", "Prism vs pyramid", "easy", "understand", "Unlike a prism, a pyramid has lateral faces that are:", [C("triangles meeting at an apex", "ok"), W("rectangles", "prism"), W("circles", "wrong"), W("squares only", "wrong2")]),

  mcq("ap_ssc8_ch10_pe_a01", T3, "Polyhedra & Euler", "Euler's formula", "easy", "remember", "Euler's formula for a polyhedron is:", [C("F + V − E = 2", "ok"), W("F + V + E = 2", "sign"), W("F − V + E = 2", "sign2"), W("F + E − V = 2", "swap")]),
  mcq("ap_ssc8_ch10_pe_a02", T3, "Polyhedra & Euler", "Apply Euler", "medium", "apply", "A polyhedron has 6 faces and 8 vertices. Its number of edges is:", [C("12", "ok"), W("14", "wrong"), W("10", "wrong2"), W("16", "wrong3")]),
  mcq("ap_ssc8_ch10_pe_a03", T3, "Polyhedra & Euler", "Definition", "easy", "understand", "A polyhedron is a solid whose faces are all:", [C("polygons (flat)", "ok"), W("curved", "wrong"), W("circles", "wrong2"), W("triangles only", "wrong3")]),
  mcq("ap_ssc8_ch10_pe_a04", T3, "Polyhedra & Euler", "Not a polyhedron", "medium", "analyze", "Which of these is NOT a polyhedron?", [C("Sphere", "curved"), W("Cube", "cube"), W("Tetrahedron", "tetra"), W("Triangular prism", "prism")]),
  mcq("ap_ssc8_ch10_pe_a05", T3, "Polyhedra & Euler", "Find vertices", "medium", "apply", "A polyhedron has 12 edges and 6 faces. By Euler's formula, the number of vertices is:", [C("8", "ok"), W("6", "wrong"), W("10", "wrong2"), W("18", "wrong3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch10 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
