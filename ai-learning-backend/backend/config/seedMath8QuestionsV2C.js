import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const ch5 = "Number Play";
const ch6 = "We Distribute, Yet Things Multiply";
const Q = (id, tid, text, opts, ex, steps, sc, d, c) => ({ questionId:id, topicId:tid, text, options:opts, explanation:ex, solutionSteps:steps, shortcut:sc, difficulty:d, subject:"Mathematics", grade:"8", chapter:c });
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});

const questions = [
  Q("math8_ch5_pt_q1","math8_ch5_patterns","Next: 2, 4, 8, 16, ?",[c("32"),m("24"),g("18"),e("64")],"× 2 each.",["Doubling pattern."],"× 2.","easy",ch5),
  Q("math8_ch5_pt_q2","math8_ch5_patterns","Pattern 1, 4, 9, 16: rule?",[c("Squares (n²)"),e("× 4"),m("+ 3"),g("Random")],"1², 2², 3², 4².",["Square numbers."],"n².","medium",ch5),
  Q("math8_ch5_pt_q3","math8_ch5_patterns","Next: 1, 8, 27, 64, ?",[c("125 (cubes)"),m("100"),g("81"),e("128")],"Cubes.",["1³, 2³, 3³, 4³, 5³."],"n³.","hard",ch5),
  Q("math8_ch5_pt_q4","math8_ch5_patterns","Pattern 100, 95, 90, ?",[c("85"),m("80"),g("90"),e("100")],"−5.",["Decreasing by 5."],"−5.","easy",ch5),
  Q("math8_ch5_pt_q5","math8_ch5_patterns","Fibonacci sequence: each =",[c("Sum of 2 previous"),e("Difference"),m("Product"),g("Random")],"Definition.",["F(n) = F(n-1) + F(n-2)."],"Sum 2.","medium",ch5),
  Q("math8_ch5_pt_q6","math8_ch5_patterns","Pattern 1, 3, 6, 10: rule?",[c("Triangular numbers"),e("× 2"),m("+ 4"),g("Random")],"+2, +3, +4, ...",["Differences increasing by 1."],"Triangular.","hard",ch5),
  Q("math8_ch5_pt_q7","math8_ch5_patterns","Patterns reveal…",[c("Rules"),e("Random"),m("Just shapes"),g("Decoration")],"Underlying rules.",["Pattern → rule."],"Rules.","easy",ch5),
  Q("math8_ch5_pt_q8","math8_ch5_patterns","Test pattern rule on…",[c("Multiple terms"),e("First only"),m("Last only"),g("Random")],"Verify.",["Apply to all known terms."],"All terms.","medium",ch5),
  Q("math8_ch5_pc_q1","math8_ch5_primes_composites","Is 17 prime?",[c("Yes"),e("No"),m("Composite"),g("Random")],"No divisor 2-16.",["√17 < 5."],"Yes.","easy",ch5),
  Q("math8_ch5_pc_q2","math8_ch5_primes_composites","Is 21 prime?",[e("Yes"),c("No (3×7)"),m("Sometimes"),g("Cannot")],"21 = 3×7.",["Has factors 3, 7."],"No.","medium",ch5),
  Q("math8_ch5_pc_q3","math8_ch5_primes_composites","First 5 primes?",[c("2, 3, 5, 7, 11"),m("1, 2, 3, 4, 5"),g("2, 4, 6, 8, 10"),e("3, 5, 7, 11, 13")],"Start at 2.",["2, 3, 5, 7, 11."],"Memorize.","medium",ch5),
  Q("math8_ch5_pc_q4","math8_ch5_primes_composites","Composite: 4 or prime: 2?",[c("Both classifications correct"),e("Random"),m("Wrong"),g("None")],"4 composite, 2 prime.",["4 = 2 × 2 (composite). 2 = prime."],"Both correct.","easy",ch5),
  Q("math8_ch5_pc_q5","math8_ch5_primes_composites","Smallest composite?",[c("4"),m("2"),g("6"),e("9")],"4 = 2 × 2.",["4 = 2×2."],"4.","medium",ch5),
  Q("math8_ch5_pc_q6","math8_ch5_primes_composites","Only even prime?",[c("2"),m("4"),g("6"),e("None")],"All other evens divisible by 2.",["Only 2."],"2.","medium",ch5),
  Q("math8_ch5_pc_q7","math8_ch5_primes_composites","Number of primes is…",[c("Infinite"),e("Finite"),m("Hundred"),g("Cannot say")],"Euclid's proof.",["Infinitely many primes."],"Infinite.","hard",ch5),
  Q("math8_ch5_pc_q8","math8_ch5_primes_composites","Is 100 composite?",[c("Yes"),e("No"),m("Prime"),g("Cannot say")],"Many factors.",["100 = 4 × 25."],"Yes.","easy",ch5),
  Q("math8_ch5_dr_q1","math8_ch5_divisibility_rules","Divisible by 2 if…",[c("Ends in 0/2/4/6/8"),e("Sum even"),m("Random"),g("Ends 1")],"Even ending.",["Last digit even."],"Even ending.","easy",ch5),
  Q("math8_ch5_dr_q2","math8_ch5_divisibility_rules","Divisible by 3 if…",[c("Digit sum ÷ 3"),e("Ends in 3"),m("Even"),g("Random")],"Sum test.",["Sum digits, check ÷ 3."],"Digit sum.","medium",ch5),
  Q("math8_ch5_dr_q3","math8_ch5_divisibility_rules","Is 102 ÷ 3?",[c("Yes (1+0+2=3)"),e("No"),m("Sometimes"),g("Cannot tell")],"Sum 3.",["Sum 3 ÷ 3."],"Sum test.","medium",ch5),
  Q("math8_ch5_dr_q4","math8_ch5_divisibility_rules","Divisible by 5 if…",[c("Ends 0 or 5"),e("Ends 1"),m("Even"),g("Random")],"Multiples 5.",["End 0 or 5."],"Ends 0/5.","easy",ch5),
  Q("math8_ch5_dr_q5","math8_ch5_divisibility_rules","Divisible by 9 if…",[c("Digit sum ÷ 9"),e("Ends 9"),m("Random"),g("Even")],"Sum 9.",["Sum digits ÷ 9."],"Digit sum.","medium",ch5),
  Q("math8_ch5_dr_q6","math8_ch5_divisibility_rules","Is 882 ÷ 9?",[c("Yes (8+8+2=18)"),e("No"),m("Sometimes"),g("Cannot tell")],"Sum 18, 18÷9=2.",["18 ÷ 9 = 2 ✓."],"Sum test.","medium",ch5),
  Q("math8_ch5_dr_q7","math8_ch5_divisibility_rules","Divisible by 10:",[c("Ends in 0"),m("Ends 5"),g("Random"),e("Sum 10")],"Trailing 0.",["End 0."],"Ends 0.","easy",ch5),
  Q("math8_ch5_dr_q8","math8_ch5_divisibility_rules","Divisibility by 11 (alternating sum):",[c("Alternating digit sum ÷ 11"),e("Random"),m("Just sum"),g("Cannot")],"Alternating + and −.",["Sum alternating digits."],"Alternating sum.","hard",ch5),
  Q("math8_ch5_ma_q1","math8_ch5_magic_arithmetic","Pick N, double, +6, halve, subtract N. Result?",[c("3"),m("N"),g("0"),e("Random")],"Algebra.",["x→2x→2x+6→x+3→3."],"3.","hard",ch5),
  Q("math8_ch5_ma_q2","math8_ch5_magic_arithmetic","Multiply digit by 9, sum digits. Result?",[c("9"),m("Original"),g("0"),e("Random")],"Multiples of 9.",["1×9=9. 2×9=18 (1+8=9). Always 9."],"9.","hard",ch5),
  Q("math8_ch5_ma_q3","math8_ch5_magic_arithmetic","Tricks rely on…",[c("Algebraic identities"),e("Random"),m("Guessing"),g("Hide")],"Math identity.",["Algebra reveals trick."],"Algebra.","medium",ch5),
  Q("math8_ch5_ma_q4","math8_ch5_magic_arithmetic","Pick number, multiply 4, add 4, divide 4, subtract original. Result?",[c("1"),m("Original"),g("4"),e("0")],"x→4x→4x+4→x+1→1.",["Final = 1."],"1.","hard",ch5),
  Q("math8_ch5_ma_q5","math8_ch5_magic_arithmetic","Magic square 3×3 (1-9): constant?",[c("15"),m("9"),g("45"),e("12")],"45/3 = 15.",["Sum 1-9 = 45 ÷ 3 = 15."],"15.","hard",ch5),
  Q("math8_ch5_ma_q6","math8_ch5_magic_arithmetic","Magic square: all rows/cols/diagonals…",[c("Sum to constant"),e("Random"),m("Same digit"),g("Multiplication")],"Constant.",["Constant sum."],"Equal sum.","medium",ch5),
  Q("math8_ch5_ma_q7","math8_ch5_magic_arithmetic","Palindromic number = ?",[c("Reads same forward/backward"),e("Random"),m("Even"),g("Prime")],"Like 121, 1331.",["Same both ways."],"Both ways.","medium",ch5),
  Q("math8_ch5_ma_q8","math8_ch5_magic_arithmetic","To analyze a trick, use…",[c("Algebra"),e("Random"),m("Just numbers"),g("Color")],"Algebra reveals.",["Define variable, apply ops."],"Algebra.","medium",ch5),

  Q("math8_ch6_di_q1","math8_ch6_distributive","a(b + c) = ?",[c("ab + ac"),m("a + bc"),g("abc"),e("a + b + c")],"Distribute.",["Each term multiplied."],"ab + ac.","medium",ch6),
  Q("math8_ch6_di_q2","math8_ch6_distributive","3(x + 4) = ?",[c("3x + 12"),m("3x + 4"),g("x + 12"),e("7x")],"Distribute.",["3×x + 3×4."],"× each.","easy",ch6),
  Q("math8_ch6_di_q3","math8_ch6_distributive","5(2y − 3) = ?",[c("10y − 15"),m("10y − 3"),g("2y − 15"),e("7y")],"Distribute.",["5×2y + 5×(−3)."],"Distribute signs.","medium",ch6),
  Q("math8_ch6_di_q4","math8_ch6_distributive","Distributive property works with…",[c("Multiplication over addition/subtraction"),e("Only addition"),m("Only multiplication"),g("Random")],"Both.",["+ and − work."],"+ and −.","medium",ch6),
  Q("math8_ch6_di_q5","math8_ch6_distributive","2(x + y + z) = ?",[c("2x + 2y + 2z"),m("2x + y + z"),g("2(x+y) + z"),e("Random")],"Distribute to all.",["× each term."],"× all.","medium",ch6),
  Q("math8_ch6_di_q6","math8_ch6_distributive","−3(2x − 1) = ?",[c("−6x + 3"),m("−6x − 3"),g("6x + 3"),e("−6x + 1")],"Distribute negative.",["−3 × 2x = −6x. −3 × (−1) = 3."],"Watch signs.","hard",ch6),
  Q("math8_ch6_di_q7","math8_ch6_distributive","Distribute (a + b)(c + d):",[c("ac + ad + bc + bd"),m("ac + bd"),g("Random"),e("a + b + c + d")],"FOIL.",["First, Outer, Inner, Last."],"FOIL.","hard",ch6),
  Q("math8_ch6_di_q8","math8_ch6_distributive","Distributive simplifies…",[c("Calculations"),e("Random"),m("Hides"),g("Confuses")],"Faster compute.",["7 × 12 = 7(10+2) = 70+14 = 84."],"Faster.","medium",ch6),
  Q("math8_ch6_fa_q1","math8_ch6_factorization","Factorize 3x + 12:",[c("3(x + 4)"),m("(3x)(12)"),g("3x + 4"),e("Random")],"Common factor 3.",["GCD = 3."],"Pull common.","easy",ch6),
  Q("math8_ch6_fa_q2","math8_ch6_factorization","Factorize 2x² + 4x:",[c("2x(x + 2)"),m("2(x² + 4x)"),g("Random"),e("2x² + 4")],"GCD = 2x.",["2x × x = 2x², 2x × 2 = 4x."],"Pull 2x.","medium",ch6),
  Q("math8_ch6_fa_q3","math8_ch6_factorization","Factorize x² − 9:",[c("(x − 3)(x + 3)"),m("(x − 3)²"),g("Random"),e("x(x − 9)")],"Diff of squares.",["a² − b² = (a-b)(a+b)."],"Diff of squares.","hard",ch6),
  Q("math8_ch6_fa_q4","math8_ch6_factorization","Factorization is reverse of…",[c("Distribution"),e("Random"),m("Subtraction"),g("Division")],"Yes.",["Distribute ↔ factor."],"Reverse distribute.","medium",ch6),
  Q("math8_ch6_fa_q5","math8_ch6_factorization","Factorize 6x + 9:",[c("3(2x + 3)"),m("3(2x + 9)"),g("Random"),e("3x + 3")],"GCD 3.",["GCD(6, 9) = 3."],"Pull GCD.","easy",ch6),
  Q("math8_ch6_fa_q6","math8_ch6_factorization","Factorize x² + 5x:",[c("x(x + 5)"),m("x² (5x)"),g("Random"),e("(x+5)²")],"Common x.",["GCD = x."],"Pull x.","medium",ch6),
  Q("math8_ch6_fa_q7","math8_ch6_factorization","Factorize y² − 16:",[c("(y − 4)(y + 4)"),m("(y − 4)²"),g("Random"),e("y(y − 16)")],"Diff squares.",["16 = 4²."],"Diff squares.","hard",ch6),
  Q("math8_ch6_fa_q8","math8_ch6_factorization","To factor, find…",[c("Common factor / pattern"),e("Random"),m("Sum"),g("Difference")],"Pattern recognition.",["GCD or pattern."],"Pattern.","medium",ch6),
  Q("math8_ch6_lt_q1","math8_ch6_like_terms","Like terms have same…",[c("Variable AND power"),e("Coefficient"),m("Random"),g("Sign")],"Definition.",["Same variable + same exponent."],"Var + power.","medium",ch6),
  Q("math8_ch6_lt_q2","math8_ch6_like_terms","3x + 5x = ?",[c("8x"),m("8x²"),g("15x"),e("Random")],"Add coefficients.",["(3+5)x = 8x."],"Add coef.","easy",ch6),
  Q("math8_ch6_lt_q3","math8_ch6_like_terms","Are 2x² and 3x like?",[e("Yes"),c("No (different powers)"),m("Sometimes"),g("Cannot say")],"Different powers.",["x² ≠ x."],"Powers differ.","medium",ch6),
  Q("math8_ch6_lt_q4","math8_ch6_like_terms","Combine 2x + 3y + 4x:",[c("6x + 3y"),m("9xy"),g("9x"),e("2x + 7y")],"Add like x terms.",["(2+4)x + 3y = 6x + 3y."],"Combine x.","medium",ch6),
  Q("math8_ch6_lt_q5","math8_ch6_like_terms","Are 5x²y and 3yx² like?",[c("Yes (same vars+powers)"),e("No"),m("Sometimes"),g("Cannot say")],"Same vars and powers.",["x²y = yx²."],"Same vars/powers.","hard",ch6),
  Q("math8_ch6_lt_q6","math8_ch6_like_terms","Subtract: 7a − 3a:",[c("4a"),m("10a"),g("4a²"),e("Random")],"7−3=4.",["(7-3)a."],"Subtract coef.","easy",ch6),
  Q("math8_ch6_lt_q7","math8_ch6_like_terms","Simplify 2x + 3y − x + y:",[c("x + 4y"),m("3x + 4y"),g("Random"),e("x + 2y")],"Combine each.",["(2-1)x + (3+1)y = x + 4y."],"Combine.","medium",ch6),
  Q("math8_ch6_lt_q8","math8_ch6_like_terms","Cannot combine 2x + 3y because…",[c("Different variables"),e("Random"),m("Just because"),g("Need parentheses")],"Different vars.",["Like terms must match."],"Different vars.","medium",ch6),
  Q("math8_ch6_si_q1","math8_ch6_simplification","Simplify 2(x + 3) + 4x:",[c("6x + 6"),m("6x + 12"),g("2x + 12"),e("Random")],"Distribute + combine.",["2x + 6 + 4x = 6x + 6."],"Distribute + combine.","medium",ch6),
  Q("math8_ch6_si_q2","math8_ch6_simplification","Simplify 3(x − 2) − x:",[c("2x − 6"),m("2x + 6"),g("4x − 6"),e("Random")],"Distribute + combine.",["3x − 6 − x = 2x − 6."],"Combine.","medium",ch6),
  Q("math8_ch6_si_q3","math8_ch6_simplification","Simplify x + x + x:",[c("3x"),m("x³"),g("x + 3"),e("Random")],"Like terms.",["3x."],"Add coef.","easy",ch6),
  Q("math8_ch6_si_q4","math8_ch6_simplification","Simplify 5x − 2x + 4:",[c("3x + 4"),m("3x − 4"),g("3x"),e("Random")],"Combine x.",["(5-2)x + 4."],"Combine.","medium",ch6),
  Q("math8_ch6_si_q5","math8_ch6_simplification","Simplify steps:",[c("Distribute, then combine like terms"),e("Random"),m("Just combine"),g("Subtract")],"Order.",["Distribute first."],"Order matters.","medium",ch6),
  Q("math8_ch6_si_q6","math8_ch6_simplification","Simplify −(2x − 5):",[c("−2x + 5"),m("−2x − 5"),g("2x + 5"),e("Random")],"Distribute −1.",["× by −1: flip signs."],"Flip signs.","hard",ch6),
  Q("math8_ch6_si_q7","math8_ch6_simplification","Simplify 2(x + 1) + 3(x − 2):",[c("5x − 4"),m("5x + 4"),g("Random"),e("5x")],"Distribute both, combine.",["2x + 2 + 3x − 6 = 5x − 4."],"Distribute + combine.","hard",ch6),
  Q("math8_ch6_si_q8","math8_ch6_simplification","Simplification makes expressions…",[c("Shorter and clearer"),e("Longer"),m("Random"),g("Hidden")],"Shorter form.",["Cleaner."],"Cleaner.","easy",ch6),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} Class 8 Math v2 questions (Ch5-6).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
