/**
 * memoryModel — scripted Java memory-trace step generators.
 *
 * Used by M4-T1 (Classes & Objects). Not a real Java interpreter — each
 * demo is a hand-authored trace whose ops mutate the simulated stack/
 * heap state. Each op emits one frame.
 *
 * Frame shape:
 *   {
 *     code: string,                   // Java source for the entire demo
 *     activeLine: number,
 *     stackFrames: [{ name, vars: [{name, type, value, heapId?, state}] }],
 *     heap: { [heapId]: { type, value?, fields?, state } },
 *     highlight: { stackKey?, heapId? } | null,
 *     step: { description, detail }
 *   }
 *
 * Three canonical demos:
 *   - primitives-vs-references: int copy by value vs String share reference
 *   - object-mutation: object passed to method, mutation visible via reference
 *   - array-aliasing: array passed around — mutation through one variable seen by another
 */

let _heapCounter = 1;
const nextHeapId = () => String(_heapCounter++);

function fresh() { _heapCounter = 1; }

function snap(state, line, note) {
  return {
    code: state.code,
    activeLine: line,
    stackFrames: state.stackFrames.map((f) => ({
      name: f.name,
      vars: f.vars.map((v) => ({ ...v })),
    })),
    heap: Object.fromEntries(Object.entries(state.heap).map(([k, v]) => [k, { ...v, fields: v.fields ? { ...v.fields } : undefined }])),
    highlight: state.highlight ? { ...state.highlight } : null,
    step: note,
  };
}

// ── Demo 1: primitives vs references ─────────────────────────────────────────
function buildPrimitivesVsReferencesFrames() {
  fresh();
  const code = `public static void main(String[] args) {
  // Primitives copy by value
  int x = 5;
  int y = x;          // y gets its own copy
  y = 10;             // changing y doesn't affect x

  // References share the underlying object
  int[] a = {1, 2, 3};
  int[] b = a;        // b points to the SAME array as a
  b[0] = 99;          // mutates the one shared array
}`;
  const state = {
    code,
    stackFrames: [{ name: "main(args)", vars: [] }],
    heap: {},
    highlight: null,
  };
  const frames = [];
  const main = () => state.stackFrames[0];

  frames.push(snap(state, 1, { description: "Enter main().", detail: "An empty stack frame is created for main()." }));

  // int x = 5
  main().vars.push({ name: "x", type: "int", value: 5, state: "just-set" });
  state.highlight = { stackKey: "main(args).x" };
  frames.push(snap(state, 3, { description: "int x = 5;", detail: "Primitive — value lives directly inside main()'s stack frame." }));
  main().vars[0].state = "default";

  // int y = x (copy)
  main().vars.push({ name: "y", type: "int", value: 5, state: "just-set" });
  state.highlight = { stackKey: "main(args).y" };
  frames.push(snap(state, 4, { description: "int y = x;", detail: "Primitives are copied by value. y gets its own 5 — it is NOT linked to x." }));
  main().vars[1].state = "default";

  // y = 10
  main().vars[1].value = 10;
  main().vars[1].state = "just-set";
  frames.push(snap(state, 5, { description: "y = 10;", detail: "Reassigning y has no effect on x. x is still 5." }));
  main().vars[1].state = "default";
  state.highlight = null;

  // int[] a = {1, 2, 3}
  const arrayId = nextHeapId();
  state.heap[arrayId] = { type: "int[]", value: [1, 2, 3], state: "just-set" };
  main().vars.push({ name: "a", type: "int[]", heapId: arrayId, state: "just-set" });
  state.highlight = { stackKey: "main(args).a", heapId: arrayId };
  frames.push(snap(state, 8, { description: "int[] a = {1, 2, 3};", detail: "Arrays are objects. They live on the heap. `a` on the stack is just a reference to the array." }));
  main().vars[2].state = "default";
  state.heap[arrayId].state = "default";

  // int[] b = a
  main().vars.push({ name: "b", type: "int[]", heapId: arrayId, state: "just-set" });
  state.highlight = { stackKey: "main(args).b", heapId: arrayId };
  frames.push(snap(state, 9, { description: "int[] b = a;", detail: "Both `a` and `b` now point to the SAME heap object. Only the reference is copied — the array is not." }));
  main().vars[3].state = "default";

  // b[0] = 99
  state.heap[arrayId].value[0] = 99;
  state.heap[arrayId].state = "just-set";
  state.highlight = { heapId: arrayId };
  frames.push(snap(state, 10, { description: "b[0] = 99;", detail: "We mutate the heap object through `b`. `a` sees the change too — they share the same array." }));
  state.heap[arrayId].state = "default";

  state.highlight = null;
  frames.push(snap(state, 11, { description: "Done.", detail: "Notice x and y diverged (primitives), but a and b stayed in sync (references)." }));
  return frames;
}

// ── Demo 2: object mutation through method ───────────────────────────────────
function buildObjectMutationFrames() {
  fresh();
  const code = `class Counter {
  int count = 0;
}

static void increment(Counter c) {
  c.count = c.count + 1;
}

public static void main(String[] args) {
  Counter outer = new Counter();
  increment(outer);
  increment(outer);
  System.out.println(outer.count);   // → 2
}`;
  const state = {
    code,
    stackFrames: [{ name: "main(args)", vars: [] }],
    heap: {},
    highlight: null,
  };
  const frames = [];
  const main = () => state.stackFrames[0];

  frames.push(snap(state, 9, { description: "Enter main().", detail: "" }));

  // new Counter()
  const counterId = nextHeapId();
  state.heap[counterId] = { type: "Counter", fields: { count: 0 }, state: "just-set" };
  main().vars.push({ name: "outer", type: "Counter", heapId: counterId, state: "just-set" });
  state.highlight = { stackKey: "main(args).outer", heapId: counterId };
  frames.push(snap(state, 10, { description: "Counter outer = new Counter();", detail: "`new Counter()` allocates a Counter on the heap. `outer` is a reference to that heap address." }));
  main().vars[0].state = "default";
  state.heap[counterId].state = "default";

  // Call increment(outer) — first time
  state.stackFrames.push({ name: "increment(c)", vars: [{ name: "c", type: "Counter", heapId: counterId, state: "just-set" }] });
  state.highlight = { stackKey: "increment(c).c", heapId: counterId };
  frames.push(snap(state, 11, { description: "Call increment(outer).", detail: "A new stack frame is pushed. The reference is passed BY VALUE — but the value is an address, so `c` points to the same heap object as `outer`." }));
  state.stackFrames[1].vars[0].state = "default";

  // c.count = c.count + 1
  state.heap[counterId].fields.count = 1;
  state.heap[counterId].state = "just-set";
  state.highlight = { heapId: counterId };
  frames.push(snap(state, 6, { description: "c.count = c.count + 1;", detail: "Mutate the heap object's field. Now count = 1." }));
  state.heap[counterId].state = "default";

  // Return from increment
  state.stackFrames.pop();
  state.highlight = null;
  frames.push(snap(state, 12, { description: "increment() returns. Stack frame popped.", detail: "But the heap mutation persists — count is still 1." }));

  // Second call
  state.stackFrames.push({ name: "increment(c)", vars: [{ name: "c", type: "Counter", heapId: counterId, state: "just-set" }] });
  state.highlight = { stackKey: "increment(c).c", heapId: counterId };
  frames.push(snap(state, 12, { description: "Call increment(outer) again.", detail: "Same dance — new frame, c → heap#1." }));
  state.stackFrames[1].vars[0].state = "default";

  state.heap[counterId].fields.count = 2;
  state.heap[counterId].state = "just-set";
  state.highlight = { heapId: counterId };
  frames.push(snap(state, 6, { description: "c.count = c.count + 1;", detail: "count = 2 now." }));
  state.heap[counterId].state = "default";

  state.stackFrames.pop();
  state.highlight = { heapId: counterId };
  frames.push(snap(state, 13, { description: "Second increment() returns.", detail: "outer.count is now 2. Prints 2." }));
  return frames;
}

// ── Demo 3: nulling a reference doesn't delete the object ────────────────────
function buildNullingReferenceFrames() {
  fresh();
  const code = `String s1 = new String("hello");
String s2 = s1;          // s2 shares the heap object
s1 = null;               // s1 no longer points to it
System.out.println(s2);  // still "hello" — s2 still holds the reference`;
  const state = {
    code,
    stackFrames: [{ name: "main(args)", vars: [] }],
    heap: {},
    highlight: null,
  };
  const frames = [];
  const main = () => state.stackFrames[0];

  // new String("hello")
  const strId = nextHeapId();
  state.heap[strId] = { type: "String", value: "hello", state: "just-set" };
  main().vars.push({ name: "s1", type: "String", heapId: strId, state: "just-set" });
  state.highlight = { stackKey: "main(args).s1", heapId: strId };
  frames.push(snap(state, 1, { description: `String s1 = new String("hello");`, detail: "String object on the heap. s1 is the reference." }));
  main().vars[0].state = "default";
  state.heap[strId].state = "default";

  // s2 = s1
  main().vars.push({ name: "s2", type: "String", heapId: strId, state: "just-set" });
  state.highlight = { stackKey: "main(args).s2", heapId: strId };
  frames.push(snap(state, 2, { description: "String s2 = s1;", detail: "Now BOTH s1 and s2 point to the same String object on the heap." }));
  main().vars[1].state = "default";

  // s1 = null
  main().vars[0].heapId = null;
  main().vars[0].value = null;
  main().vars[0].state = "just-set";
  state.highlight = { stackKey: "main(args).s1" };
  frames.push(snap(state, 3, { description: "s1 = null;", detail: "s1 is overwritten — but the heap object is NOT freed yet because s2 still references it." }));
  main().vars[0].state = "default";

  // Print
  state.highlight = { heapId: strId };
  frames.push(snap(state, 4, { description: "println(s2)", detail: `Prints "hello" — s2 still holds the reference. The object only becomes garbage-collectable when ALL references are gone.` }));
  return frames;
}

const DEMOS = {
  "primitives-vs-references": { label: "Primitives vs references", build: buildPrimitivesVsReferencesFrames },
  "object-mutation":          { label: "Object mutation through method", build: buildObjectMutationFrames },
  "nulling-reference":        { label: "Nulling a reference (GC)",       build: buildNullingReferenceFrames },
};

export const DEMO_IDS = Object.keys(DEMOS);
export const DEMO_LABELS = Object.fromEntries(Object.entries(DEMOS).map(([k, v]) => [k, v.label]));

export function generateMemoryModelSteps(demoId) {
  const demo = DEMOS[demoId] || DEMOS["primitives-vs-references"];
  return demo.build();
}
