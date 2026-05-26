/**
 * RotatedSearchSandbox — binary search on a rotated sorted array. M39-T3.
 */
import { useCallback, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { ROTATED_SEARCH_CODE, LINE_BY_PHASE, generateRotatedSearchSteps } from "../algorithms/rotatedSearch.js";

const DEFAULT_ARR = [12, 15, 18, 22, 3, 5, 7, 9];   // sorted then rotated
const DEFAULT_TARGET = 5;

export default function RotatedSearchSandbox() {
  const [arrInput, setArrInput] = useState(DEFAULT_ARR.join(", "));
  const [targetInput, setTargetInput] = useState(String(DEFAULT_TARGET));
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generateRotatedSearchSteps(DEFAULT_ARR, DEFAULT_TARGET));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const arr = arrInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    const t = Number(targetInput);
    if (arr.length === 0 || !Number.isFinite(t)) return;
    setFrames(generateRotatedSearchSteps(arr, t));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [arrInput, targetInput]);

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

  const cells = frame.arr.map((v, i) => {
    if (i === frame.foundIdx) return { value: v, state: "found" };
    if (i === frame.mid) return { value: v, state: "compare" };
    if (frame.halfSorted === "left"  && i >= frame.L && i <= frame.mid) return { value: v, state: "active" };
    if (frame.halfSorted === "right" && i >= frame.mid && i <= frame.R) return { value: v, state: "active" };
    if (i >= frame.L && i <= frame.R) return { value: v, state: "default" };
    return { value: v, state: "default" };
  });

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">rotated array</label>
        <input value={arrInput} onChange={(e) => setArrInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-72" />
        <label className="text-xs text-zinc-400">target</label>
        <input value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-20" />
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
          <ArrayVisualizer
            cells={cells}
            pointers={{
              ...(frame.L >= 0 && frame.L <= frame.arr.length - 1 ? { L: frame.L } : {}),
              ...(frame.R >= 0 && frame.R <= frame.arr.length - 1 ? { R: frame.R } : {}),
              ...(frame.mid >= 0 ? { mid: frame.mid } : {}),
            }}
          />
          {frame.halfSorted && (
            <div className={`inline-block px-3 py-1.5 rounded text-[11px] font-mono ${frame.halfSorted === "left" ? "bg-blue-500/10 border border-blue-500/40 text-blue-300" : "bg-purple-500/10 border border-purple-500/40 text-purple-300"}`}>
              {frame.halfSorted} half is sorted
            </div>
          )}
        </div>
        <HighlightedCode code={ROTATED_SEARCH_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="360px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}{frame.foundIdx != null && frame.foundIdx >= 0 ? ` · found at idx ${frame.foundIdx}` : frame.foundIdx === -1 ? " · not found" : ""}</div>
    </div>
  );
}
