import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrackStore } from "../store/trackStore";

const TRACK_LABELS = {
  school:   { label: "School",     hint: "K-12 boards" },
  pro_java: { label: "Java · Pro", hint: "Professional track" },
};

function trackDisplay(key) {
  return TRACK_LABELS[key] || { label: key, hint: "Track" };
}

/**
 * TrackSwitcher — sidebar header dropdown for multi-track users.
 *
 * Hidden when the user has 0 or 1 enrolled tracks. When multiple tracks
 * exist, opens a small menu listing each enrolled track; selecting one
 * calls PATCH /user/active-track which re-resolves the sidebar nav.
 */
export default function TrackSwitcher() {
  const { activeTrack, tracks, setActiveTrack } = useTrackStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Render even with a single enrolled track so the "Add another track"
  // affordance is always discoverable from the sidebar.
  if (!tracks || tracks.length === 0) return null;

  const current = trackDisplay(activeTrack);

  const pick = async (key) => {
    setOpen(false);
    if (key === activeTrack) return;
    await setActiveTrack(key);
    navigate("/");
  };

  return (
    <div className="relative px-3 mb-2" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-apple border border-apple-gray5 hover:bg-apple-gray6 transition-colors"
        style={{ background: "var(--fill)" }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="flex flex-col items-start min-w-0">
          <span className="text-[10px] uppercase tracking-[0.15em] text-apple-gray leading-none">Track</span>
          <span className="text-[13px] font-semibold text-[var(--label)] leading-tight truncate">{current.label}</span>
        </div>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round"
             className="w-3.5 h-3.5 text-apple-gray shrink-0">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-3 right-3 mt-1 rounded-apple shadow-lg border border-apple-gray5 z-50 overflow-hidden"
          style={{ background: "var(--card-bg)" }}
        >
          {tracks.map((t) => {
            const d = trackDisplay(t.key);
            const isActive = t.key === activeTrack;
            return (
              <button
                key={t.key}
                role="menuitem"
                onClick={() => pick(t.key)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left hover:bg-apple-gray6 transition-colors ${isActive ? "bg-apple-blue/8" : ""}`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-[13px] font-semibold text-[var(--label)] truncate">{d.label}</span>
                  <span className="text-[11px] text-apple-gray truncate">{d.hint}</span>
                </div>
                {isActive && (
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
                       strokeLinecap="round" strokeLinejoin="round"
                       className="w-3.5 h-3.5 text-apple-blue shrink-0">
                    <path d="M3 8.5l3 3 7-7" />
                  </svg>
                )}
              </button>
            );
          })}

          {/* Discovery affordance — works for single-track users too. */}
          <button
            role="menuitem"
            onClick={() => { setOpen(false); navigate("/tracks"); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-left border-t border-apple-gray5 hover:bg-apple-gray6 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round"
                 className="w-3.5 h-3.5 text-apple-blue shrink-0">
              <path d="M8 3v10M3 8h10" />
            </svg>
            <span className="text-[13px] font-medium text-apple-blue">Add another track</span>
          </button>
        </div>
      )}
    </div>
  );
}
