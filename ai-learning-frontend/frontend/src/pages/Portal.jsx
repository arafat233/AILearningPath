import { useEffect, useState } from "react";
import { generateInvite, linkStudent, getLinkedStudents, getStudentAnalytics } from "../services/api";
import { useAuthStore } from "../store/authStore";

export default function Portal() {
  const user = useAuthStore((s) => s.user);
  const [inviteCode, setInviteCode]   = useState("");
  const [linkInput, setLinkInput]     = useState("");
  const [students, setStudents]       = useState([]);
  const [selected, setSelected]       = useState(null);
  const [analytics, setAnalytics]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [msg, setMsg]                 = useState("");

  useEffect(() => {
    if (user?.role === "parent" || user?.role === "teacher") {
      getLinkedStudents().then((r) => setStudents(r.data)).catch(() => {});
    }
  }, [user?.role]);

  const genCode = async () => {
    const { data } = await generateInvite();
    setInviteCode(data.inviteCode);
  };

  const link = async () => {
    if (!linkInput.trim()) return;
    setLoading(true);
    try {
      const { data } = await linkStudent(linkInput.trim());
      setStudents((s) => [...s, data.student]);
      setLinkInput("");
      setMsg(`Linked ${data.student.name} successfully!`);
    } catch (err) {
      setMsg(err.response?.data?.error || "Invalid invite code.");
    } finally { setLoading(false); }
  };

  const viewStudent = async (studentId) => {
    setSelected(studentId);
    setAnalytics(null);
    const { data } = await getStudentAnalytics(studentId).catch(() => ({ data: null }));
    setAnalytics(data);
  };

  const isParent = user?.role === "parent" || user?.role === "teacher";

  if (!isParent) {
    // Student view — generate invite code
    return (
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Share Your Progress</h1>
          <p className="text-[14px] text-apple-gray mt-0.5">Generate an invite code so a parent or teacher can view your analytics.</p>
        </div>
        <div className="card p-5 space-y-4">
          <button onClick={genCode} className="btn-primary">Generate Invite Code</button>
          {inviteCode && (
            <div className="bg-apple-blue/8 border border-apple-blue/20 rounded-apple-xl px-5 py-4 text-center">
              <p className="text-[12px] text-apple-gray mb-1">Share this code with your parent or teacher</p>
              <p className="text-[28px] font-bold tracking-[0.3em] text-apple-blue">{inviteCode}</p>
              <p className="text-[11px] text-apple-gray mt-1">They enter this on their Portal page to link to you</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Student Portal</h1>
        <p className="text-[14px] text-apple-gray mt-0.5">View linked students' progress read-only.</p>
      </div>

      {msg && (
        <div className="bg-apple-green/8 border border-apple-green/20 text-apple-green text-[13px] px-4 py-3 rounded-apple-lg">{msg}</div>
      )}

      {/* Link a student */}
      <div className="card p-5 space-y-3">
        <h2 className="text-[15px] font-semibold text-[var(--label)]">Link a Student</h2>
        <div className="flex gap-3">
          <input
            className="input flex-1 uppercase tracking-widest"
            placeholder="Enter invite code (e.g. A3F2B1C4)"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value.toUpperCase())}
            maxLength={8}
          />
          <button onClick={link} disabled={loading || !linkInput} className="btn-primary">
            {loading ? "Linking…" : "Link"}
          </button>
        </div>
      </div>

      {/* Student list */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {students.map((s) => (
            <button
              key={s._id || s.id}
              onClick={() => viewStudent(s._id || s.id)}
              className={`card p-4 text-left hover:border-apple-blue/30 transition-colors ${
                selected === (s._id || s.id) ? "border-apple-blue" : ""
              }`}
            >
              <p className="font-semibold text-[var(--label)] text-[14px]">{s.name}</p>
              <p className="text-[12px] text-apple-gray">{s.subject} • Grade {s.grade}</p>
              <p className="text-[12px] text-apple-gray">{s.email}</p>
            </button>
          ))}
        </div>
      )}

      {students.length === 0 && (
        <div className="card p-8 text-center text-apple-gray text-[14px]">
          No students linked yet. Ask your student to generate an invite code from their Portal page.
        </div>
      )}

      {/* Student analytics */}
      {selected && (
        <div className="card p-5 space-y-4">
          {!analytics ? (
            <p className="text-apple-gray text-[13px]">Loading…</p>
          ) : (
            <>
              <h2 className="text-[16px] font-semibold text-[var(--label)]">Analytics</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  ["Accuracy",       `${Math.round((analytics.profile?.accuracy || 0) * 100)}%`],
                  ["Current Streak", `${analytics.streak?.currentStreak || 0} days`],
                  ["Total Attempts", analytics.profile?.totalAttempts || 0],
                ].map(([label, value]) => (
                  <div key={label} className="text-center">
                    <p className="text-[12px] text-apple-gray">{label}</p>
                    <p className="text-[20px] font-bold text-[var(--label)] mt-1">{value}</p>
                  </div>
                ))}
              </div>
              {analytics.profile?.weakAreas?.length > 0 && (
                <div>
                  <p className="text-[12px] text-apple-gray mb-1">Weak Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.profile.weakAreas.map((w) => (
                      <span key={w} className="text-[12px] bg-apple-red/8 text-apple-red px-2 py-0.5 rounded-full">{w}</span>
                    ))}
                  </div>
                </div>
              )}
              {analytics.badges?.length > 0 && (
                <div>
                  <p className="text-[12px] text-apple-gray mb-2">Badges</p>
                  <div className="flex flex-wrap gap-2">
                    {analytics.badges.map((b) => (
                      <span key={b._id} className="text-[12px] bg-apple-yellow/10 text-apple-yellow px-2 py-0.5 rounded-full">
                        {b.badgeType.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
