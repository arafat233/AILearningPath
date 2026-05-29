/**
 * DashboardSwitch — route-level chooser for "/".
 *
 * Renders ProDashboard when the user's activeTrack is pro_*, otherwise the
 * full K-12 Dashboard. Lives outside Dashboard.jsx so we don't violate the
 * rules of hooks (Dashboard has 30+ useStates we can't conditionally skip).
 */
import { useTrackStore } from "../store/trackStore";
import Dashboard from "./Dashboard";
import ProDashboard from "../components/pro/ProDashboard";

export default function DashboardSwitch() {
  const activeTrack = useTrackStore((s) => s.activeTrack);
  if (activeTrack && activeTrack.startsWith("pro_")) {
    return <ProDashboard trackKey={activeTrack} />;
  }
  return <Dashboard />;
}
