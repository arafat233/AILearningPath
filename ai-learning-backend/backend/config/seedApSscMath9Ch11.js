/**
 * AP SSC Class 9 Mathematics — Chapter 11: Surface Areas and Volumes
 * 2 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch11.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     11-A  Surface Area of Solids
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch11_surface_area_solids",
    subject: "Mathematics",
    chapterNumber: 11,
    name: "Surface Area of Solids",
    prerequisite_knowledge: [
      "Area formulae for rectangles, circles, triangles",
      "Concept of lateral (curved) surface vs total surface",
      "Pythagoras theorem (for slant height of cone)",
      "Pi (π ≈ 3.14 or 22/7)"
    ],
    key_formulas: [
      "Cuboid: LSA = 2h(l+b), TSA = 2(lb+bh+hl)  [l=length, b=breadth, h=height]",
      "Cube (side a): LSA = 4a², TSA = 6a²",
      "Cylinder (r, h): CSA = 2πrh, TSA = 2πr(r+h)",
      "Cone (r, l, h): CSA = πrl, TSA = πr(r+l)  [l = slant height = √(r²+h²)]",
      "Sphere (r): SA = 4πr²",
      "Hemisphere (r): CSA = 2πr², TSA = 3πr²"
    ],
    teaching_content: {
      intuition: "Surface area is the total area of paint you would need to cover an object. Imagine unfolding a box into a flat net — the area of the net is the total surface area. For a cylinder, unroll the curved side: you get a rectangle of width h and length equal to the circle's circumference (2πr). For a cone, unroll the curved surface: you get a sector of a circle. These 'unrolling' mental pictures make the formulas obvious rather than arbitrary.",
      derivation: "Cylinder CSA derivation:\nThe curved surface of a cylinder is a rectangle when unrolled.\nWidth = height h. Length = circumference of base = 2πr.\nCSA = 2πr × h = 2πrh.\nAdd two circular ends: TSA = 2πrh + 2πr² = 2πr(h+r).\n\nCone CSA derivation:\nThe curved surface unrolls into a sector of radius l (slant height).\nSector angle θ/360° = (arc length)/(2πl) = (2πr)/(2πl) = r/l.\nArea of sector = (θ/360°) × πl² = (r/l) × πl² = πrl.\nSo CSA of cone = πrl.\nSlant height: l = √(r²+h²) from Pythagoras (r = base radius, h = vertical height).",
      worked_example: "(i) Cuboid 12×10×8 cm. Find TSA.\n    TSA = 2(12×10 + 10×8 + 8×12) = 2(120+80+96) = 2×296 = 592 cm².\n\n(ii) Cylinder r=7cm, h=20cm. Find CSA and TSA. (π=22/7)\n    CSA = 2×(22/7)×7×20 = 2×22×20 = 880 cm².\n    TSA = 880 + 2×(22/7)×49 = 880 + 308 = 1188 cm².\n\n(iii) Cone r=6cm, h=8cm. Find CSA. \n    l = √(36+64) = √100 = 10 cm.\n    CSA = π×6×10 = 60π ≈ 188.57 cm².\n\n(iv) Sphere r=14cm. Find SA. (π=22/7)\n    SA = 4×(22/7)×14² = 4×(22/7)×196 = 4×22×28 = 2464 cm².\n\n(v) Hemisphere r=3cm. TSA?\n    TSA = 3πr² = 3π×9 = 27π ≈ 84.82 cm².",
      visual_description: "Draw five 3D solids in a row: cuboid, cube, cylinder, cone, sphere. Below each, write its TSA formula. For the cylinder, show the unrolled net (rectangle + 2 circles). For the cone, show the unrolled net (sector + circle). Label all dimensions (r, h, l) on each solid.",
      svg_diagrams: [
        {
          title: "Surface area formulas for cuboid, cylinder, cone, sphere with key dimensions",
          svg_code: "<svg viewBox='0 0 340 160' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='30' width='60' height='40' rx='3' fill='#BBDEFB' stroke='#1565C0' stroke-width='1.5'/><text x='35' y='22' text-anchor='middle' font-size='10' fill='#1565C0' font-weight='bold'>Cuboid</text><text x='35' y='82' text-anchor='middle' font-size='9' fill='#1565C0'>TSA=2(lb+bh+hl)</text><ellipse cx='110' cy='55' rx='18' ry='6' fill='none' stroke='#4CAF50' stroke-width='1.5'/><rect x='92' y='55' width='36' height='30' fill='#C8E6C9' stroke='#4CAF50' stroke-width='1.5'/><ellipse cx='110' cy='85' rx='18' ry='6' fill='#C8E6C9' stroke='#4CAF50' stroke-width='1.5'/><text x='110' y='22' text-anchor='middle' font-size='10' fill='#4CAF50' font-weight='bold'>Cylinder</text><text x='110' y='106' text-anchor='middle' font-size='9' fill='#4CAF50'>CSA=2πrh</text><text x='110' y='117' text-anchor='middle' font-size='9' fill='#4CAF50'>TSA=2πr(r+h)</text><line x1='180' y1='30' x2='210' y2='85' stroke='#E91E63' stroke-width='1.5'/><line x1='240' y1='30' x2='210' y2='85' stroke='#E91E63' stroke-width='1.5'/><ellipse cx='210' cy='30' rx='30' ry='8' fill='#FFCDD2' stroke='#E91E63' stroke-width='1.5'/><text x='210' y='22' text-anchor='middle' font-size='10' fill='#E91E63' font-weight='bold'>Cone</text><text x='210' y='106' text-anchor='middle' font-size='9' fill='#E91E63'>CSA=πrl</text><text x='210' y='117' text-anchor='middle' font-size='9' fill='#E91E63'>l=√(r²+h²)</text><circle cx='305' cy='55' r='30' fill='#F3E5F5' stroke='#7B1FA2' stroke-width='1.5'/><text x='305' y='22' text-anchor='middle' font-size='10' fill='#7B1FA2' font-weight='bold'>Sphere</text><text x='305' y='106' text-anchor='middle' font-size='9' fill='#7B1FA2'>SA=4πr²</text></svg>"
        }
      ],
      common_misconceptions: [
        "Using h instead of l (slant height) in the cone CSA formula. Always compute l = √(r²+h²) from the vertical height first.",
        "Forgetting the base circle(s) when computing TSA — TSA includes ALL faces (including circular bases for cylinder, cone).",
        "Hemisphere TSA: students write 2πr² (CSA only) instead of 3πr² (CSA + flat circular base).",
        "Using diameter instead of radius in the formulas — every formula uses radius r, not diameter d."
      ],
      shortcuts_and_tricks: [
        "Slant height of cone: l = √(r²+h²). Compute this first before touching any area formula.",
        "Cylinder TSA = CSA + 2 circles = 2πrh + 2πr². Factor out 2πr: TSA = 2πr(h+r). Neater to write and compute.",
        "Sphere area = 4 × (area of great circle) = 4πr². Remember: 4 circles worth of area.",
        "Hemisphere TSA = 3πr²: the '3' comes from curved surface (2πr²) plus one flat circular base (πr²). Think '2+1=3'."
      ],
      when_to_use_this_method: "Apply surface area formulas whenever a problem asks for 'paint required', 'material needed to cover', or 'total surface area' of a 3D object. Choose between CSA (only the curved/lateral sides) and TSA (including all bases) based on whether the object is open or closed.",
      edge_cases: [
        "Open cylinder (e.g., a pipe): only CSA = 2πrh. No end caps.",
        "Cone without base (open cone, like an ice cream cone without the circular bottom): only CSA = πrl.",
        "Hollow sphere: TSA = outer SA + inner SA = 4πR² + 4πr² (R = outer radius, r = inner radius).",
        "When r = h for a cylinder: TSA = 2πr(r+r) = 4πr² — same as sphere of same radius!"
      ],
      key_takeaway: "Surface area formulas: Cuboid TSA=2(lb+bh+hl), Cylinder CSA=2πrh/TSA=2πr(r+h), Cone CSA=πrl (l=√(r²+h²)), Sphere=4πr², Hemisphere TSA=3πr². Always identify whether CSA or TSA is needed. Compute cone's slant height first from vertical height.",
      video_script_hooks: [
        "Opening: 'Unroll a cylinder. You get a rectangle. Its length is the circumference (2πr), its height is h. Area = 2πrh. That is the curved surface area — geometry disguised as arithmetic.'",
        "Mid-lesson: 'Cone slant height: the slant l is the hypotenuse of the right triangle with legs r (base radius) and h (vertical height). Pythagoras gives l = √(r²+h²). Do this first. Always.'",
        "Closing: 'Sphere: four times the area of its great circle. 4πr². The most beautiful surface area formula — and the most useful to memorise.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     11-B  Volume of Solids
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch11_volume_of_solids",
    subject: "Mathematics",
    chapterNumber: 11,
    name: "Volume of Solids",
    prerequisite_knowledge: [
      "Surface area formulas for cuboid, cylinder, cone, sphere",
      "Concept of volume as space occupied",
      "Units: cm³, m³, litres (1 litre = 1000 cm³)",
      "Basic substitution into formulas"
    ],
    key_formulas: [
      "Cuboid: V = l × b × h",
      "Cube (side a): V = a³",
      "Cylinder: V = πr²h",
      "Cone: V = (1/3)πr²h  [one-third of the cylinder with same base and height]",
      "Sphere: V = (4/3)πr³",
      "Hemisphere: V = (2/3)πr³",
      "Relationship: Volume of cone = (1/3) × Volume of cylinder (same r and h)"
    ],
    teaching_content: {
      intuition: "Volume is how much space a 3D object takes up — measured in cubic units. For a cuboid, it is simply length × breadth × height: count how many unit cubes fit inside. A cylinder is a stack of circular discs, each of area πr², stacked to height h: V = πr²h. A cone is one-third of the cylinder with the same base and height — a beautiful relationship you can verify experimentally by filling a cone with water and pouring it into the matching cylinder: exactly three full cones fill one cylinder.",
      derivation: "Cone volume = (1/3) × cylinder volume:\nThis follows from Cavalieri's Principle (rigorous calculus) or from the experimental fact that three identical cones with the same base and height fill one cylinder exactly.\n\nSphere volume derivation (using Cavalieri's Principle):\nCompare a hemisphere of radius r with a cylinder of radius r and height r minus a cone of height r and base radius r.\nAt height y: hemisphere cross-section area = π(r²−y²); cylinder-minus-cone cross-section = πr²−πy² = π(r²−y²). Equal!\nBy Cavalieri's Principle: hemisphere volume = cylinder volume − cone volume = πr²·r − (1/3)πr²·r = (2/3)πr³.\nSphere = 2 × hemisphere = (4/3)πr³.",
      worked_example: "(i) Cuboid 5×4×3 m. V = 5×4×3 = 60 m³.\n\n(ii) Cylinder r=7cm, h=10cm. V = (22/7)×49×10 = 22×70 = 1540 cm³.\n\n(iii) Cone r=6cm, h=7cm. V = (1/3)×(22/7)×36×7 = (1/3)×22×36 = (1/3)×792 = 264 cm³.\n\n(iv) Sphere r=21cm. V = (4/3)×(22/7)×21³ = (4/3)×(22/7)×9261 = (4/3)×22×1323 = (4×22×1323)/3 = 116424/3 = 38808 cm³.\n\n(v) How many spheres of r=1cm can be made from a cylinder r=2cm, h=16cm?\n    V_cylinder = π×4×16 = 64π cm³.\n    V_sphere = (4/3)π×1 = (4/3)π cm³.\n    Number = 64π ÷ (4π/3) = 64×3/4 = 48 spheres.",
      visual_description: "Draw five solids in a row: cuboid, cylinder, cone, sphere, hemisphere. Below each, write the volume formula. Highlight the 1/3 relationship between cone and cylinder with a split diagram: one cylinder = three stacked cones of the same dimensions. Label all dimensions (l, b, h, r) clearly.",
      svg_diagrams: [
        {
          title: "Volume formulas: cone = 1/3 cylinder relationship highlighted",
          svg_code: "<svg viewBox='0 0 320 160' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='40' width='50' height='60' rx='2' fill='#BBDEFB' stroke='#1565C0' stroke-width='1.5'/><text x='30' y='30' text-anchor='middle' font-size='9' fill='#1565C0' font-weight='bold'>Cuboid</text><text x='30' y='118' text-anchor='middle' font-size='8' fill='#1565C0'>V = lbh</text><ellipse cx='95' cy='55' rx='18' ry='6' fill='#C8E6C9' stroke='#4CAF50' stroke-width='1.5'/><rect x='77' y='55' width='36' height='45' fill='#C8E6C9' stroke='#4CAF50' stroke-width='1.5'/><ellipse cx='95' cy='100' rx='18' ry='6' fill='#A5D6A7' stroke='#4CAF50' stroke-width='1.5'/><text x='95' y='28' text-anchor='middle' font-size='9' fill='#4CAF50' font-weight='bold'>Cylinder</text><text x='95' y='118' text-anchor='middle' font-size='8' fill='#4CAF50'>V = πr²h</text><line x1='160' y1='40' x2='185' y2='100' stroke='#E91E63' stroke-width='1.5'/><line x1='210' y1='40' x2='185' y2='100' stroke='#E91E63' stroke-width='1.5'/><ellipse cx='185' cy='40' rx='25' ry='8' fill='#FFCDD2' stroke='#E91E63' stroke-width='1.5'/><text x='185' y='28' text-anchor='middle' font-size='9' fill='#E91E63' font-weight='bold'>Cone</text><text x='185' y='118' text-anchor='middle' font-size='8' fill='#E91E63'>V = ⅓πr²h</text><circle cx='268' cy='68' r='32' fill='#F3E5F5' stroke='#7B1FA2' stroke-width='1.5'/><text x='268' y='28' text-anchor='middle' font-size='9' fill='#7B1FA2' font-weight='bold'>Sphere</text><text x='268' y='118' text-anchor='middle' font-size='8' fill='#7B1FA2'>V = (4/3)πr³</text><text x='160' y='145' font-size='9' fill='#E91E63' font-weight='bold'>3 cones = 1 cylinder (same r, h)</text></svg>"
        }
      ],
      common_misconceptions: [
        "Forgetting the (1/3) factor for the cone: V_cone = (1/3)πr²h, not πr²h. The (1/3) is essential.",
        "Using diameter instead of radius in V = πr²h or (4/3)πr³ — all volume formulas use radius.",
        "Confusing the sphere volume (4/3)πr³ with the hemisphere volume (2/3)πr³ — hemisphere is exactly half the sphere.",
        "Unit errors: computing in cm but expressing answer in m³ — always keep units consistent throughout."
      ],
      shortcuts_and_tricks: [
        "Cone = (1/3) × Cylinder: if you need the cone volume and you've already computed the matching cylinder's volume, just divide by 3.",
        "Sphere = (4/3)πr³: rewrite as (4πr³)/3 to avoid fraction confusion during calculation. Compute 4πr³ first, then divide by 3.",
        "Litres: 1 litre = 1000 cm³ = 1 dm³. Convert volumes in cm³ to litres by dividing by 1000.",
        "For π, use 22/7 when r is a multiple of 7 (gives clean answers). Use 3.14 otherwise."
      ],
      when_to_use_this_method: "Apply volume formulas whenever a problem asks for 'capacity', 'space occupied', 'amount of material', or directly asks for volume. Choose between the five solids based on the shape described. Use the cone-cylinder relationship for melting/recasting problems.",
      edge_cases: [
        "Hollow cylinder: V = π(R²−r²)h where R = outer radius, r = inner radius.",
        "Frustum of a cone (truncated cone): V = (πh/3)(R²+Rr+r²). Not covered in full at Class 9 but may appear.",
        "Recasting problems: when a solid is melted and recast, volume is conserved. Set V₁ = V₂.",
        "Water filling problems: volume of water = volume of the container up to the water level."
      ],
      key_takeaway: "Volume formulas: Cuboid=lbh, Cube=a³, Cylinder=πr²h, Cone=(1/3)πr²h, Sphere=(4/3)πr³, Hemisphere=(2/3)πr³. Key relationship: cone volume = (1/3) cylinder (same base and height). Use Pythagoras for slant height if needed. For recasting problems, set volumes equal.",
      video_script_hooks: [
        "Opening: 'Take a cone and a cylinder with the same base radius and same height. Fill the cone with water. Pour it into the cylinder. Do it again. Do it a third time. You have exactly filled the cylinder. Three cones = one cylinder. That is why the formula has (1/3).'",
        "Mid-lesson: 'Sphere volume: (4/3)πr³. Weird fraction — why 4/3? Because a sphere of radius r fits perfectly inside a cylinder of radius r and height 2r, and the sphere takes up exactly 2/3 of that cylinder. Then double it. There\\'s your 4/3.'",
        "Closing: 'Melting and recasting: set the two volumes equal. Solve for the unknown dimension. One equation, one unknown. Volume is conserved — that\\'s the principle behind every recasting problem.'"
      ]
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 11: Surface Areas and Volumes…");
  let upserted = 0, skipped = 0;
  for (const t of TOPICS) {
    try {
      await NcertTopicContent.findOneAndUpdate({ topicId: t.topicId }, { $set: t }, { upsert: true, new: true });
      console.log(`  ✓ ${t.topicId}`); upserted++;
    } catch (err) {
      if (err.code === 11000) { console.log(`  ↩ ${t.topicId} (skip)`); skipped++; } else throw err;
    }
  }
  console.log(`\nDone. Upserted: ${upserted}  Skipped: ${skipped}`);
  await mongoose.disconnect(); process.exit(0);
}
run().catch(err => { console.error(err); process.exit(1); });
