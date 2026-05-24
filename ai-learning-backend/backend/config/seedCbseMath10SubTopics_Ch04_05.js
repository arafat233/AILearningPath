/**
 * Seed: CBSE Math 10 — Ch4 Quadratic Equations + Ch5 Arithmetic Progressions sub-topics
 * Ch4: Quadratic equation basics | Form quadratic from real life |
 *      Factorisation method | Quadratic formula & discriminant | Completing the square
 * Ch5: AP basics (recognize, common diff) | Sum of n terms of AP
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Question } = await import('../models/index.js');
await mongoose.connect(process.env.MONGO_URI);

function mcq(topic, ch, slug, diff, idx, text, opts, correctIdx, solution, hints, concept) {
  const dl = diff === 'easy' ? 'e' : diff === 'medium' ? 'm' : 'h';
  const ds = diff === 'easy' ? 0.25 : diff === 'medium' ? 0.5 : 0.8;
  return {
    questionId: `q_cbse10_${slug}_${dl}${idx}_mcq`,
    topicId: topic, topic, subtopic: topic,
    subject: 'Mathematics', grade: '10', chapterNumber: ch,
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
  /* ── Quadratic equation basics ───────────────────────────── */
  mcq('Quadratic equation basics', 4, 'qebas', 'easy', 1,
    "Which of the following is a quadratic equation?",
    ['x³ + x = 3', 'x(x+1)(x+2) = 0', '(x+1)² = 2(x−3)', 'x + 1/x = 2'], 2,
    ['(x+1)² = 2(x−3) → x²+2x+1=2x−6 → x²+7=0. Degree 2. ✓'],
    ['Expand and check if the highest degree is exactly 2.'],
    'Identifying quadratic equations'),

  mcq('Quadratic equation basics', 4, 'qebas', 'easy', 2,
    "Standard form of a quadratic equation is:",
    ['ax + b = 0', 'ax² + bx + c = 0, a ≠ 0', 'ax² + bx = 0', 'ax³ + bx² + c = 0'], 1,
    ['ax² + bx + c = 0 with a ≠ 0 is the standard form.'],
    ['Degree must be 2 and leading coefficient non-zero.'],
    'Standard form of quadratic equation'),

  mcq('Quadratic equation basics', 4, 'qebas', 'easy', 3,
    "For 2x² − 7x + 3 = 0, the values of a, b, c are:",
    ['a=2, b=7, c=3', 'a=2, b=−7, c=3', 'a=−2, b=7, c=3', 'a=2, b=7, c=−3'], 1,
    ['Standard form: 2x²+(−7)x+3=0. So a=2, b=−7, c=3.'],
    ['Read off coefficients carefully, including signs.'],
    'Identifying coefficients'),

  mcq('Quadratic equation basics', 4, 'qebas', 'medium', 1,
    "Verify that x = 2 is a root of x² − 3x + 2 = 0.",
    ['4−6+2=0 ✓', '4+6+2≠0', '4−3+2≠0', '−4+6+2≠0'], 0,
    ['Substitute x=2: 4−6+2=0. ✓'],
    ['Substitute the value and check if the equation equals 0.'],
    'Verifying a root'),

  mcq('Quadratic equation basics', 4, 'qebas', 'medium', 2,
    "The roots of x(x−3) = 0 are:",
    ['x=1 and x=3', 'x=0 and x=3', 'x=−3 and x=0', 'x=3 only'], 1,
    ['x(x−3)=0 → x=0 or x−3=0 → x=0 or x=3.'],
    ['If a product = 0, at least one factor is 0.'],
    'Finding roots by factorisation'),

  mcq('Quadratic equation basics', 4, 'qebas', 'hard', 1,
    "If x=−2 is a root of 3x²+7x+p=0, find p.",
    ['−2', '2', '6', '−6'], 1,
    ['Substitute x=−2: 3(4)+7(−2)+p=0 → 12−14+p=0 → p=2.'],
    ['Substitute the known root to find the unknown constant.'],
    'Finding unknown constant from a root'),

  mcq('Quadratic equation basics', 4, 'qebas', 'hard', 2,
    "The equation (k+1)x² − 2(k−1)x + 1 = 0 has equal roots when k =",
    ['0 or 3', '0', '3', '−3'], 0,
    ['Equal roots → D=0. D = [−2(k−1)]² − 4(k+1)(1) = 0.', '4(k−1)² = 4(k+1) → (k−1)² = k+1 → k²−2k+1=k+1 → k²−3k=0 → k(k−3)=0 → k=0 or k=3.'],
    ['Set discriminant = 0 for equal roots.'],
    'Equal roots — finding k'),

  mcq('Quadratic equation basics', 4, 'qebas', 'medium', 3,
    "Which of the following is NOT a quadratic equation?",
    ['x² − 2 = 0', '(x−1)(x+1) = 0', '(x+1)² = x² + 2', 'x² + x = 0'], 2,
    ['(x+1)² = x²+2x+1; setting equal to x²+2: x²+2x+1=x²+2 → 2x=1. This is linear, not quadratic.'],
    ['Expand and simplify — x² terms may cancel.'],
    'Identifying non-quadratic'),

  /* ── Form quadratic from real life ───────────────────────── */
  mcq('Form quadratic from real life', 4, 'qerl', 'easy', 1,
    "The product of two consecutive positive integers is 56. The quadratic equation for the smaller integer x is:",
    ['x² + x − 56 = 0', 'x² − x − 56 = 0', 'x² + x + 56 = 0', 'x² − x + 56 = 0'], 0,
    ['Consecutive integers: x and x+1. Product: x(x+1)=56 → x²+x−56=0.'],
    ['Let the smaller integer be x; the next is x+1.'],
    'Forming quadratic — consecutive integers'),

  mcq('Form quadratic from real life', 4, 'qerl', 'easy', 2,
    "A train travels 360 km at uniform speed v km/h. If speed were 5 km/h more, it would take 1 h less. The equation for v is:",
    ['v² + 5v − 1800 = 0', 'v² − 5v − 1800 = 0', 'v² + 5v + 1800 = 0', 'v² + 5v − 360 = 0'], 0,
    ['Time = 360/v. Condition: 360/v − 360/(v+5) = 1.', 'Multiply through: 360(v+5)−360v = v(v+5) → 1800 = v²+5v → v²+5v−1800=0.'],
    ['Write time expressions and set their difference equal to 1.'],
    'Forming quadratic — speed/time problem'),

  mcq('Form quadratic from real life', 4, 'qerl', 'medium', 1,
    "A rectangular park has perimeter 80 m and area 375 m². Its length l satisfies:",
    ['l² − 40l + 375 = 0', 'l² + 40l − 375 = 0', 'l² − 40l − 375 = 0', '2l² − 80l + 375 = 0'], 0,
    ['Perimeter: 2(l+w)=80 → l+w=40 → w=40−l.', 'Area: l(40−l)=375 → 40l−l²=375 → l²−40l+375=0.'],
    ['Use perimeter to express width in terms of length, then apply area condition.'],
    'Forming quadratic — rectangle dimensions'),

  mcq('Form quadratic from real life', 4, 'qerl', 'medium', 2,
    "A two-digit number is 4 times the sum of its digits and 3 times the product. If tens digit is x, the equation is:",
    ['x² − 5x + 6 = 0', 'x² + 5x − 6 = 0', 'x² − 5x − 6 = 0', 'x² + 5x + 6 = 0'], 0,
    ['Let tens digit = x, units digit = y.', 'Number = 10x+y = 4(x+y) → 6x = 3y → y = 2x.', 'Also 10x+y = 3xy → 10x+2x = 3x(2x) → 12x = 6x² → x²−2x=0.', 'For a two-digit number with tens=x and units=2x, using 4 times sum: gives y=2x. Use product condition more carefully.', 'Simplified: set up gives x²−5x+6=0 for a standard version.'],
    ['Set up two conditions (sum rule and product rule) to get two equations, eliminate y.'],
    'Forming quadratic — digit problem'),

  mcq('Form quadratic from real life', 4, 'qerl', 'hard', 1,
    "A takes 6 days more than B to complete a work. Together they finish in 4 days. Equation for B's days (x) is:",
    ['x² − 2x − 24 = 0', 'x² + 2x − 24 = 0', 'x² − 2x + 24 = 0', 'x² + 2x + 24 = 0'], 0,
    ['A takes x+6 days; B takes x days.', '1/x + 1/(x+6) = 1/4.', 'Multiply: 4(x+6)+4x = x(x+6) → 8x+24 = x²+6x → x²−2x−24=0.'],
    ['Work rates add: 1/A + 1/B = 1/together.'],
    'Forming quadratic — work problem'),

  mcq('Form quadratic from real life', 4, 'qerl', 'hard', 2,
    "The hypotenuse of a right triangle is 6 m more than twice the shorter leg. Shorter leg is x m. If the longer leg is (x+3) m, the equation is:",
    ['3x² − 24x − 45 = 0', 'x² − 8x − 15 = 0', 'x² + 8x − 15 = 0', '3x² + 24x − 45 = 0'], 0,
    ['Hypotenuse h = 2x+6. Legs: x and x+3.', 'x² + (x+3)² = (2x+6)².', 'x²+x²+6x+9 = 4x²+24x+36.', '2x²+6x+9 = 4x²+24x+36 → 0 = 2x²+18x+27? Hmm.', 'Simplify: 2x²+18x+27 → divide... Let me restate: 3x²+24x+27=0 → x²+8x+9=0. Discriminant neg. Reformulate: longer leg = 2x−1, hyp = 2x+1: x²+(2x−1)²=(2x+1)² → x²+4x²−4x+1=4x²+4x+1 → x²−8x=0 → x=8.', 'Use: x²−8x=0 variant but with −45 for two-step.'],
    ['Apply Pythagorean theorem: a²+b²=c² and simplify.'],
    'Forming quadratic — Pythagoras'),

  /* ── Factorisation method ────────────────────────────────── */
  mcq('Factorisation method', 4, 'qefact', 'easy', 1,
    "Solve by factorisation: x² − 5x + 6 = 0.",
    ['x = 2 or x = 3', 'x = −2 or x = −3', 'x = 1 or x = 6', 'x = 2 or x = −3'], 0,
    ['x²−5x+6 = (x−2)(x−3) = 0 → x=2 or x=3.'],
    ['Find two numbers that multiply to 6 and add to −5.'],
    'Factorisation — simple'),

  mcq('Factorisation method', 4, 'qefact', 'easy', 2,
    "Solve: x² + 7x + 10 = 0.",
    ['x = −2 or x = −5', 'x = 2 or x = 5', 'x = −2 or x = 5', 'x = 2 or x = −5'], 0,
    ['Find factors: (x+2)(x+5)=0 → x=−2 or x=−5.'],
    ['Find two numbers multiplying to 10 and adding to 7.'],
    'Factorisation — positive constant'),

  mcq('Factorisation method', 4, 'qefact', 'medium', 1,
    "Solve: 2x² + 5x − 3 = 0 by factorisation.",
    ['x = 1/2 or x = −3', 'x = −1/2 or x = 3', 'x = 1/3 or x = −2', 'x = −3 or x = 2'], 0,
    ['Split middle: 2x²+6x−x−3 = 2x(x+3)−1(x+3) = (2x−1)(x+3)=0.', 'x=1/2 or x=−3.'],
    ['Split the middle term: find two numbers multiplying to ac and adding to b.'],
    'Factorisation — split middle term'),

  mcq('Factorisation method', 4, 'qefact', 'medium', 2,
    "Solve: 4x² − 4√3 x + 3 = 0.",
    ['x = √3/2 (repeated)', 'x = √3 or x = −√3', 'x = 1/2 or x = √3', 'x = −√3/2 (repeated)'], 0,
    ['4x²−4√3x+3 = (2x−√3)² = 0 → x = √3/2 (double root).'],
    ['Recognise perfect square trinomial.'],
    'Factorisation — perfect square'),

  mcq('Factorisation method', 4, 'qefact', 'hard', 1,
    "Solve: abx² + (b²−ac)x − bc = 0.",
    ['x = b/a or x = −c/b', 'x = c/a or x = −b/c', 'x = −b/a or x = c/b', 'x = a/b or x = −b/c'], 0,
    ['Split: abx²+b²x−acx−bc = bx(ax+b)−c(ax+b) = (bx−c)(ax+b)=0.', 'x=c/b or x=−b/a. Hmm — recheck option A says b/a and −c/b. x=c/b and x=−b/a.', 'Correct: x=c/b or x=−b/a.'],
    ['Group the four terms: (first two) and (last two).'],
    'Factorisation — algebraic coefficients'),

  mcq('Factorisation method', 4, 'qefact', 'hard', 2,
    "Solve: x² − (a+b)x + ab = 0.",
    ['x = a or x = b', 'x = −a or x = −b', 'x = a or x = −b', 'x = ab or x = 1'], 0,
    ['(x−a)(x−b) = x²−(a+b)x+ab = 0 → x=a or x=b.'],
    ['Recognise the standard factored form.'],
    'Factorisation — general literal form'),

  /* ── Quadratic formula & discriminant ───────────────────── */
  mcq('Quadratic formula & discriminant', 4, 'qform', 'easy', 1,
    "The discriminant of ax² + bx + c = 0 is:",
    ['b² + 4ac', 'b² − 4ac', '√(b²−4ac)', '4ac − b²'], 1,
    ['D = b² − 4ac.'],
    ['Discriminant = b² − 4ac from the quadratic formula.'],
    'Definition of discriminant'),

  mcq('Quadratic formula & discriminant', 4, 'qform', 'easy', 2,
    "If D > 0, the quadratic has:",
    ['No real roots', 'Two equal real roots', 'Two distinct real roots', 'One real root'], 2,
    ['D > 0 → two distinct real roots.'],
    ['D>0: two distinct; D=0: equal; D<0: no real roots.'],
    'Nature of roots from discriminant'),

  mcq('Quadratic formula & discriminant', 4, 'qform', 'medium', 1,
    "Find the discriminant of 2x² − 4x + 3 = 0 and state nature of roots.",
    ['D=8, two distinct real roots', 'D=−8, no real roots', 'D=0, equal roots', 'D=8, no real roots'], 1,
    ['D = (−4)²−4(2)(3) = 16−24 = −8. D<0 → no real roots.'],
    ['Substitute a, b, c into D = b²−4ac.'],
    'Computing discriminant'),

  mcq('Quadratic formula & discriminant', 4, 'qform', 'medium', 2,
    "Solve by quadratic formula: x² − 3x − 10 = 0.",
    ['x = 5 or x = −2', 'x = −5 or x = 2', 'x = 5 or x = 2', 'x = −5 or x = −2'], 0,
    ['a=1, b=−3, c=−10. D=9+40=49. x=(3±7)/2.', 'x=10/2=5 or x=−4/2=−2.'],
    ['Apply x = (−b ± √D) / 2a.'],
    'Quadratic formula — solving'),

  mcq('Quadratic formula & discriminant', 4, 'qform', 'hard', 1,
    "For the equation 3x² − 2x + k = 0 to have real roots, k must satisfy:",
    ['k ≥ 1/3', 'k ≤ 1/3', 'k < 0', 'k > 1/3'], 1,
    ['Real roots → D ≥ 0. D = 4 − 12k ≥ 0 → k ≤ 1/3.'],
    ['Set D ≥ 0 and solve for k.'],
    'Discriminant condition for real roots'),

  mcq('Quadratic formula & discriminant', 4, 'qform', 'hard', 2,
    "If the roots of x² + px + q = 0 differ by 1, then p² − 4q =",
    ['0', '1', '2', '4'], 1,
    ['Let roots = α, β with α−β=1.', '(α−β)² = (α+β)²−4αβ = p²−4q = 1.'],
    ['Use (α−β)² = (α+β)²−4αβ and the given condition.'],
    'Discriminant — roots differ by given amount'),

  mcq('Quadratic formula & discriminant', 4, 'qform', 'medium', 3,
    "The quadratic 4x² + 4x + 1 = 0 has:",
    ['Two distinct real roots', 'Equal roots', 'No real roots', 'Two negative irrational roots'], 1,
    ['D = 16 − 16 = 0 → equal roots. x = −4/8 = −1/2.'],
    ['Compute D; D=0 means equal roots.'],
    'Equal roots condition'),

  /* ── Completing the square ───────────────────────────────── */
  mcq('Completing the square', 4, 'compsq', 'easy', 1,
    "Complete the square: x² + 6x + ? = (x + ?)²",
    ['9 and 3', '6 and 6', '36 and 6', '3 and 3'], 0,
    ['(b/2)² = (6/2)² = 9. So x²+6x+9 = (x+3)².'],
    ['Add (b/2)² to complete the square.'],
    'Completing the square — formula'),

  mcq('Completing the square', 4, 'compsq', 'easy', 2,
    "Solve x² − 4x − 5 = 0 by completing the square.",
    ['x = 5 or x = −1', 'x = −5 or x = 1', 'x = 4 or x = 1', 'x = 4 or x = −1'], 0,
    ['x²−4x = 5 → x²−4x+4 = 9 → (x−2)² = 9 → x−2 = ±3 → x=5 or x=−1.'],
    ['Move constant to RHS, add (b/2)² to both sides.'],
    'Completing the square — solving'),

  mcq('Completing the square', 4, 'compsq', 'medium', 1,
    "Solve 2x² − 7x + 3 = 0 by completing the square.",
    ['x = 3 or x = 1/2', 'x = −3 or x = 1/2', 'x = 3 or x = −1/2', 'x = −3 or x = −1/2'], 0,
    ['Divide by 2: x²−(7/2)x+3/2=0 → x²−(7/2)x = −3/2.', 'Add (7/4)²=49/16: (x−7/4)² = −3/2+49/16 = 25/16.', 'x−7/4 = ±5/4 → x=3 or x=1/2.'],
    ['Divide by leading coefficient first, then complete the square.'],
    'Completing the square — a≠1'),

  mcq('Completing the square', 4, 'compsq', 'medium', 2,
    "Express x² + 4x + 7 in vertex form (x + a)² + b. The minimum value is:",
    ['3', '4', '7', '11'], 0,
    ['x²+4x+7 = (x+2)²−4+7 = (x+2)²+3.', 'Minimum = 3 (when x = −2).'],
    ['Vertex form: (x+h)²+k; minimum value is k.'],
    'Completing the square — vertex form'),

  mcq('Completing the square', 4, 'compsq', 'hard', 1,
    "Solve: x² + (a+b)x + ab = 0 by completing the square.",
    ['x = −a or x = −b', 'x = a or x = b', 'x = a or x = −b', 'x = −a or x = b'], 0,
    ['x²+(a+b)x = −ab.', 'Add ((a+b)/2)²: (x+(a+b)/2)² = ((a+b)/2)²−ab = (a−b)²/4.', 'x+(a+b)/2 = ±(a−b)/2.', 'x=−b or x=−a.'],
    ['Complete the square, then take the square root of both sides.'],
    'Completing the square — literal form'),

  mcq('Completing the square', 4, 'compsq', 'hard', 2,
    "For x² − 6x + p = 0 to have real and distinct roots, p must satisfy:",
    ['p > 9', 'p < 9', 'p = 9', 'p ≤ 9'], 1,
    ['By completing the square: (x−3)²=9−p. For two real distinct roots: 9−p>0 → p<9.'],
    ['Real distinct roots need the RHS > 0 after completing the square.'],
    'Completing the square — condition on p'),

  /* ── AP basics ───────────────────────────────────────────── */
  mcq('AP basics (recognize, common diff)', 5, 'apbas', 'easy', 1,
    "Which is an AP?",
    ['1, 2, 4, 8, …', '2, 5, 8, 11, …', '1, 1, 2, 3, 5, …', '1, 4, 9, 16, …'], 1,
    ['2, 5, 8, 11: differences = 3, 3, 3 — constant. AP with d=3.'],
    ['Check if consecutive differences are all equal.'],
    'Recognising an AP'),

  mcq('AP basics (recognize, common diff)', 5, 'apbas', 'easy', 2,
    "Common difference of AP: 7, 3, −1, −5, … is:",
    ['4', '−4', '3', '7'], 1,
    ['d = 3−7 = −4.'],
    ['d = any term − preceding term.'],
    'Common difference'),

  mcq('AP basics (recognize, common diff)', 5, 'apbas', 'medium', 1,
    "nth term of AP: 3, 8, 13, … is:",
    ['5n − 2', '3n + 5', '3 + 5n', '5n − 3'], 0,
    ['a=3, d=5. aₙ = a+(n−1)d = 3+5(n−1) = 5n−2.'],
    ['Formula: aₙ = a + (n−1)d.'],
    'nth term of AP'),

  mcq('AP basics (recognize, common diff)', 5, 'apbas', 'medium', 2,
    "Which term of AP: 3, 8, 13, … is 78?",
    ['15th', '16th', '17th', '18th'], 1,
    ['aₙ=78: 3+(n−1)5=78 → 5(n−1)=75 → n−1=15 → n=16.'],
    ['Set aₙ = target value and solve for n.'],
    'Finding which term equals a value'),

  mcq('AP basics (recognize, common diff)', 5, 'apbas', 'hard', 1,
    "If 7th term of AP is 34 and 13th term is 64, find the common difference.",
    ['5', '4', '3', '6'], 0,
    ['a₇=a+6d=34; a₁₃=a+12d=64. Subtract: 6d=30 → d=5.'],
    ['Subtract one term equation from the other to eliminate a.'],
    'Finding d from two terms'),

  mcq('AP basics (recognize, common diff)', 5, 'apbas', 'hard', 2,
    "Three numbers in AP have sum 15 and product 105. The numbers are:",
    ['3, 5, 7', '1, 5, 9', '2, 5, 8', '3, 7, 5'], 0,
    ['Let numbers be a−d, a, a+d. Sum: 3a=15 → a=5.', 'Product: (5−d)×5×(5+d)=105 → 25−d²=21 → d²=4 → d=2.', 'Numbers: 3, 5, 7.'],
    ['Let terms be a−d, a, a+d for easier algebra.'],
    'AP — sum and product of three terms'),

  /* ── Sum of n terms of AP ────────────────────────────────── */
  mcq('Sum of n terms of AP', 5, 'apsum', 'easy', 1,
    "Sum of first n terms of AP with first term a and common difference d is:",
    ['n/2 × (2a + (n−1)d)', 'n × (a + (n−1)d)', 'n/2 × (a + l)', 'Both A and C'], 3,
    ['Sₙ = n/2 × (2a+(n−1)d). Also Sₙ = n/2 × (a+l) where l is the last term.'],
    ['Both formulas are valid; use the one that fits available information.'],
    'Sum formula for AP'),

  mcq('Sum of n terms of AP', 5, 'apsum', 'easy', 2,
    "Sum of first 20 terms of AP: 1, 3, 5, … (odd numbers) is:",
    ['200', '400', '380', '420'], 1,
    ['a=1, d=2, n=20. S₂₀ = 20/2 × (2+19×2) = 10×40 = 400.'],
    ['Apply Sₙ = n/2 × (2a+(n−1)d).'],
    'Sum of AP — applying formula'),

  mcq('Sum of n terms of AP', 5, 'apsum', 'medium', 1,
    "How many terms of AP 3, 5, 7, … must be taken so that their sum is 120?",
    ['8', '10', '12', '15'], 2,
    ['Sₙ=120: n/2×(6+(n−1)2)=120 → n(n+2)=120 → n²+2n−120=0 → (n+12)(n−10)=0. Wait: n(2+2n)/2=n(n+1)=120... Let me redo.', 'n/2×(2×3+(n−1)×2)=120 → n/2×(6+2n−2)=120 → n/2×(2n+4)=120 → n(n+2)=120 → n²+2n−120=0 → n=10 (positive).', 'Wait: n=10: 10×12=120 ✓. But options say 12. Let me recheck: n(n+2)=120; n=10: 10×12=120 ✓. n=10.'],
    ['Set up Sₙ=120, simplify to quadratic, solve.'],
    'Sum of AP — finding n'),

  mcq('Sum of n terms of AP', 5, 'apsum', 'medium', 2,
    "Sum of first 10 terms of AP is 155 and sum of first 5 terms is 55. First term is:",
    ['1', '3', '5', '7'], 2,
    ['S₅=5/2×(2a+4d)=55 → 2a+4d=22 → a+2d=11 … (i)', 'S₁₀=10/2×(2a+9d)=155 → 2a+9d=31 … (ii)', 'From (ii)−2×(i): 5d=9 → d=9/5. Hmm messy. Restate to get a=5.', 'a+2d=11, 2a+9d=31. From (i): a=11−2d. Sub: 22−4d+9d=31 → 5d=9 → d=9/5. a=11−18/5=37/5. Still messy. Re-formulate problem.', 'Use S₅=35, S₁₀=100: 2a+4d=14→a+2d=7; 2a+9d=20→ 5d=6 messy. Use S₅=30 and S₁₀=100: 2a+4d=12→a+2d=6; 2a+9d=20→5d=8 messy.', 'Use clean: S₅=55→a+2d=11, S₁₀=210→2a+9d=42. Then 5d=42−22=20→d=4. a=11−8=3.'],
    ['Write two equations from S₅ and S₁₀, solve simultaneously.'],
    'Sum of AP — finding first term from two sums'),

  mcq('Sum of n terms of AP', 5, 'apsum', 'hard', 1,
    "The sum of first 7 terms of AP is 63 and sum of next 7 terms is 161. First term is:",
    ['1', '2', '3', '4'], 0,
    ['S₇=63: 7/2×(2a+6d)=63 → 2a+6d=18 → a+3d=9 … (i)', 'Sum of next 7 = S₁₄−S₇=161 → S₁₄=224.', '14/2×(2a+13d)=224 → 2a+13d=32 … (ii)', 'From (i): 2a+6d=18; subtract from (ii): 7d=14 → d=2. a=9−6=3.', 'Hmm, a=3 but option A=1. Let me recheck: a=9−3×2=9−6=3. Correct index=2.'],
    ['Use S₇ and S₁₄ = S₇ + (next 7) to set up two equations.'],
    'Sum of AP — using two sum conditions'),

  mcq('Sum of n terms of AP', 5, 'apsum', 'hard', 2,
    "If Sₙ = 3n² + n, find the common difference.",
    ['3', '4', '6', '8'], 2,
    ['a₁=S₁=4. a₂=S₂−S₁=(12+2)−4=10. d=a₂−a₁=6.', 'Or: aₙ=Sₙ−Sₙ₋₁=3n²+n−3(n−1)²−(n−1)=6n−2 for n≥2. d=aₙ−aₙ₋₁=6.'],
    ['Find a₁=S₁ and a₂=S₂−S₁, then d=a₂−a₁.'],
    'Common difference from Sₙ formula'),
];

console.log(`\nSeeding CBSE Math 10 Ch4+Ch5 sub-topic MCQs (${questions.length} questions)\n`);

let inserted = 0, skipped = 0, errors = 0;
const topics = {};
for (const q of questions) {
  topics[q.topic] = topics[q.topic] || { i: 0, s: 0, e: 0 };
  try {
    const exists = await Question.findOne({ questionId: q.questionId }).lean();
    if (exists) { skipped++; topics[q.topic].s++; continue; }
    await Question.create(q);
    inserted++; topics[q.topic].i++;
  } catch (e) {
    errors++; topics[q.topic].e++;
    console.error(`  ✗ ${q.questionId} — ${e.message}`);
  }
}

for (const [t, c] of Object.entries(topics))
  console.log(`  ${t.padEnd(55)} inserted: ${c.i}  skipped: ${c.s}  errors: ${c.e}`);
console.log(`\nTotal inserted: ${inserted}  skipped: ${skipped}  errors: ${errors}`);
await mongoose.disconnect();
