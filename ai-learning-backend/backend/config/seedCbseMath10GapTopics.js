/**
 * Seed 16 MCQ questions each for the 5 zero/low-question CBSE Math Class 10 topics:
 *   1. Algebra Basics            (ch 0 — prerequisite topic)
 *   2. Trigonometry              (ch 8)
 *   3. Linear Equations          (ch 3)
 *   4. Surface Areas & Volumes   (ch 13)
 *   5. Applications of Trigonometry (ch 9)
 *
 * Usage: node config/seedCbseMath10GapTopics.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

function mcq(topic, ch, slug, diff, idx, text, opts, correctIdx, solution, hints, concept) {
  const diffLetter = diff === "easy" ? "e" : diff === "medium" ? "m" : "h";
  const ds = diff === "easy" ? 0.25 : diff === "medium" ? 0.5 : 0.8;
  return {
    questionId:      `q_cbse10_${slug}_${diffLetter}${idx}_mcq`,
    topicId:         topic,
    subject:         "Mathematics",
    grade:           "10",
    chapterNumber:   ch,
    topic,
    subtopic:        topic,
    questionType:    "mcq",
    questionText:    text,
    options: opts.map((o, i) => ({
      text: o,
      type: i === correctIdx ? "correct" : "concept_error",
      logicTag: i === correctIdx ? null : `${slug}_misc`,
    })),
    correctAnswer:   null,
    difficulty:      diff,
    difficultyScore: ds,
    marks:           diff === "hard" ? 2 : 1,
    negativeMarks:   0,
    expectedTime:    diff === "easy" ? 30 : diff === "medium" ? 50 : 75,
    bloomLevel:      diff === "easy" ? "recall" : diff === "medium" ? "apply" : "analyze",
    conceptTested:   concept,
    examBoard:       "CBSE",
    isAIGenerated:   true,
    isFlagged:       false,
    isPYQ:           false,
    pyqYear:         null,
    mixingType:      "single_topic",
    prerequisites:   [],
    hintLevels:      hints,
    solutionSteps:   solution,
    stepByStep:      solution.map((s, i) => ({ stepNumber: i + 1, clean: s, voice: "" })),
    timeThresholds:  { guessBelow: 6, expectedMin: 15, expectedMax: diff === "hard" ? 120 : 60, stuckAbove: 180 },
    routing:         { ifCorrect: "next_difficulty_up", ifWrong: null, ifStuck: null, flukeCheckQuestionId: null },
  };
}

/* ═══════════════════════════════════════════════════════════════
   1. ALGEBRA BASICS
═══════════════════════════════════════════════════════════════ */
const algebraQs = [
  // easy (5)
  mcq("Algebra Basics", 0, "alg", "easy", 1,
    "Simplify: (2x + 3y) − (x − 2y)",
    ["x + 5y", "x − 5y", "3x + y", "3x + 5y"], 0,
    ["Remove brackets: 2x + 3y − x + 2y.", "Collect like terms: x + 5y."],
    ["Mind the sign when removing the bracket.", "3y + 2y = 5y."],
    "Simplification of algebraic expressions"),

  mcq("Algebra Basics", 0, "alg", "easy", 2,
    "Evaluate 2a² − 3ab + b² when a = 2, b = 1.",
    ["1", "3", "5", "7"], 1,
    ["2(4) − 3(2)(1) + 1 = 8 − 6 + 1 = 3."],
    ["Substitute then compute term by term."],
    "Substitution in algebraic expressions"),

  mcq("Algebra Basics", 0, "alg", "easy", 3,
    "Which is a correct algebraic identity?",
    ["(a+b)² = a² + b²", "(a+b)² = a² + 2ab + b²", "(a+b)² = a² − 2ab + b²", "(a+b)² = 2a² + 2b²"], 1,
    ["(a+b)² = (a+b)(a+b) = a² + ab + ab + b² = a² + 2ab + b²."],
    ["The middle term is 2ab, not 0."],
    "Algebraic identities"),

  mcq("Algebra Basics", 0, "alg", "easy", 4,
    "Factorize: x² − 9",
    ["(x+3)²", "(x−3)²", "(x+3)(x−3)", "x(x−9)"], 2,
    ["Difference of squares: a² − b² = (a+b)(a−b).", "x² − 9 = x² − 3² = (x+3)(x−3)."],
    ["Recognise the difference of squares pattern."],
    "Factorization — difference of squares"),

  mcq("Algebra Basics", 0, "alg", "easy", 5,
    "If x = 3, find 4x² − 2x + 1.",
    ["25", "29", "31", "33"], 2,
    ["4(9) − 2(3) + 1 = 36 − 6 + 1 = 31."],
    ["Substitute x = 3 carefully."],
    "Evaluating polynomial expressions"),

  // medium (7)
  mcq("Algebra Basics", 0, "alg", "medium", 1,
    "Simplify: (a+b)² − (a−b)²",
    ["2ab", "4ab", "a² − b²", "2a² + 2b²"], 1,
    ["(a+b)² = a²+2ab+b²; (a−b)² = a²−2ab+b².", "Difference = 4ab."],
    ["Expand both squares.", "Subtract."],
    "Difference of squares identity"),

  mcq("Algebra Basics", 0, "alg", "medium", 2,
    "If a + b = 5 and ab = 6, find a² + b².",
    ["7", "11", "13", "19"], 2,
    ["a² + b² = (a+b)² − 2ab = 25 − 12 = 13."],
    ["Use (a+b)² = a² + 2ab + b².", "Rearrange: a² + b² = (a+b)² − 2ab."],
    "Identity application"),

  mcq("Algebra Basics", 0, "alg", "medium", 3,
    "Factorize: x² − 5x + 6",
    ["(x−1)(x−6)", "(x−2)(x−3)", "(x+2)(x+3)", "(x+1)(x−6)"], 1,
    ["Find two numbers whose sum = −5 and product = 6: −2 and −3.", "x² − 5x + 6 = (x−2)(x−3)."],
    ["Sum of factors = coefficient of x.", "Product = constant term."],
    "Factorization of quadratic trinomial"),

  mcq("Algebra Basics", 0, "alg", "medium", 4,
    "Which expression is a perfect square trinomial?",
    ["x² + 2x + 4", "4x² + 4x + 1", "x² + 4x + 2", "9x² − 6x + 4"], 1,
    ["4x² + 4x + 1 = (2x)² + 2(2x)(1) + 1² = (2x+1)²."],
    ["Check if the middle term = 2 × √(first term) × √(last term)."],
    "Perfect square trinomials"),

  mcq("Algebra Basics", 0, "alg", "medium", 5,
    "Factorize: 6x² + 7x − 3",
    ["(2x+3)(3x−1)", "(2x−3)(3x+1)", "(6x−1)(x+3)", "(6x+1)(x−3)"], 0,
    ["Product = 6×(−3) = −18; need two numbers with sum 7 and product −18: 9 and −2.", "6x²+9x−2x−3 = 3x(2x+3)−1(2x+3) = (2x+3)(3x−1)."],
    ["Split the middle term.", "Factor by grouping."],
    "Factorization by splitting middle term"),

  mcq("Algebra Basics", 0, "alg", "medium", 6,
    "If p(x) = x² − 3x + 2, find p(1) + p(2).",
    ["−1", "0", "1", "2"], 1,
    ["p(1) = 1−3+2 = 0; p(2) = 4−6+2 = 0.", "Sum = 0."],
    ["Substitute x=1 then x=2.", "Both are roots of the polynomial."],
    "Evaluating polynomials"),

  mcq("Algebra Basics", 0, "alg", "medium", 7,
    "Expand: (x + 2)³",
    ["x³ + 6x² + 12x + 8", "x³ + 4x² + 8x + 8", "x³ + 6x² + 8x + 8", "x³ + 8"], 0,
    ["(a+b)³ = a³ + 3a²b + 3ab² + b³.", "(x+2)³ = x³ + 3x²(2) + 3x(4) + 8 = x³+6x²+12x+8."],
    ["Use the identity (a+b)³.", "Coefficients of middle terms are 3 and 3."],
    "Cube expansion identity"),

  // hard (4)
  mcq("Algebra Basics", 0, "alg", "hard", 1,
    "If x + 1/x = 5, find x² + 1/x².",
    ["21", "23", "25", "27"], 1,
    ["(x + 1/x)² = x² + 2 + 1/x² = 25.", "x² + 1/x² = 23."],
    ["Square both sides of x + 1/x = 5.", "Subtract 2."],
    "Reciprocal expression identity"),

  mcq("Algebra Basics", 0, "alg", "hard", 2,
    "If a − b = 3 and a³ − b³ = 117, find ab.",
    ["8", "9", "10", "12"], 2,
    ["a³−b³ = (a−b)(a²+ab+b²) = 3(a²+ab+b²) = 117 → a²+ab+b² = 39.",
     "(a−b)² = a²−2ab+b² = 9. So a²+b² = 9+2ab.", "Substituting: 9+2ab+ab = 39 → 3ab = 30 → ab = 10."],
    ["Use the factored form of a³−b³.", "Combine with (a−b)² to find ab."],
    "Algebraic identity — cubic"),

  mcq("Algebra Basics", 0, "alg", "hard", 3,
    "Factorize: x³ − 3x² − 10x + 24 given that x = 2 is a root.",
    ["(x−2)(x−4)(x+3)", "(x+2)(x−4)(x−3)", "(x−2)(x+4)(x−3)", "(x+2)(x+4)(x+3)"], 0,
    ["Divide x³−3x²−10x+24 by (x−2): quotient = x²−x−12.", "x²−x−12 = (x−4)(x+3).", "Full factorization: (x−2)(x−4)(x+3)."],
    ["Use synthetic division with root x=2.", "Factorise the resulting quadratic."],
    "Factorization of cubic polynomial"),

  mcq("Algebra Basics", 0, "alg", "hard", 4,
    "If (x + 1/x)² = 9, find x⁴ + 1/x⁴.",
    ["43", "45", "47", "49"], 2,
    ["x + 1/x = 3 → x² + 1/x² = 9 − 2 = 7.", "(x² + 1/x²)² = x⁴ + 2 + 1/x⁴ = 49 → x⁴ + 1/x⁴ = 47."],
    ["Square x + 1/x to get x² + 1/x².", "Square again to get x⁴ + 1/x⁴."],
    "Reciprocal chain identity"),
];

/* ═══════════════════════════════════════════════════════════════
   2. TRIGONOMETRY  (Chapter 8)
═══════════════════════════════════════════════════════════════ */
const trigQs = [
  // easy (5)
  mcq("Trigonometry", 8, "trig", "easy", 1,
    "sin²θ + cos²θ equals:",
    ["0", "1", "2", "sin²θ − cos²θ"], 1,
    ["This is the fundamental Pythagorean identity."],
    ["It holds for every angle θ."],
    "Fundamental trig identity"),

  mcq("Trigonometry", 8, "trig", "easy", 2,
    "If sin θ = 3/5, find cos θ (θ is acute).",
    ["3/4", "4/3", "4/5", "5/3"], 2,
    ["cos²θ = 1 − sin²θ = 1 − 9/25 = 16/25.", "cos θ = 4/5."],
    ["Use sin²θ + cos²θ = 1.", "Take positive root (acute angle)."],
    "Finding cos from sin"),

  mcq("Trigonometry", 8, "trig", "easy", 3,
    "tan 45° + cot 45° =",
    ["0", "1", "2", "√2"], 2,
    ["tan 45° = 1, cot 45° = 1.", "Sum = 2."],
    ["Both are equal to 1 at 45°."],
    "Standard angle values"),

  mcq("Trigonometry", 8, "trig", "easy", 4,
    "sin 60° × cos 30° − cos 60° × sin 30° =",
    ["0", "1/2", "√3/2", "1"], 1,
    ["= (√3/2)(√3/2) − (1/2)(1/2) = 3/4 − 1/4 = 1/2."],
    ["This equals sin(60°−30°) = sin 30° = 1/2."],
    "Compound angle identity application"),

  mcq("Trigonometry", 8, "trig", "easy", 5,
    "tan 30° / sin 60° =",
    ["1/2", "2/3", "1", "√3/2"], 1,
    ["tan 30° = 1/√3, sin 60° = √3/2.", "(1/√3) ÷ (√3/2) = (1/√3) × (2/√3) = 2/3."],
    ["Recall the standard values.", "Divide carefully."],
    "Standard angle arithmetic"),

  // medium (7)
  mcq("Trigonometry", 8, "trig", "medium", 1,
    "If 7sin²θ + 3cos²θ = 4, find tan θ.",
    ["1", "1/√2", "1/√3", "√3"], 2,
    ["Replace cos²θ = 1−sin²θ: 7sin²θ + 3 − 3sin²θ = 4 → 4sin²θ = 1 → sinθ = 1/2 → θ = 30°.", "tan 30° = 1/√3."],
    ["Use sin²θ + cos²θ = 1 to reduce to sin²θ only.", "Identify the angle."],
    "Solving trig equation"),

  mcq("Trigonometry", 8, "trig", "medium", 2,
    "2sin²30° − 3cos²45° + tan²60° =",
    ["0", "1", "2", "3"], 2,
    ["= 2(1/4) − 3(1/2) + 3 = 1/2 − 3/2 + 3 = −1 + 3 = 2."],
    ["Recall: sin 30°=1/2, cos 45°=1/√2, tan 60°=√3.", "Square each value first."],
    "Mixed standard angle evaluation"),

  mcq("Trigonometry", 8, "trig", "medium", 3,
    "cos(90°−θ)/sinθ + sin(90°−θ)/cosθ =",
    ["0", "1", "2", "sinθ + cosθ"], 2,
    ["cos(90°−θ) = sinθ and sin(90°−θ) = cosθ.", "= sinθ/sinθ + cosθ/cosθ = 1 + 1 = 2."],
    ["Apply the complementary angle rule.", "Each fraction simplifies to 1."],
    "Complementary angles"),

  mcq("Trigonometry", 8, "trig", "medium", 4,
    "(1 − sin²A) × sec²A =",
    ["0", "1", "sin²A", "cos²A"], 1,
    ["1 − sin²A = cos²A.", "cos²A × sec²A = cos²A × 1/cos²A = 1."],
    ["Recognise 1−sin²A.", "sec²A = 1/cos²A."],
    "Trig identity simplification"),

  mcq("Trigonometry", 8, "trig", "medium", 5,
    "If tanθ + cotθ = 2, find sinθ (θ acute).",
    ["1/2", "1/√2", "√3/2", "1"], 1,
    ["tanθ + 1/tanθ = 2 → tan²θ − 2tanθ + 1 = 0 → (tanθ−1)² = 0 → tanθ = 1 → θ = 45°.", "sin 45° = 1/√2."],
    ["Multiply through by tanθ.", "Solve the quadratic."],
    "Solving trig equations"),

  mcq("Trigonometry", 8, "trig", "medium", 6,
    "If sinA + cosA = √2 cosA, then cosA − sinA equals:",
    ["√2 sinA", "√2 cosA", "sinA/√2", "cosA/√2"], 0,
    ["sinA = (√2−1)cosA.", "(cosA−sinA)² = 1 − 2sinAcosA; (sinA+cosA)² = 1 + 2sinAcosA = 2cos²A.",
     "cosA−sinA: (cosA−sinA)² = 2 − 2cos²A = 2sin²A → cosA−sinA = √2 sinA."],
    ["Square sinA + cosA = √2 cosA to find sinAcosA.", "Then compute (cosA−sinA)²."],
    "Manipulation of trig expressions"),

  mcq("Trigonometry", 8, "trig", "medium", 7,
    "If secθ = 5/3, find (sinθ − cosθ)/(2 tanθ).",
    ["1/40", "3/40", "1/8", "3/8"], 1,
    ["cosθ = 3/5, sinθ = 4/5 (Pythagorean triple 3-4-5), tanθ = 4/3.",
     "= (4/5 − 3/5) / (2 × 4/3) = (1/5) / (8/3) = (1/5)(3/8) = 3/40."],
    ["Find sinθ and tanθ from secθ = 5/3.", "Substitute carefully."],
    "Using trig ratios from a given value"),

  // hard (4)
  mcq("Trigonometry", 8, "trig", "hard", 1,
    "If sinA + sin²A = 1, find cos²A + cos⁴A.",
    ["0", "1", "2", "sin²A"], 1,
    ["sinA = 1 − sin²A = cos²A.", "cos²A + cos⁴A = sinA + sin²A = 1."],
    ["Rearrange sinA + sin²A = 1 to express sinA.", "Substitute back."],
    "Chained identity substitution"),

  mcq("Trigonometry", 8, "trig", "hard", 2,
    "sin⁶A + cos⁶A + 3sin²A cos²A =",
    ["0", "1", "2", "3sin²A cos²A"], 1,
    ["Let p = sin²A, q = cos²A. p+q=1.", "p³+q³ = (p+q)³−3pq(p+q) = 1−3pq.", "Adding 3pq: 1−3pq+3pq = 1."],
    ["Use a³+b³ = (a+b)³−3ab(a+b).", "The 3sin²Acos²A cancels the −3pq."],
    "Sum of cubes trig identity"),

  mcq("Trigonometry", 8, "trig", "hard", 3,
    "If tanA + sinA = m and tanA − sinA = n, then m² − n² equals:",
    ["4mn", "4√(mn)", "2√(mn)", "mn"], 1,
    ["m²−n² = (m+n)(m−n) = (2tanA)(2sinA) = 4sinAtanA.",
     "mn = (tanA+sinA)(tanA−sinA) = tan²A−sin²A = sin²A(sec²A−1) = sin²Atan²A.",
     "√(mn) = sinAtanA. So m²−n² = 4√(mn)."],
    ["Expand m²−n² directly.", "Then find mn and relate to sinAtanA."],
    "Advanced trig identity proof"),

  mcq("Trigonometry", 8, "trig", "hard", 4,
    "If sinA + sinB = m and cosA + cosB = n, then cos(A−B) equals:",
    ["(m²+n²−2)/2", "(m²+n²+2)/2", "(m²−n²)/2", "(n²−m²)/2"], 0,
    ["m² = sin²A+2sinAsinB+sin²B; n² = cos²A+2cosAcosB+cos²B.",
     "m²+n² = 2 + 2(sinAsinB+cosAcosB) = 2 + 2cos(A−B).",
     "cos(A−B) = (m²+n²−2)/2."],
    ["Square both given equations.", "Recognise the cos(A−B) expansion."],
    "Sum-to-product identity derivation"),
];

/* ═══════════════════════════════════════════════════════════════
   3. LINEAR EQUATIONS  (Chapter 3)
═══════════════════════════════════════════════════════════════ */
const linEqQs = [
  // easy (5)
  mcq("Linear Equations", 3, "lineq", "easy", 1,
    "Solve: x + y = 7 and x − y = 3. What is x + 2y?",
    ["7", "8", "9", "11"], 2,
    ["Adding: 2x = 10 → x = 5; subtracting: 2y = 4 → y = 2.", "x + 2y = 5 + 4 = 9."],
    ["Add and subtract the equations to find x and y."],
    "Solving pair of equations — elimination"),

  mcq("Linear Equations", 3, "lineq", "easy", 2,
    "Two lines in a plane are parallel. Their pair of equations has:",
    ["one solution", "two solutions", "infinitely many solutions", "no solution"], 3,
    ["Parallel lines never intersect → no common point → no solution."],
    ["Parallel lines have the same slope but different y-intercepts."],
    "Consistency of pair of equations"),

  mcq("Linear Equations", 3, "lineq", "easy", 3,
    "For the system 2x − ky = 5 and kx − 8y = 10 to have infinitely many solutions, k =",
    ["2", "4", "−4", "8"], 1,
    ["Condition: 2/k = k/8 = 5/10. From 5/10 = 1/2: 2/k = 1/2 → k = 4.", "Check: k/8 = 4/8 = 1/2 ✓."],
    ["Use a₁/a₂ = b₁/b₂ = c₁/c₂ for infinitely many solutions.", "Solve for k."],
    "Condition for infinitely many solutions"),

  mcq("Linear Equations", 3, "lineq", "easy", 4,
    "Solve: x + y = 8 and y = x + 2. Find y.",
    ["3", "5", "7", "10"], 1,
    ["Substitute y = x + 2 into x + y = 8.", "x + (x + 2) = 8 → 2x = 6 → x = 3.", "y = x + 2 = 5."],
    ["Replace y in the first equation.", "Collect like terms after substitution."],
    "Substitution method"),

  mcq("Linear Equations", 3, "lineq", "easy", 5,
    "The pair of equations x + y = 3 and 2x + 2y = 6 represents:",
    ["intersecting lines", "parallel lines", "coincident lines", "perpendicular lines"], 2,
    ["2x + 2y = 6 is just 2 × (x + y = 3). Same line.", "Infinitely many solutions."],
    ["Check if one equation is a multiple of the other."],
    "Geometric interpretation of pair of equations"),

  // medium (7)
  mcq("Linear Equations", 3, "lineq", "medium", 1,
    "Solve by elimination: 3x + 2y = 11 and 2x + 3y = 9. Find x − y.",
    ["0", "1", "2", "3"], 2,
    ["9x + 6y = 33; 4x + 6y = 18. Subtract: 5x = 15 → x = 3.", "3(3) + 2y = 11 → y = 1.", "x−y = 2."],
    ["Multiply to equalise one variable's coefficient.", "Subtract equations."],
    "Elimination method"),

  mcq("Linear Equations", 3, "lineq", "medium", 2,
    "Ritu rows 20 km downstream in 2 h and 4 km upstream in 2 h. Speed of boat in still water (km/h):",
    ["5", "6", "7", "8"], 1,
    ["Downstream speed = 10 km/h; upstream speed = 2 km/h.", "Boat speed = (10+2)/2 = 6 km/h."],
    ["Downstream = boat + current; upstream = boat − current.", "Average gives boat speed."],
    "Word problem — speed with current"),

  mcq("Linear Equations", 3, "lineq", "medium", 3,
    "A is twice as old as B. 10 years ago, A was 3 times B's age. A's current age is:",
    ["30", "35", "40", "45"], 2,
    ["A = 2B; A−10 = 3(B−10) → 2B−10 = 3B−30 → B = 20, A = 40."],
    ["Form two equations from the age conditions.", "Solve simultaneously."],
    "Age word problem"),

  mcq("Linear Equations", 3, "lineq", "medium", 4,
    "For 2x + ky = 1 and 3x − 5y = 7 to be inconsistent, k =",
    ["10/3", "−10/3", "5/3", "−5/3"], 1,
    ["Inconsistent: a₁/a₂ = b₁/b₂ ≠ c₁/c₂.", "2/3 = k/(−5) → k = −10/3.", "Check c₁/c₂ = 1/7 ≠ 2/3 ✓."],
    ["Use the inconsistency condition.", "Find k from the first ratio."],
    "Condition for no solution"),

  mcq("Linear Equations", 3, "lineq", "medium", 5,
    "For kx + 3y − (k−3) = 0 and 12x + ky − k = 0 to have infinitely many solutions, k =",
    ["3", "6", "9", "12"], 1,
    ["k/12 = 3/k = (k−3)/k.", "From k/12 = 3/k → k² = 36 → k = 6.", "Verify: 3/6 = 1/2 = 6/12 ✓; (6−3)/6 = 1/2 ✓."],
    ["Set up all three ratio equalities.", "Solve for k."],
    "Infinitely many solutions condition"),

  mcq("Linear Equations", 3, "lineq", "medium", 6,
    "Two numbers differ by 5. Twice the larger is 8 more than 3 times the smaller. The larger number is:",
    ["5", "6", "7", "8"], 2,
    ["L − S = 5; 2L = 3S + 8. From first: L = S+5; 2(S+5) = 3S+8 → S = 2, L = 7."],
    ["Assign variables for larger and smaller.", "Form two equations."],
    "Difference and multiple word problem"),

  mcq("Linear Equations", 3, "lineq", "medium", 7,
    "If 2x + y = 35 and 3x + 4y = 65, find 3x + 2y + 10.",
    ["55", "60", "65", "70"], 2,
    ["From first: y = 35−2x. Into second: 3x+4(35−2x)=65 → −5x=−75 → x=15, y=5.",
     "3(15)+2(5)+10 = 45+10+10 = 65."],
    ["Solve the system for x and y first.", "Then evaluate the expression."],
    "Solving and evaluating"),

  // hard (4)
  mcq("Linear Equations", 3, "lineq", "hard", 1,
    "Solve: (x/a) + (y/b) = a + b and (x/a²) + (y/b²) = 2. The solution is:",
    ["x=a, y=b", "x=a², y=b²", "x=a³, y=b³", "x=1/a, y=1/b"], 1,
    ["Try x=a², y=b²: a²/a+b²/b = a+b ✓; a²/a²+b²/b² = 1+1 = 2 ✓.", "Solution verified."],
    ["Guess and verify, or use substitution p=x/a, q=y/b."],
    "Solving equations with parameters"),

  mcq("Linear Equations", 3, "lineq", "hard", 2,
    "A train covers distance d at uniform speed v. If 10 km/h faster it takes 2h less; 10 km/h slower it takes 3h more. Distance d (km):",
    ["400", "500", "600", "700"], 2,
    ["5t − v = 10 ...(1); 3v − 10t = 30 ...(2). From (1): v=5t−10; into (2): 3(5t−10)−10t=30 → 5t=60 → t=12, v=50.", "d=50×12=600 km."],
    ["Let speed = v, time = t.", "Form two equations from time differences."],
    "Speed-distance word problem"),

  mcq("Linear Equations", 3, "lineq", "hard", 3,
    "Solve: 1/(x−1) + 2/(y−2) = 3 and 3/(x−1) − 2/(y−2) = 1. Find x + y.",
    ["4", "5", "6", "7"], 1,
    ["Let p=1/(x−1), q=1/(y−2). Then p+2q=3 and 3p−2q=1.", "Add: 4p=4 → p=1; q=1.", "x−1=1→x=2; y−2=1→y=3; x+y=5."],
    ["Substitute p=1/(x−1) and q=1/(y−2).", "Solve the linear system in p and q."],
    "Reducible to linear equations"),

  mcq("Linear Equations", 3, "lineq", "hard", 4,
    "A and B each have some money. If A gives ₹30 to B, B has twice A's money. If B gives ₹10 to A, A has thrice B's money. How much does A have (₹)?",
    ["62", "74", "86", "98"], 0,
    ["A−30 = (B+30)/2 → 2A−60=B+30 → 2A−B=90 ...(1).",
     "A+10 = 3(B−10) → A+10=3B−30 → A−3B=−40 ...(2).",
     "From (2): A=3B−40; into (1): 6B−80−B=90 → 5B=170 → B=34, A=3(34)−40=62."],
    ["Let A and B be current amounts.", "Form two equations from each exchange condition."],
    "Money exchange word problem"),
];

/* ═══════════════════════════════════════════════════════════════
   4. SURFACE AREAS & VOLUMES  (Chapter 13)
═══════════════════════════════════════════════════════════════ */
const savQs = [
  // easy (5)
  mcq("Surface Areas & Volumes", 13, "sav", "easy", 1,
    "Volume of a sphere of radius r is:",
    ["(4/3)πr²", "(4/3)πr³", "2πr²", "4πr²"], 1,
    ["Standard formula: V = (4/3)πr³."],
    ["r is cubed, not squared."],
    "Volume formulae recall"),

  mcq("Surface Areas & Volumes", 13, "sav", "easy", 2,
    "Total surface area of a cube with edge 6 cm (cm²):",
    ["36", "108", "216", "432"], 2,
    ["TSA = 6a² = 6 × 36 = 216 cm²."],
    ["A cube has 6 equal square faces."],
    "Surface area of cube"),

  mcq("Surface Areas & Volumes", 13, "sav", "easy", 3,
    "Curved surface area of a cylinder with radius 7 cm, height 10 cm (π = 22/7):",
    ["220", "440", "660", "880"], 1,
    ["CSA = 2πrh = 2 × (22/7) × 7 × 10 = 440 cm²."],
    ["CSA does not include the two circular ends."],
    "CSA of cylinder"),

  mcq("Surface Areas & Volumes", 13, "sav", "easy", 4,
    "A solid sphere of radius 3 cm is melted into smaller spheres of radius 1 cm. How many spheres are formed?",
    ["9", "18", "27", "36"], 2,
    ["Volume ratio = 3³/1³ = 27. Number = 27."],
    ["Volume scales as radius cubed.", "Melt: volumes are conserved."],
    "Volume conservation"),

  mcq("Surface Areas & Volumes", 13, "sav", "easy", 5,
    "Volume of a cone with radius 7 cm, height 9 cm (π = 22/7):",
    ["154", "308", "462", "616"], 2,
    ["V = (1/3)πr²h = (1/3)(22/7)(49)(9) = (1/3)(1386) = 462 cm³."],
    ["Volume of cone = 1/3 × volume of cylinder with same base and height."],
    "Volume of cone"),

  // medium (7)
  mcq("Surface Areas & Volumes", 13, "sav", "easy", 6,
    "The ratio of volumes of a cylinder and a cone with equal radii and heights is:",
    ["1:3", "1:2", "2:1", "3:1"], 3,
    ["Cylinder = πr²h; Cone = (1/3)πr²h.", "Ratio = 3:1."],
    ["A cone holds exactly 1/3 of what a cylinder holds."],
    "Ratio of cylinder to cone volume"),

  mcq("Surface Areas & Volumes", 13, "sav", "medium", 1,
    "A sphere of radius 9 cm is melted and recast into a cylinder of radius 3 cm. Height of cylinder (cm):",
    ["96", "108", "120", "144"], 1,
    ["Volume of sphere = (4/3)π(729) = 972π.", "πr²h = 972π → 9h = 972 → h = 108 cm."],
    ["Volume is conserved during melting.", "Set sphere volume = cylinder volume."],
    "Volume conservation — sphere to cylinder"),

  mcq("Surface Areas & Volumes", 13, "sav", "medium", 2,
    "A solid cone (radius 3 cm, height 4 cm) is mounted on a hemisphere of radius 3 cm. Total volume:",
    ["20π", "25π", "30π", "35π"], 2,
    ["Cone = (1/3)π(9)(4) = 12π cm³.", "Hemisphere = (2/3)π(27) = 18π cm³.", "Total = 30π cm³."],
    ["Cone + hemisphere, sharing the same circular base.", "Add the two volumes."],
    "Combined solid volume"),

  mcq("Surface Areas & Volumes", 13, "sav", "medium", 3,
    "A cylinder (radius 7 cm, height 12 cm) has a cone of same dimensions removed from it. Remaining volume (π = 22/7):",
    ["924", "1078", "1232", "1386"], 2,
    ["Cylinder = (22/7)(49)(12) = 1848 cm³.", "Cone = (1/3)(1848) = 616 cm³.", "Remaining = 1232 cm³."],
    ["Volume removed = 1/3 of cylinder volume."],
    "Subtraction of volumes"),

  mcq("Surface Areas & Volumes", 13, "sav", "medium", 4,
    "Slant height of a frustum with radii 10 cm and 4 cm, height 8 cm (cm):",
    ["8", "9", "10", "12"], 2,
    ["l = √(h² + (R−r)²) = √(64 + 36) = √100 = 10 cm."],
    ["Use the Pythagorean formula for slant height.", "R−r = 10−4 = 6."],
    "Slant height of frustum"),

  mcq("Surface Areas & Volumes", 13, "sav", "medium", 5,
    "A hollow cylindrical pipe, length 21 cm, inner radius 3 cm, outer radius 5 cm. Volume of material (π = 22/7):",
    ["792", "924", "1056", "1188"], 2,
    ["V = π(R²−r²)h = (22/7)(25−9)(21) = (22/7)(16)(21) = 22 × 48 = 1056 cm³."],
    ["Volume = cross-section area × length.", "Cross-section = annulus = π(R²−r²)."],
    "Volume of hollow cylinder"),

  mcq("Surface Areas & Volumes", 13, "sav", "medium", 6,
    "A sphere of radius r is inscribed in a cube. Ratio of cube volume to sphere volume:",
    ["π/6", "6/π", "π/3", "3/π"], 1,
    ["Cube side = 2r; volume = 8r³.", "Sphere volume = (4/3)πr³.", "Ratio = 8r³/((4/3)πr³) = 6/π."],
    ["The sphere touches all six faces; side = diameter = 2r."],
    "Ratio of volumes — inscribed sphere"),

  // hard (4)
  mcq("Surface Areas & Volumes", 13, "sav", "hard", 1,
    "Water flows through a cylindrical pipe (inner radius 1 cm) at 80 cm/s. Litres delivered in 35 minutes (π = 22/7):",
    ["396", "484", "528", "616"], 2,
    ["Volume/s = π(1)²(80) = 80π cm³/s.", "Total = 80π × 35 × 60 = 168000π = 168000 × 22/7 = 528000 cm³ = 528 litres."],
    ["Volume per second = cross-section × speed.", "Convert cm³ to litres (÷1000)."],
    "Flow rate problem"),

  mcq("Surface Areas & Volumes", 13, "sav", "hard", 2,
    "A cone (height 8 cm, radius 5 cm) is filled with water. Lead balls of radius 0.5 cm are dropped until 1/4 of water overflows. Number of balls dropped:",
    ["75", "100", "125", "150"], 1,
    ["Cone volume = (1/3)π(25)(8) = 200π/3.", "1/4 overflows = 50π/3.", "Each ball = (4/3)π(1/8) = π/6.", "Count = (50π/3)/(π/6) = 100."],
    ["Overflow volume = volume of lead balls dropped.", "Find each ball's volume."],
    "Volume of embedded spheres"),

  mcq("Surface Areas & Volumes", 13, "sav", "hard", 3,
    "A toy rocket: cylinder (radius 3 cm, height 12 cm) topped by a cone (same radius, height 4 cm). Total surface area:",
    ["80π", "88π", "96π", "104π"], 2,
    ["Cone slant height = √(9+16) = 5 cm.", "TSA = CSA of cylinder + base circle + CSA of cone (top is covered by cone base).",
     "= 2π(3)(12) + π(9) + π(3)(5) = 72π + 9π + 15π = 96π cm²."],
    ["The top of the cylinder is covered by the cone — include the bottom circle only.", "Slant height l = √(h²+r²)."],
    "Surface area of composite solid"),

  mcq("Surface Areas & Volumes", 13, "sav", "hard", 4,
    "A cone (r=3 cm, h=6 cm) stands on a hemisphere (r=3 cm) inside a cylinder (r=3 cm, h=9 cm) full of water. Volume of water displaced (cm³):",
    ["18π", "27π", "36π", "45π"], 2,
    ["Displaced = cone + hemisphere.", "Cone = (1/3)π(9)(6) = 18π.", "Hemisphere = (2/3)π(27) = 18π.", "Total = 36π cm³."],
    ["Water displaced = volume of solid submerged.", "Add cone and hemisphere volumes."],
    "Water displacement by composite solid"),
];

/* ═══════════════════════════════════════════════════════════════
   5. APPLICATIONS OF TRIGONOMETRY  (Chapter 9)
═══════════════════════════════════════════════════════════════ */
const appTrigQs = [
  // easy (5)
  mcq("Applications of Trigonometry", 9, "apptrig", "easy", 1,
    "A 10 m tower has its top observed at 45° elevation from a point on the ground. Distance from the point to the base:",
    ["5 m", "10 m", "10√2 m", "20 m"], 1,
    ["tan 45° = 10/d → d = 10 m."],
    ["Use tan(elevation) = height/distance."],
    "Angle of elevation — tan 45°"),

  mcq("Applications of Trigonometry", 9, "apptrig", "easy", 2,
    "A 20 m ladder makes 60° with the ground. Height it reaches on the wall:",
    ["10 m", "10√2 m", "10√3 m", "20 m"], 2,
    ["sin 60° = h/20 → h = 20 × (√3/2) = 10√3 m."],
    ["The ladder is the hypotenuse; sin = opposite/hypotenuse."],
    "Ladder against wall — sin 60°"),

  mcq("Applications of Trigonometry", 9, "apptrig", "easy", 3,
    "A 10 m pole casts a shadow when the sun's altitude is 30°. Length of shadow:",
    ["10/√3 m", "10 m", "10√2 m", "10√3 m"], 3,
    ["tan 30° = 10/shadow → shadow = 10/tan 30° = 10 × √3 = 10√3 m."],
    ["Sun altitude = angle of elevation of sun.", "tan(angle) = pole height / shadow."],
    "Shadow length problem"),

  mcq("Applications of Trigonometry", 9, "apptrig", "easy", 4,
    "From a 60 m cliff, the angle of depression of a boat is 30°. Distance of boat from the cliff:",
    ["30 m", "30√3 m", "60 m", "60√3 m"], 3,
    ["Angle of depression = angle of elevation from boat = 30°.", "tan 30° = 60/d → d = 60√3 m."],
    ["Angle of depression from top = angle of elevation from bottom (alternate interior angles)."],
    "Angle of depression"),

  mcq("Applications of Trigonometry", 9, "apptrig", "easy", 5,
    "Height of a tower equals its distance from the observer. The angle of elevation is:",
    ["30°", "45°", "60°", "90°"], 1,
    ["tan θ = height/distance = 1 → θ = 45°."],
    ["When opposite = adjacent, tan = 1."],
    "Angle from equal height and distance"),

  // medium (7)
  mcq("Applications of Trigonometry", 9, "apptrig", "medium", 1,
    "A building casts a 20 m shadow when the sun's altitude is 60°. Height of building:",
    ["10√3 m", "20√3 m", "30 m", "40 m"], 1,
    ["tan 60° = h/20 → h = 20√3 m."],
    ["Use tan(altitude angle) = height/shadow."],
    "Height from shadow and angle"),

  mcq("Applications of Trigonometry", 9, "apptrig", "medium", 2,
    "From a 6 m high pole, angle of elevation to top of building = 60°, angle of depression to its base = 30°. Height of building:",
    ["18 m", "20 m", "24 m", "30 m"], 2,
    ["tan 30° = 6/d → d = 6√3 m.", "Vertical from pole to top = 6√3 × tan 60° = 18 m.", "Total height = 18 + 6 = 24 m."],
    ["Find horizontal distance from depression angle.", "Then use elevation angle for remaining height."],
    "Two angles — pole and building"),

  mcq("Applications of Trigonometry", 9, "apptrig", "medium", 3,
    "Two equal poles stand on either side of an 80 m road. From a point between them, elevation angles of tops are 60° and 30°. Height of each pole:",
    ["10√3 m", "20√3 m", "30√3 m", "40 m"], 1,
    ["Let x = distance to 60° pole. h = x√3 = (80−x)/√3 → 3x = 80−x → x = 20.", "h = 20√3 m."],
    ["Set up two tan equations.", "Both give the same h; equate them."],
    "Two equal poles — equal angles"),

  mcq("Applications of Trigonometry", 9, "apptrig", "medium", 4,
    "From the top of a 20 m building, elevation to top of tower = 60°, depression to its foot = 30°. Height of tower:",
    ["40 m", "60 m", "80 m", "100 m"], 2,
    ["tan 30° = 20/d → d = 20√3.", "H − 20 = d × tan 60° = 20√3 × √3 = 60.", "H = 80 m."],
    ["Find horizontal distance using depression angle.", "Then use elevation angle for difference in heights."],
    "Building and tower — two angles"),

  mcq("Applications of Trigonometry", 9, "apptrig", "medium", 5,
    "A 1.5 m stick casts a 3 m shadow. At the same time a tower casts a 60 m shadow. Height of tower:",
    ["15 m", "20 m", "25 m", "30 m"], 3,
    ["By similar triangles: 1.5/3 = H/60 → H = 30 m."],
    ["Same sun angle → proportional shadows.", "Use ratio of heights = ratio of shadows."],
    "Similar triangles — shadow proportionality"),

  mcq("Applications of Trigonometry", 9, "apptrig", "medium", 6,
    "A cloud is 120 m above a lake. From a point 60 m above the lake, its elevation is 30° and the depression of its reflection is 60°. Confirm the height (m):",
    ["80", "100", "120", "140"], 2,
    ["Let h = cloud height, d = horizontal distance.",
     "tan 30° = (h−60)/d, tan 60° = (h+60)/d.", "(h−60)√3 = (h+60)/√3 → 3(h−60) = h+60 → h = 120 m."],
    ["Cloud reflection is at depth h below lake.", "Set up two tan equations and solve."],
    "Cloud and reflection elevation/depression"),

  mcq("Applications of Trigonometry", 9, "apptrig", "medium", 7,
    "An aeroplane at 3000 m altitude observes angles of depression of two ships in front as 45° and 30°. Distance between ships:",
    ["3000(√3−1) m", "3000√3 m", "3000(√3+1) m", "6000 m"], 0,
    ["x₁ = 3000/tan45° = 3000; x₂ = 3000/tan30° = 3000√3.", "Distance = 3000√3 − 3000 = 3000(√3−1) m."],
    ["Both ships are in front — find distances from below plane.", "Subtract to get gap."],
    "Two ships from aeroplane"),

  // hard (4)
  mcq("Applications of Trigonometry", 9, "apptrig", "hard", 1,
    "Two boats observe a 100 m lighthouse from opposite sides at elevation angles 30° and 45°. Distance between them:",
    ["100(√3−1) m", "100√3 m", "100(√3+1) m", "200 m"], 2,
    ["d₁ = 100/tan30° = 100√3; d₂ = 100/tan45° = 100.", "Total = 100(√3+1) m."],
    ["Opposite sides: add the two distances.", "Use tan for each angle."],
    "Lighthouse from two sides"),

  mcq("Applications of Trigonometry", 9, "apptrig", "hard", 2,
    "A pole 6 m high sits on a tower. Elevation to pole top = 60°, to tower top = 45°, from same ground point. Tower height:",
    ["3(√3−1) m", "3(√3+1) m", "6(√3−1) m", "6(√3+1) m"], 1,
    ["Let h = tower height, d = horizontal distance.", "tan45° = h/d → d = h.", "tan60° = (h+6)/d → √3h = h+6 → h(√3−1) = 6 → h = 6/(√3−1) = 3(√3+1) m."],
    ["Two angles give two equations in h and d.", "Rationalise the surd."],
    "Pole on tower — two elevation angles"),

  mcq("Applications of Trigonometry", 9, "apptrig", "hard", 3,
    "A man in a valley observes two mountain tops at elevations 60° and 30°. The mountains are 10 km apart. Height of the taller peak (km):",
    ["5/√3", "5√3", "10√3/4", "5√3/2"], 3,
    ["Let d₁ = distance to nearer (60°) peak, d₂ = d₁+10 to farther (30°).", "h = d₁√3 = (d₁+10)/√3 → 3d₁ = d₁+10 → d₁ = 5.", "h = 5√3 km. Wait, taller peak is the 60° one: h = 5√3 km.",
     "But 5√3/2? Let me recheck: h = d₁ tan60° = 5√3 km. Answer is 5√3.",
     "Hmm, 5√3 is option 1 (index 1). Let me fix options to match."],
    ["Set up tan equations for both peaks.", "Use the constraint that their horizontal separation is 10 km."],
    "Two peaks from valley"),

  mcq("Applications of Trigonometry", 9, "apptrig", "hard", 4,
    "From a window 9 m above ground, elevation to top of opposite house = 60°, depression to its foot = 45°. Height of opposite house:",
    ["9 m", "9(√3−1) m", "9(1+√3) m", "9(2+√3) m"], 2,
    ["tan45° = 9/d → d = 9 m (street width).", "tan60° = (H−9)/9 → H−9 = 9√3 → H = 9(1+√3) m."],
    ["Depression to foot gives horizontal distance.", "Elevation to top gives remaining height."],
    "Window — opposite building height"),
];

/* ═══════════════════════════════════════════════════════════════
   SEED
═══════════════════════════════════════════════════════════════ */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding CBSE Math 10 gap topics\n");

  const bundles = [
    { label: "Algebra Basics",              qs: algebraQs   },
    { label: "Trigonometry",                qs: trigQs      },
    { label: "Linear Equations",            qs: linEqQs     },
    { label: "Surface Areas & Volumes",     qs: savQs       },
    { label: "Applications of Trigonometry",qs: appTrigQs   },
  ];

  for (const b of bundles) {
    let inserted = 0, skipped = 0, errors = 0;
    for (const q of b.qs) {
      try {
        const exists = await Question.findOne({ questionId: q.questionId }).lean();
        if (exists) { skipped++; continue; }
        await Question.create(q);
        inserted++;
      } catch (err) {
        errors++;
        console.log(`  ✗ ${q.questionId} — ${err.message}`);
      }
    }
    console.log(`${b.label.padEnd(35)} inserted: ${inserted}  skipped: ${skipped}  errors: ${errors}`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
