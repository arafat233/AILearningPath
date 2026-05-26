/**
 * PrefixSumsSandbox — build prefix array then animate range queries. M30-T3.
 */
import { useCallback, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { PREFIX_SUMS_CODE, LINE_BY_PHASE, generatePrefixSumsSteps } from "../algorithms/prefixSums.js";

const DEFAULT_ARR = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
const DEFAULT_L = 2;
const DEFAULT_R = 6;

export default function PrefixSumsSandbox() {
  const [arrInput, setArrInput] = useState(DEFAULT_ARR.join(", "));
  const [lInput, setLInput]     = useState(String(DEFAULT_L));
  const [rInput, setRInput]     = useState(String(DEFAULT_R));
  const [speed, setSpeed]       = useState(700);
  const [frames, setFrames]     = useState(() => generatePrefixSumsSteps(DEFAULT_ARR, DEFAULT_L, DEFAULT_R));
  const [idx, setIdx]           = useState(0);
  const [playing, setPlaying]   = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const arr = arrInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    const L = Number(lInput);
    const R = Number(rInput);
    if (arr.length === 0) return;
    setFrames(generatePrefixSumsSteps(arr, Number.isFinite(L) ? L : -1, Number.isFinite(R) ? R : -1));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [arrInput, lInput, rInput]);

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

  const arrCells = frame.arr.map((v, i) => ({
    value: v,
    state: i === frame.arrActive ? "compare" : (frame.queryL >= 0 && i >= frame.queryL && i <= frame.queryR) ? "active" : "default",
  }));
  const prefixCells = frame.prefix.map((v, i) => ({
    value: v,
    state: i === frame.prefixActive ? "compare"
         : frame.queryHighlight && frame.queryHighlight.includes(i) ? "found"
         : "default",
  }));

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">array</label>
        <input value={arrInput} onChange={(e) => setArrInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-72" />
        <label className="text-xs text-zinc-400">query L</label>
        <input value={lInput} onChange={(e) => setLInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16" />
        <label className="text-xs text-zinc-400">R</label>
        <input value={rInput} onChange={(e) => setRInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16" />
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
          <ArrayVisualizer cells={arrCells}    title="arr (original)" />
          <ArrayVisualizer cells={prefixCells} title="prefix (one larger than arr — prefix[0] = 0)" />
          {frame.queryResult != null && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1">range sum</div>
              <div className="font-mono text-[18px] text-emerald-300">arr[{frame.queryL}..{frame.queryR}] = {frame.queryResult}</div>
            </div>
          )}
        </div>
        <HighlightedCode code={PREFIX_SUMS_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="420px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
