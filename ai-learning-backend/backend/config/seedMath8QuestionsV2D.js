import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch7 = "Proportional Reasoning - 1";
const ch8 = "Fractions in Disguise";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"8", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math8_ch7_ra_q1","math8_ch7_ratios","Ratio of 2 to 3 = ?",[c("2:3"),m("2/3 only"),g("5"),e("Random")],"Use colon.",["2:3 or 2/3."],"a:b form.","easy",ch7),
  Q("math8_ch7_ra_q2","math8_ch7_ratios","Simplify ratio 6:9:",[c("2:3"),m("6:9"),g("3:2"),e("1:1.5")],"GCD 3.",["6÷3:9÷3 = 2:3."],"Simplify.","medium",ch7),
  Q("math8_ch7_ra_q3","math8_ch7_ratios","Ratio of 4 boys to 6 girls:",[c("2:3"),m("4:6"),g("3:2"),e("Random")],"Simplify.",["GCD 2: 2:3."],"Simplify.","medium",ch7),
  Q("math8_ch7_ra_q4","math8_ch7_ratios","Order matters in ratio?",[c("Yes"),e("No"),m("Sometimes"),g("Random")],"2:3 ≠ 3:2.",["Direction-sensitive."],"Order matters.","medium",ch7),
  Q("math8_ch7_ra_q5","math8_ch7_ratios","Ratio of similar quantities is…",[c("Unit-less"),e("Has units"),m("Random"),g("Negative")],"Cancel units.",["Same units cancel."],"Unit-less.","hard",ch7),
  Q("math8_ch7_ra_q6","math8_ch7_ratios","Ratio 1:2 in fraction:",[c("1/2"),m("2/1"),g("3"),e("0.5")],"Convert.",["1:2 = ½."],"Convert.","easy",ch7),
  Q("math8_ch7_ra_q7","math8_ch7_ratios","Ratio 3:4: total parts?",[c("7"),m("12"),g("4"),e("3")],"Sum.",["3+4=7."],"Sum parts.","medium",ch7),
  Q("math8_ch7_ra_q8","math8_ch7_ratios","If ratio is 5:3 and total = 16, smaller share?",[c("6"),m("10"),g("5"),e("3")],"3/8 × 16.",["16/8 = 2; × 3 = 6."],"Part/total × total.","hard",ch7),
  Q("math8_ch7_pr_q1","math8_ch7_proportions","Proportion: a:b :: c:d means…",[c("a/b = c/d"),e("ad = ab"),m("Random"),g("a + b = c + d")],"Equal ratios.",["Two ratios equal."],"Equal ratios.","medium",ch7),
  Q("math8_ch7_pr_q2","math8_ch7_proportions","If 2:3 :: 4:x, x = ?",[c("6"),m("4"),g("2"),e("8")],"Cross-multiply.",["2x = 12; x = 6."],"Cross-multiply.","medium",ch7),
  Q("math8_ch7_pr_q3","math8_ch7_proportions","Cross-multiplication: a/b = c/d → ?",[c("ad = bc"),m("ab = cd"),g("a+d = b+c"),e("Random")],"Standard.",["Cross-product rule."],"ad = bc.","medium",ch7),
  Q("math8_ch7_pr_q4","math8_ch7_proportions","Check 3:5 :: 6:10:",[c("Yes (equal)"),e("No"),m("Sometimes"),g("Cannot say")],"3×10 = 5×6 = 30.",["Cross verify."],"Cross-multiply.","medium",ch7),
  Q("math8_ch7_pr_q5","math8_ch7_proportions","Means and extremes:",[c("Inner pair = means; outer = extremes"),e("Same"),m("Random"),g("Just terms")],"Terminology.",["a:b :: c:d → a,d extremes; b,c means."],"M and E.","hard",ch7),
  Q("math8_ch7_pr_q6","math8_ch7_proportions","Product of extremes = product of means?",[c("Yes (proportion property)"),e("No"),m("Sometimes"),g("Cannot say")],"By definition.",["a×d = b×c."],"Yes.","hard",ch7),
  Q("math8_ch7_pr_q7","math8_ch7_proportions","If 4:5 :: 8:x, x = ?",[c("10"),m("4"),g("5"),e("9")],"4x=40.",["Cross: 4x = 5×8 = 40, x = 10."],"Cross.","medium",ch7),
  Q("math8_ch7_pr_q8","math8_ch7_proportions","Proportion = ?",[c("Equality of two ratios"),e("Single ratio"),m("Random"),g("Inequality")],"Definition.",["Two equal ratios."],"Equal ratios.","easy",ch7),
  Q("math8_ch7_un_q1","math8_ch7_unitary","5 pens cost ₹50. 1 pen = ?",[c("₹10"),m("₹50"),g("₹5"),e("₹45")],"50/5.",["Per-unit."],"÷ qty.","easy",ch7),
  Q("math8_ch7_un_q2","math8_ch7_unitary","8 pens at ₹10 each?",[c("₹80"),m("₹10"),g("₹18"),e("₹100")],"× per unit.",["8 × 10."],"× qty.","easy",ch7),
  Q("math8_ch7_un_q3","math8_ch7_unitary","6 kg flour costs ₹240. 8 kg = ?",[c("₹320"),m("₹240"),g("₹200"),e("₹400")],"Per kg × 8.",["240/6 = 40/kg. × 8 = 320."],"Find unit, scale.","medium",ch7),
  Q("math8_ch7_un_q4","math8_ch7_unitary","Unitary method: find ___ first.",[c("Value of 1 unit"),e("Total"),m("Random"),g("Final answer")],"Per-unit.",["Always divide first."],"1 unit.","medium",ch7),
  Q("math8_ch7_un_q5","math8_ch7_unitary","10 books cost ₹500. 7 books = ?",[c("₹350"),m("₹500"),g("₹400"),e("₹250")],"50/book × 7.",["500/10 = 50. × 7 = 350."],"÷ then ×.","medium",ch7),
  Q("math8_ch7_un_q6","math8_ch7_unitary","4 workers complete 1 job in 10 days. 1 worker?",[c("40 days (inverse)"),m("10 days"),g("2.5 days"),e("4 days")],"Inverse proportion.",["More workers = less time."],"Inverse.","hard",ch7),
  Q("math8_ch7_un_q7","math8_ch7_unitary","3 oranges = ₹15. 12 oranges?",[c("₹60"),m("₹15"),g("₹50"),e("₹120")],"5/orange × 12.",["15/3 = 5. × 12 = 60."],"÷ × scale.","medium",ch7),
  Q("math8_ch7_un_q8","math8_ch7_unitary","If 100 g sugar = ₹20, 1 kg = ?",[c("₹200"),m("₹20"),g("₹100"),e("₹2000")],"× 10.",["1 kg = 1000 g = 10 × 100 g."],"× ratio.","medium",ch7),
  Q("math8_ch7_pe_q1","math8_ch7_percentages","50% = ?",[c("½"),m("¼"),g("5"),e("0.05")],"Per hundred.",["50/100 = 0.5."],"% = /100.","easy",ch7),
  Q("math8_ch7_pe_q2","math8_ch7_percentages","20% of 100 = ?",[c("20"),m("50"),g("80"),e("200")],"0.2 × 100.",["20."],"% × N.","easy",ch7),
  Q("math8_ch7_pe_q3","math8_ch7_percentages","25% as fraction:",[c("¼"),m("½"),g("¾"),e("0.025")],"25/100 = ¼.",["¼."],"% = /100.","easy",ch7),
  Q("math8_ch7_pe_q4","math8_ch7_percentages","10% of 200 = ?",[c("20"),m("10"),g("100"),e("2")],"0.1 × 200.",["20."],"× 0.1.","easy",ch7),
  Q("math8_ch7_pe_q5","math8_ch7_percentages","Convert 0.75 to percentage:",[c("75%"),m("0.75%"),g("7.5%"),e("750%")],"× 100.",["× 100."],"× 100.","medium",ch7),
  Q("math8_ch7_pe_q6","math8_ch7_percentages","Increase by 20%: multiply by…",[c("1.2"),m("0.2"),g("2"),e("0.8")],"Original + 20%.",["1 + 0.2 = 1.2."],"× 1.2.","hard",ch7),
  Q("math8_ch7_pe_q7","math8_ch7_percentages","75% of 80 = ?",[c("60"),m("75"),g("80"),e("90")],"0.75 × 80.",["¾ × 80 = 60."],"% × N.","medium",ch7),
  Q("math8_ch7_pe_q8","math8_ch7_percentages","Express 3/4 as %:",[c("75%"),m("34%"),g("3/4 %"),e("0.75%")],"× 100.",["0.75 × 100 = 75."],"× 100.","medium",ch7),

  Q("math8_ch8_cf_q1","math8_ch8_complex_fractions","(½) / (⅓) = ?",[c("3/2"),m("⅙"),g("2/3"),e("½")],"× reciprocal.",["½ × 3 = 3/2."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_cf_q2","math8_ch8_complex_fractions","Complex fraction has…",[c("Fraction in num or denom"),e("Only numbers"),m("Random"),g("Whole numbers")],"Definition.",["Layered fractions."],"Layered.","medium",ch8),
  Q("math8_ch8_cf_q3","math8_ch8_complex_fractions","(3/4) / (1/2) = ?",[c("3/2"),m("3/8"),g("½"),e("¾")],"× 2/1.",["¾ × 2 = 3/2."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_cf_q4","math8_ch8_complex_fractions","Simplify by…",[c("Multiplying num by reciprocal of denom"),e("Adding"),m("Random"),g("Subtraction")],"Method.",["Invert and multiply."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_cf_q5","math8_ch8_complex_fractions","(2/3) / (4/5) = ?",[c("10/12 = 5/6"),m("8/15"),g("Random"),e("⅖")],"× 5/4.",["2/3 × 5/4 = 10/12 = 5/6."],"× reciprocal.","hard",ch8),
  Q("math8_ch8_cf_q6","math8_ch8_complex_fractions","(½) / 2 = ?",[c("¼"),m("1"),g("4"),e("Random")],"× ½.",["½ × ½ = ¼."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_cf_q7","math8_ch8_complex_fractions","1 / (½) = ?",[c("2"),m("½"),g("1"),e("0")],"× 2.",["1 × 2 = 2."],"Reciprocal.","easy",ch8),
  Q("math8_ch8_cf_q8","math8_ch8_complex_fractions","Complex fractions arise in…",[c("Division of fractions, rates"),e("Random"),m("Just decimals"),g("None")],"Real situations.",["Ratios and rates."],"Ratios.","medium",ch8),
  Q("math8_ch8_rf_q1","math8_ch8_ratios_fractions","Ratio 2:3 as fraction:",[c("2/3"),m("3/2"),g("5"),e("Random")],"a:b = a/b.",["2/3."],"a/b.","easy",ch8),
  Q("math8_ch8_rf_q2","math8_ch8_ratios_fractions","Ratio 2:3 as fraction of total:",[c("2/5 (of total parts)"),e("2/3"),m("3/5"),g("Random")],"Of total = a/(a+b).",["Total = 5; first = 2/5."],"a/(a+b).","hard",ch8),
  Q("math8_ch8_rf_q3","math8_ch8_ratios_fractions","Ratio 1:4 in fraction:",[c("1/4"),m("4/1"),g("5"),e("Random")],"Convert.",["1/4."],"a/b.","easy",ch8),
  Q("math8_ch8_rf_q4","math8_ch8_ratios_fractions","Boys:girls = 3:2. Total = 25. Boys = ?",[c("15"),m("10"),g("12"),e("5")],"3/5 × 25.",["3/(3+2) × 25 = 15."],"Part/total.","hard",ch8),
  Q("math8_ch8_rf_q5","math8_ch8_ratios_fractions","Ratio of A to B as fraction A/B = ?",[c("a:b"),e("a+b"),m("b:a"),g("Random")],"Same.",["a/b = a:b."],"Same.","easy",ch8),
  Q("math8_ch8_rf_q6","math8_ch8_ratios_fractions","Mix 1 part water to 3 parts juice. Juice fraction = ?",[c("3/4"),m("¼"),g("⅓"),e("¾")],"3 of 4 total.",["Total 4."],"Part/total.","medium",ch8),
  Q("math8_ch8_rf_q7","math8_ch8_ratios_fractions","Ratio 1:1 as fraction:",[c("1/1 = 1"),e("½"),m("¼"),g("Random")],"Equal parts.",["1:1 = 1."],"Equal.","easy",ch8),
  Q("math8_ch8_rf_q8","math8_ch8_ratios_fractions","Ratio 5:0?",[c("Undefined"),e("0"),m("5"),g("Random")],"÷ 0.",["Cannot have 0 part."],"Undefined.","hard",ch8),
  Q("math8_ch8_fd_q1","math8_ch8_fraction_division","½ ÷ ¼ = ?",[c("2"),m("⅛"),g("½"),e("¼")],"× 4/1.",["½ × 4 = 2."],"× reciprocal.","easy",ch8),
  Q("math8_ch8_fd_q2","math8_ch8_fraction_division","Divide a/b ÷ c/d = ?",[c("a/b × d/c"),e("ac/bd"),m("Random"),g("ab/cd")],"× reciprocal.",["Flip second."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_fd_q3","math8_ch8_fraction_division","¾ ÷ ½ = ?",[c("3/2"),m("⅜"),g("¾"),e("3")],"× 2/1.",["¾ × 2 = 3/2."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_fd_q4","math8_ch8_fraction_division","To divide fractions: ___ second.",[c("Invert"),e("Add"),m("Random"),g("Multiply")],"Reciprocal.",["Flip second fraction."],"Invert.","medium",ch8),
  Q("math8_ch8_fd_q5","math8_ch8_fraction_division","⅖ ÷ ⅓ = ?",[c("6/5"),m("⅖"),g("Random"),e("⅙")],"× 3/1.",["⅖ × 3 = 6/5."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_fd_q6","math8_ch8_fraction_division","1 ÷ ½ = ?",[c("2"),m("½"),g("1"),e("0")],"× 2/1.",["1 × 2 = 2."],"Reciprocal.","easy",ch8),
  Q("math8_ch8_fd_q7","math8_ch8_fraction_division","¼ ÷ 2 = ?",[c("⅛"),m("½"),g("8"),e("Random")],"× ½.",["¼ × ½ = ⅛."],"× reciprocal.","medium",ch8),
  Q("math8_ch8_fd_q8","math8_ch8_fraction_division","Dividing by fraction less than 1 gives…",[c("Bigger result"),e("Smaller"),m("Same"),g("Random")],"Reciprocal > 1.",["÷ by ½ = × 2."],"Bigger.","hard",ch8),
  Q("math8_ch8_wp_q1","math8_ch8_word_problems","¾ of 60 students:",[c("45"),m("15"),g("80"),e("12")],"× 60.",["¾ × 60 = 45."],"Of = ×.","easy",ch8),
  Q("math8_ch8_wp_q2","math8_ch8_word_problems","If 1/3 left, 2/3 ate. Total = 60. Left = ?",[c("20"),m("40"),g("60"),e("180")],"⅓ × 60.",["⅓ × 60 = 20."],"Of = ×.","medium",ch8),
  Q("math8_ch8_wp_q3","math8_ch8_word_problems","'Of' means…",[c("Multiply"),e("Add"),m("Subtract"),g("Divide")],"Multiplication.",["× in fractions."],"Of = ×.","easy",ch8),
  Q("math8_ch8_wp_q4","math8_ch8_word_problems","½ + ⅓ of cake left. Eaten?",[c("⅙"),m("⅙"),g("⅓"),e("⅔")],"1 − (3/6 + 2/6).",["1 − 5/6 = 1/6."],"Total − left.","hard",ch8),
  Q("math8_ch8_wp_q5","math8_ch8_word_problems","5/8 of book of 240 pages read. Read = ?",[c("150"),m("120"),g("75"),e("100")],"× 240.",["240/8 × 5 = 30 × 5 = 150."],"Of = ×.","medium",ch8),
  Q("math8_ch8_wp_q6","math8_ch8_word_problems","If ¼ of class is sick = 10 students. Total = ?",[c("40"),m("4"),g("10"),e("25")],"10/¼ = 40.",["¼ × T = 10. T = 40."],"÷ fraction.","hard",ch8),
  Q("math8_ch8_wp_q7","math8_ch8_word_problems","Ratio boys:girls = 3:2. Boys = 18. Girls = ?",[c("12"),m("18"),g("9"),e("36")],"Proportion.",["3/2 = 18/x. x = 12."],"Proportion.","hard",ch8),
  Q("math8_ch8_wp_q8","math8_ch8_word_problems","Mix paint 2:3 (white:red). Total 25 L. White = ?",[c("10"),m("15"),g("5"),e("25")],"2/5 × 25.",["2/(2+3) × 25 = 10."],"Part/total × total.","hard",ch8),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 8 Math v2 questions (Ch7-8).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
