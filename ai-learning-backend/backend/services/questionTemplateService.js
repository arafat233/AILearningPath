/**
 * Question Template Service — dynamic per-student question generation.
 *
 * Each template defines: parameterized question text, variable ranges,
 * an answer function, and distractor functions (common errors).
 *
 * Determinism guarantees:
 *   same userId + templateId + attemptN  → identical question (resumable)
 *   different userId                     → different question
 *   same school, sequential variant_idx  → distinct pool (school-aware)
 *
 * Port of dynamic_question_generator.py.
 */

import crypto from "crypto";

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────────

function seedFromStr(str) {
  return parseInt(crypto.createHash("md5").update(str).digest("hex").slice(0, 8), 16);
}

class Rng {
  constructor(seed) { this._s = (seed >>> 0) || 1; }
  next() {
    let t = (this._s += 0x6D2B79F5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  randInt(lo, hi) { return lo + Math.floor(this.next() * (hi - lo + 1)); }
  choice(arr)     { return arr[Math.floor(this.next() * arr.length)]; }
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// ── Math helpers ──────────────────────────────────────────────────────────────

function gcd(a, b) { while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return (a / gcd(a, b)) * b; }

// ── Template output builder ───────────────────────────────────────────────────

function buildResult(templateId, topicId, difficulty, questionType, marks, questionText, correct, distractors, vars) {
  const correctStr = String(correct);
  return {
    templateId,
    topicId,
    difficulty,
    questionType,
    marks,
    questionText,
    correctAnswer: correctStr,
    // Thin MCQ options (for MCQ-type templates)
    ...(questionType === "mcq" ? {
      options: null, // caller fills MCQ from distractors
    } : {}),
    distractors: distractors
      .filter((d) => String(d.value) !== correctStr)
      .map((d, i) => ({ text: String(d.value), misconceptionId: d.misc ?? null, _idx: i })),
    variablesUsed: vars,
    isDynamic: true,
  };
}

// ── Templates ─────────────────────────────────────────────────────────────────

// CH1 — HCF of two numbers
const T_CH1_HCF = {
  templateId: "t_ch1_hcf_v1",
  topicId:    "ch1_s2_c1_t2",
  difficulty: "easy",
  questionType: "numeric",
  marks: 1,
  render(seed) {
    const rng = new Rng(seed);
    let a, b, tries = 0;
    do { a = rng.randInt(12, 200); b = rng.randInt(12, 200); tries++; }
    while ((a === b || gcd(a, b) <= 1) && tries < 200);
    const correct = gcd(a, b);
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the HCF of ${a} and ${b}.`,
      correct,
      [
        { value: lcm(a, b),               misc: "ch1_s2_c1_t2_misc_1" }, // gave LCM
        { value: a + b,                   misc: "ch1_s2_c1_t2_misc_2" }, // added
        { value: Math.abs(a - b),         misc: "ch1_s2_c1_t2_misc_3" }, // subtracted
      ],
      { a, b }
    );
  },
};

// CH1 — LCM of two numbers (medium)
const T_CH1_LCM = {
  templateId: "t_ch1_lcm_v1",
  topicId:    "ch1_s2_c1_t2",
  difficulty: "medium",
  questionType: "numeric",
  marks: 1,
  render(seed) {
    const rng = new Rng(seed);
    let a, b, tries = 0;
    do { a = rng.randInt(6, 60); b = rng.randInt(6, 60); tries++; }
    while ((a === b || gcd(a, b) === 1) && tries < 200);
    const correct = lcm(a, b);
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the LCM of ${a} and ${b}.`,
      correct,
      [
        { value: gcd(a, b),         misc: "ch1_s2_c1_t2_misc_1" }, // gave HCF
        { value: a * b,             misc: "ch1_s2_c1_t2_misc_4" }, // just multiplied
        { value: a + b,             misc: "ch1_s2_c1_t2_misc_2" },
      ],
      { a, b }
    );
  },
};

// CH2 — Find smaller zero of quadratic (medium)
const T_CH2_QUAD_ZEROS = {
  templateId: "t_ch2_quad_zeros_v1",
  topicId:    "ch2_s3_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 1,
  render(seed) {
    const rng = new Rng(seed);
    let z1 = rng.randInt(2, 10);
    let z2 = rng.randInt(2, 10);
    while (z2 === z1) z2 = rng.randInt(2, 10);
    const sumZ  = z1 + z2;
    const prodZ = z1 * z2;
    const correct = Math.min(z1, z2);
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the smaller zero of the polynomial x² − ${sumZ}x + ${prodZ}.`,
      correct,
      [
        { value: Math.max(z1, z2),  misc: "ch2_s3_c1_t1_misc_1" }, // larger zero
        { value: sumZ,              misc: "ch2_s3_c1_t1_misc_2" }, // sum not root
        { value: -correct,          misc: "ch2_s3_c1_t1_misc_3" }, // sign flipped
      ],
      { z1, z2, sumZ, prodZ }
    );
  },
};

// CH4 — Discriminant (nature of roots)
const T_CH4_DISCRIMINANT = {
  templateId: "t_ch4_discriminant_v1",
  topicId:    "ch4_s3_c1_t1",
  difficulty: "easy",
  questionType: "mcq",
  marks: 1,
  render(seed) {
    const rng = new Rng(seed);
    const a = rng.randInt(1, 5);
    const b = rng.randInt(-10, 10);
    const c = rng.randInt(-8, 8);
    const D = b * b - 4 * a * c;
    let correct, wrong1, wrong2, wrong3;
    if (D > 0) {
      correct = "Two distinct real roots";
      wrong1  = "Two equal real roots";
      wrong2  = "No real roots";
      wrong3  = "One real and one imaginary root";
    } else if (D === 0) {
      correct = "Two equal real roots";
      wrong1  = "Two distinct real roots";
      wrong2  = "No real roots";
      wrong3  = "Exactly one real root";
    } else {
      correct = "No real roots";
      wrong1  = "Two distinct real roots";
      wrong2  = "Two equal real roots";
      wrong3  = "One positive root";
    }
    const options = rng.shuffle([
      { text: correct, isCorrect: true },
      { text: wrong1,  isCorrect: false },
      { text: wrong2,  isCorrect: false },
      { text: wrong3,  isCorrect: false },
    ]);
    const result = buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the nature of roots of ${a}x² + (${b})x + (${c}) = 0.  [D = b²−4ac]`,
      correct,
      [{ value: wrong1 }, { value: wrong2 }, { value: wrong3 }],
      { a, b, c, D }
    );
    result.options = options;
    return result;
  },
};

// CH5 — nth term of AP
const T_CH5_NTH_TERM = {
  templateId: "t_ch5_nth_term_v1",
  topicId:    "ch5_s1_c2_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 1,
  render(seed) {
    const rng = new Rng(seed);
    const a = rng.randInt(1, 30);
    const d = rng.randInt(2, 10);
    const n = rng.randInt(5, 25);
    const correct = a + (n - 1) * d;
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the ${n}th term of an AP with first term ${a} and common difference ${d}.`,
      correct,
      [
        { value: a + n * d,        misc: "ch5_s1_c2_t1_misc_1" }, // off-by-one (used n not n-1)
        { value: a * n + d,        misc: "ch5_s1_c2_t1_misc_2" }, // wrong operation
        { value: n * d,            misc: "ch5_s1_c2_t1_misc_3" }, // forgot a
      ],
      { a, d, n }
    );
  },
};

// CH5 — Sum of n terms of AP (medium)
const T_CH5_SUM = {
  templateId: "t_ch5_sum_v1",
  topicId:    "ch5_s2_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng = new Rng(seed);
    const a = rng.randInt(1, 20);
    const d = rng.randInt(1, 8);
    const n = rng.randInt(5, 20);
    const correct = Math.round((n / 2) * (2 * a + (n - 1) * d));
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the sum of the first ${n} terms of an AP with first term ${a} and common difference ${d}.`,
      correct,
      [
        { value: n * a + n * d,        misc: "ch5_s2_c1_t1_misc_1" }, // forgot (n-1)
        { value: (n / 2) * (a + n * d), misc: "ch5_s2_c1_t1_misc_2" }, // used wrong last term
        { value: n * a,                 misc: "ch5_s2_c1_t1_misc_3" }, // ignored d
      ],
      { a, d, n }
    );
  },
};

// CH7 — Distance formula
const T_CH7_DISTANCE = {
  templateId: "t_ch7_distance_v1",
  topicId:    "ch7_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng = new Rng(seed);
    let x1, y1, x2, y2, tries = 0;
    do {
      x1 = rng.randInt(-8, 8); y1 = rng.randInt(-8, 8);
      x2 = rng.randInt(-8, 8); y2 = rng.randInt(-8, 8);
      tries++;
    } while ((x1 === x2 && y1 === y2) && tries < 100);
    const dx = x2 - x1, dy = y2 - y1;
    const correct = parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(2));
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the distance between points P(${x1}, ${y1}) and Q(${x2}, ${y2}). (Round to 2 decimal places.)`,
      correct,
      [
        { value: parseFloat((Math.abs(dx) + Math.abs(dy)).toFixed(2)), misc: "ch7_s1_c1_t1_misc_1" }, // Manhattan
        { value: parseFloat(Math.sqrt(Math.abs(dx) + Math.abs(dy)).toFixed(2)), misc: "ch7_s1_c1_t1_misc_2" }, // forgot squares
        { value: parseFloat((dx + dy).toFixed(2)), misc: "ch7_s1_c1_t1_misc_3" }, // no abs
      ],
      { x1, y1, x2, y2 }
    );
  },
};

// CH7 — Section formula (medium)
const T_CH7_SECTION = {
  templateId: "t_ch7_section_v1",
  topicId:    "ch7_s2_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng = new Rng(seed);
    const x1 = rng.randInt(-6, 6), y1 = rng.randInt(-6, 6);
    const x2 = rng.randInt(-6, 6), y2 = rng.randInt(-6, 6);
    const m  = rng.randInt(1, 4),  nr = rng.randInt(1, 4);
    const px = parseFloat(((m * x2 + nr * x1) / (m + nr)).toFixed(2));
    const py = parseFloat(((m * y2 + nr * y1) / (m + nr)).toFixed(2));
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `A point P divides the segment joining A(${x1}, ${y1}) and B(${x2}, ${y2}) in the ratio ${m}:${nr}. Find the x-coordinate of P. (Round to 2 dp.)`,
      px,
      [
        { value: parseFloat(((nr * x2 + m * x1) / (m + nr)).toFixed(2)), misc: "ch7_s2_c1_t1_misc_1" }, // swapped m and n
        { value: parseFloat(((x1 + x2) / 2).toFixed(2)),                 misc: "ch7_s2_c1_t1_misc_2" }, // used midpoint
        { value: parseFloat(((m * x1 + nr * x2) / (m + nr)).toFixed(2)), misc: "ch7_s2_c1_t1_misc_3" }, // swapped A and B
      ],
      { x1, y1, x2, y2, m, n: nr }
    );
  },
};

// CH13 — Mean of grouped data (medium)
const T_CH13_MEAN = {
  templateId: "t_ch13_mean_v1",
  topicId:    "ch13_s1_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 3,
  render(seed) {
    const rng = new Rng(seed);
    const width  = rng.choice([10, 20]);
    const start  = rng.choice([0, 10, 20]);
    const nCls   = 4;
    const mids   = Array.from({ length: nCls }, (_, i) => start + width * i + width / 2);
    const freqs  = Array.from({ length: nCls }, () => rng.randInt(3, 12));
    const sumF   = freqs.reduce((s, f) => s + f, 0);
    const sumFX  = freqs.reduce((s, f, i) => s + f * mids[i], 0);
    const correct = parseFloat((sumFX / sumF).toFixed(2));

    const clsLabels = mids.map((m, i) => {
      const lo = start + width * i, hi = lo + width;
      return `${lo}–${hi} (${freqs[i]})`;
    });
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the mean of: ${clsLabels.join(", ")}. (Round to 2 dp.)`,
      correct,
      [
        { value: parseFloat((mids.reduce((s, m) => s + m, 0) / nCls).toFixed(2)), misc: "ch13_s1_c1_t1_misc_1" }, // forgot freqs
        { value: parseFloat((sumFX / nCls).toFixed(2)),                           misc: "ch13_s1_c1_t1_misc_2" }, // divided by n classes
        { value: sumF,                                                             misc: "ch13_s1_c1_t1_misc_3" }, // returned total freq
      ],
      { classes: clsLabels, mids, freqs, sumF, sumFX }
    );
  },
};

// CH14 — Basic probability (easy)
const T_CH14_PROBABILITY = {
  templateId: "t_ch14_prob_v1",
  topicId:    "ch14_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 1,
  render(seed) {
    const rng = new Rng(seed);
    const scenarios = [
      () => {
        const n = rng.randInt(2, 6) * rng.randInt(2, 4); // deck-like
        const fav = rng.randInt(1, Math.floor(n / 2));
        return { text: `A bag has ${n} marbles. ${fav} are red. A marble is drawn at random. Find the probability of drawing a red marble. Express as a fraction (numerator only if denominator is ${n}).`, correct: fav, note: `${fav}/${n}`, num: fav, den: n };
      },
      () => {
        const sides = rng.choice([6, 8, 10]);
        const fav   = rng.randInt(1, Math.floor(sides / 2));
        return { text: `A fair die with ${sides} faces (numbered 1 to ${sides}) is rolled. How many ways can you get a number ≤ ${fav}?`, correct: fav, note: `${fav}/${sides}`, num: fav, den: sides };
      },
    ];
    const { text, correct, num, den } = rng.choice(scenarios)();
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      text,
      num, // answer = numerator (assuming denominator is specified in question)
      [
        { value: den - num,       misc: "ch14_s1_c1_t1_misc_1" }, // complementary
        { value: den,             misc: "ch14_s1_c1_t1_misc_2" }, // returned total
        { value: num + 1,         misc: "ch14_s1_c1_t1_misc_3" }, // off-by-one
      ],
      { num, den }
    );
  },
};

// ── Registry ──────────────────────────────────────────────────────────────────
// topicId → array of templates (may have multiple difficulties per topic)

const TEMPLATE_REGISTRY = {
  "ch1_s2_c1_t2": [T_CH1_HCF, T_CH1_LCM],
  "ch2_s3_c1_t1": [T_CH2_QUAD_ZEROS],
  "ch4_s3_c1_t1": [T_CH4_DISCRIMINANT],
  "ch5_s1_c2_t1": [T_CH5_NTH_TERM],
  "ch5_s2_c1_t1": [T_CH5_SUM],
  "ch7_s1_c1_t1": [T_CH7_DISTANCE],
  "ch7_s2_c1_t1": [T_CH7_SECTION],
  "ch13_s1_c1_t1": [T_CH13_MEAN],
  "ch14_s1_c1_t1": [T_CH14_PROBABILITY],
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Get a dynamic question variant for a specific user.
 * Returns null if no template exists for this topic+difficulty.
 *
 * Deterministic: same userId + topicId + difficulty + attemptN → same question.
 * Different users → different questions.
 */
export function getDynamicQuestion(topicId, difficulty, userId, attemptN = 0) {
  const templates = TEMPLATE_REGISTRY[topicId];
  if (!templates) return null;

  const candidates = templates.filter((t) => t.difficulty === difficulty);
  if (!candidates.length) return null;

  // Pick which template deterministically (in case there are multiple per topic+difficulty)
  const pickSeed = seedFromStr(`${userId}::pick::${topicId}::${difficulty}::${attemptN}`);
  const template  = candidates[pickSeed % candidates.length];

  const seed = seedFromStr(`${userId}::${template.templateId}::${attemptN}`);
  return template.render(seed);
}

/**
 * Get a dynamic question using a school-scoped seed.
 * Used by school variant service so students in the same school never get the same variant.
 *
 * seed key: `${schoolId}::${assessmentId}::${slotId}::${variantIndex}`
 */
export function getDynamicQuestionForSchoolVariant(topicId, difficulty, schoolId, assessmentId, slotId, variantIndex) {
  const templates = TEMPLATE_REGISTRY[topicId];
  if (!templates) return null;

  const candidates = templates.filter((t) => t.difficulty === difficulty);
  if (!candidates.length) return null;

  const pickSeed = seedFromStr(`${schoolId}::pick::${assessmentId}::${slotId}::${variantIndex}`);
  const template  = candidates[pickSeed % candidates.length];

  const seed = seedFromStr(`${schoolId}::${assessmentId}::${slotId}::${variantIndex}::${template.templateId}`);
  return template.render(seed);
}

/** Returns true if a dynamic template exists for this topic+difficulty. */
export function hasDynamicTemplate(topicId, difficulty) {
  return !!(TEMPLATE_REGISTRY[topicId]?.some((t) => t.difficulty === difficulty));
}

/** List all topic IDs that have at least one dynamic template. */
export function listDynamicTopics() {
  return Object.entries(TEMPLATE_REGISTRY).map(([topicId, tpls]) => ({
    topicId,
    difficulties: [...new Set(tpls.map((t) => t.difficulty))],
    templateCount: tpls.length,
  }));
}
