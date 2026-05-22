/**
 * CBSE Class 6 Mathematics — NcertTopicContent seed
 * Textbook: "Ganita Prakash Grade 6" (NCERT 2026, single book)
 * 10 chapters, flat teaching_content format. Safe to re-run.
 * Usage: node config/seedMath6Content.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

dotenv.config();

const topics = [
  {
    topicId: "math6_ch1",
    name: "Patterns in Mathematics",
    subject: "Mathematics",
    chapterNumber: 1,
    teaching_content: {
      intuition: "Mathematics is not just calculation — it is the art of finding and explaining patterns. When we notice that 1+3=4, 1+3+5=9, 1+3+5+7=16 (all perfect squares), we have spotted a pattern. Finding the pattern is exciting; proving why it must always hold is the real mathematical achievement. Patterns appear in nature (sunflower spirals), music (rhythmic beats), and technology (binary code).",
      process_explanation: "Key number sequences to know: Counting numbers (1,2,3,…), Even (0,2,4,…), Odd (1,3,5,…), Square numbers (1,4,9,16,25,… = n²), Triangular numbers (1,3,6,10,15,… = n(n+1)/2), Cube numbers (1,8,27,64,… = n³), Fibonacci (1,1,2,3,5,8,13,… each = sum of previous two), Powers of 2 (1,2,4,8,16,…). To find the next term: identify what operation connects consecutive terms — then apply it.",
      worked_example: "Find the 8th triangular number and the 6th Fibonacci number.\nTriangular: T(n) = n(n+1)/2 → T(8) = 8×9/2 = 36\nFibonacci: 1,1,2,3,5,8,13,21 → 6th term = 8\nBonus: notice that 1+2+3+4+5+6+7+8 = 36 = T(8). Triangular numbers ARE the cumulative sums of counting numbers.",
      common_misconceptions: "Students sometimes confuse square numbers (1,4,9,16…) with even numbers. Square numbers include odd squares: 1, 9, 25. Also, Fibonacci starts 1,1 — not 1,2. The first two terms are BOTH 1.",
      shortcuts_and_tricks: "Quick triangular number test: if 8n+1 is a perfect square, then n is triangular. Quick Fibonacci: remember the first 10 (1,1,2,3,5,8,13,21,34,55) — they appear in many exam questions.",
      key_takeaway: "Number sequences have rules. Key ones: triangular T(n)=n(n+1)/2; square n²; Fibonacci = sum of two previous. Identifying the rule lets you find any term without listing all previous ones.",
    },
  },
  {
    topicId: "math6_ch2",
    name: "Lines and Angles",
    subject: "Mathematics",
    chapterNumber: 2,
    teaching_content: {
      intuition: "Everything in geometry starts with a point — an exact location with no size. Connect two points to get a line segment. Extend it both ways infinitely and you have a line. When two rays share an endpoint, they form an angle. Understanding these building blocks lets us describe shapes, directions, and designs precisely.",
      process_explanation: "A point has no dimensions. A line extends infinitely in both directions (→←). A ray starts at a point and extends infinitely in one direction (→). A line segment is between two points (finite). An angle is formed by two rays from a common vertex. Types: acute (<90°), right (=90°), obtuse (90°–180°), straight (=180°), reflex (180°–360°). Measure with protractor (0°–180° scale). Complementary angles sum to 90°; supplementary angles sum to 180°.",
      worked_example: "Angle A = 37°. Find its complement and supplement.\nComplement = 90° − 37° = 53°\nSupplement = 180° − 37° = 143°\nCheck: 37° + 53° = 90° ✓; 37° + 143° = 180° ✓",
      common_misconceptions: "A common error: students think a line has endpoints. A line has NO endpoints and extends infinitely. A line segment has two endpoints. A ray has exactly one endpoint.",
      shortcuts_and_tricks: "Memory trick: Complementary = Corner (90°). Supplementary = Straight (180°). If you forget which is which, 'C' comes before 'S', and 90° < 180°.",
      key_takeaway: "Geometry building blocks: point (location), line (infinite, both ways), ray (infinite, one way), line segment (finite). Angles: acute <90°, right =90°, obtuse 90°–180°. Complementary angles sum to 90°; supplementary to 180°.",
    },
  },
  {
    topicId: "math6_ch3",
    name: "Number Play",
    subject: "Mathematics",
    chapterNumber: 3,
    teaching_content: {
      intuition: "Numbers can do surprising things when you play with their digits. Rearrange the digits of any 4-digit number, subtract the smaller from the larger, and keep repeating — you always end up at 6174 (Kaprekar's constant). Numbers aren't just for counting — they carry hidden structure waiting to be discovered.",
      process_explanation: "Supercell: a number in a grid that is larger than all its neighbours. Palindrome: a number that reads the same forwards and backwards (121, 1221). Kaprekar's constant: Take any 4-digit number (not all same digits), arrange digits in descending and ascending order, subtract — repeat. After at most 7 steps, you reach 6174. Magic square: arrange numbers in a grid so every row, column, and main diagonal has the same sum (magic sum).",
      worked_example: "Kaprekar process starting from 3524:\nStep 1: 5432 − 2345 = 3087\nStep 2: 8730 − 0378 = 8352\nStep 3: 8532 − 2358 = 6174\nStep 4: 7641 − 1467 = 6174 (stays at 6174)\nReached Kaprekar's constant in 3 steps.",
      common_misconceptions: "Students think the Kaprekar process works for any number of digits. It specifically gives 6174 for 4-digit numbers. For 3-digit numbers the constant is 495. The process does NOT work if all digits are the same (e.g. 1111 → 0000).",
      shortcuts_and_tricks: "For magic squares: the magic sum = n(n²+1)/2 for an n×n square using numbers 1 to n². For a 3×3 magic square using 1–9, the magic sum = 15.",
      key_takeaway: "Kaprekar's constant: any 4-digit number (not all same) reaches 6174 through repeated digit-rearrange-and-subtract. Palindromes read the same both ways. Magic squares have equal row, column, diagonal sums.",
    },
  },
  {
    topicId: "math6_ch4",
    name: "Data Handling and Presentation",
    subject: "Mathematics",
    chapterNumber: 4,
    teaching_content: {
      intuition: "We are surrounded by data — election results, weather records, sports scores. Data by itself is overwhelming. Organising it into tables and drawing it as graphs transforms raw numbers into visual stories that show patterns at a glance. This is why data handling is one of the most practically useful mathematical skills.",
      process_explanation: "Steps: (1) Collect data by observation/survey. (2) Organise using tally marks (|||| for 5) into a frequency table. (3) Represent using a pictograph (symbol = fixed count, shown in key) or bar graph (horizontal/vertical bars, equal width, height = frequency, scale on axis). When reading graphs: check the scale carefully — misreading the scale is the most common error. The bar with greatest height = most frequent category.",
      worked_example: "Favourite sport survey in a class of 30: Cricket 12, Football 8, Hockey 6, Badminton 4.\nTally: Cricket = |||| |||| ||, Football = |||| |||, Hockey = |||| |, Badminton = ||||\nBar graph: x-axis = sports, y-axis = frequency (scale 0–14, interval 2). Draw bars of heights 12, 8, 6, 4.",
      common_misconceptions: "In a pictograph, students sometimes count symbols without checking the key. If one symbol = 5 students and there are 3 symbols, the count is 15, not 3. Always multiply by the key value.",
      shortcuts_and_tricks: "For bar graphs: choose a scale where the tallest bar fits comfortably and the axis divisions are easy to read (multiples of 2, 5, or 10). If the highest value is 48, use a scale of 0–50 with intervals of 10.",
      key_takeaway: "Tally marks group in fives for easy counting. Pictograph: symbol × key = count. Bar graph: height of bar = frequency; bars have equal width. Always check the key/scale before reading a graph.",
    },
  },
  {
    topicId: "math6_ch5",
    name: "Prime Time",
    subject: "Mathematics",
    chapterNumber: 5,
    teaching_content: {
      intuition: "The Idli-Vada game: say 'idli' for multiples of 3 and 'vada' for multiples of 5. You say 'idli-vada' for multiples of BOTH — those are common multiples of 3 and 5. The first one is 15 = LCM(3,5). This game captures the essence of HCF and LCM, which are the tools for solving 'largest equal group' and 'first coincidence' problems.",
      process_explanation: "Prime: exactly 2 factors. Composite: more than 2. 1: neither. Every composite = unique product of primes (Fundamental Theorem of Arithmetic). Finding HCF: prime-factorise both → take common primes with LOWEST powers. Finding LCM: prime-factorise both → take ALL primes with HIGHEST powers. Shortcut: HCF × LCM = product of the two numbers. Divisibility rules speed up factorisation.",
      worked_example: "Find HCF and LCM of 60 and 84.\n60 = 2² × 3 × 5\n84 = 2² × 3 × 7\nHCF = 2² × 3 = 12 (common primes, lowest powers)\nLCM = 2² × 3 × 5 × 7 = 420 (all primes, highest powers)\nVerify: 12 × 420 = 5040 = 60 × 84 ✓",
      common_misconceptions: "Students confuse HCF and LCM. HCF ≤ both numbers (it divides both). LCM ≥ both numbers (both divide it). A common error: including all factors for HCF (should only be COMMON factors with lowest power).",
      shortcuts_and_tricks: "After finding HCF, get LCM instantly: LCM = (a × b) ÷ HCF. Much faster than full factorisation of LCM.",
      key_takeaway: "HCF = common primes with lowest powers (largest equal group). LCM = all primes with highest powers (first coincidence). HCF × LCM = a × b. 1 is neither prime nor composite. 2 is the only even prime.",
    },
  },
  {
    topicId: "math6_ch6",
    name: "Perimeter and Area",
    subject: "Mathematics",
    chapterNumber: 6,
    teaching_content: {
      intuition: "Perimeter is the distance you walk around a field — it's one-dimensional (length). Area is the amount of grass in the field — it's two-dimensional (surface). A long thin field and a squarish field can have the same perimeter but very different areas. A square gives the maximum area for a given perimeter (among rectangles).",
      process_explanation: "Perimeter: rectangle = 2(l+b); square = 4s; triangle = a+b+c. Area: rectangle = l×b; square = s²; triangle = ½×base×height. Units: length in cm/m → perimeter in cm/m; area in cm²/m². The height of a triangle is PERPENDICULAR to the chosen base. To find area of a composite shape: split into simpler shapes, find area of each, add (or subtract for holes).",
      worked_example: "A rectangular garden 15m × 8m is surrounded by a 1m wide path. Find the area of the path.\nOuter rectangle: (15+2) × (8+2) = 17 × 10 = 170 m²\nInner rectangle: 15 × 8 = 120 m²\nPath area = 170 − 120 = 50 m²",
      common_misconceptions: "Students use the slant side of a triangle as the height. The HEIGHT must be PERPENDICULAR (at 90°) to the base — it may need to be drawn outside the triangle for obtuse triangles.",
      shortcuts_and_tricks: "For path/border problems: area of path = area of outer rectangle − area of inner rectangle. If path width is w: outer dimensions = (l+2w) × (b+2w).",
      key_takeaway: "Perimeter = distance around (length units). Area = surface enclosed (square units). Rectangle: P=2(l+b), A=l×b. Triangle: A=½×base×height (height ⊥ base). Same perimeter ≠ same area.",
    },
  },
  {
    topicId: "math6_ch7",
    name: "Fractions",
    subject: "Mathematics",
    chapterNumber: 7,
    teaching_content: {
      intuition: "When one roti is shared equally among 4 children, each gets 1/4 roti. The bottom number (denominator) tells how many equal parts the whole is divided into; the top number (numerator) tells how many parts we take. Fractions are everywhere: half a cup, three-quarter full, two-thirds of the class.",
      process_explanation: "Fraction a/b: a = numerator (parts taken), b = denominator (equal parts in whole). Proper: a<b. Improper: a≥b. Mixed number: whole + proper fraction. Equivalent fractions: multiply/divide both by same non-zero number. Simplest form: HCF(a,b)=1. Comparing different-denominator fractions: convert to LCD (LCM of denominators). Adding/subtracting: same denominator → add/subtract numerators; different denominators → find LCD, convert, operate.",
      worked_example: "Add: 3/4 + 5/6\nLCD = LCM(4,6) = 12\n3/4 = 9/12;  5/6 = 10/12\n9/12 + 10/12 = 19/12 = 1 7/12\n\nSimplify: 36/48\nHCF(36,48) = 12\n36/48 ÷ 12/12 = 3/4",
      common_misconceptions: "Students add denominators: 1/3 + 1/4 ≠ 2/7. Denominators are NEVER added. Only numerators are added/subtracted, after making denominators equal. Similarly: 1/3 + 1/3 = 2/3, NOT 2/6.",
      shortcuts_and_tricks: "To compare two fractions a/b and c/d: cross-multiply → if a×d > b×c then a/b > c/d. Faster than finding LCD for comparisons.",
      key_takeaway: "Denominator = equal parts in whole; numerator = parts taken. Equivalent fractions multiply/divide top and bottom by same number. To add/subtract: find LCD first. To simplify: divide by HCF. NEVER add denominators.",
    },
  },
  {
    topicId: "math6_ch8",
    name: "Playing with Constructions",
    subject: "Mathematics",
    chapterNumber: 8,
    teaching_content: {
      intuition: "A compass is a tool that draws perfect circles by keeping one point fixed at the centre and letting the other trace out all points exactly the same distance (radius) away. With just a ruler and compass, the ancient Greeks could construct exact geometric shapes — and mathematicians still use these tools to prove geometric facts.",
      process_explanation: "Compass: set the opening to the desired radius; fix the pivot at the centre; rotate to draw the arc/circle. Ruler: draw straight lines between points. Key constructions: (1) Draw a circle of given radius — set compass to that radius, fix pivot, rotate. (2) Copy a line segment — set compass to segment length, mark that length elsewhere. (3) Draw a perpendicular — use the right-angle corner of a set-square or construct via arcs. Diameter = 2 × radius. All points on a circle are equidistant from the centre.",
      worked_example: "Construct a circle of radius 3.5 cm and draw a diameter.\nStep 1: Set compass to 3.5 cm (ruler).\nStep 2: Mark centre O. Pivot at O, rotate to draw full circle.\nStep 3: Draw any line through O meeting the circle at two points A and B. AB = diameter = 7 cm.",
      common_misconceptions: "Students move the compass opening after setting it — the radius must stay fixed throughout the construction. Also, the pivot point is the centre, not one end of the diameter.",
      shortcuts_and_tricks: "When copying a segment of length x: place compass on the segment, opening between the two endpoints, then mark that same opening on the target line — no measuring with ruler needed.",
      key_takeaway: "Compass draws exact circles/arcs. All points on a circle are the same distance (radius) from the centre. Diameter = 2 × radius. Constructions use only compass and ruler — no protractor or measurement of angles.",
    },
  },
  {
    topicId: "math6_ch9",
    name: "Symmetry",
    subject: "Mathematics",
    chapterNumber: 9,
    teaching_content: {
      intuition: "A butterfly's wings are mirror images — the wings have line symmetry. A spinning fan looks the same after rotating by a quarter turn — it has rotational symmetry. Symmetry is why things look beautiful and balanced. Designers, architects, and artists use symmetry deliberately; nature uses it for efficiency.",
      process_explanation: "Line (reflection) symmetry: if you fold the figure along the line, both halves match exactly. A figure can have 0, 1, or many lines of symmetry. Equilateral triangle: 3 lines; square: 4 lines; circle: infinitely many. Rotational symmetry: a figure has rotational symmetry of order n if it looks identical after rotating 360°/n. The angle of rotation = 360° ÷ n. A square has order 4 (rotate 90° each time). A regular hexagon has order 6 (rotate 60°).",
      worked_example: "How many lines of symmetry and what order of rotational symmetry does a regular pentagon have?\nLines of symmetry: regular pentagon has 5 sides → 5 lines of symmetry.\nRotational symmetry: 360°/5 = 72° rotation brings it back to the same position → order 5.",
      common_misconceptions: "Students think every figure has at least one line of symmetry. A scalene triangle has ZERO lines of symmetry. A parallelogram (non-rectangle) has NO lines of symmetry but has rotational symmetry of order 2.",
      shortcuts_and_tricks: "For regular polygons: number of lines of symmetry = number of sides = order of rotational symmetry. For a regular n-gon: n lines, order n, rotation angle = 360°/n.",
      key_takeaway: "Line symmetry: fold the figure — halves match. Regular n-gon has n lines of symmetry. Rotational symmetry order n: looks the same after rotating 360°/n. Regular n-gon has rotational symmetry of order n.",
    },
  },
  {
    topicId: "math6_ch10",
    name: "The Other Side of Zero",
    subject: "Mathematics",
    chapterNumber: 10,
    teaching_content: {
      intuition: "We all know numbers greater than zero, but what about temperatures below freezing, floors below ground, or money owed? These situations need numbers LESS than zero — negative numbers. The full set of integers (…−3,−2,−1,0,1,2,3…) extends our counting numbers to 'the other side of zero', making mathematics complete enough to describe the real world.",
      process_explanation: "Integers: all whole numbers including negatives, zero, and positives. Number line: negative to the left of 0, positive to the right. Comparing: further right = greater (so −1 > −5). Absolute value |n|: distance from 0 (always ≥ 0). Addition on number line: adding positive → move right; adding negative → move left. Subtraction: a − b = a + (−b) (subtracting = adding the opposite). Rules for different signs: take sign of the larger absolute value, subtract magnitudes.",
      worked_example: "Calculate: (−8) + 5 and 3 − (−6)\n(−8) + 5: magnitudes 8 and 5; different signs; 8−5=3; larger is negative → −3\n3 − (−6) = 3 + 6 = 9 (subtracting negative = adding positive)",
      common_misconceptions: "Students think −3 > −1 because 3 > 1. On the number line, −1 is to the RIGHT of −3, so −1 > −3. More negative = smaller. Also: subtracting a negative is a very common error — 5−(−3)=8 not 2.",
      shortcuts_and_tricks: "Two negatives in subtraction become a positive: a−(−b) = a+b. A debt of a debt = an asset. Visualise on the number line: starting at 5, going 3 steps RIGHT gives 8.",
      key_takeaway: "Integers extend numbers below zero. On the number line, right = greater (−1 > −5). Subtracting a negative = adding a positive. |n| = distance from 0. Adding integers: same signs → add; different signs → subtract magnitudes, use sign of larger.",
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  for (const t of topics) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: t.topicId },
      t,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${t.topicId}: ${t.name}`);
  }

  console.log(`\nSeeded ${topics.length} NcertTopicContent documents for Class 6 Mathematics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
