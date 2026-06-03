/**
 * AP SSC Class 8 Mathematics — Chapter 12: Exponents and Powers
 * 3 topics. topicId: ap_ssc_math8_ch12_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch12.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch12_negative_exponents",
    subject: "Mathematics",
    chapterNumber: 12,
    name: "Powers with Negative Exponents",
    prerequisite_knowledge: [
      "Positive integer exponents (aⁿ = a × a × … n times)",
      "Reciprocal of a number",
      "Pattern of dividing by the base when the exponent drops",
      "Fractions",
    ],
    key_formulas: [
      "a⁻ⁿ = 1/aⁿ  (a ≠ 0)",
      "a⁰ = 1  (a ≠ 0)",
      "(a/b)⁻ⁿ = (b/a)ⁿ",
      "1/a⁻ⁿ = aⁿ",
    ],
    teaching_content: {
      intuition: "Watch the pattern of powers of 2 as the exponent falls: 2³=8, 2²=4, 2¹=2, 2⁰=1 — each step DIVIDES by 2. Keep going: 2⁻¹ = 1/2, 2⁻² = 1/4. A negative exponent simply means 'take the reciprocal' — it flips the number into a fraction. This single idea extends exponents from whole numbers to all integers.",
      derivation: "Each time the exponent decreases by 1, we divide by the base: 2³→2²→2¹→2⁰ each ÷2. Continuing below zero, 2⁰=1, so 2⁻¹ = 1÷2 = 1/2, and 2⁻² = 1/2² = 1/4. In general a⁻ⁿ = 1/aⁿ. \nWhy a⁰ = 1? Because aⁿ/aⁿ = 1 and by the quotient law aⁿ/aⁿ = aⁿ⁻ⁿ = a⁰, so a⁰ = 1. The negative-exponent rule keeps all the laws of exponents working consistently.",
      worked_example: "Evaluate 5⁻², (2/3)⁻², and 3⁰ + 4⁻¹.\n\n5⁻² = 1/5² = 1/25.\n(2/3)⁻² = (3/2)² = 9/4 (flip the fraction, drop the minus).\n3⁰ + 4⁻¹ = 1 + 1/4 = 5/4.",
      visual_description: "A descending power table: 2³=8, 2²=4, 2¹=2, 2⁰=1, 2⁻¹=½, 2⁻²=¼, with ÷2 arrows between every row showing the smooth continuation past zero into reciprocals.",
      svg_diagrams: [
        { title: "Powers of 2 descending into negative exponents",
          svg_code: "<svg viewBox='0 0 160 130' xmlns='http://www.w3.org/2000/svg' font-family='monospace' font-size='11'><text x='20' y='20'>2³ = 8</text><text x='20' y='40'>2² = 4</text><text x='20' y='60'>2¹ = 2</text><text x='20' y='80'>2⁰ = 1</text><text x='20' y='100'>2⁻¹ = 1/2</text><text x='20' y='120'>2⁻² = 1/4</text><text x='110' y='50' font-size='9' fill='#dc2626'>÷2</text><text x='110' y='90' font-size='9' fill='#dc2626'>÷2</text></svg>" }
      ],
      common_misconceptions: [
        "Thinking a negative exponent makes the number NEGATIVE (2⁻² = 1/4, not −4).",
        "Forgetting a⁰ = 1 (for any non-zero a).",
        "Not flipping the fraction for (a/b)⁻ⁿ → (b/a)ⁿ.",
        "Treating a⁻ⁿ as a × (−n) instead of 1/aⁿ.",
      ],
      shortcuts_and_tricks: [
        "Negative exponent = reciprocal: a⁻ⁿ = 1/aⁿ. A factor with a negative power just moves across the fraction bar.",
        "(a/b)⁻ⁿ = (b/a)ⁿ — flip the fraction and drop the sign.",
        "Anything (nonzero) to the power 0 is 1.",
      ],
      when_to_use_this_method: "Use negative exponents to write reciprocals compactly, simplify expressions with powers in denominators, and as the basis for standard form of small numbers (next topic).",
      edge_cases: [
        "0⁰ and 0 to a negative power are undefined (division by zero).",
        "1⁻ⁿ = 1 for any n; (−1)⁻ⁿ alternates between 1 and −1.",
        "A negative base with a negative exponent: (−2)⁻² = 1/(−2)² = 1/4.",
      ],
      key_takeaway: "A negative exponent means reciprocal: a⁻ⁿ = 1/aⁿ (a ≠ 0), and a⁰ = 1. For fractions, (a/b)⁻ⁿ = (b/a)ⁿ. Negative exponents don't make numbers negative — they make them reciprocals, extending exponents to all integers consistently.",
      video_script_hooks: [
        "Opening: 'What is 2 to the power MINUS two? Not minus four — it's one quarter. Here's the pattern that proves it.'",
        "Mid: 'Every step down the exponent ladder divides by the base. Walk it past zero and you land on reciprocals.'",
        "Closing: 'Flip a fraction to make its exponent positive. The minus sign just means 'reciprocal'.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch12_laws_of_exponents",
    subject: "Mathematics",
    chapterNumber: 12,
    name: "Laws of Exponents",
    prerequisite_knowledge: [
      "Positive and negative exponents",
      "Multiplying and dividing powers of the same base",
      "a⁰ = 1 and a⁻ⁿ = 1/aⁿ",
      "Prime factorisation",
    ],
    key_formulas: [
      "aᵐ × aⁿ = aᵐ⁺ⁿ  (same base: ADD exponents)",
      "aᵐ ÷ aⁿ = aᵐ⁻ⁿ  (same base: SUBTRACT exponents)",
      "(aᵐ)ⁿ = aᵐⁿ  (power of a power: MULTIPLY exponents)",
      "(ab)ᵐ = aᵐbᵐ  and  (a/b)ᵐ = aᵐ/bᵐ",
    ],
    teaching_content: {
      intuition: "The laws of exponents are bookkeeping rules so you never have to write out long repeated multiplications. Multiplying same-base powers? Add the exponents. Dividing? Subtract. A power of a power? Multiply. These rules (which now work for negative exponents too) turn messy expressions into a single tidy power.",
      derivation: "Product: aᵐ·aⁿ = (a…m times)(a…n times) = a…(m+n) times = aᵐ⁺ⁿ. \nQuotient: aᵐ/aⁿ cancels n a's from m a's → aᵐ⁻ⁿ. \nPower of power: (aᵐ)ⁿ = aᵐ repeated n times = aᵐⁿ. \nDistribution over product: (ab)ᵐ = aᵐbᵐ. \nThese were proved for positive exponents but, thanks to a⁰=1 and a⁻ⁿ=1/aⁿ, they hold for ALL integer exponents — which is what makes them so powerful.",
      worked_example: "Simplify (a) 2³ × 2⁴ ÷ 2⁵, and (b) (3²)³ × 3⁻⁴.\n\n(a) 2³⁺⁴⁻⁵ = 2² = 4.\n(b) (3²)³ = 3⁶; then 3⁶ × 3⁻⁴ = 3⁶⁻⁴ = 3² = 9.",
      visual_description: "A 'rules card' listing the four laws with mini-examples beside each: aᵐaⁿ=aᵐ⁺ⁿ (2²·2³=2⁵), aᵐ/aⁿ=aᵐ⁻ⁿ (2⁵/2²=2³), (aᵐ)ⁿ=aᵐⁿ ((2²)³=2⁶), (ab)ᵐ=aᵐbᵐ.",
      svg_diagrams: [
        { title: "The laws of exponents at a glance",
          svg_code: "<svg viewBox='0 0 220 110' xmlns='http://www.w3.org/2000/svg' font-family='monospace' font-size='11'><text x='10' y='22'>aᵐ·aⁿ = aᵐ⁺ⁿ   (add)</text><text x='10' y='44'>aᵐ÷aⁿ = aᵐ⁻ⁿ   (subtract)</text><text x='10' y='66'>(aᵐ)ⁿ = aᵐⁿ    (multiply)</text><text x='10' y='88'>(ab)ᵐ = aᵐbᵐ</text></svg>" }
      ],
      common_misconceptions: [
        "MULTIPLYING exponents when multiplying powers (2²·2³ = 2⁵, not 2⁶).",
        "Adding exponents for a power of a power (it's (2²)³ = 2⁶, multiply).",
        "Applying the laws across DIFFERENT bases (2³·3² does NOT combine into one power).",
        "Mishandling signs when exponents are negative (aᵐ÷aⁿ = aᵐ⁻ⁿ, watch the subtraction).",
      ],
      shortcuts_and_tricks: [
        "Same base × → add; ÷ → subtract; nested power → multiply. (Memorise the three verbs.)",
        "Bring everything to a single base where possible (e.g. write 8 as 2³, 9 as 3²).",
        "Move negative-power factors across the fraction bar to make exponents positive, then apply the laws.",
      ],
      when_to_use_this_method: "Use the laws to simplify any expression involving powers of the same base — multiplying, dividing, raising to a power — including those with negative or zero exponents.",
      edge_cases: [
        "Laws apply only to the SAME base; different bases must be combined separately or via prime factorisation.",
        "(a + b)ᵐ does NOT equal aᵐ + bᵐ (the laws are for products/quotients, not sums).",
        "Zero base with non-positive exponent is undefined.",
      ],
      key_takeaway: "Same base: multiply → ADD exponents (aᵐaⁿ=aᵐ⁺ⁿ), divide → SUBTRACT (aᵐ⁻ⁿ), power of a power → MULTIPLY ((aᵐ)ⁿ=aᵐⁿ); and (ab)ᵐ=aᵐbᵐ. These hold for all integer exponents. Combine to a single base to simplify; the laws never apply across sums or different bases.",
      video_script_hooks: [
        "Opening: 'Three little verbs run all of exponents: multiply → ADD, divide → SUBTRACT, power-of-a-power → MULTIPLY.'",
        "Mid: '2 squared times 2 cubed is 2 to the FIFTH — add the powers. The number-one slip is multiplying them.'",
        "Closing: 'Different bases don't mix. Rewrite everything as powers of ONE base, then the laws take over.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch12_standard_form",
    subject: "Mathematics",
    chapterNumber: 12,
    name: "Standard Form (Scientific Notation)",
    prerequisite_knowledge: [
      "Powers of 10 (positive and negative)",
      "Negative exponents (10⁻ⁿ = 1/10ⁿ)",
      "Moving the decimal point when multiplying/dividing by 10",
      "Place value",
    ],
    key_formulas: [
      "Standard form: a × 10ⁿ where 1 ≤ a < 10 and n is an integer",
      "Large number → POSITIVE power of 10; small number (<1) → NEGATIVE power",
      "n = number of places the decimal point moves (right = negative, left = positive… see rule)",
      "To compare/multiply huge or tiny numbers, work with the powers of 10",
    ],
    teaching_content: {
      intuition: "Astronomers and scientists deal with numbers like 300,000,000 m/s or 0.0000000016. Writing all those zeros is error-prone, so we use STANDARD FORM: a single digit before the decimal point, times a power of 10. The power of 10 just counts how many places the decimal moved — positive for big numbers, negative for tiny ones.",
      derivation: "Write the number as a × 10ⁿ with 1 ≤ a < 10. \nFor a LARGE number, move the decimal point LEFT until one non-zero digit remains before it; the number of places moved is the POSITIVE exponent. e.g. 47000 → 4.7 × 10⁴ (moved 4 left). \nFor a SMALL number (less than 1), move the decimal point RIGHT until one non-zero digit is before it; the places moved give a NEGATIVE exponent. e.g. 0.0035 → 3.5 × 10⁻³ (moved 3 right).",
      worked_example: "Write 5,90,00,000 and 0.000072 in standard form, and express 3.2 × 10⁻⁴ as an ordinary number.\n\n59000000 → 5.9 × 10⁷ (decimal moved 7 places left).\n0.000072 → 7.2 × 10⁻⁵ (decimal moved 5 places right).\n3.2 × 10⁻⁴ = 0.00032 (move the point 4 places left).",
      visual_description: "A number line of scale: 4.7×10⁴ shown expanding to 47000 (arrow moving decimal 4 right), and 3.5×10⁻³ expanding to 0.0035 (arrow moving decimal 3 left), with the exponent labelled as the count of places.",
      svg_diagrams: [
        { title: "Standard form: a × 10ⁿ (1 ≤ a < 10)",
          svg_code: "<svg viewBox='0 0 220 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><text x='10' y='25'>47000 = 4.7 × 10⁴</text><text x='10' y='50'>0.0035 = 3.5 × 10⁻³</text><text x='10' y='72' font-size='8' fill='#16a34a'>big → +power, small → −power</text></svg>" }
      ],
      common_misconceptions: [
        "Leaving 'a' outside 1 ≤ a < 10 (e.g. 47 × 10³ is not standard form; should be 4.7 × 10⁴).",
        "Getting the SIGN of the exponent wrong (small numbers need NEGATIVE powers).",
        "Miscounting the number of decimal places moved.",
        "Forgetting standard form requires exactly one non-zero digit before the decimal point.",
      ],
      shortcuts_and_tricks: [
        "Count the places the decimal point moves: that count is the exponent (sign: big→+, small→−).",
        "Check 'a' is between 1 and 10 — exactly one digit before the point.",
        "To convert back, move the decimal n places (right if +n, left if −n).",
      ],
      when_to_use_this_method: "Use standard form to write, compare and compute with very large or very small numbers (distances in space, sizes of atoms, populations) compactly and without long strings of zeros.",
      edge_cases: [
        "A number already between 1 and 10 has exponent 0 (e.g. 7 = 7 × 10⁰).",
        "Multiplying standard forms: multiply the a's and ADD the powers of 10, then re-normalise a to [1,10).",
        "Negative numbers keep their sign on a: −4.7 × 10⁴.",
      ],
      key_takeaway: "Standard form writes any number as a × 10ⁿ with 1 ≤ a < 10; the exponent n counts decimal-point moves — positive for large numbers, negative for numbers below 1. It makes huge and tiny quantities compact and easy to compare and multiply (multiply a's, add powers).",
      video_script_hooks: [
        "Opening: 'The speed of light is 300 million m/s. Writing eight zeros is asking for mistakes — so scientists write 3 × 10⁸.'",
        "Mid: 'The power of ten just counts how far the decimal point hops. Big numbers hop left (positive); tiny ones hop right (negative).'",
        "Closing: 'Always keep one digit before the point — 4.7 × 10⁴, never 47 × 10³.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch12 (Exponents and Powers): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
