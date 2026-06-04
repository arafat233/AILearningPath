/**
 * Seed — starter Community posts (GAP #8) so the feed isn't empty on launch.
 * A handful of curated articles + questions authored by a "Stellar Team" system
 * account (userId "stellar-team" — a denormalized authorName, never matches a
 * real user, so isMine is false for everyone; admins can still moderate).
 *
 * Idempotent: upsert by (userId, title). Re-running updates content, not count.
 * Usage:  node config/seedCommunitySeedPosts.js   ·   npm: npm run seed:community
 */
import "dotenv/config";
import mongoose from "mongoose";
import { CommunityPost } from "../models/communityModels.js";

const AUTHOR_ID = "stellar-team";
const AUTHOR = "Stellar Team";

const POSTS = [
  {
    kind: "article", title: "Welcome to the Stellar Community 👋",
    tags: ["welcome", "meta"],
    body: `This is your space to learn together.

• Ask a **Question** when you're stuck on a problem, a concept, or an interview round — someone here has been there.
• Share an **Article** when you've understood something well enough to explain it. Teaching is the fastest way to learn.

A few norms: be kind, search before posting, and upvote what helped you. Use the Report button on anything that breaks the rules. Happy learning!`,
  },
  {
    kind: "article", title: "How to drive a system design interview",
    tags: ["system-design", "interview"],
    body: `Most candidates freeze because they have no process. Use this loop every time:

1. **Clarify** functional + non-functional requirements and scope.
2. **Estimate** scale (QPS, storage, read:write ratio) — and let the numbers drive decisions.
3. **High-level design** — major components + data flow on the board.
4. **Deep-dive** the 1–2 components the interviewer cares about.
5. **Bottlenecks & trade-offs** — single points of failure, consistency vs availability.

There's no single right answer — they grade your reasoning. Narrate every step out loud. (See the System Design track for the full curriculum.)`,
  },
  {
    kind: "article", title: "The Gang-of-Four patterns, one line each",
    tags: ["lld", "design-patterns"],
    body: `A quick memory jog (full track in Low-Level Design):

**Creational** — Builder (complex construction), Factory (centralise creation), Abstract Factory (families), Singleton (one instance), Prototype (clone).
**Structural** — Adapter (convert interface), Decorator (add behaviour), Facade (simplify subsystem), Composite (part-whole tree), Proxy (control access), Bridge (split two axes), Flyweight (share state).
**Behavioral** — Strategy (swap algorithm), Observer (notify dependents), Command (request as object), State (mode → behaviour), Template Method (fixed skeleton), Chain of Responsibility (handle or forward), Iterator (sequential access), Mediator (hub), Memento (snapshot/undo), Visitor (add ops via double dispatch).`,
  },
  {
    kind: "question", title: "What's the most effective way to practice DSA patterns?",
    tags: ["dsa", "practice"],
    body: `I can solve a problem when I know the pattern, but I struggle to RECOGNISE which pattern a new problem needs. How did you build that recognition? Grinding more problems, or something more deliberate?`,
  },
  {
    kind: "question", title: "How do you prepare for behavioral rounds?",
    tags: ["behavioral", "interview"],
    body: `Coming from a technical background, the behavioral round is my weak spot. Do you script STAR stories in advance, or improvise? How many stories is enough to cover most questions?`,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  let inserted = 0, updated = 0;
  for (const p of POSTS) {
    const before = await CommunityPost.findOne({ userId: AUTHOR_ID, title: p.title }).select("_id").lean();
    await CommunityPost.findOneAndUpdate(
      { userId: AUTHOR_ID, title: p.title },
      {
        $set: { authorName: AUTHOR, kind: p.kind, body: p.body, tags: p.tags, status: "published" },
        $setOnInsert: { upvoters: [], upvoteCount: 0, comments: [], commentCount: 0, views: 0, reports: [], pinned: p.title.startsWith("Welcome") },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    before ? updated++ : inserted++;
  }
  const total = await CommunityPost.countDocuments({ userId: AUTHOR_ID });
  console.log(`  ✓ Community starter posts: ${POSTS.length} (${inserted} inserted, ${updated} updated)`);
  console.log(`  Stellar Team posts now: ${total}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
