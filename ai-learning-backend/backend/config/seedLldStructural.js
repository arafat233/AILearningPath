/**
 * Seed — LLD module M3: Structural Patterns (Facade, Composite, Proxy, Bridge,
 * Flyweight). Extends pro_lld (Decorator + Adapter already live in M1).
 *
 * Idempotent upsert-by-id; recomputes track totals from the DB. Test-case types
 * follow the proven grading convention (pattern_match / text_match / execution).
 * Java stays JDK-13-safe.
 *
 * Usage:  node config/seedLldStructural.js   ·   npm: npm run seed:lld-structural
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m3";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 3,
  name: "Structural Patterns", slug: "structural-patterns",
  description: "How classes and objects compose into larger structures: Facade (simplify a subsystem), Composite (part-whole trees), Proxy (control access), Bridge (split abstraction from implementation), Flyweight (share state to save memory). (Decorator & Adapter live in M1.)",
  estimatedHours: 5, prerequisites: ["lld_m1"], status: "live",
};

const TOPICS = [
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m3_t1", topicNumber: 1,
    name: "Facade Pattern", slug: "facade-pattern",
    metadata: { estimated_minutes: 25, difficulty: 1, prerequisites: ["lld_m1_t1"], tags: ["structural", "facade", "subsystem"] },
    hook: {
      question: "Starting a movie means turning on the amplifier, dimming lights, lowering the screen, and starting the projector — 4 subsystems, 12 calls. How do you give callers a one-liner?",
      insight: "A Facade provides a single simplified interface to a complex subsystem. watchMovie() hides the orchestration of many parts. Callers depend on the facade, not the tangle behind it.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Facade provides a unified, higher-level interface to a set of interfaces in a subsystem, making the subsystem easier to use. It doesn't hide the subsystem (callers can still go direct if needed) — it offers a convenient default path for the common case." },
      { kind: "code", heading: "Structure (Java)",
        body: "class HomeTheaterFacade {\n    private final Amplifier amp; private final Projector proj; private final Lights lights;\n    HomeTheaterFacade(Amplifier a, Projector p, Lights l){ amp=a; proj=p; lights=l; }\n    void watchMovie() {            // one call orchestrates many\n        lights.dim(10);\n        proj.on();\n        amp.setVolume(5);\n    }\n}" },
      { kind: "concept", heading: "Facade vs Adapter vs Decorator",
        body: "Facade SIMPLIFIES access to a subsystem (new, smaller interface over many classes). Adapter CONVERTS one existing interface into another the client expects (usually 1:1). Decorator ADDS behaviour while keeping the same interface. Facade is about reducing complexity; the others are about compatibility and extension." },
      { kind: "concept", heading: "Benefits and limits",
        body: "A facade decouples clients from subsystem internals (DIP) and gives a stable surface even if the subsystem is refactored. It does NOT add functionality and shouldn't become a god-object that grows every method — keep it focused on common use-cases; advanced callers can still reach the subsystem directly." },
    ] },
    interviewRelevance: "Facade is the go-to answer for 'wrap this messy subsystem behind something simple'. Distinguishing it from Adapter and Decorator is a frequent follow-up.",
    commonGaps: { gaps: [
      "Confusing Facade (simplify many) with Adapter (convert one interface).",
      "Letting the facade balloon into a god-object.",
      "Believing a facade must hide the subsystem entirely — it only offers a simpler default path.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 25, difficulty: 0.2, xpReward: 50, visualizer: null,
  },
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m3_t2", topicNumber: 2,
    name: "Composite Pattern", slug: "composite-pattern",
    metadata: { estimated_minutes: 35, difficulty: 3, prerequisites: ["lld_m1_t1"], tags: ["structural", "composite", "tree", "recursion"] },
    hook: {
      question: "A folder contains files AND other folders. You want one method — size() — that works the same whether you call it on a file or a whole tree. How?",
      insight: "Composite composes objects into tree structures and lets clients treat individual objects (leaves) and compositions (branches) uniformly through a shared interface. A folder's size() just sums its children's size() — recursion falls out for free.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Composite lets you build part-whole hierarchies and treat a single object and a group of objects identically. Both the Leaf and the Composite implement the same Component interface; the Composite holds children (which are themselves Components) and delegates operations to them." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Node { int size(); }\nclass File implements Node {            // Leaf\n    private final int bytes; File(int b){ bytes=b; }\n    public int size(){ return bytes; }\n}\nclass Dir implements Node {             // Composite\n    private final List<Node> children = new ArrayList<>();\n    Dir add(Node n){ children.add(n); return this; }\n    public int size(){ int t=0; for (Node c : children) t += c.size(); return t; }\n}" },
      { kind: "concept", heading: "Why uniformity matters",
        body: "Client code calls node.size() without knowing or caring whether node is a File or a Dir. Adding a new leaf type doesn't change traversal code. The recursion is implicit: a Dir's size() calls size() on each child, which may itself be a Dir, all the way down." },
      { kind: "concept", heading: "Where it shows up",
        body: "File systems, GUI widget trees (a Panel contains Buttons and other Panels), org charts, arithmetic expression trees, and menu hierarchies are all Composite. Any time 'a thing can contain things of the same kind' you likely want Composite." },
    ] },
    interviewRelevance: "Composite is the standard model for any recursive part-whole structure (file systems, UI trees, menus). Showing that a Dir and a File share one interface and that operations recurse naturally is the key signal.",
    commonGaps: { gaps: [
      "Giving Leaf and Composite different interfaces, forcing clients to type-check.",
      "Putting child-management methods (add/remove) on the shared interface so leaves must stub them out.",
      "Missing that operations recurse implicitly through the tree.",
    ] },
    prerequisites: ["lld_m1_t1"], estimatedMinutes: 35, difficulty: 0.5, xpReward: 50, visualizer: null,
  },
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m3_t3", topicNumber: 3,
    name: "Proxy Pattern", slug: "proxy-pattern",
    metadata: { estimated_minutes: 35, difficulty: 3, prerequisites: ["lld_m1_t8"], tags: ["structural", "proxy", "lazy", "access-control"] },
    hook: {
      question: "A high-res image takes 2s to load, but a document with 100 images should open instantly and load each image only when scrolled into view. How — without changing the image's interface?",
      insight: "A Proxy implements the same interface as the real object and controls access to it — creating it lazily (virtual proxy), checking permissions (protection proxy), or caching results. Callers can't tell the proxy from the real thing.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Proxy provides a surrogate or placeholder for another object to control access to it. The proxy implements the same interface as the real subject and holds (or lazily creates) a reference to it, intercepting calls to add behaviour like lazy initialization, access checks, or caching." },
      { kind: "code", heading: "Virtual (lazy) proxy (Java)",
        body: "interface Image { void display(); }\nclass RealImage implements Image {\n    RealImage(String f){ /* expensive load */ }\n    public void display(){ /* ... */ }\n}\nclass ImageProxy implements Image {\n    private final String file; private RealImage real;\n    ImageProxy(String f){ this.file = f; }      // cheap — no load yet\n    public void display() {\n        if (real == null) real = new RealImage(file); // load on first use\n        real.display();\n    }\n}" },
      { kind: "concept", heading: "Proxy flavours",
        body: "Virtual proxy: defers expensive creation until first use (lazy loading). Protection proxy: checks access rights before delegating. Remote proxy: stands in for an object in another address space (RPC stubs). Caching/smart proxy: memoizes results or adds reference counting. All share the same-interface, control-access idea." },
      { kind: "concept", heading: "Proxy vs Decorator vs Adapter",
        body: "All wrap an object. Proxy keeps the same interface and CONTROLS access (often deciding WHEN to delegate). Decorator keeps the same interface and ADDS behaviour (always delegates plus extra). Adapter CHANGES the interface. The intent differs: control vs enhance vs convert." },
    ] },
    interviewRelevance: "Proxy underlies lazy loading (Hibernate), Spring AOP, RPC stubs, and access control. The discriminating question is Proxy vs Decorator — control access vs add behaviour.",
    commonGaps: { gaps: [
      "Confusing Proxy (controls access) with Decorator (adds behaviour).",
      "Loading the real object eagerly in the proxy constructor, defeating the lazy benefit.",
      "Not realising frameworks (Hibernate, Spring) generate proxies for you.",
    ] },
    prerequisites: ["lld_m1_t8"], estimatedMinutes: 35, difficulty: 0.5, xpReward: 50, visualizer: null,
  },
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m3_t4", topicNumber: 4,
    name: "Bridge Pattern", slug: "bridge-pattern",
    metadata: { estimated_minutes: 35, difficulty: 4, prerequisites: ["lld_m1_t1", "lld_m1_t4"], tags: ["structural", "bridge", "abstraction-implementation"] },
    hook: {
      question: "You have Shapes (Circle, Square) and Colors (Red, Blue). Subclassing every combo gives RedCircle, BlueCircle, RedSquare… 2×2=4, and it explodes as you add either axis. What decouples the two axes?",
      insight: "Bridge splits an abstraction from its implementation so the two can vary independently. Shape HOLDS a Color (composition) instead of subclassing it. Adding a color or a shape is now additive, not multiplicative.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Bridge decouples an abstraction from its implementation so that the two can vary independently. Instead of a single inheritance hierarchy that mixes two dimensions, you create two hierarchies — the abstraction (Shape) and the implementor (Color) — and connect them with a reference (the 'bridge')." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Color { String fill(); }                 // implementor hierarchy\nclass Red implements Color { public String fill(){ return \"red\"; } }\n\nabstract class Shape {                              // abstraction hierarchy\n    protected final Color color;                    // the bridge (composition)\n    Shape(Color c){ this.color = c; }\n    abstract String draw();\n}\nclass Circle extends Shape {\n    Circle(Color c){ super(c); }\n    String draw(){ return \"circle in \" + color.fill(); }\n}\n// new Circle(new Red()) — combine freely; m shapes + n colors, not m*n classes" },
      { kind: "concept", heading: "Why composition beats the Cartesian explosion",
        body: "With inheritance, m shapes × n colors = m*n subclasses, and adding either axis multiplies the count. With Bridge, you have m + n classes and combine them at runtime. The abstraction and implementation evolve on separate axes without touching each other." },
      { kind: "concept", heading: "Bridge vs Strategy vs Adapter",
        body: "Bridge is designed UP FRONT to let two dimensions vary independently (structural, two hierarchies). Strategy swaps one algorithm behind an interface (behavioural, usually one dimension). Adapter retrofits an incompatible interface AFTER the fact. Bridge and Strategy look similar in code; the difference is intent and the presence of two evolving hierarchies." },
    ] },
    interviewRelevance: "Bridge answers 'how do you avoid a subclass explosion across two independent dimensions?' It appears with cross-platform rendering, device drivers, and message-channel × message-type matrices.",
    commonGaps: { gaps: [
      "Subclassing both dimensions (Cartesian explosion) instead of bridging with composition.",
      "Confusing Bridge with Strategy — Bridge is two evolving hierarchies designed up front.",
      "Thinking Bridge is the same as Adapter — Adapter is a retrofit, Bridge is intentional.",
    ] },
    prerequisites: ["lld_m1_t1", "lld_m1_t4"], estimatedMinutes: 35, difficulty: 0.6, xpReward: 50, visualizer: null,
  },
  {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: "lld_m3_t5", topicNumber: 5,
    name: "Flyweight Pattern", slug: "flyweight-pattern",
    metadata: { estimated_minutes: 30, difficulty: 3, prerequisites: ["lld_m1_t7"], tags: ["structural", "flyweight", "memory", "sharing"] },
    hook: {
      question: "A text editor has a million Character objects, each storing its font, size, and bold flag. Memory blows up. Most characters share the same formatting — how do you exploit that?",
      insight: "Flyweight minimizes memory by SHARING the parts of state that are common (intrinsic) across many objects, and passing the rest (extrinsic) in from outside. One shared 'Arial-12-bold' object serves every character with that style.",
    },
    teaching: { blocks: [
      { kind: "concept", heading: "Intent",
        body: "Flyweight uses sharing to support large numbers of fine-grained objects efficiently. It splits object state into intrinsic state (shared, context-independent — stored in the flyweight) and extrinsic state (context-dependent — passed in by the client at call time)." },
      { kind: "concept", heading: "Intrinsic vs extrinsic state",
        body: "Intrinsic state is invariant and shareable: a tree's texture/mesh, a character's font. Extrinsic state varies per instance: a tree's (x,y) position, a character's index in the document. The flyweight stores only intrinsic state; the client supplies extrinsic state on each method call so the same flyweight can serve many contexts." },
      { kind: "code", heading: "Flyweight factory (Java)",
        body: "class TreeType { final String name; TreeType(String n){ name=n; } }   // intrinsic, shared\nclass TreeFactory {\n    private static final Map<String,TreeType> cache = new HashMap<>();\n    static TreeType of(String name) {\n        return cache.computeIfAbsent(name, TreeType::new);  // reuse if seen\n    }\n}\n// 1,000,000 trees, but only a handful of TreeType instances — (x,y) is extrinsic." },
      { kind: "concept", heading: "When it's worth it",
        body: "Flyweight pays off only when you have a huge number of objects AND much of their state is shareable. The factory hands out cached shared instances (often by ==-identity). It complicates the code, so reserve it for genuine memory pressure — particle systems, map tiles, glyphs, game entities." },
    ] },
    interviewRelevance: "Flyweight comes up for memory-constrained, high-cardinality object scenarios (text rendering, game maps, particle systems). The signal is correctly splitting intrinsic (shared) from extrinsic (per-instance) state.",
    commonGaps: { gaps: [
      "Storing extrinsic (per-instance) state inside the flyweight, defeating sharing.",
      "Applying Flyweight without real memory pressure — needless complexity.",
      "Forgetting the factory must return cached shared instances, not new ones each call.",
    ] },
    prerequisites: ["lld_m1_t7"], estimatedMinutes: 30, difficulty: 0.5, xpReward: 50, visualizer: null,
  },
];

const EXERCISES = [
  // ── T1 Facade ──
  pm({ topicId: "lld_m3_t1", exerciseId: "lld_m3_t1_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "`OrderFacade.placeOrder(cart)` internally calls InventoryService, PaymentService, ShippingService and NotificationService so callers don't have to. Which pattern?",
    options: ["Facade", "Adapter", "Proxy", "Composite"], correct: "Facade",
    explanation: "A single simplified entry point that orchestrates a complex multi-class subsystem is the Facade pattern." }),
  predict({ topicId: "lld_m3_t1", exerciseId: "lld_m3_t1_ex_1", position: 2, level: "easy",
    title: "Facade orchestrates the subsystem",
    scenario: "What does this program print (one line per subsystem call)?",
    starterCode: `public class Main {
    static class Amp { void on(){ System.out.println("amp on"); } }
    static class Proj { void on(){ System.out.println("projector on"); } }
    static class Facade {
        private final Amp amp = new Amp(); private final Proj proj = new Proj();
        void watchMovie(){ amp.on(); proj.on(); }
    }
    public static void main(String[] args) {
        new Facade().watchMovie();
    }
}`,
    expected: "amp on\nprojector on",
    explanation: "watchMovie() is a one-call facade that delegates to the subsystem in order: amp.on() then proj.on().",
    hints: ["The facade calls the parts in the order written."] }),
  pm({ topicId: "lld_m3_t1", exerciseId: "lld_m3_t1_pm_2", position: 3, level: "medium",
    title: "Facade or Adapter?",
    scenario: "You need to give callers ONE simple method over a tangle of 5 subsystem classes (you're not matching any pre-existing interface, just simplifying). Which pattern?",
    options: ["Facade", "Adapter", "Decorator", "Bridge"], correct: "Facade",
    explanation: "Simplifying access to many subsystem classes is Facade. Adapter would be for converting to a specific expected interface (1:1 compatibility)." }),

  // ── T2 Composite ──
  pm({ topicId: "lld_m3_t2", exerciseId: "lld_m3_t2_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "Both File and Directory implement a Node interface with size(); a Directory's size() sums its children (which may be Files or Directories). Clients call size() without caring which. Which pattern?",
    options: ["Composite", "Decorator", "Proxy", "Bridge"], correct: "Composite",
    explanation: "Treating leaves and containers uniformly through one interface in a part-whole tree is the Composite pattern." }),
  predict({ topicId: "lld_m3_t2", exerciseId: "lld_m3_t2_ex_1", position: 2, level: "medium",
    title: "Recursive size of a tree",
    scenario: "What does this program print?",
    starterCode: `import java.util.*;
public class Main {
    interface Node { int size(); }
    static class File implements Node { final int s; File(int s){ this.s=s; } public int size(){ return s; } }
    static class Dir implements Node {
        final List<Node> kids = new ArrayList<>();
        Dir add(Node n){ kids.add(n); return this; }
        public int size(){ int t=0; for (Node k : kids) t += k.size(); return t; }
    }
    public static void main(String[] args) {
        Dir root = new Dir().add(new File(10)).add(new Dir().add(new File(5)).add(new File(15)));
        System.out.println(root.size());
    }
}`,
    expected: "30",
    explanation: "root holds File(10) and a sub-Dir holding File(5)+File(15). size() recurses: 10 + (5 + 15) = 30.",
    hints: ["Sum the leaves: 10 + 5 + 15."] }),
  code({ topicId: "lld_m3_t2", exerciseId: "lld_m3_t2_ex_2", position: 3, level: "medium",
    title: "Implement Composite count()",
    scenario: "Build a Node interface with `int count()` returning the number of FILES (leaves) under a node. File returns 1; Dir returns the sum over its children. Print the file count of a Dir containing a File and a Dir-with-two-Files.",
    instructions: "Write a complete Java program (public class Main) printing a single integer (expected: 3).",
    starterCode: `import java.util.*;
public class Main {
    interface Node { int count(); }
    static class File implements Node { /* TODO */ }
    static class Dir implements Node {
        final List<Node> kids = new ArrayList<>();
        Dir add(Node n){ kids.add(n); return this; }
        /* TODO: count() sums children */
    }
    public static void main(String[] args) {
        Dir root = new Dir().add(new File()).add(new Dir().add(new File()).add(new File()));
        System.out.println(root.count());
    }
}`,
    expectedSolution: `import java.util.*;
public class Main {
    interface Node { int count(); }
    static class File implements Node { public int count(){ return 1; } }
    static class Dir implements Node {
        final List<Node> kids = new ArrayList<>();
        Dir add(Node n){ kids.add(n); return this; }
        public int count(){ int t=0; for (Node k : kids) t += k.count(); return t; }
    }
    public static void main(String[] args) {
        Dir root = new Dir().add(new File()).add(new Dir().add(new File()).add(new File()));
        System.out.println(root.count());
    }
}`,
    expectedStdout: "3",
    hints: ["File.count() returns 1.", "Dir.count() sums count() over its children — recursion handles nesting."] }),

  // ── T3 Proxy ──
  pm({ topicId: "lld_m3_t3", exerciseId: "lld_m3_t3_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "ImageProxy implements the Image interface and only constructs the heavy RealImage the first time display() is called. Same interface, controlled (deferred) access. Which pattern?",
    options: ["Proxy", "Decorator", "Adapter", "Facade"], correct: "Proxy",
    explanation: "Same interface, controlling access (here lazy creation) to the real object is the Proxy pattern (a virtual proxy)." }),
  predict({ topicId: "lld_m3_t3", exerciseId: "lld_m3_t3_ex_1", position: 2, level: "medium",
    title: "Lazy proxy loads once",
    scenario: "What does this program print (in order)?",
    starterCode: `public class Main {
    interface Image { void show(); }
    static class RealImage implements Image {
        RealImage(){ System.out.println("loading"); }
        public void show(){ System.out.println("show"); }
    }
    static class Proxy implements Image {
        private RealImage real;
        public void show(){ if (real == null) real = new RealImage(); real.show(); }
    }
    public static void main(String[] args) {
        Image img = new Proxy();
        img.show();
        img.show();
    }
}`,
    expected: "loading\nshow\nshow",
    explanation: "First show() creates the RealImage (prints 'loading') then shows. Second show() reuses the cached real object — no second 'loading'. So: loading, show, show.",
    hints: ["The constructor (loading) runs only on the first show()."] }),
  pm({ topicId: "lld_m3_t3", exerciseId: "lld_m3_t3_pm_2", position: 3, level: "medium",
    title: "Proxy or Decorator?",
    scenario: "A wrapper implements the same interface as the target and decides WHETHER/WHEN to forward calls (e.g. checking permissions, or loading lazily) — it does not add new visible behaviour. Which pattern?",
    options: ["Proxy", "Decorator", "Bridge", "Composite"], correct: "Proxy",
    explanation: "Controlling access (when/whether to delegate) with the same interface is Proxy. Decorator always delegates and ADDS behaviour." }),

  // ── T4 Bridge ──
  pm({ topicId: "lld_m3_t4", exerciseId: "lld_m3_t4_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "Instead of RedCircle/BlueCircle/RedSquare/BlueSquare subclasses, Shape HOLDS a Color and there are separate Shape and Color hierarchies that vary independently. Which pattern?",
    options: ["Bridge", "Strategy", "Adapter", "Decorator"], correct: "Bridge",
    explanation: "Splitting abstraction (Shape) from implementation (Color) into two hierarchies joined by composition, so each varies independently, is the Bridge pattern." }),
  predict({ topicId: "lld_m3_t4", exerciseId: "lld_m3_t4_ex_1", position: 2, level: "medium",
    title: "Combine the two hierarchies",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    interface Color { String fill(); }
    static class Red implements Color { public String fill(){ return "red"; } }
    static abstract class Shape {
        protected final Color color; Shape(Color c){ color = c; }
        abstract String draw();
    }
    static class Circle extends Shape {
        Circle(Color c){ super(c); }
        String draw(){ return "circle in " + color.fill(); }
    }
    public static void main(String[] args) {
        System.out.println(new Circle(new Red()).draw());
    }
}`,
    expected: "circle in red",
    explanation: "Circle (abstraction) holds a Red (implementation) via the bridge. draw() delegates the color part to color.fill() → \"circle in red\". New colors/shapes combine without new subclasses.",
    hints: ["draw() calls color.fill() on the injected Color."] }),
  pm({ topicId: "lld_m3_t4", exerciseId: "lld_m3_t4_pm_2", position: 3, level: "hard",
    title: "Why Bridge over subclassing?",
    scenario: "You have 4 shapes and 5 rendering APIs (OpenGL, DirectX, Vulkan, Metal, SVG), and both axes will keep growing. Pure subclassing needs how many classes, and what does Bridge give instead?",
    options: ["20 with subclassing vs 4+5=9 with Bridge", "9 with subclassing vs 20 with Bridge", "20 either way", "4 with subclassing vs 5 with Bridge"],
    correct: "20 with subclassing vs 4+5=9 with Bridge",
    explanation: "Subclassing every combination is 4×5=20 classes (and multiplies as either axis grows). Bridge keeps the axes separate: 4 shapes + 5 renderers = 9 classes, combined at runtime." }),

  // ── T5 Flyweight ──
  pm({ topicId: "lld_m3_t5", exerciseId: "lld_m3_t5_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "A forest renders 1,000,000 trees, but a factory hands out a handful of shared TreeType objects (mesh + texture); each tree stores only its own (x, y). Which pattern saves the memory?",
    options: ["Flyweight", "Prototype", "Composite", "Proxy"], correct: "Flyweight",
    explanation: "Sharing intrinsic state (TreeType) across many objects while keeping extrinsic state (position) outside is the Flyweight pattern." }),
  predict({ topicId: "lld_m3_t5", exerciseId: "lld_m3_t5_ex_1", position: 2, level: "medium",
    title: "Flyweight factory shares instances",
    scenario: "What does this program print?",
    starterCode: `import java.util.*;
public class Main {
    static class TreeType { final String name; TreeType(String n){ name=n; } }
    static class Factory {
        static final Map<String,TreeType> cache = new HashMap<>();
        static TreeType of(String n){ return cache.computeIfAbsent(n, TreeType::new); }
    }
    public static void main(String[] args) {
        TreeType a = Factory.of("oak");
        TreeType b = Factory.of("oak");
        System.out.println(a == b);
    }
}`,
    expected: "true",
    explanation: "computeIfAbsent returns the SAME cached TreeType for \"oak\" on the second call, so a and b are the identical shared instance → == is true. That sharing is the memory win.",
    hints: ["The factory caches by name and reuses the instance."] }),
  pm({ topicId: "lld_m3_t5", exerciseId: "lld_m3_t5_pm_2", position: 3, level: "medium",
    title: "Intrinsic vs extrinsic",
    scenario: "In a text editor flyweight where a Glyph shares font/size/bold across many characters, which piece of state is EXTRINSIC (must be passed in per call, not stored in the shared flyweight)?",
    options: ["The character's position/index in the document", "The font family", "The font size", "The bold flag"],
    correct: "The character's position/index in the document",
    explanation: "Position varies per occurrence, so it's extrinsic and supplied by the client. Font/size/bold are intrinsic (shared) and stored in the flyweight." }),
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
  console.log(`\nDone — M3 Structural Patterns seeded.`);
  console.log(`  Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
