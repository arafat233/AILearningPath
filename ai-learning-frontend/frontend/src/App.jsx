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

const Protected = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/start" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/start"      element={<StartOnboarding />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/onboarding" element={<Protected><Onboarding /></Protected>} />
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
          <Route path="exam-review"        element={<ExamReview />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
