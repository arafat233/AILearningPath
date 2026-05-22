/** ICSE Class 10 Math — Questions Ch23-25 (Graphical Rep, Central Tendency, Probability) */
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
const ch23="Graphical Representation", ch24="Measures of Central Tendency", ch25="Probability";

const questions = [
  // Ch23 histograms
  Q("icse10_ch23_hi_q1","icse10_ch23_histograms","Histogram is used for:",[c("Continuous data"),m("Discrete only"),g("Categories"),e("Random")],"Standard.",["Continuous frequency."],"Continuous.","easy",ch23),
  Q("icse10_ch23_hi_q2","icse10_ch23_histograms","Bars in histogram are…",[c("Touching"),m("Spaced"),g("Random"),e("Curved")],"Continuous.",["No gaps."],"Touching.","medium",ch23),
  Q("icse10_ch23_hi_q3","icse10_ch23_histograms","x-axis of histogram shows:",[c("Class intervals"),m("Frequency"),g("Random"),e("Sum")],"Standard.",["Categories of values."],"Intervals.","medium",ch23),
  Q("icse10_ch23_hi_q4","icse10_ch23_histograms","y-axis shows:",[c("Frequency"),m("Class intervals"),g("Random"),e("Cumulative")],"Standard.",["Count."],"Frequency.","easy",ch23),
  Q("icse10_ch23_hi_q5","icse10_ch23_histograms","Class width must be:",[c("Equal (for unequal widths, adjust heights)"),m("Different"),g("Random"),e("Cannot have")],"For comparison.",["Equal width simpler."],"Equal.","medium",ch23),
  Q("icse10_ch23_hi_q6","icse10_ch23_histograms","Class 0-10 freq 5, 10-20 freq 8. Which bar is taller?",[c("10-20"),m("0-10"),g("Same"),e("Cannot say")],"Larger freq.",["8 > 5."],"Larger.","easy",ch23),
  Q("icse10_ch23_hi_q7","icse10_ch23_histograms","Histogram vs bar chart difference:",[c("Histogram for continuous, bar for categorical"),m("Same"),g("Random"),e("Reversed")],"Different uses.",["Different data types."],"Continuous vs cat.","medium",ch23),
  Q("icse10_ch23_hi_q8","icse10_ch23_histograms","If class widths differ, use:",[c("Frequency density (freq/width)"),m("Just frequency"),g("Random"),e("Cannot draw")],"Adjusted height.",["For fair comparison."],"Density.","hard",ch23),
  // Ch23 frequency_polygon
  Q("icse10_ch23_fp_q1","icse10_ch23_frequency_polygon","Frequency polygon connects:",[c("Midpoints of histogram bar tops"),m("Endpoints"),g("Random"),e("Just one point")],"Standard.",["Use midpoints."],"Midpoints.","medium",ch23),
  Q("icse10_ch23_fp_q2","icse10_ch23_frequency_polygon","Midpoint of class 0-10?",[c("5"),m("0"),g("10"),e("Random")],"Average.",["(0+10)/2."],"= 5.","easy",ch23),
  Q("icse10_ch23_fp_q3","icse10_ch23_frequency_polygon","Midpoint of class 30-40?",[c("35"),m("30"),g("40"),e("70")],"Average.",["(30+40)/2."],"= 35.","easy",ch23),
  Q("icse10_ch23_fp_q4","icse10_ch23_frequency_polygon","Closes at frequency 0 at ends?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"Convention.",["Connect to x-axis at extremes."],"Yes.","medium",ch23),
  Q("icse10_ch23_fp_q5","icse10_ch23_frequency_polygon","Useful for:",[c("Comparing two distributions"),m("Hide data"),g("Random"),e("Cannot use")],"Application.",["Overlay multiple."],"Compare.","medium",ch23),
  Q("icse10_ch23_fp_q6","icse10_ch23_frequency_polygon","Frequency polygon is a:",[c("Line graph"),m("Bar graph"),g("Pie chart"),e("Random")],"Type.",["Connect points."],"Line.","medium",ch23),
  Q("icse10_ch23_fp_q7","icse10_ch23_frequency_polygon","Can be drawn without histogram?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"Independent.",["Direct from data."],"Yes.","medium",ch23),
  Q("icse10_ch23_fp_q8","icse10_ch23_frequency_polygon","Shape of frequency polygon = ?",[c("Smooth curve approximation"),m("Bars"),g("Random"),e("Just dots")],"Curve.",["Smooths bars."],"Smooth curve.","medium",ch23),
  // Ch23 ogives
  Q("icse10_ch23_og_q1","icse10_ch23_ogives","Ogive plots:",[c("Cumulative frequency"),m("Frequency"),g("Random"),e("Just totals")],"Standard.",["Running total."],"Cum freq.","medium",ch23),
  Q("icse10_ch23_og_q2","icse10_ch23_ogives","Less-than ogive uses:",[c("Upper class limits"),m("Lower limits"),g("Midpoints"),e("Random")],"Convention.",["At upper end."],"Upper limit.","medium",ch23),
  Q("icse10_ch23_og_q3","icse10_ch23_ogives","More-than ogive uses:",[c("Lower class limits"),m("Upper"),g("Midpoints"),e("Random")],"Convention.",["At lower end."],"Lower limit.","medium",ch23),
  Q("icse10_ch23_og_q4","icse10_ch23_ogives","Ogive is used to find:",[c("Median graphically"),m("Random"),g("Mode only"),e("Cannot use")],"Application.",["Half-way point gives median."],"Median.","hard",ch23),
  Q("icse10_ch23_og_q5","icse10_ch23_ogives","Intersection of less-than and more-than ogives?",[c("Median"),m("Mean"),g("Mode"),e("Random")],"Property.",["At median."],"Median.","hard",ch23),
  Q("icse10_ch23_og_q6","icse10_ch23_ogives","Cumulative frequencies always:",[c("Non-decreasing"),m("Decreasing"),g("Random"),e("Zero")],"Property.",["Adds up."],"Non-decreasing.","medium",ch23),
  Q("icse10_ch23_og_q7","icse10_ch23_ogives","If data: 5, 8, 12, 25. Cumulative?",[c("5, 13, 25, 50"),m("5, 8, 12, 25"),g("Random"),e("All zero")],"Add.",["Running sum."],"Cumulative.","medium",ch23),
  Q("icse10_ch23_og_q8","icse10_ch23_ogives","Final value of cumulative frequency = ?",[c("Total frequency"),m("Random"),g("Last freq"),e("Zero")],"Property.",["Sum of all."],"Total.","medium",ch23),
  // Ch23 comparison_graphs
  Q("icse10_ch23_cg_q1","icse10_ch23_comparison_graphs","Compare distributions using…",[c("Frequency polygons overlay"),m("Different graphs"),g("Random"),e("Cannot")],"Best for compare.",["Same axes."],"Overlay.","medium",ch23),
  Q("icse10_ch23_cg_q2","icse10_ch23_comparison_graphs","Two classes test scores — which graph?",[c("Frequency polygon (compare two)"),m("Just bars"),g("Random"),e("Pie")],"Best compare.",["Two lines on one graph."],"Overlay polygons.","medium",ch23),
  Q("icse10_ch23_cg_q3","icse10_ch23_comparison_graphs","Look for in comparison:",[c("Peaks, spread, skew"),m("Just peaks"),g("Random"),e("Just color")],"Visual.",["Multiple features."],"Peaks/spread.","medium",ch23),
  Q("icse10_ch23_cg_q4","icse10_ch23_comparison_graphs","Skewed right (positive) distribution has:",[c("Long right tail"),m("Long left tail"),g("Symmetric"),e("Random")],"Definition.",["Tail on right."],"Right tail.","hard",ch23),
  Q("icse10_ch23_cg_q5","icse10_ch23_comparison_graphs","Skewed left has:",[c("Long left tail"),m("Right tail"),g("Symmetric"),e("Random")],"Definition.",["Tail on left."],"Left tail.","hard",ch23),
  Q("icse10_ch23_cg_q6","icse10_ch23_comparison_graphs","Bell-shaped = ?",[c("Normal distribution"),m("Skewed"),g("Random"),e("Empty")],"Common.",["Symmetric peak in middle."],"Normal.","medium",ch23),
  Q("icse10_ch23_cg_q7","icse10_ch23_comparison_graphs","Compare same data with different scales?",[c("Misleading"),m("Same"),g("Random"),e("Better")],"Bad practice.",["Use same scales."],"Misleading.","medium",ch23),
  Q("icse10_ch23_cg_q8","icse10_ch23_comparison_graphs","Visualization helps find:",[c("Patterns and outliers"),m("Random"),g("Decoration"),e("Cannot help")],"Application.",["Visual reveals."],"Patterns.","medium",ch23),

  // Ch24 mean
  Q("icse10_ch24_me_q1","icse10_ch24_mean","Mean of 2, 4, 6, 8?",[c("5"),m("4"),g("10"),e("20")],"20/4.",["Sum/count."],"Sum/count.","easy",ch24),
  Q("icse10_ch24_me_q2","icse10_ch24_mean","Mean formula for ungrouped data:",[c("Σx/n"),m("Random"),g("Σx²"),e("Σ(x−mean)")],"Standard.",["Sum divided by count."],"Σx/n.","easy",ch24),
  Q("icse10_ch24_me_q3","icse10_ch24_mean","Mean of grouped data:",[c("Σ(f×x)/Σf"),m("Σx/n"),g("Random"),e("Σf")],"With frequency.",["Weighted average."],"Σfx/Σf.","medium",ch24),
  Q("icse10_ch24_me_q4","icse10_ch24_mean","x: 1, 2, 3 with frequencies 2, 3, 5. Mean?",[c("2.3"),m("2"),g("3"),e("10")],"(1×2+2×3+3×5)/10 = 23/10.",["= 2.3."],"Weighted.","medium",ch24),
  Q("icse10_ch24_me_q5","icse10_ch24_mean","Mean is sensitive to:",[c("Outliers"),m("Order"),g("Random"),e("Nothing")],"Property.",["Extreme values shift mean."],"Outliers.","medium",ch24),
  Q("icse10_ch24_me_q6","icse10_ch24_mean","Mean of class marks: 10-20 (12), 20-30 (8). Use:",[c("Class midpoints (15, 25)"),m("Class limits"),g("Random"),e("Class width")],"For frequencies.",["Use midpoints as x."],"Midpoints.","hard",ch24),
  Q("icse10_ch24_me_q7","icse10_ch24_mean","Sum of deviations from mean = ?",[c("0"),m("n"),g("Random"),e("1")],"Property.",["Balanced around mean."],"= 0.","hard",ch24),
  Q("icse10_ch24_me_q8","icse10_ch24_mean","Adding constant to each value: mean…",[c("Increases by constant"),m("Same"),g("Doubles"),e("Random")],"Shift.",["Mean shifts by constant."],"+c.","medium",ch24),
  // Ch24 median
  Q("icse10_ch24_md_q1","icse10_ch24_median","Median is the:",[c("Middle value (sorted)"),m("Average"),g("Most frequent"),e("Random")],"Definition.",["Sort, take middle."],"Middle.","easy",ch24),
  Q("icse10_ch24_md_q2","icse10_ch24_median","Median of 3, 7, 9?",[c("7"),m("3"),g("9"),e("6")],"Middle.",["Middle of 3 values."],"Middle.","easy",ch24),
  Q("icse10_ch24_md_q3","icse10_ch24_median","Median of 1, 3, 5, 7 (even count)?",[c("4"),m("3"),g("5"),e("8")],"Avg of 3 and 5.",["(3+5)/2."],"Avg of 2 middles.","medium",ch24),
  Q("icse10_ch24_md_q4","icse10_ch24_median","Must data be sorted?",[c("Yes"),m("No"),g("Sometimes"),e("Random")],"Required.",["Sort first."],"Yes.","easy",ch24),
  Q("icse10_ch24_md_q5","icse10_ch24_median","Median position for n values:",[c("(n+1)/2"),m("n/2"),g("n"),e("Random")],"Formula.",["Middle position."],"(n+1)/2.","medium",ch24),
  Q("icse10_ch24_md_q6","icse10_ch24_median","Median for grouped data uses:",[c("Median class + formula"),m("Random"),g("Direct sort"),e("Cannot find")],"Standard.",["L + ((n/2 − cf)/f) × h."],"Class formula.","hard",ch24),
  Q("icse10_ch24_md_q7","icse10_ch24_median","Median is less affected by outliers than mean?",[c("True"),m("False"),g("Same"),e("Random")],"Property.",["Robust statistic."],"True.","medium",ch24),
  Q("icse10_ch24_md_q8","icse10_ch24_median","Median of 1, 1, 2, 5, 100?",[c("2"),m("21.8"),g("1"),e("100")],"Middle.",["Middle of 5 values = 3rd."],"Middle.","easy",ch24),
  // Ch24 mode
  Q("icse10_ch24_mo_q1","icse10_ch24_mode","Mode is:",[c("Most frequent value"),m("Average"),g("Middle"),e("Random")],"Definition.",["Most repeated."],"Most frequent.","easy",ch24),
  Q("icse10_ch24_mo_q2","icse10_ch24_mode","Mode of 2, 3, 3, 5, 7?",[c("3"),m("5"),g("2"),e("4")],"3 appears twice.",["Repeats."],"3.","easy",ch24),
  Q("icse10_ch24_mo_q3","icse10_ch24_mode","Mode of 1, 1, 2, 2, 3?",[c("Bimodal (1 and 2)"),m("Just 1"),g("Just 2"),e("3")],"Two modes.",["Both repeat."],"Bimodal.","medium",ch24),
  Q("icse10_ch24_mo_q4","icse10_ch24_mode","No mode example?",[c("All values unique"),m("All same"),g("Random"),e("Cannot")],"No repeats.",["E.g., 1, 2, 3, 4."],"All unique.","medium",ch24),
  Q("icse10_ch24_mo_q5","icse10_ch24_mode","Mode for categorical data:",[c("Most common category"),m("Random"),g("Cannot"),e("Average")],"Application.",["Survey results."],"Most common.","medium",ch24),
  Q("icse10_ch24_mo_q6","icse10_ch24_mode","Mode of grouped data:",[c("Mode class formula"),m("Direct"),g("Random"),e("Cannot")],"Standard.",["L + (f₁−f₀)/(2f₁−f₀−f₂) × h."],"Class formula.","hard",ch24),
  Q("icse10_ch24_mo_q7","icse10_ch24_mode","Mode of 5, 5, 5, 5?",[c("5"),m("None"),g("Random"),e("Cannot")],"All same.",["5 appears all times."],"5.","easy",ch24),
  Q("icse10_ch24_mo_q8","icse10_ch24_mode","Mean, median, mode for symmetric data:",[c("Equal"),m("Different"),g("Random"),e("Cannot say")],"Symmetric.",["Same point."],"Equal.","hard",ch24),
  // Ch24 quartiles
  Q("icse10_ch24_qr_q1","icse10_ch24_quartiles","Q2 = ?",[c("Median"),m("Mean"),g("Mode"),e("Random")],"Standard.",["50th percentile."],"Median.","medium",ch24),
  Q("icse10_ch24_qr_q2","icse10_ch24_quartiles","Q1 = ___ percentile.",[c("25th"),m("50th"),g("75th"),e("Random")],"Standard.",["Lower quartile."],"25th.","medium",ch24),
  Q("icse10_ch24_qr_q3","icse10_ch24_quartiles","Q3 = ___ percentile.",[c("75th"),m("50th"),g("25th"),e("Random")],"Standard.",["Upper quartile."],"75th.","medium",ch24),
  Q("icse10_ch24_qr_q4","icse10_ch24_quartiles","Interquartile range = ?",[c("Q3 − Q1"),m("Q2 − Q1"),g("Q3 + Q1"),e("Random")],"Standard.",["Middle 50% spread."],"Q3 − Q1.","medium",ch24),
  Q("icse10_ch24_qr_q5","icse10_ch24_quartiles","Quartiles divide data into:",[c("4 equal parts"),m("3"),g("5"),e("Random")],"Standard.",["Quarters."],"4.","easy",ch24),
  Q("icse10_ch24_qr_q6","icse10_ch24_quartiles","For 8 values, Q1 position?",[c("2nd or interpolated"),m("4th"),g("6th"),e("Random")],"Standard.",["(n+1)/4."],"Position.","hard",ch24),
  Q("icse10_ch24_qr_q7","icse10_ch24_quartiles","Outliers are detected using…",[c("Q1 − 1.5×IQR and Q3 + 1.5×IQR"),m("Mean"),g("Random"),e("Cannot")],"Standard.",["Tukey method."],"IQR rule.","hard",ch24),
  Q("icse10_ch24_qr_q8","icse10_ch24_quartiles","Data 1, 2, 3, 4, 5, 6, 7, 8. Q1?",[c("2.5"),m("3"),g("4.5"),e("2")],"Lower half median.",["(2+3)/2."],"Avg.","medium",ch24),

  // Ch25 probability_intro
  Q("icse10_ch25_pi_q1","icse10_ch25_probability_intro","Probability of event = ?",[c("Favorable / Total outcomes"),m("Random"),g("Just count"),e("Sum")],"Standard.",["Fraction."],"F/T.","easy",ch25),
  Q("icse10_ch25_pi_q2","icse10_ch25_probability_intro","Range of probability?",[c("0 to 1"),m("0 to ∞"),g("−1 to 1"),e("Any")],"Standard.",["Inclusive bounds."],"[0, 1].","easy",ch25),
  Q("icse10_ch25_pi_q3","icse10_ch25_probability_intro","Impossible event probability?",[c("0"),m("1"),g("0.5"),e("−1")],"Definition.",["No way to occur."],"0.","easy",ch25),
  Q("icse10_ch25_pi_q4","icse10_ch25_probability_intro","Certain event probability?",[c("1"),m("0"),g("0.5"),e("∞")],"Definition.",["Always occurs."],"1.","easy",ch25),
  Q("icse10_ch25_pi_q5","icse10_ch25_probability_intro","P(A) + P(not A) = ?",[c("1"),m("0"),g("2"),e("Random")],"Complement.",["Total probability."],"1.","medium",ch25),
  Q("icse10_ch25_pi_q6","icse10_ch25_probability_intro","Coin toss: P(head)?",[c("1/2"),m("1"),g("0"),e("1/4")],"Fair coin.",["1 of 2."],"½.","easy",ch25),
  Q("icse10_ch25_pi_q7","icse10_ch25_probability_intro","Die roll: P(even)?",[c("1/2"),m("1/3"),g("1/6"),e("Random")],"3 even of 6.",["3/6 = ½."],"3/6.","easy",ch25),
  Q("icse10_ch25_pi_q8","icse10_ch25_probability_intro","Sample space = ?",[c("All possible outcomes"),m("Random"),g("Just favorable"),e("Cannot")],"Definition.",["Universal set."],"All outcomes.","medium",ch25),
  // Ch25 simple_events
  Q("icse10_ch25_se_q1","icse10_ch25_simple_events","Die: P(6)?",[c("1/6"),m("1/2"),g("1/3"),e("1")],"1 of 6.",["Equal likely."],"1/6.","easy",ch25),
  Q("icse10_ch25_se_q2","icse10_ch25_simple_events","Coin: P(tail)?",[c("1/2"),m("1"),g("0"),e("1/4")],"Fair.",["1 of 2."],"½.","easy",ch25),
  Q("icse10_ch25_se_q3","icse10_ch25_simple_events","Card from deck: P(red)?",[c("1/2"),m("1/4"),g("1/13"),e("1")],"26 red of 52.",["26/52."],"½.","medium",ch25),
  Q("icse10_ch25_se_q4","icse10_ch25_simple_events","P(spade)?",[c("1/4"),m("1/2"),g("1/13"),e("Random")],"13 of 52.",["13/52."],"¼.","medium",ch25),
  Q("icse10_ch25_se_q5","icse10_ch25_simple_events","P(ace)?",[c("1/13"),m("1/4"),g("4/52"),e("Random")],"4 aces in 52.",["4/52 = 1/13."],"1/13.","medium",ch25),
  Q("icse10_ch25_se_q6","icse10_ch25_simple_events","P(king of hearts)?",[c("1/52"),m("4/52"),g("1/13"),e("1/4")],"Single card.",["1 of 52."],"1/52.","medium",ch25),
  Q("icse10_ch25_se_q7","icse10_ch25_simple_events","Die: P(prime)?",[c("3/6 = 1/2"),m("1/3"),g("1/6"),e("2/6")],"Primes 2, 3, 5.",["3 primes."],"3/6.","medium",ch25),
  Q("icse10_ch25_se_q8","icse10_ch25_simple_events","Bag has 5 red, 3 blue balls. P(red)?",[c("5/8"),m("5/3"),g("3/5"),e("1/2")],"5 of 8.",["5/8."],"5/8.","easy",ch25),
  // Ch25 compound_events
  Q("icse10_ch25_ce_q1","icse10_ch25_compound_events","P(A AND B) for independent events?",[c("P(A) × P(B)"),m("P(A) + P(B)"),g("Random"),e("Maximum")],"Multiplication rule.",["Independent multiply."],"Multiply.","medium",ch25),
  Q("icse10_ch25_ce_q2","icse10_ch25_compound_events","P(A OR B) for mutually exclusive?",[c("P(A) + P(B)"),m("P(A) × P(B)"),g("Random"),e("Same")],"Addition.",["Exclusive add."],"Add.","medium",ch25),
  Q("icse10_ch25_ce_q3","icse10_ch25_compound_events","Two coins: P(both heads)?",[c("1/4"),m("1/2"),g("1/3"),e("1")],"½ × ½.",["Independent multiply."],"× ½.","easy",ch25),
  Q("icse10_ch25_ce_q4","icse10_ch25_compound_events","Two dice: P(both 6)?",[c("1/36"),m("1/12"),g("1/6"),e("2/6")],"1/6 × 1/6.",["Independent."],"× 1/6.","medium",ch25),
  Q("icse10_ch25_ce_q5","icse10_ch25_compound_events","Die: P(2 or 3)?",[c("1/3"),m("1/6"),g("2/3"),e("1/2")],"Mutually exclusive sum.",["1/6 + 1/6 = 2/6."],"Add.","easy",ch25),
  Q("icse10_ch25_ce_q6","icse10_ch25_compound_events","Independent events have:",[c("No effect on each other"),m("Same"),g("Random"),e("Always different")],"Definition.",["Outcomes don't influence."],"No effect.","medium",ch25),
  Q("icse10_ch25_ce_q7","icse10_ch25_compound_events","P(A and B) general (not necessarily independent)?",[c("P(A) × P(B|A)"),m("P(A) × P(B)"),g("Random"),e("P(A) + P(B)")],"Conditional.",["General rule."],"× conditional.","hard",ch25),
  Q("icse10_ch25_ce_q8","icse10_ch25_compound_events","P(A or B) general?",[c("P(A) + P(B) − P(A∩B)"),m("P(A) + P(B)"),g("Random"),e("Multiply")],"Inclusion-exclusion.",["Subtract overlap."],"Inc-exc.","hard",ch25),
  // Ch25 probability_problems
  Q("icse10_ch25_pp_q1","icse10_ch25_probability_problems","Card: P(heart OR king)?",[c("16/52 = 4/13"),m("13/52"),g("17/52"),e("4/52")],"13 + 4 − 1 = 16.",["Overlap king of hearts."],"Inc-exc.","hard",ch25),
  Q("icse10_ch25_pp_q2","icse10_ch25_probability_problems","Bag: 4 red, 6 blue. Draw 1. P(red)?",[c("2/5"),m("1/4"),g("4/6"),e("Random")],"4/10.",["= 2/5."],"F/T.","easy",ch25),
  Q("icse10_ch25_pp_q3","icse10_ch25_probability_problems","Draw 2 without replacement. P(both red) if 4R/6B?",[c("4/10 × 3/9 = 2/15"),m("4/10 × 4/10"),g("Random"),e("Cannot")],"Dependent.",["Conditional × first."],"Dependent.","hard",ch25),
  Q("icse10_ch25_pp_q4","icse10_ch25_probability_problems","Draw 2 with replacement. P(both red)?",[c("(4/10)² = 4/25"),m("4/10 × 3/9"),g("Random"),e("Cannot")],"Independent.",["Multiply same."],"Independent.","hard",ch25),
  Q("icse10_ch25_pp_q5","icse10_ch25_probability_problems","Die: P(not 6)?",[c("5/6"),m("1/6"),g("6/6"),e("0")],"Complement.",["1 − 1/6."],"Complement.","easy",ch25),
  Q("icse10_ch25_pp_q6","icse10_ch25_probability_problems","Card: P(face card)?",[c("12/52 = 3/13"),m("1/13"),g("4/13"),e("Random")],"12 face cards.",["J, Q, K each suit."],"12/52.","medium",ch25),
  Q("icse10_ch25_pp_q7","icse10_ch25_probability_problems","Two dice: P(sum = 7)?",[c("6/36 = 1/6"),m("1/36"),g("1/12"),e("Random")],"6 combos.",["(1,6), (2,5), ..."],"6 ways.","medium",ch25),
  Q("icse10_ch25_pp_q8","icse10_ch25_probability_problems","Bag: 5 white, 3 black, 2 red. P(not black)?",[c("7/10"),m("3/10"),g("5/10"),e("1")],"Complement.",["1 − 3/10."],"Complement.","medium",ch25),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} ICSE Class 10 questions (Ch23-25).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
