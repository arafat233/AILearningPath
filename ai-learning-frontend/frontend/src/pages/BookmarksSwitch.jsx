/**
 * BookmarksSwitch — route-level chooser for "/bookmarks".
 * Pro learners see saved code exercises; school learners keep the existing
 * board-question Bookmarks page.
 */
import { useTrackStore } from "../store/trackStore";
import Bookmarks from "./Bookmarks";
import ProBookmarks from "../components/pro/ProBookmarks";

export default function BookmarksSwitch() {
  const activeTrack = useTrackStore((s) => s.activeTrack);
  if (activeTrack && activeTrack.startsWith("pro_")) {
    return <ProBookmarks trackKey={activeTrack} />;
  }
  return <Bookmarks />;
}
