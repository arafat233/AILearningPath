/** ICSE Class 10 Math — Questions Ch5-9 (Quadratics, Quad Problems, Ratio, Remainder/Factor, Matrices) */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const Q = (id, tid, text, opts, ex, steps, sc, d, ch) => ({
  questionId: id, topicId: tid, text, questionText: text, options: opts,
  explanation: ex, solutionSteps: steps, shortcut: sc, difficulty: d,
  subject: "Mathematics", grade: "10", examBoard: "ICSE", chapter: ch, topic: ch
});
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});
const ch5="Quadratic Equations", ch6="Quadratic Problems", ch7="Ratio and Proportion", ch8="Remainder and Factor Theorems", ch9="Matrices";

const questions = [
  // Ch5 quadratic_intro
  Q("icse10_ch5_qi_q1","icse10_ch5_quadratic_intro","Standard form of quadratic?",[c("ax² + bx + c = 0"),m("ax + b = 0"),g("ax³ + bx + c"),e("a + bx + cx²")],"Degree 2.",["a ≠ 0."],"ax²+bx+c=0.","easy",ch5),
  Q("icse10_ch5_qi_q2","icse10_ch5_quadratic_intro","In ax² + bx + c, a must be…",[c("Non-zero"),m("Positive only"),g("Negative"),e("Any")],"Else linear.",["a ≠ 0 for quadratic."],"≠ 0.","medium",ch5),
  Q("icse10_ch5_qi_q3","icse10_ch5_quadratic_intro","Quadratic has at most…",[c("2 real roots"),m("1 root"),g("3 roots"),e("Random")],"Degree.",["Degree = max roots."],"2.","easy",ch5),
  Q("icse10_ch5_qi_q4","icse10_ch5_quadratic_intro","x² − 5x + 6 = 0: a, b, c?",[c("1, −5, 6"),m("1, 5, 6"),g("−1, 5, −6"),e("0, −5, 6")],"Standard form.",["Read coefficients."],"Read.","medium",ch5),
  Q("icse10_ch5_qi_q5","icse10_ch5_quadratic_intro","Sum of roots = ?",[c("−b/a"),m("b/a"),g("c/a"),e("ab")],"Standard.",["By Vieta."],"−b/a.","medium",ch5),
  Q("icse10_ch5_qi_q6","icse10_ch5_quadratic_intro","Product of roots = ?",[c("c/a"),m("b/a"),g("−c/a"),e("ab")],"Standard.",["By Vieta."],"c/a.","medium",ch5),
  Q("icse10_ch5_qi_q7","icse10_ch5_quadratic_intro","Three solving methods?",[c("Factor, complete square, formula"),m("Just factor"),g("Just formula"),e("None")],"Three.",["Standard methods."],"3 methods.","easy",ch5),
  Q("icse10_ch5_qi_q8","icse10_ch5_quadratic_intro","Is x² + 1 = 0 a quadratic?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"a=1, b=0, c=1.",["Has x² term."],"Yes.","medium",ch5),
  // Ch5 quadratic_factorization
  Q("icse10_ch5_qf_q1","icse10_ch5_quadratic_factorization","x² − 5x + 6 = (x−2)(x−?)",[c("3"),m("4"),g("2"),e("6")],"Sum 5, product 6.",["2 × 3 = 6, 2+3=5."],"Find pair.","easy",ch5),
  Q("icse10_ch5_qf_q2","icse10_ch5_quadratic_factorization","x² + 7x + 12 factors?",[c("(x+3)(x+4)"),m("(x+1)(x+12)"),g("(x+2)(x+6)"),e("(x-3)(x-4)")],"3+4=7, 3×4=12.",["Both positive."],"Sum & product.","medium",ch5),
  Q("icse10_ch5_qf_q3","icse10_ch5_quadratic_factorization","x² − x − 12 factors?",[c("(x−4)(x+3)"),m("(x+4)(x−3)"),g("(x−2)(x−6)"),e("(x−4)(x−3)")],"−4+3=−1, −4×3=−12.",["Opposite signs."],"Mixed signs.","medium",ch5),
  Q("icse10_ch5_qf_q4","icse10_ch5_quadratic_factorization","Solutions of (x−2)(x−3) = 0?",[c("x=2 or x=3"),m("x=−2 or −3"),g("x=5"),e("x=6")],"Zero product.",["Each factor = 0."],"Zero product.","easy",ch5),
  Q("icse10_ch5_qf_q5","icse10_ch5_quadratic_factorization","2x² + 5x + 3 factors?",[c("(2x+3)(x+1)"),m("(x+3)(2x+1)"),g("(x+1)(x+3)"),e("(2x+1)(x+3)")],"AC=6. Find pair.",["Pair (3,2): 2x²+3x+2x+3."],"AC method.","hard",ch5),
  Q("icse10_ch5_qf_q6","icse10_ch5_quadratic_factorization","x² − 9 factors as…",[c("(x−3)(x+3)"),m("(x−3)²"),g("(x+3)²"),e("(x−9)(x+1)")],"Diff squares.",["a²−b² = (a−b)(a+b)."],"Diff squares.","medium",ch5),
  Q("icse10_ch5_qf_q7","icse10_ch5_quadratic_factorization","x² + 6x + 9 factors?",[c("(x+3)²"),m("(x+3)(x+9)"),g("(x−3)²"),e("(x+1)(x+9)")],"Perfect square.",["(a+b)² = a²+2ab+b²."],"Perfect square.","medium",ch5),
  Q("icse10_ch5_qf_q8","icse10_ch5_quadratic_factorization","Roots of x² − 4 = 0?",[c("x = ±2"),m("x = 4"),g("x = 0"),e("x = ±4")],"Diff squares.",["(x−2)(x+2) = 0."],"Diff squares.","easy",ch5),
  // Ch5 quadratic_formula
  Q("icse10_ch5_qfm_q1","icse10_ch5_quadratic_formula","Quadratic formula:",[c("x = (−b ± √(b²−4ac))/2a"),m("x = b/2a"),g("x = ±√c"),e("x = a + b + c")],"Standard.",["Memorize."],"Standard.","medium",ch5),
  Q("icse10_ch5_qfm_q2","icse10_ch5_quadratic_formula","Discriminant?",[c("b² − 4ac"),m("b² + 4ac"),g("(b − 4ac)²"),e("2a")],"Under root.",["Inside √."],"b²−4ac.","medium",ch5),
  Q("icse10_ch5_qfm_q3","icse10_ch5_quadratic_formula","Solve x² + 2x − 8 = 0.",[c("x = 2 or −4"),m("x = −2 or 4"),g("x = 1, 2"),e("Random")],"Factor or formula.",["(x−2)(x+4)=0."],"Factor first.","medium",ch5),
  Q("icse10_ch5_qfm_q4","icse10_ch5_quadratic_formula","If Δ = 0, roots are…",[c("Real and equal"),m("Different"),g("Complex"),e("None")],"One repeated.",["Both x = −b/2a."],"Real equal.","medium",ch5),
  Q("icse10_ch5_qfm_q5","icse10_ch5_quadratic_formula","Solve x² = 9.",[c("x = ±3"),m("x = 3"),g("x = −3"),e("Random")],"√ both sides.",["x² = 9 → x = ±3."],"± √.","easy",ch5),
  Q("icse10_ch5_qfm_q6","icse10_ch5_quadratic_formula","Solve 2x² − 7x + 3 = 0.",[c("x = 3 or ½"),m("x = 3 or 1"),g("x = 7"),e("Random")],"Apply formula.",["(2x−1)(x−3)=0."],"Factor.","hard",ch5),
  Q("icse10_ch5_qfm_q7","icse10_ch5_quadratic_formula","For x² − 6x + 9 = 0, discriminant?",[c("0"),m("36"),g("−36"),e("9")],"36 − 36.",["Equal roots case."],"Δ=0.","medium",ch5),
  Q("icse10_ch5_qfm_q8","icse10_ch5_quadratic_formula","If b² − 4ac < 0, roots are…",[c("No real roots"),m("Two real"),g("One root"),e("Infinite")],"Imaginary.",["Negative under √."],"No real.","medium",ch5),
  // Ch5 quadratic_nature
  Q("icse10_ch5_qn_q1","icse10_ch5_quadratic_nature","Discriminant > 0 means…",[c("2 distinct real roots"),m("Equal roots"),g("No real"),e("Infinite")],"Standard.",["Δ > 0."],"2 distinct.","medium",ch5),
  Q("icse10_ch5_qn_q2","icse10_ch5_quadratic_nature","Discriminant = 0 means…",[c("Equal real roots"),m("Distinct"),g("No real"),e("Random")],"Standard.",["Δ = 0."],"Equal.","medium",ch5),
  Q("icse10_ch5_qn_q3","icse10_ch5_quadratic_nature","Discriminant < 0 means…",[c("No real roots"),m("Distinct"),g("Equal"),e("Random")],"Imaginary.",["Δ < 0."],"No real.","medium",ch5),
  Q("icse10_ch5_qn_q4","icse10_ch5_quadratic_nature","For x² + 4x + 4: nature of roots?",[c("Equal"),m("Distinct"),g("No real"),e("Imaginary")],"Δ = 16−16 = 0.",["Δ = 0."],"Equal.","medium",ch5),
  Q("icse10_ch5_qn_q5","icse10_ch5_quadratic_nature","For x² + 2x + 5: nature?",[c("No real roots"),m("Equal"),g("Distinct"),e("Random")],"Δ = 4−20 = −16.",["Δ < 0."],"No real.","medium",ch5),
  Q("icse10_ch5_qn_q6","icse10_ch5_quadratic_nature","For 2x² + 3x − 5: nature?",[c("Distinct real"),m("Equal"),g("No real"),e("Random")],"Δ = 9+40 > 0.",["Δ > 0."],"Distinct.","medium",ch5),
  Q("icse10_ch5_qn_q7","icse10_ch5_quadratic_nature","Sum of roots of 2x² − 6x + 3 = 0?",[c("3"),m("6"),g("−3"),e("1.5")],"−b/a = 6/2.",["3."],"−b/a.","medium",ch5),
  Q("icse10_ch5_qn_q8","icse10_ch5_quadratic_nature","Product of roots of 2x² − 6x + 3 = 0?",[c("1.5"),m("3"),g("6"),e("0.5")],"c/a = 3/2.",["1.5."],"c/a.","medium",ch5),

  // Ch6 word_problems_quad
  Q("icse10_ch6_wq_q1","icse10_ch6_word_problems_quad","Product of two consecutive integers = 56. Smaller?",[c("7"),m("8"),g("6"),e("5")],"x(x+1)=56.",["x²+x−56=0, x=7."],"Translate.","medium",ch6),
  Q("icse10_ch6_wq_q2","icse10_ch6_word_problems_quad","Sum of squares = 41, diff = 1. Numbers?",[c("4 and 5"),m("5 and 6"),g("3 and 4"),e("6 and 7")],"x² + (x+1)² = 41.",["2x² + 2x − 40 = 0."],"Set up.","hard",ch6),
  Q("icse10_ch6_wq_q3","icse10_ch6_word_problems_quad","Number + reciprocal = 5/2. Number?",[c("2 or 1/2"),m("1"),g("3"),e("5")],"x + 1/x = 5/2.",["2x² − 5x + 2 = 0."],"Set up.","hard",ch6),
  Q("icse10_ch6_wq_q4","icse10_ch6_word_problems_quad","Number squared minus 3 times number = 10. Find number.",[c("5 or −2"),m("Just 5"),g("−2 only"),e("None")],"x² − 3x − 10 = 0.",["(x−5)(x+2)=0."],"Factor.","medium",ch6),
  Q("icse10_ch6_wq_q5","icse10_ch6_word_problems_quad","Reject negative root if…",[c("Problem context demands positive (e.g. ages)"),m("Always"),g("Never"),e("Random")],"Context check.",["Use context."],"Context.","medium",ch6),
  Q("icse10_ch6_wq_q6","icse10_ch6_word_problems_quad","If sum of roots of quadratic is 5, product 6, roots?",[c("2 and 3"),m("1 and 6"),g("5 and 1"),e("None")],"x² − 5x + 6 = 0.",["(x−2)(x−3) = 0."],"Build & factor.","medium",ch6),
  Q("icse10_ch6_wq_q7","icse10_ch6_word_problems_quad","Number = 1 less than its square. Find positive value.",[c("(1+√5)/2"),m("1"),g("2"),e("0")],"x = x²−1.",["x²−x−1=0, golden ratio."],"Set up.","hard",ch6),
  Q("icse10_ch6_wq_q8","icse10_ch6_word_problems_quad","Twice a number squared minus 7x + 3 = 0. Solve.",[c("x = 3 or ½"),m("x = 7"),g("Just ½"),e("Random")],"Factor.",["(2x−1)(x−3)=0."],"Factor.","hard",ch6),
  // Ch6 age_problems
  Q("icse10_ch6_ap_q1","icse10_ch6_age_problems","Father's age = 4 × son's. Sum = 50. Son's age?",[c("10"),m("40"),g("8"),e("5")],"4x + x = 50.",["x = 10."],"Sum.","easy",ch6),
  Q("icse10_ch6_ap_q2","icse10_ch6_age_problems","Sum of squares of ages = 130. Mother 20 yrs older. Daughter's age?",[c("5"),m("10"),g("15"),e("None real")],"x² + (x+20)² = 130. → 2x² + 40x + 270 = 0.",["Solve, x positive."],"Set up.","hard",ch6),
  Q("icse10_ch6_ap_q3","icse10_ch6_age_problems","Age 5 years ago × age 10 years hence = 100. Find present age.",[c("10"),m("5"),g("15"),e("12")],"(x−5)(x+10) = 100.",["x² + 5x − 150 = 0, x = 10."],"Set up.","hard",ch6),
  Q("icse10_ch6_ap_q4","icse10_ch6_age_problems","Two brothers' age diff 4, product 60. Younger age?",[c("6"),m("10"),g("8"),e("4")],"x(x+4)=60.",["x² + 4x − 60 = 0, x = 6."],"Set up.","medium",ch6),
  Q("icse10_ch6_ap_q5","icse10_ch6_age_problems","Father's age = son² + 5. Father 50. Son's age?",[c("Some appropriate value"),m("5"),g("10"),e("Cannot")],"50 = x² + 5 → x²=45.",["x = √45 ≈ 6.7."],"Set up.","hard",ch6),
  Q("icse10_ch6_ap_q6","icse10_ch6_age_problems","Sum of two ages = 30. Product = 200. Find ages.",[c("10 and 20"),m("15 and 15"),g("5 and 25"),e("None")],"Quad form.",["Use sum/product to build quadratic."],"Sum & product.","hard",ch6),
  Q("icse10_ch6_ap_q7","icse10_ch6_age_problems","Mother's age 3 years ago = 4 × daughter's age now. Sum of present ages = 41.",[c("8 and 33"),m("10 and 31"),g("9 and 32"),e("Cannot solve")],"Set up.",["x = 8, mother 33."],"Translate.","hard",ch6),
  Q("icse10_ch6_ap_q8","icse10_ch6_age_problems","Why reject negative root in age problems?",[c("Ages are non-negative"),m("Random"),g("Math rule"),e("Just because")],"Context.",["Age must be positive."],"Real context.","easy",ch6),
  // Ch6 speed_problems
  Q("icse10_ch6_sp_q1","icse10_ch6_speed_problems","d = ?",[c("s × t"),m("s/t"),g("t/s"),e("s + t")],"Standard.",["Distance = speed × time."],"= s × t.","easy",ch6),
  Q("icse10_ch6_sp_q2","icse10_ch6_speed_problems","If speed 60 km/h for 4 hrs, distance?",[c("240 km"),m("64"),g("15"),e("180")],"60 × 4.",["Multiply."],"× t.","easy",ch6),
  Q("icse10_ch6_sp_q3","icse10_ch6_speed_problems","Train covers 480 km. Speed up by 20 km/h saves 1 hr. Original speed?",[c("80"),m("100"),g("120"),e("60")],"Quad: 480/x = 480/(x+20) + 1.",["Solve quadratic."],"Set up.","hard",ch6),
  Q("icse10_ch6_sp_q4","icse10_ch6_speed_problems","Boat 24 km downstream same time as 18 km upstream. Stream speed if boat 3 km/h still?",[c("0.43 km/h"),m("3"),g("6"),e("9")],"Time equations.",["Solve."],"Time equality.","hard",ch6),
  Q("icse10_ch6_sp_q5","icse10_ch6_speed_problems","Speed = ?",[c("Distance / Time"),m("Time / Distance"),g("d × t"),e("d + t")],"Reverse.",["v = d/t."],"d/t.","easy",ch6),
  Q("icse10_ch6_sp_q6","icse10_ch6_speed_problems","Time = ?",[c("Distance / Speed"),m("Speed / Distance"),g("d × s"),e("d − s")],"Reverse.",["t = d/v."],"d/v.","easy",ch6),
  Q("icse10_ch6_sp_q7","icse10_ch6_speed_problems","Walking 4 km/h takes 1 hr more than at 5 km/h. Distance?",[c("20 km"),m("5"),g("10"),e("4")],"d/4 = d/5 + 1.",["d/20 = 1 → d = 20."],"Solve.","medium",ch6),
  Q("icse10_ch6_sp_q8","icse10_ch6_speed_problems","If round trip total time = 5 hrs at 60 km/h and 40 km/h, distance one way?",[c("Solve harmonic mean problem"),m("Random"),g("60"),e("100")],"Set up.",["d/60 + d/40 = 5."],"Set up.","hard",ch6),
  // Ch6 geometry_problems
  Q("icse10_ch6_gp_q1","icse10_ch6_geometry_problems","Field length = width + 4, area 96. Width?",[c("8"),m("12"),g("6"),e("4")],"x(x+4) = 96.",["x² + 4x − 96 = 0."],"Set up.","medium",ch6),
  Q("icse10_ch6_gp_q2","icse10_ch6_geometry_problems","Diagonal of rectangle 13, length 12. Width?",[c("5"),m("7"),g("3"),e("11")],"Pythagoras.",["13² = 12² + w²."],"Pythagoras.","medium",ch6),
  Q("icse10_ch6_gp_q3","icse10_ch6_geometry_problems","Square side x, area 25. Side?",[c("5"),m("25"),g("2.5"),e("125")],"x² = 25.",["x = 5."],"Square root.","easy",ch6),
  Q("icse10_ch6_gp_q4","icse10_ch6_geometry_problems","Rectangle perimeter 30, area 56. Find dimensions.",[c("7 by 8"),m("5 by 10"),g("Random"),e("None")],"x+y=15, xy=56.",["x² −15x+56=0."],"Set up.","hard",ch6),
  Q("icse10_ch6_gp_q5","icse10_ch6_geometry_problems","Circle radius 7, area?",[c("154"),m("44"),g("22"),e("49")],"πr².",["22/7 × 49 = 154."],"πr².","medium",ch6),
  Q("icse10_ch6_gp_q6","icse10_ch6_geometry_problems","Triangle base 10, height 6, area?",[c("30"),m("60"),g("16"),e("15")],"½bh.",["½×10×6=30."],"½bh.","easy",ch6),
  Q("icse10_ch6_gp_q7","icse10_ch6_geometry_problems","If hypotenuse 25, one leg 7, other?",[c("24"),m("18"),g("32"),e("32.5")],"Pythagoras.",["√(625−49) = √576 = 24."],"Pythagoras.","medium",ch6),
  Q("icse10_ch6_gp_q8","icse10_ch6_geometry_problems","Square + rectangle area combined. Square side x, rect (x)(x+2), total 35. x?",[c("3"),m("5"),g("7"),e("Cannot")],"x² + x(x+2) = 35.",["2x² + 2x − 35 = 0."],"Set up.","hard",ch6),

  // Ch7 ratio_basics
  Q("icse10_ch7_rb_q1","icse10_ch7_ratio_basics","Simplify ratio 6:9.",[c("2:3"),m("3:6"),g("1:3"),e("6:9")],"GCD 3.",["÷3."],"÷ GCD.","easy",ch7),
  Q("icse10_ch7_rb_q2","icse10_ch7_ratio_basics","Ratio of 30 boys to 45 girls?",[c("2:3"),m("3:2"),g("30:45"),e("1:1")],"GCD 15.",["Simplify."],"Simplify.","medium",ch7),
  Q("icse10_ch7_rb_q3","icse10_ch7_ratio_basics","12 cm to 1 m simplified?",[c("3:25"),m("12:1"),g("12:100"),e("1:8")],"Same unit.",["12:100 = 3:25."],"Unit + simplify.","medium",ch7),
  Q("icse10_ch7_rb_q4","icse10_ch7_ratio_basics","Ratio of 3 hrs to 2 days?",[c("1:16"),m("3:2"),g("3:48"),e("1:8")],"3:48 = 1:16.",["Convert days to hrs."],"Same unit.","hard",ch7),
  Q("icse10_ch7_rb_q5","icse10_ch7_ratio_basics","Ratio of squares: side ratio 2:3 → area ratio?",[c("4:9"),m("2:3"),g("8:27"),e("16:81")],"Squared.",["(2:3)² = 4:9."],"Square ratio.","medium",ch7),
  Q("icse10_ch7_rb_q6","icse10_ch7_ratio_basics","Order matters in ratio?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot")],"a:b ≠ b:a.",["Direction-sensitive."],"Yes.","easy",ch7),
  Q("icse10_ch7_rb_q7","icse10_ch7_ratio_basics","Divide 100 in ratio 2:3.",[c("40 and 60"),m("50 and 50"),g("20 and 80"),e("30 and 70")],"Total 5 parts.",["100/5 = 20. × 2 and × 3."],"Total parts.","medium",ch7),
  Q("icse10_ch7_rb_q8","icse10_ch7_ratio_basics","Ratio compares quantities of…",[c("Same kind"),m("Different"),g("Random"),e("Sums")],"Standard rule.",["Both must be similar."],"Same kind.","medium",ch7),
  // Ch7 proportion_properties
  Q("icse10_ch7_pp_q1","icse10_ch7_proportion_properties","If a:b :: c:d, then ad = ?",[c("bc"),m("ab"),g("cd"),e("a + d")],"Cross multiplication.",["Mean × mean = extreme × extreme."],"= bc.","medium",ch7),
  Q("icse10_ch7_pp_q2","icse10_ch7_proportion_properties","Solve 2:5 :: x:15.",[c("6"),m("30"),g("2"),e("10")],"2×15 = 5x.",["x = 6."],"Cross.","medium",ch7),
  Q("icse10_ch7_pp_q3","icse10_ch7_proportion_properties","Invertendo: if a/b = c/d then…",[c("b/a = d/c"),m("a + b = c + d"),g("a − b = c − d"),e("None")],"Invert.",["Reciprocal both sides."],"Invert.","medium",ch7),
  Q("icse10_ch7_pp_q4","icse10_ch7_proportion_properties","Alternendo: if a/b = c/d then…",[c("a/c = b/d"),m("a + c = b + d"),g("Random"),e("None")],"Cross fractions.",["Swap b and c."],"Swap.","hard",ch7),
  Q("icse10_ch7_pp_q5","icse10_ch7_proportion_properties","Componendo: (a+b)/b = ?",[c("(c+d)/d"),m("(c−d)/d"),g("a/b"),e("None")],"Add 1.",["Add denominator on top."],"Add 1.","hard",ch7),
  Q("icse10_ch7_pp_q6","icse10_ch7_proportion_properties","Dividendo: (a−b)/b = ?",[c("(c−d)/d"),m("(c+d)/d"),g("a/c"),e("None")],"Subtract 1.",["Standard."],"Subtract 1.","hard",ch7),
  Q("icse10_ch7_pp_q7","icse10_ch7_proportion_properties","Check 3:4 = 9:12?",[c("Yes (3×12=4×9)"),m("No"),g("Sometimes"),e("Cannot say")],"Cross check.",["3×12=4×9=36."],"Cross.","medium",ch7),
  Q("icse10_ch7_pp_q8","icse10_ch7_proportion_properties","Means of proportion 2:3 :: 4:6?",[c("3 and 4"),m("2 and 6"),g("Random"),e("All four")],"Middle.",["b, c."],"Middle.","medium",ch7),
  // Ch7 continued_proportion
  Q("icse10_ch7_cp_q1","icse10_ch7_continued_proportion","a:b :: b:c means b² = ?",[c("ac"),m("a+c"),g("a−c"),e("a/c")],"Mean prop.",["Standard."],"= ac.","medium",ch7),
  Q("icse10_ch7_cp_q2","icse10_ch7_continued_proportion","Mean proportional of 4 and 9?",[c("6"),m("13"),g("36"),e("5")],"√36.",["b² = 4×9 = 36, b=6."],"√(ac).","medium",ch7),
  Q("icse10_ch7_cp_q3","icse10_ch7_continued_proportion","Mean proportional of 25 and 100?",[c("50"),m("125"),g("75"),e("125")],"√2500.",["√(25×100) = 50."],"√(ac).","medium",ch7),
  Q("icse10_ch7_cp_q4","icse10_ch7_continued_proportion","If 3, x, 27 in continued proportion, x?",[c("9"),m("12"),g("30"),e("6")],"x² = 81.",["x = 9."],"√(ac).","medium",ch7),
  Q("icse10_ch7_cp_q5","icse10_ch7_continued_proportion","If 2, b, 18 in continued proportion, b?",[c("6"),m("9"),g("16"),e("3")],"b² = 36.",["b = 6."],"√(ac).","medium",ch7),
  Q("icse10_ch7_cp_q6","icse10_ch7_continued_proportion","Continued proportion of 4, b, c, 32 with b, c also in same. Find c.",[c("8 (b = √(4×c) etc.)"),m("16"),g("12"),e("64")],"Geometric mean.",["b²=4c, c²=32b."],"Solve.","hard",ch7),
  Q("icse10_ch7_cp_q7","icse10_ch7_continued_proportion","Mean proportional of 9 and 16?",[c("12"),m("25"),g("8"),e("144")],"√144.",["= 12."],"√(ac).","easy",ch7),
  Q("icse10_ch7_cp_q8","icse10_ch7_continued_proportion","Third proportional of 4 and 6?",[c("9"),m("8"),g("10"),e("12")],"a:b :: b:c → 4:6 :: 6:c → c = 9.",["c = b²/a."],"b²/a.","hard",ch7),
  // Ch7 proportion_applications
  Q("icse10_ch7_pa_q1","icse10_ch7_proportion_applications","If 5 books cost ₹150, 8 books?",[c("₹240"),m("₹150"),g("₹120"),e("₹400")],"Proportion.",["5:150 :: 8:x. x=240."],"Cross.","easy",ch7),
  Q("icse10_ch7_pa_q2","icse10_ch7_proportion_applications","If 3 workers take 12 days, 6 workers take?",[c("6 days"),m("24"),g("12"),e("18")],"Inverse proportion.",["Workers × days = constant."],"Inverse.","medium",ch7),
  Q("icse10_ch7_pa_q3","icse10_ch7_proportion_applications","If 4 men complete work in 9 days, 3 men in?",[c("12 days"),m("9"),g("6"),e("15")],"Inverse.",["4×9 = 3×x. x = 12."],"Inverse.","medium",ch7),
  Q("icse10_ch7_pa_q4","icse10_ch7_proportion_applications","Map scale 1:25000. 4 cm on map = ?",[c("1 km"),m("4 km"),g("0.4 km"),e("25 km")],"4 × 25000 = 100000 cm = 1 km.",["Multiply by scale."],"× scale.","hard",ch7),
  Q("icse10_ch7_pa_q5","icse10_ch7_proportion_applications","Mix water and juice 2:3. 50 ml juice → water?",[c("100/3 ml"),m("25"),g("75"),e("100")],"Proportion.",["2:3 :: x:50. x=100/3."],"Cross.","medium",ch7),
  Q("icse10_ch7_pa_q6","icse10_ch7_proportion_applications","Ratio of profits A:B = 3:5. Total profit ₹8000. A's share?",[c("₹3000"),m("₹5000"),g("₹2400"),e("₹1500")],"3/8 of 8000.",["3000."],"Part of total.","medium",ch7),
  Q("icse10_ch7_pa_q7","icse10_ch7_proportion_applications","If 12 men finish work in 18 days, 9 men finish in?",[c("24 days"),m("18"),g("12"),e("16")],"Inverse.",["12×18 = 9×x → x = 24."],"Inverse.","medium",ch7),
  Q("icse10_ch7_pa_q8","icse10_ch7_proportion_applications","Recipe needs 250g flour for 5 servings. For 8 servings?",[c("400g"),m("250"),g("300"),e("500")],"Direct.",["250/5 × 8 = 400."],"Scale up.","easy",ch7),

  // Ch8 remainder_theorem
  Q("icse10_ch8_rt_q1","icse10_ch8_remainder_theorem","Divide p(x) by (x − a), remainder = ?",[c("p(a)"),m("p(−a)"),g("a"),e("0")],"Remainder theorem.",["Substitute x = a."],"= p(a).","medium",ch8),
  Q("icse10_ch8_rt_q2","icse10_ch8_remainder_theorem","Divide x² + 2x + 3 by (x − 1), remainder?",[c("6"),m("0"),g("3"),e("5")],"p(1) = 1+2+3.",["= 6."],"p(a).","medium",ch8),
  Q("icse10_ch8_rt_q3","icse10_ch8_remainder_theorem","Divide x² − 4 by (x + 2)?",[c("0"),m("4"),g("8"),e("−4")],"p(−2) = 4−4 = 0.",["= 0."],"p(−a).","medium",ch8),
  Q("icse10_ch8_rt_q4","icse10_ch8_remainder_theorem","Divide x³ + 3x − 1 by (x − 2)?",[c("13"),m("12"),g("0"),e("3")],"p(2) = 8+6−1.",["= 13."],"p(a).","medium",ch8),
  Q("icse10_ch8_rt_q5","icse10_ch8_remainder_theorem","Why does remainder theorem work?",[c("Long division identity"),m("Random"),g("Magic"),e("Convention")],"Algebraic.",["p(x) = q(x)(x−a) + r → p(a) = r."],"Algebra.","hard",ch8),
  Q("icse10_ch8_rt_q6","icse10_ch8_remainder_theorem","Divide p(x) by (x + a). Plug x = ?",[c("−a"),m("a"),g("0"),e("a²")],"Sign flip.",["x + a = 0 → x = −a."],"−a.","medium",ch8),
  Q("icse10_ch8_rt_q7","icse10_ch8_remainder_theorem","Divide 2x³ − x + 4 by (x − 1)?",[c("5"),m("0"),g("4"),e("3")],"p(1) = 2−1+4.",["= 5."],"p(a).","medium",ch8),
  Q("icse10_ch8_rt_q8","icse10_ch8_remainder_theorem","Divide p(x) by (2x − 1), x = ?",[c("1/2"),m("1"),g("2"),e("−1/2")],"Set 2x − 1 = 0.",["x = 1/2."],"Solve = 0.","hard",ch8),
  // Ch8 factor_theorem
  Q("icse10_ch8_ft_q1","icse10_ch8_factor_theorem","(x − a) is factor of p(x) iff…",[c("p(a) = 0"),m("p(0) = 0"),g("p(a) ≠ 0"),e("Random")],"Standard.",["Plug x=a."],"= 0.","medium",ch8),
  Q("icse10_ch8_ft_q2","icse10_ch8_factor_theorem","Is (x − 2) factor of x² − 5x + 6?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"p(2) = 4−10+6=0.",["= 0 → factor."],"Test p(a).","medium",ch8),
  Q("icse10_ch8_ft_q3","icse10_ch8_factor_theorem","Is (x + 1) factor of x³ + 1?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"p(−1) = −1+1=0.",["= 0."],"Test.","medium",ch8),
  Q("icse10_ch8_ft_q4","icse10_ch8_factor_theorem","Is (x − 3) factor of x² + 5x − 24?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"p(3) = 9+15−24=0.",["= 0."],"Test.","medium",ch8),
  Q("icse10_ch8_ft_q5","icse10_ch8_factor_theorem","If p(a) ≠ 0, then (x − a) is ___",[c("Not a factor"),m("A factor"),g("Sometimes"),e("Random")],"Negation.",["Non-zero remainder → not factor."],"Not factor.","medium",ch8),
  Q("icse10_ch8_ft_q6","icse10_ch8_factor_theorem","p(x) = x² + kx + 4. (x−1) factor. k?",[c("−5"),m("5"),g("0"),e("4")],"p(1) = 1+k+4=0 → k=−5.",["Set = 0, solve."],"Solve for k.","hard",ch8),
  Q("icse10_ch8_ft_q7","icse10_ch8_factor_theorem","Use factor theorem to test rational roots from…",[c("Factors of constant term"),m("Random numbers"),g("Coefficients"),e("Just 1 and −1")],"Rational root theorem.",["Trial constant divisors."],"Const factors.","hard",ch8),
  Q("icse10_ch8_ft_q8","icse10_ch8_factor_theorem","Factors of constant 6 to test: ?",[c("±1, ±2, ±3, ±6"),m("Just positives"),g("Just 1"),e("Random")],"Divisors.",["All ± divisors."],"All divisors.","hard",ch8),
  // Ch8 factorization_cubic
  Q("icse10_ch8_fc_q1","icse10_ch8_factorization_cubic","Factor x³ − 6x² + 11x − 6.",[c("(x−1)(x−2)(x−3)"),m("(x+1)(x+2)(x+3)"),g("Random"),e("(x−6)³")],"Try x=1: 0.",["1−6+11−6=0. Factor out (x−1)."],"Find root, divide.","hard",ch8),
  Q("icse10_ch8_fc_q2","icse10_ch8_factorization_cubic","To factor cubic, first…",[c("Find one rational root"),m("Guess"),g("Random"),e("Just FOIL")],"Standard approach.",["Then divide."],"Find root.","medium",ch8),
  Q("icse10_ch8_fc_q3","icse10_ch8_factorization_cubic","x³ + 1 factors as…",[c("(x+1)(x²−x+1)"),m("(x−1)(x²+x+1)"),g("(x+1)³"),e("Cannot")],"Sum of cubes.",["a³+b³ = (a+b)(a²−ab+b²)."],"Sum cubes.","hard",ch8),
  Q("icse10_ch8_fc_q4","icse10_ch8_factorization_cubic","x³ − 8 factors as…",[c("(x−2)(x²+2x+4)"),m("(x+2)(x²−2x+4)"),g("Random"),e("(x−2)³")],"Diff of cubes.",["a³−b³ = (a−b)(a²+ab+b²)."],"Diff cubes.","hard",ch8),
  Q("icse10_ch8_fc_q5","icse10_ch8_factorization_cubic","Try p(1) = 0: x³ − x² − x + 1. Result?",[c("0 (factor (x−1))"),m("3"),g("−2"),e("4")],"1−1−1+1=0.",["So x=1 is root."],"Test x=1.","medium",ch8),
  Q("icse10_ch8_fc_q6","icse10_ch8_factorization_cubic","Cubic has at most ___ rational roots.",[c("3"),m("2"),g("1"),e("Infinite")],"Degree.",["Degree = max roots."],"3.","easy",ch8),
  Q("icse10_ch8_fc_q7","icse10_ch8_factorization_cubic","Cubic always has at least 1 ___ root.",[c("Real"),m("Rational"),g("Complex"),e("Integer")],"Property.",["Continuous polynomial crosses x-axis."],"Real.","hard",ch8),
  Q("icse10_ch8_fc_q8","icse10_ch8_factorization_cubic","Factor x³ + 6x² + 11x + 6.",[c("(x+1)(x+2)(x+3)"),m("(x−1)(x−2)(x−3)"),g("Random"),e("(x+6)³")],"Try −1.",["p(−1)=0. Then divide."],"Find root.","hard",ch8),
  // Ch8 polynomial_division
  Q("icse10_ch8_pd_q1","icse10_ch8_polynomial_division","Divide x² + 3x + 2 by (x + 1). Quotient?",[c("x + 2"),m("x + 1"),g("x + 3"),e("x²")],"Long division.",["Result x+2, remainder 0."],"Long division.","medium",ch8),
  Q("icse10_ch8_pd_q2","icse10_ch8_polynomial_division","Dividend = quotient × divisor + ?",[c("Remainder"),m("0"),g("Random"),e("Quotient")],"Standard.",["Division algorithm."],"+ remainder.","easy",ch8),
  Q("icse10_ch8_pd_q3","icse10_ch8_polynomial_division","Divide x² − 1 by (x − 1).",[c("x + 1 (no remainder)"),m("x − 1"),g("x"),e("Random")],"Diff squares.",["(x−1)(x+1) = x²−1."],"Factor.","medium",ch8),
  Q("icse10_ch8_pd_q4","icse10_ch8_polynomial_division","Divide x³ + 2x² − x − 2 by (x + 2).",[c("x² − 1"),m("x + 1"),g("x² + 1"),e("Random")],"Synthetic.",["Quotient x² − 1, rem 0."],"Synthetic.","hard",ch8),
  Q("icse10_ch8_pd_q5","icse10_ch8_polynomial_division","Long division: align terms by…",[c("Degree"),m("Random"),g("Alphabet"),e("Coefficient")],"Order.",["Highest degree first."],"Degree.","medium",ch8),
  Q("icse10_ch8_pd_q6","icse10_ch8_polynomial_division","Quotient of (x³ − 1) ÷ (x − 1)?",[c("x² + x + 1"),m("x² − x + 1"),g("x²"),e("Random")],"Diff cubes.",["x³−1 = (x−1)(x²+x+1)."],"Cubes.","hard",ch8),
  Q("icse10_ch8_pd_q7","icse10_ch8_polynomial_division","Synthetic division uses…",[c("Only coefficients"),m("Full terms"),g("Just constants"),e("Random")],"Simplified.",["Faster method."],"Coeffs.","hard",ch8),
  Q("icse10_ch8_pd_q8","icse10_ch8_polynomial_division","Divide 2x² + 5x + 3 by (x + 1).",[c("2x + 3"),m("2x"),g("x + 3"),e("Random")],"Standard.",["Quotient 2x+3."],"Long div.","hard",ch8),

  // Ch9 matrix_basics
  Q("icse10_ch9_mb_q1","icse10_ch9_matrix_basics","Matrix order m × n means…",[c("m rows, n columns"),m("Reverse"),g("Sum"),e("Multiplication")],"Standard.",["Rows × cols."],"Rows × cols.","easy",ch9),
  Q("icse10_ch9_mb_q2","icse10_ch9_matrix_basics","[[1,2],[3,4]] order?",[c("2 × 2"),m("1 × 4"),g("4 × 1"),e("2 × 4")],"2 rows, 2 cols.",["Count rows and cols."],"Count.","easy",ch9),
  Q("icse10_ch9_mb_q3","icse10_ch9_matrix_basics","Element a₁₂ in [[1,2],[3,4]]?",[c("2"),m("3"),g("1"),e("4")],"Row 1, col 2.",["a_ij."],"Position.","medium",ch9),
  Q("icse10_ch9_mb_q4","icse10_ch9_matrix_basics","Square matrix has…",[c("Equal rows and cols"),m("More rows"),g("More cols"),e("Random")],"Equal.",["m = n."],"Square.","medium",ch9),
  Q("icse10_ch9_mb_q5","icse10_ch9_matrix_basics","Identity matrix I₂?",[c("[[1,0],[0,1]]"),m("[[1,1],[1,1]]"),g("[[0,0],[0,0]]"),e("Random")],"Diagonal 1s.",["Standard 2×2 I."],"Diagonal.","medium",ch9),
  Q("icse10_ch9_mb_q6","icse10_ch9_matrix_basics","Zero matrix has…",[c("All zeros"),m("Diagonal zeros"),g("Random"),e("All ones")],"Zero everywhere.",["All elements 0."],"All zeros.","easy",ch9),
  Q("icse10_ch9_mb_q7","icse10_ch9_matrix_basics","Row matrix has __ row.",[c("1"),m("2"),g("Many"),e("0")],"Single row.",["1 × n."],"1.","easy",ch9),
  Q("icse10_ch9_mb_q8","icse10_ch9_matrix_basics","Column matrix has __ column.",[c("1"),m("2"),g("Many"),e("0")],"Single col.",["m × 1."],"1.","easy",ch9),
  // Ch9 matrix_operations
  Q("icse10_ch9_mo_q1","icse10_ch9_matrix_operations","Addition requires…",[c("Same order"),m("Same elements"),g("Always works"),e("Random")],"Standard.",["Same dimensions."],"Same order.","medium",ch9),
  Q("icse10_ch9_mo_q2","icse10_ch9_matrix_operations","[[1,2]] + [[3,4]] = ?",[c("[[4,6]]"),m("[[1,2,3,4]]"),g("[[3,8]]"),e("Random")],"Element-wise.",["Add corresponding."],"Element-wise.","easy",ch9),
  Q("icse10_ch9_mo_q3","icse10_ch9_matrix_operations","[[1,2],[3,4]] + [[5,6],[7,8]] = ?",[c("[[6,8],[10,12]]"),m("[[5,8],[12,16]]"),g("Random"),e("[[5,6,7,8]]")],"Element-wise.",["Add each."],"Element-wise.","medium",ch9),
  Q("icse10_ch9_mo_q4","icse10_ch9_matrix_operations","Subtraction is also…",[c("Element-wise"),m("Random"),g("Multiply"),e("Cannot subtract")],"Like addition.",["Same order, subtract elements."],"Element-wise.","easy",ch9),
  Q("icse10_ch9_mo_q5","icse10_ch9_matrix_operations","Scalar multiplication: 2 × [[1,2],[3,4]] = ?",[c("[[2,4],[6,8]]"),m("[[2,2],[3,4]]"),g("Random"),e("[[1,2,3,4]]")],"Multiply each.",["Each element × 2."],"Each × scalar.","medium",ch9),
  Q("icse10_ch9_mo_q6","icse10_ch9_matrix_operations","Can you add [[1,2]] and [[1,2,3]]?",[e("Yes"),c("No (different order)"),m("Sometimes"),g("Cannot say")],"Different order.",["1×2 vs 1×3."],"Same order required.","medium",ch9),
  Q("icse10_ch9_mo_q7","icse10_ch9_matrix_operations","[[1,2],[3,4]] − [[1,2],[3,4]] = ?",[c("Zero matrix"),m("[[1,2],[3,4]]"),g("Identity"),e("Random")],"All zeros.",["Each subtracts to 0."],"Zero matrix.","medium",ch9),
  Q("icse10_ch9_mo_q8","icse10_ch9_matrix_operations","Matrix addition is commutative?",[c("Yes (A+B = B+A)"),m("No"),g("Sometimes"),e("Random")],"Like numbers.",["Order doesn't matter."],"Commutative.","medium",ch9),
  // Ch9 matrix_multiplication
  Q("icse10_ch9_mm_q1","icse10_ch9_matrix_multiplication","To multiply A × B, columns of A = ?",[c("Rows of B"),m("Cols of B"),g("Random"),e("Same order")],"Standard rule.",["m × n × n × p = m × p."],"Match dims.","medium",ch9),
  Q("icse10_ch9_mm_q2","icse10_ch9_matrix_multiplication","Multiplication is commutative?",[e("Yes"),c("No (in general)"),m("Always"),g("Random")],"Order matters.",["AB ≠ BA usually."],"Not commutative.","medium",ch9),
  Q("icse10_ch9_mm_q3","icse10_ch9_matrix_multiplication","[[1,2]] × [[3],[4]] = ?",[c("[[11]]"),m("[[3,8]]"),g("Random"),e("[[12]]")],"1×3 + 2×4 = 11.",["Row × column dot."],"Dot product.","medium",ch9),
  Q("icse10_ch9_mm_q4","icse10_ch9_matrix_multiplication","Result of (m×n)(n×p)?",[c("m × p"),m("n × m"),g("m × n"),e("p × p")],"Inner dims cancel.",["Outer = result."],"Outer dims.","hard",ch9),
  Q("icse10_ch9_mm_q5","icse10_ch9_matrix_multiplication","[[1,0],[0,1]] × [[2,3],[4,5]] = ?",[c("[[2,3],[4,5]]"),m("Zero"),g("Random"),e("[[1,0],[0,1]]")],"Identity preserves.",["I × A = A."],"Identity.","medium",ch9),
  Q("icse10_ch9_mm_q6","icse10_ch9_matrix_multiplication","Can (2×3)(3×2) be multiplied?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"Inner dims match.",["3 = 3."],"Yes.","easy",ch9),
  Q("icse10_ch9_mm_q7","icse10_ch9_matrix_multiplication","Can (2×3)(2×3) be multiplied?",[e("Yes"),c("No (inner dims 3 ≠ 2)"),m("Sometimes"),g("Cannot say")],"Doesn't match.",["3 ≠ 2."],"No.","medium",ch9),
  Q("icse10_ch9_mm_q8","icse10_ch9_matrix_multiplication","[[1,2],[3,4]] × [[1,0],[0,1]] = ?",[c("[[1,2],[3,4]]"),m("Identity"),g("Zero"),e("Random")],"A × I = A.",["Identity property."],"= A.","medium",ch9),
  // Ch9 matrix_determinant
  Q("icse10_ch9_md_q1","icse10_ch9_matrix_determinant","Det of [[a,b],[c,d]] = ?",[c("ad − bc"),m("ad + bc"),g("ab − cd"),e("a + b + c + d")],"Standard.",["Cross subtract."],"ad − bc.","medium",ch9),
  Q("icse10_ch9_md_q2","icse10_ch9_matrix_determinant","Det of [[1,2],[3,4]]?",[c("−2"),m("2"),g("10"),e("4")],"4 − 6.",["= −2."],"ad − bc.","easy",ch9),
  Q("icse10_ch9_md_q3","icse10_ch9_matrix_determinant","Det of identity I₂?",[c("1"),m("0"),g("2"),e("Random")],"1 − 0.",["= 1."],"= 1.","easy",ch9),
  Q("icse10_ch9_md_q4","icse10_ch9_matrix_determinant","Det of zero matrix?",[c("0"),m("1"),g("Undefined"),e("Random")],"0 − 0.",["= 0."],"= 0.","easy",ch9),
  Q("icse10_ch9_md_q5","icse10_ch9_matrix_determinant","Det of [[2,3],[4,6]]?",[c("0"),m("12"),g("24"),e("18")],"12 − 12.",["= 0."],"ad − bc.","medium",ch9),
  Q("icse10_ch9_md_q6","icse10_ch9_matrix_determinant","Det = 0 means matrix is…",[c("Singular (no inverse)"),m("Invertible"),g("Zero"),e("Random")],"Singularity.",["No inverse."],"Singular.","hard",ch9),
  Q("icse10_ch9_md_q7","icse10_ch9_matrix_determinant","Det of [[5,2],[3,1]]?",[c("−1"),m("1"),g("13"),e("11")],"5 − 6.",["= −1."],"ad − bc.","medium",ch9),
  Q("icse10_ch9_md_q8","icse10_ch9_matrix_determinant","If det ≠ 0, matrix has…",[c("Inverse"),m("No inverse"),g("Random"),e("Zero")],"Non-singular.",["Inverse exists."],"Inverse.","hard",ch9),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} ICSE Class 10 questions (Ch5-9).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
