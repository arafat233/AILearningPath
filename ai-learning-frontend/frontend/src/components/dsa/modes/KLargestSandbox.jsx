/**
 * KLargestSandbox — streaming K-largest via min-heap. M36-T2.
 */
import { useCallback, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import TreeVisualizer from "../TreeVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import { K_LARGEST_CODE, generateKLargestSteps } from "../algorithms/kLargest.js";

const DEFAULT_STREAM = [3, 1, 5, 12, 2, 8, 9, 4, 7, 15, 6];
const DEFAULT_K = 4;

function arrayToTree(arr, activeIndices = []) {
  if (arr.length === 0) return null;
  const isActive = new Set(activeIndices);
  function build(i) {
    if (i >= arr.length) return null;
    return {
      value: arr[i],
      left:  build(2 * i + 1),
      right: build(2 * i + 2),
      state: isActive.has(i) ? "compare" : "default",
    };
  }
  return build(0);
}

export default function KLargestSandbox() {
  const [streamInput, setStreamInput] = useState(DEFAULT_STREAM.join(", "));
  const [kInput, setKInput]   = useState(String(DEFAULT_K));
  const [speed, setSpeed]     = useState(600);
  const [frames, setFrames]   = useState(() => generateKLargestSteps(DEFAULT_STREAM, DEFAULT_K));
  const [idx, setIdx]         = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const stream = streamInput.split(",").map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    const k = Math.max(1, Math.floor(Number(kInput) || 1));
    if (stream.length === 0) return;
    setFrames(generateKLargestSteps(stream, k));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [streamInput, kInput]);

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

  // Stream view — current index highlighted
  const streamCells = frame.stream.map((v, i) => ({
    value: v,
    state: i === frame.streamIdx ? "compare" : i < frame.streamIdx ? "sorted" : "default",
  }));

  // Heap view as both array and tree
  const heapCells = frame.heap.map((v, i) => ({
    value: v,
    state: frame.activeHeapIndices.includes(i) ? "compare" : "default",
  }));
  const tree = arrayToTree(frame.heap, frame.activeHeapIndices);

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-xs text-zinc-400">stream</label>
        <input value={streamInput} onChange={(e) => setStreamInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-80" />
        <label className="text-xs text-zinc-400">k</label>
        <input value={kInput} onChange={(e) => setKInput(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-16" />
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

      <ArrayVisualizer cells={streamCells} title="stream (sorted = processed)" />
      <ArrayVisualizer cells={heapCells}   title={`min-heap (capacity ${frame.k})`} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <TreeVisualizer root={tree} width={520} height={280} />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[300px]"><code>{K_LARGEST_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
