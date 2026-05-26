/**
 * StackSandbox — interactive LIFO stack demo.
 *
 * Used by M33-T1 (Stack Fundamentals). Unlike the binary-search / linked-list
 * modes (which replay pre-generated frames), this is a direct-manipulation
 * widget: the learner types a value, clicks Push / Pop / Peek, and the
 * StackVisualizer animates the change.
 */
import { useState } from "react";
import StackVisualizer from "../StackVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";

let _id = 0;
const uid = () => `s${_id++}`;

const STACK_CODE = `class Stack<T> {
  private List<T> data = new ArrayList<>();

  public void push(T x) {
    data.add(x);                  // append to top
  }

  public T pop() {
    if (data.isEmpty()) throw new EmptyStackException();
    return data.remove(data.size() - 1);
  }

  public T peek() {
    if (data.isEmpty()) throw new EmptyStackException();
    return data.get(data.size() - 1);
  }
}`;

export default function StackSandbox() {
  const [items, setItems] = useState([
    { id: uid(), value: 7,  state: "default" },
    { id: uid(), value: 12, state: "default" },
    { id: uid(), value: 4,  state: "default" },
  ]);
  const [value, setValue] = useState("");
  const [explanation, setExplanation] = useState(
    "Push adds to the top; Pop removes from the top. LIFO — last in, first out."
  );

  const push = () => {
    const v = value.trim();
    if (!v) return;
    if (items.length >= 8) {
      setExplanation("Stack is full (max 8 for this demo). Pop something first.");
      return;
    }
    const newItem = { id: uid(), value: isNaN(Number(v)) ? v : Number(v), state: "new" };
    setItems((prev) => [...prev, newItem]);
    setExplanation(`push(${newItem.value}) → added to top. size = ${items.length + 1}.`);
    setValue("");
    setTimeout(() => {
      setItems((prev) => prev.map((it) => (it.id === newItem.id ? { ...it, state: "default" } : it)));
    }, 400);
  };

  const pop = () => {
    if (items.length === 0) {
      setExplanation("Stack is empty — pop() would throw EmptyStackException.");
      return;
    }
    const top = items[items.length - 1];
    setItems((prev) => prev.map((it, i) => (i === prev.length - 1 ? { ...it, state: "popping" } : it)));
    setExplanation(`pop() → removed ${top.value} from top. Returns ${top.value}.`);
    setTimeout(() => {
      setItems((prev) => prev.slice(0, -1));
    }, 280);
  };

  const peek = () => {
    if (items.length === 0) {
      setExplanation("Stack is empty — peek() would throw EmptyStackException.");
      return;
    }
    const top = items[items.length - 1];
    setItems((prev) => prev.map((it, i) => (i === prev.length - 1 ? { ...it, state: "active" } : it)));
    setExplanation(`peek() → returns ${top.value} without removing it.`);
    setTimeout(() => {
      setItems((prev) => prev.map((it) => ({ ...it, state: "default" })));
    }, 700);
  };

  const reset = () => {
    setItems([
      { id: uid(), value: 7,  state: "default" },
      { id: uid(), value: 12, state: "default" },
      { id: uid(), value: 4,  state: "default" },
    ]);
    setExplanation("Stack reset to initial state [7, 12, 4] (4 is on top).");
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && push()}
          placeholder="value"
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-32"
        />
        <button onClick={push}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">Push</button>
        <button onClick={pop}   className="px-4 py-2 bg-red-700    hover:bg-red-600    rounded-lg text-sm font-medium text-white transition">Pop</button>
        <button onClick={peek}  className="px-4 py-2 bg-blue-700   hover:bg-blue-600   rounded-lg text-sm font-medium text-white transition">Peek</button>
        <button onClick={reset} className="px-4 py-2 bg-zinc-700   hover:bg-zinc-600   rounded-lg text-sm font-medium text-white transition">Reset</button>
        <span className="text-xs text-zinc-500 ml-auto">size: <span className="font-mono text-zinc-300">{items.length}</span></span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <StackVisualizer items={items} maxSize={8} />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[340px]"><code>{STACK_CODE}</code></pre>
      </div>

      <ExplanationPanel text={explanation} />
    </div>
  );
}
