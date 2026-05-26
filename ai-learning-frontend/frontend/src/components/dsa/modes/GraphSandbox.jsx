/**
 * GraphSandbox — BFS / DFS traversal animation on a small undirected graph.
 *
 * Used by M37-T1 (Graph Representation — Adjacency List, BFS, DFS).
 * Default 7-node graph has both a cycle (A-B-E-D-A) and a bridge
 * (E-G/F-G), so BFS vs DFS visibly produce different orders.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import GraphVisualizer from "../GraphVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import {
  DEFAULT_GRAPH, BFS_CODE, DFS_CODE,
  generateBFSSteps, generateDFSSteps,
} from "../algorithms/graph.js";

const ALGOS = [
  { id: "bfs", label: "BFS (queue)", code: BFS_CODE, gen: generateBFSSteps },
  { id: "dfs", label: "DFS (stack)", code: DFS_CODE, gen: generateDFSSteps },
];

export default function GraphSandbox() {
  const [algoId, setAlgoId] = useState("bfs");
  const [start, setStart]   = useState("A");
  const [speed, setSpeed]   = useState(650);
  const [frames, setFrames] = useState(() => generateBFSSteps(DEFAULT_GRAPH, "A"));
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const algo  = ALGOS.find((a) => a.id === algoId) || ALGOS[0];
  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    setFrames(algo.gen(DEFAULT_GRAPH, start));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [algo, start]);

  useEffect(() => { rebuild(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [algoId, start]);

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
        <select
          value={algoId}
          onChange={(e) => setAlgoId(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white"
        >
          {ALGOS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>

        <label className="text-xs text-zinc-400">start</label>
        <select
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white"
        >
          {DEFAULT_GRAPH.nodes.map((n) => <option key={n.id} value={n.id}>{n.id}</option>)}
        </select>

        <div className="w-px h-6 bg-zinc-700" />

        {!playing ? (
          <button onClick={play}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">▶ Play</button>
        ) : (
          <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>
        )}
        <button onClick={back}   disabled={idx === 0}                  className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step}   disabled={idx >= frames.length - 1}   className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset}                                        className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  rounded-lg text-sm font-medium text-white transition">Reset</button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-zinc-400 text-xs">Speed</span>
          <input
            type="range" min={150} max={1500} step={50}
            value={1500 - speed + 150}
            onChange={(e) => setSpeed(1500 - Number(e.target.value) + 150)}
            className="w-24 accent-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <GraphVisualizer
          graph={DEFAULT_GRAPH}
          nodeStates={frame.nodeStates}
          edgeStates={frame.edgeStates}
        />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto h-[420px]"><code>{algo.code}</code></pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">{frame.containerLabel}</div>
          <div className="font-mono text-[14px] text-zinc-200">
            {frame.container.length === 0 ? <span className="text-[#555] italic">empty</span> : `[ ${frame.container.join(", ")} ]`}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="text-[10px] uppercase tracking-widest text-[#555] mb-1.5">visit order</div>
          <div className="font-mono text-[14px] text-emerald-300">
            {frame.order.length === 0 ? <span className="text-[#555] italic">none yet</span> : frame.order.join(" → ")}
          </div>
        </div>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
