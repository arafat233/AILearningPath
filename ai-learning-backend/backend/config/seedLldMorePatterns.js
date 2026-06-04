/**
 * Seed — LLD module M7: Enterprise & Concurrency Patterns (breadth parity with
 * AlgoMaster's "Additional Patterns" beyond GoF): Repository, MVC, Dependency
 * Injection, Producer-Consumer, Thread Pool, Specification, Null Object, Game Loop.
 * Extends pro_lld. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedLldMorePatterns.js   ·   npm: npm run seed:lld-morepatterns
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m7";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 7,
  name: "Enterprise & Concurrency Patterns", slug: "enterprise-patterns",
  description: "Patterns beyond the Gang of Four that show up in real systems: Repository, MVC, Dependency Injection, Producer-Consumer, Thread Pool, Specification, Null Object, and Game Loop.",
  estimatedHours: 4, prerequisites: ["lld_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff) => ({
  trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
  metadata: { estimated_minutes: 25, difficulty: 3, prerequisites: [], tags },
  hook: { question: hookQ, insight: hookI }, teaching: { blocks },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: [], estimatedMinutes: 25, difficulty: diff, xpReward: 50, visualizer: null,
});

const TOPICS = [
  T("lld_m7_t1", 1, "Repository Pattern", "repository-pattern",
    ["pattern", "repository", "data-access"],
    "Your business logic is littered with SQL and JDBC calls. Switching to Mongo means rewriting everything. What pattern isolates persistence?",
    "Repository provides a collection-like interface for accessing domain objects, hiding the data source behind it. Business code calls userRepo.findById(id) / save(user) and never sees SQL or the database technology — so persistence can be swapped, mocked in tests, and changed without touching the domain.",
    [
      { kind: "concept", heading: "Intent",
        body: "A Repository mediates between the domain and the data-mapping layer, acting like an in-memory collection of domain objects: findById, save, delete, findByEmail. The implementation talks to SQL/NoSQL/an API, but callers only see the interface. It centralises data access and keeps persistence concerns out of business logic (Separation of Concerns + DIP)." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface UserRepository {                  // the abstraction the domain depends on\n    Optional<User> findById(String id);\n    void save(User u);\n}\nclass JpaUserRepository implements UserRepository { /* SQL via JPA */ }\nclass InMemoryUserRepository implements UserRepository { /* a HashMap — for tests */ }\n\nclass UserService {\n    private final UserRepository repo;          // depends on the interface (DIP)\n    UserService(UserRepository repo){ this.repo = repo; }\n}" },
      { kind: "concept", heading: "Why it wins & where you'll see it",
        body: "Swap the DB by swapping the implementation; unit-test the service against an in-memory repo (no database); keep query logic in one place. Spring Data generates repositories from an interface; Domain-Driven Design treats repositories as the gateway to aggregates. Distinguish it from a DAO (Data Access Object): a DAO is a thinner per-table data wrapper; a Repository is a higher-level, collection-like abstraction over domain aggregates." },
    ],
    "Repository is everywhere in backend design (Spring Data, DDD). The signal is isolating persistence behind a collection-like interface so the domain is DB-agnostic and testable, and distinguishing it from a raw DAO.",
    ["Leaking SQL/ORM details into business logic instead of behind a repository.",
     "Confusing a thin DAO with a domain-level Repository.",
     "Not leveraging the repository interface to inject a fake in tests."],
    0.4),

  T("lld_m7_t2", 2, "MVC — Model-View-Controller", "mvc-pattern",
    ["pattern", "mvc", "architecture"],
    "UI code, business rules, and data all tangled in one file. Change the look and you risk the logic. What pattern splits them into three roles?",
    "MVC separates an app into Model (data + business rules), View (presentation), and Controller (handles input, coordinates the two). The view reacts to model changes; the controller turns user actions into model updates. It's Separation of Concerns applied to interactive apps.",
    [
      { kind: "concept", heading: "The three roles",
        body: "MODEL: the data and business logic — knows nothing about the UI. VIEW: renders the model to the user (HTML/screen) — no business logic. CONTROLLER: receives user input, invokes model operations, and selects the view to render. The split lets you change the UI without touching rules, test the model headlessly, and reuse the model across views (web/mobile/API)." },
      { kind: "concept", heading: "MVC vs MVP vs MVVM",
        body: "All separate UI from logic; they differ in how the view and logic connect. MVC: controller mediates input→model→view. MVP: a Presenter holds all view logic and updates a passive view (common in older Android). MVVM: a ViewModel exposes observable state the view DATA-BINDS to (Angular/Vue/SwiftUI/WPF). Modern front-ends lean MVVM/component models; server frameworks (Spring MVC, Rails, Django) are MVC." },
      { kind: "concept", heading: "Where you'll see it",
        body: "Spring MVC, Ruby on Rails, Django, ASP.NET MVC are server-side MVC; the pattern underlies nearly every web framework. It's really Separation of Concerns + Observer (the view observes the model) packaged for UIs. Keep business logic in the model, not the controller (a 'fat controller' is an anti-pattern)." },
    ],
    "MVC and its cousins (MVP/MVVM) come up for any UI/app-architecture question. Know the three roles, that the model is UI-agnostic, and the MVVM data-binding distinction for modern front-ends.",
    ["Putting business logic in the controller/view instead of the model (fat controller).",
     "Not knowing how MVVM (data-binding) differs from MVC (controller-mediated).",
     "Coupling the model to a specific view technology."],
    0.4),

  T("lld_m7_t3", 3, "Dependency Injection", "dependency-injection-pattern",
    ["pattern", "dependency-injection", "ioc"],
    "A class `new`s its own collaborators inside itself — now you can't test it or swap them. What pattern hands collaborators in from outside?",
    "Dependency Injection supplies a class's dependencies from outside (via constructor, setter, or a framework) instead of the class creating them. It's the concrete technique that achieves the Dependency Inversion Principle — enabling testability (inject mocks), swappability, and loose coupling.",
    [
      { kind: "concept", heading: "Intent & forms",
        body: "Instead of `this.repo = new MySqlRepo()` (the class controls its dependency), the dependency is PASSED IN: constructor injection (preferred — dependencies are explicit and the object is fully built/immutable), setter injection (optional/changeable deps), or field injection (framework sets it). The class declares WHAT it needs (an interface) and the caller/container provides it." },
      { kind: "code", heading: "Constructor injection (Java)",
        body: "class OrderService {\n    private final OrderRepository repo;\n    private final PaymentGateway payments;\n    OrderService(OrderRepository repo, PaymentGateway payments) {  // injected, not new-ed\n        this.repo = repo; this.payments = payments;\n    }\n}\n// Prod: new OrderService(new JpaOrderRepo(), new StripeGateway());\n// Test: new OrderService(new InMemoryRepo(), new FakeGateway());" },
      { kind: "concept", heading: "DI vs DIP, and IoC containers",
        body: "DIP (Dependency Inversion Principle) is the GOAL — depend on abstractions; DI is one WAY to achieve it — inject those abstractions. An IoC (Inversion of Control) container (Spring, Guice, Dagger) automates wiring: you declare components and it constructs and injects the graph for you. Don't conflate the three: DIP = principle, DI = technique, IoC container = the tool that does DI at scale." },
    ],
    "DI is fundamental to testable, modern backends. The signal is constructor injection for explicit, immutable deps, and articulating DI (technique) vs DIP (principle) vs IoC container (tool).",
    ["Conflating DI (the technique) with DIP (the principle) or the IoC container (the tool).",
     "Newing dependencies inside a class, defeating testability/swappability.",
     "Preferring field injection over constructor injection (hides required deps)."],
    0.4),

  T("lld_m7_t4", 4, "Producer-Consumer", "producer-consumer-pattern",
    ["pattern", "concurrency", "producer-consumer", "queue"],
    "Fast producers generate work faster than slow consumers can process it. How do you decouple their speeds without losing work or busy-waiting?",
    "Producer-Consumer decouples threads that produce work from threads that consume it via a shared, thread-safe BOUNDED QUEUE (a buffer). Producers enqueue, consumers dequeue; the queue smooths speed differences and provides backpressure when full. In Java, a BlockingQueue does the synchronization for you.",
    [
      { kind: "concept", heading: "The pattern",
        body: "Producers put items into a shared queue; consumers take items out — neither knows about the other, only the queue. This decouples their rates (a burst of production is buffered), enables parallelism (many consumers drain one queue), and isolates failure. The queue must be thread-safe, and bounded so memory can't grow without limit." },
      { kind: "code", heading: "Java BlockingQueue does the hard part",
        body: "BlockingQueue<Task> q = new ArrayBlockingQueue<>(1000);  // bounded buffer\n// Producer thread:\nq.put(task);     // BLOCKS if the queue is full → natural backpressure\n// Consumer thread(s):\nTask t = q.take(); // BLOCKS if the queue is empty → no busy-waiting\n// No manual locks/wait-notify: the BlockingQueue handles synchronization." },
      { kind: "concept", heading: "Backpressure & where you'll see it",
        body: "A BOUNDED queue is the key: when it fills, put() blocks (or rejects), pushing back on producers so a fast producer can't OOM the system — that's backpressure. Underlies thread pools (the work queue), log shippers, ingestion pipelines, and is the in-process cousin of a message queue (Kafka/RabbitMQ) at system scale. Don't hand-roll wait/notify when BlockingQueue exists." },
    ],
    "Producer-Consumer is the core concurrency pattern (and the heart of thread pools). The signal is a bounded BlockingQueue for decoupling + backpressure, not manual locks, and seeing it as the in-process version of a message queue.",
    ["Using an unbounded queue (no backpressure → OOM under load).",
     "Hand-rolling wait/notify instead of a BlockingQueue.",
     "Busy-waiting/polling instead of blocking take()/put()."],
    0.5),

  T("lld_m7_t5", 5, "Thread Pool", "thread-pool-pattern",
    ["pattern", "concurrency", "thread-pool", "executor"],
    "Spawning a new thread per request sounds simple — until 10,000 requests spawn 10,000 threads and the JVM dies. What reuses a fixed set of workers?",
    "A Thread Pool maintains a fixed set of worker threads that pull tasks from a shared queue, so you reuse threads instead of creating one per task. It bounds concurrency (protecting resources), amortises thread-creation cost, and provides backpressure via its queue. In Java, use an ExecutorService.",
    [
      { kind: "concept", heading: "Why pool threads",
        body: "Thread creation is expensive (memory + OS overhead) and unbounded threads exhaust the machine (context-switch thrashing, OOM). A pool creates N workers ONCE; each worker loops, taking tasks from a queue and executing them. This caps concurrency at N (a tuning knob), reuses threads, and is essentially Producer-Consumer (the submitter produces tasks, workers consume)." },
      { kind: "code", heading: "Java ExecutorService",
        body: "ExecutorService pool = Executors.newFixedThreadPool(8);   // 8 reusable workers\nFuture<Result> f = pool.submit(() -> compute());          // queue a task, get a Future\nResult r = f.get();                                       // await the result\npool.shutdown();\n// Behind it: a thread pool + a task queue (Producer-Consumer)." },
      { kind: "concept", heading: "Sizing & rejection",
        body: "Size by workload: CPU-bound ≈ number of cores; I/O-bound can be much larger (threads spend time waiting). Decide the queue bound and the rejection policy when full (block the submitter, drop, or run-on-caller) — an unbounded queue hides overload until OOM. Modern Java also offers virtual threads (Project Loom) for massive I/O concurrency, changing the sizing calculus." },
    ],
    "Thread pools are the standard answer to 'don't spawn a thread per task'. The signal is ExecutorService with a bounded queue + a sizing rule (CPU vs I/O bound) + a rejection policy — and that it's Producer-Consumer underneath.",
    ["Creating a thread per request instead of pooling.",
     "An unbounded task queue that masks overload until OOM.",
     "Not sizing the pool to the workload (CPU vs I/O bound)."],
    0.5),

  T("lld_m7_t6", 6, "Specification Pattern", "specification-pattern",
    ["pattern", "specification", "business-rules"],
    "Filtering rules multiply: active users, in the EU, who spent > $100, OR are VIP. Hard-coding every combination is a mess. What makes rules composable objects?",
    "Specification encapsulates a business rule as an object with isSatisfiedBy(candidate), and lets you COMBINE rules with and()/or()/not(). Instead of sprawling conditionals, you build complex criteria from small, reusable, testable rule objects — and the same spec can filter in memory or translate to a query.",
    [
      { kind: "concept", heading: "Rules as composable objects",
        body: "A Specification is a predicate object: `boolean isSatisfiedBy(T candidate)`. Each rule (IsActive, InRegion(EU), SpentOver(100)) is its own small class. Combinators build new specs: `isActive.and(inEu).and(spentOver(100).or(isVip))`. This turns a tangle of if/else into named, reusable, unit-testable rules you can mix at runtime." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Spec<T> {\n    boolean isSatisfiedBy(T t);\n    default Spec<T> and(Spec<T> o){ return c -> this.isSatisfiedBy(c) && o.isSatisfiedBy(c); }\n    default Spec<T> or(Spec<T> o){  return c -> this.isSatisfiedBy(c) || o.isSatisfiedBy(c); }\n    default Spec<T> not(){          return c -> !this.isSatisfiedBy(c); }\n}\n// usage: users.stream().filter(active.and(inEu)::isSatisfiedBy)..." },
      { kind: "concept", heading: "Where it shines",
        body: "Complex, changing business rules: eligibility checks, validation, search filters, pricing/discount qualification. It's heavily used in Domain-Driven Design, and Spring Data JPA Specifications can even translate a spec tree into a SQL WHERE clause — so the same composable rule filters in memory OR in the database. Reach for it when rule combinations explode; it's overkill for one simple condition." },
    ],
    "Specification appears in rules-heavy domains (commerce, eligibility, search). The signal is composable isSatisfiedBy rule objects with and/or/not, replacing sprawling conditionals, and that the same spec can drive a DB query.",
    ["Hard-coding every rule combination in conditionals instead of composable specs.",
     "Using it for a single trivial condition (over-engineering).",
     "Not realising specs can translate to a query (Spring Data Specifications)."],
    0.5),

  T("lld_m7_t7", 7, "Null Object Pattern", "null-object-pattern",
    ["pattern", "null-object", "defensive"],
    "Your code is full of `if (x != null)` checks and still throws NullPointerExceptions. What pattern removes the null checks entirely?",
    "Null Object provides a do-nothing implementation of an interface to stand in for 'no object', so callers never receive null and never need null checks. Instead of returning null, return a NullObject whose methods are safe no-ops (or sensible defaults) — eliminating NPEs and special-case branches.",
    [
      { kind: "concept", heading: "A safe default instead of null",
        body: "Rather than returning null (forcing every caller to check and risking NPEs), return an object that implements the same interface but does nothing meaningful: a NullLogger that discards messages, a GuestUser with no permissions, a NoOpListener. Callers treat it uniformly — `logger.log(x)` just works whether logging is on or off. The absence is represented by a real, polymorphic object." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Logger { void log(String m); }\nclass FileLogger implements Logger { public void log(String m){ /* write */ } }\nclass NullLogger implements Logger { public void log(String m){ /* no-op */ } }\n\n// Factory returns a Null Object instead of null:\nLogger logger = config.loggingEnabled ? new FileLogger() : new NullLogger();\nlogger.log(\"hi\");   // always safe — no null check needed" },
      { kind: "concept", heading: "When to use (and not)",
        body: "Use it when 'no object' has a sensible do-nothing behaviour and you want to kill null checks (loggers, optional collaborators, default strategies). Java's Optional and Collections.emptyList()/emptyMap() are related 'no special-case' ideas. Don't use it when absence is genuinely exceptional and should be handled explicitly — silently no-op'ing a missing required dependency can hide bugs." },
    ],
    "Null Object is a clean-code pattern for removing null checks. The signal is returning a polymorphic do-nothing implementation instead of null, and knowing when absence should NOT be silently swallowed.",
    ["Returning null and scattering null checks instead of a Null Object.",
     "Using it where a missing value is truly exceptional (hides bugs).",
     "Not relating it to Optional / empty collections."],
    0.3),

  T("lld_m7_t8", 8, "Game Loop Pattern", "game-loop-pattern",
    ["pattern", "game-loop", "real-time"],
    "A game must update physics and redraw the screen ~60 times a second, smoothly, regardless of the machine's speed. What structures that?",
    "The Game Loop runs continuously: process input → update game state → render, repeating every frame. The key challenge is decoupling game time from real time so the game runs at the same SPEED on fast and slow hardware (via a fixed timestep / delta-time), not the same frame rate.",
    [
      { kind: "concept", heading: "The loop",
        body: "while (running) { processInput(); update(dt); render(); } — forever, as fast as it can, ideally synced to the display. processInput reads controls; update advances simulation (physics, AI) by a time delta; render draws the current state. Unlike an event-driven app that waits for input, a game loop runs constantly because the world keeps moving even when the player does nothing." },
      { kind: "concept", heading: "Decouple game time from real time",
        body: "The core problem: a fast PC would run the simulation faster than a slow one if you naively update per frame. Fix it with a FIXED TIMESTEP (accumulate elapsed real time and run update() in fixed steps — deterministic physics) and/or pass delta-time (dt) into update so motion scales by elapsed time. Render can interpolate between fixed updates for smoothness. This keeps gameplay SPEED consistent across hardware." },
      { kind: "concept", heading: "Where you'll see it",
        body: "Every game engine (Unity, Unreal, custom) and many simulations/animation systems have a game loop at their heart. It also appears in robotics/control loops and real-time renderers. In an LLD game design (Tic-Tac-Toe is turn-based, but a real-time game), mentioning the loop + fixed-timestep is the signal you understand the runtime model." },
    ],
    "Game Loop is the niche-but-named pattern for real-time apps/games. The signal is input→update→render every frame AND decoupling game time from real time (fixed timestep / delta-time) so speed is hardware-independent.",
    ["A naive per-frame update that runs faster on faster hardware.",
     "Not separating update (simulation) from render (drawing).",
     "Treating it like an event-driven app that waits for input."],
    0.4),
];

const EXERCISES = [
  // Repository
  pm({ topicId: "lld_m7_t1", exerciseId: "lld_m7_t1_pm_1", position: 1, level: "medium", title: "Name the pattern",
    scenario: "Business code calls userRepo.findById(id)/save(user) and never sees SQL; you can swap the DB by swapping the implementation. Which pattern?",
    options: ["Repository", "Factory", "Adapter", "Proxy"], correct: "Repository",
    explanation: "A collection-like interface hiding the data source behind it is the Repository pattern." }),
  pm({ topicId: "lld_m7_t1", exerciseId: "lld_m7_t1_pm_2", position: 2, level: "medium", title: "Test without a database",
    scenario: "What does a UserRepository interface let you do in unit tests?",
    options: ["Inject an in-memory implementation (no real DB)", "Run SQL faster", "Skip writing tests", "Encrypt the data"], correct: "Inject an in-memory implementation (no real DB)",
    explanation: "Depending on the interface lets you inject a fake/in-memory repo, testing the service without a database." }),
  pm({ topicId: "lld_m7_t1", exerciseId: "lld_m7_t1_pm_3", position: 3, level: "medium", title: "Repository vs DAO",
    scenario: "How does a Repository differ from a DAO?",
    options: ["Repository is a higher-level, collection-like abstraction over domain aggregates; DAO is a thinner per-table data wrapper", "They are identical", "DAO is higher-level", "Repository can't use SQL"], correct: "Repository is a higher-level, collection-like abstraction over domain aggregates; DAO is a thinner per-table data wrapper",
    explanation: "Repository works at the domain/aggregate level (collection semantics); a DAO is a lower-level table/data-source wrapper." }),
  // MVC
  pm({ topicId: "lld_m7_t2", exerciseId: "lld_m7_t2_pm_1", position: 1, level: "easy", title: "Where do business rules live?",
    scenario: "In MVC, business logic and data belong in which component?",
    options: ["Model", "View", "Controller", "Router"], correct: "Model",
    explanation: "The Model holds data + business rules and is UI-agnostic; the View renders, the Controller coordinates." }),
  pm({ topicId: "lld_m7_t2", exerciseId: "lld_m7_t2_pm_2", position: 2, level: "medium", title: "MVVM's difference",
    scenario: "What distinguishes MVVM from MVC?",
    options: ["The View data-binds to an observable ViewModel", "It has no model", "The controller renders HTML", "It forbids business logic"], correct: "The View data-binds to an observable ViewModel",
    explanation: "MVVM uses a ViewModel exposing observable state the view binds to (Angular/Vue/SwiftUI), vs MVC's controller-mediated flow." }),
  pm({ topicId: "lld_m7_t2", exerciseId: "lld_m7_t2_pm_3", position: 3, level: "easy", title: "The anti-pattern",
    scenario: "Putting business logic in the controller instead of the model is called…",
    options: ["A fat controller (anti-pattern)", "Good MVC", "MVVM", "A thin model"], correct: "A fat controller (anti-pattern)",
    explanation: "Controllers should be thin (coordinate); logic belongs in the model — a fat controller violates the separation." }),
  // DI
  pm({ topicId: "lld_m7_t3", exerciseId: "lld_m7_t3_pm_1", position: 1, level: "medium", title: "Preferred injection form",
    scenario: "Which DI form makes dependencies explicit and the object immutable/fully-built?",
    options: ["Constructor injection", "Field injection", "Setter injection", "Service locator"], correct: "Constructor injection",
    explanation: "Constructor injection requires all deps at creation (explicit, immutable, testable) — the preferred form." }),
  pm({ topicId: "lld_m7_t3", exerciseId: "lld_m7_t3_pm_2", position: 2, level: "hard", title: "DI vs DIP vs IoC",
    scenario: "Which correctly relates the three?",
    options: ["DIP = principle (depend on abstractions); DI = technique (inject them); IoC container = tool that automates DI", "They are the same thing", "DI is a principle, DIP is a tool", "IoC container is a principle"], correct: "DIP = principle (depend on abstractions); DI = technique (inject them); IoC container = tool that automates DI",
    explanation: "Don't conflate them: DIP is the goal, DI is the technique, an IoC container (Spring/Guice) does DI at scale." }),
  pm({ topicId: "lld_m7_t3", exerciseId: "lld_m7_t3_pm_3", position: 3, level: "easy", title: "The smell DI fixes",
    scenario: "Which code smell does Dependency Injection eliminate?",
    options: ["A class new-ing its own collaborators (untestable, unswappable)", "Too many interfaces", "Long methods", "Deep inheritance"], correct: "A class new-ing its own collaborators (untestable, unswappable)",
    explanation: "Injecting deps removes internal `new`, enabling mocking and swapping (achieving DIP)." }),
  // Producer-Consumer
  pm({ topicId: "lld_m7_t4", exerciseId: "lld_m7_t4_pm_1", position: 1, level: "medium", title: "Decouple producer/consumer speed",
    scenario: "Fast producers, slow consumers. What sits between them to decouple their rates safely?",
    options: ["A thread-safe bounded queue (BlockingQueue)", "A shared global variable", "A busy-wait loop", "A single lock"], correct: "A thread-safe bounded queue (BlockingQueue)",
    explanation: "A bounded BlockingQueue buffers work, parallelizes consumers, and gives backpressure when full." }),
  pm({ topicId: "lld_m7_t4", exerciseId: "lld_m7_t4_pm_2", position: 2, level: "hard", title: "Why bounded?",
    scenario: "Why must the producer-consumer queue be BOUNDED?",
    options: ["So a fast producer can't grow it unbounded and OOM — put() blocks = backpressure", "To make it thread-safe", "To allow more consumers", "To avoid using locks"], correct: "So a fast producer can't grow it unbounded and OOM — put() blocks = backpressure",
    explanation: "A bounded queue blocks producers when full (backpressure), preventing unbounded memory growth." }),
  pm({ topicId: "lld_m7_t4", exerciseId: "lld_m7_t4_pm_3", position: 3, level: "medium", title: "Avoid hand-rolling",
    scenario: "In Java, instead of manual wait/notify for producer-consumer, you should use…",
    options: ["A BlockingQueue (e.g. ArrayBlockingQueue)", "Thread.sleep polling", "A synchronized field", "volatile booleans"], correct: "A BlockingQueue (e.g. ArrayBlockingQueue)",
    explanation: "BlockingQueue handles the synchronization (blocking put/take) — no manual wait/notify or busy-waiting." }),
  // Thread Pool
  pm({ topicId: "lld_m7_t5", exerciseId: "lld_m7_t5_pm_1", position: 1, level: "medium", title: "Don't spawn per task",
    scenario: "10,000 requests shouldn't spawn 10,000 threads. What reuses a fixed set of workers?",
    options: ["A thread pool (ExecutorService)", "A new Thread per request", "A bigger heap", "A Singleton"], correct: "A thread pool (ExecutorService)",
    explanation: "A thread pool reuses N workers pulling from a task queue, capping concurrency and amortising thread creation." }),
  pm({ topicId: "lld_m7_t5", exerciseId: "lld_m7_t5_pm_2", position: 2, level: "hard", title: "Sizing the pool",
    scenario: "For a CPU-bound workload, a good starting pool size is roughly…",
    options: ["The number of CPU cores", "10,000", "1", "Unlimited"], correct: "The number of CPU cores",
    explanation: "CPU-bound work saturates at ~#cores; I/O-bound can be larger since threads wait. Size to the workload." }),
  pm({ topicId: "lld_m7_t5", exerciseId: "lld_m7_t5_pm_3", position: 3, level: "medium", title: "Pool internals",
    scenario: "A thread pool is essentially which other pattern under the hood?",
    options: ["Producer-Consumer (submitters produce tasks, workers consume from a queue)", "Singleton", "Observer", "Visitor"], correct: "Producer-Consumer (submitters produce tasks, workers consume from a queue)",
    explanation: "Submitters enqueue tasks; worker threads dequeue and run them — classic producer-consumer." }),
  // Specification
  pm({ topicId: "lld_m7_t6", exerciseId: "lld_m7_t6_pm_1", position: 1, level: "medium", title: "Name the pattern",
    scenario: "Each business rule is an object with isSatisfiedBy(x), and you combine them with and()/or()/not(). Which pattern?",
    options: ["Specification", "Strategy", "Visitor", "Builder"], correct: "Specification",
    explanation: "Composable isSatisfiedBy rule objects combined with boolean operators are the Specification pattern." }),
  pm({ topicId: "lld_m7_t6", exerciseId: "lld_m7_t6_pm_2", position: 2, level: "medium", title: "When it pays off",
    scenario: "Specification is most worth it when…",
    options: ["Business rules combine in many changing ways (eligibility, filters)", "There is exactly one simple condition", "You need a singleton", "You want to hide a subsystem"], correct: "Business rules combine in many changing ways (eligibility, filters)",
    explanation: "It shines when rule combinations explode; for a single condition it's over-engineering." }),
  pm({ topicId: "lld_m7_t6", exerciseId: "lld_m7_t6_pm_3", position: 3, level: "hard", title: "Spec to query",
    scenario: "A useful property of specifications in frameworks like Spring Data is that they can…",
    options: ["Translate the rule tree into a database query (WHERE clause)", "Only run in memory", "Replace the database", "Encrypt data"], correct: "Translate the rule tree into a database query (WHERE clause)",
    explanation: "The same spec can filter in memory OR be translated to SQL (Spring Data JPA Specifications)." }),
  // Null Object
  pm({ topicId: "lld_m7_t7", exerciseId: "lld_m7_t7_pm_1", position: 1, level: "medium", title: "Name the pattern",
    scenario: "Instead of returning null, you return a do-nothing implementation (a NullLogger) so callers never null-check. Which pattern?",
    options: ["Null Object", "Singleton", "Proxy", "Factory"], correct: "Null Object",
    explanation: "A polymorphic do-nothing stand-in for 'no object' that removes null checks is the Null Object pattern." }),
  pm({ topicId: "lld_m7_t7", exerciseId: "lld_m7_t7_pm_2", position: 2, level: "medium", title: "Main benefit",
    scenario: "The primary benefit of a Null Object is…",
    options: ["Eliminating null checks and NullPointerExceptions", "Faster code", "Less memory", "Encryption"], correct: "Eliminating null checks and NullPointerExceptions",
    explanation: "Callers treat the Null Object like any other instance — no `if (x != null)` and no NPEs." }),
  pm({ topicId: "lld_m7_t7", exerciseId: "lld_m7_t7_pm_3", position: 3, level: "medium", title: "When NOT to use it",
    scenario: "When is a Null Object the WRONG choice?",
    options: ["When absence is genuinely exceptional and should be handled explicitly (it would hide bugs)", "When you want fewer null checks", "When a do-nothing default makes sense", "For an optional logger"], correct: "When absence is genuinely exceptional and should be handled explicitly (it would hide bugs)",
    explanation: "Silently no-op'ing a truly-required missing dependency hides errors; handle real exceptional absence explicitly." }),
  // Game Loop
  pm({ topicId: "lld_m7_t8", exerciseId: "lld_m7_t8_pm_1", position: 1, level: "medium", title: "The loop's steps",
    scenario: "A game loop repeats which sequence every frame?",
    options: ["Process input → update state → render", "Connect → query → close", "Map → shuffle → reduce", "Lock → modify → unlock"], correct: "Process input → update state → render",
    explanation: "Each frame: read input, advance the simulation, draw — continuously." }),
  pm({ topicId: "lld_m7_t8", exerciseId: "lld_m7_t8_pm_2", position: 2, level: "hard", title: "Hardware independence",
    scenario: "How does a game loop keep gameplay SPEED the same on fast and slow machines?",
    options: ["Fixed timestep / pass delta-time so updates scale by elapsed time", "Cap the CPU", "Render fewer pixels", "Use more threads"], correct: "Fixed timestep / pass delta-time so updates scale by elapsed time",
    explanation: "Decoupling game time from real time (fixed timestep or delta-time) keeps speed consistent regardless of frame rate." }),
  pm({ topicId: "lld_m7_t8", exerciseId: "lld_m7_t8_pm_3", position: 3, level: "easy", title: "Why a loop, not events",
    scenario: "Why does a game use a continuous loop rather than waiting for input like a typical app?",
    options: ["The world keeps moving even when the player does nothing", "It saves CPU", "Events are impossible in games", "To avoid threads"], correct: "The world keeps moving even when the player does nothing",
    explanation: "Physics/AI/animation advance every frame regardless of input, so the loop runs constantly." }),
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
  console.log(`\nDone — M7 Enterprise & Concurrency Patterns seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
