import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch3 = "Number Play";
const ch4 = "Data Handling and Presentation";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"6", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch3 number_properties
  Q("math6_ch3_np_q1","math6_ch3_number_properties","Is 234 even?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"Ends in 4 → even.",["Last digit even."],"Even ending.","easy",ch3),
  Q("math6_ch3_np_q2","math6_ch3_number_properties","Is 7 prime?",[c("Yes"),e("No"),m("Maybe"),g("Composite")],"Factors only 1 and 7.",["Only 1 and 7 divide."],"Prime.","easy",ch3),
  Q("math6_ch3_np_q3","math6_ch3_number_properties","Smallest prime?",[c("2"),m("1"),g("3"),e("0")],"2 is smallest prime.",["1 is not prime.","2 is."],"2.","medium",ch3),
  Q("math6_ch3_np_q4","math6_ch3_number_properties","Is 1 prime?",[e("Yes"),c("No"),m("Sometimes"),g("Composite")],"By definition, primes > 1.",["1 excluded."],"No.","medium",ch3),
  Q("math6_ch3_np_q5","math6_ch3_number_properties","Is 9 composite?",[c("Yes"),e("No"),m("Prime"),g("Random")],"3×3=9.",["9 = 3 × 3."],"Composite.","easy",ch3),
  Q("math6_ch3_np_q6","math6_ch3_number_properties","Is 0 even?",[c("Yes"),e("No"),m("Sometimes"),g("Cannot say")],"0 ÷ 2 = 0 exactly.",["0 is even."],"Yes.","medium",ch3),
  Q("math6_ch3_np_q7","math6_ch3_number_properties","Only even prime?",[c("2"),m("4"),g("3"),e("None")],"All other evens divisible by 2.",["Only 2 is even prime."],"2.","hard",ch3),
  Q("math6_ch3_np_q8","math6_ch3_number_properties","99 is odd because…",[c("Ends in 9 (odd digit)"),e("Big"),m("Random"),g("Equal to 100")],"Last digit 9.",["Odd ending."],"Odd ending.","easy",ch3),
  // ch3 divisibility_rules
  Q("math6_ch3_dr_q1","math6_ch3_divisibility_rules","Divisible by 2 if…",[c("Ends in 0/2/4/6/8"),e("Sum divisible by 2"),m("Ends in 5"),g("Random")],"Even ending.",["Last digit even."],"Even ending.","easy",ch3),
  Q("math6_ch3_dr_q2","math6_ch3_divisibility_rules","Divisible by 3 if…",[c("Digit sum divisible by 3"),e("Ends in 3"),m("Even"),g("Random")],"Sum of digits.",["Sum digits.","If ÷ 3, num ÷ 3."],"Digit sum.","medium",ch3),
  Q("math6_ch3_dr_q3","math6_ch3_divisibility_rules","Divisible by 5 if…",[c("Ends in 0 or 5"),e("Ends in 1"),m("Even"),g("Random")],"Multiples of 5.",["End: 0 or 5."],"Ends 0/5.","easy",ch3),
  Q("math6_ch3_dr_q4","math6_ch3_divisibility_rules","Divisible by 9 if…",[c("Digit sum ÷ 9"),e("Ends in 9"),m("Even"),g("Random")],"Sum of digits.",["Digit sum check."],"Digit sum.","medium",ch3),
  Q("math6_ch3_dr_q5","math6_ch3_divisibility_rules","Divisible by 10 if…",[c("Ends in 0"),m("Ends in 5"),g("Even"),e("Random")],"Trailing 0.",["End = 0."],"Ends 0.","easy",ch3),
  Q("math6_ch3_dr_q6","math6_ch3_divisibility_rules","Is 234 divisible by 3?",[c("Yes (2+3+4=9)"),e("No"),m("Sometimes"),g("Cannot tell")],"Sum 9 ÷ 3.",["Digit sum 9 ÷ 3 = 3."],"Sum check.","medium",ch3),
  Q("math6_ch3_dr_q7","math6_ch3_divisibility_rules","Is 720 divisible by 9?",[c("Yes (7+2+0=9)"),e("No"),m("Cannot tell"),g("Random")],"Sum 9.",["7+2+0=9 ÷ 9."],"Sum check.","medium",ch3),
  Q("math6_ch3_dr_q8","math6_ch3_divisibility_rules","Is 125 divisible by 5 and 10?",[c("By 5 yes, by 10 no"),m("Both"),g("Neither"),e("Only 10")],"Ends in 5 (not 0).",["5: yes. 10: needs 0."],"5 yes, 10 no.","hard",ch3),
  // ch3 factors_multiples
  Q("math6_ch3_fm_q1","math6_ch3_factors_multiples","Factors of 12?",[c("1, 2, 3, 4, 6, 12"),e("12, 24"),m("1, 12"),g("2, 3")],"Pairs: 1×12, 2×6, 3×4.",["All divisors."],"List divisors.","medium",ch3),
  Q("math6_ch3_fm_q2","math6_ch3_factors_multiples","Multiples of 5?",[c("5, 10, 15, 20, ..."),e("1, 2, 3, 4, 5"),m("5, 25, 125"),g("Random")],"Table of 5.",["× 1, 2, 3..."],"Table.","easy",ch3),
  Q("math6_ch3_fm_q3","math6_ch3_factors_multiples","Factors are…",[c("Divisors"),e("Multiples"),m("Random"),g("Quotients")],"Divide exactly.",["Factor ÷ divides."],"Divisors.","medium",ch3),
  Q("math6_ch3_fm_q4","math6_ch3_factors_multiples","Number of factors of 16?",[m("3"),c("5"),g("8"),e("4")],"1, 2, 4, 8, 16.",["5 factors."],"5.","hard",ch3),
  Q("math6_ch3_fm_q5","math6_ch3_factors_multiples","Multiples of 7 up to 40?",[c("7, 14, 21, 28, 35"),m("7, 14, 21"),g("All 7s up to 40"),e("Random")],"5 multiples.",["7×1 to 7×5 ≤ 40."],"List ≤ 40.","medium",ch3),
  Q("math6_ch3_fm_q6","math6_ch3_factors_multiples","Is 1 a factor of every number?",[c("Yes"),e("No"),m("Sometimes"),g("Random")],"1 divides everything.",["1 × N = N."],"1 universal.","easy",ch3),
  Q("math6_ch3_fm_q7","math6_ch3_factors_multiples","Difference of factors and multiples?",[c("Factor divides; multiple is product"),e("Same"),m("Random"),g("Opposite")],"Factor ÷, multiple ×.",["Factor: divides.","Multiple: product."],"÷ vs ×.","medium",ch3),
  Q("math6_ch3_fm_q8","math6_ch3_factors_multiples","Is 36 a multiple of 9?",[c("Yes (9×4=36)"),e("No"),m("Sometimes"),g("Random")],"9 × 4 = 36.",["36 ÷ 9 = 4."],"Yes.","easy",ch3),
  // ch3 number_games
  Q("math6_ch3_ng_q1","math6_ch3_number_games","Magic square has equal sums of…",[c("Rows, columns, diagonals"),e("Random"),m("Only diagonals"),g("Just rows")],"All directions sum to magic constant.",["3 directions."],"Rows/cols/diag.","hard",ch3),
  Q("math6_ch3_ng_q2","math6_ch3_number_games","In a 3×3 magic square 1-9, magic constant?",[c("15"),m("12"),g("9"),e("45")],"45/3 = 15.",["Sum 1-9 = 45.","45 ÷ 3 = 15."],"15.","hard",ch3),
  Q("math6_ch3_ng_q3","math6_ch3_number_games","Number puzzles teach…",[c("Patterns, properties"),e("Random"),m("Just counting"),g("Only fractions")],"Patterns + logic.",["Reveals number patterns."],"Patterns.","medium",ch3),
  Q("math6_ch3_ng_q4","math6_ch3_number_games","Pick a number; multiply by 2; add 6; divide by 2; subtract original. Result?",[c("3"),m("Random"),g("Original"),e("0")],"x → 2x → 2x+6 → x+3 → 3.",["Always 3."],"Trick: always 3.","hard",ch3),
  Q("math6_ch3_ng_q5","math6_ch3_number_games","Magic squares are usually…",[c("Equal sized (3x3, 4x4)"),e("Rectangular"),m("Random sized"),g("Triangular")],"Equal NxN.",["N x N grids."],"Square.","medium",ch3),
  Q("math6_ch3_ng_q6","math6_ch3_number_games","Trick: numbers that look the same upside down (e.g., 8, 11)?",[c("Strobogrammatic"),e("Magic"),m("Prime"),g("Cube")],"Strobogrammatic numbers.",["Same when rotated 180°."],"Strobogrammatic.","hard",ch3),
  Q("math6_ch3_ng_q7","math6_ch3_number_games","Sum 1+2+...+10 = ?",[c("55"),m("50"),g("45"),e("100")],"n(n+1)/2 = 10×11/2 = 55.",["Sum formula."],"55.","hard",ch3),
  Q("math6_ch3_ng_q8","math6_ch3_number_games","Number games help you learn…",[c("Math reasoning"),e("Hide things"),m("Random"),g("Only fun")],"Pattern + logic skills.",["Reason patterns."],"Reasoning.","medium",ch3),

  // ch4 collecting_data
  Q("math6_ch4_cd_q1","math6_ch4_collecting_data","First step in data collection?",[c("Decide the question"),e("Make a chart"),m("Buy paper"),g("Random")],"Question first.",["Q → ask → tally."],"Question.","easy",ch4),
  Q("math6_ch4_cd_q2","math6_ch4_collecting_data","Tally marks help to…",[c("Count quickly"),e("Decorate"),m("Random"),g("Hide data")],"Tally = fast count.",["1 mark per item."],"Fast count.","easy",ch4),
  Q("math6_ch4_cd_q3","math6_ch4_collecting_data","Tally for 5?",[c("|||| with cross"),m("|||||"),g("5"),e("V")],"4 vertical + 1 cross.",["||||̸ = 5."],"Cross 5th.","medium",ch4),
  Q("math6_ch4_cd_q4","math6_ch4_collecting_data","Total = ?",[c("Sum of all tallies"),e("Largest tally"),m("Random"),g("Average")],"Sum.",["Add all groups."],"Sum.","easy",ch4),
  Q("math6_ch4_cd_q5","math6_ch4_collecting_data","Survey of 50 students. Football=20, Cricket=15, Hockey=15. Total?",[c("50"),m("20"),g("30"),e("100")],"20+15+15=50.",["Add all."],"Sum.","easy",ch4),
  Q("math6_ch4_cd_q6","math6_ch4_collecting_data","Why organize data in table?",[c("Easy to read and analyze"),e("Random"),m("Hide it"),g("Decoration")],"Organized = clarity.",["Tables structure data."],"Clarity.","medium",ch4),
  Q("math6_ch4_cd_q7","math6_ch4_collecting_data","Tally for 12 looks like…",[c("|||||̸ |||||̸ ||"),m("|||||| 6"),g("12"),e("Random")],"Two groups of 5 + 2.",["5+5+2 = 12."],"Group fives.","medium",ch4),
  Q("math6_ch4_cd_q8","math6_ch4_collecting_data","After tallying, you…",[c("Sum and present in chart"),e("Throw away"),m("Random"),g("Re-ask")],"Sum + chart.",["Total → chart."],"Present.","medium",ch4),
  // ch4 bar_graphs
  Q("math6_ch4_bg_q1","math6_ch4_bar_graphs","Bar graph: x-axis shows…",[c("Categories"),e("Values"),m("Total"),g("Color")],"Categories.",["x = labels."],"Categories.","easy",ch4),
  Q("math6_ch4_bg_q2","math6_ch4_bar_graphs","y-axis shows…",[c("Values / counts"),e("Names"),m("Title"),g("Random")],"Values.",["y = numbers."],"Values.","easy",ch4),
  Q("math6_ch4_bg_q3","math6_ch4_bar_graphs","Taller bar means…",[c("Bigger value"),e("Smaller"),m("Same"),g("Random")],"Direct height = value.",["Bigger = more."],"Bigger.","easy",ch4),
  Q("math6_ch4_bg_q4","math6_ch4_bar_graphs","All bars have ___ width.",[c("Equal"),e("Different"),m("Random"),g("Triangular")],"Fair comparison.",["Same width."],"Equal.","medium",ch4),
  Q("math6_ch4_bg_q5","math6_ch4_bar_graphs","Most popular = ?",[c("Tallest bar"),e("Shortest"),m("Random"),g("Middle")],"Highest count = most popular.",["Max value."],"Tallest.","easy",ch4),
  Q("math6_ch4_bg_q6","math6_ch4_bar_graphs","Difference of A=15, B=10?",[c("5"),m("25"),g("150"),e("0")],"15−10.",["Subtract."],"Subtract.","easy",ch4),
  Q("math6_ch4_bg_q7","math6_ch4_bar_graphs","If scale 1=2, bar at 5 marks = ?",[c("10"),m("5"),g("2"),e("7")],"5×2.",["Marks × scale."],"× scale.","medium",ch4),
  Q("math6_ch4_bg_q8","math6_ch4_bar_graphs","Sum of bars A=10, B=15, C=5?",[c("30"),m("20"),g("150"),e("25")],"10+15+5.",["Add bars."],"Sum.","easy",ch4),
  // ch4 pictographs
  Q("math6_ch4_pi_q1","math6_ch4_pictographs","Pictograph uses…",[c("Symbols"),e("Just numbers"),m("Letters"),g("Random")],"Pictures.",["Each symbol = N items."],"Symbols.","easy",ch4),
  Q("math6_ch4_pi_q2","math6_ch4_pictographs","Each ★ = 5. 6 stars = ?",[c("30"),m("11"),g("65"),e("5")],"6×5.",["Stars × key."],"× key.","easy",ch4),
  Q("math6_ch4_pi_q3","math6_ch4_pictographs","Key tells you…",[c("Value per symbol"),e("Color"),m("Title"),g("Random")],"Key = scale.",["Symbol → value."],"Key = scale.","easy",ch4),
  Q("math6_ch4_pi_q4","math6_ch4_pictographs","Each ☺ = 10. 4.5 symbols = ?",[c("45"),m("40"),g("4"),e("50")],"4.5×10.",["Half symbol = 5."],"× key.","medium",ch4),
  Q("math6_ch4_pi_q5","math6_ch4_pictographs","To show 30 with key 6 each…",[c("5 symbols"),m("6 symbols"),g("4 symbols"),e("30 symbols")],"30÷6=5.",["Total ÷ key."],"÷ key.","medium",ch4),
  Q("math6_ch4_pi_q6","math6_ch4_pictographs","Half symbol = ___?",[c("Half key value"),e("Zero"),m("Full"),g("Random")],"½ × key.",["½ symbol = ½ × key."],"Half = ½.","medium",ch4),
  Q("math6_ch4_pi_q7","math6_ch4_pictographs","Why use pictographs?",[c("Visual + intuitive"),e("Decoration"),m("Random"),g("Confuse")],"Symbols quick to grasp.",["Picture > raw number."],"Visual.","medium",ch4),
  Q("math6_ch4_pi_q8","math6_ch4_pictographs","Pictograph limitation:",[c("Hard with very large numbers"),e("Cannot show categories"),m("Random"),g("None")],"Many symbols clutter.",["Large data → cluttered."],"Large data limit.","hard",ch4),
  // ch4 data_interpretation
  Q("math6_ch4_di_q1","math6_ch4_data_interpretation","Most common category = ?",[c("Highest count / tallest"),e("Smallest"),m("Random"),g("Middle")],"Max value.",["Max = most common."],"Max.","easy",ch4),
  Q("math6_ch4_di_q2","math6_ch4_data_interpretation","Total students = ?",[c("Sum all categories"),e("Largest"),m("Random"),g("Average")],"Sum.",["Add all."],"Sum.","easy",ch4),
  Q("math6_ch4_di_q3","math6_ch4_data_interpretation","Difference between two categories = ?",[c("Subtract values"),e("Add"),m("Multiply"),g("Random")],"Subtract.",["|A − B|."],"Subtract.","easy",ch4),
  Q("math6_ch4_di_q4","math6_ch4_data_interpretation","From chart: A=20, B=10, C=15. Total?",[c("45"),m("35"),g("40"),e("50")],"20+10+15.",["Sum."],"Sum.","easy",ch4),
  Q("math6_ch4_di_q5","math6_ch4_data_interpretation","From chart: A=20, B=10. % of A?",[c("Need total. If total 100, A = 20%"),e("Just 20"),m("Random"),g("50%")],"Part/total × 100.",["%age = part/total × 100."],"part/total × 100.","hard",ch4),
  Q("math6_ch4_di_q6","math6_ch4_data_interpretation","Which is least common?",[c("Smallest bar"),e("Largest"),m("Random"),g("Middle")],"Min value.",["Min = least."],"Min.","easy",ch4),
  Q("math6_ch4_di_q7","math6_ch4_data_interpretation","Why use charts?",[c("See patterns and trends"),e("Hide data"),m("Random"),g("Decoration")],"Visual analysis.",["Charts reveal patterns."],"Reveal patterns.","medium",ch4),
  Q("math6_ch4_di_q8","math6_ch4_data_interpretation","Compare 2 categories visually = ?",[c("Bar heights side by side"),e("Random"),m("Pie chart"),g("Numbers only")],"Bar graphs compare best.",["Side-by-side bars."],"Bar graph.","medium",ch4),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 6 Math v2 questions (Ch3-4).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
