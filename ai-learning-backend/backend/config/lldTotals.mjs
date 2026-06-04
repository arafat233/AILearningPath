/**
 * lldTotals — shared helper to recompute the pro_lld track's rollup counts
 * from the DB. Every LLD module seed calls this at the end so totalModules /
 * totalTopics / totalExercises / totalXp (what ProTrackPicker shows) stay
 * correct no matter which seeds have run or in what order.
 */
import { ProTrack, ProModule, ProTopic, ProExercise } from "../models/proModels.js";

const TRACK_KEY = "pro_lld";

export async function recomputeLldTotals() {
  const [modules, topics, exercises] = await Promise.all([
    ProModule.find({ trackKey: TRACK_KEY, status: "live" }).select("_id").lean(),
    ProTopic.find({ trackKey: TRACK_KEY }).select("xpReward").lean(),
    ProExercise.find({ trackKey: TRACK_KEY }).select("xpReward").lean(),
  ]);
  const totalXp = topics.reduce((s, t) => s + (t.xpReward || 0), 0)
                + exercises.reduce((s, e) => s + (e.xpReward || 0), 0);
  await ProTrack.updateOne({ key: TRACK_KEY }, {
    $set: {
      totalModules:   modules.length,
      totalTopics:    topics.length,
      totalExercises: exercises.length,
      totalXp,
    },
  });
  return { totalModules: modules.length, totalTopics: topics.length, totalExercises: exercises.length, totalXp };
}
