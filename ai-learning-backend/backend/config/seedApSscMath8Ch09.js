/**
 * AP SSC Class 8 Mathematics — Chapter 9: Algebraic Expressions and Identities
 * 4 topics. topicId: ap_ssc_math8_ch9_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch09.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch9_terms_and_types",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "Terms, Factors, Coefficients and Types of Expressions",
    prerequisite_knowledge: [
      "Variables and constants",
      "Multiplication of variables (x·x = x²)",
      "Idea of a term separated by + or − signs",
      "Like and unlike terms",
    ],
    key_formulas: [
      "Expression = terms joined by + or − (e.g. 3x² − 5x + 7 has 3 terms)",
      "Each term = product of factors; the numerical factor is the coefficient",
      "Monomial (1 term), Binomial (2), Trinomial (3), Polynomial (one or more)",
      "Like terms have the SAME variables with the SAME powers (5x², −2x² are like)",
    ],
    teaching_content: {
      intuition: "An algebraic expression is built from terms — chunks separated by plus or minus signs. Each term is a product of factors (numbers and letters multiplied together), and the number in front is the coefficient. Classifying expressions by their number of terms (mono/bi/tri) and recognising LIKE terms is the vocabulary you need before you can add, subtract or simplify anything.",
      derivation: "Take 3x² − 5x + 7. The + and − signs cut it into 3 TERMS: 3x², −5x, +7. \n• Factors of the term 3x²: 3, x, x (so 3x² = 3·x·x). The numerical factor 3 is the COEFFICIENT of x². \n• Like terms share identical variable parts: 3x² and 9x² are like (both x²); 3x² and 3x are UNLIKE (different powers). Only like terms can be combined, because 3x² + 9x² = 12x² but 3x² + 3x stays as is.",
      worked_example: "In 7xy − 4x²y + 9 − x, identify terms, the coefficient of x²y, and classify the expression.\n\nTerms: 7xy, −4x²y, +9, −x → 4 terms. \nCoefficient of x²y = −4 (the number multiplying x²y, with its sign). \n4 terms → it's a polynomial (more than 3 terms, no special name beyond 'polynomial'). \nLike terms here: none of the variable terms match (xy, x²y, x are all different).",
      visual_description: "The expression 3x² − 5x + 7 with vertical dividers showing the three terms, each term exploded into its factors below (3·x·x, −5·x, 7), and the coefficient circled in each.",
      svg_diagrams: [
        { title: "Terms, factors and coefficients of 3x² − 5x + 7",
          svg_code: "<svg viewBox='0 0 260 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='12'><text x='10' y='25'>3x²   −5x   +7</text><line x1='55' y1='12' x2='55' y2='35' stroke='#999'/><line x1='130' y1='12' x2='130' y2='35' stroke='#999'/><text x='10' y='55' font-size='10' fill='#2563eb'>3·x·x</text><text x='70' y='55' font-size='10' fill='#2563eb'>−5·x</text><text x='135' y='55' font-size='10' fill='#2563eb'>7</text><text x='10' y='72' font-size='9' fill='#16a34a'>coeff 3, −5, (const 7)</text></svg>" }
      ],
      common_misconceptions: [
        "Dropping the sign of a coefficient — the coefficient of −5x is −5, not 5.",
        "Calling 3x² and 3x 'like terms' — different powers make them unlike.",
        "Treating a × b sign as a term separator — only + and − separate terms.",
        "Forgetting the constant term (e.g. the 7) is itself a term.",
      ],
      shortcuts_and_tricks: [
        "Count the +/− signs (plus one) to count terms quickly.",
        "Like terms = same letters, same powers — then just add the coefficients.",
        "The coefficient INCLUDES its sign; read it together with the − or +.",
      ],
      when_to_use_this_method: "Use this vocabulary to read and describe any expression before manipulating it — identifying terms and like terms is the prerequisite for addition, subtraction and simplification.",
      edge_cases: [
        "A constant (like 7) is a term with coefficient 7 and no variable.",
        "The coefficient of x in 'x' (just x) is 1; in '−x' it is −1.",
        "x²y and xy² are UNLIKE (the powers on x and y differ).",
      ],
      key_takeaway: "An expression splits into terms at + and − signs; each term is a product of factors, and the numerical factor (with its sign) is the coefficient. Classify by term count (monomial/binomial/trinomial/polynomial). Like terms share identical variable parts and can be combined.",
      video_script_hooks: [
        "Opening: 'Before you can do algebra, you need its grammar: terms, factors, coefficients. Let's decode 3x² − 5x + 7.'",
        "Mid: 'Same letters, same powers? They're like terms — combine them. Different powers? Hands off.'",
        "Closing: 'The coefficient of −5x is −5. Drop that minus and your whole calculation flips.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch9_addition_subtraction",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "Addition and Subtraction of Expressions",
    prerequisite_knowledge: [
      "Like and unlike terms",
      "Adding/subtracting integers",
      "Coefficients with signs",
      "Removing brackets",
    ],
    key_formulas: [
      "Add/subtract expressions by combining LIKE terms only",
      "Subtracting an expression flips the sign of every term inside: −(a − b + c) = −a + b − c",
      "Column method: align like terms vertically, then add/subtract coefficients",
    ],
    teaching_content: {
      intuition: "Adding algebraic expressions is like sorting and totalling coins by denomination — you can only add ₹5 coins to ₹5 coins. Here, you add x² terms to x² terms, x terms to x terms, constants to constants. Unlike terms simply can't merge. The only real trap is subtraction: a minus sign in front of a bracket flips EVERY term inside.",
      derivation: "To add P and Q, write all their like terms together and sum coefficients: (3x² + 2x) + (5x² − x) = (3+5)x² + (2−1)x = 8x² + x. \nTo subtract Q from P, distribute the minus: P − Q = P + (−Q), where −Q has every sign reversed. So (3x² + 2x) − (5x² − x) = 3x² + 2x − 5x² + x = −2x² + 3x. The sign flip on −x → +x is exactly where most errors happen.",
      worked_example: "Subtract (2a² − 3ab + b²) from (5a² + ab − 2b²).\n\n= (5a² + ab − 2b²) − (2a² − 3ab + b²)\n= 5a² + ab − 2b² − 2a² + 3ab − b²   (flip every sign in the second bracket)\n= (5−2)a² + (1+3)ab + (−2−1)b²\n= 3a² + 4ab − 3b².",
      visual_description: "A column layout: like terms aligned in vertical columns (a², ab, b²), the second expression with all signs flipped shown beneath, and the column sums giving 3a² + 4ab − 3b².",
      svg_diagrams: [
        { title: "Column subtraction of expressions (flip signs)",
          svg_code: "<svg viewBox='0 0 240 90' xmlns='http://www.w3.org/2000/svg' font-family='monospace' font-size='12'><text x='10' y='22'>  5a²  +ab  −2b²</text><text x='10' y='42'>−(2a²  −3ab  +b²)</text><line x1='5' y1='50' x2='200' y2='50' stroke='#333'/><text x='10' y='70' fill='#16a34a'>  3a²  +4ab  −3b²</text></svg>" }
      ],
      common_misconceptions: [
        "Adding unlike terms (e.g. 3x² + 2x = 5x³ — wrong, they don't combine).",
        "Forgetting to flip ALL signs when subtracting a bracketed expression.",
        "Flipping only the first term's sign after a minus sign.",
        "Combining coefficients but losing track of the variable part.",
      ],
      shortcuts_and_tricks: [
        "Stack like terms in columns — alignment prevents most errors.",
        "Subtraction = add the opposite: rewrite −Q with every sign reversed, then just add.",
        "Tick off each term as you place it so none is missed.",
      ],
      when_to_use_this_method: "Use whenever you must combine expressions: simplifying, collecting terms, perimeter sums, and as a step inside larger algebra problems.",
      edge_cases: [
        "If no like terms exist, the simplified answer just lists all the terms unchanged.",
        "A missing term can be treated as 0 (e.g. align with a 0 coefficient in the column).",
        "Subtracting an expression from itself gives 0.",
      ],
      key_takeaway: "Add/subtract expressions by combining LIKE terms only (same variables, same powers) — sum their coefficients with signs. When subtracting a bracketed expression, flip the sign of EVERY term inside. The column method keeps like terms aligned and avoids slips.",
      video_script_hooks: [
        "Opening: 'You can add ₹5 coins to ₹5 coins, never to ₹10 coins. Algebra is the same — only like terms combine.'",
        "Mid: 'The minus sign in front of a bracket is a sign-flipping machine — it changes every single term inside.'",
        "Closing: 'Stack like terms in columns and the answer almost writes itself.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch9_multiplication",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "Multiplication of Algebraic Expressions",
    prerequisite_knowledge: [
      "Laws of exponents (xᵃ · xᵇ = xᵃ⁺ᵇ)",
      "Distributive law a(b + c) = ab + ac",
      "Multiplying integers (sign rules)",
      "Monomials, binomials, polynomials",
    ],
    key_formulas: [
      "Monomial × monomial: multiply coefficients, ADD the exponents of like bases",
      "Monomial × polynomial: distribute the monomial over every term",
      "Binomial × binomial: (a+b)(c+d) = ac + ad + bc + bd (each-by-each)",
      "Sign rule: (+)(+)=+, (−)(−)=+, (+)(−)=−",
    ],
    teaching_content: {
      intuition: "Multiplying expressions is repeated use of the distributive law: every term in the first bracket must shake hands with every term in the second. For single terms (monomials) you multiply the numbers and ADD the powers of the same letter. For brackets, distribute term by term, then collect like terms at the end.",
      derivation: "Monomial × monomial: 3x² · 4x³ = (3·4)·(x²·x³) = 12x⁵ (coefficients multiply, exponents add by the law xᵃ·xᵇ = xᵃ⁺ᵇ). \nMonomial × polynomial: 2x(3x − 5) = 2x·3x − 2x·5 = 6x² − 10x (distribute). \nBinomial × binomial: (a+b)(c+d) = a(c+d) + b(c+d) = ac + ad + bc + bd — the distributive law applied twice ('each by each', sometimes called FOIL). Finally combine any like terms.",
      worked_example: "Multiply (2x + 3)(x − 4).\n\nEach-by-each: 2x·x + 2x·(−4) + 3·x + 3·(−4)\n= 2x² − 8x + 3x − 12\n= 2x² − 5x − 12  (combine the like terms −8x + 3x).",
      visual_description: "A 2×2 area grid (box method): rows labelled 2x and 3, columns labelled x and −4; the four cells hold 2x², −8x, 3x, −12, summing to 2x² − 5x − 12.",
      svg_diagrams: [
        { title: "Box method for (2x+3)(x−4)",
          svg_code: "<svg viewBox='0 0 200 120' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='60' y='15'>x</text><text x='130' y='15'>−4</text><text x='10' y='50'>2x</text><text x='15' y='95'>3</text><rect x='40' y='25' width='70' height='40' fill='#dbeafe' stroke='#333'/><text x='55' y='50'>2x²</text><rect x='110' y='25' width='70' height='40' fill='#fde68a' stroke='#333'/><text x='128' y='50'>−8x</text><rect x='40' y='65' width='70' height='40' fill='#fde68a' stroke='#333'/><text x='62' y='90'>3x</text><rect x='110' y='65' width='70' height='40' fill='#fecaca' stroke='#333'/><text x='128' y='90'>−12</text></svg>" }
      ],
      common_misconceptions: [
        "Adding exponents wrongly or MULTIPLYING them (x²·x³ = x⁵, not x⁶).",
        "Forgetting a 'handshake' — every term must multiply every other term.",
        "Sign errors with negative terms: 2x·(−4) = −8x.",
        "Not collecting like terms at the end (leaving −8x + 3x instead of −5x).",
      ],
      shortcuts_and_tricks: [
        "Coefficients multiply; exponents of the same base ADD.",
        "Use the box (area) method for binomial products to guarantee all four products.",
        "After multiplying, always scan for like terms to combine.",
      ],
      when_to_use_this_method: "Use distribution/box method for any product of expressions — expanding brackets, area problems, and as the basis for the identities in the next topic.",
      edge_cases: [
        "(a + b)(a − b) and (a ± b)² are special products — fast identities (next topic) instead of full expansion.",
        "Multiplying by 0 gives 0; by 1 leaves the expression unchanged.",
        "Powers of different bases don't combine: x²·y³ stays x²y³.",
      ],
      key_takeaway: "Multiply expressions by the distributive law: every term times every term. Monomials → multiply coefficients and ADD exponents of like bases. Binomials → 'each by each' (box/FOIL), then combine like terms. Mind the sign rules throughout.",
      video_script_hooks: [
        "Opening: 'Multiplying brackets is a handshake party — every term must shake hands with every term in the other bracket.'",
        "Mid: 'x squared times x cubed is x to the FIFTH — you ADD the powers, you don't multiply them.'",
        "Closing: 'Draw a 2×2 box and you'll never miss a product again.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch9_identities",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "Standard Algebraic Identities",
    prerequisite_knowledge: [
      "Multiplication of binomials (each-by-each)",
      "Squares of numbers and expressions",
      "Difference between an identity (always true) and an equation (true for some x)",
      "Substituting values into an expression",
    ],
    key_formulas: [
      "(a + b)² = a² + 2ab + b²",
      "(a − b)² = a² − 2ab + b²",
      "(a + b)(a − b) = a² − b²",
      "(x + a)(x + b) = x² + (a + b)x + ab",
    ],
    teaching_content: {
      intuition: "An identity is an equation that's true for ALL values of the letters — a reusable shortcut. Instead of multiplying (a+b)(a+b) every time, you just KNOW it's a² + 2ab + b². These four identities show up constantly — in expansion, fast mental multiplication (like 102² or 99×101), and factorisation later. Memorising them saves enormous time.",
      derivation: "(a+b)² = (a+b)(a+b) = a² + ab + ba + b² = a² + 2ab + b² (the two ab terms combine). \n(a−b)² = a² − 2ab + b² (same, with the middle term negative). \n(a+b)(a−b) = a² − ab + ab − b² = a² − b² (the ab terms cancel → difference of squares). \n(x+a)(x+b) = x² + bx + ax + ab = x² + (a+b)x + ab. Each is just the each-by-each product, simplified once and remembered forever.",
      worked_example: "Use identities to compute 103² and 98 × 102.\n\n103² = (100 + 3)² = 100² + 2·100·3 + 3² = 10000 + 600 + 9 = 10609.\n98 × 102 = (100 − 2)(100 + 2) = 100² − 2² = 10000 − 4 = 9996.\n(No long multiplication needed — the identities do the work.)",
      visual_description: "A square of side (a+b) divided into four regions: a² (big), two ab strips, and b² (corner) — the geometric proof that (a+b)² = a² + 2ab + b². Beside it, a (a+b)(a−b) rectangle rearranged to show a² − b².",
      svg_diagrams: [
        { title: "Geometric proof of (a+b)² = a² + 2ab + b²",
          svg_code: "<svg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><rect x='15' y='15' width='90' height='90' fill='#bfdbfe' stroke='#2563eb'/><text x='50' y='65'>a²</text><rect x='105' y='15' width='30' height='90' fill='#fde68a' stroke='#d97706'/><text x='112' y='65'>ab</text><rect x='15' y='105' width='90' height='30' fill='#fde68a' stroke='#d97706'/><text x='55' y='125'>ab</text><rect x='105' y='105' width='30' height='30' fill='#fecaca' stroke='#dc2626'/><text x='112' y='125'>b²</text></svg>" }
      ],
      common_misconceptions: [
        "Writing (a+b)² = a² + b² (forgetting 2ab) — the most common algebra error of all.",
        "Sign slip in (a−b)²: the middle term is −2ab, the b² stays POSITIVE.",
        "Misremembering (a+b)(a−b) as a² + b² instead of a² − b².",
        "Trying to expand by identity when the expression doesn't fit the pattern.",
      ],
      shortcuts_and_tricks: [
        "Numbers near a round number: 103² via (100+3)²; 996×1004 via (1000−4)(1000+4).",
        "Spot the pattern: same two terms squared → (a±b)²; sum × difference → a² − b².",
        "Memorise the (x+a)(x+b) form — it's the key to factorising quadratics next chapter.",
      ],
      when_to_use_this_method: "Use identities to expand fast, to compute squares/products of numbers near round values mentally, and (in reverse) to FACTORISE expressions in the factorisation chapter.",
      edge_cases: [
        "(a + b + c)² = a² + b² + c² + 2ab + 2bc + 2ca extends the pattern to three terms.",
        "An identity holds for ALL values; verify by substituting a couple of numbers if unsure.",
        "These identities run BOTH ways — left-to-right to expand, right-to-left to factorise.",
      ],
      key_takeaway: "Four identities — (a+b)², (a−b)², (a+b)(a−b)=a²−b², (x+a)(x+b) — are reusable shortcuts true for all values. They expand brackets instantly, enable fast mental arithmetic near round numbers, and (read backwards) drive factorisation. Never forget the 2ab middle term.",
      video_script_hooks: [
        "Opening: 'Compute 103 squared in your head. (100+3)² = 10000 + 600 + 9 = 10609. That's an identity at work.'",
        "Mid: 'The number-one algebra mistake on Earth: (a+b)² is NOT a² + b². The 2ab is the bit everyone forgets.'",
        "Closing: 'Learn these four both directions — forwards they expand, backwards they factorise.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch9 (Algebraic Expressions and Identities): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
