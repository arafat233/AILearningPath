/**
 * HeapSandbox — binary min-heap insert + extract with paired views.
 *
 * Used by M36-T1 (Heap Fundamentals). Shows the array cells AND the
 * tree rendering of the same heap side-by-side, with the active
 * comparison highlighted in both. The "this array IS the tree" insight
 * is the lesson — splitting it across the two visualizers makes it
 * concrete.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import ArrayVisualizer from "../ArrayVisualizer.jsx";
import TreeVisualizer from "../TreeVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import {
  HEAP_INSERT_CODE, HEAP_EXTRACT_CODE,
  generateHeapInsertSteps, generateHeapExtractSteps,
} from "../algorithms/heap.js";

const DEFAULT_HEAP = [3, 7, 5, 12, 8, 15, 10];

const OPS = [
  { id: "insert",  label: "Insert (sift up)",     code: HEAP_INSERT_CODE  },
  { id: "extract", label: "Extract min (sift down)", code: HEAP_EXTRACT_CODE },
];

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

function buildFrames(opId, heap, value) {
  if (opId === "insert")  return generateHeapInsertSteps(heap, value);
  return                          generateHeapExtractSteps(heap);
}

export default function HeapSandbox() {
  const [heap, setHeap]           = useState(DEFAULT_HEAP);
  const [opId, setOpId]           = useState("insert");
  const [valueInput, setValueInput] = useState("2");
  const [speed, setSpeed]         = useState(700);
  const [frames, setFrames]       = useState(() => generateHeapInsertSteps(DEFAULT_HEAP, 2));
  const [idx, setIdx]             = useState(0);
  const [playing, setPlaying]     = useState(false);
  const stoppedRef = useRef(false);

  const op    = OPS.find((o) => o.id === opId) || OPS[0];
  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const v = Number(valueInput);
    const value = Number.isFinite(v) ? v : 0;
    setFrames(buildFrames(opId, heap, value));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [opId, heap, valueInput]);

  useEffect(() => { rebuild(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [opId]);

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

  // Commit the final heap (after last frame) — lets the learner chain
  // insert → insert → extract without losing prior progress.
  const commit = () => {
    const last = frames[frames.length - 1];
    if (!last) return;
    setHeap(last.array);
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
    // Re-build the next op against the committed heap on next Apply.
  };

  const resetHeap = () => {
    setHeap(DEFAULT_HEAP);
    setFrames(generateHeapInsertSteps(DEFAULT_HEAP, Number(valueInput) || 0));
    setIdx(0);
    setPlaying(false);
  };

  const cells = frame.array.map((v, i) => ({
    value: v,
    state: frame.activeIndices.includes(i) ? "compare" : "default",
  }));
  const tree  = arrayToTree(frame.array, frame.activeIndices);

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={opId}
          onChange={(e) => setOpId(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white"
        >
          {OPS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>

        {opId === "insert" && (
          <>
            <label className="text-xs text-zinc-400">value</label>
            <input
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-20"
            />
          </>
        )}

        <button onClick={rebuild} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm text-white transition">Apply</button>

        <div className="w-px h-6 bg-zinc-700" />

        {!playing ? (
          <button onClick={play}  className="px-4 py-2 bg-green-600  hover:bg-green-500  rounded-lg text-sm font-medium text-white transition">▶ Play</button>
        ) : (
          <button onClick={stop}  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-sm font-medium text-white transition">⏸ Pause</button>
        )}
        <button onClick={back}   disabled={idx === 0}                  className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">◀</button>
        <button onClick={step}   disabled={idx >= frames.length - 1}   className="px-3 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition">Step ▶</button>
        <button onClick={reset}                                        className="px-3 py-2 bg-zinc-700  hover:bg-zinc-600  rounded-lg text-sm font-medium text-white transition">Reset frames</button>

        <div className="w-px h-6 bg-zinc-700" />

        <button onClick={commit}     className="px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition">Commit → heap</button>
        <button onClick={resetHeap}  className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition">Reset heap</button>

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

      <ArrayVisualizer cells={cells} title="Array view (heap as 1D)" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <TreeVisualizer root={tree} width={560} height={320} />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[340px]"><code>{op.code}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length} · committed heap: [{heap.join(", ")}]</div>
    </div>
  );
}
