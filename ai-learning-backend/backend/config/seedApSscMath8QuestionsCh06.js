/**
 * AP SSC Class 8 Math — Ch6 Squares and Square Roots — Questions (MCQ). 5×4 = 20.
 * Usage: node config/seedApSscMath8QuestionsCh06.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const CH = 6, CHAP = "Squares and Square Roots";
const DS = { easy: 0.2, medium: 0.5, hard: 0.8 }, ET = { easy: 30, medium: 45, hard: 60 };
function mcq(qid, topicId, subtopic, concept, difficulty, bloom, questionText, options) {
  return { questionId: qid, topicId, chapterNumber: CH, subject: "Mathematics", grade: "8", examBoard: "AP_SSC",
    questionType: "mcq", topic: CHAP, subtopic, conceptTested: concept, questionText, options, marks: 1, negativeMarks: 0,
    difficulty, difficultyScore: DS[difficulty], bloomLevel: bloom, expectedTime: ET[difficulty], isAIGenerated: true,
    isPYQ: false, isFlagged: false, deletedAt: null, approachTags: [], hintLevels: [], prerequisites: [] };
}
const C = (t, l) => ({ text: t, type: "correct", logicTag: l });
const W = (t, l) => ({ text: t, type: "concept_error", logicTag: l });
const T1 = "ap_ssc_math8_ch6_properties_of_squares", T2 = "ap_ssc_math8_ch6_finding_squares",
      T3 = "ap_ssc_math8_ch6_roots_by_factorisation", T4 = "ap_ssc_math8_ch6_roots_by_division";

const QUESTIONS = [
  mcq("ap_ssc8_ch6_ps_a01", T1, "Properties of Squares", "Ending digit test", "easy", "analyze", "Which number can NOT be a perfect square?", [C("4358 (ends in 8)", "ends_8"), W("4356", "ends_6"), W("4761", "ends_1"), W("4900", "ends_0")]),
  mcq("ap_ssc8_ch6_ps_a02", T1, "Properties of Squares", "Sum of odd numbers", "medium", "apply", "1 + 3 + 5 + 7 + 9 + 11 equals:", [C("36", "n2"), W("33", "wrong"), W("30", "wrong2"), W("25", "n2_5")]),
  mcq("ap_ssc8_ch6_ps_a03", T1, "Properties of Squares", "Ending digits", "easy", "remember", "Perfect squares can end only in the digits:", [C("0,1,4,5,6,9", "ok"), W("any digit", "any"), W("0,2,4,6,8", "even"), W("1,3,5,7,9", "odd")]),
  mcq("ap_ssc8_ch6_ps_a04", T1, "Properties of Squares", "Identify perfect square", "easy", "remember", "Which of these IS a perfect square?", [C("144", "12sq"), W("150", "no"), W("128", "no2"), W("142", "no3")]),
  mcq("ap_ssc8_ch6_ps_a05", T1, "Properties of Squares", "Trailing zeros", "medium", "understand", "A perfect square has, at its end, a number of zeros that is:", [C("even (0, 2, 4 …)", "even"), W("odd", "odd"), W("always 2", "two"), W("any number", "any")]),

  mcq("ap_ssc8_ch6_fs_a01", T2, "Finding Squares", "Ending-in-5 shortcut", "medium", "apply", "35² equals:", [C("1225", "ok"), W("125", "wrong"), W("1025", "wrong2"), W("3025", "55sq")]),
  mcq("ap_ssc8_ch6_fs_a02", T2, "Finding Squares", "(a+b)² identity", "easy", "remember", "(a + b)² equals:", [C("a² + 2ab + b²", "ok"), W("a² + b²", "no_mid"), W("a² − 2ab + b²", "minus"), W("2a + 2b", "linear")]),
  mcq("ap_ssc8_ch6_fs_a03", T2, "Finding Squares", "Square via (a+b)²", "medium", "apply", "52² equals:", [C("2704", "ok"), W("2504", "wrong"), W("2904", "wrong2"), W("254", "wrong3")]),
  mcq("ap_ssc8_ch6_fs_a04", T2, "Finding Squares", "Ending-in-5 shortcut", "medium", "apply", "85² equals:", [C("7225", "ok"), W("6425", "wrong"), W("7025", "wrong2"), W("725", "wrong3")]),
  mcq("ap_ssc8_ch6_fs_a05", T2, "Finding Squares", "Difference of consecutive squares", "medium", "apply", "(n+1)² − n² equals:", [C("2n + 1", "ok"), W("1", "wrong"), W("2n", "wrong2"), W("n²", "wrong3")]),

  mcq("ap_ssc8_ch6_rf_a01", T3, "Roots by Factorisation", "Square root by factorisation", "medium", "apply", "√324 equals:", [C("18", "ok"), W("16", "wrong"), W("12", "144"), W("162", "half")]),
  mcq("ap_ssc8_ch6_rf_a02", T3, "Roots by Factorisation", "Smallest multiplier", "hard", "apply", "The smallest number to multiply 48 by to make it a perfect square is:", [C("3", "ok"), W("2", "wrong"), W("6", "wrong2"), W("48", "wrong3")]),
  mcq("ap_ssc8_ch6_rf_a03", T3, "Roots by Factorisation", "Perfect square exponents", "medium", "understand", "In the prime factorisation of a perfect square, every prime appears:", [C("an even number of times", "even"), W("an odd number of times", "odd"), W("exactly twice", "twice"), W("exactly once", "once")]),
  mcq("ap_ssc8_ch6_rf_a04", T3, "Roots by Factorisation", "Square root", "easy", "apply", "√144 equals:", [C("12", "ok"), W("14", "wrong"), W("72", "half"), W("24", "wrong2")]),
  mcq("ap_ssc8_ch6_rf_a05", T3, "Roots by Factorisation", "Pairing primes", "easy", "understand", "To find a square root by prime factorisation, you take:", [C("one prime from each pair", "pair"), W("all the primes", "all"), W("one prime from each triple", "triple"), W("the largest prime", "largest")]),

  mcq("ap_ssc8_ch6_rd_a01", T4, "Roots by Division", "Square root by long division", "medium", "apply", "√529 equals:", [C("23", "ok"), W("27", "wrong"), W("21", "wrong2"), W("13", "wrong3")]),
  mcq("ap_ssc8_ch6_rd_a02", T4, "Roots by Division", "Grouping digits", "easy", "understand", "In the long-division method, digits are grouped in pairs starting from the:", [C("decimal point", "ok"), W("left end", "left"), W("largest digit", "largest"), W("middle", "middle")]),
  mcq("ap_ssc8_ch6_rd_a03", T4, "Roots by Division", "Applicability", "easy", "understand", "The long-division method for square roots works for:", [C("any number, including decimals", "any"), W("only perfect squares", "perfect"), W("only even numbers", "even"), W("only 2-digit numbers", "two_digit")]),
  mcq("ap_ssc8_ch6_rd_a04", T4, "Roots by Division", "Key step", "medium", "understand", "At each step of the long-division method you first:", [C("double the current quotient", "double"), W("square the remainder", "square"), W("add the digits", "add"), W("halve the divisor", "halve")]),
  mcq("ap_ssc8_ch6_rd_a05", T4, "Roots by Division", "Estimate", "easy", "remember", "√2 is approximately:", [C("1.41", "ok"), W("1.21", "wrong"), W("2.00", "wrong2"), W("0.71", "wrong3")]),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Q = mongoose.connection.collection("questions");
  let n = 0; for (const q of QUESTIONS) { await Q.updateOne({ questionId: q.questionId }, { $set: q }, { upsert: true }); n++; }
  console.log(`AP SSC Math 8 Ch6 questions: ${n} MCQ seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
