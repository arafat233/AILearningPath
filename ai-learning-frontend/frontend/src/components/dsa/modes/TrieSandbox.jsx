/**
 * TrieSandbox — interactive trie with insert + search replay. M35-T5.
 *
 * Demo seeded with a small dictionary so collisions on shared prefixes
 * are visible from frame 0.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import TrieVisualizer from "../TrieVisualizer.jsx";
import ExplanationPanel from "../ExplanationPanel.jsx";
import {
  TRIE_CODE,
  generateTrieInsertSteps, generateTrieSearchSteps,
  buildDemoTrie, insertWord, makeTrie,
} from "../algorithms/trie.js";

const OPS = [
  { id: "insert", label: "insert(word)" },
  { id: "search", label: "search(word)" },
];

export default function TrieSandbox() {
  const [trie, setTrie]     = useState(() => buildDemoTrie());
  const [opId, setOpId]     = useState("insert");
  const [word, setWord]     = useState("dart");
  const [speed, setSpeed]   = useState(650);
  const [frames, setFrames] = useState(() => generateTrieInsertSteps(buildDemoTrie(), "dart"));
  const [idx, setIdx]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const stoppedRef = useRef(false);

  const frame = frames[idx] || frames[frames.length - 1];

  const rebuild = useCallback(() => {
    const w = word.trim();
    if (!w) return;
    const gen = opId === "insert" ? generateTrieInsertSteps : generateTrieSearchSteps;
    // Deep-clone the live trie so frames don't share references.
    const snapshot = JSON.parse(JSON.stringify(trie));
    setFrames(gen(snapshot, w));
    setIdx(0);
    setPlaying(false);
    stoppedRef.current = true;
  }, [opId, trie, word]);

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

  const commit = () => {
    if (opId !== "insert") return;
    const next = JSON.parse(JSON.stringify(trie));
    insertWord(next, word.trim());
    setTrie(next);
    setIdx(0);
    setPlaying(false);
  };
  const resetTrie = () => {
    setTrie(buildDemoTrie());
    setIdx(0);
    setPlaying(false);
  };
  const clearTrie = () => {
    setTrie(makeTrie());
    setIdx(0);
    setPlaying(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <div className="flex flex-wrap gap-3 items-center">
        <select value={opId} onChange={(e) => setOpId(e.target.value)} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white">
          {OPS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <label className="text-xs text-zinc-400">word</label>
        <input value={word} onChange={(e) => setWord(e.target.value.toLowerCase())} className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white w-32 font-mono" />
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
        <div className="w-px h-6 bg-zinc-700" />
        {opId === "insert" && (
          <button onClick={commit} className="px-3 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition">Commit → trie</button>
        )}
        <button onClick={resetTrie} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition">Reset trie</button>
        <button onClick={clearTrie} className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium text-white transition">Empty trie</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <TrieVisualizer root={frame.root} />
        <pre className="rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4 text-[11px] text-[#d4d4d4] overflow-auto h-[380px]"><code>{TRIE_CODE}</code></pre>
      </div>

      <ExplanationPanel text={`${frame.step.description}${frame.step.detail ? " — " + frame.step.detail : ""}`} />
      <div className="text-[11px] text-zinc-500 font-mono">frame {idx + 1} / {frames.length} · path so far: <span className="text-amber-400">{frame.pathSoFar || "·"}</span></div>
    </div>
  );
}
