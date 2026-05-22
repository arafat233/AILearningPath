/** ICSE Class 10 Math — Questions Ch15-19 (Similarity, Loci, Circles, Tangents/Chords, Constructions) */
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
const ch15="Similarity", ch16="Loci", ch17="Circles", ch18="Tangents and Intersecting Chords", ch19="Constructions";

const questions = [
  // Ch15 similarity_intro
  Q("icse10_ch15_si_q1","icse10_ch15_similarity_intro","Similar figures have:",[c("Same shape, different size"),m("Same size"),g("Different shape"),e("Random")],"Definition.",["Shape only."],"Same shape.","easy",ch15),
  Q("icse10_ch15_si_q2","icse10_ch15_similarity_intro","Similar triangles: corresponding angles…",[c("Equal"),m("Different"),g("Sum 180"),e("Random")],"Property.",["All equal."],"Equal.","medium",ch15),
  Q("icse10_ch15_si_q3","icse10_ch15_similarity_intro","Similar triangles: sides…",[c("Proportional"),m("Equal"),g("Random"),e("Sum 180")],"Property.",["Ratio constant."],"Proportional.","medium",ch15),
  Q("icse10_ch15_si_q4","icse10_ch15_similarity_intro","Symbol for similar?",[c("~"),m("≅"),g("="),e("≠")],"Standard.",["~."],"~.","easy",ch15),
  Q("icse10_ch15_si_q5","icse10_ch15_similarity_intro","All circles are…",[c("Similar"),m("Congruent"),g("Different"),e("Same")],"Same shape.",["Just sizes differ."],"Similar.","easy",ch15),
  Q("icse10_ch15_si_q6","icse10_ch15_similarity_intro","All squares are…",[c("Similar"),m("Congruent"),g("Different"),e("Random")],"Same shape.",["Always similar."],"Similar.","easy",ch15),
  Q("icse10_ch15_si_q7","icse10_ch15_similarity_intro","All rectangles are similar?",[e("Yes"),c("No (need same ratio)"),m("Sometimes"),g("Cannot say")],"L:W can differ.",["Need same L:W."],"Need ratio.","hard",ch15),
  Q("icse10_ch15_si_q8","icse10_ch15_similarity_intro","Similar vs congruent:",[c("Similar = scaled, congruent = identical"),m("Same"),g("Random"),e("Reversed")],"Difference.",["Size matters."],"Different.","medium",ch15),
  // Ch15 similar_triangles
  Q("icse10_ch15_st_q1","icse10_ch15_similar_triangles","AA similarity needs:",[c("2 angles equal"),m("All sides"),g("All angles"),e("1 angle")],"Standard criterion.",["Angle-Angle suffices."],"AA.","medium",ch15),
  Q("icse10_ch15_st_q2","icse10_ch15_similar_triangles","SSS similarity needs:",[c("All sides proportional"),m("All equal"),g("Just 2"),e("Random")],"Standard.",["Three side ratios equal."],"3 sides ratio.","medium",ch15),
  Q("icse10_ch15_st_q3","icse10_ch15_similar_triangles","SAS similarity needs:",[c("2 sides proportional + included angle"),m("Random"),g("All angles"),e("3 sides")],"Standard.",["2 sides + angle between."],"SAS.","medium",ch15),
  Q("icse10_ch15_st_q4","icse10_ch15_similar_triangles","If triangles ABC ~ DEF, AB/DE = ?",[c("BC/EF = CA/FD"),m("Random"),g("DE/AB"),e("Just 1")],"Standard.",["All ratios equal."],"All sides ratio.","medium",ch15),
  Q("icse10_ch15_st_q5","icse10_ch15_similar_triangles","Triangles with angles 60, 70, 50 and 60, 70, 50 are…",[c("Similar"),m("Congruent"),g("Different"),e("Random")],"AA criterion.",["All angles equal."],"AA.","easy",ch15),
  Q("icse10_ch15_st_q6","icse10_ch15_similar_triangles","If A=70°, B=80°, A'=70°, B'=80°: similar?",[c("Yes (AA)"),m("No"),g("Sometimes"),e("Cannot say")],"Two angles.",["Two angles equal."],"Yes.","easy",ch15),
  Q("icse10_ch15_st_q7","icse10_ch15_similar_triangles","Ratio of corresponding sides is called…",[c("Scale factor"),m("Ratio"),g("Random"),e("Constant")],"k.",["Linear ratio."],"Scale factor.","medium",ch15),
  Q("icse10_ch15_st_q8","icse10_ch15_similar_triangles","If scale factor = 2, areas ratio?",[c("4 (k²)"),m("2"),g("8"),e("1")],"k² for areas.",["Square the linear ratio."],"k².","hard",ch15),
  // Ch15 maps_models
  Q("icse10_ch15_mm_q1","icse10_ch15_maps_models","Map scale 1:k means…",[c("1 unit map = k units real"),m("Random"),g("k=size"),e("1 = k")],"Ratio.",["Standard."],"1 to k.","medium",ch15),
  Q("icse10_ch15_mm_q2","icse10_ch15_maps_models","Map 1 cm = 1 km. 5 cm = ?",[c("5 km"),m("1 km"),g("50 km"),e("0.5 km")],"Multiply.",["5 × 1."],"× scale.","easy",ch15),
  Q("icse10_ch15_mm_q3","icse10_ch15_maps_models","Map scale 1:1000. Real distance 5 km = ?",[c("500 cm = 5 m"),m("5000 cm"),g("5 cm"),e("50 cm")],"5 km = 500000 cm. ÷1000 = 500 cm.",["Divide."],"÷ scale.","hard",ch15),
  Q("icse10_ch15_mm_q4","icse10_ch15_maps_models","Areas in maps scale by…",[c("k²"),m("k"),g("k³"),e("Random")],"Square.",["Linear ratio squared."],"k².","hard",ch15),
  Q("icse10_ch15_mm_q5","icse10_ch15_maps_models","If scale 1:100, model 5 cm → real?",[c("5 m"),m("500 cm"),g("0.5 m"),e("50 m")],"× 100.",["= 500 cm = 5 m."],"× 100.","medium",ch15),
  Q("icse10_ch15_mm_q6","icse10_ch15_maps_models","Volumes scale by…",[c("k³"),m("k²"),g("k"),e("Random")],"Cube.",["Linear ratio cubed."],"k³.","hard",ch15),
  Q("icse10_ch15_mm_q7","icse10_ch15_maps_models","Map scale 2 cm : 1 km. 6 cm map = ?",[c("3 km"),m("6 km"),g("2 km"),e("12 km")],"6/2 × 1.",["3 km."],"Use ratio.","medium",ch15),
  Q("icse10_ch15_mm_q8","icse10_ch15_maps_models","Why use scales?",[c("Show large/small in usable size"),m("Decoration"),g("Random"),e("Confusion")],"Practical.",["Maps practical."],"Practical.","easy",ch15),
  // Ch15 area_ratio
  Q("icse10_ch15_ar_q1","icse10_ch15_area_ratio","Areas of similar shapes scale by:",[c("(side ratio)²"),m("side ratio"),g("(side ratio)³"),e("Random")],"Standard.",["Square the linear scale."],"Square.","medium",ch15),
  Q("icse10_ch15_ar_q2","icse10_ch15_area_ratio","Side ratio 3:5. Area ratio?",[c("9:25"),m("3:5"),g("27:125"),e("12:25")],"Square.",["3² : 5² = 9:25."],"k².","medium",ch15),
  Q("icse10_ch15_ar_q3","icse10_ch15_area_ratio","Side ratio 1:2. Area ratio?",[c("1:4"),m("1:2"),g("1:8"),e("Same")],"Square.",["1:4."],"k².","easy",ch15),
  Q("icse10_ch15_ar_q4","icse10_ch15_area_ratio","If area ratio is 16:25, side ratio?",[c("4:5"),m("16:25"),g("8:12.5"),e("2:5")],"Square root.",["√16 = 4, √25 = 5."],"√.","hard",ch15),
  Q("icse10_ch15_ar_q5","icse10_ch15_area_ratio","Similar triangles areas 9 sq cm and 25 sq cm. Side ratio?",[c("3:5"),m("9:25"),g("1:3"),e("4:5")],"√.",["√(9/25) = 3/5."],"√.","medium",ch15),
  Q("icse10_ch15_ar_q6","icse10_ch15_area_ratio","Triangle with sides doubled has area…",[c("4×"),m("2×"),g("Same"),e("8×")],"k=2.",["k² = 4."],"k².","easy",ch15),
  Q("icse10_ch15_ar_q7","icse10_ch15_area_ratio","Areas of similar circles with radii r and 2r?",[c("1:4"),m("1:2"),g("1:8"),e("Random")],"r² ratio.",["4πr² vs πr²."],"k².","medium",ch15),
  Q("icse10_ch15_ar_q8","icse10_ch15_area_ratio","Two similar rectangles. Smaller area = 12, larger 27. Side ratio?",[c("2:3"),m("4:9"),g("3:4"),e("12:27")],"√(12/27) = 2/3.",["√(area ratio)."],"√.","hard",ch15),

  // Ch16 locus_intro
  Q("icse10_ch16_li_q1","icse10_ch16_locus_intro","Locus is…",[c("Path of points satisfying a condition"),m("Single point"),g("Random"),e("Just a line")],"Definition.",["Set of points."],"Set.","medium",ch16),
  Q("icse10_ch16_li_q2","icse10_ch16_locus_intro","Locus of points equidistant from a fixed point?",[c("Circle"),m("Line"),g("Square"),e("Random")],"Standard.",["All at same distance."],"Circle.","medium",ch16),
  Q("icse10_ch16_li_q3","icse10_ch16_locus_intro","Locus of points equidistant from 2 points?",[c("Perpendicular bisector"),m("Circle"),g("Random"),e("Sum")],"Standard.",["Right-angle bisector."],"⊥ bisector.","medium",ch16),
  Q("icse10_ch16_li_q4","icse10_ch16_locus_intro","Locus of points equidistant from 2 intersecting lines?",[c("Angle bisector"),m("Perpendicular bisector"),g("Random"),e("Line")],"Standard.",["Bisects angle."],"Angle bisector.","medium",ch16),
  Q("icse10_ch16_li_q5","icse10_ch16_locus_intro","Locus of points fixed distance from a line?",[c("Two parallel lines"),m("One line"),g("Circle"),e("Random")],"On both sides.",["Both sides parallel."],"Parallel lines.","hard",ch16),
  Q("icse10_ch16_li_q6","icse10_ch16_locus_intro","Locus describes…",[c("A set, not just a point"),m("Random"),g("One point"),e("Just origin")],"Standard.",["Multiple points."],"Set.","easy",ch16),
  Q("icse10_ch16_li_q7","icse10_ch16_locus_intro","Locus of all points at distance 3 from (0,0)?",[c("Circle radius 3"),m("Square"),g("Line"),e("Origin")],"Standard.",["x² + y² = 9."],"Circle.","easy",ch16),
  Q("icse10_ch16_li_q8","icse10_ch16_locus_intro","Locus may be…",[c("Line, circle, parabola, etc."),m("Just a point"),g("Just a line"),e("Random")],"Many shapes.",["Depends on condition."],"Various.","medium",ch16),
  // Ch16 perpendicular_bisector_locus
  Q("icse10_ch16_pb_q1","icse10_ch16_perpendicular_bisector_locus","Perp bisector of AB passes through midpoint of AB at __ angle.",[c("90°"),m("45°"),g("0°"),e("180°")],"By def.",["⊥."],"90°.","easy",ch16),
  Q("icse10_ch16_pb_q2","icse10_ch16_perpendicular_bisector_locus","Equidistant from (0,0) and (4,0): equation?",[c("x = 2"),m("y = 2"),g("x + y = 4"),e("Random")],"Midpoint x=2, perp to x-axis.",["x = 2."],"Vertical at midpoint.","medium",ch16),
  Q("icse10_ch16_pb_q3","icse10_ch16_perpendicular_bisector_locus","Distance from A to bisector = distance from B?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot")],"By definition.",["Equidistant."],"Yes.","medium",ch16),
  Q("icse10_ch16_pb_q4","icse10_ch16_perpendicular_bisector_locus","Equidistant from (0,0) and (0,6)?",[c("y = 3"),m("x = 3"),g("y = 6"),e("Random")],"Horizontal midline.",["y = 3."],"Horizontal.","medium",ch16),
  Q("icse10_ch16_pb_q5","icse10_ch16_perpendicular_bisector_locus","Perp bisector goes through…",[c("Midpoint at 90°"),m("Random point"),g("Endpoints"),e("Center")],"By definition.",["Midpoint, ⊥."],"Midpoint, ⊥.","easy",ch16),
  Q("icse10_ch16_pb_q6","icse10_ch16_perpendicular_bisector_locus","Used for…",[c("Finding equidistant points"),m("Random"),g("Just decoration"),e("Cannot use")],"Applications.",["Geometric loci."],"Equidistant.","medium",ch16),
  Q("icse10_ch16_pb_q7","icse10_ch16_perpendicular_bisector_locus","Length of perp bisector?",[c("Infinite (full line)"),m("Bounded"),g("Zero"),e("Random")],"Line, not segment.",["Whole line."],"Infinite.","medium",ch16),
  Q("icse10_ch16_pb_q8","icse10_ch16_perpendicular_bisector_locus","Center of circumscribed circle lies on…",[c("All perp bisectors of sides"),m("Random"),g("Just one"),e("Inside")],"Concurrent.",["Three bisectors meet at circumcenter."],"All bisectors.","hard",ch16),
  // Ch16 angle_bisector_locus
  Q("icse10_ch16_ab_q1","icse10_ch16_angle_bisector_locus","Angle bisector locus is for…",[c("Equidistant from 2 lines"),m("Equidistant from 2 points"),g("Random"),e("Just origin")],"Standard.",["Two intersecting lines."],"From lines.","medium",ch16),
  Q("icse10_ch16_ab_q2","icse10_ch16_angle_bisector_locus","Equidistant from x-axis and y-axis: lines?",[c("y = x and y = −x"),m("y = 0"),g("Just origin"),e("Random")],"Both bisectors.",["Two lines, 45°."],"y = ±x.","hard",ch16),
  Q("icse10_ch16_ab_q3","icse10_ch16_angle_bisector_locus","Number of angle bisectors of 2 intersecting lines?",[c("2"),m("1"),g("0"),e("Infinite")],"Two pairs.",["Both supplementary angles."],"2.","medium",ch16),
  Q("icse10_ch16_ab_q4","icse10_ch16_angle_bisector_locus","Center of inscribed circle lies on…",[c("All angle bisectors"),m("Random"),g("One bisector"),e("None")],"Concurrent.",["Three bisectors meet at incenter."],"All bisectors.","hard",ch16),
  Q("icse10_ch16_ab_q5","icse10_ch16_angle_bisector_locus","Bisector of 90° angle = ?",[c("45° from each side"),m("90°"),g("0°"),e("Random")],"Half.",["Half angle."],"45°.","easy",ch16),
  Q("icse10_ch16_ab_q6","icse10_ch16_angle_bisector_locus","Locus of points equidistant from sides of an angle?",[c("Angle bisector"),m("Random"),g("Perp bisector"),e("Circle")],"Standard.",["Bisector."],"Bisector.","medium",ch16),
  Q("icse10_ch16_ab_q7","icse10_ch16_angle_bisector_locus","Bisectors of intersecting lines are…",[c("Perpendicular to each other"),m("Parallel"),g("Same"),e("Random")],"Property.",["Perpendicular bisectors."],"⊥.","hard",ch16),
  Q("icse10_ch16_ab_q8","icse10_ch16_angle_bisector_locus","Construct bisector using…",[c("Compass"),m("Just ruler"),g("Random"),e("Eye")],"Standard.",["Compass arcs."],"Compass.","medium",ch16),
  // Ch16 circle_locus
  Q("icse10_ch16_cl_q1","icse10_ch16_circle_locus","Locus at fixed distance r from center = ?",[c("Circle"),m("Square"),g("Line"),e("Random")],"Definition.",["Circle."],"Circle.","easy",ch16),
  Q("icse10_ch16_cl_q2","icse10_ch16_circle_locus","Equation of circle center (0,0), r=5?",[c("x² + y² = 25"),m("x² + y² = 5"),g("(x−5)² + y² = 25"),e("Random")],"Standard.",["x²+y²=r²."],"= r².","medium",ch16),
  Q("icse10_ch16_cl_q3","icse10_ch16_circle_locus","Circle equation (x − h)² + (y − k)² = r². Center?",[c("(h, k)"),m("(−h, −k)"),g("(r, r)"),e("Random")],"Standard.",["(h, k)."],"(h, k).","medium",ch16),
  Q("icse10_ch16_cl_q4","icse10_ch16_circle_locus","Locus at distance 4 from (1, 2)?",[c("(x−1)² + (y−2)² = 16"),m("x² + y² = 16"),g("Random"),e("(x+1)² + (y+2)² = 16")],"Standard.",["Apply formula."],"Standard.","medium",ch16),
  Q("icse10_ch16_cl_q5","icse10_ch16_circle_locus","All points inside x² + y² = 25 are at distance __ from origin.",[c("Less than 5"),m("Exactly 5"),g("More than 5"),e("Random")],"Interior.",["< r."],"< r.","medium",ch16),
  Q("icse10_ch16_cl_q6","icse10_ch16_circle_locus","Locus equidistant from (0,0) and (4,0) AND at distance 3 from (0,0)?",[c("Intersection of two loci (perp bisector + circle)"),m("Just one"),g("Random"),e("Empty")],"Two conditions.",["Two loci intersect."],"Intersection.","hard",ch16),
  Q("icse10_ch16_cl_q7","icse10_ch16_circle_locus","Locus inside circle but outside another (concentric)?",[c("Annular region (ring)"),m("Random"),g("Just outside"),e("Cannot")],"Two boundaries.",["Ring shape."],"Ring.","hard",ch16),
  Q("icse10_ch16_cl_q8","icse10_ch16_circle_locus","x² + y² = 0 represents…",[c("Just origin (degenerate)"),m("Whole plane"),g("Circle"),e("Random")],"Single point.",["Only (0,0)."],"Origin.","hard",ch16),

  // Ch17 chord_properties
  Q("icse10_ch17_cp_q1","icse10_ch17_chord_properties","Perpendicular from center to chord…",[c("Bisects chord"),m("Random"),g("Doubles"),e("Doesn't help")],"Standard property.",["Bisects."],"Bisects.","medium",ch17),
  Q("icse10_ch17_cp_q2","icse10_ch17_chord_properties","Equal chords are…",[c("Equidistant from center"),m("Random"),g("Same chord"),e("Cannot exist")],"Property.",["Same distance."],"Equidistant.","medium",ch17),
  Q("icse10_ch17_cp_q3","icse10_ch17_chord_properties","Chord 8 cm, perp distance from center 3 cm. Radius?",[c("5"),m("11"),g("4"),e("13")],"Pythagoras.",["r² = 16 + 9 = 25, r=5."],"Pythagoras.","medium",ch17),
  Q("icse10_ch17_cp_q4","icse10_ch17_chord_properties","Diameter is the…",[c("Longest chord"),m("Shortest"),g("Random"),e("Just a line")],"Definition.",["Through center."],"Longest.","easy",ch17),
  Q("icse10_ch17_cp_q5","icse10_ch17_chord_properties","Chord that doesn't pass through center can be a diameter?",[m("Yes"),c("No"),g("Sometimes"),e("Cannot say")],"Diameter passes through center.",["By definition."],"No.","medium",ch17),
  Q("icse10_ch17_cp_q6","icse10_ch17_chord_properties","Length of chord 10, perp dist 5. Radius?",[c("√50 ≈ 7.07"),m("5"),g("10"),e("15")],"Pythagoras.",["r² = 25 + 25."],"Pythagoras.","medium",ch17),
  Q("icse10_ch17_cp_q7","icse10_ch17_chord_properties","If chord is 16 cm and radius 10 cm, perpendicular distance from center?",[c("6"),m("8"),g("12"),e("4")],"Pythagoras.",["r² − (chord/2)² = 100 − 64 = 36."],"Pythagoras.","hard",ch17),
  Q("icse10_ch17_cp_q8","icse10_ch17_chord_properties","Longer chord is __ to center.",[c("Closer"),m("Further"),g("Same"),e("Random")],"Inversely.",["Bigger chord = closer to center."],"Closer.","hard",ch17),
  // Ch17 arcs_angles
  Q("icse10_ch17_aa_q1","icse10_ch17_arcs_angles","Angle at center = ? × angle at circumference (same arc)",[c("2"),m("½"),g("1"),e("3")],"Inscribed angle.",["Standard theorem."],"2.","medium",ch17),
  Q("icse10_ch17_aa_q2","icse10_ch17_arcs_angles","Angle at center 80°, angle at circumference?",[c("40°"),m("80°"),g("160°"),e("20°")],"Half.",["80/2."],"Half.","medium",ch17),
  Q("icse10_ch17_aa_q3","icse10_ch17_arcs_angles","Angles in same segment are…",[c("Equal"),m("Different"),g("Sum 180"),e("Random")],"Property.",["All equal."],"Equal.","medium",ch17),
  Q("icse10_ch17_aa_q4","icse10_ch17_arcs_angles","Angle in semicircle is…",[c("90°"),m("180°"),g("60°"),e("Random")],"Thales' theorem.",["Always right angle."],"90°.","medium",ch17),
  Q("icse10_ch17_aa_q5","icse10_ch17_arcs_angles","If arc AB = 60° (central), arc AB at circumference?",[c("30°"),m("60°"),g("120°"),e("90°")],"Half.",["60/2."],"Half.","medium",ch17),
  Q("icse10_ch17_aa_q6","icse10_ch17_arcs_angles","Angle subtended by diameter at any point on circle?",[c("90°"),m("180°"),g("45°"),e("Random")],"Special case.",["Diameter = 180° central, /2 = 90°."],"Right angle.","medium",ch17),
  Q("icse10_ch17_aa_q7","icse10_ch17_arcs_angles","Angles in major segment vs minor segment relationship?",[c("Sum to 180°"),m("Equal"),g("Equal"),e("Cannot say")],"Opposite property.",["Cyclic property."],"Sum 180.","hard",ch17),
  Q("icse10_ch17_aa_q8","icse10_ch17_arcs_angles","Equal arcs subtend ___ angles at center.",[c("Equal"),m("Different"),g("Sum"),e("Random")],"Property.",["Same arc length = same central angle."],"Equal.","medium",ch17),
  // Ch17 cyclic_quadrilateral
  Q("icse10_ch17_cq_q1","icse10_ch17_cyclic_quadrilateral","Cyclic quadrilateral: opposite angles sum to:",[c("180°"),m("360°"),g("90°"),e("270°")],"Standard.",["Property."],"180°.","medium",ch17),
  Q("icse10_ch17_cq_q2","icse10_ch17_cyclic_quadrilateral","If one angle of cyclic quad = 70°, opposite?",[c("110°"),m("70°"),g("90°"),e("180°")],"Supplementary.",["180 − 70 = 110."],"180 − x.","medium",ch17),
  Q("icse10_ch17_cq_q3","icse10_ch17_cyclic_quadrilateral","Quadrilateral inscribed in circle is called…",[c("Cyclic"),m("Regular"),g("Square"),e("Random")],"Term.",["All vertices on circle."],"Cyclic.","easy",ch17),
  Q("icse10_ch17_cq_q4","icse10_ch17_cyclic_quadrilateral","Square is cyclic?",[c("Yes (all vertices on circle)"),m("No"),g("Sometimes"),e("Cannot say")],"Special case.",["Diagonals equal radii."],"Yes.","medium",ch17),
  Q("icse10_ch17_cq_q5","icse10_ch17_cyclic_quadrilateral","Rectangle is cyclic?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"All vertices on circle.",["Diagonals equal."],"Yes.","medium",ch17),
  Q("icse10_ch17_cq_q6","icse10_ch17_cyclic_quadrilateral","Sum of exterior angle + opposite interior of cyclic quad?",[c("Equal (180°)"),m("Different"),g("Cannot say"),e("Random")],"Property.",["Exterior = opposite interior."],"Equal.","hard",ch17),
  Q("icse10_ch17_cq_q7","icse10_ch17_cyclic_quadrilateral","If 3 angles of cyclic quad are 80°, 90°, 100°, fourth?",[c("90°"),m("100°"),g("180°"),e("Cannot")],"Sum 360, opposites pair.",["Pair 80+100=180. Others 90+90=180."],"Pair sum.","hard",ch17),
  Q("icse10_ch17_cq_q8","icse10_ch17_cyclic_quadrilateral","Not all quadrilaterals are cyclic?",[c("True"),m("False"),g("Sometimes"),e("Cannot say")],"True.",["E.g., random quadrilateral."],"True.","medium",ch17),
  // Ch17 circle_theorems
  Q("icse10_ch17_ct_q1","icse10_ch17_circle_theorems","Tangent-radius angle?",[c("90°"),m("180°"),g("45°"),e("Random")],"Always.",["Perp at point of tangency."],"90°.","easy",ch17),
  Q("icse10_ch17_ct_q2","icse10_ch17_circle_theorems","Equal arcs → equal chords. T/F",[c("True"),m("False"),g("Sometimes"),e("Cannot")],"Standard.",["Yes."],"True.","medium",ch17),
  Q("icse10_ch17_ct_q3","icse10_ch17_circle_theorems","Equal chords → equal arcs. T/F",[c("True"),m("False"),g("Sometimes"),e("Cannot")],"Converse.",["Also true."],"True.","medium",ch17),
  Q("icse10_ch17_ct_q4","icse10_ch17_circle_theorems","Two tangents from external point are…",[c("Equal length"),m("Different"),g("Sum 180"),e("Random")],"Property.",["Equal."],"Equal.","medium",ch17),
  Q("icse10_ch17_ct_q5","icse10_ch17_circle_theorems","Alternate segment theorem says…",[c("Tangent-chord angle = alternate segment angle"),m("Random"),g("Sum 180"),e("Equal radii")],"Theorem.",["Standard."],"Alt segment.","hard",ch17),
  Q("icse10_ch17_ct_q6","icse10_ch17_circle_theorems","Power of a point states…",[c("PA × PB = PC × PD"),m("Sum"),g("Random"),e("Equal")],"Theorem.",["Product equality."],"Power.","hard",ch17),
  Q("icse10_ch17_ct_q7","icse10_ch17_circle_theorems","Inscribed angle theorem central:",[c("Center angle = 2 × inscribed angle"),m("Equal"),g("Random"),e("Sum 180")],"Standard.",["Half-double."],"2×.","medium",ch17),
  Q("icse10_ch17_ct_q8","icse10_ch17_circle_theorems","Tangent perpendicular to radius at…",[c("Point of tangency"),m("Center"),g("Random"),e("End of diameter")],"Standard.",["Where touches."],"Tangent point.","medium",ch17),

  // Ch18 tangent_properties
  Q("icse10_ch18_tp_q1","icse10_ch18_tangent_properties","Tangent touches circle at __ point(s).",[c("1"),m("2"),g("0"),e("Infinite")],"Definition.",["Single point."],"1.","easy",ch18),
  Q("icse10_ch18_tp_q2","icse10_ch18_tangent_properties","Tangent perpendicular to radius at __",[c("Point of tangency"),m("Center"),g("Outside"),e("Random")],"Standard.",["Touches and ⊥."],"Point.","medium",ch18),
  Q("icse10_ch18_tp_q3","icse10_ch18_tangent_properties","Radius 3, tangent length 4. Distance from center to external point?",[c("5"),m("7"),g("12"),e("1")],"Pythagoras.",["r² + tan² = d²."],"Pythagoras.","medium",ch18),
  Q("icse10_ch18_tp_q4","icse10_ch18_tangent_properties","Tangent from external point P to circle is unique?",[m("Yes (only one)"),c("No (two tangents)"),g("Sometimes"),e("Cannot")],"Two.",["From external, 2 tangents."],"2.","medium",ch18),
  Q("icse10_ch18_tp_q5","icse10_ch18_tangent_properties","Tangents from external point are __ length.",[c("Equal"),m("Different"),g("Random"),e("Sum 180")],"Property.",["Same."],"Equal.","medium",ch18),
  Q("icse10_ch18_tp_q6","icse10_ch18_tangent_properties","Tangent length from P (5 cm from center) to circle radius 3?",[c("4"),m("5"),g("3"),e("8")],"Pythagoras.",["√(25−9) = 4."],"Pythagoras.","medium",ch18),
  Q("icse10_ch18_tp_q7","icse10_ch18_tangent_properties","Tangent from point ON circle?",[c("One tangent at that point"),m("Two"),g("None"),e("Random")],"Single.",["Just one (perp to radius)."],"One.","medium",ch18),
  Q("icse10_ch18_tp_q8","icse10_ch18_tangent_properties","Tangent from inside circle?",[c("Doesn't exist"),m("One"),g("Many"),e("Cannot")],"Inside.",["Inside point has no tangent."],"None.","hard",ch18),
  // Ch18 two_tangents
  Q("icse10_ch18_tt_q1","icse10_ch18_two_tangents","Two tangents from P are equal length. Property name?",[c("Tangent length theorem"),m("Random"),g("Pythagoras"),e("Just theorem")],"Standard.",["Tangent length theorem."],"Tangent length.","medium",ch18),
  Q("icse10_ch18_tt_q2","icse10_ch18_two_tangents","If tangents from P meet circle at A and B, then PA = ?",[c("PB"),m("Random"),g("Half"),e("Different")],"Equal.",["Same length."],"PB.","medium",ch18),
  Q("icse10_ch18_tt_q3","icse10_ch18_two_tangents","Angle between two tangents from P + central angle = ?",[c("180°"),m("90°"),g("360°"),e("Cannot")],"Cyclic quad property.",["Supplementary."],"180°.","hard",ch18),
  Q("icse10_ch18_tt_q4","icse10_ch18_two_tangents","Tangents PA, PB from P. Triangle OAP, OBP. Congruent?",[c("Yes (RHS)"),m("No"),g("Sometimes"),e("Cannot say")],"By RHS.",["Right angle, hypotenuse OP, side OA=OB=r."],"RHS.","hard",ch18),
  Q("icse10_ch18_tt_q5","icse10_ch18_two_tangents","Sum of two tangent lengths from P = ?",[c("2 × tangent length"),m("Random"),g("Diameter"),e("Cannot say")],"Equal.",["Both same."],"2 × each.","medium",ch18),
  Q("icse10_ch18_tt_q6","icse10_ch18_two_tangents","Line joining external point to center bisects…",[c("Angle between tangents"),m("Chord"),g("Random"),e("Diameter")],"Property.",["By symmetry."],"Bisects angle.","hard",ch18),
  Q("icse10_ch18_tt_q7","icse10_ch18_two_tangents","Distance from P to center 13, tangent 12, radius?",[c("5"),m("12"),g("13"),e("25")],"Pythagoras.",["r² = 169 − 144 = 25."],"Pythagoras.","medium",ch18),
  Q("icse10_ch18_tt_q8","icse10_ch18_two_tangents","If two tangents perpendicular, angle at center?",[c("90°"),m("180°"),g("45°"),e("Random")],"Cyclic supplementary.",["90 + 90 = 180. Center 90."],"90°.","hard",ch18),
  // Ch18 intersecting_chords
  Q("icse10_ch18_ic_q1","icse10_ch18_intersecting_chords","Two chords intersect inside: PA × PB = ?",[c("PC × PD"),m("Equal sum"),g("Random"),e("Just lengths")],"Theorem.",["Power of a point."],"= PC × PD.","medium",ch18),
  Q("icse10_ch18_ic_q2","icse10_ch18_intersecting_chords","Chord segments 3, 4 and x, 2. x = ?",[c("6"),m("12"),g("2"),e("8")],"3×4 = x×2.",["12 = 2x → x=6."],"Solve.","medium",ch18),
  Q("icse10_ch18_ic_q3","icse10_ch18_intersecting_chords","If chord segments 5 and 6, others equal length, each?",[c("√30"),m("11"),g("30"),e("Random")],"x² = 30.",["x = √30."],"√.","hard",ch18),
  Q("icse10_ch18_ic_q4","icse10_ch18_intersecting_chords","Two secants from external point: PA × PB = PC × PD applies?",[c("Yes (secant-secant)"),m("No"),g("Sometimes"),e("Cannot")],"Power of point.",["Applies to external too."],"Yes.","hard",ch18),
  Q("icse10_ch18_ic_q5","icse10_ch18_intersecting_chords","Tangent + secant from external: PT² = ?",[c("PA × PB (where PA, PB are secant segments)"),m("Random"),g("Just secant"),e("Equal")],"Theorem.",["Tangent² = secant product."],"Tangent².","hard",ch18),
  Q("icse10_ch18_ic_q6","icse10_ch18_intersecting_chords","Chord segments 6, 8. Other chord one segment 4, other?",[c("12"),m("6"),g("8"),e("48")],"6×8 = 4×x.",["48/4 = 12."],"Cross.","medium",ch18),
  Q("icse10_ch18_ic_q7","icse10_ch18_intersecting_chords","Power of a point applies…",[c("Inside or outside circle"),m("Just inside"),g("Just outside"),e("Cannot")],"Both.",["Generalizes."],"Both.","hard",ch18),
  Q("icse10_ch18_ic_q8","icse10_ch18_intersecting_chords","Two equal chords intersect. Segments…",[c("Equal corresponding pairs"),m("Sum"),g("Random"),e("Just equal length")],"Symmetry.",["By symmetry."],"Symmetric.","hard",ch18),
  // Ch18 alternate_segment
  Q("icse10_ch18_as_q1","icse10_ch18_alternate_segment","Tangent-chord angle = angle in __ segment.",[c("Alternate"),m("Same"),g("Random"),e("Opposite")],"Theorem.",["Alternate."],"Alternate.","medium",ch18),
  Q("icse10_ch18_as_q2","icse10_ch18_alternate_segment","Tangent-chord angle 50°. Alternate segment angle?",[c("50°"),m("40°"),g("130°"),e("90°")],"Equal.",["Same value."],"= 50°.","medium",ch18),
  Q("icse10_ch18_as_q3","icse10_ch18_alternate_segment","Identifies relationship between…",[c("Tangent angles and circle angles"),m("Random"),g("Radii"),e("Diameters")],"Application.",["Tangent vs inscribed angles."],"Tangent-inscribed.","hard",ch18),
  Q("icse10_ch18_as_q4","icse10_ch18_alternate_segment","Two angles in alternate segments are…",[c("Equal"),m("Sum 180"),g("Random"),e("Different")],"Property.",["Equal."],"Equal.","hard",ch18),
  Q("icse10_ch18_as_q5","icse10_ch18_alternate_segment","Tangent-chord 90° means chord is…",[c("Diameter"),m("Random"),g("Half"),e("None")],"Special case.",["Tangent ⊥ diameter at point."],"Diameter.","hard",ch18),
  Q("icse10_ch18_as_q6","icse10_ch18_alternate_segment","Tangent-chord theorem used to…",[c("Find unknown angles"),m("Decoration"),g("Random"),e("Cannot use")],"Application.",["Angles inside circle."],"Find angles.","medium",ch18),
  Q("icse10_ch18_as_q7","icse10_ch18_alternate_segment","If chord = diameter, tangent-chord angle?",[c("90°"),m("0°"),g("180°"),e("45°")],"Tangent ⊥ diameter.",["90°."],"90°.","hard",ch18),
  Q("icse10_ch18_as_q8","icse10_ch18_alternate_segment","Theorem is converse of…",[c("Tangent perpendicularity"),m("Pythagoras"),g("Inscribed angle"),e("None")],"Related to tangent.",["Tangent property converse."],"Tangent perp.","hard",ch18),

  // Ch19 construct_tangent
  Q("icse10_ch19_ct_q1","icse10_ch19_construct_tangent","To construct tangent from external point P:",[c("Find midpoint of OP, draw circle on it"),m("Random"),g("Just draw line"),e("Cannot")],"Standard method.",["Midpoint circle intersects original."],"Midpoint method.","hard",ch19),
  Q("icse10_ch19_ct_q2","icse10_ch19_construct_tangent","Number of tangents from external point?",[c("2"),m("1"),g("0"),e("Infinite")],"Always 2.",["From external, two tangents."],"2.","easy",ch19),
  Q("icse10_ch19_ct_q3","icse10_ch19_construct_tangent","From point on circle: tangents?",[c("1 (at that point)"),m("2"),g("0"),e("Infinite")],"Single.",["One tangent at the point."],"1.","medium",ch19),
  Q("icse10_ch19_ct_q4","icse10_ch19_construct_tangent","From point inside circle: tangents?",[c("0 (none)"),m("1"),g("2"),e("Infinite")],"None.",["No tangent from inside."],"0.","medium",ch19),
  Q("icse10_ch19_ct_q5","icse10_ch19_construct_tangent","Tangent construction needs compass + ruler?",[c("Yes"),m("No, just ruler"),g("Just compass"),e("None")],"Both.",["Standard tools."],"Both.","easy",ch19),
  Q("icse10_ch19_ct_q6","icse10_ch19_construct_tangent","Tangent angle from external point: bisected by line to center?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot")],"Symmetry.",["By tangent length theorem."],"Yes.","medium",ch19),
  Q("icse10_ch19_ct_q7","icse10_ch19_construct_tangent","After constructing tangent, verify by…",[c("Perpendicularity at point of contact"),m("Length"),g("Random"),e("Just draw")],"Property.",["Tangent ⊥ radius."],"⊥ check.","medium",ch19),
  Q("icse10_ch19_ct_q8","icse10_ch19_construct_tangent","Two tangents from P intersect circle at A, B. PA, PB are…",[c("Equal"),m("Different"),g("Random"),e("Half")],"Tangent length theorem.",["Equal length tangents."],"Equal.","medium",ch19),
  // Ch19 construct_circumscribe
  Q("icse10_ch19_cc_q1","icse10_ch19_construct_circumscribe","Circumscribed circle passes through:",[c("All 3 vertices"),m("Random"),g("Midpoints"),e("Sides only")],"Definition.",["All vertices."],"Vertices.","medium",ch19),
  Q("icse10_ch19_cc_q2","icse10_ch19_construct_circumscribe","Center of circumcircle is at intersection of:",[c("Perpendicular bisectors"),m("Angle bisectors"),g("Altitudes"),e("Medians")],"Standard.",["Perp bisectors."],"Perp bisectors.","medium",ch19),
  Q("icse10_ch19_cc_q3","icse10_ch19_construct_circumscribe","Number of perp bisectors needed?",[c("2 (enough)"),m("3"),g("1"),e("0")],"Two intersect = circumcenter.",["Third confirms."],"2.","medium",ch19),
  Q("icse10_ch19_cc_q4","icse10_ch19_construct_circumscribe","Radius of circumcircle = distance from center to:",[c("Any vertex"),m("Side"),g("Random"),e("Center")],"All equal.",["Center to vertex = R."],"Vertex.","medium",ch19),
  Q("icse10_ch19_cc_q5","icse10_ch19_construct_circumscribe","Circumcenter inside or outside triangle?",[c("Depends on triangle type"),m("Always inside"),g("Always outside"),e("Cannot tell")],"Varies.",["Acute = inside, obtuse = outside."],"Depends.","hard",ch19),
  Q("icse10_ch19_cc_q6","icse10_ch19_construct_circumscribe","Right triangle: circumcenter at:",[c("Midpoint of hypotenuse"),m("Right angle vertex"),g("Center of sides"),e("Random")],"Standard.",["Hypotenuse midpoint."],"Hyp midpoint.","hard",ch19),
  Q("icse10_ch19_cc_q7","icse10_ch19_construct_circumscribe","Steps: construct perp bisectors of __ sides at minimum.",[c("2"),m("3"),g("1"),e("All")],"Two enough.",["Two perp bisectors enough."],"2.","medium",ch19),
  Q("icse10_ch19_cc_q8","icse10_ch19_construct_circumscribe","After finding circumcenter, draw circle with radius to…",[c("Any vertex"),m("Any side"),g("Random"),e("Centroid")],"Equidistant.",["To any vertex (all equal)."],"Vertex.","medium",ch19),
  // Ch19 construct_inscribe
  Q("icse10_ch19_ci_q1","icse10_ch19_construct_inscribe","Inscribed circle (incircle) touches:",[c("All 3 sides"),m("Vertices"),g("Random"),e("Just one")],"Definition.",["All sides from inside."],"Sides.","medium",ch19),
  Q("icse10_ch19_ci_q2","icse10_ch19_construct_inscribe","Incenter is at intersection of:",[c("Angle bisectors"),m("Perp bisectors"),g("Altitudes"),e("Medians")],"Standard.",["Angle bisectors."],"Angle bisectors.","medium",ch19),
  Q("icse10_ch19_ci_q3","icse10_ch19_construct_inscribe","Incenter is always:",[c("Inside triangle"),m("Outside"),g("On vertex"),e("Random")],"Property.",["Always interior."],"Inside.","medium",ch19),
  Q("icse10_ch19_ci_q4","icse10_ch19_construct_inscribe","Radius of incircle = distance from incenter to:",[c("Any side"),m("Vertex"),g("Random"),e("Center")],"Perpendicular distance.",["To side, perp."],"Side.","medium",ch19),
  Q("icse10_ch19_ci_q5","icse10_ch19_construct_inscribe","Number of angle bisectors needed?",[c("2"),m("3"),g("1"),e("0")],"Two intersect.",["Three concurrent."],"2.","medium",ch19),
  Q("icse10_ch19_ci_q6","icse10_ch19_construct_inscribe","Inradius formula for triangle of sides a, b, c, area A:",[c("A/s where s = (a+b+c)/2"),m("Random"),g("a/3"),e("(a+b+c)/3")],"Standard.",["Inradius = Area/semi-perimeter."],"A/s.","hard",ch19),
  Q("icse10_ch19_ci_q7","icse10_ch19_construct_inscribe","Incircle vs circumcircle:",[c("Incircle inside (touches sides), circum outside (through vertices)"),m("Same"),g("Random"),e("Reversed")],"Different.",["Distinct circles."],"Different.","medium",ch19),
  Q("icse10_ch19_ci_q8","icse10_ch19_construct_inscribe","Distance from incenter to all sides is __",[c("Equal"),m("Different"),g("Random"),e("Cannot say")],"Property.",["By definition."],"Equal.","medium",ch19),
  // Ch19 construct_problems
  Q("icse10_ch19_cp_q1","icse10_ch19_construct_problems","Constructing 60° angle:",[c("Compass arc + arc"),m("Random"),g("Just ruler"),e("Cannot")],"Standard.",["Two equal arcs."],"Compass.","medium",ch19),
  Q("icse10_ch19_cp_q2","icse10_ch19_construct_problems","Construct perpendicular at a point on a line:",[c("Equal arcs from point + intersection"),m("Random"),g("Eye estimate"),e("Cannot")],"Standard.",["Compass + ruler."],"Arc method.","medium",ch19),
  Q("icse10_ch19_cp_q3","icse10_ch19_construct_problems","Bisect angle:",[c("Compass arcs"),m("Just ruler"),g("Random"),e("Cannot")],"Standard.",["From vertex + intersections."],"Compass.","medium",ch19),
  Q("icse10_ch19_cp_q4","icse10_ch19_construct_problems","Constructing equilateral triangle requires:",[c("3 equal arc-radii"),m("Random"),g("Different sides"),e("Cannot")],"Standard.",["Same compass setting."],"Equal arcs.","medium",ch19),
  Q("icse10_ch19_cp_q5","icse10_ch19_construct_problems","To draw a circle of radius 5 cm through 2 points 8 cm apart, possible if…",[c("Yes (8 < 10 = diameter)"),m("No"),g("Sometimes"),e("Cannot")],"Distance constraints.",["Diameter ≥ distance."],"Yes.","hard",ch19),
  Q("icse10_ch19_cp_q6","icse10_ch19_construct_problems","Important to keep construction lines:",[c("Light and visible"),m("Bold"),g("Random"),e("Erased")],"Standard.",["Show all arcs."],"Light + visible.","medium",ch19),
  Q("icse10_ch19_cp_q7","icse10_ch19_construct_problems","To bisect a chord externally, use:",[c("Perpendicular bisector technique"),m("Random"),g("Just measure"),e("Cannot")],"Standard.",["Perp bisector."],"Perp bisector.","hard",ch19),
  Q("icse10_ch19_cp_q8","icse10_ch19_construct_problems","Use of constructions in geometry:",[c("Precise figure drawing"),m("Decoration"),g("Random"),e("Cannot")],"Application.",["Precise drawings."],"Precision.","easy",ch19),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} ICSE Class 10 questions (Ch15-19).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
