import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { proListTracks, proEnroll, getMe } from "../services/api";
import { useTrackStore } from "../store/trackStore";
import { useAuthStore } from "../store/authStore";

// Display metadata for the synthetic "school" track (not in proListTracks).
const SCHOOL_META = {
  key:         "school",
  name:        "School",
  description: "CBSE / ICSE / AP SSC and other K-12 boards.",
  hint:        "Lessons, PYQs, mock papers, AI tutor.",
};

export default function Tracks() {
  const navigate = useNavigate();
  const { activeTrack, tracks: enrolledTracks, setActiveTrack, refreshNav } = useTrackStore();
  const [proTracks, setProTracks]   = useState([]); // [{ key, name, description, enrolled, ... }]
  const [pilotOnly, setPilotOnly]   = useState(false); // true when proListTracks 403s
  const [loading,   setLoading]     = useState(true);
  const [busyKey,   setBusyKey]     = useState(null);
  const [error,     setError]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await proListTracks();
        // proListTracks returns either { data: [...] } or [...] depending on backend wrap
        setProTracks(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        // 403 here = email allowlist. Show waitlist UI rather than crashing.
        if (err.response?.status === 403) {
          setProTracks([]);
          setPilotOnly(true);
        } else {
          setError(err.response?.data?.error || "Couldn't load tracks.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isEnrolled = (key) => enrolledTracks?.some((t) => t.key === key);

  const handleEnrol = async (track) => {
    setBusyKey(track.key);
    setError("");
    try {
      await proEnroll(track.key);
      await refreshNav();
      // Keep authStore.user.tracks in sync so the OnboardingGate is satisfied
      // on subsequent navigation.
      try {
        const { data } = await getMe();
        const fresh = data?.data?.user;
        if (fresh) useAuthStore.getState().setAuth(null, fresh);
      } catch {}
      navigate("/pro");
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError("This track is in private pilot. We've noted your interest — you'll get an email when it opens up.");
      } else {
        setError(err.response?.data?.error || "Couldn't enrol right now.");
      }
    } finally {
      setBusyKey(null);
    }
  };

  const handleSwitch = async (key) => {
    setBusyKey(key);
    try {
      await setActiveTrack(key);
      navigate("/");
    } finally {
      setBusyKey(null);
    }
  };

  // Render-side groupings.
  const allTracks = [
    SCHOOL_META,
    ...proTracks.map((t) => ({
      key:         t.key,
      name:        t.name || t.key,
      description: t.description || "",
      hint:        t.language ? `Pro · ${t.language}` : "Pro track",
    })),
  ];

  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-[24px] font-bold text-[var(--label)] mb-1">Your tracks</h1>
        <p className="text-[13px] text-apple-gray">
          Switch between tracks you're enrolled in, or add a new one. You can be on multiple tracks at the same time.
        </p>
      </header>

      {error && (
        <div className="card p-4 mb-5 border border-apple-orange/20 bg-apple-orange/5">
          <p className="text-[13px] text-[var(--label)]">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <div className="card p-6 text-center col-span-full">
            <p className="text-[13px] text-apple-gray">Loading tracks…</p>
          </div>
        )}

        {!loading && allTracks.map((t) => {
          const enrolled = isEnrolled(t.key);
          const active   = activeTrack === t.key;
          const busy     = busyKey === t.key;
          return (
            <div key={t.key} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <h3 className="text-[15px] font-bold text-[var(--label)] truncate">{t.name}</h3>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-apple-gray mt-0.5">{t.hint}</p>
                </div>
                {active && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue shrink-0">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[var(--label2)] leading-relaxed mb-4 min-h-[40px]">
                {t.description}
              </p>

              {enrolled ? (
                <button
                  disabled={active || busy}
                  onClick={() => handleSwitch(t.key)}
                  className="btn-secondary w-full py-2 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {active ? "Currently active" : busy ? "Switching…" : "Switch to this track"}
                </button>
              ) : t.key === "school" ? (
                <button
                  onClick={() => navigate("/start")}
                  className="btn-primary w-full py-2 text-[13px]"
                >
                  Set up school
                </button>
              ) : (
                <button
                  disabled={busy}
                  onClick={() => handleEnrol(t)}
                  className="btn-primary w-full py-2 text-[13px] disabled:opacity-50"
                >
                  {busy ? "Enrolling…" : "Enrol"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {pilotOnly && (
        <div className="card p-5 mt-6 border border-apple-blue/15 bg-apple-blue/5">
          <h3 className="text-[14px] font-bold text-[var(--label)] mb-1">Pro tracks · Private pilot</h3>
          <p className="text-[12px] text-apple-gray leading-relaxed">
            Java is currently invite-only. We're opening it up in waves — drop a note to
            <a href="mailto:najeebarafat@gmail.com" className="text-apple-blue ml-1">najeebarafat@gmail.com</a> to
            join the waitlist and we'll email you when your slot opens.
          </p>
        </div>
      )}

      <p className="text-[12px] text-apple-gray mt-6">
        You can be on multiple tracks at the same time. Switch between them anytime from the sidebar.
      </p>
    </div>
  );
}
