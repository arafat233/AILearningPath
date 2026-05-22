import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch = "The Fish Tale";
const ch2 = "Shapes and Angles";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"5", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch1 large_numbers — 8
  Q("math5_ch1_ln_q1","math5_ch1_large_numbers","1 lakh = ?",[e("10000"),c("100000"),m("1000000"),g("10")],"1 lakh = 100,000 (100 thousand).",["1 lakh = 100,000."],"Lakh = 100k.","easy",ch),
  Q("math5_ch1_ln_q2","math5_ch1_large_numbers","1 crore = ?",[e("10000"),m("100000"),c("10000000"),g("1000000")],"1 crore = 10,000,000.",["1 crore = 10 million."],"Crore = 10M.","easy",ch),
  Q("math5_ch1_ln_q3","math5_ch1_large_numbers","1,25,000 in words?",[c("One lakh twenty-five thousand"),e("One hundred twenty-five thousand"),m("125 thousand"),g("Twelve lakh")],"1,25,000 = 1 lakh + 25 thousand.",["1 lakh + 25 thousand."],"Read Indian commas.","medium",ch),
  Q("math5_ch1_ln_q4","math5_ch1_large_numbers","Successor of 99,999?",[e("99,998"),c("1,00,000"),m("9,99,999"),g("99,990")],"99999 + 1 = 100000 = 1 lakh.",["+1 to 99999 = 100000."],"Rollover.","medium",ch),
  Q("math5_ch1_ln_q5","math5_ch1_large_numbers","Predecessor of 10,00,000?",[e("10,00,001"),c("9,99,999"),m("99,999"),g("1,00,000")],"10 lakh − 1 = 9,99,999.",["−1: 999999."],"Reverse rollover.","medium",ch),
  Q("math5_ch1_ln_q6","math5_ch1_large_numbers","How many zeros in 1 crore?",[m("5"),c("7"),e("4"),g("6")],"10,000,000 has 7 zeros.",["1 crore = 1 followed by 7 zeros."],"Crore = 7 zeros.","medium",ch),
  Q("math5_ch1_ln_q7","math5_ch1_large_numbers","Write 4,56,789 in expanded form.",[e("4+5+6+7+8+9"),c("4,00,000 + 50,000 + 6,000 + 700 + 80 + 9"),m("400000 + 56789"),g("4 lakh 56789")],"Each digit × place value.",["4 lakh + 56 thousand + 7 hundred + 89."],"Place values.","hard",ch),
  Q("math5_ch1_ln_q8","math5_ch1_large_numbers","Compare: 5,00,000 vs 4,99,999.",[c("5 lakh > 4,99,999"),e("4,99,999 > 5 lakh"),m("Equal"),g("Cannot tell")],"5,00,000 > 4,99,999.",["Compare leftmost: 5 > 4."],"Leftmost wins.","medium",ch),
  // ch1 weight_fish
  Q("math5_ch1_wf_q1","math5_ch1_weight_fish","1 quintal = ? kg",[e("10"),m("50"),c("100"),g("1000")],"1 quintal = 100 kg.",["1 quintal = 100 kg."],"Quintal = 100 kg.","easy",ch),
  Q("math5_ch1_wf_q2","math5_ch1_weight_fish","1 tonne = ? kg",[m("100"),c("1000"),g("100000"),e("10")],"1 tonne = 1000 kg.",["1 tonne = 1000 kg."],"Tonne = 1000 kg.","easy",ch),
  Q("math5_ch1_wf_q3","math5_ch1_weight_fish","5 quintals = ? kg",[m("50"),c("500"),g("5000"),e("5")],"5 × 100 = 500 kg.",["5 × 100 = 500."],"× 100.","easy",ch),
  Q("math5_ch1_wf_q4","math5_ch1_weight_fish","2 tonnes = ? kg",[m("20"),m("200"),c("2000"),g("20000")],"2 × 1000 = 2000 kg.",["2 × 1000 = 2000."],"× 1000.","easy",ch),
  Q("math5_ch1_wf_q5","math5_ch1_weight_fish","1 tonne = ? quintals",[m("100"),c("10"),g("1000"),e("1")],"1000 kg ÷ 100 = 10 quintals.",["1 tonne = 1000 kg = 10 × 100 kg = 10 quintals."],"Tonne = 10 quintals.","medium",ch),
  Q("math5_ch1_wf_q6","math5_ch1_weight_fish","3 quintals 50 kg = ? kg",[c("350"),m("305"),g("3050"),e("35")],"3 × 100 + 50 = 350 kg.",["3 × 100 = 300.","+50 = 350."],"Combine.","medium",ch),
  Q("math5_ch1_wf_q7","math5_ch1_weight_fish","Best unit for boat load of fish (heavy)?",[e("g"),m("kg"),c("Tonne"),g("ml")],"Heavy loads = tonnes.",["Boat load is huge.","Use tonnes."],"Huge weights = tonnes.","medium",ch),
  Q("math5_ch1_wf_q8","math5_ch1_weight_fish","Truck carries 5 tonnes. After delivering 2 tonnes, weight left?",[g("7 tonnes"),c("3 tonnes"),m("1 tonne"),e("2.5 tonnes")],"5 − 2 = 3 tonnes.",["5 − 2 = 3."],"Subtract delivered.","easy",ch),
  // ch1 money_fish
  Q("math5_ch1_mf_q1","math5_ch1_money_fish","10 kg fish at ₹120/kg. Total cost?",[g("₹130"),c("₹1200"),m("₹130"),e("₹12")],"10 × 120 = ₹1200.",["10 × 120 = 1200."],"Qty × price.","easy",ch),
  Q("math5_ch1_mf_q2","math5_ch1_money_fish","Bought at ₹100/kg, sold at ₹150/kg. Profit per kg?",[c("₹50"),m("₹250"),g("₹100"),e("₹150")],"150 − 100 = ₹50.",["SP − CP = profit per kg.","150 − 100 = 50."],"Profit = SP − CP.","medium",ch),
  Q("math5_ch1_mf_q3","math5_ch1_money_fish","CP ₹200, SP ₹160 → ?",[e("Profit ₹40"),c("Loss ₹40"),m("Profit ₹360"),g("No change")],"SP < CP → loss = 40.",["Loss = 200 − 160 = 40."],"SP < CP = loss.","medium",ch),
  Q("math5_ch1_mf_q4","math5_ch1_money_fish","20 kg × ₹50/kg = ?",[g("₹70"),c("₹1000"),m("₹100"),e("₹2.5")],"20 × 50 = 1000.",["20 × 50 = 1000."],"× = total.","easy",ch),
  Q("math5_ch1_mf_q5","math5_ch1_money_fish","CP ₹500 + profit ₹150 → SP = ?",[c("₹650"),m("₹350"),g("₹1500"),e("₹150")],"SP = CP + profit = 650.",["SP = CP + profit.","500 + 150 = 650."],"SP = CP + P.","medium",ch),
  Q("math5_ch1_mf_q6","math5_ch1_money_fish","Total revenue from 100 kg × ₹80/kg?",[g("₹180"),c("₹8000"),m("₹800"),e("₹100")],"100 × 80 = 8000.",["100 × 80 = 8000."],"× = total.","medium",ch),
  Q("math5_ch1_mf_q7","math5_ch1_money_fish","CP ₹600, loss ₹50 → SP = ?",[e("₹650"),c("₹550"),m("₹50"),g("₹600")],"Loss: SP = CP − loss = 550.",["SP = CP − loss = 600 − 50 = 550."],"Loss → SP < CP.","medium",ch),
  Q("math5_ch1_mf_q8","math5_ch1_money_fish","Half a kg of fish at ₹200/kg = ?",[m("₹200"),c("₹100"),g("₹400"),e("₹50")],"½ × 200 = ₹100.",["½ × 200 = 100."],"Half = ÷ 2.","medium",ch),
  // ch1 scale_distance
  Q("math5_ch1_sd_q1","math5_ch1_scale_distance","Scale 1 cm = 10 km. 5 cm on map = ?",[g("5 km"),c("50 km"),m("100 km"),e("5 cm")],"5 × 10 = 50 km.",["5 × 10 = 50."],"× scale.","easy",ch),
  Q("math5_ch1_sd_q2","math5_ch1_scale_distance","Scale 1 cm = 1 km. 8 cm on map = ?",[c("8 km"),m("0.8 km"),g("80 km"),e("8 cm")],"8 × 1 = 8 km.",["8 × 1 = 8 km."],"× scale.","easy",ch),
  Q("math5_ch1_sd_q3","math5_ch1_scale_distance","Why use scale on maps?",[e("Decoration"),c("Show distances in compact form"),m("Random"),g("Required by law")],"Scale lets maps show big distances on small paper.",["Big distances → small map.","Scale bridges them."],"Scale = compress.","medium",ch),
  Q("math5_ch1_sd_q4","math5_ch1_scale_distance","Map scale 1:1000 means…",[e("1 unit = 1 unit"),c("1 unit on map = 1000 units real"),m("1 cm = 1 m"),g("Random")],"Ratio scale: 1 unit map = 1000 units real.",["1:1000 means 1 to 1000."],"Read as ratio.","hard",ch),
  Q("math5_ch1_sd_q5","math5_ch1_scale_distance","Real distance 50 km, scale 1 cm = 10 km. Map distance?",[m("50 cm"),c("5 cm"),g("500 cm"),e("0.5 cm")],"50 ÷ 10 = 5 cm.",["50 ÷ 10 = 5."],"÷ scale.","medium",ch),
  Q("math5_ch1_sd_q6","math5_ch1_scale_distance","Two cities 250 km apart, scale 1 cm = 50 km. Map distance?",[m("250 cm"),c("5 cm"),g("0.5 cm"),e("50 cm")],"250 ÷ 50 = 5 cm.",["250 ÷ 50 = 5 cm."],"Divide.","medium",ch),
  Q("math5_ch1_sd_q7","math5_ch1_scale_distance","If a scale is 2 cm = 1 km, 10 cm = ?",[g("10 km"),c("5 km"),m("20 km"),e("0.5 km")],"10/2 = 5 km.",["10 ÷ 2 = 5 km."],"Divide by scale factor.","hard",ch),
  Q("math5_ch1_sd_q8","math5_ch1_scale_distance","Fishing village to market = 30 km. Scale 1 cm = 5 km. Map distance?",[c("6 cm"),m("30 cm"),g("150 cm"),e("0.6 cm")],"30 ÷ 5 = 6 cm.",["30 ÷ 5 = 6 cm."],"Divide.","medium",ch),

  // ch2 angles_intro
  Q("math5_ch2_ai_q1","math5_ch2_angles_intro","An angle is formed by…",[e("One line"),c("Two rays from common point"),m("Three points"),g("A circle")],"Two rays from a vertex form an angle.",["2 rays + 1 vertex = angle."],"2 arms + vertex.","easy",ch2),
  Q("math5_ch2_ai_q2","math5_ch2_angles_intro","Clock hands at 3:00 form what angle?",[m("0°"),c("90°"),g("180°"),e("360°")],"3:00 → hands perpendicular = 90°.",["12 to 3 = quarter turn.","90°."],"Quarter turn.","medium",ch2),
  Q("math5_ch2_ai_q3","math5_ch2_angles_intro","Bigger angle means…",[c("Bigger opening between arms"),e("Bigger arms"),m("Bigger vertex"),g("Random")],"Angle size = opening, not arm length.",["Arms can be any length.","Opening matters."],"Opening = size.","medium",ch2),
  Q("math5_ch2_ai_q4","math5_ch2_angles_intro","Unit of angle measurement?",[e("Cm"),c("Degree (°)"),m("Litre"),g("Kg")],"Angles measured in degrees.",["Degree = angle unit."],"Degrees.","easy",ch2),
  Q("math5_ch2_ai_q5","math5_ch2_angles_intro","A full turn is…",[m("90°"),m("180°"),c("360°"),e("720°")],"Full circle = 360°.",["Complete rotation = 360°."],"Full turn = 360°.","medium",ch2),
  Q("math5_ch2_ai_q6","math5_ch2_angles_intro","Half turn = ?",[m("90°"),c("180°"),g("360°"),e("45°")],"Half of 360 = 180°.",["½ × 360 = 180."],"Half turn = 180°.","medium",ch2),
  Q("math5_ch2_ai_q7","math5_ch2_angles_intro","Quarter turn = ?",[c("90°"),m("180°"),g("360°"),e("45°")],"¼ × 360 = 90°.",["¼ × 360 = 90."],"Quarter turn = 90°.","easy",ch2),
  Q("math5_ch2_ai_q8","math5_ch2_angles_intro","Symbol for degree?",[e("$"),c("°"),m("%"),g("&")],"° is the degree symbol.",["°.","Used: 90° = 90 degrees."],"° = degrees.","easy",ch2),
  // ch2 types_angles
  Q("math5_ch2_ta_q1","math5_ch2_types_angles","An angle of 45° is…",[c("Acute"),e("Right"),m("Obtuse"),g("Straight")],"45 < 90 → acute.",["Acute < 90°."],"<90 = acute.","easy",ch2),
  Q("math5_ch2_ta_q2","math5_ch2_types_angles","Right angle = ?",[m("45°"),c("90°"),g("180°"),e("60°")],"Right = 90°.",["Right angle = 90°."],"Right = 90.","easy",ch2),
  Q("math5_ch2_ta_q3","math5_ch2_types_angles","Obtuse angle is between…",[m("0 and 90"),c("90 and 180"),g("180 and 360"),e("Exactly 180")],"Obtuse: between 90 and 180.",["90 < obtuse < 180."],"Obtuse = wide angle.","medium",ch2),
  Q("math5_ch2_ta_q4","math5_ch2_types_angles","Straight angle = ?",[m("90°"),c("180°"),g("360°"),e("0°")],"Straight = 180°.",["Straight = half turn = 180°."],"Straight = 180.","easy",ch2),
  Q("math5_ch2_ta_q5","math5_ch2_types_angles","120° is…",[e("Acute"),m("Right"),c("Obtuse"),g("Straight")],"90 < 120 < 180 → obtuse.",["Between 90 and 180 = obtuse."],"Test range.","medium",ch2),
  Q("math5_ch2_ta_q6","math5_ch2_types_angles","30° is…",[c("Acute"),m("Right"),g("Obtuse"),e("Straight")],"30 < 90 → acute.",["<90 = acute."],"Small = acute.","easy",ch2),
  Q("math5_ch2_ta_q7","math5_ch2_types_angles","Which is bigger: acute or obtuse?",[e("Acute"),c("Obtuse"),m("Same"),g("Cannot say")],"Obtuse > 90 > acute.",["Obtuse > 90 > acute."],"Obtuse > acute.","medium",ch2),
  Q("math5_ch2_ta_q8","math5_ch2_types_angles","Right + acute = ?",[m("Always 180°"),c("Less than 180°"),g("Always 90°"),e("180°")],"90 + (less than 90) < 180.",["Right = 90; acute < 90.","Sum < 180."],"Right + acute < 180.","hard",ch2),
  // ch2 measuring_angles
  Q("math5_ch2_ma_q1","math5_ch2_measuring_angles","Tool to measure angles?",[m("Ruler"),c("Protractor"),g("Compass"),e("Weighing scale")],"Protractor measures angles.",["Protractor = degree tool."],"Protractor.","easy",ch2),
  Q("math5_ch2_ma_q2","math5_ch2_measuring_angles","Protractor goes from 0 to…",[m("90"),c("180"),g("360"),e("100")],"Standard protractor: 0 to 180°.",["0 to 180° range."],"0-180.","easy",ch2),
  Q("math5_ch2_ma_q3","math5_ch2_measuring_angles","Where to place protractor centre?",[m("On one arm"),c("On the vertex"),g("In the middle of angle"),e("Random")],"Centre at vertex.",["Vertex = centre of protractor."],"Vertex.","medium",ch2),
  Q("math5_ch2_ma_q4","math5_ch2_measuring_angles","Protractor has how many scales?",[e("1"),c("2 (inner and outer)"),m("4"),g("Many")],"Two scales: 0-180 inner, 0-180 outer.",["Two scales for direction.","Use the right one."],"2 scales.","medium",ch2),
  Q("math5_ch2_ma_q5","math5_ch2_measuring_angles","After centring, align ___ arm with 0°.",[c("One"),m("Both"),g("Neither"),e("Top")],"Align one arm with 0; read other.",["One arm on 0.","Other arm gives reading."],"One arm.","medium",ch2),
  Q("math5_ch2_ma_q6","math5_ch2_measuring_angles","If outer scale shows 60° and inner shows 120°, what is the angle?",[m("Average"),c("Use scale matching starting arm"),g("Always inner"),e("Cannot tell")],"Use the scale that goes 0 at your starting arm.",["Check which scale starts at 0 on your arm."],"Match start.","hard",ch2),
  Q("math5_ch2_ma_q7","math5_ch2_measuring_angles","Smallest division on a protractor?",[m("10°"),c("1°"),g("0.1°"),e("5°")],"1° marks are smallest.",["Each small line = 1°."],"1° smallest.","medium",ch2),
  Q("math5_ch2_ma_q8","math5_ch2_measuring_angles","To draw a 45° angle, you use…",[c("Protractor"),m("Ruler only"),g("Compass alone"),e("Random")],"Use protractor to draw at correct degrees.",["Draw arm on 0.","Mark 45° on protractor.","Connect."],"Protractor for drawing.","medium",ch2),
  // ch2 shapes_angles
  Q("math5_ch2_sa_q1","math5_ch2_shapes_angles","Triangle angles sum to…",[m("90°"),c("180°"),g("360°"),e("270°")],"Always 180° for any triangle.",["Triangle sum = 180°."],"Triangle = 180°.","medium",ch2),
  Q("math5_ch2_sa_q2","math5_ch2_shapes_angles","Quadrilateral angles sum to…",[m("180°"),c("360°"),g("540°"),e("90°")],"Quadrilateral = 360°.",["Quadrilateral sum = 360°."],"Quad = 360°.","medium",ch2),
  Q("math5_ch2_sa_q3","math5_ch2_shapes_angles","Each angle of equilateral triangle?",[m("90°"),c("60°"),g("180°"),e("120°")],"180 ÷ 3 = 60.",["Equilateral = all equal.","180/3 = 60°."],"60° each.","medium",ch2),
  Q("math5_ch2_sa_q4","math5_ch2_shapes_angles","Each angle of square?",[c("90°"),m("60°"),g("180°"),e("45°")],"All 4 angles = 90°.",["Square has 4 right angles.","Each = 90°."],"Square = 90° each.","easy",ch2),
  Q("math5_ch2_sa_q5","math5_ch2_shapes_angles","Triangle has angles 50° and 60°. Third angle?",[m("60°"),c("70°"),g("90°"),e("110°")],"180 − 50 − 60 = 70°.",["Sum = 180.","180 − 50 − 60 = 70."],"Subtract from 180.","hard",ch2),
  Q("math5_ch2_sa_q6","math5_ch2_shapes_angles","Each angle of regular pentagon (5 sides)?",[m("60°"),c("108°"),g("180°"),e("72°")],"Pentagon angle sum = 540°. Each = 108°.",["Sum = (5-2)×180 = 540.","540/5 = 108°."],"Sum × 5 to verify.","hard",ch2),
  Q("math5_ch2_sa_q7","math5_ch2_shapes_angles","Rectangle has all angles equal to…",[c("90°"),m("60°"),g("180°"),e("45°")],"All 4 angles = 90°.",["Rectangle all 90°."],"Rectangle 90°.","easy",ch2),
  Q("math5_ch2_sa_q8","math5_ch2_shapes_angles","If triangle has 90° angle, it's…",[m("Equilateral"),c("Right-angled triangle"),g("Obtuse"),e("Acute")],"Right-angled triangle has one 90°.",["One angle = 90° → right-angled."],"Right triangle.","medium",ch2),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 5 Math v2 questions (Ch1-2).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
