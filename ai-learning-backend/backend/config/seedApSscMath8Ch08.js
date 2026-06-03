/**
 * AP SSC Class 8 Mathematics — Chapter 8: Comparing Quantities
 * 4 topics. topicId: ap_ssc_math8_ch8_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch08.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch8_ratios_percentages",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Ratios, Percentages and Percentage Change",
    prerequisite_knowledge: [
      "Fractions and equivalent fractions",
      "Converting between fractions, decimals and percentages",
      "Unitary method (value of one, then many)",
      "Ratio as a comparison a:b",
    ],
    key_formulas: [
      "x% = x/100;  to find x% of N → (x/100) × N",
      "Percentage = (part / whole) × 100",
      "Percentage increase = (increase / original) × 100",
      "Percentage decrease = (decrease / original) × 100",
    ],
    teaching_content: {
      intuition: "Percentages are just fractions with a fixed denominator of 100 — a common language for comparing things of different sizes. Scoring 45/60 and 70/100 is hard to compare directly, but 75% vs 70% is instant. 'Per cent' literally means 'per hundred'. Ratios compare quantities; percentages express one quantity as a part of a hundred.",
      derivation: "To express a part of a whole as a percentage, scale the fraction to denominator 100: percentage = (part/whole) × 100. \nFor a CHANGE, always compare the change to the ORIGINAL amount (not the new amount): % change = (new − old)/old × 100. A rise gives a positive value (increase), a fall a negative one (decrease). This 'compare to the original' rule is the single most common source of errors if ignored.",
      worked_example: "A shirt's price rises from ₹400 to ₹500. Find the percentage increase. Also find 15% of ₹600.\n\nIncrease = 500 − 400 = 100. % increase = (100/400)×100 = 25%.\n(Note: comparing to the ORIGINAL ₹400, not ₹500.)\n15% of 600 = (15/100)×600 = 90.",
      visual_description: "A bar showing original price ₹400 and a longer bar ₹500; the extra ₹100 segment is highlighted and labelled '25% of the ORIGINAL 400', stressing the base of comparison.",
      svg_diagrams: [
        { title: "Percentage increase compares to the original",
          svg_code: "<svg viewBox='0 0 260 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><rect x='10' y='15' width='160' height='18' fill='#bfdbfe' stroke='#2563eb'/><text x='60' y='28'>₹400 (original)</text><rect x='10' y='45' width='200' height='18' fill='#bbf7d0' stroke='#16a34a'/><rect x='170' y='45' width='40' height='18' fill='#fde68a' stroke='#d97706'/><text x='150' y='75' font-size='9'>+₹100 = 25% of 400</text></svg>" }
      ],
      common_misconceptions: [
        "Computing % change against the NEW value instead of the original.",
        "Adding/subtracting percentages of different bases as if they share a base.",
        "A 20% increase then 20% decrease does NOT return to the start (1.2 × 0.8 = 0.96).",
        "Confusing 'percentage of' (multiply) with 'percentage change' (compare difference to original).",
      ],
      shortcuts_and_tricks: [
        "x% of N = N% of x (e.g. 8% of 50 = 50% of 8 = 4).",
        "To increase by x%: multiply by (1 + x/100); to decrease: multiply by (1 − x/100).",
        "Convert percentage to fraction for clean numbers: 25% = 1/4, 12.5% = 1/8, 33⅓% = 1/3.",
      ],
      when_to_use_this_method: "Use percentages to compare quantities on a common scale, and the %-change formula for increases/decreases (prices, populations, marks). Always identify the BASE (original) before computing a change.",
      edge_cases: [
        "Percentages can exceed 100% (e.g. a price that triples is a 200% increase).",
        "Successive percentage changes multiply factors; they don't simply add.",
        "A change measured on a different base gives a different percentage — state the base.",
      ],
      key_takeaway: "Percentage = (part/whole) × 100; 'per cent' means 'per hundred'. For a change, compare the difference to the ORIGINAL: % change = (new − old)/old × 100. Increase by multiplying by (1 ± x/100). Successive changes multiply, not add.",
      video_script_hooks: [
        "Opening: 'Which is better, 45 out of 60 or 70 out of 100? Percentages turn both into the same language and answer instantly.'",
        "Mid: 'The classic trap: a 20% rise then a 20% fall does NOT bring you home. You end at 96%.'",
        "Closing: 'Always ask: percentage OF what? The base of comparison changes everything.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch8_profit_loss_discount",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Profit, Loss and Discount",
    prerequisite_knowledge: [
      "Percentages and percentage of a quantity",
      "Cost price (CP), selling price (SP), marked price (MP)",
      "Percentage change formula",
      "Basic money arithmetic",
    ],
    key_formulas: [
      "Profit = SP − CP (if SP > CP); Loss = CP − SP (if CP > SP)",
      "Profit% = (Profit/CP) × 100; Loss% = (Loss/CP) × 100  (always on CP)",
      "SP = CP × (1 + Profit%/100)  or  CP × (1 − Loss%/100)",
      "Discount = MP − SP; Discount% = (Discount/MP) × 100  (on MP)",
    ],
    teaching_content: {
      intuition: "Buying and selling has three prices: what the shop PAID (cost price), what the tag SAYS (marked price), and what you actually PAY (selling price). Profit and loss are always measured against the COST price; discount is always measured against the MARKED price. Getting the base right (CP for profit/loss, MP for discount) is the whole game.",
      derivation: "Profit% is the profit expressed as a percentage of what it cost the seller: Profit% = (SP − CP)/CP × 100. Rearranging gives SP = CP(1 + Profit%/100); a loss uses (1 − Loss%/100). \nDiscount is a reduction off the marked (list) price: SP = MP − Discount, and Discount% = Discount/MP × 100. A shop can mark up high, give a discount, and STILL make a profit — because discount is on MP while profit is on CP.",
      worked_example: "A shopkeeper buys a fan for ₹1200 (CP), marks it ₹1600 (MP), and gives a 10% discount. Find the SP and the profit%.\n\nDiscount = 10% of 1600 = ₹160. SP = 1600 − 160 = ₹1440.\nProfit = SP − CP = 1440 − 1200 = ₹240.\nProfit% = (240/1200) × 100 = 20%.\n(Notice: discount is on MP ₹1600; profit% is on CP ₹1200.)",
      visual_description: "Three stacked bars: CP ₹1200, MP ₹1600 (longest), SP ₹1440. Arrows show 'discount' as MP→SP (on MP) and 'profit' as CP→SP (on CP), highlighting the two different bases.",
      svg_diagrams: [
        { title: "CP, MP, SP — profit on CP, discount on MP",
          svg_code: "<svg viewBox='0 0 260 90' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><rect x='10' y='12' width='150' height='16' fill='#bfdbfe' stroke='#2563eb'/><text x='165' y='24'>CP 1200</text><rect x='10' y='34' width='200' height='16' fill='#fecaca' stroke='#dc2626'/><text x='215' y='46'>MP 1600</text><rect x='10' y='56' width='180' height='16' fill='#bbf7d0' stroke='#16a34a'/><text x='195' y='68'>SP 1440</text></svg>" }
      ],
      common_misconceptions: [
        "Computing profit% on the SELLING price instead of the COST price.",
        "Computing discount% on CP instead of MP.",
        "Thinking a discount always means a loss — a high markup can still leave a profit after discount.",
        "Mixing up MP and SP — MP is the tag; SP is what's actually paid after discount.",
      ],
      shortcuts_and_tricks: [
        "Profit/Loss% is ALWAYS on CP; Discount% is ALWAYS on MP. Anchor the base first.",
        "SP = CP(1 + p/100) for profit; SP = CP(1 − l/100) for loss — find SP in one step.",
        "To find CP from SP and profit%: CP = SP / (1 + profit%/100).",
      ],
      when_to_use_this_method: "Use for any shopkeeping problem: finding SP/CP/MP, profit or loss percentage, and discounts. First label which price is which, then pick the correct base.",
      edge_cases: [
        "If SP = CP, there is neither profit nor loss (break-even).",
        "Two successive discounts multiply: 10% then 20% off ≠ 30% off (it's 0.9×0.8 = 0.72, i.e. 28% off).",
        "Overheads/transport added to CP increase the effective cost price.",
      ],
      key_takeaway: "Profit/Loss is measured on the COST price; Discount is measured on the MARKED price. SP = CP(1 ± rate/100); SP = MP − discount. A markup followed by a discount can still yield a profit — always anchor each percentage to its correct base.",
      video_script_hooks: [
        "Opening: 'A shop offers 10% off and STILL makes 20% profit. Scam? No — just two different bases.'",
        "Mid: 'Profit lives on the cost price; discount lives on the marked price. Mix them up and every answer is wrong.'",
        "Closing: 'Two discounts of 10% and 20% are NOT 30% off. Multiply the factors: you save 28%.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch8_sales_tax_gst",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Sales Tax, VAT and GST",
    prerequisite_knowledge: [
      "Percentages of a quantity",
      "Selling price and marked price",
      "Percentage increase",
      "Money calculations",
    ],
    key_formulas: [
      "Tax amount = (tax% / 100) × (price before tax)",
      "Bill amount = price before tax + tax = price × (1 + tax%/100)",
      "GST is added ON TOP of the selling price",
      "Price before tax = bill amount / (1 + tax%/100)",
    ],
    teaching_content: {
      intuition: "Tax (sales tax / VAT / GST) is an extra percentage the government adds on top of what you'd otherwise pay. If a ₹1000 item has 18% GST, you actually pay ₹1180. It's just a percentage increase applied to the selling price — the maths is the same percentage machinery, with the price as the base.",
      derivation: "Let the price before tax be P and the tax rate be t%. Tax = (t/100)P, and the final bill = P + (t/100)P = P(1 + t/100). \nTo go BACKWARDS — given the bill including tax, recover the pre-tax price: P = bill / (1 + t/100). GST (Goods and Services Tax) replaced the older VAT/sales tax in India but is computed identically: a percentage added to the price.",
      worked_example: "A laptop's price before tax is ₹40000 with 18% GST. Find the amount paid. If a bill including 5% GST is ₹2100, find the price before tax.\n\nBill = 40000 × (1 + 18/100) = 40000 × 1.18 = ₹47200.\nReverse: P = 2100 / 1.05 = ₹2000 (so GST was ₹100).",
      visual_description: "A receipt graphic: 'Price ₹40000' then a '+18% GST = ₹7200' line, then 'Total ₹47200', visually stacking the tax on top of the base price.",
      svg_diagrams: [
        { title: "GST added on top of the price",
          svg_code: "<svg viewBox='0 0 230 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='10'><rect x='10' y='20' width='150' height='18' fill='#bfdbfe' stroke='#2563eb'/><text x='40' y='33'>Price 40000</text><rect x='160' y='20' width='50' height='18' fill='#fde68a' stroke='#d97706'/><text x='162' y='33' font-size='8'>+GST 7200</text><text x='10' y='62' fill='#16a34a'>Total = 47200</text></svg>" }
      ],
      common_misconceptions: [
        "Subtracting tax when you should ADD it (tax increases the bill).",
        "Finding the pre-tax price by taking t% off the bill instead of dividing by (1 + t/100).",
        "Applying tax to the cost price instead of the selling/marked price.",
        "Forgetting that discount is applied BEFORE tax in combined problems.",
      ],
      shortcuts_and_tricks: [
        "Add tax in one step: multiply by (1 + t/100). 18% GST → ×1.18.",
        "Remove tax: divide the bill by (1 + t/100), don't subtract t%.",
        "Combined discount + tax: SP after discount, THEN add GST on that SP.",
      ],
      when_to_use_this_method: "Use for bill/total problems with sales tax, VAT or GST — adding tax to a price, or working backwards from a tax-inclusive bill to the base price.",
      edge_cases: [
        "If both discount and tax appear: apply the discount first (on MP), then GST on the discounted price.",
        "Different goods may have different GST slabs — apply each rate to its own item.",
        "Reverse-tax (price before tax) needs division, a common exam twist.",
      ],
      key_takeaway: "Tax/GST is a percentage ADDED to the price: bill = price × (1 + tax%/100). To recover the pre-tax price from a tax-inclusive bill, DIVIDE by (1 + tax%/100). In combined problems, discount first (on MP), then GST on the result.",
      video_script_hooks: [
        "Opening: 'The tag says ₹1000 but you pay ₹1180. Where did the extra ₹180 come from? GST — added on top.'",
        "Mid: 'To strip tax back out, you divide by 1.18 — NOT subtract 18%. Those give different answers.'",
        "Closing: 'Discount first, tax second. The order matters when both are in play.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch8_compound_interest",
    subject: "Mathematics",
    chapterNumber: 8,
    name: "Compound Interest",
    prerequisite_knowledge: [
      "Simple interest = PRT/100",
      "Percentage increase and the factor (1 + r/100)",
      "Powers (exponents) of a number",
      "Principal, rate and time",
    ],
    key_formulas: [
      "Simple Interest: SI = PRT/100",
      "Amount (compounded annually): A = P(1 + R/100)^n",
      "Compound Interest: CI = A − P",
      "Compounded k times a year: A = P(1 + R/(100k))^(kn)",
    ],
    teaching_content: {
      intuition: "Simple interest is paid only on the original money. Compound interest is 'interest on interest' — each year's interest is added to the principal so next year you earn interest on a bigger amount. That's why savings (and debts) snowball: the growth multiplies, not just adds. Compounding is repeated percentage increase.",
      derivation: "Each year the money is multiplied by the growth factor (1 + R/100). After year 1: P(1 + R/100). After year 2 the interest is on the NEW amount: P(1 + R/100)². After n years: A = P(1 + R/100)^n. \nThis is exactly applying a percentage increase n times in a row — which multiplies the factors, giving a power. CI = A − P. Compare with simple interest PRT/100, which adds the same amount each year (no power, no snowball).",
      worked_example: "Find the compound interest on ₹10000 at 10% per annum for 2 years (compounded annually). Compare with simple interest.\n\nA = 10000 × (1 + 10/100)² = 10000 × 1.1² = 10000 × 1.21 = ₹12100.\nCI = 12100 − 10000 = ₹2100.\nSI = PRT/100 = 10000×10×2/100 = ₹2000.\nCI exceeds SI by ₹100 — that's the interest earned on year-1's interest.",
      visual_description: "Two growing bars over 2 years: simple interest adds equal ₹1000 blocks each year (2000 total); compound interest adds ₹1000 in year 1 then ₹1100 in year 2 (2100 total), the extra ₹100 highlighted as 'interest on interest'.",
      svg_diagrams: [
        { title: "Compound vs simple interest over 2 years",
          svg_code: "<svg viewBox='0 0 230 90' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='9'><text x='10' y='12'>SI: +1000, +1000 = 2000</text><rect x='10' y='18' width='60' height='14' fill='#bfdbfe'/><rect x='70' y='18' width='60' height='14' fill='#bfdbfe'/><text x='10' y='52'>CI: +1000, +1100 = 2100</text><rect x='10' y='58' width='60' height='14' fill='#bbf7d0'/><rect x='70' y='58' width='66' height='14' fill='#bbf7d0'/><rect x='130' y='58' width='6' height='14' fill='#fde68a'/><text x='140' y='69' font-size='8'>+100</text></svg>" }
      ],
      common_misconceptions: [
        "Using simple-interest thinking (adding the same interest each year) for compound interest.",
        "Forgetting the EXPONENT n in (1 + R/100)^n — it's a power, not a product with n.",
        "For half-yearly compounding, not halving the rate AND doubling the periods.",
        "Computing CI as P×R×T/100 (that's simple interest).",
      ],
      shortcuts_and_tricks: [
        "Amount factor each period = (1 + R/100); raise to the number of periods.",
        "Half-yearly: rate → R/2, time → 2n periods. Quarterly: R/4, 4n periods.",
        "For 2 years, CI = SI + (interest on first year's interest) — a quick cross-check.",
      ],
      when_to_use_this_method: "Use compound interest for savings/loans where interest is added periodically (annually, half-yearly), and the A = P(1+R/100)^n formula for growth/depreciation problems. Use simple interest only when stated.",
      edge_cases: [
        "Depreciation uses the SAME formula with a MINUS: A = P(1 − R/100)^n.",
        "Population growth and bacteria growth are compound-interest problems in disguise.",
        "Half-yearly/quarterly compounding gives a slightly larger amount than annual for the same nominal rate.",
      ],
      key_takeaway: "Compound interest is interest on interest: A = P(1 + R/100)^n, CI = A − P. Each period multiplies by the factor (1 + R/100), so growth snowballs (a power), unlike simple interest which adds equal amounts. Adjust rate and periods for half-yearly/quarterly compounding.",
      video_script_hooks: [
        "Opening: 'Why does ₹10000 grow faster the longer it sits? Because interest starts earning its own interest. That's compounding.'",
        "Mid: 'The exponent is everything: (1 + R/100) to the power n. Forget the power and you've computed simple interest.'",
        "Closing: 'The same formula, with a minus, predicts how a car loses value. Growth and decay are two sides of one coin.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch8 (Comparing Quantities): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
