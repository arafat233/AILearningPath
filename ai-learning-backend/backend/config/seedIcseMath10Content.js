/**
 * ICSE Class 10 Mathematics — Sub-topic Content Seed
 * 25 chapters × 4 sub-topics = 100 sub-topics across 7 units:
 *   Unit 1 (Commercial Arithmetic): Ch 1-3
 *   Unit 2 (Algebra): Ch 4-11
 *   Unit 3 (Co-ordinate Geometry): Ch 12-14
 *   Unit 4 (Geometry): Ch 15-19
 *   Unit 5 (Mensuration): Ch 20
 *   Unit 6 (Trigonometry): Ch 21-22
 *   Unit 7 (Statistics): Ch 23-25
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";
dotenv.config();

const T = (topicId, chapterNumber, sectionNumber, title, intuition, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway) => ({
  topicId, chapterNumber, sectionNumber, title, subject:"Mathematics", intuition, process_explanation, worked_example, common_misconceptions, shortcuts_and_tricks, key_takeaway
});

const topics = [
  // ══════════════════════════════════════════════════
  // UNIT 1: COMMERCIAL ARITHMETIC
  // ══════════════════════════════════════════════════
  // Ch 1: Value Added Tax
  T("icse10_ch1_vat_intro",1,"1.1","VAT — Introduction","VAT (Value Added Tax) is tax added at each stage of production/sale based on value added. Paid by the consumer ultimately.","Tax rate × value added. Sales tax replaced by VAT in most contexts.","Item cost ₹100, VAT 12% → tax = ₹12, total = ₹112.","Confusing VAT with sales tax on full price each stage.","VAT applies on value added at each stage, not full price.","VAT is tax on value added at each business stage."),
  T("icse10_ch1_vat_calculations",1,"1.2","VAT Calculations","Compute VAT from cost price and rate, or final selling price.","VAT = (rate/100) × value. SP including VAT = Cost × (1 + rate/100).","Cost ₹500, VAT rate 15% → VAT = ₹75, SP = ₹575.","Forgetting to add VAT back to cost.","SP = CP + VAT, so SP = CP(1 + r/100).","VAT calculations: rate × value added."),
  T("icse10_ch1_vat_invoice",1,"1.3","VAT Invoices","Invoices show separate VAT line item. Tax credit allowed for businesses.","Identify CP, VAT, total. Trader's VAT liability = VAT on sales − VAT paid on purchases.","Trader buys ₹1000+12% VAT. Sells ₹1500+12% VAT. VAT paid: ₹180−₹120 = ₹60.","Mixing CP and SP VAT amounts.","Net VAT paid = output VAT − input VAT credit.","VAT invoices separate tax for credit tracking."),
  T("icse10_ch1_vat_word_problems",1,"1.4","VAT Word Problems","Real-world problems mixing CP, SP, profit and VAT rates.","Identify what's CP, what's SP. Apply VAT correctly. Find profit/loss separately if needed.","Manufacturer: ₹500 cost. Sells to dealer at 10% profit + 12% VAT. Dealer sells at 10% profit + 12% VAT to consumer. Find consumer price.","Mixing profit margin and VAT in one step.","Apply profit first, then VAT.","VAT word problems chain multiple stages of profit + tax."),

  // Ch 2: Banking — Recurring Deposit
  T("icse10_ch2_banking_intro",2,"2.1","Banking — Recurring Deposit Intro","Recurring Deposit (RD): fixed monthly deposit for fixed time period, earns interest.","Customer deposits P every month for n months. Interest computed on each deposit.","RD ₹500/month for 12 months at 8% p.a.","Calculating like simple deposit (single sum).","Each instalment earns interest for different time.","RD = monthly deposit, fixed period, simple interest."),
  T("icse10_ch2_banking_si_formula",2,"2.2","RD Interest Formula","Interest on RD: I = P × n(n+1)/(2×12) × r/100, where P=monthly deposit, n=months, r=annual rate.","Apply formula directly. Maturity = P×n + I.","P=₹500, n=12 months, r=8% → I=500 × 12×13/(2×12) × 8/100 = ₹260.","Forgetting to divide by (2×12).","Sum of arithmetic series gives the (n+1)/2 factor.","RD interest formula: P × n(n+1)/(2×12) × r/100."),
  T("icse10_ch2_banking_maturity",2,"2.3","Maturity Amount","Maturity = total deposits + interest = Pn + I.","Total deposits = P × n. Add interest.","P=₹500, n=12, I=₹260 → Maturity = ₹500×12 + ₹260 = ₹6260.","Forgetting to add total deposits.","Maturity = Pn + I.","Maturity = total saved + earned interest."),
  T("icse10_ch2_banking_word_problems",2,"2.4","Banking Word Problems","Real-life RD problems: find P, n, r, or maturity from given info.","Identify what's unknown. Use the formula in reverse.","Maturity ₹3120 in 24 months at 6% p.a. Find P. Use: 3120 = 24P + P×24×25/(2×12) × 0.06 = 24P + 1.5P = 25.5P → P = ₹122.35.","Misidentifying which variable is given.","Substitute known values, solve for unknown.","RD problems use the formula flexibly."),

  // Ch 3: Shares and Dividend
  T("icse10_ch3_shares_basics",3,"3.1","Shares — Basics","Companies issue shares to raise capital. Buyers become shareholders earning dividends.","Face value = printed value. Market value = trading price. Number of shares × price = investment.","100 shares of FV ₹10, bought at MV ₹15 → investment = ₹1500.","Confusing face value and market value.","FV is fixed, MV varies.","Shares: ownership stake, traded at market value."),
  T("icse10_ch3_shares_dividend",3,"3.2","Dividend Calculations","Dividend = company profit shared with shareholders.","Dividend % is on face value. Dividend = (rate/100) × FV × number of shares.","100 shares of FV ₹10, dividend 8% → dividend = (8/100)×10×100 = ₹80.","Computing dividend on market value (wrong).","Always face value for dividend.","Dividend % × FV × # shares."),
  T("icse10_ch3_shares_market_value",3,"3.3","Market Value & Premium/Discount","MV > FV → premium. MV < FV → discount. MV = FV → par.","Premium = MV − FV. Discount = FV − MV.","FV ₹10, MV ₹12 → premium ₹2. FV ₹10, MV ₹8 → discount ₹2.","Mixing premium and discount.","MV vs FV comparison determines premium/discount.","Premium/discount = MV − FV (signed)."),
  T("icse10_ch3_shares_word_problems",3,"3.4","Shares Word Problems","Investment, income, return % calculations.","% Return = (dividend/investment) × 100.","Bought 200 shares FV ₹10 at ₹12 (₹2400 investment). Dividend 9% → ₹180 income. Return = 180/2400 × 100 = 7.5%.","Confusing dividend % with return %.","Return % ≠ Dividend %.","% Return based on investment, dividend based on FV."),

  // ══════════════════════════════════════════════════
  // UNIT 2: ALGEBRA
  // ══════════════════════════════════════════════════
  // Ch 4: Linear Inequations
  T("icse10_ch4_inequations_intro",4,"4.1","Linear Inequations — Introduction","Inequations: relations using <, >, ≤, ≥ instead of =.","Treat like equations EXCEPT flip sign when multiplying/dividing by negative.","x + 3 > 7 → x > 4.","Forgetting to flip sign with negative multiplication.","< vs ≤ matters at boundary.","Linear inequations: solve like equations, mind sign flip."),
  T("icse10_ch4_inequations_solving",4,"4.2","Solving Linear Inequations","Isolate variable using inverse operations.","Add/subtract/multiply both sides. Flip sign on negative ×/÷.","2x − 5 ≤ 9 → 2x ≤ 14 → x ≤ 7.","Treating ≤ same as < in solution set.","≤ includes boundary, < doesn't.","Solve step by step, watch sign flip."),
  T("icse10_ch4_inequations_number_line",4,"4.3","Number Line Representation","Solution sets on a number line: open/closed circle for </≤.","Open circle (○) for strict <, closed (●) for ≤.","x > 3: open circle at 3, arrow to right.","Drawing closed for strict inequality.","○ = excluded, ● = included.","Number line shows solution visually."),
  T("icse10_ch4_inequations_word",4,"4.4","Inequations Word Problems","Real-life: 'at most', 'at least', 'no more than', 'more than'.","Translate to inequality. Solve.","'A number is at most 20' → x ≤ 20.","Confusing 'at most' with 'less than'.","'At most' = ≤, 'at least' = ≥.","Word problems → inequalities → solutions."),

  // Ch 5: Quadratic Equations
  T("icse10_ch5_quadratic_intro",5,"5.1","Quadratic Equations — Introduction","Equation ax² + bx + c = 0 with a ≠ 0. Has up to 2 solutions (roots).","Identify a, b, c. Three solving methods: factorization, completing square, formula.","x² − 5x + 6 = 0: a=1, b=−5, c=6.","Forgetting a ≠ 0.","Degree 2 polynomial equation.","Quadratic = degree 2 polynomial equation."),
  T("icse10_ch5_quadratic_factorization",5,"5.2","Solving by Factorization","Express as (x − p)(x − q) = 0, where p × q = c, p + q = −b/a.","Find two numbers whose sum = −b/a, product = c/a. Use them to factor.","x² − 5x + 6 = (x − 2)(x − 3) → x = 2 or 3.","Mixing sum and product.","Sum of roots: −b/a, product: c/a.","Factorize when easy; (x−p)(x−q)=0."),
  T("icse10_ch5_quadratic_formula",5,"5.3","Quadratic Formula","x = (−b ± √(b² − 4ac)) / 2a.","Substitute coefficients. Compute discriminant b² − 4ac.","x² − 5x + 6 = 0 → x = (5 ± 1)/2 = 3 or 2.","Sign errors in −b ± √.","Mind ± both roots.","Quadratic formula gives both roots directly."),
  T("icse10_ch5_quadratic_nature",5,"5.4","Nature of Roots","Discriminant Δ = b² − 4ac. Δ > 0: 2 real distinct. Δ = 0: 2 equal real. Δ < 0: no real.","Compute discriminant.","x² + 2x + 5 = 0: Δ = 4 − 20 = −16 < 0 → no real roots.","Confusing Δ = 0 with no roots.","Δ tells story of roots.","Discriminant reveals nature of roots."),

  // Ch 6: Solving Problems Based on Quadratic Equations
  T("icse10_ch6_word_problems_quad",6,"6.1","Word Problems via Quadratic","Translate problem to quadratic equation, solve, interpret.","Define variable. Set up equation. Solve. Check.","'Product of consecutive integers is 56. Find them.' x(x+1) = 56 → x²+x−56=0 → x=7.","Forgetting to reject negative/extraneous root.","Always interpret in context.","Word problems → quadratic equation → solve."),
  T("icse10_ch6_age_problems",6,"6.2","Age Problems","Express present, past, future ages. Set up quadratic.","Let present age = x. Express past/future ages in x. Set up equation.","'Sum of squares of ages = 130. Mother is 20 years older.' (x+20)² + x² = 130 → 2x²+40x+400=130 → 2x²+40x+270=0 → x²+20x+135=0.","Forgetting to add/subtract years correctly.","Express ages relative to present.","Age problems use quadratic with time offsets."),
  T("icse10_ch6_speed_problems",6,"6.3","Speed/Distance/Time","Distance = speed × time. Reverse: time = distance/speed.","Set up equation using speed-distance-time. Often gives quadratic.","'Train covers 480 km in 8 hrs. Increasing speed 20 km/hr saves 1 hr. Original speed?' d/v + 1 = d/(v+20) → quadratic.","Misapplying speed-time relation.","Always use d = v×t.","Speed problems often produce quadratic."),
  T("icse10_ch6_geometry_problems",6,"6.4","Geometry/Area Problems","Area, perimeter problems lead to quadratics.","Set up area or perimeter equation. Solve.","'Field area 168 sq m, length 4 m more than width. Find dimensions.' x(x+4)=168 → x²+4x−168=0.","Mixing length and width.","Area formula and conditions create quadratic.","Geometric word problems yield quadratics."),

  // Ch 7: Ratio and Proportion
  T("icse10_ch7_ratio_basics",7,"7.1","Ratio Basics & Properties","Ratio compares two quantities of same kind. a:b means a/b.","Simplify by dividing by GCD.","6:9 = 2:3.","Treating ratio as difference.","Ratio = comparison, not subtraction.","Ratios are simplified by GCD."),
  T("icse10_ch7_proportion_properties",7,"7.2","Proportion & Properties","a:b = c:d (or a/b = c/d). Four properties: invertendo, alternendo, componendo, dividendo.","Memorize the four properties.","If a/b = c/d, then b/a = d/c (invertendo), a/c = b/d (alternendo).","Mixing the four properties.","Apply correct property based on need.","Proportion has 4 transformation properties."),
  T("icse10_ch7_continued_proportion",7,"7.3","Continued Proportion","a:b :: b:c → b² = ac. b is mean proportional.","Find b from ac. Mean proportional = √(ac).","2 and 8 are in continued proportion via b² = 16 → b = 4.","Forgetting to take √.","b = √(ac) for mean proportional.","Continued proportion: b² = ac."),
  T("icse10_ch7_proportion_applications",7,"7.4","Proportion Applications","Real-life: solving for unknowns using proportional relationships.","Set up proportion from problem. Cross-multiply.","If 5 books cost ₹150, 8 books cost? 5/150 = 8/x → x = ₹240.","Setting up wrong ratio.","Always check unit consistency.","Proportions solve scaling problems."),

  // Ch 8: Remainder and Factor Theorems
  T("icse10_ch8_remainder_theorem",8,"8.1","Remainder Theorem","Dividing p(x) by (x − a) leaves remainder p(a).","Find p(a) by substituting x = a.","Divide x² + 2x + 3 by (x − 1): p(1) = 1 + 2 + 3 = 6.","Forgetting to flip sign for −a.","p(a) for (x−a), p(−a) for (x+a).","Remainder = p(a) when dividing by (x − a)."),
  T("icse10_ch8_factor_theorem",8,"8.2","Factor Theorem","(x − a) is factor of p(x) if p(a) = 0.","Test value: if p(a) = 0, then (x − a) is a factor.","x² − 5x + 6: p(2) = 4 − 10 + 6 = 0 → (x − 2) is factor.","Forgetting that p(a) ≠ 0 means (x − a) is NOT factor.","p(a) = 0 ⇔ factor.","Factor theorem links zeros and factors."),
  T("icse10_ch8_factorization_cubic",8,"8.3","Factorizing Cubics","Use factor theorem to find one root, divide out, then factor quadratic.","Find rational roots ±factors of constant. Divide polynomial. Factor quadratic.","Factor x³ − 6x² + 11x − 6: try x=1: 1−6+11−6=0. So (x−1) is factor. Divide: x²−5x+6 = (x−2)(x−3). Final: (x−1)(x−2)(x−3).","Skipping verification of root.","Always confirm p(a)=0 before factoring out.","Cubic factorization: find one root, divide, factor remainder."),
  T("icse10_ch8_polynomial_division",8,"8.4","Polynomial Division","Synthetic or long division to find quotient and remainder.","Set up: dividend ÷ divisor. Follow division algorithm.","x² + 3x + 2 ÷ (x + 1): quotient x + 2, remainder 0.","Misalignment of terms.","Keep degrees aligned in division.","Polynomial division yields quotient + remainder."),

  // Ch 9: Matrices
  T("icse10_ch9_matrix_basics",9,"9.1","Matrices — Basics","Rectangular array of numbers (rows × columns).","Order m × n: m rows, n columns. Element a_ij at row i, column j.","Matrix [[1,2],[3,4]] is 2×2. a_12 = 2.","Confusing rows and columns.","Order = rows × columns.","Matrices: arrays with row × col structure."),
  T("icse10_ch9_matrix_operations",9,"9.2","Matrix Operations","Addition/subtraction: corresponding elements. Same order required.","Add corresponding elements. Subtraction is similar.","[[1,2],[3,4]] + [[5,6],[7,8]] = [[6,8],[10,12]].","Trying to add different-order matrices.","Same order required for +/−.","Matrix +/− applies element-wise."),
  T("icse10_ch9_matrix_multiplication",9,"9.3","Matrix Multiplication","A (m×n) × B (n×p) = C (m×p). Element c_ij = sum of A_ik × B_kj.","Multiply rows by columns. Inner dimensions must match.","[[1,2]] × [[3],[4]] = [[1×3 + 2×4]] = [[11]].","Adding instead of multiplying.","Number of columns of A = rows of B.","Matrix × matrix: row × column dot product."),
  T("icse10_ch9_matrix_determinant",9,"9.4","Determinants (2×2)","For [[a,b],[c,d]], det = ad − bc.","Cross-multiply: ad − bc.","det([[1,2],[3,4]]) = 4 − 6 = −2.","Sign mistake (bc, not cb).","ad − bc, not bd − ac.","2×2 determinant: ad − bc."),

  // Ch 10: Arithmetic Progression
  T("icse10_ch10_ap_intro",10,"10.1","AP — Introduction","Arithmetic Progression: each term = previous + common difference d.","Find a (first term) and d (common diff). Sequence: a, a+d, a+2d, ...","2, 5, 8, 11: a=2, d=3.","Mixing AP with GP.","Constant difference = AP.","AP: constant difference between consecutive terms."),
  T("icse10_ch10_ap_nth_term",10,"10.2","nth Term of AP","Tn = a + (n−1)d.","Substitute n. Solve for term.","AP 2,5,8,...; T₁₀ = 2 + 9×3 = 29.","Off-by-one error (using n instead of n−1).","Tn = a + (n−1)d, not nd.","Direct formula for any term."),
  T("icse10_ch10_ap_sum",10,"10.3","Sum of n Terms","Sn = n/2 × (2a + (n−1)d) = n/2 × (a + l), where l = last term.","Use either form. Substitute.","AP 2,5,8,...; S₁₀ = 10/2 × (4 + 27) = 155.","Confusing first form and second form.","Both forms give same answer.","Sum of AP: arithmetic-mean × count."),
  T("icse10_ch10_ap_applications",10,"10.4","AP Applications","Real-life: savings, salaries, distances increasing/decreasing.","Identify a, d. Apply nth or sum formula.","Salary ₹10000 increasing by ₹500/year: 5th year salary = 10000 + 4×500 = ₹12000.","Forgetting to identify a and d carefully.","AP context: linear growth.","AP solves linear-growth real problems."),

  // Ch 11: Geometric Progression
  T("icse10_ch11_gp_intro",11,"11.1","GP — Introduction","Geometric Progression: each term = previous × common ratio r.","Find a (first term) and r (ratio).","2, 6, 18, 54: a=2, r=3.","Confusing AP and GP.","Constant ratio = GP.","GP: constant ratio between consecutive terms."),
  T("icse10_ch11_gp_nth_term",11,"11.2","nth Term of GP","Tn = a × r^(n−1).","Substitute a, r, n.","GP 2,6,18,...; T₅ = 2 × 3^4 = 162.","Using r^n instead of r^(n−1).","Exponent is n−1.","nth term: a × r^(n−1)."),
  T("icse10_ch11_gp_sum",11,"11.3","Sum of GP","Sn = a(r^n − 1)/(r − 1) for r ≠ 1.","Apply formula. For r=1, Sn = na.","GP 2,6,18,54: S₄ = 2(81−1)/(3−1) = 80.","Forgetting r = 1 special case.","Watch for r = 1.","GP sum requires r ≠ 1 case."),
  T("icse10_ch11_gp_applications",11,"11.4","GP Applications","Compound interest, population growth, bacterial growth.","Identify multiplicative pattern. Apply formulas.","Amount doubles every year. Initial ₹1000. After 5 years: 1000 × 2^5 = ₹32000.","Mixing simple and compound interest.","Compound interest = GP.","GP models exponential growth."),

  // ══════════════════════════════════════════════════
  // UNIT 3: CO-ORDINATE GEOMETRY
  // ══════════════════════════════════════════════════
  // Ch 12: Reflection
  T("icse10_ch12_reflection_x_axis",12,"12.1","Reflection in x-axis","Point (a, b) reflects to (a, −b).","Keep x, negate y.","(3, 4) → (3, −4).","Reflecting both coordinates.","Only y changes.","x-axis reflection: y flips sign."),
  T("icse10_ch12_reflection_y_axis",12,"12.2","Reflection in y-axis","Point (a, b) reflects to (−a, b).","Keep y, negate x.","(3, 4) → (−3, 4).","Mixing x and y rules.","Only x changes for y-axis.","y-axis reflection: x flips sign."),
  T("icse10_ch12_reflection_origin",12,"12.3","Reflection in Origin","Point (a, b) reflects to (−a, −b).","Negate both x and y.","(3, 4) → (−3, −4).","Reflecting only x or only y.","Both coordinates flip.","Origin reflection: both signs flip."),
  T("icse10_ch12_invariant_points",12,"12.4","Invariant Points","Points unchanged under reflection.","x-axis: y = 0 (point on x-axis itself). y-axis: x = 0. Origin: only (0,0).","(5, 0) is invariant under x-axis reflection.","Forgetting which axis vs which invariant.","Points ON the axis are invariant.","Invariant points lie on the line of reflection."),

  // Ch 13: Section and Mid-Point Formula
  T("icse10_ch13_section_formula",13,"13.1","Section Formula","Point P divides AB in ratio m:n: P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n)).","Apply formula. Watch ratio order.","A(1,2), B(4,8), m:n = 1:2 → P = ((4+2)/3, (8+4)/3) = (2, 4).","Swapping order of x₁, x₂.","Order matters: m·B + n·A.","Section formula divides line in given ratio."),
  T("icse10_ch13_midpoint",13,"13.2","Mid-point Formula","M = ((x₁+x₂)/2, (y₁+y₂)/2).","Average each coordinate.","A(2,4), B(6,8) → M = (4, 6).","Subtracting instead of averaging.","Average of coordinates.","Mid-point: average of endpoint coordinates."),
  T("icse10_ch13_dividing_line",13,"13.3","Dividing a Line","Find specific division points (like trisection, quartering).","Apply section formula with specific ratios.","Trisect A(0,0) to B(9,9): points at 1:2 and 2:1.","Ratio confusion.","1:2 means first point closer to A.","Section formula gives any division point."),
  T("icse10_ch13_section_applications",13,"13.4","Section Applications","Find ratio in which a line is divided by a point.","Set up section formula. Solve for ratio.","P(3,4) divides A(1,2)-B(5,6). Find ratio. 3 = (m×5+n×1)/(m+n) → 3m+3n = 5m+n → 2n = 2m → m:n = 1:1.","Setting up wrong direction.","Solve for m:n.","Find ratio from section formula reversed."),

  // Ch 14: Equation of a Line
  T("icse10_ch14_slope_intercept",14,"14.1","Slope-Intercept Form","y = mx + c, where m = slope, c = y-intercept.","Slope = rise/run = (y₂−y₁)/(x₂−x₁).","Line through (0,2) and (3,8): m = 2, c = 2. y = 2x + 2.","Confusing slope and intercept.","m is coefficient of x; c is constant.","y = mx + c: slope m, y-intercept c."),
  T("icse10_ch14_two_point_form",14,"14.2","Two-Point Form","Through (x₁,y₁), (x₂,y₂): (y−y₁)/(x−x₁) = (y₂−y₁)/(x₂−x₁).","Substitute two points. Simplify.","Through (1,2) and (3,8): (y−2)/(x−1) = 6/2 = 3 → y = 3x − 1.","Swapping x and y differences.","Match y diff / x diff.","Two points uniquely determine a line."),
  T("icse10_ch14_parallel_perpendicular",14,"14.3","Parallel & Perpendicular Lines","Parallel: same slope. Perpendicular: m₁ × m₂ = −1.","Compare slopes.","y = 2x+1 and y = 2x+5 are parallel. y = 2x+1 and y = −x/2+3 are perpendicular.","Forgetting negative sign.","Product = −1 for perpendicular.","Slope relations determine parallel/perp."),
  T("icse10_ch14_line_problems",14,"14.4","Equation of a Line Problems","Find line equations given conditions: through point, parallel/perp to another.","Use slope condition + point.","Line through (2,3) parallel to y = 4x+1: m=4, then y−3 = 4(x−2) → y = 4x−5.","Forgetting point-slope form.","Point-slope form: y − y₁ = m(x − x₁).","Apply known slope + point to find equation."),

  // ══════════════════════════════════════════════════
  // UNIT 4: GEOMETRY
  // ══════════════════════════════════════════════════
  // Ch 15: Similarity
  T("icse10_ch15_similarity_intro",15,"15.1","Similarity — Introduction","Similar figures: same shape, different size. Corresponding angles equal, sides proportional.","Test by AA, SAS, SSS similarity criteria.","Two triangles with angles 60°, 70°, 50° are similar.","Confusing similar with congruent.","Same shape ≠ same size.","Similar shapes scale proportionally."),
  T("icse10_ch15_similar_triangles",15,"15.2","Similar Triangles","AA: 2 angles equal. SAS: 2 sides proportional + included angle. SSS: 3 sides proportional.","Apply criterion. Then write ratio.","Triangles ABC ~ DEF: AB/DE = BC/EF = CA/FD.","Mismatching corresponding sides.","Match by angle/order.","Three criteria establish similarity."),
  T("icse10_ch15_maps_models",15,"15.3","Maps and Models","Scale: ratio between model and real. Used for maps, blueprints.","Scale 1:k means 1 unit model = k units real. Areas scale by k², volumes by k³.","Map scale 1:1000. 5 cm on map = 5000 cm = 50 m real.","Forgetting area scales by k².","Linear k, area k², volume k³.","Map/model scales: powers for area/volume."),
  T("icse10_ch15_area_ratio",15,"15.4","Area Ratio of Similar Figures","Ratio of areas = (ratio of sides)².","If sides ratio is k, areas ratio is k².","Sides 3:5 → areas 9:25.","Treating area ratio same as side ratio.","Areas scale by square.","Area ratio = (side ratio)²."),

  // Ch 16: Loci
  T("icse10_ch16_locus_intro",16,"16.1","Locus — Introduction","Locus: path traced by a point satisfying a condition.","Describe geometrically: line, circle, etc.","Locus of points equidistant from A and B: perpendicular bisector of AB.","Confusing locus with single point.","Locus is set of all such points.","Locus is geometric set."),
  T("icse10_ch16_perpendicular_bisector_locus",16,"16.2","Perpendicular Bisector Locus","Locus of points equidistant from A and B = perpendicular bisector of AB.","Find midpoint, draw perpendicular.","Equidistant from (0,0) and (4,0): perpendicular at x=2.","Forgetting it's a line (not just one point).","Whole line of equidistant points.","Perpendicular bisector = equidistant locus."),
  T("icse10_ch16_angle_bisector_locus",16,"16.3","Angle Bisector Locus","Locus of points equidistant from two intersecting lines = angle bisector.","Bisect the angle between two lines.","Equidistant from y=0 and x=0: lines y=x and y=−x.","Confusing with perpendicular bisector.","Two intersecting lines have two angle bisectors.","Angle bisector = equidistant from two lines."),
  T("icse10_ch16_circle_locus",16,"16.4","Circle as Locus","Locus of points at fixed distance from a center = circle.","Identify center and radius.","Locus at distance 5 from (0,0): x² + y² = 25.","Forgetting r² in equation.","Standard circle equation (x−h)² + (y−k)² = r².","Circle = constant-distance locus."),

  // Ch 17: Circles
  T("icse10_ch17_chord_properties",17,"17.1","Chord Properties","Perpendicular from center bisects chord. Equal chords are equidistant from center.","Apply properties to find lengths/distances.","Chord length 8, distance from center 3: radius = √(16+9) = 5.","Mixing radius and chord.","Perpendicular bisects chord.","Chord properties relate length, distance, radius."),
  T("icse10_ch17_arcs_angles",17,"17.2","Arcs and Angles","Angle at center = 2 × angle at circumference (subtending same arc).","Apply theorem.","Angle at center = 80° → angle at circumference = 40°.","Using same angle for both.","Center angle = 2 × circumference angle.","Inscribed angle theorem."),
  T("icse10_ch17_cyclic_quadrilateral",17,"17.3","Cyclic Quadrilateral","Opposite angles of cyclic quadrilateral sum to 180°.","Apply property.","Cyclic quad has angle 70° → opposite = 110°.","Forgetting opposites.","Opposite angles supplementary.","Cyclic quad property: opp angles supplementary."),
  T("icse10_ch17_circle_theorems",17,"17.4","Circle Theorems","Angles in same segment equal. Angle in semicircle = 90°.","Identify segment. Apply theorem.","Angle in semicircle = 90° (Thales' theorem).","Mixing alternate segments.","Same segment → equal angles.","Multiple theorems for angles in circles."),

  // Ch 18: Tangents and Intersecting Chords
  T("icse10_ch18_tangent_properties",18,"18.1","Tangent Properties","Tangent at any point is perpendicular to radius at that point.","Apply perpendicularity.","Radius 5, tangent length 12: distance from center = 13.","Confusing chord and tangent.","Tangent touches at exactly one point.","Tangent ⊥ radius at point of tangency."),
  T("icse10_ch18_two_tangents",18,"18.2","Two Tangents from External Point","Tangents from external point are equal in length.","Apply equal-length property.","From point P, tangents PA and PB are equal.","Confusing tangent and secant.","External point gives 2 equal tangents.","Equal tangents from external point."),
  T("icse10_ch18_intersecting_chords",18,"18.3","Intersecting Chords","If two chords intersect inside circle: PA × PB = PC × PD.","Apply chord-chord theorem.","Chord segments 3, 4 and x, 2: 3×4 = x×2 → x = 6.","Mixing chord and secant theorems.","Inside intersection: product equality.","Intersecting chord theorem."),
  T("icse10_ch18_alternate_segment",18,"18.4","Alternate Segment Theorem","Angle between tangent and chord = angle in alternate segment.","Identify tangent, chord, and segments.","Tangent-chord angle 50° = angle in alternate segment.","Confusing alternate and same segment.","Alternate, not same.","Tangent-chord angle = alternate segment angle."),

  // Ch 19: Constructions
  T("icse10_ch19_construct_tangent",19,"19.1","Constructing Tangents","Draw tangent from external point to circle.","Steps: draw line from point to center, find midpoint, draw circle on this as diameter, intersect with original circle.","Construct tangent from P (5 cm from center) to circle of radius 3 cm.","Skipping construction lines.","Use only ruler + compass.","Tangent construction with midpoint circle."),
  T("icse10_ch19_construct_circumscribe",19,"19.2","Circumscribing Circle","Construct circle passing through 3 vertices of a triangle (circumcircle).","Find perpendicular bisectors of two sides. Intersection = circumcenter.","Circumcircle through (0,0), (4,0), (4,3): use perp bisectors.","Confusing circumcircle and incircle.","Perpendicular bisectors → circumcenter.","Circumcircle: through all vertices."),
  T("icse10_ch19_construct_inscribe",19,"19.3","Inscribing Circle","Construct circle inside triangle touching all sides (incircle).","Find angle bisectors. Intersection = incenter.","Incircle of triangle with sides 3,4,5.","Confusing incircle and circumcircle.","Angle bisectors → incenter.","Incircle: touches all sides from inside."),
  T("icse10_ch19_construct_problems",19,"19.4","Construction Problems","Combined: tangents, incircles, circumcircles, perpendiculars.","Identify what to construct. Apply steps.","Construct circle of radius 3 with 2 tangents from point 5 cm from center.","Skipping steps.","Show all construction arcs.","Multi-step constructions combine basics."),

  // ══════════════════════════════════════════════════
  // UNIT 5: MENSURATION
  // ══════════════════════════════════════════════════
  // Ch 20: Cylinder, Cone and Sphere
  T("icse10_ch20_cylinder_volume",20,"20.1","Cylinder — Surface Area & Volume","Volume = πr²h. Curved surface = 2πrh. Total surface = 2πr(r+h).","Substitute r, h.","r=7, h=10: V = π×49×10 = 1540, CSA = 2π×7×10 = 440.","Confusing CSA and TSA.","TSA includes top + bottom circles.","Cylinder: V=πr²h, surfaces use 2πr."),
  T("icse10_ch20_cone_surface",20,"20.2","Cone — Surface Area & Volume","Volume = ⅓πr²h. Curved surface = πrl, where l = slant height = √(r²+h²). TSA = πr(r+l).","Find l first.","r=3, h=4: l=5, V = ⅓×π×9×4 = 12π.","Using h instead of l for CSA.","Slant height for curved surface.","Cone: ⅓πr²h volume; πrl curved surface."),
  T("icse10_ch20_sphere_area",20,"20.3","Sphere — Surface Area & Volume","Sphere: V = (4/3)πr³. Surface area = 4πr².","Substitute r.","r=7: V = (4/3)π×343 = 1437.33π, A = 4π×49 = 196π.","Mixing r² and r³.","Volume uses r³, area uses r².","Sphere: V=4/3πr³, A=4πr²."),
  T("icse10_ch20_combined_solids",20,"20.4","Combined Solids","Cylinder + cone, hemisphere + cylinder, etc.","Add component volumes/surfaces. Mind shared faces.","Hemisphere on cylinder: V = πr²h + (2/3)πr³.","Double-counting shared surfaces.","Subtract shared circle when adding surfaces.","Combine by adding (mind shared parts)."),

  // ══════════════════════════════════════════════════
  // UNIT 6: TRIGONOMETRY
  // ══════════════════════════════════════════════════
  // Ch 21: Trigonometric Identities
  T("icse10_ch21_basic_identities",21,"21.1","Basic Trig Identities","sin²θ + cos²θ = 1. 1 + tan²θ = sec²θ. 1 + cot²θ = cosec²θ.","Apply directly.","If sin θ = 3/5, then cos θ = 4/5 (using identity).","Mixing sin² and sin θ².","sin²θ = (sin θ)².","Three fundamental Pythagorean identities."),
  T("icse10_ch21_complementary_angles",21,"21.2","Complementary Angle Ratios","sin(90°−θ) = cos θ. cos(90°−θ) = sin θ. tan(90°−θ) = cot θ.","Swap sin↔cos, tan↔cot.","sin 30° = cos 60°.","Forgetting tan↔cot.","Pairs: (sin,cos), (tan,cot), (sec,cosec).","Complementary swaps trig pairs."),
  T("icse10_ch21_trig_tables",21,"21.3","Four-Figure Trig Tables","Pre-computed sin, cos, tan values to 4 decimal places.","Look up value. Interpolate if needed.","sin 25° from table = 0.4226.","Forgetting to interpolate.","Difference method for between-values.","Tables give precise trig values."),
  T("icse10_ch21_identity_proofs",21,"21.4","Proving Trig Identities","Manipulate LHS to equal RHS using identities.","Use Pythagorean identities. Simplify step by step.","Prove: (1−cos θ)/sin θ = sin θ/(1+cos θ). Multiply both sides by (1+cos θ).","Skipping algebraic justification.","Show all steps.","Trig proofs use identities + algebra."),

  // Ch 22: Heights and Distances
  T("icse10_ch22_angle_elevation",22,"22.1","Angle of Elevation","Angle above horizontal to look up at an object.","Identify horizontal, height. Apply tan.","From 100 m away, top of building at 30° elevation: height = 100×tan 30°.","Confusing elevation with depression.","Looking UP = elevation.","Elevation: looking upward angle."),
  T("icse10_ch22_angle_depression",22,"22.2","Angle of Depression","Angle below horizontal to look down at an object.","Same triangle as elevation; angle marked from horizontal downward.","From cliff top 50 m high, boat at 30° depression: distance = 50/tan 30°.","Confusing with elevation.","Looking DOWN = depression.","Depression: looking downward angle."),
  T("icse10_ch22_height_problems",22,"22.3","Height Problems","Use trig to find heights of objects.","Identify triangle. Apply trig.","Tree 20 m tall casts shadow 10 m: angle of elevation of sun = arctan(20/10) = arctan 2.","Mixing opposite and adjacent.","Identify what's opposite the angle.","Tan = opposite / adjacent.","Height problems use tan."),
  T("icse10_ch22_distance_problems",22,"22.4","Distance Problems","Use trig to find horizontal distances.","Apply tan or cos.","Building 30 m tall, angle of elevation from boat 45°: distance = 30 m (tan 45° = 1).","Forgetting tan 45° = 1.","tan 45° = 1, tan 30° = 1/√3, tan 60° = √3.","Distance problems also use tan."),

  // ══════════════════════════════════════════════════
  // UNIT 7: STATISTICS
  // ══════════════════════════════════════════════════
  // Ch 23: Graphical Representation
  T("icse10_ch23_histograms",23,"23.1","Histograms","Bar graph for continuous data. Bars touch, equal class widths.","Mark class intervals on x, frequency on y. Draw bars.","Class 0-10 freq 5, 10-20 freq 8, etc.","Confusing histogram with bar chart.","Continuous data, touching bars.","Histograms: continuous data graph."),
  T("icse10_ch23_frequency_polygon",23,"23.2","Frequency Polygon","Line graph connecting midpoints of histogram bar tops.","Find midpoints, plot vs frequency, connect.","Midpoints of 0-10, 10-20: 5, 15. Plot vs frequencies.","Plotting class boundaries instead of midpoints.","Use midpoints.","Frequency polygon connects midpoint frequencies."),
  T("icse10_ch23_ogives",23,"23.3","Ogives","Cumulative frequency curve. Less-than and more-than types.","Compute cumulative freq. Plot vs upper class limit (less-than) or lower (more-than).","Cumulative freq: 5, 13, 25, 30 for upper limits 10, 20, 30, 40.","Plotting class midpoint instead of boundary.","Use class boundary (not midpoint).","Ogives show cumulative frequency."),
  T("icse10_ch23_comparison_graphs",23,"23.4","Graph Comparison","Compare distributions visually using graphs.","Look at peaks, spread, skewness.","Two histograms of test scores: which class did better? Compare peaks.","Confusing peak with mean.","Look at center AND spread.","Visual comparison reveals patterns."),

  // Ch 24: Measures of Central Tendency
  T("icse10_ch24_mean",24,"24.1","Mean","Sum of all values divided by count. For grouped data: Σ(f×x) / Σf.","Add values, divide by count.","Data 2,4,6,8: mean = 20/4 = 5.","Forgetting to divide.","Mean = average.","Mean: arithmetic average."),
  T("icse10_ch24_median",24,"24.2","Median","Middle value in sorted data.","Sort. For odd n: middle. For even n: average of two middles.","Data 1,3,5,7,9: median = 5. Data 1,3,5,7: median = (3+5)/2 = 4.","Not sorting first.","Sort before finding median.","Median: middle of sorted data."),
  T("icse10_ch24_mode",24,"24.3","Mode","Most frequent value.","Find most repeated.","Data 1,2,2,3,4: mode = 2.","Data with no repeats has no mode.","Most frequent value.","Mode: most common value."),
  T("icse10_ch24_quartiles",24,"24.4","Quartiles","Q1: 25th percentile. Q2: median. Q3: 75th percentile.","Find Q1, Q2, Q3 by sorting and dividing into 4 parts.","Data 1,2,3,4,5,6,7,8: Q1=2.5, Q2=4.5, Q3=6.5.","Confusing quartiles with quarters.","Q1 = first quarter point.","Quartiles split data into 4 equal parts."),

  // Ch 25: Probability
  T("icse10_ch25_probability_intro",25,"25.1","Probability — Introduction","P(event) = favorable outcomes / total outcomes. 0 ≤ P ≤ 1.","Count favorable and total. Divide.","Coin toss: P(head) = 1/2.","Computing probability > 1.","Always between 0 and 1.","Probability: chance of event."),
  T("icse10_ch25_simple_events",25,"25.2","Simple Events","Single events: coin toss, die roll, card draw.","Identify favorable and total outcomes.","Die roll: P(even) = 3/6 = 1/2.","Counting outcomes wrong.","Be exact about sample space.","Simple events: single random act."),
  T("icse10_ch25_compound_events",25,"25.3","Compound Events","Multiple events: 'and', 'or'. AND multiplies (independent), OR adds (mutually exclusive).","Distinguish AND vs OR. Apply rule.","Two coins, P(both heads) = 1/2 × 1/2 = 1/4.","Adding when multiply needed.","AND = ×, OR = +.","Compound events use AND/OR rules."),
  T("icse10_ch25_probability_problems",25,"25.4","Probability Problems","Cards, dice, balls problems.","Identify sample space. Count favorable.","Draw 1 card from 52: P(spade) = 13/52 = 1/4.","Forgetting total = 52 for cards.","52 cards, 4 suits of 13.","Probability problems require careful counting."),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Seeding ${topics.length} ICSE Class 10 Math sub-topics...`);
  for (const t of topics) {
    // model uses 'name' field, but we keep 'title' for v2 consistency; also add 'name' for safety
    await NcertTopicContent.findOneAndUpdate(
      { topicId: t.topicId },
      { ...t, name: t.title, chapterNumber: t.chapterNumber },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${topics.length} ICSE Class 10 Math sub-topics.`);
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
