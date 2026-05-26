/**
 * HashTableSandbox — separate-chaining HashMap put/get with collision view.
 *
 * Used by M34-T1 (Hash Fundamentals). Default capacity 8 is small on
 * purpose so collisions show up after just a few inserts. Commit
 * button promotes the post-op state back to the live table so users
 * can chain put → put → get without losing prior inserts.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import HashTableVisualizer from "../HashTableVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import {
  HASH_PUT_CODE, HASH_GET_CODE,
  generateHashPutSteps, generateHashGetSteps, buildInitialTable,
} from "../algorithms/hashTable.js";

const OPS = [
  { id: "put", label: "put(key, value)", code: HASH_PUT_CODE },
  { id: "get", label: "get(key)",        code: HASH_GET_CODE },
];

export default function HashTableSandbox() {
  const [table, setTable]       = useState(() => buildInitialTable(8));
  const [opId, setOpId]         = useState("put");
  const [keyInput, setKeyInput] = useState("frank");
  const [valInput, setValInput] = useState("40");
  const [speed, setSpeed]       = useState(700);
  const [frames, setFrames]     = useState(() => generateHashPutSteps(buildInitialTable(8), "frank", 40));
  const [idx, setIdx]           = useState(0);
  const [playing, setPlaying]   = useState(false);
  const stoppedRef = useRef(false);

  const op    = OPS.find((o) => o.id === opId) || OPS[0];
  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const k = keyInput.trim();
    if (!k) return;
    if (opId === "put") {
      const numeric = Number(valInput);
      const v = Number.isFinite(numeric) && valInput.trim() !== "" ? numeric : valInput;
      setFrames(generateHashPutSteps(table, k, v));
    } else {
      setFrames(generateHashGetSteps(table, k));
    }
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [opId, table, keyInput, valInput]);

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

  // Commit only meaningful for put — promote the final post-op buckets.
  const commit = () => {
    const last = frames[frames.length - 1];
    if (!last) return;
    setTable({ capacity: table.capacity, buckets: last.buckets });
    setIdx(0);
    setPlaying(false);
  };

  const resetTable = () => {
    setTable(buildInitialTable(8));
    setIdx(0);
    setPlaying(false);
  };

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

        <label className="text-xs text-zinc-400">key</label>
        <input
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-28"
        />
        {opId === "put" && (
          <>
            <label className="text-xs text-zinc-400">value</label>
            <input
              value={valInput}
              onChange={(e) => setValInput(e.target.value)}
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

        {opId === "put" && (
          <button onClick={commit} className="px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition">Commit → table</button>
        )}
        <button onClick={resetTable} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition">Reset table</button>

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
        <HashTableVisualizer
          capacity={frame.buckets.length}
          buckets={frame.buckets}
          activeBucket={frame.activeBucket}
          hashWork={frame.hashWork}
        />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[12px] text-[#d4d4d4] overflow-auto h-[420px]"><code>{op.code}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length}</div>
    </div>
  );
}
