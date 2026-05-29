/**
 * StartOnboarding — /start
 *
 * Three states:
 *   1. Not logged in           → invite to register / log in
 *   2. Effective profile (activeChild ?? user) already has board+grade → redirect to /
 *   3. Logged in, effective profile is missing board or grade → show picker form
 *
 * When viewing-as-child (activeChild set):
 *   - Form greets, pre-fills, and SAVES to the child via PUT /user/children/:id
 *   - Store's activeChild is updated with the response so the rest of the app
 *     immediately reflects the new board/grade without a refresh.
 *
 * When no activeChild:
 *   - Behaves like before — PUT /user/me on the logged-in user.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { updateMe, updateChild } from "../services/api";

const BOARDS = ["CBSE", "ICSE", "AP_SSC", "IB", "SSC", "State Board"];

const GRADES = [
  { value: "1",  label: "Grade 1"  },
  { value: "2",  label: "Grade 2"  },
  { value: "3",  label: "Grade 3"  },
  { value: "4",  label: "Grade 4"  },
  { value: "5",  label: "Grade 5"  },
  { value: "6",  label: "Grade 6"  },
  { value: "7",  label: "Grade 7"  },
  { value: "8",  label: "Grade 8"  },
  { value: "9",  label: "Grade 9"  },
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
];

export default function StartOnboarding() {
  const navigate     = useNavigate();
  const { user, activeChild, setAuth, setActiveChild } = useAuthStore((s) => ({
    user:           s.user,
    activeChild:    s.activeChild,
    setAuth:        s.setAuth,
    setActiveChild: s.setActiveChild,
  }));

  const effective = activeChild || user;

  // Already set up — send straight to the app. Schema defaults set examBoard
  // and grade on every new user, so we ALSO require an explicit `school`
  // track entry; without it the user hasn't actually completed onboarding.
  const hasSchoolTrack = (effective?.tracks || []).some((t) => t.key === "school");
  if (effective?.examBoard && effective?.grade && hasSchoolTrack) {
    navigate("/", { replace: true });
    return null;
  }

  // Not logged in — invite
  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
        <div className="card p-10 w-full max-w-md text-center">
          {/* Logo mark */}
          <div className="w-14 h-14 rounded-2xl bg-apple-blue flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl font-bold">S</span>
          </div>

          <h1 className="text-[22px] font-bold text-[var(--label)] mb-2">
            Welcome to Stellar
          </h1>
          <p className="text-[14px] text-[var(--label2)] mb-8">
            Create a free account or log in to access personalised lessons and practice for your board and grade.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/register"
              className="btn-primary w-full text-center py-3 text-[15px] font-semibold rounded-xl"
            >
              Create free account
            </Link>
            <Link
              to="/login"
              className="btn-secondary w-full text-center py-3 text-[15px] font-semibold rounded-xl"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in, board+grade missing — show picker
  return (
    <SetupForm
      effective={effective}
      user={user}
      activeChild={activeChild}
      setAuth={setAuth}
      setActiveChild={setActiveChild}
      navigate={navigate}
    />
  );
}

function SetupForm({ effective, user, activeChild, setAuth, setActiveChild, navigate }) {
  const [board, setBoard] = useState(effective?.examBoard || "");
  const [grade, setGrade] = useState(effective?.grade     || "");
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const valid = board && grade;
  const targetName = effective?.name?.split(" ")[0] || "there";
  const isChildContext = !!activeChild;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setError("");
    try {
      if (isChildContext) {
        const { data } = await updateChild(activeChild._id, { examBoard: board, grade });
        // Server response includes tracks[] (it seeds school on first onboarding).
        // If the response is missing tracks (legacy shape), top up locally so the
        // OnboardingGate doesn't bounce the user back to /welcome.
        const serverChild = data?.data?.child;
        const updated = serverChild
          ? { ...activeChild, ...serverChild, tracks: serverChild.tracks || [{ key: "school" }] }
          : { ...activeChild, examBoard: board, grade, tracks: [{ key: "school" }] };
        setActiveChild(updated);
      } else {
        const { data } = await updateMe({ examBoard: board, grade });
        const serverUser = data?.user || data?.data;
        const updated = serverUser
          ? { ...user, ...serverUser, tracks: serverUser.tracks || [{ key: "school" }] }
          : { ...user, examBoard: board, grade, tracks: [{ key: "school" }] };
        setAuth(null, updated);
      }
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="card p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-apple-blue flex items-center justify-center mx-auto mb-5">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
          <h1 className="text-[22px] font-bold text-[var(--label)] mb-1">
            {isChildContext ? `Finish setting up ${targetName}` : "Set up your learning"}
          </h1>
          <p className="text-[14px] text-[var(--label2)]">
            {isChildContext
              ? `Choose ${targetName}'s board and grade to unlock personalised content.`
              : `Hi ${targetName} — choose your board and grade to unlock your personalised content.`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Board picker */}
          <div>
            <label className="block text-[13px] font-semibold text-[var(--label2)] mb-2 uppercase tracking-wide">
              Exam Board
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BOARDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBoard(b)}
                  className={[
                    "py-2.5 px-3 rounded-xl text-[14px] font-semibold border transition-all",
                    board === b
                      ? "bg-apple-blue text-white border-apple-blue shadow-sm"
                      : "bg-[var(--fill)] text-[var(--label)] border-[var(--separator)] hover:border-apple-blue/60",
                  ].join(" ")}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Grade picker */}
          <div>
            <label className="block text-[13px] font-semibold text-[var(--label2)] mb-2 uppercase tracking-wide">
              Grade
            </label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {GRADES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGrade(value)}
                  className={[
                    "py-2.5 rounded-xl text-[14px] font-semibold border transition-all",
                    grade === value
                      ? "bg-apple-blue text-white border-apple-blue shadow-sm"
                      : "bg-[var(--fill)] text-[var(--label)] border-[var(--separator)] hover:border-apple-blue/60",
                  ].join(" ")}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[13px] text-apple-red text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={!valid || saving}
            className="btn-primary w-full py-3 text-[15px] font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed mt-1"
          >
            {saving ? "Saving…" : "Start learning →"}
          </button>
        </form>

        <p className="text-center text-[12px] text-[var(--label3)] mt-6">
          You can change these later in Settings.
        </p>
      </div>
    </div>
  );
}
