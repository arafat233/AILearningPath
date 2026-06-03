/**
 * AP SSC Class 8 Mathematics — Chapter 1: Rational Numbers
 * 4 topics — fresh content (NCERT Class 8, AP SSC SEM-1 textbook).
 *
 * topicId: ap_ssc_math8_ch1_*  · board AP_SSC · grade 8 · subject Mathematics
 * Matches the 15-check Math Content gate (key_formulas, prerequisite_knowledge +
 * 11 teaching_content fields). Safe to re-run (upsert on topicId).
 *
 * Usage: node config/seedApSscMath8Ch01.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  // ───────────────────────────────────────────────────────────────
  // 1-A  Properties of Rational Numbers
  // ───────────────────────────────────────────────────────────────
  {
    topicId: "ap_ssc_math8_ch1_properties_of_operations",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Properties of Rational Numbers",
    prerequisite_knowledge: [
      "Rational number = a number expressible as p/q with p, q integers and q ≠ 0",
      "Addition, subtraction, multiplication and division of fractions",
      "Integers and their operations (including negatives)",
      "Equivalent fractions and reducing to lowest terms",
    ],
    key_formulas: [
      "Closure: for rationals a, b — a+b, a−b, a×b are rational (division by 0 excluded)",
      "Commutativity: a+b = b+a and a×b = b×a (NOT for − or ÷)",
      "Associativity: (a+b)+c = a+(b+c) and (a×b)×c = a×(b×c) (NOT for − or ÷)",
      "Distributivity: a×(b+c) = a×b + a×c",
    ],
    teaching_content: {
      intuition: "You already add, subtract and multiply fractions. The point of this topic is to notice the RULES those operations always obey — they never break. Whole numbers obey some rules; integers obey more; rational numbers obey the most. Knowing which property holds for which operation lets you rearrange and regroup a messy calculation into an easy one, instead of grinding through it left to right.",
      derivation: "Why is the set of rationals 'closed' under addition? Take any two rationals a/b and c/d (b, d ≠ 0). Their sum is (ad + bc)/(bd). The numerator ad+bc is an integer (integers are closed under × and +) and the denominator bd is a non-zero integer. So the result is again of the form p/q with q ≠ 0 — a rational. The same check works for subtraction and multiplication. Division is the ONE gap: dividing by 0 is undefined, so rationals are closed under division only when the divisor is non-zero.\n\nCommutativity and associativity are inherited from integers: since integer addition/multiplication can be reordered and regrouped, so can the numerators and denominators of rationals. Subtraction and division are NOT commutative because 5−3 ≠ 3−5 and 6÷2 ≠ 2÷6.",
      worked_example: "Use properties to simplify  (−3/7) × (5/4) + (−3/7) × (−1/4).\n\nSpot the common factor −3/7. By distributivity, a×b + a×c = a×(b+c):\n  = (−3/7) × [ 5/4 + (−1/4) ]\n  = (−3/7) × (4/4)\n  = (−3/7) × 1\n  = −3/7.\n\nLeft-to-right would mean two multiplications and an addition of awkward fractions. Distributivity turned it into one tiny step.",
      visual_description: "A 2-column table. Left column lists the four operations (+, −, ×, ÷). Top row lists the four properties (Closure, Commutative, Associative, Distributive). Tick marks fill the cells: + and × get ticks for closure/commutative/associative; − and ÷ get closure ticks (÷ except by 0) but crosses for commutative/associative; distributivity links × over +.",
      svg_diagrams: [
        {
          title: "Which property holds for which operation",
          svg_code: "<svg viewBox='0 0 360 150' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='12'><text x='10' y='20' font-weight='bold'>Op</text><text x='70' y='20'>Closure</text><text x='150' y='20'>Commut.</text><text x='240' y='20'>Assoc.</text><text x='20' y='45'>+</text><text x='90' y='45' fill='#16a34a'>✓</text><text x='175' y='45' fill='#16a34a'>✓</text><text x='258' y='45' fill='#16a34a'>✓</text><text x='20' y='70'>−</text><text x='90' y='70' fill='#16a34a'>✓</text><text x='175' y='70' fill='#dc2626'>✗</text><text x='258' y='70' fill='#dc2626'>✗</text><text x='20' y='95'>×</text><text x='90' y='95' fill='#16a34a'>✓</text><text x='175' y='95' fill='#16a34a'>✓</text><text x='258' y='95' fill='#16a34a'>✓</text><text x='20' y='120'>÷</text><text x='80' y='120' fill='#16a34a' font-size='10'>✓(≠0)</text><text x='175' y='120' fill='#dc2626'>✗</text><text x='258' y='120' fill='#dc2626'>✗</text></svg>"
        }
      ],
      common_misconceptions: [
        "Thinking subtraction is commutative: 5−3 = 2 but 3−5 = −2. Order matters.",
        "Thinking division is associative: (8÷4)÷2 = 1 but 8÷(4÷2) = 4. Grouping matters.",
        "Believing rationals are NOT closed under division — they are, EXCEPT division by 0.",
        "Forgetting that whole numbers are NOT closed under subtraction (3−5 is not a whole number) but integers and rationals are.",
      ],
      shortcuts_and_tricks: [
        "Scan for a common factor before multiplying out — distributivity often collapses a sum of products into one product.",
        "Reorder (commute) and regroup (associate) to pair numbers that cancel or make whole numbers, e.g. (1/3 + 5) + 2/3 = (1/3 + 2/3) + 5 = 6.",
        "Only + and × are 'friendly' (commutative AND associative). − and ÷ are 'fussy' about order and grouping.",
      ],
      when_to_use_this_method: "Use these properties to SIMPLIFY before computing — whenever a problem has common factors (→ distributivity) or terms that pair into whole numbers (→ commute + associate). In exams, questions of the form 'find using suitable properties' expect you to name and apply the property, not brute-force.",
      edge_cases: [
        "Division by zero is undefined, so closure under ÷ explicitly excludes a÷0.",
        "Subtraction can be rewritten as adding the opposite: a − b = a + (−b), which IS commutative-friendly.",
        "0 is rational (0 = 0/1); 1 is rational (1 = 1/1). Both are essential 'identity' elements (next topic).",
      ],
      key_takeaway: "Addition and multiplication of rationals are closed, commutative and associative; subtraction and division are closed (÷ except by 0) but neither commutative nor associative. Multiplication distributes over addition. Use these to rearrange hard calculations into easy ones.",
      video_script_hooks: [
        "Opening: 'Why can you add 1/3 + 5 + 2/3 in your head but a calculator does it the slow way? Because you know a rule it doesn't.'",
        "Mid: 'Watch — I'll turn two ugly fraction multiplications into one tiny step using a single property: distributivity.'",
        "Closing: 'Plus and times are the friendly operations — reorder and regroup freely. Minus and divide are fussy — keep their order.'",
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────
  // 1-B  Identity & Inverse (role of 0 and 1, negatives, reciprocals)
  // ───────────────────────────────────────────────────────────────
  {
    topicId: "ap_ssc_math8_ch1_identity_and_inverse",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Additive & Multiplicative Identity and Inverse",
    prerequisite_knowledge: [
      "Properties of operations on rational numbers (closure, commutativity, etc.)",
      "Negative numbers and the meaning of 'opposite'",
      "Reciprocal of a fraction (flip numerator and denominator)",
      "Multiplying a fraction by its reciprocal gives 1",
    ],
    key_formulas: [
      "Additive identity: a + 0 = 0 + a = a",
      "Multiplicative identity: a × 1 = 1 × a = a",
      "Additive inverse of a is −a:  a + (−a) = 0",
      "Multiplicative inverse (reciprocal) of a/b (a ≠ 0) is b/a:  (a/b) × (b/a) = 1",
    ],
    teaching_content: {
      intuition: "Two special rational numbers, 0 and 1, leave everything unchanged: add 0 and nothing happens; multiply by 1 and nothing happens. They are the 'do-nothing' numbers — the identities. Every number also has a partner that cancels it: its additive inverse (the negative) cancels it to 0, and its multiplicative inverse (the reciprocal) cancels it to 1. Identities and inverses are the backbone of solving equations.",
      derivation: "Additive inverse: we want a number x with a + x = 0. For a = p/q, take x = −p/q. Then p/q + (−p/q) = (p + (−p))/q = 0/q = 0. So the additive inverse of any rational is just its negative.\n\nMultiplicative inverse: we want x with a × x = 1. For a = p/q (p ≠ 0, q ≠ 0), take x = q/p. Then (p/q) × (q/p) = (pq)/(qp) = 1. So the reciprocal of p/q is q/p — flip it. Note: 0 has NO multiplicative inverse, because 0 × anything = 0, never 1.",
      worked_example: "Find the additive and multiplicative inverse of −5/8.\n\nAdditive inverse: the number that adds to 0 → +5/8, because −5/8 + 5/8 = 0.\n\nMultiplicative inverse (reciprocal): flip it, keeping the sign → −8/5, because (−5/8) × (−8/5) = 40/40 = 1.\n\nCheck the sign: a negative number's reciprocal is also negative (negative × negative = positive 1).",
      visual_description: "A number line from −2 to 2 with 0 marked at the centre. An arrow from 3/4 to its mirror point −3/4 shows they are equal distances from 0 (additive inverses). A separate small panel shows 2/3 and 3/2 with a '×' between them collapsing to 1 (reciprocals).",
      svg_diagrams: [
        {
          title: "Additive inverse: equal distance on opposite sides of 0",
          svg_code: "<svg viewBox='0 0 340 90' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='12'><line x1='20' y1='50' x2='320' y2='50' stroke='#333' stroke-width='2'/><line x1='170' y1='44' x2='170' y2='56' stroke='#333'/><text x='166' y='72'>0</text><circle cx='240' cy='50' r='4' fill='#2563eb'/><text x='228' y='38' fill='#2563eb'>3/4</text><circle cx='100' cy='50' r='4' fill='#dc2626'/><text x='84' y='38' fill='#dc2626'>−3/4</text><path d='M240 50 Q170 20 100 50' fill='none' stroke='#16a34a' stroke-dasharray='4 3'/><text x='150' y='18' fill='#16a34a'>sum = 0</text></svg>"
        }
      ],
      common_misconceptions: [
        "Thinking 0 has a reciprocal — it does not; 1/0 is undefined.",
        "Confusing additive inverse (−a, makes 0) with multiplicative inverse (1/a, makes 1).",
        "Forgetting to keep the sign when taking a reciprocal: reciprocal of −5/8 is −8/5, not 8/5.",
        "Thinking the reciprocal of a whole number n has no fraction — it is 1/n (e.g. reciprocal of 7 is 1/7).",
      ],
      shortcuts_and_tricks: [
        "Additive inverse = just flip the sign. Multiplicative inverse = just flip the fraction (keep the sign).",
        "Reciprocal of a reciprocal returns the original: (b/a) flipped is (a/b).",
        "0 is the only rational with no reciprocal; 1 and −1 are their own reciprocals.",
      ],
      when_to_use_this_method: "Use additive inverses to move terms across an equals sign (solving equations) and multiplicative inverses to undo a multiplication (dividing = multiplying by the reciprocal). Recognise 'identity' and 'inverse' language in property-based exam questions.",
      edge_cases: [
        "1 and −1 are self-inverse under multiplication (1×1 = 1, −1×−1 = 1).",
        "0 is its own additive inverse (0 + 0 = 0) but has no multiplicative inverse.",
        "The additive inverse of a positive number is negative and vice versa; the reciprocal keeps the sign.",
      ],
      key_takeaway: "0 is the additive identity, 1 the multiplicative identity. Every rational a has additive inverse −a (sums to 0); every NON-ZERO rational p/q has multiplicative inverse q/p (multiplies to 1). 0 has no reciprocal.",
      video_script_hooks: [
        "Opening: 'There are two laziest numbers in maths — add one, multiply by the other, and absolutely nothing changes. Meet 0 and 1.'",
        "Mid: 'Every number has a secret partner that cancels it. Find the partner, solve the equation.'",
        "Closing: 'Flip the sign for the additive inverse; flip the fraction for the reciprocal. Two flips, all of algebra opens up.'",
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────
  // 1-C  Rational Numbers on the Number Line
  // ───────────────────────────────────────────────────────────────
  {
    topicId: "ap_ssc_math8_ch1_on_number_line",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Rational Numbers on the Number Line",
    prerequisite_knowledge: [
      "Drawing and labelling a number line with integers",
      "Meaning of numerator and denominator",
      "Equivalent fractions and proper/improper fractions",
      "Locating simple fractions like 1/2, 1/4 between integers",
    ],
    key_formulas: [
      "To plot p/q, divide each unit segment into q equal parts and count p parts from 0",
      "Negative rationals lie to the LEFT of 0, mirroring their positive counterparts",
      "An improper fraction p/q (p>q) is first written as a mixed number to locate it",
    ],
    teaching_content: {
      intuition: "A number line is a ruler with no end. Whole numbers are the big marks; rational numbers are everything in between. To place a fraction like 3/4, you ask 'how many equal pieces, and how many of them?' — 4 pieces per unit, count 3. The denominator tells you how finely to chop the unit; the numerator tells you how far to walk.",
      derivation: "To represent p/q on the number line:\n1. Identify the two integers the number lies between. For 7/3 = 2⅓, it lies between 2 and 3. For a proper fraction like 3/4 it lies between 0 and 1.\n2. Divide the unit segment (between those two integers) into q equal sub-parts — here q is the denominator.\n3. Starting from the smaller integer, count forward the required number of sub-parts.\n\nFor negatives, do the identical construction to the LEFT of 0: −3/4 is the mirror image of 3/4.",
      worked_example: "Represent −5/4 on the number line.\n\n−5/4 = −1¼, so it lies between −1 and −2 (closer to −1).\nTake the unit segment from −1 to −2 and divide it into 4 equal parts (denominator = 4).\nFrom −1, move one part further left (the ¼ beyond −1).\nThat point is −5/4.\n\nCheck: −5/4 = −1.25, which is indeed a quarter of the way from −1 toward −2.",
      visual_description: "A number line from −2 to 1. The segment from 0 to 1 is divided into 4 equal ticks; 3/4 is marked on the third tick. The segment from −1 to −2 is also divided into 4 ticks; −5/4 is marked one tick left of −1. Dashed mirror symmetry lines connect 3/4 and −3/4 across 0.",
      svg_diagrams: [
        {
          title: "Plotting 3/4 and −5/4 on the number line",
          svg_code: "<svg viewBox='0 0 360 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><line x1='20' y1='45' x2='340' y2='45' stroke='#333' stroke-width='2'/><g stroke='#333'><line x1='60' y1='40' x2='60' y2='50'/><line x1='180' y1='40' x2='180' y2='50'/><line x1='300' y1='40' x2='300' y2='50'/></g><text x='52' y='66'>−1</text><text x='176' y='66'>0</text><text x='296' y='66'>1</text><g stroke='#bbb'><line x1='210' y1='42' x2='210' y2='48'/><line x1='240' y1='42' x2='240' y2='48'/><line x1='270' y1='42' x2='270' y2='48'/></g><circle cx='270' cy='45' r='4' fill='#2563eb'/><text x='258' y='32' fill='#2563eb'>3/4</text><g stroke='#bbb'><line x1='30' y1='42' x2='30' y2='48'/></g><circle cx='30' cy='45' r='4' fill='#dc2626'/><text x='16' y='32' fill='#dc2626'>−5/4</text></svg>"
        }
      ],
      common_misconceptions: [
        "Dividing the WHOLE line into q parts instead of just one unit segment.",
        "Plotting an improper fraction like 7/3 between 0 and 1 — convert to 2⅓ first; it lies between 2 and 3.",
        "Placing negative fractions on the right of 0. Negatives always go left.",
        "Using the numerator as the number of sub-divisions — it is the denominator that sets the chopping.",
      ],
      shortcuts_and_tricks: [
        "Convert improper fractions to mixed numbers first — instantly tells you the two integers to work between.",
        "Denominator = number of cuts per unit; numerator = number of steps to count.",
        "Mirror a positive fraction across 0 to plot its negative — same construction, opposite side.",
      ],
      when_to_use_this_method: "Use number-line representation whenever a question asks to 'represent / locate / show on the number line', or to compare/order rationals visually, or to demonstrate that infinitely many rationals lie between two points (leads into the next topic).",
      edge_cases: [
        "0 = 0/q sits exactly at the origin for any q.",
        "Equivalent fractions land on the SAME point: 1/2, 2/4, 3/6 all coincide.",
        "A fraction with denominator 1 (e.g. 5/1) is just the integer 5.",
      ],
      key_takeaway: "To plot p/q: find the integers it lies between, cut that unit segment into q equal parts, count p parts from the smaller integer. Negatives mirror to the left of 0; convert improper fractions to mixed numbers first.",
      video_script_hooks: [
        "Opening: 'A number line looks like it only has the counting numbers marked. But between any two of them hides an entire universe of fractions.'",
        "Mid: 'The denominator is your knife — it tells you how many slices. The numerator tells you how many to take.'",
        "Closing: 'Flip a fraction to the left of zero and you've plotted its negative. Same cuts, opposite direction.'",
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────
  // 1-D  Rational Numbers between Two Rational Numbers
  // ───────────────────────────────────────────────────────────────
  {
    topicId: "ap_ssc_math8_ch1_between_two_rationals",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Rational Numbers between Two Rational Numbers",
    prerequisite_knowledge: [
      "Finding the average (mean) of two numbers",
      "Equivalent fractions and the LCM of denominators",
      "Comparing and ordering fractions",
      "Representing rationals on the number line",
    ],
    key_formulas: [
      "Mean method: a rational between a and b is (a + b)/2",
      "Repeating the mean gives endlessly many rationals between any two rationals",
      "Equal-denominator method: write a and b with a large common denominator, then numerators between give the in-between rationals",
    ],
    teaching_content: {
      intuition: "Between two whole numbers like 3 and 4 there is no whole number — they are 'next-door neighbours'. But between two rational numbers, no matter how close, there are INFINITELY many rationals. There is no 'next' rational number. This is the surprising density of rationals: you can always squeeze another one in by taking the average.",
      derivation: "Mean method. Given two rationals a < b, their average m = (a+b)/2 always lies strictly between them: a < (a+b)/2 < b. Since rationals are closed under addition and division (by 2 ≠ 0), m is itself rational. Now repeat on the pair (a, m) to get another rational between, and again, and again — this never stops. Hence infinitely many rationals lie between any two.\n\nEqual-denominator method. Rewrite a and b with a common (and if needed enlarged) denominator. Any fraction whose numerator lies between the two numerators (same denominator) is an in-between rational; enlarging the denominator manufactures as many as you like.",
      worked_example: "Find three rational numbers between 1/4 and 1/2.\n\nMethod — equal denominators. LCM(4,2) = 4, so 1/4 and 1/2 = 2/4. There is no integer numerator strictly between 1 and 2, so enlarge: multiply numerator and denominator by 4 → 4/16 and 8/16. Now numerators 5, 6, 7 sit between 4 and 8:\n  5/16, 6/16 (= 3/8), 7/16.\n\nThese three rationals all lie between 1/4 and 1/2. (Check: 1/4 = 0.25, results 0.3125, 0.375, 0.4375, and 1/2 = 0.5.)",
      visual_description: "A number line zoomed between 1/4 and 1/2. The gap is subdivided into 16ths; the marks 5/16, 6/16, 7/16 are highlighted sitting strictly inside. A 'zoom bubble' shows that between any two of THOSE marks you could subdivide again — suggesting infinity.",
      svg_diagrams: [
        {
          title: "Three rationals squeezed between 1/4 and 1/2",
          svg_code: "<svg viewBox='0 0 360 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='11'><line x1='30' y1='45' x2='330' y2='45' stroke='#333' stroke-width='2'/><circle cx='40' cy='45' r='4' fill='#333'/><text x='28' y='32'>1/4</text><circle cx='320' cy='45' r='4' fill='#333'/><text x='306' y='32'>1/2</text><circle cx='110' cy='45' r='4' fill='#2563eb'/><text x='92' y='66' fill='#2563eb'>5/16</text><circle cx='180' cy='45' r='4' fill='#2563eb'/><text x='166' y='66' fill='#2563eb'>3/8</text><circle cx='250' cy='45' r='4' fill='#2563eb'/><text x='232' y='66' fill='#2563eb'>7/16</text></svg>"
        }
      ],
      common_misconceptions: [
        "Believing there is a 'next' rational after a given one — there isn't; rationals are dense.",
        "Stopping at one common denominator when none fits between the numerators — you must ENLARGE the denominator.",
        "Thinking only finitely many rationals fit between two close fractions — infinitely many do.",
        "Forgetting to verify the found numbers actually lie between (convert to decimals to check).",
      ],
      shortcuts_and_tricks: [
        "Need just ONE rational between a and b? Take their average (a+b)/2 — fastest.",
        "Need MANY? Give both a big common denominator (e.g. ×10), then read off the numerators between.",
        "To get n numbers between a and b, use denominator large enough that at least n integers sit between the numerators.",
      ],
      when_to_use_this_method: "Use the mean method when asked for one or two rationals between two given ones; use the equal-denominator (enlarge) method when asked for several, or for a specific count like 'five rational numbers between'.",
      edge_cases: [
        "Between a number and itself there are none — the two must be different.",
        "Works for negatives too: between −1/2 and −1/3 there are infinitely many rationals.",
        "The average method also proves there is no smallest positive rational.",
      ],
      key_takeaway: "Between any two distinct rationals lie INFINITELY many rationals (they are dense — no 'next' one exists). Find one with the average (a+b)/2; find many by writing both over a large common denominator and reading the numerators in between.",
      video_script_hooks: [
        "Opening: 'How many numbers are there between 1/4 and 1/2? Not three. Not a hundred. Infinitely many — and I'll show you how to find as many as you want.'",
        "Mid: 'The trick is the average. Take the midpoint, and you've found a number in between. Do it again on half the gap — forever.'",
        "Closing: 'Whole numbers have next-door neighbours. Rationals never do — there's always room for one more.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) {
    await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true });
    console.log(`  ✓ ${t.topicId}`);
    n++;
  }
  console.log(`\nAP SSC Math 8 Ch1 (Rational Numbers): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
