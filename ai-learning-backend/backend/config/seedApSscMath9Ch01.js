/**
 * AP SSC Class 9 Mathematics — Chapter 1: Number Systems
 * 4 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 * Cannot clone from cbse_math9_* (which uses Ganita Manjari 2026).
 *
 * Usage: node config/seedApSscMath9Ch01.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     1-A  Irrational Numbers
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch1_irrational_numbers",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Irrational Numbers",
    prerequisite_knowledge: [
      "Natural numbers, whole numbers, integers and rational numbers",
      "Expressing fractions as decimals using long division",
      "Concept of prime numbers and basic divisibility",
      "Squares and square roots of perfect squares (1, 4, 9, 16, 25 …)"
    ],
    key_formulas: [
      "A real number r is irrational ⟺ it cannot be expressed as p/q where p, q ∈ ℤ, q ≠ 0",
      "If p is a prime and p | a², then p | a  (fundamental lemma used in proofs)",
      "√p is irrational for every prime p (2, 3, 5, 7, 11, …)",
      "Non-terminating, non-recurring decimal ⟺ irrational number"
    ],
    teaching_content: {
      intuition: "Every fraction sits somewhere on the number line — 1/2 is halfway between 0 and 1, 1/3 is a third of the way, and so on. The ancient Greeks believed fractions covered every point on the number line. Then a student (legend says it was Hippasus) proved that √2 — the length of the diagonal of a unit square — cannot be any fraction at all. This shattered their world. Numbers that cannot be fractions are called irrational, and they are just as real as any fraction; they just refuse to be tamed by p/q.",
      derivation: "Proof that √2 is irrational (by contradiction).\n\nAssume √2 = p/q where p, q are integers, q ≠ 0, and the fraction is in its lowest terms (i.e., gcd(p,q) = 1).\n\nSquare both sides: 2 = p²/q²  ⟹  p² = 2q².\n\nSince p² = 2q², p² is even. An integer squared is even only if the integer itself is even (since odd² = odd). So p is even. Write p = 2k for some integer k.\n\nSubstitute: (2k)² = 2q²  ⟹  4k² = 2q²  ⟹  q² = 2k².\n\nBy the same reasoning q² is even, so q is even.\n\nBut now both p and q are even, meaning 2 divides both — contradicting gcd(p,q) = 1.\n\nThe assumption is false. Therefore √2 is irrational. □\n\nThe same structure works for √3, √5, √7, and every √prime.",
      worked_example: "Prove that √3 is irrational.\n\nAssume √3 = p/q in lowest terms (gcd(p,q) = 1).\n\nSquaring: 3 = p²/q²  ⟹  p² = 3q².\n\nSo 3 | p².  By the prime-divisibility lemma (if prime p | a², then p | a), 3 | p.\n\nWrite p = 3m. Then (3m)² = 3q²  ⟹  9m² = 3q²  ⟹  q² = 3m².\n\nSo 3 | q² ⟹ 3 | q.\n\nNow 3 | p and 3 | q ⟹ gcd(p,q) ≥ 3.  Contradiction with gcd(p,q) = 1.\n\nTherefore √3 is irrational. □",
      visual_description: "Draw a horizontal number line. Mark 0 and 1. Now draw a unit square (side = 1) with its base on the segment from 0 to 1. The diagonal of this square has length √2 by Pythagoras. Open a compass to the diagonal length and mark that point on the number line — it lands between 1 and 2 (specifically between 1.4 and 1.5) but never exactly on any fraction marked with a denominator you can write down.",
      svg_diagrams: [
        {
          title: "Unit square diagonal giving √2 on the number line",
          svg_code: "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='120' x2='300' y2='120' stroke='#333' stroke-width='2'/><polygon points='20,120 100,120 100,40 20,40' fill='none' stroke='#2196F3' stroke-width='2'/><line x1='20' y1='120' x2='100' y2='40' stroke='#E91E63' stroke-width='2' stroke-dasharray='5,3'/><text x='55' y='136' font-size='12' fill='#333'>1</text><text x='56' y='80' font-size='12' fill='#E91E63'>√2</text><circle cx='20' cy='120' r='3' fill='#333'/><circle cx='100' cy='120' r='3' fill='#333'/><circle cx='180' cy='120' r='3' fill='#E91E63'/><text x='14' y='136' font-size='11'>0</text><text x='96' y='136' font-size='11'>1</text><text x='172' y='136' font-size='11'>√2</text><text x='160' y='136' font-size='9' dy='10'>(≈1.414)</text><line x1='140' y1='120' x2='160' y2='120' stroke='#999' stroke-width='1'/><text x='135' y='136' font-size='10' fill='#555'>1.4</text></svg>"
        }
      ],
      common_misconceptions: [
        "√4 = 2 is rational — not every square root is irrational. Only square roots of non-perfect-square integers are irrational.",
        "22/7 is sometimes called π — but 22/7 is a rational approximation. π itself is irrational.",
        "Students think irrational × rational is always irrational. FALSE: 0 × √2 = 0, which is rational. The exception is multiplication by zero.",
        "Assuming √(a+b) = √a + √b — this is wrong. √(4+9) = √13 ≠ 2+3 = 5."
      ],
      shortcuts_and_tricks: [
        "Memorise: √2 ≈ 1.414, √3 ≈ 1.732, √5 ≈ 2.236, √7 ≈ 2.646. These come up in every exam.",
        "Quick test: is √n irrational? Check if n is a perfect square (1, 4, 9, 16, 25…). If yes → rational. If no → irrational.",
        "For exam proofs: the pattern is always the same — assume p/q in lowest terms, square it, show the prime divides both p and q, declare contradiction. One template, many primes.",
        "Sum of a rational and an irrational is always irrational — e.g., 3 + √2 is irrational. This is itself provable by contradiction."
      ],
      when_to_use_this_method: "Use the contradiction proof whenever a question asks 'Prove that √p is irrational' or 'Show that a + b√p is irrational'. Use the decimal-based definition when asked to classify numbers as rational or irrational.",
      edge_cases: [
        "√0 = 0 — rational. √1 = 1 — rational. So not every square root is irrational.",
        "Sum of two irrationals can be rational: (2 + √3) + (2 − √3) = 4.",
        "Product of two irrationals can be rational: √3 × √3 = 3.",
        "Is 0.101001000100001… irrational? Yes — it is non-terminating and non-recurring even though it has a visible pattern."
      ],
      key_takeaway: "An irrational number cannot be written as p/q. Prove irrationality by contradiction: assume p/q in lowest terms, show p and q must share a common prime factor — contradiction. The decimal expansion of an irrational is non-terminating and non-recurring.",
      video_script_hooks: [
        "Opening: 'Can you write the length of this square's diagonal as a fraction? The Greeks thought yes. Hippasus proved no — and was reportedly thrown into the sea for it. Today you'll do that proof yourself.'",
        "Mid-lesson: 'Here is the secret: assume it IS a fraction in lowest terms. Square it. Follow the logic. Watch the assumption collapse under its own weight.'",
        "Closing: 'The number line looks continuous but it's packed with two different kinds of numbers — rational and irrational. Together they fill it perfectly. Separately, each leaves infinitely many gaps.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     1-B  Decimal Expansions of Real Numbers
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch1_decimal_expansions",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Real Numbers and Their Decimal Expansions",
    prerequisite_knowledge: [
      "Long division algorithm",
      "Meaning of a recurring decimal (e.g., 0.333… = 1/3)",
      "Prime factorization of integers",
      "Definition of rational and irrational numbers"
    ],
    key_formulas: [
      "p/q terminates ⟺ q (in lowest terms) has only 2s and 5s as prime factors",
      "p/q is non-terminating recurring ⟺ q has a prime factor other than 2 or 5",
      "Irrational ⟺ decimal is non-terminating AND non-recurring",
      "Converting recurring decimal to fraction: if x = 0.\\overline{ab}, then 100x − x = ab, so x = ab/99"
    ],
    teaching_content: {
      intuition: "Divide any fraction p/q by long division. At each step the remainder can only take values 0, 1, 2, …, q−1. So after at most q steps a remainder must repeat — and once a remainder repeats the decimal repeats. That is why every rational number either terminates or recurs. Irrational numbers have no such repeat — their remainders never cycle because they are not fractions to begin with.",
      derivation: "Why does p/q terminate ⟺ q's only prime factors are 2 and 5?\n\nA terminating decimal is one that can be written as k/10ⁿ for some integers k and n. The denominator 10ⁿ = 2ⁿ × 5ⁿ. So any fraction with a denominator whose only prime factors are 2 and 5 can be scaled to have denominator 10ⁿ by multiplying top and bottom by the right power of 2 or 5.\n\nExample: 7/8 = 7/2³ — multiply by 5³/5³ = 125/125 → 875/1000 = 0.875. Terminates!\n\nIf q has any other prime factor p (like 3, 7, 11…), no power of 10 will ever be divisible by p, so the decimal can never terminate.",
      worked_example: "Classify without long division:\n(i) 13/125 — 125 = 5³. Only 5s in denominator. Terminates.\n    13/125 × (2³/2³) = 104/1000 = 0.104 ✓\n\n(ii) 17/6 — 6 = 2 × 3. Has factor 3. Non-terminating, recurring.\n    17 ÷ 6 = 2.8333… = 2.8\\overline{3}\n\n(iii) √5 — irrational. Decimal = 2.2360679… non-terminating, non-recurring.\n\n(iv) Convert 0.\\overline{36} to fraction:\n    Let x = 0.363636…\n    100x = 36.363636…\n    99x = 36\n    x = 36/99 = 4/11.",
      visual_description: "Draw a three-branch tree: at the top 'Real Numbers'. Left branch: 'Rational' → two sub-branches: 'Terminating decimal' (e.g., 3/4 = 0.75) and 'Non-terminating recurring' (e.g., 1/3 = 0.333…). Right branch: 'Irrational' → 'Non-terminating, non-recurring' (e.g., √2 = 1.41421356…).",
      svg_diagrams: [
        {
          title: "Classification tree: Real → Rational / Irrational → decimal types",
          svg_code: "<svg viewBox='0 0 360 200' xmlns='http://www.w3.org/2000/svg'><rect x='130' y='5' width='100' height='28' rx='6' fill='#1565C0'/><text x='180' y='24' text-anchor='middle' font-size='12' fill='white' font-weight='bold'>Real Numbers</text><line x1='180' y1='33' x2='80' y2='65' stroke='#555' stroke-width='1.5'/><line x1='180' y1='33' x2='280' y2='65' stroke='#555' stroke-width='1.5'/><rect x='20' y='65' width='120' height='28' rx='6' fill='#2E7D32'/><text x='80' y='84' text-anchor='middle' font-size='12' fill='white'>Rational (p/q)</text><rect x='220' y='65' width='120' height='28' rx='6' fill='#C62828'/><text x='280' y='84' text-anchor='middle' font-size='12' fill='white'>Irrational</text><line x1='60' y1='93' x2='40' y2='130' stroke='#555' stroke-width='1.2'/><line x1='100' y1='93' x2='120' y2='130' stroke='#555' stroke-width='1.2'/><rect x='5' y='130' width='80' height='36' rx='5' fill='#81C784'/><text x='45' y='145' text-anchor='middle' font-size='10' fill='#1B5E20'>Terminating</text><text x='45' y='158' text-anchor='middle' font-size='9' fill='#1B5E20'>3/4 = 0.75</text><rect x='95' y='130' width='80' height='36' rx='5' fill='#81C784'/><text x='135' y='145' text-anchor='middle' font-size='10' fill='#1B5E20'>Non-term.</text><text x='135' y='158' text-anchor='middle' font-size='9' fill='#1B5E20'>recur: 1/3=0.3̄</text><rect x='225' y='130' width='115' height='36' rx='5' fill='#EF9A9A'/><text x='283' y='145' text-anchor='middle' font-size='10' fill='#B71C1C'>Non-term.</text><text x='283' y='158' text-anchor='middle' font-size='9' fill='#B71C1C'>non-recur: √2</text></svg>"
        }
      ],
      common_misconceptions: [
        "Students assume 1/7 terminates because 7 looks small. But 7 is prime and not 2 or 5, so 1/7 = 0.142857142857… (recurring, period 6).",
        "Thinking that more decimal places means more accuracy for irrationals — irrationals need infinitely many non-repeating digits; any finite decimal is only an approximation.",
        "Confusing 'non-terminating' with 'irrational' — 1/3 = 0.333… is non-terminating but rational (it recurs)."
      ],
      shortcuts_and_tricks: [
        "Prime-factor test: write q in lowest terms, prime-factorise it. Only 2s and 5s → terminates. Any other prime → recurring.",
        "Period of 1/n (where n has no factors of 2 or 5) equals the smallest k such that 10ᵏ ≡ 1 (mod n). For n=7, k=6 → period 6.",
        "Converting recurring decimal: for x = 0.\\overline{d₁d₂…dₙ} (n digits in bar), multiply by 10ⁿ, subtract x, divide. Always gives an integer fraction.",
        "Checking: after converting recurring decimal to fraction, simplify and prime-factorise denominator to verify it has a non-2/5 factor."
      ],
      when_to_use_this_method: "Use the denominator prime-factor test whenever asked to classify fractions as terminating or recurring — no long division needed. Use the 10ⁿ subtraction method to convert any recurring decimal back to a fraction.",
      edge_cases: [
        "0.9999… = 1 exactly (not approximately). This surprises students but is mathematically rigorous: let x = 0.999…, then 10x = 9.999…, so 9x = 9, x = 1.",
        "A fraction like 1/6 = 1/(2×3): the 2 means it starts with one terminating digit then recurs — 0.1666… = 0.1\\overline{6}.",
        "Very large primes in denominators give very long periods — e.g., 1/97 has period 96."
      ],
      key_takeaway: "Rational → denominator (in lowest terms) has only 2 and 5 as prime factors → terminating decimal. Otherwise → non-terminating recurring. Irrational → non-terminating, non-recurring. These three cases cover every real number exactly once.",
      video_script_hooks: [
        "Opening: 'Divide 1 by 7. Keep dividing. The digits are 142857142857… and then they repeat forever. Why? Because there are only 7 possible remainders and division must eventually revisit one.'",
        "Mid-lesson: 'Prime-factorise the denominator. Only 2s and 5s? Terminate. Anything else? Recur. That one test classifies any fraction in five seconds.'",
        "Closing: 'Three types of decimal. Three types of number. Perfect symmetry — and it all comes from watching what remainders can possibly do during long division.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     1-C  Operations on Real Numbers
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch1_operations_on_reals",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Operations on Real Numbers",
    prerequisite_knowledge: [
      "Adding, subtracting, multiplying fractions",
      "Square roots and cube roots of perfect powers",
      "Difference of squares identity: (a+b)(a−b) = a²−b²",
      "Definition of irrational numbers and surds"
    ],
    key_formulas: [
      "√a × √b = √(ab)  for a, b ≥ 0",
      "√a / √b = √(a/b)  for a ≥ 0, b > 0",
      "(√a + √b)(√a − √b) = a − b  (rationalising conjugate)",
      "Rationalising 1/(a+√b): multiply by (a−√b)/(a−√b) → result has rational denominator",
      "Rationalising 1/(√a+√b): multiply by (√a−√b)/(√a−√b) → denominator = a−b"
    ],
    teaching_content: {
      intuition: "Surds (expressions with irrational square roots) follow almost all the same arithmetic rules as ordinary numbers. You can add like surds the way you add like terms: 3√2 + 5√2 = 8√2. The tricky part is when an irrational sits in the denominator — for example 1/√2 looks messy. We 'rationalise' the denominator by multiplying by a clever form of 1 (like √2/√2) to push the irrational upstairs, leaving a clean rational denominator.",
      derivation: "Rationalising 1/(√a + √b):\n\nMultiply numerator and denominator by the conjugate (√a − √b):\n\n  1/(√a + √b) × (√a − √b)/(√a − √b)\n= (√a − √b) / ((√a)² − (√b)²)\n= (√a − √b) / (a − b)   (provided a ≠ b)\n\nThe denominator a − b is now rational. This works because (x+y)(x−y) = x²−y² eliminates cross-terms.\n\nExample: 1/(√5 + √3)\n= (√5 − √3)/((√5)² − (√3)²)\n= (√5 − √3)/(5 − 3)\n= (√5 − √3)/2",
      worked_example: "Simplify and rationalise:\n\n(i)  2√3 + 3√3 − √3 = (2+3−1)√3 = 4√3\n\n(ii) √6 × √24 = √(6×24) = √144 = 12\n\n(iii) 5/√7:\n     Multiply by √7/√7: 5√7/7\n\n(iv) 3/(2+√5):\n     Multiply by (2−√5)/(2−√5):\n     = 3(2−√5)/(4−5) = 3(2−√5)/(−1) = −3(2−√5) = −6+3√5 = 3√5−6\n\n(v)  (√3 + 1)² = 3 + 2√3 + 1 = 4 + 2√3",
      visual_description: "Think of surds as coloured blocks. Blocks of √2 are red, blocks of √3 are blue. Red blocks can only combine with red: 2√2 + 3√2 = 5√2. You can't add a red and a blue block — 2√2 + 3√3 stays as is. Rationalising the denominator is like clearing the irrational from the bottom floor of a fraction building and moving it to the top.",
      svg_diagrams: [
        {
          title: "Rationalising 1/(√5+√3) step by step",
          svg_code: "<svg viewBox='0 0 340 130' xmlns='http://www.w3.org/2000/svg'><text x='10' y='25' font-size='13' fill='#333' font-weight='bold'>Rationalise: 1 / (√5 + √3)</text><text x='10' y='55' font-size='12' fill='#1565C0'>Step 1: Multiply top and bottom by conjugate (√5 − √3)</text><text x='10' y='78' font-size='12' fill='#2E7D32'>= (√5 − √3) / [(√5)² − (√3)²]</text><text x='10' y='100' font-size='12' fill='#2E7D32'>= (√5 − √3) / (5 − 3)</text><text x='10' y='122' font-size='13' fill='#C62828' font-weight='bold'>= (√5 − √3) / 2</text></svg>"
        }
      ],
      common_misconceptions: [
        "√a + √b ≠ √(a+b). Example: √4 + √9 = 2+3 = 5, but √(4+9) = √13 ≈ 3.6. Always different.",
        "Cancelling surds as if they were factors: (2+√3)/√3 ≠ 2. The 2 in the numerator is not a multiple of √3.",
        "Forgetting to distribute when rationalising: 3/(2+√5) — after multiplying by (2−√5), the numerator is 3×(2−√5) = 6−3√5, not just 3.",
        "Sign error with conjugate: conjugate of (√5+√3) is (√5−√3), NOT (−√5+√3) or (−√5−√3)."
      ],
      shortcuts_and_tricks: [
        "Like-surd rule: p√n ± q√n = (p±q)√n. Only like surds (same number under root) can be directly added or subtracted.",
        "Product shortcut: √a × √a = a. So (√7)² = 7 instantly.",
        "Conjugate pairs always produce a rational: (a+√b)(a−√b) = a²−b. Both terms under the root vanish.",
        "When simplifying √(large number), factor out perfect squares first: √72 = √(36×2) = 6√2."
      ],
      when_to_use_this_method: "Rationalise the denominator whenever a surd appears in the denominator of a fraction. Simplify surds by extracting perfect-square factors. Add/subtract surds only when they have the same number under the radical sign.",
      edge_cases: [
        "√(−4) is not a real number — square roots of negatives are not covered in Class 9 (they require complex numbers).",
        "Rationalising 1/∛2: cube root denominators require multiplying by ∛4 (not √2) to get ∛8 = 2 in denominator.",
        "0/√5 = 0 (rational) — rationalising is unnecessary when the numerator is 0.",
        "If a = b in 1/(√a−√b), the denominator becomes 0 — undefined; the expression does not exist."
      ],
      key_takeaway: "Surds follow standard algebra rules: collect like surds, use (a+b)(a−b)=a²−b² to rationalise denominators. Always multiply by the conjugate to clear irrational denominators. √a × √b = √(ab) but √a + √b ≠ √(a+b).",
      video_script_hooks: [
        "Opening: '1 divided by √2 — does that simplify? Watch: multiply top and bottom by √2. Now the denominator is 2 and the √2 moved upstairs. That trick is called rationalisation and it appears in every board exam.'",
        "Mid-lesson: 'Like surds are like like terms. 3√5 + 7√5 = 10√5. But 3√5 + 7√3? Leave it — you can't combine different surds any more than you can add apples and oranges.'",
        "Closing: 'The conjugate rule: (√a+√b)(√a−√b) = a−b. That one identity demolishes any irrational denominator in one step. Memorise it.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     1-D  Laws of Exponents for Real Numbers
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch1_laws_of_exponents",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Laws of Exponents for Real Numbers",
    prerequisite_knowledge: [
      "Integer exponents: aⁿ = a×a×…×a (n times)",
      "Basic laws for integer exponents (aᵐ×aⁿ = aᵐ⁺ⁿ, etc.)",
      "Meaning of a⁰ = 1 and a⁻ⁿ = 1/aⁿ",
      "Square roots and cube roots as inverse operations"
    ],
    key_formulas: [
      "aᵐ × aⁿ = aᵐ⁺ⁿ",
      "aᵐ ÷ aⁿ = aᵐ⁻ⁿ",
      "(aᵐ)ⁿ = aᵐⁿ",
      "aᵐ × bᵐ = (ab)ᵐ",
      "a^(1/n) = ⁿ√a  (nth root of a)",
      "a^(m/n) = (ⁿ√a)ᵐ = ⁿ√(aᵐ)",
      "a⁰ = 1 for a ≠ 0;  a⁻ⁿ = 1/aⁿ"
    ],
    teaching_content: {
      intuition: "We already know 2³ = 8 and 2⁴ = 16. What should 2^(1/2) mean? The laws of exponents demand that 2^(1/2) × 2^(1/2) = 2^(1/2+1/2) = 2¹ = 2. So 2^(1/2) is the number that when multiplied by itself gives 2 — that is √2. Fractional exponents are just a compact notation for roots. 8^(1/3) = ∛8 = 2. 27^(2/3) = (∛27)² = 3² = 9. The exponent laws extend seamlessly from integers to all rationals, and then to all reals.",
      derivation: "Extension of aᵐ × aⁿ = aᵐ⁺ⁿ to rational exponents:\n\nFor aᵖ/ᵍ to be consistent with aᵐ × aⁿ = aᵐ⁺ⁿ we need:\n\n  (aᵖ/ᵍ)ᵍ = aᵖ/ᵍ × aᵖ/ᵍ × … (q times) = a^(p/q × q) = aᵖ\n\nSo aᵖ/ᵍ is the number whose q-th power equals aᵖ, i.e., aᵖ/ᵍ = ᵍ√(aᵖ) = (ᵍ√a)ᵖ.\n\nThis is the only definition that keeps all the exponent laws consistent when exponents are fractions.",
      worked_example: "Simplify:\n\n(i)  2^(1/2) × 2^(3/2) = 2^(1/2 + 3/2) = 2^(4/2) = 2² = 4\n\n(ii) (27)^(2/3) = (∛27)² = 3² = 9\n\n(iii) (16)^(−3/4) = 1/(16^(3/4)) = 1/((⁴√16)³) = 1/2³ = 1/8\n\n(iv) Simplify (x²y³)^(1/6) ÷ (x³y²)^(1/6):\n     = (x²y³/x³y²)^(1/6) = (y/x)^(1/6) = ⁶√(y/x)\n\n(v)  Show that 9^(3/2) − 3 × 5⁰ − (1/81)^(−1/2) = 15:\n     9^(3/2) = (√9)³ = 27; 3×5⁰ = 3×1 = 3; (1/81)^(−1/2) = 81^(1/2) = 9\n     27 − 3 − 9 = 15 ✓",
      visual_description: "Draw a number line of exponents from −2 to 3. Mark integer positions: a⁻² = 1/a², a⁻¹ = 1/a, a⁰ = 1, a¹ = a, a² = a², a³ = a³. Now show that halfway between 0 and 1 lives a^(1/2) = √a, and one-third of the way lives a^(1/3) = ∛a. Fractional exponents sit between the integer landmarks just as fractions sit between integers.",
      svg_diagrams: [
        {
          title: "Exponent number line: integer and fractional positions",
          svg_code: "<svg viewBox='0 0 360 100' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='50' x2='340' y2='50' stroke='#333' stroke-width='2'/><circle cx='60' cy='50' r='4' fill='#1565C0'/><circle cx='120' cy='50' r='4' fill='#1565C0'/><circle cx='180' cy='50' r='4' fill='#1565C0'/><circle cx='240' cy='50' r='4' fill='#1565C0'/><circle cx='300' cy='50' r='4' fill='#1565C0'/><circle cx='150' cy='50' r='4' fill='#E91E63'/><circle cx='160' cy='50' r='4' fill='#4CAF50'/><text x='52' y='72' font-size='11'>a⁻¹</text><text x='112' y='72' font-size='11'>a⁰=1</text><text x='175' y='72' font-size='11'>a¹</text><text x='232' y='72' font-size='11'>a²</text><text x='292' y='72' font-size='11'>a³</text><text x='133' y='35' font-size='10' fill='#E91E63'>a^½=√a</text><text x='148' y='85' font-size='9' fill='#4CAF50'>a^⅓=∛a</text><line x1='150' y1='50' x2='150' y2='42' stroke='#E91E63' stroke-width='1.5'/><line x1='160' y1='50' x2='160' y2='58' stroke='#4CAF50' stroke-width='1.5'/></svg>"
        }
      ],
      common_misconceptions: [
        "aᵐ × bⁿ ≠ (ab)^(m+n) — the base must be the same to add exponents. 2³ × 3² ≠ 6⁵.",
        "(a+b)ⁿ ≠ aⁿ + bⁿ — exponents do not distribute over addition. (2+3)² = 25 ≠ 4+9 = 13.",
        "a^(−n) = −aⁿ — WRONG. a^(−n) = 1/aⁿ (positive reciprocal, not negative). 2⁻³ = 1/8, not −8.",
        "Thinking (27)^(2/3) needs a calculator — always simplify the root first: ∛27 = 3, then cube: 3² = 9."
      ],
      shortcuts_and_tricks: [
        "For a^(m/n): always take the root (denominator n) first, then raise to the power (numerator m). Root first avoids large intermediate numbers.",
        "Negative base with even denominator: (−8)^(1/2) is not real. Only odd-root fractional exponents work for negative bases: (−8)^(1/3) = −2.",
        "Power of 1/nth: a^(1/n) = ⁿ√a. So 64^(1/6) = ⁶√64 = 2 (since 2⁶ = 64).",
        "aᵐ/ⁿ = (a^(1/n))ᵐ. Always reduce m/n to lowest terms first."
      ],
      when_to_use_this_method: "Use these laws whenever exponents appear in simplification problems. Apply the root-first strategy for fractional exponents. Convert surds to exponential form when mixing roots with powers: √a = a^(1/2), ∛a = a^(1/3).",
      edge_cases: [
        "0⁰ is indeterminate (undefined in analysis, though sometimes treated as 1 in combinatorics).",
        "1ⁿ = 1 for all n — including fractional and negative exponents.",
        "(−1)^(1/2) is not real — even-root of a negative number has no real value.",
        "Irrational exponent: 2^√2 is a well-defined real number but cannot be simplified to a nice form."
      ],
      key_takeaway: "Fractional exponent a^(m/n) = (ⁿ√a)ᵐ. All six exponent laws (product, quotient, power of power, power of product, zero exponent, negative exponent) extend from integers to all rational exponents with the same rules. Take the root before the power to keep numbers small.",
      video_script_hooks: [
        "Opening: '2^(1/2) × 2^(1/2) must equal 2^1 = 2. So 2^(1/2) is a number that squares to 2 — that is √2. Fractional exponents are just roots in disguise.'",
        "Mid-lesson: '27^(2/3): take the cube root first (27^(1/3) = 3), then square (3² = 9). Never raise 27 to the second power first — you'd get 729 and struggle from there.'",
        "Closing: 'Six laws, all the same. Whether exponents are 3, −2, 1/2, or even √2, the rules do not change. That is the beauty of a good definition.'"
      ]
    }
  }
];

/* ── Seed runner ─────────────────────────────────────────────────────────── */
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 1: Number Systems…");
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
