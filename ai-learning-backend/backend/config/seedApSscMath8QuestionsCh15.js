/**
 * AP SSC Class 8 Math — Ch15 Introduction to Graphs — Questions (MCQ). 5×3 = 15.
 * Usage: node config/seedApSscMath8QuestionsCh15.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 15, CHAP = "Introduction to Graphs";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch15_coordinate_plane", T2 = "ap_ssc_math8_ch15_linear_graphs",
      T3 = "ap_ssc_math8_ch15_types_of_graphs";

const QUESTIONS = [
  mcq("ap_ssc8_ch15_cp_a01", T1, "Coordinate Plane", "Origin", "easy", "remember", "The coordinates of the origin are:", [C("(0, 0)", "ok"), W("(1, 1)", "wrong"), W("(0, 1)", "wrong2"), W("(1, 0)", "wrong3")]),
  mcq("ap_ssc8_ch15_cp_a02", T1, "Coordinate Plane", "Order of coordinates", "easy", "understand", "In the point (3, 5), the number 3 is the:", [C("x-coordinate (abscissa)", "ok"), W("y-coordinate", "swap"), W("origin", "wrong"), W("slope", "wrong2")]),
  mcq("ap_ssc8_ch15_cp_a03", T1, "Coordinate Plane", "Point on x-axis", "medium", "apply", "A point lies on the x-axis. Its y-coordinate is:", [C("0", "ok"), W("1", "wrong"), W("equal to x", "wrong2"), W("undefined", "wrong3")]),
  mcq("ap_ssc8_ch15_cp_a04", T1, "Coordinate Plane", "Plot a point", "easy", "apply", "To plot (4, 2), you move 4 units along the x-axis and:", [C("2 units up the y-axis", "ok"), W("2 units along the x-axis", "wrong"), W("4 units up", "swap"), W("2 units down", "sign")]),
  mcq("ap_ssc8_ch15_cp_a05", T1, "Coordinate Plane", "Point on y-axis", "medium", "apply", "A point lies on the y-axis. Its x-coordinate is:", [C("0", "ok"), W("1", "wrong"), W("equal to y", "wrong2"), W("negative", "wrong3")]),

  mcq("ap_ssc8_ch15_lg_a01", T2, "Linear Graphs", "Shape", "easy", "remember", "The graph of a linear equation is always a:", [C("straight line", "ok"), W("curve", "wrong"), W("circle", "wrong2"), W("parabola", "wrong3")]),
  mcq("ap_ssc8_ch15_lg_a02", T2, "Linear Graphs", "y = x", "medium", "apply", "The graph of y = x passes through the origin at an angle of:", [C("45° to the x-axis", "ok"), W("90°", "wrong"), W("0°", "wrong2"), W("30°", "wrong3")]),
  mcq("ap_ssc8_ch15_lg_a03", T2, "Linear Graphs", "Horizontal line", "medium", "understand", "The graph of y = 3 is a:", [C("horizontal line through (0, 3)", "ok"), W("vertical line", "swap"), W("line through the origin", "wrong"), W("curve", "wrong2")]),
  mcq("ap_ssc8_ch15_lg_a04", T2, "Linear Graphs", "Read a value", "medium", "apply", "On the line y = 2x, when x = 3 the value of y is:", [C("6", "ok"), W("5", "add"), W("3", "wrong"), W("1.5", "wrong2")]),
  mcq("ap_ssc8_ch15_lg_a05", T2, "Linear Graphs", "Vertical line", "medium", "understand", "The graph of x = 4 is a:", [C("vertical line through (4, 0)", "ok"), W("horizontal line", "swap"), W("line through the origin", "wrong"), W("point", "wrong2")]),

  mcq("ap_ssc8_ch15_tg_a01", T3, "Types of Graphs", "Trend over time", "easy", "understand", "A line graph is best for showing:", [C("change over time", "ok"), W("parts of a whole", "pie"), W("separate categories", "bar"), W("a single value", "wrong")]),
  mcq("ap_ssc8_ch15_tg_a02", T3, "Types of Graphs", "Parts of a whole", "easy", "understand", "To show parts of a whole, the best graph is a:", [C("pie chart", "ok"), W("line graph", "line"), W("bar graph", "bar"), W("histogram", "hist")]),
  mcq("ap_ssc8_ch15_tg_a03", T3, "Types of Graphs", "Bar graph use", "easy", "understand", "A bar graph is used to compare:", [C("distinct categories", "ok"), W("continuous data", "hist"), W("parts of a whole", "pie"), W("a trend over time", "line")]),
  mcq("ap_ssc8_ch15_tg_a04", T3, "Types of Graphs", "Histogram", "medium", "understand", "A histogram differs from a bar graph because it shows:", [C("continuous (grouped) data with touching bars", "ok"), W("parts of a whole", "pie"), W("a single point", "wrong"), W("separate categories with gaps", "bar")]),
  mcq("ap_ssc8_ch15_tg_a05", T3, "Types of Graphs", "Choose the graph", "medium", "analyze", "To show a city's temperature each hour through the day, the best graph is a:", [C("line graph", "ok"), W("pie chart", "pie"), W("bar graph", "bar"), W("histogram", "hist")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch15 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
