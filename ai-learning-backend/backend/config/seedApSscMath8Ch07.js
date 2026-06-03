/**
 * AP SSC Class 8 Mathematics — Chapter 7: Cubes and Cube Roots
 * 2 topics. topicId: ap_ssc_math8_ch7_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch07.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch7_cubes",
    subject: "Mathematics",
    chapterNumber: 7,
    name: "Cubes and Their Properties",
    prerequisite_knowledge: [
      "Multiplying a number by itself three times",
      "Prime factorisation",
      "Square numbers (for contrast)",
      "Sum of consecutive odd numbers",
    ],
    key_formulas: [
      "Cube of n = n³ = n × n × n",
      "A perfect cube's prime factorisation has every prime in a multiple of 3",
      "Sum of first n odd numbers gives squares; cubes relate as 1³+2³+…+n³ = (1+2+…+n)²",
      "Smallest multiplier/divisor to make a perfect cube = product of primes whose exponent is not a multiple of 3",
    ],
    teaching_content: {
      intuition: "A cube number is the volume of a cube: 3³ = 27 unit cubes fill a 3×3×3 box. Just as squares pair primes, cubes need primes in TRIPLES. Knowing the cube pattern lets you spot perfect cubes and fix non-cubes by multiplying or dividing by the missing factors.",
      derivation: "If N is a perfect cube, N = m³, so every prime in m appears three times as often in N — every prime exponent in N is a multiple of 3. Group the prime factors in TRIPLES; if any prime is left with 1 or 2 copies, N is not a perfect cube. The leftover primes (to reach the next multiple of 3) are exactly what you multiply by to make N a cube.\nFun identity: 1³ = 1, 1³+2³ = 9 = 3², 1³+2³+3³ = 36 = 6² — the sum of the first n cubes is the SQUARE of the sum of the first n numbers.",
      worked_example: "Is 1728 a perfect cube? Find the smallest number to multiply 392 by to get a perfect cube.\n\n1728 = 2×2×2×2×2×2×3×3×3 = (2³)(2³)(3³). All in triples → 1728 = 12³. Perfect cube ✓.\n392 = 2×2×2×7×7 = (2³)(7²). The 7 appears twice; needs one more to make 7³. Multiply by 7: 392×7 = 2744 = 14³. Smallest multiplier = 7.",
      visual_description: "A 3×3×3 stack of unit cubes (27 small cubes) labelled 3³ = 27, beside a prime-factor grouping of 1728 into three triples (2,2,2)(2,2,2)(3,3,3).",
      svg_diagrams: [
        { title: "Perfect cube: primes group in triples (1728 = 12³)",
          svg_code: "<svg viewBox='0 0 240 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='10' y='25'>1728 = (2·2·2)(2·2·2)(3·3·3)</text><text x='10' y='50' fill='#16a34a'>= 12³  (all in triples)</text></svg>" }
      ],
      common_misconceptions: [
        "Pairing primes (as for squares) instead of TRIPLING them for cubes.",
        "Thinking a number ending in a particular digit can't be a cube — cubes can end in ANY digit 0–9.",
        "Confusing n³ with 3n (cube vs triple).",
        "Assuming a perfect square is also a perfect cube — only special numbers (like 64) are both.",
      ],
      shortcuts_and_tricks: [
        "Exponent test: N is a perfect cube ⟺ every prime's exponent is a multiple of 3.",
        "Smallest multiplier/divisor to reach a cube = primes needed to round each exponent to a multiple of 3.",
        "Memorise small cubes: 1,8,27,64,125,216,343,512,729,1000.",
      ],
      when_to_use_this_method: "Use the triple-grouping/exponent test to identify perfect cubes and to solve 'smallest number to multiply/divide to make a perfect cube' problems.",
      edge_cases: [
        "Negative cubes are negative: (−3)³ = −27 (unlike squares, cubes keep the sign).",
        "0 and 1 are perfect cubes.",
        "64 = 4³ = 8² is both a perfect cube and a perfect square.",
      ],
      key_takeaway: "A perfect cube n³ has every prime exponent a multiple of 3 (primes group in triples). Cubes can end in any digit and keep the sign of the base. The leftover primes to reach a multiple of 3 give the smallest multiplier/divisor to make a perfect cube.",
      video_script_hooks: [
        "Opening: '27 little cubes stack into one big 3×3×3 cube. That's why we call 27 a cube number.'",
        "Mid: 'Squares pair primes; cubes need them in threes. Get one short and it's not a cube.'",
        "Closing: 'Cubes keep their sign — minus three cubed is minus twenty-seven. Squares can't do that.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch7_cube_roots",
    subject: "Mathematics",
    chapterNumber: 7,
    name: "Cube Roots by Prime Factorisation",
    prerequisite_knowledge: [
      "Cubes and the triple-grouping property",
      "Prime factorisation",
      "Meaning of cube root (∛(n³) = n)",
      "Small cubes 1 to 1000",
    ],
    key_formulas: [
      "∛(a × b) = ∛a × ∛b",
      "∛N = take ONE prime from each TRIPLE of identical primes",
      "Estimating: a cube of d digits has a cube root of about ceil(d/3) digits",
      "Unit-digit shortcut: the last digit of a cube fixes the last digit of its cube root",
    ],
    teaching_content: {
      intuition: "Cube roots undo cubing. By prime factorisation it's the same socks-into-groups idea as square roots, but now in groups of THREE: break the number into primes, bundle identical primes in triples, and take one from each triple. For perfect cubes there's also a lightning trick using the last digit and the leading group.",
      derivation: "If N = m³, prime-factorise N; every prime appears a multiple of 3 times. Take ONE prime from each triple and multiply — that's ∛N.\nExample: 3375 = 3×3×3×5×5×5 = (3³)(5³). One per triple: 3×5 = 15 = ∛3375.\nUnit-digit trick (for perfect cubes): cubes of 0–9 end in 0,1,8,7,4,5,6,3,2,9 respectively. The last digit of N tells you the last digit of ∛N (e.g. cube ends in 7 ⟹ root ends in 3).",
      worked_example: "Find ∛13824 by prime factorisation, and use the unit-digit trick to predict its last digit.\n\nLast digit of 13824 is 4 → cube root ends in 4.\n13824 = 2×2×2×2×2×2×2×2×2×3×3×3 = (2³)(2³)(2³)(3³). One per triple: 2×2×2×3 = 24. So ∛13824 = 24 (and indeed ends in 4 ✓).",
      visual_description: "Prime factorisation of 3375 bundled into two triples (3,3,3) and (5,5,5), with one prime pulled from each triple combining into 3×5 = 15.",
      svg_diagrams: [
        { title: "Cube root by triples: ∛3375 = 15",
          svg_code: "<svg viewBox='0 0 240 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='10' y='25'>3375 = (3·3·3)(5·5·5)</text><text x='10' y='50' fill='#16a34a'>∛3375 = 3·5 = 15</text></svg>" }
      ],
      common_misconceptions: [
        "Taking one prime per PAIR (square-root habit) instead of per triple.",
        "Forgetting that an incomplete triple means N is not a perfect cube.",
        "Misapplying the unit-digit trick to non-cubes.",
        "Splitting ∛(a+b) as ∛a + ∛b (only products split).",
      ],
      shortcuts_and_tricks: [
        "Unit-digit map: cube ending 1→1, 8→2, 7→3, 4→4, 5→5, 6→6, 3→7, 2→8, 9→9, 0→0.",
        "For a perfect cube up to 6 digits, split into the last 3 digits (gives the units digit) and the rest (gives the tens digit) — fast mental cube roots.",
        "Estimate: digits of N ÷ 3 (rounded up) = digits of ∛N.",
      ],
      when_to_use_this_method: "Use prime factorisation for cube roots of perfect cubes, and the unit-digit / split-the-digits trick for fast mental cube roots of perfect cubes in exams.",
      edge_cases: [
        "Cube root of a negative perfect cube is negative: ∛(−64) = −4.",
        "Non-perfect cubes have irrational cube roots (estimate or use a calculator at this level).",
        "∛1 = 1, ∛0 = 0.",
      ],
      key_takeaway: "Cube-root by prime factorisation: bundle identical primes in TRIPLES and take one from each triple. For perfect cubes, the unit-digit map and the split-the-digits method give the answer almost instantly. Cube roots keep the sign of the number.",
      video_script_hooks: [
        "Opening: 'I'll find the cube root of 13824 in my head. Last digit 4 → root ends in 4. The rest gives 2. Answer: 24.'",
        "Mid: 'Square roots pair primes; cube roots take one from each TRIPLE. Same idea, groups of three.'",
        "Closing: 'Negative? No problem. Cube roots keep the sign — the cube root of −64 is −4.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch7 (Cubes and Cube Roots): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
