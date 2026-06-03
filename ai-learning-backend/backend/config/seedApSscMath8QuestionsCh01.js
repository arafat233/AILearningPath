/**
 * AP SSC Class 8 Mathematics — Ch1 Rational Numbers — Questions (Layer A: MCQ)
 * 5 MCQ per topic × 4 topics = 20. questionId: ap_ssc8_ch1_*  · board AP_SSC · grade 8.
 * Safe to re-run (upsert on questionId). Usage: node config/seedApSscMath8QuestionsCh01.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const CH = 1, CHAP = "Rational Numbers";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 };
const ET = { easy: 30, medium: 45, hard: 60 };

function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return {
    questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8",
    examBoard: "AP_SSC", questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept,
    questionText, options, marks: 1, negativeMarks: 0, difficulty, difficultyScore: DS[difficulty],
    bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true, isPYQ: false,
    isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [],
  };
}
const C = (text, logicTag) => ({ text, type: "correct", logicTag });
const W = (text, logicTag) => ({ text, type: "concept_error", logicTag });

const T1 = "ap_ssc_math8_ch1_properties_of_operations";
const T2 = "ap_ssc_math8_ch1_identity_and_inverse";
const T3 = "ap_ssc_math8_ch1_on_number_line";
const T4 = "ap_ssc_math8_ch1_between_two_rationals";

const QUESTIONS = [
  // ── T1 Properties of Operations ──
  mcq("ap_ssc8_ch1_props_a01", T1, "Properties of Rational Numbers", "Commutative property", "easy", "remember",
    "Which property is shown by  3/4 + 5/7 = 5/7 + 3/4 ?",
    [C("Commutativity of addition", "commute_add"), W("Associativity of addition", "assoc"), W("Distributivity", "distrib"), W("Closure", "closure")]),
  mcq("ap_ssc8_ch1_props_a02", T1, "Properties of Rational Numbers", "Closure", "easy", "understand",
    "Rational numbers are closed under all of the following EXCEPT:",
    [W("Addition", "add"), W("Subtraction", "sub"), W("Multiplication", "mul"), C("Division (since division by 0 is undefined)", "div_zero")]),
  mcq("ap_ssc8_ch1_props_a03", T1, "Properties of Rational Numbers", "Distributivity", "medium", "apply",
    "Using a suitable property,  (−3/7)×(5/4) + (−3/7)×(−1/4)  equals:",
    [C("−3/7", "distrib_factor"), W("3/7", "sign"), W("−6/7", "add_instead"), W("0", "cancel")]),
  mcq("ap_ssc8_ch1_props_a04", T1, "Properties of Rational Numbers", "Associativity fails for division", "medium", "analyze",
    "Since (8 ÷ 4) ÷ 2 = 1 but 8 ÷ (4 ÷ 2) = 4, this shows that division is NOT:",
    [C("Associative", "assoc_fail"), W("Closed", "closed"), W("Commutative", "commute"), W("Distributive", "distrib")]),
  mcq("ap_ssc8_ch1_props_a05", T1, "Properties of Rational Numbers", "Commutativity scope", "easy", "understand",
    "Which statement is TRUE for all rational numbers a and b?",
    [C("a × b = b × a", "commute_mul"), W("a − b = b − a", "sub_commute"), W("a ÷ b = b ÷ a", "div_commute"), W("a − b is always positive", "sub_pos")]),

  // ── T2 Identity & Inverse ──
  mcq("ap_ssc8_ch1_inv_a01", T2, "Identity & Inverse", "Additive identity", "easy", "remember",
    "The additive identity for rational numbers is:",
    [C("0", "add_id"), W("1", "mul_id"), W("−1", "neg_one"), W("the number itself", "self")]),
  mcq("ap_ssc8_ch1_inv_a02", T2, "Identity & Inverse", "Multiplicative inverse", "easy", "apply",
    "The multiplicative inverse (reciprocal) of −5/8 is:",
    [C("−8/5", "reciprocal"), W("8/5", "drop_sign"), W("5/8", "same"), W("0", "zero")]),
  mcq("ap_ssc8_ch1_inv_a03", T2, "Identity & Inverse", "Additive inverse", "easy", "apply",
    "The additive inverse of −5/8 is:",
    [C("5/8", "add_inverse"), W("−8/5", "reciprocal_confuse"), W("8/5", "both_wrong"), W("0", "zero")]),
  mcq("ap_ssc8_ch1_inv_a04", T2, "Identity & Inverse", "No reciprocal of zero", "medium", "understand",
    "Which rational number has NO multiplicative inverse?",
    [C("0", "zero_no_recip"), W("1", "one"), W("−1", "neg_one"), W("1/2", "half")]),
  mcq("ap_ssc8_ch1_inv_a05", T2, "Identity & Inverse", "Multiplicative identity", "easy", "remember",
    "Multiplying any rational number by ___ leaves it unchanged.",
    [C("1", "mul_id"), W("0", "add_id"), W("its reciprocal", "recip"), W("−1", "neg")]),

  // ── T3 On the Number Line ──
  mcq("ap_ssc8_ch1_nl_a01", T3, "Rationals on the Number Line", "Denominator = sub-divisions", "easy", "understand",
    "To plot 3/4 on the number line, each unit segment is divided into how many equal parts?",
    [C("4", "denominator"), W("3", "numerator"), W("7", "sum"), W("12", "product")]),
  mcq("ap_ssc8_ch1_nl_a02", T3, "Rationals on the Number Line", "Improper fraction location", "medium", "apply",
    "Between which two integers does 7/3 lie?",
    [C("2 and 3", "mixed_2_third"), W("3 and 4", "off_by_one"), W("0 and 1", "proper_assume"), W("1 and 2", "wrong")]),
  mcq("ap_ssc8_ch1_nl_a03", T3, "Rationals on the Number Line", "Negative rationals", "easy", "understand",
    "On the number line, −3/4 is located:",
    [C("to the left of 0", "left"), W("to the right of 0", "right"), W("exactly at 0", "origin"), W("at +3/4", "ignore_sign")]),
  mcq("ap_ssc8_ch1_nl_a04", T3, "Rationals on the Number Line", "Equivalent fractions same point", "medium", "analyze",
    "Which of these is plotted at the SAME point as 1/2?",
    [C("3/6", "equivalent"), W("2/3", "different"), W("1/3", "different2"), W("2/5", "different3")]),
  mcq("ap_ssc8_ch1_nl_a05", T3, "Rationals on the Number Line", "Mixed number conversion", "easy", "apply",
    "−5/4 written as a mixed number is:",
    [C("−1¼", "mixed"), W("−1¾", "wrong_frac"), W("−5¼", "no_divide"), W("−4/5", "flip")]),

  // ── T4 Between Two Rationals ──
  mcq("ap_ssc8_ch1_btw_a01", T4, "Rationals between Two Rationals", "Density of rationals", "medium", "understand",
    "How many rational numbers lie between 1/4 and 1/2?",
    [C("Infinitely many", "dense"), W("Exactly one", "one"), W("Exactly three", "three"), W("None", "none")]),
  mcq("ap_ssc8_ch1_btw_a02", T4, "Rationals between Two Rationals", "Mean method", "easy", "apply",
    "A rational number lying exactly between 1/2 and 1/3 is their average:",
    [C("5/12", "mean"), W("1/5", "add_num_den"), W("2/5", "wrong"), W("1/6", "product")]),
  mcq("ap_ssc8_ch1_btw_a03", T4, "Rationals between Two Rationals", "Equal-denominator method", "medium", "apply",
    "Writing 1/4 and 1/2 with denominator 16 gives 4/16 and 8/16. A rational between them is:",
    [C("6/16", "between"), W("3/16", "below"), W("9/16", "above"), W("16/6", "flip")]),
  mcq("ap_ssc8_ch1_btw_a04", T4, "Rationals between Two Rationals", "No 'next' rational", "medium", "analyze",
    "Which statement is TRUE about rational numbers?",
    [C("There is no 'next' rational after a given rational", "no_next"), W("Every rational has a unique next rational", "has_next"), W("Only finitely many rationals exist between 0 and 1", "finite"), W("Two rationals always have a whole number between them", "whole")]),
  mcq("ap_ssc8_ch1_btw_a05", T4, "Rationals between Two Rationals", "Average lies between", "easy", "understand",
    "The average (a+b)/2 of two distinct rationals a and b always lies:",
    [C("strictly between a and b", "between"), W("outside a and b", "outside"), W("equal to a", "equal_a"), W("equal to the larger of a, b", "equal_b")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0;
  for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch1 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
