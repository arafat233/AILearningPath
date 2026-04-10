import mongoose from "mongoose";
import dotenv from "dotenv";
import { Lesson } from "../models/lessonModel.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_learning");
await Lesson.deleteMany({});

const lessons = [
  // ── 1. ALGEBRA BASICS ───────────────────────────────────────────
  { topic:"Algebra Basics", subject:"Math", grade:"10", title:"Algebra Basics",
    tagline:"Variables, expressions, and like terms — the foundation of everything",
    shortLesson:{ estimatedMinutes:6, keyIdea:"A variable is just an unknown number. Treat it like a box with a value inside.",
      slides:[
        {type:"concept",title:"What is a variable?",body:"A variable (x, y, a) represents an unknown value. '3x' means '3 times whatever x is'. It's not mysterious — it's just a placeholder."},
        {type:"visual",title:"Variables as boxes",body:"Think of x as a box. 2x means 2 identical boxes.",visual:"📦 = x\n📦📦 + 3 = 2x + 3"},
        {type:"example",title:"Simplify: 3a + 5b − a + 2b",example:{problem:"3a + 5b − a + 2b",steps:["Group like terms: (3a − a) + (5b + 2b)","= 2a + 7b"],answer:"2a + 7b"}},
        {type:"shortcut",title:"Like terms rule",shortcut:"Only combine terms with the SAME variable. 3x + 2y ≠ 5xy. Always group first, then add."},
        {type:"mistake_warning",title:"Most common mistake",warning:"3x + 2y cannot be simplified — they are UNLIKE terms. Only x-terms add with x-terms."},
      ]},
    longLesson:{ estimatedMinutes:20, slides:[
      {type:"concept",title:"Expressions vs equations",body:"An expression (3x + 2) has no equals sign. An equation (3x + 2 = 8) has an equals sign and can be solved."},
      {type:"example",title:"Evaluate 2x + 4 when x = 3",example:{problem:"2x + 4, x = 3",steps:["Substitute: 2(3) + 4","= 6 + 4"],answer:"10"}},
      {type:"shortcut",title:"BODMAS",shortcut:"Brackets → Orders → Division → Multiplication → Addition → Subtraction. Always follow this order."},
    ]},
    prerequisites:[] },

  // ── 2. LINEAR EQUATIONS ─────────────────────────────────────────
  { topic:"Linear Equations", subject:"Math", grade:"10", title:"Linear Equations",
    tagline:"Solve any one-variable equation in 3 steps",
    shortLesson:{ estimatedMinutes:7, keyIdea:"Whatever you do to one side of the equation, do the same to the other side.",
      slides:[
        {type:"concept",title:"What is a linear equation?",body:"A linear equation has one variable raised to power 1. Example: 2x + 5 = 15. It graphs as a straight line."},
        {type:"visual",title:"Think of a balance scale",body:"Both sides must stay equal. Add or remove from one side → do the same to the other.",visual:"⚖️  [2x + 5]  =  [15]"},
        {type:"example",title:"Solve: 2x + 5 = 15",example:{problem:"2x + 5 = 15",steps:["Subtract 5 from both sides → 2x = 10","Divide both sides by 2 → x = 5","Check: 2(5)+5 = 15 ✓"],answer:"x = 5"}},
        {type:"shortcut",title:"3-step shortcut",shortcut:"1. Move numbers to right (flip sign). 2. Move x-terms to left. 3. Divide. Done."},
        {type:"mistake_warning",title:"Sign flip mistake",warning:"2x + 5 = 15 → 2x = 15 + 5 is WRONG. Moving a positive term means subtracting, so 2x = 15 − 5 = 10."},
      ]},
    longLesson:{ estimatedMinutes:25, slides:[
      {type:"example",title:"Variables on both sides: 3x − 7 = 2x + 4",example:{problem:"3x − 7 = 2x + 4",steps:["Move x-terms left: 3x − 2x = 4 + 7","x = 11"],answer:"x = 11"}},
      {type:"example",title:"Fractions: x/2 + x/3 = 10",example:{problem:"x/2 + x/3 = 10",steps:["LCM of 2 and 3 = 6","Multiply both sides by 6: 3x + 2x = 60","5x = 60 → x = 12"],answer:"x = 12"}},
      {type:"shortcut",title:"Fraction trick",shortcut:"Always multiply both sides by the LCM of all denominators first. Clears all fractions in one step."},
    ]},
    prerequisites:["Algebra Basics"] },

  // ── 3. QUADRATIC EQUATIONS ──────────────────────────────────────
  { topic:"Quadratic Equations", subject:"Math", grade:"10", title:"Quadratic Equations",
    tagline:"Master factorization, formula, and discriminant",
    shortLesson:{ estimatedMinutes:8, keyIdea:"D = b² − 4ac determines everything about the roots before you even solve.",
      slides:[
        {type:"concept",title:"Standard form",body:"ax² + bx + c = 0 (a ≠ 0). The highest power is 2. It graphs as a parabola."},
        {type:"visual",title:"Discriminant tells the story",body:"Calculate D = b² − 4ac first:",visual:"D > 0  →  2 real roots\nD = 0  →  1 equal root\nD < 0  →  no real roots"},
        {type:"example",title:"Solve x² − 5x + 6 = 0",example:{problem:"x² − 5x + 6 = 0",steps:["Find two numbers: multiply to 6, add to −5 → they are −2 and −3","(x − 2)(x − 3) = 0","x = 2 or x = 3"],answer:"x = 2, 3"}},
        {type:"shortcut",title:"Key shortcuts",shortcut:"Sum of roots = −b/a.  Product of roots = c/a.  Always check D first — saves time."},
        {type:"mistake_warning",title:"Classic mistakes",warning:"Forgetting ± in the formula. Missing one root. Not simplifying after using the formula."},
      ]},
    longLesson:{ estimatedMinutes:30, slides:[
      {type:"example",title:"Using quadratic formula",example:{problem:"2x² − 7x + 3 = 0",steps:["D = 49 − 24 = 25","x = (7 ± 5)/4","x = 3 or x = 1/2"],answer:"x = 3, 1/2"}},
      {type:"example",title:"Word problem",example:{problem:"Product of two numbers is 20, sum is 9. Find them.",steps:["Let numbers be x and y","x + y = 9, xy = 20","x² − 9x + 20 = 0","(x−4)(x−5) = 0"],answer:"4 and 5"}},
    ]},
    prerequisites:["Linear Equations","Algebra Basics"] },

  // ── 4. POLYNOMIALS ──────────────────────────────────────────────
  { topic:"Polynomials", subject:"Math", grade:"10", title:"Polynomials",
    tagline:"Zeroes, graphs, and the factor theorem",
    shortLesson:{ estimatedMinutes:7, keyIdea:"If p(a) = 0, then (x − a) is a factor of p(x).",
      slides:[
        {type:"concept",title:"What is a polynomial?",body:"A polynomial has variables with whole-number powers: 3x² + 2x − 5. The highest power is the degree."},
        {type:"concept",title:"Zeroes of a polynomial",body:"A zero is a value of x that makes p(x) = 0. Graphically, it's where the curve crosses the x-axis."},
        {type:"example",title:"Find zero of p(x) = x² − 4",example:{problem:"x² − 4 = 0",steps:["(x−2)(x+2) = 0","x = 2 or x = −2"],answer:"Zeroes: 2 and −2"}},
        {type:"shortcut",title:"Factor theorem",shortcut:"p(a) = 0 ↔ (x − a) is a factor. To check, just substitute the value."},
        {type:"shortcut",title:"Sum and product of zeroes",shortcut:"For ax² + bx + c:  α + β = −b/a  and  αβ = c/a"},
      ]},
    longLesson:{ estimatedMinutes:22, slides:[
      {type:"concept",title:"Degree and number of zeroes",body:"A polynomial of degree n has at most n zeroes. Linear → 1 zero. Quadratic → 2 zeroes."},
      {type:"example",title:"Verify zeroes",example:{problem:"p(x) = x² − 5x + 6; check x = 2",steps:["p(2) = 4 − 10 + 6 = 0","So x = 2 is a zero ✓"],answer:"Verified"}},
    ]},
    prerequisites:["Algebra Basics"] },

  // ── 5. ARITHMETIC PROGRESSIONS ──────────────────────────────────
  { topic:"Arithmetic Progressions", subject:"Math", grade:"10", title:"Arithmetic Progressions",
    tagline:"Find any term or sum with two simple formulas",
    shortLesson:{ estimatedMinutes:7, keyIdea:"Two formulas cover everything: an = a + (n−1)d and Sn = n/2 × [2a + (n−1)d].",
      slides:[
        {type:"concept",title:"What is an AP?",body:"A sequence where each term increases by a fixed amount (common difference d). Example: 2, 5, 8, 11, 14 — here d = 3."},
        {type:"visual",title:"Visualise the pattern",visual:"Term:   1   2   3   4   5\nValue:  2   5   8  11  14\nDiff:     +3  +3  +3  +3"},
        {type:"example",title:"Find 10th term: a=3, d=4",example:{problem:"a=3, d=4, n=10",steps:["an = a + (n−1)d","= 3 + (10−1)(4)","= 3 + 36 = 39"],answer:"a₁₀ = 39"}},
        {type:"shortcut",title:"Critical reminder",shortcut:"Use (n−1) NOT n in the formula. This is the #1 mistake in this chapter."},
        {type:"example",title:"Sum of first 10 terms",example:{problem:"a=3, d=4, n=10",steps:["Sn = n/2 × [2a + (n−1)d]","= 10/2 × [6 + 36] = 5 × 42"],answer:"S₁₀ = 210"}},
      ]},
    longLesson:{ estimatedMinutes:25, slides:[
      {type:"concept",title:"Finding d and a from conditions",body:"If you know two terms, form two equations: a + (m−1)d and a + (n−1)d. Solve simultaneously."},
      {type:"shortcut",title:"Alternative sum formula",shortcut:"Sn = n/2 × (first term + last term). Use this when you know first and last terms directly."},
    ]},
    prerequisites:["Algebra Basics"] },

  // ── 6. TRIANGLES ────────────────────────────────────────────────
  { topic:"Triangles", subject:"Math", grade:"10", title:"Triangles",
    tagline:"Similar triangles and Pythagoras — the geometry power duo",
    shortLesson:{ estimatedMinutes:8, keyIdea:"Similar triangles have equal angles and proportional sides. Identify them by AA, SAS, or SSS criteria.",
      slides:[
        {type:"concept",title:"Similar vs congruent",body:"Similar triangles have the same shape but different sizes. Congruent triangles are identical in shape AND size."},
        {type:"visual",title:"AA similarity",body:"If 2 angles of one triangle equal 2 angles of another → triangles are similar. (Third angle is automatically equal.)",visual:"△ABC ~ △DEF\n∠A=∠D, ∠B=∠E → AA"},
        {type:"concept",title:"Basic Proportionality Theorem (BPT)",body:"If DE ∥ BC in △ABC, then AD/DB = AE/EC. The parallel line divides both sides proportionally."},
        {type:"example",title:"Pythagoras application",example:{problem:"Right triangle, legs 6 and 8. Find hypotenuse.",steps:["h² = 6² + 8² = 36 + 64 = 100","h = 10"],answer:"10 cm"}},
        {type:"shortcut",title:"Pythagorean triples to memorise",shortcut:"3-4-5, 5-12-13, 8-15-17, 7-24-25. Multiply by any constant — still a right triangle!"},
      ]},
    longLesson:{ estimatedMinutes:25, slides:[
      {type:"concept",title:"Area of similar triangles",body:"If triangles are similar with ratio k:1, their areas are in ratio k²:1. Sides scale linearly; areas scale as square."},
      {type:"concept",title:"Converse of Pythagoras",body:"If a² + b² = c², the triangle IS right-angled. Use this to verify whether a triangle is right-angled."},
    ]},
    prerequisites:["Algebra Basics"] },

  // ── 7. COORDINATE GEOMETRY ──────────────────────────────────────
  { topic:"Coordinate Geometry", subject:"Math", grade:"10", title:"Coordinate Geometry",
    tagline:"Distance, midpoint, and section formula — locate anything on a grid",
    shortLesson:{ estimatedMinutes:7, keyIdea:"Three formulas cover 80% of problems: Distance, Midpoint, and Section.",
      slides:[
        {type:"concept",title:"Cartesian plane basics",body:"Every point is (x, y). x tells how far right, y tells how far up. Origin (0,0) is the centre."},
        {type:"visual",title:"Distance formula",body:"Distance between two points:",visual:"d = √[(x₂−x₁)² + (y₂−y₁)²]\n\nExample: A(0,0) and B(3,4)\nd = √[9+16] = √25 = 5"},
        {type:"example",title:"Find midpoint of A(2,3) and B(6,7)",example:{problem:"A(2,3), B(6,7)",steps:["M = ((2+6)/2, (3+7)/2)","= (4, 5)"],answer:"(4, 5)"}},
        {type:"shortcut",title:"Collinear points test",shortcut:"Three points A, B, C are collinear if area of △ABC = 0. Area = ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|"},
        {type:"mistake_warning",title:"Section formula confusion",warning:"Section formula: P divides AB in ratio m:n → P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)). Don't reverse m and n!"},
      ]},
    longLesson:{ estimatedMinutes:20, slides:[
      {type:"example",title:"Section formula",example:{problem:"P divides A(1,2) and B(4,8) in ratio 1:2",steps:["P = ((1×4 + 2×1)/(1+2), (1×8 + 2×2)/(1+2))","= (6/3, 12/3) = (2, 4)"],answer:"P = (2, 4)"}},
    ]},
    prerequisites:["Algebra Basics"] },

  // ── 8. TRIGONOMETRY ─────────────────────────────────────────────
  { topic:"Trigonometry", subject:"Math", grade:"10", title:"Trigonometry",
    tagline:"SOH-CAH-TOA and three identities — that's all you need",
    shortLesson:{ estimatedMinutes:8, keyIdea:"SOH-CAH-TOA. And memorise the table for 0°, 30°, 45°, 60°, 90°.",
      slides:[
        {type:"visual",title:"SOH-CAH-TOA",body:"For a right triangle with angle θ:",visual:"Sin θ = Opposite / Hypotenuse  (SOH)\nCos θ = Adjacent / Hypotenuse  (CAH)\nTan θ = Opposite / Adjacent    (TOA)"},
        {type:"visual",title:"Standard values table",visual:"θ    | 0°  | 30° | 45°  | 60°  | 90°\nsinθ | 0   | 1/2 | 1/√2 | √3/2 | 1\ncosθ | 1   | √3/2| 1/√2 | 1/2  | 0\ntanθ | 0   | 1/√3| 1    | √3   | ∞"},
        {type:"shortcut",title:"Memory trick for sin",shortcut:"sin values for 0°,30°,45°,60°,90° = √0/2, √1/2, √2/2, √3/2, √4/2. Pattern: √0 to √4 divided by 2."},
        {type:"concept",title:"Three key identities",body:"1. sin²θ + cos²θ = 1\n2. 1 + tan²θ = sec²θ\n3. 1 + cot²θ = cosec²θ"},
        {type:"mistake_warning",title:"Most common mistake",warning:"Confusing which side is 'opposite' and which is 'adjacent'. Opposite is across from angle θ. Adjacent is next to θ (not the hypotenuse)."},
      ]},
    longLesson:{ estimatedMinutes:28, slides:[
      {type:"example",title:"Prove: (sinθ + cosθ)² = 1 + 2sinθcosθ",example:{problem:"LHS = (sinθ + cosθ)²",steps:["= sin²θ + 2sinθcosθ + cos²θ","= 1 + 2sinθcosθ","= RHS ✓"],answer:"Proved"}},
      {type:"shortcut",title:"Identity manipulation",shortcut:"For proofs, always convert everything to sin and cos first. Then use sin²θ + cos²θ = 1 to simplify."},
    ]},
    prerequisites:["Algebra Basics","Triangles"] },

  // ── 9. APPLICATIONS OF TRIGONOMETRY ─────────────────────────────
  { topic:"Applications of Trigonometry", subject:"Math", grade:"10", title:"Applications of Trigonometry",
    tagline:"Heights, distances, and angles of elevation — real-world trig",
    shortLesson:{ estimatedMinutes:7, keyIdea:"Draw a diagram first. Label height, distance, and angle. Then pick sin, cos, or tan.",
      slides:[
        {type:"concept",title:"Angle of elevation vs depression",body:"Angle of elevation: looking UP from horizontal. Angle of depression: looking DOWN from horizontal. They are equal (alternate interior angles)."},
        {type:"visual",title:"Standard diagram",visual:"        * (top of tower)\n       /|\n      / |\n     /  | h (height)\n    /θ  |\n───*────*\n   A    B\n   ←d→\ntan(θ) = h/d"},
        {type:"example",title:"Tower problem",example:{problem:"Shadow = 20m, angle of elevation = 30°. Find height.",steps:["tan(30°) = h/20","h = 20 × tan(30°) = 20 × 1/√3","= 20/√3 = 20√3/3 m"],answer:"20√3/3 m ≈ 11.55 m"}},
        {type:"shortcut",title:"Which ratio to use?",shortcut:"Know 2 sides → find angle using inverse trig. Know 1 side + angle → find other side using sin/cos/tan."},
        {type:"mistake_warning",title:"Common error",warning:"Angle of depression from the TOP equals angle of elevation from the BOTTOM (alternate interior angles). Students often forget this."},
      ]},
    longLesson:{ estimatedMinutes:22, slides:[
      {type:"example",title:"Two buildings problem",example:{problem:"From 75m building, depression to car = 30°. Find distance.",steps:["tan(30°) = 75/d","d = 75/tan(30°) = 75√3 m"],answer:"75√3 m"}},
    ]},
    prerequisites:["Trigonometry"] },

  // ── 10. CIRCLES ─────────────────────────────────────────────────
  { topic:"Circles", subject:"Math", grade:"10", title:"Circles",
    tagline:"Tangents, chords, and the theorems that connect them",
    shortLesson:{ estimatedMinutes:7, keyIdea:"A tangent is perpendicular to the radius at the point of contact — everything follows from this.",
      slides:[
        {type:"concept",title:"Key terms",body:"Chord: line segment joining two points on circle. Tangent: line touching circle at exactly one point. Secant: line cutting circle at two points."},
        {type:"concept",title:"Tangent-radius theorem",body:"The tangent at any point of a circle is perpendicular to the radius at that point. Angle OAT = 90°."},
        {type:"concept",title:"Two tangents from external point",body:"Two tangents drawn from an external point to a circle are equal in length. PA = PB if P is the external point."},
        {type:"example",title:"Find angle in tangent problem",example:{problem:"PA and PB are tangents. ∠APB = 50°. Find ∠AOB.",steps:["∠OAP = ∠OBP = 90° (radius⊥tangent)","In quad OAPB: angles sum = 360°","∠AOB = 360 − 90 − 90 − 50 = 130°"],answer:"130°"}},
        {type:"shortcut",title:"Key results",shortcut:"Tangent ⊥ Radius (90°). Equal tangents from external point. Angle in semicircle = 90°."},
      ]},
    longLesson:{ estimatedMinutes:22, slides:[
      {type:"concept",title:"Chord bisector theorem",body:"The perpendicular from the centre to a chord bisects the chord. Conversely, the perpendicular bisector of a chord passes through the centre."},
    ]},
    prerequisites:["Triangles"] },

  // ── 11. SURFACE AREAS & VOLUMES ─────────────────────────────────
  { topic:"Surface Areas & Volumes", subject:"Math", grade:"10", title:"Surface Areas & Volumes",
    tagline:"All formulas in one place — plus the combination solids trick",
    shortLesson:{ estimatedMinutes:9, keyIdea:"Combination solids: surface area = total area of outer surfaces only (no shared area).",
      slides:[
        {type:"visual",title:"Formula sheet",visual:"CYLINDER:  CSA=2πrh  TSA=2πr(r+h)  V=πr²h\nCONE:      CSA=πrl   TSA=πr(r+l)   V=⅓πr²h\nSPHERE:    SA=4πr²                  V=⁴⁄₃πr³\nHEMISPHERE:CSA=2πr² TSA=3πr²      V=⅔πr³"},
        {type:"shortcut",title:"l in cone",shortcut:"Slant height l = √(r² + h²). Always calculate l first before using cone area formulas."},
        {type:"example",title:"Cylinder: r=7, h=10",example:{problem:"r=7cm, h=10cm",steps:["CSA = 2πrh = 2×(22/7)×7×10 = 440 cm²","TSA = 2πr(r+h) = 2×(22/7)×7×17 = 748 cm²","V = πr²h = (22/7)×49×10 = 1540 cm³"],answer:"V = 1540 cm³"}},
        {type:"concept",title:"Combination solids",body:"When two solids are joined: total surface = sum of outer surfaces − area of joining portion. Don't count the hidden area."},
        {type:"mistake_warning",title:"π value",warning:"Use π = 22/7 when radius is divisible by 7. Use π = 3.14 otherwise. The question usually specifies."},
      ]},
    longLesson:{ estimatedMinutes:28, slides:[
      {type:"example",title:"Hemisphere on cylinder",example:{problem:"Cylinder r=7, h=13; hemisphere on top. Find TSA.",steps:["CSA of cylinder = 2πrh = 2×(22/7)×7×13 = 572","Base of cylinder = πr² = 154","CSA of hemisphere = 2πr² = 308","TSA = 572 + 154 + 308 = 1034 cm²"],answer:"1034 cm²"}},
    ]},
    prerequisites:["Algebra Basics"] },

  // ── 12. STATISTICS ──────────────────────────────────────────────
  { topic:"Statistics", subject:"Math", grade:"10", title:"Statistics",
    tagline:"Mean, median, mode for grouped data — the three Ms",
    shortLesson:{ estimatedMinutes:8, keyIdea:"For grouped data: Mean by assumed mean method, Median by ogive or formula, Mode from modal class.",
      slides:[
        {type:"concept",title:"Three averages",body:"Mean = arithmetic average. Median = middle value. Mode = most frequent value. For grouped data, we estimate all three."},
        {type:"visual",title:"Mean — direct method",visual:"Mean = Σfx / Σf\nwhere f = frequency, x = class midpoint"},
        {type:"visual",title:"Median formula",visual:"Median = L + [(n/2 − cf)/f] × h\nL = lower boundary of median class\ncf = cumulative frequency before median class\nf = frequency of median class, h = class width"},
        {type:"shortcut",title:"Finding the modal class",shortcut:"Modal class = class with highest frequency. Mode = L + [(f₁−f₀)/(2f₁−f₀−f₂)] × h. Don't confuse modal class with mode."},
        {type:"mistake_warning",title:"Midpoint error",warning:"Class midpoint = (lower + upper)/2. For class 10-20, midpoint = 15, NOT 10. Many students use lower boundary instead."},
      ]},
    longLesson:{ estimatedMinutes:28, slides:[
      {type:"concept",title:"Cumulative frequency and ogive",body:"Cumulative frequency = running total of frequencies. Plot against upper class boundaries to get ogive. Median = x-value at n/2 on ogive."},
      {type:"shortcut",title:"Assumed mean method",shortcut:"Choose A (assumed mean) near middle. d = x − A. Mean = A + (Σfd/Σf). Much easier when numbers are large."},
    ]},
    prerequisites:["Algebra Basics"] },

  // ── 13. PROBABILITY ─────────────────────────────────────────────
  { topic:"Probability", subject:"Math", grade:"10", title:"Probability",
    tagline:"Theoretical probability from first principles",
    shortLesson:{ estimatedMinutes:6, keyIdea:"P(event) = Number of favourable outcomes / Total number of outcomes. Always 0 ≤ P ≤ 1.",
      slides:[
        {type:"concept",title:"Basic definition",body:"Probability measures how likely something is. P = 0 means impossible. P = 1 means certain. All others are between 0 and 1."},
        {type:"visual",title:"Formula",visual:"P(event) = Favourable outcomes / Total outcomes\n\nP(not A) = 1 − P(A)"},
        {type:"example",title:"Coin toss and die roll",example:{problem:"P(head on coin) and P(6 on die)",steps:["P(head) = 1/2 (1 head out of 2 outcomes)","P(6) = 1/6 (1 six out of 6 outcomes)"],answer:"1/2 and 1/6"}},
        {type:"shortcut",title:"Complementary events",shortcut:"P(not A) = 1 − P(A). Often easier to find P(not A) and subtract from 1."},
        {type:"example",title:"Cards problem",example:{problem:"P(king from 52 cards)",steps:["Kings = 4","P = 4/52 = 1/13"],answer:"1/13"}},
      ]},
    longLesson:{ estimatedMinutes:20, slides:[
      {type:"concept",title:"Mutually exclusive events",body:"Events that cannot happen together. P(A or B) = P(A) + P(B) for mutually exclusive events."},
      {type:"concept",title:"Sample space",body:"The set of all possible outcomes. For two coins: {HH, HT, TH, TT} — total 4. For a die: {1,2,3,4,5,6} — total 6."},
    ]},
    prerequisites:[] },

  // ── 14. AREAS RELATED TO CIRCLES ────────────────────────────────
  { topic:"Areas Related to Circles", subject:"Math", grade:"10", title:"Areas Related to Circles",
    tagline:"Sectors, segments, and combinations — all as fractions of a full circle",
    shortLesson:{ estimatedMinutes:7, keyIdea:"Sector and arc are both (angle/360) fractions of the full circle's area and circumference.",
      slides:[
        {type:"concept",title:"Sector vs segment",body:"Sector: pizza-slice shape (two radii + arc). Segment: region between a chord and arc. Minor segment is the smaller piece."},
        {type:"visual",title:"Key formulas",visual:"Area of sector = (θ/360) × πr²\nArc length    = (θ/360) × 2πr\nArea of segment = Area of sector − Area of triangle"},
        {type:"example",title:"Sector: r=7, θ=90°",example:{problem:"r=7cm, θ=90°",steps:["Area = (90/360) × (22/7) × 49","= (1/4) × 154 = 38.5 cm²"],answer:"38.5 cm²"}},
        {type:"shortcut",title:"θ/360 as a fraction first",shortcut:"Convert θ/360 to a simple fraction first: 90°=1/4, 60°=1/6, 120°=1/3, 180°=1/2. Much easier to calculate."},
        {type:"mistake_warning",title:"Segment area trap",warning:"Segment area = Sector area − Triangle area (not minus radius²). The triangle is OAB where O is centre, A and B are chord endpoints."},
      ]},
    longLesson:{ estimatedMinutes:22, slides:[
      {type:"example",title:"Segment area",example:{problem:"Circle r=10, chord subtends 60° at centre. Find segment area.",steps:["Sector area = (60/360)×π×100 = 100π/6","Triangle area = (√3/4)×r² (equilateral, since 60°) = (√3/4)×100","Segment = 100π/6 − 25√3"],answer:"(100π/6 − 25√3) cm²"}},
    ]},
    prerequisites:["Circles","Trigonometry"] },
];

await Lesson.insertMany(lessons);
console.log(`✅ ${lessons.length} lessons seeded for all CBSE Class 10 Math topics`);
await mongoose.disconnect();
