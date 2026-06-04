/**
 * Seed — LLD module M20: Concurrency in Depth:
 * Counting Semaphore, Future/Promise, Event Loop, CountDownLatch/Barrier,
 * Lock-Free Stack (CAS/ABA), Token-Bucket Rate Limiter, Dining Philosophers,
 * Actor System/Mailbox. Extends pro_lld. Idempotent; recomputes totals.
 * Usage:  node config/seedLldCases14.js   ·   npm: npm run seed:lld-cases14
 * NOTE: run seedLldDiagrams.js after, or use seed:lld-all (diagrams last).
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeLldTotals } from "./lldTotals.mjs";

const TRACK_KEY = "pro_lld";
const MODULE_ID = "lld_m20";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 20,
  name: "Concurrency in Depth", slug: "concurrency-in-depth",
  description: "Design eight concurrency primitives and patterns: a counting semaphore, a Future/Promise, an event loop, a CountDownLatch/barrier, a lock-free stack, a token-bucket rate limiter, the dining-philosophers solution, and an actor system.",
  estimatedHours: 5, prerequisites: ["lld_m1", "lld_m13"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 40, difficulty: 4, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI }, teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 40, difficulty: diff, xpReward: 60, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("lld_m20_t1", 1, "Design a Counting Semaphore", "design-semaphore",
    ["concurrency", "semaphore", "permits", "throttling"],
    "Build a semaphore that allows at most N threads into a critical section / to use N resources at once. How does it differ from a mutex, and what's the wait/signal mechanism?",
    "A semaphore holds a COUNT of available PERMITS. acquire() decrements the count, BLOCKING (on a condition variable) if it's 0 until a permit is released; release() increments and wakes a waiter. A mutex is a binary semaphore (N=1, owned by one). A counting semaphore (N>1) bounds CONCURRENT access to a pool of N resources (connection limits, rate throttling).",
    [
      { kind: "concept", heading: "Permits, not ownership",
        body: "A counting semaphore maintains an integer COUNT of available PERMITS (initialized to N). acquire() (a.k.a. wait/P) takes a permit — decrement; if none are available (count 0), the caller BLOCKS until one is released. release() (signal/V) returns a permit — increment, and wake a blocked waiter. Unlike a lock, there's no concept of 'owner' — any thread can release, and permits represent capacity, not exclusive ownership." },
      { kind: "concept", heading: "vs mutex",
        body: "A MUTEX (binary semaphore, N=1) allows ONE thread in a critical section and is typically OWNED (only the locker unlocks). A COUNTING semaphore (N>1) allows up to N threads/resources concurrently — used to BOUND access to a pool (e.g. at most 10 DB connections, at most K concurrent downloads). So: mutex = mutual exclusion; counting semaphore = bounded concurrency / resource counting." },
      { kind: "concept", heading: "Implementation",
        body: "Under an internal LOCK protecting the count + a CONDITION variable: acquire() loops while count == 0 (wait on the condition — in a WHILE loop, for spurious wakeups), then decrements; release() increments and signals the condition to wake one waiter. This is the same lock+condition discipline as the bounded blocking queue. Some semaphores support acquire(k)/release(k) for multiple permits at once." },
      { kind: "concept", heading: "Uses & follow-ups",
        body: "Bounding concurrency: connection/thread pools (the pool design), limiting concurrent calls to a downstream (bulkhead), rate/concurrency throttling, and signaling between threads (producer signals consumer). Follow-ups: 'binary semaphore vs mutex ownership', 'fairness (FIFO waiters vs barging)', 'why a count not a boolean', 'semaphore vs blocking queue'. Signal: a permit count guarded by lock+condition (acquire blocks at 0, release signals) bounding concurrent access to N — distinct from a mutex's single-owner exclusion.",
      },
    ],
    "A counting semaphore tests permit-based bounded concurrency: a permit count guarded by a lock + condition variable (acquire blocks at 0, release signals a waiter), allowing up to N concurrent users — vs a mutex (binary, owned, mutual exclusion). It bounds access to resource pools and throttles concurrency.",
    ["Confusing it with a mutex — a counting semaphore allows N concurrent, has no single owner.",
     "Checking the count in an `if` instead of a `while` (spurious wakeups) / not signaling on release.",
     "Using a boolean instead of a count (can't represent N permits)."],
    0.5, { type: "Semaphore", description: "count = N permits. acquire(): lock → while count==0 wait(cond) → count-- . release(): lock → count++ → signal(cond). Bounds concurrent access to N (mutex = binary semaphore, N=1, owned).", alt: "Counting semaphore: a permit count guarded by lock+condition bounding concurrent access to N." }),

  T("lld_m20_t2", 2, "Design a Future / Promise", "design-future-promise",
    ["concurrency", "future", "async", "callback"],
    "Build a Future: a placeholder for a result that will be available LATER (from another thread/async task). How does a caller wait for or react to a result that doesn't exist yet, and what about exceptions?",
    "A Future holds a STATE (pending → completed/failed) and the eventual VALUE (or exception). The producer COMPLETES it (set value/exception), which unblocks any thread blocked on get() and fires registered CALLBACKS (then/onComplete). Completion must be thread-safe and idempotent (complete once). It decouples 'when you ask' from 'when the result is ready' — the backbone of async/await and the thread pool's submit().",
    [
      { kind: "concept", heading: "A placeholder for a future result",
        body: "When you start an async task (submit to a thread pool, make an async call), the result isn't ready yet. A FUTURE (a.k.a. Promise) is a handle representing that EVENTUAL result. It starts PENDING; later, the producer (the worker/async op) COMPLETES it with a value (or an exception). Consumers hold the future and either wait for or react to completion — decoupling the moment of request from the moment of result." },
      { kind: "concept", heading: "Consuming: block or callback",
        body: "Two ways to consume a future: (1) BLOCKING get() — the calling thread waits until the future completes, then returns the value (or throws the stored exception); useful when you truly need the result now. (2) CALLBACKS / chaining — register then(fn)/onComplete(fn) that the future invokes WHEN it completes, without blocking; chaining (then → returns a new future) builds async pipelines. Callbacks enable non-blocking composition; blocking is simpler but ties up a thread." },
      { kind: "concept", heading: "Completion & thread-safety",
        body: "The producer COMPLETES the future exactly ONCE (set value or set exception). Completion must be THREAD-SAFE: atomically transition pending→completed, store the result, then unblock all get() waiters and invoke all registered callbacks (handling callbacks registered both before AND after completion — if already complete, run the callback immediately). Errors are first-class: a failure stores an exception that propagates to get()/error callbacks. Double-completion is rejected." },
      { kind: "concept", heading: "Composition & follow-ups",
        body: "Futures compose: map/then (transform the result), flatMap (chain async ops), and combinators like all() (await many) / any() (first to finish) — building complex async flows without blocking. They underpin async/await (await = suspend until a future completes) and the thread-pool submit() (the m15 design). Follow-ups: 'cancellation', 'timeouts (complete with timeout exception)', 'executor for callbacks (which thread runs them)', 'callback hell vs async/await'. Signal: pending→completed/failed state + value/exception + block-or-callback consumption + thread-safe complete-once + composition (then/all/any); decouples request from result.",
      },
    ],
    "A Future tests async result handling: a pending→completed/failed state holding a value or exception, consumed by blocking get() or registered callbacks (fired on completion, including late registrations), completed thread-safely exactly once, and composable (then/all/any). It decouples request from result and underpins async/await and thread-pool submit().",
    ["No callback path — only blocking get() (defeats non-blocking composition).",
     "Not handling exceptions as first-class (failure must propagate to get()/error callbacks).",
     "Unsafe/double completion, or not running callbacks registered after the future already completed."],
    0.5, { type: "Future", description: "State: PENDING → COMPLETED(value) / FAILED(exception). Producer completes once (thread-safe) → unblocks get() waiters + fires callbacks (then/onComplete). Consume by blocking get() or non-blocking callbacks/chaining. Compose: map/then, all, any.", alt: "Future/Promise: a pending result completed once, consumed by blocking get or callbacks." }),

  T("lld_m20_t3", 3, "Design an Event Loop", "design-event-loop",
    ["concurrency", "event-loop", "async", "non-blocking"],
    "Build a single-threaded event loop (Node.js / Redis / UI style) that handles many concurrent I/O operations without threads. How does ONE thread serve thousands of connections, and what must you never do in it?",
    "A single thread runs a LOOP: pull ready events/callbacks from a QUEUE and run them to completion, one at a time. I/O is NON-BLOCKING — you start an op and register a CALLBACK fired when it's ready (via OS readiness notification like epoll), so the thread never waits on I/O. It serves many connections by interleaving short callbacks. The cardinal rule: NEVER BLOCK the loop (no slow sync work) — it freezes everything.",
    [
      { kind: "concept", heading: "One thread, many connections",
        body: "Instead of a thread per connection (memory + context-switch overhead at scale — the C10K problem), an event loop uses ONE thread to handle thousands of concurrent connections. It works because most server work is I/O-bound (waiting on network/disk): rather than block a thread waiting, the loop starts I/O asynchronously and moves on, processing whatever is READY. The single thread is almost never idle and never blocked on I/O." },
      { kind: "concept", heading: "The loop + callback queue",
        body: "The core is a LOOP: repeatedly take the next ready event/callback from a QUEUE and execute it to completion, then take the next. Events come from completed I/O, timers, and posted tasks. Each callback runs ATOMICALLY (no preemption — no need for locks on the loop's own state, a big simplification). The loop blocks ONLY in one place: waiting for the OS to report that some I/O is ready (epoll/kqueue/IOCP), then dispatches the corresponding callbacks." },
      { kind: "concept", heading: "Non-blocking I/O + readiness",
        body: "The enabler is NON-BLOCKING I/O: a read/write returns immediately (would-block instead of waiting); you register interest and the OS NOTIFIES (via epoll/select) when the socket is readable/writable. The loop asks the OS 'which of my thousands of FDs are ready?' in one call, then runs only those callbacks. This readiness-based multiplexing is what lets one thread juggle massive concurrency. (Async/await/promises sit on top — the m20 Future design.)" },
      { kind: "concept", heading: "The cardinal rule & follow-ups",
        body: "NEVER BLOCK the loop. Because it's single-threaded, any long SYNCHRONOUS work (a CPU-heavy computation, a blocking/sync I/O call, an infinite loop) STALLS the entire loop — every other connection waits. So: offload CPU-heavy work to a worker thread/pool, and only ever use non-blocking I/O. Follow-ups: 'macro vs microtask queues', 'CPU-bound work (worker threads)', 'multiple loops/processes for multi-core (cluster)', 'backpressure'. Signal: single thread + ready-callback queue + non-blocking I/O via OS readiness (epoll) serving many connections; run-to-completion callbacks (no locks needed), and never block the loop.",
      },
    ],
    "An event loop tests single-threaded async I/O: one thread runs a queue of ready callbacks to completion, using non-blocking I/O + OS readiness notification (epoll) to serve thousands of connections without a thread each (solving C10K). Callbacks need no locks (run-to-completion); the cardinal rule is NEVER block the loop (offload CPU work).",
    ["A thread-per-connection mindset instead of one loop multiplexing non-blocking I/O.",
     "Doing blocking/CPU-heavy work in the loop — it stalls ALL connections.",
     "Not understanding OS readiness (epoll) is what lets one thread watch thousands of FDs."],
    0.6, { type: "Event loop", description: "Single thread loops: ask OS which FDs are ready (epoll) → run their callbacks (+ timers/tasks) to completion, one at a time → repeat. Non-blocking I/O (start + callback on ready). Serves thousands of connections; NEVER block the loop (offload CPU work to a pool).", alt: "Event loop: one thread running ready callbacks over non-blocking I/O via OS readiness." }),

  T("lld_m20_t4", 4, "Design a CountDownLatch / Barrier", "design-latch-barrier",
    ["concurrency", "synchronization", "latch", "barrier"],
    "Build synchronization primitives that make threads WAIT for each other: a latch ('wait until N tasks finish') and a barrier ('all N threads wait until everyone reaches this point'). How do they differ, and what's the count mechanism?",
    "A COUNTDOWNLATCH starts at N; countDown() decrements; await() BLOCKS until the count hits 0, then ALL waiters proceed (one-shot, can't reset). A CYCLIC BARRIER makes a fixed party of N threads each call await() and all BLOCK until the Nth arrives, then all release together (REUSABLE for repeated phases). Latch = wait-for-events; barrier = mutual rendezvous. Both use a count + condition variable.",
    [
      { kind: "concept", heading: "CountDownLatch: wait for N events",
        body: "A CountDownLatch is initialized with a count N. Worker threads call countDown() as they complete their piece (decrementing the count); one or more threads call await(), which BLOCKS until the count reaches 0, then all return. Use it for 'wait until N things have happened' — e.g. a coordinator waiting for N worker tasks to finish, or N services to initialize before serving. It's ONE-SHOT: once it hits 0 it stays open; it cannot be reset/reused." },
      { kind: "concept", heading: "CyclicBarrier: mutual rendezvous",
        body: "A CyclicBarrier is for a FIXED group of N threads that must wait for EACH OTHER at a common point. Each thread calls await(); the first N−1 BLOCK; when the Nth arrives, ALL N are released together (a 'barrier' they cross simultaneously). Crucially it's CYCLIC/REUSABLE — after releasing, it resets for the next round, so threads can synchronize at the barrier repeatedly (e.g. each iteration of a parallel computation). An optional barrier action runs once when tripped." },
      { kind: "concept", heading: "Latch vs barrier (the distinction)",
        body: "The key difference: a LATCH is a one-way gate where SOME threads wait for OTHERS' events (the awaiters and counters are different roles; one-shot). A BARRIER is a mutual meeting point where the SAME set of threads all wait for each other (symmetric; reusable). 'Wait for N tasks to finish' → latch. 'N parallel workers sync at the end of each phase' → barrier. Picking the right one is the interview signal." },
      { kind: "concept", heading: "Implementation & follow-ups",
        body: "Both are built on a COUNT guarded by a lock + CONDITION variable: decrement/track arrivals, block on the condition while not yet satisfied, and broadcast (notify ALL — everyone proceeds) when the threshold is met. The barrier additionally resets its count for reuse and handles broken-barrier cases (a waiting thread interrupted/timed out breaks it for all). Follow-ups: 'Phaser (flexible parties)', 'latch vs join()', 'broken barrier handling', 'why broadcast not signal'. Signal: count + condition; latch = one-shot wait-for-N-events (asymmetric roles), barrier = reusable mutual rendezvous of N threads (notify-all on trip).",
      },
    ],
    "Latches/barriers test thread coordination: a CountDownLatch (one-shot, await blocks until N countDowns reach 0 — some threads wait for others' events) vs a CyclicBarrier (reusable, N threads each await and all release when the last arrives — mutual rendezvous). Both use a count + condition with notify-all; picking latch vs barrier is the signal.",
    ["Confusing latch (one-shot, asymmetric wait-for-events) with barrier (reusable, mutual rendezvous).",
     "Using signal (wake one) instead of broadcast/notify-all (everyone must proceed together).",
     "Expecting a CountDownLatch to reset/reuse (it's one-shot; use a CyclicBarrier)."],
    0.5),

  T("lld_m20_t5", 5, "Design a Lock-Free Stack", "design-lock-free-stack",
    ["concurrency", "lock-free", "cas", "aba"],
    "Build a thread-safe stack WITHOUT locks, using atomic compare-and-swap (CAS). Why go lock-free, how does CAS coordinate without blocking, and what's the infamous bug lurking here?",
    "Use an ATOMIC head pointer updated via COMPARE-AND-SWAP (CAS): push/pop read the current head, prepare the new head, then CAS — if head changed (another thread won), the CAS fails and you RETRY (a loop). No locks → no blocking/deadlock, scales under contention. The infamous bug is the ABA PROBLEM (head looks unchanged but was A→B→A); fix with tagged pointers / hazard pointers / epochs.",
    [
      { kind: "concept", heading: "Why lock-free",
        body: "Lock-based structures can suffer: a thread holding a lock that's descheduled blocks everyone (no progress), plus lock contention and deadlock risk. LOCK-FREE structures guarantee that SOME thread always makes progress (no mutual blocking), often scaling better under high contention and avoiding deadlock entirely. The cost: they're subtle and hard to get right. A stack is the simplest lock-free structure to reason about." },
      { kind: "concept", heading: "CAS retry loop",
        body: "The whole thing hinges on COMPARE-AND-SWAP (CAS), an atomic CPU instruction: 'if this memory still equals expected, set it to new — atomically — and report success/failure'. PUSH: read current head, set newNode.next = head, then CAS(head, expected=head, new=newNode); if another thread changed head in between, CAS FAILS → re-read and RETRY. POP: read head, compute head.next, CAS(head, head, head.next); retry on failure. The optimistic read-modify-CAS-retry loop replaces locking." },
      { kind: "concept", heading: "The ABA problem (the infamous bug)",
        body: "The classic lock-free pitfall: thread 1 reads head = A and plans CAS(A → A.next). Before it does, other threads POP A, pop more, then PUSH A back — head is A AGAIN but the stack changed (A.next is now stale/freed). Thread 1's CAS SUCCEEDS (head still == A) but corrupts the stack. This ABA problem occurs because CAS only checks the VALUE, not whether it changed-and-changed-back. Fixes: TAGGED pointers (pointer + a version counter, CAS both — the version differs), HAZARD POINTERS, or epoch-based reclamation (also solving safe memory free)." },
      { kind: "concept", heading: "Memory reclamation & follow-ups",
        body: "Related hard problem: when can you safely FREE a popped node? Another thread might still hold a reference to it (use-after-free) — solved by hazard pointers / epoch-based reclamation / RCU (in GC'd languages, the GC handles it, sidestepping much of this). Follow-ups: 'lock-free vs wait-free', 'why ABA, and tagged-pointer fix', 'Treiber stack', 'when NOT to go lock-free (often a lock is simpler/fine)'. Signal: atomic head + CAS retry loop (optimistic, no locks, progress guarantee) + the ABA problem and its fixes (tagged pointers/hazard pointers) + safe reclamation.",
      },
    ],
    "A lock-free stack tests CAS-based concurrency: an atomic head updated via a compare-and-swap retry loop (optimistic, no locks, progress guarantee) — plus the infamous ABA problem (CAS sees an unchanged value that actually changed-and-changed-back, corrupting the stack), fixed with tagged/hazard pointers, and safe memory reclamation. Often a plain lock is simpler when contention is low.",
    ["Assuming CAS alone is safe — missing the ABA problem (value unchanged ≠ not modified).",
     "Ignoring safe memory reclamation (freeing a node another thread still references).",
     "Reaching for lock-free when a simple lock would do (it's subtle and rarely necessary)."],
    0.6, { type: "Lock-free stack", description: "Atomic head pointer. push: newNode.next = head; CAS(head, head, newNode) — retry if head changed. pop: CAS(head, head, head.next) — retry. No locks (progress guaranteed). ABA problem: head A→B→A fools CAS → fix with tagged/hazard pointers + safe reclamation.", alt: "Lock-free stack: an atomic head updated by a CAS retry loop, guarding against the ABA problem." }),

  T("lld_m20_t6", 6, "Design a Token-Bucket Rate Limiter", "design-token-bucket",
    ["concurrency", "rate-limiting", "token-bucket", "thread-safe"],
    "Build a thread-safe rate limiter that allows bursts up to a cap but enforces an average rate. Why is the token-bucket algorithm preferred over a fixed window, and how do you refill without a background thread?",
    "A bucket holds up to CAPACITY tokens; each request consumes one (rejected if none). Tokens REFILL at a fixed RATE — computed LAZILY on each request from elapsed time (no background timer needed). It allows BURSTS up to capacity while bounding the long-run average rate. Thread-safe via atomic/locked token updates. Beats fixed-window (which allows 2× bursts at window edges) and is the standard choice.",
    [
      { kind: "concept", heading: "The token bucket",
        body: "Model a bucket that holds up to CAPACITY tokens. Each incoming request must take ONE token to proceed; if the bucket is empty, the request is REJECTED (or throttled/queued). Tokens are ADDED back at a steady REFILL RATE (e.g. 10 tokens/sec) up to the capacity. So you can BURST (spend many tokens quickly up to capacity) but the long-run rate is bounded by the refill rate — bursts allowed, average enforced. This burst-tolerance is why it's the popular choice." },
      { kind: "concept", heading: "Lazy refill (no background thread)",
        body: "You don't need a timer thread continuously adding tokens. Instead, refill LAZILY: store the current token count + the last-refill timestamp; on each request, compute elapsed time since last refill, add (elapsed × rate) tokens (capped at capacity), update the timestamp, then try to consume. This computes the bucket's state on demand — cheap, accurate, and avoids a background scheduler. The lazy time-based refill is the key implementation trick." },
      { kind: "concept", heading: "Thread-safety",
        body: "Many threads/requests hit the limiter concurrently, so the refill-and-consume must be ATOMIC — otherwise two requests could both see the last token and both proceed (over-limit). Guard with a lock (or atomic CAS on the token count) around the read-elapsed → refill → consume sequence. For a distributed limiter, the bucket lives in a shared store (Redis) with atomic operations (the distributed-rate-limiter design)." },
      { kind: "concept", heading: "vs other algorithms & follow-ups",
        body: "FIXED WINDOW (count per calendar window) is simple but allows a BURST of 2× the limit straddling the window boundary (end of one + start of next). LEAKY BUCKET smooths output to a constant rate (no bursts — a queue draining at fixed rate). SLIDING WINDOW (log/counter) is accurate but heavier. Token bucket is the sweet spot: burst-tolerant, simple, efficient. Follow-ups: 'token bucket vs leaky bucket', 'per-user buckets', 'distributed (Redis Lua)', 'reject vs queue vs delay'. Signal: capacity-bounded token bucket + lazy time-based refill (no background thread) + atomic consume (thread-safe) + allows bursts while bounding average; superior to fixed-window's boundary burst.",
      },
    ],
    "A token-bucket rate limiter tests burst-tolerant throttling: a capacity-bounded bucket where each request takes a token, refilled lazily from elapsed time (no background thread), with atomic refill-and-consume for thread safety. It allows bursts up to capacity while bounding the average rate — superior to fixed-window's 2× boundary burst.",
    ["Fixed-window counting (allows a 2× burst at the window boundary) when burst-bounded average is wanted.",
     "A background timer to refill instead of lazy time-based refill on each request.",
     "Non-atomic refill+consume — two concurrent requests both spending the last token (over-limit)."],
    0.5, { type: "Token bucket", description: "Bucket ≤ capacity tokens. Request: lazily refill (count += elapsed × rate, capped) → if ≥1 token, consume + allow; else reject. Atomic refill+consume (thread-safe). Bursts up to capacity; average bounded by rate. Beats fixed-window boundary bursts.", alt: "Token-bucket rate limiter with lazy time-based refill and atomic consume." }),

  T("lld_m20_t7", 7, "Design the Dining Philosophers Solution", "design-dining-philosophers",
    ["concurrency", "deadlock", "resource-ordering", "coordination"],
    "Solve the classic dining philosophers problem: 5 philosophers, 5 shared forks, each needs BOTH neighboring forks to eat. The naive 'pick up left then right' deadlocks. Why, and how do you prevent it?",
    "The naive solution (everyone grabs left fork, then right) can DEADLOCK: all grab left simultaneously, none can get the right (circular wait). Fix by breaking one of the deadlock conditions — RESOURCE ORDERING (always pick up the lower-numbered fork first → no cycle), or limit diners to N−1 at once (a semaphore), or make one philosopher grab right-first (asymmetry). It's the canonical deadlock-avoidance lesson.",
    [
      { kind: "concept", heading: "The problem & the deadlock",
        body: "Five philosophers sit around a table, a fork between each pair; a philosopher needs BOTH adjacent forks to eat. The naive approach — each picks up the LEFT fork, then the RIGHT — can DEADLOCK: if all five grab their left fork at the same instant, every fork is held and everyone waits forever for their right fork (a CIRCULAR WAIT). This is the textbook illustration of deadlock from shared resources." },
      { kind: "concept", heading: "The four deadlock conditions",
        body: "Deadlock requires ALL four (Coffman) conditions simultaneously: MUTUAL EXCLUSION (forks aren't shareable), HOLD-AND-WAIT (hold one fork while waiting for another), NO PREEMPTION (can't force-take a fork), and CIRCULAR WAIT (a cycle of waiting). Break ANY one and deadlock is impossible. The dining-philosophers solutions each break a different condition — that's the real lesson (deadlock prevention)." },
      { kind: "concept", heading: "Solutions",
        body: "(1) RESOURCE ORDERING — number the forks; each philosopher always picks up the LOWER-numbered fork first. This breaks CIRCULAR WAIT (no cycle can form) — the cleanest, most general fix (apply the same global lock-ordering anywhere you take multiple locks). (2) LIMIT DINERS — allow at most N−1 philosophers to attempt eating at once (a counting semaphore), breaking hold-and-wait/circular-wait. (3) ASYMMETRY — make one philosopher pick up right-first. (4) Atomically acquire BOTH forks or neither (try-lock both, release if can't). Each breaks a Coffman condition." },
      { kind: "concept", heading: "Beyond the toy & follow-ups",
        body: "The real takeaway: when code acquires MULTIPLE LOCKS, inconsistent ordering causes deadlock — enforce a GLOBAL LOCK ORDERING (the resource-ordering solution) to prevent it. Also: starvation (a philosopher never eats — need fairness) is distinct from deadlock. Follow-ups: 'detect vs prevent vs avoid (banker's algorithm)', 'livelock (all back off repeatedly)', 'try-lock with timeout/backoff'. Signal: naive left-then-right deadlocks (circular wait); fix by breaking a Coffman condition — resource/lock ordering (best, general), limit concurrency, or asymmetry; the multi-lock deadlock-prevention lesson.",
      },
    ],
    "Dining philosophers tests deadlock prevention: the naive left-then-right grab deadlocks via circular wait; fix by breaking a Coffman condition — global resource/lock ordering (pick lower fork first — the general lesson for acquiring multiple locks), limiting concurrent diners (semaphore), or asymmetry. Starvation/livelock are related but distinct.",
    ["The naive left-then-right approach (circular-wait deadlock).",
     "Not knowing the general fix is consistent global lock/resource ordering for multiple locks.",
     "Confusing deadlock with starvation/livelock, or only detecting rather than preventing."],
    0.5, { type: "Deadlock prevention", description: "Naive: all grab left fork → circular wait → deadlock. Fix by breaking a Coffman condition: resource ordering (always take lower-numbered fork first → no cycle), limit to N−1 diners (semaphore), or asymmetry (one grabs right first). Lesson: global lock ordering for multiple locks.", alt: "Dining philosophers: circular-wait deadlock fixed by resource ordering or limiting diners." }),

  T("lld_m20_t8", 8, "Design an Actor System", "design-actor-system",
    ["concurrency", "actor-model", "message-passing", "isolation"],
    "Build the actor model (Erlang/Akka): concurrency via isolated actors that communicate ONLY by messages, with no shared state. How does this avoid locks entirely, and how do actors process messages safely?",
    "An ACTOR encapsulates private STATE + behavior + a MAILBOX (a queue of incoming messages). Actors NEVER share memory — they communicate ONLY by sending immutable MESSAGES. Each actor processes its mailbox messages ONE AT A TIME (single-threaded per actor), so its state needs NO LOCKS. Actors can spawn children and supervise them (let-it-crash + restart). It's share-nothing message-passing concurrency.",
    [
      { kind: "concept", heading: "Share-nothing, message-passing",
        body: "The actor model rethinks concurrency: instead of threads sharing memory guarded by locks (error-prone — races, deadlocks), an ACTOR is an isolated unit owning PRIVATE state that NOTHING else can touch directly. Actors interact ONLY by SENDING MESSAGES (immutable) to each other's mailboxes. No shared mutable state means NO LOCKS are needed — the root cause of most concurrency bugs is removed by design. This is how Erlang/Akka achieve massive concurrency." },
      { kind: "concept", heading: "Mailbox + sequential processing",
        body: "Each actor has a MAILBOX — a queue of incoming messages. Messages are delivered ASYNCHRONOUSLY (send is fire-and-forget; the sender doesn't block). The actor processes messages from its mailbox ONE AT A TIME, sequentially. Because only the actor itself ever touches its state, and it handles one message at a time, its state mutations are inherently safe WITHOUT locks. A scheduler runs many actors over a small thread pool (actors are cheap — millions can exist)." },
      { kind: "concept", heading: "Supervision & let-it-crash",
        body: "Actors form a HIERARCHY: an actor can SPAWN child actors and SUPERVISE them. The Erlang philosophy is 'let it crash' — instead of defensive error handling everywhere, let a faulty actor fail, and its SUPERVISOR decides how to recover (restart it, restart siblings, escalate). This isolates failures (one actor crashing doesn't corrupt others — no shared state to corrupt) and makes systems self-healing and fault-tolerant." },
      { kind: "concept", heading: "Trade-offs & follow-ups",
        body: "Strengths: no locks, natural distribution (actors can live on different machines — location-transparent message passing scales to clusters), fault isolation. Trade-offs: message-passing overhead, eventual-consistency-style reasoning (no synchronous shared reads), and debugging async flows. Follow-ups: 'actor vs CSP/channels (Go)', 'mailbox backpressure/overflow', 'ask vs tell (request-reply over async)', 'at-least-once delivery'. Signal: isolated actors (private state, no sharing) + mailbox + one-message-at-a-time processing (no locks) + spawn/supervise (let-it-crash) + async message passing (distributable); share-nothing concurrency.",
      },
    ],
    "An actor system tests share-nothing concurrency: isolated actors own private state and communicate only by async messages to mailboxes, processing one message at a time (so no locks are needed — the lock-free win), with spawn/supervise hierarchies and let-it-crash fault isolation. It's location-transparent (distributable); message overhead and async reasoning are the trade-offs.",
    ["Letting actors share state instead of communicating purely by messages (defeats the lock-free model).",
     "Processing a mailbox concurrently instead of one message at a time (reintroduces races).",
     "Defensive error handling everywhere instead of supervision / let-it-crash for fault isolation."],
    0.6, { type: "Actor model", description: "Actor = private state + behavior + mailbox (message queue). Actors share NOTHING; communicate only by async immutable messages. Each processes its mailbox ONE message at a time → no locks. Spawn + supervise children (let-it-crash → restart). Location-transparent (distributable).", alt: "Actor system: isolated actors with mailboxes processing messages one at a time, no shared state." }),
];

const EXERCISES = [
  // Semaphore
  pm({ topicId: "lld_m20_t1", exerciseId: "lld_m20_t1_pm_1", position: 1, level: "medium", title: "vs mutex",
    scenario: "A counting semaphore differs from a mutex in that it…",
    options: ["Allows up to N threads concurrently (bounds access to N resources)", "Allows exactly one thread, owned", "Can't block", "Never has a count"], correct: "Allows up to N threads concurrently (bounds access to N resources)",
    explanation: "A counting semaphore bounds concurrency to N permits; a mutex is a binary, owned, single-thread lock." }),
  pm({ topicId: "lld_m20_t1", exerciseId: "lld_m20_t1_pm_2", position: 2, level: "medium", title: "Empty bucket",
    scenario: "acquire() when no permits are available should…",
    options: ["Block on a condition (in a while loop) until a permit is released", "Return false silently", "Throw immediately", "Spin forever"], correct: "Block on a condition (in a while loop) until a permit is released",
    explanation: "Block until release() signals; re-check the count in a while loop for spurious wakeups." }),
  pm({ topicId: "lld_m20_t1", exerciseId: "lld_m20_t1_pm_3", position: 3, level: "easy", title: "Use",
    scenario: "A counting semaphore is ideal for…",
    options: ["Limiting concurrent access to a pool of N resources", "Sorting threads", "Storing data", "Replacing a queue"], correct: "Limiting concurrent access to a pool of N resources",
    explanation: "E.g. at most N DB connections or K concurrent downloads — bounded concurrency." }),
  // Future
  pm({ topicId: "lld_m20_t2", exerciseId: "lld_m20_t2_pm_1", position: 1, level: "medium", title: "What it is",
    scenario: "A Future represents…",
    options: ["A placeholder for a result that will be available later", "A thread", "A lock", "A queue"], correct: "A placeholder for a result that will be available later",
    explanation: "It decouples requesting an async result from receiving it; completed once with a value or exception." }),
  pm({ topicId: "lld_m20_t2", exerciseId: "lld_m20_t2_pm_2", position: 2, level: "medium", title: "Consume",
    scenario: "Besides blocking get(), a Future lets you…",
    options: ["Register callbacks (then/onComplete) fired when it completes", "Only poll in a loop", "Cancel the thread pool", "Nothing else"], correct: "Register callbacks (then/onComplete) fired when it completes",
    explanation: "Callbacks/chaining enable non-blocking composition; they run on completion (immediately if already complete)." }),
  pm({ topicId: "lld_m20_t2", exerciseId: "lld_m20_t2_pm_3", position: 3, level: "hard", title: "Failure",
    scenario: "If the async task throws, the Future should…",
    options: ["Store the exception and propagate it to get()/error callbacks", "Hang forever", "Return null", "Retry automatically"], correct: "Store the exception and propagate it to get()/error callbacks",
    explanation: "Errors are first-class: completion-with-exception unblocks get() (throwing) and fires error callbacks." }),
  // Event loop
  pm({ topicId: "lld_m20_t3", exerciseId: "lld_m20_t3_pm_1", position: 1, level: "hard", title: "Many connections",
    scenario: "One event-loop thread serves thousands of connections because…",
    options: ["I/O is non-blocking; it processes whatever the OS reports ready (epoll), never waiting on I/O", "It secretly uses many threads", "Connections are slow", "It blocks on each one briefly"], correct: "I/O is non-blocking; it processes whatever the OS reports ready (epoll), never waiting on I/O",
    explanation: "Non-blocking I/O + OS readiness multiplexing lets one thread interleave many connections (solves C10K)." }),
  pm({ topicId: "lld_m20_t3", exerciseId: "lld_m20_t3_pm_2", position: 2, level: "hard", title: "Cardinal rule",
    scenario: "The one thing you must NEVER do in an event loop is…",
    options: ["Block it with slow synchronous / CPU-heavy work (stalls all connections)", "Use callbacks", "Handle timers", "Read from sockets"], correct: "Block it with slow synchronous / CPU-heavy work (stalls all connections)",
    explanation: "Single-threaded: any blocking/CPU-heavy work freezes everything — offload to a worker pool." }),
  pm({ topicId: "lld_m20_t3", exerciseId: "lld_m20_t3_pm_3", position: 3, level: "medium", title: "No locks",
    scenario: "Why does loop-handler state need no locks?",
    options: ["Callbacks run to completion one at a time on the single thread (no concurrency)", "Locks are added automatically", "State is immutable", "It uses a database"], correct: "Callbacks run to completion one at a time on the single thread (no concurrency)",
    explanation: "Run-to-completion on one thread means no two callbacks touch the loop's state concurrently." }),
  // Latch/barrier
  pm({ topicId: "lld_m20_t4", exerciseId: "lld_m20_t4_pm_1", position: 1, level: "medium", title: "Latch",
    scenario: "A CountDownLatch is used to…",
    options: ["Wait until N events/tasks complete (one-shot)", "Synchronize the same N threads repeatedly", "Limit concurrency to N", "Replace a mutex"], correct: "Wait until N events/tasks complete (one-shot)",
    explanation: "await() blocks until N countDown()s reach 0; it's one-shot and can't be reset." }),
  pm({ topicId: "lld_m20_t4", exerciseId: "lld_m20_t4_pm_2", position: 2, level: "medium", title: "Barrier",
    scenario: "A CyclicBarrier makes N threads…",
    options: ["Each wait at a point until all N arrive, then proceed together (reusable)", "Wait for external events", "Run one at a time", "Never wait"], correct: "Each wait at a point until all N arrive, then proceed together (reusable)",
    explanation: "A mutual rendezvous: all N release together; cyclic/reusable for repeated phases." }),
  pm({ topicId: "lld_m20_t4", exerciseId: "lld_m20_t4_pm_3", position: 3, level: "hard", title: "Key difference",
    scenario: "The main difference between a latch and a barrier is…",
    options: ["Latch: one-shot, some threads wait for others' events; Barrier: reusable, threads wait for each other", "There is none", "Latch is faster", "Barrier can't block"], correct: "Latch: one-shot, some threads wait for others' events; Barrier: reusable, threads wait for each other",
    explanation: "Latch = asymmetric one-shot wait-for-events; barrier = symmetric reusable mutual rendezvous." }),
  // Lock-free stack
  pm({ topicId: "lld_m20_t5", exerciseId: "lld_m20_t5_pm_1", position: 1, level: "hard", title: "Coordinate without locks",
    scenario: "A lock-free stack coordinates threads using…",
    options: ["An atomic compare-and-swap (CAS) retry loop on the head pointer", "A mutex around push/pop", "A condition variable", "A semaphore"], correct: "An atomic compare-and-swap (CAS) retry loop on the head pointer",
    explanation: "Read head, prepare new head, CAS; on failure (another thread won) re-read and retry — no locks." }),
  pm({ topicId: "lld_m20_t5", exerciseId: "lld_m20_t5_pm_2", position: 2, level: "hard", title: "The infamous bug",
    scenario: "The classic lock-free pitfall where head goes A→B→A and CAS wrongly succeeds is…",
    options: ["The ABA problem (fix: tagged/hazard pointers)", "A deadlock", "A race on a lock", "Priority inversion"], correct: "The ABA problem (fix: tagged/hazard pointers)",
    explanation: "CAS checks only the value; A→B→A looks unchanged but the structure changed — tag the pointer with a version." }),
  pm({ topicId: "lld_m20_t5", exerciseId: "lld_m20_t5_pm_3", position: 3, level: "medium", title: "When to use",
    scenario: "Lock-free structures are…",
    options: ["Subtle and rarely necessary — a simple lock is often fine at low contention", "Always better than locks", "Free of all bugs", "Required for any concurrency"], correct: "Subtle and rarely necessary — a simple lock is often fine at low contention",
    explanation: "Lock-free shines under high contention but is hard to get right; prefer a lock unless you've measured a need." }),
  // Token bucket
  pm({ topicId: "lld_m20_t6", exerciseId: "lld_m20_t6_pm_1", position: 1, level: "medium", title: "Allow bursts",
    scenario: "The token bucket allows bursts while bounding the average rate by…",
    options: ["Holding up to capacity tokens; each request takes one, refilled at a fixed rate", "Counting requests per fixed window", "Queuing everything", "Rejecting all but one per second"], correct: "Holding up to capacity tokens; each request takes one, refilled at a fixed rate",
    explanation: "You can spend up to capacity at once (burst); refill rate bounds the long-run average." }),
  pm({ topicId: "lld_m20_t6", exerciseId: "lld_m20_t6_pm_2", position: 2, level: "hard", title: "Refill trick",
    scenario: "Tokens are refilled without a background thread by…",
    options: ["Lazily computing elapsed × rate on each request (using a last-refill timestamp)", "A timer thread adding tokens", "Refilling on a cron", "Never refilling"], correct: "Lazily computing elapsed × rate on each request (using a last-refill timestamp)",
    explanation: "Compute the bucket's current tokens on demand from elapsed time — cheap, accurate, no scheduler." }),
  pm({ topicId: "lld_m20_t6", exerciseId: "lld_m20_t6_pm_3", position: 3, level: "medium", title: "vs fixed window",
    scenario: "Token bucket beats a fixed-window limiter because fixed window…",
    options: ["Allows a 2× burst straddling the window boundary", "Is more accurate", "Allows no requests", "Needs no state"], correct: "Allows a 2× burst straddling the window boundary",
    explanation: "End-of-window + start-of-next can both pass the full limit; token bucket smooths this." }),
  // Dining philosophers
  pm({ topicId: "lld_m20_t7", exerciseId: "lld_m20_t7_pm_1", position: 1, level: "hard", title: "Why deadlock",
    scenario: "Naive 'pick up left fork then right' deadlocks because of…",
    options: ["Circular wait (all hold left, all wait for right)", "Too few forks", "Slow philosophers", "Starvation"], correct: "Circular wait (all hold left, all wait for right)",
    explanation: "Everyone holding one fork and waiting for another forms a cycle — the circular-wait deadlock condition." }),
  pm({ topicId: "lld_m20_t7", exerciseId: "lld_m20_t7_pm_2", position: 2, level: "hard", title: "General fix",
    scenario: "The cleanest, most general fix is…",
    options: ["Resource ordering — always acquire the lower-numbered fork first (breaks circular wait)", "Add more forks", "Make philosophers eat faster", "Use a bigger table"], correct: "Resource ordering — always acquire the lower-numbered fork first (breaks circular wait)",
    explanation: "Consistent global lock/resource ordering prevents cycles — the general lesson for acquiring multiple locks." }),
  pm({ topicId: "lld_m20_t7", exerciseId: "lld_m20_t7_pm_3", position: 3, level: "medium", title: "The real lesson",
    scenario: "Deadlock is impossible if you break which condition (among Coffman's four)?",
    options: ["Any one of them (mutual exclusion / hold-and-wait / no preemption / circular wait)", "All four at once", "None — deadlock is inevitable", "Only mutual exclusion"], correct: "Any one of them (mutual exclusion / hold-and-wait / no preemption / circular wait)",
    explanation: "All four are required simultaneously; breaking any single one prevents deadlock." }),
  // Actor system
  pm({ topicId: "lld_m20_t8", exerciseId: "lld_m20_t8_pm_1", position: 1, level: "hard", title: "No locks",
    scenario: "How does the actor model avoid locks entirely?",
    options: ["Actors share no state; communicate only by messages, processing one at a time", "It uses very fast locks", "It disables threads", "It copies all memory"], correct: "Actors share no state; communicate only by messages, processing one at a time",
    explanation: "No shared mutable state + one-message-at-a-time processing removes the need for locks by design." }),
  pm({ topicId: "lld_m20_t8", exerciseId: "lld_m20_t8_pm_2", position: 2, level: "medium", title: "Mailbox",
    scenario: "An actor processes messages from its mailbox…",
    options: ["One at a time, sequentially (so its state is safe)", "All concurrently", "In random order with locks", "Only on shutdown"], correct: "One at a time, sequentially (so its state is safe)",
    explanation: "Sequential single-message processing means only the actor touches its state, never concurrently." }),
  pm({ topicId: "lld_m20_t8", exerciseId: "lld_m20_t8_pm_3", position: 3, level: "medium", title: "Faults",
    scenario: "The actor model handles failures via…",
    options: ["Supervision hierarchies + 'let it crash' (supervisor restarts the actor)", "Try/catch everywhere", "Ignoring crashes", "Shared error flags"], correct: "Supervision hierarchies + 'let it crash' (supervisor restarts the actor)",
    explanation: "Let a faulty actor crash; its supervisor restarts/escalates — failures isolated (no shared state to corrupt)." }),
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
  const totals = await recomputeLldTotals();
  console.log(`\nDone — M20 Concurrency in Depth seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
