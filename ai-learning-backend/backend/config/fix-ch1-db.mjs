/**
 * fix-ch1-db.mjs
 * Updates the 4 Ch1 ICSE Math10 sub-topics in MongoDB + the seed file to match
 * the Selina textbook:
 *   vat_concepts     → Sales Tax: The Concept (was VAT concept)
 *   vat_computation  → Sales Tax: Word Problems (was VAT computation)
 *   gst_concepts     → Value Added Tax: The Concept (old vat_concepts content)
 *   gst_computation  → Value Added Tax: Computation (old vat_computation content)
 */
import mongoose from 'mongoose';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = (await mongoose.connect(process.env.MONGO_URI)).connection.db;
const col = db.collection('ncerttopiccontents');

// ── Pull existing VAT concept + computation from DB (will become 1.3 / 1.4) ──
const oldVatConcept = await col.findOne(
  { topicId: 'icse_math10_ch1_vat_concepts' },
  { projection: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 } }
);
const oldVatComputation = await col.findOne(
  { topicId: 'icse_math10_ch1_vat_computation' },
  { projection: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 } }
);

if (!oldVatConcept || !oldVatComputation)
  throw new Error('Could not find existing vat_concepts or vat_computation in DB');

// ── Build new sub-topic 1.3 = old VAT concept with updates ───────────────────
const newGstConcepts = {
  ...oldVatConcept,
  topicId: 'icse_math10_ch1_gst_concepts',
  name: 'Value Added Tax — The Concept and Trade Chain',
};
// patch the named_concept cross-reference
if (newGstConcepts.teaching_content?.derivation?.part_3_the_slices_add_up?.named_concept) {
  newGstConcepts.teaching_content.derivation.part_3_the_slices_add_up.named_concept =
    'This is the input-tax-credit (or set-off) method — each link in the chain is taxed only on the value it adds.';
}
// patch when_to_use cross-reference
if (newGstConcepts.teaching_content?.when_to_use_this_method?.use_other_methods_instead_when) {
  newGstConcepts.teaching_content.when_to_use_this_method.use_other_methods_instead_when =
    newGstConcepts.teaching_content.when_to_use_this_method.use_other_methods_instead_when.map(s =>
      s.includes('Goods & Services Tax') || s.includes('GST structure')
        ? 'The problem is about Sales Tax (a single-stage tax) — use Sales Tax sub-topics (1.1, 1.2).'
        : s
    );
}

// ── Build new sub-topic 1.4 = old VAT computation with updates ───────────────
const newGstComputation = {
  ...oldVatComputation,
  topicId: 'icse_math10_ch1_gst_computation',
  name: 'Value Added Tax — Computation and Word Problems',
};
// patch prerequisite cross-reference
if (newGstComputation.prerequisite_knowledge) {
  newGstComputation.prerequisite_knowledge = newGstComputation.prerequisite_knowledge.map(s =>
    s.replace('(sub-topic 1.1)', '(sub-topic 1.3)')
  );
}
// patch when_to_use cross-references
if (newGstComputation.teaching_content?.when_to_use_this_method?.use_other_methods_instead_when) {
  newGstComputation.teaching_content.when_to_use_this_method.use_other_methods_instead_when =
    newGstComputation.teaching_content.when_to_use_this_method.use_other_methods_instead_when.map(s =>
      s.includes('GST') || s.includes('sub-topic 1.4)')
        ? 'The tax described is Sales Tax, not VAT — use Sales Tax sub-topics (1.1, 1.2).'
        : s.replace('(sub-topic 1.1)', '(sub-topic 1.3)')
    );
}

// ── New sub-topic 1.1 — Sales Tax: The Concept ───────────────────────────────
const newVatConcepts = {
  topicId: 'icse_math10_ch1_vat_concepts',
  subject: 'Mathematics',
  chapterNumber: 1,
  name: 'Sales Tax — The Concept and Basic Calculations',

  prerequisite_knowledge: [
    'Percentage of an amount — sales tax is always a percentage of the selling price.',
    'Selling price (SP) and marked price (MP) — the difference between the two.',
    'Addition of money amounts in rupees and paise.',
    'The concept of a government tax on the sale of goods.',
    'Unitary method — if the total (SP + tax) is known, finding SP from it.',
  ],

  key_formulas: [
    {
      formula: 'Sales Tax (ST) = (rate / 100) × SP',
      explanation: 'Sales tax is a fixed percentage of the selling price, collected by the seller from the buyer and deposited with the government.',
    },
    {
      formula: 'Total amount paid by the buyer = SP + ST = SP × (1 + rate/100)',
      explanation: 'The buyer pays the selling price plus the sales tax on top of it.',
    },
    {
      formula: 'Given total (inclusive of tax) and rate: SP = Total × 100 / (100 + rate)',
      explanation: 'When the total including tax is known, divide by (1 + rate/100) to recover the selling price.',
    },
    {
      formula: 'Sales Tax from total = Total × rate / (100 + rate)',
      explanation: 'Once SP is found, ST = Total − SP. This formula gives it directly from the total.',
    },
  ],

  teaching_content: {
    intuition: {
      elevator_pitch: 'Sales Tax is the simplest tax: the government charges a percentage of the selling price. The buyer pays SP + tax. To go backwards when the total is given, divide by (1 + rate/100).',
      hook: 'Every time a shopkeeper hands you a bill showing "Price ₹500 + Tax ₹25 = Total ₹525", that ₹25 is Sales Tax at 5%. The whole Chapter 1 exercise set is built on reconstructing or reverse-engineering bills exactly like this.',
      real_world_anchors: [
        "A shop bill separating 'Price', 'Sales Tax', and 'Total' as three lines.",
        'Buying electronics — the sticker price may or may not include sales tax.',
        "A salesperson saying 'The price is ₹2,000 plus 8% tax'.",
        'A government receipt showing the tax component of a purchase.',
      ],
      the_pivot_idea: 'Sales Tax sits ON TOP of the selling price — it is not included unless stated. Total = SP × (1 + rate/100). Reverse this by dividing when the total is given.',
      wrong_intuitions_to_replace: [
        "'Apply the rate to the total amount paid.' — Wrong. Rate is applied to SP (before tax).",
        "'If tax is 5%, the buyer pays 5% extra on the total.' — Wrong. 5% of SP is added to SP.",
        "'The selling price and the total are the same.' — Wrong. Total = SP + Sales Tax.",
      ],
    },
    derivation: {
      starting_question: 'A shopkeeper sells at price ₹P and the government levies sales tax at r%. What does the buyer pay?',
      part_1_forward: {
        claim: 'Sales Tax = r% of SP. Buyer pays SP + ST.',
        reasoning: 'ST = (r/100) × P. Total = P + (r/100)P = P(1 + r/100).',
      },
      part_2_reverse: {
        claim: 'Given total T and rate r%, recover SP by dividing.',
        reasoning: 'T = P(1 + r/100) ⟹ P = T × 100/(100 + r). ST = T − P.',
      },
      part_3_discount_first: {
        claim: 'When a discount is also given, apply it to the marked price first, THEN apply sales tax.',
        reasoning: 'Sales tax is charged on what the buyer pays for the goods after the discount.',
        named_concept: 'Fixed sequence: Marked Price → (−discount) → Selling Price → (+sales tax) → Total.',
      },
    },
    worked_example: [
      {
        problem: 'A person buys a shirt for ₹840 and pays sales tax at 5%. Find the sales tax and the total amount paid.',
        thought_process_before_starting: 'Forward: ST = 5% of SP. Total = SP + ST.',
        steps: [
          { step_number: 1, action: 'Calculate the sales tax.', computation: 'ST = 5% of 840 = ₹42.', reasoning: 'Tax is a percentage of the selling price.' },
          { step_number: 2, action: 'Calculate the total.', computation: 'Total = 840 + 42 = ₹882.', reasoning: 'Buyer pays price plus tax.' },
        ],
        answer: 'Sales Tax = ₹42; Total = ₹882.',
      },
      {
        problem: 'The total price of a watch including 8% sales tax is ₹1,296. Find the price before tax and the sales tax.',
        thought_process_before_starting: 'Reverse: total is given. Use SP = Total × 100/(100 + rate).',
        steps: [
          { step_number: 1, action: 'Find SP from total.', computation: 'SP = 1,296 × 100/108 = ₹1,200.', reasoning: 'Total = SP × 1.08 ⇒ SP = 1,296 ÷ 1.08.' },
          { step_number: 2, action: 'Find the sales tax.', computation: 'ST = 1,296 − 1,200 = ₹96.', reasoning: 'Tax = Total − SP.' },
          { step_number: 3, action: 'Verify.', computation: '8% of 1,200 = ₹96 ✓.', reasoning: 'Rate × SP = tax found.' },
        ],
        answer: 'Price before tax = ₹1,200; Sales Tax = ₹96.',
      },
    ],
    visual_description: 'A two-segment bar: left = Selling Price (SP), right = Sales Tax (= rate% of SP). Together = Total. Forward: Total = SP × (1+r/100). Reverse: SP = Total × 100/(100+r).',
    svg_diagrams: [
      {
        id: 'sales_tax_forward_reverse',
        title: 'Sales Tax — forward and reverse',
        svg: "<svg viewBox='0 0 760 300' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='300' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SALES TAX — FORWARD AND REVERSE</text><rect x='60' y='80' width='480' height='60' rx='8' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><rect x='540' y='80' width='160' height='60' rx='8' fill='#FFE6B3' stroke='#1D1D1F' stroke-width='2'/><text x='300' y='115' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='14' font-weight='700' fill='#1D1D1F'>Selling Price (SP)</text><text x='620' y='108' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Sales Tax</text><text x='620' y='126' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>= r% × SP</text><text x='380' y='175' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='700' fill='#FF2D55'>Forward: Total = SP × (1 + r/100)</text><text x='380' y='210' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' fill='#34C759'>Reverse: SP = Total × 100 / (100 + r)</text><rect x='200' y='232' width='360' height='44' rx='8' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='380' y='258' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>ST = Total − SP = Total × r / (100 + r)</text></svg>",
      },
    ],
    common_misconceptions: [
      {
        wrong_idea: 'Apply the tax rate to the total inclusive price.',
        why_students_fall_for_this: 'When the total is given, they compute rate% of total instead of first recovering SP.',
        concrete_wrong_example: 'Total ₹882 at 5% → wrong: ST = 5% of 882 = ₹44.10. Correct: ST = 882 × 5/105 = ₹42.',
        correction: 'Tax rate applies to SP, not the total. Use SP = Total × 100/(100+r) first.',
        how_to_spot_mid_problem: 'Your ST should equal rate% of SP, not rate% of the total.',
      },
      {
        wrong_idea: 'Apply tax to the marked price even when a discount is given.',
        why_students_fall_for_this: 'The marked price is the first number given.',
        concrete_wrong_example: 'MP ₹500, 10% off, 5% ST → wrong: ST = 5% of ₹500 = ₹25. Correct: ST = 5% of ₹450 = ₹22.50.',
        correction: 'Discount first to get SP. Then tax on SP.',
        how_to_spot_mid_problem: 'If a discount is given but tax used the marked price, order is wrong.',
      },
      {
        wrong_idea: 'The total and the SP are the same number.',
        why_students_fall_for_this: "Students read 'price ₹X' and treat it as what the buyer pays.",
        concrete_wrong_example: 'SP = ₹840, tax = 5% → total = ₹882, not ₹840.',
        correction: 'Total = SP + ST whenever tax rate > 0.',
        how_to_spot_mid_problem: "If 'total' and 'SP' are both stated, they must differ by the tax.",
      },
    ],
    shortcuts_and_tricks: [
      { shortcut: 'One-step total', rule: 'Total = SP × (1 + rate/100).', example: 'SP ₹840, 5% → 840 × 1.05 = ₹882.', when_to_use: 'Final bill only needed.' },
      { shortcut: 'Reverse one step', rule: 'SP = Total × 100/(100 + rate).', example: 'Total ₹882, 5% → 882 × 100/105 = ₹840.', when_to_use: 'Total given, need pre-tax price.' },
      { shortcut: 'Tax from total', rule: 'ST = Total × rate/(100 + rate).', example: 'Total ₹882, 5% → 882 × 5/105 = ₹42.', when_to_use: 'Only tax component needed from a total.' },
    ],
    when_to_use_this_method: {
      use_sales_tax_thinking_when: [
        'SP (or MP with discount) and a tax rate given — find tax and/or total.',
        'Total inclusive of tax given — find pre-tax price or tax amount.',
        'Discount and tax both appear — discount to SP first, then tax on SP.',
      ],
      use_other_methods_instead_when: [
        'The problem is about Value Added Tax across a trade chain — use VAT sub-topics (1.3, 1.4).',
        'No tax involved — use plain percentage or profit-and-loss methods.',
      ],
    },
    edge_cases: [
      {
        case: 'Two items at different tax rates on one bill',
        value: 'Compute tax on each item separately; total the taxes.',
        reasoning: 'Different goods attract different rates; averaging is incorrect.',
        where_it_appears: 'Bills mixing a food item (lower rate) with a non-food item (higher rate).',
      },
      {
        case: 'Tax quoted as already included in the marked price',
        value: 'SP = Marked Price × 100/(100 + rate).',
        reasoning: 'The marked price already contains the tax; this formula extracts the pre-tax component.',
        where_it_appears: "'The marked price includes 5% sales tax — find the original price' problems.",
      },
    ],
    key_takeaway: 'Sales Tax = rate% × SP. The buyer pays Total = SP × (1 + rate/100). Reverse: SP = Total × 100/(100+r). Always discount before tax.',
    video_script_hooks: {
      video_target_length_seconds: 180,
      opening_hook_5_sec: '₹882 on the bill. ₹840 was the price. Where did ₹42 go? That is sales tax.',
      narrative_arc: 'Hook → ST = rate% of SP → total = SP×(1+r/100) → reverse → discount first.',
      visual_moments: [
        { timestamp_seconds: 0,   what_happens_on_screen: 'Bill: ₹840 + ₹42 = ₹882.' },
        { timestamp_seconds: 40,  what_happens_on_screen: '5% of ₹840 = ₹42 arrow.' },
        { timestamp_seconds: 80,  what_happens_on_screen: 'SP × 1.05 formula animates.' },
        { timestamp_seconds: 130, what_happens_on_screen: '₹882 ÷ 1.05 = ₹840 reverse.' },
        { timestamp_seconds: 165, what_happens_on_screen: "Card: 'Discount first, then tax.'" },
      ],
      closing_takeaway_voiceover: 'Sales Tax: rate% of SP, added to the bill. To find price from total, divide by (1+rate/100). Discount before tax — always.',
    },
  },
};

// ── New sub-topic 1.2 — Sales Tax: Word Problems ──────────────────────────────
const newVatComputation = {
  topicId: 'icse_math10_ch1_vat_computation',
  subject: 'Mathematics',
  chapterNumber: 1,
  name: 'Sales Tax — Discount, Profit and Multi-step Problems',

  prerequisite_knowledge: [
    'Sales tax concept — ST = rate% × SP; Total = SP × (1 + rate/100) (sub-topic 1.1).',
    'Discount on marked price — SP = MP × (1 − discount%/100).',
    'Profit and loss — SP = CP × (1 + profit%/100).',
    'Finding SP from total when tax is included — SP = Total × 100/(100 + rate).',
    'Setting up arithmetic from word problem conditions to find unknown prices.',
  ],

  key_formulas: [
    {
      formula: 'Step order: MP −(discount%)→ SP →(+sales tax%)→ Total',
      explanation: 'Apply discount first to find the actual selling price, then compute sales tax on that selling price.',
    },
    {
      formula: 'SP = MP × (1 − discount/100);  ST = rate% × SP;  Total = SP × (1 + rate/100).',
      explanation: 'Three-step chain for any problem with a marked price, a discount, and sales tax.',
    },
    {
      formula: 'Profit problem: SP = CP × (1 + profit/100),  then  Total = SP × (1 + tax/100).',
      explanation: 'Find SP from profit percentage first, then apply tax on top.',
    },
    {
      formula: 'Chain multiplier: Total = MP × (1 − d/100) × (1 + t/100).',
      explanation: 'When both discount and tax are present, combine into one multiplication.',
    },
  ],

  teaching_content: {
    intuition: {
      elevator_pitch: 'Sales tax word problems are multi-step: first settle the selling price (discount or profit%), then add tax. The sequence is fixed — discount and profit come before tax.',
      hook: '₹2,000 marked, 10% off, 5% tax — three numbers, one bill. MP → discount → SP → tax → total. Reverse the order and every number after is wrong.',
      real_world_anchors: [
        "Sale tag: 'Marked ₹1,500 | 15% off | + 6% tax'.",
        'Shopkeeper bought mixer for ₹800, 25% profit, 5% tax.',
        'Paid ₹1,323 inclusive of tax — what was the pre-tax price?',
        'Two items with different tax rates on one bill.',
      ],
      the_pivot_idea: 'Discount reduces MP to SP. Tax adds to SP. Different bases. Tax on MP (before discount) is the most common Ch1 error.',
      wrong_intuitions_to_replace: [
        "'Tax on MP, then discount.' — Wrong. Discount to SP first, then tax on SP.",
        "'Equal discount and tax percentages cancel each other.' — Wrong. 0.9 × 1.1 = 0.99 ≠ 1.",
        "'Tax and discount can be applied in any order.' — Wrong. Discount before tax, always.",
      ],
    },
    derivation: {
      starting_question: 'Given MP, discount%, and tax rate, find what the buyer pays.',
      part_1_from_marked_to_sp: {
        claim: 'Subtract discount from MP to get SP.',
        reasoning: 'SP = MP × (1 − d/100). For MP ₹2,000 and 10% off: SP = ₹1,800. Tax on ₹1,800, not ₹2,000.',
      },
      part_2_from_sp_to_total: {
        claim: 'Apply sales tax to SP to get total.',
        reasoning: 'ST = 5% of 1,800 = ₹90. Total = ₹1,890. Or: 1,800 × 1.05 = ₹1,890.',
      },
      part_3_reverse: {
        claim: 'When the total is given, work backwards through the same chain.',
        reasoning: 'Total ÷ (1 + t/100) = SP. SP ÷ (1 − d/100) = MP.',
        named_concept: 'Forward: MP → SP → Total. Reverse: Total → SP → MP.',
      },
    },
    worked_example: [
      {
        problem: 'MP of an article is ₹2,000. Discount 10%, then 5% sales tax. Find SP, ST, and total.',
        thought_process_before_starting: 'Discount first on MP to get SP. Then tax on SP.',
        steps: [
          { step_number: 1, action: 'SP after discount.', computation: 'SP = 2,000 − 200 = ₹1,800.', reasoning: 'Discount reduces MP.' },
          { step_number: 2, action: 'Sales tax on SP.', computation: 'ST = 5% of 1,800 = ₹90.', reasoning: 'Tax on SP, not MP.' },
          { step_number: 3, action: 'Total.', computation: 'Total = 1,800 + 90 = ₹1,890.', reasoning: 'SP + tax.' },
        ],
        answer: 'SP ₹1,800; ST ₹90; Total ₹1,890.',
      },
      {
        problem: 'Shopkeeper buys radio for ₹1,200, sells at 20% profit, charges 8% tax. Find total.',
        thought_process_before_starting: 'SP from profit first, then tax on SP.',
        steps: [
          { step_number: 1, action: 'SP from profit.', computation: 'SP = 1,200 × 1.20 = ₹1,440.', reasoning: '20% profit on CP.' },
          { step_number: 2, action: 'Tax on SP.', computation: 'ST = 8% of 1,440 = ₹115.20.', reasoning: 'Tax on selling price.' },
          { step_number: 3, action: 'Total.', computation: 'Total = 1,440 + 115.20 = ₹1,555.20.', reasoning: 'SP + tax.' },
        ],
        answer: 'Total = ₹1,555.20.',
      },
    ],
    visual_description: 'Pipeline: MP → (−discount%) → SP → (+tax%) → Total. Warning: Discount on MP. Tax on SP.',
    svg_diagrams: [
      {
        id: 'st_word_problem_pipeline',
        title: 'Sales Tax Word Problem Pipeline',
        svg: "<svg viewBox='0 0 760 260' xmlns='http://www.w3.org/2000/svg'><rect width='760' height='260' fill='#FFFFFF'/><text x='380' y='30' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='13' font-weight='600' fill='#86868B' letter-spacing='2'>SALES TAX — WORD PROBLEM PIPELINE</text><rect x='30' y='80' width='150' height='60' rx='9' fill='#F5F5F7' stroke='#86868B' stroke-width='2'/><text x='105' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#86868B'>Marked Price</text><text x='105' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(or CP + profit)</text><rect x='305' y='80' width='150' height='60' rx='9' fill='#CCE5FF' stroke='#1D1D1F' stroke-width='2'/><text x='380' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Selling Price</text><text x='380' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(after discount)</text><rect x='580' y='80' width='150' height='60' rx='9' fill='#E8F8EE' stroke='#34C759' stroke-width='2'/><text x='655' y='107' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#1D1D1F'>Total</text><text x='655' y='127' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' fill='#86868B'>(SP + Sales Tax)</text><line x1='180' y1='110' x2='303' y2='110' stroke='#1D1D1F' stroke-width='2' marker-end='url(#sp2)'/><line x1='455' y1='110' x2='578' y2='110' stroke='#1D1D1F' stroke-width='2' marker-end='url(#sp2)'/><defs><marker id='sp2' markerWidth='9' markerHeight='9' refX='7' refY='3' orient='auto'><path d='M0,0 L7,3 L0,6 Z' fill='#1D1D1F'/></marker></defs><text x='240' y='100' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#FF9500'>− discount%</text><text x='516' y='100' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='11' font-weight='700' fill='#34C759'>+ tax% of SP</text><rect x='200' y='180' width='360' height='50' rx='8' fill='#FFE6B3' stroke='#FF9500' stroke-width='2'/><text x='380' y='200' text-anchor='middle' font-family='-apple-system, sans-serif' font-size='12' font-weight='700' fill='#FF2D55'>Discount on MP. Tax on SP. Never swap.</text></svg>",
      },
    ],
    common_misconceptions: [
      {
        wrong_idea: 'Apply tax to the marked price before the discount.',
        why_students_fall_for_this: 'MP is the first number; students rush to use it.',
        concrete_wrong_example: 'MP ₹2,000, 10% off, 5% tax → wrong ST = ₹100. Correct: ST = 5% of ₹1,800 = ₹90.',
        correction: 'Discount first: SP = ₹1,800. Then ST = 5% of ₹1,800.',
        how_to_spot_mid_problem: 'Tax base must be smaller than MP (discount already applied).',
      },
      {
        wrong_idea: 'Equal discount and tax cancel out.',
        why_students_fall_for_this: 'Same percentage → students assume offset.',
        concrete_wrong_example: '10% off then 10% tax: 0.9 × 1.1 = 0.99 — 1% net cost remains.',
        correction: 'They apply to different bases; 0.9 × 1.1 = 0.99 ≠ 1.',
        how_to_spot_mid_problem: 'Always compute: (1−d/100) × (1+t/100) explicitly.',
      },
      {
        wrong_idea: 'Total = MP + tax on MP, ignoring discount.',
        why_students_fall_for_this: 'Forgot to apply discount before tax.',
        concrete_wrong_example: 'MP 2,000, 10% off, 5% tax → wrong ₹2,100. Correct ₹1,890.',
        correction: 'Subtract discount first, then add tax on reduced SP.',
        how_to_spot_mid_problem: 'Final total with discount should be less than MP + tax on MP.',
      },
    ],
    shortcuts_and_tricks: [
      { shortcut: 'Chain multiplier', rule: 'Total = MP × (1−d/100) × (1+t/100).', example: '2,000 × 0.90 × 1.05 = ₹1,890.', when_to_use: 'Discount + tax in one step.' },
      { shortcut: 'Reverse from total', rule: 'SP = Total ÷ (1+t/100); MP = SP ÷ (1−d/100).', example: '₹1,890 → SP=1,800 → MP=₹2,000.', when_to_use: 'Total given, find MP or SP.' },
    ],
    when_to_use_this_method: {
      use_sales_tax_word_problems_when: [
        'MP with discount AND tax rate — find total.',
        'CP with profit% and tax rate — find total.',
        'Total inclusive of tax given — find SP, MP, or tax.',
        'Two items with different rates on one bill.',
      ],
      use_other_methods_instead_when: [
        'The problem is about VAT in a trade chain — use VAT sub-topics (1.3, 1.4).',
        'No tax involved — use plain profit, loss and discount methods.',
      ],
    },
    edge_cases: [
      {
        case: 'Two items with different tax rates on one bill',
        value: 'Compute tax on each item separately; total the taxes.',
        reasoning: 'Averaging rates over the combined price is incorrect.',
        where_it_appears: 'Mixed bills with food (lower rate) and non-food (higher rate).',
      },
      {
        case: "Does sales tax affect the shopkeeper's profit?",
        value: 'No. Profit = SP − CP, independent of tax charged to the customer.',
        reasoning: 'Tax is a pass-through — collected from buyer, forwarded to government.',
        where_it_appears: "Problems asking 'profit' when a tax rate is also given.",
      },
    ],
    key_takeaway: 'Fixed pipeline: Discount on MP → SP → Sales Tax on SP → Total. Profit sets SP first (SP = CP × (1+p/100)), then tax. Chain multiplier: Total = MP × (1−d/100) × (1+t/100).',
    video_script_hooks: {
      video_target_length_seconds: 195,
      opening_hook_5_sec: 'Marked ₹2,000. 10% off. 5% tax. What does the customer pay?',
      narrative_arc: 'Discount → SP → tax → total → chain multiplier → profit problems → reverse.',
      visual_moments: [
        { timestamp_seconds: 0,   what_happens_on_screen: 'Sale tag: MP, discount, tax — total unknown.' },
        { timestamp_seconds: 40,  what_happens_on_screen: 'Discount drops ₹2,000 to ₹1,800.' },
        { timestamp_seconds: 80,  what_happens_on_screen: '+5% tax adds ₹90; total ₹1,890.' },
        { timestamp_seconds: 130, what_happens_on_screen: 'Chain: 2,000 × 0.90 × 1.05 = 1,890.' },
        { timestamp_seconds: 170, what_happens_on_screen: "Card: 'Discount → SP → Tax → Total.'" },
      ],
      closing_takeaway_voiceover: 'Discount first to find SP, then tax on SP. That order is fixed.',
    },
  },
};

// ── Update all 4 in MongoDB ───────────────────────────────────────────────────
await col.replaceOne({ topicId: 'icse_math10_ch1_vat_concepts'    }, newVatConcepts,    { upsert: true });
await col.replaceOne({ topicId: 'icse_math10_ch1_vat_computation' }, newVatComputation, { upsert: true });
await col.replaceOne({ topicId: 'icse_math10_ch1_gst_concepts'    }, newGstConcepts,    { upsert: true });
await col.replaceOne({ topicId: 'icse_math10_ch1_gst_computation' }, newGstComputation, { upsert: true });

console.log('DB updated: all 4 Ch1 sub-topics patched.');

// ── Re-export seed file from DB ───────────────────────────────────────────────
const allDocs = await col
  .find({ topicId: /^icse_math10_/ })
  .sort({ chapterNumber: 1, topicId: 1 })
  .project({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
  .toArray();

const filePath = path.join(__dirname, 'seedIcseMath10Content.js');
const header = `/**
 * ICSE Class 10 Mathematics — Sub-topic Content Seed
 * 25 chapters × 4 sub-topics = 100 sub-topics
 * Run: node config/seedIcseMath10Content.js
 * (Auto-generated from DB; run fix-ch1-db.mjs to regenerate)
 */
"use strict";
const mongoose = require("mongoose");
const NcertTopicContent = require("../models/ncertTopicContentModel");
require("dotenv").config();

const data = `;

const footer = `;

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const doc of data) {
    await NcertTopicContent.findOneAndUpdate(
      { topicId: doc.topicId },
      { $set: doc },
      { upsert: true, new: true }
    );
  }
  console.log("Seeded", data.length, "ICSE Math10 topic content docs.");
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
`;

writeFileSync(filePath, header + JSON.stringify(allDocs, null, 2) + footer);
console.log('Seed file re-exported:', filePath, '(' + allDocs.length + ' docs)');

// ── Verify ────────────────────────────────────────────────────────────────────
const verify = await col.find(
  { topicId: /^icse_math10_ch1_/ },
  { projection: { topicId: 1, name: 1 } }
).toArray();
console.log('\nCh1 sub-topics now:');
verify.forEach(d => console.log(' ', d.topicId, '->', d.name));

await mongoose.disconnect();
