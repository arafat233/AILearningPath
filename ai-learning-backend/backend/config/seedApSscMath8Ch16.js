/**
 * AP SSC Class 8 Mathematics — Chapter 16: Playing with Numbers
 * 3 topics. topicId: ap_ssc_math8_ch16_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch16.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch16_general_form",
    subject: "Mathematics",
    chapterNumber: 16,
    name: "Numbers in General Form",
    prerequisite_knowledge: ["Place value (tens and ones)", "Forming and simplifying algebraic expressions", "Two-digit and three-digit numbers", "Distributive law"],
    key_formulas: ["Two-digit number with tens a, ones b = 10a + b", "Reversed number = 10b + a", "Three-digit number = 100a + 10b + c", "Sum of a two-digit number and its reverse = 11(a + b)"],
    teaching_content: {
      intuition: "A two-digit number like 37 isn't just '3 and 7' — it's 10×3 + 7. Writing numbers in this GENERAL FORM (10a + b) lets us use algebra to explain number tricks: why reversing digits and subtracting always gives a multiple of 9, why a number and its reverse add to a multiple of 11, and how divisibility tests work.",
      derivation: "A two-digit number with tens digit a and units digit b equals 10a + b (place value). Reverse it: 10b + a. \nSum: (10a+b)+(10b+a) = 11a + 11b = 11(a+b) — always divisible by 11. \nDifference: (10a+b)−(10b+a) = 9a − 9b = 9(a−b) — always divisible by 9. \nGeneral form turns these 'magic tricks' into one-line algebraic proofs.",
      worked_example: "Show that 73 − 37 is divisible by 9, using general form.\n\n73 = 10(7) + 3, 37 = 10(3) + 7.\n73 − 37 = (70+3) − (30+7) = 40 − 4 = 36 = 9 × 4. ✓\nIn general (10a+b) − (10b+a) = 9(a−b), here 9(7−3) = 36 — always a multiple of 9.",
      visual_description: "The number 37 expanded as 10×3 + 7 in a place-value box (tens | ones), and the algebraic pair 10a+b / 10b+a shown adding to 11(a+b) and subtracting to 9(a−b).",
      svg_diagrams: [{ title: "Two-digit number in general form 10a + b", svg_code: "<svg viewBox='0 0 200 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='10' y='25'>37 = 10×3 + 7</text><text x='10' y='48' fill='#16a34a'>10a + b  (reverse: 10b + a)</text></svg>" }],
      common_misconceptions: ["Treating ab as a×b instead of the number 10a+b.", "Forgetting place value when expanding (the tens digit is multiplied by 10).", "Sign errors when subtracting the reversed number.", "Confusing the digit with its place value."],
      shortcuts_and_tricks: ["Number ↔ reverse: sum = 11(a+b), difference = 9(a−b) — memorable results.", "Three-digit: 100a+10b+c; minus its reverse = 99(a−c).", "Use general form to PROVE divisibility patterns instead of testing examples."],
      when_to_use_this_method: "Use general form to explain/prove number patterns and divisibility rules, and to set up algebraic 'digit' puzzles (where a number's digits are unknown).",
      edge_cases: ["A two-digit number requires a ≠ 0 (else it's a one-digit number).", "Palindromic two-digit numbers (a=b) give difference 0.", "Three-digit general form extends the same idea with a hundreds term."],
      key_takeaway: "Write numbers by place value in general form: two-digit = 10a+b, three-digit = 100a+10b+c. This turns digit tricks into algebra: number+reverse = 11(a+b), number−reverse = 9(a−b) — explaining the patterns rather than just observing them.",
      video_script_hooks: ["Opening: '37 is secretly 10 times 3, plus 7. Writing it that way unlocks every number trick you've ever seen.'", "Mid: 'Reverse any two-digit number and subtract — you ALWAYS get a multiple of 9. Algebra proves why: 9(a−b).'", "Closing: 'Place value isn't just for reading numbers — it's the key to proving how they behave.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch16_divisibility_tests",
    subject: "Mathematics",
    chapterNumber: 16,
    name: "Divisibility Tests and Why They Work",
    prerequisite_knowledge: ["Numbers in general form (place value)", "Digit sum", "Multiples of 2,3,5,9,10,11", "Basic algebra (factoring out a common factor)"],
    key_formulas: ["÷2: last digit even · ÷5: last digit 0 or 5 · ÷10: last digit 0", "÷3 (and ÷9): the DIGIT SUM is divisible by 3 (or 9)", "÷11: alternating digit sum (difference of sums of alternate digits) divisible by 11", "Tests work because 10 ≡ 1 (mod 9) and 10 ≡ −1 (mod 11)"],
    teaching_content: {
      intuition: "Divisibility tests are shortcuts to check if a number divides evenly WITHOUT doing the division. The digit-sum test for 3 and 9, the last-digit test for 2/5/10, and the alternating-sum test for 11 all come from how place value behaves: powers of 10 leave a tidy remainder when divided by 9 or 11, so only the digits matter.",
      derivation: "Why the ÷9 (and ÷3) digit-sum test works: any number = …+100c+10b+a. Since 10 = 9+1, 100 = 99+1, each power of 10 leaves remainder 1 on division by 9. So the whole number leaves the same remainder as a+b+c+… (its digit sum). Hence 9 | number ⟺ 9 | digit sum (same for 3). \nWhy ÷11 uses ALTERNATING sums: 10 leaves remainder −1 mod 11, 100 leaves +1, etc., so the remainder equals the alternating digit sum.",
      worked_example: "Test 3729 for divisibility by 3, 9 and 11.\n\nDigit sum = 3+7+2+9 = 21. 21 ÷ 3 = 7 (so ÷3 ✓); 21 ÷ 9 is not whole (so ÷9 ✗).\n÷11 alternating sum: (9+7) − (2+3) = 16 − 5 = 11, divisible by 11 ✓. So 3729 is divisible by 3 and by 11, not by 9.",
      visual_description: "The number 3729 with its digits summed (21) for the 3/9 test, and tagged + − + − from the right for the 11 test, showing (9+7)−(2+3)=11.",
      svg_diagrams: [{ title: "Divisibility tests on 3729", svg_code: "<svg viewBox='0 0 220 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><text x='10' y='22'>3+7+2+9 = 21 → ÷3 ✓ ÷9 ✗</text><text x='10' y='45'>alt: (9+7)−(2+3)=11 → ÷11 ✓</text></svg>" }],
      common_misconceptions: ["Using the digit-sum test for divisibility by numbers it doesn't apply to (it's for 3 and 9, not 7).", "Forgetting that ÷3 needs digit sum divisible by 3, ÷9 needs it divisible by 9 (9 is stricter).", "Mis-applying the ÷11 test (must ALTERNATE signs).", "Thinking last-digit tests work for 3 or 9 (they don't)."],
      shortcuts_and_tricks: ["2,5,10 → look at the LAST digit only. 3,9 → digit SUM. 11 → ALTERNATING digit sum.", "÷6 = ÷2 AND ÷3; ÷15 = ÷3 AND ÷5 (combine prime-factor tests).", "Digit sum divisible by 9 ⟹ also by 3 (since 9 is a multiple of 3)."],
      when_to_use_this_method: "Use divisibility tests to quickly check factors, simplify fractions, and solve 'find the missing digit so that N is divisible by k' puzzles.",
      edge_cases: ["A number divisible by 9 is automatically divisible by 3, but not vice versa.", "Combine tests for composite divisors (÷6, ÷12, ÷15, ÷45).", "The ÷11 alternating sum can be 0, which counts as divisible by 11."],
      key_takeaway: "Divisibility tests read the answer from the digits: last digit (2,5,10), digit sum (3,9), alternating digit sum (11). They work because powers of 10 leave remainder 1 mod 9 and ±1 mod 11. Combine tests for composite divisors (÷6 = ÷2 and ÷3).",
      video_script_hooks: ["Opening: 'Is 3729 divisible by 3? Don't divide — just add the digits. 21? Yes.'", "Mid: 'These tricks aren't magic. Powers of 10 leave a remainder of 1 when divided by 9 — so only the digit sum matters.'", "Closing: 'For 11, alternate plus-minus across the digits. It's the strangest test, and it always works.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch16_letters_for_digits",
    subject: "Mathematics",
    chapterNumber: 16,
    name: "Letters for Digits (Cryptarithms)",
    prerequisite_knowledge: ["Numbers in general form and place value", "Addition with carrying", "Divisibility / units-digit reasoning", "Logical elimination"],
    key_formulas: ["Each LETTER stands for a single digit (0–9); the SAME letter = the same digit", "Different letters usually represent different digits", "Leading digit of a number is never 0", "Solve by analysing the UNITS column first, then carries"],
    teaching_content: {
      intuition: "Cryptarithms are number puzzles where digits are hidden behind letters (like A + A = ... or AB × 3 = CAB). You crack them with logic, not guessing: look at the units column, use carrying, and use facts like 'a leading digit can't be 0'. Place value plus a bit of deduction solves them.",
      derivation: "Strategy: \n1. Start with the UNITS (rightmost) column — it has no incoming carry, so it's the most constrained. \n2. Determine the units digit and any carry to the next column. \n3. Move left column by column, tracking carries. \n4. Use constraints: same letter = same digit, leading digits ≠ 0, and the resulting digit must be 0–9. Eliminate impossible options until one consistent solution remains.",
      worked_example: "Find A in the addition  A + A = 8  (single column).  Then solve units of  2A + 3 = ...B with a carry.\n\nA + A = 8 ⟹ 2A = 8 ⟹ A = 4. \nMore generally, in a column you also add any carry from the right; if a column total exceeds 9, it produces a carry of 1 into the next column. Always check the leading letter isn't forced to 0.",
      visual_description: "A vertical addition with letters in place of digits, the units column boxed and analysed first, an arrow showing a carry of 1 passing to the tens column.",
      svg_diagrams: [{ title: "Cryptarithm: analyse the units column first", svg_code: "<svg viewBox='0 0 160 80' xmlns='http://www.w3.org/2000/svg' font-family='monospace' font-size='13'><text x='40' y='25'>  A B</text><text x='40' y='45'>+ B A</text><line x1='35' y1='52' x2='110' y2='52' stroke='#333'/><rect x='75' y='10' width='22' height='60' fill='none' stroke='#dc2626' stroke-dasharray='3 2'/><text x='115' y='30' font-size='8' fill='#dc2626'>units first</text></svg>" }],
      common_misconceptions: ["Allowing a leading digit to be 0 (the first digit of a multi-digit number can't be 0).", "Forgetting to carry from the units column into the tens.", "Assigning the same digit to two different letters (usually disallowed).", "Guessing randomly instead of reasoning from the most-constrained column."],
      shortcuts_and_tricks: ["Always start from the UNITS column — it has no incoming carry.", "A column sum over 9 carries 1 to the left; use this to pin digits down.", "Leading digit ≠ 0; use parity/units facts (e.g. A+A is even) to narrow options."],
      when_to_use_this_method: "Use logical column analysis for any letters-for-digits (cryptarithm) puzzle — addition or simple multiplication of disguised numbers.",
      edge_cases: ["Some puzzles have a UNIQUE solution; others may allow a few — find all consistent ones.", "A carry can be 0 or 1 in addition (and up to a few in multiplication).", "If a deduction forces a leading digit to 0, that branch is invalid — backtrack."],
      key_takeaway: "In cryptarithms each letter is a fixed digit (same letter = same digit, different letters usually different, leading digit ≠ 0). Solve by logic starting from the units column and tracking carries leftward — deduction, not guesswork.",
      video_script_hooks: ["Opening: 'A + A = 8. What's A? These letters-for-digits puzzles are pure logic — and surprisingly addictive.'", "Mid: 'Always start at the units column — it has no carry coming in, so it gives the most away.'", "Closing: 'The first digit of a number is never zero. That one rule cracks half these puzzles.'"],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch16 (Playing with Numbers): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
