/**
 * DSACodeEditor — Monaco wrapper with current-line highlight + student mode.
 *
 * Ported from dsa-visualizer 2/src/components/CodeEditor.tsx:
 *   - Dropped Next.js dynamic() import; uses @monaco-editor/react directly
 *     (Vite has no SSR concern, so dynamic loading isn't needed)
 *   - Dropped 'use client'
 *   - Stripped TS interfaces and `monaco-editor` type imports
 *
 * Two modes:
 *   - Visualizer: read-only display of the algorithm's source, with a
 *     highlight on the currently-executing line (driven by `currentLine`)
 *   - Student: editable Monaco where the learner writes their own sort
 */
import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

/**
 * @param {{
 *   code: string,
 *   currentLine: number,
 *   studentMode: boolean,
 *   studentCode: string,
 *   onStudentCodeChange: (code: string) => void,
 *   onRunStudentCode: () => void,
 *   studentError: string,
 *   onToggleStudentMode: () => void,
 * }} props
 */
export default function DSACodeEditor({
  code, currentLine,
  studentMode, studentCode, onStudentCodeChange,
  onRunStudentCode, studentError, onToggleStudentMode,
}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Apply / clear the active-line decoration when currentLine or mode changes
  useEffect(() => {
    const ed = editorRef.current;
    const monaco = monacoRef.current;
    if (!ed || !monaco || studentMode || currentLine < 1) {
      if (ed && monaco) {
        decorationsRef.current = ed.deltaDecorations(decorationsRef.current, []);
      }
      return;
    }

    decorationsRef.current = ed.deltaDecorations(decorationsRef.current, [
      {
        range: new monaco.Range(currentLine, 1, currentLine, 1),
        options: {
          isWholeLine: true,
          className: "monaco-active-line",
          glyphMarginClassName: "monaco-active-glyph",
        },
      },
    ]);
    ed.revealLineInCenterIfOutsideViewport(currentLine);
  }, [currentLine, studentMode]);

  // Clear decorations when the algorithm code itself changes
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    decorationsRef.current = ed.deltaDecorations(decorationsRef.current, []);
  }, [code]);

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-zinc-200">
            {studentMode ? "Student Sandbox" : "Algorithm Code"}
          </span>
          {!studentMode && currentLine > 0 && (
            <span className="text-xs px-2 py-0.5 bg-yellow-900/50 text-yellow-300 rounded-full border border-yellow-700/50">
              Line {currentLine}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {studentMode && (
            <button
              onClick={onRunStudentCode}
              className="px-3 py-1 bg-green-700 hover:bg-green-600 text-xs font-semibold text-white rounded transition"
            >
              ▶ Run My Code
            </button>
          )}
          <button
            onClick={onToggleStudentMode}
            className={`px-3 py-1 text-xs font-semibold rounded transition border ${
              studentMode
                ? "border-blue-500 bg-blue-900/40 text-blue-300"
                : "border-zinc-600 text-zinc-400 hover:border-zinc-400"
            }`}
          >
            {studentMode ? "Back to Visualizer" : "Try It Yourself"}
          </button>
        </div>
      </div>

      {/* Error bar */}
      {studentMode && studentError && (
        <div className="px-4 py-2 bg-red-900/40 border-b border-red-800 text-red-300 text-xs font-mono">
          {studentError}
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={studentMode ? studentCode : code}
          options={{
            readOnly: !studentMode,
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            renderLineHighlight: studentMode ? "line" : "none",
            glyphMargin: !studentMode,
            folding: false,
            lineDecorationsWidth: !studentMode ? 4 : 0,
            padding: { top: 12, bottom: 12 },
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            wordWrap: "on",
            tabSize: 2,
          }}
          onMount={handleMount}
          onChange={(val) => {
            if (studentMode) onStudentCodeChange(val ?? "");
          }}
        />
      </div>

      {/* Legend (visualizer mode only) */}
      {!studentMode && (
        <div className="flex gap-4 px-4 py-2 border-t border-zinc-800 bg-zinc-900/60 text-xs text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" /> Comparing</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Default</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Sorted</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-pink-500 inline-block" /> Pivot</span>
        </div>
      )}
    </div>
  );
}
