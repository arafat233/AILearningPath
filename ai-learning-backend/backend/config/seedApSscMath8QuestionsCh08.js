/**
 * AP SSC Class 8 Math — Ch8 Comparing Quantities — Questions (MCQ). 5×4 = 20.
 * Usage: node config/seedApSscMath8QuestionsCh08.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 8, CHAP = "Comparing Quantities";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch8_ratios_percentages", T2 = "ap_ssc_math8_ch8_profit_loss_discount",
      T3 = "ap_ssc_math8_ch8_sales_tax_gst", T4 = "ap_ssc_math8_ch8_compound_interest";

const QUESTIONS = [
  mcq("ap_ssc8_ch8_rp_a01", T1, "Ratios & Percentages", "Convert ratio to percent", "easy", "apply", "The ratio 3 : 5 expressed as a percentage of the whole (first part) is:", [C("37.5%", "ok"), W("60%", "wrong"), W("30%", "wrong2"), W("3.5%", "wrong3")]),
  mcq("ap_ssc8_ch8_rp_a02", T1, "Ratios & Percentages", "Percentage of a number", "easy", "apply", "20% of 250 is:", [C("50", "ok"), W("25", "wrong"), W("5", "wrong2"), W("200", "wrong3")]),
  mcq("ap_ssc8_ch8_rp_a03", T1, "Ratios & Percentages", "Percentage increase", "medium", "apply", "A price rises from ₹80 to ₹100. The percentage increase is:", [C("25%", "ok"), W("20%", "wrong"), W("80%", "wrong2"), W("125%", "wrong3")]),
  mcq("ap_ssc8_ch8_rp_a04", T1, "Ratios & Percentages", "Percent to fraction", "easy", "understand", "75% as a fraction in lowest terms is:", [C("3/4", "ok"), W("7/5", "wrong"), W("75/10", "wrong2"), W("1/4", "complement")]),
  mcq("ap_ssc8_ch8_rp_a05", T1, "Ratios & Percentages", "Find the whole", "medium", "apply", "If 30% of a number is 60, the number is:", [C("200", "ok"), W("90", "wrong"), W("18", "wrong2"), W("180", "wrong3")]),

  mcq("ap_ssc8_ch8_pl_a01", T2, "Profit, Loss & Discount", "Profit percent", "medium", "apply", "An article bought for ₹400 is sold for ₹500. The profit % is:", [C("25%", "ok"), W("20%", "on_sp"), W("100%", "wrong"), W("10%", "wrong2")]),
  mcq("ap_ssc8_ch8_pl_a02", T2, "Profit, Loss & Discount", "Discount", "easy", "apply", "A 10% discount on a marked price of ₹500 gives a selling price of:", [C("₹450", "ok"), W("₹490", "wrong"), W("₹400", "wrong2"), W("₹550", "added")]),
  mcq("ap_ssc8_ch8_pl_a03", T2, "Profit, Loss & Discount", "Loss percent", "medium", "apply", "An article bought for ₹250 is sold for ₹200. The loss % is:", [C("20%", "ok"), W("25%", "on_sp"), W("50%", "wrong"), W("10%", "wrong2")]),
  mcq("ap_ssc8_ch8_pl_a04", T2, "Profit, Loss & Discount", "Discount is on MP", "easy", "understand", "Discount is always calculated on the:", [C("marked price", "mp"), W("cost price", "cp"), W("selling price", "sp"), W("profit", "profit")]),
  mcq("ap_ssc8_ch8_pl_a05", T2, "Profit, Loss & Discount", "Profit/loss base", "easy", "understand", "Profit % and loss % are always calculated on the:", [C("cost price", "cp"), W("selling price", "sp"), W("marked price", "mp"), W("discount", "disc")]),

  mcq("ap_ssc8_ch8_st_a01", T3, "Sales Tax / GST", "Add GST", "medium", "apply", "An item costs ₹1000 and GST is 18%. The amount payable is:", [C("₹1180", "ok"), W("₹1018", "wrong"), W("₹820", "subtract"), W("₹1800", "wrong2")]),
  mcq("ap_ssc8_ch8_st_a02", T3, "Sales Tax / GST", "GST is added", "easy", "understand", "GST (sales tax) is:", [C("added to the price the customer pays", "added"), W("subtracted from the price", "subtracted"), W("a discount", "discount"), W("the profit", "profit")]),
  mcq("ap_ssc8_ch8_st_a03", T3, "Sales Tax / GST", "Find tax amount", "easy", "apply", "The GST at 5% on a bill of ₹2000 is:", [C("₹100", "ok"), W("₹50", "wrong"), W("₹200", "wrong2"), W("₹105", "wrong3")]),
  mcq("ap_ssc8_ch8_st_a04", T3, "Sales Tax / GST", "Back out base price", "hard", "apply", "A price including 10% GST is ₹220. The price before GST was:", [C("₹200", "ok"), W("₹198", "wrong"), W("₹210", "wrong2"), W("₹242", "wrong3")]),
  mcq("ap_ssc8_ch8_st_a05", T3, "Sales Tax / GST", "Meaning of GST", "easy", "remember", "GST stands for:", [C("Goods and Services Tax", "ok"), W("Gross Sales Total", "wrong"), W("General Service Tariff", "wrong2"), W("Government Standard Tax", "wrong3")]),

  mcq("ap_ssc8_ch8_ci_a01", T4, "Compound Interest", "CI formula", "easy", "remember", "The amount under compound interest is given by:", [C("A = P(1 + R/100)ⁿ", "ok"), W("A = P + PRT/100", "simple"), W("A = P(1 + RT)", "wrong"), W("A = PRn", "wrong2")]),
  mcq("ap_ssc8_ch8_ci_a02", T4, "Compound Interest", "Compute amount", "medium", "apply", "The amount on ₹1000 at 10% p.a. compounded annually for 2 years is:", [C("₹1210", "ok"), W("₹1200", "simple"), W("₹1100", "one_year"), W("₹1331", "three_years")]),
  mcq("ap_ssc8_ch8_ci_a03", T4, "Compound Interest", "CI vs SI", "medium", "understand", "Compared with simple interest at the same rate, compound interest is:", [C("greater after the first period", "greater"), W("always equal", "equal"), W("always smaller", "smaller"), W("equal in the first year only", "first_year")]),
  mcq("ap_ssc8_ch8_ci_a04", T4, "Compound Interest", "Find CI", "medium", "apply", "The compound interest on ₹2000 at 5% p.a. for 2 years is:", [C("₹205", "ok"), W("₹200", "simple"), W("₹2205", "amount"), W("₹100", "one_year")]),
  mcq("ap_ssc8_ch8_ci_a05", T4, "Compound Interest", "Half-yearly compounding", "hard", "understand", "When interest is compounded half-yearly, the rate per period and the number of periods become:", [C("R/2 per period, 2n periods", "ok"), W("2R per period, n/2 periods", "wrong"), W("R per period, n periods", "annual"), W("R/2 per period, n periods", "wrong2")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch8 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
