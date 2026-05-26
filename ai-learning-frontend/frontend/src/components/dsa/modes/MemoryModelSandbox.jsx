/**
 * MemoryModelSandbox — Java stack/heap memory visualization. M4-T1 wire-up.
 * D1.1 from the log2base2 parity checklist.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import JVMMemoryVisualizer from "../JVMMemoryVisualizer.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { DEMO_IDS, DEMO_LABELS, generateMemoryModelSteps } from "../algorithms/memoryModel.js";

export default function MemoryModelSandbox() {
  const [demoId, setDemoId] = useState(DEMO_IDS[0]);
  const [speed, setSpeed]   = useState(900);
  const [frames, setFrames] = useState(() => generateMemoryModelSteps(DEMO_IDS[0]));
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  useEffect(() => {
    setFrames(generateMemoryModelSteps(demoId));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [demoId]);

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
        <select value={demoId} onChange={(e) => setDemoId(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
          {DEMO_IDS.map((id) => <option key={id} value={id}>{DEMO_LABELS[id]}</option>)}
        </select>
        <div className="w-px h-6 bg-zinc-700" />
        {!playing
          ? <button onClick={play} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium text-white transition">▶ Play</button>
          : <button onClick={stop} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>}
        <button onClick={back} disabled={idx === 0} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step} disabled={idx >= frames.length - 1} className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition">Reset</button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input type="range" min={200} max={2000} step={50} value={2000 - speed + 200} onChange={(e) => setSpeed(2000 - Number(e.target.value) + 200)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <JVMMemoryVisualizer stackFrames={frame.stackFrames} heap={frame.heap} highlight={frame.highlight} />
        <HighlightedCode code={frame.code} activeLine={frame.activeLine} title="java" height="380px" />
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
