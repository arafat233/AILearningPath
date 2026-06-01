/**
 * BitwiseSandbox — interactive 8-bit bitwise operation visualizer.
 * Registered in VisualizerShell as kind: "bitwise".
 */
import { useState, useEffect, useRef } from "react";
import { generateBitwiseSteps, OPERATIONS, CODE } from "../algorithms/bitwise.js";
import BitwiseVisualizer from "../visualizers/BitwiseVisualizer.jsx";
import HighlightedCode from "../HighlightedCode.jsx";

const PRESETS = [
  { label: "5 AND 3",   a: 5,   b: 3,   op: "AND"    },
  { label: "5 OR 3",    a: 5,   b: 3,   op: "OR"     },
  { label: "5 XOR 3",   a: 5,   b: 3,   op: "XOR"    },
  { label: "12 AND 10", a: 12,  b: 10,  op: "AND"    },
  { label: "NOT 170",   a: 170, b: 0,   op: "NOT_A"  },
  { label: "6 << 1",    a: 6,   b: 0,   op: "LSHIFT" },
  { label: "12 >> 1",   a: 12,  b: 0,   op: "RSHIFT" },
];

export default function BitwiseSandbox() {
  const [a,      setA]      = useState(5);
  const [b,      setB]      = useState(3);
  const [op,     setOp]     = useState("AND");
  const [frames, setFrames] = useState([]);
  const [idx,    setIdx]    = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const f = generateBitwiseSteps(a, b, op);
    setFrames(f);
    setIdx(0);
    setPlaying(false);
  }, [a, b, op]);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setIdx(i => {
          if (i >= frames.length - 1) { setPlaying(false); return i; }
          return i + 1;
        });
      }, 500);
    }
    return () => clearInterval(timer.current);
  }, [playing, frames.length]);

  const frame = frames[idx];
  const needsB = !["LSHIFT","RSHIFT","NOT_A"].includes(op);

  const applyPreset = (p) => { setA(p.a); setB(p.b); setOp(p.op); };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Value A */}
        <div>
          <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 block mb-1">Value A (0–255)</label>
          <input
            type="number" min={0} max={255} value={a}
            onChange={e => setA(Math.max(0, Math.min(255, +e.target.value || 0)))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-[13px] font-mono text-zinc-200 outline-none focus:border-blue-500"
          />
        </div>
        {/* Operation */}
        <div>
          <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 block mb-1">Operation</label>
          <select
            value={op} onChange={e => setOp(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-[13px] font-mono text-zinc-200 outline-none focus:border-blue-500"
          >
            {OPERATIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
        {/* Value B */}
        <div>
          <label className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 block mb-1">Value B (0–255)</label>
          <input
            type="number" min={0} max={255} value={b} disabled={!needsB}
            onChange={e => setB(Math.max(0, Math.min(255, +e.target.value || 0)))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-[13px] font-mono text-zinc-200 outline-none focus:border-blue-500 disabled:opacity-30"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)}
            className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
              a===p.a && b===p.b && op===p.op
                ? "bg-blue-900/60 border-blue-500 text-blue-200"
                : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Visualizer */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl min-h-[200px]">
        <BitwiseVisualizer frame={frame} />
      </div>

      {/* Step controls */}
      <div className="flex items-center gap-2">
        <button onClick={() => { setPlaying(false); setIdx(0); }}
          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-[12px] text-zinc-300 hover:border-zinc-500">
          ⏮
        </button>
        <button onClick={() => setIdx(i => Math.max(0, i - 1))}
          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-[12px] text-zinc-300 hover:border-zinc-500">
          ◀
        </button>
        <button onClick={() => setPlaying(p => !p)}
          className="px-4 py-1.5 bg-blue-700 hover:bg-blue-600 border border-blue-500 rounded text-[12px] text-white font-semibold min-w-[64px]">
          {playing ? "⏸" : "▶ Play"}
        </button>
        <button onClick={() => setIdx(i => Math.min(frames.length - 1, i + 1))}
          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-[12px] text-zinc-300 hover:border-zinc-500">
          ▶
        </button>
        <button onClick={() => { setPlaying(false); setIdx(frames.length - 1); }}
          className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded text-[12px] text-zinc-300 hover:border-zinc-500">
          ⏭
        </button>
        <span className="text-[11px] text-zinc-500 ml-2">
          step {idx + 1} / {frames.length}
        </span>
      </div>

      {/* Code */}
      <div>
        <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 mb-1">Java</p>
        <HighlightedCode
          code={`// a = ${a}, b = ${b}\n${CODE[op] || ""}`}
          language="java"
          activeLine={0}
        />
      </div>
    </div>
  );
}
