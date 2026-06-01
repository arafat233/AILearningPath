/**
 * RecursionTreeSandbox — recursion-tree wire-up for M40 Backtracking + M41 DP.
 * I1 from the Phase 3 visualizer list.
 *
 * Shows the recursion as a growing tree: naive fib (exponential blow-up),
 * memoised fib (memo-hit leaves collapse it), and subsets (backtracking
 * decision tree). The memo-hit + pruned states are the teaching moment.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import RecursionTreeVisualizer from "../RecursionTreeVisualizer.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import {
  DEMO_IDS, DEMO_LABELS, DEMO_DEFAULTS, DEMO_RANGES, generateRecursionTreeSteps,
} from "../algorithms/recursionTree.js";

const LEGEND = [
  { state: "active",    label: "calling",   color: "#f59e0b" },
  { state: "returning", label: "returned",  color: "#00c896" },
  { state: "memo-hit",  label: "memo hit",  color: "#22d3ee" },
];

export default function RecursionTreeSandbox({ config = {} }) {
  // Topic wiring may request an opening demo (M40 → subsets, M41 → fib_memo).
  const initialDemo = DEMO_IDS.includes(config.defaultDemo) ? config.defaultDemo : DEMO_IDS[0];
  const [demoId, setDemoId] = useState(initialDemo);
  const [nInput, setNInput] = useState(String(DEMO_DEFAULTS[initialDemo]));
  const [speed, setSpeed]   = useState(650);
  const [frames, setFrames] = useState(() => generateRecursionTreeSteps(initialDemo, DEMO_DEFAULTS[initialDemo]));
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];
  const [lo, hi] = DEMO_RANGES[demoId];

  useEffect(() => {
    const def = DEMO_DEFAULTS[demoId];
    setNInput(String(def));
    setFrames(generateRecursionTreeSteps(demoId, def));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [demoId]);

  const rebuild = useCallback(() => {
    setFrames(generateRecursionTreeSteps(demoId, Number(nInput)));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [demoId, nInput]);

  const play = useCallback(async () => {
    if (playing) return;
    setPlaying(true); stoppedRef.current = false;
    let i = idx >= frames.length - 1 ? 0 : idx;
    for (; i < frames.length; i++) {
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

  const isSubsets = demoId === "subsets";

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <select value={demoId} onChange={(e) => setDemoId(e.target.value)}
                className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
          {DEMO_IDS.map((id) => <option key={id} value={id}>{DEMO_LABELS[id]}</option>)}
        </select>
        <label className="text-xs text-zinc-400">{isSubsets ? "set size" : "n"}</label>
        <input value={nInput} onChange={(e) => setNInput(e.target.value)}
               className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16" />
        <span className="text-[10px] text-zinc-500">({lo}–{hi})</span>
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition">Apply</button>
        <div className="w-px h-6 bg-zinc-700" />
        {!playing
          ? <button onClick={play}  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition">▶ Play</button>
          : <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium transition">⏸ Pause</button>}
        <button onClick={back} disabled={idx === 0} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 rounded-lg text-sm transition">◀</button>
        <button onClick={step} disabled={idx >= frames.length - 1} className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm transition">Step ▶</button>
        <button onClick={reset} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition">Reset</button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input type="range" min={150} max={1500} step={50} value={1500 - speed + 150}
                 onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)} className="w-24 accent-blue-500" />
        </div>
      </div>

      {/* Legend + live stats */}
      <div className="flex flex-wrap items-center gap-4 text-[11px]">
        {LEGEND.map((l) => (
          <span key={l.state} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: `${l.color}33`, border: `1.5px solid ${l.color}` }} />
            <span className="text-zinc-400">{l.label}</span>
          </span>
        ))}
        <span className="ml-auto font-mono text-zinc-500">
          calls: {frame.stats.calls}
          {frame.stats.memoHits > 0 && <span className="text-cyan-400"> · memo hits: {frame.stats.memoHits}</span>}
          {" · "}nodes: {frame.stats.treeSize}
        </span>
      </div>

      {/* Tree + code */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
        <RecursionTreeVisualizer frame={frame} />
        <HighlightedCode code={frame.code} activeLine={frame.activeLine} title="java" height="320px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
