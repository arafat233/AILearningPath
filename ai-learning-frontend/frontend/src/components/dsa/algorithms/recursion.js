/**
 * recursion — call-stack-frame step generator for classic recursive
 * functions.
 *
 * Used by M2-T5 (Recursion Basics).
 *
 * Each demo simulates execution by pushing/popping frames manually so
 * we control the frame granularity. Three demos:
 *   - factorial(n)  — linear recursion
 *   - fibonacci(n)  — binary recursion (two recursive calls per frame)
 *   - sumToN(n)     — linear, simplest pedagogy
 *
 * Frame shape:
 *   {
 *     code: string,
 *     activeLine: number,
 *     callStack: [{id, call, locals, status, returnValue?}],
 *     step: { description, detail }
 *   }
 */

let _frameCounter = 0;
const nextId = () => `f${++_frameCounter}`;

function frame(call, locals, status, returnValue) {
  return { id: nextId(), call, locals: { ...locals }, status, ...(returnValue !== undefined ? { returnValue } : {}) };
}

function snap(code, activeLine, callStack, note) {
  return {
    code,
    activeLine,
    callStack: callStack.map((f) => ({ ...f, locals: { ...f.locals } })),
    step: note,
  };
}

// ── factorial(n) = n * factorial(n-1), base case n <= 1 ──────────────────────
function buildFactorialFrames(n) {
  _frameCounter = 0;
  const code = `static int factorial(int n) {
  if (n <= 1) return 1;        // base case
  int sub = factorial(n - 1);  // recursive call
  return n * sub;              // multiply
}`;
  const frames = [];
  const stack = [];

  function rec(arg) {
    // Push new frame
    const f = frame(`factorial(${arg})`, { n: arg }, "active");
    stack.push(f);
    frames.push(snap(code, 1, stack, { description: `Call factorial(${arg}).`, detail: "Push new frame onto the call stack." }));
    frames.push(snap(code, 2, stack, { description: `Check base case: n=${arg} <= 1 ?`, detail: arg <= 1 ? "Yes — return 1." : "No — recurse." }));
    if (arg <= 1) {
      f.status = "returning";
      f.returnValue = 1;
      frames.push(snap(code, 2, stack, { description: `Base case hit. Return 1.`, detail: "" }));
      stack.pop();
      return 1;
    }
    // Mark parent waiting
    f.status = "waiting";
    frames.push(snap(code, 3, stack, { description: `Recurse: factorial(${arg - 1}).`, detail: "Current frame waits for the callee." }));
    const sub = rec(arg - 1);
    // Update locals on return
    f.locals.sub = sub;
    f.status = "active";
    frames.push(snap(code, 3, stack, { description: `Returned from recursion. sub = ${sub}.`, detail: "" }));
    const result = arg * sub;
    f.status = "returning";
    f.returnValue = result;
    frames.push(snap(code, 4, stack, { description: `Return n * sub = ${arg} * ${sub} = ${result}.`, detail: "" }));
    stack.pop();
    return result;
  }

  rec(n);
  frames.push(snap(code, 4, [], { description: `factorial(${n}) = ${n <= 1 ? 1 : factorialResult(n)}.`, detail: "Stack fully unwound." }));
  return frames;
}
function factorialResult(n) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }

// ── fibonacci(n) — binary recursion ──────────────────────────────────────────
function buildFibonacciFrames(n) {
  _frameCounter = 0;
  const code = `static int fib(int n) {
  if (n < 2) return n;             // base: fib(0)=0, fib(1)=1
  int a = fib(n - 1);              // recurse left
  int b = fib(n - 2);              // recurse right
  return a + b;                    // combine
}`;
  const frames = [];
  const stack = [];

  function rec(arg) {
    const f = frame(`fib(${arg})`, { n: arg }, "active");
    stack.push(f);
    frames.push(snap(code, 1, stack, { description: `Call fib(${arg}).`, detail: "" }));
    frames.push(snap(code, 2, stack, { description: `Check base case: n=${arg} < 2 ?`, detail: arg < 2 ? "Yes — return n." : "No — recurse twice." }));
    if (arg < 2) {
      f.status = "returning";
      f.returnValue = arg;
      frames.push(snap(code, 2, stack, { description: `Base case. Return ${arg}.`, detail: "" }));
      stack.pop();
      return arg;
    }
    f.status = "waiting";
    frames.push(snap(code, 3, stack, { description: `Recurse left: fib(${arg - 1}).`, detail: "" }));
    const a = rec(arg - 1);
    f.locals.a = a;
    frames.push(snap(code, 3, stack, { description: `Left returned a = ${a}.`, detail: "" }));
    frames.push(snap(code, 4, stack, { description: `Recurse right: fib(${arg - 2}).`, detail: "" }));
    const b = rec(arg - 2);
    f.locals.b = b;
    frames.push(snap(code, 4, stack, { description: `Right returned b = ${b}.`, detail: "" }));
    const result = a + b;
    f.status = "returning";
    f.returnValue = result;
    frames.push(snap(code, 5, stack, { description: `Return a + b = ${a} + ${b} = ${result}.`, detail: "" }));
    stack.pop();
    return result;
  }

  rec(n);
  return frames;
}

// ── sumToN(n) = n + sumToN(n-1), base case n == 0 ───────────────────────────
function buildSumToNFrames(n) {
  _frameCounter = 0;
  const code = `static int sumToN(int n) {
  if (n == 0) return 0;          // base case
  return n + sumToN(n - 1);      // tail-ish recursion
}`;
  const frames = [];
  const stack = [];

  function rec(arg) {
    const f = frame(`sumToN(${arg})`, { n: arg }, "active");
    stack.push(f);
    frames.push(snap(code, 1, stack, { description: `Call sumToN(${arg}).`, detail: "" }));
    frames.push(snap(code, 2, stack, { description: `Check base case: n=${arg} == 0 ?`, detail: arg === 0 ? "Yes — return 0." : "No — recurse." }));
    if (arg === 0) {
      f.status = "returning";
      f.returnValue = 0;
      frames.push(snap(code, 2, stack, { description: `Base case. Return 0.`, detail: "" }));
      stack.pop();
      return 0;
    }
    f.status = "waiting";
    frames.push(snap(code, 3, stack, { description: `Recurse: sumToN(${arg - 1}).`, detail: "" }));
    const sub = rec(arg - 1);
    f.locals.sub = sub;
    const result = arg + sub;
    f.status = "returning";
    f.returnValue = result;
    frames.push(snap(code, 3, stack, { description: `Return n + sub = ${arg} + ${sub} = ${result}.`, detail: "" }));
    stack.pop();
    return result;
  }

  rec(n);
  return frames;
}

const DEMOS = {
  factorial: { label: "factorial(n)",  build: buildFactorialFrames, defaultN: 4, range: [1, 6] },
  fibonacci: { label: "fibonacci(n)",  build: buildFibonacciFrames, defaultN: 4, range: [0, 6] },
  sumToN:    { label: "sumToN(n)",     build: buildSumToNFrames,    defaultN: 4, range: [0, 8] },
};

export const DEMO_IDS = Object.keys(DEMOS);
export const DEMO_LABELS = Object.fromEntries(Object.entries(DEMOS).map(([k, v]) => [k, v.label]));
export const DEMO_DEFAULTS = Object.fromEntries(Object.entries(DEMOS).map(([k, v]) => [k, v.defaultN]));
export const DEMO_RANGES = Object.fromEntries(Object.entries(DEMOS).map(([k, v]) => [k, v.range]));

export function generateRecursionSteps(demoId, n) {
  const demo = DEMOS[demoId] || DEMOS.factorial;
  const [min, max] = demo.range;
  const safeN = Math.max(min, Math.min(max, Math.floor(Number(n)) || demo.defaultN));
  return demo.build(safeN);
}
