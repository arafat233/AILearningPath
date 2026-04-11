import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import Layout           from "./components/Layout";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import Onboarding       from "./pages/Onboarding";
import StartOnboarding  from "./pages/StartOnboarding";
import Dashboard   from "./pages/Dashboard";
import Lessons     from "./pages/Lessons";
import LessonView  from "./pages/LessonView";
import Practice    from "./pages/Practice";
import Analytics   from "./pages/Analytics";
import Competition from "./pages/Competition";
import LiveRoom    from "./pages/LiveRoom";
import Planner     from "./pages/Planner";
import Profile     from "./pages/Profile";
import Settings    from "./pages/Settings";
import VoiceTutor  from "./pages/VoiceTutor";
import ExamReview  from "./pages/ExamReview";
import Portal      from "./pages/Portal";
import ChapterView    from "./pages/ChapterView";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import AdminLayout     from "./pages/admin/AdminLayout";
import AdminOverview   from "./pages/admin/AdminOverview";
import AdminUsers      from "./pages/admin/AdminUsers";
import AdminQuestions  from "./pages/admin/AdminQuestions";
import AdminTopics     from "./pages/admin/AdminTopics";
import AdminCacheStats from "./pages/admin/AdminCacheStats";

const Protected = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/start" replace />;
};

const PublicOnly = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? <Navigate to="/" replace /> : children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/start"           element={<PublicOnly><StartOnboarding /></PublicOnly>} />
        <Route path="/login"           element={<PublicOnly><Login /></PublicOnly>} />
        <Route path="/register"        element={<PublicOnly><Register /></PublicOnly>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/onboarding"      element={<Protected><Onboarding /></Protected>} />

        {/* Admin panel — AdminLayout handles role guard internally */}
        <Route path="/admin" element={<Protected><AdminLayout /></Protected>}>
          <Route index             element={<AdminOverview />} />
          <Route path="users"      element={<AdminUsers />} />
          <Route path="questions"  element={<AdminQuestions />} />
          <Route path="topics"     element={<AdminTopics />} />
          <Route path="cache"      element={<AdminCacheStats />} />
        </Route>

        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route index                    element={<Dashboard />} />
          <Route path="lessons"           element={<Lessons />} />
          <Route path="lessons/:topic"    element={<LessonView />} />
          <Route path="practice"          element={<Practice />} />
          <Route path="analytics"         element={<Analytics />} />
          <Route path="competition"       element={<Competition />} />
          <Route path="live"              element={<LiveRoom />} />
          <Route path="planner"           element={<Planner />} />
          <Route path="voice-tutor"       element={<VoiceTutor />} />
          <Route path="profile"           element={<Profile />} />
          <Route path="settings"          element={<Settings />} />
          <Route path="exam-review"       element={<ExamReview />} />
          <Route path="portal"            element={<Portal />} />
          <Route path="chapters/:chapterNumber" element={<ChapterView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
