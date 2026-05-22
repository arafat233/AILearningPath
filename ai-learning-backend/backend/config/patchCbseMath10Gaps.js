/**
 * Patch script — fills the 7 known content gaps in CBSE Class 10 Math
 * NcertTopicContent records. Only writes fields that are currently empty.
 *
 * Targets (verified via reportTopicContentInventory.js):
 *  1. cbse_math10_ch1_decimal_expansions   Decimal expansions of rational numbers  (7 fields)
 *  2. cbse_math10_ch2_division_algorithm   Division algorithm for polynomials      (4 fields)
 *  3. cbse_math10_ch4_completing_the_square   Completing the square                   (4 fields)
 *  4. cbse_math10_ch5_arithmetic_mean_combined   Arithmetic Mean + Combined AP           (2 fields)
 *  5. cbse_math10_ch6_areas_of_similar_triangles   Areas of similar triangles              (1 field)
 *  6. cbse_math10_ch13_empirical_relationship  Empirical Relationship Mode=3M-2Mean    (2 fields)
 *  7. cbse_math10_ch13_ogives  Ogives                                  (2 fields)
 *
 * Usage: node config/patchCbseMath10Gaps.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

/* =========================================================================
 * 1. Ch1 — Decimal expansions of rational numbers (cbse_math10_ch1_decimal_expansions)
 * ========================================================================= */
const ch1_decimals = {
  derivation: {
    starting_question:
      "Two questions: (1) Why does a fraction p/q in lowest terms terminate exactly when q has no prime factor other than 2 or 5? (2) Why does it become non-terminating recurring otherwise?",
    part_1_terminating_case: {
      claim:
        "If q = 2^m · 5^n (in lowest terms p/q), then p/q has a terminating decimal expansion.",
      proof_walkthrough:
        "A terminating decimal is just a fraction with denominator 10^k for some k. Pick k = max(m, n). Multiply numerator and denominator by 2^(k-m) · 5^(k-n). The new denominator becomes 2^k · 5^k = 10^k. So p/q = (some integer)/10^k, which is a terminating decimal.",
      concrete_example:
        "Take 7/8 = 7/2³. Multiply top and bottom by 5³ = 125. We get (7·125)/(8·125) = 875/1000 = 0.875. Terminates.",
    },
    part_2_non_terminating_case: {
      claim:
        "If q (in lowest terms) has any prime factor other than 2 or 5, then p/q is non-terminating recurring.",
      proof_walkthrough:
        "Suppose p/q terminated. Then p/q = m/10^k for some integers m, k. Cross-multiplying: p · 10^k = m · q. So q divides p · 10^k. But gcd(p, q) = 1, so q must divide 10^k = 2^k · 5^k. By Fundamental Theorem of Arithmetic, every prime factor of q is 2 or 5 — contradiction. So p/q cannot terminate; it must recur.",
      concrete_example:
        "Take 1/3. If it terminated, 3 would have to divide some power of 10. But 3 doesn't divide 10, 100, 1000, … (always remainder 1). So 1/3 = 0.333... recurs.",
    },
    part_3_why_it_must_recur: {
      claim: "Any non-terminating decimal of a rational number must repeat.",
      proof_walkthrough:
        "Long division of p by q produces at each step a remainder in {0, 1, 2, …, q-1} — only q possible values. In q+1 steps, by the pigeonhole principle, some remainder must repeat. Once a remainder repeats, the digits that follow must also repeat. So the decimal becomes periodic.",
    },
    key_insight:
      "The decimal '10' in our positional system has prime factors 2 and 5. That's the ONLY reason 2 and 5 are special here. In a base-12 system, 2 and 3 would be special.",
  },

  visual_description: {
    diagram_1_decision_tree:
      "A clean flowchart. Top box: 'Is p/q in lowest terms?' (gray). Below: 'Factorise q'. Two branches: LEFT (green) — 'q = 2^m · 5^n only' → 'TERMINATES'; RIGHT (orange) — 'q has another prime' → 'NON-TERMINATING RECURRING'. Each leaf shows an example fraction. Soft Apple system colors, rounded rectangles, thin connectors. Title 'Decimal expansion decision tree' in muted gray uppercase.",
    diagram_2_examples_grid:
      "A 2x3 grid of cards. Each card shows a fraction in large type with its decimal expansion below. Top row (green border = terminates): 3/8 = 0.375, 13/125 = 0.104, 17/8 = 2.125. Bottom row (orange border = recurs): 1/3 = 0.3̄, 5/7 = 0.7̄1̄4̄2̄8̄5̄, 2/11 = 0.1̄8̄. Each card has a small caption: 'denominator = 2^3', 'denominator = 5^3', etc.",
  },

  svg_diagrams: [
    {
      id: "decision_tree_decimal",
      title: "Will this fraction terminate?",
      svg: `<svg viewBox='0 0 760 460' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='460' fill='#FFFFFF'/><text x='380' y='32' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>WILL THIS FRACTION TERMINATE?</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif'><rect x='275' y='60' width='210' height='60' rx='14' fill='#F5F5F7' stroke='#D2D2D7'/><text x='380' y='86' text-anchor='middle' font-size='15' fill='#1D1D1F'>Take p/q in lowest</text><text x='380' y='106' text-anchor='middle' font-size='15' fill='#1D1D1F'>terms — factorise q</text><line x1='380' y1='120' x2='200' y2='170' stroke='#86868B' stroke-width='2'/><line x1='380' y1='120' x2='560' y2='170' stroke='#86868B' stroke-width='2'/><rect x='80' y='170' width='240' height='70' rx='14' fill='#E8F5E9' stroke='#34C759'/><text x='200' y='198' text-anchor='middle' font-size='15' font-weight='600' fill='#1D5B2B'>q = 2^m · 5^n only</text><text x='200' y='220' text-anchor='middle' font-size='13' fill='#1D5B2B'>(no other primes)</text><rect x='440' y='170' width='240' height='70' rx='14' fill='#FFF4E5' stroke='#FF9500'/><text x='560' y='198' text-anchor='middle' font-size='15' font-weight='600' fill='#7A4A00'>q has another prime</text><text x='560' y='220' text-anchor='middle' font-size='13' fill='#7A4A00'>(3, 7, 11, 13, …)</text><line x1='200' y1='240' x2='200' y2='280' stroke='#86868B' stroke-width='2'/><line x1='560' y1='240' x2='560' y2='280' stroke='#86868B' stroke-width='2'/><rect x='60' y='280' width='280' height='70' rx='14' fill='#34C759'/><text x='200' y='310' text-anchor='middle' font-size='17' font-weight='700' fill='#FFFFFF'>TERMINATES</text><text x='200' y='332' text-anchor='middle' font-size='13' fill='#FFFFFF'>e.g., 7/8 = 0.875</text><rect x='420' y='280' width='280' height='70' rx='14' fill='#FF9500'/><text x='560' y='306' text-anchor='middle' font-size='17' font-weight='700' fill='#FFFFFF'>NON-TERMINATING</text><text x='560' y='322' text-anchor='middle' font-size='13' fill='#FFFFFF'>RECURRING</text><text x='560' y='342' text-anchor='middle' font-size='13' fill='#FFFFFF'>e.g., 1/3 = 0.3̄</text><text x='380' y='400' text-anchor='middle' font-size='13' fill='#86868B'>Rule: only prime factors 2 and 5 in the denominator → terminates.</text><text x='380' y='420' text-anchor='middle' font-size='13' fill='#86868B'>Any other prime → forever-repeating decimal.</text></g></svg>`,
    },
    {
      id: "examples_grid",
      title: "Six examples, two outcomes",
      svg: `<svg viewBox='0 0 760 380' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='380' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>SIX FRACTIONS — TERMINATE OR RECUR?</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif'><rect x='40' y='60' width='220' height='110' rx='14' fill='#E8F5E9' stroke='#34C759' stroke-width='2'/><text x='150' y='100' text-anchor='middle' font-size='30' font-weight='600' fill='#1D5B2B'>3/8 = 0.375</text><text x='150' y='128' text-anchor='middle' font-size='12' fill='#1D5B2B'>8 = 2³  ✓ terminates</text><rect x='270' y='60' width='220' height='110' rx='14' fill='#E8F5E9' stroke='#34C759' stroke-width='2'/><text x='380' y='100' text-anchor='middle' font-size='26' font-weight='600' fill='#1D5B2B'>13/125 = 0.104</text><text x='380' y='128' text-anchor='middle' font-size='12' fill='#1D5B2B'>125 = 5³  ✓ terminates</text><rect x='500' y='60' width='220' height='110' rx='14' fill='#E8F5E9' stroke='#34C759' stroke-width='2'/><text x='610' y='100' text-anchor='middle' font-size='24' font-weight='600' fill='#1D5B2B'>17/20 = 0.85</text><text x='610' y='128' text-anchor='middle' font-size='12' fill='#1D5B2B'>20 = 2²·5  ✓ terminates</text><rect x='40' y='200' width='220' height='110' rx='14' fill='#FFF4E5' stroke='#FF9500' stroke-width='2'/><text x='150' y='240' text-anchor='middle' font-size='28' font-weight='600' fill='#7A4A00'>1/3 = 0.3̄</text><text x='150' y='268' text-anchor='middle' font-size='12' fill='#7A4A00'>3 not in {2,5}  ✗ recurs</text><rect x='270' y='200' width='220' height='110' rx='14' fill='#FFF4E5' stroke='#FF9500' stroke-width='2'/><text x='380' y='240' text-anchor='middle' font-size='22' font-weight='600' fill='#7A4A00'>1/7 = 0.1̄4̄2̄8̄5̄7̄</text><text x='380' y='268' text-anchor='middle' font-size='12' fill='#7A4A00'>7 not in {2,5}  ✗ recurs</text><rect x='500' y='200' width='220' height='110' rx='14' fill='#FFF4E5' stroke='#FF9500' stroke-width='2'/><text x='610' y='240' text-anchor='middle' font-size='26' font-weight='600' fill='#7A4A00'>2/11 = 0.1̄8̄</text><text x='610' y='268' text-anchor='middle' font-size='12' fill='#7A4A00'>11 not in {2,5}  ✗ recurs</text><text x='380' y='350' text-anchor='middle' font-size='13' fill='#86868B'>Notice: it's the DENOMINATOR that decides. The numerator is irrelevant once gcd(p, q) = 1.</text></g></svg>`,
    },
  ],

  shortcuts_and_tricks: [
    {
      shortcut: "Two-prime denominator test",
      rule: "After reducing p/q to lowest terms, factorise q. If every prime factor is 2 or 5, it terminates. Anything else → recurs.",
      example:
        "Is 17/3200 terminating? 3200 = 2^7 · 5² — only 2s and 5s, so YES, terminates.",
      when_to_use:
        "Use FIRST whenever a board question asks 'will this expansion terminate?' — it's a 10-second answer.",
    },
    {
      shortcut: "Number of decimal places",
      rule: "If q = 2^m · 5^n in lowest terms, the expansion terminates in exactly max(m, n) decimal places.",
      example:
        "7/8 = 7/2³ → terminates in max(3, 0) = 3 places: 0.875. And 13/125 = 13/5³ → 3 places: 0.104.",
      when_to_use:
        "When the question asks for the number of digits after the decimal point without computing the full value.",
    },
    {
      shortcut: "Length of recurring block from 1/n (n coprime to 10)",
      rule: "The period of 1/n equals the smallest k such that 10^k ≡ 1 (mod n). Not asked at CBSE, but worth knowing for Olympiad/Quiz.",
      example:
        "For 1/7, the smallest k with 10^k ≡ 1 (mod 7) is k = 6, so 1/7 has a 6-digit repeating block: 142857.",
      when_to_use: "Aptitude / olympiad context — not needed for CBSE board.",
    },
    {
      shortcut: "Reduce BEFORE you factorise",
      rule:
        "Always cancel common factors first. The 'denominator' that matters for the 2-or-5 rule is the denominator in LOWEST TERMS.",
      example:
        "6/15 looks like it has a 3 in the denominator. But 6/15 = 2/5 in lowest terms → terminates as 0.4.",
      when_to_use:
        "Whenever you're given a non-reduced fraction. This trips up most students.",
    },
  ],

  when_to_use_this_method: {
    use_the_2_and_5_rule_when: [
      "The question explicitly asks 'will p/q have a terminating decimal expansion?'",
      "You're asked to identify terminating vs non-terminating from a list of fractions.",
      "You need to determine the number of decimal places without long division.",
      "You're proving theoretically that some specific fraction must recur.",
    ],
    do_actual_long_division_when: [
      "You need the actual digit values of the expansion (e.g., 'find 1/7 up to 6 decimal places').",
      "You need to identify the recurring block (the digits under the bar).",
      "You're computing the decimal value to use further (rounding, comparison, etc.).",
    ],
    pitfalls_to_avoid: [
      "Don't forget to reduce p/q to lowest terms first.",
      "The rule is about the denominator, not the numerator.",
      "A fraction like 7/12 looks terminating because the numerator is small — but 12 = 2² · 3, and 3 is the prime that kills termination.",
    ],
  },

  edge_cases: [
    {
      case: "Integer (q = 1)",
      value: "Trivially terminating (zero decimal places).",
      reasoning:
        "1 = 2^0 · 5^0 — the rule q = 2^m · 5^n holds with m = n = 0. So integers are terminating decimals: 5 = 5.0.",
      where_it_appears: "Sanity check; sometimes appears in MCQs as the 'trivial' option.",
    },
    {
      case: "Numerator is 0 (p = 0)",
      value: "0/q = 0.0 — terminates regardless of q.",
      reasoning:
        "Once you put p = 0, the fraction is just 0; doesn't depend on q at all.",
      where_it_appears: "Edge case in proofs — exclude it explicitly.",
    },
    {
      case: "q has factor of 2 AND 3 (e.g., 1/6)",
      value: "Non-terminating recurring: 1/6 = 0.1̄6̄ (with the 6 recurring).",
      reasoning:
        "After dividing out the 2, you're left with 1/3 worth of behaviour. Because 3 is in the denominator, the 2-and-5 rule fails.",
      where_it_appears:
        "MIXED denominators are a common trap. Students see the 2 and think 'terminates' — but the 3 wins.",
    },
    {
      case: "Pure repeating vs mixed repeating",
      value:
        "1/3 = 0.3̄ (pure repeating). 1/6 = 0.16̄ (mixed — one fixed digit then repeating).",
      reasoning:
        "If the denominator has BOTH a 2-or-5 factor AND another prime, you get a non-repeating prefix before the repeating block kicks in. The prefix length = max(m, n) where q = 2^m · 5^n · (other).",
      where_it_appears: "Distinguishing pure-repeating from mixed-repeating in writeup questions.",
    },
  ],

  video_script_hooks: {
    video_target_length_seconds: 240,
    opening_hook_5_sec:
      "Look at 1/8 = 0.125. Now look at 1/7. You CAN'T write it down without dots. Why? It's not the numerator. It's not how big the denominator is. It's something hiding inside the denominator.",
    narrative_arc:
      "Hook → puzzle (why does 1/8 terminate but 1/7 doesn't?) → factorise denominators → spot the pattern (only 2s and 5s) → connect to base-10 = 2·5 → state the theorem → run through 6 examples on screen → pigeonhole proof that non-terminating MUST repeat → close with a 'try this' challenge.",
    visual_moments: [
      {
        timestamp_seconds: 0,
        what_happens:
          "Two big fractions side-by-side: 1/8 and 1/7. Below each, the decimal expansion appears — 0.125 (terminates, green tick) vs 0.142857142857… (recurs, orange dots).",
      },
      {
        timestamp_seconds: 30,
        what_happens:
          "Factorisation reveal: 8 = 2³ (in blue), 7 = 7 (in orange). Highlight that 2 is special, 7 is not.",
      },
      {
        timestamp_seconds: 60,
        what_happens:
          "Why are 2 and 5 special? Because 10 = 2 × 5. Animation: '10' splits into '2 × 5'. The denominator only needs to 'match' powers of 10.",
      },
      {
        timestamp_seconds: 120,
        what_happens:
          "Six examples grid (3 terminating in green, 3 recurring in orange) populates one card at a time.",
      },
      {
        timestamp_seconds: 180,
        what_happens:
          "Pigeonhole proof animation: q boxes labeled remainder 0, 1, 2, …, q-1. Step-by-step long division dropping each remainder into a box. After q+1 steps, two balls land in the same box → repetition forced.",
      },
      {
        timestamp_seconds: 220,
        what_happens:
          "Closing challenge: 'Will 247/3200 terminate? Pause and answer.' (Yes — 3200 = 2^7 · 5².)",
      },
    ],
  },
};

/* =========================================================================
 * 2. Ch2 — Division algorithm for polynomials (cbse_math10_ch2_division_algorithm)
 * Needs: visual_description, svg_diagrams, edge_cases, video_script_hooks
 * ========================================================================= */
const ch2_polydiv = {
  visual_description: {
    diagram_1_lemma_form:
      "Clean white card with the polynomial division identity displayed prominently: p(x) = g(x) · q(x) + r(x). Each polynomial in a distinct Apple color (p blue, g orange, q green, r pink). Below, a constraint line: deg(r) < deg(g). Underneath each color-coded variable, a label: 'dividend', 'divisor', 'quotient', 'remainder'.",
    diagram_2_long_division_layout:
      "A classic long-division layout but with polynomials. Dividend x³ - 3x² + 4x - 2 inside the long-division bracket, divisor x - 1 outside on the left, quotient x² - 2x + 2 written on top above its place values, and remainder 0 at the bottom. Vertical alignment by degree (x³ under x³, x² under x², etc.). Subtraction strokes between rows.",
  },

  svg_diagrams: [
    {
      id: "division_identity",
      title: "The polynomial division identity",
      svg: `<svg viewBox='0 0 760 300' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='300' fill='#FFFFFF'/><text x='380' y='34' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>POLYNOMIAL DIVISION IDENTITY</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='44' font-weight='400'><text x='90' y='150' fill='#007AFF'>p(x)</text><text x='195' y='150' fill='#86868B'>=</text><text x='235' y='150' fill='#FF9500'>g(x)</text><text x='325' y='150' fill='#86868B'>·</text><text x='350' y='150' fill='#34C759'>q(x)</text><text x='445' y='150' fill='#86868B'>+</text><text x='495' y='150' fill='#FF2D55'>r(x)</text></g><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13'><text x='118' y='178' text-anchor='middle' fill='#007AFF'>dividend</text><text x='265' y='178' text-anchor='middle' fill='#FF9500'>divisor</text><text x='382' y='178' text-anchor='middle' fill='#34C759'>quotient</text><text x='524' y='178' text-anchor='middle' fill='#FF2D55'>remainder</text></g><rect x='220' y='220' width='320' height='40' rx='20' fill='#F5F5F7' stroke='#D2D2D7'/><text x='380' y='246' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='15' fill='#1D1D1F'>deg(r) &lt; deg(g)    or    r(x) = 0</text></svg>`,
    },
    {
      id: "long_division_steps",
      title: "Long division: (x³ − 3x² + 4x − 2) ÷ (x − 1)",
      svg: `<svg viewBox='0 0 760 400' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='400' fill='#FFFFFF'/><text x='380' y='32' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>(x³ − 3x² + 4x − 2) ÷ (x − 1)</text><g font-family='Courier New, monospace' font-size='22' fill='#1D1D1F'><text x='270' y='90'>            x² − 2x + 2</text><text x='270' y='115'>           ____________</text><text x='270' y='140'>x − 1  )  x³ − 3x² + 4x − 2</text><text x='270' y='168' fill='#FF2D55'>           x³ − x²</text><text x='270' y='190' fill='#86868B'>           ─────────</text><text x='270' y='215'>               −2x² + 4x</text><text x='270' y='243' fill='#FF2D55'>               −2x² + 2x</text><text x='270' y='265' fill='#86868B'>               ─────────</text><text x='270' y='290'>                     2x − 2</text><text x='270' y='318' fill='#FF2D55'>                     2x − 2</text><text x='270' y='340' fill='#86868B'>                     ─────────</text><text x='270' y='365' fill='#34C759'>                          0</text></g><text x='380' y='395' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='12' fill='#86868B'>Quotient x² − 2x + 2,  remainder 0  →  (x−1) is a factor.</text></svg>`,
    },
  ],

  edge_cases: [
    {
      case: "Remainder is 0",
      value: "g(x) is a factor of p(x); p(x) = g(x)·q(x).",
      reasoning:
        "By definition, if r(x) = 0 then p(x) factors as g(x)·q(x). This is the Factor Theorem in disguise.",
      where_it_appears:
        "Most CBSE 'show that (x − a) is a factor' questions hinge on this.",
    },
    {
      case: "deg p(x) < deg g(x)",
      value: "Quotient q(x) = 0 and remainder r(x) = p(x).",
      reasoning:
        "You can't subtract any non-zero multiple of g(x) from p(x) without raising the degree. So no division happens — the dividend IS the remainder.",
      where_it_appears:
        "Trap question: 'Divide 2x by x² + 1' — quotient 0, remainder 2x.",
    },
    {
      case: "Divisor is a constant (deg 0)",
      value: "Quotient = p(x) / g, remainder 0 (over reals).",
      reasoning:
        "deg(r) < deg(g) = 0 forces r = 0. Every coefficient of p gets divided by the constant.",
      where_it_appears: "Edge case — not common in board questions.",
    },
    {
      case: "Missing degree terms in dividend",
      value: "Insert 0·x^k placeholder before dividing.",
      reasoning:
        "Long division aligns by degree. If x⁴ + 1 is divided by x − 1, write it as x⁴ + 0·x³ + 0·x² + 0·x + 1 so the columns line up.",
      where_it_appears:
        "Skipping placeholders is the #1 source of arithmetic errors in this topic.",
    },
  ],

  video_script_hooks: {
    video_target_length_seconds: 200,
    opening_hook_5_sec:
      "If long division of numbers makes sense to you — 17 ÷ 5 = 3 remainder 2 — then long division of polynomials is the SAME GAME with x's. Watch.",
    narrative_arc:
      "Hook (long division is just bookkeeping) → write the identity p = g·q + r → walk through one example, step-by-step alignment → highlight the 'subtract and bring down' move → call out the placeholder trick for missing degrees → end with Factor Theorem connection (when r = 0, g is a factor).",
    visual_moments: [
      {
        timestamp_seconds: 0,
        what_happens:
          "Big arithmetic split-screen: '17 ÷ 5 = 3 rem 2' (left) and '(x³−3x²+4x−2) ÷ (x−1) = (x²−2x+2) rem 0' (right). Same shape, same rules.",
      },
      {
        timestamp_seconds: 25,
        what_happens:
          "The identity p(x) = g(x)·q(x) + r(x) animates in, color-coded.",
      },
      {
        timestamp_seconds: 60,
        what_happens:
          "Long division demo, step by step. Each step has the divide → multiply → subtract → bring down loop highlighted.",
      },
      {
        timestamp_seconds: 140,
        what_happens:
          "Placeholder trick: x⁴ − 1 divided by x − 1. Show the rewrite as x⁴ + 0x³ + 0x² + 0x − 1 before dividing.",
      },
      {
        timestamp_seconds: 180,
        what_happens:
          "Closing: remainder is 0 → divisor is a factor. Show p(1) = 0 confirms it via Factor Theorem.",
      },
    ],
  },
};

/* =========================================================================
 * 3. Ch4 — Completing the square (cbse_math10_ch4_completing_the_square)
 * Needs: visual_description, svg_diagrams, edge_cases, video_script_hooks
 * ========================================================================= */
const ch4_complete_square = {
  visual_description: {
    diagram_1_geometric:
      "A literal geometric square. Start with a square of side x (area x²), then attach two rectangles of width b/2 each (total area bx). The L-shape is missing a small corner square of side b/2 (area b²/4). 'Completing' means adding that corner — coloring it a different shade. The big square then has side (x + b/2) and area (x + b/2)². Below: x² + bx + b²/4 = (x + b/2)².",
    diagram_2_quadratic_to_vertex_form:
      "Two parallel layouts. Left: ax² + bx + c = 0 (standard form). Middle arrow labeled 'complete the square'. Right: a(x + b/2a)² + (c − b²/4a) = 0 (vertex form). Each transformation step gets a small annotation.",
  },

  svg_diagrams: [
    {
      id: "geometric_complete_square",
      title: "Why it's called 'completing the square'",
      svg: `<svg viewBox='0 0 760 460' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='460' fill='#FFFFFF'/><text x='380' y='32' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>x² + bx + (b/2)² = (x + b/2)²</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif'><rect x='80' y='80' width='200' height='200' fill='#007AFF' fill-opacity='0.85' stroke='#007AFF'/><text x='180' y='190' text-anchor='middle' font-size='40' font-weight='600' fill='#FFFFFF'>x²</text><rect x='280' y='80' width='80' height='200' fill='#FF9500' fill-opacity='0.85' stroke='#FF9500'/><text x='320' y='190' text-anchor='middle' font-size='22' font-weight='600' fill='#FFFFFF'>(b/2)x</text><rect x='80' y='280' width='200' height='80' fill='#FF9500' fill-opacity='0.85' stroke='#FF9500'/><text x='180' y='328' text-anchor='middle' font-size='22' font-weight='600' fill='#FFFFFF'>(b/2)x</text><rect x='280' y='280' width='80' height='80' fill='#FF2D55' fill-opacity='0.6' stroke='#FF2D55' stroke-dasharray='6,4'/><text x='320' y='322' text-anchor='middle' font-size='20' font-weight='600' fill='#FFFFFF'>(b/2)²</text><text x='320' y='342' text-anchor='middle' font-size='11' fill='#FFFFFF'>add this</text><line x1='80' y1='400' x2='360' y2='400' stroke='#86868B' stroke-width='1'/><text x='220' y='420' text-anchor='middle' font-size='13' fill='#86868B'>side = x + b/2</text><line x1='400' y1='80' x2='400' y2='360' stroke='#86868B' stroke-width='1'/><text x='430' y='220' font-size='13' fill='#86868B'>side = x + b/2</text><rect x='460' y='150' width='220' height='160' rx='14' fill='#F5F5F7' stroke='#D2D2D7'/><text x='570' y='185' text-anchor='middle' font-size='14' fill='#86868B'>RESULT:</text><text x='570' y='225' text-anchor='middle' font-size='22' font-weight='600' fill='#1D1D1F'>(x + b/2)²</text><text x='570' y='258' text-anchor='middle' font-size='13' fill='#86868B'>= x² + bx</text><text x='570' y='278' text-anchor='middle' font-size='13' fill='#86868B'>+ (b/2)²</text></g></svg>`,
    },
    {
      id: "complete_square_steps",
      title: "Completing the square — 4 steps",
      svg: `<svg viewBox='0 0 760 380' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='380' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>SOLVE x² + 6x + 5 = 0 BY COMPLETING THE SQUARE</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='17' fill='#1D1D1F'><rect x='50' y='60' width='660' height='50' rx='10' fill='#F5F5F7'/><text x='70' y='90'>① Move the constant:  x² + 6x = −5</text><rect x='50' y='125' width='660' height='50' rx='10' fill='#E3F2FD'/><text x='70' y='155'>② Half the coefficient of x, square it: (6/2)² = 9  →  add 9 to both sides</text><rect x='50' y='190' width='660' height='50' rx='10' fill='#E8F5E9'/><text x='70' y='220'>③ Left side is now a perfect square:  (x + 3)² = 4</text><rect x='50' y='255' width='660' height='50' rx='10' fill='#FFF4E5'/><text x='70' y='285'>④ Take square root of both sides:  x + 3 = ±2  →  x = −1 or x = −5</text></g></svg>`,
    },
  ],

  edge_cases: [
    {
      case: "Leading coefficient ≠ 1 (e.g., 2x² + 8x + 5)",
      value: "Divide every term by the leading coefficient first, then complete the square.",
      reasoning:
        "The geometric square only works for x², not for 2x². Factor out the leading coefficient — make the coefficient of x² equal to 1 — and proceed.",
      where_it_appears:
        "Boards rarely give a = 1; always check. 2x² + 8x + 5 → 2(x² + 4x) + 5 → 2((x+2)² − 4) + 5 = 2(x+2)² − 3.",
    },
    {
      case: "Negative coefficient of x²",
      value: "Factor out −1 (or the negative leading coefficient) first.",
      reasoning:
        "Same as above; if a < 0, the parabola opens downward but the algebra is identical.",
      where_it_appears:
        "Maximization problems (negative quadratic). The 'completing the square' form gives the vertex directly.",
    },
    {
      case: "Discriminant < 0 (no real solution)",
      value:
        "After completing the square, you get (x + b/2)² = (negative number). No real x. Solutions are complex.",
      reasoning:
        "Square of a real number can't be negative. The method correctly fails — it doesn't 'find roots that don't exist.'",
      where_it_appears:
        "CBSE asks 'show roots are non-real' — completing the square gives the cleanest argument.",
    },
    {
      case: "b is odd → fractional 'half'",
      value: "Use fractions; the method still works, just with messier arithmetic.",
      reasoning:
        "x² + 5x + 1 → half of 5 is 5/2 → square is 25/4 → (x + 5/2)² = 25/4 − 1 = 21/4 → x = (−5 ± √21)/2.",
      where_it_appears:
        "Arithmetic-heavy CBSE problems. Many students prefer to use the quadratic formula here, but completing the square works and shows derivation.",
    },
  ],

  video_script_hooks: {
    video_target_length_seconds: 220,
    opening_hook_5_sec:
      "Here's a 2000-year-old trick from ancient Babylon. Take any quadratic that DOESN'T factor nicely, and turn it INTO one that does — by literally completing a geometric square.",
    narrative_arc:
      "Hook (Babylonian geometric origin) → show the literal square diagram → state the 'half-and-square' rule → walk through one numeric example, 4 steps → derive the quadratic formula from completing the square (the 'why' behind the formula) → close with edge case (leading coefficient ≠ 1).",
    visual_moments: [
      {
        timestamp_seconds: 0,
        what_happens:
          "Big blue square (x²) on screen. Two orange rectangles glide in from the right and snap onto the right side and bottom. There's now a missing corner — a pink dashed outline appears in the corner. Caption: 'we need to complete the square.'",
      },
      {
        timestamp_seconds: 30,
        what_happens:
          "Equation x² + bx + (b/2)² = (x + b/2)² fades in, color-coded to match the rectangles.",
      },
      {
        timestamp_seconds: 70,
        what_happens:
          "Worked example x² + 6x + 5 = 0. Each of the 4 steps lights up one at a time with a brief annotation.",
      },
      {
        timestamp_seconds: 150,
        what_happens:
          "Derivation of the quadratic formula. Start with ax² + bx + c = 0. Complete the square. Pop! The formula emerges.",
      },
      {
        timestamp_seconds: 200,
        what_happens:
          "Final callout: 'Whenever a ≠ 1, divide first. This is the only thing students forget.'",
      },
    ],
  },
};

/* =========================================================================
 * 4. Ch5 — Arithmetic Mean and Combined AP Problems (cbse_math10_ch5_arithmetic_mean_combined)
 * Needs: visual_description, svg_diagrams
 * ========================================================================= */
const ch5_combined_ap = {
  visual_description: {
    diagram_1_arithmetic_mean:
      "Three dots in a row on a horizontal axis labeled a, AM, b. The AM dot is exactly halfway between a and b — emphasised by a dashed vertical line from the midpoint of segment ab up to the AM point. Below: formula AM = (a + b)/2.",
    diagram_2_combined_problem_flow:
      "A flowchart showing the two-equation strategy for combined AP problems. Box 1: 'Given: nth term value + Sum value' → Box 2: 'Write a + (n−1)d = T_n' → Box 3: 'Write (n/2)(2a + (n−1)d) = S_n' → Box 4: 'Two equations, two unknowns (a, d)' → Box 5: 'Solve simultaneously'.",
  },

  svg_diagrams: [
    {
      id: "arithmetic_mean_number_line",
      title: "Arithmetic Mean — the midpoint",
      svg: `<svg viewBox='0 0 760 280' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='280' fill='#FFFFFF'/><text x='380' y='32' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>ARITHMETIC MEAN OF a AND b</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif'><line x1='80' y1='150' x2='680' y2='150' stroke='#86868B' stroke-width='2'/><line x1='80' y1='140' x2='80' y2='160' stroke='#86868B' stroke-width='2'/><line x1='680' y1='140' x2='680' y2='160' stroke='#86868B' stroke-width='2'/><line x1='380' y1='130' x2='380' y2='170' stroke='#34C759' stroke-width='3' stroke-dasharray='6,4'/><circle cx='80' cy='150' r='8' fill='#007AFF'/><circle cx='380' cy='150' r='12' fill='#34C759'/><circle cx='680' cy='150' r='8' fill='#FF9500'/><text x='80' y='195' text-anchor='middle' font-size='22' font-weight='600' fill='#007AFF'>a</text><text x='380' y='195' text-anchor='middle' font-size='22' font-weight='600' fill='#34C759'>AM</text><text x='680' y='195' text-anchor='middle' font-size='22' font-weight='600' fill='#FF9500'>b</text><text x='230' y='130' text-anchor='middle' font-size='14' fill='#86868B'>same distance</text><text x='530' y='130' text-anchor='middle' font-size='14' fill='#86868B'>same distance</text><rect x='240' y='225' width='280' height='40' rx='20' fill='#E8F5E9' stroke='#34C759'/><text x='380' y='251' text-anchor='middle' font-size='17' font-weight='600' fill='#1D5B2B'>AM = (a + b) / 2</text></g></svg>`,
    },
    {
      id: "combined_problem_strategy",
      title: "Two equations, two unknowns",
      svg: `<svg viewBox='0 0 760 380' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='380' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>COMBINED nth TERM + SUM PROBLEM</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif'><rect x='80' y='60' width='600' height='55' rx='12' fill='#F5F5F7' stroke='#D2D2D7'/><text x='100' y='95' font-size='15' fill='#1D1D1F'>① Given: T_n value AND S_n value (or two of T_p, T_q, S_p, S_q)</text><rect x='80' y='130' width='600' height='55' rx='12' fill='#E3F2FD' stroke='#007AFF'/><text x='100' y='165' font-size='15' fill='#003D7A'>② Write Equation 1:  a + (n−1)d = T_n</text><rect x='80' y='200' width='600' height='55' rx='12' fill='#E8F5E9' stroke='#34C759'/><text x='100' y='235' font-size='15' fill='#1D5B2B'>③ Write Equation 2:  (n/2) · (2a + (n−1)d) = S_n</text><rect x='80' y='270' width='600' height='55' rx='12' fill='#FFF4E5' stroke='#FF9500'/><text x='100' y='305' font-size='15' fill='#7A4A00'>④ Solve simultaneously for a and d  (substitution or elimination)</text></g></svg>`,
    },
  ],
};

/* =========================================================================
 * 5. Ch6 — Areas of similar triangles (cbse_math10_ch6_areas_of_similar_triangles)
 * Needs: svg_diagrams only
 * ========================================================================= */
const ch6_similar_areas = {
  svg_diagrams: [
    {
      id: "areas_of_similar_triangles",
      title: "Ratio of areas = (ratio of sides)²",
      svg: `<svg viewBox='0 0 760 440' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='440' fill='#FFFFFF'/><text x='380' y='32' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>AREA(△ABC) / AREA(△DEF) = (AB / DE)²</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif'><polygon points='100,300 220,90 300,300' fill='#007AFF' fill-opacity='0.25' stroke='#007AFF' stroke-width='2.5'/><text x='95' y='320' font-size='15' font-weight='600' fill='#007AFF'>B</text><text x='220' y='80' text-anchor='middle' font-size='15' font-weight='600' fill='#007AFF'>A</text><text x='310' y='320' font-size='15' font-weight='600' fill='#007AFF'>C</text><text x='200' y='340' font-size='13' fill='#86868B'>side a</text><polygon points='430,300 590,150 700,300' fill='#FF9500' fill-opacity='0.25' stroke='#FF9500' stroke-width='2.5'/><text x='425' y='320' font-size='15' font-weight='600' fill='#FF9500'>E</text><text x='590' y='140' text-anchor='middle' font-size='15' font-weight='600' fill='#FF9500'>D</text><text x='710' y='320' font-size='15' font-weight='600' fill='#FF9500'>F</text><text x='560' y='340' font-size='13' fill='#86868B'>side ka</text><line x1='220' y1='90' x2='220' y2='300' stroke='#86868B' stroke-width='1' stroke-dasharray='4,4'/><text x='235' y='200' font-size='12' fill='#86868B'>height h</text><line x1='590' y1='150' x2='590' y2='300' stroke='#86868B' stroke-width='1' stroke-dasharray='4,4'/><text x='605' y='225' font-size='12' fill='#86868B'>height kh</text><rect x='180' y='370' width='400' height='50' rx='14' fill='#F5F5F7' stroke='#D2D2D7'/><text x='380' y='400' text-anchor='middle' font-size='18' font-weight='600' fill='#1D1D1F'>If sides are in ratio 1 : k, areas are in ratio 1 : k²</text></g></svg>`,
    },
    {
      id: "areas_proof_sketch",
      title: "Why areas square the ratio — derivation",
      svg: `<svg viewBox='0 0 760 340' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='340' fill='#FFFFFF'/><text x='380' y='32' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>WHY (1/2)·b·h GIVES A SQUARE RATIO</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='16' fill='#1D1D1F'><rect x='60' y='60' width='640' height='48' rx='10' fill='#F5F5F7'/><text x='80' y='90'>Step 1:  Area(△ABC) = (1/2) · base · height = (1/2) · BC · h₁</text><rect x='60' y='120' width='640' height='48' rx='10' fill='#F5F5F7'/><text x='80' y='150'>Step 2:  Area(△DEF) = (1/2) · EF · h₂</text><rect x='60' y='180' width='640' height='48' rx='10' fill='#E3F2FD'/><text x='80' y='210'>Step 3:  Triangles are similar, so BC/EF = h₁/h₂ = k  (a single ratio)</text><rect x='60' y='240' width='640' height='48' rx='10' fill='#E8F5E9'/><text x='80' y='270'>Step 4:  Ratio = (BC · h₁) / (EF · h₂) = k · k = k²   ✓</text></g></svg>`,
    },
  ],
};

/* =========================================================================
 * 6. Ch13 — Empirical Relationship Mode = 3·Median − 2·Mean (cbse_math10_ch13_empirical_relationship)
 * Needs: visual_description, svg_diagrams
 * ========================================================================= */
const ch13_empirical = {
  visual_description: {
    diagram_1_three_measures_on_number_line:
      "A horizontal number line with three labeled points: Mean (orange), Median (green), Mode (blue). For a typical skewed distribution they're at different positions. An arrow connecting them illustrates the empirical relationship: stepping from Mean to Median to Mode follows a specific arithmetic.",
    diagram_2_formula_breakdown:
      "Three boxes stacked: 'Mode = 3·Median − 2·Mean' (big). Below: rearrangements 'Mean = (3·Median − Mode) / 2' and 'Median = (Mode + 2·Mean) / 3'. Each rearrangement labeled with when to use it.",
  },

  svg_diagrams: [
    {
      id: "three_measures_number_line",
      title: "Where Mean, Median, Mode sit on a skewed distribution",
      svg: `<svg viewBox='0 0 760 360' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='360' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>MEAN, MEDIAN, MODE — POSITIONS ON A SKEWED DISTRIBUTION</text><path d='M 80 220 Q 200 60, 320 130 T 680 220' stroke='#86868B' stroke-width='2' fill='#F5F5F7' fill-opacity='0.5'/><line x1='80' y1='220' x2='680' y2='220' stroke='#86868B' stroke-width='1.5'/><line x1='280' y1='215' x2='280' y2='285' stroke='#007AFF' stroke-width='3'/><circle cx='280' cy='220' r='7' fill='#007AFF'/><text x='280' y='305' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='14' font-weight='600' fill='#007AFF'>Mode</text><line x1='350' y1='215' x2='350' y2='270' stroke='#34C759' stroke-width='3'/><circle cx='350' cy='220' r='7' fill='#34C759'/><text x='350' y='290' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='14' font-weight='600' fill='#34C759'>Median</text><line x1='420' y1='215' x2='420' y2='285' stroke='#FF9500' stroke-width='3'/><circle cx='420' cy='220' r='7' fill='#FF9500'/><text x='420' y='305' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='14' font-weight='600' fill='#FF9500'>Mean</text><rect x='130' y='75' width='500' height='40' rx='14' fill='#FFFFFF' stroke='#D2D2D7'/><text x='380' y='102' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='17' font-weight='600' fill='#1D1D1F'>Mode = 3 · Median − 2 · Mean</text></svg>`,
    },
    {
      id: "formula_rearrangements",
      title: "Three forms of the same identity",
      svg: `<svg viewBox='0 0 760 340' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='340' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>WHICH ONE TO USE — DEPENDS ON WHAT'S MISSING</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif'><rect x='80' y='60' width='600' height='65' rx='14' fill='#E3F2FD' stroke='#007AFF' stroke-width='2'/><text x='100' y='90' font-size='14' fill='#003D7A'>Need Mode (given Median + Mean):</text><text x='380' y='115' text-anchor='middle' font-size='22' font-weight='600' fill='#003D7A'>Mode = 3·Median − 2·Mean</text><rect x='80' y='140' width='600' height='65' rx='14' fill='#E8F5E9' stroke='#34C759' stroke-width='2'/><text x='100' y='170' font-size='14' fill='#1D5B2B'>Need Mean (given Median + Mode):</text><text x='380' y='195' text-anchor='middle' font-size='22' font-weight='600' fill='#1D5B2B'>Mean = (3·Median − Mode) / 2</text><rect x='80' y='220' width='600' height='65' rx='14' fill='#FFF4E5' stroke='#FF9500' stroke-width='2'/><text x='100' y='250' font-size='14' fill='#7A4A00'>Need Median (given Mode + Mean):</text><text x='380' y='275' text-anchor='middle' font-size='22' font-weight='600' fill='#7A4A00'>Median = (Mode + 2·Mean) / 3</text></g></svg>`,
    },
  ],
};

/* =========================================================================
 * 7. Ch13 — Ogives (cbse_math10_ch13_ogives)
 * Needs: svg_diagrams, edge_cases
 * ========================================================================= */
const ch13_ogives = {
  svg_diagrams: [
    {
      id: "less_than_ogive",
      title: "Less-than ogive (cumulative frequency rising)",
      svg: `<svg viewBox='0 0 760 460' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='460' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>LESS-THAN OGIVE — PLOTTED AT UPPER CLASS LIMITS</text><line x1='90' y1='400' x2='720' y2='400' stroke='#1D1D1F' stroke-width='2'/><line x1='90' y1='80' x2='90' y2='400' stroke='#1D1D1F' stroke-width='2'/><text x='405' y='435' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' fill='#86868B'>Upper class limit</text><text x='50' y='240' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' fill='#86868B' transform='rotate(-90 50 240)'>Cumulative frequency</text><g font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='11' fill='#86868B'><text x='180' y='418' text-anchor='middle'>10</text><text x='270' y='418' text-anchor='middle'>20</text><text x='360' y='418' text-anchor='middle'>30</text><text x='450' y='418' text-anchor='middle'>40</text><text x='540' y='418' text-anchor='middle'>50</text><text x='630' y='418' text-anchor='middle'>60</text><text x='80' y='340' text-anchor='end'>5</text><text x='80' y='280' text-anchor='end'>15</text><text x='80' y='220' text-anchor='end'>30</text><text x='80' y='160' text-anchor='end'>45</text><text x='80' y='105' text-anchor='end'>50</text></g><path d='M 180 380 Q 230 355, 270 340 T 360 230 T 450 165 T 540 115 T 630 100' fill='none' stroke='#007AFF' stroke-width='3'/><circle cx='180' cy='380' r='5' fill='#007AFF'/><circle cx='270' cy='340' r='5' fill='#007AFF'/><circle cx='360' cy='230' r='5' fill='#007AFF'/><circle cx='450' cy='165' r='5' fill='#007AFF'/><circle cx='540' cy='115' r='5' fill='#007AFF'/><circle cx='630' cy='100' r='5' fill='#007AFF'/><line x1='90' y1='245' x2='400' y2='245' stroke='#FF2D55' stroke-width='2' stroke-dasharray='6,4'/><line x1='400' y1='245' x2='400' y2='400' stroke='#FF2D55' stroke-width='2' stroke-dasharray='6,4'/><text x='200' y='240' font-size='12' fill='#FF2D55'>N/2 = 25</text><text x='405' y='418' text-anchor='start' font-size='12' font-weight='600' fill='#FF2D55'>median ≈ 32</text></svg>`,
    },
    {
      id: "less_than_vs_more_than",
      title: "Less-than vs more-than ogive (intersection gives median)",
      svg: `<svg viewBox='0 0 760 440' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='440' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, SF Pro Display, Helvetica Neue, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2.2'>BOTH OGIVES ON ONE AXIS — INTERSECTION → MEDIAN</text><line x1='90' y1='380' x2='720' y2='380' stroke='#1D1D1F' stroke-width='2'/><line x1='90' y1='70' x2='90' y2='380' stroke='#1D1D1F' stroke-width='2'/><path d='M 130 360 Q 200 340, 270 300 T 400 200 T 540 110 T 680 80' fill='none' stroke='#007AFF' stroke-width='3'/><text x='620' y='100' font-size='13' font-weight='600' fill='#007AFF'>less-than</text><path d='M 130 80 Q 200 100, 270 140 T 400 240 T 540 320 T 680 360' fill='none' stroke='#FF9500' stroke-width='3'/><text x='620' y='350' font-size='13' font-weight='600' fill='#FF9500'>more-than</text><circle cx='400' cy='220' r='8' fill='#34C759' stroke='#FFFFFF' stroke-width='2'/><line x1='400' y1='220' x2='400' y2='380' stroke='#34C759' stroke-width='2' stroke-dasharray='6,4'/><text x='400' y='405' text-anchor='middle' font-size='13' font-weight='600' fill='#34C759'>MEDIAN</text><text x='420' y='220' font-size='12' fill='#1D1D1F'>x-coord of intersection = median</text></svg>`,
    },
  ],

  edge_cases: [
    {
      case: "Ogive is plotted with the WRONG x-values",
      value:
        "Common error: plotting cumulative frequency against class midpoints or lower limits. The less-than ogive MUST use upper class limits; the more-than ogive MUST use lower class limits.",
      reasoning:
        "Cumulative frequency 'less than upper limit U' refers to all observations with value < U. Plotting at midpoint shifts the curve left and gives a wrong median.",
      where_it_appears:
        "Most-deducted-marks error in CBSE board markings. Examiners specifically check x-coordinates.",
    },
    {
      case: "Start the curve from the lower limit of the first class",
      value:
        "Always 'anchor' the less-than ogive at (lower_limit_of_first_class, 0). It's the implicit zero-cf point.",
      reasoning:
        "Below the first class, the cumulative frequency is 0. Drawing the curve without this point misses a data point and makes the curve start mid-air.",
      where_it_appears:
        "Drawing-mark in board questions; ignoring this loses 1 mark even if the rest of the graph is correct.",
    },
    {
      case: "Two intersection points (rare)",
      value:
        "If both ogives are drawn carefully, they intersect at exactly one point. If two intersections appear, it means a plotting error.",
      reasoning:
        "Less-than is strictly non-decreasing; more-than is strictly non-increasing. Two monotone curves cross at most once.",
      where_it_appears: "Self-check: if you see two intersections, redo your data table.",
    },
    {
      case: "N is odd vs even",
      value:
        "For grouped data, we always use N/2 (not (N+1)/2). Grouped-data median formula treats data as continuous.",
      reasoning:
        "For raw (ungrouped) data, median position depends on N parity. For grouped data via ogive, we use N/2 even when N is odd — the continuous-approximation convention.",
      where_it_appears:
        "Students mix up raw-data and grouped-data conventions. CBSE uses grouped → always N/2.",
    },
  ],
};

/* =========================================================================
 * Run patcher
 * ========================================================================= */
const patches = [
  { topicId: "cbse_math10_ch1_decimal_expansions", patch: ch1_decimals, label: "Decimal expansions" },
  { topicId: "cbse_math10_ch2_division_algorithm", patch: ch2_polydiv, label: "Division algorithm for polynomials" },
  { topicId: "cbse_math10_ch4_completing_the_square", patch: ch4_complete_square, label: "Completing the square" },
  { topicId: "cbse_math10_ch5_arithmetic_mean_combined", patch: ch5_combined_ap, label: "Combined AP problems" },
  { topicId: "cbse_math10_ch6_areas_of_similar_triangles", patch: ch6_similar_areas, label: "Areas of similar triangles" },
  { topicId: "cbse_math10_ch13_empirical_relationship", patch: ch13_empirical, label: "Empirical Relationship" },
  { topicId: "cbse_math10_ch13_ogives", patch: ch13_ogives, label: "Ogives" },
];

function isEmpty(v) {
  if (v == null) return true;
  if (typeof v === "string") return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Patching 7 CBSE Class 10 Math topics with missing teaching_content fields\n");

  for (const { topicId, patch, label } of patches) {
    const doc = await NcertTopicContent.findOne({ topicId });
    if (!doc) {
      console.log(`  ✗ ${topicId} (${label}) — NOT FOUND`);
      continue;
    }
    const tc = doc.teaching_content || {};
    const updates = {};
    for (const [field, value] of Object.entries(patch)) {
      if (isEmpty(tc[field])) {
        updates[`teaching_content.${field}`] = value;
      }
    }
    if (Object.keys(updates).length === 0) {
      console.log(`  · ${topicId} (${label}) — no empty fields, skipped`);
      continue;
    }
    await NcertTopicContent.updateOne({ _id: doc._id }, { $set: updates });
    console.log(`  ✓ ${topicId} (${label}) — filled: ${Object.keys(updates).map(k => k.replace("teaching_content.", "")).join(", ")}`);
  }

  console.log("\nDone.");
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
