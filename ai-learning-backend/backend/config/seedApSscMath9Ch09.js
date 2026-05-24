/**
 * AP SSC Class 9 Mathematics — Chapter 9: Circles
 * 3 topics — fresh content (traditional NCERT Class 9, rationalized 2024-25)
 *
 * Usage: node config/seedApSscMath9Ch09.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  /* ─────────────────────────────────────────────────────────────
     9-A  Circles and Their Chords
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch9_chords_of_circle",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "Circles and Their Chords",
    prerequisite_knowledge: [
      "Circle: centre, radius, diameter, circumference",
      "Chord definition: a line segment with both endpoints on the circle",
      "Perpendicular bisector of a segment",
      "Triangle congruence criteria (RHS, SSS)"
    ],
    key_formulas: [
      "Equal chords of a circle are equidistant from the centre",
      "Converse: Chords equidistant from the centre are equal",
      "Perpendicular from the centre to a chord bisects the chord",
      "Converse: Line joining the centre to the midpoint of a chord is perpendicular to the chord",
      "The perpendicular bisector of any chord passes through the centre",
      "Chord length formula: if d = distance from centre to chord, r = radius → half-chord = √(r²−d²)"
    ],
    teaching_content: {
      intuition: "A chord is any straight cut across a circle. The longest possible chord is the diameter (passing through the centre). Shorter chords are further from the centre — think of them as 'shallower' cuts. The perpendicular from the centre to any chord hits the chord exactly at its midpoint, splitting it into two equal halves. This perpendicularity-midpoint link is the central tool for all chord calculations.",
      derivation: "Proof: Perpendicular from centre bisects the chord.\n\nLet O be the centre, AB a chord. Draw OM ⊥ AB (M on AB).\n\nIn △OMA and △OMB:\n  OA = OB (radii)\n  OM = OM (common)\n  ∠OMA = ∠OMB = 90° (OM ⊥ AB)\n\nBy RHS: △OMA ≅ △OMB.\nBy CPCT: MA = MB. So M is the midpoint of AB. □\n\nCorollary: Equal chords are equidistant from the centre.\nIf AB = CD, draw OM⊥AB and ON⊥CD.\nOM bisects AB → AM = AB/2. ON bisects CD → CN = CD/2.\nSince AB = CD → AM = CN.\nIn △OAM and △OCN: OA = OC (radii), AM = CN → OM = ON (Pythagoras: OM=√(r²−AM²)=√(r²−CN²)=ON). □",
      worked_example: "(i) A chord of length 16 cm is 6 cm from the centre. Find the radius.\n    Half-chord = 8 cm. By Pythagoras: r² = 8² + 6² = 64+36 = 100. r = 10 cm.\n\n(ii) Two chords AB=24cm and CD=10cm in a circle of radius 13cm. Find their distances from the centre.\n    OM (distance to AB): AM=12, OM=√(13²−12²)=√(169−144)=√25=5 cm.\n    ON (distance to CD): CN=5, ON=√(13²−5²)=√(169−25)=√144=12 cm.\n\n(iii) Two chords are 8cm from the centre and the radius is 17cm. Show they are equal.\n    Half-chord = √(17²−8²) = √(289−64) = √225 = 15 cm.\n    Both chords = 2×15 = 30 cm. Equal because equidistant from centre.",
      visual_description: "Draw a circle with centre O. Draw two chords AB and CD. Draw perpendiculars OM⊥AB and ON⊥CD. Mark OM=ON (equal distances). Mark AM=MB and CN=ND (bisection). Label AB=CD (equal chords, equal distances). Separately draw the Pythagoras right triangle: O at top, M at foot of perpendicular, A at end of chord — sides r, d, half-chord.",
      svg_diagrams: [
        {
          title: "Chord, perpendicular from centre bisecting chord, Pythagoras triangle",
          svg_code: "<svg viewBox='0 0 300 200' xmlns='http://www.w3.org/2000/svg'><circle cx='100' cy='100' r='75' fill='none' stroke='#1565C0' stroke-width='2'/><circle cx='100' cy='100' r='3' fill='#1565C0'/><text x='103' y='98' font-size='11' fill='#1565C0'>O</text><line x1='32' y1='130' x2='168' y2='70' stroke='#E91E63' stroke-width='2'/><text x='22' y='135' font-size='11' fill='#E91E63'>A</text><text x='168' y='68' font-size='11' fill='#E91E63'>B</text><circle cx='100' cy='100' r='0'/><line x1='100' y1='100' x2='100' y2='100' stroke='#999' stroke-width='0'/><line x1='100' y1='100' x2='98' y2='101' stroke='#999' stroke-width='0'/><circle cx='100' cy='100' r='0'/><line x1='100' y1='100' x2='76' y2='112' stroke='#4CAF50' stroke-width='1.5' stroke-dasharray='4,2'/><text x='72' y='126' font-size='10' fill='#4CAF50'>M</text><rect x='72' y='108' width='6' height='6' fill='none' stroke='#4CAF50' stroke-width='1.2'/><text x='55' y='107' font-size='9' fill='#4CAF50'>d</text><text x='82' y='95' font-size='9' fill='#E91E63'>r</text><text x='130' y='175' font-size='11' fill='#333'>r² = d² + (chord/2)²</text><rect x='195' y='40' width='95' height='100' rx='4' fill='#FFF9C4'/><text x='242' y='58' text-anchor='middle' font-size='11' fill='#333' font-weight='bold'>Pythagoras</text><line x1='210' y1='120' x2='270' y2='120' stroke='#333' stroke-width='1.5'/><line x1='210' y1='120' x2='210' y2='65' stroke='#333' stroke-width='1.5'/><line x1='210' y1='65' x2='270' y2='120' stroke='#E91E63' stroke-width='2'/><text x='225' y='130' font-size='9'>chord/2</text><text x='192' y='95' font-size='9'>d</text><text x='238' y='88' font-size='9' fill='#E91E63'>r</text></svg>"
        }
      ],
      common_misconceptions: [
        "Thinking the perpendicular from the centre bisects the chord only for the diameter — it bisects ANY chord, not just the diameter.",
        "Confusing chord and arc — a chord is a straight line segment; an arc is the curved part of the circle between the same two points.",
        "Assuming equal chords must be parallel — equal chords are equidistant from the centre but can be in any direction.",
        "Using diameter as 'half-chord': the half-chord is half the chord length; the diameter is the longest chord (= 2r)."
      ],
      shortcuts_and_tricks: [
        "Three-step formula: draw perpendicular from O to chord → it bisects the chord → apply Pythagoras with r, d (distance), half-chord.",
        "If two chords are equidistant from the centre, immediately conclude they are equal — no further calculation needed.",
        "The perpendicular bisector of any chord always passes through the centre — useful for finding the centre of a circle given two chords.",
        "Diameter as longest chord: any chord shorter than the diameter is ≤ 2r. If d=0 (chord passes through centre), chord = diameter."
      ],
      when_to_use_this_method: "Apply chord-distance theorems whenever a circle problem gives a chord length and asks for distance from the centre (or vice versa). Apply equal-chords-equal-distances when comparing two chords. Always use Pythagoras once perpendicularity is established.",
      edge_cases: [
        "When d = 0 (perpendicular distance = 0): the chord passes through the centre — it is a diameter. Half-chord = r.",
        "When d = r: the chord has zero length — it is a tangent point (degenerates). Half-chord = √(r²−r²) = 0.",
        "Two concentric circles (same centre, different radii) sharing a chord: the chord is a chord of the outer circle and a secant of the inner circle.",
        "Chord perpendicular to a diameter at a non-centre point: bisected by the diameter at that point only if the diameter is the perpendicular bisector — not generally true."
      ],
      key_takeaway: "Perpendicular from centre to a chord bisects it (RHS congruence). Equal chords are equidistant from the centre and conversely. Use Pythagoras: r² = d² + (half-chord)² to find any missing quantity. These three linked results handle almost all chord problems.",
      video_script_hooks: [
        "Opening: 'Draw a chord anywhere in a circle. Drop a perpendicular from the centre to that chord. It hits exactly the midpoint — every single time. That is not a coincidence. It is a theorem, and it is the key to every chord calculation.'",
        "Mid-lesson: 'Radius, distance, half-chord: three sides of a right triangle. Know any two, find the third with Pythagoras. The perpendicular from the centre is the altitude that creates this right triangle.'",
        "Closing: 'Equal chords, equal distances. Different distances, different chord lengths. The centre always sees equal chords as identical — they are the same distance away from it.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     9-B  Angle Subtended by an Arc
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch9_angle_subtended_by_arc",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "Angle Subtended by an Arc of a Circle",
    prerequisite_knowledge: [
      "Chord and arc of a circle",
      "Central angle: angle at the centre subtended by an arc",
      "Inscribed angle: angle at the circumference subtended by an arc",
      "Isosceles triangle (two radii form an isosceles triangle)"
    ],
    key_formulas: [
      "Central Angle Theorem: angle at centre = 2 × angle at circumference (subtended by same arc)",
      "∠AOB = 2 × ∠ACB  (O = centre, C = any point on the major arc)",
      "Angles in the same segment are equal: ∠ACB = ∠ADB (C, D on same arc)",
      "Angle in a semicircle = 90° (angle subtended by diameter at circumference)",
      "Equal chords (or arcs) subtend equal angles at the centre",
      "Equal chords (or arcs) subtend equal angles at the circumference"
    ],
    teaching_content: {
      intuition: "Imagine standing at the centre of a circle and looking at a chord AB — the angle you see is called the central angle. Now move to any point C on the circle (on the far side from AB) and look at the same chord. The angle you see (the inscribed angle) is exactly half the central angle. This 2:1 ratio holds no matter where you stand on that arc. Even more elegant: all points on the same arc see the chord at the exact same angle. The view is always identical.",
      derivation: "Proof: Central angle = 2 × inscribed angle (for the case where O is inside ∠ACB).\n\nLet O be the centre, A and B endpoints of a chord, C a point on the major arc.\nDraw the radius OC and extend it to D.\n\nIn △OAC: OA = OC (radii). So △OAC is isosceles.\n∠OAC = ∠OCA (base angles). Let each = α.\nExterior angle of △OAC: ∠AOD = ∠OAC + ∠OCA = 2α.\n\nSimilarly, in △OBC: OB = OC (radii).\n∠OBC = ∠OCB. Let each = β.\n∠BOD = 2β.\n\n∠AOB = ∠AOD + ∠BOD = 2α + 2β = 2(α+β) = 2∠ACB. □\n(Three cases exist: O inside, O on, O outside ∠ACB — each proved similarly.)",
      worked_example: "(i) ∠AOB = 100° (central angle). Find ∠ACB (inscribed angle, C on major arc).\n    ∠ACB = ∠AOB/2 = 50°.\n\n(ii) ∠ACB = 35° and ∠ADB = 35°. Are C and D on the same arc?\n    Yes — equal inscribed angles subtended by the same chord ↔ points on the same arc.\n\n(iii) AB is a diameter, C is on the circle. Find ∠ACB.\n    ∠AOB = 180° (straight angle, diameter). ∠ACB = 90°. (Angle in semicircle.)\n\n(iv) ∠ABC = 40° (inscribed). ∠ADC = ? (D on the same arc as B).\n    Equal inscribed angles: ∠ADC = 40°.",
      visual_description: "Draw a circle with centre O. Mark points A and B on the circle (endpoints of a chord). Mark C on the major arc. Draw OA, OB (central angle ∠AOB) and CA, CB (inscribed angle ∠ACB). Label ∠AOB = 2×∠ACB. Mark the isosceles triangles OAC and OBC with equal radii marked. Separately show the semicircle case: AB = diameter, C on circle, ∠ACB = 90°.",
      svg_diagrams: [
        {
          title: "Central angle = 2× inscribed angle; angle in semicircle = 90°",
          svg_code: "<svg viewBox='0 0 310 180' xmlns='http://www.w3.org/2000/svg'><circle cx='90' cy='95' r='70' fill='none' stroke='#1565C0' stroke-width='2'/><circle cx='90' cy='95' r='3' fill='#1565C0'/><text x='93' y='93' font-size='10' fill='#1565C0'>O</text><circle cx='40' cy='130' r='3' fill='#333'/><text x='26' y='132' font-size='10'>A</text><circle cx='140' cy='130' r='3' fill='#333'/><text x='143' y='132' font-size='10'>B</text><circle cx='90' cy='28' r='3' fill='#E91E63'/><text x='85' y='20' font-size='10' fill='#E91E63'>C</text><line x1='90' y1='95' x2='40' y2='130' stroke='#4CAF50' stroke-width='1.5'/><line x1='90' y1='95' x2='140' y2='130' stroke='#4CAF50' stroke-width='1.5'/><line x1='90' y1='28' x2='40' y2='130' stroke='#E91E63' stroke-width='1.5'/><line x1='90' y1='28' x2='140' y2='130' stroke='#E91E63' stroke-width='1.5'/><text x='60' y='95' font-size='9' fill='#4CAF50'>2θ</text><text x='80' y='42' font-size='9' fill='#E91E63'>θ</text><circle cx='220' cy='95' r='65' fill='none' stroke='#1565C0' stroke-width='2'/><circle cx='220' cy='95' r='3' fill='#1565C0'/><line x1='155' y1='95' x2='285' y2='95' stroke='#333' stroke-width='2'/><text x='148' y='94' font-size='10'>A</text><text x='285' y='94' font-size='10'>B</text><circle cx='220' cy='32' r='3' fill='#E91E63'/><text x='215' y='24' font-size='10' fill='#E91E63'>C</text><line x1='155' y1='95' x2='220' y2='32' stroke='#E91E63' stroke-width='1.5'/><line x1='285' y1='95' x2='220' y2='32' stroke='#E91E63' stroke-width='1.5'/><rect x='213' y='86' width='8' height='8' fill='none' stroke='#E91E63' stroke-width='1.5'/><text x='205' y='60' font-size='9' fill='#E91E63'>90°</text><text x='185' y='160' font-size='9' fill='#333'>Angle in semicircle = 90°</text></svg>"
        }
      ],
      common_misconceptions: [
        "Applying ∠AOB = 2∠ACB when C is on the minor arc — the formula still holds but the central angle used is the reflex angle (>180°). For minor arc, the inscribed angle is obtuse.",
        "Thinking all inscribed angles in a circle are equal — only inscribed angles subtended by the SAME arc (chord) are equal.",
        "Forgetting that the angle-in-semicircle = 90° requires AB to be a diameter, not just any chord.",
        "Confusing 'angle subtended at the centre' with 'angle subtended at the circumference' — at centre = twice as much."
      ],
      shortcuts_and_tricks: [
        "The 2:1 ratio is the master key: always check whether you have a central or inscribed angle. Central = 2×inscribed for the same arc.",
        "Angle in a semicircle: if a triangle is inscribed in a circle with one side as diameter → the angle at the third vertex = 90°. Instant right angle.",
        "Same segment shortcut: if multiple points lie on the same arc, all inscribed angles from those points to a chord are equal. Write them equal immediately.",
        "If central angle is reflex (>180°), the corresponding inscribed angle from the same minor arc will be obtuse (>90°)."
      ],
      when_to_use_this_method: "Apply the central angle theorem whenever a problem shows a central angle and an inscribed angle subtended by the same chord. Use 'angles in same segment = equal' when multiple points on the same arc are given. Apply 'angle in semicircle = 90°' whenever a diameter is drawn.",
      edge_cases: [
        "When C is on the minor arc: inscribed angle ∠ACB and central angle ∠AOB are on opposite sides of the chord. The formula uses the reflex central angle (360°−∠AOB).",
        "When C coincides with A or B: inscribed angle degenerates. The theorem applies only when C is distinct from A and B.",
        "Equal arcs ↔ equal central angles ↔ equal chords — three equivalent conditions.",
        "A 60° inscribed angle means the arc subtended is 120° (double). A 90° inscribed angle subtends a 180° arc (semicircle)."
      ],
      key_takeaway: "Central angle = 2 × inscribed angle (same arc). All inscribed angles in the same segment are equal. Angle in a semicircle = 90°. These three theorems — all consequences of the 2:1 ratio — handle the vast majority of circle angle problems at Class 9 level.",
      video_script_hooks: [
        "Opening: 'Stand at the centre of a circle and look at a chord. Your angle is twice what anyone on the arc sees. Move to the edge — your angle is instantly halved. That 2:1 ratio is the most important number in circle geometry.'",
        "Mid-lesson: 'Five people standing on the same arc, all looking at the same chord — they all see the exact same angle. It doesn\\'t matter where on that arc they stand. Same arc, same angle. Every time.'",
        "Closing: 'AB is a diameter. C is anywhere on the circle. ∠ACB = 90°. Always. The diameter always forces a right angle at the circumference. That is the most useful single fact in circle geometry.'"
      ]
    }
  },

  /* ─────────────────────────────────────────────────────────────
     9-C  Cyclic Quadrilaterals
  ───────────────────────────────────────────────────────────── */
  {
    topicId: "ap_ssc_math9_ch9_cyclic_quadrilaterals",
    subject: "Mathematics",
    chapterNumber: 9,
    name: "Cyclic Quadrilaterals",
    prerequisite_knowledge: [
      "Inscribed angle theorem: angle at centre = 2 × angle at circumference",
      "Angles in same segment are equal",
      "Angle sum of a quadrilateral = 360°",
      "Linear pair: two angles summing to 180°"
    ],
    key_formulas: [
      "Cyclic quadrilateral: a quadrilateral whose four vertices all lie on a circle",
      "Opposite angles of a cyclic quadrilateral are supplementary: ∠A + ∠C = 180°, ∠B + ∠D = 180°",
      "Converse: if opposite angles of a quadrilateral are supplementary → it is cyclic",
      "Exterior angle of a cyclic quadrilateral = interior opposite angle",
      "Sum of opposite angles = 180° (each pair)"
    ],
    teaching_content: {
      intuition: "A cyclic quadrilateral has all four corners sitting on a single circle. The remarkable property is that opposite corners 'balance' each other: their angles always add to 180°. This makes sense from the arc perspective — ∠A and ∠C are both inscribed angles, but they subtend arcs on opposite sides of the chord. The two arcs together make up the full 360° circle, and since inscribed angle = half the arc, ∠A + ∠C = 180°/2 × (arc₁ + arc₂) = 360°/2 = 180°.",
      derivation: "Proof: Opposite angles of a cyclic quadrilateral are supplementary.\n\nLet ABCD be a cyclic quadrilateral with centre O.\n\nArc BCD subtends ∠BAD at A and ∠BOD (reflex) at O.\nBy Central Angle Theorem: reflex ∠BOD = 2∠BAD … (1)\n\nArc BAD subtends ∠BCD at C and ∠BOD (non-reflex) at O.\nBy Central Angle Theorem: ∠BOD = 2∠BCD … (2)\n\nAdding (1) and (2):\nreflex∠BOD + ∠BOD = 2∠BAD + 2∠BCD\n360° = 2(∠BAD + ∠BCD)\n∠BAD + ∠BCD = 180°.\nSo ∠A + ∠C = 180°. Similarly ∠B + ∠D = 180°. □",
      worked_example: "(i) ABCD cyclic quadrilateral. ∠A = 80°, ∠B = 100°. Find ∠C and ∠D.\n    ∠C = 180° − ∠A = 100°.  ∠D = 180° − ∠B = 80°.\n    Check: 80+100+100+80 = 360° ✓.\n\n(ii) PQRS is cyclic. ∠P = (2x+10)°, ∠R = (3x−20)°. Find x.\n    ∠P + ∠R = 180° → 2x+10+3x−20 = 180 → 5x−10 = 180 → 5x = 190 → x = 38.\n    ∠P = 86°, ∠R = 94°. Check: 86+94=180 ✓.\n\n(iii) In cyclic quad ABCD, side BC is extended to E. Show ∠DCE = ∠DAB.\n    ∠DAB + ∠BCD = 180° (opposite angles, cyclic quad).\n    ∠BCD + ∠DCE = 180° (linear pair, BCE is a straight line).\n    ∴ ∠DCE = ∠DAB. (exterior angle = interior opposite angle) ✓",
      visual_description: "Draw a circle. Mark four points A, B, C, D on the circumference forming a quadrilateral. Draw arcs ∠A and ∠C (opposite angles). Show with colour coding that arc BCD (larger arc) corresponds to ∠A and arc BAD (the complementary arc) corresponds to ∠C. Label ∠A + ∠C = 180° with the arc addition equalling 360°.",
      svg_diagrams: [
        {
          title: "Cyclic quadrilateral ABCD: opposite angles ∠A+∠C=180°, ∠B+∠D=180°",
          svg_code: "<svg viewBox='0 0 260 220' xmlns='http://www.w3.org/2000/svg'><circle cx='130' cy='110' r='90' fill='none' stroke='#1565C0' stroke-width='2'/><circle cx='130' cy='110' r='3' fill='#1565C0'/><circle cx='70' cy='55' r='4' fill='#E91E63'/><circle cx='190' cy='55' r='4' fill='#E91E63'/><circle cx='200' cy='165' r='4' fill='#4CAF50'/><circle cx='60' cy='165' r='4' fill='#4CAF50'/><polygon points='70,55 190,55 200,165 60,165' fill='none' stroke='#E91E63' stroke-width='2'/><text x='58' y='48' font-size='11' fill='#E91E63'>A</text><text x='192' y='48' font-size='11' fill='#E91E63'>B</text><text x='202' y='172' font-size='11' fill='#4CAF50'>C</text><text x='46' y='172' font-size='11' fill='#4CAF50'>D</text><path d='M 75 65 A 14 14 0 0 1 87 58' fill='none' stroke='#E91E63' stroke-width='2'/><text x='86' y='55' font-size='9' fill='#E91E63'>∠A</text><path d='M 190 158 A 14 14 0 0 1 203 155' fill='none' stroke='#4CAF50' stroke-width='2'/><text x='178' y='168' font-size='9' fill='#4CAF50'>∠C</text><text x='75' y='210' font-size='11' fill='#333' font-weight='bold'>∠A + ∠C = 180°</text></svg>"
        }
      ],
      common_misconceptions: [
        "Thinking all quadrilaterals have opposite angles summing to 180° — only CYCLIC quadrilaterals have this property. A general quadrilateral does not.",
        "Applying the rule to non-cyclic quadrilaterals (e.g., a general parallelogram is cyclic only if it is a rectangle).",
        "Confusing 'opposite' sides with 'opposite' angles — opposite angles are the non-adjacent pair: ∠A and ∠C (not ∠A and ∠B).",
        "Forgetting the exterior angle result: exterior angle of a cyclic quad = interior opposite angle (not its supplement)."
      ],
      shortcuts_and_tricks: [
        "Opposite angles supplementary: immediately write ∠A + ∠C = 180° and ∠B + ∠D = 180° for any cyclic quadrilateral.",
        "To check if a quadrilateral is cyclic: compute opposite angle pairs. If both sum to 180°, it is cyclic.",
        "Exterior angle shortcut: exterior angle at C = ∠A (the angle at A, not ∠C's supplement). Draw the exterior angle and label it equal to the non-adjacent interior angle.",
        "A rectangle is always cyclic (opposite angles = 90°+90° = 180°). A parallelogram is cyclic only if it is a rectangle."
      ],
      when_to_use_this_method: "Apply the cyclic quadrilateral theorem whenever four points are stated to lie on a circle. Use the converse to prove a quadrilateral is cyclic when opposite angles are shown to be supplementary. Use the exterior angle result in proof questions.",
      edge_cases: [
        "A square is a cyclic quadrilateral (all four vertices on its circumscribed circle). Opposite angles: 90°+90°=180°.",
        "A rectangle is cyclic. Its diagonal is the diameter of the circumscribed circle.",
        "A parallelogram is cyclic only if it is a rectangle (opposite angles = 90° each, summing to 180°).",
        "A rhombus is cyclic only if it is a square."
      ],
      key_takeaway: "Cyclic quadrilateral: four vertices on one circle. Opposite angles are supplementary (sum to 180°). Converse: opposite angles supplementary → cyclic. Exterior angle = interior opposite angle. Proved using the inscribed angle theorem applied to opposite arcs.",
      video_script_hooks: [
        "Opening: 'Four points, one circle. The quadrilateral they form has a magical property: every pair of opposite angles adds to 180°. Every single cyclic quadrilateral, every single time.'",
        "Mid-lesson: 'Why 180°? The two opposite angles subtend arcs that together make up the full 360°. Each inscribed angle is half its arc. Half of 360° is 180°. Simple.'",
        "Closing: 'Converse test: if opposite angles sum to 180°, the quadrilateral is cyclic. That\\'s your proof that four points lie on a common circle — no compass needed.'"
      ]
    }
  }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding AP SSC Math 9 — Chapter 9: Circles…");
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
