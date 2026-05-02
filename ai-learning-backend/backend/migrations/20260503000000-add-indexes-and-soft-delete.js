export async function up(db) {
  const questions = db.collection("questions");
  const attempts  = db.collection("attempts");
  const seenqs    = db.collection("seenquestions");
  const pushsubs  = db.collection("pushsubscriptions");

  // Soft-delete field default
  await questions.updateMany({ deletedAt: { $exists: false } }, { $set: { deletedAt: null } });

  // Indexes added in schema but may be missing on existing collections
  await attempts.createIndex({ userId: 1, createdAt: -1 }, { background: true });
  await attempts.createIndex({ topic: 1 },                  { background: true });
  await attempts.createIndex({ userId: 1, topic: 1 },       { background: true });
  await seenqs.createIndex(
    { seenAt: 1 },
    { expireAfterSeconds: 30 * 24 * 60 * 60, background: true }
  );
  await pushsubs.createIndex({ endpoint: 1 }, { unique: true, sparse: true, background: true });
}

export async function down(db) {
  const attempts = db.collection("attempts");
  const seenqs   = db.collection("seenquestions");
  const pushsubs = db.collection("pushsubscriptions");

  await attempts.dropIndex("userId_1_createdAt_-1").catch(() => {});
  await attempts.dropIndex("topic_1").catch(() => {});
  await attempts.dropIndex("userId_1_topic_1").catch(() => {});
  await seenqs.dropIndex("seenAt_1").catch(() => {});
  await pushsubs.dropIndex("endpoint_1").catch(() => {});
}
