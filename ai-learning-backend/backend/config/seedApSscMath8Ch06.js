/**
 * AP SSC Class 8 Mathematics — Chapter 6: Squares and Square Roots
 * 4 topics. topicId: ap_ssc_math8_ch6_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch06.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch6_properties_of_squares",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Square Numbers and Their Properties",
    prerequisite_knowledge: [
      "Multiplication of a number by itself",
      "Even and odd numbers",
      "Unit (ones) digit of a number",
      "Recognising perfect squares 1, 4, 9, 16, 25 …",
    ],
    key_formulas: [
      "A perfect square = n × n = n² for some natural number n",
      "Square numbers end only in 0, 1, 4, 5, 6 or 9 (never 2, 3, 7, 8)",
      "Sum of first n odd numbers = n² (1+3+5+…+(2n−1) = n²)",
      "A perfect square has an EVEN number of zeros at the end (if any)",
    ],
    teaching_content: {
      intuition: "A square number is literally the area of a square: 5 × 5 = 25 dots fill a 5-by-5 grid. Square numbers hide neat patterns — they only ever end in certain digits, and adding up consecutive odd numbers magically builds them. Spotting these patterns lets you check answers and recognise non-squares instantly.",
      derivation: "Why odd numbers build squares: a 1×1 square has 1 dot. To grow it to 2×2 you add an L-shaped border of 3 dots (now 4). To reach 3×3 you add an L of 5 dots (now 9). Each new border is the next odd number, so 1 + 3 + 5 + … + (2n−1) = n². \nWhy squares can't end in 2,3,7,8: square the unit digits 0–9 and look at the last digit of each result — you only ever get 0,1,4,5,6,9. So any number ending in 2,3,7,8 is NOT a perfect square.",
      worked_example: "Without computing, decide if 4358 can be a perfect square. Also find 1+3+5+7+9+11 using the odd-number rule.\n\n4358 ends in 8 — but squares never end in 8. So 4358 is NOT a perfect square.\n1+3+5+7+9+11 is the sum of the first 6 odd numbers = 6² = 36.",
      visual_description: "A growing dot square: 1 dot, then an L of 3 around it (2×2), then an L of 5 (3×3), then 7 (4×4) — each L labelled with its odd number, the running totals 1, 4, 9, 16 shown as perfect squares.",
      svg_diagrams: [
        { title: "Sum of odd numbers builds squares (1+3+5+7 = 16)",
          svg_code: "<svg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'><g><rect x='20' y='20' width='30' height='30' fill='#bfdbfe'/><rect x='50' y='20' width='30' height='30' fill='#93c5fd'/><rect x='20' y='50' width='30' height='30' fill='#93c5fd'/><rect x='80' y='20' width='30' height='30' fill='#60a5fa'/><rect x='80' y='50' width='30' height='30' fill='#60a5fa'/><rect x='20' y='80' width='30' height='30' fill='#60a5fa'/><rect x='50' y='80' width='30' height='30' fill='#60a5fa'/><rect x='80' y='80' width='30' height='30' fill='#60a5fa'/><rect x='110' y='20' width='30' height='30' fill='#3b82f6'/><rect x='110' y='50' width='30' height='30' fill='#3b82f6'/><rect x='110' y='80' width='30' height='30' fill='#3b82f6'/><rect x='20' y='110' width='30' height='30' fill='#3b82f6'/><rect x='50' y='110' width='30' height='30' fill='#3b82f6'/><rect x='80' y='110' width='30' height='30' fill='#3b82f6'/><rect x='110' y='110' width='30' height='30' fill='#3b82f6'/></g><text x='150' y='30' font-family='sans-serif' font-size='9'>1</text><text x='150' y='130' font-family='sans-serif' font-size='9'>=16</text></svg>" }
      ],
      common_misconceptions: [
        "Thinking any number ending in a 'square-friendly' digit IS a square — ending in 6 is necessary, not sufficient (26 isn't a square).",
        "Believing squares can end in 2, 3, 7 or 8 — they never do.",
        "Forgetting a perfect square has an even count of trailing zeros (100 = 10² ✓, 1000 is not a square).",
        "Confusing 'square of n' (n²) with 'square root of n' (√n).",
      ],
      shortcuts_and_tricks: [
        "Reject non-squares fast: if it ends in 2, 3, 7 or 8, it's not a perfect square.",
        "Sum of first n odd numbers = n² — quick mental squares and a neat check.",
        "Number of perfect squares between a² and b² is (b − a) − 1 (the integers strictly between a and b).",
      ],
      when_to_use_this_method: "Use the digit/parity properties to QUICKLY rule out non-squares and to verify computed squares, and the odd-number identity for mental squaring and pattern questions.",
      edge_cases: [
        "0 and 1 are perfect squares (0², 1²).",
        "Between consecutive squares n² and (n+1)² there are exactly 2n non-square numbers.",
        "A square's last digit being 0,1,4,5,6,9 is necessary but NOT sufficient for being a square.",
      ],
      key_takeaway: "Perfect squares are n²; they end only in 0,1,4,5,6,9 and have an even number of trailing zeros. The sum of the first n odd numbers equals n². Use the ending-digit rule to instantly reject non-squares.",
      video_script_hooks: [
        "Opening: 'Is 4358 a perfect square? You can answer in one second — without any calculation.'",
        "Mid: 'Add the odd numbers 1, 3, 5, 7 … and perfect squares appear like magic. Here's why.'",
        "Closing: 'No square ever ends in 2, 3, 7 or 8. That single fact kills half the wrong answers in an exam.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch6_finding_squares",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Finding Squares of Numbers",
    prerequisite_knowledge: [
      "Square numbers and the identity (a+b)² ",
      "Place value (tens and ones)",
      "Multiplication of two-digit numbers",
      "Distributive law",
    ],
    key_formulas: [
      "(a + b)² = a² + 2ab + b²",
      "(a − b)² = a² − 2ab + b²",
      "Square of a number ending in 5: (10a+5)² = a(a+1) hundreds + 25  → e.g. 35² = 3·4|25 = 1225",
      "Squares of consecutive numbers differ by an odd number: (n+1)² − n² = 2n+1",
    ],
    teaching_content: {
      intuition: "You don't always need long multiplication to square a number. Splitting a number into convenient parts (tens + ones) and using (a+b)² turns a hard square into easy pieces. Numbers ending in 5 have a one-line shortcut, and you can hop from one square to the next by adding the right odd number.",
      derivation: "Why the 'ending-in-5' trick works: a number ending in 5 is 10a + 5. Square it:\n(10a+5)² = 100a² + 2·10a·5 + 25 = 100a² + 100a + 25 = 100·a(a+1) + 25.\nSo write a(a+1), then stick 25 on the end. e.g. 65²: a=6, a(a+1)=6·7=42 → 4225.\nThe (a+b)² expansion is just the distributive law applied to (a+b)(a+b).",
      worked_example: "Find 52² using (a+b)² and 85² using the ending-in-5 shortcut.\n\n52² = (50+2)² = 50² + 2·50·2 + 2² = 2500 + 200 + 4 = 2704.\n85²: a = 8, a(a+1) = 8·9 = 72, append 25 → 7225.",
      visual_description: "A square of side (50+2) divided into four regions: a 50×50 block (2500), two 50×2 strips (100 each), and a tiny 2×2 corner (4), visually showing (a+b)² = a² + 2ab + b².",
      svg_diagrams: [
        { title: "(a+b)² as four areas: 50²+2·50·2+2²",
          svg_code: "<svg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><rect x='15' y='15' width='100' height='100' fill='#bfdbfe' stroke='#2563eb'/><rect x='115' y='15' width='20' height='100' fill='#fde68a' stroke='#d97706'/><rect x='15' y='115' width='100' height='20' fill='#fde68a' stroke='#d97706'/><rect x='115' y='115' width='20' height='20' fill='#fecaca' stroke='#dc2626'/><text x='50' y='70'>2500</text><text x='118' y='70'>100</text><text x='55' y='128'>100</text><text x='116' y='130'>4</text></svg>" }
      ],
      common_misconceptions: [
        "Writing (a+b)² = a² + b² (forgetting the 2ab middle term).",
        "Applying the ending-in-5 trick to numbers NOT ending in 5.",
        "Errors in place value when recombining the parts (e.g. dropping a zero on 100a).",
        "Confusing (a−b)² sign of the middle term — it is MINUS 2ab.",
      ],
      shortcuts_and_tricks: [
        "Ending in 5: a(a+1) then append 25. (25²=625, 45²=2025, 95²=9025.)",
        "Square near 50: 50±k → 2500 ± 100k + k² (e.g. 53² = 2500+300+9 = 2809).",
        "Next square: (n+1)² = n² + (2n+1). (So 31² = 30² + 61 = 961.)",
      ],
      when_to_use_this_method: "Use (a±b)² for fast mental squaring by splitting into round numbers, the ending-in-5 rule for any number ending in 5, and the consecutive-square jump when you already know a nearby square.",
      edge_cases: [
        "Three-digit numbers: split as (hundreds + rest), same (a+b)² idea.",
        "The (a−b)² form is handy for numbers just below a round number (e.g. 98² = (100−2)²).",
        "Negative numbers square to positive: (−7)² = 49.",
      ],
      key_takeaway: "Square numbers quickly by splitting them: (a+b)² = a²+2ab+b² (never forget the 2ab). Numbers ending in 5 use a(a+1) followed by 25. Adjacent squares differ by the odd number 2n+1.",
      video_script_hooks: [
        "Opening: 'Square 85 in your head in three seconds. Ready? 72… 25. There: 7225.'",
        "Mid: 'The middle term 2ab is where everyone trips. (a+b)² is NOT a² + b².'",
        "Closing: 'Split any number into round parts and squaring becomes addition of easy pieces.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch6_roots_by_factorisation",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Square Roots by Prime Factorisation",
    prerequisite_knowledge: [
      "Prime factorisation of a number",
      "Meaning of square root (√(n²) = n)",
      "Pairing identical factors",
      "Perfect squares",
    ],
    key_formulas: [
      "√(a × b) = √a × √b",
      "In a perfect square's prime factorisation, every prime appears an EVEN number of times",
      "√N = product of one factor from each identical PAIR",
      "Smallest multiplier/divisor to make N a perfect square = product of the UNPAIRED primes",
    ],
    teaching_content: {
      intuition: "Finding a square root by prime factorisation is like sorting socks into pairs. Break the number into primes, pair up identical primes, and take ONE sock from each pair — multiply those together and you have the square root. If a prime is left without a partner, the number isn't a perfect square (and that lone prime tells you what to multiply/divide by to fix it).",
      derivation: "If N is a perfect square, N = m². Then every prime in m appears twice as often in m² — so all prime exponents in N are even. To take the root, halve every exponent: √N takes one factor from each pair.\nExample: 144 = 2×2×2×2×3×3 = (2×2)×(2×2)... pair them: (2,2)(2,2)(3,3). One from each pair: 2×2×3 = 12 = √144.",
      worked_example: "Find √324 by prime factorisation, and the smallest number to multiply 48 by to make it a perfect square.\n\n324 = 2×2×3×3×3×3 = (2,2)(3,3)(3,3). One from each pair: 2×3×3 = 18. So √324 = 18.\n48 = 2×2×2×2×3 = (2,2)(2,2)(3). The 3 is unpaired → multiply by 3 to pair it: 48×3 = 144 = 12². Smallest multiplier = 3.",
      visual_description: "A factor tree of 324 ending in primes 2,2,3,3,3,3, with the primes circled in pairs and arrows pulling one prime from each pair down into the product 2×3×3 = 18.",
      svg_diagrams: [
        { title: "Pairing primes to find √324 = 18",
          svg_code: "<svg viewBox='0 0 240 90' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='10' y='25'>324 = 2·2·3·3·3·3</text><text x='10' y='50'>pairs: (2,2)(3,3)(3,3)</text><text x='10' y='75' fill='#16a34a'>√324 = 2·3·3 = 18</text></svg>" }
      ],
      common_misconceptions: [
        "Multiplying ALL the primes instead of one PER pair.",
        "Forgetting that a leftover (unpaired) prime means N is not a perfect square.",
        "Halving the number instead of halving each prime's exponent.",
        "Treating √(a+b) as √a + √b (only √(a×b) splits).",
      ],
      shortcuts_and_tricks: [
        "Write exponents: N = 2^a·3^b·… is a perfect square ⟺ all exponents even; √N halves each exponent.",
        "Smallest multiplier to make a perfect square = product of primes with ODD exponent.",
        "Smallest divisor to make a perfect square = same product of odd-exponent primes.",
      ],
      when_to_use_this_method: "Use prime factorisation for square roots of perfect squares and for 'smallest number to multiply/divide to make a perfect square' questions. For non-perfect squares or decimals, use long division (next topic).",
      edge_cases: [
        "If after pairing one prime is unpaired, the number is NOT a perfect square.",
        "1 is a perfect square (empty product) with √1 = 1.",
        "Large numbers are factorised most easily by repeated division by the smallest primes.",
      ],
      key_takeaway: "Prime-factorise, pair identical primes, take one from each pair and multiply → that's the square root. All exponents even ⟺ perfect square; any odd-exponent prime is what you multiply or divide by to make it a perfect square.",
      video_script_hooks: [
        "Opening: 'Finding a square root is just sorting socks into pairs — take one sock from each pair and you're done.'",
        "Mid: 'A leftover prime with no partner? The number isn't a perfect square — and that lone prime is your fix.'",
        "Closing: 'Halve every exponent in the prime factorisation and the square root falls out.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch6_roots_by_division",
    subject: "Mathematics",
    chapterNumber: 6,
    name: "Square Roots by Long Division (incl. Decimals)",
    prerequisite_knowledge: [
      "Square roots by prime factorisation",
      "Long division procedure",
      "Place value and grouping digits",
      "Decimals and rounding",
    ],
    key_formulas: [
      "Group digits in pairs from the decimal point (left for integer part, right for decimal part)",
      "Number of digits in √N ≈ ceil(d/2) where d = number of digits in N",
      "Each step: double the current quotient, find a digit x so that (…x) × x ≤ current remainder block",
      "For decimals, pair digits from the point in BOTH directions",
    ],
    teaching_content: {
      intuition: "Prime factorisation is great for perfect squares but hopeless for big numbers or decimals. The long-division method finds a square root digit by digit — like ordinary long division but with a doubling twist. It works for ANY number, perfect square or not, and gives decimal answers to as many places as you want.",
      derivation: "The method builds the root one digit at a time so that (partial root)² stays just under the number. Group digits in PAIRS from the decimal point. At each stage you bring down the next pair, DOUBLE the root-so-far to form a trial divisor, and choose the largest digit x with (trial divisor with x appended) × x ≤ the current number. That x is the next digit of the root. Pairing matters because each extra pair of digits in N adds exactly one digit to √N.",
      worked_example: "Find √529 by long division.\n\nGroup: 5 | 29. Largest square ≤ 5 is 2²=4, so first digit 2, remainder 1; bring down 29 → 129.\nDouble the root (2)→4. Find x: (4x)×x ≤ 129. Try x=3: 43×3 = 129 ≤ 129. ✓\nNext digit 3, remainder 0. So √529 = 23.\n\nFor √2 to 2 decimals: pair as 2.00 00; method gives 1.41…",
      visual_description: "A long-division layout for 529: digits grouped 5|29, quotient 23 building above, the doubling step (2→4, then 43×3) shown to the side, remainder reaching 0.",
      svg_diagrams: [
        { title: "Long-division square root of 529 = 23",
          svg_code: "<svg viewBox='0 0 220 100' xmlns='http://www.w3.org/2000/svg' font-family='monospace' font-size='12'><text x='40' y='20'>2 3</text><line x1='35' y1='25' x2='120' y2='25' stroke='#333'/><text x='10' y='42'>2 |</text><text x='40' y='42'>5 29</text><text x='40' y='62'>4</text><text x='40' y='82'>1 29  (43×3)</text><text x='130' y='62' fill='#16a34a' font-size='10'>√529 = 23</text></svg>" }
      ],
      common_misconceptions: [
        "Grouping digits from the LEFT instead of from the decimal point.",
        "Forgetting to DOUBLE the quotient before choosing the next divisor digit.",
        "Mis-pairing decimal digits — pair to the RIGHT of the point, adding zeros as needed.",
        "Stopping too early for decimals — add pairs of zeros to get more decimal places.",
      ],
      shortcuts_and_tricks: [
        "Digit count of √N: d digits in N → √N has ceil(d/2) digits (before the point).",
        "Estimate first (between which two perfect squares?) to sanity-check the division result.",
        "For decimals, append pairs of zeros after the point and keep dividing for more precision.",
      ],
      when_to_use_this_method: "Use long division for square roots of LARGE numbers, NON-perfect squares, and DECIMALS — anywhere prime factorisation is impractical. Use factorisation for clean perfect squares.",
      edge_cases: [
        "Perfect squares end with remainder 0; non-perfect squares never terminate — round as required.",
        "√(decimal): e.g. √0.0064 — pair from the point both ways → 0.08.",
        "Number of decimal places desired determines how many zero-pairs to bring down.",
      ],
      key_takeaway: "The long-division method finds a square root digit-by-digit for ANY number: group digits in pairs from the decimal point, and at each step double the quotient to form the next divisor. It handles big numbers, non-perfect squares and decimals to any precision.",
      video_script_hooks: [
        "Opening: 'Prime factorisation can't touch √2 or √529.7 — but long division can find them to as many decimals as you like.'",
        "Mid: 'The secret step is doubling: double your answer-so-far, then pick the next digit that fits.'",
        "Closing: 'Pair the digits from the decimal point, never from the left — get that wrong and the whole answer shifts.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch6 (Squares and Square Roots): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
