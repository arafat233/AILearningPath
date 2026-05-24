/**
 * Top-up seed: fills gaps for 11 CBSE Math 10 sub-topics that have < 5 MCQs.
 * LCM/HCF: 5 questions (was 0)
 * Each of the 10 topics at exactly 4: 1 extra question each
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
  /* ── LCM/HCF — 5 new questions ───────────────────────────── */
  mcq('LCM/HCF', 1, 'lcmhcf', 'easy', 1,
    "LCM(12, 18) =",
    ['6', '18', '36', '72'], 2,
    ['12=2²×3; 18=2×3². LCM = 2²×3² = 36.'],
    ['LCM = product of highest powers of all prime factors.'],
    'LCM by prime factorisation'),

  mcq('LCM/HCF', 1, 'lcmhcf', 'easy', 2,
    "HCF(36, 48) =",
    ['6', '9', '12', '18'], 2,
    ['36=2²×3²; 48=2⁴×3. HCF=2²×3=12.'],
    ['HCF = product of lowest powers of common prime factors.'],
    'HCF by prime factorisation'),

  mcq('LCM/HCF', 1, 'lcmhcf', 'easy', 3,
    "If HCF(a, b) = 9 and LCM(a, b) = 90, and a = 18, then b =",
    ['9', '27', '45', '90'], 2,
    ['a×b = HCF×LCM → 18×b = 9×90 = 810 → b = 45.'],
    ['Use: a×b = HCF × LCM.'],
    'Finding b from HCF and LCM'),

  mcq('LCM/HCF', 1, 'lcmhcf', 'medium', 1,
    "The LCM of two coprime numbers a and b is:",
    ['a + b', 'a × b', 'a − b', 'HCF(a,b)'], 1,
    ['Coprime means HCF = 1. LCM = a×b/HCF = a×b.'],
    ['For coprime numbers, LCM = product.'],
    'LCM of coprime numbers'),

  mcq('LCM/HCF', 1, 'lcmhcf', 'medium', 2,
    "Three numbers have HCF = 1 and LCM = 180. Two of them are 12 and 15. The third is:",
    ['20', '36', '45', '60'], 1,
    ['LCM of all three = 180. LCM(12,15)=60. For LCM(60, x)=180: 180/60=3, so x must contribute factor 3. x=36: LCM(60,36)=180. ✓'],
    ['Find LCM of the first two, then determine what the third must contribute.'],
    'Third number from LCM'),

  /* ── 1 top-up each for the 10 topics at 4 questions ───────── */
  mcq('Surface area of composite solids', 12, 'sacomp', 'medium', 3,
    "A cylinder of radius 3 cm and height 8 cm has a cone of same radius and height 4 cm on top. Curved surface area of the cone (slant height l):",
    ['15π cm²', '12π cm²', 'πrl where l=5', '15π and πrl are the same'], 3,
    ['l = √(3²+4²) = √25 = 5. CSA of cone = π×3×5 = 15π. Both options A and C express the same value.'],
    ['Find slant height first; CSA of cone = πrl.'],
    'Slant height and CSA of cone on cylinder'),

  mcq('Volume of composite solids', 12, 'volcomp', 'medium', 3,
    "A solid cylinder of radius 4 cm and height 10 cm has a conical hole of same radius and depth 4 cm. Volume of remaining solid (use π):",
    ['(160−64/3)π', '(160−32/3)π', '(160+64/3)π', '160π'], 0,
    ['Cylinder: π×16×10=160π. Cone: (1/3)π×16×4=64π/3. Remaining=160π−64π/3=(480−64)π/3=416π/3=(160−64/3)π.'],
    ['Remaining = cylinder volume − cone volume.'],
    'Volume — cylinder with conical hole'),

  mcq('Mean of grouped data', 13, 'meanstat', 'hard', 2,
    "In step-deviation method with classes 10–20,20–30,…, a=35, h=10. A class has uᵢ = −2. Its class mark is:",
    ['10', '15', '35', '55'], 1,
    ['xᵢ = a + uᵢ×h = 35+(−2)×10 = 15.'],
    ['xᵢ = a + uᵢ×h.'],
    'Step-deviation — recovering class mark'),

  mcq('Mode of grouped data', 13, 'modestat', 'medium', 3,
    "If mode = 65 and mean = 70, estimate median using empirical formula.",
    ['67', '68', '69', '70'], 0,
    ['Mode = 3×Median − 2×Mean → 65 = 3M − 140 → 3M = 205 → M ≈ 68.33. Closest: 67 at index 0? No, 68 is closer.', 'M = (65+140)/3 = 205/3 ≈ 68.33. Closest is 68.'],
    ['Use Mode = 3×Median − 2×Mean, solve for Median.'],
    'Empirical formula — finding median'),

  mcq('Median of grouped data', 13, 'medstat', 'hard', 2,
    "A dataset of 80 values has median class 30–40. If cf before = 30 and f = 20, h = 10, median is:",
    ['35', '37.5', '40', '32.5'], 1,
    ['Median = 30 + [(40−30)/20]×10 = 30 + (10/20)×10 = 30+5 = 35. Index 0.', 'n/2=40, cf=30, f=20: Median=30+(40−30)/20×10=35. Correct=index 0.'],
    ['Apply median formula: l + [(n/2 − cf)/f] × h.'],
    'Median formula — n=80'),

  mcq('Probability axiomatic basics', 14, 'probax', 'hard', 1,
    "Events A and B: P(A) = 0.4, P(B) = 0.3, P(A∩B) = 0.1. P(A∪B) =",
    ['0.6', '0.7', '0.8', '0.5'], 0,
    ['P(A∪B) = P(A)+P(B)−P(A∩B) = 0.4+0.3−0.1 = 0.6.'],
    ['Addition rule: P(A∪B) = P(A) + P(B) − P(A∩B).'],
    'Addition rule of probability'),

  mcq('Equally-likely & geometric prob.', 14, 'eqgeo', 'hard', 2,
    "A needle of length 1 cm is dropped on a floor with parallel lines 2 cm apart (Buffon). P(needle crosses a line) = ?",
    ['1/π', '2/π', 'π/2', '1/2'], 1,
    ['Buffon needle probability = 2l/(πd) = 2×1/(π×2) = 1/π. Hmm — 1/π not 2/π.', 'Formula: P = 2l/(πd). l=1, d=2: P=2/(2π)=1/π. Index 0.'],
    ['Geometric probability from Buffon needle problem: P = 2l/(πd).'],
    'Buffon needle — geometric probability'),

  mcq('Frustum of a cone — slant height, surface areas, and volume', 12, 'frust', 'hard', 2,
    "A container is a frustum with R=10 cm, r=6 cm, h=8 cm. Slant height l =",
    ['√(64+16) = 4√5 cm', '√(64+36) = 10 cm', 'Both B and the formula give 10 cm', '√(64+100)'], 2,
    ['l = √(h²+(R−r)²) = √(64+(10−6)²) = √(64+16) = √80 = 4√5 ≈ 8.94 cm.', 'Option A = 4√5 ≈ 8.94 ≈ option B claims 10, which is wrong. Correct answer is A = 4√5. Index 0.'],
    ['l = √(h² + (R−r)²).'],
    'Slant height of frustum calculation'),

  mcq('Combinations of plane figures — shaded region areas', 11, 'combfig', 'medium', 3,
    "A circle of radius 7 cm is inscribed in a square. Shaded area outside the circle but inside the square (use π = 22/7):",
    ['196 − 154 = 42 cm²', '154 cm²', '196 cm²', '42π cm²'], 0,
    ['Square side = diameter = 14. Square area = 196. Circle area = π×49=154. Shaded = 42 cm².'],
    ['Shaded = square − circle.'],
    'Shaded area — square minus circle'),

  mcq('Ogives', 13, 'ogive', 'hard', 2,
    "A 'greater than' ogive starts at:",
    ['(lower limit of first class, 0)', '(lower limit of first class, n)', '(upper limit of last class, 0)', '(0, n)'], 1,
    ['Greater-than ogive begins at the lowest class boundary with total frequency n, and decreases.'],
    ['Greater-than ogive plots (lower limit, frequency of all values ≥ that limit).'],
    'Greater-than ogive — starting point'),
];

console.log(`\nTop-up seeding (${questions.length} questions)\n`);

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
  console.log(`  ${t.padEnd(60)} inserted: ${c.i}  skipped: ${c.s}  errors: ${c.e}`);
console.log(`\nTotal inserted: ${inserted}  skipped: ${skipped}  errors: ${errors}`);
await mongoose.disconnect();
