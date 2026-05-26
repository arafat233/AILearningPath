/**
 * MatrixSearchSandbox — staircase search on row+col-sorted matrix. M39-T4.
 */
import { useCallback, useRef, useState } from "react";
import GridVisualizer from "../GridVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { MATRIX_SEARCH_CODE, DEMO_MATRIX, generateMatrixSearchSteps } from "../algorithms/matrixSearch.js";

function parseMatrix(text) {
  return text.split("\n").map((line) =>
    line.trim().split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n))
  ).filter((row) => row.length > 0);
}

export default function MatrixSearchSandbox() {
  const [matrixInput, setMatrixInput] = useState(DEMO_MATRIX.map((r) => r.join(", ")).join("\n"));
  const [targetInput, setTargetInput] = useState("16");
  const [speed, setSpeed] = useState(700);
  const [frames, setFrames] = useState(() => generateMatrixSearchSteps(DEMO_MATRIX, 16));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const m = parseMatrix(matrixInput);
    const t = Number(targetInput);
    if (m.length === 0 || !Number.isFinite(t)) return;
    setFrames(generateMatrixSearchSteps(m, t));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [matrixInput, targetInput]);

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

  const visitedSet = new Set((frame.visited || []).map(([r, c]) => `${r},${c}`));

  const cellState = (r, c) => {
    if (frame.foundAt && frame.foundAt[0] === r && frame.foundAt[1] === c) return "found";
    if (frame.curRow === r && frame.curCol === c) return "compare";
    if (visitedSet.has(`${r},${c}`)) return "path";
    // Cells eliminated by the staircase walk: anything below curRow in eliminated cols, etc.
    // Simpler: dim cells in fully-eliminated columns (c > curCol) and rows (r < curRow before move).
    return "default";
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">target</label>
        <input value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-20" />
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="space-y-3">
          <GridVisualizer grid={frame.matrix} cellState={cellState} currentCell={frame.curRow >= 0 ? [frame.curRow, frame.curCol] : null} cellSize={44} />
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">cursor</div>
            <div className="font-mono text-[13px] text-amber-300">{frame.curRow >= 0 ? `(${frame.curRow}, ${frame.curCol}) = ${frame.matrix[frame.curRow][frame.curCol]}` : <span className="text-[#555] italic">walked off</span>}</div>
          </div>
        </div>
        <div className="space-y-3">
          <textarea value={matrixInput} onChange={(e) => setMatrixInput(e.target.value)} className="w-full h-40 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[12px] text-white font-mono" />
          <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto h-[260px]"><code>{MATRIX_SEARCH_CODE}</code></pre>
        </div>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}{frame.foundAt ? ` · found at (${frame.foundAt[0]}, ${frame.foundAt[1]})` : ""}</div>
    </div>
  );
}
