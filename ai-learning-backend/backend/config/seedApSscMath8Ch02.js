/**
 * AP SSC Class 8 Mathematics — Chapter 2: Linear Equations in One Variable
 * 4 topics. topicId: ap_ssc_math8_ch2_* · board AP_SSC · grade 8.
 * Usage: node config/seedApSscMath8Ch02.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  {
    topicId: "ap_ssc_math8_ch2_solving_simple",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Solving Simple Linear Equations",
    prerequisite_knowledge: [
      "Meaning of a variable and an algebraic expression",
      "The four operations on integers and fractions",
      "Idea of an equation as a balance (LHS = RHS)",
      "Inverse operations (+ undoes −, × undoes ÷)",
    ],
    key_formulas: [
      "A linear equation in one variable has the form ax + b = c (a ≠ 0)",
      "Do the SAME operation to both sides to keep the balance",
      "Transposing a term flips its sign: ax + b = c ⟹ ax = c − b",
      "x = (c − b)/a",
    ],
    teaching_content: {
      intuition: "An equation is a balance scale: whatever is on the left weighs exactly the same as the right. To find the unknown, you peel away everything stuck to it — but every time you remove weight from one pan you must remove the same from the other, or the scale tips. Solving is just 'undoing' the operations around x, in reverse order.",
      derivation: "Start from ax + b = c. The goal is to isolate x.\n1. Remove the +b by subtracting b from BOTH sides: ax + b − b = c − b ⟹ ax = c − b.\n2. Remove the ×a by dividing BOTH sides by a: (ax)/a = (c − b)/a ⟹ x = (c − b)/a.\nThe shortcut 'transposing' is just this: a term moved across the = sign changes its operation to the inverse (+b becomes −b; ×a becomes ÷a).",
      worked_example: "Solve 3x + 5 = 20.\n\nSubtract 5 from both sides: 3x = 15.\nDivide both sides by 3: x = 5.\n\nCheck (always substitute back): 3(5) + 5 = 15 + 5 = 20 = RHS. ✓",
      visual_description: "A balance scale: left pan holds '3x + 5', right pan holds '20', level. Step 1 removes five unit-weights from both pans (now 3x vs 15). Step 2 splits each pan into 3 equal groups, showing one x equals 5 units.",
      svg_diagrams: [
        { title: "Equation as a balance: 3x + 5 = 20",
          svg_code: "<svg viewBox='0 0 320 110' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='13'><line x1='40' y1='40' x2='280' y2='40' stroke='#333' stroke-width='3'/><line x1='160' y1='35' x2='160' y2='95' stroke='#333' stroke-width='3'/><rect x='70' y='15' width='90' height='24' fill='#dbeafe' stroke='#2563eb'/><text x='85' y='32'>3x + 5</text><rect x='190' y='15' width='70' height='24' fill='#dcfce7' stroke='#16a34a'/><text x='215' y='32'>20</text><text x='120' y='108' font-size='11' fill='#555'>−5 from both → 3x = 15 → x = 5</text></svg>" }
      ],
      common_misconceptions: [
        "Doing an operation to only ONE side — the balance breaks and the answer is wrong.",
        "Forgetting to change the sign when transposing: moving +5 across becomes −5, not +5.",
        "Dividing only part of a side: in 3x = 15, both the 3x and the 15 are divided by 3.",
        "Not checking the answer by substitution — a 10-second check catches most slips.",
      ],
      shortcuts_and_tricks: [
        "Transpose constants first to get ax = number, then divide by a.",
        "Always substitute your answer back into the ORIGINAL equation to verify.",
        "If the coefficient is a fraction, multiply both sides by its reciprocal in one move.",
      ],
      when_to_use_this_method: "Use balancing/transposing for any equation with the variable on one side only. When the variable appears on both sides or inside fractions, first gather terms (next topics).",
      edge_cases: [
        "If a = 0 the equation isn't linear in x (it's just b = c — either always true or never).",
        "Negative solutions are fine: 2x + 9 = 3 gives x = −3.",
        "Fractional solutions are fine: 2x = 3 gives x = 3/2.",
      ],
      key_takeaway: "Isolate x by doing the same inverse operation to both sides (or transpose terms, flipping their sign). Constants first, then divide by the coefficient. Always check by substitution.",
      video_script_hooks: [
        "Opening: 'An equation is a see-saw. Keep it level and it tells you its secret — the value of x.'",
        "Mid: 'Transposing looks like magic — a term hops the = sign and changes sign. It's just subtracting from both sides, sped up.'",
        "Closing: 'Found x? Don't trust it — substitute it back. If both sides match, you've won.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch2_variable_both_sides",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Variables on Both Sides",
    prerequisite_knowledge: [
      "Solving simple linear equations by transposing",
      "Combining like terms",
      "Adding/subtracting the same expression from both sides",
      "Sign rules for integers",
    ],
    key_formulas: [
      "Gather all variable terms on one side, all constants on the other",
      "ax + b = cx + d ⟹ (a − c)x = d − b ⟹ x = (d − b)/(a − c)",
      "Transpose the smaller coefficient of x to keep it positive (optional but tidy)",
    ],
    teaching_content: {
      intuition: "Now the unknown appears on BOTH pans of the balance. The plan is the same — but first you sweep all the x's onto one side and all the plain numbers onto the other, then finish like a simple equation. Think of herding all the sheep (x's) into one pen and all the cows (numbers) into another.",
      derivation: "Take ax + b = cx + d.\n1. Subtract cx from both sides (transpose cx): ax − cx + b = d ⟹ (a−c)x + b = d.\n2. Subtract b from both sides: (a−c)x = d − b.\n3. Divide by (a−c): x = (d − b)/(a − c), valid when a ≠ c.\nIf a = c the x-terms cancel; the equation becomes b = d (no solution unless b actually equals d).",
      worked_example: "Solve 5x − 2 = 3x + 8.\n\nTranspose 3x to the left: 5x − 3x − 2 = 8 ⟹ 2x − 2 = 8.\nTranspose −2 to the right: 2x = 10.\nDivide by 2: x = 5.\n\nCheck: LHS 5(5) − 2 = 23; RHS 3(5) + 8 = 23. ✓",
      visual_description: "A balance with '5x − 2' on the left and '3x + 8' on the right. Three x-blocks slide from right to left (cancelling the 3x there), leaving 2x − 2 vs 8; then constants settle to give 2x = 10.",
      svg_diagrams: [
        { title: "Gathering variables: 5x − 2 = 3x + 8",
          svg_code: "<svg viewBox='0 0 320 80' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='13'><text x='20' y='30'>5x − 2 = 3x + 8</text><text x='20' y='52' fill='#2563eb'>→ 2x − 2 = 8</text><text x='160' y='52' fill='#16a34a'>→ 2x = 10 → x = 5</text></svg>" }
      ],
      common_misconceptions: [
        "Transposing an x-term but forgetting to change its sign (3x moved becomes −3x).",
        "Combining unlike terms: 5x and −2 cannot be added — only like terms (5x and 3x) combine.",
        "Dividing by (a−c) when a = c (the x-terms vanish; handle separately).",
        "Mixing up which side the constants vs variables end on — be systematic.",
      ],
      shortcuts_and_tricks: [
        "Move the smaller x-coefficient so the remaining x-coefficient stays positive — fewer sign errors.",
        "Do all the variable transpositions first, then all the constant transpositions.",
        "Sanity check: count x-terms — they should all end up on one side before you divide.",
      ],
      when_to_use_this_method: "Use whenever the variable shows up on both sides of the equals sign. After gathering, the problem reduces to a simple linear equation.",
      edge_cases: [
        "If the x-terms cancel and you get a true statement (e.g. 7 = 7), every value of x works (identity).",
        "If they cancel to a false statement (e.g. 7 = 3), there is NO solution.",
        "Negative and fractional answers are perfectly valid.",
      ],
      key_takeaway: "Sweep all variable terms to one side and all constants to the other (changing signs on transposition), combine like terms, then divide by the coefficient of x. Watch for the cancel-out cases (identity or no solution).",
      video_script_hooks: [
        "Opening: 'What if x is on BOTH sides of the scale? You herd them together first — then it's the same old game.'",
        "Mid: 'Every term that crosses the = sign flips its sign. Forget that, and your answer is doomed.'",
        "Closing: 'Sometimes the x's vanish entirely — and the equation either becomes always-true or never-true. Both are valid answers.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch2_reducing_to_linear",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Equations Reducible to Linear Form",
    prerequisite_knowledge: [
      "Solving equations with variables on both sides",
      "Cross-multiplication of fractions",
      "LCM of denominators to clear fractions",
      "Distributive law (removing brackets)",
    ],
    key_formulas: [
      "Cross-multiplication: (a x + b)/(c x + d) = m/n ⟹ n(ax + b) = m(cx + d)",
      "Clear fractions by multiplying every term by the LCM of denominators",
      "Expand brackets with the distributive law before transposing",
    ],
    teaching_content: {
      intuition: "Some equations don't LOOK linear — they hide x inside fractions or brackets. The trick is to clean them up: clear the denominators (multiply through) and open the brackets. Once the clutter is gone, a plain linear equation is left underneath, which you already know how to solve.",
      derivation: "Type 1 — fractions equal: (ax+b)/(cx+d) = m/n. Cross-multiply: n(ax+b) = m(cx+d). Expand both sides, gather x-terms, solve.\n\nType 2 — sum of fractions: e.g. x/2 + x/3 = 5. Multiply EVERY term by LCM(2,3)=6: 3x + 2x = 30 ⟹ 5x = 30 ⟹ x = 6.\n\nType 3 — brackets: e.g. 3(x−2) = 2(x+1). Distribute: 3x − 6 = 2x + 2; gather: x = 8.",
      worked_example: "Solve (x + 1)/(2x + 3) = 3/8.\n\nCross-multiply: 8(x + 1) = 3(2x + 3).\nExpand: 8x + 8 = 6x + 9.\nGather: 8x − 6x = 9 − 8 ⟹ 2x = 1 ⟹ x = 1/2.\n\nCheck: LHS (1/2 + 1)/(2·1/2 + 3) = (3/2)/(4) = 3/8 = RHS. ✓",
      visual_description: "Two stacked fractions with a diagonal cross-multiply arrow connecting numerator-to-denominator both ways, turning the proportion into a bracketed linear equation, which then expands into a plain line of terms.",
      svg_diagrams: [
        { title: "Cross-multiplication clears the fractions",
          svg_code: "<svg viewBox='0 0 300 90' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='13'><text x='20' y='30'>(x+1)/(2x+3) = 3/8</text><path d='M30 38 L150 60' stroke='#dc2626' stroke-dasharray='3 2'/><path d='M150 38 L30 60' stroke='#2563eb' stroke-dasharray='3 2'/><text x='20' y='80' fill='#16a34a'>8(x+1) = 3(2x+3)</text></svg>" }
      ],
      common_misconceptions: [
        "Multiplying only SOME terms by the LCM — every term must be multiplied.",
        "Cross-multiplying when there are MORE than two fractions (clear by LCM instead).",
        "Forgetting to distribute the multiplier across a bracket: 3(x−2) = 3x − 6, not 3x − 2.",
        "Sign errors when expanding a negative bracket: −2(x − 4) = −2x + 8.",
      ],
      shortcuts_and_tricks: [
        "Two fractions equal → cross-multiply. Several fractions added → multiply through by the LCM.",
        "Clear ALL denominators in one stroke using the LCM of every denominator present.",
        "Open brackets before transposing — fewer mistakes than juggling brackets across the = sign.",
      ],
      when_to_use_this_method: "Use when x appears in denominators (cross-multiply or LCM) or inside brackets (distribute) — reduce to a simple linear equation first, then solve as usual.",
      edge_cases: [
        "After cross-multiplying, check the solution doesn't make any original denominator zero (reject if it does).",
        "Some 'fraction' equations simplify to identities or contradictions — handle like the both-sides cases.",
      ],
      key_takeaway: "Equations with fractions or brackets aren't harder — just messier. Clear denominators (cross-multiply for two fractions, LCM for several) and expand brackets to expose a plain linear equation, then solve and check.",
      video_script_hooks: [
        "Opening: 'This equation has x trapped inside a fraction. Watch me set it free with one diagonal move.'",
        "Mid: 'Multiply every single term by the LCM — miss one, and the whole thing collapses.'",
        "Closing: 'Underneath every messy equation is a simple line waiting to be solved. Clear the clutter and there it is.'",
      ],
    },
  },
  {
    topicId: "ap_ssc_math8_ch2_word_problems",
    subject: "Mathematics",
    chapterNumber: 2,
    name: "Word Problems on Linear Equations",
    prerequisite_knowledge: [
      "Forming an expression from a verbal description",
      "Solving linear equations (all the above methods)",
      "Common contexts: ages, numbers, money, perimeter, ratios",
      "Translating 'more than', 'less than', 'twice', 'consecutive' into algebra",
    ],
    key_formulas: [
      "Let the unknown be x; translate each sentence into an equation",
      "Consecutive integers: x, x+1, x+2 …  ;  consecutive even/odd: x, x+2, x+4 …",
      "Two numbers in ratio a:b → write them as ax and bx",
      "Solve, then interpret/verify in the ORIGINAL words",
    ],
    teaching_content: {
      intuition: "A word problem is a story with one missing fact. Your job is translation — turn English into algebra. Name the unknown x, rewrite each clue as a relationship, and you'll have an equation. Solving it is the easy part; setting it up correctly is the skill.",
      derivation: "The reliable 4-step method:\n1. READ and decide what to call x (the quantity you're asked to find, or the smallest related one).\n2. EXPRESS every other quantity in terms of x.\n3. FORM the equation from the condition that ties them together.\n4. SOLVE, then translate the answer back and CHECK it against the story.",
      worked_example: "The sum of two consecutive odd numbers is 56. Find them.\n\nLet the smaller be x. The next odd number is x + 2.\nEquation: x + (x + 2) = 56 ⟹ 2x + 2 = 56 ⟹ 2x = 54 ⟹ x = 27.\nNumbers: 27 and 29.\n\nCheck: 27 + 29 = 56 ✓ and both are odd. ✓",
      visual_description: "A flow strip: 'Story' → 'Let x = …' → boxes expressing each quantity in x → 'Equation' → 'Solve' → 'Answer + check', with arrows showing the translation at each stage.",
      svg_diagrams: [
        { title: "Translate words → equation → answer",
          svg_code: "<svg viewBox='0 0 340 70' xmlns='http://www.w3.org/2000/svg' font-family='sans-serif' font-size='12'><rect x='10' y='20' width='70' height='28' fill='#fef9c3' stroke='#d97706'/><text x='22' y='38'>story</text><rect x='95' y='20' width='90' height='28' fill='#dbeafe' stroke='#2563eb'/><text x='102' y='38'>let x = …</text><rect x='200' y='20' width='60' height='28' fill='#dcfce7' stroke='#16a34a'/><text x='208' y='38'>equation</text><rect x='275' y='20' width='55' height='28' fill='#fde68a' stroke='#ca8a04'/><text x='283' y='38'>solve</text></svg>" }
      ],
      common_misconceptions: [
        "Mis-translating 'three less than twice x': it is 2x − 3, NOT 3 − 2x.",
        "Picking x as the wrong quantity, making the algebra needlessly hard.",
        "Forgetting to answer the actual question (e.g. asked for the larger number but reporting x = the smaller).",
        "Skipping the final check against the story — units or sense errors slip through.",
      ],
      shortcuts_and_tricks: [
        "Name x as the smallest unknown — other quantities then come out as x + something.",
        "For ratio problems a:b, write the quantities as ax and bx (one variable, not two).",
        "Underline the key relationship sentence — that's the one that becomes the equation.",
      ],
      when_to_use_this_method: "Use for any 'real-world' linear problem: ages, consecutive numbers, money/coins, perimeters, ratios, distance at constant relationships. The setup is universal; the equation type varies.",
      edge_cases: [
        "Reject answers that are impossible in context (e.g. a negative number of people, a fractional count).",
        "'Consecutive even' and 'consecutive odd' BOTH step by 2 (x, x+2), not by 1.",
        "If asked for multiple quantities, report all of them, not just x.",
      ],
      key_takeaway: "Translate the story into algebra: let x be the (smallest) unknown, express everything else in terms of x, form one equation from the key condition, solve, then convert back and check against the original words.",
      video_script_hooks: [
        "Opening: 'Word problems aren't a maths test — they're a translation test. English in, algebra out.'",
        "Mid: 'The hardest line is choosing what x stands for. Pick the smallest unknown and the rest falls into place.'",
        "Closing: 'You solved for x — but did you answer the question? Always translate back to what was actually asked.'",
      ],
    },
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  let n = 0;
  for (const t of TOPICS) { await NcertTopicContent.updateOne({ topicId: t.topicId }, { $set: t }, { upsert: true }); console.log(`  ✓ ${t.topicId}`); n++; }
  console.log(`\nAP SSC Math 8 Ch2 (Linear Equations): ${n} topics seeded.`);
  await mongoose.disconnect();
}
seed().catch((err) => { console.error(err); process.exit(1); });
