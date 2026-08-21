import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCareer, setCareerPathApi, toggleScholarshipApi } from "../services/api";

export default function CareerPath() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null); // expanded path key

  useEffect(() => {
    getCareer()
      .then(({ data }) => {
        const d = data.data;
        setData(d);
        setOpen(d.careerPath || null);
      })
      .catch((err) => setError(err.response?.data?.error || "Could not load career paths"));
  }, []);

  const choosePath = async (key) => {
    const next = data.careerPath === key ? null : key;
    setData({ ...data, careerPath: next });
    setOpen(next || key);
    try { await setCareerPathApi(next); } catch { /* optimistic; refetch on next visit */ }
  };

  const toggleTrack = async (id) => {
    setData({
      ...data,
      scholarships: data.scholarships.map((s) => (s.id === id ? { ...s, tracked: !s.tracked } : s)),
    });
    try { await toggleScholarshipApi(id); } catch { /* optimistic */ }
  };

  if (error) return <div className="max-w-3xl mx-auto p-6 text-[14px] text-red-500">{error}</div>;
  if (!data) return <div className="max-w-3xl mx-auto p-6 text-[14px] text-apple-gray">Loading…</div>;

  const tracked = data.scholarships.filter((s) => s.tracked);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#1c1c1e]">Career Path</h1>
        <p className="text-[13px] text-apple-gray mt-1">
          Pick where you want to end up — get the roadmap, the exams, and the scholarships along the way.
        </p>
      </div>

      {/* Roadmap picker */}
      <div className="space-y-3">
        {data.paths.map((p) => {
          const chosen = data.careerPath === p.key;
          const expanded = open === p.key;
          return (
            <div key={p.key} className={`rounded-2xl bg-white border shadow-sm transition-colors ${chosen ? "border-[#1a1040]" : "border-[#f0f0f5]"}`}>
              <button onClick={() => setOpen(expanded ? null : p.key)} className="w-full text-left px-5 py-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#1c1c1e]">{p.title}</p>
                  <p className="text-[12px] text-apple-gray mt-0.5">{p.tagline}</p>
                </div>
                {chosen && <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#1a1040] text-white text-[11px] font-bold">My path ✓</span>}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round"
                  className={`shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {expanded && (
                <div className="px-5 pb-5 space-y-4 border-t border-[#f5f5fa] pt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {p.exams.map((e) => (
                      <span key={e} className="px-2.5 py-1 rounded-full bg-[#f5f5fa] text-[11px] font-semibold text-[#3A3A3C]">{e}</span>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {p.stages.map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-[#1a1040] text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#1c1c1e]">{s.title}</p>
                          <p className="text-[12px] text-apple-gray leading-relaxed mt-0.5">{s.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => choosePath(p.key)}
                      className={`px-4 py-2 rounded-full text-[12px] font-bold transition-colors ${
                        chosen ? "bg-[#f5f5fa] text-[#3A3A3C]" : "bg-[#1a1040] text-white hover:opacity-90"
                      }`}>
                      {chosen ? "Unset my path" : "Make this my path"}
                    </button>
                    {p.appLinks.map((l) => (
                      <button key={l.to + l.label} onClick={() => navigate(l.to)}
                        className="px-3 py-2 rounded-full bg-white border border-[#f0f0f5] text-[12px] font-semibold text-[#3A3A3C] hover:border-[#d0d0d8]">
                        {l.label} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scholarship tracker */}
      <div className="rounded-2xl bg-white border border-[#f0f0f5] shadow-sm p-5">
        <div className="flex items-baseline justify-between flex-wrap gap-2 mb-1">
          <p className="text-[15px] font-semibold text-[#1c1c1e]">Scholarships & talent exams{data.grade ? ` for Class ${data.grade}` : ""}</p>
          {tracked.length > 0 && <span className="text-[11px] font-semibold text-apple-gray">Tracking {tracked.length}</span>}
        </div>
        <p className="text-[11px] text-apple-gray mb-4">Windows are indicative — always verify dates on the official site.</p>
        {data.scholarships.length === 0 ? (
          <p className="text-[12px] text-apple-gray">No scholarships listed for your grade yet.</p>
        ) : (
          <div className="space-y-3">
            {data.scholarships.map((s) => (
              <div key={s.id} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1c1c1e]">{s.name} <span className="font-normal text-apple-gray">· {s.body}</span></p>
                  <p className="text-[12px] text-apple-gray mt-0.5">{s.award} · <span className="font-medium">{s.typicalWindow}</span></p>
                  <p className="text-[11px] text-apple-gray mt-0.5">{s.note}</p>
                </div>
                <button onClick={() => toggleTrack(s.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-colors ${
                    s.tracked ? "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/30" : "bg-white text-[#3A3A3C] border-[#f0f0f5] hover:border-[#d0d0d8]"
                  }`}>
                  {s.tracked ? "Tracking ✓" : "+ Track"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
