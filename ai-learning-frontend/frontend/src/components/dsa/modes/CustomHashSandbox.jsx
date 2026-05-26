/**
 * CustomHashSandbox — composite-key vs naive hash on 2D points. M34-T4.
 *
 * Side-by-side comparison: naive (row only) clumps badly; composite
 * (31 * row + col) distributes evenly.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import HashTableVisualizer from "../HashTableVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { CUSTOM_HASH_CODE, DEMO_POINTS, generateCustomHashSteps } from "../algorithms/customHash.js";

const MODES = [
  { id: "composite", label: "Composite hash (31·row + col)" },
  { id: "naive",     label: "Naive hash (row only)" },
];

export default function CustomHashSandbox() {
  const [mode, setMode] = useState("composite");
  const [capacity, setCapacity] = useState(7);
  const [speed, setSpeed] = useState(600);
  const [frames, setFrames] = useState(() => generateCustomHashSteps(DEMO_POINTS, 7, "composite"));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    setFrames(generateCustomHashSteps(DEMO_POINTS, capacity, mode));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [mode, capacity]);

  useEffect(() => { rebuild(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [mode, capacity]);

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

  // Convert custom-hash buckets (array of {row, col, value}[]) to
  // HashTableVisualizer's expected shape (array of {key, value}[]) by
  // composing key from (row, col).
  const buckets = frame.buckets.map((chain) =>
    chain ? chain.map((e) => ({ key: `(${e.row},${e.col})`, value: e.value, state: e.state })) : null
  );

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
          {MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
        </select>
        <label className="text-xs text-zinc-400">capacity</label>
        <input value={capacity} onChange={(e) => setCapacity(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16" />
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
        <HashTableVisualizer capacity={capacity} buckets={buckets} hashWork={frame.hashWork} />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto h-[420px]"><code>{CUSTOM_HASH_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length} · switch modes to compare collision counts</div>
    </div>
  );
}
