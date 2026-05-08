import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
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
const Dashboard        = lazy(() => import("./pages/Dashboard"));
const Lessons          = lazy(() => import("./pages/Lessons"));
const LessonView       = lazy(() => import("./pages/LessonView"));
const Practice         = lazy(() => import("./pages/Practice"));
const Bookmarks        = lazy(() => import("./pages/Bookmarks"));
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

// Shows Landing for guests at "/"; deep-links to app routes redirect to "/" for guests
const RootElement = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user && location.pathname !== "/") return <Navigate to="/" replace />;
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

          <Route path="/start"                element={<PublicOnly><StartOnboarding /></PublicOnly>} />
          <Route path="/login"                element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register"             element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/forgot-password"           element={<ForgotPassword />} />
          <Route path="/reset-password/:token"      element={<ResetPassword />} />
          <Route path="/shared-plan/:token"         element={<SharedPlan />} />
          <Route path="/onboarding"           element={<Protected><Onboarding /></Protected>} />
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
          </Route>

          <Route path="/" element={<RootElement />}>
            <Route index                          element={<Dashboard />} />
            <Route path="lessons"                 element={<Lessons />} />
            <Route path="lessons/:topic"          element={<LessonView />} />
            <Route path="practice"                element={<Practice />} />
            <Route path="bookmarks"               element={<Bookmarks />} />
            <Route path="analytics"               element={<Analytics />} />
            <Route path="competition"             element={<Competition />} />
            <Route path="live"                    element={<LiveRoom />} />
            <Route path="planner"                 element={<Planner />} />
            <Route path="pyq"                     element={<PYQBank />} />
            <Route path="voice-tutor"             element={<VoiceTutor />} />
            <Route path="profile"                 element={<Profile />} />
            <Route path="settings"                element={<Settings />} />
            <Route path="exam-review"             element={<ExamReview />} />
            <Route path="mock-paper"              element={<MockPaper />} />
            <Route path="portal"                  element={<Portal />} />
            <Route path="parent"                  element={<ParentDashboard />} />
            <Route path="chapters/:chapterNumber"      element={<ChapterView />} />
            <Route path="ncert/chapters/:chapterId"   element={<NcertChapterView />} />
            <Route path="ncert/topics/:topicId"       element={<NcertTopicView />} />
            <Route path="pricing"                     element={<Pricing />} />
            <Route path="terms"                       element={<TermsOfService />} />
            <Route path="privacy"                     element={<PrivacyPolicy />} />
            <Route path="certificate"                 element={<Certificate />} />
            <Route path="school"                      element={<SchoolGroups />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
