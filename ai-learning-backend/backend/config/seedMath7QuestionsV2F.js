import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch11 = "Finding Common Ground";
const ch12 = "Another Peek Beyond the Point";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"7", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math7_ch11_hc_q1","math7_ch11_hcf","HCF of 12 and 18?",[c("6"),m("12"),g("2"),e("36")],"List factors; find max common.",["Common: 1,2,3,6. Max: 6."],"Largest common.","medium",ch11),
  Q("math7_ch11_hc_q2","math7_ch11_hcf","HCF stands for…",[c("Highest Common Factor"),e("Hidden"),m("Random"),g("Halved")],"Definition.",["H-C-F."],"HCF.","easy",ch11),
  Q("math7_ch11_hc_q3","math7_ch11_hcf","HCF of 8 and 12?",[c("4"),m("2"),g("24"),e("96")],"Factors: 1,2,4 common. Max: 4.",["8: 1,2,4,8. 12: 1,2,3,4,6,12. Common: 1,2,4."],"Max common.","medium",ch11),
  Q("math7_ch11_hc_q4","math7_ch11_hcf","HCF of 15 and 20?",[c("5"),m("1"),g("60"),e("3")],"Common: 1,5. Max: 5.",["Factors share 1 and 5."],"5.","medium",ch11),
  Q("math7_ch11_hc_q5","math7_ch11_hcf","HCF of 7 and 11?",[c("1"),m("7"),g("11"),e("77")],"Both prime, coprime.",["Only 1 common."],"Coprime → 1.","medium",ch11),
  Q("math7_ch11_hc_q6","math7_ch11_hcf","HCF used for…",[c("Simplifying fractions"),e("Random"),m("Counting"),g("None")],"÷ top and bottom by HCF.",["Simplify."],"Simplify fractions.","hard",ch11),
  Q("math7_ch11_hc_q7","math7_ch11_hcf","HCF of 24 and 36?",[c("12"),m("6"),g("72"),e("4")],"Factor common 12.",["GCD/HCF = 12."],"Max common.","medium",ch11),
  Q("math7_ch11_hc_q8","math7_ch11_hcf","HCF of N and N (same):",[c("N itself"),m("1"),g("N²"),e("Random")],"Itself.",["a and a: HCF = a."],"Same.","medium",ch11),
  Q("math7_ch11_lc_q1","math7_ch11_lcm","LCM of 4 and 6?",[c("12"),m("24"),g("2"),e("10")],"Smallest common multiple.",["Multiples 4: 4,8,12. 6: 6,12. Common: 12."],"Smallest shared mult.","medium",ch11),
  Q("math7_ch11_lc_q2","math7_ch11_lcm","LCM stands for…",[c("Least Common Multiple"),e("Hidden"),m("Random"),g("Largest")],"Definition.",["L-C-M."],"LCM.","easy",ch11),
  Q("math7_ch11_lc_q3","math7_ch11_lcm","LCM of 2 and 3 (coprime)?",[c("6"),m("1"),g("12"),e("5")],"Product.",["2×3=6."],"Coprime → product.","medium",ch11),
  Q("math7_ch11_lc_q4","math7_ch11_lcm","LCM of 5 and 10?",[c("10"),m("5"),g("50"),e("15")],"10 is multiple of 5.",["10 is the smallest common."],"Bigger if multiple.","medium",ch11),
  Q("math7_ch11_lc_q5","math7_ch11_lcm","LCM useful for…",[c("Common denominator"),e("Random"),m("Counting"),g("None")],"Adding fractions.",["LCM of denoms = common denom."],"Common denom.","hard",ch11),
  Q("math7_ch11_lc_q6","math7_ch11_lcm","LCM of 6 and 9?",[c("18"),m("3"),g("54"),e("6")],"Multiples: 6,12,18. 9: 9,18.",["Common 18."],"Find smallest.","medium",ch11),
  Q("math7_ch11_lc_q7","math7_ch11_lcm","LCM of 8 and 12?",[c("24"),m("4"),g("96"),e("8")],"Multiples: 8,16,24. 12: 12,24.",["Common 24."],"Smallest.","medium",ch11),
  Q("math7_ch11_lc_q8","math7_ch11_lcm","LCM of N and 1:",[c("N"),m("1"),g("0"),e("Random")],"1 divides everything.",["LCM(N,1) = N."],"N.","easy",ch11),
  Q("math7_ch11_hl_q1","math7_ch11_hcf_lcm_relation","HCF × LCM = ?",[c("a × b (product)"),e("a + b"),m("Random"),g("Half")],"Formula.",["HCF × LCM = ab."],"= product.","medium",ch11),
  Q("math7_ch11_hl_q2","math7_ch11_hcf_lcm_relation","HCF(8, 12) = 4. LCM = ?",[c("24"),m("12"),g("96"),e("36")],"96/4=24.",["8×12=96. 96/4=24."],"product/HCF.","hard",ch11),
  Q("math7_ch11_hl_q3","math7_ch11_hcf_lcm_relation","HCF(6, 9) = 3. LCM = ?",[c("18"),m("9"),g("54"),e("6")],"54/3.",["6×9=54. 54/3=18."],"product/HCF.","hard",ch11),
  Q("math7_ch11_hl_q4","math7_ch11_hcf_lcm_relation","If two numbers are coprime, LCM = ?",[c("Their product"),e("1"),m("Random"),g("Larger one")],"HCF=1 → LCM=product.",["LCM(a,b) = ab/HCF = ab/1."],"Product.","medium",ch11),
  Q("math7_ch11_hl_q5","math7_ch11_hcf_lcm_relation","HCF × LCM = product of numbers. Verify for 4, 6.",[c("Yes (24 = 24)"),e("No"),m("Sometimes"),g("Cannot say")],"HCF=2, LCM=12, 2×12=24.",["HCF=2, LCM=12. 2×12=24=4×6."],"Verify.","hard",ch11),
  Q("math7_ch11_hl_q6","math7_ch11_hcf_lcm_relation","LCM of two prime numbers a and b:",[c("ab"),m("a"),g("b"),e("1")],"Coprime.",["Both prime → coprime → LCM=ab."],"Product.","medium",ch11),
  Q("math7_ch11_hl_q7","math7_ch11_hcf_lcm_relation","HCF of two consecutive integers:",[c("Always 1"),m("Always 0"),g("Random"),e("2")],"Coprime.",["Consecutive integers share only 1."],"1.","medium",ch11),
  Q("math7_ch11_hl_q8","math7_ch11_hcf_lcm_relation","HCF(a, b) × LCM(a, b) is always equal to:",[c("a × b"),e("a + b"),m("a − b"),g("Random")],"Identity.",["Standard formula."],"= product.","medium",ch11),
  Q("math7_ch11_wp_q1","math7_ch11_word_problems","Two buses leave every 6 and 9 min. They meet again after…",[c("LCM = 18 min"),m("HCF = 3"),g("Random"),e("15 min")],"LCM = meeting time.",["LCM(6,9)=18."],"LCM = meet.","hard",ch11),
  Q("math7_ch11_wp_q2","math7_ch11_word_problems","Largest equal pieces cut from 12m and 18m ropes:",[c("HCF = 6m"),m("LCM = 36"),g("Random"),e("3m")],"HCF for largest equal.",["HCF(12,18)=6m."],"HCF = largest equal.","hard",ch11),
  Q("math7_ch11_wp_q3","math7_ch11_word_problems","Bell rings every 4 min and 6 min. They ring together first at:",[c("LCM = 12 min"),m("HCF = 2"),g("Random"),e("10 min")],"LCM.",["LCM(4,6)=12."],"LCM.","medium",ch11),
  Q("math7_ch11_wp_q4","math7_ch11_word_problems","HCF for largest equal pieces?",[c("True"),e("False"),m("Sometimes"),g("Random")],"Common divisor.",["Largest piece dividing both."],"True.","medium",ch11),
  Q("math7_ch11_wp_q5","math7_ch11_word_problems","LCM for meeting times?",[c("True"),e("False"),m("Sometimes"),g("Random")],"Common multiple.",["Smallest time both ring/leave."],"True.","medium",ch11),
  Q("math7_ch11_wp_q6","math7_ch11_word_problems","Smallest number divisible by 4 and 6:",[c("12"),m("24"),g("2"),e("Random")],"LCM.",["LCM(4,6)=12."],"LCM.","medium",ch11),
  Q("math7_ch11_wp_q7","math7_ch11_word_problems","Greatest number dividing 24 and 36:",[c("12 (HCF)"),m("LCM 72"),g("Random"),e("6")],"HCF.",["HCF(24,36)=12."],"HCF.","medium",ch11),
  Q("math7_ch11_wp_q8","math7_ch11_word_problems","Two clocks chime every 30 and 45 min. Together first at:",[c("LCM = 90 min"),m("75"),g("HCF"),e("Random")],"LCM.",["LCM(30,45)=90."],"LCM = 90 min.","hard",ch11),

  Q("math7_ch12_da_q1","math7_ch12_decimal_addition","1.25 + 2.50 = ?",[c("3.75"),m("3.5"),g("3.7"),e("3.25")],"Align.",["Add columns."],"Align decimals.","easy",ch12),
  Q("math7_ch12_da_q2","math7_ch12_decimal_addition","Align ___ when adding decimals.",[c("Decimal points"),e("First digit"),m("Random"),g("Length")],"Standard rule.",["Decimal point alignment."],"Decimal points.","easy",ch12),
  Q("math7_ch12_da_q3","math7_ch12_decimal_addition","0.5 + 0.5 = ?",[c("1"),m("0.10"),g("0.55"),e("10")],"Whole.",["1.0."],"= 1.","easy",ch12),
  Q("math7_ch12_da_q4","math7_ch12_decimal_addition","2.5 + 1.75 = ?",[c("4.25"),m("3.75"),g("4.5"),e("4")],"Align 2.50 + 1.75.",["4.25."],"Align.","medium",ch12),
  Q("math7_ch12_da_q5","math7_ch12_decimal_addition","Add trailing zeros to match places. T/F?",[c("True"),e("False"),m("Sometimes"),g("Random")],"Helps alignment.",["0.5 = 0.50."],"True.","medium",ch12),
  Q("math7_ch12_da_q6","math7_ch12_decimal_addition","10.5 + 0.25 + 1.75 = ?",[c("12.5"),m("12"),g("12.25"),e("13")],"Sum.",["10.50+0.25+1.75=12.50."],"Sum.","medium",ch12),
  Q("math7_ch12_da_q7","math7_ch12_decimal_addition","0.9 + 0.1 = ?",[c("1"),m("0.10"),g("0.91"),e("1.0")],"Whole.",["10/10 = 1."],"= 1.","easy",ch12),
  Q("math7_ch12_da_q8","math7_ch12_decimal_addition","3.14 + 1.86 = ?",[c("5"),m("4.99"),g("5.10"),e("4")],"Sum.",["3.14 + 1.86 = 5.00."],"Add.","medium",ch12),
  Q("math7_ch12_ds_q1","math7_ch12_decimal_subtraction","5.5 − 2.25 = ?",[c("3.25"),m("3.30"),g("2.75"),e("3.5")],"Align.",["5.50 − 2.25 = 3.25."],"Align.","medium",ch12),
  Q("math7_ch12_ds_q2","math7_ch12_decimal_subtraction","10 − 0.5 = ?",[c("9.5"),m("9.0"),g("10.5"),e("0.5")],"10.0 − 0.5.",["9.5."],"Add zeros.","easy",ch12),
  Q("math7_ch12_ds_q3","math7_ch12_decimal_subtraction","3.75 − 1.50 = ?",[c("2.25"),m("2.5"),g("2.0"),e("5.25")],"Align.",["3.75 − 1.50 = 2.25."],"Align.","medium",ch12),
  Q("math7_ch12_ds_q4","math7_ch12_decimal_subtraction","Borrow if top digit < bottom. T/F?",[c("True"),e("False"),m("Sometimes"),g("Random")],"Yes.",["Like integer subtraction."],"True.","medium",ch12),
  Q("math7_ch12_ds_q5","math7_ch12_decimal_subtraction","2.5 − 1.75 = ?",[c("0.75"),m("0.5"),g("0.25"),e("1.25")],"Align.",["2.50−1.75=0.75."],"Align.","medium",ch12),
  Q("math7_ch12_ds_q6","math7_ch12_decimal_subtraction","1 − 0.25 = ?",[c("0.75"),m("0.25"),g("0.5"),e("1.25")],"1.00−0.25.",["0.75."],"Add zeros.","easy",ch12),
  Q("math7_ch12_ds_q7","math7_ch12_decimal_subtraction","100 − 99.99 = ?",[c("0.01"),m("1"),g("0.99"),e("1.01")],"100.00−99.99.",["0.01."],"Align.","medium",ch12),
  Q("math7_ch12_ds_q8","math7_ch12_decimal_subtraction","Difference of 8.5 and 3.25 = ?",[c("5.25"),m("5.5"),g("5.0"),e("11.75")],"Align.",["8.50−3.25=5.25."],"Align.","medium",ch12),
  Q("math7_ch12_dm_q1","math7_ch12_decimal_multiplication","0.5 × 0.3 = ?",[c("0.15"),m("0.8"),g("0.5"),e("0.015")],"Multiply, count places (1+1=2).",["5×3=15. 2 places: 0.15."],"Place count.","medium",ch12),
  Q("math7_ch12_dm_q2","math7_ch12_decimal_multiplication","2.5 × 4 = ?",[c("10"),m("8"),g("12.5"),e("100")],"25×4=100. 1 place: 10.0.",["2.5 = 25/10. ×4 = 100/10 = 10."],"× then place.","easy",ch12),
  Q("math7_ch12_dm_q3","math7_ch12_decimal_multiplication","0.2 × 0.4 = ?",[c("0.08"),m("0.8"),g("0.04"),e("0.6")],"2×4=8, 2 places: 0.08.",["2×4=8. 2 places: 0.08."],"Count places.","medium",ch12),
  Q("math7_ch12_dm_q4","math7_ch12_decimal_multiplication","Decimal places in product = sum of places in factors. T/F?",[c("True"),e("False"),m("Sometimes"),g("Random")],"Rule.",["Sum decimal places."],"Sum.","medium",ch12),
  Q("math7_ch12_dm_q5","math7_ch12_decimal_multiplication","1.5 × 1.5 = ?",[c("2.25"),m("3.0"),g("2.5"),e("4.5")],"15×15=225, 2 places.",["2.25."],"Sum places.","medium",ch12),
  Q("math7_ch12_dm_q6","math7_ch12_decimal_multiplication","0.5 × 0.5 = ?",[c("0.25"),m("1.0"),g("0.10"),e("0.5")],"5×5=25, 2 places.",["0.25."],"Sum places.","medium",ch12),
  Q("math7_ch12_dm_q7","math7_ch12_decimal_multiplication","3.5 × 2 = ?",[c("7"),m("5.5"),g("70"),e("35")],"35×2=70, 1 place: 7.",["3.5×2 = 7.0."],"× then place.","easy",ch12),
  Q("math7_ch12_dm_q8","math7_ch12_decimal_multiplication","0.1 × 0.1 = ?",[c("0.01"),m("0.1"),g("0.02"),e("0.11")],"1×1=1, 2 places.",["0.01."],"Sum places.","medium",ch12),
  Q("math7_ch12_dd_q1","math7_ch12_decimal_division","6.3 ÷ 0.7 = ?",[c("9"),m("0.9"),g("63"),e("90")],"63 ÷ 7 (move decimals).",["× 10 both: 63/7=9."],"Move decimals.","hard",ch12),
  Q("math7_ch12_dd_q2","math7_ch12_decimal_division","10 ÷ 0.5 = ?",[c("20"),m("5"),g("2"),e("0.05")],"× 10 both: 100/5=20.",["100/5=20."],"Move decimals.","medium",ch12),
  Q("math7_ch12_dd_q3","math7_ch12_decimal_division","2.5 ÷ 5 = ?",[c("0.5"),m("0.05"),g("2"),e("5")],"25/50.",["2.5/5 = 0.5."],"÷.","medium",ch12),
  Q("math7_ch12_dd_q4","math7_ch12_decimal_division","To divide by decimal: ___ both decimals.",[c("Move equally"),e("Skip"),m("Random"),g("Add")],"Same shift.",["Multiply both by same."],"Equal shift.","hard",ch12),
  Q("math7_ch12_dd_q5","math7_ch12_decimal_division","0.6 ÷ 0.2 = ?",[c("3"),m("0.3"),g("30"),e("0.12")],"6/2.",["× 10 both: 6/2=3."],"Move decimals.","medium",ch12),
  Q("math7_ch12_dd_q6","math7_ch12_decimal_division","4.8 ÷ 0.4 = ?",[c("12"),m("1.2"),g("0.12"),e("120")],"48/4.",["× 10 both."],"Move decimals.","medium",ch12),
  Q("math7_ch12_dd_q7","math7_ch12_decimal_division","0.5 ÷ 0.5 = ?",[c("1"),m("0.1"),g("0"),e("0.5")],"Same.",["Equal = 1."],"Equal = 1.","easy",ch12),
  Q("math7_ch12_dd_q8","math7_ch12_decimal_division","5 ÷ 0.01 = ?",[c("500"),m("5"),g("0.05"),e("50")],"500/1.",["× 100 both."],"Move decimals.","hard",ch12),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 7 Math v2 questions (Ch11-12).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
