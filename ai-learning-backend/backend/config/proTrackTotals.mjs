/**
 * proTrackTotals — recompute a pro track's rollup counts from the DB. Generic
 * over trackKey (used by the System Design seeds; the LLD seeds have their own
 * lldTotals.mjs). Keeps totalModules / totalTopics / totalExercises / totalXp
 * (what ProTrackPicker shows) correct no matter which seeds have run.
 */
import { ProTrack, ProModule, ProTopic, ProExercise } from "../models/proModels.js";

export async function recomputeTrackTotals(trackKey) {
  const [modules, topics, exercises] = await Promise.all([
    ProModule.find({ trackKey, status: "live" }).select("_id").lean(),
    ProTopic.find({ trackKey }).select("xpReward").lean(),
    ProExercise.find({ trackKey }).select("xpReward").lean(),
  ]);
  const totalXp = topics.reduce((s, t) => s + (t.xpReward || 0), 0)
                + exercises.reduce((s, e) => s + (e.xpReward || 0), 0);
  await ProTrack.updateOne({ key: trackKey }, {
    $set: {
      totalModules:   modules.length,
      totalTopics:    topics.length,
      totalExercises: exercises.length,
      totalXp,
    },
  });
  return { totalModules: modules.length, totalTopics: topics.length, totalExercises: exercises.length, totalXp };
}
