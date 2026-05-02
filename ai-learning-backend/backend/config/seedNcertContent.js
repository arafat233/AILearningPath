/**
 * CBSE Class 10 Mathematics — NCERT Chapter Content Seed
 * Upserts NcertChapter documents for all 14 chapters (2023-24 syllabus).
 * Chapters 1-4: full subchapters with concepts, formulas, and 2+ questions each.
 * Chapters 5-14: correct subchapter structure with overviews and concept stubs.
 *
 * Usage:
 *   node backend/config/seedNcertContent.js
 *
 * Safe to re-run — upserts on chapterId.
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertChapter } from "../models/ncertChapterModel.js";

const CHAPTERS = [
  // ══════════════════════════════════════════════════════════════════
  // Chapter 1 — Real Numbers  (FULL)
  // ══════════════════════════════════════════════════════════════════
  {
    chapterId: "ch1",
    number: 1,
    title: "Real Numbers",
    overview:
      "This chapter revisits the world of real numbers and establishes two fundamental results: " +
      "Euclid's Division Lemma (a = bq + r) and the Fundamental Theorem of Arithmetic (unique prime " +
      "factorisation). These are used to compute HCF and LCM efficiently, prove that √2, √3, and " +
      "similar roots are irrational, and determine whether a rational number has a terminating or " +
      "non-terminating repeating decimal expansion.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch1-1",
        number: "1.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch1-1-c1",
            name: "Number Systems Recap",
            definition:
              "Natural numbers (N), whole numbers (W), integers (Z), rational numbers (Q), " +
              "irrational numbers and real numbers (R) form a nested hierarchy. Every integer is " +
              "rational; every rational number is real; but not every real number is rational.",
            topics: [
              {
                id: "ch1-1-c1-t1",
                name: "Hierarchy of Number Systems",
                prerequisite_knowledge: ["Natural numbers", "Integers", "Fractions"],
                key_formulas: ["N ⊂ W ⊂ Z ⊂ Q ⊂ R"],
                questions: [
                  {
                    id: "ch1-1-c1-t1-q1",
                    source: "NCERT Exercise 1.1",
                    difficulty: "easy",
                    type: "mcq",
                    question: "Which of the following is NOT a rational number?",
                    answer: "√7",
                    marks: 1,
                    skill_tested: "Classifying numbers into number system categories",
                  },
                  {
                    id: "ch1-1-c1-t1-q2",
                    source: "CBSE Board 2022",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "State whether 0.1212121212… (0.12̄) is rational or irrational. Give a reason.",
                    answer:
                      "Rational — it is a non-terminating repeating decimal, which can be expressed as 12/99 = 4/33.",
                    marks: 1,
                    skill_tested: "Identifying rational numbers from decimal expansions",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch1-2",
        number: "1.2",
        title: "The Fundamental Theorem of Arithmetic",
        concepts: [
          {
            id: "ch1-2-c1",
            name: "Euclid's Division Lemma",
            definition:
              "For any two positive integers a and b, there exist unique non-negative integers q " +
              "(quotient) and r (remainder) such that a = bq + r, where 0 ≤ r < b. " +
              "This lemma is the foundation for the Euclidean algorithm to find HCF.",
            topics: [
              {
                id: "ch1-2-c1-t1",
                name: "Computing HCF Using Euclid's Algorithm",
                prerequisite_knowledge: ["Division of integers", "Remainders"],
                key_formulas: [
                  "a = bq + r, 0 ≤ r < b",
                  "HCF(a, b) = HCF(b, r) when a = bq + r",
                ],
                questions: [
                  {
                    id: "ch1-2-c1-t1-q1",
                    source: "NCERT Exercise 1.1 Q1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Use Euclid's algorithm to find the HCF of 135 and 225.",
                    answer:
                      "225 = 135 × 1 + 90; 135 = 90 × 1 + 45; 90 = 45 × 2 + 0. HCF = 45.",
                    marks: 3,
                    skill_tested: "Applying Euclid's Division Lemma step by step",
                  },
                  {
                    id: "ch1-2-c1-t1-q2",
                    source: "CBSE Board 2023",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Show that any positive odd integer is of the form 6q + 1, 6q + 3, or 6q + 5 for some integer q.",
                    answer:
                      "By Euclid's Lemma with b = 6, any integer a = 6q + r, r ∈ {0,1,2,3,4,5}. " +
                      "Even remainders (0, 2, 4) give even numbers. Odd remainders are 1, 3, 5, so odd integers are of the form 6q+1, 6q+3, 6q+5.",
                    marks: 3,
                    skill_tested: "Proving divisibility results using Euclid's Lemma",
                  },
                ],
              },
            ],
          },
          {
            id: "ch1-2-c2",
            name: "Fundamental Theorem of Arithmetic",
            definition:
              "Every composite number can be expressed (factorised) as a product of primes, and " +
              "this factorisation is unique, apart from the order in which the prime factors occur. " +
              "This is used to find HCF (product of smallest powers of common primes) and LCM " +
              "(product of greatest powers of all primes).",
            topics: [
              {
                id: "ch1-2-c2-t1",
                name: "HCF and LCM via Prime Factorisation",
                prerequisite_knowledge: ["Prime numbers", "Composite numbers", "Exponents"],
                key_formulas: [
                  "HCF = product of smallest powers of common prime factors",
                  "LCM = product of greatest powers of all prime factors",
                  "HCF(a, b) × LCM(a, b) = a × b",
                ],
                questions: [
                  {
                    id: "ch1-2-c2-t1-q1",
                    source: "NCERT Exercise 1.2 Q2",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Find the LCM and HCF of 12, 15, and 21 by applying the prime factorisation method.",
                    answer:
                      "12 = 2² × 3; 15 = 3 × 5; 21 = 3 × 7. " +
                      "HCF = 3 (only common prime). LCM = 2² × 3 × 5 × 7 = 420.",
                    marks: 3,
                    skill_tested: "Prime factorisation and HCF/LCM calculation",
                  },
                  {
                    id: "ch1-2-c2-t1-q2",
                    source: "CBSE Board 2023",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "The HCF of two numbers is 18 and their LCM is 720. If one of the numbers is 90, find the other.",
                    answer:
                      "Using HCF × LCM = product of numbers: 18 × 720 = 90 × other. " +
                      "Other = 18 × 720 / 90 = 12960 / 90 = 144.",
                    marks: 2,
                    skill_tested: "Applying the HCF × LCM = product relationship",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch1-3",
        number: "1.3",
        title: "Irrational Numbers",
        concepts: [
          {
            id: "ch1-3-c1",
            name: "Proving Irrationality by Contradiction",
            definition:
              "A number is irrational if it cannot be written as p/q where p, q are integers and " +
              "q ≠ 0. Key theorem: if p is a prime and p divides a², then p divides a. This is used " +
              "to prove by contradiction that √p (for prime p) is irrational.",
            topics: [
              {
                id: "ch1-3-c1-t1",
                name: "Proof that √2 and √3 are Irrational",
                prerequisite_knowledge: [
                  "Definition of rational numbers",
                  "Proof by contradiction",
                  "Co-prime integers",
                ],
                key_formulas: [
                  "If p (prime) | a² then p | a",
                  "Assume √p = a/b (co-prime), derive contradiction",
                ],
                questions: [
                  {
                    id: "ch1-3-c1-t1-q1",
                    source: "NCERT Exercise 1.3 Q1",
                    difficulty: "medium",
                    type: "long_answer",
                    question: "Prove that √5 is an irrational number.",
                    answer:
                      "Assume √5 = p/q where p, q are co-prime positive integers. " +
                      "Squaring: p² = 5q². So 5 | p², hence 5 | p. Write p = 5m. " +
                      "Then 25m² = 5q² → q² = 5m² → 5 | q. " +
                      "But then 5 divides both p and q, contradicting co-primality. Hence √5 is irrational.",
                    marks: 3,
                    skill_tested: "Proof by contradiction for irrationality",
                  },
                  {
                    id: "ch1-3-c1-t1-q2",
                    source: "CBSE Board 2022",
                    difficulty: "hard",
                    type: "long_answer",
                    question:
                      "Prove that 3 + 2√5 is irrational, given that √5 is irrational.",
                    answer:
                      "Assume 3 + 2√5 is rational. Then 3 + 2√5 = r (rational). " +
                      "So 2√5 = r − 3 → √5 = (r − 3)/2. " +
                      "RHS is rational (difference/quotient of rationals), so √5 would be rational — contradiction. " +
                      "Hence 3 + 2√5 is irrational.",
                    marks: 3,
                    skill_tested: "Using irrationality of √5 to prove composite expressions are irrational",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch1-4",
        number: "1.4",
        title: "Rational Numbers and Their Decimal Expansions",
        concepts: [
          {
            id: "ch1-4-c1",
            name: "Terminating and Non-Terminating Decimal Expansions",
            definition:
              "A rational number p/q (in lowest terms) has a terminating decimal expansion if and " +
              "only if q is of the form 2ⁿ × 5ᵐ for non-negative integers n, m. Otherwise it is " +
              "non-terminating repeating. The number of decimal places equals max(n, m).",
            topics: [
              {
                id: "ch1-4-c1-t1",
                name: "Identifying Terminating Decimals",
                prerequisite_knowledge: [
                  "Simplifying fractions to lowest terms",
                  "Prime factorisation of denominators",
                ],
                key_formulas: [
                  "p/q terminates ⟺ q = 2ⁿ × 5ᵐ (after simplification)",
                  "Number of decimal places = max(n, m)",
                ],
                questions: [
                  {
                    id: "ch1-4-c1-t1-q1",
                    source: "NCERT Exercise 1.4 Q1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Without performing long division, state whether 13/3125 will have a terminating or non-terminating repeating decimal expansion.",
                    answer:
                      "3125 = 5⁵ × 2⁰. Since q = 2⁰ × 5⁵, it is of the form 2ⁿ5ᵐ. " +
                      "Therefore 13/3125 has a terminating decimal expansion.",
                    marks: 1,
                    skill_tested: "Applying the terminating decimal condition",
                  },
                  {
                    id: "ch1-4-c1-t1-q2",
                    source: "CBSE Board 2021",
                    difficulty: "easy",
                    type: "mcq",
                    question:
                      "The decimal expansion of 17/8 terminates after how many decimal places?",
                    answer:
                      "8 = 2³. So 17/8 = 17 × 5³ / (2³ × 5³) = 2125/1000 = 2.125. It terminates after 3 decimal places.",
                    marks: 1,
                    skill_tested: "Computing number of decimal places for a terminating fraction",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // Chapter 2 — Polynomials  (FULL)
  // ══════════════════════════════════════════════════════════════════
  {
    chapterId: "ch2",
    number: 2,
    title: "Polynomials",
    overview:
      "This chapter examines polynomials of degree up to three. Students learn to read the zeros of " +
      "a polynomial from the graph (x-intercepts), find the relationship between zeros and coefficients " +
      "(Vieta's formulas for quadratic and cubic polynomials), and apply the Division Algorithm to " +
      "divide one polynomial by another and verify or find remaining zeros.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch2-1",
        number: "2.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch2-1-c1",
            name: "Degree and Types of Polynomials",
            definition:
              "A polynomial p(x) = aₙxⁿ + … + a₁x + a₀ has degree n (the highest power with a " +
              "non-zero coefficient). Linear (degree 1), quadratic (degree 2), cubic (degree 3).",
            topics: [
              {
                id: "ch2-1-c1-t1",
                name: "Identifying Degree and Type",
                prerequisite_knowledge: ["Exponents", "Algebraic expressions"],
                key_formulas: ["Degree = highest power of x with non-zero coefficient"],
                questions: [
                  {
                    id: "ch2-1-c1-t1-q1",
                    source: "NCERT Exercise 2.1",
                    difficulty: "easy",
                    type: "mcq",
                    question:
                      "What is the degree of the polynomial p(x) = 4x³ − 5x² + 7?",
                    answer: "3 (cubic polynomial).",
                    marks: 1,
                    skill_tested: "Identifying degree of a polynomial",
                  },
                  {
                    id: "ch2-1-c1-t1-q2",
                    source: "CBSE Board 2022",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "How many zeros can a quadratic polynomial have at most, and what does it mean geometrically?",
                    answer:
                      "At most 2 zeros. Geometrically they are the x-coordinates of the points where the parabola " +
                      "y = ax² + bx + c crosses the x-axis.",
                    marks: 1,
                    skill_tested: "Connecting zeros of polynomial to graph",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch2-2",
        number: "2.2",
        title: "Geometrical Meaning of the Zeroes of a Polynomial",
        concepts: [
          {
            id: "ch2-2-c1",
            name: "Zeros as Graph Intersections with x-axis",
            definition:
              "The zeros of a polynomial p(x) are the values of x for which p(x) = 0. On the graph " +
              "y = p(x), they are the x-coordinates where the curve meets the x-axis. " +
              "A linear graph crosses once; a parabola can touch (one zero) or cross at two points " +
              "(two distinct zeros) or never touch (no real zeros).",
            topics: [
              {
                id: "ch2-2-c1-t1",
                name: "Reading Zeros from a Graph",
                prerequisite_knowledge: [
                  "Plotting quadratic graphs",
                  "x-intercepts",
                ],
                key_formulas: [
                  "Zero of p(x): value α where p(α) = 0",
                  "Number of x-intercepts = number of real zeros",
                ],
                questions: [
                  {
                    id: "ch2-2-c1-t1-q1",
                    source: "NCERT Exercise 2.1 Q1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "The graph of y = p(x) for some polynomial p(x) is given. The number of " +
                      "zeros of p(x) is equal to the number of points where the graph intersects " +
                      "the x-axis. If the graph crosses the x-axis at x = −2, 0, and 3, write down the zeros.",
                    answer: "The zeros are −2, 0, and 3.",
                    marks: 1,
                    skill_tested: "Reading zeros from graph intersections",
                  },
                  {
                    id: "ch2-2-c1-t1-q2",
                    source: "CBSE Board 2023",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "The graph of y = ax² + bx + c is a parabola that opens upward and " +
                      "touches the x-axis at exactly one point x = 3. What does this tell you about the discriminant and the zero(s) of the polynomial?",
                    answer:
                      "The parabola touching the x-axis at exactly one point means the polynomial has one repeated zero: x = 3 (double root). " +
                      "The discriminant D = b² − 4ac = 0.",
                    marks: 2,
                    skill_tested: "Connecting discriminant to number of zeros via graph",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch2-3",
        number: "2.3",
        title: "Relationship Between Zeroes and Coefficients",
        concepts: [
          {
            id: "ch2-3-c1",
            name: "Vieta's Formulas for Quadratic Polynomials",
            definition:
              "For p(x) = ax² + bx + c with zeros α and β: sum of zeros α + β = −b/a and " +
              "product of zeros αβ = c/a. The polynomial can be reconstructed as " +
              "k[x² − (α+β)x + αβ] for any non-zero constant k.",
            topics: [
              {
                id: "ch2-3-c1-t1",
                name: "Sum and Product of Zeros",
                prerequisite_knowledge: [
                  "Factorisation of quadratics",
                  "Coefficient identification",
                ],
                key_formulas: [
                  "α + β = −b/a",
                  "αβ = c/a",
                  "p(x) = k[x² − (α+β)x + αβ]",
                ],
                questions: [
                  {
                    id: "ch2-3-c1-t1-q1",
                    source: "NCERT Exercise 2.2 Q1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Find the zeros of the quadratic polynomial p(x) = x² − 5x + 6 and verify the relationship between zeros and coefficients.",
                    answer:
                      "x² − 5x + 6 = (x − 2)(x − 3). Zeros: α = 2, β = 3. " +
                      "Verification: α + β = 5 = −(−5)/1 = 5 ✓; αβ = 6 = 6/1 ✓.",
                    marks: 3,
                    skill_tested: "Finding zeros and verifying Vieta's formulas",
                  },
                  {
                    id: "ch2-3-c1-t1-q2",
                    source: "CBSE Board 2023",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "If α and β are the zeros of the polynomial f(x) = x² − 5x + k, and α − β = 1, find the value of k.",
                    answer:
                      "α + β = 5, αβ = k. (α − β)² = (α + β)² − 4αβ = 25 − 4k. " +
                      "Given α − β = 1: 1 = 25 − 4k → 4k = 24 → k = 6.",
                    marks: 3,
                    skill_tested: "Using Vieta's formulas with an additional condition on zeros",
                  },
                  {
                    id: "ch2-3-c1-t1-q3",
                    source: "CBSE Board 2022",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Find a quadratic polynomial whose sum of zeros is −3 and product of zeros is 2.",
                    answer:
                      "p(x) = k[x² − (sum)x + product] = k[x² − (−3)x + 2] = k(x² + 3x + 2). " +
                      "For k = 1: p(x) = x² + 3x + 2.",
                    marks: 2,
                    skill_tested: "Constructing a polynomial from sum and product of zeros",
                  },
                ],
              },
            ],
          },
          {
            id: "ch2-3-c2",
            name: "Zeros and Coefficients of Cubic Polynomials",
            definition:
              "For p(x) = ax³ + bx² + cx + d with zeros α, β, γ: " +
              "α + β + γ = −b/a; αβ + βγ + γα = c/a; αβγ = −d/a.",
            topics: [
              {
                id: "ch2-3-c2-t1",
                name: "Vieta's Relations for Cubics",
                prerequisite_knowledge: [
                  "Expanding cubic expressions",
                  "Quadratic zero relationships",
                ],
                key_formulas: [
                  "α + β + γ = −b/a",
                  "αβ + βγ + γα = c/a",
                  "αβγ = −d/a",
                ],
                questions: [
                  {
                    id: "ch2-3-c2-t1-q1",
                    source: "NCERT Exercise 2.4 Q2",
                    difficulty: "hard",
                    type: "long_answer",
                    question:
                      "If the zeros of the polynomial p(x) = x³ − 3x² + x + 1 are (a − b), a, and (a + b), find a and b.",
                    answer:
                      "Sum of zeros: (a−b) + a + (a+b) = 3a = 3 → a = 1. " +
                      "Product of zeros: (a−b) · a · (a+b) = a(a²−b²) = −(−1)/1 = −1 (since d = 1, leading coeff = 1, product = −d/a = −1). " +
                      "1 · (1 − b²) = −1 → 1 − b² = −1 → b² = 2 → b = ±√2.",
                    marks: 4,
                    skill_tested: "Applying Vieta's formulas for cubic polynomials",
                  },
                  {
                    id: "ch2-3-c2-t1-q2",
                    source: "CBSE Board 2021",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Verify that 3, −1, and −1/3 are the zeros of the cubic polynomial p(x) = 3x³ − 5x² − 11x − 3, and verify the relationship between the zeros and the coefficients.",
                    answer:
                      "p(3) = 81−45−33−3=0 ✓; p(−1) = −3−5+11−3=0 ✓; p(−1/3) = 3(−1/27)−5(1/9)−11(−1/3)−3 = −1/9−5/9+11/3−3 = 0 ✓. " +
                      "Sum = 3+(−1)+(−1/3) = 5/3 = −(−5)/3 ✓. Sum of products of pairs = (3)(−1)+(−1)(−1/3)+(3)(−1/3) = −3+1/3−1 = −11/3 ✓. " +
                      "Product = (3)(−1)(−1/3) = 1 = −(−3)/3 ✓.",
                    marks: 4,
                    skill_tested: "Verification of all three Vieta's relations for a cubic",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch2-4",
        number: "2.4",
        title: "Division Algorithm for Polynomials",
        concepts: [
          {
            id: "ch2-4-c1",
            name: "Polynomial Long Division",
            definition:
              "For polynomials p(x) and g(x) with g(x) ≠ 0, there exist unique polynomials q(x) " +
              "(quotient) and r(x) (remainder) such that p(x) = g(x) · q(x) + r(x), where either " +
              "r(x) = 0 or deg r(x) < deg g(x). This is used to find additional zeros once one zero is known.",
            topics: [
              {
                id: "ch2-4-c1-t1",
                name: "Applying the Division Algorithm",
                prerequisite_knowledge: [
                  "Long division of numbers",
                  "Degree of polynomial",
                  "Vieta's formulas",
                ],
                key_formulas: ["p(x) = g(x) · q(x) + r(x)"],
                questions: [
                  {
                    id: "ch2-4-c1-t1-q1",
                    source: "NCERT Exercise 2.3 Q1",
                    difficulty: "medium",
                    type: "long_answer",
                    question:
                      "Divide the polynomial p(x) = x³ − 3x² + 5x − 3 by g(x) = x² − 2, and find the quotient and remainder.",
                    answer:
                      "Performing long division: x³ − 3x² + 5x − 3 ÷ (x² − 2). " +
                      "x³ ÷ x² = x → x(x²−2) = x³−2x. Remainder after subtracting: −3x²+7x−3. " +
                      "−3x² ÷ x² = −3 → −3(x²−2) = −3x²+6. Remainder: 7x−9. " +
                      "Quotient = x − 3; Remainder = 7x − 9. Verify: (x²−2)(x−3) + (7x−9) = x³−3x²−2x+6+7x−9 = x³−3x²+5x−3 ✓.",
                    marks: 4,
                    skill_tested: "Polynomial long division technique",
                  },
                  {
                    id: "ch2-4-c1-t1-q2",
                    source: "NCERT Exercise 2.4 Q1",
                    difficulty: "hard",
                    type: "long_answer",
                    question:
                      "Given that the zeroes of the cubic polynomial x³ − 6x² + 3x + 10 are of the form a, a+b, a+2b, find all three zeroes.",
                    answer:
                      "Sum of zeros = 6 → 3a + 3b = 6 → a + b = 2. " +
                      "Product of zeros = −10 (coefficient check: product = −d/a = −10/1 = −10). " +
                      "a(a+b)(a+2b) = a · 2 · (a+2b) = −10 → 2a(a+2b) = −10. " +
                      "With a + b = 2 → b = 2−a. So a + 2b = a + 2(2−a) = 4−a. " +
                      "2a(4−a) = −10 → 8a − 2a² = −10 → 2a² − 8a − 10 = 0 → a² − 4a − 5 = 0 → (a−5)(a+1) = 0. " +
                      "a = 5 → b = −3 → zeros: 5, 2, −1. Check: 5+2+(−1)=6 ✓; 5×2×(−1)=−10 ✓.",
                    marks: 5,
                    skill_tested: "Using symmetric form and Vieta's formulas to find all zeros",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // Chapter 3 — Pair of Linear Equations in Two Variables  (FULL)
  // ══════════════════════════════════════════════════════════════════
  {
    chapterId: "ch3",
    number: 3,
    title: "Pair of Linear Equations in Two Variables",
    overview:
      "This chapter studies systems of two linear equations in two unknowns. Students explore the " +
      "graphical interpretation (intersection, parallel, or coincident lines), consistency conditions " +
      "using coefficient ratios, and three algebraic solution methods: substitution, elimination, and " +
      "cross-multiplication. Word problems (age, coins, speed, fractions) are a major focus.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch3-1",
        number: "3.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch3-1-c1",
            name: "Linear Equation in Two Variables",
            definition:
              "An equation of the form ax + by + c = 0, where a, b are not both zero, is a linear " +
              "equation in two variables x and y. Its solution is an ordered pair (x, y) that " +
              "satisfies the equation. There are infinitely many solutions, and they form a straight line.",
            topics: [
              {
                id: "ch3-1-c1-t1",
                name: "Solution as Ordered Pairs",
                prerequisite_knowledge: [
                  "Substituting values into equations",
                  "Ordered pairs and Cartesian plane",
                ],
                key_formulas: ["ax + by + c = 0, a² + b² ≠ 0"],
                questions: [
                  {
                    id: "ch3-1-c1-t1-q1",
                    source: "NCERT Exercise 3.1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Check whether (1, 2) is a solution of the system: 2x + 3y = 8 and x − y = −1.",
                    answer:
                      "For (1, 2): 2(1) + 3(2) = 2 + 6 = 8 ✓; 1 − 2 = −1 ✓. Yes, (1, 2) is a solution.",
                    marks: 2,
                    skill_tested: "Verification of solution by substitution",
                  },
                  {
                    id: "ch3-1-c1-t1-q2",
                    source: "CBSE Board 2022",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "For what value of k will the following pair of equations have no solution? 3x + y = 1;  (2k−1)x + (k−1)y = 2k+1.",
                    answer:
                      "No solution when a₁/a₂ = b₁/b₂ ≠ c₁/c₂. " +
                      "3/(2k−1) = 1/(k−1) → 3(k−1) = 2k−1 → 3k−3 = 2k−1 → k = 2. " +
                      "Check c-ratio: 1/(2k+1) = 1/5 ≠ 3/(2k−1) = 1 → confirmed no solution for k = 2.",
                    marks: 3,
                    skill_tested: "Applying consistency conditions for no solution",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch3-2",
        number: "3.2",
        title: "Graphical Method of Solution",
        concepts: [
          {
            id: "ch3-2-c1",
            name: "Consistency via Graphical Interpretation",
            definition:
              "For a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0: " +
              "if a₁/a₂ ≠ b₁/b₂ → lines intersect → unique solution (consistent). " +
              "if a₁/a₂ = b₁/b₂ ≠ c₁/c₂ → parallel lines → no solution (inconsistent). " +
              "if a₁/a₂ = b₁/b₂ = c₁/c₂ → coincident lines → infinite solutions (consistent, dependent).",
            topics: [
              {
                id: "ch3-2-c1-t1",
                name: "Consistency Conditions",
                prerequisite_knowledge: [
                  "Slope of a line",
                  "Ratio and proportion",
                ],
                key_formulas: [
                  "Unique solution: a₁/a₂ ≠ b₁/b₂",
                  "No solution: a₁/a₂ = b₁/b₂ ≠ c₁/c₂",
                  "Infinite solutions: a₁/a₂ = b₁/b₂ = c₁/c₂",
                ],
                questions: [
                  {
                    id: "ch3-2-c1-t1-q1",
                    source: "NCERT Exercise 3.2",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "On comparing the ratios a₁/a₂, b₁/b₂, and c₁/c₂, determine whether the pair x + y = 5, 2x + 2y = 10 is consistent or inconsistent.",
                    answer:
                      "a₁/a₂ = 1/2, b₁/b₂ = 1/2, c₁/c₂ = 5/10 = 1/2. " +
                      "All three ratios equal → coincident lines → infinitely many solutions → consistent (dependent).",
                    marks: 2,
                    skill_tested: "Classifying a system using ratio conditions",
                  },
                  {
                    id: "ch3-2-c1-t1-q2",
                    source: "CBSE Board 2023",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Solve graphically: x + y = 3; 3x − 2y = 4. Find the coordinates of the point of intersection.",
                    answer:
                      "From x + y = 3: y = 3−x. Plot: (0,3), (3,0). " +
                      "From 3x−2y = 4: y = (3x−4)/2. Plot: (0,−2), (2,1). " +
                      "Intersection: solve simultaneously — substituting y = 3−x into 3x−2(3−x)=4 → 3x−6+2x=4 → 5x=10 → x=2, y=1. " +
                      "Point of intersection: (2, 1).",
                    marks: 4,
                    skill_tested: "Graphical solution of a consistent system",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch3-3",
        number: "3.3",
        title: "Algebraic Methods of Solving a Pair of Linear Equations",
        concepts: [
          {
            id: "ch3-3-c1",
            name: "Substitution Method",
            definition:
              "Express one variable in terms of the other from one equation, then substitute into " +
              "the second equation to get a single-variable equation. Solve and back-substitute.",
            topics: [
              {
                id: "ch3-3-c1-t1",
                name: "Solving by Substitution",
                prerequisite_knowledge: [
                  "Simplifying linear expressions",
                  "Solving single-variable equations",
                ],
                key_formulas: [
                  "From eq1: express x = f(y), substitute into eq2",
                ],
                questions: [
                  {
                    id: "ch3-3-c1-t1-q1",
                    source: "NCERT Exercise 3.3 Q1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Solve: x − y = 3 and x/3 + y/2 = 6 using the substitution method.",
                    answer:
                      "From x − y = 3: x = y + 3. Substitute: (y+3)/3 + y/2 = 6 → (2(y+3) + 3y)/6 = 6 → 5y+6 = 36 → y = 6. " +
                      "x = 6 + 3 = 9. Solution: (9, 6).",
                    marks: 3,
                    skill_tested: "Substitution method with fractional coefficients",
                  },
                  {
                    id: "ch3-3-c1-t1-q2",
                    source: "CBSE Board 2022",
                    difficulty: "medium",
                    type: "long_answer",
                    question:
                      "Five years ago, Nuri was thrice as old as Sonu. Ten years later, Nuri will be twice as old as Sonu. Find their present ages using substitution.",
                    answer:
                      "Let Nuri's age = x, Sonu's age = y. " +
                      "Five years ago: x − 5 = 3(y − 5) → x = 3y − 10 ... (1). " +
                      "Ten years later: x + 10 = 2(y + 10) → x = 2y + 10 ... (2). " +
                      "From (1) and (2): 3y − 10 = 2y + 10 → y = 20. x = 2(20)+10 = 50. " +
                      "Nuri is 50 years old; Sonu is 20 years old.",
                    marks: 4,
                    skill_tested: "Formulating and solving an age word problem",
                  },
                ],
              },
            ],
          },
          {
            id: "ch3-3-c2",
            name: "Elimination Method",
            definition:
              "Multiply the equations by suitable constants so that the coefficient of one variable " +
              "becomes equal in both, then add or subtract the equations to eliminate that variable.",
            topics: [
              {
                id: "ch3-3-c2-t1",
                name: "Solving by Elimination",
                prerequisite_knowledge: [
                  "Multiplying equations by constants",
                  "Adding/subtracting equations",
                ],
                key_formulas: [
                  "Multiply eq1 by b₂, eq2 by b₁, then subtract to eliminate y",
                ],
                questions: [
                  {
                    id: "ch3-3-c2-t1-q1",
                    source: "NCERT Exercise 3.4 Q1",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Solve: 3x + 4y = 10; 2x − 2y = 2 using the elimination method.",
                    answer:
                      "Multiply eq2 by 2: 4x − 4y = 4. Add to eq1: 7x = 14 → x = 2. " +
                      "Substitute: 2(2) − 2y = 2 → 4 − 2y = 2 → y = 1. Solution: (2, 1).",
                    marks: 3,
                    skill_tested: "Elimination by multiplying to match coefficients",
                  },
                  {
                    id: "ch3-3-c2-t1-q2",
                    source: "CBSE Board 2023",
                    difficulty: "hard",
                    type: "long_answer",
                    question:
                      "A fraction becomes 9/11 when 2 is added to both numerator and denominator. If 3 is added to both, it becomes 5/6. Find the fraction.",
                    answer:
                      "Let fraction = x/y. (x+2)/(y+2) = 9/11 → 11x+22 = 9y+18 → 11x−9y = −4 ... (1). " +
                      "(x+3)/(y+3) = 5/6 → 6x+18 = 5y+15 → 6x−5y = −3 ... (2). " +
                      "Multiply (1) by 5, (2) by 9: 55x−45y = −20; 54x−45y = −27. Subtract: x = 7. " +
                      "From (2): 42−5y = −3 → y = 9. Fraction = 7/9.",
                    marks: 5,
                    skill_tested: "Setting up and solving a fraction word problem",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch3-4",
        number: "3.4",
        title: "Equations Reducible to a Pair of Linear Equations",
        concepts: [
          {
            id: "ch3-4-c1",
            name: "Substitution to Linearise Non-Linear Pairs",
            definition:
              "Some pairs of equations involving 1/x, 1/y, or other non-linear terms can be reduced " +
              "to linear form by substituting p = 1/x and q = 1/y (or similar substitutions). Solve " +
              "for p and q, then reverse the substitution.",
            topics: [
              {
                id: "ch3-4-c1-t1",
                name: "Linearising Using Substitution",
                prerequisite_knowledge: [
                  "Reciprocals",
                  "Algebraic substitution",
                ],
                key_formulas: ["Let p = 1/x, q = 1/y to convert to linear form"],
                questions: [
                  {
                    id: "ch3-4-c1-t1-q1",
                    source: "NCERT Exercise 3.6 Q1",
                    difficulty: "medium",
                    type: "long_answer",
                    question:
                      "Solve: 2/x + 3/y = 13; 5/x − 4/y = −2. (x ≠ 0, y ≠ 0)",
                    answer:
                      "Let p = 1/x, q = 1/y. System: 2p + 3q = 13; 5p − 4q = −2. " +
                      "Multiply first by 4, second by 3: 8p+12q=52; 15p−12q=−6. Add: 23p=46 → p=2. " +
                      "2(2)+3q=13 → q=3. So x=1/2, y=1/3.",
                    marks: 4,
                    skill_tested: "Linearisation using reciprocal substitution",
                  },
                  {
                    id: "ch3-4-c1-t1-q2",
                    source: "CBSE Board 2021",
                    difficulty: "hard",
                    type: "long_answer",
                    question:
                      "A boat goes 30 km upstream and 44 km downstream in 10 hours. It goes 40 km upstream and 55 km downstream in 13 hours. Find the speed of the boat in still water and the speed of the stream.",
                    answer:
                      "Let speed of boat = x km/h, stream = y km/h. Upstream speed = x−y, downstream = x+y. " +
                      "30/(x−y) + 44/(x+y) = 10 ... (1); 40/(x−y) + 55/(x+y) = 13 ... (2). " +
                      "Let p = 1/(x−y), q = 1/(x+y). 30p+44q=10; 40p+55q=13. " +
                      "Multiply first by 4, second by 3: 120p+176q=40; 120p+165q=39. Subtract: 11q=1 → q=1/11. " +
                      "30p+4=10 → p=1/5. x−y=5, x+y=11 → x=8, y=3. " +
                      "Speed of boat = 8 km/h; speed of stream = 3 km/h.",
                    marks: 5,
                    skill_tested: "Speed-distance word problem with linearising substitution",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // Chapter 4 — Quadratic Equations  (FULL)
  // ══════════════════════════════════════════════════════════════════
  {
    chapterId: "ch4",
    number: 4,
    title: "Quadratic Equations",
    overview:
      "A quadratic equation has the standard form ax² + bx + c = 0 (a ≠ 0). This chapter covers " +
      "three solution methods — factorisation by splitting the middle term, completing the square, " +
      "and the quadratic formula — and the role of the discriminant D = b² − 4ac in determining " +
      "the nature of roots (two distinct real, two equal real, or no real roots).",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch4-1",
        number: "4.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch4-1-c1",
            name: "Standard Form of a Quadratic Equation",
            definition:
              "ax² + bx + c = 0 where a, b, c are real numbers and a ≠ 0. The highest degree is 2.",
            topics: [
              {
                id: "ch4-1-c1-t1",
                name: "Identifying and Writing Quadratic Equations",
                prerequisite_knowledge: ["Expanding algebraic expressions", "Degree of polynomials"],
                key_formulas: ["ax² + bx + c = 0, a ≠ 0"],
                questions: [
                  {
                    id: "ch4-1-c1-t1-q1",
                    source: "NCERT Exercise 4.1 Q1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Check whether (x + 1)² = 2(x − 3) is a quadratic equation.",
                    answer:
                      "Expand: x²+2x+1 = 2x−6 → x²+8 = 0 (i.e. x²+0·x+8=0). " +
                      "Degree is 2 and leading coefficient ≠ 0. Yes, it is a quadratic equation.",
                    marks: 2,
                    skill_tested: "Reducing and identifying a quadratic equation",
                  },
                  {
                    id: "ch4-1-c1-t1-q2",
                    source: "CBSE Board 2023",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Represent the following situation as a quadratic equation: The product of two consecutive positive integers is 306.",
                    answer:
                      "Let the integers be x and x+1. Then x(x+1) = 306 → x² + x − 306 = 0.",
                    marks: 2,
                    skill_tested: "Framing a quadratic equation from a word problem",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch4-2",
        number: "4.2",
        title: "Solution of a Quadratic Equation by Factorisation",
        concepts: [
          {
            id: "ch4-2-c1",
            name: "Splitting the Middle Term",
            definition:
              "To factorise ax² + bx + c, find two numbers p and q such that p + q = b and " +
              "p × q = ac. Rewrite bx = px + qx and factorise by grouping. Apply the zero-product " +
              "property: if AB = 0, then A = 0 or B = 0.",
            topics: [
              {
                id: "ch4-2-c1-t1",
                name: "Factorisation by Splitting Middle Term",
                prerequisite_knowledge: [
                  "Factorisation of quadratic trinomials",
                  "Zero-product property",
                ],
                key_formulas: [
                  "Find p, q: p + q = b and p × q = ac",
                  "ax² + px + qx + c = 0 → group and factor",
                ],
                questions: [
                  {
                    id: "ch4-2-c1-t1-q1",
                    source: "NCERT Exercise 4.2 Q1",
                    difficulty: "easy",
                    type: "short_answer",
                    question:
                      "Find the roots of the quadratic equation 2x² + x − 6 = 0 by factorisation.",
                    answer:
                      "Need p + q = 1, pq = 2(−6) = −12. So p = 4, q = −3. " +
                      "2x² + 4x − 3x − 6 = 0 → 2x(x+2) − 3(x+2) = 0 → (2x−3)(x+2) = 0. " +
                      "Roots: x = 3/2 or x = −2.",
                    marks: 3,
                    skill_tested: "Factorisation by splitting middle term",
                  },
                  {
                    id: "ch4-2-c1-t1-q2",
                    source: "CBSE Board 2022",
                    difficulty: "medium",
                    type: "long_answer",
                    question:
                      "A rectangular park has perimeter 80 m and area 400 m². Find the dimensions of the park.",
                    answer:
                      "Let length = x m. Then breadth = (40−x) m (half perimeter = 40). " +
                      "Area: x(40−x) = 400 → 40x − x² = 400 → x² − 40x + 400 = 0 → (x−20)² = 0. " +
                      "x = 20. Length = 20 m, breadth = 20 m. The park is a square of side 20 m.",
                    marks: 4,
                    skill_tested: "Forming and solving a quadratic from a geometry word problem",
                  },
                  {
                    id: "ch4-2-c1-t1-q3",
                    source: "CBSE Board 2023",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Two water taps together fill a tank in 9⅜ hours. The larger tap takes 10 hours less than the smaller tap. Find the time each tap takes to fill the tank alone.",
                    answer:
                      "Let smaller tap take x hours. Larger tap takes (x−10) hours. " +
                      "Combined rate: 1/x + 1/(x−10) = 8/75 (since 9⅜ = 75/8 hours). " +
                      "(x−10+x)/[x(x−10)] = 8/75 → 75(2x−10) = 8x(x−10) → 8x²−230x+750=0 → 4x²−115x+375=0. " +
                      "(4x−15)(x−25) = 0 → x = 25 (x = 15/4 rejected as x>10 needed). " +
                      "Smaller tap: 25 hours; larger tap: 15 hours.",
                    marks: 5,
                    skill_tested: "Rate of work quadratic word problem",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch4-3",
        number: "4.3",
        title: "Solution of a Quadratic Equation by Completing the Square",
        concepts: [
          {
            id: "ch4-3-c1",
            name: "Completing the Square and the Quadratic Formula",
            definition:
              "Adding and subtracting (b/2a)² converts ax²+bx+c to a(x+b/2a)²+c−b²/4a. " +
              "Setting this equal to zero and solving gives the quadratic formula: " +
              "x = [−b ± √(b²−4ac)] / 2a.",
            topics: [
              {
                id: "ch4-3-c1-t1",
                name: "Using the Quadratic Formula",
                prerequisite_knowledge: [
                  "Perfect square trinomials",
                  "Square roots of real numbers",
                ],
                key_formulas: [
                  "x = [−b ± √(b²−4ac)] / 2a",
                  "Discriminant D = b² − 4ac",
                ],
                questions: [
                  {
                    id: "ch4-3-c1-t1-q1",
                    source: "NCERT Exercise 4.3 Q1",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Solve: 2x² + x − 4 = 0 using the quadratic formula.",
                    answer:
                      "a=2, b=1, c=−4. D = 1+32 = 33. " +
                      "x = (−1 ± √33)/4. Roots: x = (−1+√33)/4 ≈ 1.186 or x = (−1−√33)/4 ≈ −1.686.",
                    marks: 3,
                    skill_tested: "Applying the quadratic formula",
                  },
                  {
                    id: "ch4-3-c1-t1-q2",
                    source: "CBSE Board 2021",
                    difficulty: "hard",
                    type: "long_answer",
                    question:
                      "A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less. Find the speed of the train.",
                    answer:
                      "Let speed = x km/h. Time = 360/x hours. " +
                      "360/x − 360/(x+5) = 1 → 360(x+5) − 360x = x(x+5) → 1800 = x²+5x → x²+5x−1800=0. " +
                      "D = 25+7200 = 7225 = 85². x = (−5+85)/2 = 40 (reject negative). " +
                      "Speed of train = 40 km/h.",
                    marks: 5,
                    skill_tested: "Speed-time-distance word problem solved by quadratic formula",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ch4-4",
        number: "4.4",
        title: "Nature of Roots",
        concepts: [
          {
            id: "ch4-4-c1",
            name: "Discriminant and Nature of Roots",
            definition:
              "The discriminant D = b² − 4ac determines the nature of roots of ax²+bx+c=0: " +
              "D > 0 → two distinct real roots; D = 0 → two equal real roots (−b/2a each); " +
              "D < 0 → no real roots. For equal roots, b² = 4ac.",
            topics: [
              {
                id: "ch4-4-c1-t1",
                name: "Using the Discriminant",
                prerequisite_knowledge: [
                  "Quadratic formula",
                  "Positive/negative/zero quantities",
                ],
                key_formulas: [
                  "D = b² − 4ac",
                  "D > 0: two distinct real roots",
                  "D = 0: equal roots, x = −b/2a",
                  "D < 0: no real roots",
                ],
                questions: [
                  {
                    id: "ch4-4-c1-t1-q1",
                    source: "NCERT Exercise 4.4 Q1",
                    difficulty: "easy",
                    type: "mcq",
                    question:
                      "Find the discriminant of 2x² − 4x + 3 = 0 and state the nature of its roots.",
                    answer:
                      "D = (−4)² − 4(2)(3) = 16 − 24 = −8. Since D < 0, the equation has no real roots.",
                    marks: 2,
                    skill_tested: "Computing discriminant and interpreting nature of roots",
                  },
                  {
                    id: "ch4-4-c1-t1-q2",
                    source: "CBSE Board 2022",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Find the value of k for which the equation kx² − 2kx + 6 = 0 has equal roots.",
                    answer:
                      "For equal roots, D = 0: (−2k)² − 4(k)(6) = 0 → 4k² − 24k = 0 → 4k(k−6) = 0. " +
                      "k = 0 or k = 6. Since k = 0 makes it linear, k = 6.",
                    marks: 3,
                    skill_tested: "Finding parameter value for equal roots using D = 0",
                  },
                  {
                    id: "ch4-4-c1-t1-q3",
                    source: "CBSE Board 2023",
                    difficulty: "medium",
                    type: "short_answer",
                    question:
                      "Is it possible to design a rectangular mango grove whose length is twice its breadth, and the area is 800 m²? If so, find its length and breadth.",
                    answer:
                      "Let breadth = x m, length = 2x m. Area: 2x · x = 800 → 2x² = 800 → x² = 400 → x = 20 m. " +
                      "D = 0+4×400 > 0, so yes, it is possible. Length = 40 m, breadth = 20 m.",
                    marks: 4,
                    skill_tested: "Applying discriminant condition to a real-world problem",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════
  // Chapters 5–14: Correct subchapter structure with concept stubs
  // ══════════════════════════════════════════════════════════════════
  {
    chapterId: "ch5",
    number: 5,
    title: "Arithmetic Progressions",
    overview:
      "An Arithmetic Progression (AP) is a sequence in which each term after the first differs from " +
      "the preceding term by a constant amount called the common difference (d). This chapter develops " +
      "the formula for the nth term (aₙ = a + (n−1)d) and the sum of the first n terms " +
      "(Sₙ = n/2[2a + (n−1)d]), and applies them to a wide variety of real-life problems.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch5-1",
        number: "5.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch5-1-c1",
            name: "Recognising Arithmetic Progressions",
            definition:
              "A sequence a, a+d, a+2d, … is an AP with first term a and common difference d = aₙ₊₁ − aₙ (constant).",
            topics: [
              {
                id: "ch5-1-c1-t1",
                name: "Identifying APs from Sequences",
                prerequisite_knowledge: ["Number sequences", "Subtraction of terms"],
                key_formulas: ["d = aₙ₊₁ − aₙ (constant for all n)"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch5-2",
        number: "5.2",
        title: "Arithmetic Progressions",
        concepts: [
          {
            id: "ch5-2-c1",
            name: "Finite and Infinite APs",
            definition:
              "An AP with a last term l is finite; without a last term it is infinite. " +
              "Consecutive terms: a, a+d, a+2d, …, l.",
            topics: [
              {
                id: "ch5-2-c1-t1",
                name: "Writing Terms of an AP",
                prerequisite_knowledge: ["Common difference", "General term"],
                key_formulas: ["General term: aₙ = a + (n−1)d"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch5-3",
        number: "5.3",
        title: "nth Term of an AP",
        concepts: [
          {
            id: "ch5-3-c1",
            name: "nth Term Formula",
            definition:
              "aₙ = a + (n−1)d. Given any three of aₙ, a, n, d, the fourth can be found.",
            topics: [
              {
                id: "ch5-3-c1-t1",
                name: "Finding the nth Term",
                prerequisite_knowledge: ["AP definition", "Substitution"],
                key_formulas: ["aₙ = a + (n−1)d", "l = a + (n−1)d (last term)"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch5-4",
        number: "5.4",
        title: "Sum of First n Terms of an AP",
        concepts: [
          {
            id: "ch5-4-c1",
            name: "Sum Formulas",
            definition:
              "Sₙ = n/2 × [2a + (n−1)d] = n/2 × [a + l]. Also, nth term from sum: aₙ = Sₙ − Sₙ₋₁.",
            topics: [
              {
                id: "ch5-4-c1-t1",
                name: "Computing Sum of AP",
                prerequisite_knowledge: ["nth term formula", "Gauss pairing method"],
                key_formulas: [
                  "Sₙ = n/2 × [2a + (n−1)d]",
                  "Sₙ = n/2 × (a + l)",
                  "aₙ = Sₙ − Sₙ₋₁",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch6",
    number: 6,
    title: "Triangles",
    overview:
      "This chapter establishes similarity of triangles through the AA, SSS, and SAS criteria and " +
      "the Basic Proportionality Theorem (Thales' theorem). It proves that the ratio of areas of " +
      "similar triangles equals the square of the ratio of corresponding sides, and gives a rigorous " +
      "proof of the Pythagoras theorem and its converse using similar triangles.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch6-1",
        number: "6.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch6-1-c1",
            name: "Congruence vs Similarity",
            definition:
              "Congruent figures are identical in shape and size. Similar figures have the same shape " +
              "but not necessarily the same size — corresponding angles are equal and corresponding sides are proportional.",
            topics: [
              {
                id: "ch6-1-c1-t1",
                name: "Scale Factor and Similar Figures",
                prerequisite_knowledge: ["Ratio and proportion", "Types of angles"],
                key_formulas: ["Scale factor k = corresponding side of image / corresponding side of original"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch6-2",
        number: "6.2",
        title: "Similar Figures",
        concepts: [
          {
            id: "ch6-2-c1",
            name: "Examples of Similar Figures",
            definition:
              "All circles, all squares, and all equilateral triangles are similar to each other. " +
              "Two rectangles are similar only if their length-to-breadth ratios are equal.",
            topics: [
              {
                id: "ch6-2-c1-t1",
                name: "Identifying Similar Polygons",
                prerequisite_knowledge: ["Properties of polygons"],
                key_formulas: ["Similar polygons: ∠ equal and sides proportional"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch6-3",
        number: "6.3",
        title: "Similarity of Triangles",
        concepts: [
          {
            id: "ch6-3-c1",
            name: "Basic Proportionality Theorem",
            definition:
              "If a line is drawn parallel to one side of a triangle intersecting the other two sides, " +
              "it divides those two sides in the same ratio (DE ∥ BC → AD/DB = AE/EC). Converse also holds.",
            topics: [
              {
                id: "ch6-3-c1-t1",
                name: "Applying BPT and Its Converse",
                prerequisite_knowledge: ["Parallel lines", "Ratio of line segments"],
                key_formulas: ["AD/DB = AE/EC when DE ∥ BC"],
                questions: [],
              },
            ],
          },
          {
            id: "ch6-3-c2",
            name: "Similarity Criteria: AA, SSS, SAS",
            definition:
              "AA: two angles equal; SSS: all three sides proportional; " +
              "SAS: one angle equal and including sides proportional.",
            topics: [
              {
                id: "ch6-3-c2-t1",
                name: "Proving Triangles Similar",
                prerequisite_knowledge: ["Angle sum property", "Proportional sides"],
                key_formulas: [
                  "AA: ∠A = ∠P, ∠B = ∠Q → △ABC ~ △PQR",
                  "SSS: AB/PQ = BC/QR = CA/RP",
                  "SAS: AB/PQ = AC/PR and ∠A = ∠P",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch6-4",
        number: "6.4",
        title: "Criteria for Similarity of Triangles",
        concepts: [
          {
            id: "ch6-4-c1",
            name: "Proof and Application of Similarity Criteria",
            definition: "Formal proofs of AA, SSS, SAS criteria and their application to find unknown sides.",
            topics: [
              {
                id: "ch6-4-c1-t1",
                name: "Finding Unknown Sides Using Similarity",
                prerequisite_knowledge: ["Setting up proportions", "Cross multiplication"],
                key_formulas: ["If △ABC ~ △DEF then AB/DE = BC/EF = CA/FD"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch6-5",
        number: "6.5",
        title: "Areas of Similar Triangles",
        concepts: [
          {
            id: "ch6-5-c1",
            name: "Ratio of Areas of Similar Triangles",
            definition:
              "If △ABC ~ △PQR, then ar(△ABC)/ar(△PQR) = (AB/PQ)² = (BC/QR)² = (CA/RP)².",
            topics: [
              {
                id: "ch6-5-c1-t1",
                name: "Using the Area-Ratio Theorem",
                prerequisite_knowledge: ["Area of triangle", "Square of a ratio"],
                key_formulas: ["Area ratio = (side ratio)²"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch6-6",
        number: "6.6",
        title: "Pythagoras Theorem",
        concepts: [
          {
            id: "ch6-6-c1",
            name: "Pythagoras Theorem and Its Converse",
            definition:
              "In a right-angled triangle, AC² = AB² + BC² (hypotenuse²= sum of squares of legs). " +
              "Converse: if AC² = AB² + BC² then ∠B = 90°.",
            topics: [
              {
                id: "ch6-6-c1-t1",
                name: "Proof and Applications",
                prerequisite_knowledge: ["Similar triangles", "AA criterion"],
                key_formulas: [
                  "a² + b² = c² (right triangle)",
                  "Triplets: (3,4,5), (5,12,13), (8,15,17)",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch7",
    number: 7,
    title: "Coordinate Geometry",
    overview:
      "Coordinate geometry uses algebraic tools to study geometric properties. This chapter covers " +
      "the distance formula, the section formula (internal division and midpoint), and the area of a " +
      "triangle given its three vertices. These are used to prove properties of quadrilaterals and to " +
      "solve problems involving collinearity.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch7-1",
        number: "7.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch7-1-c1",
            name: "Cartesian Plane Review",
            definition: "Two perpendicular number lines (x-axis, y-axis) divide the plane into four quadrants.",
            topics: [
              {
                id: "ch7-1-c1-t1",
                name: "Quadrants and Coordinates",
                prerequisite_knowledge: ["Number line", "Ordered pairs"],
                key_formulas: ["Point P(x, y): x is abscissa, y is ordinate"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch7-2",
        number: "7.2",
        title: "Distance Formula",
        concepts: [
          {
            id: "ch7-2-c1",
            name: "Distance Between Two Points",
            definition:
              "d(A, B) = √[(x₂−x₁)² + (y₂−y₁)²]. Distance from origin = √(x²+y²).",
            topics: [
              {
                id: "ch7-2-c1-t1",
                name: "Applying the Distance Formula",
                prerequisite_knowledge: ["Pythagoras theorem", "Squaring and square roots"],
                key_formulas: ["d = √[(x₂−x₁)² + (y₂−y₁)²]"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch7-3",
        number: "7.3",
        title: "Section Formula",
        concepts: [
          {
            id: "ch7-3-c1",
            name: "Internal Division and Midpoint",
            definition:
              "Point dividing A(x₁,y₁) and B(x₂,y₂) in ratio m:n internally: " +
              "P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)). Midpoint (m=n=1): ((x₁+x₂)/2, (y₁+y₂)/2).",
            topics: [
              {
                id: "ch7-3-c1-t1",
                name: "Using the Section and Midpoint Formulas",
                prerequisite_knowledge: ["Ratio and proportion", "Ordered pairs"],
                key_formulas: [
                  "Section: ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))",
                  "Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2)",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch7-4",
        number: "7.4",
        title: "Area of a Triangle",
        concepts: [
          {
            id: "ch7-4-c1",
            name: "Area Using Coordinates",
            definition:
              "Area of △ with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃) = " +
              "½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|. Area = 0 implies collinearity.",
            topics: [
              {
                id: "ch7-4-c1-t1",
                name: "Area of Triangle and Collinearity Check",
                prerequisite_knowledge: ["Coordinate system", "Absolute value"],
                key_formulas: ["Area = ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|"],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch8",
    number: 8,
    title: "Introduction to Trigonometry",
    overview:
      "Trigonometry deals with the relationships between the sides and angles of right-angled triangles. " +
      "This chapter introduces the six trigonometric ratios (sin, cos, tan and their reciprocals), " +
      "their exact values for standard angles (0°, 30°, 45°, 60°, 90°), the complementary angle " +
      "identities, and the three Pythagorean identities that underpin all of trigonometry.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch8-1",
        number: "8.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch8-1-c1",
            name: "Motivation for Trigonometry",
            definition:
              "Trigonometry ('triangle measurement') enables calculation of distances and heights " +
              "indirectly, without direct measurement. Used in astronomy, navigation, surveying.",
            topics: [
              {
                id: "ch8-1-c1-t1",
                name: "Historical and Practical Context",
                prerequisite_knowledge: ["Right triangles", "Pythagoras theorem"],
                key_formulas: [],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch8-2",
        number: "8.2",
        title: "Trigonometric Ratios",
        concepts: [
          {
            id: "ch8-2-c1",
            name: "Six Trigonometric Ratios",
            definition:
              "For acute angle θ in a right triangle: " +
              "sin θ = opp/hyp, cos θ = adj/hyp, tan θ = opp/adj = sin θ/cos θ. " +
              "cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ.",
            topics: [
              {
                id: "ch8-2-c1-t1",
                name: "Computing Ratios from Triangle Sides",
                prerequisite_knowledge: ["Pythagoras theorem", "Identifying opposite and adjacent sides"],
                key_formulas: [
                  "sin θ = opposite / hypotenuse",
                  "cos θ = adjacent / hypotenuse",
                  "tan θ = opposite / adjacent",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch8-3",
        number: "8.3",
        title: "Trigonometric Ratios of Some Specific Angles",
        concepts: [
          {
            id: "ch8-3-c1",
            name: "Standard Angle Values",
            definition:
              "sin 30° = 1/2, cos 30° = √3/2, tan 30° = 1/√3. " +
              "sin 45° = cos 45° = 1/√2, tan 45° = 1. " +
              "sin 60° = √3/2, cos 60° = 1/2, tan 60° = √3. " +
              "sin 0° = 0, cos 0° = 1; sin 90° = 1, cos 90° = 0.",
            topics: [
              {
                id: "ch8-3-c1-t1",
                name: "Memorising and Using the Standard Table",
                prerequisite_knowledge: ["Equilateral triangle geometry", "Isosceles right triangle"],
                key_formulas: [
                  "sin 30° = 1/2; cos 30° = √3/2; tan 30° = 1/√3",
                  "sin 45° = 1/√2; tan 45° = 1",
                  "sin 60° = √3/2; cos 60° = 1/2; tan 60° = √3",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch8-4",
        number: "8.4",
        title: "Trigonometric Ratios of Complementary Angles",
        concepts: [
          {
            id: "ch8-4-c1",
            name: "Co-function Identities",
            definition:
              "sin(90°−θ) = cos θ; cos(90°−θ) = sin θ; tan(90°−θ) = cot θ; " +
              "cot(90°−θ) = tan θ; sec(90°−θ) = cosec θ; cosec(90°−θ) = sec θ.",
            topics: [
              {
                id: "ch8-4-c1-t1",
                name: "Simplifying Expressions Using Complementary Identities",
                prerequisite_knowledge: ["Standard angle values", "Algebraic simplification"],
                key_formulas: ["sin(90°−θ) = cos θ", "tan(90°−θ) = cot θ"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch8-5",
        number: "8.5",
        title: "Trigonometric Identities",
        concepts: [
          {
            id: "ch8-5-c1",
            name: "Pythagorean Identities",
            definition:
              "sin²θ + cos²θ = 1 (dividing by cos²θ: tan²θ + 1 = sec²θ; " +
              "dividing by sin²θ: 1 + cot²θ = cosec²θ).",
            topics: [
              {
                id: "ch8-5-c1-t1",
                name: "Proving Trigonometric Identities",
                prerequisite_knowledge: ["Six trig ratios", "Algebraic manipulation"],
                key_formulas: [
                  "sin²θ + cos²θ = 1",
                  "1 + tan²θ = sec²θ",
                  "1 + cot²θ = cosec²θ",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch9",
    number: 9,
    title: "Some Applications of Trigonometry",
    overview:
      "Using trigonometric ratios (primarily tan) to solve practical problems involving heights and " +
      "distances. Key concepts are angle of elevation (line of sight above horizontal) and angle of " +
      "depression (line of sight below horizontal). Problems involve towers, buildings, ships, and " +
      "landmarks, often requiring two simultaneous right triangles.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch9-1",
        number: "9.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch9-1-c1",
            name: "Angles of Elevation and Depression",
            definition:
              "Angle of elevation: angle above the horizontal from the observer's eye to the object. " +
              "Angle of depression: angle below the horizontal from the observer to the object.",
            topics: [
              {
                id: "ch9-1-c1-t1",
                name: "Setting Up Right Triangles from Diagrams",
                prerequisite_knowledge: ["Tan ratio", "Alternate interior angles"],
                key_formulas: [
                  "tan(elevation) = height / horizontal distance",
                  "Angle of elevation = angle of depression (alternate angles)",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch9-2",
        number: "9.2",
        title: "Heights and Distances",
        concepts: [
          {
            id: "ch9-2-c1",
            name: "Solving Heights and Distance Problems",
            definition:
              "Draw a clear diagram; form right triangles; use tan θ = opposite/adjacent. " +
              "For two-observation problems, set up two equations and solve simultaneously.",
            topics: [
              {
                id: "ch9-2-c1-t1",
                name: "Single and Double Observer Problems",
                prerequisite_knowledge: ["Trigonometric ratios", "Solving linear equations"],
                key_formulas: ["h = d × tan θ (height = distance × tan of angle of elevation)"],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch10",
    number: 10,
    title: "Circles",
    overview:
      "A tangent to a circle at a point is perpendicular to the radius at that point. From any external " +
      "point exactly two tangents can be drawn to a circle, and they are equal in length. This chapter " +
      "proves these two fundamental theorems and applies them to a range of problems involving tangent " +
      "lengths, angles, and combined figures.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch10-1",
        number: "10.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch10-1-c1",
            name: "Tangent vs Secant",
            definition:
              "A secant is a line that intersects a circle at two points; a tangent touches it at exactly one point (the point of tangency).",
            topics: [
              {
                id: "ch10-1-c1-t1",
                name: "Number of Tangents from a Point",
                prerequisite_knowledge: ["Circle terminology", "Point relative to circle"],
                key_formulas: [
                  "From a point inside: 0 tangents",
                  "From a point on circle: 1 tangent",
                  "From an external point: 2 tangents",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch10-2",
        number: "10.2",
        title: "Tangent to a Circle",
        concepts: [
          {
            id: "ch10-2-c1",
            name: "Tangent is Perpendicular to Radius",
            definition:
              "The tangent at any point of a circle is perpendicular to the radius through that point (Theorem 10.1).",
            topics: [
              {
                id: "ch10-2-c1-t1",
                name: "Proof and Applications of the Perpendicularity Theorem",
                prerequisite_knowledge: ["Shortest distance from point to line", "Right angles"],
                key_formulas: ["OP ⊥ tangent at P where O is centre"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch10-3",
        number: "10.3",
        title: "Number of Tangents from a Point on a Circle",
        concepts: [
          {
            id: "ch10-3-c1",
            name: "Equal Tangents from an External Point",
            definition:
              "The lengths of the two tangents drawn from an external point to a circle are equal (Theorem 10.2). " +
              "Tangent length = √(PO² − r²).",
            topics: [
              {
                id: "ch10-3-c1-t1",
                name: "Finding Tangent Length and Solving Circle Problems",
                prerequisite_knowledge: ["Pythagoras theorem", "Properties of isosceles triangles"],
                key_formulas: ["PT = √(PO² − r²)", "PA = PB (equal tangents from P)"],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch11",
    number: 11,
    title: "Areas Related to Circles",
    overview:
      "This chapter extends circle geometry to mensuration. It derives formulas for the area and " +
      "perimeter of a sector (pie-slice region) and a segment (region between a chord and an arc), " +
      "then applies them to compute shaded areas in composite figures involving circles, triangles, " +
      "squares, and other polygons.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch11-1",
        number: "11.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch11-1-c1",
            name: "Circle Mensuration Review",
            definition: "Circumference = 2πr; Area = πr². Use π = 22/7 unless stated otherwise.",
            topics: [
              {
                id: "ch11-1-c1-t1",
                name: "Circumference and Area of Circle",
                prerequisite_knowledge: ["Definition of π", "Radius and diameter"],
                key_formulas: ["C = 2πr", "A = πr²"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch11-2",
        number: "11.2",
        title: "Perimeter and Area of a Circle — A Review",
        concepts: [
          {
            id: "ch11-2-c1",
            name: "Derivation Using Concentric Rings",
            definition: "Area of circle derived by cutting into sectors and rearranging into a parallelogram of base πr and height r.",
            topics: [
              {
                id: "ch11-2-c1-t1",
                name: "Intuitive Derivation of Area Formula",
                prerequisite_knowledge: ["Sector of circle", "Parallelogram area"],
                key_formulas: ["A = πr²"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch11-3",
        number: "11.3",
        title: "Areas of Sector and Segment of a Circle",
        concepts: [
          {
            id: "ch11-3-c1",
            name: "Sector and Segment Area Formulas",
            definition:
              "Area of sector = (θ/360°) × πr². Arc length = (θ/360°) × 2πr. " +
              "Area of segment = area of sector − area of triangle formed by the two radii and the chord.",
            topics: [
              {
                id: "ch11-3-c1-t1",
                name: "Computing Sector and Segment Areas",
                prerequisite_knowledge: ["Fractions of a circle", "Area of triangle"],
                key_formulas: [
                  "Sector area = (θ/360) × πr²",
                  "Arc length = (θ/360) × 2πr",
                  "Segment area = sector area − (½r²sin θ)",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch11-4",
        number: "11.4",
        title: "Areas of Combinations of Plane Figures",
        concepts: [
          {
            id: "ch11-4-c1",
            name: "Shaded-Region Problems",
            definition:
              "Shaded area = total area − unshaded area. Identify each component shape and apply the appropriate formula.",
            topics: [
              {
                id: "ch11-4-c1-t1",
                name: "Composite Area Problems",
                prerequisite_knowledge: ["Sector area", "Area of standard polygons"],
                key_formulas: ["Shaded area = total area − removed area(s)"],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch12",
    number: 12,
    title: "Surface Areas and Volumes",
    overview:
      "Real-world objects are often combinations of basic 3-D solids. This chapter calculates the " +
      "total surface area (sum of exposed surfaces) and volume (sum of individual volumes) of " +
      "combined solids such as cone + cylinder, hemisphere + cylinder, etc. It also covers " +
      "conversion of one solid to another (volume conservation), and the frustum of a cone.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch12-1",
        number: "12.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch12-1-c1",
            name: "Review of Standard 3-D Formulas",
            definition:
              "Cylinder: CSA = 2πrh, TSA = 2πr(r+h), V = πr²h. " +
              "Cone: CSA = πrl, TSA = πr(r+l), V = ⅓πr²h, l = √(r²+h²). " +
              "Sphere: SA = 4πr², V = (4/3)πr³. Hemisphere: CSA = 2πr², TSA = 3πr², V = (2/3)πr³.",
            topics: [
              {
                id: "ch12-1-c1-t1",
                name: "Surface Area and Volume Formulas",
                prerequisite_knowledge: ["Cylinder, cone, sphere geometry"],
                key_formulas: [
                  "Cylinder V = πr²h",
                  "Cone V = ⅓πr²h, l = √(r²+h²)",
                  "Sphere V = (4/3)πr³",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch12-2",
        number: "12.2",
        title: "Surface Area of a Combination of Solids",
        concepts: [
          {
            id: "ch12-2-c1",
            name: "Total Surface Area of Combined Solids",
            definition:
              "Add the surface areas of all exposed parts; subtract the areas of joined circular faces.",
            topics: [
              {
                id: "ch12-2-c1-t1",
                name: "Cone on Cylinder, Hemisphere on Cylinder",
                prerequisite_knowledge: ["CSA and TSA of individual solids"],
                key_formulas: ["TSA = sum of exposed curved and flat surfaces"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch12-3",
        number: "12.3",
        title: "Volume of a Combination of Solids",
        concepts: [
          {
            id: "ch12-3-c1",
            name: "Volume Addition",
            definition: "Total volume = sum of volumes of individual solids (no subtraction needed).",
            topics: [
              {
                id: "ch12-3-c1-t1",
                name: "Capsule, Rocket, Tent Problems",
                prerequisite_knowledge: ["Volume formulas for basic solids"],
                key_formulas: ["V_total = V₁ + V₂ + …"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch12-4",
        number: "12.4",
        title: "Conversion of Solid from One Shape to Another",
        concepts: [
          {
            id: "ch12-4-c1",
            name: "Volume Conservation on Melting/Recasting",
            definition:
              "When a solid is melted and recast into another shape, its volume is conserved. " +
              "Number of smaller solids = volume of large solid / volume of one smaller solid.",
            topics: [
              {
                id: "ch12-4-c1-t1",
                name: "Recasting Problems",
                prerequisite_knowledge: ["Volume formulas", "Equating volumes"],
                key_formulas: ["V_original = n × V_small"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch12-5",
        number: "12.5",
        title: "Frustum of a Cone",
        concepts: [
          {
            id: "ch12-5-c1",
            name: "Frustum Formulas",
            definition:
              "A frustum is obtained by cutting a cone with a plane parallel to the base. " +
              "Slant height l = √[h² + (r₁−r₂)²]. CSA = π(r₁+r₂)l. " +
              "TSA = π(r₁+r₂)l + π(r₁²+r₂²). Volume = πh/3 × (r₁²+r₂²+r₁r₂).",
            topics: [
              {
                id: "ch12-5-c1-t1",
                name: "Frustum Surface Area and Volume",
                prerequisite_knowledge: ["Cone geometry", "Parallel plane cross-section"],
                key_formulas: [
                  "l = √[h² + (r₁−r₂)²]",
                  "CSA = π(r₁+r₂)l",
                  "V = πh/3 × (r₁²+r₂²+r₁r₂)",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch13",
    number: 13,
    title: "Statistics",
    overview:
      "Statistics at this level deals with grouped data. Mean is found using three equivalent methods: " +
      "direct method, assumed mean method, and step-deviation method. Mode uses the modal class formula; " +
      "median uses the cumulative frequency formula and the median class. Ogives (cumulative frequency " +
      "graphs) provide a graphical method to find the median.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch13-1",
        number: "13.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch13-1-c1",
            name: "Grouped Data and Class Marks",
            definition:
              "Data grouped into class intervals. Class mark (midpoint) xᵢ = (lower + upper limit)/2.",
            topics: [
              {
                id: "ch13-1-c1-t1",
                name: "Forming Frequency Distribution Tables",
                prerequisite_knowledge: ["Tally marks", "Class intervals"],
                key_formulas: ["xᵢ = (lower + upper class limit) / 2"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch13-2",
        number: "13.2",
        title: "Mean of Grouped Data",
        concepts: [
          {
            id: "ch13-2-c1",
            name: "Three Methods for Computing Mean",
            definition:
              "Direct: x̄ = Σfᵢxᵢ/Σfᵢ. Assumed mean (A): x̄ = A + Σfᵢdᵢ/Σfᵢ (dᵢ = xᵢ−A). " +
              "Step-deviation: x̄ = A + (Σfᵢuᵢ/Σfᵢ)×h (uᵢ = dᵢ/h, h = class width).",
            topics: [
              {
                id: "ch13-2-c1-t1",
                name: "Direct, Assumed Mean, and Step-Deviation Methods",
                prerequisite_knowledge: ["Weighted average", "Frequency table"],
                key_formulas: [
                  "x̄ = Σfᵢxᵢ / Σfᵢ",
                  "x̄ = A + Σfᵢdᵢ/Σfᵢ",
                  "x̄ = A + (Σfᵢuᵢ/Σfᵢ) × h",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch13-3",
        number: "13.3",
        title: "Mode of Grouped Data",
        concepts: [
          {
            id: "ch13-3-c1",
            name: "Modal Class and Mode Formula",
            definition:
              "Modal class = class with highest frequency. " +
              "Mode = l + [(f₁−f₀)/(2f₁−f₀−f₂)] × h, where l = lower limit of modal class, " +
              "f₁ = modal class frequency, f₀ = preceding class frequency, f₂ = succeeding class frequency, h = class width.",
            topics: [
              {
                id: "ch13-3-c1-t1",
                name: "Finding Mode of Grouped Data",
                prerequisite_knowledge: ["Frequency distribution", "Identifying modal class"],
                key_formulas: ["Mode = l + [(f₁−f₀)/(2f₁−f₀−f₂)] × h"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch13-4",
        number: "13.4",
        title: "Median of Grouped Data",
        concepts: [
          {
            id: "ch13-4-c1",
            name: "Cumulative Frequency and Median Formula",
            definition:
              "Build cumulative frequency table. Median class = class where cf first exceeds n/2. " +
              "Median = l + [(n/2 − cf)/f] × h.",
            topics: [
              {
                id: "ch13-4-c1-t1",
                name: "Finding Median of Grouped Data",
                prerequisite_knowledge: ["Cumulative frequency", "Interpolation"],
                key_formulas: ["Median = l + [(n/2 − cf)/f] × h"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch13-5",
        number: "13.5",
        title: "Graphical Representation of Cumulative Frequency Distribution",
        concepts: [
          {
            id: "ch13-5-c1",
            name: "Ogives",
            definition:
              "Less-than ogive: plot (upper class limit, cumulative frequency). " +
              "More-than ogive: plot (lower class limit, 'more-than' cf). " +
              "Their intersection gives the median.",
            topics: [
              {
                id: "ch13-5-c1-t1",
                name: "Drawing and Reading Ogives",
                prerequisite_knowledge: ["Cumulative frequency table", "Plotting points on graph"],
                key_formulas: ["Intersection of less-than and more-than ogives → median"],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    chapterId: "ch14",
    number: 14,
    title: "Probability",
    overview:
      "This chapter introduces classical (theoretical) probability: P(E) = favourable outcomes / " +
      "total equally likely outcomes. It covers complementary events (P(E) + P(Ē) = 1), impossible " +
      "events (P = 0), and certain events (P = 1). Problems use coins, dice, cards, and other simple " +
      "random experiments.",
    board: "CBSE",
    grade: "10",
    subject: "Mathematics",
    subchapters: [
      {
        id: "ch14-1",
        number: "14.1",
        title: "Introduction",
        concepts: [
          {
            id: "ch14-1-c1",
            name: "Experimental vs Theoretical Probability",
            definition:
              "Experimental probability = frequency of event / total trials. As trials → ∞, " +
              "experimental probability converges to theoretical probability.",
            topics: [
              {
                id: "ch14-1-c1-t1",
                name: "Law of Large Numbers (informal)",
                prerequisite_knowledge: ["Relative frequency", "Long-run behaviour"],
                key_formulas: ["P_exp = (number of times event occurs) / (total trials)"],
                questions: [],
              },
            ],
          },
        ],
      },
      {
        id: "ch14-2",
        number: "14.2",
        title: "Probability — A Theoretical Approach",
        concepts: [
          {
            id: "ch14-2-c1",
            name: "Classical Probability",
            definition:
              "P(E) = n(E) / n(S) where n(S) is the size of the sample space and n(E) is the number " +
              "of outcomes favourable to E. 0 ≤ P(E) ≤ 1. P(Ē) = 1 − P(E).",
            topics: [
              {
                id: "ch14-2-c1-t1",
                name: "Sample Space and Probability of Events",
                prerequisite_knowledge: ["Listing outcomes", "Fractions"],
                key_formulas: [
                  "P(E) = n(E) / n(S)",
                  "P(Ē) = 1 − P(E)",
                  "0 ≤ P(E) ≤ 1",
                ],
                questions: [],
              },
            ],
          },
          {
            id: "ch14-2-c2",
            name: "Card, Dice, and Coin Problems",
            definition:
              "Standard deck: 52 cards, 4 suits (13 each), 12 face cards (J, Q, K × 4 suits), 4 aces. " +
              "Die: 6 equally likely outcomes. Two dice: 36 equally likely outcomes.",
            topics: [
              {
                id: "ch14-2-c2-t1",
                name: "Probability with Cards and Dice",
                prerequisite_knowledge: ["Card deck structure", "Dice outcomes"],
                key_formulas: [
                  "P(face card) = 12/52 = 3/13",
                  "P(ace) = 4/52 = 1/13",
                  "P(sum = k on two dice) = count/36",
                ],
                questions: [],
              },
            ],
          },
        ],
      },
    ],
  },
];

async function seedNcertContent() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI is not set in environment variables.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected.");
  console.log(`\nUpserting ${CHAPTERS.length} NCERT chapters...\n`);

  for (const ch of CHAPTERS) {
    await NcertChapter.findOneAndUpdate(
      { chapterId: ch.chapterId },
      ch,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  [OK] ch${ch.number} — ${ch.title}`);
  }

  console.log(`\nDone. ${CHAPTERS.length} NcertChapter documents upserted.`);
  await mongoose.disconnect();
  console.log("MongoDB disconnected.");
}

seedNcertContent().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
