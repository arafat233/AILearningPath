/**
 * FloydCycleSandbox — tortoise & hare cycle detection. M32-T2, M32-T4.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import CycleListVisualizer from "../CycleListVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { FLOYD_CYCLE_CODE, generateFloydSteps } from "../algorithms/floydCycle.js";

const DEFAULT_VALUES = [3, 7, 2, 9, 5, 8, 4];
const DEFAULT_CYCLE  = 2;   // tail loops to index 2 (value 2)

const SCENARIOS = [
  { id: "with-cycle",  label: "With cycle (tail → idx 2)" },
  { id: "no-cycle",    label: "No cycle (clean list)" },
];

export default function FloydCycleSandbox() {
  const [scenarioId, setScenarioId] = useState("with-cycle");
  const [valuesInput, setValuesInput] = useState(DEFAULT_VALUES.join(", "));
  const [cycleIdxInput, setCycleIdxInput] = useState(String(DEFAULT_CYCLE));
  const [speed, setSpeed]   = useState(700);
  const [frames, setFrames] = useState(() => generateFloydSteps(DEFAULT_VALUES, DEFAULT_CYCLE));
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const values = valuesInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    if (values.length === 0) return;
    let cycleIdx;
    if (scenarioId === "no-cycle") {
      cycleIdx = null;
    } else {
      const raw = Number(cycleIdxInput);
      cycleIdx = Number.isFinite(raw) && raw >= 0 && raw < values.length ? raw : 0;
    }
    setFrames(generateFloydSteps(values, cycleIdx));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [scenarioId, valuesInput, cycleIdxInput]);

  useEffect(() => { rebuild(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [scenarioId]);

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

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={scenarioId} onChange={(e) => setScenarioId(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
          {SCENARIOS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <label className="text-xs text-zinc-400">values</label>
        <input value={valuesInput} onChange={(e) => setValuesInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-56" />
        {scenarioId === "with-cycle" && (
          <>
            <label className="text-xs text-zinc-400">cycle to idx</label>
            <input value={cycleIdxInput} onChange={(e) => setCycleIdxInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16" />
          </>
        )}
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <CycleListVisualizer
          nodes={frame.nodes}
          cycleEntryIdx={frame.cycleEntryIdx}
          slow={frame.slow}
          fast={frame.fast}
        />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[340px]"><code>{FLOYD_CYCLE_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
