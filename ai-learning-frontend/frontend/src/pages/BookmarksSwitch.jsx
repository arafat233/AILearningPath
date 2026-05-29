/**
 * BookmarksSwitch — route-level chooser for "/bookmarks".
 * Pro learners see saved code exercises; school learners keep the existing
 * board-question Bookmarks page.
 *
 * Falls back to URL param (set eagerly by TrackSwitcher) before the
 * async store update resolves, preventing a flash of the wrong page.
 */
import { useSearchParams } from "react-router-dom";
import { useTrackStore } from "../store/trackStore";
import Bookmarks from "./Bookmarks";
import ProBookmarks from "../components/pro/ProBookmarks";

export default function BookmarksSwitch() {
  const [searchParams] = useSearchParams();
  const activeTrack = useTrackStore((s) => s.activeTrack);
  const effective = activeTrack || searchParams.get("track") || "school";
  if (effective.startsWith("pro_")) {
    return <ProBookmarks trackKey={effective} />;
  }
  return <Bookmarks />;
}
