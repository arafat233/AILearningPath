/**
 * AP SSC Class 8 Math — Ch5 Data Handling — Questions (MCQ). 5×4 = 20.
 * Usage: node config/seedApSscMath8QuestionsCh05.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 5, CHAP = "Data Handling";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch5_grouped_data", T2 = "ap_ssc_math8_ch5_histograms",
      T3 = "ap_ssc_math8_ch5_pie_charts", T4 = "ap_ssc_math8_ch5_probability";

const QUESTIONS = [
  mcq("ap_ssc8_ch5_gd_a01", T1, "Grouped Data", "Range", "easy", "apply", "The range of the data 7, 12, 25, 41, 19 is:", [C("34", "max_min"), W("48", "sum"), W("41", "max"), W("7", "min")]),
  mcq("ap_ssc8_ch5_gd_a02", T1, "Grouped Data", "Class mark", "easy", "apply", "The class mark (midpoint) of the class 10–20 is:", [C("15", "mid"), W("10", "lower"), W("20", "upper"), W("30", "sum")]),
  mcq("ap_ssc8_ch5_gd_a03", T1, "Grouped Data", "Exclusive method", "medium", "understand", "In the exclusive method, the value 20 belongs to the class:", [C("20–30", "next"), W("10–20", "this"), W("both", "double"), W("neither", "none")]),
  mcq("ap_ssc8_ch5_gd_a04", T1, "Grouped Data", "Class size", "easy", "apply", "The class size of the interval 10–20 is:", [C("10", "width"), W("15", "mark"), W("30", "sum"), W("20", "upper")]),
  mcq("ap_ssc8_ch5_gd_a05", T1, "Grouped Data", "Total frequency", "easy", "understand", "The sum of all frequencies in a table equals:", [C("the total number of observations", "total"), W("the range", "range"), W("the number of classes", "classes"), W("the class size", "size")]),

  mcq("ap_ssc8_ch5_hg_a01", T2, "Histograms", "Bars touch", "easy", "remember", "In a histogram, adjacent bars:", [C("touch (no gaps)", "touch"), W("have equal gaps", "gaps"), W("overlap", "overlap"), W("are circular", "circ")]),
  mcq("ap_ssc8_ch5_hg_a02", T2, "Histograms", "Histogram vs bar graph", "medium", "understand", "The key difference between a histogram and a bar graph is that a histogram:", [C("has touching bars for continuous data", "continuous"), W("uses circles", "circles"), W("always slopes upward", "slope"), W("has no axes", "no_axes")]),
  mcq("ap_ssc8_ch5_hg_a03", T2, "Histograms", "When to use", "easy", "understand", "A histogram is used to display:", [C("grouped/continuous data", "grouped"), W("separate categories", "categories"), W("parts of a whole", "whole"), W("change over time", "time")]),
  mcq("ap_ssc8_ch5_hg_a04", T2, "Histograms", "Bar height", "easy", "understand", "In a histogram, the height of a bar represents the:", [C("frequency of the class", "freq"), W("class size", "size"), W("range", "range"), W("class mark", "mark")]),
  mcq("ap_ssc8_ch5_hg_a05", T2, "Histograms", "Modal class", "medium", "analyze", "The tallest bar of a histogram represents the:", [C("modal class (most frequent)", "modal"), W("smallest class", "min"), W("median", "median"), W("range", "range")]),

  mcq("ap_ssc8_ch5_pc_a01", T3, "Pie Charts", "Full circle", "easy", "remember", "A complete pie chart represents an angle of:", [C("360°", "full"), W("180°", "half"), W("100°", "percent"), W("90°", "quarter")]),
  mcq("ap_ssc8_ch5_pc_a02", T3, "Pie Charts", "Angle for 25%", "easy", "apply", "The sector angle for a category that is 25% of the data is:", [C("90°", "quarter"), W("25°", "literal"), W("75°", "wrong"), W("100°", "wrong2")]),
  mcq("ap_ssc8_ch5_pc_a03", T3, "Pie Charts", "Degrees per percent", "medium", "apply", "1% of the data corresponds to how many degrees on a pie chart?", [C("3.6°", "ratio"), W("1°", "literal"), W("10°", "wrong"), W("36°", "tenfold")]),
  mcq("ap_ssc8_ch5_pc_a04", T3, "Pie Charts", "Sum of angles", "easy", "understand", "The sum of all sector angles in a pie chart is:", [C("360°", "full"), W("100°", "percent"), W("180°", "half"), W("depends", "depends")]),
  mcq("ap_ssc8_ch5_pc_a05", T3, "Pie Charts", "Compute sector angle", "medium", "apply", "In a budget of ₹15000, Food is ₹6000. Its sector angle is:", [C("144°", "ok"), W("90°", "quarter"), W("120°", "wrong"), W("60°", "wrong2")]),

  mcq("ap_ssc8_ch5_pr_a01", T4, "Probability", "Probability of even", "easy", "apply", "A die is rolled. P(getting an even number) is:", [C("1/2", "three_of_six"), W("1/3", "wrong"), W("1/6", "single"), W("2/3", "wrong2")]),
  mcq("ap_ssc8_ch5_pr_a02", T4, "Probability", "Range of probability", "easy", "remember", "The probability of any event always lies between:", [C("0 and 1", "range"), W("0 and 100", "percent"), W("1 and 6", "die"), W("−1 and 1", "wrong")]),
  mcq("ap_ssc8_ch5_pr_a03", T4, "Probability", "Impossible event", "easy", "understand", "The probability of an impossible event is:", [C("0", "zero"), W("1", "certain"), W("1/2", "half"), W("−1", "neg")]),
  mcq("ap_ssc8_ch5_pr_a04", T4, "Probability", "Complement rule", "medium", "understand", "If P(E) is the probability of E, then P(not E) =", [C("1 − P(E)", "complement"), W("P(E) − 1", "wrong"), W("1/P(E)", "recip"), W("0", "zero")]),
  mcq("ap_ssc8_ch5_pr_a05", T4, "Probability", "Single outcome", "easy", "apply", "A die is rolled. P(getting a 6) is:", [C("1/6", "single"), W("1/2", "even"), W("6", "literal"), W("1", "certain")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch5 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
