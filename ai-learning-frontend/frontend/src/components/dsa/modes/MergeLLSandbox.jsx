/**
 * MergeLLSandbox — merge two sorted linked lists with two pointers. M32-T5.
 */
import { useCallback, useRef, useState } from "react";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { MERGE_LL_CODE, generateMergeLLSteps } from "../algorithms/mergeLL.js";

const cellBase = "w-12 h-10 flex items-center justify-center text-[13px] font-mono font-bold border-2 rounded";
function cellClass(state) {
  if (state === "active")   return "bg-amber-500/20 border-amber-500 text-amber-300";
  if (state === "consumed") return "bg-zinc-900 border-zinc-800 text-zinc-600";
  if (state === "next")     return "bg-blue-500/15 border-blue-500 text-blue-300";
  if (state === "new")      return "bg-[#00c896]/15 border-[#00c896] text-[#00c896]";
  return "bg-zinc-800 border-zinc-700 text-zinc-200";
}

const DEFAULT_A = [1, 4, 7, 9];
const DEFAULT_B = [2, 3, 8, 10, 11];

export default function MergeLLSandbox() {
  const [aInput, setAInput] = useState(DEFAULT_A.join(", "));
  const [bInput, setBInput] = useState(DEFAULT_B.join(", "));
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generateMergeLLSteps(DEFAULT_A, DEFAULT_B));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const a = aInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    const b = bInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    if (a.length === 0 || b.length === 0) return;
    setFrames(generateMergeLLSteps(a, b));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [aInput, bInput]);

  const play = useCallback(async () => {
    if (playing) return;
    setPlaying(true); stoppedRef.current = false;
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

  const stateForA = (i) => {
    if (frame.ptrA === -1 && i < frame.listA.length) return "consumed";
    if (i < frame.ptrA) return "consumed";
    if (i === frame.ptrA && frame.phase === "compare") return "active";
    if (i === frame.ptrA && (frame.phase === "pick-A" || frame.phase === "flush-A")) return "active";
    if (i === frame.ptrA) return "next";
    return "default";
  };
  const stateForB = (i) => {
    if (frame.ptrB === -1 && i < frame.listB.length) return "consumed";
    if (i < frame.ptrB) return "consumed";
    if (i === frame.ptrB && frame.phase === "compare") return "active";
    if (i === frame.ptrB && (frame.phase === "pick-B" || frame.phase === "flush-B")) return "active";
    if (i === frame.ptrB) return "next";
    return "default";
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">list A (sorted)</label>
        <input value={aInput} onChange={(e) => setAInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-56" />
        <label className="text-xs text-zinc-400">list B (sorted)</label>
        <input value={bInput} onChange={(e) => setBInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-56" />
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>
        <div className="w-px h-6 bg-zinc-700" />
        {!playing
          ? <button onClick={play} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition">▶ Play</button>
          : <button onClick={stop} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>}
        <button onClick={back} disabled={idx === 0} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step} disabled={idx >= frames.length - 1} className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition">Reset</button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input type="range" min={150} max={1500} step={50} value={1500 - speed + 150} onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="space-y-3">
          <div className="w-full p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 w-10 shrink-0">A:</span>
              <div className="flex gap-1.5">
                {frame.listA.map((v, i) => <div key={i} className={`${cellBase} ${cellClass(stateForA(i))}`}>{v}</div>)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 w-10 shrink-0">B:</span>
              <div className="flex gap-1.5">
                {frame.listB.map((v, i) => <div key={i} className={`${cellBase} ${cellClass(stateForB(i))}`}>{v}</div>)}
              </div>
            </div>
          </div>
          <div className="w-full p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">merged</div>
            <div className="flex gap-1.5">
              {frame.merged.length === 0
                ? <span className="text-[#555] italic text-[12px]">empty</span>
                : frame.merged.map((v, i) => <div key={i} className={`${cellBase} ${cellClass(i === frame.merged.length - 1 ? "new" : "consumed")}`}>{v}</div>)}
            </div>
          </div>
        </div>
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto h-[320px]"><code>{MERGE_LL_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
