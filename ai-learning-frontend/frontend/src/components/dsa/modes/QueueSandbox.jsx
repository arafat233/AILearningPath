/**
 * QueueSandbox — interactive FIFO queue. M33-T3.
 *
 * Direct manipulation (like StackSandbox). The FRONT and BACK labels
 * make the FIFO direction obvious — that's the whole teaching moment
 * separating queue from stack.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExplanationPanel from "../ExplanationPanel.jsx";

let _id = 0;
const uid = () => `q${_id++}`;

const QUEUE_CODE = `// Queue with enqueue / dequeue / peek
class Queue<T> {
  private Deque<T> data = new ArrayDeque<>();

  public void enqueue(T x) {
    data.addLast(x);                  // append to BACK
  }

  public T dequeue() {
    if (data.isEmpty()) throw new NoSuchElementException();
    return data.pollFirst();          // remove from FRONT
  }

  public T peek() {
    if (data.isEmpty()) throw new NoSuchElementException();
    return data.peekFirst();          // look at FRONT
  }
}`;

const ITEM_STYLE = {
  default: "bg-[#1a1a1a] border-[#2a2a2a] text-[#ccc]",
  active:  "bg-amber-500/15 border-amber-500 text-amber-300",
  new:     "bg-[#00c896]/15 border-[#00c896] text-[#00c896]",
  removing: "bg-red-500/15 border-red-500 text-red-300",
};

export default function QueueSandbox() {
  const [items, setItems] = useState([
    { id: uid(), value: 4,  state: "default" },
    { id: uid(), value: 12, state: "default" },
    { id: uid(), value: 7,  state: "default" },
  ]);
  const [value, setValue] = useState("");
  const [explanation, setExplanation] = useState(
    "Queue is FIFO: enqueue at the BACK, dequeue from the FRONT."
  );

  const enqueue = () => {
    const v = value.trim();
    if (!v) return;
    if (items.length >= 8) {
      setExplanation("Queue is full (demo cap 8). Dequeue something first.");
      return;
    }
    const newItem = { id: uid(), value: isNaN(Number(v)) ? v : Number(v), state: "new" };
    setItems((prev) => [...prev, newItem]);
    setExplanation(`enqueue(${newItem.value}) — appended to BACK. size = ${items.length + 1}.`);
    setValue("");
    setTimeout(() => {
      setItems((prev) => prev.map((it) => (it.id === newItem.id ? { ...it, state: "default" } : it)));
    }, 400);
  };

  const dequeue = () => {
    if (items.length === 0) {
      setExplanation("Queue is empty — dequeue() would throw.");
      return;
    }
    const front = items[0];
    setItems((prev) => prev.map((it, i) => (i === 0 ? { ...it, state: "removing" } : it)));
    setExplanation(`dequeue() — removed ${front.value} from FRONT. Returns ${front.value}.`);
    setTimeout(() => setItems((prev) => prev.slice(1)), 300);
  };

  const peek = () => {
    if (items.length === 0) {
      setExplanation("Queue is empty — peek() would throw.");
      return;
    }
    const front = items[0];
    setItems((prev) => prev.map((it, i) => (i === 0 ? { ...it, state: "active" } : it)));
    setExplanation(`peek() — returns ${front.value} without removing.`);
    setTimeout(() => setItems((prev) => prev.map((it) => ({ ...it, state: "default" }))), 700);
  };

  const reset = () => {
    setItems([
      { id: uid(), value: 4,  state: "default" },
      { id: uid(), value: 12, state: "default" },
      { id: uid(), value: 7,  state: "default" },
    ]);
    setExplanation("Queue reset to initial state.");
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enqueue()}
          placeholder="value"
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-32"
        />
        <button onClick={enqueue} className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">Enqueue</button>
        <button onClick={dequeue} className="px-4 py-2 bg-red-700    hover:bg-red-600    rounded-lg text-sm font-medium text-white transition">Dequeue</button>
        <button onClick={peek}    className="px-4 py-2 bg-blue-700   hover:bg-blue-600   rounded-lg text-sm font-medium text-white transition">Peek</button>
        <button onClick={reset}   className="px-4 py-2 bg-zinc-700   hover:bg-zinc-600   rounded-lg text-sm font-medium text-white transition">Reset</button>
        <span className="text-xs text-zinc-500 ml-auto">size: <span className="font-mono text-zinc-300">{items.length}</span></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        {/* Queue render (horizontal) */}
        <div className="w-full p-6 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
          <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-widest text-[#555]">
            <span className="text-blue-400">front (dequeue here)</span>
            <span className="text-amber-400">back (enqueue here)</span>
          </div>
          <div className="flex items-center gap-1.5 min-h-[60px] overflow-x-auto">
            <span className="text-[10px] text-blue-400 font-bold font-mono mr-1 shrink-0">← out</span>
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <div className="text-[#444] italic text-[12px]">empty</div>
              ) : items.map((it) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, scale: 0.8, x: 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -40 }}
                  transition={{ duration: 0.25 }}
                  className={`w-16 h-12 flex items-center justify-center font-bold font-mono text-[15px] border-2 rounded-lg ${ITEM_STYLE[it.state] || ITEM_STYLE.default}`}
                >
                  {it.value}
                </motion.div>
              ))}
            </AnimatePresence>
            <span className="text-[10px] text-amber-400 font-bold font-mono ml-1 shrink-0">in ←</span>
          </div>
        </div>
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[300px]"><code>{QUEUE_CODE}</code></pre>
      </div>

      <ExplanationPanel text={explanation} />
    </div>
  );
}
