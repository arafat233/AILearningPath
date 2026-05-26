/**
 * HashDedupSandbox — Dedup an array via HashSet (preserve order). M34-T3.
 */
import { useCallback, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { HASH_DEDUP_CODE, LINE_BY_PHASE, DEMO_DEDUP, generateDedupSteps } from "../algorithms/hashDedup.js";

export default function HashDedupSandbox() {
  const [arrInput, setArrInput] = useState(DEMO_DEDUP.join(", "));
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generateDedupSteps(DEMO_DEDUP));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const arr = arrInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    if (arr.length === 0) return;
    setFrames(generateDedupSteps(arr));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [arrInput]);

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

  const inputCells = frame.input.map((v, i) => {
    if (i === frame.currentIdx) {
      if (frame.decision === "kept") return { value: v, state: "found" };
      if (frame.decision === "duplicate") return { value: v, state: "not-found" };
      return { value: v, state: "compare" };
    }
    if (i < frame.currentIdx) return { value: v, state: "sorted" };
    return { value: v, state: "default" };
  });

  const outputCells = frame.output.map((v) => ({ value: v, state: "found" }));

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">array (numbers)</label>
        <input value={arrInput} onChange={(e) => setArrInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-96" />
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

      <ArrayVisualizer cells={inputCells} title="input (compare=current, found=kept, not-found=duplicate skipped, sorted=processed)" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="space-y-3">
          <div className="w-full p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-xl">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">HashSet contents</div>
            <div className="flex flex-wrap gap-1.5">
              {frame.setValues.length === 0
                ? <span className="text-[#444] italic text-[12px]">empty</span>
                : frame.setValues.map((v, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-500/15 border border-purple-500/40 rounded text-[12px] font-mono text-purple-300">{v}</span>
                ))}
            </div>
            <div className="mt-2 text-[10px] text-zinc-500 font-mono">size = {frame.setValues.length}</div>
          </div>
          {outputCells.length > 0 && <ArrayVisualizer cells={outputCells} title="output (deduped)" />}
        </div>
        <HighlightedCode code={HASH_DEDUP_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="280px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
