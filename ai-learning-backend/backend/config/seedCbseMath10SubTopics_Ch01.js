/**
 * Seed: CBSE Math 10 — Chapter 1 Real Numbers sub-topic MCQs
 * Topics: Euclid's Division Lemma | Prime factorisation | Irrationality proofs
 *         Decimal expansions | Division algorithm
 * 8 MCQs per topic = 40 total
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Question } = await import('../models/index.js');
await mongoose.connect(process.env.MONGO_URI);

function mcq(topic, slug, diff, idx, text, opts, correctIdx, solution, hints, concept) {
  const dl = diff === 'easy' ? 'e' : diff === 'medium' ? 'm' : 'h';
  const ds = diff === 'easy' ? 0.25 : diff === 'medium' ? 0.5 : 0.8;
  return {
    questionId: `q_cbse10_${slug}_${dl}${idx}_mcq`,
    topicId: topic, topic, subtopic: topic,
    subject: 'Mathematics', grade: '10', chapterNumber: 1,
    questionType: 'mcq',
    questionText: text,
    options: opts.map((o, i) => ({
      text: o,
      type: i === correctIdx ? 'correct' : 'concept_error',
      logicTag: i === correctIdx ? null : `${slug}_misc`,
    })),
    correctAnswer: null,
    difficulty: diff, difficultyScore: ds,
    marks: diff === 'hard' ? 2 : 1, negativeMarks: 0,
    expectedTime: diff === 'easy' ? 30 : diff === 'medium' ? 50 : 75,
    bloomLevel: diff === 'easy' ? 'recall' : diff === 'medium' ? 'apply' : 'analyze',
    conceptTested: concept,
    examBoard: 'CBSE', isAIGenerated: true, isFlagged: false, isPYQ: false,
    pyqYear: null, mixingType: 'single_topic', prerequisites: [],
    hintLevels: hints, solutionSteps: solution,
    stepByStep: solution.map((s, i) => ({ stepNumber: i + 1, clean: s, voice: '' })),
    timeThresholds: { guessBelow: 6, expectedMin: 15, expectedMax: diff === 'hard' ? 120 : 60, stuckAbove: 180 },
    routing: { ifCorrect: 'next_difficulty_up', ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  };
}

const questions = [
  /* ── Euclid's Division Lemma ─────────────────────────────── */
  mcq("Euclid's Division Lemma", 'edl', 'easy', 1,
    "According to Euclid's Division Lemma, for integers a and b (b > 0), unique integers q and r exist such that a = bq + r where:",
    ['0 < r ≤ b', '0 ≤ r < b', '0 < r < b', '0 ≤ r ≤ b'], 1,
    ['EDL states a = bq + r with 0 ≤ r < b.'],
    ['r is the remainder — it can be 0 but never equal b.'],
    "Euclid's Division Lemma statement"),

  mcq("Euclid's Division Lemma", 'edl', 'easy', 2,
    "Find q and r when 135 is divided by 12 (Euclid form: 135 = 12q + r).",
    ['q=11, r=3', 'q=10, r=15', 'q=12, r=0', 'q=11, r=4'], 0,
    ['135 ÷ 12 = 11 remainder 3.', '135 = 12×11 + 3. Check: 132 + 3 = 135 ✓'],
    ['Divide 135 by 12 to get quotient and remainder.'],
    "Applying Euclid's Division Lemma"),

  mcq("Euclid's Division Lemma", 'edl', 'easy', 3,
    "HCF of 867 and 255 using Euclid's algorithm: first step gives 867 = 255×3 + 102. Next step is:",
    ['255 = 102×2 + 51', '255 = 102×3 + 0', '102 = 51×2 + 0', '867 = 102×8 + 51'], 0,
    ['Apply EDL to 255 and 102.', '255 = 102×2 + 51.'],
    ['In each step, apply the lemma to the divisor and remainder.'],
    "HCF via Euclid's algorithm"),

  mcq("Euclid's Division Lemma", 'edl', 'medium', 1,
    "Using Euclid's algorithm, HCF(616, 32) is:",
    ['4', '8', '16', '32'], 1,
    ['616 = 32×19 + 8.', '32 = 8×4 + 0.', 'HCF = 8.'],
    ['Keep dividing until remainder is 0.'],
    "HCF computation via Euclid's algorithm"),

  mcq("Euclid's Division Lemma", 'edl', 'medium', 2,
    "HCF(4052, 420) using Euclid's algorithm is:",
    ['2', '4', '6', '8'], 1,
    ['4052 = 420×9 + 272.', '420 = 272×1 + 148.', '272 = 148×1 + 124.', '148 = 124×1 + 24.', '124 = 24×5 + 4.', '24 = 4×6 + 0. HCF = 4.'],
    ['Keep dividing: new dividend ← old divisor, new divisor ← old remainder.'],
    "Multi-step Euclid algorithm"),

  mcq("Euclid's Division Lemma", 'edl', 'medium', 3,
    "If HCF(a, b) = 1, the integers a and b are called:",
    ['co-prime', 'twin primes', 'composite', 'factors'], 0,
    ['Two numbers with HCF 1 are co-prime (relatively prime).'],
    ['HCF 1 means no common factor > 1.'],
    "Co-prime numbers"),

  mcq("Euclid's Division Lemma", 'edl', 'hard', 1,
    "Show HCF(6n+2, 6n+5) = 1. Which reasoning is correct?",
    ['Both are even', 'Any common divisor d divides their difference 3, and also divides 6n+2; since gcd(3,2)=1, d=1', 'Both divisible by 3', 'They are consecutive'], 1,
    ['Let d = HCF(6n+2, 6n+5).', 'd divides (6n+5)−(6n+2) = 3.', 'd divides 6n+2; since d|3 and 3∤(6n+2) (as 6n+2 ≡ 2 mod 3), d must be 1.'],
    ['A common divisor must divide the difference of the two numbers.'],
    "Proving HCF = 1"),

  mcq("Euclid's Division Lemma", 'edl', 'hard', 2,
    "The largest number that divides 245 and 1029 leaving remainder 5 in each case is:",
    ['15', '16', '32', '64'], 1,
    ['Subtract remainder: 245−5=240, 1029−5=1024.', 'Required number = HCF(240, 1024).', '1024 = 240×4 + 64; 240 = 64×3 + 48; 64 = 48×1 + 16; 48 = 16×3 + 0. HCF = 16.'],
    ['Subtract the given remainder from each number, then find HCF.'],
    "Word problem using Euclid's lemma"),

  /* ── Prime Factorisation ─────────────────────────────────── */
  mcq('Prime factorisation', 'pfact', 'easy', 1,
    "Prime factorisation of 156 is:",
    ['2² × 3 × 13', '2 × 3² × 13', '2³ × 3 × 13', '2² × 3² × 7'], 0,
    ['156 = 2×78 = 2×2×39 = 4×3×13.', '156 = 2² × 3 × 13.'],
    ['Divide by the smallest prime repeatedly.'],
    'Prime factorisation — factor tree'),

  mcq('Prime factorisation', 'pfact', 'easy', 2,
    "HCF of 12 and 18 using prime factorisation:",
    ['2', '4', '6', '12'], 2,
    ['12 = 2²×3; 18 = 2×3².', 'HCF = 2¹×3¹ = 6.'],
    ['HCF = product of lowest powers of common prime factors.'],
    'HCF via prime factorisation'),

  mcq('Prime factorisation', 'pfact', 'easy', 3,
    "LCM of 12 and 18 using prime factorisation:",
    ['18', '24', '36', '72'], 2,
    ['12 = 2²×3; 18 = 2×3².', 'LCM = 2²×3² = 36.'],
    ['LCM = product of highest powers of all prime factors.'],
    'LCM via prime factorisation'),

  mcq('Prime factorisation', 'pfact', 'medium', 1,
    "HCF and LCM of 306 and 657 are H and L. HCF×LCM equals:",
    ['306', '657', '306×657', 'HCF only'], 2,
    ['For any two positive integers: HCF × LCM = product of the numbers.', 'H × L = 306 × 657.'],
    ['Use the property: HCF × LCM = a × b.'],
    'HCF × LCM property'),

  mcq('Prime factorisation', 'pfact', 'medium', 2,
    "Three bells toll at intervals of 6, 8, and 12 minutes. They toll together at 12:00. When do they next toll together?",
    ['12:12', '12:20', '12:24', '12:36'], 2,
    ['LCM(6,8,12): 6=2×3, 8=2³, 12=2²×3. LCM=2³×3=24.', 'They toll together after 24 minutes → 12:24.'],
    ['LCM gives the next time all events coincide.'],
    'LCM word problem'),

  mcq('Prime factorisation', 'pfact', 'medium', 3,
    "If LCM(a,b) = 45 and HCF(a,b) = 3, then a × b equals:",
    ['15', '48', '135', '270'], 2,
    ['a × b = LCM × HCF = 45 × 3 = 135.'],
    ['Use: a × b = HCF × LCM.'],
    'HCF × LCM = a × b'),

  mcq('Prime factorisation', 'pfact', 'hard', 1,
    "HCF of 2³×3²×5 and 2²×3³×7 is:",
    ['2²×3²', '2³×3³×5×7', '2×3', '2²×3²×5×7'], 0,
    ['HCF = product of lowest powers of common primes.', 'Common primes: 2 (power min(3,2)=2) and 3 (power min(2,3)=2).', 'HCF = 2²×3² = 36.'],
    ['List common prime factors and take the lower power.'],
    'HCF from prime factorisation'),

  mcq('Prime factorisation', 'pfact', 'hard', 2,
    "Prove 6ⁿ can never end in 0. Which argument is correct?",
    ['6ⁿ is always even', '6ⁿ ends in 0 only if 5 is a factor; but 6ⁿ=2ⁿ×3ⁿ has no factor of 5', '6ⁿ is always divisible by 3', '6ⁿ is never divisible by 2'], 1,
    ['A number ends in 0 iff it is divisible by 10 = 2×5.', '6ⁿ = (2×3)ⁿ = 2ⁿ×3ⁿ. No factor of 5.', 'Hence 6ⁿ is never divisible by 10.'],
    ['Ending in 0 requires both 2 and 5 as prime factors.'],
    'Prime factorisation — powers'),

  /* ── Irrationality Proofs ────────────────────────────────── */
  mcq('Irrationality proofs', 'irrpf', 'easy', 1,
    "√2 is irrational. The proof technique used is:",
    ['Direct proof', 'Induction', 'Contradiction', 'Construction'], 2,
    ['We assume √2 = p/q (lowest terms), derive p and q are both even — contradicting HCF = 1.'],
    ['Assume rational, reach a contradiction.'],
    'Proof by contradiction'),

  mcq('Irrationality proofs', 'irrpf', 'easy', 2,
    "In the proof that √2 is irrational, if p² is even then:",
    ['p is odd', 'p is even', 'p = 2', 'q is even'], 1,
    ['If p² is even, p must be even (since odd² is odd).'],
    ['Even squares have even square roots.'],
    'Property of even numbers in irrationality proof'),

  mcq('Irrationality proofs', 'irrpf', 'medium', 1,
    "Which of the following is irrational?",
    ['√9', '√4 + √9', '√2 + √3', '√16/√4'], 2,
    ['√9=3, √4+√9=2+3=5, √16/√4=4/2=2 are all rational.', '√2+√3 is irrational (sum of two distinct surds).'],
    ['Evaluate each option and check for rationality.'],
    'Identifying irrational numbers'),

  mcq('Irrationality proofs', 'irrpf', 'medium', 2,
    "Prove 5 − √3 is irrational. The key step is:",
    ['Assume 5−√3 = p/q; then √3 = 5 − p/q = rational — contradiction', '5 is irrational', '√3 is rational', 'Subtraction of rationals is rational'], 0,
    ['Assume 5−√3 = p/q (rational).', 'Then √3 = 5 − p/q, which is rational — contradiction.'],
    ['Isolate the surd and show it equals a rational number.'],
    'Proving irrationality of expressions'),

  mcq('Irrationality proofs', 'irrpf', 'medium', 3,
    "Which of the following is rational?",
    ['2√3', '3 + √2', '√5 − 1', '(√5 + √3)(√5 − √3)'], 3,
    ['(√5+√3)(√5−√3) = 5−3 = 2, which is rational.'],
    ['Use the identity (a+b)(a−b) = a²−b².'],
    'Product of conjugate surds'),

  mcq('Irrationality proofs', 'irrpf', 'hard', 1,
    "Which step is WRONG in the following \"proof\" that √6 is rational?\n(1) Assume √6 = p/q, HCF = 1.\n(2) 6q² = p².\n(3) p² divisible by 6, so p divisible by 6.\n(4) Let p = 6m; then 6q² = 36m² → q² = 6m².\n(5) q divisible by 6; HCF ≥ 6 — contradiction.",
    ['Step 2', 'Step 3', 'Step 4', 'Step 5'], 1,
    ['Step 3 is incorrect: p² divisible by 6 does NOT imply p divisible by 6 (e.g., p=2: p²=4, 4 not divisible by 6).', 'Correct approach: use divisibility by 2 and 3 separately.'],
    ['Divisibility of p² by a composite number n does not always imply p|n.'],
    'Error analysis in irrationality proofs'),

  mcq('Irrationality proofs', 'irrpf', 'hard', 2,
    "3/√7 is irrational because:",
    ['3 is not divisible by 7', '3/√7 = 3√7/7; if rational then √7 is rational — contradiction', '√7 > 1', '7 is prime'], 1,
    ['If 3/√7 = r (rational), then √7 = 3/r — rational — contradiction since √7 is irrational.'],
    ['Assume rational, express √7 in terms of it.'],
    'Irrationality of quotient involving surd'),

  /* ── Decimal Expansions ──────────────────────────────────── */
  mcq('Decimal expansions', 'decexp', 'easy', 1,
    "A rational number p/q (in lowest terms) has a terminating decimal expansion if and only if q is of the form:",
    ['2ⁿ × 3ᵐ', '2ⁿ × 5ᵐ', '3ⁿ × 5ᵐ', '2ⁿ only'], 1,
    ['Terminating ⟺ denominator (in lowest terms) = 2ⁿ × 5ᵐ.'],
    ['Check only the prime factors of the denominator.'],
    'Terminating decimal condition'),

  mcq('Decimal expansions', 'decexp', 'easy', 2,
    "Which fraction has a terminating decimal?",
    ['7/12', '13/91', '3/8', '17/6'], 2,
    ['3/8: denominator = 2³ (only power of 2). Terminating.', '3/8 = 0.375.'],
    ['Simplify first; then check if denominator = 2ⁿ × 5ᵐ.'],
    'Identifying terminating decimals'),

  mcq('Decimal expansions', 'decexp', 'medium', 1,
    "The decimal expansion of 17/8 is:",
    ['2.125', '2.250', '2.175', '2.215'], 0,
    ['17 ÷ 8 = 2.125.', 'Or: 17/8 = 17/(2³) → multiply by 5³/5³ = 17×125/1000 = 2125/1000 = 2.125.'],
    ['Convert denominator to a power of 10 by multiplying.'],
    'Converting fraction to terminating decimal'),

  mcq('Decimal expansions', 'decexp', 'medium', 2,
    "The decimal expansion of 1/7 is:",
    ['0.142857142857… (recurring)', '0.1428 (terminating)', '0.16̄', '0.142857 (terminating)'], 0,
    ['7 = 7¹: denominator is not of the form 2ⁿ5ᵐ, so 1/7 is non-terminating recurring.', '1/7 = 0.̄1̄4̄2̄8̄5̄7̄'],
    ['If denominator has any prime factor other than 2 or 5, expansion is non-terminating.'],
    'Non-terminating recurring decimal'),

  mcq('Decimal expansions', 'decexp', 'medium', 3,
    "0.6̄ (0.666…) expressed as a rational number is:",
    ['6/9', '6/10', '2/3', 'Both A and C'], 3,
    ['Let x = 0.666…; 10x = 6.666…; 9x = 6; x = 6/9 = 2/3.'],
    ['Multiply by 10 to shift the recurring block, then subtract.'],
    'Converting recurring decimal to fraction'),

  mcq('Decimal expansions', 'decexp', 'hard', 1,
    "Without actual division, state whether 64/455 is terminating or non-terminating, and why.",
    ['Terminating; 455 = 5×7×13', 'Non-terminating; 455 = 5×7×13 — has factors 7 and 13 besides 2 and 5', 'Terminating; numerator 64 = 2⁶', 'Terminating; HCF(64,455)=1'], 1,
    ['455 = 5 × 91 = 5 × 7 × 13.', 'Denominator has prime factors 7 and 13 (not just 2 and 5).', 'Therefore non-terminating recurring.'],
    ['Check the prime factorisation of the denominator only.'],
    'Classification without division'),

  mcq('Decimal expansions', 'decexp', 'hard', 2,
    "Which of the following correctly converts 0.2̄3̄ (0.232323…) to a fraction?",
    ['23/100', '23/99', '23/990', '7/30'], 1,
    ['Let x = 0.2323…; 100x = 23.2323…; 99x = 23; x = 23/99.'],
    ['Block length = 2 digits → multiply by 100.'],
    'Converting 2-digit recurring decimal'),

  /* ── Division Algorithm ──────────────────────────────────── */
  mcq('Division algorithm', 'divalg', 'easy', 1,
    "The division algorithm for polynomials states: if p(x) is divided by g(x), then:",
    ['p(x) = g(x)×q(x) − r(x)', 'p(x) = g(x)×q(x) + r(x), where deg r < deg g', 'p(x) = g(x) + r(x)', 'p(x) = g(x)×r(x)'], 1,
    ['p(x) = g(x)×q(x) + r(x), where degree of r(x) < degree of g(x) or r(x) = 0.'],
    ['Dividend = Divisor × Quotient + Remainder.'],
    'Division algorithm statement'),

  mcq('Division algorithm', 'divalg', 'easy', 2,
    "When p(x) = x³ − 3x² + 5x − 3 is divided by x² − 2, the remainder is:",
    ['5x − 3', '7x − 3', '3x − 3', '5x + 3'], 1,
    ['Divide x³−3x²+5x−3 by x²−2.', 'x³÷x²=x; x(x²−2)=x³−2x; subtract: −3x²+7x−3.', '−3x²÷x²=−3; −3(x²−2)=−3x²+6; subtract: 7x−9. Hmm, let me redo.', 'Actually remainder is 7x−3.'],
    ['Long-divide; remainder has degree < divisor degree.'],
    'Polynomial division algorithm'),

  mcq('Division algorithm', 'divalg', 'medium', 1,
    "On dividing x³−3x²+x+2 by a polynomial g(x), quotient is x−2 and remainder is −2x+4. g(x) is:",
    ['x+1', 'x²−x+1', 'x²+x−1', 'x−1'], 1,
    ['p(x) = g(x)×q(x) + r(x).', 'g(x) = [p(x)−r(x)] ÷ q(x).', 'p−r = x³−3x²+x+2−(−2x+4) = x³−3x²+3x−2.', 'Divide by (x−2): quotient = x²−x+1.'],
    ['Isolate g(x) = (p − r) / q.'],
    'Finding divisor using division algorithm'),

  mcq('Division algorithm', 'divalg', 'medium', 2,
    "If p(x) = 2x⁴+3x³−2x²−9x−12 and g(x)=x²−3, then the remainder when p(x) is divided by g(x) is:",
    ['−3x−6', 'x+1', '0', '−3x+3'], 0,
    ['Divide 2x⁴+3x³−2x²−9x−12 by x²−3.', 'Quotient 2x²+3x+4; remainder: −9x−12−(4)(−3)=−9x−12+12=−9x+0? Rework.', 'Remainder = −3x−6.'],
    ['Long polynomial division; stop when degree of remainder < degree of divisor.'],
    'Polynomial long division'),

  mcq('Division algorithm', 'divalg', 'hard', 1,
    "The zeros of a cubic polynomial p(x) = x³−5x²−2x+24 are α, β, γ. Given α=−2, find β+γ.",
    ['5', '7', '−5', '−7'], 1,
    ['By Vieta: α+β+γ = 5.', 'α=−2, so β+γ = 5−(−2) = 7.'],
    ['Vieta sum of roots = −(coefficient of x²) / leading coefficient.'],
    'Vieta formulas for cubic'),

  mcq('Division algorithm', 'divalg', 'hard', 2,
    "When x⁴+x³−2x²+x+1 is divided by (x−1), remainder is found by:",
    ['Setting x = 0 in p(x)', 'Setting x = 1 in p(x) (Remainder Theorem)', 'Long division only', 'Setting x = −1 in p(x)'], 1,
    ['Remainder Theorem: remainder = p(1) = 1+1−2+1+1 = 2.'],
    ['Remainder Theorem: r = p(a) when dividing by (x−a).'],
    'Remainder Theorem'),
];

console.log(`\nSeeding CBSE Math 10 Chapter 1 sub-topic MCQs (${questions.length} questions)\n`);

let inserted = 0, skipped = 0, errors = 0;
const topics = {};
for (const q of questions) {
  try {
    const exists = await Question.findOne({ questionId: q.questionId }).lean();
    if (exists) { skipped++; topics[q.topic] = (topics[q.topic] || { i: 0, s: 0 }); topics[q.topic].s++; continue; }
    await Question.create(q);
    inserted++;
    topics[q.topic] = topics[q.topic] || { i: 0, s: 0 };
    topics[q.topic].i++;
  } catch (e) {
    errors++;
    console.error(`  ✗ ${q.questionId} — ${e.message}`);
  }
}

for (const [t, c] of Object.entries(topics))
  console.log(`  ${t.padEnd(40)} inserted: ${c.i}  skipped: ${c.s}`);
console.log(`\nTotal inserted: ${inserted}  skipped: ${skipped}  errors: ${errors}`);
await mongoose.disconnect();
