/**
 * seedModernJavaModule.js — Pro Java M49 "Modern Java Features" (ROADMAP J1)
 *
 * Upserts:
 *   - 1 ProModule  (java_m49)
 *   - 5 ProTopics  (records, var, text blocks, sealed classes, pattern matching)
 *   - 13 ProExercises (predict_output, code_scratch, pattern_match)
 *
 * Real, runnable Java — so exercises grade via execution (Judge0) and
 * text_match (typed output). Idempotent: safe to re-run.
 * Usage: node config/seedModernJavaModule.js  ·  npm run seed:modern-java
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";

const TRACK  = "pro_java";
const MOD_ID = "java_m49";

async function upsertModule() {
  return ProModule.findOneAndUpdate(
    { moduleId: MOD_ID },
    {
      trackKey: TRACK, moduleId: MOD_ID, moduleNumber: 49,
      name: "Modern Java Features", slug: "modern-java-features",
      description: "The Java 14–21 features every interviewer now expects: records, var, text blocks, sealed classes, and pattern matching. Write less boilerplate and express intent the way modern codebases do.",
      estimatedHours: 4, prerequisites: ["java_m5"], status: "live",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

const TOPICS = [
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m49_t1", topicNumber: 1,
    name: "Records — Immutable Data Carriers", slug: "records",
    difficulty: 0.25, estimatedMinutes: 30, xpReward: 50, prerequisites: [], visualizer: null,
    metadata: { tags: ["records", "immutability", "java16"], estimated_minutes: 30, difficulty: 1 },
    hook: "A class that only holds data needs a constructor, getters, equals, hashCode, and toString — 40 lines of boilerplate for 3 fields. A record does it in one line.",
    teaching: { blocks: [
      { type: "paragraph", content: "A record (Java 16+) is a transparent carrier for immutable data. You declare the components once and the compiler generates the canonical constructor, accessors, equals(), hashCode(), and toString() for you." },
      { type: "code", content: "// Before: ~40 lines\n// After:\npublic record Point(int x, int y) {}\n\nPoint p = new Point(3, 4);\nSystem.out.println(p.x());      // accessor is x(), not getX()\nSystem.out.println(p);          // Point[x=3, y=4]\nSystem.out.println(p.equals(new Point(3, 4)));  // true — value equality" },
      { type: "paragraph", content: "Records are implicitly final and their fields are final — you cannot add mutable state. You CAN add a compact constructor to validate or normalise arguments, and you can add extra methods." },
      { type: "code", content: "public record Range(int lo, int hi) {\n    public Range {                 // compact constructor — no parameter list\n        if (lo > hi) throw new IllegalArgumentException(\"lo > hi\");\n    }\n    public int span() { return hi - lo; }\n}" },
    ] },
    commonGaps: { items: [
      "Calling getX() instead of x() — record accessors are named after the component, with no get prefix.",
      "Trying to add a setter or reassign a field — records are immutable by design; build a new record instead.",
      "Writing a full canonical constructor when a compact one (no parameter list) is enough for validation.",
    ] },
    interviewRelevance: "Records are now the default answer to 'how would you model a DTO / value object?'. Knowing the compact constructor and the accessor naming shows you're current with Java 16+.",
    industryApplications: { examples: [
      "DTOs in Spring controllers — request/response bodies as records.",
      "Domain value objects (Money, Coordinate) where equality is by value, not identity.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m49_t2", topicNumber: 2,
    name: "var — Local-Variable Type Inference", slug: "var",
    difficulty: 0.2, estimatedMinutes: 25, xpReward: 50, prerequisites: ["java_m49_t1"], visualizer: null,
    metadata: { tags: ["var", "type-inference", "java10"], estimated_minutes: 25, difficulty: 1 },
    hook: "Map<String, List<Integer>> m = new HashMap<>(); — you said the type twice. var lets the compiler infer it from the right-hand side, once.",
    teaching: { blocks: [
      { type: "paragraph", content: "var (Java 10+) infers the static type of a LOCAL variable from its initializer. It is NOT dynamic typing — the type is fixed at compile time, exactly as if you'd written it out." },
      { type: "code", content: "var count = 10;                       // int\nvar name = \"Stellar\";                 // String\nvar list = new ArrayList<String>();   // ArrayList<String>\nvar entries = Map.of(\"a\", 1).entrySet(); // Set<Map.Entry<String,Integer>>" },
      { type: "list", content: "var only works on LOCAL variables with an initializer.\nvar CANNOT be used for fields, method parameters, or return types.\nvar x = null; is illegal — nothing to infer from.\nUse var when the type is obvious from the right side; spell it out when it aids readability." },
    ] },
    commonGaps: { items: [
      "Thinking var means dynamic typing — it is fully static; the inferred type never changes.",
      "Trying var on a field or method parameter — only local variables are allowed.",
      "Overusing var when the right-hand side hides the type (e.g. var r = service.process();) — hurts readability.",
    ] },
    interviewRelevance: "Interviewers watch whether you know var's scope (locals only) and that it's compile-time inference, not runtime dynamism — a common 'is Java dynamically typed now?' trap.",
    industryApplications: { examples: [
      "Reducing noise in stream pipelines and try-with-resources where the type is long but obvious.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m49_t3", topicNumber: 3,
    name: "Text Blocks — Multi-line Strings", slug: "text-blocks",
    difficulty: 0.25, estimatedMinutes: 25, xpReward: 50, prerequisites: ["java_m49_t2"], visualizer: null,
    metadata: { tags: ["text-blocks", "strings", "java15"], estimated_minutes: 25, difficulty: 1 },
    hook: "Embedding JSON or SQL in a String used to mean a wall of \\n and \\\" escapes. Text blocks (\"\"\") let you paste it verbatim.",
    teaching: { blocks: [
      { type: "paragraph", content: "A text block (Java 15+) is a multi-line string literal opened and closed by three double-quotes. Incidental leading whitespace is stripped relative to the closing delimiter, and you rarely need to escape quotes." },
      { type: "code", content: "String json = \"\"\"\n    {\n        \"name\": \"Stellar\",\n        \"live\": true\n    }\"\"\";\n\nString sql = \"\"\"\n    SELECT id, name\n    FROM users\n    WHERE active = true\"\"\";" },
      { type: "paragraph", content: "Each line ends with a newline EXCEPT when you end a line with a backslash (\\) to suppress it, or with \\s to preserve a trailing space. The closing \"\"\" position sets the left margin that gets stripped from every line." },
    ] },
    commonGaps: { items: [
      "Forgetting that the closing delimiter's indentation determines how much leading whitespace is stripped.",
      "Expecting a trailing newline after the last line when the closing \"\"\" is on the same line as the text.",
      "Still escaping every double-quote — inside a text block, plain \" is fine.",
    ] },
    interviewRelevance: "Comes up whenever you're asked to embed a JSON/SQL/HTML fixture in a test — text blocks are the modern, readable answer.",
    industryApplications: { examples: [
      "Inline SQL in repository tests; expected-JSON fixtures in REST controller tests.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m49_t4", topicNumber: 4,
    name: "Sealed Classes & Interfaces", slug: "sealed-classes",
    difficulty: 0.4, estimatedMinutes: 30, xpReward: 50, prerequisites: ["java_m49_t1"], visualizer: null,
    metadata: { tags: ["sealed", "permits", "java17"], estimated_minutes: 30, difficulty: 2 },
    hook: "Interfaces let anyone implement them. Sometimes you want the OPPOSITE — a fixed, known set of subtypes the compiler can reason about exhaustively. That's a sealed type.",
    teaching: { blocks: [
      { type: "paragraph", content: "A sealed class/interface (Java 17+) restricts which classes may extend or implement it via a permits clause. Every permitted subtype must itself be final, sealed, or non-sealed." },
      { type: "code", content: "public sealed interface Shape permits Circle, Square {}\n\npublic record Circle(double r) implements Shape {}\npublic record Square(double side) implements Shape {}\n\n// Because Shape is sealed, a switch over it can be exhaustive\n// with NO default branch — the compiler knows all cases." },
      { type: "paragraph", content: "Sealed types pair naturally with records and pattern-matching switches: the compiler can verify you've handled every permitted subtype, turning 'forgot a case' bugs into compile errors." },
    ] },
    commonGaps: { items: [
      "Forgetting that every permitted subclass must be final, sealed, or non-sealed — the compiler enforces it.",
      "Putting permitted subtypes in a different package/module without the right access — they must be accessible to the sealed type.",
      "Adding a default branch to a switch over a sealed type, which defeats the compiler's exhaustiveness check.",
    ] },
    interviewRelevance: "Sealed + records + switch patterns is the modern 'algebraic data type' idiom. Interviewers use it to test whether you can model a closed set of states (e.g. a Result = Success | Failure).",
    industryApplications: { examples: [
      "Modelling a finite set of domain events or a Result/Either type with compiler-checked exhaustiveness.",
    ] },
  },
  {
    trackKey: TRACK, moduleId: MOD_ID, topicId: "java_m49_t5", topicNumber: 5,
    name: "Pattern Matching — instanceof & switch", slug: "pattern-matching",
    difficulty: 0.45, estimatedMinutes: 35, xpReward: 50, prerequisites: ["java_m49_t4"], visualizer: null,
    metadata: { tags: ["pattern-matching", "switch", "instanceof", "java21"], estimated_minutes: 35, difficulty: 3 },
    hook: "if (o instanceof String) { String s = (String) o; ... } — you tested the type, then cast to the same type. Pattern matching collapses the two into one.",
    teaching: { blocks: [
      { type: "paragraph", content: "Pattern matching for instanceof (Java 16+) binds a variable when the type test passes, removing the redundant cast." },
      { type: "code", content: "Object o = \"hello\";\nif (o instanceof String s) {     // s is in scope and typed when the test is true\n    System.out.println(s.length());\n}" },
      { type: "paragraph", content: "Switch expressions (Java 14+) return a value with arrow labels and no fall-through. Combined with type patterns (Java 21) and sealed types, a switch can deconstruct and branch on the runtime type exhaustively." },
      { type: "code", content: "static String describe(Shape sh) {\n    return switch (sh) {\n        case Circle c -> \"circle r=\" + c.r();\n        case Square s -> \"square side=\" + s.side();\n    };  // no default needed — Shape is sealed\n}" },
    ] },
    commonGaps: { items: [
      "Still casting after instanceof — once you write 'instanceof String s', use s directly.",
      "Mixing arrow (->) and colon (:) labels in one switch — pick one; arrow has no fall-through.",
      "Adding default to a switch over a sealed type — unnecessary and it hides missing-case errors.",
    ] },
    interviewRelevance: "Type-pattern switches over sealed records are the single most-asked 'modern Java' topic in 2024+ interviews — it replaces visitor-pattern boilerplate.",
    industryApplications: { examples: [
      "Dispatching on a sealed event hierarchy without the visitor pattern; parsing/AST evaluation.",
    ] },
  },
];

// ── exercises ──────────────────────────────────────────────────────────────
function ex(o) { return { trackKey: TRACK, moduleId: MOD_ID, blanks: [], hints: [], ...o }; }

const EXERCISES = [
  // T1 — Records
  ex({ topicId: "java_m49_t1", exerciseId: "java_m49_t1_ex_1", position: 1, level: "warmup", type: "predict_output",
    title: "Predict: record toString + value equality",
    scenario: "A Point record is printed, and two equal Points are compared. What does this program output?",
    instructions: "Write the two output lines in order.",
    starterCode: "public record Point(int x, int y) {}\n// in main:\nPoint p = new Point(3, 4);\nSystem.out.println(p);\nSystem.out.println(p.equals(new Point(3, 4)));",
    expectedSolution: "Point[x=3, y=4]\ntrue",
    hints: ["Records auto-generate toString as Type[comp=val, ...].", "Record equals() is value-based."],
    testCases: [{ type: "text_match", expected: "Point[x=3, y=4]\ntrue" }],
    xpReward: 5, difficulty: 0.1 }),
  ex({ topicId: "java_m49_t1", exerciseId: "java_m49_t1_ex_2", position: 2, level: "easy", type: "predict_output",
    title: "Predict: record compact-constructor validation",
    scenario: "Temperature is a record whose compact constructor throws IllegalArgumentException when celsius < -273.15. A valid value is printed, then an invalid one is tried inside a try/catch that prints INVALID on failure. What does the program print?",
    instructions: "Write the two output lines in order.",
    starterCode: "record Temperature(double celsius) {\n    Temperature {\n        if (celsius < -273.15) throw new IllegalArgumentException();\n    }\n}\n// in main:\nSystem.out.println(new Temperature(25.0).celsius());\ntry { new Temperature(-300); }\ncatch (IllegalArgumentException e) { System.out.println(\"INVALID\"); }",
    expectedSolution: "25.0\nINVALID",
    hints: ["25.0 is valid and prints via the accessor celsius() as 25.0.", "-300 < -273.15 throws, the catch prints INVALID."],
    testCases: [{ type: "text_match", expected: "25.0\nINVALID" }],
    xpReward: 10, difficulty: 0.3 }),
  ex({ topicId: "java_m49_t1", exerciseId: "java_m49_t1_pm_1", position: 3, level: "easy", type: "pattern_match",
    title: "Pattern: model an immutable value object",
    scenario: "You need a small immutable type that carries 3 related fields, with value-based equals/hashCode and a readable toString — and you don't want to hand-write any of it. Which modern Java feature fits best?",
    instructions: "Select the best feature.",
    starterCode: "",
    expectedSolution: "records",
    hints: ["The feature exists specifically to remove data-carrier boilerplate."],
    blanks: [{ options: ["records", "sealed_classes", "text_blocks", "var"] }],
    testCases: [{ type: "pattern_match", correct: "records", explanation: "A record generates the constructor, accessors, value-based equals/hashCode, and toString from the component list — exactly an immutable value object in one line." }],
    xpReward: 10, difficulty: 0.2 }),

  // T2 — var
  ex({ topicId: "java_m49_t2", exerciseId: "java_m49_t2_ex_1", position: 1, level: "warmup", type: "predict_output",
    title: "Predict: var infers a concrete type",
    scenario: "var is used for an int and a String, then both are printed after operations. What is the output?",
    instructions: "Write the two output lines in order.",
    starterCode: "var n = 21;\nvar s = \"age\";\nSystem.out.println(n * 2);\nSystem.out.println(s + n);",
    expectedSolution: "42\nage21",
    hints: ["var n = 21 infers int.", "var s = \"age\" infers String; + concatenates."],
    testCases: [{ type: "text_match", expected: "42\nage21" }],
    xpReward: 5, difficulty: 0.1 }),
  ex({ topicId: "java_m49_t2", exerciseId: "java_m49_t2_pm_1", position: 2, level: "easy", type: "pattern_match",
    title: "Pattern: where is var ILLEGAL?",
    scenario: "A teammate wants to use var everywhere to reduce typing. In which of these positions is var actually NOT allowed by the compiler?",
    instructions: "Select the illegal use.",
    starterCode: "",
    expectedSolution: "method_parameter",
    hints: ["var infers from an initializer — some positions have no initializer to infer from."],
    blanks: [{ options: ["method_parameter", "local_variable_with_initializer", "loop_variable_in_for", "try_with_resources_variable"] }],
    testCases: [{ type: "pattern_match", correct: "method_parameter", explanation: "var is restricted to local variables with an initializer. Method parameters (like fields and return types) have no initializer to infer from, so var is illegal there." }],
    xpReward: 10, difficulty: 0.2 }),

  // T3 — Text blocks
  ex({ topicId: "java_m49_t3", exerciseId: "java_m49_t3_ex_1", position: 1, level: "easy", type: "predict_output",
    title: "Predict: text-block indentation stripping",
    scenario: "A text block holds a small JSON object and is printed with System.out.print (no trailing newline). The closing triple-quote sits at the same indentation as the braces, so that much leading whitespace is stripped from every line. What is printed?",
    instructions: "Write the printed lines exactly — mind the two-space indent on the middle line.",
    starterCode: "String json = \"\"\"\n        {\n          \"ok\": true\n        }\"\"\";\nSystem.out.print(json);",
    expectedSolution: "{\n  \"ok\": true\n}",
    hints: ["Incidental whitespace = the common left margin set by the closing \"\"\" (8 spaces here).", "After stripping 8 spaces: '{', '  \"ok\": true', '}'."],
    testCases: [{ type: "text_match", expected: "{\n  \"ok\": true\n}" }],
    xpReward: 10, difficulty: 0.3 }),
  ex({ topicId: "java_m49_t3", exerciseId: "java_m49_t3_pm_1", position: 2, level: "easy", type: "pattern_match",
    title: "Pattern: embed a multi-line SQL query readably",
    scenario: "You're writing a repository test with a 6-line SQL statement embedded in Java. You want it to read like SQL, not a string with \\n everywhere. Which feature?",
    instructions: "Select the feature.",
    starterCode: "",
    expectedSolution: "text_blocks",
    hints: ["Triple-quote literals preserve line breaks without escapes."],
    blanks: [{ options: ["text_blocks", "records", "var", "string_concatenation"] }],
    testCases: [{ type: "pattern_match", correct: "text_blocks", explanation: "Text blocks (\"\"\") let multi-line SQL/JSON/HTML appear verbatim — no \\n, minimal escaping — which is exactly the readability win for embedded fixtures." }],
    xpReward: 10, difficulty: 0.2 }),

  // T4 — Sealed classes
  ex({ topicId: "java_m49_t4", exerciseId: "java_m49_t4_ex_1", position: 1, level: "medium", type: "predict_output",
    title: "Predict: exhaustive switch over a sealed type",
    scenario: "Shape is sealed permitting Circle and Square (both records). describe() switches over it with no default. What does the program print for new Circle(2)?",
    instructions: "Write the single output line.",
    starterCode: "sealed interface Shape permits Circle, Square {}\nrecord Circle(double r) implements Shape {}\nrecord Square(double s) implements Shape {}\n// String describe(Shape sh) = switch (sh) {\n//   case Circle c -> \"circle \" + c.r();\n//   case Square s -> \"square \" + s.s();\n// };\n// in main: System.out.println(describe(new Circle(2)));",
    expectedSolution: "circle 2.0",
    hints: ["c.r() returns the double 2, which prints as 2.0.", "The Circle branch is selected."],
    testCases: [{ type: "text_match", expected: "circle 2.0" }],
    xpReward: 15, difficulty: 0.4 }),
  ex({ topicId: "java_m49_t4", exerciseId: "java_m49_t4_pm_1", position: 2, level: "medium", type: "pattern_match",
    title: "Pattern: a closed set of subtypes with compiler-checked cases",
    scenario: "You want to model a Result as exactly Success or Failure — no other subtype should ever exist — and have the compiler force every switch to handle both. Which feature enforces this closed hierarchy?",
    instructions: "Select the feature.",
    starterCode: "",
    expectedSolution: "sealed_classes",
    hints: ["The feature uses a 'permits' clause to fix the set of subtypes."],
    blanks: [{ options: ["sealed_classes", "records", "var", "text_blocks"] }],
    testCases: [{ type: "pattern_match", correct: "sealed_classes", explanation: "A sealed interface with 'permits Success, Failure' fixes the subtype set, letting a pattern switch be exhaustive with no default — the compiler flags any unhandled case." }],
    xpReward: 10, difficulty: 0.4 }),

  // T5 — Pattern matching
  ex({ topicId: "java_m49_t5", exerciseId: "java_m49_t5_ex_1", position: 1, level: "easy", type: "predict_output",
    title: "Predict: pattern matching for instanceof",
    scenario: "An Object holding \"hello\" is tested with 'instanceof String s' and its length printed. What is the output?",
    instructions: "Write the single output line.",
    starterCode: "Object o = \"hello\";\nif (o instanceof String s) {\n    System.out.println(s.length());\n}",
    expectedSolution: "5",
    hints: ["The binding variable s is the same object, typed as String.", "\"hello\".length() is 5."],
    testCases: [{ type: "text_match", expected: "5" }],
    xpReward: 10, difficulty: 0.2 }),
  ex({ topicId: "java_m49_t5", exerciseId: "java_m49_t5_ex_2", position: 2, level: "medium", type: "predict_output",
    title: "Predict: switch expression result",
    scenario: "A switch EXPRESSION (arrow labels) maps a String to an int — \"int\"→1, \"long\"→2, anything else→0 — and the result is printed. For the input shown (\"long\"), what is printed?",
    instructions: "Write the single output line.",
    starterCode: "String t = \"long\";\nint code = switch (t) {\n    case \"int\"  -> 1;\n    case \"long\" -> 2;\n    default     -> 0;\n};\nSystem.out.println(code);",
    expectedSolution: "2",
    hints: ["Arrow labels have no fall-through — only the matching arm runs.", "\"long\" selects the arm returning 2."],
    testCases: [{ type: "text_match", expected: "2" }],
    xpReward: 10, difficulty: 0.4 }),
  ex({ topicId: "java_m49_t5", exerciseId: "java_m49_t5_pm_1", position: 3, level: "medium", type: "pattern_match",
    title: "Pattern: branch on runtime type without casting",
    scenario: "You have a sealed Event hierarchy and need to run different logic per concrete subtype, returning a value, with the compiler ensuring you handled every case. Which modern feature is the idiomatic fit (replacing the visitor pattern)?",
    instructions: "Select the feature.",
    starterCode: "",
    expectedSolution: "pattern_matching",
    hints: ["Combines type tests + binding + exhaustiveness in one construct."],
    blanks: [{ options: ["pattern_matching", "records", "var", "text_blocks"] }],
    testCases: [{ type: "pattern_match", correct: "pattern_matching", explanation: "A pattern-matching switch (case Subtype s -> ...) tests the runtime type, binds it without a cast, returns a value, and — over a sealed type — is checked exhaustive. It replaces visitor-pattern boilerplate." }],
    xpReward: 10, difficulty: 0.4 }),
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Seeding M49 Modern Java Features…\n");
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
