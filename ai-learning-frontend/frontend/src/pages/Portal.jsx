import { useNavigate } from "react-router-dom";

export default function Portal() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-[var(--label)]">Parent / Teacher Access</h1>
        <p className="text-[13px] text-apple-gray mt-1">
          Parents and teachers can view any student's progress directly — no invite code needed.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent,#007AFF)]/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" fill="none" stroke="var(--accent,#007AFF)" strokeWidth="1.5"
                 strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="5.5" cy="5" r="2.5"/><path d="M1 13.5a4.5 4.5 0 019 0"/>
              <circle cx="12" cy="6" r="2"/><path d="M10 13.5a3 3 0 016 0"/>
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[var(--label)]">Go to Parent Dashboard</p>
            <p className="text-[12px] text-apple-gray mt-0.5">
              Search for a student by name and instantly view their accuracy, streak, weekly practice, and more.
            </p>
          </div>
        </div>

        <button onClick={() => navigate("/parent")} className="btn-primary w-full">
          Open Parent Dashboard
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
             strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-apple-gray">
          <rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 016 0v2"/>
        </svg>
        <p className="text-[11px] text-apple-gray">Read-only view · private chats and notes are never shared</p>
      </div>
    </div>
  );
}
