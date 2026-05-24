/**
 * fix-ch1-content.mjs
 * Restructures ICSE Math10 Ch1 sub-topics to match the Selina textbook:
 *   1.1 (vat_concepts)     → Sales Tax — The Concept
 *   1.2 (vat_computation)  → Sales Tax — Word Problems
 *   1.3 (gst_concepts)     → Value Added Tax — The Concept  (old 1.1 content)
 *   1.4 (gst_computation)  → Value Added Tax — Computation  (old 1.2 content)
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'seedIcseMath10Content.js');
let src = readFileSync(filePath, 'utf8');

// ─── locate the 4 block boundaries ──────────────────────────────────────────
const m11 = '  // ── Sub-topic 1.1 — Value Added Tax: The Concept';
const m12 = '  // ── Sub-topic 1.2 — Value Added Tax: Computation and Word Problems';
const m13 = '  // ── Sub-topic 1.3 — GST: Structure and Input Tax Credit';
const m14 = '  // ── Sub-topic 1.4 — GST: Computation for Intra-state and Inter-state Trade';
const m2  = '  // ════════════════════════════════════════════════════════════════════════════\n  // CHAPTER 2';

const i11 = src.indexOf(m11); if (i11 === -1) throw new Error('marker 1.1 not found');
const i12 = src.indexOf(m12); if (i12 === -1) throw new Error('marker 1.2 not found');
const i13 = src.indexOf(m13); if (i13 === -1) throw new Error('marker 1.3 not found');
const i14 = src.indexOf(m14); if (i14 === -1) throw new Error('marker 1.4 not found');
const i2  = src.indexOf(m2);  if (i2  === -1) throw new Error('chapter 2 marker not found');

// extract old sub-topic blocks (we need 1.1 and 1.2 to move to 1.3/1.4)
const oldST11 = src.slice(i11, i12);  // VAT concept (→ becomes new 1.3)
const oldST12 = src.slice(i12, i13);  // VAT computation (→ becomes new 1.4)

// ─── new sub-topic 1.1 — Sales Tax: The Concept ──────────────────────────────
const newST11 = `  // ── Sub-topic 1.1 — Sales Tax: The Concept and Basic Calculations ─────────
  {
    topicId: "icse_math10_ch1_vat_concepts",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Sales Tax — The Concept and Basic Calculations",

    prerequisite_knowledge: [
      "Percentage of an amount — sales tax is always a percentage of the selling price.",
      "Selling price (SP) and marked price (MP) — the difference between the two.",
      "Addition of money amounts in rupees and paise.",
      "The concept of a government tax on the sale of goods.",
      "Unitary method — if the total (SP + tax) is known, finding SP from it.",
    ],

    key_formulas: [
      {
        formula: "Sales Tax (ST) = (rate / 100) × SP",
        explanation: "Sales tax is a fixed percentage of the selling price, collected by the seller from the buyer and deposited with the government.",
      },
      {
        formula: "Total amount paid by the buyer = SP + ST = SP × (1 + rate/100)",
        explanation: "The buyer pays the selling price plus the sales tax on top of it.",
      },
      {
        formula: "Given total (inclusive of tax) and rate: SP = Total × 100 / (100 + rate)",
        explanation: "When the total including tax is known, divide by (1 + rate/100) to recover the selling price.",
      },
      {
        formula: "Sales Tax from total = Total × rate / (100 + rate)",
        explanation: "Once SP is found, ST = Total − SP. This formula gives it directly from the total.",
      },
    ],

    teaching_content: {
      intuition: {
        elevator_pitch: "Sales Tax is the simplest tax: the government charges a percentage of the selling price. The buyer pays SP + tax. To go backwards when the total is given, divide by (1 + rate/100).",
        hook: "Every time a shopkeeper hands you a bill showing 'Price ₹500 + Tax ₹25 = Total ₹525', that ₹25 is Sales Tax at 5%. The whole Chapter 1 exercise set is built on reconstructing or reverse-engineering bills exactly like this.",
        real_world_anchors: [
          "A shop bill separating 'Price', 'Sales Tax', and 'Total' as three lines.",
          "Buying electronics — the sticker price may or may not include sales tax.",
          "A salesperson saying 'The price is ₹2,000 plus 8% tax'.",
          "A government receipt showing the tax component of a purchase.",
        ],
        the_pivot_idea: "Sales Tax sits ON TOP of the selling price — it is not included unless stated. Total = SP × (1 + rate/100). Reverse this by dividing when the total is given.",
        wrong_intuitions_to_replace: [
          "'Apply the rate to the total amount paid.' — Wrong. Rate is applied to SP (the price before tax), not to the total.",
          "'If tax is 5%, the buyer pays 5% extra on the total.' — Wrong. 5% of SP is added to SP; the buyer's total is SP × 1.05.",
          "'The selling price and the total are the same.' — Wrong. Total = SP + Sales Tax; they differ by the tax amount.",
        ],
      },

      derivation: {
        starting_question: "A shopkeeper sells at price ₹P and the government levies sales tax at r%. What does the buyer actually pay?",
        part_1_forward: {
          claim: "Sales Tax = r% of SP. Buyer pays SP + ST.",
          reasoning: "ST = (r/100) × P. Total = P + (r/100)P = P(1 + r/100). This one formula produces the buyer's entire bill from any SP and rate.",
        },
        part_2_reverse: {
          claim: "Given total T and rate r%, recover SP by dividing.",
          reasoning: "T = P(1 + r/100)  ⟹  P = T × 100/(100 + r). Once P is known, ST = T − P.",
        },
        part_3_discount_first: {
          claim: "When a discount is also given, apply it to the marked price first, THEN apply sales tax to the resulting selling price.",
          reasoning: "Sales tax is charged on what the buyer pays for the goods after the discount. Applying tax to the marked price first would overcharge the buyer.",
          named_concept: "Fixed sequence: Marked Price → (−discount) → Selling Price → (+sales tax) → Total.",
        },
      },

      worked_example: [
        {
          problem: "A person buys a shirt for ₹840 and pays sales tax at 5%. Find the sales tax and the total amount paid.",
          thought_process_before_starting: "Forward problem: ST = 5% of SP. Total = SP + ST.",
          steps: [
            { step_number: 1, action: "Calculate the sales tax.", computation: "ST = 5% of 840 = (5/100) × 840 = ₹42.", reasoning: "Tax is a percentage of the selling price." },
            { step_number: 2, action: "Calculate the total amount paid.", computation: "Total = 840 + 42 = ₹882.", reasoning: "Buyer pays price plus tax." },
          ],
          answer: "Sales Tax = ₹42; Total amount paid = ₹882.",
        },
        {
          problem: "The total price of a watch including 8% sales tax is ₹1,296. Find the price before tax and the sales tax paid.",
          thought_process_before_starting: "Reverse problem — total is given. Use SP = Total × 100/(100 + rate).",
          steps: [
            { step_number: 1, action: "Find SP from the inclusive total.", computation: "SP = 1,296 × 100/108 = ₹1,200.", reasoning: "Total = SP × 1.08, so SP = 1,296 ÷ 1.08 = 1,200." },
            { step_number: 2, action: "Find the sales tax.", computation: "ST = 1,296 − 1,200 = ₹96.", reasoning: "Tax = Total − SP." },
            { step_number: 3, action: "Verify.", computation: "8% of 1,200 = ₹96 ✓.", reasoning: "Rate × SP should equal the tax found." },
          ],
          answer: "Price before tax = ₹1,200; Sales Tax = ₹96.",
        },
      ],

      visual_description: "A two-segment bar: left segment is the Selling Price (SP), right segment is Sales Tax (= rate% of SP). Together they form the Total. A forward arrow shows Total = SP × (1+r/100); a reverse arrow shows SP = Total × 100/(100+r).",

      svg_diagrams: [
        {
          id: "sales_tax_forward_reverse",
          title: "Sales Tax — forward and reverse",
          svg: "<svg viewBox='0 0 760 300' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='300' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SALES TAX — FORWARD AND REVERSE</text><rect x='60' y='80' width='480' height='60' rx='8' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><rect x='540' y='80' width='160' height='60' rx='8' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='300' y='115' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='14' font-weight='700' fill='#1D1D1F'>Selling Price (SP)</text><text x='620' y='108' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Sales Tax</text><text x='620' y='126' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>= r% × SP</text><text x='380' y='175' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#FF2D55'>Forward: Total = SP × (1 + r/100)</text><text x='380' y='210' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#34C759'>Reverse: SP = Total × 100 / (100 + r)</text><rect x='200' y='232' width='360' height='44' rx='8' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='258' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>ST = Total − SP = Total × r / (100 + r)</text></svg>",
        },
      ],

      common_misconceptions: [
        {
          wrong_idea: "Apply the tax rate to the total inclusive price.",
          why_students_fall_for_this: "When the total is given, they compute rate% of total instead of first recovering SP.",
          concrete_wrong_example: "Total ₹882 at 5% → wrong: ST = 5% of 882 = ₹44.10. Correct: ST = 882 × 5/105 = ₹42.",
          correction: "Tax rate applies to SP, not the total. Use SP = Total × 100/(100+r) first.",
          how_to_spot_mid_problem: "Check: your ST should equal rate% of SP. If it equals rate% of the total, you used the wrong base.",
        },
        {
          wrong_idea: "Apply tax to the marked price even when a discount is given.",
          why_students_fall_for_this: "The marked price is the first number given in the problem.",
          concrete_wrong_example: "MP ₹500, 10% discount, 5% ST → wrong: ST = 5% of ₹500 = ₹25. Correct: SP = ₹450, ST = 5% of ₹450 = ₹22.50.",
          correction: "Apply discount first to get SP. Then apply tax to SP.",
          how_to_spot_mid_problem: "If a discount is given but your tax used the marked price, you applied tax before the discount.",
        },
        {
          wrong_idea: "The total inclusive of tax and the SP are the same number.",
          why_students_fall_for_this: "Students read 'price ₹X' and treat it as what the buyer pays without adding tax.",
          concrete_wrong_example: "SP = ₹840, tax = 5% → reporting total = ₹840 instead of ₹882.",
          correction: "SP is the price of the goods. Total = SP + ST. They are different whenever rate > 0.",
          how_to_spot_mid_problem: "If 'total' and 'SP' are stated separately, they must differ by the tax amount.",
        },
      ],

      shortcuts_and_tricks: [
        {
          shortcut: "One-step total",
          rule: "Total = SP × (1 + rate/100).",
          example: "SP ₹840, 5% → Total = 840 × 1.05 = ₹882.",
          when_to_use: "Whenever only the final bill amount is needed.",
        },
        {
          shortcut: "Reverse in one step",
          rule: "SP = Total × 100/(100 + rate).",
          example: "Total ₹882, 5% → SP = 882 × 100/105 = ₹840.",
          when_to_use: "When total inclusive of tax is given and the pre-tax price is needed.",
        },
        {
          shortcut: "Tax from total directly",
          rule: "ST = Total × rate/(100 + rate).",
          example: "Total ₹882, 5% → ST = 882 × 5/105 = ₹42.",
          when_to_use: "When only the tax component is needed from a known total.",
        },
      ],

      when_to_use_this_method: {
        use_sales_tax_thinking_when: [
          "A problem gives the selling price (or marked price with discount) and a tax rate — find the tax and/or total.",
          "A total inclusive of sales tax is given and the pre-tax price or the tax amount must be found.",
          "A bill shows two of: SP, ST, total, rate — find the missing one.",
          "Discount and tax both appear — discount to SP first, then tax on SP.",
        ],
        use_other_methods_instead_when: [
          "The problem is about Value Added Tax across a trade chain — use VAT sub-topics (1.3, 1.4).",
          "No tax is involved — use plain percentage or profit-and-loss methods.",
        ],
      },

      edge_cases: [
        {
          case: "Two items at different tax rates on the same bill",
          value: "Compute the tax on each item separately; total the taxes.",
          reasoning: "Different goods attract different rates; averaging over the combined price is incorrect.",
          where_it_appears: "Bills mixing a food item (lower rate) with a non-food item (higher rate).",
        },
        {
          case: "Tax quoted as already included in the marked price",
          value: "SP = Marked Price × 100/(100 + rate).",
          reasoning: "The marked price already contains the tax; this formula extracts the pre-tax component.",
          where_it_appears: "'The marked price includes 5% sales tax — find the original price' problems.",
        },
      ],

      key_takeaway: "Sales Tax = rate% × SP. The buyer pays SP + ST = SP × (1 + rate/100). To reverse: SP = Total × 100/(100+r). Always apply discount before tax. These three facts handle every Sales Tax question in Chapter 1.",

      video_script_hooks: {
        video_target_length_seconds: 180,
        opening_hook_5_sec: "₹882 on the bill. ₹840 was the price. Where did the extra ₹42 go? That is sales tax — and here is how to find it every time.",
        narrative_arc: "Hook (a real bill) → ST = rate% of SP → total = SP × (1+r/100) → reverse when total is given → discount before tax.",
        visual_moments: [
          { timestamp_seconds: 0,   what_happens_on_screen: "A shop bill: ₹840 + ₹42 = ₹882." },
          { timestamp_seconds: 40,  what_happens_on_screen: "Arrow points to ₹42 — labelled '5% of ₹840'." },
          { timestamp_seconds: 80,  what_happens_on_screen: "The total formula SP × 1.05 animates." },
          { timestamp_seconds: 130, what_happens_on_screen: "Reverse arrow: ₹882 ÷ 1.05 = ₹840." },
          { timestamp_seconds: 165, what_happens_on_screen: "Closing card: 'Discount first, then tax. Total = SP × (1+r/100).'" },
        ],
        closing_takeaway_voiceover: "Sales Tax is the simplest tax: rate% of SP, added to the bill. To find the price when the total is given, divide by (1 + rate/100). Discount first, tax after — that is the rule.",
      },
    },
  },

`;

// ─── new sub-topic 1.2 — Sales Tax: Word Problems ────────────────────────────
const newST12 = `  // ── Sub-topic 1.2 — Sales Tax: Discount, Profit and Multi-step Problems ──────
  {
    topicId: "icse_math10_ch1_vat_computation",
    subject: "Mathematics",
    chapterNumber: 1,
    name: "Sales Tax — Discount, Profit and Multi-step Problems",

    prerequisite_knowledge: [
      "Sales tax concept — ST = rate% × SP; Total = SP × (1 + rate/100) (sub-topic 1.1).",
      "Discount on marked price — SP = MP × (1 − discount%/100).",
      "Profit and loss — SP = CP × (1 + profit%/100).",
      "Finding SP from total when tax is included — SP = Total × 100/(100 + rate).",
      "Setting up arithmetic from word problem conditions to find unknown prices.",
    ],

    key_formulas: [
      {
        formula: "Step order: MP −(discount%)→ SP →(+sales tax%)→ Total",
        explanation: "Apply discount first to find the actual selling price, then compute sales tax on that selling price.",
      },
      {
        formula: "SP = MP × (1 − discount/100);  ST = rate% × SP;  Total = SP + ST = SP × (1 + rate/100).",
        explanation: "The three-step chain for any problem with a marked price, a discount, and a sales tax.",
      },
      {
        formula: "Profit problem: SP = CP × (1 + profit/100),  then  Total = SP × (1 + tax/100).",
        explanation: "Find SP from the profit percentage first, then apply the tax rate on top.",
      },
      {
        formula: "Chain multiplier: Total = MP × (1 − d/100) × (1 + t/100).",
        explanation: "When both a discount and a tax are present, these can be combined into one multiplication.",
      },
    ],

    teaching_content: {
      intuition: {
        elevator_pitch: "Sales tax word problems are multi-step: first settle the selling price (applying discount or profit%), then add the tax. The sequence is non-negotiable — discount and profit come before tax.",
        hook: "A marked price of ₹2,000, a 10% discount, and 5% sales tax — three numbers, one bill. Work left to right: marked price → discount → selling price → tax → total. Reverse the order and every number after is wrong.",
        real_world_anchors: [
          "A sale tag: 'Marked ₹1,500 | Festival 15% off | + 6% tax'.",
          "A shopkeeper who bought a mixer for ₹800, added 25% profit, then charged 5% tax.",
          "You paid ₹1,323 inclusive of tax — how much was the price before tax?",
          "Two items on one bill with different tax rates.",
        ],
        the_pivot_idea: "Discount removes value from the marked price. Tax adds a percentage ON the resulting selling price. They operate on different base numbers. Applying tax to the marked price before discounting is the most common Ch1 error.",
        wrong_intuitions_to_replace: [
          "'Tax on the marked price, then discount.' — Wrong. Discount to SP first, then tax on SP.",
          "'Tax and discount percentages cancel each other if equal.' — Wrong. 0.90 × 1.10 = 0.99, not 1.00 — there is a net 1% reduction.",
          "'Tax on the marked price is the same as tax on SP.' — Wrong unless discount is zero.",
        ],
      },

      derivation: {
        starting_question: "Given a marked price with discount and a sales tax rate, how do we find the total amount the buyer pays?",
        part_1_from_marked_to_sp: {
          claim: "Subtract the discount from the marked price to get the selling price.",
          reasoning: "SP = MP × (1 − d/100). For MP ₹2,000 and 10% off: SP = 2,000 × 0.9 = ₹1,800. Tax is charged on ₹1,800, not ₹2,000.",
        },
        part_2_from_sp_to_total: {
          claim: "Apply sales tax to the selling price to get the total bill.",
          reasoning: "ST = 5% of 1,800 = ₹90. Total = 1,800 + 90 = ₹1,890. Or: Total = 1,800 × 1.05 = ₹1,890.",
        },
        part_3_reverse: {
          claim: "When the total is given, work backwards through the same chain.",
          reasoning: "Total ÷ (1 + t/100) = SP. Then SP ÷ (1 − d/100) = MP. Each reverse step undoes one forward step.",
          named_concept: "Forward chain: MP → SP → Total. Reverse chain: Total → SP → MP.",
        },
      },

      worked_example: [
        {
          problem: "The marked price of an article is ₹2,000. A discount of 10% is given and then 5% sales tax is charged. Find (a) the selling price, (b) the sales tax, and (c) the amount the customer pays.",
          thought_process_before_starting: "Discount first on MP to get SP. Then sales tax on SP.",
          steps: [
            { step_number: 1, action: "Find the selling price after discount.", computation: "SP = 2,000 − 10% of 2,000 = 2,000 − 200 = ₹1,800.", reasoning: "Discount reduces the marked price." },
            { step_number: 2, action: "Find the sales tax on SP.", computation: "ST = 5% of 1,800 = ₹90.", reasoning: "Tax on the actual selling price, not the marked price." },
            { step_number: 3, action: "Total amount paid.", computation: "Total = 1,800 + 90 = ₹1,890.", reasoning: "SP plus sales tax." },
          ],
          answer: "SP ₹1,800; Sales Tax ₹90; Amount paid ₹1,890.",
        },
        {
          problem: "A shopkeeper buys a radio for ₹1,200 and sells it at a profit of 20%. He charges sales tax at 8% on the selling price. Find the total amount the customer pays.",
          thought_process_before_starting: "Find SP from CP and profit first; then tax on SP.",
          steps: [
            { step_number: 1, action: "Find the selling price from the profit.", computation: "SP = 1,200 × 1.20 = ₹1,440.", reasoning: "20% profit on cost price." },
            { step_number: 2, action: "Sales tax on SP.", computation: "ST = 8% of 1,440 = ₹115.20.", reasoning: "Tax charged on the selling price." },
            { step_number: 3, action: "Total paid by customer.", computation: "Total = 1,440 + 115.20 = ₹1,555.20.", reasoning: "SP plus tax." },
          ],
          answer: "Total amount paid by the customer is ₹1,555.20.",
        },
      ],

      visual_description: "A left-to-right pipeline: Marked Price → (−discount%) → Selling Price → (+tax%) → Total. Each arrow labelled with the operation. Warning box: 'Discount on MP. Tax on SP. Never swap.'",

      svg_diagrams: [
        {
          id: "st_word_problem_pipeline",
          title: "Sales Tax Word Problem Pipeline — discount before tax",
          svg: "<svg viewBox='0 0 760 260' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='260' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SALES TAX — WORD PROBLEM PIPELINE</text><rect x='30' y='80' width='150' height='60' rx='9' fill='#F5F5F7' stroke='#86868B' stroke-width='2'/><text x='105' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#86868B'>Marked Price</text><text x='105' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(or CP + profit)</text><rect x='305' y='80' width='150' height='60' rx='9' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='380' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Selling Price</text><text x='380' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(after discount)</text><rect x='580' y='80' width='150' height='60' rx='9' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='655' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Total</text><text x='655' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(SP + Sales Tax)</text><line x1='180' y1='110' x2='303' y2='110' stroke='#1D1D1F' stroke-width='2' marker-end='url(#sp2)'/><line x1='455' y1='110' x2='578' y2='110' stroke='#1D1D1F' stroke-width='2' marker-end='url(#sp2)'/><defs><marker id='sp2' markerWidth='9' markerHeight='9' refX='7' refY='3' orient='auto'><path d='M0,0 L7,3 L0,6 Z' fill='#1D1D1F'/></marker></defs><text x='240' y='100' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#FF9500'>− discount%</text><text x='516' y='100' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#34C759'>+ tax% of SP</text><rect x='200' y='180' width='360' height='50' rx='8' fill='#FFE6B3' stroke='#FF9500' stroke-width='2'/><text x='380' y='200' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#FF2D55'>Discount on MP. Tax on SP. Never swap.</text><text x='380' y='220' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>Total = MP × (1−d/100) × (1+t/100)</text></svg>",
        },
      ],

      common_misconceptions: [
        {
          wrong_idea: "Apply tax to the marked price before the discount.",
          why_students_fall_for_this: "The marked price is the first number given; students rush to use it.",
          concrete_wrong_example: "MP ₹2,000, 10% discount, 5% tax → wrong ST = 5% of 2,000 = ₹100. Correct: ST = 5% of 1,800 = ₹90.",
          correction: "Discount first: SP = 2,000 − 200 = ₹1,800. Then ST = 5% of ₹1,800.",
          how_to_spot_mid_problem: "Tax should be applied to a number smaller than the marked price (the discount has already reduced it).",
        },
        {
          wrong_idea: "A discount of d% and a tax of d% cancel out exactly.",
          why_students_fall_for_this: "Same percentage — students assume they offset each other.",
          concrete_wrong_example: "10% off then 10% tax: MP × 0.9 × 1.1 = MP × 0.99 — a 1% net reduction, not cancellation.",
          correction: "Discount applies to MP; tax applies to the reduced SP. Different bases — they never exactly cancel.",
          how_to_spot_mid_problem: "Compute explicitly: 0.9 × 1.1 = 0.99 ≠ 1.",
        },
        {
          wrong_idea: "Total = MP + tax on MP, even when a discount is given.",
          why_students_fall_for_this: "Forgetting to apply the discount before adding tax.",
          concrete_wrong_example: "MP 2,000, 10% off, 5% tax → wrong total = 2,000 + 100 = ₹2,100. Correct = 1,800 + 90 = ₹1,890.",
          correction: "Subtract discount first, then add tax on the reduced selling price.",
          how_to_spot_mid_problem: "Final total with both discount and tax should be less than MP + tax on MP.",
        },
      ],

      shortcuts_and_tricks: [
        {
          shortcut: "Chain multiplier",
          rule: "Total = MP × (1 − d/100) × (1 + t/100).",
          example: "MP ₹2,000, 10% off, 5% tax → 2,000 × 0.90 × 1.05 = ₹1,890.",
          when_to_use: "Any problem with both a discount and a tax — one combined multiplication replaces two steps.",
        },
        {
          shortcut: "Reverse from total",
          rule: "SP = Total ÷ (1 + t/100); MP = SP ÷ (1 − d/100).",
          example: "Total ₹1,890, 5% tax, 10% discount → SP = 1890/1.05 = 1800; MP = 1800/0.9 = ₹2,000.",
          when_to_use: "When the total and rates are given and MP or SP must be found.",
        },
      ],

      when_to_use_this_method: {
        use_sales_tax_word_problems_when: [
          "A marked price with a discount AND a sales tax rate — find the total bill.",
          "A profit percent with a tax rate — find the customer's total amount.",
          "Total inclusive of tax (and possibly discount) is given — find SP, MP, or the tax paid.",
          "Two items with different discounts or tax rates on one bill.",
        ],
        use_other_methods_instead_when: [
          "The problem is about Value Added Tax in a trade chain — use VAT sub-topics (1.3, 1.4).",
          "No tax is involved — use plain profit, loss and discount methods.",
        ],
      },

      edge_cases: [
        {
          case: "Two items on one bill with different tax rates",
          value: "Compute the tax on each item separately; add the taxes.",
          reasoning: "Different goods attract different rates; averaging the rates over the combined price is incorrect.",
          where_it_appears: "Bills combining a food item (lower rate) with a non-food item (higher rate).",
        },
        {
          case: "Does sales tax affect the shopkeeper's profit?",
          value: "No. Profit = SP − CP, independent of the tax charged to the customer.",
          reasoning: "Sales tax is a pass-through: the shopkeeper collects it and forwards it to the government.",
          where_it_appears: "Problems asking for 'the shopkeeper's profit' when a tax rate is also given.",
        },
      ],

      key_takeaway: "Sales Tax word problems follow a fixed pipeline: Discount on MP → Selling Price → Sales Tax on SP → Total. Profit problems set SP first (SP = CP × (1+p/100)), then add tax. Chain multiplier: Total = MP × (1−d/100) × (1+t/100).",

      video_script_hooks: {
        video_target_length_seconds: 195,
        opening_hook_5_sec: "Marked ₹2,000. 10% off. 5% tax. What does the customer pay? The order matters.",
        narrative_arc: "Hook (a sale tag) → discount to SP → tax on SP → chain multiplier → profit problems → reverse from total.",
        visual_moments: [
          { timestamp_seconds: 0,   what_happens_on_screen: "A sale tag with MP, discount, tax — total unknown." },
          { timestamp_seconds: 40,  what_happens_on_screen: "Discount arrow drops ₹2,000 to ₹1,800." },
          { timestamp_seconds: 80,  what_happens_on_screen: "+5% tax adds ₹90; total ₹1,890 appears." },
          { timestamp_seconds: 130, what_happens_on_screen: "Chain multiplier: 2,000 × 0.90 × 1.05 = 1,890." },
          { timestamp_seconds: 170, what_happens_on_screen: "Closing card: 'Discount → SP → Tax → Total. Every time.'" },
        ],
        closing_takeaway_voiceover: "Sales tax word problems are a pipeline: discount first to find the selling price, then add tax on that selling price. Keep the order — discount before tax — and the arithmetic follows in three lines.",
      },
    },
  },

`;

// ─── new sub-topic 1.3 — VAT: The Concept (old 1.1 content, updated) ─────────
// Take the old 1.1 VAT content and update:
//   • comment header: 1.1 → 1.3
//   • name field
//   • named_concept: remove GST "(sub-topic 1.3)" cross-ref
//   • when_to_use: GST → Sales Tax cross-ref
let newST13 = oldST11
  .replace(
    '  // ── Sub-topic 1.1 — Value Added Tax: The Concept ────────────────────────────',
    '  // ── Sub-topic 1.3 — Value Added Tax: The Concept and Trade Chain ──────────────'
  )
  .replace(
    'name: "Value Added Tax — The Concept"',
    'name: "Value Added Tax — The Concept and Trade Chain"'
  )
  .replace(
    'named_concept: "This is the input-tax-credit (or set-off) method — the same idea that GST later carried forward as Input Tax Credit (sub-topic 1.3)."',
    'named_concept: "This is the input-tax-credit (or set-off) method — each link in the chain is taxed only on the value it adds."'
  )
  .replace(
    '"The problem is about Goods & Services Tax — use the GST structure (sub-topics 1.3, 1.4)."',
    '"The problem is about Sales Tax (a single-stage tax on the sale price) — use Sales Tax sub-topics (1.1, 1.2)."'
  );

// ─── new sub-topic 1.4 — VAT: Computation (old 1.2 content, updated) ─────────
let newST14 = oldST12
  .replace(
    '  // ── Sub-topic 1.2 — Value Added Tax: Computation and Word Problems ──────────',
    '  // ── Sub-topic 1.4 — Value Added Tax: Computation and Word Problems ──────────'
  )
  .replace(
    '"The VAT concept — output tax, input tax, and VAT = rate% × (SP − CP) (sub-topic 1.1)."',
    '"The VAT concept — output tax, input tax, and VAT = rate% × (SP − CP) (sub-topic 1.3)."'
  )
  .replace(
    '"The tax described is GST, not VAT — use GST computation (sub-topic 1.4)."',
    '"The tax described is Sales Tax, not VAT — use Sales Tax sub-topics (1.1, 1.2)."'
  )
  .replace(
    '"Only the conceptual \'why\' of VAT is asked — see the VAT concept (sub-topic 1.1)."',
    '"Only the conceptual \'why\' of VAT is asked — see the VAT concept (sub-topic 1.3)."'
  );

// ─── assemble new Ch1 content ─────────────────────────────────────────────────
const before  = src.slice(0, i11);
const ch2plus = src.slice(i2);

const newSrc = before + newST11 + newST12 + newST13 + newST14 + ch2plus;

writeFileSync(filePath, newSrc);
console.log('Ch1 content rewritten successfully.');
console.log('Sub-topics:');
console.log('  1.1 → Sales Tax: The Concept');
console.log('  1.2 → Sales Tax: Word Problems');
console.log('  1.3 → Value Added Tax: The Concept and Trade Chain');
console.log('  1.4 → Value Added Tax: Computation and Word Problems');
