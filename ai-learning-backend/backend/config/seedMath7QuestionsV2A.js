import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch1 = "Large Numbers Around Us";
const ch2 = "Arithmetic Expressions";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch1_lc_q1","math7_ch1_lakhs_crores","1 lakh = ?",[e("10000"),c("100000"),m("1000000"),g("10")],"By definition.",["Lakh = 100k."],"Lakh = 100k.","easy",ch1),
  Q("math7_ch1_lc_q2","math7_ch1_lakhs_crores","1 crore = ?",[e("100000"),m("1000000"),c("10000000"),g("1000")],"10 million.",["Crore = 10M."],"Crore = 10M.","easy",ch1),
  Q("math7_ch1_lc_q3","math7_ch1_lakhs_crores","12,50,000 in words?",[c("Twelve lakh fifty thousand"),e("Twelve million"),m("Hundred thousand"),g("Twelve thousand")],"Indian commas.",["12 lakh + 50k."],"Indian commas.","medium",ch1),
  Q("math7_ch1_lc_q4","math7_ch1_lakhs_crores","Number of zeros in 1 crore?",[m("5"),c("7"),g("6"),e("8")],"7 zeros.",["1 crore = 1 followed by 7 zeros."],"7 zeros.","medium",ch1),
  Q("math7_ch1_lc_q5","math7_ch1_lakhs_crores","Hundred lakh = ?",[m("1 lakh"),c("1 crore"),g("10 lakh"),e("1000 crore")],"100 lakh = 1 crore.",["100 × 100k = 10M = 1 crore."],"100 lakh = 1 crore.","medium",ch1),
  Q("math7_ch1_lc_q6","math7_ch1_lakhs_crores","Indian commas: 5,67,89,012 grouped as…",[c("2-2-3 from right"),e("3-3-3"),m("Random"),g("4-4-4")],"Indian grouping.",["Ones (3), lakhs (2), crores (2)."],"2-2-3.","medium",ch1),
  Q("math7_ch1_lc_q7","math7_ch1_lakhs_crores","Successor of 99,99,999?",[c("1 crore"),m("99,99,990"),g("10 crore"),e("9 crore")],"+1 cascades.",["Rolls over to 1 crore."],"+1 rolls.","hard",ch1),
  Q("math7_ch1_lc_q8","math7_ch1_lakhs_crores","Predecessor of 10 lakh?",[c("9,99,999"),m("9,99,990"),g("10,00,001"),e("9 lakh")],"−1.",["10 lakh − 1 = 9,99,999."],"−1.","medium",ch1),
  Q("math7_ch1_pv_q1","math7_ch1_place_value","In 5,67,89,012, what is 5?",[c("5 crore"),m("5 lakh"),g("5 thousand"),e("50000")],"Leftmost = crore.",["Crore position."],"Crore.","medium",ch1),
  Q("math7_ch1_pv_q2","math7_ch1_place_value","Place value of 8 in 7,89,123?",[c("80,000"),m("8000"),g("8"),e("800000")],"8 in ten-thousands.",["8 × 10000 = 80000."],"× place.","medium",ch1),
  Q("math7_ch1_pv_q3","math7_ch1_place_value","Place value of 0?",[c("Always 0"),e("Position depends"),m("Random"),g("Tens")],"0 × anything = 0.",["0 × any place = 0."],"Always 0.","easy",ch1),
  Q("math7_ch1_pv_q4","math7_ch1_place_value","Face value of 7 in 7,00,000?",[c("7"),m("7 lakh"),g("700"),e("70")],"Face = digit itself.",["Face = digit."],"Face = digit.","medium",ch1),
  Q("math7_ch1_pv_q5","math7_ch1_place_value","Sum of all place values in 234 = ?",[c("234"),m("9"),g("0"),e("100")],"Sum = number.",["200+30+4=234."],"= number.","medium",ch1),
  Q("math7_ch1_pv_q6","math7_ch1_place_value","In 1,00,001: place value of leftmost 1?",[c("1 lakh"),m("1"),g("10000"),e("1000")],"Lakh place.",["Position 6 from right = lakh."],"Lakh.","medium",ch1),
  Q("math7_ch1_pv_q7","math7_ch1_place_value","Each position is ___ times the next right.",[c("10"),m("100"),g("2"),e("1")],"Decimal system.",["Powers of 10."],"× 10.","medium",ch1),
  Q("math7_ch1_pv_q8","math7_ch1_place_value","Place value of rightmost digit in any number?",[c("Itself (ones)"),e("Always 10"),m("Random"),g("Always 0")],"Ones place.",["Rightmost = ones."],"Ones.","easy",ch1),
  Q("math7_ch1_cl_q1","math7_ch1_comparing_large","Bigger: 99,99,999 or 1,00,00,000?",[e("99,99,999"),c("1,00,00,000"),m("Equal"),g("Cannot say")],"More digits.",["1 crore > 99 lakh."],"More digits.","easy",ch1),
  Q("math7_ch1_cl_q2","math7_ch1_comparing_large","Compare large numbers from…",[c("Leftmost digit"),e("Rightmost"),m("Middle"),g("Random")],"Leftmost first.",["Most significant first."],"Leftmost.","easy",ch1),
  Q("math7_ch1_cl_q3","math7_ch1_comparing_large","Smaller: 12,34,567 or 1,23,45,678?",[c("12,34,567"),e("1,23,45,678"),m("Equal"),g("Cannot say")],"Fewer digits.",["7 < 8 digits."],"Fewer digits.","easy",ch1),
  Q("math7_ch1_cl_q4","math7_ch1_comparing_large","Same number of digits: compare…",[c("Leftmost different digit"),e("Sum"),m("Random"),g("Average")],"Position differences.",["First differing digit."],"First differ.","medium",ch1),
  Q("math7_ch1_cl_q5","math7_ch1_comparing_large","Bigger: 5,67,890 or 5,67,809?",[c("5,67,890"),e("5,67,809"),m("Equal"),g("Cannot say")],"Compare last digits.",["First diff: 90 > 09."],"First diff.","medium",ch1),
  Q("math7_ch1_cl_q6","math7_ch1_comparing_large","Order: 12 lakh, 1 crore, 99 lakh.",[c("12 lakh, 99 lakh, 1 crore"),e("1 crore, 99 lakh, 12 lakh"),m("99 lakh, 12 lakh, 1 crore"),g("Random")],"Ascending.",["12, 99, 100 lakh."],"Convert + sort.","medium",ch1),
  Q("math7_ch1_cl_q7","math7_ch1_comparing_large","More zeros at end means…",[c("Often bigger (more digits)"),e("Smaller"),m("Random"),g("Same")],"More digits if leading not 0.",["Like 100000 vs 10000."],"More digits = bigger.","medium",ch1),
  Q("math7_ch1_cl_q8","math7_ch1_comparing_large","Largest 8-digit number?",[c("9,99,99,999"),m("1,00,00,000"),g("99,99,999"),e("Cannot say")],"All 9s.",["9 nines."],"All 9s.","medium",ch1),
  Q("math7_ch1_ro_q1","math7_ch1_rounding","Round 456 to nearest 100.",[c("500"),m("400"),g("450"),e("100")],"Tens digit 5 ≥ 5: round up.",["5 → up."],"5 → up.","easy",ch1),
  Q("math7_ch1_ro_q2","math7_ch1_rounding","Round 432 to nearest 100.",[c("400"),m("500"),g("430"),e("100")],"Tens digit 3 < 5: round down.",["3 < 5."],"< 5 → down.","easy",ch1),
  Q("math7_ch1_ro_q3","math7_ch1_rounding","Round 67 to nearest 10.",[c("70"),m("60"),g("100"),e("7")],"Ones digit 7 ≥ 5.",["7 → up."],"≥ 5 up.","easy",ch1),
  Q("math7_ch1_ro_q4","math7_ch1_rounding","Round 234 to nearest 10.",[c("230"),m("240"),g("200"),e("23")],"Ones digit 4 < 5.",["4 → down."],"< 5 down.","easy",ch1),
  Q("math7_ch1_ro_q5","math7_ch1_rounding","Round 4,567 to nearest 1000.",[c("5000"),m("4000"),g("4500"),e("100")],"Hundreds 5 ≥ 5.",["5 → up."],"≥ 5 up.","medium",ch1),
  Q("math7_ch1_ro_q6","math7_ch1_rounding","Round 2,789 to nearest 1000.",[c("3000"),m("2000"),g("2700"),e("3500")],"Hundreds 7 ≥ 5.",["7 → up."],"≥ 5 up.","medium",ch1),
  Q("math7_ch1_ro_q7","math7_ch1_rounding","Rounding helps with…",[c("Quick estimates"),e("Exact answers"),m("Random"),g("Hide values")],"Approximation.",["Quick approx."],"Estimates.","medium",ch1),
  Q("math7_ch1_ro_q8","math7_ch1_rounding","Round 1,234 to nearest 1000.",[c("1000"),m("2000"),g("1200"),e("1500")],"Hundreds 2 < 5.",["2 < 5 down."],"< 5 down.","medium",ch1),

  Q("math7_ch2_ei_q1","math7_ch2_expressions_intro","Expression: 5 + 3 × 2 = ?",[c("11"),m("16"),g("8"),e("13")],"× before +.",["3 × 2 = 6, then 5+6=11."],"× before +.","medium",ch2),
  Q("math7_ch2_ei_q2","math7_ch2_expressions_intro","Expression: 10 − 4 + 2 = ?",[c("8"),m("4"),g("12"),e("6")],"Left to right.",["10−4=6, 6+2=8."],"L to R.","easy",ch2),
  Q("math7_ch2_ei_q3","math7_ch2_expressions_intro","8 ÷ 2 × 3 = ?",[c("12"),m("8"),g("1.33"),e("48")],"L to R.",["8/2=4, ×3=12."],"L to R.","medium",ch2),
  Q("math7_ch2_ei_q4","math7_ch2_expressions_intro","Without brackets, ___ takes priority.",[c("BODMAS rules"),e("Left to right"),m("Random"),g("All same")],"Order of ops.",["BODMAS."],"BODMAS.","medium",ch2),
  Q("math7_ch2_ei_q5","math7_ch2_expressions_intro","Expression: 2 + 3 × 4 − 1 = ?",[c("13"),m("19"),g("11"),e("15")],"× first.",["3×4=12, 2+12−1=13."],"BODMAS.","medium",ch2),
  Q("math7_ch2_ei_q6","math7_ch2_expressions_intro","2² + 3 = ?",[c("7"),m("9"),g("5"),e("11")],"Power first.",["2² = 4, +3 = 7."],"Power first.","medium",ch2),
  Q("math7_ch2_ei_q7","math7_ch2_expressions_intro","Expression value depends on…",[c("Order of operations"),e("Random"),m("Time"),g("Color")],"BODMAS.",["Order matters."],"Order.","easy",ch2),
  Q("math7_ch2_ei_q8","math7_ch2_expressions_intro","Why use expressions?",[c("Compact representation of calculations"),e("Random"),m("Decoration"),g("Confuse")],"Concise math.",["Compact."],"Compact.","medium",ch2),
  Q("math7_ch2_oo_q1","math7_ch2_order_operations","BODMAS B stands for…",[c("Brackets"),e("Bigger"),m("Below"),g("Backwards")],"Brackets.",["B = brackets."],"B = brackets.","easy",ch2),
  Q("math7_ch2_oo_q2","math7_ch2_order_operations","BODMAS M stands for…",[c("Multiplication"),e("Modulus"),m("Mean"),g("Magnitude")],"× before +.",["M = ×."],"M = ×.","easy",ch2),
  Q("math7_ch2_oo_q3","math7_ch2_order_operations","D in BODMAS:",[c("Division"),e("Difference"),m("Decimal"),g("Digit")],"÷ same priority as ×.",["D = ÷."],"D = ÷.","easy",ch2),
  Q("math7_ch2_oo_q4","math7_ch2_order_operations","After brackets, do…",[c("Orders (powers)"),e("Subtraction"),m("Multiply only"),g("Random")],"BODMAS order.",["O = orders/powers."],"O = powers.","medium",ch2),
  Q("math7_ch2_oo_q5","math7_ch2_order_operations","(2+3) × 4 = ?",[c("20"),m("14"),g("9"),e("24")],"Bracket first.",["5 × 4 = 20."],"() first.","easy",ch2),
  Q("math7_ch2_oo_q6","math7_ch2_order_operations","Without brackets: 2 + 3 × 4 = ?",[c("14"),m("20"),g("9"),e("24")],"× first.",["3×4=12, +2=14."],"× first.","easy",ch2),
  Q("math7_ch2_oo_q7","math7_ch2_order_operations","Same priority: do…",[c("Left to right"),e("Right to left"),m("Random"),g("Skip")],"L to R for same priority.",["Same priority → L to R."],"L to R.","medium",ch2),
  Q("math7_ch2_oo_q8","math7_ch2_order_operations","6 + 2 × 3 − 1 = ?",[c("11"),m("17"),g("8"),e("5")],"×: 6, then 6+6-1.",["2×3=6, 6+6−1=11."],"BODMAS.","medium",ch2),
  Q("math7_ch2_br_q1","math7_ch2_brackets","(5 − 2) × 3 = ?",[c("9"),m("−1"),g("0"),e("11")],"Brackets first.",["(5−2)=3, ×3=9."],"() first.","easy",ch2),
  Q("math7_ch2_br_q2","math7_ch2_brackets","5 − 2 × 3 = ?",[c("−1"),m("9"),g("3"),e("0")],"× first.",["2×3=6, 5−6=−1."],"× first.","medium",ch2),
  Q("math7_ch2_br_q3","math7_ch2_brackets","Brackets help…",[c("Change order"),e("Decoration"),m("Random"),g("Hide values")],"Override default.",["Override BODMAS."],"Change order.","medium",ch2),
  Q("math7_ch2_br_q4","math7_ch2_brackets","[(2+3) × 4] − 5 = ?",[c("15"),m("20"),g("5"),e("9")],"Innermost first.",["(2+3)=5, 5×4=20, −5=15."],"Innermost.","medium",ch2),
  Q("math7_ch2_br_q5","math7_ch2_brackets","Multiple brackets: do…",[c("Innermost first"),e("Outermost"),m("Random"),g("All at once")],"Inside out.",["Innermost first."],"Inside out.","medium",ch2),
  Q("math7_ch2_br_q6","math7_ch2_brackets","(3 × 4) + (5 − 2) = ?",[c("15"),m("18"),g("12"),e("9")],"Both brackets first.",["12+3=15."],"Each separately.","medium",ch2),
  Q("math7_ch2_br_q7","math7_ch2_brackets","Bracket types: () [] {}",[c("All work the same"),e("Different rules"),m("Random"),g("Only ()")],"Same priority, used for clarity.",["Same priority."],"Same.","medium",ch2),
  Q("math7_ch2_br_q8","math7_ch2_brackets","2 × (3 + 4) = ?",[c("14"),m("10"),g("11"),e("9")],"Bracket first.",["3+4=7, 2×7=14."],"() first.","easy",ch2),
  Q("math7_ch2_ev_q1","math7_ch2_evaluating","If x = 3, evaluate 2x + 1.",[c("7"),m("6"),g("8"),e("4")],"2×3+1=7.",["Substitute, compute."],"Sub + compute.","easy",ch2),
  Q("math7_ch2_ev_q2","math7_ch2_evaluating","If x = 5, evaluate x² − 4.",[c("21"),m("6"),g("16"),e("11")],"25 − 4.",["5²=25, −4=21."],"Sub + compute.","medium",ch2),
  Q("math7_ch2_ev_q3","math7_ch2_evaluating","If a = 2, b = 3: ab + a.",[c("8"),m("6"),g("12"),e("5")],"2×3+2 = 8.",["6+2=8."],"Sub.","medium",ch2),
  Q("math7_ch2_ev_q4","math7_ch2_evaluating","If x = 0, evaluate 5x + 3.",[c("3"),m("5"),g("0"),e("8")],"0+3.",["5×0=0, +3=3."],"× 0 = 0.","easy",ch2),
  Q("math7_ch2_ev_q5","math7_ch2_evaluating","If x = 4, x/2 + 3 = ?",[c("5"),m("3.5"),g("7"),e("11")],"2+3.",["4/2=2, +3=5."],"÷ then +.","medium",ch2),
  Q("math7_ch2_ev_q6","math7_ch2_evaluating","Substitute and simplify is called…",[c("Evaluation"),e("Equation"),m("Random"),g("Expansion")],"Evaluation = compute with values.",["Substitute → simplify."],"Evaluation.","medium",ch2),
  Q("math7_ch2_ev_q7","math7_ch2_evaluating","If y = −2: 3y + 6.",[c("0"),m("12"),g("−12"),e("−6")],"3×(−2)+6 = 0.",["−6+6=0."],"Watch signs.","medium",ch2),
  Q("math7_ch2_ev_q8","math7_ch2_evaluating","Why evaluate expressions?",[c("Find numerical value"),e("Decoration"),m("Random"),g("Hide algebra")],"Compute result.",["Result."],"Compute.","easy",ch2),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch1-2).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
