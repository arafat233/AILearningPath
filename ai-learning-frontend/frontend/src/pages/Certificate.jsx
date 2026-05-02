import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getReport, getMe } from "../services/api";
import { useAuthStore } from "../store/authStore";

// Inject/remove @media print styles that hide the sidebar so only the
// certificate fills the page when the user saves as PDF.
function usePrintStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "cert-print";
    style.textContent = `
      @media print {
        aside, header, nav, button, .no-print { display: none !important; }
        main { padding: 0 !important; background: white !important; }
        #certificate-root {
          display: flex !important;
          justify-content: center !important;
          align-items: flex-start !important;
          min-height: 100vh !important;
          padding: 0 !important;
        }
        #certificate-card {
          box-shadow: none !important;
          border: 2px solid #c9aa71 !important;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          page-break-inside: avoid;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById("cert-print")?.remove();
  }, []);
}

function Stat({ label, value, sub }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl bg-[#faf7f0] border border-[#e8dfc8]">
      <span className="text-[28px] font-bold text-[#1a1a1a] leading-none">{value}</span>
      {sub && <span className="text-[11px] text-[#c9aa71] font-semibold uppercase tracking-widest">{sub}</span>}
      <span className="text-[12px] text-[#8e8e93] mt-0.5">{label}</span>
    </div>
  );
}

export default function Certificate() {
  const { user } = useAuthStore();
  const navigate  = useNavigate();
  const [report,  setReport]  = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  usePrintStyles();

  useEffect(() => {
    Promise.all([getReport(), getMe()])
      .then(([repRes, meRes]) => {
        setReport(repRes.data);
        setProfile(meRes.data.data.profile);
      })
      .catch(() => setError("Could not load your progress data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-apple-red text-[13px]">{error}</p>
    </div>
  );

  const hasData = (report?.totalAttempts ?? 0) > 0;
  if (!hasData) return (
    <div className="max-w-lg mx-auto text-center py-20 space-y-4">
      <div className="w-16 h-16 rounded-full bg-apple-gray5 flex items-center justify-center mx-auto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
             className="w-8 h-8 text-apple-gray">
          <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/>
        </svg>
      </div>
      <h2 className="text-[18px] font-bold text-[var(--label)]">No certificate yet</h2>
      <p className="text-[13px] text-apple-gray">Complete at least one practice session to earn your certificate.</p>
      <button className="btn-primary px-6 py-2.5" onClick={() => navigate("/practice")}>
        Start Practising
      </button>
    </div>
  );

  const topicsMastered = (report.topicStats ?? []).filter((t) => t.accuracy >= 70).length;
  const issued = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const name   = user?.name ?? "Student";
  const grade  = user?.grade ?? "10";
  const subject = user?.subject ?? "Mathematics";

  const handlePrint = () => {
    const after = () => { window.removeEventListener("afterprint", after); };
    window.addEventListener("afterprint", after);
    window.print();
  };

  return (
    <div id="certificate-root" className="max-w-3xl mx-auto space-y-5">
      {/* Actions — hidden when printing */}
      <div className="no-print flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Certificate</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">Your achievement certificate — save as PDF from the print dialog</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary px-4 py-2 text-[13px]" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="btn-primary px-5 py-2 text-[13px] flex items-center gap-2" onClick={handlePrint}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M3 6V2h10v4M3 11H1V6h14v5h-2"/>
              <rect x="3" y="9" width="10" height="5" rx="1"/>
              <path d="M5 3h2M11 11H5"/>
            </svg>
            Save as PDF
          </button>
        </div>
      </div>

      {/* Certificate card */}
      <div
        id="certificate-card"
        className="bg-white rounded-2xl shadow-apple-lg overflow-hidden"
        style={{ border: "2px solid #c9aa71" }}
      >
        {/* Gold top bar */}
        <div style={{ background: "linear-gradient(135deg, #c9aa71 0%, #e8d5a3 50%, #c9aa71 100%)", height: 8 }} />

        <div className="px-12 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-apple-blue flex items-center justify-center shadow-sm">
                <span className="text-white text-base font-bold">A</span>
              </div>
              <div className="text-left">
                <p className="text-[14px] font-bold text-[#1a1a1a] leading-tight">AI Learning</p>
                <p className="text-[11px] text-[#8e8e93]">CBSE Practice Platform</p>
              </div>
            </div>

            {/* Decorative rule */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #c9aa71)" }} />
              <svg viewBox="0 0 24 24" fill="#c9aa71" className="w-5 h-5 shrink-0">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
              </svg>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #c9aa71)" }} />
            </div>

            <p className="text-[11px] font-semibold tracking-[0.25em] text-[#c9aa71] uppercase mb-2">
              Certificate of Achievement
            </p>
            <p className="text-[13px] text-[#6e6e73] mb-6">This is to certify that</p>

            <h2 className="text-[38px] font-bold text-[#1a1a1a] tracking-tight leading-tight mb-2"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {name}
            </h2>
            <p className="text-[14px] text-[#6e6e73]">
              Class {grade} · {subject}
            </p>
          </div>

          {/* Body text */}
          <div className="text-center mb-8">
            <p className="text-[14px] text-[#3c3c43] leading-relaxed max-w-md mx-auto">
              has demonstrated consistent effort and academic progress through
              dedicated practice sessions on the AI Learning Platform.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            <Stat label="Accuracy"          value={`${report.score}%`}      sub="overall" />
            <Stat label="Questions answered" value={report.totalAttempts}    sub="total"   />
            <Stat label="Topics mastered"   value={topicsMastered}          sub="≥70%"    />
            <Stat label="Longest streak"    value={`${report.longestStreak ?? 0}d`} sub="days" />
          </div>

          {/* Strong areas */}
          {report.strongAreas?.length > 0 && (
            <div className="mb-8 text-center">
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#c9aa71] uppercase mb-3">
                Strong Areas
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {report.strongAreas.slice(0, 6).map((topic) => (
                  <span key={topic}
                        className="px-3 py-1 rounded-full text-[12px] font-medium text-[#3c3c43]"
                        style={{ background: "#faf7f0", border: "1px solid #e8dfc8" }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Decorative rule + date */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #c9aa71)" }} />
            <svg viewBox="0 0 24 24" fill="#c9aa71" className="w-4 h-4 shrink-0">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
            </svg>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #c9aa71)" }} />
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-[#8e8e93] mb-1">Issued on</p>
              <p className="text-[13px] font-semibold text-[#1a1a1a]">{issued}</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-[#c9aa71] mb-1" />
              <p className="text-[11px] text-[#8e8e93]">AI Learning Platform</p>
            </div>
          </div>
        </div>

        {/* Gold bottom bar */}
        <div style={{ background: "linear-gradient(135deg, #c9aa71 0%, #e8d5a3 50%, #c9aa71 100%)", height: 8 }} />
      </div>
    </div>
  );
}
