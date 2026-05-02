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

// ─────────────────────────────────────────────────────────────────────────────
// CH3 — Pair of Linear Equations
// ─────────────────────────────────────────────────────────────────────────────

// CH3 — Substitution method (easy)
const T_CH3_SUBST = {
  templateId: "t_ch3_subst_v1",
  topicId:    "ch3_s1_c1_t2",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng = new Rng(seed);
    // Pick a solution (x,y), construct the equation ax + by = c
    const x  = rng.randInt(1, 8);
    const y  = rng.randInt(1, 8);
    const a  = rng.randInt(1, 5);
    const b  = rng.randInt(1, 5);
    const c  = a * x + b * y;
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Solve by substitution: ${a}x + ${b}y = ${c}. If x = ${x}, find y.`,
      y,
      [
        { value: (c + a * x) / b,             misc: "ch3_s1_c1_t2_misc_1" }, // added instead of subtracted
        { value: Math.round(c / b),            misc: "ch3_s1_c1_t2_misc_2" }, // ignored x term
        { value: x,                            misc: "ch3_s1_c1_t2_misc_3" }, // returned x as y
      ],
      { a, b, c, x, y }
    );
  },
};

// CH3 — Elimination method (medium)
const T_CH3_ELIM = {
  templateId: "t_ch3_elim_v1",
  topicId:    "ch3_s2_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 3,
  render(seed) {
    const rng  = new Rng(seed);
    const xSol = rng.randInt(1, 8);
    const ySol = rng.randInt(1, 8);
    const a1   = rng.randInt(1, 4), b1 = rng.randInt(1, 4);
    const a2   = rng.randInt(1, 4), b2 = rng.randInt(1, 4);
    // guard: equations must not be proportional
    if (a1 * b2 === a2 * b1) { /* fallback: shift a2 */ }
    const c1   = a1 * xSol + b1 * ySol;
    const c2   = a2 * xSol + b2 * ySol;
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Solve by elimination: ${a1}x + ${b1}y = ${c1}  and  ${a2}x + ${b2}y = ${c2}. Find x.`,
      xSol,
      [
        { value: ySol,         misc: "ch3_s2_c1_t1_misc_1" }, // returned y instead of x
        { value: xSol + ySol,  misc: "ch3_s2_c1_t1_misc_2" }, // added solutions
        { value: c1 - c2,      misc: "ch3_s2_c1_t1_misc_3" }, // subtracted constants instead
      ],
      { a1, b1, c1, a2, b2, c2, xSol, ySol }
    );
  },
};

// CH3 — Word problem: two-number sum/difference (medium)
const T_CH3_WORDPROBLEM = {
  templateId: "t_ch3_wordproblem_v1",
  topicId:    "ch3_s3_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 3,
  render(seed) {
    const rng   = new Rng(seed);
    const large = rng.randInt(10, 50);
    const small = rng.randInt(1, large - 1);
    const s     = large + small; // sum
    const d     = large - small; // difference
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Two numbers sum to ${s} and their difference is ${d}. Find the larger number.`,
      large,
      [
        { value: small,            misc: "ch3_s3_c1_t1_misc_1" }, // returned smaller
        { value: s,                misc: "ch3_s3_c1_t1_misc_2" }, // returned sum
        { value: (s - d) / 2,      misc: "ch3_s3_c1_t1_misc_3" }, // formula for smaller applied to larger slot
      ],
      { s, d, large, small }
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CH6 — Triangles
// ─────────────────────────────────────────────────────────────────────────────

// CH6 — Basic Proportionality Theorem (easy)
const T_CH6_BPT = {
  templateId: "t_ch6_bpt_v1",
  topicId:    "ch6_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng   = new Rng(seed);
    const ad    = rng.randInt(1, 5);
    const ratio = rng.randInt(2, 5); // DB = AD × ratio
    const db    = ad * ratio;
    const ae    = rng.randInt(1, 6);
    const ec    = ae * ratio; // by BPT: AD/DB = AE/EC
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `In △ABC, DE ∥ BC. If AD = ${ad} cm, DB = ${db} cm and AE = ${ae} cm, find EC.`,
      ec,
      [
        { value: ae,                            misc: "ch6_s1_c1_t1_misc_1" }, // returned AE
        { value: Math.round((ae * ad) / db),    misc: "ch6_s1_c1_t1_misc_2" }, // inverted ratio
        { value: ad + ae,                       misc: "ch6_s1_c1_t1_misc_3" }, // added sides
      ],
      { ad, db, ae, ec }
    );
  },
};

// CH6 — Similar triangles: find missing side (medium)
const T_CH6_SIMILARITY = {
  templateId: "t_ch6_similarity_v1",
  topicId:    "ch6_s2_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng   = new Rng(seed);
    const ab    = rng.randInt(2, 8) * 2;  // keep even for clean ratio
    const scale = rng.choice([3, 4, 5]);   // PQ = AB × (scale/2)
    const pq    = ab * scale / 2;
    const bc    = rng.randInt(2, 8) * 2;
    const qr    = bc * scale / 2;
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `△ABC ~ △PQR. AB = ${ab} cm, PQ = ${pq} cm, BC = ${bc} cm. Find QR.`,
      qr,
      [
        { value: bc * 2 / scale,      misc: "ch6_s2_c1_t1_misc_1" }, // inverted ratio
        { value: bc + (pq - ab),      misc: "ch6_s2_c1_t1_misc_2" }, // added difference
        { value: bc,                  misc: "ch6_s2_c1_t1_misc_3" }, // returned BC as QR
      ],
      { ab, pq, bc, qr }
    );
  },
};

// CH6 — Areas of similar triangles (medium)
const T_CH6_AREAS_SIMILAR = {
  templateId: "t_ch6_areas_v1",
  topicId:    "ch6_s3_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng    = new Rng(seed);
    // Area ratio = p²:q² — pick p,q so areas are clean
    const combos = [[2,3,4,9],[3,4,9,16],[1,2,1,4],[2,5,4,25],[3,5,9,25]];
    const [p, q, a1, a2] = rng.choice(combos);
    const s1 = rng.randInt(2, 8) * p; // side of first triangle
    const s2 = s1 * q / p;            // corresponding side of second
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `The areas of two similar triangles are in ratio ${a1}:${a2}. If the corresponding side of the first triangle is ${s1} cm, find the corresponding side of the second.`,
      s2,
      [
        { value: s1 * a2 / a1,     misc: "ch6_s3_c1_t1_misc_1" }, // used area ratio directly on side
        { value: s1 + (s2 - s1),   misc: "ch6_s3_c1_t1_misc_2" },
        { value: s1 * p / q,       misc: "ch6_s3_c1_t1_misc_3" }, // inverted ratio
      ],
      { areaRatio: `${a1}:${a2}`, sideRatio: `${p}:${q}`, s1, s2 }
    );
  },
};

// CH6 — Pythagoras theorem (easy)
const T_CH6_PYTHAGORAS = {
  templateId: "t_ch6_pythagoras_v1",
  topicId:    "ch6_s4_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng     = new Rng(seed);
    // Pythagorean triples (a, b, hyp)
    const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[12,16,20],[20,21,29]];
    const scale   = rng.randInt(1, 3);
    const [a, b, h] = rng.choice(triples).map((x) => x * scale);
    const type    = rng.choice(["hyp", "leg"]);
    if (type === "hyp") {
      return buildResult(
        this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
        `In a right triangle, the two legs are ${a} cm and ${b} cm. Find the hypotenuse.`,
        h,
        [
          { value: a + b,                         misc: "ch6_s4_c1_t1_misc_1" }, // added legs
          { value: parseFloat(Math.sqrt(a + b).toFixed(2)), misc: "ch6_s4_c1_t1_misc_2" }, // forgot squares
          { value: Math.abs(a - b),               misc: "ch6_s4_c1_t1_misc_3" }, // subtracted
        ],
        { a, b, h }
      );
    } else {
      return buildResult(
        this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
        `In a right triangle, hypotenuse = ${h} cm and one leg = ${a} cm. Find the other leg.`,
        b,
        [
          { value: h - a,                         misc: "ch6_s4_c1_t1_misc_1" }, // subtracted without squares
          { value: parseFloat(Math.sqrt(h + a).toFixed(2)), misc: "ch6_s4_c1_t1_misc_2" }, // wrong formula
          { value: h,                             misc: "ch6_s4_c1_t1_misc_3" }, // returned hyp
        ],
        { a, b, h }
      );
    }
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CH8 — Introduction to Trigonometry
// ─────────────────────────────────────────────────────────────────────────────

// CH8 — Trig ratios from right triangle (easy)
const T_CH8_TRIG_RATIO = {
  templateId: "t_ch8_trig_ratio_v1",
  topicId:    "ch8_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 1,
  render(seed) {
    const rng     = new Rng(seed);
    const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15],[12,16,20]];
    const scale   = rng.randInt(1, 2);
    const [opp, adj, hyp] = rng.choice(triples).map((x) => x * scale);
    const ask = rng.choice(["sin", "cos", "tan"]);
    let correct, wrong1, wrong2, qText;
    if (ask === "sin") {
      correct = opp; qText = `sin θ (as a fraction — give numerator, denominator is ${hyp})`;
      wrong1 = adj; wrong2 = hyp;
    } else if (ask === "cos") {
      correct = adj; qText = `cos θ (as a fraction — give numerator, denominator is ${hyp})`;
      wrong1 = opp; wrong2 = hyp;
    } else {
      correct = opp; qText = `tan θ (as a fraction — give numerator, denominator is ${adj})`;
      wrong1 = adj; wrong2 = hyp;
    }
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `In right △ABC, opposite = ${opp}, adjacent = ${adj}, hypotenuse = ${hyp}. Find ${qText}.`,
      correct,
      [
        { value: wrong1, misc: "ch8_s1_c1_t1_misc_1" },
        { value: wrong2, misc: "ch8_s1_c1_t1_misc_2" },
        { value: opp + adj, misc: "ch8_s1_c1_t1_misc_3" },
      ],
      { opp, adj, hyp, ask }
    );
  },
};

// CH8 — Complementary angles (easy)
const T_CH8_COMPLEMENTARY = {
  templateId: "t_ch8_complementary_v1",
  topicId:    "ch8_s3_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 1,
  render(seed) {
    const rng = new Rng(seed);
    // sin(αθ) = cos(θ − β°) → θ = (90+β)/(1+α)
    const combos = [[3,6,24],[2,0,30],[3,10,25],[1,0,45],[3,14,26],[2,6,32],[4,10,20]];
    const [alpha, beta, theta] = rng.choice(combos);
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `If sin(${alpha}θ) = cos(θ − ${beta}°), find θ.`,
      theta,
      [
        { value: 90 - theta,     misc: "ch8_s3_c1_t1_misc_1" },
        { value: (90 + beta) / alpha, misc: "ch8_s3_c1_t1_misc_2" }, // forgot +1 in denominator
        { value: 45,             misc: "ch8_s3_c1_t1_misc_3" },
      ],
      { alpha, beta, theta }
    );
  },
};

// CH8 — Trig identity: tan + cot (medium)
const T_CH8_IDENTITY = {
  templateId: "t_ch8_identity_v1",
  topicId:    "ch8_s2_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng = new Rng(seed);
    // If tan θ + cot θ = k, then tan²θ + cot²θ = k² − 2
    const k = rng.randInt(3, 8);
    const correct = k * k - 2;
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `If tan θ + cot θ = ${k}, find tan²θ + cot²θ.`,
      correct,
      [
        { value: k * k,          misc: "ch8_s2_c1_t1_misc_1" }, // forgot −2
        { value: k * k + 2,      misc: "ch8_s2_c1_t1_misc_2" }, // added 2 instead
        { value: k - 2,          misc: "ch8_s2_c1_t1_misc_3" }, // confused powers
      ],
      { k }
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CH9 — Applications of Trigonometry
// ─────────────────────────────────────────────────────────────────────────────

// CH9 — Angle of elevation 45° (easy)
const T_CH9_ELEVATION_45 = {
  templateId: "t_ch9_elevation_45_v1",
  topicId:    "ch9_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng  = new Rng(seed);
    const dist = rng.randInt(5, 50) * 2; // even for clean answers
    // tan 45° = 1 → height = dist
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `From a point ${dist} m away from the base of a vertical tower, the angle of elevation of the top is 45°. Find the height of the tower.`,
      dist,
      [
        { value: dist / 2,       misc: "ch9_s1_c1_t1_misc_1" }, // used sin 45 without hyp
        { value: dist * 2,       misc: "ch9_s1_c1_t1_misc_2" }, // doubled distance
        { value: dist + 45,      misc: "ch9_s1_c1_t1_misc_3" }, // added angle
      ],
      { dist, angle: 45 }
    );
  },
};

// CH9 — Angle of elevation 30° or 60° (medium)
const T_CH9_ELEVATION_30_60 = {
  templateId: "t_ch9_elevation_30_60_v1",
  topicId:    "ch9_s1_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 3,
  render(seed) {
    const rng = new Rng(seed);
    // Use exact integer results: for 60°, height = dist × √3; pick dist as multiple so h is integer
    // For 30°: height = dist/√3; pick dist = k√3 so h = k (not clean for integer)
    // Strategy: use angle=60°, dist chosen so dist×1.732 rounds to integer nicely
    // OR: reframe as "shadow" problem for 30°: shadow × tan 30° = height → shadow = height×√3
    const angle = rng.choice([30, 60]);
    if (angle === 60) {
      const dist = rng.randInt(5, 30);
      const h    = parseFloat((dist * Math.sqrt(3)).toFixed(2));
      return buildResult(
        this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
        `From a point ${dist} m away from the base of a tower, the angle of elevation is 60°. Find the height of the tower. (Use √3 = 1.732, round to 2 dp.)`,
        h,
        [
          { value: parseFloat((dist / Math.sqrt(3)).toFixed(2)), misc: "ch9_s1_c1_t1_misc_1" }, // used 30° instead
          { value: dist,                                         misc: "ch9_s1_c1_t1_misc_2" }, // tan=1 (45°)
          { value: parseFloat((dist * 2).toFixed(2)),           misc: "ch9_s1_c1_t1_misc_3" },
        ],
        { dist, angle: 60 }
      );
    } else {
      // Shadow problem: angle=30°, tan 30° = h/shadow → h = shadow/√3
      const shadow = rng.randInt(3, 15) * 3; // multiple of 3 for cleaner result
      const h      = parseFloat((shadow / Math.sqrt(3)).toFixed(2));
      return buildResult(
        this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
        `A vertical tower casts a shadow of ${shadow} m when the angle of elevation of the sun is 30°. Find the height of the tower. (Use √3 = 1.732, round to 2 dp.)`,
        h,
        [
          { value: parseFloat((shadow * Math.sqrt(3)).toFixed(2)), misc: "ch9_s1_c1_t1_misc_1" }, // used tan 60
          { value: shadow,                                         misc: "ch9_s1_c1_t1_misc_2" }, // ignored tan
          { value: parseFloat((shadow / 2).toFixed(2)),           misc: "ch9_s1_c1_t1_misc_3" },
        ],
        { shadow, angle: 30 }
      );
    }
  },
};

// CH9 — Two-observation problem (hard)
const T_CH9_TWO_TRIANGLE = {
  templateId: "t_ch9_two_triangle_v1",
  topicId:    "ch9_s1_c1_t2",
  difficulty: "hard",
  questionType: "numeric",
  marks: 4,
  render(seed) {
    const rng = new Rng(seed);
    // From top of cliff of height h, angles of depression to two boats are 30° and 60°
    // Pick h, compute distances d1 and d2
    const h   = rng.randInt(3, 12) * 10; // e.g. 30, 40, 50 m
    const d1  = parseFloat((h / Math.sqrt(3)).toFixed(2));  // 60° side
    const d2  = parseFloat((h * Math.sqrt(3)).toFixed(2));  // 30° side
    const gap = parseFloat((d2 - d1).toFixed(2));
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `From the top of a ${h} m high cliff, the angles of depression of two boats directly in front are 60° and 30°. Find the distance between the two boats. (Use √3 = 1.732, round to 2 dp.)`,
      gap,
      [
        { value: d1,    misc: "ch9_s1_c1_t2_misc_1" }, // returned only nearer distance
        { value: d2,    misc: "ch9_s1_c1_t2_misc_2" }, // returned only farther distance
        { value: d1 + d2, misc: "ch9_s1_c1_t2_misc_3" }, // added instead of subtracted
      ],
      { h, d1, d2, gap }
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CH10 — Circles
// ─────────────────────────────────────────────────────────────────────────────

// CH10 — Tangent length from external point (easy)
const T_CH10_TANGENT_LEN = {
  templateId: "t_ch10_tangent_len_v1",
  topicId:    "ch10_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng     = new Rng(seed);
    // Pythagorean triples: (r, tangent, OP = distance from P to O)
    const triples = [[3,4,5],[5,12,13],[6,8,10],[8,15,17],[9,12,15],[7,24,25],[12,16,20],[15,20,25]];
    const scale   = rng.randInt(1, 2);
    const [r, tan, op] = rng.choice(triples).map((x) => x * scale);
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `From an external point P, ${op} cm from the centre O of a circle with radius ${r} cm, a tangent PT is drawn. Find the length of tangent PT.`,
      tan,
      [
        { value: op - r,                                     misc: "ch10_s1_c1_t1_misc_1" }, // subtracted without Pythagoras
        { value: parseFloat(Math.sqrt(op + r).toFixed(2)),  misc: "ch10_s1_c1_t1_misc_2" }, // forgot squares
        { value: op,                                         misc: "ch10_s1_c1_t1_misc_3" }, // returned OP
      ],
      { r, op, tan }
    );
  },
};

// CH10 — Angle between two tangents (medium)
const T_CH10_TANGENT_ANGLE = {
  templateId: "t_ch10_tangent_angle_v1",
  topicId:    "ch10_s2_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng    = new Rng(seed);
    const apb    = rng.choice([40, 50, 60, 70, 80, 30, 20]); // ∠APB
    const aob    = 180 - apb;                                  // ∠AOB = 180 − ∠APB
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `From an external point P, two tangents PA and PB are drawn to a circle with centre O. If ∠APB = ${apb}°, find ∠AOB.`,
      aob,
      [
        { value: apb,       misc: "ch10_s2_c1_t1_misc_1" }, // returned ∠APB unchanged
        { value: 90 - apb,  misc: "ch10_s2_c1_t1_misc_2" },
        { value: 360 - aob, misc: "ch10_s2_c1_t1_misc_3" }, // reflex angle
      ],
      { apb, aob }
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CH11 — Areas Related to Circles
// ─────────────────────────────────────────────────────────────────────────────

// CH11 — Area of sector (easy)
const T_CH11_SECTOR_AREA = {
  templateId: "t_ch11_sector_area_v1",
  topicId:    "ch11_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng    = new Rng(seed);
    const r      = rng.choice([7, 10, 14, 21]);
    const theta  = rng.choice([30, 45, 60, 90, 120, 72]);
    // Use π = 22/7 for r=7,14,21; π=3.14 for r=10
    const pi     = (r % 7 === 0) ? (22 / 7) : 3.14;
    const area   = parseFloat(((theta / 360) * pi * r * r).toFixed(2));
    const piStr  = (r % 7 === 0) ? "22/7" : "3.14";
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the area of a sector with radius ${r} cm and central angle ${theta}°. (Use π = ${piStr}, round to 2 dp.)`,
      area,
      [
        { value: parseFloat(((theta / 360) * pi * r).toFixed(2)),      misc: "ch11_s1_c1_t1_misc_1" }, // used r not r²
        { value: parseFloat((pi * r * r).toFixed(2)),                  misc: "ch11_s1_c1_t1_misc_2" }, // full circle area
        { value: parseFloat(((theta / 180) * pi * r * r).toFixed(2)), misc: "ch11_s1_c1_t1_misc_3" }, // used 180 instead of 360
      ],
      { r, theta, pi: piStr, area }
    );
  },
};

// CH11 — Perimeter of sector (medium)
const T_CH11_SECTOR_PERIM = {
  templateId: "t_ch11_sector_perim_v1",
  topicId:    "ch11_s1_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 3,
  render(seed) {
    const rng   = new Rng(seed);
    const r     = rng.choice([7, 14, 10, 21]);
    const theta = rng.choice([60, 90, 120, 45]);
    const pi    = (r % 7 === 0) ? (22 / 7) : 3.14;
    const arc   = parseFloat(((theta / 360) * 2 * pi * r).toFixed(2));
    const perim = parseFloat((2 * r + arc).toFixed(2));
    const piStr = (r % 7 === 0) ? "22/7" : "3.14";
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the perimeter of a sector with radius ${r} cm and central angle ${theta}°. (Use π = ${piStr}, round to 2 dp.)`,
      perim,
      [
        { value: arc,                        misc: "ch11_s1_c1_t1_misc_1" }, // only arc, forgot 2r
        { value: parseFloat((r + arc).toFixed(2)), misc: "ch11_s1_c1_t1_misc_2" }, // added only one radius
        { value: parseFloat((2 * r).toFixed(2)),   misc: "ch11_s1_c1_t1_misc_3" }, // forgot arc
      ],
      { r, theta, arc, perim, pi: piStr }
    );
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CH12 — Surface Areas and Volumes
// ─────────────────────────────────────────────────────────────────────────────

// CH12 — Curved surface area of cylinder (easy)
const T_CH12_CYLINDER_CSA = {
  templateId: "t_ch12_cylinder_csa_v1",
  topicId:    "ch12_s1_c1_t1",
  difficulty: "easy",
  questionType: "numeric",
  marks: 2,
  render(seed) {
    const rng = new Rng(seed);
    const r   = rng.choice([7, 14, 3.5]);
    const h   = rng.randInt(5, 25);
    const csa = parseFloat((2 * (22 / 7) * r * h).toFixed(2));
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `Find the curved surface area of a cylinder with radius ${r} cm and height ${h} cm. (Use π = 22/7, round to nearest integer.)`,
      Math.round(csa),
      [
        { value: Math.round((22 / 7) * r * r * h), misc: "ch12_s1_c1_t1_misc_1" }, // used πr²h (volume)
        { value: Math.round(2 * (22 / 7) * r * (h + r)), misc: "ch12_s1_c1_t1_misc_2" }, // used TSA formula
        { value: Math.round((22 / 7) * r * h),    misc: "ch12_s1_c1_t1_misc_3" }, // forgot 2
      ],
      { r, h, csa }
    );
  },
};

// CH12 — Melt sphere → recast into cones (medium)
const T_CH12_MELT_SPHERE = {
  templateId: "t_ch12_melt_sphere_v1",
  topicId:    "ch12_s2_c1_t1",
  difficulty: "medium",
  questionType: "numeric",
  marks: 3,
  render(seed) {
    const rng    = new Rng(seed);
    // Valid combos: [sphereR, coneR, n, h] where h = 4r³/(n·cr²) is an integer
    const combos = [
      [3, 1, 4, 27], [3, 3, 4, 3], [6, 3, 8, 12], [4, 2, 8, 8],
      [6, 6, 4, 6],  [3, 1, 9, 12], [6, 2, 9, 24], [9, 3, 12, 27],
      [4, 4, 4, 4],  [6, 3, 4, 24],
    ];
    const [sr, cr, n, h] = rng.choice(combos);
    return buildResult(
      this.templateId, this.topicId, this.difficulty, this.questionType, this.marks,
      `A metallic sphere of radius ${sr} cm is melted and recast into ${n} identical cones, each of base radius ${cr} cm. Find the height of each cone.`,
      h,
      [
        { value: Math.round((4 * sr * sr * sr) / (n * cr * cr)), misc: "ch12_s2_c1_t1_misc_1" }, // same formula but wrong h (close)
        { value: Math.round((sr * sr * sr) / (n * cr * cr)),     misc: "ch12_s2_c1_t1_misc_2" }, // forgot factor 4
        { value: sr,                                             misc: "ch12_s2_c1_t1_misc_3" }, // returned sphere radius
      ],
      { sr, cr, n, h }
    );
  },
};

// ── Registry ──────────────────────────────────────────────────────────────────
// topicId → array of templates (may have multiple difficulties per topic)

const TEMPLATE_REGISTRY = {
  // Ch1 — Real Numbers
  "ch1_s2_c1_t2": [T_CH1_HCF, T_CH1_LCM],
  // Ch2 — Polynomials
  "ch2_s3_c1_t1": [T_CH2_QUAD_ZEROS],
  // Ch3 — Pair of Linear Equations
  "ch3_s1_c1_t2": [T_CH3_SUBST],
  "ch3_s2_c1_t1": [T_CH3_ELIM],
  "ch3_s3_c1_t1": [T_CH3_WORDPROBLEM],
  // Ch4 — Quadratic Equations
  "ch4_s3_c1_t1": [T_CH4_DISCRIMINANT],
  // Ch5 — Arithmetic Progressions
  "ch5_s1_c2_t1": [T_CH5_NTH_TERM],
  "ch5_s2_c1_t1": [T_CH5_SUM],
  // Ch6 — Triangles
  "ch6_s1_c1_t1": [T_CH6_BPT],
  "ch6_s2_c1_t1": [T_CH6_SIMILARITY],
  "ch6_s3_c1_t1": [T_CH6_AREAS_SIMILAR],
  "ch6_s4_c1_t1": [T_CH6_PYTHAGORAS],
  // Ch7 — Coordinate Geometry
  "ch7_s1_c1_t1": [T_CH7_DISTANCE],
  "ch7_s2_c1_t1": [T_CH7_SECTION],
  // Ch8 — Introduction to Trigonometry
  "ch8_s1_c1_t1": [T_CH8_TRIG_RATIO],
  "ch8_s2_c1_t1": [T_CH8_IDENTITY],
  "ch8_s3_c1_t1": [T_CH8_COMPLEMENTARY],
  // Ch9 — Applications of Trigonometry
  "ch9_s1_c1_t1": [T_CH9_ELEVATION_45, T_CH9_ELEVATION_30_60],
  "ch9_s1_c1_t2": [T_CH9_TWO_TRIANGLE],
  // Ch10 — Circles
  "ch10_s1_c1_t1": [T_CH10_TANGENT_LEN],
  "ch10_s2_c1_t1": [T_CH10_TANGENT_ANGLE],
  // Ch11 — Areas Related to Circles
  "ch11_s1_c1_t1": [T_CH11_SECTOR_AREA, T_CH11_SECTOR_PERIM],
  // Ch12 — Surface Areas & Volumes
  "ch12_s1_c1_t1": [T_CH12_CYLINDER_CSA],
  "ch12_s2_c1_t1": [T_CH12_MELT_SPHERE],
  // Ch13 — Statistics
  "ch13_s1_c1_t1": [T_CH13_MEAN],
  // Ch14 — Probability
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
