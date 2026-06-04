/**
 * Seed — attach UML class-diagram visual aids to the 22 GoF-pattern topics of
 * the pro_lld track (GAP #4 polish). Generates each diagram with config/umlSvg.mjs
 * and $sets teaching.visual_aid (preserving teaching.blocks). Rendered by
 * components/pro/VisualAid.jsx (authored-SVG tier).
 *
 * Idempotent: re-running writes the same SVG. Covers every pattern topic in
 * M1 (6), M2 (3), M3 (5), M4 (8). Case-study topics (M5, + Parking-Lot/LRU in
 * M1) are intentionally NOT diagrammed here — they're design walk-throughs, not
 * single-pattern structures.
 *
 * Usage:  node config/seedLldDiagrams.js   ·   npm: npm run seed:lld-diagrams
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProTopic } from "../models/proModels.js";
import { umlSvg } from "./umlSvg.mjs";
import { recomputeLldTotals } from "./lldTotals.mjs";

// topicId → { title, classes, edges, description, alt_text }
const DIAGRAMS = {
  // ── M1 patterns ──
  lld_m1_t4: {
    title: "Strategy", description: "The Context holds a PaymentStrategy and delegates pay() to whichever concrete strategy it was given — adding a method is a new class, not an edit.",
    alt_text: "Checkout context associated with a PaymentStrategy interface; CardPayment and UpiPayment implement it.",
    classes: [
      { id: "ctx", name: "Checkout", stereotype: "Context", members: ["- strategy: PaymentStrategy", "+ confirm(amt)"], x: 20, y: 40 },
      { id: "if", name: "PaymentStrategy", stereotype: "interface", members: ["+ pay(amt)"], x: 270, y: 40 },
      { id: "card", name: "CardPayment", members: ["+ pay(amt)"], x: 190, y: 185 },
      { id: "upi", name: "UpiPayment", members: ["+ pay(amt)"], x: 360, y: 185 },
    ],
    edges: [{ from: "ctx", to: "if", kind: "assoc", label: "uses" }, { from: "card", to: "if", kind: "implement" }, { from: "upi", to: "if", kind: "implement" }],
  },
  lld_m1_t5: {
    title: "Observer", description: "The Subject keeps a list of Observers and calls update() on each when its state changes; concrete displays implement Observer.",
    alt_text: "Stock subject aggregates Observer; PriceDisplay and Alert implement Observer.",
    classes: [
      { id: "subj", name: "Stock", stereotype: "Subject", members: ["- observers: List<Observer>", "+ subscribe(o)", "+ setPrice(p)"], x: 20, y: 40 },
      { id: "if", name: "Observer", stereotype: "interface", members: ["+ update(price)"], x: 300, y: 40 },
      { id: "d1", name: "PriceDisplay", members: ["+ update(price)"], x: 220, y: 200 },
      { id: "d2", name: "Alert", members: ["+ update(price)"], x: 390, y: 200 },
    ],
    edges: [{ from: "subj", to: "if", kind: "aggregate", label: "observers *" }, { from: "d1", to: "if", kind: "implement" }, { from: "d2", to: "if", kind: "implement" }],
  },
  lld_m1_t6: {
    title: "Factory", description: "A factory method returns the Product interface; callers never name a concrete product class.",
    alt_text: "ShapeFactory creates Shape; Circle and Square implement Shape.",
    classes: [
      { id: "fac", name: "ShapeFactory", members: ["+ create(kind): Shape"], x: 20, y: 50 },
      { id: "if", name: "Shape", stereotype: "interface", members: ["+ draw()"], x: 280, y: 50 },
      { id: "c", name: "Circle", members: ["+ draw()"], x: 200, y: 190 },
      { id: "s", name: "Square", members: ["+ draw()"], x: 360, y: 190 },
    ],
    edges: [{ from: "fac", to: "if", kind: "depend", label: "creates" }, { from: "c", to: "if", kind: "implement" }, { from: "s", to: "if", kind: "implement" }],
  },
  lld_m1_t7: {
    title: "Singleton", description: "A private constructor plus a static accessor guarantee exactly one instance, returned to every caller.",
    alt_text: "Config class with a private static INSTANCE, a private constructor, and a public static get() returning the single instance.",
    classes: [
      { id: "s", name: "Config", stereotype: "Singleton", members: ["- INSTANCE: Config {static}", "- Config()  «private»", "+ get(): Config {static}"], x: 130, y: 50 },
    ],
    edges: [{ from: "s", to: "s", kind: "assoc", label: "holds 1" }],
  },
  lld_m1_t8: {
    title: "Decorator", description: "AddOn implements Beverage AND wraps a Beverage, so decorators stack at runtime: new Sugar(new Milk(new Espresso())).",
    alt_text: "Beverage interface; Espresso implements it; AddOn implements Beverage and aggregates a Beverage; Milk extends AddOn.",
    classes: [
      { id: "if", name: "Beverage", stereotype: "interface", members: ["+ costCents()"], x: 150, y: 30 },
      { id: "esp", name: "Espresso", members: ["+ costCents()"], x: 20, y: 165 },
      { id: "add", name: "AddOn", stereotype: "abstract", members: ["# inner: Beverage", "+ costCents()"], x: 250, y: 160 },
      { id: "milk", name: "Milk", members: ["+ costCents()"], x: 280, y: 300 },
    ],
    edges: [{ from: "esp", to: "if", kind: "implement" }, { from: "add", to: "if", kind: "implement" }, { from: "add", to: "if", kind: "aggregate", label: "wraps" }, { from: "milk", to: "add", kind: "inherit" }],
  },
  lld_m1_t9: {
    title: "Adapter", description: "StripeAdapter implements the PaymentGateway the client expects and translates pay() into the SDK's chargeCents().",
    alt_text: "PaymentGateway interface; StripeAdapter implements it and associates a StripeSdk adaptee.",
    classes: [
      { id: "if", name: "PaymentGateway", stereotype: "interface", members: ["+ pay(cents)"], x: 20, y: 50 },
      { id: "ad", name: "StripeAdapter", members: ["- sdk: StripeSdk", "+ pay(cents)"], x: 250, y: 50 },
      { id: "ae", name: "StripeSdk", stereotype: "adaptee", members: ["+ chargeCents(amt)"], x: 250, y: 195 },
    ],
    edges: [{ from: "ad", to: "if", kind: "implement" }, { from: "ad", to: "ae", kind: "assoc", label: "delegates" }],
  },

  // ── M2 creational ──
  lld_m2_t1: {
    title: "Builder", description: "The nested Builder collects optional fields via fluent setters; build() constructs the (immutable) Product once.",
    alt_text: "Pizza product with a private constructor; nested Builder with setters returning Builder and build() returning Pizza.",
    classes: [
      { id: "b", name: "Pizza.Builder", members: ["- size; - cheese", "+ size(s): Builder", "+ cheese(c): Builder", "+ build(): Pizza"], x: 20, y: 50 },
      { id: "p", name: "Pizza", members: ["- size; - cheese", "- Pizza(Builder)"], x: 300, y: 60 },
    ],
    edges: [{ from: "b", to: "p", kind: "depend", label: "builds" }],
  },
  lld_m2_t2: {
    title: "Abstract Factory", description: "GuiFactory creates a whole family (Button + Checkbox); WinFactory produces matching Windows products.",
    alt_text: "GuiFactory interface; WinFactory implements it and creates Button and Checkbox interfaces.",
    classes: [
      { id: "af", name: "GuiFactory", stereotype: "interface", members: ["+ button(): Button", "+ checkbox(): Checkbox"], x: 20, y: 40 },
      { id: "wf", name: "WinFactory", members: ["+ button()", "+ checkbox()"], x: 20, y: 195 },
      { id: "btn", name: "Button", stereotype: "interface", members: ["+ render()"], x: 310, y: 40 },
      { id: "cb", name: "Checkbox", stereotype: "interface", members: ["+ render()"], x: 310, y: 175 },
    ],
    edges: [{ from: "wf", to: "af", kind: "implement" }, { from: "wf", to: "btn", kind: "depend", label: "creates" }, { from: "wf", to: "cb", kind: "depend", label: "creates" }],
  },
  lld_m2_t3: {
    title: "Prototype", description: "Clients copy a configured prototype via clone() instead of re-running an expensive constructor.",
    alt_text: "Prototype interface with clone(); Config implements it and clone returns a Config.",
    classes: [
      { id: "if", name: "Prototype", stereotype: "interface", members: ["+ clone(): Prototype"], x: 60, y: 50 },
      { id: "c", name: "Config", members: ["- flags: List", "+ clone(): Config"], x: 320, y: 50 },
    ],
    edges: [{ from: "c", to: "if", kind: "implement" }, { from: "c", to: "c", kind: "depend", label: "copies self" }],
  },

  // ── M3 structural ──
  lld_m3_t1: {
    title: "Facade", description: "HomeTheaterFacade exposes one watchMovie() that orchestrates the Amp, Projector and Lights subsystem.",
    alt_text: "HomeTheaterFacade depends on Amp, Projector and Lights.",
    classes: [
      { id: "f", name: "HomeTheaterFacade", members: ["+ watchMovie()"], x: 20, y: 110 },
      { id: "a", name: "Amp", members: ["+ on()"], x: 290, y: 30 },
      { id: "p", name: "Projector", members: ["+ on()"], x: 290, y: 140 },
      { id: "l", name: "Lights", members: ["+ dim(n)"], x: 290, y: 250 },
    ],
    edges: [{ from: "f", to: "a", kind: "depend" }, { from: "f", to: "p", kind: "depend" }, { from: "f", to: "l", kind: "depend" }],
  },
  lld_m3_t2: {
    title: "Composite", description: "Leaf (File) and Composite (Dir) share the Node interface; a Dir aggregates Nodes and recurses size().",
    alt_text: "Node interface; File leaf implements it; Dir composite implements it and aggregates Node children.",
    classes: [
      { id: "if", name: "Node", stereotype: "interface", members: ["+ size()"], x: 150, y: 30 },
      { id: "f", name: "File", stereotype: "leaf", members: ["+ size()"], x: 20, y: 180 },
      { id: "d", name: "Dir", stereotype: "composite", members: ["- children: List<Node>", "+ size()"], x: 270, y: 180 },
    ],
    edges: [{ from: "f", to: "if", kind: "implement" }, { from: "d", to: "if", kind: "implement" }, { from: "d", to: "if", kind: "aggregate", label: "children *" }],
  },
  lld_m3_t3: {
    title: "Proxy", description: "Proxy implements the same Image interface and lazily creates / controls access to the RealImage.",
    alt_text: "Image interface; RealImage implements it; ImageProxy implements it and associates a RealImage.",
    classes: [
      { id: "if", name: "Image", stereotype: "interface", members: ["+ display()"], x: 150, y: 30 },
      { id: "real", name: "RealImage", members: ["+ display()"], x: 20, y: 185 },
      { id: "px", name: "ImageProxy", members: ["- real: RealImage", "+ display()"], x: 270, y: 185 },
    ],
    edges: [{ from: "real", to: "if", kind: "implement" }, { from: "px", to: "if", kind: "implement" }, { from: "px", to: "real", kind: "assoc", label: "lazily creates" }],
  },
  lld_m3_t4: {
    title: "Bridge", description: "Shape (abstraction) holds a Color (implementor); the two hierarchies vary independently — no Cartesian subclass explosion.",
    alt_text: "Shape abstraction aggregates a Color interface; Circle extends Shape; Red implements Color.",
    classes: [
      { id: "sh", name: "Shape", stereotype: "abstract", members: ["# color: Color", "+ draw()"], x: 20, y: 40 },
      { id: "col", name: "Color", stereotype: "interface", members: ["+ fill()"], x: 290, y: 40 },
      { id: "ci", name: "Circle", members: ["+ draw()"], x: 20, y: 200 },
      { id: "red", name: "Red", members: ["+ fill()"], x: 290, y: 200 },
    ],
    edges: [{ from: "sh", to: "col", kind: "aggregate", label: "bridge" }, { from: "ci", to: "sh", kind: "inherit" }, { from: "red", to: "col", kind: "implement" }],
  },
  lld_m3_t5: {
    title: "Flyweight", description: "The factory caches and shares intrinsic TreeType objects; per-instance (extrinsic) position is supplied by the client.",
    alt_text: "TreeFactory caches and returns shared TreeType flyweights.",
    classes: [
      { id: "fac", name: "TreeFactory", members: ["- cache: Map<String,TreeType>", "+ of(name): TreeType"], x: 20, y: 60 },
      { id: "fw", name: "TreeType", stereotype: "flyweight (intrinsic)", members: ["- name; - mesh"], x: 320, y: 60 },
    ],
    edges: [{ from: "fac", to: "fw", kind: "aggregate", label: "shares" }],
  },

  // ── M4 behavioral ──
  lld_m4_t1: {
    title: "Command", description: "The Invoker holds a Command; ConcreteCommand binds a Receiver and calls it in execute().",
    alt_text: "RemoteButton invoker associates a Command interface; LightOnCommand implements it and associates a Light receiver.",
    classes: [
      { id: "inv", name: "RemoteButton", stereotype: "Invoker", members: ["- command: Command", "+ press()"], x: 20, y: 40 },
      { id: "if", name: "Command", stereotype: "interface", members: ["+ execute()"], x: 290, y: 40 },
      { id: "cc", name: "LightOnCommand", members: ["- light: Light", "+ execute()"], x: 270, y: 185 },
      { id: "rec", name: "Light", stereotype: "Receiver", members: ["+ on()"], x: 270, y: 320 },
    ],
    edges: [{ from: "inv", to: "if", kind: "assoc" }, { from: "cc", to: "if", kind: "implement" }, { from: "cc", to: "rec", kind: "assoc", label: "calls" }],
  },
  lld_m4_t2: {
    title: "State", description: "Context delegates to its current State object; each state defines behaviour and the next state.",
    alt_text: "Machine context aggregates a State interface; Idle and HasMoney implement State.",
    classes: [
      { id: "ctx", name: "Machine", stereotype: "Context", members: ["- state: State", "+ advance()"], x: 20, y: 40 },
      { id: "if", name: "State", stereotype: "interface", members: ["+ next(): State"], x: 290, y: 40 },
      { id: "s1", name: "Idle", members: ["+ next()"], x: 210, y: 195 },
      { id: "s2", name: "HasMoney", members: ["+ next()"], x: 370, y: 195 },
    ],
    edges: [{ from: "ctx", to: "if", kind: "aggregate" }, { from: "s1", to: "if", kind: "implement" }, { from: "s2", to: "if", kind: "implement" }],
  },
  lld_m4_t3: {
    title: "Template Method", description: "The base class fixes the algorithm skeleton in a final method; subclasses override only the variable steps.",
    alt_text: "Abstract Game with final play() and abstract steps; Chess extends and overrides the steps.",
    classes: [
      { id: "ab", name: "Game", stereotype: "abstract", members: ["+ play() {final}", "# start()  «abstract»", "# finish() «abstract»"], x: 90, y: 40 },
      { id: "ch", name: "Chess", members: ["# start()", "# finish()"], x: 130, y: 215 },
    ],
    edges: [{ from: "ch", to: "ab", kind: "inherit" }],
  },
  lld_m4_t4: {
    title: "Chain of Responsibility", description: "Each Handler holds the next; it handles the request or forwards it down the chain.",
    alt_text: "Abstract Handler with a self-aggregation 'next'; Manager and Director extend Handler.",
    classes: [
      { id: "h", name: "Handler", stereotype: "abstract", members: ["# next: Handler", "+ handle(r)"], x: 130, y: 30 },
      { id: "m", name: "Manager", members: ["+ handle(r)"], x: 20, y: 200 },
      { id: "d", name: "Director", members: ["+ handle(r)"], x: 280, y: 200 },
    ],
    edges: [{ from: "h", to: "h", kind: "aggregate", label: "next" }, { from: "m", to: "h", kind: "inherit" }, { from: "d", to: "h", kind: "inherit" }],
  },
  lld_m4_t5: {
    title: "Iterator", description: "The Aggregate produces an Iterator that walks elements via hasNext()/next() without exposing the structure.",
    alt_text: "Aggregate interface returns an Iterator interface; ConcreteAggregate and ConcreteIterator implement them.",
    classes: [
      { id: "agg", name: "Aggregate", stereotype: "interface", members: ["+ iterator(): Iterator"], x: 20, y: 40 },
      { id: "it", name: "Iterator", stereotype: "interface", members: ["+ hasNext()", "+ next()"], x: 300, y: 40 },
      { id: "ca", name: "Range", members: ["+ iterator()"], x: 20, y: 200 },
      { id: "ci", name: "RangeIterator", members: ["+ hasNext()", "+ next()"], x: 300, y: 200 },
    ],
    edges: [{ from: "ca", to: "agg", kind: "implement" }, { from: "ci", to: "it", kind: "implement" }, { from: "ca", to: "ci", kind: "depend", label: "creates" }, { from: "agg", to: "it", kind: "depend" }],
  },
  lld_m4_t6: {
    title: "Mediator", description: "Colleagues talk only to the Mediator, which holds the interaction logic — a hub instead of an N² mesh.",
    alt_text: "Mediator interface; DialogMediator implements it; Colleague associates the Mediator.",
    classes: [
      { id: "if", name: "Mediator", stereotype: "interface", members: ["+ notify(sender, ev)"], x: 20, y: 40 },
      { id: "cm", name: "DialogMediator", members: ["+ notify(...)"], x: 20, y: 190 },
      { id: "col", name: "Component", stereotype: "Colleague", members: ["- mediator: Mediator"], x: 300, y: 110 },
    ],
    edges: [{ from: "cm", to: "if", kind: "implement" }, { from: "col", to: "if", kind: "assoc", label: "notifies" }],
  },
  lld_m4_t7: {
    title: "Memento", description: "The Originator creates an opaque Memento; the Caretaker stores it and hands it back to restore — without reading it.",
    alt_text: "Editor originator creates Memento; Caretaker aggregates Mementos.",
    classes: [
      { id: "or", name: "Editor", stereotype: "Originator", members: ["+ save(): Memento", "+ restore(m)"], x: 20, y: 50 },
      { id: "mem", name: "Memento", members: ["- state «private»"], x: 300, y: 50 },
      { id: "ct", name: "Caretaker", members: ["- history: Deque<Memento>"], x: 280, y: 195 },
    ],
    edges: [{ from: "or", to: "mem", kind: "depend", label: "creates" }, { from: "ct", to: "mem", kind: "aggregate", label: "stores" }],
  },
  lld_m4_t8: {
    title: "Visitor", description: "Elements accept a Visitor and call back visitX(this) (double dispatch); a new operation is a new visitor, touching no element.",
    alt_text: "Element interface with accept(Visitor); Circle implements it; Visitor interface; AreaVisitor implements Visitor.",
    classes: [
      { id: "el", name: "Shape", stereotype: "interface", members: ["+ accept(v: Visitor)"], x: 20, y: 40 },
      { id: "v", name: "Visitor", stereotype: "interface", members: ["+ visit(Circle)", "+ visit(Square)"], x: 290, y: 40 },
      { id: "ci", name: "Circle", members: ["+ accept(v)"], x: 20, y: 210 },
      { id: "av", name: "AreaVisitor", members: ["+ visit(...)"], x: 290, y: 210 },
    ],
    edges: [{ from: "ci", to: "el", kind: "implement" }, { from: "av", to: "v", kind: "implement" }, { from: "el", to: "v", kind: "depend", label: "accepts" }],
  },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  let updated = 0, missing = [];
  for (const [topicId, d] of Object.entries(DIAGRAMS)) {
    const svg = umlSvg({ title: d.title, classes: d.classes, edges: d.edges });
    const res = await ProTopic.updateOne(
      { topicId, trackKey: "pro_lld" },
      { $set: { "teaching.visual_aid": { type: `UML — ${d.title}`, svg, description: d.description, alt_text: d.alt_text } } }
    );
    if (res.matchedCount === 0) missing.push(topicId); else updated++;
  }
  console.log(`  ✓ visual_aid set on ${updated}/${Object.keys(DIAGRAMS).length} pattern topics`);
  if (missing.length) console.log(`  ✗ topics not found: ${missing.join(", ")}`);
  await recomputeLldTotals();
  await mongoose.disconnect();
  if (missing.length) process.exit(1);
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
