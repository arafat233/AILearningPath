/**
 * Seed — LLD DEPTH batch 2 (LLD_DEPTH_STANDARD.md).
 *
 *   lld_m10_t5  Design an Online Auction System          (module lld_m10)
 *   lld_m10_t6  Design a Calendar Application            (module lld_m10)
 *   lld_m10_t7  Design a Text Editor with Undo/Redo      (module lld_m10)
 *   lld_m10_t8  Design a Thread-Safe Concurrent Cache    (module lld_m10)
 *   lld_m11_t1  Design a Music Player                    (module lld_m11)
 *   lld_m11_t2  Design Ride-Sharing (Uber OOD)           (module lld_m11)
 *
 * Verify: node config/auditLldDepth.mjs --require lld_m10_t5,lld_m10_t6,lld_m10_t7,lld_m10_t8,lld_m11_t1,lld_m11_t2
 * Usage:  node config/seedLldDepthBatch2.js  ·  npm run seed:lld-depth-2
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_lld";

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
  auction: svg(840, 250,
    box(20, 30, 150, 56, "AuctionService", "create / find / close", "#ede9fe") +
    box(230, 30, 160, 60, "Auction", "state + bid history", "#fef9c3") +
    box(470, 20, 170, 50, "AuctionState", "OPEN / EXTENDED / CLOSED", "#fce7f3") +
    box(470, 90, 150, 50, "Bid", "amount, bidder, seq", "#f0fdf4") +
    box(230, 130, 160, 50, "AntiSnipePolicy", "extend on late bid", "#eff6ff") +
    box(20, 130, 150, 50, "Bidder", "places bids", "#eff6ff") +
    box(470, 160, 170, 56, "AuctionObserver", "outbid / won notify", "#ede9fe") +
    arrow(170, 58, 230, 58, "1..*") +
    arrow(390, 45, 470, 45, "state") +
    arrow(390, 75, 470, 105, "has 1..*") +
    arrow(310, 90, 310, 130, "uses", true) +
    arrow(170, 155, 230, 155, "placeBid") +
    arrow(390, 90, 500, 160, "notifies", true) +
    note(420, 240, "Auction owns a monotonic bid history + a STATE (OPEN/EXTENDED/CLOSED); placeBid is serialized per auction; AntiSnipePolicy extends the deadline; observers get outbid/won events")),
  calendar: svg(840, 250,
    box(20, 30, 140, 56, "Calendar", "owns events", "#ede9fe") +
    box(220, 30, 160, 60, "Event", "time span, attendees", "#fef9c3") +
    box(450, 20, 180, 50, "RecurrenceRule", "FREQ/INTERVAL/UNTIL", "#fce7f3") +
    box(450, 90, 180, 50, "EventException", "moved / cancelled instance", "#f0fdf4") +
    box(220, 130, 160, 50, "Invitation", "attendee + RSVP state", "#eff6ff") +
    box(20, 130, 140, 50, "ConflictDetector", "interval overlap", "#eff6ff") +
    box(450, 160, 180, 56, "ReminderScheduler", "next-occurrence alarms", "#ede9fe") +
    arrow(160, 58, 220, 58, "1..*") +
    arrow(380, 45, 450, 45, "0..1") +
    arrow(380, 70, 450, 110, "1..*") +
    arrow(300, 90, 300, 130, "has 1..*") +
    arrow(160, 155, 220, 155, "checks", true) +
    arrow(380, 155, 450, 185, "uses", true) +
    note(420, 240, "Event stores ONE row + an optional RecurrenceRule; occurrences are EXPANDED on demand; EventExceptions override single instances; ConflictDetector overlaps expanded intervals")),
  editor: svg(840, 250,
    box(20, 30, 140, 56, "Editor", "facade: type/delete", "#ede9fe") +
    box(220, 30, 170, 60, "Document", "piece table text", "#fef9c3") +
    box(220, 130, 170, 56, "UndoManager", "undo + redo stacks", "#fce7f3") +
    box(460, 20, 170, 50, "Command", "execute() / undo()", "#f0fdf4") +
    box(460, 90, 170, 50, "InsertCommand", "pos + text", "#eff6ff") +
    box(460, 155, 170, 50, "DeleteCommand", "pos + deleted text", "#eff6ff") +
    box(660, 90, 160, 50, "Cursor", "position, selection", "#ede9fe") +
    arrow(160, 58, 220, 58, "edits") +
    arrow(160, 80, 240, 130, "pushes to", true) +
    arrow(390, 158, 460, 115, "stores 1..*") +
    arrow(460, 115, 440, 60, "implements", true) +
    arrow(460, 180, 445, 70, "implements", true) +
    arrow(390, 60, 460, 45, "mutates via") +
    note(420, 240, "Every edit is a COMMAND with execute()/undo() capturing its inverse; UndoManager keeps two stacks (new edit clears redo); Document is a piece table so commands stay O(1) descriptors")),
  cache: svg(840, 250,
    box(20, 30, 170, 56, "ConcurrentCache", "get / put / evict", "#ede9fe") +
    box(250, 30, 160, 60, "Segment [0..N]", "stripe: lock + map", "#fef9c3") +
    box(470, 20, 170, 50, "Entry", "key, value, lru links", "#fce7f3") +
    box(470, 90, 170, 50, "EvictionPolicy", "LRU list per stripe", "#f0fdf4") +
    box(250, 130, 160, 56, "CacheLoader", "compute-if-absent", "#eff6ff") +
    box(20, 130, 170, 50, "FutureValue", "in-flight load", "#eff6ff") +
    box(470, 160, 170, 50, "StatsCounter", "hits / misses (atomic)", "#ede9fe") +
    arrow(190, 58, 250, 58, "hash -> 1..N") +
    arrow(410, 50, 470, 45, "holds 1..*") +
    arrow(410, 75, 470, 110, "uses", true) +
    arrow(330, 90, 330, 130, "delegates", true) +
    arrow(250, 158, 190, 155, "returns") +
    arrow(410, 165, 470, 180, "records", true) +
    note(420, 240, "Keys hash to a SEGMENT (lock stripe); each stripe owns its map + LRU list so threads on different stripes never contend; misses insert a FUTURE so one loader runs per key (no stampede)")),
  music: svg(840, 250,
    box(20, 30, 150, 56, "MusicPlayer", "facade + state ctx", "#ede9fe") +
    box(230, 20, 160, 50, "PlayerState", "play/pause/next per state", "#fce7f3") +
    box(230, 90, 160, 50, "PlayQueue", "now + upcoming", "#fef9c3") +
    box(450, 20, 170, 50, "PlaybackStrategy", "sequential/shuffle/repeat", "#f0fdf4") +
    box(450, 90, 150, 50, "Playlist", "ordered track list", "#eff6ff") +
    box(660, 90, 150, 50, "Track", "id, duration, uri", "#eff6ff") +
    box(230, 160, 160, 56, "PlayerObserver", "UI: progress, track", "#ede9fe") +
    arrow(170, 50, 230, 45, "state") +
    arrow(170, 75, 230, 110, "owns") +
    arrow(390, 110, 450, 110, "loads from") +
    arrow(390, 90, 450, 50, "uses", true) +
    arrow(600, 113, 660, 113, "1..*") +
    arrow(170, 85, 260, 160, "notifies", true) +
    note(420, 240, "MusicPlayer delegates play/pause/next to its current PlayerState (State pattern); PlaybackStrategy decides the NEXT track (Strategy: shuffle/repeat); observers redraw the UI on every event")),
  uber: svg(840, 250,
    box(20, 30, 150, 56, "RideService", "request / assign", "#ede9fe") +
    box(230, 30, 150, 60, "Trip", "state machine", "#fef9c3") +
    box(440, 20, 180, 50, "MatchingStrategy", "nearest / rating-aware", "#fce7f3") +
    box(440, 90, 180, 50, "LocationIndex", "grid: nearby drivers", "#f0fdf4") +
    box(230, 130, 150, 50, "FareStrategy", "base + distance + surge", "#eff6ff") +
    box(20, 130, 150, 50, "Rider", "requests trips", "#eff6ff") +
    box(660, 30, 160, 56, "Driver", "status: FREE/ON_TRIP", "#ede9fe") +
    arrow(170, 58, 230, 58, "creates 1..*") +
    arrow(170, 80, 460, 90, "uses", true) +
    arrow(380, 55, 440, 45, "picks via") +
    arrow(530, 90, 530, 70, "queries", true) +
    arrow(620, 45, 660, 55, "candidate 1..*") +
    arrow(305, 90, 305, 130, "prices via", true) +
    arrow(170, 155, 230, 90, "REQUESTED") +
    note(420, 240, "RideService matches a REQUESTED Trip to a nearby FREE driver (Strategy over a LocationIndex), claims the driver with an atomic status flip, then walks the Trip state machine to COMPLETED + fare")),
};

const TT = (moduleId, id, num, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, svgStr, vaType) => ({
  trackKey: TRACK_KEY, moduleId, topicId: id, topicNumber: num, name, slug,
  metadata: { estimated_minutes: 50, difficulty: 4, prerequisites: [], tags },
  hook: { question: hookQ, insight: hookI },
  teaching: { blocks, visual_aid: { type: vaType, svg: svgStr, alt_text: `${name} class diagram.` } },
  interviewRelevance: rel, commonGaps: { gaps },
  prerequisites: [], estimatedMinutes: 50, difficulty: diff, xpReward: 80, visualizer: null,
});
const C = (section, heading, body) => ({ kind: "concept", section, heading, body });
const K = (section, heading, body) => ({ kind: "code", section, heading, body });
const G = (id, w, r, d) => ({ gap_id: id, what_students_get_wrong: w, remediation: r, detection_pattern: d });

const TOPICS = [
  // ───────────────────── ONLINE AUCTION SYSTEM ──────────────────────────────
  TT("lld_m10", "lld_m10_t5", 5, "Design an Online Auction System", "design-online-auction-system",
    ["case-study", "state-pattern", "concurrency", "observer"],
    "An eBay-style auction for a rare guitar closes in four seconds. Two bidders hit 'bid' within the same millisecond, a third has a proxy bid that should auto-counter, and a fourth snipes at T-minus-one hoping nobody can respond. The winner must be indisputable. How do you design an Online Auction System?",
    "Model Auction as an aggregate that OWNS its bid history and a lifecycle STATE (State pattern: DRAFT/OPEN/EXTENDED/CLOSED), and make placeBid the single serialized entry point so concurrent bids get a total order — a per-auction lock or synchronized block, validating amount > currentHigh + increment inside the critical section. Proxy bids resolve inside the same critical section (highest proxy wins at one increment over the runner-up), anti-sniping is a policy object that extends the deadline when a bid lands in the final window, and Observer pushes outbid/won notifications so bidders never poll.",
    [
      C("requirements", "Requirements",
        "Functional: sellers CREATE auctions (item, start price, minimum increment, start/end time, optional reserve price); bidders PLACE BIDS while the auction is open; the system enforces bid VALIDITY (must exceed current high by at least the increment, bidder cannot outbid themselves, seller cannot bid on own item); bidders can set PROXY (maximum) bids that auto-counter on their behalf; everyone can view the current high bid and full bid history; at the deadline the auction CLOSES and declares a winner (or 'reserve not met'); outbid bidders are NOTIFIED immediately. Non-functional constraints that shape the design: CONCURRENCY is the heart of the problem — many bidders bid on the same item in the final seconds, and two bids arriving 'simultaneously' must produce one deterministic, explainable ordering with no lost update on the current-high pointer; the bid history must be APPEND-ONLY and auditable (disputes are guaranteed in an auction product); ANTI-SNIPING may extend the deadline when a bid lands in the final N seconds, which means the end time is mutable state governed by rules, not a constant; and closing must fire EXACTLY ONCE even if a timer misfires twice. Clarify scope with the interviewer: this is an OOD exercise — one process, in-memory correctness first — but the classes should be designed so the per-auction serialization point survives a move to a database (optimistic version column) later. The two defining problems: concurrent bid ordering, and the lifecycle state machine with sniping-driven deadline extension."),
      C("entities", "Core entities & responsibilities",
        "AUCTION is the aggregate root and the concurrency boundary: it owns the item reference, the mutable end time, the reserve/increment rules, the ordered BID list, the current high bid, the set of proxy bids, and its lifecycle state. Every mutation — placeBid, close, extend — goes THROUGH the Auction, never around it; that is what makes 'one lock per auction' a coherent sentence. BID is an immutable value object: bidder, amount, timestamp, and a SEQUENCE NUMBER assigned inside the critical section — the sequence number, not the wall-clock timestamp, is the authoritative order (clocks tie; sequence numbers do not). PROXYBID captures a bidder's private maximum; it lives on the auction and is consulted during placeBid to generate automatic counter-bids. AUCTIONSTATE (State pattern) encodes the lifecycle: DRAFT accepts configuration edits, OPEN accepts bids, EXTENDED is OPEN with a stretched deadline, CLOSED accepts nothing and exposes the result. ANTISNIPEPOLICY is a small strategy consulted after each accepted bid: 'did this land within the trigger window? If so, push endTime out.' AUCTIONSERVICE is the registry and scheduler: it creates auctions, routes bids by auctionId, and runs the closing timer. AUCTIONOBSERVER instances (email, push, UI websocket) subscribe per auction and receive OUTBID, EXTENDED, WON, and LOST events. Keeping Bid and ProxyBid immutable and Auction the only mutable thing is what keeps the concurrency story auditable."),
      C("design", "Class design & patterns",
        "STATE PATTERN for the lifecycle: Auction holds an AuctionState, and bid/close/edit calls delegate to it. OpenState.placeBid validates and appends; ClosedState.placeBid throws AuctionClosedException; DraftState allows configuration changes that OPEN forbids. The win over a status enum plus if-chains is that ILLEGAL TRANSITIONS BECOME UNREPRESENTABLE — there is no code path where a closed auction quietly accepts a bid because one method forgot a status check; the state object simply has no accepting behavior. EXTENDED is worth modeling as its own state (or a flag on OPEN) because products often cap extensions ('at most 10 extensions') and the cap is state. OBSERVER for notifications: placeBid, on success, emits BidPlaced and Outbid(previousHighBidder) events; close emits Won/Lost. The Auction does not know whether the listener is an email sender or a websocket — it just notifies, which keeps the aggregate free of I/O concerns (in a real system the events go to a queue; the OOD shape is identical). STRATEGY twice: AntiSnipePolicy (none / fixed-window extension / capped extension) and BidValidationPolicy if the interviewer pushes on auction variants — a Dutch auction where price descends, or sealed-bid where bids are hidden until close, swap the validation/ordering strategy without touching Auction. TEMPLATE of the critical section: placeBid is synchronized per auction and does validate -> assign sequence -> append -> resolve proxies -> maybe extend -> notify, in that order, atomically. AuctionService keeps a ConcurrentHashMap of auctions so lookups never serialize across different auctions — the lock is PER AUCTION, which is the whole scalability point."),
      K("code", "Core classes (Java)",
`enum AuctionStatus { DRAFT, OPEN, EXTENDED, CLOSED }

final class Bid {
    final String bidderId; final BigDecimal amount;
    final long seq; final Instant at;
    Bid(String bidderId, BigDecimal amount, long seq) {
        this.bidderId = bidderId; this.amount = amount;
        this.seq = seq; this.at = Instant.now();
    }
}

class Auction {
    private final String id; private final String sellerId;
    private final BigDecimal increment; private final BigDecimal reserve;
    private volatile Instant endTime;
    private AuctionStatus status = AuctionStatus.OPEN;
    private final List<Bid> bids = new ArrayList<>();
    private final Map<String, BigDecimal> proxyMax = new HashMap<>();
    private long seqGen = 0;
    private final AntiSnipePolicy antiSnipe;
    private final List<AuctionObserver> observers = new CopyOnWriteArrayList<>();

    Auction(String id, String sellerId, BigDecimal increment,
            BigDecimal reserve, Instant endTime, AntiSnipePolicy policy) {
        this.id = id; this.sellerId = sellerId; this.increment = increment;
        this.reserve = reserve; this.endTime = endTime; this.antiSnipe = policy;
    }

    synchronized Bid placeBid(String bidderId, BigDecimal amount) {
        if (status == AuctionStatus.CLOSED || Instant.now().isAfter(endTime))
            throw new IllegalStateException("auction closed");
        if (bidderId.equals(sellerId))
            throw new IllegalArgumentException("seller cannot bid");
        BigDecimal floor = currentHigh() == null
            ? BigDecimal.ZERO : currentHigh().amount.add(increment);
        if (amount.compareTo(floor) < 0)
            throw new IllegalArgumentException("bid below minimum " + floor);
        Bid prev = currentHigh();
        Bid bid = new Bid(bidderId, amount, ++seqGen);
        bids.add(bid);
        resolveProxies(bidderId);              // may append counter-bids
        if (antiSnipe.shouldExtend(endTime)) { // sniping window?
            endTime = antiSnipe.extend(endTime);
            status = AuctionStatus.EXTENDED;
            observers.forEach(o -> o.onExtended(id, endTime));
        }
        if (prev != null && !prev.bidderId.equals(currentHigh().bidderId))
            observers.forEach(o -> o.onOutbid(id, prev.bidderId));
        return bid;
    }

    synchronized void close() {
        if (status == AuctionStatus.CLOSED) return;   // idempotent
        status = AuctionStatus.CLOSED;
        Bid high = currentHigh();
        boolean sold = high != null && high.amount.compareTo(reserve) >= 0;
        observers.forEach(o -> o.onClosed(id, sold ? high : null));
    }

    private void resolveProxies(String newBidder) {
        // highest proxy counter-bids one increment above current high
        proxyMax.entrySet().stream()
            .filter(e -> !e.getKey().equals(newBidder))
            .filter(e -> e.getValue().compareTo(
                currentHigh().amount.add(increment)) >= 0)
            .max(Map.Entry.comparingByValue())
            .ifPresent(e -> bids.add(new Bid(e.getKey(),
                currentHigh().amount.add(increment), ++seqGen)));
    }
    private Bid currentHigh() { return bids.isEmpty() ? null : bids.get(bids.size() - 1); }
}

interface AuctionObserver {
    void onOutbid(String auctionId, String bidderId);
    void onExtended(String auctionId, Instant newEnd);
    void onClosed(String auctionId, Bid winner);
}`),
      C("deep_dive", "Deep dive: concurrent bid ordering — the serialization point",
        "Two bids for $105 and $110 arrive in the same millisecond on a $100 auction. Without discipline you get the classic LOST UPDATE: both threads read currentHigh = 100, both validate, both write, and the final state depends on scheduler luck — worse, the $105 bid can land AFTER the $110 bid and become the 'current high' because last-write-wins. The fix is a SERIALIZATION POINT: all mutations to one auction pass through one mutex, so bids get a TOTAL ORDER, and validation happens INSIDE the critical section against the state the bid will actually be applied to. That is why placeBid is synchronized and why the sequence number is assigned under the lock: the sequence, not the timestamp, is the legal order of the auction, and it is what the audit trail replays. Interviewers probe the granularity next: a GLOBAL lock over all auctions is correct but absurd — bids on unrelated auctions would queue behind each other — so the lock is PER AUCTION (each Auction object is its own monitor; the service map is a ConcurrentHashMap so lookup does not serialize). Within one hot auction, is a mutex enough? Yes — even a frenzied auction sees hundreds of bids per second, and a critical section of a few microseconds sustains tens of thousands; the lock is not the bottleneck, and attempting a lock-free CAS design here buys nothing while making proxy resolution (a multi-step read-modify-write) far harder to keep atomic. What matters more is what happens under contention at the API edge: the loser of the race gets a PRECISE rejection — 'bid must be at least $115' — computed against post-race state, so the client can re-prompt instantly. Finally, closing races with bidding: the timer thread calling close() takes the same monitor, so a bid and the close cannot interleave — a bid either lands wholly before CLOSED or is wholly rejected, and close() is idempotent (double timer fire is a no-op). If asked to scale past one process: the same design maps to an optimistic version column (compare-and-swap on the auction row, retry on conflict) — the invariant 'validate and append atomically against current state' survives the move; only the mutex changes clothing."),
      C("deep_dive", "Deep dive: proxy bidding & anti-sniping — the auction-theory mechanics",
        "PROXY BIDDING (eBay's automatic bidding) is the feature that separates a toy from the real design. A bidder states a private MAXIMUM; the system bids the minimum needed to keep them winning, up to that max. The invariant: the standing price is ONE INCREMENT ABOVE THE SECOND-HIGHEST commitment, never the winner's max — a second-price auction in disguise. Mechanics inside the critical section: when a live bid of $120 arrives against a stored proxy max of $200, the proxy immediately counter-bids $120 + increment, and the proxy holder remains the visible high bidder; the arriving bidder is instantly outbid. When TWO proxies collide ($200 vs $150), the engine bids them against each other and settles at $150 + increment with the $200 proxy winning — you should be able to state this settlement rule without simulating every intermediate step (the naive loop that appends dozens of phantom bids is a smell; compute the settlement point directly and append the settling bid). Crucially, proxy resolution must run in the SAME critical section as the triggering bid — if it runs after the lock is released, a third bid can interleave between the trigger and the counter, and the proxy holder is briefly, wrongly, not winning. Proxy maxima are SECRET: they never appear in the public bid history, only the counter-bids they generate do. ANTI-SNIPING attacks a different exploit: bidding at T-minus-1s denies everyone a response, which suppresses final prices and infuriates proxy-less humans. The standard remedy is the EXTENSION RULE: any accepted bid inside the final window (say 2 minutes) pushes endTime out to now + window, repeating until a window passes with no bids — 'going, going, gone' formalized. Model it as a policy object with a trigger window, an extension length, and an EXTENSION CAP (uncapped extension lets two bots extend an auction forever). The subtle interaction interviewers love: a snipe against a proxy does NOT extend indefinitely — the proxy counter is instantaneous and within the same critical section, so one extension covers it. The alternative anti-snipe design — hard close with sealed proxy bids only — is worth naming as the trade-off: simpler, but it changes the product into a sealed-bid auction."),
      C("tradeoffs", "Trade-offs & extension points",
        "LOCK GRANULARITY: per-auction monitor (chosen — independent auctions never contend) vs global lock (trivially correct, unacceptable) vs lock-free CAS on a currentHigh reference (fastest reads, but proxy resolution and deadline extension are multi-step invariants that CAS alone cannot keep atomic — you would end up rebuilding a lock). ORDERING AUTHORITY: in-lock sequence numbers (chosen — deterministic, replayable) vs timestamps (ties, clock skew across servers; fine for display, never for adjudication). PROXY SETTLEMENT: direct second-price computation (chosen) vs simulated increment war (same outcome, noisy history, O(gap/increment) appends). ANTI-SNIPE: extension window with a cap (chosen — keeps the open-outcry feel) vs hard close (simple, snipe-prone) vs sealed-bid second-price (snipe-immune, different product). CLOSE SCHEDULING: an idempotent close() driven by a scheduler (chosen; a late timer plus the endTime check in placeBid means correctness never depends on timer precision) vs checking expiry only lazily on the next bid (a bidless auction never closes). Extension points an interviewer will reach for: AUCTION VARIANTS — Dutch (descending price; 'bid' means 'accept current price', validation strategy swaps), sealed-bid, buy-it-now (a bid at the BIN price transitions straight to CLOSED — a new edge in the state machine); PERSISTENCE — the aggregate maps to an event-sourced stream naturally because the bid list already IS an append-only event log; PAYMENTS — winner non-payment introduces a post-CLOSED settlement state machine (SOLD -> PAID / DEFAULTED -> second-chance offer), which is deliberately a separate object, not more states on Auction. At real scale the per-auction serialization point becomes a row-version CAS or a single-writer partition per auction — the design's shape survives; that is the sign it was factored right."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Two bids at the same instant — who wins?' — whoever enters the per-auction critical section first; the sequence number assigned under the lock is the authoritative order, the loser revalidates against the winner's bid and gets a precise 'minimum is now X' rejection. 'Why State pattern instead of a status enum?' — behavior differs per state (DRAFT edits, OPEN bids, CLOSED rejects everything), and delegating to a state object makes forgotten status checks structurally impossible; with an enum, every method grows an if-ladder and one missed branch accepts a bid after close. 'How does the proxy know when to bid?' — it does not watch; it is consulted synchronously inside placeBid, and settlement is computed directly (second-highest commitment + increment) rather than simulated. 'Can the auction extend forever?' — no: the AntiSnipePolicy carries an extension cap, and a proxy counter resolves within the triggering bid's critical section so it costs at most one extension. 'What if the close timer fires twice, or late?' — close() is idempotent (first transition wins), and placeBid independently checks endTime, so a late timer cannot admit late bids. 'Reserve price?' — validated at close, not per bid: the auction can run entirely below reserve and end 'not sold'; whether to display 'reserve not met' is product, the model just compares at close. 'Scale to many servers?' — the invariant to preserve is the per-auction serialization point: optimistic concurrency (version column, retry) or routing each auction's bids to a single writer both preserve it; naming the invariant rather than a technology is the senior answer."),
    ],
    "Auction is a top-tier OOD prompt because it packs three separately-gradeable mechanisms into one system: a lifecycle STATE MACHINE (State pattern with sniping-driven deadline extension), REAL CONCURRENCY (per-auction serialization of bids with in-lock validation and sequence ordering — the lost-update conversation is usually the deciding ten minutes), and AUCTION MECHANICS (proxy/second-price settlement and anti-sniping policy). Strong candidates name the Auction aggregate as the concurrency boundary, put validation inside the critical section, keep Bid immutable with lock-assigned sequence numbers, and can state the proxy settlement rule; weak candidates hand-wave 'use synchronized' without saying what invariant the lock protects.",
    [
      G("validate_outside_lock", "Validating a bid against currentHigh outside the critical section, then appending inside it.", "Validation and append must be one atomic step against the same state — check-then-act across the lock boundary means both racers validate against the old high and both get accepted.", "placeBid reads currentHigh, releases (or never takes) the lock, then writes; two concurrent bids both below each other both land."),
      G("timestamp_ordering", "Using wall-clock timestamps to order bids and adjudicate the winner.", "Assign a monotonic sequence number inside the per-auction critical section; timestamps tie at millisecond resolution and skew across servers — display them, never adjudicate by them.", "Bid comparator sorts by Instant; dispute resolution says 'earlier timestamp wins'; no sequence field exists."),
      G("proxy_as_poller", "Modeling proxy bids as background watchers that react to being outbid.", "Resolve proxies synchronously inside the triggering bid's critical section, settling directly at second-highest + increment — a reactive proxy leaves a window where the proxy holder is wrongly losing, and simulated increment wars spam the history.", "A proxy 'agent' thread polls or subscribes to outbid events and places a new bid later; tests show transient wrong-winner states."),
    ],
    0.5, DIAG.auction, "Auction system class diagram"),

  // ───────────────────── CALENDAR APPLICATION ───────────────────────────────
  TT("lld_m10", "lld_m10_t6", 6, "Design a Calendar Application", "design-calendar-application",
    ["case-study", "recurrence", "interval-scheduling"],
    "A user creates 'Standup, every weekday at 9:30, forever', drags next Tuesday's instance to 10:00, deletes Friday's, invites six people across three time zones, and then asks 'am I free Thursday at 4?'. Infinite series, per-instance edits, and overlap queries must all coexist. How do you design a Calendar Application?",
    "Store a recurring event as ONE row — a base Event plus a RecurrenceRule (RRULE-style: FREQ/INTERVAL/BYDAY/UNTIL) — and EXPAND occurrences on demand for a requested window, never materializing an infinite series. Per-instance edits become EventException records keyed by (seriesId, originalStartTime) that override or cancel a single expanded occurrence. Conflict and free/busy queries reduce to interval overlap over the expanded window (start < otherEnd && end > otherStart), invitations are an Observer-notified RSVP state per attendee, and all storage is UTC with time zones applied only at expansion and display.",
    [
      C("requirements", "Requirements",
        "Functional: users create/edit/delete EVENTS with title, location, start/end, attendees, and reminders; events can RECUR ('every weekday', 'first Monday of each month', 'every 2 weeks until June'); a single instance of a series can be MODIFIED (moved, retitled) or CANCELLED without touching its siblings — and 'edit this / this-and-following / all' must all work; users INVITE attendees who RSVP (accepted/declined/tentative) and see the event on their own calendars; the app answers view queries ('render March', 'agenda for today') and FREE/BUSY queries ('is this slot open for these 6 people?'), flagging CONFLICTS on double-booking; reminders fire before occurrences. Non-functional constraints that shape the design: recurring series are conceptually INFINITE, so occurrences cannot be materialized rows — they must be computed; per-instance edits mean the expansion must be OVERRIDABLE point-wise; TIME ZONES and DST are correctness issues, not display issues ('9:30 every day' in New York is not a fixed UTC offset — the November clock change shifts it); and view queries are the hot path, so expansion over a window must be cheap. Clarify scope: single-process OOD of the domain model — the interesting problems are the recurrence/exception model and interval queries, not sync protocols. The two defining problems: representing infinite recurring series with point overrides, and overlap/free-busy computation over expanded occurrences."),
      C("entities", "Core entities & responsibilities",
        "CALENDAR is a named container owned by a user (work, personal, shared team calendar) holding events; a user can overlay several. EVENT is the core record: id, title, organizer, START and END (stored as UTC instant PLUS the originating time zone id — you need both; UTC alone cannot expand '9:30 local' across a DST boundary), attendees, and an optional RECURRENCERULE. A non-recurring event is just an Event with no rule. RECURRENCERULE captures the pattern in RRULE vocabulary: frequency (DAILY/WEEKLY/MONTHLY/YEARLY), interval (every N), byDay (MO..FR), byMonthDay, and termination (UNTIL date, COUNT, or never). It is pure data plus one behavior: occurrencesBetween(windowStart, windowEnd) — the expansion iterator. EVENTEXCEPTION is the point override: keyed by (seriesEventId, originalOccurrenceStart), it either CANCELS that occurrence or REPLACES it with modified fields (new time, new title). The key insight is that the exception is addressed by the occurrence it replaces — that is what keeps 'move only Tuesday's standup' from forking the series. OCCURRENCE is a computed, never-stored value object: (seriesId, start, end, resolved fields) produced by expansion after exceptions are applied. INVITATION holds one attendee's RSVP state per event — a small state machine (NEEDS_ACTION -> ACCEPTED/DECLINED/TENTATIVE) — and is what projects the event onto the attendee's own calendar. CONFLICTDETECTOR answers overlap queries over expanded occurrences. REMINDERSCHEDULER computes the NEXT occurrence per reminder and arms exactly one timer per event — never one timer per future occurrence of an infinite series."),
      C("design", "Class design & patterns",
        "The load-bearing decision is EXPANSION OVER MATERIALIZATION, and the class design serves it. Event exposes occurrencesBetween(window): a non-recurring event returns itself if it intersects; a recurring event delegates to its RecurrenceRule's iterator, then applies its EventException map — cancelled occurrences are dropped, modified ones are swapped for the override's values. Callers (month view, free/busy, reminders) never know whether an event recurs: they ask for occurrences in a window and get value objects. That uniformity is the design's spine. RecurrenceRule is a STRATEGY in effect — DAILY/WEEKLY/MONTHLY expansion differ in how they step — though the pragmatic implementation is one iterator parameterized by the rule fields rather than four subclasses; say so, and say why (the variants share 90% of their stepping logic; subclassing fragments it). 'Edit this and all following' is implemented by SERIES SPLITTING: terminate the original rule with UNTIL = occurrence-before-the-edit, and create a new Event with the new values and the remainder of the rule — two clean series, no exception explosion; a lone 'edit this one' stays an exception. OBSERVER for invitations and changes: when the organizer edits an event, attendees' calendars and pending reminders are stale — the event emits changed/cancelled events consumed by invitation projections and the ReminderScheduler (which re-arms its single next-occurrence timer). The RSVP is a tiny explicit state machine on Invitation. ConflictDetector is deliberately OUTSIDE Event: overlap is a query across MANY events and calendars, so it belongs to a service that expands the relevant window once and sweeps it, not to any single event. Everything stores UTC + zone id; expansion computes in the event's zone (so DST shifts fall out correctly) and converts to the viewer's zone at the edge."),
      K("code", "Core classes (Java)",
`enum Freq { DAILY, WEEKLY, MONTHLY, YEARLY }

final class RecurrenceRule {
    final Freq freq; final int interval;               // every N units
    final Set<DayOfWeek> byDay;                        // e.g. MO..FR
    final LocalDate until;                             // null = forever

    RecurrenceRule(Freq freq, int interval, Set<DayOfWeek> byDay, LocalDate until) {
        this.freq = freq; this.interval = interval;
        this.byDay = byDay == null ? Set.of() : byDay; this.until = until;
    }

    List<ZonedDateTime> occurrencesBetween(ZonedDateTime seed,
                                           ZonedDateTime from, ZonedDateTime to) {
        List<ZonedDateTime> out = new ArrayList<>();
        ZonedDateTime cur = seed;                      // expand in the EVENT's zone
        while (!cur.isAfter(to)) {
            if (until != null && cur.toLocalDate().isAfter(until)) break;
            boolean dayOk = byDay.isEmpty() || byDay.contains(cur.getDayOfWeek());
            if (dayOk && !cur.isBefore(from)) out.add(cur);
            cur = switch (freq) {                      // DST-safe local stepping
                case DAILY   -> cur.plusDays(byDay.isEmpty() ? interval : 1);
                case WEEKLY  -> cur.plusDays(1);       // byDay filters within week
                case MONTHLY -> cur.plusMonths(interval);
                case YEARLY  -> cur.plusYears(interval);
            };
        }
        return out;
    }
}

final class Occurrence {                               // computed, never stored
    final String eventId; final ZonedDateTime start, end; final String title;
    Occurrence(String eventId, ZonedDateTime start, ZonedDateTime end, String title) {
        this.eventId = eventId; this.start = start; this.end = end; this.title = title;
    }
    boolean overlaps(Occurrence o) {
        return start.isBefore(o.end) && end.isAfter(o.start);
    }
}

class Event {
    final String id; String title; Duration length;
    ZonedDateTime start;                               // UTC instant + zone id
    RecurrenceRule rule;                               // null = one-off
    final Map<ZonedDateTime, EventException> exceptions = new HashMap<>();

    List<Occurrence> occurrencesBetween(ZonedDateTime from, ZonedDateTime to) {
        List<ZonedDateTime> starts = (rule == null)
            ? (start.isBefore(to) && start.plus(length).isAfter(from)
                ? List.of(start) : List.of())
            : rule.occurrencesBetween(start, from, to);
        List<Occurrence> out = new ArrayList<>();
        for (ZonedDateTime s : starts) {
            EventException ex = exceptions.get(s);
            if (ex != null && ex.cancelled) continue;
            out.add(ex != null
                ? new Occurrence(id, ex.newStart, ex.newStart.plus(length), ex.newTitle)
                : new Occurrence(id, s, s.plus(length), title));
        }
        return out;
    }
}

final class EventException {
    final boolean cancelled; final ZonedDateTime newStart; final String newTitle;
    EventException(boolean cancelled, ZonedDateTime newStart, String newTitle) {
        this.cancelled = cancelled; this.newStart = newStart; this.newTitle = newTitle;
    }
}`),
      C("deep_dive", "Deep dive: recurrence expansion & exceptions — the crux",
        "Why never materialize? 'Every weekday forever' has no last row; even a bounded horizon ('materialize 2 years ahead') breaks the moment the user edits the rule — now thousands of stored occurrences must be found and rewritten, and the horizon itself needs a background job forever topping it up. Expansion inverts this: the RULE is the single source of truth, and any window of occurrences is a pure function of (rule, window) — an edit to the rule is one row updated, instantly consistent for every view. The costs to acknowledge: expansion runs on every view query (cheap — a month view expands to at most a few dozen occurrences per event, and per-(event, window) caching handles the hot week), and queries like 'find my next free slot in the next year' must expand a large window (bounded expansion plus early termination). EXCEPTIONS are where most designs rot. The correct model addresses each override by the ORIGINAL occurrence start it replaces: move Tuesday 9:30 to 10:00 stores exception[(series, Tue-09:30)] = {newStart: Tue-10:00}; expansion generates Tue-09:30 from the rule, sees the exception, and emits the override instead. Deleting Friday stores a cancelled exception — a TOMBSTONE, critically different from 'no row': the rule will keep generating Friday forever, so its suppression must be recorded forever. The classic bug interviewers fish for: editing the series' start time after exceptions exist shifts every generated occurrence so exception keys no longer match — real systems (iCalendar's RECURRENCE-ID) key exceptions by the original occurrence time and REBASE or drop them on series edits; you should name that choice explicitly. 'This and following' must NOT become an unbounded pile of exceptions — split the series: cap the old rule with UNTIL, spawn a new Event for the tail. DST is the last trap: step recurrence in the event's LOCAL zone (plusDays on a ZonedDateTime), so 9:30 stays 9:30 across the clock change; stepping in UTC by fixed 24h silently drifts the meeting an hour for half the year."),
      C("deep_dive", "Deep dive: conflict detection, free/busy & reminders",
        "Overlap is deceptively simple and famously fumbled: intervals [s1,e1) and [s2,e2) overlap iff s1 < e2 AND s2 < e1 — half-open, so back-to-back meetings (end 10:00, start 10:00) do NOT conflict. Get that predicate wrong and every adjacent meeting pair lights up red. CONFLICT CHECK on create/move: expand the user's calendars over the candidate's window (plus a small margin), test the predicate against each occurrence — for a human calendar (tens of events a week) a linear sweep is honestly fine, and saying so is a senior move; the structures below earn their keep at larger n. For 'find conflicts across a whole month' or busy resources (a conference room with hundreds of bookings), sort occurrences by start and SWEEP: walk starts in order keeping the max end seen; any start before the current max end is a conflict — O(n log n) total rather than O(n^2) pairwise. If the calendar must answer point/range stabbing queries repeatedly against a mutating set (room-booking service), an INTERVAL TREE (or a simple sorted map by start with max-end augmentation) gives O(log n + k) per query — name it as the upgrade path rather than reaching for it first. FREE/BUSY for 'find a 30-minute slot for 6 people this week': union each attendee's busy intervals (expand, sort, MERGE overlapping/adjacent intervals — the classic merge-intervals routine), intersect the complements within working hours, return gaps >= 30 minutes. Two properties matter: it operates on OCCURRENCES (recurring standups block time like any meeting — a free/busy path that forgets to expand rules is a real bug I would probe for), and it needs only busy/free, not titles — which is exactly why calendar systems expose a privacy-preserving free/busy projection to non-owners. REMINDERS on infinite series: never enqueue future occurrences; keep ONE armed timer per (event, reminder) for the NEXT occurrence, and on fire (or on any series edit, via the Observer) recompute and re-arm. A moved instance's exception must also move its reminder — that re-arm-on-change edge is where reminder bugs live."),
      C("tradeoffs", "Trade-offs & extension points",
        "RECURRENCE STORAGE: rule + on-demand expansion (chosen — one source of truth, edits are O(1), infinite series are natural) vs materialized occurrence rows (simple queries and easy per-instance edits, but horizon jobs, edit rewrites, and unbounded growth) vs HYBRID — rule as truth plus a materialized window cache for the hot next-N-weeks (what large calendar backends actually do; name it as the scale evolution, since it turns view queries into indexed range scans while edits just invalidate the cache). EXCEPTION MODEL: keyed overrides on the series (chosen — iCalendar-compatible, keeps series identity) vs forking the changed instance into a standalone event (loses 'part of this series' semantics — 'delete all' misses the fork). SERIES EDIT SEMANTICS: this / this-and-following (series split) / all — supporting all three is product table stakes and each maps to a different mechanism (exception / split / rule edit); conflating them is how calendars corrupt data. CONFLICT STRUCTURES: linear scan (chosen for personal scale) -> sort + sweep (bulk checks) -> interval tree (high-volume resource booking) — presenting it as a ladder shows judgment. TIME HANDLING: UTC instant + zone id per event (chosen; expansion in local zone survives DST) vs pure UTC (drifts across DST) vs pure local (cannot compare across users). Extension points: SHARED calendars and permissions (viewer/editor per calendar — an ACL, orthogonal to the event model); ROOM BOOKING (rooms are attendees whose Invitation auto-accepts iff no conflict — an atomic check-and-accept, the calendar's version of a seat hold); WORKING-HOURS and multi-zone display (pure view concerns); SYNC with external calendars (iCalendar import/export falls out almost free precisely because the model mirrors RRULE/EXDATE/RECURRENCE-ID); NOTIFICATION fan-out to attendees on edits (already wired through Observer)."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not just store every occurrence?' — infinite series have no last row; horizon materialization needs perpetual top-up jobs and turns every rule edit into a bulk rewrite; the rule is the single source of truth and windows are computed (with a materialized-window CACHE as the scale-out, not the model). 'User moves one instance of a series — what exactly is written?' — one EventException keyed by (seriesId, original occurrence start) holding the overrides; expansion swaps it in; deletion is a cancelled tombstone, which must persist forever because the rule regenerates that slot forever. 'Edit this-and-following?' — split the series: UNTIL-terminate the old rule at the edit point, create a new event for the tail; never model it as a growing pile of exceptions. 'Two meetings 10:00-11:00 and 11:00-12:00 — conflict?' — no: half-open intervals, s1 < e2 && s2 < e1; stating the predicate precisely is the point of the question. 'Find a slot for six people?' — expand each attendee's window, merge each busy set (merge-intervals), intersect free gaps within working hours; it works on occurrences, so recurring events block time correctly. 'What breaks across DST?' — fixed-UTC stepping drifts local-time events by an hour; step in the event's zone and convert at display. 'Reminders for an infinite series?' — one timer for the next occurrence, re-armed on fire and on any edit via the change events — never a queue of future instances. Each answer returns to the spine: rule as truth, point-wise exceptions, expansion at the edges."),
    ],
    "Calendar is a modeling-precision interview: there is little concurrency and no exotic pattern, so the grade rides on whether your recurrence model is exactly right — rule-as-data with on-demand expansion, exceptions keyed by original occurrence time (tombstones for deletes), series-splitting for 'this and following', UTC-plus-zone storage with local-zone stepping for DST. The second axis is algorithmic hygiene: the half-open overlap predicate, merge-intervals for free/busy, sweep or interval tree named as upgrades with the honest observation that personal-calendar n is small. Candidates who materialize occurrences or key exceptions by position fail on the first follow-up edit scenario; candidates who nail the exception model and the DST trap read as having actually built one.",
    [
      G("materialize_series", "Storing every occurrence of a recurring event as its own row.", "Store the rule once and expand occurrences on demand for a window (cache/materialize a bounded window only as a derived optimization); otherwise infinite series need horizon jobs and every rule edit becomes a bulk rewrite.", "An occurrences table populated at creation time; 'repeats forever' handled by a generate-N-years-ahead job; rule edits loop over stored rows."),
      G("delete_as_absence", "Implementing 'delete this instance' by just not showing it, or forking it out of the series, with no stored tombstone.", "Record a cancelled EventException keyed by the original occurrence start — the rule regenerates that slot on every expansion forever, so its suppression must be durable data.", "Deleted instances reappear after cache refresh or on another device; exceptions keyed by array index or position break when the series start shifts."),
      G("closed_interval_overlap", "Using <= in the overlap test (closed intervals), or comparing local times across zones.", "Overlap is start1 < end2 && start2 < end1 on half-open [start, end) instants — back-to-back meetings must not conflict; compare UTC instants, expand in the event's zone so DST does not drift the local time.", "Adjacent meetings flagged as conflicts; a 9:30 daily standup renders at 8:30 after the November clock change; free/busy ignores recurring events."),
    ],
    0.4, DIAG.calendar, "Calendar application class diagram"),

  // ───────────────────── TEXT EDITOR WITH UNDO/REDO ─────────────────────────
  TT("lld_m10", "lld_m10_t7", 7, "Design a Text Editor with Undo/Redo", "design-text-editor-undo-redo",
    ["case-study", "command-pattern", "memento"],
    "A user types a paragraph into a 200 MB log file, deletes a word, pastes over a selection, hits undo four times, redo twice — then types again, and the stale redo history must vanish. Every keystroke must feel instant and every undo must restore the exact prior state, including the cursor. How do you design a Text Editor with Undo/Redo?",
    "Reify every edit as a COMMAND object (Command pattern) carrying execute() and undo(), where undo applies the stored INVERSE — a delete remembers the text it removed, an insert remembers its position and length. An UndoManager keeps two stacks (undo/redo) with the invariant that any new edit clears the redo stack, and coalesces keystroke-granularity commands into word-level chunks. The document itself is a PIECE TABLE (or gap buffer) so both edits and their inverses are O(1) descriptor operations rather than megabyte array shifts — Memento snapshots are the contrast case worth naming, not the mechanism.",
    [
      C("requirements", "Requirements",
        "Functional: INSERT text at the cursor, DELETE (backspace, forward-delete, cut a selection), REPLACE a selection (paste-over), move the cursor / select ranges; UNDO reverts the most recent edit and REDO re-applies an undone one, both repeatable across a deep history; undo restores EVERYTHING the edit changed — text AND cursor/selection position (undo that dumps your cursor at the top of the file is broken); a new edit after undos DISCARDS the redo branch (the universal linear-history convention — name it explicitly). Non-functional constraints that shape the design: keystroke latency must be imperceptible even in HUGE files (a 200 MB log — which immediately kills 'the document is a String', since String is immutable and every keystroke would copy 200 MB) ; undo history should be DEEP without exhausting memory, which forces per-edit cost to be proportional to the edit, not the document; undo granularity should feel human — one undo removes the last word or burst of typing, not one character; and the design should leave room for grouped operations (find-and-replace-all undone as ONE step). Clarify scope: single-user, in-memory OOD — collaborative editing (OT/CRDT) is a stated non-goal but a good closing mention. The two defining problems: how edits are represented so they can be reversed (Command vs Memento), and how the text is stored so edits and their inverses are cheap (gap buffer / piece table)."),
      C("entities", "Core entities & responsibilities",
        "DOCUMENT owns the text and exposes exactly two primitive mutations — insert(pos, text) and delete(pos, len) (which RETURNS the removed text — that return value is what makes deletes reversible) — plus read access for rendering. Internally it is a piece table; externally callers see logical positions. Keeping the mutation surface this narrow is deliberate: every higher-level operation (paste, cut, replace, replace-all) composes from these two, so only two inverse rules exist in the whole system. COMMAND is the interface with execute() and undo(); INSERTCOMMAND stores (position, text) — its inverse is delete(position, text.length) ; DELETECOMMAND stores (position) and captures the removed text AT EXECUTE TIME — its inverse is insert(position, removedText). REPLACECOMMAND (paste over a selection) is a CompositeCommand of delete-then-insert, undone in reverse order — and the composite is the same mechanism that makes replace-all a single undo step. Each command also snapshots the cursor/selection BEFORE execution, so undo restores the caret. UNDOMANAGER owns two stacks (undo, redo) and the three rules: execute pushes onto undo and CLEARS redo; undo pops, calls undo(), pushes onto redo; redo mirrors it. It also owns COALESCING policy (merge adjacent single-character inserts) and the history cap. CURSOR/SELECTION is a small value object (anchor, point). EDITOR is the facade wiring keystrokes to commands: it creates the command, hands it to the UndoManager, and never mutates the Document directly — the moment any code path bypasses the command pipeline, undo silently corrupts, so this discipline is an architectural invariant, not a style preference."),
      C("design", "Class design & patterns",
        "COMMAND PATTERN is the spine, and the interview wants you to justify it against MEMENTO. Memento says: before each edit, snapshot state; undo = restore snapshot. Command says: record each edit as an operation carrying its own inverse; undo = apply the inverse. For a text editor the choice is forced by arithmetic — a Memento snapshot of a 200 MB document per keystroke is absurd, while an InsertCommand is a few dozen bytes regardless of document size. Undo cost tells the same story: restoring a snapshot is O(document), applying an inverse is O(edit). The honest nuance that scores points: Memento remains right for SMALL, GNARLY state where computing an inverse is harder than copying — cursor/selection state is exactly that, so each command carries a tiny memento of the caret while the text change itself is command-based. The hybrid is the senior answer. COMPOSITE for grouping: CompositeCommand executes children in order and undoes them in REVERSE order — one class gives you paste-over, replace-all-as-one-undo, and programmatic macros. COALESCING as policy on the UndoManager: a fresh InsertCommand merges into the previous one when it is a single character, adjacent in position, within a time window, and not a word boundary — so undo eats a word at a time, matching user expectation; the merge rule lives in the manager (or a canMerge(prev) hook on commands), not scattered through the editor. The redo-clearing rule is an INVARIANT to state out loud: after undo-undo-type, the redo stack must be discarded, because redo would otherwise replay an edit against a document shape it never saw — position-based commands are only valid against the exact state they were recorded on. That validity argument — commands are deltas pinned to a state, so history must be LINEAR (or an explicit tree, the Vim/emacs extension) — is the conceptual heart of the design."),
      K("code", "Core classes (Java)",
`interface Command {
    void execute(Document doc);
    void undo(Document doc);
    default boolean mergeWith(Command next) { return false; }  // coalescing hook
}

final class InsertCommand implements Command {
    private final int pos; private final StringBuilder text;
    private final int caretBefore;
    InsertCommand(int pos, String text, int caretBefore) {
        this.pos = pos; this.text = new StringBuilder(text);
        this.caretBefore = caretBefore;
    }
    public void execute(Document doc) { doc.insert(pos, text.toString()); }
    public void undo(Document doc)    { doc.delete(pos, text.length()); }
    public boolean mergeWith(Command next) {          // coalesce typing bursts
        if (!(next instanceof InsertCommand n)) return false;
        boolean adjacent = n.pos == this.pos + this.text.length();
        boolean smallAndNotBreak = n.text.length() == 1
            && !Character.isWhitespace(n.text.charAt(0));
        if (adjacent && smallAndNotBreak) { this.text.append(n.text); return true; }
        return false;
    }
    int caretBefore() { return caretBefore; }
}

final class DeleteCommand implements Command {
    private final int pos; private final int len;
    private String removed;                            // captured at execute time
    DeleteCommand(int pos, int len) { this.pos = pos; this.len = len; }
    public void execute(Document doc) { removed = doc.delete(pos, len); }
    public void undo(Document doc)    { doc.insert(pos, removed); }
}

final class CompositeCommand implements Command {      // replace / replace-all
    private final List<Command> children;
    CompositeCommand(List<Command> children) { this.children = children; }
    public void execute(Document doc) { children.forEach(c -> c.execute(doc)); }
    public void undo(Document doc) {
        for (int i = children.size() - 1; i >= 0; i--) children.get(i).undo(doc);
    }
}

class UndoManager {
    private final Deque<Command> undoStack = new ArrayDeque<>();
    private final Deque<Command> redoStack = new ArrayDeque<>();
    private final int cap = 1000;

    void perform(Document doc, Command cmd) {
        cmd.execute(doc);
        redoStack.clear();                             // new edit kills redo branch
        Command top = undoStack.peek();
        if (top == null || !top.mergeWith(cmd)) {
            undoStack.push(cmd);
            if (undoStack.size() > cap) undoStack.removeLast();
        }
    }
    void undo(Document doc) {
        if (undoStack.isEmpty()) return;
        Command c = undoStack.pop(); c.undo(doc); redoStack.push(c);
    }
    void redo(Document doc) {
        if (redoStack.isEmpty()) return;
        Command c = redoStack.pop(); c.execute(doc); undoStack.push(c);
    }
}`),
      C("deep_dive", "Deep dive: inverse capture, stack discipline & the linear-history invariant",
        "The mechanism that makes Command-based undo CORRECT (not just cheap) is inverse capture, and its subtlety is WHEN the inverse is captured. An InsertCommand knows its inverse at construction — delete(pos, len). A DeleteCommand cannot: the text it will remove is only knowable AT EXECUTE TIME, so execute() must capture the removed text as the command runs (note the Document.delete signature returning the removed string — that API shape exists purely to serve undo). Get this wrong — construct the inverse from what the code THINKS is there — and undo diverges from reality the first time two code paths disagree. Second mechanism: ORDERING. A composite undoes children in reverse; the stacks enforce reverse-chronological undo globally. Why is order sacred? Because commands are POSITION-BASED DELTAS: 'insert at 100' is only meaningful against the exact document state it was recorded on. Undo them out of order and positions dangle — which is also the rigorous justification for the redo-clear rule: after undo-undo-type, the old redo commands reference a document state that no longer exists on the timeline; replaying them would insert at stale offsets. Systems that refuse to discard (Vim's undo tree, emacs) keep the abandoned branch as a TREE and let users navigate it — mention it as the deliberate generalization, not an accident. Third: CURSOR RESTORATION. Each command snapshots (caret, selection) before executing; undo restores the pre-state, redo the post-state — this is the small legitimate use of Memento inside a Command design, and interviewers notice when your undo restores text but strands the caret. Fourth: COALESCING policy — merge single-char adjacent inserts within a burst, break at whitespace/word boundaries so undo removes a word, and NEVER merge across an undo boundary (the merge hook only consults the top of the undo stack). Finally the CAP: bound the stack (drop oldest) so a day of typing cannot hold gigabytes of deleted text; because commands store only their own deltas, a 1000-entry history over normal editing is kilobytes."),
      C("deep_dive", "Deep dive: text storage — why the buffer decides your latency",
        "Undo design collapses if the underlying text store makes edits expensive, so the storage question is half the interview. A flat char array / String: insert at position p copies everything after p — O(n) per keystroke, 200 MB memmove per character in a big file; immutable String is worse (full copy). GAP BUFFER (classic emacs): keep one contiguous array with a movable GAP at the cursor; typing writes into the gap — O(1) amortized — and moving the cursor moves the gap (O(distance)). It exploits the empirical truth that edits cluster at the cursor. Weaknesses: a long cursor jump drags the gap across the file, and there is exactly one gap — multiple cursors or concurrent regions do not fit. PIECE TABLE (VS Code, old Word): the document is a LIST OF PIECES, each a (buffer, offset, length) span pointing into two append-only buffers — the ORIGINAL file (never modified, can stay memory-mapped) and an ADD buffer where every typed character is appended. Insert = append text to the add buffer, split the piece at the insertion point, splice in a new piece descriptor — O(pieces), independent of document size. Delete = shrink/split piece descriptors; THE DELETED TEXT IS NEVER ERASED, it just stops being referenced — which is a gift to undo: a DeleteCommand's 'removed text' is just a retained span reference, and undo re-splices descriptors. The append-only property means snapshots for async rendering or crash recovery are nearly free (copy the piece list, not the text). Weakness: the piece list fragments under heavy editing (thousands of pieces), so real implementations index pieces in a balanced tree keyed by cumulative length (VS Code's red-black piece tree) making position lookup O(log pieces). ROPE (balanced tree of string leaves) is the third option — O(log n) everything, natural for very large files — but the piece table's no-copy load of the original file and its synergy with delta-based undo make it the strongest default answer. The one-line summary that lands: commands stay O(1) descriptors BECAUSE the store is append-only — the two choices reinforce each other."),
      C("tradeoffs", "Trade-offs & extension points",
        "UNDO MECHANISM: Command with captured inverses (chosen — O(edit) memory and time, composable, survives huge documents) vs Memento snapshots (O(document) per edit — but correct for tiny gnarly state, hence the caret memento inside each command; also honestly fine for a small config-file editor, and saying WHEN the naive design suffices is a signal, not a concession) vs EVENT-SOURCING style replay (undo = replay all commands but the last from a checkpoint — simple inverses-free logic, expensive undo, occasionally right when inverses are genuinely impossible). HISTORY SHAPE: linear with redo-clear (chosen — matches user expectation, simple invariants) vs undo TREE (no work ever lost, navigation UX burden — Vim's choice). GRANULARITY: per-keystroke commands with manager-level coalescing (chosen — policy stays in one place, tunable) vs recording only flush-on-pause chunks (loses fine structure, complicates interactive feel). STORAGE: piece table (chosen — O(1)-ish edits, append-only buffers make deletes reversible for free, instant file load via mmap) vs gap buffer (simplest real answer, great single-cursor locality, poor for jumps/multi-cursor) vs rope (best asymptotics at extreme sizes, most code). Extension points interviewers reach for: SELECTION-aware operations (already composites), FIND-AND-REPLACE-ALL as one undo step (a CompositeCommand — the design answers it in one sentence), MULTI-CURSOR (n commands per keystroke grouped in a composite; piece table copes, gap buffer does not), PERSISTENCE of undo across sessions (serialize the command log — commands are already data), and COLLABORATIVE editing — the honest boundary: concurrent remote edits invalidate absolute positions, so commands must be rebased/transformed (OT) or positions replaced with CRDT identifiers; undo becomes 'undo MY operations against a moved state', which is a genuinely different problem — knowing where this design stops is part of mastering it."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why Command over Memento?' — per-edit cost: an inverse-carrying command is O(edit) in time and memory while a snapshot is O(document); at 200 MB the snapshot design is dead on arrival — but keep a micro-memento of the caret inside each command, because for tiny awkward state snapshotting beats inverse-deriving. 'Where does a DeleteCommand get the text it restores?' — captured at execute time from the document (delete returns the removed text); inverses constructed from assumptions instead of observations drift from reality. 'User undoes twice then types — what happens to redo?' — cleared: redo commands are position-based deltas pinned to a timeline that no longer exists; replaying them against the new state would corrupt — unless you upgrade to an explicit undo tree like Vim. 'One undo per keystroke?' — no: coalesce adjacent single-character inserts into word-level chunks in the UndoManager (merge hook, break at word boundaries and on undo), so undo matches human granularity. 'How is replace-all one undo step?' — a CompositeCommand of the individual replacements, undone in reverse order — grouping falls out of the pattern. 'Why does the piece table matter to undo?' — its buffers are append-only, so deleted text is never destroyed, making inverse capture a span reference instead of a copy, and keeping every command a tiny descriptor. 'Collaborative undo?' — the boundary: absolute positions break under concurrent remote edits; OT rebases commands, CRDTs replace positions with stable ids, and 'undo my ops only' becomes the new semantics — a different design, and naming the boundary is the senior close."),
    ],
    "Undo/redo is the canonical Command-pattern interview and one of the few LLD prompts with a right answer: commands carrying execute/undo with inverses captured at execute time, two stacks with the redo-clear invariant, composite grouping, and coalescing policy. The differentiators are the WHY behind each rule — snapshots are O(document) while inverses are O(edit); redo must die after a new edit because position-based deltas pin to a timeline; cursor state rides along as a micro-memento — and the storage layer conversation (gap buffer vs piece table vs rope), which separates candidates who have thought about real editors from those reciting the pattern. It also generalizes: every 'design X with undo' (drawing app, form builder, IDE refactoring) is this design wearing different clothes.",
    [
      G("memento_per_keystroke", "Snapshotting the whole document (Memento) on every edit to enable undo.", "Reify edits as Commands carrying O(edit)-sized inverses (delete captures its removed text at execute time); reserve mementos for tiny state like the caret — snapshots of a large document per keystroke are O(document) memory and time.", "An undo stack of full document copies / Strings; memory grows with document size times edit count; large-file typing lags."),
      G("keep_redo_after_edit", "Preserving the redo stack after a fresh edit, or undoing composites in forward order.", "New edit clears redo (its commands are deltas pinned to a defunct timeline — replaying them corrupts positions); composites undo children strictly in reverse; if losing the branch is unacceptable, build an explicit undo tree.", "Redo after undo-then-type inserts at stale offsets or throws; composite undo leaves the document half-reverted."),
      G("string_as_buffer", "Storing the document as a String/flat array so every insert shifts or copies the tail.", "Use a gap buffer (edits cluster at the cursor) or a piece table (append-only buffers, O(1)-ish descriptor edits, deletes reversible for free); the storage choice is what keeps both commands and their inverses cheap.", "doc = doc.substring(0,p) + ch + doc.substring(p) on each keystroke; profilers show O(n) memmove per character; 100 MB files freeze the editor."),
    ],
    0.5, DIAG.editor, "Text editor undo/redo class diagram"),

  // ───────────────────── THREAD-SAFE CONCURRENT CACHE ───────────────────────
  TT("lld_m10", "lld_m10_t8", 8, "Design a Thread-Safe Concurrent Cache", "design-thread-safe-concurrent-cache",
    ["case-study", "concurrency", "caching", "lru"],
    "Two hundred request threads hammer one in-process cache. A key expires and forty threads miss simultaneously — will you send forty identical queries to the database? Meanwhile every get() must update recency for LRU eviction, which means every READ is secretly a WRITE. How do you design a Thread-Safe Concurrent Cache?",
    "Start from the brutal fact that an LRU cache turns reads into writes (every get touches the recency list), so a single synchronized wrapper serializes ALL traffic. The design answer is LOCK STRIPING: hash keys into N independent SEGMENTS, each owning its own lock, hash map, and LRU list — threads on different segments never contend, and eviction becomes per-segment (approximate global LRU, which is fine and worth saying). Solve the thundering-herd miss with per-key FUTURES via computeIfAbsent — the first missing thread inserts a future and loads; the other thirty-nine block on that future instead of the database. TTL is checked lazily on read plus swept opportunistically.",
    [
      C("requirements", "Requirements",
        "Functional: get(key), put(key, value), remove(key); BOUNDED capacity with an EVICTION policy (LRU primary; design so LFU/FIFO can swap in); optional TTL per entry (expired entries are never returned); a LOADING mode — get(key, loader) that computes and caches on miss; and hit/miss/eviction STATS for observability. Non-functional constraints — and here they ARE the problem: full THREAD SAFETY under hundreds of concurrent readers and writers with no corrupted state, no lost updates, and no deadlocks; READ-HEAVY scalability (a 95%+ hit-rate cache whose get() serializes on one lock becomes the application's bottleneck — the cure worse than the miss); SINGLE-FLIGHT loading (N concurrent misses on the same key must trigger exactly ONE loader call — the cache stampede / thundering-herd requirement, and the difference between a cache that protects your database and one that amplifies load against it); eviction must be O(1) per operation; and TTL must not require a scan. Clarify scope: an in-process cache à la Guava/Caffeine, not a distributed cache — consistency across nodes is out; memory-bounded correctness under concurrency is in. State the central tension out loud at the start: strict LRU REQUIRES mutating shared recency state on every read, and that requirement is in direct conflict with read scalability — the whole design is about how much LRU strictness to trade for how much concurrency."),
      C("entities", "Core entities & responsibilities",
        "CONCURRENTCACHE is the facade: it owns the segment array, routes every operation by hash(key) -> segment, and aggregates stats. It contains NO locking itself — pushing all synchronization down into segments is the design's core move. SEGMENT (the stripe) is the unit of concurrency: it owns ONE lock, ONE hash map (key -> Entry), ONE doubly-linked LRU list threading its entries, and its capacity share (total/N). All invariants — map and list agree, size <= capacity, head is most recent — are per-segment, protected by that one lock; because no operation ever touches two segments, there is no lock ordering to reason about and DEADLOCK IS IMPOSSIBLE by construction (worth one explicit sentence in the interview). ENTRY holds key, value, writeTime (for TTL), and its prev/next pointers in the segment's LRU list — pointers ARE the recency structure, giving O(1) unlink/relink; the entry is the map's value, so map and list share one object. EVICTIONPOLICY: onAccess(entry) moves to head, onInsert may evict the tail; keeping it an interface is what lets FIFO (skip onAccess — and note reads stop being writes, a real concurrency win) or CLOCK swap in. CACHELOADER is the user's compute function for loading mode; FUTUREVALUE — the map's value is a future/promise, not the raw value — is the single-flight mechanism: inserting the future IS claiming the load. STATSCOUNTER uses atomics (LongAdder-style) outside any lock, because contending on a stats lock inside the hot path would be self-parody."),
      C("design", "Class design & patterns",
        "The design narrative is a ladder of rejected alternatives, and walking it IS the interview. Rung 1: HashMap + one synchronized wrapper on everything — correct, trivially deadlock-free, and serializes every reader against every writer; with LRU, get() mutates the list, so reads cannot even use a read-write lock's shared mode. Say it, credit it as the 5-minute baseline for low-QPS uses, reject it for the stated load. Rung 2: ReadWriteLock — a false friend HERE, precisely because LRU reads are writes; you would hold the write lock on every get. (It becomes viable only if recency updates are moved out of the critical path — see the Caffeine discussion.) Rung 3: raw ConcurrentHashMap — solves the map, but LRU needs a LIST glued to the map, and CHM cannot make map-op + list-op atomic together; naive gluing corrupts the list. Rung 4 — the chosen design: LOCK STRIPING. N segments (power of two; hash spreads keys), each a small single-threaded-style LRU cache guarded by its own lock. Contention drops by ~N for uniformly distributed keys; the critical section stays tiny (hash lookup + two pointer splices). This is ConcurrentHashMap-pre-Java-8's architecture applied to a cache, and it is exactly how Guava's LocalCache works — name the lineage. The cost, stated honestly: capacity and LRU become PER-SEGMENT, so global LRU is approximate (a hot segment may evict an entry globally 'younger' than a cold segment's tail — acceptable for a cache, where eviction is a heuristic, not a contract). STRATEGY for eviction policy; DECORATOR is the natural shape for stats/TTL wrappers if the interviewer asks for optionality; the loading path uses FUTURE-AS-VALUE, the one genuinely clever mechanism in the design (detailed in the deep dive). Capacity check happens inside the same critical section as insert, so size can never exceed bound even transiently."),
      K("code", "Core classes (Java)",
`class ConcurrentLruCache<K, V> {
    private final Segment<K, V>[] segments;
    private final int mask;

    @SuppressWarnings("unchecked")
    ConcurrentLruCache(int capacity, int concurrency) {
        int n = Integer.highestOneBit(Math.max(concurrency - 1, 1) * 2); // pow2
        segments = (Segment<K, V>[]) new Segment[n];
        mask = n - 1;
        for (int i = 0; i < n; i++)
            segments[i] = new Segment<>(Math.max(1, capacity / n));
    }
    private Segment<K, V> seg(K key) {
        int h = key.hashCode(); h ^= (h >>> 16);       // spread
        return segments[h & mask];
    }
    V get(K key) { return seg(key).get(key); }
    void put(K key, V value) { seg(key).put(key, value); }

    static final class Entry<K, V> {
        final K key; V value; long writeNanos;
        Entry<K, V> prev, next;                        // intrusive LRU links
        Entry(K key, V value) { this.key = key; this.value = value; }
    }

    static final class Segment<K, V> {
        private final int capacity;
        private final HashMap<K, Entry<K, V>> map = new HashMap<>();
        private Entry<K, V> head, tail;                // MRU .. LRU
        private final ReentrantLock lock = new ReentrantLock();
        Segment(int capacity) { this.capacity = capacity; }

        V get(K key) {
            lock.lock();
            try {
                Entry<K, V> e = map.get(key);
                if (e == null) return null;
                moveToHead(e);                         // the read that writes
                return e.value;
            } finally { lock.unlock(); }
        }

        void put(K key, V value) {
            lock.lock();
            try {
                Entry<K, V> e = map.get(key);
                if (e != null) { e.value = value; moveToHead(e); return; }
                Entry<K, V> fresh = new Entry<>(key, value);
                map.put(key, fresh); addToHead(fresh);
                if (map.size() > capacity) {           // evict LRU, same lock
                    map.remove(tail.key); unlink(tail);
                }
            } finally { lock.unlock(); }
        }

        private void addToHead(Entry<K, V> e) {
            e.next = head; e.prev = null;
            if (head != null) head.prev = e;
            head = e; if (tail == null) tail = e;
        }
        private void unlink(Entry<K, V> e) {
            if (e.prev != null) e.prev.next = e.next; else head = e.next;
            if (e.next != null) e.next.prev = e.prev; else tail = e.prev;
        }
        private void moveToHead(Entry<K, V> e) {
            if (e == head) return;
            unlink(e); addToHead(e);
        }
    }
}

// Single-flight loading sketch: value slot holds a future, not a value.
// CompletableFuture<V> f = inflight.computeIfAbsent(key, k ->
//     CompletableFuture.supplyAsync(() -> loader.load(k)));
// V v = f.join();  // 40 missers -> 1 loader call; remove future on failure`),
      C("deep_dive", "Deep dive: striped locking vs ConcurrentHashMap vs synchronized — the contention argument",
        "Make the argument quantitative. One global lock: every operation takes it; at 200 threads and a ~100ns critical section you serialize roughly 10M ops/sec THEORETICAL max on a perfectly uncontended lock — but contention is not free: lock handoff, cache-line ping-ponging of the lock word, and context switches under queueing collapse real throughput far below that, and the profile shows threads parked on a monitor. Striping into 64 segments gives 64 independent lock words; with uniform key hashing, the probability two concurrent operations collide on a segment is ~1/64 — contention becomes rare instead of constant. Three subtleties carry the senior signal. (1) WHY NOT ConcurrentHashMap ALONE: CHM gives you a brilliantly concurrent MAP, but LRU requires a second structure (the recency list) mutated in concert with map operations, and CHM offers no way to make 'map.get + list.moveToHead' atomic as a pair — interleavings corrupt the list (an unlinked node observed mid-splice, a double-unlink NPE). Striping solves it by scoping BOTH structures under ONE lock per segment — the atomicity unit matches the invariant unit. That sentence — 'the lock must cover the whole invariant, and the invariant spans two structures' — is the crux of the question. (2) WHY DEADLOCK-FREE: each operation locks exactly one segment, ever; no thread holds one segment lock while wanting another; deadlock requires a cycle, cycles require holding-while-waiting across resources — structurally absent. (3) THE REAL-WORLD REFINEMENT: even striped, LRU's read-mutates-list property costs. Caffeine's answer: entries live in a ConcurrentHashMap for lock-free reads; recency updates are appended to lock-free RING BUFFERS and applied in BATCHES by a single drain thread — reads stop taking any lock, and recency becomes eventually-consistent (fine — eviction is a heuristic). Present striping as the design you build and defend, and the buffered-recency design as what you evolve to when profiling shows segment locks hot; knowing the ladder beats jumping to its top."),
      C("deep_dive", "Deep dive: single-flight loading & TTL — the stampede and the clock",
        "CACHE STAMPEDE: a popular key expires; 40 threads miss within a millisecond; each calls the loader; the database eats 40 identical queries — under real traffic this is how caches CAUSE outages (the cache empties on deploy, the herd stampedes, the DB dies, the cache never refills). The fix is SINGLE-FLIGHT: make the unit stored in the map a FUTURE rather than a value, and make claiming the load atomic with the miss. Concretely: inflight.computeIfAbsent(key, k -> new future that runs the loader) — computeIfAbsent's atomicity guarantees exactly one thread creates the future; that thread loads; the other 39 receive the SAME future and block on it, waking together when the value arrives. One loader call, no configuration, no polling. The three edge cases that separate a working implementation from a correct one: (a) LOADER FAILURE — if the load throws, REMOVE the future from the map before completing it exceptionally; a cached failed future would replay the exception to every future getter forever (negative caching, if wanted, should be an explicit TTL'd decision, not an accident). (b) NEVER run the loader while holding a segment lock — a slow loader (100ms DB call) would freeze every key in that segment; the future indirection exists precisely so the lock is held only for the map insert (microseconds), not the load. (c) RE-ENTRANCY/recursion (loader touches the cache) deadlocks a naive design — CHM's compute methods forbid it; document it. TTL: store writeTime in the entry; EXPIRE LAZILY — on get, if now - writeTime > ttl, treat as a miss (remove, and in loading mode fall straight into single-flight reload). Lazy expiry costs nothing and guarantees no stale reads; its gap is that never-touched entries linger, so pair it with opportunistic sweeps (check the LRU TAIL — coldest entries — during evictions) rather than a global scan or a timer per entry (a timer wheel is the honest answer only at millions of finely-timed entries). Refinements to name: probabilistic EARLY refresh (refresh-ahead) so hot keys reload BEFORE expiry and the herd never forms; JITTERED TTLs so a deploy-time cache fill does not expire everything in the same second."),
      C("tradeoffs", "Trade-offs & extension points",
        "LOCKING: global synchronized (baseline — correct, serial; fine below ~10k QPS and say so) vs striping (chosen — near-linear read scaling, approximate global LRU, deadlock-free by construction) vs CHM + buffered recency drains (Caffeine — lock-free reads, most machinery; the evolution target) vs fully lock-free LRU (research-grade complexity; do not claim it casually). EVICTION: strict LRU (chosen per segment — O(1), intrusive list) vs approximate global LRU (accept — eviction is a heuristic; a cache is ALLOWED to be wrong about which entry dies, it only costs a miss) vs LFU/W-TinyLFU (better hit rates under skew — Caffeine's frequency sketch; pluggable via the policy interface) vs CLOCK/second-chance (cheaper recency bookkeeping, coarser). TTL: lazy-on-read + opportunistic tail sweep (chosen — no scans, no stale returns) vs background sweeper thread (bounded staleness of MEMORY, adds a thread and a schedule) vs per-entry timers (timer-wheel territory; overkill here). CAPACITY split per segment: simple and contention-free, but a skewed segment evicts early while others sit under-full — mitigated by good hash spreading; a global size counter (LongAdder) with global pressure is the alternative at the cost of cross-segment coordination. WEIGHTS (size-aware eviction: bytes, not count) slot into the same policy seam. Extension points: eviction/removal LISTENERS (fired OUTSIDE the segment lock — invoking user callbacks under your lock invites re-entrant deadlock; queue and drain), soft/weak-reference values under memory pressure, stats-driven adaptive sizing, and the distributed question — this design is deliberately in-process; 'make it distributed' changes the problem to consistent hashing + invalidation protocols, and the right move is to say the per-node cache stays exactly this while distribution happens a layer above."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not wrap LinkedHashMap in Collections.synchronizedMap?' — LinkedHashMap in access-order IS a correct single-threaded LRU (removeEldestEntry — the 5-minute answer, credit it), but synchronized wrapping serializes everything, and because access order mutates the list, even reads take the exclusive lock; it is the rung-1 baseline, not the design. 'Why can't ConcurrentHashMap alone do LRU?' — the invariant spans TWO structures (map + recency list) and CHM cannot make paired mutations atomic; the lock must cover the whole invariant, hence per-segment locks scoping both. 'Forty threads miss the same key at once?' — future-as-value + computeIfAbsent: one thread wins the atomic insert and loads, the rest block on the same future — one DB query; on failure remove the future so errors are not cached by accident. 'Can it deadlock?' — no: one segment lock per operation, never two, so no hold-and-wait cycle exists; the one trap is user callbacks (removal listeners, loaders) invoked under the lock — never do that. 'Is your LRU exact?' — per-segment exact, globally approximate, and that is a feature: eviction is a heuristic and approximation buys concurrency; if hit rate matters more, W-TinyLFU is the policy-seam upgrade. 'How does TTL avoid a scan?' — lazy check on read (no stale returns) + sweep the cold tail during evictions (memory hygiene); jitter TTLs and refresh-ahead hot keys so expiry never synchronizes a herd. 'What would Caffeine do differently?' — CHM for lock-free reads, recency buffered in ring buffers drained in batches, frequency sketch for admission — name it as the evolution when segment locks show hot in a profile."),
    ],
    "The concurrent cache is the purest concurrency-design interview in the LLD canon: it tests whether you notice that LRU makes reads into writes (killing read-write locks), whether your lock scope matches your invariant scope (the map+list atomicity argument against raw ConcurrentHashMap), whether you know lock striping and can argue its deadlock-freedom structurally, and whether you have been burned by a cache stampede (future-as-value single-flight is the expected answer, including the failure-eviction edge). It is also a direct window into real libraries — LinkedHashMap as the baseline, Guava's segmented LocalCache, Caffeine's buffered recency — and interviewers grade the ladder of alternatives you climb as much as the destination.",
    [
      G("rwlock_for_lru", "Reaching for a ReadWriteLock so 'reads can proceed in parallel'.", "In an LRU cache every get mutates the recency list, so all operations need the write lock and the RW split buys nothing; either stripe locks (scope both map and list per segment) or move recency out of the read path entirely (buffered drains à la Caffeine).", "ReadWriteLock around an LRU map with moveToHead inside the read-locked section (unsafe) or write-locked gets (no parallelism); profiler shows readers serialized."),
      G("chm_plus_list", "Pairing a ConcurrentHashMap with a separate recency list guarded by its own (or no) lock.", "The invariant spans both structures, so one lock must cover both — per-segment locks scoping a small map plus its list; CHM alone cannot make map-op + list-op atomic, and split locking corrupts the list under interleaving.", "map is a CHM but moveToHead/unlink run outside it (or under a different lock); intermittent NPEs on prev/next pointers or entries in the map but missing from the list."),
      G("herd_on_miss", "Letting every missing thread call the loader, or holding the segment lock during the load.", "Store a future as the value via an atomic computeIfAbsent so exactly one thread loads and the rest await the same future; run the loader OUTSIDE any segment lock, and remove the future on failure so exceptions are not permanently cached.", "N concurrent misses produce N identical backend calls; a slow loader freezes the whole segment; a transient load error makes the key permanently return that error."),
    ],
    0.5, DIAG.cache, "Concurrent cache class diagram"),

  // ───────────────────────── MUSIC PLAYER ───────────────────────────────────
  TT("lld_m11", "lld_m11_t1", 1, "Design a Music Player", "design-music-player",
    ["case-study", "state-pattern", "strategy", "observer"],
    "A user is shuffling a 500-song playlist, taps pause mid-track, queues three songs to 'play next', hits previous twice — expecting the two songs shuffle just played, in order — then toggles repeat-one. Every control must behave sensibly in every state, and shuffle must never repeat a song before the pass ends. How do you design a Music Player?",
    "Model the player as a STATE MACHINE (State pattern: Stopped/Playing/Paused, where play/pause/next mean different things per state), and split 'what plays next' into a STRATEGY (sequential, shuffle, repeat-one, repeat-all) consulted by a PlayQueue that layers an explicit user 'play next' queue over the strategy-driven playlist order. Shuffle is a pre-shuffled permutation (Fisher-Yates) walked with an index — giving no-repeats-per-pass and a truthful previous — and OBSERVERS (UI, audio engine, scrobbler) react to state/track change events so the domain model never touches a widget.",
    [
      C("requirements", "Requirements",
        "Functional: PLAY, PAUSE, RESUME, STOP, NEXT, PREVIOUS, SEEK within a track; manage PLAYLISTS (create, order, add/remove tracks) and a library of tracks; PLAYBACK MODES — sequential, SHUFFLE, repeat-one, repeat-all — toggleable mid-playback; an explicit PLAY-NEXT QUEUE that overrides the playlist order ('queue this song next' while a playlist plays); and UI-visible state — current track, elapsed time, mode — kept live. Behavioral requirements that are really SPECIFICATIONS of the state machine and deserve to be surfaced as such: pause during STOPPED is a no-op, play during PAUSED resumes (does not restart), NEXT during PAUSED advances but stays paused (or starts playing — pick one and say you picked it; the point is the matrix of control × state must be total, no undefined cells); PREVIOUS in the first 3 seconds goes to the prior track, after that it restarts the current one (the convention every real player follows); SHUFFLE must play every track once per pass before any repeats, and PREVIOUS under shuffle must return through the ACTUAL play history, not re-randomize. Non-functional: the domain model must be UI-agnostic (the same core drives a phone UI, a car display, and a test harness), and audio decoding is abstracted behind an engine interface — this is an OOD exercise about control logic, not codecs. The defining problems: the control state machine, and the interaction between playback strategies, the user queue, and history."),
      C("entities", "Core entities & responsibilities",
        "TRACK is an immutable value: id, title, artist, duration, uri — the player passes it around, never mutates it. PLAYLIST is an ordered list of tracks with reorder/add/remove; it is pure data and emphatically NOT the thing that knows what plays next (a classic modeling mistake is stuffing playback logic into Playlist — then shuffle state leaks into a data object that should be shareable between players). PLAYQUEUE is the runtime scheduling brain and the design's most interesting entity: it holds the source playlist, the current position, the explicit user 'play-next' DEQUE, and the play HISTORY stack; its next() consults, in priority order, the user queue first, then the PlaybackStrategy over the playlist; previous() pops history. PLAYBACKSTRATEGY (Strategy) answers one question — given the playlist and current position, what is the next index? — with implementations SequentialStrategy, ShuffleStrategy (owns its shuffled permutation and pass index), RepeatOneStrategy, RepeatAllStrategy. PLAYERSTATE (State) — StoppedState, PlayingState, PausedState — each implements play/pause/stop/next per its own rules, and transitions swap the player's current state object. MUSICPLAYER is the context and facade: holds current state, the queue, the AUDIOENGINE port (load/start/pause/seek — an interface so tests stub it), and the observer list. PLAYEROBSERVER receives onTrackChanged, onStateChanged, onProgress — the UI, a bluetooth display, and a scrobbler are all just observers. Responsibilities separate cleanly: state answers 'is the control legal and what does it do NOW', strategy answers 'what comes next', queue arbitrates between user intent and strategy, player wires it together."),
      C("design", "Class design & patterns",
        "STATE PATTERN for the control matrix: MusicPlayer delegates every control call to its current PlayerState object. PausedState.play() resumes the engine and transitions to Playing; StoppedState.pause() is an explicit no-op; PlayingState.play() restarts or no-ops (documented choice). The alternative — a status enum with switch statements in every control method — works at three states and rots as reality adds Buffering, Seeking, and Error: each new state forces edits to every switch, and a missed case is a silent bug; with the State pattern a new state is a new class and the compiler walks you through the required behaviors. This system is the cleanest showcase of State in the whole LLD canon precisely because the control × state matrix is the product's actual spec. STRATEGY for next-track selection, and the reason it must be separate from State: playback MODE and playback STATE vary independently — you can toggle shuffle while paused, stopped, or playing; if next-track logic lived inside PlayingState you would need Playing×Shuffle, Playing×Repeat, Paused×Shuffle... a combinatorial explosion. Two orthogonal axes, two orthogonal patterns — saying that sentence explicitly is the design's thesis. OBSERVER decouples the domain from every rendering surface: the player emits track/state/progress events; the UI redraws, the scrobbler logs, the notification updates — the player imports none of them, which is also what makes the core testable headless. The AUDIOENGINE is a port (dependency-injected interface) — engine callbacks (onTrackFinished) come back INTO the player as events driving auto-advance: onTrackFinished asks the queue for next() and stays in Playing, or transitions to Stopped when the queue is exhausted. COMPOSITE is available if the interviewer extends playlists to nested folders; do not introduce it before it is asked for."),
      K("code", "Core classes (Java)",
`interface PlayerState {
    void play(MusicPlayer p);
    void pause(MusicPlayer p);
    void stop(MusicPlayer p);
    void next(MusicPlayer p);
}

class PlayingState implements PlayerState {
    public void play(MusicPlayer p) { /* already playing: no-op */ }
    public void pause(MusicPlayer p) {
        p.engine().pause();
        p.setState(new PausedState()); p.notifyState("PAUSED");
    }
    public void stop(MusicPlayer p) {
        p.engine().stop();
        p.setState(new StoppedState()); p.notifyState("STOPPED");
    }
    public void next(MusicPlayer p) {
        Track t = p.queue().next();
        if (t == null) { stop(p); return; }
        p.engine().load(t); p.engine().start(); p.notifyTrack(t);
    }
}

class PausedState implements PlayerState {
    public void play(MusicPlayer p) {                  // RESUME, not restart
        p.engine().resume();
        p.setState(new PlayingState()); p.notifyState("PLAYING");
    }
    public void pause(MusicPlayer p) { /* no-op */ }
    public void stop(MusicPlayer p) {
        p.engine().stop(); p.setState(new StoppedState()); p.notifyState("STOPPED");
    }
    public void next(MusicPlayer p) {                  // advance, stay paused
        Track t = p.queue().next();
        if (t != null) { p.engine().load(t); p.notifyTrack(t); }
    }
}

interface PlaybackStrategy { int nextIndex(int current, int size); }

class ShuffleStrategy implements PlaybackStrategy {
    private int[] order; private int pos = -1;
    public int nextIndex(int current, int size) {
        if (order == null || order.length != size) reshuffle(size);
        pos++;
        if (pos >= size) { reshuffle(size); pos = 0; }  // new pass
        return order[pos];
    }
    private void reshuffle(int n) {                     // Fisher-Yates
        order = new int[n];
        for (int i = 0; i < n; i++) order[i] = i;
        Random r = new Random();
        for (int i = n - 1; i > 0; i--) {
            int j = r.nextInt(i + 1);
            int tmp = order[i]; order[i] = order[j]; order[j] = tmp;
        }
    }
}

class PlayQueue {
    private final List<Track> playlist;
    private final Deque<Track> playNext = new ArrayDeque<>();  // user queue
    private final Deque<Track> history = new ArrayDeque<>();
    private PlaybackStrategy strategy;
    private int current = -1;
    PlayQueue(List<Track> playlist, PlaybackStrategy s) {
        this.playlist = playlist; this.strategy = s;
    }
    void setStrategy(PlaybackStrategy s) { this.strategy = s; }
    void queueNext(Track t) { playNext.addLast(t); }

    Track next() {
        if (current >= 0 && current < playlist.size())
            history.push(playlist.get(current));
        if (!playNext.isEmpty()) return playNext.pollFirst();  // user wins
        if (playlist.isEmpty()) return null;
        current = strategy.nextIndex(current, playlist.size());
        return playlist.get(current);
    }
    Track previous() { return history.isEmpty() ? null : history.pop(); }
}`),
      C("deep_dive", "Deep dive: the playback state machine — totality, transitions & the engine boundary",
        "The state machine looks trivial until you demand TOTALITY: every control in every state must have a defined outcome, and most of the defects in real players live in the cells people forgot. Walk the matrix deliberately. STOPPED: play loads the current queue position (or track zero) and starts — the transition that allocates engine resources; pause and seek are no-ops (nothing is loaded); next/previous may move the queue cursor WITHOUT starting playback (pick, document). PLAYING: pause suspends the engine but keeps the decoder position — the essential distinction between pause (position retained, resources held) and stop (position discarded, resources released; resume after stop restarts the track from zero). PAUSED: play resumes from the held position — resume-vs-restart is the bug users notice most; next advances the track but the design must choose whether it stays paused (load without start) or begins playing (most real players do the latter) — the point is the choice is EXPLICIT in PausedState.next, not emergent. Then the states the naive design forgets, which are exactly what the pattern makes cheap to add: BUFFERING (streaming — play was requested, audio not ready; controls arriving during buffering must queue or no-op, and this state is why the pattern earns its keep) and ERROR (decode failure — auto-skip? surface and stop?). ASYNC EVENTS complicate the machine more than user controls do: the engine's onTrackFinished callback arrives on the audio thread while the user may simultaneously tap next on the UI thread — a double-advance race (track skipped) unless events are serialized through one queue/lock into the state machine; single-threading the state machine's event intake is the correct and simple answer, and mentioning the race is the senior signal. PREVIOUS carries its own micro-rule: within the first ~3 seconds, previous means 'prior track'; after that it means 'restart current' — a two-line check in the player, but naming it shows you have watched a real user. Every transition emits observer events; the audio engine never talks to the UI directly."),
      C("deep_dive", "Deep dive: shuffle done right, the user queue & history",
        "SHUFFLE is where correctness meets user perception. The naive next = random(size) is wrong three ways: it repeats a song two minutes after playing it (users perceive random repeats as BROKEN shuffle), it can starve tracks for a whole session, and previous cannot be answered truthfully. The correct mechanism: generate a PERMUTATION of the playlist indices with FISHER-YATES (walk i from n-1 down, swap i with a uniform j in [0..i] — each of the n! orderings equally likely; the classic wrong version picks j in [0..n-1] every time and biases the distribution — worth writing correctly on the whiteboard), then WALK the permutation with an index. One pass = every track exactly once; pass exhausted = reshuffle for the next pass, optionally rejecting a reshuffle whose first track equals the last track just played (back-to-back repeat across the boundary — a tiny rule users feel). Toggling shuffle OFF mid-pass resumes sequential order from the CURRENT track's playlist position; toggling ON reshuffles the REMAINDER — state for this lives inside ShuffleStrategy, which is exactly why strategy instances are stateful objects, not lambdas. (Real products go further — Spotify deliberately de-randomizes, spreading same-artist tracks apart, because users judge true randomness as clustered; one sentence of that is a strong aside.) THE USER QUEUE layers on top: 'play next' pushes onto an explicit deque that next() drains BEFORE consulting the strategy — user intent strictly outranks algorithm — and the strategy's own cursor does not advance while the queue drains, so the playlist resumes where it left off. Queue-jumped tracks still enter HISTORY: previous is answered from a history STACK of what ACTUALLY played, in reverse order — never by re-asking the strategy (sequential could recompute previous; shuffle and queue-jumps cannot; the stack unifies all cases). Repeat modes compose cleanly as strategies: repeat-one returns current (the queue still outranks it — most products treat an explicit queue-next as overriding repeat-one; decide, document); repeat-all wraps the pass boundary instead of stopping. The layered decision order — user queue, then mode strategy, then stop — is the sentence to leave the interviewer with."),
      C("tradeoffs", "Trade-offs & extension points",
        "STATE HANDLING: State pattern objects (chosen — total-by-construction control matrix, new states are new classes, the async-event serialization point is explicit) vs a status enum + switches (fine at exactly 3 states; rots when Buffering/Error arrive — every switch in every method grows a case) vs a declarative transition TABLE (state × event -> action, great for tooling/validation; heavier than needed here, right for a 15-state media stack). NEXT-TRACK LOGIC: strategy objects (chosen — mode and state vary independently; stateful ShuffleStrategy owns its permutation) vs mode flags checked inside player methods (if-shuffle-else-if-repeat spaghetti that couples the two axes). SHUFFLE: pre-shuffled permutation walk (chosen — no repeats per pass, truthful previous via history, O(1) next) vs random-index-each-time (repeats, starvation, fake previous) vs lazily sampled without replacement (equivalent to the permutation with more bookkeeping). HISTORY: explicit stack of played tracks (chosen — the only approach that survives shuffle + queue-jumps) vs recomputing from the strategy (only works for sequential). QUEUE PRIORITY: user deque above strategy (chosen — intent beats algorithm) vs splicing queued tracks into the playlist (mutates shared data, breaks when the same playlist backs two players). Extension points an interviewer will probe: GAPLESS playback and crossfade (the engine pre-loads next() one track early — the queue API already supports peeking; a two-line addition), PODCASTS (resume position per track — state on a listening-progress record, not on Track), MULTI-DEVICE handoff (serialize player state: queue, position, mode — the model is already a value), COLLABORATIVE queues (the deque becomes shared state with ordering rules — a concurrency conversation), and RADIO/endless mode (a strategy that generates rather than selects — the seam absorbs it without touching the player)."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why the State pattern for three states?' — because the control × state matrix IS the spec: each cell (pause-while-stopped, play-while-paused) is a documented behavior on a state class rather than a branch someone forgot, and the real win appears when Buffering and Error arrive as classes instead of edits to every switch in the player. 'Why isn't shuffle part of PlayingState?' — mode and state are orthogonal axes: shuffle can be toggled while paused; folding them yields state×mode class products; State handles is-the-control-legal-now, Strategy handles what-comes-next. 'Your shuffle repeated a song — user files a bug?' — random-per-step shuffle is the bug; a Fisher-Yates permutation walked per pass plays each track once, reshuffles at the pass boundary (guarding against boundary back-to-back), and previous reads the actual-play history stack. 'What happens when a track ends by itself?' — the engine's completion callback enters the same serialized event intake as user controls (preventing the double-advance race with a simultaneous tap of next), asks the queue for next() — user deque first, then strategy — and either continues Playing or transitions to Stopped. 'Play-next queue with repeat-one on?' — layered decision order: explicit queue outranks the mode; after the queue drains, repeat-one resumes holding the current track. 'Pause vs stop?' — pause keeps decoder position and resources (resume continues); stop releases them (play restarts); modeling them as distinct states makes resume-vs-restart impossible to get wrong. 'How do you test the player without audio hardware?' — the AudioEngine is an injected port and every surface is an observer, so the whole state machine runs headless in tests — that separation was the point of the design."),
    ],
    "The music player is the friendliest venue for the two most-asked LLD patterns working in tandem: State for the control lifecycle (the play/pause/stop/next matrix, resume-vs-restart, buffering as the extension test) and Strategy for playback modes — with the explicit lesson that they solve ORTHOGONAL axes and folding them multiplies classes. Interviewers use it to check pattern judgment rather than pattern vocabulary: does shuffle live in a stateful strategy with a Fisher-Yates permutation and a real history stack, does the user queue outrank the algorithm, do engine callbacks and UI taps serialize into one event intake, and is the domain observable and headless-testable? It maps directly onto media-session APIs candidates will actually build against (Android MediaSession, AVFoundation), which makes shallow answers easy to spot.",
    [
      G("modes_as_flags", "Implementing shuffle/repeat as boolean flags checked inside the player's next() with nested ifs.", "Extract next-track selection into stateful PlaybackStrategy objects (shuffle owns its permutation and pass cursor); the player asks the queue, the queue asks the strategy — mode logic never touches state logic.", "if (shuffle) ... else if (repeatOne) ... chains in player methods; toggling modes mid-playback resets or corrupts position; shuffle state stored as loose player fields."),
      G("random_shuffle", "Shuffle as 'pick a random index each time', and previous as 'ask the strategy again'.", "Pre-shuffle a Fisher-Yates permutation and walk it (each track once per pass, reshuffle at the boundary); answer previous from a history stack of actually-played tracks — the only source that survives shuffle and queue-jumps.", "Same song plays twice in quick succession; some tracks never play in a session; previous under shuffle jumps to a random track instead of the one just heard."),
      G("ui_coupled_player", "Calling UI update methods (and the audio engine) directly from control logic, with engine callbacks mutating state unserialized.", "Emit observer events for track/state/progress and inject the engine as a port; funnel engine callbacks and user controls through one serialized intake so onTrackFinished cannot race a user's next into a double-advance.", "Player imports view classes; tests require mocking widgets; intermittent skipped-track bugs when a track ends exactly as the user taps next."),
    ],
    0.4, DIAG.music, "Music player class diagram"),

  // ───────────────────── RIDE-SHARING (UBER OOD) ────────────────────────────
  TT("lld_m11", "lld_m11_t2", 2, "Design Ride-Sharing (Uber OOD)", "design-ride-sharing-uber-ood",
    ["case-study", "state-machine", "strategy", "matching"],
    "A rider requests a car downtown at rush hour. Three hundred drivers are nearby, five other riders want the same corner, and the closest driver gets two trip offers in the same second — he must end up on exactly one. Then mid-trip the rider adds a stop, the fare must reprice, and either side may cancel with different consequences at each stage. How do you design Ride-Sharing (Uber OOD)?",
    "Center the model on TRIP as an explicit state machine (REQUESTED -> MATCHING -> ASSIGNED -> EN_ROUTE -> IN_PROGRESS -> COMPLETED, with CANCELLED reachable from most states under stage-specific rules), and make driver assignment an ATOMIC CLAIM — a compare-and-swap on Driver status from AVAILABLE to ON_TRIP — so two concurrent matches can never double-book one driver. Candidate search goes through a LOCATION INDEX (geohash/grid of driver positions), ranking is a pluggable MATCHING STRATEGY (nearest-ETA, rating-aware), pricing is a FARE STRATEGY (base + distance + time, surge as a multiplier decorator), and Observer pushes state changes to rider and driver apps.",
    [
      C("requirements", "Requirements",
        "Functional: RIDERS request trips (pickup, destination, vehicle class) and see an upfront fare estimate; the system MATCHES the request to a nearby available DRIVER (who may accept or decline within a timeout, cascading to the next candidate); both sides track the TRIP through its lifecycle — driver en route, arrived, trip started, trip completed; FARE is computed (base + distance + time, surge multiplier at high demand) and charged; either party may CANCEL, with stage-dependent rules (free before assignment, fee after the driver is en route, disallowed mid-trip in favor of early completion); both sides RATE each other afterward. Non-functional constraints that shape the OOD: the matching moment is CONTENTION-heavy — one driver may be the best candidate for several concurrent requests, and a driver must NEVER be assigned two trips (the atomic-claim requirement, this design's lost-update problem); driver locations update continuously, so 'nearby' needs an INDEX, not a scan over every driver; trip state transitions arrive from two different apps concurrently (driver taps 'start trip' as rider taps 'cancel') and must resolve deterministically; and money math must be exact and auditable. Clarify scope explicitly: this is the OOD variant — one service's object model, in-memory-first — not the distributed-systems variant (no Kafka, no supply-positioning ML); the interviewer wants entities, the trip state machine, atomic matching, and strategy seams, and volunteering that scope distinction is itself a signal."),
      C("entities", "Core entities & responsibilities",
        "RIDER and DRIVER share a User base (id, name, rating) but are distinct classes because their behavior diverges completely: Rider owns payment methods and trip requests; Driver owns a VEHICLE (class, plate, capacity), a live LOCATION, and — most importantly — a STATUS field (OFFLINE / AVAILABLE / OFFERED / ON_TRIP) which is the single cell of state the whole matching problem fights over. TRIP is the aggregate root and the system's spine: rider, driver (null until assigned), pickup/dropoff, its STATE, timestamps per transition (requested/assigned/started/completed — the audit trail and the input to fare time-components), the fare estimate and final fare. All lifecycle mutations go through Trip methods that validate legal transitions — no external setter ever writes trip.state. LOCATION is a value object (lat, lng, recordedAt). LOCATIONINDEX maintains driver positions in grid/geohash CELLS mapping cell -> set of driver ids, updated as drivers move (cheap: remove from old cell, add to new when the cell changes) and queried by 'candidates near P' as the union of P's cell and its 8 neighbors, ring-expanded until enough candidates — turning O(all drivers) scans into O(cell density). MATCHINGSTRATEGY ranks candidates (nearest straight-line is the baseline; nearest-ETA and acceptance-rate-aware are drop-ins). FARESTRATEGY computes money from trip facts; SURGEPRICING wraps a base fare strategy as a multiplier — a decorator, so surge composes with any vehicle class. TRIPOBSERVER pushes transitions to rider app, driver app, and receipts. RIDESERVICE orchestrates: create trip, query index, rank, run the OFFER protocol, and hold the atomic claim logic. Trip owns its lifecycle; Driver.status owns assignability; the service owns coordination between them — that three-way split is the design."),
      C("design", "Class design & patterns",
        "TRIP STATE MACHINE first, because everything else hangs off it: REQUESTED -> MATCHING (searching/offering) -> ASSIGNED (driver claimed) -> EN_ROUTE (driver heading to pickup) -> ARRIVED -> IN_PROGRESS -> COMPLETED, with CANCELLED entered from REQUESTED/MATCHING/ASSIGNED/EN_ROUTE under stage-specific policies (who pays what) and never from IN_PROGRESS. Encode legal transitions explicitly — either State-pattern classes per state or, leaner and defensible here, an enum plus a static allowed-transitions map consulted by one guarded transition(to) method that also stamps the timestamp and notifies observers; say why you chose the lighter mechanism (the states differ in ALLOWED TRANSITIONS more than in rich per-state behavior, which is the table's sweet spot — contrast with the auction, where behavior itself diverged per state). Concurrent conflicting transitions (driver taps start, rider taps cancel) serialize on the trip's monitor: first legal transition wins, the loser gets a precise TransitionRejected outcome to render ('trip already started — cancellation unavailable'). MATCHING as STRATEGY: rankCandidates(request, candidates) — nearest, ETA-weighted, rating-floor — swappable without touching the service; the OFFER protocol (offer to top candidate, await accept within T seconds, on decline/timeout cascade to the next) is service logic driving Driver.status through AVAILABLE -> OFFERED -> ON_TRIP/back. The ATOMIC CLAIM lives at that status flip: tryClaim is a synchronized compare-and-swap on the driver — two concurrent trips offering to the same driver race, exactly one CAS succeeds, the other request cascades to its next candidate; the DB translation is the same statement as an UPDATE ... WHERE status='AVAILABLE' guarded by affected-rows. FARE as STRATEGY + DECORATOR: RegularFare/PremiumFare compute base+distance×rate+time×rate from Trip timestamps; SurgeDecorator multiplies; estimates are computed from predicted distance/time, final fare from actuals, both through the same strategy so they cannot diverge in logic. OBSERVER for app pushes and receipts. BigDecimal (or integer cents) for all money — floating-point fares are an automatic red flag."),
      K("code", "Core classes (Java)",
`enum TripState { REQUESTED, MATCHING, ASSIGNED, EN_ROUTE, ARRIVED,
                 IN_PROGRESS, COMPLETED, CANCELLED }
enum DriverStatus { OFFLINE, AVAILABLE, OFFERED, ON_TRIP }

class Trip {
    private static final Map<TripState, Set<TripState>> LEGAL = Map.of(
        TripState.REQUESTED,   Set.of(TripState.MATCHING, TripState.CANCELLED),
        TripState.MATCHING,    Set.of(TripState.ASSIGNED, TripState.CANCELLED),
        TripState.ASSIGNED,    Set.of(TripState.EN_ROUTE, TripState.CANCELLED),
        TripState.EN_ROUTE,    Set.of(TripState.ARRIVED, TripState.CANCELLED),
        TripState.ARRIVED,     Set.of(TripState.IN_PROGRESS, TripState.CANCELLED),
        TripState.IN_PROGRESS, Set.of(TripState.COMPLETED),
        TripState.COMPLETED,   Set.of(),
        TripState.CANCELLED,   Set.of());

    final String id; final String riderId; volatile String driverId;
    private TripState state = TripState.REQUESTED;
    final Map<TripState, Instant> stamps = new EnumMap<>(TripState.class);
    private final List<TripObserver> observers = new CopyOnWriteArrayList<>();

    Trip(String id, String riderId) {
        this.id = id; this.riderId = riderId;
        stamps.put(TripState.REQUESTED, Instant.now());
    }
    synchronized void transition(TripState to) {
        if (!LEGAL.get(state).contains(to))
            throw new IllegalStateException(state + " -> " + to + " not allowed");
        state = to; stamps.put(to, Instant.now());
        observers.forEach(o -> o.onTransition(this, to));
    }
    synchronized TripState state() { return state; }
}

class Driver {
    final String id; volatile Location location;
    private DriverStatus status = DriverStatus.AVAILABLE;

    synchronized boolean tryClaim() {                  // atomic CAS on status
        if (status != DriverStatus.AVAILABLE) return false;
        status = DriverStatus.ON_TRIP; return true;
    }
    synchronized void release() { status = DriverStatus.AVAILABLE; }
    Driver(String id) { this.id = id; }
}

interface MatchingStrategy {
    List<Driver> rank(Location pickup, List<Driver> candidates);
}
class NearestDriverStrategy implements MatchingStrategy {
    public List<Driver> rank(Location p, List<Driver> cs) {
        cs.sort(Comparator.comparingDouble(d -> d.location.distanceTo(p)));
        return cs;
    }
}

interface FareStrategy { BigDecimal fare(double km, Duration time); }
class StandardFare implements FareStrategy {
    public BigDecimal fare(double km, Duration t) {
        return new BigDecimal("2.50")
            .add(BigDecimal.valueOf(km).multiply(new BigDecimal("1.20")))
            .add(BigDecimal.valueOf(t.toMinutes()).multiply(new BigDecimal("0.35")));
    }
}
class SurgeFare implements FareStrategy {              // decorator
    private final FareStrategy base; private final BigDecimal multiplier;
    SurgeFare(FareStrategy base, BigDecimal m) { this.base = base; this.multiplier = m; }
    public BigDecimal fare(double km, Duration t) {
        return base.fare(km, t).multiply(multiplier).setScale(2, RoundingMode.HALF_UP);
    }
}

class RideService {
    private final LocationIndex index; private final MatchingStrategy matcher;
    RideService(LocationIndex index, MatchingStrategy matcher) {
        this.index = index; this.matcher = matcher;
    }
    boolean assign(Trip trip, Location pickup) {
        trip.transition(TripState.MATCHING);
        for (Driver d : matcher.rank(pickup, index.nearby(pickup, 5))) {
            if (d.tryClaim()) {                        // exactly one trip wins d
                trip.driverId = d.id;
                trip.transition(TripState.ASSIGNED);
                return true;
            }                                          // lost the race: next
        }
        return false;                                  // widen radius / retry
    }
}

interface TripObserver { void onTransition(Trip t, TripState to); }`),
      C("deep_dive", "Deep dive: atomic driver claim & the offer protocol — the concurrency crux",
        "The bug this design exists to prevent: driver D is the nearest candidate for trips T1 and T2, both created in the same second. Both threads read D.status == AVAILABLE, both assign, D's app shows one trip and the backend believes another — a customer-visible catastrophe born of a textbook CHECK-THEN-ACT race. The repair is to make the claim a single atomic operation: tryClaim() checks and flips status under D's monitor (or one AtomicReference CAS), so of two racing trips exactly one observes AVAILABLE and wins; the loser's service loop simply advances to its next-ranked candidate — the failure mode costs a few hundred milliseconds of cascade, not a double-booking. Note the lock is PER DRIVER and held for nanoseconds; there is no global matching lock, and no thread ever holds two driver locks (claim one; on failure move on) so deadlock is structurally absent — the same reasoning pattern as the cache's segment locks, and worth drawing that connection aloud. The realistic protocol adds a human: drivers ACCEPT or DECLINE offers. That inserts an intermediate OFFERED status with a TIMEOUT: offer flips AVAILABLE -> OFFERED (atomically, so a driver holds at most one live offer — this also protects the driver from offer spam), accept flips OFFERED -> ON_TRIP, decline or a timer expiry flips back to AVAILABLE and the service cascades. The timeout expiry itself races the accept — driver taps accept at second 14.9, timer fires at 15.0 — and resolves the same way everything here resolves: both paths run the same guarded CAS on the OFFERED status, first legal flip wins, the loser becomes a no-op or a polite 'offer expired'. Sequential-cascade offering is the honest OOD baseline; name the alternatives — parallel offers (faster match, needs first-accept-wins CAS arbitration and annoys drivers who accept second) and batched matching (collect requests for ~2 seconds, solve assignment globally for total-ETA — what Uber actually does, a bipartite optimization) — as the evolution, not the starting point. In a database deployment the monitor becomes UPDATE drivers SET status='ON_TRIP' WHERE id=? AND status='AVAILABLE' with an affected-rows check — the invariant survives the technology swap, and saying so closes the loop."),
      C("deep_dive", "Deep dive: trip lifecycle, cancellation policy & fare mechanics",
        "The TRIP STATE MACHINE earns its explicitness in three places. First, CONFLICTING CONCURRENT TRANSITIONS: 'driver taps start trip' and 'rider taps cancel' can arrive in the same instant; because both route through the synchronized guarded transition() with a legality table, exactly one commits and the other receives a typed rejection to render — without the table you get races where a trip is simultaneously cancelled and in progress, and support tickets adjudicate. Second, CANCELLATION POLICY is stage-dependent business logic hung on the machine's edges: cancel from REQUESTED/MATCHING is free (nothing committed); from ASSIGNED/EN_ROUTE it triggers a fee (the driver committed time — compute from the assigned timestamp) and must RELEASE the driver (status back to AVAILABLE, re-enter the matchable pool — forgetting the release leaks drivers into phantom ON_TRIP status, a classic follow-up probe); from IN_PROGRESS cancellation is disallowed and the escape hatch is 'end trip early', which is COMPLETED with fare computed on actual distance/time so far. Timestamps per transition make every fee and dispute computable from the record. Third, DEGENERATE FLOWS fit as guarded transitions rather than special code paths: driver no-show (ARRIVED + rider unresponsive + timer -> CANCELLED with rider fee), driver cancel mid-EN_ROUTE (release + re-match the SAME trip: back to MATCHING, keeping the trip id and the rider's context — trips are re-matchable, requests are not re-created). FARE MECHANICS: the estimate shown at request time and the final fare must run through the SAME FareStrategy — estimate feeds predicted distance/duration, final feeds actuals from the trip's own timestamps and traveled path; one pricing brain, two inputs, so they cannot drift (separately-maintained estimate logic is how apps quote $18 and charge $31 with no explanation). SURGE as a decorator multiplies any base strategy, composing with vehicle class; the honest OOD treatment of surge DETECTION is a demand/supply ratio per geographic cell feeding the multiplier — the full dynamic-pricing system is out of scope, and scoping it crisply is better than faking it. Money is BigDecimal/integer-cents end to end; the fare is FROZEN onto the trip at completion (the receipt must not change if the strategy's rates change tomorrow) — persisted derived values beat re-derivation whenever the input (pricing config) is mutable."),
      C("tradeoffs", "Trade-offs & extension points",
        "STATE ENCODING: enum + explicit legal-transition table with one guarded synchronized transition() (chosen — the states differ mostly in allowed edges; the table is auditable at a glance and cheap to extend) vs full State-pattern classes (right when per-state BEHAVIOR is rich — as in the auction; here it would be eight classes wrapping a table) vs unguarded status setters (the disqualifier — concurrent driver/rider actions corrupt the lifecycle). CLAIM SHAPE: per-driver CAS with cascade-on-failure (chosen — no global lock, deadlock-free, loser pays milliseconds) vs locking the whole candidate list during matching (serializes all matching city-wide) vs optimistic assign-then-verify (assign both, detect, unwind one — a customer-visible double-offer window; never). OFFER MODEL: sequential timeout cascade (chosen for OOD honesty) vs parallel offers with first-accept CAS (faster, spammy) vs batched global assignment over a time window (best system-wide ETAs — the real-world evolution; a bipartite matching problem, name it). LOCATION INDEX: grid/geohash cells with neighbor-ring queries (chosen — O(1) update on cell change, query cost proportional to local density, trivially correct) vs quadtree/k-d structures (adaptive density, more code — the upgrade when cells skew) vs scanning all drivers (the naive tell). FARE: strategy + surge decorator with frozen final fares (chosen) vs inline pricing math (untestable, estimate/final drift). Extension points to anticipate: POOLING/shared rides (Trip gains multiple riders and an ordered stop list — the state machine sprouts per-leg sub-states; the biggest structural stretch, good to sketch), SCHEDULED rides (a future-dated REQUESTED plus a trigger), vehicle classes (already strategy inputs), driver DESTINATION MODE (a matching-strategy filter), rating/feedback (post-COMPLETED records feeding the matcher), and the distributed evolution — index sharded by city cell, driver status CAS moving into the datastore, trip events onto a stream — each mapping one-to-one onto an object seam already present, which is the argument that the OOD was factored correctly."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Two trips match the same driver simultaneously?' — the claim is an atomic check-and-flip on Driver.status (monitor or CAS); exactly one trip wins, the loser cascades to its next candidate; in a DB it is the affected-rows-checked conditional UPDATE — the invariant, not the mechanism, is the answer. 'Driver taps start as rider taps cancel?' — both route through the trip's single guarded transition() with a legality table; first commit wins, the other side gets a typed rejection; no cell of the state × action matrix is undefined. 'How do you find nearby drivers without scanning everyone?' — a grid/geohash index: cell -> driver set, updated on cell-crossing, queried by expanding neighbor rings until enough candidates; quadtrees are the density-adaptive upgrade. 'Driver ignores the offer?' — OFFERED is a real status with a timer; expiry and accept race through the same CAS, first flip wins, expiry releases the driver and cascades the trip. 'Rider cancels after the driver drove 5 minutes?' — stage-dependent policy read off the state machine: fee computed from the ASSIGNED timestamp, driver released back to AVAILABLE (the leak to probe), trip terminally CANCELLED. 'Why does the estimate match the receipt logic?' — one FareStrategy, two inputs (predicted vs actual distance/time), surge as a decorator on both; the final fare freezes onto the trip so rate changes never rewrite history. 'Scale it to a city?' — every seam survives: the index shards by geography, the driver CAS moves into the store, trip transitions become events; and batched bipartite matching replaces the sequential cascade — the OOD's boundaries are exactly the distribution boundaries, which is what a well-factored model buys you."),
    ],
    "Uber OOD is the standard-bearer for 'object design with a real concurrency kernel': the graded moments are the trip state machine (explicit legal transitions, conflicting driver/rider actions resolving deterministically, stage-dependent cancellation) and the atomic driver claim (the check-then-act race on Driver.status, CAS with cascade, the OFFERED-timeout race), wrapped in clean strategy seams for matching and fares plus a location index that avoids the scan-all-drivers tell. It doubles as a scope-discipline test — candidates who drift into Kafka-and-microservices instead of the object model fail the brief — and its mechanisms (guarded transitions, conditional-update claims, strategy/decorator pricing with frozen derived values) transfer verbatim to food delivery, field-service dispatch, and any assign-scarce-resource-under-contention domain.",
    [
      G("check_then_assign", "Checking driver.status == AVAILABLE and then assigning as two separate steps.", "Make the claim one atomic operation — a synchronized/CAS tryClaim flipping AVAILABLE -> ON_TRIP (DB: conditional UPDATE checked by affected rows); racing trips get exactly one winner and losers cascade to the next candidate.", "Read of status and the write that changes it are separated by other code (or a network hop); load tests show one driver on two trips; no affected-rows check on the assignment update."),
      G("settable_trip_status", "Modeling the trip lifecycle as a status field with public setters that any code path writes.", "Route every change through one guarded transition(to) validating against an explicit legal-transition map, stamping timestamps and notifying observers — concurrent driver/rider actions then serialize with a deterministic winner and a typed rejection.", "trip.setStatus(...) calls scattered across services; a trip reaches CANCELLED after IN_PROGRESS; cancellations mid-race leave the driver stuck ON_TRIP with no release."),
      G("scan_all_drivers", "Finding the nearest driver by computing distance to every driver in the system per request.", "Maintain a grid/geohash location index (cell -> drivers, updated on cell change) and query expanding neighbor rings; ranking over the small candidate set is then the pluggable MatchingStrategy's job.", "for (Driver d : allDrivers) distance(...) in the hot path; matching latency grows linearly with the driver population; no spatial structure anywhere in the model."),
    ],
    0.5, DIAG.uber, "Ride-sharing OOD class diagram"),
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
  // Auction
  pm("lld_m10", { topicId: "lld_m10_t5", exerciseId: "lld_m10_t5_pm_d1", position: 11, level: "hard",
    title: "Two bids, one millisecond", scenario: "Bids of $105 and $110 hit a $100 auction concurrently. How is the winner determined correctly?",
    options: ["Serialize placeBid per auction; validate INSIDE the critical section and assign a monotonic sequence number under the lock", "Compare bid timestamps and keep the earlier one", "Accept both and let the higher amount win at close", "Use a global lock across all auctions"],
    correct: "Serialize placeBid per auction; validate INSIDE the critical section and assign a monotonic sequence number under the lock",
    explanation: "Validation and append must be atomic against the same state or both racers validate against the stale high (lost update); the in-lock sequence — not the timestamp — is the authoritative order." }),
  pm("lld_m10", { topicId: "lld_m10_t5", exerciseId: "lld_m10_t5_pm_d2", position: 12, level: "hard",
    title: "Proxy vs snipe", scenario: "A sniper bids $120 at T-minus-2s against a stored proxy max of $200. What happens?",
    options: ["Inside the same critical section the proxy counter-bids $120 + increment; one anti-snipe extension covers it since the counter is instantaneous", "A background proxy agent notices the outbid and responds within a few seconds", "The auction extends repeatedly while the proxy and sniper trade bids", "The sniper wins because the proxy max is secret"],
    correct: "Inside the same critical section the proxy counter-bids $120 + increment; one anti-snipe extension covers it since the counter is instantaneous",
    explanation: "Proxy resolution runs synchronously in the triggering bid's critical section — a reactive agent leaves a wrong-winner window, and the in-lock counter means a snipe against a proxy costs at most one deadline extension." }),
  pm("lld_m10", { topicId: "lld_m10_t5", exerciseId: "lld_m10_t5_pm_d3", position: 13, level: "medium",
    title: "State, not status", scenario: "Why model the auction lifecycle with State-pattern objects instead of a status enum plus if-checks?",
    options: ["Behavior differs per state and delegation makes forgotten status checks structurally impossible — a closed auction simply has no bid-accepting code path", "State objects are faster than enum comparisons", "Enums cannot represent four states", "The State pattern is required for Observer to work"],
    correct: "Behavior differs per state and delegation makes forgotten status checks structurally impossible — a closed auction simply has no bid-accepting code path",
    explanation: "With an enum, every method needs a correct if-ladder and one missed branch accepts a bid after close; delegating to state objects makes illegal operations unrepresentable rather than merely checked." }),
  // Calendar
  pm("lld_m10", { topicId: "lld_m10_t6", exerciseId: "lld_m10_t6_pm_d1", position: 11, level: "hard",
    title: "Move one standup", scenario: "A user drags next Tuesday's instance of a daily 9:30 standup to 10:00. What is stored?",
    options: ["One EventException keyed by (seriesId, original Tue-9:30 start) holding the override; expansion swaps it in — the rule stays untouched", "Tuesday's occurrence row is updated in the occurrences table", "The series is forked into two events at Tuesday", "A new one-off event is created and Tuesday's slot hidden client-side"],
    correct: "One EventException keyed by (seriesId, original Tue-9:30 start) holding the override; expansion swaps it in — the rule stays untouched",
    explanation: "The rule keeps generating Tue-9:30 forever, so the override must be addressed by the occurrence it replaces; deletion likewise needs a durable cancelled tombstone, not mere absence." }),
  pm("lld_m10", { topicId: "lld_m10_t6", exerciseId: "lld_m10_t6_pm_d2", position: 12, level: "medium",
    title: "Back-to-back meetings", scenario: "Meetings 10:00-11:00 and 11:00-12:00 — does your conflict detector flag them?",
    options: ["No — intervals are half-open and overlap iff s1 < e2 AND s2 < e1, so touching endpoints never conflict", "Yes — they share the 11:00 boundary", "Only if they are on the same calendar", "Only if both are recurring"],
    correct: "No — intervals are half-open and overlap iff s1 < e2 AND s2 < e1, so touching endpoints never conflict",
    explanation: "Using <= (closed intervals) flags every adjacent pair — the single most common overlap bug; the half-open predicate on UTC instants is the exact answer interviewers listen for." }),
  pm("lld_m10", { topicId: "lld_m10_t6", exerciseId: "lld_m10_t6_pm_d3", position: 13, level: "hard",
    title: "The November drift", scenario: "A 9:30 daily standup in New York renders at 8:30 after the DST change. What was the bug?",
    options: ["Occurrences were stepped in UTC by fixed 24h; recurrence must step in the event's local zone (store UTC + zone id, expand locally, convert at display)", "The client cached stale occurrences", "The rule's UNTIL date was wrong", "The server clock skewed an hour"],
    correct: "Occurrences were stepped in UTC by fixed 24h; recurrence must step in the event's local zone (store UTC + zone id, expand locally, convert at display)",
    explanation: "'9:30 local every day' is not a fixed UTC offset across a DST boundary — pure-UTC stepping drifts local-time events an hour for half the year; zone-aware stepping keeps 9:30 at 9:30." }),
  // Text editor
  pm("lld_m10", { topicId: "lld_m10_t7", exerciseId: "lld_m10_t7_pm_d1", position: 11, level: "hard",
    title: "Command vs Memento", scenario: "Why is per-keystroke undo built on Commands with inverses rather than document snapshots?",
    options: ["An inverse-carrying command is O(edit) in memory and time while a snapshot is O(document) — untenable at large file sizes; keep a tiny memento only for the caret", "Commands are easier to serialize than snapshots", "Memento cannot support redo", "Snapshots break the Observer pattern"],
    correct: "An inverse-carrying command is O(edit) in memory and time while a snapshot is O(document) — untenable at large file sizes; keep a tiny memento only for the caret",
    explanation: "The arithmetic decides it: snapshotting 200 MB per keystroke is dead on arrival, while an InsertCommand is bytes; Memento survives only for small gnarly state like cursor/selection." }),
  pm("lld_m10", { topicId: "lld_m10_t7", exerciseId: "lld_m10_t7_pm_d2", position: 12, level: "hard",
    title: "Undo, undo, type", scenario: "After two undos the user types a character. What happens to the redo stack, and why?",
    options: ["It is cleared — redo commands are position-based deltas pinned to a timeline that no longer exists; replaying them would edit at stale offsets", "It is preserved so the user can still redo", "It is merged into the undo stack", "Only its top entry is discarded"],
    correct: "It is cleared — redo commands are position-based deltas pinned to a timeline that no longer exists; replaying them would edit at stale offsets",
    explanation: "Commands are only valid against the exact state they were recorded on; after a divergent edit the old redo branch is unsound — unless you upgrade to an explicit undo tree like Vim's." }),
  pm("lld_m10", { topicId: "lld_m10_t7", exerciseId: "lld_m10_t7_pm_d3", position: 13, level: "medium",
    title: "Where deleted text lives", scenario: "How does a DeleteCommand know what text to restore on undo?",
    options: ["It captures the removed text at EXECUTE time (delete returns it); with a piece table this is nearly free since buffers are append-only and never erased", "It recomputes the text from the document's current state", "It stores the whole document before deleting", "The clipboard retains it"],
    correct: "It captures the removed text at EXECUTE time (delete returns it); with a piece table this is nearly free since buffers are append-only and never erased",
    explanation: "The inverse of a delete is unknowable at construction — it must be observed as the command runs; the piece table's append-only buffers mean 'captured' text is just a retained span reference." }),
  // Concurrent cache
  pm("lld_m10", { topicId: "lld_m10_t8", exerciseId: "lld_m10_t8_pm_d1", position: 11, level: "hard",
    title: "The read that writes", scenario: "Why does a ReadWriteLock fail to speed up a concurrent LRU cache?",
    options: ["Every get() mutates the recency list, so all operations need the exclusive lock — stripe into segments (each lock covering its map AND list) instead", "ReadWriteLocks are slower than synchronized", "LRU caches cannot use locks at all", "Readers would starve the writers"],
    correct: "Every get() mutates the recency list, so all operations need the exclusive lock — stripe into segments (each lock covering its map AND list) instead",
    explanation: "LRU turns reads into writes, nullifying shared-mode locking; the lock must cover the whole invariant (map + list together), which is exactly what per-segment striping scopes." }),
  pm("lld_m10", { topicId: "lld_m10_t8", exerciseId: "lld_m10_t8_pm_d2", position: 12, level: "hard",
    title: "Forty simultaneous misses", scenario: "A hot key expires and 40 threads miss at once. How does exactly one loader call happen?",
    options: ["Store a future as the map value via atomic computeIfAbsent — one thread creates it and loads (outside any segment lock); the rest await the same future; remove it on failure", "First thread sets a boolean flag; others spin until it clears", "Synchronize the entire get path during loads", "Let all 40 load and keep the last result"],
    correct: "Store a future as the map value via atomic computeIfAbsent — one thread creates it and loads (outside any segment lock); the rest await the same future; remove it on failure",
    explanation: "computeIfAbsent's atomicity makes inserting the future the claim; loading outside the lock keeps the segment live, and evicting the future on failure prevents accidentally caching the exception forever." }),
  pm("lld_m10", { topicId: "lld_m10_t8", exerciseId: "lld_m10_t8_pm_d3", position: 13, level: "medium",
    title: "Approximate LRU", scenario: "Striping makes eviction per-segment, so global LRU is only approximate. Acceptable?",
    options: ["Yes — eviction is a heuristic and a wrong eviction costs only a miss; the approximation is the price of near-linear concurrency", "No — strict global LRU must be restored with a global lock", "No — switch to FIFO which is always exact", "Only if segments rebalance entries continuously"],
    correct: "Yes — eviction is a heuristic and a wrong eviction costs only a miss; the approximation is the price of near-linear concurrency",
    explanation: "A cache is allowed to be wrong about which entry dies — correctness is unaffected, hit rate barely moves with good hash spreading, and the alternative reintroduces the global bottleneck." }),
  // Music player
  pm("lld_m11", { topicId: "lld_m11_t1", exerciseId: "lld_m11_t1_pm_d1", position: 11, level: "medium",
    title: "Two patterns, two axes", scenario: "Why do State (Playing/Paused) and Strategy (shuffle/repeat) both appear in the player instead of one pattern handling everything?",
    options: ["Playback state and playback mode vary independently — folding them yields state-times-mode class products; State governs control legality now, Strategy governs what plays next", "Strategy is deprecated so State must wrap it", "Observer requires both to be present", "Shuffle needs its own thread"],
    correct: "Playback state and playback mode vary independently — folding them yields state-times-mode class products; State governs control legality now, Strategy governs what plays next",
    explanation: "You can toggle shuffle while paused: two orthogonal axes demand two orthogonal seams — the combinatorial-explosion argument is the design's thesis sentence." }),
  pm("lld_m11", { topicId: "lld_m11_t1", exerciseId: "lld_m11_t1_pm_d2", position: 12, level: "hard",
    title: "Shuffle that never repeats", scenario: "Users report shuffle 'is broken — it repeated a song after two minutes'. What is the correct mechanism?",
    options: ["A Fisher-Yates-shuffled permutation walked with an index — every track once per pass, reshuffle at the pass boundary; previous reads a history stack of actually-played tracks", "Pick a uniformly random index on every next()", "Sort tracks by a random key once at startup and loop", "Exclude the last 5 played tracks from random selection"],
    correct: "A Fisher-Yates-shuffled permutation walked with an index — every track once per pass, reshuffle at the pass boundary; previous reads a history stack of actually-played tracks",
    explanation: "Random-per-step repeats and starves tracks and cannot answer previous truthfully; a permutation pass guarantees no repeats, and the history stack is the only previous that survives shuffle plus queue-jumps." }),
  pm("lld_m11", { topicId: "lld_m11_t1", exerciseId: "lld_m11_t1_pm_d3", position: 13, level: "hard",
    title: "Track ends as user taps next", scenario: "The engine's onTrackFinished fires on the audio thread while the user taps next on the UI thread. How is the double-advance prevented?",
    options: ["Both engine callbacks and user controls funnel through one serialized event intake into the state machine — first event advances, the second sees the new state", "The UI thread always wins", "Debounce the next button for 500ms", "Advance twice and skip a track — it is rare enough"],
    correct: "Both engine callbacks and user controls funnel through one serialized event intake into the state machine — first event advances, the second sees the new state",
    explanation: "Two async sources mutating playback state is a race; single-threading the state machine's intake is the simple correct fix, and noticing the race at all is the senior signal." }),
  // Ride-sharing
  pm("lld_m11", { topicId: "lld_m11_t2", exerciseId: "lld_m11_t2_pm_d1", position: 11, level: "hard",
    title: "One driver, two trips", scenario: "Driver D is the top candidate for two concurrent requests. How is double-booking made impossible?",
    options: ["Assignment is an atomic tryClaim CAS flipping AVAILABLE -> ON_TRIP; exactly one trip wins, the loser cascades to its next candidate (DB: conditional UPDATE + affected-rows check)", "Check status == AVAILABLE, then assign in a second step", "Lock the entire driver pool during each match", "Assign both and cancel one when the driver notices"],
    correct: "Assignment is an atomic tryClaim CAS flipping AVAILABLE -> ON_TRIP; exactly one trip wins, the loser cascades to its next candidate (DB: conditional UPDATE + affected-rows check)",
    explanation: "Check-then-act across two steps is the lost-update race; folding check and flip into one atomic operation per driver gives exactly one winner with no global lock and no deadlock." }),
  pm("lld_m11", { topicId: "lld_m11_t2", exerciseId: "lld_m11_t2_pm_d2", position: 12, level: "hard",
    title: "Start vs cancel", scenario: "The driver taps 'start trip' at the same instant the rider taps 'cancel'. What resolves it?",
    options: ["One guarded synchronized transition(to) validating against an explicit legal-transition table — the first commit wins and the loser gets a typed rejection", "Cancellation always beats start", "The trip enters both states and support sorts it out", "Whichever request has the earlier client timestamp wins"],
    correct: "One guarded synchronized transition(to) validating against an explicit legal-transition table — the first commit wins and the loser gets a typed rejection",
    explanation: "Concurrent conflicting transitions serialize on the trip's single mutation path; with public status setters instead, the trip ends up simultaneously cancelled and in progress." }),
  pm("lld_m11", { topicId: "lld_m11_t2", exerciseId: "lld_m11_t2_pm_d3", position: 13, level: "medium",
    title: "Nearby without a scan", scenario: "How does matching find candidate drivers without computing distance to every driver in the city?",
    options: ["A grid/geohash location index (cell -> driver set, updated on cell crossings) queried by expanding neighbor rings until enough candidates; the MatchingStrategy ranks that small set", "Sort all drivers by distance on every request", "Keep drivers in a global list ordered by last update", "Ask each driver's app whether it is close"],
    correct: "A grid/geohash location index (cell -> driver set, updated on cell crossings) queried by expanding neighbor rings until enough candidates; the MatchingStrategy ranks that small set",
    explanation: "Spatial cells make updates O(1) on cell change and queries proportional to local density instead of fleet size; ranking stays a pluggable strategy over the candidate set." }),
];

// ── upsert + recompute ──────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const moduleIds = [...new Set(TOPICS.map((t) => t.moduleId))];
  for (const mid of moduleIds) {
    const m = await ProModule.findOne({ trackKey: TRACK_KEY, moduleId: mid }).lean();
    if (!m) throw new Error(`Module ${mid} not found — run the base LLD seeds first.`);
  }
  let tUp = 0, eUp = 0;
  for (const t of TOPICS) { await ProTopic.updateOne({ trackKey: TRACK_KEY, topicId: t.topicId }, { $set: t }, { upsert: true }); tUp++; }
  for (const e of EXERCISES) { await ProExercise.updateOne({ trackKey: TRACK_KEY, exerciseId: e.exerciseId }, { $set: e }, { upsert: true }); eUp++; }
  const totals = await recomputeTrackTotals(TRACK_KEY);
  console.log(`✓ LLD depth batch 2 seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
