import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReport, getAIAdvice, getAIUsage, getAICacheStats, getTopics } from "../services/api";
import { useAuthStore } from "../store/authStore";

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

  // initial load — report + advice + ai stats
  useEffect(() => {
    Promise.all([getReport(), getAIAdvice(), getAIUsage(), getAICacheStats()])
      .then(([r, a, u, cs]) => {
        setReport(r.data);
        setAdvice(a.data?.advice || a.data);
        setAiUsage(u.data);
        setCacheStats(cs.data);
      })
      .catch(() => setError("Could not connect to backend. Is it running?"))
      .finally(() => setLoading(false));
  }, []);

  // reload topics when subject tab changes
  useEffect(() => {
    setTopicsLoading(true);
    getTopics({ subject: activeSubject, grade: user?.grade || "10" })
      .then((r) => setTopics(r.data))
      .catch(() => setTopics([]))
      .finally(() => setTopicsLoading(false));
  }, [activeSubject, user?.grade]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
        <p className="text-[13px] text-apple-gray">Loading dashboard…</p>
      </div>
    </div>
  );

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
