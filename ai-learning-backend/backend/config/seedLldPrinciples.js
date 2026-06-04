/**
 * Seed — LLD module M6: Design Principles & Class Relationships (breadth parity
 * with AlgoMaster's Design Principles + Class Relationships sections, beyond
 * SOLID which lives in M1). Extends pro_lld.
 * Idempotent; recomputes track totals. All pattern_match.
 * Usage:  node config/seedLldPrinciples.js   ·   npm: npm run seed:lld-principles
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m6";
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);

function pm(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const MODULE = {
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 6,
  name: "Design Principles & Class Relationships", slug: "design-principles",
  description: "The everyday principles that keep code clean and changeable beyond SOLID — DRY, KISS, YAGNI, Law of Demeter, Separation of Concerns, Coupling & Cohesion, Composition-over-Inheritance — plus a deep look at UML class relationships.",
  estimatedHours: 4, prerequisites: ["lld_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff) => ({
  trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
  metadata: { estimated_minutes: 25, difficulty: 2, prerequisites: [], tags },
  hook: { question: hookQ, insight: hookI }, teaching: { blocks },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: [], estimatedMinutes: 25, difficulty: diff, xpReward: 50, visualizer: null,
});

const TOPICS = [
  T("lld_m6_t1", 1, "DRY — Don't Repeat Yourself", "dry-principle",
    ["principle", "dry", "duplication"],
    "You fix a bug, then realise the same buggy logic is copy-pasted in five places. What principle did the original author violate?",
    "DRY says every piece of KNOWLEDGE should have a single, authoritative representation. Duplicated logic means a change must be made in N places (and you'll miss one). Extract the shared logic into one function/class/constant so there's exactly one source of truth.",
    [
      { kind: "concept", heading: "What DRY really means",
        body: "DRY is about knowledge, not just identical text. If a business rule (tax = 18%) or an algorithm lives in multiple places, a change forces edits everywhere — and the one you miss becomes a bug. Centralise it: a constant, a function, a shared service. The test: 'if this rule changed, how many places would I edit?' — the answer should be one." },
      { kind: "concept", heading: "DRY vs WET, and over-DRYing",
        body: "WET ('write everything twice' / 'we enjoy typing') is the duplicated opposite. But beware over-applying DRY: two pieces of code that look identical TODAY but represent DIFFERENT knowledge (and will change for different reasons) should NOT be merged — coupling them creates a worse problem. DRY is about shared knowledge, not coincidental similarity (the 'rule of three': tolerate a little duplication until the real abstraction is clear)." },
    ],
    "DRY is a baseline cleanliness signal. The nuance interviewers like: DRY is about single-source-of-truth for KNOWLEDGE, and over-DRYing coincidental duplication is itself a smell.",
    ["Treating DRY as 'never repeat any text' rather than 'one source of truth per piece of knowledge'.",
     "Merging code that looks similar but changes for different reasons (false DRY).",
     "Copy-pasting a business rule into many places."],
    0.2),

  T("lld_m6_t2", 2, "KISS — Keep It Simple", "kiss-principle",
    ["principle", "kiss", "simplicity"],
    "A junior builds a plugin framework with three layers of abstraction… to format a date. What principle would have stopped them?",
    "KISS: prefer the simplest solution that works. Complexity is a cost paid by every future reader and maintainer. Don't add abstraction, generality, or cleverness until a concrete need demands it.",
    [
      { kind: "concept", heading: "Simple beats clever",
        body: "The simplest design that meets the requirements is usually the best. Clever one-liners, deep inheritance trees, and speculative frameworks impress nobody and slow everyone down. Optimise for readability and the next engineer (often future-you). If a plain function works, don't build a plugin system." },
      { kind: "concept", heading: "KISS vs the patterns",
        body: "Design patterns are tools, not goals — applying five patterns to a to-do app violates KISS. Reach for a pattern only when a real axis of change justifies it; otherwise the pattern is just complexity. KISS and YAGNI together are the antidote to over-engineering, which is the most common senior-level design mistake." },
    ],
    "KISS is the counterweight interviewers watch for — candidates who over-engineer (pattern zoos, premature abstraction) score worse than those who reach for the simplest thing that works and add complexity only when justified.",
    ["Adding abstraction/patterns without a concrete need (over-engineering).",
     "Equating 'clever' or 'flexible' with 'good'.",
     "Building frameworks for problems a function would solve."],
    0.2),

  T("lld_m6_t3", 3, "YAGNI — You Aren't Gonna Need It", "yagni-principle",
    ["principle", "yagni", "over-engineering"],
    "'Let's make it configurable for the 5 databases we might support someday.' You support one. What principle says don't?",
    "YAGNI: don't build functionality until it's actually needed. Speculative features cost time now, add complexity forever, and usually guess wrong about the future. Build for today's requirements; refactor when the real need arrives.",
    [
      { kind: "concept", heading: "Build for now, not for maybe",
        body: "Every 'we might need it later' feature has a cost today (build + test + maintain) and is usually based on a wrong guess about the future. YAGNI says implement what the current requirements demand, and trust that good, simple design lets you add the rest WHEN it's actually required. Speculative generality is dead weight." },
      { kind: "concept", heading: "YAGNI vs extensibility",
        body: "YAGNI isn't 'never design for change' — it's 'don't build the change before it exists'. The balance: keep the design clean and decoupled (so extension is cheap later) without pre-building the extension. SOLID/OCP make adding things easy when needed; YAGNI says don't add them until needed. Together: extensible, but minimal." },
    ],
    "YAGNI pairs with KISS as the over-engineering guard. Strong candidates explicitly defer speculative work ('I'll design it so we CAN add X, but I won't build X until it's a requirement').",
    ["Building configuration/abstraction for hypothetical future requirements.",
     "Confusing YAGNI with 'don't design for change' (it's 'don't pre-build it').",
     "Gold-plating features beyond the stated scope."],
    0.2),

  T("lld_m6_t4", 4, "Law of Demeter (Least Knowledge)", "law-of-demeter",
    ["principle", "law-of-demeter", "coupling"],
    "`order.getCustomer().getAddress().getCity().toUpperCase()` — a long train of dots. Why is this fragile, and what principle does it break?",
    "The Law of Demeter (principle of least knowledge): an object should only talk to its immediate collaborators, not reach through them into their internals. 'Don't talk to strangers.' Long dot-chains couple you to the structure of distant objects, so any change downstream breaks you.",
    [
      { kind: "concept", heading: "Talk only to friends",
        body: "A method should only call methods on: itself, its parameters, objects it creates, and its direct fields — NOT on objects returned by those (the 'strangers'). `a.getB().getC().doThing()` reaches through B into C, coupling you to B's internal structure. If B changes how it stores C, you break — even though you only cared about doing a thing." },
      { kind: "concept", heading: "The fix: tell, don't ask",
        body: "Instead of asking an object for its internals and operating on them, TELL the object to do the work and let it delegate. Replace `order.getCustomer().getAddress().getCity()` with `order.shippingCity()` — the Order asks the Customer, which asks the Address. Each object exposes intent, not structure. This reduces coupling and is the 'Tell, Don't Ask' style." },
    ],
    "Law of Demeter shows up in code-review/refactoring prompts. Recognising a long dot-chain as a coupling smell and fixing it with a delegating method ('Tell, Don't Ask') is the signal.",
    ["Long getter chains that reach through objects into their internals.",
     "Confusing it with banning all method calls (it's about not reaching through RETURNED objects).",
     "Asking for internals and operating on them instead of telling the object to act."],
    0.3),

  T("lld_m6_t5", 5, "Separation of Concerns", "separation-of-concerns",
    ["principle", "separation-of-concerns", "layering"],
    "One class parses HTTP, runs business rules, AND writes SQL. Why is it a nightmare to test and change?",
    "Separation of Concerns: split a system into parts that each address a distinct concern, with minimal overlap. Presentation, business logic, and data access should live in separate layers/classes so each can change, be tested, and be reasoned about independently.",
    [
      { kind: "concept", heading: "One concern per unit",
        body: "A 'concern' is a distinct aspect: handling HTTP, applying business rules, persisting data, formatting output. Mixing them (a controller that also runs logic and writes SQL) means you can't test the logic without a database, can't change the UI without risking the rules, and every change touches everything. Separate them — typically into layers (controller → service → repository)." },
      { kind: "concept", heading: "How it relates to SRP and layering",
        body: "Separation of Concerns is the broad principle; Single Responsibility (SRP) applies it at the class level. It manifests as layered architecture (presentation/business/data), MVC (model/view/controller), and modular boundaries. The payoff: each layer is independently testable (inject a fake repository), swappable, and understandable in isolation." },
    ],
    "Separation of Concerns underlies layered/MVC design. Interviewers want to see you split presentation, logic, and persistence so each is testable and changeable on its own.",
    ["A single class mixing HTTP handling, business logic, and persistence.",
     "Business logic that can't be tested without a UI or database.",
     "Confusing it with SRP — SoC is the system-wide version of SRP."],
    0.3),

  T("lld_m6_t6", 6, "Coupling & Cohesion", "coupling-cohesion",
    ["principle", "coupling", "cohesion"],
    "Two dials describe almost every design's health. One you want LOW, one you want HIGH. Which is which, and why?",
    "Aim for LOW coupling (modules depend on each other minimally, through stable interfaces) and HIGH cohesion (everything inside a module belongs together, serving one focused purpose). Good design = loosely coupled, highly cohesive — easy to change one part without breaking others.",
    [
      { kind: "concept", heading: "Cohesion — keep related things together",
        body: "Cohesion measures how focused a module is. HIGH cohesion: a class does one well-defined job and all its members serve it (a PriceCalculator only calculates prices). LOW cohesion: a 'Utils' grab-bag of unrelated methods. High cohesion makes a unit easy to name, understand, test, and reuse." },
      { kind: "concept", heading: "Coupling — minimise dependencies",
        body: "Coupling measures how dependent modules are on each other. TIGHT coupling: A reaches into B's internals / depends on its concrete class — change B, break A. LOOSE coupling: A depends only on a stable interface of B (and ideally B is injected). Loose coupling lets you change, test, and replace modules independently. Program to interfaces, inject dependencies, and respect the Law of Demeter to keep it low." },
      { kind: "concept", heading: "The goal: loose + cohesive",
        body: "These two together are the headline measure of design quality, and most other principles serve them: SRP and SoC raise cohesion; DIP, interfaces, and Law of Demeter lower coupling. When you justify a refactor in an interview, framing it as 'this raises cohesion / lowers coupling' is the language reviewers respect." },
    ],
    "Coupling & cohesion are the vocabulary for critiquing any design. 'Low coupling, high cohesion' and knowing which principles serve each is a senior framing reviewers reward.",
    ["Mixing up which you want high (cohesion) vs low (coupling).",
     "A low-cohesion 'Utils'/'Manager' grab-bag class.",
     "Tightly coupling to concrete classes instead of stable interfaces."],
    0.3),

  T("lld_m6_t7", 7, "Composition Over Inheritance", "composition-over-inheritance",
    ["principle", "composition", "inheritance"],
    "You need a class that's both a 'Timestamped' thing and a 'Serializable' thing and a 'Cacheable' thing. Inheritance gives you one parent. Now what?",
    "Favour composition (has-a, delegate to collaborators) over inheritance (is-a, extend a base). Inheritance is the tightest coupling in OOP and limited to one parent; composition is flexible, swappable at runtime, and unlimited. Use inheritance only for genuine, stable is-a hierarchies.",
    [
      { kind: "concept", heading: "Why inheritance bites",
        body: "Inheritance welds a subclass to its parent's internals (the 'fragile base class' problem — a base change ripples into all subclasses), allows only ONE parent in Java, and forces an is-a relationship that's often wrong ('a Stack is-a Vector?' — no). Deep hierarchies become rigid and hard to change." },
      { kind: "concept", heading: "Composition is the flexible default",
        body: "Compose behaviour by HOLDING collaborators and delegating to them: a class can hold many of them (no single-parent limit), swap them at runtime (inject a different one), and stay decoupled (depends on their interfaces). This is exactly how Strategy, Decorator, and Bridge work — they're composition applied with intent. 'Favour composition over inheritance' (Gang of Four) is one of the most-cited LLD answers." },
      { kind: "concept", heading: "When inheritance is still right",
        body: "Use inheritance for a genuine, stable is-a relationship where the base is designed for extension and you control it (e.g. an abstract Shape with concrete shapes, the Template Method skeleton). The rule isn't 'never inherit' — it's 'don't reach for inheritance as the default reuse mechanism; default to composition'." },
    ],
    "Composition-over-inheritance is among the most-cited LLD principles. Showing you default to composition (and naming Strategy/Decorator/Bridge as its application) while reserving inheritance for true is-a is a strong signal.",
    ["Defaulting to inheritance for code reuse instead of composition.",
     "Forcing an is-a relationship where has-a is the truth.",
     "Not connecting it to Strategy/Decorator/Bridge (composition patterns)."],
    0.3),

  T("lld_m6_t8", 8, "UML Class Relationships in Depth", "class-relationships",
    ["uml", "association", "aggregation", "composition", "dependency", "realization"],
    "On a class diagram: a solid line, a hollow diamond, a filled diamond, a dashed arrow, a hollow triangle. Five relationships — what does each mean in CODE?",
    "The five UML class relationships map directly to code: Association (a holds/uses b), Aggregation (whole-part, part outlives whole), Composition (whole-part, part dies with whole), Dependency (transient use, e.g. a parameter), and Realization (implements an interface). Getting these right shows you reason about ownership and lifetime.",
    [
      { kind: "concept", heading: "Association, Aggregation, Composition",
        body: "ASSOCIATION (solid line): one object holds/uses another with no ownership implied (a Teacher teaches Students). AGGREGATION (hollow diamond on the whole): a whole-part where the part can exist independently and be shared (a Team has Players; players survive the team). COMPOSITION (filled diamond): a strong whole-part where the part's lifetime is bound to the whole (an Order owns its LineItems; delete the order, they're gone). In code: a field reference; the diamond signals who controls the part's lifecycle." },
      { kind: "concept", heading: "Dependency & Realization",
        body: "DEPENDENCY (dashed arrow): a transient use — class A uses B as a method parameter, local variable, or return type, but doesn't hold it as state ('A depends on B'). REALIZATION (dashed line + hollow triangle): a class IMPLEMENTS an interface. (Generalization — solid line + hollow triangle — is class inheritance/extends.) These let a diagram show structure AND lifecycle at a glance." },
      { kind: "concept", heading: "Why the distinction matters in code",
        body: "The relationship dictates the code: composition → the whole creates/owns and destroys the part (often a final field built in the constructor); aggregation → the part is injected and shared (a reference passed in); dependency → no field at all, just a parameter. Choosing composition where the part should outlive the whole (or vice-versa) is a real modelling bug, not just a diagram nitpick." },
    ],
    "Class-relationship notation is drawn in every LLD round. Mapping each (especially composition vs aggregation lifecycle) to concrete code/ownership — not just lines — is what separates a real designer from someone drawing boxes.",
    ["Using composition (filled diamond) when the part outlives the whole.",
     "Confusing dependency (transient, a parameter) with association (a held field).",
     "Mixing up realization (implements interface) with generalization (extends class)."],
    0.4),
];

const EXERCISES = [
  // DRY
  pm({ topicId: "lld_m6_t1", exerciseId: "lld_m6_t1_pm_1", position: 1, level: "easy",
    title: "Name the violated principle",
    scenario: "The 18% tax rule is hard-coded in 6 different files. A rate change means editing all 6 (and missing one). Which principle is violated?",
    options: ["DRY", "KISS", "YAGNI", "Liskov Substitution"], correct: "DRY",
    explanation: "Duplicated knowledge (the tax rule) should have one source of truth — that's DRY." }),
  pm({ topicId: "lld_m6_t1", exerciseId: "lld_m6_t1_pm_2", position: 2, level: "medium",
    title: "When NOT to DRY",
    scenario: "Two functions look identical today but encode different rules that will change for different reasons. Merging them would…",
    options: ["Be false DRY — they represent different knowledge, keep them separate", "Always be correct, DRY is absolute", "Improve cohesion", "Reduce coupling"], correct: "Be false DRY — they represent different knowledge, keep them separate",
    explanation: "DRY is about shared KNOWLEDGE; merging coincidentally-similar code that changes for different reasons creates harmful coupling." }),
  pm({ topicId: "lld_m6_t1", exerciseId: "lld_m6_t1_pm_3", position: 3, level: "easy",
    title: "DRY in one line",
    scenario: "DRY is best summarised as…",
    options: ["One authoritative source of truth per piece of knowledge", "Never write two similar lines", "Always use inheritance", "Add abstraction everywhere"], correct: "One authoritative source of truth per piece of knowledge",
    explanation: "Each piece of knowledge should have a single, unambiguous representation." }),
  // KISS
  pm({ topicId: "lld_m6_t2", exerciseId: "lld_m6_t2_pm_1", position: 1, level: "easy",
    title: "Name the principle",
    scenario: "A developer builds a 3-layer plugin framework to format a date string. Which principle did they ignore?",
    options: ["KISS", "DRY", "Open/Closed", "Law of Demeter"], correct: "KISS",
    explanation: "KISS favours the simplest solution that works; a plugin framework for date formatting is needless complexity." }),
  pm({ topicId: "lld_m6_t2", exerciseId: "lld_m6_t2_pm_2", position: 2, level: "medium",
    title: "Patterns and KISS",
    scenario: "Forcing five design patterns into a simple to-do app most directly violates…",
    options: ["KISS (and YAGNI) — over-engineering", "DRY", "Liskov Substitution", "Interface Segregation"], correct: "KISS (and YAGNI) — over-engineering",
    explanation: "Patterns are tools, not goals; applying them without need is over-engineering — a KISS/YAGNI violation." }),
  pm({ topicId: "lld_m6_t2", exerciseId: "lld_m6_t2_pm_3", position: 3, level: "easy",
    title: "Optimise for…",
    scenario: "KISS says design should optimise primarily for…",
    options: ["Readability / the next maintainer", "Cleverness", "Maximum flexibility", "Fewest lines at any cost"], correct: "Readability / the next maintainer",
    explanation: "The simplest, most readable solution that works wins — code is read far more than written." }),
  // YAGNI
  pm({ topicId: "lld_m6_t3", exerciseId: "lld_m6_t3_pm_1", position: 1, level: "easy",
    title: "Name the principle",
    scenario: "You build configurable support for 5 databases when the product uses exactly 1, 'just in case'. Which principle says don't?",
    options: ["YAGNI", "DRY", "Liskov Substitution", "Single Responsibility"], correct: "YAGNI",
    explanation: "YAGNI: don't build speculative functionality until it's actually required." }),
  pm({ topicId: "lld_m6_t3", exerciseId: "lld_m6_t3_pm_2", position: 2, level: "medium",
    title: "YAGNI vs extensibility",
    scenario: "YAGNI correctly understood means…",
    options: ["Keep the design clean so you CAN add X later, but don't build X until needed", "Never design for change", "Always hard-code everything", "Build every feature you can imagine"], correct: "Keep the design clean so you CAN add X later, but don't build X until needed",
    explanation: "YAGNI defers building the feature, not the clean design that makes adding it cheap later." }),
  pm({ topicId: "lld_m6_t3", exerciseId: "lld_m6_t3_pm_3", position: 3, level: "easy",
    title: "The over-engineering trio",
    scenario: "Which principles together are the main guard against over-engineering?",
    options: ["KISS + YAGNI", "DRY + LSP", "OCP + ISP", "DIP + SRP"], correct: "KISS + YAGNI",
    explanation: "KISS (simplest that works) + YAGNI (don't pre-build) are the antidote to over-engineering." }),
  // Law of Demeter
  pm({ topicId: "lld_m6_t4", exerciseId: "lld_m6_t4_pm_1", position: 1, level: "medium",
    title: "Name the smell",
    scenario: "`order.getCustomer().getAddress().getCity()` reaches through three objects. Which principle does this train-wreck violate?",
    options: ["Law of Demeter", "DRY", "Liskov Substitution", "Open/Closed"], correct: "Law of Demeter",
    explanation: "Reaching through returned 'stranger' objects couples you to their structure — a Law of Demeter violation." }),
  pm({ topicId: "lld_m6_t4", exerciseId: "lld_m6_t4_pm_2", position: 2, level: "medium",
    title: "The fix",
    scenario: "How do you fix `order.getCustomer().getAddress().getCity()` per the Law of Demeter?",
    options: ["Add order.shippingCity() that delegates internally (Tell, Don't Ask)", "Cache getCustomer()", "Make Address public", "Inline all the getters"], correct: "Add order.shippingCity() that delegates internally (Tell, Don't Ask)",
    explanation: "Expose intent (shippingCity) and let each object delegate to its neighbour — don't reach through them." }),
  pm({ topicId: "lld_m6_t4", exerciseId: "lld_m6_t4_pm_3", position: 3, level: "medium",
    title: "What it does NOT mean",
    scenario: "The Law of Demeter does NOT mean…",
    options: ["You can never call any method (it's about not reaching through RETURNED objects)", "Talk only to immediate collaborators", "Avoid long getter chains", "Tell, don't ask"], correct: "You can never call any method (it's about not reaching through RETURNED objects)",
    explanation: "It limits calls to direct collaborators; calling methods on your own fields/params/created objects is fine." }),
  // Separation of Concerns
  pm({ topicId: "lld_m6_t5", exerciseId: "lld_m6_t5_pm_1", position: 1, level: "medium",
    title: "Name the violation",
    scenario: "One class parses the HTTP request, applies business rules, AND writes SQL. Which principle is violated?",
    options: ["Separation of Concerns", "DRY", "YAGNI", "Liskov Substitution"], correct: "Separation of Concerns",
    explanation: "Distinct concerns (transport, logic, persistence) should live in separate units/layers." }),
  pm({ topicId: "lld_m6_t5", exerciseId: "lld_m6_t5_pm_2", position: 2, level: "medium",
    title: "How it manifests",
    scenario: "Separation of Concerns commonly shows up architecturally as…",
    options: ["Layered architecture / MVC (presentation, business, data)", "A single god-class", "Global variables", "Deep inheritance"], correct: "Layered architecture / MVC (presentation, business, data)",
    explanation: "Layers (controller→service→repository) and MVC are SoC applied to system structure." }),
  pm({ topicId: "lld_m6_t5", exerciseId: "lld_m6_t5_pm_3", position: 3, level: "easy",
    title: "SoC vs SRP",
    scenario: "How does Separation of Concerns relate to the Single Responsibility Principle?",
    options: ["SoC is the system-wide version; SRP applies it at the class level", "They are unrelated", "SRP is broader than SoC", "They contradict each other"], correct: "SoC is the system-wide version; SRP applies it at the class level",
    explanation: "SoC separates concerns across the system; SRP says one class = one reason to change." }),
  // Coupling & Cohesion
  pm({ topicId: "lld_m6_t6", exerciseId: "lld_m6_t6_pm_1", position: 1, level: "easy",
    title: "High or low?",
    scenario: "Good design aims for…",
    options: ["Low coupling, high cohesion", "High coupling, low cohesion", "High coupling, high cohesion", "Low coupling, low cohesion"], correct: "Low coupling, high cohesion",
    explanation: "Loosely coupled (few, stable dependencies) and highly cohesive (focused units) is the design-quality headline." }),
  pm({ topicId: "lld_m6_t6", exerciseId: "lld_m6_t6_pm_2", position: 2, level: "medium",
    title: "Spot low cohesion",
    scenario: "A class `Utils` with unrelated methods (parse dates, send emails, hash passwords) exhibits…",
    options: ["Low cohesion", "High cohesion", "Low coupling", "Tight coupling"], correct: "Low cohesion",
    explanation: "A grab-bag of unrelated responsibilities is the classic low-cohesion smell — split it by purpose." }),
  pm({ topicId: "lld_m6_t6", exerciseId: "lld_m6_t6_pm_3", position: 3, level: "medium",
    title: "Lower the coupling",
    scenario: "Which most directly reduces coupling between two modules?",
    options: ["Depend on a stable interface + inject the implementation", "Access the other module's fields directly", "Merge them into one class", "Use static global state"], correct: "Depend on a stable interface + inject the implementation",
    explanation: "Programming to an interface + dependency injection (DIP) is the core coupling-reducer." }),
  // Composition over inheritance
  pm({ topicId: "lld_m6_t7", exerciseId: "lld_m6_t7_pm_1", position: 1, level: "medium",
    title: "Default to…",
    scenario: "For code reuse, the GoF advice is to favour…",
    options: ["Composition (has-a, delegate)", "Inheritance (is-a, extend)", "Static utility methods", "Copy-paste"], correct: "Composition (has-a, delegate)",
    explanation: "'Favour composition over inheritance' — it's looser, swappable, and not limited to one parent." }),
  pm({ topicId: "lld_m6_t7", exerciseId: "lld_m6_t7_pm_2", position: 2, level: "medium",
    title: "The inheritance trap",
    scenario: "Which is a real downside of inheritance vs composition?",
    options: ["Tight coupling to the base + single-parent limit (fragile base class)", "It can't reuse code", "It's slower at runtime", "It needs interfaces"], correct: "Tight coupling to the base + single-parent limit (fragile base class)",
    explanation: "Subclasses depend on parent internals; a base change ripples, and Java allows only one parent." }),
  pm({ topicId: "lld_m6_t7", exerciseId: "lld_m6_t7_pm_3", position: 3, level: "medium",
    title: "Patterns built on composition",
    scenario: "Which patterns are essentially 'composition applied with intent'?",
    options: ["Strategy, Decorator, Bridge", "Singleton, Factory", "Template Method, Visitor", "Iterator, Memento"], correct: "Strategy, Decorator, Bridge",
    explanation: "Strategy (swap algorithm), Decorator (wrap+add), and Bridge (split axes) all compose collaborators rather than inherit." }),
  // Class relationships
  pm({ topicId: "lld_m6_t8", exerciseId: "lld_m6_t8_pm_1", position: 1, level: "medium",
    title: "Filled diamond",
    scenario: "A filled diamond on the whole's end of a UML line means the part's lifetime is bound to the whole. That's…",
    options: ["Composition", "Aggregation", "Association", "Dependency"], correct: "Composition",
    explanation: "Composition (filled diamond) = strong ownership; destroy the whole and the parts go with it." }),
  pm({ topicId: "lld_m6_t8", exerciseId: "lld_m6_t8_pm_2", position: 2, level: "medium",
    title: "Transient use",
    scenario: "Class A uses B only as a method parameter (no stored field). The UML relationship is…",
    options: ["Dependency (dashed arrow)", "Composition (filled diamond)", "Aggregation (hollow diamond)", "Realization (hollow triangle)"], correct: "Dependency (dashed arrow)",
    explanation: "Transient use (parameter/local/return) with no held state is a dependency, drawn as a dashed arrow." }),
  pm({ topicId: "lld_m6_t8", exerciseId: "lld_m6_t8_pm_3", position: 3, level: "medium",
    title: "Implements an interface",
    scenario: "A class implementing an interface is shown in UML as…",
    options: ["Realization (dashed line + hollow triangle)", "Generalization (solid line + hollow triangle)", "Aggregation (hollow diamond)", "Association (solid line)"], correct: "Realization (dashed line + hollow triangle)",
    explanation: "Realization = implements an interface (dashed + hollow triangle); generalization (solid + hollow triangle) = extends a class." }),
];

async function upsertOne(Model, filter, doc) { return Model.findOneAndUpdate(filter, doc, { upsert: true, new: true, setDefaultsOnInsert: true }); }
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
  console.log(`\nDone — M6 Design Principles seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
