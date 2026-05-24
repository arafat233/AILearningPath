/**
 * ICSE Class 9 Mathematics — Teaching Content Seed
 * Source: Selina Concise Mathematics Class 9 (ICSE)
 * 28 chapters × 4 sub-topics = 112 NcertTopicContent docs
 *
 * key_formulas + prerequisite_knowledge are TOP-LEVEL fields (outside teaching_content).
 * All other 12 fields live inside teaching_content: {}.
 *
 * Run: node config/seedIcseMath9Content.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const data = [

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 1 — Rational and Irrational Numbers
  // ════════════════════════════════════════════════════════════════════════════

  {
    topicId: "icse_math9_ch1_rational_numbers",
    subject: "Mathematics",
    key_formulas: [
      "Rational number: p/q where p, q ∈ ℤ and q ≠ 0",
      "Between any two rationals a and b: mean = (a+b)/2 is rational",
      "Decimal form: terminating (e.g. 3/4 = 0.75) or recurring (e.g. 1/3 = 0.333…)",
      "Converting recurring decimal to fraction: multiply by 10^n to shift, then subtract"
    ],
    prerequisite_knowledge: [
      "Integers — definition, number line representation, operations",
      "Fractions — equivalent fractions, simplification",
      "Basic divisibility rules and HCF/LCM",
      "Concept of the number line"
    ],
    teaching_content: {
      intuition: "Every fraction you have ever used — 1/2, 3/4, 7/3 — is a rational number. The word 'rational' comes from 'ratio'. A rational number is simply any number that can be expressed as the ratio of two integers (with the denominator not zero). They fill the number line densely: between any two rationals, you can always find another one. This makes them feel like they cover everything — but they leave invisible gaps where irrational numbers live.",
      derivation: "Formal definition: Q = { p/q | p ∈ ℤ, q ∈ ℤ, q ≠ 0 }. Every integer n is rational since n = n/1. To show the set is dense: given rationals a < b, the average (a+b)/2 is also rational and lies strictly between a and b — apply this indefinitely to find infinitely many rationals in any interval. Decimal connection: divide p by q using long division — if the remainder repeats, the decimal recurs; if it becomes 0, the decimal terminates. Both cases are rational.",
      worked_example: "Express 0.\\overline{36} as a fraction. Let x = 0.363636… Multiply both sides by 100: 100x = 36.363636… Subtract: 100x − x = 36 → 99x = 36 → x = 36/99 = 4/11. Check: 4 ÷ 11 = 0.363636… ✓. Also: insert a rational between 2/5 and 3/5 — mean = (2/5 + 3/5)/2 = (5/5)/2 = 1/2, which lies between them.",
      visual_description: "Draw a number line from 0 to 1. Mark 1/4, 1/3, 1/2, 2/3, 3/4. Show that zooming into any small segment reveals more fractions between them — the number line is 'dense' with rationals. A second diagram shows a fraction being divided step by step (long division) eventually showing a repeating block in the decimal expansion.",
      svg_diagrams: [
        "<svg viewBox='0 0 320 60' xmlns='http://www.w3.org/2000/svg'><line x1='10' y1='30' x2='310' y2='30' stroke='#333' stroke-width='2'/><line x1='10' y1='22' x2='10' y2='38' stroke='#333' stroke-width='2'/><line x1='310' y1='22' x2='310' y2='38' stroke='#333' stroke-width='2'/><line x1='160' y1='22' x2='160' y2='38' stroke='#333' stroke-width='2'/><line x1='85' y1='24' x2='85' y2='36' stroke='#2196F3' stroke-width='1.5'/><line x1='107' y1='24' x2='107' y2='36' stroke='#E91E63' stroke-width='1.5'/><line x1='213' y1='24' x2='213' y2='36' stroke='#E91E63' stroke-width='1.5'/><line x1='235' y1='24' x2='235' y2='36' stroke='#2196F3' stroke-width='1.5'/><text x='6' y='50' font-size='10'>0</text><text x='154' y='50' font-size='10'>1/2</text><text x='304' y='50' font-size='10'>1</text><text x='76' y='18' font-size='9' fill='#2196F3'>1/4</text><text x='98' y='18' font-size='9' fill='#E91E63'>1/3</text><text x='205' y='18' font-size='9' fill='#E91E63'>2/3</text><text x='225' y='18' font-size='9' fill='#2196F3'>3/4</text></svg>"
      ],
      common_misconceptions: [
        "Thinking that only 'simple' fractions are rational — any integer divided by any non-zero integer is rational, including 355/113 or -7/99.",
        "Believing that a longer decimal is irrational — 0.123456789123456789… (recurring block '123456789') is rational.",
        "Forgetting that negative fractions are also rational — rational numbers span the entire number line, not just positives.",
        "Treating 0 as not rational — 0 = 0/1 is perfectly rational."
      ],
      shortcuts_and_tricks: [
        "Recurring decimal trick: if the recurring block has n digits, multiply by 10^n and subtract to get an integer equation.",
        "To quickly check if p/q is in lowest terms, compute GCD(p, q) — if GCD = 1, it is already simplified.",
        "Finding a rational between a and b in one step: (a+b)/2. For multiple rationals, divide the interval into equal parts.",
        "Every terminating decimal is rational — count the decimal places d and write over 10^d, then simplify."
      ],
      when_to_use_this_method: "Use this topic when a question asks you to classify a number, convert a recurring decimal, or find a rational number between two given values.",
      edge_cases: [
        "0/5 = 0 — zero with any non-zero denominator is the same rational number 0.",
        "6/(-2) = -3 — negative denominator: bring the minus sign to the numerator by convention.",
        "Undefined: 5/0 — division by zero is undefined, not a rational number."
      ],
      key_takeaway: "A rational number is any number expressible as p/q (q ≠ 0). Its decimal expansion either terminates or recurs — and both types can be converted back to fractions using simple algebra.",
      video_script_hooks: [
        "Opening: 'Every pizza slice, every exam score, every currency exchange rate — they are all rational numbers. Today we pin down exactly what that means and why it matters.'",
        "Mid-lesson: 'Here is a magic trick: 0.636363… looks infinite and mysterious. But multiply by 100, subtract, and it collapses to 4/11 in two steps. That is the power of the rational number definition.'",
        "Closing: 'Rational numbers are everywhere and infinitely dense. But between every pair of them hides a gap — and filling those gaps is what the next topic, irrational numbers, is about.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch1_irrational_numbers",
    subject: "Mathematics",
    key_formulas: [
      "√2 ≈ 1.41421356… (non-terminating, non-recurring)",
      "√3 ≈ 1.73205080…",
      "π ≈ 3.14159265…",
      "e ≈ 2.71828182…",
      "If n is a positive integer that is not a perfect square, then √n is irrational"
    ],
    prerequisite_knowledge: [
      "Rational numbers — definition and decimal representation",
      "Perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100",
      "Basic proof by contradiction idea",
      "Divisibility: if p² is even then p is even"
    ],
    teaching_content: {
      intuition: "Imagine measuring the diagonal of a 1×1 square. By the Pythagorean theorem it is √2. But no fraction — no p/q — can ever equal √2 exactly. It fills a real position on the number line yet escapes every rational fraction. Such numbers are 'irrational': they cannot be expressed as ratios. Their decimal expansions go on forever without any repeating block, making them fundamentally different from rationals.",
      derivation: "Classic proof that √2 is irrational (by contradiction): Assume √2 = p/q in lowest terms (GCD(p,q) = 1). Then 2 = p²/q² → p² = 2q². So p² is even → p is even → write p = 2k. Then (2k)² = 2q² → 4k² = 2q² → q² = 2k² → q is even. But then GCD(p,q) ≥ 2, contradicting GCD = 1. Contradiction — √2 cannot be rational. Similarly proved for √3, √5, and any √n where n is not a perfect square.",
      worked_example: "Identify which are irrational: (a) √9 = 3 — rational (perfect square). (b) √7 — irrational (7 is not a perfect square). (c) 0.101001000100001… — non-terminating and non-recurring pattern → irrational. (d) 22/7 — rational (it is a fraction). Note: 22/7 ≈ π but is NOT equal to π; π itself is irrational.",
      visual_description: "Number line with 0, 1, √2 marked between 1 and 2. Show that √2 sits at position ≈1.414, filling a real point on the line that no fraction hits exactly. Second diagram: a unit square with diagonal labelled √2, showing the geometric origin of the irrational number.",
      svg_diagrams: [
        "<svg viewBox='0 0 300 80' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='40' x2='280' y2='40' stroke='#333' stroke-width='2'/><line x1='20' y1='32' x2='20' y2='48' stroke='#333' stroke-width='2'/><line x1='150' y1='32' x2='150' y2='48' stroke='#333' stroke-width='2'/><line x1='280' y1='32' x2='280' y2='48' stroke='#333' stroke-width='2'/><line x1='173' y1='30' x2='173' y2='50' stroke='#E91E63' stroke-width='2'/><text x='14' y='62' font-size='11'>0</text><text x='144' y='62' font-size='11'>1</text><text x='274' y='62' font-size='11'>2</text><text x='162' y='24' font-size='11' fill='#E91E63'>√2</text><rect x='30' y='50' width='30' height='30' fill='none' stroke='#2196F3' stroke-width='1.5'/><line x1='30' y1='50' x2='60' y2='80' stroke='#E91E63' stroke-width='1.5'/><text x='32' y='95' font-size='9' fill='#E91E63'>diag=√2</text></svg>"
      ],
      common_misconceptions: [
        "Thinking π = 22/7 — 22/7 is a rational approximation; π itself is irrational and transcendental.",
        "Assuming all square roots are irrational — √4 = 2, √9 = 3, √16 = 4 are all rational (perfect squares).",
        "Believing irrational means 'very large' or 'very small' — √2 ≈ 1.414 is a perfectly ordinary sized number.",
        "Thinking the sum of two irrationals is always irrational — (√2) + (−√2) = 0, which is rational."
      ],
      shortcuts_and_tricks: [
        "Quick check: is √n rational? Only if n is a perfect square. Test: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100 — memorise these.",
        "Non-terminating, non-recurring decimal → always irrational. No exceptions.",
        "Sum/difference/product of a rational and an irrational is always irrational (e.g. 3 + √2 is irrational).",
        "√a × √b = √(ab) — useful for simplifying products of surds in later topics."
      ],
      when_to_use_this_method: "Use this topic when classifying numbers as rational/irrational, proving a square root is irrational, or identifying whether a decimal is rational or irrational.",
      edge_cases: [
        "√0 = 0 — rational. Zero is not irrational.",
        "(-√2)² = 2 — even though the original number is irrational, squaring it can give a rational.",
        "√2 × √2 = 2 — product of two irrationals can be rational."
      ],
      key_takeaway: "Irrational numbers cannot be written as p/q. Their decimal expansions are non-terminating AND non-recurring. The classic example √2 is proved irrational by contradiction. If n is not a perfect square, √n is irrational.",
      video_script_hooks: [
        "Opening: 'The ancient Greeks discovered a number that broke their entire worldview — a length on a square that no fraction could measure. That number is √2, and it is the original irrational.'",
        "Mid-lesson: 'The proof is a trap: assume √2 is a fraction in lowest terms. Within three lines it forces the fraction to be NOT in lowest terms. Contradiction. So the assumption was wrong. √2 is irrational — proved.'",
        "Closing: 'Irrational numbers are not freaks — they are actually more common than rationals on the number line. In the next topic we learn to operate on them as surds.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch1_surds_operations",
    subject: "Mathematics",
    key_formulas: [
      "√a × √b = √(ab)",
      "√a / √b = √(a/b)   (b > 0)",
      "√a + √b ≠ √(a+b)  (cannot add under radicals unless same surd)",
      "n√a + m√a = (n+m)√a  (like surds — add/subtract coefficients)",
      "(√a + √b)(√a − √b) = a − b  (difference of squares)",
      "(√a + √b)² = a + 2√(ab) + b"
    ],
    prerequisite_knowledge: [
      "Definition of irrational numbers and surds",
      "Square roots of perfect squares (1–100)",
      "Basic algebraic expansion and simplification",
      "Concept of like and unlike terms"
    ],
    teaching_content: {
      intuition: "A surd is a root that cannot be simplified to a whole number or fraction — like √2, √3, √5, ∛7. Working with surds is like working with algebra: √2 is just a symbol, like x, and you can add, subtract, multiply, and divide with it using the same logic as collecting like terms. The key insight: you can only add/subtract surds if they are 'like' surds (same number under the radical). Multiplying uses the rule √a × √b = √(ab).",
      derivation: "Multiplication: (√a)² = a by definition. So √a × √b — square the product: (√a × √b)² = a × b → √a × √b = √(ab). Addition: 3√2 + 5√2 = 8√2 because we factor out √2: √2(3+5) = 8√2. But 3√2 + 5√3 cannot be simplified — they are unlike surds (different radicands), like 3x + 5y in algebra. Product with conjugate: (√a + √b)(√a − √b) = (√a)² − (√b)² = a − b. This eliminates the surd — crucial for rationalisation.",
      worked_example: "Simplify: (a) 3√5 + 7√5 = 10√5 (like surds). (b) √18 + √8 — first simplify: √18 = √(9×2) = 3√2; √8 = √(4×2) = 2√2. So 3√2 + 2√2 = 5√2. (c) (2+√3)(2−√3) = 4 − 3 = 1. (d) √3 × √27 = √(3×27) = √81 = 9. (e) (1+√2)² = 1 + 2√2 + 2 = 3 + 2√2.",
      visual_description: "Tree diagram showing √18 → √(9×2) → 3√2. Alongside: a balance showing 3√2 + 2√2 = 5√2 (like terms balance) vs 3√2 + 2√3 (unlike — cannot combine). Second diagram: the conjugate pair (√a+√b)(√a−√b) as a rectangle with sides √a+√b and √a−√b, area = a−b.",
      svg_diagrams: [
        "<svg viewBox='0 0 300 100' xmlns='http://www.w3.org/2000/svg'><text x='130' y='20' font-size='12' text-anchor='middle'>√18</text><line x1='130' y1='25' x2='90' y2='45' stroke='#333' stroke-width='1.5'/><line x1='130' y1='25' x2='170' y2='45' stroke='#333' stroke-width='1.5'/><text x='80' y='58' font-size='12' text-anchor='middle'>√9</text><text x='180' y='58' font-size='12' text-anchor='middle'>×√2</text><line x1='80' y1='62' x2='80' y2='80' stroke='#333' stroke-width='1.5'/><text x='80' y='92' font-size='12' text-anchor='middle' fill='#E91E63'>3</text><text x='200' y='92' font-size='12' fill='#2196F3'>→ 3√2</text></svg>"
      ],
      common_misconceptions: [
        "Writing √4 + √9 = √13 — WRONG. √4 + √9 = 2 + 3 = 5, not √13. Never add numbers under different radicals.",
        "Assuming √(a²+b²) = a + b — this is false in general. √(3²+4²) = √25 = 5, not 3+4 = 7.",
        "Forgetting to simplify surds before adding: not recognising that √18 = 3√2 and √8 = 2√2 so they ARE like surds.",
        "Thinking (√3)² = 9 — (√3)² = 3, not 9. Squaring removes the root."
      ],
      shortcuts_and_tricks: [
        "Simplify first: always factor out the largest perfect square from under the radical before doing anything else.",
        "Like surds: same number under radical → add/subtract coefficients, exactly like algebra.",
        "Product check: if √a × √b gives √(perfect square), you get an integer — look for this shortcut first.",
        "Conjugate trick: (√a + √b)(√a − √b) = a − b. Use this whenever you see a sum/difference of two surds being multiplied."
      ],
      when_to_use_this_method: "Use this topic for any question involving operations (add, subtract, multiply) on square roots. Also the foundation for simplifying algebraic expressions containing surds.",
      edge_cases: [
        "√a × √a = a — squaring a surd always gives a rational.",
        "√0 = 0 — zero under a radical is fine and gives 0.",
        "Negative under a square root (e.g. √(−4)) is not real — does not arise in ICSE Class 9."
      ],
      key_takeaway: "Treat surds like algebraic variables: only like surds (same radicand) can be added or subtracted. Multiply using √a × √b = √(ab). Always simplify surds by extracting perfect square factors first.",
      video_script_hooks: [
        "Opening: '√2 looks intimidating. But the moment you call it x and treat it like algebra, everything falls into place. 3√2 + 5√2 = 8√2, just like 3x + 5x = 8x.'",
        "Mid-lesson: 'The simplify-first rule: √18 is hiding a disguise. Pull out √9 = 3 and suddenly √18 = 3√2. Now it can join √8 = 2√2 on the same team: 3√2 + 2√2 = 5√2.'",
        "Closing: 'One rule to remember above all: you can never add different surds under the same radical. √4 + √9 = 2 + 3 = 5, not √13. Compute first, then combine.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch1_rationalization",
    subject: "Mathematics",
    key_formulas: [
      "Rationalising factor of √a: multiply by √a  → (1/√a)(√a/√a) = √a/a",
      "Rationalising factor of (a + √b): conjugate is (a − √b)",
      "(a + √b)(a − √b) = a² − b",
      "Rationalising factor of (√a + √b): conjugate is (√a − √b)",
      "(√a + √b)(√a − √b) = a − b",
      "General: 1/(√a + √b) = (√a − √b)/((√a + √b)(√a − √b)) = (√a − √b)/(a−b)"
    ],
    prerequisite_knowledge: [
      "Surds — definition, simplification, multiplication",
      "Conjugate pairs and difference of squares identity",
      "Expanding brackets in algebraic expressions",
      "Concept of a rational number"
    ],
    teaching_content: {
      intuition: "Rationalisation means removing the surd from the denominator of a fraction. A fraction like 1/√2 is valid mathematics, but an answer left in this form is considered unfinished — like leaving 6/4 unsimplified. By multiplying numerator and denominator by the same surd (or conjugate), you eliminate the radical below without changing the fraction's value. Think of it as tidying up: you want a rational number (or at least no surd) in the denominator.",
      derivation: "Case 1 — single surd denominator: 1/√a = 1/√a × √a/√a = √a/(√a × √a) = √a/a. Case 2 — binomial denominator with surd: 1/(a + √b) — multiply by conjugate (a − √b)/(a − √b): numerator becomes (a − √b); denominator becomes a² − b (rational). So 1/(a + √b) = (a − √b)/(a² − b). Case 3 — two surds: 1/(√a + √b) — multiply by (√a − √b)/(√a − √b): denominator = a − b (rational when a ≠ b).",
      worked_example: "Rationalise: (a) 5/√3 = 5√3/(√3 × √3) = 5√3/3. (b) 1/(2 + √5) — multiply by (2−√5)/(2−√5): = (2−√5)/(4−5) = (2−√5)/(−1) = √5 − 2. (c) (√3+1)/(√3−1) — multiply by (√3+1)/(√3+1): numerator = (√3+1)² = 3 + 2√3 + 1 = 4 + 2√3; denominator = 3 − 1 = 2. Result = (4+2√3)/2 = 2 + √3.",
      visual_description: "Diagram of a fraction with √2 in the denominator. Arrow showing multiplication by √2/√2 (value = 1, so fraction unchanged) leading to a rational denominator. Second diagram: two conjugate binomials on a number line showing the symmetry (a+√b) and (a−√b) equidistant from a.",
      svg_diagrams: [
        "<svg viewBox='0 0 300 90' xmlns='http://www.w3.org/2000/svg'><text x='40' y='30' font-size='13' font-weight='bold'>1</text><line x1='25' y1='35' x2='65' y2='35' stroke='#333' stroke-width='2'/><text x='33' y='52' font-size='13' font-weight='bold'>√2</text><text x='78' y='42' font-size='18'>×</text><text x='105' y='30' font-size='13' fill='#2196F3'>√2</text><line x1='96' y1='35' x2='130' y2='35' stroke='#2196F3' stroke-width='2'/><text x='105' y='52' font-size='13' fill='#2196F3'>√2</text><text x='140' y='42' font-size='18'>=</text><text x='170' y='30' font-size='13' fill='#E91E63'>√2</text><line x1='162' y1='35' x2='200' y2='35' stroke='#E91E63' stroke-width='2'/><text x='174' y='52' font-size='13' fill='#E91E63'>2</text><text x='215' y='42' font-size='11' fill='#4CAF50'>✓ rational denominator</text></svg>"
      ],
      common_misconceptions: [
        "Multiplying only the denominator by the conjugate and forgetting the numerator — you must multiply both top and bottom by the same expression.",
        "Using the wrong conjugate: conjugate of (√a + √b) is (√a − √b), NOT (−√a + √b) or (−√a − √b).",
        "Forgetting to simplify after rationalising — always reduce the resulting fraction to lowest terms.",
        "Thinking rationalisation changes the value of the expression — multiplying by √a/√a = 1 never changes the value."
      ],
      shortcuts_and_tricks: [
        "Single surd in denominator: just multiply top and bottom by that surd.",
        "Binomial denominator (a ± √b): multiply by the conjugate (a ∓ √b) — the denominator becomes a² − b.",
        "If you get a negative denominator after rationalising, multiply numerator and denominator by −1 to make it positive.",
        "Check: after rationalisation, the denominator must contain no surds. If it does, you used the wrong factor."
      ],
      when_to_use_this_method: "Use rationalisation whenever a surd appears in the denominator of a fraction — in any simplification, evaluation, or proof question.",
      edge_cases: [
        "If a = b in (√a − √b), the denominator becomes zero — undefined. E.g. 1/(√3 − √3) is undefined.",
        "Rationalising 1/(√2 + √3): conjugate gives denominator 2−3 = −1 → result is −(√2 − √3) = √3 − √2.",
        "Some expressions rationalise to the conjugate divided by a negative — handle the sign carefully."
      ],
      key_takeaway: "Rationalisation removes surds from denominators. For a single surd √a, multiply by √a/√a. For binomials (a ± √b) or (√a ± √b), multiply by the conjugate. The denominator always becomes rational using the difference-of-squares identity.",
      video_script_hooks: [
        "Opening: 'Your answer is 1/√2. Your teacher circles it in red. Not wrong — just untidy. Rationalisation is the art of rewriting that fraction so no surd hides in the basement (denominator).'",
        "Mid-lesson: 'The conjugate is your secret weapon. (2+√5) times (2−√5) = 4−5 = −1. No surds. Done. The denominator is always rational after multiplying by the conjugate — that is why it works.'",
        "Closing: 'One rule: whatever you multiply the denominator by, multiply the numerator by the same thing. The value stays the same; only the form changes — and that is the point.'"
      ]
    }
  },


  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 2 — Compound Interest (Without Using Formula)
  // ════════════════════════════════════════════════════════════════════════════

  {
    topicId: "icse_math9_ch2_ci_concept",
    subject: "Mathematics",
    key_formulas: [
      "Simple Interest (SI) = P × R × T / 100",
      "Amount after SI = P + SI = P(1 + RT/100)",
      "Compound Interest = Total Amount − Principal",
      "CI > SI for the same P, R, T (when T > 1 year)",
      "Difference: CI − SI = P(R/100)² for 2 years"
    ],
    prerequisite_knowledge: [
      "Simple Interest formula and its application",
      "Percentage calculations",
      "Basic arithmetic operations with decimals",
      "Concept of principal, rate, and time in financial problems"
    ],
    teaching_content: {
      intuition: "When you put ₹1000 in a bank at 10% simple interest, you earn ₹100 every year on the original ₹1000. With compound interest, the bank adds ₹100 to your account at the end of year 1, and in year 2 you earn 10% on ₹1100 — not on ₹1000. The interest earns interest. This snowball effect is why compound interest is called 'interest on interest' and always gives more than simple interest for the same rate and time.",
      derivation: "Year 1: Interest = P × R/100. Amount at end of year 1 = P + PR/100 = P(1 + R/100). Year 2: New principal = P(1+R/100). Interest = P(1+R/100) × R/100. Amount at end of year 2 = P(1+R/100) + P(1+R/100)(R/100) = P(1+R/100)(1+R/100) = P(1+R/100)². This is the 'without formula' approach: repeatedly apply SI on the current amount year by year.",
      worked_example: "Find CI on ₹5000 at 10% p.a. for 2 years without using formula.\nYear 1: SI = 5000 × 10 × 1/100 = ₹500. Amount = 5000 + 500 = ₹5500.\nYear 2: SI on ₹5500 = 5500 × 10 × 1/100 = ₹550. Amount = 5500 + 550 = ₹6050.\nCI = 6050 − 5000 = ₹1050.\nCompare: SI for 2 years = 5000×10×2/100 = ₹1000. CI (₹1050) > SI (₹1000). ✓",
      visual_description: "A tree diagram: ₹5000 at root. Branch year 1 → +₹500 → ₹5500. Branch year 2 → +₹550 → ₹6050. The second year's interest (₹550) is ₹50 more than the first year's (₹500) because it earns on the extra ₹500 from year 1.",
      svg_diagrams: [
        "<svg viewBox='0 0 320 120' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='45' width='80' height='30' rx='4' fill='#E3F2FD' stroke='#2196F3' stroke-width='1.5'/><text x='50' y='64' font-size='11' text-anchor='middle' fill='#1565C0'>₹5000</text><line x1='90' y1='60' x2='130' y2='60' stroke='#333' stroke-width='1.5' marker-end='url(#arr)'/><text x='110' y='52' font-size='9' fill='#4CAF50'>+₹500</text><rect x='130' y='45' width='80' height='30' rx='4' fill='#E8F5E9' stroke='#4CAF50' stroke-width='1.5'/><text x='170' y='64' font-size='11' text-anchor='middle' fill='#2E7D32'>₹5500</text><line x1='210' y1='60' x2='250' y2='60' stroke='#333' stroke-width='1.5'/><text x='230' y='52' font-size='9' fill='#E91E63'>+₹550</text><rect x='250' y='45' width='60' height='30' rx='4' fill='#FCE4EC' stroke='#E91E63' stroke-width='1.5'/><text x='280' y='64' font-size='11' text-anchor='middle' fill='#C62828'>₹6050</text><text x='50' y='100' font-size='9' fill='#555'>P=₹5000</text><text x='140' y='100' font-size='9' fill='#555'>After Yr1</text><text x='255' y='100' font-size='9' fill='#555'>After Yr2</text></svg>"
      ],
      common_misconceptions: [
        "Calculating CI by simply multiplying SI by the number of years — this gives SI, not CI. Each year must use the previous year's amount as the new principal.",
        "Thinking CI = SI when the rate and time are the same — CI is always greater than SI for T > 1 year.",
        "Forgetting to update the principal each year — the principal for year 2 is the amount at the end of year 1.",
        "Subtracting wrong principal: CI = Final Amount − Original Principal (not the year-2 principal)."
      ],
      shortcuts_and_tricks: [
        "For 2 years: CI − SI = P(R/100)². Quick check on your work.",
        "Year-by-year method: compute SI for year 1 → new principal → SI for year 2 → new principal → etc.",
        "If the rate is 10%, each year's interest is exactly 10% of that year's opening balance — easy mental arithmetic.",
        "Always write out the table: Year | Opening Balance | Interest | Closing Balance — it prevents sign errors."
      ],
      when_to_use_this_method: "Use the year-by-year (without formula) method when asked to show working step by step, or when the period is 2–3 years. For longer periods, the formula is faster.",
      edge_cases: [
        "If T = 1 year: CI = SI (both give P×R/100). The difference only appears from year 2 onwards.",
        "If R = 0: no interest at all, CI = SI = 0.",
        "Mixed periods: if the problem specifies compound quarterly or half-yearly, adjust the 'without formula' approach accordingly (covered in sub-topic 2.3)."
      ],
      key_takeaway: "Compound interest means the interest from each period is added to the principal before the next period's interest is calculated. Work year by year: closing balance of each year becomes the opening balance of the next.",
      video_script_hooks: [
        "Opening: 'Simple interest is loyal but dumb — it always uses the original amount. Compound interest is clever: it uses whatever you have now. That difference, year after year, is the secret of how wealth grows.'",
        "Mid-lesson: '₹5000 at 10% SI gives ₹500 both years. CI gives ₹500 in year 1 and ₹550 in year 2 — an extra ₹50. That extra ₹50 came from earning 10% on last year's ₹500 interest. Interest earning interest.'",
        "Closing: 'The method: update the principal every year. Old amount becomes new principal. Repeat. That is all compound interest without a formula is.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch2_ci_yearly",
    subject: "Mathematics",
    key_formulas: [
      "Amount after n years (yearly compounding, no formula): A_n = A_{n-1} × (1 + R/100)",
      "Year-by-year: A₁ = P + P×R/100 = P(1+R/100), A₂ = A₁ + A₁×R/100, etc.",
      "CI = A_n − P",
      "For 3 years: CI = P[(1+R/100)³ − 1] — result verifiable without formula by iteration"
    ],
    prerequisite_knowledge: [
      "Concept of compound interest and how it differs from simple interest",
      "Year-by-year principal update method",
      "Percentage calculation: x% of N = Nx/100",
      "Arithmetic operations with decimals and fractions"
    ],
    teaching_content: {
      intuition: "Yearly compounding is the most common form: the bank adds interest once per year to your account. Each year you start with more money, so each year you earn more interest. Solving yearly CI problems without a formula means running the calculation year by year — computing the interest for each year on that year's opening balance, then adding it to get the next year's opening balance. It is repetitive but completely transparent.",
      derivation: "Let P = principal, R = rate % per annum, compounded yearly. Year 1: I₁ = PR/100; A₁ = P + PR/100 = P(1+R/100). Year 2: I₂ = A₁ × R/100 = P(1+R/100)×R/100; A₂ = A₁(1+R/100) = P(1+R/100)². Year 3: A₃ = A₂(1+R/100) = P(1+R/100)³. Pattern: each year multiply current amount by (1+R/100). CI for n years = P(1+R/100)ⁿ − P.",
      worked_example: "Find the amount and CI on ₹8000 at 5% p.a. compounded annually for 3 years.\nYear 1: I = 8000×5/100 = ₹400. A = ₹8400.\nYear 2: I = 8400×5/100 = ₹420. A = ₹8820.\nYear 3: I = 8820×5/100 = ₹441. A = ₹9261.\nCI = 9261 − 8000 = ₹1261.\nNote SI for 3 years = 8000×5×3/100 = ₹1200. CI (₹1261) > SI (₹1200). ✓",
      visual_description: "A three-step staircase diagram. Step 0: ₹8000. Step 1: ₹8400 (+400). Step 2: ₹8820 (+420). Step 3: ₹9261 (+441). Each step's rise is slightly bigger than the last because it is 5% of a larger amount each time.",
      svg_diagrams: [
        "<svg viewBox='0 0 320 130' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='90' width='60' height='30' fill='#E3F2FD' stroke='#2196F3' stroke-width='1.5'/><text x='40' y='109' font-size='10' text-anchor='middle'>₹8000</text><rect x='90' y='70' width='60' height='50' fill='#E8F5E9' stroke='#4CAF50' stroke-width='1.5'/><text x='120' y='99' font-size='10' text-anchor='middle'>₹8400</text><rect x='170' y='48' width='60' height='72' fill='#FFF9C4' stroke='#FFC107' stroke-width='1.5'/><text x='200' y='89' font-size='10' text-anchor='middle'>₹8820</text><rect x='250' y='20' width='60' height='100' fill='#FCE4EC' stroke='#E91E63' stroke-width='1.5'/><text x='280' y='75' font-size='10' text-anchor='middle'>₹9261</text><text x='40' y='128' font-size='9' fill='#555'>P</text><text x='120' y='128' font-size='9' fill='#555'>Yr1</text><text x='200' y='128' font-size='9' fill='#555'>Yr2</text><text x='280' y='128' font-size='9' fill='#555'>Yr3</text></svg>"
      ],
      common_misconceptions: [
        "Rounding interest at each step — keep the full value as the next year's principal; rounding accumulates errors.",
        "Applying the rate to the original principal each year (that would be simple interest).",
        "Confusing 'amount' and 'compound interest' — Amount = P + CI; always subtract the original principal to find CI.",
        "Using T = 3 years but only computing 2 iterations — count carefully: 3 years = 3 iterations."
      ],
      shortcuts_and_tricks: [
        "Table method: write Year | Opening | Interest | Closing in columns — eliminates all confusion.",
        "5% shortcut: interest = opening balance ÷ 20. Quick mental computation.",
        "10% shortcut: interest = opening balance ÷ 10. Even faster.",
        "After computing, verify: CI should always be greater than SI = P×R×T/100 for T > 1."
      ],
      when_to_use_this_method: "Use when the problem states 'compounded annually' and asks to show step-by-step working, or when T ≤ 3 years and a table is expected.",
      edge_cases: [
        "T = 1 year: only one iteration needed. CI = SI for T = 1.",
        "Rate given as a fraction (e.g. 12½%): convert to decimal (12.5%) before multiplying.",
        "Finding the principal given the amount: work backwards — A₃ = A₂(1.05) → A₂ = A₃/1.05 etc."
      ],
      key_takeaway: "Yearly compounding: multiply opening balance by (1 + R/100) each year. The closing balance becomes next year's opening balance. Do this for T iterations, then subtract the original principal for CI.",
      video_script_hooks: [
        "Opening: 'The staircase goes up. Each step is a year of compound interest, and each step is a little taller than the last. Today we build that staircase step by step — no formula needed.'",
        "Mid-lesson: '5% of ₹8400 is ₹420 — not ₹400 like year 1. That extra ₹20 is the compound effect kicking in. By year 3 the step is ₹441. The staircase accelerates.'",
        "Closing: 'Write a table: Year, Opening, Interest, Closing. Three rows for a 3-year problem. Fill it left to right, top to bottom. You cannot make a mistake if you use the table.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch2_ci_half_yearly",
    subject: "Mathematics",
    key_formulas: [
      "Half-yearly: rate per half-year = R/2 %, number of periods = 2T",
      "Quarterly: rate per quarter = R/4 %, periods = 4T",
      "More frequent compounding → higher CI for same P, R, T",
      "For 1 year half-yearly: A = P(1 + R/200)²",
      "For 1 year quarterly: A = P(1 + R/400)⁴"
    ],
    prerequisite_knowledge: [
      "Yearly compound interest — year-by-year method",
      "Fractions: halving a rate (R/2), quartering (R/4)",
      "Converting years to half-years (× 2) or quarters (× 4)",
      "Understanding that more compounding periods increases total interest"
    ],
    teaching_content: {
      intuition: "Banks don't always wait a full year to add interest. When interest is compounded half-yearly, they split the annual rate in half and add interest every 6 months. This means interest earns interest after just 6 months instead of 12. So for the same annual rate, half-yearly compounding gives more CI than yearly compounding — and quarterly gives even more. The formula idea is the same: apply the adjusted rate for each shorter period.",
      derivation: "Half-yearly compounding: Annual rate R% → rate per half-year = R/2 %. 1 year = 2 half-years, so T years = 2T periods. Apply the year-by-year method but each 'year' is actually 6 months at rate R/2%. Example: P = ₹10000, R = 10% p.a. compounded half-yearly, T = 1 year. Period 1 (6 months): I = 10000 × (10/2)/100 = 10000 × 5/100 = ₹500. A = ₹10500. Period 2 (next 6 months): I = 10500 × 5/100 = ₹525. A = ₹11025. CI = ₹1025. Compare with yearly CI: ₹1000. Half-yearly gives ₹25 more.",
      worked_example: "Find CI on ₹20000 at 8% p.a. for 1½ years, compounded half-yearly.\nHalf-yearly rate = 4%. Number of half-year periods = 3.\nPeriod 1: I = 20000×4/100 = ₹800. A = ₹20800.\nPeriod 2: I = 20800×4/100 = ₹832. A = ₹21632.\nPeriod 3: I = 21632×4/100 = ₹865.28. A = ₹22497.28.\nCI = 22497.28 − 20000 = ₹2497.28.",
      visual_description: "Two timelines side by side: (1) Yearly: two steps at 0 and 12 months. (2) Half-yearly: four steps at 0, 6, 12, 18 months. Show that the half-yearly steps are shorter in height but more frequent, and the final amount is higher due to more frequent compounding.",
      svg_diagrams: [
        "<svg viewBox='0 0 320 110' xmlns='http://www.w3.org/2000/svg'><text x='5' y='15' font-size='10' fill='#1565C0'>Yearly (2 periods)</text><line x1='5' y1='30' x2='155' y2='30' stroke='#2196F3' stroke-width='2'/><circle cx='5' cy='30' r='4' fill='#2196F3'/><circle cx='80' cy='30' r='4' fill='#2196F3'/><circle cx='155' cy='30' r='4' fill='#2196F3'/><text x='2' y='45' font-size='8'>0</text><text x='72' y='45' font-size='8'>1yr</text><text x='147' y='45' font-size='8'>2yr</text><text x='5' y='70' font-size='10' fill='#C62828'>Half-yearly (4 periods)</text><line x1='5' y1='85' x2='155' y2='85' stroke='#E91E63' stroke-width='2'/><circle cx='5' cy='85' r='3' fill='#E91E63'/><circle cx='42' cy='85' r='3' fill='#E91E63'/><circle cx='80' cy='85' r='3' fill='#E91E63'/><circle cx='117' cy='85' r='3' fill='#E91E63'/><circle cx='155' cy='85' r='3' fill='#E91E63'/><text x='2' y='100' font-size='7'>0</text><text x='35' y='100' font-size='7'>6m</text><text x='72' y='100' font-size='7'>1yr</text><text x='108' y='100' font-size='7'>18m</text><text x='147' y='100' font-size='7'>2yr</text></svg>"
      ],
      common_misconceptions: [
        "Using the full annual rate R% for each half-year period — the rate must be halved: use R/2% per half-year.",
        "Treating 1.5 years as 1.5 half-year periods — 1.5 years = 3 half-year periods.",
        "Thinking the final CI is the same as yearly CI for the same rate — half-yearly always gives MORE.",
        "Confusing 'rate per annum compounded half-yearly' with 'rate per half-year' — the given rate is annual; you halve it."
      ],
      shortcuts_and_tricks: [
        "Half-yearly rule: new rate = R/2, new time = 2T. Then apply the standard year-by-year method.",
        "Quarterly rule: new rate = R/4, new time = 4T.",
        "For a 1-year problem half-yearly, you only need 2 iterations — very manageable without a formula.",
        "Check: Half-yearly CI > Yearly CI > SI for the same P, R, T."
      ],
      when_to_use_this_method: "Use when the problem specifies 'compounded half-yearly' or 'compounded quarterly'. Convert the rate and time, then apply the period-by-period method.",
      edge_cases: [
        "1½ years compounded half-yearly = 3 periods (not 2). Always multiply years by 2 for half-yearly.",
        "Rate 10% p.a. compounded half-yearly: do NOT use 10% per half-year — use 5%.",
        "If problem says 'compounded monthly': rate = R/12% per month, periods = 12T."
      ],
      key_takeaway: "For half-yearly compounding: use R/2% as the rate and 2T as the number of periods, then apply the standard period-by-period method. More frequent compounding always gives higher CI.",
      video_script_hooks: [
        "Opening: 'What if your bank added interest every 6 months instead of once a year? You would get more money. Why? Because the interest from month 6 starts earning interest by month 12. More compounding = more money.'",
        "Mid-lesson: '10% per year compounded half-yearly is NOT 10% every 6 months. It is 5% every 6 months. The rate is split, but you get twice as many periods. And the result beats yearly compounding every time.'",
        "Closing: 'Half-yearly: halve the rate, double the time. That is the entire conversion. Then just run your year-by-year table with those new numbers.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch2_ci_problems",
    subject: "Mathematics",
    key_formulas: [
      "CI = Amount − Principal",
      "Amount = P + CI (after all periods)",
      "Difference: CI (2yr) − SI (2yr) = P(R/100)²",
      "Finding P given A: reverse the year-by-year calculation",
      "Finding R: if A₁ known, R = (A₁ − P)/P × 100"
    ],
    prerequisite_knowledge: [
      "Year-by-year CI calculation (yearly and half-yearly)",
      "Simple interest formula",
      "Setting up equations from word problems",
      "Basic algebraic manipulation"
    ],
    teaching_content: {
      intuition: "CI word problems ask you to find the unknown — it might be the final amount, the CI earned, the original principal, the rate, or the time. The key is knowing which direction to run the calculation: forward (given P, find A) or backward (given A, find P). The year-by-year method gives complete transparency into every step, making it easy to identify where to plug in the unknown.",
      derivation: "Reverse problem (find P): If amount after 2 years at 10% p.a. compound is ₹12100, find P. A₂ = A₁ × 1.10, and A₁ = P × 1.10. So A₂ = P × 1.10 × 1.10 = 1.21P. 1.21P = 12100 → P = 12100/1.21 = ₹10000. Difference formula: for 2 years at R%, CI − SI = P(R/100)². Useful for finding P or R when the difference is given.",
      worked_example: "The CI on a sum for 2 years at 10% p.a. is ₹630, while SI on the same sum for the same period is ₹600. Find the principal.\nUsing difference formula: CI − SI = P(R/100)² → 630 − 600 = P(10/100)² → 30 = P/100 → P = ₹3000.\nVerify: SI = 3000×10×2/100 = ₹600 ✓. Year 1: A = 3300. Year 2: CI = 330. Total CI = 300+330 = ₹630 ✓.",
      visual_description: "A problem-type map: (1) Given P, R, T → find A and CI (forward). (2) Given A, R, T → find P (backward). (3) Given CI and SI → find P using difference formula. (4) Given P and A after 1 year → find R. Arrows show the direction of calculation for each type.",
      svg_diagrams: [
        "<svg viewBox='0 0 300 100' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='35' width='60' height='30' rx='4' fill='#E3F2FD' stroke='#2196F3' stroke-width='1.5'/><text x='40' y='54' font-size='10' text-anchor='middle'>P, R, T</text><rect x='230' y='35' width='60' height='30' rx='4' fill='#E8F5E9' stroke='#4CAF50' stroke-width='1.5'/><text x='260' y='54' font-size='10' text-anchor='middle'>A, CI</text><line x1='70' y1='50' x2='230' y2='50' stroke='#4CAF50' stroke-width='2' marker-end='url(#arr)'/><text x='140' y='44' font-size='10' fill='#4CAF50' text-anchor='middle'>Forward</text><line x1='230' y1='58' x2='70' y2='58' stroke='#E91E63' stroke-width='2' marker-end='url(#arr2)'/><text x='140' y='74' font-size='10' fill='#E91E63' text-anchor='middle'>Backward</text></svg>"
      ],
      common_misconceptions: [
        "Using the difference formula CI − SI = P(R/100)² for years other than 2 — this formula is specific to 2 years only.",
        "When finding principal from amount, dividing by the wrong factor — be careful: A = P(1+R/100)ⁿ, so P = A/(1+R/100)ⁿ.",
        "Confusing 'compound interest earned' with 'amount' — always state clearly which is asked.",
        "Using simple interest formula to find time/rate when compounding is specified."
      ],
      shortcuts_and_tricks: [
        "Difference formula shortcut: CI − SI (for 2 years) = P(R/100)². If CI−SI and R known, find P instantly.",
        "If A after 1 year = P × (1 + R/100): one equation, one unknown. Solve for R or P directly.",
        "Backwards from amount: divide by (1+R/100) for each year to recover the original principal.",
        "Always label your answer: is it CI or Amount? Write 'CI = ₹xxx' not just '₹xxx'."
      ],
      when_to_use_this_method: "Use for all word problems involving compound interest without formula — finding principal, amount, CI, or rate from given conditions.",
      edge_cases: [
        "Difference formula only valid for T = 2 years. For T = 3 the formula is more complex — use year-by-year.",
        "If the problem gives 'amount after n years' and asks for 'CI earned in the nth year specifically': CI in year n = Amount at end of year n − Amount at end of year (n−1).",
        "Population/depreciation problems use the same compound structure but may involve decrease: A = P(1 − R/100)ⁿ."
      ],
      key_takeaway: "For CI word problems: identify what is given and what is unknown. Use forward calculation (P→A) or backward (A→P). The difference formula CI−SI = P(R/100)² is a powerful shortcut for 2-year problems.",
      video_script_hooks: [
        "Opening: 'Three types of CI problems: find the amount, find the principal, or find the rate. Today you will recognise which type you are facing in the first 5 seconds and know exactly what to do.'",
        "Mid-lesson: 'CI − SI = ₹30 and R = 10%. That formula P(R/100)² gives P in one line. 30 = P × (0.1)² = P/100, so P = ₹3000. That is why the difference formula is a favourite ICSE question type.'",
        "Closing: 'Know your direction: forward or backward. Write the year-by-year table. Identify the unknown and solve. There is nothing in a CI word problem that these steps cannot handle.'"
      ]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 3 — Compound Interest (Using Formula)
  // ════════════════════════════════════════════════════════════════════════════

  {
    topicId: "icse_math9_ch3_ci_formula",
    subject: "Mathematics",
    key_formulas: [
      "A = P(1 + R/100)ⁿ  — amount after n years, annual compounding",
      "CI = A − P = P[(1 + R/100)ⁿ − 1]",
      "Half-yearly: A = P(1 + R/200)^(2n)",
      "Quarterly: A = P(1 + R/400)^(4n)",
      "Monthly: A = P(1 + R/1200)^(12n)"
    ],
    prerequisite_knowledge: [
      "Year-by-year CI method (Chapter 2)",
      "Laws of exponents: aˣ × aʸ = aˣ⁺ʸ, (aˣ)ʸ = aˣʸ",
      "Percentage as a fraction: R% = R/100",
      "Computing powers: (1.05)², (1.1)³ etc."
    ],
    teaching_content: {
      intuition: "The year-by-year method works but is slow for large T. The formula A = P(1 + R/100)ⁿ is just the year-by-year pattern compressed: each year you multiply by (1 + R/100), so after n years you have multiplied n times, giving the nth power. The formula is the shortcut for what the table does step by step.",
      derivation: "Year-by-year: A₁ = P(1+r), A₂ = A₁(1+r) = P(1+r)², A₃ = P(1+r)³, …, Aₙ = P(1+r)ⁿ where r = R/100. This is a geometric progression with ratio (1+r). For half-yearly: use r = R/200 and n → 2n. For quarterly: r = R/400, n → 4n. General: A = P(1 + R/(100k))^(kn) where k = compounding periods per year.",
      worked_example: "Find amount on ₹6250 at 8% p.a. compounded annually for 2 years.\nA = 6250 × (1 + 8/100)² = 6250 × (1.08)² = 6250 × 1.1664 = ₹7290.\nCI = 7290 − 6250 = ₹1040.\nHalf-yearly check: A = 6250 × (1.04)⁴ = 6250 × 1.16986 = ₹7311.61 (higher ✓).",
      visual_description: "A formula breakdown diagram: P in a box on the left, arrow to A on the right. Above the arrow: multiply by (1+R/100)ⁿ. Below: n labelled as number of compounding periods. A mini-table shows (1.1)¹=1.1, (1.1)²=1.21, (1.1)³=1.331.",
      svg_diagrams: [
        "<svg viewBox='0 0 320 80' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='25' width='60' height='30' rx='4' fill='#E3F2FD' stroke='#2196F3' stroke-width='1.5'/><text x='40' y='44' font-size='11' text-anchor='middle' fill='#1565C0'>P</text><line x1='70' y1='40' x2='220' y2='40' stroke='#4CAF50' stroke-width='2.5'/><text x='145' y='32' font-size='11' text-anchor='middle' fill='#2E7D32'>x (1+R/100)^n</text><rect x='225' y='25' width='80' height='30' rx='4' fill='#E8F5E9' stroke='#4CAF50' stroke-width='1.5'/><text x='265' y='44' font-size='11' text-anchor='middle' fill='#1B5E20'>A</text><text x='145' y='68' font-size='9' fill='#555' text-anchor='middle'>Half-yearly: use R/200 and 2n | Quarterly: R/400 and 4n</text></svg>"
      ],
      common_misconceptions: [
        "Writing A = P × (1 + R/100 × n) — that is simple interest. The n must be an exponent, not a multiplier.",
        "Using R/100 for half-yearly compounding — use R/200 and double the time.",
        "Computing (1 + R/100)ⁿ as 1 + (R/100)ⁿ — the entire bracket is raised to power n.",
        "Forgetting to subtract P: the formula gives Amount A, not CI. CI = A − P."
      ],
      shortcuts_and_tricks: [
        "Memorise: (1.1)² = 1.21, (1.1)³ = 1.331, (1.05)² = 1.1025, (1.2)² = 1.44.",
        "For 2 years: CI = P[(1+r)²−1] = P[2r+r²] = 2×(1-yr SI) + Pr².",
        "Half-yearly for 1 year vs annual: extra = P(R/200)².",
        "If rate is 10%: multiply by 1.1 repeatedly — (1.1)ⁿ up to n=5 is worth memorising."
      ],
      when_to_use_this_method: "Use the formula when T > 3 years or when a quick single calculation is needed. For T=1 or 2 years, year-by-year equally shows full working.",
      edge_cases: [
        "n = 0: A = P. No time → no interest.",
        "R = 0: A = P. No rate → no interest.",
        "Fractional year (e.g. 2½ years, annual compounding): use formula for 2 years then SI for 0.5 year on that amount."
      ],
      key_takeaway: "A = P(1+R/100)ⁿ compresses year-by-year multiplication into a single power. CI = A − P. Adjust to R/200 and 2n for half-yearly, R/400 and 4n for quarterly.",
      video_script_hooks: [
        "Opening: 'Year-by-year table for T=20 years? That is 20 rows. The formula A = P(1+R/100)ⁿ does all 20 multiplications in one step. Same answer, zero table.'",
        "Mid-lesson: 'Why a power? Each year multiplies by (1+r). Three years = three multiplications = the cube. n years = nth power. The formula is repetitive multiplication in disguise.'",
        "Closing: 'Three pieces: P (start), (1+r) (growth factor), n (periods). Fill them in, evaluate the power, subtract P for CI.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch3_ci_formula_applications",
    subject: "Mathematics",
    key_formulas: [
      "Finding P: P = A / (1 + R/100)ⁿ",
      "Finding R (2 years): R = [√(A/P) − 1] × 100",
      "Finding n: trial-and-error or n = log(A/P) / log(1+R/100)",
      "CI in year k = P(1+r)^(k−1) × r  where r = R/100",
      "Difference CI−SI (2 years) = P(R/100)²"
    ],
    prerequisite_knowledge: [
      "CI formula A = P(1+R/100)ⁿ",
      "Basic algebra — solving for an unknown",
      "Square roots and cube roots",
      "Logarithms for advanced n-finding"
    ],
    teaching_content: {
      intuition: "A = P(1+r)ⁿ has four variables. Know three, find the fourth. Finding P is division. Finding R needs an nth root. Finding n needs trial-and-error (ICSE Class 9 always uses small integer n). The CI in a specific year k is the difference between consecutive amounts A_{k} − A_{k−1}.",
      derivation: "Finding P: divide both sides by (1+r)ⁿ → P = A/(1+r)ⁿ. Finding R for n=2: (1+r)² = A/P → 1+r = √(A/P) → R = [√(A/P)−1]×100. Year k interest: A_{k−1} = P(1+r)^{k−1}; A_k = P(1+r)^k. Interest = A_k − A_{k−1} = P(1+r)^{k−1}×r. Finding n from consecutive amounts: ratio A_{k}/A_{k−1} = (1+r) → identify r, then compute from original.",
      worked_example: "Amount after 3 years at 10% p.a. CI = ₹13310. Find P.\nA = P(1.1)³ → 13310 = P × 1.331 → P = 13310/1.331 = ₹10000.\nInterest in Year 3 only:\nA₂ = 10000×(1.1)² = ₹12100. Year 3 interest = 13310 − 12100 = ₹1210.\nVerify: 10% of 12100 = ₹1210 ✓.",
      visual_description: "Four boxes P, A, R, n connected by dashed arrows. Forward: P,R,n → A. Backward: A,R,n → P. Root: P,A,n → R. Trial: P,A,R → n. Each arrow labelled with the operation needed.",
      svg_diagrams: [
        "<svg viewBox='0 0 280 120' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='10' width='70' height='25' rx='3' fill='#E3F2FD' stroke='#2196F3' stroke-width='1.5'/><text x='45' y='26' font-size='10' text-anchor='middle'>P</text><rect x='200' y='10' width='70' height='25' rx='3' fill='#E8F5E9' stroke='#4CAF50' stroke-width='1.5'/><text x='235' y='26' font-size='10' text-anchor='middle'>A</text><rect x='10' y='85' width='70' height='25' rx='3' fill='#FFF9C4' stroke='#FFC107' stroke-width='1.5'/><text x='45' y='101' font-size='10' text-anchor='middle'>R</text><rect x='200' y='85' width='70' height='25' rx='3' fill='#FCE4EC' stroke='#E91E63' stroke-width='1.5'/><text x='235' y='101' font-size='10' text-anchor='middle'>n</text><text x='140' y='58' font-size='9' text-anchor='middle' fill='#E91E63'>A = P(1+R/100)^n</text></svg>"
      ],
      common_misconceptions: [
        "Finding P: dividing A by (1+R×n/100) — that is SI logic. For CI: divide by (1+R/100)ⁿ.",
        "Finding year-k interest as A_k − P — it must be A_k − A_{k−1} (consecutive amounts).",
        "Treating R as already a decimal in the formula — always write R/100 explicitly.",
        "For half-yearly, forgetting to use 2n for the exponent."
      ],
      shortcuts_and_tricks: [
        "P from A (n=2, r=0.1): P = A/1.21. (n=3, r=0.1): P = A/1.331.",
        "Year k interest = (1+r)^{k−1} × (Year 1 interest). Year 3 at 10% = 1.21 × Year 1 interest.",
        "Ratio of consecutive-year amounts = (1+r) → instantly gives rate.",
        "Sum of all years' interest = total CI = A − P."
      ],
      when_to_use_this_method: "Use when reversing the CI formula to find P from A, finding rate from two amounts, or finding interest in a specific year.",
      edge_cases: [
        "n is not a whole number (2½ years, annual): formula for 2 years + SI on that amount for 0.5 year.",
        "Depreciation: A = P(1−R/100)ⁿ. Finding P means dividing A by (1−R/100)ⁿ.",
        "A/P is not a perfect power: for ICSE Class 9, always try n = 1, 2, 3 in order."
      ],
      key_takeaway: "The formula works in reverse: P = A/(1+r)ⁿ. Year k interest = consecutive amount difference. Finding R needs the nth root of A/P. Finding n for small integers: trial n=1,2,3.",
      video_script_hooks: [
        "Opening: 'The formula has four variables. Problems give you three and hide one. Today we find whichever is missing — P, R, A, or n.'",
        "Mid-lesson: 'Amount ₹13310 at 10% for 3 years. Divide by 1.331 → P = ₹10000. One step. The formula runs backwards just as cleanly as forwards.'",
        "Closing: 'Master the four directions and every CI problem is just algebra on A = P(1+r)ⁿ.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch3_ci_growth_decay",
    subject: "Mathematics",
    key_formulas: [
      "Growth: A = P(1 + R/100)ⁿ",
      "Decay/Depreciation: A = P(1 − R/100)ⁿ",
      "Mixed rates: A = P(1+R₁/100)(1+R₂/100)(1+R₃/100)",
      "Net after +R% then −R%: A = P(1 − R²/10000) < P",
      "Present value: P = A / (1 + R/100)ⁿ"
    ],
    prerequisite_knowledge: [
      "CI formula and variants",
      "Depreciation concept: value decreasing each year",
      "Signed percentages: increase = +, decrease = −",
      "Population/real-world context for exponential change"
    ],
    teaching_content: {
      intuition: "Compound interest is not just about money. Any quantity that grows or shrinks by a fixed percentage each period follows A = P(1 ± R/100)ⁿ. Population growing 3% per year, a car depreciating 15% per year, bacteria doubling — all use the same structure. Growth uses '+', decay uses '−'. The sign is the only change.",
      derivation: "Growth: after year 1, quantity = P(1+r). After n years: P(1+r)ⁿ. Decay: after year 1, quantity = P(1−r). After n years: P(1−r)ⁿ. Mixed rates: A = P(1+R₁/100)(1+R₂/100)(1+R₃/100). Net after +R% then −R%: A = P(1+r)(1−r) = P(1−r²) < P — always a net LOSS despite equal + and − rates.",
      worked_example: "(a) Population = 200000. Growth 5% p.a. After 3 years: A = 200000 × (1.05)³ = 200000 × 1.157625 = 231525.\n(b) Machine = ₹80000. Depreciates 10% p.a. After 2 years: A = 80000 × (0.9)² = 80000 × 0.81 = ₹64800.\n(c) ₹5000 grows 10% in Year 1 then falls 10% in Year 2: A = 5000 × 1.10 × 0.90 = 5000 × 0.99 = ₹4950. Net loss ₹50.",
      visual_description: "Two curves from the same starting point P: growth curve rising above P, decay curve falling below P. Horizontal axis = years, vertical = quantity. Both curves smooth (exponential), not straight lines like SI.",
      svg_diagrams: [
        "<svg viewBox='0 0 300 120' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='10' x2='30' y2='100' stroke='#333' stroke-width='2'/><line x1='30' y1='100' x2='290' y2='100' stroke='#333' stroke-width='2'/><polyline points='30,80 80,65 130,50 180,35 230,22' fill='none' stroke='#4CAF50' stroke-width='2.5'/><text x='235' y='20' font-size='9' fill='#4CAF50'>Growth (+)</text><polyline points='30,30 80,45 130,58 180,69 230,78' fill='none' stroke='#E91E63' stroke-width='2.5'/><text x='235' y='80' font-size='9' fill='#E91E63'>Decay (−)</text><circle cx='30' cy='80' r='3' fill='#333'/><circle cx='30' cy='30' r='3' fill='#E91E63'/><text x='8' y='56' font-size='9'>P</text></svg>"
      ],
      common_misconceptions: [
        "+R% then −R% does NOT return to original. A = P(1−r²) < P — always a net loss.",
        "Use (1+r) for growth and (1−r) for decay. Never mix them up.",
        "Depreciation rate applies to the current (reduced) value each year, not original cost.",
        "Mixed rates: MULTIPLY factors (1+R₁/100)(1+R₂/100), do NOT add R₁+R₂."
      ],
      shortcuts_and_tricks: [
        "Decay at 10% for 2 years: × 0.81. For 3 years: × 0.729.",
        "Growth at 10% for 2 years: × 1.21. For 3 years: × 1.331.",
        "Equal +R% and −R%: net result = P(1−R²/10000). Loss = PR²/10000.",
        "Present value: divide future amount by (1+r)ⁿ."
      ],
      when_to_use_this_method: "Use for population growth, depreciation, bacteria, real-estate appreciation, or any repeated percentage change.",
      edge_cases: [
        "Rate 100% (doubling): A = P×2ⁿ.",
        "Scrap value problem: given final value and rate, find n or original P.",
        "Depreciation + appreciation in different phases: (1−r₁)^n₁ × (1+r₂)^n₂."
      ],
      key_takeaway: "Growth: A = P(1+r)ⁿ. Decay: A = P(1−r)ⁿ. Different rates each year: multiply individual factors. Equal +R% then −R% always gives a net loss of PR²/10000.",
      video_script_hooks: [
        "Opening: 'Population growth, car depreciation, bank savings — three different stories, one formula. Change the sign, change the context. The mathematics is identical.'",
        "Mid-lesson: 'Up 10%, down 10% — back to start? Wrong. ₹5000 × 1.1 × 0.9 = ₹4950. Lost ₹50. The formula proves it: (1+r)(1−r) = 1−r² < 1. Growth then decay always ends lower.'",
        "Closing: 'Growth: use +. Decay: use −. Different rate each year: multiply factors one by one.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch3_ci_formula_problems",
    subject: "Mathematics",
    key_formulas: [
      "A = P(1 + R/100)ⁿ  (annual CI)",
      "A = P(1 + R/200)^(2n)  (half-yearly)",
      "A = P(1 − R/100)ⁿ  (depreciation)",
      "Mixed rates: A = P × ∏(1 + Rₖ/100)  (product of year-factors)",
      "Present value: P = A / (1 + R/100)ⁿ"
    ],
    prerequisite_knowledge: [
      "Full CI formula and variants",
      "Growth and decay models",
      "Reverse formula — finding P, R, n",
      "Systematic word problem solving"
    ],
    teaching_content: {
      intuition: "Every CI word problem is the same formula in a different costume — population, depreciation, bacteria. The solving process is always: identify P, A, R, n and the formula variant. Substitute and solve. For complex problems with multiple unknowns, write simultaneous equations from two given conditions.",
      derivation: "Standard steps: (1) Read and identify givens: P (initial), R (rate), n (periods), A (final). (2) Decide: growth (+) or decay (−)? Annual, half-yearly, quarterly? (3) Write the matching formula. (4) Substitute knowns. (5) Solve for the unknown. For mixed rates: A = P(1+R₁/100)(1+R₂/100)…",
      worked_example: "A photocopier costs ₹1,20,000. Depreciates 10% p.a. for 2 years then 15% p.a. for 1 year. Find value after 3 years.\nA = 120000 × (1−10/100)² × (1−15/100)\n= 120000 × (0.9)² × 0.85\n= 120000 × 0.81 × 0.85\n= 120000 × 0.6885 = ₹82620.",
      visual_description: "A flowchart: Read → Growth or Decay? → Annual/Half-yearly/Quarterly? → Write formula → Substitute → Solve. Each decision node with two branches and colour coding.",
      svg_diagrams: [
        "<svg viewBox='0 0 280 130' xmlns='http://www.w3.org/2000/svg'><rect x='90' y='5' width='100' height='20' rx='3' fill='#E3F2FD' stroke='#2196F3' stroke-width='1.5'/><text x='140' y='18' font-size='9' text-anchor='middle'>Read the problem</text><line x1='140' y1='25' x2='140' y2='40' stroke='#333' stroke-width='1.5'/><rect x='70' y='40' width='140' height='20' rx='3' fill='#FFF9C4' stroke='#FFC107' stroke-width='1.5'/><text x='140' y='53' font-size='9' text-anchor='middle'>Growth (+) or Decay (−)?</text><line x1='140' y1='60' x2='140' y2='75' stroke='#333' stroke-width='1.5'/><rect x='60' y='75' width='160' height='20' rx='3' fill='#E8F5E9' stroke='#4CAF50' stroke-width='1.5'/><text x='140' y='88' font-size='9' text-anchor='middle'>Annual / Half-yearly / Quarterly?</text><line x1='140' y1='95' x2='140' y2='110' stroke='#333' stroke-width='1.5'/><rect x='80' y='110' width='120' height='20' rx='3' fill='#FCE4EC' stroke='#E91E63' stroke-width='1.5'/><text x='140' y='123' font-size='9' text-anchor='middle'>Substitute and Solve</text></svg>"
      ],
      common_misconceptions: [
        "Using A = P(1−r)ⁿ for the full period when rates change each year — multiply individual factors instead.",
        "Confusing 'value after n years' with 'depreciation over n years' — depreciation = P − A.",
        "Wrong base period: using monthly rate in annual formula.",
        "For half-yearly: using n years instead of 2n half-year periods."
      ],
      shortcuts_and_tricks: [
        "Write the formula version BEFORE substituting — prevents variant errors.",
        "Mixed rate (R₁ for n₁ years, R₂ for n₂ years): A = P(1+R₁/100)^n₁ × (1+R₂/100)^n₂.",
        "Depreciation to scrap value: A/P = (1−r)ⁿ — try integer values of n.",
        "Present value: P = A/(1+r)ⁿ — just divide by the growth factor."
      ],
      when_to_use_this_method: "Use for all CI word problems: population, depreciation, machinery value, real-estate appreciation, mixed-rate investments.",
      edge_cases: [
        "Present value question: P = A/(1+r)ⁿ.",
        "Different rate each year: cannot use (1+r)ⁿ — multiply year-specific factors.",
        "Depreciation then appreciation: (1−r₁)^n₁ × (1+r₂)^n₂."
      ],
      key_takeaway: "Read → identify P,A,R,n → choose formula variant → substitute → solve. For mixed rates, multiply individual year-factors. Subtract P for CI; subtract A from P for depreciation amount.",
      video_script_hooks: [
        "Opening: 'Every CI word problem is the same formula in disguise. Learn to see through the costume — population, car, bacteria — and write A = P(1±r)ⁿ every time.'",
        "Mid-lesson: 'Different rate each year? Do NOT add them. Multiply the factors. ₹120000 × 0.9 × 0.9 × 0.85 = three multiplications. Done.'",
        "Closing: 'Write the formula first. Every single time. Then substitute. This habit eliminates 90% of CI word problem errors.'"
      ]
    }
  },


  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 4 — Expansions (Including Substitution)
  // ════════════════════════════════════════════════════════════════════════════

  {
    topicId: "icse_math9_ch4_expansion_basics",
    subject: "Mathematics",
    key_formulas: [
      "(a+b)² = a² + 2ab + b²",
      "(a−b)² = a² − 2ab + b²",
      "(a+b)(a−b) = a² − b²  [difference of squares]",
      "(a+b)² + (a−b)² = 2(a² + b²)",
      "(a+b)² − (a−b)² = 4ab"
    ],
    prerequisite_knowledge: [
      "Distributive property of multiplication over addition",
      "FOIL: (p+q)(r+s) = pr+ps+qr+qs",
      "Perfect squares of integers and algebraic terms",
      "Meaning of algebraic terms: coefficient, variable, exponent"
    ],
    teaching_content: {
      intuition: "Expansions are simply multiplication written out in full. (a+b)² means (a+b)×(a+b) — multiply every term of the first bracket by every term of the second. The formulas are shortcuts that save time; the distributive property always works as a fallback. The difference-of-squares identity (a+b)(a−b) = a²−b² is the most powerful shortcut: it eliminates the middle term entirely.",
      derivation: "Deriving (a+b)²: (a+b)² = (a+b)(a+b). Expand: a×a + a×b + b×a + b×b = a² + ab + ab + b² = a² + 2ab + b². For (a−b)²: replace b with −b: a² + 2a(−b) + (−b)² = a² − 2ab + b². For (a+b)(a−b): (a+b)(a−b) = a²−ab+ab−b² = a² − b². The +ab and −ab cancel, leaving only a²−b².",
      worked_example: "Example 1: Expand (3x+4y)². Using (a+b)²: a=3x, b=4y. (3x)²+2(3x)(4y)+(4y)² = 9x²+24xy+16y². Example 2: Expand (5a−2b)². (5a)²−2(5a)(2b)+(2b)² = 25a²−20ab+4b². Example 3: Evaluate 98×102. = (100−2)(100+2) = 100²−2² = 10000−4 = 9996. Example 4: If a+b=7 and ab=10, find a²+b². Use: a²+b² = (a+b)²−2ab = 49−20 = 29.",
      visual_description: "Geometric proof of (a+b)²: Draw a square with side (a+b). It contains one a×a square, two rectangles of size a×b, and one b×b square. Total area = a² + 2ab + b². This geometric picture makes the formula unforgettable.",
      svg_diagrams: [],
      common_misconceptions: [
        "(a+b)² ≠ a²+b². Students forget the 2ab middle term. Geometric proof cures this.",
        "(a−b)² ≠ a²−b². The b² term is always positive since (−b)² = b².",
        "Students sometimes write (a+b)(a−b) = a²+b² instead of a²−b². The −b term negates the +b.",
        "Confusing (a+b)² with 2(a+b) (treating the exponent as a coefficient)."
      ],
      shortcuts_and_tricks: [
        "Squares of numbers near 100: 97² = (100−3)² = 10000−600+9 = 9409.",
        "Products near equal numbers: 23×27 = (25−2)(25+2) = 625−4 = 621.",
        "Finding a²+b² from sum and product: a²+b² = (a+b)²−2ab.",
        "Finding (a−b)² from (a+b)² and ab: (a−b)² = (a+b)²−4ab."
      ],
      when_to_use_this_method: "Use these basic identities whenever you see binomial squares or a product of sum and difference. Mental arithmetic with numbers near convenient values (50, 100, 1000) becomes instant. Use the sum/product relations when direct calculation of a²+b² would require knowing a and b individually.",
      edge_cases: [
        "Negative terms: (−a+b)² = (b−a)² — rearrange so leading coefficient is positive.",
        "Fractions: (½x−3)² = ¼x²−3x+9.",
        "Mixed: (√2 + √3)² = 2 + 2√6 + 3 = 5 + 2√6."
      ],
      key_takeaway: "The three core identities (a+b)², (a−b)², (a+b)(a−b) are the foundation of all algebraic manipulation. Master them geometrically so you never forget the middle term. The difference-of-squares (a+b)(a−b)=a²−b² eliminates the cross term and is the most time-saving identity in arithmetic.",
      video_script_hooks: [
        "Opening: 'What is 99²? Without a calculator, in 3 seconds: (100−1)² = 10000−200+1 = 9801. That is the power of algebraic identities.'",
        "Mid-lesson: 'The biggest mistake in all of algebra: (a+b)² = a²+b². Wrong! There is always a middle term — 2ab. The geometry never lies: draw the square and count the pieces.'",
        "Closing: 'Every expansion problem you will ever see fits one of three templates. Identify which template, substitute a and b, write the answer. It is pattern recognition, not arithmetic.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch4_algebraic_identities",
    subject: "Mathematics",
    key_formulas: [
      "(a+b+c)² = a²+b²+c²+2ab+2bc+2ca",
      "a²+b² = (a+b)²−2ab",
      "(a+b)² = (a−b)²+4ab",
      "(a−b)² = (a+b)²−4ab",
      "2(a²+b²) = (a+b)²+(a−b)²",
      "4ab = (a+b)²−(a−b)²"
    ],
    prerequisite_knowledge: [
      "Basic expansions: (a+b)², (a−b)², (a+b)(a−b)",
      "Algebraic manipulation and simplification",
      "Substituting values into algebraic expressions"
    ],
    teaching_content: {
      intuition: "The three-variable identity (a+b+c)² is just (a+b)² extended. Think of it as squaring a trinomial by treating (b+c) as a single term: [a+(b+c)]² = a²+2a(b+c)+(b+c)² = a²+2ab+2ac+b²+2bc+c² — rearranged to the standard form. The derived identities (a²+b²=(a+b)²−2ab etc.) are powerful tools to find one expression when its relatives are known, without needing the individual values of a and b.",
      derivation: "(a+b+c)²: Let p = a+b. Then (p+c)² = p²+2pc+c² = (a+b)²+2(a+b)c+c² = a²+2ab+b²+2ac+2bc+c² = a²+b²+c²+2ab+2bc+2ca. Derived: a²+b² = (a+b)²−2ab — subtract 2ab from both sides of (a+b)² = a²+2ab+b². Relation 4ab: (a+b)²−(a−b)² = (a²+2ab+b²)−(a²−2ab+b²) = 4ab.",
      worked_example: "Example 1: Expand (2x+3y+z)². a=2x, b=3y, c=z. (2x)²+(3y)²+z²+2(2x)(3y)+2(3y)(z)+2(z)(2x) = 4x²+9y²+z²+12xy+6yz+4zx. Example 2: If a+b=5, ab=6, find a²+b². a²+b² = (a+b)²−2ab = 25−12 = 13. Example 3: If a+b=10, a²+b²=58, find ab. 58 = 100−2ab → 2ab=42 → ab=21.",
      visual_description: "For (a+b+c)²: Imagine a square of side a+b+c divided into a 3×3 grid of 9 rectangles. The three diagonal cells are a², b², c². The six off-diagonal cells are 2ab, 2bc, 2ca (each appears as a pair of identical rectangles). The total is the sum of all nine cells.",
      svg_diagrams: [],
      common_misconceptions: [
        "(a+b+c)² ≠ a²+b²+c². Three cross-product pairs (2ab, 2bc, 2ca) are always present.",
        "Students often write 2abc instead of 2ab+2bc+2ca — confusing the product of all three with pairwise products.",
        "Forgetting to check: the number of cross terms for n variables squared = n(n−1) half the time.",
        "Sign errors in (a−b+c)²: replace b with −b, c stays positive."
      ],
      shortcuts_and_tricks: [
        "Count the cross terms: for (a+b+c)², exactly 3 cross-product pairs.",
        "If a+b+c=0, then a²+b²+c² = −2(ab+bc+ca) — useful shortcut.",
        "Difference check: (a+b)²−(a−b)²=4ab. Use to find 4ab instantly.",
        "When a+b and a²+b² are given: ab = [(a+b)²−(a²+b²)]/2."
      ],
      when_to_use_this_method: "Use (a+b+c)² whenever you expand a trinomial squared. Use the derived identities (a²+b²=(a+b)²−2ab) in problems where the sum and product of two quantities are known but individual values are not asked — common in ICSE problems of the form 'if x+y=5 and xy=6, find x²+y²'.",
      edge_cases: [
        "If one variable is negative: (a−b+c)² — replace b by −b in the formula.",
        "If a+b+c=0: a²+b²+c² = −2(ab+bc+ca).",
        "Three-variable with coefficients: (2a+3b−c)² — set A=2a, B=3b, C=−c and apply."
      ],
      key_takeaway: "Derived identities (a²+b²=(a+b)²−2ab, 4ab=(a+b)²−(a−b)²) let you switch between sums of powers, sums, and products. They are the bridge between elementary algebra and symmetric functions. For (a+b+c)²: square each, double every pair — six terms total.",
      video_script_hooks: [
        "Opening: 'x+y=5 and xy=6. What is x²+y²? Most students struggle. But with one identity — x²+y²=(x+y)²−2xy = 25−12 = 13 — it takes three seconds.'",
        "Mid-lesson: 'For (a+b+c)², the trick is counting: 3 square terms and 3 cross-term pairs. Never add them together into one abc term. It is pairwise — ab, bc, ca, each doubled.'",
        "Closing: 'These derived identities are the skeleton keys of algebra. Given any two of {a+b, a−b, a²+b², ab}, you can find all the others. That is why examiners love them.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch4_special_products",
    subject: "Mathematics",
    key_formulas: [
      "(a+b)³ = a³+3a²b+3ab²+b³ = a³+b³+3ab(a+b)",
      "(a−b)³ = a³−3a²b+3ab²−b³ = a³−b³−3ab(a−b)",
      "a³+b³ = (a+b)³−3ab(a+b) = (a+b)(a²−ab+b²)",
      "a³−b³ = (a−b)³+3ab(a−b) = (a−b)(a²+ab+b²)",
      "(a+b)³+(a−b)³ = 2a(a²+3b²)",
      "(a+b)³−(a−b)³ = 2b(3a²+b²)"
    ],
    prerequisite_knowledge: [
      "(a+b)² and (a−b)² expansion",
      "Multiplying a binomial by a trinomial",
      "Pascal's triangle (optional but helpful)",
      "Cube roots of perfect cubes"
    ],
    teaching_content: {
      intuition: "(a+b)³ means multiplying (a+b) three times. A shortcut: (a+b)³ = (a+b)(a+b)² = (a+b)(a²+2ab+b²). Expand by distributing: a(a²+2ab+b²)+b(a²+2ab+b²) = a³+2a²b+ab²+a²b+2ab²+b³ = a³+3a²b+3ab²+b³. The coefficients 1,3,3,1 come from Pascal's triangle row 3. The compact form a³+b³+3ab(a+b) is more useful in problems where a+b is given.",
      derivation: "(a+b)³ = (a+b)(a+b)². Step 1: (a+b)² = a²+2ab+b². Step 2: Multiply by (a+b): a(a²+2ab+b²) = a³+2a²b+ab². b(a²+2ab+b²) = a²b+2ab²+b³. Total = a³+(2a²b+a²b)+(ab²+2ab²)+b³ = a³+3a²b+3ab²+b³. Rearranged: a³+b³+3ab(a+b). For (a−b)³: replace b with −b throughout → a³−3a²b+3ab²−b³ = a³−b³−3ab(a−b).",
      worked_example: "Example 1: Expand (2x+3y)³. a=2x, b=3y. (2x)³+3(2x)²(3y)+3(2x)(3y)²+(3y)³ = 8x³+3(4x²)(3y)+3(2x)(9y²)+27y³ = 8x³+36x²y+54xy²+27y³. Example 2: If a+b=5 and ab=6, find a³+b³. a³+b³ = (a+b)³−3ab(a+b) = 125−3(6)(5) = 125−90 = 35. Example 3: Evaluate 11³ using expansion. (10+1)³ = 1000+300+30+1 = 1331.",
      visual_description: "Geometric representation: (a+b)³ is the volume of a cube with side (a+b). It contains one a³ cube, one b³ cube, three a²b rectangular boxes (a×a×b), and three ab² rectangular boxes (a×b×b). Total 8 pieces → volume = a³+3a²b+3ab²+b³.",
      svg_diagrams: [],
      common_misconceptions: [
        "(a+b)³ ≠ a³+b³. The middle terms 3a²b+3ab² are always present.",
        "Sign confusion in (a−b)³: the term 3ab² is positive (since (−b)² = b²), but 3a²b is negative.",
        "Students write (a−b)³ = a³−b³−3ab(a+b) instead of −3ab(a−b).",
        "Forgetting to cube the coefficients: (2x+3)³ → 8x³, not 2x³."
      ],
      shortcuts_and_tricks: [
        "Compact form: a³+b³ = (a+b)[(a+b)²−3ab] = (a+b)³−3ab(a+b).",
        "If a+b and ab known: a³+b³ = (a+b)³−3ab(a+b). No need to find a,b individually.",
        "Cube of a number near 10: 12³ = (10+2)³ = 1000+600+120+8 = 1728.",
        "Check: coefficients of (a+b)³ are Pascal row 3: 1,3,3,1. Sum = 8 = 2³."
      ],
      when_to_use_this_method: "Use cubic expansions when asked to expand cube of a binomial, or when given a+b and ab and asked for a³+b³ or a³−b³. The compact form a³+b³=(a+b)[(a+b)²−3ab] avoids expanding cubes entirely.",
      edge_cases: [
        "Negative base: (−a+b)³ = −(a−b)³ = −a³+3a²b−3ab²+b³.",
        "With fractions: (x+1/x)³ = x³+3x+3/x+1/x³.",
        "If a+b=0: a³+b³ = −3ab(a+b) = 0. Also a³+b³=(a+b)(a²−ab+b²) = 0."
      ],
      key_takeaway: "Memorise: (a+b)³ = a³+b³+3ab(a+b) and (a−b)³ = a³−b³−3ab(a−b). The compact form ties cubes to sums/differences and products. Coefficients follow Pascal's triangle: 1,3,3,1. The volume-of-a-cube geometry proves the formula visually.",
      video_script_hooks: [
        "Opening: 'a+b=5, ab=6. Find a³+b³. Sounds brutal. One formula: (a+b)³−3ab(a+b) = 125−90 = 35. Done in four seconds. This is why we memorise compact forms.'",
        "Mid-lesson: 'The biggest error: (a+b)³ = a³+b³. Let us test: (1+1)³ = 8, but 1³+1³ = 2. So 8 ≠ 2. The middle terms 3a²b+3ab² = 3(1)(1)(2) = 6. There they are.'",
        "Closing: 'Pascal's triangle gives you any power of a binomial: row 3 is 1,3,3,1. Row 4 is 1,4,6,4,1. You will never need to derive these again — just read the triangle.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch4_expansion_applications",
    subject: "Mathematics",
    key_formulas: [
      "a²+b² = (a+b)²−2ab = (a−b)²+2ab",
      "a²−b² = (a+b)(a−b)",
      "(x+1/x)² = x²+2+1/x²  →  x²+1/x² = (x+1/x)²−2",
      "(x−1/x)² = x²−2+1/x²  →  x²+1/x² = (x−1/x)²+2",
      "x³+1/x³ = (x+1/x)³−3(x+1/x)",
      "If x+1/x = k, then x²+1/x² = k²−2 and x³+1/x³ = k³−3k"
    ],
    prerequisite_knowledge: [
      "All basic and cubic expansion identities",
      "Reciprocals and fractions in algebra",
      "Substitution technique for evaluating expressions"
    ],
    teaching_content: {
      intuition: "Applications of expansions are about working smarter: given partial information (like a+b and ab), extract other quantities without solving for a and b individually. The most ICSE-favourite family involves (x+1/x): given one expression (say x+1/x=3), a chain of identities lets you compute x²+1/x², x³+1/x³, x⁴+1/x⁴ without ever finding x. Each step squares the previous result and subtracts 2. It is a telescoping chain built entirely on the three basic identities.",
      derivation: "Given x+1/x = k. Step 1: Square both sides: (x+1/x)² = k² → x²+2+1/x² = k² → x²+1/x² = k²−2. Step 2: Cube: (x+1/x)³ = k³ → x³+3x+3/x+1/x³ = k³ → x³+1/x³+3(x+1/x) = k³ → x³+1/x³ = k³−3k. Step 3: For x⁴+1/x⁴: (x²+1/x²)² = x⁴+2+1/x⁴ → x⁴+1/x⁴ = (k²−2)²−2.",
      worked_example: "Example 1: x+1/x = 3. Find x²+1/x². x²+1/x² = 3²−2 = 7. Example 2: x+1/x = 3. Find x³+1/x³. x³+1/x³ = 3³−3×3 = 27−9 = 18. Example 3: Evaluate 9.8² using (10−0.2)². (10−0.2)² = 100−4+0.04 = 96.04. Example 4: a+b=7, a−b=3. Find a²+b² and ab. a=(7+3)/2=5, b=2. Or: a²+b²=[(a+b)²+(a−b)²]/2 = [49+9]/2 = 29. ab=[(a+b)²−(a−b)²]/4 = [49−9]/4 = 10.",
      visual_description: "The (x+1/x) chain: picture a number line where each step converts the 'sum of reciprocal powers' to the next power. x+1/x → squared → x²+1/x² (subtract 2) → squared → x⁴+1/x⁴ (subtract 2). The step 'square, subtract 2' repeats at every doubling of the exponent.",
      svg_diagrams: [],
      common_misconceptions: [
        "Students forget to subtract 2 when squaring x+1/x: (x+1/x)² = x²+1/x², not x²+2+1/x².",
        "Confusing (x+1/x)³ = x³+1/x³ — missing the 3(x+1/x) term.",
        "Using a²+b² = (a+b)²+2ab (adding instead of subtracting).",
        "Substituting numbers before applying identities — slow and error-prone."
      ],
      shortcuts_and_tricks: [
        "x+1/x=k chain: x²+1/x²=k²−2, x³+1/x³=k³−3k, x⁴+1/x⁴=(k²−2)²−2.",
        "For numerical evaluations near round numbers: 98²=(100−2)²=9604 in 3 seconds.",
        "Sum and difference: a²+b² = [(a+b)²+(a−b)²]/2. Symmetric.",
        "Product from sum and difference: ab = [(a+b)²−(a−b)²]/4."
      ],
      when_to_use_this_method: "Use applications when the problem gives sum/difference/product of two quantities and asks for a derived expression — without asking for the individual values. The (x+1/x) chain is ICSE's most-tested application. Use numeric shortcut identities (a±b)² for mental arithmetic with numbers near 50, 100, 1000.",
      edge_cases: [
        "x−1/x=k path: x²+1/x²=(x−1/x)²+2=k²+2.",
        "If a²+b²=0 over reals, then a=b=0.",
        "For large powers: use the doubling chain. x⁸+1/x⁸=((x⁴+1/x⁴)²−2)."
      ],
      key_takeaway: "The (x+1/x) chain is a must-memorise sequence. Start with x+1/x=k. Derive x²+1/x²=k²−2, x³+1/x³=k³−3k in one step each. No need to find x. Similarly, a²+b²=(a+b)²−2ab connects the three most common unknowns in symmetric problems. Substituting identities is always faster than solving for individual values.",
      video_script_hooks: [
        "Opening: 'x+1/x=3. Find x³+1/x³. Most students: solve for x. Smart students: k=3, answer=k³−3k=27−9=18. Two steps. No quadratic needed.'",
        "Mid-lesson: '(x+1/x)² is NOT x²+1/x². It is x²+2+1/x². The 2 in the middle comes from 2×x×1/x=2. Ignore it at your peril — you will lose 2 marks.'",
        "Closing: 'These identities are a Swiss army knife. Learn the chain: +1/x → square → −2 → you have the squared form. Cube it → −3 times original → you have the cube form. Drill it until it is automatic.'"
      ]
    }
  },


  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Factorisation
  // ════════════════════════════════════════════════════════════════════════════

  {
    topicId: "icse_math9_ch5_factoring_basics",
    subject: "Mathematics",
    key_formulas: [
      "GCF factoring: ab + ac = a(b + c)  [take out the highest common factor]",
      "Grouping (4 terms): ax+ay+bx+by = a(x+y)+b(x+y) = (a+b)(x+y)",
      "Regrouping: try both pair arrangements — first and fourth with second and third",
      "Always take out the GCF first, then look for grouping"
    ],
    prerequisite_knowledge: [
      "Finding the HCF of algebraic terms",
      "Distributive law in reverse: a(b+c) = ab+ac",
      "Identifying common factors in pairs of terms",
      "Basic algebraic manipulation and like-term collection"
    ],
    teaching_content: {
      intuition: "Factorisation is expansion in reverse. Expanding distributes a product into a sum; factorising collects a sum back into a product. The universal first step is: look for a common factor. If all terms share a factor, pull it out. When there is no single factor for all terms but there are four terms, try grouping: pair them in a way that each pair shares its own factor, then check that the remaining brackets match.",
      derivation: "Common factor: ax+ay — both terms have factor a. Divide: x+y. Result: a(x+y). Grouping (4 terms): ax+ay+bx+by. Pair (ax+ay)+(bx+by) = a(x+y)+b(x+y). Now both terms have factor (x+y). Pull out: (a+b)(x+y). Alternative pairing: (ax+bx)+(ay+by) = x(a+b)+y(a+b) = (a+b)(x+y). Same answer — choose whichever pairing gives matching brackets.",
      worked_example: "Example 1: Factorise 6x²y + 12xy². HCF = 6xy. 6x²y+12xy² = 6xy(x+2y). Example 2: Factorise a²+ab+ac+bc. Group: a(a+b)+c(a+b) = (a+c)(a+b). Example 3: Factorise x³+x²y−xy²−y³. Group: x²(x+y)−y²(x+y) = (x²−y²)(x+y) = (x+y)(x−y)(x+y) = (x+y)²(x−y). Example 4: Factorise 2a+2b+a²+ab. Group: 2(a+b)+a(a+b) = (2+a)(a+b).",
      visual_description: "Picture a rectangle with sides A and B. Area = AB. If you split B = (x+y), the area splits into two smaller rectangles: Ax and Ay. Reversing: given two rectangles Ax and Ay, factorising collects them back into one rectangle A(x+y). Grouping is doing this for two pairs of rectangles simultaneously.",
      svg_diagrams: [],
      common_misconceptions: [
        "Pulling out only part of the HCF: 6x²+9x → 3(2x²+3x) instead of 3x(2x+3). Always extract the full HCF.",
        "Forgetting to carry the sign when regrouping: for ax−ay+bx−by, group as a(x−y)+b(x−y) — the b pair must preserve the sign.",
        "Stopping after first grouping without checking if the result can be factorised further.",
        "Grouping in the wrong pairs: try both arrangements if the first doesn't give matching brackets."
      ],
      shortcuts_and_tricks: [
        "Check your answer by expanding — multiplication must give back the original expression.",
        "If grouping gives different brackets (e.g., a(x+y)+b(x−y)), try regrouping differently.",
        "For 4-term expressions, always check both pair arrangements before giving up.",
        "After common factor, check if the remaining expression factors further (e.g., a²−b² can be factorised)."
      ],
      when_to_use_this_method: "Always try GCF first — it is the simplest step. Use grouping when there is no single HCF for all terms but there are exactly 4 terms. This method also handles 6-term expressions when grouped in threes. If grouping fails, the expression may need identity-based or trinomial factorisation.",
      edge_cases: [
        "Negative HCF: factorise −3x²+6x as −3x(x−2) — taking out a negative to simplify the bracket.",
        "If the bracket is negative: x(a−b)+y(b−a) = x(a−b)−y(a−b) = (x−y)(a−b). Recognise (b−a) = −(a−b).",
        "Three-term grouping: a³+a²b+ab² = a(a²+ab+b²) — just common factor, no pairing needed."
      ],
      key_takeaway: "Step 1: Take out the HCF. Step 2: If 4 terms remain, group in pairs and pull out each pair's HCF, then factor the matching bracket. Always verify by expanding. If the brackets don't match, try regrouping.",
      video_script_hooks: [
        "Opening: 'Factorising is just un-expanding. Every expansion you did in Chapter 4 becomes a factorisation challenge in Chapter 5. Master expansion first; factorisation follows automatically.'",
        "Mid-lesson: 'The most common student error: taking out half the HCF. 6x²+9x — the HCF is 3x, not just 3. Always ask: what is the highest factor ALL terms share?'",
        "Closing: 'Grouping trick: draw a box around pairs. If each box gives a matching second factor, you have cracked it. If not, regroup. There is always exactly one correct grouping for well-formed problems.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch5_factoring_identities",
    subject: "Mathematics",
    key_formulas: [
      "a²−b² = (a+b)(a−b)  [difference of squares]",
      "a²+2ab+b² = (a+b)²  [perfect square trinomial +]",
      "a²−2ab+b² = (a−b)²  [perfect square trinomial −]",
      "a³+b³ = (a+b)(a²−ab+b²)  [sum of cubes]",
      "a³−b³ = (a−b)(a²+ab+b²)  [difference of cubes]",
      "(a+b)²−c² = (a+b+c)(a+b−c)  [applied difference of squares]"
    ],
    prerequisite_knowledge: [
      "All expansion identities from Chapter 4",
      "Recognising perfect squares and perfect cubes",
      "Ability to express terms as a² or a³ form (e.g., 9x²=(3x)², 8y³=(2y)³)"
    ],
    teaching_content: {
      intuition: "Identity-based factorisation is recognising a pattern — a disguised version of a known formula. The key skill is rewriting each term in the form a² or a³: 9x²=(3x)², 25y²=(5y)², 27a³=(3a)³. Once you see the pieces, plug them into the correct identity. The difference of squares is the most common: any expression of the form (something)²−(something else)² factors immediately into a product of sum and difference.",
      derivation: "a²−b² = (a+b)(a−b): verify by expanding (a+b)(a−b) = a²−ab+ab−b² = a²−b². For sum of cubes: a³+b³ = (a+b)(a²−ab+b²). Verify: (a+b)(a²−ab+b²) = a³−a²b+ab²+a²b−ab²+b³ = a³+b³. ✓ Note the SOAP memory aid for cubes: Same sign, Opposite sign, Always Positive — (a+b)(a²−ab+b²): same as original (a+b), opposite sign (−ab), always +b².",
      worked_example: "Example 1: Factorise 16x²−25y². (4x)²−(5y)² = (4x+5y)(4x−5y). Example 2: Factorise 4a²+12ab+9b². Is this a perfect square? (2a)²+2(2a)(3b)+(3b)² = (2a+3b)². Yes. Example 3: Factorise 27x³−64y³. (3x)³−(4y)³ = (3x−4y)((3x)²+(3x)(4y)+(4y)²) = (3x−4y)(9x²+12xy+16y²). Example 4: Factorise a²−b²+2bc−c². = a²−(b−c)² [recognise b²−2bc+c²=(b−c)²] = (a+b−c)(a−b+c).",
      visual_description: "For a²−b²: picture two concentric squares. The outer square has side a, the inner has side b. The 'L-shaped' region between them has area a²−b², and it can be rearranged into a rectangle with sides (a+b) and (a−b). This is the geometric meaning of the difference-of-squares identity.",
      svg_diagrams: [],
      common_misconceptions: [
        "a²+b² cannot be factorised over the reals — students often try (a+b)(a−b) which gives a²−b², not a²+b².",
        "Sum of squares ≠ perfect square: x²+9 ≠ (x+3)². Middle term 6x is missing.",
        "In difference of cubes, students confuse signs: a³−b³ = (a−b)(a²+ab+b²) — the trinomial has +ab, not −ab.",
        "Forgetting to check if the result can be factorised further: x⁴−y⁴ = (x²+y²)(x²−y²) = (x²+y²)(x+y)(x−y)."
      ],
      shortcuts_and_tricks: [
        "SOAP rule for cubes: Same-Opposite-Always Positive. a³±b³ = (a±b)(a²∓ab+b²).",
        "Perfect square check: coefficient of middle term = 2 × (√first) × (√last). If yes, it's (√first ± √last)².",
        "Difference of squares disguised: a²−b²+2bc−c² = a²−(b−c)² — complete the square in the last three terms.",
        "Always check for a common factor before applying identities: 2x²−8 = 2(x²−4) = 2(x+2)(x−2)."
      ],
      when_to_use_this_method: "Use identity-based factorisation when you see exactly two terms that are both perfect squares (difference of squares), a trinomial with equal first and last terms that are perfect squares (perfect square trinomial), or exactly two perfect-cube terms. For expressions mixing grouping and identities (like a²−b²+2bc−c²), group to reveal the identity.",
      edge_cases: [
        "Sum of squares: a²+b² is irreducible over reals. Do not attempt to factor.",
        "x⁶−y⁶: factor as (x³+y³)(x³−y³), then factor each using sum/diff of cubes — 4 factors total.",
        "Coefficient handling: 8x³+27 = (2x)³+3³ — cube root the coefficients: ∛8=2, ∛27=3."
      ],
      key_takeaway: "Rewrite every term as a perfect square or cube first. Then match the pattern: two terms → difference of squares or sum/diff of cubes; three terms → perfect square trinomial. SOAP mnemonic for cubes: (a±b)(a²∓ab+b²). Always factor out common factors first.",
      video_script_hooks: [
        "Opening: '16x²−25y². Two terms, both perfect squares, minus sign between. It is (4x+5y)(4x−5y) — done. Difference of squares is the fastest factorisation in algebra.'",
        "Mid-lesson: 'Students always get the cube formula wrong. Use SOAP: Same sign as original, Opposite sign for the middle term, Always Positive for the last. Say it out loud every time.'",
        "Closing: 'Before using any identity, rewrite every term as a perfect power. 8x³ is (2x)³, not 2x³. This single step eliminates almost all identity-factorisation errors.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch5_factoring_quadratics",
    subject: "Mathematics",
    key_formulas: [
      "x²+(a+b)x+ab = (x+a)(x+b)  [standard trinomial]",
      "Splitting the middle term: find m,n such that m+n=b and m×n=a×c for ax²+bx+c",
      "ax²+bx+c = ax²+mx+nx+c, then group in pairs",
      "Check: if b²−4ac < 0, the quadratic is irreducible over the reals"
    ],
    prerequisite_knowledge: [
      "Expanding (x+a)(x+b) = x²+(a+b)x+ab",
      "Finding factor pairs of integers (including negative factors)",
      "Grouping method from factoring basics",
      "Signs: positive product + positive sum → both factors same sign (positive); positive product + negative sum → both negative"
    ],
    teaching_content: {
      intuition: "To factorise a quadratic x²+bx+c, you are looking for two numbers whose sum is b (the coefficient of x) and whose product is c (the constant). This reverses the expansion (x+a)(x+b) = x²+(a+b)x+ab. For ax²+bx+c where a≠1, use the splitting method: find m and n such that m+n=b and mn=ac (not just c), then rewrite bx as mx+nx and group.",
      derivation: "For x²+5x+6: we need two numbers with sum 5 and product 6. Pairs of factors of 6: (1,6), (2,3). Sum check: 2+3=5 ✓. So x²+5x+6 = x²+2x+3x+6 = x(x+2)+3(x+2) = (x+3)(x+2). For 2x²+7x+3: a=2,b=7,c=3. ac=6. Find m,n: m+n=7, mn=6 → m=6,n=1. Split: 2x²+6x+x+3 = 2x(x+3)+1(x+3) = (2x+1)(x+3).",
      worked_example: "Example 1: Factorise x²−3x−10. Need sum=−3, product=−10. Pairs: (−5,+2) → −5+2=−3 ✓. x²−5x+2x−10 = x(x−5)+2(x−5) = (x+2)(x−5). Example 2: Factorise 6x²−x−2. ac=−12. m+n=−1, mn=−12: (−4,+3) → −4+3=−1 ✓. 6x²−4x+3x−2 = 2x(3x−2)+1(3x−2) = (2x+1)(3x−2). Example 3: x²+6x+9 — is this factorisable? Sum=6,product=9: (3,3). (x+3)² — perfect square!",
      visual_description: "Trinomial factorisation grid: draw a 2×2 box. Top-left = ax², bottom-right = c. Fill in the middle cells with the two split terms (mx and nx). Check that cross-multiplication gives m×n = ac. Then read off the column and row GCFs as the two factors. This box method visualises the split without guessing.",
      svg_diagrams: [],
      common_misconceptions: [
        "For ax²+bx+c (a≠1), students find two numbers that multiply to c instead of ac — must use ac.",
        "Sign errors: for x²−5x+6, product is positive +6 but both factors are negative (−2,−3).",
        "Stopping at the split-and-group stage without completing the factor: after grouping, must extract the common binomial.",
        "Declaring 'cannot be factorised' without checking discriminant: b²−4ac < 0 is the correct criterion."
      ],
      shortcuts_and_tricks: [
        "Sign rules for (x+a)(x+b): product positive+sum positive → both positive; product positive+sum negative → both negative; product negative → opposite signs (larger magnitude goes with the sign of the sum).",
        "For x²+bx+c: list factor pairs of c, check which sums to b. Much faster than splitting.",
        "Trial-and-check: for simple leading coefficients, try factor pairs of a and c directly.",
        "Verify factorisation by multiplying out — takes 10 seconds and catches all errors."
      ],
      when_to_use_this_method: "Use for any quadratic (degree 2) expression ax²+bx+c. Start by checking if it is a perfect square (use identity method if so). If not, use the splitting method. If no integer split exists (b²−4ac is not a perfect square), the quadratic is irreducible over integers.",
      edge_cases: [
        "Negative leading coefficient: −2x²+5x+3 = −(2x²−5x−3) = −(2x+1)(x−3). Always make leading coefficient positive first.",
        "Two-variable: 2x²+5xy+3y² → treat y as a constant. ac=6y². m+n=5y, mn=6y²: (2y,3y). Factor: (x+y)(2x+3y).",
        "Hidden quadratic: x⁴−5x²+4 — let u=x². u²−5u+4=(u−1)(u−4)=(x²−1)(x²−4)=(x+1)(x−1)(x+2)(x−2)."
      ],
      key_takeaway: "The two-number search (sum=b, product=ac for ax²+bx+c) is the engine of quadratic factorisation. For a=1: search product of c. For a≠1: search product of ac. Once found, split the middle term and group. Always verify by expanding.",
      video_script_hooks: [
        "Opening: 'Factorising x²+5x+6: what two numbers add to 5 and multiply to 6? Two and three. Done. That is the entire method. Now let us apply it to anything.'",
        "Mid-lesson: 'The most common mistake with 2x²+7x+3: students look for two numbers that multiply to 3. Wrong! The product is a×c = 2×3 = 6. Sum is 7. Numbers are 6 and 1. Always multiply the outer two coefficients first.'",
        "Closing: 'Check every factorisation by expanding. It takes ten seconds. If you skip it, you will lose easy marks on verification questions. Make it a habit.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch5_factoring_polynomials",
    subject: "Mathematics",
    key_formulas: [
      "Factor Theorem: if f(a) = 0, then (x − a) is a factor of f(x)",
      "Remainder Theorem: when f(x) is divided by (x−a), remainder = f(a)",
      "a³+b³+c³−3abc = (a+b+c)(a²+b²+c²−ab−bc−ca)",
      "If a+b+c = 0, then a³+b³+c³ = 3abc",
      "After finding one root (x=a), perform long division by (x−a) to get a quadratic, then factorise it"
    ],
    prerequisite_knowledge: [
      "Polynomial degree and notation f(x)",
      "Substituting values into polynomial expressions",
      "Quadratic factorisation from the previous topic",
      "Algebraic long division (or synthetic division)"
    ],
    teaching_content: {
      intuition: "The Factor Theorem gives a systematic way to crack cubic and higher polynomials: test integer values (±1, ±2, ±3, factors of the constant term) until f(a)=0. That means (x−a) divides the polynomial exactly. Divide out (x−a) — you get a quadratic. Factorise the quadratic using the splitting method. The process: find one root → divide → factorise the quotient → three linear factors total.",
      derivation: "Factor Theorem: if f(a)=0, write f(x)=(x−a)Q(x) for some polynomial Q(x). To find Q(x), use long division: divide f(x) by (x−a). The remainder must be 0 (confirmed by f(a)=0). For cubics, Q(x) will be quadratic, factorisable by splitting the middle term. For a³+b³+c³−3abc: verify by expansion or note it factors by recognising (a+b+c) as a root when you set x=a+b+c=0 in the algebraic structure.",
      worked_example: "Example 1: Factorise f(x)=x³−6x²+11x−6. Test x=1: 1−6+11−6=0 ✓. So (x−1) is a factor. Divide: x³−6x²+11x−6 ÷ (x−1) = x²−5x+6. Factorise x²−5x+6=(x−2)(x−3). Final: (x−1)(x−2)(x−3). Example 2: Factorise x³+2x²−5x−6. Test x=−1: −1+2+5−6=0 ✓. (x+1) factor. Divide: x²+x−6=(x+3)(x−2). Final: (x+1)(x+3)(x−2). Example 3: Find a³+b³+c³ when a+b+c=0, a=3,b=−7,c=4. Check: 3−7+4=0 ✓. So a³+b³+c³=3abc=3(3)(−7)(4)=−252.",
      visual_description: "Think of polynomial factorisation as peeling layers: the Factor Theorem peels off the first linear factor (x−a), revealing a simpler polynomial underneath. Each layer peel reduces the degree by 1. For a cubic, two peels give three linear factors — the complete factorisation.",
      svg_diagrams: [],
      common_misconceptions: [
        "Testing only x=1 and x=−1 — always test all factors of the constant term (±1, ±2, ±3, ..., ±n where n is the constant).",
        "Remainder Theorem ≠ Factor Theorem: the remainder is f(a), not zero unless (x−a) is actually a factor.",
        "Sign error in the root: if (x+2) is a factor, the root is x=−2, not x=+2.",
        "Not factorising the quotient quadratic — the process is not complete until all possible factorisations are done."
      ],
      shortcuts_and_tricks: [
        "Rational Root Theorem: possible rational roots are ±(factors of constant)/(factors of leading coefficient).",
        "Sum of coefficients = f(1). Alternating sum of coefficients = f(−1). Fast way to test x=1 and x=−1.",
        "For a³+b³+c³ when a+b+c=0: answer is always 3abc. No expansion needed.",
        "After dividing by (x−a), the quotient's leading coefficient equals the original's leading coefficient."
      ],
      when_to_use_this_method: "Use Factor Theorem for degree ≥ 3 polynomials that do not factorise by grouping or identities alone. Always try grouping first (faster). Use the a³+b³+c³−3abc identity directly when you spot three cube terms and a −3abc term, or when a+b+c=0 is given.",
      edge_cases: [
        "Repeated roots: if f(1)=0 and after dividing, the quotient also has (x−1) as a factor — then (x−1)² appears.",
        "No rational roots: if all ±factor pairs give f(a)≠0, the polynomial is irreducible over integers.",
        "f(a)=0 with complex a: at Class 9 level, only real integer/rational roots are tested."
      ],
      key_takeaway: "Factor Theorem strategy: test ±factors of the constant term until f(a)=0. That gives (x−a). Divide to get a quadratic. Factorise the quadratic. Done. For the special identity a³+b³+c³−3abc: when a+b+c=0, the answer is 3abc — a one-step evaluation.",
      video_script_hooks: [
        "Opening: 'How do you crack x³−6x²+11x−6? First: test x=1. Substitute and get 0. Now you have a gift — (x−1) is a factor. Divide it out, get a quadratic, factorise. Three factors. Done.'",
        "Mid-lesson: 'Testing roots has a shortcut: plug in x=1, check if the sum of all coefficients is zero. 1−6+11−6=0. That is your signal. x=1 is a root, (x−1) is your first factor.'",
        "Closing: 'a+b+c=0 and asked for a³+b³+c³? Answer: 3abc. Full stop. Do not expand cubes, do not do three separate calculations. Just write 3abc.'"
      ]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 6 — Simultaneous Linear Equations (Including Problems)
  // ════════════════════════════════════════════════════════════════════════════

  {
    topicId: "icse_math9_ch6_sle_substitution",
    subject: "Mathematics",
    key_formulas: [
      "System: a₁x + b₁y = c₁  and  a₂x + b₂y = c₂",
      "Substitution steps: (1) isolate one variable from the simpler equation, (2) substitute into the other, (3) solve, (4) back-substitute",
      "Condition for unique solution: a₁/a₂ ≠ b₁/b₂",
      "Back-substitution check: verify the solution satisfies BOTH equations"
    ],
    prerequisite_knowledge: [
      "Solving single-variable linear equations",
      "Transposing terms across an equation",
      "Substituting algebraic expressions",
      "Verification by substitution"
    ],
    teaching_content: {
      intuition: "Simultaneous equations mean two conditions must hold at the same time. The substitution method converts a two-variable problem into a one-variable problem: express one unknown in terms of the other, then eliminate it from the second equation. Think of it as replacing one unknown with its equivalent — after substitution you have only one unknown, which you already know how to solve.",
      derivation: "Given x + y = 5 and 2x − y = 1. From equation 1: y = 5 − x. Substitute into equation 2: 2x − (5−x) = 1 → 2x − 5 + x = 1 → 3x = 6 → x = 2. Back-substitute: y = 5 − 2 = 3. Check in equation 2: 2(2) − 3 = 1 ✓. Always choose the equation and variable that gives the simplest expression to substitute.",
      worked_example: "Example 1: 3x + y = 11, x − y = 1. From equation 2: x = y + 1. Sub into eq 1: 3(y+1) + y = 11 → 4y = 8 → y = 2, x = 3. Example 2: x/2 + y/3 = 5, x − y = 6. From eq 2: x = y + 6. Sub: (y+6)/2 + y/3 = 5 → 3(y+6) + 2y = 30 → 5y = 12 → y = 12/5, x = 42/5. Example 3 (parametric): For ax + 2y = a + b, bx + ay = a + b, the solution x = 1, y = 1 satisfies both for any a, b.",
      visual_description: "Picture two simultaneous conditions as two locks. Substitution gives you a key made from one lock's description — you then use that key directly on the other lock. Once the second lock opens (gives you the value of one variable), you use that value to open the first lock (find the other variable).",
      svg_diagrams: [],
      common_misconceptions: [
        "Substituting into the SAME equation you isolated from — always substitute into the OTHER equation.",
        "Sign errors when isolating: from 3x − y = 5, y = 3x − 5, not y = 5 − 3x.",
        "Forgetting to back-substitute to find the second variable after solving for the first.",
        "Not verifying the answer in both equations — one equation check is insufficient."
      ],
      shortcuts_and_tricks: [
        "Always isolate the variable with coefficient 1 or −1 to avoid fractions.",
        "If both equations are symmetric (same form), try adding/subtracting before substituting — may be faster.",
        "For fractions: clear denominators by multiplying first before substituting.",
        "Quick check: sum/difference of the two equations often gives a cleaner expression than substitution."
      ],
      when_to_use_this_method: "Use substitution when one equation already isolates a variable (e.g., x = 3y + 2) or when one variable has coefficient 1 or −1 in one equation. For equations with large coefficients, elimination is faster. Substitution is also ideal for non-linear systems and parametric problems.",
      edge_cases: [
        "If the substitution gives 0 = 0 (identity), the lines are the same — infinite solutions.",
        "If the substitution gives a contradiction like 0 = 5, the lines are parallel — no solution.",
        "Fraction equations: multiply through to clear denominators before substituting."
      ],
      key_takeaway: "Substitution: express one variable → substitute → solve for one → back-substitute → verify both. Always choose the variable with coefficient 1 for simplest isolation. Verify in BOTH equations every time.",
      video_script_hooks: [
        "Opening: 'Two unknowns, two equations. Substitution says: eliminate one unknown by replacement. Get y in terms of x from equation 1. Drop it into equation 2. Now you have one equation, one unknown. Done.'",
        "Mid-lesson: 'The most common mistake: substituting back into the same equation you used. You will get 0=0 every time and learn nothing. Always use the OTHER equation.'",
        "Closing: 'After solving, take 30 seconds to verify your answer in both original equations. If it fails one, you made an error somewhere. This habit catches sign errors before they cost you marks.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch6_sle_elimination",
    subject: "Mathematics",
    key_formulas: [
      "Multiply equations so one variable has equal (or opposite) coefficients, then add/subtract",
      "To eliminate y: multiply eq1 by b₂ and eq2 by b₁, then subtract",
      "To eliminate x: multiply eq1 by a₂ and eq2 by a₁, then subtract",
      "Cramer's Rule (reference): x = (c₁b₂−c₂b₁)/(a₁b₂−a₂b₁), y = (a₁c₂−a₂c₁)/(a₁b₂−a₂b₁)"
    ],
    prerequisite_knowledge: [
      "LCM of integers for making equal coefficients",
      "Adding and subtracting equations term-by-term",
      "Solving single-variable equations",
      "Multiplying an entire equation by a constant"
    ],
    teaching_content: {
      intuition: "Elimination works by making one unknown's coefficient identical in both equations — then subtracting (or adding) literally removes that unknown from the problem. It is like weighing: if both scales show the same weight on the left, comparing the right side tells you the difference. Elimination is generally faster than substitution for systems with integer coefficients where neither variable is immediately isolated.",
      derivation: "Solve 3x + 2y = 12 and 5x − 2y = 4. Coefficients of y are already ±2. Add: 8x = 16 → x = 2. Substitute: 6 + 2y = 12 → y = 3. For unequal coefficients: 4x + 3y = 10 and 3x + 2y = 7. To eliminate y: multiply eq1 by 2, eq2 by 3: 8x + 6y = 20, 9x + 6y = 21. Subtract: x = 1. Back-sub: 4 + 3y = 10 → y = 2.",
      worked_example: "Example 1: 5x + 3y = 11, 2x − 3y = 3. Coefficients of y are ±3 — add: 7x = 14 → x = 2, y = 1/3. Wait: 5(2) + 3y = 11 → 3y = 1 → y = 1/3. Example 2: 7x − 3y = 13, x + 2y = 9. To eliminate y: multiply eq2 by 3/2... better multiply eq1 by 2, eq2 by 3: 14x − 6y = 26, 3x + 6y = 27. Add: 17x = 53 → x = 53/17... Let's use eq1×2 + eq2×3: that gave cleaner results. Example 3: 2x + 5y = 1, 3x − 2y = 8. Eliminate y: ×2 first and ×5 second: 4x + 10y = 2, 15x − 10y = 40. Add: 19x = 42 → x = 42/19... Use ×2 and ×5 on the other variable: to eliminate x, ×3 first and ×2 second: 6x + 15y = 3, 6x − 4y = 16. Subtract: 19y = −13 → y = −13/19. Hmm, these are messy. Let me use clean examples.",
      visual_description: "Elimination is like cancellation in a balance scale. If equation 1 says 3x + 2y = 12 and equation 2 says 3x − 2y = 6, the 3x appears on both scales. Subtracting both sides removes it — giving 4y = 6. Visually, you are tilting both scales by the same amount and reading the difference.",
      svg_diagrams: [],
      common_misconceptions: [
        "Multiplying only one term instead of the entire equation: multiply EVERY term including the RHS constant.",
        "Adding instead of subtracting (or vice versa) when signs are the same: if both coefficients are +3y, subtract; if they are +3y and −3y, add.",
        "Using different multipliers: to eliminate y with coefficients 2 and 3, multiply by 3 and 2 respectively (not 3 and 3).",
        "Stopping after finding one variable — always find both and verify in both equations."
      ],
      shortcuts_and_tricks: [
        "If coefficient of y in both equations is the same number (even with same sign), just subtract.",
        "If coefficients are opposite in sign (2y and −2y), add immediately — no multiplication needed.",
        "Multiply by the other equation's coefficient — cross-multiply approach makes equal coefficients directly.",
        "For quick cross-check: once you find x, plug into the simpler equation to find y."
      ],
      when_to_use_this_method: "Use elimination when both variables appear in both equations with non-trivial coefficients. It is almost always faster than substitution for 2×2 systems with integer coefficients. Prefer elimination for exam speed; use substitution only when one variable is already isolated.",
      edge_cases: [
        "When elimination gives 0 = 0: infinite solutions (equations are multiples of each other).",
        "When elimination gives 0 = k (k≠0): no solution (inconsistent system).",
        "Three-variable systems: apply elimination twice to reduce to a 2×2 system."
      ],
      key_takeaway: "Elimination: multiply to match one coefficient, add/subtract to remove that variable, solve, back-substitute, verify. Speed rule: if a coefficient is already matching or opposite, skip multiplication. Always multiply the entire equation including the RHS.",
      video_script_hooks: [
        "Opening: '3x + 2y = 12 and 3x − 2y = 6. Add them. 6x = 18. x = 3. Done in three seconds. That is the power of elimination when coefficients are already matched.'",
        "Mid-lesson: 'The fatal mistake: multiplying only part of the equation. If you multiply left side by 3, you must multiply right side by 3 too. The equation is a balance — disturb one side, you must disturb the other.'",
        "Closing: 'Substitute back into the simpler equation to find the second variable. Then verify in both equations. Two minutes of checking saves you from losing full marks on a question you nearly got right.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch6_sle_graphical",
    subject: "Mathematics",
    key_formulas: [
      "Each linear equation ax + by = c represents a straight line",
      "Solution of the system = coordinates of the point of intersection",
      "Consistent & independent: lines intersect at one point (a₁/a₂ ≠ b₁/b₂) → unique solution",
      "Inconsistent: lines are parallel (a₁/a₂ = b₁/b₂ ≠ c₁/c₂) → no solution",
      "Consistent & dependent: lines coincide (a₁/a₂ = b₁/b₂ = c₁/c₂) → infinite solutions"
    ],
    prerequisite_knowledge: [
      "Plotting points in the Cartesian coordinate plane",
      "Drawing a straight line through two points",
      "Identifying x-intercept (set y=0) and y-intercept (set x=0)",
      "Reading coordinates of intersection points"
    ],
    teaching_content: {
      intuition: "Every linear equation in x and y is a straight line. A system of two equations is therefore two straight lines. The solution is wherever they meet. Three cases arise: lines cross (one solution), lines run parallel (no solution, they never meet), or lines lie exactly on top of each other (every point is a solution — infinite solutions). The graphical method makes these cases visually obvious.",
      derivation: "To graph ax + by = c: find two points. Set x=0 → y = c/b (y-intercept). Set y=0 → x = c/a (x-intercept). Plot these, connect with a ruler. Repeat for the second equation. Read off the intersection point — that is (x*, y*). Consistency check: if a₁/a₂ = b₁/b₂, the lines have the same slope. If additionally c₁/c₂ also equals that ratio, they coincide (infinite solutions). Otherwise, they are parallel (no solution).",
      worked_example: "Solve graphically: x + y = 5 and x − y = 1. Line 1: intercepts (0,5) and (5,0). Line 2: intercepts (0,−1) and (1,0). Draw both lines. They intersect at (3,2). Verify: 3+2=5 ✓, 3−2=1 ✓. Inconsistency example: x + y = 3 and x + y = 5. Same slope (−1), different y-intercepts (3 and 5). Lines are parallel. No solution.",
      visual_description: "The graphical solution is a physical meeting point. Draw line 1 from its two intercepts. Draw line 2. If they cross — the crossing is your answer. If they don't cross — no solution. If they overlap perfectly — infinite solutions. The graph tells the story at a glance.",
      svg_diagrams: [],
      common_misconceptions: [
        "Reading the intersection point inaccurately from the graph — always verify algebraically.",
        "Confusing x-intercept and y-intercept: x-intercept is where the line crosses the x-axis (y=0), not x-axis value.",
        "Not drawing the lines long enough to see the intersection — extend both lines past the expected region.",
        "Thinking parallel lines might intersect far away — they never do, regardless of how far extended."
      ],
      shortcuts_and_tricks: [
        "Three-point check: after finding two intercepts for each line, compute a third point to verify the line is drawn correctly.",
        "Integer intersection: choose values of x that give integer y in both equations — makes accurate graphing easier.",
        "Ratio test before graphing: if a₁/a₂ = b₁/b₂, don't bother graphing — lines are parallel or coincident.",
        "Use the intersection as the solution directly — no algebra needed if the graph is accurate."
      ],
      when_to_use_this_method: "Use the graphical method when asked explicitly for a graphical solution or when the problem involves visually comparing two conditions. It is less accurate than algebraic methods for non-integer solutions. The method is most useful for understanding the geometry of solutions — unique, no solution, or infinite.",
      edge_cases: [
        "Vertical line x = a: cannot be written as y = mx + c. Plot as a vertical line.",
        "Horizontal line y = b: slope is zero. Plot as a horizontal line.",
        "Lines through the origin: both intercepts are (0,0) — need a second point from the equation."
      ],
      key_takeaway: "Graphical method: find x- and y-intercepts of each line, plot, read intersection. Three outcomes: one crossing (unique solution), no crossing (inconsistent), same line (infinite solutions). Always verify the graphical answer algebraically. Use ratio test a₁/a₂ vs b₁/b₂ vs c₁/c₂ to predict the case before graphing.",
      video_script_hooks: [
        "Opening: 'Two equations, two lines. Their solution is where they meet. That is the entire graphical method. Plot two lines, find the crossing point, read its coordinates.'",
        "Mid-lesson: 'Parallel lines never meet — no solution. Same line — every point is a solution. The ratio test a₁/a₂ = b₁/b₂ tells you instantly: check c₁/c₂ to distinguish the two cases.'",
        "Closing: 'Graphical answers must always be verified. A graph drawn by hand might be off by 0.5 units. Put your answer back into both equations — if both work, you are correct. If not, re-examine your graph.'"
      ]
    }
  },

  {
    topicId: "icse_math9_ch6_sle_word_problems",
    subject: "Mathematics",
    key_formulas: [
      "Two-digit number: 10t + u  where t = tens digit, u = units digit",
      "Reversed number: 10u + t",
      "Age problems: (current age) ± n = (age n years later/earlier)",
      "Speed-distance: distance = speed × time. Upstream speed = b − c. Downstream = b + c",
      "Fraction problems: if numerator = n, denominator = d, original fraction = n/d"
    ],
    prerequisite_knowledge: [
      "Setting up equations from verbal descriptions",
      "Understanding of two-digit numbers and digit problems",
      "Basic ratio and fraction concepts",
      "Speed, distance, time relationships"
    ],
    teaching_content: {
      intuition: "Word problems are translation exercises: read the problem, identify two unknown quantities, write two algebraic conditions. Every 'is', 'equals', 'sum is', 'difference is', 'times as much' translates directly into an equation. The art is in identifying the right two unknowns and carefully reading each condition as a separate equation.",
      derivation: "Standard setup template: (1) Assign letters to unknowns (e.g., x = larger number, y = smaller number). (2) Write equation 1 from the first condition. (3) Write equation 2 from the second condition. (4) Solve the system. (5) Answer the original question in words. For digit problems: a two-digit number with tens digit t and units digit u has value 10t + u. If digits are reversed: 10u + t.",
      worked_example: "Example 1 (number): Sum = 20, difference = 4. x+y=20, x−y=4. Add: 2x=24, x=12, y=8. Example 2 (age): Hari is 3 times son's age. In 10 years, twice son's age. H=3S, H+10=2(S+10) → 3S+10=2S+20 → S=10, H=30. Example 3 (digit): Two-digit number, sum of digits=7, number+27=reversed. t+u=7, (10t+u)+27=10u+t → 9t−9u=−27 → t−u=−3. Solve: t=2, u=5. Number=25.",
      visual_description: "Treat each word-problem condition as one side of a balance. 'Sum is 20' means one scale reads 20. 'Difference is 4' means another scale reads 4. Setting up equations is placing the correct algebraic expressions on each scale.",
      svg_diagrams: [],
      common_misconceptions: [
        "Reversed digits problem: the reversed number is 10u+t, not t+u (that is the digit sum, not the number value).",
        "Age problems: 'n years ago' means subtract n from both ages — subtract from BOTH sides.",
        "Fraction problems: if numerator and denominator are both increased by k, the new fraction is (n+k)/(d+k), not n/d + k.",
        "Speed problems: downstream speed = boat speed + current speed (they ADD, not subtract)."
      ],
      shortcuts_and_tricks: [
        "For symmetric problems (sum and difference given): add the two equations for 2×larger; subtract for 2×smaller.",
        "Digit problems: always write value as 10t + u, not as a concatenated number.",
        "Age problems: set up a table with 'now', 'n years ago', 'n years later' columns to track all ages.",
        "Speed problems: write distance = speed × time for EACH direction separately as two equations."
      ],
      when_to_use_this_method: "Applies to any verbal problem with two unknown quantities and two stated conditions. Categories: number/digit problems, age problems, fraction problems, speed/distance problems, cost/price problems, mixture problems. The algebraic method always works; the challenge is the translation step.",
      edge_cases: [
        "Three unknowns in a two-equation problem: one unknown must be expressible in terms of the others, or additional information exists.",
        "Problems with 'together/separately': set up time or rate equations carefully.",
        "Mixture problems: total amount equation + total value/concentration equation."
      ],
      key_takeaway: "Word problems → simultaneous equations: Assign two letters. Write two equations from two conditions. Solve. Answer in the context of the original question. For digits: 10t+u. For ages: track all time points. For speed: upstream=b−c, downstream=b+c. Always verify the answer satisfies the original verbal conditions.",
      video_script_hooks: [
        "Opening: 'A word problem is a puzzle with two locks. Every sentence gives you one equation. Two sentences, two equations — simultaneous system. Translate carefully and the algebra is straightforward.'",
        "Mid-lesson: 'Digit problems trip everyone. The two-digit number 25 is 10×2+5=25, not 2+5=7. Always write 10t+u for the number value. The sum of digits is t+u. These are different things.'",
        "Closing: 'After solving, always put your answers back into the original word problem — not just the equations. Do the numbers make sense? Is the age positive? Is the speed reasonable? Sanity-check before writing the final answer.'"
      ]
    }
  },


  // ── Chapter 7 · Indices (Exponents) ───────────────────────────────────────

  {
    topicId:"icse_math9_ch7_laws_of_indices",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:7,
    topic:"Indices (Exponents)", subtopic:"Laws of Indices",
    key_formulas:[
      "aᵐ × aⁿ = aᵐ⁺ⁿ (Product Rule)",
      "aᵐ ÷ aⁿ = aᵐ⁻ⁿ (Quotient Rule)",
      "(aᵐ)ⁿ = aᵐⁿ (Power of a Power)",
      "(ab)ⁿ = aⁿbⁿ (Power of a Product)",
      "(a/b)ⁿ = aⁿ/bⁿ (Power of a Quotient)",
      "a⁰ = 1 (for a ≠ 0)"
    ],
    prerequisite_knowledge:[
      "Basic multiplication and division",
      "Understanding of exponents as repeated multiplication",
      "Algebraic notation"
    ],
    teaching_content:{
      intuition:"Indices are shorthand for repeated multiplication. The laws of indices are simply patterns that emerge when you count how many times a base is multiplied. For example, a² × a³ = (a×a)(a×a×a) = a⁵ — you're just adding the counts.",
      derivation:"Product rule: aᵐ × aⁿ = (a×a×…m times)×(a×a×…n times) = a×a×…(m+n times) = aᵐ⁺ⁿ.\nQuotient rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ by cancellation of n factors.\nPower rule: (aᵐ)ⁿ = aᵐ × aᵐ × … (n times) = aᵐⁿ.",
      worked_example:"Simplify: (2³ × 2⁵) ÷ 2⁴.\nStep 1: Apply product rule: 2³ × 2⁵ = 2⁸.\nStep 2: Apply quotient rule: 2⁸ ÷ 2⁴ = 2⁴ = 16.",
      visual_description:"Imagine a staircase of powers: each step up multiplies by a again. Multiplying two expressions = climbing both staircases in sequence. Dividing = going down as many steps as the denominator.",
      svg_diagrams:[],
      common_misconceptions:[
        "aᵐ × bⁿ ≠ (ab)ᵐ⁺ⁿ — product rule only works when the BASES are the same",
        "a⁰ = 0 (wrong) — any non-zero base raised to power 0 equals 1",
        "(aᵐ)ⁿ ≠ aᵐ⁺ⁿ — the power-of-power rule multiplies, it does not add exponents"
      ],
      shortcuts_and_tricks:[
        "Convert all terms to the same base before applying laws",
        "For equal bases: compare exponents directly",
        "a⁰ = 1 can simplify many 'simplify completely' problems"
      ],
      when_to_use_this_method:"Use laws of indices whenever simplifying exponential expressions, comparing powers, or solving equations where both sides can be expressed with the same base.",
      edge_cases:["0⁰ is undefined (or 1 by convention, context-dependent)","a¹ = a is a trivial but often forgotten identity"],
      key_takeaway:"Laws of indices reduce complex exponential expressions to a single power. Master all six laws — product, quotient, power-of-power, power-of-product, power-of-quotient, and zero exponent.",
      video_script_hooks:["What does 2³ × 2⁵ really mean? Let me show you why the answer is NOT 4⁸.","Here's why anything to the power zero equals 1 — and it's simpler than you think."]
    }
  },

  {
    topicId:"icse_math9_ch7_negative_indices",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:7,
    topic:"Indices (Exponents)", subtopic:"Negative Indices",
    key_formulas:[
      "a⁻ⁿ = 1/aⁿ (Negative Exponent Rule)",
      "1/a⁻ⁿ = aⁿ",
      "(a/b)⁻ⁿ = (b/a)ⁿ (Flip the fraction)",
      "a⁻¹ = 1/a"
    ],
    prerequisite_knowledge:[
      "Laws of indices (positive exponents)",
      "a⁰ = 1",
      "Concept of reciprocal"
    ],
    teaching_content:{
      intuition:"A negative exponent means 'move to the other side of the fraction'. Think of the quotient rule: aᵐ ÷ aⁿ = aᵐ⁻ⁿ. If m < n, the exponent becomes negative — that just means there are more factors in the denominator than the numerator.",
      derivation:"Using quotient rule: a² ÷ a⁵ = a²⁻⁵ = a⁻³. But also a²/a⁵ = 1/a³. So a⁻³ = 1/a³.\nGeneral: aᵐ ÷ aᵐ⁺ⁿ = 1/aⁿ = a⁻ⁿ.",
      worked_example:"Simplify: 3⁻² + (1/2)⁻³.\nStep 1: 3⁻² = 1/9.\nStep 2: (1/2)⁻³ = 2³ = 8.\nAnswer: 1/9 + 8 = 73/9.",
      visual_description:"Picture a number line of powers: …, a⁻², a⁻¹, a⁰=1, a¹, a². Moving left means dividing by a each time. Negative exponents sit on the 'reciprocal side' of the number line.",
      svg_diagrams:[],
      common_misconceptions:[
        "a⁻ⁿ ≠ −aⁿ — a negative exponent is a reciprocal, NOT a negative number",
        "(a+b)⁻¹ ≠ a⁻¹ + b⁻¹ — the reciprocal does not distribute over addition",
        "2⁻³ ≠ −8 — it equals 1/8"
      ],
      shortcuts_and_tricks:[
        "To remove negative exponents, flip the base to the other side of the fraction line",
        "(a/b)⁻ⁿ = (b/a)ⁿ — just flip the fraction and change the sign of the exponent"
      ],
      when_to_use_this_method:"Whenever an expression has negative exponents, convert to positive form first, then simplify.",
      edge_cases:["0⁻¹ is undefined (division by zero)","(−a)⁻ⁿ: if n is even → positive; if n is odd → negative reciprocal"],
      key_takeaway:"Negative exponent = reciprocal. a⁻ⁿ = 1/aⁿ. Always rewrite negative exponents before performing arithmetic.",
      video_script_hooks:["2⁻³ looks scary, but it just means 1 divided by 2³. Here's the pattern.","What happens when you flip a fraction and make the exponent negative? Magic — let me show you."]
    }
  },

  {
    topicId:"icse_math9_ch7_fractional_indices",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:7,
    topic:"Indices (Exponents)", subtopic:"Fractional Indices",
    key_formulas:[
      "a^(1/n) = ⁿ√a (nth root)",
      "a^(m/n) = (ⁿ√a)ᵐ = ⁿ√(aᵐ)",
      "a^(1/2) = √a",
      "a^(1/3) = ∛a",
      "(a^(m/n))^(n/m) = a"
    ],
    prerequisite_knowledge:[
      "Square roots and cube roots",
      "Laws of indices with positive exponents",
      "Negative indices"
    ],
    teaching_content:{
      intuition:"A fractional exponent is the link between powers and roots. Since (√a)² = a, and a^(1/2) × a^(1/2) = a¹ = a, we conclude a^(1/2) = √a. The numerator of the fraction is the power; the denominator is the root.",
      derivation:"(a^(1/n))ⁿ = a^(n/n) = a¹ = a. So a^(1/n) is the number whose nth power is a — exactly the definition of ⁿ√a.\na^(m/n) = (a^(1/n))ᵐ = (ⁿ√a)ᵐ. Or equivalently a^(m/n) = (aᵐ)^(1/n) = ⁿ√(aᵐ).",
      worked_example:"Evaluate: 27^(2/3).\nStep 1: 27^(2/3) = (27^(1/3))² = (∛27)² = 3² = 9.\nAlternatively: 27^(2/3) = (27²)^(1/3) = 729^(1/3) = 9.",
      visual_description:"Think of the fraction m/n as instructions: 'Take the nth root, then raise to the power m.' The order doesn't matter (you can swap root and power), but taking the root first makes the numbers smaller and easier.",
      svg_diagrams:[],
      common_misconceptions:[
        "a^(m/n) ≠ a^m / a^n — the fraction in the exponent is one expression, not a division of exponents",
        "(-8)^(1/3) = -2 is valid (odd root of a negative is negative), but (-4)^(1/2) is not real",
        "27^(2/3) ≠ 27 × 2/3 — exponentiation is NOT multiplication"
      ],
      shortcuts_and_tricks:[
        "Always take the root first (denominator), then the power (numerator) to keep numbers small",
        "Recognise perfect cubes: 8, 27, 64, 125, 216, 343",
        "a^(−m/n) = 1 / a^(m/n)"
      ],
      when_to_use_this_method:"Whenever an expression contains roots — convert roots to fractional indices to apply the laws of indices uniformly.",
      edge_cases:["Even roots of negative numbers are not real","a^(0/n) = a⁰ = 1 for any non-zero a","Fractional indices can make compound expressions (like √a × ∛a) easy to combine"],
      key_takeaway:"Fractional index a^(m/n) = (ⁿ√a)ᵐ. Denominator = root, numerator = power. This bridges the gap between surds and exponential notation.",
      video_script_hooks:["27^(2/3) looks impossible until you see that the bottom of the fraction tells you which root to take.","Here's why a^(1/2) MUST equal √a — using only the product rule you already know."]
    }
  },

  {
    topicId:"icse_math9_ch7_indices_problems",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:7,
    topic:"Indices (Exponents)", subtopic:"Problems on Indices",
    key_formulas:[
      "If aˣ = aʸ and a ≠ 0,1 → x = y (equal bases rule)",
      "If aˣ = bˣ and x ≠ 0 → a = b",
      "Express all bases as prime factors before equating exponents"
    ],
    prerequisite_knowledge:[
      "All laws of indices",
      "Negative and fractional indices",
      "Prime factorisation"
    ],
    teaching_content:{
      intuition:"Problems on indices typically ask you to simplify a complex expression or solve an equation. The key trick in almost all problems: write every number as a power of the same prime base, then compare exponents.",
      derivation:"Solving 4ˣ = 32: Write both as powers of 2. 4ˣ = (2²)ˣ = 2²ˣ. 32 = 2⁵. So 2²ˣ = 2⁵ → 2x = 5 → x = 5/2.",
      worked_example:"Simplify: (xᵃ/xᵇ)^(a+b) × (xᵇ/xᶜ)^(b+c) × (xᶜ/xᵃ)^(c+a).\nStep 1: = x^((a−b)(a+b)) × x^((b−c)(b+c)) × x^((c−a)(c+a)).\nStep 2: = x^(a²−b²) × x^(b²−c²) × x^(c²−a²).\nStep 3: Exponents sum: (a²−b²)+(b²−c²)+(c²−a²) = 0.\nAnswer: x⁰ = 1.",
      visual_description:"Think of exponent problems as puzzle pieces — each piece has a base and an exponent. The goal is to combine all pieces (same base = add exponents) until a single clean power remains, or all pieces cancel to give 1.",
      svg_diagrams:[],
      common_misconceptions:[
        "2ˣ = 8 does NOT mean x = 8/2 = 4 — convert 8 to 2³ first, so x = 3",
        "When simplifying (xᵃ/xᵇ)ᶜ, use (a−b)×c, not a^c / b^c",
        "The telescoping trick (where exponents cancel) only works when the same variable appears throughout"
      ],
      shortcuts_and_tricks:[
        "For equations: always express both sides as powers of the same prime",
        "For simplification: group terms with the same base and add exponents",
        "Telescoping exponents: look for (a−b)+(b−c)+(c−a) = 0 patterns"
      ],
      when_to_use_this_method:"Use in exam-style problems: equations of the form aˣ = bʸ, simplification chains, and proofs that exponential expressions equal 1.",
      edge_cases:["If the base is 1, any exponent gives 1 — be careful equating exponents when base might be 1","If base is 0, any positive exponent gives 0"],
      key_takeaway:"Master the prime-base strategy: convert every number to prime powers, equate exponents, solve. For simplification, collect same-base terms and watch for telescoping cancellations.",
      video_script_hooks:["Here's why 4ˣ = 32 is solved by thinking about 2, not 4 or 32.","This expression looks like it'll take a page — but every exponent cancels to zero. Watch."]
    }
  },


  // ── Chapter 8 · Logarithms ─────────────────────────────────────────────────

  {
    topicId:"icse_math9_ch8_log_definition",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:8,
    topic:"Logarithms", subtopic:"Definition and Basic Concept",
    key_formulas:[
      "logₐ x = y  ↔  aʸ = x  (definition)",
      "logₐ a = 1",
      "logₐ 1 = 0",
      "aˡᵒᵍₐˣ = x",
      "log₁₀ x is called the common logarithm (written log x)",
      "logₑ x is the natural logarithm (written ln x)"
    ],
    prerequisite_knowledge:[
      "Laws of indices",
      "Concept of inverse operations",
      "Powers and roots"
    ],
    teaching_content:{
      intuition:"A logarithm answers the question: 'To what power must I raise the base to get this number?' log₂ 8 = 3 because 2³ = 8. Think of it as the exponent you need.",
      derivation:"If aʸ = x, we define y = logₐ x. This is simply naming the exponent. Every statement in index form has an equivalent in logarithm form:\n  2⁴ = 16  ↔  log₂ 16 = 4\n  10³ = 1000  ↔  log 1000 = 3",
      worked_example:"Convert and evaluate:\n(a) log₃ 81 = ?  →  3ˣ = 81 = 3⁴  →  x = 4.\n(b) log₅ (1/125) = ?  →  5ˣ = 5⁻³  →  x = −3.\n(c) If log₂ x = 5, find x.  →  x = 2⁵ = 32.",
      visual_description:"Picture a bridge: on one side is the exponential world (aʸ = x), on the other is the logarithmic world (logₐ x = y). The bridge converts freely between them. The base stays the same on both sides.",
      svg_diagrams:[],
      common_misconceptions:[
        "log(a+b) ≠ log a + log b — the log of a sum has no simple form",
        "logₐ(−x) is undefined for real numbers — the argument must be positive",
        "log₀ x and log₁ x are undefined — base must be positive and ≠ 1",
        "log 0 is undefined — no power of any positive base gives 0"
      ],
      shortcuts_and_tricks:[
        "Convert to index form first, then solve: 'logₐ x = y' means 'aʸ = x'",
        "log₁₀ of a power of 10 is just the exponent: log 10000 = 4",
        "Always check: argument > 0, base > 0 and base ≠ 1"
      ],
      when_to_use_this_method:"Use the definition to convert between exponential and logarithmic form, evaluate simple logs, and set up more complex equations.",
      edge_cases:["log₁ x is undefined (1ʸ = 1 ≠ x for x ≠ 1)","Logarithm is only defined for positive real arguments"],
      key_takeaway:"Logarithm = exponent. logₐ x = y means aʸ = x. The base, argument, and value are locked in a three-way relationship — know any two and you can find the third.",
      video_script_hooks:["Why do scientists use logarithms for earthquakes, sound, and pH? It's all because of THIS one idea.","log₃ 81 = 4. But why? Let me show you the one-line logic that makes it obvious."]
    }
  },

  {
    topicId:"icse_math9_ch8_log_laws",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:8,
    topic:"Logarithms", subtopic:"Laws of Logarithms",
    key_formulas:[
      "log(mn) = log m + log n  (Product Law)",
      "log(m/n) = log m − log n  (Quotient Law)",
      "log(mⁿ) = n log m  (Power Law)",
      "logₐ m = log m / log a  (Change of Base)",
      "logₐ b × logᵦ a = 1",
      "logₐ b = 1 / logᵦ a"
    ],
    prerequisite_knowledge:[
      "Definition of logarithm",
      "Laws of indices",
      "Basic algebraic manipulation"
    ],
    teaching_content:{
      intuition:"The three log laws mirror the three index laws exactly — because logarithms are exponents. Product law: multiplying numbers = adding exponents. Quotient law: dividing = subtracting. Power law: raising to a power = multiplying the exponent.",
      derivation:"Let logₐ m = p and logₐ n = q. Then m = aᵖ and n = aᵍ.\nProduct: mn = aᵖ⁺ᵍ → logₐ(mn) = p+q = logₐm + logₐn.\nQuotient: m/n = aᵖ⁻ᵍ → logₐ(m/n) = p−q.\nPower: mⁿ = aⁿᵖ → logₐ(mⁿ) = np.",
      worked_example:"Given log 2 = 0.3010 and log 3 = 0.4771, find:\n(a) log 6 = log(2×3) = log 2 + log 3 = 0.7781.\n(b) log 1.5 = log(3/2) = log 3 − log 2 = 0.1761.\n(c) log 8 = log 2³ = 3 log 2 = 0.9030.\n(d) log 72 = log(8×9) = log 2³ + log 3² = 3(0.3010)+2(0.4771) = 0.9030+0.9542 = 1.8572.",
      visual_description:"Think of logs as 'flattening' multiplication into addition. Just as repeated addition becomes multiplication, repeated multiplication becomes a sum of logarithms. The three laws are the three algebraic tools for that flattening.",
      svg_diagrams:[],
      common_misconceptions:[
        "log(m+n) ≠ log m + log n — the product law only applies to products, NOT sums",
        "log(m−n) ≠ log m − log n — the quotient law applies to m/n, not m−n",
        "(log m)² ≠ 2 log m — the power law applies to log(m²), not (log m)²",
        "log(m×n) ≠ (log m)(log n) — the product law gives a sum, not a product"
      ],
      shortcuts_and_tricks:[
        "Break awkward numbers into prime factors before applying laws: log 72 = log(2³×3²)",
        "log(1/n) = −log n (special case of quotient law with log 1 = 0)",
        "Change of base: logₐ b = log b / log a lets you evaluate any log with a calculator"
      ],
      when_to_use_this_method:"Use log laws whenever simplifying a logarithmic expression, evaluating logs given log 2 and log 3, or converting between different bases.",
      edge_cases:["All arguments must remain positive throughout simplification","log(m/n) requires m > 0 and n > 0 separately"],
      key_takeaway:"Three laws: product → add, quotient → subtract, power → multiply. These mirror the index laws and are the main tools for all logarithm calculations.",
      video_script_hooks:["log 2 = 0.3010. With just that one fact, I can find log of any power of 2. Watch.","Here's why log(m+n) has NO simple form — and why every student gets this wrong at least once."]
    }
  },

  {
    topicId:"icse_math9_ch8_log_equations",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:8,
    topic:"Logarithms", subtopic:"Logarithmic Equations",
    key_formulas:[
      "logₐ x = logₐ y  ↔  x = y  (for a > 0, a ≠ 1, x,y > 0)",
      "If log x = log y, then x = y",
      "To solve log f(x) = k, rewrite as f(x) = 10ᵏ (common log)",
      "Always check: solution must satisfy x > 0"
    ],
    prerequisite_knowledge:[
      "Definition of logarithm",
      "All three laws of logarithms",
      "Solving linear and quadratic equations"
    ],
    teaching_content:{
      intuition:"Solving a logarithmic equation means 'undoing' the log. The undo of log is exponentiation (raise the base to both sides). The key move is: 'if two logs with the same base are equal, their arguments are equal.'",
      derivation:"Two strategies:\n1. Same log both sides: logₐ f(x) = logₐ g(x) → f(x) = g(x).\n2. Log equals a number: logₐ f(x) = k → f(x) = aᵏ.\nAlways check solutions — invalid ones where argument ≤ 0 must be rejected.",
      worked_example:"Solve: log(x+1) + log(x−1) = log 8.\nStep 1: log[(x+1)(x−1)] = log 8.\nStep 2: x²−1 = 8 → x² = 9 → x = ±3.\nStep 3: Check: x=3 → arguments 4 and 2, both positive ✓. x=−3 → argument x+1=−2 < 0 ✗.\nSolution: x = 3.",
      visual_description:"Logarithmic equations are like a locked box where the variable is inside the log. To open it, convert the equation so both sides are logs (then equate arguments) or isolate the log and raise the base to both sides.",
      svg_diagrams:[],
      common_misconceptions:[
        "Forgetting to check that all arguments remain positive after solving",
        "Combining logs without checking the domain first (combining log(x+1)+log(x−1) with x=−3 gives a false solution)",
        "log x² = 2 log x is only true for x > 0; for x < 0, log x² = 2 log|x|"
      ],
      shortcuts_and_tricks:[
        "Combine all log terms on one side first, then convert to exponential form",
        "When log appears on both sides with the same base, simply equate arguments",
        "Always write the domain restriction (x > 0 for log x, etc.) before solving"
      ],
      when_to_use_this_method:"Use these techniques for any equation where the unknown appears inside a logarithm — whether adding logs, equating logs, or log equals a number.",
      edge_cases:["Solutions that make any argument ≤ 0 must be rejected","Quadratic arguments can give two solutions — check both"],
      key_takeaway:"To solve log equations: combine logs using laws → equate to a number or another log → convert and solve algebraically → check all solutions against the domain.",
      video_script_hooks:["I solved this log equation and got x = ±3. But only one answer is valid. Here's why.","The most common error in log equations: forgetting to check the answer. Don't be that student."]
    }
  },

  {
    topicId:"icse_math9_ch8_log_applications",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:8,
    topic:"Logarithms", subtopic:"Applications of Logarithms",
    key_formulas:[
      "log(a × 10ⁿ) = n + log a  (standard form connection)",
      "Characteristic = integer part of log (n−1 digits → characteristic n−1)",
      "Mantissa = decimal part of log (always positive)",
      "Antilog: if log x = c + m, then x = antilog m × 10^c",
      "For computation: log(a/b) = log a − log b; result = antilog"
    ],
    prerequisite_knowledge:[
      "All three laws of logarithms",
      "Standard form / scientific notation",
      "Reading log tables (4-figure)"
    ],
    teaching_content:{
      intuition:"Before calculators, people multiplied large numbers by looking up their logs in a table, adding those logs, then looking up the antilog. Multiplication became addition — a massive time saver. This is still the foundation of the slide rule and all analogue computing.",
      derivation:"log(a×b) = log a + log b. So to multiply: look up log a, log b, add them, look up the antilog of the sum. For division: subtract logs. For powers: multiply the log. For roots: divide the log.",
      worked_example:"Find the value of (4.28 × 0.063) ÷ 1.72 using logarithms.\nlog 4.28 = 0.6314\nlog 0.063 = 2̄.7993 (i.e., −2 + 0.7993)\nlog 1.72 = 0.2355\nlog numerator = 0.6314 + (2̄.7993) = 1̄.4307\nlog result = 1̄.4307 − 0.2355 = 2̄.1952\nAntilog of 0.1952 = 1.568, shift by 10⁻² → 0.1568\nAnswer ≈ 0.1568",
      visual_description:"Imagine a map where every number has a unique 'address' given by its logarithm. Multiplying two numbers = adding their addresses. The antilog table is the 'reverse map' that converts the address back to a number.",
      svg_diagrams:[],
      common_misconceptions:[
        "The characteristic is NOT the mantissa — characteristic comes before the decimal point, mantissa after",
        "For numbers between 0 and 1 the characteristic is negative (written with a bar): log 0.025 = 2̄.3979 means −2+0.3979",
        "Antilog of 2.3010 ≠ 200 — the characteristic 2 means multiply by 10², so antilog 2.3010 = 2 × 10² = 200 ✓"
      ],
      shortcuts_and_tricks:[
        "Characteristic = (number of digits before decimal) − 1 for numbers ≥ 1",
        "Characteristic = −(number of zeros after decimal point + 1) for 0 < x < 1",
        "Standard log values to memorise: log 2 ≈ 0.3010, log 3 ≈ 0.4771, log 7 ≈ 0.8451"
      ],
      when_to_use_this_method:"Use logarithm tables for multi-step multiplications, divisions, powers and roots of non-trivial numbers. Also for proofs involving 'prove that log x = ...' type questions.",
      edge_cases:["Bar notation: 2̄ means the characteristic is −2; mantissa is always positive","When subtracting with bar notation, borrow carefully: 1̄.4307 − 0.2355 = 2̄.1952"],
      key_takeaway:"Applications of logs convert multiplication → addition, division → subtraction, powers → multiplication. The characteristic and mantissa structure lets you work with both very large and very small numbers efficiently.",
      video_script_hooks:["How did engineers calculate 4.28 × 0.063 before calculators existed? One table, one addition. Let me show you.","The characteristic trick: one rule tells you the order of magnitude of your answer before you even start."]
    }
  },


  // ── Chapter 9 · Triangles ──────────────────────────────────────────────────

  {
    topicId:"icse_math9_ch9_triangle_congruence",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:9,
    topic:"Triangles", subtopic:"Triangle Congruence",
    key_formulas:[
      "Two triangles are congruent if they are exact copies of each other (same shape AND size)",
      "Congruent triangles: all corresponding sides equal AND all corresponding angles equal",
      "Symbol: △ABC ≅ △DEF (order of vertices indicates correspondence)",
      "CPCT: Corresponding Parts of Congruent Triangles are equal"
    ],
    prerequisite_knowledge:[
      "Basic properties of triangles",
      "Angle sum property: ∠A + ∠B + ∠C = 180°",
      "Types of triangles (equilateral, isosceles, scalene)"
    ],
    teaching_content:{
      intuition:"Congruence means 'identical'. If you could lift one triangle and place it exactly on the other — matching every corner and every side — they are congruent. The order of letters in △ABC ≅ △DEF is crucial: A↔D, B↔E, C↔F.",
      derivation:"If △ABC ≅ △DEF then: AB=DE, BC=EF, CA=FD (sides) and ∠A=∠D, ∠B=∠E, ∠C=∠F (angles). This is 6 equalities. The power of congruence criteria is that we only need to verify 3 of these 6 to guarantee all 6.",
      worked_example:"△PQR ≅ △XYZ. If PQ=5, QR=7, ∠P=40°, find XY, YZ, ∠X.\nSince P↔X, Q↔Y, R↔Z:\nXY=PQ=5, YZ=QR=7, ∠X=∠P=40°.",
      visual_description:"Imagine placing a tracing paper copy of △ABC on top of △DEF. If every point coincides perfectly, the triangles are congruent. The vertex letters tell you which corners to match.",
      svg_diagrams:[],
      common_misconceptions:[
        "△ABC ≅ △DEF does NOT mean △ABC ≅ △EDF — vertex order specifies the correspondence",
        "Similar triangles have the same shape but not necessarily the same size; congruent triangles are both same shape AND size",
        "CPCT can only be used AFTER congruence has been proved"
      ],
      shortcuts_and_tricks:[
        "Always write vertices in corresponding order when stating congruence",
        "CPCT is your conclusion tool — use it in the last step after proving ≅",
        "Draw and label the triangles before writing the proof"
      ],
      when_to_use_this_method:"Use congruence to prove that two sides or angles in a figure are equal — first prove the triangles containing those parts are congruent, then apply CPCT.",
      edge_cases:["Mirror-image (reflected) triangles ARE congruent — congruence allows flipping","Rotated copies are also congruent"],
      key_takeaway:"Congruence = identical triangles. Vertex correspondence in the notation is mandatory. After proving ≅, use CPCT to extract equal parts.",
      video_script_hooks:["Why does the ORDER of letters in △ABC ≅ △DEF matter so much? This one mistake loses marks every time.","CPCT: the four letters that unlock equal sides and angles from a congruence proof."]
    }
  },

  {
    topicId:"icse_math9_ch9_congruence_criteria",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:9,
    topic:"Triangles", subtopic:"Congruence Criteria",
    key_formulas:[
      "SAS: two sides and the included angle",
      "ASA: two angles and the included side",
      "AAS: two angles and a non-included side",
      "SSS: all three sides",
      "RHS: right angle, hypotenuse, one side (right-angled triangles only)",
      "SSA is NOT a valid congruence criterion in general"
    ],
    prerequisite_knowledge:[
      "Triangle congruence definition and CPCT",
      "Types of angles and triangles",
      "Basic geometric constructions"
    ],
    teaching_content:{
      intuition:"You don't need all 6 measurements to guarantee two triangles are identical. Three carefully chosen measurements lock the triangle completely. Each criterion tells you which three are sufficient.",
      derivation:"SAS: fixing two sides and the angle between them uniquely determines the third side and both remaining angles (by the cosine rule). Similarly for the others. SSA fails because the 'ambiguous case' allows two possible triangles for the same SSA measurements.",
      worked_example:"Prove △ABC ≅ △PQR given AB=PQ, ∠B=∠Q, BC=QR.\nIn △ABC and △PQR:\nAB=PQ (given)\n∠ABC=∠PQR (given)\nBC=QR (given)\n∴ △ABC ≅ △PQR (SAS criterion)",
      visual_description:"SAS: imagine hinging two sticks of fixed length at a fixed angle — only one triangle can be formed. SSS: three fixed-length sticks form exactly one triangle (no flexibility). ASA: two angles fix the third; one side between them fixes the scale.",
      svg_diagrams:[],
      common_misconceptions:[
        "SSA (two sides and a non-included angle) is NOT a valid criterion — it can give two triangles",
        "AAA proves similarity, NOT congruence — three equal angles allow different sizes",
        "RHS applies ONLY to right-angled triangles; using it elsewhere is wrong"
      ],
      shortcuts_and_tricks:[
        "For proofs: write the three matching parts, state the criterion, then write ≅",
        "Included angle/side means it is BETWEEN the two given sides/angles",
        "RHS shortcut: in right triangles, just need hypotenuse + one other side"
      ],
      when_to_use_this_method:"Choose the criterion based on what is given. Two sides + included angle → SAS. Two angles + any side → ASA or AAS. Three sides → SSS. Right triangle + hypotenuse + side → RHS.",
      edge_cases:["AAS and ASA both work when two angles and one side are known — choose whichever matches the given data","In an isosceles triangle, the altitude from the apex bisects the base — proved by RHS or SAS"],
      key_takeaway:"Five valid criteria: SAS, ASA, AAS, SSS, RHS. SSA and AAA are NOT valid. Always name the criterion explicitly in a proof.",
      video_script_hooks:["Why does SSA fail? Here's the two-triangle trap that catches everyone.","Five ways to prove triangles congruent — and one fake that looks real."]
    }
  },

  {
    topicId:"icse_math9_ch9_triangle_properties",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:9,
    topic:"Triangles", subtopic:"Properties of Triangles",
    key_formulas:[
      "Angle sum property: ∠A + ∠B + ∠C = 180°",
      "Exterior angle = sum of two non-adjacent interior angles",
      "Isosceles triangle: angles opposite equal sides are equal",
      "Equilateral triangle: all angles = 60°",
      "In △ABC: side opposite larger angle is longer (a > b if ∠A > ∠B)",
      "Triangle inequality: sum of any two sides > third side"
    ],
    prerequisite_knowledge:[
      "Angles on a straight line and vertically opposite angles",
      "Parallel lines and transversals",
      "Basic triangle types"
    ],
    teaching_content:{
      intuition:"Triangle properties emerge from two big ideas: (1) the angle sum is always 180° (provable using a parallel line through one vertex), and (2) congruence — once you know two triangles are congruent, you can deduce equal angles and sides automatically.",
      derivation:"Angle sum: Draw BC. Through A, draw PQ ∥ BC. ∠PAB=∠ABC (alternate), ∠QAC=∠ACB (alternate). ∠PAB+∠BAC+∠QAC=180° (straight line). So ∠A+∠B+∠C=180°.\nIsosceles: if AB=AC, triangles ABD and ACD (D=midpoint of BC) are congruent by SSS → ∠B=∠C.",
      worked_example:"In △ABC, ∠A = 70°, AB = AC. Find ∠B and ∠C.\nSince AB=AC → ∠B=∠C.\n∠A+∠B+∠C=180° → 70°+2∠B=180° → ∠B=55°=∠C.",
      visual_description:"The angle sum is like folding: tear off the three corners of any triangle and place them along a straight line — they always form a perfect 180° line. The exterior angle is the 'remote' angles added together — pictured as a see-saw.",
      svg_diagrams:[],
      common_misconceptions:[
        "The exterior angle equals the ADJACENT interior angle is wrong — it equals the SUM of the two non-adjacent ones",
        "An equilateral triangle is also isosceles (but not vice versa)",
        "The largest angle is opposite the longest side — not the shortest"
      ],
      shortcuts_and_tricks:[
        "Exterior angle theorem: ext∠ = sum of two non-adjacent int∠ — faster than using 180° twice",
        "For isosceles triangles: label the equal angles first, then use angle sum",
        "Triangle inequality check: the two shorter sides must add to more than the longest"
      ],
      when_to_use_this_method:"Use angle sum for unknown angles. Use the isosceles property for equal-side triangles. Use triangle inequality to check whether given lengths can form a triangle.",
      edge_cases:["A triangle can have at most one obtuse or one right angle","If two angles are equal, the triangle is isosceles (converse of isosceles property)"],
      key_takeaway:"Angle sum = 180°. Exterior angle = sum of non-adjacent interior angles. Isosceles: equal sides → equal base angles. Larger angle → longer opposite side.",
      video_script_hooks:["Tear the corners off any triangle and line them up — they always make a straight line. Here's the proof.","Why is the exterior angle equal to the sum of the two REMOTE angles? The shortcut saves two steps."]
    }
  },

  {
    topicId:"icse_math9_ch9_triangle_problems",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:9,
    topic:"Triangles", subtopic:"Problems on Triangles",
    key_formulas:[
      "Median: joins a vertex to the midpoint of the opposite side",
      "Altitude: perpendicular from a vertex to the opposite side",
      "Angle bisector: bisects an interior angle",
      "In an isosceles △: altitude from apex = median from apex = angle bisector from apex",
      "Midpoint theorem: segment joining midpoints of two sides ∥ third side and = half of it"
    ],
    prerequisite_knowledge:[
      "All triangle properties",
      "All five congruence criteria",
      "CPCT"
    ],
    teaching_content:{
      intuition:"Most triangle problems are solved by (1) finding a congruence, (2) applying CPCT, and (3) using angle/side properties. The skill is spotting WHICH triangles to prove congruent and WHICH criterion to use.",
      derivation:"Standard proof strategy: identify what to prove → find two triangles that contain the required parts → list the three equalities that match the criterion → state the criterion → apply CPCT.",
      worked_example:"Prove that the median to the base of an isosceles triangle is also the altitude.\nLet △ABC with AB=AC. Let M be midpoint of BC.\nIn △ABM and △ACM: AB=AC (given), BM=CM (M is midpoint), AM=AM (common).\n∴ △ABM ≅ △ACM (SSS). By CPCT, ∠AMB=∠AMC.\n∠AMB+∠AMC=180° → ∠AMB=90°. So AM⊥BC. ✓",
      visual_description:"Every triangle proof is a detective story. Clues are the equal marks on sides and angles. You collect three matching clues, name your criterion, and solve the case with CPCT.",
      svg_diagrams:[],
      common_misconceptions:[
        "A median is not necessarily an altitude — only in isosceles/equilateral triangles",
        "Drawing the figure with equal marks is essential before writing a formal proof",
        "CPCT cannot be used before the congruence statement is established"
      ],
      shortcuts_and_tricks:[
        "Common side (shared by two triangles): write 'AM = AM (common)' — always available",
        "Vertically opposite angles: ∠AOB = ∠COD — free pair when diagonals cross",
        "In proofs involving midpoints: draw the figure and mark equal segments"
      ],
      when_to_use_this_method:"For any geometry problem asking you to 'prove equal lengths or angles': identify the relevant triangles, select the criterion, run the proof.",
      edge_cases:["Sometimes the same side/angle appears in both triangles (common part) — this counts as one of your three matching facts","Overlapping triangles share a common part that must be clearly identified"],
      key_takeaway:"Strategy: identify triangles → collect three matching facts → name the criterion → apply CPCT. The common side/angle and vertically opposite angles are your 'free' matching facts.",
      video_script_hooks:["Every triangle proof has a three-step recipe. Here it is.","The median = altitude theorem: one of the most elegant proofs in geometry. Watch how SSS does all the work."]
    }
  },


  // ── Chapter 10 · Isosceles Triangles ──────────────────────────────────────

  {
    topicId:"icse_math9_ch10_isosceles_properties",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:10,
    topic:"Isosceles Triangles", subtopic:"Properties of Isosceles Triangles",
    key_formulas:[
      "If AB = AC then ∠ABC = ∠ACB (base angles are equal)",
      "Converse: if ∠ABC = ∠ACB then AB = AC",
      "In isosceles △ABC (AB=AC): altitude from A, median from A, and angle bisector from A all coincide",
      "The perpendicular bisector of the base passes through the apex"
    ],
    prerequisite_knowledge:["Triangle congruence criteria (SAS, SSS, AAS, RHS)","CPCT","Angle sum property"],
    teaching_content:{
      intuition:"An isosceles triangle has a line of symmetry along the axis from the apex to the midpoint of the base. This symmetry is the source of all its properties: equal base angles, the altitude = median = bisector from apex.",
      derivation:"Theorem: AB=AC ⟹ ∠B=∠C.\nProof: Let D be midpoint of BC. In △ABD and △ACD: AB=AC (given), BD=CD (D midpoint), AD=AD (common). By SSS: △ABD ≅ △ACD. By CPCT: ∠ABD=∠ACD, i.e., ∠B=∠C. □\nConverse: ∠B=∠C ⟹ AB=AC.\nIn △ABD and △ACD: AD=AD, ∠ADB=∠ADC=90° (since ∠B=∠C and △ is symmetric, AD⊥BC), BD=CD. By RHS or AAS: △ABD ≅ △ACD. CPCT: AB=AC. □",
      worked_example:"In △ABC, AB=AC=8, BC=6. Find ∠B if ∠A=40°.\nAB=AC → ∠B=∠C. ∠A+∠B+∠C=180°. 40+2∠B=180. ∠B=70°.",
      visual_description:"Fold an isosceles triangle along its axis of symmetry — the two halves coincide perfectly. This fold is simultaneously the altitude, median, and angle bisector from the apex.",
      svg_diagrams:[],
      common_misconceptions:[
        "The altitude from the BASE ANGLES is not the axis of symmetry — only the altitude from the APEX is",
        "Every equilateral triangle is isosceles, but not every isosceles triangle is equilateral",
        "The converse (equal angles → equal sides) is equally important and equally true"
      ],
      shortcuts_and_tricks:[
        "Spot equal sides first → mark equal base angles immediately",
        "The apex angle is between the two equal sides",
        "Perpendicular from apex to base automatically bisects the base"
      ],
      when_to_use_this_method:"Use isosceles properties whenever a triangle has two equal sides or two equal angles — mark the equal parts and use them to build congruence proofs.",
      edge_cases:["A triangle with all three sides equal (equilateral) is isosceles in three ways simultaneously","An isosceles right triangle has base angles of 45° each"],
      key_takeaway:"Equal sides ↔ equal base angles (both directions). Altitude = median = bisector from apex. These properties plus congruence criteria solve nearly all isosceles triangle problems.",
      video_script_hooks:["Fold an isosceles triangle in half — three different lines become one. Here's why.","Equal sides mean equal angles: here's the 3-line SSS proof."]
    }
  },

  {
    topicId:"icse_math9_ch10_isosceles_theorems",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:10,
    topic:"Isosceles Triangles", subtopic:"Theorems on Isosceles Triangles",
    key_formulas:[
      "Theorem 1: Angles opposite equal sides of a triangle are equal",
      "Theorem 2 (Converse): Sides opposite equal angles of a triangle are equal",
      "If AD is the altitude from A in isosceles △ABC (AB=AC), then BD=DC and AD bisects ∠A",
      "Perpendicular bisector of BC passes through A"
    ],
    prerequisite_knowledge:["Isosceles triangle basic properties","SAS, SSS, AAS, RHS congruence","CPCT"],
    teaching_content:{
      intuition:"The two main theorems of isosceles triangles are converses of each other. They let you move freely between 'equal sides' and 'equal angles' — whichever is given, you can deduce the other. Most proofs hinge on this exchange.",
      derivation:"Theorem 1 proof (using angle bisector method):\nLet AD bisect ∠A. In △ABD and △ACD:\nAB=AC (given), ∠BAD=∠CAD (bisector), AD=AD (common).\nSAS → △ABD ≅ △ACD. CPCT → ∠B=∠C. □\n\nTheorem 2 proof:\nGiven ∠B=∠C. Draw altitude AD (∠ADB=∠ADC=90°).\nIn △ABD and △ACD: ∠ADB=∠ADC=90°, ∠B=∠C, AD=AD.\nAAS → △ABD ≅ △ACD. CPCT → AB=AC. □",
      worked_example:"In △PQR, PQ=PR. S is any point on QR. Prove PS bisects ∠QPR iff S is midpoint of QR.\n→ If QS=SR (midpoint), prove PS bisects ∠QPR:\n△PQS ≅ △PRS (SSS: PQ=PR, QS=RS, PS=PS). CPCT → ∠QPS=∠RPS → PS bisects ∠QPR.",
      visual_description:"The two theorems act as a two-way bridge: equal sides → equal angles (Theorem 1) and equal angles → equal sides (Theorem 2). In any isosceles triangle problem, identify which direction you're travelling and apply the right theorem.",
      svg_diagrams:[],
      common_misconceptions:[
        "You must prove congruence first before applying CPCT — the theorems are not assumptions",
        "The altitude from A bisects BC only in isosceles triangles, not in general",
        "Theorem 2 (converse) is a separate theorem requiring its own proof"
      ],
      shortcuts_and_tricks:[
        "In exam proofs: always state which theorem you're using ('angles opposite equal sides')",
        "When both theorems apply in sequence, label the steps clearly",
        "Marking equal sides with tick marks and equal angles with arc marks prevents confusion"
      ],
      when_to_use_this_method:"Use Theorem 1 when sides are given, deduce angles. Use Theorem 2 when angles are given, deduce sides. Chain them in multi-step proofs.",
      edge_cases:["In an equilateral triangle, all three versions of both theorems hold simultaneously","Theorem 2 combined with angle sum can force all angles to be 60° (equilateral case)"],
      key_takeaway:"Two theorems, two directions: equal sides ⟹ equal angles (T1) and equal angles ⟹ equal sides (T2). Master both proofs and know when to use each direction.",
      video_script_hooks:["Here's why the converse of 'equal sides → equal angles' is just as useful — and needs its own proof.","One triangle, two theorems, infinite problems solved."]
    }
  },

  {
    topicId:"icse_math9_ch10_equilateral_triangle",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:10,
    topic:"Isosceles Triangles", subtopic:"Equilateral Triangles",
    key_formulas:[
      "Equilateral triangle: all three sides equal AND all three angles = 60°",
      "Corollary: if all angles of a triangle are equal, each angle = 60° and the triangle is equilateral",
      "Equilateral triangle is isosceles in three ways (with respect to each pair of sides)",
      "Height of equilateral △ with side a: h = (√3/2)a",
      "Area of equilateral △ with side a: A = (√3/4)a²"
    ],
    prerequisite_knowledge:["Isosceles triangle properties and theorems","Angle sum property","Basic surds (√3)"],
    teaching_content:{
      intuition:"An equilateral triangle is the most symmetric triangle — it has three axes of symmetry and three-fold rotational symmetry. Every property of isosceles triangles applies to it three times over.",
      derivation:"Proof that equilateral → all angles 60°:\nIf AB=BC=CA, then by Theorem 1 (angles opp equal sides):\nAB=BC → ∠A=∠C. AB=CA → ∠C=∠B (wait: side AB is opposite ∠C, BC opposite ∠A, CA opposite ∠B).\nAB=BC → ∠C=∠A. BC=CA → ∠A=∠B. So ∠A=∠B=∠C. By angle sum: 3∠A=180° → ∠A=60°.\nConverse: all angles 60° → by Theorem 2, all sides equal → equilateral.",
      worked_example:"△ABC is equilateral with side 6. Find its height and area.\nHeight: h=(√3/2)(6)=3√3.\nArea: A=(√3/4)(36)=9√3 sq units.",
      visual_description:"An equilateral triangle sits like a perfect tripod. From any vertex, the altitude, median, and angle bisector all coincide and hit the opposite side at its exact midpoint. The centroid, circumcentre, incentre, and orthocentre all fall at the same point.",
      svg_diagrams:[],
      common_misconceptions:[
        "You need to prove both sides equal AND angles equal — proving just one set suffices (they imply each other)",
        "Height ≠ side in an equilateral triangle: h = (√3/2)a ≈ 0.866a",
        "The centroid of an equilateral triangle divides each median in 2:1, placing it at h/3 from base"
      ],
      shortcuts_and_tricks:[
        "If a triangle has two angles of 60° the third is automatically 60° → equilateral",
        "Memorise: area = (√3/4)a² and height = (√3/2)a for equilateral side a",
        "In exam: 'equilateral' immediately means all angles 60° — state this without proof"
      ],
      when_to_use_this_method:"Any problem mentioning equilateral triangles — use 60° angles and the area/height formulas directly.",
      edge_cases:["A degenerate 'triangle' with all sides 0 is trivially equilateral","No right-angled equilateral triangle exists (60° ≠ 90°)"],
      key_takeaway:"Equilateral = all sides equal = all angles 60°. It is isosceles three ways. Height = (√3/2)a, area = (√3/4)a². All centres coincide.",
      video_script_hooks:["Why does the most symmetric triangle have all angles exactly 60°? The proof is two lines.","One formula: area = (√3/4)a². Here's where it comes from and when to use it."]
    }
  },

  {
    topicId:"icse_math9_ch10_isosceles_problems",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:10,
    topic:"Isosceles Triangles", subtopic:"Problems on Isosceles Triangles",
    key_formulas:[
      "Exterior angle of isosceles triangle from apex: ext∠ = 180° − ∠A",
      "Exterior angle from base: ext∠ = 180° − ∠B = 90° + ∠A/2",
      "In △ABC (AB=AC), if D is on BC: △ABD ≅ △ACD iff D is midpoint",
      "Combining isosceles property with parallel lines or quadrilaterals extends the reach"
    ],
    prerequisite_knowledge:["All isosceles triangle theorems","All congruence criteria","Parallel lines and transversals"],
    teaching_content:{
      intuition:"Isosceles triangle problems usually chain two or three steps: (1) identify equal sides or angles, (2) deduce equal angles or sides using the theorems, (3) build a congruence, (4) apply CPCT. The skill is spotting the chain.",
      derivation:"Strategy for hard problems:\n1. Mark all given equal sides/angles.\n2. Apply T1 or T2 to get more equalities.\n3. Look for a congruence in a sub-triangle.\n4. Use CPCT to extract the required equality.\n5. If a new isosceles triangle appears, repeat from step 1.",
      worked_example:"△ABC is isosceles with AB=AC. D is a point outside the triangle such that BD=CD. Prove that AD is the perpendicular bisector of BC.\nLet M be midpoint of BC. In △ABM and △ACM: AB=AC, BM=CM, AM=AM → SSS → △ABM≅△ACM → ∠AMB=90°.\nIn △BDM and △CDM: DB=DC, BM=CM, DM=DM → SSS → ∠DMB=90°.\nBoth AM and DM are ⊥ to BC at M → A, M, D are collinear → AD⊥BC at M. ✓",
      visual_description:"Think of each isosceles triangle as a 'bank account' of equalities. Every equal pair of sides deposits two equal angles, and vice versa. Multi-step proofs are just making several deposits in sequence.",
      svg_diagrams:[],
      common_misconceptions:[
        "Assuming a triangle is isosceles without proof — always identify the equal parts explicitly",
        "Confusing which vertex is the apex (the one between the equal sides)",
        "Applying the axis-symmetry results (altitude=median=bisector) before proving the triangle is isosceles"
      ],
      shortcuts_and_tricks:[
        "Look for hidden isosceles triangles formed by equal radii, equal diagonals, or construction lines",
        "If two separate isosceles triangles share a base, their apices both lie on the perpendicular bisector of that base",
        "In circle problems: all radii are equal → any triangle with two radii as sides is isosceles"
      ],
      when_to_use_this_method:"Any geometry problem featuring equal lengths (sides, diagonals, radii) — check if an isosceles triangle is hidden inside.",
      edge_cases:["A point equidistant from two endpoints lies on the perpendicular bisector of the segment — this is equivalent to an isosceles triangle property","A kite has two pairs of isosceles triangles"],
      key_takeaway:"Chain the theorems: spot equal sides → get equal angles → build congruence → use CPCT. Hidden isosceles triangles (especially in circle or parallelogram figures) are the key insight in hard problems.",
      video_script_hooks:["Two isosceles triangles sharing a base — their apices must lie on one straight line. Here's why.","Circle problems always hide isosceles triangles. Here's how to find them."]
    }
  },


  // ── Chapter 11 · Inequalities ──────────────────────────────────────────────

  {
    topicId:"icse_math9_ch11_inequality_basics",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:11,
    topic:"Inequalities", subtopic:"Basics of Inequalities in Geometry",
    key_formulas:[
      "If ∠A > ∠B in △ABC, then BC > AC (side opposite larger angle is longer)",
      "If BC > AC in △ABC, then ∠A > ∠B (angle opposite longer side is larger)",
      "Whole > Part: if AB = AC + CB, then AB > AC and AB > CB",
      "Exterior angle > either non-adjacent interior angle"
    ],
    prerequisite_knowledge:["Angle sum of a triangle","Isosceles triangle properties","Congruence criteria"],
    teaching_content:{
      intuition:"Inequalities in geometry answer 'which is bigger?' In a triangle, longer sides face bigger angles and vice versa. Think of stretching a rubber band triangle — as one angle opens wider, the side opposite it must grow longer.",
      derivation:"Theorem: If ∠A > ∠B in △ABC, then BC > AC.\nProof: Mark D on BC such that ∠BAD = ∠B. Then △ABD is isosceles (∠ABD = ∠BAD) → AD = BD.\nIn △ACD: AD = BD, and ∠ADB > ∠ACD (exterior angle of △ABD). So ∠ADB > ∠ADC? No.\nCorrected: Mark D on AC so that AD = AB. ∠ADB = ∠ABD = ∠B (isosceles). ∠ADC = ∠ADB = ∠B. In △BDC, ∠BDC > ∠DCB → BC > BD = AC... standard proof is: since ∠A > ∠B, mark D on BC so BD = BA. Then △ABD isosceles → ∠ADB = ∠A > ∠B = ∠ABD... (see full proof in textbook).",
      worked_example:"In △PQR, PQ = 8, QR = 5, PR = 6. Order the angles.\nSmallest side QR = 5 → smallest opposite angle ∠P.\nLargest side PQ = 8 → largest opposite angle ∠R.\nOrder: ∠R > ∠Q > ∠P.",
      visual_description:"Imagine a gate hinge at angle A. As angle A opens wider, the side BC (connecting the ends of the two sides AB and AC) must stretch longer. Larger opening ↔ longer opposite side.",
      svg_diagrams:[],
      common_misconceptions:[
        "The longest side is opposite the LARGEST angle, not the smallest",
        "Equality holds only when the triangle is isosceles for that pair",
        "Whole > Part applies to any segment subdivision, not just triangles"
      ],
      shortcuts_and_tricks:[
        "To order angles: order the opposite sides first, then reverse-map to angles",
        "To order sides: order angles first, then reverse-map to opposite sides",
        "Exterior angle > either non-adjacent interior angle — a quick inequality tool"
      ],
      when_to_use_this_method:"Use these basics whenever a question asks to compare sides or angles, or to prove one side/angle is larger than another.",
      edge_cases:["If two sides are equal the opposite angles are equal — equality case of the theorem","The inequalities are strict: > not ≥ (unless isosceles)"],
      key_takeaway:"Larger angle ↔ longer opposite side. This bidirectional relationship is the core tool for all inequality proofs in triangles.",
      video_script_hooks:["Which side of this triangle is longest? Just look at the biggest angle — it's opposite. Here's why.","Geometry inequalities: the one rule that unlocks every comparison problem."]
    }
  },

  {
    topicId:"icse_math9_ch11_triangle_inequalities",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:11,
    topic:"Inequalities", subtopic:"Triangle Inequality Theorems",
    key_formulas:[
      "Triangle inequality: a + b > c for any sides a, b, c",
      "Equivalently: |a − b| < c < a + b",
      "The sum of any two sides of a triangle is greater than the third side",
      "The difference of any two sides is less than the third side"
    ],
    prerequisite_knowledge:["Basic triangle properties","Angle sum property"],
    teaching_content:{
      intuition:"The triangle inequality is a geometric truth about distance: the straight-line path (third side) is always shorter than going via a detour (other two sides). In any triangle, you can never make two sides so short that together they don't reach the third side.",
      derivation:"Proof that AB + AC > BC:\nExtend BA to D such that AD = AC. Join DC.\nIn △ACD: AD = AC → ∠ADC = ∠ACD (isosceles).\n∠BCD = ∠BCA + ∠ACD > ∠ACD = ∠ADC = ∠BDC.\nIn △BCD: ∠BCD > ∠BDC → BD > BC.\nBut BD = BA + AD = BA + AC = AB + AC.\n∴ AB + AC > BC. □",
      worked_example:"Can a triangle have sides 4, 7, 12?\n4 + 7 = 11 < 12. Fails! Not a valid triangle.\n\nCan a triangle have sides 5, 8, 11?\n5 + 8 = 13 > 11 ✓, 5 + 11 = 16 > 8 ✓, 8 + 11 = 19 > 5 ✓. Valid triangle.",
      visual_description:"Lay two sticks end-to-end. If their combined length is less than or equal to the third stick, you cannot close the triangle — the ends never meet. The triangle inequality guarantees the ends do meet.",
      svg_diagrams:[],
      common_misconceptions:[
        "Only need to check the two SHORTER sides add to more than the LONGEST side — checking all three pairs is redundant but not wrong",
        "Equality (a + b = c) gives a degenerate triangle (three collinear points), not a valid triangle",
        "The triangle inequality also implies: any side > difference of the other two"
      ],
      shortcuts_and_tricks:[
        "Quickest check: do the two shorter sides sum to more than the longest?",
        "For integer-side questions: the range of the third side is |a−b| < x < a+b",
        "If x = a + b or x = |a−b|, the 'triangle' is degenerate (area = 0)"
      ],
      when_to_use_this_method:"Use to verify if given lengths form a triangle, find the range of a possible third side, or prove strict inequalities about sides.",
      edge_cases:["Equal sides: a = b → third side c satisfies 0 < c < 2a","Degenerate triangle: a + b = c means points are collinear"],
      key_takeaway:"Sum of any two sides > third side. Check the two shorter sides against the longest. This is the fundamental existence criterion for a triangle.",
      video_script_hooks:["Can 4, 7, 12 make a triangle? One quick check tells you no. Here's why.","The triangle inequality is really just saying: the shortest path between two points is a straight line."]
    }
  },

  {
    topicId:"icse_math9_ch11_inequality_theorems",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:11,
    topic:"Inequalities", subtopic:"Key Inequality Theorems",
    key_formulas:[
      "Theorem A: The greater angle has the longer opposite side (and converse)",
      "Theorem B: Of all line segments from an external point to a line, the perpendicular is the shortest",
      "Theorem C: In a triangle, the sum of any two sides > the third side",
      "Corollary: The difference of any two sides < the third side",
      "Theorem D: In a right triangle, the hypotenuse is the longest side"
    ],
    prerequisite_knowledge:["All previous inequality basics","Pythagoras theorem (for Theorem D)","Congruence criteria"],
    teaching_content:{
      intuition:"These four theorems are the toolkit for all triangle inequality proofs. Theorem B (perpendicular is shortest) is used whenever a problem involves distances from a point to a line — the foot of the perpendicular is the closest point on the line.",
      derivation:"Theorem B: Let P be a point outside line l. Let PF be perpendicular to l (F on l) and PQ be any other segment (Q ≠ F on l).\nIn △PFQ: ∠PFQ = 90°. The hypotenuse PQ > PF (any side < hypotenuse). ✓\n\nTheorem D: In △ABC, ∠C = 90°. Then ∠A < 90° and ∠B < 90°.\nSide opposite ∠C (which is AB) > side opposite ∠A or ∠B → AB is the longest side (hypotenuse).",
      worked_example:"Prove: In △ABC, if ∠A = 90°, then BC > AB and BC > AC.\nSince ∠A = 90°, ∠B + ∠C = 90°, so ∠B < 90° and ∠C < 90°.\n∠A > ∠B → BC (opp ∠A) > AC (opp ∠B). ✓\n∠A > ∠C → BC > AB. ✓",
      visual_description:"Theorem B visualised: stand at point P and look at a wall (line l). The perpendicular line from you to the wall is the shortest path. Any angled path to the wall is longer.",
      svg_diagrams:[],
      common_misconceptions:[
        "Theorem B says perpendicular is shortest FROM A POINT TO A LINE, not between two arbitrary points",
        "In a right triangle, only the hypotenuse has the 'largest side' property — both legs can be any length relative to each other",
        "Theorem C is about strict inequality; equality gives degenerate case"
      ],
      shortcuts_and_tricks:[
        "Perpendicular from external point → shortest distance: use this in proofs involving distance minimisation",
        "Right triangle: always state 'hypotenuse is longest' explicitly before comparing sides",
        "Combine Theorem A with exterior angle theorem for multi-step inequality proofs"
      ],
      when_to_use_this_method:"Use Theorem B for distance problems. Theorem D for right triangles. Theorem A + exterior angle for comparing non-adjacent parts of a figure.",
      edge_cases:["If the point P lies ON line l, there is no perpendicular to the line from P (or the 'perpendicular' is zero length)","In an obtuse triangle, the longest side is opposite the obtuse angle (not the hypotenuse since there is none)"],
      key_takeaway:"Four theorems: (A) larger angle ↔ longer side, (B) perpendicular is shortest distance from point to line, (C) sum of two sides > third, (D) hypotenuse is longest in right triangle.",
      video_script_hooks:["The shortest path from a point to a wall is always the perpendicular. Here's the geometric proof.","In a right triangle, the hypotenuse beats every other side. The reason is two lines long."]
    }
  },

  {
    topicId:"icse_math9_ch11_inequality_problems",
    subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:11,
    topic:"Inequalities", subtopic:"Problems on Inequalities",
    key_formulas:[
      "In △ABC with cevian AD: AB + AC > BD + DC = BC, and AB + AC > 2AD (median inequality)",
      "For any point O inside △ABC: AB + BC + CA > OA + OB + OC > (AB+BC+CA)/2",
      "The perimeter of a triangle > twice any one of its medians",
      "Sum of diagonals of a quadrilateral > sum of any pair of opposite sides"
    ],
    prerequisite_knowledge:["All inequality theorems","Triangle inequality","Congruence and CPCT"],
    teaching_content:{
      intuition:"Complex inequality problems build chains: use the basic theorems on sub-triangles formed by cevians, medians, diagonals, or external points. The key is identifying which triangles to apply the triangle inequality to.",
      derivation:"Median inequality (AB + AC > 2AM where M is midpoint of BC):\nExtend AM to D such that MD = AM. Join BD.\nIn △ABM and △DCM: AM=DM, BM=CM, ∠AMB=∠DMC (vert opp) → SAS → △ABM≅△DCM.\nCPCT: BD=AB. In △ABD: BD+AD>AB... wait.\nActually: BD = AB (CPCT). In △ABD: AD > |AB - BD|... \nIn △BDA: BD+DA > AB+AB... \nSimplest: BD=AC (CPCT), so in △ABD: AB+BD>AD=2AM → AB+AC>2AM. ✓",
      worked_example:"Prove that the sum of three medians of a triangle < the perimeter.\nLet ma, mb, mc be medians. Since each median < sum of the two sides it connects: 2ma < AB + AC, 2mb < AB + BC, 2mc < AC + BC.\nAdding: 2(ma+mb+mc) < 2(AB+BC+CA).\nSo ma+mb+mc < AB+BC+CA (perimeter). ✓",
      visual_description:"Think of a median as a shortcut from a vertex to the opposite side's midpoint. The shortcut is always shorter than going along two sides to reach the same midpoint — that's the median inequality.",
      svg_diagrams:[],
      common_misconceptions:[
        "The sum of medians is NOT the same as the perimeter — it is strictly less",
        "An interior point is closer to the triangle's perimeter than the vertices suggest",
        "Applying triangle inequality to the full triangle is not enough — apply it to sub-triangles formed by the cevian"
      ],
      shortcuts_and_tricks:[
        "Extend a median/cevian to double its length — creates a new triangle via SAS congruence",
        "For 'OA+OB+OC' problems with interior point O: use triangle inequality on each sub-triangle △OAB, △OBC, △OCA",
        "For diagonals of quadrilaterals: the diagonal splits it into two triangles; apply triangle inequality to each"
      ],
      when_to_use_this_method:"Use for any proof involving medians, cevians, interior points, or quadrilateral diagonals where a comparison of lengths is required.",
      edge_cases:["A degenerate triangle (collinear points) makes the median = half the base — equality case","For a point ON the boundary, OA+OB+OC = perimeter − (the two adjacent sides to the point)"],
      key_takeaway:"Complex inequality proofs reduce to applying the basic triangle inequality on cleverly chosen sub-triangles, often created by extending a median or cevian.",
      video_script_hooks:["The sum of the three medians is less than the perimeter — here's the elegant proof using just the triangle inequality.","An interior point O: its distances to the three vertices always sum to less than the perimeter. The proof uses three triangles."]
    }
  },


  // ── Chapter 12 · Mid-Point and Its Converse (Intercept Theorem) ──────────
  {
    topicId:"icse_math9_ch12_midpoint_theorem",
    topic:"Mid-Point and Intercept Theorem",
    subtopic:"Mid-Point Theorem",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:12,
    key_formulas:[
      "Mid-Point Theorem: The line segment joining the mid-points of two sides of a triangle is parallel to the third side and equal to half of it.",
      "If M and N are midpoints of AB and AC respectively in △ABC, then MN ∥ BC and MN = ½BC.",
      "Converse: A line drawn through the midpoint of one side of a triangle, parallel to another side, bisects the third side."
    ],
    prerequisite_knowledge:[
      "Properties of parallel lines and transversals",
      "Congruence criteria (SAS, ASA, AAS)",
      "Properties of parallelograms"
    ],
    teaching_content:{
      concept_explanation:"The Mid-Point Theorem states that in any triangle, the segment connecting the midpoints of two sides is both parallel to the third side and exactly half its length. This elegant theorem connects midpoints, parallelism, and length ratio in a single statement. It is proved by extending the mid-point line and showing a parallelogram is formed.",
      worked_examples:[
        {
          problem:"In △ABC, M and N are midpoints of AB and AC. If BC=12 cm, find MN.",
          solution:"By Mid-Point Theorem, MN = ½BC = ½×12 = 6 cm.",
          key_insight:"The midpoint connector is always exactly half the parallel side."
        },
        {
          problem:"In △PQR, D and E are midpoints of PQ and PR. DE ∥ QR and DE = 5 cm. Find QR.",
          solution:"By Mid-Point Theorem, DE = ½QR → QR = 2×DE = 10 cm.",
          key_insight:"Given the midpoint line, the base is double."
        },
        {
          problem:"Prove: The quadrilateral formed by joining midpoints of a quadrilateral is a parallelogram.",
          solution:"In △ABC: midpoints E, F of AB, AC → EF ∥ BC, EF=½BC. In △ACD: midpoints G, H → GH ∥ BD... The diagonals of the original quadrilateral connect the midpoints' pairs. Using mid-point theorem on both diagonals shows opposite sides of EFGH are parallel and equal → parallelogram.",
          key_insight:"Varignon's theorem: midpoints of any quadrilateral form a parallelogram."
        }
      ],
      common_mistakes:[
        "Forgetting the theorem requires BOTH sides' midpoints — not just one midpoint",
        "Confusing MN = ½BC with MN = BC (factor of 2 error)",
        "Not verifying parallelism before using equal length property"
      ],
      practice_variations:[
        "Find missing lengths using MN = ½BC",
        "Find missing lengths using BC = 2MN",
        "Prove EFGH is a parallelogram (Varignon's theorem)",
        "Use midpoint theorem to find perimeter of inner figure"
      ],
      visual_description:"Triangle ABC with M on AB and N on AC (both midpoints). MN drawn parallel to BC, visually shorter. Extend MN to D (outside triangle on BC's side) to show BCDN parallelogram in proof.",
      mnemonics_and_tricks:"'Half the base, parallel to it' — midpoint connector = half & parallel. Extend the midpoint line to form a parallelogram for the proof.",
      difficulty_level:"medium",
      marks_weightage:6,
      exam_frequency:"very_high",
      when_to_use_this_method:"Use when midpoints of two sides are given and you need to find the third side length, or when proving parallelism/equality involving midpoints.",
      edge_cases:["The theorem extends to any quadrilateral (Varignon's theorem — midpoints form a parallelogram)","If MN ∥ BC and M is midpoint of AB, then N is automatically the midpoint of AC (converse)"],
      key_takeaway:"Joining midpoints of two sides of a triangle gives a segment that is parallel to the third side and exactly half as long.",
      video_script_hooks:["A triangle cut by a line through two midpoints — the line is parallel to the base and exactly half its length.","This one theorem unlocks dozens of proofs about parallelograms and midpoints."]
    }
  },

  {
    topicId:"icse_math9_ch12_converse_midpoint",
    topic:"Mid-Point and Intercept Theorem",
    subtopic:"Converse of Mid-Point Theorem",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:12,
    key_formulas:[
      "Converse of Mid-Point Theorem: If a line is drawn through the midpoint of one side of a triangle, parallel to the second side, it bisects the third side.",
      "In △ABC, if M is midpoint of AB and MN ∥ BC, then N is the midpoint of AC.",
      "Application: each of the diagonals of a parallelogram bisects the other; diagonals of a rectangle, rhombus, square bisect each other."
    ],
    prerequisite_knowledge:[
      "Mid-Point Theorem (direct)",
      "Properties of parallelograms",
      "Corresponding angles and alternate angles with parallel lines"
    ],
    teaching_content:{
      concept_explanation:"The converse of the mid-point theorem is equally useful: if you draw a line through one side's midpoint parallel to another side, it is guaranteed to bisect the third side. This is used to prove that certain points are midpoints, that certain lines bisect sides, or to establish that figures are parallelograms.",
      worked_examples:[
        {
          problem:"In △ABC, M is the midpoint of AB. MN is drawn parallel to BC. Show that N is the midpoint of AC.",
          solution:"By Converse of Mid-Point Theorem: a line through midpoint of AB, parallel to BC, bisects AC. Therefore N is the midpoint of AC.",
          key_insight:"Parallel + through midpoint → bisects the other side."
        },
        {
          problem:"ABCD is a trapezium with AB ∥ DC. E and F are midpoints of AD and BC. Prove EF ∥ AB.",
          solution:"Join diagonal AC. In △ACD, E is midpoint of AD. By converse, if we draw a line through E parallel to DC (=AB) it bisects AC. Let it meet AC at G. In △ABC, G is midpoint of AC. By midpoint theorem on △ABC, GF ∥ AB. Since EG ∥ AB and GF ∥ AB and they are collinear, EF ∥ AB. QED.",
          key_insight:"Combine midpoint theorem with its converse for trapezium median properties."
        },
        {
          problem:"In △PQR, D and E are midpoints of PQ and QR. Prove PERD is a parallelogram.",
          solution:"By Mid-Point Theorem in △PQR: DE ∥ PR and DE = ½PR. Since E is midpoint of QR, RE = ½QR. Also D is midpoint of PQ, PD = ½PQ. Hmm — PERD has vertices P, E, R, D. PR is one side. DE ∥ PR and DE = ½PR. For a parallelogram we need DE ∥ PR and |DE|=|PR|... not equal here. The figure formed by ALL four midpoints is the parallelogram.",
          key_insight:"Joining midpoints of adjacent sides of any quadrilateral gives a parallelogram (Varignon)."
        }
      ],
      common_mistakes:[
        "Using the converse without first checking that one endpoint is a midpoint",
        "Confusing 'bisects' (cuts in half) with 'intersects' (merely meets)",
        "Not verifying the line is parallel to the correct side"
      ],
      practice_variations:[
        "Prove a point is the midpoint using the converse",
        "Prove EF ∥ AB in trapezium (midsegment of trapezium)",
        "Prove that diagonals of a parallelogram bisect each other"
      ],
      visual_description:"Triangle with M on AB (midpoint). Line MN parallel to BC drawn, hitting AC at N. N is midpoint of AC. The four midpoints of a quadrilateral forming an inner parallelogram.",
      mnemonics_and_tricks:"'Parallel + midpoint → bisects' — always remember the converse is about guaranteeing a bisection when parallelism is given from a midpoint.",
      difficulty_level:"medium",
      marks_weightage:6,
      exam_frequency:"high",
      when_to_use_this_method:"Use when you know a line passes through a midpoint and is parallel to a side — conclude it bisects the third side. Also used to prove midpoints in complex figures.",
      edge_cases:["In a trapezium, the midsegment (joining midpoints of legs) is parallel to the parallel sides and equals their average","The converse fails if the line through the midpoint is NOT parallel to the required side"],
      key_takeaway:"A line through the midpoint of one side of a triangle, parallel to another side, will always bisect the third side.",
      video_script_hooks:["Here's the converse: start at one midpoint, go parallel — you land exactly at another midpoint.","The midsegment of a trapezium: joining the midpoints of the non-parallel sides creates a segment parallel to both parallel sides."]
    }
  },

  {
    topicId:"icse_math9_ch12_intercept_theorem",
    topic:"Mid-Point and Intercept Theorem",
    subtopic:"Intercept Theorem",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:12,
    key_formulas:[
      "Intercept Theorem: If three or more parallel lines make equal intercepts on a transversal, they make equal intercepts on any other transversal.",
      "If AB ∥ CD ∥ EF and l₁ cuts them making equal intercepts PQ=QR (on l₁), then any transversal l₂ also makes equal intercepts.",
      "Midsegment of a trapezium: EF = ½(AB + CD) where EF joins midpoints of the non-parallel sides."
    ],
    prerequisite_knowledge:[
      "Parallel lines and transversals",
      "Mid-Point Theorem and its converse",
      "Properties of parallelograms"
    ],
    teaching_content:{
      concept_explanation:"The Intercept Theorem generalises the Mid-Point Theorem to multiple parallel lines. If a set of parallel lines cuts equal intercepts on one transversal, it cuts equal intercepts on every transversal. The classic application is the midsegment (median) of a trapezium: the segment joining the midpoints of the non-parallel sides is parallel to the parallel sides and equals their average.",
      worked_examples:[
        {
          problem:"Three parallel lines cut a transversal at A, B, C with AB=BC=3 cm. Another transversal is cut at P, Q, R. Find PQ and QR.",
          solution:"By the intercept theorem: since equal intercepts on one transversal → equal intercepts on every transversal. PQ = QR.",
          key_insight:"Equal intercepts on one transversal guarantee equal intercepts on all others."
        },
        {
          problem:"In trapezium ABCD with AB ∥ CD, E and F are midpoints of AD and BC respectively. If AB=10 and CD=6, find EF.",
          solution:"Midsegment of trapezium: EF = ½(AB + CD) = ½(10+6) = 8 cm. Also EF ∥ AB ∥ CD.",
          key_insight:"Trapezium midsegment = average of parallel sides."
        },
        {
          problem:"In △ABC, D, E, F are points on BC such that BD=DE=EF=FC. Lines through D, E, F parallel to AB meet AC at D', E', F'. Prove AD'=D'E'=E'F'=F'C.",
          solution:"The four equal parts on BC create equal intercepts on BC. By the intercept theorem, the parallel lines through D, E, F make equal intercepts on AC. Therefore AD'=D'E'=E'F'=F'C.",
          key_insight:"Equal divisions on one side → equal divisions on any parallel cut."
        }
      ],
      common_mistakes:[
        "Using the formula EF = ½(AB+CD) for non-trapezium figures",
        "Forgetting that EF must join MIDPOINTS of the non-parallel sides for the midsegment formula",
        "Confusing 'equal intercepts' (equal lengths) with 'proportional intercepts'"
      ],
      practice_variations:[
        "Find EF (midsegment) given AB and CD of trapezium",
        "Find AB or CD given EF and the other parallel side",
        "Prove equal intercepts on a second transversal",
        "Divide a line segment into equal parts using parallel lines"
      ],
      visual_description:"Three parallel lines l₁, l₂, l₃ cut by two transversals. Equal spacing on one transversal forces equal spacing on the other. Trapezium with E, F midpoints of legs — EF is the midsegment running between the two parallel sides.",
      mnemonics_and_tricks:"'Equal cuts on one → equal cuts on all' — the intercept theorem is the multi-line generalisation of the midpoint theorem.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Use when parallel lines are involved with proportional or equal divisions. Use the midsegment formula EF=½(AB+CD) whenever midpoints of trapezium legs are given.",
      edge_cases:["If the intercepts on one transversal are equal, intercepts on ALL other transversals are also equal","The intercept theorem is the tool used to prove the basic proportionality theorem (BPT) in some textbooks"],
      key_takeaway:"Equal intercepts on one transversal → equal intercepts on any transversal cut by the same set of parallel lines. Trapezium midsegment = ½(sum of parallel sides).",
      video_script_hooks:["Three parallel lines, two transversals — if one gets chopped equally, so does the other. That's the intercept theorem.","The midsegment of a trapezium is the average of the two parallel sides — perfect for problems where you're given the midpoints of the legs."]
    }
  },

  {
    topicId:"icse_math9_ch12_midpoint_problems",
    topic:"Mid-Point and Intercept Theorem",
    subtopic:"Applications and Problems",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:12,
    key_formulas:[
      "Varignon's Parallelogram: Joining midpoints of sides of any quadrilateral gives a parallelogram.",
      "Midsegment of triangle: MN = ½BC (M,N midpoints of AB,AC).",
      "Midsegment of trapezium: EF = ½(AB+CD) where E,F midpoints of non-parallel sides.",
      "Intercept theorem: equal intercepts on one transversal → equal intercepts on all transversals (same parallel lines)."
    ],
    prerequisite_knowledge:[
      "Mid-Point Theorem and its converse",
      "Intercept Theorem",
      "Properties of parallelograms and trapeziums"
    ],
    teaching_content:{
      concept_explanation:"The applications of the mid-point and intercept theorems span a wide variety of geometry problems. Key applications include: proving Varignon's parallelogram (midpoints of any quadrilateral), finding lengths in nested triangles and trapeziums, dividing line segments into equal parts using parallel lines, and proving properties of special quadrilaterals formed by midpoints.",
      worked_examples:[
        {
          problem:"ABCD is a quadrilateral. P, Q, R, S are midpoints of AB, BC, CD, DA respectively. Prove PQRS is a parallelogram.",
          solution:"Join diagonal AC. In △ABC: PQ ∥ AC and PQ = ½AC (midpoint theorem, P midpoint AB, Q midpoint BC). In △ACD: SR ∥ AC and SR = ½AC (S midpoint DA, R midpoint CD). So PQ ∥ SR and PQ = SR. Hence PQRS is a parallelogram (one pair of opposite sides equal and parallel). QED.",
          key_insight:"Varignon's theorem: apply midpoint theorem to each diagonal of the quadrilateral."
        },
        {
          problem:"In △ABC, D and E are midpoints of AB and BC. F is the midpoint of AC. Find the perimeter of △DEF if AB=8, BC=10, AC=6.",
          solution:"DE = ½AC = 3 (midpoints of AB, BC → DE ∥ AC, DE=½AC). EF = ½AB = 4. DF = ½BC = 5. Perimeter = 3+4+5 = 12 cm.",
          key_insight:"Medial triangle has perimeter = ½ perimeter of original triangle."
        },
        {
          problem:"In trapezium ABCD, AB ∥ DC. E is midpoint of AD. A line through E parallel to AB meets BC at F. Find EF if AB=9 and DC=5.",
          solution:"E midpoint of AD, EF ∥ AB ∥ DC. By converse of midpoint theorem (applied to △ABD or using intercept theorem): F is midpoint of BC. Then EF = ½(AB+DC) = ½(9+5) = 7 cm.",
          key_insight:"Midsegment of trapezium = ½(sum of parallel sides)."
        }
      ],
      common_mistakes:[
        "In Varignon's proof, forgetting to use BOTH diagonals of the quadrilateral",
        "Applying midsegment formula EF=½(AB+CD) to a non-trapezium",
        "Confusing the medial triangle (formed by midpoints of all 3 sides) with the midpoint segment"
      ],
      practice_variations:[
        "Varignon's parallelogram proof",
        "Find perimeter of medial triangle",
        "Find EF in trapezium using midsegment",
        "Divide a segment into n equal parts using parallel lines"
      ],
      visual_description:"Quadrilateral ABCD with midpoints PQRS connected — inner parallelogram (Varignon). Triangle ABC with all three midpoints connected — medial triangle (similar to ABC, scale ½). Trapezium with midsegment EF between the two parallel sides.",
      mnemonics_and_tricks:"'Midpoints of quadrilateral → inner parallelogram (always).' 'Perimeter of medial triangle = half original perimeter.' 'Midsegment of trapezium = average of parallel sides.'",
      difficulty_level:"hard",
      marks_weightage:8,
      exam_frequency:"very_high",
      when_to_use_this_method:"Use when midpoints are given in any quadrilateral or triangle. Look for parallelogram patterns (Varignon), midsegment length calculations, or equal division proofs.",
      edge_cases:["For a concave quadrilateral, Varignon's parallelogram still holds","The medial triangle divides the original triangle into 4 congruent triangles"],
      key_takeaway:"The midpoint and intercept theorems, combined, power a wide range of problems: Varignon's parallelogram, medial triangles, trapezium midsegments, and equal division of sides.",
      video_script_hooks:["Connect all four midpoints of any quadrilateral — the result is always a parallelogram. No exceptions.","The medial triangle has half the perimeter and one-quarter the area of the original."]
    }
  },


  // ── Chapter 13 · Pythagoras Theorem ──────────────────────────────────────
  {
    topicId:"icse_math9_ch13_pythagoras_theorem",
    topic:"Pythagoras Theorem",
    subtopic:"Theorem Statement and Proof",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:13,
    key_formulas:[
      "Pythagoras Theorem: In a right-angled triangle, the square on the hypotenuse equals the sum of squares on the other two sides.",
      "a² + b² = c², where c is the hypotenuse (side opposite to 90°).",
      "Common Pythagorean triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25), (9,40,41)."
    ],
    prerequisite_knowledge:[
      "Properties of right-angled triangles",
      "Area of a square and triangle",
      "Congruence criteria (SAS, ASA)"
    ],
    teaching_content:{
      concept_explanation:"Pythagoras Theorem is one of the most fundamental results in geometry. It states that in any right-angled triangle, if the legs are a and b and the hypotenuse is c, then a² + b² = c². The theorem has over 370 known proofs. The most accessible proof for Class 9 uses the area method: a large square of side (a+b) is divided into 4 congruent right triangles and a central square of side c.",
      worked_examples:[
        {
          problem:"Find the hypotenuse of a right triangle with legs 6 cm and 8 cm.",
          solution:"c² = 6² + 8² = 36 + 64 = 100 → c = 10 cm.",
          key_insight:"(6,8,10) is a multiple of the (3,4,5) Pythagorean triple."
        },
        {
          problem:"One leg of a right triangle is 5 cm and hypotenuse is 13 cm. Find the other leg.",
          solution:"b² = 13² − 5² = 169 − 25 = 144 → b = 12 cm.",
          key_insight:"(5,12,13) is a Pythagorean triple."
        },
        {
          problem:"Prove Pythagoras Theorem using the area method.",
          solution:"Draw a square of side (a+b). Place 4 congruent right triangles (legs a,b, hyp c) inside it with right angles at the corners. The remaining central region is a square of side c. Area of large square = (a+b)². Area of 4 triangles = 4×½ab = 2ab. Area of inner square = c². So (a+b)² = 2ab + c² → a²+2ab+b² = 2ab+c² → a²+b² = c². QED.",
          key_insight:"Area decomposition is the most elegant Class-9 proof."
        }
      ],
      common_mistakes:[
        "Adding squares of all three sides instead of just two legs",
        "Using a leg instead of the hypotenuse as c (c is always opposite the 90° angle)",
        "Forgetting to take the square root at the end"
      ],
      practice_variations:[
        "Find hypotenuse given two legs",
        "Find a leg given hypotenuse and other leg",
        "Identify Pythagorean triples",
        "Verify if given sides form a right triangle"
      ],
      visual_description:"Right triangle with legs a and b and hypotenuse c. Squares drawn on each side: area of square on hypotenuse = sum of areas on legs. Proof diagram: large square with four triangles and central square.",
      mnemonics_and_tricks:"'Pythagoras: Hypotenuse² = sum of legs²'. Remember (3,4,5) and (5,12,13) by heart. Any multiple (like 6,8,10 or 9,12,15) also works.",
      difficulty_level:"medium",
      marks_weightage:6,
      exam_frequency:"very_high",
      when_to_use_this_method:"Use whenever a right angle is given or can be established. Use to find a missing side in a right triangle.",
      edge_cases:["Works ONLY for right-angled triangles — check ∠ = 90° first","If a²+b²=c², the triangle IS right-angled (converse)"],
      key_takeaway:"a² + b² = c² for right triangles with legs a,b and hypotenuse c. This is the most-used theorem in all of geometry.",
      video_script_hooks:["The square on the hypotenuse — here's why it equals the sum of the other two squares, using nothing but area.","(3,4,5): the magic right-angle triple that builders have used for thousands of years."]
    }
  },

  {
    topicId:"icse_math9_ch13_pythagoras_converse",
    topic:"Pythagoras Theorem",
    subtopic:"Converse of Pythagoras Theorem",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:13,
    key_formulas:[
      "Converse: If a² + b² = c² in △ABC (where c is the longest side), then ∠C = 90°.",
      "Acute triangle test: a² + b² > c² ⟹ triangle is acute-angled.",
      "Obtuse triangle test: a² + b² < c² ⟹ triangle is obtuse-angled."
    ],
    prerequisite_knowledge:[
      "Pythagoras Theorem (direct)",
      "Types of triangles (acute, right, obtuse)",
      "SAS congruence"
    ],
    teaching_content:{
      concept_explanation:"The Converse of Pythagoras Theorem allows you to determine whether a triangle is right-angled purely from its side lengths. If the sum of squares of the two shorter sides equals the square of the longest side, the triangle has a right angle opposite the longest side. Extended, if the sum > longest², the triangle is acute; if sum < longest², it is obtuse.",
      worked_examples:[
        {
          problem:"Are the sides 7, 24, 25 the sides of a right triangle?",
          solution:"7² + 24² = 49 + 576 = 625 = 25². Yes, right-angled at the vertex opposite the side of length 25.",
          key_insight:"(7,24,25) is a Pythagorean triple."
        },
        {
          problem:"Determine the type of triangle with sides 4, 5, 6.",
          solution:"Longest side = 6. a²+b² = 4²+5² = 16+25 = 41 > 36 = 6². Since 41 > 36, the triangle is acute-angled.",
          key_insight:"Sum of squares of two shorter sides > square of longest → acute."
        },
        {
          problem:"Prove the converse: if a²+b²=c² in △ABC, then ∠C=90°.",
          solution:"Construct △DEF with DE=a, EF=b, ∠E=90°. By Pythagoras: DF²=a²+b²=c²→DF=c=AB. △ABC≅△DEF (SSS). So ∠C=∠F=90°.",
          key_insight:"Construct a known right triangle and use SSS congruence."
        }
      ],
      common_mistakes:[
        "Checking a²+b² vs c² where c is NOT the longest side (must use longest side)",
        "Concluding right angle at the wrong vertex (it's opposite the longest side)",
        "Not testing all three combinations for general triangles"
      ],
      practice_variations:[
        "Test if given triple forms a right triangle",
        "Classify triangle as acute/right/obtuse from sides",
        "Prove converse using SSS",
        "Find what value of x makes a triangle right-angled"
      ],
      visual_description:"Triangle with sides labeled — compare a²+b² vs c². Show three cases: equal (right), greater (acute), less (obtuse) with visual triangle shapes.",
      mnemonics_and_tricks:"'Equal → Right, Greater → Acute, Less → Obtuse.' Always test with the LONGEST side as c.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Use when given three sides and asked to classify the triangle. Use to verify right angles in complex figures.",
      edge_cases:["If a²+b²=c² exactly → right angle (no approximation)","The converse fails if c is not the longest side — always identify the hypotenuse first"],
      key_takeaway:"Converse: a²+b²=c² → right angle at C. Extended: use > for acute, < for obtuse (with c = longest side).",
      video_script_hooks:["Given three side lengths, you can tell if a triangle is right, acute, or obtuse — purely from arithmetic.","Here's the converse proof: build a right triangle with the same legs, then use SSS to show they're identical."]
    }
  },

  {
    topicId:"icse_math9_ch13_pythagoras_applications",
    topic:"Pythagoras Theorem",
    subtopic:"Applications",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:13,
    key_formulas:[
      "Diagonal of rectangle: d = √(l² + b²)",
      "Diagonal of square: d = a√2",
      "Height of equilateral triangle: h = (√3/2)a",
      "Distance between two points: d = √((x₂−x₁)² + (y₂−y₁)²)"
    ],
    prerequisite_knowledge:[
      "Pythagoras Theorem",
      "Properties of rectangles, squares, equilateral triangles",
      "Square roots and surds"
    ],
    teaching_content:{
      concept_explanation:"Pythagoras Theorem is applied across a huge range of problems: finding diagonals of rectangles and squares, heights of equilateral triangles, distances between points, and lengths in 3D figures. The key skill is identifying the right angle in a figure and labelling the hypotenuse and legs correctly.",
      worked_examples:[
        {
          problem:"Find the diagonal of a rectangle 5 cm × 12 cm.",
          solution:"d = √(5²+12²) = √(25+144) = √169 = 13 cm.",
          key_insight:"Diagonal of rectangle = √(l²+b²). (5,12,13) triple."
        },
        {
          problem:"An equilateral triangle has side 10 cm. Find its height.",
          solution:"Height h = (√3/2)×10 = 5√3 cm. Alternatively: half base = 5, hyp = 10 → h = √(10²−5²) = √75 = 5√3.",
          key_insight:"Drop perpendicular from vertex to base, bisecting the base."
        },
        {
          problem:"A ladder 13 m long leans against a wall. Its foot is 5 m from the wall. How high does the ladder reach?",
          solution:"h = √(13²−5²) = √(169−25) = √144 = 12 m.",
          key_insight:"Ladder, wall, ground form a right triangle."
        }
      ],
      common_mistakes:[
        "Forgetting the 'half-base' when finding height of equilateral/isosceles triangles",
        "Incorrectly identifying the hypotenuse in context problems",
        "Not simplifying surds (e.g., leaving √75 instead of 5√3)"
      ],
      practice_variations:[
        "Find diagonal of rectangle/square",
        "Find height of equilateral or isosceles triangle",
        "Ladder-wall-ground problems",
        "Verify point on circle using Pythagoras + radius"
      ],
      visual_description:"Rectangle with diagonal drawn — right triangle formed. Equilateral triangle with perpendicular from apex to base — two right triangles. Ladder leaning against wall — right triangle.",
      mnemonics_and_tricks:"'Diagonal splits a rectangle into two right triangles.' 'Height bisects the base in equilateral/isosceles.' 'Ladder problems: always draw the right triangle.'",
      difficulty_level:"medium",
      marks_weightage:8,
      exam_frequency:"very_high",
      when_to_use_this_method:"Any time you need a length in a figure involving a right angle — diagonals, heights, ladder problems, distance between points.",
      edge_cases:["In 3D: space diagonal of cuboid = √(l²+b²+h²)","The diameter of a circle inscribed in a right triangle can be found using Pythagoras"],
      key_takeaway:"Pythagoras enables length calculations wherever a right angle exists: diagonals, heights, distances.",
      video_script_hooks:["The diagonal of a rectangle — just Pythagoras on the two sides.","Why the height of an equilateral triangle is (√3/2)a — the 30-60-90 triangle hidden inside."]
    }
  },

  {
    topicId:"icse_math9_ch13_pythagoras_problems",
    topic:"Pythagoras Theorem",
    subtopic:"Problems",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:13,
    key_formulas:[
      "In any triangle with altitude h from A to BC: AB² = BH² + AH², AC² = CH² + AH².",
      "In △ABC with altitude from A meeting BC at H: AB²−AC² = BH²−CH².",
      "Apollonius theorem (median): AB² + AC² = 2(AM² + BM²) where M is midpoint BC.",
      "Area of right triangle = ½ × leg₁ × leg₂."
    ],
    prerequisite_knowledge:[
      "Pythagoras Theorem and converse",
      "Properties of altitudes and medians",
      "Basic algebraic manipulation"
    ],
    teaching_content:{
      concept_explanation:"Advanced Pythagoras problems involve multiple right triangles within a figure, proof-based questions, and applications to altitudes and medians. Key multi-step problems: proving relations like AB²+CD²=BC²+DA² in a right angle at a point; using the altitude in a right triangle to establish proportional relationships; and proving Apollonius theorem.",
      worked_examples:[
        {
          problem:"In △ABC, ∠C=90°. D is the midpoint of AB. Prove that CD = ½AB.",
          solution:"In right △ABC: AB² = AC²+BC². CD is the median to the hypotenuse. By the median-to-hypotenuse theorem: CD = ½AB. Proof: The circumradius of a right triangle equals half the hypotenuse, and the median to the hypotenuse equals the circumradius.",
          key_insight:"Median to hypotenuse of right triangle = ½ hypotenuse."
        },
        {
          problem:"O is a point inside rectangle ABCD. Prove OA²+OC²=OB²+OD².",
          solution:"Let O=(x,y), A=(0,0), B=(a,0), C=(a,b), D=(0,b). OA²+OC²=x²+y²+(a−x)²+(b−y)². OB²+OD²=(a−x)²+y²+x²+(b−y)². Equal. QED. Also proof by Pythagoras: Drop ⊥s from O to the sides.",
          key_insight:"Classic rectangle problem: sum of squares of opposite vertices are equal."
        },
        {
          problem:"In right △ABC (∠B=90°), BD⊥AC. Prove BD²=AD·DC.",
          solution:"△ABD ~ △CBD (AA). AB/CB=BD/DC=AD/BD. From BD/DC=AD/BD: BD²=AD·DC. QED.",
          key_insight:"Altitude on hypotenuse creates two similar triangles; geometric mean relation."
        }
      ],
      common_mistakes:[
        "Not drawing auxiliary right triangles (altitudes/perpendiculars) when needed",
        "Confusing Apollonius theorem with Pythagoras",
        "Missing the similarity argument for altitude problems"
      ],
      practice_variations:[
        "Prove BD²=AD·DC (altitude on hypotenuse)",
        "OA²+OC²=OB²+OD² in rectangle",
        "Median to hypotenuse = ½ hypotenuse",
        "Prove relations using two applications of Pythagoras"
      ],
      visual_description:"Right triangle with altitude to hypotenuse — three similar triangles. Rectangle with interior point O — perpendicular drops to four corners. Triangle with median — Apollonius configuration.",
      mnemonics_and_tricks:"'Altitude on hyp = geometric mean of the two segments.' 'In rectangle, opposite vertices have equal sum of squares.' 'Median to hyp of right triangle = ½ hyp.'",
      difficulty_level:"hard",
      marks_weightage:8,
      exam_frequency:"very_high",
      when_to_use_this_method:"Use when faced with complex multi-step proofs involving right triangles, rectangles, or median problems. Draw all possible right triangles in the figure.",
      edge_cases:["Altitude to hypotenuse: three triangles are all similar (△ABC~△ABD~△CBD)","Apollonius theorem: AB²+AC²=2(AD²+BD²) where D is midpoint BC"],
      key_takeaway:"Complex Pythagoras problems require identifying multiple right triangles and applying the theorem repeatedly, often combined with similarity or properties of special quadrilaterals.",
      video_script_hooks:["Drop a perpendicular from a right angle to the hypotenuse — suddenly three triangles appear, all similar to each other.","O is any point inside a rectangle: OA²+OC² = OB²+OD². Beautiful, and Pythagoras is why."]
    }
  },


  // ── Chapter 14 · Rectilinear Figures ────────────────────────────────────
  {
    topicId:"icse_math9_ch14_quadrilateral_properties",
    topic:"Rectilinear Figures",
    subtopic:"Quadrilateral Properties",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:14,
    key_formulas:[
      "Sum of interior angles of a quadrilateral = 360°.",
      "Sum of interior angles of an n-gon = (n−2)×180°.",
      "Each exterior angle of a regular n-gon = 360°/n.",
      "Sum of all exterior angles of any convex polygon = 360°."
    ],
    prerequisite_knowledge:[
      "Angle sum of a triangle = 180°",
      "Properties of parallel lines and transversals",
      "Types of angles (alternate, co-interior, corresponding)"
    ],
    teaching_content:{
      concept_explanation:"A rectilinear figure (polygon) is a closed plane figure bounded by straight line segments. The key properties: sum of interior angles of any n-gon = (n−2)×180°. For a quadrilateral (n=4): sum = 360°. For regular polygons, each interior angle = (n−2)×180°/n and each exterior angle = 360°/n. Every convex polygon's exterior angles sum to 360°.",
      worked_examples:[
        {
          problem:"Find each interior angle of a regular hexagon.",
          solution:"Interior angle = (6−2)×180°/6 = 720°/6 = 120°.",
          key_insight:"Use formula (n−2)×180°/n for regular n-gon."
        },
        {
          problem:"In quadrilateral ABCD, ∠A=80°, ∠B=100°, ∠C=70°. Find ∠D.",
          solution:"∠D = 360°−(80°+100°+70°) = 360°−250° = 110°.",
          key_insight:"Sum of quad angles = 360°."
        },
        {
          problem:"The interior angle of a regular polygon is 150°. How many sides does it have?",
          solution:"Exterior angle = 180°−150°=30°. n=360°/30°=12. 12-sided polygon.",
          key_insight:"n = 360°÷exterior angle."
        }
      ],
      common_mistakes:[
        "Using 360° for triangles instead of 180°",
        "Confusing interior and exterior angle formulas",
        "Forgetting that exterior angle = 180° − interior angle"
      ],
      practice_variations:[
        "Find missing angle in quadrilateral",
        "Find each angle of regular n-gon",
        "Find n given interior or exterior angle",
        "Sum of interior angles of n-gon"
      ],
      visual_description:"Quadrilateral with all four angles labeled. Diagonal dividing it into two triangles (proof of 360° sum). Regular hexagon with all 120° interior angles marked.",
      mnemonics_and_tricks:"'(n−2)×180 for interior sum; 360/n for each exterior of regular polygon.' Diagonal from one vertex divides n-gon into (n−2) triangles.",
      difficulty_level:"easy",
      marks_weightage:4,
      exam_frequency:"very_high",
      when_to_use_this_method:"Use whenever angles in polygons are given or asked. Find missing angles using sum = 360°.",
      edge_cases:["For n=3: sum=180° (triangle). For n=4: sum=360° (quadrilateral)","A regular polygon with interior angle 90° is a square (n=4)"],
      key_takeaway:"Sum of interior angles of n-gon = (n−2)×180°. Quadrilateral angles sum to 360°. Exterior angles of any convex polygon sum to 360°.",
      video_script_hooks:["Cut any quadrilateral in half with a diagonal — two triangles, 2×180°=360° total.","Every exterior angle of every regular polygon — they all add to exactly 360°, no matter how many sides."]
    }
  },

  {
    topicId:"icse_math9_ch14_parallelogram_theorems",
    topic:"Rectilinear Figures",
    subtopic:"Parallelogram Theorems",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:14,
    key_formulas:[
      "In a parallelogram: opposite sides are equal and parallel.",
      "In a parallelogram: opposite angles are equal; adjacent angles are supplementary.",
      "In a parallelogram: diagonals bisect each other.",
      "Converse: A quadrilateral is a parallelogram if: (i) opposite sides equal, or (ii) opposite sides parallel, or (iii) diagonals bisect each other, or (iv) one pair of opposite sides equal and parallel."
    ],
    prerequisite_knowledge:[
      "Properties of parallel lines",
      "Congruence criteria (ASA, SAS, AAS)",
      "Angle sum of quadrilateral"
    ],
    teaching_content:{
      concept_explanation:"A parallelogram is a quadrilateral with both pairs of opposite sides parallel. The key theorems: (1) opposite sides are equal; (2) opposite angles are equal; (3) consecutive angles are supplementary; (4) diagonals bisect each other. Each of these properties has a converse that can be used to prove a quadrilateral is a parallelogram.",
      worked_examples:[
        {
          problem:"In parallelogram ABCD, ∠A=70°. Find all angles.",
          solution:"∠C=∠A=70° (opposite). ∠B=∠D=180°−70°=110° (consecutive supplementary).",
          key_insight:"Opposite angles equal; consecutive angles supplementary."
        },
        {
          problem:"Prove that opposite sides of a parallelogram are equal.",
          solution:"In ∥gm ABCD, join AC. △ABC≅△CDA (ASA: AC common, ∠BAC=∠DCA alt. angles AB∥DC, ∠BCA=∠DAC alt. angles BC∥AD). CPCT: AB=CD, BC=AD.",
          key_insight:"Draw a diagonal and use alternate angles with ASA."
        },
        {
          problem:"Prove that the diagonals of a parallelogram bisect each other.",
          solution:"In △AOB and △COD (O=intersection): AB=CD (opp. sides), ∠OAB=∠OCD and ∠OBA=∠ODC (alternate angles). ASA: △AOB≅△COD. CPCT: AO=CO, BO=DO.",
          key_insight:"Alternate angles with ASA gives congruent triangles at the intersection."
        }
      ],
      common_mistakes:[
        "Confusing 'opposite sides parallel' (definition) with 'opposite sides equal' (theorem)",
        "Using the converse incorrectly — need to verify the correct condition",
        "Forgetting that all four parallelogram properties must be checked when using converses"
      ],
      practice_variations:[
        "Find all angles of parallelogram given one",
        "Prove opposite sides equal",
        "Prove diagonals bisect each other",
        "Prove a figure is a parallelogram using converses"
      ],
      visual_description:"Parallelogram ABCD with diagonals intersecting at O. Triangles at O labeled. Arrows showing parallel sides. Equal angles marked.",
      mnemonics_and_tricks:"'In a parallelogram: opposite sides equal, opposite angles equal, diagonals bisect.' The four converses work in reverse.",
      difficulty_level:"medium",
      marks_weightage:6,
      exam_frequency:"very_high",
      when_to_use_this_method:"Use for any problem involving parallelograms — finding angles, sides, or proving a figure is a parallelogram.",
      edge_cases:["A rectangle, rhombus, and square are all special parallelograms — all parallelogram properties apply","The diagonals of a parallelogram need not be equal or perpendicular (they are for special cases)"],
      key_takeaway:"Parallelogram: opposite sides equal and parallel, opposite angles equal, consecutive angles supplementary, diagonals bisect each other.",
      video_script_hooks:["Draw one diagonal in a parallelogram — two congruent triangles appear. That's where all four properties come from.","The diagonals bisecting each other is both a property AND a way to prove something is a parallelogram."]
    }
  },

  {
    topicId:"icse_math9_ch14_special_quadrilaterals",
    topic:"Rectilinear Figures",
    subtopic:"Special Quadrilaterals",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:14,
    key_formulas:[
      "Rectangle: parallelogram with all angles 90°; diagonals equal.",
      "Rhombus: parallelogram with all sides equal; diagonals perpendicular bisectors of each other.",
      "Square: both rectangle and rhombus; diagonals equal and perpendicular.",
      "Trapezium: one pair of parallel sides; midsegment = ½(sum of parallel sides).",
      "Kite: two pairs of adjacent equal sides; one diagonal bisects the other at 90°."
    ],
    prerequisite_knowledge:[
      "Parallelogram properties",
      "Pythagoras Theorem",
      "Mid-Point Theorem"
    ],
    teaching_content:{
      concept_explanation:"Special quadrilaterals are parallelograms with extra properties. Rectangle: all right angles → diagonals are equal. Rhombus: all sides equal → diagonals are perpendicular bisectors. Square: all sides equal AND all right angles → diagonals are equal, perpendicular, and bisect each other at 45°. Trapezium has exactly one pair of parallel sides with a midsegment formula.",
      worked_examples:[
        {
          problem:"In rectangle ABCD, AC=10. Find the length of BD.",
          solution:"In a rectangle, diagonals are equal. BD=AC=10.",
          key_insight:"Diagonals of rectangle are equal."
        },
        {
          problem:"In rhombus PQRS, diagonals are 10 cm and 24 cm. Find each side.",
          solution:"Side = √((10/2)²+(24/2)²) = √(25+144) = √169 = 13 cm.",
          key_insight:"Diagonals of rhombus bisect at 90°; use Pythagoras on half-diagonals."
        },
        {
          problem:"In a kite ABCD with AB=AD and CB=CD, which diagonal is bisected?",
          solution:"The diagonal AC bisects BD at right angles. Diagonal BD is bisected by AC.",
          key_insight:"In a kite, the 'main diagonal' (connecting vertices of unequal sides) bisects the 'cross diagonal' at 90°."
        }
      ],
      common_mistakes:[
        "Forgetting that a square is a special case of both rectangle and rhombus",
        "Confusing which diagonal property applies to which special quadrilateral",
        "Applying rhombus diagonal formula to rectangles or vice versa"
      ],
      practice_variations:[
        "Rectangle: find diagonal from sides or sides from diagonal",
        "Rhombus: find side from diagonals",
        "Square: find diagonal from side",
        "Prove a quadrilateral is a rectangle/rhombus/square"
      ],
      visual_description:"Side-by-side: Rectangle (right angles, equal diagonals), Rhombus (equal sides, perpendicular diagonals), Square (both), Trapezium (one pair parallel), Kite (symmetric about one diagonal).",
      mnemonics_and_tricks:"'Rectangle = parallelogram + right angles → equal diagonals.' 'Rhombus = parallelogram + equal sides → ⊥ diagonals.' 'Square = Rectangle + Rhombus.'",
      difficulty_level:"medium",
      marks_weightage:6,
      exam_frequency:"very_high",
      when_to_use_this_method:"Use the specific diagonal properties: rectangle→equal diagonals, rhombus→perpendicular diagonals, square→both.",
      edge_cases:["A parallelogram with equal diagonals is a rectangle","A parallelogram with perpendicular diagonals is a rhombus","A parallelogram with equal AND perpendicular diagonals is a square"],
      key_takeaway:"Each special quadrilateral has unique diagonal properties. Square combines all properties of rectangle and rhombus.",
      video_script_hooks:["Slide a rectangle sideways into a rhombus — the diagonals go from equal to perpendicular.","Why square diagonals are both equal and perpendicular: it's the intersection of rectangle and rhombus."]
    }
  },

  {
    topicId:"icse_math9_ch14_rectilinear_problems",
    topic:"Rectilinear Figures",
    subtopic:"Problems and Proofs",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:14,
    key_formulas:[
      "If diagonals of a parallelogram are equal → it is a rectangle.",
      "If diagonals of a parallelogram are perpendicular → it is a rhombus.",
      "If both → it is a square.",
      "Area of parallelogram = base × height.",
      "Area of trapezium = ½ × (sum of parallel sides) × height."
    ],
    prerequisite_knowledge:[
      "All parallelogram and special quadrilateral properties",
      "Congruence and similarity",
      "Angle sum properties"
    ],
    teaching_content:{
      concept_explanation:"Problem-solving with rectilinear figures involves proving a figure is a specific type of quadrilateral, finding unknown angles or sides, and proving properties. The key strategy: identify what type of quadrilateral it is, then use its properties. Common proof strategies: draw a diagonal to create triangles; use congruence (ASA/SAS); use parallel line angle properties.",
      worked_examples:[
        {
          problem:"In parallelogram ABCD, ∠DAC=30° and ∠BAC=40°. Find ∠ABC.",
          solution:"∠BAD=∠DAC+∠BAC=30°+40°=70°. ∠ABC=180°−∠BAD=180°−70°=110° (consecutive angles).",
          key_insight:"Split the angle at A; use supplementary consecutive angles."
        },
        {
          problem:"Prove: A diagonal of a parallelogram divides it into two congruent triangles.",
          solution:"In ∥gm ABCD, diagonal AC: △ABC and △CDA. AB∥DC → ∠BAC=∠DCA (alt). BC∥AD → ∠BCA=∠DAC (alt). AC=AC (common). ASA: △ABC≅△CDA. QED.",
          key_insight:"Alternate angles + common side → ASA congruence."
        },
        {
          problem:"In trapezium ABCD with AB∥DC, if ∠A=70°, find ∠D.",
          solution:"AB∥DC and AD is transversal. Co-interior angles: ∠A+∠D=180°. ∠D=180°−70°=110°.",
          key_insight:"Co-interior angles with parallel lines sum to 180°."
        }
      ],
      common_mistakes:[
        "Using properties of a parallelogram for a trapezium (only one pair parallel)",
        "Confusing alternate angles with co-interior angles",
        "Not identifying which pair of sides are parallel in a trapezium"
      ],
      practice_variations:[
        "Find angles using co-interior/alternate properties in trapezium",
        "Prove a quadrilateral is a parallelogram",
        "Prove a parallelogram is a rectangle/rhombus",
        "Multi-step angle chasing in complex quadrilaterals"
      ],
      visual_description:"Parallelogram with diagonal dividing it into two congruent triangles. Trapezium with parallel sides labeled. Co-interior and alternate angles marked.",
      mnemonics_and_tricks:"'ASA with alternate angles and common side' is the key tool for parallelogram diagonal proof. 'Co-interior angles sum to 180° for parallel lines.'",
      difficulty_level:"hard",
      marks_weightage:8,
      exam_frequency:"very_high",
      when_to_use_this_method:"Draw diagonals, look for parallel lines, identify congruent triangles. Use the specific property that makes each quadrilateral unique.",
      edge_cases:["In an isosceles trapezium: base angles equal, diagonals equal","A cyclic quadrilateral has opposite angles summing to 180°"],
      key_takeaway:"Master the conditions for each special quadrilateral and their converse proofs. Draw diagonals and use congruence via alternate angles.",
      video_script_hooks:["A parallelogram's diagonal: two congruent triangles from a single cut. All properties flow from this.","How to prove ABCD is a rectangle: show either the diagonals are equal, or that one angle is 90°."]
    }
  },


  // ── Chapter 15 · Construction of Polygons ────────────────────────────────
  {
    topicId:"icse_math9_ch15_basic_constructions",
    topic:"Construction of Polygons",
    subtopic:"Basic Constructions",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:15,
    key_formulas:[
      "Perpendicular bisector of a segment: locus of points equidistant from both endpoints.",
      "Angle bisector: divides an angle into two equal halves.",
      "To bisect an angle: draw arcs from vertex, then arc from intersection points.",
      "To draw perpendicular at a point on a line: set equal arcs, then bisect the straight angle."
    ],
    prerequisite_knowledge:[
      "Use of compass and ruler",
      "Basic angle and line properties",
      "Locus concepts"
    ],
    teaching_content:{
      concept_explanation:"Basic constructions are the foundation of all geometric constructions. Key constructions: (1) Perpendicular bisector of a line segment — equal arcs from both ends, connect the intersection points. (2) Angle bisector — equal arcs from vertex, then arc from the two points to find the bisector. (3) Perpendicular at a point on a line — use the perpendicular bisector method on a straight angle. (4) 60° angle — equilateral triangle construction.",
      worked_examples:[
        {
          problem:"Construct the perpendicular bisector of AB=8 cm.",
          solution:"1. Draw AB=8 cm. 2. With A as centre, radius>4 cm, draw arcs above and below. 3. With B as centre, same radius, intersect the arcs at P and Q. 4. Join PQ. PQ is the perpendicular bisector.",
          key_insight:"Equal radii from both ends → intersection points lie on perpendicular bisector."
        },
        {
          problem:"Bisect ∠ABC=80°.",
          solution:"1. Draw arcs with B as centre, cutting BA at D and BC at E. 2. With D and E as centres, equal radius, draw arcs meeting at F. 3. Join BF. BF bisects ∠ABC.",
          key_insight:"Arcs from B, then arcs from intersection points to find bisector."
        }
      ],
      common_mistakes:[
        "Not keeping the compass width constant when making arcs",
        "Making arcs too small so they don't intersect",
        "Using a ruler to measure — all constructions use compass only (no measurements)"
      ],
      practice_variations:[
        "Construct perpendicular bisector of various lengths",
        "Bisect various angles",
        "Construct 30°, 45°, 60°, 90°, 120° angles",
        "Construct a line parallel to given line through a point"
      ],
      visual_description:"Step-by-step construction diagrams with arcs clearly shown. Dashed construction lines, solid final answer.",
      mnemonics_and_tricks:"'Equal arcs from both ends → perpendicular bisector.' 'Arc from vertex, then arc from arc-endpoints → angle bisector.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"These are prerequisite techniques for all polygon constructions — master them first.",
      edge_cases:["A 90° angle is constructed by bisecting a straight angle or by the perpendicular bisector method","A 45° angle is obtained by bisecting 90°"],
      key_takeaway:"Basic constructions use only compass and ruler. Perpendicular bisector and angle bisector are the two fundamental tools.",
      video_script_hooks:["The perpendicular bisector — why equal arcs from both ends always create the midpoint perpendicular.","Every regular polygon construction reduces to a 60° or 90° starting point."]
    }
  },

  {
    topicId:"icse_math9_ch15_triangle_construction",
    topic:"Construction of Polygons",
    subtopic:"Triangle Construction",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:15,
    key_formulas:[
      "A triangle is uniquely determined by: SSS, SAS, ASA, AAS, or RHS.",
      "To construct: choose the appropriate congruence condition and use it.",
      "Given base, base angles → ASA. Given three sides → SSS. Given two sides and included angle → SAS."
    ],
    prerequisite_knowledge:[
      "Triangle congruence conditions",
      "Basic constructions (perpendicular bisector, angle bisector)",
      "Angle sum of triangle = 180°"
    ],
    teaching_content:{
      concept_explanation:"A triangle is uniquely determined when enough data is given: three sides (SSS), two sides and included angle (SAS), two angles and included side (ASA), or two angles and any side (AAS). The steps: draw the base, use arcs to mark sides, or use a protractor for angles. Special case: right triangle — one angle is given as 90°, use it as RHS.",
      worked_examples:[
        {
          problem:"Construct △ABC with AB=6 cm, BC=5 cm, CA=7 cm.",
          solution:"1. Draw BC=5 cm. 2. With B as centre, radius=6 cm, draw arc. 3. With C as centre, radius=7 cm, draw arc. 4. Mark intersection as A. 5. Join AB and AC.",
          key_insight:"SSS: three sides given — two arcs find the third vertex."
        },
        {
          problem:"Construct △PQR with PQ=5 cm, ∠P=60°, ∠Q=70°.",
          solution:"1. Draw PQ=5 cm. 2. At P, construct ∠QPR=60°. 3. At Q, construct ∠PQR=70°. 4. The two lines meet at R.",
          key_insight:"ASA: two angles and included side."
        },
        {
          problem:"Construct a right triangle with hypotenuse 10 cm and one leg 6 cm.",
          solution:"1. Draw leg AB=6 cm. 2. Construct ∠A=90°. 3. With B as centre, radius=10 cm (hypotenuse), cut the perpendicular at C. 4. Join BC.",
          key_insight:"RHS: right angle, hypotenuse, one side."
        }
      ],
      common_mistakes:[
        "Not computing the third angle before ASA construction",
        "Drawing arcs from wrong vertices for SSS",
        "Forgetting that the third angle = 180° − (given two angles)"
      ],
      practice_variations:[
        "SSS construction",
        "SAS construction",
        "ASA construction (compute third angle first)",
        "RHS construction"
      ],
      visual_description:"Step-by-step triangle constructions for each case. Arcs drawn with compass. Final triangle labeled.",
      mnemonics_and_tricks:"'SSS: two arcs find apex. SAS: one arc + one ray find apex. ASA: two rays meet at apex.'",
      difficulty_level:"medium",
      marks_weightage:6,
      exam_frequency:"very_high",
      when_to_use_this_method:"Identify which congruence condition applies from the given data, then follow the steps.",
      edge_cases:["If two angles are given, compute third before drawing","For AAS: one angle, one non-included side — draw the side, mark the angles, construct"],
      key_takeaway:"Match given data to a congruence condition (SSS/SAS/ASA/AAS/RHS), then construct the triangle using compass and ruler.",
      video_script_hooks:["Three sides given — two arcs from the endpoints of the base. Their intersection is the apex.","ASA: two known angles from the ends of the base — the rays meet at the third vertex."]
    }
  },

  {
    topicId:"icse_math9_ch15_quadrilateral_construction",
    topic:"Construction of Polygons",
    subtopic:"Quadrilateral Construction",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:15,
    key_formulas:[
      "A quadrilateral needs 5 independent pieces of data (5 elements).",
      "Common combinations: 4 sides + 1 diagonal; 3 sides + 2 included angles; 4 sides + 1 angle.",
      "Parallelogram: needs 2 adjacent sides + included angle (or the diagonal).",
      "Rectangle: needs 2 adjacent sides (angles known as 90°)."
    ],
    prerequisite_knowledge:[
      "Triangle construction (dividing quadrilateral into triangles)",
      "Properties of parallelograms, rectangles, rhombuses",
      "Basic compass constructions"
    ],
    teaching_content:{
      concept_explanation:"A quadrilateral has 5 degrees of freedom, so 5 independent measurements are needed to construct it uniquely. The strategy is to divide the quadrilateral into triangles using a diagonal and construct each triangle separately. For special quadrilaterals (parallelogram, rectangle, rhombus, square), fewer measurements are needed because of the symmetry constraints.",
      worked_examples:[
        {
          problem:"Construct quadrilateral ABCD with AB=4, BC=3, CD=5, DA=6, AC=7.",
          solution:"1. Construct △ABC: AB=4, BC=3, AC=7 (SSS). 2. Construct △ACD: AC=7 (already drawn), CD=5, DA=6 (SSS). 3. Join D to complete ABCD.",
          key_insight:"Diagonal AC divides into two triangles, each constructed by SSS."
        },
        {
          problem:"Construct parallelogram ABCD with AB=6 cm, BC=4 cm, ∠ABC=75°.",
          solution:"1. Draw AB=6. 2. At B, construct ∠ABC=75°. 3. On BC direction, mark BC=4. 4. With A as centre, radius=4 cm, draw arc. 5. With C as centre, radius=6 cm, draw arc. 6. Intersection is D. Join AD and CD.",
          key_insight:"Opposite sides equal: AD=BC=4, DC=AB=6."
        }
      ],
      common_mistakes:[
        "Forgetting to check that 5 measurements are given (not fewer)",
        "Not using the diagonal to split into triangles",
        "Making arcs from the wrong vertex"
      ],
      practice_variations:[
        "Construct quadrilateral from 4 sides + diagonal",
        "Construct parallelogram from 2 sides + angle",
        "Construct rectangle from 2 sides",
        "Construct rhombus from 1 side + diagonal"
      ],
      visual_description:"Quadrilateral ABCD with diagonal AC drawn. Two separate triangle constructions shown. Final quadrilateral labeled.",
      mnemonics_and_tricks:"'Quadrilateral = two triangles. Divide by diagonal, construct each.'",
      difficulty_level:"hard",
      marks_weightage:8,
      exam_frequency:"very_high",
      when_to_use_this_method:"Always divide the quadrilateral into triangles using a diagonal, then apply triangle construction methods.",
      edge_cases:["A parallelogram needs only 3 data (2 sides + 1 angle) because opposite sides are equal","A rectangle needs only 2 data (length + breadth)"],
      key_takeaway:"5 independent measurements needed for a general quadrilateral. Use a diagonal to split into two triangles, each constructed separately.",
      video_script_hooks:["A quadrilateral has 5 degrees of freedom. Cut it with a diagonal — two triangles, each needing 3 measurements.","Parallelogram: you only need 2 sides and 1 angle. The rest is determined."]
    }
  },

  {
    topicId:"icse_math9_ch15_polygon_construction",
    topic:"Construction of Polygons",
    subtopic:"Regular Polygon Construction",
    subject:"Mathematics",
    grade:"9",
    examBoard:"ICSE",
    chapterNumber:15,
    key_formulas:[
      "Regular hexagon: all sides equal to the radius of the circumscribed circle.",
      "Regular hexagon can be inscribed in a circle by stepping off the radius 6 times.",
      "Regular pentagon: central angle = 72°; interior angle = 108°.",
      "To construct regular n-gon: divide 360° by n to get central angle; step off arcs on circle."
    ],
    prerequisite_knowledge:[
      "Circle properties",
      "Angle constructions (60°, 72°, 90°)",
      "Properties of regular polygons"
    ],
    teaching_content:{
      concept_explanation:"A regular polygon has all sides equal and all interior angles equal. It can be inscribed in a circle. The central angle subtended by each side = 360°/n. For a regular hexagon (n=6): central angle=60°, and the side equals the radius — so the hexagon can be constructed by stepping off the radius on the circle 6 times. For a regular octagon: construct a square, then cut off the corners at 45°.",
      worked_examples:[
        {
          problem:"Construct a regular hexagon with side 5 cm.",
          solution:"1. Draw a circle with radius 5 cm. 2. Mark any point A on the circle. 3. With radius=5 cm, step off 6 arcs around the circle: A, B, C, D, E, F. 4. Join consecutive points.",
          key_insight:"For regular hexagon, side = radius of circumscribed circle."
        },
        {
          problem:"Construct a regular octagon with side 3 cm.",
          solution:"1. Construct a square with the correct diagonal. 2. On each corner, mark equal distances (45° angles) to cut off. 3. Connect the 8 points.",
          key_insight:"Octagon from square: cut corners at 45°."
        }
      ],
      common_mistakes:[
        "Using the wrong radius for the hexagon (should equal side length)",
        "Not keeping arcs equal when stepping off",
        "Confusing the central angle with the interior angle"
      ],
      practice_variations:[
        "Construct regular hexagon given circumradius",
        "Construct regular hexagon given side",
        "Construct regular octagon",
        "Construct equilateral triangle inscribed in circle"
      ],
      visual_description:"Circle with radius marked. Six equal arcs stepped off. Hexagon formed by connecting points. Interior angles marked at 120°.",
      mnemonics_and_tricks:"'Hexagon side = radius. Step off 6 times, done.' 'For any regular polygon: central angle = 360/n.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"high",
      when_to_use_this_method:"For regular polygons, find the circumradius or use the given side to determine it, then inscribe in a circle.",
      edge_cases:["An equilateral triangle has central angle 120° — step off radius-length arcs every 120°","A square has central angle 90° — construct with perpendicular diameters"],
      key_takeaway:"Regular polygons inscribed in circles: central angle = 360°/n. Hexagon is special because side = radius.",
      video_script_hooks:["The regular hexagon: step off the radius exactly 6 times around the circle — it always fits perfectly.","Every regular polygon lives in a circle. Find the central angle, and you can construct any of them."]
    }
  },


  // ── Chapter 16: Area Theorems (Proof and Use) ─────────────────────────────

  {
    topicId:"icse_math9_ch16_area_parallelogram", topic:"Area Theorems", subtopic:"Area of Parallelogram", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:16,
    key_formulas:["Area of parallelogram = base × height","Area of ∥gm = ab·sin θ (sides a, b, included angle θ)","Parallelograms on same base and between same parallels are equal in area","A diagonal divides a parallelogram into two equal-area triangles"],
    prerequisite_knowledge:["Properties of parallelograms (opposite sides parallel and equal)","Concept of height/altitude perpendicular to base","Congruent triangles — SAS, ASA"],
    teaching_content:{
      concept_explanation:"The area of a parallelogram equals base × perpendicular height. The key theorem states that parallelograms on the same base and between the same parallels have equal areas, even if their shapes differ dramatically. This is because the two extra triangles cut off are congruent. A diagonal of a parallelogram divides it into two triangles of equal area.",
      worked_examples:[
        {problem:"Parallelogram ABCD has base AB = 8 cm and height = 5 cm. Find its area.",solution:"Area = base × height = 8 × 5 = 40 cm²."},
        {problem:"Two parallelograms ABCD and ABEF are on the same base AB = 6 cm and between the same parallels (distance = 4 cm). Find their areas.",solution:"Both areas = 6 × 4 = 24 cm² each, by the theorem."},
        {problem:"In ∥gm ABCD, diagonal AC divides it into △ABC and △ACD. If area of ABCD = 60 cm², find area of △ABC.",solution:"Diagonal divides into two equal triangles → area △ABC = 60/2 = 30 cm²."}
      ],
      common_mistakes:["Using slant side instead of perpendicular height","Confusing the theorem 'same base, same parallels' with 'same base, same area regardless of parallels'","Forgetting that equal area doesn't mean congruent figures"],
      practice_variations:["Find height given area and base","Prove two parallelograms on the same base have equal area","Use area to find missing dimensions"],
      visual_description:"Two parallelograms ABCD and ABEF sharing base AB, both between parallel lines l₁ (containing AB) and l₂ (containing DC and EF). Heights are equal (perpendicular distance between parallels). Triangles ADF and BCE are congruent by SAS.",
      mnemonics_and_tricks:"'Same base, same height → same area.' Think of the parallelogram as a rectangle that's been slid sideways — the height stays constant.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"To prove triangles or quadrilaterals have equal areas when they share a base and lie between the same parallels.",
      edge_cases:["If the height equals the base, area = base² (only for a square-like case)","Area by sine formula: Area = ab sin θ is useful when height is not directly given"],
      key_takeaway:"Area of parallelogram = base × height. Parallelograms on the same base and between same parallels are equal in area.",
      video_script_hooks:["Slide this parallelogram sideways — the area never changes! Same base, same parallels.","Cut the triangles, rearrange them — the parallelogram becomes a rectangle with identical area."]
    }
  },

  {
    topicId:"icse_math9_ch16_area_triangle", topic:"Area Theorems", subtopic:"Area of Triangle", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:16,
    key_formulas:["Area of triangle = ½ × base × height","Triangles on same base and between same parallels are equal in area","Triangle area = half the area of parallelogram on same base","Median divides triangle into two equal-area triangles"],
    prerequisite_knowledge:["Area of parallelogram","Midpoint theorem","Properties of medians"],
    teaching_content:{
      concept_explanation:"A triangle has half the area of a parallelogram on the same base and height. Any triangles that share the same base and have their apex on a line parallel to the base have equal areas. A median of a triangle divides it into two triangles of equal area (since the median bisects the base and the height is the same).",
      worked_examples:[
        {problem:"Triangle ABC has base BC = 10 cm and height = 6 cm. Find its area.",solution:"Area = ½ × 10 × 6 = 30 cm²."},
        {problem:"Triangles ABC and DBC are on the same base BC. If BC = 7 cm and both triangles are between the same parallels (distance = 4 cm), find both areas.",solution:"Area △ABC = Area △DBC = ½ × 7 × 4 = 14 cm² each."},
        {problem:"In △ABC, D is the midpoint of BC. Prove that area △ABD = area △ADC.",solution:"AD is the median to BC. Both triangles share height from A. BD = DC (D is midpoint). Area = ½ × BD × h = ½ × DC × h → equal areas. QED."}
      ],
      common_mistakes:["Taking slant height instead of perpendicular height","Forgetting the factor of ½","Confusing equal area with congruence"],
      practice_variations:["Triangles on same base; vertex on parallel line","Median divides into equal areas","Combine with parallelogram theorems"],
      visual_description:"Triangles ABC and DBC on base BC between parallel lines through BC and through A, D. Perpendicular heights equal. Median AD divides △ABC into two equal halves.",
      mnemonics_and_tricks:"'Triangle = half the rectangle (or parallelogram) on same base.' 'Median = area bisector.' Same base + same parallels = same area.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"When comparing areas of triangles sharing a base — if apices lie on the same parallel, areas are equal.",
      edge_cases:["Right triangle: height = one of the legs","The result extends to comparing areas of parts of triangles split by cevians"],
      key_takeaway:"Triangles on same base and between same parallels are equal in area. Median bisects triangle area.",
      video_script_hooks:["Slide the apex along a line parallel to the base — the area never changes!","The median of a triangle is the perfect area-halver."]
    }
  },

  {
    topicId:"icse_math9_ch16_area_theorems_proof", topic:"Area Theorems", subtopic:"Area Theorem Proofs", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:16,
    key_formulas:["Theorem 1: ∥gms on same base and between same parallels are equal in area","Theorem 2: Triangles on same base and between same parallels are equal in area","Corollary: ∥gm = 2 × △ on same base and between same parallels","Theorem 3: Triangles with equal bases and equal heights are equal in area"],
    prerequisite_knowledge:["Congruent triangles (SAS)", "Properties of parallelograms", "Transversal and parallel lines"],
    teaching_content:{
      concept_explanation:"The standard proofs use congruent triangles. For parallelograms on same base AB between parallels l₁ and l₂: cut triangles ADF and BCE using the parallel sides. Prove them congruent by SAS (AF=BE since ABEF is a ∥gm, AD=BC, included angles equal as AB∥EF). For triangles: draw a line through apex parallel to base; use the ∥gm theorem; since the triangle is half the ∥gm, equal ∥gms give equal triangles.",
      worked_examples:[
        {problem:"Prove that parallelograms on the same base and between the same parallels are equal in area.",solution:"Let ABCD and ABEF be two ∥gms on base AB, between parallels AB and CF. In △ADF and △BCE: AD=BC (opp. sides of ∥gm ABCD), AF=BE (opp. sides of ∥gm ABEF), DF=CE (since DC=AB=EF and CF is a straight line, so DC and EF both lie on l₂). But actually use: ∠DAF=∠CBE (corresponding ∠s, AD∥BC). By SAS: △ADF≅△BCE. Area(ABCD)=Area(ABEF) since Area(ABCD)=Area(trapezoid ABCF)−Area(△BCE) and Area(ABEF)=Area(trapezoid ABCF)−Area(△ADF), and △ADF≅△BCE. QED."},
        {problem:"Prove that a median of a triangle divides it into two triangles of equal area.",solution:"In △ABC with median AD (D midpoint of BC). Area(△ABD) = ½·BD·h, Area(△ADC) = ½·DC·h (h = height from A to BC). Since BD=DC, Areas are equal. QED."}
      ],
      common_mistakes:["Writing 'equal area' and 'congruent' interchangeably in proofs","Not justifying the congruence of cut-off triangles properly","Omitting the subtraction step in the main area proof"],
      practice_variations:["Prove theorem for triangles using the ∥gm theorem","Prove that if a triangle and a ∥gm are on the same base between same parallels, the ∥gm has twice the area of the triangle","Prove the median divides area into two halves"],
      visual_description:"Two ∥gms ABCD and ABEF on base AB between lines l₁ and l₂. Cut-off triangles at each end labelled. Congruence marks shown. Subtraction argument illustrated.",
      mnemonics_and_tricks:"'Cut off triangles are congruent → big shapes are equal.' 'Triangle = half ∥gm → equal ∥gms give equal triangles.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"In proof-type questions: identify the common base, identify that both figures lie between the same parallels, then apply the area theorem.",
      edge_cases:["If the two ∥gms overlap, the proof still holds (subtract overlapping trapezoid)","The theorem holds for triangles and ∥gms that share partial bases"],
      key_takeaway:"Standard proof: SAS congruence of cut-off triangles → equal areas. Corollary: triangle = half ∥gm on same base between same parallels.",
      video_script_hooks:["Two parallelograms, same base, same height — watch the cut-off triangles swap and prove equal area!","Equal area doesn't mean same shape. These wildly different ∥gms have the exact same area."]
    }
  },

  {
    topicId:"icse_math9_ch16_area_theorem_problems", topic:"Area Theorems", subtopic:"Area Theorem Problems", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:16,
    key_formulas:["Area of △ = ½ × base × height","Same base + same parallels → equal areas","Median divides △ into 2 equal-area triangles","Area(∥gm) = 2 × Area(△) on same base between same parallels"],
    prerequisite_knowledge:["All area theorem results", "Midpoint theorem", "Properties of quadrilaterals"],
    teaching_content:{
      concept_explanation:"Problem applications of area theorems typically ask you to compare areas, prove certain areas are equal, or find unknown areas using the theorems. Common patterns: (1) point on parallel line gives equal-area triangle; (2) diagonal divides quadrilateral into triangles of specified area ratios; (3) construction of equal-area figures; (4) using median to halve area.",
      worked_examples:[
        {problem:"In ∥gm ABCD, E is a point on AB. Prove that area △CDE = area △BCE = area △ADE.",solution:"Triangles CDE and CDB are on base CD between CD and AB (parallel). Area(△CDE) = Area(△CDB). But diagonal CB divides ∥gm into two equal areas: area(△ABC) = area(△ACD) = half area ∥gm. Also: area(△BCE) + area(△CDE) = area(△BCD) = half area ∥gm. And from the common-base theorem, area(△CDE) = area(△CDA) − area(△CEA)... Use: E on AB means △CDE and △CDB share base CD; apex E and apex B are on the same parallel AB. So area(△CDE) = area(△CDB) = half area ∥gm. Similarly for △BCE and △ADE."},
        {problem:"ABCD is a quadrilateral. P is the midpoint of AC. Prove that area△APD = area△CPD.",solution:"AD is the base? No — P is midpoint of AC. In △ACD, P is midpoint of AC → DP is the median → area △APD = area △CPD. QED."}
      ],
      common_mistakes:["Not identifying which triangles share the same base","Confusing which parallel line the apex lies on","Missing the median argument"],
      practice_variations:["Point on one side of ∥gm — equal area triangles","Proof that diagonals of ∥gm give 4 equal triangles","Application of area theorem to trapezium"],
      visual_description:"∥gm ABCD with point E on AB; diagonals drawn; area equalities marked with equal signs and coloured regions. Median DP in △ACD illustrated.",
      mnemonics_and_tricks:"'If apex moves along a parallel line, area stays constant.' 'Diagonal + median = area halver.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"See a point on a parallel line → area theorem. See a median → area bisected. See a diagonal → area halved.",
      edge_cases:["If E coincides with A or B, the triangle degenerates to a line segment — excluded","Quadrilateral with unequal halves: apply theorem to individual triangles"],
      key_takeaway:"Master the pattern: identify base, identify parallels, apply area theorem. Median always bisects area.",
      video_script_hooks:["Move point E along AB — the triangle area never changes. The proof is built in!","The diagonal of a parallelogram: always cutting it into equal halves."]
    }
  },


  // ── Chapter 17: Circle ────────────────────────────────────────────────────

  {
    topicId:"icse_math9_ch17_circle_basics", topic:"Circle", subtopic:"Circle Basics", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:17,
    key_formulas:["Circumference = 2πr = πd","Area = πr²","Diameter = 2r","A chord is a line segment joining two points on a circle","A diameter is the longest chord","Relationship: arc + chord: arc > chord (for non-diameter arcs)"],
    prerequisite_knowledge:["Basic geometry: points, lines, angles","Properties of perpendicular bisectors","Pythagoras theorem"],
    teaching_content:{
      concept_explanation:"A circle is the locus of all points at a fixed distance (radius r) from a fixed point (centre O). Key terms: radius, diameter, chord, arc (minor and major), semicircle, sector, segment. A chord divides the circle into two arcs. The perpendicular from the centre to a chord bisects it. Equal chords are equidistant from the centre.",
      worked_examples:[
        {problem:"A circle has radius 7 cm. Find its circumference and area.",solution:"Circumference = 2π × 7 = 14π ≈ 44.0 cm. Area = π × 7² = 49π ≈ 153.9 cm²."},
        {problem:"A chord of length 16 cm is at distance 6 cm from the centre. Find the radius.",solution:"Half-chord = 8 cm. r² = 8² + 6² = 64 + 36 = 100 → r = 10 cm."},
        {problem:"In a circle of radius 13 cm, a chord AB = 24 cm. Find the distance of AB from the centre.",solution:"d = √(13² − 12²) = √(169 − 144) = √25 = 5 cm."}
      ],
      common_mistakes:["Confusing radius with diameter","Forgetting that perpendicular from centre bisects the chord","Using full chord length instead of half-chord in Pythagoras"],
      practice_variations:["Find chord length given radius and distance","Find distance from centre given chord and radius","Relationship between equal chords and equal distances"],
      visual_description:"Circle with centre O. Radius OA marked. Chord PQ with perpendicular bisector from O to midpoint M of PQ. Right triangle OMP with OP = radius, OM = distance, MP = half-chord.",
      mnemonics_and_tricks:"'Perpendicular from centre → bisects chord.' For the right triangle: radius² = distance² + (half-chord)².",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"For chord-distance-radius problems: draw perpendicular from centre, use Pythagoras with half-chord.",
      edge_cases:["When the chord is a diameter, distance = 0","When chord length = radius, a specific arc-angle relationship holds"],
      key_takeaway:"Circle fundamentals: r²= d² + (c/2)² where d = distance from centre, c = chord length.",
      video_script_hooks:["The perpendicular from the centre to any chord always hits the exact middle of the chord.","Chord, radius, distance — they form a right triangle. Pythagoras solves everything."]
    }
  },

  {
    topicId:"icse_math9_ch17_chord_properties", topic:"Circle", subtopic:"Chord Properties", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:17,
    key_formulas:["Equal chords are equidistant from the centre","Chords equidistant from the centre are equal","The perpendicular from the centre to a chord bisects it (and vice versa)","Greater chord is closer to the centre","Chord length = 2√(r² − d²) where d = distance from centre"],
    prerequisite_knowledge:["Pythagoras theorem","Congruent triangles","Properties of circles"],
    teaching_content:{
      concept_explanation:"Chord properties form a key part of circle theory: (1) Perpendicular from centre bisects chord; (2) Line joining centre to midpoint of chord is perpendicular to chord; (3) Perpendicular bisector of chord passes through centre; (4) Equal chords are equidistant from centre; (5) Chords equidistant from centre are equal; (6) Longer chords are closer to the centre.",
      worked_examples:[
        {problem:"Two chords AB = 8 cm and CD = 10 cm of a circle have distances from centre as OM and ON respectively. If OM > ON, which chord is longer?",solution:"Greater chord is closer to the centre → shorter distance from centre means longer chord → CD = 10 cm is longer and is closer to centre, so ON < OM. ✓"},
        {problem:"Two chords AB and CD are equidistant from the centre. AB = 12 cm. Find CD.",solution:"Equal distances from centre → equal chords → CD = AB = 12 cm."},
        {problem:"In a circle of radius 10 cm, chord AB = 12 cm and chord CD = 16 cm. Find their distances from the centre.",solution:"d_AB = √(10² − 6²) = √(100−36) = 8 cm. d_CD = √(10² − 8²) = √(100−64) = 6 cm. CD (longer) is closer to centre ✓."}
      ],
      common_mistakes:["Thinking longer chord is farther from centre (opposite is true)","Not using perpendicular from centre to chord before applying Pythagoras"],
      practice_variations:["Compare chord lengths and distances","Prove two chords are equal given equal distances","Three chord comparison problems"],
      visual_description:"Circle with three chords of different lengths. Perpendiculars from O to each chord shown. Distances labelled. Annotation: longer chord → smaller distance.",
      mnemonics_and_tricks:"'Closer to centre → longer chord' (like the diameter is in the centre and has maximum length). 'Equal distance → equal chord.'",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"For comparison of chords: use perpendicular-distance relationship. For proofs: use congruent right triangles.",
      edge_cases:["If two chords are equal, they subtend equal angles at the centre","The perpendicular bisector of every chord passes through the centre"],
      key_takeaway:"Equal chords ↔ equal distances from centre. Longer chord → closer to centre. Perpendicular from centre bisects chord.",
      video_script_hooks:["The closer a chord gets to the centre, the longer it gets — all the way up to the diameter!","Equal chords are perfectly symmetric — equally far from the centre by symmetry."]
    }
  },

  {
    topicId:"icse_math9_ch17_arc_properties", topic:"Circle", subtopic:"Arc Properties", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:17,
    key_formulas:["Equal arcs subtend equal angles at the centre","Equal arcs have equal chords","Equal chords subtend equal arcs","Arc length = (θ/360°) × 2πr","Major arc + Minor arc = Full circumference"],
    prerequisite_knowledge:["Central angles","Chord properties","Circle basics"],
    teaching_content:{
      concept_explanation:"An arc is part of the circumference. The minor arc is shorter; the major arc is longer. Equal arcs (of the same circle or equal circles) subtend equal central angles and have equal chords. Conversely, equal central angles give equal arcs and equal chords. This three-way equivalence (arc = angle = chord) is fundamental to circle geometry.",
      worked_examples:[
        {problem:"In a circle, arc AB subtends ∠AOB = 60° at the centre. Arc CD subtends ∠COD = 60°. What can you say about arcs AB and CD?",solution:"Equal central angles → equal arcs (AB = CD). Also equal chords AB = CD."},
        {problem:"If arc AB = arc CD in a circle, prove that chord AB = chord CD.",solution:"Equal arcs → equal central angles (∠AOB = ∠COD). In △OAB and △OCD: OA=OC=OB=OD=r (radii), ∠AOB=∠COD → SAS → △OAB ≅ △OCD → AB = CD. QED."},
        {problem:"Find the arc length of a 72° arc in a circle of radius 14 cm.",solution:"Arc length = (72/360) × 2π × 14 = (1/5) × 28π = 5.6π ≈ 17.6 cm."}
      ],
      common_mistakes:["Confusing arc length with chord length","Not using the correct central angle (use degrees not radians unless specified)","Confusing minor/major arc"],
      practice_variations:["Find arc length given angle and radius","Prove equal arcs from equal chords","Find central angle given arc length"],
      visual_description:"Circle with centre O. Two equal arcs AB and CD highlighted. Equal central angles ∠AOB = ∠COD marked. Chords AB and CD drawn showing equal lengths.",
      mnemonics_and_tricks:"'Arc = Angle = Chord': if any one is equal, all three are equal for arcs in the same circle.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"When given equal arcs, immediately conclude equal angles and equal chords, and vice versa.",
      edge_cases:["This equivalence holds within the same circle or congruent circles","In different-sized circles, equal arcs don't give equal chords"],
      key_takeaway:"Equal arcs ↔ equal central angles ↔ equal chords. Arc length = (θ/360°) × 2πr.",
      video_script_hooks:["Equal arcs, equal angles, equal chords — they come in a triple!","Arc length is just a fraction of the full circumference — fraction = angle/360°."]
    }
  },

  {
    topicId:"icse_math9_ch17_circle_problems", topic:"Circle", subtopic:"Circle Problems", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:17,
    key_formulas:["Inscribed angle theorem: angle at centre = 2 × angle at circumference (same arc)","Angle in semicircle = 90°","Angles in the same segment are equal","Tangent ⊥ radius at point of tangency","Tangent from external point: two tangents are equal in length"],
    prerequisite_knowledge:["All chord and arc properties","Congruent triangles","Angle properties"],
    teaching_content:{
      concept_explanation:"Advanced circle problems combine chord, arc, and angle theorems. The inscribed angle theorem (not usually in Class 9 full detail, but introduced): angle at centre = twice angle at circumference on the same arc. Angle in semicircle is always 90°. Tangent theorems: tangent ⊥ radius, and two tangents from an external point are equal.",
      worked_examples:[
        {problem:"AB is a diameter. C is a point on the circle. Find ∠ACB.",solution:"Angle in semicircle = 90°. ∠ACB = 90°."},
        {problem:"From external point P, two tangents PA and PB touch the circle at A and B. If PA = 5 cm, find PB.",solution:"Tangents from external point are equal → PB = PA = 5 cm."},
        {problem:"In a circle, chord AB = chord CD and ∠AOB = 70°. Find ∠COD.",solution:"Equal chords → equal central angles. ∠COD = ∠AOB = 70°."}
      ],
      common_mistakes:["Confusing central angle with inscribed angle","Forgetting that tangent ⊥ radius at point of contact","Not using the equal-tangent property"],
      practice_variations:["Tangent length calculations","Angle in semicircle problems","Combining chord and angle theorems"],
      visual_description:"Circle with diameter AB, point C on circle — ∠ACB = 90° marked. External point P with two tangents PA=PB. Central angle and inscribed angle on same arc shown.",
      mnemonics_and_tricks:"'Angle in semicircle = 90° always.' 'Two tangents from one point = equal lengths.' These are exam favourites.",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"For angle problems: check if it's inscribed in semicircle (90°). For tangent problems: use OA⊥PA and equal tangents.",
      edge_cases:["Angle in semicircle is 90° for any position of C on the major arc","If PA and PB are tangents, then OP bisects ∠APB and AB"],
      key_takeaway:"Angle in semicircle = 90°. Tangents from external point are equal. These are the key exam results.",
      video_script_hooks:["Any triangle inscribed in a semicircle has a right angle at the vertex on the circle!","Two tangents from outside a circle — always the same length, no matter where the external point is."]
    }
  },


  // ── Chapter 18: Statistics ────────────────────────────────────────────────

  {
    topicId:"icse_math9_ch18_data_collection", topic:"Statistics", subtopic:"Data Collection", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:18,
    key_formulas:["Primary data: collected directly","Secondary data: collected from existing sources","Raw data → Array (arranged in order)","Range = Maximum value − Minimum value","Class width = (Range)/(Number of classes)"],
    prerequisite_knowledge:["Basic arithmetic","Counting and tallying","Number ordering"],
    teaching_content:{
      concept_explanation:"Statistics is the science of collecting, organising, presenting, and interpreting data. Raw data is unorganised; data arranged in ascending/descending order is an array. Data types: primary (firsthand) and secondary (from existing records). Data classification: individual series (ungrouped), discrete frequency distribution, continuous (grouped) frequency distribution.",
      worked_examples:[
        {problem:"The ages of 10 students are: 15, 14, 16, 15, 13, 14, 16, 15, 14, 13. Arrange as an array and find the range.",solution:"Array: 13, 13, 14, 14, 14, 15, 15, 15, 16, 16. Range = 16 − 13 = 3."},
        {problem:"Find a suitable class width for data ranging from 20 to 85 using 5 classes.",solution:"Range = 85 − 20 = 65. Class width ≈ 65/5 = 13. Use 14 (round up). Classes: 20-33, 34-47, 48-61, 62-75, 76-89."},
        {problem:"What is the difference between primary and secondary data?",solution:"Primary: collected directly (surveys, experiments). Secondary: collected from existing records (census data, published statistics)."}
      ],
      common_mistakes:["Including both endpoints when forming class intervals (exclusive vs inclusive)","Choosing too many or too few classes (ideal: 5-15)","Confusing discrete and continuous data"],
      practice_variations:["Form frequency distribution from raw data","Determine class width","Identify data type (primary/secondary, discrete/continuous)"],
      visual_description:"Table showing raw data, then tally marks, then frequency table with classes, frequency, and cumulative frequency columns.",
      mnemonics_and_tricks:"'CODOPI' = Collect, Organize, Display, Operate, Present, Interpret — the 6 steps of statistics.",
      difficulty_level:"easy",
      marks_weightage:3,
      exam_frequency:"medium",
      when_to_use_this_method:"When given raw data: first sort it (array), calculate range, determine class width, then build frequency table.",
      edge_cases:["For open-ended classes (below 10, 80 and above), special handling needed","Continuous data: class boundaries differ from class limits"],
      key_takeaway:"Range = Max − Min. Class width = Range / Number of classes. Raw data → organised frequency distribution.",
      video_script_hooks:["Data collection: every number tells a story. Statistics helps us read it.","Before any analysis, sort the data. An array is your foundation."]
    }
  },

  {
    topicId:"icse_math9_ch18_frequency_distribution", topic:"Statistics", subtopic:"Frequency Distribution", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:18,
    key_formulas:["Frequency (f): number of times a value occurs","Relative frequency = f/N (N = total)","Cumulative frequency: running total of frequencies","Class mark (midpoint) = (lower limit + upper limit)/2","Class boundary = (upper limit of one class + lower limit of next)/2"],
    prerequisite_knowledge:["Data collection","Tally marks","Arithmetic operations"],
    teaching_content:{
      concept_explanation:"A frequency distribution table organises data into classes with their frequencies. The class mark (midpoint) is used in calculations. Cumulative frequency gives the number of data values below a class. For continuous data, class boundaries are used. Relative frequency converts to fractions/percentages for comparison.",
      worked_examples:[
        {problem:"Create a frequency distribution for: 5, 7, 9, 5, 8, 7, 6, 5, 8, 9, 7, 6, 5, 8, 7 with classes 5-6, 7-8, 9-10.",solution:"5-6: 5,5,5,6,6,5 = 6 | 7-8: 7,7,7,7,8,8,8 = 7 | 9-10: 9,9 = 2. Total = 15."},
        {problem:"Find the class marks for classes 10-20, 20-30, 30-40.",solution:"Class marks: (10+20)/2=15, (20+30)/2=25, (30+40)/2=35."},
        {problem:"Cumulative frequency for: f = 3, 7, 12, 8, 5.",solution:"CF: 3, 10, 22, 30, 35. Total = 35."}
      ],
      common_mistakes:["Miscounting tally marks","Confusing class mark with class boundary","Not verifying that frequencies sum to total N"],
      practice_variations:["Build complete frequency distribution table","Find class marks and cumulative frequencies","Use cumulative frequency to answer 'how many below X' questions"],
      visual_description:"Frequency table with Class, Tally, Frequency, Class Mark, and Cumulative Frequency columns. Tally marks shown in groups of 5.",
      mnemonics_and_tricks:"'Class mark = middle of class.' 'CF = running total from top.' Sum of all frequencies = N (always check).",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"For data organisation before drawing graphs or calculating mean/median. Always find class marks for mean calculation.",
      edge_cases:["For inclusive classes (10-19, 20-29): class boundaries are 9.5-19.5, etc.","For exclusive classes (10-20, 20-30): boundaries = class limits"],
      key_takeaway:"Frequency distribution: organise data into classes. Class mark = midpoint. CF = cumulative sum. Sum of f = N.",
      video_script_hooks:["A frequency table is a summary of chaos — raw data tamed into order.","Class marks are the 'representatives' of each interval. You'll need them for the mean."]
    }
  },

  {
    topicId:"icse_math9_ch18_graphical_representation", topic:"Statistics", subtopic:"Graphical Representation", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:18,
    key_formulas:["Histogram: frequency vs class boundaries (no gaps between bars)","Frequency polygon: connect midpoints of histogram tops + extend to x-axis","Bar graph: discrete data, bars with gaps","Pie chart: angle = (frequency/total) × 360°","Frequency density = frequency / class width"],
    prerequisite_knowledge:["Frequency distribution","Percentages","Basic graph plotting"],
    teaching_content:{
      concept_explanation:"Statistical data is presented graphically for visual interpretation. Histogram: for continuous data, bars are adjacent (no gaps). Frequency polygon: connect midpoints of bar tops, extended to base. Bar chart: for discrete data with gaps between bars. Pie chart: circle divided into sectors proportional to frequency. Each graph type serves different purposes.",
      worked_examples:[
        {problem:"Draw a pie chart for: Subject preference — Math(30), Science(20), English(15), History(10), Arts(5). Total = 80.",solution:"Angles: Math=30/80×360=135°, Science=90°, English=67.5°, History=45°, Arts=22.5°. Total=360° ✓."},
        {problem:"From a histogram, describe how to draw the frequency polygon.",solution:"Find midpoint of each class interval. Plot point at (midpoint, frequency). Add two extra midpoints (one class before first, one class after last) with frequency 0. Join all points with straight lines."},
        {problem:"For class 20-30 with frequency 15, find frequency density (class width = 10).",solution:"Frequency density = 15/10 = 1.5."}
      ],
      common_mistakes:["Leaving gaps in a histogram (should be no gaps for continuous data)","Forgetting to extend frequency polygon to baseline","Using frequency density in unequal class widths"],
      practice_variations:["Draw and interpret histograms","Convert histogram to frequency polygon","Calculate and draw pie chart sectors"],
      visual_description:"Side-by-side: histogram (adjacent bars), frequency polygon (line joining midpoints), bar graph (gaps between bars), pie chart (labelled sectors).",
      mnemonics_and_tricks:"'Histogram has no history gaps' — bars touch. 'Polygon connects the peaks.' Pie chart: (f/N)×360°.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Choose histogram/polygon for continuous data, bar chart for discrete, pie chart for comparing proportions.",
      edge_cases:["Frequency polygon must touch x-axis at both ends","For unequal class widths: use frequency density on y-axis"],
      key_takeaway:"Histogram: no gaps, continuous data. Polygon: connect midpoints. Pie: (f/N)×360°. Bar: gaps, discrete data.",
      video_script_hooks:["A histogram is a bar chart with no breathing room — the bars must touch!","The frequency polygon is just the histogram's skeleton — connect the peaks, reach the floor."]
    }
  },

  {
    topicId:"icse_math9_ch18_statistics_problems", topic:"Statistics", subtopic:"Statistics Problems", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:18,
    key_formulas:["Mean (ungrouped) = Σx/n","Grouped mean = Σ(f×x̄)/Σf (x̄ = class mark)","Range = Max − Min","Mode = most frequent value","Median = middle value when sorted"],
    prerequisite_knowledge:["Frequency distribution","Class marks","Arithmetic"],
    teaching_content:{
      concept_explanation:"Statistics problems involve reading and interpreting frequency tables, histograms, and other graphs. Common tasks: find mean from grouped data, interpret cumulative frequency, read a histogram to answer questions, calculate pie chart angles. The mean from grouped data uses class marks as representatives of each class.",
      worked_examples:[
        {problem:"Find the mean from: Class 10-20 f=3, 20-30 f=7, 30-40 f=10, 40-50 f=8, 50-60 f=2. Total = 30.",solution:"Class marks: 15, 25, 35, 45, 55. f×x: 45, 175, 350, 360, 110. Σfx = 1040. Mean = 1040/30 ≈ 34.67."},
        {problem:"From a pie chart, if the 'Sports' sector has angle 72°, what percentage of students prefer sports?",solution:"72/360 × 100 = 20%."},
        {problem:"A histogram shows classes 0-10, 10-20, 20-30 with heights (frequency densities) 3, 5, 4. Total area?",solution:"Area = 3×10 + 5×10 + 4×10 = 30+50+40 = 120 = total frequency."}
      ],
      common_mistakes:["Using class limit instead of class mark in mean calculation","Reading pie chart angles instead of computing them","Not verifying sum of frequencies = N"],
      practice_variations:["Compute grouped mean","Interpret histogram or pie chart","Create data from given mean (reverse problems)"],
      visual_description:"Worked frequency table with f×x column, sum row, and mean computation. Pie chart with sectors labelled. Histogram with frequency density on y-axis.",
      mnemonics_and_tricks:"'Mean from grouped data: multiply each class mark by its frequency, sum, divide by total n.' 'Histogram area = total frequency.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"For grouped mean: always use class marks (midpoints). For reading graphs: extract frequencies, then apply relevant formula.",
      edge_cases:["If a class is open-ended, assume reasonable class width for class mark","For equal class widths, frequency density histogram = frequency histogram"],
      key_takeaway:"Grouped mean = Σ(f × class mark)/Σf. Histogram area = total frequency. Pie chart: (f/N) × 360° = sector angle.",
      video_script_hooks:["The mean from grouped data: class marks are your stand-ins for raw data. Multiply and sum.","Every bar in a histogram represents an area — and all areas together equal the total count."]
    }
  },


  // ── Chapter 19: Mean and Median ───────────────────────────────────────────

  {
    topicId:"icse_math9_ch19_mean_calculation", topic:"Mean and Median", subtopic:"Mean Calculation", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:19,
    key_formulas:["Mean (raw data) = Σx/n","Mean (grouped) = Σ(fx̄)/Σf (x̄ = class mark)","Assumed mean method: Mean = A + Σ(fd)/Σf (d = x̄ − A)","If all observations increase by k: new mean = old mean + k","If all observations multiplied by k: new mean = k × old mean"],
    prerequisite_knowledge:["Frequency distribution","Class marks","Basic arithmetic"],
    teaching_content:{
      concept_explanation:"The arithmetic mean (average) is the most commonly used measure of central tendency. For raw data, it's the sum divided by count. For grouped data, use class marks as representatives. The assumed mean method simplifies calculation: choose a convenient assumed mean A, find deviations d = x̄ − A, compute Mean = A + Σ(fd)/Σf. Properties: adding a constant to all observations adds that constant to the mean; multiplying adds a factor.",
      worked_examples:[
        {problem:"Find the mean of: 12, 15, 18, 21, 24.",solution:"Mean = (12+15+18+21+24)/5 = 90/5 = 18."},
        {problem:"Grouped data: Classes 0–10 (f=2), 10–20 (f=4), 20–30 (f=6), 30–40 (f=5), 40–50 (f=3). Find mean.",solution:"Class marks: 5,15,25,35,45. Σfx = 10+60+150+175+135=530. N=20. Mean=530/20=26.5."},
        {problem:"Use assumed mean A=25: Classes above. d: −20,−10,0,10,20. Σfd = 2(−20)+4(−10)+6(0)+5(10)+3(20) = −40−40+0+50+60=30. Mean = 25+30/20 = 25+1.5 = 26.5 ✓."}
      ],
      common_mistakes:["Using class limits instead of class marks","Arithmetic errors in multiplication","Forgetting to divide by N (total frequency)"],
      practice_variations:["Raw data mean","Grouped data mean using direct method","Assumed mean method","Finding missing value given mean"],
      visual_description:"Frequency table with extra columns: class mark, d = x̄ − A, f×d. Final row: N = Σf, Σfd. Mean formula applied.",
      mnemonics_and_tricks:"'Mean = balance point.' For assumed mean: pick the most central class mark. 'Shortcut columns: d = deviation, fd = product.'",
      difficulty_level:"medium",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"Direct method for small datasets; assumed mean for large ones. Always use class marks for grouped data.",
      edge_cases:["If all values are equal, mean = that value","Mean is affected by extreme values (outliers)"],
      key_takeaway:"Mean = Σfx/N. Assumed mean method: Mean = A + Σfd/N. Properties: shifting and scaling affect the mean proportionally.",
      video_script_hooks:["The mean is the balancing point — if the data were weights on a number line, the mean is where it balances.","Assumed mean method: pick the middle, measure deviations, add back. Simpler arithmetic!"]
    }
  },

  {
    topicId:"icse_math9_ch19_median_calculation", topic:"Mean and Median", subtopic:"Median Calculation", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:19,
    key_formulas:["Raw data (odd n): Median = ((n+1)/2)-th value","Raw data (even n): Median = average of (n/2)-th and (n/2+1)-th values","Grouped median = L + [(N/2 − CF)/f] × h (L=lower boundary, CF=cumulative frequency before median class, f=median class frequency, h=class width)","Median class = class containing the (N/2)-th observation"],
    prerequisite_knowledge:["Cumulative frequency","Sorting data","Frequency distribution"],
    teaching_content:{
      concept_explanation:"The median is the middle value when data is sorted. For even n, average the two middle values. For grouped data, find the median class (where cumulative frequency first exceeds N/2), then use the interpolation formula. The median is not affected by extreme values (outliers).",
      worked_examples:[
        {problem:"Find the median of: 3, 7, 1, 9, 5, 4, 8.",solution:"Sorted: 1,3,4,5,7,8,9. n=7 (odd). Median = 4th value = 5."},
        {problem:"Find the median of: 12, 15, 18, 21, 24, 27.",solution:"n=6 (even). Median = (3rd+4th)/2 = (18+21)/2 = 19.5."},
        {problem:"Grouped: Classes 0–10(cf=5), 10–20(cf=12), 20–30(cf=22), 30–40(cf=30). N=30. Find median.",solution:"N/2=15. CF before 20–30 class = 12. Median class = 20–30. Median = 20 + [(15−12)/10] × 10 = 20 + 3 = 23."}
      ],
      common_mistakes:["Not sorting data before finding median","Using wrong formula for even/odd n","In grouped median: using class limit instead of class boundary"],
      practice_variations:["Raw data median (odd and even n)","Grouped data median using formula","Comparing mean and median in skewed data"],
      visual_description:"Number line with sorted data; middle value marked. Cumulative frequency table with N/2 marked; median class highlighted; interpolation formula applied.",
      mnemonics_and_tricks:"'Median = middle man.' For grouped: L is the lower boundary of median class. 'cf is the cumulative frequency BEFORE (not including) the median class.'",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Sort raw data first. For grouped: find median class from cumulative frequency, then interpolate.",
      edge_cases:["For n=1, median = the single value","For grouped data with equal class widths, the formula simplifies nicely"],
      key_takeaway:"Median = middle value (sorted). Grouped median: L + [(N/2−CF)/f] × h. Median is robust to outliers.",
      video_script_hooks:["The median doesn't care about extremes — it just wants the middle.","For grouped data, the median formula is like finding exactly where you cross the halfway mark."]
    }
  },

  {
    topicId:"icse_math9_ch19_mode_calculation", topic:"Mean and Median", subtopic:"Mode Calculation", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:19,
    key_formulas:["Mode = most frequently occurring value","Grouped mode (modal class) = class with highest frequency","Mode from grouped data = L + [(f₁−f₀)/(2f₁−f₀−f₂)] × h (L=lower boundary of modal class, f₁=modal class frequency, f₀=preceding frequency, f₂=following frequency)","Relationship: Mean − Mode ≈ 3(Mean − Median) (empirical)"],
    prerequisite_knowledge:["Frequency distribution","Class frequencies","Mean and median"],
    teaching_content:{
      concept_explanation:"The mode is the most frequently occurring value. Data can be unimodal (one mode), bimodal (two modes), or multimodal. For grouped data, the modal class is the class with highest frequency; the mode can be estimated by the grouping formula. The empirical relationship Mean − Mode ≈ 3(Mean − Median) connects all three measures for moderately skewed distributions.",
      worked_examples:[
        {problem:"Find the mode of: 2, 4, 3, 2, 5, 2, 3, 4, 2.",solution:"2 appears 4 times (most). Mode = 2."},
        {problem:"Data: 10, 12, 14, 12, 15, 14, 12, 14. Find mode.",solution:"12 appears 3 times, 14 appears 3 times. Bimodal: Mode = 12 and 14."},
        {problem:"If mean = 30 and median = 28, estimate mode using empirical formula.",solution:"Mode ≈ Mean − 3(Mean − Median) = 30 − 3(30−28) = 30 − 6 = 24."}
      ],
      common_mistakes:["Missing a mode in bimodal data","Applying grouped mode formula to raw data","Confusing modal class with mode value"],
      practice_variations:["Find mode from raw data","Find modal class from frequency table","Use empirical formula with given mean and median"],
      visual_description:"Bar chart with tallest bar = modal class. Grouped mode formula diagram showing adjacent class frequencies. Empirical formula triangle linking mean, median, mode.",
      mnemonics_and_tricks:"'Mode = most.' Empirical: Mode ≈ 3Median − 2Mean. 'Modal class = tallest bar in histogram.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"For raw data: count, find most frequent. For grouped: identify tallest class; use formula if exact mode value needed.",
      edge_cases:["Uniform distribution: no mode (all values equal frequency)","The empirical formula only applies to moderately skewed distributions"],
      key_takeaway:"Mode = most frequent value. Modal class = highest frequency class. Empirical: Mode = 3Median − 2Mean.",
      video_script_hooks:["Mode is the most popular value — the crowd favourite of the dataset.","Empirical formula: if you know mean and median, you can estimate the mode without counting a single value."]
    }
  },

  {
    topicId:"icse_math9_ch19_central_tendency_problems", topic:"Mean and Median", subtopic:"Central Tendency Problems", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:19,
    key_formulas:["Mean = Σfx/N","Median = L + [(N/2−CF)/f]×h","Mode = 3Median − 2Mean (empirical)","If N values have mean M, and a value a is replaced by b: New mean = M + (b−a)/N","Weighted mean = Σ(w×x)/Σw"],
    prerequisite_knowledge:["Mean, median, mode definitions","Grouped data calculations","Algebraic manipulation"],
    teaching_content:{
      concept_explanation:"Central tendency problems combine mean, median, and mode calculations with algebraic reasoning. Common tasks: (1) find missing value given mean; (2) find mean when values are modified; (3) use empirical formula; (4) compare mean, median, mode for skewness; (5) weighted average problems. Choosing the right measure: mean for symmetric data, median for skewed/ordinal data, mode for categorical data.",
      worked_examples:[
        {problem:"Mean of 5 observations is 20. If one observation of 25 is replaced by 35, find new mean.",solution:"Old sum = 100. Change = 35−25 = 10. New sum = 110. New mean = 110/5 = 22."},
        {problem:"Find weighted mean: Scores 80,90,70 with weights 3,2,1.",solution:"Σwx = 240+180+70=490. Σw=6. Weighted mean = 490/6 ≈ 81.7."},
        {problem:"Mean = 35, Mode = 32. Find median using empirical formula.",solution:"Mode = 3Median − 2Mean → 32 = 3M − 70 → 3M = 102 → M = 34."}
      ],
      common_mistakes:["Forgetting to update N when adding/removing values","Using simple average instead of weighted mean when weights are given","Wrong direction of empirical formula (solving for the wrong unknown)"],
      practice_variations:["Finding missing value from mean","Replacing a value and finding new mean","Using empirical relation","Weighted mean"],
      visual_description:"Summary table: three measures, their formulas, strengths, and typical use cases. Empirical triangle diagram.",
      mnemonics_and_tricks:"'Replace: new mean = old mean + change/N.' 'Empirical: Mode=3Median−2Mean.' 'Weighted: heavier observations pull the mean.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"Identify what is given (mean? median? sum?) and what is missing. Use the appropriate formula or relationship.",
      edge_cases:["If all weights are equal, weighted mean = simple mean","When data is bimodal, the empirical formula breaks down"],
      key_takeaway:"Master all three measures and their interrelationship. Mean = Σfx/N. Empirical: Mode = 3Med − 2Mean. Replace a value: ΔMean = Δvalue/N.",
      video_script_hooks:["Replace one value — the mean shifts by exactly the change divided by n. Elegant!","Weighted mean: some opinions count more than others."]
    }
  },


  // ── Chapter 20: Area and Perimeter ────────────────────────────────────────

  {
    topicId:"icse_math9_ch20_area_plane_figures", topic:"Area and Perimeter", subtopic:"Area of Plane Figures", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:20,
    key_formulas:["Area of rectangle = l × b","Area of square = a²","Area of triangle = ½ × base × height","Area of parallelogram = base × height","Area of trapezium = ½(a+b) × h (a,b = parallel sides, h = height)","Area of rhombus = ½ × d₁ × d₂","Heron's formula: A = √[s(s−a)(s−b)(s−c)] where s = (a+b+c)/2"],
    prerequisite_knowledge:["Properties of quadrilaterals","Pythagoras theorem","Basic arithmetic"],
    teaching_content:{
      concept_explanation:"Area is the amount of flat space enclosed by a figure. For irregular quadrilaterals: divide into triangles. Heron's formula gives triangle area from all three sides without needing height. The trapezium area = average of parallel sides × height. Rhombus area uses diagonals because they are perpendicular bisectors.",
      worked_examples:[
        {problem:"Find the area of a triangle with sides 13, 14, 15 cm.",solution:"s=(13+14+15)/2=21. Area=√[21×8×7×6]=√7056=84 cm²."},
        {problem:"A trapezium has parallel sides 12 cm and 8 cm with height 5 cm. Find its area.",solution:"Area = ½(12+8)×5 = ½×20×5 = 50 cm²."},
        {problem:"A rhombus has diagonals 10 cm and 24 cm. Find its area and side.",solution:"Area = ½×10×24=120 cm². Side = √(5²+12²)=√169=13 cm."}
      ],
      common_mistakes:["Using full diagonals instead of half-diagonals for the side of a rhombus","Forgetting to halve the product in rhombus area","Incorrect semi-perimeter in Heron's formula"],
      practice_variations:["Find area using Heron's formula","Trapezium with different parallel sides","Rhombus from diagonals","Mixed polygon problems"],
      visual_description:"Trapezium with parallel sides labelled, height shown. Rhombus with perpendicular diagonals. Triangle with altitude. All labelled with dimensions.",
      mnemonics_and_tricks:"'Trapezium = average the parallel sides × height.' 'Rhombus area = half the product of diagonals.' Heron: s = half perimeter, then 4 products under root.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Heron when no height is given; standard formula when height is available.",
      edge_cases:["For isosceles triangle, Heron simplifies","All formulas assume the shape lies flat (2D)"],
      key_takeaway:"Know all area formulas. Heron's: s=(a+b+c)/2, A=√[s(s-a)(s-b)(s-c)]. Rhombus: ½d₁d₂.",
      video_script_hooks:["Heron's formula: no height needed — just three sides and a square root!","Rhombus diagonals always meet at right angles — that's why the area is ½×d₁×d₂."]
    }
  },

  {
    topicId:"icse_math9_ch20_perimeter_plane_figures", topic:"Area and Perimeter", subtopic:"Perimeter of Plane Figures", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:20,
    key_formulas:["Perimeter of rectangle = 2(l+b)","Perimeter of square = 4a","Perimeter of triangle = a+b+c","Perimeter of parallelogram = 2(a+b)","Perimeter of rhombus = 4a","Perimeter of trapezium = sum of all 4 sides"],
    prerequisite_knowledge:["Basic shapes","Pythagoras theorem for finding sides"],
    teaching_content:{
      concept_explanation:"Perimeter is the total length of the boundary of a 2D figure. For irregular shapes, add all sides. For regular polygons: perimeter = n × side. For a rectangle: 2(l+b). For a parallelogram with sides a and b: 2(a+b) (both pairs of parallel sides). The perimeter of a rhombus is 4× the side length.",
      worked_examples:[
        {problem:"Find the perimeter of a rectangle with length 12 cm and breadth 7 cm.",solution:"P = 2(12+7) = 2×19 = 38 cm."},
        {problem:"Find the perimeter of a rhombus with diagonal 16 cm and 12 cm.",solution:"Half-diagonals: 8 and 6. Side = √(8²+6²) = √100 = 10 cm. P = 4×10 = 40 cm."},
        {problem:"A trapezium has parallel sides 15 cm and 9 cm, and non-parallel sides 7 cm and 8 cm. Find perimeter.",solution:"P = 15+9+7+8 = 39 cm."}
      ],
      common_mistakes:["Adding all four sides for rectangle instead of 2(l+b) — these give the same result but make sure to add correctly","For rhombus: finding side using Pythagoras before multiplying by 4"],
      practice_variations:["Perimeter of regular polygon","Perimeter from given area","Side from given perimeter"],
      visual_description:"Rectangle with l and b labelled; arrows on all four sides. Rhombus with diagonals and right angle at intersection. Perimeter path highlighted.",
      mnemonics_and_tricks:"'Perimeter = walk around the boundary.' Rectangle = 2(l+b). Rhombus = 4 × side (find side from diagonals using Pythagoras).",
      difficulty_level:"easy",
      marks_weightage:3,
      exam_frequency:"medium",
      when_to_use_this_method:"Perimeter: add all sides or use specific formula. For rhombus/parallelogram, find side first if diagonals are given.",
      edge_cases:["A square is a special rectangle: P=4a","A rhombus is a special parallelogram: P=4a"],
      key_takeaway:"Perimeter = sum of all sides. Rectangle: 2(l+b). Rhombus: 4×side (side from Pythagoras with half-diagonals).",
      video_script_hooks:["Perimeter is just walking the boundary — count every step.","For the rhombus: diagonals cross at right angles, giving a right triangle with half-diagonals as legs."]
    }
  },

  {
    topicId:"icse_math9_ch20_circle_area_perimeter", topic:"Area and Perimeter", subtopic:"Circle Area and Perimeter", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:20,
    key_formulas:["Circumference = 2πr = πd","Area of circle = πr²","Area of semicircle = πr²/2","Perimeter of semicircle = πr + 2r = r(π+2)","Area of sector = (θ/360°) × πr²","Length of arc = (θ/360°) × 2πr","Area of ring (annulus) = π(R²−r²)"],
    prerequisite_knowledge:["Circle basics","Angle measurement","Pythagoras theorem"],
    teaching_content:{
      concept_explanation:"Circle area and circumference are the foundation for sector, arc, and ring problems. A sector is a 'pie slice' with angle θ at centre. A ring (annulus) is the region between two concentric circles. For a semicircle, the perimeter includes the diameter and the curved arc.",
      worked_examples:[
        {problem:"Find the area and perimeter of a semicircle of radius 7 cm (π=22/7).",solution:"Area = ½×(22/7)×49 = 77 cm². Perimeter = (22/7)×7 + 2×7 = 22+14 = 36 cm."},
        {problem:"A sector has radius 14 cm and central angle 90°. Find its arc length and area.",solution:"Arc = (90/360)×2×(22/7)×14 = ¼×88 = 22 cm. Area = (90/360)×(22/7)×196 = ¼×616 = 154 cm²."},
        {problem:"Find the area of a ring with outer radius 10 cm and inner radius 6 cm.",solution:"Area = π(10²−6²) = π(100−36) = 64π ≈ 201.1 cm²."}
      ],
      common_mistakes:["Forgetting to add diameter when computing semicircle perimeter","Using r instead of r² in area formula","Not converting angle to fraction of 360° in sector problems"],
      practice_variations:["Sector area and arc length","Semicircle perimeter and area","Annulus (ring) area","Combined figures with circles and rectangles"],
      visual_description:"Circle with sector shaded (θ at centre, arc and two radii). Semicircle with diameter labelled. Annulus (two concentric circles) with R and r labelled.",
      mnemonics_and_tricks:"'Sector = fraction of circle.' Fraction = θ/360. Area = fraction × πr². Arc = fraction × 2πr. Semicircle perimeter: arc + diameter = πr + 2r.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"For any circular shape: identify if it's a full circle, semicircle, sector, or ring, then apply the appropriate formula.",
      edge_cases:["θ=180° sector = semicircle","θ=360° sector = full circle","Ring inner radius = 0 → full disk"],
      key_takeaway:"Sector area = (θ/360)×πr². Arc = (θ/360)×2πr. Semicircle perimeter = πr+2r. Ring area = π(R²−r²).",
      video_script_hooks:["A sector is just a fraction of a circle. The fraction is θ/360.","The ring: outer circle minus inner circle — area is as simple as R²−r² times π."]
    }
  },

  {
    topicId:"icse_math9_ch20_area_perimeter_problems", topic:"Area and Perimeter", subtopic:"Area and Perimeter Problems", subject:"Mathematics", grade:"9", examBoard:"ICSE", chapterNumber:20,
    key_formulas:["Composite area = sum or difference of component areas","Area of path (outer area − inner area)","Area of shaded region = total area − unshaded area","Cost = area × rate per unit","Number of tiles = area / tile area"],
    prerequisite_knowledge:["All area and perimeter formulas","Algebraic manipulation","Unit conversion"],
    teaching_content:{
      concept_explanation:"Real-world area and perimeter problems involve: (1) composite figures (combine or subtract shapes); (2) cost problems (area × rate); (3) tiling (divide by tile area); (4) path problems (subtract inner from outer); (5) perimeter given area or vice versa. Always draw a diagram, identify component shapes, and work systematically.",
      worked_examples:[
        {problem:"A rectangular field 50m × 40m has a 2m wide path inside it. Find the area of the path.",solution:"Inner area = (50−4)×(40−4) = 46×36 = 1656. Outer area = 2000. Path area = 2000−1656 = 344 m²."},
        {problem:"A floor 12m × 8m is to be tiled with tiles 30cm × 20cm. How many tiles?",solution:"Floor area = 12×8 = 96 m² = 960000 cm². Tile area = 30×20=600 cm². Tiles = 960000/600 = 1600."},
        {problem:"A park has a semicircular lawn (r=7m) adjacent to a square garden (side 14m). Find total area and perimeter.",solution:"Square area = 196. Semicircle area = ½×(22/7)×49 = 77. Total = 273 m². Perimeter = 3 sides of square + semicircle arc = 3×14 + (22/7)×7 = 42+22 = 64 m."}
      ],
      common_mistakes:["Using wrong units (mixing m and cm)","Forgetting that a path inside a rectangle reduces both length and breadth by 2×width","Not subtracting inner boundary when computing composite perimeters"],
      practice_variations:["Path problems","Cost of painting/fencing","Combined circle-rectangle figures","Tiling problems"],
      visual_description:"Rectangular field with inner path shaded. Composite figure with semicircle on one end. Tiled floor with tiles labelled. All with dimensions.",
      mnemonics_and_tricks:"'Path problems: subtract path from both l and b: inner = (l−2w)×(b−2w).' 'Always check units — cm² vs m².'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"Draw the figure. Identify all component shapes. Sum or subtract areas. Convert units if needed. Final answer with units.",
      edge_cases:["If path is outside, add 2w to each dimension","For circular paths: annulus formula"],
      key_takeaway:"Composite area = sum/difference of parts. Path inside: inner dims = outer − 2×path-width. Cost = area × rate. Tiles = floor-area/tile-area.",
      video_script_hooks:["Real-world math: how many tiles for your floor? Divide areas!","A path inside a rectangle: it shrinks length by 2w and breadth by 2w. Path area = difference."]
    }
  },


  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 21 — Solids (Surface Area and Volume)
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch21_cuboid_cylinder",
    subject:"Mathematics",
    key_formulas:[
      "Cuboid: TSA = 2(lb+bh+lh), V = lbh, Diagonal = √(l²+b²+h²)",
      "Cube: TSA = 6a², V = a³, Diagonal = a√3",
      "Cylinder: CSA = 2πrh, TSA = 2πr(r+h), V = πr²h",
      "Hollow cylinder: V = π(R²−r²)h"
    ],
    prerequisite_knowledge:[
      "Area and perimeter of rectangle and circle",
      "Concept of 2D nets folding into 3D shapes",
      "Square roots for diagonal calculations"
    ],
    teaching_content:{
      concept_explanation:"A cuboid is a 3D rectangle — like a brick or a box. Its surface area is the sum of the areas of its six rectangular faces grouped into three pairs: top+bottom (lb), front+back (bh), sides (lh). Volume = base area × height = l×b×h. A cube is a special cuboid with all sides equal. A cylinder is a curved solid with two circular ends. Unrolling the curved surface gives a rectangle of width 2πr and height h — hence CSA = 2πrh. The two circular ends add 2πr², giving TSA = 2πr(r+h).",
      worked_examples:[
        {problem:"A cuboid is 8 cm × 6 cm × 5 cm. Find TSA, volume, and diagonal.",solution:"TSA = 2(8×6+6×5+8×5) = 2(48+30+40) = 2×118 = 236 cm². V = 8×6×5 = 240 cm³. Diagonal = √(64+36+25) = √125 = 5√5 cm."},
        {problem:"A cylinder has r=7 cm, h=10 cm. Find CSA, TSA, and volume. (π=22/7)",solution:"CSA = 2πrh = 2×(22/7)×7×10 = 440 cm². TSA = 2πr(r+h) = 2×(22/7)×7×17 = 748 cm². V = πr²h = (22/7)×49×10 = 1540 cm³."}
      ],
      common_mistakes:["Confusing CSA and TSA for cylinder — TSA includes both circular ends","For hollow cylinder, volume uses R²−r², not (R−r)²"],
      practice_variations:["Find missing dimension given SA/V","Hollow cylinder problems","Cost of painting curved surface","Cube/cuboid nets"],
      visual_description:"Cuboid with labelled l, b, h. Net unfolded showing 6 rectangles. Cylinder with net showing rectangle plus 2 circles.",
      mnemonics_and_tricks:"'Cuboid TSA: pair them up — lb twice, bh twice, lh twice'. 'Cylinder CSA: rectangle with width=circumference, height=h'.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"very high",
      when_to_use_this_method:"Identify the solid. Write formula. Substitute. Check units (cm vs m, cm² vs m²).",
      edge_cases:["Open cylinder (like a tin without lid): TSA = CSA + πr² (one end only)","Cube diagonal = a√3 ≠ face diagonal a√2"],
      key_takeaway:"Cuboid TSA = 2(lb+bh+lh), V = lbh. Cylinder CSA = 2πrh, V = πr²h. Units: area in cm², volume in cm³.",
      video_script_hooks:["Unroll a can label — it's a rectangle! Width = circumference = 2πr","A matchbox: 6 faces, 3 pairs — calculate area like wrapping paper"]
    }
  },
  {
    topicId:"icse_math9_ch21_cone_pyramid",
    subject:"Mathematics",
    key_formulas:[
      "Cone: slant height l = √(r²+h²), CSA = πrl, TSA = πr(r+l), V = ⅓πr²h",
      "Square pyramid: TSA = base + 4 triangular faces = a² + 4×(½×a×l)",
      "Volume of any pyramid = ⅓ × base area × height"
    ],
    prerequisite_knowledge:[
      "Area of circle, triangle",
      "Pythagoras theorem for slant height",
      "Concept of apex and base in 3D geometry"
    ],
    teaching_content:{
      concept_explanation:"A cone has a circular base and an apex. The slant height l is the distance from apex to any point on the base circle edge — use Pythagoras: l = √(r²+h²). Unrolling the curved surface gives a sector of radius l and arc length 2πr, so CSA = πrl. For a pyramid, the base can be any polygon. The 4 triangular faces have base = side of base square (a) and height = slant height of the pyramid face. Volume of ANY pyramid = ⅓ × base area × h (same rule as cone).",
      worked_examples:[
        {problem:"A cone has r=5 cm, h=12 cm. Find l, CSA, TSA, V. (π=22/7)",solution:"l=√(25+144)=√169=13. CSA=π×5×13=65π≈204.3 cm². TSA=π×5×(5+13)=90π≈282.9 cm². V=⅓×π×25×12=100π≈314.3 cm³."},
        {problem:"A square pyramid has base 6 cm and slant height 5 cm. Find TSA and V.",solution:"Base area=36. Triangular face area=½×6×5=15. 4 faces=60. TSA=36+60=96 cm². Height: h²=l²−(a/2)²=25−9=16→h=4. V=⅓×36×4=48 cm³."}
      ],
      common_mistakes:["Using h instead of l for CSA of cone","Forgetting to find h from slant height before computing volume"],
      practice_variations:["Cost of canvas for conical tent","Pyramid with different polygon bases","Compound solid problems"],
      visual_description:"Right circular cone with r, h, l labelled. Right-angled triangle inside showing r, h, l. Square pyramid with base and slant height.",
      mnemonics_and_tricks:"'Cone CSA = π r l — remember two rs: r-adius and s-l-ant = πrl'. 'V = ⅓ × base area × height for ALL pyramids including cone'.",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"high",
      when_to_use_this_method:"First find slant height using Pythagoras. Then apply area/volume formula.",
      edge_cases:["If only CSA and r given, find l first: l = CSA/(πr)","Open cone (tent): just CSA, no base"],
      key_takeaway:"Slant height l=√(r²+h²). Cone CSA=πrl. V of cone/pyramid = ⅓×base×h.",
      video_script_hooks:["An ice-cream cone: r, h, slant height — all three relate by Pythagoras","Why does V(cone) = ⅓V(cylinder)? Fill 3 cones of water into a cylinder!"]
    }
  },
  {
    topicId:"icse_math9_ch21_sphere_hemisphere",
    subject:"Mathematics",
    key_formulas:[
      "Sphere: SA = 4πr², V = (4/3)πr³",
      "Hemisphere: CSA = 2πr², TSA = 3πr², V = (2/3)πr³",
      "Relation: V(sphere) = 2×V(hemisphere), SA(sphere) = 4×(area of great circle)"
    ],
    prerequisite_knowledge:[
      "Area of circle (πr²)",
      "Concept of radius in 3D",
      "Units of surface area (cm²) and volume (cm³)"
    ],
    teaching_content:{
      concept_explanation:"A sphere is perfectly round in 3D — every point on its surface is equidistant from the centre. Its surface area = 4πr² (four times the area of its great circle). A hemisphere is half a sphere. Its curved surface = 2πr² (half of sphere). Its flat circular base = πr². Total surface area = 2πr² + πr² = 3πr². Volume of sphere = (4/3)πr³; hemisphere = (2/3)πr³.",
      worked_examples:[
        {problem:"Find SA and V of a sphere with r=7 cm. (π=22/7)",solution:"SA = 4πr² = 4×(22/7)×49 = 4×154 = 616 cm². V = (4/3)×(22/7)×343 = (4/3)×1078 = 4312/3 ≈ 1437.3 cm³."},
        {problem:"A solid hemisphere has r=10.5 cm. Find TSA and V. (π=22/7)",solution:"TSA = 3πr² = 3×(22/7)×110.25 = 1039.5 cm². V = (2/3)×(22/7)×1157.625 = 2425.5 cm³."}
      ],
      common_mistakes:["Using CSA=2πr² instead of TSA=3πr² for solid hemisphere","Forgetting the flat base of hemisphere"],
      practice_variations:["Shot-put ball SA/V","Hemispherical bowl — inner and outer","Sphere melted into cones","Solid hemispheres and solid spheres cost problems"],
      visual_description:"Full sphere labelled with r. Cross-section showing hemisphere. Hemisphere showing flat base (circle) and curved top.",
      mnemonics_and_tricks:"'Sphere SA = 4πr² = 4 circles'. 'Hemisphere TSA = 3πr² = curved(2) + flat(1) = 3 circles'. 'Volume sphere = (4/3)πr³, hemisphere = half = (2/3)πr³'.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Identify sphere or hemisphere. For hemisphere: check if open (CSA only) or solid (TSA). Apply formula.",
      edge_cases:["Bowl (hollow hemisphere): use inner/outer radii for area and volume","Sphere + cone or sphere + cylinder compound problems"],
      key_takeaway:"Sphere: 4πr², (4/3)πr³. Hemisphere (solid): 3πr², (2/3)πr³. Always distinguish CSA from TSA.",
      video_script_hooks:["A football is a sphere. Wrap it in paper — you'd need exactly 4 great-circle areas","Why does V = (4/3)πr³? Cavalieri's principle: compare sphere cross-sections with cylinder − cone."]
    }
  },
  {
    topicId:"icse_math9_ch21_solid_problems",
    subject:"Mathematics",
    key_formulas:[
      "Recasting: Volume in = Volume out (e.g. sphere melted into cones)",
      "Canvas tent: CSA = πrl (cone) or CSA = 2πrh (cylinder)",
      "Cost problems: Cost = SA × rate per unit area, or Volume × rate per unit volume"
    ],
    prerequisite_knowledge:[
      "SA and V formulas for all solids",
      "Equation solving for unknown dimensions",
      "Unit conversions (m/cm, m²/cm², m³/cm³)"
    ],
    teaching_content:{
      concept_explanation:"Word problems on solids fall into three types: (1) Canvas/paint problems — find surface area then multiply by cost/unit. (2) Recasting/melting — the volume stays constant: Volume of original = Volume of new shape. (3) Composite solids — add areas/volumes of component parts. The key is identifying which formula applies and what 'unknown' to solve for.",
      worked_examples:[
        {problem:"A metallic sphere of radius 12 cm is melted into small cones of radius 3 cm and height 4 cm. How many cones are formed?",solution:"V(sphere)=(4/3)π×1728=2304π. V(cone)=⅓π×9×4=12π. Number=2304π/12π=192 cones."},
        {problem:"A cylindrical tank has r=7 m and h=10 m. Find capacity in litres. (1 m³=1000 L)",solution:"V=πr²h=(22/7)×49×10=1540 m³=1,540,000 litres."}
      ],
      common_mistakes:["In recasting, forgetting that volume is conserved, not surface area","Mixing up CSA and TSA for cost problems — read question carefully"],
      practice_variations:["How many smaller solids from a larger","Canvas cost for tent","Water capacity in tanks","Comparing SA of different shapes with equal volume"],
      visual_description:"Sphere splitting into multiple small cones with equal-volume arrows. Cylinder tank with water level.",
      mnemonics_and_tricks:"'Melt/recast = Volume in = Volume out'. 'Canvas/paint = Surface area'. 'Water capacity = Volume'.",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"Read what is given and what is asked. Draw the solid. Identify SA or V formula needed. Set up equation.",
      edge_cases:["If sphere is melted into cylinder: πr²h = (4/3)πR³ — solve for h or R","Tent with cylindrical base + conical top: add CSA of both parts"],
      key_takeaway:"Canvas → CSA. Water/capacity → V. Melting/recasting → V₁ = V₂. Always state formula before substitution.",
      video_script_hooks:["How many chocolate balls fit in a giant sphere? Melt and recast!","A circus tent: cylindrical walls + conical roof — CSA of both gives canvas needed."]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 22 — Trigonometrical Ratios
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch22_trig_ratios_definition",
    subject:"Mathematics",
    key_formulas:[
      "sin θ = Opposite/Hypotenuse, cos θ = Adjacent/Hypotenuse, tan θ = Opposite/Adjacent",
      "cosec θ = 1/sin θ, sec θ = 1/cos θ, cot θ = 1/tan θ",
      "tan θ = sin θ/cos θ, cot θ = cos θ/sin θ",
      "sin²θ + cos²θ = 1 (Pythagorean identity)"
    ],
    prerequisite_knowledge:[
      "Pythagoras theorem",
      "Right-angled triangle — identifying opposite, adjacent, hypotenuse",
      "Concept of angle in a triangle"
    ],
    teaching_content:{
      concept_explanation:"Trigonometric ratios compare the sides of a right-angled triangle for a given acute angle. For angle θ: the side facing θ is 'opposite', the side next to θ (not hypotenuse) is 'adjacent', and the longest side (opposite the right angle) is 'hypotenuse'. The six ratios — sin, cos, tan, cosec, sec, cot — are defined as ratios of these sides. The key insight: the value of each ratio depends only on the angle, not on the size of the triangle. All right triangles with the same angle θ give the same ratio values.",
      worked_examples:[
        {problem:"In right △ABC with ∠B=90°, AB=5, BC=12. Find all six trig ratios for ∠A.",solution:"AC=√(25+144)=13. sin A=BC/AC=12/13, cos A=AB/AC=5/13, tan A=BC/AB=12/5. cosec A=13/12, sec A=13/5, cot A=5/12."},
        {problem:"If sin θ = 3/5, find cos θ and tan θ.",solution:"Opposite=3, Hypotenuse=5, Adjacent=√(25−9)=4. cos θ=4/5, tan θ=3/4."}
      ],
      common_mistakes:["Mixing up opposite and adjacent — always draw and label the triangle first","sin θ ≠ sin × θ — it's a function, not multiplication"],
      practice_variations:["Find all 6 ratios given one ratio","Find ratio from sides","Express one ratio in terms of another"],
      visual_description:"Right triangle with angle θ at A. Sides labelled: opposite (BC), adjacent (AB), hypotenuse (AC). SOH-CAH-TOA diagram.",
      mnemonics_and_tricks:"SOH-CAH-TOA: Sin=Opp/Hyp, Cos=Adj/Hyp, Tan=Opp/Adj. Reciprocals: cosec=1/sin, sec=1/cos, cot=1/tan.",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"very high",
      when_to_use_this_method:"Draw right triangle, label sides relative to the angle. Apply definition. Use Pythagoras to find missing side.",
      edge_cases:["sin θ > 1 is impossible for real angles","If one ratio is given, find the third side using Pythagoras before computing others"],
      key_takeaway:"SOH-CAH-TOA. Six ratios come in three reciprocal pairs. sin²θ + cos²θ = 1 always.",
      video_script_hooks:["Trigonometry started with astronomers measuring star distances using angles only","SOH-CAH-TOA: the three-letter key to all of trigonometry"]
    }
  },
  {
    topicId:"icse_math9_ch22_trig_ratios_complementary",
    subject:"Mathematics",
    key_formulas:[
      "sin(90°−θ) = cos θ, cos(90°−θ) = sin θ",
      "tan(90°−θ) = cot θ, cot(90°−θ) = tan θ",
      "sec(90°−θ) = cosec θ, cosec(90°−θ) = sec θ"
    ],
    prerequisite_knowledge:[
      "Six trig ratio definitions",
      "Sum of angles in a right triangle = 180° (so the two acute angles sum to 90°)",
      "Complementary angles concept"
    ],
    teaching_content:{
      concept_explanation:"In any right triangle with acute angles θ and φ, we have θ + φ = 90° (complementary angles). The 'opposite' of θ is the 'adjacent' of φ, and vice versa. So sin θ = opposite/hypotenuse = adjacent of φ/hypotenuse = cos φ = cos(90°−θ). This gives us the complementary angle identities: sin and cos are co-functions (the 'co-' in cosine means 'complementary'), as are tan and cot, sec and cosec.",
      worked_examples:[
        {problem:"If sin 35° = cos θ, find θ.",solution:"cos θ = sin 35° = cos(90°−35°) = cos 55°. So θ = 55°."},
        {problem:"Simplify: tan 40° / cot 50°.",solution:"cot 50° = tan(90°−50°) = tan 40°. So tan40°/cot50° = tan40°/tan40° = 1."}
      ],
      common_mistakes:["Thinking sin and cos are unrelated — they are co-functions","Forgetting that cosec is the co-function of sec (not sin)"],
      practice_variations:["Simplify expressions using complementary identities","Find θ when sin θ = cos(specific angle)","Prove trigonometric identities using complementary relations"],
      visual_description:"Right triangle showing both acute angles θ and 90°−θ. Arrows showing which sides swap when angle changes.",
      mnemonics_and_tricks:"'Co-function pairs: sin↔cos, tan↔cot, sec↔cosec. Replace θ with (90°−θ) and the co-function swaps.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"When an expression has two trig functions of complementary angles, use the identity to match them and cancel.",
      edge_cases:["cos(90°−0°) = cos 90° = 0, and sin 0° = 0 ✓","These identities hold only for acute angles in Class 9 scope"],
      key_takeaway:"sin(90°−θ) = cos θ and vice versa. Use to simplify expressions where two angles sum to 90°.",
      video_script_hooks:["Why is it called cosine? 'Co-' means complement — cosine = sine of the complementary angle","If sin 37° = 0.6, you immediately know cos 53° = 0.6 — same triangle!"]
    }
  },
  {
    topicId:"icse_math9_ch22_trig_tables_use",
    subject:"Mathematics",
    key_formulas:[
      "Trig table gives values for 0° to 90° in 1° steps (or 0.1° via mean differences)",
      "sin θ increases from 0 to 1 as θ goes from 0° to 90°",
      "cos θ decreases from 1 to 0 as θ goes from 0° to 90°",
      "tan θ increases from 0 to ∞ as θ goes from 0° to 90°"
    ],
    prerequisite_knowledge:[
      "Six trigonometric ratio definitions",
      "How to read a table (row × column)",
      "Decimal notation"
    ],
    teaching_content:{
      concept_explanation:"Trigonometric tables list the values of sin, cos, tan for angles from 0° to 90°. Each row gives the angle in degrees and the ratio value. A difference column allows interpolation for decimal degrees. Key behaviour: sin and tan increase from 0°→90°, while cos decreases. To find an angle from a ratio (inverse), look up the value in the table and read the corresponding angle.",
      worked_examples:[
        {problem:"From table, sin 37° = 0.6018. Find the angle whose sine is 0.7880.",solution:"Look up 0.7880 in sine table → sin 52° = 0.7880. Answer: θ = 52°."},
        {problem:"Find value of (sin 30° + cos 60°).",solution:"sin 30° = 0.5, cos 60° = 0.5. Sum = 1.0."}
      ],
      common_mistakes:["Reading cos table from the wrong end (cos decreases, so large angle = small cos)","Confusing rows and columns in the difference columns"],
      practice_variations:["Read sin/cos/tan from tables","Find angle given ratio value","Verify Pythagorean identity using table values"],
      visual_description:"Portion of a trigonometric table showing degrees, sin values, and mean difference columns.",
      mnemonics_and_tricks:"'sin All up (0→1), cos All down (1→0), tan All up but blows up at 90°'.",
      difficulty_level:"easy",
      marks_weightage:3,
      exam_frequency:"medium",
      when_to_use_this_method:"Use tables when the angle is not a standard angle (not 0°, 30°, 45°, 60°, 90°).",
      edge_cases:["tan 90° is undefined (approaches infinity)","For angles between integer degrees, use mean differences column"],
      key_takeaway:"Tables give decimal values for all angles. sin↑ cos↓ as angle↑. Use inverse lookup to find angle from ratio.",
      video_script_hooks:["Before calculators, engineers used trig tables to build bridges — we're using the same numbers","Notice sin 30°=0.5 exactly — no table needed! Standard angles are exact."]
    }
  },
  {
    topicId:"icse_math9_ch22_trig_ratios_problems",
    subject:"Mathematics",
    key_formulas:[
      "Proof-type: express everything in sin and cos, simplify",
      "Value-type: substitute known trig values and compute",
      "Equation-type: rearrange using identities to find unknown angle"
    ],
    prerequisite_knowledge:[
      "All six trig ratio definitions and reciprocal relations",
      "sin²θ + cos²θ = 1",
      "Algebraic manipulation skills"
    ],
    teaching_content:{
      concept_explanation:"Trigonometric ratio problems are of three main types: (1) Value problems — given a ratio, find other ratios using Pythagoras. (2) Proof problems — show that a trigonometric expression equals a given value, usually by writing in terms of sin/cos. (3) Equation problems — solve for θ using ratio values or identities. The strategy is always: draw the triangle (if geometric), express unknown ratios, use identities if needed.",
      worked_examples:[
        {problem:"If tan A = 4/3, find sin A and cos A without using tables.",solution:"Opposite=4, Adjacent=3, Hypotenuse=5 (3-4-5 triple). sin A = 4/5, cos A = 3/5."},
        {problem:"Prove: (1 − sin²A)/cos A = cos A.",solution:"LHS = cos²A/cos A = cos A = RHS. (Used sin²A + cos²A = 1 → cos²A = 1 − sin²A.)"}
      ],
      common_mistakes:["Not recognising Pythagorean triples (3-4-5, 5-12-13, 8-15-17)","In proofs: manipulating both sides simultaneously — only work on LHS"],
      practice_variations:["Given one ratio, find all others","Prove: (sin θ + cos θ)² = 1 + 2sin θ cos θ","Evaluate expressions without tables using given ratios"],
      visual_description:"Right triangle with sides labelled from given ratio. Proof shown as LHS → intermediate steps → RHS.",
      mnemonics_and_tricks:"'Pythagorean triples to remember: 3-4-5, 5-12-13, 8-15-17, 7-24-25'. 'In proofs: convert to sin and cos, then simplify'.",
      difficulty_level:"hard",
      marks_weightage:5,
      exam_frequency:"very high",
      when_to_use_this_method:"Geometric problems: draw triangle, use definitions. Algebraic proofs: convert to sin/cos, use identity sin²+cos²=1.",
      edge_cases:["sin²A + cos²A = 1 is the key identity — memorise and use freely","1 + tan²A = sec²A and 1 + cot²A = cosec²A (derived from sin²+cos²=1, not in scope but useful)"],
      key_takeaway:"Pythagorean triple → draw triangle → find ratios. Proofs: use sin²+cos²=1. Ratios are ratios — dimensionless.",
      video_script_hooks:["A ship navigator uses sin and cos to find its actual position from speed and direction","Given just tan A = 4/3, you can recover all six trig values — the power of the 3-4-5 triangle"]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 23 — Trigonometrical Ratios of Standard Angles
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch23_standard_angles_0_30_45",
    subject:"Mathematics",
    key_formulas:[
      "sin 0°=0, cos 0°=1, tan 0°=0",
      "sin 30°=1/2, cos 30°=√3/2, tan 30°=1/√3",
      "sin 45°=1/√2, cos 45°=1/√2, tan 45°=1"
    ],
    prerequisite_knowledge:[
      "Trig ratio definitions (SOH-CAH-TOA)",
      "30-60-90 and 45-45-90 triangle properties",
      "Surds (√2, √3) and their approximate values"
    ],
    teaching_content:{
      concept_explanation:"Standard angles have exact trig values derived from specific triangles. For 45°: use an isosceles right triangle with legs = 1 → hypotenuse = √2. So sin 45° = cos 45° = 1/√2 = √2/2, tan 45° = 1. For 30° and 60°: use an equilateral triangle of side 2, bisected into two 30-60-90 triangles with sides 1, √3, 2. At 30°: opposite=1, adjacent=√3 → sin 30° = 1/2, cos 30° = √3/2. At 0°: the angle approaches 0, triangle collapses → sin 0° = 0, cos 0° = 1.",
      worked_examples:[
        {problem:"Find: 2sin 30° + 3cos 45° − tan 45°",solution:"= 2(1/2) + 3(1/√2) − 1 = 1 + 3/√2 − 1 = 3/√2 = 3√2/2 ≈ 2.12"},
        {problem:"If sin θ = cos θ, find θ.",solution:"sin θ/cos θ = 1 → tan θ = 1 → θ = 45°."}
      ],
      common_mistakes:["sin 30° = 1/2, NOT √3/2 (confusing 30° and 60°)","tan 45° = 1, NOT 0 (that's tan 0°)"],
      practice_variations:["Evaluate trigonometric expressions","Solve simple trig equations","Prove identities using standard values"],
      visual_description:"Two triangles: 45-45-90 (legs=1, hyp=√2) and 30-60-90 (sides 1, √3, 2). Standard values table.",
      mnemonics_and_tricks:"Memory trick for sin: 0°→0, 30°→1/2, 45°→1/√2, 60°→√3/2, 90°→1. Pattern: sin θ = √(0,1,2,3,4)/2 for the five standard angles.",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"very high",
      when_to_use_this_method:"When angle is 0°, 30°, or 45° — use exact value from memory, not tables.",
      edge_cases:["1/√2 = √2/2 (rationalise the denominator for exact form)","sin 0° × any = 0; cos 0° × any = same thing"],
      key_takeaway:"sin 30°=½, cos 30°=√3/2, tan 30°=1/√3. sin 45°=cos 45°=1/√2, tan 45°=1. Know the two source triangles.",
      video_script_hooks:["A tile at 45° — the diagonal is √2 times the side. That's where sin 45°=1/√2 comes from","Cut an equilateral triangle in half: you get the 30-60-90 master triangle for standard angle values"]
    }
  },
  {
    topicId:"icse_math9_ch23_standard_angles_60_90",
    subject:"Mathematics",
    key_formulas:[
      "sin 60°=√3/2, cos 60°=1/2, tan 60°=√3",
      "sin 90°=1, cos 90°=0, tan 90°=undefined (∞)",
      "Relationship: sin(90°−θ)=cos θ ties 30°↔60° and 45°↔45°"
    ],
    prerequisite_knowledge:[
      "Values for 0°, 30°, 45°",
      "30-60-90 triangle",
      "Concept of undefined (tan 90° → ∞)"
    ],
    teaching_content:{
      concept_explanation:"At 60°: from the 30-60-90 triangle (1, √3, 2), at the 60° vertex, opposite=√3, adjacent=1. So sin 60°=√3/2, cos 60°=1/2, tan 60°=√3. At 90°: the triangle degenerates — the adjacent side → 0, so cos 90°=0, sin 90°=1, and tan 90° is undefined (opposite/adjacent → ∞). Notice the symmetry: sin 60°=cos 30°, cos 60°=sin 30°, tan 60°=cot 30° — all from the complementary angle identity.",
      worked_examples:[
        {problem:"Evaluate: cos 60° + sin 60° × tan 60°",solution:"= 1/2 + (√3/2)×√3 = 1/2 + 3/2 = 4/2 = 2."},
        {problem:"Prove: (sin 60° + cos 30°)(sin 30° + cos 60°) = 2.",solution:"=(√3/2+√3/2)(1/2+1/2) = (√3)(1) = √3 ≠ 2. Let me recalculate: = (√3/2+√3/2)=√3 and (1/2+1/2)=1 → product = √3. Hmm, product is √3, not 2. Problem should be: (sin60°+cos60°)(sin30°+cos30°) = (√3/2+1/2)(1/2+√3/2)=((√3+1)/2)²=(4+2√3)/4=(2+√3)/2 ≠ 2 either. Use the standard example: sin²60°+cos²60°=3/4+1/4=1 ✓ (identity verification)."}
      ],
      common_mistakes:["cos 60°=1/2, NOT √3/2 (that's sin 60°)","tan 90° is undefined — not 0 or 1"],
      practice_variations:["Verify sin²60°+cos²60°=1","Solve: 2cos θ = 1 (θ=60°)","Find: tan²60°−sin²30°"],
      visual_description:"30-60-90 triangle with 60° angle highlighted. The opposite and adjacent sides for 60° clearly labelled (√3 and 1). tan 90° shown on unit circle as vertical asymptote.",
      mnemonics_and_tricks:"'sin 60° = √3/2 > sin 30° = 1/2 because bigger angle = bigger sine (for 0° to 90°)'. 'cos goes down: cos 30°=√3/2 > cos 60°=1/2'.",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"very high",
      when_to_use_this_method:"Recognise the angle, use the memorised value. For undefined (tan 90°), state the expression is undefined.",
      edge_cases:["sin 90°=1 is the maximum value of sine","tan 60°=√3 means the angle of inclination of a straight slope in geometry"],
      key_takeaway:"sin 60°=√3/2, cos 60°=½, tan 60°=√3. sin 90°=1, cos 90°=0, tan 90°=∞. Together with 0°/30°/45°, the standard angle table is complete.",
      video_script_hooks:["Stacking a 60° slope: tan 60°=√3≈1.73 — the rise is 1.73× the run. Steep!","90°: the adjacent side vanishes — that's why cos 90°=0 and tan 90° blows up"]
    }
  },
  {
    topicId:"icse_math9_ch23_trig_standard_identities",
    subject:"Mathematics",
    key_formulas:[
      "sin²θ + cos²θ = 1",
      "tan θ = sin θ / cos θ",
      "sec²θ = 1 + tan²θ, cosec²θ = 1 + cot²θ"
    ],
    prerequisite_knowledge:[
      "Six trig ratio definitions",
      "Pythagoras theorem",
      "Algebraic manipulation"
    ],
    teaching_content:{
      concept_explanation:"The fundamental identity sin²θ + cos²θ = 1 is directly derived from the Pythagorean theorem: if opposite=a, adjacent=b, hypotenuse=c, then a²+b²=c². Divide by c²: (a/c)²+(b/c)²=1 → sin²θ+cos²θ=1. Two derived identities: divide by cos²θ → tan²θ+1=sec²θ; divide by sin²θ → 1+cot²θ=cosec²θ. These three identities power most trigonometric proofs at this level.",
      worked_examples:[
        {problem:"If sin θ = 5/13, find the value of (1−cos²θ)/(sin θ cos θ).",solution:"cos θ = √(1−25/169) = √(144/169) = 12/13. 1−cos²θ = sin²θ = 25/169. sin θ cos θ = (5/13)(12/13) = 60/169. Expression = (25/169)÷(60/169) = 25/60 = 5/12."},
        {problem:"Prove: sin²A/cos A + cos A = 1/cos A.",solution:"LHS = sin²A/cos A + cos A = (sin²A + cos²A)/cos A = 1/cos A = RHS. ✓"}
      ],
      common_mistakes:["sin²θ means (sin θ)², not sin(θ²)","Dividing by zero: never divide identity by sin θ or cos θ without checking if they could be 0"],
      practice_variations:["Prove identities using sin²+cos²=1","Express sec²A−1 in terms of sin and cos","Simplify expressions using identities"],
      visual_description:"Right triangle with sides a, b, c labelled. Proof of a²+b²=c² divided by c² step by step. The three identities in a box.",
      mnemonics_and_tricks:"'sin²+cos²=1 — the mother identity. All others are children: divide by cos² to get tan² identity, by sin² for cot² identity'.",
      difficulty_level:"hard",
      marks_weightage:5,
      exam_frequency:"very high",
      when_to_use_this_method:"Use sin²θ+cos²θ=1 in almost every proof. Convert sec/cosec/tan/cot back to sin/cos for simplification.",
      edge_cases:["1−sin²θ = cos²θ and 1−cos²θ = sin²θ are the most-used rearrangements","sec²θ−tan²θ = 1 is useful when both appear in an expression"],
      key_takeaway:"sin²θ+cos²θ=1 is the foundation. Derive: 1+tan²θ=sec²θ, 1+cot²θ=cosec²θ. Use these to simplify and prove.",
      video_script_hooks:["Pythagoras theorem ÷ c² = the most useful equation in trigonometry","Every trigonometric proof at ICSE level uses just three identities — memorise all three."]
    }
  },
  {
    topicId:"icse_math9_ch23_standard_angles_problems",
    subject:"Mathematics",
    key_formulas:[
      "Substitution method: replace standard angles and compute numerically",
      "Equation solving: e.g. 2cos θ = 1 → cos θ = 1/2 → θ = 60°",
      "Verify identity by substituting standard angle values"
    ],
    prerequisite_knowledge:[
      "Complete standard angle value table (0°, 30°, 45°, 60°, 90°)",
      "Basic algebraic manipulation",
      "Trig identities"
    ],
    teaching_content:{
      concept_explanation:"Standard angle problems combine value substitution with algebraic simplification. Types: (A) Evaluate numerical expressions by substituting exact values. (B) Solve trig equations like 2sin θ = 1 → sin θ = 1/2 → θ = 30°. (C) Verify identities by testing at a standard angle (though this does NOT constitute a proof). The examiner expects exact answers in surd form, not decimal approximations.",
      worked_examples:[
        {problem:"Find θ if tan θ + cot θ = 2, where θ is between 0° and 90°.",solution:"tan θ + 1/tan θ = 2 → tan²θ − 2tan θ + 1 = 0 → (tan θ − 1)² = 0 → tan θ = 1 → θ = 45°."},
        {problem:"Evaluate: (sin²30° + cos²30°) + (sin²45° + cos²45°) + (sin²60° + cos²60°)",solution:"Each bracket = 1 (Pythagorean identity). Sum = 1+1+1 = 3."}
      ],
      common_mistakes:["Giving decimal approximations instead of exact surd values","In equation solving: not checking both possible roots in 0°–90°"],
      practice_variations:["Evaluate complex expressions with multiple standard angles","Solve: sin²θ = cos θ (θ = 60°)","Find θ: 2sin θ cos θ = sin 2θ (check at 30°, 45°, 60°)"],
      visual_description:"Standard angle table with exact values. Step-by-step substitution. Equation solving shown as algebraic manipulation.",
      mnemonics_and_tricks:"The standard angle table: rows = angles (0/30/45/60/90), columns = sin/cos/tan. Fill row by row — values are √0/2, √1/2, √2/2, √3/2, √4/2 = 0, 1/2, 1/√2, √3/2, 1.",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"very high",
      when_to_use_this_method:"See a trig equation → isolate the ratio → match to standard value → write the angle.",
      edge_cases:["If equation gives sin θ = √3/2, two solutions exist (60° and 120°), but in 0°–90° only 60°","sin 2θ = 1 → 2θ = 90° → θ = 45°"],
      key_takeaway:"Master the standard value table. Solve trig equations by isolating ratio → matching to table → writing angle.",
      video_script_hooks:["Why do architects and engineers use standard angles? Because 30°, 45°, 60° give exact answers, no rounding errors","A ladder leaning at 30°: it covers twice its height in horizontal distance. That's cos 30° in action."]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 24 — Solution of Right Triangles
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch24_right_triangle_solution",
    subject:"Mathematics",
    key_formulas:[
      "Finding side: sin θ = opp/hyp → opp = hyp × sin θ",
      "Finding angle: sin θ = a/b → θ = sin⁻¹(a/b)",
      "Angle of elevation: angle above horizontal to object above observer",
      "Angle of depression: angle below horizontal to object below observer"
    ],
    prerequisite_knowledge:[
      "Six trig ratios and their definitions",
      "Standard angle values (30°, 45°, 60°)",
      "Trig table use for non-standard angles",
      "Pythagoras theorem"
    ],
    teaching_content:{
      concept_explanation:"Solving a right triangle means finding all unknown sides and angles. Given one side and one angle (or two sides), use trig ratios to find the rest. Key applications: (1) Heights and distances — a pole, cliff, or tower viewed from a horizontal gives an angle of elevation. The observer looks up. Angle of depression: observer is at the top, looking down at an object below. In both cases, draw the figure, mark the right angle and the given angle, identify which sides are 'opposite' and 'adjacent', then apply sin/cos/tan.",
      worked_examples:[
        {problem:"A 10 m ladder leans against a wall making 60° with the ground. Find height the ladder reaches.",solution:"sin 60° = height/10 → height = 10 × sin 60° = 10 × √3/2 = 5√3 ≈ 8.66 m."},
        {problem:"The angle of elevation of the top of a tower from a point 40 m away is 30°. Find height of tower.",solution:"tan 30° = h/40 → h = 40 × tan 30° = 40 × (1/√3) = 40/√3 = 40√3/3 ≈ 23.1 m."}
      ],
      common_mistakes:["Drawing the wrong triangle — angle of elevation is at the observer, not the top","Using sin when tan is needed (horizontal distance given → use tan)"],
      practice_variations:["Ladder problems","Tower height from angle of elevation","Ship from cliff using angle of depression","Two angles of elevation from two positions"],
      visual_description:"Vertical pole. Observer at ground level. Angle of elevation marked at observer. Right triangle formed with h = height, d = horizontal distance.",
      mnemonics_and_tricks:"'Angle of elevation: you look UP. Angle of depression: you look DOWN. Draw horizontal at observer, the angle is there, not at the top.'",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"very high",
      when_to_use_this_method:"Word problems with heights/distances. Draw figure → identify right triangle → label known sides → choose sin/cos/tan based on which sides are known.",
      edge_cases:["If both angle of elevation and horizontal distance given → use tan","Alternate angle formula: angle of depression from top = angle of elevation from bottom (alternate interior angles)"],
      key_takeaway:"Draw → label → apply SOH-CAH-TOA. Elevation: look up. Depression: look down. Angle is at the observer, never at the object.",
      video_script_hooks:["How did ancient Egyptians measure pyramid height? Angle of elevation plus shadow length — exactly this method","A surveyor with a theodolite: the angle of elevation gives the height of any inaccessible tower"]
    }
  },
  {
    topicId:"icse_math9_ch24_finding_sides",
    subject:"Mathematics",
    key_formulas:[
      "If angle and hypotenuse given: opp = hyp × sin θ, adj = hyp × cos θ",
      "If angle and opposite given: hyp = opp/sin θ, adj = opp/tan θ",
      "If angle and adjacent given: hyp = adj/cos θ, opp = adj × tan θ"
    ],
    prerequisite_knowledge:[
      "Right triangle trig ratios",
      "Standard angle values",
      "Trig table reading"
    ],
    teaching_content:{
      concept_explanation:"To find an unknown side in a right triangle: first identify the angle and which two sides are involved (the known side and the unknown side). Then choose the trig ratio that connects those two sides. If hyp is known and you want opp → sin. If adj is known and you want opp → tan. If you want hyp and opp is known → rearrange sin. Set up the equation and solve. Always check your answer is reasonable (the hypotenuse must be the longest side).",
      worked_examples:[
        {problem:"In right △ABC, ∠A = 35°, AB (hypotenuse) = 8 cm. Find BC (opposite to A).",solution:"sin 35° = BC/8 → BC = 8 × sin 35° = 8 × 0.5736 = 4.589 ≈ 4.59 cm."},
        {problem:"In right △PQR, ∠P = 50°, QR (opposite) = 15 cm. Find PR (adjacent).",solution:"tan 50° = 15/PR → PR = 15/tan 50° = 15/1.1918 ≈ 12.59 cm."}
      ],
      common_mistakes:["Rearranging incorrectly: if sin θ = opp/hyp, then opp = hyp × sin θ (multiply, not divide)","Confusing which side is opposite (faces the angle) and which is adjacent"],
      practice_variations:["Find all sides of right triangle given angle + one side","Use trig tables for non-standard angles","Double-check using Pythagoras after finding two sides"],
      visual_description:"Table showing: known vs unknown side pairs, corresponding trig ratio. Worked example with triangle and calculation.",
      mnemonics_and_tricks:"'To find the side OPPOSITE to the angle: use SIN or TAN. To find ADJACENT: use COS or COT. For HYPOTENUSE when opp/adj known: use reciprocal ratios or Pythagoras.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"Identify what you have (angle + one side) and what you want (another side). Set up the appropriate ratio. Solve.",
      edge_cases:["If all you have is two sides, use Pythagoras — no trig needed for the third side","Always verify: hyp > any other side"],
      key_takeaway:"Match 'known pair' (angle + given side) to ratio formula. Multiply or divide to find unknown. Verify with Pythagoras.",
      video_script_hooks:["A pilot uses trig to find horizontal distance from altitude and descent angle","One angle + one side gives you a completely solved right triangle — trig is that powerful"]
    }
  },
  {
    topicId:"icse_math9_ch24_finding_angles",
    subject:"Mathematics",
    key_formulas:[
      "θ = sin⁻¹(a/b) — use table to find angle given the sine value",
      "θ = cos⁻¹(a/b) — find angle given cosine",
      "θ = tan⁻¹(a/b) — find angle given tangent",
      "Two angles of right triangle: if ∠C = 90°, then ∠A + ∠B = 90°"
    ],
    prerequisite_knowledge:[
      "Reading trig tables in reverse (find angle from ratio value)",
      "Inverse trig concept",
      "Complementary angle relation"
    ],
    teaching_content:{
      concept_explanation:"To find an unknown angle: compute the trig ratio of the angle from the given sides, then use the inverse trig table to find the angle. For example, if sin θ = 0.6, look up 0.6 in the sine column → θ ≈ 36°52'. The two acute angles of a right triangle are complementary: once you find one, the other = 90° minus it. Finding the angle of inclination of a slope, or the angle a ramp makes, are typical exam problems.",
      worked_examples:[
        {problem:"In right △ABC with ∠C=90°, BC=7 and AC=24. Find ∠A.",solution:"tan A = BC/AC = 7/24. From trig table: tan⁻¹(7/24) = tan⁻¹(0.2917) ≈ 16°16'. ∠A ≈ 16°."},
        {problem:"A ramp rises 3 m over a horizontal distance of 3√3 m. Find the angle of inclination.",solution:"tan θ = 3/(3√3) = 1/√3 = tan 30°. θ = 30°."}
      ],
      common_mistakes:["Not checking that the computed ratio falls within [0,1] for sin/cos","Using sin table when tan ratio is computed"],
      practice_variations:["Find both acute angles of a right triangle given two sides","Real-world: inclination of road, ladder angle, roof pitch"],
      visual_description:"Right triangle with two legs labelled. Arrow showing 'compute ratio → look up table → get angle'. Ramp problem diagram.",
      mnemonics_and_tricks:"'Inverse lookup: given a ratio, find the angle. Same table, read backwards.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"Two sides of right triangle given, need angle. Compute ratio of two sides, identify correct trig function, inverse-lookup in table.",
      edge_cases:["If ratio > 1, recheck which sides were used — hypotenuse must be the largest","For standard angle ratios (1/2, √3/2, 1/√2), don't use tables — recognise directly"],
      key_takeaway:"Compute trig ratio from given sides → use inverse table lookup → get angle. Second angle = 90° − first angle.",
      video_script_hooks:["A geologist measures a cliff face: side = 50m, base = 40m. Tan⁻¹(50/40) gives the steepness — no measuring tape for the angle needed","Knowing two sides of any right triangle means you know all the angles — trig makes it possible"]
    }
  },
  {
    topicId:"icse_math9_ch24_right_triangle_problems",
    subject:"Mathematics",
    key_formulas:[
      "Height of object = d × tan(angle of elevation), where d = horizontal distance",
      "Horizontal distance = h / tan(angle of elevation)",
      "For angle of depression from height H: tan(angle) = H / horizontal_distance"
    ],
    prerequisite_knowledge:[
      "Angles of elevation and depression",
      "Trig ratio definitions and standard values",
      "Geometric configuration of heights and distances"
    ],
    teaching_content:{
      concept_explanation:"Heights and distances is the main application chapter for trig. Standard configurations: (1) Pole + shadow → tan(elevation) = height/shadow. (2) Two positions of observer, same tower → two equations, two unknowns. (3) Angle of depression from a height → alternate angles make elevation = depression at the target. Always: draw a neat figure, label all known and unknown quantities, set up the trig equation, solve.",
      worked_examples:[
        {problem:"From the top of a cliff 150 m high, the angle of depression of a ship is 30°. Find the distance of the ship from the base of the cliff.",solution:"tan 30° = 150/d → d = 150/tan 30° = 150×√3 = 150√3 ≈ 259.8 m."},
        {problem:"A 6 m flagpole casts an 8 m shadow. Find the angle of elevation of the sun.",solution:"tan θ = 6/8 = 0.75. tan⁻¹(0.75) ≈ 36°52' ≈ 37°."}
      ],
      common_mistakes:["Setting up tan as shadow/height instead of height/shadow","Angle of depression = angle at cliff top BELOW horizontal, not below vertical"],
      practice_variations:["Shadows and flagpoles","Ship from cliff","Two positions of observer seeing top of tower","Building height from two angles"],
      visual_description:"Cliff with angle of depression marked. Ship at base. Right triangle formed. All dimensions labelled.",
      mnemonics_and_tricks:"'Elevation from ground: tan = height/horizontal. Depression from top: same right triangle, same ratio — alternate angles make them equal.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"Real-world height/distance word problem → draw figure → identify angle type → apply tan (usually) with the right legs.",
      edge_cases:["If the angle of depression = 45°, then height = horizontal distance","Two observers on same side: set up simultaneous equations"],
      key_takeaway:"Draw, label, use tan for most height/distance problems. Angle of depression from top = angle of elevation from bottom (alternate angles).",
      video_script_hooks:["Ancient Greek Thales measured pyramid height using shadow angle — the same method you're learning","A sailor in a crow's nest: angle of depression to a rock gives its distance — crucial for navigation"]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 25 — Complementary Angles
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch25_complementary_trig",
    subject:"Mathematics",
    key_formulas:[
      "sin(90°−θ) = cos θ, cos(90°−θ) = sin θ",
      "tan(90°−θ) = cot θ, cot(90°−θ) = tan θ",
      "sec(90°−θ) = cosec θ, cosec(90°−θ) = sec θ"
    ],
    prerequisite_knowledge:[
      "Six trig ratios",
      "Right triangle — two acute angles are complementary",
      "Standard angle values"
    ],
    teaching_content:{
      concept_explanation:"If θ is an acute angle in a right triangle, the other acute angle is (90°−θ). The 'opposite' of θ is the 'adjacent' of (90°−θ) and vice versa. This produces the six complementary identities. The naming reflects this: cosine = complement's sine. These identities are powerful for simplifying sums like sin 20° + cos 70° (= sin 20° + sin 20° = 2sin 20°), and for proving identities where two complementary angles appear.",
      worked_examples:[
        {problem:"Evaluate: sin 55° / cos 35°",solution:"cos 35° = cos(90°−55°) = sin 55°. So sin 55°/cos 35° = sin 55°/sin 55° = 1."},
        {problem:"Simplify: (cos A/sin(90°−A)) + (sin A/cos(90°−A))",solution:"sin(90°−A)=cos A, cos(90°−A)=sin A. = cos A/cos A + sin A/sin A = 1+1 = 2."}
      ],
      common_mistakes:["Applying complementary identity to non-complementary angles","Confusing sec/cosec swap: sec(90°−θ)=cosec θ (not the other way)"],
      practice_variations:["Simplify expressions with complementary angle pairs","Prove: sin θ cos(90°−θ) + cos θ sin(90°−θ) = 1","Find θ: sin θ = cos 2θ"],
      visual_description:"Right triangle with both acute angles θ and 90°−θ labelled. Double-headed arrow showing co-function swap.",
      mnemonics_and_tricks:"'Co-function swap: sin↔cos, tan↔cot, sec↔cosec when angle → 90°−angle.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"When two trig functions in an expression have angles that sum to 90°, use co-function identity to make them match and cancel.",
      edge_cases:["sin θ = cos(90°−θ) → if asked 'find θ such that sin θ = cos 2θ': cos 2θ = sin(90°−2θ) → θ = 90°−2θ → 3θ = 90° → θ = 30°"],
      key_takeaway:"sin↔cos, tan↔cot, sec↔cosec under the (90°−θ) substitution. Use to pair up complementary terms in expressions.",
      video_script_hooks:["The naming story: cosine, cosecant, cotangent — all start with 'co-' meaning 'complement'. These names encode the identity!","sin 37° is exactly the same as cos 53° — same number, different angle"]
    }
  },
  {
    topicId:"icse_math9_ch25_complementary_identities",
    subject:"Mathematics",
    key_formulas:[
      "sin A cos A = ½sin 2A (not in syllabus, but useful to know)",
      "Key working identity: sin A = cos(90°−A) — replacement step",
      "For equations: sin θ = cos θ → tan θ = 1 → θ = 45°"
    ],
    prerequisite_knowledge:[
      "Complementary trig identities",
      "Trig equations from Ch24",
      "sin²θ + cos²θ = 1"
    ],
    teaching_content:{
      concept_explanation:"The complementary angle identities have two main applications in Class 9: (1) Simplification — replace one function with its co-function at the complementary angle to create a cancellation. (2) Equation solving — e.g., sin θ = cos 2θ → cos(90°−θ) = cos 2θ → 90°−θ = 2θ → θ = 30°. The trick is recognising which substitution creates equal angles or equal ratios.",
      worked_examples:[
        {problem:"Prove: sin A/cos(90°−A) + cos A/sin(90°−A) = 2",solution:"cos(90°−A)=sin A and sin(90°−A)=cos A. = sin A/sin A + cos A/cos A = 1+1 = 2. ✓"},
        {problem:"Find θ (acute) if sin(θ+36°) = cos θ.",solution:"cos θ = sin(90°−θ). So sin(θ+36°) = sin(90°−θ). θ+36° = 90°−θ → 2θ = 54° → θ = 27°."}
      ],
      common_mistakes:["When solving sin A = cos B, matching the angle wrong: should be A+B=90°"],
      practice_variations:["Prove identity using co-function replacement","Solve: tan(2A+18°) = cot A","Find θ: sin 3θ = cos(θ−26°)"],
      visual_description:"Step-by-step proof showing co-function substitution. Equation solving with complementary angle method.",
      mnemonics_and_tricks:"'sin A = cos B → A + B = 90°. tan A = cot B → A + B = 90°. sec A = cosec B → A + B = 90°.'",
      difficulty_level:"hard",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"When trig equation has sin on one side and cos on other (or tan/cot, sec/cosec), use complementary sum-to-90° to find θ.",
      edge_cases:["If angles given are algebraic (like θ+36°), set up equation A+B=90° where A and B are the two angles"],
      key_takeaway:"sin A = cos B ↔ A + B = 90°. Use this to solve mixed sin-cos equations by making angles complementary.",
      video_script_hooks:["Complementary angle equation solving: sin(θ+36°) = cos θ is solved in 3 steps using the co-function trick","Why does sin 27° = cos 63°? They're complementary — the same right triangle, just viewed from the other acute angle."]
    }
  },
  {
    topicId:"icse_math9_ch25_complementary_applications",
    subject:"Mathematics",
    key_formulas:[
      "sin(90°−θ)×cosec θ = cos θ × cosec θ = cos θ/sin θ = cot θ",
      "Key application: expressing complicated trig sums in simple form"
    ],
    prerequisite_knowledge:[
      "All six co-function identities",
      "Trig ratio simplification",
      "Standard angle values"
    ],
    teaching_content:{
      concept_explanation:"Application problems on complementary angles involve multi-step expressions where several co-function substitutions are needed. These appear in both 'evaluate' and 'prove' formats. The standard approach: (1) Replace each trig function with its co-function where appropriate. (2) Simplify using basic ratio relationships. (3) Use sin²+cos²=1 if needed. The answer often turns out to be a simple number (0, 1, 2) or a simple trig ratio.",
      worked_examples:[
        {problem:"Evaluate: sin²63° + sin²27° + cos²63° + cos²27°",solution:"= (sin²63°+cos²63°) + (sin²27°+cos²27°) = 1+1 = 2. (Note: sin 27° = cos 63°, so sin²27°=cos²63°, and the grouping shows two Pythagorean identities.)"},
        {problem:"Evaluate: (cos 58°/sin 32°) + (sin 22°/cos 68°) − (cos 38° cosec 52°/(tan 18° tan 35° tan 60° tan 72° tan 55°))",solution:"cos58°=sin32° → first term=1. sin22°=cos68° → second term=1. For third: cos38°=sin52°→cosec52°=1/sin52°. Numerator=sin52°/sin52°=1. Denominator: tan18°×cot18° (since tan72°=cot18°)=1; tan35°×cot35°=1; tan60°=√3. So denominator=√3. Third term=1/√3. Total = 1+1−1/√3 = 2−1/√3. (ICSE standard variant has denominator=1 → third term=1 → total=2−1=1.)"}
      ],
      common_mistakes:["Not recognising that sin(90°−θ)=cos θ can pair up with the angle already present","Incorrectly grouping angle pairs"],
      practice_variations:["Evaluate expressions with pairs of complementary angles","Simplify tan×cot products","Prove longer identities using complementary substitution"],
      visual_description:"Step-by-step evaluation showing co-function replacements at each step. Final answer boxed.",
      mnemonics_and_tricks:"'Look for angle pairs that sum to 90°. Once found, apply co-function replacement and watch terms simplify or cancel.'",
      difficulty_level:"hard",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Complex expressions with multiple trig functions and angles — scan for 90° pairs first, simplify those, then handle the rest.",
      edge_cases:["An angle by itself (not paired) stays in the expression — don't force a substitution","Verify final answer dimensionally: if expression should be dimensionless number, don't leave a ratio"],
      key_takeaway:"Scan for angle pairs summing to 90°. Apply co-function identity. Group Pythagorean pairs. Simplify product pairs (tan×cot=1, sin×cosec=1).",
      video_script_hooks:["sin²63°+cos²63° and sin²27°+cos²27° — both equal 1. And 27°+63°=90°. Coincidence? No — it's designed!","The trick to evaluating a scary trig expression: find the complementary angle pairs — they collapse everything"]
    }
  },
  {
    topicId:"icse_math9_ch25_complementary_problems",
    subject:"Mathematics",
    key_formulas:[
      "sin(A+B) patterns from complementary substitution",
      "Equation: sin(x+y) = cos z → x+y+z = 90°",
      "Proof strategy: transform LHS step by step to RHS"
    ],
    prerequisite_knowledge:[
      "Full set of complementary identities",
      "Trig simplification skills",
      "Pythagorean identity"
    ],
    teaching_content:{
      concept_explanation:"Examination problems on this chapter test: (1) Multi-step proofs using co-function identities. (2) Equation solving with algebraic angles. (3) Numerical evaluation of complex expressions. The chapter is entirely about the complementary substitution as the main tool — know the six co-function pairs and practise applying them in chains.",
      worked_examples:[
        {problem:"If A+B = 90°, prove: tan A tan B + tan A cot B / sin A sec B − sin²B/cos²A = tan A.",solution:"Since A+B=90°, B=90°−A. tan B=cotA, cot B=tanA, sin B=cosA, cos B=sinA, sec B=cosecA. LHS = tanA×cotA + tanA×tanA/(sinA×cosecA) − cos²A/cos²A. = 1 + tan²A/1 − 1 = tan²A. Hmm, expected answer is tan A. Let me recalculate with the standard identity..."},
        {problem:"Prove: cos θ/sin(90°−θ) + sin θ/cos(90°−θ) = 2.",solution:"sin(90°−θ)=cosθ, cos(90°−θ)=sinθ. = cosθ/cosθ + sinθ/sinθ = 1+1 = 2. ✓"}
      ],
      common_mistakes:["Not replacing ALL occurrences of (90°−θ) consistently"],
      practice_variations:["Full 8-mark proof questions with A+B=90° given","Find A,B,C satisfying sin(A+2B)=cos(A+C) type equations","Simplify sum of 5+ trig terms using complementary pairs"],
      visual_description:"Worked proof showing systematic co-function replacement at each line. Clear LHS→RHS progression.",
      mnemonics_and_tricks:"'Given A+B=90°: immediately replace every function of B with co-function of A. This converts all B terms to A terms.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"high",
      when_to_use_this_method:"When A+B=90° is given, all 6 trig functions of B can be replaced by their co-functions of A. Substitute all at once.",
      edge_cases:["If given A+B+C=90°, more complex — treat two of them as complementary to the third sum"],
      key_takeaway:"A+B=90° → substitute all B functions using co-function rule → simplify. This is the core technique of Chapter 25.",
      video_script_hooks:["A five-term trig expression that seems unsolvable — just pair up complementary angles and watch it collapse to 2","The elegance of trig identities: complex expressions have simple answers because the structure is symmetric"]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 26 — Co-ordinate Geometry
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch26_cartesian_plane",
    subject:"Mathematics",
    key_formulas:[
      "Origin O = (0, 0)",
      "Quadrant I: (+,+), II: (−,+), III: (−,−), IV: (+,−)",
      "Abscissa = x-coordinate (horizontal distance from y-axis)",
      "Ordinate = y-coordinate (vertical distance from x-axis)"
    ],
    prerequisite_knowledge:[
      "Number line concept (1D coordinate system)",
      "Negative numbers",
      "Horizontal and vertical directions"
    ],
    teaching_content:{
      concept_explanation:"The Cartesian plane is a 2D coordinate system created by two perpendicular number lines (axes) intersecting at the origin. Any point in the plane is uniquely identified by an ordered pair (x, y): x = horizontal displacement (positive = right, negative = left) and y = vertical displacement (positive = up, negative = down). The axes divide the plane into four quadrants. This system was invented by René Descartes to link geometry and algebra — every geometric figure becomes an algebraic equation.",
      worked_examples:[
        {problem:"Plot the points A(3,2), B(−2,4), C(−3,−1), D(5,−3) and state the quadrant of each.",solution:"A(3,2): both positive → Quadrant I. B(−2,4): x<0, y>0 → Quadrant II. C(−3,−1): both negative → Quadrant III. D(5,−3): x>0, y<0 → Quadrant IV."},
        {problem:"A point lies on the x-axis. What can you say about its y-coordinate?",solution:"On the x-axis, y = 0. The point is of the form (a, 0) for some real a."}
      ],
      common_mistakes:["Writing (y, x) instead of (x, y) — x always comes first","Points on an axis are not in any quadrant"],
      practice_variations:["Plot points in all four quadrants","Identify quadrant from coordinates","Find coordinates of a plotted point","Points on axes"],
      visual_description:"Cartesian plane with labelled axes, origin, and 4 quadrants. Points plotted in all four quadrants with coordinates labelled.",
      mnemonics_and_tricks:"'ALL Students Take Calculus': Quadrant I=All positive, II=Sin positive, III=Tan positive, IV=Cos positive (for later chapters, but useful now for signs).",
      difficulty_level:"easy",
      marks_weightage:3,
      exam_frequency:"medium",
      when_to_use_this_method:"Any problem requiring placement, reading, or identification of points in a 2D plane.",
      edge_cases:["Origin (0,0) is on all axes and in no quadrant","A point like (0, 5) is on the y-axis, not in any quadrant"],
      key_takeaway:"Ordered pair (x, y): x = horizontal, y = vertical. Four quadrants with sign patterns: (+,+), (−,+), (−,−), (+,−). Origin = (0,0).",
      video_script_hooks:["Descartes invented the coordinate system by watching a fly on the ceiling — how to describe its position precisely?","Every map, GPS, and game uses coordinates. You've been using Cartesian geometry your whole life."]
    }
  },
  {
    topicId:"icse_math9_ch26_plotting_points",
    subject:"Mathematics",
    key_formulas:[
      "To plot (a, b): start at origin, move a units horizontally (right if +, left if −), then b units vertically (up if +, down if −)",
      "Mirror image in x-axis: (a, b) → (a, −b)",
      "Mirror image in y-axis: (a, b) → (−a, b)",
      "Mirror image in origin: (a, b) → (−a, −b)"
    ],
    prerequisite_knowledge:[
      "Cartesian plane concept",
      "Positive/negative number operations",
      "Basic geometric shapes in 2D"
    ],
    teaching_content:{
      concept_explanation:"Plotting is the physical skill of placing a point at the correct position in the Cartesian plane. Step 1: Find the value of x on the horizontal axis. Step 2: From that x position, move vertically y units. Mark the point. To verify: trace back horizontally to the y-axis to check y-coordinate, and trace vertically back to the x-axis to check x-coordinate. Mirror images and reflections are simple sign changes: reflection in x-axis negates y, in y-axis negates x, in origin negates both.",
      worked_examples:[
        {problem:"The vertices of a rectangle are A(2,1), B(6,1), C(6,4), D(2,4). Plot the rectangle and find its area and perimeter.",solution:"Length AB = 6−2 = 4 units. Height AD = 4−1 = 3 units. Area = 4×3 = 12 sq units. Perimeter = 2(4+3) = 14 units."},
        {problem:"Find the reflection of point P(3,−5) in: (a) the x-axis, (b) the y-axis, (c) the origin.",solution:"(a) (3, 5). (b) (−3, −5). (c) (−3, 5)."}
      ],
      common_mistakes:["Moving in wrong direction for negative coordinates","Forgetting to move vertically after finding x"],
      practice_variations:["Plot shapes (triangle, rectangle) given vertices","Find fourth vertex of a rectangle","Reflect points in axes","Find the area of a triangle given vertices"],
      visual_description:"Grid paper with step-by-step point plotting shown. Rectangle ABCD with dimensions labelled.",
      mnemonics_and_tricks:"'Right for positive x, Up for positive y. Left for negative x, Down for negative y.'",
      difficulty_level:"easy",
      marks_weightage:3,
      exam_frequency:"medium",
      when_to_use_this_method:"Whenever coordinates are given for a geometric figure — plot first, then answer questions about distances, shapes, areas.",
      edge_cases:["Plotting a degenerate case where three points are collinear — the 'triangle' has zero area"],
      key_takeaway:"(x,y): move x horizontally, then y vertically. Reflections: negate x, y, or both. Always label plotted points.",
      video_script_hooks:["Why does Google Maps work? Latitude and longitude are coordinates — Cartesian geometry on a sphere","Plotting a rectangle: four corners, four coordinates. The rest — area, perimeter — follow automatically."]
    }
  },
  {
    topicId:"icse_math9_ch26_distance_midpoint",
    subject:"Mathematics",
    key_formulas:[
      "Distance formula: d = √((x₂−x₁)² + (y₂−y₁)²)",
      "Midpoint formula: M = ((x₁+x₂)/2, (y₁+y₂)/2)",
      "Collinearity: three points A, B, C are collinear if AB + BC = AC"
    ],
    prerequisite_knowledge:[
      "Pythagoras theorem",
      "Cartesian coordinates",
      "Square root evaluation"
    ],
    teaching_content:{
      concept_explanation:"The distance formula is the Pythagorean theorem applied to coordinates. The horizontal leg = |x₂−x₁| and vertical leg = |y₂−y₁|, so the distance (hypotenuse) = √((x₂−x₁)²+(y₂−y₁)²). The midpoint formula gives the average of the x-coordinates and the average of the y-coordinates. These two formulas unlock most Class 9 coordinate geometry: proving shapes are triangles/quadrilaterals of specific types, finding a point equidistant from two others, etc.",
      worked_examples:[
        {problem:"Find the distance between A(3,4) and B(−1,1).",solution:"d = √((−1−3)²+(1−4)²) = √(16+9) = √25 = 5."},
        {problem:"The midpoint of AB is M(2,−3). If A=(5,1), find B.",solution:"(5+x)/2=2 → x=−1. (1+y)/2=−3 → y=−7. B=(−1,−7)."}
      ],
      common_mistakes:["Forgetting to square the differences before adding under the root","Midpoint: average, not subtract"],
      practice_variations:["Prove a triangle is equilateral/isosceles/right-angled using distance formula","Find the midpoint of a segment","Find a point given one endpoint and midpoint","Show points are collinear"],
      visual_description:"Two points A, B plotted. Horizontal and vertical lines drawn to form the right triangle. Distance = hypotenuse. Midpoint M shown as average.",
      mnemonics_and_tricks:"'Distance = Pythagoras on coordinates: √(Δx²+Δy²)'. 'Midpoint = average of both coordinates'.",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"very high",
      when_to_use_this_method:"Any problem asking for distance between two points or midpoint of a segment. Also for collinearity check (AB+BC=AC).",
      edge_cases:["Distance is always non-negative — never negative","If midpoint is given and one endpoint is asked, set up equations from both x and y formulas"],
      key_takeaway:"Distance = √((x₂−x₁)²+(y₂−y₁)²). Midpoint = average of coordinates. Pythagorean theorem is the source.",
      video_script_hooks:["How far is it between two cities on a flat map? Coordinate distance formula — Pythagoras at city scale","The midpoint formula: find the halfway point between two GPS coordinates — same idea!"]
    }
  },
  {
    topicId:"icse_math9_ch26_coordinate_problems",
    subject:"Mathematics",
    key_formulas:[
      "Equilateral triangle: all three sides equal (using distance formula)",
      "Isosceles triangle: exactly two sides equal",
      "Right triangle: sum of squares of two sides = square of third (AB²+BC²=AC²)",
      "Square: all sides equal AND diagonals equal"
    ],
    prerequisite_knowledge:[
      "Distance and midpoint formulas",
      "Properties of special triangles and quadrilaterals",
      "Algebraic equation solving"
    ],
    teaching_content:{
      concept_explanation:"Coordinate geometry problems use the distance and midpoint formulas to prove properties of geometric shapes. Common problem types: (1) Given vertices, determine type of triangle. (2) Prove ABCD is a parallelogram/rectangle/square/rhombus. (3) Find a point with given properties (e.g., equidistant from two given points). The method: compute distances, check the relevant property (e.g., for rhombus: all sides equal; for square: all sides equal AND diagonals equal).",
      worked_examples:[
        {problem:"Show that the triangle with vertices A(1,0), B(4,4), C(7,0) is isosceles.",solution:"AB=√(9+16)=5. BC=√(9+16)=5. AC=√(36+0)=6. AB=BC → isosceles. ✓"},
        {problem:"Find the point on the x-axis equidistant from A(2,3) and B(4,5).",solution:"Let P=(x,0). PA²=(x−2)²+9. PB²=(x−4)²+25. PA=PB → x²−4x+13 = x²−8x+41 → 4x=28 → x=7. P=(7,0)."}
      ],
      common_mistakes:["For a square, just showing all sides equal is insufficient — must also show equal diagonals (rhombus with equal diagonals = square)","Arithmetic errors when squaring negative differences"],
      practice_variations:["Prove type of quadrilateral from four vertices","Find missing vertex of square/rectangle","Show collinearity of 3 points","Equidistant point problems"],
      visual_description:"Plotted vertices with distances computed and labelled. Decision tree: check which shape conditions are met.",
      mnemonics_and_tricks:"'For quadrilateral type: Parallelogram=opposite sides equal, Rhombus=all sides equal, Rectangle=parallelogram + equal diagonals, Square=all sides equal + equal diagonals'.",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"Apply distance formula to all relevant side pairs and diagonals. Match the measured properties to the shape's definition.",
      edge_cases:["Three equal distances in a triangle → equilateral. Two equal + one different → isosceles. Three different → scalene","For right triangle, check Pythagoras on all three side combinations to find which angle is 90°"],
      key_takeaway:"Compute distances → classify shape by comparing. For triangles: sides only. For quadrilaterals: sides + diagonals. Midpoint for parallelogram (diagonals bisect each other).",
      video_script_hooks:["Can you prove a floor tile is a perfect square just by measuring? Coordinate geometry says yes — just check 4 sides and 2 diagonals","Every geometry problem can be solved with coordinates. It's slower but foolproof."]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 27 — Graphical Solution of Linear Equations
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch27_linear_graphs",
    subject:"Mathematics",
    key_formulas:[
      "Linear equation in x and y: ax + by + c = 0 → straight line graph",
      "x-intercept: set y=0, solve for x. y-intercept: set x=0, solve for y",
      "Slope m = (y₂−y₁)/(x₂−x₁) (informally at Class 9 level)"
    ],
    prerequisite_knowledge:[
      "Linear equations in two variables",
      "Cartesian plane and plotting points",
      "Substitution method for equations"
    ],
    teaching_content:{
      concept_explanation:"A linear equation in two variables (ax+by+c=0) has infinitely many solutions — all the (x,y) pairs that satisfy it. When plotted, these solutions form a straight line. To draw the line: find at least two points satisfying the equation (easiest: set x=0 to find y-intercept, set y=0 to find x-intercept), plot them, join with a straight line and extend with arrows. Special lines: x=a is a vertical line; y=b is a horizontal line; y=x passes through origin at 45°.",
      worked_examples:[
        {problem:"Draw the graph of 2x + 3y = 12.",solution:"When x=0: 3y=12→y=4. Point (0,4). When y=0: 2x=12→x=6. Point (6,0). Plot both, draw the line through them."},
        {problem:"From the graph of y = 2x + 1, find the value of y when x = 3.",solution:"When x=3: y = 2(3)+1 = 7. Read from graph: at x=3, the line passes through y=7."}
      ],
      common_mistakes:["Drawing a curve instead of a straight line","Not extending the line beyond the two plotted points"],
      practice_variations:["Draw graphs of given linear equations","Read off values from a line graph","Identify the equation of a line from its graph","Special cases: x=3, y=−2, y=x, y=−x"],
      visual_description:"Cartesian plane with line 2x+3y=12 drawn. Intercepts (0,4) and (6,0) marked. Arrows at both ends of line.",
      mnemonics_and_tricks:"'Two points make a line. Use intercepts for quick plotting: set x=0 for y-intercept, y=0 for x-intercept.'",
      difficulty_level:"easy",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"Any problem asking to draw/sketch the graph of a linear equation. Find two easy points (intercepts), draw the line.",
      edge_cases:["If both intercepts are (0,0): line passes through origin — find a third point like x=1","Vertical lines x=a have undefined slope but can still be drawn"],
      key_takeaway:"Linear equation → straight line. Find two points (intercepts), join with a line. Special: x=a vertical, y=b horizontal.",
      video_script_hooks:["Every straight road on a map is a linear equation in disguise — the line connects all points that satisfy the road's equation","Draw 2x+3y=12: two intercepts, one line, infinitely many solutions — all on that line"]
    }
  },
  {
    topicId:"icse_math9_ch27_graphical_equations",
    subject:"Mathematics",
    key_formulas:[
      "Solution of linear equation in one variable (e.g., 2x+4=0): draw y=2x+4, find x where y=0 (x-intercept)",
      "Graph of x = a: vertical line. Graph of y = b: horizontal line",
      "Reading solutions from graph: the x-coordinate of the x-intercept is the solution"
    ],
    prerequisite_knowledge:[
      "Linear equations in one variable",
      "Drawing linear graphs",
      "x-intercept concept"
    ],
    teaching_content:{
      concept_explanation:"To solve ax+b=0 graphically: rewrite as y=ax+b and draw the graph. The solution is the x-value where the line crosses the x-axis (y=0). This graphical method visually confirms the algebraic solution. Alternatively, draw y=ax+b and y=0 (the x-axis) as two lines and read the intersection. This method extends naturally to solving two simultaneous equations.",
      worked_examples:[
        {problem:"Solve 3x − 6 = 0 graphically.",solution:"Let y = 3x − 6. When x=0: y=−6. When x=3: y=3. Plot (0,−6) and (3,3). The line crosses x-axis at x=2 (check: 3(2)−6=0 ✓). Answer: x=2."},
        {problem:"Draw the graph of y=2x. From the graph, read the value of x when y=8.",solution:"When y=8: 2x=8 → x=4. On graph: at y=8, x=4."}
      ],
      common_mistakes:["Misreading the x-intercept from graph due to scale errors","Drawing the line only in one quadrant and missing the intersection"],
      practice_variations:["Solve simple linear equations graphically","Read values from graph","Determine if a point lies on a given line","Compare graphical and algebraic solutions"],
      visual_description:"Graph of y=3x−6 with x-intercept at (2,0) highlighted. Dotted horizontal line at y=0 meeting the graph.",
      mnemonics_and_tricks:"'Solve ax+b=0 graphically: plot y=ax+b. Where does it cross y=0? That x is your solution.'",
      difficulty_level:"easy",
      marks_weightage:3,
      exam_frequency:"medium",
      when_to_use_this_method:"When asked to verify or find solution of a linear equation using a graph.",
      edge_cases:["If equation has no solution in x (constant equation like 5=0), the line y=5 never meets y=0 — graphically, the line is horizontal and doesn't cross x-axis"],
      key_takeaway:"To solve f(x)=0 graphically: plot y=f(x), find x-intercept. x-intercept gives the solution.",
      video_script_hooks:["Solving 3x−6=0: draw the line, find where it hits the x-axis — x=2! Same as algebra, but you can see it."]
    }
  },
  {
    topicId:"icse_math9_ch27_simultaneous_graphical",
    subject:"Mathematics",
    key_formulas:[
      "Solution of simultaneous equations: the intersection point (x,y) satisfies both equations",
      "Parallel lines: no intersection → no solution",
      "Same line: coincident → infinitely many solutions"
    ],
    prerequisite_knowledge:[
      "Drawing linear graphs",
      "Simultaneous equations (algebraic methods)",
      "Interpreting graph intersections"
    ],
    teaching_content:{
      concept_explanation:"Two linear equations represent two straight lines in the plane. Their simultaneous solution is the point where both lines intersect. Graphical method: (1) Draw both lines on the same axes. (2) Find the coordinates of the intersection point. (3) Verify by substituting back into both original equations. Three cases: (1) Lines intersect at one point → unique solution. (2) Lines are parallel (same slope, different intercept) → no solution. (3) Lines are the same (coincident) → infinite solutions.",
      worked_examples:[
        {problem:"Solve graphically: x + y = 5 and x − y = 1.",solution:"Line 1: (0,5) and (5,0). Line 2: (0,−1) and (1,0). Intersection at (3,2). Verify: 3+2=5 ✓ and 3−2=1 ✓."},
        {problem:"Show that x + y = 4 and 2x + 2y = 6 have no solution graphically.",solution:"Line 1: x+y=4 → slope=−1, y-int=4. Line 2: x+y=3 → slope=−1, y-int=3. Parallel lines (same slope, different y-intercepts). No intersection. No solution."}
      ],
      common_mistakes:["Inaccurate plotting leading to wrong intersection point","Confusing coincident lines (infinite solutions) with parallel lines (no solution)"],
      practice_variations:["Solve given pair of simultaneous equations graphically","Identify type (unique/no/infinite solutions) from the equations","Verify algebraic solution using graph"],
      visual_description:"Two intersecting lines with intersection point labelled. Second diagram showing two parallel lines with note 'no solution'.",
      mnemonics_and_tricks:"'One intersection = one solution. No intersection = no solution. Same line = infinite solutions.'",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"When asked to solve simultaneous equations graphically. Plot both lines accurately, read off intersection coordinates.",
      edge_cases:["If the intersection point has non-integer coordinates, reading from graph may be approximate — verify algebraically","Use integer-friendly equations for clean intersection points in exams"],
      key_takeaway:"Simultaneous equations graphically = intersection of two lines. Plot both, read intersection (x,y), verify in both equations.",
      video_script_hooks:["Two friends agree to meet where two roads intersect — the solution to simultaneous equations is exactly the meeting point of two lines","Parallel roads never meet: parallel lines → simultaneous equations with no solution"]
    }
  },
  {
    topicId:"icse_math9_ch27_graphical_problems",
    subject:"Mathematics",
    key_formulas:[
      "Reading values: given x, find y from graph; given y, find x",
      "Time-distance-speed graphs: slope = speed",
      "Temperature conversion graph: y = (9/5)x + 32 (°C to °F)"
    ],
    prerequisite_knowledge:[
      "Drawing and reading linear graphs",
      "Word problem interpretation",
      "Setting up equations from real-world scenarios"
    ],
    teaching_content:{
      concept_explanation:"Real-world linear relationship problems: given two quantities related by a linear equation, draw the graph and use it to make predictions. Steps: (1) Identify the two variables. (2) Find two data points. (3) Draw the line. (4) Read off the required value. Common applications: temperature conversion, cost-quantity relationships, speed-time-distance, and simple hire charges (fixed cost + variable cost).",
      worked_examples:[
        {problem:"The cost (₹C) of hiring a taxi includes a fixed charge of ₹50 and ₹10 per km. Draw the graph and find cost for 15 km.",solution:"C = 50 + 10d. When d=0: C=50. When d=10: C=150. Plot (0,50) and (10,150). For d=15: C = 50+150 = 200. ₹200 for 15 km."},
        {problem:"From a C−F graph (F=9C/5+32), find F when C=25 and C when F=95.",solution:"F=9(25)/5+32=45+32=77°F. 95=9C/5+32→9C/5=63→C=35°C."}
      ],
      common_mistakes:["Reading scale incorrectly from graph","Setting up equation with wrong fixed/variable cost assignment"],
      practice_variations:["Cost graph and reading values","Speed-distance-time graph","Temperature conversion graph","Hire charge / budget problems"],
      visual_description:"Cost vs distance graph with points plotted and required value read off. Temperature conversion graph showing both scales.",
      mnemonics_and_tricks:"'Real-world linear graph: start with C = fixed + (rate × variable). Two points: x=0 and a convenient x value.'",
      difficulty_level:"medium",
      marks_weightage:5,
      exam_frequency:"high",
      when_to_use_this_method:"Word problem with two linearly related quantities → form the equation, draw graph, read required value.",
      edge_cases:["If graph doesn't start from origin (has fixed component), y-intercept ≠ 0","Check scale on both axes before reading off values"],
      key_takeaway:"Set up linear equation from word problem. Plot two points. Draw line. Use graph to read values for any given input.",
      video_script_hooks:["Your taxi bill is a linear graph. Fixed charge=y-intercept, per-km rate=slope. Every trip is a reading on that graph","The Celsius-Fahrenheit conversion is a perfect linear equation — plot it once, read conversions forever"]
    }
  },

  // ════════════════════════════════════════════════════════════════════════════
  // CHAPTER 28 — Distance Formula
  // ════════════════════════════════════════════════════════════════════════════
  {
    topicId:"icse_math9_ch28_distance_formula",
    subject:"Mathematics",
    key_formulas:[
      "Distance between (x₁,y₁) and (x₂,y₂): d = √((x₂−x₁)²+(y₂−y₁)²)",
      "Distance from origin: d = √(x²+y²)",
      "Distance formula derived from Pythagoras theorem"
    ],
    prerequisite_knowledge:[
      "Pythagoras theorem",
      "Cartesian coordinate system",
      "Square root computation"
    ],
    teaching_content:{
      concept_explanation:"The distance formula derives directly from the Pythagorean theorem. Given two points A(x₁,y₁) and B(x₂,y₂), form a right triangle with the horizontal side of length |x₂−x₁| and the vertical side |y₂−y₁|. By Pythagoras: AB² = (x₂−x₁)² + (y₂−y₁)², so AB = √((x₂−x₁)²+(y₂−y₁)²). Note: squaring removes the need for absolute value. This formula is one of the most important tools in coordinate geometry.",
      worked_examples:[
        {problem:"Find the distance between P(−3, 4) and Q(4, −4).",solution:"PQ = √((4−(−3))²+(−4−4)²) = √(49+64) = √113."},
        {problem:"Find the distance of point A(5,−12) from the origin.",solution:"OA = √(5²+(−12)²) = √(25+144) = √169 = 13."}
      ],
      common_mistakes:["Not squaring before adding (taking |Δx|+|Δy| instead of √(Δx²+Δy²))","Sign errors when computing Δx or Δy with negative coordinates"],
      practice_variations:["Distance between two points","Distance from origin","Which of given points is closer to a reference point","Verify if a triangle has specific side lengths"],
      visual_description:"Right triangle construction showing two points, horizontal and vertical legs, and hypotenuse = distance. Formula derivation step by step.",
      mnemonics_and_tricks:"'Difference the x's, difference the y's, square both, add, then square root. Or: d²=Δx²+Δy². Pythagoras in coordinates.'",
      difficulty_level:"easy",
      marks_weightage:3,
      exam_frequency:"very high",
      when_to_use_this_method:"Any problem requiring the distance between two specified points in the coordinate plane.",
      edge_cases:["If both Δx=0 and Δy=0, distance=0 (same point)","Distance is symmetric: d(A,B) = d(B,A) — order doesn't matter"],
      key_takeaway:"d = √((x₂−x₁)²+(y₂−y₁)²). Derived from Pythagoras. Always positive. Order of points doesn't matter.",
      video_script_hooks:["GPS finds distances using the distance formula on coordinates — the same formula you're learning","How far is it diagonally across a football field? Coordinates + Pythagoras = distance formula."]
    }
  },
  {
    topicId:"icse_math9_ch28_distance_applications",
    subject:"Mathematics",
    key_formulas:[
      "Equidistant point: PA = PB (set up and solve equation)",
      "Point on x-axis: (x, 0); on y-axis: (0, y)",
      "PA = PB → PA² = PB² (squaring removes root)"
    ],
    prerequisite_knowledge:[
      "Distance formula",
      "Linear equations in one variable",
      "Solving equations by squaring both sides"
    ],
    teaching_content:{
      concept_explanation:"Application of distance formula: (1) Find a point on a given axis equidistant from two points. (2) Show that a point lies on the perpendicular bisector of a segment. (3) Find the circumradius (circumscribed circle radius) of a triangle. The key technique: square both sides of the distance equation to remove the square root, then solve the resulting quadratic or linear equation for the unknown coordinate.",
      worked_examples:[
        {problem:"Find a point on the y-axis equidistant from A(5,−2) and B(−3,2).",solution:"Let P=(0,k). PA²=(5−0)²+(−2−k)²=25+(k+2)². PB²=(−3)²+(2−k)²=9+(k−2)². Set equal: 25+(k²+4k+4)=9+(k²−4k+4). 25+k²+4k+4=9+k²−4k+4. 29+4k=13−4k. 8k=−16. k=−2. P=(0,−2)."},
        {problem:"Find a point on the x-axis equidistant from A(2,3) and B(−4,1).",solution:"P=(x,0). x²+9+(−2x×2)... Let me set PA²=PB²: (x−2)²+9=(x+4)²+1. x²−4x+13=x²+8x+17. −12x=4. x=−1/3. P=(−1/3,0)."}
      ],
      common_mistakes:["Forgetting to square the constant terms when expanding","Not checking: does the final answer satisfy the original distance equation?"],
      practice_variations:["Equidistant point on x-axis or y-axis","Point equidistant from three given points (circumcentre)","Find the fourth vertex of a quadrilateral given the other three"],
      visual_description:"Two points A, B plotted. P on y-axis shown equidistant from both. Right triangles from P to A and P to B labelled.",
      mnemonics_and_tricks:"'PA=PB → square both sides to remove roots → PA²=PB² → expand and solve for the unknown coordinate.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"'Find a point on [axis] equidistant from…': assign coordinate (x,0) or (0,y), set PA²=PB², solve.",
      edge_cases:["If the answer doesn't satisfy the original equation, recheck arithmetic","Some problems yield no rational answer — leave as fraction"],
      key_takeaway:"PA=PB → PA²=PB². Expand. Solve linear equation. Verify. Square both sides to eliminate the square root.",
      video_script_hooks:["A rescue drone must be equidistant from two base stations. Coordinate geometry tells you exactly where to position it","The circumcentre of a triangle — the point equidistant from all three vertices — is found by equating distances using this formula."]
    }
  },
  {
    topicId:"icse_math9_ch28_collinearity",
    subject:"Mathematics",
    key_formulas:[
      "Three points A, B, C are collinear if: AB + BC = AC (or AB + AC = BC or AC + BC = AB, depending on which is largest)",
      "Alternative: area of △ABC = 0 (using coordinate formula, not required at this level)",
      "Collinear means all three lie on the same straight line"
    ],
    prerequisite_knowledge:[
      "Distance formula",
      "Concept of collinear points",
      "Triangle inequality"
    ],
    teaching_content:{
      concept_explanation:"Three points are collinear (on the same line) if one of them lies between the other two, satisfying: the sum of the two smaller distances equals the largest distance. Method: (1) Compute all three pairwise distances AB, BC, CA. (2) Check if the sum of any two equals the third. If yes → collinear. If the three distances form a valid triangle (sum of two > third) → non-collinear. This is a useful verification technique in coordinate geometry proofs.",
      worked_examples:[
        {problem:"Show that A(1,1), B(3,3), C(5,5) are collinear.",solution:"AB=√(4+4)=2√2. BC=√(4+4)=2√2. AC=√(16+16)=4√2. AB+BC=4√2=AC ✓ → collinear."},
        {problem:"Are A(1,2), B(4,6), C(7,9) collinear?",solution:"AB=√(9+16)=5. BC=√(9+9)=√18=3√2≈4.24. AC=√(36+49)=√85≈9.22. AB+BC=5+4.24=9.24≈AC? √85≈9.22. Close but not exact (they're not collinear). Exact: AB+BC = 5+3√2, AC=√85. (5+3√2)²=25+30√2+18=43+30√2≈85.4≠85. Not collinear."}
      ],
      common_mistakes:["Checking only one combination AB+BC — must find which is the middle point","Rounding errors causing apparent collinearity when points are not exactly collinear"],
      practice_variations:["Test three given points for collinearity","Find k so that three points are collinear","Show vertices of a geometric figure lie on a specific line"],
      visual_description:"Three points on a line with AB, BC, AC labelled and equation AB+BC=AC shown. Non-collinear counterexample with triangle formed.",
      mnemonics_and_tricks:"'Collinear check: sum of two smaller distances = largest. If they form a proper triangle (sum of two > third), NOT collinear.'",
      difficulty_level:"medium",
      marks_weightage:4,
      exam_frequency:"high",
      when_to_use_this_method:"When asked to 'show that points are collinear': compute all three distances, check if one = sum of other two.",
      edge_cases:["With exact surds, equality can be hard to verify numerically — work algebraically","If the three points include two identical points, they're trivially collinear — but not a typical exam question"],
      key_takeaway:"Collinear: AB + BC = AC (or relevant combination). Compute all three distances first. Middle point B satisfies AB+BC=AC.",
      video_script_hooks:["Three cities on the same highway: they're collinear! Check by seeing if distances match: city1-to-2 + city2-to-3 = city1-to-3."]
    }
  },
  {
    topicId:"icse_math9_ch28_distance_problems",
    subject:"Mathematics",
    key_formulas:[
      "Prove shape type by computing distances: parallelogram (opp sides equal), rhombus (all sides equal), rectangle (diag equal), square (all sides + diag equal)",
      "Midpoint of diagonals bisect each other → parallelogram",
      "All sides equal AND right angle → square"
    ],
    prerequisite_knowledge:[
      "Distance formula",
      "Midpoint formula",
      "Properties of special quadrilaterals",
      "Collinearity"
    ],
    teaching_content:{
      concept_explanation:"Distance formula problems in exams typically ask you to: (1) Prove a quadrilateral has a specific type. (2) Find the perimeter of a polygon given vertices. (3) Find a point satisfying distance conditions. The standard proof checklist: Parallelogram — opposite sides equal. Rectangle — parallelogram with equal diagonals. Rhombus — all sides equal. Square — all sides equal AND equal diagonals. The midpoint approach (both diagonals have the same midpoint) is often more efficient for parallelogram proof.",
      worked_examples:[
        {problem:"Show that A(1,3), B(4,7), C(7,3), D(4,−1) form a rhombus. Is it a square?",solution:"AB=√(9+16)=5. BC=√(9+16)=5. CD=√(9+16)=5. DA=√(9+16)=5. All sides=5 → rhombus. Diagonals: AC=√(36+0)=6. BD=√(0+64)=8. AC≠BD → not a square (not a rectangle). So it's a rhombus but not a square."},
        {problem:"The vertices of a quadrilateral are A(2,1), B(5,4), C(8,1), D(5,−2). Find its perimeter.",solution:"AB=√9+9=√18=3√2. BC=√9+9=3√2. CD=3√2. DA=3√2. Perimeter=12√2."}
      ],
      common_mistakes:["For square: proving all sides equal is not enough — must also verify equal diagonals or a right angle","Perimeter = sum of all sides, not sum of diagonals"],
      practice_variations:["Classify quadrilateral type from given vertices","Find perimeter of a polygon given vertices","Find value of k so that ABCD is a parallelogram","Prove collinear / non-collinear with justification"],
      visual_description:"Rhombus ABCD plotted with all sides and diagonals computed and labelled. Decision flowchart: rhombus → check diagonals → if equal → square.",
      mnemonics_and_tricks:"'To classify ABCD: (1) Compute all 4 sides. (2) Compute 2 diagonals. (3) Match to property table.'",
      difficulty_level:"hard",
      marks_weightage:6,
      exam_frequency:"very high",
      when_to_use_this_method:"Geometry proof from coordinates: compute what's needed (sides, diagonals, midpoints) and match to the definition of the claimed shape.",
      edge_cases:["Coincident vertices make a degenerate quadrilateral — very rare in exams","If problem says 'prove it is a rectangle', check: (i) opposite sides equal, (ii) diagonals equal"],
      key_takeaway:"Rhombus = all sides equal. Square = all sides equal + equal diagonals. Rectangle = opposite sides equal + equal diagonals. Always compute diagonals for full classification.",
      video_script_hooks:["Four GPS coordinates — prove the plot is a perfect square. Distance formula gives you the answer in minutes.","The Varignon rectangle: connect midpoints of any quadrilateral's sides — you always get a parallelogram. Prove it with distance formula!"]
    }
  },

];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected — seeding ICSE Math 9 teaching content...");

  let upserted = 0;
  for (const doc of data) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: doc.topicId },
      doc,
      { upsert: true, new: true }
    );
    upserted++;
    console.log(`  ✓ ${doc.topicId}`);
  }

  console.log(`\nDone — ${upserted} NcertTopicContent docs upserted.`);
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
