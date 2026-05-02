import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getReport, getAIAdvice, getAIUsage, getAICacheStats, getTopics, getLinkRequests, respondToLinkRequest, submitFeedback, getNpsEligibility } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { DashboardSkeleton } from "../components/Skeleton";

const SUBJECTS = [
  { id: "Math",          label: "Maths",   color: "#007AFF" },
  { id: "Science",       label: "Science", color: "#34C759" },
  { id: "English",       label: "English", color: "#FF9500" },
  { id: "Social Science",label: "Social",  color: "#AF52DE" },
  { id: "Hindi",         label: "Hindi",   color: "#FF3B30" },
];

const SCIENCE_SUBS = {
  Physics:   ["Light — Reflection and Refraction","Human Eye and Colourful World","Electricity","Magnetic Effects of Electric Current","Sources of Energy"],
  Chemistry: ["Chemical Reactions and Equations","Acids, Bases and Salts","Metals and Non-metals","Carbon and Its Compounds","Periodic Classification of Elements"],
  Biology:   ["Life Processes","Control and Coordination","How Do Organisms Reproduce","Heredity and Evolution","Our Environment","Sustainable Management of Natural Resources"],
};

const PROFILE_STYLE = {
  "Deep Thinker":       { bg: "bg-apple-green/10",  text: "text-apple-green",  dot: "bg-apple-green"  },
  "Pattern Recognizer": { bg: "bg-apple-blue/10",   text: "text-apple-blue",   dot: "bg-apple-blue"   },
  "Surface Learner":    { bg: "bg-apple-orange/10", text: "text-apple-orange", dot: "bg-apple-orange" },
  "Overthinker":        { bg: "bg-apple-purple/10", text: "text-apple-purple", dot: "bg-apple-purple" },
  "Guesser":            { bg: "bg-apple-red/10",    text: "text-apple-red",    dot: "bg-apple-red"    },
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate  = useNavigate();
  const [report, setReport]         = useState(null);
  const [advice, setAdvice]         = useState(null);
  const [topics, setTopics]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [error, setError]           = useState("");
  const [aiUsage, setAiUsage]       = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [activeSubject, setActiveSubject] = useState(user?.subject || "Math");
  const [scienceSub,    setScienceSub]    = useState(null);

  // initial load — report + advice + ai usage (cache-stats is admin-only, fetched separately)
  useEffect(() => {
    Promise.all([getReport(), getAIAdvice(), getAIUsage()])
      .then(([r, a, u]) => {
        setReport(r.data);
        setAdvice(a.data?.advice || a.data);
        setAiUsage(u.data);
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401) {
          useAuthStore.getState().logout();
          navigate("/login", { replace: true });
        } else {
          setError("Could not connect to backend. Is it running?");
        }
      })
      .finally(() => setLoading(false));

    // cache stats are admin-only — fetch silently, ignore 403
    if (user?.role === "admin") {
      getAICacheStats().then((r) => setCacheStats(r.data)).catch(() => {});
    }
  }, []);

  // reload topics when subject tab changes
  useEffect(() => {
    setTopicsLoading(true);
    getTopics({ subject: activeSubject, grade: user?.grade || "10" })
      .then((r) => setTopics(r.data))
      .catch(() => setTopics([]))
      .finally(() => setTopicsLoading(false));
  }, [activeSubject, user?.grade]);

  if (loading) return <DashboardSkeleton />;

  if (error) return (
    <div className="card p-10 text-center max-w-md mx-auto mt-16">
      <div className="w-12 h-12 rounded-full bg-apple-red/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-apple-red text-xl">!</span>
      </div>
      <p className="text-[15px] font-semibold text-[var(--label)] mb-1">Connection Error</p>
      <p className="text-[13px] text-apple-gray">{error}</p>
      <p className="text-[12px] text-apple-gray3 mt-2">
        Run <code className="bg-apple-gray6 px-1.5 py-0.5 rounded text-apple-gray font-mono">npm run dev</code> in the backend folder.
      </p>
    </div>
  );

  const streak  = report?.streak ?? 0;
  const profile = PROFILE_STYLE[report?.thinkingProfile];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">
            Good {getGreeting()}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-[14px] text-apple-gray mt-0.5">Here's your performance overview</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-2 bg-apple-orange/10 px-4 py-2.5 rounded-apple-lg">
            <span className="text-lg">🔥</span>
            <div>
              <p className="text-[13px] font-semibold text-apple-orange">{streak} day streak</p>
              <p className="text-[11px] text-apple-orange/70">Keep it up!</p>
            </div>
          </div>
        )}
      </div>

      {/* Placement quiz nudge — shown once to users who haven't taken it yet */}
      {!user?.placementCompletedAt && (
        <div className="rounded-apple-lg border border-apple-blue/30 bg-apple-blue/5 px-5 py-4 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-apple-blue/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-apple-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-apple-blue">Take your Placement Quiz</p>
            <p className="text-[12px] text-apple-gray mt-0.5">A 20-question diagnostic that sets your practice difficulty automatically. Takes ~15 min.</p>
          </div>
          <button
            onClick={() => navigate("/placement-quiz")}
            className="shrink-0 px-4 py-2 bg-apple-blue text-white rounded-apple text-[13px] font-medium hover:bg-apple-blue/90 transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {/* Link requests — shown only to students */}
      {user?.role === "student" && <LinkRequestsCard />}

      {/* NPS survey — shown to any role when eligible */}
      <NPSSurveyBanner />

      {/* Primary stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Overall Accuracy"  value={`${report?.score ?? 0}%`}          sub="all topics"       accent="blue"   />
        <StatCard label="Questions Done"    value={report?.totalAttempts ?? 0}          sub="total attempts"   accent="green"  />
        <StatCard label="Weak Areas"        value={report?.weakAreas?.length ?? 0}      sub="need attention"   accent="orange" />
        <StatCard label="Strong Areas"      value={report?.strongAreas?.length ?? 0}    sub="mastered"         accent="purple" />
      </div>

      {/* AI usage row */}
      {(aiUsage || cacheStats) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {aiUsage && (
            <StatCard
              label="AI Calls Today"
              value={`${aiUsage.used}/${aiUsage.limit}`}
              sub={aiUsage.used >= aiUsage.limit ? "limit reached" : `${aiUsage.remaining} remaining`}
              accent={aiUsage.used >= aiUsage.limit ? "red" : "blue"}
            />
          )}
          {cacheStats && (
            <>
              <StatCard label="Cached Responses"   value={cacheStats.totalCachedResponses} sub="stored in DB"         accent="teal" />
              <StatCard label="Cache Hits"          value={cacheStats.totalCacheHits}        sub="free responses served" accent="teal" />
              <StatCard label="Claude Calls Saved"  value={cacheStats.totalClaudeCallsSaved} sub="across all users"     accent="green" />
            </>
          )}
        </div>
      )}

      {/* Thinking profile + AI Advice */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Thinking profile */}
        <div className="card p-6">
          <p className="section-label">Thinking Profile</p>
          {report?.thinkingProfile ? (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${profile?.bg || "bg-apple-gray6"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${profile?.dot || "bg-apple-gray"}`} />
              <span className={`text-[13px] font-semibold ${profile?.text || "text-apple-gray"}`}>
                {report.thinkingProfile}
              </span>
            </div>
          ) : (
            <p className="text-[13px] text-apple-gray mb-4">Complete some practice to see your profile.</p>
          )}

          {report?.weakAreas?.length > 0 && (
            <div className="mb-3">
              <p className="text-[11px] font-semibold text-apple-red uppercase tracking-wider mb-2">Weak Areas</p>
              <div className="flex flex-wrap gap-1.5">
                {report.weakAreas.map((a) => (
                  <span key={a} className="badge bg-apple-red/10 text-apple-red">{a}</span>
                ))}
              </div>
            </div>
          )}
          {report?.strongAreas?.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-apple-green uppercase tracking-wider mb-2">Strong Areas</p>
              <div className="flex flex-wrap gap-1.5">
                {report.strongAreas.map((a) => (
                  <span key={a} className="badge bg-apple-green/10 text-apple-green">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AI Coach advice */}
        <div className="card p-6 flex flex-col">
          <p className="section-label">AI Coach</p>
          <div className="flex-1 flex flex-col justify-between">
            <p className="text-[14px] text-[var(--label2)] leading-relaxed">
              {advice ?? "Complete some practice questions to get personalised advice from your AI coach."}
            </p>
            <button
              onClick={() => navigate("/practice")}
              className="btn-primary mt-5 self-start"
            >
              Start Practice →
            </button>
          </div>
        </div>
      </div>

      {/* Topic selector */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="section-label mb-0">Topics</p>
          <span className="text-[12px] text-apple-gray">{topics.length} available</span>
        </div>

        {/* Subject tabs */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {SUBJECTS.map(({ id, label, color }) => (
            <button
              key={id}
              onClick={() => { setActiveSubject(id); setScienceSub(null); }}
              className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all"
              style={
                activeSubject === id
                  ? { background: color, color: "#fff" }
                  : { background: color + "14", color }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Science sub-subject tabs */}
        {activeSubject === "Science" && (
          <div className="flex gap-1.5 mb-3">
            {["All", "Physics", "Chemistry", "Biology"].map((s) => (
              <button
                key={s}
                onClick={() => setScienceSub(s === "All" ? null : s)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
                  (s === "All" && !scienceSub) || scienceSub === s
                    ? "bg-[#34C759] text-white border-[#34C759]"
                    : "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20 hover:border-[#34C759]/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {topicsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div
              className="w-6 h-6 border-2 border-apple-gray5 rounded-full animate-spin"
              style={{ borderTopColor: SUBJECTS.find((s) => s.id === activeSubject)?.color || "#007AFF" }}
            />
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[13px] text-apple-gray">
              No topics found for {activeSubject}. Run{" "}
              <code className="bg-apple-gray6 px-1.5 py-0.5 rounded font-mono text-apple-gray">npm run seed</code>{" "}
              in the backend.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {(activeSubject === "Science" && scienceSub
              ? topics.filter((t) => SCIENCE_SUBS[scienceSub]?.includes(t.name))
              : topics
            ).map((t) => {
              const isWeak   = report?.weakAreas?.includes(t.name);
              const isStrong = report?.strongAreas?.includes(t.name);
              const subjectColor = SUBJECTS.find((s) => s.id === activeSubject)?.color || "#007AFF";
              return (
                <button
                  key={t._id}
                  onClick={() => navigate("/practice", { state: { topic: t.name }, replace: false })}
                  className="group flex items-start justify-between p-4 rounded-apple-lg bg-apple-gray6
                             border border-transparent
                             transition-[background-color,border-color,transform] duration-150 active:scale-[0.97] text-left"
                  style={{ "--hover-bg": subjectColor + "14", "--hover-border": subjectColor + "33" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = subjectColor + "14"; e.currentTarget.style.borderColor = subjectColor + "33"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.borderColor = "transparent"; }}
                >
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--label)] truncate">
                      {t.name}
                    </p>
                    <p className="text-[11px] text-apple-gray mt-0.5">{t.subject} · Grade {t.grade}</p>
                  </div>
                  {isWeak   && <span className="badge bg-apple-red/10 text-apple-red ml-2 shrink-0">Weak</span>}
                  {isStrong && <span className="badge bg-apple-green/10 text-apple-green ml-2 shrink-0">Strong</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function LinkRequestsCard() {
  const [requests, setRequests]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [acting,   setActing]     = useState(null); // id being acted on

  const load = useCallback(() => {
    getLinkRequests()
      .then(({ data }) => setRequests(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handle = async (id, action) => {
    setActing(id);
    try {
      await respondToLinkRequest(id, action);
      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch {
      // ignore — leave card visible so user can retry
    } finally { setActing(null); }
  };

  if (loading || requests.length === 0) return null;

  return (
    <div className="card p-5 border-l-4 border-apple-orange">
      <p className="section-label text-apple-orange">Link Requests</p>
      <div className="flex flex-col gap-3">
        {requests.map((r) => (
          <div key={r._id} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[var(--label)]">{r.requesterName}</p>
              <p className="text-[12px] text-apple-gray capitalize">{r.requesterRole} wants to view your progress</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                disabled={acting === r._id}
                onClick={() => handle(r._id, "reject")}
                className="btn-secondary text-[12px] px-3 py-1.5"
              >
                Decline
              </button>
              <button
                disabled={acting === r._id}
                onClick={() => handle(r._id, "accept")}
                className="btn-primary text-[12px] px-3 py-1.5"
              >
                {acting === r._id ? "…" : "Allow"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NPSSurveyBanner() {
  const [eligible, setEligible] = useState(false);
  const [score,    setScore]    = useState(null);
  const [comment,  setComment]  = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getNpsEligibility()
      .then(({ data }) => setEligible(data?.eligible === true))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (score === null) return;
    setSubmitting(true);
    try {
      await submitFeedback({ score, comment: comment.trim(), context: "nps" });
      setSubmitted(true);
    } catch { /* ignore */ }
    finally { setSubmitting(false); }
  };

  if (!eligible || dismissed) return null;

  if (submitted) {
    return (
      <div className="card p-4 border-l-4 border-apple-green flex items-center gap-3">
        <span className="text-apple-green text-lg">✓</span>
        <p className="text-[13px] text-[var(--label)]">Thanks for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="card p-5 border-l-4 border-apple-purple">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-[13px] font-semibold text-[var(--label)]">How likely are you to recommend us?</p>
          <p className="text-[11px] text-apple-gray mt-0.5">0 = Not at all likely · 10 = Extremely likely</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-apple-gray hover:text-apple-gray2 text-lg leading-none shrink-0 -mt-0.5"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* 0-10 score buttons */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => setScore(i)}
            className={`w-9 h-9 rounded-lg text-[13px] font-semibold transition-all ${
              score === i
                ? "bg-apple-purple text-white"
                : "bg-apple-gray6 text-[var(--label)] hover:bg-apple-purple/20"
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      {score !== null && (
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Any comments? (optional)"
          rows={2}
          maxLength={1000}
          className="w-full text-[13px] bg-apple-gray6 border border-apple-gray5 rounded-apple px-3 py-2
                     focus:outline-none focus:border-apple-purple resize-none mb-3"
        />
      )}

      <button
        disabled={score === null || submitting}
        onClick={handleSubmit}
        className="btn-primary disabled:opacity-40"
      >
        {submitting ? "Submitting…" : "Submit feedback"}
      </button>
    </div>
  );
}

function StatCard({ label, value, sub, accent }) {
  const accents = {
    blue:   { ring: "ring-apple-blue/20",   text: "text-apple-blue",   bg: "bg-apple-blue/8"   },
    green:  { ring: "ring-apple-green/20",  text: "text-apple-green",  bg: "bg-apple-green/8"  },
    orange: { ring: "ring-apple-orange/20", text: "text-apple-orange", bg: "bg-apple-orange/8" },
    purple: { ring: "ring-apple-purple/20", text: "text-apple-purple", bg: "bg-apple-purple/8" },
    red:    { ring: "ring-apple-red/20",    text: "text-apple-red",    bg: "bg-apple-red/8"    },
    teal:   { ring: "ring-apple-teal/20",   text: "text-apple-teal",   bg: "bg-apple-teal/8"   },
  };
  const a = accents[accent] || accents.blue;
  return (
    <div className={`card p-5 ring-1 ${a.ring} transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-apple-lg`}>
      <p className="text-[11px] font-medium text-apple-gray mb-2">{label}</p>
      <p className={`text-[26px] font-bold tracking-tight ${a.text}`}>{value}</p>
      <p className="text-[11px] text-apple-gray mt-1">{sub}</p>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}
