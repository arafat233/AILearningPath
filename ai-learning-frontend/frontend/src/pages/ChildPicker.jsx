import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChildren } from "../services/api";
import { useAuthStore } from "../store/authStore";

const COLORS = ["#007AFF","#34C759","#FF9500","#AF52DE","#FF3B30","#5AC8FA","#FF2D55"];

function avatar(name, idx) {
  return { letter: name?.[0]?.toUpperCase() || "?", color: COLORS[idx % COLORS.length] };
}

export default function ChildPicker() {
  const navigate = useNavigate();
  const { setActiveChild } = useAuthStore();
  const [children, setChildren] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getChildren()
      .then((r) => {
        const kids = r.data.data.children || [];
        if (kids.length === 0) {
          navigate("/onboarding", { replace: true });
        } else if (kids.length === 1) {
          setActiveChild(kids[0]);
          navigate("/", { replace: true });
        } else {
          setChildren(kids);
          setLoading(false);
        }
      })
      .catch(() => navigate("/onboarding", { replace: true }));
  }, []);

  const pick = (child) => {
    setActiveChild(child);
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-[24px] font-bold text-[var(--label)] tracking-tight">Who are we studying for?</h1>
          <p className="text-[14px] text-apple-gray mt-1">Select a profile to continue</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {children.map((child, i) => {
            const { letter, color } = avatar(child.name, i);
            return (
              <button
                key={child._id}
                onClick={() => pick(child)}
                className="card p-5 text-left hover:border-apple-blue hover:shadow-apple-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-[20px] font-bold mb-3"
                     style={{ background: color }}>
                  {letter}
                </div>
                <p className="text-[15px] font-semibold text-[var(--label)] group-hover:text-apple-blue transition-colors">
                  {child.name}
                </p>
                <p className="text-[12px] text-apple-gray mt-0.5">
                  Class {child.grade} · {child.examBoard}
                </p>
                {child.schoolName && (
                  <p className="text-[11px] text-apple-gray3 mt-0.5 truncate">{child.schoolName}</p>
                )}
              </button>
            );
          })}

          {/* Add another child */}
          <button
            onClick={() => navigate("/onboarding")}
            className="card p-5 text-left border-dashed hover:border-apple-blue transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-apple-gray6 mb-3 group-hover:bg-apple-blue/10 transition-colors">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" className="w-5 h-5 text-apple-gray group-hover:text-apple-blue transition-colors">
                <path d="M8 3v10M3 8h10"/>
              </svg>
            </div>
            <p className="text-[14px] font-medium text-apple-gray group-hover:text-apple-blue transition-colors">
              Add another child
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
