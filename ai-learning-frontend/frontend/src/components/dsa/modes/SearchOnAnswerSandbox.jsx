/**
 * SearchOnAnswerSandbox — Koko-bananas binary search on the answer
 * space. M39-T2.
 */
import { useCallback, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { SEARCH_ON_ANSWER_CODE, LINE_BY_PHASE, DEMO_PILES, DEMO_H, generateSearchOnAnswerSteps } from "../algorithms/searchOnAnswer.js";

export default function SearchOnAnswerSandbox() {
  const [pilesInput, setPilesInput] = useState(DEMO_PILES.join(", "));
  const [hInput, setHInput] = useState(String(DEMO_H));
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generateSearchOnAnswerSteps(DEMO_PILES, DEMO_H));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const piles = pilesInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n) && n > 0);
    const H = Math.max(1, Math.floor(Number(hInput) || 1));
    if (piles.length === 0) return;
    setFrames(generateSearchOnAnswerSteps(piles, H));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [pilesInput, hInput]);

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

  // Render the SEARCH SPACE (speeds 1..max) as cells, with L/R/mid pointers.
  const maxSpeed = Math.max(...frame.piles);
  const speeds = Array.from({ length: maxSpeed }, (_, i) => i + 1);
  const cells = speeds.map((s) => ({
    value: s,
    state: s === frame.mid ? "compare"
         : s === frame.bestSoFar && frame.phase === "found" ? "found"
         : (s >= frame.L && s <= frame.R) ? "default"
         : "sorted",
  }));

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">piles</label>
        <input value={pilesInput} onChange={(e) => setPilesInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-56" />
        <label className="text-xs text-zinc-400">H (hours)</label>
        <input value={hInput} onChange={(e) => setHInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16" />
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

      <ArrayVisualizer
        cells={cells}
        pointers={{
          ...(frame.L > 0 ? { L: frame.L - 1 } : {}),
          ...(frame.R > 0 ? { R: frame.R - 1 } : {}),
          ...(frame.mid > 0 ? { mid: frame.mid - 1 } : {}),
        }}
        title="search space = candidate speeds (sorted = eliminated, compare = mid being tested)"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">piles · target H</div>
            <div className="font-mono text-[13px] text-zinc-200">piles = [{frame.piles.join(", ")}] · H = {frame.H}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">hours at mid</div>
              <div className="font-mono text-[16px] text-amber-300">{frame.mid > 0 ? frame.hoursAtMid : "—"}</div>
              {frame.predicate && <div className={`text-[11px] mt-1 ${frame.predicate === "ok" ? "text-emerald-400" : "text-red-400"}`}>{frame.predicate === "ok" ? "feasible ≤ H" : "too slow > H"}</div>}
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">best so far</div>
              <div className="font-mono text-[16px] text-emerald-300">{frame.bestSoFar != null ? frame.bestSoFar : "—"}</div>
            </div>
          </div>
        </div>
        <HighlightedCode code={SEARCH_ON_ANSWER_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="280px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
