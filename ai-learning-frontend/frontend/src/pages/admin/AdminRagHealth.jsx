import { useEffect, useState } from "react";
import { adminGetRagHealth, adminSendTestEmail } from "../../services/api";

function StatusBadge({ indexed }) {
  return indexed ? (
    <span className="inline-flex items-center gap-1 text-apple-green text-[12px] font-medium">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M3 8l3.5 3.5L13 4" />
      </svg>
      Indexed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-apple-red text-[12px] font-medium">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
           strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
      Not indexed
    </span>
  );
}

export default function AdminRagHealth() {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const [emailTo,    setEmailTo]    = useState("");
  const [sending,    setSending]    = useState(false);
  const [emailMsg,   setEmailMsg]   = useState("");
  const [emailOk,    setEmailOk]    = useState(false);

  useEffect(() => {
    adminGetRagHealth()
      .then(({ data: res }) => setData(res.data ?? res))
      .catch(() => setError("Failed to load RAG health data."))
      .finally(() => setLoading(false));
  }, []);

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!emailTo.trim()) return;
    setSending(true);
    setEmailMsg("");
    setEmailOk(false);
    try {
      await adminSendTestEmail(emailTo.trim());
      setEmailMsg(`Test email sent to ${emailTo.trim()}.`);
      setEmailOk(true);
      setEmailTo("");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send test email — check server logs.";
      setEmailMsg(msg);
      setEmailOk(false);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <p className="text-apple-gray text-[14px]">Loading…</p>;
  if (error)   return <p className="text-apple-red text-[14px]">{error}</p>;

  const subjects   = data?.subjects   ?? [];
  const lastIndexed = data?.lastIndexed;

  const totalChunks   = subjects.reduce((s, sub) => s + (sub.chunks ?? 0), 0);
  const indexedCount  = subjects.filter((s) => s.indexed).length;

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold text-[var(--label)]">RAG Health</h1>
        {lastIndexed && (
          <p className="text-[12px] text-apple-gray">
            Last indexed:{" "}
            <span className="font-medium text-[var(--label)]">
              {new Date(lastIndexed).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </p>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <p className="text-[12px] text-apple-gray">Total Chunks</p>
          <p className="text-[28px] font-bold tabular-nums mt-1 text-[var(--label)]">
            {totalChunks.toLocaleString()}
          </p>
          <p className="text-[11px] text-apple-gray mt-0.5">across all subjects</p>
        </div>
        <div className="card p-5">
          <p className="text-[12px] text-apple-gray">Subjects Indexed</p>
          <p className="text-[28px] font-bold tabular-nums mt-1 text-apple-green">
            {indexedCount}
          </p>
          <p className="text-[11px] text-apple-gray mt-0.5">of {subjects.length} subjects</p>
        </div>
        <div className="card p-5">
          <p className="text-[12px] text-apple-gray">Not Indexed</p>
          <p className="text-[28px] font-bold tabular-nums mt-1 text-apple-red">
            {subjects.length - indexedCount}
          </p>
          <p className="text-[11px] text-apple-gray mt-0.5">subjects missing data</p>
        </div>
        <div className="card p-5">
          <p className="text-[12px] text-apple-gray">Coverage</p>
          <p className="text-[28px] font-bold tabular-nums mt-1 text-apple-blue">
            {subjects.length > 0
              ? `${Math.round((indexedCount / subjects.length) * 100)}%`
              : "—"}
          </p>
          <p className="text-[11px] text-apple-gray mt-0.5">subjects with ≥1 chunk</p>
        </div>
      </div>

      {/* Subject table */}
      <section className="space-y-3">
        <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-wider">
          Subject Breakdown
        </h2>
        {subjects.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-apple-gray text-[14px]">No subject data available.</p>
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-apple-gray5 text-left">
                  <th className="px-5 py-3 text-[11px] font-semibold text-apple-gray uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-apple-gray uppercase tracking-wider">
                    Chunks Indexed
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-apple-gray uppercase tracking-wider">
                    Chapters Covered
                  </th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-apple-gray uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub, i) => (
                  <tr
                    key={sub.subject ?? i}
                    className="border-b border-apple-gray5 last:border-0 hover:bg-apple-gray6 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-[var(--label)] capitalize">
                      {sub.subject ?? "—"}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-[var(--label2)]">
                      {(sub.chunks ?? 0).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-[var(--label2)]">
                      {sub.chapters ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge indexed={sub.indexed} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Send test email */}
      <section className="card p-5 space-y-3">
        <h2 className="text-[15px] font-semibold text-[var(--label)]">Send Test Email</h2>
        <p className="text-[12px] text-apple-gray">
          Send a test email to verify email delivery is working correctly.
        </p>
        <form onSubmit={handleSendTestEmail} className="flex gap-3 flex-wrap items-end">
          <div className="flex flex-col gap-1">
            <label className="section-label">Email address</label>
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="recipient@example.com"
              required
              className="input text-[13px] w-64"
            />
          </div>
          <button
            type="submit"
            disabled={sending || !emailTo.trim()}
            className="btn-primary text-[13px] px-4 py-2 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send Test Email"}
          </button>
        </form>
        {emailMsg && (
          <p className={`text-[13px] font-medium ${emailOk ? "text-apple-green" : "text-apple-red"}`}>
            {emailMsg}
          </p>
        )}
      </section>
    </div>
  );
}
