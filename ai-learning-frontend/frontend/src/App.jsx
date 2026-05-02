import React, { useEffect, useState } from "react";
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

import Layout           from "./components/Layout";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Onboarding       from "./pages/Onboarding";
import StartOnboarding  from "./pages/StartOnboarding";
import Dashboard        from "./pages/Dashboard";
import Lessons          from "./pages/Lessons";
import LessonView       from "./pages/LessonView";
import Practice         from "./pages/Practice";
import Bookmarks        from "./pages/Bookmarks";
import Analytics        from "./pages/Analytics";
import Competition      from "./pages/Competition";
import LiveRoom         from "./pages/LiveRoom";
import Planner          from "./pages/Planner";
import Profile          from "./pages/Profile";
import Settings         from "./pages/Settings";
import VoiceTutor       from "./pages/VoiceTutor";
import ExamReview       from "./pages/ExamReview";
import Portal           from "./pages/Portal";
import ChapterView         from "./pages/ChapterView";
import NcertChapterView    from "./pages/NcertChapterView";
import NcertTopicView      from "./pages/NcertTopicView";
import Pricing             from "./pages/Pricing";
import ForgotPassword   from "./pages/ForgotPassword";
import ResetPassword    from "./pages/ResetPassword";
import AdminLayout      from "./pages/admin/AdminLayout";
import AdminOverview    from "./pages/admin/AdminOverview";
import AdminUsers       from "./pages/admin/AdminUsers";
import AdminQuestions   from "./pages/admin/AdminQuestions";
import AdminTopics      from "./pages/admin/AdminTopics";
import AdminCacheStats  from "./pages/admin/AdminCacheStats";
import AdminAnalytics  from "./pages/admin/AdminAnalytics";
import Landing          from "./pages/Landing";
import CompanyLogin     from "./pages/CompanyLogin";
import CompanyDashboard from "./pages/CompanyDashboard";
import PYQBank          from "./pages/PYQBank";
import ParentDashboard  from "./pages/ParentDashboard";
import TermsOfService   from "./pages/TermsOfService";
import PrivacyPolicy    from "./pages/PrivacyPolicy";
import Certificate      from "./pages/Certificate";

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
      <Routes>
          {/* Company-internal dashboard — completely independent auth, no student/parent access */}
          <Route path="/company-login" element={<CompanyLogin />} />
          <Route path="/company"       element={<CompanyDashboard />} />

          <Route path="/start"                element={<PublicOnly><StartOnboarding /></PublicOnly>} />
          <Route path="/login"                element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register"             element={<PublicOnly><Register /></PublicOnly>} />
          <Route path="/forgot-password"      element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/onboarding"           element={<Protected><Onboarding /></Protected>} />

          {/* Admin panel — AdminLayout handles role guard internally */}
          <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
            <Route index            element={<AdminOverview />} />
            <Route path="users"     element={<AdminUsers />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="topics"    element={<AdminTopics />} />
            <Route path="cache"     element={<AdminCacheStats />} />
            <Route path="analytics" element={<AdminAnalytics />} />
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
            <Route path="portal"                  element={<Portal />} />
            <Route path="parent"                  element={<ParentDashboard />} />
            <Route path="chapters/:chapterNumber"      element={<ChapterView />} />
            <Route path="ncert/chapters/:chapterId"   element={<NcertChapterView />} />
            <Route path="ncert/topics/:topicId"       element={<NcertTopicView />} />
            <Route path="pricing"                     element={<Pricing />} />
            <Route path="terms"                       element={<TermsOfService />} />
            <Route path="privacy"                     element={<PrivacyPolicy />} />
            <Route path="certificate"                 element={<Certificate />} />
          </Route>
        </Routes>
    </ErrorBoundary>
  );
}