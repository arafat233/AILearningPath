/**
 * MonotonicStackSandbox — Next Greater Element via monotonic stack.
 * M33-T2.
 */
import { useCallback, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import StackVisualizer from "../StackVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { NGE_CODE, generateNGESteps } from "../algorithms/monotonicStack.js";

const DEFAULT_ARR = [2, 1, 5, 6, 2, 3, 1, 4];

export default function MonotonicStackSandbox() {
  const [arrInput, setArrInput] = useState(DEFAULT_ARR.join(", "));
  const [speed, setSpeed]   = useState(700);
  const [frames, setFrames] = useState(() => generateNGESteps(DEFAULT_ARR));
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const arr = arrInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    if (arr.length === 0) return;
    setFrames(generateNGESteps(arr));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [arrInput]);

  const play = useCallback(async () => {
    if (playing) return;
    setPlaying(true);
    stoppedRef.current = false;
    for (let i = idx; i < frames.length; i++) {
      if (stoppedRef.current) break;
      setIdx(i);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, speed));
    }
    setPlaying(false);
  }, [playing, idx, frames, speed]);

  const stop  = () => { stoppedRef.current = true; setPlaying(false); };
  const step  = () => { if (idx < frames.length - 1) setIdx(idx + 1); };
  const back  = () => { if (idx > 0) setIdx(idx - 1); };
  const reset = () => { stoppedRef.current = true; setPlaying(false); setIdx(0); };

  // Array cells: current index highlighted, NGE-found cells marked sorted
  const cells = frame.array.map((v, i) => {
    if (i === frame.currentIdx) return { value: v, state: "compare" };
    if (frame.result[i] != null) return { value: v, state: "sorted" };
    if (frame.stackIndices.includes(i)) return { value: v, state: "active" };
    return { value: v, state: "default" };
  });

  // Stack: render the indexed values
  const stackItems = frame.stackIndices.map((i) => ({
    id: `idx${i}-${frame.currentIdx}`,
    value: `[${i}] ${frame.array[i]}`,
    state: i === frame.stackIndices[frame.stackIndices.length - 1] && frame.phase === "examine" ? "active" : "default",
  }));

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">array</label>
        <input value={arrInput} onChange={(e) => setArrInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-72" />
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>
        <div className="w-px h-6 bg-zinc-700" />
        {!playing ? (
          <button onClick={play}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">▶ Play</button>
        ) : (
          <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>
        )}
        <button onClick={back}  disabled={idx === 0}                  className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step}  disabled={idx >= frames.length - 1}   className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset}                                       className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  rounded-lg text-sm font-medium text-white transition">Reset</button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input type="range" min={150} max={1500} step={50} value={1500 - speed + 150} onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <ArrayVisualizer cells={cells} title="array (compare = current, active = waiting in stack, sorted = NGE found)" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="space-y-3">
          <StackVisualizer items={stackItems} maxSize={8} />
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">result (NGE values)</div>
            <div className="font-mono text-[13px] text-emerald-300">[{frame.result.map((v) => v == null ? "-1" : v).join(", ")}]</div>
          </div>
        </div>
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[340px]"><code>{NGE_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
