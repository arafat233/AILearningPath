/**
 * Seed: CBSE Class 10 Science — Physics Unit Teaching Content
 * Chapters 9–12: Light Reflection & Refraction, Human Eye & Colourful World,
 *                Electricity, Magnetic Effects of Electric Current
 *
 * Upserts NcertTopicContent documents (15 fine-grained topics).
 * Safe to re-run — upserts on topicId.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedSciencePhysicsContent.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 9: Light — Reflection and Refraction
  // ═══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch9_reflection_mirrors",
    subject: "Science",
    chapterNumber: 9,
    name: "Laws of Reflection and Spherical Mirrors",
    prerequisite_knowledge: [
      "Rectilinear propagation of light",
      "Basic geometry — angles and normals",
      "Concept of a focal point",
      "Sign convention (New Cartesian)"
    ],
    key_formulas: [
      "Laws of reflection: angle of incidence (∠i) = angle of reflection (∠r); incident ray, reflected ray, and normal all lie in the same plane",
      "Radius of curvature R = 2f (where f = focal length)",
      "New Cartesian sign convention: distances measured from pole P; distances in direction of incident light are positive; distances opposite to incident light are negative; heights above principal axis are positive",
      "Mirror formula: 1/v + 1/u = 1/f",
      "Linear magnification: m = h'/h = −v/u"
    ],
    teaching_content: {
      intuition: "A mirror works like a perfect echo for light — sound bounces off a wall and comes back; light bounces off a mirror surface and returns toward your eye. The curved shape of a concave mirror is like a bowl that gathers all parallel rays and squeezes them to one point (focus), which is why it can start fires with sunlight and why satellite dishes use the same bowl shape. A convex mirror does the opposite — it spreads rays apart, giving you a wide field of view, which is why cars use them as rear-view mirrors.",
      process_explanation: "Step 1 — Understand the geometry: A concave mirror has its reflecting surface on the inside of the curve; a convex mirror reflects from the outside. The pole P is the geometric centre of the mirror surface. The centre of curvature C is the centre of the sphere the mirror is a part of. The principal focus F is midway between P and C (since f = R/2). Step 2 — Apply the sign convention: Always take the incident light travelling left to right. All distances are measured from P. Object distance u is negative (object is to the left of mirror). For a real image, v is negative (image forms in front of mirror). For a virtual image, v is positive (image forms behind mirror). Focal length f of concave mirror is negative; f of convex mirror is positive. Step 3 — Trace the image for each object position (concave mirror): (a) Object beyond C (u < −2f): real, inverted, diminished image forms between F and C. (b) Object at C (u = −2f = −R): real, inverted, same-size image at C. (c) Object between C and F (−2f < u < −f): real, inverted, magnified image beyond C. (d) Object at F (u = −f): reflected rays are parallel — image at infinity. (e) Object between F and P (−f < u < 0): virtual, erect, magnified image behind the mirror — this is the shaving/makeup mirror position. Step 4 — Convex mirror: regardless of object position, always forms a virtual, erect, diminished image behind the mirror. This is why its field of view is wider.",
      worked_example: "A concave mirror has a focal length of 10 cm. An object is placed 30 cm in front of it. Find the image position and state whether it is real or virtual.\n\nGiven: f = −10 cm (concave), u = −30 cm (object in front of mirror).\nUsing mirror formula: 1/v + 1/u = 1/f\n1/v + 1/(−30) = 1/(−10)\n1/v = −1/10 + 1/30 = −3/30 + 1/30 = −2/30\nv = −15 cm\n\nSince v = −15 cm (negative), the image is real and in front of the mirror.\nMagnification m = −v/u = −(−15)/(−30) = −15/30 = −0.5\nSince m is negative and |m| < 1, the image is inverted and diminished.\nConclusion: The image is real, inverted, and diminished, located 15 cm in front of the mirror (between F and C, as expected for u > 2f case).",
      common_misconceptions: [
        "Students often forget to apply the negative sign to u and f for concave mirrors, leading to wrong signs in the formula and wrong conclusions about real vs virtual.",
        "Many students think the focal length of a concave mirror is positive — it is negative because the focus is in front of the mirror (on the same side as the object), in the direction opposite to incident light.",
        "Students confuse the image positions: they memorise 'between C and F gives a magnified image' but place the image between C and F instead of beyond C. Remember: object between C&F → image beyond C (they swap sides of C)."
      ],
      shortcuts_and_tricks: [
        "Memory table for concave mirror — BFCFI: Beyond C → diminished real; at F → infinity; at C → same-size real; between F and C → magnified real; between F and P → virtual magnified. Read it backward: P→F→C→beyond C as object moves away.",
        "Quick sign check: if you get a positive v for a mirror problem, the image is virtual (behind the mirror). If v is negative for a concave mirror, image is real.",
        "Convex mirror shortcut: f is always positive, v is always positive — always virtual, always diminished. No need to memorise multiple cases."
      ],
      diagram_description: "Five ray diagrams for a concave mirror on a single axis, each showing the principal axis with pole P, focus F, and centre of curvature C marked. Case 1 (object beyond C): two rays from object tip — ray parallel to axis reflects through F; ray through F reflects parallel to axis. They meet in front of the mirror between F and C, showing a small inverted real image. Case 2 (object at C): reflected rays meet exactly at C — same-size inverted real image. Case 3 (object between C and F): reflected rays meet beyond C — large inverted real image. Case 4 (object at F): reflected rays emerge parallel — no meeting point, image at infinity. Case 5 (object between F and P): reflected rays diverge; extend them behind the mirror (dashed lines) — they appear to meet behind the mirror, giving a large virtual erect image. A separate small diagram shows a convex mirror with any object position producing a small erect virtual image behind the mirror's surface.",
      key_takeaway: "Concave mirrors can produce real or virtual images depending on object position. The mirror formula 1/v + 1/u = 1/f works for all cases provided you apply the New Cartesian sign convention consistently. Convex mirrors always give virtual, erect, diminished images — making them ideal for wide-angle viewing (vehicles, security mirrors). Magnification m = −v/u: if m is positive → erect image; if m is negative → inverted image."
    }
  },

  {
    topicId: "sci_ch9_mirror_formula",
    subject: "Science",
    chapterNumber: 9,
    name: "Mirror Formula and Magnification Numericals",
    prerequisite_knowledge: [
      "New Cartesian sign convention",
      "Concave and convex mirror image positions",
      "Basic algebra — solving linear equations"
    ],
    key_formulas: [
      "Mirror formula: 1/v + 1/u = 1/f",
      "Relationship: f = R/2, so R = 2f",
      "Linear magnification: m = h'/h = −v/u",
      "m > 0 → erect (virtual) image; m < 0 → inverted (real) image",
      "|m| > 1 → magnified; |m| < 1 → diminished; |m| = 1 → same size"
    ],
    teaching_content: {
      intuition: "The mirror formula is simply the mathematical expression of where light rays actually cross after reflection. If you move an object closer to a concave mirror (u decreases in magnitude), the image moves further away (v increases in magnitude) — the formula captures this inverse relationship. Magnification tells you whether the image is bigger or smaller and whether it is the right way up or upside down, all from two numbers: v and u.",
      process_explanation: "Step-by-step method for mirror numericals:\n1. List all given quantities and assign signs using New Cartesian convention.\n   — Object always has u negative (object is in front of mirror).\n   — Concave mirror: f is negative. Convex mirror: f is positive.\n   — If image is real, v will be negative. If virtual, v will be positive.\n2. Write the mirror formula: 1/v + 1/u = 1/f.\n3. Substitute known values and solve for the unknown.\n4. Calculate magnification using m = −v/u.\n5. Interpret the result:\n   — Sign of v: negative = real, positive = virtual.\n   — Sign of m: negative = inverted, positive = erect.\n   — |m| compared to 1: magnified, same, or diminished.",
      worked_example: "A convex mirror has focal length 20 cm. An object 5 cm tall is placed 30 cm in front of it. Find (a) image distance, (b) image height, (c) nature of image.\n\nGiven: f = +20 cm (convex), u = −30 cm, h = +5 cm.\n(a) Mirror formula: 1/v + 1/u = 1/f\n1/v + 1/(−30) = 1/(+20)\n1/v = 1/20 + 1/30 = 3/60 + 2/60 = 5/60\nv = +12 cm\nPositive v → image is virtual, behind the mirror.\n\n(b) Magnification: m = −v/u = −(12)/(−30) = +0.4\nh' = m × h = 0.4 × 5 = +2 cm\nPositive h' → erect image; height is 2 cm.\n\n(c) Nature: virtual, erect, diminished (2 cm tall vs 5 cm object). This confirms the universal rule for convex mirrors.",
      common_misconceptions: [
        "Students forget that for a concave mirror, f is negative. They plug in f = +10 instead of f = −10, getting completely wrong answers.",
        "Many confuse magnification formula for mirrors (m = −v/u) with the lens formula magnification (m = +v/u). The extra negative sign in the mirror formula is because reflection reverses the image direction.",
        "When image distance v comes out positive in a mirror problem, students often mark it as real. Remember: for mirrors, positive v means the image is behind the mirror = virtual."
      ],
      shortcuts_and_tricks: [
        "Quick check: for concave mirror with object beyond f, both u and v should be negative and |v| could be larger or smaller than |u| depending on position. If you get a positive v, your image is virtual.",
        "For a concave mirror used as a shaving mirror (object between F and P): u is a small negative number, f is negative, and the formula gives a large positive v — virtual magnified image behind mirror.",
        "Finding f from R: if the problem gives radius of curvature R = 24 cm, immediately write f = R/2 = 12 cm, then apply the sign (−12 cm for concave)."
      ],
      diagram_description: "A number line (the principal axis) with P at origin. Object arrow drawn upward at distance u to the left of P. For a real image case, the image arrow is drawn downward (inverted) at distance v to the left of P on the same side. For a virtual image case, a dashed image arrow is drawn upward (erect) to the right of P behind the mirror. Labels show: u = object distance, v = image distance, h = object height, h' = image height. The sign convention is annotated with a directional arrow showing positive direction (left to right, in direction of incident light).",
      key_takeaway: "The mirror formula 1/v + 1/u = 1/f and magnification m = −v/u are the two tools for all mirror numericals. Always assign signs first, then plug in. The sign of the answer tells you the nature of the image — never skip the interpretation step."
    }
  },

  {
    topicId: "sci_ch9_refraction_snells_law",
    subject: "Science",
    chapterNumber: 9,
    name: "Refraction of Light and Snell's Law",
    prerequisite_knowledge: [
      "Rectilinear propagation of light",
      "Normal to a surface at point of incidence",
      "Concept of optical density",
      "Trigonometric ratios (sin θ)"
    ],
    key_formulas: [
      "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂",
      "Absolute refractive index: n = c/v (c = speed of light in vacuum = 3×10⁸ m/s; v = speed in medium)",
      "Relative refractive index of medium 2 w.r.t. medium 1: ₁n₂ = n₂/n₁ = v₁/v₂ = sin θ₁/sin θ₂",
      "Real depth / Apparent depth: n = Real depth / Apparent depth",
      "Critical angle θ_c: sin θ_c = 1/n (for medium-to-air boundary)",
      "Total Internal Reflection (TIR): occurs when θ_i > θ_c and light travels from denser to rarer medium"
    ],
    teaching_content: {
      intuition: "Light changes speed when it moves from one medium to another. When it slows down (enters a denser medium like glass from air), it bends toward the normal — like a car wheel that hits sand: the wheel on the sand slows first, causing the car to turn toward the sand. When light speeds up (moves from glass to air), it bends away from the normal. The refractive index is simply how many times slower light travels in that medium compared to vacuum. A swimming pool looks shallower than it really is because light bends away from the normal when leaving water, and your brain traces the rays back as straight lines — this is apparent depth. Optical fibres use total internal reflection (TIR) to trap light inside and carry it around corners — the light bounces completely off the glass-air boundary instead of passing through.",
      process_explanation: "Step 1 — Identify the two media and which way light is travelling (toward normal = denser medium, away = rarer medium). Step 2 — Draw the normal at the point of incidence. Measure angles from the normal, NOT from the surface. Step 3 — Apply Snell's law: n₁ sin θ₁ = n₂ sin θ₂. If going from air (n=1) to glass (n=1.5): 1 × sin θ₁ = 1.5 × sin θ₂ → sin θ₂ = sin θ₁ / 1.5, so θ₂ < θ₁ (bends toward normal). Step 4 — For apparent depth problems: n = Real depth / Apparent depth. This works when the observer is above (in air) and the object is in water/glass. Step 5 — For TIR: first find the critical angle using sin θ_c = 1/n. If the angle of incidence at the denser-to-rarer boundary exceeds θ_c, total internal reflection occurs — no refracted ray, all light is reflected.",
      worked_example: "A coin at the bottom of a water tank appears to be 15 cm deep when viewed from directly above. The actual depth of water is 20 cm. Find the refractive index of water.\n\nGiven: Real depth = 20 cm; Apparent depth = 15 cm.\nUsing: n = Real depth / Apparent depth\nn = 20/15 = 4/3 ≈ 1.33\nThe refractive index of water = 1.33.\n\nVerification: Water has n ≈ 1.33 per standard NCERT — this matches.\n\nAdditional numerical — Snell's Law: Light passes from air into glass (n_glass = 1.5) with angle of incidence = 30°. Find angle of refraction.\nn₁ sin θ₁ = n₂ sin θ₂\n1 × sin 30° = 1.5 × sin θ₂\n0.5 = 1.5 × sin θ₂\nsin θ₂ = 0.5/1.5 = 1/3\nθ₂ = sin⁻¹(1/3) ≈ 19.5°\nThe light bends toward the normal (θ₂ < θ₁), as expected for air-to-glass.",
      common_misconceptions: [
        "Students measure the angle of incidence/refraction from the surface instead of from the normal, getting the complement of the correct angle and applying Snell's law incorrectly.",
        "Many students believe total internal reflection can happen for any angle of incidence, or can happen when going from rarer to denser medium. TIR requires: (1) light going from denser to rarer, AND (2) angle > critical angle.",
        "Students confuse real depth and apparent depth in the formula. The object that is underwater has a real depth; the apparent depth is the shallower depth seen by the observer. n = real/apparent, so apparent = real/n (always less than real)."
      ],
      shortcuts_and_tricks: [
        "Memory for bending direction: DNS — Denser medium bends toward Normal, Sparser medium bends away from Normal (DaN-SaN).",
        "Critical angle shortcut: for n = 1.5 (glass), sin θ_c = 1/1.5 = 2/3, so θ_c ≈ 42°. For n = 4/3 (water), sin θ_c = 3/4, so θ_c ≈ 49°. Memorise these common values.",
        "Apparent depth shortcut: object in water of depth d → apparent depth = d/n. For water (n = 4/3): apparent = d × 3/4 = 0.75d. Pool looks 75% of its real depth."
      ],
      diagram_description: "Three diagrams side by side. Diagram 1 — Refraction at a plane surface: a vertical boundary between air (left, less dense, marked with wider spacing) and glass (right, denser, marked with closer spacing). The normal is a dotted vertical line. An incident ray from upper-left hits the boundary at point O, bending toward the normal inside the glass. All three angles (∠i, ∠r, and normal direction) are clearly labeled. Diagram 2 — Apparent depth: a horizontal water surface with a fish/coin at the bottom (real depth d). Two refracted rays leave the water surface, diverging; dashed lines extend them back to meet at a point above the real object showing the apparent (shallower) position. Diagram 3 — Total Internal Reflection: glass-to-air boundary. Three rays shown at increasing angles: first at θ < θ_c (partially refracted + reflected), second at exactly θ_c (refracted along the surface, 90°), third at θ > θ_c (completely reflected back into glass — TIR).",
      key_takeaway: "Refraction is the bending of light due to change in speed at a boundary, governed by Snell's law n₁sinθ₁ = n₂sinθ₂. The refractive index n = c/v is always ≥ 1 for any medium. Apparent depth is always less than real depth. Total internal reflection — the basis of optical fibre technology — occurs only when light travels from a denser to a rarer medium and the angle of incidence exceeds the critical angle."
    }
  },

  {
    topicId: "sci_ch9_lenses",
    subject: "Science",
    chapterNumber: 9,
    name: "Lenses — Image Formation, Lens Formula, Power",
    prerequisite_knowledge: [
      "Refraction of light",
      "New Cartesian sign convention for lenses",
      "Concave and convex mirror image positions (analogy)",
      "Basic algebra"
    ],
    key_formulas: [
      "Lens formula: 1/v − 1/u = 1/f",
      "Linear magnification: m = h'/h = v/u (note: positive sign, unlike mirrors)",
      "Power of a lens: P = 1/f (f in metres); unit is dioptre (D)",
      "For combined lenses in contact: P = P₁ + P₂ + P₃ + ...",
      "For combined lenses in contact: 1/f = 1/f₁ + 1/f₂",
      "Convex (converging) lens: f > 0, P > 0",
      "Concave (diverging) lens: f < 0, P < 0"
    ],
    teaching_content: {
      intuition: "A convex lens is thicker in the middle — it bends parallel rays inward to meet at the focus. Think of it as a rain-collecting funnel for light. A concave lens is thinner in the middle — it spreads parallel rays outward, making them appear to come from the focus on the same side as the incoming light. The power of a lens tells you how sharply it bends light: a high-power (short focal length) lens bends light a lot; a low-power (long focal length) lens bends it gently. When you stack two lenses together, their powers simply add up.",
      process_explanation: "Sign convention for lenses: Light travels from left to right. The optical centre O is the origin. Object is to the left of the lens → u is negative. For a convex lens, f is positive; for a concave lens, f is negative. A real image forms to the right of the lens → v is positive. A virtual image forms to the left of the lens (same side as object) → v is negative.\n\nImage positions for a convex lens (most important for exams):\n(a) Object beyond 2F₁: real, inverted, diminished image between F₂ and 2F₂.\n(b) Object at 2F₁: real, inverted, same-size image at 2F₂.\n(c) Object between 2F₁ and F₁: real, inverted, magnified image beyond 2F₂.\n(d) Object at F₁: refracted rays are parallel — image at infinity.\n(e) Object between F₁ and O: virtual, erect, magnified image on same side as object (this is the magnifying glass position).\nConcave lens: always gives virtual, erect, diminished image on same side as object, regardless of object position.\n\nPower calculation: P = 1/f(metres). Convert cm to metres first: f = 25 cm = 0.25 m → P = 1/0.25 = +4 D.",
      worked_example: "A convex lens has focal length 15 cm. An object is placed 10 cm from the lens. Find the position, nature, and magnification of the image.\n\nGiven: f = +15 cm, u = −10 cm (object is to the left of the lens).\nLens formula: 1/v − 1/u = 1/f\n1/v − 1/(−10) = 1/15\n1/v + 1/10 = 1/15\n1/v = 1/15 − 1/10 = 2/30 − 3/30 = −1/30\nv = −30 cm\n\nNegative v for a lens → image is on the same side as the object → virtual image.\nMagnification: m = v/u = (−30)/(−10) = +3\nPositive m → erect image; |m| = 3 → magnified 3 times.\nConclusion: The image is virtual, erect, magnified, 30 cm to the left of the lens. (Object was between F and O — this is the magnifying glass case.)\n\nPower example: f = −25 cm (concave lens) → f = −0.25 m → P = 1/(−0.25) = −4 D.\nCombined power: P₁ = +5 D, P₂ = −2 D → P_total = +3 D.",
      common_misconceptions: [
        "Students use mirror magnification formula m = −v/u for lenses instead of m = +v/u. For lenses there is no negative sign. This is the single most common sign error in optics numericals.",
        "Students write the lens formula as 1/v + 1/u = 1/f (copying the mirror formula). The lens formula is 1/v − 1/u = 1/f. The subtraction of 1/u is the key difference.",
        "When power P = −3 D, many students say f = 3 m instead of f = −0.33 m. They drop the negative sign and make a unit error (forget to convert dioptre to metres)."
      ],
      shortcuts_and_tricks: [
        "Lens vs Mirror formula memory: 'Lens has a MINUS before u' (1/v − 1/u = 1/f). Mirror has a PLUS (1/v + 1/u = 1/f). The L in Lens = L for Less-than (subtraction).",
        "For the power-to-focal-length conversion: f (in cm) = 100/P. So P = +2 D → f = 50 cm. P = −4 D → f = −25 cm. Much faster than converting to metres.",
        "Concave lens shortcut: it always diverges — always gives virtual, erect, diminished image. If a question says 'concave lens' you can state the nature of image without calculation."
      ],
      diagram_description: "Five ray diagrams for convex lens (left principal focus F₁, right principal focus F₂, optical centre O): Case 1: object beyond 2F₁ — two construction rays (parallel-to-axis bends through F₂; through-O goes straight) meet to the right of the lens between F₂ and 2F₂, giving small inverted real image. Case 2: object at F₁ — parallel-to-axis ray bends through F₂; through-O ray goes straight; both emerge parallel — image at infinity. Case 3: object between F₁ and O — construction rays diverge after the lens; dashed lines extend leftward to meet at a point on the same side as the object, showing large erect virtual image. A separate diagram for concave lens: any object position; construction rays diverge after lens; dashed back-extensions meet on same side as object, giving small erect virtual image between F₁ and O.",
      key_takeaway: "Lens formula is 1/v − 1/u = 1/f; magnification is m = v/u (no negative sign). Convex lens can produce real or virtual images; concave lens always produces virtual, erect, diminished images. Power P = 1/f in dioptres — positive for convex, negative for concave. Combined lenses in contact: P_total = P₁ + P₂."
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 10: The Human Eye and the Colourful World
  // ═══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch10_human_eye",
    subject: "Science",
    chapterNumber: 10,
    name: "Structure of the Human Eye and Accommodation",
    prerequisite_knowledge: [
      "Convex lens image formation",
      "Refraction of light",
      "Concept of focal length"
    ],
    key_formulas: [
      "Near point (least distance of distinct vision): 25 cm for a normal human eye",
      "Far point of normal eye: infinity",
      "Range of vision: 25 cm to infinity",
      "Accommodation: the ability of the eye lens to change its focal length by changing its curvature",
      "Power of accommodation = 1/f_near − 1/f_far (dioptres)"
    ],
    teaching_content: {
      intuition: "The human eye is a living camera. The cornea and lens together form the focusing system; the retina is the film; the pupil controls the amount of light entering — like the aperture of a camera. The most remarkable feature is accommodation: the eye's lens is flexible (unlike a camera lens). Ciliary muscles squeeze or relax to change the lens curvature, automatically adjusting its focal length to keep the image sharp on the retina whether you are reading a book (25 cm away) or looking at stars (infinity). This is why you don't need to manually focus your eyes.",
      process_explanation: "Parts of the eye and functions:\n— Cornea: transparent, dome-shaped front surface. Does most of the refraction (~70%) of incoming light.\n— Iris: coloured ring of muscle surrounding the pupil. Controls pupil size.\n— Pupil: the circular opening in the iris through which light enters. Enlarges in dim light, contracts in bright light.\n— Crystalline lens: a flexible biconvex lens behind the iris. Fine-tunes focusing. Connected to ciliary muscles via suspensory ligaments.\n— Ciliary muscles: when they contract, suspensory ligaments relax → lens becomes thicker (more curved) → shorter focal length → eye focuses on near objects. When muscles relax, ligaments pull tight → lens flattens → longer focal length → eye focuses on distant objects.\n— Retina: the screen at the back of the eye. Contains photoreceptors: rods (dim light, black-and-white vision) and cones (bright light, colour vision — three types sensitive to red, green, blue wavelengths).\n— Yellow spot (fovea): region of maximum cone density → sharpest vision.\n— Blind spot: point where optic nerve exits the retina — no photoreceptors, so no image formed here.\n— Optic nerve: carries electrical signals from retina to brain.",
      worked_example: "A person can read a book clearly when it is held 25 cm from the eye but starts seeing blur beyond 3 m. What is the power of accommodation of this eye?\n\nFor near point (25 cm = 0.25 m): f_near = 0.25 m (approximately, assuming the image distance ≈ 2.5 cm, but for the simplified NCERT approach, the power needed to focus at near point P_near = 1/0.25 = 4 D beyond the resting power).\nFor far point (3 m): P_far = 1/3 ≈ 0.33 D beyond resting power.\nPower of accommodation = P_near − P_far = 4 − 0.33 ≈ 3.67 D ≈ 3.7 D.\n\nThis means the eye lens can change its converging power by about 3.7 dioptres between looking at far and near objects.",
      common_misconceptions: [
        "Students say 'the pupil focuses light' — the pupil only controls the amount of light, not the focusing. Focusing is done by the cornea and the crystalline lens.",
        "Many students mix up 'accommodation' with 'persistence of vision'. Accommodation is the automatic change in focal length of the eye lens. Persistence of vision is the retention of an image on the retina for ~1/16 second after the stimulus is gone.",
        "Students often say the near point is the point where the eye cannot see — the near point (25 cm) is actually the closest point of CLEAR vision. Closer than 25 cm, vision becomes blurred."
      ],
      shortcuts_and_tricks: [
        "Memory for ciliary muscles: 'Tense muscles = tense (near) focus' — when ciliary muscles CONTRACT, lens bulges → focuses NEAR objects. Relax = far. Think: you strain your eyes to read close-up.",
        "Rods and Cones memory: 'Rods → Roads are dark (dim light), Cones → Colours (colour vision)'.",
        "Near point = 25 cm for normal eye. This number appears in almost every Human Eye question. Memorise it."
      ],
      diagram_description: "A detailed cross-sectional diagram of the human eye as seen from the side. Starting from the front: cornea (transparent curved dome), aqueous humour (fluid filling anterior chamber), iris (pigmented ring with pupil opening in centre), crystalline lens (biconvex, connected by suspensory ligaments to ciliary muscles which form a ring around the lens), vitreous humour (fills the large posterior chamber), retina (lining the back wall), yellow spot / fovea (marked slightly to the right of centre on the retina), blind spot / optic disc (slightly to the left of centre on the retina, where optic nerve exits), optic nerve (bundle exiting from back of eye), and sclera (white outer layer). The path of an incoming ray is shown: entering through cornea, refracting at lens, converging to a point on the retina. Two small insets show ciliary muscle contracted (lens bulgy/thick for near vision) and ciliary muscle relaxed (lens flat/thin for far vision).",
      key_takeaway: "The eye forms a real, inverted, diminished image on the retina. The cornea and lens refract light; accommodation is the automatic adjustment of lens curvature by ciliary muscles. The near point is 25 cm; far point is infinity for a normal eye. Rods detect dim light (scotopic vision); cones detect colour (photopic vision). The blind spot has no photoreceptors and forms no image."
    }
  },

  {
    topicId: "sci_ch10_eye_defects",
    subject: "Science",
    chapterNumber: 10,
    name: "Defects of Vision and Their Correction",
    prerequisite_knowledge: [
      "Human eye structure and accommodation",
      "Convex and concave lenses",
      "Power of a lens",
      "Near point and far point"
    ],
    key_formulas: [
      "Power of corrective lens for myopia: P = −1/|far point in metres| (far point is measured from eye, value is negative)",
      "Power of corrective lens for hypermetropia: lens must form virtual image of object at near point (25 cm) at the eye's far point; P = 1/v − 1/u (lens formula, u = −25 cm, v = −actual near point distance)",
      "Presbyopia: corrected by bifocal lenses (near vision = convex; distance vision = concave or mild concave)",
      "1 dioptre (D) = 1 m⁻¹"
    ],
    teaching_content: {
      intuition: "A myopic (short-sighted) eye is too long — the image of a distant object forms in front of the retina instead of on it. A concave lens diverges the rays so the converging point shifts backward onto the retina. A hypermetropic (long-sighted) eye is too short or has a weak lens — the image of a near object forms behind the retina. A convex lens converges the rays so the image shifts forward onto the retina. Presbyopia is just the gradual stiffening of the lens with age — it cannot accommodate enough for near vision. Astigmatism is an uneven curvature of the cornea causing a stretched or distorted image.",
      process_explanation: "Myopia (short-sightedness):\n— Defect: far point is at a distance less than infinity (say d metres). Cannot see beyond d clearly.\n— Cause: eyeball too long OR lens too curved → image forms in front of retina for distant objects.\n— Correction: concave (diverging) lens. The lens creates a virtual image of the distant object at the person's far point d.\n— Power of corrective lens: P = −1/d (negative because concave). Example: far point = 2 m → P = −0.5 D.\n\nHypermetropia (long-sightedness / far-sightedness):\n— Defect: near point is farther than 25 cm (say N cm). Cannot see close objects clearly.\n— Cause: eyeball too short OR lens too flat → image of near object forms behind retina.\n— Correction: convex (converging) lens. Lens forms virtual image of 25 cm object at N cm (person's actual near point).\n— Using lens formula: u = −25 cm, v = −N cm (virtual image on same side as object). P = 1/v − 1/u.\n\nPresbyopia:\n— Age-related stiffening of lens. Both near and far vision affected. Corrected with bifocal spectacles.\n\nAstigmatism:\n— Cornea has unequal curvature in different planes. Horizontal and vertical lines focus at different distances.\n— Correction: cylindrical lens (toric lens).",
      worked_example: "A person suffering from myopia has a far point of 80 cm. What power of corrective lens is needed?\n\nFar point = 80 cm = 0.8 m (this is where the person can just see clearly).\nFor myopia, the lens must make parallel rays (from infinity) appear to come from the far point.\nSo: object at infinity (u = −∞), image at far point v = −0.8 m (virtual, on same side as object).\nLens formula: 1/v − 1/u = 1/f\n1/(−0.8) − 1/(−∞) = 1/f\n1/f = −1/0.8 − 0 = −1.25\nP = 1/f = −1.25 D\nAnswer: A concave lens of power −1.25 D is needed.\n\nHypermetropia example: A person's near point is 100 cm instead of 25 cm. Find corrective lens power.\nu = −25 cm = −0.25 m (object at normal near point)\nv = −100 cm = −1.0 m (virtual image must form at person's near point, negative because same side as object)\n1/f = 1/v − 1/u = 1/(−1.0) − 1/(−0.25) = −1.0 + 4.0 = +3.0\nP = +3.0 D — convex lens.",
      common_misconceptions: [
        "Students say myopia is corrected by a convex lens and hypermetropia by a concave lens — this is exactly backwards. Myopia → concave lens (diverges rays). Hypermetropia → convex lens (converges rays).",
        "For myopia power calculation, students take u = −0.8 m and v = 0 (at the eye) instead of v = −0.8 m (virtual image at far point). The image must be at the far point, not at the eye.",
        "Students confuse presbyopia (age-related, affects accommodation) with astigmatism (unequal corneal curvature). Presbyopia needs bifocals; astigmatism needs cylindrical lenses."
      ],
      shortcuts_and_tricks: [
        "Myopia correction power shortcut: P = −1/far_point_in_metres. Always negative. Always concave. Far point 2 m → P = −0.5 D. Far point 50 cm = 0.5 m → P = −2 D.",
        "Nature of corrective lens memory: Myopia → My eyes are too strong (overconverging) → CONCAVE to weaken. Hypermetropia → Eyes are too weak (underconverging) → CONVEX to strengthen.",
        "Near point 25 cm means normal. If the question says a person can see clearly from 50 cm onwards but not closer, that person has hypermetropia (near point is at 50 cm instead of 25 cm)."
      ],
      diagram_description: "Four diagrams arranged in a 2×2 grid. Top-left — Normal eye: parallel rays from a distant object converge exactly on the retina. Top-right — Myopic eye: eyeball is elongated; parallel rays converge in front of the retina (focal point lands short). Below it, correction shown: concave lens placed in front of the eye diverges the rays so they now converge on the retina. Bottom-left — Hypermetropic eye: eyeball is too short; rays from a near object (25 cm) would converge behind the retina. Below it, correction shown: convex lens placed in front converges rays more strongly so they now hit the retina. Each diagram labels the retina, the lens used for correction (concave or convex), and where the rays actually converge.",
      key_takeaway: "Myopia: image in front of retina, correct with concave lens, P = −1/far_point(m). Hypermetropia: image behind retina, correct with convex lens, use lens formula with u = −0.25 m, v = −near_point(m). Presbyopia: age-related loss of accommodation, corrected with bifocals. Astigmatism: unequal corneal curvature, corrected with cylindrical lenses."
    }
  },

  {
    topicId: "sci_ch10_dispersion_scattering",
    subject: "Science",
    chapterNumber: 10,
    name: "Dispersion, Atmospheric Refraction, Scattering of Light",
    prerequisite_knowledge: [
      "Refraction of light",
      "Snell's law",
      "White light and visible spectrum"
    ],
    key_formulas: [
      "Dispersion: white light splits into VIBGYOR (Violet, Indigo, Blue, Green, Yellow, Orange, Red) through a prism",
      "Violet light has the shortest wavelength (~400 nm) and is deviated most by a prism",
      "Red light has the longest wavelength (~700 nm) and is deviated least by a prism",
      "Rayleigh's scattering law: Intensity of scattered light ∝ 1/λ⁴ (inversely proportional to fourth power of wavelength)",
      "Tyndall effect: scattering of light by colloidal particles"
    ],
    teaching_content: {
      intuition: "White light is not a single pure colour — it is a mixture of all colours. A prism separates them because each colour (each wavelength) has a slightly different refractive index in glass, so each bends by a different angle: violet bends most, red bends least. This is dispersion — it gives us rainbows (water droplets act as tiny prisms). Rayleigh scattering explains why the sky is blue: shorter wavelengths (blue, violet) are scattered much more by air molecules than longer wavelengths (red). The sky looks blue rather than violet because our eyes are more sensitive to blue and some violet is absorbed in the upper atmosphere. At sunrise and sunset, sunlight travels through a much thicker layer of atmosphere — blue is scattered away, leaving red and orange to reach your eye directly, creating the red sunset.",
      process_explanation: "Dispersion through a prism: Step 1 — White light enters one face of the prism and refracts. Each colour has a different speed in glass (slightly different n), so each bends by a different angle. Step 2 — On the second face, each colour refracts again, further separating the colours. The emerging beam shows the spectrum: VIBGYOR from bottom to top (violet most deviated, red least). Step 3 — The angle between the emergent red and violet rays is called the angle of dispersion.\n\nAtmospheric refraction: The atmosphere has density that decreases with altitude → the refractive index also decreases. Starlight bends continuously as it passes through layers of decreasing density. This makes stars twinkle (position appears to shift rapidly) but planets do not twinkle (they subtend a small disc, so fluctuations average out).\n\nRayleigh scattering: Air molecules scatter shorter wavelengths far more (∝ 1/λ⁴). Blue (λ ≈ 450 nm) is scattered ~5.5 times more than red (λ ≈ 700 nm). This scattered blue light reaches your eyes from all directions → sky appears blue.\n\nTyndall effect: When a beam of light passes through a colloid (e.g., smoke, fog, diluted milk), the colloidal particles scatter the light, making the beam visible. This is why you can see a torch beam through mist. Pure water does not show the Tyndall effect; a saltwater-milk mixture does.",
      worked_example: "Explain with reasoning: (a) Why does the sky appear blue? (b) Why does the sun appear red at sunrise/sunset? (c) Why do stars twinkle but planets do not?\n\n(a) Blue sky: Sunlight (white light) enters Earth's atmosphere. Air molecules (much smaller than wavelengths of visible light) scatter shorter wavelengths preferentially (Rayleigh scattering: I ∝ 1/λ⁴). Blue light (λ ≈ 450 nm) is scattered far more than red light (λ ≈ 700 nm). The scattered blue light reaches our eyes from all parts of the sky → sky appears blue.\n\n(b) Red sunrise/sunset: At sunrise and sunset, sunlight passes through a much thicker layer of atmosphere (light travels obliquely rather than vertically). Blue and shorter wavelengths are scattered away from the line of sight after many scattering events. Only the longer wavelengths — red and orange — continue to travel toward the observer directly → sun and horizon appear red/orange.\n\n(c) Twinkling of stars: Stars are so far away they appear as point sources of light. As their light passes through turbulent layers of the atmosphere (with varying refractive indices due to temperature/density fluctuations), it refracts in slightly different directions from moment to moment → the apparent brightness and position of the star fluctuates rapidly → twinkling. Planets are much closer to Earth and appear as extended discs. The fluctuations from different parts of the disc average out → planets do not twinkle (they show steady light).",
      common_misconceptions: [
        "Students say 'the sky is blue because the sun is blue' — incorrect. Sunlight is white. The blue colour of the sky is due to selective scattering of blue wavelengths by air molecules.",
        "Many students say 'stars twinkle due to refraction' without specifying it is atmospheric refraction with fluctuating air density, or incorrectly say it is due to dispersion.",
        "Students often get the VIBGYOR order wrong when the prism is specified, reversing which end has violet and which has red. Always remember: Violet = Valiant (deviates most, at bottom of exiting spectrum); Red = Runs away (deviates least, at top of exiting spectrum)."
      ],
      shortcuts_and_tricks: [
        "VIBGYOR wavelength memory: Violet shortest → Red longest. Shorter wavelength = higher frequency = more scattering = more deviation in prism.",
        "Prism deviation memory: 'Victor In Battle Gets Yellow Oranges from Red' — Violet bends most (into prism), Red bends least. The sequence from most-bent to least-bent: V-I-B-G-Y-O-R.",
        "Tyndall effect vs Rayleigh scattering: Tyndall is about colloidal-sized particles in a medium; Rayleigh is about molecular-sized particles (gas molecules in air). Both involve scattering of light, but by different particle sizes."
      ],
      diagram_description: "Three diagrams. Diagram 1 — Prism dispersion: a triangular glass prism with a white light beam entering from the left face. Inside the prism, the beam splits into a fan. Exiting the right face, seven distinct coloured rays emerge in order from bottom (violet, most deviated) to top (red, least deviated). The colours are labeled in order VIBGYOR. Diagram 2 — Rayleigh scattering / sky colour: a horizontal cross-section showing the Sun on the left, Earth's atmosphere as a curved band on the right side. Short-wavelength rays (blue arrows) scatter in all directions within the atmosphere (representing blue sky). Long-wavelength rays (red arrows) pass through more directly. A second panel shows the oblique path of sunlight at sunrise/sunset — a much longer path through the atmosphere, with blue being scattered away and only red/orange reaching the observer on Earth's surface. Diagram 3 — Tyndall effect: a beam of white light entering from the left through a glass container filled with colloidal smoke/milk-water. Inside the container, the path of the beam is visible as a cone of scattered light (Tyndall cone). Outside the colloid, the beam is invisible.",
      key_takeaway: "Dispersion occurs because different colours (wavelengths) have different refractive indices in glass — violet deviates most, red least. The sky is blue because air molecules scatter short wavelengths (blue) more intensely (Rayleigh, ∝ 1/λ⁴). The sun appears red at sunset because blue has been scattered away along the long atmospheric path. Stars twinkle due to atmospheric refraction; planets do not because they subtend a disc. The Tyndall effect is scattering of light by colloidal particles."
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 11: Electricity
  // ═══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch11_current_potential",
    subject: "Science",
    chapterNumber: 11,
    name: "Electric Current, Potential Difference and EMF",
    prerequisite_knowledge: [
      "Concept of charge (coulombs)",
      "Conductors and insulators",
      "Basic concept of energy"
    ],
    key_formulas: [
      "Electric current: I = Q/t (SI unit: ampere A; 1 A = 1 C/s)",
      "Potential difference: V = W/Q (SI unit: volt V; 1 V = 1 J/C)",
      "1 ampere = flow of 1 coulomb of charge per second",
      "1 volt = 1 joule of work done per coulomb of charge",
      "Charge on 1 electron e = 1.6 × 10⁻¹⁹ C",
      "Number of electrons for charge Q: n = Q/e"
    ],
    teaching_content: {
      intuition: "Electric current is simply the flow of electric charges — usually electrons — through a conductor, like water flowing through a pipe. The rate of flow of water is analogous to current; the water pressure difference between two ends of the pipe is analogous to potential difference (voltage). Potential difference is the 'push' that drives the current — without a potential difference, charges won't flow, just as water won't flow between two tanks at the same height. The battery provides this push by doing work on the charges.",
      process_explanation: "Current: The flow of electric charges constitutes electric current. In metallic conductors, the charge carriers are electrons (which flow from the negative terminal to the positive terminal — from lower potential to higher potential). However, by convention, the direction of current is from positive terminal to negative terminal (direction of positive charge flow). I = Q/t.\n\nPotential difference: Work must be done to move a charge from one point to another against the electric force. The potential difference between two points A and B is the work done per unit charge in moving a positive charge from A to B: V_AB = W/Q. If V_A > V_B, current flows from A to B (from higher to lower potential).\n\nMeasurement: Ammeter measures current — connected in series in the circuit (it must be in the path of current). Its resistance is very low so it does not affect the circuit. Voltmeter measures potential difference — connected in parallel across the component (it measures the potential difference between its two terminals). Its resistance is very high so negligible current flows through it.",
      worked_example: "A charge of 120 C flows through a conductor in 2 minutes. Calculate the current.\n\nGiven: Q = 120 C, t = 2 min = 120 s.\nI = Q/t = 120/120 = 1 A.\nAnswer: The current through the conductor is 1 A.\n\nSecond part: If the work done in moving this charge is 240 J, find the potential difference.\nV = W/Q = 240/120 = 2 V.\nAnswer: The potential difference is 2 V.\n\nElectron count example: How many electrons flow in 1 second through a conductor carrying 1 A current?\nQ = I × t = 1 × 1 = 1 C.\nNumber of electrons = Q/e = 1/(1.6 × 10⁻¹⁹) = 6.25 × 10¹⁸ electrons.",
      common_misconceptions: [
        "Students say 'electrons flow from positive to negative terminal' — this is the direction of conventional current. Electrons (negative charge carriers) actually flow from negative to positive terminal. In NCERT problems, unless stated otherwise, use the conventional current direction.",
        "Students confuse ammeter and voltmeter connections. Ammeter is SERIES (in line with current path); voltmeter is PARALLEL (across the component). Reversing these connections will either give wrong readings or damage the instruments.",
        "Students confuse EMF and potential difference. EMF (electromotive force) is the total work done per unit charge by the source (battery) throughout the circuit including internal resistance. Potential difference (terminal voltage) is the work done per unit charge in the external circuit. EMF > terminal voltage in a real battery."
      ],
      shortcuts_and_tricks: [
        "V = W/Q memory: 'Volt = Work per Charge' — Voltage is the cost (in joules) to move 1 coulomb of charge.",
        "Ammeter vs Voltmeter placement: 'A is for Ampere, series starts with S — Ammeter in Series. V is for Voltage across — Voltmeter in Parallel (V-shape like parallel lines).'",
        "Unit conversions: 1 mA = 10⁻³ A; 1 μA = 10⁻⁶ A; 1 kV = 10³ V. Always convert to base SI units before substituting in formulas."
      ],
      diagram_description: "Two circuit diagrams. Diagram 1 — Simple circuit showing a battery (with + and − terminals labeled), connecting wires, and a resistor. An ammeter (circle with letter A) is shown connected in series in the main current path. The arrow on the wire shows conventional current direction (from + terminal). Diagram 2 — The same circuit with a voltmeter (circle with letter V) connected in parallel across the resistor, with both terminals of the voltmeter clearly connected to the two ends of the resistor. Labels indicate: 'Ammeter — low resistance — series' and 'Voltmeter — high resistance — parallel'. A separate small diagram shows the symbol for a battery (long-thin line = positive, short-thick line = negative).",
      key_takeaway: "Electric current I = Q/t is the rate of flow of charge. Potential difference V = W/Q is the work done per unit charge. Both have precise SI units: ampere (A) and volt (V) respectively. Ammeter (low resistance) is always connected in series; voltmeter (high resistance) is always in parallel. Conventional current flows from positive to negative terminal outside the battery."
    }
  },

  {
    topicId: "sci_ch11_ohms_law_resistance",
    subject: "Science",
    chapterNumber: 11,
    name: "Ohm's Law, Resistance and Resistivity",
    prerequisite_knowledge: [
      "Electric current I = Q/t",
      "Potential difference V = W/Q",
      "Basic proportionality concepts"
    ],
    key_formulas: [
      "Ohm's Law: V = IR (V in volts, I in amperes, R in ohms Ω)",
      "Resistance: R = V/I",
      "Resistivity (specific resistance): R = ρl/A (ρ = resistivity in Ω·m, l = length in m, A = cross-sectional area in m²)",
      "SI unit of resistivity: Ω·m (ohm-metre)",
      "Resistivity depends only on the material and temperature, not on the dimensions of the conductor"
    ],
    teaching_content: {
      intuition: "Ohm's Law is the most important equation in basic electricity — it says that the current through a conductor is directly proportional to the voltage applied across it (provided temperature is constant). Think of it like a water pipe: more pressure (voltage) → more water flow (current). The resistance R is how much the conductor opposes the current — narrow pipe (thin wire) → high resistance; wide pipe (thick wire) → low resistance. A longer pipe also offers more resistance. Resistivity is the material's intrinsic 'resistingness' — copper has very low resistivity (great conductor); nichrome has high resistivity (used in heating elements because it resists current and therefore heats up).",
      process_explanation: "Ohm's Law (V = IR): For ohmic conductors (metals at constant temperature), a V-I graph is a straight line through the origin. The slope of the I-V graph (I on y-axis, V on x-axis) = 1/R. A steeper slope means lower resistance. For non-ohmic conductors (diodes, filament bulbs at high temperature), the V-I relationship is not linear — the graph is a curve.\n\nFactors affecting resistance: R = ρl/A.\n— R ∝ l: doubling the length doubles resistance (same cross-section).\n— R ∝ 1/A: doubling cross-sectional area halves resistance.\n— R depends on material (ρ): nichrome has higher ρ than copper.\n— R increases with temperature for metals (more thermal vibration impedes electron flow).\n— R decreases with temperature for semiconductors and insulators.\n\nResistivity: ρ = RA/l. This is a property of the material alone. Silver has the lowest resistivity (~1.6 × 10⁻⁸ Ω·m); alloys like nichrome (~100 × 10⁻⁸ Ω·m) and manganin are used in resistors and heating elements because of high ρ. Copper and aluminium have low ρ and are used as electrical conductors.",
      worked_example: "A wire of resistivity 1.6 × 10⁻⁸ Ω·m has a length of 2 m and cross-sectional area 0.4 × 10⁻⁶ m². Find its resistance.\n\nGiven: ρ = 1.6 × 10⁻⁸ Ω·m, l = 2 m, A = 0.4 × 10⁻⁶ m².\nR = ρl/A = (1.6 × 10⁻⁸ × 2) / (0.4 × 10⁻⁶)\n= (3.2 × 10⁻⁸) / (0.4 × 10⁻⁶)\n= 3.2/0.4 × 10⁻⁸⁺⁶\n= 8 × 10⁻² = 0.08 Ω.\nAnswer: Resistance = 0.08 Ω.\n\nOhm's Law example: A resistor of 15 Ω is connected to a 9 V battery. What current flows?\nI = V/R = 9/15 = 0.6 A.",
      common_misconceptions: [
        "Students draw the V-I graph (V on y-axis) and say 'slope = R'. That is correct for V-I. But if the question shows an I-V graph (I on y-axis, V on x-axis), the slope = 1/R, NOT R. The orientation of axes matters.",
        "Students say 'resistance changes when voltage changes' — for an ohmic conductor, resistance is constant regardless of voltage (at constant temperature). V = IR means if V doubles, I also doubles, keeping R unchanged.",
        "When using R = ρl/A, students sometimes confuse radius r with area A. If the cross-section is circular: A = πr². Always check whether you are given radius or diameter or area directly."
      ],
      shortcuts_and_tricks: [
        "V = IR triangle: draw a triangle with V at the top, I and R at the bottom. Cover what you want to find: cover V → I × R. Cover I → V/R. Cover R → V/I.",
        "Resistivity table memory: metals have ρ in range 10⁻⁸ Ω·m; alloys have ρ in range 10⁻⁶ Ω·m. Nichrome (heating element) > manganin (standard resistor) > copper (wiring) in terms of ρ.",
        "Quick R check when l and A change: R₂/R₁ = (l₂/l₁) × (A₁/A₂). For l doubled and A halved: R₂/R₁ = 2 × 2 = 4 → resistance quadruples."
      ],
      diagram_description: "Two graphs. Graph 1 — V-I graph for an ohmic conductor: V on y-axis (labelled 'Potential difference (V)'), I on x-axis (labelled 'Current (A)'). A perfectly straight line passes through the origin. The slope (ΔV/ΔI) is labeled as R. A second line with a steeper slope is drawn on the same axes to represent a higher resistance, labeled 'Higher resistance R₂'. Graph 2 — V-I graph for a non-ohmic conductor (e.g., filament bulb): the graph is a curve that starts steep and gradually flattens, indicating that resistance increases with current/temperature. Both graphs have the origin at (0,0) and clearly labeled axes with units.",
      key_takeaway: "Ohm's Law: V = IR — current is directly proportional to voltage for ohmic conductors at constant temperature. Resistance R = ρl/A depends on material (ρ), length (l), and cross-sectional area (A). Resistivity ρ is a material property. High-ρ materials (nichrome) are used in heaters; low-ρ materials (copper) are used in wires. A straight V-I graph indicates an ohmic conductor."
    }
  },

  {
    topicId: "sci_ch11_series_parallel",
    subject: "Science",
    chapterNumber: 11,
    name: "Series and Parallel Combination of Resistors",
    prerequisite_knowledge: [
      "Ohm's Law V = IR",
      "Electric current and potential difference",
      "Conservation of energy and charge"
    ],
    key_formulas: [
      "Series combination: R_s = R₁ + R₂ + R₃ + ... (current same through all; voltage divides)",
      "Parallel combination: 1/R_p = 1/R₁ + 1/R₂ + 1/R₃ + ... (voltage same across all; current divides)",
      "For two resistors in parallel: R_p = (R₁ × R₂)/(R₁ + R₂)",
      "For n identical resistors R each in series: R_s = nR",
      "For n identical resistors R each in parallel: R_p = R/n",
      "In series: V₁/V₂ = R₁/R₂ (voltage divider rule)",
      "In parallel: I₁/I₂ = R₂/R₁ (current divider rule — current takes the path of lower resistance)"
    ],
    teaching_content: {
      intuition: "Series circuits are like a single lane road — all cars (electrons) travel through each junction, one after another. If one breaks down (one resistor removed), all traffic stops (circuit breaks). Parallel circuits are like a multi-lane highway — cars can choose different lanes, so one lane closing doesn't stop others. Household wiring uses parallel so each appliance can be switched on/off independently and each gets the full supply voltage (230 V). In series, the total resistance adds up and is always greater than any individual resistor. In parallel, the total resistance is always less than the smallest individual resistor because more paths make it easier for current to flow.",
      process_explanation: "Series resistors: The same current I flows through all resistors. The total voltage V = V₁ + V₂ + V₃ (voltage divides). Total resistance R_s = R₁ + R₂ + R₃. Each resistor's voltage: V_k = I × R_k. The resistor with the highest R gets the highest voltage drop.\n\nParallel resistors: The same voltage V appears across each resistor. The total current I = I₁ + I₂ + I₃ (current divides). Total resistance: 1/R_p = 1/R₁ + 1/R₂ + 1/R₃. Each branch current: I_k = V/R_k. The branch with lowest R carries the most current.\n\nWhy household circuits are parallel:\n1. Each appliance gets full 230 V supply voltage.\n2. Each can be controlled independently (switching one off does not affect others).\n3. More appliances can be added without affecting others.\n4. Fault in one appliance doesn't break the entire circuit.",
      worked_example: "Three resistors of 4 Ω, 6 Ω, and 12 Ω are connected in parallel across a 12 V battery. Find: (a) equivalent resistance, (b) total current, (c) current through each resistor.\n\n(a) 1/R_p = 1/4 + 1/6 + 1/12 = 3/12 + 2/12 + 1/12 = 6/12 = 1/2\nR_p = 2 Ω.\n\n(b) Total current: I = V/R_p = 12/2 = 6 A.\n\n(c) Current through each:\nI₁ = V/R₁ = 12/4 = 3 A\nI₂ = V/R₂ = 12/6 = 2 A\nI₃ = V/R₃ = 12/12 = 1 A\nCheck: I₁ + I₂ + I₃ = 3 + 2 + 1 = 6 A = total current. ✓\n\nNote: The smallest resistor (4 Ω) carries the most current (3 A). R_p = 2 Ω is less than the smallest resistor (4 Ω).",
      common_misconceptions: [
        "Students apply the series formula (R_s = R₁ + R₂) to parallel circuits and get an answer larger than the individual resistors — this is always wrong for parallel. Parallel equivalent resistance is always LESS than the smallest resistor.",
        "In a series circuit, students think the 'bigger' resistor gets more current — in series, current is the SAME through all resistors. In parallel, more current goes through the LOWER resistance branch.",
        "Students confuse 1/R_p = 1/R₁ + 1/R₂ with R_p = R₁ + R₂, especially in numericals under time pressure. A quick check: parallel resistance must be less than the smaller of R₁, R₂."
      ],
      shortcuts_and_tricks: [
        "Two resistors in parallel quick formula: R_p = (R₁ × R₂)/(R₁ + R₂) — product over sum. For R₁ = R₂ = R: R_p = R²/2R = R/2. Always halves for two equal resistors.",
        "Series check: R_s > max(R₁, R₂, R₃). Parallel check: R_p < min(R₁, R₂, R₃). Use these to verify your answer instantly.",
        "Current and voltage rules memory: 'In Series, Same current (SS). In Parallel, same Potential (PP).' — the repeated letter helps remember which quantity is constant."
      ],
      diagram_description: "Two circuit diagrams side by side. Left diagram — Series circuit: a battery on the left, three resistors (R₁, R₂, R₃) connected end-to-end in a single loop. A single ammeter is shown in series. Voltage arrows V₁, V₂, V₃ are shown across each resistor; total voltage V = V₁ + V₂ + V₃ is labeled. Right diagram — Parallel circuit: a battery on the left, three resistors connected in three parallel branches between the same two horizontal rails (bus bars). Three separate ammeters (or one main ammeter) show currents I₁, I₂, I₃ in each branch. The same voltage V is shown across all three branches. Labels indicate: 'Household appliances connected in parallel — each gets full voltage, independently switched'.",
      key_takeaway: "Series: R_s = R₁ + R₂ + R₃; same current; voltage divides proportionally to R. Parallel: 1/R_p = 1/R₁ + 1/R₂ + 1/R₃; same voltage; current divides inversely proportional to R. R_p is always less than the smallest resistor. Household circuits are wired in parallel for independent operation and full voltage to each appliance."
    }
  },

  {
    topicId: "sci_ch11_power_heating",
    subject: "Science",
    chapterNumber: 11,
    name: "Electric Power, Heating Effect and Electrical Energy",
    prerequisite_knowledge: [
      "Ohm's Law V = IR",
      "Potential difference and current definitions",
      "Basic concepts of energy and power"
    ],
    key_formulas: [
      "Electric power: P = VI = I²R = V²/R (SI unit: watt W)",
      "Joule's law of heating: H = I²Rt (H in joules, I in amperes, R in ohms, t in seconds)",
      "Electrical energy: E = Pt = VIt (joules)",
      "Commercial unit of energy: 1 kilowatt-hour (kWh) = 3.6 × 10⁶ J",
      "1 unit of electricity (on electric bill) = 1 kWh",
      "Energy in kWh: E = (Power in watts / 1000) × time in hours",
      "Fuse wire: melts when current exceeds safe limit (rated current), breaking the circuit"
    ],
    teaching_content: {
      intuition: "Power is the rate at which electrical energy is converted. A 100 W bulb converts 100 joules of electrical energy every second. Joule's heating law tells us that the heat generated by a current through a resistance is proportional to the square of the current — this is why fuses blow (thin wire heats up and melts when current is too high), why electric irons and heaters work (nichrome wire has high resistance and gets hot with current), and why high-tension power lines carry current at very high voltage (very low current → very low I²R heating loss in wires). The commercial unit kWh is simply the energy used by a 1000 W appliance running for 1 hour.",
      process_explanation: "Power relationships: Starting from P = VI and V = IR:\n— Substitute V = IR into P = VI: P = (IR) × I = I²R (useful for series circuits where I is known).\n— Substitute I = V/R into P = VI: P = V × (V/R) = V²/R (useful for parallel circuits where V is known).\n\nJoule's heating: H = I²Rt — heat is proportional to square of current, proportional to resistance, proportional to time. This is Joule's law.\n\nApplications:\n— Fuse: thin wire of low melting point (often tin-lead alloy). When current exceeds fuse rating, I²R heating melts the fuse wire → circuit breaks → appliances protected. MCB (Miniature Circuit Breaker) does the same but automatically resets.\n— Electric bulb filament: tungsten wire, very high resistance, high melting point. Gets white hot and emits light.\n— Electric iron/heater: nichrome wire (high ρ, high R), converts electrical energy to heat.\n\nElectricity bill calculation: Number of units = (sum of wattage of all appliances × hours used) / 1000. Cost = units × rate per unit.",
      worked_example: "A household uses the following appliances: 2 bulbs of 60 W each, 1 TV of 80 W, and 1 fan of 60 W. All are used for 5 hours per day. (a) Find total energy consumed per day in kWh. (b) Calculate monthly cost at ₹5 per unit.\n\n(a) Total power = 2(60) + 80 + 60 = 120 + 80 + 60 = 260 W = 0.260 kW.\nEnergy per day = 0.260 kW × 5 h = 1.3 kWh = 1.3 units per day.\n\n(b) Units per month = 1.3 × 30 = 39 units.\nMonthly cost = 39 × ₹5 = ₹195.\n\nJoule heating example: A 4 Ω resistor carries 3 A current for 2 minutes. How much heat is generated?\nH = I²Rt = (3)² × 4 × (2 × 60) = 9 × 4 × 120 = 4320 J.\n\nFuse rating: A circuit has a 1 kW heater on a 250 V supply. What is the minimum fuse rating needed?\nI = P/V = 1000/250 = 4 A. Use a 5 A fuse (next standard size above the operating current).",
      common_misconceptions: [
        "Students use P = I²R for parallel circuits where they should use P = V²/R. In parallel, all components share the same voltage. In series, they share the same current. Choose the formula based on what is constant.",
        "Students forget to convert watts to kilowatts (divide by 1000) before multiplying by hours to get kWh. A 1000 W appliance for 1 hour = 1 kWh, not 1000 kWh.",
        "Many students say 'fuse melts due to overcurrent by itself' without explaining the mechanism. The heat generated by I²R in the fuse wire raises its temperature above its melting point — Joule's heating is the mechanism."
      ],
      shortcuts_and_tricks: [
        "Power formula triangle (like V = IR triangle): write P at top, V and I at bottom. Cover P → V × I. Cover I → P/V. Cover V → P/I. Then combine with V = IR for I²R and V²/R forms.",
        "kWh shortcut: Energy (units) = (Total watts / 1000) × hours. For multiple appliances: add all watts first, then divide by 1000, then multiply by hours.",
        "Fuse choice: always pick the fuse rating just above the normal operating current. Operating at 4 A → use 5 A fuse. The fuse must carry normal current without melting but melt quickly at fault currents."
      ],
      diagram_description: "Two diagrams. Diagram 1 — Joule heating in a circuit: a simple circuit with a battery, switch, and coil of resistance wire (labeled with resistance R and current I). Heat waves are shown radiating from the resistance wire. The formula H = I²Rt is printed alongside. Diagram 2 — Fuse in a circuit: a household circuit with a live wire connected through a fuse (shown as a thin wire segment in a glass/ceramic holder). Below it, a short-circuit scenario is shown: when the live wire accidentally touches the neutral wire, a very high current flows, heating the fuse wire above its melting point, melting it and breaking the circuit. An alternative circuit shows an MCB (toggle switch symbol) that can be manually reset.",
      key_takeaway: "P = VI = I²R = V²/R — use the form that matches what you know (I for series, V for parallel). H = I²Rt (Joule's law). 1 kWh = 3.6 × 10⁶ J is the commercial unit. Fuses and MCBs protect circuits by breaking when current exceeds the safe limit — via Joule heating. Always use P = V²/R for parallel and P = I²R for series in power comparison problems."
    }
  },

  // ═══════════════════════════════════════════════════════════════════
  // CHAPTER 12: Magnetic Effects of Electric Current
  // ═══════════════════════════════════════════════════════════════════
  {
    topicId: "sci_ch12_magnetic_field",
    subject: "Science",
    chapterNumber: 12,
    name: "Magnetic Field due to Current — Oersted, Straight Wire, Solenoid",
    prerequisite_knowledge: [
      "Basic concept of magnetic field and field lines",
      "Electric current in conductors",
      "Direction conventions in physics"
    ],
    key_formulas: [
      "Right-hand thumb rule (straight conductor): Thumb points in direction of conventional current; curled fingers show direction of magnetic field lines (concentric circles around wire)",
      "Right-hand thumb rule (solenoid): Curl fingers in direction of current in coils; thumb points toward North pole (direction of field inside solenoid)",
      "Magnetic field strength at centre of circular loop: B = μ₀I/(2r) (qualitative understanding only at Class 10 level)",
      "Solenoid field is uniform inside and strong, similar to a bar magnet's field externally"
    ],
    teaching_content: {
      intuition: "Hans Christian Oersted discovered in 1820 that an electric current creates a magnetic field — a compass needle placed near a current-carrying wire deflects. Before this, electricity and magnetism were thought to be unrelated. The magnetic field around a straight wire forms concentric circles centred on the wire. Imagine you are an electron running along the wire — the magnetic field is like a spinning tornado around you. A solenoid (many turns of wire coiled up) concentrates all these circular fields into a strong, uniform field along the axis — making it behave exactly like a bar magnet with a North and South pole. This is the principle of an electromagnet.",
      process_explanation: "Oersted's experiment: When a conducting wire is placed parallel to and above a compass needle, the needle deflects when current flows. The deflection reverses when current direction is reversed. This established that current produces a magnetic field.\n\nMagnetic field around a straight conductor: The field lines form concentric circles centred on the wire, in planes perpendicular to the wire. The field direction is given by the right-hand thumb rule: point thumb in the direction of current; curled fingers show direction of field lines. The field strength decreases as you move further from the wire.\n\nMagnetic field due to a circular current loop: At the centre of a circular loop, each segment of the wire contributes a magnetic field perpendicular to the plane of the loop. All contributions add up in the same direction → strong field through the centre.\n\nSolenoid: A solenoid is a long coil of wire with many turns. The magnetic field inside is strong and uniform (like a uniform bar magnet field). The field outside is like that of a bar magnet. One end of the solenoid behaves as North (field emerges) and the other as South (field enters). Right-hand rule for solenoid: curl fingers in direction of current in the coil → thumb points to North pole.\n\nElectromagnet: A solenoid with a soft iron core becomes a powerful electromagnet. Soft iron gets strongly magnetised when current flows and loses magnetism immediately when current stops — making it ideal for cranes, MRI machines, circuit breakers.",
      worked_example: "A solenoid has 200 turns and carries a current of 2 A. Describe the magnetic field it produces and identify which end is the North pole if current flows anticlockwise when viewed from the right end.\n\nThe solenoid with 200 turns and 2 A produces a strong, uniform magnetic field inside along its axis. The field outside resembles that of a bar magnet.\n\nTo identify poles: When viewed from the right end, current flows anticlockwise. Using the right-hand rule for the solenoid: if you look at the right face and the current runs anticlockwise (counterclockwise), the right end is the North pole (because for a North pole, the current at that face appears to flow anticlockwise — same as 'N' in a circle → counterclockwise).\n\nAlternatively, wrap the right hand around the solenoid with fingers pointing in the direction current flows in the coil wires. The thumb points toward the North pole.\n\nMemory aid: Anticlockwise face = North pole; Clockwise face = South pole (like a compass direction — N has CCW, S has CW).",
      common_misconceptions: [
        "Students use the right-hand rule for a straight wire (curled fingers = field) when they should use it for a solenoid (curled fingers = current, thumb = North). The two applications of the right-hand rule are different — don't confuse them.",
        "Students say the magnetic field inside a solenoid is zero — this is wrong. The field is strong and uniform INSIDE the solenoid. The field outside is weak (like outside a bar magnet). It is the electric field inside a conductor (not solenoid) that is zero.",
        "Many students draw the magnetic field lines around a straight wire as straight lines parallel to the wire instead of concentric circles perpendicular to the wire. Always draw the field in a cross-section view to show the circles."
      ],
      shortcuts_and_tricks: [
        "Right-hand thumb rule memory: 'Thumb = current direction, fingers = field direction' for a straight wire. For solenoid: 'fingers = current in coils, thumb = North pole direction'.",
        "Solenoid pole identification shortcut: look at the face of the solenoid. If current appears to flow anticlockwise (N for North), it is the North pole. If clockwise (S for South), it is the South pole. 'A for Anticlockwise = A for North (think: N contains no straight lines, just curves = anticlockwise).'",
        "Electromagnet vs permanent magnet: electromagnet can be switched on/off (current controls it) and field strength can be varied. Use these features to distinguish applications in exam questions."
      ],
      diagram_description: "Three diagrams. Diagram 1 — Oersted's experiment: a straight horizontal wire with current flowing left to right (arrow labeled I). Below the wire, a compass needle is shown deflecting clockwise when current is on. A second compass above the wire shows deflection in the opposite direction. This illustrates that field direction reverses above and below the wire. Diagram 2 — Magnetic field around a straight conductor: a cross-sectional view showing the wire as a dot (current coming out of page) at centre. Concentric circles around the dot show the magnetic field lines; arrows on the circles indicate the anticlockwise direction (confirmed by right-hand rule: thumb out of page, fingers curl anticlockwise). Diagram 3 — Solenoid: a rectangular coil wound in many turns shown from the side. Inside, straight horizontal field lines with arrows pointing from South to North (left to right, inside the coil). Outside, curved field lines emerging from the right (North) face and entering the left (South) face — exactly like a bar magnet field pattern. N and S labels are placed at each end. A small right-hand diagram shows the rule for identifying the North pole.",
      key_takeaway: "Oersted showed that electric current produces a magnetic field. Around a straight wire, the field forms concentric circles — direction given by the right-hand thumb rule. A solenoid produces a uniform field inside and a bar-magnet-like field outside. The North pole is the end where field lines emerge (anticlockwise current when viewed from that face). Adding a soft iron core makes an electromagnet."
    }
  },

  {
    topicId: "sci_ch12_force_on_conductor",
    subject: "Science",
    chapterNumber: 12,
    name: "Force on a Current-Carrying Conductor in a Magnetic Field",
    prerequisite_knowledge: [
      "Magnetic field concept",
      "Electric current direction convention",
      "Vector cross product concept (qualitative)"
    ],
    key_formulas: [
      "Force on a conductor: F = BIL sin θ (F in newtons, B in tesla T, I in amperes, L in metres, θ = angle between current direction and magnetic field B)",
      "Maximum force when θ = 90° (current perpendicular to field): F = BIL",
      "No force when θ = 0° or 180° (current parallel to field): F = 0",
      "Fleming's Left-Hand Rule: FBI rule — Force (thumb), B-field (index finger), Current I (middle finger); all mutually perpendicular"
    ],
    teaching_content: {
      intuition: "A current-carrying wire in a magnetic field experiences a force — this is the Motor Effect, and it is the principle behind every electric motor. Think of it as the interaction between two magnets: the wire's own magnetic field (from the current) interacts with the external magnetic field, and the wire gets pushed. The direction of this force is always perpendicular to both the current direction and the magnetic field direction. Fleming's Left-Hand rule gives you the direction of this force. 'FBI' — think of the Federal Bureau of Investigation: F is Force (thumb), B is field (index), I is current (middle finger).",
      process_explanation: "Apply Fleming's Left-Hand Rule: Hold the left hand with the index finger, middle finger, and thumb all mutually perpendicular.\n— Index finger: points in the direction of the magnetic field B (from North to South).\n— Middle finger: points in the direction of the conventional current I.\n— Thumb: points in the direction of the force F (motion of the conductor).\n\nForce magnitude: F = BIL sin θ.\n— When the wire is perpendicular to B (θ = 90°): F = BIL (maximum force).\n— When the wire is parallel to B (θ = 0°): F = 0 (no force).\n— Increasing B, I, or L increases force.\n\nImportant: this is the Left Hand rule for MOTORS (current-carrying conductor in external field → force on wire). The Right Hand rule is for GENERATORS (moving conductor in field → induced current). This distinction frequently appears in exam questions.",
      worked_example: "A straight conductor of length 0.5 m carrying a current of 4 A is placed in a uniform magnetic field of 0.3 T. The conductor is perpendicular to the field. Find the force on the conductor and its direction if the current is northward and the field is eastward.\n\nGiven: L = 0.5 m, I = 4 A, B = 0.3 T, θ = 90° (perpendicular).\nF = BIL sin θ = 0.3 × 4 × 0.5 × sin 90° = 0.3 × 4 × 0.5 × 1 = 0.6 N.\n\nDirection using Fleming's Left-Hand Rule: Index finger → East (field direction). Middle finger → North (current direction). Thumb → points Upward (out of horizontal plane).\nForce = 0.6 N directed vertically upward.",
      common_misconceptions: [
        "Students use the Right-Hand rule for the force on a current-carrying conductor in an external field. The RIGHT-hand rule is for generators (finding the direction of induced current). The LEFT-hand rule is for motors (finding the force/motion direction). Using the wrong hand gives the completely opposite direction.",
        "Students say 'the force is along the direction of the current' — the force is PERPENDICULAR to the current direction and also perpendicular to the magnetic field. It is never along the current.",
        "Students say F = BIL without including sin θ, leading to wrong answers when the conductor is not perpendicular to the field. Always check the angle between the current direction and B."
      ],
      shortcuts_and_tricks: [
        "FBI mnemonic for Fleming's Left-Hand rule: F (thumb) = Force/motion, B (index finger) = B-field direction, I (middle finger) = Current. The order F-B-I helps remember which finger is which.",
        "Quick force check: if current and field are parallel or antiparallel (θ = 0° or 180°), force is zero. If they are perpendicular (θ = 90°), force is maximum = BIL. These two boundary cases are frequently tested.",
        "Motor vs Generator rule memory: Motor uses electricity to produce Motion → Left Hand (M for Motor, L for Left). Generator produces electricity (current) from motion → Right Hand (G for Generator, R for Right)."
      ],
      diagram_description: "Two diagrams. Diagram 1 — Force on a conductor: a horizontal rectangular frame showing a straight wire segment carrying current I (upward arrow). A uniform magnetic field B is shown entering the page (cross symbols × × ×). According to Fleming's left-hand rule, the force F is to the left (shown by an arrow on the wire). Three right-angle labels show the mutual perpendicularity of F, B, and I. Diagram 2 — Fleming's Left-Hand Rule illustration: a left hand drawn in three-quarter view. The index finger is extended pointing forward (labeled 'Magnetic Field B'). The middle finger is extended pointing upward/sideways at 90° to the index finger (labeled 'Current I'). The thumb is extended upward at 90° to both (labeled 'Force F / Motion'). All three directions are color-coded and clearly labeled.",
      key_takeaway: "A current-carrying conductor in a magnetic field experiences a force F = BIL sin θ. Force is maximum when current is perpendicular to the field. Direction is given by Fleming's Left-Hand rule: index finger = B-field, middle finger = current I, thumb = force F. This is the Motor Effect. Left hand is for motors; Right hand is for generators."
    }
  },

  {
    topicId: "sci_ch12_electric_motor",
    subject: "Science",
    chapterNumber: 12,
    name: "Electric Motor — Construction and Working Principle",
    prerequisite_knowledge: [
      "Force on a current-carrying conductor in a magnetic field",
      "Fleming's Left-Hand rule",
      "Series and parallel circuits"
    ],
    key_formulas: [
      "Converts electrical energy → mechanical (kinetic) energy",
      "Torque on a current loop: τ = BINA (qualitative for Class 10 — not numerically tested)",
      "Key components: armature coil (ABCD), permanent magnet (North-South poles), commutator (split ring), brushes (carbon)",
      "Commutator reverses current direction in the armature coil every half rotation to maintain continuous rotation"
    ],
    teaching_content: {
      intuition: "An electric motor is based entirely on the force on a current-carrying conductor in a magnetic field (the Motor Effect). A rectangular coil of wire placed in a magnetic field will experience forces on its two sides that are parallel to the magnet's poles — these forces form a couple (equal and opposite forces at a distance), creating a torque that rotates the coil. The clever trick is the commutator (split-ring): every half turn, it reverses the current through the coil, so the forces are always in the same rotational direction, keeping the coil spinning continuously rather than oscillating back and forth.",
      process_explanation: "Construction: A rectangular coil ABCD (the armature) is mounted on an axle between the poles (North and South) of a permanent magnet (or electromagnet for stronger motors). The two ends of the coil are connected to the two halves of the split ring commutator. Two carbon brushes press against the commutator and connect it to the external battery circuit.\n\nWorking principle:\nStep 1 — Current flows from battery through brush B₁ → one half of commutator → through coil ABCD → other half of commutator → brush B₂ → back to battery.\nStep 2 — Using Fleming's Left-Hand rule: side AB of the coil (say, carrying current upward) in the magnetic field experiences a downward force. Side CD (carrying current downward) experiences an upward force. These two forces form a couple → the coil rotates.\nStep 3 — After half a rotation (180°), AB is where CD was and vice versa. If the current direction in the coil remained the same, the forces would now reverse and the coil would rotate back. The commutator reverses the current through the coil at exactly this half-rotation point, so the forces continue in the same rotational sense → continuous rotation.\nStep 4 — The axle of the coil is connected to the load (fan blade, wheels of an electric vehicle, etc.).\n\nImprovement in commercial motors: multiple coils wound on the armature (soft iron core to concentrate field), electromagnets instead of permanent magnets, multiple segments in commutator → smoother, stronger rotation.",
      worked_example: "Explain why the commutator is essential for the continuous rotation of an electric motor. What would happen if the commutator were replaced by slip rings?\n\nWithout commutator (with slip rings instead): In the first half rotation, say coil side AB experiences a downward force and CD an upward force → coil rotates clockwise. After 180°, AB is now on the other side. With slip rings, the current direction in the coil remains unchanged (slip rings do not reverse current). AB now experiences an upward force (opposing the clockwise rotation) and CD a downward force. The coil would slow down, stop at the vertical position, and oscillate but not rotate continuously.\n\nWith commutator (split ring): At the 180° position, the commutator's split causes the current to reverse through the coil — the half of the commutator that was connected to brush B₁ is now connected to brush B₂ and vice versa. So although the coil has rotated 180°, the current reverses at the same time. AB now carries current in the direction that produces a downward force in its new position → continues rotating clockwise. The commutator ensures the torque always acts in the same sense, producing continuous rotation.\n\nConclusion: Slip rings maintain continuous electrical contact without reversing current (used in generators). Commutator (split ring) reverses the current in the coil every half rotation (used in motors for continuous rotation).",
      common_misconceptions: [
        "Students confuse the commutator with slip rings. Both maintain electrical contact with a rotating coil, but commutators REVERSE the current every half turn (used in DC motors and DC generators). Slip rings maintain contact WITHOUT reversing (used in AC generators). This is one of the most frequently confused points in Chapter 12.",
        "Students say 'the magnetic field rotates the coil' — the magnetic field doesn't rotate. The FORCE on the current-carrying coil due to the interaction with the magnetic field creates a torque. The field itself is stationary (produced by the permanent magnet).",
        "Many students describe the armature as the entire motor. The armature specifically is the rotating coil (and its iron core) — not the permanent magnet, not the commutator, not the brushes."
      ],
      shortcuts_and_tricks: [
        "Commutator vs slip ring one-liner: 'Commutator Converts AC to DC inside (motor) or DC to AC pulsing; Slip rings Slide with no reversal (generator)'. Motor needs reversal → commutator. AC Generator doesn't need reversal → slip rings.",
        "Why carbon brushes? Carbon is a good conductor, self-lubricating, and can wear down without damaging the commutator — it sacrifices itself like a pencil eraser. This is a favourite conceptual question.",
        "Parts memory: 'ABCS' — Armature (coil), Brushes (carbon), Commutator (split ring), Source (battery). These four components are all you need to describe a basic DC motor."
      ],
      diagram_description: "A labeled diagram of a DC electric motor showing a cross-sectional front view. The permanent magnet is shown with N pole on the left and S pole on the right, creating a horizontal magnetic field (B arrows pointing left to right). The rectangular armature coil ABCD is shown in the vertical plane between the poles. Side AB is on the right (closer to N pole face) with a current-direction arrow (say, into the page). Side CD is on the left with current out of the page. Force arrows on AB (downward, using Fleming's left-hand rule) and on CD (upward) are shown, indicating the couple that creates clockwise rotation. Below the coil, the split ring commutator is shown — two semicircular halves (each connected to one end of the coil) with two fixed carbon brushes pressing against them. The external circuit (battery with + and − terminals, connecting wires) is shown connected to the brushes. A second small diagram shows the state after 180° rotation: the coil has rotated but the commutator has reversed the brush-to-coil connections, so the forces still produce clockwise rotation.",
      key_takeaway: "An electric motor converts electrical energy into mechanical energy using the force on a current-carrying coil in a magnetic field. The commutator (split ring) is essential — it reverses the current through the coil every half turn, maintaining continuous rotation in one direction. Key parts: armature coil, permanent magnet, split ring commutator, and carbon brushes. Commutator for motors/DC; slip rings for AC generators."
    }
  },

  {
    topicId: "sci_ch12_electromagnetic_induction",
    subject: "Science",
    chapterNumber: 12,
    name: "Electromagnetic Induction, AC Generator and Motor vs Generator Comparison",
    prerequisite_knowledge: [
      "Magnetic field and field lines",
      "Electric motor principle",
      "Commutator vs slip rings",
      "Direct current (DC) vs alternating current (AC)"
    ],
    key_formulas: [
      "Faraday's Law of electromagnetic induction: induced EMF ε = −dΦ/dt (rate of change of magnetic flux; qualitative for Class 10)",
      "Magnetic flux: Φ = B × A × cos θ (B = magnetic field, A = area of loop, θ = angle between B and normal to loop)",
      "EMF is induced when magnetic flux through a loop changes — either by moving the conductor, changing B, or changing the area",
      "Fleming's Right-Hand Rule: index finger = B-field, middle finger = induced current, thumb = motion of conductor",
      "AC generator output: sinusoidal alternating current (reverses direction every half rotation)",
      "DC generator: uses commutator to rectify AC → pulsating DC"
    ],
    teaching_content: {
      intuition: "Faraday discovered in 1831 that a changing magnetic field induces an electric current in a nearby conductor — the exact opposite of what Oersted found (current produces magnetic field). This is electromagnetic induction. Think of it as a magnetic version of cause-and-effect: the motor takes in electricity and produces motion; the generator takes in motion and produces electricity. They are reverse processes. Every power station in the world — hydroelectric, thermal, nuclear — generates electricity using this principle: use energy to rotate coils in a magnetic field and electricity flows. The induced current always opposes the change that caused it (Lenz's Law), which is why generators require mechanical energy input.",
      process_explanation: "Key conditions for electromagnetic induction:\n1. A conductor must be present in a magnetic field.\n2. There must be RELATIVE MOTION between the conductor and the field (or a changing field through a stationary loop).\n3. No EMF is induced when the conductor is stationary in a constant field.\n\nFleming's Right-Hand Rule (for generators): Hold right hand with index, middle finger, and thumb mutually perpendicular.\n— Thumb: direction of motion of the conductor.\n— Index finger: direction of magnetic field B.\n— Middle finger: direction of induced conventional current.\n(Compare with LEFT-hand for motors: Force on wire in field. RIGHT-hand for generators: current in moving wire.)\n\nAC Generator: The armature coil rotates in a magnetic field. As it rotates, the angle between the coil plane and the field changes, so the flux changes → EMF is induced. The EMF varies sinusoidally — it is maximum when the coil plane is parallel to the field (maximum rate of flux change) and zero when the coil plane is perpendicular to the field (zero rate of flux change). The AC generator uses slip rings (not commutator) to maintain contact with the rotating coil → the alternating current is transferred directly without reversal.\n\nDC Generator: Same as AC generator but uses a commutator instead of slip rings. The commutator reverses the connection at every half turn, so the current always flows in the same external direction — pulsating DC.\n\nMotor vs Generator comparison:\n— Motor: electrical energy → mechanical energy; uses commutator; Fleming's Left-Hand rule for force direction.\n— Generator: mechanical energy → electrical energy; AC generator uses slip rings; DC generator uses commutator; Fleming's Right-Hand rule for current direction.",
      worked_example: "A conductor of length 0.5 m moves with a velocity of 4 m/s perpendicular to a magnetic field of 0.2 T. Find the induced EMF.\n\nUsing the formula for motional EMF: ε = BLv sin θ\nGiven: B = 0.2 T, L = 0.5 m, v = 4 m/s, θ = 90° (conductor moves perpendicular to both B and its own length)\nε = 0.2 × 0.5 × 4 × sin 90° = 0.2 × 0.5 × 4 × 1 = 0.4 V.\nThe induced EMF = 0.4 V.\n\nDirection using Fleming's Right-Hand rule: thumb = direction of motion; index finger = direction of B; middle finger gives the direction of induced current. If the conductor moves upward and B is horizontal (into page), the induced current flows in a specific direction along the conductor — determined by the right-hand rule applied accordingly.\n\nAC Generator output: The EMF varies as ε = ε₀ sin ωt, where ε₀ is the peak EMF and ω is the angular velocity of rotation. The frequency of AC in India is 50 Hz, meaning the coil completes 50 full rotations per second.",
      common_misconceptions: [
        "Students use Fleming's Left-Hand rule to find the direction of induced current in a generator. The LEFT hand is for motors (force on conductor). The RIGHT hand is for generators (direction of induced current when conductor moves). Using the wrong hand reverses the current direction.",
        "Students say 'electromagnetic induction requires a magnet to be moving' — a changing magnetic flux induces EMF, which can be achieved by: moving a magnet near a coil, moving a coil in a stationary field, changing the current in a nearby coil (mutual induction), or changing the area of the circuit in a field. A stationary coil with a stationary magnet produces zero EMF.",
        "Students confuse 'slip rings give DC' and 'commutator gives AC' — it is the exact opposite. Slip rings allow AC to pass unchanged (no reversal) → AC output. Commutator reverses the coil connections each half cycle → converts AC from the coil to DC (pulsating) at the output terminals."
      ],
      shortcuts_and_tricks: [
        "Hand rule summary card: Motor = LEFT (L for Left = L for Load/output-is-mechanical). Generator = RIGHT (R for Right = R for Rotation-produces-current). Index finger always = B. Middle finger always = I (current). Thumb always = F or motion.",
        "Slip ring vs commutator outcome: Slip ring → AC out (as generated). Commutator → DC out (reversed every half cycle). 'Slip ring Lets AC Slip through unchanged. Commutator Converts AC to DC'.",
        "Faraday's law quick statement for exams: 'EMF is induced whenever magnetic flux through a circuit changes. Greater the rate of change of flux, greater the induced EMF.' Two marks answer."
      ],
      diagram_description: "Three diagrams. Diagram 1 — AC Generator cross-section: an armature coil ABCD rotating in the field of a permanent magnet (N on left, S on right). Two slip rings (full circles) are shown at the right end of the axle, with two fixed carbon brushes making contact. External circuit shows a load and AC symbol. Four positions of the coil are shown below (0°, 90°, 180°, 270°) with the corresponding sinusoidal output graph (ε vs time/angle) below, showing zero → maximum → zero → minimum → zero over one complete rotation. Diagram 2 — DC Generator: identical to the AC generator but with a split-ring commutator instead of slip rings. The output graph shows pulsating DC (all positive, like the absolute value of a sine wave). Diagram 3 — Motor vs Generator comparison table as a diagram: two boxes side by side. Left box (Motor): input=electricity, output=motion, uses commutator, Fleming's LEFT-hand rule. Right box (Generator): input=motion, output=electricity, AC uses slip rings / DC uses commutator, Fleming's RIGHT-hand rule. Double arrows between the two boxes show the reverse-process relationship.",
      key_takeaway: "Electromagnetic induction: changing magnetic flux through a loop induces an EMF. Fleming's Right-Hand rule gives the direction of induced current in a generator (thumb = motion, index = B, middle = current). AC generator uses slip rings → sinusoidal AC output. DC generator uses commutator → pulsating DC. Motor and generator are reverse processes: Motor (Left hand, F = BIL, electrical → mechanical); Generator (Right hand, ε = BLv, mechanical → electrical)."
    }
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("Connected to MongoDB");
  let upserted = 0;
  for (const t of TOPICS) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: t.topicId },
      t,
      { upsert: true, new: true }
    );
    upserted++;
    console.log(`  ✓ ${t.topicId}`);
  }
  console.log(`\nPhysics teaching content: ${upserted} topics upserted`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
