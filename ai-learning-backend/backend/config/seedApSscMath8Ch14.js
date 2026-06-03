/**
 * AP SSC Class 8 Mathematics — Chapter 14: Factorisation
 * 4 topics. topicId: ap_ssc_math8_ch14_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch14.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch14_common_factors",
    subject: "Mathematics",
    chapterNumber: 14,
    name: "Factorisation by Taking Out Common Factors",
    prerequisite_knowledge: ["Multiplication of expressions and the distributive law", "HCF of numbers and of monomials", "Laws of exponents", "Meaning of a factor"],
    key_formulas: ["Factorisation = writing an expression as a product of factors", "Common-factor method: ab + ac = a(b + c)", "Take out the HCF of all terms (numbers and variables)"],
    teaching_content: {
      intuition: "Factorising is multiplication run BACKWARDS: instead of expanding a(b+c) into ab+ac, we look at ab+ac and pull the common factor a back out. Spotting the greatest common factor of every term and 'taking it outside the bracket' is the first and most basic factorisation technique.",
      derivation: "Find the HCF of all terms — numerically and variable-wise (lowest power of each common letter). Divide each term by that HCF and write the HCF outside a bracket containing the quotients. e.g. 6x²y + 9xy²: HCF = 3xy. Dividing: 6x²y/3xy = 2x, 9xy²/3xy = 3y. So 6x²y + 9xy² = 3xy(2x + 3y). Check by expanding to recover the original.",
      worked_example: "Factorise 12a³b − 18a²b² + 6a²b.\n\nHCF of 12,18,6 = 6; lowest power of a is a²; of b is b. HCF = 6a²b.\nDivide: 12a³b/6a²b = 2a; −18a²b²/6a²b = −3b; 6a²b/6a²b = 1.\nResult: 6a²b(2a − 3b + 1).",
      visual_description: "The expression 6x²y + 9xy² with the common factor 3xy circled in each term and 'pulled out' to the front of a bracket containing (2x + 3y).",
      svg_diagrams: [{ title: "Take out the common factor 3xy", svg_code: "<svg viewBox='0 0 230 60' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='12'><text x='10' y='25'>6x²y + 9xy²</text><text x='10' y='48' fill='#16a34a'>= 3xy(2x + 3y)</text></svg>" }],
      common_misconceptions: ["Taking out a factor that isn't common to EVERY term.", "Forgetting the leftover '1' when a term IS the common factor (e.g. +6a²b → +1).", "Pulling out a number but missing the common variable (or vice versa).", "Sign errors when a term is negative."],
      shortcuts_and_tricks: ["HCF = (HCF of coefficients) × (lowest power of each common variable).", "Always check by expanding — the product must rebuild the original.", "Take out the GREATEST common factor in one step, not a small one repeatedly."],
      when_to_use_this_method: "Use first on ANY factorisation problem — extracting common factors often simplifies the expression before other methods (regrouping, identities) are applied.",
      edge_cases: ["If the only common factor is 1, this method alone won't factorise it — try other methods.", "A term equal to the HCF leaves a 1 inside the bracket.", "Negative common factor: −2x² − 4x = −2x(x + 2)."],
      key_takeaway: "Factorisation reverses multiplication. The first technique is to take out the HCF of all terms (greatest common number × lowest common variable powers) and write it outside a bracket. Always verify by expanding.",
      video_script_hooks: ["Opening: 'You know how to expand a(b+c). Factorising is just doing it in reverse — pulling the common bit back out.'", "Mid: 'Find what EVERY term shares, divide it out, and park it in front of a bracket.'", "Closing: 'When a whole term is the common factor, don't forget the lonely 1 it leaves behind.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch14_regrouping",
    subject: "Mathematics",
    chapterNumber: 14,
    name: "Factorisation by Regrouping Terms",
    prerequisite_knowledge: ["Common-factor factorisation", "Distributive law", "Recognising a shared bracket", "Rearranging terms"],
    key_formulas: ["Group terms so each group has a common factor", "ax + ay + bx + by = a(x+y) + b(x+y) = (a+b)(x+y)", "After grouping, the SAME bracket must appear in each group"],
    teaching_content: {
      intuition: "Sometimes no single factor is common to ALL terms, but if you cluster the terms into clever groups, each group reveals its own common factor — and crucially the SAME bracket pops out of each group. You then factor that shared bracket out. It's common-factoring applied twice with a regrouping step in between.",
      derivation: "Take ax + ay + bx + by. Group as (ax + ay) + (bx + by). Factor each group: a(x+y) + b(x+y). Now (x+y) is common to both groups, so factor it out: (a+b)(x+y). The trick is choosing groups that produce the SAME bracket; if the first grouping fails, rearrange and try another.",
      worked_example: "Factorise 6xy − 4y + 6 − 9x.\n\nRearrange and group: (6xy − 9x) + (−4y + 6) = 3x(2y − 3) − 2(2y − 3).\nCommon bracket (2y − 3): = (3x − 2)(2y − 3).\n(Check by expanding: 6xy − 9x − 4y + 6 ✓.)",
      visual_description: "The four terms bracketed into two pairs, each pair factored to reveal the identical (2y−3) bracket, which is then pulled out to leave (3x−2)(2y−3).",
      svg_diagrams: [{ title: "Regroup → common bracket → factor", svg_code: "<svg viewBox='0 0 250 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='10' y='22'>(6xy−9x) + (−4y+6)</text><text x='10' y='44'>= 3x(2y−3) − 2(2y−3)</text><text x='10' y='64' fill='#16a34a'>= (3x−2)(2y−3)</text></svg>" }],
      common_misconceptions: ["Grouping in a way that does NOT produce a common bracket, then giving up (rearrange and retry).", "Sign errors when factoring a negative out of a group (−4y+6 = −2(2y−3), note the sign flip).", "Stopping after grouping without factoring the common bracket.", "Forgetting the method needs the brackets to MATCH exactly."],
      shortcuts_and_tricks: ["Aim for groups whose factored brackets are identical; if not, swap the order of terms.", "When taking out a negative, the signs inside the bracket flip — use that to MATCH the other bracket.", "Four-term expressions are the classic candidates for regrouping."],
      when_to_use_this_method: "Use when an expression has 4 (or more) terms with no overall common factor, but pairs of terms share factors — typical after the common-factor check fails.",
      edge_cases: ["The original term order may need rearranging before grouping works.", "Sometimes more than one valid grouping exists, giving the same final factors.", "If no grouping yields a common bracket, the expression may need an identity or may be prime."],
      key_takeaway: "When no factor is common to all terms, regroup them into clusters that each factor to reveal the SAME bracket, then factor that bracket out. Watch signs when extracting a negative, and rearrange terms if the first grouping doesn't produce matching brackets.",
      video_script_hooks: ["Opening: 'No common factor in all four terms? Group them in pairs — each pair hides a shared bracket.'", "Mid: 'The magic is making the two brackets identical. If they're not, shuffle the terms and try again.'", "Closing: 'Pulling a minus out of a group flips its signs — use that to force the brackets to match.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch14_using_identities",
    subject: "Mathematics",
    chapterNumber: 14,
    name: "Factorisation Using Identities",
    prerequisite_knowledge: ["The standard identities (a±b)², a²−b², (x+a)(x+b)", "Recognising perfect squares", "Common-factor factorisation", "Square roots of terms"],
    key_formulas: ["a² − b² = (a + b)(a − b)  [difference of two squares]", "a² + 2ab + b² = (a + b)²", "a² − 2ab + b² = (a − b)²", "x² + (a+b)x + ab = (x + a)(x + b)  [split the middle term]"],
    teaching_content: {
      intuition: "The standard identities you learned for EXPANDING can be read BACKWARDS to FACTORISE. If you spot a difference of two squares, or a perfect-square trinomial, the factors are instant. For a general quadratic x²+px+q, you 'split the middle term' into two numbers that add to p and multiply to q.",
      derivation: "Difference of squares: recognise a²−b² (two perfect squares with a minus) → (a+b)(a−b). \nPerfect-square trinomial: a²±2ab+b² → (a±b)². Check the middle term equals 2×√(first)×√(last). \nGeneral quadratic x²+px+q: find two numbers whose SUM is p and PRODUCT is q; split px into them and regroup. e.g. x²+5x+6: 2 and 3 (sum 5, product 6) → x²+2x+3x+6 → (x+2)(x+3).",
      worked_example: "Factorise (a) 49x² − 16, (b) x² − 10x + 25, (c) x² + 7x + 12.\n\n(a) = (7x)² − 4² = (7x + 4)(7x − 4)  [difference of squares].\n(b) = x² − 2(5)x + 5² = (x − 5)²  [perfect square].\n(c) split 7 into 3+4 (product 12): x²+3x+4x+12 = (x+3)(x+4).",
      visual_description: "Three mini-panels: a²−b² shown as a big square minus a small square rearranged into the rectangle (a+b)(a−b); a perfect-square trinomial as a labelled (a+b)² square; and a quadratic with its middle term split into two.",
      svg_diagrams: [{ title: "Difference of squares: a² − b² = (a+b)(a−b)", svg_code: "<svg viewBox='0 0 130 110' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><rect x='15' y='15' width='90' height='90' fill='#dbeafe' stroke='#2563eb'/><rect x='75' y='65' width='30' height='40' fill='#fecaca' stroke='#dc2626'/><text x='40' y='40'>a²</text><text x='80' y='90' font-size='8'>b²</text></svg>" }],
      common_misconceptions: ["Trying to factor a² + b² (SUM of squares — does NOT factor over real numbers).", "Wrong split of the middle term (numbers must satisfy BOTH sum and product).", "Mistaking a²−2ab+b² for (a+b)² (the minus gives (a−b)²).", "Not checking that both outer terms are perfect squares before using difference-of-squares."],
      shortcuts_and_tricks: ["Two squares with a minus → instant (a+b)(a−b). Two squares with a PLUS → does not factor.", "Perfect square check: does the middle term equal 2·√first·√last?", "Quadratic x²+px+q: list factor pairs of q, pick the pair adding to p."],
      when_to_use_this_method: "Use after extracting common factors: spot difference of squares, perfect-square trinomials, or split-the-middle-term quadratics. These patterns factor far faster than trial and error.",
      edge_cases: ["Always take out common factors FIRST (e.g. 2x²−8 = 2(x²−4) = 2(x+2)(x−2)).", "a²+b² is prime over the reals (no real factorisation).", "Repeated factor: x²+2x+1 = (x+1)² (a perfect square, both factors the same)."],
      key_takeaway: "Read the standard identities backwards to factorise: a²−b²=(a+b)(a−b), a²±2ab+b²=(a±b)², and split the middle term for x²+px+q (two numbers summing to p, multiplying to q). Extract common factors first; remember a²+b² does not factor over the reals.",
      video_script_hooks: ["Opening: 'The identities that EXPAND brackets also FACTORISE — just read them right to left.'", "Mid: 'See two perfect squares with a minus sign? Factor it on sight: (a+b)(a−b).'", "Closing: 'For x²+5x+6, find two numbers that add to 5 and multiply to 6. Two and three. Done.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch14_division",
    subject: "Mathematics",
    chapterNumber: 14,
    name: "Division of Algebraic Expressions",
    prerequisite_knowledge: ["Laws of exponents (subtracting powers on division)", "Factorisation methods", "Cancelling common factors", "Monomials and polynomials"],
    key_formulas: ["Monomial ÷ monomial: divide coefficients, SUBTRACT exponents of like bases", "Polynomial ÷ monomial: divide each term by the monomial", "Polynomial ÷ polynomial: FACTORISE both, then cancel the common factor"],
    teaching_content: {
      intuition: "Dividing algebraic expressions is mostly about CANCELLING. For simple cases you divide coefficients and subtract powers. For a polynomial divided by another, the clean trick is to factorise both top and bottom, then cancel the shared factor — just like reducing a numerical fraction to lowest terms.",
      derivation: "Monomial ÷ monomial: 12x⁵ ÷ 4x² = (12/4)·x⁵⁻² = 3x³ (coefficients divide, exponents subtract). \nPolynomial ÷ monomial: divide EACH term: (6x² + 9x) ÷ 3x = 6x²/3x + 9x/3x = 2x + 3. \nPolynomial ÷ polynomial: factorise both and cancel: (x²−9)/(x+3) = (x+3)(x−3)/(x+3) = x−3 (the common (x+3) cancels).",
      worked_example: "Simplify (x² + 5x + 6) ÷ (x + 2).\n\nFactorise the numerator: x²+5x+6 = (x+2)(x+3).\nSo (x+2)(x+3)/(x+2) = x + 3 (cancel the common (x+2)).",
      visual_description: "A fraction bar with (x+2)(x+3) on top and (x+2) on the bottom; the matching (x+2) factors struck through (cancelled), leaving x+3.",
      svg_diagrams: [{ title: "Factor then cancel: (x²+5x+6)/(x+2) = x+3", svg_code: "<svg viewBox='0 0 220 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><text x='20' y='25'>(x+2)(x+3)</text><line x1='15' y1='32' x2='130' y2='32' stroke='#333'/><text x='55' y='50'>(x+2)</text><text x='150' y='38' fill='#16a34a'>= x + 3</text></svg>" }],
      common_misconceptions: ["Cancelling TERMS instead of FACTORS (you can only cancel a common factor of the WHOLE numerator and denominator).", "Adding exponents on division instead of subtracting.", "Dividing only the first term of a polynomial by the monomial.", "Cancelling before factorising (must factor into products first)."],
      shortcuts_and_tricks: ["Monomial division: divide numbers, subtract powers of like bases.", "Polynomial ÷ polynomial: factor BOTH fully, then cancel the common factor — never cancel across a + or −.", "If nothing cancels, the division may have a remainder (or the expressions share no factor)."],
      when_to_use_this_method: "Use to simplify algebraic fractions and quotients — dividing monomials, splitting a polynomial over a monomial, or reducing a rational expression by cancelling common factors.",
      edge_cases: ["You can only cancel FACTORS, never individual terms: (x+3)/3 ≠ x+1.", "The cancelled factor must be non-zero (x ≠ −2 in the worked example).", "Some divisions leave a remainder (long division of polynomials, taught later)."],
      key_takeaway: "Divide monomials by dividing coefficients and subtracting exponents; divide a polynomial by a monomial term-by-term; divide polynomial by polynomial by FACTORISING both and cancelling the common factor. Cancel factors, never terms.",
      video_script_hooks: ["Opening: 'Dividing algebra is really just cancelling — like reducing 6/9 to 2/3, but with brackets.'", "Mid: 'Factor the top, factor the bottom, cancel what matches. (x²+5x+6)/(x+2) becomes x+3.'", "Closing: 'You can cancel FACTORS, never single terms. (x+3)/3 is NOT x+1 — a classic trap.'"],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch14 (Factorisation): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
