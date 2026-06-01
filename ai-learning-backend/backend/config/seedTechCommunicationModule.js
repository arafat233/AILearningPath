/**
 * seedTechCommunicationModule.js — Pro Java M51 "Technical Communication" (ROADMAP J3)
 *
 * PR descriptions, code review, design docs, commit messages, asking good
 * questions. Entirely non-code — every exercise grades sandbox-free via
 * pattern_match (pick the best practice / spot the problem) or text_match.
 * No Judge0, no Claude.
 *
 * Idempotent. Usage: node config/seedTechCommunicationModule.js
 * npm: npm run seed:tech-communication
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";

const TRACK  = "pro_java";
const MOD_ID = "java_m51";

async function upsertModule() {
  return ProModule.findOneAndUpdate(
    { moduleId: MOD_ID },
    {
      trackKey: TRACK, moduleId: MOD_ID, moduleNumber: 51,
      name: "Technical Communication", slug: "technical-communication",
      description: "The writing that gets your code merged and your ideas adopted: clear PR descriptions, constructive code reviews, design docs, commit messages, and well-scoped questions. The highest-leverage non-coding skill in any engineering team.",
      estimatedHours: 3, prerequisites: ["java_m50"], status: "live",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

const TOPICS = [
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m51_t1", topicNumber: 1,
    name: "Writing Pull Request Descriptions", slug: "pr-descriptions",
    difficulty: 0.25, estimatedMinutes: 25, xpReward: 50, prerequisites: [], visualizer: null,
    metadata: { tags: ["pull-request", "review", "writing"], estimated_minutes: 25, difficulty: 1 },
    hook: "A reviewer decides how carefully to read your 400-line diff in the first 10 seconds — based entirely on your PR description. 'fixed stuff' gets a rubber-stamp or a pile-on; a clear description gets a real review.",
    teaching: { blocks: [
      { type: "paragraph", content: "A good PR description answers three questions before the reviewer reads any code: WHAT changed, WHY it changed, and HOW to verify it. The diff shows the what mechanically; your job is the why and the how." },
      { type: "list", content: "A reliable template:\n  ## What — one-line summary of the change\n  ## Why — the problem/ticket this solves (link it)\n  ## How — key implementation decisions a reviewer should know\n  ## Testing — how you verified it (and how the reviewer can)\n  ## Screenshots / output — when the change is visible" },
      { type: "paragraph", content: "Keep PRs small and single-purpose. A 1,000-line PR mixing a refactor + a feature + a formatting sweep is unreviewable; reviewers either rubber-stamp it (dangerous) or stall it (slow). Split by concern." },
    ] },
    commonGaps: { items: [
      "Titles like 'fix' or 'updates' — say what changed: 'Fix N+1 query in OrderService.list()'.",
      "Describing WHAT (the diff already shows that) but omitting WHY — the reviewer can't judge a change whose motivation is hidden.",
      "One giant PR mixing refactor + feature + formatting — split it so each PR has a single reviewable purpose.",
    ] },
    interviewRelevance: "Senior/staff interviews probe collaboration: 'how do you make your PRs easy to review?' A crisp what/why/how/testing answer signals you've worked on a real team.",
    industryApplications: { examples: [
      "Faster review cycles and fewer regressions when reviewers understand intent before reading code.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m51_t2", topicNumber: 2,
    name: "Code Review — Giving & Receiving", slug: "code-review",
    difficulty: 0.35, estimatedMinutes: 30, xpReward: 50, prerequisites: ["java_m51_t1"], visualizer: null,
    metadata: { tags: ["code-review", "feedback", "collaboration"], estimated_minutes: 30, difficulty: 2 },
    hook: "\"This is wrong.\" vs \"What happens here if `items` is empty?\" — same concern, opposite outcomes. One starts a fight; the other starts a fix.",
    teaching: { blocks: [
      { type: "paragraph", content: "Good review comments critique the CODE, not the person, and explain the WHY. Prefer questions and concrete suggestions over verdicts. 'Consider extracting this into a method — it's duplicated in 3 places' beats 'messy'." },
      { type: "list", content: "Conventions that reduce friction:\n  - Prefix non-blocking comments with 'nit:' (style/preference, won't block merge).\n  - Distinguish MUST-fix (correctness/security) from nice-to-have.\n  - Approve with comments when the only issues are nits — don't block on taste.\n  - Praise good code too; review isn't only fault-finding." },
      { type: "paragraph", content: "Receiving review: assume good intent, don't take it personally, and respond to every comment (fix it, or explain why not). 'Done' / 'Good catch' / 'I kept it because X' all close the loop. Silence leaves the reviewer guessing." },
    ] },
    commonGaps: { items: [
      "Verdict comments ('this is bad') instead of explaining the concern and suggesting a fix.",
      "Blocking a PR on personal style preferences — mark those as 'nit:' and approve.",
      "As the author: arguing defensively or ignoring comments instead of either fixing or explaining the trade-off.",
    ] },
    interviewRelevance: "'Tell me about a time you disagreed with a reviewer' is a standard behavioural question — they're checking you can hold a technical position without ego.",
    industryApplications: { examples: [
      "Review culture directly drives defect rate and team trust; nit-prefixing keeps velocity high.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m51_t3", topicNumber: 3,
    name: "Design Docs", slug: "design-docs",
    difficulty: 0.45, estimatedMinutes: 35, xpReward: 50, prerequisites: ["java_m51_t1"], visualizer: null,
    metadata: { tags: ["design-doc", "rfc", "architecture"], estimated_minutes: 35, difficulty: 3 },
    hook: "A design doc is cheap to change; code is expensive. Spending two pages and a day of review before building a two-week feature is the best ROI in engineering.",
    teaching: { blocks: [
      { type: "paragraph", content: "A design doc (a.k.a. RFC/one-pager) aligns a team BEFORE code is written. Its core job is to surface the problem, the options considered, the chosen approach, and the trade-offs — so reviewers can catch flaws while they're still cheap to fix." },
      { type: "list", content: "Typical sections:\n  Context / Problem — what and why now\n  Goals / Non-goals — scope boundaries (non-goals prevent scope creep)\n  Proposed design — the approach, with a diagram if it helps\n  Alternatives considered — options you rejected and WHY\n  Trade-offs / risks — what this costs; what could go wrong\n  Rollout / testing — how it ships and how you'll know it works" },
      { type: "paragraph", content: "The most-skipped, most-valuable sections are 'Alternatives considered' and 'Non-goals'. Alternatives prove you explored the space; non-goals stop reviewers from re-litigating things that are deliberately out of scope." },
    ] },
    commonGaps: { items: [
      "Jumping straight to the solution with no 'Alternatives considered' — reviewers can't tell if you explored the space.",
      "Omitting 'Non-goals', so every review devolves into debating out-of-scope features.",
      "Writing the doc AFTER building — a design doc's value is catching problems before the code exists.",
    ] },
    interviewRelevance: "System-design and staff-level interviews are essentially live design docs: state goals/non-goals, propose, name alternatives and trade-offs. The doc structure IS the interview rubric.",
    industryApplications: { examples: [
      "RFC process at most large eng orgs gates significant work; a one-pager prevents weeks of wrong-direction building.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m51_t4", topicNumber: 4,
    name: "Commit Messages", slug: "commit-messages",
    difficulty: 0.3, estimatedMinutes: 25, xpReward: 50, prerequisites: [], visualizer: null,
    metadata: { tags: ["git", "commit", "conventional-commits"], estimated_minutes: 25, difficulty: 1 },
    hook: "git log is the only documentation that's always up to date. 'wip', 'fix', 'asdf' throw that away; a good history lets you bisect a bug to one understandable change.",
    teaching: { blocks: [
      { type: "paragraph", content: "A commit message has a subject line (≤ ~50 chars, imperative mood: 'Add retry to PaymentClient') and an optional body explaining WHY, separated by a blank line. The subject completes the sentence 'If applied, this commit will ___'." },
      { type: "list", content: "Conventional Commits (widely used, drives changelogs/semver):\n  feat: a new feature\n  fix: a bug fix\n  refactor: behaviour-preserving restructuring\n  docs: documentation only\n  test: adding/adjusting tests\n  chore: tooling/build, no production code\nExample: 'fix: prevent NPE when cart is empty in checkout'" },
      { type: "paragraph", content: "Each commit should be one logical change. 'feat: add coupon support' that also reformats 30 unrelated files makes the history (and any future revert or bisect) painful." },
    ] },
    commonGaps: { items: [
      "Past tense or noun subjects ('added thing', 'changes') — use imperative: 'Add', 'Fix', 'Remove'.",
      "Subject explains WHAT only; the body should explain WHY when it isn't obvious.",
      "One commit bundling a feature + a reformat + a rename — split into logical commits so revert/bisect stay clean.",
    ] },
    interviewRelevance: "Take-home reviewers read your git log. A clean, conventional history signals discipline; 'wip wip final FINAL2' signals the opposite.",
    industryApplications: { examples: [
      "Conventional Commits auto-generate changelogs and drive semantic-version bumps in release tooling.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m51_t5", topicNumber: 5,
    name: "Asking Good Questions", slug: "asking-good-questions", difficulty: 0.3,
    estimatedMinutes: 25, xpReward: 50, prerequisites: ["java_m51_t2"], visualizer: null,
    metadata: { tags: ["communication", "async", "debugging-help"], estimated_minutes: 25, difficulty: 2 },
    hook: "\"It doesn't work, can you help?\" forces five clarifying questions before anyone can help. A good question gets you an answer in one reply — and respects everyone's time.",
    teaching: { blocks: [
      { type: "paragraph", content: "A well-formed question is self-contained: what you're trying to do, what you tried, what you expected, what actually happened (exact error + minimal context), and your environment. The goal is to let the helper answer without a round-trip of clarifications." },
      { type: "list", content: "The structure (often called a minimal reproducible example):\n  1. Goal — what you're trying to achieve\n  2. Attempt — the relevant code/command you ran\n  3. Expected vs Actual — including the EXACT error message\n  4. What you already tried — so they don't repeat it\nPaste errors as text, not screenshots — they're searchable and copyable." },
      { type: "paragraph", content: "Async etiquette: ask in the open channel (not a DM) so the answer helps others and anyone can respond; don't send 'hi' then wait — lead with the actual question; show your work so helpers can correct your mental model, not just hand you an answer." },
    ] },
    commonGaps: { items: [
      "'It doesn't work' with no error text, no code, no expected-vs-actual — un-answerable without a round-trip.",
      "Posting a screenshot of an error instead of the text — not searchable, not copyable.",
      "DMing one person 'hi' and waiting — ask the real question in the open channel so anyone can help and others benefit.",
    ] },
    interviewRelevance: "In pair-programming and on-the-job-style interviews, how you ask for a hint (specific, with what you tried) vs flailing is itself a signal of seniority.",
    industryApplications: { examples: [
      "Well-formed questions in a team channel become searchable answers — reducing repeat interruptions.",
    ] },
  },
];

function pm(o) { return { trackKey: TRACK, moduleId: MOD_ID, type: "pattern_match", starterCode: "", hints: [], ...o }; }
function tm(o) { return { trackKey: TRACK, moduleId: MOD_ID, type: "predict_output", blanks: [], hints: [], ...o }; }

const EXERCISES = [
  // T1 — PR descriptions
  pm({ topicId: "java_m51_t1", exerciseId: "java_m51_t1_pm_1", position: 1, level: "easy",
    title: "Best PR title",
    scenario: "You fixed an N+1 query that was slowing the orders list. Which PR title is best?",
    instructions: "Pick the strongest title.",
    expectedSolution: "fix_n_plus_one_orders",
    blanks: [{ options: ["fix_n_plus_one_orders", "fixes", "updated_order_service", "wip"] }],
    testCases: [{ type: "pattern_match", correct: "fix_n_plus_one_orders", explanation: "'Fix N+1 query in OrderService.list()' names the change and its location. 'fixes'/'updated...'/'wip' force the reviewer to read the whole diff to learn what it even does." }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m51_t1", exerciseId: "java_m51_t1_pm_2", position: 2, level: "medium",
    title: "What's the weakest part of this PR description?",
    scenario: "A PR description has a clear WHAT and a 'How to test' section, but a reviewer still can't judge whether the change is a good idea. What's most likely missing?",
    instructions: "Pick the missing element.",
    expectedSolution: "the_why",
    blanks: [{ options: ["the_why", "the_diff", "the_file_count", "the_author_name"] }],
    testCases: [{ type: "pattern_match", correct: "the_why", explanation: "The diff shows WHAT; tests show HOW to verify. Without WHY (the problem/ticket motivating it), a reviewer can't judge whether the change is the right solution at all." }],
    xpReward: 15, difficulty: 0.4 }),
  pm({ topicId: "java_m51_t1", exerciseId: "java_m51_t1_pm_3", position: 3, level: "easy",
    title: "A 1,000-line PR mixing three concerns",
    scenario: "Your PR contains a refactor, a new feature, and a repo-wide formatting sweep. The reviewer is overwhelmed. Best fix?",
    instructions: "Pick the best action.",
    expectedSolution: "split_by_concern",
    blanks: [{ options: ["split_by_concern", "ask_for_rubber_stamp", "add_more_comments", "merge_without_review"] }],
    testCases: [{ type: "pattern_match", correct: "split_by_concern", explanation: "Split into single-purpose PRs (one refactor, one feature, one formatting). Each becomes reviewable; mixed mega-PRs get rubber-stamped or stall." }],
    xpReward: 10, difficulty: 0.2 }),

  // T2 — code review
  pm({ topicId: "java_m51_t2", exerciseId: "java_m51_t2_pm_1", position: 1, level: "easy",
    title: "Best review comment",
    scenario: "A method will NPE if its list argument is empty. Which review comment is most constructive?",
    instructions: "Pick the best comment.",
    expectedSolution: "ask_empty_case",
    blanks: [{ options: ["ask_empty_case", "this_is_wrong", "did_you_even_test", "rewrite_it"] }],
    testCases: [{ type: "pattern_match", correct: "ask_empty_case", explanation: "'What happens here if `items` is empty? I think this NPEs — maybe guard it?' critiques the code, explains the concern, and suggests a fix. The others attack or give a verdict with no path forward." }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m51_t2", exerciseId: "java_m51_t2_pm_2", position: 2, level: "easy",
    title: "It's only a style preference",
    scenario: "The code is correct; you'd just have named a variable differently. How should you leave the comment so it doesn't block merge?",
    instructions: "Pick the convention.",
    expectedSolution: "prefix_nit",
    blanks: [{ options: ["prefix_nit", "request_changes", "block_until_renamed", "ignore_silently"] }],
    testCases: [{ type: "pattern_match", correct: "prefix_nit", explanation: "Prefix with 'nit:' to signal it's non-blocking preference, and approve. Blocking a correct PR on taste slows the team; staying silent loses a small improvement." }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m51_t2", exerciseId: "java_m51_t2_pm_3", position: 3, level: "medium",
    title: "Receiving a review comment you disagree with",
    scenario: "A reviewer suggests a change you intentionally avoided for a documented reason. Best response?",
    instructions: "Pick the best response.",
    expectedSolution: "explain_tradeoff",
    blanks: [{ options: ["explain_tradeoff", "ignore_the_comment", "just_comply_silently", "argue_they_are_wrong"] }],
    testCases: [{ type: "pattern_match", correct: "explain_tradeoff", explanation: "Reply explaining the trade-off ('kept X because Y — open to changing if Z'). It closes the loop respectfully. Ignoring leaves them guessing; complying silently loses the rationale; arguing burns goodwill." }],
    xpReward: 15, difficulty: 0.4 }),

  // T3 — design docs
  pm({ topicId: "java_m51_t3", exerciseId: "java_m51_t3_pm_1", position: 1, level: "medium",
    title: "Most-skipped, high-value design-doc section",
    scenario: "A design doc has Context, Proposed design, and Testing. Reviewers keep asking 'did you consider X instead?'. Which section would prevent that?",
    instructions: "Pick the section.",
    expectedSolution: "alternatives_considered",
    blanks: [{ options: ["alternatives_considered", "author_bio", "glossary", "table_of_contents"] }],
    testCases: [{ type: "pattern_match", correct: "alternatives_considered", explanation: "'Alternatives considered' documents the options you rejected and why — it proves you explored the space and pre-empts the 'did you consider X?' loop." }],
    xpReward: 15, difficulty: 0.4 }),
  pm({ topicId: "java_m51_t3", exerciseId: "java_m51_t3_pm_2", position: 2, level: "medium",
    title: "Reviews keep expanding the scope",
    scenario: "Every review of your design doc tries to add features you deliberately left out. Which section stops this?",
    instructions: "Pick the section.",
    expectedSolution: "non_goals",
    blanks: [{ options: ["non_goals", "appendix", "changelog", "acknowledgements"] }],
    testCases: [{ type: "pattern_match", correct: "non_goals", explanation: "An explicit 'Non-goals' section bounds the scope, so reviewers stop re-litigating things that are intentionally out of scope." }],
    xpReward: 15, difficulty: 0.4 }),
  pm({ topicId: "java_m51_t3", exerciseId: "java_m51_t3_pm_3", position: 3, level: "easy",
    title: "When should the design doc be written?",
    scenario: "When does a design doc deliver the most value?",
    instructions: "Pick the timing.",
    expectedSolution: "before_building",
    blanks: [{ options: ["before_building", "after_shipping", "during_the_demo", "at_the_retro"] }],
    testCases: [{ type: "pattern_match", correct: "before_building", explanation: "A design doc's value is catching flaws while they're still cheap — before code exists. Written after shipping, it's just documentation, not alignment." }],
    xpReward: 10, difficulty: 0.2 }),

  // T4 — commit messages
  pm({ topicId: "java_m51_t4", exerciseId: "java_m51_t4_pm_1", position: 1, level: "easy",
    title: "Correct Conventional Commit prefix",
    scenario: "You restructured a class for readability with NO behaviour change. Which Conventional Commit type fits?",
    instructions: "Pick the type.",
    expectedSolution: "refactor",
    blanks: [{ options: ["refactor", "feat", "fix", "docs"] }],
    testCases: [{ type: "pattern_match", correct: "refactor", explanation: "'refactor:' is behaviour-preserving restructuring. feat = new feature, fix = bug fix, docs = documentation only." }],
    xpReward: 10, difficulty: 0.2 }),
  tm({ topicId: "java_m51_t4", exerciseId: "java_m51_t4_ex_1", position: 2, level: "easy",
    title: "Write a commit subject in the correct mood",
    scenario: "You added retry logic to PaymentClient. Write a Conventional-Commit subject line using the 'feat' type, imperative mood, naming the change. Use exactly this form: 'feat: add retry to PaymentClient'.",
    instructions: "Type the subject line exactly (lowercase 'feat', imperative verb 'add').",
    expectedSolution: "feat: add retry to PaymentClient",
    hints: ["Format: 'feat: <imperative verb> <what>'.", "Imperative mood: 'add', not 'added'."],
    testCases: [{ type: "text_match", expected: "feat: add retry to PaymentClient" }],
    xpReward: 10, difficulty: 0.2 }),

  // T5 — asking good questions
  pm({ topicId: "java_m51_t5", exerciseId: "java_m51_t5_pm_1", position: 1, level: "easy",
    title: "Which question gets answered fastest?",
    scenario: "You're blocked and posting in the team channel. Which message will get a useful answer in one reply?",
    instructions: "Pick the best message.",
    expectedSolution: "goal_attempt_error",
    blanks: [{ options: ["goal_attempt_error", "it_doesnt_work", "hi_then_wait", "screenshot_only"] }],
    testCases: [{ type: "pattern_match", correct: "goal_attempt_error", explanation: "Stating goal + what you tried + expected vs actual (with the exact error text) lets a helper answer without clarifying questions. 'It doesn't work', a lone 'hi', or a screenshot all force a round-trip." }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m51_t5", exerciseId: "java_m51_t5_pm_2", position: 2, level: "easy",
    title: "Paste the error as…",
    scenario: "You want to include a stack trace in your question. What's the best format?",
    instructions: "Pick the format.",
    expectedSolution: "text_in_code_block",
    blanks: [{ options: ["text_in_code_block", "screenshot_image", "paraphrase_from_memory", "link_to_video"] }],
    testCases: [{ type: "pattern_match", correct: "text_in_code_block", explanation: "Paste the error as text (in a code block): it's searchable, copyable, and complete. A screenshot/paraphrase loses detail and can't be searched or quoted." }],
    xpReward: 10, difficulty: 0.2 }),
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding M51 Technical Communication…\n");
  await upsertModule();
  console.log(`✓ ProModule: ${MOD_ID}`);
  for (const t of TOPICS) {
    await ProTopic.findOneAndUpdate({ topicId: t.topicId }, { $set: t }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`  ✓ ProTopic: ${t.topicId}  "${t.name}"`);
  }
  for (const e of EXERCISES) {
    await ProExercise.findOneAndUpdate({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(`  ✓ ProExercise: ${e.exerciseId}  [${e.type}/${e.level}]`);
  }
  console.log(`\nDone — 1 module, ${TOPICS.length} topics, ${EXERCISES.length} exercises.`);
  await mongoose.disconnect();
  process.exit(0);
}
run().catch((err) => { console.error("Seed failed:", err.message); process.exit(1); });
