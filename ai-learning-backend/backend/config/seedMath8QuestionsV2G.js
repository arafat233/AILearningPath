import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch13 = "Algebra Play";
const ch14 = "Area";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"8", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math8_ch13_ex_q1","math8_ch13_expressions","Expression 2x + 5 at x = 3:",[c("11"),m("13"),g("8"),e("23")],"2(3)+5=11.",["6+5=11."],"Substitute.","easy",ch13),
  Q("math8_ch13_ex_q2","math8_ch13_expressions","Variable in 3x − 7:",[c("x"),m("3"),g("7"),e("21")],"Letter.",["x is unknown."],"x.","easy",ch13),
  Q("math8_ch13_ex_q3","math8_ch13_expressions","Coefficient of x in 4x:",[c("4"),m("x"),g("0"),e("Random")],"Number.",["4 multiplies x."],"4.","easy",ch13),
  Q("math8_ch13_ex_q4","math8_ch13_expressions","Constant in 3x + 5:",[c("5"),m("3"),g("x"),e("Random")],"No variable.",["5 stands alone."],"5.","medium",ch13),
  Q("math8_ch13_ex_q5","math8_ch13_expressions","Expression has __ sign.",[c("No equality"),e("Equality"),m("Inequality"),g("Random")],"No =.",["Just terms."],"No =.","medium",ch13),
  Q("math8_ch13_ex_q6","math8_ch13_expressions","Evaluate x² + 1 at x = 4:",[c("17"),m("9"),g("16"),e("Random")],"16+1.",["x² = 16, +1 = 17."],"Substitute.","medium",ch13),
  Q("math8_ch13_ex_q7","math8_ch13_expressions","Like terms: 3x and 5x?",[c("Yes"),e("No"),m("Sometimes"),g("Random")],"Same variable.",["Both x."],"Yes.","easy",ch13),
  Q("math8_ch13_ex_q8","math8_ch13_expressions","Simplify 3x + 5x − 2x:",[c("6x"),m("10x"),g("0"),e("Random")],"Combine.",["(3+5-2)x = 6x."],"Combine.","medium",ch13),
  Q("math8_ch13_eq_q1","math8_ch13_equations","x + 7 = 12. x = ?",[c("5"),m("19"),g("7"),e("12")],"x = 5.",["Subtract 7."],"Isolate.","easy",ch13),
  Q("math8_ch13_eq_q2","math8_ch13_equations","2x − 4 = 10. x = ?",[c("7"),m("3"),g("14"),e("Random")],"2x=14, x=7.",["+4 then ÷2."],"2 steps.","medium",ch13),
  Q("math8_ch13_eq_q3","math8_ch13_equations","Equations have __ sign.",[c("="),e("≠"),m("Random"),g("<")],"Equality.",["= sign."],"=.","easy",ch13),
  Q("math8_ch13_eq_q4","math8_ch13_equations","Solve x/4 = 5:",[c("20"),m("5"),g("1.25"),e("Random")],"× 4.",["× 4 both sides."],"× both.","medium",ch13),
  Q("math8_ch13_eq_q5","math8_ch13_equations","3x + 2 = 14. x = ?",[c("4"),m("16/3"),g("12"),e("Random")],"3x=12, x=4.",["−2, ÷3."],"2 steps.","medium",ch13),
  Q("math8_ch13_eq_q6","math8_ch13_equations","To solve equation, ___",[c("Isolate variable"),e("Random"),m("Add same"),g("Random")],"Isolation.",["Get x alone."],"Isolate.","easy",ch13),
  Q("math8_ch13_eq_q7","math8_ch13_equations","Verify solution by…",[c("Substituting"),e("Guessing"),m("Random"),g("Cannot")],"Plug in.",["Substitute back."],"Substitute.","medium",ch13),
  Q("math8_ch13_eq_q8","math8_ch13_equations","Solve 5x = 0. x = ?",[c("0"),m("5"),g("Undefined"),e("Random")],"÷ 5.",["0/5 = 0."],"= 0.","easy",ch13),
  Q("math8_ch13_in_q1","math8_ch13_inequalities","Symbols of inequality:",[c("<, >, ≤, ≥"),e("="),m("=="),g("Random")],"Standard.",["Less, greater, etc."],"<, >.","easy",ch13),
  Q("math8_ch13_in_q2","math8_ch13_inequalities","Solve x + 3 > 5:",[c("x > 2"),m("x = 2"),g("x < 2"),e("Random")],"x = 5−3, > 2.",["Subtract 3."],"− both.","medium",ch13),
  Q("math8_ch13_in_q3","math8_ch13_inequalities","When ÷ or × by negative, flip ___",[c("Inequality sign"),e("Numbers"),m("Random"),g("Variable")],"Sign flip rule.",["× or ÷ by (−) flips."],"Flip sign.","hard",ch13),
  Q("math8_ch13_in_q4","math8_ch13_inequalities","Solve −2x < 6:",[c("x > −3"),m("x < −3"),g("x > 3"),e("Random")],"÷ −2 flips.",["÷ −2, flip > becomes >."],"Flip.","hard",ch13),
  Q("math8_ch13_in_q5","math8_ch13_inequalities","Solve 3x ≤ 15:",[c("x ≤ 5"),m("x ≥ 5"),g("x = 5"),e("Random")],"÷ 3 (positive).",["÷ 3, no flip."],"÷ pos.","medium",ch13),
  Q("math8_ch13_in_q6","math8_ch13_inequalities","Solution of inequality is…",[c("A range of values"),e("Single value"),m("Random"),g("None")],"Range.",["Many values satisfy."],"Range.","medium",ch13),
  Q("math8_ch13_in_q7","math8_ch13_inequalities","Solve x − 4 ≥ 1:",[c("x ≥ 5"),m("x ≤ 5"),g("x > 5"),e("Random")],"+ 4 both.",["x ≥ 5."],"+ both.","medium",ch13),
  Q("math8_ch13_in_q8","math8_ch13_inequalities","≥ means…",[c("Greater than or equal"),e("Greater than"),m("Less than"),g("Equal")],"Including equality.",["≥ includes ="],">  or =.","medium",ch13),
  Q("math8_ch13_id_q1","math8_ch13_identities","(a+b)² = ?",[c("a²+2ab+b²"),m("a²+b²"),g("a²+ab+b²"),e("(a+b)(a+b)")],"Identity.",["Expand square of sum."],"a²+2ab+b².","medium",ch13),
  Q("math8_ch13_id_q2","math8_ch13_identities","(a−b)² = ?",[c("a²−2ab+b²"),m("a²−b²"),g("a²+2ab−b²"),e("a²−2b")],"Identity.",["Square of difference."],"a²−2ab+b².","medium",ch13),
  Q("math8_ch13_id_q3","math8_ch13_identities","a² − b² = ?",[c("(a+b)(a−b)"),m("(a−b)²"),g("a²−2ab+b²"),e("Random")],"Diff of squares.",["Factor."],"(a+b)(a−b).","medium",ch13),
  Q("math8_ch13_id_q4","math8_ch13_identities","(x+3)² = ?",[c("x²+6x+9"),m("x²+9"),g("x²+3x+9"),e("Random")],"Use identity.",["x² + 2(3)x + 9."],"a²+2ab+b².","medium",ch13),
  Q("math8_ch13_id_q5","math8_ch13_identities","(x−5)² = ?",[c("x²−10x+25"),m("x²−25"),g("x²+10x+25"),e("Random")],"Use identity.",["x² − 2(5)x + 25."],"a²−2ab+b².","medium",ch13),
  Q("math8_ch13_id_q6","math8_ch13_identities","x² − 16 = ?",[c("(x−4)(x+4)"),m("(x−4)²"),g("(x+4)²"),e("Random")],"Diff squares.",["a² − b²."],"(x-4)(x+4).","medium",ch13),
  Q("math8_ch13_id_q7","math8_ch13_identities","Why identities useful?",[c("Quick expansion/factorization"),e("Random"),m("Decoration"),g("Hide")],"Speed.",["Quick math."],"Quick.","easy",ch13),
  Q("math8_ch13_id_q8","math8_ch13_identities","(a+b)(a−b) = ?",[c("a²−b²"),m("a²+b²"),g("(a+b)²"),e("Random")],"Diff squares.",["Product = a²−b²."],"a²−b².","medium",ch13),

  Q("math8_ch14_re_q1","math8_ch14_rectangle_area","Rectangle 5×8 area:",[c("40"),m("13"),g("26"),e("Random")],"l × w.",["5 × 8 = 40."],"l×w.","easy",ch14),
  Q("math8_ch14_re_q2","math8_ch14_rectangle_area","Square side 6 area:",[c("36"),m("12"),g("24"),e("18")],"6².",["36."],"s².","easy",ch14),
  Q("math8_ch14_re_q3","math8_ch14_rectangle_area","Rectangle area formula:",[c("l × w"),m("2(l+w)"),g("l+w"),e("Random")],"Multiply.",["A = lw."],"l×w.","easy",ch14),
  Q("math8_ch14_re_q4","math8_ch14_rectangle_area","Rectangle 10×4:",[c("40"),m("14"),g("28"),e("Random")],"10×4.",["40."],"l×w.","easy",ch14),
  Q("math8_ch14_re_q5","math8_ch14_rectangle_area","Square 9×9 area:",[c("81"),m("36"),g("18"),e("Random")],"81.",["9²=81."],"s².","easy",ch14),
  Q("math8_ch14_re_q6","math8_ch14_rectangle_area","Find length if area = 24, width = 6:",[c("4"),m("18"),g("24"),e("Random")],"24/6.",["A/w = l."],"A/w.","medium",ch14),
  Q("math8_ch14_re_q7","math8_ch14_rectangle_area","Area unit:",[c("Square units (cm², m²)"),e("Length"),m("Volume"),g("Random")],"Sq.",["sq cm, sq m."],"Sq units.","easy",ch14),
  Q("math8_ch14_re_q8","math8_ch14_rectangle_area","Floor 10×8 m. Tiles 1×1 m. # tiles?",[c("80"),m("18"),g("36"),e("100")],"80/1.",["A = 80, each tile = 1."],"A ÷ tile.","medium",ch14),
  Q("math8_ch14_ta_q1","math8_ch14_triangle_area","Triangle area formula:",[c("½ × b × h"),m("b × h"),g("b+h"),e("Random")],"Half base × height.",["½bh."],"½bh.","easy",ch14),
  Q("math8_ch14_ta_q2","math8_ch14_triangle_area","Base 6, height 4 area:",[c("12"),m("24"),g("10"),e("Random")],"½ × 6 × 4.",["½ × 24 = 12."],"½bh.","easy",ch14),
  Q("math8_ch14_ta_q3","math8_ch14_triangle_area","Base 10, height 5:",[c("25"),m("50"),g("15"),e("Random")],"½×10×5.",["25."],"½bh.","medium",ch14),
  Q("math8_ch14_ta_q4","math8_ch14_triangle_area","Height must be ___ to base.",[c("Perpendicular"),e("Parallel"),m("Random"),g("Equal")],"Right angle.",["Vertical to base."],"⊥.","medium",ch14),
  Q("math8_ch14_ta_q5","math8_ch14_triangle_area","Right triangle legs 6, 8:",[c("24"),m("48"),g("14"),e("Random")],"½ × 6 × 8.",["½ × 48 = 24."],"Legs as b, h.","medium",ch14),
  Q("math8_ch14_ta_q6","math8_ch14_triangle_area","Triangle base 4 cm, height 3 cm:",[c("6 cm²"),m("12 cm²"),g("7 cm²"),e("Random")],"½ × 4 × 3.",["6 sq cm."],"½bh.","easy",ch14),
  Q("math8_ch14_ta_q7","math8_ch14_triangle_area","Triangle area = half of ?",[c("Parallelogram with same base/height"),e("Random"),m("Square"),g("Circle")],"Half rectangle.",["Triangle = half rectangle."],"Half parallelogram.","hard",ch14),
  Q("math8_ch14_ta_q8","math8_ch14_triangle_area","If base 12, height 5:",[c("30"),m("60"),g("17"),e("Random")],"½ × 60.",["30."],"½bh.","medium",ch14),
  Q("math8_ch14_tz_q1","math8_ch14_trapezium_area","Trapezium area formula:",[c("½(a+b)h"),m("a×b×h"),g("ab"),e("Random")],"Standard.",["½ × (sum of parallel sides) × h."],"½(a+b)h.","medium",ch14),
  Q("math8_ch14_tz_q2","math8_ch14_trapezium_area","Parallel sides 5, 7; height 4:",[c("24"),m("12"),g("48"),e("Random")],"½(5+7)×4.",["½×12×4 = 24."],"Apply formula.","medium",ch14),
  Q("math8_ch14_tz_q3","math8_ch14_trapezium_area","Parallel sides of trapezium can be…",[c("Different lengths"),e("Equal only"),m("Same"),g("Random")],"By definition.",["At least 1 pair, can differ."],"Can differ.","medium",ch14),
  Q("math8_ch14_tz_q4","math8_ch14_trapezium_area","Sides 8, 12; height 5:",[c("50"),m("60"),g("100"),e("Random")],"½(8+12)×5.",["½ × 20 × 5 = 50."],"Apply.","medium",ch14),
  Q("math8_ch14_tz_q5","math8_ch14_trapezium_area","Height in trapezium:",[c("Perpendicular distance between parallel sides"),e("Random"),m("Diagonal"),g("Slant")],"⊥ distance.",["Like rectangle height."],"⊥ between ||.","hard",ch14),
  Q("math8_ch14_tz_q6","math8_ch14_trapezium_area","Sides 3, 5; height 2:",[c("8"),m("15"),g("4"),e("Random")],"½(3+5)×2.",["½ × 8 × 2 = 8."],"Apply.","medium",ch14),
  Q("math8_ch14_tz_q7","math8_ch14_trapezium_area","Trapezium = parallelogram if…",[c("Both pairs of sides parallel"),e("Equal sides"),m("Random"),g("Cannot")],"Becomes parallelogram.",["Both pairs parallel."],"Both ||.","hard",ch14),
  Q("math8_ch14_tz_q8","math8_ch14_trapezium_area","Why average parallel sides?",[c("Like rectangle of average width × height"),e("Random"),m("Decoration"),g("Always")],"Averaging.",["Average of sides × height."],"Avg × height.","hard",ch14),
  Q("math8_ch14_ci_q1","math8_ch14_circle_area","Circle area formula:",[c("πr²"),m("πd"),g("2πr"),e("πd²")],"Standard.",["A = πr²."],"πr².","medium",ch14),
  Q("math8_ch14_ci_q2","math8_ch14_circle_area","Radius 7, area ≈ ?",[c("154 sq units (π×49)"),m("44"),g("49"),e("Random")],"π × 49.",["22/7 × 49 = 154."],"πr².","medium",ch14),
  Q("math8_ch14_ci_q3","math8_ch14_circle_area","Circumference formula:",[c("2πr"),m("πr²"),g("πr"),e("πd²")],"Around circle.",["2πr or πd."],"2πr.","medium",ch14),
  Q("math8_ch14_ci_q4","math8_ch14_circle_area","Use which value for radius (not diameter)?",[c("Radius for area"),e("Diameter"),m("Random"),g("Either")],"r in formula.",["A = πr² uses r."],"r.","medium",ch14),
  Q("math8_ch14_ci_q5","math8_ch14_circle_area","If radius doubles, area becomes ___ times.",[c("4"),m("2"),g("1"),e("8")],"r² → 4r².",["(2r)² = 4r²."],"× 4.","hard",ch14),
  Q("math8_ch14_ci_q6","math8_ch14_circle_area","π ≈ ?",[c("3.14 (or 22/7)"),m("3"),g("22"),e("Random")],"Famous constant.",["Irrational."],"3.14.","easy",ch14),
  Q("math8_ch14_ci_q7","math8_ch14_circle_area","Diameter = ?",[c("2r"),m("r"),g("πr"),e("r/2")],"Across circle.",["d = 2r."],"2r.","easy",ch14),
  Q("math8_ch14_ci_q8","math8_ch14_circle_area","Radius 14, area ≈ ?",[c("616 (π×196)"),m("88"),g("196"),e("Random")],"π × 196.",["22/7 × 196 = 616."],"πr².","hard",ch14),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 8 Math v2 questions (Ch13-14).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
