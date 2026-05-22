import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch1 = "A Square and A Cube";
const ch2 = "Power Play";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"8", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math8_ch1_sq_q1","math8_ch1_squares","5² = ?",[c("25"),m("10"),g("125"),e("7")],"5×5.",["5×5=25."],"× self.","easy",ch1),
  Q("math8_ch1_sq_q2","math8_ch1_squares","7² = ?",[c("49"),m("14"),g("343"),e("9")],"7×7.",["49."],"× self.","easy",ch1),
  Q("math8_ch1_sq_q3","math8_ch1_squares","Square of 10:",[c("100"),m("20"),g("1000"),e("10")],"10×10.",["100."],"× self.","easy",ch1),
  Q("math8_ch1_sq_q4","math8_ch1_squares","12² = ?",[c("144"),m("24"),g("121"),e("122")],"12×12.",["144."],"× self.","medium",ch1),
  Q("math8_ch1_sq_q5","math8_ch1_squares","Squares of negative numbers are…",[c("Positive"),e("Negative"),m("Zero"),g("Random")],"(−)(−) = +.",["(−5)² = 25."],"Always +.","medium",ch1),
  Q("math8_ch1_sq_q6","math8_ch1_squares","15² = ?",[c("225"),m("30"),g("215"),e("125")],"15×15.",["225."],"× self.","medium",ch1),
  Q("math8_ch1_sq_q7","math8_ch1_squares","Square represents what area?",[c("Square with that side"),e("Triangle"),m("Circle"),g("Random")],"Side².",["Side × side = area."],"Sq side.","medium",ch1),
  Q("math8_ch1_sq_q8","math8_ch1_squares","1² = ?",[c("1"),m("2"),g("0"),e("11")],"1×1.",["1."],"× 1 = 1.","easy",ch1),
  Q("math8_ch1_cu_q1","math8_ch1_cubes","2³ = ?",[c("8"),m("6"),g("9"),e("4")],"2×2×2.",["8."],"× self twice.","easy",ch1),
  Q("math8_ch1_cu_q2","math8_ch1_cubes","3³ = ?",[c("27"),m("9"),g("12"),e("33")],"3×3×3.",["27."],"× self twice.","easy",ch1),
  Q("math8_ch1_cu_q3","math8_ch1_cubes","Cube of 4:",[c("64"),m("16"),g("12"),e("44")],"4³.",["4×4×4=64."],"× self twice.","easy",ch1),
  Q("math8_ch1_cu_q4","math8_ch1_cubes","5³ = ?",[c("125"),m("25"),g("15"),e("55")],"5×5×5.",["125."],"× self twice.","medium",ch1),
  Q("math8_ch1_cu_q5","math8_ch1_cubes","Cube represents what volume?",[c("Cube with that side"),e("Square"),m("Sphere"),g("Random")],"Side³.",["Volume of cube with side."],"Sq side³.","medium",ch1),
  Q("math8_ch1_cu_q6","math8_ch1_cubes","10³ = ?",[c("1000"),m("100"),g("30"),e("110")],"10³.",["1000."],"× self twice.","easy",ch1),
  Q("math8_ch1_cu_q7","math8_ch1_cubes","Cube of negative number:",[c("Negative (e.g. (-2)³=-8)"),e("Positive"),m("Zero"),g("Random")],"Three negatives = negative.",["(−)³ = (−)."],"Odd power keeps sign.","medium",ch1),
  Q("math8_ch1_cu_q8","math8_ch1_cubes","6³ = ?",[c("216"),m("36"),g("18"),e("66")],"6×6×6.",["216."],"× self twice.","medium",ch1),
  Q("math8_ch1_sr_q1","math8_ch1_square_roots","√16 = ?",[c("4"),m("8"),g("16"),e("256")],"4×4=16.",["4."],"Inverse square.","easy",ch1),
  Q("math8_ch1_sr_q2","math8_ch1_square_roots","√49 = ?",[c("7"),m("49"),g("14"),e("9")],"7×7.",["7."],"Inverse square.","easy",ch1),
  Q("math8_ch1_sr_q3","math8_ch1_square_roots","√100 = ?",[c("10"),m("100"),g("50"),e("9")],"10×10.",["10."],"Inverse square.","easy",ch1),
  Q("math8_ch1_sr_q4","math8_ch1_square_roots","√81 = ?",[c("9"),m("81"),g("8"),e("18")],"9×9.",["9."],"Inverse square.","medium",ch1),
  Q("math8_ch1_sr_q5","math8_ch1_square_roots","√2 is approximately…",[c("1.41"),m("1"),g("2"),e("0.5")],"Irrational.",["1.41421..."],"≈ 1.41.","medium",ch1),
  Q("math8_ch1_sr_q6","math8_ch1_square_roots","√144 = ?",[c("12"),m("144"),g("72"),e("14")],"12×12.",["12."],"Inverse square.","medium",ch1),
  Q("math8_ch1_sr_q7","math8_ch1_square_roots","√0 = ?",[c("0"),m("1"),g("Undefined"),e("Random")],"0×0.",["0."],"Special case.","easy",ch1),
  Q("math8_ch1_sr_q8","math8_ch1_square_roots","Is √25 same as ±5?",[c("Yes (technically both, but principal = 5)"),e("Only 5"),m("Only -5"),g("Random")],"Both, but principal +.",["x² = 25 → x = ±5."],"Both signs.","hard",ch1),
  Q("math8_ch1_cr_q1","math8_ch1_cube_roots","∛8 = ?",[c("2"),m("4"),g("8"),e("16")],"2³=8.",["2."],"Inverse cube.","easy",ch1),
  Q("math8_ch1_cr_q2","math8_ch1_cube_roots","∛27 = ?",[c("3"),m("9"),g("27"),e("6")],"3³=27.",["3."],"Inverse cube.","easy",ch1),
  Q("math8_ch1_cr_q3","math8_ch1_cube_roots","∛64 = ?",[c("4"),m("8"),g("16"),e("64")],"4³=64.",["4."],"Inverse cube.","medium",ch1),
  Q("math8_ch1_cr_q4","math8_ch1_cube_roots","∛125 = ?",[c("5"),m("25"),g("125"),e("15")],"5³=125.",["5."],"Inverse cube.","medium",ch1),
  Q("math8_ch1_cr_q5","math8_ch1_cube_roots","∛1000 = ?",[c("10"),m("100"),g("30"),e("1000")],"10³=1000.",["10."],"Inverse cube.","medium",ch1),
  Q("math8_ch1_cr_q6","math8_ch1_cube_roots","∛(−27) = ?",[c("−3"),m("3"),g("Undefined"),e("9")],"(−3)³ = −27.",["−3."],"Odd root, keeps sign.","hard",ch1),
  Q("math8_ch1_cr_q7","math8_ch1_cube_roots","∛0 = ?",[c("0"),m("1"),g("Random"),e("Undefined")],"0³=0.",["0."],"Special.","easy",ch1),
  Q("math8_ch1_cr_q8","math8_ch1_cube_roots","∛216 = ?",[c("6"),m("36"),g("18"),e("216")],"6³=216.",["6."],"Inverse cube.","hard",ch1),

  Q("math8_ch2_ex_q1","math8_ch2_exponents","2³ = ?",[c("8"),m("6"),g("9"),e("23")],"2×2×2.",["8."],"Multiply self.","easy",ch2),
  Q("math8_ch2_ex_q2","math8_ch2_exponents","Base of 5⁴?",[c("5"),m("4"),g("20"),e("625")],"Base first.",["Base = 5, exponent = 4."],"Base first.","easy",ch2),
  Q("math8_ch2_ex_q3","math8_ch2_exponents","3⁴ = ?",[c("81"),m("12"),g("27"),e("34")],"3⁴.",["3×3×3×3=81."],"Multiply.","medium",ch2),
  Q("math8_ch2_ex_q4","math8_ch2_exponents","Any number to power 0 = ?",[c("1"),m("0"),g("Itself"),e("Undefined")],"Rule.",["a⁰=1 (a≠0)."],"a⁰=1.","medium",ch2),
  Q("math8_ch2_ex_q5","math8_ch2_exponents","a¹ = ?",[c("a"),m("1"),g("0"),e("a²")],"Power 1.",["a¹ = a."],"a¹=a.","easy",ch2),
  Q("math8_ch2_ex_q6","math8_ch2_exponents","2⁵ = ?",[c("32"),m("10"),g("25"),e("64")],"2⁵.",["2×2×2×2×2=32."],"Multiply.","medium",ch2),
  Q("math8_ch2_ex_q7","math8_ch2_exponents","10⁴ = ?",[c("10000"),m("40"),g("100"),e("1000")],"10⁴.",["10000."],"× 10 four times.","easy",ch2),
  Q("math8_ch2_ex_q8","math8_ch2_exponents","1⁹⁹⁹ = ?",[c("1"),m("999"),g("0"),e("Random")],"1 to any power = 1.",["1^n = 1."],"1 always.","medium",ch2),
  Q("math8_ch2_le_q1","math8_ch2_laws_exponents","aᵐ × aⁿ = ?",[c("aᵐ⁺ⁿ"),m("aᵐⁿ"),g("aᵐ⁻ⁿ"),e("a²ᵐⁿ")],"Same base: add exponents.",["Add powers."],"Add powers.","medium",ch2),
  Q("math8_ch2_le_q2","math8_ch2_laws_exponents","aᵐ ÷ aⁿ = ?",[c("aᵐ⁻ⁿ"),m("aᵐ⁺ⁿ"),g("aᵐⁿ"),e("a²")],"Subtract.",["÷ same base = subtract powers."],"Subtract.","medium",ch2),
  Q("math8_ch2_le_q3","math8_ch2_laws_exponents","(aᵐ)ⁿ = ?",[c("aᵐⁿ"),m("aᵐ⁺ⁿ"),g("aᵐ⁻ⁿ"),e("a²")],"Multiply.",["Power of power = multiply."],"Multiply.","medium",ch2),
  Q("math8_ch2_le_q4","math8_ch2_laws_exponents","2³ × 2² = ?",[c("2⁵ = 32"),m("2⁶"),g("2¹"),e("4⁵")],"Add: 3+2=5.",["2⁵=32."],"Add powers.","medium",ch2),
  Q("math8_ch2_le_q5","math8_ch2_laws_exponents","5⁶ ÷ 5⁴ = ?",[c("5² = 25"),m("5¹⁰"),g("5²⁴"),e("25")],"Subtract: 6−4=2.",["5²=25."],"Subtract powers.","medium",ch2),
  Q("math8_ch2_le_q6","math8_ch2_laws_exponents","(3²)³ = ?",[c("3⁶ = 729"),m("3⁵"),g("9³"),e("27³")],"Multiply: 2×3=6.",["3⁶=729."],"Multiply powers.","hard",ch2),
  Q("math8_ch2_le_q7","math8_ch2_laws_exponents","a^0 × a^5 = ?",[c("a⁵"),m("a¹"),g("a⁰"),e("0")],"0+5=5.",["1 × a⁵ = a⁵."],"a⁰=1.","medium",ch2),
  Q("math8_ch2_le_q8","math8_ch2_laws_exponents","ab² × a²b = ?",[c("a³b³"),m("a²b²"),g("a²b³"),e("a²b")],"Add powers of same bases.",["a^(1+2) × b^(2+1) = a³b³."],"Add same bases.","hard",ch2),
  Q("math8_ch2_np_q1","math8_ch2_negative_powers","2⁻³ = ?",[c("1/8"),m("-8"),g("6"),e("0")],"Reciprocal.",["1/2³ = 1/8."],"Reciprocal.","medium",ch2),
  Q("math8_ch2_np_q2","math8_ch2_negative_powers","a⁻ⁿ = ?",[c("1/aⁿ"),e("−aⁿ"),m("(-a)ⁿ"),g("Random")],"Reciprocal positive.",["Negative power → reciprocal."],"1/aⁿ.","medium",ch2),
  Q("math8_ch2_np_q3","math8_ch2_negative_powers","5⁻² = ?",[c("1/25"),m("-25"),g("10"),e("0")],"Reciprocal.",["1/5² = 1/25."],"Reciprocal.","medium",ch2),
  Q("math8_ch2_np_q4","math8_ch2_negative_powers","10⁻¹ = ?",[c("0.1"),m("-10"),g("10"),e("0")],"1/10.",["1/10 = 0.1."],"1/n.","easy",ch2),
  Q("math8_ch2_np_q5","math8_ch2_negative_powers","Negative exponent indicates…",[c("Reciprocal (positive power)"),e("Subtraction"),m("Random"),g("Square root")],"Reciprocal.",["Flip and make positive."],"Reciprocal.","medium",ch2),
  Q("math8_ch2_np_q6","math8_ch2_negative_powers","3⁻¹ = ?",[c("1/3"),m("-3"),g("3"),e("0")],"Reciprocal.",["1/3."],"Reciprocal.","easy",ch2),
  Q("math8_ch2_np_q7","math8_ch2_negative_powers","2⁻² × 2² = ?",[c("1"),m("4"),g("16"),e("0")],"−2+2=0.",["2⁰=1."],"Sum exponents.","hard",ch2),
  Q("math8_ch2_np_q8","math8_ch2_negative_powers","100⁻¹ = ?",[c("0.01"),m("-100"),g("10"),e("0")],"1/100.",["0.01."],"1/N.","medium",ch2),
  Q("math8_ch2_sn_q1","math8_ch2_scientific_notation","300000 in scientific notation:",[c("3 × 10⁵"),m("3 × 10⁴"),g("30 × 10⁴"),e("0.3 × 10⁶")],"Move decimal 5 places.",["3 followed by 5 zeros."],"Move + count.","medium",ch2),
  Q("math8_ch2_sn_q2","math8_ch2_scientific_notation","0.0003 in sci notation:",[c("3 × 10⁻⁴"),m("3 × 10⁴"),g("30 × 10⁻³"),e("0.3 × 10⁻³")],"Move decimal 4 right.",["Small → negative exponent."],"Small → −.","medium",ch2),
  Q("math8_ch2_sn_q3","math8_ch2_scientific_notation","4 × 10³ = ?",[c("4000"),m("40"),g("12"),e("4")],"× 1000.",["4 × 1000 = 4000."],"× 10^n.","easy",ch2),
  Q("math8_ch2_sn_q4","math8_ch2_scientific_notation","2.5 × 10⁻² = ?",[c("0.025"),m("250"),g("0.25"),e("2.5")],"÷ 100.",["2.5 ÷ 100 = 0.025."],"÷ 10^|n|.","medium",ch2),
  Q("math8_ch2_sn_q5","math8_ch2_scientific_notation","Scientific notation form: a × 10ⁿ where a is…",[c("1 ≤ a < 10"),e("a > 100"),m("Random"),g("Always 1")],"Standard.",["Coefficient between 1 and 10."],"1-10 range.","hard",ch2),
  Q("math8_ch2_sn_q6","math8_ch2_scientific_notation","6,400,000 in scientific:",[c("6.4 × 10⁶"),m("64 × 10⁵"),g("0.64 × 10⁷"),e("6.4 × 10⁵")],"Move 6 places.",["6.4 × 1 million."],"Move + count.","medium",ch2),
  Q("math8_ch2_sn_q7","math8_ch2_scientific_notation","0.000007 in scientific:",[c("7 × 10⁻⁶"),m("7 × 10⁶"),g("0.7 × 10⁻⁵"),e("7 × 10⁻⁵")],"Move 6 right.",["Small number → negative power."],"Move + count.","medium",ch2),
  Q("math8_ch2_sn_q8","math8_ch2_scientific_notation","Scientific notation simplifies…",[c("Very large or small numbers"),e("Random"),m("Just integers"),g("Fractions")],"Both.",["Large and small."],"Both extremes.","medium",ch2),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 8 Math v2 questions (Ch1-2).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
