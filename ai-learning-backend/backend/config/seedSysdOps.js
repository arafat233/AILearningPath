/**
 * Seed — System Design module M7: Deployment, Observability & Security (breadth
 * parity with AlgoMaster's Deployment + Observability + Advanced Security).
 * Extends pro_sysd. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdOps.js   ·   npm: npm run seed:sysd-ops
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m7";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 7,
  name: "Deployment, Observability & Security", slug: "ops-security",
  description: "Running systems safely in production: CI/CD and release strategies (blue-green, canary, feature flags), the three pillars of observability (logs, metrics, traces), encryption & secrets, authentication/authorization (OAuth/JWT/SSO/RBAC), and defending against common web attacks.",
  estimatedHours: 4, prerequisites: ["sysd_m1"], status: "live",
};

const T = (id, n, name, slug, tags, hookQ, hookI, blocks, rel, gaps, diff, flow) => {
  const t = {
    trackKey: TRACK_KEY, moduleId: MODULE_ID, topicId: id, topicNumber: n, name, slug,
    metadata: { estimated_minutes: 30, difficulty: 3, prerequisites: [], tags },
    hook: { question: hookQ, insight: hookI }, teaching: { blocks },
    interviewRelevance: rel, commonGaps: { gaps },
    prerequisites: [], estimatedMinutes: 30, difficulty: diff, xpReward: 55, visualizer: null,
  };
  if (flow) t.teaching.visual_aid = { type: flow.type, description: flow.description, alt_text: flow.alt };
  return t;
};

const TOPICS = [
  T("sysd_m7_t1", 1, "Deployment & Release Strategies", "sysd-deployment",
    ["deployment", "ci-cd", "blue-green", "canary"],
    "You're pushing a risky change to 10M users. How do you ship it so that if it breaks, only 1% notice and you can undo it in seconds?",
    "CI/CD automates build→test→deploy. Release strategies control the blast radius: rolling (replace instances gradually), blue-green (two full environments, flip traffic, instant rollback), canary (send 1% → watch metrics → ramp). Feature flags decouple deploy from release so you can turn a feature on/off without redeploying.",
    [
      { kind: "concept", heading: "CI/CD",
        body: "Continuous Integration: every commit is automatically built and tested (catch breakage early). Continuous Delivery/Deployment: passing builds are automatically released to staging/production. The pipeline (GitHub Actions, Jenkins, GitLab CI) is the gate — tests, linting, security scans — before code reaches users. This is the 'how does code get to prod safely and often' answer." },
      { kind: "concept", heading: "Rolling vs blue-green vs canary",
        body: "ROLLING: replace instances a few at a time (no extra hardware, but a bad version is briefly live alongside the old, and rollback is slow). BLUE-GREEN: run two identical environments; deploy to the idle one, smoke-test, then flip the load balancer — instant cutover AND instant rollback (flip back), at 2× infra cost. CANARY: route a small % of traffic to the new version, watch error rate/latency, then ramp to 100% (or auto-rollback) — best blast-radius control, needs good metrics + traffic splitting." },
      { kind: "concept", heading: "Feature flags",
        body: "A feature flag gates code behind a runtime toggle, so DEPLOY (ship the code, dark) is decoupled from RELEASE (turn it on). Benefits: ship incomplete features safely, enable per-cohort (gradual rollout / A-B tests), and kill a misbehaving feature instantly WITHOUT a redeploy. The cost: flag debt — old flags must be cleaned up." },
      { kind: "concept", heading: "Rollback is the real requirement",
        body: "The point of all of this is fast, safe recovery. Blue-green gives instant rollback (flip back); canary limits who's exposed; flags let you disable a feature in seconds. In an interview, when asked 'how do you deploy?', the senior answer pairs a strategy (usually canary or blue-green) with a rollback plan and the metrics that trigger it." },
    ],
    "Deployment strategy is a standard ops follow-up. Map blast-radius needs to a strategy (canary for risky changes, blue-green for instant rollback) and mention feature flags decoupling deploy from release.",
    ["Not knowing the difference between blue-green (instant rollback, 2× infra) and canary (gradual, metric-gated).",
     "Treating deploy and release as the same thing (feature flags separate them).",
     "Describing a deploy with no rollback plan or trigger metrics."],
    0.4, { type: "Canary release", description: "Flow: Deploy new version → route 1% traffic → watch error rate/latency → ramp to 100% (or auto-rollback). Feature flags can gate the feature independently.", alt: "New version gets 1% canary traffic, monitored, then ramped or rolled back." }),

  T("sysd_m7_t2", 2, "Observability: Logs, Metrics, Traces", "sysd-observability",
    ["observability", "logging", "metrics", "tracing"],
    "A request is slow somewhere across 30 microservices. Which service? Which call? Without observability you're blind — what three signals make a system observable?",
    "The three pillars: LOGS (discrete, timestamped events — what happened), METRICS (numeric time-series, aggregated — how much/how fast), and TRACES (the path of one request across services — where the time went). Together they let you detect, diagnose, and alert.",
    [
      { kind: "concept", heading: "The three pillars",
        body: "LOGS: structured, timestamped event records ('order 42 failed: timeout') — great for forensics on a specific incident; high volume, so sample/centralize them (ELK, Loki). METRICS: cheap numeric time-series (QPS, p99 latency, error rate, CPU) aggregated for dashboards and alerts (Prometheus, Grafana). TRACES: follow ONE request as it hops across services via a propagated trace-id, showing the latency contribution of each span (Jaeger, OpenTelemetry) — the only way to find 'which of 30 services is slow'." },
      { kind: "concept", heading: "Correlation is the magic",
        body: "Each pillar alone is limited; together they're powerful. A metric alert fires (p99 spiked) → you open the trace for a slow request to see WHICH span is slow → you read that service's logs (filtered by the same trace-id) for the exact error. Propagating a correlation/trace ID through every call is what stitches the three together — design for it from the start." },
      { kind: "concept", heading: "SLIs, SLOs, and alerting",
        body: "An SLI is a measured indicator (e.g. % of requests under 200ms); an SLO is the target (99.9% of requests < 200ms); an SLA is the contractual promise (with penalties). Alert on SYMPTOMS users feel (error rate, latency SLO burn) — not on every CPU blip — to avoid alert fatigue. Define what 'healthy' means numerically, then alert when you're burning the error budget." },
    ],
    "Observability is a senior must-have. Name the three pillars (logs/metrics/traces), explain correlation via a trace-id, and mention SLI/SLO-based alerting on user-facing symptoms.",
    ["Listing only logging; missing metrics and distributed tracing.",
     "No correlation/trace ID, so the three pillars can't be tied together.",
     "Alerting on causes (CPU) instead of user-facing symptoms (latency/error SLOs)."],
    0.4, null),

  T("sysd_m7_t3", 3, "Encryption & Secrets", "sysd-encryption-secrets",
    ["security", "tls", "encryption", "secrets"],
    "Data flies across the internet and sits in databases that could be stolen. How do you protect it both in motion and at rest — and where do you keep the keys?",
    "Encrypt in transit (TLS — already covered for HTTPS) AND at rest (the database/disk is encrypted so a stolen drive is useless). Store passwords as salted hashes (never plaintext, never reversible encryption). Keep keys and credentials in a secrets manager, not in code or env files in the repo.",
    [
      { kind: "concept", heading: "In transit vs at rest",
        body: "IN TRANSIT: TLS encrypts data on the wire (HTTPS, encrypted DB connections) so eavesdroppers see ciphertext. AT REST: the stored data (DB files, disks, backups, object storage) is encrypted with keys, so a stolen disk or leaked backup is unreadable. Production needs BOTH — TLS alone doesn't protect a dumped database." },
      { kind: "concept", heading: "Symmetric vs asymmetric (just enough)",
        body: "Symmetric (AES): one shared key, fast — used to encrypt the bulk data. Asymmetric (RSA/ECC): a public/private key pair — used to exchange the symmetric key and to authenticate (certificates). TLS uses asymmetric crypto for the handshake/key exchange, then symmetric for the session (best of both)." },
      { kind: "concept", heading: "Passwords: hash, don't encrypt",
        body: "NEVER store passwords in plaintext or with reversible encryption. Store a SALTED HASH using a slow, purpose-built algorithm (bcrypt, scrypt, Argon2). Salt (a unique random per-user value) defeats rainbow tables; the deliberate slowness defeats brute force. On login you hash the input and compare — you never decrypt, because there's nothing to decrypt." },
      { kind: "concept", heading: "Secrets management",
        body: "API keys, DB passwords, and encryption keys must NOT live in source code or committed env files. Use a secrets manager (HashiCorp Vault, AWS Secrets Manager, KMS) that stores them encrypted, rotates them, and audits access; apps fetch them at runtime with a scoped identity. Rotating a leaked key then becomes a config change, not a code change." },
    ],
    "Security basics come up as 'how do you protect the data?'. The signal: encrypt in transit AND at rest, hash passwords with bcrypt/Argon2 (never encrypt them), and keep secrets in a manager — not in the repo.",
    ["Encrypting in transit (TLS) but forgetting encryption at rest.",
     "Encrypting passwords (reversible) instead of salted-hashing them.",
     "Hard-coding API keys/secrets in source or committed .env files."],
    0.5, null),

  T("sysd_m7_t4", 4, "Authentication & Authorization", "sysd-authn-authz",
    ["security", "oauth", "jwt", "sso", "rbac"],
    "AuthN vs AuthZ: one asks 'who are you?', the other 'what are you allowed to do?'. Across many services and a 'Login with Google' button, how does it all work?",
    "Authentication proves identity (login); authorization decides permissions (RBAC). Sessions (server-stored) vs JWT (stateless, signed token the client carries) are the two ways to maintain a logged-in state. OAuth2/OIDC powers 'Login with X' and delegated access; SSO/SAML federates identity across apps; RBAC/ABAC models who-can-do-what.",
    [
      { kind: "concept", heading: "AuthN vs AuthZ",
        body: "AUTHENTICATION (AuthN) = verifying identity ('prove you're Ada' — password, OTP, passkey). AUTHORIZATION (AuthZ) = deciding what an authenticated identity may do ('Ada is an admin, so she can delete'). They're distinct steps and often distinct systems; conflating them is a classic mistake." },
      { kind: "concept", heading: "Sessions vs JWT",
        body: "SESSION: on login the server creates a session record (in Redis/DB) and gives the client an opaque session-id cookie; every request looks it up. Easy to revoke, but stateful (needs a shared session store to scale horizontally). JWT: the server issues a SIGNED token containing claims (user id, roles, expiry); the client sends it and the server VERIFIES the signature without a lookup — stateless and scale-friendly, but hard to revoke before expiry (mitigate with short lifetimes + refresh tokens). Choose per need: revocation/simplicity → sessions; stateless scale/microservices → JWT." },
      { kind: "concept", heading: "OAuth2 / OIDC & SSO",
        body: "OAuth2 is a DELEGATED AUTHORIZATION framework: 'Login with Google' lets your app get a scoped token to act on the user's behalf WITHOUT seeing their Google password. OpenID Connect (OIDC) adds an identity layer on top (who the user is). SSO (often via SAML in enterprises, or OIDC) lets one login work across many apps — authenticate once at the identity provider, get tokens for each service." },
      { kind: "concept", heading: "RBAC vs ABAC",
        body: "RBAC (Role-Based Access Control): permissions attach to ROLES, users get roles (admin/editor/viewer) — simple, the common default. ABAC (Attribute-Based): decisions use attributes/policies ('a manager in the EU region during business hours') — more flexible, more complex. In a design, gate actions at the API gateway/service boundary using the identity's roles/claims." },
    ],
    "Auth is asked in almost every design with users. Separate AuthN from AuthZ, contrast sessions vs JWT (revocation vs stateless scale), and know OAuth2/OIDC = 'Login with X' + RBAC for permissions.",
    ["Conflating authentication (who) with authorization (what allowed).",
     "Not knowing JWT is stateless-but-hard-to-revoke vs sessions easy-to-revoke-but-stateful.",
     "Thinking OAuth2 is authentication — it's delegated authorization (OIDC adds identity)."],
    0.5, null),

  T("sysd_m7_t5", 5, "Common Web Attacks & Defenses", "sysd-web-attacks",
    ["security", "owasp", "xss", "sqli", "ddos"],
    "Attackers will probe your system. What are the handful of attacks every engineer must defend against — and the standard defenses?",
    "The OWASP staples: SQL injection (parameterize queries), XSS (escape/encode output, CSP), CSRF (anti-CSRF tokens, SameSite cookies), and broken auth (covered earlier). Plus infrastructure-level: DDoS (rate limiting, WAF, CDN absorption) and never trusting client input.",
    [
      { kind: "concept", heading: "Injection (SQLi) & XSS",
        body: "SQL INJECTION: untrusted input concatenated into a query lets an attacker run their own SQL — defend with PARAMETERIZED queries / prepared statements (never string-build SQL) and least-privilege DB accounts. XSS (Cross-Site Scripting): attacker-supplied script runs in another user's browser — defend by ESCAPING/encoding output for its context, a Content-Security-Policy, and treating all user input as untrusted. The root cause of both: mixing untrusted data with code." },
      { kind: "concept", heading: "CSRF",
        body: "Cross-Site Request Forgery tricks a logged-in user's browser into making an unwanted state-changing request (the browser auto-sends their cookie). Defend with anti-CSRF tokens (a secret the attacker's site can't read), SameSite cookies, and requiring a custom header for state-changing calls. (This project's API sends an x-csrf-token header for exactly this.)" },
      { kind: "concept", heading: "DDoS & abuse",
        body: "Distributed Denial of Service floods you with traffic. Defenses layer up: a CDN/edge absorbs volume, a WAF (web application firewall) filters malicious patterns, RATE LIMITING throttles per-IP/user/endpoint (see the rate-limiter case study), and autoscaling + load shedding keep the core alive. You can't prevent traffic, so you absorb, filter, and throttle." },
      { kind: "concept", heading: "The mindset: never trust input, defense in depth",
        body: "Two principles cover most of it: (1) NEVER TRUST CLIENT INPUT — validate/escape everything server-side (the client can be bypassed). (2) DEFENSE IN DEPTH — no single control is enough; layer TLS + auth + input validation + rate limiting + least privilege + monitoring, so one failure isn't catastrophic. Reference OWASP Top 10 as the checklist." },
    ],
    "Security attacks appear as 'how do you secure this?'. Name SQLi (parameterize), XSS (escape + CSP), CSRF (tokens + SameSite), and DDoS (CDN/WAF/rate-limit), plus 'never trust client input + defense in depth'.",
    ["Building SQL by string concatenation instead of parameterized queries.",
     "Trusting client-side validation alone (it can be bypassed).",
     "Treating one defense as sufficient instead of layering (defense in depth)."],
    0.5, null),
];

const EXERCISES = [
  // T1 deployment
  pm({ topicId: "sysd_m7_t1", exerciseId: "sysd_m7_t1_pm_1", position: 1, level: "medium",
    title: "Instant rollback",
    scenario: "You want to flip to a new version instantly and roll back instantly if it breaks, accepting 2× infra. Which strategy?",
    options: ["Blue-green", "Rolling", "Canary", "Big-bang"], correct: "Blue-green",
    explanation: "Blue-green keeps two full environments; flip the LB to cut over, flip back to roll back — instant, at 2× infra cost." }),
  pm({ topicId: "sysd_m7_t1", exerciseId: "sysd_m7_t1_pm_2", position: 2, level: "medium",
    title: "Limit blast radius",
    scenario: "A risky change should reach 1% of users first while you watch error/latency, then ramp. Which strategy?",
    options: ["Canary", "Blue-green", "Rolling", "Recreate"], correct: "Canary",
    explanation: "Canary routes a small % to the new version, monitors metrics, then ramps or auto-rolls-back — best blast-radius control." }),
  pm({ topicId: "sysd_m7_t1", exerciseId: "sysd_m7_t1_pm_3", position: 3, level: "medium",
    title: "Deploy ≠ release",
    scenario: "You want to ship code dark and turn the feature on later (or off instantly) without redeploying. What enables this?",
    options: ["Feature flags", "Blue-green", "A bigger pipeline", "Sharding"], correct: "Feature flags",
    explanation: "Feature flags decouple deploy from release — toggle features at runtime, enabling gradual rollout and instant kill-switch." }),
  // T2 observability
  pm({ topicId: "sysd_m7_t2", exerciseId: "sysd_m7_t2_pm_1", position: 1, level: "easy",
    title: "The three pillars",
    scenario: "Which trio are the three pillars of observability?",
    options: ["Logs, metrics, traces", "CPU, RAM, disk", "Auth, cache, queue", "Build, test, deploy"], correct: "Logs, metrics, traces",
    explanation: "Logs (events), metrics (numeric time-series), and traces (per-request path) together make a system observable." }),
  pm({ topicId: "sysd_m7_t2", exerciseId: "sysd_m7_t2_pm_2", position: 2, level: "medium",
    title: "Which service is slow?",
    scenario: "A request is slow across 30 microservices and you must find the exact slow hop. Which signal?",
    options: ["A distributed trace (spans per service)", "A single log line", "CPU metric", "The deploy log"], correct: "A distributed trace (spans per service)",
    explanation: "A trace follows one request across services via a trace-id, showing each span's latency — the only way to pinpoint the slow hop." }),
  pm({ topicId: "sysd_m7_t2", exerciseId: "sysd_m7_t2_pm_3", position: 3, level: "medium",
    title: "Alert on what?",
    scenario: "To avoid alert fatigue, you should primarily alert on…",
    options: ["User-facing symptoms (error rate, latency/SLO burn)", "Every CPU spike", "Each log line", "Disk reaching 50%"], correct: "User-facing symptoms (error rate, latency/SLO burn)",
    explanation: "Alert on symptoms users feel (SLO burn, errors, latency), not on every internal cause — that's how you avoid noise." }),
  // T3 encryption
  pm({ topicId: "sysd_m7_t3", exerciseId: "sysd_m7_t3_pm_1", position: 1, level: "medium",
    title: "Protect a stolen backup",
    scenario: "TLS protects data in transit. What protects a stolen database backup?",
    options: ["Encryption at rest", "More TLS", "A firewall", "Rate limiting"], correct: "Encryption at rest",
    explanation: "Encryption at rest makes stolen disks/backups unreadable; TLS only protects data on the wire — you need both." }),
  pm({ topicId: "sysd_m7_t3", exerciseId: "sysd_m7_t3_pm_2", position: 2, level: "medium",
    title: "Storing passwords",
    scenario: "How should user passwords be stored?",
    options: ["Salted hash with bcrypt/Argon2", "AES-encrypted (reversible)", "Plaintext behind a firewall", "Base64-encoded"], correct: "Salted hash with bcrypt/Argon2",
    explanation: "Passwords are salted-hashed with a slow algorithm (bcrypt/scrypt/Argon2) — never encrypted (reversible) or plaintext." }),
  pm({ topicId: "sysd_m7_t3", exerciseId: "sysd_m7_t3_pm_3", position: 3, level: "medium",
    title: "Where do API keys live?",
    scenario: "Where should production API keys and DB credentials be stored?",
    options: ["A secrets manager (Vault/AWS Secrets Manager/KMS)", "In source code", "In a committed .env file", "In the frontend bundle"], correct: "A secrets manager (Vault/AWS Secrets Manager/KMS)",
    explanation: "Secrets belong in a manager that encrypts, rotates, and audits them — never in code or committed env files." }),
  // T4 authn/authz
  pm({ topicId: "sysd_m7_t4", exerciseId: "sysd_m7_t4_pm_1", position: 1, level: "easy",
    title: "AuthN vs AuthZ",
    scenario: "'Is this user allowed to delete the post?' is a question of…",
    options: ["Authorization", "Authentication", "Encryption", "Rate limiting"], correct: "Authorization",
    explanation: "Authorization = what an identity may do. Authentication = proving who they are." }),
  pm({ topicId: "sysd_m7_t4", exerciseId: "sysd_m7_t4_pm_2", position: 2, level: "hard",
    title: "Stateless auth at scale",
    scenario: "You want auth that any service can verify WITHOUT a shared session lookup. What fits (with its trade-off)?",
    options: ["JWT — stateless/signed, but hard to revoke before expiry", "Server sessions — stateless and instantly revocable", "Basic auth on every call", "OAuth scopes only"], correct: "JWT — stateless/signed, but hard to revoke before expiry",
    explanation: "A signed JWT is verified locally (stateless, scales), but can't be revoked early — mitigate with short TTLs + refresh tokens." }),
  pm({ topicId: "sysd_m7_t4", exerciseId: "sysd_m7_t4_pm_3", position: 3, level: "medium",
    title: "'Login with Google'",
    scenario: "'Login with Google' so your app acts for the user without seeing their Google password is powered by…",
    options: ["OAuth2 / OpenID Connect", "SAML only", "RBAC", "A session cookie"], correct: "OAuth2 / OpenID Connect",
    explanation: "OAuth2 is delegated authorization; OIDC adds identity — together they power third-party login without sharing the password." }),
  // T5 attacks
  pm({ topicId: "sysd_m7_t5", exerciseId: "sysd_m7_t5_pm_1", position: 1, level: "medium",
    title: "Stop SQL injection",
    scenario: "The primary defense against SQL injection is…",
    options: ["Parameterized queries / prepared statements", "Escaping HTML", "A CAPTCHA", "Rate limiting"], correct: "Parameterized queries / prepared statements",
    explanation: "Parameterized queries separate data from code so input can't alter the SQL — the root fix for injection." }),
  pm({ topicId: "sysd_m7_t5", exerciseId: "sysd_m7_t5_pm_2", position: 2, level: "medium",
    title: "Stop CSRF",
    scenario: "Which combination defends against CSRF?",
    options: ["Anti-CSRF tokens + SameSite cookies", "Parameterized queries", "Encryption at rest", "A bigger cache"], correct: "Anti-CSRF tokens + SameSite cookies",
    explanation: "CSRF is defeated by a secret token the attacker's page can't read, plus SameSite cookies / required custom headers." }),
  pm({ topicId: "sysd_m7_t5", exerciseId: "sysd_m7_t5_pm_3", position: 3, level: "hard",
    title: "Absorb a DDoS",
    scenario: "Which layered approach best mitigates a DDoS flood?",
    options: ["CDN/edge absorption + WAF + rate limiting + autoscaling", "A stronger password hash", "Parameterized queries", "More database replicas only"], correct: "CDN/edge absorption + WAF + rate limiting + autoscaling",
    explanation: "You can't stop traffic, so absorb it at the edge (CDN), filter (WAF), throttle (rate limiting), and scale/shed — defense in depth." }),
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
  console.log(`\nDone — M7 Ops/Security seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
