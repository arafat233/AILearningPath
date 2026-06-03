/**
 * AP SSC Class 8 Mathematics — Chapter 13: Direct and Inverse Proportions
 * 3 topics. topicId: ap_ssc_math8_ch13_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch13.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch13_direct_proportion",
    subject: "Mathematics",
    chapterNumber: 13,
    name: "Direct Proportion",
    prerequisite_knowledge: ["Ratios and equivalent ratios", "Unitary method", "Forming a fraction x/y", "Cross-multiplication"],
    key_formulas: [
      "x and y in DIRECT proportion ⟺ x/y = k (constant)",
      "If x₁/y₁ = x₂/y₂ then x₁y₂ = x₂y₁ (cross-multiply to solve)",
      "More ⟹ more, less ⟹ less (the two quantities rise and fall together)",
    ],
    teaching_content: {
      intuition: "Two quantities are in direct proportion when they grow and shrink together at the same rate — double one, the other doubles. Buy twice as many pens, pay twice as much. The ratio between them stays constant, and that fixed ratio (k) is the engine that lets you find any unknown value.",
      derivation: "If x ∝ y directly, then x = ky for some constant k, so x/y = k is the same for every pair. Given one pair (x₁, y₁) and a partial second pair, set the ratios equal: x₁/y₁ = x₂/y₂, then cross-multiply to find the unknown. The constant k = x/y is the 'value of one unit', linking the unitary method to proportion.",
      worked_example: "If 5 pens cost ₹40, what do 8 pens cost?\n\nDirect proportion: cost/pens is constant. 40/5 = x/8 ⟹ x = 8 × (40/5) = 8 × 8 = ₹64.\n(Check: ₹8 per pen × 8 pens = ₹64.)",
      visual_description: "A straight line through the origin on an x–y grid (cost vs number of pens), showing that as pens increase, cost increases proportionally; the constant slope is k.",
      svg_diagrams: [{ title: "Direct proportion: straight line through origin", svg_code: "<svg viewBox='0 0 160 120' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><line x1='20' y1='100' x2='150' y2='100' stroke='#333'/><line x1='20' y1='10' x2='20' y2='100' stroke='#333'/><line x1='20' y1='100' x2='140' y2='20' stroke='#2563eb' stroke-width='2'/><text x='60' y='115'>pens</text><text x='25' y='115' fill='#16a34a' font-size='8'>more→more</text></svg>" }],
      common_misconceptions: ["Assuming every pair of quantities is directly proportional — check that more really means more.", "Setting up the ratio upside-down on one side (keep both ratios same orientation: cost/pens = cost/pens).", "Adding instead of scaling (8 pens isn't 5 pens + 3, it's a proportional scale-up).", "Confusing direct with inverse proportion."],
      shortcuts_and_tricks: ["Find the unit value first (cost of one), then multiply — the unitary method.", "Set equal ratios x₁/y₁ = x₂/y₂ and cross-multiply.", "Keep units consistent on both sides of the proportion."],
      when_to_use_this_method: "Use when two quantities increase/decrease together at a constant ratio: cost vs quantity, distance vs time at constant speed, ingredients in a recipe scaled up.",
      edge_cases: ["A direct-proportion graph always passes through the origin (0 of one ⟹ 0 of the other).", "If the ratio is NOT constant across pairs, it isn't direct proportion.", "k can be a fraction (e.g. 0.5 km per minute)."],
      key_takeaway: "In direct proportion x/y = k (constant): the quantities rise and fall together. Solve unknowns by equating ratios x₁/y₁ = x₂/y₂ and cross-multiplying, or by the unitary method (value of one × number). Its graph is a straight line through the origin.",
      video_script_hooks: ["Opening: '5 pens for ₹40 — what about 8? Direct proportion makes it a one-line calculation.'", "Mid: 'The ratio stays fixed: cost per pen never changes. That constant is your key.'", "Closing: 'Graph it and you get a straight line through the origin — the signature of direct proportion.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch13_inverse_proportion",
    subject: "Mathematics",
    chapterNumber: 13,
    name: "Inverse Proportion",
    prerequisite_knowledge: ["Direct proportion", "Multiplication and the idea of a constant product", "Ratios", "Reciprocals"],
    key_formulas: [
      "x and y in INVERSE proportion ⟺ x × y = k (constant)",
      "If x₁y₁ = x₂y₂ then more of one means less of the other",
      "x₂ = (x₁ y₁)/y₂",
    ],
    teaching_content: {
      intuition: "Two quantities are inversely proportional when one goes UP as the other goes DOWN, so their PRODUCT stays constant. More workers → fewer days to finish a job; faster speed → less time for a fixed distance. The total 'work' (product) is fixed; you just redistribute it.",
      derivation: "If x ∝ 1/y (inverse), then x = k/y, so xy = k stays constant for every pair. Given (x₁,y₁) and a partial second pair, use x₁y₁ = x₂y₂ and solve. This is why 'more ⟹ less': if y grows, x must shrink to keep the product k unchanged.",
      worked_example: "If 6 workers build a wall in 8 days, how many days for 4 workers (same wall)?\n\nInverse proportion: workers × days = constant. 6×8 = 4×d ⟹ 48 = 4d ⟹ d = 12 days.\n(Fewer workers → more days, product stays 48 worker-days.)",
      visual_description: "A curved (hyperbola) graph of x vs y bending away from both axes, showing that as x increases y decreases while the rectangle area x·y under any point stays constant.",
      svg_diagrams: [{ title: "Inverse proportion: x·y = constant (curve)", svg_code: "<svg viewBox='0 0 160 120' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><line x1='20' y1='100' x2='150' y2='100' stroke='#333'/><line x1='20' y1='10' x2='20' y2='100' stroke='#333'/><path d='M30 20 Q40 90 140 95' fill='none' stroke='#dc2626' stroke-width='2'/><text x='60' y='115' fill='#dc2626' font-size='8'>more→less (xy=k)</text></svg>" }],
      common_misconceptions: ["Treating an inverse relationship as direct (using ratios instead of products).", "Forgetting the product (not the ratio) is constant.", "Thinking more workers always means MORE days (it's fewer).", "Mixing up which quantity goes up vs down."],
      shortcuts_and_tricks: ["Inverse ⟹ multiply: x₁y₁ = x₂y₂. Keep the PRODUCT constant.", "'More ⟹ less' is the tell-tale of inverse proportion.", "Total work = workers × days (or speed × time) — find it once, then redistribute."],
      when_to_use_this_method: "Use when one quantity rises as another falls with a constant product: workers vs days, speed vs time (fixed distance), number of pipes vs time to fill a tank.",
      edge_cases: ["The graph is a curve (hyperbola), never a straight line — unlike direct proportion.", "If the product isn't constant across pairs, it isn't inverse proportion.", "Speed–time at fixed distance is the classic inverse pair."],
      key_takeaway: "In inverse proportion x·y = k (constant): as one quantity increases the other decreases. Solve with x₁y₁ = x₂y₂ (keep the product constant). 'More ⟹ less' and a curved graph distinguish it from direct proportion.",
      video_script_hooks: ["Opening: 'Six workers finish in 8 days. Cut to 4 workers — more days or fewer? More. That's inverse proportion.'", "Mid: 'The product stays fixed: workers times days is always 48. Redistribute, don't recalculate from scratch.'", "Closing: 'Direct proportion is a straight line; inverse proportion bends into a curve.'"],
    },
  },
  {
    topicId: "ap_ssc_math8_ch13_proportion_word_problems",
    subject: "Mathematics",
    chapterNumber: 13,
    name: "Proportion Word Problems (incl. Time & Work)",
    prerequisite_knowledge: ["Direct and inverse proportion", "Identifying which quantity affects which", "Unitary method", "Forming equations from words"],
    key_formulas: [
      "Decide DIRECT (ratio constant) or INVERSE (product constant) from the situation",
      "Time & work: work rate = 1/(time to finish); combined rate = sum of individual rates",
      "If A finishes in a days and B in b days, together: 1/a + 1/b per day",
    ],
    teaching_content: {
      intuition: "Real problems first ask you to DIAGNOSE the relationship: do the quantities move together (direct) or oppositely (inverse)? Once you've decided, you apply the matching rule. Time-and-work problems are inverse-proportion in disguise, solved neatly by thinking in 'rates' — the fraction of the job done per day.",
      derivation: "Step 1: identify the two varying quantities and ask 'if one increases, does the other increase (direct) or decrease (inverse)?'. Step 2: apply x₁/y₁ = x₂/y₂ (direct) or x₁y₁ = x₂y₂ (inverse). \nTime & work: if A does a job in a days, A's rate is 1/a per day. Two workers' combined rate is 1/a + 1/b, so together they finish in 1/(1/a + 1/b) days. Rates ADD; times do not.",
      worked_example: "A can finish a job in 10 days, B in 15 days. How long together?\n\nRates: A = 1/10, B = 1/15 per day. Combined = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6 per day.\nTime together = 1 ÷ (1/6) = 6 days.",
      visual_description: "A decision flowchart: 'Do quantities rise together?' → YES: direct (equal ratios); NO: inverse (equal products). A side panel shows two workers' day-rates 1/10 and 1/15 adding to 1/6.",
      svg_diagrams: [{ title: "Direct vs inverse decision + work rates", svg_code: "<svg viewBox='0 0 230 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><text x='10' y='20'>rise together? → DIRECT (x/y=k)</text><text x='10' y='40'>one up other down? → INVERSE (xy=k)</text><text x='10' y='62' fill='#16a34a'>work: 1/10 + 1/15 = 1/6 → 6 days</text></svg>" }],
      common_misconceptions: ["Adding TIMES instead of RATES in work problems (10 + 15 ≠ together).", "Choosing direct when the situation is inverse (or vice versa).", "Forgetting to convert 'rate' back to 'time' at the end (time = 1/rate).", "Mixing units (days vs hours) without converting."],
      shortcuts_and_tricks: ["Always diagnose direct vs inverse FIRST — it dictates ratio vs product.", "Time & work: add the per-day fractions, then invert to get the combined time.", "Sanity check: together they must finish FASTER than either alone."],
      when_to_use_this_method: "Use for mixed proportion word problems: cost/quantity, speed/time, men-days, pipes filling tanks, and any 'working together' question.",
      edge_cases: ["Some problems combine both proportions (e.g. men AND days AND work) — handle one factor at a time.", "If one worker is slower, the combined time lies between the two individual times, closer to the faster one.", "A pipe that EMPTIES has a negative rate (subtract it)."],
      key_takeaway: "First diagnose direct (constant ratio) vs inverse (constant product), then apply the matching rule. For time-and-work, think in rates: rate = 1/time, add rates for combined work, then invert for the combined time. Never add times directly.",
      video_script_hooks: ["Opening: 'A in 10 days, B in 15 — together in 25? No! Add their RATES, not their times.'", "Mid: 'Step one is always diagnosis: do the quantities move together or apart? That decides everything.'", "Closing: 'Together they must finish faster than either alone — a quick check that your answer makes sense.'"],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch13 (Direct and Inverse Proportions): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
