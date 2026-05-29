/**
 * PracticeSwitch — route-level chooser for "/practice".
 * Pro learners get the code-practice surface; school learners keep the
 * existing MCQ practice flow.
 *
 * Falls back to URL param (set eagerly by TrackSwitcher) before the
 * async store update resolves, preventing a flash of the wrong page.
 */
import { useSearchParams } from "react-router-dom";
import { useTrackStore } from "../store/trackStore";
import Practice from "./Practice";
import ProPractice from "../components/pro/ProPractice";

export default function PracticeSwitch() {
  const [searchParams] = useSearchParams();
  const activeTrack = useTrackStore((s) => s.activeTrack);
  const effective = activeTrack || searchParams.get("track") || "school";
  if (effective.startsWith("pro_")) {
    return <ProPractice trackKey={effective} />;
  }
  return <Practice />;
}
