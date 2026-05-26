/**
 * IslandsSandbox — BFS-based island counting on a 2D grid. M37-T2.
 */
import { useCallback, useRef, useState } from "react";
import GridVisualizer from "../GridVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { ISLANDS_CODE, DEMO_GRID, generateIslandsSteps } from "../algorithms/islands.js";

function parseGrid(text) {
  return text.split("\n")
    .map((line) => line.trim().split(/\s+/).filter(Boolean))
    .filter((row) => row.length > 0);
}

export default function IslandsSandbox() {
  const [gridInput, setGridInput] = useState(DEMO_GRID.map((row) => row.join(" ")).join("\n"));
  const [speed, setSpeed] = useState(450);
  const [frames, setFrames] = useState(() => generateIslandsSteps(DEMO_GRID));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const grid = parseGrid(gridInput);
    if (grid.length === 0) return;
    setFrames(generateIslandsSteps(grid));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [gridInput]);

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

  const queueSet = new Set((frame.queue || []).map(([r, c]) => `${r},${c}`));
  const currentIslandSet = new Set((frame.currentIslandCells || []).map(([r, c]) => `${r},${c}`));

  const cellState = (r, c) => {
    const cur = frame.currentCell;
    const isCur = cur && cur[0] === r && cur[1] === c;
    const key = `${r},${c}`;
    if (frame.grid[r][c] === "0") return "water";
    if (isCur && currentIslandSet.has(key)) return "land-current";
    if (queueSet.has(key)) return "queued";
    if (frame.visited[r][c]) return "visited";
    return "land";
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-[11px] text-zinc-500">grid (one row per line, space-separated '0'/'1')</span>
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
          <input type="range" min={120} max={1500} step={40} value={1500 - speed + 120} onChange={(e) => setSpeed(1500 - Number(e.target.value) + 120)} className="w-24 accent-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <div className="space-y-3">
          <GridVisualizer grid={frame.grid} cellState={cellState} currentCell={frame.currentCell} cellSize={38} fontSize={13} />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">bfs queue</div>
              <div className="font-mono text-[12px] text-cyan-300">{frame.queue.length === 0 ? <span className="text-[#555] italic">empty</span> : frame.queue.map(([r, c]) => `(${r},${c})`).join(", ")}</div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">island count</div>
              <div className="font-mono text-[18px] text-emerald-300">{frame.islandCount}</div>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <textarea value={gridInput} onChange={(e) => setGridInput(e.target.value)} className="w-full h-40 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[12px] text-white font-mono" />
          <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto h-[300px]"><code>{ISLANDS_CODE}</code></pre>
        </div>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
