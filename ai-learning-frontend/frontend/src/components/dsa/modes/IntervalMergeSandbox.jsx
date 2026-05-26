/**
 * IntervalMergeSandbox — sort-then-scan to merge overlapping intervals. M38-T3.
 */
import { useCallback, useRef, useState } from "react";
import IntervalVisualizer from "../IntervalVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { INTERVAL_MERGE_CODE, LINE_BY_PHASE, DEMO_INTERVALS, generateIntervalMergeSteps } from "../algorithms/intervalMerge.js";

function parseIntervals(text) {
  // Accept lines like "1, 3" or "1 3" — one interval per line.
  return text.split("\n")
    .map((line) => line.trim().split(/[,\s]+/).map((s) => Number(s.trim())).filter((n) => Number.isFinite(n)))
    .filter((arr) => arr.length === 2);
}

export default function IntervalMergeSandbox() {
  const [intervalsInput, setIntervalsInput] = useState(DEMO_INTERVALS.map((iv) => iv.join(", ")).join("\n"));
  const [speed, setSpeed] = useState(800);
  const [frames, setFrames] = useState(() => generateIntervalMergeSteps(DEMO_INTERVALS));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const ivs = parseIntervals(intervalsInput);
    if (ivs.length === 0) return;
    setFrames(generateIntervalMergeSteps(ivs));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [intervalsInput]);

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

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-[11px] text-zinc-500">intervals (one per line: <code>start, end</code>)</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <IntervalVisualizer intervals={frame.intervals} result={frame.result} activeIdx={frame.currentIdx} mergedWithLast={frame.mergedWithLast} />
        <div className="space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">edit intervals</div>
            <textarea value={intervalsInput} onChange={(e) => setIntervalsInput(e.target.value)} className="w-full h-40 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[12px] text-white font-mono" />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">phase</div>
            <div className="font-mono text-[14px] text-amber-300">{frame.phase}</div>
          </div>
        </div>
      </div>

      <HighlightedCode code={INTERVAL_MERGE_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="280px" />

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length} · result has {frame.result.length} interval{frame.result.length === 1 ? "" : "s"}</div>
    </div>
  );
}
