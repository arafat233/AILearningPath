/**
 * VisualizerShell — the entry point ProTopicView uses to render any DSA
 * visualizer.
 *
 * Reads `kind` from the topic config and dispatches to the right mode:
 *   - "sorting-sandbox"  → Sorting visualizer + student mode (M38-T1)
 *   - "binary-search"    → L/R/mid pointer replay (M39-T1)
 *   - "linked-list"      → intro/insert/delete replay (M32-T1, T3)
 *   - "stack"            → interactive push/pop/peek (M33-T1)
 *   - "tree"             → BST insert + animated search (M35-T1)
 *   - "array-pointers"   → two-pointer 2-sum demo (M30-T1)
 *
 * Unknown kinds return a friendly "coming soon" placeholder so missing
 * wire-up doesn't crash the topic page.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import ArrayBars from "./ArrayBars.jsx";
import Controls from "./Controls.jsx";
import ExplanationPanel from "./ExplanationPanel.jsx";
import StatsPanel from "./StatsPanel.jsx";
import DSACodeEditor from "./DSACodeEditor.jsx";
import { sortAlgorithms } from "./algorithms/registry.js";
import { generateRandomArray } from "./utils/generateArray.js";
import { runStudentCode, STUDENT_TEMPLATE } from "./runners/studentRunner.js";
import BinarySearchSandbox from "./modes/BinarySearchSandbox.jsx";
import LinkedListSandbox  from "./modes/LinkedListSandbox.jsx";
import StackSandbox       from "./modes/StackSandbox.jsx";
import TreeSandbox        from "./modes/TreeSandbox.jsx";
import ArrayPointersSandbox from "./modes/ArrayPointersSandbox.jsx";
import HeapSandbox        from "./modes/HeapSandbox.jsx";
import HashTableSandbox   from "./modes/HashTableSandbox.jsx";
import StringMatchSandbox from "./modes/StringMatchSandbox.jsx";
import GraphSandbox       from "./modes/GraphSandbox.jsx";
import SlidingWindowSandbox  from "./modes/SlidingWindowSandbox.jsx";
import DutchFlagSandbox      from "./modes/DutchFlagSandbox.jsx";
import PalindromeSandbox     from "./modes/PalindromeSandbox.jsx";
import LCSGridSandbox        from "./modes/LCSGridSandbox.jsx";
import FloydCycleSandbox     from "./modes/FloydCycleSandbox.jsx";
import MonotonicStackSandbox from "./modes/MonotonicStackSandbox.jsx";
import TreeTraversalSandbox  from "./modes/TreeTraversalSandbox.jsx";
import TrieSandbox           from "./modes/TrieSandbox.jsx";
import KLargestSandbox       from "./modes/KLargestSandbox.jsx";
import GraphTopoSandbox      from "./modes/GraphTopoSandbox.jsx";
import GraphDijkstraSandbox  from "./modes/GraphDijkstraSandbox.jsx";
import PrefixSumsSandbox       from "./modes/PrefixSumsSandbox.jsx";
import QueueSandbox            from "./modes/QueueSandbox.jsx";
import SlidingWindowMaxSandbox from "./modes/SlidingWindowMaxSandbox.jsx";
import LCASandbox              from "./modes/LCASandbox.jsx";
import CountingSortSandbox     from "./modes/CountingSortSandbox.jsx";
import RotatedSearchSandbox    from "./modes/RotatedSearchSandbox.jsx";
import UnionFindSandbox        from "./modes/UnionFindSandbox.jsx";
import KWayMergeSandbox        from "./modes/KWayMergeSandbox.jsx";
import LRUSandbox              from "./modes/LRUSandbox.jsx";
import AnagramSandbox          from "./modes/AnagramSandbox.jsx";
import MergeLLSandbox          from "./modes/MergeLLSandbox.jsx";
import CustomHashSandbox       from "./modes/CustomHashSandbox.jsx";
import TreePathSandbox         from "./modes/TreePathSandbox.jsx";
import PQLazySandbox           from "./modes/PQLazySandbox.jsx";
import IslandsSandbox          from "./modes/IslandsSandbox.jsx";
import SearchOnAnswerSandbox   from "./modes/SearchOnAnswerSandbox.jsx";
import MatrixSearchSandbox     from "./modes/MatrixSearchSandbox.jsx";
import HashGroupingSandbox     from "./modes/HashGroupingSandbox.jsx";
import HashDedupSandbox        from "./modes/HashDedupSandbox.jsx";
import IntervalMergeSandbox    from "./modes/IntervalMergeSandbox.jsx";

/**
 * @param {{ kind: string, config?: object }} props
 */
export default function VisualizerShell({ kind, config = {} }) {
  switch (kind) {
    case "sorting-sandbox": return <SortingSandbox    config={config} />;
    case "binary-search":   return <BinarySearchSandbox />;
    case "linked-list":     return <LinkedListSandbox  />;
    case "stack":           return <StackSandbox       />;
    case "tree":            return <TreeSandbox        />;
    case "array-pointers":  return <ArrayPointersSandbox />;
    case "heap":            return <HeapSandbox        />;
    case "hash-table":      return <HashTableSandbox   />;
    case "string-matching": return <StringMatchSandbox />;
    case "graph":           return <GraphSandbox       />;
    case "sliding-window":   return <SlidingWindowSandbox  />;
    case "dutch-flag":       return <DutchFlagSandbox      />;
    case "palindrome":       return <PalindromeSandbox     />;
    case "dp-grid":          return <LCSGridSandbox        />;
    case "linked-list-cycle": return <FloydCycleSandbox    />;
    case "monotonic-stack":  return <MonotonicStackSandbox />;
    case "tree-traversal":   return <TreeTraversalSandbox  />;
    case "trie":             return <TrieSandbox           />;
    case "k-largest":        return <KLargestSandbox       />;
    case "graph-topo":       return <GraphTopoSandbox      />;
    case "graph-dijkstra":   return <GraphDijkstraSandbox  />;
    case "prefix-sums":      return <PrefixSumsSandbox     />;
    case "queue":            return <QueueSandbox          />;
    case "sliding-window-max": return <SlidingWindowMaxSandbox />;
    case "lca":              return <LCASandbox            />;
    case "counting-sort":    return <CountingSortSandbox   />;
    case "rotated-search":   return <RotatedSearchSandbox  />;
    case "union-find":       return <UnionFindSandbox      />;
    case "k-way-merge":      return <KWayMergeSandbox      />;
    case "lru":              return <LRUSandbox            />;
    case "anagram":          return <AnagramSandbox        />;
    case "merge-ll":         return <MergeLLSandbox        />;
    case "custom-hash":      return <CustomHashSandbox     />;
    case "tree-path":        return <TreePathSandbox       />;
    case "pq-lazy":          return <PQLazySandbox         />;
    case "islands":          return <IslandsSandbox        />;
    case "search-on-answer": return <SearchOnAnswerSandbox />;
    case "matrix-search":    return <MatrixSearchSandbox   />;
    case "hash-grouping":    return <HashGroupingSandbox   />;
    case "hash-dedup":       return <HashDedupSandbox      />;
    case "interval-merge":   return <IntervalMergeSandbox  />;
    default:
      return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-zinc-400 text-sm">
          <p className="font-semibold mb-1">Visualizer "{kind}" not yet wired up.</p>
          <p className="text-xs">This topic has a placeholder for an interactive widget that's coming in a later phase.</p>
        </div>
      );
  }
}

// ── Sorting sandbox mode ─────────────────────────────────────────────────────
//
// Orchestrates: algorithm selection, array generation, animation playback,
// pause/resume/step/stop controls, and the student-mode JS sandbox.
//
// State machine: idle → running (continuous OR step-by-step) → done | stopped.
function SortingSandbox({ config }) {
  const initialAlgoId = config?.defaultAlgo || "bubble";
  const initialSize   = config?.defaultSize || 16;

  const [selectedAlgoId, setSelectedAlgoId] = useState(initialAlgoId);
  const algo = sortAlgorithms.find((a) => a.id === selectedAlgoId) || sortAlgorithms[0];

  const [array, setArray]                 = useState([]);
  const [arraySize, setArraySize]         = useState(initialSize);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [pivotIndex, setPivotIndex]       = useState(undefined);

  const [isSorting, setIsSorting]   = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const isPausedRef  = useRef(false);
  const isStoppedRef = useRef(false);
  const stepsRef     = useRef([]);
  const stepIdxRef   = useRef(0);

  const [speed, setSpeed]                 = useState(200);
  const [currentCodeLine, setCurrentLine] = useState(-1);
  const [explanation, setExplanation]     = useState("");
  const [stats, setStats]                 = useState({ comparisons: 0, swaps: 0 });

  const [studentMode, setStudentMode]     = useState(false);
  const [studentCode, setStudentCode]     = useState(STUDENT_TEMPLATE);
  const [studentError, setStudentError]   = useState("");

  // Build the initial array on mount + whenever size changes
  useEffect(() => {
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("");
    setStats({ comparisons: 0, swaps: 0 });
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  // When algorithm changes mid-idle, clear the display
  useEffect(() => {
    if (!isSorting) {
      setCurrentLine(-1);
      setExplanation("");
      setStats({ comparisons: 0, swaps: 0 });
    }
  }, [selectedAlgoId, isSorting]);

  const applyStep = useCallback((step) => {
    if (step.array) setArray(step.array);
    setActiveIndices(step.indices || []);
    setExplanation(step.explanation || "");
    setCurrentLine(step.codeLine);
    setStats({
      comparisons: step.comparisons ?? 0,
      swaps: step.swaps ?? 0,
    });

    if (step.type === "pivot") {
      setPivotIndex((step.indices || [])[0]);
    } else {
      setPivotIndex(undefined);
    }

    if (step.type === "sorted") {
      setSortedIndices((prev) => {
        const next = new Set([...prev, ...(step.indices || [])]);
        return Array.from(next);
      });
    }
  }, []);

  const finishSorting = useCallback(() => {
    setIsSorting(false);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    isStoppedRef.current = false;
    isPausedRef.current  = false;
    setIsPaused(false);
  }, []);

  const handleGenerate = useCallback(() => {
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("");
    setStats({ comparisons: 0, swaps: 0 });
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleNextStep = useCallback(() => {
    if (!isSorting || !isStepMode) return;
    const step = stepsRef.current[stepIdxRef.current];
    if (!step) {
      setExplanation("Sorting complete!");
      finishSorting();
      return;
    }
    applyStep(step);
    stepIdxRef.current++;
  }, [isSorting, isStepMode, applyStep, finishSorting]);

  const handleStart = useCallback(async () => {
    const steps = algo.generate(array);
    stepsRef.current = steps;
    stepIdxRef.current = 0;
    setIsSorting(true);
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setStats({ comparisons: 0, swaps: 0 });
    isStoppedRef.current = false;
    isPausedRef.current  = false;

    if (isStepMode) {
      // Step mode just primes the buffer; user advances via Step button
      return;
    }

    for (const step of steps) {
      if (isStoppedRef.current) break;
      while (isPausedRef.current) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 50));
      }
      if (isStoppedRef.current) break;
      applyStep(step);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, speed));
    }
    if (!isStoppedRef.current) setExplanation("Sorting complete!");
    finishSorting();
  }, [algo, array, isStepMode, speed, applyStep, finishSorting]);

  const handlePause = useCallback(() => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused((p) => !p);
  }, []);

  const handleStop = useCallback(() => {
    isStoppedRef.current = true;
    isPausedRef.current  = false;
    setIsPaused(false);
    setIsSorting(false);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("Stopped.");
  }, []);

  const handleAlgoChange = useCallback((id) => {
    if (isSorting) return;
    setSelectedAlgoId(id);
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setCurrentLine(-1);
    setExplanation("");
    setStats({ comparisons: 0, swaps: 0 });
    setStudentMode(false);
  }, [isSorting]);

  const handleRunStudentCode = useCallback(async () => {
    setStudentError("");
    const result = runStudentCode(studentCode, array);
    if ("error" in result) {
      setStudentError(result.error);
      return;
    }
    stepsRef.current = result.steps;
    stepIdxRef.current = 0;
    setSortedIndices([]);
    setActiveIndices([]);
    setPivotIndex(undefined);
    setStats({ comparisons: 0, swaps: 0 });
    setExplanation("Running student code…");
    setIsSorting(true);
    isStoppedRef.current = false;
    isPausedRef.current  = false;

    for (const step of result.steps) {
      if (isStoppedRef.current) break;
      while (isPausedRef.current) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 50));
      }
      if (isStoppedRef.current) break;
      applyStep(step);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, speed));
    }
    if (!isStoppedRef.current) setExplanation("Done! Check if the array is sorted.");
    finishSorting();
  }, [studentCode, array, speed, applyStep, finishSorting]);

  const handleToggleStudentMode = useCallback(() => {
    if (isSorting) return;
    setStudentMode((m) => !m);
    setStudentError("");
    setCurrentLine(-1);
    setExplanation("");
  }, [isSorting]);

  return (
    <div className="flex flex-col gap-4 w-full bg-zinc-950 text-white p-4 rounded-2xl border border-zinc-800">
      <Controls
        isSorting={isSorting}
        isPaused={isPaused}
        isStepMode={isStepMode}
        arraySize={arraySize}
        speed={speed}
        selectedAlgoId={selectedAlgoId}
        algoOptions={sortAlgorithms.map((a) => ({ id: a.id, name: a.name }))}
        onAlgoChange={handleAlgoChange}
        onSizeChange={setArraySize}
        onSpeedChange={setSpeed}
        onGenerate={handleGenerate}
        onStart={handleStart}
        onPause={handlePause}
        onStop={handleStop}
        onNextStep={handleNextStep}
        onToggleStepMode={() => !isSorting && setIsStepMode((m) => !m)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-4">
        <ArrayBars
          array={array}
          activeIndices={activeIndices}
          sortedIndices={sortedIndices}
          pivotIndex={pivotIndex}
        />

        <div className="h-[340px]">
          <DSACodeEditor
            code={algo.code}
            currentLine={currentCodeLine}
            studentMode={studentMode}
            studentCode={studentCode}
            onStudentCodeChange={setStudentCode}
            onRunStudentCode={handleRunStudentCode}
            studentError={studentError}
            onToggleStudentMode={handleToggleStudentMode}
          />
        </div>
      </div>

      <ExplanationPanel text={explanation} />

      <StatsPanel
        comparisons={stats.comparisons}
        swaps={stats.swaps}
        timeComplexity={algo.timeComplexity}
        spaceComplexity={algo.spaceComplexity}
        description={algo.description}
      />
    </div>
  );
}
