/**
 * Seed — LLD module M4: Behavioral Patterns (Command, State, Template Method,
 * Chain of Responsibility, Iterator, Mediator, Memento, Visitor). Extends
 * pro_lld (Strategy + Observer already live in M1).
 *
 * Idempotent upsert-by-id; recomputes track totals. Test-case types follow the
 * proven grading convention. Java stays JDK-13-safe.
 *
 * Usage:  node config/seedLldBehavioral.js   ·   npm: npm run seed:lld-behavioral
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m4";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 4,
  name: "Behavioral Patterns", slug: "behavioral-patterns",
  description: "How objects communicate and divide responsibility: Command, State, Template Method, Chain of Responsibility, Iterator, Mediator, Memento, and Visitor. (Strategy & Observer live in M1.)",
  estimatedHours: 7, prerequisites: ["lld_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, prereq, diff) => ({
  trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
  metadata: { estimated_minutes: 35, difficulty: 3, prerequisites: prereq, tags },
  hook: { question: hookQ, insight: hookI },
  teaching: { blocks },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: prereq, estimatedMinutes: 35, difficulty: diff, xpReward: 50, visualizer: null,
});

const TOPICS = [
  T("lld_m4_t1", 1, "Command Pattern", "command-pattern",
    ["behavioral", "command", "undo", "queue"],
    "You want a 'redo/undo' stack, a job queue, and macro buttons — all over the same set of actions. What turns an action into a first-class object you can store, queue, and reverse?",
    "Command encapsulates a request as an object, letting you parameterize clients with different requests, queue or log them, and support undo. The action, its receiver, and its arguments become one storable thing.",
    [
      { kind: "concept", heading: "Intent",
        body: "Command turns a request into a standalone object containing everything needed to perform it later: the receiver, the method, and the arguments. This decouples the object that INVOKES the operation from the one that knows how to PERFORM it." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Command { void execute(); }\nclass Light { void on(){ /* ... */ } }\nclass LightOnCommand implements Command {\n    private final Light light;\n    LightOnCommand(Light l){ this.light = l; }\n    public void execute(){ light.on(); }   // bound receiver + action\n}\nclass RemoteButton {                        // the Invoker — knows nothing of Light\n    private Command command;\n    void set(Command c){ this.command = c; }\n    void press(){ command.execute(); }\n}" },
      { kind: "concept", heading: "Undo, queues, and macros",
        body: "Add an undo() to the interface and each command remembers the state needed to reverse itself — push executed commands on a stack to get multi-level undo. Because commands are objects, you can queue them (job/task queues), log them (replay/audit), or compose them (a MacroCommand that runs a list)." },
      { kind: "concept", heading: "Command vs Strategy",
        body: "Both wrap behaviour in an object, but Command represents a WHOLE request (receiver + action + args) intended to be invoked, queued, or undone; Strategy represents an interchangeable ALGORITHM a context uses to do its job. Command is about 'do this thing later/again/undo it'; Strategy is about 'how to do this part'." },
    ],
    "Command underlies undo/redo, task queues, transactional jobs, and GUI actions. Interviewers probe undo support and the invoker/receiver decoupling.",
    ["Coupling the invoker to the receiver instead of going through the Command interface.",
     "Forgetting that undo requires the command to capture the pre-state.",
     "Confusing Command (a request object) with Strategy (an algorithm)."],
    ["lld_m1_t1"], 0.5),

  T("lld_m4_t2", 2, "State Pattern", "state-pattern",
    ["behavioral", "state", "state-machine", "transition"],
    "A vending machine behaves completely differently when it's idle, has-money, or sold-out — and a giant switch on a status enum is becoming unmaintainable. What models the modes cleanly?",
    "State lets an object alter its behaviour when its internal state changes — it appears to change class. Each state becomes its own object with its own behaviour and transition rules, replacing sprawling conditionals.",
    [
      { kind: "concept", heading: "Intent",
        body: "State allows an object (the context) to change its behaviour when its internal state changes. Each concrete state is a class implementing a common State interface; the context delegates to its current state object, and states decide the next state — so the object behaves as if it changed class." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface State { State next(); String name(); }\nclass Idle implements State { public State next(){ return new HasMoney(); } public String name(){ return \"Idle\"; } }\nclass HasMoney implements State { public State next(){ return new Dispensing(); } public String name(){ return \"HasMoney\"; } }\nclass Machine {\n    private State state = new Idle();\n    void advance(){ state = state.next(); }   // state decides the transition\n    String status(){ return state.name(); }\n}" },
      { kind: "concept", heading: "Why it beats a switch",
        body: "A status-enum switch scatters each state's behaviour across every method and grows error-prone as states multiply. With State, each state's behaviour AND its legal transitions live in one class (SRP), and adding a state is adding a class (OCP). Illegal transitions are simply not implemented." },
      { kind: "concept", heading: "State vs Strategy",
        body: "Structurally identical (a context delegating to an interface), but the intent differs: in State the objects KNOW about each other and decide the next state (transitions are part of the pattern); in Strategy the client picks an independent algorithm and the strategies don't transition between themselves." },
    ],
    "State is the clean answer to 'replace this status-enum switch' and models any finite state machine (orders, connections, game phases). The State-vs-Strategy distinction is a classic follow-up.",
    ["Using a giant enum switch instead of state objects.",
     "Putting transition logic in the context rather than in the states.",
     "Confusing State (objects transition among themselves) with Strategy (client picks)."],
    ["lld_m1_t4"], 0.5),

  T("lld_m4_t3", 3, "Template Method Pattern", "template-method-pattern",
    ["behavioral", "template-method", "hook", "inheritance"],
    "Three data importers share the exact same steps — open, parse, validate, close — but each parses differently. How do you fix the ALGORITHM'S SHAPE once while letting steps vary?",
    "Template Method defines the skeleton of an algorithm in a base method, deferring some steps to subclasses. The overall sequence is fixed in one place; subclasses fill in the variable steps without changing the structure.",
    [
      { kind: "concept", heading: "Intent",
        body: "Template Method defines the skeleton of an algorithm in a (usually final) method, calling primitive operations that subclasses override. Subclasses redefine certain steps without changing the algorithm's structure — the invariant sequence lives in the base class." },
      { kind: "code", heading: "Structure (Java)",
        body: "abstract class DataImporter {\n    public final void run() {       // the template method — fixed sequence\n        open();\n        parse();                    // varies per subclass\n        close();\n    }\n    private void open(){ /* shared */ }\n    private void close(){ /* shared */ }\n    protected abstract void parse(); // the step subclasses fill in\n}\nclass CsvImporter extends DataImporter { protected void parse(){ /* CSV */ } }" },
      { kind: "concept", heading: "Hook methods",
        body: "Beyond abstract steps, a template can call 'hook' methods with a default (often empty) implementation that subclasses MAY override to influence the algorithm (e.g. a boolean shouldCache() defaulting to true). Hooks give optional extension points without forcing every subclass to implement them." },
      { kind: "concept", heading: "Template Method vs Strategy",
        body: "Template Method varies steps via INHERITANCE (subclasses override; the skeleton is fixed at compile time). Strategy varies the WHOLE algorithm via COMPOSITION (swap an object at runtime). 'Hollywood Principle' applies to Template Method: don't call us (the base), we'll call you (your overridden steps)." },
    ],
    "Template Method shows up in frameworks (JUnit's setUp/test/tearDown, servlet lifecycle, sorting comparators). Interviewers contrast its inheritance-based reuse with Strategy's composition.",
    ["Making the template method overridable, so subclasses break the fixed sequence.",
     "Exposing too many abstract steps, making subclasses fragile.",
     "Confusing it with Strategy (composition/runtime) — Template Method is inheritance/compile-time."],
    ["lld_m1_t1"], 0.4),

  T("lld_m4_t4", 4, "Chain of Responsibility", "chain-of-responsibility",
    ["behavioral", "chain-of-responsibility", "handler", "middleware"],
    "An HTTP request must pass through auth, rate-limiting, logging, then the handler — and you want to add/reorder steps without touching the others. What pattern is your middleware?",
    "Chain of Responsibility passes a request along a chain of handlers; each either handles it or forwards it to the next. Senders are decoupled from receivers, and the chain is composed at runtime.",
    [
      { kind: "concept", heading: "Intent",
        body: "Chain of Responsibility avoids coupling the sender of a request to its receiver by giving multiple objects a chance to handle it. Handlers are linked in a chain; each decides to handle the request and/or pass it to the next handler." },
      { kind: "code", heading: "Structure (Java)",
        body: "abstract class Handler {\n    protected Handler next;\n    Handler setNext(Handler n){ this.next = n; return n; }\n    void handle(Request r) {\n        if (canHandle(r)) process(r);\n        else if (next != null) next.handle(r); // forward\n    }\n    abstract boolean canHandle(Request r);\n    abstract void process(Request r);\n}" },
      { kind: "concept", heading: "Handle, forward, or both",
        body: "A handler can fully handle and stop the chain, partially process then forward (middleware style — auth then logging then the controller), or simply pass through if it doesn't apply. The order of the chain is a runtime composition decision, so reordering or inserting steps doesn't touch existing handlers (OCP)." },
      { kind: "concept", heading: "Where it appears",
        body: "Servlet filters, Express/Koa middleware, logging level chains, event bubbling in UIs, and approval workflows (expense < $100 → manager; else → director). The trade-off: a request might fall off the end unhandled, so include a default/terminal handler." },
    ],
    "Chain of Responsibility is the model behind web middleware, servlet filters, and approval workflows. The signal is recognising 'each step decides to handle or forward' and composing the chain at runtime.",
    ["Forgetting a terminal/default handler, so requests fall off the chain unhandled.",
     "Hard-wiring the chain order instead of composing it at runtime.",
     "Each handler knowing about a specific next concrete handler instead of the abstract next."],
    ["lld_m1_t1"], 0.5),

  T("lld_m4_t5", 5, "Iterator Pattern", "iterator-pattern",
    ["behavioral", "iterator", "traversal", "encapsulation"],
    "You want callers to walk every element of your custom tree/graph collection WITHOUT learning its internal structure or exposing its nodes. What gives them a uniform cursor?",
    "Iterator provides a way to access the elements of an aggregate sequentially without exposing its underlying representation. The collection hands out a cursor object with hasNext()/next(); the structure stays hidden.",
    [
      { kind: "concept", heading: "Intent",
        body: "Iterator provides sequential access to the elements of a collection without exposing its internal representation. The aggregate exposes a method to obtain an Iterator; the iterator holds the traversal state (position), so multiple independent traversals can coexist." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Iterator<T> { boolean hasNext(); T next(); }\ninterface Aggregate<T> { Iterator<T> iterator(); }\n// Java builds this in: Iterable<T>/Iterator<T> power the for-each loop.\nfor (String s : myCollection) { /* uses myCollection.iterator() under the hood */ }" },
      { kind: "concept", heading: "Why externalize traversal",
        body: "Putting traversal in a separate iterator object keeps the collection focused on storage (SRP), lets you offer multiple traversal orders (in-order, BFS, DFS) as different iterators over the same structure, and lets clients pause/resume or run several traversals at once. The internal layout (array, linked nodes, tree) stays encapsulated." },
      { kind: "concept", heading: "Java's built-in support",
        body: "Implement Iterable<T> (one method, iterator()) and your type works in a for-each loop. The iterator's remove() can support safe deletion mid-traversal — the absence of which causes ConcurrentModificationException when you mutate during a plain for-each (see M1 Observer pitfalls)." },
    ],
    "Iterator is mostly used VIA the language (Iterable/for-each), but interviewers ask you to implement one for a custom structure (e.g. a zigzag tree iterator) to test that you separate traversal state from storage.",
    ["Exposing the collection's internal nodes instead of an opaque cursor.",
     "Storing traversal state in the collection, preventing concurrent traversals.",
     "Not implementing Iterable, so the type can't be used in a for-each."],
    ["lld_m1_t1"], 0.4),

  T("lld_m4_t6", 6, "Mediator Pattern", "mediator-pattern",
    ["behavioral", "mediator", "coupling", "hub"],
    "Ten UI widgets each react to the others' changes; they reference each other directly and the dependency graph is a hairball. What centralizes the coordination?",
    "Mediator defines an object that encapsulates how a set of objects interact, so they no longer refer to each other directly. Colleagues talk to the mediator (a hub); the many-to-many web becomes a clean hub-and-spoke.",
    [
      { kind: "concept", heading: "Intent",
        body: "Mediator promotes loose coupling by keeping objects from referring to each other explicitly. Instead of N objects each knowing the others (N² links), each colleague knows only the mediator, which orchestrates their interactions — turning a mesh into a hub-and-spoke." },
      { kind: "code", heading: "Structure (Java)",
        body: "interface Mediator { void notify(Component sender, String event); }\nabstract class Component { protected Mediator mediator; Component(Mediator m){ mediator = m; } }\nclass DialogMediator implements Mediator {\n    Button ok; Checkbox terms;\n    public void notify(Component sender, String event){\n        if (sender == terms && event.equals(\"toggled\")) ok.setEnabled(terms.checked());\n    }\n}\n// terms.toggle() → mediator.notify(this, \"toggled\") → mediator updates ok" },
      { kind: "concept", heading: "Mediator vs Observer",
        body: "Both reduce direct coupling. Observer is a one-to-many broadcast where the subject doesn't know what observers do. Mediator is a hub that holds the INTERACTION LOGIC between specific colleagues ('when terms toggles, enable OK'). Mediator centralizes rules; Observer just notifies. They're often combined." },
      { kind: "concept", heading: "Trade-off",
        body: "The mediator removes coupling between colleagues but can itself become a complex god-object if it accumulates all interaction logic. Keep mediators focused (e.g. one per dialog/screen); if a mediator grows unwieldy, the screen probably needs splitting." },
    ],
    "Mediator appears in UI dialog coordination, chat-room servers (users talk via the room, not directly), and air-traffic-control analogies. The Mediator-vs-Observer contrast is the common probe.",
    ["Letting the mediator become a god-object holding all logic.",
     "Confusing Mediator (centralizes interaction rules) with Observer (broadcasts change).",
     "Colleagues still referencing each other directly, bypassing the mediator."],
    ["lld_m1_t5"], 0.5),

  T("lld_m4_t7", 7, "Memento Pattern", "memento-pattern",
    ["behavioral", "memento", "undo", "snapshot"],
    "You need undo for a text editor, but you don't want the editor's private cursor/selection internals leaking out just to save and restore them. How do you snapshot state without breaking encapsulation?",
    "Memento captures and externalizes an object's internal state so it can be restored later — without violating encapsulation. The originator creates an opaque memento; a caretaker stores it and hands it back to restore, never peeking inside.",
    [
      { kind: "concept", heading: "Intent",
        body: "Memento captures an object's internal state in a separate 'memento' object so it can be restored later, without exposing the object's internals. Three roles: Originator (creates/restores from mementos), Memento (the opaque snapshot), Caretaker (stores mementos, e.g. an undo stack)." },
      { kind: "code", heading: "Structure (Java)",
        body: "class Editor {                              // Originator\n    private String text = \"\";\n    void type(String s){ text += s; }\n    Memento save(){ return new Memento(text); }\n    void restore(Memento m){ this.text = m.state; }\n    static class Memento { private final String state; Memento(String s){ state = s; } } // opaque\n}\n// Caretaker keeps a Deque<Memento> as the undo stack." },
      { kind: "concept", heading: "Encapsulation is the point",
        body: "The memento exposes its captured state only to the originator (often via a private nested class or a narrow interface). The caretaker holds mementos but cannot read or modify them — it just stores and returns. This is what separates Memento from 'just copy the fields out', which would leak internals." },
      { kind: "concept", heading: "Memento vs Command-undo",
        body: "Command-based undo reverses an action by knowing how to invert it (delete ↔ insert). Memento-based undo restores a whole prior SNAPSHOT. Snapshots are simpler to reason about but cost memory for large state; inverse-commands are lean but require every command to be reversible. Real editors often combine them." },
    ],
    "Memento is the standard undo/snapshot answer (editors, game save-states, transactions). Interviewers check that the caretaker can't see inside the memento — the encapsulation guarantee.",
    ["Exposing the memento's fields publicly, letting the caretaker mutate saved state.",
     "Snapshotting huge state on every keystroke (memory blow-up) instead of batching/diffing.",
     "Confusing Memento (restore a snapshot) with Command undo (invert an action)."],
    ["lld_m1_t1"], 0.5),

  T("lld_m4_t8", 8, "Visitor Pattern", "visitor-pattern",
    ["behavioral", "visitor", "double-dispatch", "open-closed"],
    "You have a stable tree of node types (Circle, Square, Group) and keep needing NEW operations over them — area, export-SVG, bounding-box — without editing every node class each time. What pattern adds operations from outside?",
    "Visitor lets you define a new operation over an object structure without changing the classes of the elements. Operations live in visitor objects; each element accepts a visitor and dispatches to the right visit method (double dispatch).",
    [
      { kind: "concept", heading: "Intent",
        body: "Visitor represents an operation to be performed on the elements of an object structure, letting you define a new operation without changing the element classes. Each element has accept(visitor); the visitor has a visitX method per element type. Adding an operation = adding one visitor, touching no element class." },
      { kind: "code", heading: "Structure + double dispatch (Java)",
        body: "interface Visitor { void visitCircle(Circle c); void visitSquare(Square s); }\ninterface Shape { void accept(Visitor v); }\nclass Circle implements Shape { public void accept(Visitor v){ v.visitCircle(this); } } // dispatch 2\nclass Square implements Shape { public void accept(Visitor v){ v.visitSquare(this); } }\n// dispatch 1 = which element's accept(); dispatch 2 = which visitX method.\nclass AreaVisitor implements Visitor { /* visitCircle, visitSquare compute area */ }" },
      { kind: "concept", heading: "Double dispatch",
        body: "Java picks a method by the static type of arguments and the dynamic type of the receiver. Visitor combines two virtual calls — shape.accept(visitor) selects the element type, then visitor.visitCircle(this) selects the operation — achieving dispatch on BOTH the element and the operation, which a single method call can't do." },
      { kind: "concept", heading: "The trade-off (and when NOT to use it)",
        body: "Visitor makes adding OPERATIONS easy (new visitor) but adding ELEMENT TYPES hard (every visitor must add a visit method). It's the inverse trade-off of the usual class hierarchy. Use it when the element set is STABLE but operations grow (compilers/AST processing); avoid it when element types change often." },
    ],
    "Visitor is a senior-level pattern for AST/compiler work and stable object structures with growing operations. Interviewers test the double-dispatch mechanism and the operations-vs-types trade-off.",
    ["Using Visitor when element types change often — every new type breaks every visitor.",
     "Not understanding double dispatch (why accept() then visitX() is needed).",
     "Putting operation logic in the elements, defeating the pattern's purpose."],
    ["lld_m1_t1"], 0.6),
];

const EXERCISES = [
  // T1 Command
  pm({ topicId: "lld_m4_t1", exerciseId: "lld_m4_t1_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "Each user action becomes an object with execute() and undo(); an invoker stores them on a stack so the app supports multi-level undo. Which pattern?",
    options: ["Command", "Strategy", "Observer", "State"], correct: "Command",
    explanation: "Encapsulating a request (receiver + action + undo) as a storable object is the Command pattern." }),
  code({ topicId: "lld_m4_t1", exerciseId: "lld_m4_t1_ex_1", position: 2, level: "medium",
    title: "Wire an invoker + command",
    scenario: "A Light has on(). Make an interface Command{execute()}, a LightOnCommand bound to a Light, and a Remote that stores a Command and press() runs it. Wire a remote to turn the light on; on() must print \"ON\".",
    instructions: "Write a complete Java program (public class Main) printing exactly: ON",
    starterCode: `public class Main {
    static class Light { void on(){ System.out.println("ON"); } }
    interface Command { void execute(); }
    // TODO: LightOnCommand, Remote
    public static void main(String[] args) {
        // TODO: wire a Remote to a LightOnCommand and press it
    }
}`,
    expectedSolution: `public class Main {
    static class Light { void on(){ System.out.println("ON"); } }
    interface Command { void execute(); }
    static class LightOnCommand implements Command {
        private final Light light; LightOnCommand(Light l){ light = l; }
        public void execute(){ light.on(); }
    }
    static class Remote {
        private Command slot;
        void set(Command c){ slot = c; }
        void press(){ slot.execute(); }
    }
    public static void main(String[] args) {
        Remote r = new Remote();
        r.set(new LightOnCommand(new Light()));
        r.press();
    }
}`,
    expectedStdout: "ON",
    hints: ["LightOnCommand.execute() calls light.on().", "Remote.press() calls the stored command's execute()."] }),
  pm({ topicId: "lld_m4_t1", exerciseId: "lld_m4_t1_pm_2", position: 3, level: "medium",
    title: "Command or Strategy?",
    scenario: "You wrap a complete request (receiver + args) so it can be QUEUED on a task queue and UNDONE later. Which pattern fits — and which would it be if you were just swapping an interchangeable sorting algorithm?",
    options: ["Command (Strategy if swapping an algorithm)", "Strategy (Command if swapping an algorithm)", "Observer / State", "Mediator / Memento"],
    correct: "Command (Strategy if swapping an algorithm)",
    explanation: "Queue + undo of a whole request → Command. Swapping an interchangeable algorithm a context uses → Strategy." }),

  // T2 State
  pm({ topicId: "lld_m4_t2", exerciseId: "lld_m4_t2_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "A TCP connection behaves differently when Closed, Listening, or Established; each mode is its own class deciding the next mode, replacing a status-enum switch. Which pattern?",
    options: ["State", "Strategy", "Command", "Memento"], correct: "State",
    explanation: "Each mode as a class with its own behaviour and transitions, so the object 'changes class', is the State pattern." }),
  predict({ topicId: "lld_m4_t2", exerciseId: "lld_m4_t2_ex_1", position: 2, level: "medium",
    title: "Walk the state machine",
    scenario: "What does this program print (one status per line)?",
    starterCode: `public class Main {
    interface State { State next(); String name(); }
    static class Idle implements State { public State next(){ return new HasMoney(); } public String name(){ return "Idle"; } }
    static class HasMoney implements State { public State next(){ return new Idle(); } public String name(){ return "HasMoney"; } }
    static class Machine {
        private State s = new Idle();
        void advance(){ s = s.next(); }
        String status(){ return s.name(); }
    }
    public static void main(String[] args) {
        Machine m = new Machine();
        System.out.println(m.status());
        m.advance(); System.out.println(m.status());
        m.advance(); System.out.println(m.status());
    }
}`,
    expected: "Idle\nHasMoney\nIdle",
    explanation: "Start Idle. advance() → Idle.next() = HasMoney. advance() → HasMoney.next() = Idle. The states themselves decide the transitions.",
    hints: ["Each state's next() names the following state."] }),
  pm({ topicId: "lld_m4_t2", exerciseId: "lld_m4_t2_pm_2", position: 3, level: "medium",
    title: "State or Strategy?",
    scenario: "The variant objects KNOW about each other and decide which variant comes next (transitions are built in). The client never picks. Which pattern?",
    options: ["State", "Strategy", "Template Method", "Visitor"], correct: "State",
    explanation: "When the variants transition among themselves it's State. Strategy variants are independent and chosen by the client." }),

  // T3 Template Method
  pm({ topicId: "lld_m4_t3", exerciseId: "lld_m4_t3_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "A base class final method run() calls open(), parse(), close() in a fixed order; subclasses override only parse(). Which pattern fixes the sequence while letting steps vary?",
    options: ["Template Method", "Strategy", "Builder", "Bridge"], correct: "Template Method",
    explanation: "A fixed algorithm skeleton in a base method with overridable steps is the Template Method pattern." }),
  code({ topicId: "lld_m4_t3", exerciseId: "lld_m4_t3_ex_1", position: 2, level: "medium",
    title: "Implement a Template Method",
    scenario: "Make an abstract Game with a final play() that calls start() then finish(). A Chess subclass prints \"chess start\" in start() and \"chess end\" in finish(). Run a Chess game.",
    instructions: "Write a complete Java program (public class Main) printing two lines: chess start / chess end.",
    starterCode: `public class Main {
    static abstract class Game {
        // TODO: final play() calls start() then finish()
        abstract void start();
        abstract void finish();
    }
    // TODO: Chess
    public static void main(String[] args) {
        // TODO: new Chess().play();
    }
}`,
    expectedSolution: `public class Main {
    static abstract class Game {
        public final void play(){ start(); finish(); }
        abstract void start();
        abstract void finish();
    }
    static class Chess extends Game {
        void start(){ System.out.println("chess start"); }
        void finish(){ System.out.println("chess end"); }
    }
    public static void main(String[] args) {
        new Chess().play();
    }
}`,
    expectedStdout: "chess start\nchess end",
    hints: ["play() is final and fixes the order: start() then finish().", "Chess only fills in the two steps."] }),
  pm({ topicId: "lld_m4_t3", exerciseId: "lld_m4_t3_pm_2", position: 3, level: "medium",
    title: "Template Method vs Strategy",
    scenario: "You want to vary algorithm STEPS via subclassing, with the overall sequence fixed at compile time in a base class. Which pattern — and which would it be if you swapped the whole algorithm at runtime via composition?",
    options: ["Template Method (Strategy if runtime/composition)", "Strategy (Template Method if runtime)", "Bridge / Adapter", "Command / State"],
    correct: "Template Method (Strategy if runtime/composition)",
    explanation: "Inheritance + fixed skeleton = Template Method. Runtime swap of the whole algorithm via composition = Strategy." }),

  // T4 Chain of Responsibility
  pm({ topicId: "lld_m4_t4", exerciseId: "lld_m4_t4_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "An HTTP request flows through Auth → RateLimit → Logging → Controller; each step handles or forwards to the next, and you can reorder steps without touching the others. Which pattern?",
    options: ["Chain of Responsibility", "Mediator", "Command", "Observer"], correct: "Chain of Responsibility",
    explanation: "Passing a request along a chain where each handler handles or forwards is the Chain of Responsibility pattern (web middleware)." }),
  predict({ topicId: "lld_m4_t4", exerciseId: "lld_m4_t4_ex_1", position: 2, level: "medium",
    title: "Which handler handles it?",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    static abstract class Handler {
        protected Handler next;
        Handler setNext(Handler n){ this.next = n; return n; }
        void handle(int amt){
            if (canHandle(amt)) System.out.println(name() + " approves " + amt);
            else if (next != null) next.handle(amt);
            else System.out.println("rejected " + amt);
        }
        abstract boolean canHandle(int amt); abstract String name();
    }
    static class Manager extends Handler { boolean canHandle(int a){ return a <= 100; } String name(){ return "Manager"; } }
    static class Director extends Handler { boolean canHandle(int a){ return a <= 1000; } String name(){ return "Director"; } }
    public static void main(String[] args) {
        Handler m = new Manager(); m.setNext(new Director());
        m.handle(50);
        m.handle(500);
    }
}`,
    expected: "Manager approves 50\nDirector approves 500",
    explanation: "50 ≤ 100 → Manager approves it. 500 > 100 so Manager forwards to Director; 500 ≤ 1000 → Director approves. Each request stops at the first handler that can handle it.",
    hints: ["50 stays with the Manager; 500 is forwarded to the Director."] }),
  pm({ topicId: "lld_m4_t4", exerciseId: "lld_m4_t4_pm_2", position: 3, level: "medium",
    title: "The chain's failure mode",
    scenario: "A request reaches the end of the chain and no handler accepted it. What should a well-designed chain include to avoid silent loss?",
    options: ["A terminal/default handler", "A Singleton", "A second chain in parallel", "An Observer"],
    correct: "A terminal/default handler",
    explanation: "Include a default/terminal handler (or explicit 'rejected' path) so requests that no one handles aren't silently dropped." }),

  // T5 Iterator
  pm({ topicId: "lld_m4_t5", exerciseId: "lld_m4_t5_pm_1", position: 1, level: "easy",
    title: "Name the pattern",
    scenario: "Your custom tree exposes iterator() returning an object with hasNext()/next(), so callers walk every element without seeing the node structure. Which pattern?",
    options: ["Iterator", "Composite", "Visitor", "Proxy"], correct: "Iterator",
    explanation: "Sequential access to elements without exposing the underlying representation is the Iterator pattern." }),
  predict({ topicId: "lld_m4_t5", exerciseId: "lld_m4_t5_ex_1", position: 2, level: "medium",
    title: "Implement-and-trace an iterator",
    scenario: "What does this program print (one value per line)?",
    starterCode: `import java.util.*;
public class Main {
    static class Range implements Iterable<Integer> {
        final int from, to;
        Range(int f, int t){ from = f; to = t; }
        public Iterator<Integer> iterator(){
            return new Iterator<Integer>() {
                int cur = from;
                public boolean hasNext(){ return cur < to; }
                public Integer next(){ return cur++; }
            };
        }
    }
    public static void main(String[] args) {
        for (int x : new Range(1, 4)) System.out.println(x);
    }
}`,
    expected: "1\n2\n3",
    explanation: "The iterator yields cur from 1 while cur < 4: 1, 2, 3 (4 is excluded by hasNext). for-each uses iterator() under the hood.",
    hints: ["hasNext() is cur < to (exclusive upper bound)."] }),
  pm({ topicId: "lld_m4_t5", exerciseId: "lld_m4_t5_pm_2", position: 3, level: "medium",
    title: "Why externalize traversal?",
    scenario: "What is the main reason to put traversal logic in a separate Iterator object rather than in the collection itself?",
    options: ["So the collection's internals stay hidden and multiple/independent traversals can coexist", "To make the collection thread-safe automatically", "To reduce memory usage of the collection", "To make the collection immutable"],
    correct: "So the collection's internals stay hidden and multiple/independent traversals can coexist",
    explanation: "The iterator holds traversal state separately, encapsulating the structure and allowing several concurrent traversals (and multiple orders)." }),

  // T6 Mediator
  pm({ topicId: "lld_m4_t6", exerciseId: "lld_m4_t6_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "Chat users never reference each other; they all send to a ChatRoom which routes messages. The room holds the interaction logic, turning an N² mesh into hub-and-spoke. Which pattern?",
    options: ["Mediator", "Observer", "Facade", "Chain of Responsibility"], correct: "Mediator",
    explanation: "A central hub encapsulating how a set of objects interact (so they don't reference each other) is the Mediator pattern." }),
  pm({ topicId: "lld_m4_t6", exerciseId: "lld_m4_t6_pm_2", position: 2, level: "medium",
    title: "Mediator or Observer?",
    scenario: "The central object holds the INTERACTION RULES between specific colleagues ('when the Terms checkbox toggles, enable the OK button'), not just a broadcast of 'something changed'. Which pattern?",
    options: ["Mediator", "Observer", "Command", "State"], correct: "Mediator",
    explanation: "Centralizing interaction logic between colleagues is Mediator. Observer merely broadcasts a change to subscribers without holding inter-colleague rules." }),
  pm({ topicId: "lld_m4_t6", exerciseId: "lld_m4_t6_pm_3", position: 3, level: "medium",
    title: "Mediator's risk",
    scenario: "Over time, a Mediator can accumulate every interaction rule in the system. What is this anti-pattern called, and the mitigation?",
    options: ["God-object — keep mediators small/scoped (one per screen)", "Memory leak — unsubscribe observers", "Deadlock — add locks", "Race condition — make it a Singleton"],
    correct: "God-object — keep mediators small/scoped (one per screen)",
    explanation: "A bloated mediator becomes a god-object. Keep each mediator focused (e.g. one per dialog/screen); split when it grows unwieldy." }),

  // T7 Memento
  pm({ topicId: "lld_m4_t7", exerciseId: "lld_m4_t7_pm_1", position: 1, level: "medium",
    title: "Name the pattern",
    scenario: "An editor's save() returns an opaque snapshot object; an undo stack stores them and restore(snapshot) rolls back — and the stack can't read the snapshot's internals. Which pattern?",
    options: ["Memento", "Command", "Prototype", "State"], correct: "Memento",
    explanation: "Capturing and restoring an object's state via an opaque snapshot, without exposing internals, is the Memento pattern." }),
  predict({ topicId: "lld_m4_t7", exerciseId: "lld_m4_t7_ex_1", position: 2, level: "medium",
    title: "Save then restore",
    scenario: "What does this program print?",
    starterCode: `public class Main {
    static class Editor {
        private String text = "";
        void type(String s){ text += s; }
        String get(){ return text; }
        Memento save(){ return new Memento(text); }
        void restore(Memento m){ text = m.state; }
        static class Memento { private final String state; Memento(String s){ state = s; } }
    }
    public static void main(String[] args) {
        Editor e = new Editor();
        e.type("aa");
        Editor.Memento snap = e.save();
        e.type("bb");
        e.restore(snap);
        System.out.println(e.get());
    }
}`,
    expected: "aa",
    explanation: "After typing \"aa\" the snapshot captures \"aa\". Typing \"bb\" makes text \"aabb\", but restore(snap) rolls back to the saved \"aa\".",
    hints: ["The snapshot was taken before \"bb\" was typed."] }),
  pm({ topicId: "lld_m4_t7", exerciseId: "lld_m4_t7_pm_2", position: 3, level: "medium",
    title: "Memento vs Command-undo",
    scenario: "You implement undo by restoring a full prior SNAPSHOT of state (not by inverting each action). Which pattern is that, and the main cost?",
    options: ["Memento — memory for large snapshots", "Command — must make every action reversible", "Observer — notification overhead", "State — extra state classes"],
    correct: "Memento — memory for large snapshots",
    explanation: "Snapshot-based undo is Memento; its cost is memory for large/ frequent snapshots. Command-undo instead requires every action to be invertible." }),

  // T8 Visitor
  pm({ topicId: "lld_m4_t8", exerciseId: "lld_m4_t8_pm_1", position: 1, level: "hard",
    title: "Name the pattern",
    scenario: "Over a stable set of AST node types you keep adding operations (typecheck, codegen, pretty-print) as separate objects; each node has accept(visitor) and dispatches to visitX(this). Which pattern?",
    options: ["Visitor", "Composite", "Strategy", "Template Method"], correct: "Visitor",
    explanation: "Adding operations over a stable object structure via accept()/visitX() (double dispatch) is the Visitor pattern." }),
  predict({ topicId: "lld_m4_t8", exerciseId: "lld_m4_t8_ex_1", position: 2, level: "hard",
    title: "Double dispatch in action",
    scenario: "What does this program print?",
    starterCode: `import java.util.*;
public class Main {
    interface Visitor { void visit(Circle c); void visit(Square s); }
    interface Shape { void accept(Visitor v); }
    static class Circle implements Shape { public void accept(Visitor v){ v.visit(this); } }
    static class Square implements Shape { public void accept(Visitor v){ v.visit(this); } }
    static class NameVisitor implements Visitor {
        public void visit(Circle c){ System.out.println("circle"); }
        public void visit(Square s){ System.out.println("square"); }
    }
    public static void main(String[] args) {
        List<Shape> shapes = Arrays.asList(new Square(), new Circle());
        Visitor v = new NameVisitor();
        for (Shape s : shapes) s.accept(v);
    }
}`,
    expected: "square\ncircle",
    explanation: "Each shape's accept() calls v.visit(this); the static type of `this` (Square then Circle) selects the right overload. Order follows the list: square, circle.",
    hints: ["accept() forwards to the visit overload matching the element type."] }),
  pm({ topicId: "lld_m4_t8", exerciseId: "lld_m4_t8_pm_2", position: 3, level: "hard",
    title: "Visitor's trade-off",
    scenario: "Visitor makes one kind of change easy and another hard. Which is true?",
    options: ["Easy to add operations; hard to add element types", "Easy to add element types; hard to add operations", "Easy to add both", "Hard to add both"],
    correct: "Easy to add operations; hard to add element types",
    explanation: "A new operation is a new visitor (no element changes). A new element type forces a new visit method in EVERY visitor — the inverse of the usual hierarchy trade-off." }),
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
  console.log(`\nDone — M4 Behavioral Patterns seeded.`);
  console.log(`  Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
