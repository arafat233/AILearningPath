/**
 * Seed — LLD module M2: Creational Patterns (Builder, Abstract Factory,
 * Prototype). Extends the pro_lld track (Factory + Singleton already live in M1).
 *
 * Idempotent upsert-by-id. Recomputes track totals from the DB at the end.
 * Exercise test-case types follow the PROVEN grading convention:
 *   pattern_match → {type:"pattern_match", correct}
 *   predict_output→ {type:"text_match", expected}        (typed output, no compiler)
 *   code_scratch  → {type:"execution", expected_stdout, must_compile:true}  (Judge0)
 * Java stays JDK-13-safe (no records/sealed/switch-expr/text-blocks).
 *
 * Usage:  node config/seedLldCreational.js   ·   npm: npm run seed:lld-creational
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m2";

const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);

function code(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "code_scratch", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "", starterCode: o.starterCode ?? "", expectedSolution: o.expectedSolution ?? "",
    blanks: [], testCases: [{ type: "execution", must_compile: true, stdin: "", expected_stdout: o.expectedStdout }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}
function predict(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "predict_output", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "What does this code print?", starterCode: o.starterCode, expectedSolution: o.expected,
    blanks: [], testCases: [{ type: "text_match", expected: o.expected, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}
function pm(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const MODULE = {
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 2,
  name: "Creational Patterns", slug: "creational-patterns",
  description: "How objects get created without coupling callers to concrete classes: the Builder for complex construction, the Abstract Factory for families of products, and the Prototype for cloning. (Factory & Singleton live in M1.)",
  estimatedHours: 4, prerequisites: ["lld_m1"], status: "live",
};

const TOPICS = [
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m2_t1", topicNumber: 1,
    name: "Builder Pattern", slug: "builder-pattern",
    metadata: { estimated_minutes: 35, difficulty: 2, prerequisites: ["lld_m1_t1"], tags: ["creational", "builder", "fluent", "immutability"] },
    hook: {
      question: "A class needs 3 required and 6 optional fields. The constructor zoo (one per combination) is unreadable and error-prone. What's the clean answer?",
      insight: "The Builder pattern separates the construction of a complex object from its representation. You set only the fields you want via a fluent chain and call build() once — readable, order-independent, and able to produce an immutable result.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "The telescoping-constructor problem",
        body: "With many optional fields you either write a constructor for every combination (telescoping constructors — combinatorial and unreadable) or a single fat constructor where callers pass a confusing line of positional args, easy to transpose. Setters fix readability but force mutability and let an object exist in a half-built, invalid state." },
      { kind: "code", heading: "Builder structure (Java)",
        body: "class Pizza {\n    private final String size; private final boolean cheese;\n    private Pizza(Builder b) { this.size = b.size; this.cheese = b.cheese; }\n    static class Builder {\n        private String size = \"M\"; private boolean cheese = false;\n        Builder size(String s)    { this.size = s; return this; }   // fluent: return this\n        Builder cheese(boolean c) { this.cheese = c; return this; }\n        Pizza build()            { return new Pizza(this); }        // validate here\n    }\n}\n// new Pizza.Builder().size(\"L\").cheese(true).build();" },
      { kind: "concept", heading: "Why it wins",
        body: "Each setter returns `this` so calls chain fluently and self-document (size(\"L\").cheese(true)). The product's constructor is private, so the ONLY way to build it is through the builder — the object is never observed half-constructed, and can be made immutable (final fields). build() is the single place to validate invariants and throw if the combination is illegal." },
      { kind: "concept", heading: "When to reach for it",
        body: "Use Builder when an object has many optional parameters, when you want immutability, or when construction has steps/validation. Don't use it for a 2-field value object — a plain constructor is clearer. Effective Java (Item 2) recommends Builder once you pass ~4+ constructor parameters." },
      { kind: "concept", heading: "Where you'll see it",
        body: "The JDK and ecosystem are full of builders: StringBuilder, Stream.Builder, HttpRequest.newBuilder()...build() (java.net.http), java.time's date builders, and Lombok's @Builder which generates the whole nested class for you. Test frameworks use builders for fixtures (a `UserBuilder().withEmail(...).build()`). The fluent, chainable, build()-terminated shape is the unmistakable signature." },
    ] },
    interviewRelevance: "Builder is the standard answer to 'how would you construct this object with many optional fields cleanly?' and appears in nearly every case study (building a Pizza/Order/HttpRequest). Knowing it pairs with immutability is a strong signal.",
    commonGaps: { gaps: [
      "Forgetting to return `this` from setters, breaking the fluent chain.",
      "Leaving the product's constructor public, so callers bypass the builder and the immutability guarantee.",
      "Using Builder for trivially small objects where a constructor is clearer.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 35, difficulty: 0.4, xpReward: 50, visualizer: null,
  },
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m2_t2", topicNumber: 2,
    name: "Abstract Factory Pattern", slug: "abstract-factory-pattern",
    metadata: { estimated_minutes: 35, difficulty: 3, prerequisites: ["lld_m1_t6"], tags: ["creational", "abstract-factory", "product-family"] },
    hook: {
      question: "Your app must render either a Windows look (WinButton + WinCheckbox) or a Mac look (MacButton + MacCheckbox) — and never mix a WinButton with a MacCheckbox. How do you guarantee a consistent family?",
      insight: "Abstract Factory provides an interface for creating FAMILIES of related objects without specifying their concrete classes. One factory per family produces matching products, so a single factory choice locks in a consistent set.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Abstract Factory defines an interface with a creation method for each product in a family (createButton, createCheckbox). Concrete factories (WinFactory, MacFactory) implement the whole family consistently. Client code holds an abstract factory and gets matching products — it never sees a concrete product class." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Button { String render(); }\ninterface Checkbox { String render(); }\ninterface GuiFactory {                 // the abstract factory\n    Button createButton();\n    Checkbox createCheckbox();\n}\nclass WinFactory implements GuiFactory {\n    public Button createButton()     { return new WinButton(); }\n    public Checkbox createCheckbox() { return new WinCheckbox(); }\n}\n// client: GuiFactory f = isWindows ? new WinFactory() : new MacFactory();\n//         Button b = f.createButton();  // guaranteed to match the checkbox" },
      { kind: "concept", heading: "Factory Method vs Abstract Factory",
        body: "Factory Method creates ONE product via an overridable method. Abstract Factory creates a FAMILY of related products via an object whose methods each return a different product type. Abstract Factory is often implemented with several Factory Methods. Use it when products must be used together and mixing families would be a bug." },
      { kind: "concept", heading: "Trade-off",
        body: "Adding a new product to the family means changing the factory interface and every concrete factory — so it's rigid against new product TYPES but excellent at adding new FAMILIES (just add one new concrete factory). Choose it only when the 'consistent family' guarantee is real; otherwise a Simple Factory is lighter." },
      { kind: "concept", heading: "Where you'll see it",
        body: "javax.xml's DocumentBuilderFactory / TransformerFactory create families of parser objects; JDBC drivers produce a matching family of Connection/Statement/ResultSet for a given database; cross-platform UI toolkits create a coherent set of widgets per look-and-feel. The tell is a factory object (not just a static method) whose several methods each return a different product that must work together." },
    ] },
    interviewRelevance: "Abstract Factory comes up for cross-platform UI, database-driver families, and theme systems. The discriminating question is always 'how is this different from Factory Method?' — answer: one product vs a consistent family.",
    commonGaps: { gaps: [
      "Confusing it with Factory Method (one product) — Abstract Factory makes a whole family.",
      "Reaching for it when there's only one product type (a Simple Factory suffices).",
      "Not seeing that adding a new product type forces edits across all concrete factories.",
    ] },
    prerequisites: ["lld_m1_t6"], estimatedMinutes: 35, difficulty: 0.5, xpReward: 50, visualizer: null,
  },
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m2_t3", topicNumber: 3,
    name: "Prototype Pattern", slug: "prototype-pattern",
    metadata: { estimated_minutes: 30, difficulty: 2, prerequisites: ["lld_m1_t1"], tags: ["creational", "prototype", "clone", "deep-copy"] },
    hook: {
      question: "Constructing an object is expensive (a 200-field config loaded from disk), and you need 50 near-identical copies. Do you rebuild each from scratch?",
      insight: "Prototype creates new objects by CLONING an existing instance rather than constructing from scratch. When building is costly or you only need small variations of a configured object, copy-then-tweak beats rebuild-from-zero.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Prototype specifies the kinds of objects to create using a prototypical instance, and creates new objects by copying that prototype. The prototype exposes a clone() method; clients copy it and adjust a few fields instead of running an expensive constructor." },
      { kind: "concept", heading: "Shallow vs deep copy — the core gotcha",
        body: "A shallow copy duplicates the top-level fields but SHARES referenced objects (the copy and original point at the same inner List). Mutating the list through one is visible through the other. A deep copy recursively clones referenced objects so the copy is fully independent. Choosing the wrong one is the #1 Prototype bug." },
      { kind: "code", heading: "Deep clone (Java)",
        body: "class Config implements Cloneable {\n    List<String> flags;\n    Config(List<String> f) { this.flags = f; }\n    public Config deepCopy() {\n        return new Config(new ArrayList<>(this.flags)); // copy the inner list\n    }\n}\n// shallow would be: new Config(this.flags) — shares the same list (bug-prone)" },
      { kind: "concept", heading: "When to use it",
        body: "Use Prototype when object creation is expensive (DB/disk/network), when you need many variations of a configured base, or to avoid a parallel hierarchy of factory classes. A prototype registry (Map<String,Prototype>) lets clients fetch a named prototype and clone it. Note: Java's Cloneable/clone() is awkward — a copy constructor or copy method is usually clearer." },
      { kind: "concept", heading: "Where you'll see it",
        body: "Game engines spawn entities by cloning a configured template (one loaded 'enemy' prototype → thousands of copies); object pools clone a pristine instance; Spring's `prototype` bean scope returns a fresh instance per request. The everyday Java advice: skip Cloneable and write a copy constructor `new Config(existing)` or a static `Config.copyOf(existing)` — deep-copying the mutable fields explicitly so copies don't share state." },
    ] },
    interviewRelevance: "Prototype appears for object pools, game-entity spawning, and config templating. Interviewers always probe shallow-vs-deep copy — being able to show a deep copy of a nested structure is the key signal.",
    commonGaps: { gaps: [
      "Returning a shallow copy when independence is required — mutations leak between copies.",
      "Relying on Object.clone()/Cloneable, which is shallow and notoriously error-prone — prefer a copy method.",
      "Cloning when a fresh constructor would be just as cheap and clearer.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 30, difficulty: 0.4, xpReward: 50, visualizer: null,
  },
];

const EXERCISES = [
  // ── T1 Builder ──
  pm({ topicId: "lld_m2_t1", exerciseId: "lld_m2_t1_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "`new HttpRequest.Builder().url(u).header(\"A\",\"1\").timeout(30).build()` — a fluent chain of optional setters ending in build(). Which pattern?",
    options: ["Builder", "Factory", "Prototype", "Adapter"], correct: "Builder",
    explanation: "A fluent chain of optional setters that ends in build() producing an (often immutable) object is the Builder pattern." }),
  predict({ topicId: "lld_m2_t1", exerciseId: "lld_m2_t1_ex_1", position: 2, level: "easy",
    title: "Builder defaults + overrides",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    static class Pizza {
        final String size; final boolean cheese;
        private Pizza(Builder b){ size=b.size; cheese=b.cheese; }
        static class Builder {
            String size = "M"; boolean cheese = false;
            Builder size(String s){ this.size = s; return this; }
            Builder cheese(boolean c){ this.cheese = c; return this; }
            Pizza build(){ return new Pizza(this); }
        }
        public String toString(){ return size + (cheese ? "+cheese" : ""); }
    }
    public static void main(String[] args) {
        System.out.println(new Pizza.Builder().cheese(true).build());
    }
}`,
    expected: "M+cheese",
    explanation: "size was never set, so it keeps the builder default \"M\"; cheese(true) overrides the default false. toString → \"M+cheese\".",
    hints: ["Only cheese was set — size keeps its default."] }),
  code({ topicId: "lld_m2_t1", exerciseId: "lld_m2_t1_ex_2", position: 3, level: "medium",
    title: "Implement a fluent Builder",
    scenario: "Build a User with a fluent Builder: required `name`, optional `age` (default 0). Setters return the builder; build() returns the User. Print a User built with name \"Ana\" and age 30 as \"Ana/30\".",
    instructions: "Write a complete Java program (public class Main) printing a single line.",
    starterCode: `public class Main {
    static class User {
        final String name; final int age;
        private User(Builder b){ name=b.name; age=b.age; }
        // TODO: Builder with name(...), age(...), build()
        public String toString(){ return name + "/" + age; }
    }
    public static void main(String[] args) {
        // TODO: build User "Ana" age 30 and print it
    }
}`,
    expectedSolution: `public class Main {
    static class User {
        final String name; final int age;
        private User(Builder b){ name=b.name; age=b.age; }
        static class Builder {
            private String name = ""; private int age = 0;
            Builder name(String n){ this.name = n; return this; }
            Builder age(int a){ this.age = a; return this; }
            User build(){ return new User(this); }
        }
        public String toString(){ return name + "/" + age; }
    }
    public static void main(String[] args) {
        System.out.println(new User.Builder().name("Ana").age(30).build());
    }
}`,
    expectedStdout: "Ana/30",
    hints: ["Each setter sets a field and returns `this`.", "build() passes the builder to the private User constructor."] }),

  // ── T2 Abstract Factory ──
  pm({ topicId: "lld_m2_t2", exerciseId: "lld_m2_t2_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "A `GuiFactory` interface has createButton() AND createCheckbox(). WinFactory makes Win versions of both; MacFactory makes Mac versions. The client picks one factory and gets a matching set. Which pattern?",
    options: ["Abstract Factory", "Factory Method", "Builder", "Decorator"], correct: "Abstract Factory",
    explanation: "Creating a FAMILY of related products (button + checkbox) through one factory object, guaranteeing they match, is Abstract Factory." }),
  pm({ topicId: "lld_m2_t2", exerciseId: "lld_m2_t2_pm_2", position: 2, level: "medium",
    title: "Factory Method or Abstract Factory?",
    scenario: "You need to create exactly ONE product type, and subclasses of the creator decide which concrete product to instantiate by overriding a single create() method. Which pattern is this?",
    options: ["Factory Method", "Abstract Factory", "Prototype", "Singleton"], correct: "Factory Method",
    explanation: "One product, created by an overridable method whose subclasses choose the concrete class, is Factory Method. Abstract Factory makes a whole family." }),
  predict({ topicId: "lld_m2_t2", exerciseId: "lld_m2_t2_ex_1", position: 3, level: "medium",
    title: "A consistent family",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    interface Button { String render(); }
    interface Checkbox { String render(); }
    interface GuiFactory { Button button(); Checkbox checkbox(); }
    static class WinButton implements Button { public String render(){ return "WinButton"; } }
    static class WinCheckbox implements Checkbox { public String render(){ return "WinCheckbox"; } }
    static class WinFactory implements GuiFactory {
        public Button button(){ return new WinButton(); }
        public Checkbox checkbox(){ return new WinCheckbox(); }
    }
    public static void main(String[] args) {
        GuiFactory f = new WinFactory();
        System.out.println(f.button().render());
        System.out.println(f.checkbox().render());
    }
}`,
    expected: "WinButton\nWinCheckbox",
    explanation: "The WinFactory produces a matching family: its button() returns a WinButton and checkbox() a WinCheckbox. The client never names a concrete class.",
    hints: ["Both products come from the same concrete factory."] }),

  // ── T3 Prototype ──
  pm({ topicId: "lld_m2_t3", exerciseId: "lld_m2_t3_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "Loading a Document template from disk is slow. To make 50 documents you load it once, then copy that instance and tweak each copy. Which pattern?",
    options: ["Prototype", "Builder", "Factory", "Singleton"], correct: "Prototype",
    explanation: "Creating new objects by cloning an existing configured instance (instead of expensive re-construction) is the Prototype pattern." }),
  predict({ topicId: "lld_m2_t3", exerciseId: "lld_m2_t3_ex_1", position: 2, level: "medium",
    title: "Deep copy keeps copies independent",
    scenario: "What does this program print?",
    starterCode: `import java.util.*;
public class Main {
    static class Config {
        List<String> flags;
        Config(List<String> f){ flags = f; }
        Config deepCopy(){ return new Config(new ArrayList<>(flags)); }
    }
    public static void main(String[] args) {
        Config a = new Config(new ArrayList<>(Arrays.asList("x")));
        Config b = a.deepCopy();
        b.flags.add("y");
        System.out.println(a.flags.size() + "," + b.flags.size());
    }
}`,
    expected: "1,2",
    explanation: "deepCopy clones the inner list, so adding \"y\" to b's list does not affect a's. a stays size 1, b becomes size 2. A shallow copy would have printed 2,2.",
    hints: ["deepCopy made a NEW ArrayList — the two lists are independent."] }),
  pm({ topicId: "lld_m2_t3", exerciseId: "lld_m2_t3_pm_2", position: 3, level: "medium",
    title: "The Prototype footgun",
    scenario: "You clone an object with `new Config(this.flags)` (passing the same list reference). Later, mutating the clone's list also changes the original's. What kind of copy did you make, and what's the fix?",
    options: ["Shallow copy — fix by deep-copying the inner list", "Deep copy — it's correct", "Immutable copy — no fix needed", "Singleton — share one instance"],
    correct: "Shallow copy — fix by deep-copying the inner list",
    explanation: "Sharing the inner list reference is a shallow copy; mutations leak between copies. Deep-copy the referenced collections to make the clone independent." }),
];

async function upsertOne(Model, filter, doc) {
  return Model.findOneAndUpdate(filter, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  await upsertOne(ProModule, { moduleId: MODULE.moduleId }, MODULE);
  console.log(`  ✓ ProModule: ${MODULE.moduleId} — ${MODULE.name}`);
  for (const t of TOPICS) await upsertOne(ProTopic, { topicId: t.topicId }, t);
  console.log(`  ✓ ProTopics: ${TOPICS.length}`);
  let inserted = 0, updated = 0;
  for (const ex of EXERCISES) {
    const before = await ProExercise.findOne({ exerciseId: ex.exerciseId }).select("_id").lean();
    await upsertOne(ProExercise, { exerciseId: ex.exerciseId }, ex);
    before ? updated++ : inserted++;
  }
  console.log(`  ✓ ProExercises: ${EXERCISES.length} (${inserted} inserted, ${updated} updated)`);
  const totals = await recomputeLldTotals();
  console.log(`\nDone — M2 Creational Patterns seeded.`);
  console.log(`  Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
