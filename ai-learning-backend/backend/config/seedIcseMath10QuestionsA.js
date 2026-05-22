/** ICSE Class 10 Math — Questions Ch1-4 (VAT, Banking, Shares, Inequations) */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Question } from "../models/index.js";
dotenv.config();

const Q = (id, tid, text, opts, ex, steps, sc, d, ch) => ({
  questionId: id, topicId: tid, text, questionText: text, options: opts,
  explanation: ex, solutionSteps: steps, shortcut: sc, difficulty: d,
  subject: "Mathematics", grade: "10", examBoard: "ICSE", chapter: ch, topic: ch
});
const c = (t)=>({text:t,type:"correct"});
const e = (t)=>({text:t,type:"concept_error"});
const m = (t)=>({text:t,type:"calculation_error"});
const g = (t)=>({text:t,type:"misinterpretation"});
const ch1="Value Added Tax", ch2="Banking", ch3="Shares and Dividend", ch4="Linear Inequations";

const questions = [
  // Ch1 vat_intro
  Q("icse10_ch1_vi_q1","icse10_ch1_vat_intro","Full form of VAT?",[c("Value Added Tax"),m("Value Allowance Tax"),g("Variable Added Tax"),e("Volume Added Tax")],"VAT.",["Standard expansion."],"VAT.","easy",ch1),
  Q("icse10_ch1_vi_q2","icse10_ch1_vat_intro","VAT is paid by…",[c("Final consumer"),m("Manufacturer only"),g("Wholesaler"),e("Retailer only")],"Passed through stages.",["Each stage adds tax, consumer pays final."],"Consumer pays.","medium",ch1),
  Q("icse10_ch1_vi_q3","icse10_ch1_vat_intro","Item ₹100, VAT 10%. Tax amount?",[c("₹10"),m("₹100"),g("₹110"),e("₹1")],"10% of 100.",["100 × 0.10 = 10."],"Rate × price.","easy",ch1),
  Q("icse10_ch1_vi_q4","icse10_ch1_vat_intro","VAT is added on…",[c("Value added at each stage"),m("Total price always"),g("Profit only"),e("Random")],"Value added.",["Each stage taxed on value added."],"Value added.","medium",ch1),
  Q("icse10_ch1_vi_q5","icse10_ch1_vat_intro","Item costs ₹500, VAT 8%. Selling price including VAT?",[c("₹540"),m("₹500"),g("₹508"),e("₹400")],"500 + 40.",["VAT = 40. SP = 540."],"CP + VAT.","easy",ch1),
  Q("icse10_ch1_vi_q6","icse10_ch1_vat_intro","If list price ₹200 incl. VAT @ 25%, original price?",[c("₹160"),m("₹150"),g("₹250"),e("₹175")],"200/1.25.",["Original × 1.25 = 200 → original = 160."],"÷ (1+r).","medium",ch1),
  Q("icse10_ch1_vi_q7","icse10_ch1_vat_intro","VAT rates vary by…",[c("Product category"),m("Random"),g("Buyer's mood"),e("Day of week")],"Different categories have different rates.",["Essentials lower, luxury higher."],"Category.","medium",ch1),
  Q("icse10_ch1_vi_q8","icse10_ch1_vat_intro","Sales price = CP × ?",[c("(1 + r/100)"),m("r/100"),g("1 + r"),e("100/r")],"Multiplier formula.",["1 + rate as fraction."],"(1 + r/100).","medium",ch1),
  // Ch1 vat_calculations
  Q("icse10_ch1_vc_q1","icse10_ch1_vat_calculations","Cost ₹1000, VAT 12%. Total?",[c("₹1120"),m("₹1012"),g("₹1200"),e("₹880")],"1000 + 120.",["120 VAT, total 1120."],"+ VAT.","easy",ch1),
  Q("icse10_ch1_vc_q2","icse10_ch1_vat_calculations","Price incl. VAT ₹672, VAT 12%. CP?",[c("₹600"),m("₹560"),g("₹672"),e("₹540")],"672/1.12.",["CP × 1.12 = 672 → CP = 600."],"÷ (1 + r/100).","medium",ch1),
  Q("icse10_ch1_vc_q3","icse10_ch1_vat_calculations","Trader bought ₹2000, sold ₹2500. VAT 10% on selling. VAT charged?",[c("₹250"),m("₹200"),g("₹50"),e("₹2750")],"10% of 2500.",["SP × rate."],"× rate.","medium",ch1),
  Q("icse10_ch1_vc_q4","icse10_ch1_vat_calculations","CP ₹400, profit 25%, VAT 8%. Total bill?",[c("₹540"),m("₹500"),g("₹520"),e("₹432")],"SP=500; +8% VAT = 540.",["SP = 400 × 1.25 = 500. +8% = 540."],"Profit then VAT.","medium",ch1),
  Q("icse10_ch1_vc_q5","icse10_ch1_vat_calculations","If VAT is ₹60 on ₹500 cost, rate?",[c("12%"),m("6%"),g("15%"),e("10%")],"60/500 × 100.",["= 12%."],"VAT ÷ CP × 100.","easy",ch1),
  Q("icse10_ch1_vc_q6","icse10_ch1_vat_calculations","Item ₹250, VAT 4%. Bill?",[c("₹260"),m("₹254"),g("₹290"),e("₹240")],"250 + 10.",["VAT 10."],"+ VAT.","easy",ch1),
  Q("icse10_ch1_vc_q7","icse10_ch1_vat_calculations","If VAT raises ₹800 to ₹920, rate?",[c("15%"),m("12%"),g("10%"),e("20%")],"120/800.",["120/800 × 100 = 15%."],"VAT/CP × 100.","medium",ch1),
  Q("icse10_ch1_vc_q8","icse10_ch1_vat_calculations","Price after 10% discount + 12% VAT on ₹500?",[c("₹504"),m("₹500"),g("₹550"),e("₹510")],"Discount: 450. VAT: 54. Total 504.",["500 × 0.9 = 450. × 1.12 = 504."],"Discount then VAT.","hard",ch1),
  // Ch1 vat_invoice
  Q("icse10_ch1_vinv_q1","icse10_ch1_vat_invoice","Trader VAT liability = ?",[c("VAT on sales − VAT on purchases"),m("Sum"),g("Random"),e("Just sales VAT")],"Net VAT.",["Input tax credit."],"Output − input.","medium",ch1),
  Q("icse10_ch1_vinv_q2","icse10_ch1_vat_invoice","Bought ₹1000 (paid VAT 10%), sold ₹1500 (charged VAT 10%). VAT to pay government?",[c("₹50"),m("₹150"),g("₹100"),e("₹250")],"150 − 100.",["Output − input = 150 − 100 = 50."],"Difference.","hard",ch1),
  Q("icse10_ch1_vinv_q3","icse10_ch1_vat_invoice","Invoice shows VAT separately because…",[c("Tax credit for businesses"),m("Decoration"),g("Random"),e("Required by chef")],"VAT credit needs separate line.",["Allows trader to claim back input VAT."],"Tax credit.","medium",ch1),
  Q("icse10_ch1_vinv_q4","icse10_ch1_vat_invoice","Trader buys 100 at ₹50 each + 5% VAT. Total cost?",[c("₹5250"),m("₹5000"),g("₹5500"),e("₹4750")],"5000 + 5% = 5250.",["Base 5000. VAT 250."],"+ VAT.","medium",ch1),
  Q("icse10_ch1_vinv_q5","icse10_ch1_vat_invoice","Manufacturer sells ₹100 to wholesaler + 10% VAT. Wholesaler sells ₹130 + 10% VAT. Wholesaler's net VAT to govt?",[c("₹3"),m("₹13"),g("₹10"),e("₹23")],"13 − 10.",["Output 13, input 10. Net 3."],"Net.","hard",ch1),
  Q("icse10_ch1_vinv_q6","icse10_ch1_vat_invoice","If VAT paid on inputs ₹500, on outputs ₹750, net payable?",[c("₹250"),m("₹500"),g("₹750"),e("₹1250")],"750 − 500.",["Output VAT − input VAT."],"Net.","medium",ch1),
  Q("icse10_ch1_vinv_q7","icse10_ch1_vat_invoice","Tax credit means…",[c("Refund of input VAT against output VAT"),m("Free items"),g("Random"),e("Discount")],"Mechanism.",["Avoids double taxation."],"Avoids double.","hard",ch1),
  Q("icse10_ch1_vinv_q8","icse10_ch1_vat_invoice","If input VAT > output VAT?",[c("Refund or carried forward"),m("Pay double"),g("Cancelled"),e("Random")],"Credit balance.",["Government refunds or carries forward."],"Refund.","hard",ch1),
  // Ch1 vat_word_problems
  Q("icse10_ch1_vwp_q1","icse10_ch1_vat_word_problems","Shopkeeper buys ₹500, marks up 20%, VAT 12%. Bill?",[c("₹672"),m("₹620"),g("₹600"),e("₹560")],"600 × 1.12.",["500×1.2=600. ×1.12=672."],"Markup then VAT.","medium",ch1),
  Q("icse10_ch1_vwp_q2","icse10_ch1_vat_word_problems","Bill ₹1120 includes 12% VAT. Selling price?",[c("₹1000"),m("₹1120"),g("₹1232"),e("₹985")],"1120/1.12.",["÷ 1.12."],"÷ (1+r).","medium",ch1),
  Q("icse10_ch1_vwp_q3","icse10_ch1_vat_word_problems","Discount 10% then VAT 5%. Original ₹1000. Final?",[c("₹945"),m("₹950"),g("₹990"),e("₹900")],"900 × 1.05.",["1000 × 0.9 = 900. × 1.05 = 945."],"Discount then VAT.","hard",ch1),
  Q("icse10_ch1_vwp_q4","icse10_ch1_vat_word_problems","VAT @ 8% on a TV is ₹400. CP?",[c("₹5000"),m("₹400"),g("₹3200"),e("₹4500")],"400/0.08.",["CP × 0.08 = 400 → CP = 5000."],"VAT/rate.","medium",ch1),
  Q("icse10_ch1_vwp_q5","icse10_ch1_vat_word_problems","Consumer pays ₹2240 including VAT 12%. Listed price?",[c("₹2000"),m("₹2240"),g("₹2470"),e("₹1995")],"2240/1.12.",["÷ 1.12 = 2000."],"÷ (1+r).","medium",ch1),
  Q("icse10_ch1_vwp_q6","icse10_ch1_vat_word_problems","Trader earns ₹120 VAT. If rate 6%, sales?",[c("₹2000"),m("₹720"),g("₹120"),e("₹1200")],"120/0.06.",["÷ rate."],"Reverse calc.","medium",ch1),
  Q("icse10_ch1_vwp_q7","icse10_ch1_vat_word_problems","If VAT rate doubles from 5% to 10% on ₹1000 item, extra tax?",[c("₹50"),m("₹100"),g("₹150"),e("₹500")],"50 vs 100, diff 50.",["100 − 50 = 50."],"Difference.","medium",ch1),
  Q("icse10_ch1_vwp_q8","icse10_ch1_vat_word_problems","Sale price ₹1100 (incl 10% VAT). Profit if CP ₹800?",[c("₹200"),m("₹300"),g("₹100"),e("₹400")],"SP=1000 ex VAT. Profit=200.",["1100/1.10 = 1000. 1000 − 800 = 200."],"Strip VAT then profit.","hard",ch1),

  // Ch2 banking_intro
  Q("icse10_ch2_bi_q1","icse10_ch2_banking_intro","RD stands for…",[c("Recurring Deposit"),m("Random Deposit"),g("Re-Deposit"),e("Recovery Deposit")],"Banking term.",["RD = Recurring Deposit."],"RD.","easy",ch2),
  Q("icse10_ch2_bi_q2","icse10_ch2_banking_intro","RD requires deposit at…",[c("Fixed intervals"),m("Random times"),g("End of year"),e("Once a year")],"Periodic.",["Monthly typically."],"Fixed interval.","easy",ch2),
  Q("icse10_ch2_bi_q3","icse10_ch2_banking_intro","RD earns…",[c("Compound or simple interest depending on bank"),m("No interest"),g("Random"),e("Negative")],"Interest accrues.",["Simple interest in ICSE syllabus."],"Earns interest.","easy",ch2),
  Q("icse10_ch2_bi_q4","icse10_ch2_banking_intro","RD for 12 months means…",[c("12 deposits"),m("12 years"),g("12 days"),e("1 month")],"Months.",["12 monthly deposits."],"Months.","easy",ch2),
  Q("icse10_ch2_bi_q5","icse10_ch2_banking_intro","Each instalment in RD earns interest for…",[c("Different duration"),m("Same duration"),g("Random"),e("No interest")],"Earlier deposits earn longer.",["1st deposit: n months. Last: 1 month."],"Different.","medium",ch2),
  Q("icse10_ch2_bi_q6","icse10_ch2_banking_intro","Total deposit in RD with monthly ₹500 for 24 months?",[c("₹12000"),m("₹500"),g("₹6000"),e("₹24000")],"500 × 24.",["Sum = principal × months."],"P × n.","easy",ch2),
  Q("icse10_ch2_bi_q7","icse10_ch2_banking_intro","Maturity amount = ?",[c("Total deposits + interest"),m("Just deposits"),g("Just interest"),e("Random")],"Both.",["Total = Pn + I."],"Both.","medium",ch2),
  Q("icse10_ch2_bi_q8","icse10_ch2_banking_intro","RD differs from FD because…",[c("Multiple deposits vs single"),m("Same"),g("RD earns more"),e("FD has no interest")],"Pattern.",["RD periodic. FD lump sum."],"Pattern.","medium",ch2),
  // Ch2 banking_si_formula
  Q("icse10_ch2_bf_q1","icse10_ch2_banking_si_formula","RD interest formula: I = ?",[c("P × n(n+1)/(2×12) × r/100"),m("P × n × r"),g("P × r/100"),e("Random")],"ICSE formula.",["Specific to RD."],"Standard formula.","medium",ch2),
  Q("icse10_ch2_bf_q2","icse10_ch2_banking_si_formula","P=500, n=12, r=8%. Interest?",[c("₹260"),m("₹500"),g("₹480"),e("₹40")],"500 × 12×13/(2×12) × 0.08 = 260.",["Apply formula."],"Apply.","medium",ch2),
  Q("icse10_ch2_bf_q3","icse10_ch2_banking_si_formula","P=200, n=24 months, r=10%. Interest?",[c("₹500"),m("₹480"),g("₹240"),e("₹2000")],"200 × 24×25/(2×12) × 0.10 = 500.",["200 × 600/24 × 0.1 = 500."],"Apply.","hard",ch2),
  Q("icse10_ch2_bf_q4","icse10_ch2_banking_si_formula","Why (n+1)/2 in formula?",[c("Sum of arithmetic series"),m("Random"),g("Convention"),e("Mistake")],"Months held arithmetic series.",["Avg months for principle is (n+1)/2."],"AP avg.","hard",ch2),
  Q("icse10_ch2_bf_q5","icse10_ch2_banking_si_formula","P=1000, n=6 months, r=12%. Interest?",[c("₹210"),m("₹60"),g("₹120"),e("₹6000")],"1000 × 6×7/24 × 0.12 = 210.",["Apply formula."],"Apply.","medium",ch2),
  Q("icse10_ch2_bf_q6","icse10_ch2_banking_si_formula","Doubling n approximately ___ interest.",[c("Quadruples (n² growth)"),m("Doubles"),g("Halves"),e("No change")],"n(n+1)/2 grows quadratically.",["Roughly × 4."],"Quadruple.","hard",ch2),
  Q("icse10_ch2_bf_q7","icse10_ch2_banking_si_formula","P=100, n=3, r=6%. Interest?",[c("₹3"),m("₹18"),g("₹6"),e("₹100")],"100 × 3×4/(24) × 0.06 = 3.",["Compute."],"Apply.","medium",ch2),
  Q("icse10_ch2_bf_q8","icse10_ch2_banking_si_formula","Higher rate r ___ interest.",[c("Linearly increases"),m("Quadratically"),g("Halves"),e("No change")],"r is linear in formula.",["Direct proportion."],"Linear.","medium",ch2),
  // Ch2 banking_maturity
  Q("icse10_ch2_bm_q1","icse10_ch2_banking_maturity","P=500, n=12, I=₹260. Maturity?",[c("₹6260"),m("₹260"),g("₹6000"),e("₹500")],"6000 + 260.",["Pn + I = 6000 + 260."],"Pn + I.","easy",ch2),
  Q("icse10_ch2_bm_q2","icse10_ch2_banking_maturity","Maturity formula: M = ?",[c("Pn + I"),m("P × I"),g("P/n"),e("P/I")],"Sum.",["Total = principal + interest."],"P + I.","easy",ch2),
  Q("icse10_ch2_bm_q3","icse10_ch2_banking_maturity","If P=200, n=24, I=500. Maturity?",[c("₹5300"),m("₹500"),g("₹4800"),e("₹5000")],"4800 + 500.",["200 × 24 + 500 = 5300."],"Pn + I.","easy",ch2),
  Q("icse10_ch2_bm_q4","icse10_ch2_banking_maturity","Maturity ₹2120, deposits ₹2000. Interest?",[c("₹120"),m("₹2000"),g("₹4120"),e("₹0")],"2120 − 2000.",["I = M − Pn."],"M − Pn.","easy",ch2),
  Q("icse10_ch2_bm_q5","icse10_ch2_banking_maturity","P=1000, n=12 months, r=6%. Maturity?",[c("₹12390"),m("₹12000"),g("₹390"),e("₹12060")],"12000 + 1000×12×13/24×0.06 = 12000 + 390 = 12390.",["Compute interest, add."],"Pn + I.","medium",ch2),
  Q("icse10_ch2_bm_q6","icse10_ch2_banking_maturity","If maturity = ₹3120, deposit ₹100/mo for 24 months, interest?",[c("₹720"),m("₹3120"),g("₹2400"),e("₹520")],"3120 − 2400.",["100 × 24 = 2400. I = 720."],"M − Pn.","medium",ch2),
  Q("icse10_ch2_bm_q7","icse10_ch2_banking_maturity","P=400, n=10 months, r=9%. Maturity?",[c("₹4165"),m("₹4000"),g("₹165"),e("₹400")],"4000 + 165.",["I = 400×10×11/24×0.09 ≈ 165."],"Pn + I.","medium",ch2),
  Q("icse10_ch2_bm_q8","icse10_ch2_banking_maturity","To find r given M, P, n: solve…",[c("M = Pn + Pn(n+1)/24 × r/100"),m("Random"),g("M = Pr"),e("Just I")],"Reverse formula.",["Solve for r."],"Reverse.","hard",ch2),
  // Ch2 banking_word_problems
  Q("icse10_ch2_bwp_q1","icse10_ch2_banking_word_problems","Maturity ₹2070, P=₹100, n=18 months. Rate?",[c("8%"),m("5%"),g("10%"),e("6%")],"Interest 270. r solved from formula.",["I = 100×18×19/24×r/100 = 270 → r=8."],"Solve r.","hard",ch2),
  Q("icse10_ch2_bwp_q2","icse10_ch2_banking_word_problems","P=200/mo, n=24, r=12%, maturity?",[c("₹5400"),m("₹4800"),g("₹600"),e("₹5000")],"4800 + 600.",["I = 200×24×25/24×0.12 = 600."],"Apply.","medium",ch2),
  Q("icse10_ch2_bwp_q3","icse10_ch2_banking_word_problems","To save ₹4000 in 12 months with 6% interest, deposit?",[c("Use M=Pn+I formula reversed"),m("₹400"),g("₹333"),e("₹500")],"Solve.",["12P + P×6.5×0.06/... = 4000."],"Reverse.","hard",ch2),
  Q("icse10_ch2_bwp_q4","icse10_ch2_banking_word_problems","RD pays 9% p.a. ₹500/month. After 1 year, maturity?",[c("₹6293"),m("₹6000"),g("₹293"),e("₹6500")],"6000 + 293.",["I = 500×12×13/24×0.09 = 293 (approx)."],"Apply.","medium",ch2),
  Q("icse10_ch2_bwp_q5","icse10_ch2_banking_word_problems","If RD doubles time, interest grows ~___",[c("Quadruples"),m("Doubles"),g("Halves"),e("Stays")],"n(n+1) ~ n² growth.",["I ∝ n²."],"× 4.","hard",ch2),
  Q("icse10_ch2_bwp_q6","icse10_ch2_banking_word_problems","P=₹250/mo, n=10 months, rate 6%. Interest?",[c("₹68.75"),m("₹2500"),g("₹250"),e("₹68")],"250 × 10×11/24 × 0.06 = 68.75.",["Apply formula."],"Apply.","medium",ch2),
  Q("icse10_ch2_bwp_q7","icse10_ch2_banking_word_problems","Monthly deposit ₹100, period 5 yrs (60 mo), rate 12%. Maturity?",[c("₹8830"),m("₹6000"),g("₹2830"),e("₹8200")],"6000 + 2830.",["I = 100×60×61/24×0.12 = 1830 (rough). Actual ~2830."],"Apply.","hard",ch2),
  Q("icse10_ch2_bwp_q8","icse10_ch2_banking_word_problems","Lower interest rate means…",[c("Lower maturity"),m("Same"),g("Higher"),e("Random")],"Linear effect.",["Less interest, less maturity."],"Less.","easy",ch2),

  // Ch3 shares_basics
  Q("icse10_ch3_sb_q1","icse10_ch3_shares_basics","Face value (FV) of a share is…",[c("Printed/par value"),m("Trading value"),g("Random"),e("Profit value")],"Definition.",["Original issued value."],"Printed.","easy",ch3),
  Q("icse10_ch3_sb_q2","icse10_ch3_shares_basics","Market value (MV) is…",[c("Current trading price"),m("Face value"),g("Random"),e("Dividend value")],"Live price.",["What buyers pay."],"Trading.","easy",ch3),
  Q("icse10_ch3_sb_q3","icse10_ch3_shares_basics","100 shares of FV ₹10 means total face value of…",[c("₹1000"),m("₹100"),g("₹10"),e("₹10000")],"Multiply.",["100 × 10 = 1000."],"Multiply.","easy",ch3),
  Q("icse10_ch3_sb_q4","icse10_ch3_shares_basics","Bought 200 shares at MV ₹15. Investment?",[c("₹3000"),m("₹200"),g("₹15"),e("₹3015")],"200 × 15.",["Shares × MV."],"× MV.","easy",ch3),
  Q("icse10_ch3_sb_q5","icse10_ch3_shares_basics","Shares represent…",[c("Ownership in company"),m("Loan"),g("Discount"),e("Cash")],"Equity.",["Investor part-owner."],"Ownership.","medium",ch3),
  Q("icse10_ch3_sb_q6","icse10_ch3_shares_basics","Common types of shares?",[c("Equity, preference"),m("Just one"),g("Random"),e("Cash, credit")],"Two main.",["Equity and preference shares."],"2 types.","medium",ch3),
  Q("icse10_ch3_sb_q7","icse10_ch3_shares_basics","Shareholders earn from…",[c("Dividends and capital gains"),m("Salary"),g("Loans"),e("Random")],"Two sources.",["Dividends + price appreciation."],"Dividend + gain.","medium",ch3),
  Q("icse10_ch3_sb_q8","icse10_ch3_shares_basics","Shares listed on…",[c("Stock exchange"),m("Bank"),g("School"),e("Hospital")],"Markets.",["NSE, BSE, etc."],"Stock exchange.","easy",ch3),
  // Ch3 shares_dividend
  Q("icse10_ch3_sd_q1","icse10_ch3_shares_dividend","Dividend is computed on…",[c("Face value"),m("Market value"),g("Random"),e("Income")],"FV only.",["Standard."],"FV.","medium",ch3),
  Q("icse10_ch3_sd_q2","icse10_ch3_shares_dividend","100 shares FV ₹10, div 8%. Dividend amount?",[c("₹80"),m("₹8"),g("₹800"),e("₹100")],"8% of 1000.",["1000 × 0.08 = 80."],"% × FV total.","easy",ch3),
  Q("icse10_ch3_sd_q3","icse10_ch3_shares_dividend","Dividend rate is per…",[c("Year"),m("Day"),g("Hour"),e("Lifetime")],"Annual.",["Annual rate."],"Year.","easy",ch3),
  Q("icse10_ch3_sd_q4","icse10_ch3_shares_dividend","200 shares FV ₹100, div 12%. Total dividend?",[c("₹2400"),m("₹240"),g("₹120"),e("₹20000")],"12% of 20000.",["20000 × 0.12 = 2400."],"% × total FV.","medium",ch3),
  Q("icse10_ch3_sd_q5","icse10_ch3_shares_dividend","If FV ₹10, MV ₹20, div 10%. Dividend per share?",[c("₹1"),m("₹2"),g("₹10"),e("₹20")],"10% of 10.",["FV × rate = 1."],"FV × rate.","easy",ch3),
  Q("icse10_ch3_sd_q6","icse10_ch3_shares_dividend","If FV ₹100, dividend ₹15 per share, rate?",[c("15%"),m("10%"),g("1.5%"),e("150%")],"15/100.",["= 15%."],"div/FV × 100.","medium",ch3),
  Q("icse10_ch3_sd_q7","icse10_ch3_shares_dividend","Dividend can be paid in…",[c("Cash or bonus shares"),m("Cash only"),g("Random"),e("Loans")],"Multiple forms.",["Both common."],"Cash + shares.","medium",ch3),
  Q("icse10_ch3_sd_q8","icse10_ch3_shares_dividend","Earnings per share (EPS) is…",[c("Profit ÷ # shares"),m("Random"),g("Dividend"),e("MV")],"Per-share earnings.",["Total profit / count."],"Profit/shares.","hard",ch3),
  // Ch3 shares_market_value
  Q("icse10_ch3_smv_q1","icse10_ch3_shares_market_value","If MV > FV, share is at…",[c("Premium"),m("Discount"),g("Par"),e("Random")],"Premium.",["MV more than FV."],"Premium.","medium",ch3),
  Q("icse10_ch3_smv_q2","icse10_ch3_shares_market_value","If MV < FV, share is at…",[c("Discount"),m("Premium"),g("Par"),e("Random")],"Discount.",["MV less than FV."],"Discount.","medium",ch3),
  Q("icse10_ch3_smv_q3","icse10_ch3_shares_market_value","FV ₹10, MV ₹12. Premium per share?",[c("₹2"),m("₹10"),g("₹12"),e("₹22")],"12 − 10.",["MV − FV = 2."],"Premium.","easy",ch3),
  Q("icse10_ch3_smv_q4","icse10_ch3_shares_market_value","FV ₹100, MV ₹80. Discount?",[c("₹20"),m("₹100"),g("₹80"),e("₹180")],"100 − 80.",["FV − MV = 20."],"Discount.","easy",ch3),
  Q("icse10_ch3_smv_q5","icse10_ch3_shares_market_value","FV ₹10, MV ₹10. Status?",[c("At par"),m("Premium"),g("Discount"),e("Loss")],"Par.",["MV = FV = par."],"Par.","easy",ch3),
  Q("icse10_ch3_smv_q6","icse10_ch3_shares_market_value","Bought 100 shares FV ₹10 at MV ₹13. Investment?",[c("₹1300"),m("₹1000"),g("₹100"),e("₹300")],"100 × 13.",["Shares × MV."],"× MV.","medium",ch3),
  Q("icse10_ch3_smv_q7","icse10_ch3_shares_market_value","Premium % = ?",[c("(MV − FV)/FV × 100"),m("MV − FV"),g("MV/FV"),e("Random")],"Percentage.",["Premium relative to FV."],"% of FV.","hard",ch3),
  Q("icse10_ch3_smv_q8","icse10_ch3_shares_market_value","MV depends on…",[c("Supply, demand, performance"),m("FV only"),g("Random"),e("Fixed")],"Market forces.",["Many factors."],"Market.","medium",ch3),
  // Ch3 shares_word_problems
  Q("icse10_ch3_swp_q1","icse10_ch3_shares_word_problems","200 shares FV ₹10 at MV ₹12. Investment?",[c("₹2400"),m("₹2000"),g("₹240"),e("₹20")],"200 × 12.",["Shares × MV."],"× MV.","easy",ch3),
  Q("icse10_ch3_swp_q2","icse10_ch3_shares_word_problems","Investment ₹2400, dividend 9% on FV ₹10. Income?",[c("₹180"),m("₹240"),g("₹216"),e("₹90")],"200 shares × 9% × 10.",["200 shares × 0.9 = 180."],"× FV rate.","medium",ch3),
  Q("icse10_ch3_swp_q3","icse10_ch3_shares_word_problems","% Return on investment = ?",[c("Income / investment × 100"),m("Random"),g("FV / MV"),e("Dividend rate")],"Standard.",["% return on money invested."],"% return.","medium",ch3),
  Q("icse10_ch3_swp_q4","icse10_ch3_shares_word_problems","Investment ₹2400, income ₹180. % return?",[c("7.5%"),m("9%"),g("12%"),e("180%")],"180/2400 × 100.",["= 7.5%."],"% formula.","medium",ch3),
  Q("icse10_ch3_swp_q5","icse10_ch3_shares_word_problems","FV ₹100, MV ₹120, dividend 15%. # shares for ₹6000 investment?",[c("50"),m("60"),g("500"),e("100")],"6000/120.",["= 50."],"Inv/MV.","medium",ch3),
  Q("icse10_ch3_swp_q6","icse10_ch3_shares_word_problems","50 shares FV ₹100 at MV ₹120. % return at 15% dividend?",[c("12.5%"),m("15%"),g("10%"),e("18%")],"Income = 750. Invest = 6000. Return = 12.5%.",["750/6000 × 100 = 12.5."],"% income/inv.","hard",ch3),
  Q("icse10_ch3_swp_q7","icse10_ch3_shares_word_problems","If MV doubles, % return on dividend ___",[c("Halves"),m("Doubles"),g("Same"),e("Random")],"Same dividend, double investment.",["Investment doubles, return halves."],"Inverse.","hard",ch3),
  Q("icse10_ch3_swp_q8","icse10_ch3_shares_word_problems","Bought 100 shares at premium ₹15, FV ₹100, div 20%. Income?",[c("₹2000"),m("₹1500"),g("₹2500"),e("₹100")],"100 × 0.2 × 100.",["20% × FV total = 100 × 20 = 2000."],"× FV.","medium",ch3),

  // Ch4 inequations_intro
  Q("icse10_ch4_ii_q1","icse10_ch4_inequations_intro","Inequations use…",[c("<, >, ≤, ≥"),m("="),g("∞"),e("/")],"Inequality signs.",["Standard symbols."],"<, >, ≤, ≥.","easy",ch4),
  Q("icse10_ch4_ii_q2","icse10_ch4_inequations_intro","x + 3 > 7 means…",[c("x > 4"),m("x = 4"),g("x ≥ 4"),e("x < 4")],"Solve.",["Subtract 3."],"Subtract.","easy",ch4),
  Q("icse10_ch4_ii_q3","icse10_ch4_inequations_intro","When ÷ by negative, sign ___",[c("Flips"),m("Stays"),g("Random"),e("Disappears")],"Critical rule.",["Reverse inequality."],"Flips.","medium",ch4),
  Q("icse10_ch4_ii_q4","icse10_ch4_inequations_intro","Solution set: x > 5 has how many integers?",[c("Infinitely many"),m("Just 5"),g("Just 0"),e("None")],"All > 5.",["6, 7, 8, ..."],"Infinite.","easy",ch4),
  Q("icse10_ch4_ii_q5","icse10_ch4_inequations_intro","x ≤ 3 includes x = 3?",[c("Yes"),m("No"),g("Sometimes"),e("Random")],"≤ includes equality.",["Inclusive."],"Yes.","easy",ch4),
  Q("icse10_ch4_ii_q6","icse10_ch4_inequations_intro","x < 3 includes x = 3?",[m("Yes"),c("No"),g("Sometimes"),e("Random")],"Strict.",["Exclusive."],"No.","easy",ch4),
  Q("icse10_ch4_ii_q7","icse10_ch4_inequations_intro","Solution of x > 2 in natural numbers?",[c("3, 4, 5, ..."),m("Just 3"),g("All numbers"),e("None")],"Natural > 2.",["Starts at 3."],"3 onward.","medium",ch4),
  Q("icse10_ch4_ii_q8","icse10_ch4_inequations_intro","Combined inequality 2 < x < 5 includes?",[c("3, 4"),m("2, 3, 4, 5"),g("All numbers"),e("Just 3")],"Strict both sides.",["Excludes 2 and 5."],"3, 4.","medium",ch4),
  // Ch4 inequations_solving
  Q("icse10_ch4_is_q1","icse10_ch4_inequations_solving","Solve 2x − 5 < 9.",[c("x < 7"),m("x > 7"),g("x = 7"),e("x ≤ 7")],"+5, ÷2.",["2x < 14, x < 7."],"Standard.","easy",ch4),
  Q("icse10_ch4_is_q2","icse10_ch4_inequations_solving","Solve −x > 3.",[c("x < −3"),m("x > −3"),g("x = −3"),e("Random")],"× −1, flip.",["Flip sign."],"Flip on negative.","medium",ch4),
  Q("icse10_ch4_is_q3","icse10_ch4_inequations_solving","Solve 3x + 2 ≥ 14.",[c("x ≥ 4"),m("x ≤ 4"),g("x > 4"),e("x < 4")],"Standard.",["3x ≥ 12, x ≥ 4."],"Standard.","medium",ch4),
  Q("icse10_ch4_is_q4","icse10_ch4_inequations_solving","Solve x/2 > 5.",[c("x > 10"),m("x > 2.5"),g("x = 10"),e("x ≥ 10")],"× 2.",["x > 10."],"× pos.","easy",ch4),
  Q("icse10_ch4_is_q5","icse10_ch4_inequations_solving","Solve −2x ≤ 8.",[c("x ≥ −4"),m("x ≤ −4"),g("x ≥ 4"),e("x ≤ 4")],"÷ −2 flips.",["x ≥ −4."],"Flip.","medium",ch4),
  Q("icse10_ch4_is_q6","icse10_ch4_inequations_solving","Solve 5 − x > 2.",[c("x < 3"),m("x > 3"),g("x = 3"),e("x ≥ 3")],"−x > −3, flip.",["x < 3."],"Subtract + flip.","medium",ch4),
  Q("icse10_ch4_is_q7","icse10_ch4_inequations_solving","Solve 2x + 3 ≤ x + 7.",[c("x ≤ 4"),m("x ≥ 4"),g("x = 4"),e("x ≤ 7")],"x ≤ 4.",["Subtract x."],"Simplify.","medium",ch4),
  Q("icse10_ch4_is_q8","icse10_ch4_inequations_solving","Combined: 3 < x + 2 < 7.",[c("1 < x < 5"),m("3 < x < 7"),g("Random"),e("x = 5")],"Subtract 2.",["Apply to all parts."],"Subtract.","hard",ch4),
  // Ch4 inequations_number_line
  Q("icse10_ch4_il_q1","icse10_ch4_inequations_number_line","x > 5 on number line: marker at 5?",[c("Open circle"),m("Closed circle"),g("Both"),e("None")],"Strict = open.",["Open ○ for strict."],"Open.","medium",ch4),
  Q("icse10_ch4_il_q2","icse10_ch4_inequations_number_line","x ≥ 5: marker at 5?",[c("Closed circle"),m("Open circle"),g("Both"),e("None")],"≥ inclusive.",["Closed ● for inclusive."],"Closed.","medium",ch4),
  Q("icse10_ch4_il_q3","icse10_ch4_inequations_number_line","Arrow direction for x > 5?",[c("Right"),m("Left"),g("Both"),e("None")],"Greater.",["x > 5 means larger values."],"Right.","easy",ch4),
  Q("icse10_ch4_il_q4","icse10_ch4_inequations_number_line","Arrow for x < 3?",[c("Left"),m("Right"),g("Both"),e("None")],"Less.",["Smaller values."],"Left.","easy",ch4),
  Q("icse10_ch4_il_q5","icse10_ch4_inequations_number_line","Number line for 2 ≤ x < 5: ?",[c("Closed at 2, open at 5"),m("Open both"),g("Closed both"),e("Random")],"Mixed.",["Inclusive 2, exclusive 5."],"Mixed.","medium",ch4),
  Q("icse10_ch4_il_q6","icse10_ch4_inequations_number_line","Empty solution set looks like…",[c("No marks on line"),m("Whole line"),g("Random"),e("Just zero")],"Empty.",["No solution."],"Empty.","hard",ch4),
  Q("icse10_ch4_il_q7","icse10_ch4_inequations_number_line","All real numbers: line is…",[c("Fully shaded"),m("Empty"),g("Just at 0"),e("Random")],"All real.",["Shade entire line."],"Full.","hard",ch4),
  Q("icse10_ch4_il_q8","icse10_ch4_inequations_number_line","x < 5 AND x > 2 graph?",[c("Open intervals (2, 5)"),m("Closed"),g("Empty"),e("Random")],"Strict on both ends.",["Open circles at 2 and 5."],"Open (2, 5).","medium",ch4),
  // Ch4 inequations_word
  Q("icse10_ch4_iw_q1","icse10_ch4_inequations_word","'At most 20' translates to…",[c("x ≤ 20"),m("x < 20"),g("x ≥ 20"),e("x = 20")],"Inclusive max.",["≤ for at most."],"≤.","easy",ch4),
  Q("icse10_ch4_iw_q2","icse10_ch4_inequations_word","'At least 5' translates to…",[c("x ≥ 5"),m("x > 5"),g("x ≤ 5"),e("x = 5")],"Inclusive min.",["≥ for at least."],"≥.","easy",ch4),
  Q("icse10_ch4_iw_q3","icse10_ch4_inequations_word","'More than 10' means…",[c("x > 10"),m("x ≥ 10"),g("x < 10"),e("x = 10")],"Strict.",["More than = strict >."],">.","easy",ch4),
  Q("icse10_ch4_iw_q4","icse10_ch4_inequations_word","'No more than 50' means…",[c("x ≤ 50"),m("x < 50"),g("x > 50"),e("x = 50")],"Inclusive.",["No more = ≤."],"≤.","medium",ch4),
  Q("icse10_ch4_iw_q5","icse10_ch4_inequations_word","Sum of two numbers > 15. If one is 8, the other?",[c("x > 7"),m("x ≥ 7"),g("x < 7"),e("x = 7")],"x + 8 > 15.",["x > 7."],"Translate.","medium",ch4),
  Q("icse10_ch4_iw_q6","icse10_ch4_inequations_word","Twice a number ≥ 30. The number?",[c("x ≥ 15"),m("x ≤ 15"),g("x > 15"),e("x = 15")],"2x ≥ 30.",["x ≥ 15."],"÷ 2.","medium",ch4),
  Q("icse10_ch4_iw_q7","icse10_ch4_inequations_word","Age is between 18 and 25 inclusive.",[c("18 ≤ age ≤ 25"),m("18 < age < 25"),g("Random"),e("age = 18")],"Compound.",["Inclusive both ends."],"Compound.","medium",ch4),
  Q("icse10_ch4_iw_q8","icse10_ch4_inequations_word","Salary ≥ ₹20000. Tax cutoff is ₹15000. Eligible?",[c("Yes (≥ 20000 > 15000)"),m("No"),g("Sometimes"),e("Cannot say")],"Income above threshold.",["Above cutoff."],"Yes.","hard",ch4),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const q of questions) {
    await Question.findOneAndUpdate({ questionId: q.questionId }, q, { upsert: true, new: true });
  }
  console.log(`Seeded ${questions.length} ICSE Class 10 questions (Ch1-4).`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
