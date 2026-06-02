/**
 * enrichMath7.js — v3 enrichment for CBSE Class 7 Math (ROADMAP / CONTENT_STATUS).
 *
 * The 60 `math7_*` topics ship in v2 format and pass 8/15 of the Math Content
 * Checklist (audit:math --board=CBSE --grade=7). This script PATCHES the 7
 * missing fields per topic to reach 15/15, WITHOUT touching the existing
 * teaching_content keys (intuition/derivation/worked_example/...):
 *
 *   top-level:        key_formulas, prerequisite_knowledge
 *   teaching_content: visual_description, svg_diagrams, when_to_use_this_method,
 *                     edge_cases, video_script_hooks
 *
 * Content is grounded in the NCERT "Ganita Prakash" Grade 7 textbook
 * (C:\...\CBSE 7th class math, gegp101–108 = Ch1–8, gegp201–207 = Ch9–15).
 *
 * Uses dot-notation $set so teaching_content sub-fields merge in place.
 * Idempotent. Accumulates chapter-by-chapter — re-run after adding a chapter.
 *
 * Usage:  node config/enrichMath7.js            # patch every topic present in ENRICH
 *         node config/enrichMath7.js --ch=1      # only chapter 1's topics
 * npm:    npm run enrich:math7
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith("--")).map(a => a.slice(2).split("=")));
const chFilter = args.ch ? `math7_ch${args.ch}_` : null;

// Small helper to keep SVGs compact + valid. Each is a clean, self-contained
// diagram matching the topic's visual_description.
function svg(id, title, inner) {
  return { id, title, svg: `<svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="13">${inner}</svg>` };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Large Numbers Around Us
// ─────────────────────────────────────────────────────────────────────────────
const ENRICH = {
  math7_ch1_lakhs_crores: {
    key_formulas: [
      { formula: "1 lakh = 1,00,000 = 100 × 1,000", explanation: "A hundred thousand — the smallest 6-digit number (1 followed by 5 zeros)." },
      { formula: "1 crore = 1,00,00,000 = 100 × 1 lakh", explanation: "A hundred lakhs — the smallest 8-digit number (1 followed by 7 zeros)." },
      { formula: "1 arab = 100 crore = 1,00,00,00,000", explanation: "A hundred crores (1 followed by 9 zeros)." },
    ],
    prerequisite_knowledge: ["place value up to thousands", "reading and writing whole numbers", "multiplying by 10, 100 and 1000"],
    visual_description: "A place-value chart with the Indian-system groups — Crores | Lakhs | Thousands | Ones — showing 1,00,000 starting the 6-digit (lakh) group and 1,00,00,000 starting the 8-digit (crore) group, with commas in the 3-2-2-2 pattern from the right.",
    svg_diagrams: [svg("math7_ch1_lakhs_crores_groups", "Indian place-value groups (3-2-2-2)",
      `<text x="20" y="30" font-weight="bold">Indian system — comma grouping</text>
       <rect x="20" y="50" width="120" height="40" fill="#e0f2fe" stroke="#0369a1"/><text x="40" y="75">Crores</text>
       <rect x="150" y="50" width="120" height="40" fill="#fef9c3" stroke="#a16207"/><text x="178" y="75">Lakhs</text>
       <rect x="280" y="50" width="120" height="40" fill="#dcfce7" stroke="#15803d"/><text x="300" y="75">Thousands</text>
       <rect x="410" y="50" width="90" height="40" fill="#fae8ff" stroke="#a21caf"/><text x="438" y="75">Ones</text>
       <text x="20" y="130" font-size="15">1,00,00,000 = 1 crore</text>
       <text x="20" y="160" font-size="15">1,00,000 = 1 lakh</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading/writing Indian figures (₹ amounts, population, budgets)", "News and census data quoting lakh/crore"],
      use_other_when: ["International/scientific contexts → use the million/billion (3-3-3) system instead"],
    },
    edge_cases: [
      { case: "99,999 + 1", value: "1,00,000 (one lakh)", reasoning: "The largest 5-digit number rolls over into the smallest 6-digit number.", where_it_appears: "Thousands → lakhs boundary." },
      { case: "99,99,999 + 1", value: "1,00,00,000 (one crore)", reasoning: "The largest 7-digit number rolls over into the smallest 8-digit number.", where_it_appears: "Lakhs → crores boundary." },
    ],
    video_script_hooks: {
      opening_hook: "India once grew about ONE LAKH varieties of rice. If you tasted a new one every single day, could you finish them in a 100-year life? No — 100 years is only about 36,500 days!",
      concept_reveal: "One lakh is 1 followed by five zeros (1,00,000). One crore is a hundred lakhs — 1 followed by seven zeros (1,00,00,000).",
    },
  },

  math7_ch1_place_value: {
    key_formulas: [
      { formula: "Value of a digit = digit × place value", explanation: "e.g. the 7 in 7,00,000 is worth 7 × 1,00,000 = seven lakh." },
      { formula: "Indian places (right→left): Ones, Tens, Hundreds, Thousands, Ten-thousands, Lakhs, Ten-lakhs, Crores …", explanation: "Each place is 10× the one to its right." },
    ],
    prerequisite_knowledge: ["the base-ten place value idea", "knowing lakhs and crores", "expanded form of a number"],
    visual_description: "A digit-by-digit place-value table for 3,45,678 showing each digit above its place name (Lakhs, Ten-thousands, Thousands, Hundreds, Tens, Ones) and its expanded value, e.g. 3×1,00,000 + 4×10,000 + 5×1,000 + 6×100 + 7×10 + 8.",
    svg_diagrams: [svg("math7_ch1_place_value_chart", "Place-value breakdown of 3,45,678",
      `<text x="20" y="28" font-weight="bold">3,45,678 in the Indian place-value chart</text>
       ${["L","TTh","Th","H","T","O"].map((p,i)=>`<rect x="${20+i*88}" y="50" width="84" height="36" fill="#f1f5f9" stroke="#475569"/><text x="${52+i*88}" y="73" text-anchor="middle">${p}</text>`).join("")}
       ${["3","4","5","6","7","8"].map((d,i)=>`<text x="${62+i*88}" y="120" text-anchor="middle" font-size="20" font-weight="bold">${d}</text>`).join("")}
       <text x="20" y="160" font-size="12">3×100000 + 4×10000 + 5×1000 + 6×100 + 7×10 + 8</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Writing a number in expanded form", "Identifying the value a digit contributes", "Comparing numbers digit by digit"],
      use_other_when: ["Pure counting or estimation, where exact place value isn't needed → round instead"],
    },
    edge_cases: [
      { case: "Zero as a place-holder, e.g. 3,05,007", value: "0 contributes nothing but holds the place", reasoning: "Removing the zeros would change every other digit's place value.", where_it_appears: "Numbers with empty middle places." },
      { case: "Same digits, different places (e.g. the two 5s in 5,50,000)", value: "5,00,000 vs 50,000", reasoning: "A digit's worth depends on its position, not just its face value.", where_it_appears: "Face value vs place value questions." },
    ],
    video_script_hooks: {
      opening_hook: "The same digit 5 can be worth five, or fifty thousand, or five lakh — it all depends on WHERE it stands.",
      concept_reveal: "Every place is ten times the place to its right. That single rule builds every large number you'll ever read.",
    },
  },

  math7_ch1_comparing_large: {
    key_formulas: [
      { formula: "More digits ⇒ larger number", explanation: "Any 7-digit number is bigger than any 6-digit number." },
      { formula: "Same digit-count ⇒ compare left to right", explanation: "Compare the leftmost (highest place) digits first; at the first difference, the bigger digit wins." },
    ],
    prerequisite_knowledge: ["place value in large numbers", "ordering single digits", "reading lakhs and crores"],
    visual_description: "Two large numbers stacked and right-aligned with their place-value columns lined up; an arrow scans from the leftmost column rightward to the first column where the digits differ, circling the larger digit to decide which number is greater.",
    svg_diagrams: [svg("math7_ch1_comparing_align", "Compare by aligning place-value columns",
      `<text x="20" y="28" font-weight="bold">Compare 3,45,678 and 3,45,876</text>
       <text x="40" y="70" font-family="monospace" font-size="18">3 4 5 6 7 8</text>
       <text x="40" y="100" font-family="monospace" font-size="18">3 4 5 8 7 6</text>
       <line x1="36" y1="110" x2="190" y2="110" stroke="#475569"/>
       <circle cx="121" cy="93" r="13" fill="none" stroke="#dc2626" stroke-width="2"/>
       <text x="210" y="100" fill="#dc2626">8 &gt; 6 → 3,45,876 is larger</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Ordering quantities (populations, prices) ascending/descending", "Deciding which of two figures is greater"],
      use_other_when: ["Numbers are close and only a rough sense is needed → estimate/round first"],
    },
    edge_cases: [
      { case: "Leading zeros, e.g. 045,678 vs 45,678", value: "Equal", reasoning: "Leading zeros don't change a number's value; count significant digits only.", where_it_appears: "Numbers written with stray leading zeros." },
      { case: "All compared digits equal until the last", value: "Decide at the final differing place", reasoning: "Keep scanning right until digits differ — don't stop early.", where_it_appears: "Numbers differing only in the ones/tens." },
    ],
    video_script_hooks: {
      opening_hook: "Which is bigger: 9,99,999 or 10,00,000? The smaller-looking digits win — because counting the digits comes first.",
      concept_reveal: "Step 1: more digits wins. Step 2: equal digits? Scan left to right to the first difference.",
    },
  },

  math7_ch1_rounding: {
    key_formulas: [
      { formula: "Round to nearest 10/100/1000/lakh: look at the next digit", explanation: "If it is 5 or more, round up; if 4 or less, round down (keep the place digit)." },
      { formula: "Estimate ≈ round each number, then operate", explanation: "Rounding before adding/subtracting gives a quick, close-enough answer." },
    ],
    prerequisite_knowledge: ["place value in large numbers", "comparing digits (≥5 vs <5)", "number line idea of 'nearer to'"],
    visual_description: "A number line segment from 1,00,000 to 2,00,000 with the midpoint 1,50,000 marked; the value 1,37,000 is plotted and an arrow shows it is nearer to 1,00,000, so it rounds to 1,00,000 (nearest lakh).",
    svg_diagrams: [svg("math7_ch1_rounding_numberline", "Rounding 1,37,000 to the nearest lakh",
      `<text x="20" y="28" font-weight="bold">Nearest lakh: 1,37,000 → 1,00,000</text>
       <line x1="40" y1="110" x2="520" y2="110" stroke="#475569" stroke-width="2"/>
       <line x1="40" y1="100" x2="40" y2="120" stroke="#475569"/><text x="20" y="145">1,00,000</text>
       <line x1="280" y1="100" x2="280" y2="120" stroke="#94a3b8"/><text x="250" y="145" fill="#64748b">1,50,000</text>
       <line x1="520" y1="100" x2="520" y2="120" stroke="#475569"/><text x="500" y="145">2,00,000</text>
       <circle cx="218" cy="110" r="6" fill="#dc2626"/><text x="180" y="90" fill="#dc2626">1,37,000</text>
       <path d="M218 110 L70 110" stroke="#dc2626" stroke-width="2" marker-end="url(#a)"/>
       <defs><marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/></marker></defs>`)],
    when_to_use_this_method: {
      use_this_when: ["Estimating totals/populations quickly", "Checking whether a calculated answer is reasonable", "Reporting figures 'about' a round value"],
      use_other_when: ["Money to the rupee, measurements, or any exact answer is required → don't round"],
    },
    edge_cases: [
      { case: "The next digit is exactly 5, e.g. 1,50,000 to nearest lakh", value: "Rounds up to 2,00,000", reasoning: "The standard rule rounds 5 upward.", where_it_appears: "Halfway values." },
      { case: "Rounding up causes a carry, e.g. 99,600 to nearest thousand", value: "1,00,000", reasoning: "Rounding the 9s up cascades into a new higher place.", where_it_appears: "Numbers just below a place boundary." },
    ],
    video_script_hooks: {
      opening_hook: "A town's population is 1,06,000. The news says 'about one lakh'. Were they lying? No — they rounded.",
      concept_reveal: "To round, peek at the very next digit: 5 or more rounds up, 4 or less stays. That's the whole trick.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 2 — Arithmetic Expressions
  // ───────────────────────────────────────────────────────────────────────────
  math7_ch2_expressions_intro: {
    key_formulas: [
      { formula: "expression → value  (e.g. 13 + 2 = 15)", explanation: "Every arithmetic expression evaluates to a single number, its value." },
      { formula: "Compare expressions by value with <, =, >", explanation: "10 + 2 > 7 + 1 because 12 > 8." },
    ],
    prerequisite_knowledge: ["the four operations (+ − × ÷)", "comparing whole numbers with <, =, >", "reading number sentences"],
    visual_description: "Two expression cards — '10 + 2' and '7 + 1' — each showing its value (12 and 8) below it, with a '>' sign between the cards because the left value is greater.",
    svg_diagrams: [svg("math7_ch2_expressions_compare", "Comparing expressions by their values",
      `<text x="20" y="28" font-weight="bold">Compare expressions by value</text>
       <rect x="40" y="55" width="150" height="70" fill="#dcfce7" stroke="#15803d"/><text x="80" y="90" font-size="18">10 + 2</text><text x="95" y="115" fill="#15803d">= 12</text>
       <text x="225" y="98" font-size="28" fill="#dc2626">&gt;</text>
       <rect x="280" y="55" width="150" height="70" fill="#fee2e2" stroke="#b91c1c"/><text x="320" y="90" font-size="18">7 + 1</text><text x="335" y="115" fill="#b91c1c">= 8</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Translating a word phrase ('sum of', 'product of') into symbols", "Comparing two quantities written as expressions"],
      use_other_when: ["A bare number with no operation — there's nothing to evaluate"],
    },
    edge_cases: [
      { case: "Different expressions, same value: 10+2, 15−3, 3×4, 24÷2", value: "all equal 12", reasoning: "Many expressions can share a single value.", where_it_appears: "Writing equivalent expressions." },
      { case: "Compare without full computation: 1023+125 vs 1022+128", value: "the second is greater", reasoning: "1022+128 = (1023−1)+(125+3) = (1023+125)+2.", where_it_appears: "Reasoning about expressions, not just numbers." },
    ],
    video_script_hooks: {
      opening_hook: "'5 times 25' and '125' are the same thing in different clothes — one is an expression, the other is its value.",
      concept_reveal: "An arithmetic expression is a phrase like 13 + 2; its value is the single number it equals. Compare expressions by comparing their values.",
    },
  },

  math7_ch2_brackets: {
    key_formulas: [
      { formula: "Evaluate inside ( ) first", explanation: "30 + (5 × 4) = 30 + 20 = 50 — the bracket is computed before the rest." },
      { formula: "a − (b + c) groups the whole subtraction", explanation: "100 − (15 + 56) = 100 − 71 = 29." },
    ],
    prerequisite_knowledge: ["arithmetic expressions and their values", "the four operations", "left-to-right reading of expressions"],
    visual_description: "The expression 30 + (5 × 4) with the bracketed part highlighted and an arrow showing it is evaluated first to 20, then added to 30 to give 50.",
    svg_diagrams: [svg("math7_ch2_brackets_first", "Brackets are evaluated first",
      `<text x="20" y="28" font-weight="bold">30 + (5 × 4)</text>
       <rect x="78" y="45" width="80" height="32" fill="#fef9c3" stroke="#a16207"/><text x="92" y="67">5 × 4</text>
       <text x="180" y="67" fill="#a16207">→ 20</text>
       <text x="20" y="110" font-size="16">30 + 20 = 50</text>
       <text x="20" y="150" fill="#64748b" font-size="12">Without brackets, terms decide: 30 + 5 × 4 = 50 too — but (30+5)×4 = 140.</text>`)],
    when_to_use_this_method: {
      use_this_when: ["You must do an addition/subtraction BEFORE a multiplication", "Grouping a phrase like 'total of two costs, then doubled'"],
      use_other_when: ["No brackets present → use the order-of-operations (terms) rule instead"],
    },
    edge_cases: [
      { case: "Nested brackets: 2 × (3 + (4 − 1))", value: "work innermost first → 2 × (3 + 3) = 12", reasoning: "Resolve the inner ( ) before the outer.", where_it_appears: "Multi-level grouping." },
      { case: "Brackets change the answer: 30 + 5 × 4 vs (30 + 5) × 4", value: "50 vs 140", reasoning: "Brackets override the default order of operations.", where_it_appears: "Why brackets matter at all." },
    ],
    video_script_hooks: {
      opening_hook: "30 + 5 × 4: is it 50 or 140? One tiny pair of brackets decides.",
      concept_reveal: "Brackets are a 'do me first' instruction — whatever is inside gets evaluated before anything outside.",
    },
  },

  math7_ch2_evaluating: {
    key_formulas: [
      { formula: "Terms = parts separated by +", explanation: "In 83 − 14 the terms are 83 and −14 (subtraction is adding a negative)." },
      { formula: "Evaluate each term's × and ÷, then add the terms", explanation: "30 + 5 × 4 → terms 30 and (5×4=20) → 30 + 20 = 50." },
    ],
    prerequisite_knowledge: ["arithmetic expressions and values", "multiplication and division facts", "the idea of a negative number"],
    visual_description: "The expression 30 + 5 × 4 with the single term '5 × 4' boxed, an arrow reducing it to 20, and the next line showing 30 + 20 = 50.",
    svg_diagrams: [svg("math7_ch2_terms", "Split into terms, evaluate, then add",
      `<text x="20" y="28" font-weight="bold">30 + 5 × 4  →  terms: 30 and (5 × 4)</text>
       <rect x="20" y="50" width="70" height="34" fill="#dcfce7" stroke="#15803d"/><text x="44" y="73">30</text>
       <text x="98" y="73" font-size="18">+</text>
       <rect x="118" y="50" width="90" height="34" fill="#fef9c3" stroke="#a16207"/><text x="140" y="73">5 × 4</text><text x="220" y="73" fill="#a16207">→ 20</text>
       <text x="20" y="120" font-size="16">30 + 20 = 50</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Evaluating an expression with mixed + and ×/÷ and no brackets", "Deciding which operation happens first"],
      use_other_when: ["Brackets are present → evaluate inside them first"],
    },
    edge_cases: [
      { case: "Subtraction as a term: 83 − 14", value: "terms 83 and −14", reasoning: "Reading − as +(−) lets you swap and group terms safely.", where_it_appears: "Reordering subtraction expressions." },
      { case: "Swapping terms: 30 + 20 = 20 + 30", value: "same value", reasoning: "Terms can be added in any order (commutativity).", where_it_appears: "Grouping for easier mental math." },
    ],
    video_script_hooks: {
      opening_hook: "30 + 5 × 4 has no brackets — so how do you know what to do first? Break it into 'terms'.",
      concept_reveal: "Split at the + signs into terms, finish each term's × and ÷, then add the terms together.",
    },
  },

  math7_ch2_order_operations: {
    key_formulas: [
      { formula: "Order: Brackets → ×/÷ → +/−", explanation: "Brackets first, then multiplication/division, then addition/subtraction." },
      { formula: "Same level → left to right", explanation: "12 ÷ 3 × 2 = 4 × 2 = 8 (not 12 ÷ 6)." },
    ],
    prerequisite_knowledge: ["brackets in expressions", "terms in an expression", "the four operations"],
    visual_description: "A top-to-bottom ladder labelled Brackets, then ×/÷, then +/−, with 100 − (15 + 56) + 2 × 3 worked down the ladder: brackets → 71, then 2×3 → 6, then 100 − 71 + 6 = 35.",
    svg_diagrams: [svg("math7_ch2_order_ladder", "Order of operations ladder",
      `<text x="20" y="26" font-weight="bold">Order of operations</text>
       <rect x="20" y="40" width="200" height="30" fill="#e0f2fe" stroke="#0369a1"/><text x="34" y="60">1. Brackets ( )</text>
       <rect x="20" y="78" width="200" height="30" fill="#fef9c3" stroke="#a16207"/><text x="34" y="98">2. × and ÷ (left→right)</text>
       <rect x="20" y="116" width="200" height="30" fill="#dcfce7" stroke="#15803d"/><text x="34" y="136">3. + and − (left→right)</text>
       <text x="250" y="60" font-size="12">100 − (15+56) + 2×3</text>
       <text x="250" y="98" font-size="12">= 100 − 71 + 6</text>
       <text x="250" y="136" font-size="12">= 35</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Any expression mixing several operations", "Deciding the sequence of steps in a multi-operation calculation"],
      use_other_when: ["A single operation — order doesn't arise"],
    },
    edge_cases: [
      { case: "÷ and × together: 12 ÷ 3 × 2", value: "8, not 2", reasoning: "Same level → go left to right; don't always do × before ÷.", where_it_appears: "Classic BODMAS trap." },
      { case: "Only + and −: 10 − 3 + 2", value: "9, not 5", reasoning: "Same level → left to right; subtraction isn't done 'before' addition.", where_it_appears: "Left-to-right within a level." },
    ],
    video_script_hooks: {
      opening_hook: "12 ÷ 3 × 2 — is it 8 or 2? Most people slip by doing × before ÷.",
      concept_reveal: "Brackets, then ×/÷, then +/− — and on the same level, always work left to right.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 3 — A Peek Beyond the Point (decimals)
  // ───────────────────────────────────────────────────────────────────────────
  math7_ch3_place_value_decimal: {
    key_formulas: [
      { formula: "Places after the point: tenths (1/10), hundredths (1/100), thousandths (1/1000)", explanation: "Each place is one-tenth of the place to its left." },
      { formula: "3.45 = 3 + 4×(1/10) + 5×(1/100)", explanation: "Expanded form of a decimal." },
    ],
    prerequisite_knowledge: ["whole-number place value", "fractions with denominators 10, 100, 1000", "reading decimal notation"],
    visual_description: "A place-value chart with a decimal point separating Ones • Tenths • Hundredths • Thousandths, showing 3.45 with 3 in ones, 4 in tenths, 5 in hundredths.",
    svg_diagrams: [svg("math7_ch3_decimal_places", "Decimal place-value chart for 3.45",
      `<text x="20" y="26" font-weight="bold">3.45 in the place-value chart</text>
       ${["Ones","Tenths","Hundredths"].map((p,i)=>`<rect x="${20+i*150}" y="45" width="140" height="34" fill="#f1f5f9" stroke="#475569"/><text x="${90+i*150}" y="67" text-anchor="middle">${p}</text>`).join("")}
       <text x="90" y="115" text-anchor="middle" font-size="22" font-weight="bold">3</text>
       <text x="170" y="115" font-size="22" font-weight="bold">.</text>
       <text x="240" y="115" text-anchor="middle" font-size="22" font-weight="bold">4</text>
       <text x="390" y="115" text-anchor="middle" font-size="22" font-weight="bold">5</text>
       <text x="20" y="155" font-size="12">= 3 + 4×(1/10) + 5×(1/100)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Reading/writing a decimal in expanded form", "Naming the value of a digit after the point"],
      use_other_when: ["Whole numbers only — there are no fractional places"],
    },
    edge_cases: [
      { case: "Trailing zeros: 3.4 vs 3.40", value: "equal", reasoning: "Zeros after the last decimal digit don't change the value.", where_it_appears: "Writing/comparing decimals." },
      { case: "Leading zero in tenths: 0.05", value: "5 hundredths, not 5 tenths", reasoning: "The 0 in the tenths place is a placeholder.", where_it_appears: "Small decimals." },
    ],
    video_script_hooks: {
      opening_hook: "2.7 cm means 2 whole centimetres and 7 tenths of the next one. The dot is where whole numbers end and parts begin.",
      concept_reveal: "After the point: tenths, then hundredths, then thousandths — each ten times smaller than the last.",
    },
  },

  math7_ch3_decimal_fractions: {
    key_formulas: [
      { formula: "0.1 = 1/10,  0.01 = 1/100", explanation: "A decimal is just a fraction with denominator 10, 100, 1000…" },
      { formula: "0.25 = 25/100 = 1/4", explanation: "Write the decimal over its place value, then simplify." },
    ],
    prerequisite_knowledge: ["decimal place value", "equivalent fractions and simplifying", "fractions with denominators 10 and 100"],
    visual_description: "A 10×10 hundred-square with 25 of the 100 cells shaded, labelled 0.25 = 25/100 = 1/4.",
    svg_diagrams: [svg("math7_ch3_hundred_square", "0.25 as 25/100 on a hundred-square",
      `<text x="20" y="22" font-weight="bold">0.25 = 25/100 = 1/4</text>
       ${Array.from({length:10}).map((_,r)=>Array.from({length:10}).map((_,c)=>{const i=r*10+c;const fill=i<25?"#60a5fa":"#fff";return `<rect x="${30+c*15}" y="${30+r*15}" width="15" height="15" fill="${fill}" stroke="#94a3b8"/>`;}).join("")).join("")}
       <text x="200" y="110" font-size="13">25 of 100 squares shaded</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Converting between a decimal and a fraction", "Recognising 0.5 = 1/2, 0.2 = 1/5, 0.75 = 3/4"],
      use_other_when: ["Denominators that don't divide a power of 10 (e.g. 1/3) — those give non-terminating decimals"],
    },
    edge_cases: [
      { case: "1/3 as a decimal", value: "0.333… (non-terminating)", reasoning: "3 doesn't divide any power of 10, so it never terminates.", where_it_appears: "Not every fraction is a 'neat' decimal." },
      { case: "0.50 → fraction", value: "50/100 = 1/2", reasoning: "Always reduce to lowest terms.", where_it_appears: "Decimal → fraction conversion." },
    ],
    video_script_hooks: {
      opening_hook: "0.25 and 1/4 and 'a quarter' are three names for the same amount. Decimals are secretly fractions.",
      concept_reveal: "Put the decimal's digits over its place value (0.25 = 25/100), then simplify the fraction.",
    },
  },

  math7_ch3_comparing_decimals: {
    key_formulas: [
      { formula: "Align the decimal points, then compare place by place (left → right)", explanation: "Whole part first, then tenths, then hundredths…" },
      { formula: "Pad with zeros to equal length: 0.5 = 0.50", explanation: "Makes the place-by-place comparison straightforward." },
    ],
    prerequisite_knowledge: ["decimal place value", "comparing whole numbers", "equivalent decimals (trailing zeros)"],
    visual_description: "0.5 and 0.45 written with decimal points aligned (0.50 vs 0.45); an arrow scans the tenths place: 5 > 4, so 0.5 is greater.",
    svg_diagrams: [svg("math7_ch3_compare_decimals", "Compare 0.5 and 0.45 by aligning points",
      `<text x="20" y="26" font-weight="bold">Compare 0.5 and 0.45</text>
       <text x="60" y="70" font-family="monospace" font-size="20">0.50</text>
       <text x="60" y="100" font-family="monospace" font-size="20">0.45</text>
       <circle cx="92" cy="63" r="13" fill="none" stroke="#dc2626" stroke-width="2"/>
       <text x="180" y="88" fill="#dc2626">tenths: 5 &gt; 4 → 0.5 is larger</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Ordering decimals (prices, measurements)", "Deciding which of two decimals is larger"],
      use_other_when: ["Quantities in different units — convert to the same unit first"],
    },
    edge_cases: [
      { case: "0.5 vs 0.45", value: "0.5 is greater", reasoning: "More digits ≠ larger; compare the tenths first (5 > 4).", where_it_appears: "The classic decimal-comparison trap." },
      { case: "Trailing zeros: 0.5 vs 0.50", value: "equal", reasoning: "Padding zeros don't change the value.", where_it_appears: "Equivalent decimals." },
    ],
    video_script_hooks: {
      opening_hook: "Which is bigger: 0.5 or 0.45? It LOOKS like 0.45 has more digits — but 0.5 wins.",
      concept_reveal: "Line up the decimal points, pad with zeros, then compare digit by digit from the left.",
    },
  },

  math7_ch3_decimals_review: {
    key_formulas: [
      { formula: "Decimal = whole part + fractional part, split by the point", explanation: "6.3 = 6 units and 3 tenths." },
      { formula: "Add/subtract by aligning decimal points", explanation: "Line up the points, then operate place by place, carrying/borrowing as usual." },
    ],
    prerequisite_knowledge: ["decimal place value", "decimals ↔ fractions", "comparing decimals"],
    visual_description: "Two lengths 2.7 cm and 3.6 cm stacked with decimal points aligned and summed to 6.3 cm (13 tenths regroup to 1 unit + 3 tenths).",
    svg_diagrams: [svg("math7_ch3_decimal_add", "Aligned decimal addition: 2.7 + 3.6 = 6.3",
      `<text x="20" y="26" font-weight="bold">Align the points, then add</text>
       <text x="80" y="64" font-family="monospace" font-size="20">  2.7</text>
       <text x="80" y="92" font-family="monospace" font-size="20">+ 3.6</text>
       <line x1="80" y1="102" x2="180" y2="102" stroke="#475569"/>
       <text x="80" y="128" font-family="monospace" font-size="20">  6.3</text>
       <text x="220" y="100" font-size="12" fill="#64748b">7+6 = 13 tenths = 1 unit + 3 tenths</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Everyday decimal quantities: money, lengths, masses", "Combining or comparing measured values"],
      use_other_when: ["Exact fractions like 1/3 that don't terminate — keep them as fractions"],
    },
    edge_cases: [
      { case: "Regrouping tenths: 2.7 + 3.6", value: "6.3 (13 tenths = 1 unit + 3 tenths)", reasoning: "Carry from the tenths into the units, like whole-number addition.", where_it_appears: "Decimal addition." },
      { case: "Borrowing across the point: 12.4 − 4.7", value: "7.7", reasoning: "Split a whole unit into 10 tenths to subtract.", where_it_appears: "Decimal subtraction." },
    ],
    video_script_hooks: {
      opening_hook: "₹2.70 + ₹3.60 = ₹6.30 — and the only rule that matters is: line up the dots.",
      concept_reveal: "A decimal is whole units plus tenths/hundredths; add or subtract them by aligning the decimal points first.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 4 — Letter-Numbers (algebraic expressions)
  // ───────────────────────────────────────────────────────────────────────────
  math7_ch4_variables_intro: {
    key_formulas: [
      { formula: "A letter-number (variable) stands for an unknown or changing quantity", explanation: "e.g. let a = Aftab's age; a can take different values." },
      { formula: "Algebraic expression = numbers + letter-numbers + operations, e.g. a + 3", explanation: "It produces a value once the letter is given a value." },
    ],
    prerequisite_knowledge: ["arithmetic expressions", "the idea of an unknown quantity", "the four operations"],
    visual_description: "Aftab's age 'a' in a box with a '+3' arrow leading to Shabnam's age box 's = a + 3'; below, a = 23 is substituted to give s = 26.",
    svg_diagrams: [svg("math7_ch4_letter_number", "A letter-number stands for a quantity",
      `<text x="20" y="26" font-weight="bold">s = a + 3  (Shabnam is 3 years older)</text>
       <rect x="30" y="50" width="90" height="40" fill="#e0f2fe" stroke="#0369a1"/><text x="60" y="75">a (Aftab)</text>
       <text x="130" y="75" font-size="16">+3 →</text>
       <rect x="180" y="50" width="120" height="40" fill="#dcfce7" stroke="#15803d"/><text x="200" y="75">s = a + 3</text>
       <text x="30" y="125" font-size="13">a = 23  →  s = 23 + 3 = 26</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A quantity is unknown or can change", "Describing a relationship that holds for any value"],
      use_other_when: ["A fixed, known number — just use the number itself"],
    },
    edge_cases: [
      { case: "4 × q vs 4q", value: "the same thing", reasoning: "In algebra the × is dropped between a number and a letter.", where_it_appears: "Writing expressions compactly." },
      { case: "a + 3 is a rule, not one number", value: "value changes with a", reasoning: "An expression with a letter has many possible values.", where_it_appears: "Understanding what a variable means." },
    ],
    video_script_hooks: {
      opening_hook: "Shabnam is always 3 years older than Aftab. You can capture that one fact, for EVERY year, in two symbols: a + 3.",
      concept_reveal: "A letter-number is a stand-in for a quantity; an expression like a + 3 turns a relationship into algebra.",
    },
  },

  math7_ch4_writing_expressions: {
    key_formulas: [
      { formula: "Translate a relationship into letters + operations", explanation: "'3 more than a' → a + 3;  '4 times q' → 4q." },
      { formula: "Perimeter of a square = 4 × side = 4q", explanation: "A formula is an expression that works for every value of the side." },
    ],
    prerequisite_knowledge: ["letter-numbers / variables", "the four operations", "reading word relationships"],
    visual_description: "A three-column table — word phrase → relationship → expression — with rows like 'cost of c chairs at ₹j each' → c × j, and 'perimeter of a square, side q' → 4q.",
    svg_diagrams: [svg("math7_ch4_phrase_to_expr", "Words → relationship → expression",
      `<text x="20" y="24" font-weight="bold">Turning words into expressions</text>
       ${["Phrase","Expression"].map((h,i)=>`<rect x="${20+i*260}" y="40" width="260" height="30" fill="#f1f5f9" stroke="#475569"/><text x="${30+i*260}" y="60" font-weight="bold">${h}</text>`).join("")}
       <text x="30" y="92">3 more than a</text><text x="290" y="92">a + 3</text>
       <text x="30" y="120">4 times the side q</text><text x="290" y="120">4q</text>
       <text x="30" y="148">cost of c chairs at ₹j</text><text x="290" y="148">c × j</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Turning a word problem into algebra", "Writing a general formula (perimeter, cost)"],
      use_other_when: ["A one-off calculation with only known numbers — no letters needed"],
    },
    edge_cases: [
      { case: "'a less than b'", value: "b − a (not a − b)", reasoning: "Word order isn't symbol order for − and ÷.", where_it_appears: "Translating subtraction phrases." },
      { case: "'twice the sum of a and b'", value: "2(a + b), not 2a + b", reasoning: "Brackets capture 'add first, then double'.", where_it_appears: "Phrases that need brackets." },
    ],
    video_script_hooks: {
      opening_hook: "'The total cost of c chairs at ₹j each.' How do you write that once, for any number of chairs? c × j.",
      concept_reveal: "Spot the relationship in the words, then write it with letters and operations — that's an algebraic expression.",
    },
  },

  math7_ch4_substituting: {
    key_formulas: [
      { formula: "Substitute = replace each letter with its given value, then evaluate", explanation: "a + 3 with a = 23 → 23 + 3 = 26." },
      { formula: "4q with q = 7 → 4 × 7 = 28", explanation: "Replace the letter, then do the arithmetic (respecting order of operations)." },
    ],
    prerequisite_knowledge: ["algebraic expressions", "order of operations", "the four operations"],
    visual_description: "The expression 4q with q = 7: the q is replaced by 7, giving 4 × 7 = 28; alongside, a + 3 with a = 23 → 26.",
    svg_diagrams: [svg("math7_ch4_substitute", "Substitute a value, then evaluate",
      `<text x="20" y="26" font-weight="bold">Substitute the value, then compute</text>
       <text x="40" y="70" font-size="18">4q ,  q = 7</text>
       <text x="40" y="100" font-size="18">→ 4 × 7 = 28</text>
       <text x="280" y="70" font-size="18">a + 3 , a = 23</text>
       <text x="280" y="100" font-size="18">→ 23 + 3 = 26</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding the value of an expression/formula for given numbers", "Checking a relationship for specific values"],
      use_other_when: ["No values are given — leave the expression in letters"],
    },
    edge_cases: [
      { case: "4q with q = 7 means 4 × 7", value: "28, not 47", reasoning: "4q is multiplication, not digits written side by side.", where_it_appears: "Common substitution slip." },
      { case: "Order of operations after substituting: a + 5a, a = 2", value: "2 + 10 = 12", reasoning: "Do the multiplication (5a) before the addition.", where_it_appears: "Multi-operation expressions." },
    ],
    video_script_hooks: {
      opening_hook: "The formula 4q gives a square's perimeter. Side 7 cm? Just swap q for 7: 4 × 7 = 28 cm.",
      concept_reveal: "To use a formula, substitute — replace every letter with its number, then evaluate.",
    },
  },

  math7_ch4_simple_equations: {
    key_formulas: [
      { formula: "Equation: two expressions set equal, with an unknown, e.g. x + 3 = 10", explanation: "Solving means finding the value of the letter that makes it true." },
      { formula: "Undo operations to solve: x + 3 = 10 → x = 10 − 3 = 7", explanation: "Apply the inverse operation to both sides." },
    ],
    prerequisite_knowledge: ["letter-numbers", "substituting values", "inverse operations (+/−, ×/÷)"],
    visual_description: "A balance scale: left pan holds x + 3, right pan holds 10; removing 3 from both pans keeps it balanced and leaves x = 7.",
    svg_diagrams: [svg("math7_ch4_equation_balance", "Solve x + 3 = 10 by balancing",
      `<text x="20" y="24" font-weight="bold">x + 3 = 10  →  x = 7</text>
       <line x1="60" y1="60" x2="500" y2="60" stroke="#475569" stroke-width="3"/>
       <line x1="280" y1="60" x2="280" y2="150" stroke="#475569" stroke-width="3"/>
       <rect x="110" y="70" width="120" height="40" fill="#e0f2fe" stroke="#0369a1"/><text x="150" y="95">x + 3</text>
       <rect x="330" y="70" width="120" height="40" fill="#dcfce7" stroke="#15803d"/><text x="380" y="95">10</text>
       <text x="60" y="140" font-size="12">Remove 3 from both pans → x = 7</text>`)],
    when_to_use_this_method: {
      use_this_when: ["A condition pins the unknown to a single value", "Word problems: 'find the number such that…'"],
      use_other_when: ["Just describing a relationship (an expression) with no '=' condition"],
    },
    edge_cases: [
      { case: "Check by substituting back: x = 7 in x + 3 = 10", value: "7 + 3 = 10 ✓", reasoning: "Substitution verifies your solution is correct.", where_it_appears: "Checking equation answers." },
      { case: "Do the same to both sides", value: "keeps the equation balanced", reasoning: "An equation stays true only if both sides change equally.", where_it_appears: "The balance method of solving." },
    ],
    video_script_hooks: {
      opening_hook: "x + 3 = 10. What's x? Your brain already said 7 — equations just write that reasoning down.",
      concept_reveal: "An equation is a balance. To find the unknown, undo what's done to it — and do the same to both sides.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 5 — Parallel and Intersecting Lines
  // ───────────────────────────────────────────────────────────────────────────
  math7_ch5_intersecting_lines: {
    key_formulas: [
      { formula: "Two distinct lines meet at exactly one point", explanation: "They can never intersect at more than one point." },
      { formula: "Intersecting lines form 4 angles that total 360°", explanation: "The angles all around the crossing point add up to a full turn." },
    ],
    prerequisite_knowledge: ["points, lines and rays", "measuring angles with a protractor", "straight angle = 180°"],
    visual_description: "Two lines l and m crossing at a point, with the four angles a, b, c, d marked around the intersection.",
    svg_diagrams: [svg("math7_ch5_intersect", "Two lines crossing form four angles",
      `<text x="20" y="22" font-weight="bold">Lines l and m intersect → 4 angles</text>
       <line x1="60" y1="150" x2="300" y2="50" stroke="#0369a1" stroke-width="2"/>
       <line x1="60" y1="50" x2="300" y2="150" stroke="#15803d" stroke-width="2"/>
       <text x="180" y="75" font-size="14">a</text><text x="210" y="105" font-size="14">b</text>
       <text x="180" y="135" font-size="14">c</text><text x="150" y="105" font-size="14">d</text>
       <text x="310" y="55" fill="#0369a1">l</text><text x="310" y="150" fill="#15803d">m</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Analysing the angles where two lines cross", "Setting up linear-pair / vertically-opposite reasoning"],
      use_other_when: ["Parallel lines, which never meet — there's no intersection"],
    },
    edge_cases: [
      { case: "Perpendicular lines", value: "all four angles = 90°", reasoning: "A special crossing where the lines meet at right angles.", where_it_appears: "Perpendiculars." },
      { case: "Can two lines meet at 2 points?", value: "No — exactly one", reasoning: "Two points determine a unique line, so distinct lines share at most one point.", where_it_appears: "Why lines intersect just once." },
    ],
    video_script_hooks: {
      opening_hook: "Cross two straight lines and — always — exactly four angles appear. They're not random: they come in matched pairs.",
      concept_reveal: "Two distinct lines meet at one point and form four angles that add to 360°.",
    },
  },

  math7_ch5_angles_intersection: {
    key_formulas: [
      { formula: "Linear pair: adjacent angles on a straight line sum to 180°", explanation: "a + b = 180°." },
      { formula: "Vertically opposite angles are equal", explanation: "b = d and a = c." },
    ],
    prerequisite_knowledge: ["intersecting lines", "straight angle = 180°", "adding and subtracting angles"],
    visual_description: "Two intersecting lines with angles a, b, c, d; the linear pair a + b = 180° is bracketed, and arrows mark the equal vertically opposite angles b = d.",
    svg_diagrams: [svg("math7_ch5_angle_pairs", "Linear pairs (180°) and vertically opposite (equal)",
      `<text x="20" y="22" font-weight="bold">a+b = 180°  ·  b = d (opposite)</text>
       <line x1="60" y1="140" x2="300" y2="60" stroke="#475569" stroke-width="2"/>
       <line x1="60" y1="60" x2="300" y2="140" stroke="#475569" stroke-width="2"/>
       <text x="175" y="78" font-size="14">a</text><text x="205" y="104" font-size="14">b</text>
       <text x="175" y="128" font-size="14">c</text><text x="148" y="104" font-size="14">d</text>
       <text x="320" y="80" font-size="12" fill="#dc2626">a + b = 180°</text>
       <text x="320" y="110" font-size="12" fill="#0369a1">b = d</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding an unknown angle at a crossing when one angle is known", "Proving angle relationships"],
      use_other_when: ["Angles not formed by two straight lines crossing"],
    },
    edge_cases: [
      { case: "Given one angle = 60°", value: "the others are 120°, 60°, 120°", reasoning: "Linear pair gives 120°; the vertically opposite angle repeats 60°.", where_it_appears: "Find-the-angle problems." },
      { case: "All four angles equal", value: "each is 90° (perpendicular)", reasoning: "Equal linear-pair angles must each be 90°.", where_it_appears: "Special perpendicular case." },
    ],
    video_script_hooks: {
      opening_hook: "Tell me ONE of the four angles at a crossing, and I'll tell you the other three — without measuring.",
      concept_reveal: "Adjacent angles form a linear pair (sum 180°); opposite angles are vertically opposite (equal).",
    },
  },

  math7_ch5_parallel_lines: {
    key_formulas: [
      { formula: "Parallel lines never meet and stay the same distance apart (l ∥ m)", explanation: "The perpendicular gap between them is constant everywhere." },
      { formula: "Parallel lines have no point of intersection", explanation: "Unlike intersecting lines, they form no crossing angles by themselves." },
    ],
    prerequisite_knowledge: ["lines and points", "intersecting lines", "perpendicular distance between lines"],
    visual_description: "Two horizontal lines l and m with equal perpendicular gaps marked at several points and the ∥ symbol, showing they never meet.",
    svg_diagrams: [svg("math7_ch5_parallel", "Parallel lines stay equidistant",
      `<text x="20" y="24" font-weight="bold">l ∥ m  (constant gap)</text>
       <line x1="40" y1="70" x2="520" y2="70" stroke="#0369a1" stroke-width="2"/><text x="525" y="74" fill="#0369a1">l</text>
       <line x1="40" y1="130" x2="520" y2="130" stroke="#15803d" stroke-width="2"/><text x="525" y="134" fill="#15803d">m</text>
       ${[120,280,440].map(x=>`<line x1="${x}" y1="70" x2="${x}" y2="130" stroke="#dc2626" stroke-dasharray="3 3"/>`).join("")}
       <text x="150" y="105" font-size="11" fill="#dc2626">same gap</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Describing rails, ruled lines, opposite sides of a rectangle", "Setting up transversal angle relationships"],
      use_other_when: ["Lines that meet — those are intersecting, not parallel"],
    },
    edge_cases: [
      { case: "Lines that look parallel but slowly converge", value: "not parallel", reasoning: "Parallel requires a constant gap forever, not just nearby.", where_it_appears: "Careful definitions." },
      { case: "Is a line parallel to itself?", value: "No — parallel lines are distinct", reasoning: "By convention parallel means two different lines.", where_it_appears: "Definition nuance." },
    ],
    video_script_hooks: {
      opening_hook: "Railway tracks run side by side for kilometres and never touch. That 'never touch, same distance' is what parallel means.",
      concept_reveal: "Parallel lines keep a constant perpendicular distance and never intersect.",
    },
  },

  math7_ch5_transversal: {
    key_formulas: [
      { formula: "A transversal is a line that crosses two or more lines", explanation: "With two lines it creates 8 angles." },
      { formula: "Across parallels: corresponding equal, alternate equal, co-interior sum 180°", explanation: "The three key transversal angle relationships." },
    ],
    prerequisite_knowledge: ["parallel lines", "angles at an intersection", "linear pair & vertically opposite angles"],
    visual_description: "Two parallel lines cut by a slanted transversal, with corresponding angles (same position) marked equal, alternate interior angles marked equal, and co-interior angles marked as summing to 180°.",
    svg_diagrams: [svg("math7_ch5_transversal", "Transversal across two parallel lines",
      `<text x="20" y="20" font-weight="bold">Transversal cuts l ∥ m → angle pairs</text>
       <line x1="40" y1="70" x2="500" y2="70" stroke="#0369a1" stroke-width="2"/><text x="505" y="74" fill="#0369a1">l</text>
       <line x1="40" y1="140" x2="500" y2="140" stroke="#15803d" stroke-width="2"/><text x="505" y="144" fill="#15803d">m</text>
       <line x1="150" y1="40" x2="330" y2="170" stroke="#dc2626" stroke-width="2"/>
       <text x="205" y="62" font-size="12">1</text><text x="260" y="132" font-size="12">5</text>
       <text x="120" y="100" font-size="11" fill="#dc2626">corresponding ∠1 = ∠5</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding angles when a line crosses parallels", "Proving two lines are parallel from equal corresponding angles"],
      use_other_when: ["The two crossed lines aren't parallel — the equal/supplementary relations don't hold"],
    },
    edge_cases: [
      { case: "Lines crossed are NOT parallel", value: "corresponding angles are NOT equal", reasoning: "The equalities depend on the two lines being parallel.", where_it_appears: "Why parallelism is the key condition." },
      { case: "Co-interior (allied) angles", value: "sum to 180° (supplementary), not equal", reasoning: "Unlike corresponding/alternate angles, which are equal.", where_it_appears: "Distinguishing angle-pair types." },
    ],
    video_script_hooks: {
      opening_hook: "One slanted line cuts across two parallel rails and instantly creates eight angles — but really just two different sizes.",
      concept_reveal: "A transversal makes corresponding and alternate angles equal, and co-interior angles add to 180° — but only when the lines are parallel.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 6 — Number Play (parity, patterns, divisibility, magic squares)
  // ───────────────────────────────────────────────────────────────────────────
  math7_ch6_divisibility: {
    key_formulas: [
      { formula: "÷2: last digit even · ÷5: last digit 0 or 5 · ÷10: last digit 0", explanation: "Quick checks from the final digit alone." },
      { formula: "÷3 (and ÷9): the digit sum is divisible by 3 (or 9)", explanation: "Add all digits, then test the sum." },
      { formula: "÷4: the last two digits form a multiple of 4", explanation: "e.g. 1,316 → 16 ÷ 4 ✓." },
    ],
    prerequisite_knowledge: ["multiples and factors", "adding digits", "the four operations"],
    visual_description: "The number 4,536 run through a divisibility checklist: last digit 6 → ÷2 ✓; digit sum 4+5+3+6=18 → ÷3 and ÷9 ✓; last two digits 36 → ÷4 ✓.",
    svg_diagrams: [svg("math7_ch6_divisibility", "Divisibility checks on 4,536",
      `<text x="20" y="24" font-weight="bold">Is 4,536 divisible by …?</text>
       <text x="30" y="56">÷2  last digit 6 (even)            ✓</text>
       <text x="30" y="82">÷3  digit sum 18                   ✓</text>
       <text x="30" y="108">÷9  digit sum 18                   ✓</text>
       <text x="30" y="134">÷4  last two digits 36             ✓</text>
       <text x="30" y="160">÷5  last digit 6                   ✗</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Testing divisibility without doing the full division", "Finding factors or simplifying fractions"],
      use_other_when: ["You actually need the quotient or remainder → do the division"],
    },
    edge_cases: [
      { case: "Divisible by 3 but not 9: 24 (digit sum 6)", value: "÷3 ✓, ÷9 ✗", reasoning: "6 is a multiple of 3 but not of 9.", where_it_appears: "Distinguishing the two digit-sum tests." },
      { case: "0 divided by any non-zero number", value: "always divisible", reasoning: "0 = n × 0 for every n.", where_it_appears: "Edge of the divisibility idea." },
    ],
    video_script_hooks: {
      opening_hook: "Is 4,536 divisible by 9? You don't need to divide — just add the digits: 4+5+3+6 = 18. Done.",
      concept_reveal: "Divisibility tests read clues from the digits: last digit for 2/5/10, digit sum for 3/9, last two digits for 4.",
    },
  },

  math7_ch6_magic_squares: {
    key_formulas: [
      { formula: "Magic square: every row, column and diagonal share the same sum (the magic constant)", explanation: "For a 3×3 filled with 1–9, that constant is 15." },
      { formula: "Magic constant for n×n using 1..n² = n(n²+1)/2", explanation: "3×3 → 3×10/2 = 15." },
    ],
    prerequisite_knowledge: ["addition", "number patterns", "the numbers 1–9 (for a 3×3)"],
    visual_description: "A 3×3 magic square 2 7 6 / 9 5 1 / 4 3 8, with each row, column and diagonal annotated as summing to 15.",
    svg_diagrams: [svg("math7_ch6_magic_square", "3×3 magic square (sum 15)",
      `<text x="20" y="22" font-weight="bold">Every line sums to 15</text>
       ${[[2,7,6],[9,5,1],[4,3,8]].map((row,r)=>row.map((n,c)=>`<rect x="${60+c*50}" y="${35+r*50}" width="50" height="50" fill="#f1f5f9" stroke="#475569"/><text x="${82+c*50}" y="${66+r*50}" font-size="18">${n}</text>`).join("")).join("")}
       <text x="230" y="66" fill="#dc2626">= 15</text><text x="230" y="116" fill="#dc2626">= 15</text><text x="230" y="166" fill="#dc2626">= 15</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Logic and number puzzles", "Practising addition and pattern reasoning"],
      use_other_when: ["Ordinary arithmetic — a magic square is a puzzle structure, not a calculation tool"],
    },
    edge_cases: [
      { case: "Centre cell of a 3×3 (1–9) magic square", value: "always 5", reasoning: "The middle value, sitting on 4 of the magic lines, must be 5.", where_it_appears: "Solving 3×3 squares." },
      { case: "Rotating or reflecting a magic square", value: "still magic", reasoning: "Turning or flipping keeps every row/column/diagonal sum unchanged.", where_it_appears: "Counting 'distinct' magic squares." },
    ],
    video_script_hooks: {
      opening_hook: "Arrange 1 to 9 in a grid so every row, column AND diagonal adds to the same number. There's a reason that number is always 15.",
      concept_reveal: "A magic square balances every line to one magic constant — for 3×3 with 1–9 it's 15, and the centre is always 5.",
    },
  },

  math7_ch6_number_patterns: {
    key_formulas: [
      { formula: "Sum of the first n odd numbers = n²", explanation: "1 + 3 + 5 + … + (2n−1) = n² (the dots form a square)." },
      { formula: "even+even = even · odd+odd = even · even+odd = odd", explanation: "Parity rules for sums." },
    ],
    prerequisite_knowledge: ["even and odd numbers", "addition", "spotting a rule in a sequence"],
    visual_description: "Growing dot-squares: 1 dot (1×1), then 1+3=4 (2×2), then 1+3+5=9 (3×3) — each added odd number forms an L-shaped border that completes the next square.",
    svg_diagrams: [svg("math7_ch6_odd_squares", "Sum of odd numbers makes squares",
      `<text x="20" y="22" font-weight="bold">1 + 3 + 5 + … = n²</text>
       ${[[0,0],[1,0],[0,1],[2,0],[2,1],[2,2],[0,2],[1,2]].map(([c,r],i)=>`<circle cx="${50+c*26}" cy="${50+r*26}" r="9" fill="${i===0?'#0369a1':i<3?'#15803d':'#a16207'}"/>`).join("")}
       <text x="170" y="56">1 = 1²</text><text x="170" y="82">1+3 = 4 = 2²</text><text x="170" y="108">1+3+5 = 9 = 3²</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Predicting the next term of a sequence", "Explaining WHY a pattern holds (parity, square numbers)"],
      use_other_when: ["A list of numbers with no underlying rule"],
    },
    edge_cases: [
      { case: "Sum of 5 odd numbers", value: "is odd — can't equal 30", reasoning: "An odd count of odd numbers gives an odd total.", where_it_appears: "Kishor's 5-box puzzle." },
      { case: "Sum of two odd numbers", value: "always even", reasoning: "(2a+1)+(2b+1) = 2(a+b+1).", where_it_appears: "Parity reasoning." },
    ],
    video_script_hooks: {
      opening_hook: "Add up the odd numbers: 1, then 1+3, then 1+3+5 … you get 1, 4, 9 — the perfect squares. Coincidence? No.",
      concept_reveal: "Patterns aren't magic: each odd number adds an L-shaped layer that completes the next square, so the running total is always n².",
    },
  },

  math7_ch6_number_puzzles: {
    key_formulas: [
      { formula: "Use parity and divisibility to rule out impossibilities first", explanation: "An odd count of odd numbers can never sum to an even total." },
      { formula: "Work backwards from the constraints", explanation: "Each clue narrows the remaining possibilities." },
    ],
    prerequisite_knowledge: ["even/odd parity", "divisibility tests", "number patterns"],
    visual_description: "Kishor's puzzle: 5 empty boxes to be filled with odd-number cards that should total 30, with a crossed-out note: 5 odds → an odd sum, so reaching the even total 30 is impossible.",
    svg_diagrams: [svg("math7_ch6_puzzle", "Parity proves the puzzle impossible",
      `<text x="20" y="24" font-weight="bold">Fill 5 boxes with odd cards → total 30?</text>
       ${[0,1,2,3,4].map(i=>`<rect x="${40+i*70}" y="45" width="56" height="40" fill="#fff" stroke="#475569"/><text x="${62+i*70}" y="71" fill="#94a3b8">odd</text>`).join("")}
       <text x="40" y="120" fill="#dc2626">5 odds → odd sum ≠ 30 (even). Impossible.</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Deciding whether a target is even possible before searching", "Logic puzzles with number constraints"],
      use_other_when: ["Direct computation, when there's no constraint to exploit"],
    },
    edge_cases: [
      { case: "Target parity mismatch", value: "no solution exists", reasoning: "If the parity can't match, stop — searching is pointless.", where_it_appears: "Impossible puzzles." },
      { case: "Several valid fills", value: "more than one answer", reasoning: "Constraints may not pin down a unique solution.", where_it_appears: "Open-ended puzzles." },
    ],
    video_script_hooks: {
      opening_hook: "Five boxes, odd-number cards, must total 30. Before trying ANY combination — it's impossible. Parity tells you instantly.",
      concept_reveal: "Smart puzzlers check parity and divisibility first to rule out the impossible, then search only what's left.",
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // CHAPTER 7 — A Tale of Three Intersecting Lines (triangles)
  // ───────────────────────────────────────────────────────────────────────────
  math7_ch7_triangle_basics: {
    key_formulas: [
      { formula: "A triangle has 3 sides, 3 vertices and 3 angles", explanation: "The simplest closed figure made of straight lines." },
      { formula: "Triangle inequality: each side < the sum of the other two", explanation: "e.g. 3,4,5 works (3+4>5); 10,15,30 does not (10+15<30)." },
    ],
    prerequisite_knowledge: ["points, line segments and angles", "measuring lengths", "intersecting lines"],
    visual_description: "Triangle ABC with vertices A, B, C labelled, its three sides marked, beside a number line showing why sides 10, 15, 30 cannot close into a triangle (10+15 < 30).",
    svg_diagrams: [svg("math7_ch7_triangle_basics", "A triangle and the triangle inequality",
      `<polygon points="60,160 200,160 140,50" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
       <text x="50" y="178">A</text><text x="200" y="178">B</text><text x="138" y="44">C</text>
       <text x="300" y="80" font-weight="bold">3, 4, 5  ✓ (3+4 &gt; 5)</text>
       <text x="300" y="120" fill="#dc2626">10, 15, 30  ✗ (10+15 &lt; 30)</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Checking whether three given lengths can form a triangle", "Naming the parts of a triangle"],
      use_other_when: ["The figure has more than 3 sides → it's a quadrilateral/polygon, not a triangle"],
    },
    edge_cases: [
      { case: "Sides 10, 15, 30", value: "no triangle", reasoning: "10+15 = 25 < 30, so the two short sides can't reach.", where_it_appears: "Triangle inequality check." },
      { case: "Sides 5, 5, 10", value: "degenerate (flat)", reasoning: "5+5 = 10 exactly — the triangle collapses to a straight line.", where_it_appears: "Boundary of the inequality." },
    ],
    video_script_hooks: {
      opening_hook: "Can you build a triangle with sides 10, 15 and 30? Try it — the two short sticks never meet. There's a rule for that.",
      concept_reveal: "Three lengths form a triangle only if each side is shorter than the sum of the other two — the triangle inequality.",
    },
  },

  math7_ch7_triangle_types: {
    key_formulas: [
      { formula: "By sides: equilateral (3 equal) · isosceles (2 equal) · scalene (none equal)", explanation: "Classify by how many sides match." },
      { formula: "By angles: acute (<90°) · right (=90°) · obtuse (>90°)", explanation: "Classify by the largest angle." },
    ],
    prerequisite_knowledge: ["measuring sides and angles", "what equal lengths mean", "angle sizes (acute/right/obtuse)"],
    visual_description: "Three triangles side by side — equilateral (all sides tick-marked equal), isosceles (two ticks), scalene (no equal marks) — each labelled.",
    svg_diagrams: [svg("math7_ch7_triangle_types", "Triangles classified by sides",
      `<polygon points="40,150 110,150 75,55" fill="#ecfdf5" stroke="#059669"/><text x="55" y="172">equilateral</text>
       <polygon points="210,150 290,150 250,55" fill="#eff6ff" stroke="#2563eb"/><text x="225" y="172">isosceles</text>
       <polygon points="380,150 470,150 400,60" fill="#fef2f2" stroke="#dc2626"/><text x="395" y="172">scalene</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Naming a triangle from its sides or angles", "Deciding which properties (e.g. equal base angles) apply"],
      use_other_when: ["You only need the angle sum — that's the same for every triangle"],
    },
    edge_cases: [
      { case: "Equilateral triangle", value: "also isosceles", reasoning: "Having 3 equal sides means it certainly has 2 equal sides too.", where_it_appears: "Overlapping categories." },
      { case: "Right isosceles triangle", value: "angles 90°, 45°, 45°", reasoning: "A triangle can be classified by sides AND angles at once.", where_it_appears: "Set squares." },
    ],
    video_script_hooks: {
      opening_hook: "All three sides equal? Just two? None? That one question splits every triangle in the world into three families.",
      concept_reveal: "By sides: equilateral, isosceles, scalene. By angles: acute, right, obtuse. A triangle gets one name from each list.",
    },
  },

  math7_ch7_angle_sum: {
    key_formulas: [
      { formula: "The three angles of any triangle add to 180°", explanation: "∠A + ∠B + ∠C = 180°, always." },
      { formula: "Exterior angle = sum of the two opposite interior angles", explanation: "Because the exterior angle and its neighbour make 180° too." },
    ],
    prerequisite_knowledge: ["angles on a straight line = 180°", "parallel lines and a transversal", "triangle basics"],
    visual_description: "Triangle ABC with a line through C parallel to AB; the three angles at C (made by the parallel) recombine onto the straight line to show they total 180°.",
    svg_diagrams: [svg("math7_ch7_angle_sum", "Angles of a triangle sum to 180°",
      `<polygon points="60,160 240,160 150,60" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
       <line x1="90" y1="60" x2="210" y2="60" stroke="#059669" stroke-dasharray="5 4"/>
       <text x="70" y="155">a</text><text x="225" y="155">b</text><text x="143" y="80">c</text>
       <text x="300" y="105" font-weight="bold">a + b + c = 180°</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding a missing angle when two are known", "Checking whether three angles can form a triangle (sum must be 180°)"],
      use_other_when: ["You need side lengths — angles alone don't fix size, only shape"],
    },
    edge_cases: [
      { case: "Two angles 60° and 70°", value: "third = 50°", reasoning: "180 − 60 − 70 = 50.", where_it_appears: "Find-the-missing-angle problems." },
      { case: "Two angles already summing to 180° or more", value: "no triangle", reasoning: "Two angles must total less than 180° to leave room for the third.", where_it_appears: "Existence check." },
    ],
    video_script_hooks: {
      opening_hook: "Tear off the three corners of ANY paper triangle and lay them together — they always form a straight line. Every single time.",
      concept_reveal: "Slide each corner onto a line parallel to the opposite side and they fill a straight angle — that's why the angles total 180°.",
    },
  },

  math7_ch7_triangle_properties: {
    key_formulas: [
      { formula: "Isosceles triangle: the angles opposite the two equal sides are equal", explanation: "Equal sides ⇒ equal base angles." },
      { formula: "Equilateral triangle: every angle = 60°", explanation: "Three equal sides ⇒ three equal angles, and 180°/3 = 60°." },
    ],
    prerequisite_knowledge: ["triangle types", "angle sum = 180°", "the triangle inequality"],
    visual_description: "An isosceles triangle with its two equal sides tick-marked and the two equal base angles arc-marked, beside an equilateral triangle with all three 60° angles shown.",
    svg_diagrams: [svg("math7_ch7_triangle_properties", "Equal sides give equal angles",
      `<polygon points="60,160 180,160 120,55" fill="#eff6ff" stroke="#2563eb" stroke-width="2"/>
       <text x="62" y="155">=</text><text x="170" y="155">=</text>
       <text x="300" y="80" font-weight="bold">Isosceles: base angles equal</text>
       <text x="300" y="120">Equilateral: all angles = 60°</text>`)],
    when_to_use_this_method: {
      use_this_when: ["Finding angles in an isosceles/equilateral triangle from its equal sides", "Justifying why two angles must be equal"],
      use_other_when: ["A scalene triangle — no two sides or angles match, so these shortcuts don't apply"],
    },
    edge_cases: [
      { case: "Isosceles with apex angle 40°", value: "base angles 70° each", reasoning: "(180 − 40)/2 = 70.", where_it_appears: "Angle-chasing problems." },
      { case: "Equilateral angle", value: "exactly 60°", reasoning: "180/3 = 60 — never anything else.", where_it_appears: "Standard fact." },
    ],
    video_script_hooks: {
      opening_hook: "Fold an isosceles triangle along its line of symmetry — the two base angles land exactly on top of each other. They're equal, and here's why.",
      concept_reveal: "Equal sides force equal opposite angles; push that to three equal sides and every angle becomes 60°.",
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const entries = Object.entries(ENRICH).filter(([id]) => !chFilter || id.startsWith(chFilter));
  if (!entries.length) { console.log(`Nothing to enrich for filter ${chFilter || "(all)"}.`); await mongoose.disconnect(); return; }

  let patched = 0, missing = 0;
  for (const [topicId, f] of entries) {
    const set = {
      key_formulas:           f.key_formulas,
      prerequisite_knowledge: f.prerequisite_knowledge,
      "teaching_content.visual_description":      f.visual_description,
      "teaching_content.svg_diagrams":            f.svg_diagrams,
      "teaching_content.when_to_use_this_method": f.when_to_use_this_method,
      "teaching_content.edge_cases":              f.edge_cases,
      "teaching_content.video_script_hooks":      f.video_script_hooks,
    };
    const r = await NcertTopicContent.updateOne({ topicId }, { $set: set });
    if (r.matchedCount === 0) { console.log(`  ✗ MISSING in DB: ${topicId}`); missing++; }
    else { console.log(`  ✓ enriched ${topicId}`); patched++; }
  }
  console.log(`\nDone — ${patched} enriched, ${missing} missing (of ${entries.length}).`);
  await mongoose.disconnect();
  process.exit(missing ? 1 : 0);
}
run().catch((e) => { console.error("enrichMath7 failed:", e.message); process.exit(1); });
