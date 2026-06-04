/**
 * Seed — Low-Level Design (LLD) track, MVP (COMPETITIVE_GAP_ANALYSIS.md GAP #4).
 *
 * Creates a NEW standalone professional track `pro_lld` (separate from
 * `pro_java`) with one module and the foundation curriculum:
 *   OOP pillars · SOLID · UML · 6 core GoF patterns
 *   (Strategy/Observer/Factory/Singleton/Decorator/Adapter) · 2 case studies
 *   (Parking Lot, LRU Cache) · how to drive an LLD interview.
 *
 * The whole Pro stack is data-driven and generic (ProTrackPicker, getTrack,
 * enroll, the exercise runner, progress, certificates) — so a live track with
 * seeded modules/topics/exercises appears end-to-end with NO code change.
 *
 * Idempotent: upsert-by-id, safe to re-run. Re-running makes no content change
 * (verified by config/auditLldTrack.mjs, the integrity gate for this build).
 *
 * Java in code exercises stays JDK-13-safe (no records / sealed / switch
 * expressions / text blocks) because the Judge0 sandbox runs OpenJDK 13
 * (memory: project_judge0_jdk13). Code outputs are integer-based to avoid
 * floating-point formatting drift between authoring and the JVM.
 *
 * Usage:  node config/seedLldTrack.js
 * npm:    npm run seed:lld
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProTrack, ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m1";

// ── XP / difficulty by level (mirrors the Java track) ────────────────────────
function xpFor(level) {
  return level === "warmup" ? 5 : level === "easy" ? 10 : level === "medium" ? 15 : 20;
}
function diffFor(level) {
  return level === "warmup" ? 0.1 : level === "easy" ? 0.2 : level === "medium" ? 0.4 : 0.6;
}

// ── Exercise builders ────────────────────────────────────────────────────────
function code(o) {
  return {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "code_scratch",
    title: o.title, scenario: o.scenario, instructions: o.instructions ?? "",
    starterCode: o.starterCode ?? "", expectedSolution: o.expectedSolution ?? "",
    blanks: [], testCases: o.testCases, hints: o.hints ?? [],
    xpReward: xpFor(o.level), difficulty: diffFor(o.level),
  };
}
function predict(o) {
  return {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "predict_output",
    title: o.title, scenario: o.scenario, instructions: o.instructions ?? "What does this code print?",
    starterCode: o.starterCode, expectedSolution: o.expected, blanks: [],
    // predict_output grades via text_match (typed output, no compiler) — the
    // proven convention from M49/M50/M51 (acceptanceContentModules.mjs).
    testCases: [{ type: "text_match", expected: o.expected, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level),
  };
}
function pm(o) {
  return {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match",
    title: o.title, scenario: o.scenario, instructions: o.instructions ?? "Pick the best answer.",
    starterCode: "", expectedSolution: o.correct, blanks: [{ options: o.options }],
    testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level),
  };
}

// ── Track ────────────────────────────────────────────────────────────────────
const TRACK = {
  key:         TRACK_KEY,
  slug:        "lld",
  name:        "Low-Level Design — OOD, SOLID & Patterns",
  description: "Object-oriented design for interviews and real codebases: the four OOP pillars, the SOLID principles, UML, the core Gang-of-Four patterns, and full case studies (Parking Lot, LRU Cache). Taught in Java.",
  language:    "java",
  status:      "live",
};

// ── Module ───────────────────────────────────────────────────────────────────
const MODULE = {
  trackKey:       TRACK_KEY,
  moduleId:       MODULE_ID,
  moduleNumber:   1,
  name:           "Object-Oriented Design Foundations",
  slug:           "ood-foundations",
  description:    "From the four OOP pillars and the SOLID principles, through UML class diagrams and six essential design patterns, to two end-to-end LLD case studies and a repeatable interview framework.",
  estimatedHours: 8,
  prerequisites:  [],
  status:         "live",
};

// ── Topics ───────────────────────────────────────────────────────────────────
const TOPICS = [
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t1", topicNumber: 1,
    name: "The Four OOP Pillars for Design", slug: "oop-pillars",
    metadata: { estimated_minutes: 30, difficulty: 1, prerequisites: [], tags: ["oop", "encapsulation", "abstraction", "inheritance", "polymorphism"] },
    hook: {
      question: "Interviewers rarely ask 'what is inheritance?' — they ask 'why did you model this with composition instead?' What changes the answer?",
      insight: "The four pillars are not trivia; they are design levers. Encapsulation controls who can break your invariants, abstraction decides what callers depend on, and polymorphism is what lets you add behaviour without editing existing code. Good LLD is choosing the right pillar for the job.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Encapsulation — protect the invariants",
        body: "Encapsulation means the object owns its data and the only way to change it is through methods that keep the object valid. A BankAccount with a private balance and a deposit/withdraw API can never go negative by accident — the invariant lives in one place. Public mutable fields scatter that responsibility across every caller." },
      { kind: "concept", heading: "Abstraction — depend on the what, not the how",
        body: "Abstraction is exposing a small, stable surface (an interface or abstract method) while hiding the implementation behind it. Callers of a List don't care whether it's an ArrayList or LinkedList. In design, every place you can program to an interface is a place you can later swap implementations without touching callers." },
      { kind: "concept", heading: "Inheritance vs Composition — prefer composition",
        body: "Inheritance models 'is-a' and reuses code by extending a base class — but it couples the subclass to the parent's internals and you can only extend one class. Composition models 'has-a' by holding a reference to a collaborator. The industry rule of thumb (and a classic interview answer) is 'favour composition over inheritance': it's more flexible and avoids fragile base-class hierarchies." },
      { kind: "concept", heading: "Polymorphism — the engine of extensibility",
        body: "Polymorphism lets one call site invoke different behaviour depending on the runtime type. `shape.area()` runs Circle.area() or Square.area() without the caller knowing which. This is what makes the Open/Closed Principle possible: you add a new Shape subclass and existing code keeps working, because it only ever calls the abstract method." },
    ] },
    interviewRelevance: "Every LLD interview opens here. The discriminating signal is not defining the pillars but applying them: choosing composition over inheritance, and recognising that polymorphism is how you avoid editing existing code.",
    commonGaps: { gaps: [
      "Treating inheritance as the default reuse mechanism instead of composition.",
      "Confusing abstraction (hiding the how) with encapsulation (protecting the data).",
      "Exposing public fields and then defending invariants in every caller.",
    ] },
    prerequisites: [], estimatedMinutes: 30, difficulty: 0.2, xpReward: 40, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t2", topicNumber: 2,
    name: "The SOLID Principles", slug: "solid-principles",
    metadata: { estimated_minutes: 45, difficulty: 2, prerequisites: ["lld_m1_t1"], tags: ["solid", "srp", "ocp", "lsp", "isp", "dip"] },
    hook: {
      question: "Five principles, one goal — what is the single property all of SOLID is trying to buy you?",
      insight: "Changeability. Each principle isolates a different reason code resists change: too many responsibilities (SRP), edits to add features (OCP), surprising subclasses (LSP), fat interfaces (ISP), and hard-wired dependencies (DIP). SOLID is a checklist for 'will this hurt to change in six months?'",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "S — Single Responsibility Principle",
        body: "A class should have one reason to change. An Invoice class that calculates totals AND formats a PDF AND saves to the database has three reasons to change and three teams editing it. Split into InvoiceCalculator, InvoiceRenderer, InvoiceRepository. The test: can you describe the class's job in one sentence without 'and'?" },
      { kind: "concept", heading: "O — Open/Closed Principle",
        body: "Software should be open for extension but closed for modification. You should add new behaviour by adding new code (a new subclass / strategy), not by editing a growing if/else or switch over a type. A PaymentProcessor with `if (type==CARD) ... else if (type==UPI) ...` violates OCP — every new method edits the same file. Polymorphism fixes it." },
      { kind: "concept", heading: "L — Liskov Substitution Principle",
        body: "A subtype must be usable anywhere its base type is expected, without surprises. The classic violation: Square extends Rectangle, then setWidth also changes height, breaking code that assumed width and height are independent. If a subclass strengthens preconditions or weakens postconditions, it breaks LSP — and callers written against the base type." },
      { kind: "concept", heading: "I — Interface Segregation Principle",
        body: "Don't force a class to implement methods it doesn't need. A fat `Worker` interface with work() AND eat() forces a RobotWorker to stub out eat(). Split into Workable and Feedable so each implementer only depends on what it actually uses. Many small role interfaces beat one large one." },
      { kind: "concept", heading: "D — Dependency Inversion Principle",
        body: "High-level modules should depend on abstractions, not concretions — and so should low-level modules. An OrderService that `new`s a MySQLOrderRepository is welded to MySQL. Instead, OrderService depends on an OrderRepository interface and receives the implementation via its constructor (dependency injection). This is what makes code testable and swappable." },
    ] },
    interviewRelevance: "SOLID is the vocabulary interviewers use to critique your design. Being able to name which principle a smell violates — and refactor it live — separates senior candidates from juniors.",
    commonGaps: { gaps: [
      "Reciting the acronym but not spotting a live SRP/OCP violation in given code.",
      "Confusing DIP (depend on abstractions) with dependency injection (one way to achieve it).",
      "Thinking ISP means 'small classes' rather than 'small, role-focused interfaces'.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 45, difficulty: 0.4, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t3", topicNumber: 3,
    name: "UML Class Diagrams for LLD", slug: "uml-class-diagrams",
    metadata: { estimated_minutes: 35, difficulty: 2, prerequisites: ["lld_m1_t1"], tags: ["uml", "association", "aggregation", "composition", "multiplicity"] },
    hook: {
      question: "On a whiteboard, what's the difference between the diamond on a line and an arrowhead — and why does the interviewer care?",
      insight: "UML relationship notation encodes ownership and lifecycle. A filled diamond (composition) says 'when I die, my parts die'; a hollow diamond (aggregation) says 'I hold them but they outlive me'. Getting this right shows you understand object lifetimes, not just boxes and lines.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Classes, attributes, operations",
        body: "A UML class box has three compartments: name, attributes (fields), and operations (methods). Visibility markers: + public, - private, # protected. You sketch only the fields/methods relevant to the design discussion, never the whole class." },
      { kind: "concept", heading: "Association, Aggregation, Composition",
        body: "Association is a plain 'uses/knows' link (a Driver drives a Car) — a solid line. Aggregation is a whole-part where the part can exist independently (a Team has Players; players survive the team) — a hollow diamond on the whole's end. Composition is a strong whole-part where the part's lifetime is bound to the whole (a House has Rooms; destroy the house, the rooms go) — a filled diamond." },
      { kind: "concept", heading: "Inheritance and realization",
        body: "A hollow triangle arrow from subclass to superclass means 'extends' (generalization). A hollow triangle with a dashed line means 'implements' an interface (realization). Dependency (a dashed arrow) means one class uses another transiently, e.g. as a method parameter." },
      { kind: "concept", heading: "Multiplicity",
        body: "Numbers on the ends of an association state how many instances participate: 1, 0..1 (optional), 1..* (one or more), * (many). 'An Order has 1..* LineItems' tells you an Order with zero items is invalid — a real invariant you'd enforce in code." },
    ] },
    interviewRelevance: "You'll draw a class diagram in almost every LLD round. Correct composition-vs-aggregation diamonds and multiplicities signal that you reason about ownership and invariants, not just class names.",
    commonGaps: { gaps: [
      "Using composition (filled diamond) when the part clearly outlives the whole.",
      "Omitting multiplicities, hiding real invariants like 'an order must have at least one item'.",
      "Drawing an arrow for inheritance the wrong direction (it points to the parent).",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 35, difficulty: 0.4, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t4", topicNumber: 4,
    name: "Strategy Pattern", slug: "strategy-pattern",
    metadata: { estimated_minutes: 35, difficulty: 2, prerequisites: ["lld_m1_t1", "lld_m1_t2"], tags: ["design-pattern", "behavioral", "strategy", "ocp"] },
    hook: {
      question: "Your checkout has a growing if/else over payment types. Every new method edits that file. Which principle is screaming, and which pattern silences it?",
      insight: "The growing conditional violates Open/Closed. Strategy replaces it: define a family of interchangeable algorithms behind one interface, and let the context hold a reference to whichever one it needs. Adding a method becomes adding a class, not editing a switch.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Strategy defines a family of algorithms, encapsulates each one behind a common interface, and makes them interchangeable at runtime. The context delegates the varying behaviour to a strategy object it holds, instead of implementing every variant itself." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface PaymentStrategy { void pay(int amountCents); }\nclass CardPayment implements PaymentStrategy { public void pay(int a){ /* ... */ } }\nclass UpiPayment  implements PaymentStrategy { public void pay(int a){ /* ... */ } }\n\nclass Checkout {              // the Context\n    private PaymentStrategy strategy;\n    Checkout(PaymentStrategy s) { this.strategy = s; }\n    void setStrategy(PaymentStrategy s) { this.strategy = s; }\n    void confirm(int amountCents) { strategy.pay(amountCents); }\n}" },
      { kind: "concept", heading: "Why it beats the conditional",
        body: "Each algorithm lives in its own class (SRP), new algorithms are added without editing the context (OCP), and the strategy can be swapped at runtime — even injected for testing. The context depends only on the PaymentStrategy abstraction (DIP)." },
      { kind: "concept", heading: "Strategy vs State",
        body: "Strategy and State share the same structure (a context delegating to an interface) but differ in intent: Strategy's variants are independent algorithms chosen by the client; State's variants represent the object's mode and transition between themselves. If the objects decide the next object, it's State; if the client picks, it's Strategy." },
    ] },
    interviewRelevance: "Strategy is the single most-cited refactor for replacing conditionals. Recognising 'this if/else over a type should be Strategy' is a near-guaranteed talking point in design rounds.",
    commonGaps: { gaps: [
      "Adding a new strategy by editing the context instead of adding a class.",
      "Confusing Strategy with State because the structure looks identical.",
      "Making the strategy interface fat (multiple unrelated methods) — violates ISP.",
    ] },
    prerequisites: ["lld_m1_t1", "lld_m1_t2"], estimatedMinutes: 35, difficulty: 0.4, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t5", topicNumber: 5,
    name: "Observer Pattern", slug: "observer-pattern",
    metadata: { estimated_minutes: 35, difficulty: 2, prerequisites: ["lld_m1_t1"], tags: ["design-pattern", "behavioral", "observer", "pub-sub"] },
    hook: {
      question: "A stock price changes and three dashboards must update. How do you notify them without the stock knowing what a dashboard is?",
      insight: "Observer inverts the dependency: the subject keeps a list of observers behind an interface and calls update() on each when its state changes. It knows it has observers, not what they are — so you can add a fourth dashboard without touching the stock.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Observer defines a one-to-many dependency so that when one object (the subject / observable) changes state, all its dependents (observers) are notified and updated automatically. It is the foundation of event systems and publish-subscribe." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Observer { void update(int price); }\n\nclass Stock {                         // the Subject\n    private final List<Observer> observers = new ArrayList<>();\n    private int price;\n    void subscribe(Observer o)   { observers.add(o); }\n    void unsubscribe(Observer o) { observers.remove(o); }\n    void setPrice(int p) {\n        this.price = p;\n        for (Observer o : observers) o.update(p);   // notify\n    }\n}" },
      { kind: "concept", heading: "Push vs pull",
        body: "In the push model the subject passes the changed data to update(data). In the pull model it passes only itself (update(subject)) and observers query what they need. Push is simpler; pull decouples observers from the exact shape of the change at the cost of an extra call back into the subject." },
      { kind: "concept", heading: "Pitfalls",
        body: "Forgetting to unsubscribe is the classic memory leak — the subject holds observers alive forever. Notifying while iterating the observer list can throw ConcurrentModificationException if an observer unsubscribes during update(); iterate over a copy. Order of notification should not be relied upon." },
    ] },
    interviewRelevance: "Observer underpins event-driven design, MVC, and reactive UIs. Interviewers probe the lifecycle (unsubscribe) and concurrency (notify during iteration) pitfalls — naming them unprompted is a strong signal.",
    commonGaps: { gaps: [
      "Memory leaks from never unsubscribing.",
      "ConcurrentModificationException when an observer unsubscribes inside update().",
      "Coupling the subject to concrete observer types instead of the Observer interface.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 35, difficulty: 0.4, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t6", topicNumber: 6,
    name: "Factory Pattern", slug: "factory-pattern",
    metadata: { estimated_minutes: 30, difficulty: 2, prerequisites: ["lld_m1_t1", "lld_m1_t2"], tags: ["design-pattern", "creational", "factory", "factory-method"] },
    hook: {
      question: "Twelve files all do `new MySQLConnection()`. You switch to Postgres. How many files must you edit — and how do you make that number 1?",
      insight: "A Factory centralises object creation behind one method, so the 'which concrete class' decision lives in exactly one place. Callers ask the factory for an abstraction and never see a constructor of a concrete type.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Simple Factory",
        body: "A Simple Factory is a single method that returns a product based on a parameter: `ShapeFactory.create(\"circle\")` returns a Shape. It's not a formal GoF pattern but is the most common real-world use — it isolates `new` so callers depend only on the Shape interface." },
      { kind: "code", heading: "Simple Factory (Java)",
        body: "interface Shape { String draw(); }\nclass Circle implements Shape { public String draw(){ return \"Circle\"; } }\nclass Square implements Shape { public String draw(){ return \"Square\"; } }\n\nclass ShapeFactory {\n    static Shape create(String kind) {\n        if (kind.equals(\"circle\")) return new Circle();\n        if (kind.equals(\"square\")) return new Square();\n        throw new IllegalArgumentException(\"unknown: \" + kind);\n    }\n}" },
      { kind: "concept", heading: "Factory Method (the GoF pattern)",
        body: "Factory Method defines an abstract creator with a `createProduct()` method that subclasses override to decide the concrete product. The creator's other methods use the product through its interface. This pushes the creation decision into subclasses rather than a parameter — useful when each subtype of creator naturally pairs with a subtype of product." },
      { kind: "concept", heading: "Why factories help",
        body: "They satisfy DIP (callers depend on the product interface, not concretions) and OCP (add a product by extending the factory, not editing callers). The trade-off: a Simple Factory still has one switch you edit per new type — acceptable because it's the ONLY such place." },
    ] },
    interviewRelevance: "Factories appear in nearly every case study (creating Vehicles in a parking lot, Notifications by channel). The key insight interviewers want: centralise creation so the concrete-type decision lives in one place.",
    commonGaps: { gaps: [
      "Confusing Simple Factory (a method with a switch) with Factory Method (subclasses override creation).",
      "Spreading `new ConcreteType()` across callers, defeating the point.",
      "Over-engineering with Abstract Factory when a Simple Factory suffices.",
    ] },
    prerequisites: ["lld_m1_t1", "lld_m1_t2"], estimatedMinutes: 30, difficulty: 0.4, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t7", topicNumber: 7,
    name: "Singleton Pattern (and its pitfalls)", slug: "singleton-pattern",
    metadata: { estimated_minutes: 30, difficulty: 2, prerequisites: ["lld_m1_t1"], tags: ["design-pattern", "creational", "singleton", "thread-safety"] },
    hook: {
      question: "Singleton is the most-known and most-criticised pattern at once. Why do interviewers ask you to write it AND to argue against it?",
      insight: "Writing a correct thread-safe Singleton tests your concurrency knowledge; criticising it tests your design maturity. A Singleton is global mutable state in disguise — it hurts testability and hides dependencies. Knowing both sides is the whole point.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Singleton ensures a class has exactly one instance and provides a global access point to it. Used for things that are genuinely single: a configuration registry, a connection pool, a logger." },
      { kind: "code", heading: "Thread-safe Singleton — eager + holder idiom",
        body: "// Eager: simplest, created at class load, inherently thread-safe.\nclass Config {\n    private static final Config INSTANCE = new Config();\n    private Config() {}\n    static Config get() { return INSTANCE; }\n}\n\n// Lazy + thread-safe without locking on every call (initialization-on-demand holder):\nclass Registry {\n    private Registry() {}\n    private static class Holder { static final Registry INSTANCE = new Registry(); }\n    static Registry get() { return Holder.INSTANCE; }\n}" },
      { kind: "concept", heading: "The broken lazy version",
        body: "The naive `if (instance == null) instance = new X();` is NOT thread-safe — two threads can both see null and create two instances. The fixes are: synchronize the accessor (slow), use double-checked locking with a `volatile` field (subtle, easy to get wrong), or the holder idiom above (lazy, lock-free, correct). The holder idiom is the recommended Java answer." },
      { kind: "concept", heading: "Why it's an anti-pattern when overused",
        body: "A Singleton is global state: it hides dependencies (a class secretly uses Config.get() instead of declaring it), makes unit tests share state, and is hard to mock. Modern designs prefer dependency injection — create one instance at the composition root and pass it in. Use Singleton sparingly and never for mutable shared state you'll want to test." },
    ] },
    interviewRelevance: "Expect to write a thread-safe Singleton AND explain why you'd often avoid it in favour of DI. The double-checked-locking 'volatile' detail and the holder idiom are common follow-ups.",
    commonGaps: { gaps: [
      "Writing the non-thread-safe lazy version and calling it done.",
      "Forgetting `volatile` in double-checked locking.",
      "Not being able to articulate the testability/global-state downside.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 30, difficulty: 0.4, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t8", topicNumber: 8,
    name: "Decorator Pattern", slug: "decorator-pattern",
    metadata: { estimated_minutes: 35, difficulty: 3, prerequisites: ["lld_m1_t1", "lld_m1_t4"], tags: ["design-pattern", "structural", "decorator", "composition"] },
    hook: {
      question: "A coffee can have milk, sugar, cream, in any combination. Do you create a class for every combination — MilkSugarCreamCoffee — or is there a better way?",
      insight: "Subclassing every combination explodes combinatorially. Decorator wraps an object in another object of the same type that adds behaviour, so you stack features at runtime: new Sugar(new Milk(new Coffee())). Composition over a subclass explosion.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Decorator attaches additional responsibilities to an object dynamically by wrapping it in a decorator that implements the same interface and delegates to the wrapped object, adding behaviour before or after. It's a flexible alternative to subclassing for extending behaviour." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Beverage { int costCents(); }\nclass Espresso implements Beverage { public int costCents(){ return 200; } }\n\nabstract class AddOn implements Beverage {   // the Decorator base\n    protected final Beverage inner;\n    AddOn(Beverage inner) { this.inner = inner; }\n}\nclass Milk  extends AddOn { Milk(Beverage b){ super(b);} public int costCents(){ return inner.costCents() + 50; } }\nclass Sugar extends AddOn { Sugar(Beverage b){ super(b);} public int costCents(){ return inner.costCents() + 25; } }\n\n// usage: new Sugar(new Milk(new Espresso())).costCents()  ->  275" },
      { kind: "concept", heading: "Why wrapping beats subclassing",
        body: "Each feature is one decorator class; combinations are built at runtime by nesting. N features give 2^N combinations with only N classes instead of 2^N subclasses. Java's own java.io is built this way: new BufferedReader(new InputStreamReader(System.in))." },
      { kind: "concept", heading: "Decorator vs Adapter vs Proxy",
        body: "All three wrap an object. Decorator keeps the same interface and ADDS behaviour. Adapter CHANGES the interface to one the client expects. Proxy keeps the same interface but CONTROLS access (lazy loading, access checks, caching) without adding new features." },
    ] },
    interviewRelevance: "Decorator is the canonical answer to 'avoid a subclass explosion'. Recognising java.io as a real-world decorator chain is a strong, concrete talking point.",
    commonGaps: { gaps: [
      "Reaching for subclasses per combination instead of stacking decorators.",
      "Confusing Decorator (adds behaviour, same interface) with Adapter (changes interface).",
      "Decorators that don't delegate to the wrapped object, breaking the chain.",
    ] },
    prerequisites: ["lld_m1_t1", "lld_m1_t4"], estimatedMinutes: 35, difficulty: 0.5, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t9", topicNumber: 9,
    name: "Adapter Pattern", slug: "adapter-pattern",
    metadata: { estimated_minutes: 30, difficulty: 2, prerequisites: ["lld_m1_t1"], tags: ["design-pattern", "structural", "adapter", "integration"] },
    hook: {
      question: "Your code expects a PaymentGateway interface, but the third-party SDK exposes chargeCustomer(...). You can't edit the SDK. How do you bridge them?",
      insight: "An Adapter implements the interface your code expects and internally translates calls to the incompatible API. It's the universal answer to 'make two interfaces that should work together actually fit', without touching either side.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Adapter converts the interface of a class into another interface clients expect. It lets classes work together that couldn't otherwise because of incompatible interfaces — the way a travel plug adapter lets your charger fit a foreign socket." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface PaymentGateway { boolean pay(int cents); }      // what our code expects\n\nclass StripeSdk {                                          // the adaptee (can't change)\n    boolean chargeCents(int amount) { /* ... */ return true; }\n}\n\nclass StripeAdapter implements PaymentGateway {            // the adapter\n    private final StripeSdk sdk = new StripeSdk();\n    public boolean pay(int cents) { return sdk.chargeCents(cents); }\n}" },
      { kind: "concept", heading: "Object adapter vs class adapter",
        body: "An object adapter HOLDS the adaptee as a field and delegates (composition) — the common, flexible form shown above. A class adapter EXTENDS the adaptee (multiple inheritance) — rarely usable in Java since you can only extend one class. Prefer the object adapter." },
      { kind: "concept", heading: "Where it shows up",
        body: "Wrapping third-party SDKs and legacy APIs behind your own interfaces is the everyday use. It also localises the blast radius of a vendor swap: change the adapter, not the callers. This is DIP and OCP working together at an integration boundary." },
    ] },
    interviewRelevance: "Adapter is the standard answer for integrating a third-party or legacy API you can't modify. Distinguishing it from Decorator and Facade is a frequent follow-up.",
    commonGaps: { gaps: [
      "Confusing Adapter (changes interface) with Decorator (same interface, adds behaviour) or Facade (simplifies a subsystem).",
      "Leaking the adaptee's types through the adapter, defeating the decoupling.",
      "Editing callers to fit the SDK instead of writing one adapter.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 30, difficulty: 0.4, xpReward: 50, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t10", topicNumber: 10,
    name: "Case Study — Design a Parking Lot", slug: "case-study-parking-lot",
    metadata: { estimated_minutes: 50, difficulty: 3, prerequisites: ["lld_m1_t2", "lld_m1_t4", "lld_m1_t6"], tags: ["case-study", "lld", "parking-lot", "patterns"] },
    hook: {
      question: "'Design a parking lot' is the most-asked LLD question. Where do you start so you don't freeze — entities, or code?",
      insight: "Always start from requirements and entities, never code. Nail the nouns (ParkingLot, Level, Spot, Vehicle, Ticket), their relationships and multiplicities, then layer patterns (Strategy for fee rules, Factory for vehicles) onto a clean object model.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Step 1 — clarify requirements",
        body: "State assumptions out loud: multiple levels; spot sizes (motorcycle, compact, large); a vehicle fits certain spot sizes; issue a ticket on entry; charge by duration on exit; track availability per level. Ask what's in scope — payments? multiple entrances? — to bound the problem." },
      { kind: "concept", heading: "Step 2 — identify entities and relationships",
        body: "Core nouns become classes: ParkingLot (1) composes Levels (1..*); a Level composes ParkingSpots (1..*); a ParkingSpot may hold 0..1 Vehicle; a Ticket links a Vehicle, a Spot, and timestamps. Vehicle is abstract with subtypes Motorcycle/Car/Truck (each declares the spot size it needs). Composition diamonds: levels and spots die with the lot." },
      { kind: "code", heading: "Skeleton (Java)",
        body: "enum SpotSize { MOTORCYCLE, COMPACT, LARGE }\n\nabstract class Vehicle { abstract SpotSize requiredSize(); }\nclass Car extends Vehicle { SpotSize requiredSize(){ return SpotSize.COMPACT; } }\n\nclass ParkingSpot {\n    final SpotSize size; private Vehicle current;\n    ParkingSpot(SpotSize s){ this.size = s; }\n    boolean isFree(){ return current == null; }\n    boolean canFit(Vehicle v){ return isFree() && v.requiredSize() == size; }\n    void park(Vehicle v){ this.current = v; }\n    void vacate(){ this.current = null; }\n}\n\ninterface FeeStrategy { int feeCents(long minutes); }   // Strategy for pricing" },
      { kind: "concept", heading: "Step 3 — apply patterns where they earn their place",
        body: "FeeStrategy (Strategy) lets you swap flat vs hourly vs surge pricing without touching the lot. A VehicleFactory (Factory) centralises vehicle creation from a type code. If spot availability must update displays, Observer notifies entrance panels. Don't force patterns — introduce each only when a real axis of change justifies it." },
      { kind: "concept", heading: "Step 4 — the key APIs",
        body: "ParkingLot.parkVehicle(Vehicle) -> Optional<Ticket> (finds a fitting free spot, or empty if full); ParkingLot.unpark(Ticket) -> int feeCents (vacates the spot, computes the fee via the strategy). Keep the public surface small and intention-revealing." },
    ] },
    interviewRelevance: "The parking lot is the most common 45-minute LLD prompt. Interviewers grade your process (requirements → entities → relationships → patterns → APIs) as much as the final classes.",
    commonGaps: { gaps: [
      "Jumping to code before fixing requirements and entities.",
      "Hard-coding the pricing rule instead of isolating it behind a strategy.",
      "Modelling spots and vehicles with one mega-class instead of cohesive small classes.",
    ] },
    prerequisites: ["lld_m1_t2", "lld_m1_t4", "lld_m1_t6"], estimatedMinutes: 50, difficulty: 0.5, xpReward: 60, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t11", topicNumber: 11,
    name: "Case Study — Design an LRU Cache", slug: "case-study-lru-cache",
    metadata: { estimated_minutes: 45, difficulty: 3, prerequisites: ["lld_m1_t1"], tags: ["case-study", "lld", "lru-cache", "data-structures"] },
    hook: {
      question: "get and put must both be O(1), and on overflow you evict the least-recently-used key. Which two data structures, combined, give you that?",
      insight: "A HashMap gives O(1) lookup; a doubly-linked list gives O(1) move-to-front and remove-from-tail. Combine them — map key → node, list ordered by recency — and both operations are O(1). This is the most-asked design-with-data-structures problem.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "The requirement",
        body: "A fixed-capacity cache. get(key) returns the value and marks the key most-recently-used. put(key,value) inserts/updates and marks it most-recently-used; if over capacity, evict the least-recently-used entry. Both must be O(1) average." },
      { kind: "concept", heading: "Why HashMap alone isn't enough",
        body: "A HashMap gives O(1) get/put but has no notion of order, so finding the least-recently-used key to evict would be O(n). You need an ordering structure that supports O(1) removal of an arbitrary node and O(1) append — a doubly-linked list, with the map storing a direct pointer to each key's node." },
      { kind: "code", heading: "The pragmatic Java answer — LinkedHashMap",
        body: "class LruCache<K,V> extends LinkedHashMap<K,V> {\n    private final int capacity;\n    LruCache(int capacity) {\n        super(capacity, 0.75f, true); // accessOrder = true → iteration in LRU order\n        this.capacity = capacity;\n    }\n    @Override protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {\n        return size() > capacity;     // evict LRU automatically on put\n    }\n}" },
      { kind: "concept", heading: "The from-scratch answer (what interviewers usually want)",
        body: "Maintain HashMap<K,Node> plus a doubly-linked list with sentinel head/tail. get: if present, unlink the node and move it to the front, return its value. put: if present, update and move to front; else create a node, add to front, put in map; if size > capacity, remove the tail node (LRU) and delete its key from the map. Every step is O(1) because the map gives direct node access — no scanning." },
      { kind: "concept", heading: "Why sentinels matter",
        body: "Dummy head and tail nodes remove the null-checks for empty-list and single-element edge cases: every real node always has a non-null prev and next. This is a small trick that prevents the majority of pointer bugs in the live-coding version." },
    ] },
    interviewRelevance: "LRU cache (Leetcode 146) is asked as both an algorithms and an LLD question. The signal is recognising the HashMap + doubly-linked-list combination and handling the eviction edge cases cleanly.",
    commonGaps: { gaps: [
      "Using only a HashMap and scanning to find the LRU key (O(n) eviction).",
      "Forgetting to also delete the evicted key from the map (memory leak / stale entry).",
      "Pointer bugs from not using sentinel head/tail nodes.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 45, difficulty: 0.5, xpReward: 60, visualizer: null,
  },

  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m1_t12", topicNumber: 12,
    name: "Driving an LLD Interview", slug: "driving-an-lld-interview",
    metadata: { estimated_minutes: 30, difficulty: 2, prerequisites: ["lld_m1_t10", "lld_m1_t11"], tags: ["interview", "framework", "process"] },
    hook: {
      question: "Two candidates know the same patterns. One passes, one doesn't. What does the one who passes do in the first five minutes?",
      insight: "They clarify scope and state assumptions before drawing anything. A repeatable framework — requirements, entities, relationships, patterns, APIs, edge cases — keeps you calm and legible. Interviewers grade the process at least as much as the final diagram.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "The six-step framework",
        body: "1) Clarify requirements and scope (ask, don't assume). 2) Identify core entities (the nouns). 3) Define relationships and multiplicities (who owns whom). 4) Apply patterns only where a real axis of change justifies them. 5) Specify the key public APIs. 6) Walk edge cases and extensions. Narrate each step out loud." },
      { kind: "concept", heading: "Functional vs non-functional requirements",
        body: "Separate WHAT it does (park a vehicle, issue a ticket) from the QUALITIES (thread-safety, scale, latency). Confirm which non-functionals are in scope early — designing for concurrency you weren't asked about wastes your 45 minutes." },
      { kind: "concept", heading: "Identify nouns and verbs",
        body: "Nouns in the prompt become candidate classes; verbs become methods. 'A user books a seat for a show' → User, Seat, Show, Booking classes; book() method. This mechanical first pass gets you to a class list fast, which you then refine for cohesion." },
      { kind: "concept", heading: "Don't over-engineer",
        body: "The most common senior-level mistake is forcing five patterns into a problem that needs one. Introduce a pattern only when you can name the change it absorbs ('pricing will vary → Strategy'). A clean object model with one well-placed pattern beats a pattern zoo." },
    ] },
    interviewRelevance: "This framework is the meta-skill that ties the track together. Candidates who follow a visible, repeatable process under pressure consistently outscore those who improvise, even with equal pattern knowledge.",
    commonGaps: { gaps: [
      "Coding before clarifying scope and assumptions.",
      "Designing for non-functional requirements that were never asked for.",
      "Over-applying patterns instead of justifying each by a concrete axis of change.",
    ] },
    prerequisites: ["lld_m1_t10", "lld_m1_t11"], estimatedMinutes: 30, difficulty: 0.4, xpReward: 50, visualizer: null,
  },
];

// ── Exercises ─────────────────────────────────────────────────────────────────
const EXERCISES = [
  // ── T1: OOP Pillars ─────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t1", exerciseId: "lld_m1_t1_pm_1", position: 1, level: "easy",
    title: "Which pillar protects the invariant?",
    scenario: "A BankAccount keeps `balance` private and only changes it through deposit() and withdraw(), which reject overdrafts. No caller can ever push the balance negative. Which OOP pillar is doing this work?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    correct: "Encapsulation",
    explanation: "Encapsulation hides the data and funnels every change through methods that enforce the invariant (balance ≥ 0) in one place.",
  }),
  pm({
    topicId: "lld_m1_t1", exerciseId: "lld_m1_t1_pm_2", position: 2, level: "easy",
    title: "Is-a or has-a?",
    scenario: "You're modelling a Car that needs an Engine. The Engine has its own complex behaviour and you may swap engine types. Should Car EXTEND Engine, or HOLD an Engine?",
    options: ["Hold an Engine (composition)", "Extend Engine (inheritance)", "Both — extend and hold", "Neither — make Engine static"],
    correct: "Hold an Engine (composition)",
    explanation: "A car is not a kind of engine; it HAS one. Composition models has-a, keeps the two decoupled, and lets you swap engine types. 'Favour composition over inheritance.'",
  }),
  predict({
    topicId: "lld_m1_t1", exerciseId: "lld_m1_t1_ex_1", position: 3, level: "easy",
    title: "Runtime polymorphic dispatch",
    scenario: "What does this program print?",
    starterCode: `import java.util.*;
public class Main {
    interface Shape { String name(); }
    static class Circle implements Shape { public String name(){ return "Circle"; } }
    static class Square implements Shape { public String name(){ return "Square"; } }
    public static void main(String[] args) {
        List<Shape> shapes = Arrays.asList(new Circle(), new Square());
        for (Shape s : shapes) System.out.println(s.name());
    }
}`,
    expected: "Circle\nSquare",
    explanation: "The loop calls name() through the Shape reference, but the runtime type (Circle, then Square) decides which override runs — polymorphism in action.",
    hints: ["The declared type is Shape; the runtime type picks the method."],
  }),

  // ── T2: SOLID ─────────────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t2", exerciseId: "lld_m1_t2_pm_1", position: 1, level: "easy",
    title: "Spot the violated principle (I)",
    scenario: "An `Invoice` class computes totals, renders itself to PDF, and saves itself to the database. Which SOLID principle does it violate most directly?",
    options: ["Single Responsibility (SRP)", "Liskov Substitution (LSP)", "Interface Segregation (ISP)", "Dependency Inversion (DIP)"],
    correct: "Single Responsibility (SRP)",
    explanation: "Three responsibilities (calculate, render, persist) mean three reasons to change. Split into calculator, renderer, and repository classes.",
  }),
  pm({
    topicId: "lld_m1_t2", exerciseId: "lld_m1_t2_pm_2", position: 2, level: "medium",
    title: "Spot the violated principle (II)",
    scenario: "A `PaymentProcessor.process(type)` is a long `if (type==CARD) ... else if (type==UPI) ... else if (type==WALLET) ...`. Every new method means editing this method. Which principle does this violate, and which pattern fixes it?",
    options: ["Open/Closed (OCP) — fix with Strategy", "Single Responsibility — fix with Singleton", "Liskov — fix with inheritance", "Interface Segregation — fix with Adapter"],
    correct: "Open/Closed (OCP) — fix with Strategy",
    explanation: "Editing existing code to add a variant violates OCP. Strategy makes each payment method a class so you extend by adding, not editing.",
  }),
  pm({
    topicId: "lld_m1_t2", exerciseId: "lld_m1_t2_pm_3", position: 3, level: "medium",
    title: "Spot the violated principle (III)",
    scenario: "`Square extends Rectangle`. Square.setWidth(w) also sets height to w. Existing code does `r.setWidth(5); r.setHeight(4); assert r.area()==20;` — and it now fails for a Square. Which principle is broken?",
    options: ["Liskov Substitution (LSP)", "Open/Closed (OCP)", "Dependency Inversion (DIP)", "Single Responsibility (SRP)"],
    correct: "Liskov Substitution (LSP)",
    explanation: "A Square can't be substituted for a Rectangle without breaking the caller's assumption that width and height are independent. That's the textbook LSP violation.",
  }),
  pm({
    topicId: "lld_m1_t2", exerciseId: "lld_m1_t2_pm_4", position: 4, level: "medium",
    title: "Spot the violated principle (IV)",
    scenario: "`OrderService` does `this.repo = new MySqlOrderRepository();` inside its constructor, so it can never be tested against a fake repo and is welded to MySQL. Which principle should you apply?",
    options: ["Dependency Inversion (DIP)", "Interface Segregation (ISP)", "Liskov Substitution (LSP)", "Single Responsibility (SRP)"],
    correct: "Dependency Inversion (DIP)",
    explanation: "Depend on an OrderRepository abstraction and inject the implementation via the constructor. High-level OrderService no longer depends on a concrete database class.",
  }),

  // ── T3: UML ───────────────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t3", exerciseId: "lld_m1_t3_pm_1", position: 1, level: "medium",
    title: "Composition or aggregation?",
    scenario: "A House is made of Rooms. If the House is demolished, the Rooms cease to exist — they have no independent life. Which UML relationship (and diamond) models this?",
    options: ["Composition (filled diamond)", "Aggregation (hollow diamond)", "Association (plain line)", "Dependency (dashed arrow)"],
    correct: "Composition (filled diamond)",
    explanation: "The parts' lifetime is bound to the whole, so it's composition — drawn with a FILLED diamond on the House end.",
  }),
  pm({
    topicId: "lld_m1_t3", exerciseId: "lld_m1_t3_pm_2", position: 2, level: "medium",
    title: "Read the multiplicity",
    scenario: "An association reads: Order \"1\" ──── \"1..*\" LineItem. What real-world invariant does the 1..* encode?",
    options: ["An order must have at least one line item", "An order can have zero line items", "A line item belongs to many orders", "Exactly one line item per order"],
    correct: "An order must have at least one line item",
    explanation: "1..* means 'one or more', so an order with zero items is invalid — a genuine invariant you'd enforce in the Order constructor.",
  }),
  predict({
    topicId: "lld_m1_t3", exerciseId: "lld_m1_t3_ex_1", position: 3, level: "easy",
    title: "Count the objects from the diagram's intent",
    scenario: "A Team aggregates Players with multiplicity Team \"1\" ──◇ \"0..*\" Player. The code below builds one team and adds players. What does it print?",
    starterCode: `import java.util.*;
public class Main {
    static class Player { final String name; Player(String n){ name=n; } }
    static class Team {
        final List<Player> players = new ArrayList<>();
        void add(Player p){ players.add(p); }
        int size(){ return players.size(); }
    }
    public static void main(String[] args) {
        Team t = new Team();
        t.add(new Player("A")); t.add(new Player("B")); t.add(new Player("C"));
        System.out.println(t.size());
    }
}`,
    expected: "3",
    explanation: "0..* allows any number of players; three were added, so size() is 3. (Aggregation: the players could outlive the team.)",
    hints: ["Count the add() calls."],
  }),

  // ── T4: Strategy ──────────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t4", exerciseId: "lld_m1_t4_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "A SortContext holds a `SortAlgorithm` interface and delegates sort() to whichever implementation (QuickSort, MergeSort) it was given. The client picks the algorithm. Which pattern is this?",
    options: ["Strategy", "Observer", "Decorator", "Singleton"],
    correct: "Strategy",
    explanation: "Interchangeable algorithms behind one interface, chosen by the client and held by a context — that's Strategy.",
  }),
  code({
    topicId: "lld_m1_t4", exerciseId: "lld_m1_t4_ex_1", position: 2, level: "medium",
    title: "Implement a discount Strategy",
    scenario: "Build a Strategy: a DiscountStrategy interface with `int finalPriceCents(int priceCents)`. Implement NoDiscount (returns the price) and TenPercentOff (returns price minus price/10). A Checkout holds a strategy and exposes total(int). Print the total for a 1000-cent item with TenPercentOff.",
    instructions: "Write a complete Java program (public class Main) that prints a single integer. Use integer math only.",
    starterCode: `public class Main {
    interface DiscountStrategy { int finalPriceCents(int priceCents); }
    // TODO: NoDiscount, TenPercentOff, Checkout
    public static void main(String[] args) {
        // TODO: Checkout with TenPercentOff, print total(1000)
    }
}`,
    expectedSolution: `public class Main {
    interface DiscountStrategy { int finalPriceCents(int priceCents); }
    static class NoDiscount implements DiscountStrategy {
        public int finalPriceCents(int p){ return p; }
    }
    static class TenPercentOff implements DiscountStrategy {
        public int finalPriceCents(int p){ return p - p / 10; }
    }
    static class Checkout {
        private DiscountStrategy strategy;
        Checkout(DiscountStrategy s){ this.strategy = s; }
        int total(int priceCents){ return strategy.finalPriceCents(priceCents); }
    }
    public static void main(String[] args) {
        Checkout c = new Checkout(new TenPercentOff());
        System.out.println(c.total(1000));
    }
}`,
    testCases: [{ type: "execution", must_compile: true, stdin: "", expected_stdout:"900" }],
    hints: ["1000 - 1000/10 = 1000 - 100 = 900.", "The Checkout never branches on discount type — it just calls strategy.finalPriceCents()."],
  }),
  predict({
    topicId: "lld_m1_t4", exerciseId: "lld_m1_t4_ex_2", position: 3, level: "easy",
    title: "Swapping the strategy at runtime",
    scenario: "What does this program print (one number per line)?",
    starterCode: `public class Main {
    interface Op { int apply(int a, int b); }
    static class Add implements Op { public int apply(int a,int b){ return a+b; } }
    static class Mul implements Op { public int apply(int a,int b){ return a*b; } }
    static class Calc {
        private Op op;
        Calc(Op o){ op=o; }
        void setOp(Op o){ op=o; }
        int run(int a,int b){ return op.apply(a,b); }
    }
    public static void main(String[] args) {
        Calc c = new Calc(new Add());
        System.out.println(c.run(3, 4));
        c.setOp(new Mul());
        System.out.println(c.run(3, 4));
    }
}`,
    expected: "7\n12",
    explanation: "First the Add strategy: 3+4=7. After setOp(Mul), the same run(3,4) now multiplies: 3*4=12. The context's behaviour changed without changing its code.",
    hints: ["The strategy is swapped between the two run() calls."],
  }),
  pm({
    topicId: "lld_m1_t4", exerciseId: "lld_m1_t4_pm_2", position: 4, level: "warmup",
    title: "Complete the Strategy delegation",
    scenario: "The Checkout context should delegate pricing to whichever strategy it holds — never branch on a type. Which line correctly completes `int total(int priceCents){ return ___; }`?",
    options: ["return strategy.finalPriceCents(priceCents);", "return priceCents;", "return new TenPercentOff().finalPriceCents(priceCents);", "if (card) return priceCents - priceCents / 10;"],
    correct: "return strategy.finalPriceCents(priceCents);",
    explanation: "The context forwards to the injected strategy. Newing a concrete strategy or branching on type defeats the whole pattern.",
    hints: ["Call the interface method on the held `strategy` field."],
  }),

  // ── T5: Observer ────────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t5", exerciseId: "lld_m1_t5_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "A WeatherStation keeps a list of Display objects and calls update(temp) on each one whenever the temperature changes. The station knows it has displays, not what they are. Which pattern?",
    options: ["Observer", "Strategy", "Adapter", "Factory"],
    correct: "Observer",
    explanation: "A subject notifying a list of dependents through a common interface on state change is the Observer pattern.",
  }),
  predict({
    topicId: "lld_m1_t5", exerciseId: "lld_m1_t5_ex_1", position: 2, level: "medium",
    title: "Notification order",
    scenario: "What does this program print?",
    starterCode: `import java.util.*;
public class Main {
    interface Observer { void update(int v); }
    static class Sub {
        private final List<Observer> obs = new ArrayList<>();
        void subscribe(Observer o){ obs.add(o); }
        void set(int v){ for (Observer o : obs) o.update(v); }
    }
    public static void main(String[] args) {
        Sub s = new Sub();
        s.subscribe(v -> System.out.println("A:" + v));
        s.subscribe(v -> System.out.println("B:" + v));
        s.set(5);
    }
}`,
    expected: "A:5\nB:5",
    explanation: "Observers are notified in subscription order. A was subscribed first, so A:5 prints before B:5; both receive the same value 5.",
    hints: ["The loop iterates the observers in the order they were added."],
  }),
  pm({
    topicId: "lld_m1_t5", exerciseId: "lld_m1_t5_pm_2", position: 3, level: "easy",
    title: "Complete the notify loop",
    scenario: "Inside the subject's set(v), after storing the value, it must notify every observer. Which line correctly completes `for (Observer o : observers) { ___ }`?",
    options: ["o.update(v);", "observers.add(o);", "update(o);", "o.subscribe(v);"],
    correct: "o.update(v);",
    explanation: "Each observer is notified via its update() method with the new value. add/subscribe would mutate the list, not notify.",
    hints: ["Call update on the loop variable `o`."],
  }),

  // ── T6: Factory ───────────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t6", exerciseId: "lld_m1_t6_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "A NotificationFactory.create(channel) returns an EmailNotifier, SmsNotifier, or PushNotifier based on the channel string, so callers never write `new SmsNotifier()`. Which pattern centralises this?",
    options: ["Factory", "Decorator", "Observer", "Strategy"],
    correct: "Factory",
    explanation: "Centralising object creation behind one method that returns an abstraction is the Factory pattern (a Simple Factory here).",
  }),
  predict({
    topicId: "lld_m1_t6", exerciseId: "lld_m1_t6_ex_1", position: 2, level: "easy",
    title: "Factory dispatch",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    interface Shape { String draw(); }
    static class Circle implements Shape { public String draw(){ return "Circle"; } }
    static class Square implements Shape { public String draw(){ return "Square"; } }
    static Shape create(String kind) {
        if (kind.equals("circle")) return new Circle();
        if (kind.equals("square")) return new Square();
        throw new IllegalArgumentException(kind);
    }
    public static void main(String[] args) {
        System.out.println(create("square").draw());
    }
}`,
    expected: "Square",
    explanation: "create(\"square\") returns a Square instance; draw() on it returns \"Square\". The caller depends only on the Shape interface.",
    hints: ["Follow which branch the factory takes for \"square\"."],
  }),
  code({
    topicId: "lld_m1_t6", exerciseId: "lld_m1_t6_ex_2", position: 3, level: "medium",
    title: "Build a Simple Factory",
    scenario: "Create an Animal interface with `String sound()`. Implement Dog (\"Woof\") and Cat (\"Meow\"). Write AnimalFactory.create(String) returning the right Animal. Print the sound of create(\"cat\").",
    instructions: "Write a complete Java program (public class Main) that prints a single word.",
    starterCode: `public class Main {
    interface Animal { String sound(); }
    // TODO: Dog, Cat, create(String)
    public static void main(String[] args) {
        // TODO: print create("cat").sound()
    }
}`,
    expectedSolution: `public class Main {
    interface Animal { String sound(); }
    static class Dog implements Animal { public String sound(){ return "Woof"; } }
    static class Cat implements Animal { public String sound(){ return "Meow"; } }
    static Animal create(String kind) {
        if (kind.equals("dog")) return new Dog();
        if (kind.equals("cat")) return new Cat();
        throw new IllegalArgumentException(kind);
    }
    public static void main(String[] args) {
        System.out.println(create("cat").sound());
    }
}`,
    testCases: [{ type: "execution", must_compile: true, stdin: "", expected_stdout:"Meow" }],
    hints: ["The factory is the only place that names concrete classes.", "create(\"cat\") returns a Cat; its sound() is \"Meow\"."],
  }),

  // ── T7: Singleton ───────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t7", exerciseId: "lld_m1_t7_pm_1", position: 1, level: "medium",
    title: "Which lazy Singleton is safe?",
    scenario: "You need a lazily-initialised, thread-safe Singleton in Java without locking on every access. Which approach is the recommended one?",
    options: ["Initialization-on-demand holder class", "Naive `if (instance==null) instance=new X()`", "A public static non-final field", "A new instance per getInstance() call"],
    correct: "Initialization-on-demand holder class",
    explanation: "The holder idiom is lazy (the nested class loads on first access), lock-free, and thread-safe by the JVM's class-initialization guarantees.",
  }),
  predict({
    topicId: "lld_m1_t7", exerciseId: "lld_m1_t7_ex_1", position: 2, level: "easy",
    title: "One instance, always",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    static class Config {
        private static final Config INSTANCE = new Config();
        private Config() {}
        static Config get() { return INSTANCE; }
    }
    public static void main(String[] args) {
        Config a = Config.get();
        Config b = Config.get();
        System.out.println(a == b);
    }
}`,
    expected: "true",
    explanation: "Both get() calls return the same single INSTANCE, so reference equality (==) is true. That's the Singleton guarantee.",
    hints: ["How many instances does the eager Singleton ever create?"],
  }),
  pm({
    topicId: "lld_m1_t7", exerciseId: "lld_m1_t7_pm_2", position: 3, level: "medium",
    title: "Stop external instantiation",
    scenario: "A Singleton must prevent callers from doing `new Logger()`. Which constructor declaration achieves that?",
    options: ["private Logger() {}", "public Logger() {}", "protected Logger() {}", "Logger() {}"],
    correct: "private Logger() {}",
    explanation: "A private constructor blocks `new Logger()` from any other class, so the only instance is the internal INSTANCE. public/protected/package-private all allow external construction.",
    hints: ["Which access modifier means 'only this class can call it'?"],
  }),

  // ── T8: Decorator ───────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t8", exerciseId: "lld_m1_t8_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "`new BufferedReader(new InputStreamReader(System.in))` — each wrapper implements the same Reader-style interface and adds behaviour to the object it wraps. Which pattern is this (and what java.io uses)?",
    options: ["Decorator", "Adapter", "Factory", "Observer"],
    correct: "Decorator",
    explanation: "Wrapping an object in another of the same interface to add behaviour, stackable at runtime, is Decorator — exactly how java.io streams compose.",
  }),
  predict({
    topicId: "lld_m1_t8", exerciseId: "lld_m1_t8_ex_1", position: 2, level: "medium",
    title: "Stacked decorators add up",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    interface Beverage { int costCents(); }
    static class Espresso implements Beverage { public int costCents(){ return 200; } }
    static abstract class AddOn implements Beverage {
        protected final Beverage inner;
        AddOn(Beverage b){ inner = b; }
    }
    static class Milk extends AddOn { Milk(Beverage b){ super(b);} public int costCents(){ return inner.costCents() + 50; } }
    static class Sugar extends AddOn { Sugar(Beverage b){ super(b);} public int costCents(){ return inner.costCents() + 25; } }
    public static void main(String[] args) {
        Beverage order = new Sugar(new Milk(new Espresso()));
        System.out.println(order.costCents());
    }
}`,
    expected: "275",
    explanation: "Espresso 200, wrapped by Milk (+50) = 250, wrapped by Sugar (+25) = 275. Each decorator delegates to inner and adds its own cost.",
    hints: ["Evaluate from the inside out: 200 → +50 → +25."],
  }),
  code({
    topicId: "lld_m1_t8", exerciseId: "lld_m1_t8_ex_2", position: 3, level: "medium",
    title: "Add a Whip decorator",
    scenario: "Using the beverage decorators (Espresso=200, Milk adds 50, Sugar adds 25), add a new Whip decorator that adds 30 cents. Print the cost of an Espresso with Milk and Whip (no sugar).",
    instructions: "Write a complete Java program (public class Main) that prints a single integer. You may reuse the structure from the lesson.",
    starterCode: `public class Main {
    interface Beverage { int costCents(); }
    static class Espresso implements Beverage { public int costCents(){ return 200; } }
    static abstract class AddOn implements Beverage {
        protected final Beverage inner;
        AddOn(Beverage b){ inner = b; }
    }
    static class Milk extends AddOn { Milk(Beverage b){ super(b);} public int costCents(){ return inner.costCents() + 50; } }
    // TODO: Whip adds 30
    public static void main(String[] args) {
        // TODO: Espresso + Milk + Whip, print cost
    }
}`,
    expectedSolution: `public class Main {
    interface Beverage { int costCents(); }
    static class Espresso implements Beverage { public int costCents(){ return 200; } }
    static abstract class AddOn implements Beverage {
        protected final Beverage inner;
        AddOn(Beverage b){ inner = b; }
    }
    static class Milk extends AddOn { Milk(Beverage b){ super(b);} public int costCents(){ return inner.costCents() + 50; } }
    static class Whip extends AddOn { Whip(Beverage b){ super(b);} public int costCents(){ return inner.costCents() + 30; } }
    public static void main(String[] args) {
        Beverage order = new Whip(new Milk(new Espresso()));
        System.out.println(order.costCents());
    }
}`,
    testCases: [{ type: "execution", must_compile: true, stdin: "", expected_stdout:"280" }],
    hints: ["200 + 50 (milk) + 30 (whip) = 280.", "Whip follows the same shape as Milk; it just adds 30 and delegates to inner."],
  }),

  // ── T9: Adapter ───────────────────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t9", exerciseId: "lld_m1_t9_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "Your code expects a `MediaPlayer.play(file)` interface, but a third-party library only offers `AdvancedPlayer.start(path)`. You write a class implementing MediaPlayer that internally calls AdvancedPlayer.start(). Which pattern?",
    options: ["Adapter", "Decorator", "Strategy", "Singleton"],
    correct: "Adapter",
    explanation: "Converting an incompatible interface (start) into the one the client expects (play) is the Adapter pattern.",
  }),
  predict({
    topicId: "lld_m1_t9", exerciseId: "lld_m1_t9_ex_1", position: 2, level: "medium",
    title: "Adapter translates the call",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    interface PaymentGateway { String pay(int cents); }
    static class StripeSdk { String chargeCents(int amount){ return "charged:" + amount; } }
    static class StripeAdapter implements PaymentGateway {
        private final StripeSdk sdk = new StripeSdk();
        public String pay(int cents){ return sdk.chargeCents(cents); }
    }
    public static void main(String[] args) {
        PaymentGateway gw = new StripeAdapter();
        System.out.println(gw.pay(500));
    }
}`,
    expected: "charged:500",
    explanation: "The client calls pay(500) on the PaymentGateway interface; the adapter forwards it to the SDK's chargeCents(500), which returns \"charged:500\".",
    hints: ["The adapter just forwards pay() to the SDK's chargeCents()."],
  }),
  pm({
    topicId: "lld_m1_t9", exerciseId: "lld_m1_t9_pm_2", position: 3, level: "easy",
    title: "Complete the adapter's translation",
    scenario: "StripeAdapter implements PaymentGateway.pay(int cents) by delegating to the SDK's differently-named method. Which line correctly completes `public String pay(int cents){ return ___; }`?",
    options: ["return sdk.chargeCents(cents);", "return pay(cents);", "return sdk.pay(cents);", "return cents;"],
    correct: "return sdk.chargeCents(cents);",
    explanation: "The adapter translates pay() into the adaptee's chargeCents(). Calling pay() on itself would recurse forever; the SDK has no pay().",
    hints: ["Forward to the SDK's chargeCents with the same amount."],
  }),

  // ── T10: Parking Lot case study ───────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t10", exerciseId: "lld_m1_t10_pm_1", position: 1, level: "medium",
    title: "First move in the interview",
    scenario: "The interviewer says 'Design a parking lot.' What should you do first?",
    options: ["Clarify requirements and state assumptions", "Start writing the ParkingLot class", "Draw all the design patterns you know", "Pick a database schema"],
    correct: "Clarify requirements and state assumptions",
    explanation: "Always scope first: levels, spot sizes, ticketing, pricing. Jumping to code or patterns before requirements is the most common failure.",
  }),
  pm({
    topicId: "lld_m1_t10", exerciseId: "lld_m1_t10_pm_2", position: 2, level: "medium",
    title: "Where does Strategy belong?",
    scenario: "The parking lot must support flat-rate, hourly, and weekend-surge pricing, and more schemes will be added later. Which pattern isolates the pricing rule so new schemes don't touch the lot?",
    options: ["Strategy (FeeStrategy interface)", "Singleton", "Observer", "Adapter"],
    correct: "Strategy (FeeStrategy interface)",
    explanation: "Pricing is an axis of change with interchangeable variants chosen by configuration — a textbook Strategy. New schemes are new classes, not edits to ParkingLot.",
  }),
  pm({
    topicId: "lld_m1_t10", exerciseId: "lld_m1_t10_pm_3", position: 3, level: "medium",
    title: "Spot ↔ Vehicle multiplicity",
    scenario: "At any instant, how many vehicles can occupy a single ParkingSpot, and how should you model the relationship?",
    options: ["0..1 — a spot holds at most one vehicle", "1 — a spot always has a vehicle", "0..* — a spot holds many vehicles", "1..* — at least one vehicle per spot"],
    correct: "0..1 — a spot holds at most one vehicle",
    explanation: "A spot is either empty or holds exactly one vehicle: 0..1. The spot's `current` field is therefore a single nullable reference, and isFree() checks it for null.",
  }),

  // ── T11: LRU Cache case study ─────────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t11", exerciseId: "lld_m1_t11_pm_1", position: 1, level: "medium",
    title: "Which two structures give O(1)?",
    scenario: "You need get and put in O(1), plus O(1) eviction of the least-recently-used key. Which combination achieves all three?",
    options: ["HashMap + doubly-linked list", "Array + binary search", "TreeMap alone", "Two stacks"],
    correct: "HashMap + doubly-linked list",
    explanation: "The HashMap gives O(1) key→node lookup; the doubly-linked list gives O(1) move-to-front and O(1) tail removal for eviction.",
  }),
  pm({
    topicId: "lld_m1_t11", exerciseId: "lld_m1_t11_pm_2", position: 2, level: "easy",
    title: "Why not a HashMap alone?",
    scenario: "Someone proposes implementing the LRU cache with only a HashMap. What breaks?",
    options: ["Finding the LRU key to evict becomes O(n)", "get() becomes O(n)", "put() becomes O(log n)", "Nothing — a HashMap is sufficient"],
    correct: "Finding the LRU key to evict becomes O(n)",
    explanation: "A HashMap has no recency order, so locating the least-recently-used entry to evict requires scanning all entries — O(n). You need an ordering structure alongside it.",
  }),
  code({
    topicId: "lld_m1_t11", exerciseId: "lld_m1_t11_ex_1", position: 3, level: "hard",
    title: "Implement an LRU cache (LinkedHashMap)",
    scenario: "Implement a capacity-2 LRU cache of <Integer,Integer> using LinkedHashMap in access-order with removeEldestEntry. Run this sequence and print each get result on its own line: put(1,1); put(2,2); get(1)→?; put(3,3) [evicts 2]; get(2)→? (-1 if absent); get(3)→?.",
    instructions: "Write a complete Java program (public class Main). Print three integers, one per line: the results of get(1), get(2), get(3). Use -1 for a miss.",
    starterCode: `import java.util.*;
public class Main {
    static class LruCache extends LinkedHashMap<Integer,Integer> {
        private final int cap;
        LruCache(int cap){ super(cap, 0.75f, true); this.cap = cap; }
        // TODO: override removeEldestEntry
        int read(int k){ return getOrDefault(k, -1); }
    }
    public static void main(String[] args) {
        LruCache c = new LruCache(2);
        c.put(1,1); c.put(2,2);
        System.out.println(c.read(1));   // 1
        c.put(3,3);                       // evicts key 2 (LRU)
        System.out.println(c.read(2));   // -1
        System.out.println(c.read(3));   // 3
    }
}`,
    expectedSolution: `import java.util.*;
public class Main {
    static class LruCache extends LinkedHashMap<Integer,Integer> {
        private final int cap;
        LruCache(int cap){ super(cap, 0.75f, true); this.cap = cap; }
        @Override protected boolean removeEldestEntry(Map.Entry<Integer,Integer> e){
            return size() > cap;
        }
        int read(int k){ return getOrDefault(k, -1); }
    }
    public static void main(String[] args) {
        LruCache c = new LruCache(2);
        c.put(1,1); c.put(2,2);
        System.out.println(c.read(1));
        c.put(3,3);
        System.out.println(c.read(2));
        System.out.println(c.read(3));
    }
}`,
    testCases: [{ type: "execution", must_compile: true, stdin: "", expected_stdout:"1\n-1\n3" }],
    hints: ["accessOrder=true (the 3rd super() arg) makes get() count as a use, so after read(1) the LRU is key 2.", "removeEldestEntry returns size() > cap, evicting on the put that overflows."],
  }),
  pm({
    topicId: "lld_m1_t11", exerciseId: "lld_m1_t11_pm_3", position: 4, level: "easy",
    title: "The eviction footgun",
    scenario: "In a from-scratch LRU, you remove the tail node on overflow but the cache still grows and returns stale data. What did you most likely forget?",
    options: ["Delete the evicted key from the HashMap too", "Use sentinel nodes", "Make get() O(1)", "Increase the capacity"],
    correct: "Delete the evicted key from the HashMap too",
    explanation: "Removing the list node without removing its key from the map leaves a dangling entry — a leak and a source of stale lookups. Eviction must touch both structures.",
  }),

  // ── T12: Driving an LLD interview ─────────────────────────────────────────────
  pm({
    topicId: "lld_m1_t12", exerciseId: "lld_m1_t12_pm_1", position: 1, level: "easy",
    title: "Order the framework",
    scenario: "Which sequence best describes a strong LLD interview process?",
    options: [
      "Requirements → entities → relationships → patterns → APIs → edge cases",
      "Patterns → code → entities → requirements",
      "Code → tests → requirements → diagram",
      "Database schema → UI → classes → requirements",
    ],
    correct: "Requirements → entities → relationships → patterns → APIs → edge cases",
    explanation: "Scope first, then model the nouns and their links, apply patterns only where justified, define the public APIs, and finish with edge cases. Process is graded heavily.",
  }),
  pm({
    topicId: "lld_m1_t12", exerciseId: "lld_m1_t12_pm_2", position: 2, level: "easy",
    title: "Nouns become…",
    scenario: "In 'A user books a seat for a show', the mechanical first pass turns nouns into candidate classes and verbs into methods. Which is the best first class list?",
    options: ["User, Seat, Show, Booking (with a book() method)", "BookSeatForShowManager", "Database, Controller, View", "Just one God class: System"],
    correct: "User, Seat, Show, Booking (with a book() method)",
    explanation: "Each noun is a cohesive candidate class; 'books' becomes the book() behaviour. You then refine for cohesion — but nouns→classes is the fast, legible starting move.",
  }),
  pm({
    topicId: "lld_m1_t12", exerciseId: "lld_m1_t12_pm_3", position: 3, level: "medium",
    title: "The senior-level mistake",
    scenario: "A candidate forces Strategy, Observer, Factory, Decorator, and Singleton into a simple to-do list app. What's the problem?",
    options: ["Over-engineering — apply a pattern only when a real axis of change justifies it", "Not enough patterns", "Using interfaces at all", "Patterns should always be maximised"],
    correct: "Over-engineering — apply a pattern only when a real axis of change justifies it",
    explanation: "A pattern zoo signals immaturity. Introduce each pattern only when you can name the change it absorbs; otherwise a clean object model is better.",
  }),
  pm({
    topicId: "lld_m1_t12", exerciseId: "lld_m1_t12_pm_4", position: 4, level: "medium",
    title: "Functional vs non-functional",
    scenario: "Before designing, you should separate WHAT the system does from its QUALITIES. Which of these is a NON-functional requirement?",
    options: ["The system must handle 10,000 concurrent users with <100ms latency", "A user can park a vehicle", "The cache evicts the least-recently-used key", "An order issues a ticket"],
    correct: "The system must handle 10,000 concurrent users with <100ms latency",
    explanation: "Concurrency and latency are qualities (non-functional). The others describe behaviour (functional). Confirm which non-functionals are in scope before designing for them.",
  }),
];

// ── Upsert helpers ────────────────────────────────────────────────────────────
async function upsertOne(Model, filter, doc) {
  return Model.findOneAndUpdate(filter, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
}

// ── main ─────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // Track
  await upsertOne(ProTrack, { key: TRACK.key }, TRACK);
  console.log(`  ✓ ProTrack:  ${TRACK.key} — ${TRACK.name}`);

  // Module
  await upsertOne(ProModule, { moduleId: MODULE.moduleId }, MODULE);
  console.log(`  ✓ ProModule: ${MODULE.moduleId} — ${MODULE.name}`);

  // Topics
  for (const topic of TOPICS) {
    await upsertOne(ProTopic, { topicId: topic.topicId }, topic);
  }
  console.log(`  ✓ ProTopics: ${TOPICS.length}`);

  // Exercises
  let inserted = 0, updated = 0;
  for (const ex of EXERCISES) {
    const before = await ProExercise.findOne({ exerciseId: ex.exerciseId }).select("_id").lean();
    await upsertOne(ProExercise, { exerciseId: ex.exerciseId }, ex);
    before ? updated++ : inserted++;
  }
  console.log(`  ✓ ProExercises: ${EXERCISES.length} (${inserted} inserted, ${updated} updated)`);

  // Roll up track totals from the DB (covers all modules, any seed order).
  const totals = await recomputeLldTotals();

  console.log(`\nDone — pro_lld base track + M1 seeded.`);
  console.log(`  This seed: module ${MODULE.moduleId}, ${TOPICS.length} topics, ${EXERCISES.length} exercises`);
  console.log(`  Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

process.on("exit", () => process.exit(0));
