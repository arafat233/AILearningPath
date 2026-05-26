/**
 * LCSGridSandbox — DP grid filling for LCS. M31-T5.
 */
import { useCallback, useRef, useState } from "react";
import DPGridVisualizer from "../DPGridVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { LCS_CODE, LINE_BY_PHASE, generateLCSSteps } from "../algorithms/lcs.js";

const DEFAULT_S1 = "abcbdab";
const DEFAULT_S2 = "bdcaba";

export default function LCSGridSandbox() {
  const [s1, setS1] = useState(DEFAULT_S1);
  const [s2, setS2] = useState(DEFAULT_S2);
  const [speed, setSpeed] = useState(400);
  const [frames, setFrames] = useState(() => generateLCSSteps(DEFAULT_S1, DEFAULT_S2));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    if (!s1 || !s2) return;
    setFrames(generateLCSSteps(s1, s2));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [s1, s2]);

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
        <label className="text-xs text-zinc-400">s1 (rows)</label>
        <input value={s1} onChange={(e) => setS1(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-36 font-mono" />
        <label className="text-xs text-zinc-400">s2 (cols)</label>
        <input value={s2} onChange={(e) => setS2(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-36 font-mono" />
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
          <input type="range" min={100} max={1500} step={50} value={1500 - speed + 100} onChange={(e) => setSpeed(1500 - Number(e.target.value) + 100)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <DPGridVisualizer
          grid={frame.grid}
          rowHeader={s1}
          colHeader={s2}
          current={frame.current}
          deps={frame.deps}
          path={frame.path}
          match={frame.match}
        />
        <HighlightedCode code={LCS_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="420px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}{frame.result != null ? ` · LCS: "${frame.result}"` : ""}</div>
    </div>
  );
}
