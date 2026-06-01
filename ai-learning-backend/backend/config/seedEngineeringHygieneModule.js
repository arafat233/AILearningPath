/**
 * seedEngineeringHygieneModule.js — Pro Java M50 "Engineering Hygiene" (ROADMAP J2)
 *
 * Build tools, Git collaboration, IntelliJ, dependency management, project
 * conventions. NONE of this is runnable Java, so every exercise grades
 * sandbox-free via pattern_match (pick the right command/tool/practice) or
 * text_match (type the exact canonical command). No Judge0, no Claude.
 *
 * Idempotent. Usage: node config/seedEngineeringHygieneModule.js
 * npm: npm run seed:engineering-hygiene
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";

const TRACK  = "pro_java";
const MOD_ID = "java_m50";

async function upsertModule() {
  return ProModule.findOneAndUpdate(
    { moduleId: MOD_ID },
    {
      trackKey: TRACK, moduleId: MOD_ID, moduleNumber: 50,
      name: "Engineering Hygiene", slug: "engineering-hygiene",
      description: "The non-code skills that separate a junior from a professional: Maven/Gradle build lifecycles, Git collaboration (branch, rebase, resolve), IntelliJ productivity, dependency management, and project conventions.",
      estimatedHours: 4, prerequisites: ["java_m1"], status: "live",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

const TOPICS = [
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m50_t1", topicNumber: 1,
    name: "Build Tools — Maven & Gradle", slug: "build-tools",
    difficulty: 0.3, estimatedMinutes: 35, xpReward: 50, prerequisites: [], visualizer: null,
    metadata: { tags: ["maven", "gradle", "build", "lifecycle"], estimated_minutes: 35, difficulty: 2 },
    hook: "\"It works on my machine\" dies the moment someone else can't build your project. Maven and Gradle make the build reproducible for everyone.",
    teaching: { blocks: [
      { type: "paragraph", content: "A build tool turns source + a declarative config (pom.xml for Maven, build.gradle for Gradle) into a tested, packaged artifact, resolving dependencies from a repository (Maven Central) automatically." },
      { type: "list", content: "Maven lifecycle phases (each runs all earlier phases too):\n  validate → compile → test → package → verify → install → deploy\n  mvn compile  — compile main sources\n  mvn test     — compile + run unit tests\n  mvn package  — compile + test + produce the jar/war\n  mvn install  — package + copy the artifact into your local ~/.m2 repo\n  mvn clean    — delete the target/ directory" },
      { type: "list", content: "Gradle equivalents (task-based, incremental):\n  gradle build  — compile + test + assemble\n  gradle test   — run tests\n  gradle clean  — remove build/\nGradle caches task outputs, so unchanged tasks are skipped — usually faster on big projects." },
      { type: "paragraph", content: "Key idea: a phase runs everything before it. 'mvn package' always compiles and tests first — you never package untested code by accident." },
    ] },
    commonGaps: { items: [
      "Thinking 'mvn package' skips tests — it runs test first (use -DskipTests to skip, and know that's a smell).",
      "Confusing 'mvn install' (local ~/.m2 only) with 'mvn deploy' (remote repository).",
      "Editing target/ or build/ output by hand — they're generated; every build wipes them.",
    ] },
    interviewRelevance: "\"Walk me through what happens when you run mvn package\" is a standard screening question — it tests whether you understand the lifecycle, not just memorised commands.",
    industryApplications: { examples: [
      "CI pipelines run 'mvn verify' / 'gradle build' as the gate before merge.",
      "Reproducible builds across dev laptops and CI runners via pinned dependency versions.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m50_t2", topicNumber: 2,
    name: "Git Collaboration — Branch, Rebase, Resolve", slug: "git-collaboration",
    difficulty: 0.4, estimatedMinutes: 40, xpReward: 50, prerequisites: ["java_m50_t1"], visualizer: null,
    metadata: { tags: ["git", "branching", "rebase", "merge"], estimated_minutes: 40, difficulty: 2 },
    hook: "Committing straight to main is how you take the whole team down. Branches + reviewable history are the contract of working with other engineers.",
    teaching: { blocks: [
      { type: "list", content: "Daily flow:\n  git checkout -b feature/login   — create + switch to a feature branch\n  git add -p                      — stage changes hunk by hunk (review as you go)\n  git commit -m \"...\"             — record a logical unit of work\n  git push -u origin feature/login — publish the branch + set upstream" },
      { type: "paragraph", content: "Merge vs rebase: 'git merge main' into your branch creates a merge commit and preserves the exact history. 'git rebase main' replays your commits on top of the latest main, producing a linear history — cleaner to read, but you must NOT rebase commits others have already pulled (it rewrites SHAs)." },
      { type: "list", content: "Resolving a conflict:\n  1. Git marks conflicting regions with <<<<<<<, =======, >>>>>>>.\n  2. Edit the file to the desired final state, deleting the markers.\n  3. git add <file> to mark it resolved.\n  4. git rebase --continue  (or git commit, if merging)." },
    ] },
    commonGaps: { items: [
      "Rebasing a shared/pushed branch — it rewrites history and breaks everyone who pulled it. Rebase only local, unpushed work.",
      "Leaving conflict markers (<<<<<<<) in the file and committing them — always remove every marker.",
      "Force-pushing to main. Never. Force-push (carefully) only to your own feature branch after a rebase.",
    ] },
    interviewRelevance: "\"What's the difference between merge and rebase, and when would you NOT rebase?\" is asked to gauge whether you've actually collaborated on a shared repo.",
    industryApplications: { examples: [
      "Trunk-based development with short-lived feature branches and PR review before merge.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m50_t3", topicNumber: 3,
    name: "IntelliJ Productivity", slug: "intellij-productivity",
    difficulty: 0.25, estimatedMinutes: 25, xpReward: 50, prerequisites: [], visualizer: null,
    metadata: { tags: ["intellij", "ide", "refactor", "debugger"], estimated_minutes: 25, difficulty: 1 },
    hook: "The fastest engineers aren't faster typists — they let the IDE do the mechanical work: rename across the codebase, extract a method, set a conditional breakpoint, all in two keystrokes.",
    teaching: { blocks: [
      { type: "list", content: "High-leverage actions (IntelliJ):\n  Shift+Shift  — Search Everywhere (files, classes, actions)\n  Shift+F6     — Rename symbol everywhere (refactor-safe, not find/replace)\n  Ctrl/Cmd+Alt+M — Extract Method from a selection\n  Alt+Enter    — Context actions / quick-fixes on the symbol under the caret\n  Ctrl/Cmd+B   — Go to declaration" },
      { type: "paragraph", content: "Refactor-safe rename (Shift+F6) updates every reference — imports, call sites, even Javadoc — using the type system, so it can't accidentally hit an unrelated identifier with the same text the way find/replace does." },
      { type: "list", content: "Debugger essentials:\n  - Breakpoint: click the gutter; right-click to add a CONDITION (e.g. i == 42) so it only stops when relevant.\n  - Step Over (F8) runs the current line; Step Into (F7) enters the called method.\n  - 'Evaluate Expression' runs arbitrary code in the paused frame to inspect state." },
    ] },
    commonGaps: { items: [
      "Using find/replace to rename instead of Shift+F6 — find/replace hits strings/comments and unrelated symbols.",
      "Adding println everywhere instead of a conditional breakpoint — the debugger answers 'what is the state when X?' far faster.",
      "Not learning Search Everywhere (Shift+Shift) — it replaces manual file-tree hunting.",
    ] },
    interviewRelevance: "Live-coding screens watch whether you navigate by symbol (Go to declaration) and refactor safely — it signals day-to-day fluency.",
    industryApplications: { examples: [
      "Safe large-scale renames during refactors; conditional breakpoints to catch a bug that only fires on one input." ,
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m50_t4", topicNumber: 4,
    name: "Dependency Management", slug: "dependency-management",
    difficulty: 0.45, estimatedMinutes: 35, xpReward: 50, prerequisites: ["java_m50_t1"], visualizer: null,
    metadata: { tags: ["dependencies", "semver", "transitive", "conflicts"], estimated_minutes: 35, difficulty: 3 },
    hook: "Your project depends on 8 libraries. Those depend on 40 more. One of them ships two incompatible versions of the same JAR — and now your app throws NoSuchMethodError at runtime. Welcome to dependency management.",
    teaching: { blocks: [
      { type: "paragraph", content: "Semantic Versioning (semver) is MAJOR.MINOR.PATCH. MAJOR = breaking changes, MINOR = backward-compatible features, PATCH = backward-compatible bug fixes. Pin versions explicitly; never rely on 'latest'." },
      { type: "paragraph", content: "Transitive dependencies are the dependencies OF your dependencies. When two paths pull different versions of the same artifact, Maven picks the one nearest to your project in the tree ('nearest wins'); Gradle picks the highest version by default. Either way you can get surprises." },
      { type: "list", content: "Diagnosing conflicts:\n  mvn dependency:tree   — print the full transitive tree (find the duplicate)\n  gradle dependencies   — same for Gradle\nThen force one version via <dependencyManagement> (Maven) or a resolution strategy (Gradle), or exclude the unwanted transitive dep." },
    ] },
    commonGaps: { items: [
      "Using version ranges or 'latest' — non-reproducible builds; pin exact versions.",
      "Ignoring NoSuchMethodError / NoClassDefFoundError at runtime — these are almost always a version conflict, not a code bug.",
      "Not knowing 'mvn dependency:tree' — it's the first tool to reach for when a transitive conflict appears.",
    ] },
    interviewRelevance: "\"You get a NoSuchMethodError in production but it compiled fine — what's your first hypothesis?\" → a transitive dependency version conflict. Knowing dependency:tree is the senior answer.",
    industryApplications: { examples: [
      "Resolving 'jar hell' when two Spring/Jackson versions collide via different transitive paths.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m50_t5", topicNumber: 5,
    name: "Project Structure & Conventions", slug: "project-conventions",
    difficulty: 0.3, estimatedMinutes: 25, xpReward: 50, prerequisites: ["java_m50_t1"], visualizer: null,
    metadata: { tags: ["conventions", "gitignore", "readme", "layout"], estimated_minutes: 25, difficulty: 2 },
    hook: "A stranger should be able to clone your repo and build it in under five minutes. That's what conventions buy you.",
    teaching: { blocks: [
      { type: "list", content: "Standard Maven/Gradle layout:\n  src/main/java   — production code\n  src/main/resources — config, static files\n  src/test/java   — tests (mirror the main package structure)\n  target/ or build/ — generated output (NEVER committed)" },
      { type: "paragraph", content: "A .gitignore keeps generated and machine-specific files out of version control: target/, build/, *.class, .idea/, *.iml, .env, and OS junk like .DS_Store. Committing these causes noise, merge conflicts, and leaks secrets." },
      { type: "paragraph", content: "A README answers, in order: what this is, how to build/run it, and how to run the tests. If a new teammate can't get started from your README alone, it's incomplete." },
    ] },
    commonGaps: { items: [
      "Committing target/ build output or .idea/ IDE files — bloats the repo and creates spurious conflicts.",
      "Committing a .env with secrets — it must be gitignored; provide a .env.example instead.",
      "A README that lists features but never says how to build/run/test — the three things a new dev actually needs.",
    ] },
    interviewRelevance: "Take-home assignments are judged heavily on hygiene: clean .gitignore, a README with build/run/test steps, and the standard layout signal professionalism before they read a line of logic.",
    industryApplications: { examples: [
      "Onboarding: a good README + standard layout cuts a new hire's first-build time from hours to minutes.",
    ] },
  },
];

function pm(o) { return { trackKey: TRACK, moduleId: MOD_ID, type: "pattern_match", starterCode: "", hints: [], ...o }; }
function tm(o) { return { trackKey: TRACK, moduleId: MOD_ID, type: "predict_output", blanks: [], hints: [], ...o }; }

const EXERCISES = [
  // T1 — build tools
  pm({ topicId: "java_m50_t1", exerciseId: "java_m50_t1_pm_1", position: 1, level: "easy",
    title: "Which command produces the jar AND runs tests first?",
    scenario: "You want to build a deployable jar, but only if the unit tests pass. Which single Maven command does both (lifecycle runs test before package)?",
    instructions: "Pick the command.",
    expectedSolution: "mvn package",
    blanks: [{ options: ["mvn package", "mvn compile", "mvn clean", "mvn validate"] }],
    testCases: [{ type: "pattern_match", correct: "mvn package", explanation: "package is after test in the lifecycle, and a phase runs all earlier phases — so 'mvn package' compiles and runs tests, then builds the jar. compile/validate stop earlier; clean just deletes target/." }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m50_t1", exerciseId: "java_m50_t1_pm_2", position: 2, level: "easy",
    title: "Local repo vs remote repo",
    scenario: "You want your freshly built artifact available to ANOTHER project on the same machine (your local ~/.m2), but NOT published to a shared remote repository. Which command?",
    instructions: "Pick the command.",
    expectedSolution: "mvn install",
    blanks: [{ options: ["mvn install", "mvn deploy", "mvn package", "mvn test"] }],
    testCases: [{ type: "pattern_match", correct: "mvn install", explanation: "install copies the artifact into your local ~/.m2 repository (visible to other local projects). deploy pushes to a remote/shared repository — more than you asked for." }],
    xpReward: 10, difficulty: 0.2 }),
  tm({ topicId: "java_m50_t1", exerciseId: "java_m50_t1_ex_1", position: 3, level: "easy",
    title: "Type the Maven command to wipe build output",
    scenario: "Your target/ directory is stale and you want Maven to delete it. Type the exact Maven command (just the command, e.g. 'mvn xxx').",
    instructions: "Type the command, lowercase, no extra words.",
    expectedSolution: "mvn clean",
    hints: ["The lifecycle phase that deletes target/ is 'clean'."],
    testCases: [{ type: "text_match", expected: "mvn clean" }],
    xpReward: 10, difficulty: 0.2 }),

  // T2 — git
  pm({ topicId: "java_m50_t2", exerciseId: "java_m50_t2_pm_1", position: 1, level: "medium",
    title: "When must you NOT rebase?",
    scenario: "You have commits on a branch you already pushed and a teammate has pulled. You want a clean linear history. What's the correct call?",
    instructions: "Pick the safest action.",
    expectedSolution: "do_not_rebase_shared",
    blanks: [{ options: ["do_not_rebase_shared", "rebase_and_force_push", "rebase_main_branch", "delete_their_clone"] }],
    testCases: [{ type: "pattern_match", correct: "do_not_rebase_shared", explanation: "Rebasing rewrites commit SHAs. Once a branch is pushed and pulled by others, rebasing + force-pushing breaks their history. Rebase only local, unpushed commits; otherwise merge." }],
    xpReward: 15, difficulty: 0.4 }),
  tm({ topicId: "java_m50_t2", exerciseId: "java_m50_t2_ex_1", position: 2, level: "easy",
    title: "Type the command to create + switch to a branch",
    scenario: "Create a new branch named feature/login and switch to it in ONE command. Type the classic checkout form (git checkout ...).",
    instructions: "Type the exact command.",
    expectedSolution: "git checkout -b feature/login",
    hints: ["checkout with -b creates and switches in one step."],
    testCases: [{ type: "text_match", expected: "git checkout -b feature/login" }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m50_t2", exerciseId: "java_m50_t2_pm_2", position: 3, level: "easy",
    title: "After editing a conflicted file, what marks it resolved?",
    scenario: "Git stopped on a conflict. You edited the file to its correct final state and removed all <<<<<<< markers. What's the next step before continuing the rebase/merge?",
    instructions: "Pick the next step.",
    expectedSolution: "git_add_file",
    blanks: [{ options: ["git_add_file", "git_commit_skip", "git_reset_hard", "git_push_force"] }],
    testCases: [{ type: "pattern_match", correct: "git_add_file", explanation: "Staging the resolved file with 'git add <file>' tells Git the conflict is resolved; then 'git rebase --continue' (or commit, when merging) proceeds. reset --hard would discard your work." }],
    xpReward: 10, difficulty: 0.2 }),

  // T3 — IntelliJ
  pm({ topicId: "java_m50_t3", exerciseId: "java_m50_t3_pm_1", position: 1, level: "easy",
    title: "Rename a method everywhere, safely",
    scenario: "You want to rename a method and update every call site, import, and reference — without touching unrelated identifiers that happen to share the name. Which approach?",
    instructions: "Pick the safe approach.",
    expectedSolution: "refactor_rename",
    blanks: [{ options: ["refactor_rename", "find_and_replace", "manual_edit_each", "regex_replace"] }],
    testCases: [{ type: "pattern_match", correct: "refactor_rename", explanation: "IntelliJ's Rename refactor (Shift+F6) uses the type system to update exactly the real references. Find/replace and regex hit strings, comments, and unrelated same-named symbols." }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m50_t3", exerciseId: "java_m50_t3_pm_2", position: 2, level: "medium",
    title: "A bug only happens on one input",
    scenario: "A loop misbehaves only when i == 42 on the 10,000th iteration. You want the debugger to pause exactly then, without stopping 9,999 times. What do you set?",
    instructions: "Pick the tool.",
    expectedSolution: "conditional_breakpoint",
    blanks: [{ options: ["conditional_breakpoint", "println_in_loop", "plain_breakpoint", "rerun_repeatedly"] }],
    testCases: [{ type: "pattern_match", correct: "conditional_breakpoint", explanation: "A breakpoint with a condition (i == 42) pauses only when it's true — no manual clicking through 9,999 hits, no println noise to clean up later." }],
    xpReward: 10, difficulty: 0.3 }),

  // T4 — dependencies
  pm({ topicId: "java_m50_t4", exerciseId: "java_m50_t4_pm_1", position: 1, level: "medium",
    title: "NoSuchMethodError that compiled fine — first hypothesis?",
    scenario: "Your app compiled and the tests passed, but in production it throws NoSuchMethodError calling a library method. What's the most likely root cause?",
    instructions: "Pick the most likely cause.",
    expectedSolution: "transitive_version_conflict",
    blanks: [{ options: ["transitive_version_conflict", "logic_bug", "missing_null_check", "thread_race"] }],
    testCases: [{ type: "pattern_match", correct: "transitive_version_conflict", explanation: "Compiles-but-fails-at-runtime with NoSuchMethodError/NoClassDefFoundError almost always means two transitive paths pulled different versions of the same library and the wrong one won at runtime." }],
    xpReward: 15, difficulty: 0.4 }),
  tm({ topicId: "java_m50_t4", exerciseId: "java_m50_t4_ex_1", position: 2, level: "medium",
    title: "Type the command to inspect the dependency tree",
    scenario: "You suspect a transitive version conflict and want Maven to print the full dependency tree. Type the exact Maven command (mvn dependency:...).",
    instructions: "Type the command.",
    expectedSolution: "mvn dependency:tree",
    hints: ["The dependency plugin's goal is 'tree'."],
    testCases: [{ type: "text_match", expected: "mvn dependency:tree" }],
    xpReward: 10, difficulty: 0.3 }),

  // T5 — conventions
  pm({ topicId: "java_m50_t5", exerciseId: "java_m50_t5_pm_1", position: 1, level: "easy",
    title: "Which of these should NEVER be committed?",
    scenario: "A teammate's first PR adds several files to git. Which one is a hygiene red flag that should be in .gitignore instead?",
    instructions: "Pick the file that should be gitignored.",
    expectedSolution: "target_build_output",
    blanks: [{ options: ["target_build_output", "src_main_java_code", "pom_xml", "readme_md"] }],
    testCases: [{ type: "pattern_match", correct: "target_build_output", explanation: "target/ (and build/, .idea/, *.class) is generated output — it must be gitignored. Source, pom.xml, and README are exactly what belongs in the repo." }],
    xpReward: 10, difficulty: 0.2 }),
  pm({ topicId: "java_m50_t5", exerciseId: "java_m50_t5_pm_2", position: 2, level: "easy",
    title: "What must a README cover for a new dev?",
    scenario: "A take-home reviewer clones your repo. Beyond 'what it is', which trio of instructions most determines whether they can actually use it?",
    instructions: "Pick the most important content.",
    expectedSolution: "build_run_test_steps",
    blanks: [{ options: ["build_run_test_steps", "author_biography", "full_changelog", "license_text_only"] }],
    testCases: [{ type: "pattern_match", correct: "build_run_test_steps", explanation: "A README's job is to get a stranger productive: what it is, then how to build, run, and test it. Those three steps are what a new dev needs first." }],
    xpReward: 10, difficulty: 0.2 }),
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding M50 Engineering Hygiene…\n");
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
