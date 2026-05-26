/**
 * LCASandbox — Lowest Common Ancestor recursion animation. M35-T2.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import TreeVisualizer from "../TreeVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import HighlightedCode from "../HighlightedCode.jsx";
import { LCA_CODE, LINE_BY_PHASE, generateLCASteps, buildLCADemoTree } from "../algorithms/lca.js";

export default function LCASandbox() {
  const tree = buildLCADemoTree();
  const [p, setP] = useState("2");
  const [q, setQ] = useState("10");
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generateLCASteps(tree, 2, 10));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const pn = Number(p), qn = Number(q);
    if (!Number.isFinite(pn) || !Number.isFinite(qn)) return;
    setFrames(generateLCASteps(buildLCADemoTree(), pn, qn));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [p, q]);

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
        <label className="text-xs text-zinc-400">p</label>
        <input value={p} onChange={(e) => setP(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16 font-mono" />
        <label className="text-xs text-zinc-400">q</label>
        <input value={q} onChange={(e) => setQ(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16 font-mono" />
        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>
        <span className="text-[11px] text-zinc-500 ml-3">demo tree values: 1, 2, 3, 4, 5, 7, 8, 9, 10</span>
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
        <TreeVisualizer root={frame.tree} width={560} height={340} />
        <HighlightedCode code={LCA_CODE} activeLine={LINE_BY_PHASE[frame.phase]} height="360px" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">call stack</div>
          <div className="font-mono text-[13px] text-amber-300">{frame.callStack.length === 0 ? <span className="text-[#555] italic">(none)</span> : frame.callStack.join(" → ")}</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">lca</div>
          <div className="font-mono text-[13px] text-emerald-300">{frame.lca != null ? frame.lca : <span className="text-[#555] italic">searching…</span>}</div>
        </div>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
