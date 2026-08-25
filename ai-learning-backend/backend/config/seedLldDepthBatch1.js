/**
 * Seed — LLD DEPTH batch 1 (LLD_DEPTH_STANDARD.md).
 *
 *   lld_m1_t10  Case Study — Design a Parking Lot        (module lld_m1)
 *   lld_m1_t11  Case Study — Design an LRU Cache          (module lld_m1)
 *   lld_m10_t1  Design a Hotel Booking System             (module lld_m10)
 *   lld_m10_t2  Design a Food Delivery System             (module lld_m10)
 *   lld_m10_t3  Design a Digital Wallet                   (module lld_m10)
 *   lld_m10_t4  Design a Deck of Cards (Card Game)        (module lld_m10)
 *
 * Verify: node config/auditLldDepth.mjs --require lld_m1_t10,lld_m1_t11,lld_m10_t1,lld_m10_t2,lld_m10_t3,lld_m10_t4
 * Usage:  node config/seedLldDepthBatch1.js  ·  npm run seed:lld-depth-1
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
  parking: svg(840, 250,
    box(20, 30, 150, 56, "ParkingLot", "facade: park / unpark", "#ede9fe") +
    box(230, 30, 150, 56, "ParkingFloor", "per-type free sets", "#eff6ff") +
    box(440, 30, 150, 56, "ParkingSpot", "type + occupied flag", "#eff6ff") +
    box(230, 150, 170, 56, "SpotAllocationStrategy", "interface: findSpot", "#fef9c3") +
    box(440, 150, 150, 56, "PricingStrategy", "interface: fee(ticket)", "#fef9c3") +
    box(640, 30, 160, 56, "Ticket", "spot + entry/exit time", "#fce7f3") +
    box(640, 150, 160, 56, "Vehicle", "type: bike/car/truck", "#f0fdf4") +
    arrow(170, 58, 230, 58, "has 1..*") + arrow(380, 58, 440, 58, "has 1..*") +
    arrow(590, 58, 640, 58, "issued for") +
    arrow(150, 86, 250, 150, "uses", true) + arrow(170, 86, 460, 150, "uses", true) +
    arrow(700, 150, 700, 86, "identified by") +
    note(420, 238, "ParkingLot delegates WHERE to park (SpotAllocationStrategy) and WHAT to charge (PricingStrategy); Ticket binds a Vehicle to a Spot with timestamps — both strategies swap without touching the lot")),
  lru: svg(840, 250,
    box(20, 40, 160, 56, "LRUCache<K,V>", "get / put, O(1) both", "#ede9fe") +
    box(250, 40, 170, 56, "HashMap<K,Node>", "key -> node in O(1)", "#fef9c3") +
    box(490, 40, 140, 56, "Node", "key, value, prev, next", "#eff6ff") +
    box(250, 160, 140, 50, "head (sentinel)", "MRU end", "#fce7f3") +
    box(490, 160, 140, 50, "tail (sentinel)", "LRU end — evict here", "#fce7f3") +
    box(680, 40, 140, 56, "Eviction", "unlink tail.prev", "#f0fdf4") +
    arrow(180, 68, 250, 68, "owns") + arrow(420, 68, 490, 68, "points to") +
    arrow(390, 185, 490, 185, "prev/next chain") +
    arrow(560, 96, 560, 160, "recency order", true) + arrow(630, 68, 680, 68, "on overflow") +
    note(420, 238, "Two structures, one invariant: every key is in the map IFF its node is in the doubly linked list; map gives O(1) lookup, DLL gives O(1) reorder + O(1) eviction at the tail sentinel")),
  hotel: svg(840, 250,
    box(20, 30, 140, 56, "Hotel", "floors, room types", "#ede9fe") +
    box(220, 30, 150, 56, "RoomType", "DELUXE x 40 rooms", "#eff6ff") +
    box(430, 30, 170, 56, "InventoryCalendar", "(type, date) -> booked", "#fef9c3") +
    box(220, 150, 150, 56, "Room", "physical unit 304", "#f0fdf4") +
    box(430, 150, 170, 56, "Reservation", "state machine + dates", "#fce7f3") +
    box(660, 30, 150, 56, "Guest", "profile, payment", "#f0fdf4") +
    box(660, 150, 150, 56, "PaymentService", "charge / refund", "#eff6ff") +
    arrow(160, 58, 220, 58, "has 1..*") + arrow(370, 58, 430, 58, "counted in") +
    arrow(295, 86, 295, 150, "has 1..*") +
    arrow(430, 178, 370, 178, "assigned at check-in", true) +
    arrow(660, 66, 600, 170, "makes") + arrow(600, 190, 660, 190, "settles via") +
    note(420, 238, "Reservations book a ROOM TYPE against a per-date inventory calendar (counts, not rooms); the physical Room is assigned only at check-in — the count-based model is what makes overbooking control possible")),
  food: svg(840, 250,
    box(20, 30, 140, 56, "Customer", "cart -> order", "#ede9fe") +
    box(220, 30, 150, 70, "Order", "state machine core", "#fce7f3") +
    box(430, 30, 160, 56, "Restaurant", "menu, accept/reject", "#eff6ff") +
    box(220, 160, 170, 56, "AssignmentStrategy", "interface: pick agent", "#fef9c3") +
    box(440, 160, 150, 56, "DeliveryAgent", "atomic busy flag", "#f0fdf4") +
    box(650, 30, 160, 56, "OrderObserver", "interface: onStatus", "#fef9c3") +
    box(650, 160, 160, 56, "NotificationService", "push / SMS listeners", "#eff6ff") +
    arrow(160, 58, 220, 58, "places") + arrow(370, 58, 430, 58, "prepared by") +
    arrow(295, 100, 295, 160, "uses", true) + arrow(390, 190, 440, 190, "assigns") +
    arrow(370, 45, 650, 45, "notifies 0..*") + arrow(730, 86, 730, 160, "implements", true) +
    note(420, 238, "Order is a guarded state machine (each transition has an allowed actor); observers decouple notifications from transitions; AssignmentStrategy + an atomic per-agent flag prevent double-dispatch")),
  wallet: svg(840, 250,
    box(20, 30, 140, 56, "User", "KYC identity", "#ede9fe") +
    box(220, 30, 150, 56, "Account", "balance (long cents)", "#eff6ff") +
    box(430, 30, 170, 56, "WalletService", "transfer w/ lock order", "#fce7f3") +
    box(220, 160, 170, 56, "LedgerEntry", "immutable, append-only", "#fef9c3") +
    box(440, 160, 160, 56, "Transaction", "PENDING -> SUCCESS", "#f0fdf4") +
    box(660, 30, 150, 56, "IdempotencyStore", "requestId -> txn", "#fef9c3") +
    box(660, 160, 150, 56, "ExternalGateway", "bank / UPI rails", "#eff6ff") +
    arrow(160, 58, 220, 58, "owns 1..*") + arrow(370, 58, 430, 58, "debits/credits") +
    arrow(600, 58, 660, 58, "checks first") +
    arrow(305, 86, 305, 160, "explained by 2..*") + arrow(520, 86, 520, 160, "creates") +
    arrow(600, 190, 660, 190, "settles via", true) +
    note(420, 238, "Balance is DERIVED: every transfer appends a balanced pair of ledger entries (debit + credit) inside one atomic unit; locks are taken in global account-id order and every mutation is idempotency-keyed")),
  cards: svg(840, 250,
    box(20, 30, 130, 56, "Card", "immutable Suit+Rank", "#ede9fe") +
    box(210, 30, 130, 56, "Deck", "52 cards, deal()", "#eff6ff") +
    box(400, 30, 170, 56, "ShuffleStrategy", "Fisher-Yates + Random", "#fef9c3") +
    box(210, 160, 130, 56, "Hand", "cards held", "#f0fdf4") +
    box(400, 160, 170, 56, "Game (abstract)", "template: play loop", "#fce7f3") +
    box(630, 160, 170, 56, "BlackjackGame", "soft-ace hand value", "#eff6ff") +
    box(630, 30, 170, 56, "Comparator<Card>", "per-game rank order", "#fef9c3") +
    arrow(150, 58, 210, 58, "52x") + arrow(340, 58, 400, 58, "shuffled by", true) +
    arrow(275, 86, 275, 160, "deals to") + arrow(400, 188, 340, 188, "owns hands") +
    arrow(570, 188, 630, 188, "extends") + arrow(630, 66, 570, 170, "injected", true) +
    note(420, 238, "Generic Card/Deck/Hand know NOTHING about any game; rank ordering is an injected Comparator and rules live in Game subclasses — the separation is the whole design lesson")),
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
  // ───────────────────────── PARKING LOT ─────────────────────────────────────
  TT("lld_m1", "lld_m1_t10", 10, "Case Study — Design a Parking Lot", "design-parking-lot",
    ["case-study", "strategy-pattern", "concurrency"],
    "A four-floor lot has small, medium, and large spots; motorcycles, cars, and trucks arrive at three entry gates simultaneously; drivers want the nearest spot; the operator wants hourly slab pricing today and weekend surge pricing next month. Two cars at two gates are racing for the last car spot RIGHT NOW. How do you design a Parking Lot?",
    "Model the lot as ParkingLot -> ParkingFloor -> ParkingSpot with VehicleType/SpotType enums and a fits() compatibility rule; pull the two volatile decisions — WHERE to park and WHAT to charge — into SpotAllocationStrategy and PricingStrategy interfaces (Strategy pattern); make a Ticket the object that binds vehicle, spot, and entry time; and win the last-spot race with an atomic tryOccupy() on the spot itself so allocation is correct across concurrent gates.",
    [
      C("requirements", "Requirements",
        "Functional: the lot has multiple FLOORS, each with spots of several SIZES (small/medium/large); vehicles of several TYPES (motorcycle, car, truck) arrive and each type may only use compatible spot sizes — a motorcycle fits anywhere, a car needs medium or large, a truck only large. On entry the system finds a suitable free spot (prefer NEAREST to the entrance), issues a TICKET recording vehicle, spot, and entry time, and marks the spot occupied. On exit it computes the FEE from the ticket (hourly slabs, per vehicle type), takes payment, frees the spot, and closes the ticket. Display boards show free-spot counts per type per floor. Constraints that shape the design: MULTIPLE ENTRY/EXIT GATES operate CONCURRENTLY, so two gates can race for the last compatible spot — allocation must never double-assign; the PRICING scheme will change (flat, hourly slab, day pass, surge), so it must be swappable without touching allocation code; the ALLOCATION policy will change too (nearest-first, fill-lower-floors-first, spread-evenly for EV charging) — same requirement; capacity per type is finite and 'lot full for trucks' must be answerable in O(1). Explicitly out of scope in a 45-minute interview (say so out loud): license-plate recognition hardware, online reservation, and multi-lot federation — but the design should not paint them out. The two hard problems you are really being asked to solve: a CORRECT CONCURRENT SPOT ALLOCATOR, and a TICKET/PRICING LIFECYCLE that keeps policy out of the domain objects."),
      C("entities", "Core entities & responsibilities",
        "VEHICLE — a value-ish object: plate number + VehicleType enum. It carries no behavior about parking; keeping it dumb avoids the classic mistake of asking a vehicle to find its own spot. PARKINGSPOT — the unit of contention: id, SpotType, floor, distance-from-entry, and an occupied flag; it owns exactly two behaviors: fits(vehicleType) (the compatibility rule lives HERE, in one place) and an atomic tryOccupy()/release() pair — the spot is the lock, which is what makes multi-gate concurrency tractable. PARKINGFLOOR — owns its spots, organized as per-SpotType FREE SETS ordered by distance (a TreeSet per type), so 'nearest free car spot on this floor' is O(log n), and free counts per type are O(1) for display boards. TICKET — the transaction record: ticket id, plate, vehicle type, the assigned spot, entryTime, exitTime; it is the input to pricing and the handle for exit — the ticket, not the vehicle, is what the system tracks between entry and exit. PARKINGLOT — the FACADE and composition root: holds floors, the active-ticket map, and the two strategies; exposes parkVehicle() and unpark(); contains NO policy itself. SPOTALLOCATIONSTRATEGY — interface: given a vehicle type and the floors, return a claimed spot or empty. PRICINGSTRATEGY — interface: given a closed ticket, return the fee. GATE (entry/exit) — thin boundary objects that call the facade; they matter mostly as a reminder that many of them run in parallel. Responsibility test an interviewer applies: 'where does the rule that trucks need large spots live?' — one place, ParkingSpot.fits(). 'Where does surge pricing go?' — a new PricingStrategy, zero other edits."),
      C("design", "Class design & patterns",
        "The skeleton is composition: ParkingLot has 1..* ParkingFloor has 1..* ParkingSpot; Ticket references one Vehicle (by plate/type) and one ParkingSpot. Three patterns earn their place — and you should justify each, not recite them. STRATEGY (twice): SpotAllocationStrategy and PricingStrategy isolate the two axes the requirements said WILL change. NearestFirstStrategy scans floors in order asking each floor for its nearest compatible spot; a FillFloorStrategy or EvSpreadStrategy is a drop-in replacement. HourlySlabPricing computes ceil-hours times a per-vehicle-type rate; SurgePricing wraps another PricingStrategy and multiplies — note that wrapping a strategy is DECORATOR, a nice combo to mention. FACTORY: a small SpotFactory/VehicleFactory keeps enum-to-class construction in one place if you model subclasses; with enums + fits() you may not need class hierarchies at all — saying 'I model vehicle differences as an enum plus one compatibility function, not an inheritance tree, because they differ in DATA not BEHAVIOR' is a senior move that trims the design. SINGLETON: the ParkingLot per physical lot is a de-facto singleton; prefer injecting one instance over a global getInstance() — testability beats dogma, and interviewers respect you flagging that. What is deliberately ABSENT: no Observer for display boards (a per-floor AtomicInteger count read on demand is simpler; add Observer only if boards must push updates), no abstract Vehicle hierarchy with empty subclasses, no premature Gate classes with logic. The dependency direction is the point of the diagram: ParkingLot depends on the two strategy INTERFACES; concrete strategies depend on domain objects; nothing depends on concrete strategies."),
      K("code", "Core classes (Java)",
`enum VehicleType { MOTORCYCLE, CAR, TRUCK }
enum SpotType { SMALL, MEDIUM, LARGE }

class ParkingSpot {
  final String id; final SpotType type; final int floor; final int distance;
  private boolean occupied = false;
  ParkingSpot(String id, SpotType type, int floor, int distance) {
    this.id = id; this.type = type; this.floor = floor; this.distance = distance;
  }
  boolean fits(VehicleType v) {
    if (v == VehicleType.MOTORCYCLE) return true;
    if (v == VehicleType.CAR) return type != SpotType.SMALL;
    return type == SpotType.LARGE; // TRUCK
  }
  synchronized boolean tryOccupy() {          // the spot IS the lock
    if (occupied) return false;
    occupied = true; return true;
  }
  synchronized void release() { occupied = false; }
}

class Ticket {
  final String id, plate; final VehicleType vehicleType;
  final ParkingSpot spot; final Instant entryTime; Instant exitTime;
  Ticket(String id, String plate, VehicleType vt, ParkingSpot s, Instant in) {
    this.id = id; this.plate = plate; this.vehicleType = vt; this.spot = s; this.entryTime = in;
  }
}

interface SpotAllocationStrategy {
  Optional<ParkingSpot> allocate(VehicleType v, List<ParkingFloor> floors);
}
class NearestFirstStrategy implements SpotAllocationStrategy {
  public Optional<ParkingSpot> allocate(VehicleType v, List<ParkingFloor> floors) {
    for (ParkingFloor f : floors) {
      Optional<ParkingSpot> s = f.acquireNearest(v);   // claims atomically
      if (s.isPresent()) return s;
    }
    return Optional.empty();
  }
}

interface PricingStrategy { long fee(Ticket t); }
class HourlySlabPricing implements PricingStrategy {
  private static final Map<VehicleType, Long> RATE =
      Map.of(VehicleType.MOTORCYCLE, 20L, VehicleType.CAR, 50L, VehicleType.TRUCK, 100L);
  public long fee(Ticket t) {
    long mins = Duration.between(t.entryTime, t.exitTime).toMinutes();
    long hours = Math.max(1, (mins + 59) / 60);        // ceil, minimum 1 hour
    return hours * RATE.get(t.vehicleType);
  }
}

class ParkingLot {
  private final List<ParkingFloor> floors;
  private final SpotAllocationStrategy allocator;
  private final PricingStrategy pricing;
  private final Map<String, Ticket> activeTickets = new ConcurrentHashMap<>();
  ParkingLot(List<ParkingFloor> floors, SpotAllocationStrategy a, PricingStrategy p) {
    this.floors = floors; this.allocator = a; this.pricing = p;
  }
  Optional<Ticket> parkVehicle(String plate, VehicleType type) {
    return allocator.allocate(type, floors).map(spot -> {
      Ticket t = new Ticket(UUID.randomUUID().toString(), plate, type, spot, Instant.now());
      activeTickets.put(t.id, t);
      return t;
    });
  }
  long unpark(String ticketId) {
    Ticket t = activeTickets.remove(ticketId);
    if (t == null) throw new IllegalArgumentException("unknown or already-closed ticket");
    t.exitTime = Instant.now();
    long fee = pricing.fee(t);
    t.spot.release();                                   // free AFTER fee computed
    return fee;
  }
}`),
      C("deep_dive", "Deep dive: concurrent spot allocation (the last-spot race)",
        "The correctness crux: two entry gates, one free car spot, two threads inside allocate() at once. A naive design does findFreeSpot() then markOccupied() as two steps — a textbook check-then-act race: both threads 'find' the same spot, both mark it, two cars get one spot. The fix has two layers. LAYER 1 — the spot claims itself: tryOccupy() is the ONLY way to take a spot, and it is atomic (synchronized here; an AtomicBoolean.compareAndSet(false, true) works identically and lock-free). Whoever wins the CAS owns the spot; the loser simply continues searching. Finding is advisory; CLAIMING is authoritative. LAYER 2 — the free-set bookkeeping: each floor keeps a TreeSet<ParkingSpot> per SpotType, ordered by distance. acquireNearest(v) must iterate candidate types (a car can take MEDIUM then LARGE), pollFirst() a candidate, and confirm with tryOccupy(); on release, the spot re-enters its set. Guard the TreeSet itself (synchronized per (floor, type) set) because TreeSet is not thread-safe — note the locking is fine-grained: gates racing for MOTORCYCLE spots never contend with gates racing for TRUCK spots, and floors don't contend with each other. Walk the failure interleavings out loud: (a) both threads poll different spots — fine; (b) thread A polls the last spot, B finds the set empty and moves to the next floor — fine, no false 'lot full' because B checks every floor before giving up; (c) A polls a spot, then crashes before issuing a ticket — the spot leaks, which is why real systems pair allocation with a short reservation TTL or do poll+ticket in one guarded step. Also state the INVARIANT that makes the design auditable: a spot is in exactly one place — either in its floor's free set OR referenced by exactly one active ticket. Every operation preserves it; any bug (double-park, leaked spot) is a violation of it. Interviewers push exactly here; naming the check-then-act race unprompted and fixing it with an atomic claim is the difference between mid and senior."),
      C("deep_dive", "Deep dive: ticket lifecycle & pricing policy",
        "The ticket is a small STATE MACHINE: ISSUED (entry) -> PAID (fee settled) -> CLOSED (vehicle exited, spot released); add LOST as an explicit state because 'I lost my ticket' is a guaranteed follow-up — policy answer: charge a fixed penalty or max-day rate, verify by plate against activeTickets, and close the ticket through the same path (never a side-channel that forgets to release the spot). Order of operations at exit matters: compute the fee from entryTime->exitTime FIRST, then release the spot — release-then-price creates a window where the spot is reallocated while the ticket is still open, and if payment fails you cannot roll back. If the lot uses pay-stations (pay first, exit within 15 minutes), PAID gets a grace-period timestamp and the exit gate validates it — mention it to show you know the real-world flow. PRICING is where the Strategy pattern proves itself concretely: HourlySlabPricing (ceil to the hour, per-type rate, minimum one hour — note the classic off-by-one: 61 minutes is 2 hours, and Duration.toHours() TRUNCATES, so compute from minutes with (mins+59)/60); DayPassPricing (min(hourly, dayCap)); SurgePricing as a DECORATOR wrapping any base strategy with a multiplier window (weekend 1.5x) — composition means surge-over-slab and surge-over-daypass both fall out for free. Two integrity details that separate strong answers: (1) money is computed in the smallest currency unit as a long — never double, accumulation error in fees is a real bug class; (2) the fee is computed from the TICKET's recorded times, not from wall-clock lookups at exit, so a disputed charge is reproducible from the ticket record. Finally, capacity queries: 'is the lot full for trucks?' is a per-type AtomicInteger counter decremented on claim and incremented on release — O(1), no scanning — and its consistency with the free sets is another statement of the same one-place invariant."),
      C("tradeoffs", "Trade-offs & extension points",
        "Alternatives you should weigh aloud. VEHICLE/SPOT MODELING: enum + fits() function (chosen: differences are data — one rule, no class explosion) vs inheritance hierarchies Vehicle<-Car/Truck/Motorcycle with matching Spot subclasses (defensible if behaviors truly diverge — e.g., EV spots with charging sessions — but three empty subclasses is ceremony). ALLOCATION BOOKKEEPING: per-(floor,type) TreeSet ordered by distance (chosen: nearest-first in O(log n), fine-grained locking) vs one global PriorityQueue (single contention point, and stale entries after release need lazy cleanup) vs scanning a boolean array (O(n) per car at a busy gate — fails the 10k-spot lot). CONCURRENCY: per-spot atomic claim + per-set guard (chosen) vs one big lock on ParkingLot (correct, trivially — and serializes every gate; fine to START there and refine, wrong to END there) vs fully lock-free structures (unjustified complexity here). PRICING: strategy objects (chosen) vs a rules/config table (better once product wants date-ranged tariffs — the strategy INTERFACE stays, its implementation reads config). Extension questions interviewers actually ask, and where they land in this design: EV CHARGING spots -> new SpotType + a ChargingSession attached to the ticket; RESERVATIONS -> a Reservation claims a spot with a TTL through the same tryOccupy() path (holds and walk-ups then contend correctly by construction); MULTIPLE LOTS -> ParkingLot stops being a singleton, a LotRegistry composes them; VALET/HANDICAP -> allocation strategy variants plus a permit check at the gate; DYNAMIC PRICING BY OCCUPANCY -> a strategy that reads the per-type counters. The design absorbs each with a new class, not an edit — that closed-for-modification shape is the thing to point at when you summarize."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Two gates, one spot — walk me through the race.' — findSpot/markOccupied as separate steps is check-then-act; make the claim atomic (synchronized tryOccupy or AtomicBoolean CAS); finding is advisory, claiming is authoritative; loser keeps searching. 'Why strategies for allocation and pricing?' — they are the two stated axes of change; swapping NearestFirst for FillLowerFloors or slab for surge is a new class with zero edits to ParkingLot — and surge composes as a decorator over any base pricing. 'Lost ticket?' — an explicit LOST state: penalty or day-max fee, plate lookup in activeTickets, close through the normal path so the spot is provably released. 'How do display boards stay accurate?' — per-(floor,type) atomic counters updated inside claim/release, O(1) reads; push updates via Observer only if the product needs push. 'Truck arrives, only medium spots free?' — fits() says no; do NOT get clever about spanning two spots unless asked — if asked, spot-groups become the allocation unit and the claim must atomically take all members (allocate in a fixed order to avoid deadlock between concurrent group claims). 'Can a motorcycle take a large spot?' — yes by fits(), but a good allocation strategy prefers exact-fit first to preserve scarce large spots — a one-line preference in the strategy, which is exactly why it is a strategy. '10x scale, one lot per city?' — the in-memory model becomes the single-lot service; cross-lot search is a coordinator above it; per-spot atomicity becomes a DB conditional update (UPDATE ... WHERE occupied=false) — same invariant, different enforcement. Each answer returns to the spine: atomic spot claim + one-place invariant + policy in strategies + ticket as the auditable record."),
    ],
    "Parking Lot is the canonical LLD opener because it tests, in one sitting: clean entity extraction (lot/floor/spot/ticket, not a god class), justified pattern use (Strategy for the two stated axes of change — allocation and pricing — rather than pattern name-dropping), a real concurrency bug (the check-then-act last-spot race, fixed with an atomic claim), a small state machine (ticket lifecycle with the lost-ticket edge), and O(1)/O(log n) data-structure choices for nearest-spot and capacity queries. Interviewers grade the INVARIANT you articulate (a spot is free XOR ticketed), whether policy stays out of domain objects, and whether extensions (EV, reservations, surge) land as new classes instead of edits.",
    [
      G("check_then_act_alloc", "Finding a free spot and marking it occupied as two separate steps, double-assigning the last spot under concurrent gates.", "Make claiming atomic — tryOccupy() with synchronized/CAS is the only way to take a spot; treat search results as advisory and let losers continue searching.", "findFreeSpot() followed by spot.setOccupied(true) in the caller; no compare-and-set; works single-threaded, breaks with two gates."),
      G("policy_in_domain", "Hardcoding pricing math and allocation preference inside ParkingLot or ParkingSpot, so every tariff change edits core classes.", "Extract SpotAllocationStrategy and PricingStrategy interfaces; ParkingLot depends only on the interfaces; surge pricing becomes a decorator over a base strategy.", "if (vehicleType == CAR) fee = hours * 50 inline in unpark(); allocation loops with embedded preference logic in the lot class."),
      G("vehicle_class_explosion", "Building Vehicle/Spot inheritance trees with empty subclasses because 'OOP means inheritance'.", "Model type differences as enums plus one fits() compatibility function; introduce subclasses only when behavior actually diverges (e.g., EV charging sessions).", "class Car extends Vehicle {} with no members; parallel SmallSpot/MediumSpot/LargeSpot classes duplicating one size field."),
    ],
    0.4, DIAG.parking, "Parking lot class diagram"),

  // ───────────────────────── LRU CACHE ───────────────────────────────────────
  TT("lld_m1", "lld_m1_t11", 11, "Case Study — Design an LRU Cache", "design-lru-cache",
    ["case-study", "data-structures", "concurrency"],
    "Your service caches 10,000 user profiles in memory; when the 10,001st arrives, something must go — and it should be the entry nobody has touched for the longest time. get() and put() are on the hot path of every request, so both must be O(1), and forty threads hit the cache at once. How do you design an LRU Cache?",
    "Combine a HashMap (key -> node, O(1) lookup) with a doubly linked list ordered by recency (O(1) unlink/relink), joined by one invariant: a key is in the map IFF its node is in the list. get() moves the node to the head; put() inserts at the head and, on overflow, evicts the node before the tail sentinel. Sentinels kill every null-pointer edge case. For threads: one lock is the correct first answer, striping and Caffeine-style buffered reads are the scaling story.",
    [
      C("requirements", "Requirements",
        "Functional: a fixed-CAPACITY key-value cache with get(key) and put(key, value); when a put would exceed capacity, EVICT the LEAST RECENTLY USED entry — where 'used' means touched by EITHER get or put (a get must refresh recency; forgetting that is the most common functional bug). get on a missing key returns a miss (null/Optional), put on an existing key updates the value AND refreshes recency. Non-functional, and this is the entire problem: BOTH operations must be O(1) — the interviewer will reject O(log n) and anything that scans; capacity is bounded so memory is bounded; and in any real deployment the cache is hit by MANY THREADS, so you must at least state your concurrency position even if the first cut is single-threaded. Clarifying questions worth asking because they change the design: is capacity a count or a byte budget (weight-based eviction changes the accounting)? Do entries also expire by TTL (a second ordering — expiry — alongside recency)? Is null a legal value (decide, because get returning null becomes ambiguous)? What are typical sizes (a 10-entry cache and a 10-million-entry cache stress different things)? The interview shape: derive WHY the classic structure is forced — a hash map alone gives O(1) lookup but no cheap recency order; any array/list alone gives order but O(n) lookup; a balanced tree or heap gives both at O(log n), which is exactly what O(1) forbids. The unique O(1)+O(1) answer is HashMap + doubly linked list, and everything after that is invariants, edge cases, and thread safety."),
      C("entities", "Core entities & responsibilities",
        "NODE — the atom: key, value, prev, next. It lives in BOTH structures at once: the map points at it, the list threads through it. It must carry the KEY as well as the value — a detail people miss until eviction: when you unlink the tail node you must also remove its map entry, and without node.key you cannot find which map entry to delete (reverse lookup by value would be O(n) and wrong). HASHMAP<K, Node> — the index: O(1) from key to node. It answers 'is it cached, and where in the list does it sit', nothing else. DOUBLY LINKED LIST — the recency order: head end = most recently used, tail end = least recently used. Doubly linked is forced, not chosen: given a node mid-list (which the map hands you), unlinking it needs its predecessor in O(1) — a singly linked list makes unlink O(n) and the whole design collapses. HEAD and TAIL SENTINELS — two permanent dummy nodes bracketing the list. They are a correctness tool, not a style choice: with sentinels, every real node ALWAYS has non-null prev and next, so unlink/insert have zero branches for 'am I the head/tail/only node' — the number-one source of pointer bugs in whiteboard implementations. LRUCACHE — the facade owning both structures, capacity, and the operations; it maintains THE INVARIANT: key in map IFF node in list, map.size() == list length <= capacity, and list order = recency order. Every method must preserve all three clauses; every LRU bug you will ever write is a violation of one of them. Notably ABSENT: no separate EvictionPolicy interface in the core interview cut — LRU's policy IS the list discipline; generalizing to pluggable policies (LFU, FIFO) is an extension to mention, not scaffolding to build first."),
      C("design", "Class design & patterns",
        "This case study is deliberately pattern-light — its design content is DATA-STRUCTURE COMPOSITION, and interviewers use it to see whether you reach for structure or ceremony. The class design: LRUCache<K,V> exposes get/put; Node is a private static inner class (it is an implementation detail — leaking it into the public API is a design smell); the map is HashMap<K, Node<K,V>>; the list exists only as head/tail sentinel fields plus unlink() and addToFront() private helpers. Those two helpers are the whole algebra: get(k) = map lookup, unlink(node), addToFront(node), return value. put(k,v) on existing key = update value, unlink, addToFront. put on new key = if at capacity, evict (node last = tail.prev; unlink(last); map.remove(last.key)), then create node, addToFront, map.put. Three operations, two helpers, one invariant. Where patterns DO legitimately appear: STRATEGY if the interviewer extends to pluggable eviction (an EvictionPolicy told about access/insert events, asked for a victim — LFU/FIFO/LRU become implementations); DECORATOR for a thread-safe wrapper (synchronizedCache(cache)) or a metrics wrapper counting hits/misses — wrapping keeps the core single-responsibility; TEMPLATE METHOD is how java.util.LinkedHashMap does it: accessOrder=true plus overriding removeEldestEntry() gives you a correct LRU in five lines — you MUST mention LinkedHashMap to show you know the platform, and the interviewer will still want the raw version because the point is the mechanics. Also name the production answer — Caffeine (Java) — because 'I know what I'd actually deploy, and I can also build the primitive' is exactly the seniority signal this question exists to extract."),
      K("code", "Core classes (Java)",
`class LRUCache<K, V> {
  private static final class Node<K, V> {
    K key; V value; Node<K, V> prev, next;   // key needed for map cleanup on evict
    Node(K key, V value) { this.key = key; this.value = value; }
  }

  private final int capacity;
  private final Map<K, Node<K, V>> map = new HashMap<>();
  private final Node<K, V> head = new Node<>(null, null); // sentinel: MRU side
  private final Node<K, V> tail = new Node<>(null, null); // sentinel: LRU side

  LRUCache(int capacity) {
    if (capacity <= 0) throw new IllegalArgumentException("capacity must be > 0");
    this.capacity = capacity;
    head.next = tail; tail.prev = head;      // empty list = two linked sentinels
  }

  public synchronized V get(K key) {
    Node<K, V> n = map.get(key);
    if (n == null) return null;              // miss
    unlink(n);                               // refresh recency: move to front
    addToFront(n);
    return n.value;
  }

  public synchronized void put(K key, V value) {
    Node<K, V> n = map.get(key);
    if (n != null) {                         // update existing: value + recency
      n.value = value;
      unlink(n); addToFront(n);
      return;
    }
    if (map.size() == capacity) {            // evict BEFORE inserting
      Node<K, V> lru = tail.prev;            // real node nearest tail sentinel
      unlink(lru);
      map.remove(lru.key);                   // this is why Node stores the key
    }
    Node<K, V> fresh = new Node<>(key, value);
    addToFront(fresh);
    map.put(key, fresh);
  }

  // -- list helpers: branch-free thanks to sentinels ------------------------
  private void unlink(Node<K, V> n) {
    n.prev.next = n.next;
    n.next.prev = n.prev;
  }
  private void addToFront(Node<K, V> n) {
    n.next = head.next;
    n.prev = head;
    head.next.prev = n;
    head.next = n;
  }

  public synchronized int size() { return map.size(); }
}`),
      C("deep_dive", "Deep dive: the O(1) mechanics & the invariant that proves them",
        "Walk the forcing argument like a proof, because the interviewer is testing whether you can DERIVE the structure. Requirement A: O(1) get by key -> some hash index is mandatory. Requirement B: O(1) identification of the LRU victim -> entries must sit in a maintained recency ORDER with the victim at a known end — computing 'least recent' on demand from timestamps is O(n) scan or O(log n) heap, both banned. Requirement C: O(1) recency REFRESH — and this is the subtle one: a get touches an entry in the MIDDLE of the order and must move it to the front. An array-backed order makes that a shift; a heap makes it a sift; a singly linked list can splice in O(1) only if you know the PREDECESSOR, which you don't. Only a doubly linked list gives O(1) removal of an arbitrary node you hold a pointer to — and the map is exactly the thing that hands you that pointer. So HashMap + DLL is not a memorized trick; it is the unique intersection of three O(1) requirements. Now the edge cases, which is where whiteboard implementations die: (1) put on an EXISTING key must not evict — check membership before capacity; (2) eviction must remove from BOTH structures — unlink the node AND map.remove(node.key); forgetting the map half leaves a ghost entry and the invariant 'map IFF list' is your detector; (3) capacity 1: put(a), put(b), get(a) — every operation touches both sentinels' neighbors; sentinels make it branch-free where head==tail-special-casing versions typically NPE; (4) move-to-front of the node that is ALREADY front — unlink+addToFront handles it with no special case, another sentinel dividend; (5) get must refresh recency — an LRU where only put refreshes silently degrades to FIFO and passes most casual tests. State the full invariant once, precisely: map.keySet() equals the set of keys on the list; list length == map.size() <= capacity; list order is exactly last-touch order. Then note the audit trick: every public method can assert it in debug builds — an interviewer hearing 'here is the invariant and every method's proof obligation' upgrades you immediately."),
      C("deep_dive", "Deep dive: thread safety — from one lock to Caffeine",
        "Single-threaded LRU is a warm-up; the real question is always 'now forty threads hit it'. LEVEL 1 — ONE LOCK (the code above): synchronized get/put. Correct by construction, trivially reasoned about, and the right FIRST answer — say explicitly that even get MUTATES (it reorders the list), so a read-write lock does NOT work naively: two concurrent 'readers' both splicing nodes will corrupt the list. This is the trap: LRU has no read-only fast path in its textbook form, because reads write metadata. LEVEL 2 — SEGMENTED/STRIPED: shard by key hash into N independent LRUCache segments, each with its own lock (ConcurrentHashMap's old trick). Contention drops ~N-fold; the cost is that eviction is per-segment, so the cache is only approximately-LRU globally and per-segment capacity can be unlucky under skew — usually acceptable, and you should say 'approximate' out loud. LEVEL 3 — DECOUPLE READS FROM REORDERING (the Caffeine design, worth describing because it is the state of the art): storage is a ConcurrentHashMap (lock-free reads); recency updates are NOT applied inline — each get appends its access event to a striped RING BUFFER and returns immediately; a single maintenance thread (or piggybacked work) DRAINS the buffers and replays the reorderings against the list, which only IT touches. Reads become effectively lock-free; the recency order lags reality by microseconds, and LRU is an approximation anyway, so nothing of value is lost. If the ring buffer fills under a read storm, events are simply DROPPED — losing a recency hint is harmless, a beautifully chosen failure mode. Caffeine further replaces plain LRU with W-TinyLFU (a small admission window + a frequency sketch deciding whether a new key is even worth admitting over the would-be victim), fixing LRU's classic weakness: one sequential scan of cold keys flushing the entire hot set. You are not expected to implement this in an interview — you ARE expected to know the ladder: one lock (correct) -> striping (scales, approximate) -> buffered reads + single reorderer (read-heavy production) -> TinyLFU admission (scan resistance). Bonus points: TTL expiry composes as a second ordering (a time wheel or a separate expiry queue) checked lazily on get and swept by the maintenance thread."),
      C("tradeoffs", "Trade-offs & extension points",
        "Alternatives and when they win. LINKEDHASHMAP(accessOrder=true) + removeEldestEntry override: five lines, correct, single-threaded — the right PRODUCTION answer for a small in-process cache and the right thing to NAME before hand-rolling; the interview wants the internals anyway. TIMESTAMP + HEAP: O(log n) and a broken refresh path (decrease-key on access) — name it to reject it. PLAIN FIFO (no move-on-get): O(1) and lock-friendlier, but a hot key inserted early gets evicted while cold latecomers survive — the difference between FIFO and LRU IS the get-refresh. CLOCK / SECOND-CHANCE: the OS page-cache compromise — a circular buffer with reference bits, approximate LRU with almost no per-access cost; worth mentioning as the classic 'cheap approximation' when even list splicing is too hot. LFU: better for stable popularity distributions, worse for shifting working sets, and O(1) LFU is its own (harder) design — usually the interviewer's escalation question. Extension points and how the design absorbs them: WEIGHT-BASED capacity (entries cost bytes, not 1) — evict in a loop until under budget; watch the pathological case of one entry heavier than the whole budget. TTL — a second index by expiry (min-ordered) + lazy validation on get; expiry and recency are independent orders on the same nodes. HIT/MISS METRICS — a decorator, keeping the core pure. PLUGGABLE POLICY — EvictionPolicy strategy fed access/insert events; LRU/LFU/FIFO become implementations and your DLL becomes LRU's private machinery. PERSISTENCE/DISTRIBUTION — out of scope for LLD and say so: a distributed 'LRU' is really per-node LRU plus consistent hashing; global recency is neither achievable nor worth it. The summary sentence interviewers remember: two structures, three O(1) requirements forcing them, one invariant tying them, and a concurrency ladder from one lock to buffered approximate reordering."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why a DOUBLY linked list?' — the map hands you a mid-list node; O(1) unlink needs prev; singly linked makes refresh O(n). The DLL is forced by the O(1) refresh requirement, not chosen by taste. 'Why does Node store the key?' — eviction unlinks tail.prev and must delete the matching MAP entry; without node.key that lookup is impossible in O(1). 'What exactly does get do on a hit?' — map lookup, unlink, addToFront, return; yes, get MUTATES — which is also why naive read-write locking is wrong. 'Sentinels — why?' — every real node always has live prev/next, so unlink/insert are four pointer writes with zero head/tail/empty branches; most whiteboard NPEs are the non-sentinel version special-casing itself into a corner. 'Make it thread-safe.' — start with synchronized (correct, honest), then the ladder: striped segments (approximate global LRU), then Caffeine's model — ConcurrentHashMap storage + per-access events into striped ring buffers + one maintenance path replaying reorderings, dropping events under pressure because recency hints are safely lossy. 'What's wrong with LRU itself?' — scan pollution: one pass over n cold keys evicts the whole hot set; mitigations are admission control (TinyLFU), segmented LRU (probation/protected), or 2Q — name one and sketch it. 'Capacity in bytes?' — weighted eviction loop; 'TTL?' — second ordering, lazy check on read plus background sweep; 'LFU in O(1)?' — frequency buckets of DLLs (the LFU paper design) — each is a bolt-on to the same node/invariant core. Strong candidates keep returning every answer to the same spine: map for location, list for order, invariant for correctness, and reordering as the concurrency pressure point."),
    ],
    "LRU Cache is the tightest test of data-structure DERIVATION in the LLD canon: the interviewer wants you to force HashMap + doubly-linked-list from three O(1) requirements (lookup, victim identification, mid-list recency refresh), state the binding invariant (key in map IFF node in list, list order = recency), and implement branch-free splicing with sentinels — then escalate to thread safety, where the trap is that get mutates (so naive read-write locks corrupt the list) and the ladder runs one lock -> striped segments -> Caffeine-style buffered, lossy, single-threaded reordering with TinyLFU admission. Knowing LinkedHashMap and Caffeine exist, while still nailing the raw mechanics, is precisely the junior/senior discriminator this question was built for.",
    [
      G("get_no_refresh", "Implementing get() as a plain map lookup that never moves the node, silently turning LRU into FIFO.", "Every touch — get AND put-update — must unlink the node and re-insert at the head; recency order means last-TOUCH order, and eviction correctness depends on it.", "get() has no list operations; tests that only exercise put-evict pass while access-pattern tests show hot keys being evicted."),
      G("evict_one_structure", "Evicting from the list but forgetting map.remove(node.key) (or storing no key in the node at all), leaving ghost map entries.", "Node must carry its key; eviction is always the pair unlink(tail.prev) + map.remove(lru.key) — and the 'map IFF list' invariant is the assertion that catches the drift.", "Cache 'size' grows past capacity in the map while the list stays bounded; Node class has value/prev/next but no key field."),
      G("rwlock_on_lru", "Guarding the cache with a read-write lock on the theory that get is a read.", "get splices the list — it is a WRITE; use one mutex first, then striped segments or a Caffeine-style design (concurrent map + buffered access events drained by a single reorderer) for read-heavy loads.", "ReadWriteLock with get under readLock(); intermittent corrupted-list/NPE failures under concurrent read load that vanish single-threaded."),
    ],
    0.4, DIAG.lru, "LRU cache structure diagram"),

  // ───────────────────────── HOTEL BOOKING ───────────────────────────────────
  TT("lld_m10", "lld_m10_t1", 1, "Design a Hotel Booking System", "design-hotel-booking",
    ["case-study", "inventory", "state-machine"],
    "A 200-room hotel sells the last Deluxe room for New Year's Eve — and two guests hit Book at the same second. A third guest wants Dec 30–Jan 2, which overlaps two other stays. Housekeeping blocks room 304 for repairs, but the guest booked 'a Deluxe room', not 304. How do you design a Hotel Booking System?",
    "Book ROOM TYPES, not physical rooms: availability is an InventoryCalendar of per-(roomType, date) counts, a stay of Dec 30–Jan 2 decrements the nights Dec 30, 31, Jan 1 (check-out day exclusive) atomically across all nights or not at all, and the physical Room is assigned only at check-in. Reservation is a guarded state machine (PENDING -> CONFIRMED -> CHECKED_IN -> CHECKED_OUT, with CANCELLED/NO_SHOW), the last-room race is settled by an atomic conditional decrement, and payment holds use a PENDING-with-TTL state.",
    [
      C("requirements", "Requirements",
        "Functional: guests SEARCH availability by date range and room type, BOOK a stay (check-in date, check-out date, room type, guest count), PAY (at booking or at the desk), CANCEL under a policy (free until 48h before, then a fee), CHECK IN (get a physical room) and CHECK OUT (settle the folio). Staff manage rooms (mark out-of-service), walk-ins, and no-shows. Non-functional constraints that drive the design: bookings for the same dates arrive CONCURRENTLY and the hotel must NEVER sell more rooms of a type than exist for any night (the overbooking invariant — unless the product explicitly wants controlled overbooking, which you should ask about); a stay SPANS MULTIPLE NIGHTS and must be all-or-nothing across them (no 'you have a room except Wednesday'); prices vary by date and type; availability queries must be fast because search traffic dwarfs booking traffic ~100:1. The keystone clarification that separates good designs from broken ones, and you should surface it yourself: does a guest book a PHYSICAL ROOM or a ROOM TYPE? Real hotels sell TYPES — 'a Deluxe' — and assign the physical room at check-in. This one decision dissolves half the fake complexity: availability becomes per-(type, date) COUNTING instead of per-room interval overlap checking, maintenance blocking room 304 just decrements a count, and room preference becomes an assignment-time concern. Also pin the date semantics before writing code: a night is the unit of inventory; a stay [checkIn, checkOut) consumes nights checkIn..checkOut-1 — CHECK-OUT DAY IS EXCLUSIVE, and half the off-by-one bugs in this problem are people intersecting closed intervals instead."),
      C("entities", "Core entities & responsibilities",
        "HOTEL — root aggregate: identity, rooms, room types, policies; mostly a container. ROOMTYPE — the SELLABLE unit: name (Deluxe), capacity, amenities, base rate, and total physical count; bookings reference RoomType, not Room. ROOM — the PHYSICAL unit: number, floor, its RoomType, and an operational status (AVAILABLE / OCCUPIED / OUT_OF_SERVICE / CLEANING); it matters at check-in and to housekeeping, never to booking. INVENTORYCALENDAR — the heart: for each (roomType, date), bookedCount against totalCount (total minus out-of-service for that date); owns the only two mutations that matter — tryReserve(type, range): atomically verify EVERY night in the range has bookedCount < available and increment ALL of them, or change NOTHING; and release(type, range) on cancel/no-show. All-or-nothing across nights is its contract. RESERVATION — the state machine: id, guest, roomType, dateRange, quoted price (SNAPSHOTTED at booking — repricing a confirmed stay when rates change is a lawsuit), state (PENDING -> CONFIRMED -> CHECKED_IN -> CHECKED_OUT, exits to CANCELLED / NO_SHOW / EXPIRED), and assignedRoom — null until check-in. GUEST — profile + payment handle. PAYMENTSERVICE — an interface boundary: authorize/capture/refund; the booking flow depends on the interface, and payment latency is exactly why PENDING exists. RATEPLAN/PRICINGPOLICY — computes a stay's price from per-night rates; CANCELLATIONPOLICY — computes the refund from (policy, now, checkIn). Responsibility test: 'room 304's AC breaks for a week' touches Room status + InventoryCalendar counts — zero reservations are edited, because none of them name room 304. That's the payoff of type-based booking, and you should say so explicitly."),
      C("design", "Class design & patterns",
        "Composition: Hotel has RoomTypes; RoomType has Rooms; Reservation references RoomType + Guest and (later) one Room; InventoryCalendar is keyed by (roomTypeId, date). The BookingService orchestrates the one flow that must be right: quote price -> create Reservation(PENDING) -> inventory.tryReserve(...) -> payment authorize -> CONFIRMED (or release + FAILED/EXPIRED on payment failure/timeout). Patterns, each with its justification: STATE (or an explicit guarded-transition table) for Reservation — transitions are the business rules (cannot check in a CANCELLED stay; cannot cancel after CHECKED_IN — that's an early check-out, a different operation with different money), and centralizing legal transitions in one place beats scattered if-checks the moment no-show sweeps and payment timeouts join the party; STRATEGY for CancellationPolicy (flexible / 48-hour / non-refundable are interchangeable calculations chosen per rate plan) and for pricing (seasonal, length-of-stay discounts, member rates); OBSERVER for reservation lifecycle events (confirmation email, housekeeping heads-up on check-in day, channel-manager sync) so side effects never live inside the transition; FACTORY for building reservations with validated invariants (checkOut strictly after checkIn, party fits capacity). What is deliberately NOT here: no per-room booking table with interval-overlap queries (the type-count model replaced it — mention interval trees only to explain why you don't need them); no Room state machine entangled with Reservation state (OCCUPIED/CLEANING is housekeeping's workflow, coupled to reservations only at check-in/check-out edges); no premature multi-hotel abstraction. Dependency direction: BookingService depends on InventoryCalendar and the PaymentService INTERFACE; policies are injected; the domain never imports the notification code."),
      K("code", "Core classes (Java)",
`enum ReservationState { PENDING, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW, EXPIRED }

class Reservation {
  final String id; final String guestId; final String roomTypeId;
  final LocalDate checkIn, checkOut;        // [checkIn, checkOut) — nights = checkOut exclusive
  final long quotedTotalCents;              // price snapshotted at booking time
  private ReservationState state = ReservationState.PENDING;
  private String assignedRoomId;            // null until check-in

  private static final Map<ReservationState, Set<ReservationState>> LEGAL = Map.of(
      ReservationState.PENDING,    Set.of(ReservationState.CONFIRMED, ReservationState.EXPIRED, ReservationState.CANCELLED),
      ReservationState.CONFIRMED,  Set.of(ReservationState.CHECKED_IN, ReservationState.CANCELLED, ReservationState.NO_SHOW),
      ReservationState.CHECKED_IN, Set.of(ReservationState.CHECKED_OUT));

  Reservation(String id, String guestId, String roomTypeId,
              LocalDate in, LocalDate out, long totalCents) {
    if (!out.isAfter(in)) throw new IllegalArgumentException("checkOut must be after checkIn");
    this.id = id; this.guestId = guestId; this.roomTypeId = roomTypeId;
    this.checkIn = in; this.checkOut = out; this.quotedTotalCents = totalCents;
  }
  synchronized void transitionTo(ReservationState next) {
    Set<ReservationState> allowed = LEGAL.getOrDefault(state, Set.of());
    if (!allowed.contains(next))
      throw new IllegalStateException(state + " -> " + next + " is not a legal transition");
    state = next;
  }
  synchronized void assignRoom(String roomId) {
    if (state != ReservationState.CONFIRMED) throw new IllegalStateException("assign at check-in only");
    this.assignedRoomId = roomId;
  }
  synchronized ReservationState state() { return state; }
}

/** Per-(roomType, date) counts. The all-or-nothing multi-night reserve is the crux. */
class InventoryCalendar {
  private final Map<String, Integer> totalByType = new HashMap<>();          // physical capacity
  private final Map<String, Map<LocalDate, Integer>> booked = new HashMap<>(); // type -> date -> count

  synchronized boolean tryReserve(String typeId, LocalDate in, LocalDate out) {
    int total = totalByType.getOrDefault(typeId, 0);
    Map<LocalDate, Integer> cal = booked.computeIfAbsent(typeId, k -> new HashMap<>());
    for (LocalDate d = in; d.isBefore(out); d = d.plusDays(1))   // 1) CHECK every night
      if (cal.getOrDefault(d, 0) >= total) return false;         //    any full night => reject whole stay
    for (LocalDate d = in; d.isBefore(out); d = d.plusDays(1))   // 2) then RESERVE every night
      cal.merge(d, 1, Integer::sum);
    return true;                                                  // atomic: same lock covers both passes
  }
  synchronized void release(String typeId, LocalDate in, LocalDate out) {
    Map<LocalDate, Integer> cal = booked.get(typeId);
    if (cal == null) return;
    for (LocalDate d = in; d.isBefore(out); d = d.plusDays(1))
      cal.merge(d, -1, Integer::sum);
  }
}

class BookingService {
  private final InventoryCalendar inventory; private final PaymentService payments;
  BookingService(InventoryCalendar inv, PaymentService pay) { this.inventory = inv; this.payments = pay; }

  Reservation book(String guestId, String typeId, LocalDate in, LocalDate out, long priceCents) {
    Reservation r = new Reservation(UUID.randomUUID().toString(), guestId, typeId, in, out, priceCents);
    if (!inventory.tryReserve(typeId, in, out))
      throw new IllegalStateException("no availability for " + typeId);
    try {
      payments.charge(guestId, priceCents, r.id);       // r.id doubles as idempotency key
      r.transitionTo(ReservationState.CONFIRMED);
    } catch (Exception e) {
      inventory.release(typeId, in, out);               // compensate: give the nights back
      r.transitionTo(ReservationState.EXPIRED);
      throw e;
    }
    return r;
  }
}
interface PaymentService { void charge(String guestId, long amountCents, String idempotencyKey); }`),
      C("deep_dive", "Deep dive: the inventory model & the last-room race",
        "The inventory model is the design. Represent availability as COUNTS per (roomType, date): available(type, d) = totalPhysical(type) - outOfService(type, d) - booked(type, d). A stay is a RANGE of nights, and its reservation must be ATOMIC ACROSS THE RANGE: check every night first, then increment every night, under one guard — a check pass that succeeds followed by an increment pass that races another thread is the multi-night version of check-then-act, and it manifests as two guests each holding 'the last Deluxe' for overlapping but different ranges. In-process, one lock over the calendar (or finer: a lock per roomType — different types never contend) settles it; in a database, the same contract becomes a transaction: UPDATE inventory SET booked = booked + 1 WHERE type=? AND date IN (...) AND booked < total, and if the affected-row count is less than the number of nights, ROLL BACK — the conditional update IS the atomic tryReserve. Now the LAST-ROOM RACE properly: two guests, one Deluxe-night remaining, both click Book. Whoever enters tryReserve first wins; the loser gets a clean 'no availability' BEFORE any payment is taken — which is why the sequence is reserve-inventory THEN charge, with a compensating release() if payment fails. The alternative order (charge then reserve) means refunding a guest you never had a room for: strictly worse. The remaining subtlety is the HOLD WINDOW: between reserve and payment confirmation the reservation is PENDING and the night is held; if the guest abandons at the payment page, that hold leaks inventory. Fix: PENDING carries an expiry (10–15 min); a sweeper (or lazy check) transitions expired PENDINGs to EXPIRED and releases their nights — the same TTL-hold pattern as ticket booking, and naming that kinship scores. Finally CONTROLLED OVERBOOKING, because a strong interviewer raises it: hotels deliberately sell N+k against no-show statistics; the model absorbs it by making the reserve condition booked < total + overbookAllowance(type, date) — one policy input, not a redesign — plus a walk-relocation workflow for the bad day when everyone shows up."),
      C("deep_dive", "Deep dive: reservation state machine, money & the day's operations",
        "The Reservation state machine carries the operational truth, and its guards ARE the business rules — enumerate them: PENDING -> CONFIRMED only via successful payment/hold; PENDING -> EXPIRED via TTL; CONFIRMED -> CANCELLED runs the CancellationPolicy (Strategy) to compute the refund — full before the cutoff, partial/none after — then releases inventory and refunds through PaymentService; CONFIRMED -> CHECKED_IN happens at the desk and is where the PHYSICAL ROOM is finally assigned: pick any Room of the booked type with status AVAILABLE (honoring soft preferences — high floor, away from elevator — as best-effort), flip it to OCCUPIED; if maintenance shrank the pool and no room of the type is ready, the desk UPGRADES to a higher type — possible precisely because the reservation never named a room; CONFIRMED -> NO_SHOW via an end-of-day sweep past the check-in cutoff, applying the no-show fee and releasing remaining nights; CHECKED_IN -> CHECKED_OUT settles the FOLIO (room nights at the SNAPSHOTTED rate + incidentals), flips the Room to CLEANING for housekeeping's own small state machine (CLEANING -> AVAILABLE), and closes. Transitions like cancel-after-check-in must be REJECTED by the guard (early check-out is a distinct operation that recomputes the folio, not a cancel) — this is the argument for a transition TABLE over scattered ifs: every rule is visible, testable, and violations throw instead of corrupting. MONEY DISCIPLINE: the quoted price is snapshotted on the Reservation at booking (rates change daily; the guest pays what they agreed); amounts are long cents; every charge/refund carries the reservation id as an IDEMPOTENCY KEY so a retried payment call cannot double-charge — and the charge-fails compensation path (release nights, mark EXPIRED) must itself be safe to retry. DATE ARITHMETIC, once more because it is the #1 bug source: nights are [checkIn, checkOut); two stays [10th,12th) and [12th,14th) do NOT conflict — the 12th is a turnover day; iterate d from checkIn while d.isBefore(checkOut). Get that wrong and every same-day turnover 'conflicts', silently halving inventory."),
      C("tradeoffs", "Trade-offs & extension points",
        "The load-bearing decisions, with their alternatives. BOOK TYPES vs BOOK ROOMS: type-counts (chosen) make availability O(nights) counting, maintenance a count tweak, and upgrades free; per-room booking gives 'guaranteed room 304' (a real product feature in boutique hotels) at the cost of per-room interval-overlap checks, painful maintenance rebooking, and much hotter contention — if the interviewer wants named-room booking, model per-room date sets and say the price aloud. INVENTORY GRANULARITY: per-night counters (chosen: uniform, simple, O(stay length) which is small) vs interval trees per type (elegant for very long stays, unjustified for <=30-night ranges). CONCURRENCY: one calendar lock -> per-roomType locks (types are independent — an easy, real win) -> DB conditional updates with row locks per (type, date) at multi-instance scale; optimistic retry works too since conflicts touch few rows. PAYMENT ORDERING: reserve-then-charge with compensation (chosen — the loser of a race never gets charged) vs charge-then-reserve (refund machinery on the hot path — reject it explicitly). PRICE: snapshot at booking (chosen) vs reprice at check-in (guest-hostile; only revalidate on guest-initiated CHANGES to the stay). Extension questions and where they land: MULTI-HOTEL — key inventory by (hotelId, typeId, date), BookingService takes hotelId; the classes barely move. CHANNEL MANAGERS (Booking.com sync) — Observer on inventory/reservation events feeding an outbound sync, with allotments per channel. GROUP BOOKINGS — one blanket hold of k rooms decrementing k per night, later split into reservations. LOYALTY/UPGRADES — assignment-time strategy. DYNAMIC PRICING — PricingPolicy reads occupancy from the calendar (the counters you already keep). Each lands in an existing seam — policy strategies, calendar keys, lifecycle observers — which is the sign the seams were cut right."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Two guests, last room, same second?' — inventory.tryReserve is atomic (one guard covers check+increment across all nights); the loser fails cleanly BEFORE payment; reserve-then-charge with compensating release means nobody is ever charged without held nights. 'Guest books Dec 30–Jan 2 — what exactly is decremented?' — nights Dec 30, Dec 31, Jan 1: [checkIn, checkOut) with check-out exclusive; back-to-back stays sharing a turnover date must NOT conflict — state the convention before coding, it is the question's favorite off-by-one. 'Room 304 breaks mid-week?' — bookings name TYPES, so no reservation mentions 304: set Room OUT_OF_SERVICE, decrement that type's capacity for the affected dates; if a date was already fully booked you are now oversold by one — surface it as an operational exception (upgrade someone / walk with compensation), not silent data corruption. 'Guest abandons at the payment page?' — PENDING holds carry a TTL; a sweeper expires them and releases nights — never let holds leak inventory. 'Cancellation?' — a Strategy computes the refund from (policy, now, checkIn); transition guard rejects cancel-after-check-in (early check-out is its own flow). 'Overbooking on purpose?' — reserve condition becomes booked < total + allowance(type, date): one policy knob, plus the walk workflow for the unlucky day. 'Scale to 10k hotels?' — the calendar becomes rows keyed (hotelId, type, date) with conditional-update semantics; per-hotel partitioning is natural because stays never span hotels; search reads replicas/caches while booking hits the authoritative counters. Every answer reuses the same spine: type-level counted inventory + atomic multi-night reserve + guarded state machine + snapshotted money."),
    ],
    "Hotel booking probes whether you can pick the MODEL that dissolves the problem: candidates who book physical rooms drown in interval-overlap checks and maintenance rebooking, while type-level per-(roomType, date) counted inventory reduces everything to an atomic all-or-nothing multi-night conditional decrement — which is also exactly where the interviewer tests concurrency (the last-room race, the check-then-act window across nights, PENDING holds with TTL). The remaining signal is the Reservation state machine with guarded transitions (cancel vs early check-out, no-show sweeps), Strategy-based cancellation/pricing policies, price snapshotting and idempotent payments, and the [checkIn, checkOut) exclusivity convention — the problem's single most reliable off-by-one trap.",
    [
      G("book_physical_rooms", "Modeling bookings against physical rooms, forcing interval-overlap checks per room and breaking on maintenance/upgrades.", "Sell ROOM TYPES against a per-(type, date) count calendar; assign the physical room at check-in — maintenance becomes a capacity decrement and upgrades become an assignment-time choice.", "Reservation has a roomNumber at booking time; availability code loops rooms testing date-range overlaps; blocking one room requires editing reservations."),
      G("non_atomic_multinight", "Checking availability night-by-night and then incrementing night-by-night without one atomic guard over the whole stay.", "tryReserve must check ALL nights and reserve ALL nights under a single lock/transaction (or a conditional multi-row update verified by affected-row count) — all-or-nothing across the range.", "Separate isAvailable(range) and reserve(range) calls; under concurrent load two overlapping stays both succeed and one night goes negative-available."),
      G("closed_interval_dates", "Treating stays as closed date intervals so back-to-back bookings sharing a turnover day falsely conflict (or the last night is never charged).", "Fix the convention: a stay [checkIn, checkOut) consumes nights checkIn..checkOut-1; iterate with isBefore(checkOut); same-day turnover is the normal case, not a conflict.", "Overlap tests using <= on both ends; inventory decremented for the check-out date; tests with [10,12) vs [12,14) reporting a clash."),
    ],
    0.5, DIAG.hotel, "Hotel booking class diagram"),

  // ───────────────────────── FOOD DELIVERY ───────────────────────────────────
  TT("lld_m10", "lld_m10_t2", 2, "Design a Food Delivery System", "design-food-delivery",
    ["case-study", "state-machine", "observer-pattern"],
    "A customer orders biryani; the restaurant can accept or reject; a delivery agent three streets away must be picked — and exactly one agent, even if two dispatchers race. The customer cancels while the kitchen is mid-prep, the restaurant edits its menu mid-order, and everyone expects live status pings. How do you design a Food Delivery System (Swiggy/DoorDash)?",
    "The core is an Order STATE MACHINE with guarded, actor-checked transitions (PLACED -> ACCEPTED -> PREPARING -> READY -> PICKED_UP -> DELIVERED, cancellation legal only in early states), OBSERVER to fan out every transition to customer/restaurant/agent notifiers without polluting the domain, STRATEGY for agent assignment (nearest-available first), an atomic per-agent busy flag so two dispatch threads can never double-book one rider, and price/menu SNAPSHOTTING into the order so a menu edit never rewrites an in-flight order.",
    [
      C("requirements", "Requirements",
        "Functional: customers browse RESTAURANTS and MENUS, build a CART, place an ORDER (items, quantities, address, payment); the RESTAURANT accepts or rejects, then prepares; the system ASSIGNS a DELIVERY AGENT who picks up and delivers; every party sees LIVE STATUS; customers can CANCEL (rules depend on how far the order has progressed — free before acceptance, restricted during prep, impossible after pickup); ratings close the loop. Non-functional: the order flow is CONCURRENT at two hot points — many orders competing for few nearby agents (one agent must never get two simultaneous orders) and one order touched by multiple actors at once (customer cancelling while the restaurant accepts — the transitions race); state must be CONSISTENT and every observed status must correspond to a real transition (no phantom 'delivered' after a cancel); menus CHANGE while orders are open, so an order must be immune to later menu edits; and each transition triggers NOTIFICATIONS to three parties, which must not slow or break the transition itself. Scope for a 45-minute LLD (say it): in-process object design for one city's order flow — search ranking, ETA prediction, maps/routing, and surge pricing are separate systems you name and skip; payments appear as an interface. The two problems that carry the interview: the ORDER LIFECYCLE as a guarded state machine where WHO may trigger WHICH transition FROM which state is explicit, and AGENT DISPATCH as a race you must win atomically. If you get those two right, the rest is composition."),
      C("entities", "Core entities & responsibilities",
        "CUSTOMER — identity, addresses, payment handle; owns a CART (line items with quantities against one restaurant; carts are per-restaurant to keep checkout sane). RESTAURANT — profile, open/closed, and its MENU of MenuItem(id, name, price, available); owns accept/reject and the prep-side transitions. MENUITEM — note it is MUTABLE (prices change, items go out of stock), which is exactly why orders must copy, not reference. ORDER — the aggregate root and the star: id, customer, restaurant, LINE-ITEM SNAPSHOTS (item id, NAME COPY, PRICE COPY, quantity — the order is a legal/financial record of what was agreed at placement; if the restaurant raises the biryani price mid-prep, this order pays the old price), delivery address, totals (items + fees + taxes computed once), payment reference, the STATUS, and a timestamped event log of every transition (the audit trail that settles 'who cancelled first' disputes). It owns transition(next, actor) — the guarded mutation — and nothing about notification or dispatch. DELIVERYAGENT — id, live location (updated by pings), and an ATOMIC availability flag; tryAssign() is its one critical method: compare-and-set free->busy, the linchpin of dispatch correctness. ASSIGNMENTSTRATEGY — interface: given an order and candidate agents, pick and CLAIM one (nearest-available, or rating-weighted, or fairness-balanced — interchangeable). ORDEROBSERVER — interface with onStatusChange(order, from, to); NotificationService (push/SMS to the three parties), AnalyticsSink, and RestaurantConsole are implementations. PAYMENTSERVICE — interface: authorize at placement, capture on delivery or refund on cancel. Responsibility test: 'where is the rule that a READY order can only be PICKED_UP by the ASSIGNED agent?' — inside Order's transition guard, checking both state adjacency and actor identity, in exactly one place."),
      C("design", "Class design & patterns",
        "Composition first: Order references Customer, Restaurant, snapshotted lines, and (after dispatch) one DeliveryAgent; OrderService orchestrates placement (validate cart against the CURRENT menu — items available, restaurant open — then snapshot, authorize payment, create Order(PLACED), request dispatch, notify). Patterns with their WHY: STATE for the order lifecycle — the transition table (from-state, to-state, allowed-actor) is the business spec made executable; scattered status checks (if (status == PREPARING) ...) across service methods is how phantom transitions ship. Whether you implement classic GoF State objects or a static transition TABLE inside Order is taste — the table is less ceremony and easier to audit; say you know both and why you chose the table. OBSERVER for transition fan-out — the state machine must not know about FCM tokens or SMS gateways; observers subscribe, and notification failure (a dead push token) must never roll back a kitchen's ACCEPTED transition, so observers are invoked after-commit and isolated with try/catch (fire-and-forget semantics; a real system makes them async via a queue — say it). STRATEGY for assignment — nearest-available today, multi-factor (rating, load fairness, batching) tomorrow; dispatch policy is a product knob and must be swappable. FACADE — OrderService as the single entry so controllers never poke domain objects directly. DECORATOR is available for pricing (fees, taxes, promo stacking) if the interviewer pulls that thread. Deliberately absent: no Observer for agent location (that's a telemetry stream, not a domain event), no premature microservice talk — this is LLD, keep it in objects — and no god OrderManager doing lifecycle + dispatch + notification in one class, which is the design smell this question is calibrated to catch."),
      K("code", "Core classes (Java)",
`enum OrderStatus { PLACED, ACCEPTED, PREPARING, READY, PICKED_UP, DELIVERED, CANCELLED, REJECTED }
enum Actor { CUSTOMER, RESTAURANT, AGENT, SYSTEM }

class Order {
  final String id; final String customerId, restaurantId;
  final List<LineItem> items;                 // snapshots: (itemId, nameCopy, priceCentsCopy, qty)
  final long totalCents;                      // computed once at placement
  private OrderStatus status = OrderStatus.PLACED;
  private String agentId;                     // set by dispatch
  private final List<OrderObserver> observers = new CopyOnWriteArrayList<>();

  /** from -> (allowed next, who may trigger it) */
  private static final Map<OrderStatus, Map<OrderStatus, Actor>> LEGAL = Map.of(
      OrderStatus.PLACED,    Map.of(OrderStatus.ACCEPTED, Actor.RESTAURANT,
                                    OrderStatus.REJECTED, Actor.RESTAURANT,
                                    OrderStatus.CANCELLED, Actor.CUSTOMER),
      OrderStatus.ACCEPTED,  Map.of(OrderStatus.PREPARING, Actor.RESTAURANT,
                                    OrderStatus.CANCELLED, Actor.CUSTOMER),   // fee may apply
      OrderStatus.PREPARING, Map.of(OrderStatus.READY, Actor.RESTAURANT),
      OrderStatus.READY,     Map.of(OrderStatus.PICKED_UP, Actor.AGENT),
      OrderStatus.PICKED_UP, Map.of(OrderStatus.DELIVERED, Actor.AGENT));

  Order(String id, String customerId, String restaurantId, List<LineItem> items, long totalCents) {
    this.id = id; this.customerId = customerId; this.restaurantId = restaurantId;
    this.items = List.copyOf(items); this.totalCents = totalCents;
  }
  synchronized void transition(OrderStatus next, Actor by, String actorId) {
    Map<OrderStatus, Actor> allowed = LEGAL.getOrDefault(status, Map.of());
    if (allowed.get(next) != by)
      throw new IllegalStateException(status + " -> " + next + " not allowed for " + by);
    if (next == OrderStatus.PICKED_UP && !actorId.equals(agentId))
      throw new IllegalStateException("only the assigned agent may pick up");
    OrderStatus prev = status;
    status = next;                                        // commit inside the lock…
    for (OrderObserver o : observers)                     // …then fan out; failures isolated
      try { o.onStatusChange(this, prev, next); } catch (RuntimeException ignored) {}
  }
  synchronized void assignAgent(String agentId) {
    if (status != OrderStatus.ACCEPTED && status != OrderStatus.PREPARING)
      throw new IllegalStateException("assign only after acceptance");
    this.agentId = agentId;
  }
  void addObserver(OrderObserver o) { observers.add(o); }
  synchronized OrderStatus status() { return status; }
}

interface OrderObserver { void onStatusChange(Order o, OrderStatus from, OrderStatus to); }
record LineItem(String itemId, String name, long priceCents, int qty) {}

class DeliveryAgent {
  final String id; volatile double lat, lon;
  private final AtomicBoolean busy = new AtomicBoolean(false);
  DeliveryAgent(String id) { this.id = id; }
  boolean tryAssign() { return busy.compareAndSet(false, true); }  // exactly-one winner
  void release() { busy.set(false); }                              // after delivery/decline
}

interface AssignmentStrategy { Optional<DeliveryAgent> assign(Order o, List<DeliveryAgent> nearby); }
class NearestAvailableStrategy implements AssignmentStrategy {
  public Optional<DeliveryAgent> assign(Order o, List<DeliveryAgent> nearby) {
    return nearby.stream()                       // pre-sorted by distance to restaurant
        .filter(DeliveryAgent::tryAssign)        // CAS claim: losers just skip
        .findFirst();
  }
}`),
      C("deep_dive", "Deep dive: the order state machine — guards, actors & racing transitions",
        "The state machine looks trivial until you add its three hard requirements. (1) ACTOR GUARDS: each edge is legal only for a specific party — the restaurant accepts, the CUSTOMER cancels, only the ASSIGNED agent picks up (checking actor identity, not just role — any courier scanning any bag is a real fraud vector). Encoding (from, to, actor) in one table makes the spec reviewable by a product manager and testable edge-by-edge; scattering it as status checks inside a dozen service methods guarantees one path forgets a guard. (2) RACING TRANSITIONS: the canonical case — customer taps Cancel at the same instant the restaurant taps Accept, from PLACED. Both are individually legal, but they conflict; correctness = SERIALIZE per order (the synchronized transition, or per-order lock/optimistic version in a store) so one commits first and the second is validated against the NEW state: if Cancel wins, Accept throws (order is CANCELLED — kitchen sees 'order cancelled' instead of starting prep); if Accept wins, the cancel request is re-evaluated under ACCEPTED-state rules (maybe allowed with a fee, per policy). The resolution is not 'prevent the race' — you cannot — it is 'make one winner and give the loser a truthful, current-state answer'. This exact scenario is the most asked follow-up in this question's history; walk it unprompted. (3) TERMINAL AND COMPENSATING PATHS: REJECTED (restaurant declines -> auto-refund), CANCELLED (refund policy varies by the state it was cancelled FROM — free from PLACED, maybe a prep fee from ACCEPTED/PREPARING — which falls out naturally because the transition knows its from-state), and the ugly real-world edges you should name: agent picks up and vanishes (timeout watchdog -> SYSTEM actor transitions to a FAILED/compensation flow, re-dispatch or refund), restaurant never responds (SYSTEM auto-reject after T minutes — a timer-driven transition, so SYSTEM must be an actor in the table). Persisting the per-transition EVENT LOG (timestamp, actor, from, to) turns disputes ('I cancelled before they accepted!') into a lookup instead of an argument — and mentioning that the log is effectively event sourcing for the order is a tidy senior flourish."),
      C("deep_dive", "Deep dive: agent dispatch — geo-candidates, the atomic claim & offers",
        "Dispatch is a two-phase problem, and separating the phases is the insight. PHASE 1 — CANDIDATE GENERATION (read-only, approximate): find agents NEAR the restaurant. Agents ping locations every few seconds; index them in a geo structure — geohash buckets or a simple grid: hash each agent's location to a cell, then candidate lookup = the restaurant's cell + 8 neighbors, expanding rings until you have enough candidates; sort by distance (haversine — straight-line is fine for candidates; road ETA is a routing-service refinement you name and skip). Staleness is fine here: candidates are a HINT. PHASE 2 — THE CLAIM (authoritative, atomic): the assignment strategy walks sorted candidates calling agent.tryAssign() — an AtomicBoolean compareAndSet(false, true). Two orders racing for the same nearest agent CANNOT both win a CAS: the loser's stream just moves to the next candidate. This mirrors the parking-lot spot claim — advisory search, atomic claim — and recognizing the shared pattern across problems is exactly what interviewers reward. Now the real-world layer: real platforms don't hard-assign — they OFFER: the chosen agent gets a ping with an accept window (say 20s); the agent's flag is held RESERVED during the offer; on decline/timeout, release and offer the next candidate. Model it as a mini state machine on the assignment itself (OFFERED -> ACCEPTED / DECLINED / TIMED_OUT), driven by a scheduler — and note the failure edge: if the offer service crashes after reserving an agent, a TTL on the reservation prevents a rider being stuck 'busy' forever (the leaked-claim problem again — same medicine: expiring holds). Batching (one agent, two orders from the same restaurant) upgrades the claim from a boolean to a capacity counter and makes the strategy multi-order aware — a strategy-level change, zero changes to Order. Fairness (don't starve far-but-idle agents) is a scoring term in the strategy. That is the payoff of Strategy + atomic-claim separation: every product iteration lands in the strategy; the correctness core never moves."),
      C("tradeoffs", "Trade-offs & extension points",
        "Decisions and their alternatives. TRANSITION TABLE vs GoF STATE CLASSES: the table (chosen) is compact, auditable, and diff-able when product edits rules; State classes shine when each state carries substantial distinct BEHAVIOR (per-state timeout policies, per-state UI payloads) — know both, justify one. SNAPSHOT vs REFERENCE for order lines: snapshot (chosen) makes the order a stable financial record immune to menu edits; referencing MenuItem live means a price change mid-order rewrites history — a correctness bug dressed as normalization; the cost (duplicated name/price bytes) is trivially worth it. Push OBSERVERS vs POLLING for status: observers give timely fan-out and decouple channels; in-process synchronous observers (shown) are fine for LLD but say the production form — transition commits, then an event goes to a queue, notification workers consume — so a dead SMS gateway can never slow a kitchen. HARD-ASSIGN vs OFFER dispatch: hard-assign is simpler and interviews often accept it; offers respect rider agency and need reservation TTLs — surface the trade explicitly. GEO INDEX: grid/geohash buckets (chosen — simple, O(1) updates) vs quadtree/k-d (better for wildly non-uniform density; more code) vs 'query a DB with lat/lon between' (fails at ping write rates). Extension questions interviewers reach for and where they land: SCHEDULED orders — a future-dated PLACED with a timer-driven entry into the live flow; MULTI-RESTAURANT carts — split into per-restaurant orders sharing a payment, each with its own lifecycle; SURGE/DELIVERY-FEE pricing — a pricing strategy/decorator at quote time, snapshotted like everything else; RATINGS — a post-DELIVERED observer; ETA — a projection from status + location, read-side only, never a state. The shape to leave in the interviewer's head: one guarded state machine at the center, claims made atomic at the edges, and every policy — dispatch, pricing, cancellation — swappable around it."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Customer cancels exactly as the restaurant accepts?' — per-order serialization: one transition commits first, the second is re-validated against the new state and either throws (Accept after CANCELLED) or is re-evaluated under new rules (Cancel after ACCEPTED may carry a fee); you cannot prevent the race, you make one winner and tell the loser the truth — and the event log proves the ordering afterward. 'Two orders, one nearest agent?' — candidate search is advisory; the claim is an AtomicBoolean CAS on the agent — exactly one order wins, the other takes the next candidate; same advisory-search/atomic-claim pattern as parking spots and hotel rooms. 'Restaurant raises the price mid-order?' — irrelevant to in-flight orders: lines are snapshots (id + name + price copies) taken at placement; the order is a financial record, not a view over a mutable menu. 'Agent goes offline holding an order?' — reservation/assignment TTL + watchdog: SYSTEM-actor transition into re-dispatch or refund; every hold in the system (agent claim, offer, payment auth) needs an expiry — leaked holds are the silent killer. 'How do notifications not break transitions?' — commit the state change first, then fan out to observers isolated by try/catch (async queue in production); a dead push token must never roll back a kitchen. 'Restaurant never responds?' — SYSTEM auto-reject after a timeout: timers are first-class transition triggers, which is why Actor.SYSTEM exists in the table. 'How would this scale?' — the Order machine becomes a row with a version column (optimistic CAS on transitions), the event log becomes an outbox feeding queues, dispatch becomes a service owning the geo index — the OBJECT design survives; only the enforcement mechanics change. Close on the spine: guarded actor-checked state machine + snapshot lines + atomic agent claim + observer fan-out."),
    ],
    "Food delivery is the richest state-machine question in the LLD set: the interviewer is testing whether you make the order lifecycle EXPLICIT — a (from, to, actor) transition table with per-order serialization — and then handle the two canonical races: customer-cancel vs restaurant-accept (one winner, loser re-validated against the new state) and two orders claiming one nearest agent (advisory geo search + atomic CAS claim, the same pattern as parking spots). Secondary signals: snapshotting menu prices into the order so mutable menus can't rewrite financial history, Observer fan-out that can never fail a transition, Strategy-isolated dispatch policy, and TTLs on every hold (offers, claims, auths) so nothing leaks. Candidates who bury status logic in service-method if-chains fail this question regardless of how good their class list looks.",
    [
      G("scattered_status_ifs", "Enforcing lifecycle rules with status checks sprinkled across service methods instead of one guarded transition path.", "Centralize a (from, to, actor) transition table inside Order with a single synchronized transition() method; every rule becomes one row, every violation throws, and racing transitions serialize per order.", "if (order.getStatus() == PLACED) order.setStatus(ACCEPTED) in controllers/services; a public setStatus; phantom transitions reachable via paths that skipped one check."),
      G("live_menu_reference", "Order lines referencing live MenuItem objects, so menu edits mutate in-flight and historical orders.", "Snapshot (itemId, name, price, qty) into the order at placement and compute totals once — an order is an immutable financial record of what was agreed.", "Order stores List<MenuItem>; receipt totals change after a price edit; 'item removed from menu' breaks rendering of past orders."),
      G("nonatomic_agent_claim", "Selecting the nearest agent and then setting agent.busy = true as separate steps, double-booking riders under concurrent dispatch.", "Claim atomically: AtomicBoolean.compareAndSet(false,true) in tryAssign(); search results are advisory, losers skip to the next candidate; offers/reservations carry TTLs so crashed dispatchers can't strand agents.", "findNearest() then setBusy(true) with no CAS; the same agentId appears on two live orders under load; agents stuck busy after a dispatcher crash."),
    ],
    0.5, DIAG.food, "Food delivery class diagram"),

  // ───────────────────────── DIGITAL WALLET ──────────────────────────────────
  TT("lld_m10", "lld_m10_t3", 3, "Design a Digital Wallet", "design-digital-wallet",
    ["case-study", "concurrency", "ledger"],
    "Alice taps Pay twice on a flaky connection; Bob and Carol send Alice money at the same instant she's paying rent; an auditor asks why Alice's balance is 412.50 and expects an answer to the cent, provable from records. Money must never be created, destroyed, or double-spent — under retries, races, and crashes. How do you design a Digital Wallet?",
    "Make the LEDGER the source of truth: every operation appends immutable double-entry LedgerEntries (a debit and a credit that sum to zero) inside one atomic unit, and the Account balance is a derived, verifiable cache. Transfers lock both accounts in GLOBAL ID ORDER (killing deadlock), check-and-debit under the lock (no negative balances), and every request carries an IDEMPOTENCY KEY so Alice's double-tap and every network retry map to one transaction. Amounts are long cents — never float. Transaction is a small state machine (PENDING -> SUCCESS/FAILED/REVERSED) because external rails fail halfway.",
    [
      C("requirements", "Requirements",
        "Functional: users hold a WALLET with one or more ACCOUNTS (main balance, maybe cashback/bonus buckets); they TOP UP from external sources (card/bank), TRANSFER wallet-to-wallet (peer-to-peer and merchant pay), WITHDRAW back to a bank, and view BALANCE and TRANSACTION HISTORY. Non-functional — and in this problem the non-functionals ARE the problem: CORRECTNESS OF MONEY above all — no operation may create or destroy value (conservation: every debit has a matching credit), no balance may go below its floor (no overdraft unless a product explicitly grants credit), and every balance must be EXPLAINABLE — reconstructible from an immutable record trail, because auditors, disputes, and regulators demand it; CONCURRENCY SAFETY — the same account is debited and credited by simultaneous operations (Alice pays rent while two people pay her) and parallel transfers between overlapping account pairs must neither deadlock nor race; IDEMPOTENCY — mobile networks retry, users double-tap, and a retried 'pay 500' must execute EXACTLY ONCE; PARTIAL FAILURE — top-ups and withdrawals cross into external systems (banks, card rails) that succeed slowly, fail late, or time out ambiguously, so internal state must track in-flight money explicitly. Clarify scope out loud: single currency (multi-currency adds FX legs — extension, not core); this is the in-process/domain design — the same invariants become DB transactions at scale; regulatory KYC/AML are boundary checks you name and skip. The two hard mechanics the interviewer is actually probing: the DOUBLE-ENTRY LEDGER as source of truth (balance as derived data), and the CONCURRENT TRANSFER protocol (lock ordering + atomicity + idempotency). Everything else hangs off those."),
      C("entities", "Core entities & responsibilities",
        "USER — identity + KYC status; owns wallets but touches no money logic. ACCOUNT — a balance container: id, ownerId, TYPE (user main, user bonus — and crucially SYSTEM accounts: an external-clearing account for top-ups/withdrawals in flight, a fee-revenue account; modeling the outside world as accounts is what keeps double-entry closed), balance in LONG CENTS (never float/double — 0.1 + 0.2 != 0.3 is a career-limiting bug in a wallet; BigDecimal is acceptable, integer minor units are cleaner and faster), and a currency code. It exposes NO public setBalance — balance mutates only through the ledger path. LEDGERENTRY — the atom of truth: immutable, append-only: (entryId, transactionId, accountId, signed amountCents, resulting balanceAfter, timestamp). Entries are never updated or deleted; corrections are new COMPENSATING entries (reversal, not erasure) — that is what makes the history an audit trail rather than a mutable table. TRANSACTION — groups the entries of one logical operation: id, type (TRANSFER/TOPUP/WITHDRAW/REVERSAL), state machine PENDING -> SUCCESS / FAILED / REVERSED, the idempotency key that created it, and references to its entries; the INVARIANT: a transaction's entries sum to ZERO (transfer: -500 from Alice, +500 to Bob; top-up: -500 from external-clearing, +500 to Alice; fees: three legs, still zero). WALLETSERVICE — the orchestrator owning the transfer protocol: validation, lock acquisition in global order, conservation check, append entries + update balances atomically, release. IDEMPOTENCYSTORE — requestKey -> transactionId (+ result), checked FIRST on every mutating call; the replay answer for retries. EXTERNALGATEWAY — interface to bank/card rails: initiate, and deliver async success/failure callbacks — the reason PENDING exists. Responsibility test: 'why is Alice's balance 412.50?' — SELECT her ledger entries; the sum IS the answer, and balanceAfter on each entry makes any historical point-in-time balance a lookup."),
      C("design", "Class design & patterns",
        "The design principle outranking any pattern here: BALANCE IS DERIVED DATA; THE LEDGER IS TRUTH. Account.balance is a materialized convenience kept consistent with the entry stream (updated in the same atomic unit that appends entries) and re-derivable at any time — a nightly reconciliation job re-sums entries per account and alarms on drift, turning silent corruption into a paged alert. This is double-entry bookkeeping, five centuries old, and naming it as the design's backbone is the strongest single sentence you can say in this interview. Class relationships: User 1..* Account; Transaction 1..* LedgerEntry (summing to zero); WalletService depends on accounts, the idempotency store, and the ExternalGateway INTERFACE. Patterns where they genuinely apply: COMMAND — each money operation (TransferCommand, TopUpCommand) is an object carrying its parameters + idempotency key; commands give you a uniform execute/validate/log pipeline and a natural retry unit. STATE for Transaction — PENDING/SUCCESS/FAILED/REVERSED with legal-transition guards (SUCCESS is terminal except via a compensating REVERSED; FAILED never becomes SUCCESS — a new attempt is a NEW transaction). STRATEGY for fee calculation (per corridor/merchant tier) and limits (per-KYC-level daily caps) — policy knobs, injected. OBSERVER for post-commit notifications (push 'you received 500', fraud-scoring taps the event stream) — strictly after the atomic commit, never inside it. TEMPLATE METHOD is defensible for the shared operation skeleton (idempotency check -> validate -> lock -> ledger -> unlock -> notify) with per-type steps overridden. Deliberately absent: no getter/setter 'Balance' bean (the API IS the ledger operations); no floating point anywhere; no soft-deleting or editing ledger rows ever — and say each 'no' out loud, because in a wallet interview the things you refuse to allow are as informative as the things you build."),
      K("code", "Core classes (Java)",
`class Account {
  final String id; final String ownerId; final String currency;
  private long balanceCents;                       // mutated ONLY via postEntry
  private final List<LedgerEntry> entries = new ArrayList<>();
  Account(String id, String ownerId, String currency) {
    this.id = id; this.ownerId = ownerId; this.currency = currency;
  }
  long balance() { return balanceCents; }
  /** Caller must hold this account's lock. Appends entry + updates derived balance together. */
  LedgerEntry postEntry(String txnId, long signedAmountCents) {
    long next = balanceCents + signedAmountCents;
    if (next < 0) throw new IllegalStateException("insufficient funds in " + id);
    balanceCents = next;
    LedgerEntry e = new LedgerEntry(UUID.randomUUID().toString(), txnId, id,
                                    signedAmountCents, next, Instant.now());
    entries.add(e);
    return e;
  }
}

/** Immutable. Corrections are new compensating entries — never edits. */
record LedgerEntry(String entryId, String txnId, String accountId,
                   long amountCents, long balanceAfterCents, Instant at) {}

enum TxnState { PENDING, SUCCESS, FAILED, REVERSED }

class WalletService {
  private final Map<String, Account> accounts = new ConcurrentHashMap<>();
  private final Map<String, Object> locks = new ConcurrentHashMap<>();      // accountId -> lock
  private final Map<String, String> idempotency = new ConcurrentHashMap<>(); // requestKey -> txnId

  private Object lockFor(String accountId) {
    return locks.computeIfAbsent(accountId, k -> new Object());
  }

  /** Exactly-once, deadlock-free, all-or-nothing transfer. */
  String transfer(String requestKey, String fromId, String toId, long amountCents) {
    if (amountCents <= 0) throw new IllegalArgumentException("amount must be positive");
    if (fromId.equals(toId)) throw new IllegalArgumentException("self-transfer");
    String prior = idempotency.get(requestKey);          // 1) replay check FIRST
    if (prior != null) return prior;                     //    retry returns the same txn

    Account from = accounts.get(fromId), to = accounts.get(toId);
    // 2) GLOBAL LOCK ORDER: always lock the smaller id first — no deadlock possible
    Object first  = lockFor(fromId.compareTo(toId) < 0 ? fromId : toId);
    Object second = lockFor(fromId.compareTo(toId) < 0 ? toId : fromId);
    synchronized (first) {
      synchronized (second) {
        String existing = idempotency.putIfAbsent(requestKey, "RESERVED"); // 3) re-check inside
        if (existing != null && !existing.equals("RESERVED")) return existing;
        String txnId = UUID.randomUUID().toString();
        from.postEntry(txnId, -amountCents);             // throws if insufficient — nothing written
        to.postEntry(txnId, +amountCents);               // debit + credit sum to ZERO
        idempotency.put(requestKey, txnId);              // 4) record result under the same locks
        return txnId;
      }
    }
  }
}`),
      C("deep_dive", "Deep dive: the double-entry ledger — why balance is derived data",
        "The amateur design stores balance as a mutable column and updates it: balance = balance - 500. Everything wrong with wallets follows from that line: lost updates under concurrency (two threads read 1000, both write their own answer, one credit vanishes), no explanation for any balance (the auditor question is unanswerable), no way to detect corruption (a bug that added 1 cent to a million accounts is invisible), and disputes decided by logs if you're lucky. The professional design inverts it: the LEDGER — an append-only sequence of immutable signed entries — IS the account, and 'balance' is a cached SUM. Now walk what each invariant buys, concretely. CONSERVATION (entries of a transaction sum to zero): money moves but never appears or vanishes; a platform-wide sum of ALL entries is always zero, which makes 'did we leak money anywhere?' a single query — this is why external rails get modeled as internal SYSTEM accounts (a top-up is external-clearing -500 / Alice +500, not 'Alice +=500 from nowhere'). IMMUTABILITY (no update/delete, corrections are compensating entries): the history is evidence — a reversal appends Bob -500 / Alice +500 with a link to the original transaction, and both the mistake AND its correction remain visible forever; 'fixing' by editing rows destroys exactly the property regulators pay for. BALANCE-AFTER on each entry: point-in-time balances ('what did Alice have on March 3?') become lookups, and reconciliation (re-derive each balance from entries, compare to the cached column, alarm on drift) becomes a mechanical nightly job — drift means a code path mutated balance outside the ledger, and the check CATCHES it instead of trusting it. Precision discipline completes the picture: amounts are LONG CENTS (integer minor units); floating point cannot represent 0.10 and its errors compound silently across millions of entries; even division (splitting a bill three ways) must be explicit about the remainder cent — assign it deterministically, don't let it evaporate. When you say 'balance is a materialized view over an immutable event log' you have also, quietly, described event sourcing — connect the two and the interviewer knows you see the general shape, not just the wallet."),
      C("deep_dive", "Deep dive: concurrency, deadlock & exactly-once transfers",
        "Three failure modes, three mechanisms — keep them distinct. RACE (lost update): concurrent operations on one account must serialize; a per-account LOCK makes check-balance + debit one atomic step — the check 'balance >= amount' and the write must happen under the SAME lock, or two 600-rupee payments both pass the check against a 1000 balance. DEADLOCK: a transfer locks TWO accounts, so A->B racing B->A is the textbook cycle: each holds its first lock, waits for the other, forever. The classical kill is a GLOBAL LOCK ORDER — always acquire in canonical (id-sorted) order regardless of transfer direction; both racing transfers then contend for the SAME first lock and simply serialize; a cycle cannot form because the wait-for graph respects a total order. This is the single most-asked concurrency question in wallet interviews — write the two-line compareTo ordering without prompting. (Alternatives worth naming: tryLock with timeout + backoff-retry — livelock-prone but ordering-free; or single-writer-per-account via sharded queues — the actor-ish design that removes locks entirely at the cost of async programming; at database scale, SELECT ... FOR UPDATE in id order, or optimistic version-check retries.) EXACTLY-ONCE (idempotency): the network cannot give you exactly-once delivery, so you build exactly-once EFFECT: the client generates a REQUEST KEY per logical action (one tap = one key, retries reuse it); the service checks the idempotency store first and replays the recorded result on a hit; the (key -> transaction) record is committed IN THE SAME atomic unit as the ledger entries, so a crash between 'money moved' and 'key recorded' is impossible — that co-commit is the detail that separates people who've built this from people who've read about it. Layer PARTIAL FAILURE on top for external legs: a bank withdrawal debits Alice into a clearing account (PENDING transaction), then calls the rail; success finalizes, explicit failure compensates (clearing -> Alice back), and TIMEOUT — the ambiguous case — resolves by QUERYING the rail's status API or waiting for its webhook, never by guessing, with a reconciliation sweep for transactions stuck PENDING past SLA. Money you cannot yet classify stays visibly in-flight in clearing — never silently returned, never silently kept."),
      C("tradeoffs", "Trade-offs & extension points",
        "Alternatives, honestly weighed. MUTABLE BALANCE COLUMN vs LEDGER-DERIVED: the mutable column is simpler and fine for a game's gold counter; real money needs the audit/conservation/reconciliation properties — and the hybrid everyone ships (cached balance + authoritative ledger + drift alarms) gives O(1) reads with provable correctness. LOCK ORDERING vs OPTIMISTIC (version-stamped accounts, retry on conflict): optimistic wins under low contention and avoids lock management; a hot merchant account (thousands of credits/minute) becomes a retry storm — pessimistic per-account serialization, or a single-writer queue per hot account, handles skew better; say 'depends on contention profile' and mean it. PER-ACCOUNT LOCKS vs ONE GLOBAL LOCK: the global lock is correct and dies at scale — but starting there and refining is legitimate interview technique; per-account striping is the real answer. SYNC vs ASYNC external legs: synchronous top-up ('wait for the card rail') is simpler UX but couples your latency to a bank; PENDING + webhook is how production works — the state machine is the price. LONG CENTS vs BIGDECIMAL: cents are fast, unambiguous, and force explicit rounding decisions; BigDecimal handles multi-precision currencies (JPY has no minor unit; BHD has three) — for multi-currency, store (amount, currency, scale) minor units and never mix currencies in one arithmetic expression without an explicit FX transaction leg. Extension points interviewers reach for: HOLDS/AUTHORIZATIONS (reserve funds without moving them — an authorized-amount bucket per account or hold-typed entries; available = balance - holds); scheduled/recurring payments (Command objects + a scheduler); spending LIMITS per KYC tier (strategy checked pre-lock); FRAUD scoring (observer on the transaction stream, can force PENDING -> review); MULTI-CURRENCY (per-currency accounts + FX transactions with a rate snapshot and four legs); STATEMENTS (a pure read over the ledger — free, because the ledger was the design). Every extension is additive; nothing touches the transfer core — which is the sentence to close the interview with."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'User taps Pay twice — two deductions?' — one logical action = one client-generated idempotency key; retries reuse it; the service replays the stored result on a key hit, and the key->txn record commits atomically WITH the ledger entries so no crash window exists between effect and record. 'A->B and B->A at the same time?' — deadlock unless locks are acquired in a global (id-sorted) order; both transfers then serialize on the same first lock; alternatives are tryLock+timeout+retry or per-account single-writer queues — name the ordering rule first, it's the expected answer. 'Why can't balance just be a column you update?' — lost updates, unexplainable balances, invisible corruption; the ledger gives conservation (entries sum to zero, platform-wide sum is zero), auditability (every cent has a paper trail), and reconciliation (re-derive balances nightly, alarm on drift); the column survives only as a derived cache. 'Bank withdrawal times out?' — the money sits explicitly in a clearing account under a PENDING transaction; resolve by querying the rail / awaiting the webhook, then finalize or compensate; a sweeper escalates stuck-PENDING past SLA; never guess an ambiguous outcome. 'Refunds/mistakes?' — compensating REVERSED transactions that append opposite entries linked to the original; history is never edited — the error and the fix are both permanent record. 'Why long cents?' — binary floats can't represent 0.10; errors compound across millions of entries; integer minor units force explicit remainder handling (who gets the odd cent of a 3-way split — decide, deterministically). 'Scale it out?' — the objects map straight down: per-account locks become row locks/optimistic versions, the atomic unit becomes a DB transaction, hot accounts get single-writer queues, and cross-shard transfers escalate to sagas with compensations — the ledger + idempotency + ordering spine is exactly what survives the journey, which is why it's the spine."),
    ],
    "A wallet interview is a correctness interview wearing a product costume: the signal is whether you refuse a mutable balance column (double-entry ledger as source of truth, balance as derived/reconciled cache, corrections as compensating entries), whether your transfer protocol is simultaneously race-free (check+debit under one per-account lock), deadlock-free (global lock ordering by account id — the single most-predictable follow-up), and exactly-once (client idempotency keys whose result records commit atomically with the ledger entries), and whether you treat external rails as PENDING-state machines with clearing accounts instead of pretending banks answer synchronously. Long-cents arithmetic and 'never edit history' round out the discipline; any float, any setBalance, any editable ledger row is an automatic downlevel.",
    [
      G("mutable_balance_truth", "Storing balance as a mutable field updated in place, with no ledger — unexplainable, unauditable, and prone to lost updates.", "Append immutable double-entry LedgerEntries (debit+credit summing to zero) as the source of truth; keep balance as a derived cache updated in the same atomic unit and reconciled nightly against the entry sum.", "setBalance()/balance += x calls; no transaction groups entries; 'why is the balance X?' answerable only from application logs."),
      G("unordered_two_locks", "Locking source-then-destination in transfer order, deadlocking the moment A->B races B->A.", "Acquire both account locks in a global canonical order (sort by account id); racing opposite transfers then serialize on the same first lock and a wait cycle cannot form.", "synchronized(from) { synchronized(to) { … } } with argument order; intermittent frozen transfers under bidirectional load; thread dumps show the classic 2-lock cycle."),
      G("no_idempotency_commit", "Handling retries with no idempotency key — or recording the key outside the money-moving atomic unit, leaving a crash window that double-pays.", "Require a client request key per logical action, check it first, and commit key->transaction IN the same atomic unit as the ledger entries; retries replay the recorded result.", "Double-tap produces two transactions; or key stored after the transfer commits, so a crash between the two yields duplicate money movement on retry."),
    ],
    0.5, DIAG.wallet, "Digital wallet class diagram"),

  // ───────────────────────── DECK OF CARDS ───────────────────────────────────
  TT("lld_m10", "lld_m10_t4", 4, "Design a Deck of Cards (Card Game)", "design-deck-of-cards",
    ["case-study", "immutability", "extensibility"],
    "You're asked for a deck of cards — sounds trivial. Then: make the shuffle provably UNBIASED, make Ace high in one game and low in another WITHOUT touching the Card class, and build Blackjack on top — where an Ace counts 1 or 11 and the dealer's play is fixed policy. The 'easy' question is a purity test for modeling instincts. How do you design a Deck of Cards and a game on top of it?",
    "Card is an IMMUTABLE value (Suit x Rank enums — 52 combinations, enums make illegal cards unrepresentable); Deck owns dealing and delegates shuffling to a Fisher–Yates strategy seeded by an injectable Random (SecureRandom where money's involved, seeded Random for replayable tests); rank ORDERING is an injected Comparator because it's a GAME rule, not a card property; and Game is a template — generic Deck/Hand machinery below, per-game rules (Blackjack's soft-ace hand value, dealer-hits-to-17 policy) in subclasses. The design lesson IS the layering.",
    [
      C("requirements", "Requirements",
        "Functional: model a standard 52-card deck — four SUITS x thirteen RANKS; SHUFFLE it uniformly (every one of the 52! orderings equally likely — 'looks shuffled' is not the spec, uniform is); DEAL cards one at a time or n at a time to players' HANDS, with dealing from an empty deck handled explicitly (exception, or reshuffle-from-discard depending on the game — ask); and support building an actual GAME on top, with Blackjack as the canonical ask: hit/stand turns, the dealer's fixed drawing policy, hand valuation where an ACE counts 1 OR 11, bust detection, and win resolution. Non-functional — and this is where the 'trivial' question earns its place in interview rotations: EXTENSIBILITY is the real requirement. The generic layer (Card/Deck/Hand) must know NOTHING about any particular game; per-game facts — is Ace high or low? does a King outrank an Ace? are there Jokers? multi-deck shoes? — must attach WITHOUT modifying the generic classes (open-closed, demonstrated rather than recited). CORRECTNESS of the shuffle is a named requirement because the naive shuffle is BIASED in a way most engineers have shipped without knowing; and for online play with stakes, the randomness SOURCE is a security requirement (predictable seeds have famously let players predict entire decks — the 1999 PlanetPoker exploit is the citation if you want one). Also worth pinning: cards must be IMMUTABLE values (two Aces of Spades from two decks are interchangeable — value semantics), and a Card must never carry game state (selected, faceUp, owner) — that state belongs to whoever holds the card. Scope: in-memory objects, two players + dealer scale; no networking, no persistence — say it and move on."),
      C("entities", "Core entities & responsibilities",
        "SUIT — enum: SPADES, HEARTS, DIAMONDS, CLUBS. RANK — enum: TWO..TEN, JACK, QUEEN, KING, ACE. The enum choice is load-bearing, not cosmetic: enums make ILLEGAL CARDS UNREPRESENTABLE (no rank 14, no suit 'Stars', no null suit) — the type system enforces what validation code would otherwise check at runtime. Deliberately, Rank carries NO universal numeric value: is Ace 1 or 14? Is a King worth 10 (Blackjack) or 13? Those are GAME facts; baking a value into the enum is the subtle modeling error this question exists to catch. CARD — an immutable value pair (rank, suit): final fields, equals/hashCode by value (a Java record is the perfect fit); exactly 52 distinct values; safely shareable, hashable, printable. It has no compareTo — see below. DECK — a mutable SEQUENCE of cards with dealing state: builds the full 52 in a canonical order via a nested loop over both enums (values() makes this two lines), shuffle(), deal()/deal(n), remaining(); deals from the top via an index or by popping — and throws (or triggers a reshuffle policy) on empty rather than returning null. A multi-deck SHOE is the same class with a deck-count constructor arg. SHUFFLESTRATEGY — interface owning HOW randomness is applied: the Fisher–Yates implementation takes a Random in its constructor — injected, so production uses SecureRandom and tests use new Random(42) for reproducible sequences; the seam exists for TESTABILITY as much as for swapping algorithms. HAND — the cards a player currently holds: add, reveal, and (per game) evaluate; in Blackjack the hand owns value() with soft-ace logic. PLAYER — identity + hand + (if staked) a chip count. GAME — abstract: owns deck, players, and the TURN LOOP; subclasses supply the rules. COMPARATOR<CARD> instances — ACE_HIGH, ACE_LOW — are how ordering exists at all: as pluggable game-level policy, not card-level truth."),
      C("design", "Class design & patterns",
        "The architecture is two strict LAYERS, and the interview is won by keeping the boundary clean. GENERIC LAYER: Suit, Rank, Card, Deck, Hand, ShuffleStrategy — reusable for poker, rummy, bridge, war, solitaire; it contains zero game logic, zero card values, zero ordering. GAME LAYER: Game subclasses (BlackjackGame, PokerGame) plus their policies — hand evaluation, rank ordering comparators, dealer behavior, payout rules. Patterns and their justifications: STRATEGY for shuffling (algorithm + randomness source injected — enables SecureRandom in production, seeded determinism in tests, and a rigged NoOpShuffle for setting up exact test scenarios, which is the pattern's most practical payoff) and for per-game policies like the dealer's drawing rule (hit-below-17 as a strategy makes 'dealer hits soft 17' — a real casino rule variant — a one-line config, and that's a lovely concrete example to give); TEMPLATE METHOD in Game: the abstract class fixes the skeleton — setup (shuffle, deal initial hands), loop turns until done, resolve winners — while subclasses fill in dealRules(), playTurn(), scoreHands(); COMPARATOR-AS-POLICY for ordering: Card implements NO Comparable (there is no universal order — Ace's position, suit precedence in bridge vs none in blackjack); instead games hold Comparator<Card> constants — this is the crispest possible demonstration of 'behavior that varies by context must not live on the shared type'; FACTORY only if variant decks (Jokers, pinochle's 48-card deck) enter the conversation — a DeckFactory then centralizes composition; don't build it speculatively. Anti-patterns to name and dodge: getValue() on Rank (whose value? which game?); boolean flags on Card (faceUp, selected — presentation/session state on a value object); Deck extends ArrayList (inheritance for implementation — Deck HAS a list and exposes deck operations only, or callers will index-shuffle behind your back); and a Game god class that also owns shuffling mechanics."),
      K("code", "Core classes (Java)",
`enum Suit { SPADES, HEARTS, DIAMONDS, CLUBS }
enum Rank { TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, JACK, QUEEN, KING, ACE }

/** Immutable value type: 52 possible values, equality by content. No ordering here. */
record Card(Rank rank, Suit suit) {}

interface ShuffleStrategy { void shuffle(List<Card> cards); }

class FisherYatesShuffle implements ShuffleStrategy {
  private final Random rng;                       // inject SecureRandom for real stakes,
  FisherYatesShuffle(Random rng) { this.rng = rng; } // new Random(seed) for reproducible tests
  public void shuffle(List<Card> cards) {
    for (int i = cards.size() - 1; i > 0; i--) {
      int j = rng.nextInt(i + 1);                 // j in [0, i] INCLUSIVE — the crux
      Collections.swap(cards, i, j);
    }
  }
}

class Deck {
  private final List<Card> cards = new ArrayList<>();
  private final ShuffleStrategy shuffler;
  Deck(ShuffleStrategy shuffler, int deckCount) { // deckCount > 1 => a shoe
    this.shuffler = shuffler;
    for (int d = 0; d < deckCount; d++)
      for (Suit s : Suit.values())
        for (Rank r : Rank.values())
          cards.add(new Card(r, s));
  }
  void shuffle() { shuffler.shuffle(cards); }
  Card deal() {
    if (cards.isEmpty()) throw new IllegalStateException("deck exhausted");
    return cards.remove(cards.size() - 1);        // O(1) from the tail
  }
  int remaining() { return cards.size(); }
}

class BlackjackHand {
  private final List<Card> cards = new ArrayList<>();
  void add(Card c) { cards.add(c); }
  /** Aces count 11 while it doesn't bust, else 1 — count them as 1, then upgrade ONE if room. */
  int value() {
    int total = 0, aces = 0;
    for (Card c : cards) {
      switch (c.rank()) {
        case JACK, QUEEN, KING -> total += 10;
        case ACE -> { total += 1; aces++; }
        default -> total += c.rank().ordinal() + 2;   // TWO.ordinal()==0 => 2 ... TEN => 10
      }
    }
    if (aces > 0 && total + 10 <= 21) total += 10;    // at most ONE ace can be 11
    return total;
  }
  boolean isBust() { return value() > 21; }
  boolean isBlackjack() { return cards.size() == 2 && value() == 21; }
}

/** Ordering is GAME policy, not a Card property. */
final class Orderings {
  static final Comparator<Card> ACE_HIGH =
      Comparator.comparingInt(c -> c.rank() == Rank.ACE ? 14 : c.rank().ordinal() + 2);
  static final Comparator<Card> ACE_LOW =
      Comparator.comparingInt(c -> c.rank() == Rank.ACE ? 1 : c.rank().ordinal() + 2);
}`),
      C("deep_dive", "Deep dive: Fisher–Yates — why the naive shuffle is biased",
        "Every interviewer who asks this question knows the trap, so walk into it deliberately and defuse it. THE NAIVE SHUFFLE: for i in 0..n-1, swap(cards[i], cards[random(0, n-1)]) — pick a fully random partner for every position. It looks perfectly fair and it is provably BIASED. Counting argument (give it — it's short and devastating): the algorithm makes n independent choices of n options each, so it traverses exactly n^n equally-likely execution paths; but there are n! distinct permutations, and n^n is NOT divisible by n! for n >= 3 (3^3 = 27 paths over 3! = 6 permutations: 27/6 doesn't divide — some permutations receive 5 paths, others 4). Pigeonhole: unequal path counts mean unequal probabilities, so certain orderings are systematically favored — for a casino, exploitable; for a simulation, silently wrong. FISHER–YATES fixes the counting: iterate i from n-1 down to 1, swap(cards[i], cards[j]) where j is uniform on [0, i] INCLUSIVE — position n-1 gets one of n choices, then n-2 gets one of the remaining n-1 (conceptually: each step finalizes one slot from the not-yet-fixed prefix), giving exactly n x (n-1) x ... x 1 = n! equally likely paths mapping one-to-one onto permutations. Uniform by construction. The two implementation bugs that reintroduce bias: nextInt(i) instead of nextInt(i+1) — excluding j == i means an element can never stay put in its round (this is Sattolo's algorithm, which generates only full cycles — a different distribution entirely); and running the loop but drawing j from the full range [0, n-1] every time, which IS the naive shuffle wearing Fisher–Yates clothes. Then the SOURCE question: java.util.Random is a 48-bit LCG — fine for tests (and its seedability is a FEATURE there: new Random(42) makes shuffle-dependent tests deterministic), but predictable enough that observing a few outputs reveals the sequence; a 52-card deck has log2(52!) ~ 226 bits of entropy, so a 32-bit-seeded generator cannot even REACH most permutations — for money, SecureRandom, injected via the strategy's constructor. And the practical closer: Collections.shuffle(list, rng) IS Fisher–Yates — in production you call it; in the interview you write it, and knowing both is the point."),
      C("deep_dive", "Deep dive: Blackjack on top — soft aces, dealer policy & the layering payoff",
        "Building Blackjack is where the layering proves itself — the generic layer needs ZERO changes. HAND VALUATION with aces is the algorithmic morsel: an Ace is 1 or 11, and with multiple aces the naive approach (branch per ace: 2 aces = 4 combinations) is exponential-flavored where the insight is that AT MOST ONE ace can ever count as 11 — two would be 22, an instant bust. So: total every ace as 1, then add 10 once if it fits (total + 10 <= 21). One conditional replaces the combinatorics; a hand is SOFT exactly when that upgrade applied (Ace+6 = soft 17: hitting cannot bust it, because the ace can demote back to 1 — which is why soft/hard matters strategically and why 'dealer hits soft 17' is a rule variant casinos actually toggle). Card VALUES live in the Blackjack layer (face cards 10, others pip value) — note how Rank having no getValue() is precisely what makes this clean: Poker will assign the same King a completely different meaning, and neither game edits the enum. DEALER POLICY is a fixed algorithm, not a decision: reveal hole card, hit until value >= 17, stand (with the soft-17 variant as a strategy flag) — implement it as a policy object and human players as another 'policy' that asks for input; the turn loop in the abstract Game treats both uniformly, which is Template Method earning its keep. GAME FLOW as a state machine (BETTING -> DEALING -> PLAYER_TURNS -> DEALER_TURN -> SETTLEMENT) keeps illegal operations (hitting after standing, betting mid-hand) structurally impossible — a miniature of the order-lifecycle discipline from bigger designs. RESOLUTION: bust loses immediately (even if the dealer later busts — order of play IS the house edge, worth saying); naturals (2-card 21) beat 21-in-three and traditionally pay 3:2; pushes return stakes. Extensions that should cost almost nothing if the design is right — and therefore make great self-tests: split pairs (a player temporarily owns two hands: Player-to-Hand becomes 1..*), double-down (one card, bet doubles — a turn-policy branch), insurance (a side bet — settlement rule), multi-deck shoe with a cut-card reshuffle trigger (Deck constructor arg + a threshold check). If any of these forces an edit to Card, Rank, or Deck, the layering was wrong — that reversibility test is the design's proof."),
      C("tradeoffs", "Trade-offs & extension points",
        "The recurring decisions, argued. VALUE-ON-RANK vs VALUE-IN-GAME: putting getValue() on Rank is seductive (one obvious place!) and wrong the moment a second game arrives with different values — game-layer valuation (chosen) keeps the enum a pure identity; the cost is each game writing its own small mapping, which is not a cost, it's the requirement. COMPARABLE vs COMPARATOR: Card implements Comparable only if a universal natural order exists — it doesn't (ace high/low, suit relevance varies), so ordering ships as named Comparator constants per game; general rule worth stating: Comparable for intrinsic order (Integer, LocalDate), Comparator for contextual order. ENUM CARDS vs INT ENCODING (0..51 with rank = i % 13): the int trick is compact and cache-friendly — right for a poker-bot evaluating millions of hands per second, wrong as a domain model (magic numbers, illegal values representable); know which layer you're designing. MUTABLE DECK vs IMMUTABLE-FUNCTIONAL (shuffle returns a new deck): mutable-with-owned-state (chosen) matches the physical metaphor and the interview clock; the functional version aids concurrency but nobody deals from one deck on two threads by design. RESHUFFLE POLICY: throw-on-empty (chosen default — surfacing the condition) vs auto-reshuffle-discards (rummy-style games need it: inject a ReshufflePolicy rather than hardcoding either). EXTENSION QUESTIONS you should anticipate: JOKERS — the honest answer is that adding a JOKER rank breaks 'every card has a suit x rank meaning'; options are a nullable-suit special card (ugly), a Card subtype (breaks record equality simplicity), or — cleanest — game-layer wrapping where the 52-value Card stays pure and games that use jokers deal from an extended card set defined at their layer; discussing WHY it's awkward is worth more than any single fix. UNO/TAROT — different Suit/Rank enums, same Deck/Hand machinery if you genericize Deck<TCard> (do it only when a second card type actually exists — YAGNI stated aloud is a senior signal). TESTING — the injected-Random seam means shuffle tests assert known sequences from known seeds, and a chi-squared test over many shuffles can empirically verify uniformity: mention it to show you test PROPERTIES, not just examples."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why is swap-with-random-position biased?' — n^n equally likely paths vs n! permutations, and n! doesn't divide n^n for n >= 3 (27 paths / 6 permutations at n=3), so pigeonhole forces unequal probabilities; Fisher–Yates shrinks the random range each step (j uniform on [0, i]) giving exactly n! paths, one per permutation — and watch the off-by-one: nextInt(i + 1), inclusive, or you've written Sattolo's cycle generator. 'Where does Ace-high vs Ace-low live?' — nowhere on Card or Rank: ordering is contextual, so it's an injected Comparator<Card> owned by the game; Card deliberately does NOT implement Comparable because no universal order exists. 'Why no getValue() on Rank?' — a King is 10 in Blackjack, 13 in cribbage-counting contexts, and rank-index in poker; value is a game fact, and putting it on the shared enum couples every game to one game's rules. 'Two aces — how does hand value work?' — at most one ace can be 11 (two would bust), so count all aces as 1 and upgrade once if total + 10 <= 21; 'soft' means the upgrade applied, and soft hands can't bust on a hit. 'Deck runs out?' — explicit policy, not null: throw by default; games with discard piles inject a reshuffle policy; a shoe adds a cut-card threshold triggering reshuffle between rounds. 'Online for real money?' — the randomness source becomes a security boundary: SecureRandom (or hardware/audited RNG), because seedable PRNGs have historically let players reconstruct entire decks (52! ~ 2^226 states vs a 48-bit seed — the math ends the argument); server-authoritative deck state, clients see only their own cards; and shuffle audit logs. 'Make it Uno?' — new Suit/Rank enums and game rules; Deck/Hand/ShuffleStrategy carry over untouched — which is the final proof the boundary was drawn where it belonged: the generic layer never heard about any game."),
    ],
    "Deck of Cards is the interviewer's modeling litmus test: small enough to finish, sharp enough to expose instincts. The graded signals: enums making illegal cards unrepresentable, Card as an immutable value with NO game facts (no getValue, no Comparable — a King's worth and an Ace's position are game policy, delivered as per-game valuation and injected Comparators), Fisher–Yates with the counting argument for why the naive swap-anywhere shuffle is biased (n^n paths vs n! permutations) plus the nextInt(i+1) off-by-one and the SecureRandom-for-stakes point, and a clean generic-layer/game-layer boundary proven by building Blackjack — soft-ace valuation via the count-aces-as-1-upgrade-one trick, dealer policy as strategy, game flow as a small state machine — without touching a single generic class. Candidates fail this question not by lacking knowledge but by coupling: one getValue() on Rank tells the interviewer everything.",
    [
      G("naive_swap_shuffle", "Shuffling by swapping every position with a fully random position — visually fine, provably biased.", "Use Fisher–Yates: iterate i from n-1 down, swap with j uniform on [0, i] INCLUSIVE (nextInt(i+1)); n! equally likely paths map one-to-one onto permutations — and inject the Random so tests can seed it.", "swap(cards[i], cards[rand.nextInt(n)]) over the full range each iteration; or nextInt(i) exclusive — Sattolo's algorithm — which never leaves an element in place per round."),
      G("value_on_rank", "Baking a numeric value (or Comparable order) into the Rank enum or Card, coupling the shared type to one game's rules.", "Keep Card/Rank as pure identity; each game owns its valuation map and rank ordering as an injected Comparator — Blackjack's 10-valued King and poker's 13th-rank King coexist without edits.", "Rank.getValue() returning one hardcoded mapping; Card implements Comparable with ace fixed high (or low); adding a second game forces enum edits."),
      G("game_state_on_card", "Putting session state (faceUp, selected, owner) or mutable fields on Card, breaking value semantics and shareability.", "Card is an immutable record equal by content; visibility and ownership live with the holder (Hand/Game/UI layer) — two decks' Ace of Spades must be interchangeable.", "Setters or boolean flags on Card; equals/hashCode omitted or identity-based; bugs where 'the same card' behaves differently depending on which instance you hold."),
    ],
    0.4, DIAG.cards, "Deck of cards class diagram"),
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
  // Parking lot
  pm("lld_m1", { topicId: "lld_m1_t10", exerciseId: "lld_m1_t10_pm_d1", position: 11, level: "hard",
    title: "Two gates, one spot", scenario: "Two entry gates race for the last free car spot. How does the design prevent double-assignment?",
    options: ["Make claiming atomic — tryOccupy() via synchronized/CAS is the only way to take a spot; search results are advisory and losers keep searching", "Have gates search the free list and then set occupied = true", "Put one big lock around the entire parking lot for every operation, permanently", "Give each gate its own reserved pool of spots"],
    correct: "Make claiming atomic — tryOccupy() via synchronized/CAS is the only way to take a spot; search results are advisory and losers keep searching",
    explanation: "Find-then-mark as two steps is a check-then-act race; the atomic claim on the spot itself makes exactly one gate win while keeping contention fine-grained." }),
  pm("lld_m1", { topicId: "lld_m1_t10", exerciseId: "lld_m1_t10_pm_d2", position: 12, level: "medium",
    title: "Weekend surge pricing", scenario: "The operator wants weekend surge (1.5x) on top of hourly slab pricing next month. Where does it go?",
    options: ["A SurgePricing decorator wrapping any base PricingStrategy — ParkingLot depends only on the interface, zero edits elsewhere", "An if (isWeekend) branch inside ParkingLot.unpark()", "A new field on Ticket storing the multiplier", "Subclass ParkingLot as WeekendParkingLot"],
    correct: "A SurgePricing decorator wrapping any base PricingStrategy — ParkingLot depends only on the interface, zero edits elsewhere",
    explanation: "Pricing is a stated axis of change, isolated behind a strategy interface; surge composes as a decorator over slab OR day-pass pricing without touching the lot." }),
  pm("lld_m1", { topicId: "lld_m1_t10", exerciseId: "lld_m1_t10_pm_d3", position: 13, level: "medium",
    title: "Lost ticket", scenario: "A driver at the exit gate has lost their ticket. What does a well-designed system do?",
    options: ["An explicit LOST state: charge a penalty/day-max, verify by plate against active tickets, and close through the normal path so the spot is provably released", "Open the gate and forget the ticket", "Search all spots to find the car and delete the spot record", "Refuse exit until the ticket is found"],
    correct: "An explicit LOST state: charge a penalty/day-max, verify by plate against active tickets, and close through the normal path so the spot is provably released",
    explanation: "Lost tickets are a guaranteed edge case; handling them through the normal ticket-closing path preserves the invariant that every claimed spot is eventually released." }),
  // LRU cache
  pm("lld_m1", { topicId: "lld_m1_t11", exerciseId: "lld_m1_t11_pm_d1", position: 11, level: "hard",
    title: "Why a doubly linked list?", scenario: "get(key) must refresh recency in O(1). Why does the structure have to be a DOUBLY linked list?",
    options: ["The map hands you a mid-list node; O(1) unlink requires its predecessor pointer — a singly linked list makes the refresh O(n)", "Doubly linked lists use less memory than singly linked ones", "Because Java's LinkedList is doubly linked", "So the cache can be iterated in both directions for range queries"],
    correct: "The map hands you a mid-list node; O(1) unlink requires its predecessor pointer — a singly linked list makes the refresh O(n)",
    explanation: "The DLL is forced, not chosen: removing an arbitrary node you hold a pointer to in O(1) needs prev, and the recency refresh removes mid-list nodes on every hit." }),
  pm("lld_m1", { topicId: "lld_m1_t11", exerciseId: "lld_m1_t11_pm_d2", position: 12, level: "medium",
    title: "Eviction bookkeeping", scenario: "On overflow you unlink tail.prev. What else MUST happen, and what makes it possible?",
    options: ["map.remove(node.key) — which is why Node stores its key; evicting from only one structure breaks the map-IFF-list invariant", "Nothing — the garbage collector cleans up the map entry", "Scan the map for the entry whose value matches the node", "Clear the whole map and rebuild it from the list"],
    correct: "map.remove(node.key) — which is why Node stores its key; evicting from only one structure breaks the map-IFF-list invariant",
    explanation: "Eviction is always the pair unlink + map.remove(key); without the key on the node, the O(1) map cleanup is impossible and ghost entries accumulate." }),
  pm("lld_m1", { topicId: "lld_m1_t11", exerciseId: "lld_m1_t11_pm_d3", position: 13, level: "hard",
    title: "Forty threads", scenario: "The cache is read-heavy under 40 threads. A teammate proposes a ReadWriteLock with get() under the read lock. Verdict?",
    options: ["Wrong — get() splices the list (it's a write); use one mutex first, then striped segments or Caffeine-style buffered access events drained by a single reorderer", "Correct — get is a read, so shared locking is safe", "Correct if the list is volatile", "Wrong — you should remove locking entirely since HashMap is thread-safe"],
    correct: "Wrong — get() splices the list (it's a write); use one mutex first, then striped segments or Caffeine-style buffered access events drained by a single reorderer",
    explanation: "LRU's trap: reads mutate recency metadata, so concurrent 'readers' corrupt the list; the scaling ladder is one lock -> striping (approximate) -> buffered lossy reordering." }),
  // Hotel booking
  pm("lld_m10", { topicId: "lld_m10_t1", exerciseId: "lld_m10_t1_pm_d1", position: 11, level: "hard",
    title: "The last Deluxe", scenario: "Two guests book the last Deluxe for overlapping ranges simultaneously. What makes exactly one succeed?",
    options: ["tryReserve checks ALL nights and increments ALL nights under one lock/transaction — all-or-nothing; the loser fails cleanly before any payment", "Check availability first, then reserve in a second call", "First to pay wins; refund the other", "Allow both and upgrade one at check-in"],
    correct: "tryReserve checks ALL nights and increments ALL nights under one lock/transaction — all-or-nothing; the loser fails cleanly before any payment",
    explanation: "Separate check and reserve is the multi-night check-then-act race; one atomic guard over the whole range — and reserve-before-charge ordering — settles it without refund machinery." }),
  pm("lld_m10", { topicId: "lld_m10_t1", exerciseId: "lld_m10_t1_pm_d2", position: 12, level: "hard",
    title: "Room 304 breaks", scenario: "Maintenance takes room 304 (a Deluxe) out for a week. How many reservations must be edited, and why?",
    options: ["Zero — bookings name ROOM TYPES, not rooms; decrement Deluxe capacity for those dates, and physical assignment happens at check-in", "All reservations that were assigned room 304", "One — reassign the guest in room 304 to another room", "All Deluxe reservations for that week, to re-confirm them"],
    correct: "Zero — bookings name ROOM TYPES, not rooms; decrement Deluxe capacity for those dates, and physical assignment happens at check-in",
    explanation: "Type-level counted inventory is the model choice that dissolves this: maintenance is a capacity tweak, and if a night was fully booked the shortfall surfaces as an operational upgrade/walk exception, not data corruption." }),
  pm("lld_m10", { topicId: "lld_m10_t1", exerciseId: "lld_m10_t1_pm_d3", position: 13, level: "medium",
    title: "Back-to-back stays", scenario: "Stay A is Dec 10–12 and stay B is Dec 12–14, same room type, one room. Conflict?",
    options: ["No — stays are [checkIn, checkOut): A consumes nights 10–11, B consumes 12–13; the 12th is a normal turnover day", "Yes — both include Dec 12", "Yes — unless housekeeping confirms cleaning", "No — because B can be upgraded"],
    correct: "No — stays are [checkIn, checkOut): A consumes nights 10–11, B consumes 12–13; the 12th is a normal turnover day",
    explanation: "Check-out-exclusive interval semantics are the problem's classic off-by-one: closed intervals make every same-day turnover a false conflict and silently halve inventory." }),
  // Food delivery
  pm("lld_m10", { topicId: "lld_m10_t2", exerciseId: "lld_m10_t2_pm_d1", position: 11, level: "hard",
    title: "Cancel vs Accept", scenario: "A customer cancels at the same instant the restaurant accepts, both from PLACED. What's correct behavior?",
    options: ["Serialize per order: one transition commits first; the second is re-validated against the NEW state and either throws or applies new-state rules", "Prevent the race by locking the customer's app during acceptance", "Let both succeed and reconcile later", "Always prefer the restaurant's action over the customer's"],
    correct: "Serialize per order: one transition commits first; the second is re-validated against the NEW state and either throws or applies new-state rules",
    explanation: "You can't prevent the race — you make one winner: if Cancel commits first, Accept fails truthfully; if Accept wins, the cancel re-evaluates under ACCEPTED rules (possibly with a fee), and the event log proves the order." }),
  pm("lld_m10", { topicId: "lld_m10_t2", exerciseId: "lld_m10_t2_pm_d2", position: 12, level: "hard",
    title: "One rider, two orders", scenario: "Two concurrent dispatches both pick the same nearest agent. What guarantees only one gets him?",
    options: ["The claim is an AtomicBoolean compareAndSet on the agent — geo search is advisory, exactly one CAS wins, the loser takes the next candidate", "Sort candidates differently per dispatcher so they never collide", "A global dispatch lock serializing all assignments city-wide", "Assign both and let the agent choose"],
    correct: "The claim is an AtomicBoolean compareAndSet on the agent — geo search is advisory, exactly one CAS wins, the loser takes the next candidate",
    explanation: "Advisory search + atomic claim is the same pattern as the parking-spot race: candidates are hints; the CAS on the agent's busy flag is the single point of truth." }),
  pm("lld_m10", { topicId: "lld_m10_t2", exerciseId: "lld_m10_t2_pm_d3", position: 13, level: "medium",
    title: "Menu edit mid-order", scenario: "The restaurant raises the biryani price while an order for it is PREPARING. What does the customer pay?",
    options: ["The old price — order lines are snapshots (id, name, price copies) taken at placement; an order is a financial record, not a view over the live menu", "The new price — menus are the source of truth", "The average of old and new", "The order is cancelled and must be re-placed"],
    correct: "The old price — order lines are snapshots (id, name, price copies) taken at placement; an order is a financial record, not a view over the live menu",
    explanation: "Referencing live MenuItems lets menu edits rewrite in-flight and historical orders; snapshotting at placement makes the order immutable financial history." }),
  // Digital wallet
  pm("lld_m10", { topicId: "lld_m10_t3", exerciseId: "lld_m10_t3_pm_d1", position: 11, level: "hard",
    title: "A->B races B->A", scenario: "Two opposite transfers between the same accounts run concurrently and the system freezes. Diagnosis and fix?",
    options: ["Deadlock from locking in transfer order — acquire both account locks in global (id-sorted) order so opposite transfers serialize on the same first lock", "Livelock — add random sleeps", "The accounts are corrupted — restore from backup", "Too little memory for two locks — use one global lock forever"],
    correct: "Deadlock from locking in transfer order — acquire both account locks in global (id-sorted) order so opposite transfers serialize on the same first lock",
    explanation: "Lock-in-argument-order is the textbook two-lock cycle; a global canonical acquisition order makes a wait cycle structurally impossible — the most predictable wallet follow-up." }),
  pm("lld_m10", { topicId: "lld_m10_t3", exerciseId: "lld_m10_t3_pm_d2", position: 12, level: "hard",
    title: "The double tap", scenario: "A user taps Pay twice on a flaky network and the request is retried by the client too. One deduction — how?",
    options: ["A client-generated idempotency key per logical action, checked first and committed in the SAME atomic unit as the ledger entries; retries replay the stored result", "Debounce the button in the UI", "Reject any two transfers with the same amount within a minute", "Ask the user to confirm twice"],
    correct: "A client-generated idempotency key per logical action, checked first and committed in the SAME atomic unit as the ledger entries; retries replay the stored result",
    explanation: "UI debouncing can't fix network retries; the key must commit atomically with the money movement, or a crash between them leaves a window where the retry pays again." }),
  pm("lld_m10", { topicId: "lld_m10_t3", exerciseId: "lld_m10_t3_pm_d3", position: 13, level: "medium",
    title: "Why not balance += x?", scenario: "A teammate models the wallet as a mutable balance column updated in place. What's the principled objection?",
    options: ["Balance must be DERIVED from an append-only double-entry ledger (entries sum to zero): auditable, conservation-checkable, reconcilable — a mutable column loses updates and can't explain itself", "It's slower than a ledger", "Databases don't support numeric updates safely", "Balances should be floats, not integers"],
    correct: "Balance must be DERIVED from an append-only double-entry ledger (entries sum to zero): auditable, conservation-checkable, reconcilable — a mutable column loses updates and can't explain itself",
    explanation: "The ledger is the source of truth and the cached balance a materialized view with nightly drift reconciliation; 'why is the balance X?' must be answerable by summing immutable entries." }),
  // Deck of cards
  pm("lld_m10", { topicId: "lld_m10_t4", exerciseId: "lld_m10_t4_pm_d1", position: 11, level: "hard",
    title: "The biased shuffle", scenario: "for i in 0..n-1: swap(cards[i], cards[rand.nextInt(n)]). Why is this wrong, and what's right?",
    options: ["It yields n^n equally likely paths over n! permutations — n! doesn't divide n^n, so some orders are favored; Fisher–Yates draws j from [0, i] inclusive giving exactly n! paths", "It's fine — every card gets a random position", "It's wrong only for even n", "It's wrong because it should loop backwards, nothing more"],
    correct: "It yields n^n equally likely paths over n! permutations — n! doesn't divide n^n, so some orders are favored; Fisher–Yates draws j from [0, i] inclusive giving exactly n! paths",
    explanation: "The counting argument is the whole answer: 27 paths onto 6 permutations at n=3 cannot be uniform; shrinking the random range each step maps paths one-to-one onto permutations — and nextInt(i+1), not nextInt(i), or you get Sattolo's cycles." }),
  pm("lld_m10", { topicId: "lld_m10_t4", exerciseId: "lld_m10_t4_pm_d2", position: 12, level: "medium",
    title: "Ace high or low?", scenario: "Poker wants Ace high; rummy wants Ace low. Where does rank ordering live?",
    options: ["In per-game injected Comparator<Card> constants — Card implements no Comparable because no universal order exists", "As Rank.getValue() with a boolean aceHigh parameter", "On Card via Comparable, with ace fixed high", "In a global configuration singleton"],
    correct: "In per-game injected Comparator<Card> constants — Card implements no Comparable because no universal order exists",
    explanation: "Ordering is contextual game policy, not a card property; Comparable is for intrinsic order, Comparator for contextual — the crispest open-closed demonstration in the problem." }),
  pm("lld_m10", { topicId: "lld_m10_t4", exerciseId: "lld_m10_t4_pm_d3", position: 13, level: "hard",
    title: "Two aces in Blackjack", scenario: "A hand holds Ace, Ace, 9. What's its value, and what's the efficient valuation rule?",
    options: ["21 — count every ace as 1 (total 11), then upgrade ONE ace by +10 if it fits; at most one ace can ever be 11, since two would bust", "22 — aces are always 11", "11 — aces are always 1", "Enumerate all 2^aces combinations and pick the best under 21"],
    correct: "21 — count every ace as 1 (total 11), then upgrade ONE ace by +10 if it fits; at most one ace can ever be 11, since two would bust",
    explanation: "Two 11-valued aces are 22 — instant bust — so the combinatorial branching collapses to one conditional: total with aces as 1, add 10 once if total + 10 <= 21; 'soft' means the upgrade applied." }),
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
  console.log(`✓ LLD depth batch 1 seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
