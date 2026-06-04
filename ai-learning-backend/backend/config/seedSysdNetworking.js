/**
 * Seed — System Design module M5: Networking & Protocols (breadth parity with
 * AlgoMaster's Networking + Communication sections). Extends pro_sysd.
 * Idempotent upsert-by-id; recomputes track totals. All pattern_match.
 * Usage:  node config/seedSysdNetworking.js   ·   npm: npm run seed:sysd-net
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m5";
const xpFor = (l) => (l === "warmup" ? 5 : l === "easy" ? 10 : l === "medium" ? 15 : 20);
const diffFor = (l) => (l === "warmup" ? 0.1 : l === "easy" ? 0.2 : l === "medium" ? 0.4 : 0.6);

function pm(o) {
  return { trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: o.topicId, exerciseId: o.exerciseId,
    position: o.position, level: o.level, type: "pattern_match", title: o.title, scenario: o.scenario,
    instructions: o.instructions ?? "Pick the best answer.", starterCode: "", expectedSolution: o.correct,
    blanks: [{ options: o.options }], testCases: [{ type: "pattern_match", correct: o.correct, explanation: o.explanation }],
    hints: o.hints ?? [], xpReward: xpFor(o.level), difficulty: diffFor(o.level) };
}

const MODULE = {
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 5,
  name: "Networking & Protocols", slug: "networking-protocols",
  description: "The network fundamentals every system-design discussion rests on: the protocol stack, TCP vs UDP, HTTP/HTTPS and its versions, DNS, real-time communication (WebSockets/SSE/webhooks), and proxies.",
  estimatedHours: 4, prerequisites: ["sysd_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 30, difficulty: 2, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI }, teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 30, difficulty: diff, xpReward: 55, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("sysd_m5_t1", 1, "The Network Stack for Designers", "sysd-network-stack",
    ["networking", "osi", "tcp-ip", "layers"],
    "Your request leaves the browser and arrives at a server across the world. How many layers does it pass through, and which ones matter in a design interview?",
    "Networking is layered: each layer adds its own header and only talks to the layer above/below. You don't need all 7 OSI layers, but you must know where HTTP (L7), TLS (L6-ish), TCP/UDP (L4), and IP (L3) sit — because L4 vs L7 load balancing, TLS termination, and latency all hang off this.",
    [
      { kind: "concept", heading: "Layering, briefly",
        body: "The OSI model has 7 layers; in practice you reason about the TCP/IP view: Application (HTTP, gRPC, DNS), Transport (TCP/UDP — ports, reliability), Network (IP — addressing, routing), Link (Ethernet/WiFi). Each layer wraps the one above in its own header (encapsulation) and is independent — you can swap WiFi for Ethernet without touching HTTP." },
      { kind: "concept", heading: "Why a designer cares about the layer",
        body: "The layer dictates capability. An L4 (transport) load balancer sees only IP+port — fast, protocol-agnostic. An L7 (application) load balancer understands HTTP, so it can route by path/host and terminate TLS. A CDN/proxy operates at L7. 'Where does TLS terminate?' and 'L4 or L7 balancing?' are layer questions." },
      { kind: "concept", heading: "Latency budget",
        body: "Numbers worth memorising: same-datacenter round-trip ~0.5 ms, same-region ~1–5 ms, cross-continent ~70–150 ms (speed of light is real). A TLS handshake adds 1–2 extra round-trips on a new connection. This is WHY we put CDNs near users, reuse connections (keep-alive, HTTP/2 multiplexing), and cache — each saved round-trip matters." },
    ],
    "You won't be quizzed on all 7 OSI layers, but you must place HTTP/TLS/TCP/IP correctly to reason about L4-vs-L7 balancing, TLS termination, and latency. It underpins half the networking follow-ups.",
    ["Reciting OSI layers but not knowing which layer HTTP/TLS/TCP live on.",
     "Ignoring the speed-of-light latency floor when placing services globally.",
     "Forgetting the TLS-handshake round-trips when estimating connection cost."],
    0.3, { type: "Request path", description: "A request descends the stack and climbs back up: Browser (HTTP) → TLS → TCP → IP → Network, then back up to the Server's HTTP layer.", alt: "Request passing down through HTTP, TLS, TCP, IP layers and up at the server." }),

  T("sysd_m5_t2", 2, "TCP vs UDP", "sysd-tcp-udp",
    ["networking", "tcp", "udp", "transport"],
    "Reliable-but-slower or fast-but-lossy? A video call drops a frame happily but a bank transfer must not lose a byte. Which transport for which?",
    "TCP is reliable, ordered, and connection-oriented (handshake, retransmits, congestion control) — the default for anything that must arrive intact. UDP is connectionless and fire-and-forget — lower latency, no guarantees — for real-time media, gaming, DNS, where a late packet is worse than a lost one.",
    [
      { kind: "concept", heading: "TCP — reliable & ordered",
        body: "TCP establishes a connection (3-way handshake), guarantees every byte arrives exactly once and in order (sequence numbers + acks + retransmission), and adapts to network conditions (flow + congestion control). The cost: handshake latency, head-of-line blocking (a lost packet stalls everything behind it), and per-connection state. Use it for HTTP, databases, file transfer — anything where correctness beats latency." },
      { kind: "concept", heading: "UDP — fast & best-effort",
        body: "UDP just sends datagrams — no handshake, no ordering, no retransmit, no congestion control. Packets may be lost, duplicated, or reordered, and the app must cope. The payoff is minimal latency and overhead. Use it for live video/voice (drop a frame, don't stall), online gaming, DNS lookups, and as the base for QUIC (HTTP/3)." },
      { kind: "concept", heading: "Choosing in a design",
        body: "Default to TCP. Reach for UDP only when low latency matters more than completeness AND the app tolerates loss — typically real-time media or telemetry. Many 'reliable UDP' systems (QUIC, game netcode) re-add just the reliability they need on top of UDP, avoiding TCP's head-of-line blocking. Naming that trade-off is the senior signal." },
    ],
    "TCP-vs-UDP is a common warm-up. Map them to use-cases (TCP=correctness, UDP=real-time/loss-tolerant) and mention head-of-line blocking + QUIC for bonus depth.",
    ["Picking UDP for data that must not be lost.",
     "Not knowing TCP guarantees ordering+delivery while UDP guarantees neither.",
     "Missing that HTTP/3 (QUIC) runs over UDP to dodge TCP head-of-line blocking."],
    0.3, null),

  T("sysd_m5_t3", 3, "HTTP, HTTPS & HTTP Versions", "sysd-http",
    ["networking", "http", "https", "tls"],
    "HTTP/1.1, HTTP/2, HTTP/3 — and where does the 'S' in HTTPS come from? What actually changed, and why does it affect your design?",
    "HTTP is the request/response application protocol; HTTPS is HTTP over TLS (encryption + authentication). The versions progressively kill latency: 1.1 (one request at a time per connection) → 2 (multiplexing many streams over one connection) → 3 (over QUIC/UDP, no TCP head-of-line blocking).",
    [
      { kind: "concept", heading: "HTTP basics + HTTPS",
        body: "HTTP is a stateless request/response protocol: a method (GET/POST/…), headers, an optional body, and a status code (2xx/3xx/4xx/5xx). HTTPS = HTTP over TLS, which provides encryption (eavesdroppers can't read it), integrity (it can't be tampered with), and authentication (the server proves its identity via a certificate). HTTPS is non-negotiable in production." },
      { kind: "concept", heading: "The versions, and why they exist",
        body: "HTTP/1.1: one outstanding request per TCP connection → browsers open ~6 connections per host to parallelize; head-of-line blocking at the app layer. HTTP/2: multiplexes many concurrent streams over ONE connection (+ header compression, server push) — far fewer connections, lower latency. HTTP/3: runs over QUIC (UDP) so a single lost packet doesn't stall all streams (TCP's head-of-line blocking), and connections survive network changes (0-RTT resumption)." },
      { kind: "concept", heading: "Design implications",
        body: "Terminate TLS at the load balancer/CDN (offload the handshake cost from app servers). Use keep-alive / HTTP/2 to reuse connections and cut handshake round-trips. Statelessness is what lets any server answer any request (horizontal scaling) — push session state to Redis or a token. For APIs, idempotent methods (GET/PUT/DELETE) are safe to retry; POST is not (see idempotency keys)." },
    ],
    "Interviewers expect HTTPS = HTTP+TLS and the 1.1→2→3 latency story (multiplexing, then QUIC over UDP). TLS termination at the edge and connection reuse are common design touches.",
    ["Thinking HTTPS is a different protocol rather than HTTP over TLS.",
     "Not knowing HTTP/2 multiplexes over one connection (vs 1.1's connection-per-request hack).",
     "Forgetting to terminate TLS at the edge to offload handshakes."],
    0.4, null),

  T("sysd_m5_t4", 4, "DNS", "sysd-dns",
    ["networking", "dns", "resolution"],
    "You type a domain; milliseconds later you're talking to an IP. What translated it — and how is DNS also a load-balancing and failover tool?",
    "DNS resolves human names to IP addresses through a hierarchy of caching resolvers. Beyond lookup, it's a global traffic tool: weighted/geo/latency-based records route users to the nearest or healthiest region, and low-TTL records enable failover.",
    [
      { kind: "concept", heading: "How resolution works",
        body: "A resolver walks the hierarchy: root → TLD (.com) → authoritative name server for the domain, which returns the IP. Results are cached at every level with a TTL, so most lookups are answered from cache in microseconds. The first uncached lookup costs a few round-trips — which is why DNS results are aggressively cached by the OS and browser." },
      { kind: "concept", heading: "DNS as a traffic director",
        body: "DNS isn't just a phone book — it's the first load-balancing layer. GeoDNS / latency-based routing returns a different IP based on the user's location (route them to the nearest region); weighted records split traffic; health-checked records (Route 53) drop a failed region. Anycast announces one IP from many locations so the network routes to the closest. This is how global systems steer users before any in-region load balancer." },
      { kind: "concept", heading: "TTL trade-off & gotchas",
        body: "Low TTL = fast failover/changes but more DNS traffic; high TTL = fewer lookups but slow to propagate a change (and clients may cache a dead IP). Plan TTLs around your failover needs. Note DNS itself runs over UDP (port 53) for speed, falling back to TCP for large responses." },
    ],
    "DNS comes up for global routing and failover. The signal beyond 'it maps names to IPs' is using it as a geo/weighted/health-checked traffic director with TTL-driven failover.",
    ["Treating DNS as only name→IP and missing its load-balancing/failover role.",
     "Setting TTLs without considering failover speed vs lookup volume.",
     "Forgetting DNS resolution adds latency on the first (uncached) request."],
    0.3, { type: "DNS resolution", description: "Lookup path: Client → Resolver → Root → TLD → Authoritative Name Server, returning the IP (cached at each hop by TTL).", alt: "Client to resolver to root to TLD to authoritative server returning an IP." }),

  T("sysd_m5_t5", 5, "Real-Time Communication", "sysd-realtime-comms",
    ["networking", "websocket", "sse", "webhook", "long-polling"],
    "The server has new data and the client must see it NOW — a chat message, a price tick, a notification. HTTP is request/response; how does the server push?",
    "Four options, increasing in power: short polling (client re-asks), long polling (server holds the request open), Server-Sent Events (one-way server→client stream), and WebSockets (full-duplex persistent connection). Webhooks are the server-to-server equivalent (one service calls another's URL on an event).",
    [
      { kind: "concept", heading: "Polling → long polling",
        body: "Short polling: the client requests every N seconds — simple but wasteful and laggy (data is stale up to N seconds, and most requests return nothing). Long polling: the client sends a request and the server HOLDS it open until there's data (or a timeout), then the client immediately re-requests — near-real-time over plain HTTP, but ties up a connection/thread per client." },
      { kind: "concept", heading: "SSE vs WebSockets",
        body: "Server-Sent Events (SSE): a single long-lived HTTP connection over which the server streams events one-way (server→client) — perfect for feeds, notifications, live scores; auto-reconnects, simple, but no client→server channel. WebSockets: a persistent, full-duplex TCP connection (upgraded from HTTP) — both sides send anytime, lowest latency — the right tool for chat, multiplayer, collaborative editing. Use SSE when you only need server→client; WebSockets when you need both directions." },
      { kind: "concept", heading: "Webhooks (server-to-server)",
        body: "A webhook is the inverse of polling for backends: instead of service A polling service B, B calls A's registered URL when an event happens (Stripe → your /payment-succeeded). It's event push between servers. Design concerns: verify the signature (auth), make the handler idempotent (B may retry), and return fast (queue the work)." },
      { kind: "concept", heading: "Choosing & scaling",
        body: "Need server→client only → SSE. Need bidirectional/low-latency → WebSockets. Backend event delivery → webhooks (or a message queue internally). Scaling persistent connections (WS/SSE) needs sticky-ish routing or a connection registry mapping user→gateway, plus a pub/sub backplane (Redis) so a message can reach whichever gateway holds the user's socket." },
    ],
    "Real-time delivery is asked in chat, feeds, notifications, and dashboards. The signal is matching the mechanism to directionality/latency (SSE one-way, WebSockets bidirectional) and knowing webhooks are the server-to-server push.",
    ["Defaulting to short polling where SSE/WebSockets fit.",
     "Using WebSockets when one-way SSE would be simpler and cheaper.",
     "Forgetting persistent connections need a connection registry + pub/sub backplane to scale."],
    0.4, { type: "Real-time push", description: "WebSocket flow: Client ↔ WebSocket Gateway ↔ Pub/Sub Backplane ↔ Server. The gateway holds the persistent connection; the backplane routes messages to the right gateway.", alt: "Client to websocket gateway to pub/sub backplane to server." }),

  T("sysd_m5_t6", 6, "Proxies: Forward vs Reverse", "sysd-proxies",
    ["networking", "proxy", "reverse-proxy", "gateway"],
    "A 'proxy' sits in the middle — but a forward proxy and a reverse proxy face opposite directions and solve opposite problems. Which is which, and how does it differ from a load balancer or gateway?",
    "A forward proxy sits in front of CLIENTS (hiding/representing them to the internet — corporate filtering, VPNs). A reverse proxy sits in front of SERVERS (representing them to clients — TLS termination, caching, load balancing, the public entry point). Nginx is the classic reverse proxy.",
    [
      { kind: "concept", heading: "Forward proxy (client-side)",
        body: "A forward proxy is configured by clients and makes requests on their behalf: it hides client identity, enforces corporate access policies, caches outbound requests, and bypasses geo-restrictions (VPNs). The destination server sees the proxy, not the client. It's about controlling/representing OUTBOUND client traffic." },
      { kind: "concept", heading: "Reverse proxy (server-side)",
        body: "A reverse proxy sits in front of your servers and is the public entry point clients hit; it forwards to the right backend. It handles TLS termination, response caching, compression, request routing, and load balancing — offloading cross-cutting work from app servers and hiding the internal topology. Nginx, HAProxy, and Envoy are reverse proxies. Clients see the proxy, not the servers." },
      { kind: "concept", heading: "Reverse proxy vs load balancer vs API gateway",
        body: "These overlap and are often the same box, but conceptually: a LOAD BALANCER's core job is distributing traffic across a pool (+ health checks); a REVERSE PROXY's is forwarding/terminating/caching at the edge; an API GATEWAY adds API-specific concerns (auth, rate limiting, request transformation, aggregation). A reverse proxy can load-balance; a gateway is a feature-rich reverse proxy for APIs. Don't treat them as mutually exclusive." },
    ],
    "The forward-vs-reverse distinction and 'reverse proxy vs LB vs gateway' are common clarifying questions. Knowing the reverse proxy is the server-side edge that terminates TLS + caches + routes is the key.",
    ["Confusing forward (client-side) with reverse (server-side) proxies.",
     "Treating reverse proxy, load balancer, and API gateway as entirely separate boxes.",
     "Missing that the reverse proxy is where TLS termination and edge caching naturally live."],
    0.4, { type: "Reverse proxy", description: "Edge: Client → Reverse Proxy (TLS, cache, route) → App Servers. The proxy is the public entry point; clients never see the internal servers.", alt: "Client to reverse proxy to app servers." }),
];

const EXERCISES = [
  // T1 stack
  pm({ topicId: "sysd_m5_t1", exerciseId: "sysd_m5_t1_pm_1", position: 1, level: "easy",
    title: "Which layer is HTTP?",
    scenario: "In the TCP/IP model, which layer do HTTP, gRPC, and DNS operate at?",
    options: ["Application (L7)", "Transport (L4)", "Network (L3)", "Link (L2)"], correct: "Application (L7)",
    explanation: "HTTP/gRPC/DNS are application-layer protocols (L7); TCP/UDP are transport (L4); IP is network (L3)." }),
  pm({ topicId: "sysd_m5_t1", exerciseId: "sysd_m5_t1_pm_2", position: 2, level: "medium",
    title: "Cross-continent latency",
    scenario: "Roughly what's the network round-trip time between continents, set by physics?",
    options: ["~70–150 ms", "~1 ms", "~0.01 ms", "~2 seconds"], correct: "~70–150 ms",
    explanation: "Speed of light over fiber makes cross-continent RTT ~70–150ms — why CDNs sit near users and we minimize round-trips." }),
  pm({ topicId: "sysd_m5_t1", exerciseId: "sysd_m5_t1_pm_3", position: 3, level: "medium",
    title: "What L7 enables",
    scenario: "Routing by URL path and terminating TLS requires operating at which layer?",
    options: ["Layer 7 (application)", "Layer 4 (transport)", "Layer 3 (network)", "Layer 1 (physical)"], correct: "Layer 7 (application)",
    explanation: "Understanding HTTP (paths, headers, TLS) is an L7 capability; L4 only sees IP/port." }),
  // T2 tcp/udp
  pm({ topicId: "sysd_m5_t2", exerciseId: "sysd_m5_t2_pm_1", position: 1, level: "easy",
    title: "Reliable transport",
    scenario: "A file download must arrive complete and in order. Which transport protocol?",
    options: ["TCP", "UDP", "Neither", "Both equally"], correct: "TCP",
    explanation: "TCP guarantees ordered, complete, exactly-once delivery via acks + retransmission." }),
  pm({ topicId: "sysd_m5_t2", exerciseId: "sysd_m5_t2_pm_2", position: 2, level: "medium",
    title: "Real-time media",
    scenario: "A live video call would rather drop a frame than stall waiting for a retransmit. Which transport fits?",
    options: ["UDP", "TCP", "TCP with low TTL", "HTTP/1.1"], correct: "UDP",
    explanation: "UDP is fire-and-forget — low latency, tolerates loss — ideal for real-time media where a late packet is useless." }),
  pm({ topicId: "sysd_m5_t2", exerciseId: "sysd_m5_t2_pm_3", position: 3, level: "hard",
    title: "Why QUIC uses UDP",
    scenario: "HTTP/3 (QUIC) runs over UDP rather than TCP primarily to avoid what?",
    options: ["TCP head-of-line blocking", "Encryption overhead", "DNS lookups", "Load balancing"], correct: "TCP head-of-line blocking",
    explanation: "On TCP, one lost packet stalls all streams behind it; QUIC over UDP gives independent streams + faster handshakes." }),
  // T3 http
  pm({ topicId: "sysd_m5_t3", exerciseId: "sysd_m5_t3_pm_1", position: 1, level: "easy",
    title: "What is HTTPS?",
    scenario: "HTTPS is best described as…",
    options: ["HTTP over TLS (encryption + auth + integrity)", "A faster version of HTTP", "HTTP without headers", "A different protocol unrelated to HTTP"], correct: "HTTP over TLS (encryption + auth + integrity)",
    explanation: "HTTPS = HTTP carried over a TLS-encrypted, authenticated, integrity-checked connection." }),
  pm({ topicId: "sysd_m5_t3", exerciseId: "sysd_m5_t3_pm_2", position: 2, level: "medium",
    title: "HTTP/2's big win",
    scenario: "The main improvement of HTTP/2 over HTTP/1.1 is…",
    options: ["Multiplexing many streams over one connection", "Encryption", "Using UDP", "Removing headers"], correct: "Multiplexing many streams over one connection",
    explanation: "HTTP/2 multiplexes concurrent streams on a single connection (+ header compression), replacing 1.1's connection-per-request hack." }),
  pm({ topicId: "sysd_m5_t3", exerciseId: "sysd_m5_t3_pm_3", position: 3, level: "medium",
    title: "Offload the handshake",
    scenario: "To keep TLS-handshake CPU off your app servers, where do you terminate TLS?",
    options: ["At the load balancer / reverse proxy / CDN (the edge)", "On every app server", "In the database", "In the client"], correct: "At the load balancer / reverse proxy / CDN (the edge)",
    explanation: "Terminating TLS at the edge offloads handshake cost and centralizes certificate management." }),
  // T4 dns
  pm({ topicId: "sysd_m5_t4", exerciseId: "sysd_m5_t4_pm_1", position: 1, level: "easy",
    title: "What DNS does",
    scenario: "DNS primarily translates…",
    options: ["Domain names → IP addresses", "IP addresses → MAC addresses", "URLs → HTML", "Ports → protocols"], correct: "Domain names → IP addresses",
    explanation: "DNS resolves human-readable names to IPs via a cached hierarchy (root→TLD→authoritative)." }),
  pm({ topicId: "sysd_m5_t4", exerciseId: "sysd_m5_t4_pm_2", position: 2, level: "medium",
    title: "Route users to the nearest region",
    scenario: "You want users routed to the closest healthy region before hitting any load balancer. Which tool?",
    options: ["GeoDNS / latency-based + health-checked DNS records", "A bigger database", "Cache-aside", "A message queue"], correct: "GeoDNS / latency-based + health-checked DNS records",
    explanation: "DNS is the first traffic director: geo/latency routing + health checks steer users to the nearest live region." }),
  pm({ topicId: "sysd_m5_t4", exerciseId: "sysd_m5_t4_pm_3", position: 3, level: "medium",
    title: "TTL trade-off",
    scenario: "A LOW DNS TTL gives you what, at what cost?",
    options: ["Fast failover/changes, but more DNS query traffic", "Slow failover, less traffic", "Encryption", "Lower latency always"], correct: "Fast failover/changes, but more DNS query traffic",
    explanation: "Low TTL = quick propagation/failover but more lookups; high TTL = fewer lookups but slow to change." }),
  // T5 realtime
  pm({ topicId: "sysd_m5_t5", exerciseId: "sysd_m5_t5_pm_1", position: 1, level: "medium",
    title: "Bidirectional, low-latency",
    scenario: "A chat app needs both client and server to send messages anytime with minimal latency. Which mechanism?",
    options: ["WebSockets", "Server-Sent Events", "Short polling", "Webhooks"], correct: "WebSockets",
    explanation: "WebSockets give a persistent full-duplex connection — both directions, lowest latency — ideal for chat/multiplayer." }),
  pm({ topicId: "sysd_m5_t5", exerciseId: "sysd_m5_t5_pm_2", position: 2, level: "medium",
    title: "One-way server stream",
    scenario: "A live-scores page only needs the server to stream updates to the client (no client→server). Simplest fit?",
    options: ["Server-Sent Events (SSE)", "WebSockets", "Short polling", "gRPC"], correct: "Server-Sent Events (SSE)",
    explanation: "SSE is a one-way server→client stream over a single HTTP connection with auto-reconnect — simpler than WebSockets when you don't need the client→server channel." }),
  pm({ topicId: "sysd_m5_t5", exerciseId: "sysd_m5_t5_pm_3", position: 3, level: "medium",
    title: "Server-to-server event push",
    scenario: "Stripe notifies your backend when a payment succeeds by calling your registered URL. What's this called?",
    options: ["A webhook", "Long polling", "An SSE stream", "A WebSocket"], correct: "A webhook",
    explanation: "A webhook is server-to-server push: the source calls your URL on an event. Verify its signature and make the handler idempotent." }),
  // T6 proxies
  pm({ topicId: "sysd_m5_t6", exerciseId: "sysd_m5_t6_pm_1", position: 1, level: "medium",
    title: "Which proxy faces the servers?",
    scenario: "A proxy that sits in front of your SERVERS as the public entry point (TLS, caching, routing) is a…",
    options: ["Reverse proxy", "Forward proxy", "VPN", "Firewall"], correct: "Reverse proxy",
    explanation: "A reverse proxy represents servers to clients (nginx/HAProxy/Envoy); a forward proxy represents clients to the internet." }),
  pm({ topicId: "sysd_m5_t6", exerciseId: "sysd_m5_t6_pm_2", position: 2, level: "medium",
    title: "Corporate web filtering",
    scenario: "A company routes all employee web traffic through a server that enforces policy and hides client IPs. That's a…",
    options: ["Forward proxy", "Reverse proxy", "Load balancer", "CDN"], correct: "Forward proxy",
    explanation: "A forward proxy sits in front of clients, making outbound requests on their behalf (filtering, anonymity, caching)." }),
  pm({ topicId: "sysd_m5_t6", exerciseId: "sysd_m5_t6_pm_3", position: 3, level: "hard",
    title: "Gateway vs LB vs reverse proxy",
    scenario: "Which best captures the distinction?",
    options: ["LB distributes traffic; reverse proxy forwards/terminates/caches at the edge; API gateway adds API concerns (auth, rate-limit) — often the same box", "They are identical", "Only the gateway can do TLS", "A reverse proxy cannot load-balance"], correct: "LB distributes traffic; reverse proxy forwards/terminates/caches at the edge; API gateway adds API concerns (auth, rate-limit) — often the same box",
    explanation: "They overlap and frequently co-locate; the difference is emphasis: distribution vs edge-forwarding vs API-specific features." }),
];

async function upsertOne(Model, filter, doc) { return Model.findOneAndUpdate(filter, doc, { upsert: true, new: true, setDefaultsOnInsert: true }); }
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");
  await upsertOne(ProModule, { moduleId: MODULE.moduleId }, MODULE);
  console.log(`  ✓ ProModule: ${MODULE.moduleId} — ${MODULE.name}`);
  for (const t of TOPICS) await upsertOne(ProTopic, { topicId: t.topicId }, t);
  console.log(`  ✓ ProTopics: ${TOPICS.length}`);
  let inserted = 0, updated = 0;
  for (const ex of EXERCISES) {
    const before = await ProExercise.findOne({ exerciseId: ex.exerciseId }).select("_id").lean();
    await upsertOne(ProExercise, { exerciseId: ex.exerciseId }, ex);
    before ? updated++ : inserted++;
  }
  console.log(`  ✓ ProExercises: ${EXERCISES.length} (${inserted} inserted, ${updated} updated)`);
  const totals = await recomputeTrackTotals(TRACK_KEY);
  console.log(`\nDone — M5 Networking seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
