/**
 * CBSE Primary Mathematics (Grades 1–6) — Topic DAG promoter
 *
 * Promotes a grade's prerequisite graph from the legacy CHAPTER-level shape
 * (one bare `mathN_chX` node per chapter) to the TOPIC-level standard used by
 * CBSE Math 7/8/9 and ICSE Math 9/10 — one node per sub-topic (mathN_chX_yyy).
 *
 * Edges:
 *   • Linear prerequisite chain WITHIN each chapter, in study order
 *     (taken from NcertTopicContent `_id` insertion order, which is the seed /
 *     intended teaching order).
 *   • Cross-chapter edges are carried over from the existing chapter-level DAG:
 *     if chapter B depended on chapter A, the FIRST sub-topic of B now depends
 *     on the LAST sub-topic of A. (Read BEFORE the old nodes are removed.)
 *
 * `name` is read from the NcertTopicContent docs so it can never drift.
 * The obsolete bare `mathN_chX` nodes are removed after seeding.
 * Safe to re-run (upsert on topicId).
 *
 * Usage: node config/seedMathPrimaryTopicDAG.js --grade=6
 */

import "dotenv/config";
import mongoose from "mongoose";
import { Topic } from "../models/index.js";
import { NcertTopicContent } from "../models/ncertTopicContentModel.js";

const gradeArg = process.argv.find((a) => a.startsWith("--grade="));
const GRADE = gradeArg ? gradeArg.split("=")[1] : null;
if (!GRADE || !/^[1-6]$/.test(GRADE)) {
  console.error("Usage: node config/seedMathPrimaryTopicDAG.js --grade=N   (N = 1..6)");
  process.exit(1);
}
const PREFIX = `math${GRADE}`;
const chNum = (topicId) => {
  const m = topicId.match(/_ch(\d+)(?:_|$)/);
  return m ? Number(m[1]) : null;
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  // 1. Capture cross-chapter edges from the existing chapter-level DAG FIRST.
  //    Map: chapter number -> [prerequisite chapter numbers].
  const chapterNodes = await Topic.find(
    { topicId: { $regex: new RegExp(`^${PREFIX}_ch\\d+$`) } },
    { topicId: 1, prerequisites: 1 }
  ).lean();
  const crossByChapter = new Map();
  for (const node of chapterNodes) {
    const c = chNum(node.topicId);
    const prereqChapters = (node.prerequisites || []).map(chNum).filter((n) => n != null);
    if (c != null && prereqChapters.length) crossByChapter.set(c, prereqChapters);
  }

  // 2. Load topic-level content docs, grouped by chapter, in _id (study) order.
  const docs = await NcertTopicContent.find(
    { topicId: { $regex: new RegExp(`^${PREFIX}_ch\\d+_`) } },
    { topicId: 1, name: 1 }
  ).sort({ _id: 1 }).lean();

  if (!docs.length) {
    console.error(`No topic-level content docs found for ${PREFIX}_chN_*. Nothing to build.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const byChapter = new Map(); // chapterNum -> [topicId, ...] in study order
  const nameOf = new Map();
  for (const d of docs) {
    const c = chNum(d.topicId);
    if (c == null) continue;
    if (!byChapter.has(c)) byChapter.set(c, []);
    byChapter.get(c).push(d.topicId);
    nameOf.set(d.topicId, d.name);
  }
  const lastTopicOf = (c) => {
    const arr = byChapter.get(c);
    return arr && arr.length ? arr[arr.length - 1] : null;
  };

  // 3. Upsert one node per sub-topic.
  let upserts = 0;
  const chapters = [...byChapter.keys()].sort((a, b) => a - b);
  for (const c of chapters) {
    const chapter = byChapter.get(c);
    for (let idx = 0; idx < chapter.length; idx++) {
      const topicId = chapter[idx];
      let prerequisites;
      if (idx > 0) {
        prerequisites = [chapter[idx - 1]];
      } else {
        prerequisites = (crossByChapter.get(c) || [])
          .map(lastTopicOf)
          .filter(Boolean);
      }
      await Topic.updateOne(
        { topicId },
        {
          $set: {
            topicId,
            name: nameOf.get(topicId),
            subject: "Mathematics",
            grade: GRADE,
            level: idx,
            prerequisites,
          },
        },
        { upsert: true }
      );
      upserts++;
    }
  }

  // 4. Remove the obsolete bare chapter-level nodes.
  const stale = await Topic.deleteMany({ topicId: { $regex: new RegExp(`^${PREFIX}_ch\\d+$`) } });

  console.log(
    `CBSE Math ${GRADE} TopicDAG: ${upserts} topic-level nodes across ${chapters.length} chapters` +
    `, ${stale.deletedCount} obsolete chapter-level nodes removed.`
  );
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(1); });
