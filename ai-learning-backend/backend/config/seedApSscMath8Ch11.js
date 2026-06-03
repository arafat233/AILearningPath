/**
 * AP SSC Class 8 Mathematics — Chapter 11: Mensuration
 * 4 topics. topicId: ap_ssc_math8_ch11_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch11.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch11_area_trapezium_polygon",
    subject: "Mathematics",
    chapterNumber: 11,
    name: "Area of Trapezium, Quadrilateral and Polygons",
    prerequisite_knowledge: [
      "Area of rectangle (l×b) and triangle (½×b×h)",
      "Parallel sides and perpendicular height",
      "Diagonals of a quadrilateral",
      "Splitting a shape into simpler shapes",
    ],
    key_formulas: [
      "Area of trapezium = ½ × (sum of parallel sides) × height = ½(a + b)h",
      "Area of general quadrilateral = ½ × d × (h₁ + h₂)  (d = diagonal, h's = perpendiculars)",
      "Area of rhombus = ½ × d₁ × d₂  (product of diagonals)",
      "Area of any polygon = sum of areas of the triangles/trapeziums it splits into",
    ],
    teaching_content: {
      intuition: "Every area formula here comes from the same idea: chop a complicated shape into triangles and rectangles whose areas you already know, then add. A trapezium is two triangles (or a rectangle plus triangles); a general quadrilateral splits along a diagonal into two triangles. Master 'split and sum' and you can find the area of any straight-sided figure.",
      derivation: "Trapezium: a trapezium with parallel sides a and b and height h can be split by a diagonal into two triangles of the same height h, with bases a and b. Their areas are ½ah and ½bh, so total = ½h(a+b). \nGeneral quadrilateral: draw a diagonal d; it makes two triangles whose heights from the diagonal are h₁ and h₂. Area = ½d·h₁ + ½d·h₂ = ½d(h₁+h₂). \nRhombus: its diagonals are perpendicular and bisect each other, giving area ½d₁d₂ (a special case of the quadrilateral formula).",
      worked_example: "Find the area of a trapezium with parallel sides 12 cm and 8 cm, and height 5 cm. Also a rhombus with diagonals 10 cm and 6 cm.\n\nTrapezium = ½(a+b)h = ½(12+8)(5) = ½(20)(5) = 50 cm².\nRhombus = ½ d₁ d₂ = ½(10)(6) = 30 cm².",
      visual_description: "A trapezium with parallel sides labelled a (top) and b (bottom), a dashed perpendicular height h, and a diagonal splitting it into two triangles. Beside it, a rhombus with its two perpendicular diagonals d₁, d₂.",
      svg_diagrams: [
        { title: "Trapezium area = ½(a+b)h",
          svg_code: "<svg viewBox='0 0 200 110' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><polygon points='40,80 160,80 130,30 70,30' fill='#dbeafe' stroke='#2563eb'/><text x='90' y='25'>a</text><text x='95' y='95'>b</text><line x1='70' y1='30' x2='70' y2='80' stroke='#dc2626' stroke-dasharray='3 2'/><text x='52' y='58' fill='#dc2626'>h</text><text x='30' y='108' fill='#16a34a' font-size='9'>Area = ½(a+b)h</text></svg>" }
      ],
      common_misconceptions: [
        "Using a slant side as the height — height must be PERPENDICULAR to the parallel sides.",
        "Forgetting the ½ in the trapezium and rhombus formulas.",
        "Adding the parallel sides but not multiplying by height (or vice versa).",
        "Using the rhombus ½d₁d₂ formula for a non-rhombus quadrilateral.",
      ],
      shortcuts_and_tricks: [
        "Trapezium = average of parallel sides × height = ((a+b)/2)·h.",
        "Any quadrilateral: drop perpendiculars onto a diagonal and use ½d(h₁+h₂).",
        "Split awkward polygons into rectangles + triangles, compute each, then add.",
      ],
      when_to_use_this_method: "Use these formulas for areas of trapeziums, rhombuses and general quadrilaterals, and the split-and-sum method for irregular polygons and composite field/plot problems.",
      edge_cases: [
        "A parallelogram is a trapezium with both pairs parallel; its area is base × height.",
        "If only side lengths (no height) are given, you may need extra info or to split differently.",
        "Units: area is always in SQUARE units (cm², m²).",
      ],
      key_takeaway: "Find areas by splitting into known shapes. Trapezium = ½(a+b)h (average of parallel sides × height); rhombus = ½d₁d₂; general quadrilateral = ½d(h₁+h₂). Always use the PERPENDICULAR height, keep the ½, and answer in square units.",
      video_script_hooks: [
        "Opening: 'How do you find the area of a field shaped like a trapezium? Split it into triangles you already know.'",
        "Mid: 'The trapezium formula is just the average of the two parallel sides, times the height between them.'",
        "Closing: 'The height must be perpendicular — measure straight across, never along a slant.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch11_surface_area_cuboid_cube",
    subject: "Mathematics",
    chapterNumber: 11,
    name: "Surface Area of Cuboid and Cube",
    prerequisite_knowledge: [
      "Area of a rectangle and a square",
      "Faces of a cuboid and a cube",
      "Nets of solids (a cuboid unfolds into 6 rectangles)",
      "Length, breadth, height",
    ],
    key_formulas: [
      "Total surface area of cuboid = 2(lb + bh + hl)",
      "Lateral surface area of cuboid = 2h(l + b)  (4 side faces, excludes top & bottom)",
      "Total surface area of cube = 6a²",
      "Lateral surface area of cube = 4a²",
    ],
    teaching_content: {
      intuition: "Surface area is the total area of wrapping paper needed to cover a solid — the sum of all its faces. Unfold a cuboid (its net) and you see six rectangles in three matching pairs; add them up. For a cube all six faces are identical squares, so it's just 6a². 'Lateral' surface area means the SIDE walls only (no top/bottom) — useful for things like painting the walls of a room.",
      derivation: "A cuboid has 3 pairs of identical rectangular faces: two l×b (top/bottom), two b×h (front/back), two h×l (sides). Total = 2lb + 2bh + 2hl = 2(lb + bh + hl). \nLateral (4 side walls, no top/bottom) = 2bh + 2hl = 2h(l + b). \nFor a cube every face is a×a, six of them: 6a²; lateral (4 walls) = 4a².",
      worked_example: "A cuboid box is 8 cm × 5 cm × 3 cm. Find its total surface area. Also a cube of side 4 cm.\n\nCuboid TSA = 2(lb + bh + hl) = 2(8·5 + 5·3 + 3·8) = 2(40 + 15 + 24) = 2(79) = 158 cm².\nCube TSA = 6a² = 6(4²) = 6(16) = 96 cm².",
      visual_description: "A cuboid unfolded into its net: 6 rectangles arranged in a cross, with the three pairs (l×b, b×h, h×l) colour-matched, illustrating why TSA = 2(lb+bh+hl).",
      svg_diagrams: [
        { title: "Cuboid net → TSA = 2(lb + bh + hl)",
          svg_code: "<svg viewBox='0 0 200 140' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><rect x='70' y='10' width='50' height='30' fill='#bfdbfe' stroke='#333'/><rect x='70' y='40' width='50' height='50' fill='#fde68a' stroke='#333'/><rect x='20' y='40' width='50' height='50' fill='#fecaca' stroke='#333'/><rect x='120' y='40' width='50' height='50' fill='#fecaca' stroke='#333'/><rect x='70' y='90' width='50' height='30' fill='#bfdbfe' stroke='#333'/><rect x='70' y='120' width='50' height='20' fill='#fde68a' stroke='#333'/><text x='85' y='30'>l×b</text><text x='85' y='70'>b×h</text></svg>" }
      ],
      common_misconceptions: [
        "Using only 3 faces instead of all 6 (forgetting the matching pairs).",
        "Confusing total surface area with lateral (which excludes top and bottom).",
        "Mixing up volume (l×b×h) with surface area.",
        "Using cube formula 6a² for a cuboid (its faces aren't all equal).",
      ],
      shortcuts_and_tricks: [
        "Cuboid TSA: compute the three products lb, bh, hl, add, then double.",
        "Lateral SA = perimeter of base × height = 2(l+b)·h — handy for 'walls only' problems.",
        "Cube is the special cuboid with l=b=h=a → TSA 6a², LSA 4a².",
      ],
      when_to_use_this_method: "Use surface area for 'how much paint/paper/material to cover' problems; use LATERAL surface area when top and/or bottom are open (rooms, tanks, pipes).",
      edge_cases: [
        "Open box (no lid): subtract one l×b face from the total.",
        "Room to paint (4 walls + ceiling, not floor): lateral SA + one l×b.",
        "Units: surface area in square units (cm², m²).",
      ],
      key_takeaway: "Surface area = sum of all face areas. Cuboid TSA = 2(lb+bh+hl), lateral = 2h(l+b); cube TSA = 6a², lateral = 4a². Use total for fully covering, lateral for walls-only; subtract faces for open boxes.",
      video_script_hooks: [
        "Opening: 'How much wrapping paper for this box? That's its surface area — add up all six faces.'",
        "Mid: 'Unfold the box flat and you see three matching pairs of rectangles. That's where 2(lb+bh+hl) comes from.'",
        "Closing: 'Painting only the walls? Use LATERAL surface area — skip the top and bottom.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch11_surface_area_cylinder",
    subject: "Mathematics",
    chapterNumber: 11,
    name: "Surface Area of a Cylinder",
    prerequisite_knowledge: [
      "Circumference (2πr) and area (πr²) of a circle",
      "Net of a cylinder (2 circles + 1 rectangle)",
      "Radius and height of a cylinder",
      "Value of π ≈ 22/7 or 3.14",
    ],
    key_formulas: [
      "Curved (lateral) surface area of cylinder = 2πrh",
      "Area of each circular end = πr²; two ends = 2πr²",
      "Total surface area = 2πrh + 2πr² = 2πr(h + r)",
    ],
    teaching_content: {
      intuition: "Unroll the curved side of a cylinder (like peeling the label off a tin) and it becomes a RECTANGLE: its height is the cylinder's height h, and its width is the circle's circumference 2πr. So the curved surface is just 2πr × h. Add the two circular caps (each πr²) for the total. A cylinder = a rolled-up rectangle plus two lids.",
      derivation: "Curved surface: unrolling the side gives a rectangle of width = circumference = 2πr and height = h, so curved SA = 2πr·h = 2πrh. \nThe two flat circular ends each have area πr², together 2πr². \nTotal surface area = curved + ends = 2πrh + 2πr² = 2πr(h + r). For an OPEN cylinder (pipe, no lids) use only the curved 2πrh.",
      worked_example: "A cylindrical tin has radius 7 cm and height 10 cm. Find its curved and total surface area (π = 22/7).\n\nCurved SA = 2πrh = 2 × (22/7) × 7 × 10 = 2 × 22 × 10 = 440 cm².\nTotal SA = 2πr(h+r) = 2 × (22/7) × 7 × (10+7) = 2 × 22 × 17 = 748 cm².",
      visual_description: "A cylinder with its label unrolled to the side as a rectangle of height h and width 2πr, plus the two circular caps shown separately, illustrating TSA = 2πrh + 2πr².",
      svg_diagrams: [
        { title: "Cylinder unrolled: curved SA = 2πrh",
          svg_code: "<svg viewBox='0 0 220 110' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><ellipse cx='40' cy='20' rx='25' ry='8' fill='#dbeafe' stroke='#2563eb'/><rect x='15' y='20' width='50' height='60' fill='#bfdbfe' stroke='#2563eb'/><ellipse cx='40' cy='80' rx='25' ry='8' fill='#dbeafe' stroke='#2563eb'/><rect x='110' y='25' width='90' height='55' fill='#fde68a' stroke='#d97706'/><text x='120' y='95' font-size='8'>width = 2πr</text><text x='205' y='55' font-size='8'>h</text></svg>" }
      ],
      common_misconceptions: [
        "Forgetting the two circular ends in TOTAL surface area.",
        "Using πr² (area) where 2πr (circumference) belongs in the curved formula.",
        "Including both ends for an OPEN pipe (it has none) or one end for a cup.",
        "Mixing radius and diameter (radius = diameter ÷ 2).",
      ],
      shortcuts_and_tricks: [
        "Curved SA = circumference × height = 2πr·h (the unrolled rectangle).",
        "TSA = 2πr(h + r) — factor out 2πr to compute in one step.",
        "Pick π = 22/7 when the radius is a multiple of 7 for clean numbers.",
      ],
      when_to_use_this_method: "Use curved SA for labels/pipes (open), total SA for closed tins/tanks, and adjust for cups/open cylinders by counting only the ends that exist.",
      edge_cases: [
        "Open pipe: curved SA only (2πrh, no ends).",
        "Cup/open tin: 2πrh + ONE end (πr²).",
        "If diameter is given, halve it to get r before substituting.",
      ],
      key_takeaway: "Unrolling a cylinder's side gives a rectangle 2πr by h, so curved SA = 2πrh; the two caps add 2πr², giving total SA = 2πr(h+r). Use curved-only for open pipes; count just the ends that physically exist.",
      video_script_hooks: [
        "Opening: 'Peel the label off a tin and lay it flat — it's a rectangle. That's the cylinder's curved surface area.'",
        "Mid: 'The rectangle's width is the circle's circumference, 2πr. Times the height h gives 2πrh.'",
        "Closing: 'A pipe has no lids — use curved area only. A closed tin needs both caps added.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch11_volume",
    subject: "Mathematics",
    chapterNumber: 11,
    name: "Volume of Cuboid, Cube and Cylinder",
    prerequisite_knowledge: [
      "Area of rectangle and circle",
      "Meaning of volume (space occupied, cubic units)",
      "Surface area (for contrast)",
      "Capacity units (1 litre = 1000 cm³ = 1000 mL)",
    ],
    key_formulas: [
      "Volume of cuboid = l × b × h",
      "Volume of cube = a³",
      "Volume of cylinder = πr²h  (base area × height)",
      "Capacity: 1 cm³ = 1 mL, 1000 cm³ = 1 litre, 1 m³ = 1000 litres",
    ],
    teaching_content: {
      intuition: "Volume is how much SPACE a solid fills — how many unit cubes fit inside. Every 'prism-like' solid (cuboid, cube, cylinder) follows one master rule: volume = area of the base × height. For a cuboid the base is l×b; for a cylinder the base is the circle πr². Surface area is the wrapping; volume is the filling.",
      derivation: "Cuboid: stack a base layer of l×b unit cubes, h layers high → l·b·h cubes = lbh. \nCube: special cuboid l=b=h=a → a³. \nCylinder: 'base area × height' with a circular base of area πr² → πr²h. \nThe unifying principle for any uniform cross-section solid (prism/cylinder): Volume = (area of cross-section) × (length/height).",
      worked_example: "Find the volume of a cuboid 10 cm × 4 cm × 5 cm and a cylinder of radius 7 cm, height 10 cm (π = 22/7). Convert the cuboid's volume to litres.\n\nCuboid = lbh = 10×4×5 = 200 cm³ = 200/1000 = 0.2 litre.\nCylinder = πr²h = (22/7)×7²×10 = (22/7)×49×10 = 22×7×10 = 1540 cm³.",
      visual_description: "A cuboid filled with a grid of unit cubes (base layer l×b, stacked h high), beside a cylinder shown as stacked circular disks of area πr² up to height h.",
      svg_diagrams: [
        { title: "Volume = base area × height",
          svg_code: "<svg viewBox='0 0 220 110' xmlns='font-family=sans-serif' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><rect x='20' y='40' width='70' height='50' fill='none' stroke='#2563eb'/><rect x='40' y='20' width='70' height='50' fill='none' stroke='#2563eb'/><line x1='20' y1='40' x2='40' y2='20' stroke='#2563eb'/><line x1='90' y1='40' x2='110' y2='20' stroke='#2563eb'/><line x1='90' y1='90' x2='110' y2='70' stroke='#2563eb'/><text x='25' y='105' font-size='8'>V = l·b·h</text><ellipse cx='170' cy='30' rx='25' ry='8' fill='#dbeafe' stroke='#16a34a'/><rect x='145' y='30' width='50' height='55' fill='#bfdbfe' stroke='#16a34a'/><ellipse cx='170' cy='85' rx='25' ry='8' fill='#dbeafe' stroke='#16a34a'/><text x='150' y='105' font-size='8'>V = πr²h</text></svg>" }
      ],
      common_misconceptions: [
        "Confusing volume (cubic units) with surface area (square units).",
        "Using diameter instead of radius in πr²h.",
        "Forgetting volume uses CUBIC units (cm³, m³).",
        "Wrong capacity conversion (1 litre = 1000 cm³, not 100).",
      ],
      shortcuts_and_tricks: [
        "All three: Volume = base area × height. (Cuboid base lb, cube a², cylinder πr².)",
        "1000 cm³ = 1 litre; 1 m³ = 1000 litres — for capacity questions.",
        "Pick π = 22/7 when r is a multiple of 7.",
      ],
      when_to_use_this_method: "Use volume for capacity / 'how much it holds or fills' problems (tanks, boxes, pipes), and the base-area×height rule for any prism or cylinder.",
      edge_cases: [
        "Hollow pipe volume = π(R² − r²)h (outer minus inner) — beyond basic but worth knowing.",
        "Same volume, different surface area: a cube minimises surface area for a given volume among cuboids.",
        "Always match units (convert cm to m) before multiplying.",
      ],
      key_takeaway: "Volume = base area × height for cuboid (lbh), cube (a³) and cylinder (πr²h), measured in cubic units. Capacity links via 1000 cm³ = 1 litre. Don't confuse it with surface area, and always use the radius (not diameter) for cylinders.",
      video_script_hooks: [
        "Opening: 'Surface area is the wrapping paper; volume is what fits inside. How many unit cubes pack into this box?'",
        "Mid: 'One rule rules them all: volume = base area times height. The base is a rectangle, a square, or a circle.'",
        "Closing: '1000 cubic centimetres make one litre — that's how a volume becomes a capacity.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch11 (Mensuration): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
