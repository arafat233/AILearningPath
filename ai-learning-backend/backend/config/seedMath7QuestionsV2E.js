import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch9 = "Geometric Twins";
const ch10 = "Operations with Integers";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch9_ci_q1","math7_ch9_congruence_intro","Congruent means…",[c("Same shape AND size"),e("Same shape only"),m("Random"),g("Same color")],"Identical.",["Same in every way."],"Same.","easy",ch9),
  Q("math7_ch9_ci_q2","math7_ch9_congruence_intro","Similar vs Congruent:",[c("Similar = same shape only; Congruent = same shape + size"),e("Same"),m("Random"),g("Reversed")],"Similar ≠ Congruent.",["Similar: shape only.","Congruent: shape + size."],"Different.","medium",ch9),
  Q("math7_ch9_ci_q3","math7_ch9_congruence_intro","Symbol for congruent:",[c("≅"),m("≈"),g("="),e("∼")],"Triple bar.",["≅ = congruent."],"≅.","medium",ch9),
  Q("math7_ch9_ci_q4","math7_ch9_congruence_intro","Two squares with same side are…",[c("Congruent"),e("Similar only"),m("Different"),g("Random")],"Same shape + size.",["Same dimensions."],"Congruent.","easy",ch9),
  Q("math7_ch9_ci_q5","math7_ch9_congruence_intro","Examples of congruent shapes:",[c("Coins of same type, identical bricks"),e("Random sizes"),m("Different"),g("Triangles")],"Manufactured identical.",["Same model."],"Manufactured.","medium",ch9),
  Q("math7_ch9_ci_q6","math7_ch9_congruence_intro","If shapes congruent, corresponding sides…",[c("Equal"),e("Different"),m("Sum"),g("Random")],"By definition.",["All sides equal."],"Equal.","medium",ch9),
  Q("math7_ch9_ci_q7","math7_ch9_congruence_intro","If shapes congruent, corresponding angles…",[c("Equal"),e("Different"),m("Sum 360"),g("Random")],"All match.",["All angles equal."],"Equal.","medium",ch9),
  Q("math7_ch9_ci_q8","math7_ch9_congruence_intro","Rotation preserves congruence?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Rigid motion.",["Rotation = rigid."],"Yes.","medium",ch9),
  Q("math7_ch9_ct_q1","math7_ch9_congruent_triangles","Congruent triangles have…",[c("All sides + all angles equal"),e("Only sides equal"),m("Only angles equal"),g("Random")],"All elements match.",["Full match."],"All elements.","medium",ch9),
  Q("math7_ch9_ct_q2","math7_ch9_congruent_triangles","SSS criterion:",[c("All 3 sides equal"),e("All angles"),m("2 sides"),g("Random")],"Side-Side-Side.",["3 sides match."],"3 sides.","medium",ch9),
  Q("math7_ch9_ct_q3","math7_ch9_congruent_triangles","SAS:",[c("Side-Angle-Side"),e("Side-Angle-Angle"),m("Random"),g("3 angles")],"2 sides + included angle.",["2S, 1A between."],"SAS.","medium",ch9),
  Q("math7_ch9_ct_q4","math7_ch9_congruent_triangles","ASA:",[c("Angle-Side-Angle"),e("All angles"),m("All sides"),g("Random")],"2 angles + included side.",["2A, 1S between."],"ASA.","medium",ch9),
  Q("math7_ch9_ct_q5","math7_ch9_congruent_triangles","RHS only for…",[c("Right-angled triangles"),e("Any"),m("Equilateral"),g("Random")],"Right + Hypotenuse + Side.",["Special for right triangles."],"Right triangles.","hard",ch9),
  Q("math7_ch9_ct_q6","math7_ch9_congruent_triangles","Triangles with 3 equal angles are…",[c("Similar (not necessarily congruent)"),e("Congruent"),m("Different"),g("Random")],"Same shape, may differ in size.",["AAA gives similarity, not congruence."],"Similar.","hard",ch9),
  Q("math7_ch9_ct_q7","math7_ch9_congruent_triangles","If △ABC ≅ △DEF, AB = ?",[c("DE"),m("EF"),g("DF"),e("Different")],"Corresponding sides.",["Order matches."],"Match order.","hard",ch9),
  Q("math7_ch9_ct_q8","math7_ch9_congruent_triangles","Most common congruence rule for triangles:",[c("SSS, SAS, ASA, RHS"),e("All angles"),m("Random"),g("Sides only")],"Standard rules.",["Memorize."],"4 standard.","medium",ch9),
  Q("math7_ch9_ss_q1","math7_ch9_sss_sas","Triangles with sides 3,4,5 and 3,4,5 are…",[c("Congruent (SSS)"),e("Similar only"),m("Different"),g("Random")],"All sides match.",["SSS."],"SSS.","easy",ch9),
  Q("math7_ch9_ss_q2","math7_ch9_sss_sas","SAS needs angle to be…",[c("Between the 2 sides"),e("Outside"),m("Either"),g("Random")],"Included angle.",["Angle between sides."],"Between.","hard",ch9),
  Q("math7_ch9_ss_q3","math7_ch9_sss_sas","2 sides + non-included angle is…",[c("Not always congruent (SSA ambiguous)"),e("Congruent"),m("Random"),g("Equal triangles")],"Ambiguous case.",["SSA may give 2 triangles."],"SSA ambiguous.","hard",ch9),
  Q("math7_ch9_ss_q4","math7_ch9_sss_sas","ASA's S is the side…",[c("Between the 2 angles"),e("Anywhere"),m("Outside"),g("Random")],"Included side.",["Side between angles."],"Between angles.","hard",ch9),
  Q("math7_ch9_ss_q5","math7_ch9_sss_sas","2 equilateral triangles with same side are…",[c("Congruent (SSS)"),e("Different"),m("Random"),g("Similar")],"SSS.",["All sides equal."],"SSS.","medium",ch9),
  Q("math7_ch9_ss_q6","math7_ch9_sss_sas","Easiest test if only sides known:",[c("SSS"),m("SAS"),g("ASA"),e("RHS")],"SSS only needs sides.",["Just need sides."],"SSS.","medium",ch9),
  Q("math7_ch9_ss_q7","math7_ch9_sss_sas","Right triangle: RHS uses…",[c("Right angle, hypotenuse, side"),e("All sides"),m("Random"),g("Only angle")],"Specific to right triangles.",["R + H + S."],"R-H-S.","hard",ch9),
  Q("math7_ch9_ss_q8","math7_ch9_sss_sas","If only 1 element matches, can we conclude congruence?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot say")],"Need at least 3 specific elements.",["Insufficient info."],"Need 3.","medium",ch9),
  Q("math7_ch9_rc_q1","math7_ch9_real_congruence","Coins of same denomination are…",[c("Congruent"),e("Similar"),m("Different"),g("Random")],"Mass produced identical.",["Same factory specs."],"Congruent.","easy",ch9),
  Q("math7_ch9_rc_q2","math7_ch9_real_congruence","Bricks of same type are…",[c("Congruent"),e("Similar"),m("Different"),g("Random")],"Manufactured to spec.",["Same dimensions."],"Congruent.","easy",ch9),
  Q("math7_ch9_rc_q3","math7_ch9_real_congruence","Photocopies of same page are…",[c("Congruent"),e("Different"),m("Random"),g("Similar")],"Exact copies.",["Same size."],"Congruent.","easy",ch9),
  Q("math7_ch9_rc_q4","math7_ch9_real_congruence","Stamps of same denomination are…",[c("Congruent"),e("Different"),m("Random"),g("Similar")],"Mass produced.",["Identical stamps."],"Congruent.","easy",ch9),
  Q("math7_ch9_rc_q5","math7_ch9_real_congruence","Two right hands of one person:",[e("Congruent"),c("Similar but not congruent (mirror)"),m("Different"),g("Random")],"Mirror images.",["Reflected, can't superimpose."],"Mirror not congruent.","hard",ch9),
  Q("math7_ch9_rc_q6","math7_ch9_real_congruence","Two leaves of same plant:",[c("Often similar (not exactly congruent)"),e("Always congruent"),m("Always different"),g("Random")],"Nature has variation.",["Approximate, not exact."],"Similar.","medium",ch9),
  Q("math7_ch9_rc_q7","math7_ch9_real_congruence","Wheel of car: 2 front wheels are…",[c("Congruent"),e("Different"),m("Random"),g("Similar")],"Same specifications.",["Manufactured same."],"Congruent.","easy",ch9),
  Q("math7_ch9_rc_q8","math7_ch9_real_congruence","Building bricks in a wall are…",[c("Congruent (mostly)"),e("Different"),m("Random"),g("Similar")],"Manufactured to standard.",["Standard size."],"Congruent.","easy",ch9),

  Q("math7_ch10_ii_q1","math7_ch10_integers_intro","Integers include…",[c("Whole numbers + negatives"),e("Just positives"),m("Just negatives"),g("Decimals")],"Whole + negatives + 0.",["..., −2, −1, 0, 1, 2, ..."],"All whole.","easy",ch10),
  Q("math7_ch10_ii_q2","math7_ch10_integers_intro","Is 0 an integer?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Zero is integer.",["0 is integer."],"Yes.","easy",ch10),
  Q("math7_ch10_ii_q3","math7_ch10_integers_intro","Is 1.5 an integer?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot say")],"Not whole.",["Decimal."],"No.","easy",ch10),
  Q("math7_ch10_ii_q4","math7_ch10_integers_intro","Is −7 an integer?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Negative whole.",["−7 = integer."],"Yes.","easy",ch10),
  Q("math7_ch10_ii_q5","math7_ch10_integers_intro","Integers on number line:",[c("Equally spaced"),e("Random"),m("Increasing space"),g("Decreasing")],"Equal spacing.",["Uniform intervals."],"Equal.","medium",ch10),
  Q("math7_ch10_ii_q6","math7_ch10_integers_intro","Bigger integer is to the ___ on line.",[c("Right"),e("Left"),m("Above"),g("Below")],"Right = bigger.",["Right > left."],"Right.","easy",ch10),
  Q("math7_ch10_ii_q7","math7_ch10_integers_intro","Compare −3 vs −7. Bigger?",[c("−3"),e("−7"),m("Equal"),g("Cannot say")],"Less negative = bigger.",["−3 > −7."],"Less negative.","medium",ch10),
  Q("math7_ch10_ii_q8","math7_ch10_integers_intro","Opposite of 5:",[c("−5"),m("0"),g("1/5"),e("25")],"Negate.",["−5."],"Negate.","easy",ch10),
  Q("math7_ch10_as_q1","math7_ch10_addition_subtraction","5 + (−3) = ?",[c("2"),m("8"),g("−2"),e("−8")],"Adding negative = subtracting.",["5 − 3 = 2."],"+(−) = −.","easy",ch10),
  Q("math7_ch10_as_q2","math7_ch10_addition_subtraction","−4 + (−3) = ?",[c("−7"),m("−1"),g("7"),e("1")],"Both negative.",["−(4+3)."],"Add negatives.","medium",ch10),
  Q("math7_ch10_as_q3","math7_ch10_addition_subtraction","4 − (−2) = ?",[c("6"),m("2"),g("−6"),e("−2")],"−(−)=+.",["4 + 2."],"−(−)=+.","medium",ch10),
  Q("math7_ch10_as_q4","math7_ch10_addition_subtraction","−5 − 3 = ?",[c("−8"),m("−2"),g("2"),e("8")],"Move further left.",["−5 + (−3) = −8."],"More negative.","medium",ch10),
  Q("math7_ch10_as_q5","math7_ch10_addition_subtraction","−6 + 10 = ?",[c("4"),m("−4"),g("16"),e("−16")],"Net positive.",["10 − 6 = 4."],"Bigger sign wins.","medium",ch10),
  Q("math7_ch10_as_q6","math7_ch10_addition_subtraction","−10 − (−4) = ?",[c("−6"),m("−14"),g("6"),e("14")],"−10+4.",["−(−)=+, so −10+4=−6."],"Apply sign rule.","hard",ch10),
  Q("math7_ch10_as_q7","math7_ch10_addition_subtraction","Sum of integer and its opposite:",[c("0"),m("1"),g("Variable"),e("Cannot say")],"Always 0.",["a + (−a) = 0."],"0.","medium",ch10),
  Q("math7_ch10_as_q8","math7_ch10_addition_subtraction","12 + (−5) − (−3) = ?",[c("10"),m("4"),g("20"),e("14")],"12 − 5 + 3.",["12 − 5 + 3 = 10."],"Apply signs.","hard",ch10),
  Q("math7_ch10_mu_q1","math7_ch10_multiplication","(+) × (+) = ?",[c("+"),m("−"),g("0"),e("Random")],"Same signs.",["Positive."],"+.","easy",ch10),
  Q("math7_ch10_mu_q2","math7_ch10_multiplication","(−) × (−) = ?",[c("+"),m("−"),g("0"),e("Random")],"Two negatives.",["Positive."],"+.","medium",ch10),
  Q("math7_ch10_mu_q3","math7_ch10_multiplication","(+) × (−) = ?",[m("+"),c("−"),g("0"),e("Random")],"Different signs.",["Negative."],"−.","medium",ch10),
  Q("math7_ch10_mu_q4","math7_ch10_multiplication","(−3)(4) = ?",[c("−12"),m("12"),g("−7"),e("7")],"(−)(+) = (−).",["3×4=12, − sign."],"× then sign.","medium",ch10),
  Q("math7_ch10_mu_q5","math7_ch10_multiplication","(−4)(−5) = ?",[c("20"),m("−20"),g("9"),e("−9")],"(−)(−) = (+).",["4×5=20, + sign."],"× signs.","medium",ch10),
  Q("math7_ch10_mu_q6","math7_ch10_multiplication","0 × (−5) = ?",[c("0"),m("−5"),g("5"),e("Cannot")],"Anything × 0 = 0.",["0."],"× 0 = 0.","easy",ch10),
  Q("math7_ch10_mu_q7","math7_ch10_multiplication","(−2) × (−2) × (−2) = ?",[c("−8"),m("8"),g("−6"),e("6")],"Three negatives = negative.",["Odd # of (−) → (−)."],"Odd (−) → (−).","hard",ch10),
  Q("math7_ch10_mu_q8","math7_ch10_multiplication","Sign rule for many factors:",[c("Even # of (−) = (+), Odd = (−)"),e("Random"),m("Always (+)"),g("Always (−)")],"Count negatives.",["Count (−)s; even or odd."],"Count (−).","hard",ch10),
  Q("math7_ch10_di_q1","math7_ch10_division","(+) ÷ (+) = ?",[c("+"),m("−"),g("0"),e("Random")],"Same signs.",["Positive."],"+.","easy",ch10),
  Q("math7_ch10_di_q2","math7_ch10_division","(−) ÷ (−) = ?",[c("+"),m("−"),g("0"),e("Random")],"Same signs.",["+."],"+.","medium",ch10),
  Q("math7_ch10_di_q3","math7_ch10_division","(+) ÷ (−) = ?",[m("+"),c("−"),g("0"),e("Random")],"Different signs.",["−."],"−.","medium",ch10),
  Q("math7_ch10_di_q4","math7_ch10_division","−12 ÷ 4 = ?",[c("−3"),m("3"),g("−6"),e("6")],"(−)(+) = (−).",["12/4=3, − sign."],"÷ then sign.","medium",ch10),
  Q("math7_ch10_di_q5","math7_ch10_division","−15 ÷ −5 = ?",[c("3"),m("−3"),g("0"),e("Cannot")],"(−)(−) = (+).",["15/5=3, + sign."],"÷ signs.","medium",ch10),
  Q("math7_ch10_di_q6","math7_ch10_division","0 ÷ 5 = ?",[c("0"),m("5"),g("Undefined"),e("Cannot")],"0 ÷ nonzero = 0.",["0/5 = 0."],"0 ÷ N = 0.","easy",ch10),
  Q("math7_ch10_di_q7","math7_ch10_division","5 ÷ 0 = ?",[c("Undefined"),m("0"),g("∞"),e("5")],"Division by 0 undefined.",["Cannot ÷ by 0."],"Undefined.","hard",ch10),
  Q("math7_ch10_di_q8","math7_ch10_division","Sign rules for ÷ same as ×?",[c("Yes"),e("No"),m("Sometimes"),g("Random")],"Identical.",["Same rules."],"Same.","medium",ch10),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch9-10).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
