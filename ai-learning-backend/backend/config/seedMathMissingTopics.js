/**
 * Seed: CBSE Class 10 Mathematics — Missing Topics
 * Adds two topics absent from the DB:
 *   cbse_math10_ch5_arithmetic_mean_combined  — Arithmetic Mean of AP and combined sum + nth-term problems
 *   cbse_math10_ch13_empirical_relationship — Empirical relationship: Mode = 3Median − 2Mean
 *
 * Safe to re-run — upserts on topicId.
 *
 * Usage:
 *   cd ai-learning-backend/backend
 *   node config/seedMathMissingTopics.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const TOPICS = [
  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 5 — Arithmetic Progressions, Section 4
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "cbse_math10_ch5_arithmetic_mean_combined",
    subject: "Mathematics",
    chapterNumber: 5,
    name: "Arithmetic Mean and Combined AP Problems — Sum + nth Term Together",
    prerequisite_knowledge: [
      "nth term of AP: aₙ = a + (n−1)d",
      "Sum of n terms: Sₙ = n/2[2a + (n−1)d] = n/2[a + l]",
      "Given any 2 of a, d, n, aₙ — find the third",
    ],
    key_formulas: [
      "Arithmetic Mean (AM) of two numbers a and b: A = (a + b)/2",
      "If a, A, b are in AP: A − a = b − A → A = (a+b)/2",
      "Arithmetic mean of n terms of an AP = (a + l)/2 = middle term",
      "Property: Sum of kth term from start + kth term from end = a + l (first + last)",
      "Sₙ − Sₙ₋₁ = aₙ (difference of successive sums gives nth term)",
    ],
    teaching_content: {
      intuition: {
        elevator_pitch:
          "The arithmetic mean of an AP is just the middle term — and any term in an AP is the average of its two neighbours. This single idea unlocks a whole class of elegant AP problems where you choose the middle term as the unknown to halve the algebra.",
        hook:
          "If you place three numbers in AP: x−d, x, x+d — their sum is 3x (the d's cancel). Their mean is x. This is why choosing 'x' as the middle term is the golden trick for AP problems where the sum is given.",
        real_world_anchors: [
          "Salary increments in equal yearly rises — the average salary over the whole period is always the salary at the midpoint year.",
          "Race lap times: if a runner improves by equal seconds each lap, the average lap time equals the time at the middle lap.",
          "Temperature records over equidistant days forming an AP — the average is always the middle day's reading.",
        ],
        historical_context:
          "Gauss famously found the sum 1+2+…+100 = 5050 at age 9 by noticing pairs: 1+100=101, 2+99=101, …, 50+51=101 — 50 pairs × 101 = 5050. This is Sₙ = n/2(a+l) in disguise. The arithmetic mean of the sequence (50.5) × 100 terms = 5050.",
        why_it_matters:
          "Mean-based AP properties appear in CBSE board exam 3–4 mark questions almost every year. The 'assume middle term as a' technique cuts the number of equations needed by half.",
        wrong_intuitions_to_replace: [
          "Wrong: 'I must always use a and d as unknowns' — Right: for problems giving the sum of an odd number of terms, let the middle term be 'a' and common difference 'd'; sum = n × a (d cancels completely).",
          "Wrong: 'Sₙ gives the last term' — Right: Sₙ gives the total sum; aₙ = Sₙ − Sₙ₋₁ gives the nth term from cumulative sums.",
        ],
        analogy_from_other_domain:
          "Like finding the average height of students lined up in order of height: the average is always the height of the student standing in the exact middle of the line.",
      },
      derivation: {
        arithmetic_mean_proof:
          "If a, A, b are in AP: A − a = b − A (equal common difference). ∴ 2A = a + b ∴ A = (a+b)/2. This is why 'A is the arithmetic mean of a and b'.",
        mean_of_n_terms:
          "For an AP with n terms, first term a, last term l: Sum Sₙ = n/2(a + l). Mean = Sₙ/n = (a + l)/2 = average of first and last term. If n is odd, middle term = (n+1)/2 th term = a + (n−1)/2 × d = (a+l)/2 exactly.",
        sn_minus_sn1:
          "aₙ = Sₙ − Sₙ₋₁. Proof: Sₙ = a₁+a₂+…+aₙ; Sₙ₋₁ = a₁+…+aₙ₋₁. Difference = aₙ. Useful when Sₙ is given as a polynomial — differentiate (take difference) to get aₙ, then check if aₙ forms an AP.",
      },
      worked_example: {
        example_1_three_terms_sum_given: {
          problem:
            "The sum of three numbers in AP is 27 and their product is 648. Find the numbers.",
          steps: [
            {
              step_number: 1,
              action: "Choose middle-term substitution to exploit sum condition",
              computation: "Let three terms be (a−d), a, (a+d)",
            },
            {
              step_number: 2,
              action: "Apply sum condition",
              computation: "(a−d) + a + (a+d) = 27 → 3a = 27 → a = 9",
            },
            {
              step_number: 3,
              action: "Apply product condition",
              computation: "(9−d)(9)(9+d) = 648 → 9(81−d²) = 648 → 81−d² = 72 → d² = 9 → d = ±3",
            },
            {
              step_number: 4,
              action: "State both solutions",
              computation: "d=3: terms are 6, 9, 12 | d=−3: terms are 12, 9, 6 (same set, reversed)",
            },
          ],
          key_insight:
            "Middle-term trick: the 'd' cancelled in the sum equation immediately, giving 'a' in one step.",
        },
        example_2_sn_polynomial: {
          problem:
            "The sum of first n terms of an AP is given by Sₙ = 3n² + 5n. Find the AP and its common difference.",
          steps: [
            {
              step_number: 1,
              action: "Find a₁ from S₁",
              computation: "a₁ = S₁ = 3(1)² + 5(1) = 8",
            },
            {
              step_number: 2,
              action: "Find a₂ from S₂ − S₁",
              computation: "S₂ = 3(4)+5(2) = 22. a₂ = 22 − 8 = 14",
            },
            {
              step_number: 3,
              action: "Find general term using aₙ = Sₙ − Sₙ₋₁",
              computation:
                "aₙ = (3n²+5n) − [3(n−1)²+5(n−1)] = 3(2n−1)+5 = 6n−3+5 = 6n+2",
            },
            {
              step_number: 4,
              action: "Identify a and d",
              computation: "a₁ = 6(1)+2 = 8 ✓. d = a₂ − a₁ = 14 − 8 = 6. AP: 8, 14, 20, …",
            },
          ],
          key_insight:
            "aₙ = Sₙ − Sₙ₋₁ gives both the nth term and confirms the AP. Verify a₁ = S₁ always.",
        },
      },
      common_misconceptions: [
        {
          wrong_idea:
            "For five terms in AP, I must set up and solve two equations with a and d as unknowns.",
          correction:
            "Let the five terms be a−2d, a−d, a, a+d, a+2d. Sum = 5a. The d terms vanish — one equation gives a directly. Then use the product/second condition to find d.",
        },
        {
          wrong_idea:
            "S₁ = first term of an AP is always correct",
          correction:
            "S₁ = a₁ is correct ONLY when the AP formula gives Sₙ with S₀ = 0. Always verify: does the formula Sₙ give 0 when n = 0? If Sₙ = 3n²+5n, then S₀ = 0 ✓.",
        },
        {
          wrong_idea: "aₙ = Sₙ/n (dividing total sum by n)",
          correction:
            "aₙ (nth TERM) = Sₙ − Sₙ₋₁. The MEAN = Sₙ/n = (a+l)/2. Confusing the mean with the nth term is a common error.",
        },
      ],
      shortcuts_and_tricks: [
        {
          shortcut: "Assume middle term for odd-count sum problems",
          rule:
            "3 terms: (a−d), a, (a+d) → sum = 3a. 5 terms: sum = 5a. Always.",
          example:
            "Sum of 5 terms = 35 → 5a = 35 → a = 7. Middle term is 7.",
          when_to_use:
            "Any time: 'sum of n terms of an AP is given and n is ODD'.",
        },
        {
          shortcut: "Sum of equidistant terms from ends",
          rule:
            "For any AP: aₖ + aₙ₋ₖ₊₁ = a + l (first + last). Always constant.",
          example:
            "AP: 1,3,5,7,9. a₂ + a₄ = 3+7 = 10 = 1+9 = a₁+a₅ ✓",
          when_to_use:
            "When asked to prove or use the property of symmetric terms in an AP.",
        },
        {
          shortcut: "Sₙ polynomial → aₙ by differencing",
          rule: "aₙ = Sₙ − Sₙ₋₁. If Sₙ = An² + Bn, then aₙ = A(2n−1) + B.",
          example:
            "Sₙ = 3n²+5n → aₙ = 3(2n−1)+5 = 6n+2. Check: a₁=8=S₁ ✓.",
          when_to_use:
            "When Sₙ is given as a quadratic in n — immediately apply this formula.",
        },
      ],
      when_to_use_this_method: {
        use_middle_term_substitution_when:
          "Sum of 3, 5, or any odd number of terms is given. Middle-term trick eliminates d instantly.",
        use_sn_minus_sn1_when:
          "Sₙ is given as a polynomial or expression in n. Differencing gives aₙ in one step.",
        use_mean_formula_when:
          "Asked to find the average/mean of all terms of an AP — use (a+l)/2 or the middle term directly.",
        key_decision_question:
          "Is the sum given? → Use middle-term trick. Is Sₙ a polynomial? → Use Sₙ − Sₙ₋₁ to get aₙ.",
      },
      edge_cases: [
        "If d = 0: all terms are equal to a; sum = n·a; mean = a.",
        "n=1: S₁ = a₁ always — useful to verify Sₙ formula.",
        "Sₙ must satisfy S₀ = 0 for n = 0; if it doesn't, the formula applies only for n ≥ 1.",
        "When asked for how many terms give a particular sum: set up Sₙ = given value → quadratic in n → take only positive integer solutions.",
      ],
      key_takeaway:
        "Arithmetic mean of an AP = (first + last)/2 = middle term. For sum-of-odd-terms problems, let middle term be 'a' (d cancels in sum). aₙ = Sₙ − Sₙ₋₁ — use this when Sₙ is given as a polynomial. Sum of terms equidistant from the ends always equals first + last.",
      video_script_hooks: {
        opening_hook_5_sec:
          "Gauss summed 1 to 100 in seconds at age 9. The trick? The average times the count. Let me show you the pattern behind that trick.",
        closing_question:
          "The sum of 5 terms of an AP is 75 and the middle term is 15. Can you find the AP?",
        transition_to_practice:
          "Now try: if three terms are in AP with sum 18 and product 162, find all three terms.",
      },
    },
  },

  // ══════════════════════════════════════════════════════════════════
  // CHAPTER 13 — Statistics, Section 4
  // ══════════════════════════════════════════════════════════════════
  {
    topicId: "cbse_math10_ch13_empirical_relationship",
    subject: "Mathematics",
    chapterNumber: 13,
    name: "Empirical Relationship: Mode = 3 Median − 2 Mean",
    prerequisite_knowledge: [
      "Mean of grouped data (direct and assumed mean methods)",
      "Mode of grouped data (modal class formula)",
      "Median of grouped data (cumulative frequency formula)",
    ],
    key_formulas: [
      "Empirical formula: Mode = 3 × Median − 2 × Mean",
      "Rearrangements: Mean = (3 Median − Mode) / 2",
      "Rearrangements: Median = (Mode + 2 Mean) / 3",
      "For a perfectly symmetrical distribution: Mean = Median = Mode",
    ],
    teaching_content: {
      intuition: {
        elevator_pitch:
          "In most real-world data sets, the three averages — mean, median and mode — are not wildly different. They cluster together with a consistent spacing: the median sits about two-thirds of the way between the mean and mode. This is the empirical relationship, and it lets you find one average from the other two.",
        hook:
          "A student scored Mean = 70, Median = 72. Without calculating frequencies, what is the approximate Mode? Use Mode = 3×72 − 2×70 = 216 − 140 = 76. Done in 3 seconds.",
        real_world_anchors: [
          "House prices: mean is dragged up by a few luxury houses; mode = most common price; median lies between. The empirical formula relates all three.",
          "Exam scores: Mean < Median < Mode in a negatively skewed distribution (most students scored high).",
          "Rainfall data: extremely wet or dry years skew the mean; the mode and median remain stable.",
        ],
        historical_context:
          "Karl Pearson (1895) empirically observed that for moderately skewed distributions, the three measures of central tendency follow this approximate relationship. It is called 'empirical' (from experience) because it holds for most natural data but is not a mathematical theorem — it is an approximation.",
        why_it_matters:
          "CBSE board exams repeatedly ask you to find one of mean/median/mode given the other two. This formula converts a complex frequency-table calculation into a 2-line answer.",
        wrong_intuitions_to_replace: [
          "Wrong: 'This is an exact mathematical law' — Right: It is an empirical approximation valid for moderately skewed data. For perfectly symmetric distributions, all three are equal.",
          "Wrong: 'Mode = 3 Median − 2 Mean means mode is always the largest' — Right: For positively skewed data, Mean > Median > Mode; for negatively skewed, Mean < Median < Mode.",
        ],
        analogy_from_other_domain:
          "Like the relationship between temperature scales: they're not the same, but there's a consistent formula (F = 9/5 C + 32) that connects them. Similarly, this empirical formula connects the three central tendency measures.",
      },
      derivation: {
        pearson_empirical_observation:
          "For moderately asymmetrical (skewed) distributions, Karl Pearson observed: (Mean − Mode) ≈ 3(Mean − Median). Expanding: Mean − Mode = 3Mean − 3Median → Mode = 3Median − 2Mean. This holds when the distribution is unimodal and moderately skewed.",
        skewness_connection:
          "For symmetric distribution: Mean = Median = Mode. As distribution becomes skewed, the three separate. For moderate skew: the empirical formula gives a good approximation. For extreme skew (e.g. very long tail), the formula breaks down.",
      },
      worked_example: {
        example_1_find_mode: {
          problem:
            "For a frequency distribution, Mean = 54.5 and Median = 55.8. Find the Mode.",
          steps: [
            {
              step_number: 1,
              action: "Write the empirical formula",
              computation: "Mode = 3 × Median − 2 × Mean",
            },
            {
              step_number: 2,
              action: "Substitute known values",
              computation: "Mode = 3 × 55.8 − 2 × 54.5",
            },
            {
              step_number: 3,
              action: "Compute",
              computation: "Mode = 167.4 − 109.0 = 58.4",
            },
          ],
          key_insight:
            "Three substitutions and one subtraction. No need to recalculate the frequency table at all.",
        },
        example_2_find_median: {
          problem:
            "The mean and mode of a frequency distribution are 30 and 33 respectively. Find the median.",
          steps: [
            {
              step_number: 1,
              action: "Rearrange formula for Median",
              computation: "Median = (Mode + 2 × Mean) / 3",
            },
            {
              step_number: 2,
              action: "Substitute",
              computation: "Median = (33 + 2 × 30) / 3 = (33 + 60) / 3 = 93 / 3",
            },
            {
              step_number: 3,
              action: "Result",
              computation: "Median = 31",
            },
          ],
          key_insight:
            "The median (31) lies between mean (30) and mode (33), as expected for a positively skewed distribution.",
        },
        example_3_verification: {
          problem:
            "For a data set, Mean = 20, Median = 21, Mode = 23. Verify the empirical formula.",
          steps: [
            {
              step_number: 1,
              action: "Apply: Mode = 3 Median − 2 Mean",
              computation: "3 × 21 − 2 × 20 = 63 − 40 = 23",
            },
            {
              step_number: 2,
              action: "Compare with given mode",
              computation: "Calculated = 23, Given = 23 ✓",
            },
          ],
          key_insight:
            "The formula is exactly satisfied here — confirming a moderately skewed distribution.",
        },
      },
      common_misconceptions: [
        {
          wrong_idea:
            "Mode = 3 Median − 2 Mean is always exact",
          correction:
            "It is an empirical (observational) approximation valid for moderately skewed data. For perfectly symmetric data, Mean = Median = Mode and the formula trivially holds. For extremely skewed data, it may not be accurate.",
        },
        {
          wrong_idea: "The order is always Mean < Median < Mode",
          correction:
            "For positively skewed (right tail): Mean > Median > Mode. For negatively skewed (left tail): Mean < Median < Mode. The order depends on the direction of skew.",
        },
        {
          wrong_idea:
            "If I know Mean and Mode, I can get Median as (Mean + Mode)/2",
          correction:
            "That is wrong — Median = (Mode + 2 Mean)/3, NOT (Mean + Mode)/2. The formula has weight 2 on the mean and weight 1 on the mode.",
        },
      ],
      shortcuts_and_tricks: [
        {
          shortcut: "2-1-3 memory rule",
          rule:
            "Mode = 3 Median − 2 Mean. Weights: Mode gets no weight, Median gets 3, Mean gets −2. Alternatively: 'Mode = 3M − 2M' where the first M is Median and the second is Mean.",
          example:
            "Mean = 10, Median = 11 → Mode = 33 − 20 = 13.",
          when_to_use: "Whenever two of the three averages are given.",
        },
        {
          shortcut: "Rearrangement quick forms",
          rule:
            "Mean = (3 Median − Mode)/2. Median = (Mode + 2 Mean)/3.",
          example:
            "Mean = 20, Mode = 23 → Median = (23 + 40)/3 = 21.",
          when_to_use:
            "When Mode and Mean are given, find Median; or when Median and Mode are given, find Mean.",
        },
      ],
      when_to_use_this_method: {
        use_empirical_formula_when:
          "Two of the three central tendency measures are given and you need the third — shortcut avoids full frequency table calculation.",
        do_not_use_when:
          "Asked to calculate mean/median/mode from raw data — use the actual formulas (direct method, modal class formula, etc.).",
        key_decision_question:
          "Are 2 of the 3 averages already given? → Yes → Use empirical formula. No → Calculate from frequency distribution.",
      },
      edge_cases: [
        "Symmetric distribution: Mean = Median = Mode. Formula: Mode = 3M − 2M = M ✓.",
        "The formula may give a Mode outside the actual data range for heavily skewed distributions — flag this as approximate.",
        "If calculated Mode doesn't match the modal class calculation from the frequency table, both answers may differ slightly — empirical formula gives an approximation only.",
      ],
      key_takeaway:
        "Empirical formula: Mode = 3 × Median − 2 × Mean (Karl Pearson's approximation for moderately skewed data). Rearrange to find any of the three given the other two. For symmetric distributions, all three are equal. Order: positively skewed → Mean > Median > Mode; negatively skewed → Mean < Median < Mode.",
      video_script_hooks: {
        opening_hook_5_sec:
          "Mean = 54.5, Median = 55.8. What's the Mode? I'll show you how to find it in 3 seconds — no frequency table needed.",
        closing_question:
          "For a data set, Mean = 35 and Mode = 40. What is the Median? (Hint: rearrange the empirical formula.)",
        transition_to_practice:
          "Now use the formula both ways — given Mean & Median, find Mode; and given Mode & Mean, find Median.",
      },
    },
  },
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
  console.log(`\nMath missing topics: ${upserted} topics upserted`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
