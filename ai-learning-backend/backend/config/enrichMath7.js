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
