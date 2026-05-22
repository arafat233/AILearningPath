import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch13 = "Ways to Multiply and Divide";
const ch14 = "How Big? How Heavy?";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"5", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  // ch13 multiplication_strategies
  Q("math5_ch13_ms_q1","math5_ch13_multiplication_strategies","234 × 12 = ?",[c("2808"),m("2898"),g("2700"),e("2348")],"234×10 + 234×2 = 2340+468.",["234×10=2340.","234×2=468.","2340+468=2808."],"Split by place.","hard",ch13),
  Q("math5_ch13_ms_q2","math5_ch13_multiplication_strategies","23 × 11 = ?",[c("253"),m("234"),g("250"),e("33")],"23×10 + 23×1.",["230+23=253."],"× 11 shortcut.","medium",ch13),
  Q("math5_ch13_ms_q3","math5_ch13_multiplication_strategies","15 × 20 = ?",[c("300"),m("150"),g("450"),e("250")],"15×10 = 150; ×2 = 300.",["15×20 = 15×2×10 = 300."],"Use 10s.","medium",ch13),
  Q("math5_ch13_ms_q4","math5_ch13_multiplication_strategies","Long multiplication: align by…",[c("Place value"),e("Color"),m("Random"),g("Length")],"Align places.",["Ones under ones, etc."],"Place value.","medium",ch13),
  Q("math5_ch13_ms_q5","math5_ch13_multiplication_strategies","100 × 25 = ?",[c("2500"),m("125"),g("250"),e("10025")],"× 100 = append 2 zeros.",["25 + 00 = 2500."],"× 100.","easy",ch13),
  Q("math5_ch13_ms_q6","math5_ch13_multiplication_strategies","50 × 50 = ?",[c("2500"),m("250"),g("100"),e("500")],"5×5×100.",["5×5=25.","25×100=2500."],"Split.","medium",ch13),
  Q("math5_ch13_ms_q7","math5_ch13_multiplication_strategies","To multiply by 9, use…",[c("× 10 − itself"),e("× 11 − itself"),m("× 0"),g("Random")],"9N = 10N − N.",["9×7 = 70 − 7 = 63."],"× 10 − itself.","hard",ch13),
  Q("math5_ch13_ms_q8","math5_ch13_multiplication_strategies","125 × 8 = ?",[c("1000"),m("100"),g("1250"),e("133")],"125 × 8 = 1000.",["125 × 8 = 1000."],"125 × 8 = 1000.","medium",ch13),
  // ch13 long_division
  Q("math5_ch13_ld_q1","math5_ch13_long_division","576 ÷ 4 = ?",[c("144"),m("140"),g("154"),e("44")],"DMSB: 5÷4=1r1, 17÷4=4r1, 16÷4=4.",["Long division steps."],"DMSB.","hard",ch13),
  Q("math5_ch13_ld_q2","math5_ch13_long_division","Long division steps: D, M, S, B = ?",[c("Divide, Multiply, Subtract, Bring down"),e("Random letters"),m("Always Divide"),g("Doesn't matter")],"DMSB.",["D, M, S, B repeat."],"DMSB.","medium",ch13),
  Q("math5_ch13_ld_q3","math5_ch13_long_division","144 ÷ 12 = ?",[c("12"),m("11"),g("13"),e("10")],"12×12=144.",["12×12=144."],"144 ÷ 12 = 12.","easy",ch13),
  Q("math5_ch13_ld_q4","math5_ch13_long_division","105 ÷ 7 = ?",[c("15"),m("12"),g("14"),e("17")],"7×15=105.",["7×15=105."],"Use table.","medium",ch13),
  Q("math5_ch13_ld_q5","math5_ch13_long_division","250 ÷ 5 = ?",[c("50"),m("25"),g("55"),e("100")],"5×50=250.",["5×50=250."],"× 5 table.","easy",ch13),
  Q("math5_ch13_ld_q6","math5_ch13_long_division","Divisor × Quotient + Remainder = ?",[c("Dividend"),e("Sum"),m("Random"),g("Quotient")],"Check formula.",["D×Q + R = N."],"Check: dq+r=n.","hard",ch13),
  Q("math5_ch13_ld_q7","math5_ch13_long_division","100 ÷ 6 → quotient and remainder?",[c("16, rem 4"),m("17, rem 0"),g("15, rem 10"),e("10, rem 40")],"6×16=96, 100-96=4.",["16 × 6 = 96.","100 − 96 = 4."],"16 r 4.","hard",ch13),
  Q("math5_ch13_ld_q8","math5_ch13_long_division","1000 ÷ 10 = ?",[c("100"),m("10"),g("1000"),e("110")],"÷ 10 drops a zero.",["1000 ÷ 10 = 100."],"÷ 10.","easy",ch13),
  // ch13 word_problems_mul
  Q("math5_ch13_wm_q1","math5_ch13_word_problems_mul","15 boxes × 12 chocolates each. Total?",[c("180"),m("27"),g("150"),e("120")],"15×12.",["15 × 12 = 180."],"× total.","medium",ch13),
  Q("math5_ch13_wm_q2","math5_ch13_word_problems_mul","6 packs × 50 candies each. Total?",[c("300"),m("56"),g("100"),e("250")],"6×50.",["300."],"×.","easy",ch13),
  Q("math5_ch13_wm_q3","math5_ch13_word_problems_mul","Keyword 'each' usually means…",[c("Multiply"),e("Add"),m("Subtract"),g("Divide")],"Per × count.",["Each = ×."],"Each = ×.","medium",ch13),
  Q("math5_ch13_wm_q4","math5_ch13_word_problems_mul","20 tables × 4 chairs each. Total chairs?",[c("80"),m("24"),g("80"),e("100")],"20×4.",["80."],"×.","easy",ch13),
  Q("math5_ch13_wm_q5","math5_ch13_word_problems_mul","3 weeks × 7 days each. Total days?",[c("21"),m("10"),g("17"),e("4")],"3×7.",["21 days."],"× per-unit.","easy",ch13),
  Q("math5_ch13_wm_q6","math5_ch13_word_problems_mul","Buy 12 pens at ₹8 each. Total cost?",[c("₹96"),m("₹20"),g("₹84"),e("₹100")],"12×8.",["96."],"×.","medium",ch13),
  Q("math5_ch13_wm_q7","math5_ch13_word_problems_mul","5 rows × 25 chairs. Total?",[c("125"),m("30"),g("100"),e("150")],"5×25.",["125."],"×.","medium",ch13),
  Q("math5_ch13_wm_q8","math5_ch13_word_problems_mul","7 days × 24 hours each. Total hours/week?",[c("168"),m("31"),g("31"),e("194")],"7×24.",["168."],"×.","medium",ch13),
  // ch13 word_problems_div
  Q("math5_ch13_wd_q1","math5_ch13_word_problems_div","120 cookies ÷ 8 friends. Per friend?",[c("15"),m("12"),g("128"),e("10")],"120÷8.",["15."],"÷.","easy",ch13),
  Q("math5_ch13_wd_q2","math5_ch13_word_problems_div","60 sweets ÷ 12 children. Per child?",[c("5"),m("72"),g("6"),e("4")],"60÷12.",["5."],"÷.","easy",ch13),
  Q("math5_ch13_wd_q3","math5_ch13_word_problems_div","Keyword 'share equally' means…",[c("Divide"),e("Add"),m("Multiply"),g("Subtract")],"Sharing = ÷.",["Share = ÷."],"Share = ÷.","easy",ch13),
  Q("math5_ch13_wd_q4","math5_ch13_word_problems_div","Total 144 ÷ 12 = ?",[c("12"),m("11"),g("13"),e("10")],"12×12=144.",["12."],"÷.","medium",ch13),
  Q("math5_ch13_wd_q5","math5_ch13_word_problems_div","36 students in groups of 6. Groups?",[c("6"),m("5"),g("7"),e("30")],"36÷6.",["6 groups."],"÷.","easy",ch13),
  Q("math5_ch13_wd_q6","math5_ch13_word_problems_div","100 km in 5 hours. Speed?",[c("20 km/h"),m("500"),g("105"),e("4")],"100÷5.",["20 km/h."],"d/t.","medium",ch13),
  Q("math5_ch13_wd_q7","math5_ch13_word_problems_div","₹500 ÷ 25 = ?",[c("₹20"),m("₹15"),g("₹50"),e("₹525")],"500÷25=20.",["500/25=20."],"÷.","medium",ch13),
  Q("math5_ch13_wd_q8","math5_ch13_word_problems_div","If 8 tickets cost ₹560, 1 ticket?",[c("₹70"),m("₹65"),g("₹100"),e("₹56")],"560÷8=70.",["560/8 = 70."],"÷.","medium",ch13),

  // ch14 volume_intro
  Q("math5_ch14_vi_q1","math5_ch14_volume_intro","Volume of cuboid 5×3×2 = ?",[c("30"),m("10"),g("16"),e("12")],"l×w×h.",["5×3×2=30."],"l×w×h.","medium",ch14),
  Q("math5_ch14_vi_q2","math5_ch14_volume_intro","Volume measures…",[c("3D space inside"),e("Area"),m("Perimeter"),g("Weight")],"3D = volume.",["Inside 3D shape."],"3D space.","easy",ch14),
  Q("math5_ch14_vi_q3","math5_ch14_volume_intro","Volume unit:",[c("Cubic (cm³, m³)"),e("Square"),m("Length"),g("None")],"Cube of length.",["cm × cm × cm = cm³."],"Cubic units.","medium",ch14),
  Q("math5_ch14_vi_q4","math5_ch14_volume_intro","Cube side 4. Volume?",[c("64"),m("16"),g("24"),e("12")],"4³.",["4×4×4=64."],"s³.","medium",ch14),
  Q("math5_ch14_vi_q5","math5_ch14_volume_intro","Volume formula for cuboid:",[c("l × w × h"),e("l + w + h"),m("2(l+w+h)"),g("l + w")],"l×w×h.",["Multiply 3 dimensions."],"lwh.","easy",ch14),
  Q("math5_ch14_vi_q6","math5_ch14_volume_intro","Cube side 3. Volume?",[c("27"),m("9"),g("18"),e("6")],"3³.",["27."],"s³.","easy",ch14),
  Q("math5_ch14_vi_q7","math5_ch14_volume_intro","Volume of cuboid 10×2×1 = ?",[c("20"),m("13"),g("100"),e("12")],"10×2×1.",["20."],"lwh.","easy",ch14),
  Q("math5_ch14_vi_q8","math5_ch14_volume_intro","Cube side 5. Volume?",[c("125"),m("15"),g("25"),e("50")],"5³.",["125."],"s³.","medium",ch14),
  // ch14 weight_review
  Q("math5_ch14_wr_q1","math5_ch14_weight_review","1 kg = ? g",[c("1000"),m("100"),g("10"),e("10000")],"By definition.",["1 kg = 1000 g."],"1000.","easy",ch14),
  Q("math5_ch14_wr_q2","math5_ch14_weight_review","1 tonne = ? kg",[c("1000"),m("100"),g("10000"),e("10")],"By definition.",["1 tonne = 1000 kg."],"1000.","easy",ch14),
  Q("math5_ch14_wr_q3","math5_ch14_weight_review","3 kg + 500 g = ? g",[c("3500"),m("305"),g("350"),e("8000")],"3000 + 500.",["3 kg = 3000 g.","+500 = 3500."],"Convert + add.","medium",ch14),
  Q("math5_ch14_wr_q4","math5_ch14_weight_review","2500 g = ? kg",[c("2.5"),m("25"),g("0.25"),e("2.05")],"÷1000.",["2500/1000=2.5."],"÷1000.","medium",ch14),
  Q("math5_ch14_wr_q5","math5_ch14_weight_review","2 tonne = ? g",[c("2,000,000"),m("2000"),g("20000"),e("200000")],"2000 kg = 2,000,000 g.",["2 t × 1000 = 2000 kg.","×1000 = 2,000,000 g."],"× 1000 twice.","hard",ch14),
  Q("math5_ch14_wr_q6","math5_ch14_weight_review","Best unit for paperclip?",[m("kg"),c("g"),g("tonne"),e("Liter")],"Light = g.",["Tiny → g."],"g.","easy",ch14),
  Q("math5_ch14_wr_q7","math5_ch14_weight_review","Best unit for truck load?",[e("g"),m("kg"),c("Tonne"),g("ml")],"Heavy = tonne.",["Truck heavy."],"Tonne.","medium",ch14),
  Q("math5_ch14_wr_q8","math5_ch14_weight_review","100 g + 200 g + 700 g = ?",[c("1 kg (1000 g)"),m("900 g"),g("1.5 kg"),e("100 g")],"100+200+700=1000g.",["Sum: 1000 g = 1 kg."],"Sum to kg.","medium",ch14),
  // ch14 capacity_review
  Q("math5_ch14_cr_q1","math5_ch14_capacity_review","1 L = ? ml",[c("1000"),m("100"),g("10"),e("10000")],"By definition.",["1 L = 1000 ml."],"1000.","easy",ch14),
  Q("math5_ch14_cr_q2","math5_ch14_capacity_review","2 L 500 ml = ? ml",[c("2500"),m("250"),g("2050"),e("25000")],"2000+500.",["2 L = 2000 ml.","+500 = 2500."],"Combine.","medium",ch14),
  Q("math5_ch14_cr_q3","math5_ch14_capacity_review","5000 ml = ? L",[c("5"),m("50"),g("0.5"),e("500")],"÷1000.",["5000/1000=5."],"÷1000.","easy",ch14),
  Q("math5_ch14_cr_q4","math5_ch14_capacity_review","Best unit for a glass?",[m("L"),c("ml"),g("kg"),e("g")],"Small = ml.",["Glass = small amount → ml."],"ml.","easy",ch14),
  Q("math5_ch14_cr_q5","math5_ch14_capacity_review","Best unit for a tank?",[c("L"),m("ml"),g("g"),e("cm")],"Big = L.",["Tank = big → L."],"L.","easy",ch14),
  Q("math5_ch14_cr_q6","math5_ch14_capacity_review","250 ml × 4 = ?",[c("1000 ml (= 1 L)"),m("100"),g("1250"),e("500")],"4×250.",["1000 ml = 1 L."],"× total.","medium",ch14),
  Q("math5_ch14_cr_q7","math5_ch14_capacity_review","5 L 200 ml in ml?",[c("5200"),m("520"),g("52"),e("5020")],"5000+200.",["5×1000 + 200 = 5200."],"Combine.","medium",ch14),
  Q("math5_ch14_cr_q8","math5_ch14_capacity_review","To go from L to ml: ___ by 1000.",[c("Multiply"),e("Divide"),m("Add"),g("Subtract")],"Larger to smaller = ×.",["L → ml: ×1000."],"× 1000.","easy",ch14),
  // ch14 measurement_problems
  Q("math5_ch14_mp_q1","math5_ch14_measurement_problems","Tank capacity 10 L. Filled to half. Water?",[c("5 L"),m("10 L"),g("100 ml"),e("2.5 L")],"Half of 10.",["10 ÷ 2 = 5."],"Half.","easy",ch14),
  Q("math5_ch14_mp_q2","math5_ch14_measurement_problems","Truck 5 tonnes − 2.5 tonnes delivered. Left?",[c("2.5 tonnes"),m("2.5 kg"),g("5 t"),e("2 t")],"5−2.5.",["2.5 t."],"Subtract.","medium",ch14),
  Q("math5_ch14_mp_q3","math5_ch14_measurement_problems","Convert 3 kg + 500 g to g.",[c("3500"),m("305"),g("3050"),e("8000")],"3000+500.",["Convert."],"Convert.","medium",ch14),
  Q("math5_ch14_mp_q4","math5_ch14_measurement_problems","2 L + 800 ml = ?",[c("2800 ml"),m("280 ml"),g("2080 ml"),e("3000 ml")],"2000+800.",["Combine to ml."],"Combine.","medium",ch14),
  Q("math5_ch14_mp_q5","math5_ch14_measurement_problems","Box weighs 5 kg empty. Add 1 kg 500 g. Total?",[c("6 kg 500 g (or 6.5 kg)"),m("6.05 kg"),g("5.5 kg"),e("7 kg")],"5 + 1.5 = 6.5.",["5 + 1.5 = 6.5 kg."],"Add weights.","medium",ch14),
  Q("math5_ch14_mp_q6","math5_ch14_measurement_problems","Water bottle 1 L 250 ml. Drink 750 ml. Left?",[c("500 ml"),m("250 ml"),g("750 ml"),e("100 ml")],"1250-750=500.",["1 L 250 ml = 1250 ml.","1250 − 750 = 500 ml."],"Convert + subtract.","hard",ch14),
  Q("math5_ch14_mp_q7","math5_ch14_measurement_problems","6 packets of 250 g sugar. Total?",[c("1.5 kg"),m("150 g"),g("1500 kg"),e("6 kg")],"6×250=1500 g.",["1500 g = 1.5 kg."],"× then convert.","medium",ch14),
  Q("math5_ch14_mp_q8","math5_ch14_measurement_problems","3 L water poured into 4 equal glasses. Each glass?",[c("750 ml"),m("250 ml"),g("1 L"),e("75 ml")],"3000÷4=750.",["3 L = 3000 ml.","3000 ÷ 4 = 750."],"Convert + divide.","hard",ch14),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 5 Math v2 questions (Ch13-14).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
