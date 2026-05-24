/**
 * AP SSC Class 9 Mathematics — Chapter 2: Polynomials
 * 5 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch02.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     2-A  Polynomials in One Variable
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch2_polynomials_basics",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Polynomials in One Variable",
    prerequisite_knowledge: [
      "Algebraic expressions: terms, coefficients, variables",
      "Integer exponents and their laws",
      "Evaluating expressions by substituting values",
      "Classifying expressions: monomials, binomials, trinomials"
    ],
    key_formulas: [
      "General polynomial: p(x) = aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀  (aₙ ≠ 0)",
      "Degree = highest power of the variable with non-zero coefficient",
      "Constant polynomial: degree 0  (e.g., 7)",
      "Linear polynomial: degree 1  (e.g., 3x + 2)",
      "Quadratic polynomial: degree 2  (e.g., x² − 5x + 6)",
      "Cubic polynomial: degree 3  (e.g., 2x³ − x + 1)",
      "Value of p(x) at x = a: substitute x = a and evaluate"
    ],
    teaching_content: {
      intuition: "A polynomial in x is just an expression built from powers of x (whole-number powers only, no negatives, no fractions in the exponent) added together with constant coefficients. Think of each term as a tile: 3x² is one tile, −5x is another, 7 is a constant tile. Stick them together in any order and you have a polynomial. The word 'polynomial' literally means 'many terms'. The highest-power tile determines the degree — the degree tells you the fundamental shape of the polynomial's graph and how many roots it can have.",
      derivation: "Why are negative or fractional exponents excluded?\n\nThe definition requires exponents to be non-negative integers so that the polynomial is defined for every real number x without ambiguity. Expressions like x^(−1) = 1/x are undefined at x = 0. Expressions like x^(1/2) = √x are not defined for negative x. By restricting exponents to {0, 1, 2, 3, …} the polynomial is a smooth, everywhere-defined function on all of ℝ — a much nicer object to study.",
      worked_example: "Classify and find the degree:\n\n(i)  5x³ − 4x + 7:  polynomial, degree 3 (cubic), 3 terms (trinomial)\n(ii) √2·x² − 3:  polynomial (√2 is a constant coefficient), degree 2 (quadratic)\n(iii) x + 1/x:  NOT a polynomial (1/x = x⁻¹, negative exponent)\n(iv) √x + 2:  NOT a polynomial (√x = x^(1/2), fractional exponent)\n(v)  3:  polynomial of degree 0 (constant)\n\nEvaluate p(x) = 2x² − 3x + 1 at x = −2:\n  p(−2) = 2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15",
      visual_description: "Draw a table with three columns: Expression | Is it a polynomial? | Degree. Fill in examples including valid polynomials and non-examples (1/x, √x, x^(1/2)). Below, draw a graph of y = x² (parabola) labelled 'degree 2', y = x³ (cubic curve) labelled 'degree 3', and y = 2x+1 (straight line) labelled 'degree 1' to show how degree governs shape.",
      svg_diagrams: [
        {
          title: "Degree and shape: linear, quadratic, cubic polynomial graphs",
          svg_code: "<svg viewBox='0 0 340 160' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='80' x2='100' y2='80' stroke='#ccc' stroke-width='1'/><line x1='60' y1='20' x2='60' y2='140' stroke='#ccc' stroke-width='1'/><line x1='20' y1='110' x2='100' y2='50' stroke='#2196F3' stroke-width='2'/><text x='22' y='48' font-size='10' fill='#2196F3'>Linear (deg 1)</text><line x1='120' y1='80' x2='200' y2='80' stroke='#ccc' stroke-width='1'/><line x1='160' y1='20' x2='160' y2='140' stroke='#ccc' stroke-width='1'/><path d='M125,130 Q160,20 195,130' fill='none' stroke='#E91E63' stroke-width='2'/><text x='122' y='18' font-size='10' fill='#E91E63'>Quadratic (deg 2)</text><line x1='220' y1='80' x2='320' y2='80' stroke='#ccc' stroke-width='1'/><line x1='270' y1='20' x2='270' y2='140' stroke='#ccc' stroke-width='1'/><path d='M225,120 C240,20 300,140 315,40' fill='none' stroke='#4CAF50' stroke-width='2'/><text x='222' y='18' font-size='10' fill='#4CAF50'>Cubic (deg 3)</text></svg>"
        }
      ],
      common_misconceptions: [
        "2x^(1/2) + 3 is NOT a polynomial — the exponent 1/2 is a fraction, not a whole number.",
        "The coefficient can be irrational (√2, π, etc.) and the expression is still a polynomial — only the exponent must be a non-negative integer.",
        "A polynomial with 'missing' middle terms is still a polynomial: x³ + 1 is a cubic even though the x² and x terms are absent (their coefficients are 0).",
        "Degree of the zero polynomial (0) is undefined (or sometimes defined as −∞) — not 0."
      ],
      shortcuts_and_tricks: [
        "Degree trick: ignore all terms except the highest-power one. The degree is just that power.",
        "Number of terms: monomial = 1 term, binomial = 2, trinomial = 3. More than 3 → just say 'polynomial'.",
        "When evaluating p(a), substitute carefully with brackets: p(−2) means plug (−2) for every x. Bracket every substitution to avoid sign errors.",
        "Leading coefficient = coefficient of the highest-degree term. It determines end behaviour of the graph."
      ],
      when_to_use_this_method: "Use degree classification whenever a problem asks to identify type (linear/quadratic/cubic) or compare polynomials. Use evaluation p(a) whenever asked for the 'value of the polynomial at x = a', or as a prerequisite for the Remainder Theorem.",
      edge_cases: [
        "Is 5 a polynomial? Yes — it is a constant polynomial of degree 0.",
        "Is 0 a polynomial? Yes — the zero polynomial. Its degree is undefined.",
        "Degree of 3x⁴ + 0·x⁵ = 3x⁴ — the x⁵ term has zero coefficient so degree is 4, not 5.",
        "Two polynomials are equal iff all corresponding coefficients are equal — used in identity problems."
      ],
      key_takeaway: "A polynomial in x has only non-negative integer exponents. Degree = highest power. Types by degree: 0 (constant), 1 (linear), 2 (quadratic), 3 (cubic). Evaluate p(a) by substituting x = a. Coefficients can be any real numbers.",
      video_script_hooks: [
        "Opening: 'x², x³, x⁴ — fine. x^(−1) or x^(1/2) — not allowed. One rule separates polynomials from everything else: whole-number powers only, starting from zero.'",
        "Mid-lesson: 'The degree is the rank of a polynomial. Degree 1 makes a line. Degree 2 makes a parabola. Degree 3 makes an S-curve. The degree predicts the shape before you even draw it.'",
        "Closing: 'To evaluate p(a): replace every x with (a), bracket it, and compute. Simple as that — but miss the bracket on a negative number and you will get the sign wrong every time.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     2-B  Zeroes of a Polynomial
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch2_zeroes_of_polynomial",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Zeroes of a Polynomial",
    prerequisite_knowledge: [
      "Evaluating a polynomial at a given value p(a)",
      "Solving linear equations in one variable",
      "Basic graph reading: where a curve crosses the x-axis",
      "Concept of roots of an equation"
    ],
    key_formulas: [
      "a is a zero of p(x) ⟺ p(a) = 0",
      "A linear polynomial ax + b has exactly one zero: x = −b/a",
      "A non-zero constant polynomial has no zeroes",
      "A polynomial of degree n has at most n zeroes (in ℝ)",
      "Geometrical meaning: zeroes are the x-coordinates of the points where y = p(x) crosses (or touches) the x-axis"
    ],
    teaching_content: {
      intuition: "Ask: 'for what value of x does this polynomial equal zero?' That value is a zero of the polynomial. Geometrically, it is exactly where the graph of y = p(x) crosses the x-axis — because on the x-axis, y = 0. A straight line (degree 1) can cross the x-axis at exactly one point. A parabola (degree 2) can cross at 0, 1, or 2 points. A cubic (degree 3) at up to 3 points. The degree caps how many zeroes are possible.",
      derivation: "For a linear polynomial p(x) = ax + b (a ≠ 0):\nSet p(x) = 0: ax + b = 0 → x = −b/a.\nThis is always exactly one solution since a ≠ 0.\n\nFor a quadratic p(x) = ax² + bx + c:\nThe graph is a parabola. It can:\n  • cross x-axis twice (two distinct real zeroes, discriminant b²−4ac > 0)\n  • touch x-axis once (one repeated zero, b²−4ac = 0)\n  • not cross x-axis (no real zeroes, b²−4ac < 0)\n\nSo a quadratic has 0, 1, or 2 real zeroes — never more than its degree 2.",
      worked_example: "Find the zeroes:\n\n(i)  p(x) = 2x + 6\n     Set 2x + 6 = 0 → x = −3. Zero: x = −3. ✓ p(−3) = 2(−3)+6 = 0.\n\n(ii) p(x) = x² − 5x + 6\n     x² − 5x + 6 = (x−2)(x−3) = 0 → x = 2 or x = 3.\n     Verify: p(2) = 4−10+6 = 0 ✓, p(3) = 9−15+6 = 0 ✓\n\n(iii) p(x) = x² + 1\n      x² = −1 has no real solution → no real zeroes. Graph stays above x-axis.\n\n(iv) How many zeroes can a degree-4 polynomial have?\n     At most 4.",
      visual_description: "Draw three coordinate axes side by side. Left: y = 2x−4, a line crossing x-axis at (2,0) — one zero. Middle: y = x²−4, a parabola crossing at (−2,0) and (2,0) — two zeroes. Right: y = x²+1, a parabola that never touches the x-axis — zero zeroes. Mark each x-intercept with a dot and label it as a 'zero'.",
      svg_diagrams: [
        {
          title: "Zeroes as x-intercepts: linear (1 zero), quadratic (2 zeros), no real zero",
          svg_code: "<svg viewBox='0 0 330 150' xmlns='http://www.w3.org/2000/svg'><line x1='10' y1='75' x2='100' y2='75' stroke='#aaa' stroke-width='1'/><line x1='55' y1='10' x2='55' y2='140' stroke='#aaa' stroke-width='1'/><line x1='10' y1='115' x2='100' y2='35' stroke='#2196F3' stroke-width='2'/><circle cx='75' cy='75' r='4' fill='#2196F3'/><text x='70' y='92' font-size='9' fill='#2196F3'>zero</text><text x='12' y='148' font-size='9' fill='#2196F3'>Linear: 1 zero</text><line x1='110' y1='75' x2='210' y2='75' stroke='#aaa' stroke-width='1'/><line x1='160' y1='10' x2='160' y2='140' stroke='#aaa' stroke-width='1'/><path d='M115,20 Q160,135 205,20' fill='none' stroke='#E91E63' stroke-width='2'/><circle cx='138' cy='75' r='4' fill='#E91E63'/><circle cx='182' cy='75' r='4' fill='#E91E63'/><text x='112' y='148' font-size='9' fill='#E91E63'>Quadratic: 2 zeros</text><line x1='220' y1='75' x2='320' y2='75' stroke='#aaa' stroke-width='1'/><line x1='270' y1='10' x2='270' y2='140' stroke='#aaa' stroke-width='1'/><path d='M225,110 Q270,20 315,110' fill='none' stroke='#9C27B0' stroke-width='2'/><text x='222' y='148' font-size='9' fill='#9C27B0'>No real zeros</text></svg>"
        }
      ],
      common_misconceptions: [
        "A polynomial of degree 3 must have 3 zeroes — FALSE. It has at most 3 real zeroes, but could have 1 (e.g., x³ + x has only one real zero: x = 0).",
        "Zero of the polynomial and zero (0) the number are different things. x = −3 is a zero of 2x+6, and −3 ≠ 0.",
        "p(0) gives the y-intercept, not a zero. p(a) = 0 means a is a zero (x-intercept).",
        "Thinking every quadratic has two zeroes — a quadratic can have no real zeroes (e.g., x²+1)."
      ],
      shortcuts_and_tricks: [
        "For a linear polynomial ax+b, zero = −b/a. No factoring needed.",
        "Quick check: if p(a) = 0 after substitution, then a is confirmed a zero. Always verify.",
        "Sum of zeroes of ax²+bx+c = −b/a; product = c/a. Useful for finding zeroes without full factoring when one is known.",
        "A polynomial with an even degree may have no real zeroes. A polynomial with an odd degree always has at least one real zero (by the Intermediate Value Theorem)."
      ],
      when_to_use_this_method: "Use p(a) = 0 to verify/find zeroes. Use graphical thinking (x-intercepts) to estimate how many zeroes a polynomial has. Use 'at most n zeroes for degree n' to bound answers in MCQs.",
      edge_cases: [
        "p(x) = 5 (constant) has no zeroes — the horizontal line y = 5 never touches the x-axis.",
        "p(x) = 0 (zero polynomial) — every number is a zero. This is why it is treated as a special case.",
        "A zero can be repeated: p(x) = (x−3)² has x = 3 as a zero of multiplicity 2 (graph touches but does not cross x-axis).",
        "Zeroes need not be integers: x² − 2 has zeroes x = ±√2 (irrational)."
      ],
      key_takeaway: "A zero of p(x) is a value a where p(a) = 0. Geometrically: x-intercept of y = p(x). A degree-n polynomial has at most n real zeroes. Linear → exactly 1 zero. Constant (non-zero) → 0 zeroes. Always verify by substituting back.",
      video_script_hooks: [
        "Opening: 'Where does the graph cross the x-axis? That point's x-coordinate is a zero of the polynomial. Graph and algebra — same question, two languages.'",
        "Mid-lesson: 'Degree 1: one crossing. Degree 2: zero, one, or two crossings. Degree 3: one, two, or three crossings. The degree is a ceiling on crossings, not a guarantee.'",
        "Closing: 'To find a zero: set p(x) = 0 and solve. To verify a zero: substitute back — if you get 0, you are right. Two lines of work and the answer is confirmed.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     2-C  Remainder Theorem
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch2_remainder_theorem",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Remainder Theorem",
    prerequisite_knowledge: [
      "Polynomial division (long division of polynomials)",
      "Evaluating a polynomial p(a) at x = a",
      "Division algorithm for integers: Dividend = Divisor × Quotient + Remainder",
      "Meaning of zeroes of a polynomial"
    ],
    key_formulas: [
      "Division algorithm for polynomials: p(x) = (x−a)·q(x) + r  where r is a constant",
      "Remainder Theorem: when p(x) is divided by (x−a), the remainder = p(a)",
      "When p(x) is divided by (ax−b), the remainder = p(b/a)",
      "Corollary: (x−a) is a factor of p(x) ⟺ p(a) = 0"
    ],
    teaching_content: {
      intuition: "When you divide a number like 17 by 5, you get quotient 3 and remainder 2: 17 = 5×3 + 2. The same works for polynomials: divide p(x) by (x−a) and get p(x) = (x−a)·q(x) + r. Now substitute x = a: p(a) = (a−a)·q(a) + r = 0 + r = r. The polynomial evaluates to the remainder! So instead of doing long division to find the remainder, just compute p(a). That's the Remainder Theorem — evaluation replaces division.",
      derivation: "Formal proof:\nLet p(x) be any polynomial. Divide p(x) by (x−a):\n\n  p(x) = (x−a)·q(x) + r\n\nwhere q(x) is the quotient polynomial and r is the remainder (a constant, since the divisor x−a has degree 1 and the remainder must have degree less than 1).\n\nSubstitute x = a on both sides:\n  p(a) = (a−a)·q(a) + r\n  p(a) = 0·q(a) + r\n  p(a) = r\n\nTherefore, remainder when p(x) is divided by (x−a) equals p(a). □",
      worked_example: "Find the remainder without long division:\n\n(i)  p(x) = x³ − 3x² + 5x − 7 divided by (x−2)\n     Remainder = p(2) = 8 − 12 + 10 − 7 = −1\n\n(ii) p(x) = 2x³ + x² − 3x + 4 divided by (x+1)\n     x+1 = x−(−1), so a = −1\n     Remainder = p(−1) = 2(−1) + 1 + 3 + 4 = −2+1+3+4 = 6\n\n(iii) p(x) = 4x² − 3x + 2 divided by (2x−1)\n      2x−1 = 0 → x = 1/2\n      Remainder = p(1/2) = 4(1/4) − 3(1/2) + 2 = 1 − 1.5 + 2 = 1.5\n\n(iv) If p(x) = kx³ − 3x + 1 leaves remainder 22 when divided by (x−2), find k.\n     p(2) = 8k − 6 + 1 = 22 → 8k = 27 → k = 27/8",
      visual_description: "Draw an analogy diagram: left side shows integer division 17÷5 = 3 R 2 (17 = 5×3+2); right side shows polynomial division p(x)÷(x−a) = q(x) R r (p(x) = (x−a)q(x)+r). Connect with arrows showing the parallel structure. Below, show that substituting x = a collapses (x−a) to 0, leaving only r = p(a).",
      svg_diagrams: [
        {
          title: "Remainder Theorem: evaluating p(a) gives the remainder",
          svg_code: "<svg viewBox='0 0 340 130' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='150' height='55' rx='6' fill='#E3F2FD'/><text x='80' y='24' text-anchor='middle' font-size='11' fill='#1565C0' font-weight='bold'>Divide p(x) by (x−a)</text><text x='80' y='42' text-anchor='middle' font-size='11' fill='#1565C0'>p(x) = (x−a)·q(x) + r</text><text x='80' y='57' text-anchor='middle' font-size='10' fill='#555'>(r is a constant)</text><rect x='185' y='5' width='150' height='55' rx='6' fill='#FFF3E0'/><text x='260' y='24' text-anchor='middle' font-size='11' fill='#E65100' font-weight='bold'>Substitute x = a</text><text x='260' y='42' text-anchor='middle' font-size='11' fill='#E65100'>p(a) = 0·q(a) + r</text><text x='260' y='57' text-anchor='middle' font-size='11' fill='#E65100' font-weight='bold'>∴ r = p(a)</text><line x1='155' y1='32' x2='185' y2='32' stroke='#555' stroke-width='1.5' marker-end='url(#ar)'/><defs><marker id='ar' markerWidth='6' markerHeight='6' refX='6' refY='3' orient='auto'><path d='M0,0 L6,3 L0,6 Z' fill='#555'/></marker></defs><rect x='5' y='78' width='330' height='45' rx='6' fill='#E8F5E9'/><text x='170' y='97' text-anchor='middle' font-size='12' fill='#2E7D32' font-weight='bold'>Remainder Theorem:</text><text x='170' y='115' text-anchor='middle' font-size='12' fill='#2E7D32'>Remainder = p(a)  ← no long division needed</text></svg>"
        }
      ],
      common_misconceptions: [
        "Dividing by (x+a) — students forget the zero is x = −a, not +a. For (x+3), substitute x = −3, not +3.",
        "The remainder must be a constant when dividing by a linear term — it is never a polynomial itself.",
        "If remainder is 0, that just means (x−a) is a factor — not that p(a) is undefined.",
        "Applying Remainder Theorem to non-linear divisors: the theorem only guarantees a constant remainder for linear divisors (x−a). For quadratic divisors the remainder may be linear."
      ],
      shortcuts_and_tricks: [
        "For (x−a): remainder = p(a). For (x+a): remainder = p(−a). For (ax−b): remainder = p(b/a).",
        "If the question asks 'find k given remainder = c', set up p(a) = c and solve for k — one equation, one unknown.",
        "Mental evaluation: compute each term of p(a) separately and add. Less error-prone than computing p(a) all at once.",
        "Remainder = 0 ↔ (x−a) is a factor. This bridge connects Remainder Theorem directly to Factor Theorem."
      ],
      when_to_use_this_method: "Use Remainder Theorem whenever asked for the remainder of a polynomial division by a linear term — always faster than long division. Use it to find unknown coefficients when the remainder is given.",
      edge_cases: [
        "Dividing a constant polynomial (e.g., p(x) = 5) by (x−3): remainder = p(3) = 5. Quotient = 0.",
        "Dividing by (x−a) where a is irrational (e.g., x−√2): remainder = p(√2) — may be irrational.",
        "Dividing by x (i.e., x−0): remainder = p(0) = constant term of p(x).",
        "p(x) ÷ (x²+1): Remainder Theorem does not apply directly since divisor is not linear."
      ],
      key_takeaway: "When p(x) is divided by (x−a), the remainder equals p(a) — evaluate, don't divide. For divisor (ax−b), substitute x = b/a. Remainder = 0 means (x−a) is a factor of p(x).",
      video_script_hooks: [
        "Opening: 'Long division of polynomials takes 10 steps. The Remainder Theorem takes 1 step. Same answer. One substitution replaces an entire page of work.'",
        "Mid-lesson: 'Remainder of p(x) ÷ (x+3)? Set x+3=0, so x=−3. Compute p(−3). That number IS the remainder. Done.'",
        "Closing: 'The magic: substitute the zero of the divisor into the polynomial. The answer drops out. That one insight is worth every minute you spend here.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     2-D  Factor Theorem and Factorisation of Polynomials
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch2_factor_theorem",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Factor Theorem and Factorisation of Polynomials",
    prerequisite_knowledge: [
      "Remainder Theorem: remainder = p(a) when dividing by (x−a)",
      "Polynomial long division",
      "Factoring quadratics: splitting the middle term",
      "Common factor method and grouping method"
    ],
    key_formulas: [
      "Factor Theorem: (x−a) is a factor of p(x) ⟺ p(a) = 0",
      "For (ax−b) to be a factor of p(x): p(b/a) = 0",
      "x³ − y³ = (x−y)(x² + xy + y²)  [sum/difference of cubes]",
      "x³ + y³ = (x+y)(x² − xy + y²)",
      "x³ + y³ + z³ − 3xyz = (x+y+z)(x²+y²+z²−xy−yz−zx)",
      "If x+y+z = 0, then x³+y³+z³ = 3xyz"
    ],
    teaching_content: {
      intuition: "The Factor Theorem is the Remainder Theorem's most useful consequence: if substituting x = a gives p(a) = 0, then (x−a) divides p(x) exactly — no remainder, it is a factor. This turns 'find a factor' into a guessing game with a quick check: try a few values, find one that gives 0, and you have found a factor. Then divide out that factor to get a simpler polynomial, and repeat.",
      derivation: "Proof of Factor Theorem:\n\n(⟹) If (x−a) is a factor of p(x), then p(x) = (x−a)·q(x) for some polynomial q(x).\nSubstitute x = a: p(a) = (a−a)·q(a) = 0. ✓\n\n(⟸) If p(a) = 0, then by the Remainder Theorem, dividing p(x) by (x−a) gives remainder r = p(a) = 0.\nSo p(x) = (x−a)·q(x) + 0 = (x−a)·q(x).\nTherefore (x−a) is a factor of p(x). □",
      worked_example: "Factorise p(x) = x³ − 6x² + 11x − 6.\n\nStep 1: Try rational roots (factors of 6): ±1, ±2, ±3, ±6.\n  p(1) = 1 − 6 + 11 − 6 = 0 ✓ → (x−1) is a factor.\n\nStep 2: Divide x³−6x²+11x−6 by (x−1) using synthetic/long division:\n  = (x−1)(x²−5x+6)\n\nStep 3: Factor x²−5x+6 = (x−2)(x−3).\n\nFinal: p(x) = (x−1)(x−2)(x−3).\nVerify: p(2)=0 ✓, p(3)=0 ✓.\n\nAlso: Factorise 2x³−5x²−x+6.\n  p(2) = 16−20−2+6 = 0 ✓ → (x−2) is factor.\n  ÷(x−2) → (x−2)(2x²−x−3) = (x−2)(2x−3)(x+1).",
      visual_description: "Draw a flowchart: Start → 'Guess a = ±1, ±2, ±(factor of constant term)' → 'Compute p(a)' → If p(a)=0: '(x−a) is a factor, divide out' → 'Quotient is simpler polynomial, repeat' → If p(a)≠0: 'Try next value'. This shows the systematic factorisation strategy.",
      svg_diagrams: [
        {
          title: "Factor Theorem flowchart: trial substitution → factor → divide → repeat",
          svg_code: "<svg viewBox='0 0 300 180' xmlns='http://www.w3.org/2000/svg'><rect x='80' y='5' width='140' height='30' rx='6' fill='#1565C0'/><text x='150' y='25' text-anchor='middle' font-size='11' fill='white'>Try x = a</text><line x1='150' y1='35' x2='150' y2='55' stroke='#555' stroke-width='1.5'/><rect x='70' y='55' width='160' height='30' rx='6' fill='#E3F2FD'/><text x='150' y='75' text-anchor='middle' font-size='11' fill='#1565C0'>Compute p(a)</text><line x1='150' y1='85' x2='150' y2='100' stroke='#555' stroke-width='1.5'/><polygon points='150,100 170,115 150,130 130,115' fill='#FFF9C4' stroke='#F9A825' stroke-width='1.5'/><text x='150' y='119' text-anchor='middle' font-size='10' fill='#5D4037'>p(a)=0?</text><line x1='170' y1='115' x2='230' y2='115' stroke='#555' stroke-width='1'/><text x='235' y='119' font-size='10' fill='#C62828'>NO → try next</text><line x1='150' y1='130' x2='150' y2='148' stroke='#555' stroke-width='1.5'/><rect x='65' y='148' width='170' height='28' rx='6' fill='#C8E6C9'/><text x='150' y='166' text-anchor='middle' font-size='10' fill='#2E7D32'>(x−a) is a factor → divide out</text></svg>"
        }
      ],
      common_misconceptions: [
        "Only trying x = 1 and x = −1 — the rational root candidates are ±(factors of constant term)/(factors of leading coefficient). Don't stop early.",
        "After finding one factor (x−a), trying to apply Factor Theorem to the original p(x) again instead of to the reduced quotient — always work on the reduced polynomial.",
        "Forgetting that x³+y³ ≠ (x+y)³ — the sum of cubes identity is (x+y)(x²−xy+y²).",
        "Sign error in cube identities: x³−y³ = (x−y)(x²+xy+y²) — the middle term in the bracket is +xy, not −xy."
      ],
      shortcuts_and_tricks: [
        "Rational Root Theorem: for p(x) = aₙxⁿ + … + a₀, any rational zero is ±(factor of a₀)/(factor of aₙ). List these first.",
        "Sum of coefficients = p(1). If all coefficients sum to 0, x = 1 is a zero → (x−1) is a factor.",
        "Alternating sum of coefficients = p(−1). If zero, x = −1 is a zero → (x+1) is a factor.",
        "After finding one linear factor, the degree drops by 1. A cubic → quadratic → easily solvable."
      ],
      when_to_use_this_method: "Use Factor Theorem to factorise cubic (degree 3) polynomials: find one root by trial, divide once to get a quadratic, factor the quadratic normally. Use cube identities for expressions of the form a³ ± b³.",
      edge_cases: [
        "If p(a) = 0 for multiple values of a, the polynomial has multiple factors — don't stop at the first.",
        "A cubic with no rational roots still has one real root (irrational or decimal) — but Factor Theorem with rational guesses won't find it; numerical methods are needed.",
        "x³ + y³ + z³ − 3xyz = (x+y+z)(x²+y²+z²−xy−yz−zx). When x+y+z = 0, the expression equals 3xyz — a useful shortcut for competition problems.",
        "Multiplicity: if (x−a)² divides p(x), then both p(a) = 0 and p'(a) = 0 (Class 9 note only: the graph touches but does not cross the x-axis at x = a)."
      ],
      key_takeaway: "(x−a) is a factor of p(x) if and only if p(a) = 0. To factorise a cubic: guess a root by trial (rational root candidates), confirm with p(a)=0, divide out the linear factor, then factor the resulting quadratic. Use cube sum/difference identities for a³±b³ forms.",
      video_script_hooks: [
        "Opening: 'Factor Theorem turns a division problem into a substitution. Find one zero and you find one factor — instantly, without any long division.'",
        "Mid-lesson: 'Sum of all coefficients = 0? Then x=1 is a zero and (x−1) is a factor. Write it down in two seconds and move to the next step.'",
        "Closing: 'Every cubic must have at least one real zero. The Factor Theorem finds it. Divide it out. You are left with a quadratic — and you already know how to crack those.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     2-E  Algebraic Identities
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch2_algebraic_identities",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Algebraic Identities",
    prerequisite_knowledge: [
      "Expanding brackets: a(b+c) = ab+ac",
      "Squaring binomials: (a+b)² = a²+2ab+b²",
      "Difference of squares: (a+b)(a−b) = a²−b²",
      "Factor Theorem and factorisation basics"
    ],
    key_formulas: [
      "(x+y+z)² = x²+y²+z²+2xy+2yz+2zx",
      "(x+y)³ = x³+3x²y+3xy²+y³ = x³+y³+3xy(x+y)",
      "(x−y)³ = x³−3x²y+3xy²−y³ = x³−y³−3xy(x−y)",
      "x³+y³+z³−3xyz = (x+y+z)(x²+y²+z²−xy−yz−zx)",
      "x³+y³ = (x+y)(x²−xy+y²)",
      "x³−y³ = (x−y)(x²+xy+y²)",
      "Special case: if x+y+z=0, then x³+y³+z³ = 3xyz"
    ],
    teaching_content: {
      intuition: "An algebraic identity is an equation that is true for ALL values of the variables — unlike an equation which is true only for specific values. Identities are shortcuts: instead of multiplying (102)² by hand, recognise it as (100+2)² = 10000+400+4 = 10404. The identities in this chapter are extensions of the basic ones from earlier classes: squares and cubes of binomials, and the powerful three-variable identity (x+y+z)².",
      derivation: "Deriving (x+y)³:\n  (x+y)³ = (x+y)·(x+y)²\n           = (x+y)(x²+2xy+y²)\n           = x³+2x²y+xy² + x²y+2xy²+y³\n           = x³ + 3x²y + 3xy² + y³\n\nDeriving x³+y³+z³−3xyz:\nBy Factor Theorem, setting x+y+z = 0 gives x = −(y+z), so x³ = −(y+z)³.\nSubstitute and simplify carefully:\n  x³+y³+z³−3xyz = (x+y+z)(x²+y²+z²−xy−yz−zx)\nThis can be verified by expanding the right side.",
      worked_example: "(i) Expand (2a+3b)³:\n    = (2a)³ + 3(2a)²(3b) + 3(2a)(3b)² + (3b)³\n    = 8a³ + 3(4a²)(3b) + 3(2a)(9b²) + 27b³\n    = 8a³ + 36a²b + 54ab² + 27b³\n\n(ii) Evaluate 99³ using identity:\n    (100−1)³ = 100³ − 3(100²)(1) + 3(100)(1) − 1\n    = 1000000 − 30000 + 300 − 1 = 970299\n\n(iii) If x+y+z = 6, xy+yz+zx = 11, xyz = 6, find x²+y²+z²:\n    (x+y+z)² = x²+y²+z²+2(xy+yz+zx)\n    36 = x²+y²+z² + 22 → x²+y²+z² = 14\n\n(iv) If x+y+z = 0, find x³+y³+z³:\n    x³+y³+z³ = 3xyz (special case)",
      visual_description: "Draw a cube of side (x+y). The cube can be sliced into 8 smaller rectangular boxes whose volumes sum to (x+y)³. Label the boxes: x³ (corner cube), y³ (opposite corner), three x²y boxes, three xy² boxes. This geometric picture shows why the coefficients 1,3,3,1 appear — Pascal's triangle row 3.",
      svg_diagrams: [
        {
          title: "Pascal's triangle showing coefficients of (x+y)ⁿ expansions",
          svg_code: "<svg viewBox='0 0 300 150' xmlns='http://www.w3.org/2000/svg'><text x='150' y='22' text-anchor='middle' font-size='13' fill='#1565C0' font-weight='bold'>Pascal's Triangle</text><text x='150' y='45' text-anchor='middle' font-size='13' fill='#333'>1</text><text x='150' y='65' text-anchor='middle' font-size='13' fill='#333'>1   1</text><text x='150' y='85' text-anchor='middle' font-size='13' fill='#333'>1   2   1</text><text x='150' y='105' text-anchor='middle' font-size='13' fill='#E91E63' font-weight='bold'>1   3   3   1</text><text x='150' y='125' text-anchor='middle' font-size='13' fill='#333'>1   4   6   4   1</text><text x='5' y='105' font-size='10' fill='#E91E63'>← (x+y)³ coefficients</text></svg>"
        }
      ],
      common_misconceptions: [
        "(x+y+z)² ≠ x²+y²+z². The cross-product terms 2xy+2yz+2zx are missing — a very common error.",
        "(a+b)³ ≠ a³+b³. The expansion has four terms: a³+3a²b+3ab²+b³. Students forget the middle terms.",
        "Confusing x³+y³ = (x+y)(x²−xy+y²) with x³−y³ = (x−y)(x²+xy+y²). The sign of the middle term (xy) flips.",
        "The special case x³+y³+z³ = 3xyz only holds when x+y+z = 0. Do not apply it generally."
      ],
      shortcuts_and_tricks: [
        "For (a±b)³: remember '1 3 3 1' from Pascal's triangle. Signs alternate in (a−b)³: +a³, −3a²b, +3ab², −b³.",
        "Squaring a three-term expression: (x+y+z)² = sum of squares + twice sum of products. List all three pairs (xy, yz, zx) to avoid missing one.",
        "Computing large number cubes: write as (round number ± small number)³ and expand. e.g., 998³ = (1000−2)³.",
        "If x+y+z = 0 appears in any problem, immediately write x³+y³+z³ = 3xyz — it saves significant computation."
      ],
      when_to_use_this_method: "Use these identities to expand expressions quickly (forward direction) or to factorise expressions (reverse direction). Recognise the pattern first: does it look like a perfect cube? A sum of cubes? A three-variable square?",
      edge_cases: [
        "If any variable is 0: (x+0+z)² = x²+z²+2xz = (x+z)² — reduces to simpler identity.",
        "Negative variables: (−a+b)³ = (b−a)³ — rename to apply standard identity.",
        "x³+y³+z³−3xyz when x=y=z: = 3x³−3x³ = 0 = (x+y+z)(x²+y²+z²−xy−yz−zx) = 3x(3x²−3x²) = 0 ✓",
        "The factorisation x²+y²+z²−xy−yz−zx can also be written as ½[(x−y)²+(y−z)²+(z−x)²] — always ≥ 0."
      ],
      key_takeaway: "Seven identities to master: (x+y+z)², (x±y)³, x³±y³ factorisation, x³+y³+z³−3xyz, and the special case x+y+z=0 ⟹ x³+y³+z³=3xyz. Use them in both directions — expanding and factorising. Memorise Pascal's triangle row 3: 1 3 3 1.",
      video_script_hooks: [
        "Opening: 'What is 99³? Without a calculator, in 10 seconds. (100−1)³ = 1000000 − 30000 + 300 − 1 = 970299. That is the power of identities.'",
        "Mid-lesson: '(x+y+z)² — the square of three things. You get three squared terms plus three cross terms, each doubled. Draw it as a 3×3 grid and you'll never forget the six products.'",
        "Closing: 'If x+y+z = 0 appears anywhere in the problem, circle it. You just found x³+y³+z³ = 3xyz for free — no computation needed.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 2: Polynomials…");
  let upserted = 0, skipped = 0;
  for (const t of TOPICS) {
    try {
      await NcertTopicContent.findOneAndUpdate(
        { topicId: t.topicId },
        { $set: t },
        { upsert: true, new: true }
      );
      console.log(`  ✓ ${t.topicId}`);
      upserted++;
    } catch (err) {
      if (err.code === 11000) {
        console.log(`  ↩ ${t.topicId} (already exists, skipped)`);
        skipped++;
      } else {
        throw err;
      }
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}  Total: ${TOPICS.length}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
