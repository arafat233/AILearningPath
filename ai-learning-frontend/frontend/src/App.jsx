import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useTrackStore } from "./store/trackStore";
import { getMe } from "./services/api";

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error("Uncaught render error:", err, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4">
        <div className="card p-10 max-w-sm w-full text-center">
          <div className="w-12 h-12 rounded-full bg-apple-red/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-apple-red text-xl font-bold">!</span>
          </div>
          <h2 className="text-[17px] font-bold text-[var(--label)] mb-2">Something went wrong</h2>
          <p className="text-[13px] text-apple-gray mb-6">An unexpected error occurred. Reload to continue.</p>
          <button onClick={() => window.location.reload()} className="btn-primary w-full">Reload page</button>
        </div>
      </div>
    );
  }
}

// Shell — always needed, loaded eagerly so the frame never flickers
import Layout  from "./components/Layout";
import Landing from "./pages/Landing";

// Route-level code splitting — each page loads only when navigated to
const Login            = lazy(() => import("./pages/Login"));
const Register         = lazy(() => import("./pages/Register"));
const Onboarding       = lazy(() => import("./pages/Onboarding"));
const StartOnboarding  = lazy(() => import("./pages/StartOnboarding"));
const Dashboard        = lazy(() => import("./pages/DashboardSwitch"));
// Pro-track pages — only loaded on /pro/* (PRO_TRACK_PLAN.md §10 Phase 6)
const Welcome          = lazy(() => import("./pages/Welcome"));
const Tracks           = lazy(() => import("./pages/Tracks"));
const ProOnboarding    = lazy(() => import("./pages/onboarding/Pro"));
const ProTrackPicker   = lazy(() => import("./pages/professional/ProTrackPicker"));
const ProCourseLanding = lazy(() => import("./pages/professional/ProCourseLanding"));
const ProModuleView    = lazy(() => import("./pages/professional/ProModuleView"));
const ProTopicView     = lazy(() => import("./pages/professional/ProTopicView"));
const ProExerciseRunner= lazy(() => import("./pages/professional/ProExerciseRunner"));
const ProReview        = lazy(() => import("./pages/professional/ProReview"));
const ProPatternAtlas  = lazy(() => import("./pages/professional/ProPatternAtlas"));
const ProTopicPublic      = lazy(() => import("./pages/professional/ProTopicPublic"));
const InterviewLanding    = lazy(() => import("./pages/professional/InterviewLanding"));
const ProProjectView      = lazy(() => import("./pages/professional/ProProjectView"));
const InterviewSimulator  = lazy(() => import("./pages/professional/InterviewSimulator"));
const InterviewHistory    = lazy(() => import("./pages/professional/InterviewHistory"));
const Lessons          = lazy(() => import("./pages/Lessons"));
const LessonView       = lazy(() => import("./pages/LessonView"));
const Practice         = lazy(() => import("./pages/PracticeSwitch"));
const Bookmarks        = lazy(() => import("./pages/BookmarksSwitch"));
const SharedCollection = lazy(() => import("./pages/SharedCollection"));
const PublicProfile    = lazy(() => import("./pages/PublicProfile"));
const Analytics        = lazy(() => import("./pages/Analytics"));
const Competition      = lazy(() => import("./pages/Competition"));
const LiveRoom         = lazy(() => import("./pages/LiveRoom"));
const Planner          = lazy(() => import("./pages/Planner"));
const Profile          = lazy(() => import("./pages/Profile"));
const Settings         = lazy(() => import("./pages/Settings"));
const VoiceTutor       = lazy(() => import("./pages/VoiceTutor"));
const ExamReview       = lazy(() => import("./pages/ExamReview"));
const Portal           = lazy(() => import("./pages/Portal"));
const ChapterView      = lazy(() => import("./pages/ChapterView"));
const NcertChapterView = lazy(() => import("./pages/NcertChapterView"));
const NcertTopicView   = lazy(() => import("./pages/NcertTopicView"));
const Pricing          = lazy(() => import("./pages/Pricing"));
const ForgotPassword   = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword    = lazy(() => import("./pages/ResetPassword"));
const AdminLayout      = lazy(() => import("./pages/admin/AdminLayout"));
const AdminOverview    = lazy(() => import("./pages/admin/AdminOverview"));
const AdminUsers       = lazy(() => import("./pages/admin/AdminUsers"));
const AdminQuestions   = lazy(() => import("./pages/admin/AdminQuestions"));
const AdminTopics      = lazy(() => import("./pages/admin/AdminTopics"));
const AdminCacheStats  = lazy(() => import("./pages/admin/AdminCacheStats"));
const AdminAnalytics   = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminCoupons        = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminCertificates   = lazy(() => import("./pages/admin/AdminCertificates"));
const MockPaper           = lazy(() => import("./pages/MockPaper"));
const AdminPayments    = lazy(() => import("./pages/admin/AdminPayments"));
const AdminNPS         = lazy(() => import("./pages/admin/AdminNPS"));
const AdminRagHealth   = lazy(() => import("./pages/admin/AdminRagHealth"));
const AdminRetention   = lazy(() => import("./pages/admin/AdminRetention"));
const CompanyLogin     = lazy(() => import("./pages/CompanyLogin"));
const CompanyDashboard = lazy(() => import("./pages/CompanyDashboard"));
const PYQBank          = lazy(() => import("./pages/PYQBank"));
const ParentDashboard  = lazy(() => import("./pages/ParentDashboard"));
const TermsOfService   = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy    = lazy(() => import("./pages/PrivacyPolicy"));
const Certificate      = lazy(() => import("./pages/Certificate"));
const PlacementQuiz    = lazy(() => import("./pages/PlacementQuiz"));
const SchoolGroups     = lazy(() => import("./pages/SchoolGroups"));
const SharedPlan       = lazy(() => import("./pages/SharedPlan"));
const ChildPicker      = lazy(() => import("./pages/ChildPicker"));

function PageSpinner() {
  return (
    <div className="min-h-screen bg-apple-gray6 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-apple-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// SEC-03: check user object (persisted from login) not the JWT (now in httpOnly cookie)
const Protected = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/" replace />;
};

const PublicOnly = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  return user ? <Navigate to="/" replace /> : children;
};

/**
 * BoardGated — wraps content routes that require board+grade to be set.
 * Uses `activeChild || user` as the effective identity (parent-as-child flow).
 * If the effective account has no examBoard or grade, redirects to /start.
 */
const BoardGated = ({ children }) => {
  const { user, activeChild } = useAuthStore((s) => ({
    user:        s.user,
    activeChild: s.activeChild,
  }));
  const activeTrack = useTrackStore((s) => s.activeTrack);
  const effective = activeChild || user;
  // Pro-track users don't have examBoard/grade — they enrolled via the pro flow
  if (activeTrack?.startsWith("pro_")) return children;
  if (!effective?.examBoard || !effective?.grade) {
    return <Navigate to="/start" replace />;
  }
  return children;
};

/**
 * OnboardingGate — users without any enrolled track must complete /welcome
 * (and the track-specific flow that follows). Schema defaults pre-fill
 * examBoard/grade on every new user, so we can't trust those alone — `tracks`
 * is the source of truth for "did this user actually onboard?".
 *
 * Doesn't apply to the parent identity when viewing-as-child (the child
 * carries their own tracks); checks `activeChild || user`.
 */
const OnboardingGate = ({ children }) => {
  const { user, activeChild } = useAuthStore((s) => ({
    user:        s.user,
    activeChild: s.activeChild,
  }));
  const effective = activeChild || user;
  if (effective && (!effective.tracks || effective.tracks.length === 0)) {
    return <Navigate to="/welcome" replace />;
  }
  return children;
};

// Shows Landing for guests at "/"; deep-links to app routes redirect to "/" for guests.
// For logged-in users who haven't picked a track yet (tracks[] empty), bounce
// them to /welcome — the picker is required, not optional.
const RootElement = () => {
  const { user, activeChild } = useAuthStore((s) => ({ user: s.user, activeChild: s.activeChild }));
  const location = useLocation();
  // Allow unauthenticated guests through to the free-tier topic preview
  if (!user && location.pathname !== "/" && !location.pathname.startsWith("/pro/preview")) {
    return <Navigate to="/" replace />;
  }
  if (user) {
    const effective = activeChild || user;
    if (!effective?.tracks || effective.tracks.length === 0) {
      return <Navigate to="/welcome" replace />;
    }
  }
  return user ? <Layout /> : <Landing />;
};

export default function App() {
  const [booted, setBooted] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  // Bootstrap auth from backend cookie (fixes refresh / origin-change issues)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Skip getMe() if ClerkCallback already set the user
        const alreadyAuthed = useAuthStore.getState().user;
        if (alreadyAuthed) {
          setBooted(true);
          return;
        }

        const { data } = await getMe();
        if (!cancelled && data?.data?.user) setAuth(null, data.data.user);
      } catch {
        // ignore: unauthenticated is a valid state
      } finally {
        if (!cancelled) setBooted(true);
      }
    })();
    return () => { cancelled = true; };
  }, []); // intentionally once

  if (!booted) {
    return (
      <div className="min-h-screen bg-apple-gray6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--label2)] text-[14px]">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          {/* Company-internal dashboard — completely independent auth, no student/parent access */}
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/company"       element={<CompanyDashboard />} />

          {/* /start is open to everyone — handles all three states internally */}
          <Route path="/start"                element={<StartOnboarding />} />
          <Route path="/login"                element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register"             element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/forgot-password"           element={<ForgotPassword />} />
          <Route path="/reset-password/:token"      element={<ResetPassword />} />
          <Route path="/shared-plan/:token"         element={<SharedPlan />} />
          <Route path="/c/:token"                   element={<SharedCollection />} />
          <Route path="/u/:slug"                    element={<PublicProfile />} />
          {/* D5.1 — free-tier topic preview, no auth required */}
          <Route path="/pro/preview/:topicId"       element={<ProTopicPublic />} />
          <Route path="/onboarding"           element={<Protected><Onboarding /></Protected>} />
          <Route path="/welcome"              element={<Protected><Welcome /></Protected>} />
          <Route path="/onboarding/pro"       element={<Protected><ProOnboarding /></Protected>} />
          <Route path="/child-picker"         element={<Protected><ChildPicker /></Protected>} />
          <Route path="/placement-quiz"       element={<Protected><PlacementQuiz /></Protected>} />

          {/* Admin panel — AdminLayout handles role guard internally */}
          <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
            <Route index            element={<AdminOverview />} />
            <Route path="users"     element={<AdminUsers />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="topics"    element={<AdminTopics />} />
            <Route path="cache"     element={<AdminCacheStats />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="coupons"   element={<AdminCoupons />} />
            <Route path="payments"  element={<AdminPayments />} />
            <Route path="nps"          element={<AdminNPS />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="rag-health"   element={<AdminRagHealth />} />
            <Route path="retention"    element={<AdminRetention />} />
          </Route>

          <Route path="/" element={<RootElement />}>
            {/* Dashboard is always accessible — shows empty state when board/grade not set */}
            <Route index                          element={<Dashboard />} />

            {/* ── Board-gated content — only visible after board+grade are set ── */}
            <Route path="lessons"                 element={<BoardGated><Lessons /></BoardGated>} />
            <Route path="lessons/:topic"          element={<BoardGated><LessonView /></BoardGated>} />
            <Route path="practice"                element={<BoardGated><Practice /></BoardGated>} />
            <Route path="analytics"               element={<BoardGated><Analytics /></BoardGated>} />
            <Route path="competition"             element={<BoardGated><Competition /></BoardGated>} />
            <Route path="live"                    element={<BoardGated><LiveRoom /></BoardGated>} />
            <Route path="planner"                 element={<BoardGated><Planner /></BoardGated>} />
            <Route path="pyq"                     element={<BoardGated><PYQBank /></BoardGated>} />
            <Route path="voice-tutor"             element={<BoardGated><VoiceTutor /></BoardGated>} />
            <Route path="exam-review"             element={<BoardGated><ExamReview /></BoardGated>} />
            <Route path="mock-paper"              element={<BoardGated><MockPaper /></BoardGated>} />
            <Route path="chapters/:chapterNumber"      element={<BoardGated><ChapterView /></BoardGated>} />
            <Route path="ncert/chapters/:chapterId"    element={<BoardGated><NcertChapterView /></BoardGated>} />
            <Route path="ncert/topics/:topicId"        element={<BoardGated><NcertTopicView /></BoardGated>} />

            {/* ── Always accessible after login (account / misc) ── */}
            <Route path="bookmarks"               element={<Bookmarks />} />
            <Route path="tracks"                  element={<Tracks />} />
            <Route path="portal"                  element={<Portal />} />
            <Route path="parent"                  element={<ParentDashboard />} />
            <Route path="profile"                 element={<Profile />} />
            <Route path="settings"                element={<Settings />} />
            <Route path="pricing"                 element={<Pricing />} />
            <Route path="terms"                   element={<TermsOfService />} />
            <Route path="privacy"                 element={<PrivacyPolicy />} />
            <Route path="certificate"             element={<Certificate />} />
            <Route path="school"                  element={<SchoolGroups />} />

            {/* ── Pro track (Java pilot) — gated server-side by
                 PRO_TRACKS_ENABLED_FOR_EMAILS; no extra client guard
                 needed because every page makes API calls that 403
                 cleanly if the user isn't allowed in. ── */}
            <Route path="pro"                                          element={<ProTrackPicker />} />
            <Route path="pro/review"                                   element={<ProReview />} />
            <Route path="pro/interview"                                element={<InterviewLanding />} />
            <Route path="pro/interview/history"                        element={<InterviewHistory />} />
            <Route path="pro/interview/:sessionId"                     element={<InterviewSimulator />} />
            <Route path="pro/:trackSlug/patterns"                      element={<ProPatternAtlas />} />
            <Route path="pro/:trackSlug"                               element={<ProCourseLanding />} />
            <Route path="pro/:trackSlug/:moduleId"                     element={<ProModuleView />} />
            <Route path="pro/:trackSlug/:moduleId/:topicId"            element={<ProTopicView />} />
            <Route path="pro/:trackSlug/:moduleId/:topicId/project/:projectId" element={<ProProjectView />} />
            <Route path="pro/exercise/:exerciseId"                     element={<ProExerciseRunner />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
