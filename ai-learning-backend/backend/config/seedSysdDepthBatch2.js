/**
 * Seed — System Design DEPTH batch 2 (SD_DEPTH_STANDARD.md).
 *
 * Deepens 6 more canonical FAANG case studies to full framework depth (the same
 * standard the depth audit gates on): requirements -> estimation (numbers) ->
 * hld -> api -> data_model -> >=2 deep_dive -> bottlenecks (+ follow-ups), each
 * block `section`-tagged, plus an authored architecture SVG and 3 exercises.
 *
 *   sysd_m3_t4  Instagram (Photo Sharing)        (module sysd_m3)
 *   sysd_m4_t1  Video Streaming (YouTube/Netflix)(module sysd_m4)
 *   sysd_m4_t2  Ride-Sharing (Uber/Lyft)         (module sysd_m4)
 *   sysd_m4_t4  Web Crawler                      (module sysd_m4)
 *   sysd_m8_t1  Distributed Cache               (module sysd_m8)
 *   sysd_m3_t2  Search Autocomplete (Typeahead)  (module sysd_m3)
 *
 * Idempotent upsert by id; recomputes totals. Verify:
 *   node config/auditSysdDepth.mjs --require sysd_m3_t4,sysd_m4_t1,sysd_m4_t2,sysd_m4_t4,sysd_m8_t1,sysd_m3_t2
 * Usage: node config/seedSysdDepthBatch2.js  ·  npm run seed:sysd-depth-2
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";

// ── SVG builder (well-formed by construction) ────────────────────────────────
const FONT = "system-ui,-apple-system,Segoe UI,Roboto,sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function box(x, y, w, h, label, sub, fill = "#eff6ff") {
  const cy = sub ? y + h / 2 - 3 : y + h / 2 + 5;
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="#94a3b8" stroke-width="1.5"/>`;
  s += `<text x="${x + w / 2}" y="${cy}" text-anchor="middle" font-family="${FONT}" font-size="14" font-weight="600" fill="#0f172a">${esc(label)}</text>`;
  if (sub) s += `<text x="${x + w / 2}" y="${y + h / 2 + 14}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="#475569">${esc(sub)}</text>`;
  return s;
}
function arrow(x1, y1, x2, y2, label, dashed) {
  const dash = dashed ? ` stroke-dasharray="5 4"` : "";
  let s = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#94a3b8" stroke-width="2"${dash} marker-end="url(#ah)"/>`;
  if (label) s += `<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 6}" text-anchor="middle" font-family="${FONT}" font-size="10.5" fill="#64748b">${esc(label)}</text>`;
  return s;
}
function note(x, y, text, anchor = "middle") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="11" fill="#64748b">${esc(text)}</text>`;
}
function svg(w, h, inner) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:${w}px;height:auto">` +
    `<defs><marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#94a3b8"/></marker></defs>` +
    `<rect x="0" y="0" width="${w}" height="${h}" fill="#ffffff"/>${inner}</svg>`;
}

const DIAG = {
  insta: svg(820, 280,
    box(20, 110, 100, 56, "Client", "") +
    box(150, 110, 110, 56, "App / API", "", "#f0fdf4") +
    box(300, 30, 140, 52, "Object store", "media blobs", "#fce7f3") +
    box(470, 30, 110, 52, "CDN", "edge", "#fef9c3") +
    box(300, 120, 140, 52, "Metadata DB", "posts/follows") +
    box(300, 200, 140, 52, "Fan-out + Queue", "feed build", "#ede9fe") +
    box(620, 200, 150, 52, "Feed cache", "per-user", "#fce7f3") +
    arrow(120, 138, 150, 138) +
    arrow(260, 125, 300, 56, "upload") + arrow(440, 56, 470, 56, "serve") +
    arrow(260, 140, 300, 146) +
    arrow(260, 150, 300, 220, "post") + arrow(440, 226, 620, 226) +
    note(560, 130, "reads served via CDN + feed cache", "middle")),
  video: svg(820, 250,
    box(20, 95, 90, 56, "Uploader", "") +
    box(140, 95, 130, 56, "Transcode", "queue+workers", "#ede9fe") +
    box(300, 30, 150, 52, "Renditions", "240p..4k HLS", "#fef9c3") +
    box(300, 150, 150, 52, "Object store", "segments", "#fce7f3") +
    box(490, 95, 100, 56, "CDN", "edge", "#f0fdf4") +
    box(640, 95, 130, 56, "Player", "adaptive bitrate") +
    arrow(110, 123, 140, 123) +
    arrow(270, 110, 300, 56, "encode") + arrow(270, 135, 300, 176, "store") +
    arrow(450, 176, 490, 130) + arrow(590, 123, 640, 123, "stream") +
    note(450, 240, "Watch path is read/bandwidth-dominated -> CDN + ABR")),
  uber: svg(820, 280,
    box(20, 40, 100, 52, "Rider", "") +
    box(20, 180, 100, 52, "Drivers", "GPS pings") +
    box(160, 110, 120, 56, "API / GW", "", "#f0fdf4") +
    box(320, 40, 140, 56, "Matching svc", "", "#eff6ff") +
    box(500, 30, 150, 56, "Geo index", "geohash/quadtree", "#fce7f3") +
    box(320, 175, 140, 56, "Trip svc", "lifecycle", "#ede9fe") +
    box(500, 175, 150, 56, "Trips DB", "") +
    arrow(120, 66, 160, 120, "request") + arrow(120, 206, 160, 150, "location") +
    arrow(280, 120, 320, 80) + arrow(280, 140, 320, 195) +
    arrow(460, 68, 500, 60, "nearby?") + arrow(460, 203, 500, 203) +
    note(430, 270, "Drivers stream location -> geo index; match nearest by ETA")),
  crawler: svg(820, 250,
    box(20, 95, 90, 56, "Seeds", "") +
    box(140, 95, 130, 56, "URL Frontier", "per-domain Q", "#ede9fe") +
    box(310, 95, 110, 56, "Fetchers", "polite", "#f0fdf4") +
    box(460, 30, 120, 52, "Parser", "extract links") +
    box(460, 150, 120, 52, "Content store", "", "#fce7f3") +
    box(630, 95, 140, 56, "Seen set", "bloom filter", "#fef9c3") +
    arrow(110, 123, 140, 123) + arrow(270, 123, 310, 123, "next URL") +
    arrow(420, 110, 460, 60, "parse") + arrow(420, 135, 460, 176, "store") +
    arrow(520, 82, 630, 110, "new links") +
    arrow(630, 130, 270, 140, "dedupe -> frontier", true)),
  cache: svg(820, 250,
    box(20, 95, 100, 56, "Client", "") +
    box(160, 30, 120, 50, "Cache A", "", "#fce7f3") +
    box(160, 100, 120, 50, "Cache B", "", "#fce7f3") +
    box(160, 170, 120, 50, "Cache C", "", "#fce7f3") +
    box(360, 100, 150, 56, "Consistent hash", "ring routing", "#ede9fe") +
    box(560, 100, 120, 56, "Database", "on miss", "#f0fdf4") +
    arrow(120, 110, 160, 55) + arrow(120, 123, 160, 125) + arrow(120, 140, 160, 195) +
    arrow(280, 125, 360, 128, "key->node") +
    arrow(510, 128, 560, 128, "miss -> load") +
    note(430, 240, "Hash key -> node; replicate for HA; populate on miss")),
  type: svg(820, 250,
    box(20, 95, 100, 56, "Client", "keystroke") +
    box(160, 95, 130, 56, "Suggest API", "", "#f0fdf4") +
    box(330, 95, 150, 56, "Trie service", "top-k per node", "#ede9fe") +
    box(520, 95, 110, 56, "Cache", "hot prefixes", "#fef9c3") +
    box(330, 185, 150, 50, "Build pipeline", "from query logs", "#fce7f3") +
    box(540, 185, 120, 50, "Query logs", "") +
    arrow(120, 123, 160, 123, "prefix") + arrow(290, 123, 330, 123) +
    arrow(480, 120, 520, 120, "hot") +
    arrow(540, 210, 480, 210, "aggregate") + arrow(405, 151, 405, 185, "rebuild") +
    note(420, 245, "Precompute top-k at each trie node -> sub-100ms suggestions")),
};

// ── builders ─────────────────────────────────────────────────────────────────
const TT = (moduleId, id, num, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, svgStr, vaType) => ({
  trackKey: TRACK_KEY, moduleId, topicId: id, topicNumber: num, name, slug,
  metadata: { estimated_minutes: 50, difficulty: 4, prerequisites: [], tags },
  hook: { question: hookQ, insight: hookI },
  teaching: { blocks, visual_aid: { type: vaType, svg: svgStr, alt_text: `${name} architecture diagram.` } },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: [], estimatedMinutes: 50, difficulty: diff, xpReward: 80, visualizer: null,
});
const C = (section, heading, body) => ({ kind: "concept", section, heading, body });
const K = (section, heading, body) => ({ kind: "code", section, heading, body });
const G = (id, w, r, d) => ({ gap_id: id, what_students_get_wrong: w, remediation: r, detection_pattern: d });

const TOPICS = [
  // ───────────────────────────── INSTAGRAM ─────────────────────────────────
  TT("sysd_m3", "sysd_m3_t4", 4, "Design Instagram (Photo Sharing)", "sysd-instagram",
    ["case-study", "instagram", "media", "feed"],
    "Users upload photos, follow others, and scroll a feed of their followees' posts — for hundreds of millions of people, with images that must load instantly worldwide. Where do the photos live, and how is the feed built?",
    "Two systems combined: a MEDIA pipeline (upload blobs to object storage, generate thumbnails/sizes, serve through a CDN) and a FEED pipeline (the same fan-out problem as a news feed — push post ids into followers' feed caches, pull for celebrities). Metadata (posts, follows, likes) lives in a separate scalable store; media never goes through it.",
    [
      C("requirements", "Requirements",
        "Functional: upload a photo/short video with a caption; follow/unfollow; a home FEED of recent posts from people you follow; like and comment; an explore/discovery surface. Non-functional: extremely read-heavy (people scroll far more than they post), feed and images load fast worldwide (sub-200ms feed, images via edge), media durability (a lost photo is unacceptable — replicate across zones), high availability, and eventual consistency is fine (a like count or a new post lagging a second or two is acceptable). Clarify scope up front: photos only or video too (video adds a transcoding pipeline), and is the feed chronological or ranked? The two hard parts are storing/serving huge volumes of media cheaply and globally, and building feeds without melting on creators who have tens of millions of followers."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 500M DAU; ~100M photos uploaded/day; avg stored size ~2 MB (original + resized variants).\n  media write = 100M * 2 MB = 200 TB/day  -> ~73 PB/yr (object storage + tiering)\n  uploads/sec = 100M / 86400 ~= 1,160/sec\n  feed reads  = 500M * 10 opens/day / 86400 ~= 58,000 reads/sec (peak higher)\nMetadata per post ~= 1 KB (ids, caption, refs) -> tiny vs media.\nBandwidth is dominated by image delivery -> push it to the CDN, not your servers.\nTakeaway: media volume drives storage/CDN; feed reads drive the cache + fan-out."),
      C("hld", "High-level design",
        "Upload path: client requests a pre-signed URL and uploads the image DIRECTLY to object storage (bytes never transit your app servers); an async worker generates resized variants/thumbnails; the app writes a post row (id, owner, media key, caption) to the metadata store and triggers feed fan-out. Read path: the feed service returns post metadata from the per-user feed cache; the client then loads each image from the CDN, which caches it at the edge. Likes/comments are separate high-write counters. Keep three planes distinct: media (object store + CDN), metadata (posts/follows DB), and the derived feed cache — the feed carries only ids/refs, never image bytes. Trace one action end to end in the interview: a user opens the app -> feed service returns 20 post refs from their feed cache in one read -> the client requests each image from the nearest CDN edge (mostly cache hits) -> a tap to like hits a separate counter service. And one upload: client gets a pre-signed URL -> PUTs bytes to object storage -> a worker makes renditions -> a post row is written -> fan-out enqueues the post id for followers. Naming where each byte and each id flows, and which store owns it, is what demonstrates you've separated the heavy media path from the light metadata/feed path."),
      K("api", "API design",
        "POST /api/v1/media:presign  -> { uploadUrl, mediaKey }   (client PUTs bytes to object store)\nPOST /api/v1/posts { mediaKey, caption } -> 201 { postId }\nGET  /api/v1/feed?cursor=<c>&limit=20 -> { items:[{postId, author, mediaUrl, caption}], nextCursor }\nPOST /api/v1/posts/{id}/like\nPOST /api/v1/follow { targetId }"),
      K("data_model", "Data model",
        "posts (wide-column):  post_id PK, user_id, media_key, caption, created_at\nfollows:              user_id PK, followee_id  (and reverse index followee->follower)\nfeed cache (Redis):   feed:{user_id} = capped list/ZSET of post_ids\nlikes:                (post_id, user_id) PK + a denormalized like_count counter\nmedia:                blobs in object storage; CDN caches by media_key/url"),
      C("deep_dive", "Deep dive: media storage & delivery",
        "Images are large, immutable blobs — wrong fit for a database, right fit for object storage (S3-style): cheap, durable (replicated across zones), and infinitely scalable. Upload via PRE-SIGNED URLs so bytes go client -> object store directly, sparing your app servers the bandwidth. On upload, an async worker produces multiple renditions (thumbnail, feed size, full) so clients fetch the smallest sufficient image. Serving goes through a CDN that caches at the edge near users, so the origin store sees little traffic and global latency stays low. Because media is immutable, cache invalidation is a non-issue — use content-addressed keys and long TTLs. Lifecycle/tiering moves cold media to cheaper storage. This media plane is fully decoupled from feeds and metadata."),
      C("deep_dive", "Deep dive: feed generation",
        "The home feed is the news-feed problem again: fan-out on write (push each new post id into followers' feed caches) gives instant reads but explodes for huge creators; fan-out on read (pull) is cheap to write but slow for users who follow many. Instagram-scale uses a HYBRID — push for normal accounts, and for creators above a follower threshold, pull their recent posts at read time and merge into the pushed feed — capping write amplification while keeping reads fast. Fan-out runs async through a queue + workers; the per-user feed cache is capped and rebuildable from posts+follows. Explore/discovery is a separate ranked surface backed by an ML recommendation pipeline over candidate posts, not the follow graph."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Media storage volume and CDN bandwidth dominate cost — mitigate with rendition sizing, aggressive CDN caching, and cold-tiering. The celebrity creator is the feed bottleneck — solved by the push/pull threshold. Viral posts cause thundering-herd image loads — the CDN absorbs this, with request coalescing at the origin. Like/comment counters are hot and high-write — shard counters and accept eventual-consistent totals. Trade-offs: push (fast reads, costly writes, storage for inactive followers) vs pull (cheap writes, slow reads) vs hybrid; chronological (cheap) vs ranked feed (engagement, needs ML); strong vs eventual consistency (we relax it for availability and cacheability). Closing signal: a decoupled media plane (object store + CDN) plus a hybrid fan-out feed over a separate metadata store."),
      C("deep_dive", "Deep dive: consistency, counters & operations",
        "A few operational realities round out the design. Consistency: the feed and like/comment counts are eventually consistent — a brand-new post or an updated count propagating a second or two late is acceptable, and that relaxation is exactly what lets you cache aggressively and fan out asynchronously; reserve stronger guarantees for things like follow relationships where correctness matters more. Counters at scale: a viral post's like count is a write hotspot, so don't UPDATE a single row — shard the counter across many keys and sum them (or buffer increments and flush periodically), showing an approximate total that converges; the same applies to view and comment counts. Moderation and safety: uploads flow through an async pipeline that scans for disallowed content (hashing against known-bad sets, ML classifiers) and can quarantine a post without blocking the upload path. Multi-region: place object storage and a multi-region CDN close to users for media, and keep metadata replicas per region with asynchronous cross-region replication, accepting that a post may appear in its home region slightly before others. Observability: track feed-load latency, image p99 from the edge, fan-out lag (how long after posting a follower sees it), and cache hit rate — these are the SLOs that tell you the two planes (media and feed) are healthy. Failure handling: if the feed cache is lost, rebuild it from posts+follows (a latency event, not data loss); if fan-out workers back up, the queue absorbs the spike and drains. Together these make the system degrade gracefully rather than fall over under a celebrity post or a regional outage."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Video too?' add a transcoding pipeline (chunk -> parallel transcode -> HLS/DASH renditions) like the video-streaming design, and serve segments via CDN. 'Stories (24h ephemeral)?' a separate capped, TTL'd store and a lightweight tray, not the main feed. 'Explore/recommendations?' a candidate-generation + ML-ranking pipeline over engagement signals, distinct from the follow-graph feed. 'Search (users, hashtags)?' an inverted index/search service. 'Like counts at viral scale?' sharded counters aggregated asynchronously; show approximate totals. 'Direct messages?' the chat design bolted on. 'Global users?' geo-replicate object storage + multi-region CDN, and place metadata replicas near users. Every answer reduces to the same spine: decouple media (object store + CDN) from metadata, and build the feed with a hybrid push/pull fan-out."),
    ],
    "Instagram is a top-tier question because it forces you to compose two systems: a media plane (pre-signed uploads to object storage + multi-rendition + CDN delivery) and a feed plane (hybrid push/pull fan-out). The signal is keeping media bytes off your app/DB and recognizing the feed is the news-feed problem with celebrity fan-out.",
    [
      G("media_in_db", "Storing image bytes in the database instead of object storage + CDN.", "Put blobs in object storage, serve via CDN, keep only keys/refs in the DB.", "Schema has a BLOB/bytes column for the photo."),
      G("no_celebrity", "Pure push fan-out, ignoring creators with tens of millions of followers.", "Use a hybrid: push for normal users, pull for high-fan-out creators.", "Every post writes to all followers, no threshold."),
      G("upload_through_app", "Uploading image bytes through the app servers.", "Issue pre-signed URLs so clients upload directly to object storage.", "Upload endpoint receives the file body."),
    ],
    0.6, DIAG.insta, "Instagram architecture"),

  // ───────────────────────── VIDEO STREAMING ───────────────────────────────
  TT("sysd_m4", "sysd_m4_t1", 1, "Design Video Streaming (YouTube/Netflix)", "sysd-video-streaming",
    ["case-study", "video", "streaming", "cdn"],
    "Upload a video once; have millions stream it smoothly at the best quality their connection allows, anywhere in the world. What happens to a video between upload and playback?",
    "On upload, a TRANSCODING pipeline splits the video into segments and encodes them at multiple bitrates/resolutions (HLS/DASH), stored in object storage. Playback is pure delivery: a CDN serves segments from the edge and the player does ADAPTIVE BITRATE — switching renditions as bandwidth changes. The watch path is overwhelmingly read/bandwidth-bound, so the CDN and encoding ladder are the design.",
    [
      C("requirements", "Requirements",
        "Functional: upload a video; process it for streaming; play it back with smooth, quality-adaptive delivery; search and (optionally) recommend; track views. Non-functional: massive read bandwidth (streaming dwarfs uploads), low startup latency and minimal rebuffering, global reach, durability of source + encoded assets, and high availability. Distinguish on-demand (VOD — pre-transcoded, the common interview case) from live (real-time transcoding + low-latency delivery). The dominant realities to state: storage and especially CDN BANDWIDTH dominate cost, and a single source video becomes many encoded variants. Clarify VOD vs live early — they change the pipeline substantially, since live demands real-time transcoding and low-latency delivery while VOD can encode offline once and serve forever."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 500M DAU, ~30 min watched/day at ~3 Mbps average:\n  egress/user/day = 0.003 Gbps * 1800 s / 8 ~= 0.68 GB\n  total egress    = 500M * 0.68 GB ~= 340 PB/day  -> CDN bandwidth dominates cost\nStorage: each source video -> ~6 renditions (240p..4K); encoded set can be a few x the source.\nUploads are tiny vs reads (creators << viewers).\nTakeaway: optimize delivery (CDN + adaptive bitrate); transcoding is a heavy but offline batch cost."),
      C("hld", "High-level design",
        "Upload path: creator uploads the source to object storage; a transcoding pipeline (queue + worker fleet) splits it into short segments and encodes each at multiple bitrates/resolutions, packaging HLS/DASH manifests; outputs land back in object storage and are pushed/pulled to the CDN. Metadata (title, status, rendition list) goes to a DB. Playback path: the player fetches the manifest, then streams short segments from the nearest CDN edge, measuring throughput and switching up/down the bitrate ladder per segment (adaptive bitrate). The control plane (upload, metadata, search) is small; the data plane (segments through the CDN) carries essentially all the traffic. Walk it end to end: a creator uploads a source file to object storage -> the pipeline chunks it and a worker fleet encodes each chunk across the bitrate ladder in parallel -> packaged HLS/DASH segments and manifests land back in object storage and the video is marked 'ready' -> a viewer requests the master manifest, the player picks a starting rung, and then streams short segments from the nearest CDN edge, switching rungs per segment as measured bandwidth changes. Note what is NOT on the hot path: transcoding (offline, once per video) and metadata writes (tiny). Everything that scales with audience — segment delivery — is pushed to the edge, which is the entire point of the architecture and the first thing to say out loud."),
      K("api", "API design",
        "POST /api/v1/videos:initUpload -> { uploadUrl, videoId }   (resumable upload to object store)\nGET  /api/v1/videos/{id}            -> { title, status, durationSec }\nGET  /api/v1/videos/{id}/master.m3u8 -> HLS master manifest (lists renditions)\n  -> player then GETs /.../<rendition>/segment_<n>.ts from the CDN\nPOST /api/v1/videos/{id}/view  (fire-and-forget view event)"),
      K("data_model", "Data model",
        "videos:        video_id PK, owner_id, title, status(uploading|transcoding|ready), duration\nrenditions:    video_id, quality(240p..4k), bitrate, manifest_key  (1..N per video)\nassets:        encoded segments + manifests in object storage; CDN caches by key\nview_events:   appended to a stream (Kafka) -> aggregated offline into counts"),
      C("deep_dive", "Deep dive: the transcoding pipeline",
        "Transcoding is the heavy lifting. The source is split into short chunks (e.g. a few seconds each) so they can be encoded IN PARALLEL across a worker fleet — turning a long serial encode into a fast fan-out job. Each chunk is encoded at every rung of a bitrate/resolution LADDER (240p, 360p, 480p, 720p, 1080p, 4K), then packaged into HLS/DASH segments + manifests. A queue feeds workers; a job tracker marks the video 'ready' only when all renditions complete. This is an embarrassingly parallel batch problem; it is compute-heavy but OFFLINE, so it never blocks playback. Live streaming instead transcodes in near-real-time with tighter latency and a rolling window of segments."),
      C("deep_dive", "Deep dive: delivery & adaptive bitrate",
        "Playback quality is a delivery problem solved by CDN + ABR. The CDN caches segments at edges close to viewers, so the origin object store sees little traffic and startup latency is low. The player drives ADAPTIVE BITRATE: it downloads the manifest, starts at a safe rung, measures actual throughput per segment, and switches up for quality or down to avoid rebuffering — all client-side, segment by segment, which is why HLS/DASH chop video into small independently-fetchable pieces. Pre-position (pre-warm) popular content to edges; for the long tail, the edge pulls from origin on first request then caches. Startup latency, rebuffer ratio, and bitrate are the metrics you optimize."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "CDN egress bandwidth is the dominant cost and scaling concern — mitigate with edge caching, popularity-based pre-positioning, and per-region capacity. Transcoding compute spikes with uploads — autoscale the worker fleet and prioritize popular/creator content. Storage multiplies per rendition — tier cold encodes and prune unused rungs. Popular videos are hot — the CDN absorbs them; the long tail risks origin misses — accept higher first-byte latency. Trade-offs: more ladder rungs (better adaptation, more storage/compute) vs fewer; pre-position everything (fast, expensive) vs pull-through (cheap, slower first hit); VOD (offline transcode, simple) vs live (real-time, low-latency, harder). Closing signal: offline parallel transcoding into an ABR ladder, delivered by a CDN with a client-side adaptive player."),
      C("deep_dive", "Deep dive: scaling, cost & operations",
        "The operational story is dominated by bandwidth and compute economics. CDN strategy: popularity is extremely skewed (a small fraction of videos get most views), so pre-position (pre-warm) hot content to edges while letting the long tail pull through from origin on first request and cache thereafter; tiered caching (edge -> regional -> origin) keeps origin egress low. Cost control: CDN egress is the biggest line item, so optimize the encoding ladder (per-title encoding picks the rungs a given video actually needs), use efficient codecs (H.265/AV1) to cut bytes, and cap rungs for low-value content. Transcoding economics: the worker fleet is bursty (spikes with uploads), so autoscale it and use cheap/spot capacity for non-urgent encodes, prioritizing creator and trending content. Storage tiering: keep hot renditions on fast storage and move cold encodes (and rarely-watched rungs) to cheaper tiers; you can even delete and re-encode-on-demand for the deep long tail. Reliability: the watch path must survive an origin or region failure — multiple origins behind the CDN and health-checked failover keep playback up. Live vs VOD: live tightens everything — real-time chunked transcoding, a rolling manifest window, and low-latency delivery (LL-HLS) with much tighter SLAs and no second chances to re-encode. Observability: the metrics that matter are startup latency, rebuffer ratio, average bitrate delivered, and CDN offload (% served from edge) — these directly track perceived quality and cost. Together they make the platform scale to global audiences while keeping the dominant bandwidth bill under control."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Live streaming?' real-time segmented transcoding, a rolling manifest, and low-latency CDN delivery (LL-HLS); tighter SLAs than VOD. 'Recommendations?' a separate ML pipeline over watch history and content features. 'Search?' an inverted index over titles/metadata. 'Resumable/large uploads?' chunked, resumable upload to object storage. 'DRM/piracy?' encrypted segments + license server. 'View counts at scale?' stream view events to Kafka and aggregate offline; show approximate counts. 'Thumbnails/preview scrubbing?' generate sprite sheets during transcoding. 'Global low latency?' multi-region origins + a global CDN with popularity-aware pre-positioning. Every branch returns to the spine: transcode once into an ABR ladder, store in object storage, and deliver via CDN with a client adaptive player."),
    ],
    "Video streaming tests whether you separate the offline transcoding pipeline (parallel chunked encoding into an HLS/DASH bitrate ladder) from the delivery path (CDN edge + client adaptive bitrate). The signal is recognizing the watch path is bandwidth-dominated, so the CDN and encoding ladder are the whole game.",
    [
      G("no_transcode", "Serving the raw uploaded file to all clients instead of an encoded ABR ladder.", "Transcode into multiple bitrates/resolutions packaged as HLS/DASH segments.", "One video file streamed to everyone, no renditions."),
      G("no_cdn", "Streaming segments straight from origin/app servers, ignoring the CDN.", "Serve segments from a CDN at the edge; origin handles only misses.", "No CDN; origin bandwidth carries playback."),
      G("sync_transcode", "Blocking the upload response on transcoding.", "Transcode asynchronously via a queue + worker fleet; mark ready when done.", "Upload waits for encoding to finish."),
    ],
    0.6, DIAG.video, "Video streaming architecture"),

  // ─────────────────────────── RIDE-SHARING ────────────────────────────────
  TT("sysd_m4", "sysd_m4_t2", 2, "Design Ride-Sharing (Uber/Lyft)", "sysd-ride-sharing",
    ["case-study", "uber", "geospatial", "matching"],
    "A rider taps 'request'; within seconds a nearby driver is dispatched, and both watch each other move on a map in real time. Millions of drivers stream their location constantly. How do you find the nearest driver fast, at that write rate?",
    "Drivers continuously stream GPS into a GEOSPATIAL INDEX (geohash / quadtree / S2 cells, kept hot in memory) that supports fast 'who's near this point' queries. A matching service queries nearby available drivers, ranks by ETA, and dispatches one — handling concurrency so a driver isn't double-booked. A trip service runs the lifecycle. The hard parts are the high-frequency location write rate and low-latency proximity search.",
    [
      C("requirements", "Requirements",
        "Functional: rider requests a ride (pickup + destination); system finds and dispatches a nearby available driver; both see live location during the trip; trip lifecycle (requested -> matched -> en route -> in trip -> completed); fare calculation and payment. Non-functional: low-latency matching (seconds), real-time location updates at huge write volume, high availability (an outage strands people), and geographic locality (a query in one city shouldn't scan the globe). Clarify scope: matching + tracking is the core; routing/ETA can lean on a maps service. The defining challenges are absorbing millions of frequent location writes and answering 'nearest available drivers' in milliseconds."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 5M active drivers, each pinging location every 4 s:\n  location writes = 5M / 4 ~= 1,250,000 writes/sec  -> the headline number\nRider requests: ~ tens of thousands/sec at peak.\nLocation record ~= 50 B; the live index is small (current positions only), held in memory.\nHistory (trips, breadcrumb trails) is large -> append to a write-optimized store.\nTakeaway: the location write rate dominates -> in-memory geo index sharded by region;\nproximity queries must be O(nearby), never a full scan."),
      C("hld", "High-level design",
        "Drivers stream location over a persistent connection to a location-ingest service that updates an in-memory GEO INDEX (geohash/quadtree/S2), sharded by region so writes and queries stay local. A rider request hits the matching service, which queries the geo index for available drivers near the pickup cell, ranks candidates by ETA (often via a maps/routing service), and dispatches an offer; on accept, the trip service owns the lifecycle and streams both parties' positions to each other. Trips and location history persist to a write-optimized store; payment runs at completion. Keep the hot real-time path (location + matching, in memory) separate from durable history (trips DB). Trace a ride end to end: drivers continuously stream GPS -> the ingest service updates the in-memory geo index for their region -> a rider requests a ride -> the matching service queries the geo index for available drivers in the pickup's cell (and neighbors), ranks them by ETA, reserves the best one, and sends an offer -> on accept, the trip service creates the trip and streams both positions to each other until completion -> payment settles. The split is deliberate: current positions and matching live in memory (sharded by region) for speed and the punishing write rate, while trips, fares, and breadcrumb history go to a durable, write-optimized store. Saying which data is hot/in-memory/regional vs durable/global is the core architectural judgement here."),
      K("api", "API design",
        "Driver (WebSocket): -> { type:'LOC', lat, lng, ts }   (every few seconds)\nPOST /api/v1/rides { pickup:{lat,lng}, dropoff:{lat,lng} } -> { rideId, status }\nGET  /api/v1/rides/{id}  -> { status, driver:{lat,lng,eta} }\nRider/Driver subscribe over WS for live position + status updates\nPOST /api/v1/rides/{id}/accept   (driver accepts the offer)"),
      K("data_model", "Data model",
        "geo index (in-memory, e.g. Redis):  cell_id -> set of {driver_id, lat, lng, ts, available}\n  cell_id = geohash(lat,lng, precision)   (or quadtree / S2 cell)\ndrivers:   driver_id PK, status(available|on_trip|offline), vehicle\ntrips:     trip_id PK, rider_id, driver_id, state, pickup, dropoff, fare, timestamps\nlocation history: append-only stream (breadcrumbs) -> write-optimized store"),
      C("deep_dive", "Deep dive: geospatial indexing",
        "You cannot scan millions of drivers per request, so positions go into a spatial index that makes 'near this point' cheap. GEOHASH encodes lat/lng into a string where shared prefixes mean spatial proximity, so a prefix lookup returns a cell's drivers (check neighbor cells for boundary cases). QUADTREES recursively subdivide space, denser where drivers are dense; S2/H3 map the globe to hierarchical cells. Keep the index in memory (Redis geospatial or a custom service) and SHARD by region so a city's writes and queries hit one shard — a query touches only the relevant cells, not the planet. Tune cell size: too coarse returns too many candidates, too fine misses drivers near boundaries."),
      C("deep_dive", "Deep dive: matching & dispatch",
        "Matching turns 'nearby drivers' into 'the right driver'. Query the geo index for available drivers within an expanding radius around the pickup, rank by estimated time-to-pickup (real ETA via routing, not straight-line distance), then dispatch an offer to the best candidate. Concurrency is the subtlety: the same driver could be offered to two riders at once, so reserve/lock the driver during the offer (a short hold) and fall through to the next candidate on decline/timeout — exactly the inventory-reservation discipline. Make requests idempotent so a retry doesn't create two trips. Surge/incentives and pre-positioning are layered on top. The flow is: find nearby -> rank by ETA -> reserve -> offer -> confirm or fall through."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "The location write rate (~1M+/sec) is the headline bottleneck — handle it with an in-memory, region-sharded geo index and by writing only current position to the hot path while batching history to durable storage. Hot cities create hot shards — shard finer in dense regions. Matching contention (double-booking) needs reservation/locking with fall-through. The persistent-connection tier (millions of driver sockets) scales like the chat gateway problem. Trade-offs: geo index granularity (coarse = more candidates, fine = boundary misses); straight-line distance (fast, approximate) vs real ETA (accurate, needs routing); strong matching consistency (lock a driver, lower throughput) vs optimistic (faster, risk double-offer). Closing signal: in-memory sharded geo index + ETA-ranked matching with driver reservation."),
      C("deep_dive", "Deep dive: real-time tracking, regions & operations",
        "Beyond matching, the live system has its own demands. Real-time tracking: once matched, both parties watch each other move, so the driver's location stream is forwarded to the rider over a persistent connection (the same stateful-gateway pattern as chat) — present position pushed live, breadcrumb trail persisted for safety/replay and fare auditing. Regional isolation: the world is partitioned into regions/cities, each with its own geo-index shard and matching capacity, so a surge or outage in one city never cascades globally and queries stay local; cross-region travel is rare and handled at the edges. Surge and supply: a pricing service watches local supply vs demand per area and adjusts fares, while demand prediction nudges drivers to pre-position toward expected hotspots — both feed off the same location data. Trip lifecycle and money: the trip service is a state machine (requested -> matched -> arriving -> in-trip -> completed) that must be durable and idempotent (a network retry can't create two trips or double-charge), with payment at completion running the ledgered, idempotent payment-system design. Reliability: if a matching shard fails, riders retry against a healthy replica; if a driver disconnects mid-trip, the trip persists and resumes on reconnect. Observability: match latency, match success rate, driver utilization, location-ingest lag, and surge accuracy are the core SLOs. Hot, dense cities are the stress case — finer geo-sharding, more matching capacity, and tuned cell sizes keep p99 matching time low where demand is highest. The throughline remains: ingest location into a sharded in-memory geo index, and match by nearby + ETA with a reservation, all isolated per region."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Accurate ETAs/routing?' integrate a maps/routing service (graph + live traffic). 'Surge pricing?' a pricing service keyed on local supply/demand. 'Pool/shared rides?' a harder matching/optimization problem batching compatible riders. 'Pre-position drivers?' demand prediction nudging supply. 'Payments?' the payment-system design at trip completion (idempotent, ledger). 'Live location to the rider?' stream the driver's position over the same socket layer. 'Driver/rider safety + replay?' persist breadcrumb trails. 'Region failure?' isolate by region so one city's outage doesn't cascade. Each returns to the spine: ingest location into a sharded in-memory geo index, and match by querying nearby + ranking by ETA with a reservation to avoid double-booking."),
    ],
    "Ride-sharing tests geospatial indexing (geohash/quadtree/S2 in memory, sharded by region) under a punishing location write rate, plus low-latency proximity matching ranked by ETA with driver reservation to prevent double-booking. The signal is never scanning all drivers and separating the hot real-time path from durable history.",
    [
      G("scan_all", "Scanning all drivers (or a SQL distance query) to find the nearest.", "Use a spatial index (geohash/quadtree/S2) so a query touches only nearby cells.", "Finds nearest by computing distance to every driver."),
      G("ignore_write_rate", "Ignoring the millions of location writes per second.", "Keep current positions in an in-memory, region-sharded index; batch history.", "Writes every GPS ping straight to a relational DB."),
      G("double_book", "Matching without reserving the driver, allowing double-booking.", "Reserve/lock the driver during the offer and fall through on decline.", "Two riders can be offered the same driver concurrently."),
    ],
    0.6, DIAG.uber, "Ride-sharing architecture"),

  // ─────────────────────────────── WEB CRAWLER ─────────────────────────────
  TT("sysd_m4", "sysd_m4_t4", 4, "Design a Web Crawler", "sysd-web-crawler",
    ["case-study", "crawler", "frontier", "dedupe"],
    "Fetch billions of web pages to build a search index — without hammering any one site, re-fetching the same page forever, or getting stuck in infinite link loops. What controls what gets fetched next?",
    "A URL FRONTIER (a prioritized, per-domain set of queues) decides what to fetch next; a fleet of fetchers downloads pages politely (respecting robots.txt and per-domain rate limits); parsers extract content and links; a DEDUPE layer (seen-URL set via bloom filter + content hashing) stops re-crawling and traps; new URLs flow back into the frontier. Politeness and dedupe at scale are the substance.",
    [
      C("requirements", "Requirements",
        "Functional: start from seed URLs, fetch pages, extract and follow links, store content for indexing, and recrawl for freshness. Non-functional: scale to billions of pages, be POLITE (obey robots.txt and never overload a single domain), be fault-tolerant (resume after crashes), avoid duplicate work and infinite traps, and be extensible (pluggable parsers, priorities). Clarify scope: breadth of the web, freshness targets, and content types. Two qualities define the design: politeness (per-domain rate limiting so you're a good web citizen and don't get blocked) and deduplication (not re-fetching the same URL or near-identical content across a near-infinite, cyclic link graph)."),
      K("estimation", "Capacity estimation (with numbers)",
        "Target 1B pages/month:\n  fetch rate = 1B / (30*86400) ~= 385 pages/sec  (sustained; bursty per domain)\n  avg page ~= 100 KB -> 1B * 100 KB ~= 100 TB/month of raw content\nSeen-URL set: ~1B+ URLs -> a bloom filter keeps membership in a few GB of RAM\n  (vs hundreds of GB for full strings) at a small false-positive cost.\nFrontier holds tens of millions of pending URLs.\nTakeaway: dedupe must be memory-efficient (bloom filter); politeness caps per-domain rate, not global."),
      C("hld", "High-level design",
        "Seeds enter the URL FRONTIER, which organizes pending URLs into per-domain queues with priorities and politeness timers. Fetcher workers pull the next eligible URL (a domain whose rate-limit window allows it), download the page (after a robots.txt check and DNS resolution), and hand the content to parsers. Parsers store the raw/processed content for indexing and EXTRACT outbound links. Each extracted link is checked against the SEEN set (bloom filter) and normalized; new ones are enqueued back into the frontier. A scheduler also re-enqueues pages for recrawl based on freshness. The loop — frontier -> fetch -> parse -> dedupe -> frontier — runs across many distributed workers, with the frontier and seen-set as shared coordination state. Trace one URL: it sits in its domain's queue until the domain's politeness timer allows it -> a fetcher resolves DNS (cached), checks robots, and downloads the page -> the parser stores the content and extracts outbound links -> each link is normalized and tested against the bloom-filter seen-set -> unseen links are enqueued into their respective domain queues, and the page is scheduled for a future recrawl based on its change rate. The whole thing is a feedback loop that must remain bounded (dedupe + traps) and polite (per-domain pacing) while still achieving high aggregate throughput by working thousands of domains in parallel. Emphasizing that throughput comes from breadth across domains — not speed against any one — is the key framing."),
      K("api", "Interfaces (internal)",
        "Frontier:\n  enqueue(url, priority)        // add a discovered/recrawl URL\n  next(workerId) -> url | wait  // returns a politeness-eligible URL\nSeen set:\n  seen?(normalize(url)) -> bool // bloom filter membership\n  mark(normalize(url))\nContent store:\n  put(url, fetched_at, content_hash, body)\n(No public API — a crawler is an internal pipeline, not a request/response service.)"),
      K("data_model", "Data model",
        "frontier:     per-domain queues { domain -> [ {url, priority, earliest_fetch_ts} ] }\nseen URLs:    bloom filter (membership) + a durable set/store for exact checks\ncontent:      url PK, fetched_at, content_hash, storage_key (raw HTML in object store)\ndomain state: domain PK, last_fetch_ts, crawl_delay (from robots.txt), failures\ndns cache:    host -> ip (TTL'd) to avoid resolving every fetch"),
      C("deep_dive", "Deep dive: the URL frontier & politeness",
        "The frontier is the brain — it decides ORDER and PACE. Politeness: never hit one domain too fast, so URLs are bucketed into PER-DOMAIN queues, each with a next-allowed-time derived from robots.txt crawl-delay; a fetcher only takes a URL whose domain timer has elapsed. This decouples global throughput (high, across many domains) from per-domain rate (low, polite). Priority: a second axis orders by importance/freshness (e.g. PageRank-ish signals, update frequency) so valuable pages are fetched sooner — typically a two-level design (priority queues feeding per-domain queues). DNS is cached to avoid resolving on every fetch. The frontier is distributed and persistent so a crash resumes where it left off rather than recrawling from seeds."),
      C("deep_dive", "Deep dive: dedupe, traps & freshness",
        "At web scale you must not re-fetch the same URL or store near-identical pages. URL dedupe: normalize URLs (canonical form, strip fragments/session params) and test membership in a SEEN set — a BLOOM FILTER gives O(1) membership in a few GB for a billion URLs, accepting a tiny false-positive rate (occasionally skipping a new URL) in exchange for memory. Content dedupe: hash page content (or shingles/simhash for near-duplicates) to drop mirrors and boilerplate. Traps: infinite calendars, session-id loops, and cyclic links are bounded with max-depth/URL-budget per domain and pattern detection. Freshness: pages change, so re-enqueue for recrawl on a cadence tuned to observed change rate. These keep a finite crawler productive over an effectively infinite, cyclic graph."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "DNS resolution can bottleneck fetch throughput — cache aggressively. Politeness fundamentally caps per-domain speed — you scale by breadth (many domains in parallel), not by hammering one. The seen-set must be memory-efficient and distributed — bloom filters trade a small false-positive rate for huge memory savings. Storage of billions of pages needs object storage + tiering. Dynamic/JS-rendered pages may need a headless renderer (expensive) — crawl selectively. Trade-offs: bloom filter (tiny memory, rare false negatives) vs exact set (perfect, huge memory); breadth-first coverage vs priority-first importance; freshness (recrawl often, more load) vs coverage (crawl new pages). Closing signal: a politeness-aware prioritized frontier + bloom-filter dedupe + content hashing, looping across distributed fetchers."),
      C("deep_dive", "Deep dive: distribution, freshness & operations",
        "Running a crawler at scale is a distributed-systems exercise. Distribution: partition the frontier and the seen-set by DOMAIN hash so each domain is owned by exactly one worker/shard — this keeps politeness correct (one place enforces a domain's rate) and lets you add workers to scale throughput by breadth. Coordination state (frontier, seen-set, domain timers) is shared and persistent so the crawl survives crashes and resumes rather than restarting from seeds. Freshness: the web changes constantly, so pages are re-enqueued for recrawl on an ADAPTIVE cadence — frequently-changing pages (news) recrawl often, static pages rarely — driven by observed change rate, balancing freshness against load. DNS: resolving a host on every fetch would bottleneck throughput, so cache DNS aggressively with TTLs. Fault tolerance: fetchers fail, time out, or hit 5xx/429 — retry with backoff, track per-domain failure rates, and back off or drop hostile/dead domains. Cost and selectivity: rendering JavaScript-heavy pages needs a headless-browser tier that is far more expensive than a plain fetch, so apply it selectively to sites that require it. Storage: billions of pages go to object storage with content hashing for near-duplicate detection (simhash/minhash) so mirrors and boilerplate don't bloat the index. Observability: pages/sec, per-domain politeness compliance, frontier size, dedupe hit rate, and crawl freshness are the SLOs. The spine holds: a polite, prioritized, per-domain frontier with memory-efficient dedupe, sharded by domain across resilient distributed fetchers."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Distribute it?' partition the frontier and seen-set by domain hash across nodes so each domain is owned by one worker (preserving politeness). 'Detect near-duplicate content?' simhash/minhash shingling, not just exact hashes. 'JavaScript-heavy sites?' a headless-browser render tier, used selectively for cost. 'Respect robots and crawl budgets?' parse and cache robots.txt per domain; honor crawl-delay and disallow rules. 'Prioritize what to crawl?' importance signals (links in, change frequency) feeding the priority queue. 'Freshness?' adaptive recrawl by observed change rate. 'Avoid spider traps?' depth/budget caps and URL pattern heuristics. Each returns to the spine: a prioritized, polite, per-domain frontier with memory-efficient dedupe, run by distributed fetchers."),
    ],
    "The web crawler tests systems thinking about an unbounded, cyclic graph: a polite, prioritized URL frontier (per-domain rate limiting), memory-efficient dedupe (bloom filter for seen URLs + content hashing), and trap/freshness handling. The signal is politeness-by-design and bloom-filter dedupe, not a naive BFS.",
    [
      G("no_politeness", "Crawling without per-domain rate limiting / robots.txt.", "Bucket URLs into per-domain queues with crawl-delay timers.", "Fetches as fast as possible regardless of domain."),
      G("naive_dedupe", "Storing all seen URLs as exact strings (hundreds of GB) or not deduping.", "Use a bloom filter for membership + content hashing for near-dupes.", "Keeps a full set of every URL string in memory."),
      G("traps", "No handling of infinite link loops / spider traps.", "Add max-depth/URL budgets per domain and pattern detection.", "Assumes the link graph is finite/acyclic."),
    ],
    0.6, DIAG.crawler, "Web crawler architecture"),

  // ─────────────────────────── DISTRIBUTED CACHE ───────────────────────────
  TT("sysd_m8", "sysd_m8_t1", 1, "Design a Distributed Cache", "design-distributed-cache",
    ["case-study", "cache", "consistent-hashing", "eviction"],
    "One Redis box can't hold the working set or the request rate anymore. You need a cache spread across many nodes that stays fast, survives a node dying, and keeps a high hit rate. How do you place keys and keep it consistent with the database?",
    "Spread keys across nodes with CONSISTENT HASHING (so adding/removing a node moves minimal data), replicate for availability, and evict with LRU/LFU/TTL to bound memory. The app uses a cache pattern (usually cache-aside) and must handle invalidation and cache stampedes. The crux is placement that rebalances cheaply, a high hit rate, and a sane consistency story with the source of truth.",
    [
      C("requirements", "Requirements",
        "Functional: get(key), set(key, value, ttl), delete(key); scale capacity and throughput beyond one node; survive node failure. Non-functional: sub-millisecond reads, very high hit rate, horizontal scalability, high availability, and bounded memory (eviction). Clarify the use: read-through accelerator in front of a database (the common case), or a primary key-value store? And the consistency requirement vs the DB — can the cache be briefly stale (almost always yes)? The defining problems are spreading keys so the cluster scales and rebalances cheaply, keeping the hit rate high under memory limits, and reconciling cache contents with the database without serving dangerously stale data."),
      K("estimation", "Capacity estimation (with numbers)",
        "Target 1 TB hot working set, 1M ops/sec:\n  nodes by memory: 1 TB / 64 GB per node ~= 16 nodes\n  nodes by throughput: 1M / ~100k ops/sec per node ~= 10 nodes  (take the larger)\nHit rate math: at 95% hits, the DB sees 5% * 1M = 50k ops/sec instead of 1M\n  -> a 20x load reduction; every % of hit rate matters.\nEntry overhead ~= tens of bytes/key metadata.\nTakeaway: size by max(memory, throughput); the hit rate is the whole point."),
      C("hld", "High-level design",
        "Clients (or a proxy/router) map each key to a node via CONSISTENT HASHING and talk to that node directly, so reads/writes are a single hop. Each node is an in-memory key-value store with an eviction policy. For availability, each key's data is replicated to one or more other nodes (or the cluster reshards on failure). The application typically uses CACHE-ASIDE: on read, check the cache; on miss, load from the database and populate the cache; on write, update the DB and invalidate/update the cache. The cache is an optimization layer in front of the durable store — losing it degrades latency, not correctness. Trace a read: client hashes the key to a node via the ring -> that node returns the value on a hit (sub-ms), or signals a miss -> the app loads from the database and populates the cache so the next read hits. Trace a write: the app updates the database, then invalidates (or updates) the cache entry so stale data isn't served. Two routing choices to mention: a smart CLIENT that knows the ring and talks to nodes directly (one hop, no middle tier) versus a PROXY layer that hides the topology (simpler clients, an extra hop). The recurring theme is that the cache is derived state — every design choice (placement, replication, eviction, invalidation) is about maximizing hit rate and availability while keeping it acceptably consistent with the database that remains the source of truth."),
      K("api", "API / patterns",
        "get(key) -> value | null\nset(key, value, ttlSec)\ndelete(key)\n\nCache-aside (most common):\n  v = cache.get(k)\n  if v == null: v = db.read(k); cache.set(k, v, ttl)\n  return v\nWrite: db.write(k, v); cache.delete(k)   // invalidate; next read repopulates"),
      K("data_model", "State model",
        "ring:   hash(key) -> node (consistent hashing, virtual nodes for even spread)\nnode:   in-memory hashtable { key -> {value, expires_at} }\n        + eviction metadata (LRU list / LFU counters)\nreplication: each key on primary + R replicas (or resilient resharding on failure)\nTTL: per-entry expiry for time-bounded freshness and memory reclamation"),
      C("deep_dive", "Deep dive: partitioning & replication",
        "Naive key % N placement reshuffles almost every key when N changes (a node added/removed) — catastrophic for a cache (mass misses). CONSISTENT HASHING maps keys and nodes onto a ring; a key belongs to the next node clockwise, so adding/removing a node only moves the keys in the adjacent arc — minimal disruption. VIRTUAL NODES (many tokens per physical node) smooth out hot spots and uneven splits, and make rebalancing gradual. For availability, replicate each key to the next node(s) on the ring so a node death doesn't lose that slice (or accept misses and reshard, repopulating from the DB). Routing can be client-side (smart clients know the ring) or via a proxy layer."),
      C("deep_dive", "Deep dive: eviction, invalidation & stampedes",
        "Memory is bounded, so eviction decides what to drop: LRU (evict least-recently-used — simple, great for temporal locality), LFU (least-frequently-used — better when popularity is stable), or TTL-based expiry; many systems combine them. Consistency with the DB is via the write pattern: cache-aside with invalidate-on-write is the default; write-through (write cache+DB together) keeps them in sync at write cost; write-back (write cache, async to DB) is fast but risks loss. The classic failure is the CACHE STAMPEDE: a hot key expires and thousands of concurrent misses hammer the DB at once — prevent it with request coalescing (single-flight: one loader fills the key while others wait), early/jittered expiry, or locks. Hot keys also concentrate load on one node — replicate them or add a small client-local cache."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Hot keys overload a single node — mitigate with replication of hot entries and client-side micro-caching. Cache stampedes spike the DB on expiry — coalesce requests and jitter TTLs. Rebalancing on membership changes causes a miss burst — consistent hashing + vnodes minimizes it; warm new nodes gradually. Staleness vs freshness is the core trade-off — short TTLs and invalidation reduce staleness at the cost of hit rate and DB load. Trade-offs: consistent hashing (cheap rebalance) vs simple sharding (cheap routing, brutal rebalance); LRU vs LFU (recency vs frequency); cache-aside (simple, brief staleness) vs write-through (consistent, slower writes) vs write-back (fast, risk loss); replicate hot keys (availability) vs memory cost. Closing signal: consistent-hashing placement + an eviction policy + cache-aside with stampede protection."),
      C("deep_dive", "Deep dive: availability, multi-region & operations",
        "The operational concerns center on availability and consistency. Node failure: with replication, a replica takes over the failed node's keys; without it, the ring reshards and the affected keys simply miss and repopulate from the database — a latency blip, not data loss, which is acceptable precisely because the cache isn't the source of truth. Warm-up: a freshly added (or restarted) node starts cold, so a burst of misses hits the DB until it fills — mitigate by gradually shifting traffic, pre-warming critical keys, or shadow-filling before cutover. Multi-region: a per-region cache gives low latency but each region can hold a slightly different view (looser consistency), while a single global cache is consistent but adds cross-region latency — choose per how tolerant the data is to staleness; session/data caches usually go per-region. Write policies revisited: cache-aside is the default; write-through keeps cache and DB in lockstep at extra write latency; write-back is fastest but risks losing un-flushed writes on a crash, so it's only for tolerant data. Memory and eviction tuning: track hit rate, evictions/sec, and per-key size; if eviction churn is high you're under-provisioned or your policy (LRU vs LFU) mismatches the access pattern. Observability: hit rate (the headline metric), p99 latency, evictions, hot-key skew, and DB fall-through QPS tell you whether the cache is doing its job. Hot keys remain the perennial risk — replicate them, add a tiny client-local cache, and coalesce misses. The spine holds: consistent-hashing placement with replication, a fitting eviction policy, and a write/invalidation pattern with stampede protection."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How does it stay consistent with the DB?' cache-aside + invalidate on write, accepting brief staleness; use short TTLs for bounds. 'Node fails?' replicas take over or the ring reshards and repopulates from the DB. 'Thundering herd on a hot expiry?' single-flight loading, early recompute, jittered TTLs. 'Multi-region?' per-region caches (low latency, looser consistency) vs a global cache (consistent, higher latency). 'Large values / eviction tuning?' size caps + the right policy (LRU/LFU/TTL). 'Write-heavy?' consider write-through/write-back trade-offs. 'Cold start after deploy?' warm critical keys. Each returns to the spine: consistent-hashing placement with replication, an eviction policy, and a cache pattern with stampede protection."),
    ],
    "The distributed cache tests consistent hashing (cheap rebalancing + even spread via vnodes), an eviction policy under bounded memory, and the consistency/stampede story with the source of truth. The signal is rejecting key % N, choosing cache-aside with invalidation, and naming stampede protection.",
    [
      G("modulo_hashing", "Placing keys with key % node-count, so scaling reshuffles everything.", "Use consistent hashing with virtual nodes; only adjacent keys move.", "Routing is hash(key) % N."),
      G("no_stampede", "Ignoring cache stampede when a hot key expires.", "Add single-flight loading, jittered TTLs, or locks on miss.", "No plan for many simultaneous misses on one key."),
      G("no_invalidation", "No story for keeping the cache consistent with the DB.", "Use cache-aside with invalidate-on-write and TTLs.", "Writes update the DB but never touch the cache."),
    ],
    0.5, DIAG.cache, "Distributed cache architecture"),

  // ─────────────────────────────── TYPEAHEAD ───────────────────────────────
  TT("sysd_m3", "sysd_m3_t2", 2, "Design Search Autocomplete (Typeahead)", "sysd-autocomplete",
    ["case-study", "autocomplete", "trie", "top-k"],
    "As the user types each character, you suggest the top few completions in well under 100ms, for a query volume larger than search itself. Computing the best completions from scratch on every keystroke is impossible. How is it instant?",
    "Suggestions are PRECOMPUTED, not computed live. A TRIE (prefix tree) stores popular queries, and crucially the TOP-K completions are cached AT EACH NODE so a prefix lookup returns answers in O(prefix length) without scanning the subtree. The trie is built offline by aggregating query logs into weights, sharded by prefix, and fronted by a cache for hot prefixes. It's a read-optimized, precompute-then-serve design.",
    [
      C("requirements", "Requirements",
        "Functional: given a prefix, return the top-k (e.g. 5-10) most relevant completions, updated on every keystroke; rank by popularity (and optionally personalization/recency). Non-functional: extremely low latency (sub-100ms per keystroke — it fires constantly while typing), very high read QPS (more than the searches themselves, since each query is many keystrokes), and reasonable freshness (new trending terms appear within hours, not seconds). Clarify scope: global popularity vs personalized, and how fresh suggestions must be. The defining constraint is that you CANNOT rank candidates from scratch per keystroke — the answer must be precomputed and served by a near-constant-time lookup."),
      K("estimation", "Capacity estimation (with numbers)",
        "Assume 100M searches/day, ~20 keystrokes each -> 2B suggestion requests/day\n  = 2B / 86400 ~= 23,000 req/sec (peak much higher)  -> read-dominated\nVocabulary: tens of millions of distinct popular prefixes/queries.\nTrie + cached top-k per node fits in memory across a sharded fleet (low GBs).\nThe build pipeline processes the query-log stream offline; serving reads precomputed data.\nTakeaway: precompute offline, serve from memory; per-keystroke latency budget is tiny."),
      C("hld", "High-level design",
        "Read path: the client sends the current prefix to a suggestion service, which walks a TRIE to the prefix node and returns that node's precomputed TOP-K completions — an in-memory, near-constant-time lookup, fronted by a cache for the hottest prefixes. Build path (offline): a pipeline aggregates raw query logs into per-query frequencies/weights, then (re)builds the trie with top-k cached at each node, and ships it to the serving fleet. The trie is sharded by leading prefix so the dataset scales horizontally and a request routes to one shard. The expensive ranking work happens offline and periodically; the online path only reads. Trace a keystroke: the client debounces rapid typing and sends the current prefix -> the suggest service checks a hot-prefix cache, and on a miss walks the trie (routed to the shard owning that prefix range) to the prefix node -> it returns that node's precomputed top-k, already ranked, in a single near-constant-time step. Trace the build: query logs stream in -> a batch job aggregates them into time-decayed frequencies -> the trie is reconstructed with top-k propagated to every node -> the new structure is shipped and hot-swapped into the serving fleet, optionally with a small real-time layer folded on top for trending terms. The architectural crux to state plainly: all ranking is moved off the request path into the offline build, so serving is a pure, cache-friendly lookup — the only way to hit a sub-100ms budget at keystroke QPS."),
      K("api", "API design",
        "GET /api/v1/suggest?q=<prefix>&limit=8\n  200: { suggestions: [ { text, score }, ... ] }   // already ranked, top-k\n  (called on each keystroke; debounced client-side; cacheable per prefix)\nInternal build job:\n  buildTrie(aggregatedCounts) -> shipped trie segments with per-node top-k"),
      K("data_model", "Data model",
        "trie node:   char edges -> children; top_k: [ {query, weight} ]  // CACHED at the node\n  so suggest(prefix) = walk to node, return node.top_k (no subtree scan)\nquery counts: query -> frequency (aggregated from logs, time-decayed)\nsharding:    by first 1-2 chars of the prefix -> shard owner\ncache:       hot prefix -> top_k (LRU), in front of the trie service"),
      C("deep_dive", "Deep dive: the trie with precomputed top-k",
        "A plain trie finds a prefix node in O(prefix length), but the completions are everything in that node's SUBTREE — scanning and ranking that per keystroke is far too slow for popular short prefixes (whose subtrees are huge). The key optimization: STORE THE TOP-K at every node. During the offline build, propagate each query's weight up to all its prefix ancestors and keep only the best k at each node. Then suggest(prefix) is just: walk to the node, return its cached top-k — near-constant time regardless of subtree size. This precomputation is what makes per-keystroke latency tiny; it trades extra memory and build cost for instant reads, exactly the right trade for a read-dominated workload."),
      C("deep_dive", "Deep dive: building & updating",
        "The trie is built OFFLINE from query logs: aggregate raw queries into frequencies (with TIME DECAY so trending terms rise and stale ones fade), filter spam/inappropriate terms, then construct the trie and compute per-node top-k. Rebuild periodically (e.g. hourly) and hot-swap the served data — most autocomplete doesn't need second-level freshness. Sharding: partition the trie by leading characters so each shard owns a prefix range, letting the structure exceed one machine and routing each request to one shard. For faster trending, a smaller real-time layer can fold very recent counts on top of the batch trie. Personalization, when needed, blends a per-user signal at query time over the global top-k."),
      C("bottlenecks", "Bottlenecks & trade-offs",
        "Trie memory grows with vocabulary and the k cached per node — bound it by pruning rare queries and limiting k. Update lag: batch rebuilds mean new terms appear with a delay — acceptable for most, but trending/breaking queries need a real-time overlay. Hot prefixes (short, popular) get hammered — front them with a cache and replicate those shards. Per-keystroke QPS is enormous — debounce on the client and cache aggressively. Trade-offs: precompute top-k (fast reads, more memory + build cost) vs compute-on-read (cheap memory, too slow); batch freshness (simple, laggy) vs real-time overlay (fresh, complex); global ranking (simple, cacheable) vs personalized (relevant, less cacheable). Closing signal: precomputed top-k in a sharded trie, served from memory with a hot-prefix cache."),
      C("deep_dive", "Deep dive: freshness, personalization & operations",
        "A few refinements complete the design. Freshness vs simplicity: most autocomplete is fine with hourly batch rebuilds, but breaking/trending queries (a sudden news term) need to surface faster — add a small REAL-TIME counting layer (recent counts in a fast store) and fold it over the batch trie at query time, so trends appear in minutes without rebuilding everything. Time decay: weight recent queries more so the suggestions track current intent and stale terms fade — without decay, last year's popular queries dominate forever. Personalization: global top-k is simple and highly cacheable; personalization blends a per-user signal (history, location, language) at query time, which is more relevant but less cacheable — a common compromise is global suggestions lightly re-ranked by a cheap personal signal. Quality and safety: the build step filters spam, adult, and offensive terms and applies a blocklist, since suggestions are a brand-visible surface. Fuzzy matching: real users typo, so layer edit-distance or n-gram matching over the trie to tolerate misspellings. Multi-language/locale: maintain per-locale tries so suggestions match the user's language. Operations: shard by leading prefix, replicate hot shards, debounce on the client to cut keystroke QPS, and watch p99 suggestion latency, cache hit rate on hot prefixes, and rebuild lag as the core SLOs. The spine holds: precompute ranked top-k offline into a sharded trie, serve instant in-memory lookups, and overlay a small real-time layer for trends."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How is it so fast?' precomputed top-k at each trie node — no live ranking. 'Trending/breaking terms?' a real-time counting layer folded over the batch trie. 'Typos/fuzzy matching?' edit-distance or n-gram matching on top of the trie. 'Personalization?' blend a per-user/history signal at query time. 'Filter offensive/spam suggestions?' a curation/blocklist step in the build. 'Multi-language?' per-locale tries. 'Scale the structure?' shard by leading prefix and replicate hot shards. 'Reduce keystroke load?' client-side debounce + per-prefix caching. Each returns to the spine: precompute ranked completions offline into a sharded trie with cached top-k, and serve instant in-memory lookups."),
    ],
    "Typeahead tests the precompute-then-serve mindset: a trie with TOP-K cached at each node so suggestions are a near-constant-time lookup, built offline from time-decayed query logs and sharded by prefix. The signal is realizing you cannot rank per keystroke — you precompute and cache, and serve from memory.",
    [
      G("rank_on_read", "Scanning/ranking the subtree on every keystroke.", "Precompute and cache top-k at each trie node; suggest = walk + return.", "Computes best completions live per request."),
      G("no_offline_build", "Updating rankings synchronously on the read path.", "Aggregate query logs offline (time-decayed), rebuild the trie, hot-swap.", "Writes counts and re-ranks during the suggest call."),
      G("no_sharding_cache", "A single in-memory trie with no sharding or hot-prefix cache.", "Shard by leading prefix and cache hot prefixes; replicate hot shards.", "One node holds everything; short prefixes overload it."),
    ],
    0.5, DIAG.type, "Search autocomplete (typeahead) architecture"),
];

// ── 3 exercises per topic ────────────────────────────────────────────────────
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);
function pm(moduleId, o) {
  return { trackKey: TRACK_KEY, moduleId, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const EXERCISES = [
  // Instagram
  pm("sysd_m3", { topicId: "sysd_m3_t4", exerciseId: "sysd_m3_t4_pm_d1", position: 11, level: "medium",
    title: "Where do the photos live?", scenario: "At 200 TB/day of images, where should the photo bytes be stored and served from?",
    options: ["Object storage, served via a CDN", "A relational DB BLOB column", "The feed cache (Redis)", "On the app servers' local disk"],
    correct: "Object storage, served via a CDN",
    explanation: "Large immutable blobs belong in object storage (cheap, durable) and are served via a CDN; the DB holds only metadata/keys." }),
  pm("sysd_m3", { topicId: "sysd_m3_t4", exerciseId: "sysd_m3_t4_pm_d2", position: 12, level: "hard",
    title: "Upload path", scenario: "How should clients upload images without bottlenecking your app servers' bandwidth?",
    options: ["Pre-signed URLs so clients PUT directly to object storage", "POST the file to the app server, which forwards it", "Base64-encode it into the post JSON", "Upload to the feed cache first"],
    correct: "Pre-signed URLs so clients PUT directly to object storage",
    explanation: "Pre-signed URLs let bytes go client -> object store directly; app servers only handle metadata, not image bandwidth." }),
  pm("sysd_m3", { topicId: "sysd_m3_t4", exerciseId: "sysd_m3_t4_pm_d3", position: 13, level: "medium",
    title: "Feed for a creator with 50M followers", scenario: "Pure push fan-out melts on huge creators. What do Instagram-scale systems do?",
    options: ["Hybrid: pull celebrity posts at read time and merge", "Push to all 50M followers synchronously", "Disable feeds for big creators", "Store the feed in a relational DB"],
    correct: "Hybrid: pull celebrity posts at read time and merge",
    explanation: "Above a follower threshold, pull instead of push and merge at read time — the same hybrid that solves news-feed celebrity fan-out." }),
  // Video streaming
  pm("sysd_m4", { topicId: "sysd_m4_t1", exerciseId: "sysd_m4_t1_pm_d1", position: 11, level: "medium",
    title: "What makes playback adapt to bandwidth?", scenario: "A viewer's connection fluctuates mid-video. What keeps playback smooth?",
    options: ["Adaptive bitrate over an HLS/DASH ladder of renditions", "Re-uploading the video at a lower quality", "A bigger origin server", "Buffering the whole file first"],
    correct: "Adaptive bitrate over an HLS/DASH ladder of renditions",
    explanation: "The video is pre-encoded at multiple bitrates; the player switches renditions per segment based on measured throughput (ABR)." }),
  pm("sysd_m4", { topicId: "sysd_m4_t1", exerciseId: "sysd_m4_t1_pm_d2", position: 12, level: "hard",
    title: "Speeding up transcoding", scenario: "A 2-hour upload must be transcoded quickly into many renditions. Best approach?",
    options: ["Split into chunks and encode them in parallel across workers", "Encode the whole file serially on one big machine", "Skip transcoding and stream the source", "Transcode lazily on the first view"],
    correct: "Split into chunks and encode them in parallel across workers",
    explanation: "Chunking makes transcoding embarrassingly parallel — a worker fleet encodes segments concurrently, then packages HLS/DASH." }),
  pm("sysd_m4", { topicId: "sysd_m4_t1", exerciseId: "sysd_m4_t1_pm_d3", position: 13, level: "medium",
    title: "What dominates cost/scaling?", scenario: "For an on-demand video platform, which resource dominates?",
    options: ["CDN egress bandwidth for delivery", "Database writes", "The upload endpoint", "Metadata storage"],
    correct: "CDN egress bandwidth for delivery",
    explanation: "Streaming bandwidth dwarfs everything; the CDN edge carries playback and dominates cost, so delivery is optimized first." }),
  // Ride-sharing
  pm("sysd_m4", { topicId: "sysd_m4_t2", exerciseId: "sysd_m4_t2_pm_d1", position: 11, level: "hard",
    title: "Finding the nearest driver", scenario: "Millions of drivers; you must find those near a pickup in milliseconds. What structure?",
    options: ["A geospatial index (geohash/quadtree/S2) in memory", "A SQL query computing distance to every driver", "A full scan of the drivers table", "A relational join on lat/lng"],
    correct: "A geospatial index (geohash/quadtree/S2) in memory",
    explanation: "Spatial indexes return drivers in nearby cells without scanning everyone; kept in memory and sharded by region for speed." }),
  pm("sysd_m4", { topicId: "sysd_m4_t2", exerciseId: "sysd_m4_t2_pm_d2", position: 12, level: "medium",
    title: "The headline write rate", scenario: "5M drivers ping location every ~4s. What does that imply for the design?",
    options: ["~1M+ writes/sec -> in-memory region-sharded index, batch history", "Negligible load; a single SQL table is fine", "Use one global lock per update", "Store every ping synchronously in the trips DB"],
    correct: "~1M+ writes/sec -> in-memory region-sharded index, batch history",
    explanation: "The current-position index lives in memory and is sharded by region to absorb the write rate; history is batched to durable storage." }),
  pm("sysd_m4", { topicId: "sysd_m4_t2", exerciseId: "sysd_m4_t2_pm_d3", position: 13, level: "hard",
    title: "Avoiding double-booking", scenario: "Two riders could be matched to the same driver at once. How do you prevent it?",
    options: ["Reserve/lock the driver during the offer, fall through on decline", "Hope it doesn't happen", "Match by lowest driver id", "Let both trips start and cancel one later"],
    correct: "Reserve/lock the driver during the offer, fall through on decline",
    explanation: "A short reservation/lock during the offer (with fall-through to the next candidate) prevents concurrent double-booking — the inventory-reservation pattern." }),
  // Web crawler
  pm("sysd_m4", { topicId: "sysd_m4_t4", exerciseId: "sysd_m4_t4_pm_d1", position: 11, level: "medium",
    title: "Being polite", scenario: "How does a crawler avoid overloading any single website?",
    options: ["Per-domain queues with crawl-delay rate limiting", "A single global rate limit", "Crawling each domain's pages all at once", "Ignoring robots.txt"],
    correct: "Per-domain queues with crawl-delay rate limiting",
    explanation: "Politeness is per-domain: bucket URLs by domain with a next-allowed-time from robots.txt, so global throughput stays high without hammering one site." }),
  pm("sysd_m4", { topicId: "sysd_m4_t4", exerciseId: "sysd_m4_t4_pm_d2", position: 12, level: "hard",
    title: "Dedupe at a billion URLs", scenario: "You must avoid re-fetching seen URLs without storing every string in RAM. What fits?",
    options: ["A bloom filter for membership", "A hash set of all URL strings in memory", "A SQL SELECT per URL", "No dedupe — just recrawl"],
    correct: "A bloom filter for membership",
    explanation: "A bloom filter gives O(1) membership for a billion URLs in a few GB, accepting a tiny false-positive rate — far cheaper than exact strings." }),
  pm("sysd_m4", { topicId: "sysd_m4_t4", exerciseId: "sysd_m4_t4_pm_d3", position: 13, level: "medium",
    title: "What decides crawl order?", scenario: "Which component decides what URL gets fetched next and when?",
    options: ["The URL frontier (prioritized, per-domain queues)", "The content store", "The parser", "The DNS resolver"],
    correct: "The URL frontier (prioritized, per-domain queues)",
    explanation: "The frontier governs order (priority) and pace (per-domain politeness) — it's the brain of the crawler." }),
  // Distributed cache
  pm("sysd_m8", { topicId: "sysd_m8_t1", exerciseId: "sysd_m8_t1_pm_d1", position: 11, level: "medium",
    title: "Placement that survives scaling", scenario: "Adding a cache node shouldn't reshuffle every key. Which scheme?",
    options: ["Consistent hashing with virtual nodes", "key % number_of_nodes", "Round-robin per request", "Random node per key"],
    correct: "Consistent hashing with virtual nodes",
    explanation: "Modulo placement remaps almost all keys when N changes (mass misses); consistent hashing moves only the adjacent arc, vnodes even out load." }),
  pm("sysd_m8", { topicId: "sysd_m8_t1", exerciseId: "sysd_m8_t1_pm_d2", position: 12, level: "hard",
    title: "Cache stampede", scenario: "A hot key expires and thousands of requests miss simultaneously, hammering the DB. Best fix?",
    options: ["Single-flight loading + jittered TTLs", "Increase the DB connection pool", "Disable the cache for that key", "Lower the TTL to 1 second"],
    correct: "Single-flight loading + jittered TTLs",
    explanation: "Coalesce concurrent misses so one loader repopulates the key while others wait, and jitter TTLs so hot keys don't all expire together." }),
  pm("sysd_m8", { topicId: "sysd_m8_t1", exerciseId: "sysd_m8_t1_pm_d3", position: 13, level: "medium",
    title: "Consistency with the DB", scenario: "Which pattern keeps the cache reasonably consistent with the database on writes?",
    options: ["Cache-aside: write DB, invalidate the cache entry", "Never invalidate; rely on restart", "Write only to the cache", "Cache the whole DB up front"],
    correct: "Cache-aside: write DB, invalidate the cache entry",
    explanation: "Cache-aside with invalidate-on-write (next read repopulates) is the common default; TTLs bound any residual staleness." }),
  // Typeahead
  pm("sysd_m3", { topicId: "sysd_m3_t2", exerciseId: "sysd_m3_t2_pm_d1", position: 11, level: "hard",
    title: "Why it's sub-100ms", scenario: "How does autocomplete return ranked suggestions per keystroke so fast?",
    options: ["Top-k completions are precomputed and cached at each trie node", "It runs a full search per keystroke", "It scans the subtree and sorts each time", "It queries the database on every character"],
    correct: "Top-k completions are precomputed and cached at each trie node",
    explanation: "With top-k cached at each node, suggest = walk to the prefix node and return its cached list — near-constant time, no live ranking." }),
  pm("sysd_m3", { topicId: "sysd_m3_t2", exerciseId: "sysd_m3_t2_pm_d2", position: 12, level: "medium",
    title: "Where ranking happens", scenario: "When are suggestion rankings computed?",
    options: ["Offline from query logs, then the trie is rebuilt and hot-swapped", "Live on every keystroke", "Never — they're random", "At user signup"],
    correct: "Offline from query logs, then the trie is rebuilt and hot-swapped",
    explanation: "Counts are aggregated offline (time-decayed), the trie with top-k is rebuilt periodically and swapped in; the read path only looks up." }),
  pm("sysd_m3", { topicId: "sysd_m3_t2", exerciseId: "sysd_m3_t2_pm_d3", position: 13, level: "medium",
    title: "Scaling the trie", scenario: "The trie is too big for one node and short prefixes are hot. What helps?",
    options: ["Shard by leading prefix and cache/replicate hot prefixes", "Keep one copy on one node", "Switch to a relational table", "Recompute per request"],
    correct: "Shard by leading prefix and cache/replicate hot prefixes",
    explanation: "Sharding by leading characters scales the structure horizontally; a hot-prefix cache and replicated hot shards absorb popular short prefixes." }),
];

// ── upsert + recompute ──────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const moduleIds = [...new Set(TOPICS.map((t) => t.moduleId))];
  for (const mid of moduleIds) {
    const m = await ProModule.findOne({ trackKey: TRACK_KEY, moduleId: mid }).lean();
    if (!m) throw new Error(`Module ${mid} not found — run the base SD seeds first.`);
  }
  let tUp = 0, eUp = 0;
  for (const t of TOPICS) { await ProTopic.updateOne({ trackKey: TRACK_KEY, topicId: t.topicId }, { $set: t }, { upsert: true }); tUp++; }
  for (const e of EXERCISES) { await ProExercise.updateOne({ trackKey: TRACK_KEY, exerciseId: e.exerciseId }, { $set: e }, { upsert: true }); eUp++; }
  const totals = await recomputeTrackTotals(TRACK_KEY);
  console.log(`✓ Depth batch 2 seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
