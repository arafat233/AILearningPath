/** ICSE Class 10 Math — Questions Ch20-22 (Mensuration, Trig Identities, Heights/Distances) */
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
const ch20="Cylinder, Cone and Sphere", ch21="Trigonometrical Identities", ch22="Heights and Distances";

const questions = [
  // Ch20 cylinder_volume
  Q("icse10_ch20_cv_q1","icse10_ch20_cylinder_volume","Volume of cylinder formula:",[c("πr²h"),m("πrh"),g("2πrh"),e("(4/3)πr³")],"Standard.",["Area × height."],"πr²h.","easy",ch20),
  Q("icse10_ch20_cv_q2","icse10_ch20_cylinder_volume","r=7, h=10. Volume?",[c("1540"),m("440"),g("154"),e("770")],"22/7 × 49 × 10.",["= 1540."],"πr²h.","medium",ch20),
  Q("icse10_ch20_cv_q3","icse10_ch20_cylinder_volume","Curved surface area of cylinder:",[c("2πrh"),m("πr²"),g("πrh"),e("4πr²")],"Standard.",["Unrolled rectangle."],"2πrh.","medium",ch20),
  Q("icse10_ch20_cv_q4","icse10_ch20_cylinder_volume","Total surface area of cylinder:",[c("2πr(r+h)"),m("2πrh"),g("πr²h"),e("πr(r+h)")],"CSA + 2 circles.",["2πrh + 2πr² = 2πr(h+r)."],"= 2πr(r+h).","hard",ch20),
  Q("icse10_ch20_cv_q5","icse10_ch20_cylinder_volume","r=7, h=10. CSA?",[c("440"),m("154"),g("1540"),e("220")],"2 × 22/7 × 7 × 10.",["= 440."],"2πrh.","medium",ch20),
  Q("icse10_ch20_cv_q6","icse10_ch20_cylinder_volume","r=10, h=14. Volume?",[c("4400"),m("440"),g("1400"),e("2200")],"22/7 × 100 × 14.",["= 4400."],"πr²h.","medium",ch20),
  Q("icse10_ch20_cv_q7","icse10_ch20_cylinder_volume","Hollow cylinder volume = ?",[c("π(R² − r²)h"),m("πR²h"),g("πr²h"),e("Random")],"Outer − inner.",["Both outer and inner volume."],"Diff.","hard",ch20),
  Q("icse10_ch20_cv_q8","icse10_ch20_cylinder_volume","Cylinder radius 7, height 21. CSA?",[c("924"),m("462"),g("1848"),e("231")],"2 × 22/7 × 7 × 21.",["= 924."],"2πrh.","medium",ch20),
  // Ch20 cone_surface
  Q("icse10_ch20_co_q1","icse10_ch20_cone_surface","Cone volume:",[c("(1/3)πr²h"),m("πr²h"),g("πr³"),e("πrh")],"1/3 of cylinder.",["Standard."],"⅓πr²h.","medium",ch20),
  Q("icse10_ch20_co_q2","icse10_ch20_cone_surface","Slant height formula:",[c("l = √(r² + h²)"),m("l = r + h"),g("l = πrh"),e("Random")],"Pythagoras.",["Right triangle r, h, l."],"Pythagoras.","medium",ch20),
  Q("icse10_ch20_co_q3","icse10_ch20_cone_surface","r=3, h=4. l = ?",[c("5"),m("7"),g("12"),e("25")],"√(9+16).",["= 5."],"Pythagoras.","medium",ch20),
  Q("icse10_ch20_co_q4","icse10_ch20_cone_surface","Curved surface of cone:",[c("πrl"),m("πr²"),g("πr²h"),e("2πrl")],"Standard.",["Triangle unfolds."],"πrl.","medium",ch20),
  Q("icse10_ch20_co_q5","icse10_ch20_cone_surface","Total surface of cone:",[c("πr(r+l)"),m("πr²"),g("πrl"),e("2πrh")],"CSA + base.",["πrl + πr²."],"= πr(r+l).","hard",ch20),
  Q("icse10_ch20_co_q6","icse10_ch20_cone_surface","r=3, h=4, volume?",[c("12π"),m("π × 12"),g("36π"),e("πr × h")],"⅓π×9×4.",["= 12π."],"⅓πr²h.","medium",ch20),
  Q("icse10_ch20_co_q7","icse10_ch20_cone_surface","r=7, h=24. Slant?",[c("25"),m("31"),g("17"),e("23")],"√(49+576).",["= 25."],"Pythagoras.","medium",ch20),
  Q("icse10_ch20_co_q8","icse10_ch20_cone_surface","Cone CSA vs cylinder CSA (same r, h): which bigger?",[c("Cylinder usually (since l>h)"),m("Cone"),g("Equal"),e("Cannot say")],"Comparing.",["2πrh vs πrl, depends."],"Depends.","hard",ch20),
  // Ch20 sphere_area
  Q("icse10_ch20_sp_q1","icse10_ch20_sphere_area","Sphere volume:",[c("(4/3)πr³"),m("4πr²"),g("πr²"),e("πr³")],"Standard.",["Volume formula."],"4/3πr³.","medium",ch20),
  Q("icse10_ch20_sp_q2","icse10_ch20_sphere_area","Sphere surface area:",[c("4πr²"),m("πr²"),g("4πr³"),e("2πr²")],"Standard.",["Surface area formula."],"4πr².","medium",ch20),
  Q("icse10_ch20_sp_q3","icse10_ch20_sphere_area","r=7. Volume?",[c("1437.33 (4/3 × π × 343)"),m("154"),g("770"),e("44")],"4/3 × 22/7 × 343.",["= 1437.33."],"Apply.","hard",ch20),
  Q("icse10_ch20_sp_q4","icse10_ch20_sphere_area","r=7. Surface area?",[c("616"),m("154"),g("44"),e("196π")],"4 × 22/7 × 49.",["= 616."],"4πr².","medium",ch20),
  Q("icse10_ch20_sp_q5","icse10_ch20_sphere_area","Hemisphere volume:",[c("(2/3)πr³"),m("(4/3)πr³"),g("πr³"),e("(1/2)πr³")],"Half sphere.",["Half of full sphere volume."],"⅔πr³.","medium",ch20),
  Q("icse10_ch20_sp_q6","icse10_ch20_sphere_area","Hemisphere curved surface:",[c("2πr²"),m("4πr²"),g("πr²"),e("3πr²")],"Half sphere's CSA.",["Half."],"2πr².","medium",ch20),
  Q("icse10_ch20_sp_q7","icse10_ch20_sphere_area","Hemisphere total surface:",[c("3πr² (CSA + base circle)"),m("2πr²"),g("4πr²"),e("πr²")],"CSA + flat.",["2πr² + πr² = 3πr²."],"3πr².","hard",ch20),
  Q("icse10_ch20_sp_q8","icse10_ch20_sphere_area","If r doubles, volume becomes…",[c("8 times (2³)"),m("2 times"),g("4 times"),e("Same")],"r³ scaling.",["Cube."],"× 8.","hard",ch20),
  // Ch20 combined_solids
  Q("icse10_ch20_cs_q1","icse10_ch20_combined_solids","Cylinder + cone (same base): volume = ?",[c("πr²h_cyl + (1/3)πr²h_cone"),m("πr²(h+h)"),g("Random"),e("(4/3)πr³")],"Sum.",["Add components."],"Add.","medium",ch20),
  Q("icse10_ch20_cs_q2","icse10_ch20_combined_solids","Hemisphere on cylinder: V = ?",[c("πr²h + (2/3)πr³"),m("πr²h"),g("(4/3)πr³"),e("Random")],"Sum.",["Cylinder + hemisphere."],"Sum.","medium",ch20),
  Q("icse10_ch20_cs_q3","icse10_ch20_combined_solids","Surface of combined solids: subtract overlapping circles?",[c("Yes"),m("No"),g("Sometimes"),e("Cannot say")],"Don't count shared surface.",["Subtract shared."],"Subtract shared.","hard",ch20),
  Q("icse10_ch20_cs_q4","icse10_ch20_combined_solids","Ice cream cone (cone + hemisphere) volume:",[c("(1/3)πr²h + (2/3)πr³"),m("πr²h"),g("(4/3)πr³"),e("Random")],"Sum.",["Two components."],"Sum.","medium",ch20),
  Q("icse10_ch20_cs_q5","icse10_ch20_combined_solids","Cylinder with hemispherical ends: total volume?",[c("πr²h + (4/3)πr³"),m("πr²h"),g("(2/3)πr³"),e("Random")],"Cylinder + two hemispheres.",["Cylinder + sphere."],"+ full sphere.","hard",ch20),
  Q("icse10_ch20_cs_q6","icse10_ch20_combined_solids","Surface of capsule (cylinder + 2 hemispheres):",[c("2πrh + 4πr²"),m("πr²h"),g("Random"),e("4πr²")],"CSA + sphere surface.",["Add both surfaces."],"Sum.","hard",ch20),
  Q("icse10_ch20_cs_q7","icse10_ch20_combined_solids","Pyramid + base: total surface includes…",[c("Base + slant faces"),m("Just slant"),g("Just base"),e("Random")],"Both.",["All visible faces."],"All faces.","medium",ch20),
  Q("icse10_ch20_cs_q8","icse10_ch20_combined_solids","Why subtract overlapping in combined surface?",[c("Shared surface not visible"),m("Random"),g("Always add"),e("Cannot")],"Hidden.",["Inside boundary."],"Hidden.","hard",ch20),

  // Ch21 basic_identities
  Q("icse10_ch21_bi_q1","icse10_ch21_basic_identities","sin²θ + cos²θ = ?",[c("1"),m("0"),g("2"),e("sin 2θ")],"Pythagorean identity.",["Fundamental."],"1.","easy",ch21),
  Q("icse10_ch21_bi_q2","icse10_ch21_basic_identities","1 + tan²θ = ?",[c("sec²θ"),m("cos²θ"),g("sin²θ"),e("1")],"Identity.",["Divide first by cos²."],"sec²θ.","medium",ch21),
  Q("icse10_ch21_bi_q3","icse10_ch21_basic_identities","1 + cot²θ = ?",[c("cosec²θ"),m("sec²θ"),g("sin²θ"),e("1")],"Identity.",["Divide first by sin²."],"cosec²θ.","medium",ch21),
  Q("icse10_ch21_bi_q4","icse10_ch21_basic_identities","If sin θ = 3/5, cos θ?",[c("4/5"),m("3/5"),g("5/3"),e("5/4")],"Pythagorean.",["√(1 − 9/25) = 4/5."],"Apply identity.","medium",ch21),
  Q("icse10_ch21_bi_q5","icse10_ch21_basic_identities","tan θ × cot θ = ?",[c("1"),m("0"),g("2"),e("sin θ × cos θ")],"Reciprocals.",["tan × 1/tan."],"1.","easy",ch21),
  Q("icse10_ch21_bi_q6","icse10_ch21_basic_identities","sin θ × cosec θ = ?",[c("1"),m("0"),g("sin² θ"),e("2")],"Reciprocals.",["sin × 1/sin."],"1.","easy",ch21),
  Q("icse10_ch21_bi_q7","icse10_ch21_basic_identities","cos θ × sec θ = ?",[c("1"),m("0"),g("cos² θ"),e("2")],"Reciprocals.",["cos × 1/cos."],"1.","easy",ch21),
  Q("icse10_ch21_bi_q8","icse10_ch21_basic_identities","If sec θ = 5/3, tan θ?",[c("4/3"),m("3/4"),g("5/3"),e("5/4")],"Pythagorean.",["1 + tan² = 25/9. tan² = 16/9. tan = 4/3."],"Use identity.","hard",ch21),
  // Ch21 complementary_angles
  Q("icse10_ch21_ca_q1","icse10_ch21_complementary_angles","sin(90° − θ) = ?",[c("cos θ"),m("sin θ"),g("−sin θ"),e("tan θ")],"Standard.",["Complementary identity."],"cos θ.","medium",ch21),
  Q("icse10_ch21_ca_q2","icse10_ch21_complementary_angles","cos(90° − θ) = ?",[c("sin θ"),m("cos θ"),g("−cos θ"),e("tan θ")],"Standard.",["Complementary."],"sin θ.","medium",ch21),
  Q("icse10_ch21_ca_q3","icse10_ch21_complementary_angles","tan(90° − θ) = ?",[c("cot θ"),m("tan θ"),g("−tan θ"),e("sec θ")],"Standard.",["Reciprocal."],"cot θ.","medium",ch21),
  Q("icse10_ch21_ca_q4","icse10_ch21_complementary_angles","sin 60° = cos ?",[c("30°"),m("60°"),g("90°"),e("Random")],"Comp = 30°.",["90 − 60 = 30."],"= 30°.","medium",ch21),
  Q("icse10_ch21_ca_q5","icse10_ch21_complementary_angles","cot(90° − θ) = ?",[c("tan θ"),m("cot θ"),g("−tan θ"),e("Random")],"Standard.",["Swap."],"tan θ.","medium",ch21),
  Q("icse10_ch21_ca_q6","icse10_ch21_complementary_angles","sec(90° − θ) = ?",[c("cosec θ"),m("sec θ"),g("−sec θ"),e("Random")],"Standard.",["Swap."],"cosec θ.","hard",ch21),
  Q("icse10_ch21_ca_q7","icse10_ch21_complementary_angles","cosec(90° − θ) = ?",[c("sec θ"),m("cosec θ"),g("−cosec θ"),e("Random")],"Standard.",["Swap."],"sec θ.","hard",ch21),
  Q("icse10_ch21_ca_q8","icse10_ch21_complementary_angles","Why complementary?",[c("Two angles sum to 90°"),m("Sum 180"),g("Random"),e("Equal")],"Definition.",["Complementary = 90° sum."],"Sum 90°.","medium",ch21),
  // Ch21 trig_tables
  Q("icse10_ch21_tt_q1","icse10_ch21_trig_tables","Trig tables to __ decimal places.",[c("4"),m("2"),g("6"),e("Random")],"Standard.",["Four-figure tables."],"4.","easy",ch21),
  Q("icse10_ch21_tt_q2","icse10_ch21_trig_tables","sin 30° = ?",[c("0.5"),m("0.866"),g("1"),e("0")],"Standard.",["Half."],"½.","easy",ch21),
  Q("icse10_ch21_tt_q3","icse10_ch21_trig_tables","cos 60° = ?",[c("0.5"),m("0.866"),g("1"),e("0")],"Complement.",["Same as sin 30."],"½.","easy",ch21),
  Q("icse10_ch21_tt_q4","icse10_ch21_trig_tables","tan 45° = ?",[c("1"),m("0"),g("√2"),e("0.5")],"Standard.",["sin = cos = 1/√2."],"1.","easy",ch21),
  Q("icse10_ch21_tt_q5","icse10_ch21_trig_tables","sin 45° = ?",[c("1/√2 ≈ 0.707"),m("0.5"),g("1"),e("0.866")],"Standard.",["= cos 45°."],"1/√2.","easy",ch21),
  Q("icse10_ch21_tt_q6","icse10_ch21_trig_tables","cos 30° = ?",[c("√3/2 ≈ 0.866"),m("0.5"),g("1"),e("0.707")],"Standard.",["Triangle."],"√3/2.","easy",ch21),
  Q("icse10_ch21_tt_q7","icse10_ch21_trig_tables","tan 60° = ?",[c("√3"),m("1"),g("1/√3"),e("0.5")],"Standard.",["sin/cos = (√3/2)/(½)."],"√3.","medium",ch21),
  Q("icse10_ch21_tt_q8","icse10_ch21_trig_tables","Interpolation in tables for…",[c("Values not directly listed"),m("Random"),g("Decoration"),e("Cannot")],"Use neighbors.",["Linear interpolation."],"Between values.","hard",ch21),
  // Ch21 identity_proofs
  Q("icse10_ch21_ip_q1","icse10_ch21_identity_proofs","Prove: (1 − cos θ)(1 + cos θ) = ?",[c("sin² θ"),m("cos² θ"),g("1 − 2cos θ"),e("Random")],"Diff of squares.",["1 − cos²θ = sin²θ."],"sin².","medium",ch21),
  Q("icse10_ch21_ip_q2","icse10_ch21_identity_proofs","Prove: sec²θ − tan²θ = ?",[c("1"),m("0"),g("sin²θ"),e("cos²θ")],"Identity.",["From 1 + tan² = sec²."],"= 1.","medium",ch21),
  Q("icse10_ch21_ip_q3","icse10_ch21_identity_proofs","cosec²θ − cot²θ = ?",[c("1"),m("sin²θ"),g("0"),e("cos²θ")],"Identity.",["From 1 + cot² = cosec²."],"= 1.","medium",ch21),
  Q("icse10_ch21_ip_q4","icse10_ch21_identity_proofs","(sin θ + cos θ)² = ?",[c("1 + 2sin θ cos θ"),m("1"),g("sin²θ"),e("Random")],"Expand.",["a² + 2ab + b²."],"Expand.","hard",ch21),
  Q("icse10_ch21_ip_q5","icse10_ch21_identity_proofs","sin² A − cos² A = ?",[c("−cos 2A or −(cos² − sin²)"),m("1"),g("Random"),e("Cannot")],"Difference.",["Identity."],"−cos 2A.","hard",ch21),
  Q("icse10_ch21_ip_q6","icse10_ch21_identity_proofs","If sin θ = ⅗, tan² θ + 1 = ?",[c("sec²θ = 25/16"),m("1"),g("25/9"),e("Random")],"Identity.",["sec²θ = 1/cos²θ."],"sec²θ.","hard",ch21),
  Q("icse10_ch21_ip_q7","icse10_ch21_identity_proofs","Identities used in…",[c("Simplification, proofs"),m("Random"),g("Decoration"),e("Cannot")],"Application.",["Simplify trig expressions."],"Apply.","medium",ch21),
  Q("icse10_ch21_ip_q8","icse10_ch21_identity_proofs","Prove: 1/(1+sin θ) + 1/(1−sin θ) = ?",[c("2/cos²θ = 2sec²θ"),m("Random"),g("1"),e("0")],"Combine.",["Common denom 1−sin²θ = cos²θ."],"= 2sec²θ.","hard",ch21),

  // Ch22 angle_elevation
  Q("icse10_ch22_ae_q1","icse10_ch22_angle_elevation","Angle of elevation is measured…",[c("From horizontal upward"),m("Downward"),g("Random"),e("Both")],"Definition.",["Looking up."],"Up from horiz.","easy",ch22),
  Q("icse10_ch22_ae_q2","icse10_ch22_angle_elevation","From 100 m away, top of building at 30°. Height = ?",[c("100 × tan 30° ≈ 57.7"),m("100"),g("50"),e("100 × cos 30°")],"tan.",["Opposite / adjacent = height/distance."],"tan × distance.","medium",ch22),
  Q("icse10_ch22_ae_q3","icse10_ch22_angle_elevation","Angle of elevation 45°, distance 20 m. Height?",[c("20"),m("10"),g("40"),e("20√2")],"tan 45 = 1.",["20 × 1 = 20."],"= distance.","medium",ch22),
  Q("icse10_ch22_ae_q4","icse10_ch22_angle_elevation","Tower 50 m, distance d. Angle 60°. d = ?",[c("50/√3"),m("50"),g("50√3"),e("100")],"tan 60 = √3 = 50/d.",["d = 50/√3."],"Solve.","hard",ch22),
  Q("icse10_ch22_ae_q5","icse10_ch22_angle_elevation","Higher object → larger or smaller elevation?",[c("Larger (closer to vertical)"),m("Smaller"),g("Same"),e("Cannot say")],"Property.",["Bigger object → bigger angle."],"Larger.","medium",ch22),
  Q("icse10_ch22_ae_q6","icse10_ch22_angle_elevation","Sun angle of elevation when shadow equals height?",[c("45°"),m("30°"),g("60°"),e("90°")],"tan = 1.",["Equal sides → 45°."],"45°.","hard",ch22),
  Q("icse10_ch22_ae_q7","icse10_ch22_angle_elevation","From distance 100m, top at 30°. Height ≈ ?",[c("57.7m"),m("100m"),g("50m"),e("173m")],"tan 30 = 1/√3.",["100 × 1/√3."],"Apply tan.","medium",ch22),
  Q("icse10_ch22_ae_q8","icse10_ch22_angle_elevation","If elevation changes from 30° to 60°, distance ___",[c("Decreases"),m("Increases"),g("Same"),e("Random")],"Closer = bigger angle.",["Inverse relation."],"Decreases.","medium",ch22),
  // Ch22 angle_depression
  Q("icse10_ch22_ad_q1","icse10_ch22_angle_depression","Angle of depression is measured…",[c("From horizontal downward"),m("Up"),g("Random"),e("Both")],"Definition.",["Looking down."],"Down.","easy",ch22),
  Q("icse10_ch22_ad_q2","icse10_ch22_angle_depression","From cliff 50m, boat at 30° depression. Distance to boat?",[c("50√3 ≈ 86.6"),m("50"),g("100"),e("25")],"tan 30 = 50/d.",["d = 50/(1/√3) = 50√3."],"Apply.","medium",ch22),
  Q("icse10_ch22_ad_q3","icse10_ch22_angle_depression","Angle of depression from tower top to ground point equals…",[c("Angle of elevation from ground to top"),m("Different"),g("90°"),e("Cannot say")],"Alternate angles.",["Same value."],"Equal.","medium",ch22),
  Q("icse10_ch22_ad_q4","icse10_ch22_angle_depression","Depression 60°, height 100 m. Horizontal distance?",[c("100/√3"),m("100"),g("100√3"),e("200")],"tan 60 = 100/d.",["d = 100/√3."],"Apply.","medium",ch22),
  Q("icse10_ch22_ad_q5","icse10_ch22_angle_depression","From 30m tall building, car at 30° depression. Distance?",[c("30√3 ≈ 51.96 m"),m("30"),g("60"),e("15")],"tan 30 = 30/d.",["d = 30/(1/√3) = 30√3."],"Apply.","medium",ch22),
  Q("icse10_ch22_ad_q6","icse10_ch22_angle_depression","Depression angle from light house 100m, ship at 45°. Distance?",[c("100"),m("141"),g("200"),e("50")],"tan 45 = 1 = 100/d.",["d = 100."],"= height.","medium",ch22),
  Q("icse10_ch22_ad_q7","icse10_ch22_angle_depression","If object closer, depression angle…",[c("Larger"),m("Smaller"),g("Same"),e("Random")],"Inverse.",["Bigger angle for closer."],"Larger.","medium",ch22),
  Q("icse10_ch22_ad_q8","icse10_ch22_angle_depression","Depression problem uses…",[c("Right triangle + tan"),m("Random"),g("No math"),e("Direct measurement")],"Standard.",["Like elevation."],"Right triangle.","medium",ch22),
  // Ch22 height_problems
  Q("icse10_ch22_hp_q1","icse10_ch22_height_problems","Tree 20m, shadow 10m. Sun elevation?",[c("arctan 2 ≈ 63.4°"),m("45°"),g("60°"),e("30°")],"tan = 2.",["arctan 2."],"arctan.","medium",ch22),
  Q("icse10_ch22_hp_q2","icse10_ch22_height_problems","Building height h, distance d. tan(angle) = ?",[c("h/d"),m("d/h"),g("h+d"),e("Random")],"Standard.",["Opp/adj."],"h/d.","easy",ch22),
  Q("icse10_ch22_hp_q3","icse10_ch22_height_problems","If angle = 60°, distance = 10 m. Height?",[c("10√3 ≈ 17.3"),m("10"),g("5"),e("20")],"tan 60 = √3.",["h = d × √3."],"Apply.","medium",ch22),
  Q("icse10_ch22_hp_q4","icse10_ch22_height_problems","From two points 50m apart, angles of elevation to top: 30° and 60°. Tower height?",[c("Use system of equations"),m("75 m"),g("Random"),e("100 m")],"Two equations.",["d × √3 = (d+50)/√3 × √3 / no, set up..."],"Solve.","hard",ch22),
  Q("icse10_ch22_hp_q5","icse10_ch22_height_problems","Boy 1.6m tall, tower 80m. Distance for elevation 60°?",[c("(80−1.6)/√3 ≈ 45.3"),m("80/√3"),g("80"),e("Random")],"Effective height.",["Subtract eye height."],"Apply.","hard",ch22),
  Q("icse10_ch22_hp_q6","icse10_ch22_height_problems","Pole 9m, shadow 9m. Angle?",[c("45°"),m("60°"),g("30°"),e("90°")],"tan = 1.",["= 45°."],"= 45°.","easy",ch22),
  Q("icse10_ch22_hp_q7","icse10_ch22_height_problems","If angle doubles, height does not double because…",[c("tan is non-linear"),m("Linear"),g("Random"),e("Same")],"Trigonometric.",["tan grows non-linearly."],"Non-linear.","hard",ch22),
  Q("icse10_ch22_hp_q8","icse10_ch22_height_problems","Heights problem strategy:",[c("Identify right triangle, apply tan"),m("Random"),g("Just measure"),e("Cannot")],"Standard.",["Set up triangle."],"Triangle.","medium",ch22),
  // Ch22 distance_problems
  Q("icse10_ch22_dp_q1","icse10_ch22_distance_problems","Building 30m, elevation 45°. Distance?",[c("30 m"),m("15"),g("60"),e("30√2")],"tan 45 = 1.",["d = h."],"= h.","medium",ch22),
  Q("icse10_ch22_dp_q2","icse10_ch22_distance_problems","tan 45° = ?",[c("1"),m("√2"),g("0"),e("Random")],"Standard.",["Equal sides."],"= 1.","easy",ch22),
  Q("icse10_ch22_dp_q3","icse10_ch22_distance_problems","tan 30° = ?",[c("1/√3"),m("√3"),g("1"),e("0.5")],"Standard.",["sin/cos = (½)/(√3/2)."],"1/√3.","medium",ch22),
  Q("icse10_ch22_dp_q4","icse10_ch22_distance_problems","tan 60° = ?",[c("√3"),m("1/√3"),g("1"),e("0.5")],"Standard.",["sin/cos = (√3/2)/(½)."],"√3.","medium",ch22),
  Q("icse10_ch22_dp_q5","icse10_ch22_distance_problems","From tower top 100m, ship at 30° depression. Ship distance?",[c("100√3"),m("100/√3"),g("100"),e("50")],"tan 30 = 100/d.",["d = 100/tan30 = 100√3."],"Apply.","medium",ch22),
  Q("icse10_ch22_dp_q6","icse10_ch22_distance_problems","Two boats from cliff 50m. Depression 30°, 60°. Distance between?",[c("50/tan 30 − 50/tan 60 = 50√3 − 50/√3"),m("Random"),g("50"),e("Cannot")],"Difference.",["Compute each distance."],"Subtract.","hard",ch22),
  Q("icse10_ch22_dp_q7","icse10_ch22_distance_problems","Height of cliff 100m, ship at 45°. Distance?",[c("100 m"),m("50"),g("200"),e("100√2")],"tan 45 = 1.",["= height."],"= height.","easy",ch22),
  Q("icse10_ch22_dp_q8","icse10_ch22_distance_problems","Larger angle of elevation ⇒",[c("Closer object"),m("Further"),g("Same"),e("Random")],"Inverse.",["tan increases with angle."],"Closer.","medium",ch22),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} ICSE Class 10 questions (Ch20-22).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
