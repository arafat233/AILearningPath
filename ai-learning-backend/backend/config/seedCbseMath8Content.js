import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const topics = [

// ── Ch1: A Square and A Cube ──────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch1_squares", chapterNumber:1, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Squares",
  key_formulas:[
    {formula:"n² = n × n", explanation:"The square of a number is the product of the number with itself."},
    {formula:"Perfect squares: 1,4,9,16,25,36,49,64,81,100,121,144,169,196,225", explanation:"Squares of integers 1–15; memorise for fast computation."}
  ],
  prerequisite_knowledge:["multiplication tables","factors and multiples","area of a square"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Squaring a number finds the area of a square whose side is that number.",
      hook:"If you tile a 7×7 floor, how many 1 m² tiles do you need? The answer is 7² = 49.",
      real_world_anchors:["square floor tiles","pixel grids on a screen","chessboard squares"],
      the_pivot_idea:"n² counts how many unit squares fit inside an n×n grid — it's geometry disguised as arithmetic.",
      wrong_intuitions_to_replace:["'5² = 10' — No: squaring is NOT doubling; 5² = 25.","'(−6)² is negative' — No: (−6)² = 36 because negative × negative = positive."]
    },
    derivation:"Arrange n rows each containing n unit squares. Total unit squares = n × n = n². For n = 4: 4 rows × 4 columns = 16 = 4².",
    worked_example:[
      {problem:"Find 13².", steps:["13² = (10+3)² = 10² + 2×10×3 + 3²","= 100 + 60 + 9","= 169"], answer:"169"},
      {problem:"Is 225 a perfect square? Find its root.", steps:["225 = 9 × 25 = 3² × 5²","= (3×5)² = 15²"], answer:"Yes; √225 = 15"}
    ],
    visual_description:"A 6×6 grid of unit squares with the side labelled '6' and the total area labelled '36 = 6²'. A separate column shows perfect squares 1²–6² for reference.",
    svg_diagrams:[{
      id:"cbse_math8_ch1_squares_grid",
      title:"6×6 square grid showing n²",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <rect x="20" y="20" width="180" height="180" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  ${[1,2,3,4,5].map(i=>`<line x1="20" y1="${20+i*30}" x2="200" y2="${20+i*30}" stroke="#9fc0f7" stroke-width="1"/>`).join("")}
  ${[1,2,3,4,5].map(i=>`<line x1="${20+i*30}" y1="20" x2="${20+i*30}" y2="200" stroke="#9fc0f7" stroke-width="1"/>`).join("")}
  <text x="110" y="215" text-anchor="middle" fill="currentColor">6 units</text>
  <text x="8" y="115" text-anchor="middle" fill="currentColor" transform="rotate(-90,8,115)">6 units</text>
  <text x="110" y="240" text-anchor="middle" fill="#4285f4" font-size="15" font-weight="bold">Area = 6² = 36</text>
  <text x="260" y="40" fill="currentColor" font-weight="bold">Perfect Squares</text>
  ${[[1,1],[2,4],[3,9],[4,16],[5,25],[6,36],[7,49],[8,64],[9,81],[10,100]].map(([n,sq],i)=>`<text x="260" y="${60+i*22}" fill="currentColor">${n}² = ${sq}</text>`).join("")}
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"5² = 10 (squaring = doubling)", correction:"Squaring multiplies by itself: 5² = 5×5 = 25. Doubling is 2×5 = 10."},
      {wrong_idea:"The square of a fraction is larger than the fraction", correction:"For 0 < x < 1: x² < x. E.g. (½)² = ¼ < ½."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Squaring numbers ending in 5", rule:"(a5)² = a×(a+1) followed by 25", example:"35² = 3×4 = 12, append 25 → 1225", when_to_use:"Any 2-digit number ending in 5."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding the area of a square room or tile","Applying the Pythagoras theorem (a²+b²=c²)","Checking whether a number is a perfect square"],
      use_other_when:["Shape is not square — use the correct area formula","You need the square root — use inverse operation"]
    },
    edge_cases:[
      {case:"0² = 0", value:"0", reasoning:"Zero times itself is zero.", where_it_appears:"Solving x² = 0 gives x = 0 only."},
      {case:"1² = 1", value:"1", reasoning:"1 is its own square.", where_it_appears:"1 is a perfect square; identity element for multiplication."},
      {case:"(−n)² = n²", value:"positive", reasoning:"Negative × negative = positive.", where_it_appears:"x² = 25 has solutions x = 5 AND x = −5."}
    ],
    key_takeaway:"n² = n×n gives the area of an n-side square; perfect squares are 1,4,9,16…; squaring any negative number gives a positive result.",
    video_script_hooks:{
      opening_hook:"Imagine tiling a 7-metre-square room. You need 49 tiles — and that's exactly what 7² means.",
      concept_reveal:"Squaring isn't magic — it's counting rows × columns in an n×n grid.",
      common_mistake_moment:"STOP — 5² is NOT 10. Doubling and squaring are completely different operations.",
      real_world_connection:"Architects, photographers, and game developers use squares constantly — every pixel grid is a square.",
      closing_hook:"Next time you see a tile floor, count the rows and columns — you're already computing n²."
    }
  }
},
{
  topicId:"cbse_math8_ch1_cubes", chapterNumber:1, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Cubes",
  key_formulas:[
    {formula:"n³ = n × n × n", explanation:"The cube of n is the product of n used three times as a factor."},
    {formula:"Perfect cubes: 1,8,27,64,125,216,343,512,729,1000", explanation:"Cubes of integers 1–10; essential for quick identification."}
  ],
  prerequisite_knowledge:["squares and square numbers","volume of a cube","multiplication"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Cubing a number gives the volume of a cube whose edge length is that number.",
      hook:"A Rubik's cube has edge length 3 — it contains 3³ = 27 unit mini-cubes inside.",
      real_world_anchors:["ice cube trays","Rubik's cube layers","3-D pixel voxel grids"],
      the_pivot_idea:"n³ stacks n layers of n×n unit squares — it extends n² into the third dimension.",
      wrong_intuitions_to_replace:["'Cubing triples a number' — No: 4³ = 64, not 12.","'Cubing always makes numbers bigger' — For 0 < n < 1: n³ < n²."]
    },
    derivation:"A cube of edge n contains n layers, each layer being an n×n square of n² unit cubes. Total = n × n² = n³. For n = 3: 3 layers × 9 unit squares = 27.",
    worked_example:[
      {problem:"Find 6³.", steps:["6³ = 6 × 6 × 6","= 36 × 6","= 216"], answer:"216"},
      {problem:"Is 512 a perfect cube?", steps:["512 = 8 × 64 = 8³","Check: 8×8×8 = 512 ✓"], answer:"Yes; ∛512 = 8"}
    ],
    visual_description:"A 3-D illustration of a 4×4×4 cube built from unit cubes, with edge labelled '4' on three faces and total volume labelled '4³ = 64 unit cubes'.",
    svg_diagrams:[{
      id:"cbse_math8_ch1_cubes_diagram",
      title:"Cube as volume of n×n×n",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- isometric cube front face -->
  <polygon points="80,160 200,160 200,280 80,280" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <!-- top face -->
  <polygon points="80,160 140,100 260,100 200,160" fill="#b8d0fb" stroke="#4285f4" stroke-width="2"/>
  <!-- right face -->
  <polygon points="200,160 260,100 260,220 200,280" fill="#c8dafe" stroke="#4285f4" stroke-width="2"/>
  <!-- grid lines front -->
  ${[1,2,3].map(i=>`<line x1="80" y1="${160+i*30}" x2="200" y2="${160+i*30}" stroke="#9fc0f7" stroke-width="1"/>`).join("")}
  ${[1,2,3].map(i=>`<line x1="${80+i*30}" y1="160" x2="${80+i*30}" y2="280" stroke="#9fc0f7" stroke-width="1"/>`).join("")}
  <text x="140" y="300" text-anchor="middle" fill="currentColor">4 units</text>
  <text x="270" y="165" fill="currentColor">4 units</text>
  <text x="80" y="95" fill="currentColor">4 units</text>
  <text x="320" y="100" fill="#4285f4" font-size="15" font-weight="bold">n³ = n × n × n</text>
  <text x="320" y="130" fill="currentColor">4³ = 4×4×4</text>
  <text x="320" y="155" fill="currentColor">= 16 × 4</text>
  <text x="320" y="180" fill="currentColor">= 64 unit cubes</text>
  <text x="320" y="220" fill="currentColor" font-weight="bold">Perfect Cubes</text>
  ${[[1,1],[2,8],[3,27],[4,64],[5,125],[6,216],[7,343],[8,512]].map(([n,c],i)=>`<text x="320" y="${245+i*20}" fill="currentColor" font-size="12">${n}³ = ${c}</text>`).join("")}
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"n³ = 3n (cubing means tripling)", correction:"4³ = 64, not 12. Cubing means n×n×n, not n×3."},
      {wrong_idea:"Only positive integers have perfect cubes", correction:"(−2)³ = −8; negative numbers have real (negative) cube roots."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Cubes of numbers 11–15 using identity", rule:"(10+a)³ = 1000 + 300a + 30a² + a³", example:"12³ = 1000+360+144+8 = 1728", when_to_use:"When mental arithmetic of two-digit cubes is needed."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding the volume of a cube-shaped box","Identifying perfect cubes in factorisation","Using the identity a³+b³ = (a+b)(a²−ab+b²)"],
      use_other_when:["Shape is not a cube — use the correct volume formula","Finding the cube root — use the inverse operation ∛"]
    },
    edge_cases:[
      {case:"0³ = 0", value:"0", reasoning:"Zero times itself any number of times is zero.", where_it_appears:"Origin of 3-D coordinate space."},
      {case:"1³ = 1", value:"1", reasoning:"1 multiplied by itself any number of times remains 1.", where_it_appears:"Multiplicative identity; 1 is a perfect cube."},
      {case:"(−n)³ = −n³", value:"negative", reasoning:"Odd power of a negative is negative.", where_it_appears:"(−3)³ = −27; cube root of −27 = −3."}
    ],
    key_takeaway:"n³ = n×n×n is the volume of a cube of side n; perfect cubes are 1,8,27,64…; cubing a negative gives a negative result.",
    video_script_hooks:{
      opening_hook:"How many small cubes fit in a 5×5×5 box? 125 — and that's 5³.",
      concept_reveal:"Cubing extends squaring into the third dimension — n² fills a square, n³ fills a cube.",
      common_mistake_moment:"Watch out — 4³ is NOT 12. Don't triple, multiply: 4×4×4 = 64.",
      real_world_connection:"Architects calculate cubic metres of concrete; chemists use cubic centimetres — all built on n³.",
      closing_hook:"Volume of any cube is one formula: edge³. Simple, powerful, everywhere."
    }
  }
},
{
  topicId:"cbse_math8_ch1_square_roots", chapterNumber:1, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Square Roots",
  key_formulas:[
    {formula:"√(n²) = n  (n ≥ 0)", explanation:"The square root of a perfect square n² is n."},
    {formula:"√(a×b) = √a × √b", explanation:"Square root distributes over multiplication — useful for simplification."}
  ],
  prerequisite_knowledge:["perfect squares","prime factorisation","multiplication tables"],
  teaching_content:{
    intuition:{
      elevator_pitch:"The square root of a number asks: what length of side gives a square of that area?",
      hook:"A square plot of land has area 196 m². What is the side length? √196 = 14 m.",
      real_world_anchors:["finding side length of a square room","distance formula in coordinate geometry","screen diagonal calculation"],
      the_pivot_idea:"√n undoes squaring — it's the inverse operation, just as subtraction undoes addition.",
      wrong_intuitions_to_replace:["'√(a+b) = √a + √b' — False: √(9+16) = √25 = 5, not 3+4.","'Every number has a simple square root' — Only perfect squares have integer square roots."]
    },
    derivation:"By prime factorisation: pair identical prime factors, take one from each pair. Example: 324 = 2²×3⁴; √324 = 2×3² = 18. For the long-division method: group digits in pairs from the right, find the largest digit whose square fits, subtract, bring down the next pair.",
    worked_example:[
      {problem:"Find √441 by prime factorisation.", steps:["441 = 3 × 147 = 3 × 3 × 49 = 3² × 7²","√441 = 3 × 7"], answer:"21"},
      {problem:"Find √2025.", steps:["2025 = 5² × 81 = 5² × 3⁴","√2025 = 5 × 3² = 5 × 9"], answer:"45"}
    ],
    visual_description:"A square with area labelled '√n²' in the interior and side labelled 'n', alongside a factor tree for 144 that pairs primes to show √144 = 12.",
    svg_diagrams:[{
      id:"cbse_math8_ch1_square_roots_diagram",
      title:"Square root as inverse of squaring",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- square with area -->
  <rect x="30" y="60" width="160" height="160" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="110" y="145" text-anchor="middle" fill="#4285f4" font-size="16" font-weight="bold">Area = 144</text>
  <text x="110" y="170" text-anchor="middle" fill="currentColor">= 12²</text>
  <text x="110" y="235" text-anchor="middle" fill="currentColor" font-weight="bold">Side = √144 = 12</text>
  <text x="80" y="55" text-anchor="middle" fill="currentColor">12 units</text>
  <!-- arrows showing inverse -->
  <text x="240" y="130" fill="currentColor" font-size="20">⟵</text>
  <text x="245" y="110" fill="#e34234" font-size="12">square root</text>
  <text x="240" y="170" fill="currentColor" font-size="20">⟶</text>
  <text x="258" y="190" fill="#4285f4" font-size="12">square</text>
  <!-- n and n² boxes -->
  <rect x="310" y="100" width="60" height="40" fill="#fce8e6" stroke="#e34234" stroke-width="2" rx="6"/>
  <text x="340" y="125" text-anchor="middle" fill="#e34234" font-weight="bold">n = 12</text>
  <rect x="430" y="100" width="80" height="40" fill="#e6f4ea" stroke="#34a853" stroke-width="2" rx="6"/>
  <text x="470" y="125" text-anchor="middle" fill="#34a853" font-weight="bold">n² = 144</text>
  <!-- factor tree -->
  <text x="310" y="220" fill="currentColor" font-weight="bold">Prime factorisation:</text>
  <text x="310" y="245" fill="currentColor">144 = 2²×2²×3² = (2×2×3)²</text>
  <text x="310" y="270" fill="#4285f4">√144 = 2×2×3 = 12</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"√(a+b) = √a + √b", correction:"√(9+16) = √25 = 5, but √9+√16 = 3+4 = 7 ≠ 5. The property only works for multiplication."},
      {wrong_idea:"√(n²) = ±n always", correction:"By convention √ denotes the principal (non-negative) root: √25 = 5, not ±5. The equation x² = 25 has two solutions ±5."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Estimate square root by sandwiching", rule:"Find two consecutive perfect squares between which n lies; root lies between their square roots.", example:"√50: 49<50<64 so √50 is between 7 and 8, closer to 7.", when_to_use:"Quick estimation without a calculator."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding the side of a square given its area","Applying the distance or Pythagoras formula","Simplifying expressions containing √"],
      use_other_when:["Number is not a perfect square — use long division or calculator","Finding cube root — use ∛ not √"]
    },
    edge_cases:[
      {case:"√0 = 0", value:"0", reasoning:"0² = 0, so the inverse gives 0.", where_it_appears:"Degenerate cases in geometry; solutions of x² = 0."},
      {case:"√1 = 1", value:"1", reasoning:"1² = 1.", where_it_appears:"Identity element; 1 is both a perfect square and its own square root."},
      {case:"√ of non-perfect square", value:"irrational", reasoning:"Numbers like √2, √3 are irrational — non-terminating, non-repeating decimals.", where_it_appears:"Diagonal of a unit square = √2; appears in geometry constantly."}
    ],
    key_takeaway:"√n is the non-negative number whose square is n; find it by pairing prime factors in twos; √ distributes over × but NOT over + or −.",
    video_script_hooks:{
      opening_hook:"A square floor has area 196 m². What's the room's width? You need √196 — that's today's topic.",
      concept_reveal:"Square root undoes squaring, just like subtraction undoes addition. They're inverses.",
      common_mistake_moment:"√(9+16) is NOT √9 + √16. Always simplify inside the root first.",
      real_world_connection:"Architects, surveyors, and phone screens all depend on square roots for exact measurements.",
      closing_hook:"Every time you see area, think: 'What's the side?' — that's asking for the square root."
    }
  }
},
{
  topicId:"cbse_math8_ch1_cube_roots", chapterNumber:1, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Cube Roots",
  key_formulas:[
    {formula:"∛(n³) = n", explanation:"The cube root of a perfect cube n³ is n."},
    {formula:"∛(a×b) = ∛a × ∛b", explanation:"Cube root distributes over multiplication."}
  ],
  prerequisite_knowledge:["perfect cubes","prime factorisation","cube of a number"],
  teaching_content:{
    intuition:{
      elevator_pitch:"The cube root asks: what edge length gives a cube of this volume?",
      hook:"A cubic water tank holds 1000 litres (= 1000 cm³). What is its edge? ∛1000 = 10 cm.",
      real_world_anchors:["cubic storage tanks","volume of sugar cubes","3-D printing layer calculations"],
      the_pivot_idea:"∛n is the inverse of n³ — it shrinks a volume back to an edge length.",
      wrong_intuitions_to_replace:["'∛(−8) has no answer' — Wrong: ∛(−8) = −2.","'∛n is always smaller than √n' — Not true for n > 1."]
    },
    derivation:"By prime factorisation: group identical prime factors in threes, take one from each group. Example: 1728 = 2⁶×3³; ∛1728 = 2²×3 = 12.",
    worked_example:[
      {problem:"Find ∛3375.", steps:["3375 = 3 × 1125 = 3 × 3 × 375 = 3³ × 125 = 3³ × 5³","∛3375 = 3 × 5"], answer:"15"},
      {problem:"Find ∛(−512).", steps:["512 = 2⁹ = (2³)³ = 8³","∛(−512) = −∛512 = −8"], answer:"−8"}
    ],
    visual_description:"A cube labelled with volume '216 cm³' and a factor tree below showing 216 = 2³×3³, with ∛216 = 2×3 = 6 highlighted.",
    svg_diagrams:[{
      id:"cbse_math8_ch1_cube_roots_diagram",
      title:"Cube root from prime factorisation",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- isometric cube -->
  <polygon points="60,160 160,160 160,260 60,260" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <polygon points="60,160 110,110 210,110 160,160" fill="#b8d0fb" stroke="#4285f4" stroke-width="2"/>
  <polygon points="160,160 210,110 210,210 160,260" fill="#c8dafe" stroke="#4285f4" stroke-width="2"/>
  <text x="110" y="215" text-anchor="middle" fill="#4285f4" font-size="14" font-weight="bold">V = 216</text>
  <text x="110" y="290" text-anchor="middle" fill="currentColor">∛216 = 6</text>
  <text x="217" y="165" fill="currentColor">6</text>
  <!-- factor tree -->
  <text x="270" y="60" fill="currentColor" font-weight="bold">Prime factorisation of 216</text>
  <text x="270" y="90" fill="currentColor">216 = 2 × 108</text>
  <text x="270" y="115" fill="currentColor">    = 2 × 2 × 54</text>
  <text x="270" y="140" fill="currentColor">    = 2 × 2 × 2 × 27</text>
  <text x="270" y="165" fill="currentColor">    = 2³ × 3³</text>
  <text x="270" y="200" fill="#4285f4" font-size="14" font-weight="bold">∛216 = 2 × 3 = 6</text>
  <text x="270" y="240" fill="currentColor">Group primes in threes,</text>
  <text x="270" y="262" fill="currentColor">take one from each group.</text>
  <!-- perfect cubes reference -->
  <text x="270" y="295" fill="currentColor" font-size="11">∛1=1  ∛8=2  ∛27=3  ∛64=4  ∛125=5</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Cube roots of negative numbers don't exist", correction:"∛(−27) = −3 because (−3)³ = −27. Unlike square roots, cube roots of negatives are real."},
      {wrong_idea:"∛(a+b) = ∛a + ∛b", correction:"∛(8+19) = ∛27 = 3, but ∛8+∛19 ≈ 2+2.67 ≠ 3. Distribute cube roots only over multiplication."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Unit digit method", rule:"The unit digit of n³ determines the unit digit of ∛n: 1→1, 8→2, 7→3, 4→4, 5→5, 6→6, 3→7, 2→8, 9→9, 0→0.", example:"∛13824: unit digit 4 → root ends in 4; ∛13824 = 24.", when_to_use:"Finding cube roots of perfect cubes up to 6 digits."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding the edge of a cube given its volume","Solving equations of form x³ = k","Simplifying expressions with ∛"],
      use_other_when:["Number is not a perfect cube — use calculator","Finding square root — use √ not ∛"]
    },
    edge_cases:[
      {case:"∛0 = 0", value:"0", reasoning:"0³ = 0.", where_it_appears:"Origin in 3-D space."},
      {case:"∛1 = 1", value:"1", reasoning:"1³ = 1.", where_it_appears:"Multiplicative identity."},
      {case:"∛(−n³) = −n", value:"negative", reasoning:"Odd-power roots preserve sign.", where_it_appears:"∛(−125) = −5; cube root of negative volume is negative edge (directional)."}
    ],
    key_takeaway:"∛n is the number whose cube is n; find it by grouping prime factors in threes; cube roots of negative numbers are negative.",
    video_script_hooks:{
      opening_hook:"A cubic fish tank holds exactly 8000 cm³ of water. What's the side length? ∛8000 = 20 cm.",
      concept_reveal:"Cube root is the inverse of cubing — it turns volume back into edge length.",
      common_mistake_moment:"∛(−27) IS a real number: it's −3. Don't confuse cube roots with square roots.",
      real_world_connection:"Engineers size cubic containers, storage units, and 3-D models using cube roots every day.",
      closing_hook:"Whenever you know the volume of a cube, the edge is just one cube root away."
    }
  }
},

// ── Ch2: Power Play ───────────────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch2_exponents_intro", chapterNumber:2, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Introduction to Exponents",
  key_formulas:[
    {formula:"aⁿ = a × a × … × a  (n times)", explanation:"Exponent n tells how many times the base a is multiplied by itself."},
    {formula:"a¹ = a  and  a⁰ = 1  (a ≠ 0)", explanation:"Any non-zero base to the power 1 is itself; to the power 0 is 1."}
  ],
  prerequisite_knowledge:["multiplication","squares and cubes","number patterns"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Exponents are a compact notation for repeated multiplication — they make very large and very small numbers manageable.",
      hook:"A single bacterium doubles every hour. After 10 hours there are 2¹⁰ = 1024 bacteria. Writing 2×2×2×… ten times is tedious; 2¹⁰ is elegant.",
      real_world_anchors:["bacterial growth (doubling)","computer storage (MB = 2²⁰ bytes)","distance of stars (light-years in scientific notation)"],
      the_pivot_idea:"aⁿ counts how many times a is used as a factor — the exponent is just a count of multiplications.",
      wrong_intuitions_to_replace:["'2³ = 6' — No: 2³ = 2×2×2 = 8, not 2×3.","'Larger exponent always means larger result' — False: (½)⁴ < (½)² because 0 < ½ < 1."]
    },
    derivation:"Start from repeated addition leading to multiplication: 5+5+5 = 3×5. Extend to repeated multiplication: 5×5×5 = 5³. The exponent records how many factors; the base records what is being multiplied.",
    worked_example:[
      {problem:"Evaluate 2⁵ + 3³.", steps:["2⁵ = 2×2×2×2×2 = 32","3³ = 3×3×3 = 27","32 + 27"], answer:"59"},
      {problem:"Express 100000 as a power of 10.", steps:["100000 = 10×10×10×10×10","= 10⁵"], answer:"10⁵"}
    ],
    visual_description:"A table with two columns — 'Expression' and 'Expanded form' — showing 2¹ through 2⁶, illustrating how the value doubles each step and the exponent tracks the step count.",
    svg_diagrams:[{
      id:"cbse_math8_ch2_exponents_table",
      title:"Powers of 2 as repeated multiplication",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <text x="280" y="30" text-anchor="middle" fill="currentColor" font-size="16" font-weight="bold">Powers of 2</text>
  <rect x="30" y="45" width="500" height="30" fill="#4285f4" rx="4"/>
  <text x="130" y="65" text-anchor="middle" fill="white" font-weight="bold">Power</text>
  <text x="310" y="65" text-anchor="middle" fill="white" font-weight="bold">Expanded</text>
  <text x="460" y="65" text-anchor="middle" fill="white" font-weight="bold">Value</text>
  ${[["2¹","2","2"],["2²","2×2","4"],["2³","2×2×2","8"],["2⁴","2×2×2×2","16"],["2⁵","2×2×2×2×2","32"],["2⁶","2×2×2×2×2×2","64"]].map(([p,e,v],i)=>`
  <rect x="30" y="${75+i*36}" width="500" height="36" fill="${i%2===0?"#f8f9fa":"white"}" stroke="#dee2e6" stroke-width="0.5"/>
  <text x="130" y="${98+i*36}" text-anchor="middle" fill="#4285f4" font-weight="bold">${p}</text>
  <text x="310" y="${98+i*36}" text-anchor="middle" fill="currentColor">${e}</text>
  <text x="460" y="${98+i*36}" text-anchor="middle" fill="#34a853" font-weight="bold">${v}</text>`).join("")}
  <text x="280" y="300" text-anchor="middle" fill="currentColor" font-size="12">Each step multiplies by 2 — the exponent counts the steps.</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"aⁿ = a × n (exponent means multiply)", correction:"2⁵ = 2×2×2×2×2 = 32, not 2×5 = 10. Exponent means repeated multiplication of the base."},
      {wrong_idea:"a⁰ = 0 for any a", correction:"a⁰ = 1 for any a ≠ 0. This follows from the division rule: aⁿ/aⁿ = a⁰ = 1."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Powers of 10", rule:"10ⁿ has n zeros after 1", example:"10⁶ = 1,000,000 (6 zeros)", when_to_use:"Converting large round numbers to powers of 10 instantly."}
    ],
    when_to_use_this_method:{
      use_this_when:["Writing repeated multiplications compactly","Expressing very large numbers concisely","Computing bacterial/population growth problems"],
      use_other_when:["The exponent is 1 — just use the number itself","Direct multiplication is simpler (small exponents with small bases)"]
    },
    edge_cases:[
      {case:"a⁰ = 1 (a ≠ 0)", value:"1", reasoning:"aⁿ / aⁿ = 1, and by exponent rules = a⁰.", where_it_appears:"Polynomial degree; combinatorics (n choose 0 = 1)."},
      {case:"0⁰", value:"undefined/1 by convention", reasoning:"Mathematically indeterminate, but defined as 1 in combinatorics.", where_it_appears:"Binomial theorem coefficients."},
      {case:"1ⁿ = 1 for all n", value:"1", reasoning:"1 multiplied by itself any number of times is 1.", where_it_appears:"Probability of certain event raised to any power."}
    ],
    key_takeaway:"aⁿ = a multiplied by itself n times; a⁰ = 1 for any non-zero a; exponents make repeated multiplication compact and manageable.",
    video_script_hooks:{
      opening_hook:"One bacterium, doubles every hour. After 20 hours: 2²⁰ = 1,048,576 bacteria. Writing that multiplication 20 times? No thanks — that's what exponents are for.",
      concept_reveal:"An exponent is just a count. 2⁵ means 'multiply 2 five times as a factor.' Simple as that.",
      common_mistake_moment:"2³ is NOT 6. Stop multiplying the base by the exponent. 2³ = 2×2×2 = 8.",
      real_world_connection:"Computer memory is measured in powers of 2. Your 8 GB phone has 2³³ bytes of storage.",
      closing_hook:"Exponents are shorthand for the universe's favourite operation: repeated multiplication."
    }
  }
},
{
  topicId:"cbse_math8_ch2_laws_of_exponents", chapterNumber:2, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Laws of Exponents",
  key_formulas:[
    {formula:"aᵐ × aⁿ = aᵐ⁺ⁿ", explanation:"Same base: add exponents when multiplying."},
    {formula:"aᵐ ÷ aⁿ = aᵐ⁻ⁿ  (a ≠ 0)", explanation:"Same base: subtract exponents when dividing."},
    {formula:"(aᵐ)ⁿ = aᵐⁿ", explanation:"Power of a power: multiply exponents."},
    {formula:"(ab)ⁿ = aⁿbⁿ", explanation:"Power distributes over a product."}
  ],
  prerequisite_knowledge:["introduction to exponents","multiplication and division","order of operations"],
  teaching_content:{
    intuition:{
      elevator_pitch:"The laws of exponents are shortcuts that let you combine or simplify powers without expanding them.",
      hook:"2³ × 2⁴ = 8 × 16 = 128 = 2⁷. Notice 3+4 = 7. The rule saves writing 7 individual 2s.",
      real_world_anchors:["simplifying compound interest formulas","physics equations with powers","computer algorithm complexity (nᵃ × nᵇ = nᵃ⁺ᵇ)"],
      the_pivot_idea:"The laws follow directly from the definition — aᵐ is m copies of a, so multiplying by aⁿ just adds n more copies.",
      wrong_intuitions_to_replace:["'aᵐ × bⁿ = (ab)ᵐ⁺ⁿ' — Only works if m = n.","'(a+b)ⁿ = aⁿ+bⁿ' — This is false; use the binomial theorem instead."]
    },
    derivation:"aᵐ × aⁿ = (a×…×a, m times) × (a×…×a, n times) = a×…×a (m+n times) = aᵐ⁺ⁿ. Similarly aᵐ/aⁿ cancels n copies to leave m−n copies = aᵐ⁻ⁿ. (aᵐ)ⁿ = aᵐ repeated n times = aᵐⁿ.",
    worked_example:[
      {problem:"Simplify: (3²)³ × 3⁴ ÷ 3⁵", steps:["(3²)³ = 3⁶  (power of power)","3⁶ × 3⁴ = 3¹⁰  (product rule)","3¹⁰ ÷ 3⁵ = 3⁵  (quotient rule)","3⁵ = 243"], answer:"243"},
      {problem:"Simplify: (2³ × 5²)²", steps:["= (2³)² × (5²)²  (product rule)","= 2⁶ × 5⁴","= 64 × 625"], answer:"40000"}
    ],
    visual_description:"A reference card showing all four exponent laws with the law name, formula, and a numerical example side by side, laid out as a 2×2 grid.",
    svg_diagrams:[{
      id:"cbse_math8_ch2_exponent_laws",
      title:"Laws of exponents reference card",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  ${[
    ["Product Law","aᵐ × aⁿ = aᵐ⁺ⁿ","2³ × 2⁴ = 2⁷","#4285f4"],
    ["Quotient Law","aᵐ ÷ aⁿ = aᵐ⁻ⁿ","3⁵ ÷ 3² = 3³","#34a853"],
    ["Power of Power","(aᵐ)ⁿ = aᵐⁿ","(2²)³ = 2⁶","#ea4335"],
    ["Product of Powers","(ab)ⁿ = aⁿbⁿ","(2·3)⁴ = 2⁴·3⁴","#fbbc04"]
  ].map(([title,law,ex,color],i)=>{
    const x = i%2===0?20:300, y = i<2?20:170;
    return `<rect x="${x}" y="${y}" width="240" height="130" fill="${color}11" stroke="${color}" stroke-width="2" rx="8"/>
    <text x="${x+120}" y="${y+28}" text-anchor="middle" fill="${color}" font-weight="bold" font-size="14">${title}</text>
    <text x="${x+120}" y="${y+65}" text-anchor="middle" fill="currentColor" font-size="15">${law}</text>
    <text x="${x+120}" y="${y+100}" text-anchor="middle" fill="currentColor" font-size="12">e.g. ${ex}</text>`;
  }).join("")}
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"aᵐ × aⁿ = aᵐⁿ (multiply exponents when multiplying)", correction:"Multiply powers of the SAME base → ADD exponents: 2³×2⁴ = 2⁷, not 2¹²."},
      {wrong_idea:"(a+b)² = a²+b²", correction:"(a+b)² = a²+2ab+b². The middle term 2ab is always missing when students apply this error."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Identify the base first", rule:"Before applying any law, check that the bases match; if they don't, expand and compute.", example:"2³ × 3² cannot be simplified by exponent laws — compute: 8×9 = 72.", when_to_use:"Every exponent simplification problem."}
    ],
    when_to_use_this_method:{
      use_this_when:["Simplifying expressions with repeated bases","Solving exponential equations","Working with scientific notation arithmetic"],
      use_other_when:["Bases are different — compute separately","The exponents are fractions — use radical notation"]
    },
    edge_cases:[
      {case:"a⁰ = 1 via quotient law", value:"1", reasoning:"aⁿ ÷ aⁿ = aⁿ⁻ⁿ = a⁰, but also aⁿ/aⁿ = 1, so a⁰ = 1.", where_it_appears:"Polynomial constant term; empty product."},
      {case:"(−a)ⁿ sign", value:"positive if n even, negative if n odd", reasoning:"Even power of negative is positive; odd power is negative.", where_it_appears:"(−2)³ = −8; (−2)⁴ = 16."}
    ],
    key_takeaway:"Same base × or ÷ → add or subtract exponents; power of power → multiply exponents; these laws follow directly from the definition of exponents.",
    video_script_hooks:{
      opening_hook:"2³ × 2⁴ — you could expand and multiply. Or you could just write 2⁷ in one second. That's the product law.",
      concept_reveal:"The laws aren't rules to memorise blindly — they flow from what exponents mean: counting factors.",
      common_mistake_moment:"DIFFERENT bases? NO law applies. 2³ × 3⁴ ≠ 6⁷. You must compute each separately.",
      real_world_connection:"Physicists simplify equations like (r²)³ × r⁻¹ = r⁵ using these laws without ever expanding.",
      closing_hook:"Four laws, infinite power. Master them and algebraic expressions become drastically simpler."
    }
  }
},
{
  topicId:"cbse_math8_ch2_negative_exponents", chapterNumber:2, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Negative and Zero Exponents",
  key_formulas:[
    {formula:"a⁻ⁿ = 1 / aⁿ  (a ≠ 0)", explanation:"A negative exponent means take the reciprocal with a positive exponent."},
    {formula:"a⁰ = 1  (a ≠ 0)", explanation:"Any non-zero number raised to the power zero equals 1."}
  ],
  prerequisite_knowledge:["laws of exponents","reciprocals and fractions","quotient law of exponents"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Negative exponents extend the exponent pattern below zero — they represent fractions (reciprocals).",
      hook:"The pattern: 2³=8, 2²=4, 2¹=2, 2⁰=1, 2⁻¹=½, 2⁻²=¼ — each step divides by 2.",
      real_world_anchors:["nanometres (10⁻⁹ m)","milliseconds (10⁻³ s)","probability of rare events"],
      the_pivot_idea:"Negative exponents come from the quotient law: a¹/a³ = a¹⁻³ = a⁻² = 1/a². They are fractions, not negative numbers.",
      wrong_intuitions_to_replace:["'2⁻³ = −8' — No: 2⁻³ = 1/2³ = 1/8. Negative exponent ≠ negative number.","'a⁻ⁿ = −aⁿ' — Completely wrong. It's the reciprocal, not the negative."]
    },
    derivation:"From the quotient law: aᵐ/aⁿ = aᵐ⁻ⁿ. Set m = 0: a⁰/aⁿ = a⁻ⁿ. Since a⁰ = 1, we get 1/aⁿ = a⁻ⁿ. The definition is forced by the pattern of the laws.",
    worked_example:[
      {problem:"Simplify: (2/3)⁻²", steps:["(2/3)⁻² = 1/(2/3)²","= 1/(4/9)","= 9/4"], answer:"9/4"},
      {problem:"Evaluate: 5⁻¹ + 2⁻²", steps:["5⁻¹ = 1/5","2⁻² = 1/4","1/5 + 1/4 = 4/20 + 5/20"], answer:"9/20"}
    ],
    visual_description:"A number line of powers of 2 from 2⁻³ to 2³, showing the pattern ½, ¼, ⅛ on the negative side and 2, 4, 8 on the positive side, meeting at 2⁰ = 1 in the centre.",
    svg_diagrams:[{
      id:"cbse_math8_ch2_negative_exponents_pattern",
      title:"Pattern of powers of 2 through zero",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <text x="280" y="25" text-anchor="middle" fill="currentColor" font-size="15" font-weight="bold">Powers of 2: pattern through zero</text>
  ${[["2⁻³","1/8","#ea4335"],["2⁻²","1/4","#ea4335"],["2⁻¹","1/2","#ea4335"],["2⁰","1","#34a853"],["2¹","2","#4285f4"],["2²","4","#4285f4"],["2³","8","#4285f4"]].map(([exp,val,color],i)=>{
    const x = 30+i*72;
    return `<rect x="${x}" y="50" width="65" height="60" fill="${color}22" stroke="${color}" stroke-width="2" rx="6"/>
    <text x="${x+32}" y="75" text-anchor="middle" fill="${color}" font-weight="bold" font-size="14">${exp}</text>
    <text x="${x+32}" y="100" text-anchor="middle" fill="currentColor" font-size="13">${val}</text>`;
  }).join("")}
  <!-- arrows showing ÷2 pattern -->
  ${[0,1,2,3,4,5].map(i=>`<text x="${60+i*72}" y="145" text-anchor="middle" fill="currentColor" font-size="11">÷2</text>
  <line x1="${47+i*72}" y1="135" x2="${95+i*72}" y2="135" stroke="#888" stroke-width="1" marker-end="url(#arr)"/>`).join("")}
  <text x="280" y="190" text-anchor="middle" fill="#ea4335" font-size="13">Negative exponents = fractions (reciprocals)</text>
  <text x="280" y="215" text-anchor="middle" fill="currentColor">a⁻ⁿ = 1/aⁿ   e.g.  2⁻³ = 1/8   (NOT −8)</text>
  <text x="280" y="250" text-anchor="middle" fill="#34a853" font-size="13">a⁰ = 1 for any a ≠ 0</text>
  <rect x="80" y="265" width="400" height="30" fill="#fff8e1" stroke="#fbbc04" rx="4"/>
  <text x="280" y="285" text-anchor="middle" fill="#555">(2/3)⁻² = (3/2)² = 9/4  ←  flip base, make exponent positive</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"3⁻² = −9 (negative exponent gives negative number)", correction:"3⁻² = 1/3² = 1/9. The negative is in the exponent, not the value."},
      {wrong_idea:"(2/3)⁻¹ = −2/3", correction:"(2/3)⁻¹ = 3/2 (the reciprocal). Negative exponent flips the fraction."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Flip the base for negative exponents", rule:"(a/b)⁻ⁿ = (b/a)ⁿ", example:"(3/4)⁻³ = (4/3)³ = 64/27", when_to_use:"Any fraction raised to a negative power — flip then apply positive exponent."}
    ],
    when_to_use_this_method:{
      use_this_when:["Simplifying expressions with negative exponents","Writing small numbers in scientific notation (e.g. 0.001 = 10⁻³)","Physics / chemistry unit conversions"],
      use_other_when:["The exponent is positive — use standard rules","You need a decimal — convert after simplifying"]
    },
    edge_cases:[
      {case:"0⁻¹", value:"undefined", reasoning:"1/0 is undefined.", where_it_appears:"Division by zero — always check base ≠ 0 before applying negative exponents."},
      {case:"(−2)⁻³", value:"−1/8", reasoning:"(−2)⁻³ = 1/(−2)³ = 1/(−8) = −1/8.", where_it_appears:"Negative base with negative exponent — sign follows odd/even rule of the positive exponent."}
    ],
    key_takeaway:"a⁻ⁿ = 1/aⁿ — a negative exponent means reciprocal, not a negative value; a⁰ = 1 for any non-zero base.",
    video_script_hooks:{
      opening_hook:"2³ = 8, 2² = 4, 2¹ = 2, 2⁰ = 1 — what comes next? Keep dividing by 2: 2⁻¹ = ½. Negative exponents are just the pattern continuing below zero.",
      concept_reveal:"Negative exponent = reciprocal. That's the whole idea. a⁻ⁿ = 1/aⁿ.",
      common_mistake_moment:"3⁻² is NOT −9. It is 1/9. The negative lives in the exponent, not in the answer.",
      real_world_connection:"A nanometre is 10⁻⁹ metres. Computer chips are measured in nanometres — that's negative exponents in action.",
      closing_hook:"Negative exponents unlock the world of the very small: microbes, atoms, and quantum states all live in the land of 10⁻ⁿ."
    }
  }
},
{
  topicId:"cbse_math8_ch2_scientific_notation", chapterNumber:2, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Scientific Notation",
  key_formulas:[
    {formula:"a × 10ⁿ  where 1 ≤ a < 10, n ∈ ℤ", explanation:"Standard form: one digit before the decimal, the rest handled by the power of 10."},
    {formula:"To multiply: (a×10ᵐ)×(b×10ⁿ) = (a×b)×10ᵐ⁺ⁿ", explanation:"Multiply the decimal parts and add the exponents."}
  ],
  prerequisite_knowledge:["negative exponents","powers of 10","place value"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Scientific notation writes any number as a number between 1 and 10 multiplied by a power of 10.",
      hook:"The distance from Earth to the Sun is 150,000,000 km. Writing and counting those zeros is error-prone. 1.5 × 10⁸ is exact and instant to read.",
      real_world_anchors:["distance to planets (10⁸–10¹² km)","mass of an electron (9.1×10⁻³¹ kg)","national debt figures (10¹²)"],
      the_pivot_idea:"The power of 10 records how many places you moved the decimal — positive for large, negative for small.",
      wrong_intuitions_to_replace:["'The number before ×10ⁿ can be any number' — No: it must satisfy 1 ≤ a < 10.","'Moving decimal left always gives positive exponent' — Left = smaller number = negative exponent."]
    },
    derivation:"To convert 47,000: move decimal 4 places left to get 4.7; exponent = +4 (moved left). Result: 4.7×10⁴. To convert 0.00035: move 4 places right to get 3.5; exponent = −4 (moved right). Result: 3.5×10⁻⁴.",
    worked_example:[
      {problem:"Write 0.000000072 in scientific notation.", steps:["Move decimal 8 places right to get 7.2","Exponent = −8 (moved right)"], answer:"7.2 × 10⁻⁸"},
      {problem:"Multiply (3×10⁵) × (2×10⁻³).", steps:["Multiply decimals: 3×2 = 6","Add exponents: 5+(−3) = 2","Adjust: 6×10²"], answer:"6 × 10²  = 600"}
    ],
    visual_description:"A number line with Earth at the origin and labels at powers of 10 marking objects: 10¹ m (tree), 10⁶ m (small country), 10⁹ m (Moon distance), 10¹¹ m (Sun distance), illustrating the scale covered by scientific notation.",
    svg_diagrams:[{
      id:"cbse_math8_ch2_scientific_notation_conversion",
      title:"Converting to scientific notation",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <text x="280" y="30" text-anchor="middle" fill="currentColor" font-size="15" font-weight="bold">Scientific Notation Conversion</text>
  <!-- Large number -->
  <rect x="20" y="50" width="520" height="100" fill="#e8f4fd" stroke="#4285f4" stroke-width="2" rx="8"/>
  <text x="40" y="80" fill="currentColor" font-weight="bold">Large number:</text>
  <text x="40" y="110" fill="#4285f4" font-size="16">4 7 0 0 0 . 0  =  4.7 × 10⁴</text>
  <text x="40" y="138" fill="#888" font-size="11">Move decimal 4 places LEFT → exponent +4</text>
  <!-- Small number -->
  <rect x="20" y="165" width="520" height="100" fill="#fce8e6" stroke="#ea4335" stroke-width="2" rx="8"/>
  <text x="40" y="195" fill="currentColor" font-weight="bold">Small number:</text>
  <text x="40" y="225" fill="#ea4335" font-size="16">0 . 0 0 3 5  =  3.5 × 10⁻³</text>
  <text x="40" y="253" fill="#888" font-size="11">Move decimal 3 places RIGHT → exponent −3</text>
  <!-- Rule box -->
  <rect x="20" y="278" width="520" height="30" fill="#fff8e1" stroke="#fbbc04" rx="4"/>
  <text x="280" y="298" text-anchor="middle" fill="#555">1 ≤ a &lt; 10  |  left move → +exp  |  right move → −exp</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"53 × 10⁴ is scientific notation", correction:"The coefficient must satisfy 1 ≤ a < 10. Write 5.3 × 10⁵ instead."},
      {wrong_idea:"Moving decimal right gives positive exponent", correction:"Moving right makes the number smaller → negative exponent. 0.00045 = 4.5 × 10⁻⁴."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Count the zeros trick for powers of 10", rule:"10ⁿ has exactly n zeros (for positive n)", example:"10⁶ = 1,000,000 — count 6 zeros", when_to_use:"Quickly reading or writing powers of 10 without computation."}
    ],
    when_to_use_this_method:{
      use_this_when:["Expressing very large or very small numbers without zeros","Multiplying or dividing numbers with many zeros","Comparing magnitudes of quantities in science"],
      use_other_when:["Everyday numbers (no need for 3.5×10¹ when you can write 35)","Adding/subtracting — align powers of 10 first, may be easier in standard form"]
    },
    edge_cases:[
      {case:"Boundary: a = 10", value:"Must adjust: 10 × 10³ = 1 × 10⁴", reasoning:"Coefficient must be strictly less than 10.", where_it_appears:"Multiplying in scientific notation may push coefficient to 10 or above."},
      {case:"a = 1 exactly", value:"1 × 10ⁿ = 10ⁿ", reasoning:"Allowed; 1 ≤ 1 < 10.", where_it_appears:"1 × 10⁶ = 1,000,000."}
    ],
    key_takeaway:"Scientific notation = a × 10ⁿ where 1 ≤ a < 10; positive n for large numbers (decimal moved left), negative n for small numbers (decimal moved right).",
    video_script_hooks:{
      opening_hook:"0.00000000091 kg — that's the mass of an electron. Every zero is a chance to make an error. Scientists write 9.1 × 10⁻³¹ and never miscount again.",
      concept_reveal:"Scientific notation is about moving the decimal to exactly the right spot and recording how many places you moved it as a power of 10.",
      common_mistake_moment:"73 × 10⁴ is NOT scientific notation. The front number must be between 1 and 10. Write 7.3 × 10⁵.",
      real_world_connection:"Astronomers, physicists, and economists all live in a world of extreme numbers — scientific notation is their universal language.",
      closing_hook:"From the size of an atom to the distance to a galaxy — one notation handles it all."
    }
  }
},

// ── Ch3: A Story of Numbers ───────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch3_number_systems", chapterNumber:3, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"The Number System Story",
  key_formulas:[
    {formula:"ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ", explanation:"Natural numbers are contained in integers, which are in rationals, which are in reals — each set is an extension."},
    {formula:"ℚ = {p/q : p,q ∈ ℤ, q ≠ 0}", explanation:"The set of all rational numbers — fractions of integers."}
  ],
  prerequisite_knowledge:["natural numbers","integers","fractions and decimals"],
  teaching_content:{
    intuition:{
      elevator_pitch:"The number system grew in stages as people needed to solve problems that couldn't be answered with the numbers they had.",
      hook:"Farmers counted sheep (natural numbers). Trade required zero and debt (integers). Sharing equally demanded fractions (rationals). Measuring diagonals revealed irrationals. Each problem expanded the number set.",
      real_world_anchors:["natural: counting apples","integers: temperature below zero","rational: dividing a pizza","irrational: √2 = diagonal of a unit square"],
      the_pivot_idea:"Each number system extends the previous one to solve a problem that was impossible before — this is the story of mathematical necessity.",
      wrong_intuitions_to_replace:["'All decimals are rational' — Infinite non-repeating decimals like π are irrational.","'Integers include all fractions' — Integers are whole numbers only; no fractions."]
    },
    derivation:"ℕ = {1,2,3,…} solves counting. Adding 0 gives whole numbers. Adding negatives gives ℤ, closing subtraction. Taking ratios p/q gives ℚ, closing division (except by 0). Adding irrationals (√2, π) gives ℝ, closing square roots of non-negatives.",
    worked_example:[
      {problem:"Classify: −4, 0, ¾, √7, 5", steps:["−4: integer (negative whole number)","0: whole number, integer","¾: rational (fraction p/q)","√7: irrational (not a perfect square)","5: natural number"], answer:"All are real; 5 is natural/integer/rational too"},
      {problem:"Give an example of a number that is rational but not an integer.", steps:["Must be p/q with q ≠ ±1","Example: 3/5 = 0.6"], answer:"3/5"}
    ],
    visual_description:"Nested oval diagram (Venn-style): innermost oval labelled ℕ inside ℤ inside ℚ inside ℝ, with example numbers placed in the correct region: 5 in ℕ, −3 in ℤ, ½ in ℚ, √2 in ℝ only.",
    svg_diagrams:[{
      id:"cbse_math8_ch3_number_system_venn",
      title:"Nested number system Venn diagram",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <ellipse cx="280" cy="160" rx="250" ry="145" fill="#fce8e6" stroke="#ea4335" stroke-width="2"/>
  <ellipse cx="280" cy="160" rx="195" ry="110" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <ellipse cx="280" cy="160" rx="140" ry="78" fill="#e6f4ea" stroke="#34a853" stroke-width="2"/>
  <ellipse cx="280" cy="160" rx="85" ry="48" fill="#fff8e1" stroke="#fbbc04" stroke-width="2"/>
  <text x="280" y="155" text-anchor="middle" fill="#fbbc04" font-weight="bold">ℕ</text>
  <text x="280" y="172" text-anchor="middle" fill="#888" font-size="11">1, 2, 3, 4, 5…</text>
  <text x="180" y="200" fill="#34a853" font-weight="bold">ℤ</text>
  <text x="145" y="218" fill="#888" font-size="11">−3, −1, 0</text>
  <text x="105" y="178" fill="#4285f4" font-weight="bold">ℚ</text>
  <text x="85" y="195" fill="#888" font-size="11">½, −¾</text>
  <text x="50" y="148" fill="#ea4335" font-weight="bold">ℝ</text>
  <text x="28" y="165" fill="#888" font-size="11">√2, π</text>
  <!-- labels on right -->
  <text x="490" y="55" fill="#ea4335">ℝ = Real</text>
  <text x="490" y="105" fill="#4285f4">ℚ = Rational</text>
  <text x="490" y="155" fill="#34a853">ℤ = Integer</text>
  <text x="490" y="205" fill="#fbbc04">ℕ = Natural</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"All decimals are rational numbers", correction:"0.333… = 1/3 is rational. But 0.101001000… (non-repeating, non-terminating) is irrational."},
      {wrong_idea:"Integers include fractions like ½", correction:"Integers are …,−2,−1,0,1,2,… — only whole numbers, no fractions."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Classify by checking membership criteria", rule:"Is it whole? → ℕ or ℤ. Is it p/q? → ℚ. Is it repeating decimal? → ℚ. Is it √ of non-perfect square? → irrational.", example:"√9 = 3 → ℕ. √10 is irrational.", when_to_use:"Any classification question."}
    ],
    when_to_use_this_method:{
      use_this_when:["Classifying numbers into the correct set","Proving a number is irrational","Understanding why certain operations produce different types of numbers"],
      use_other_when:["You just need to compute — classification is for understanding, not routine arithmetic"]
    },
    edge_cases:[
      {case:"0", value:"0 ∈ ℕ by some definitions, always ∈ ℤ ⊂ ℚ ⊂ ℝ", reasoning:"0 is whole, integer, and rational (0 = 0/1). Whether 0 ∈ ℕ depends on the convention.", where_it_appears:"Be careful in problems that say 'natural numbers' — clarify if 0 is included."},
      {case:"√4 = 2", value:"rational/integer/natural", reasoning:"Perfect square roots are rational integers — don't assume all square roots are irrational.", where_it_appears:"√4, √9, √16 are integers; √5, √7 are irrational."}
    ],
    key_takeaway:"ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ — each set includes the previous; rationals have repeating/terminating decimals; irrationals have non-repeating, non-terminating decimals.",
    video_script_hooks:{
      opening_hook:"Humans invented numbers one crisis at a time: counting came first, then debt, then sharing, then diagonals — each invention built on the last.",
      concept_reveal:"The number system is a set of nested containers: every natural number is an integer, every integer is rational, every rational is real.",
      common_mistake_moment:"Is 0.666… rational? Yes! It equals 2/3. But 0.101001000… is irrational — no pattern, no fraction.",
      real_world_connection:"Engineers use ℝ for measurements, accountants use ℚ for money, and programmers debate whether 0 belongs to ℕ — number systems matter.",
      closing_hook:"Numbers grew because mathematicians refused to say 'that's impossible.' Every new set was a refusal to give up."
    }
  }
},
{
  topicId:"cbse_math8_ch3_integers_operations", chapterNumber:3, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Integers and Their Operations",
  key_formulas:[
    {formula:"(+a) + (−b) = a − b  (if a > b)", explanation:"Adding a negative is the same as subtracting its absolute value."},
    {formula:"(−a) × (−b) = +ab  and  (+a) × (−b) = −ab", explanation:"Sign rules for multiplication and division."}
  ],
  prerequisite_knowledge:["number line","absolute value","natural number arithmetic"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Integers extend counting numbers to include zero and negatives so we can model debt, temperature below zero, and directions.",
      hook:"Temperature is 4°C at 6 am and drops by 7°C. The new temperature is 4 − 7 = −3°C. Integers let us go below zero.",
      real_world_anchors:["temperature (°C below zero)","bank balance (overdraft = negative)","altitude (below sea level = negative metres)"],
      the_pivot_idea:"Negative numbers are not abstract — they represent quantities in the opposite direction. The number line makes this visual.",
      wrong_intuitions_to_replace:["'Subtracting always makes smaller' — 5 − (−3) = 8, which is larger.","'Two negatives cancel to zero' — (−3)+(−4) = −7, not 0. Two negatives ADD in magnitude."]
    },
    derivation:"Addition on a number line: start at the first number, move right for + and left for −. Multiplication sign rules follow from the distributive property: (−1)×(−1) = 1 because (−1)×(1 + (−1)) = 0 means (−1)×1 + (−1)×(−1) = 0, so (−1)×(−1) = 1.",
    worked_example:[
      {problem:"Evaluate: −12 + 8 − (−5)", steps:["= −12 + 8 + 5  (subtracting a negative = adding)","= −12 + 13","= 1"], answer:"1"},
      {problem:"Evaluate: (−4) × (−3) ÷ (−2)", steps:["(−4)×(−3) = +12","12 ÷ (−2) = −6"], answer:"−6"}
    ],
    visual_description:"A horizontal number line from −8 to 8 with coloured arrows showing (a) 3 + (−5) = −2 stepping left and (b) −4 − (−2) = −2 stepping right, demonstrating the direction model.",
    svg_diagrams:[{
      id:"cbse_math8_ch3_integers_number_line",
      title:"Integer operations on the number line",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- number line -->
  <line x1="20" y1="140" x2="540" y2="140" stroke="currentColor" stroke-width="2"/>
  ${[-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7].map((n,i)=>`
  <line x1="${56+i*30}" y1="133" x2="${56+i*30}" y2="147" stroke="currentColor" stroke-width="1.5"/>
  <text x="${56+i*30}" y="162" text-anchor="middle" fill="currentColor" font-size="11">${n}</text>`).join("")}
  <!-- Example 1: 3 + (−5) = −2 -->
  <text x="280" y="30" text-anchor="middle" fill="currentColor" font-weight="bold">Example: 3 + (−5)</text>
  <!-- start at 3 -->
  <circle cx="146" cy="140" r="5" fill="#4285f4"/>
  <text x="146" y="120" text-anchor="middle" fill="#4285f4" font-size="11">start: 3</text>
  <!-- move 5 left -->
  <line x1="141" y1="110" x2="86" y2="110" stroke="#ea4335" stroke-width="2" marker-end="url(#rarr)"/>
  <text x="113" y="103" text-anchor="middle" fill="#ea4335" font-size="11">−5 (move left)</text>
  <!-- end at -2 -->
  <circle cx="86" cy="140" r="5" fill="#34a853"/>
  <text x="86" y="175" text-anchor="middle" fill="#34a853" font-size="11">= −2</text>
  <!-- sign rules table -->
  <rect x="300" y="190" width="240" height="110" fill="#f8f9fa" stroke="#dee2e6" rx="6"/>
  <text x="420" y="213" text-anchor="middle" fill="currentColor" font-weight="bold">Sign Rules (× and ÷)</text>
  <text x="320" y="238" fill="#34a853">(+) × (+) = +</text>
  <text x="430" y="238" fill="#ea4335">(+) × (−) = −</text>
  <text x="320" y="263" fill="#ea4335">(−) × (+) = −</text>
  <text x="430" y="263" fill="#34a853">(−) × (−) = +</text>
  <text x="420" y="290" text-anchor="middle" fill="#888" font-size="11">Same signs → +   Different → −</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"(−3) − (−5) = −8 (subtract magnitudes)", correction:"(−3) − (−5) = −3 + 5 = 2. Subtracting a negative is the same as adding its positive."},
      {wrong_idea:"(−2) × (−3) = −6 (two negatives stay negative)", correction:"Two negatives multiply to positive: (−2)×(−3) = +6. Only addition of two negatives stays negative."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Same-sign / different-sign rule for ×÷", rule:"Same signs → positive product. Different signs → negative product.", example:"(−3)×(−4) = +12; (−3)×(+4) = −12", when_to_use:"Every integer multiplication and division problem."}
    ],
    when_to_use_this_method:{
      use_this_when:["Computing with temperatures, depths, profits/losses, directions","Evaluating algebraic expressions with negative substitutions","Solving equations that involve integers"],
      use_other_when:["All numbers are positive — standard arithmetic applies"]
    },
    edge_cases:[
      {case:"(−a) + (+a) = 0", value:"0", reasoning:"Additive inverses sum to zero.", where_it_appears:"Balancing equations; proving properties."},
      {case:"Division: (−a) ÷ 0", value:"undefined", reasoning:"Division by zero is undefined regardless of sign.", where_it_appears:"Always check denominator ≠ 0 before dividing."}
    ],
    key_takeaway:"Subtraction of a negative = addition; for multiplication/division, same signs give positive, different signs give negative.",
    video_script_hooks:{
      opening_hook:"Your bank account has ₹200. You spend ₹350. You're in debt by ₹150. That's −150 — integers in your pocket.",
      concept_reveal:"Direction is the key idea: positive means one direction, negative means the opposite. Addition goes right, subtraction goes left.",
      common_mistake_moment:"(−3)−(−5) is NOT −8. Subtracting a negative ADDS. −3+5 = 2.",
      real_world_connection:"Elevators go up (+) and down (−). Divers descend (−). Pilots ascend (+). Every directed quantity uses integers.",
      closing_hook:"Integers are the language of direction — master the sign rules and you master any directed quantity."
    }
  }
},
{
  topicId:"cbse_math8_ch3_rational_numbers", chapterNumber:3, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Rational Numbers",
  key_formulas:[
    {formula:"p/q  (p,q ∈ ℤ, q ≠ 0)", explanation:"A rational number is any ratio of two integers with non-zero denominator."},
    {formula:"Decimal form: terminating or repeating", explanation:"Every rational number has a decimal expansion that either terminates or repeats in a cycle."}
  ],
  prerequisite_knowledge:["fractions","integers","LCM and HCF"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A rational number is any quantity that can be expressed exactly as a fraction — a ratio of two whole numbers.",
      hook:"Share a 3 m rope equally among 4 people: each gets 3/4 m. Rational numbers are the mathematics of fair sharing.",
      real_world_anchors:["recipes (¾ cup of sugar)","currency (₹12.50 = 25/2)","probability (3 out of 5 = 3/5)"],
      the_pivot_idea:"Rational = ratio. If you can write it as 'something divided by something (non-zero)', it's rational.",
      wrong_intuitions_to_replace:["'Decimals are not fractions' — 0.75 = 3/4; terminating and repeating decimals are rational.","'Larger denominator = larger number' — 1/2 > 1/4 even though 4 > 2."]
    },
    derivation:"p/q and r/s are equal iff ps = qr (cross multiplication). To add: p/q + r/s = (ps + qr)/qs. These operations always produce another rational number (ℚ is closed under +, −, ×, ÷ except division by 0).",
    worked_example:[
      {problem:"Add: −3/4 + 5/6", steps:["LCD of 4 and 6 = 12","−3/4 = −9/12, 5/6 = 10/12","−9/12 + 10/12 = 1/12"], answer:"1/12"},
      {problem:"Divide: −7/8 ÷ 14/16", steps:["= −7/8 × 16/14  (reciprocal)","= (−7×16)/(8×14) = −112/112","= −1"], answer:"−1"}
    ],
    visual_description:"A number line from −2 to 2 showing positions of several rational numbers: −3/2, −1/4, 0, 1/3, 7/4, with each fraction placed precisely between the integers it lies between.",
    svg_diagrams:[{
      id:"cbse_math8_ch3_rational_number_line",
      title:"Rational numbers on the number line",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- number line -->
  <line x1="30" y1="160" x2="530" y2="160" stroke="currentColor" stroke-width="2"/>
  ${[-2,-1,0,1,2].map((n,i)=>`
  <line x1="${30+i*125}" y1="150" x2="${30+i*125}" y2="170" stroke="currentColor" stroke-width="2"/>
  <text x="${30+i*125}" y="188" text-anchor="middle" fill="currentColor" font-weight="bold">${n}</text>`).join("")}
  <!-- rational number positions -->
  ${[["−3/2",-1.5,"#ea4335"],["−1/4",-0.25,"#fbbc04"],["1/3",0.333,"#34a853"],["7/4",1.75,"#4285f4"]].map(([label,v,color])=>{
    const x = 280+v*125;
    return `<circle cx="${x}" cy="160" r="5" fill="${color}"/>
    <line x1="${x}" y1="130" x2="${x}" y2="155" stroke="${color}" stroke-width="1.5"/>
    <text x="${x}" y="122" text-anchor="middle" fill="${color}" font-size="12">${label}</text>`;
  }).join("")}
  <!-- properties box -->
  <rect x="20" y="210" width="520" height="90" fill="#f8f9fa" stroke="#dee2e6" rx="6"/>
  <text x="280" y="232" text-anchor="middle" fill="currentColor" font-weight="bold">Key Properties of Rational Numbers</text>
  <text x="40" y="255" fill="currentColor">• Closed under +, −, ×, ÷ (÷0 excluded)</text>
  <text x="40" y="278" fill="currentColor">• Decimal: terminating (½=0.5) or repeating (1/3=0.333…)</text>
  <text x="40" y="298" fill="currentColor">• Infinitely many rationals between any two rationals</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"0.333… is not a fraction / is approximate", correction:"0.333… = 1/3 exactly. Repeating decimals are perfectly rational — the repetition is the exact value."},
      {wrong_idea:"To compare p/q and r/s, compare p and r (numerators)", correction:"Compare by cross-multiplying: 3/4 vs 5/7 → 3×7=21 vs 5×4=20; since 21>20, 3/4 > 5/7."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Rational between two rationals", rule:"Average of any two rationals is a rational between them: (a/b + c/d)/2", example:"Between 1/3 and 1/2: average = 5/12", when_to_use:"Finding a rational number between two given rationals."}
    ],
    when_to_use_this_method:{
      use_this_when:["Working with fractions and mixed numbers","Precise division (sharing resources)","Probability problems with fractional outcomes"],
      use_other_when:["The answer must be an integer — check divisibility first","Approximation is acceptable — use decimals"]
    },
    edge_cases:[
      {case:"0 = 0/1 is rational", value:"0", reasoning:"0 divided by any non-zero integer is 0.", where_it_appears:"0 is on the boundary of the rational number line."},
      {case:"Every integer n = n/1 is rational", value:"rational", reasoning:"Any integer can be written with denominator 1.", where_it_appears:"ℤ ⊂ ℚ; integers are a special case of rationals."}
    ],
    key_takeaway:"Rational numbers = p/q (q≠0); their decimals terminate or repeat; they are closed under all arithmetic operations except division by zero.",
    video_script_hooks:{
      opening_hook:"Three friends share ₹100 equally. Each gets ₹33.33… — that repeating decimal is the rational number 100/3.",
      concept_reveal:"Rational = ratio. Can you write it as a/b with b≠0? Then it's rational — simple as that.",
      common_mistake_moment:"0.333… is NOT approximately 1/3 — it IS 1/3, exactly, perfectly, forever.",
      real_world_connection:"Recipes, currency, measurements, maps, probability — everything that involves exact division uses rational numbers.",
      closing_hook:"Between any two fractions on the number line, there are infinitely more. Rationals are dense — they're everywhere."
    }
  }
},
{
  topicId:"cbse_math8_ch3_irrational_numbers", chapterNumber:3, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Irrational Numbers",
  key_formulas:[
    {formula:"√p is irrational if p is not a perfect square", explanation:"Square roots of non-perfect-square integers are always irrational."},
    {formula:"π ≈ 3.14159… (non-terminating, non-repeating)", explanation:"Pi is the most famous irrational — its decimal never repeats or ends."}
  ],
  prerequisite_knowledge:["rational numbers","perfect squares","decimal expansions"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Irrational numbers cannot be written as a fraction — their decimals go on forever without ever repeating.",
      hook:"A square tile has area 2 m². What is the side length? √2 = 1.41421356… — the digits never form a pattern. That's irrational.",
      real_world_anchors:["diagonal of a unit square (√2)","circumference/diameter ratio (π)","golden ratio φ in nature"],
      the_pivot_idea:"Irrational means 'cannot be expressed as a ratio' — the number exists on the number line but cannot be pinpointed by any fraction.",
      wrong_intuitions_to_replace:["'√4 is irrational because it's a square root' — √4 = 2 is rational. Only non-perfect-square roots are irrational.","'Irrational means nonsensical' — It means not a ratio, not meaningless."]
    },
    derivation:"Proof that √2 is irrational (by contradiction): suppose √2 = p/q in lowest terms. Then 2 = p²/q², so p² = 2q², meaning p is even (p = 2m). Then 4m² = 2q², so q² = 2m², meaning q is also even. But p and q were both in lowest terms — contradiction. Therefore √2 ∉ ℚ.",
    worked_example:[
      {problem:"Classify √18 as rational or irrational.", steps:["18 = 9 × 2 = 3² × 2","√18 = 3√2","√2 is irrational; 3 × irrational = irrational"], answer:"Irrational (= 3√2)"},
      {problem:"Is 0.101001000100001… rational or irrational?", steps:["The pattern of zeros increases — the decimal never repeats","Non-repeating, non-terminating"], answer:"Irrational"}
    ],
    visual_description:"A magnified section of the number line around 1 to 2, showing √2 ≈ 1.414 marked precisely between the rational numbers 1.41 and 1.42, illustrating how irrationals fill the 'gaps' between rationals.",
    svg_diagrams:[{
      id:"cbse_math8_ch3_irrational_number_line",
      title:"√2 on the number line via the unit square diagonal",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- unit square -->
  <rect x="60" y="80" width="120" height="120" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="120" y="155" text-anchor="middle" fill="currentColor">1</text>
  <text x="60" y="155" text-anchor="middle" fill="currentColor" transform="rotate(-90,60,155)">1</text>
  <!-- diagonal -->
  <line x1="60" y1="200" x2="180" y2="80" stroke="#ea4335" stroke-width="2"/>
  <text x="130" y="130" fill="#ea4335" font-size="12">√2</text>
  <!-- number line below -->
  <line x1="30" y1="260" x2="530" y2="260" stroke="currentColor" stroke-width="2"/>
  ${[0,1,2].map((n,i)=>`<line x1="${30+i*200}" y1="252" x2="${30+i*200}" y2="268" stroke="currentColor" stroke-width="2"/>
  <text x="${30+i*200}" y="282" text-anchor="middle" fill="currentColor" font-weight="bold">${n}</text>`).join("")}
  <!-- arc from diagonal to number line -->
  <path d="M 180 200 Q 195 230 230 260" fill="none" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="4,3"/>
  <circle cx="313" cy="260" r="5" fill="#ea4335"/>
  <text x="313" y="250" text-anchor="middle" fill="#ea4335" font-size="11">√2≈1.414…</text>
  <!-- properties -->
  <text x="350" y="100" fill="currentColor" font-weight="bold">Irrational numbers:</text>
  <text x="350" y="125" fill="currentColor">• Non-terminating</text>
  <text x="350" y="150" fill="currentColor">• Non-repeating decimal</text>
  <text x="350" y="175" fill="#ea4335">√2 = 1.41421356…</text>
  <text x="350" y="200" fill="#4285f4">π = 3.14159265…</text>
  <text x="350" y="225" fill="#34a853">φ = 1.61803398…</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"All square roots are irrational", correction:"√4 = 2, √9 = 3, √25 = 5 are all rational integers. Only non-perfect-square roots are irrational."},
      {wrong_idea:"3.14 = π", correction:"π = 3.14159… — the value 3.14 is a rational approximation, not the exact value."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Check for perfect square first", rule:"If √n can be computed exactly (no remainder), it's rational; otherwise irrational.", example:"√144 = 12 (rational); √150 — no exact integer root (irrational)", when_to_use:"Every time you encounter a square root."}
    ],
    when_to_use_this_method:{
      use_this_when:["Proving a number cannot be expressed as a fraction","Working with diagonal and circular measurements","Identifying the nature of solutions to quadratic equations"],
      use_other_when:["You only need an approximate decimal — use a calculator","The number is a perfect square — the root is rational"]
    },
    edge_cases:[
      {case:"Sum of irrationals can be rational", value:"rational", reasoning:"√2 + (−√2) = 0, which is rational.", where_it_appears:"Irrational × irrational can also be rational: √2 × √2 = 2."},
      {case:"π and e are transcendental", value:"irrational", reasoning:"Not just irrational but also not roots of any polynomial — transcendental.", where_it_appears:"Advanced: π appears in circle formulas; e in exponential growth."}
    ],
    key_takeaway:"Irrational numbers are real but cannot be written as p/q; their decimals are non-terminating and non-repeating; √p is irrational unless p is a perfect square.",
    video_script_hooks:{
      opening_hook:"A square with area 2 m². The side is √2 = 1.41421356… The digits go on forever, with no pattern. That's irrational.",
      concept_reveal:"Irrational doesn't mean impossible — it means 'not a ratio.' The number is real and exact, but no fraction can capture it.",
      common_mistake_moment:"√9 is NOT irrational — it equals 3. Only non-perfect-square roots are irrational.",
      real_world_connection:"Pi, golden ratio, square roots — irrationals appear in architecture, art, music, and physics. They're not rare exceptions; they're everywhere.",
      closing_hook:"Irrationals fill the gaps that rationals leave on the number line. Between any two fractions, infinitely many irrationals hide."
    }
  }
},

,

// ── Ch4: Quadrilaterals ───────────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch4_quadrilateral_types", chapterNumber:4, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Types of Quadrilaterals",
  key_formulas:[
    {formula:"Sum of interior angles of any quadrilateral = 360°", explanation:"Every quadrilateral can be split into two triangles (2×180°=360°)."},
    {formula:"Parallelogram area = base × height", explanation:"Applies to squares, rectangles, rhombuses, and parallelograms."}
  ],
  prerequisite_knowledge:["triangles and their properties","parallel lines","angle sum of a triangle"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Quadrilaterals are four-sided polygons classified by which sides are parallel and which angles are equal.",
      hook:"A rectangle, a rhombus, and a square all look different — but they're all parallelograms. The Venn diagram of quadrilaterals is surprisingly compact.",
      real_world_anchors:["rectangular room","diamond (rhombus) shapes on cards","trapezoidal bridges and roofs"],
      the_pivot_idea:"The hierarchy of quadrilaterals is based on symmetry: adding constraints (parallel, equal, right-angled) moves you from general → special cases.",
      wrong_intuitions_to_replace:["'A square is not a rectangle' — Wrong: a square satisfies all rectangle properties plus equal sides.","'A rhombus is a diamond shape and nothing else' — A rhombus is defined by equal sides, not by orientation."]
    },
    derivation:"Draw diagonal AC in quadrilateral ABCD. It splits into △ABC and △ACD. Each triangle's angles sum to 180°. Combined: all four angles of ABCD sum to 360°.",
    worked_example:[
      {problem:"Three angles of a quadrilateral are 85°, 110°, 95°. Find the fourth.", steps:["Sum = 360°","Fourth = 360° − (85+110+95)","= 360° − 290°"], answer:"70°"},
      {problem:"Classify a shape with 4 equal sides and no right angles.", steps:["Equal sides → not a rectangle","No right angles → not a square","4 equal sides, opposite sides parallel"], answer:"Rhombus"}
    ],
    visual_description:"A hierarchical tree diagram showing Quadrilateral at the top, branching into Parallelogram (with children Rectangle, Rhombus; Rectangle and Rhombus overlap to form Square) and Trapezium, and Kite as a separate branch.",
    svg_diagrams:[{
      id:"cbse_math8_ch4_quadrilateral_hierarchy",
      title:"Hierarchy of quadrilaterals",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <!-- Quadrilateral -->
  <rect x="200" y="10" width="160" height="36" rx="6" fill="#4285f4" />
  <text x="280" y="33" text-anchor="middle" fill="white" font-weight="bold">Quadrilateral</text>
  <!-- lines down -->
  <line x1="280" y1="46" x2="140" y2="90" stroke="#888" stroke-width="1.5"/>
  <line x1="280" y1="46" x2="280" y2="90" stroke="#888" stroke-width="1.5"/>
  <line x1="280" y1="46" x2="420" y2="90" stroke="#888" stroke-width="1.5"/>
  <!-- Parallelogram -->
  <rect x="60" y="90" width="160" height="36" rx="6" fill="#34a853"/>
  <text x="140" y="113" text-anchor="middle" fill="white" font-weight="bold">Parallelogram</text>
  <!-- Trapezium -->
  <rect x="200" y="90" width="160" height="36" rx="6" fill="#ea4335"/>
  <text x="280" y="113" text-anchor="middle" fill="white" font-weight="bold">Trapezium</text>
  <!-- Kite -->
  <rect x="340" y="90" width="120" height="36" rx="6" fill="#fbbc04"/>
  <text x="400" y="113" text-anchor="middle" fill="white" font-weight="bold">Kite</text>
  <!-- children of parallelogram -->
  <line x1="140" y1="126" x2="80" y2="175" stroke="#888" stroke-width="1.5"/>
  <line x1="140" y1="126" x2="200" y2="175" stroke="#888" stroke-width="1.5"/>
  <rect x="20" y="175" width="120" height="36" rx="6" fill="#b8d0fb"/>
  <text x="80" y="198" text-anchor="middle" fill="#1a1a1a" font-weight="bold">Rectangle</text>
  <rect x="140" y="175" width="120" height="36" rx="6" fill="#b8d0fb"/>
  <text x="200" y="198" text-anchor="middle" fill="#1a1a1a" font-weight="bold">Rhombus</text>
  <!-- Square is intersection -->
  <line x1="80" y1="211" x2="140" y2="255" stroke="#888" stroke-width="1.5"/>
  <line x1="200" y1="211" x2="140" y2="255" stroke="#888" stroke-width="1.5"/>
  <rect x="80" y="255" width="120" height="36" rx="6" fill="#4285f4"/>
  <text x="140" y="278" text-anchor="middle" fill="white" font-weight="bold">Square</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"A square is NOT a rectangle (they look different)", correction:"A square IS a special rectangle — it has all rectangle properties (4 right angles, opposite sides equal) plus the extra property that all 4 sides are equal."},
      {wrong_idea:"Parallelograms and rectangles are the same", correction:"All rectangles are parallelograms, but not vice versa. A parallelogram has opposite sides parallel; a rectangle additionally has right angles."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Diagonal method for missing angle", rule:"Sum all known angles, subtract from 360°.", example:"Angles 70°, 80°, 120° → fourth = 360−270 = 90°", when_to_use:"Any problem asking for the unknown angle of a quadrilateral."}
    ],
    when_to_use_this_method:{
      use_this_when:["Classifying shapes in geometry problems","Applying the correct area formula for a quadrilateral","Designing floor plans or tile patterns"],
      use_other_when:["The shape has more than 4 sides — use the polygon angle formula","You need perimeter, not area — sum all sides"]
    },
    edge_cases:[
      {case:"All angles 90°", value:"Rectangle (or square)", reasoning:"Four right angles force opposite sides to be parallel and equal.", where_it_appears:"Any rectangular room or tile."},
      {case:"Only one pair of parallel sides", value:"Trapezium", reasoning:"Parallelogram requires TWO pairs; trapezium has exactly one.", where_it_appears:"Bridges, roofs, and cross-sections of ramps."}
    ],
    key_takeaway:"All quadrilateral angles sum to 360°; quadrilaterals form a hierarchy — square is the most constrained, general quadrilateral the least.",
    video_script_hooks:{
      opening_hook:"A square, a rectangle, a rhombus — what do they have in common? More than you think. Let's build the quadrilateral family tree.",
      concept_reveal:"Quadrilaterals are classified by their constraints. Add parallel sides → parallelogram. Add equal sides → rhombus. Add right angles → rectangle. Add both → square.",
      common_mistake_moment:"'A square is not a rectangle' — Stop! A square IS a rectangle — the most perfect rectangle of all.",
      real_world_connection:"Architecture uses every quadrilateral type: rectangular rooms, trapezoidal windows, rhombus tiles. Each has a purpose.",
      closing_hook:"Learn the hierarchy and you'll never confuse these shapes again — they're a family, not strangers."
    }
  }
},
{
  topicId:"cbse_math8_ch4_quadrilateral_properties", chapterNumber:4, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Properties of Quadrilaterals",
  key_formulas:[
    {formula:"Parallelogram: opposite sides equal and parallel; opposite angles equal; diagonals bisect each other", explanation:"Four defining properties of a parallelogram."},
    {formula:"Rectangle: all angles 90°; diagonals equal and bisecting each other", explanation:"Rectangle adds right angles and equal diagonals to parallelogram properties."}
  ],
  prerequisite_knowledge:["types of quadrilaterals","parallel lines and transversals","congruence of triangles"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Each quadrilateral type has a set of provable properties that follow from its definition — learning the properties unlocks problem-solving shortcuts.",
      hook:"Why do parallelogram opposite angles always match? Because the two triangles formed by a diagonal are congruent — a hidden symmetry.",
      real_world_anchors:["rectangle windows (equal diagonals check)","rhombus kite shape (perpendicular diagonals)","parallelogram scissors-lift platform"],
      the_pivot_idea:"Properties are not arbitrary facts — they're theorems that follow from the definition, provable by drawing diagonals and using congruent triangles.",
      wrong_intuitions_to_replace:["'All sides of a parallelogram are equal' — Only opposite sides are equal.","'All quadrilateral diagonals bisect each other' — Only parallelograms have this property."]
    },
    derivation:"In parallelogram ABCD, diagonal AC creates △ABC and △CDA. AB∥CD (given), so ∠BAC = ∠DCA (alt. angles) and ∠BCA = ∠DAC. AC is common. By ASA, △ABC ≅ △CDA. Therefore AB = CD and BC = DA. Also ∠ABC = ∠CDA (opposite angles equal).",
    worked_example:[
      {problem:"In parallelogram PQRS, ∠P = 70°. Find all angles.", steps:["Opposite angles: ∠R = ∠P = 70°","Adjacent angles supplementary: ∠Q = 180°−70° = 110°","∠S = ∠Q = 110°"], answer:"∠P=70°, ∠Q=110°, ∠R=70°, ∠S=110°"},
      {problem:"Diagonal of a rectangle is 13 cm. One side is 5 cm. Find the other side.", steps:["Diagonals of rectangle are equal and bisect each other","Use Pythagoras: 5² + b² = 13²","b² = 169 − 25 = 144, b = 12"], answer:"12 cm"}
    ],
    visual_description:"A labelled parallelogram ABCD with arrows indicating equal sides (AB=CD, BC=DA), arc marks showing equal opposite angles, and dashed diagonals intersecting at midpoint O with tick marks showing bisection.",
    svg_diagrams:[{
      id:"cbse_math8_ch4_parallelogram_properties",
      title:"Properties of a parallelogram",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- parallelogram ABCD -->
  <polygon points="80,240 200,100 440,100 320,240" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <!-- labels -->
  <text x="65" y="255" fill="currentColor" font-weight="bold">A</text>
  <text x="190" y="92" fill="currentColor" font-weight="bold">B</text>
  <text x="445" y="92" fill="currentColor" font-weight="bold">C</text>
  <text x="322" y="255" fill="currentColor" font-weight="bold">D</text>
  <!-- diagonals -->
  <line x1="80" y1="240" x2="440" y2="100" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="6,3"/>
  <line x1="200" y1="100" x2="320" y2="240" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="6,3"/>
  <!-- midpoint O -->
  <circle cx="260" cy="170" r="4" fill="#ea4335"/>
  <text x="268" y="165" fill="#ea4335" font-size="11">O (midpoint)</text>
  <!-- property labels -->
  <text x="490" y="60" fill="#34a853" font-size="12" font-weight="bold">Properties:</text>
  <text x="490" y="82" fill="currentColor" font-size="11">AB = CD (opposite)</text>
  <text x="490" y="102" fill="currentColor" font-size="11">BC = DA (opposite)</text>
  <text x="490" y="122" fill="currentColor" font-size="11">∠A = ∠C (opposite)</text>
  <text x="490" y="142" fill="currentColor" font-size="11">∠B = ∠D (opposite)</text>
  <text x="490" y="162" fill="currentColor" font-size="11">∠A + ∠B = 180°</text>
  <text x="490" y="182" fill="#ea4335" font-size="11">Diagonals bisect</text>
  <text x="490" y="200" fill="#ea4335" font-size="11">each other at O</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Diagonals of all quadrilaterals are equal", correction:"Diagonals are equal only in rectangles (and squares). In a general parallelogram, diagonals bisect but are NOT equal."},
      {wrong_idea:"Adjacent angles of a parallelogram are equal", correction:"Adjacent angles are SUPPLEMENTARY (sum = 180°), not equal. Opposite angles are equal."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Opposite angles → equal; adjacent angles → supplementary", rule:"In any parallelogram: opp = same, adj = 180°", example:"∠A = 65° → ∠C = 65°, ∠B = ∠D = 115°", when_to_use:"Finding unknown angles in parallelogram problems."}
    ],
    when_to_use_this_method:{
      use_this_when:["Proving triangles congruent inside parallelograms","Finding unknown angles or side lengths in parallelogram-family shapes","Solving coordinate geometry problems with parallelogram vertices"],
      use_other_when:["The shape is a trapezium — different property set applies"]
    },
    edge_cases:[
      {case:"Square diagonals", value:"Equal, bisecting, AND perpendicular", reasoning:"Square combines rectangle (equal diagonals) and rhombus (perpendicular diagonals) properties.", where_it_appears:"Square is the only parallelogram with all three diagonal properties simultaneously."},
      {case:"Rhombus diagonals", value:"Perpendicular bisectors of each other", reasoning:"By symmetry of equal sides, diagonals meet at right angles.", where_it_appears:"Used in area formula: area of rhombus = d₁×d₂/2."}
    ],
    key_takeaway:"Parallelogram: opposite sides and angles equal, adjacent angles supplementary, diagonals bisect each other — each type of parallelogram adds one more constraint.",
    video_script_hooks:{
      opening_hook:"Draw a diagonal in a parallelogram. Suddenly you have two congruent triangles — that's the secret behind all parallelogram properties.",
      concept_reveal:"Properties aren't memorised — they're proved. Once you see the congruent triangles, everything else follows.",
      common_mistake_moment:"Adjacent angles in a parallelogram are NOT equal. They're supplementary — they add up to 180°.",
      real_world_connection:"Engineers use parallelogram properties to check if structures are square: if diagonals are equal, it's a rectangle.",
      closing_hook:"One diagonal, two congruent triangles, and all the properties unlock. Geometry is about seeing the hidden symmetry."
    }
  }
},
{
  topicId:"cbse_math8_ch4_angle_sum_property", chapterNumber:4, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Angle Sum Property of Quadrilaterals",
  key_formulas:[
    {formula:"∠A + ∠B + ∠C + ∠D = 360°", explanation:"The sum of all interior angles of any quadrilateral is 360°."},
    {formula:"Exterior angle sum of any convex polygon = 360°", explanation:"Walking around any convex polygon and turning through all exterior angles makes exactly one full turn."}
  ],
  prerequisite_knowledge:["angle sum of a triangle (180°)","interior and exterior angles","parallel lines"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Any quadrilateral can be split into two triangles, giving 2 × 180° = 360° for the total interior angle sum.",
      hook:"Cut any quadrilateral from paper and tear off all four corners. Arrange the angles around a point — they always complete exactly one full circle (360°).",
      real_world_anchors:["floor plan design","tiling angles that must sum correctly","checking if a quadrilateral is valid"],
      the_pivot_idea:"The 360° rule is not a definition — it's a theorem that follows from the triangle angle sum. Two triangles, 180° each.",
      wrong_intuitions_to_replace:["'Quadrilateral angles sum to 180°' — That's triangles, not quadrilaterals.","'Only regular quadrilaterals have 360° sum' — ALL quadrilaterals (including irregular) sum to 360°."]
    },
    derivation:"Draw diagonal AC in quadrilateral ABCD, dividing it into △ABC (angles summing to 180°) and △ACD (angles summing to 180°). The four angles of the quadrilateral = all six triangle angles = 180° + 180° = 360°.",
    worked_example:[
      {problem:"Find x if angles are x, 2x, 3x, 4x.", steps:["x + 2x + 3x + 4x = 360°","10x = 360°","x = 36°"], answer:"x=36°, angles: 36°, 72°, 108°, 144°"},
      {problem:"In a parallelogram, one angle is 115°. Find all angles.", steps:["Opposite angle = 115°","Adjacent = 180°−115° = 65°","Other adjacent = 65°"], answer:"115°, 65°, 115°, 65°"}
    ],
    visual_description:"A quadrilateral with all four angles labelled; alongside it, the same quadrilateral with one diagonal drawn splitting it into two triangles, and 180°+180°=360° shown below.",
    svg_diagrams:[{
      id:"cbse_math8_ch4_angle_sum",
      title:"Angle sum of quadrilateral via two triangles",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- quadrilateral left -->
  <polygon points="40,260 100,60 260,40 280,270" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="30" y="275" fill="#ea4335" font-weight="bold">A</text>
  <text x="95" y="52" fill="#ea4335" font-weight="bold">B</text>
  <text x="262" y="35" fill="#ea4335" font-weight="bold">C</text>
  <text x="282" y="285" fill="#ea4335" font-weight="bold">D</text>
  <!-- diagonal -->
  <line x1="40" y1="260" x2="260" y2="40" stroke="#34a853" stroke-width="2" stroke-dasharray="5,3"/>
  <!-- triangle labels -->
  <text x="100" y="200" fill="#34a853" font-size="12">△1: 180°</text>
  <text x="195" y="140" fill="#4285f4" font-size="12">△2: 180°</text>
  <!-- equals -->
  <text x="310" y="165" fill="currentColor" font-size="20">+</text>
  <!-- result box -->
  <rect x="330" y="120" width="210" height="80" fill="#e6f4ea" stroke="#34a853" stroke-width="2" rx="8"/>
  <text x="435" y="152" text-anchor="middle" fill="#34a853" font-size="16" font-weight="bold">180° + 180°</text>
  <text x="435" y="185" text-anchor="middle" fill="#34a853" font-size="18" font-weight="bold">= 360°</text>
  <text x="280" y="290" text-anchor="middle" fill="currentColor" font-size="13">∠A + ∠B + ∠C + ∠D = 360° for ANY quadrilateral</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Only regular (equal-sided) quadrilaterals have 360° angle sum", correction:"Every quadrilateral — regular, irregular, concave — has interior angles summing to 360°."},
      {wrong_idea:"Drawing the diagonal changes the angle sum", correction:"The diagonal doesn't change the angles; it only helps visualise why the sum is 360°."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Paper-tearing demonstration (and mental model)", rule:"Mentally 'fold' the four corners to a point — they always complete exactly one revolution = 360°.", example:"Angles 90°, 120°, 80°, 70° → sum = 360°", when_to_use:"Checking if a set of four angles could form a quadrilateral."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding a missing angle in a quadrilateral","Checking if four given angles can form a quadrilateral","Solving algebraic problems with angle unknowns"],
      use_other_when:["Working with triangles — use 180° instead","Polygon with n > 4 sides — use (n−2)×180°"]
    },
    edge_cases:[
      {case:"Concave (reflex angle) quadrilateral", value:"Still 360°", reasoning:"Even with one reflex angle, the formula holds if angles are measured consistently (interior).", where_it_appears:"Irregular concave quadrilaterals in geometry problems."},
      {case:"All angles equal → 90° each", value:"Rectangle or square", reasoning:"360°/4 = 90°, forcing right angles.", where_it_appears:"Confirms that the only equiangular quadrilateral is a rectangle."}
    ],
    key_takeaway:"The sum of interior angles of any quadrilateral = 360°, proven by splitting into two triangles; this holds for all quadrilaterals regardless of shape.",
    video_script_hooks:{
      opening_hook:"Rip the four corners off any quadrilateral piece of paper and arrange them around a point — they always make exactly one full circle. That's 360°.",
      concept_reveal:"Split any quadrilateral with a diagonal: two triangles × 180° = 360°. The proof is that simple.",
      common_mistake_moment:"Quadrilateral angles = 360°, NOT 180°. That's for triangles. Don't confuse the two.",
      real_world_connection:"Architects use this to check floor plans: if four measured angles don't sum to 360°, the measurement is wrong.",
      closing_hook:"360° is the quadrilateral's fingerprint — always present, never wrong, provable with one diagonal."
    }
  }
},
{
  topicId:"cbse_math8_ch4_parallelogram_theorems", chapterNumber:4, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Parallelogram Theorems",
  key_formulas:[
    {formula:"Area of parallelogram = base × height", explanation:"Height is the perpendicular distance between the two parallel bases — not the slant side."},
    {formula:"In rhombus: Area = (d₁ × d₂) / 2", explanation:"Area equals half the product of the two diagonals."}
  ],
  prerequisite_knowledge:["properties of parallelograms","triangles and congruence","base and height of shapes"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A parallelogram can be rearranged into a rectangle by cutting and moving a triangle — so its area equals base × height just like a rectangle.",
      hook:"Shear a rectangle sideways without changing its height or base. The shape becomes a parallelogram but the area stays the same.",
      real_world_anchors:["parallelogram-shaped fields","slanted roof structures","force parallelogram in physics"],
      the_pivot_idea:"Area of parallelogram = area of equivalent rectangle = base × perpendicular height. The slant sides are irrelevant.",
      wrong_intuitions_to_replace:["'Area = base × slant side' — Wrong; height must be PERPENDICULAR.","'Parallelogram area formula is different from rectangle' — Same formula, same idea."]
    },
    derivation:"Cut a right triangle from the left of the parallelogram and attach it to the right — you get a rectangle with the same base and height. Area = base × height. For rhombus: diagonals are perpendicular, so the rhombus is made of 4 right triangles, each with legs d₁/2 and d₂/2. Total area = 4 × ½ × (d₁/2) × (d₂/2) = d₁d₂/2.",
    worked_example:[
      {problem:"Parallelogram base 12 cm, height 7 cm. Find area.", steps:["Area = base × height","= 12 × 7"], answer:"84 cm²"},
      {problem:"Rhombus with diagonals 10 cm and 24 cm. Find area.", steps:["Area = d₁ × d₂ / 2","= 10 × 24 / 2 = 240/2"], answer:"120 cm²"}
    ],
    visual_description:"A parallelogram with a dashed perpendicular height line drawn from a vertex to the base, labelled h, alongside the cut-and-rearrange transformation showing the equivalent rectangle.",
    svg_diagrams:[{
      id:"cbse_math8_ch4_parallelogram_area",
      title:"Parallelogram area = base × height",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- parallelogram -->
  <polygon points="60,260 140,100 360,100 280,260" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <!-- height line -->
  <line x1="140" y1="100" x2="140" y2="260" stroke="#ea4335" stroke-width="2" stroke-dasharray="5,3"/>
  <rect x="133" y="253" width="10" height="10" fill="none" stroke="#ea4335" stroke-width="1.5"/>
  <text x="148" y="185" fill="#ea4335">h</text>
  <!-- base label -->
  <text x="170" y="285" fill="currentColor">base (b)</text>
  <!-- formula -->
  <rect x="360" y="90" width="180" height="70" fill="#e6f4ea" stroke="#34a853" stroke-width="2" rx="8"/>
  <text x="450" y="120" text-anchor="middle" fill="#34a853" font-size="15" font-weight="bold">Area = b × h</text>
  <text x="450" y="148" text-anchor="middle" fill="#888" font-size="12">NOT b × slant side</text>
  <!-- arrow showing the triangle cut -->
  <polygon points="60,260 140,260 140,100" fill="#fce8e6" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="90" y="220" fill="#ea4335" font-size="11" text-anchor="middle">cut</text>
  <text x="90" y="238" fill="#ea4335" font-size="11" text-anchor="middle">here</text>
  <!-- rearranged rectangle -->
  <rect x="60" y="180" width="220" height="30" fill="none" stroke="#34a853" stroke-width="1.5" stroke-dasharray="4,2"/>
  <text x="170" y="220" text-anchor="middle" fill="#34a853" font-size="11">same area as rectangle</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Height of parallelogram = length of slant side", correction:"Height is the PERPENDICULAR distance between the parallel sides. It is always ≤ slant side length."},
      {wrong_idea:"Area of rhombus = side²", correction:"Rhombus area = d₁×d₂/2 (diagonals). Or base×height. Side² only applies to squares."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Rhombus diagonal area formula", rule:"Area = d₁×d₂/2 when you know diagonals; no need to find height.", example:"Diagonals 6 and 8 → Area = 48/2 = 24 cm²", when_to_use:"Whenever both diagonals of a rhombus are given."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding area of a parallelogram/rhombus given base and height or diagonals","Comparing areas of parallelograms with the same base","Problems involving shear transformations"],
      use_other_when:["You have a triangle inside the parallelogram — split and use triangle formula","Shape is a trapezium — use different area formula"]
    },
    edge_cases:[
      {case:"Height = 0", value:"Area = 0", reasoning:"A 'collapsed' parallelogram with zero height is a line segment.", where_it_appears:"Degenerate case; rarely in practice."},
      {case:"Rectangle as special parallelogram", value:"Area = l×w = l×h (since h=w for rectangle)", reasoning:"Rectangle's height equals its width because all angles are 90°.", where_it_appears:"Rectangle area formula is a special case of parallelogram area."}
    ],
    key_takeaway:"Parallelogram area = base × perpendicular height (not slant height); rhombus area = half the product of diagonals.",
    video_script_hooks:{
      opening_hook:"Slide a rectangular piece of cheese sideways without changing the top or bottom. The area doesn't change — that's the parallelogram area formula in action.",
      concept_reveal:"Cut a right triangle from one end and attach it to the other — parallelogram becomes a rectangle. Same area, new shape.",
      common_mistake_moment:"Height is NOT the slant side. Draw a perpendicular and measure that — only that — for area.",
      real_world_connection:"Farmers calculate field area, engineers compute force components, artists use oblique shapes — all use base × height.",
      closing_hook:"The area formula is elegant because it says: shape doesn't matter, only base and perpendicular height do."
    }
  }
},

// ── Ch5: Number Play ──────────────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch5_number_patterns", chapterNumber:5, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Number Patterns",
  key_formulas:[
    {formula:"Arithmetic sequence: aₙ = a₁ + (n−1)d", explanation:"The nth term of a sequence with first term a₁ and common difference d."},
    {formula:"Geometric sequence: aₙ = a₁ × rⁿ⁻¹", explanation:"The nth term of a sequence with first term a₁ and common ratio r."}
  ],
  prerequisite_knowledge:["multiplication and division","basic sequences","factors and multiples"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Number patterns are sequences where each term follows a rule — find the rule and you can predict any future term.",
      hook:"1, 1, 2, 3, 5, 8, 13… Each number is the sum of the two before it. This pattern appears in sunflower seeds, spiral shells, and pine cones.",
      real_world_anchors:["Fibonacci in nature (flowers, spirals)","savings growing by a fixed monthly deposit (arithmetic)","population doubling (geometric)"],
      the_pivot_idea:"Every pattern has a rule. Finding the rule — not memorising the sequence — is the mathematical skill.",
      wrong_intuitions_to_replace:["'Patterns are only about adding a constant' — They can involve multiplying, squaring, or Fibonacci-style sums.","'The next term is always predictable' — Only if the rule is determined; some sequences are defined piecewise."]
    },
    derivation:"For arithmetic sequence: each term differs from the next by constant d (the difference). The 1st term is a, 2nd is a+d, nth is a+(n−1)d. For geometric: multiply by constant r each time. The nth term is a×rⁿ⁻¹. Both are linear/exponential models in disguise.",
    worked_example:[
      {problem:"Find the 10th term of 3, 7, 11, 15, …", steps:["Common difference d = 4","a₁ = 3, n = 10","a₁₀ = 3 + (10−1)×4 = 3 + 36"], answer:"39"},
      {problem:"What is the 6th term of 2, 6, 18, 54, …?", steps:["Common ratio r = 3","a₁ = 2, n = 6","a₆ = 2 × 3⁵ = 2 × 243"], answer:"486"}
    ],
    visual_description:"Two number lines side by side — left showing arithmetic sequence 3, 7, 11, 15 with constant gaps of +4; right showing geometric sequence 2, 6, 18, 54 with ×3 labels, demonstrating the visual difference between linear and exponential growth.",
    svg_diagrams:[{
      id:"cbse_math8_ch5_patterns_arithmetic_geometric",
      title:"Arithmetic vs geometric sequences",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- Arithmetic -->
  <text x="140" y="30" text-anchor="middle" fill="#4285f4" font-weight="bold">Arithmetic (+4)</text>
  ${[3,7,11,15,19].map((v,i)=>`
  <circle cx="${40+i*80}" cy="80" r="28" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="${40+i*80}" y="86" text-anchor="middle" fill="#4285f4" font-weight="bold" font-size="14">${v}</text>
  ${i<4?`<text x="${80+i*80}" y="72" text-anchor="middle" fill="#888" font-size="12">+4</text>
  <line x1="${68+i*80}" y1="80" x2="${12+(i+1)*80}" y2="80" stroke="#888" stroke-width="1" marker-end="url(#arr)"/>`:""}
  `).join("")}
  <!-- Geometric -->
  <text x="140" y="175" text-anchor="middle" fill="#34a853" font-weight="bold">Geometric (×3)</text>
  ${[2,6,18,54,162].map((v,i)=>`
  <circle cx="${40+i*80}" cy="240" r="28" fill="#e6f4ea" stroke="#34a853" stroke-width="2"/>
  <text x="${40+i*80}" y="246" text-anchor="middle" fill="#34a853" font-weight="bold" font-size="${v>99?10:14}">${v}</text>
  ${i<4?`<text x="${80+i*80}" y="225" text-anchor="middle" fill="#888" font-size="12">×3</text>
  <line x1="${68+i*80}" y1="240" x2="${12+(i+1)*80}" y2="240" stroke="#888" stroke-width="1"/>`:""}
  `).join("")}
  <text x="480" y="80" fill="#4285f4" font-size="12">+d each time</text>
  <text x="480" y="240" fill="#34a853" font-size="12">×r each time</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Any sequence of numbers with a pattern is arithmetic", correction:"Patterns can be geometric (×r), quadratic (n²), Fibonacci (sum of two prior), or others. Always check more than one difference."},
      {wrong_idea:"A sequence must continue the same rule forever", correction:"Sequences are defined by their rule — the rule determines all terms. If the rule changes, it's a different sequence."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Check 2nd differences for quadratic sequences", rule:"If 1st differences aren't constant but 2nd differences are, the sequence is quadratic.", example:"1,4,9,16: 1st diff=3,5,7 (not constant); 2nd diff=2,2 (constant) → quadratic (n²)", when_to_use:"When the sequence isn't arithmetic or geometric."}
    ],
    when_to_use_this_method:{
      use_this_when:["Predicting future terms of a sequence","Modelling real-world growth patterns","Finding a formula for the nth term"],
      use_other_when:["The sequence has no clear rule — collect more data","You're given only a formula and asked to verify — substitute directly"]
    },
    edge_cases:[
      {case:"d = 0 in arithmetic sequence", value:"Constant sequence", reasoning:"All terms equal a₁.", where_it_appears:"A fixed salary; temperature on an isothermal day."},
      {case:"r = 1 in geometric sequence", value:"Constant sequence", reasoning:"All terms equal a₁.", where_it_appears:"Overlap between arithmetic (d=0) and geometric (r=1)."}
    ],
    key_takeaway:"Patterns are sequences governed by a rule; arithmetic sequences add a constant difference; geometric sequences multiply by a constant ratio.",
    video_script_hooks:{
      opening_hook:"1,1,2,3,5,8,13… Sunflower seeds, nautilus shells, your hand's finger joints — all follow this rule. Numbers aren't just maths; they're nature's code.",
      concept_reveal:"The rule is everything. Find it, and you own the sequence — past, present, and future terms, all from one formula.",
      common_mistake_moment:"Check more than one pair of terms before deciding the rule. 1,2,4 could be +1 then +2, or it could be ×2. Always verify with at least three terms.",
      real_world_connection:"Bank compound interest is a geometric sequence. Monthly salary savings is arithmetic. The maths of planning lives in these patterns.",
      closing_hook:"Behind every pattern is a rule. Behind every rule is a formula. And behind every formula is insight."
    }
  }
},
{
  topicId:"cbse_math8_ch5_primes_and_composites", chapterNumber:5, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Primes and Composites",
  key_formulas:[
    {formula:"Fundamental Theorem of Arithmetic: every integer > 1 = unique product of primes", explanation:"Prime factorisation is unique — no two different sets of primes multiply to the same number."},
    {formula:"Sieve of Eratosthenes: cross out multiples of primes ≤ √n to find all primes up to n", explanation:"Efficient algorithm for listing all primes up to n."}
  ],
  prerequisite_knowledge:["factors and multiples","divisibility rules","multiplication"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Prime numbers are the atoms of arithmetic — every integer is built by multiplying primes, and that factorisation is unique.",
      hook:"The number 12 = 2 × 2 × 3 — no matter how you factor it, the prime pieces are always two 2s and one 3. That uniqueness is the Fundamental Theorem of Arithmetic.",
      real_world_anchors:["RSA encryption (based on difficulty of factoring large primes)","prime factorisation in gear ratios","unique product codes"],
      the_pivot_idea:"Primes are indivisible building blocks — they cannot be factored further. Composites are constructions from primes.",
      wrong_intuitions_to_replace:["'1 is a prime number' — By definition, 1 is neither prime nor composite.","'All odd numbers are prime' — 9, 15, 21, 25 are odd and composite."]
    },
    derivation:"A prime p has exactly two distinct divisors: 1 and p. If p had a third divisor d (1 < d < p), then p/d would also be a divisor, making p composite. The Sieve works because any composite n ≤ 100 must have a prime factor ≤ √100 = 10, so checking primes 2,3,5,7 suffices.",
    worked_example:[
      {problem:"Find all primes between 20 and 40.", steps:["Check each: 21=3×7✗, 22=2×11✗, 23✓, 24✗, 25=5²✗","26✗, 27✗, 28✗, 29✓, 30✗, 31✓, 32✗, 33✗","34✗, 35✗, 36✗, 37✓, 38✗, 39=3×13✗"], answer:"23, 29, 31, 37"},
      {problem:"Express 360 as a product of prime factors.", steps:["360 = 2×180 = 2×2×90 = 2²×2×45","= 2³×9×5 = 2³×3²×5"], answer:"2³ × 3² × 5"}
    ],
    visual_description:"A 10×10 grid of numbers 1–100 with primes circled in blue and composites shaded grey, illustrating the Sieve of Eratosthenes after crossing out multiples of 2, 3, 5, and 7.",
    svg_diagrams:[{
      id:"cbse_math8_ch5_sieve_eratosthenes",
      title:"Primes up to 50 using the Sieve",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <text x="280" y="22" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="14">Primes up to 50 — Sieve of Eratosthenes</text>
  ${Array.from({length:50},(_,i)=>i+1).map((n,i)=>{
    const primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47];
    const isPrime=primes.includes(n);
    const x=30+(i%10)*50, y=40+Math.floor(i/10)*50;
    return `<rect x="${x}" y="${y}" width="44" height="38" rx="4" fill="${n===1?"#f0f0f0":isPrime?"#4285f4":"#fce8e6"}" stroke="${isPrime?"#2050c0":"#ccc"}" stroke-width="${isPrime?2:1}"/>
    <text x="${x+22}" y="${y+24}" text-anchor="middle" fill="${n===1?"#aaa":isPrime?"white":"#888"}" font-weight="${isPrime?"bold":"normal"}">${n}</text>`;
  }).join("")}
  <text x="30" y="305" fill="#4285f4">■ Prime</text>
  <text x="120" y="305" fill="#ea4335">■ Composite</text>
  <text x="230" y="305" fill="#888">■ 1 (neither)</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"1 is a prime number", correction:"1 is neither prime nor composite — it has only ONE divisor (itself), not two. Primes have exactly two distinct divisors."},
      {wrong_idea:"2 is not prime because it's even", correction:"2 is the only even prime. It has exactly two divisors: 1 and 2. Every other even number is composite."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Primality check up to √n", rule:"To test if n is prime, check divisibility only by primes up to √n.", example:"Is 97 prime? √97≈9.8; check 2,3,5,7: none divide 97 → 97 is prime.", when_to_use:"Quick primality check for any two or three digit number."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding HCF and LCM via prime factorisation","Simplifying fractions to lowest terms","Understanding why certain numbers appear frequently as factors"],
      use_other_when:["Numbers are very large — use modular arithmetic or probabilistic tests","Only approximate factors needed — estimate and round"]
    },
    edge_cases:[
      {case:"2 — only even prime", value:"prime", reasoning:"2 is divisible only by 1 and 2.", where_it_appears:"Every even composite number is divisible by 2; 2 itself is prime."},
      {case:"Twin primes", value:"pairs differing by 2", reasoning:"E.g. (11,13), (17,19), (29,31) — an open question is whether infinitely many exist.", where_it_appears:"Number theory; pattern recognition."}
    ],
    key_takeaway:"Every integer > 1 factors uniquely into primes; 1 is neither prime nor composite; check primality only up to √n.",
    video_script_hooks:{
      opening_hook:"Internet banking uses prime numbers to secure your transactions. Primes aren't just maths class — they guard your money.",
      concept_reveal:"Primes are the atoms of arithmetic. Every number is built from them. And the factorisation is always unique — that's the Fundamental Theorem.",
      common_mistake_moment:"1 is NOT prime. Primes need EXACTLY two divisors. 1 has only one divisor (itself) — it's in a category of its own.",
      real_world_connection:"RSA encryption, the system protecting every HTTPS website, relies on the fact that multiplying two large primes is easy, but factoring the result is hard.",
      closing_hook:"Primes: simple to define, impossible to fully predict. They're the great mystery at the heart of mathematics."
    }
  }
},
{
  topicId:"cbse_math8_ch5_divisibility_rules", chapterNumber:5, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Divisibility Rules",
  key_formulas:[
    {formula:"÷2: last digit even  |  ÷3: digit sum ÷3  |  ÷4: last two digits ÷4", explanation:"Quick tests replacing full division."},
    {formula:"÷5: ends 0 or 5  |  ÷9: digit sum ÷9  |  ÷10: ends 0  |  ÷11: alternating digit sum ÷11", explanation:"Extended divisibility rules."}
  ],
  prerequisite_knowledge:["factors and multiples","place value","prime numbers"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Divisibility rules let you check if a number divides another without performing the full division — they're based on place value patterns.",
      hook:"Is 3,456,789 divisible by 9? Add digits: 3+4+5+6+7+8+9 = 42; 4+2 = 6. Not divisible by 9. This saved you long-dividing a 7-digit number.",
      real_world_anchors:["splitting groups evenly","checking invoice totals","mental arithmetic shortcuts"],
      the_pivot_idea:"Each divisibility rule exploits the fact that 10 ≡ 1 (mod 3 and mod 9), 10 ≡ 0 (mod 2 and mod 5), etc. — the remainder of 10ⁿ determines the rule.",
      wrong_intuitions_to_replace:["'A number ending in an even digit is divisible by 4' — No: 14 is even but not ÷4. Last TWO digits must be ÷4.","'If divisible by 2 and 3, divisible by 6' — True (LCM(2,3)=6). But divisible by 2 and 4 doesn't mean divisible by 8."]
    },
    derivation:"For ÷3: any number N = a₀ + 10a₁ + 100a₂ + … = a₀ + (9+1)a₁ + (99+1)a₂ + … ≡ a₀ + a₁ + a₂ + … (mod 3), since 9, 99, 999… are all divisible by 3. So N is divisible by 3 iff its digit sum is.",
    worked_example:[
      {problem:"Is 2,345,676 divisible by 4?", steps:["Check last two digits: 76","76 ÷ 4 = 19 (exactly)"], answer:"Yes"},
      {problem:"Is 5,247 divisible by 11?", steps:["Alternating sum from right: 7−4+2−5 = 0","0 is divisible by 11"], answer:"Yes"}
    ],
    visual_description:"A quick-reference card in a 2×4 grid showing each divisibility rule (2,3,4,5,6,9,10,11) with its test and a worked example number.",
    svg_diagrams:[{
      id:"cbse_math8_ch5_divisibility_card",
      title:"Divisibility rules quick-reference",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <text x="280" y="22" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="14">Divisibility Rules</text>
  ${[
    ["÷ 2","Last digit even","134 ✓","#4285f4"],
    ["÷ 3","Digit sum ÷ 3","123: 1+2+3=6 ✓","#34a853"],
    ["÷ 4","Last 2 digits ÷ 4","316: 16÷4=4 ✓","#ea4335"],
    ["÷ 5","Ends in 0 or 5","235 ✓","#fbbc04"],
    ["÷ 6","÷2 AND ÷3","714 ✓","#9c27b0"],
    ["÷ 9","Digit sum ÷ 9","729: 7+2+9=18 ✓","#00bcd4"],
    ["÷ 10","Ends in 0","370 ✓","#ff5722"],
    ["÷ 11","Alt. sum ÷ 11","121: 1−2+1=0 ✓","#607d8b"]
  ].map(([div,rule,ex,color],i)=>{
    const x=i%2===0?20:295, y=35+Math.floor(i/2)*68;
    return `<rect x="${x}" y="${y}" width="255" height="58" rx="6" fill="${color}11" stroke="${color}" stroke-width="1.5"/>
    <text x="${x+10}" y="${y+20}" fill="${color}" font-weight="bold" font-size="14">${div}</text>
    <text x="${x+10}" y="${y+38}" fill="currentColor">${rule}</text>
    <text x="${x+10}" y="${y+54}" fill="#888" font-size="11">e.g. ${ex}</text>`;
  }).join("")}
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Divisibility by 2 AND 4 means divisibility by 8", correction:"LCM(2,4)=4, not 8. For ÷8, check last 3 digits divisible by 8."},
      {wrong_idea:"Divisibility by 4: check last digit only", correction:"Check the last TWO digits. 12 ends in 2 (even) but 12÷4=3 — correct. But 22 ends in 2 and is not ÷4. Only the last two digits matter."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Divisibility by 6 = divisibility by 2 AND 3", rule:"If a number passes BOTH the ÷2 test and the ÷3 test, it is divisible by 6.", example:"114: even ✓ and 1+1+4=6 ÷3 ✓ → divisible by 6", when_to_use:"Always use for ÷6; avoids a separate test."}
    ],
    when_to_use_this_method:{
      use_this_when:["Quick mental checks without a calculator","Simplifying fractions (check common factors)","Finding prime factorisations faster"],
      use_other_when:["The divisor doesn't have a simple rule (e.g. ÷7) — use long division","Exact quotient is needed, not just yes/no"]
    },
    edge_cases:[
      {case:"Divisibility by 0", value:"undefined", reasoning:"Division by 0 is undefined — no divisibility rule applies.", where_it_appears:"Never test divisibility by 0."},
      {case:"0 is divisible by every non-zero integer", value:"0 = n × 0 for all n", reasoning:"0 divided by any non-zero integer is 0, exactly.", where_it_appears:"0 passes every divisibility rule."}
    ],
    key_takeaway:"Divisibility rules are place-value shortcuts based on modular arithmetic; memorise rules for 2,3,4,5,6,9,10,11 for rapid mental computation.",
    video_script_hooks:{
      opening_hook:"Is 123,456,789 divisible by 9? Add the digits: 1+2+3+4+5+6+7+8+9 = 45, and 45÷9 = 5. Yes — without a single division step.",
      concept_reveal:"These rules aren't magic — they come from the fact that 10 leaves remainder 1 when divided by 3 or 9. Place value makes the rule.",
      common_mistake_moment:"For ÷4, checking only the last digit isn't enough — you must check the last TWO digits.",
      real_world_connection:"Cashiers use ÷2, ÷5, ÷10 mentally every day. Tax accountants check ÷9 to spot digit errors in figures.",
      closing_hook:"Divisibility rules turn massive division problems into one-second mental checks. Learn them once; use them forever."
    }
  }
},
{
  topicId:"cbse_math8_ch5_number_puzzles", chapterNumber:5, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Number Puzzles and Tricks",
  key_formulas:[
    {formula:"Magic square: every row, column, and diagonal sums to n(n²+1)/2  (for order n)", explanation:"For order 3: sum = 3(9+1)/2 = 15."},
    {formula:"Algebraic trick structure: choose x → apply operations → result is always n (independent of x)", explanation:"Number tricks work because algebra cancels the unknown."}
  ],
  prerequisite_knowledge:["basic algebra (expressions)","arithmetic operations","patterns in numbers"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Number tricks and magic squares use algebra to create surprising outcomes — the 'magic' is just hidden arithmetic.",
      hook:"'Think of any number. Double it. Add 10. Halve the result. Subtract your original number. You're thinking of 5.' This works for EVERY starting number — and algebra shows why.",
      real_world_anchors:["magic square puzzles in newspapers","algorithmic card tricks","mental maths competitions"],
      the_pivot_idea:"Algebra reveals the structure behind tricks. Once you see x cancel out, the 'magic' becomes mathematics.",
      wrong_intuitions_to_replace:["'Magic squares require trial and error' — There are systematic construction methods for odd-order magic squares.","'These tricks require special numbers' — They work for ALL integers; the key is algebraic cancellation."]
    },
    derivation:"Trick: pick x, double → 2x, add 10 → 2x+10, halve → x+5, subtract original x → 5. The result is always 5 because x cancels out. For order-3 magic square: use numbers 1–9. Place 5 in centre, then fill using the step pattern (up 1, right 1; blocked → go below current).",
    worked_example:[
      {problem:"Explain the trick: 'think of a number, multiply by 3, add 12, divide by 3, subtract original number.'", steps:["Let number = x","×3 → 3x; +12 → 3x+12; ÷3 → x+4; −x → 4","Result is always 4, regardless of x"], answer:"The result is always 4"},
      {problem:"Complete the 3×3 magic square with centre 5.", steps:["Numbers 1–9, sum = 15 each row/col/diag","Centre = 5; corners and edges filled systematically"], answer:"2 7 6 / 9 5 1 / 4 3 8"}
    ],
    visual_description:"A 3×3 magic square showing the numbers 2,7,6/9,5,1/4,3,8 with arrows marking each row (15), each column (15), and both diagonals (15).",
    svg_diagrams:[{
      id:"cbse_math8_ch5_magic_square",
      title:"Order-3 magic square (sum = 15)",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
  <!-- magic square grid -->
  ${[[2,7,6],[9,5,1],[4,3,8]].map((row,r)=>row.map((v,c)=>`
  <rect x="${80+c*80}" y="${40+r*80}" width="80" height="80" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="${120+c*80}" y="${86+r*80}" text-anchor="middle" fill="#4285f4" font-size="24" font-weight="bold">${v}</text>`).join("")).join("")}
  <!-- row sums -->
  ${[0,1,2].map(r=>`<text x="270" y="${86+r*80}" fill="#34a853" font-size="13">= 15</text>`).join("")}
  <!-- column sums -->
  ${[0,1,2].map(c=>`<text x="${120+c*80}" y="295" text-anchor="middle" fill="#ea4335" font-size="13">15</text>`).join("")}
  <!-- diagonal labels -->
  <text x="390" y="90" fill="#fbbc04">Diag = 15</text>
  <text x="390" y="240" fill="#fbbc04">Diag = 15</text>
  <!-- algebra trick box -->
  <rect x="390" y="120" width="155" height="100" fill="#fff8e1" stroke="#fbbc04" rx="6"/>
  <text x="468" y="145" text-anchor="middle" fill="currentColor" font-weight="bold">Trick: always 4</text>
  <text x="400" y="165" fill="currentColor" font-size="12">x → ×3 → +12 → ÷3</text>
  <text x="400" y="185" fill="currentColor" font-size="12">→ x+4 → −x</text>
  <text x="468" y="210" text-anchor="middle" fill="#fbbc04" font-size="16" font-weight="bold">= 4 always</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"These tricks only work for certain starting numbers", correction:"The 'magic' is algebraic cancellation — x cancels out, so the result is the same for ALL starting numbers."},
      {wrong_idea:"Magic squares are only about luck in placement", correction:"There are systematic methods to construct magic squares of any odd order using step-patterns."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Build odd magic squares with the staircase method", rule:"Place 1 in top-centre. Move up-right diagonally, wrapping around edges. If blocked, go one below current position.", example:"Order-3: place 1 top-middle, 2 wraps to bottom-right, 3 to middle-left, 4 goes below 3…", when_to_use:"Constructing any odd-order magic square from scratch."}
    ],
    when_to_use_this_method:{
      use_this_when:["Mental maths demonstrations and puzzles","Introducing algebra as a tool for explaining patterns","Logic and reasoning competitions"],
      use_other_when:["Serious computation — tricks are for insight, not for replacing structured calculation"]
    },
    edge_cases:[
      {case:"Even-order magic squares", value:"Different construction method", reasoning:"The staircase method works only for odd orders. Even orders require a different algorithm.", where_it_appears:"4×4 magic squares appear in historical art (Dürer's Melancholia)."},
      {case:"Result of trick depends on divisor", value:"Changes with operation choice", reasoning:"Different operations yield different constants; the algebra always shows the pattern.", where_it_appears:"Changing the '+12' to '+8' gives a result of 8/3×... — always trace algebraically."}
    ],
    key_takeaway:"Number tricks work because algebra reveals hidden cancellations; magic squares are built on arithmetic structure, not guesswork.",
    video_script_hooks:{
      opening_hook:"'Think of any number.' No matter what you pick, I'll always know the answer. Want to know why? It's algebra.",
      concept_reveal:"The 'magic' is that the unknown cancels. Once you write x for the number, every trick becomes transparent.",
      common_mistake_moment:"These tricks don't work 'sometimes' — they work for ALL numbers because x cancels. Test it with 1, with 100, with −7 — same result every time.",
      real_world_connection:"Magicians, game designers, and encryption specialists all use algebraic structure to make the 'impossible' predictable.",
      closing_hook:"There are no magic numbers — only hidden algebra. Now you see how the trick works. Now you can invent your own."
    }
  }
},

,

// ── Ch6: We Distribute Yet Things Multiply ────────────────────────────────────
{
  topicId:"cbse_math8_ch6_distributive_law", chapterNumber:6, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"The Distributive Law",
  key_formulas:[
    {formula:"a(b + c) = ab + ac", explanation:"Multiplication distributes over addition — multiply each term inside the bracket."},
    {formula:"a(b − c) = ab − ac", explanation:"Distributive law also applies to subtraction."}
  ],
  prerequisite_knowledge:["multiplication","brackets in arithmetic","like and unlike terms"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Distributing multiplication over addition is equivalent to finding the area of a rectangle by adding the areas of two smaller rectangles.",
      hook:"Price of 5 notebooks at ₹12 each plus 5 pens at ₹8 each: either compute 5×12 + 5×8 = 60+40=100, OR use distribution: 5×(12+8) = 5×20 = 100. Same answer, different route.",
      real_world_anchors:["splitting a shopping bill","area model of multiplication","mentally computing prices"],
      the_pivot_idea:"Distribution is about scale — multiplying a sum by a factor is the same as multiplying each addend by that factor, then adding.",
      wrong_intuitions_to_replace:["'3(x+4) = 3x+4' — Missing the second multiplication: should be 3x+12.","'Distribution applies to exponents: (a+b)² = a²+b²' — False; this is a common algebraic error."]
    },
    derivation:"Area model: a rectangle of width a and length (b+c) has area a(b+c). Split it into two rectangles: one a×b, one a×c. Combined area = ab + ac. So a(b+c) = ab + ac. This extends to any number of terms inside the bracket.",
    worked_example:[
      {problem:"Expand 7(3x − 4y + 2).", steps:["= 7×3x + 7×(−4y) + 7×2","= 21x − 28y + 14"], answer:"21x − 28y + 14"},
      {problem:"Evaluate 99 × 47 using distribution.", steps:["= (100−1) × 47","= 100×47 − 1×47","= 4700 − 47"], answer:"4653"}
    ],
    visual_description:"A rectangle of total width (b+c) and height a, divided by a vertical line into two sub-rectangles of width b and c. Each sub-rectangle is labelled ab and ac to show a(b+c)=ab+ac.",
    svg_diagrams:[{
      id:"cbse_math8_ch6_distributive_area_model",
      title:"Distributive law as area model",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
  <!-- full rectangle -->
  <rect x="60" y="60" width="420" height="140" fill="none" stroke="#4285f4" stroke-width="2"/>
  <!-- dividing line -->
  <line x1="240" y1="60" x2="240" y2="200" stroke="#ea4335" stroke-width="2" stroke-dasharray="5,3"/>
  <!-- left rectangle -->
  <rect x="60" y="60" width="180" height="140" fill="#e8f0fe" stroke="#4285f4" stroke-width="1.5"/>
  <text x="150" y="135" text-anchor="middle" fill="#4285f4" font-size="16" font-weight="bold">a · b</text>
  <!-- right rectangle -->
  <rect x="240" y="60" width="240" height="140" fill="#e6f4ea" stroke="#34a853" stroke-width="1.5"/>
  <text x="360" y="135" text-anchor="middle" fill="#34a853" font-size="16" font-weight="bold">a · c</text>
  <!-- labels -->
  <text x="150" y="50" text-anchor="middle" fill="currentColor">b</text>
  <text x="360" y="50" text-anchor="middle" fill="currentColor">c</text>
  <text x="40" y="135" text-anchor="middle" fill="currentColor">a</text>
  <!-- brace for b+c -->
  <line x1="60" y1="215" x2="480" y2="215" stroke="currentColor" stroke-width="1.5"/>
  <text x="270" y="235" text-anchor="middle" fill="currentColor">b + c</text>
  <!-- formula -->
  <text x="270" y="275" text-anchor="middle" fill="currentColor" font-size="15" font-weight="bold">a(b+c) = ab + ac</text>
  <text x="270" y="300" text-anchor="middle" fill="#888" font-size="12">Multiply EVERY term inside the bracket</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"3(x+4) = 3x+4 (only first term multiplied)", correction:"Multiply EVERY term: 3(x+4) = 3x + 12. The 4 must also be multiplied by 3."},
      {wrong_idea:"(a+b)² = a²+b² (distributive law for powers)", correction:"(a+b)² = a²+2ab+b². Distribution applies to multiplication, not to exponentiation in this way."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Use distribution for mental arithmetic", rule:"Split one factor into a round number ± adjustment: 99 = 100−1.", example:"47×99 = 47×100 − 47×1 = 4700−47 = 4653", when_to_use:"Multiplying by numbers close to round multiples of 10."}
    ],
    when_to_use_this_method:{
      use_this_when:["Expanding algebraic expressions","Mental multiplication of complex numbers","Proving algebraic identities"],
      use_other_when:["Both factors are simple — direct multiplication is faster","The expression involves powers — use the appropriate identity instead"]
    },
    edge_cases:[
      {case:"a(b+c) when a=0", value:"0", reasoning:"0 times anything is 0.", where_it_appears:"Zero distributive identity: 0×n = 0."},
      {case:"Negative outside bracket", value:"−3(x+4) = −3x − 12", reasoning:"Negative distributes to both terms; both signs change.", where_it_appears:"Every time a negative factor multiplies a bracketed sum."}
    ],
    key_takeaway:"a(b+c) = ab + ac — multiply EVERY term inside the bracket; this is the foundation of algebraic expansion.",
    video_script_hooks:{
      opening_hook:"5 notebooks at ₹12 plus 5 pens at ₹8. You could add first (₹20) then multiply by 5 — or multiply each separately. Same answer, that's distribution.",
      concept_reveal:"The distributive law is just the area model: a big rectangle equals the sum of smaller rectangles with the same height.",
      common_mistake_moment:"3(x+4) ≠ 3x+4. You MUST multiply BOTH terms: 3x + 12. Don't leave the 4 untouched.",
      real_world_connection:"Every spreadsheet calculation that applies a rate to multiple items uses distribution — discount calculations, tax, interest.",
      closing_hook:"Distribution is the bridge between multiplication and addition — master it and algebra opens up completely."
    }
  }
},
{
  topicId:"cbse_math8_ch6_factorisation", chapterNumber:6, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Factorisation of Algebraic Expressions",
  key_formulas:[
    {formula:"ab + ac = a(b + c)  — common factor", explanation:"Factor out the Greatest Common Factor (GCF) of all terms."},
    {formula:"a² − b² = (a+b)(a−b)  — difference of squares", explanation:"Every difference of two perfect squares factors into two conjugate binomials."}
  ],
  prerequisite_knowledge:["distributive law","HCF of numbers","algebraic expressions"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Factorisation is expansion in reverse — instead of spreading a factor across a bracket, you pull the common factor out.",
      hook:"6x + 9 = 3(2x + 3). The factor 3 was hidden inside both terms; factorisation makes it visible.",
      real_world_anchors:["simplifying fractions (cancel common factors)","finding the GCF of polynomials","engineering: reducing gear ratios"],
      the_pivot_idea:"Factorisation reveals the hidden structure of an expression — what multiplied together to produce the terms we see.",
      wrong_intuitions_to_replace:["'12x − 6 = 6(2x−6)' — Check: 6×2x=12x ✓ but 6×6=36≠6. Correct: 12x−6=6(2x−1).","'x² − 4 = (x−2)(x−2)' — That's (x−2)². x²−4 = (x+2)(x−2)."]
    },
    derivation:"Reverse distribution: ab + ac — identify common factor a; write a( ) and fill in: a(b + c). Verify by expanding. For difference of squares: (a+b)(a−b) = a²−ab+ab−b² = a²−b². Reversing: a²−b² = (a+b)(a−b).",
    worked_example:[
      {problem:"Factorise: 12x²y − 8xy² + 4xy", steps:["GCF of 12,8,4 = 4; GCF of x²y,xy²,xy = xy","GCF = 4xy","= 4xy(3x − 2y + 1)"], answer:"4xy(3x − 2y + 1)"},
      {problem:"Factorise: 49a² − 25b²", steps:["49a² = (7a)², 25b² = (5b)²","Difference of squares: (7a+5b)(7a−5b)"], answer:"(7a + 5b)(7a − 5b)"}
    ],
    visual_description:"A reverse area model: a large rectangle labelled ab+ac with a bracket on the left side labelled 'a' and two sub-rectangles labelled b and c, with an arrow pointing from 'ab+ac' to 'a(b+c)'.",
    svg_diagrams:[{
      id:"cbse_math8_ch6_factorisation_diagram",
      title:"Factorisation as reverse distribution",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
  <!-- expanded form -->
  <rect x="30" y="30" width="200" height="100" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="130" y="85" text-anchor="middle" fill="#4285f4" font-size="16" font-weight="bold">ab</text>
  <rect x="230" y="30" width="270" height="100" fill="#e6f4ea" stroke="#34a853" stroke-width="2"/>
  <text x="365" y="85" text-anchor="middle" fill="#34a853" font-size="16" font-weight="bold">ac</text>
  <text x="280" y="155" text-anchor="middle" fill="currentColor">= ab + ac</text>
  <!-- arrow -->
  <text x="280" y="195" text-anchor="middle" fill="#ea4335" font-size="18">⟺</text>
  <!-- factored form -->
  <rect x="30" y="220" width="470" height="80" fill="#fff8e1" stroke="#fbbc04" stroke-width="2" rx="6"/>
  <text x="50" y="252" fill="currentColor">Common factor a:</text>
  <text x="280" y="275" text-anchor="middle" fill="#fbbc04" font-size="18" font-weight="bold">a ( b + c )</text>
  <!-- diff of squares -->
  <rect x="30" y="315" width="500" height="0" fill="none"/>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"The GCF is always a single variable", correction:"GCF can include numerical coefficients AND variables: GCF of 6x²y and 9xy² is 3xy."},
      {wrong_idea:"x² − 9 = (x−3)²", correction:"x² − 9 = (x+3)(x−3). This is difference of squares, NOT a perfect square trinomial."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Spot difference of squares by checking if both terms are perfect squares with a minus between them", rule:"a² − b² = (a+b)(a−b) — always.", example:"100 − 49 = 10² − 7² = (10+7)(10−7) = 17×3 = 51", when_to_use:"Any subtraction of two squared terms."}
    ],
    when_to_use_this_method:{
      use_this_when:["Simplifying algebraic fractions","Solving polynomial equations","Proving divisibility of expressions"],
      use_other_when:["The expression has no common factor — try other methods (grouping, identities)","The expression is already in its simplest form"]
    },
    edge_cases:[
      {case:"GCF = 1 (no common factor)", value:"Expression is already fully factored with respect to common factors", reasoning:"Try other techniques: difference of squares, grouping, or identity.", where_it_appears:"x² + x + 1 has no common factor; its factorisation requires the quadratic formula."},
      {case:"Sum of squares a² + b²", value:"Cannot factor over integers", reasoning:"a²+b² has no real linear factors.", where_it_appears:"Unlike difference, sum of squares does not factor — a common source of error."}
    ],
    key_takeaway:"Factorisation reverses distribution: find the GCF and pull it out; use a²−b²=(a+b)(a−b) for difference of squares.",
    video_script_hooks:{
      opening_hook:"6x + 9 — what's hiding inside? Pull out the 3: 3(2x+3). Factorisation is like reverse engineering an expression.",
      concept_reveal:"Every factorisation is a check: expand back and confirm. Factor, expand, verify — the loop makes algebra self-checking.",
      common_mistake_moment:"x²−9 is NOT (x−3)². It's (x+3)(x−3). Sum and difference — the signs are opposite.",
      real_world_connection:"Simplifying engineering fractions, optimising code, reducing circuit expressions — factorisation is the tool of choice.",
      closing_hook:"Factor first, then simplify. You'll solve harder problems faster by seeing the hidden structure."
    }
  }
},
{
  topicId:"cbse_math8_ch6_like_and_unlike_terms", chapterNumber:6, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Like and Unlike Terms",
  key_formulas:[
    {formula:"Like terms: same variable(s) raised to the same power(s)", explanation:"3x² and −7x² are like; 3x² and 3x are unlike (different powers)."},
    {formula:"Combining like terms: (a + b)xⁿ = cxⁿ", explanation:"Add or subtract coefficients; variable part stays the same."}
  ],
  prerequisite_knowledge:["algebraic expressions","variables and constants","distributive law"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Like terms are the algebraic equivalent of 'same unit' — you can add apples to apples, but not apples to oranges.",
      hook:"3 apples + 5 oranges = 3 apples + 5 oranges (you can't simplify). But 3x + 5x = 8x (same 'unit': x).",
      real_world_anchors:["unit matching in measurement (km + km = km)","combining similar items in a shopping list","like terms in polynomial algebra"],
      the_pivot_idea:"Like terms have identical variable parts (same variables, same exponents). Only their coefficients differ — and only those can be added.",
      wrong_intuitions_to_replace:["'3x + 5 = 8x' — 5 is a constant, not an 'x' term. They are unlike.","'x² and x are like terms' — Different powers: x² is a quadratic term, x is linear."]
    },
    derivation:"3x + 5x = (3+5)x = 8x by the distributive law in reverse. The variable x is a common factor. Unlike terms have no common variable factor, so they cannot be combined.",
    worked_example:[
      {problem:"Simplify: 5x² − 3x + 7x² + 2x − 4", steps:["Group like terms: (5x²+7x²) + (−3x+2x) + (−4)","= 12x² − x − 4"], answer:"12x² − x − 4"},
      {problem:"Add: (3a − 2b + 5) + (−a + 4b − 3)", steps:["a-terms: 3a + (−a) = 2a","b-terms: −2b + 4b = 2b","constants: 5 + (−3) = 2"], answer:"2a + 2b + 2"}
    ],
    visual_description:"A table with two columns — 'Like terms' and 'Unlike terms' — showing pairs: 3x and 5x (like), 3x and 3x² (unlike), 4ab and −2ab (like), 4ab and 4a²b (unlike).",
    svg_diagrams:[{
      id:"cbse_math8_ch6_like_unlike_terms",
      title:"Like vs unlike terms",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <text x="280" y="25" text-anchor="middle" fill="currentColor" font-size="15" font-weight="bold">Like vs Unlike Terms</text>
  <!-- table header -->
  <rect x="20" y="38" width="250" height="35" fill="#34a853" rx="4"/>
  <text x="145" y="60" text-anchor="middle" fill="white" font-weight="bold">LIKE (can combine)</text>
  <rect x="290" y="38" width="250" height="35" fill="#ea4335" rx="4"/>
  <text x="415" y="60" text-anchor="middle" fill="white" font-weight="bold">UNLIKE (cannot combine)</text>
  ${[
    ["3x  and  5x","same variable x","3x  and  3x²","different powers"],
    ["4ab and −2ab","same variables ab","4a² and 4b²","different variables"],
    ["7y² and −y²","same power of y","5x and 5","one has variable"],
    ["2x²y and 8x²y","same x²y","2xy and 2xy²","different powers of y"]
  ].map(([l,lr,u,ur],i)=>`
  <rect x="20" y="${73+i*56}" width="250" height="56" fill="${i%2===0?"#e6f4ea":"#f0faf0"}" stroke="#34a853" stroke-width="0.5"/>
  <text x="145" y="${96+i*56}" text-anchor="middle" fill="#34a853" font-weight="bold">${l}</text>
  <text x="145" y="${115+i*56}" text-anchor="middle" fill="#888" font-size="11">${lr}</text>
  <rect x="290" y="${73+i*56}" width="250" height="56" fill="${i%2===0?"#fce8e6":"#fff0ef"}" stroke="#ea4335" stroke-width="0.5"/>
  <text x="415" y="${96+i*56}" text-anchor="middle" fill="#ea4335" font-weight="bold">${u}</text>
  <text x="415" y="${115+i*56}" text-anchor="middle" fill="#888" font-size="11">${ur}</text>`).join("")}
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"3x + 5 = 8x (constants and x-terms are like)", correction:"5 is a constant (no variable); 3x has a variable. They are unlike — cannot be combined."},
      {wrong_idea:"x² + x = x³ (add the exponents)", correction:"x² and x are unlike (different powers). You cannot add them. x²+x stays as x²+x."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Colour-code by variable group", rule:"Underline all x² in red, all x in blue, all constants in green — then add within each colour.", example:"5x²−3x+7x²+2x−4: red(12x²), blue(−x), green(−4)", when_to_use:"Any expression with three or more types of terms."}
    ],
    when_to_use_this_method:{
      use_this_when:["Simplifying polynomial expressions","Adding or subtracting polynomials","Checking work after expansion"],
      use_other_when:["All terms are unlike — expression is already in simplest form","You need to multiply terms — different rule applies (add exponents)"]
    },
    edge_cases:[
      {case:"5xy and 5yx", value:"LIKE (multiplication is commutative)", reasoning:"xy = yx, so they are the same variable part.", where_it_appears:"Always simplify variable parts by ordering variables alphabetically before comparing."},
      {case:"x⁰ and 1", value:"LIKE (x⁰ = 1)", reasoning:"Any variable to the power 0 equals 1, so x⁰y and y are like terms.", where_it_appears:"Polynomial simplification when a term simplifies to a constant."}
    ],
    key_takeaway:"Like terms have identical variable parts (same variables, same exponents); only like terms can be added or subtracted — combine their coefficients.",
    video_script_hooks:{
      opening_hook:"3 apples + 5 oranges. You can't add them into 8 appleoranges. Algebra has the same rule: only like terms can combine.",
      concept_reveal:"The distributive law explains why: 3x + 5x = (3+5)x = 8x. The variable is the 'unit' — it must match.",
      common_mistake_moment:"3x + 5 ≠ 8x. The 5 is a constant — no x attached. It can only combine with other constants.",
      real_world_connection:"Adding kilometres to kilometres, rupees to rupees — like terms are just the algebra version of keeping units consistent.",
      closing_hook:"Match the variable, match the power, then add the coefficients. That's the only rule you need."
    }
  }
},
{
  topicId:"cbse_math8_ch6_algebraic_simplification", chapterNumber:6, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Simplifying Algebraic Expressions",
  key_formulas:[
    {formula:"Simplified form: no like terms ungrouped, no brackets expandable", explanation:"An expression is fully simplified when like terms are combined and all brackets are expanded."},
    {formula:"Substitution check: evaluate both forms at x=1,2 to verify", explanation:"A quick numerical check to confirm simplification is correct."}
  ],
  prerequisite_knowledge:["like and unlike terms","distributive law","factorisation basics"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Simplifying means rewriting an expression in its neatest, shortest equivalent form — same value, fewer terms.",
      hook:"2(3x+4) − 5x + 1 looks complex. Simplified: 6x+8−5x+1 = x+9. Three steps, one clean result.",
      real_world_anchors:["simplifying building cost formulas","reducing algebraic models in science","cleaning up budgeting expressions"],
      the_pivot_idea:"Simplification is the algebraic equivalent of tidying up — expand, collect like terms, done.",
      wrong_intuitions_to_replace:["'Simplified means factored' — Simplified means fewest terms; factored and simplified are different goals.","'You can stop as soon as it looks simpler' — Only stop when NO like terms remain and ALL brackets are expanded."]
    },
    derivation:"General procedure: (1) Expand all brackets using the distributive law. (2) Identify like terms (same variable and power). (3) Add or subtract their coefficients. (4) Write remaining unlike terms. Verify by substituting a test value into both forms.",
    worked_example:[
      {problem:"Simplify: 3(2x − 5) + 4(x + 3) − 7", steps:["Expand: 6x − 15 + 4x + 12 − 7","Collect x-terms: 6x + 4x = 10x","Collect constants: −15 + 12 − 7 = −10","Result: 10x − 10 = 10(x−1)"], answer:"10x − 10"},
      {problem:"Simplify: (x + 2)² − x(x + 4)", steps:["Expand (x+2)²: x²+4x+4","Expand x(x+4): x²+4x","Subtract: x²+4x+4 − x²−4x"], answer:"4"}
    ],
    visual_description:"A flowchart showing four steps: Expand brackets → Identify like terms (colour-coded) → Combine coefficients → Write final expression, with a worked example running through each step.",
    svg_diagrams:[{
      id:"cbse_math8_ch6_simplification_flowchart",
      title:"Steps for simplifying algebraic expressions",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- step boxes -->
  ${[
    ["1. Expand brackets","Distribute every factor","3(2x−5) → 6x−15","#4285f4"],
    ["2. Find like terms","Same variable + power","6x and 4x are like","#34a853"],
    ["3. Combine coefficients","Add/subtract like terms","6x+4x = 10x","#ea4335"],
    ["4. Write final form","No expandable brackets","10x−10","#fbbc04"]
  ].map(([title,sub,ex,color],i)=>`
  <rect x="20" y="${20+i*72}" width="520" height="62" rx="8" fill="${color}15" stroke="${color}" stroke-width="2"/>
  <text x="40" y="${44+i*72}" fill="${color}" font-weight="bold" font-size="14">${title}</text>
  <text x="40" y="${65+i*72}" fill="currentColor">${sub}</text>
  <text x="360" y="${55+i*72}" fill="#888" font-size="12">e.g. ${ex}</text>
  ${i<3?`<text x="270" y="${90+i*72}" text-anchor="middle" fill="#888" font-size="18">↓</text>`:""}
  `).join("")}
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"(x+2)² = x²+4 (no middle term)", correction:"(x+2)² = x²+4x+4. The middle term 2×x×2 = 4x is essential — never skip it."},
      {wrong_idea:"Simplified means smallest number of symbols", correction:"Simplified means no unexpanded brackets and no uncombined like terms. 10(x−1) and 10x−10 are both simplified — the factored form is not 'more simplified.'"}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Substitute x=1 to check", rule:"Evaluate original and simplified at x=1; they must agree.", example:"3(2×1−5)+4(1+3)−7 = 3(−3)+4(4)−7 = −9+16−7 = 0. Check: 10(1)−10=0 ✓", when_to_use:"Verifying any algebraic simplification quickly."}
    ],
    when_to_use_this_method:{
      use_this_when:["Preparing expressions for equation solving","Combining terms in word problems","Reducing complexity in multi-step calculations"],
      use_other_when:["The expression is already fully simplified — proceed to solve the equation","You need a factored form — factorisation is a separate goal"]
    },
    edge_cases:[
      {case:"All terms cancel", value:"Simplified result = 0", reasoning:"If all terms cancel, the expression equals 0 — a valid simplification.", where_it_appears:"(x+1)²−x²−2x−1 = 0 always; this reveals an identity."},
      {case:"Simplification gives a constant", value:"All variable terms cancel", reasoning:"Shows the expression is an identity (e.g. always equals 4 regardless of x).", where_it_appears:"(x+2)²−x(x+4) = 4 — proved by simplification."}
    ],
    key_takeaway:"Simplify by expanding brackets → collecting like terms → writing final form; verify with a test substitution.",
    video_script_hooks:{
      opening_hook:"An expression like 3(2x−5)+4(x+3)−7 looks intimidating. Four steps and 30 seconds later: 10x−10. Same expression, much cleaner.",
      concept_reveal:"Simplification is a two-step loop: expand then collect. Repeat until no brackets remain and no like terms exist.",
      common_mistake_moment:"(x+2)² ≠ x²+4. The middle term 4x vanishes only if you forget the 2×x×2 part. It never disappears.",
      real_world_connection:"Physicists simplify equations of motion; economists simplify cost functions. Clean expressions are easier to analyse and solve.",
      closing_hook:"Every complex expression hides a simpler one. Your job is to find it — expand, collect, simplify."
    }
  }
},

// ── Ch7: Proportional Reasoning I ────────────────────────────────────────────
{
  topicId:"cbse_math8_ch7_ratios", chapterNumber:7, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Ratios",
  key_formulas:[
    {formula:"Ratio a : b = a/b  (b ≠ 0)", explanation:"A ratio compares two quantities of the same unit by division."},
    {formula:"Equivalent ratios: a/b = ka/kb for any k ≠ 0", explanation:"Multiply or divide both terms by the same non-zero number to get an equivalent ratio."}
  ],
  prerequisite_knowledge:["fractions","HCF","division"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A ratio tells you how many times one quantity fits into another — it's a comparison by division, not by subtraction.",
      hook:"In a class of 20 girls and 30 boys, the girl-to-boy ratio is 20:30 = 2:3. Every 2 girls correspond to 3 boys — the ratio captures the relative size, not the actual size.",
      real_world_anchors:["mixing paint colours (red:blue ratio)","recipe scaling (flour:sugar ratio)","map scales (1:50000)"],
      the_pivot_idea:"Ratios compare relative sizes — doubling both quantities leaves the ratio unchanged, just as doubling numerator and denominator of a fraction leaves it unchanged.",
      wrong_intuitions_to_replace:["'a:b and b:a are the same ratio' — They are reciprocals: 2:3 ≠ 3:2.","'Ratios must use whole numbers' — 1.5:1 = 3:2; simplify to integers when possible but fractions are valid."]
    },
    derivation:"a:b is defined as the fraction a/b. Two ratios a:b and c:d are equal iff ad = bc (cross-multiplication). In simplest form: divide both terms by their HCF. Ratios are dimensionless — both quantities must be in the same unit before forming a ratio.",
    worked_example:[
      {problem:"Divide ₹560 in ratio 3:5.", steps:["Total parts = 3+5 = 8","Each part = 560/8 = 70","First share = 3×70, second = 5×70"], answer:"₹210 and ₹350"},
      {problem:"Simplify the ratio 48:72.", steps:["HCF(48,72) = 24","48÷24 : 72÷24"], answer:"2 : 3"}
    ],
    visual_description:"A bar divided into 5 equal segments — 2 coloured blue (ratio part A) and 3 coloured green (ratio part B) — representing the ratio 2:3 with the total amount labelled below.",
    svg_diagrams:[{
      id:"cbse_math8_ch7_ratios_bar",
      title:"Ratio 2:3 shown as a bar model",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
  <!-- ratio bar -->
  <rect x="40" y="80" width="160" height="70" fill="#4285f4" stroke="#2050c0" stroke-width="2"/>
  <rect x="200" y="80" width="240" height="70" fill="#34a853" stroke="#1a7030" stroke-width="2"/>
  <text x="120" y="120" text-anchor="middle" fill="white" font-size="16" font-weight="bold">2 parts</text>
  <text x="320" y="120" text-anchor="middle" fill="white" font-size="16" font-weight="bold">3 parts</text>
  <!-- labels -->
  <text x="120" y="170" text-anchor="middle" fill="#4285f4">A</text>
  <text x="320" y="170" text-anchor="middle" fill="#34a853">B</text>
  <line x1="40" y1="185" x2="440" y2="185" stroke="currentColor" stroke-width="1.5"/>
  <text x="240" y="205" text-anchor="middle" fill="currentColor">Total = 5 parts</text>
  <!-- example: divide 500 in 2:3 -->
  <rect x="40" y="230" width="480" height="70" fill="#f8f9fa" stroke="#dee2e6" rx="6"/>
  <text x="280" y="256" text-anchor="middle" fill="currentColor" font-weight="bold">Divide ₹500 in ratio 2:3</text>
  <text x="280" y="278" text-anchor="middle" fill="currentColor">1 part = 500÷5 = ₹100</text>
  <text x="280" y="298" text-anchor="middle" fill="currentColor">A = 2×100 = ₹200   B = 3×100 = ₹300</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Ratio 3:5 means one quantity is 3 and the other is 5", correction:"3:5 means for every 3 units of A there are 5 units of B. The actual values depend on the total."},
      {wrong_idea:"Ratios can compare quantities in different units directly", correction:"Before forming a ratio, convert to the same unit: 500 g : 2 kg → 500 g : 2000 g = 1:4."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Divide in a ratio using part-method", rule:"Find total parts; compute one part = total ÷ total parts; multiply each share.", example:"₹560 in 3:5 → total parts 8, one part ₹70 → ₹210 and ₹350", when_to_use:"Any 'divide in ratio' problem."}
    ],
    when_to_use_this_method:{
      use_this_when:["Comparing two quantities of the same type","Scaling recipes or mixing solutions","Map scales and model representations"],
      use_other_when:["Comparing quantities with different units — convert first","The comparison involves more than two quantities — use compound ratio"]
    },
    edge_cases:[
      {case:"a:b when a = b", value:"1:1", reasoning:"Equal quantities have a ratio of 1 to 1.", where_it_appears:"Equal division; 50-50 split."},
      {case:"a:b when a = 0", value:"0:b = 0:1", reasoning:"Zero to anything is 0; by convention simplify to 0:1.", where_it_appears:"One share is zero (one party gets nothing)."}
    ],
    key_takeaway:"A ratio a:b compares quantities by division; simplify by dividing by HCF; both quantities must be in the same unit.",
    video_script_hooks:{
      opening_hook:"A recipe calls for flour and sugar in ratio 3:1. If you use 300 g of flour, how much sugar? 100 g. Ratios scale — that's their power.",
      concept_reveal:"A ratio is just a fraction in disguise — 2:3 = 2/3. Simplify ratios the same way you simplify fractions.",
      common_mistake_moment:"500 g to 2 kg — before you write the ratio, convert units! That's 500:2000 = 1:4.",
      real_world_connection:"Recipes, paint colours, mortar mixing, map scales — every comparison of related quantities uses ratios.",
      closing_hook:"Ratios are the language of proportional thinking — master them and scaling problems become trivial."
    }
  }
},
{
  topicId:"cbse_math8_ch7_proportions", chapterNumber:7, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Proportions",
  key_formulas:[
    {formula:"a:b :: c:d  ⟺  ad = bc  (cross-product rule)", explanation:"Four quantities are in proportion iff the product of extremes equals the product of means."},
    {formula:"Continued proportion: a:b = b:c  ⟺  b² = ac  (geometric mean)", explanation:"When three quantities are in proportion, the middle term is the geometric mean of the outer two."}
  ],
  prerequisite_knowledge:["ratios","equivalent fractions","cross-multiplication"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Proportion is the statement that two ratios are equal — it lets you scale from known to unknown.",
      hook:"If 3 pens cost ₹15, what do 7 pens cost? Set up 3:15 :: 7:x and cross-multiply: 3x = 105, x = ₹35. Proportion solves the scaling problem.",
      real_world_anchors:["price scaling (unit rate)","map reading (map scale)","similar triangle side lengths"],
      the_pivot_idea:"Proportion is the algebraic version of 'same ratio' — it captures the idea that the relative scale between quantities is preserved.",
      wrong_intuitions_to_replace:["'a:b :: c:d means a=c and b=d' — No, it means a/b = c/d (equal ratios, not equal values).","'Cross-multiplication gives the answer directly' — It gives an equation; you still need to solve for the unknown."]
    },
    derivation:"a:b :: c:d means a/b = c/d. Cross-multiply: ad = bc. To solve for x in a:b :: c:x, substitute and solve: ax = bc, so x = bc/a. For continued proportion a:b = b:c: b/a = c/b, so b² = ac.",
    worked_example:[
      {problem:"If 8 workers finish a job in 15 days, how many days do 12 workers take?", steps:["More workers → fewer days (inverse proportion)","8×15 = 12×d","d = 120/12"], answer:"10 days"},
      {problem:"Find x if 4:x :: x:9.", steps:["x² = 4×9 = 36 (continued proportion)","x = √36"], answer:"6"}
    ],
    visual_description:"A double number line: top line showing 'pens: 3, 7' and bottom line showing 'cost: ₹15, ₹x', with arrows linking 3↔15 and 7↔x, and a cross-multiplication equation below.",
    svg_diagrams:[{
      id:"cbse_math8_ch7_proportion_double_line",
      title:"Proportion via double number line",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- double number line -->
  <text x="20" y="90" fill="#4285f4" font-weight="bold">Pens:</text>
  <line x1="80" y1="85" x2="480" y2="85" stroke="#4285f4" stroke-width="2"/>
  <circle cx="180" cy="85" r="6" fill="#4285f4"/>
  <text x="180" y="72" text-anchor="middle" fill="#4285f4">3</text>
  <circle cx="380" cy="85" r="6" fill="#4285f4"/>
  <text x="380" y="72" text-anchor="middle" fill="#4285f4">7</text>
  <text x="20" y="165" fill="#34a853" font-weight="bold">Cost:</text>
  <line x1="80" y1="160" x2="480" y2="160" stroke="#34a853" stroke-width="2"/>
  <circle cx="180" cy="160" r="6" fill="#34a853"/>
  <text x="180" y="180" text-anchor="middle" fill="#34a853">₹15</text>
  <circle cx="380" cy="160" r="6" fill="#34a853"/>
  <text x="380" y="180" text-anchor="middle" fill="#ea4335" font-weight="bold">₹x = ?</text>
  <!-- connecting arrows -->
  <line x1="180" y1="91" x2="180" y2="154" stroke="#888" stroke-width="1.5" stroke-dasharray="4,3"/>
  <line x1="380" y1="91" x2="380" y2="154" stroke="#888" stroke-width="1.5" stroke-dasharray="4,3"/>
  <!-- cross-multiply -->
  <rect x="60" y="210" width="440" height="80" fill="#fff8e1" stroke="#fbbc04" rx="6"/>
  <text x="280" y="238" text-anchor="middle" fill="currentColor" font-weight="bold">3 : 15 :: 7 : x</text>
  <text x="280" y="262" text-anchor="middle" fill="currentColor">Cross-multiply: 3x = 15 × 7 = 105</text>
  <text x="280" y="284" text-anchor="middle" fill="#fbbc04" font-weight="bold">x = 35   →   ₹35</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"In proportion a:b::c:d, we can add or subtract the same number from all four terms", correction:"Only multiplication/division preserves a proportion. Adding changes the ratio: 1:2::3:6 but (1+1):(2+1)::? — this is not a valid proportion operation."},
      {wrong_idea:"Inverse proportion means subtracting — more of one, less of other by the same amount", correction:"Inverse proportion means the PRODUCT is constant: a×b = k. More of one means the other shrinks proportionally, not by a fixed amount."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Check proportion with cross-multiplication instantly", rule:"ad = bc → proportion holds; ad ≠ bc → it doesn't.", example:"Is 2:3 :: 8:12? 2×12=24 = 3×8=24 ✓ Yes.", when_to_use:"Verifying any claimed proportion in seconds."}
    ],
    when_to_use_this_method:{
      use_this_when:["Scaling quantities (recipes, dilutions, wages)","Map and model scale problems","Finding unknown in similar figure problems"],
      use_other_when:["The relationship is not proportional — check if direct or inverse first","The problem involves percentages — convert to proportion form"]
    },
    edge_cases:[
      {case:"b = 0 or d = 0", value:"undefined proportion", reasoning:"Ratios with zero denominators are undefined.", where_it_appears:"Always check for zero before cross-multiplying."},
      {case:"All four terms equal (a:a::a:a)", value:"trivially proportional", reasoning:"a/a = 1 = a/a.", where_it_appears:"Degenerate case; not useful but technically valid."}
    ],
    key_takeaway:"a:b::c:d means ad=bc; use cross-multiplication to find unknowns; distinguish direct proportion (ratio constant) from inverse proportion (product constant).",
    video_script_hooks:{
      opening_hook:"3 pens for ₹15. How much for 7 pens? Set up a proportion, cross-multiply, and the answer is yours in 5 seconds.",
      concept_reveal:"Proportion is the algebraic way of saying 'the ratio stays the same.' Equal ratios → cross-products are equal.",
      common_mistake_moment:"More workers, fewer days — that's INVERSE proportion. The product 8×15 = 12×d, not the ratio.",
      real_world_connection:"Similar triangles, map scales, currency conversion, cooking — every 'scale this to that' problem is a proportion.",
      closing_hook:"Proportion is the universal scaling tool. One equation, one cross-multiply, one answer."
    }
  }
},
{
  topicId:"cbse_math8_ch7_unitary_method", chapterNumber:7, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"The Unitary Method",
  key_formulas:[
    {formula:"Value of 1 unit = total value / number of units", explanation:"Find the value of one unit first, then multiply to find the value of any number of units."},
    {formula:"For inverse: Value of 1 unit × number = constant", explanation:"In inverse problems, find what one unit implies, then scale accordingly."}
  ],
  prerequisite_knowledge:["ratios","proportions","multiplication and division"],
  teaching_content:{
    intuition:{
      elevator_pitch:"The unitary method reduces any proportion problem to two steps: find the value of ONE unit, then multiply for any other quantity.",
      hook:"5 books cost ₹375. What do 8 books cost? Step 1: 1 book = 375÷5 = ₹75. Step 2: 8 books = 75×8 = ₹600. Always through one unit.",
      real_world_anchors:["unit price at a supermarket","speed (km per hour = per ONE hour)","rate problems (salary per day)"],
      the_pivot_idea:"Going through 'one unit' is universally safe — it avoids ratios and proportions entirely, relying only on multiplication and division.",
      wrong_intuitions_to_replace:["'Always divide then multiply' — For inverse proportion, you still divide to find the unit value, but the logic reverses.","'The unitary method works for everything' — Only for direct proportional relationships."]
    },
    derivation:"Direct proportion: if n units cost C, then 1 unit costs C/n, and k units cost k×(C/n) = kC/n. Inverse proportion: if n workers take D days, one worker takes n×D days (alone), and k workers take nD/k days. Always verify the type of variation first.",
    worked_example:[
      {problem:"A car travels 360 km in 6 hours. How far in 4 hours at the same speed?", steps:["In 1 hour: 360÷6 = 60 km","In 4 hours: 60×4"], answer:"240 km"},
      {problem:"15 workers build a wall in 12 days. How many days if 20 workers work?", steps:["1 worker takes 15×12 = 180 days (inverse)","20 workers take 180÷20"], answer:"9 days"}
    ],
    visual_description:"A two-step ladder diagram: Step 1 shows 'n units → ÷n → 1 unit'; Step 2 shows '1 unit → ×k → k units', with numerical values filled in for a worked example.",
    svg_diagrams:[{
      id:"cbse_math8_ch7_unitary_method_ladder",
      title:"Unitary method: two-step ladder",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- step 1 box -->
  <rect x="40" y="30" width="200" height="80" rx="8" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="140" y="60" text-anchor="middle" fill="#4285f4" font-weight="bold">GIVEN</text>
  <text x="140" y="85" text-anchor="middle" fill="currentColor">5 books = ₹375</text>
  <!-- step 2 box -->
  <rect x="180" y="150" width="200" height="80" rx="8" fill="#e6f4ea" stroke="#34a853" stroke-width="2"/>
  <text x="280" y="180" text-anchor="middle" fill="#34a853" font-weight="bold">STEP 1: Find 1 unit</text>
  <text x="280" y="205" text-anchor="middle" fill="currentColor">1 book = 375÷5 = ₹75</text>
  <!-- step 3 box -->
  <rect x="320" y="270" width="200" height="40" rx="8" fill="#fff8e1" stroke="#fbbc04" stroke-width="2"/>
  <text x="420" y="295" text-anchor="middle" fill="#fbbc04" font-weight="bold">8 books = 75×8 = ₹600</text>
  <!-- arrows -->
  <line x1="140" y1="110" x2="280" y2="150" stroke="#888" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="185" y="140" fill="#ea4335" font-size="12">÷ 5</text>
  <line x1="280" y1="230" x2="420" y2="270" stroke="#888" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="335" y="265" fill="#34a853" font-size="12">× 8</text>
  <!-- rule box -->
  <rect x="40" y="270" width="240" height="40" rx="6" fill="#fce8e6" stroke="#ea4335"/>
  <text x="160" y="295" text-anchor="middle" fill="#ea4335" font-size="12">Always verify: direct or inverse?</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"The unitary method always means dividing then multiplying in that order", correction:"For inverse proportion, you find the one-unit equivalent differently. Always identify the type of variation first."},
      {wrong_idea:"More workers = more time to finish the same job", correction:"More workers finish faster — this is INVERSE proportion. The product (workers × days) stays constant."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Write the proportion sentence first, identify type, then apply unitary", rule:"'More of X → more/less of Y?' → direct if more/more or less/less; inverse if more/less.", example:"Workers vs time: more workers → less time → inverse.", when_to_use:"Before solving any rate/proportion problem."}
    ],
    when_to_use_this_method:{
      use_this_when:["Rate problems (speed, wages, consumption)","Shopping comparison of unit prices","Any 'if n gives this, what does k give?' problem"],
      use_other_when:["Three or more interrelated variables — use combined variation","The relationship is not proportional (non-linear) — do not use unitary method"]
    },
    edge_cases:[
      {case:"k = n (same number of units asked)", value:"Same as given — verify step by step", reasoning:"Sanity check: unitary method should return the original value.", where_it_appears:"Check your answer by substituting the given values back."},
      {case:"Fractional number of units", value:"Allowed; gives fractional result", reasoning:"1.5 hours at 60 km/h = 90 km. Unitary still works.", where_it_appears:"Partial-day wages, partial-hour travel problems."}
    ],
    key_takeaway:"Divide to find the unit value, multiply to find any other value; always check whether the proportion is direct or inverse before applying.",
    video_script_hooks:{
      opening_hook:"5 books, ₹375. 8 books, how much? One step through 'one book' and you're done. That's the unitary method.",
      concept_reveal:"The method has two steps, always: reduce to one unit, then scale up. Everything else is just knowing whether to divide or multiply.",
      common_mistake_moment:"More workers, more time? NO — inverse! More workers means LESS time. Always check the direction first.",
      real_world_connection:"Every supermarket 'per kilogram' price uses the unitary method. Comparing value for money is always a unit-price calculation.",
      closing_hook:"Through one, to any. That's the unitary method — the most universally useful rate-solving tool in arithmetic."
    }
  }
},
{
  topicId:"cbse_math8_ch7_percentages", chapterNumber:7, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Percentages",
  key_formulas:[
    {formula:"Percentage = (Part / Whole) × 100", explanation:"Express a fraction as parts per hundred."},
    {formula:"Percentage change = ((New − Old) / Old) × 100", explanation:"Positive = increase; negative = decrease."}
  ],
  prerequisite_knowledge:["fractions and decimals","ratios","multiplication and division"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Per cent means 'per hundred' — a percentage puts everything on the same scale of 100, making comparisons instant.",
      hook:"Scoring 36/40 vs 72/80 — who did better? 36/40 = 90%, 72/80 = 90%. Equal! Percentages reveal what raw numbers hide.",
      real_world_anchors:["exam scores","discounts in shops","bank interest rates","election results"],
      the_pivot_idea:"Percentages standardise comparisons — they convert any fraction to an equivalent fraction out of 100, enabling apples-to-apples comparison.",
      wrong_intuitions_to_replace:["'A 50% increase followed by a 50% decrease returns to the original' — No: 100 → 150 → 75 (25% below original).","'Percentage is always between 0 and 100' — Percentages can exceed 100% (growth) or be negative (loss)."]
    },
    derivation:"x% = x/100. To convert fraction to %: multiply by 100. To convert % to fraction: divide by 100. Percentage increase: new value = original × (1 + r/100). Percentage decrease: new value = original × (1 − r/100). These formulas compound when applied repeatedly.",
    worked_example:[
      {problem:"A shirt costs ₹800, discounted by 15%. Find sale price.", steps:["Discount = 15% of 800 = (15/100)×800 = ₹120","Sale price = 800 − 120"], answer:"₹680"},
      {problem:"A price increased from ₹250 to ₹300. Find percentage increase.", steps:["Increase = 300−250 = 50","% increase = (50/250)×100"], answer:"20%"}
    ],
    visual_description:"A 10×10 grid of 100 small squares with 37 shaded to represent 37%, alongside a pie chart showing 37% and 63% segments labelled.",
    svg_diagrams:[{
      id:"cbse_math8_ch7_percentage_grid",
      title:"Percentage as parts per hundred",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <!-- 10x10 grid for 37% -->
  ${Array.from({length:100},(_,i)=>`<rect x="${20+(i%10)*26}" y="${20+Math.floor(i/10)*26}" width="24" height="24" rx="2" fill="${i<37?"#4285f4":"#e8f0fe"}" stroke="white" stroke-width="1"/>`).join("")}
  <text x="150" y="295" text-anchor="middle" fill="currentColor">37 shaded = 37%</text>
  <!-- pie chart for 37% -->
  <circle cx="400" cy="160" r="110" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <!-- 37% arc (37% of 360° = 133.2°) -->
  <path d="M 400 160 L 400 50 A 110 110 0 0 1 492 216 Z" fill="#4285f4"/>
  <text x="430" y="120" fill="white" font-weight="bold">37%</text>
  <text x="360" y="230" fill="#4285f4" font-size="11">63%</text>
  <!-- formulas -->
  <text x="400" y="295" text-anchor="middle" fill="currentColor" font-size="12">% = (Part ÷ Whole) × 100</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"50% increase then 50% decrease returns to original", correction:"100 × 1.5 × 0.5 = 75 — not 100. Percentage changes compound multiplicatively, not additively."},
      {wrong_idea:"Percentages must be between 0 and 100", correction:"200% means double; −10% means a 10% decrease. Percentages can be any real number."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"10% trick", rule:"10% of any number = number ÷ 10. Build other percentages from this.", example:"35% of 480: 10% = 48; 30% = 144; 5% = 24; 35% = 168", when_to_use:"Mental percentage calculations without a calculator."}
    ],
    when_to_use_this_method:{
      use_this_when:["Comparing fractions on a common scale","Calculating discounts, interest, profit, loss","Expressing changes as relative (not absolute) amounts"],
      use_other_when:["Exact fractions are needed — 1/3 = 33.33…% loses precision","The context is rates not percentages (speed, density)"]
    },
    edge_cases:[
      {case:"0% of anything", value:"0", reasoning:"0% means no part of the whole.", where_it_appears:"Zero discount; zero interest; zero growth."},
      {case:"100% of something", value:"The full amount", reasoning:"100% = the whole thing.", where_it_appears:"100% attendance; 100% efficiency (ideal, rarely achieved)."},
      {case:"Over 100%", value:"More than the original", reasoning:"120% means 20% MORE than the original.", where_it_appears:"A salary increased by 120% — now 220% of original salary."}
    ],
    key_takeaway:"Per cent = per hundred; convert fractions to % by ×100; percentage change = ((new−old)/old)×100; successive % changes compound multiplicatively.",
    video_script_hooks:{
      opening_hook:"36/40 or 72/80 — who scored better? Convert both to percentages and it's instantly clear: both are 90%. Percentages make comparison effortless.",
      concept_reveal:"Percent literally means 'per hundred.' Every fraction can be turned into a fraction out of 100 — and suddenly all comparisons are on the same scale.",
      common_mistake_moment:"50% up then 50% down does NOT return to the start. Multiply: ×1.5 × 0.5 = ×0.75. You end up 25% BELOW the start.",
      real_world_connection:"Sales discounts, bank interest, election results, body fat percentage, cricket averages — percentages run the world.",
      closing_hook:"Once you see everything as per hundred, you stop comparing apples and oranges and start comparing numbers."
    }
  }
},

,

// ── Ch8: Fractions in Disguise ────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch8_complex_fractions", chapterNumber:8, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Complex Fractions",
  key_formulas:[
    {formula:"(a/b) / (c/d) = (a/b) × (d/c) = ad/bc", explanation:"Dividing by a fraction equals multiplying by its reciprocal."},
    {formula:"Simplify complex fraction by multiplying numerator and denominator by the LCD", explanation:"Alternative method: clear all inner fractions at once."}
  ],
  prerequisite_knowledge:["fraction operations","reciprocals","LCM"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A complex fraction has a fraction inside a fraction — simplify by multiplying by the reciprocal of the bottom fraction.",
      hook:"(3/4) ÷ (1/2) asks: how many halves fit into three-quarters? 1.5. Think of it as multiplying by 2 (flipping the ½).",
      real_world_anchors:["splitting a half-portion recipe further","rate of a rate (km per litre per hour)","comparing unit prices"],
      the_pivot_idea:"Dividing by a fraction is the same as multiplying by its reciprocal — this is the only rule needed for complex fractions.",
      wrong_intuitions_to_replace:["'Divide numerators and divide denominators' — (3/4)÷(1/2) ≠ 3/2. You must invert the divisor.","'Complex fractions are always > 1' — (1/4)÷(3/4) = 1/3 < 1."]
    },
    derivation:"(a/b) ÷ (c/d): multiply both by d/c to get (a/b)×(d/c) ÷ 1 = ad/bc. Alternatively: multiply numerator and denominator of the big fraction by LCD(b,d): [a/b × bd] / [c/d × bd] = ad/bc.",
    worked_example:[
      {problem:"Simplify: (5/6) ÷ (10/9)", steps:["= (5/6) × (9/10)","= 45/60","= 3/4"], answer:"3/4"},
      {problem:"Simplify: (1/2 + 1/3) / (1/4 − 1/6)", steps:["Numerator: 1/2+1/3 = 5/6","Denominator: 1/4−1/6 = 1/12","= (5/6) ÷ (1/12) = (5/6)×12 = 10"], answer:"10"}
    ],
    visual_description:"A large fraction bar with '3/4' above and '1/2' below, and an arrow pointing right to '3/4 × 2/1 = 3/2', with the word 'FLIP' written over the arrow to emphasise the reciprocal step.",
    svg_diagrams:[{
      id:"cbse_math8_ch8_complex_fractions",
      title:"Complex fraction: invert and multiply",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="16">
  <!-- complex fraction -->
  <text x="80" y="110" text-anchor="middle" fill="#4285f4" font-size="28" font-weight="bold">3/4</text>
  <line x1="30" y1="130" x2="130" y2="130" stroke="#4285f4" stroke-width="3"/>
  <text x="80" y="165" text-anchor="middle" fill="#4285f4" font-size="28" font-weight="bold">1/2</text>
  <!-- arrow with FLIP -->
  <line x1="145" y1="137" x2="220" y2="137" stroke="#ea4335" stroke-width="2.5" marker-end="url(#arr)"/>
  <text x="182" y="125" text-anchor="middle" fill="#ea4335" font-weight="bold">FLIP</text>
  <text x="182" y="155" text-anchor="middle" fill="#888" font-size="12">× reciprocal</text>
  <!-- result -->
  <text x="280" y="120" fill="currentColor" font-size="18">3/4  ×  2/1</text>
  <line x1="245" y1="135" x2="380" y2="135" stroke="currentColor" stroke-width="1.5"/>
  <!-- equals -->
  <text x="420" y="90" fill="currentColor" font-size="16">=  6/4</text>
  <text x="420" y="130" fill="currentColor" font-size="16">=  3/2</text>
  <text x="420" y="170" fill="#34a853" font-size="16" font-weight="bold">=  1½</text>
  <!-- rule box -->
  <rect x="30" y="210" width="500" height="75" fill="#fff8e1" stroke="#fbbc04" rx="8"/>
  <text x="280" y="238" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="14">Rule: (a/b) ÷ (c/d) = (a/b) × (d/c)</text>
  <text x="280" y="268" text-anchor="middle" fill="#888" font-size="12">Invert the BOTTOM fraction and multiply — always</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Dividing fractions means dividing tops and bottoms separately: (3/4)÷(1/2) = 3/2", correction:"Correct answer is 3/4 × 2/1 = 6/4 = 3/2 — in this case it looks the same but it's coincidental. Use the rule: invert and multiply."},
      {wrong_idea:"Complex fractions cannot have addition/subtraction in the numerator or denominator", correction:"They can — simplify each part separately first, then perform the division."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"LCD method for nested fractions", rule:"Multiply every term by the LCD of all inner denominators.", example:"(1/2+1/3)/(1/4): LCD=12; multiply: (6+4)/3 = 10/3", when_to_use:"When numerator or denominator itself contains addition/subtraction of fractions."}
    ],
    when_to_use_this_method:{
      use_this_when:["Simplifying algebraic or numerical complex fractions","Rate problems involving fractions of fractions","Physics and chemistry formulas with compound rates"],
      use_other_when:["The expression is already a simple fraction — no complex division needed"]
    },
    edge_cases:[
      {case:"Denominator of the big fraction = 0", value:"undefined", reasoning:"Division by zero is always undefined.", where_it_appears:"Check the inner denominator fraction ≠ 0 before simplifying."},
      {case:"Result > 1", value:"Improper fraction → convert to mixed number", reasoning:"(3/4)÷(1/2) = 3/2 — valid; convert to 1½ for clarity.", where_it_appears:"Answers to complex fraction problems are often improper."}
    ],
    key_takeaway:"Dividing by a fraction = multiplying by its reciprocal; for complex fractions with sums inside, simplify numerator and denominator first.",
    video_script_hooks:{
      opening_hook:"How many halves fit in three-quarters? That's (3/4)÷(1/2). Flip the bottom, multiply — and the answer is 3/2.",
      concept_reveal:"Invert and multiply is not a trick — it comes from the definition of division. Dividing by x is the same as multiplying by 1/x.",
      common_mistake_moment:"Don't cross-divide the tops and bottoms separately. Always flip the bottom fraction and then multiply across.",
      real_world_connection:"Fuel efficiency in km per litre per hour, dosage rates in medicine, financial ratios — complex fractions are everywhere in science.",
      closing_hook:"Every complex fraction collapses into a simple multiplication. Flip the bottom, multiply, simplify."
    }
  }
},
{
  topicId:"cbse_math8_ch8_ratios_as_fractions", chapterNumber:8, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Ratios as Fractions",
  key_formulas:[
    {formula:"a : b = a/b", explanation:"Every ratio can be written as a fraction and vice versa."},
    {formula:"Part to whole: if ratio is a:b, part A = a/(a+b) of the total", explanation:"Convert ratio to fraction of the whole by dividing the part by the total parts."}
  ],
  prerequisite_knowledge:["ratios","fractions","equivalent fractions"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A ratio is just a fraction in different notation — converting between them unlocks all fraction arithmetic for ratio problems.",
      hook:"A recipe uses oil and water in ratio 2:5. What fraction of the mixture is oil? 2/(2+5) = 2/7. That's the power of converting ratio to fraction.",
      real_world_anchors:["mixture problems (part:whole)","map scale as a fraction","comparing speeds as fractions of a limit"],
      the_pivot_idea:"The ratio a:b is a part-to-part comparison; the fraction a/(a+b) is a part-to-whole comparison. Knowing which you need is crucial.",
      wrong_intuitions_to_replace:["'a:b as a fraction = a/b always' — a/b is part-to-part. For part-to-whole you need a/(a+b).","'Ratios and fractions are interchangeable without thought' — They encode different relationships; check the context."]
    },
    derivation:"Ratio a:b → fraction of whole occupied by a = a/(a+b). Example: 3:5 total → a's fraction = 3/8. To convert back: fraction p/q represents a ratio p:(q−p) or p:q depending on whether it's part-to-whole or part-to-part.",
    worked_example:[
      {problem:"In a class, ratio of boys to girls is 3:4. What fraction of the class are boys?", steps:["Total parts = 3+4 = 7","Boys' fraction = 3/7"], answer:"3/7"},
      {problem:"In a 500 mL mixture, salt:water = 1:4. How many mL of salt?", steps:["Salt fraction = 1/(1+4) = 1/5","Salt = (1/5)×500 = 100 mL"], answer:"100 mL"}
    ],
    visual_description:"A rectangle split into 7 equal parts — 3 blue (boys) and 4 green (girls) — with labels showing 3:4 ratio, 3/7 fraction, and 4/7 fraction.",
    svg_diagrams:[{
      id:"cbse_math8_ch8_ratio_fraction_bar",
      title:"Ratio 3:4 as fractions of the whole",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
  <!-- bar divided 3:4 -->
  ${[0,1,2].map(i=>`<rect x="${20+i*70}" y="80" width="70" height="80" fill="#4285f4" stroke="white" stroke-width="2"/>`).join("")}
  ${[0,1,2,3].map(i=>`<rect x="${230+i*70}" y="80" width="70" height="80" fill="#34a853" stroke="white" stroke-width="2"/>`).join("")}
  <text x="125" y="125" text-anchor="middle" fill="white" font-weight="bold" font-size="16">Boys (3)</text>
  <text x="370" y="125" text-anchor="middle" fill="white" font-weight="bold" font-size="16">Girls (4)</text>
  <!-- labels -->
  <line x1="20" y1="175" x2="510" y2="175" stroke="currentColor" stroke-width="1.5"/>
  <text x="265" y="200" text-anchor="middle" fill="currentColor">Total = 7 parts</text>
  <text x="125" y="230" text-anchor="middle" fill="#4285f4" font-weight="bold">Boys = 3/7</text>
  <text x="370" y="230" text-anchor="middle" fill="#34a853" font-weight="bold">Girls = 4/7</text>
  <!-- ratio vs fraction note -->
  <rect x="20" y="255" width="520" height="50" fill="#fff8e1" stroke="#fbbc04" rx="6"/>
  <text x="280" y="276" text-anchor="middle" fill="currentColor">Ratio 3:4 (part to part) → Fraction 3/7 (part to whole)</text>
  <text x="280" y="296" text-anchor="middle" fill="#888" font-size="12">Always identify whether you need part:part or part:whole</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Ratio 3:4 means 3/4 of the whole is boys", correction:"3:4 means 3 out of every 7 (not 4). Boys' fraction = 3/7, girls = 4/7."},
      {wrong_idea:"Converting ratio to fraction is always a:b = a/b", correction:"a/b is the ratio as a fraction (part-to-part). Part-to-whole is a/(a+b)."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Total parts = sum of ratio terms", rule:"For ratio a:b, total parts = a+b. Each part = 1/(a+b) of the whole.", example:"Ratio 5:3 → total 8 parts; 5 parts = 5/8 of whole", when_to_use:"All ratio-to-fraction conversions."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding what fraction of a whole is occupied by one part of a ratio","Mixture and alloy problems","Profit-sharing and inheritance problems"],
      use_other_when:["You need the ratio between two parts (not whole) — keep as a:b","You're comparing ratios — cross-multiply instead"]
    },
    edge_cases:[
      {case:"Ratio 1:0", value:"Fraction = 1/1 = 1 (all of one kind)", reasoning:"Zero of the second type means 100% of the first.", where_it_appears:"Pure substance; 100% efficiency."},
      {case:"Equal ratio a:a", value:"Fraction = a/(2a) = 1/2 each", reasoning:"Equal parts → 50-50 split.", where_it_appears:"50-50 partnerships; fair division."}
    ],
    key_takeaway:"Ratio a:b gives fraction a/(a+b) of the whole for part A; always distinguish part-to-part from part-to-whole.",
    video_script_hooks:{
      opening_hook:"Oil and water in ratio 2:5. What fraction is oil? 2 out of 7 total parts — so 2/7. That's a ratio becoming a fraction.",
      concept_reveal:"Part-to-part vs part-to-whole: 3:4 means 3 of 7, NOT 3 of 4. The total parts is the key denominator.",
      common_mistake_moment:"Ratio 3:4 does NOT mean 3/4 of the total are boys. It means 3/7. Add ratio parts to get the denominator.",
      real_world_connection:"Nutrition labels, alloy compositions, election seat distributions — all use ratios-as-fractions of the whole.",
      closing_hook:"Ratios and fractions are two faces of the same coin. Know which face you're looking at."
    }
  }
},
{
  topicId:"cbse_math8_ch8_dividing_fractions", chapterNumber:8, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Dividing Fractions",
  key_formulas:[
    {formula:"(a/b) ÷ (c/d) = (a/b) × (d/c) = ad/(bc)", explanation:"Keep the first fraction, change ÷ to ×, flip the second fraction (reciprocal)."},
    {formula:"Whole number ÷ fraction: n ÷ (a/b) = nb/a", explanation:"Multiply the whole number by the reciprocal of the fraction."}
  ],
  prerequisite_knowledge:["fraction multiplication","reciprocals","complex fractions"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Dividing by a fraction asks 'how many of these fit in that?' — and the answer comes from multiplying by the reciprocal.",
      hook:"How many ¾-metre pieces can you cut from a 6-metre rope? 6 ÷ (3/4) = 6 × (4/3) = 8. Eight pieces.",
      real_world_anchors:["cutting rope or fabric into equal pieces","sharing a fraction of a resource","cooking (how many 1/3-cup servings in 2 cups?)"],
      the_pivot_idea:"Dividing by (a/b) is identical to multiplying by (b/a) — the 'keep, change, flip' rule captures this completely.",
      wrong_intuitions_to_replace:["'Keep, change, flip' is a magic trick with no meaning' — It comes from the definition of division and the multiplicative inverse.","'Dividing by a proper fraction makes the result smaller' — The opposite: dividing by a fraction < 1 makes the result LARGER."]
    },
    derivation:"n ÷ (a/b) = n × (b/a) because (a/b) × (b/a) = 1 — they are multiplicative inverses. So dividing by (a/b) and multiplying by (b/a) produce the same result. Formally: if x = n ÷ (a/b), then x × (a/b) = n, so x = n × (b/a).",
    worked_example:[
      {problem:"How many 2/5-litre bottles fill a 4-litre container?", steps:["4 ÷ (2/5) = 4 × (5/2)","= 20/2"], answer:"10 bottles"},
      {problem:"Divide: (7/8) ÷ (21/16)", steps:["= (7/8) × (16/21)","= 112/168","= 2/3"], answer:"2/3"}
    ],
    visual_description:"A number line from 0 to 3, with arcs of width ¾ stepping along it, labelled 1, 2, 3, 4 — showing that 3 ÷ (3/4) = 4 hops of size 3/4.",
    svg_diagrams:[{
      id:"cbse_math8_ch8_dividing_fractions_hops",
      title:"Division of fractions as counting hops",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- number line -->
  <line x1="30" y1="160" x2="530" y2="160" stroke="currentColor" stroke-width="2"/>
  ${[0,0.75,1.5,2.25,3].map((v,i)=>{const x=30+v*(500/3);return `<line x1="${x}" y1="150" x2="${x}" y2="170" stroke="currentColor" stroke-width="2"/>
  <text x="${x}" y="188" text-anchor="middle" fill="currentColor">${["0","¾","1½","2¼","3"][i]}</text>`;}).join("")}
  <!-- arcs (hops of 3/4) -->
  ${[0,1,2,3].map(i=>{const x1=30+i*0.75*(500/3),x2=30+(i+1)*0.75*(500/3),mx=(x1+x2)/2;return `<path d="M ${x1} 155 Q ${mx} 105 ${x2} 155" fill="none" stroke="#4285f4" stroke-width="2"/>
  <text x="${mx}" y="98" text-anchor="middle" fill="#4285f4" font-weight="bold">${i+1}</text>`;}).join("")}
  <text x="280" y="225" text-anchor="middle" fill="currentColor" font-weight="bold">3 ÷ ¾ = 4 hops</text>
  <!-- rule box -->
  <rect x="30" y="245" width="500" height="60" fill="#e8f0fe" stroke="#4285f4" rx="6"/>
  <text x="280" y="268" text-anchor="middle" fill="#4285f4" font-weight="bold" font-size="15">Keep · Change · Flip</text>
  <text x="280" y="293" text-anchor="middle" fill="currentColor">(a/b) ÷ (c/d)  →  (a/b) × (d/c)  =  ad/bc</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Dividing by ½ gives half the result", correction:"Dividing by ½ DOUBLES the result: 6 ÷ (1/2) = 12. Dividing by a fraction less than 1 increases the quotient."},
      {wrong_idea:"Keep, change, flip applies to both fractions", correction:"Only FLIP the SECOND fraction (divisor). Keep the first fraction unchanged."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Cancel before multiplying", rule:"After flipping, simplify by cancelling common factors diagonally before multiplying.", example:"(7/8)÷(21/16) = (7/8)×(16/21): cancel 7 with 21→3, cancel 8 with 16→2 → 2/3", when_to_use:"Whenever the fractions have common factors — reduces large numerators."}
    ],
    when_to_use_this_method:{
      use_this_when:["Splitting quantities into fractional portions","Speed/time/distance problems with fractional values","Scaling recipes (how many servings from a fraction of a batch)"],
      use_other_when:["Both numbers are whole — use standard division","You need an approximate answer — convert to decimals"]
    },
    edge_cases:[
      {case:"Dividing by 1 (as a fraction: n/n)", value:"Unchanged", reasoning:"Any number ÷ 1 = that number.", where_it_appears:"Identity for division."},
      {case:"Dividing zero by a fraction", value:"0", reasoning:"0 ÷ (a/b) = 0 × (b/a) = 0.", where_it_appears:"Zero in dividend always gives zero quotient."}
    ],
    key_takeaway:"Divide fractions by keeping the first, flipping the second, and multiplying — dividing by a fraction less than 1 increases the result.",
    video_script_hooks:{
      opening_hook:"How many ¾-metre pieces from a 6-metre rope? 6 ÷ (3/4) = 8. Dividing by a fraction gives MORE pieces, not fewer.",
      concept_reveal:"Keep the first fraction. Change ÷ to ×. Flip the second. That's the whole algorithm — and it comes from the definition of a multiplicative inverse.",
      common_mistake_moment:"Dividing by ½ does NOT halve the result — it DOUBLES it. 10 ÷ (1/2) = 20.",
      real_world_connection:"Cutting fabric, portioning food, calculating doses — anywhere you divide a quantity into fractional parts.",
      closing_hook:"Keep. Change. Flip. Three words, one operation, endless applications."
    }
  }
},
{
  topicId:"cbse_math8_ch8_fraction_word_problems", chapterNumber:8, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Fraction Word Problems",
  key_formulas:[
    {formula:"'Of' means × : a fraction of a quantity = fraction × quantity", explanation:"'3/4 of 80' = (3/4)×80 = 60."},
    {formula:"Fraction remaining = 1 − fraction used", explanation:"If 2/5 is spent, then 3/5 remains (because 1 = 5/5)."}
  ],
  prerequisite_knowledge:["fraction operations","ratios as fractions","unitary method"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Fraction word problems translate real situations into fraction arithmetic — the key is identifying which fraction operation each phrase corresponds to.",
      hook:"'Riya spent 2/5 of her savings and gave 1/3 of the rest to charity.' Two fractions, two operations, one problem — and algebra makes it manageable.",
      real_world_anchors:["money: spending fractions of salary","time: fractions of a day or hour","distance: fractions of a journey completed"],
      the_pivot_idea:"Every fraction word problem is a translation exercise — turn each phrase into an operation, then compute step by step.",
      wrong_intuitions_to_replace:["'Of' always means divide' — 'Of' means multiply: ⅔ of 90 = ⅔ × 90 = 60.","'Remaining = total minus fraction' — Remaining = total × (1 − fraction used), not total − fraction."]
    },
    derivation:"Systematic approach: (1) Identify the whole (total). (2) Translate each 'fraction of' as multiplication. (3) 'Remaining after using p/q' means (1 − p/q) of the current amount. (4) Chain operations step by step — don't skip steps.",
    worked_example:[
      {problem:"A tank is 3/4 full. 1/3 of the water is used. What fraction remains?", steps:["Water used = 1/3 of 3/4 = 1/4","Water remaining = 3/4 − 1/4"], answer:"1/2 of the tank"},
      {problem:"Riya has ₹1200. She spends 2/5 on books and 1/4 of the remainder on food. How much is left?", steps:["Books: 2/5 × 1200 = ₹480; remainder = ₹720","Food: 1/4 × 720 = ₹180; left = 720 − 180"], answer:"₹540"}
    ],
    visual_description:"A tape diagram for the tank problem: a full bar representing the tank, 3/4 shaded as 'water', and 1/3 of that shaded section cross-hatched as 'used', leaving 1/2 of the full tank.",
    svg_diagrams:[{
      id:"cbse_math8_ch8_fraction_word_tape",
      title:"Tape diagram for fraction word problem",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- whole bar -->
  <text x="280" y="30" text-anchor="middle" fill="currentColor" font-weight="bold">Tank capacity = whole</text>
  <!-- 3/4 water, 1/4 empty -->
  <rect x="20" y="45" width="390" height="60" fill="#4285f4" stroke="#2050c0" stroke-width="2" opacity="0.7"/>
  <rect x="410" y="45" width="130" height="60" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="215" y="80" text-anchor="middle" fill="white" font-weight="bold">3/4 water</text>
  <text x="475" y="80" text-anchor="middle" fill="#4285f4">1/4 empty</text>
  <!-- 1/3 of water used -->
  <rect x="20" y="115" width="130" height="50" fill="#ea4335" stroke="#c02020" stroke-width="2" opacity="0.8"/>
  <rect x="150" y="115" width="260" height="50" fill="#4285f4" stroke="#2050c0" stroke-width="2" opacity="0.5"/>
  <rect x="410" y="115" width="130" height="50" fill="#e8f0fe" stroke="#4285f4" stroke-width="1.5"/>
  <text x="85" y="145" text-anchor="middle" fill="white" font-size="11" font-weight="bold">1/3 used=1/4</text>
  <text x="280" y="145" text-anchor="middle" fill="white" font-size="11">2/3 of water remains = 1/2</text>
  <!-- result -->
  <text x="280" y="195" text-anchor="middle" fill="currentColor">Remaining water = 3/4 − 1/4 = 1/2 of full tank</text>
  <!-- key translation table -->
  <rect x="20" y="215" width="520" height="90" fill="#f8f9fa" stroke="#dee2e6" rx="6"/>
  <text x="280" y="238" text-anchor="middle" fill="currentColor" font-weight="bold">Key Phrase Translations</text>
  <text x="40" y="260" fill="currentColor">• "a/b of X" → (a/b) × X</text>
  <text x="40" y="280" fill="currentColor">• "remaining after a/b used" → (1−a/b) × X</text>
  <text x="40" y="300" fill="currentColor">• "a/b more than X" → X + (a/b)×X = X(1+a/b)</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"'Remaining' means subtract the fraction from the total", correction:"'Remaining after using 2/5' means (1−2/5) of total = 3/5 of total — not total − 2/5."},
      {wrong_idea:"'1/3 of the rest' is the same as '1/3 of the original'", correction:"'Of the rest' means the fraction applies to the REMAINING amount, which is smaller than the original."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Draw a tape diagram before computing", rule:"Visual representation prevents misidentifying 'of the rest' vs 'of the whole'.", example:"Tank 3/4 full → draw 3/4 shaded. Use 1/3 of shaded → cross-hatch 1/3 of the shaded portion only.", when_to_use:"Any multi-step fraction word problem."}
    ],
    when_to_use_this_method:{
      use_this_when:["Multi-step real-world fraction problems","Problems with remaining quantities after successive fractions are used","Any problem using 'fraction of a fraction'"],
      use_other_when:["The problem involves ratios directly — use ratio methods","You need an exact monetary answer — convert fractions to decimals at the end"]
    },
    edge_cases:[
      {case:"Fraction > 1 used", value:"Goes into negative — check problem statement", reasoning:"You can't use more than 100% of a finite resource.", where_it_appears:"Always check that fraction used ≤ 1 (≤ 100%) for physical problems."},
      {case:"Zero remaining", value:"All used up", reasoning:"If fraction used = 1, nothing remains: (1−1) = 0.", where_it_appears:"Problems where entire amount is consumed."}
    ],
    key_takeaway:"'Of' = multiply; 'remaining after a/b used' = (1−a/b) × current amount; solve step by step, applying each fraction to the current quantity.",
    video_script_hooks:{
      opening_hook:"Riya spent 2/5 of her money, then gave 1/3 of what's left. Two fractions, two steps. Draw a tape diagram and it becomes visual.",
      concept_reveal:"'Of' means times. 'Remaining' means (1 minus the fraction). Know these two translations and every fraction word problem unlocks.",
      common_mistake_moment:"'1/3 of the rest' is NOT the same as '1/3 of the original.' 'The rest' is what's left — a smaller amount.",
      real_world_connection:"Budgeting, cooking, time management, project scheduling — all involve using fractions of what remains.",
      closing_hook:"Read, translate, draw, calculate. Four steps and even the hardest fraction word problem becomes straightforward."
    }
  }
},

// ── Ch9: Pythagoras' Theorem ──────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch9_right_triangles", chapterNumber:9, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Right-Angled Triangles",
  key_formulas:[
    {formula:"Right triangle: one angle = 90°; hypotenuse is the longest side (opposite the right angle)", explanation:"The hypotenuse is always the side NOT touching the right angle."},
    {formula:"Angle sum: other two angles sum to 90° (complementary)", explanation:"In a right triangle: 90° + α + β = 180°, so α + β = 90°."}
  ],
  prerequisite_knowledge:["types of triangles","angle sum of a triangle","types of angles"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A right-angled triangle has one 90° corner — and its longest side (hypotenuse) is opposite that corner.",
      hook:"The corner of a room, a set square, a ramp against a wall — all form right triangles naturally. The right angle is the anchor; everything else is defined relative to it.",
      real_world_anchors:["ramp leaning against wall (right triangle)","TV screen diagonal (hypotenuse)","navigation: east then north makes a right triangle"],
      the_pivot_idea:"The right angle creates a constraint: it forces the two shorter sides to be perpendicular, and the hypotenuse to be longer than either of them.",
      wrong_intuitions_to_replace:["'The hypotenuse is the base' — It's the side OPPOSITE the right angle, not necessarily the bottom.","'Any triangle with a long side is right-angled' — Only a triangle satisfying a²+b²=c² is right-angled."]
    },
    derivation:"In △ABC with ∠C = 90°: by angle sum 90°+∠A+∠B = 180°, so ∠A+∠B = 90°. The side AB (opposite ∠C) is the hypotenuse. By the exterior angle theorem and congruence properties, the perpendicular sides (legs) are always shorter than the hypotenuse.",
    worked_example:[
      {problem:"In right △PQR, ∠R = 90°, ∠P = 35°. Find ∠Q.", steps:["∠P + ∠Q + ∠R = 180°","35° + ∠Q + 90° = 180°","∠Q = 180° − 125°"], answer:"55°"},
      {problem:"Identify the hypotenuse in a right triangle with sides 5, 12, 13.", steps:["Right angle is opposite the longest side","Longest side = 13"], answer:"13 (hypotenuse)"}
    ],
    visual_description:"A right triangle with the right angle marked by a small square at vertex C, the hypotenuse AB labelled and highlighted in red, and the two legs AC and BC labelled with their lengths.",
    svg_diagrams:[{
      id:"cbse_math8_ch9_right_triangle_diagram",
      title:"Parts of a right-angled triangle",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="14">
  <!-- right triangle -->
  <polygon points="80,270 80,60 380,270" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <!-- right angle marker -->
  <rect x="80" y="250" width="22" height="22" fill="none" stroke="#ea4335" stroke-width="2"/>
  <!-- labels -->
  <text x="50" y="278" fill="currentColor" font-weight="bold">C</text>
  <text x="60" y="52" fill="currentColor" font-weight="bold">A</text>
  <text x="386" y="278" fill="currentColor" font-weight="bold">B</text>
  <!-- hypotenuse label -->
  <text x="250" y="145" fill="#ea4335" font-weight="bold" font-size="15" transform="rotate(-37,250,145)">Hypotenuse (AB)</text>
  <!-- leg labels -->
  <text x="40" y="170" fill="#4285f4" transform="rotate(-90,40,170)">Leg (AC)</text>
  <text x="230" y="300" fill="#34a853">Leg (BC)</text>
  <!-- angle labels -->
  <text x="92" y="255" fill="#ea4335" font-size="11">90°</text>
  <text x="88" y="90" fill="#4285f4" font-size="12">∠A</text>
  <text x="340" y="262" fill="#34a853" font-size="12">∠B</text>
  <!-- rule -->
  <rect x="400" y="80" width="145" height="80" fill="#fff8e1" stroke="#fbbc04" rx="6"/>
  <text x="473" y="108" text-anchor="middle" fill="currentColor">∠A + ∠B = 90°</text>
  <text x="473" y="132" text-anchor="middle" fill="currentColor">(complementary)</text>
  <text x="473" y="152" text-anchor="middle" fill="#fbbc04" font-size="12">Hypotenuse</text>
  <text x="473" y="168" text-anchor="middle" fill="#fbbc04" font-size="12">= longest side</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"The hypotenuse is always at the bottom", correction:"The hypotenuse is the side OPPOSITE the right angle, regardless of orientation."},
      {wrong_idea:"A triangle with a large angle is right-angled", correction:"Only a triangle with EXACTLY a 90° angle is right-angled. Large but not 90° → obtuse triangle."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Spot the hypotenuse by finding the right angle", rule:"Mark the right angle (90°). The side directly opposite it — touching neither vertex of the right angle — is the hypotenuse.", example:"Right angle at C: side AB (not touching C) is the hypotenuse.", when_to_use:"Every right triangle identification problem."}
    ],
    when_to_use_this_method:{
      use_this_when:["Identifying whether a triangle is right-angled","Setting up Pythagoras' theorem","Trigonometry problems (sine, cosine, tangent)"],
      use_other_when:["The triangle has no right angle — use general triangle laws","All three angles are known — use sine rule or cosine rule"]
    },
    edge_cases:[
      {case:"Isosceles right triangle", value:"Two 45° angles", reasoning:"Both non-right angles equal 90°/2 = 45°.", where_it_appears:"Square diagonal creates two isosceles right triangles."},
      {case:"30-60-90 triangle", value:"Sides in ratio 1 : √3 : 2", reasoning:"Standard triangle from equilateral triangle bisection.", where_it_appears:"Common in geometry and trigonometry."}
    ],
    key_takeaway:"A right triangle has one 90° angle; the hypotenuse is the longest side, opposite the right angle; the other two angles are complementary (sum to 90°).",
    video_script_hooks:{
      opening_hook:"The corner of every room, every set square, every ramp — all right triangles. The right angle is nature's most reliable corner.",
      concept_reveal:"One angle equals 90°, so the other two must share the remaining 90° — they're always complementary.",
      common_mistake_moment:"The hypotenuse is NOT always at the bottom. It's always opposite the right angle — wherever that angle sits.",
      real_world_connection:"Carpenters use the 3-4-5 right triangle to check corners. Surveyors use right triangles to measure distances. Pilots use them for navigation.",
      closing_hook:"The right angle is the foundation of Pythagoras, trigonometry, and coordinate geometry. Master it here and everything built on it follows."
    }
  }
},
{
  topicId:"cbse_math8_ch9_pythagoras_theorem", chapterNumber:9, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Pythagoras' Theorem",
  key_formulas:[
    {formula:"a² + b² = c²", explanation:"In a right triangle, the sum of squares of the two legs equals the square of the hypotenuse."},
    {formula:"Pythagorean triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25)", explanation:"Sets of three integers satisfying a²+b²=c² — always form right triangles."}
  ],
  prerequisite_knowledge:["right-angled triangles","squares and square roots","area of squares"],
  teaching_content:{
    intuition:{
      elevator_pitch:"The Pythagoras theorem says the square on the hypotenuse equals the combined area of squares on the two legs.",
      hook:"Draw squares on each side of a right triangle with legs 3 and 4. The squares have areas 9 and 16. The square on the hypotenuse has area 25 = 9+16. And 5² = 25. The areas balance.",
      real_world_anchors:["checking if a corner is truly 90° (3-4-5 rule)","finding cable length between two points","screen diagonal from width and height"],
      the_pivot_idea:"The theorem is about AREAS — the square on the hypotenuse fills exactly the same space as the two leg-squares combined.",
      wrong_intuitions_to_replace:["'a+b = c (sides, not squares)' — Never: it's a²+b²=c², not a+b=c.","'The theorem works for all triangles' — Only right-angled triangles."]
    },
    derivation:"Area proof: arrange four copies of the right triangle (legs a and b, hypotenuse c) inside a large square of side (a+b). The four triangles leave a square hole of side c. Area equation: (a+b)² = 4×(ab/2) + c², which simplifies to a²+2ab+b² = 2ab+c², giving a²+b²=c².",
    worked_example:[
      {problem:"Legs of a right triangle are 9 cm and 12 cm. Find the hypotenuse.", steps:["c² = 9² + 12² = 81 + 144 = 225","c = √225"], answer:"15 cm"},
      {problem:"Hypotenuse = 26 cm, one leg = 10 cm. Find the other leg.", steps:["b² = 26² − 10² = 676 − 100 = 576","b = √576"], answer:"24 cm"}
    ],
    visual_description:"A right triangle with sides 3, 4, 5 and three squares drawn on its sides — a 3×3 (area 9), a 4×4 (area 16), and a 5×5 (area 25) — with '9 + 16 = 25' shown below.",
    svg_diagrams:[{
      id:"cbse_math8_ch9_pythagoras_squares",
      title:"Pythagoras theorem as squares on sides",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- the right triangle (3-4-5 scaled) -->
  <polygon points="180,240 180,120 300,240" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <!-- right angle -->
  <rect x="180" y="222" width="18" height="18" fill="none" stroke="#ea4335" stroke-width="1.5"/>
  <!-- square on leg a (vertical, 3 units) -->
  <rect x="120" y="120" width="60" height="120" fill="#fce8e6" stroke="#ea4335" stroke-width="1.5" opacity="0.6"/>
  <text x="150" y="183" text-anchor="middle" fill="#ea4335">a²=9</text>
  <!-- square on leg b (horizontal, 4 units) -->
  <rect x="180" y="240" width="120" height="60" fill="#e6f4ea" stroke="#34a853" stroke-width="1.5" opacity="0.6"/>
  <text x="240" y="275" text-anchor="middle" fill="#34a853">b²=16</text>
  <!-- square on hypotenuse (5 units) - rotated -->
  <text x="330" y="130" fill="#fbbc04" font-weight="bold">c²=25</text>
  <text x="330" y="155" fill="#fbbc04" font-size="12">(5×5)</text>
  <!-- equation -->
  <rect x="350" y="200" width="190" height="60" fill="#fff8e1" stroke="#fbbc04" rx="6"/>
  <text x="445" y="225" text-anchor="middle" fill="currentColor" font-weight="bold" font-size="15">a² + b² = c²</text>
  <text x="445" y="250" text-anchor="middle" fill="#fbbc04" font-weight="bold">9 + 16 = 25 ✓</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"a + b = c (add the sides, not the squares)", correction:"3+4=7≠5. It's the SQUARES that add: 9+16=25=5². Always square the sides."},
      {wrong_idea:"The theorem works for any triangle", correction:"Only right triangles. For non-right triangles: use the cosine rule c²=a²+b²−2ab·cosC."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Pythagorean triple recognition", rule:"Memorise (3,4,5), (5,12,13), (8,15,17), (7,24,25) and their multiples.", example:"Legs 15 and 20: recognise 3×(5,4,?) → 5×(3,4,5) → hypotenuse = 25", when_to_use:"When both legs are given and look like multiples of a known triple."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding any side of a right triangle given the other two","Checking if three lengths form a right triangle","Distance and navigation problems"],
      use_other_when:["Triangle has NO right angle — use cosine rule","All three angles are known but no sides — need at least one side"]
    },
    edge_cases:[
      {case:"a = b (isosceles right triangle)", value:"c = a√2", reasoning:"c² = a²+a² = 2a², so c = a√2.", where_it_appears:"Square diagonal: diagonal = side × √2."},
      {case:"Converse: does a²+b²=c² imply right angle?", value:"Yes", reasoning:"If three sides satisfy a²+b²=c², the angle opposite c is exactly 90°.", where_it_appears:"Checking if a given triangle is right-angled."}
    ],
    key_takeaway:"In a right triangle: a²+b²=c² where c is the hypotenuse; memorise common Pythagorean triples (3,4,5), (5,12,13); the converse also holds.",
    video_script_hooks:{
      opening_hook:"3, 4, 5. Three numbers known to every builder, carpenter, and engineer for 2500 years. They form a perfect right triangle — and Pythagoras explains why.",
      concept_reveal:"It's not sides that add — it's AREAS. The square on the long side equals the combined areas of the squares on the two short sides.",
      common_mistake_moment:"3+4=7, not 5. The sides DON'T add. The SQUARES add: 9+16=25=5². Never forget the squares.",
      real_world_connection:"GPS uses the theorem to compute distances. Architects use the 3-4-5 rule to set right angles. Screen diagonals are computed with Pythagoras.",
      closing_hook:"One equation, a²+b²=c², has been used for 2,500 years and will be used for 2,500 more. This is the most famous theorem in mathematics."
    }
  }
},
{
  topicId:"cbse_math8_ch9_applying_pythagoras", chapterNumber:9, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Applying Pythagoras' Theorem",
  key_formulas:[
    {formula:"Height of a leaning ladder: h = √(L² − d²)", explanation:"Ladder length L leaning against wall, base distance d from wall, height h up the wall."},
    {formula:"Diagonal of rectangle: d = √(l² + w²)", explanation:"Rectangle with length l and width w; diagonal is the hypotenuse."}
  ],
  prerequisite_knowledge:["Pythagoras theorem","squares and square roots","right-angled triangles"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Pythagoras turns any real-world 'missing length' problem into a² + b² = c² — set up the right triangle, substitute, solve.",
      hook:"A 10-metre ladder leans against a wall with its base 6 metres from the wall. How high up the wall does it reach? √(100−36) = √64 = 8 metres. One equation, one answer.",
      real_world_anchors:["ladder height on a wall","flagpole shadow and height","shortest path across a rectangular field"],
      the_pivot_idea:"The theorem is a tool — the skill is setting up the right triangle that models the problem, then computing the unknown side.",
      wrong_intuitions_to_replace:["'You always find the hypotenuse with Pythagoras' — Sometimes you find a leg: b = √(c²−a²).","'The triangle must be drawn on flat ground' — Right triangles appear in 3-D problems too (space diagonals)."]
    },
    derivation:"For any geometry problem: (1) Identify the right angle. (2) Label the three sides: two known and one unknown. (3) If unknown is hypotenuse: c = √(a²+b²). If unknown is a leg: a = √(c²−b²). (4) Check reasonableness — answer must be positive and less than hypotenuse.",
    worked_example:[
      {problem:"A tree 15 m tall breaks at 9 m and the top touches the ground 12 m away. Was the break at the right place?", steps:["Broken part (hypotenuse): √(12²+9²) = √(144+81) = √225 = 15","Broken part = 15 m? But tree is only 15 m total and break is at 9 m → broken part = 15−9 = 6 m... wait recalculate","Actually: broken length = √(12²+9²) = 15 ≠ 6. Problem means the 9 m stump + broken part = 15 m → broken = 6 m; ground: 12 m → 6²+? No. Check: 6²+12²=36+144=180≠... Recalculate whole: stump 9m, top touches 12m away → broken part = √(9²+12²) = √225 = 15 m... but tree is 15m, stump is 9m, broken = 6m. Contradiction. → The 12m distance and 9m break DON'T produce a 15m tree (need 9+15=24). This is a standard problem where break height is unknown.","Let break height = h. Broken length = 15−h. h²+12² = (15−h)². h²+144 = 225−30h+h². 30h = 81, h = 2.7 m"], answer:"Break height = 2.7 m"},
      {problem:"A 13 m ladder leans against a wall, base 5 m from wall. How high does it reach?", steps:["h² + 5² = 13²","h² = 169 − 25 = 144","h = 12"], answer:"12 m"}
    ],
    visual_description:"A wall and ladder diagram: a vertical wall on the left, the ground as a horizontal base, a ladder of length 13 m as the hypotenuse, base distance 5 m and unknown height h labelled.",
    svg_diagrams:[{
      id:"cbse_math8_ch9_applying_pythagoras",
      title:"Ladder and wall — classic application",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <!-- wall -->
  <rect x="60" y="30" width="15" height="250" fill="#9e9e9e" stroke="#757575" stroke-width="2"/>
  <!-- ground -->
  <line x1="30" y1="280" x2="400" y2="280" stroke="currentColor" stroke-width="3"/>
  <!-- ladder (hypotenuse) -->
  <line x1="75" y1="140" x2="300" y2="280" stroke="#ea4335" stroke-width="3"/>
  <!-- right angle at base of wall -->
  <rect x="75" y="262" width="18" height="18" fill="none" stroke="#4285f4" stroke-width="2"/>
  <!-- labels -->
  <text x="30" y="215" fill="#4285f4" font-weight="bold">h = ?</text>
  <text x="185" y="275" fill="currentColor">5 m</text>
  <text x="200" y="195" fill="#ea4335" font-weight="bold" transform="rotate(-33,200,195)">13 m (ladder)</text>
  <!-- Pythagoras equation -->
  <rect x="360" y="100" width="180" height="100" fill="#e6f4ea" stroke="#34a853" rx="6"/>
  <text x="450" y="128" text-anchor="middle" fill="#34a853" font-weight="bold">Pythagoras:</text>
  <text x="450" y="152" text-anchor="middle" fill="currentColor">h² + 5² = 13²</text>
  <text x="450" y="175" text-anchor="middle" fill="currentColor">h² = 144</text>
  <text x="450" y="195" text-anchor="middle" fill="#34a853" font-weight="bold">h = 12 m</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Always add the two known sides squared", correction:"Only add when finding the hypotenuse. If the unknown is a leg: subtract. b = √(c²−a²)."},
      {wrong_idea:"The 'right triangle' must be obvious in the diagram", correction:"Often you must CONSTRUCT the right triangle — e.g. draw a vertical height from a point to the ground."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Pythagorean triple recognition saves computation", rule:"Recognise sides as multiples of 3-4-5 or 5-12-13.", example:"Legs 15 and 20: divide by 5 → 3,4 → hypotenuse = 5×5 = 25", when_to_use:"When given legs are multiples of a known triple."}
    ],
    when_to_use_this_method:{
      use_this_when:["Any problem with a right angle and two known lengths","Diagonal of a rectangle or square","Height problems involving ladders, ramps, shadows"],
      use_other_when:["No right angle — use cosine rule","Problem involves angles, not just lengths — use trigonometry"]
    },
    edge_cases:[
      {case:"The unknown is the hypotenuse", value:"c = √(a²+b²) — always larger than both legs", reasoning:"Sum of squares increases the value beyond either individual square.", where_it_appears:"Ladder problems, screen diagonals."},
      {case:"The unknown is a leg", value:"a = √(c²−b²) — must be positive", reasoning:"Subtract; verify c > b before computing (otherwise no real solution).", where_it_appears:"Height of a wall given ladder length and base distance."}
    ],
    key_takeaway:"Set up the right triangle, label all three sides, use a²+b²=c² (adding for hypotenuse, subtracting for a leg), and verify the answer is positive and geometrically reasonable.",
    video_script_hooks:{
      opening_hook:"A 10-metre ladder, base 6 m from wall. How high? One equation: h²+36=100, h=8. Pythagoras solves it before you finish reading the question.",
      concept_reveal:"The skill isn't the formula — it's setting up the right triangle. Find the right angle, label the sides, plug in.",
      common_mistake_moment:"Finding a leg? You SUBTRACT: a = √(c²−b²). Don't add all three — that's only for finding the hypotenuse.",
      real_world_connection:"Every ramp, staircase, cable, and slope in architecture is computed with Pythagoras. It's the most-used theorem in engineering.",
      closing_hook:"Every right triangle problem, no matter how disguised, comes down to a²+b²=c². Master the setup and the rest is arithmetic."
    }
  }
},
{
  topicId:"cbse_math8_ch9_distance_on_grid", chapterNumber:9, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Distance on a Grid",
  key_formulas:[
    {formula:"Distance = √((x₂−x₁)² + (y₂−y₁)²)", explanation:"Distance between two points on a coordinate grid — derived directly from Pythagoras."},
    {formula:"Horizontal distance = |x₂−x₁|, Vertical distance = |y₂−y₁|", explanation:"The two legs of the right triangle formed by any two points on a grid."}
  ],
  prerequisite_knowledge:["coordinate grid (x-y plane)","Pythagoras theorem","absolute value"],
  teaching_content:{
    intuition:{
      elevator_pitch:"On a coordinate grid, the distance between two points is the hypotenuse of the right triangle formed by drawing horizontal and vertical lines through them.",
      hook:"A ship at (0,0) sails to (3,4). The horizontal distance is 3 units, the vertical distance is 4 units — and the actual distance sailed is √(9+16) = 5 units. Pythagoras navigates the ship.",
      real_world_anchors:["GPS distance calculation","chess piece moves (knight's distance)","city block distance vs straight-line distance"],
      the_pivot_idea:"Drawing horizontal and vertical lines through two points always creates a right triangle — the distance is just the hypotenuse.",
      wrong_intuitions_to_replace:["'Distance = (x₂−x₁) + (y₂−y₁)' — That's the taxicab (Manhattan) distance, not straight-line distance.","'Order of subtraction matters in the formula' — (x₂−x₁)² = (x₁−x₂)², so order doesn't matter."]
    },
    derivation:"Points A(x₁,y₁) and B(x₂,y₂). Draw horizontal line through A and vertical through B — they meet at C(x₂,y₁). AC = |x₂−x₁| (horizontal), BC = |y₂−y₁| (vertical), ∠ACB = 90°. By Pythagoras: AB² = AC²+BC² = (x₂−x₁)²+(y₂−y₁)². So AB = √((x₂−x₁)²+(y₂−y₁)²).",
    worked_example:[
      {problem:"Find the distance between (2,3) and (6,6).", steps:["Δx = 6−2 = 4, Δy = 6−3 = 3","Distance = √(4²+3²) = √(16+9) = √25"], answer:"5 units"},
      {problem:"Is triangle with vertices A(1,1), B(4,1), C(1,5) right-angled?", steps:["AB = 3 (horizontal), AC = 4 (vertical)","BC = √(9+16) = 5","Check: AB²+AC² = 9+16 = 25 = BC² ✓"], answer:"Yes, right-angled at A"}
    ],
    visual_description:"A coordinate grid with two points A(2,3) and B(6,6) plotted, dashed lines forming the right triangle at C(6,3), with horizontal leg labelled '4', vertical leg '3', and hypotenuse AB labelled '5'.",
    svg_diagrams:[{
      id:"cbse_math8_ch9_distance_grid",
      title:"Distance between two grid points using Pythagoras",
      svg:`<svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <!-- grid -->
  ${Array.from({length:8},(_,i)=>`<line x1="40" y1="${40+i*35}" x2="390" y2="${40+i*35}" stroke="#e0e0e0" stroke-width="1"/>
  <line x1="${40+i*50}" y1="40" x2="${40+i*50}" y2="290" stroke="#e0e0e0" stroke-width="1"/>
  <text x="${40+i*50}" y="310" text-anchor="middle" fill="#888" font-size="11">${i}</text>
  <text x="25" y="${45+i*35}" text-anchor="middle" fill="#888" font-size="11">${7-i}</text>`).join("")}
  <!-- axes -->
  <line x1="40" y1="290" x2="390" y2="290" stroke="currentColor" stroke-width="2"/>
  <line x1="40" y1="290" x2="40" y2="40" stroke="currentColor" stroke-width="2"/>
  <!-- points A(2,3) = grid (40+100, 290-105) = (140,185) and B(6,6)=(340,80) -->
  <circle cx="140" cy="185" r="5" fill="#4285f4"/>
  <text x="128" y="178" fill="#4285f4" font-weight="bold">A(2,3)</text>
  <circle cx="340" cy="80" r="5" fill="#34a853"/>
  <text x="345" y="76" fill="#34a853" font-weight="bold">B(6,6)</text>
  <!-- right angle point C(6,3) = (340,185) -->
  <circle cx="340" cy="185" r="4" fill="#888"/>
  <text x="345" y="200" fill="#888">C(6,3)</text>
  <!-- legs -->
  <line x1="140" y1="185" x2="340" y2="185" stroke="#ea4335" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="240" y="202" text-anchor="middle" fill="#ea4335" font-weight="bold">Δx = 4</text>
  <line x1="340" y1="185" x2="340" y2="80" stroke="#fbbc04" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="358" y="135" fill="#fbbc04" font-weight="bold">Δy = 3</text>
  <!-- hypotenuse -->
  <line x1="140" y1="185" x2="340" y2="80" stroke="#4285f4" stroke-width="2.5"/>
  <text x="220" y="115" fill="#4285f4" font-weight="bold" transform="rotate(-27,220,115)">d = 5</text>
  <!-- right angle marker -->
  <rect x="322" y="167" width="16" height="16" fill="none" stroke="#888" stroke-width="1.5"/>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Distance = (x₂−x₁) + (y₂−y₁) (add the changes)", correction:"That's the Manhattan (taxicab) distance. Straight-line distance uses the Pythagorean formula with squares and a square root."},
      {wrong_idea:"Subtracting in the 'wrong' order changes the distance", correction:"(x₂−x₁)² = (x₁−x₂)² — squaring removes the sign. Order doesn't matter."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Recognise 3-4-5 and 5-12-13 on grids", rule:"If Δx and Δy are legs of a known Pythagorean triple, state the distance immediately.", example:"A(1,2) to B(4,6): Δx=3, Δy=4 → distance = 5", when_to_use:"Grid problems where differences form a Pythagorean triple."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding straight-line distance between two coordinate points","Checking if three points form a specific triangle type","GPS and map distance calculations"],
      use_other_when:["You need the Manhattan/taxicab distance (road network) — just add |Δx|+|Δy|","Points are in 3-D — extend to √(Δx²+Δy²+Δz²)"]
    },
    edge_cases:[
      {case:"Same point: A = B", value:"Distance = 0", reasoning:"Both differences are 0; √0 = 0.", where_it_appears:"Start and end at the same location."},
      {case:"Same x-coordinate", value:"Distance = |y₂−y₁|", reasoning:"Δx = 0 so distance = √(0+Δy²) = |Δy| — purely vertical.", where_it_appears:"Points on the same vertical line."}
    ],
    key_takeaway:"Distance between (x₁,y₁) and (x₂,y₂) = √((x₂−x₁)²+(y₂−y₁)²) — the hypotenuse of the right triangle with legs |Δx| and |Δy|.",
    video_script_hooks:{
      opening_hook:"A ship sails 3 km east then 4 km north. How far from the start? Draw the right triangle: 3²+4²=25, distance = 5 km. Pythagoras navigates.",
      concept_reveal:"Any two points on a grid form a right triangle with the horizontal and vertical lines. Distance = hypotenuse of that triangle.",
      common_mistake_moment:"Distance ≠ Δx + Δy. That's the road distance. Straight-line distance needs squares and a square root.",
      real_world_connection:"Google Maps calculates straight-line distance with this formula. Every GPS chip runs Pythagoras billions of times per second.",
      closing_hook:"Coordinate geometry turns geography into algebra. Two points, one formula, one distance — always."
    }
  }
},

// ── Ch10: Direct and Inverse Proportions ─────────────────────────────────────
{
  topicId:"cbse_math8_ch10_solving_proportions", chapterNumber:10, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Solving Proportions",
  key_formulas:[
    {formula:"a/b = c/d ⟺ ad = bc", explanation:"Cross-multiplication: the product of means equals the product of extremes."},
    {formula:"If a:b = c:d then (a+b)/b = (c+d)/d", explanation:"Componendo property — useful in advanced ratio problems."}
  ],
  prerequisite_knowledge:["fractions and equivalent fractions","ratios","multiplication and division"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A proportion says two ratios are equal — solving it finds the unknown that keeps the balance.",
      hook:"If 3 pens cost ₹12, how much do 7 pens cost? Set up 3/12 = 7/x and cross-multiply.",
      real_world_anchors:["recipe scaling","currency conversion","fuel efficiency calculations"],
      the_pivot_idea:"Cross-multiplication is the single move that turns a proportion into a simple linear equation.",
      wrong_intuitions_to_replace:["'Just add the difference' — ratios aren't additive; you must multiply proportionally.","'a/b = c/d means a = c and b = d' — wrong; only the cross-products must be equal."]
    },
    derivation:"a/b = c/d. Multiply both sides by bd: ad = bc. This is the cross-multiplication rule, derived from the property that multiplying equals equals equals.",
    worked_example:[
      {problem:"Solve: 5/8 = x/40.", steps:["Cross-multiply: 5×40 = 8×x","200 = 8x","x = 200/8 = 25"], answer:"x = 25"},
      {problem:"If 6 workers build a wall in 10 days, how many days for 15 workers (inverse)?", steps:["Workers × Days = constant (inverse proportion)","6 × 10 = 15 × d","60 = 15d → d = 4"], answer:"4 days"}
    ],
    visual_description:"A balance scale with ratio 3:12 on the left and 7:x on the right. Arrow shows cross-multiplication equalising both sides.",
    svg_diagrams:[{
      id:"cbse_math8_ch10_proportion_balance",
      title:"Proportion as a balance scale",
      svg:`<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <line x1="280" y1="50" x2="280" y2="130" stroke="#333" stroke-width="3"/>
  <line x1="120" y1="130" x2="440" y2="130" stroke="#333" stroke-width="3"/>
  <rect x="80" y="140" width="100" height="50" rx="6" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="130" y="168" text-anchor="middle" fill="#4285f4" font-size="15" font-weight="bold">3 / 12</text>
  <rect x="380" y="140" width="100" height="50" rx="6" fill="#fce8e6" stroke="#ea4335" stroke-width="2"/>
  <text x="430" y="168" text-anchor="middle" fill="#ea4335" font-size="15" font-weight="bold">7 / x</text>
  <text x="280" y="220" text-anchor="middle" fill="#333" font-size="14">Cross-multiply: 3 × x = 12 × 7 → x = 28</text>
  <circle cx="280" cy="44" r="8" fill="#fbbc04"/>
  <text x="280" y="30" text-anchor="middle" fill="#333" font-weight="bold">Proportion Balance</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"5/8 = x/40 → x = 40−8+5 = 37", correction:"Never add/subtract parts of a ratio. Cross-multiply: 5×40 = 8x → x = 25."},
      {wrong_idea:"Direct and inverse proportion always give the same answer", correction:"Direct: more → more; Inverse: more → less. Identify the type first."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Unit rate method", rule:"Find value for 1 unit first, then scale", example:"3 pens → ₹12; 1 pen → ₹4; 7 pens → ₹28", when_to_use:"Direct proportion word problems."}
    ],
    when_to_use_this_method:{
      use_this_when:["Any 'if A then B; what for C?' direct proportion problem","Recipe or map scale conversions"],
      use_other_when:["Inverse proportion: use product = constant method instead"]
    },
    edge_cases:[
      {case:"Both unknowns in the proportion", value:"Need a second equation", reasoning:"a/b = c/d with two unknowns is underdetermined.", where_it_appears:"Some advanced word problems."},
      {case:"Zero in denominator", value:"Undefined", reasoning:"Division by zero is undefined; check all denominators.", where_it_appears:"Trivial edge case."}
    ],
    key_takeaway:"To solve a proportion a/b = c/d, cross-multiply to get ad = bc, then isolate the unknown. Identify direct vs inverse before setting up.",
    video_script_hooks:{
      opening_hook:"Three pens, ₹12. Seven pens, how much? Two ratios, one unknown — that's a proportion.",
      concept_reveal:"Cross-multiplication is just multiplying both sides by the two denominators at once. It's not magic — it's algebra.",
      common_mistake_moment:"Don't add across a proportion. Ratios aren't sums. Cross-multiply.",
      real_world_connection:"Pharmacists scale drug doses using proportions. Currency exchange is a direct proportion. Speed and time is inverse.",
      closing_hook:"One rule: equal ratios, cross-multiply. Two minutes to master, used forever."
    }
  }
},
{
  topicId:"cbse_math8_ch10_scale_drawings", chapterNumber:10, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Scale Drawings and Maps",
  key_formulas:[
    {formula:"Scale = Map distance / Actual distance", explanation:"The ratio of the drawing length to the real length."},
    {formula:"Actual distance = Map distance ÷ Scale factor", explanation:"Divide the measurement on the drawing by the scale to get real size."}
  ],
  prerequisite_knowledge:["ratios and proportions","unit conversion","multiplication and division"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A scale drawing shrinks or enlarges a real object by a fixed ratio so it fits on paper while preserving all proportions.",
      hook:"A map at scale 1:50,000 means 1 cm on paper = 50,000 cm (500 m) in reality.",
      real_world_anchors:["road maps","architectural blueprints","model trains and planes"],
      the_pivot_idea:"Every dimension on the drawing is multiplied by the same scale factor — that's what makes it a proportional representation.",
      wrong_intuitions_to_replace:["'Scale 1:50 means 50 cm on paper = 1 cm real' — reversed! Map distance is the numerator.","'You can change scale and keep area the same' — No; area scales as scale²."]
    },
    derivation:"If scale = 1:k then 1 unit on map = k units real. Actual = map × k. Area on map × k² = actual area (because both length and width scale by k).",
    worked_example:[
      {problem:"Map scale 1:25,000. Two towns are 4 cm apart on the map. Find the actual distance.", steps:["Actual = map × scale factor","= 4 cm × 25,000 = 100,000 cm","= 1,000 m = 1 km"], answer:"1 km"},
      {problem:"A room is 6 m × 4 m. Draw at scale 1:100.", steps:["6 m = 600 cm → 600÷100 = 6 cm","4 m = 400 cm → 400÷100 = 4 cm"], answer:"Draw 6 cm × 4 cm rectangle"}
    ],
    visual_description:"A small map rectangle labelled '4 cm' beside a large real-world rectangle labelled '1 km', connected by an arrow labelled '×25,000'.",
    svg_diagrams:[{
      id:"cbse_math8_ch10_scale_map",
      title:"Map distance vs actual distance",
      svg:`<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <rect x="30" y="60" width="80" height="60" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="70" y="95" text-anchor="middle" fill="#4285f4" font-weight="bold">4 cm</text>
  <text x="70" y="140" text-anchor="middle" fill="#333">Map</text>
  <line x1="120" y1="90" x2="220" y2="90" stroke="#fbbc04" stroke-width="2" marker-end="url(#arr)"/>
  <text x="170" y="80" text-anchor="middle" fill="#fbbc04" font-weight="bold">× 25 000</text>
  <rect x="230" y="40" width="290" height="100" fill="#e6f4ea" stroke="#34a853" stroke-width="2"/>
  <text x="375" y="95" text-anchor="middle" fill="#34a853" font-weight="bold">1 km (actual)</text>
  <text x="375" y="160" text-anchor="middle" fill="#333">Real distance</text>
  <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#fbbc04"/></marker></defs>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Scale 1:100 means 100 cm on paper = 1 cm real", correction:"Map is always numerator: 1 cm on paper = 100 cm real."},
      {wrong_idea:"If scale doubles, area doubles", correction:"If scale doubles, area quadruples (k² effect)."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Convert both to same units first", rule:"Always convert map measurement and actual distance to the same unit before computing scale", example:"4 cm map : 100 m actual → 4 cm : 10,000 cm = 1:2500", when_to_use:"Any scale problem to avoid unit errors."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding real distance from map measurement","Drawing a scale plan of a room or building"],
      use_other_when:["Objects where only area needs to be scaled (use k² for area)"]
    },
    edge_cases:[
      {case:"Scale greater than 1 (enlargement)", value:"Model/magnified drawing", reasoning:"Microscope slides at scale 100:1 enlarge a tiny object.", where_it_appears:"Microscopy, macro photography blueprints."},
      {case:"Non-metric scale", value:"Convert units first", reasoning:"If scale is 1 inch = 1 mile, convert everything to the same unit.", where_it_appears:"Older British/US maps."}
    ],
    key_takeaway:"Scale = map ÷ actual. To find actual: multiply map measurement by the scale denominator. Always work in the same units.",
    video_script_hooks:{
      opening_hook:"India is 3,000 km wide. Your notebook is 20 cm wide. What scale shrinks India onto paper?",
      concept_reveal:"Every scaled drawing is a direct proportion: map/actual = constant scale ratio.",
      common_mistake_moment:"The scale 1:25,000 means 1 cm → 25,000 cm real — not 25,000 cm → 1 cm. Map is first.",
      real_world_connection:"Architects draw every building at scale before a single brick is laid. Google Maps is a digital scale drawing.",
      closing_hook:"Scale drawings make the huge measurable and the tiny visible. One ratio, infinite applications."
    }
  }
},
{
  topicId:"cbse_math8_ch10_similar_figures", chapterNumber:10, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Similar Figures",
  key_formulas:[
    {formula:"Corresponding sides of similar figures are proportional", explanation:"If ΔABC ~ ΔPQR then AB/PQ = BC/QR = CA/RP."},
    {formula:"Ratio of areas = (ratio of sides)²", explanation:"If scale factor = k, area ratio = k²."}
  ],
  prerequisite_knowledge:["ratios and proportions","angles","basic geometry of triangles and rectangles"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Two figures are similar if one is a scaled version of the other — same shape, different size, all angles equal.",
      hook:"A photo and its enlargement are similar rectangles: same proportions, different area.",
      real_world_anchors:["photo enlargements","shadow puppets","architectural scale models"],
      the_pivot_idea:"Similarity preserves angles and proportional sides — zoom in or out, the shape never distorts.",
      wrong_intuitions_to_replace:["'Similar = equal in size' — No; that's congruent. Similar only requires same shape.","'If sides are proportional, angles may differ' — Wrong; proportional sides force equal angles (and vice versa)."]
    },
    derivation:"Two triangles are similar (AA criterion) if two pairs of angles are equal. Consequence: all three pairs of angles equal AND corresponding sides proportional.",
    worked_example:[
      {problem:"ΔABC ~ ΔPQR. AB = 6, BC = 8, PQ = 9. Find QR.", steps:["AB/PQ = BC/QR","6/9 = 8/QR","QR = 8×9/6 = 12"], answer:"QR = 12"},
      {problem:"Similar rectangles with sides 3 and 6. Find area ratio.", steps:["Scale factor k = 6/3 = 2","Area ratio = k² = 4"], answer:"1:4"}
    ],
    visual_description:"Two triangles side by side, one small (sides 3,4,5) and one large (sides 6,8,10), with matching angle arcs and arrows labelling corresponding sides.",
    svg_diagrams:[{
      id:"cbse_math8_ch10_similar_triangles",
      title:"Similar triangles with proportional sides",
      svg:`<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <polygon points="40,200 160,200 100,100" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="100" y="215" text-anchor="middle" fill="#333">4</text>
  <text x="62" y="155" fill="#333">3</text>
  <text x="140" y="155" fill="#333">5</text>
  <text x="100" y="90" text-anchor="middle" fill="#4285f4" font-weight="bold">Small △</text>
  <polygon points="270,200 510,200 390,80" fill="#e6f4ea" stroke="#34a853" stroke-width="2"/>
  <text x="390" y="215" text-anchor="middle" fill="#333">8</text>
  <text x="312" y="145" fill="#333">6</text>
  <text x="458" y="145" fill="#333">10</text>
  <text x="390" y="70" text-anchor="middle" fill="#34a853" font-weight="bold">Large △ (k=2)</text>
  <text x="280" y="250" text-anchor="middle" fill="#333" font-size="12">Ratio of sides = 1:2; Ratio of areas = 1:4</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Similar figures are congruent", correction:"Congruent = same shape AND same size. Similar = same shape, possibly different size."},
      {wrong_idea:"Area scales by the same factor as sides", correction:"Area scales by k², not k. Double the side → quadruple the area."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"AA similarity for triangles", rule:"If two angles match, the third automatically matches — triangles must be similar", example:"Two triangles each with 60° and 80° are similar", when_to_use:"Triangle similarity proofs."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding an unknown side in similar triangles","Calculating area or perimeter ratio for similar shapes"],
      use_other_when:["Congruence (equal size): use SSS/SAS/ASA criteria"]
    },
    edge_cases:[
      {case:"All circles are similar", value:"Scale factor = ratio of radii", reasoning:"Circles have no angles to check; any circle scales to any other.", where_it_appears:"Geometry proofs."},
      {case:"Similar ≠ same orientation", value:"Figures may be flipped or rotated", reasoning:"Reflection and rotation don't change similarity.", where_it_appears:"Mirror-image similar triangles in geometry."}
    ],
    key_takeaway:"Similar figures have equal angles and proportional sides. Scale factor k → sides scale by k, areas scale by k².",
    video_script_hooks:{
      opening_hook:"A toy car and a real car — same shape, massively different size. That's similarity in action.",
      concept_reveal:"Two triangles are similar if two angles match. Then everything else — sides and area — follows automatically.",
      common_mistake_moment:"Doubling the side does NOT double the area. It quadruples it. k and k² are very different.",
      real_world_connection:"Camera lenses create similar images on the sensor. Shadow geometry uses similar triangles to measure building heights.",
      closing_hook:"Similarity is proportionality. Same shape, scaled — math's version of a photocopy machine."
    }
  }
},
{
  topicId:"cbse_math8_ch10_direct_inverse_variation", chapterNumber:10, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Direct and Inverse Variation",
  key_formulas:[
    {formula:"Direct: y = kx (k = y/x = constant)", explanation:"As x increases, y increases in the same ratio."},
    {formula:"Inverse: xy = k (k constant)", explanation:"As x increases, y decreases so that their product stays constant."}
  ],
  prerequisite_knowledge:["ratios and proportions","multiplication and division","basic algebra"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Direct variation: more input → proportionally more output. Inverse: more input → proportionally less output.",
      hook:"Speed and time for a fixed distance: double the speed → half the time. That's inverse variation.",
      real_world_anchors:["speed vs travel time","workers vs days to complete a job","price per item vs number of items bought"],
      the_pivot_idea:"Direct: ratio is constant (y/x = k). Inverse: product is constant (xy = k). Find which constant is fixed.",
      wrong_intuitions_to_replace:["'All word problems are direct proportion' — many involve inverse (workers, speed, pipes).","'Inverse means negative' — Inverse variation means the product is constant, not that values go negative."]
    },
    derivation:"Direct: y₁/x₁ = y₂/x₂ = k (same ratio). Inverse: x₁y₁ = x₂y₂ = k (same product). Distinguish by checking which quantity stays constant.",
    worked_example:[
      {problem:"6 taps fill a tank in 20 hours. How long for 8 taps? (Inverse variation)", steps:["x₁y₁ = x₂y₂","6 × 20 = 8 × h","120 = 8h → h = 15"], answer:"15 hours"},
      {problem:"A car travels 150 km using 10 L fuel. How much fuel for 225 km? (Direct)", steps:["Fuel/km is constant: 10/150 = f/225","f = 225×10/150 = 15 L"], answer:"15 litres"}
    ],
    visual_description:"Two graphs side by side: left shows a straight line through origin (direct: y=2x), right shows a hyperbola (inverse: xy=12). Both labelled with k values.",
    svg_diagrams:[{
      id:"cbse_math8_ch10_variation_graphs",
      title:"Direct vs Inverse variation graphs",
      svg:`<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <g transform="translate(20,20)">
    <line x1="0" y1="180" x2="220" y2="180" stroke="#333" stroke-width="1.5"/>
    <line x1="20" y1="0" x2="20" y2="180" stroke="#333" stroke-width="1.5"/>
    <polyline points="20,180 60,140 100,100 140,60 180,20" fill="none" stroke="#4285f4" stroke-width="2.5"/>
    <text x="110" y="200" text-anchor="middle" fill="#333">x</text>
    <text x="5" y="95" text-anchor="middle" fill="#333" transform="rotate(-90,5,95)">y</text>
    <text x="110" y="20" text-anchor="middle" fill="#4285f4" font-weight="bold">Direct: y = kx</text>
  </g>
  <g transform="translate(310,20)">
    <line x1="0" y1="180" x2="220" y2="180" stroke="#333" stroke-width="1.5"/>
    <line x1="20" y1="0" x2="20" y2="180" stroke="#333" stroke-width="1.5"/>
    <path d="M25,10 Q50,60 80,100 Q120,140 180,170" fill="none" stroke="#ea4335" stroke-width="2.5"/>
    <text x="110" y="200" text-anchor="middle" fill="#333">x</text>
    <text x="5" y="95" text-anchor="middle" fill="#333" transform="rotate(-90,5,95)">y</text>
    <text x="110" y="20" text-anchor="middle" fill="#ea4335" font-weight="bold">Inverse: xy = k</text>
  </g>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"All proportion problems are direct", correction:"When one quantity increases and the other decreases, it's inverse. Identify the relationship first."},
      {wrong_idea:"Inverse variation gives a straight line graph", correction:"Inverse variation (xy=k) gives a hyperbola, not a straight line."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Table check", rule:"Make a table of x,y values. If y/x is constant → direct. If xy is constant → inverse.", example:"x:2,4,6 y:6,3,2 → xy=12 constant → inverse", when_to_use:"Any variation identification question."}
    ],
    when_to_use_this_method:{
      use_this_when:["Speed-time problems (inverse)","Cost-quantity problems (direct)","Workers-days problems (inverse)"],
      use_other_when:["Non-proportional relationships (quadratic, exponential) — variation methods don't apply"]
    },
    edge_cases:[
      {case:"k = 0 in direct variation", value:"y = 0 for all x", reasoning:"Trivial/degenerate case — not a useful variation.", where_it_appears:"Edge case in algebra."},
      {case:"One variable is zero in inverse", value:"Undefined (division by zero)", reasoning:"xy = k with x=0 gives y = k/0, undefined.", where_it_appears:"Pipe/tap problems where a tap is closed."}
    ],
    key_takeaway:"Direct variation: y/x = k (graph is a line through origin). Inverse variation: xy = k (graph is a hyperbola). Identify which ratio or product is constant.",
    video_script_hooks:{
      opening_hook:"12 workers finish a job in 8 days. Add 4 more workers — will it take more or fewer days? Fewer — that's inverse variation.",
      concept_reveal:"Direct: both go up together. Inverse: one goes up, the other goes down. Two relationships, two constants.",
      common_mistake_moment:"Don't assume all 'if A then B' problems are direct. Ask: does more A mean more B or less B?",
      real_world_connection:"CPU speed and processing time (inverse). Distance driven and fuel used (direct). These relationships are everywhere in engineering.",
      closing_hook:"Two constants rule the proportional world: y/x for direct, xy for inverse. Find the constant, solve anything."
    }
  }
},

// ── Ch11: Mensuration ─────────────────────────────────────────────────────────
{
  topicId:"cbse_math8_ch11_interior_angles_polygon", chapterNumber:11, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Interior Angles of a Polygon",
  key_formulas:[
    {formula:"Sum of interior angles of n-gon = (n−2)×180°", explanation:"Divide polygon into (n−2) triangles, each contributing 180°."},
    {formula:"Each interior angle of regular n-gon = (n−2)×180°/n", explanation:"All angles equal in a regular polygon."}
  ],
  prerequisite_knowledge:["angles and their types","properties of triangles","polygon names (triangle through decagon)"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Any polygon can be sliced into triangles from one vertex; the total angle sum is just (number of triangles) × 180°.",
      hook:"A triangle has 180°. A quadrilateral has 360°. A pentagon has 540°. The pattern increases by 180° with each new side.",
      real_world_anchors:["honeycomb hexagons","floor tiles (squares, hexagons)","stop signs (octagon)"],
      the_pivot_idea:"Triangulation — drawing diagonals from one vertex — converts any polygon into (n−2) triangles whose angles sum to the polygon's total.",
      wrong_intuitions_to_replace:["'Sum of angles doubles when sides double' — No; it's linear: each extra side adds exactly 180°.","'A regular polygon has all sides equal so all angles must be 90°' — Only true for squares; regular hexagon has 120°, regular pentagon 108°."]
    },
    derivation:"From vertex A in an n-gon, draw (n−3) diagonals to create (n−2) triangles. Each triangle has angle sum 180°. Total = (n−2)×180°.",
    worked_example:[
      {problem:"Find the sum of interior angles of a hexagon.", steps:["n = 6","Sum = (6−2)×180° = 4×180° = 720°"], answer:"720°"},
      {problem:"Each interior angle of a regular polygon is 150°. Find the number of sides.", steps:["(n−2)×180°/n = 150°","(n−2)×180 = 150n","180n − 360 = 150n","30n = 360 → n = 12"], answer:"12 sides (dodecagon)"}
    ],
    visual_description:"A hexagon with all diagonals from vertex A drawn, creating 4 triangles, each labelled 180°. Total = 4×180° = 720°.",
    svg_diagrams:[{
      id:"cbse_math8_ch11_hexagon_triangulation",
      title:"Hexagon triangulated from one vertex",
      svg:`<svg viewBox="0 0 560 280" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <polygon points="280,30 420,110 420,230 280,310 140,230 140,110" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <line x1="280" y1="30" x2="420" y2="230" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="280" y1="30" x2="280" y2="310" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="280" y1="30" x2="140" y2="230" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="5,4"/>
  <circle cx="280" cy="30" r="5" fill="#ea4335"/>
  <text x="280" y="18" text-anchor="middle" fill="#ea4335" font-weight="bold">A</text>
  <text x="340" y="130" fill="#34a853" font-size="12">180°</text>
  <text x="280" y="200" fill="#34a853" font-size="12">180°</text>
  <text x="200" y="130" fill="#34a853" font-size="12">180°</text>
  <text x="280" y="265" fill="#34a853" font-size="12">180°</text>
  <text x="280" y="340" text-anchor="middle" fill="#333">Sum = 4 × 180° = 720°</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"All polygons have the same angle sum", correction:"The sum increases by 180° for each additional side: triangle 180°, quad 360°, pentagon 540°…"},
      {wrong_idea:"Regular polygon interior angle = 180°/n", correction:"Correct formula is (n−2)×180°/n. A square gives (4−2)×180/4 = 90°, not 180/4 = 45°."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Exterior angle shortcut", rule:"Each exterior angle of regular n-gon = 360°/n; interior = 180° − exterior", example:"Regular octagon: exterior = 360/8 = 45°; interior = 135°", when_to_use:"Quick regular polygon angle calculation."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding total or individual angle in any polygon","Proving a polygon is regular","Tile and design problems"],
      use_other_when:["3-D solid angles — use Euler formula or spatial geometry"]
    },
    edge_cases:[
      {case:"Concave polygon", value:"Formula still holds for total interior angle sum", reasoning:"Triangulation works even for concave polygons — some triangles may overlap but angles cancel correctly.", where_it_appears:"Irregular concave shapes."},
      {case:"n = 3 (triangle)", value:"(3−2)×180° = 180°", reasoning:"Degenerate case — formula correctly gives the familiar triangle angle sum.", where_it_appears:"Verification."}
    ],
    key_takeaway:"Sum of interior angles of n-gon = (n−2)×180°. Each angle of regular n-gon = (n−2)×180°/n. Each extra side adds 180° to the total.",
    video_script_hooks:{
      opening_hook:"Why does a stop sign have 8 sides? An octagon's interior angles are 135° each — perfect for visual recognition.",
      concept_reveal:"Draw diagonals from one corner. Every polygon becomes triangles. Count the triangles, multiply by 180°.",
      common_mistake_moment:"Don't divide 180° by n. The formula is (n−2)×180°/n — the (n−2) is essential.",
      real_world_connection:"Architects use polygon angle sums to tile floors without gaps (only triangles, squares, and hexagons tile perfectly).",
      closing_hook:"One formula, any polygon: (n−2)×180°. Triangle to triacontagon — it always works."
    }
  }
},
{
  topicId:"cbse_math8_ch11_classifying_polygons", chapterNumber:11, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Classifying Polygons",
  key_formulas:[
    {formula:"Regular polygon: all sides equal AND all angles equal", explanation:"Both conditions must hold — equilateral triangle is regular; rectangle is not (angles equal, sides unequal)."},
    {formula:"Convex polygon: all interior angles < 180°", explanation:"No interior angle points inward; all vertices 'bulge out'."}
  ],
  prerequisite_knowledge:["basic polygon names","angle types (acute, obtuse, reflex)","equality of sides and angles"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Polygons are classified by their number of sides (triangle, quad, pentagon…) and by regularity (all sides/angles equal) and convexity (no dent).",
      hook:"A rhombus has all sides equal but angles differ — not regular. A rectangle has all angles equal but sides differ — not regular. A square has both — regular.",
      real_world_anchors:["road signs (triangle=warning, octagon=stop)","honeycomb (regular hexagon)","soccer ball panels (regular hexagons + pentagons)"],
      the_pivot_idea:"Regular = equilateral + equiangular. Convex = no reflex interior angle. These two properties classify most polygons you'll encounter.",
      wrong_intuitions_to_replace:["'Equilateral means regular' — Not for quadrilaterals: a rhombus is equilateral but NOT equiangular, so not regular.","'All polygons with > 4 sides are regular' — Pentagon can be irregular (sides/angles all different)."]
    },
    derivation:"A polygon is regular iff it is both equilateral (all sides =) and equiangular (all angles =). Convexity: all interior angles < 180° (equivalently, all cross-products of consecutive edge vectors have the same sign).",
    worked_example:[
      {problem:"Is a rhombus a regular polygon?", steps:["Rhombus: all sides equal ✓","Rhombus angles: typically not all equal (e.g. 60°, 120°, 60°, 120°) ✗","Not equiangular → not regular"], answer:"No"},
      {problem:"Name all regular polygons with angles between 100° and 130°.", steps:["Pentagon: (5−2)×180/5 = 108° ✓","Hexagon: (6−2)×180/6 = 120° ✓","Heptagon: (7−2)×180/7 ≈ 128.6° ✓","Octagon: (8−2)×180/8 = 135° ✗"], answer:"Pentagon, hexagon, heptagon"}
    ],
    visual_description:"A table showing polygon name, sides, regular angle, and whether common shapes (square, rhombus, rectangle, equilateral triangle) qualify as regular.",
    svg_diagrams:[{
      id:"cbse_math8_ch11_polygon_classification",
      title:"Classifying polygons: regular vs irregular, convex vs concave",
      svg:`<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <rect x="10" y="10" width="250" height="210" rx="8" fill="#e8f0fe" stroke="#4285f4" stroke-width="1.5"/>
  <text x="135" y="30" text-anchor="middle" fill="#4285f4" font-weight="bold">Regular Polygons</text>
  <polygon points="90,60 110,95 70,95" fill="none" stroke="#4285f4" stroke-width="2"/>
  <text x="90" y="110" text-anchor="middle" fill="#333">Triangle</text>
  <polygon points="170,55 195,55 195,80 170,80" fill="none" stroke="#4285f4" stroke-width="2"/>
  <text x="183" y="97" text-anchor="middle" fill="#333">Square</text>
  <polygon points="90,140 113,127 122,148 100,163 70,163 48,148 57,127" fill="none" stroke="#4285f4" stroke-width="2"/>
  <text x="90" y="180" text-anchor="middle" fill="#333">Hexagon</text>
  <rect x="290" y="10" width="260" height="210" rx="8" fill="#fce8e6" stroke="#ea4335" stroke-width="1.5"/>
  <text x="420" y="30" text-anchor="middle" fill="#ea4335" font-weight="bold">Irregular / Concave</text>
  <polygon points="330,50 390,50 380,90 340,90" fill="none" stroke="#ea4335" stroke-width="2"/>
  <text x="360" y="108" text-anchor="middle" fill="#333">Irregular quad</text>
  <polygon points="420,55 470,55 490,90 445,120 400,90" fill="none" stroke="#ea4335" stroke-width="2"/>
  <text x="445" y="138" text-anchor="middle" fill="#333">Irregular pentagon</text>
  <polygon points="350,155 380,155 365,180 390,180 370,200 360,175 345,195" fill="none" stroke="#ea4335" stroke-width="2"/>
  <text x="370" y="215" text-anchor="middle" fill="#333">Concave polygon</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"A rectangle is a regular polygon", correction:"Rectangle has equal angles (90°) but sides are NOT all equal (length ≠ width). Not regular."},
      {wrong_idea:"Irregular polygons can't be convex", correction:"A scalene triangle is irregular AND convex — all interior angles < 180°."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Regular polygon checklist", rule:"Ask (1) Are all sides equal? (2) Are all angles equal? Both YES → regular", example:"Equilateral triangle: YES, YES → regular", when_to_use:"Any regularity classification problem."}
    ],
    when_to_use_this_method:{
      use_this_when:["Identifying polygon type in geometry problems","Choosing the right formula (angle, perimeter, area) based on regularity"],
      use_other_when:["3-D shapes — classification uses faces, edges, vertices (Euler's formula)"]
    },
    edge_cases:[
      {case:"Equilateral triangle (all sides equal)", value:"Also equiangular (60° each) — regular", reasoning:"For triangles only: equilateral ↔ equiangular (unlike quadrilaterals).", where_it_appears:"Common exam trap."},
      {case:"Circle as limiting case", value:"Regular polygon with n → ∞", reasoning:"As sides increase infinitely, regular polygon → circle.", where_it_appears:"Calculus motivation."}
    ],
    key_takeaway:"Regular polygon = all sides equal AND all angles equal. Convex = no reflex interior angle. Know these for every polygon from triangle to decagon.",
    video_script_hooks:{
      opening_hook:"Rhombus: all sides equal. Rectangle: all angles equal. Square: both. Only the square is regular — do you see why?",
      concept_reveal:"Regular needs two conditions: equilateral AND equiangular. One alone isn't enough.",
      common_mistake_moment:"Rectangle has 4 right angles — equiangular. But its sides differ — not equilateral. So NOT regular.",
      real_world_connection:"Honeycomb is regular hexagons — strongest and most material-efficient tiling in nature.",
      closing_hook:"Know your polygons by sides, regularity, and convexity — you can classify any shape in geometry."
    }
  }
},
{
  topicId:"cbse_math8_ch11_types_of_symmetry", chapterNumber:11, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Types of Symmetry",
  key_formulas:[
    {formula:"Order of rotational symmetry = 360° ÷ angle of rotation", explanation:"How many times the shape maps onto itself in a full 360° turn."},
    {formula:"Lines of symmetry of regular n-gon = n", explanation:"A square has 4, equilateral triangle 3, regular hexagon 6."}
  ],
  prerequisite_knowledge:["reflection and mirror images","rotation","basic polygon shapes"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A shape has symmetry if it looks identical after a reflection (line symmetry) or a rotation (rotational symmetry).",
      hook:"A square looks the same after rotating 90°, 180°, 270°, and 360° — it has rotational symmetry of order 4.",
      real_world_anchors:["kaleidoscope patterns","snowflakes (6-fold symmetry)","car wheel design","national flags with symmetry"],
      the_pivot_idea:"Symmetry is about invariance — the transformation changes your perspective but the shape itself is unchanged.",
      wrong_intuitions_to_replace:["'All shapes have at least one line of symmetry' — A scalene triangle and a parallelogram have none.","'Rotational symmetry order 1 means no symmetry' — Order 1 means only the full 360° rotation works — effectively no rotational symmetry."]
    },
    derivation:"Line symmetry: fold along the line → both halves coincide perfectly. Rotational symmetry order n: rotation by 360°/n maps shape to itself exactly n times per full turn.",
    worked_example:[
      {problem:"How many lines of symmetry does a regular pentagon have?", steps:["Regular pentagon has n = 5 sides","Lines of symmetry = n = 5"], answer:"5 lines"},
      {problem:"A shape has rotational symmetry of order 6. What is the angle of rotation?", steps:["Angle = 360°/order = 360°/6 = 60°"], answer:"60°"}
    ],
    visual_description:"A regular hexagon with all 6 lines of symmetry drawn (3 through vertices, 3 through midpoints of sides) and a small rotation diagram showing 60° increments.",
    svg_diagrams:[{
      id:"cbse_math8_ch11_symmetry_hexagon",
      title:"Hexagon lines of symmetry and rotational symmetry",
      svg:`<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <g transform="translate(140,130)">
    <polygon points="0,-100 86,-50 86,50 0,100 -86,50 -86,-50" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
    <line x1="0" y1="-110" x2="0" y2="110" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="-95" y1="-55" x2="95" y2="55" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="-95" y1="55" x2="95" y2="-55" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="-100" y1="0" x2="100" y2="0" stroke="#34a853" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="-50" y1="-87" x2="50" y2="87" stroke="#34a853" stroke-width="1.5" stroke-dasharray="5,3"/>
    <line x1="50" y1="-87" x2="-50" y2="87" stroke="#34a853" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="0" y="140" text-anchor="middle" fill="#333">6 lines of symmetry</text>
  </g>
  <text x="360" y="60" fill="#333" font-weight="bold">Rotational symmetry</text>
  <text x="360" y="85" fill="#333">Order = 6</text>
  <text x="360" y="110" fill="#333">Angle = 60°</text>
  <text x="360" y="135" fill="#4285f4">Rotate by 60° →</text>
  <text x="360" y="160" fill="#4285f4">shape looks same</text>
  <text x="360" y="185" fill="#333">6 times per full turn</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Parallelogram has 2 lines of symmetry", correction:"A parallelogram has NO lines of symmetry (unless it's a rectangle, rhombus, or square)."},
      {wrong_idea:"Order of rotational symmetry = number of sides", correction:"True only for regular polygons. An irregular quadrilateral may have order 1."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Regular n-gon rules", rule:"Lines of symmetry = n; Rotational order = n; Rotation angle = 360°/n", example:"Regular hexagon: 6 lines, order 6, 60° rotation", when_to_use:"Any regular polygon symmetry question."}
    ],
    when_to_use_this_method:{
      use_this_when:["Identifying symmetry properties of shapes","Art and design pattern analysis","Checking if a figure is regular"],
      use_other_when:["3-D symmetry (planes of symmetry, axes of rotation) — requires spatial visualization"]
    },
    edge_cases:[
      {case:"Circle", value:"Infinite lines of symmetry, infinite rotational order", reasoning:"Any diameter is a line of symmetry; any rotation maps circle to itself.", where_it_appears:"Limiting case of regular polygon."},
      {case:"Letters of alphabet", value:"H, I, O, X have both symmetries; A has line only; S has rotational only", reasoning:"Useful for practising symmetry identification.", where_it_appears:"Pattern recognition problems."}
    ],
    key_takeaway:"Line symmetry: fold → halves coincide; count = n for regular n-gon. Rotational symmetry order n: rotate 360°/n and shape is unchanged; order = n for regular n-gon.",
    video_script_hooks:{
      opening_hook:"Snowflakes have 6-fold symmetry — rotate 60° and it looks identical. That's rotational symmetry of order 6.",
      concept_reveal:"Every regular polygon has as many lines of symmetry as it has sides. And the same rotational order.",
      common_mistake_moment:"A parallelogram looks symmetric but has NO lines of symmetry. Only a rectangle, rhombus, or square does.",
      real_world_connection:"Kaleidoscopes use mirror symmetry. Turbine blades use rotational symmetry. Symmetry = beauty + efficiency.",
      closing_hook:"Symmetry is nature's favourite design principle. Learn to spot it and you'll see it everywhere."
    }
  }
},
{
  topicId:"cbse_math8_ch11_geometric_transformations", chapterNumber:11, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Geometric Transformations",
  key_formulas:[
    {formula:"Reflection over x-axis: (x,y) → (x,−y)", explanation:"The x-coordinate stays; y-coordinate negates."},
    {formula:"Rotation 90° CCW about origin: (x,y) → (−y,x)", explanation:"Standard 90° counter-clockwise rotation formula."},
    {formula:"Translation by (a,b): (x,y) → (x+a,y+b)", explanation:"Shift every point by the same vector (a,b)."}
  ],
  prerequisite_knowledge:["coordinate geometry basics","reflections and flips","the four quadrants"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Transformations move, flip, or turn a shape without changing its size — the image is always congruent to the original.",
      hook:"Slide (translation), flip (reflection), turn (rotation) — three moves, infinite patterns.",
      real_world_anchors:["sliding a chess piece (translation)","mirror image in water (reflection)","spinning a wheel (rotation)","tiling patterns (combination of all three)"],
      the_pivot_idea:"All rigid transformations preserve shape and size. Only the position and/or orientation changes.",
      wrong_intuitions_to_replace:["'Reflection changes size' — No; reflection is a rigid transformation; size is preserved.","'Rotation always about the origin' — Rotation can be about any point; the centre of rotation must be specified."]
    },
    derivation:"Translation: add vector. Reflection over y=0: negate y. Rotation 90° CCW: (x,y)→(−y,x) (derived from rotation matrix [cos90 −sin90; sin90 cos90]=[0 −1;1 0]).",
    worked_example:[
      {problem:"Reflect point P(3,−2) over the x-axis.", steps:["Reflection over x-axis: (x,y) → (x,−y)","P(3,−2) → P'(3,2)"], answer:"P'(3, 2)"},
      {problem:"Translate triangle with vertices (1,1),(3,1),(2,3) by vector (2,−1).", steps:["Add (2,−1) to each vertex:","(1+2,1−1)=(3,0)","(3+2,1−1)=(5,0)","(2+2,3−1)=(4,2)"], answer:"(3,0), (5,0), (4,2)"}
    ],
    visual_description:"Coordinate grid showing a triangle and its reflection over the x-axis (mirror image below), with the x-axis as the mirror line and arrows indicating corresponding vertices.",
    svg_diagrams:[{
      id:"cbse_math8_ch11_transformation_types",
      title:"Translation, Reflection, Rotation on a coordinate grid",
      svg:`<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <line x1="10" y1="130" x2="550" y2="130" stroke="#aaa" stroke-width="1"/>
  <line x1="280" y1="10" x2="280" y2="250" stroke="#aaa" stroke-width="1"/>
  <polygon points="60,80 120,80 90,40" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="90" y="30" text-anchor="middle" fill="#4285f4">Original</text>
  <polygon points="190,80 250,80 220,40" fill="#e6f4ea" stroke="#34a853" stroke-width="2"/>
  <text x="220" y="30" text-anchor="middle" fill="#34a853">Translated</text>
  <text x="155" y="65" fill="#333" font-size="11">→(2,−1)</text>
  <polygon points="320,80 380,80 350,40" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <polygon points="320,180 380,180 350,220" fill="#fce8e6" stroke="#ea4335" stroke-width="2"/>
  <line x1="300" y1="130" x2="400" y2="130" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="350" y="15" text-anchor="middle" fill="#ea4335">Reflected</text>
  <polygon points="450,90 510,90 480,50" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <polygon points="450,150 510,150 490,180" fill="#fff0c0" stroke="#fbbc04" stroke-width="2"/>
  <text x="480" y="220" text-anchor="middle" fill="#fbbc04">Rotated 90°</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Reflection changes the size of the shape", correction:"All rigid transformations (translation, reflection, rotation) preserve size and shape — the image is congruent."},
      {wrong_idea:"Rotating 90° clockwise is the same as 90° counter-clockwise", correction:"90° CW: (x,y)→(y,−x). 90° CCW: (x,y)→(−y,x). They produce mirror-image results."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Reflection rules to memorise", rule:"Over x-axis: negate y. Over y-axis: negate x. Over y=x: swap x and y.", example:"P(2,3) reflected over y-axis → P'(−2,3)", when_to_use:"Coordinate geometry transformation problems."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding image coordinates after a transformation","Describing movements of shapes in coordinate geometry"],
      use_other_when:["Enlargement/reduction (dilation) — not a rigid transformation; size changes"]
    },
    edge_cases:[
      {case:"Rotation about a point other than origin", value:"Translate to origin, rotate, translate back", reasoning:"The formula (x,y)→(−y,x) only works for rotation about origin.", where_it_appears:"Advanced geometry problems."},
      {case:"Reflection over y = x", value:"(x,y) → (y,x)", reasoning:"Swap coordinates; the line y=x is equidistant from (a,b) and (b,a).", where_it_appears:"Inverse function graphs."}
    ],
    key_takeaway:"Three rigid transformations: Translation (add vector), Reflection (negate coordinate), Rotation (apply rotation formula). All preserve congruence — size and shape unchanged.",
    video_script_hooks:{
      opening_hook:"Slide a chess piece — translation. See your reflection in a mirror — reflection. Spin a wheel — rotation. Three moves rule all of geometry.",
      concept_reveal:"Rigid transformation = congruence preserved. The image is always the same shape and size as the original.",
      common_mistake_moment:"Reflection does NOT flip the size. It only flips the orientation. The shape stays exactly the same size.",
      real_world_connection:"Computer graphics use transformation matrices millions of times per second to render every frame of a game or movie.",
      closing_hook:"Every shape in geometry can be moved, flipped, or turned. Three rules, infinite possibilities."
    }
  }
},

// ── Ch12: Introduction to Graphs ─────────────────────────────────────────────
{
  topicId:"cbse_math8_ch12_graphs_and_networks", chapterNumber:12, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Graphs and Data Representation",
  key_formulas:[
    {formula:"Bar graph: each bar length ∝ frequency", explanation:"Bars are drawn to scale; the height (or length) represents the data value."},
    {formula:"Pie chart: sector angle = (value/total) × 360°", explanation:"Each category occupies a proportional angle of the full circle."}
  ],
  prerequisite_knowledge:["reading tables and charts","fractions and percentages","basic coordinate plane"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Graphs translate numbers into visual shapes — patterns invisible in a table jump out immediately in a well-drawn graph.",
      hook:"A table of 12 monthly temperatures is hard to read. A line graph shows the monsoon spike in seconds.",
      real_world_anchors:["weather temperature line graphs","election result bar charts","budget pie charts","stock price graphs"],
      the_pivot_idea:"Every graph type suits a different question: bar for comparison, line for trends over time, pie for proportion of a whole.",
      wrong_intuitions_to_replace:["'Bigger bar = more important' — only more frequent/larger in value.","'Pie chart can show negative values' — No; pie charts require all positive values that sum to a meaningful total."]
    },
    derivation:"Pie chart sector angle derivation: if a category is x out of total T, it occupies fraction x/T of the full circle (360°), so angle = (x/T)×360°.",
    worked_example:[
      {problem:"In a class of 40, 10 like cricket, 15 football, 15 badminton. Find pie-chart angles.", steps:["Cricket: 10/40 × 360° = 90°","Football: 15/40 × 360° = 135°","Badminton: 15/40 × 360° = 135°","Check: 90+135+135 = 360° ✓"], answer:"90°, 135°, 135°"},
      {problem:"A bar graph shows sales: Jan=50, Feb=80, Mar=60. Which month had highest sales?", steps:["Identify tallest bar","Feb bar is tallest at 80"], answer:"February"}
    ],
    visual_description:"Side-by-side: a bar chart with 3 labelled bars (Jan, Feb, Mar) and a pie chart divided into 3 sectors (cricket 90°, football 135°, badminton 135°), each sector labelled.",
    svg_diagrams:[{
      id:"cbse_math8_ch12_bar_pie",
      title:"Bar chart and pie chart comparison",
      svg:`<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <g transform="translate(20,10)">
    <text x="100" y="18" text-anchor="middle" fill="#4285f4" font-weight="bold">Bar Chart</text>
    <line x1="20" y1="180" x2="200" y2="180" stroke="#333" stroke-width="1.5"/>
    <line x1="20" y1="20" x2="20" y2="180" stroke="#333" stroke-width="1.5"/>
    <rect x="35" y="80" width="35" height="100" fill="#4285f4"/>
    <rect x="90" y="40" width="35" height="140" fill="#34a853"/>
    <rect x="145" y="60" width="35" height="120" fill="#ea4335"/>
    <text x="52" y="195" text-anchor="middle" fill="#333">Jan</text>
    <text x="107" y="195" text-anchor="middle" fill="#333">Feb</text>
    <text x="162" y="195" text-anchor="middle" fill="#333">Mar</text>
    <text x="52" y="74" text-anchor="middle" fill="#4285f4">50</text>
    <text x="107" y="34" text-anchor="middle" fill="#34a853">80</text>
    <text x="162" y="54" text-anchor="middle" fill="#ea4335">60</text>
  </g>
  <g transform="translate(340,120)">
    <text x="0" y="-110" text-anchor="middle" fill="#fbbc04" font-weight="bold">Pie Chart</text>
    <path d="M0,0 L0,-90 A90,90,0,0,1,90,0 Z" fill="#4285f4"/>
    <path d="M0,0 L90,0 A90,90,0,0,1,-45,78 Z" fill="#34a853"/>
    <path d="M0,0 L-45,78 A90,90,0,0,1,0,-90 Z" fill="#ea4335"/>
    <text x="40" y="-40" fill="white" font-size="11">Cricket 90°</text>
    <text x="20" y="50" fill="white" font-size="11">Football</text>
    <text x="-80" y="10" fill="white" font-size="11">Badminton</text>
  </g>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"A line graph can show any data", correction:"Line graphs are for data measured over time (continuous); use bar graphs for categorical comparison."},
      {wrong_idea:"Pie chart sectors can be any size", correction:"Every sector angle must be calculated from (value/total)×360°; the angles must sum to exactly 360°."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Quick pie-chart check", rule:"Sum all sector angles — must equal 360°", example:"90+135+135 = 360 ✓", when_to_use:"After drawing any pie chart."}
    ],
    when_to_use_this_method:{
      use_this_when:["Comparing categories: bar chart","Showing trend over time: line graph","Showing proportion of whole: pie chart"],
      use_other_when:["Showing relationship between two variables: scatter plot (introduced in higher grades)"]
    },
    edge_cases:[
      {case:"All values equal in pie chart", value:"Each sector = 360°/n", reasoning:"Equal shares → equal angles.", where_it_appears:"Uniform distribution data."},
      {case:"Zero value in bar chart", value:"Bar height = 0 (no bar drawn)", reasoning:"Zero is a valid data point; include the label on x-axis.", where_it_appears:"Missing data months."}
    ],
    key_takeaway:"Bar chart: bars proportional to values for category comparison. Pie chart: sector angle = (value/total)×360° for proportion. Line graph: points connected for trends over time.",
    video_script_hooks:{
      opening_hook:"India's GDP growth by year — a table of 20 numbers tells you nothing at a glance. A line graph shows the crash and boom instantly.",
      concept_reveal:"Each graph type asks a different question. Bar: which is more? Line: how is it changing? Pie: what's the share?",
      common_mistake_moment:"Don't draw a line graph for categories like 'favourite colour'. Only connect points when the x-axis is continuous (time, distance, temperature).",
      real_world_connection:"Every newspaper, business report, and government dashboard uses these three graph types. Read them critically.",
      closing_hook:"Data is everywhere. Graphs make it visible. Learn to read them and you'll never be fooled by a misleading chart again."
    }
  }
},
{
  topicId:"cbse_math8_ch12_paths_in_graphs", chapterNumber:12, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Coordinate Graphs and Linear Relationships",
  key_formulas:[
    {formula:"Points on a graph: (x, y) where x = independent variable, y = dependent variable", explanation:"x is the input, y is the output plotted on the graph."},
    {formula:"Linear graph: y = mx + c (straight line)", explanation:"m = slope (rate of change), c = y-intercept (starting value)."}
  ],
  prerequisite_knowledge:["coordinate plane (x and y axes)","ordered pairs","basic algebra"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A coordinate graph plots pairs of values as points — connecting them reveals the relationship between the two quantities.",
      hook:"Plot distance against time for a car moving at constant speed — you get a straight line. The slope is the speed.",
      real_world_anchors:["distance-time graphs for vehicles","temperature-time graphs during cooling","profit-units sold graphs in business"],
      the_pivot_idea:"On a linear graph, the slope (steepness) tells you the rate of change — how fast y changes per unit increase in x.",
      wrong_intuitions_to_replace:["'A steeper graph means faster' — only if both axes have the same scale.","'A horizontal line means stopped' — only for distance-time; for temperature-time it means constant temperature."]
    },
    derivation:"If y = mx + c, then for two points (x₁,y₁) and (x₂,y₂) on the line: m = (y₂−y₁)/(x₂−x₁) — the slope is the ratio of vertical to horizontal change.",
    worked_example:[
      {problem:"A car travels at 60 km/h. Draw the distance-time graph for 0 to 4 hours.", steps:["At t=0: d=0; t=1: d=60; t=2: d=120; t=3: d=180; t=4: d=240","Plot points (0,0),(1,60),(2,120),(3,180),(4,240)","Connect — straight line through origin"], answer:"Straight line with slope 60"},
      {problem:"From graph: at t=2.5 h, what is distance?", steps:["d = 60 × 2.5 = 150 km (read from graph or formula)"], answer:"150 km"}
    ],
    visual_description:"A distance-time graph with time on x-axis (0-4 h) and distance on y-axis (0-240 km), showing a straight line from (0,0) to (4,240), slope labelled '60 km/h'.",
    svg_diagrams:[{
      id:"cbse_math8_ch12_distance_time",
      title:"Distance-time graph for constant speed",
      svg:`<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <line x1="60" y1="220" x2="520" y2="220" stroke="#333" stroke-width="1.5"/>
  <line x1="60" y1="20" x2="60" y2="220" stroke="#333" stroke-width="1.5"/>
  ${[0,1,2,3,4].map((t,i)=>`<line x1="${60+i*100}" y1="218" x2="${60+i*100}" y2="222" stroke="#333" stroke-width="1"/><text x="${60+i*100}" y="234" text-anchor="middle" fill="#333">${t}</text>`).join("")}
  ${[0,60,120,180,240].map((d,i)=>`<line x1="58" y1="${220-i*50}" x2="62" y2="${220-i*50}" stroke="#333" stroke-width="1"/><text x="50" y="${224-i*50}" text-anchor="end" fill="#333">${d}</text>`).join("")}
  <text x="290" y="252" text-anchor="middle" fill="#333">Time (hours)</text>
  <text x="18" y="120" text-anchor="middle" fill="#333" transform="rotate(-90,18,120)">Distance (km)</text>
  <polyline points="60,220 160,170 260,120 360,70 460,20" fill="none" stroke="#4285f4" stroke-width="2.5"/>
  <text x="340" y="55" fill="#4285f4" font-weight="bold">Slope = 60 km/h</text>
  <text x="290" y="16" text-anchor="middle" fill="#333" font-weight="bold">Distance-Time Graph (60 km/h)</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"A curve in a distance-time graph means the car curved", correction:"A curve means speed is changing (acceleration or deceleration) — not that the path curved."},
      {wrong_idea:"Steeper slope always means faster in every graph", correction:"Slope meaning depends on axis labels. Always check what x and y represent before interpreting steepness."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Read rate directly from slope", rule:"Slope = (y₂−y₁)/(x₂−x₁); units of slope = units of y ÷ units of x", example:"Distance-time: slope = km/h = speed", when_to_use:"Any distance-time or linear graph question."}
    ],
    when_to_use_this_method:{
      use_this_when:["Showing linear relationships between two quantities","Finding rate of change from a graph","Predicting values using a linear graph"],
      use_other_when:["Non-linear relationships (exponential, parabolic) — use different graph types"]
    },
    edge_cases:[
      {case:"Horizontal line on distance-time graph", value:"Speed = 0 (object at rest)", reasoning:"No distance change over time → stopped.", where_it_appears:"Bus waiting at a stop."},
      {case:"Vertical line on any graph", value:"Undefined (not possible physically)", reasoning:"Same time, different distances = impossible; suggests a graphing error.", where_it_appears:"Incorrectly drawn graphs."}
    ],
    key_takeaway:"Coordinate graphs show relationships between variables. On a linear graph, slope = rate of change. Distance-time graph slope = speed. Always label axes with units.",
    video_script_hooks:{
      opening_hook:"A car's GPS tracks position every second. Plot those points — you get a distance-time graph. The slope is exactly the speed on the speedometer.",
      concept_reveal:"Every straight-line graph has a slope that tells you how fast y changes per unit of x. That's the rate of change.",
      common_mistake_moment:"A flat part of a distance-time graph doesn't mean slow. It means stopped. Flat = zero slope = zero speed.",
      real_world_connection:"Flight tracking apps show real-time altitude-time and speed-time graphs. Every graph you see uses these principles.",
      closing_hook:"Plot two variables, look at the slope, read the story. Graphs are the language of data."
    }
  }
},
{
  topicId:"cbse_math8_ch12_euler_paths", chapterNumber:12, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Linear Graphs and Applications",
  key_formulas:[
    {formula:"y = mx + c", explanation:"Standard form of a linear equation; m = slope, c = y-intercept."},
    {formula:"Two-point slope: m = (y₂−y₁)/(x₂−x₁)", explanation:"Slope calculated from any two points on the line."}
  ],
  prerequisite_knowledge:["plotting points on coordinate plane","solving linear equations","ratio and proportion"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A linear equation in two variables plots as a straight line — every solution is a point on that line, and every point on the line is a solution.",
      hook:"₹50 + ₹10 per km taxi fare: total = 50 + 10x. Plot this and instantly read off the fare for any distance.",
      real_world_anchors:["taxi meter (fixed charge + per km rate)","mobile data plan (base cost + per GB)","temperature conversion (°F = 1.8°C + 32)"],
      the_pivot_idea:"The equation y = mx + c is a recipe: c is the starting value, m is how fast y grows per unit of x.",
      wrong_intuitions_to_replace:["'y = mx + c only works for distance-time' — it models any linear relationship.","'If c = 0 the line doesn't pass the origin' — y = mx has c = 0 and DOES pass through origin."]
    },
    derivation:"A linear equation in x and y has degree 1. Plot two solutions: (0, c) — the y-intercept — and (1, m+c). Draw the line through them. Every point on the line satisfies the equation.",
    worked_example:[
      {problem:"Taxi charges ₹50 fixed + ₹12/km. Write and plot the equation.", steps:["y = 12x + 50","At x=0: y=50; at x=5: y=110; at x=10: y=170","Plot and connect"], answer:"y = 12x + 50; slope = 12, y-intercept = 50"},
      {problem:"°F = (9/5)°C + 32. Find °F when °C = 25.", steps:["F = (9/5)×25 + 32 = 45 + 32 = 77"], answer:"77°F"}
    ],
    visual_description:"A graph of y = 12x + 50 (taxi fare) with x-axis 'distance (km)' and y-axis 'fare (₹)', showing y-intercept at 50 and slope annotation '₹12 per km'.",
    svg_diagrams:[{
      id:"cbse_math8_ch12_linear_graph",
      title:"Linear graph y = 12x + 50 (taxi fare)",
      svg:`<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <line x1="60" y1="220" x2="520" y2="220" stroke="#333" stroke-width="1.5"/>
  <line x1="60" y1="20" x2="60" y2="220" stroke="#333" stroke-width="1.5"/>
  ${[0,2,4,6,8,10].map((x,i)=>`<text x="${60+i*80}" y="234" text-anchor="middle" fill="#333">${x}</text>`).join("")}
  <text x="50" y="224" text-anchor="end" fill="#333">50</text>
  <text x="50" y="164" text-anchor="end" fill="#333">170</text>
  <text x="290" y="252" text-anchor="middle" fill="#333">Distance (km)</text>
  <text x="15" y="120" text-anchor="middle" fill="#333" transform="rotate(-90,15,120)">Fare (₹)</text>
  <polyline points="60,200 220,152 380,104 540,56" fill="none" stroke="#4285f4" stroke-width="2.5"/>
  <circle cx="60" cy="200" r="4" fill="#ea4335"/>
  <text x="70" y="198" fill="#ea4335">c = 50 (fixed charge)</text>
  <text x="340" y="80" fill="#4285f4" font-weight="bold">Slope = ₹12/km</text>
  <text x="290" y="16" text-anchor="middle" fill="#333" font-weight="bold">Taxi Fare: y = 12x + 50</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"y = mx + c requires x to be time", correction:"x can be any independent variable — distance, temperature, quantity, etc."},
      {wrong_idea:"If m is negative the line goes down to the right", correction:"Yes — negative slope means y decreases as x increases. That's correct, not an error."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Two-point method", rule:"Pick any two easy x-values (usually x=0 and x=1), compute y, plot and connect", example:"y=3x+2: (0,2) and (1,5) → straight line", when_to_use:"Quickest way to draw any linear graph."}
    ],
    when_to_use_this_method:{
      use_this_when:["Modelling constant rate-of-change situations","Finding unknown values using a linear relationship","Temperature conversion, cost calculation problems"],
      use_other_when:["Exponential growth (compound interest) — not linear"]
    },
    edge_cases:[
      {case:"m = 0", value:"y = c (horizontal line)", reasoning:"Zero slope means y doesn't change with x — constant function.", where_it_appears:"Flat rate pricing (no per-unit charge)."},
      {case:"c = 0", value:"y = mx (passes through origin)", reasoning:"No fixed starting cost; directly proportional relationship.", where_it_appears:"Direct proportion graphs."}
    ],
    key_takeaway:"y = mx + c: m is the slope (rate of change per unit x), c is the y-intercept (value when x=0). Plot using two points. Applies to any constant-rate situation.",
    video_script_hooks:{
      opening_hook:"Every taxi meter computes y = mx + c. Your phone's data plan computes it. Your electricity bill computes it. One formula, everywhere.",
      concept_reveal:"c is where you start. m is how fast you move. Plot them and you have the entire story in a straight line.",
      common_mistake_moment:"y = 3x doesn't mean 'three times x only when x is positive'. It works for all x — negative, zero, fraction.",
      real_world_connection:"Temperature conversion F = 1.8C + 32 is a linear graph. Every Celsius temperature corresponds to exactly one Fahrenheit — read it off the graph.",
      closing_hook:"Linear graphs: two numbers (m and c) define an infinite line. Simple, powerful, everywhere."
    }
  }
},
{
  topicId:"cbse_math8_ch12_trees_in_graphs", chapterNumber:12, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Reading and Interpreting Graphs",
  key_formulas:[
    {formula:"Rate from graph = vertical change / horizontal change = Δy/Δx", explanation:"Read the slope directly off the graph using two clear points."},
    {formula:"Prediction from graph: extend the line and read the y-value for desired x", explanation:"Extrapolation beyond plotted data (use with caution)."}
  ],
  prerequisite_knowledge:["coordinate plane","linear graphs","ratios"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Reading a graph means extracting numbers and meaning from a visual — identify trends, read specific values, compare rates.",
      hook:"A temperature-time graph for a cooling cup of tea — you can read the temperature at any time and find when it reaches room temperature.",
      real_world_anchors:["reading a patient's temperature chart","reading electricity consumption vs time","reading crop yield vs rainfall graphs"],
      the_pivot_idea:"A graph encodes data. To decode it: (1) read the axes and scale, (2) identify the trend, (3) read specific values by tracing perpendiculars.",
      wrong_intuitions_to_replace:["'A graph that goes up is always good' — depends on what's being measured; rising pollution is bad.","'You can always extend a graph forever' — extrapolation beyond data range may be unreliable."]
    },
    derivation:"To read value at x = a: draw vertical line x = a, find intersection with graph, draw horizontal line to y-axis, read y-value. To find rate: pick two points, apply Δy/Δx.",
    worked_example:[
      {problem:"From a temperature-time graph, the temperature dropped from 80°C at t=0 to 40°C at t=20 min. Find the cooling rate.", steps:["Rate = Δtemp/Δtime = (80−40)/(20−0)","= 40/20 = 2°C per minute"], answer:"2°C per minute"},
      {problem:"Using the same graph, predict temperature at t=25 min (linear).", steps:["Temperature = 80 − 2×25 = 80 − 50 = 30°C"], answer:"30°C"}
    ],
    visual_description:"A temperature-time graph showing a line from (0,80) to (20,40), with dashed lines showing how to read the temperature at t=15 min (value: 50°C).",
    svg_diagrams:[{
      id:"cbse_math8_ch12_reading_graph",
      title:"Reading values from a temperature-time graph",
      svg:`<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="12">
  <line x1="60" y1="220" x2="520" y2="220" stroke="#333" stroke-width="1.5"/>
  <line x1="60" y1="20" x2="60" y2="220" stroke="#333" stroke-width="1.5"/>
  ${[0,5,10,15,20,25].map((t,i)=>`<text x="${60+i*80}" y="234" text-anchor="middle" fill="#333">${t}</text>`).join("")}
  ${[0,20,40,60,80].map((d,i)=>`<text x="52" y="${220-i*40}" text-anchor="end" fill="#333">${d}</text>`).join("")}
  <text x="290" y="252" text-anchor="middle" fill="#333">Time (min)</text>
  <text x="15" y="120" text-anchor="middle" fill="#333" transform="rotate(-90,15,120)">Temp (°C)</text>
  <polyline points="60,60 380,220" fill="none" stroke="#ea4335" stroke-width="2.5"/>
  <line x1="300" y1="60" x2="300" y2="140" stroke="#4285f4" stroke-width="1.5" stroke-dasharray="5,3"/>
  <line x1="60" y1="140" x2="300" y2="140" stroke="#4285f4" stroke-width="1.5" stroke-dasharray="5,3"/>
  <circle cx="300" cy="140" r="4" fill="#4285f4"/>
  <text x="305" y="135" fill="#4285f4">t=15, T=50°C</text>
  <text x="290" y="16" text-anchor="middle" fill="#333" font-weight="bold">Reading from Temperature-Time Graph</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"You must read only at marked gridlines", correction:"Interpolate between gridlines — estimate the value between two marked points."},
      {wrong_idea:"A negative slope means the quantity is wrong", correction:"Negative slope just means the quantity is decreasing — perfectly valid (temperature cooling, tank draining)."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Tracing method", rule:"For value at x=a: (1) find a on x-axis, (2) draw vertical to graph, (3) draw horizontal to y-axis, (4) read value", example:"At t=15: trace up to line, across to y-axis → T=50°C", when_to_use:"Reading any value from any graph."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding specific values from a given graph","Comparing rates of change between two graphs","Identifying trend direction from graph shape"],
      use_other_when:["Exact computation — read from graph gives approximations; use equation for exact values"]
    },
    edge_cases:[
      {case:"Reading at a kink/corner in graph", value:"Different slopes on each side", reasoning:"The rate changes at the kink — compute separately for each section.", where_it_appears:"Multi-phase problems (heating then cooling)."},
      {case:"Extrapolation beyond data", value:"May be unreliable", reasoning:"Linear trend may not continue — always note when extrapolating.", where_it_appears:"Predictions in science and economics."}
    ],
    key_takeaway:"To read a graph: check axis labels and scale, trace perpendiculars to read values, compute slope as Δy/Δx. Extrapolate cautiously beyond the plotted range.",
    video_script_hooks:{
      opening_hook:"A doctor looks at your temperature chart and immediately sees the fever peak and when it started dropping. That's graph reading saving lives.",
      concept_reveal:"Every graph is a table turned visual. To read a value: go up from x-axis, turn at the curve, go across to y-axis.",
      common_mistake_moment:"Don't eyeball the y-axis value without tracing from the exact x point. Slanting your eyes introduces error.",
      real_world_connection:"Stock traders, scientists, engineers — they all read graphs daily. This skill underlies every data-driven decision.",
      closing_hook:"Graphs are data in disguise. Learn to decode them and you've learned to see what others miss."
    }
  }
},

// ── Ch13: Algebraic Expressions and Identities ───────────────────────────────
{
  topicId:"cbse_math8_ch13_algebraic_expressions", chapterNumber:13, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Algebraic Expressions",
  key_formulas:[
    {formula:"Monomial: single term (e.g. 3x², −5ab)", explanation:"One term; product of coefficient and variables with non-negative integer exponents."},
    {formula:"Degree of polynomial = highest power of variable", explanation:"Degree of 4x³ + 2x − 7 is 3."}
  ],
  prerequisite_knowledge:["variables and constants","multiplication of numbers","exponents"],
  teaching_content:{
    intuition:{
      elevator_pitch:"An algebraic expression is a mathematical phrase built from numbers and variables combined with operations — a flexible formula for any value.",
      hook:"The perimeter of a rectangle is 2(l+b). With variables, one formula gives perimeter for every possible rectangle.",
      real_world_anchors:["perimeter formula 2(l+b)","profit = selling price − cost price","speed = distance/time as algebraic expressions"],
      the_pivot_idea:"Expressions have structure: terms (separated by + or −), factors (connected by multiplication), and degree (the highest exponent). Understanding structure guides simplification.",
      wrong_intuitions_to_replace:["'Unlike terms can be added by adding coefficients' — Only like terms can be combined: 3x + 2x = 5x, but 3x + 2y cannot simplify.","'x² + x = x³' — Wrong; unlike terms don't combine by multiplying exponents."]
    },
    derivation:"Like terms: same variable part (e.g. 3xy and −5xy). Adding like terms: sum coefficients, keep variable part. 3xy + (−5xy) = (3−5)xy = −2xy.",
    worked_example:[
      {problem:"Simplify: 3x² + 5x − 2x² + 7 − 3x.", steps:["Group like terms: (3x²−2x²) + (5x−3x) + 7","= x² + 2x + 7"], answer:"x² + 2x + 7"},
      {problem:"Find the degree and number of terms of 4x³y − 2x²y² + xy.", steps:["Terms: 3 (separated by + and −)","Degrees: 3+1=4, 2+2=4, 1+1=2","Degree of polynomial = 4"], answer:"3 terms; degree 4"}
    ],
    visual_description:"A colour-coded expression '3x² + 5x − 2x² + 7 − 3x' with x² terms circled in blue and x terms circled in green, showing the grouping step.",
    svg_diagrams:[{
      id:"cbse_math8_ch13_like_terms",
      title:"Grouping like terms in an algebraic expression",
      svg:`<svg viewBox="0 0 560 180" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="15">
  <text x="20" y="50" fill="#333">3x²</text>
  <text x="70" y="50" fill="#333"> + </text>
  <text x="95" y="50" fill="#333">5x</text>
  <text x="125" y="50" fill="#333"> − </text>
  <text x="150" y="50" fill="#333">2x²</text>
  <text x="205" y="50" fill="#333"> + </text>
  <text x="225" y="50" fill="#333">7</text>
  <text x="250" y="50" fill="#333"> − </text>
  <text x="275" y="50" fill="#333">3x</text>
  <rect x="15" y="30" width="55" height="28" rx="5" fill="none" stroke="#4285f4" stroke-width="2"/>
  <rect x="145" y="30" width="60" height="28" rx="5" fill="none" stroke="#4285f4" stroke-width="2"/>
  <rect x="90" y="30" width="35" height="28" rx="5" fill="none" stroke="#34a853" stroke-width="2"/>
  <rect x="270" y="30" width="38" height="28" rx="5" fill="none" stroke="#34a853" stroke-width="2"/>
  <text x="20" y="95" fill="#4285f4">x² terms → (3−2)x² = x²</text>
  <text x="20" y="125" fill="#34a853">x terms → (5−3)x = 2x</text>
  <text x="20" y="155" fill="#333">Constant → 7</text>
  <text x="280" y="125" fill="#333" font-weight="bold">= x² + 2x + 7</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"3x + 2y = 5xy", correction:"Unlike terms cannot be added. 3x and 2y are different — there's no simplification."},
      {wrong_idea:"x + x = x²", correction:"x + x = 2x (addition adds coefficients). x × x = x² (multiplication adds exponents)."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Colour-coding like terms", rule:"Underline, circle, or colour each group of like terms before combining", example:"3x² and −2x² in blue; 5x and −3x in green; then combine each colour", when_to_use:"Any simplification with 4+ terms."}
    ],
    when_to_use_this_method:{
      use_this_when:["Simplifying polynomial expressions","Finding degree and number of terms","Substituting values into formulas"],
      use_other_when:["Equations (has = sign): use equation-solving methods"]
    },
    edge_cases:[
      {case:"Coefficient of 1 or −1", value:"1x = x; −1x = −x (write without the 1)", reasoning:"Coefficient 1 is implicit.", where_it_appears:"After simplification: 3x²−2x² = 1x² = x²."},
      {case:"Expression with zero terms after simplification", value:"0 (the zero polynomial)", reasoning:"All terms cancel.", where_it_appears:"5x − 5x = 0."}
    ],
    key_takeaway:"Algebraic expressions: terms separated by + or −. Only like terms (same variable part) can be combined — add their coefficients. Degree = highest power.",
    video_script_hooks:{
      opening_hook:"Why write 2(l+b) instead of measuring every rectangle separately? Because one algebraic expression contains every rectangle ever.",
      concept_reveal:"Expressions are built from terms. Terms are like-able or unlike-able. Only like terms combine — that's the one rule.",
      common_mistake_moment:"3x + 2y ≠ 5xy. Variables are like apples and oranges — you can't just add them. They're different kinds of things.",
      real_world_connection:"Every formula in science and engineering is an algebraic expression. Ohm's law, kinetic energy, area — all are expressions waiting to be evaluated.",
      closing_hook:"Master expressions and you've mastered the language algebra speaks. Everything else is just new vocabulary."
    }
  }
},
{
  topicId:"cbse_math8_ch13_linear_equations", chapterNumber:13, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Linear Equations in One Variable",
  key_formulas:[
    {formula:"Transposition rule: move a term to other side, change its sign", explanation:"ax + b = c → ax = c − b → x = (c−b)/a."},
    {formula:"Cross-multiplication for fractions: a/b = c/d → ad = bc", explanation:"Used when the equation has fractions."}
  ],
  prerequisite_knowledge:["basic algebraic expressions","inverse operations","fractions"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A linear equation in one variable is a balance — whatever you do to one side, do to the other, and the balance is preserved until x is isolated.",
      hook:"I think of a number, double it, add 7 — the result is 25. What's the number? That's a linear equation: 2x + 7 = 25.",
      real_world_anchors:["age problems","number puzzles","cost-sharing problems","perimeter equations"],
      the_pivot_idea:"Transposition is the power move: move every term with the unknown to one side, every constant to the other, then divide.",
      wrong_intuitions_to_replace:["'When you move a term across =, you do the same operation' — No! You do the INVERSE. +7 becomes −7 on the other side.","'Multiplying both sides by a number changes the equation' — No; both sides must be multiplied by the SAME number."]
    },
    derivation:"3x + 7 = 22. Subtract 7 both sides: 3x = 15. Divide both sides by 3: x = 5. Verify: 3(5)+7 = 22 ✓. Every step uses an inverse operation.",
    worked_example:[
      {problem:"Solve: 5x − 3 = 2x + 9.", steps:["5x − 2x = 9 + 3 (transpose)","3x = 12","x = 4"], answer:"x = 4"},
      {problem:"Solve: (2x+3)/5 = 3.", steps:["Cross-multiply: 2x+3 = 15","2x = 12","x = 6"], answer:"x = 6"}
    ],
    visual_description:"A balance scale with '5x − 3' on left pan and '2x + 9' on right, with arrows showing transposition steps until x = 4 is isolated.",
    svg_diagrams:[{
      id:"cbse_math8_ch13_balance_equation",
      title:"Balance method for solving linear equation",
      svg:`<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <line x1="280" y1="40" x2="280" y2="110" stroke="#333" stroke-width="3"/>
  <line x1="100" y1="110" x2="460" y2="110" stroke="#333" stroke-width="3"/>
  <rect x="60" y="120" width="130" height="50" rx="6" fill="#e8f0fe" stroke="#4285f4" stroke-width="2"/>
  <text x="125" y="148" text-anchor="middle" fill="#4285f4" font-weight="bold">5x − 3</text>
  <rect x="370" y="120" width="130" height="50" rx="6" fill="#fce8e6" stroke="#ea4335" stroke-width="2"/>
  <text x="435" y="148" text-anchor="middle" fill="#ea4335" font-weight="bold">2x + 9</text>
  <text x="280" y="195" text-anchor="middle" fill="#333">Transpose: 5x−2x = 9+3 → 3x = 12 → x = 4</text>
  <circle cx="280" cy="34" r="8" fill="#fbbc04"/>
  <text x="280" y="22" text-anchor="middle" fill="#333" font-weight="bold">Balance Scale</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Transposing +3 means +3 goes to the other side with the same sign", correction:"Transposing changes the sign: +3 becomes −3 on the other side."},
      {wrong_idea:"You can multiply only one term of an equation", correction:"When multiplying to clear fractions, EVERY term on both sides must be multiplied."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Verify by substitution", rule:"After solving, substitute x back into original equation to check both sides are equal", example:"x=4 in 5x−3: 20−3=17; in 2x+9: 8+9=17 ✓", when_to_use:"Always verify when time permits."}
    ],
    when_to_use_this_method:{
      use_this_when:["Any 'find the number' word problem","Equations with one unknown","Perimeter/angle problems with one unknown"],
      use_other_when:["Two unknowns: use simultaneous equations (Class 9 topic)"]
    },
    edge_cases:[
      {case:"Equation with no solution (contradiction)", value:"e.g. 2x + 3 = 2x + 5 → 3 = 5 (false)", reasoning:"The variable cancels and leaves a false statement — no solution.", where_it_appears:"Parallel lines in graphing."},
      {case:"Equation with infinite solutions (identity)", value:"e.g. 2x + 4 = 2(x+2) → 4 = 4 (always true)", reasoning:"Both sides identical — any value of x works.", where_it_appears:"Identities."}
    ],
    key_takeaway:"To solve a linear equation: transpose unknowns to one side, constants to the other (sign changes), then divide. Always verify by substitution.",
    video_script_hooks:{
      opening_hook:"I'm thinking of a number. Triple it, subtract 6 — you get 21. Let me solve that in 10 seconds with one equation.",
      concept_reveal:"An equation is a balance. You can add, subtract, multiply, or divide — as long as you do it to both sides. The balance never tips.",
      common_mistake_moment:"Moving +5 to the other side doesn't keep it +5. It becomes −5. The sign flips on crossing the equals sign.",
      real_world_connection:"Every word problem in physics, chemistry, and economics eventually becomes a linear equation. This is the engine of problem-solving.",
      closing_hook:"One unknown, one equation, one answer. Solve any linear equation in 3 steps: transpose, collect, divide."
    }
  }
},
{
  topicId:"cbse_math8_ch13_linear_inequalities", chapterNumber:13, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Introduction to Inequalities",
  key_formulas:[
    {formula:"If a > b and c > 0, then ac > bc (inequality preserved when multiplying by positive)", explanation:"Multiplying both sides by a positive number keeps the inequality direction."},
    {formula:"If a > b and c < 0, then ac < bc (inequality REVERSES when multiplying by negative)", explanation:"Critical rule: multiplying or dividing by a negative number flips the inequality sign."}
  ],
  prerequisite_knowledge:["comparison of numbers","linear equations","number line"],
  teaching_content:{
    intuition:{
      elevator_pitch:"An inequality describes a range of values rather than a single value — useful whenever there's a minimum, maximum, or boundary condition.",
      hook:"'You must be at least 18 to vote' is x ≥ 18. 'The package weighs less than 5 kg' is w < 5.",
      real_world_anchors:["age restrictions (≥ 18)","speed limits (v ≤ 80 km/h)","minimum marks to pass (marks ≥ 35)","luggage weight limit"],
      the_pivot_idea:"Solve an inequality like an equation — except when you multiply or divide by a negative number, you MUST flip the inequality sign.",
      wrong_intuitions_to_replace:["'Inequalities are solved the same as equations' — Almost! One critical difference: dividing by negative flips the sign.","'x > 3 means x = 4 or x = 5 only' — x > 3 includes ALL numbers greater than 3, including 3.1, 3.001, π, 100…"]
    },
    derivation:"−2x > 6. Divide both sides by −2 (negative → flip sign): x < −3. Check: x = −4 (which is < −3): −2(−4) = 8 > 6 ✓. Correct.",
    worked_example:[
      {problem:"Solve: 3x + 5 > 14. Represent on number line.", steps:["3x > 14 − 5 = 9","x > 3","Number line: open circle at 3, arrow to the right"], answer:"x > 3"},
      {problem:"Solve: −4x ≤ 20.", steps:["Divide by −4 (flip sign): x ≥ −5"], answer:"x ≥ −5"}
    ],
    visual_description:"A number line showing x > 3 with an open circle at 3 and a bold arrow pointing right; next to it, x ≥ −5 with a closed circle at −5 and arrow pointing right.",
    svg_diagrams:[{
      id:"cbse_math8_ch13_number_line_inequality",
      title:"Inequalities represented on a number line",
      svg:`<svg viewBox="0 0 560 160" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <line x1="40" y1="60" x2="520" y2="60" stroke="#333" stroke-width="2"/>
  ${[-2,-1,0,1,2,3,4,5,6].map((n,i)=>`<line x1="${40+i*55}" y1="56" x2="${40+i*55}" y2="64" stroke="#333" stroke-width="1.5"/><text x="${40+i*55}" y="78" text-anchor="middle" fill="#333">${n}</text>`).join("")}
  <circle cx="205" cy="60" r="7" fill="white" stroke="#4285f4" stroke-width="2.5"/>
  <line x1="212" y1="60" x2="510" y2="60" stroke="#4285f4" stroke-width="4"/>
  <text x="40" y="110" fill="#4285f4" font-weight="bold">x &gt; 3 (open circle — 3 not included)</text>
  <line x1="40" y1="130" x2="520" y2="130" stroke="#333" stroke-width="1.5"/>
  <circle cx="150" cy="130" r="7" fill="#34a853" stroke="#34a853" stroke-width="2.5"/>
  <line x1="40" y1="130" x2="157" y2="130" stroke="#34a853" stroke-width="4"/>
  <text x="40" y="155" fill="#34a853" font-weight="bold">x ≥ −5 (filled circle — −5 included)</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Dividing an inequality by a negative keeps the sign the same", correction:"CRITICAL: dividing or multiplying by a negative REVERSES the inequality. −2x > 6 → x < −3, not x > −3."},
      {wrong_idea:"x > 3 means x is an integer > 3", correction:"x > 3 includes ALL real numbers greater than 3 — 3.5, 3.001, 100, etc. Unless 'integer solutions' is specified."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Check with a test value", rule:"After solving, substitute a value from your solution set to verify", example:"x > 3: test x=5 in 3(5)+5=20 > 14 ✓", when_to_use:"Verifying inequality solutions."}
    ],
    when_to_use_this_method:{
      use_this_when:["Finding possible values of an unknown given a constraint","Maximum/minimum problems with a bound","Real-life boundary conditions (speed limit, weight limit)"],
      use_other_when:["Exact single value needed: solve as equation instead"]
    },
    edge_cases:[
      {case:"Multiplying by zero", value:"0 × inequality is 0 = 0 (not useful)", reasoning:"Multiplying by zero loses information; never do this in inequality solving.", where_it_appears:"Common mistake."},
      {case:"Compound inequality a < x < b", value:"Solve each part simultaneously", reasoning:"Both conditions must hold at once: −1 < 2x+1 < 5 → −1 < x < 2.", where_it_appears:"Range problems."}
    ],
    key_takeaway:"Solve inequalities like equations — BUT flip the sign when multiplying or dividing by a negative number. Represent solutions on a number line (open circle for strict, closed for ≤/≥).",
    video_script_hooks:{
      opening_hook:"A luggage limit of 20 kg: w ≤ 20. A minimum age of 18: a ≥ 18. Inequalities are everywhere — they're the boundaries of the real world.",
      concept_reveal:"One rule separates inequalities from equations: multiply/divide by a negative → flip the sign. Everything else is identical.",
      common_mistake_moment:"−2x > 6. Divide both sides by −2 — flip! x < −3. Not x > −3. This mistake loses marks every exam.",
      real_world_connection:"Structural engineers use inequalities for safety margins. Load ≤ maximum safe load. Fail that, and buildings collapse.",
      closing_hook:"Equations find the answer. Inequalities find the range. Both are essential — master both."
    }
  }
},
{
  topicId:"cbse_math8_ch13_algebraic_identities", chapterNumber:13, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Algebraic Identities",
  key_formulas:[
    {formula:"(a+b)² = a² + 2ab + b²", explanation:"Square of a sum: square each term, add twice the product of the terms."},
    {formula:"(a−b)² = a² − 2ab + b²", explanation:"Square of a difference: square each term, subtract twice the product."},
    {formula:"(a+b)(a−b) = a² − b²", explanation:"Difference of two squares: product of sum and difference."},
    {formula:"(x+a)(x+b) = x² + (a+b)x + ab", explanation:"Useful for expanding products of two binomials with common x."}
  ],
  prerequisite_knowledge:["multiplication of polynomials","perfect squares","distributive law"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Algebraic identities are universal truths — they hold for ALL values of the variables, making them shortcuts for expanding and factorising.",
      hook:"103² = (100+3)² = 10000 + 600 + 9 = 10609. Computed in seconds using (a+b)² — no long multiplication.",
      real_world_anchors:["mental math squaring of numbers near 100","area of an L-shaped room as (a+b)²−c²","engineering calculations using (a−b)²"],
      the_pivot_idea:"An identity is a shortcut that works because it's algebraically proved — not just numerically verified. Memorise the 4 standard identities and you can square or multiply any binomial instantly.",
      wrong_intuitions_to_replace:["'(a+b)² = a² + b²' — The deadly middle term 2ab is missing! This is the most common algebra error.","'Identities only work for integers' — They work for any numbers: decimals, fractions, algebraic expressions."]
    },
    derivation:"(a+b)² = (a+b)(a+b). Expand using FOIL: a×a + a×b + b×a + b×b = a² + 2ab + b². The 2ab comes from the two cross-terms.",
    worked_example:[
      {problem:"Expand (3x + 5)².", steps:["(a+b)² with a=3x, b=5","= (3x)² + 2(3x)(5) + 5²","= 9x² + 30x + 25"], answer:"9x² + 30x + 25"},
      {problem:"Find 98² using identity.", steps:["98 = (100−2)","98² = 100² − 2×100×2 + 2²","= 10000 − 400 + 4 = 9604"], answer:"9604"}
    ],
    visual_description:"Geometric proof of (a+b)² = a² + 2ab + b²: a square of side (a+b) divided into 4 parts: a×a square, two a×b rectangles, and b×b square.",
    svg_diagrams:[{
      id:"cbse_math8_ch13_identity_square",
      title:"Geometric proof of (a+b)² = a² + 2ab + b²",
      svg:`<svg viewBox="0 0 560 300" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <rect x="40" y="40" width="260" height="260" fill="none" stroke="#333" stroke-width="2"/>
  <rect x="40" y="40" width="170" height="170" fill="#e8f0fe" stroke="#4285f4" stroke-width="1.5"/>
  <rect x="210" y="40" width="90" height="170" fill="#e6f4ea" stroke="#34a853" stroke-width="1.5"/>
  <rect x="40" y="210" width="170" height="90" fill="#e6f4ea" stroke="#34a853" stroke-width="1.5"/>
  <rect x="210" y="210" width="90" height="90" fill="#fce8e6" stroke="#ea4335" stroke-width="1.5"/>
  <text x="125" y="132" text-anchor="middle" fill="#4285f4" font-weight="bold">a²</text>
  <text x="255" y="132" text-anchor="middle" fill="#34a853" font-weight="bold">ab</text>
  <text x="125" y="262" text-anchor="middle" fill="#34a853" font-weight="bold">ab</text>
  <text x="255" y="262" text-anchor="middle" fill="#ea4335" font-weight="bold">b²</text>
  <text x="125" y="25" text-anchor="middle" fill="#4285f4">a</text>
  <text x="255" y="25" text-anchor="middle" fill="#ea4335">b</text>
  <text x="25" y="132" text-anchor="middle" fill="#4285f4">a</text>
  <text x="25" y="262" text-anchor="middle" fill="#ea4335">b</text>
  <text x="400" y="140" fill="#333" font-weight="bold">(a+b)²</text>
  <text x="400" y="165" fill="#333">= a² + ab + ab + b²</text>
  <text x="400" y="190" fill="#333">= a² + 2ab + b²</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"(a+b)² = a² + b²", correction:"Always include the middle term: (a+b)² = a² + 2ab + b². Missing 2ab is the #1 algebra error."},
      {wrong_idea:"(a+b)(a−b) = a² + b²", correction:"(a+b)(a−b) = a² − b² (difference, not sum). The cross-terms +ab and −ab cancel."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Mental squaring near 100", rule:"n = 100±d → n² = 10000 ± 200d + d²", example:"97² = 10000−600+9 = 9409; 104² = 10000+800+16 = 10816", when_to_use:"Squaring any number close to 100."}
    ],
    when_to_use_this_method:{
      use_this_when:["Expanding perfect square expressions","Mental computation of squares near round numbers","Factorising expressions as difference of squares"],
      use_other_when:["Trinomials not matching these patterns — use standard factorisation methods"]
    },
    edge_cases:[
      {case:"Negative values: (−a+b)²", value:"Same as (b−a)²= b²−2ab+a²", reasoning:"Order in the identity doesn't matter; (a+b)²=(b+a)².", where_it_appears:"Expressions with leading negative term."},
      {case:"a = b in (a−b)²", value:"= 0", reasoning:"(a−a)² = 0 — the square of zero.", where_it_appears:"Verification and special cases."}
    ],
    key_takeaway:"Four standard identities: (a+b)², (a−b)², (a+b)(a−b), (x+a)(x+b). The 2ab middle term is always present in the first two. Use them for mental math and fast factorisation.",
    video_script_hooks:{
      opening_hook:"What's 103²? Most people reach for a calculator. But (100+3)² = 10000 + 600 + 9 = 10609. Done in 3 seconds with one identity.",
      concept_reveal:"(a+b)² geometrically is a big square sliced into 4 parts: a², ab, ab, b². The 2ab is there by geometry — you can't skip it.",
      common_mistake_moment:"(a+b)² = a²+b² is the most common algebra error in India. It's wrong. The 2ab never disappears. Never.",
      real_world_connection:"These identities appear in every branch of physics, engineering, and finance. They're the multiplication tables of algebra.",
      closing_hook:"Four identities. Memorise them. Apply them. They'll follow you from Class 8 to your university entrance exam."
    }
  }
},

// ── Ch14: Mensuration (Area and Perimeter) ────────────────────────────────────
{
  topicId:"cbse_math8_ch14_area_of_rectangle", chapterNumber:14, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Area and Perimeter of Rectangles and Squares",
  key_formulas:[
    {formula:"Rectangle: Area = l × b; Perimeter = 2(l + b)", explanation:"l = length, b = breadth."},
    {formula:"Square: Area = s²; Perimeter = 4s", explanation:"s = side length."}
  ],
  prerequisite_knowledge:["multiplication","basic shapes","units of measurement (cm², m²)"],
  teaching_content:{
    intuition:{
      elevator_pitch:"Area counts the unit squares that fill a shape; perimeter measures the total distance around the boundary.",
      hook:"Tiling a 6 m × 4 m room: area = 24 m² tiles needed. Fencing a 6 m × 4 m garden: perimeter = 20 m of fencing.",
      real_world_anchors:["floor tiling (area)","fencing a garden (perimeter)","painting a wall (area)","picture frame length (perimeter)"],
      the_pivot_idea:"Area is a 2-D measurement (count squares, units = m²). Perimeter is a 1-D measurement (count boundary units, units = m). They're completely different despite describing the same shape.",
      wrong_intuitions_to_replace:["'Larger area means larger perimeter' — A 1×100 rectangle and a 10×10 square both have area 100, but perimeters 202 and 40.","'Perimeter × 2 = Area' — No formula connects them directly without knowing the shape's dimensions."]
    },
    derivation:"Rectangle: divide into l × b unit squares (b rows of l squares). Total = lb. Perimeter: walk the boundary — l + b + l + b = 2(l+b). Square: l = b = s, so Area = s×s = s², Perimeter = 4s.",
    worked_example:[
      {problem:"A rectangle has l = 12 cm, b = 7 cm. Find area and perimeter.", steps:["Area = 12 × 7 = 84 cm²","Perimeter = 2(12+7) = 2×19 = 38 cm"], answer:"Area = 84 cm²; Perimeter = 38 cm"},
      {problem:"A square room has area 144 m². Find perimeter.", steps:["s² = 144 → s = 12 m","Perimeter = 4 × 12 = 48 m"], answer:"48 m"}
    ],
    visual_description:"A rectangle labelled l=12 cm, b=7 cm with a grid of unit squares inside (showing area) and the boundary highlighted in red (showing perimeter).",
    svg_diagrams:[{
      id:"cbse_math8_ch14_rectangle_area",
      title:"Area and perimeter of a rectangle",
      svg:`<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <rect x="60" y="40" width="360" height="140" fill="#e8f0fe" stroke="#ea4335" stroke-width="3"/>
  ${[1,2,3,4,5,6,7,8,9,10,11].map(i=>`<line x1="${60+i*30}" y1="40" x2="${60+i*30}" y2="180" stroke="#9fc0f7" stroke-width="0.8"/>`).join("")}
  ${[1,2,3,4,5,6].map(i=>`<line x1="60" y1="${40+i*20}" x2="420" y2="${40+i*20}" stroke="#9fc0f7" stroke-width="0.8"/>`).join("")}
  <text x="240" y="116" text-anchor="middle" fill="#4285f4" font-size="15" font-weight="bold">Area = 12 × 7 = 84 cm²</text>
  <text x="240" y="200" text-anchor="middle" fill="#333">l = 12 cm</text>
  <text x="430" y="115" fill="#333">b = 7 cm</text>
  <text x="240" y="225" text-anchor="middle" fill="#ea4335" font-weight="bold">Perimeter = 2(12+7) = 38 cm</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Area and perimeter are the same thing", correction:"Area = surface covered (cm²). Perimeter = boundary length (cm). Different units, different meanings."},
      {wrong_idea:"If you know the perimeter, you know the area", correction:"A perimeter of 20 cm could be a 1×9, 2×8, 3×7, 4×6, or 5×5 rectangle — all different areas."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Square from area — take square root", rule:"Area = s² → s = √Area; Perimeter = 4√Area", example:"Area = 81 cm² → s=9 cm → P=36 cm", when_to_use:"Square problems where area is given."}
    ],
    when_to_use_this_method:{
      use_this_when:["Tiling, flooring, carpeting (area)","Fencing, framing, bordering (perimeter)","Any rectangular shape measurement"],
      use_other_when:["Non-rectangular shapes: use triangle, trapezium, or circle formulas"]
    },
    edge_cases:[
      {case:"l = b (square)", value:"Area = s²; all four formulas simplify", reasoning:"Square is a special rectangle.", where_it_appears:"Floor tiles, square rooms."},
      {case:"Decimal dimensions", value:"Multiply decimals carefully", reasoning:"2.5 × 3.6 = 9.0 m² — use correct decimal multiplication.", where_it_appears:"Real measurement problems."}
    ],
    key_takeaway:"Rectangle: Area = lb, Perimeter = 2(l+b). Square: Area = s², Perimeter = 4s. Area is in square units; perimeter is in linear units. Know when to use which.",
    video_script_hooks:{
      opening_hook:"You're painting a wall 8 m wide and 3 m tall. Buy paint for the area (24 m²) but measure the frame for the perimeter. Two different numbers, two different tools.",
      concept_reveal:"Area fills; perimeter bounds. One counts squares inside, one walks the edge outside. Same shape, completely different measurements.",
      common_mistake_moment:"Knowing the perimeter doesn't tell you the area! A 20 cm perimeter rectangle could be 1×9 (area 9) or 5×5 (area 25).",
      real_world_connection:"Architects calculate area for material quantities and perimeter for structural elements like walls and beams.",
      closing_hook:"Two formulas, one rectangle. Area = lb. Perimeter = 2(l+b). Know them cold — they appear in every branch of mathematics."
    }
  }
},
{
  topicId:"cbse_math8_ch14_area_of_triangle", chapterNumber:14, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Area of a Triangle",
  key_formulas:[
    {formula:"Area = ½ × base × height", explanation:"Height must be perpendicular to the base."},
    {formula:"Heron's formula: Area = √(s(s−a)(s−b)(s−c)) where s = (a+b+c)/2", explanation:"When all three sides are known but height is not."}
  ],
  prerequisite_knowledge:["area of rectangle","perpendicular height","square roots (for Heron's formula)"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A triangle is exactly half a rectangle with the same base and height — that's why the formula has ½.",
      hook:"Any triangle can be enclosed in a rectangle. The triangle is always exactly half the rectangle's area.",
      real_world_anchors:["triangular plot of land","gable roof area","sail area on a boat","yield from a triangular farm field"],
      the_pivot_idea:"The height must be perpendicular to the chosen base — not a slant side. For obtuse triangles, the perpendicular height falls outside the triangle.",
      wrong_intuitions_to_replace:["'Height = any side of the triangle' — Height is the perpendicular distance from the vertex to the base (or its extension).","'Heron's formula needs the height' — Heron's formula works with just the three sides."]
    },
    derivation:"Enclose triangle in rectangle of width = base, height = perpendicular height. The two triangles outside the given triangle together equal the given triangle → Area = ½ × b × h.",
    worked_example:[
      {problem:"A triangle has base 10 cm and perpendicular height 6 cm. Find area.", steps:["Area = ½ × 10 × 6 = 30 cm²"], answer:"30 cm²"},
      {problem:"Find area of triangle with sides 5, 12, 13 cm.", steps:["s = (5+12+13)/2 = 15","Area = √(15×10×3×2) = √900 = 30 cm²"], answer:"30 cm²"}
    ],
    visual_description:"A triangle inside a rectangle, with shaded areas showing the two corner right triangles outside the main triangle, demonstrating Area = ½ × base × height.",
    svg_diagrams:[{
      id:"cbse_math8_ch14_triangle_rectangle",
      title:"Triangle as half of an enclosing rectangle",
      svg:`<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <rect x="60" y="40" width="300" height="160" fill="#fce8e6" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="6,4"/>
  <polygon points="60,200 360,200 200,40" fill="#e8f0fe" stroke="#4285f4" stroke-width="2.5"/>
  <line x1="200" y1="40" x2="200" y2="200" stroke="#34a853" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="205" y="125" fill="#34a853">h = 160</text>
  <text x="210" y="218" fill="#333">base = 300</text>
  <text x="80" y="125" fill="#ea4335" font-size="11">½ of</text>
  <text x="66" y="140" fill="#ea4335" font-size="11">rectangle</text>
  <text x="185" y="135" fill="#4285f4" font-weight="bold">△</text>
  <text x="360" y="125" fill="#ea4335" font-size="11">½ of</text>
  <text x="355" y="140" fill="#ea4335" font-size="11">rectangle</text>
  <text x="210" y="20" fill="#333" font-weight="bold">Area △ = ½ × base × height</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Height = a slant side of the triangle", correction:"Height is the perpendicular from a vertex to the opposite side (base). It's always at 90°."},
      {wrong_idea:"Heron's formula requires knowing the height", correction:"Heron's formula uses only the three sides: s=(a+b+c)/2; Area=√(s(s−a)(s−b)(s−c))."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Right triangle: legs are base and height", rule:"For a right-angled triangle, the two legs are the base and height", example:"Right triangle with legs 8, 6: Area = ½×8×6 = 24 cm²", when_to_use:"Right triangles — no need to compute separate height."}
    ],
    when_to_use_this_method:{
      use_this_when:["Base and perpendicular height known: use ½bh","All three sides known, height unknown: use Heron's formula","Right triangle: use ½ × leg₁ × leg₂"],
      use_other_when:["Irregular polygons: decompose into triangles, sum the areas"]
    },
    edge_cases:[
      {case:"Obtuse triangle", value:"Height falls outside the triangle", reasoning:"The perpendicular from vertex may not land on the base segment — extend the base.", where_it_appears:"Obtuse triangles in geometry."},
      {case:"Degenerate triangle (collinear points)", value:"Area = 0", reasoning:"Three collinear points form a line, not a triangle — Heron's formula gives 0.", where_it_appears:"Check for valid triangle: a+b > c for all combinations."}
    ],
    key_takeaway:"Area of triangle = ½ × base × height (height ⊥ base). For three sides: Heron's formula. Right triangle: use the two legs directly.",
    video_script_hooks:{
      opening_hook:"Take any triangle and enclose it in a rectangle. The triangle is exactly half. Every time. That's why the formula is ½.",
      concept_reveal:"The height must be perpendicular — 90° — to the base. A slant side is never the height unless the triangle is right-angled and you pick the right sides.",
      common_mistake_moment:"Using a slant side as the height is the most common triangle area error. Always check: is it perpendicular to the base?",
      real_world_connection:"Land surveyors calculate irregular plot areas by dividing them into triangles. Engineers compute truss forces using triangle geometry.",
      closing_hook:"½ × base × height — the most used area formula after the rectangle. Know it, trust it, apply it."
    }
  }
},
{
  topicId:"cbse_math8_ch14_area_of_trapezium", chapterNumber:14, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Area of Trapezium and Parallelogram",
  key_formulas:[
    {formula:"Trapezium: Area = ½ × (a + b) × h", explanation:"a, b = parallel sides (bases); h = perpendicular height between them."},
    {formula:"Parallelogram: Area = base × height", explanation:"Base = any side; height = perpendicular distance to opposite side."}
  ],
  prerequisite_knowledge:["area of rectangle and triangle","parallel lines","perpendicular height"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A trapezium is a shape with two parallel sides — its area is the average of the two parallel sides times the height.",
      hook:"Two walls of different heights connected by a sloping roof — the cross-section is a trapezium. Area = average height × width.",
      real_world_anchors:["embankment cross-sections (road construction)","window pane shapes","trapezoidal fields","parallelogram-shaped tiles"],
      the_pivot_idea:"Trapezium = average of the two parallel sides × height. This works because you're finding the area of a rectangle with the average width.",
      wrong_intuitions_to_replace:["'Use any side as height' — height must be perpendicular to both parallel sides.","'Parallelogram area = base × slant side' — use the perpendicular height, not the slant side."]
    },
    derivation:"Trapezium: divide into a rectangle (width = b, height = h) and triangle (base = a−b, height = h): Area = bh + ½(a−b)h = h(b + ½a − ½b) = ½(a+b)h. Or: duplicate the trapezium, flip it, and join — forms a parallelogram with base (a+b) and height h; Area of one trapezium = ½(a+b)h.",
    worked_example:[
      {problem:"Trapezium with parallel sides 8 cm and 5 cm, height 6 cm.", steps:["Area = ½ × (8+5) × 6 = ½ × 13 × 6 = 39 cm²"], answer:"39 cm²"},
      {problem:"Parallelogram: base 10 cm, perpendicular height 7 cm.", steps:["Area = 10 × 7 = 70 cm²"], answer:"70 cm²"}
    ],
    visual_description:"A trapezium with parallel sides a=8 and b=5 and height h=6 labelled, next to a rectangle showing the 'average width' (a+b)/2 = 6.5 interpretation.",
    svg_diagrams:[{
      id:"cbse_math8_ch14_trapezium_area",
      title:"Area of trapezium: ½(a+b)h",
      svg:`<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <polygon points="100,180 340,180 300,60 140,60" fill="#e8f0fe" stroke="#4285f4" stroke-width="2.5"/>
  <line x1="200" y1="60" x2="200" y2="180" stroke="#34a853" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="205" y="125" fill="#34a853">h = 6</text>
  <text x="220" y="195" fill="#333">b = 8 cm (bottom)</text>
  <text x="185" y="52" fill="#333">a = 5 cm (top)</text>
  <text x="100" y="228" fill="#4285f4" font-weight="bold">Area = ½(5+8)×6 = ½×13×6 = 39 cm²</text>
  <polygon points="380,180 500,180 480,60 360,60" fill="#e6f4ea" stroke="#34a853" stroke-width="2.5"/>
  <line x1="440" y1="60" x2="380" y2="60" stroke="#ea4335" stroke-width="0"/>
  <text x="440" y="130" text-anchor="middle" fill="#34a853" font-size="11">Parallelogram</text>
  <text x="440" y="148" text-anchor="middle" fill="#34a853" font-size="11">A = base × h</text>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Area of trapezium = (a+b) × h (forgot the ½)", correction:"The formula is ½ × (a+b) × h. The ½ comes from the triangle half of the derivation."},
      {wrong_idea:"Parallelogram area = base × slant side", correction:"Must use the perpendicular height, not the slant side. Area = base × h⊥."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Trapezium as average × height", rule:"Average of the two parallel sides = (a+b)/2; multiply by height", example:"Sides 8, 5: average = 6.5; area = 6.5 × 6 = 39 cm²", when_to_use:"Mental calculation shortcut."}
    ],
    when_to_use_this_method:{
      use_this_when:["Shapes with exactly one pair of parallel sides (trapezium)","Shapes with two pairs of parallel sides (parallelogram)","Cross-sectional area of embankments, channels"],
      use_other_when:["Irregular quadrilaterals with no parallel sides: divide into triangles"]
    },
    edge_cases:[
      {case:"Isosceles trapezium", value:"Same formula; just note both non-parallel sides are equal", reasoning:"Formula only needs parallel sides and height; non-parallel side equality is irrelevant for area.", where_it_appears:"Symmetric designs and bridges."},
      {case:"Parallelogram with h = side (rectangle)", value:"Area = base × side = same as rectangle", reasoning:"Rectangle is a special parallelogram with perpendicular sides.", where_it_appears:"Verification of rectangle formula."}
    ],
    key_takeaway:"Trapezium: Area = ½(a+b)h where a,b are parallel sides and h is the perpendicular height. Parallelogram: Area = base × perpendicular height. Both require the perpendicular height.",
    video_script_hooks:{
      opening_hook:"Road embankments have a trapezoidal cross-section. Engineers calculate soil volume by multiplying trapezium area by length. One formula, massive projects.",
      concept_reveal:"The ½ in the trapezium formula comes from the same place as the triangle formula — you're always averaging in some sense.",
      common_mistake_moment:"Parallelogram area is NOT base × slant side. The slant side is longer than the height — using it gives a wrong (too large) area.",
      real_world_connection:"Canal and irrigation channel cross-sections are trapezoidal — engineers use this formula daily to calculate water flow rates.",
      closing_hook:"Trapezium: ½(a+b)h. Parallelogram: base×h. Two shapes, two formulas — both need the perpendicular height."
    }
  }
},
{
  topicId:"cbse_math8_ch14_area_of_circle", chapterNumber:14, subject:"Mathematics", grade:"8", examBoard:"CBSE", name:"Area and Circumference of a Circle",
  key_formulas:[
    {formula:"Circumference = 2πr = πd", explanation:"r = radius, d = diameter; π ≈ 3.14 or 22/7."},
    {formula:"Area = πr²", explanation:"Area enclosed by the circle; r = radius."}
  ],
  prerequisite_knowledge:["radius and diameter","π (pi)","squares and square roots","basic multiplication"],
  teaching_content:{
    intuition:{
      elevator_pitch:"A circle's circumference is the distance around it; its area is the space inside — both calculated from just the radius using π.",
      hook:"A circular running track of radius 50 m: one full lap = 2π×50 ≈ 314 m. The grass inside = π×50² ≈ 7,854 m².",
      real_world_anchors:["circular running tracks (circumference)","pizza area (circle area)","wheel diameter and distance covered","circular swimming pools"],
      the_pivot_idea:"π (pi ≈ 3.14159…) is the ratio of any circle's circumference to its diameter — a universal constant that connects the circle's linear and area measurements.",
      wrong_intuitions_to_replace:["'Circumference = 2r' — Missing π: C = 2πr.","'Area = 2πr' — That's circumference! Area = πr² (radius squared, times π)."]
    },
    derivation:"Divide circle into many thin sectors (like pizza slices). Rearrange into a near-rectangle: width = half circumference = πr, height = r. Area = πr × r = πr².",
    worked_example:[
      {problem:"A circle has radius 7 cm. Find circumference and area. (use π = 22/7)", steps:["Circumference = 2 × 22/7 × 7 = 2 × 22 = 44 cm","Area = 22/7 × 7² = 22/7 × 49 = 22 × 7 = 154 cm²"], answer:"C = 44 cm; Area = 154 cm²"},
      {problem:"Diameter = 14 m. Find area.", steps:["r = 14/2 = 7 m","Area = π × 7² = 22/7 × 49 = 154 m²"], answer:"154 m²"}
    ],
    visual_description:"A circle with radius 7 cm labelled, circumference shown as an 'unrolled' string of length 44 cm, and a sector rearrangement showing Area = πr×r = πr².",
    svg_diagrams:[{
      id:"cbse_math8_ch14_circle_area",
      title:"Circle area derivation via sector rearrangement",
      svg:`<svg viewBox="0 0 560 260" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">
  <circle cx="120" cy="120" r="90" fill="#e8f0fe" stroke="#4285f4" stroke-width="2.5"/>
  <line x1="120" y1="120" x2="210" y2="120" stroke="#ea4335" stroke-width="2"/>
  <text x="165" y="112" text-anchor="middle" fill="#ea4335" font-weight="bold">r = 7</text>
  <text x="120" y="235" text-anchor="middle" fill="#4285f4">C = 2πr = 44 cm</text>
  <text x="120" y="255" text-anchor="middle" fill="#4285f4">A = πr² = 154 cm²</text>
  <g transform="translate(290,80)">
    ${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4; const a2=(i+1)*Math.PI/4; return `<polygon points="0,0 ${Math.cos(a)*70},${Math.sin(a)*70} ${Math.cos(a2)*70},${Math.sin(a2)*70}" fill="${i%2===0?'#e8f0fe':'#e6f4ea'}" stroke="${i%2===0?'#4285f4':'#34a853'}" stroke-width="1"/>`}).join("")}
    <text x="0" y="100" text-anchor="middle" fill="#333" font-size="11">Sectors rearranged</text>
    <text x="0" y="115" text-anchor="middle" fill="#333" font-size="11">→ near-rectangle</text>
    <text x="0" y="130" text-anchor="middle" fill="#333" font-size="11">Area = πr × r = πr²</text>
  </g>
</svg>`
    }],
    common_misconceptions:[
      {wrong_idea:"Area = 2πr (same as circumference formula)", correction:"Circumference = 2πr (linear, cm). Area = πr² (square, cm²). They're completely different."},
      {wrong_idea:"π = 3.14 exactly", correction:"π = 3.14159265… (infinite decimal). Use 22/7 or 3.14 as an approximation when instructed."}
    ],
    shortcuts_and_tricks:[
      {shortcut:"Radius 7 is magic with 22/7", rule:"If r = 7 or a multiple of 7, use π = 22/7 for clean answers", example:"r=7: A = 22/7×49 = 154 (integer answer)", when_to_use:"Exam problems with r = 7, 14, 21, 3.5, etc."}
    ],
    when_to_use_this_method:{
      use_this_when:["Circular or semicircular shapes","Problems involving rings (area = πR² − πr²)","Track perimeter problems (add straight sections to circumference)"],
      use_other_when:["Ellipses — area = πab (different formula); not covered in Class 8"]
    },
    edge_cases:[
      {case:"Semicircle", value:"Area = πr²/2; Perimeter = πr + 2r", reasoning:"Half the area; boundary = half circumference + diameter.", where_it_appears:"Semicircular windows, protractors."},
      {case:"Annulus (ring) area", value:"π(R² − r²) = π(R+r)(R−r)", reasoning:"Subtract inner circle area from outer; simplifies using difference of squares identity.", where_it_appears:"Pipe cross-sections, washers."}
    ],
    key_takeaway:"Circle: Circumference = 2πr; Area = πr². Remember: circumference is linear (cm), area is square (cm²). Use π = 22/7 when radius is a multiple of 7.",
    video_script_hooks:{
      opening_hook:"A car wheel of radius 35 cm: one rotation covers 2π×35 = 220 cm = 2.2 m. At 60 km/h, how many rotations per second? Circle circumference is the key.",
      concept_reveal:"Unroll a circle like an orange peel — the circumference is 2πr. Stack the thin sectors — the area is πr×r = πr².",
      common_mistake_moment:"Area = 2πr — wrong! That's circumference. Area = πr². One has r, one has r². The squares matter.",
      real_world_connection:"Pizza pricing: is an 18-inch pizza really 4 times an 9-inch? Area scales as r² — the 18-inch is 4 times the 9-inch. Use πr² to verify.",
      closing_hook:"Two formulas, one shape, one constant. C = 2πr. A = πr². π connects them all."
    }
  }
},

];

const toSchema = (t) => ({
  topicId: t.topicId,
  chapterNumber: t.chapterNumber,
  subject: t.subject || "Mathematics",
  grade: t.grade || "8",
  examBoard: t.examBoard || "CBSE",
  name: t.name,
  key_formulas: t.key_formulas || [],
  prerequisite_knowledge: t.prerequisite_knowledge || [],
  teaching_content: t.teaching_content || {},
});

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  // Guard: skip any undefined/malformed entries (debug trace them)
  const valid = topics.filter((t, i) => {
    if (!t || typeof t !== "object" || !t.topicId) {
      console.warn(`⚠ Skipping invalid entry at index ${i}:`, JSON.stringify(t)?.slice(0, 80));
      return false;
    }
    return true;
  });
  console.log(`Seeding ${valid.length} CBSE Math 8 topics (${topics.length - valid.length} skipped) …`);
  for (const t of valid) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: t.topicId },
      { $set: toSchema(t) },
      { upsert: true, new: true }
    );
  }
  console.log(`✅  Seeded ${valid.length} topics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
