/**
 * CodeEditor — Monaco wrapper for ProExerciseRunner.
 *
 * Monaco's bundle is ~2 MB minified. We import @monaco-editor/react
 * here in a SEPARATE chunk so it lands in its own JS file that Vite
 * only fetches when the user actually opens the exercise runner. The
 * Dashboard / Lessons / etc. never pay this cost.
 *
 * Loads the editor's CSS + workers via @monaco-editor's defaults,
 * which fetches them from the unpkg CDN on first run. Good for the
 * pilot; consider vendoring locally once we deploy to production.
 *
 * Tokens chosen to match Dashboard.jsx visual baseline:
 *   - vs-dark theme on the dark variant, vs-light otherwise (Stellar
 *     light/dark mode is controlled by themeStore; we read DOM class
 *     so we don't drag the store in just for this).
 *   - 13px font (matches our other code blocks)
 *   - tab size 4, insertSpaces true (Java convention)
 */
import { lazy, Suspense, useEffect, useState } from "react";

// The actual @monaco-editor/react import is in its own chunk.
const MonacoEditor = lazy(() => import("@monaco-editor/react").then((m) => ({ default: m.default })));

export default function CodeEditor({ value, onChange, language = "java", height = "420px" }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const detect = () => setTheme(document.documentElement.classList.contains("dark") ? "vs-dark" : "vs-light");
    detect();
    // Re-detect when the user toggles dark mode at runtime. Stellar's
    // themeStore toggles the `dark` class on <html>, so a class-attr
    // MutationObserver is the lightest hook.
    const obs = new MutationObserver(detect);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  return (
    <Suspense fallback={
      <div className="w-full bg-[var(--fill)] flex items-center justify-center" style={{ height }}>
        <p className="text-[12px] text-apple-gray">Loading editor…</p>
      </div>
    }>
      <MonacoEditor
        height={height}
        language={language}
        theme={theme}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          minimap:           { enabled: false },
          scrollBeyondLastLine: false,
          fontSize:          13,
          fontFamily:        "ui-monospace, Menlo, Consolas, monospace",
          tabSize:           4,
          insertSpaces:      true,
          renderLineHighlight: "gutter",
          smoothScrolling:   true,
          wordWrap:          "on",
          padding:           { top: 12, bottom: 12 },
          lineNumbersMinChars: 3,
          contextmenu:       false, // no right-click "Run" / "Cut" leak to the page menu
        }}
      />
    </Suspense>
  );
}
