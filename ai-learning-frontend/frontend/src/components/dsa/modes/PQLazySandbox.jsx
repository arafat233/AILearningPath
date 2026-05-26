/**
 * PQLazySandbox — Priority Queue with lazy deletion. M36-T3.
 */
import { useCallback, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { PQ_LAZY_CODE, DEMO_INITIAL, DEMO_OPS, generatePQLazySteps } from "../algorithms/pqLazy.js";

function parseOps(text) {
  const ops = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    const parts = t.split(/\s+/);
    if (parts[0] === "offer"  && parts.length === 2) ops.push({ type: "offer",  value: Number(parts[1]) });
    if (parts[0] === "delete" && parts.length === 2) ops.push({ type: "delete", value: Number(parts[1]) });
    if (parts[0] === "poll"   && parts.length === 1) ops.push({ type: "poll" });
  }
  return ops;
}

export default function PQLazySandbox() {
  const [initialInput, setInitialInput] = useState(DEMO_INITIAL.join(", "));
  const [opsText, setOpsText] = useState(DEMO_OPS.map((o) => o.type === "poll" ? "poll" : `${o.type} ${o.value}`).join("\n"));
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generatePQLazySteps(DEMO_INITIAL, DEMO_OPS));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const init = initialInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    const ops = parseOps(opsText);
    setFrames(generatePQLazySteps(init, ops));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [initialInput, opsText]);

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

  const tombSet = new Set(frame.tombstoned);
  const cells = frame.heap.map((v, i) => ({
    value: v,
    state: frame.activeIndices.includes(i) ? "compare"
         : tombSet.has(v) ? "not-found"
         : "default",
  }));

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">initial heap</label>
        <input value={initialInput} onChange={(e) => setInitialInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-56" />
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

      <ArrayVisualizer cells={cells} title="min-heap (compare = active root, not-found = tombstoned but still physically present)" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">tombstoned values (lazy-deleted)</div>
            <div className="font-mono text-[13px] text-red-300">{frame.tombstoned.length === 0 ? <span className="text-[#555] italic">none</span> : `[${frame.tombstoned.join(", ")}]`}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">pending op</div>
            <div className="font-mono text-[13px] text-amber-300">{frame.pendingOp || <span className="text-[#555] italic">—</span>}</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">ops (one per line)</div>
          <textarea value={opsText} onChange={(e) => setOpsText(e.target.value)} className="w-full h-40 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[12px] text-white font-mono" />
        </div>
      </div>

      <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto max-h-[260px]"><code>{PQ_LAZY_CODE}</code></pre>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
