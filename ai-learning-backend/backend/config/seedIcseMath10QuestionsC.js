/** ICSE Class 10 Math — Questions Ch10-14 (AP, GP, Reflection, Section/Midpoint, Line Equation) */
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
const ch10="Arithmetic Progression", ch11="Geometric Progression", ch12="Reflection", ch13="Section and Mid-Point Formula", ch14="Equation of a Line";

const questions = [
  // Ch10 ap_intro
  Q("icse10_ch10_ai_q1","icse10_ch10_ap_intro","AP common difference of 2, 5, 8, 11?",[c("3"),m("2"),g("5"),e("8")],"5−2.",["Constant +3."],"=3.","easy",ch10),
  Q("icse10_ch10_ai_q2","icse10_ch10_ap_intro","First term of AP 7, 10, 13, 16?",[c("7"),m("3"),g("10"),e("16")],"a₁.",["First listed."],"7.","easy",ch10),
  Q("icse10_ch10_ai_q3","icse10_ch10_ap_intro","Is 1, 4, 7, 10 an AP?",[c("Yes (d=3)"),m("No"),g("Sometimes"),e("Cannot say")],"Constant diff.",["+3 each."],"Yes.","easy",ch10),
  Q("icse10_ch10_ai_q4","icse10_ch10_ap_intro","Is 2, 4, 8, 16 an AP?",[e("Yes"),c("No (it's GP)"),m("Sometimes"),g("Cannot say")],"Ratio not diff constant.",["Ratio 2."],"GP.","medium",ch10),
  Q("icse10_ch10_ai_q5","icse10_ch10_ap_intro","Constant difference is called…",[c("Common difference d"),m("Common ratio"),g("Mean"),e("Median")],"AP terminology.",["d."],"d.","easy",ch10),
  Q("icse10_ch10_ai_q6","icse10_ch10_ap_intro","If first 3 terms of AP: 4, 7, 10. Next?",[c("13"),m("11"),g("12"),e("14")],"+3.",["10 + 3."],"+ d.","easy",ch10),
  Q("icse10_ch10_ai_q7","icse10_ch10_ap_intro","If a=5, d=−2, AP?",[c("5, 3, 1, −1, ..."),m("5, 7, 9, ..."),g("5, 3, 7, ..."),e("Random")],"Subtract 2.",["5, 5−2, ..."],"a, a+d, ...","medium",ch10),
  Q("icse10_ch10_ai_q8","icse10_ch10_ap_intro","Common difference of constant sequence 5, 5, 5?",[c("0"),m("5"),g("1"),e("Undefined")],"5−5.",["d=0."],"= 0.","medium",ch10),
  // Ch10 ap_nth_term
  Q("icse10_ch10_an_q1","icse10_ch10_ap_nth_term","nth term formula:",[c("a + (n−1)d"),m("a + nd"),g("a × n"),e("a^n")],"Standard.",["Tn = a+(n−1)d."],"a+(n−1)d.","medium",ch10),
  Q("icse10_ch10_an_q2","icse10_ch10_ap_nth_term","Find T₁₀ of 2, 5, 8, ...",[c("29"),m("32"),g("27"),e("30")],"2 + 9×3.",["= 29."],"Apply.","medium",ch10),
  Q("icse10_ch10_an_q3","icse10_ch10_ap_nth_term","Find T₅ of 7, 10, 13, ...",[c("19"),m("22"),g("16"),e("25")],"7 + 4×3.",["= 19."],"Apply.","medium",ch10),
  Q("icse10_ch10_an_q4","icse10_ch10_ap_nth_term","If a=3, d=2, T₂₀?",[c("41"),m("43"),g("40"),e("39")],"3 + 19×2.",["= 41."],"Apply.","medium",ch10),
  Q("icse10_ch10_an_q5","icse10_ch10_ap_nth_term","Find d if a=5, T₁₀=23.",[c("2"),m("3"),g("1"),e("4")],"23 = 5 + 9d.",["d = 2."],"Solve.","medium",ch10),
  Q("icse10_ch10_an_q6","icse10_ch10_ap_nth_term","Find a if T₅=11, d=2.",[c("3"),m("1"),g("5"),e("7")],"11 = a + 4×2.",["a = 3."],"Solve.","medium",ch10),
  Q("icse10_ch10_an_q7","icse10_ch10_ap_nth_term","Find n if a=2, d=3, Tn=29.",[c("10"),m("9"),g("11"),e("8")],"29 = 2 + (n−1)×3.",["n=10."],"Solve.","medium",ch10),
  Q("icse10_ch10_an_q8","icse10_ch10_ap_nth_term","T₁₀ of AP with first term 0, d=4?",[c("36"),m("40"),g("4"),e("44")],"0 + 9×4.",["= 36."],"Apply.","easy",ch10),
  // Ch10 ap_sum
  Q("icse10_ch10_as_q1","icse10_ch10_ap_sum","Sum formula: Sn = ?",[c("n/2 × (2a + (n−1)d)"),m("n × a"),g("a × n"),e("a + nd")],"Standard.",["AP sum formula."],"n/2(2a + (n-1)d).","medium",ch10),
  Q("icse10_ch10_as_q2","icse10_ch10_ap_sum","S₁₀ of 2, 5, 8, ...",[c("155"),m("145"),g("100"),e("200")],"10/2 × (4 + 27).",["= 155."],"Apply.","medium",ch10),
  Q("icse10_ch10_as_q3","icse10_ch10_ap_sum","Sum of first 100 natural numbers?",[c("5050"),m("4950"),g("5000"),e("100")],"100/2 × 101.",["n(n+1)/2."],"= 5050.","medium",ch10),
  Q("icse10_ch10_as_q4","icse10_ch10_ap_sum","Alternative form: Sn = ?",[c("n/2 × (a + l), l = last term"),m("Random"),g("n × a × l"),e("a + l")],"Useful form.",["With first and last."],"n/2(a+l).","medium",ch10),
  Q("icse10_ch10_as_q5","icse10_ch10_ap_sum","S₅ of 3, 6, 9, 12, 15?",[c("45"),m("40"),g("50"),e("60")],"5/2 × (3+15).",["= 45."],"n/2(a+l).","medium",ch10),
  Q("icse10_ch10_as_q6","icse10_ch10_ap_sum","Sum of first 20 odd numbers (1, 3, 5, ...)?",[c("400"),m("210"),g("100"),e("361")],"20² = 400.",["Sum odds = n²."],"= n².","hard",ch10),
  Q("icse10_ch10_as_q7","icse10_ch10_ap_sum","S₆ of 5, 10, 15, ...?",[c("105"),m("90"),g("120"),e("150")],"6/2 × (5+30).",["= 105."],"Apply.","medium",ch10),
  Q("icse10_ch10_as_q8","icse10_ch10_ap_sum","If a=2, d=4, S₁₀?",[c("200"),m("180"),g("220"),e("250")],"10/2 × (4 + 36).",["= 200."],"Apply.","medium",ch10),
  // Ch10 ap_applications
  Q("icse10_ch10_aa_q1","icse10_ch10_ap_applications","Salary ₹10000 + ₹500/yr increment. 5th year salary?",[c("₹12000"),m("₹12500"),g("₹15000"),e("₹10000")],"10000 + 4×500.",["= 12000."],"Apply.","medium",ch10),
  Q("icse10_ch10_aa_q2","icse10_ch10_ap_applications","Save ₹100 1st month, +₹50 each month. Total after 12 months?",[c("₹4500"),m("₹3000"),g("₹1200"),e("₹2400")],"S₁₂ = 12/2 × (200 + 550) = 4500.",["Apply sum."],"Sum.","hard",ch10),
  Q("icse10_ch10_aa_q3","icse10_ch10_ap_applications","Stack pattern: row 1 has 1, row 2 has 2, ... How many in 10 rows total?",[c("55"),m("100"),g("50"),e("45")],"Sum of 1-10.",["n(n+1)/2 = 55."],"Triangular.","medium",ch10),
  Q("icse10_ch10_aa_q4","icse10_ch10_ap_applications","Distance d=10+5(t−1) for time t. At t=5, distance?",[c("30"),m("25"),g("35"),e("50")],"10 + 4×5.",["= 30."],"Apply.","medium",ch10),
  Q("icse10_ch10_aa_q5","icse10_ch10_ap_applications","Find a, d for sequence: T₃=11, T₇=27.",[c("a=3, d=4"),m("a=3, d=2"),g("a=4, d=3"),e("a=11, d=4")],"Solve two equations.",["T₃=a+2d=11, T₇=a+6d=27. Solve."],"Two eqns.","hard",ch10),
  Q("icse10_ch10_aa_q6","icse10_ch10_ap_applications","Increment-based salary problems use…",[c("AP"),m("GP"),g("Random"),e("None")],"Linear growth.",["Constant difference."],"AP.","medium",ch10),
  Q("icse10_ch10_aa_q7","icse10_ch10_ap_applications","Sum of first n natural numbers?",[c("n(n+1)/2"),m("n²"),g("n × 2"),e("n + 1")],"Triangular number formula.",["Standard."],"n(n+1)/2.","medium",ch10),
  Q("icse10_ch10_aa_q8","icse10_ch10_ap_applications","If common difference is 0, AP is…",[c("Constant sequence"),m("Random"),g("GP"),e("Cannot exist")],"Same value.",["Sequence repeats."],"Constant.","medium",ch10),

  // Ch11 gp_intro
  Q("icse10_ch11_gi_q1","icse10_ch11_gp_intro","GP common ratio of 2, 6, 18, 54?",[c("3"),m("2"),g("4"),e("12")],"6/2.",["Constant ratio."],"= 3.","easy",ch11),
  Q("icse10_ch11_gi_q2","icse10_ch11_gp_intro","First term of GP 5, 15, 45, 135?",[c("5"),m("3"),g("15"),e("135")],"a₁.",["First listed."],"5.","easy",ch11),
  Q("icse10_ch11_gi_q3","icse10_ch11_gp_intro","Is 1, 3, 9, 27 a GP?",[c("Yes (r=3)"),m("No"),g("Sometimes"),e("Cannot say")],"Ratio constant.",["×3 each."],"Yes.","easy",ch11),
  Q("icse10_ch11_gi_q4","icse10_ch11_gp_intro","Is 2, 4, 6, 8 a GP?",[e("Yes"),c("No (it's AP)"),m("Sometimes"),g("Cannot say")],"Constant diff.",["AP, d=2."],"AP.","medium",ch11),
  Q("icse10_ch11_gi_q5","icse10_ch11_gp_intro","Common ratio called…",[c("r"),m("d"),g("Common diff"),e("Mean")],"GP terminology.",["r."],"r.","easy",ch11),
  Q("icse10_ch11_gi_q6","icse10_ch11_gp_intro","If a=2, r=2, GP?",[c("2, 4, 8, 16, ..."),m("2, 4, 6, 8, ..."),g("Random"),e("2, 4, 5, 6")],"× 2.",["Multiply by 2."],"× r.","medium",ch11),
  Q("icse10_ch11_gi_q7","icse10_ch11_gp_intro","GP can have negative r?",[c("Yes (alternating signs)"),m("No"),g("Sometimes"),e("Cannot say")],"Possible.",["e.g., 1, −2, 4, −8, ..."],"Yes.","medium",ch11),
  Q("icse10_ch11_gi_q8","icse10_ch11_gp_intro","If r=1, GP is…",[c("Constant"),m("AP"),g("Different"),e("Empty")],"Like AP d=0.",["All same."],"Constant.","medium",ch11),
  // Ch11 gp_nth_term
  Q("icse10_ch11_gn_q1","icse10_ch11_gp_nth_term","nth term: Tn = ?",[c("a × r^(n−1)"),m("a + nd"),g("ar"),e("a^n")],"Standard.",["Tn = ar^(n-1)."],"ar^(n-1).","medium",ch11),
  Q("icse10_ch11_gn_q2","icse10_ch11_gp_nth_term","T₅ of 2, 6, 18, ..?",[c("162"),m("54"),g("82"),e("162")],"2 × 3⁴ = 2×81.",["= 162."],"Apply.","medium",ch11),
  Q("icse10_ch11_gn_q3","icse10_ch11_gp_nth_term","T₄ of 5, 10, 20, ..?",[c("40"),m("20"),g("80"),e("100")],"5 × 2³.",["= 40."],"Apply.","medium",ch11),
  Q("icse10_ch11_gn_q4","icse10_ch11_gp_nth_term","Find r if T₃=12, a=3.",[c("2"),m("4"),g("6"),e("3")],"12 = 3 × r².",["r² = 4 → r = 2."],"Solve.","medium",ch11),
  Q("icse10_ch11_gn_q5","icse10_ch11_gp_nth_term","T₁₀ of GP 1, 2, 4, ...?",[c("512"),m("256"),g("1024"),e("128")],"1 × 2⁹.",["= 512."],"Apply.","hard",ch11),
  Q("icse10_ch11_gn_q6","icse10_ch11_gp_nth_term","If r=½, a=8, T₄?",[c("1"),m("2"),g("0.5"),e("16")],"8 × (1/2)³.",["= 1."],"Apply.","medium",ch11),
  Q("icse10_ch11_gn_q7","icse10_ch11_gp_nth_term","Find a if T₅=80, r=2.",[c("5"),m("10"),g("40"),e("4")],"80 = a × 2⁴ = 16a.",["a = 5."],"Solve.","medium",ch11),
  Q("icse10_ch11_gn_q8","icse10_ch11_gp_nth_term","T₃ of GP 4, −8, 16?",[c("16"),m("32"),g("-32"),e("−16")],"4 × (−2)² = 16.",["= 16."],"Apply.","medium",ch11),
  // Ch11 gp_sum
  Q("icse10_ch11_gs_q1","icse10_ch11_gp_sum","Sum: Sn = ?",[c("a(r^n − 1)/(r − 1) for r≠1"),m("n × a"),g("a × n"),e("ar")],"Standard.",["GP sum formula."],"a(r^n-1)/(r-1).","medium",ch11),
  Q("icse10_ch11_gs_q2","icse10_ch11_gp_sum","S₄ of 2, 6, 18, 54?",[c("80"),m("78"),g("160"),e("100")],"2(81−1)/2.",["= 80."],"Apply.","medium",ch11),
  Q("icse10_ch11_gs_q3","icse10_ch11_gp_sum","S₅ of 1, 2, 4, ...?",[c("31"),m("16"),g("32"),e("63")],"(2⁵−1) = 31.",["= 31."],"Apply.","medium",ch11),
  Q("icse10_ch11_gs_q4","icse10_ch11_gp_sum","If r=1, Sn = ?",[c("na"),m("a"),g("a²"),e("Undefined")],"All equal.",["n times a."],"= na.","medium",ch11),
  Q("icse10_ch11_gs_q5","icse10_ch11_gp_sum","S₃ of 4, 12, 36?",[c("52"),m("48"),g("60"),e("100")],"4(27−1)/2.",["= 52."],"Apply.","medium",ch11),
  Q("icse10_ch11_gs_q6","icse10_ch11_gp_sum","Sum of GP with r<1 (infinite)?",[c("a/(1−r) if |r|<1"),m("Infinite"),g("Undefined"),e("Random")],"Convergent.",["Infinite sum formula."],"a/(1-r).","hard",ch11),
  Q("icse10_ch11_gs_q7","icse10_ch11_gp_sum","Sum of 1 + ½ + ¼ + ... (infinite)?",[c("2"),m("1"),g("Infinity"),e("0.5")],"a/(1-r) = 1/(1/2).",["= 2."],"a/(1-r).","hard",ch11),
  Q("icse10_ch11_gs_q8","icse10_ch11_gp_sum","S₂ of 3, 6, 12?",[c("9"),m("12"),g("18"),e("6")],"3 + 6.",["First 2 terms."],"Sum first 2.","easy",ch11),
  // Ch11 gp_applications
  Q("icse10_ch11_ga_q1","icse10_ch11_gp_applications","Compound interest follows…",[c("GP"),m("AP"),g("Random"),e("Linear")],"Multiplicative growth.",["× (1+r) each period."],"GP.","medium",ch11),
  Q("icse10_ch11_ga_q2","icse10_ch11_gp_applications","Bacteria double every hour, start 100. After 5 hours?",[c("3200"),m("500"),g("1600"),e("6400")],"100 × 2⁵.",["= 3200."],"GP.","medium",ch11),
  Q("icse10_ch11_ga_q3","icse10_ch11_gp_applications","Population grows 10% yearly, 1000. After 3 years?",[c("1331"),m("1300"),g("1100"),e("3000")],"1000 × 1.1³.",["= 1331."],"GP CI.","hard",ch11),
  Q("icse10_ch11_ga_q4","icse10_ch11_gp_applications","Half-life decay is…",[c("GP with r=½"),m("AP"),g("Random"),e("Linear")],"Multiplicative decay.",["Each period halves."],"GP r=½.","medium",ch11),
  Q("icse10_ch11_ga_q5","icse10_ch11_gp_applications","Investment ₹1000 at 8% CI yearly. After 2 years?",[c("₹1166.40"),m("₹1160"),g("₹1080"),e("₹1080.64")],"1000 × 1.08².",["= 1166.40."],"CI formula.","hard",ch11),
  Q("icse10_ch11_ga_q6","icse10_ch11_gp_applications","Chess problem (doubling rice on squares) gives GP with r=…",[c("2"),m("3"),g("1"),e("64")],"Doubling.",["Classic problem."],"r = 2.","hard",ch11),
  Q("icse10_ch11_ga_q7","icse10_ch11_gp_applications","Population shrinks 5% yearly, 10000. After 2 years?",[c("9025"),m("9000"),g("9500"),e("8500")],"10000 × 0.95².",["= 9025."],"GP shrink.","hard",ch11),
  Q("icse10_ch11_ga_q8","icse10_ch11_gp_applications","Exponential growth is modeled by…",[c("GP"),m("AP"),g("Constant"),e("Random")],"Multiplicative.",["Constant factor each step."],"GP.","easy",ch11),

  // Ch12 reflection_x_axis
  Q("icse10_ch12_rx_q1","icse10_ch12_reflection_x_axis","(3, 4) reflected in x-axis?",[c("(3, −4)"),m("(−3, 4)"),g("(−3, −4)"),e("(4, 3)")],"y flips.",["Keep x, negate y."],"Negate y.","easy",ch12),
  Q("icse10_ch12_rx_q2","icse10_ch12_reflection_x_axis","(−2, 5) reflected in x-axis?",[c("(−2, −5)"),m("(2, 5)"),g("(2, −5)"),e("(−2, 5)")],"Negate y only.",["Keep x = −2, y = −5."],"Negate y.","easy",ch12),
  Q("icse10_ch12_rx_q3","icse10_ch12_reflection_x_axis","x-axis reflection of (0, 4)?",[c("(0, −4)"),m("(0, 4)"),g("(4, 0)"),e("(−4, 0)")],"Negate y.",["(0, −4)."],"Negate y.","easy",ch12),
  Q("icse10_ch12_rx_q4","icse10_ch12_reflection_x_axis","Point on x-axis reflected stays…",[c("Same"),m("Negated"),g("Random"),e("Origin")],"y=0 invariant.",["Reflected onto itself."],"Same.","medium",ch12),
  Q("icse10_ch12_rx_q5","icse10_ch12_reflection_x_axis","If (a, b) reflects to (a, −3), b = ?",[c("3"),m("−3"),g("0"),e("Random")],"b = −(−3).",["= 3."],"Negate.","medium",ch12),
  Q("icse10_ch12_rx_q6","icse10_ch12_reflection_x_axis","x-axis reflection: y becomes…",[c("Negative of y"),m("Same"),g("Zero"),e("Random")],"y flips.",["y → −y."],"−y.","easy",ch12),
  Q("icse10_ch12_rx_q7","icse10_ch12_reflection_x_axis","x-axis reflection of (a, 0)?",[c("(a, 0)"),m("(0, 0)"),g("(−a, 0)"),e("(0, a)")],"Invariant.",["Same point."],"Same.","medium",ch12),
  Q("icse10_ch12_rx_q8","icse10_ch12_reflection_x_axis","Reflecting (5, −3) in x-axis?",[c("(5, 3)"),m("(−5, 3)"),g("(−5, −3)"),e("(5, −3)")],"Negate.",["−(−3) = 3."],"Negate y.","easy",ch12),
  // Ch12 reflection_y_axis
  Q("icse10_ch12_ry_q1","icse10_ch12_reflection_y_axis","(3, 4) reflected in y-axis?",[c("(−3, 4)"),m("(3, −4)"),g("(−3, −4)"),e("(4, 3)")],"x flips.",["Negate x."],"Negate x.","easy",ch12),
  Q("icse10_ch12_ry_q2","icse10_ch12_reflection_y_axis","(−2, 5) reflected in y-axis?",[c("(2, 5)"),m("(−2, −5)"),g("(2, −5)"),e("(−2, 5)")],"x flips.",["−(−2) = 2."],"Negate x.","easy",ch12),
  Q("icse10_ch12_ry_q3","icse10_ch12_reflection_y_axis","y-axis reflection of (4, 0)?",[c("(−4, 0)"),m("(4, 0)"),g("(0, 4)"),e("(0, −4)")],"x flips.",["(−4, 0)."],"Negate x.","easy",ch12),
  Q("icse10_ch12_ry_q4","icse10_ch12_reflection_y_axis","Points on y-axis stay…",[c("Same"),m("Negated"),g("Random"),e("Origin")],"Invariant.",["x = 0 invariant."],"Same.","medium",ch12),
  Q("icse10_ch12_ry_q5","icse10_ch12_reflection_y_axis","y-axis: x becomes…",[c("Negative"),m("Same"),g("Zero"),e("Random")],"x flips.",["x → −x."],"−x.","easy",ch12),
  Q("icse10_ch12_ry_q6","icse10_ch12_reflection_y_axis","y-axis reflection of (0, 5)?",[c("(0, 5)"),m("(0, −5)"),g("(5, 0)"),e("(−5, 0)")],"Invariant.",["x=0 stays."],"Same.","medium",ch12),
  Q("icse10_ch12_ry_q7","icse10_ch12_reflection_y_axis","If (a, b) reflects to (−4, b), a = ?",[c("4"),m("−4"),g("0"),e("Random")],"a = 4.",["a → −a, so a was 4."],"Negate.","medium",ch12),
  Q("icse10_ch12_ry_q8","icse10_ch12_reflection_y_axis","Reflect (−7, −2) in y-axis.",[c("(7, −2)"),m("(7, 2)"),g("(−7, 2)"),e("(−2, −7)")],"x flips.",["(7, −2)."],"Negate x.","easy",ch12),
  // Ch12 reflection_origin
  Q("icse10_ch12_ro_q1","icse10_ch12_reflection_origin","(3, 4) reflected in origin?",[c("(−3, −4)"),m("(3, −4)"),g("(−3, 4)"),e("(0, 0)")],"Both flip.",["Negate both."],"Both negate.","easy",ch12),
  Q("icse10_ch12_ro_q2","icse10_ch12_reflection_origin","Origin reflection of (a, b)?",[c("(−a, −b)"),m("(a, −b)"),g("(−a, b)"),e("(0, 0)")],"Both negate.",["Standard."],"Negate both.","easy",ch12),
  Q("icse10_ch12_ro_q3","icse10_ch12_reflection_origin","Origin reflection of (5, −2)?",[c("(−5, 2)"),m("(5, 2)"),g("(−5, −2)"),e("(0, 0)")],"Both flip.",["−5, +2."],"Negate.","easy",ch12),
  Q("icse10_ch12_ro_q4","icse10_ch12_reflection_origin","Only (0, 0) invariant under origin reflection?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"Only origin.",["Origin maps to itself."],"Yes.","medium",ch12),
  Q("icse10_ch12_ro_q5","icse10_ch12_reflection_origin","Origin reflection of (−1, 1)?",[c("(1, −1)"),m("(1, 1)"),g("(−1, −1)"),e("(0, 0)")],"Both flip.",["Negate."],"Negate both.","easy",ch12),
  Q("icse10_ch12_ro_q6","icse10_ch12_reflection_origin","Origin reflection equivalent to…",[c("180° rotation"),m("90°"),g("270°"),e("Mirror in x")],"Half-turn.",["Point symmetry."],"180° rotation.","medium",ch12),
  Q("icse10_ch12_ro_q7","icse10_ch12_reflection_origin","Origin reflection of (a, 0)?",[c("(−a, 0)"),m("(a, 0)"),g("(0, a)"),e("(0, −a)")],"x flips, y stays 0.",["(−a, 0)."],"Negate.","easy",ch12),
  Q("icse10_ch12_ro_q8","icse10_ch12_reflection_origin","If P reflects in origin to (3, 5), P?",[c("(−3, −5)"),m("(3, 5)"),g("(−3, 5)"),e("(3, −5)")],"Reverse.",["Original is negation."],"Negate.","medium",ch12),
  // Ch12 invariant_points
  Q("icse10_ch12_ip_q1","icse10_ch12_invariant_points","Invariant under x-axis reflection means…",[c("Point on x-axis (y=0)"),m("Random"),g("All points"),e("None")],"y=0 unchanged.",["Points on axis."],"Y=0.","medium",ch12),
  Q("icse10_ch12_ip_q2","icse10_ch12_invariant_points","Invariant under y-axis reflection?",[c("Points on y-axis (x=0)"),m("Random"),g("Origin only"),e("None")],"x=0.",["Points on axis."],"X=0.","medium",ch12),
  Q("icse10_ch12_ip_q3","icse10_ch12_invariant_points","Invariant under origin reflection?",[c("Only origin (0,0)"),m("x-axis points"),g("Whole plane"),e("Random")],"Single point.",["Only (0,0)."],"(0,0).","medium",ch12),
  Q("icse10_ch12_ip_q4","icse10_ch12_invariant_points","Is (5, 0) invariant under x-axis reflection?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"On x-axis.",["y=0 invariant."],"Yes.","easy",ch12),
  Q("icse10_ch12_ip_q5","icse10_ch12_invariant_points","Is (0, 3) invariant under y-axis reflection?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"On y-axis.",["x=0 invariant."],"Yes.","easy",ch12),
  Q("icse10_ch12_ip_q6","icse10_ch12_invariant_points","Is (4, 5) invariant under origin reflection?",[e("Yes"),c("No"),m("Sometimes"),g("Cannot say")],"Not origin.",["Only (0,0)."],"No.","medium",ch12),
  Q("icse10_ch12_ip_q7","icse10_ch12_invariant_points","Invariant under x = a reflection?",[c("Points on line x = a"),m("Random"),g("Just origin"),e("None")],"Points on the axis of reflection.",["x = a points unchanged."],"Line x=a.","hard",ch12),
  Q("icse10_ch12_ip_q8","icse10_ch12_invariant_points","Invariant under y = b reflection?",[c("Points on line y = b"),m("Origin"),g("Whole plane"),e("None")],"Points on axis.",["y = b points unchanged."],"Line y=b.","hard",ch12),

  // Ch13 section_formula
  Q("icse10_ch13_sf_q1","icse10_ch13_section_formula","Section formula: P = ?",[c("((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))"),m("Random"),g("Midpoint"),e("Just average")],"Standard.",["Weighted average."],"Standard.","medium",ch13),
  Q("icse10_ch13_sf_q2","icse10_ch13_section_formula","P divides A(1,2), B(4,8) in 1:2. P = ?",[c("(2, 4)"),m("(3, 6)"),g("(2.5, 5)"),e("(4, 8)")],"((4+2)/3, (8+4)/3).",["= (2, 4)."],"Apply.","medium",ch13),
  Q("icse10_ch13_sf_q3","icse10_ch13_section_formula","Ratio 2:3 between A(0,0), B(5,10). P = ?",[c("(2, 4)"),m("(3, 6)"),g("(2.5, 5)"),e("(5, 10)")],"((10+0)/5, (20+0)/5).",["= (2, 4)."],"Apply.","medium",ch13),
  Q("icse10_ch13_sf_q4","icse10_ch13_section_formula","Internal division applies when…",[c("P lies between A and B"),m("Random"),g("Cannot apply"),e("Outside only")],"Standard.",["P is on segment."],"Internal.","easy",ch13),
  Q("icse10_ch13_sf_q5","icse10_ch13_section_formula","External division has formula…",[c("((mx₂−nx₁)/(m−n), ...)"),m("Same as internal"),g("Random"),e("Cannot")],"Subtraction.",["m−n in denom."],"External formula.","hard",ch13),
  Q("icse10_ch13_sf_q6","icse10_ch13_section_formula","If P(3,4) divides A(1,2)-B(5,6), ratio?",[c("1:1"),m("2:1"),g("1:2"),e("3:1")],"P = midpoint.",["P at average."],"1:1.","medium",ch13),
  Q("icse10_ch13_sf_q7","icse10_ch13_section_formula","P divides A(0,0), B(6,9) in 2:1. P?",[c("(4, 6)"),m("(2, 3)"),g("(3, 4.5)"),e("(6, 9)")],"((12+0)/3, (18+0)/3).",["= (4, 6)."],"Apply.","medium",ch13),
  Q("icse10_ch13_sf_q8","icse10_ch13_section_formula","P divides in ratio k:1 means…",[c("m:n = k:1"),m("Random"),g("Always midpoint"),e("Cannot")],"Parameterized.",["k determines ratio."],"k:1.","medium",ch13),
  // Ch13 midpoint
  Q("icse10_ch13_mp_q1","icse10_ch13_midpoint","Midpoint of (2,4), (6,8)?",[c("(4, 6)"),m("(8, 12)"),g("(2, 4)"),e("(3, 5)")],"Average.",["((2+6)/2, (4+8)/2)."],"Average.","easy",ch13),
  Q("icse10_ch13_mp_q2","icse10_ch13_midpoint","Midpoint formula:",[c("((x₁+x₂)/2, (y₁+y₂)/2)"),m("Random"),g("Difference"),e("Sum")],"Average.",["Avg coordinates."],"Average.","easy",ch13),
  Q("icse10_ch13_mp_q3","icse10_ch13_midpoint","Midpoint of (0,0), (10,10)?",[c("(5, 5)"),m("(10, 10)"),g("(0, 0)"),e("(2.5, 2.5)")],"Average.",["(5, 5)."],"Average.","easy",ch13),
  Q("icse10_ch13_mp_q4","icse10_ch13_midpoint","If midpoint is (3, 4), one endpoint (0,0), other?",[c("(6, 8)"),m("(3, 4)"),g("(0, 0)"),e("(6, 4)")],"Reverse formula.",["M = (A+B)/2 → B = 2M − A."],"Reverse.","medium",ch13),
  Q("icse10_ch13_mp_q5","icse10_ch13_midpoint","Midpoint of (1, 3), (5, 7)?",[c("(3, 5)"),m("(2, 4)"),g("(6, 10)"),e("(4, 4)")],"Average.",["(3, 5)."],"Average.","easy",ch13),
  Q("icse10_ch13_mp_q6","icse10_ch13_midpoint","Midpoint divides line in ratio:",[c("1:1"),m("2:1"),g("Random"),e("None")],"Equal.",["Center."],"1:1.","easy",ch13),
  Q("icse10_ch13_mp_q7","icse10_ch13_midpoint","Midpoint of (−2, 3), (6, −1)?",[c("(2, 1)"),m("(4, 4)"),g("(8, 2)"),e("(−1, 2)")],"Average.",["((−2+6)/2, (3−1)/2)."],"Average.","medium",ch13),
  Q("icse10_ch13_mp_q8","icse10_ch13_midpoint","Centroid of triangle is average of…",[c("3 vertices"),m("2"),g("4"),e("Sides")],"Standard.",["Average all 3 vertex coords."],"3 vertices.","medium",ch13),
  // Ch13 dividing_line
  Q("icse10_ch13_dl_q1","icse10_ch13_dividing_line","Trisect AB(0,0)-(9,9). First trisection point?",[c("(3, 3)"),m("(6, 6)"),g("(4.5, 4.5)"),e("(0, 0)")],"Ratio 1:2.",["First at 1/3."],"1:2.","medium",ch13),
  Q("icse10_ch13_dl_q2","icse10_ch13_dividing_line","Quartile point (closest to A) of (0,0)-(8,4)?",[c("(2, 1)"),m("(4, 2)"),g("(6, 3)"),e("(8, 4)")],"1:3.",["At 1/4."],"1:3.","medium",ch13),
  Q("icse10_ch13_dl_q3","icse10_ch13_dividing_line","Division into 3 equal parts gives ___ points.",[c("2"),m("3"),g("4"),e("1")],"Internal.",["2 division points + 2 endpoints."],"2.","medium",ch13),
  Q("icse10_ch13_dl_q4","icse10_ch13_dividing_line","Second trisection point of (0,0)-(9,9)?",[c("(6, 6)"),m("(3, 3)"),g("(9, 9)"),e("(4.5, 4.5)")],"Ratio 2:1.",["At 2/3."],"2:1.","medium",ch13),
  Q("icse10_ch13_dl_q5","icse10_ch13_dividing_line","Equal division by k points gives ratio steps of…",[c("1/k"),m("k"),g("k−1"),e("Random")],"Spacing.",["Equally spaced."],"1/k.","hard",ch13),
  Q("icse10_ch13_dl_q6","icse10_ch13_dividing_line","Three trisection points of (0,0)-(12,0)?",[c("(4,0), (8,0)"),m("(6,0)"),g("(3,0), (9,0)"),e("(2,0), (10,0)")],"Equal thirds.",["At 4 and 8."],"Thirds.","medium",ch13),
  Q("icse10_ch13_dl_q7","icse10_ch13_dividing_line","Quartering gives __ points.",[c("3"),m("4"),g("5"),e("2")],"Equal quarters.",["3 division points."],"3.","medium",ch13),
  Q("icse10_ch13_dl_q8","icse10_ch13_dividing_line","Midpoint = 1:1 trisection point of (0,0)-(6,6)?",[e("Yes"),c("No (midpoint is single, trisection has 2)"),m("Always"),g("Random")],"Different.",["Midpoint = (3,3). Trisection = (2,2), (4,4)."],"Different.","hard",ch13),
  // Ch13 section_applications
  Q("icse10_ch13_sa_q1","icse10_ch13_section_applications","P(3,4) divides A(1,2)-B(5,6). Ratio?",[c("1:1"),m("2:1"),g("1:2"),e("3:1")],"Midpoint.",["Avg = (3,4) = midpoint."],"1:1.","medium",ch13),
  Q("icse10_ch13_sa_q2","icse10_ch13_section_applications","To find ratio, use…",[c("Section formula reversed"),m("Random"),g("Just measure"),e("Cannot")],"Solve.",["Set up equations."],"Reverse.","medium",ch13),
  Q("icse10_ch13_sa_q3","icse10_ch13_section_applications","If P(2,3) divides A(0,0)-B(4,6), ratio?",[c("1:1"),m("2:1"),g("1:2"),e("3:1")],"Midpoint.",["Avg = (2,3)."],"1:1.","medium",ch13),
  Q("icse10_ch13_sa_q4","icse10_ch13_section_applications","y-axis divides segment from (1,2) to (−2,5). Ratio?",[c("1:2"),m("2:1"),g("1:1"),e("3:1")],"Find intersection with y-axis.",["x=0 implies ratio."],"Solve.","hard",ch13),
  Q("icse10_ch13_sa_q5","icse10_ch13_section_applications","x-axis divides segment (3,−4) to (−1,2). Ratio?",[c("2:1"),m("1:2"),g("Cannot tell"),e("3:1")],"y=0.",["From formula."],"Find ratio.","hard",ch13),
  Q("icse10_ch13_sa_q6","icse10_ch13_section_applications","Centroid of triangle (0,0), (6,0), (0,6)?",[c("(2, 2)"),m("(3, 3)"),g("(0, 0)"),e("(6, 6)")],"Average.",["((0+6+0)/3, (0+0+6)/3)."],"Avg vertices.","medium",ch13),
  Q("icse10_ch13_sa_q7","icse10_ch13_section_applications","If centroid (2,3), two vertices (0,0), (3,4), third?",[c("(3, 5)"),m("(2, 3)"),g("(6, 9)"),e("(0, 0)")],"Sum × 3 minus others.",["3×2=6, 6-0-3=3. 3×3=9, 9-0-4=5."],"Reverse centroid.","hard",ch13),
  Q("icse10_ch13_sa_q8","icse10_ch13_section_applications","Section formula uses…",[c("Weighted average"),m("Just sum"),g("Random"),e("Product")],"Weighted.",["Weighted by ratio."],"Weighted.","medium",ch13),

  // Ch14 slope_intercept
  Q("icse10_ch14_si_q1","icse10_ch14_slope_intercept","y = mx + c. m = ?",[c("Slope"),m("Y-intercept"),g("X-intercept"),e("Constant")],"Definition.",["m is slope."],"Slope.","easy",ch14),
  Q("icse10_ch14_si_q2","icse10_ch14_slope_intercept","y = mx + c. c = ?",[c("Y-intercept"),m("Slope"),g("X-intercept"),e("Random")],"At x=0.",["c is y-int."],"Y-int.","easy",ch14),
  Q("icse10_ch14_si_q3","icse10_ch14_slope_intercept","Slope of y = 3x + 5?",[c("3"),m("5"),g("8"),e("0")],"Coefficient of x.",["m = 3."],"m.","easy",ch14),
  Q("icse10_ch14_si_q4","icse10_ch14_slope_intercept","Y-intercept of y = 2x − 7?",[c("−7"),m("2"),g("7"),e("0")],"At x=0.",["c = −7."],"c.","easy",ch14),
  Q("icse10_ch14_si_q5","icse10_ch14_slope_intercept","Slope formula:",[c("(y₂ − y₁)/(x₂ − x₁)"),m("Random"),g("x/y"),e("Average")],"Rise over run.",["Standard."],"Rise/run.","medium",ch14),
  Q("icse10_ch14_si_q6","icse10_ch14_slope_intercept","Slope between (0,2) and (3,8)?",[c("2"),m("6"),g("3"),e("1")],"(8-2)/(3-0).",["= 6/3 = 2."],"Rise/run.","medium",ch14),
  Q("icse10_ch14_si_q7","icse10_ch14_slope_intercept","Horizontal line slope?",[c("0"),m("Undefined"),g("1"),e("Infinity")],"No rise.",["y doesn't change."],"= 0.","medium",ch14),
  Q("icse10_ch14_si_q8","icse10_ch14_slope_intercept","Vertical line slope?",[c("Undefined"),m("0"),g("1"),e("Infinity")],"Divide by 0.",["x doesn't change."],"Undefined.","medium",ch14),
  // Ch14 two_point_form
  Q("icse10_ch14_tp_q1","icse10_ch14_two_point_form","Two-point form formula:",[c("(y − y₁)/(x − x₁) = (y₂ − y₁)/(x₂ − x₁)"),m("Random"),g("Sum"),e("Difference")],"Standard.",["Slope between points."],"Slope eq.","medium",ch14),
  Q("icse10_ch14_tp_q2","icse10_ch14_two_point_form","Line through (1,2), (3,8) equation?",[c("y = 3x − 1"),m("y = 2x + 1"),g("y = x + 1"),e("y = 4x")],"Slope 3, y-int −1.",["m=3, plug (1,2): 2=3−1 ✓."],"Find slope, then int.","medium",ch14),
  Q("icse10_ch14_tp_q3","icse10_ch14_two_point_form","Line through (0,0), (1,1)?",[c("y = x"),m("y = 2x"),g("y = −x"),e("y = 0")],"Slope 1.",["Origin + slope 1."],"y = x.","easy",ch14),
  Q("icse10_ch14_tp_q4","icse10_ch14_two_point_form","Slope between (2,3), (4,7)?",[c("2"),m("4"),g("1"),e("3")],"(7-3)/(4-2).",["= 4/2 = 2."],"Slope formula.","medium",ch14),
  Q("icse10_ch14_tp_q5","icse10_ch14_two_point_form","Two-point form needs…",[c("2 points"),m("3"),g("Slope only"),e("Just 1")],"Standard.",["Two endpoints define line."],"2 points.","easy",ch14),
  Q("icse10_ch14_tp_q6","icse10_ch14_two_point_form","Line through (1, 4), (5, 4)?",[c("y = 4"),m("y = x"),g("y = 4x"),e("x = 1")],"Horizontal.",["y constant."],"Horizontal.","medium",ch14),
  Q("icse10_ch14_tp_q7","icse10_ch14_two_point_form","Line through (3, 0), (3, 5)?",[c("x = 3"),m("y = 5"),g("y = x"),e("y = 0")],"Vertical.",["x constant."],"Vertical.","medium",ch14),
  Q("icse10_ch14_tp_q8","icse10_ch14_two_point_form","Point-slope form: y − y₁ = ?",[c("m(x − x₁)"),m("m + x"),g("mx"),e("Random")],"Variant.",["Useful form."],"Point-slope.","medium",ch14),
  // Ch14 parallel_perpendicular
  Q("icse10_ch14_pp_q1","icse10_ch14_parallel_perpendicular","Parallel lines have:",[c("Same slope"),m("Negative slopes"),g("Slope product −1"),e("Random")],"Standard.",["Equal m."],"Same m.","medium",ch14),
  Q("icse10_ch14_pp_q2","icse10_ch14_parallel_perpendicular","Perpendicular lines: m₁ × m₂ = ?",[c("−1"),m("1"),g("0"),e("Random")],"Standard.",["Negative reciprocal."],"−1.","medium",ch14),
  Q("icse10_ch14_pp_q3","icse10_ch14_parallel_perpendicular","If m₁=2, perpendicular slope?",[c("−1/2"),m("1/2"),g("−2"),e("2")],"−1/m₁.",["−1/2."],"−1/m.","medium",ch14),
  Q("icse10_ch14_pp_q4","icse10_ch14_parallel_perpendicular","y = 3x + 1 and y = 3x + 5 are…",[c("Parallel"),m("Perpendicular"),g("Same"),e("Random")],"Same slope.",["Both m = 3."],"Parallel.","easy",ch14),
  Q("icse10_ch14_pp_q5","icse10_ch14_parallel_perpendicular","y = 2x + 1 and y = −x/2 + 3 are…",[c("Perpendicular"),m("Parallel"),g("Same"),e("Random")],"2 × (−½) = −1.",["Product = −1."],"Perpendicular.","medium",ch14),
  Q("icse10_ch14_pp_q6","icse10_ch14_parallel_perpendicular","Two horizontal lines are…",[c("Parallel"),m("Perpendicular"),g("Same"),e("Random")],"Both slope 0.",["Same m=0."],"Parallel.","easy",ch14),
  Q("icse10_ch14_pp_q7","icse10_ch14_parallel_perpendicular","Horizontal and vertical are…",[c("Perpendicular"),m("Parallel"),g("Same"),e("Random")],"At 90°.",["Always perp."],"Perpendicular.","medium",ch14),
  Q("icse10_ch14_pp_q8","icse10_ch14_parallel_perpendicular","Slope of line perp to y = −3x + 4?",[c("1/3"),m("3"),g("−1/3"),e("−3")],"−1/(−3).",["= 1/3."],"−1/m.","medium",ch14),
  // Ch14 line_problems
  Q("icse10_ch14_lp_q1","icse10_ch14_line_problems","Line through (2,3) parallel to y = 4x + 1. Equation?",[c("y = 4x − 5"),m("y = 4x + 3"),g("y = x + 2"),e("y = 4")],"m=4. Through (2,3): 3 = 8 + c → c=−5.",["Use point slope."],"Same m.","hard",ch14),
  Q("icse10_ch14_lp_q2","icse10_ch14_line_problems","Line through (0,0) perp to y = 2x?",[c("y = −x/2"),m("y = 2x"),g("y = x/2"),e("y = −2x")],"m = −½, through origin.",["Standard."],"−1/m.","medium",ch14),
  Q("icse10_ch14_lp_q3","icse10_ch14_line_problems","Line with slope 3 through (1,4)?",[c("y = 3x + 1"),m("y = 3x + 4"),g("y = 4x − 3"),e("y = x + 3")],"y − 4 = 3(x − 1).",["y = 3x + 1."],"Point-slope.","medium",ch14),
  Q("icse10_ch14_lp_q4","icse10_ch14_line_problems","Line through (0, −2) parallel to y = 5x + 3?",[c("y = 5x − 2"),m("y = 3x + 5"),g("y = 5x"),e("y = −5x − 2")],"m = 5, c = −2.",["Substitute."],"Same m.","medium",ch14),
  Q("icse10_ch14_lp_q5","icse10_ch14_line_problems","Find x-intercept of y = 2x − 4.",[c("2"),m("0"),g("−4"),e("4")],"y=0: 0 = 2x − 4 → x=2.",["Set y=0."],"y=0.","medium",ch14),
  Q("icse10_ch14_lp_q6","icse10_ch14_line_problems","Find y-intercept of 3x + y = 6.",[c("6"),m("3"),g("−3"),e("0")],"x=0: y=6.",["Set x=0."],"x=0.","medium",ch14),
  Q("icse10_ch14_lp_q7","icse10_ch14_line_problems","Line through origin with slope −3?",[c("y = −3x"),m("y = 3x"),g("y = −x/3"),e("y = x/3")],"c=0.",["Standard."],"y=mx.","easy",ch14),
  Q("icse10_ch14_lp_q8","icse10_ch14_line_problems","Distance from origin to line y = x + 4?",[c("Use formula"),m("4"),g("0"),e("2√2")],"Distance formula gives 2√2.",["|c|/√(m²+1)."],"Distance formula.","hard",ch14),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} ICSE Class 10 questions (Ch10-14).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
