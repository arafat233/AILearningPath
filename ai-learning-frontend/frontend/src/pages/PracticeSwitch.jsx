/**
 * PracticeSwitch — route-level chooser for "/practice".
 * Pro learners get the code-practice surface; school learners keep the
 * existing MCQ practice flow.
 */
import { useTrackStore } from "../store/trackStore";
import Practice from "./Practice";
import ProPractice from "../components/pro/ProPractice";

export default function PracticeSwitch() {
  const activeTrack = useTrackStore((s) => s.activeTrack);
  if (activeTrack && activeTrack.startsWith("pro_")) {
    return <ProPractice trackKey={activeTrack} />;
  }
  return <Practice />;
}
