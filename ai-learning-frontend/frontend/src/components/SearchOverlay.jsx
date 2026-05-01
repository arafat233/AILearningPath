import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTopics } from "../services/api";
import { useAuthStore } from "../store/authStore";

const SUBJECT_COLOR = {
  "Math":           "#007AFF",
  "Science":        "#34C759",
  "English":        "#FF9500",
  "Social Science": "#AF52DE",
  "Hindi":          "#FF3B30",
};

export default function SearchOverlay({ open, onClose }) {
  const navigate   = useNavigate();
  const user       = useAuthStore((s) => s.user);
  const inputRef   = useRef(null);
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor]   = useState(0);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await searchTopics(query.trim(), user?.grade);
        setResults(data.slice(0, 8));
        setCursor(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);
  }, [query, user?.grade]);

  const go = (topic) => {
    onClose();
    navigate("/practice", { state: { topic: topic.name } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === "Enter" && results[cursor]) go(results[cursor]);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-apple-gray5">
          <svg viewBox="0 0 16 16" fill="none" stroke="#8e8e93" strokeWidth="1.5"
               strokeLinecap="round" className="w-4 h-4 shrink-0">
            <circle cx="6.5" cy="6.5" r="4.5"/>
            <path d="M10 10l3 3"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search topics…"
            className="flex-1 bg-transparent text-[15px] text-[var(--label)] placeholder-apple-gray focus:outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin shrink-0" />
          )}
          <kbd className="text-[10px] text-apple-gray border border-apple-gray5 rounded px-1.5 py-0.5 shrink-0">esc</kbd>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {results.map((t, i) => {
              const color = SUBJECT_COLOR[t.subject] || "#007AFF";
              return (
                <li key={t._id || t.name}>
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(t)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                      i === cursor ? "bg-apple-gray6" : ""
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                         style={{ background: color + "1a" }}>
                      <svg viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5"
                           strokeLinecap="round" className="w-3.5 h-3.5">
                        <path d="M11 3l2 2L5 13H3v-2L11 3z"/>
                        <path d="M9 5l2 2"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[var(--label)] truncate">{t.name}</p>
                      <p className="text-[11px] text-apple-gray truncate">{t.subject} · Class {t.grade}</p>
                    </div>
                    <span className="text-[11px] font-medium shrink-0" style={{ color }}>Practice →</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {query && !loading && results.length === 0 && (
          <p className="px-4 py-6 text-[13px] text-apple-gray text-center">
            No topics found for "{query}"
          </p>
        )}

        {!query && (
          <p className="px-4 py-5 text-[12px] text-apple-gray text-center">
            Type to search topics across all subjects
          </p>
        )}
      </div>
    </div>
  );
}
