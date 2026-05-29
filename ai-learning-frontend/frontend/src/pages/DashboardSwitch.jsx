/**
 * DashboardSwitch — route-level chooser for "/".
 *
 * Renders ProDashboard when the user's activeTrack is pro_*, otherwise the
 * full K-12 Dashboard. Lives outside Dashboard.jsx so we don't violate the
 * rules of hooks (Dashboard has 30+ useStates we can't conditionally skip).
 *
 * Reads both the persisted store value (source of truth after hydration) and
 * the ?track= URL param (set immediately by TrackSwitcher/TrackTabs before
 * the async API call completes), falling back to "school".
 */
import { useSearchParams } from "react-router-dom";
import { useTrackStore } from "../store/trackStore";
import Dashboard from "./Dashboard";
import ProDashboard from "../components/pro/ProDashboard";

export default function DashboardSwitch() {
  const [searchParams] = useSearchParams();
  const activeTrack = useTrackStore((s) => s.activeTrack);
  const hydrated   = useTrackStore((s) => s.hydrated);
  // hydrated must be true before we trust the store's activeTrack.
  // Before hydration: fall back to URL param (set eagerly by TrackSwitcher).
  // After hydration: use the persisted store value (faster, avoids flash).
  const effective = hydrated ? (activeTrack || searchParams.get("track")) : (searchParams.get("track"));
  if (effective?.startsWith("pro_")) {
    return <ProDashboard trackKey={effective} />;
  }
  return <Dashboard />;
}
