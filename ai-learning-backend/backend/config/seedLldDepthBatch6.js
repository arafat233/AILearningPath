/**
 * Seed — LLD DEPTH batch 6 (LLD_DEPTH_STANDARD.md).
 *
 *   lld_m5_t1  Design an Elevator System            (module lld_m5)
 *   lld_m5_t2  Design a Vending Machine             (module lld_m5)
 *   lld_m5_t3  Design Splitwise (Expense Sharing)   (module lld_m5)
 *   lld_m5_t4  Design a Rate Limiter                (module lld_m5)
 *   lld_m5_t5  Design Tic-Tac-Toe                   (module lld_m5)
 *   lld_m5_t6  Design Snake & Ladder                (module lld_m5)
 *
 * Verify: node config/auditLldDepth.mjs --require lld_m5_t1,lld_m5_t2,lld_m5_t3,lld_m5_t4,lld_m5_t5,lld_m5_t6
 * Usage:  node config/seedLldDepthBatch6.js  ·  npm run seed:lld-depth-6
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
  elevator: svg(820, 240,
    box(20, 30, 170, 56, "ElevatorSystem", "bank facade, hall calls", "#ede9fe") +
    box(250, 30, 160, 56, "Dispatcher", "picks car by cost fn", "#fef9c3") +
    box(470, 30, 160, 56, "ElevatorCar", "floor, direction, doors", "#fce7f3") +
    box(470, 130, 160, 56, "LookScheduler", "two sorted stop sets", "#f0fdf4") +
    box(250, 130, 160, 56, "Request", "HallCall / CarCall") +
    box(20, 130, 170, 56, "DirectionState", "UP / DOWN / IDLE", "#eff6ff") +
    box(660, 80, 140, 56, "DoorController", "open/close timers", "#f0fdf4") +
    arrow(190, 58, 250, 58, "routes") + arrow(410, 58, 470, 58, "assigns to") +
    arrow(550, 86, 550, 130, "delegates stops") + arrow(470, 158, 410, 158, "absorbs") +
    arrow(250, 158, 190, 158, "drives", true) + arrow(630, 65, 660, 90, "commands") +
    note(410, 225, "Each car runs LOOK: sweep one direction serving the sorted stop set, reverse only when it empties; the Dispatcher scores every car's detour cost and gives the hall call to the cheapest")),
  vending: svg(820, 240,
    box(20, 30, 170, 56, "VendingMachine", "context, holds state", "#ede9fe") +
    box(250, 30, 150, 56, "MachineState", "interface: 5 events", "#fef9c3") +
    box(460, 30, 170, 56, "IdleState", "insertCoin -> HasMoney", "#fce7f3") +
    box(460, 130, 170, 56, "HasMoneyState", "select -> Dispensing", "#f0fdf4") +
    box(250, 130, 150, 56, "Inventory", "slot -> count, atomic") +
    box(20, 130, 170, 56, "CoinVault", "denomination counts", "#eff6ff") +
    box(660, 80, 140, 56, "ChangeMaker", "greedy / DP change", "#f0fdf4") +
    arrow(190, 58, 250, 58, "delegates to") + arrow(400, 58, 460, 58, "implements") +
    arrow(545, 86, 545, 130, "transitions") + arrow(460, 158, 400, 158, "reserves from") +
    arrow(250, 158, 190, 158, "settles with", true) + arrow(630, 100, 660, 100, "asks") +
    note(410, 225, "Each state OBJECT owns its legal transitions and returns the next state; dispense is one guarded step that reserves stock AND change together, else it refunds and stays put")),
  splitwise: svg(820, 240,
    box(20, 30, 170, 56, "ExpenseService", "addExpense / settle", "#ede9fe") +
    box(250, 30, 150, 56, "Expense", "payer, amount, shares", "#fef9c3") +
    box(460, 30, 170, 56, "SplitStrategy", "equal/exact/pct/shares", "#fce7f3") +
    box(460, 130, 170, 56, "BalanceSheet", "pairwise ledger in cents", "#f0fdf4") +
    box(250, 130, 150, 56, "Simplifier", "net + greedy matching") +
    box(20, 130, 170, 56, "Settlement", "debtor -> creditor, amt", "#eff6ff") +
    box(660, 80, 140, 56, "Group", "members, currency", "#f0fdf4") +
    arrow(190, 58, 250, 58, "records") + arrow(400, 58, 460, 58, "splits via") +
    arrow(545, 86, 545, 130, "posts to") + arrow(460, 158, 400, 158, "reduced by") +
    arrow(250, 158, 190, 158, "emits", true) + arrow(630, 70, 660, 90, "scoped to") +
    note(410, 225, "Every expense posts equal-and-opposite entries in integer CENTS; simplification nets each member to one number, then greedily matches the largest creditor to the largest debtor")),
  ratelimiter: svg(820, 240,
    box(20, 30, 170, 56, "RateLimiterFacade", "allow(key, cost)", "#ede9fe") +
    box(250, 30, 160, 56, "LimiterStrategy", "interface: tryAcquire", "#fef9c3") +
    box(470, 30, 160, 56, "TokenBucket", "tokens, lazy refill", "#fce7f3") +
    box(470, 130, 160, 56, "SlidingWindowLog", "deque of timestamps", "#f0fdf4") +
    box(250, 130, 160, 56, "SlidingCounter", "prev*w + curr") +
    box(20, 130, 170, 56, "BucketRegistry", "key -> bucket, striped", "#eff6ff") +
    box(660, 80, 140, 56, "Clock", "monotonic nanos", "#f0fdf4") +
    arrow(190, 58, 250, 58, "delegates") + arrow(410, 58, 470, 58, "impl") +
    arrow(410, 70, 470, 145, "impl") + arrow(410, 158, 340, 158, "impl") +
    arrow(250, 158, 190, 158, "looked up in", true) + arrow(660, 100, 630, 100, "reads") +
    note(410, 225, "No refill thread: tokens are recomputed from elapsed = now - lastRefill on every call, inside one per-key critical section, so N idle keys cost zero CPU")),
  tictactoe: svg(820, 240,
    box(20, 30, 150, 56, "Game", "turn loop, state", "#ede9fe") +
    box(230, 30, 150, 56, "Board", "n x n cells", "#fef9c3") +
    box(440, 30, 170, 56, "WinTracker", "rowSum/colSum/diag", "#fce7f3") +
    box(440, 130, 170, 56, "Move", "row, col, symbol", "#f0fdf4") +
    box(230, 130, 150, 56, "Player", "symbol, strategy") +
    box(20, 130, 150, 56, "MoveStrategy", "human / minimax", "#eff6ff") +
    box(660, 80, 140, 56, "GameState", "IN_PLAY/WON/DRAW", "#f0fdf4") +
    arrow(170, 58, 230, 58, "owns") + arrow(380, 58, 440, 58, "updates") +
    arrow(525, 86, 525, 130, "fed by") + arrow(440, 158, 380, 158, "chosen by") +
    arrow(230, 158, 170, 158, "delegates", true) + arrow(610, 60, 660, 90, "yields") +
    note(410, 225, "WinTracker keeps signed counters per row, column and both diagonals: a move adds +1 or -1 to at most four of them and a win is |counter| == n — O(1), never a board scan")),
  snakeladder: svg(820, 240,
    box(20, 30, 170, 56, "Game", "turn loop, winner", "#ede9fe") +
    box(250, 30, 150, 56, "Board", "size, jumps map", "#fef9c3") +
    box(460, 30, 170, 56, "Jump", "start -> end (snake/ladder)", "#fce7f3") +
    box(460, 130, 170, 56, "Dice", "interface: roll()", "#f0fdf4") +
    box(250, 130, 150, 56, "TurnPolicy", "extra roll on 6, exact win") +
    box(20, 130, 170, 56, "Player", "position, id", "#eff6ff") +
    box(660, 80, 140, 56, "Deque<Player>", "round-robin queue", "#f0fdf4") +
    arrow(190, 58, 250, 58, "has a") + arrow(400, 58, 460, 58, "stores") +
    arrow(545, 86, 545, 130, "resolved after") + arrow(460, 158, 400, 158, "governed by") +
    arrow(250, 158, 190, 158, "moves", true) + arrow(630, 65, 660, 90, "rotates") +
    note(410, 225, "The board is ONE Map<start,end>: a snake is end<start, a ladder end>start, and landing resolution is a bounded loop so chained jumps work; Dice behind an interface makes the game deterministically testable")),
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
  // ─────────────────── ELEVATOR SYSTEM ──────────────────────────────────────
  TT("lld_m5", "lld_m5_t1", 1, "Design an Elevator System", "design-elevator",
    ["case-study", "state-machine", "scheduling", "concurrency"],
    "A four-car bank serves a twenty-floor tower. Car B is at floor 12 moving down with passengers for 3 and 7. Someone on floor 9 presses DOWN, someone on floor 14 presses UP, and someone on floor 5 presses UP. Which car takes which call, and in what order does car B stop? Answer with a FIFO queue and you have just designed an elevator that rides past the floor you are standing on.",
    "The whole design turns on ONE mechanism: each car runs a directional sweep — the LOOK/SCAN disk-scheduling algorithm — over two sorted stop sets, not a FIFO queue of requests. While moving UP a car serves the next-higher stop and absorbs any new request that lies ahead of it in the same direction, for free; it reverses only when nothing remains ahead. Above that sits the second mechanism, DISPATCH: for a hall call, every car scores the marginal cost of taking it and the cheapest wins. FIFO is not merely slower, it is a different and wrong machine.",
    [
      C("requirements", "Requirements",
        "Functional: a BANK of N elevator cars serves a building of F floors. Two request sources exist and they are not the same thing — HALL CALLS are pressed outside the car, carry a floor AND a desired direction (up or down), and are addressed to the bank as a whole so any car may serve them; CAR CALLS are pressed inside a specific car, carry only a destination floor, and can only ever be served by that car. The system must move cars, open and close doors with a dwell timeout, serve every accepted request in finite time, and display each car's current floor and direction. Operational requirements that show up as classes: an EMERGENCY STOP and an out-of-service mode, a door-obstruction sensor that re-opens, a maximum load, and a maintenance mode that drains a car's stops and parks it. Non-functional requirements are the ones that actually shape the design. LATENCY has two distinct metrics and interviewers like when you separate them: WAIT TIME (call press to doors opening at the caller's floor) and JOURNEY TIME (boarding to arrival); optimizing only the first produces cars that pick everyone up and then wander. STARVATION FREEDOM — no request may be deferred indefinitely, which is exactly the failure mode a purely greedy nearest-car policy produces for the top and bottom floors. CONCURRENCY — buttons are pressed from many threads while each car's motion loop runs independently, so request state is shared mutable state and needs a defined ownership model. Physical constraints are real constraints: reversing direction is expensive and passenger-hostile, a car cannot stop instantly, and a car already stopped at a floor should absorb a call for that floor rather than dispatch another car. Clarify scope up front: single building, in-memory model, control logic only — the motor and safety interlocks are hardware behind an interface."),
      C("entities", "Core entities & responsibilities",
        "ELEVATORCAR is the unit of state and the unit of concurrency: id, currentFloor, a Direction (UP, DOWN, IDLE), a door state, capacity, and — the important part — its own STOP SET rather than a queue. Each car owns its motion loop, so each car is the natural synchronization boundary; nothing outside the car mutates its stops except through one guarded method. REQUEST comes in the two flavours already named, and modelling them as distinct types (HallCall carrying floor plus direction, CarCall carrying floor only) is not pedantry: the dispatcher only ever routes hall calls, and the direction field on a hall call is precisely what lets the scheduler decide whether a passing car should stop. DIRECTION is a first-class value, not a boolean, because IDLE is a genuine third state with different admission rules — an idle car may accept a call in either direction and adopt that direction. STOPSET is the data structure carrying the algorithm: two sorted sets per car, upStops and downStops (TreeSet or a pair of heaps), which make 'next stop ahead of me in my current direction' an O(log n) ceiling/floor query instead of a scan. DISPATCHER owns the bank-level policy: given a hall call, score every car and assign. SCHEDULINGSTRATEGY (LOOK, SCAN, nearest-car, or a fancier cost function) sits behind an interface so the policy is swappable per building and testable in isolation — buildings genuinely differ, and morning-rush versus evening-rush policies are a real product feature. DOORCONTROLLER encapsulates open/dwell/close timing and obstruction handling so the motion loop never sleeps inline. ELEVATORSYSTEM is the facade: pressHallButton(floor, dir), pressCarButton(carId, floor), and status queries."),
      C("design", "Class design & patterns",
        "Two separations carry the design and both must be argued, not asserted. FIRST: split DISPATCH (which car) from SCHEDULING (in what order that car stops). They are different problems with different inputs — dispatch is a global assignment over a bank, scheduling is a local ordering inside one car — and fusing them is what produces the classic bad answer where the bank is one giant priority queue. Keeping them apart means a single-car building and a forty-car building run the same car code, and the dispatch policy can be replaced (nearest-car, cost-based, zoned, destination-dispatch) without touching motion logic. SECOND: model the car as an explicit STATE MACHINE over Direction plus door state, with transitions guarded by the stop sets. The states are MOVING_UP, MOVING_DOWN, STOPPED_DOORS_OPEN and IDLE; the transitions are driven by exactly one predicate — is there any stop ahead of me in my current direction? — and the reversal rule falls out of it. Patterns, each with its justification: STRATEGY for SchedulingStrategy and for the dispatcher's cost function, because these are the axes buildings actually vary along; OBSERVER for floor-arrival events feeding displays and logging, so the motion loop never blocks on I/O; COMMAND is a reasonable framing for requests if you want queueing, undo (cancel a car call) and audit; SINGLETON for the ElevatorSystem facade is the cliché answer and is worth explicitly declining — it makes tests share global state and buys nothing here. What is deliberately absent is a bank-wide lock: contention is per car, so each car synchronizes its own stop sets, and the dispatcher reads immutable snapshots of car state to score candidates. That granularity choice is the single sentence that separates a design that scales to forty cars from one that serializes them all."),
      K("code", "Core classes (Java)",
        `enum Direction { UP, DOWN, IDLE }

class ElevatorCar {
  final int id;
  private int currentFloor = 0;
  private Direction direction = Direction.IDLE;
  // Two SORTED sets, not a FIFO queue: this is the LOOK algorithm's memory.
  private final TreeSet<Integer> upStops   = new TreeSet<>();
  private final TreeSet<Integer> downStops = new TreeSet<>();
  private final Object lock = new Object();

  ElevatorCar(int id) { this.id = id; }

  void addStop(int floor, Direction reqDir) {
    synchronized (lock) {
      if (floor > currentFloor)      upStops.add(floor);
      else if (floor < currentFloor) downStops.add(floor);
      else openDoors();                       // already here: absorb the call
      if (direction == Direction.IDLE)
        direction = floor > currentFloor ? Direction.UP
                  : floor < currentFloor ? Direction.DOWN : Direction.IDLE;
      lock.notifyAll();                       // wake an idle motion loop
    }
  }

  // One LOOK step: serve the nearest stop AHEAD; reverse only when none remains.
  Integer nextStop() {
    synchronized (lock) {
      if (direction == Direction.UP) {
        Integer up = upStops.ceiling(currentFloor);      // O(log n), no scan
        if (up != null) return up;
        direction = downStops.isEmpty() ? Direction.IDLE : Direction.DOWN;
      }
      if (direction == Direction.DOWN) {
        Integer down = downStops.floor(currentFloor);
        if (down != null) return down;
        direction = upStops.isEmpty() ? Direction.IDLE : Direction.UP;
      }
      return direction == Direction.IDLE ? null : nextStopAfterReversal();
    }
  }

  void step() {                                // called by this car's own thread
    Integer target = nextStop();
    if (target == null) { parkOrWait(); return; }
    currentFloor += Integer.signum(target - currentFloor);
    if (currentFloor == target) {
      synchronized (lock) { upStops.remove(target); downStops.remove(target); }
      openDoors();                             // DoorController handles dwell
    }
  }

  // Marginal cost of THIS car taking THAT hall call — the dispatch score.
  int costFor(HallCall c) {
    synchronized (lock) {
      int gap = Math.abs(c.floor() - currentFloor);
      if (direction == Direction.IDLE)                       return gap;
      boolean ahead = (direction == Direction.UP   && c.floor() >= currentFloor)
                   || (direction == Direction.DOWN && c.floor() <= currentFloor);
      if (ahead && direction == c.direction())               return gap;        // free pickup
      if (ahead)                                             return gap + 2 * farthestAhead();
      return gap + 4 * farthestAhead();                                          // full reversal
    }
  }
}

class Dispatcher {
  private final List<ElevatorCar> cars;
  Dispatcher(List<ElevatorCar> cars) { this.cars = cars; }

  void dispatch(HallCall call) {
    ElevatorCar best = cars.stream()
        .min(Comparator.comparingInt(c -> c.costFor(call)))
        .orElseThrow();
    best.addStop(call.floor(), call.direction());
  }
}`),
      C("deep_dive", "Deep dive: LOOK/SCAN — why the request queue is the wrong data structure",
        "Start with the naive design because naming its failure is the whole point. Version one keeps a FIFO Queue<Request> per car and serves requests in arrival order. Car is at floor 2. Requests arrive for 15, then 3, then 16. FIFO drives 2 to 15, back down to 3, then back up to 16 — thirty-nine floors of travel to serve three stops that a sweep serves in fourteen, and the passenger at floor 3 watched the car pass them twice. Worse than the inefficiency is the user-visible absurdity: an elevator that passes your floor without stopping while you are waiting for it is the single behaviour every rider recognizes as broken. The correct primitive is SCAN or, in the form real elevators use, LOOK — the same family as disk-arm scheduling, which is the reference the interviewer wants to hear. The car has a DIRECTION and a set of stops. While moving UP it serves the smallest stop greater than or equal to the current floor; new requests for floors ahead of it in the same direction are absorbed into the sweep at zero marginal cost, which is why the sorted set matters — insertion into a TreeSet places the request at the right point in the itinerary automatically. When no stop remains ahead, the car reverses. SCAN reverses only at the physical extremes of the shaft; LOOK reverses at the last actual stop, which is strictly better and what every real controller implements. Two sets rather than one is the implementation subtlety worth explaining: a stop at floor 7 means something different depending on whether the passenger wants to go up or down from 7, so upStops and downStops keep the two sweeps separate and each direction's query is a single ceiling() or floor() call. The complexity claim is that adding a request is O(log n) and choosing the next stop is O(log n), with n the number of pending stops for one car — bounded by the floor count, so effectively constant. STARVATION is the follow-up: pure LOOK is starvation-free because the sweep necessarily reaches every floor within one full traversal, whereas a nearest-stop-first policy (SSTF, the greedy sibling) starves the extremes indefinitely under a stream of mid-building calls. Say that comparison out loud; it is the difference between reciting an algorithm and understanding why it was chosen."),
      C("deep_dive", "Deep dive: dispatch across a bank — the cost function and the direction-aware state machine",
        "With multiple cars the second decision appears and it is genuinely separate: WHICH car takes a hall call. The naive answer, nearest car by absolute floor distance, is wrong in a way that is easy to demonstrate. Call: floor 9 going DOWN. Car A is at floor 10 moving UP with a car call for 18; Car B is at floor 14 moving DOWN with a car call for 3. A is one floor away, B is five. Nearest-car picks A, which must first climb to 18 and come all the way back — a twenty-plus-floor detour — while B was going to pass floor 9 travelling downward anyway and would serve the call for FREE. The correct primitive is a COST FUNCTION scoring the MARGINAL cost each car would incur, and the three cases in costFor() above are exactly the taxonomy: the call is ahead of the car and in the same direction (cost is just the gap — a free pickup); ahead but opposite direction, meaning the car must finish its sweep and come back (gap plus roughly twice the remaining sweep); or behind the car entirely (a full reversal, penalized hardest). Refinements you should be able to name: add a term for the car's current load so a full car is not chosen; add expected door-dwell time per already-scheduled stop, since stopping is expensive in real seconds; cap assignment so one car does not accumulate every call; and, critically, make the assignment RE-EVALUABLE — a call assigned to car A can be reassigned if A becomes overloaded or goes out of service, which argues for keeping unassigned hall calls in a bank-level pending set rather than committing them irrevocably into a car. The DIRECTION-AWARE STATE MACHINE is the other half. A car's Direction is not decoration; it is the field every admission rule reads. The transitions are tight: IDLE plus a stop adopts that stop's direction; MOVING_UP with a stop ahead continues; MOVING_UP with no stop ahead but stops below flips to MOVING_DOWN; MOVING_UP with no stops at all becomes IDLE (and a real system then applies a PARKING policy — send idle cars to the lobby in the morning, distribute them across zones otherwise). Encode those transitions in one method, because the alternative — booleans like isMovingUp and hasRequests scattered across the class — drifts into contradictory states within a sprint, and a car whose flags say both moving and idle is the bug you will never reproduce."),
      C("tradeoffs", "Trade-offs & extension points",
        "LOOK vs SCAN vs SSTF vs FIFO: FIFO is simplest and indefensible; SSTF (nearest stop first) minimizes travel between consecutive stops but starves the extremes; SCAN and LOOK bound the worst case at one traversal and LOOK avoids the pointless ride to the shaft ends — pick LOOK and be able to say why the other three lose. Some buildings use a hybrid: LOOK normally, plus a starvation guard that promotes any call older than a threshold to the front of the next sweep, which is a fairness patch worth mentioning because it is what keeps SSTF-flavoured optimizations honest. NEAREST-CAR vs COST-FUNCTION dispatch: nearest-car is one line and wrong in the direction-mismatch case; the cost function costs a few lines and is the actual industry answer. DESTINATION DISPATCH is the modern extension and a strong thing to raise unprompted: passengers enter their destination in the lobby instead of pressing UP, so the system can GROUP passengers with the same destination into the same car — this changes the model (a hall call now carries a destination, not just a direction) and can cut peak wait time dramatically, at the cost of a much harder assignment problem and a user-interface change. ZONING for tall buildings — cars dedicated to floor bands, express cars that skip 1 to 30 — is a dispatcher-level policy, which is the payoff of having kept dispatch separate. CONCURRENCY choices: one thread per car with per-car locks is the clean model and matches the physical reality of independent machines; a single scheduler thread driving all cars via a tick loop is easier to test deterministically (and a virtual Clock behind an interface is how you unit-test any of this without sleeping); a shared bank-wide lock is the design smell to avoid. WHAT BREAKS AT SCALE: the algorithms are fine — the pressures that actually appear are peak traffic patterns (morning up-peak, lunch two-way, evening down-peak) needing different dispatch weights, and the fact that hall-call state must survive controller restarts, which pushes pending calls into durable storage. Testability is the extension nobody mentions and everybody needs: with Clock, Dice-free deterministic motion and a strategy interface, you can replay a whole rush-hour trace as a unit test and assert on wait-time percentiles."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'A request comes in for a floor the car is about to pass — does it stop?' — yes, and that is the whole point of the sorted stop set: insertion places it correctly in the current sweep, so the car serves it at zero marginal cost. If your data structure is a FIFO queue you cannot answer this question well, which is why the interviewer asks it. 'Why two sets instead of one?' — a stop at floor 7 for someone going up and a stop at floor 7 for someone going down are different obligations; separating them keeps each sweep's next-stop query a single ceiling/floor call and stops a downward sweep from serving an upward hall call it will strand. 'Nearest car takes the call — any problem?' — walk the direction-mismatch example: a car one floor away but heading the wrong way is far more expensive than a car five floors away already travelling toward the caller; the cost function encodes that. 'How do you prevent starvation?' — LOOK bounds every call at one traversal; add an age threshold that promotes very old calls if you introduce any greedy optimization on top. 'Two people press UP on the same floor?' — that is one hall call; deduplicate by (floor, direction), which is another reason hall calls and car calls are different types. 'A car goes out of service with stops assigned?' — its car calls are lost passengers already inside (handle by completing the current stop, opening doors, then draining), and its hall calls must be RETURNED to the pending set for reassignment, which is the argument for not committing assignments irrevocably. 'How would you test this?' — inject a virtual Clock and drive the motion loop by ticks; the whole system becomes deterministic and you can assert exact stop sequences. 'Make it real-time?' — the control loop moves to a hard-real-time layer with the safety interlocks (overspeed governor, door interlock) enforced in hardware; the scheduling logic stays exactly as designed, which is a good note to end on because it shows you know which parts of the answer are software policy and which are safety-critical."),
    ],
    "The elevator is the most-asked LLD case study after the parking lot, and it is asked precisely because the naive answer is so tempting: a queue of requests per car. Interviewers grade three things. First, whether you reach for a DIRECTIONAL SWEEP (LOOK/SCAN, the disk-scheduling family) over sorted stop sets and can explain why the queue produces cars that pass waiting passengers. Second, whether you SEPARATE dispatch (which car takes a hall call, scored by a marginal-cost function) from scheduling (the order one car stops), and whether you spot that nearest-car dispatch fails on direction mismatch. Third, whether the car is a real state machine over Direction — including IDLE as a genuine state — rather than a bag of booleans. Concurrency granularity (per-car locks, no bank-wide lock) and starvation freedom are the follow-ups that separate senior from mid-level, and mentioning destination dispatch unprompted reads as someone who has thought about the domain rather than memorized a diagram.",
    [
      G("fifo_request_queue", "Modelling each car's pending work as a FIFO queue of requests served in arrival order.", "Use a directional sweep (LOOK) over two SORTED stop sets: while moving up serve the smallest stop at or above the current floor, absorbing new same-direction requests into the itinerary automatically, and reverse only when nothing remains ahead.", "Queue<Request> or List<Integer> per elevator with poll() driving movement; the design cannot answer 'a call arrives for a floor the car is about to pass'; travel distance that grows with request order rather than request spread."),
      G("nearest_car_dispatch", "Assigning each hall call to the car with the smallest absolute floor distance, ignoring the car's direction and committed stops.", "Score each car's MARGINAL cost: free when the call is ahead and same-direction, gap plus remaining sweep when ahead but opposite, heavily penalized when it needs a full reversal; keep unassigned calls in a bank-level pending set so assignments can be revised.", "Math.abs(car.floor - call.floor) as the only dispatch criterion; no use of the hall call's direction field; a car assigned a call it must reverse twice to serve."),
      G("boolean_soup_state", "Tracking a car's motion with scattered booleans (isMoving, goingUp, hasRequests) instead of one Direction state with guarded transitions.", "Model Direction as UP/DOWN/IDLE with a single transition method driven by one predicate — is any stop ahead in the current direction — so reversal and idling are derived, never set by hand from three places.", "if (isMoving && !goingUp && hasRequests) ladders; states that contradict (moving and idle simultaneously); direction assigned at each call site of addStop rather than derived."),
    ],
    0.5, DIAG.elevator, "Elevator system class diagram"),

  // ─────────────────── VENDING MACHINE ──────────────────────────────────────
  TT("lld_m5", "lld_m5_t2", 2, "Design a Vending Machine", "design-vending-machine",
    ["case-study", "state-pattern", "atomicity", "algorithms"],
    "A customer feeds in three coins totalling 65, selects a 40 snack, and the machine owes 25 back — but the vault holds only 50s and 10s. Meanwhile the same slot's last unit was just taken by the person on the other side of a networked twin machine. Does the machine dispense, refund, or freeze? And how many if-statements did you just add to answer? Design the Vending Machine.",
    "The mechanism is the STATE PATTERN done properly: the machine is a context that delegates every event to a state OBJECT, and each state returns the next state. Idle, HasMoney, Dispensing and Refunding each answer the same five events differently, and illegal events (select while idle, insert coin mid-dispense) are rejected by the state that owns them rather than by a nest of guards in one giant method. Underneath sits the real correctness question: dispensing must decrement STOCK and CHANGE together as one atomic step, because a machine that hands out a snack and then discovers it cannot make change has already lost the argument with the customer.",
    [
      C("requirements", "Requirements",
        "Functional: the machine holds PRODUCTS in numbered slots, each slot with a price and a unit count. A customer inserts COINS or notes of accepted denominations one at a time, sees a running credit, selects a slot, and the machine either dispenses the product plus exact change or rejects the selection with a reason. The customer may press CANCEL at any point before dispensing and get the full inserted amount back. Operator functions matter and are usually forgotten by candidates: restock a slot, refill the coin vault, collect accrued cash, set prices, and read a sales report — all of which are events that must be illegal while a customer transaction is in flight, which is itself a state question. Error paths that must be modelled rather than hand-waved: insufficient credit for the selection, slot sold out, EXACT CHANGE ONLY when the vault cannot compose the required change, a coin the machine does not accept (returned immediately, not credited), and a dispense that physically fails (motor jam) and must refund. Non-functional constraints that drive the design: the event set is small and fixed but the LEGALITY of each event depends entirely on where the transaction currently stands, which is the signature of a state machine; money correctness is non-negotiable, so all amounts are integer MINOR UNITS (cents/paise) and never floating point; the machine must never be left in a state where money and goods are both gone; and if the same inventory is shared across a network of machines or a mobile-pay backend, the stock decrement becomes contended shared state and must be atomic. Clarify scope: single machine, in-memory model, hardware (coin acceptor, dispense motor) behind interfaces."),
      C("entities", "Core entities & responsibilities",
        "VENDINGMACHINE is the CONTEXT: it holds the current MachineState, the Inventory, the CoinVault, and the current transaction's credit, and its public API is exactly the event set — insertCoin(coin), selectSlot(code), dispense(), cancel(), and the operator events. It contains no branching about legality; it forwards each event to the current state and installs whatever state comes back. MACHINESTATE is the interface with one method per event, each returning the next MachineState; the concrete states are IDLE (accepts coins and operator actions, rejects selection), HASMONEY (accepts more coins, a selection, or cancel), DISPENSING (a transient state that rejects everything from the customer while the motor runs), REFUNDING (returns credit then goes idle) and optionally OUTOFSERVICE. INVENTORY maps slot code to a Slot holding product, price in minor units, and count, and exposes a single meaningful operation: reserve(slotCode), an atomic conditional decrement that succeeds only if the count is positive — the same shape as a seat grab in a booking system, and saying so shows you see the pattern. COINVAULT owns denomination counts and the two operations that matter: accept(coins) and a single compose-and-remove for change; it never exposes a mutable count for a caller to check-then-modify. CHANGEMAKER is the algorithm holder: given an amount and the vault's denomination counts, return a multiset of coins or report impossible. PRODUCT and COIN are value objects; COIN is an enum of denominations because the accepted set is fixed hardware. TRANSACTION (credit, selected slot) is the small mutable bundle the states hand between themselves, and keeping it explicit is what makes cancel and refund trivially correct."),
      C("design", "Class design & patterns",
        "The design decision under examination is how you encode legality of events. The naive shape is one enum field plus a switch inside every method: insertCoin checks if (state == DISPENSING) reject else..., selectSlot checks a different combination, cancel checks another. With five events and five states that is a twenty-five-cell truth table smeared across five methods, and the cells nobody wrote are the bugs — insert a coin during dispensing, select a second slot after selecting one, cancel after the motor fired. The STATE PATTERN turns the table into objects: each state class implements all five events, so the compiler forces you to answer every cell, and the illegal ones are one-line rejections that live next to the legal ones for the same situation. Transitions become explicit and local — HasMoneyState.selectSlot returns a DispensingState — instead of scattered assignments to a shared enum field. That is the argument to make: the pattern does not reduce the number of cases, it makes the cases ENUMERABLE and colocated, and it converts 'did we handle that combination?' from a code-reading exercise into a compile-time obligation. Secondary patterns, each justified: STRATEGY for ChangeMaker, because greedy is correct for canonical coin systems and dynamic programming is needed for arbitrary denominations, and a machine deployed in a different currency should swap the algorithm, not fork the class; OBSERVER for low-stock and low-change alerts to the operator, so the transaction path never blocks on notification I/O; SINGLETON is the reflex answer for the machine object and is worth declining out loud — it makes tests share global state for no benefit. Where the pattern is overkill is worth naming too: if you truly had two states and three events, an enum plus a switch is the right amount of machinery, and knowing where the boundary sits is senior signal rather than dogma."),
      K("code", "Core classes (Java)",
        `interface MachineState {
  MachineState insertCoin(VendingMachine m, Coin c);
  MachineState selectSlot(VendingMachine m, String slot);
  MachineState dispense(VendingMachine m);
  MachineState cancel(VendingMachine m);
}

class IdleState implements MachineState {
  public MachineState insertCoin(VendingMachine m, Coin c) {
    m.addCredit(c);                       // hardware already validated the coin
    return new HasMoneyState();
  }
  public MachineState selectSlot(VendingMachine m, String s) {
    m.display("Insert coins first"); return this;         // illegal: stay put
  }
  public MachineState dispense(VendingMachine m) { return this; }
  public MachineState cancel(VendingMachine m)   { return this; }
}

class HasMoneyState implements MachineState {
  public MachineState insertCoin(VendingMachine m, Coin c) { m.addCredit(c); return this; }

  public MachineState selectSlot(VendingMachine m, String slot) {
    Slot s = m.inventory().get(slot);
    if (s == null || s.count() == 0)  { m.display("Sold out");        return this; }
    if (m.credit() < s.price())       { m.display("Insufficient");    return this; }

    // ATOMIC: stock AND change must both be securable, or neither moves.
    long due = m.credit() - s.price();
    synchronized (m.vault()) {
      List<Coin> change = m.vault().compose(due);          // null = cannot make it
      if (change == null) { m.display("Exact change only"); return this; }
      if (!m.inventory().reserve(slot)) { m.display("Sold out"); return this; }
      m.vault().remove(change);                            // both committed here
      m.vault().commitCredit(m.credit());
      m.stageDispense(s.product(), change);
    }
    return new DispensingState();
  }

  public MachineState dispense(VendingMachine m) { return this; }
  public MachineState cancel(VendingMachine m)   { return new RefundingState(); }
}

class DispensingState implements MachineState {
  public MachineState insertCoin(VendingMachine m, Coin c) { m.returnCoin(c); return this; }
  public MachineState selectSlot(VendingMachine m, String s) { return this; }
  public MachineState cancel(VendingMachine m)               { return this; }  // too late
  public MachineState dispense(VendingMachine m) {
    if (!m.hardware().push(m.stagedProduct())) return new RefundingState();     // jam
    m.dropChange(m.stagedChange());
    m.clearCredit();
    return new IdleState();
  }
}

class CoinVault {
  private final EnumMap<Coin, Integer> counts = new EnumMap<>(Coin.class);

  // Greedy is correct only for canonical systems; DP is the general answer.
  List<Coin> compose(long amount) {
    List<Coin> out = new ArrayList<>();
    for (Coin c : Coin.descending()) {
      int take = (int) Math.min(amount / c.value(), counts.getOrDefault(c, 0));
      for (int i = 0; i < take; i++) out.add(c);
      amount -= (long) take * c.value();
    }
    return amount == 0 ? out : null;      // null => EXACT CHANGE ONLY
  }
}`),
      C("deep_dive", "Deep dive: the State pattern done properly — objects, not an enum and a switch",
        "Make the failure concrete before defending the pattern. Suppose the machine keeps State state and every public method opens with a switch. Now add a feature every real machine has: the coin acceptor must reject coins while the dispense motor is running, and the CANCEL button must be dead once the motor fires. Those are two cells of the event-by-state table, and in the switch design they are two new branches added to two unrelated methods by whoever remembers. Six months on, someone adds a MAINTENANCE state and touches five methods; miss one and the machine accepts a coin while an operator has the door open. The State pattern's real value is not elegance, it is EXHAUSTIVENESS: implementing MachineState forces a decision for every event in every state, in one file per state, where a reviewer can read the whole behaviour of 'dispensing' as a unit. Three implementation details separate a correct rendering from a cargo-culted one. FIRST, states should be behaviourally stateless — hold no per-transaction data — so they can be singletons or freshly allocated without consequence; the transaction data (credit, selected slot, staged change) lives on the CONTEXT, which is why cancel() from HasMoney can simply return a RefundingState that reads credit off the machine. Candidates who put credit inside HasMoneyState immediately discover that RefundingState cannot see it and start passing state objects around, which is the pattern collapsing. SECOND, the transition must be the RETURN VALUE, not a side-effecting setter the state calls on the context; returning the next state means exactly one place — the context's event forwarder — installs it, so you can log, guard or assert on every transition centrally. THIRD, ENTRY and EXIT actions belong to states: RefundingState's entry action returns the coins, DispensingState's entry stages hardware, and putting those in the state rather than at the call site is what stops the same refund logic appearing in three branches. The honest caveat to offer unprompted: this pattern costs a class per state, and for a genuinely two-state machine an enum with a switch is the right size. Interviewers respect the boundary being drawn deliberately far more than a reflexive pattern application."),
      C("deep_dive", "Deep dive: atomic stock-plus-change, and the exact-change-only edge",
        "The correctness core is that a purchase is not one decrement but TWO: a unit leaves the slot and coins leave the vault, and the customer's money joins the vault. Do them in sequence with checks in between and you get failures that are individually plausible and jointly unacceptable. Order A — dispense, then compute change — produces a machine that hands out the snack and then discovers it holds only 50s when it owes 25; it now must either short the customer or overpay. Order B — pay change, then dispense — produces the opposite disaster on a motor jam: change is gone, snack is not. The primitive is to make the whole thing ONE guarded step: under a single lock, compose the change WITHOUT removing it, reserve the stock with an atomic conditional decrement, and only when BOTH have succeeded commit the removals; any failure exits before anything has moved. That is what the synchronized block in selectSlot does, and it is the same shape as a two-resource reservation anywhere else — the coupon budget, the flight seat, the concert ticket. If the two resources genuinely live in separate systems (networked machines sharing inventory, a payment backend holding money) you cannot take one lock and the pattern becomes reserve-both-then-confirm with compensating releases on failure — a miniature saga, and naming that escalation path is the senior answer. Then the physical failure: the motor jams AFTER commit. Money and stock are already committed, so the machine must COMPENSATE — refund the full credit, mark the slot faulty, and log for the operator — which is why DispensingState returns RefundingState rather than throwing. Now EXACT CHANGE ONLY, the edge that separates people who have thought about the machine from people who have thought about the diagram. Change is a coin-change problem over a MULTISET WITH LIMITED SUPPLY, not the textbook unlimited-coin version. Greedy — take as many of the largest denomination as fit, descend — is optimal only for CANONICAL coin systems (most real currencies are canonical, which is why greedy survives in practice), and it is not even FEASIBLE-complete under limited supply: owing 30 with one 25 and three 10s, greedy takes the 25 and then cannot make 5, while 10+10+10 exists. The robust answer is a small bounded-knapsack dynamic program over amount and available counts (amounts are tiny, denominations few, so it is microseconds), with greedy as a fast path. The product decision that falls out: if change cannot be composed, the machine must refuse the SELECTION and say EXACT CHANGE ONLY before taking anything, not discover it mid-transaction — which is precisely why compose() is called before any commit, and why it returns the coin list rather than a boolean."),
      C("tradeoffs", "Trade-offs & extension points",
        "STATE OBJECTS vs ENUM+SWITCH: objects give compile-time exhaustiveness, colocated behaviour and easy addition of states, at the cost of a class per state and slightly harder 'what does insertCoin do everywhere' searches; the switch is fine for two or three states and rots fast beyond that. A third option worth naming is a TRANSITION TABLE — a Map<(state,event), handler> — which is the most compact and makes the machine data-driven and diagrammable, but sacrifices the compiler's help; state-machine-heavy domains (protocol stacks, order lifecycles) often end up there deliberately. GREEDY vs DP CHANGE: greedy is O(denominations), correct for canonical systems with sufficient supply, and wrong under limited supply as shown; DP is optimal and complete but needs the amount-by-supply table — given the tiny numbers involved, defaulting to DP and keeping greedy as a fast path is the defensible engineering call. REFUND POLICY: return the exact coins inserted (needs per-transaction coin tracking and complicates the vault) versus return equivalent value from the vault (simpler, and what real machines do) — the difference matters when the machine's own change supply is what the customer just improved. SYNCHRONOUS vs STAGED DISPENSE: modelling DISPENSING as a real state with an async hardware callback is more faithful and lets the machine reject customer events while the motor runs; treating dispense as a synchronous call inside selectSlot is simpler but makes the jam-compensation path awkward. EXTENSIONS to expect: CASHLESS PAYMENT slots in as another credit source, but note it changes the atomicity story because the payment authorization is now a remote call with its own failure modes — authorize, reserve stock, capture, and compensate; MULTI-SLOT PURCHASE turns credit management into a small cart; PRICING RULES (happy hour, bundles) belong behind a strategy so the state machine never learns about promotions; TELEMETRY and remote restock alerts are pure Observer additions. What breaks at scale is not the single machine but the FLEET: shared inventory across networked machines moves the atomic reserve into a shared store with a conditional update, and machine-local state must tolerate being offline — an offline-first vending fleet reconciles sales on reconnect, which is where this LLD hands off to distributed design."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'A coin is inserted while the machine is dispensing — what happens?' — DispensingState.insertCoin returns the coin immediately and stays in the same state; the point of the question is whether that cell of the table exists at all, which is exactly what the pattern guarantees. 'Where does credit live?' — on the context, not inside HasMoneyState, so refund and cancel from any state can read it; states stay behaviourally stateless and interchangeable. 'The customer cancels after selecting?' — legal until the dispense commit; after commit, cancel is a no-op and the machine completes or compensates, because the stock and change are already reserved. 'The machine owes 25 but has only 50s and 10s?' — the change composition runs BEFORE any commit and fails, so the selection is refused with EXACT CHANGE ONLY and the customer's coins are still theirs to reclaim with cancel. 'Is greedy change always right?' — no: it is optimal for canonical systems with unlimited supply, and under limited supply it can fail to find a feasible set that exists (owe 30 with one 25 and three 10s); a bounded-supply DP is the complete answer. 'The motor jams mid-dispense?' — money and stock are committed, so compensate: refund full credit, mark the slot faulty, alert the operator; the state machine models this as a transition to Refunding, not an exception thrown from the middle of a method. 'Two machines share one inventory pool?' — the in-process conditional decrement stops protecting anything; the reserve moves to the shared store as a conditional update, and because your design already narrowed the mutation to one operation, that is a substitution rather than a rewrite. 'Adding a MAINTENANCE state — what changes?' — one new class implementing the interface, plus the operator event that enters it; no existing method grows a branch, which is the payoff you promised when you chose state objects over a switch."),
    ],
    "The vending machine is the canonical STATE PATTERN interview, and interviewers use it to find out whether you can apply the pattern properly or merely name it: states as objects that own their transitions and return the next state, transaction data on the context, illegal events answered locally instead of guarded by a growing if-ladder. The second axis they probe is money correctness — that a purchase couples a stock decrement to a change composition and both must commit together, that a jam demands compensation rather than an exception, and that amounts are integer minor units. The exact-change-only edge is the tell: candidates who reach for greedy without noticing that limited coin supply breaks feasibility get one follow-up and unravel, while candidates who can state where greedy is provably optimal and when a bounded-supply DP is required demonstrate they treat coin change as an algorithm rather than a formality.",
    [
      G("enum_switch_state", "Encoding machine state as an enum field plus a switch in every event method, so the event-by-state table is smeared across the class.", "Make each state a class implementing the full event interface and returning the next state; the compiler then forces a decision for every event in every state and transitions become explicit, local and centrally installable.", "switch (state) inside insertCoin, selectSlot and cancel; new states requiring edits to five methods; combinations like insert-coin-while-dispensing simply unhandled."),
      G("nonatomic_dispense", "Dispensing the product and then computing change (or paying change and then dispensing) as separate steps with checks in between.", "Compose the change and reserve the stock inside ONE guarded step, committing both only after both succeed; on hardware failure after commit, compensate with a full refund and a faulty-slot flag.", "inventory.count-- followed later by vault.remove(); 'exact change only' discovered after the product has dropped; no compensating path for a motor jam."),
      G("greedy_change_assumed", "Assuming greedy denomination selection always makes change, ignoring that the vault holds a LIMITED supply of each coin.", "Treat change as bounded-supply coin change: run a small DP over amount and available counts (greedy as a fast path), and refuse the selection with EXACT CHANGE ONLY before committing anything when no composition exists.", "while (amount >= coin.value) loops with no count check; change failures surfacing after the sale; no exact-change-only state or display at all."),
    ],
    0.4, DIAG.vending, "Vending machine class diagram"),

  // ─────────────────── SPLITWISE ────────────────────────────────────────────
  TT("lld_m5", "lld_m5_t3", 3, "Design Splitwise (Expense Sharing)", "design-splitwise",
    ["case-study", "algorithms", "strategy", "money"],
    "Four friends share a trip. A pays 6,000 for the hotel split equally, B pays 1,000 for fuel split 40/30/20/10, C pays 500 for coffee split between two of them, and A lends D 700 directly. Twelve pairwise debts now exist between four people. How many bank transfers actually settle the group — and what does 6,000 split three ways round to, in cents, so nobody is short a paisa? Design Splitwise.",
    "Two mechanisms carry this design. First, the LEDGER: every expense posts equal-and-opposite entries in integer minor units, so the group's balances always sum to exactly zero — an invariant you can assert on every write and which catches nearly every bug this domain produces. Second, DEBT SIMPLIFICATION: net each member down to ONE signed number, then greedily match the largest creditor against the largest debtor; each match zeroes at least one person, so at most n-1 transfers settle any group, however tangled the pairwise web looks. Around them sits split-strategy polymorphism, and the rounding rule that decides who eats the leftover cent.",
    [
      C("requirements", "Requirements",
        "Functional: USERS form GROUPS (a trip, a flat, a dinner) and record EXPENSES. An expense has a payer (or several payers in the general case), a total amount, a description, and a SPLIT specifying what each participant owes: EQUAL among the selected participants, EXACT amounts per person, PERCENTAGE per person, or by SHARES (2 shares for the couple, 1 each for the singles). The system maintains, for every ordered pair of users, who owes whom how much; it must show a user their per-friend balance, their per-group balance, and a single 'you are owed X overall' number. Users record SETTLEMENTS (real payments) which reduce balances, and expenses can be EDITED or DELETED, which must reverse their exact effect rather than being approximated. The headline feature is SIMPLIFY DEBTS: reduce the tangle of pairwise obligations to a minimal-ish set of transfers. Non-functional requirements that shape the classes: MONETARY CORRECTNESS above all — amounts are integer minor units, never doubles, and every split must distribute the total EXACTLY, with the remainder assigned by a stated rule rather than lost to rounding; AUDITABILITY — a balance is never a mutable number someone edits, it is the fold of an append-only expense history, so deletion is reversal and every displayed figure is explainable line by line; EXTENSIBILITY — new split types are a product certainty, so the split algorithm must be pluggable; and CONCURRENCY — two members adding expenses to the same group simultaneously must not lose an update, which favours posting immutable entries over read-modify-write on a balance field. Clarify scope: one currency per group (multi-currency is a named extension), in-memory model with the store behind an interface, no payment rails."),
      C("entities", "Core entities & responsibilities",
        "USER is identity plus display data. GROUP holds members and the group currency, and scopes both expenses and balances. EXPENSE is IMMUTABLE once created: id, groupId, payer(s) with amounts paid, total in minor units, description, timestamp, the participants, and the resolved per-participant SHARE MAP — note that the expense stores the RESULT of the split, not just its parameters, so that changing the strategy implementation later cannot silently rewrite history; that is a subtle but genuinely senior modelling choice. SPLITSTRATEGY is the interface: split(totalMinorUnits, participants, params) returns a Map<userId, amountOwed>, with implementations EqualSplit, ExactSplit, PercentSplit and ShareSplit; each must validate that its output sums to the total exactly. BALANCESHEET owns the pairwise ledger — conceptually Map<(from,to), amount>, in practice a Map<userId, Map<userId, Long>> with the antisymmetry invariant balance(a,b) == -balance(b,a) maintained by construction so the two directions can never disagree. It exposes applyExpense and applySettlement, and both are pure additions of equal-and-opposite entries. SETTLEMENT is a payment record (from, to, amount, timestamp) treated as just another ledger entry, which is why 'I paid you back' and 'you paid for dinner' need no special casing anywhere downstream. DEBTSIMPLIFIER is a stateless algorithm object: given a set of net balances, produce a transfer list. EXPENSESERVICE is the facade that validates, applies the strategy, posts to the ledger, and emits events. Keeping the simplifier stateless and separate from the ledger is what lets you offer simplification as a VIEW rather than a destructive rewrite of history."),
      C("design", "Class design & patterns",
        "Three design commitments deserve explicit defence. FIRST, the balance is DERIVED, not stored as the primary truth. Expenses and settlements are an append-only log; balances are their fold. That gives you free auditability ('why do I owe 340?' walks the entries), exact reversal on delete, and immunity from the read-modify-write races a mutable balance field invites. The practical compromise every real system makes is to CACHE the folded balance for fast reads while keeping the log authoritative, and stating that compromise — with the cache rebuilt from the log — is better than pretending either extreme is free. SECOND, STRATEGY for splitting. The alternative is one calculateSplit method with a switch over a SplitType enum, and it fails the moment product adds 'split by adjustment' or 'itemized bill with per-item participants': every new type edits shared code and the validation for each type accumulates in one place. As separate classes, each strategy owns its own parameter validation (percentages sum to 100, exact amounts sum to the total, shares are positive) and its own remainder rule, and each is a five-line unit test. THIRD, the pairwise LEDGER over a naive 'debts list'. Storing a list of individual IOUs means answering 'what do A and B owe each other' is a scan and a fold every time; keeping one signed number per ordered pair makes it O(1) and makes the antisymmetry invariant enforceable in the setter. Patterns beyond those two: OBSERVER for notifications when an expense involves you; COMMAND is a natural fit for edit/delete-as-reversal if you want undo; and a SERVICE FACADE so callers never touch the ledger directly. What is deliberately absent is floating point anywhere, and inheritance hierarchies over expense types — an expense is data plus a strategy result, not a class family."),
      K("code", "Core classes (Java)",
        `interface SplitStrategy {
  /** Must distribute EXACTLY total minor units across participants. */
  Map<String, Long> split(long totalCents, List<String> participants, Map<String, Long> params);
}

class EqualSplit implements SplitStrategy {
  public Map<String, Long> split(long total, List<String> ps, Map<String, Long> ignored) {
    int n = ps.size();
    long base = total / n, rem = total - base * n;      // rem in [0, n)
    Map<String, Long> out = new LinkedHashMap<>();
    for (int i = 0; i < n; i++)
      out.put(ps.get(i), base + (i < rem ? 1 : 0));     // deterministic: first 'rem' pay +1c
    return out;                                          // sum == total, exactly
  }
}

class PercentSplit implements SplitStrategy {
  public Map<String, Long> split(long total, List<String> ps, Map<String, Long> bps) {
    long sum = bps.values().stream().mapToLong(Long::longValue).sum();
    if (sum != 10_000) throw new IllegalArgumentException("basis points must total 10000");
    Map<String, Long> out = new LinkedHashMap<>();
    long assigned = 0;
    for (int i = 0; i < ps.size(); i++) {
      String u = ps.get(i);
      long share = (i == ps.size() - 1) ? total - assigned          // last absorbs remainder
                                        : total * bps.get(u) / 10_000;
      out.put(u, share); assigned += share;
    }
    return out;
  }
}

class BalanceSheet {                       // pairwise ledger, antisymmetric by construction
  private final Map<String, Map<String, Long>> bal = new HashMap<>();

  private void post(String from, String to, long cents) {
    bal.computeIfAbsent(from, k -> new HashMap<>()).merge(to, cents, Long::sum);
    bal.computeIfAbsent(to, k -> new HashMap<>()).merge(from, -cents, Long::sum);
  }

  void applyExpense(String payer, Map<String, Long> owed) {
    for (var e : owed.entrySet())
      if (!e.getKey().equals(payer)) post(e.getKey(), payer, e.getValue());
  }

  void applySettlement(String from, String to, long cents) { post(to, from, cents); }

  Map<String, Long> netBalances() {         // one signed number per member
    Map<String, Long> net = new HashMap<>();
    for (var a : bal.entrySet()) {
      long sum = 0;
      for (long v : a.getValue().values()) sum -= v;   // negative owed => creditor
      net.put(a.getKey(), sum);
    }
    return net;                              // INVARIANT: values sum to exactly 0
  }
}

class DebtSimplifier {
  /** Greedy max-creditor / max-debtor matching: <= n-1 transfers. */
  List<Settlement> simplify(Map<String, Long> net) {
    PriorityQueue<Map.Entry<String, Long>> cred =
        new PriorityQueue<>((x, y) -> Long.compare(y.getValue(), x.getValue()));
    PriorityQueue<Map.Entry<String, Long>> debt =
        new PriorityQueue<>(Comparator.comparingLong(Map.Entry::getValue));
    net.forEach((u, v) -> { if (v > 0) cred.add(Map.entry(u, v));
                            else if (v < 0) debt.add(Map.entry(u, v)); });

    List<Settlement> out = new ArrayList<>();
    while (!cred.isEmpty() && !debt.isEmpty()) {
      var c = cred.poll(); var d = debt.poll();
      long amt = Math.min(c.getValue(), -d.getValue());
      out.add(new Settlement(d.getKey(), c.getKey(), amt));     // debtor pays creditor
      long cLeft = c.getValue() - amt, dLeft = d.getValue() + amt;
      if (cLeft > 0) cred.add(Map.entry(c.getKey(), cLeft));    // one of the two is
      if (dLeft < 0) debt.add(Map.entry(d.getKey(), dLeft));    // always zeroed here
    }
    return out;
  }
}`),
      C("deep_dive", "Deep dive: the ledger and debt simplification — netting, greedy matching, and the n-1 bound",
        "The naive model keeps a list of IOUs: A owes B 300, B owes C 300, C owes A 300. Three transfers, three people, and a moment's thought shows the correct number is ZERO — the cycle cancels. Now scale it: in a group of n people every expense can create up to n-1 new pairwise obligations, and after a week-long trip the graph is dense, mutually cancelling, and unreadable. The correct primitive is NETTING. Collapse the entire directed multigraph to one signed number per person: total paid minus total owed. Everything about who-paid-what disappears into a single vector, and — the invariant to state out loud — that vector SUMS TO EXACTLY ZERO, because every ledger entry was posted equal and opposite. Assert it; when it is violated you have a rounding or double-posting bug, and this one assertion catches nearly all of them. Netting alone already collapses cycles: A, B, C in the example all net to zero, and zero transfers is the answer without any cleverness. Then the SETTLEMENT phase: partition members into creditors (positive) and debtors (negative) and greedily match the LARGEST creditor with the LARGEST debtor, transferring the minimum of the two magnitudes. The key structural insight is that each transfer ZEROES AT LEAST ONE PARTY — whichever magnitude was smaller vanishes from the problem — so with k non-zero members the loop runs at most k-1 times: AT MOST n-1 TRANSFERS settle any group, no matter how tangled. That bound is the headline result and interviewers want it stated. Be equally precise about what greedy does NOT guarantee. Finding the MINIMUM number of transfers is NP-hard: it reduces to partitioning the balances into the largest possible number of zero-sum subsets (each independently settleable subgroup saves a transfer), which is a subset-sum flavoured problem. Greedy is a good heuristic, never provably optimal — example: balances +5, +5, -5, -5 settle in two transfers by pairing equals, and greedy happens to find it here, but constructions exist where greedy needs more than the optimum. The senior answer is: net first (free, always correct, kills all cycles), match greedily (O(n log n), bounded by n-1), and note that exact minimization is exponential and not worth it for group sizes that fit in a dinner. One product caveat worth raising unprompted: simplification REWRITES who pays whom, so 'you owe Carol' can appear when you never transacted with Carol — many users find that confusing, which is why real products make simplification an opt-in VIEW over the ledger rather than a destructive rewrite, and keeping the simplifier stateless is what preserves that option."),
      C("deep_dive", "Deep dive: split-strategy polymorphism and the leftover-cent problem",
        "Splitting looks like arithmetic and is actually where the money bugs live. Start with the type axis. EQUAL, EXACT, PERCENT and SHARES have genuinely different inputs and genuinely different validation rules — percentages must total 100, exact amounts must total the bill, shares must be positive integers — and encoding all four in one method with a switch means one function owning four validation regimes, which is exactly the shape that breaks when 'split by adjustment' (everyone equal, but Bob had the extra beer) arrives. As separate SplitStrategy implementations each owns its validation and its remainder policy, and the service layer only knows split() returns a map that sums to the total. Enforce that postcondition in the service, not in each strategy's good intentions: assert sum(result) == total on every path, and a whole class of bugs cannot ship. Now the leftover cent, which is the part candidates skip and interviewers always poke. 6000 split three ways is 2000 each — fine. 1000 split three ways is 333.33 each, and there is no such coin. Do it in floating point and you get 333.3333333333333 per person, 999.9999999999999 total, a residue that displays as 1000.00 but fails an equality check, and — after a hundred expenses — balances that drift far enough to be visibly wrong. Rule one: NEVER use double or float for money; represent everything in integer minor units (cents, paise) and, if fractional cents are ever needed, BigDecimal with an explicit scale and RoundingMode. Rule two: split with integer division and DISTRIBUTE THE REMAINDER deterministically. base = total / n and rem = total - base*n gives a remainder strictly less than n, and the policy is simply which rem participants pay one extra minor unit. The EqualSplit above gives it to the first rem participants in a stable order; other defensible policies are 'the payer absorbs it' or 'rotate by expense id so it evens out over time', and any of them is fine as long as it is DETERMINISTIC and STATED — non-determinism here means recomputing the same expense produces different balances, which destroys the auditability the ledger exists to provide. For PERCENT the same idea appears with a twist: compute each share by integer arithmetic (total * basisPoints / 10000, and use BASIS POINTS rather than a double percentage so 33.33% is representable exactly), then give the accumulated remainder to the LAST participant so the sum is exact by construction — that is why PercentSplit computes the final share as total minus assigned rather than by formula. The general principle to articulate: in money code, compute n-1 shares by rule and DERIVE the last one by subtraction; the total is then exact by construction rather than by luck, and no rounding mode can leak a cent."),
      C("tradeoffs", "Trade-offs & extension points",
        "PAIRWISE LEDGER vs NET-ONLY BALANCES: keeping per-pair numbers preserves the true history ('you and Rahul are square, you and Anu are not') and supports per-friend views; keeping only net balances is smaller and simpler but destroys the pairwise story users expect and makes group-scoped views impossible. Real systems keep pairwise and derive net on demand, which is the choice to defend. EVENT LOG vs MUTABLE BALANCE: the append-only log gives exact reversal on edit/delete, auditability, and no lost updates under concurrency, at the cost of a fold per read — solved with a cached balance rebuilt from the log, with the log authoritative. Mutating a stored balance directly is faster and is how balances go quietly wrong. SIMPLIFY AS VIEW vs AS REWRITE: as a view, users keep their real pairwise history and can ignore the suggestion; as a rewrite, the ledger is replaced by the simplified transfers and the original relationships are gone — irreversible and surprising, so most products offer it as an optional group setting. GREEDY vs OPTIMAL settlement: greedy is O(n log n) with the n-1 bound; optimal minimization is NP-hard (maximize the number of zero-sum subgroups), so exact solvers are only viable for tiny n and buy at most a transfer or two. EXTENSIONS: MULTI-CURRENCY is the big one — an expense carries its own currency and an FX rate SNAPSHOT taken at expense time (never at settle time, or history changes retroactively), and balances become per-currency vectors that simplification must not mix; MULTIPLE PAYERS generalizes the payer field to a paid-by map and the ledger code above already handles it since it posts per-participant entries; RECURRING EXPENSES are a scheduler emitting normal expenses; ITEMIZED BILLS with per-item participants are a new SplitStrategy, exactly the extension the pattern was chosen for; COMMENTS, receipts and activity feeds are Observer-side additions. WHAT BREAKS AT SCALE: a very large group makes the pairwise map O(n squared) — mitigate by storing only non-zero pairs (sparse), which is what the map-of-maps already does; and concurrent expense posting in a hot group argues for the log-plus-cache shape, where writes are appends and only the cache needs invalidation."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'A owes B, B owes C, C owes A, all 300 — how many transfers?' — zero; netting collapses the cycle before any matching runs, which is the fastest way to show you understood the mechanism. 'What is the maximum number of transfers to settle n people?' — n-1, because every greedy match zeroes at least one party; say the bound and the reason together. 'Is greedy optimal?' — no; minimizing transfers means maximizing the number of independently zero-summing subgroups, which is NP-hard, so greedy is a heuristic with a good bound and exact optimization is not worth it at group scale. '1000 split three ways?' — 334/333/333 in integer cents with a stated, deterministic remainder rule; never 333.33 in a double, and the balances must still sum to exactly zero afterwards. 'How do you know the ledger is not corrupt?' — assert that net balances sum to zero on every write; equal-and-opposite posting makes it an invariant rather than a hope. 'Someone edits an expense from three days ago?' — expenses are immutable; an edit posts a reversal of the original entries plus the new ones, so the audit trail survives and the balance is recomputed rather than patched. 'Settlement versus expense?' — a settlement is just another ledger entry in the opposite direction; that uniformity is why no downstream code needs a special case. 'Two people add expenses to the same group at the same instant?' — appends to a log commute, so nothing is lost; a stored mutable balance would need a read-modify-write and is where the lost update would occur. 'Multi-currency?' — snapshot the FX rate at expense time and keep balances per currency; converting at settle time silently rewrites history. 'Why not just show everyone one number?' — because users navigate by relationship; per-pair balances are the product, net balances are the settlement math, and the design keeps both available from the same log."),
    ],
    "Splitwise is the LLD interview that punishes hand-waving about money. Interviewers grade four specific things. One: does the balance model post equal-and-opposite entries so the group nets to exactly zero, and is that invariant asserted rather than assumed. Two: can you produce the DEBT SIMPLIFICATION algorithm — net every member to one signed number, greedily match largest creditor to largest debtor — and state the n-1 transfer bound with the reason (each match zeroes a party), while being honest that true minimization is NP-hard. Three: is splitting polymorphic (equal, exact, percent, shares behind one interface with per-strategy validation) rather than a switch that will grow a branch every quarter. Four, and the one that most often decides the loop: the leftover cent — integer minor units, deterministic remainder distribution, and deriving the last share by subtraction so the total is exact by construction. Candidates who mention floating-point amounts lose the room; candidates who volunteer that simplification should be a view rather than a destructive rewrite show product judgment on top of the algorithm.",
    [
      G("float_money", "Representing amounts as double/float and splitting by division, letting rounding residue accumulate in balances.", "Use integer minor units (or BigDecimal with explicit scale and RoundingMode) everywhere; split with integer division, distribute the remainder by a stated deterministic rule, and derive the final share by subtraction so the total is exact by construction.", "double amount fields; total / n assigned to every participant; balances that display correctly but fail an equality-to-zero check; cent drift growing with expense count."),
      G("no_netting", "Simplifying debts by trying to cancel individual pairwise IOUs, or settling every pairwise obligation directly instead of netting first.", "Net every member to one signed balance (the vector sums to zero), then greedily match the largest creditor with the largest debtor; each transfer zeroes a party, so at most n-1 transfers settle the group and cycles vanish for free.", "nested loops hunting for cancelling pairs; A->B->C->A cycles producing three transfers instead of zero; transfer counts that grow with expense count rather than member count."),
      G("split_type_switch", "One calculateSplit method switching on a SplitType enum, with all four validation regimes tangled together.", "Model each split as a SplitStrategy implementation owning its own validation and remainder policy, and enforce sum(result) == total as a postcondition in the service so no strategy can silently under- or over-distribute.", "switch (expense.splitType) inside the expense service; percentage validation living next to exact-amount validation; a new split type requiring edits to a shared method."),
    ],
    0.5, DIAG.splitwise, "Splitwise expense sharing class diagram"),

  // ─────────────────── RATE LIMITER ─────────────────────────────────────────
  TT("lld_m5", "lld_m5_t4", 4, "Design a Rate Limiter", "design-rate-limiter",
    ["case-study", "algorithms", "concurrency", "strategy"],
    "The limit is 100 requests per minute per API key. A client sends 100 requests at 12:00:59.900 and another 100 at 12:01:00.100. Your fixed-window counter accepts all 200 — two hundred requests in two hundred milliseconds, double the limit, and the counter never once exceeded 100. Now add ten million keys and eight threads. Design a Rate Limiter that does not have this hole.",
    "The design question is which ALGORITHM, and the answer is decided by one number: fixed-window counters permit a 2x burst across the window boundary, provably. Token bucket fixes it by making capacity continuous rather than resetting, sliding-window-log fixes it exactly at O(N) memory per key, and the sliding-window counter approximates it in O(1) with a weighted blend of the previous window. The second mechanism is LAZY REFILL: never run a timer thread topping up buckets — recompute tokens from elapsed time on each call, inside one short per-key critical section, so ten million idle keys cost exactly zero CPU.",
    [
      C("requirements", "Requirements",
        "Functional: given a KEY (API key, user id, IP, or a tuple of key and endpoint) and optionally a COST, decide ALLOW or DENY against a configured limit such as 100 requests per minute or 10 per second with bursts of 50. Different keys have different limits — tiers (free, pro, enterprise), per-endpoint overrides, and global safety caps that apply on top — so the limiter must resolve a RULE for the request before applying an algorithm. Callers need more than a boolean: the standard HTTP contract is to return the limit, the remaining allowance, the reset time and, on rejection, a Retry-After, so the decision object must carry those numbers. The limiter must handle keys appearing and disappearing constantly (a new IP is a new bucket) and must not leak memory as a result. Non-functional constraints are the design. CORRECTNESS AT THE BOUNDARY — the limit must hold over any window position, not just over the aligned windows the implementation happens to use, which is exactly the property fixed-window counters lack. LOW LATENCY — the limiter sits in front of every request, so the decision must be a handful of operations and must never block on I/O or on a coarse global lock. MEMORY — with millions of keys, per-key state must be O(1), which immediately disqualifies keeping a timestamp per request at scale. THREAD SAFETY — many request threads hit the same key concurrently and check-then-increment is a race that lets a hot key exceed its limit. And a scope statement worth making explicitly: this is the SINGLE-NODE design; distributed limiting (shared counters in Redis with atomic INCR plus expiry, or per-node quotas) is the named extension, and mixing the two conversations is how candidates lose the thread."),
      C("entities", "Core entities & responsibilities",
        "RATELIMITER is the facade: allow(key, cost) returns a Decision (allowed, remaining, resetAt, retryAfter). It resolves the RULE for the key and delegates to a strategy. RULE is configuration — limit, window or refill rate, burst capacity, and the scope the rule applies to — resolved by a small chain (endpoint override, then tier, then default) so policy lives in data rather than in code. LIMITERSTRATEGY is the interface with a single method, tryAcquire(state, cost, nowNanos); the implementations are the algorithms and each owns its own per-key state shape: TOKENBUCKET holds tokens (a double or a fixed-point long) plus lastRefillNanos; SLIDINGWINDOWLOG holds a deque of request timestamps; SLIDINGWINDOWCOUNTER holds the current window's count, the previous window's count, and the current window start; FIXEDWINDOW holds a count and a window start and exists mainly as the foil you explain away. BUCKETREGISTRY maps key to per-key state and is where the scale problems live: it must create state lazily on first sight of a key, EVICT idle keys (an LRU or a TTL cache — Caffeine with expireAfterAccess is the practical answer), and shard its own locking so that unrelated keys never contend; a ConcurrentHashMap with per-entry synchronization gives that naturally, since locking the bucket object locks only that key. CLOCK is an interface returning monotonic nanos, and it is not a nicety — it is what makes the whole thing unit-testable without sleeping, and using System.nanoTime rather than wall-clock time is what makes it immune to NTP steps and daylight-saving jumps. DECISION is the immutable result value object."),
      C("design", "Class design & patterns",
        "The pattern selection is easy and the justification is what matters: STRATEGY for the algorithm, because the four algorithms are genuinely interchangeable behind one tryAcquire call and because real deployments mix them — token bucket for burst-tolerant API traffic, sliding-window counter for strict per-minute quotas, a log only where exactness is worth the memory. Making the algorithm an interface also means the boundary-burst discussion becomes a code-level choice rather than a rewrite. The second structural decision is that per-key STATE is owned by the bucket object and the LOCK is the bucket object, giving lock striping for free: two requests for different keys never contend, two requests for the same key serialize for the few instructions the update takes. A single global lock around the limiter is the design smell — it converts a component that must add microseconds into the throughput ceiling of the entire service. The third is LAZY EVALUATION as an explicit principle: no background timer, no scheduled refill sweep, no per-window reset job. State is a pair (value, asOfTime) and every read reconciles it to now before using it. That is why the limiter scales to millions of keys — work is proportional to REQUESTS, not to keys — and it is the single most transferable idea in this design, reappearing in caches, leaky buckets, and any decayed counter. Supporting choices: a CHAIN of rules resolved into one effective rule so composed limits (per-user AND per-IP AND global) are just multiple tryAcquire calls whose results are ANDed — and note the subtlety that a composed check must not consume tokens from limiters that ultimately reject, which argues for a two-phase check-then-commit or accepting a small over-consumption; DECORATOR is a clean way to layer metrics and logging around a limiter; and the Clock interface for determinism. What is deliberately absent: any dependency on wall-clock time, any per-request allocation on the hot path, and any unbounded map."),
      K("code", "Core classes (Java)",
        `interface LimiterStrategy { boolean tryAcquire(long cost, long nowNanos); }

/** Token bucket with LAZY refill: no timer thread, no per-key background work. */
class TokenBucket implements LimiterStrategy {
  private final long capacity;             // burst size
  private final double refillPerNano;      // e.g. 100 tokens / 60s
  private double tokens;
  private long lastRefillNanos;

  TokenBucket(long capacity, long refillPerSecond, long nowNanos) {
    this.capacity = capacity;
    this.refillPerNano = refillPerSecond / 1_000_000_000.0;
    this.tokens = capacity;
    this.lastRefillNanos = nowNanos;
  }

  /** Synchronized on THIS bucket: unrelated keys never contend (lock striping). */
  public synchronized boolean tryAcquire(long cost, long nowNanos) {
    refill(nowNanos);
    if (tokens < cost) return false;       // check and consume are ONE critical section
    tokens -= cost;
    return true;
  }

  private void refill(long nowNanos) {
    long elapsed = nowNanos - lastRefillNanos;         // monotonic: never negative
    if (elapsed <= 0) return;
    tokens = Math.min(capacity, tokens + elapsed * refillPerNano);
    lastRefillNanos = nowNanos;
  }

  synchronized long retryAfterNanos(long cost, long nowNanos) {
    refill(nowNanos);
    double deficit = cost - tokens;
    return deficit <= 0 ? 0 : (long) (deficit / refillPerNano);
  }
}

/** Sliding window counter: O(1) memory, no boundary burst, ~small approximation. */
class SlidingWindowCounter implements LimiterStrategy {
  private final long limit, windowNanos;
  private long windowStart, currCount, prevCount;

  SlidingWindowCounter(long limit, long windowNanos, long nowNanos) {
    this.limit = limit; this.windowNanos = windowNanos; this.windowStart = nowNanos;
  }

  public synchronized boolean tryAcquire(long cost, long nowNanos) {
    roll(nowNanos);
    double elapsedFrac = (nowNanos - windowStart) / (double) windowNanos;
    double weighted = prevCount * (1.0 - elapsedFrac) + currCount;   // the key formula
    if (weighted + cost > limit) return false;
    currCount += cost;
    return true;
  }

  private void roll(long nowNanos) {
    long windowsPassed = (nowNanos - windowStart) / windowNanos;
    if (windowsPassed <= 0) return;
    prevCount = windowsPassed == 1 ? currCount : 0;   // 2+ windows idle: history gone
    currCount = 0;
    windowStart += windowsPassed * windowNanos;
  }
}

class RateLimiter {
  private final ConcurrentHashMap<String, LimiterStrategy> buckets = new ConcurrentHashMap<>();
  private final RuleResolver rules; private final Clock clock;

  RateLimiter(RuleResolver rules, Clock clock) { this.rules = rules; this.clock = clock; }

  boolean allow(String key, long cost) {
    long now = clock.nanos();
    Rule r = rules.resolve(key);
    LimiterStrategy s = buckets.computeIfAbsent(key,
        k -> new TokenBucket(r.burst(), r.ratePerSecond(), now));
    return s.tryAcquire(cost, now);        // lock is the bucket, not the limiter
  }
}`),
      C("deep_dive", "Deep dive: the boundary burst, stated numerically — and the four algorithms",
        "Start with the counterexample because it is the entire reason the other algorithms exist. FIXED WINDOW: keep a counter per key that resets at the top of each minute; increment on each request; reject above the limit. Limit is 100 per minute. A client sends 100 requests between 12:00:59.900 and 12:01:00.000 — the counter for the 12:00 window reaches exactly 100, all allowed, no rule broken. At 12:01:00.001 the window rolls and the counter resets to 0; the client sends another 100 by 12:01:00.100. Two hundred requests inside two hundred milliseconds, and at no instant did any counter exceed its limit. The general result is that fixed-window admits up to 2x the limit over any window-length interval straddling a boundary, and if your backend was sized for 100 per minute it just took 200 in a fifth of a second. This is not a corner case: aligned resets synchronize clients, so real traffic clusters exactly there. SLIDING WINDOW LOG fixes it exactly. Store a timestamp per accepted request in a deque; on each call, evict everything older than now minus the window, then admit if the deque size is below the limit. The window truly slides, so the invariant 'no more than N in ANY window-length interval' holds precisely, and you get exact Retry-After for free (the oldest entry's expiry). The price is memory proportional to the LIMIT PER KEY — a million keys at 1000 requests per minute is a billion timestamps, which is why the log is reserved for small limits or high-value keys — plus O(N) eviction work per call in the worst case. SLIDING WINDOW COUNTER is the practical compromise and the formula is worth memorizing: keep the current window's count, the previous window's count, and blend — weighted = prevCount * (1 - elapsedFraction) + currCount. At 12:01:00.100, elapsedFraction is about 0.0017, so the previous window's 100 counts as roughly 99.8 and the client is rejected immediately. O(1) memory and O(1) time, and the only cost is the approximation: it assumes the previous window's traffic was uniformly distributed, so it can be marginally wrong in both directions — Cloudflare published that it misclassifies well under 1% of requests at production scale, which is the trade almost everyone takes. TOKEN BUCKET is the fourth and is different in KIND: it does not think in windows at all. A bucket holds up to capacity tokens and refills continuously at a fixed rate; a request takes one token or is rejected. Because there is no reset instant there is no boundary to burst across, and the burst behaviour is now an explicit, tunable parameter — capacity is precisely how much burst you are willing to absorb, and the refill rate is the sustained throughput. That separation of BURST from RATE is why token bucket is the default in API gateways. Its sibling LEAKY BUCKET (a queue draining at a constant rate) smooths output rather than admitting bursts, which suits traffic SHAPING toward a fragile downstream rather than fair admission control — name it and the distinction, since interviewers use the pair to check you are not treating the two as synonyms."),
      C("deep_dive", "Deep dive: thread-safe lazy refill — no timer thread, one short critical section",
        "The naive implementation of token bucket schedules a timer: every second, walk every bucket and add tokens. It fails on two independent axes. SCALE — the sweep is O(keys) per tick regardless of traffic, so ten million mostly-idle API keys burn a core doing arithmetic on buckets nobody is using, and the tick granularity becomes the limiter's resolution (a one-second tick cannot express 10 requests per 100ms). CORRECTNESS — the sweep contends with request threads for every bucket it touches, turning a lock that should be held for nanoseconds into one held across a global traversal. The correct primitive is LAZY REFILL: store the pair (tokens, lastRefillNanos) and reconcile ON READ. elapsed = now - lastRefill; tokens = min(capacity, tokens + elapsed * ratePerNano); lastRefill = now. Work is now proportional to REQUESTS, not to keys: an idle bucket costs nothing until someone touches it, and a bucket idle for an hour is refilled correctly in one multiplication when it is finally used, because min() clamps to capacity — no catch-up loop, no accumulated backlog. THREAD SAFETY is the second half and the mistake is familiar: refill(); if (tokens >= 1) tokens--; written without a lock is a read-modify-write on shared state, and two threads both reading 1 token both decrement, taking the bucket to -1 and admitting twice the allowance on precisely the hot keys that matter. The check and the consume must be ONE atomic section. Three implementations, in increasing sophistication: synchronize on the bucket object, as in the code — the critical section is a few arithmetic ops, unrelated keys are on different objects so there is no cross-key contention, and this is genuinely adequate for almost every service; pack the pair into a single 64-bit word (say 32 bits of fixed-point tokens and 32 bits of a truncated timestamp) inside an AtomicLong and CAS-loop the update, which removes the lock entirely at the cost of packing arithmetic and precision; or hold an AtomicReference to an immutable state record and CAS a fresh instance, which is clearer but allocates per successful update. The rule to state: whichever you choose, the invariant is that refill and consume are indivisible. Two more details separate a working limiter from a robust one. THE CLOCK must be monotonic — System.nanoTime, not currentTimeMillis — because wall-clock time can step backwards under NTP correction, making elapsed negative and either subtracting tokens or throwing; the code guards elapsed <= 0 anyway, which is the belt-and-braces an interviewer notices. And the REGISTRY must evict: an unbounded ConcurrentHashMap keyed by client IP is a memory leak with a public trigger, so bound it with expireAfterAccess longer than the window (evicting a bucket resets its allowance, so evicting too eagerly grants free capacity — the TTL must exceed the window for the limit to hold)."),
      C("tradeoffs", "Trade-offs & extension points",
        "ALGORITHM CHOICE, stated as conditions rather than preferences: TOKEN BUCKET when clients legitimately burst and you want burst size to be an explicit product parameter — it is the API-gateway default; SLIDING WINDOW LOG when the contract is legally or financially exact and limits are small (per-account login attempts, expensive endpoints), accepting O(limit) memory per key; SLIDING WINDOW COUNTER when you need a strict per-minute quota across millions of keys at O(1) memory and can tolerate a sub-percent approximation — the volume default; FIXED WINDOW essentially never for enforcement, though it is fine for coarse metrics, and being able to say WHY (the 2x boundary burst) is the point of knowing it; LEAKY BUCKET when the goal is smoothing output toward a fragile downstream rather than admitting bursts, since it queues rather than rejects. LOCK vs CAS per bucket: synchronized is simpler, debuggable, and fast enough because the section is a few instructions; a packed-long CAS avoids the monitor and shines only under extreme same-key contention, where you should also ask whether one key doing that volume is itself the problem. REJECT vs QUEUE vs THROTTLE: rejecting with 429 plus Retry-After is honest and keeps latency bounded; queueing (leaky bucket) hides the limit but adds unbounded latency and needs its own bound; degrading (serving cached or reduced responses) is the product-friendly middle. DISTRIBUTED LIMITING is the extension every interview reaches: per-node quotas (limit divided by node count) are trivial and wrong under uneven load balancing and node churn; a shared store with an ATOMIC operation — Redis INCR with EXPIRE, or a Lua script implementing token bucket so read and write are one round trip — is correct but adds a network hop to every request, so production systems typically combine a local limiter for the common case with periodic reconciliation against the shared counter, accepting brief over-admission. Say that explicitly: perfect distributed exactness costs a synchronous round trip on every request and almost nobody buys it. OTHER EXTENSIONS: cost-weighted requests (an expensive query takes 10 tokens — the cost parameter is already threaded through); composed limits (per-user AND per-IP AND global) whose subtlety is not consuming from limiters that will ultimately reject; per-tier rules resolved from configuration; and the client-side contract — returning limit, remaining and reset headers is what turns a limiter from a wall into an API."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'What is wrong with a fixed-window counter?' — walk the numbers: 100 at 12:00:59.9 plus 100 at 12:01:00.1 is 200 in 200 milliseconds with no counter ever exceeding the limit; aligned resets synchronize clients so this happens in real traffic, not just in theory. 'How does the sliding window counter fix it without storing timestamps?' — the weighted blend prevCount * (1 - elapsedFraction) + currCount treats the previous window as still partially in force; at 100ms into a new minute the old window still counts for 99.8% of its total. 'What does it get wrong?' — it assumes uniform distribution within the previous window, so it can be slightly optimistic or pessimistic; the published error rate is well under a percent, which is why it is the volume default. 'Why not run a timer thread to refill buckets?' — work becomes O(keys) per tick instead of O(requests), the tick becomes your resolution floor, and the sweep contends with request threads; lazy refill from (tokens, lastRefillNanos) is exact and costs nothing for idle keys. 'Two threads hit the same key at once?' — refill-then-consume must be one critical section, or both read the last token and both spend it; synchronize on the bucket (striped by construction) or CAS a packed long. 'Which clock?' — monotonic nanoTime; wall-clock can step backwards under NTP and make elapsed negative. 'Ten million keys?' — bound the registry with a TTL cache whose expiry exceeds the window, because evicting a bucket hands back a full allowance. 'Now make it distributed.' — per-node quotas are simple and wrong under uneven balancing; a Redis Lua script gives one atomic round trip and correctness; most production systems run local buckets plus reconciliation and accept brief over-admission — name the trade rather than claiming exactness. 'How does the client know when to retry?' — the limiter returns remaining and a computed retryAfter (the token deficit divided by the refill rate, or the oldest log entry's expiry), which is why the decision is a value object rather than a boolean."),
    ],
    "Rate limiting is asked at every level and graded very differently by level. Junior answers name a counter; senior answers name the BOUNDARY BURST numerically and use it to derive why token bucket, sliding-window log and sliding-window counter exist, then pick between them by stating the conditions each wins under — burst tolerance, exactness versus memory, and the sub-percent approximation the weighted-blend formula accepts. The second thing interviewers grade is concurrency: lazy refill from a (tokens, lastRefillNanos) pair instead of a timer thread, and refill-plus-consume as one indivisible critical section striped per key rather than a global lock. The third is the operational surface most candidates omit — a monotonic clock, an evicting registry whose TTL exceeds the window, and a Decision carrying remaining and Retry-After. Volunteering that distributed exactness costs a synchronous round trip per request, and that real systems run local buckets plus reconciliation, is the answer that reads as production experience rather than blog recall.",
    [
      G("fixed_window_burst", "Using a per-window counter that resets at the window boundary and assuming the limit is therefore enforced.", "Recognize the 2x boundary burst (100 at 12:00:59.9 plus 100 at 12:01:00.1) and choose an algorithm without a reset instant: token bucket, sliding window log for exactness, or the sliding window counter's weighted blend prev*(1-elapsedFraction)+curr.", "counter reset in a scheduled job or on a window-id change; limits enforced per aligned minute rather than per rolling interval; traffic graphs showing double-rate spikes at minute boundaries."),
      G("timer_thread_refill", "Refilling token buckets from a background timer that sweeps every bucket on a tick.", "Refill lazily: store (tokens, lastRefillNanos) and recompute tokens = min(capacity, tokens + elapsed * rate) on each call, so work is proportional to requests, idle keys cost nothing, and resolution is not capped by the tick.", "ScheduledExecutorService iterating a bucket map; limiter resolution equal to the tick period; CPU proportional to key count rather than request rate; sweep contending with request threads for bucket locks."),
      G("nonatomic_consume", "Refilling and then checking-and-decrementing tokens as separate unsynchronized steps, or guarding the whole limiter with one global lock.", "Make refill-and-consume one critical section per key — synchronize on the bucket object (natural lock striping) or CAS a packed (tokens, timestamp) long — so hot keys stay correct and unrelated keys never contend.", "if (bucket.tokens >= 1) bucket.tokens--; with no lock; a single synchronized method on the limiter facade; hot keys measurably exceeding their limit under load while cold keys are fine."),
    ],
    0.5, DIAG.ratelimiter, "Rate limiter class diagram"),

  // ─────────────────── TIC-TAC-TOE ──────────────────────────────────────────
  TT("lld_m5", "lld_m5_t5", 5, "Design Tic-Tac-Toe", "design-tic-tac-toe",
    ["case-study", "algorithms", "state-machine", "strategy"],
    "Three by three, nine cells, everyone has written it. Now the interviewer says: make the board N by N with K in a row, add an AI that searches millions of positions, and tell me how much work checking for a win costs after each move. If your answer involves scanning rows, columns and both diagonals, you have just made the AI a thousand times slower than it needs to be. Design Tic-Tac-Toe.",
    "The mechanism worth the interview is the INCREMENTAL win check. A full board scan is O(N squared) per move and it is pure waste, because the board was win-free before this move — so any new line must pass through the cell just played. Keep signed COUNTERS for every row, every column and the two diagonals; a move adds +1 (for X) or -1 (for O) to at most four of them, and a win is |counter| == N. That is O(1) per move with O(N) memory, it makes the move/unmove pair that minimax needs perfectly symmetric, and generalising it to K-in-a-row on a big board is the follow-up that separates memorized answers from understood ones.",
    [
      C("requirements", "Requirements",
        "Functional: two players alternate placing their symbol on an N by N grid, X conventionally first. A move is legal only if the game is still in play, it is that player's turn, the coordinates are inside the board, and the target cell is empty. The game ends in a WIN when a player occupies a full row, column or main diagonal (generalised: K consecutive cells in any of four directions), or in a DRAW when the board fills with no winner. The system must report the game state after every move, prevent any move once the game is over, and support the operator-ish features that turn a toy into a design question: undo a move, replay a recorded game, and swap either player for an AI. Non-functional requirements are where the substance is. PERFORMANCE OF THE WIN CHECK — trivial for one human game, decisive the moment an AI evaluates millions of positions, because the check runs at every node of the search tree and multiplies the entire cost. EXTENSIBILITY IN N AND K — the interviewer will ask for 3x3 and then for 15x15 Gomoku with 5-in-a-row, so hardcoding eight winning triples is a dead end, and knowing that in advance changes the data structures you choose in the first minute. SYMMETRY OF MOVE AND UNMOVE — any search algorithm needs to apply and retract moves cheaply and exactly, so every piece of derived state must be reversible, which is a genuine constraint on the design and the source of the most common bug. And a clean separation between game RULES and player DECISIONS so a human, a random bot and a minimax engine are interchangeable. Clarify scope: single process, two players, no network or persistence beyond an in-memory move list."),
      C("entities", "Core entities & responsibilities",
        "BOARD owns the grid — an N by N array of cell values, with an enum or a small int encoding (0 empty, +1 for X, -1 for O; the numeric encoding is not a micro-optimization, it is what makes the counter arithmetic below trivially correct) — plus the derived counters and a movesPlayed count. It exposes place(row, col, player), undo(move), isFull(), and a legality check, and it is the only object that mutates grid state. WINTRACKER is the load-bearing piece and can live inside Board or beside it: int arrays rowSum[N] and colSum[N] plus two scalars diagSum and antiDiagSum, all updated on place and reversed on undo. PLAYER is identity plus a symbol plus a MOVESTRATEGY, and separating the two is what lets a human and an AI be the same type to the game loop. MOVESTRATEGY is the interface — chooseMove(BoardView) returns a Move — with HumanInput, RandomBot and MinimaxBot implementations; note that it receives a READ-ONLY view of the board, because an AI that can mutate the real board while thinking is a bug factory. MOVE is an immutable value object (row, col, symbol) and it is also the UNDO RECORD, which is the trick that makes retraction exact: since a move always fills a previously empty cell, undoing it is 'clear that cell and subtract the same deltas', with no extra information needed. GAME is the state machine and the turn loop: it holds the current player, the GAMESTATE (IN_PLAY, WON, DRAW), the winner if any, and the move history; every state transition happens in one place, after a successful place(). GAMESTATE is an enum, and keeping it as one field rather than a pair of booleans (isOver, isDraw) removes the contradictory-state class of bug entirely."),
      C("design", "Class design & patterns",
        "The design has three commitments. FIRST, DERIVED STATE MAINTAINED INCREMENTALLY. The counters are a materialized view of the grid, kept in step at every mutation rather than recomputed at every query. That is the same discipline as an index on a table or a running sum in a stream: you pay a tiny constant on write to make the read free. It carries an obligation you must state — the counters and the grid must be updated together, always, in both directions — and the way to honour it is to allow exactly ONE method to place and exactly one to undo, both in Board, so there is no third code path that can update the grid and forget a counter. SECOND, STRATEGY for the player's decision. The game loop should be a dozen lines that asks the current player for a move, validates it, applies it, updates state and rotates the turn; it must not contain a branch on whether the player is human. That separation is what makes the AI a plug-in rather than a rewrite, and it is what interviewers mean when they ask 'how would you add a computer opponent'. THIRD, the GAME AS AN EXPLICIT STATE MACHINE with a single transition point. After a successful placement, exactly one method asks: did that move win (check the four counters touched)? If not, is the board full (movesPlayed == N*N)? If not, rotate the turn. Every rejection path — out of turn, out of bounds, occupied cell, game already over — returns a typed result rather than throwing, because these are expected inputs, not exceptional conditions. Patterns deliberately NOT used and worth saying so: no Observer needed for a two-player local game beyond a UI hook; no Singleton for the board (multiple games in one process is a normal requirement and a Singleton forbids it, which is also why AI search must never mutate the live board); and no class hierarchy over cell types, since a cell is a value. The design's elegance test is the AI: if MinimaxBot can do board.place(m); score = search(); board.undo(m); with perfect fidelity, the state model is right."),
      K("code", "Core classes (Java)",
        `class Board {
  private final int n;
  private final int[][] cells;          // 0 empty, +1 X, -1 O
  private final int[] rowSum, colSum;   // signed counters: the O(1) win check
  private int diagSum, antiSum, movesPlayed;

  Board(int n) {
    this.n = n; cells = new int[n][n];
    rowSum = new int[n]; colSum = new int[n];
  }

  boolean isLegal(int r, int c) {
    return r >= 0 && r < n && c >= 0 && c < n && cells[r][c] == 0;
  }

  /** Apply a move and report whether it WON — O(1), no board scan. */
  boolean place(int r, int c, int v) {   // v is +1 or -1
    cells[r][c] = v;
    movesPlayed++;
    rowSum[r] += v;
    colSum[c] += v;
    if (r == c)         diagSum += v;
    if (r + c == n - 1) antiSum += v;
    int target = n * v;                  // +n means X filled it, -n means O did
    return rowSum[r] == target || colSum[c] == target
        || (r == c && diagSum == target)
        || (r + c == n - 1 && antiSum == target);
  }

  /** Exact inverse of place(): every delta reversed, or search state corrupts. */
  void undo(int r, int c) {
    int v = cells[r][c];
    cells[r][c] = 0;
    movesPlayed--;
    rowSum[r] -= v;
    colSum[c] -= v;
    if (r == c)         diagSum -= v;
    if (r + c == n - 1) antiSum -= v;
  }

  boolean isFull() { return movesPlayed == n * n; }
}

enum GameState { IN_PLAY, WON, DRAW }

interface MoveStrategy { Move chooseMove(BoardView view, int symbol); }

class Game {
  private final Board board; private final Player[] players;
  private int turn = 0;
  private GameState state = GameState.IN_PLAY;
  private Player winner;
  private final Deque<Move> history = new ArrayDeque<>();

  MoveResult play(Move m) {
    if (state != GameState.IN_PLAY)             return MoveResult.gameOver();
    if (m.symbol() != players[turn].symbol())   return MoveResult.notYourTurn();
    if (!board.isLegal(m.row(), m.col()))       return MoveResult.illegalCell();

    boolean won = board.place(m.row(), m.col(), m.symbol());
    history.push(m);
    if (won)                { state = GameState.WON; winner = players[turn]; }
    else if (board.isFull()) state = GameState.DRAW;
    else                     turn ^= 1;          // single transition point
    return MoveResult.accepted(state);
  }

  void undo() {
    Move m = history.pop();
    board.undo(m.row(), m.col());
    state = GameState.IN_PLAY; winner = null;
    turn = history.size() % 2;                   // turn derived, never guessed
  }
}`),
      C("deep_dive", "Deep dive: the O(1) incremental win check and why the board scan is the wrong instinct",
        "Almost every first implementation checks for a win by scanning: loop the row, loop the column, loop both diagonals, or worse, loop all rows and all columns. For 3x3 nobody notices. The reason it is wrong is not the constant factor, it is the reasoning it skips. THE BOARD WAS WIN-FREE BEFORE THIS MOVE — otherwise the game would already be over — so any winning line that now exists must pass through the cell just played. That single observation collapses the search space from the whole board to the four lines through one cell, and it is the same locality argument that makes incremental maintenance work everywhere. Take it one step further and you do not need to walk those four lines either. Encode X as +1 and O as -1 and keep a SIGNED COUNTER per row, per column, and one for each diagonal. Placing a symbol adds its value to rowSum[r], colSum[c], and — only when the cell lies on them — diagSum and antiSum. A row is a win for X exactly when rowSum[r] == +N and for O when it equals -N; the sign encodes the winner and the magnitude encodes completeness, in one comparison. Crucially, mixed rows self-cancel: a row with two Xs and one O sums to +1, nowhere near +3, and no separate 'is it all the same symbol' check is needed. So a move touches at most four counters and compares at most four values: O(1) time, O(N) memory, independent of board size. Contrast the costs honestly. Full board scan is O(N squared) per move; scanning only the four lines through the cell is O(N); counters are O(1). For a human game the difference is invisible; for a minimax search over a 4x4 or Gomoku board it is the difference between an engine that searches deep and one that spends its entire budget re-reading cells it already knew. The subtlety that decides whether this actually works is UNDO SYMMETRY. Minimax applies a move, recurses, and retracts. place() writes five locations (the cell, a row counter, a column counter, and conditionally the two diagonals); undo() must reverse exactly those five. Forget to decrement diagSum on retraction and the search accumulates PHANTOM state — a diagonal that looks nearly complete because of moves that were taken back — and the engine starts making inexplicable blunders that only appear at depth, because shallow searches never backtrack far enough to expose it. Write place and undo as a mirrored pair, adjacent in the file, and state the invariant: the counters always equal the column-wise, row-wise and diagonal sums of the grid. That invariant is also a free test — after any sequence of moves and undos, recompute the sums from scratch and assert equality."),
      C("deep_dive", "Deep dive: generalising to N by N with K in a row, and the pluggable player",
        "The counter trick as described relies on a line being exactly a full row, column or diagonal. Ask for GOMOKU — 15x15 with 5 in a row — and the whole-line counters stop applying, because a win is now K CONSECUTIVE cells anywhere along a line. Do not throw the locality argument away with them; it still holds, and the generalised primitive is: from the placed cell, walk outward in BOTH directions along each of the four AXES (horizontal, vertical, and the two diagonals), counting matching symbols until you hit a non-match or an edge, then test run(before) + 1 + run(after) >= K. Four axes, at most K-1 steps in each direction, so the check is O(K) per move — still independent of board size, still no scan. The both-directions detail is the part candidates get wrong and interviewers specifically probe: a stone dropped in the MIDDLE of a gap, as in XX_XX, completes a line at an interior position, so counting only forward, or only lines that START at the placed cell, misses it. The general rule for the family: keep whatever derived state makes the win predicate O(1) or O(K), always evaluate it from the LAST move only, and make its update reversible. For the 3x3-to-NxN case with full-line wins, signed counters; for K-in-a-row, directional runs; for a bitboard implementation (each player's occupancy as a bitmask), shift-and-AND tricks detect K in a row in a handful of operations, which is what serious engines use — mentioning bitboards is a good closing note, not a required answer. The second half of generalisation is the PLAYER. Once the game loop asks a MoveStrategy for a move, the AI is a plug-in: RandomBot picks uniformly from empty cells; MinimaxBot scores the position by recursion with the move/undo pair from the previous deep dive, using alpha-beta pruning and, for 3x3, solving the game outright — perfect play draws, which is a nice concrete claim to make. The strategy receives a BoardView, a read-only projection, because handing the live mutable board to a searching AI invites it to leave the real game in a half-explored state — one of those bugs that is trivial to prevent by design and miserable to find. Two more extension points fall out of the same seams: making Game accept a list of players rather than two generalises to three-player variants, and recording the move history as the primary artefact gives undo, replay, and game persistence from one structure rather than three."),
      C("tradeoffs", "Trade-offs & extension points",
        "COUNTERS vs DIRECTIONAL RUNS vs BITBOARDS: signed counters are O(1), minimal code, and exactly right when a win means a complete row, column or diagonal; directional runs are O(K), handle K-in-a-row on any board size, and are the general answer; bitboards make the check a few shifts and ANDs and are what performance engines use, at the cost of readability and a board-size limit per word. Pick counters for the classic problem, say runs generalise it, mention bitboards as the performance tier — that progression is the answer, not any single choice. INCREMENTAL STATE vs RECOMPUTE: incremental is free on read and imposes the update-both-directions obligation; recompute-on-demand is impossible to get out of sync and costs O(N squared) per query. For a UI-driven single game, recompute is genuinely defensible and simpler — say so, because reflexively optimizing a nine-cell board is its own kind of red flag; the moment an AI enters, incremental wins decisively. ENUM CELLS vs INT ENCODING: an enum (EMPTY, X, O) is more readable and type-safe; the +1/0/-1 encoding is what makes the counter arithmetic and its sign test work without branching. A clean compromise is an enum carrying a value field, which keeps both. STATE ENUM vs BOOLEAN FLAGS: one GameState field cannot express 'over and not over', which two booleans can and eventually will. EXCEPTIONS vs RESULT OBJECTS for illegal moves: illegal input from a UI is expected, so a typed MoveResult beats throwing, and it also gives the UI a reason to display. EXTENSIONS: undo/redo comes free from the move history plus the exact inverse of place; replay is the same list played forward; persistence is the move list, not the grid, which is smaller and self-validating; a network game turns Move into a message and forces server-side validation (never trust a client-supplied move); three-player and 3D variants generalise the axis enumeration; and a difficulty setting is just a different MoveStrategy or a depth limit on the same one. What does NOT scale is nothing much — this is a small domain — which is precisely why interviewers use it to test whether you can find the one algorithmic idea in a problem everyone thinks is trivial."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'How much of the board does your win check read?' — the four lines through the last move at most, and with counters, four integers; the board was win-free before, so any new line passes through the cell just played. 'Why signed counters rather than counting each symbol separately?' — one array instead of two, mixed lines cancel automatically so no all-same-symbol test is needed, and the sign identifies the winner while the magnitude proves completeness. 'Now make it 15x15 with 5 in a row.' — whole-line counters no longer apply; walk outward in both directions along the four axes from the placed cell and test run+1+run >= K, which is O(K) and still independent of board size. 'Why both directions?' — a stone can complete a line from the middle (XX_XX), so counting forward only, or only lines starting at the placed cell, misses interior completions. 'Add an AI.' — MinimaxBot behind the MoveStrategy interface, with alpha-beta; 3x3 is solved so perfect play always draws, and the search depends entirely on place/undo being exact inverses. 'Your AI plays strangely at depth 6 but fine at depth 2 — why?' — asymmetric undo: a counter or the movesPlayed count not reversed, leaving phantom state that only deep backtracking exposes; the fix is a mirrored place/undo pair plus an invariant check in tests. 'How do you detect a draw?' — movesPlayed == N*N with no win, maintained incrementally; scanning for an empty cell is the same wasted work as scanning for a win. 'Undo a move — what has to change?' — the cell, every counter it touched, movesPlayed, the game state back to IN_PLAY, and the turn, which should be DERIVED from history size rather than toggled, so undo cannot desynchronize it. 'Play it over a network?' — the server owns the Board and validates every move; the client is a view, because a client-authoritative move is a cheat vector, and this is where a game LLD starts touching real systems design."),
    ],
    "Tic-Tac-Toe is asked precisely because it looks beneath a senior interview, which makes it a clean test of whether you find the algorithmic idea in a small problem. The graded points are specific: an INCREMENTAL O(1) win check via signed row/column/diagonal counters instead of a board scan, justified by the observation that the board was win-free before the move; an exact place/undo inverse pair, because the moment an AI searches, asymmetric state retraction produces phantom near-wins that only appear at depth; a clean generalisation to N by N with K in a row via both-direction runs along four axes; and a MoveStrategy seam so human, random and minimax players are interchangeable. Interviewers also watch the small modelling calls — one GameState enum instead of two booleans, typed results instead of exceptions for illegal moves, a read-only board view for the AI, and turn derived from history so undo cannot desynchronize it.",
    [
      G("full_board_scan", "Checking for a win by scanning rows, columns and diagonals (or the whole board) after every move.", "Use the locality argument — the board was win-free before this move, so only lines through the placed cell can have completed — and maintain signed row/column/diagonal counters so the check is four integer comparisons.", "checkWinner() looping over all rows and columns; win detection cost growing with board size; an AI whose search depth is limited by win-check time rather than by branching factor."),
      G("asymmetric_undo", "Implementing undo by clearing the cell without reversing every piece of derived state the placement updated.", "Write place() and undo() as a mirrored pair updating exactly the same locations (cell, row counter, column counter, both diagonals when touched, movesPlayed), and assert the invariant that counters equal recomputed sums in tests.", "undo() shorter than place(); minimax that plays well at shallow depth and blunders deep; counters that drift from the grid after a sequence of move/unmove operations."),
      G("hardcoded_win_lines", "Enumerating the eight winning triples of a 3x3 board, so the design cannot generalise to N by N or K in a row.", "Derive wins from board geometry: counters for full-line wins on any N, or outward runs in both directions along four axes tested against K, so board size and win length are parameters rather than constants.", "an array of eight index triples; magic numbers 3 or 9 throughout the code; the design collapsing when asked for Gomoku or Connect-style variants."),
    ],
    0.4, DIAG.tictactoe, "Tic-Tac-Toe class diagram"),

  // ─────────────────── SNAKE & LADDER ───────────────────────────────────────
  TT("lld_m5", "lld_m5_t6", 6, "Design Snake & Ladder", "design-snake-and-ladder",
    ["case-study", "state-machine", "strategy", "testing"],
    "A player on 94 rolls a 4 and lands on 98, where a ladder lifts them to 99 — and 99 is the head of a snake down to 3. Does the ladder fire? Does the snake fire after it? What if the roll would take them past 100? And how do you write a test for any of this when the game's core input is a random number? Design Snake & Ladder.",
    "Strip away the picture and the board is ONE data structure: a Map from start square to end square. A snake is an entry where end is less than start, a ladder one where end is greater — no separate classes, no separate lookup paths, and landing resolution becomes a single bounded loop that handles chained jumps for free. Everything else that feels like game logic is POLICY — roll again on a six, exact roll required to finish, three consecutive sixes forfeit the turn — and belongs behind interfaces. Putting the die behind an interface in particular is what turns an untestable random walk into a deterministic, assertable state machine.",
    [
      C("requirements", "Requirements",
        "Functional: two or more players start off the board (position 0) on a board of numbered squares, conventionally 1 to 100. Players take turns in a fixed rotation; on a turn the player rolls one die, advances by the rolled value, and if the landing square is the start of a SNAKE or a LADDER the token is moved to the corresponding end square. The first player to reach the final square wins, and the game ends immediately at that moment. The variants that are actually the interview are the ones that must be configurable rather than assumed: does rolling a six grant an EXTRA turn (and is there a cap, such as three sixes forfeiting the turn)? Must the final square be reached by an EXACT roll, with an overshoot forfeiting the move or bouncing back? Can jumps CHAIN — a ladder that delivers you onto a snake's head? How many dice, and is the board size fixed? The system must also support the operational surface: constructing a board from configuration, validating it, reporting the winner, and producing a move log for replay. Non-functional requirements that drive real design decisions: DETERMINISTIC TESTABILITY — the game's engine is driven by randomness, so unless the randomness is injectable the whole thing is untestable and every rule above is unverifiable, which is the single most important constraint in this problem; CONFIGURABILITY of the rule set, since the entire difference between house variants is policy; and BOARD VALIDITY, because a badly configured board (a snake whose head is the final square, a ladder pointing at itself, a cycle of jumps) can hang the game or make it unwinnable, and catching that at construction is far better than at play time. Clarify scope: local game, in-memory, no persistence, no network."),
      C("entities", "Core entities & responsibilities",
        "BOARD is the interesting entity precisely because it is so small: a size, and a Map<Integer, Integer> of jumps from start square to end square. Snakes and ladders are the SAME structure distinguished only by whether end is less than or greater than start — the moment you realise that, the entire class hierarchy candidates reach for (an abstract Jump with Snake and Ladder subclasses, or worse two separate maps) collapses into one lookup, and the resolution code stops branching on which kind it found. Board exposes destinationFrom(square), which resolves jumps, and it validates its own configuration at construction. JUMP, if you keep it as a value object at all, is (start, end) and exists mainly to make configuration readable; the runtime structure is the map. PLAYER holds an id, a name and a current position, and nothing else — no rule knowledge. DICE is an INTERFACE with roll() returning a value in range, implemented by RandomDice (seeded, so even the random path is reproducible), FixedSequenceDice for tests, and MultiDice for variants that sum several dice; this is the smallest interface in the design and the highest-leverage one. TURNPOLICY encapsulates the house rules that govern a turn rather than the board: shouldRollAgain(rollValue, consecutiveSixes), and resolveMove(currentPosition, rollValue, boardSize) which decides overshoot behaviour (forfeit, bounce, or allow). GAME is the orchestrator and state machine: it holds the player rotation (a Deque, so 'next player' is a rotate rather than an index dance), the GameState (NOT_STARTED, IN_PROGRESS, FINISHED), the winner, and the move log. MOVERESULT is the immutable record of one turn — player, roll, from, intermediate landing, after-jump position, whether they won — which doubles as the replay entry and as what a UI animates."),
      C("design", "Class design & patterns",
        "The design commitments here are unusually crisp. FIRST, one map, not a hierarchy. Modelling snakes and ladders as separate types forces every code path to ask which one it is holding, and the answer never changes the behaviour — you move the token to the end square either way. Collapsing them means resolution is one lookup, validation is one loop, and adding a third kind of jump (a teleport, a wormhole in a variant) is a configuration entry rather than a class. This is a good place to say out loud that inheritance was considered and rejected on the grounds that the subtypes have identical behaviour, because interviewers hear a lot of reflexive class hierarchies and almost never hear one declined with a reason. SECOND, POLICY BEHIND INTERFACES. Dice and TurnPolicy are strategies because they are exactly the axes house rules vary along, and because pulling them out is what leaves the Game class as a readable state machine instead of a rules soup. The specific payoff for Dice is testability: with a FixedSequenceDice the entire game becomes a deterministic function of a scripted roll list, so 'a player on 94 rolls 4 and lands on a chained jump' is a three-line unit test rather than a manual experiment. THIRD, GAME AS A STATE MACHINE with one transition point, mirroring good practice from every other case study: a turn either advances the current player, or ends the game, or forfeits — and exactly one method decides which and updates state. Around it, the player rotation as a Deque means the extra-turn rule is 'do not rotate' rather than a special index case, which is a small structural choice that removes a whole class of off-by-one bugs. Patterns not used, deliberately: no Observer for a local game beyond a UI/log hook; no Singleton for Game or Board (multiple concurrent games is normal); no Command layer unless undo is required, in which case the MoveResult log already supplies it. The design test: can you swap in a die that always rolls 6 and assert exactly what happens? If yes, the seams are in the right places."),
      K("code", "Core classes (Java)",
        `interface Dice { int roll(); }                       // seam that makes the game testable

class RandomDice implements Dice {
  private final Random rnd; private final int faces;
  RandomDice(int faces, long seed) { this.faces = faces; this.rnd = new Random(seed); }
  public int roll() { return rnd.nextInt(faces) + 1; }
}

class FixedSequenceDice implements Dice {                 // tests script the whole game
  private final int[] rolls; private int i;
  FixedSequenceDice(int... rolls) { this.rolls = rolls; }
  public int roll() { return rolls[i++]; }
}

class Board {
  private final int size;
  private final Map<Integer, Integer> jumps;   // ONE map: end < start = snake, > = ladder

  Board(int size, Map<Integer, Integer> jumps) {
    this.size = size; this.jumps = Map.copyOf(jumps);
    validate();                                 // fail at construction, never at play time
  }

  private void validate() {
    for (var e : jumps.entrySet()) {
      int from = e.getKey(), to = e.getValue();
      if (from < 1 || from >= size)  throw new IllegalArgumentException("bad jump start " + from);
      if (to < 1 || to > size)       throw new IllegalArgumentException("bad jump end " + to);
      if (from == to)                throw new IllegalArgumentException("self jump at " + from);
      if (from == size)              throw new IllegalArgumentException("jump on final square");
    }
    for (int start : jumps.keySet()) {          // no cycles: bounded walk must terminate
      int cur = start;
      for (int hops = 0; jumps.containsKey(cur); hops++) {
        if (hops > jumps.size()) throw new IllegalArgumentException("jump cycle from " + start);
        cur = jumps.get(cur);
      }
    }
  }

  /** Resolve landing, following CHAINED jumps; validate() proved this terminates. */
  int destinationFrom(int square) {
    int cur = square, hops = 0;
    while (jumps.containsKey(cur) && hops++ <= jumps.size()) cur = jumps.get(cur);
    return cur;
  }

  int size() { return size; }
}

interface TurnPolicy {
  boolean rollAgain(int roll, int consecutiveSixes);
  /** Overshoot rule lives here, not in Game. */
  int landingSquare(int from, int roll, int boardSize);
}

class ClassicPolicy implements TurnPolicy {
  public boolean rollAgain(int roll, int sixes) { return roll == 6 && sixes < 3; }
  public int landingSquare(int from, int roll, int size) {
    int target = from + roll;
    return target > size ? from : target;       // exact-finish: overshoot forfeits
  }
}

class Game {
  private final Board board; private final Dice dice; private final TurnPolicy policy;
  private final Deque<Player> rotation = new ArrayDeque<>();
  private GameState state = GameState.IN_PROGRESS;
  private Player winner;
  private final List<MoveResult> log = new ArrayList<>();

  Game(Board b, Dice d, TurnPolicy p, List<Player> ps) {
    board = b; dice = d; policy = p; rotation.addAll(ps);
  }

  MoveResult takeTurn() {
    if (state != GameState.IN_PROGRESS) throw new IllegalStateException("game over");
    Player p = rotation.peekFirst();
    int sixes = 0, roll;
    MoveResult last;
    do {
      roll = dice.roll();
      if (roll == 6) sixes++;
      int landed = policy.landingSquare(p.position(), roll, board.size());
      int finalSq = board.destinationFrom(landed);      // chained jumps resolved here
      p.moveTo(finalSq);
      boolean won = finalSq == board.size();
      last = new MoveResult(p.id(), roll, landed, finalSq, won);
      log.add(last);
      if (won) { state = GameState.FINISHED; winner = p; return last; }
    } while (policy.rollAgain(roll, sixes));
    rotation.addLast(rotation.pollFirst());              // extra turn = simply not rotating
    return last;
  }
}`),
      C("deep_dive", "Deep dive: the board as a jump map — chained jumps, termination, and validation",
        "The instinct is to model snakes and ladders as two collections, or as an abstract Jump class with two subclasses, and it is worth dismantling because the reasoning transfers. What behaviour actually differs between a snake and a ladder? None: on landing on the start square, the token moves to the end square. The only difference is the SIGN of the displacement, which is data. So the board is one Map<Integer, Integer>, keyed by start square, and 'is this a snake' becomes a display concern (draw it red, animate it downwards) rather than a control-flow concern. That collapse pays off immediately in resolution. CHAINED JUMPS are the classic follow-up: you land on a ladder to 99, and 99 is a snake head down to 3 — does the snake fire? With one map, resolution is a loop, not a branch: follow the map from the landing square until it yields nothing, and whether you followed a ladder into a snake, a snake into another snake, or nothing at all, the same three lines handle it. With two collections, chaining requires alternating lookups against both, and that is exactly where implementations get it wrong and stop after the first hop. The rule choice — chain or resolve once — is then a genuine POLICY decision to raise with the interviewer, because house rules differ; the good answer is that the code supports both with a loop bound of either one or unbounded, and the decision is configuration. Now the part that separates a careful design from a plausible one: TERMINATION. An unbounded follow-the-map loop is an infinite loop the moment the configuration contains a cycle — a ladder from 20 to 45 and a snake from 45 back to 20 — and a hang in a game engine is the worst failure mode because it never produces a message. Two defences, and you should offer both. Validate at CONSTRUCTION: walk from every jump start, bounding the hops by the number of jumps, and reject any board where a walk exceeds it — that is a cycle by pigeonhole. And keep the same bound in the resolution loop as a runtime guard, so a mistake in validation degrades into a wrong answer rather than a hang. Extend validation to the other invariants that make a board unplayable or absurd: no jump start or end outside the board, no self-jump, no jump beginning on the final square (you have already won), and — depending on house rules — no ladder ending exactly on a snake head, which some rule sets forbid to prevent cruel chains. Every one of these is a two-line check at construction and each corresponds to a bug that would otherwise appear at play time as something inexplicable. That is the transferable lesson: when the data structure is trivial, the design work moves into invariants, and stating them is the design."),
      C("deep_dive", "Deep dive: the turn state machine, the die behind an interface, and testable randomness",
        "The second mechanism is the TURN, which looks like a for-loop and is really a state machine with policy hooks. A turn is: roll; compute the landing square subject to the overshoot rule; resolve jumps; move; check for a win; then either roll again or pass the turn. Two of those steps are house rules and must not be hardcoded inside Game. THE EXACT-FINISH RULE: if a player on 97 rolls a 5, some rule sets forfeit the move, some bounce the token back (landing on 98 — 100 forward, then 2 back), and some simply allow the overshoot to win. Encoding one of these with an if inside the game loop means the other two require editing the loop, so it belongs in TurnPolicy.landingSquare, which receives the position, the roll and the board size and returns where the token lands before jumps are applied. THE SIX RULE: rolling a six granting another turn, with three consecutive sixes typically forfeiting the whole turn (a rule that exists precisely to bound a turn, since without it an unlucky sequence can be arbitrarily long), belongs in TurnPolicy.rollAgain. Notice how the Deque rotation makes this trivial: an extra turn is simply not rotating, so the extra-turn path shares all its code with the normal path and the rotation logic has exactly one line. Now the constraint that governs everything: TESTABILITY OF A RANDOM SYSTEM. If Game calls new Random().nextInt(6) + 1 inline, none of the above rules can be tested. You cannot assert that landing on 98 chains to 99 and then down to 3, you cannot assert that three sixes forfeit, you cannot assert the overshoot rule, and you cannot reproduce a bug a user reports. Putting the die behind a one-method interface converts the game from a random process into a deterministic function of a roll sequence: with FixedSequenceDice(4, 6, 6, 6) the entire game trace is fixed and every rule becomes a unit test with an exact expected outcome. This is the same discipline as injecting a Clock into a rate limiter or a scheduler — any nondeterministic input is a dependency, and dependencies belong behind interfaces. Two refinements worth mentioning: seed the RandomDice explicitly so even production games are reproducible from a log, which makes bug reports actionable; and record a MoveResult per turn so the game has a REPLAY log, which turns 'the game did something weird' into a data file you can rerun. The parallel to name for the interviewer is the AI/board-view seam in Tic-Tac-Toe and the Clock in the rate limiter: the pattern is that the seam you add for testing is usually the same seam the product will later need for configurability."),
      C("tradeoffs", "Trade-offs & extension points",
        "ONE MAP vs TWO COLLECTIONS vs A CLASS HIERARCHY: one map gives a single resolution path, free chaining, and configuration-driven extension; two collections or a Snake/Ladder hierarchy duplicate lookups and make chained jumps a special case for no behavioural gain — the only argument for the hierarchy is display metadata, which a lightweight value object or a derived isSnake() covers. AN ARRAY INSTEAD OF A MAP: for a dense small board, int[] nextSquare sized boardSize+1 is faster and simpler than a HashMap and makes 'no jump' the identity; for a sparse or very large board the map wins on memory. Either is defensible; noticing the choice exists is the point. CHAINED vs SINGLE-HOP JUMPS: chaining is more surprising to players and can produce brutal sequences; single-hop is gentler and is what several published rule sets specify. Because it is a loop bound, the code supports both — make it configuration and say why. OVERSHOOT: forfeit is simplest and the common rule; bounce-back is more forgiving and needs one extra line; allowing overshoot to win shortens games. All three live in TurnPolicy, which is the payoff of extracting it. STATE MACHINE vs SIMPLE LOOP: a full state pattern with state classes is over-engineering for three game states — an enum plus one transition point is right-sized here, and being able to say where the state pattern stops paying (as opposed to the vending machine, where five states and five events justify it) is a useful contrast to draw. EXTENSIONS: multiple dice sums are a Dice implementation; a power-up square is another map from square to an effect, resolved in the same landing pipeline; multiplayer over a network makes the server authoritative for the die roll (a client-side die is a cheat vector, exactly as a client-side move is in Tic-Tac-Toe) and turns MoveResult into the wire message; an AI player is trivially uninteresting here because the game has no decisions, which is itself a good observation — Snake and Ladder is a pure Markov chain, so the interesting analytical extension is computing the expected number of turns to finish by solving the chain, a nice thing to mention if the interviewer is enjoying themselves. WHAT BREAKS: essentially nothing at scale; the risks are all correctness-at-construction, which is why validation carries the weight in this design."),
      C("deep_dive", "Common follow-ups & how it evolves",
        "Expect: 'Why not separate Snake and Ladder classes?' — their behaviour is identical (move the token to the end square) and only the sign of the displacement differs, so one map keyed by start square gives a single resolution path and makes chained jumps fall out of a loop; the snake-versus-ladder distinction survives as a display concern. 'A ladder drops you on a snake head — what happens?' — a policy decision; with the map the code supports either by bounding the follow loop at one hop or leaving it unbounded, and the important part is that you noticed the question exists. 'Could that loop hang?' — yes, on a cyclic configuration, which is why the board validates at construction by walking from every jump start with a hop bound, and why the resolution loop keeps the same bound as a runtime guard. 'A player on 97 rolls a 5?' — TurnPolicy.landingSquare decides: forfeit the move, bounce back to 98, or allow the win; all three are one-line policies and none of them touches Game. 'Rolling a six?' — an extra turn, which the Deque rotation expresses as simply not rotating; cap consecutive sixes so a turn is bounded. 'How do you test any of this?' — the die is an interface, so FixedSequenceDice scripts the exact roll sequence and every rule becomes an assertable unit test; seed the production die too, so a logged game can be replayed exactly. 'How do you know who wins ties?' — there are none: the game ends immediately on the winning move, inside the turn, before rotation, which is why the win check sits inside the roll-again loop rather than after it. 'Add a network multiplayer mode?' — the server owns the Board, the Dice and the Game; clients send only intent and receive MoveResults, because a client-side roll is a cheat vector. 'How long does a game last?' — it is a Markov chain over the squares, so the expected number of turns is computable by solving for the absorbing state, and that observation is the natural bridge from this LLD to a quantitative discussion if the interviewer wants one."),
    ],
    "Snake and Ladder is used as a warm-up that quietly grades modelling instinct. The tell interviewers look for first is whether you collapse snakes and ladders into ONE jump map rather than reaching for a class hierarchy whose subtypes behave identically — and whether that collapse then lets you answer the chained-jump follow-up with a bounded loop instead of a special case. The second is validation: an unbounded jump-following loop hangs on a cyclic board, so a candidate who validates the configuration at construction (no cycles, no self-jumps, no jump on the final square, endpoints in range) is visibly thinking about invariants rather than happy paths. The third, and the one that most often distinguishes the answer, is putting the die behind an interface so the entire rule set — extra turn on six, three-sixes forfeit, exact-finish versus bounce-back overshoot — becomes deterministically testable; that same seam is what makes the rules configurable, which is the general lesson worth stating: the seam you add for tests is usually the seam the product will need.",
    [
      G("snake_ladder_hierarchy", "Modelling snakes and ladders as separate classes or separate collections when their behaviour is identical.", "Use one Map<start, end>: a snake is end < start, a ladder end > start; resolution becomes a single lookup loop, chained jumps need no special case, and a new jump type is configuration rather than a class.", "abstract Jump with Snake/Ladder subclasses whose methods are identical; two maps consulted in sequence; chained jumps handled by an if that checks the other collection once."),
      G("unvalidated_jump_cycles", "Following jumps in an unbounded loop over a board configuration that was never validated, so a cycle hangs the game.", "Validate at construction: endpoints inside the board, no self-jumps, no jump starting on the final square, and no cycles (walk from every start with a hop bound); keep the same bound in the resolution loop as a runtime guard.", "while (jumps.containsKey(cur)) with no bound; boards accepted straight from configuration; a game that hangs with no error rather than rejecting bad data."),
      G("inline_randomness", "Calling Random directly inside the game loop, and hardcoding house rules (extra turn on six, overshoot handling) as ifs in that loop.", "Put the die behind a Dice interface (FixedSequenceDice for tests, seeded RandomDice for reproducible play) and the house rules behind a TurnPolicy, so every rule is an assertable unit test and a variant is a different implementation.", "new Random().nextInt(6) inside takeTurn; no test can assert a specific board trace; if (roll == 6) and overshoot handling written inline in the game loop."),
    ],
    0.4, DIAG.snakeladder, "Snake and Ladder class diagram"),

];

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
  // Elevator
  pm("lld_m5", { topicId: "lld_m5_t1", exerciseId: "lld_m5_t1_pm_d1", position: 11, level: "hard",
    title: "The car that passes your floor", scenario: "A car at floor 2 moving UP holds stops for 15 and 16. A request for floor 9 (going up) arrives. With a FIFO request queue the car serves 15 first. What is the correct data structure and rule?",
    options: ["Two SORTED stop sets per car plus a direction: while moving up serve the smallest stop at or above the current floor, so floor 9 is absorbed into the sweep for free", "A priority queue ordered by request arrival time", "A single sorted list of all requests, always served from the lowest floor upward", "A max-heap of destinations so the farthest floor is served first"],
    correct: "Two SORTED stop sets per car plus a direction: while moving up serve the smallest stop at or above the current floor, so floor 9 is absorbed into the sweep for free",
    explanation: "This is LOOK (disk-arm scheduling). A FIFO queue makes the car ride past waiting passengers and reverse repeatedly; sorted stop sets let a new same-direction request slot into the current itinerary at zero marginal cost, with next-stop as one ceiling() call." }),
  pm("lld_m5", { topicId: "lld_m5_t1", exerciseId: "lld_m5_t1_pm_d2", position: 12, level: "hard",
    title: "Nearest is not cheapest", scenario: "Hall call: floor 9 going DOWN. Car A is at 10 moving UP with a stop at 18; Car B is at 14 moving DOWN with a stop at 3. Nearest-car picks A. Why is that wrong, and what replaces it?",
    options: ["Score each car's MARGINAL cost: B passes floor 9 downward anyway (a free pickup) while A must climb to 18 and reverse — dispatch on cost, not absolute distance", "Always dispatch the car with the fewest committed stops", "Assign hall calls round-robin so load stays even across the bank", "Pick the car with the lowest id to keep assignment deterministic"],
    correct: "Score each car's MARGINAL cost: B passes floor 9 downward anyway (a free pickup) while A must climb to 18 and reverse — dispatch on cost, not absolute distance",
    explanation: "Absolute floor distance ignores direction and committed stops. The cost function's three cases — ahead and same direction (free), ahead but opposite (gap plus remaining sweep), behind (full reversal) — capture what the ride actually costs, which is the whole reason dispatch is separate from scheduling." }),
  pm("lld_m5", { topicId: "lld_m5_t1", exerciseId: "lld_m5_t1_pm_d3", position: 13, level: "medium",
    title: "Why LOOK and not nearest-stop", scenario: "A car serves whichever pending stop is closest to its current floor (SSTF). Under a steady stream of mid-building calls, what fails?",
    options: ["The top and bottom floors STARVE — the car never travels far enough to reach them; LOOK bounds every request at one traversal because the sweep must pass every floor", "Throughput collapses because the car reverses on every move", "Doors open at floors nobody requested", "The car's direction state becomes undefined"],
    correct: "The top and bottom floors STARVE — the car never travels far enough to reach them; LOOK bounds every request at one traversal because the sweep must pass every floor",
    explanation: "Greedy nearest-stop minimizes the next hop and loses the global guarantee. A directional sweep is starvation-free by construction; if you bolt a greedy optimization onto it, you must add an age threshold that promotes very old calls to restore the bound." }),
  // Vending machine
  pm("lld_m5", { topicId: "lld_m5_t2", exerciseId: "lld_m5_t2_pm_d1", position: 11, level: "medium",
    title: "The twenty-five cell table", scenario: "Five events, five states. The machine currently uses an enum field plus a switch in each event method, and coins inserted during dispensing are silently credited. What is the structural fix?",
    options: ["Make each state a class implementing the full event interface and returning the next state, so the compiler forces a decision for every event in every state", "Add a guard clause for the dispensing case in insertCoin", "Move all the switches into one handleEvent method", "Track a boolean isDispensing alongside the state enum"],
    correct: "Make each state a class implementing the full event interface and returning the next state, so the compiler forces a decision for every event in every state",
    explanation: "The bug is an unwritten cell of the event-by-state table. State objects do not reduce the number of cases — they make the cases enumerable and colocated, so adding a state means one new class rather than edits to five methods that someone will half-finish." }),
  pm("lld_m5", { topicId: "lld_m5_t2", exerciseId: "lld_m5_t2_pm_d2", position: 12, level: "hard",
    title: "Snack out, change short", scenario: "The machine dispenses the product, then discovers it cannot compose the 25 it owes. What is the correct primitive?",
    options: ["Compose the change and reserve the stock inside ONE guarded step, committing both only after both succeed — otherwise nothing moves and the display says EXACT CHANGE ONLY", "Round the change down to the nearest available coin", "Keep a reserve float of small coins so the case cannot arise", "Dispense first and credit the shortfall to the next customer"],
    correct: "Compose the change and reserve the stock inside ONE guarded step, committing both only after both succeed — otherwise nothing moves and the display says EXACT CHANGE ONLY",
    explanation: "A purchase couples two decrements — a unit from the slot and coins from the vault. Sequencing them with checks in between produces the snack-out-change-short failure (or its mirror on a motor jam). Reserve both, commit both; if the hardware fails after commit, compensate with a full refund." }),
  pm("lld_m5", { topicId: "lld_m5_t2", exerciseId: "lld_m5_t2_pm_d3", position: 13, level: "hard",
    title: "Greedy misses a feasible set", scenario: "The machine owes 30 and holds one 25 and three 10s. Greedy takes the 25 and then cannot make 5, yet 10+10+10 exists. What is the correct algorithm?",
    options: ["Bounded-supply coin change by dynamic programming over amount and available counts, with greedy kept only as a fast path", "Greedy from the smallest denomination upward", "Reject any amount that greedy cannot compose — the customer must insert exact change", "Sort denominations by count and take the most plentiful first"],
    correct: "Bounded-supply coin change by dynamic programming over amount and available counts, with greedy kept only as a fast path",
    explanation: "Greedy is optimal only for canonical coin systems with sufficient supply; under limited supply it can fail to find a feasible composition that exists. Amounts and denominations here are tiny, so a bounded-knapsack DP costs microseconds and is complete — and it must run BEFORE anything is committed." }),
  // Splitwise
  pm("lld_m5", { topicId: "lld_m5_t3", exerciseId: "lld_m5_t3_pm_d1", position: 11, level: "hard",
    title: "Three friends, three debts", scenario: "A owes B 300, B owes C 300, C owes A 300. How many transfers settle the group, and what mechanism produces that answer?",
    options: ["Zero — netting each member to one signed balance collapses the cycle before any matching runs", "Three — every pairwise obligation must be paid directly", "Two — pick any member to act as the hub", "One — the largest debt is paid and the others are written off"],
    correct: "Zero — netting each member to one signed balance collapses the cycle before any matching runs",
    explanation: "Every member's paid-minus-owed is zero, so nothing is outstanding. Netting is the free first step of simplification: it kills all cycles, and the balance vector summing to exactly zero is the invariant to assert on every write." }),
  pm("lld_m5", { topicId: "lld_m5_t3", exerciseId: "lld_m5_t3_pm_d2", position: 12, level: "hard",
    title: "The n-1 bound", scenario: "Greedy simplification repeatedly matches the largest creditor with the largest debtor. Why is the transfer count bounded by n-1, and is greedy optimal?",
    options: ["Each match zeroes at least one party, so with k non-zero members the loop runs at most k-1 times; greedy is a heuristic — true minimization is NP-hard", "Because each member can appear in at most one transfer, giving n/2 pairs", "Because the balances sum to zero, which forces exactly n-1 transfers every time", "Greedy is provably optimal because it always transfers the maximum possible amount"],
    correct: "Each match zeroes at least one party, so with k non-zero members the loop runs at most k-1 times; greedy is a heuristic — true minimization is NP-hard",
    explanation: "The transfer amount is min(creditor, -debtor), so whichever magnitude was smaller vanishes from the problem. Minimizing transfers means maximizing the number of independently zero-summing subgroups — a subset-sum flavoured problem — so greedy's good bound is the right engineering answer, not the optimum." }),
  pm("lld_m5", { topicId: "lld_m5_t3", exerciseId: "lld_m5_t3_pm_d3", position: 13, level: "medium",
    title: "1000 split three ways", scenario: "An expense of 1000 cents is split equally among three people. How should the shares be computed?",
    options: ["Integer division for the base plus a deterministic remainder rule — 334/333/333 — so the shares sum to exactly the total", "333.33 each using double, rounding for display", "333 each, dropping the leftover cent", "334 each, over-collecting by two cents into the payer's balance"],
    correct: "Integer division for the base plus a deterministic remainder rule — 334/333/333 — so the shares sum to exactly the total",
    explanation: "Money is integer minor units, never floating point. base = total/n leaves a remainder below n, which a stated rule assigns (first k participants, or the payer). Determinism matters as much as exactness: recomputing an expense must reproduce identical balances, or the audit trail is worthless." }),
  // Rate limiter
  pm("lld_m5", { topicId: "lld_m5_t4", exerciseId: "lld_m5_t4_pm_d1", position: 11, level: "hard",
    title: "200 requests, no counter exceeded", scenario: "Limit 100/minute with a fixed-window counter. A client sends 100 at 12:00:59.9 and 100 at 12:01:00.1 — all accepted. What is the flaw and which algorithms fix it?",
    options: ["The window RESET lets 2x the limit through across a boundary; token bucket has no reset instant, and the sliding window counter blends prev*(1-elapsedFraction)+curr to close it", "The counter increment was not atomic, so both batches raced", "The limit should have been enforced per second instead of per minute", "The client's clock was ahead, so its requests landed in the wrong window"],
    correct: "The window RESET lets 2x the limit through across a boundary; token bucket has no reset instant, and the sliding window counter blends prev*(1-elapsedFraction)+curr to close it",
    explanation: "No counter ever exceeded 100 and the limit was still doubled over a rolling minute — the classic boundary burst, made worse in practice because aligned resets synchronize clients. The weighted blend counts the previous window as ~99.8% in force 100ms into the new one, rejecting the second batch." }),
  pm("lld_m5", { topicId: "lld_m5_t4", exerciseId: "lld_m5_t4_pm_d2", position: 12, level: "hard",
    title: "Ten million idle buckets", scenario: "A scheduled job tops up every token bucket once a second. With ten million mostly-idle keys, what is wrong and what replaces it?",
    options: ["Work becomes O(keys) per tick and the tick caps resolution — instead refill LAZILY from (tokens, lastRefillNanos) on each call, so idle keys cost nothing", "Use a bigger thread pool for the refill sweep", "Shard the bucket map so each shard gets its own timer", "Refill only the buckets that were used in the previous second"],
    correct: "Work becomes O(keys) per tick and the tick caps resolution — instead refill LAZILY from (tokens, lastRefillNanos) on each call, so idle keys cost nothing",
    explanation: "Lazy reconciliation makes work proportional to REQUESTS rather than keys: tokens = min(capacity, tokens + elapsed * rate), computed on access. A bucket idle for an hour is corrected in one multiplication because min() clamps, and the sweep no longer contends with request threads for bucket locks." }),
  pm("lld_m5", { topicId: "lld_m5_t4", exerciseId: "lld_m5_t4_pm_d3", position: 13, level: "medium",
    title: "The last token, twice", scenario: "Two threads hit the same hot key. Each calls refill(), reads 1 token, and decrements. What is the fix, and what must it NOT be?",
    options: ["Make refill-and-consume one critical section per key — synchronize on the bucket object (natural striping) or CAS a packed (tokens, timestamp) long — never a single global lock on the limiter", "Mark the tokens field volatile so both threads see the latest value", "Use an AtomicInteger for tokens and decrement it unconditionally", "Retry the request after a short backoff when the count goes negative"],
    correct: "Make refill-and-consume one critical section per key — synchronize on the bucket object (natural striping) or CAS a packed (tokens, timestamp) long — never a single global lock on the limiter",
    explanation: "This is check-then-act on shared state: volatile fixes visibility but not atomicity, and an unconditional atomic decrement still overshoots. Locking the bucket keeps the section a few instructions and lets unrelated keys proceed in parallel; a global lock would make the limiter the service's throughput ceiling." }),
  // Tic-Tac-Toe
  pm("lld_m5", { topicId: "lld_m5_t5", exerciseId: "lld_m5_t5_pm_d1", position: 11, level: "hard",
    title: "How much board must you read?", scenario: "After each move on an N by N board, how much work should the win check cost, and why?",
    options: ["O(1): the board was win-free before this move, so only lines through the placed cell matter — signed row/column/diagonal counters make it four comparisons", "O(N squared): any line on the board could have completed", "O(N): rescan the row and column of the placed cell every time", "O(log N) using a balanced tree of occupied cells"],
    correct: "O(1): the board was win-free before this move, so only lines through the placed cell matter — signed row/column/diagonal counters make it four comparisons",
    explanation: "The locality argument does the work: a new winning line must pass through the cell just played. Encoding X as +1 and O as -1 makes a win exactly counter == N*v, mixed lines cancel automatically, and a move touches at most four counters — O(N) memory, O(1) time, independent of board size." }),
  pm("lld_m5", { topicId: "lld_m5_t5", exerciseId: "lld_m5_t5_pm_d2", position: 12, level: "hard",
    title: "Strong at depth 2, blunders at depth 6", scenario: "A minimax bot plays well with a shallow search and makes inexplicable mistakes when the depth increases. What is the classic cause?",
    options: ["Asymmetric undo: place() updates the cell and four counters but undo() misses one, leaving phantom near-wins that only deep backtracking exposes", "Alpha-beta pruning is cutting off winning branches", "The evaluation function overflows at greater depth", "The board view handed to the AI is stale"],
    correct: "Asymmetric undo: place() updates the cell and four counters but undo() misses one, leaving phantom near-wins that only deep backtracking exposes",
    explanation: "Search applies and retracts millions of moves, so any derived state must be reversed exactly. Shallow searches never backtrack far enough to expose a missed decrement, so the bug ships silently — write place and undo as a mirrored pair and assert that counters equal recomputed sums." }),
  pm("lld_m5", { topicId: "lld_m5_t5", exerciseId: "lld_m5_t5_pm_d3", position: 13, level: "medium",
    title: "Now make it 5 in a row", scenario: "The board becomes 15x15 with 5-in-a-row wins. Whole-line counters no longer apply. What is the correct generalisation?",
    options: ["From the placed cell, walk outward in BOTH directions along each of the four axes and test run + 1 + run >= K — O(K) per move, independent of board size", "Precompute every possible winning window and check the ones containing the placed cell", "Scan all rows, columns and diagonals of length K after every move", "Keep counters per row and column and accept that middle completions are missed"],
    correct: "From the placed cell, walk outward in BOTH directions along each of the four axes and test run + 1 + run >= K — O(K) per move, independent of board size",
    explanation: "Locality still holds; only the win predicate changed. Both directions is the load-bearing detail — a stone can complete a line from the middle (XX_XX), so counting only forward or only lines starting at the placed cell misses interior completions." }),
  // Snake & Ladder
  pm("lld_m5", { topicId: "lld_m5_t6", exerciseId: "lld_m5_t6_pm_d1", position: 11, level: "medium",
    title: "One map or two classes?", scenario: "How should snakes and ladders be modelled, given that a token lands on a start square and moves to an end square in both cases?",
    options: ["One Map<start, end>: a snake is end < start and a ladder end > start, so resolution is a single lookup loop and chained jumps need no special case", "An abstract Jump class with Snake and Ladder subclasses overriding apply()", "Two separate maps consulted in sequence, snakes first", "A 2D grid where each cell stores its snake or ladder object"],
    correct: "One Map<start, end>: a snake is end < start and a ladder end > start, so resolution is a single lookup loop and chained jumps need no special case",
    explanation: "The subtypes have identical behaviour — only the sign of the displacement differs, which is data, not control flow. Collapsing them makes chaining fall out of a while loop and turns a new jump type into a configuration entry; snake-versus-ladder survives only as a display concern." }),
  pm("lld_m5", { topicId: "lld_m5_t6", exerciseId: "lld_m5_t6_pm_d2", position: 12, level: "hard",
    title: "The game that never returns", scenario: "Landing resolution follows jumps in a while loop. A configuration has a ladder 20->45 and a snake 45->20. What must the design do?",
    options: ["Validate at construction — walk from every jump start with a hop bound and reject cycles — and keep the same bound in the resolution loop as a runtime guard", "Cap the loop at two hops and accept whatever square it reaches", "Catch StackOverflowError and restart the turn", "Disallow snakes and ladders that share any square"],
    correct: "Validate at construction — walk from every jump start with a hop bound and reject cycles — and keep the same bound in the resolution loop as a runtime guard",
    explanation: "A hang is the worst failure mode because it produces no message. Bounding the validation walk by the number of jumps detects a cycle by pigeonhole, and the same bound at runtime downgrades a validation mistake from a hang to a wrong answer. Validate the other invariants too: in-range endpoints, no self-jump, no jump on the final square." }),
  pm("lld_m5", { topicId: "lld_m5_t6", exerciseId: "lld_m5_t6_pm_d3", position: 13, level: "medium",
    title: "Testing a random game", scenario: "You must assert that a player on 94 rolling a 4 lands on 98, climbs to 99, and is then sent down a snake to 3. The game calls new Random() inline. What is the fix?",
    options: ["Put the die behind a Dice interface — FixedSequenceDice scripts the rolls, seeded RandomDice keeps production reproducible — and move house rules into a TurnPolicy", "Run the test a thousand times and assert the outcome appears at least once", "Mock the Random class with a bytecode instrumentation agent", "Expose a setNextRoll() method on Game for tests only"],
    correct: "Put the die behind a Dice interface — FixedSequenceDice scripts the rolls, seeded RandomDice keeps production reproducible — and move house rules into a TurnPolicy",
    explanation: "Nondeterministic input is a dependency, and dependencies belong behind interfaces — the same discipline as injecting a Clock into a rate limiter. With the roll sequence fixed, every rule (chained jumps, three-sixes forfeit, exact-finish overshoot) becomes an assertable unit test, and the seam doubles as the configurability the variants need." }),

];

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
  console.log(`✓ LLD depth batch 6 seeded: ${tUp} topics deepened, ${eUp} exercises upserted.`);
  console.log(`  track totals now: ${JSON.stringify(totals)}`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err); process.exit(1); });
