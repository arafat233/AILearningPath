/**
 * Seed — System Design module M22: Networking & Security Infrastructure:
 * DNS Service, Load Balancer (L4/L7), DDoS Protection, WAF, Certificate
 * Authority/PKI, Key Management Service (KMS), Zero-Trust/VPN, Cloud Pub/Sub.
 * Extends pro_sysd. Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases17.js   ·   npm: npm run seed:sysd-cases17
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m22";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 22,
  name: "Networking & Security Infrastructure", slug: "networking-security-infra",
  description: "Eight networking and security infrastructure designs: a DNS service, a load balancer, DDoS protection, a web application firewall, a certificate authority/PKI, a key-management service, zero-trust access, and a cloud pub/sub service.",
  estimatedHours: 5, prerequisites: ["sysd_m1", "sysd_m2"], status: "live",
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
  T("sysd_m22_t1", 1, "Design a DNS Service", "design-dns-service",
    ["case-study", "dns", "hierarchy", "caching"],
    "Build authoritative DNS at scale: resolve billions of name→IP lookups/day with very low latency and high availability. How does the lookup work, what makes it fast, and how do you survive being a prime DDoS target?",
    "DNS is a hierarchical, globally-distributed lookup: a resolver walks root → TLD → AUTHORITATIVE servers to resolve a name (then CACHES the answer per TTL — caching is what makes it fast). Run authoritative servers on ANYCAST (same IP from many PoPs → nearest + DDoS absorption) with heavy replication. Records (A/AAAA/CNAME/MX/NS) map names to data; low TTLs trade freshness for cache load.",
    [
      { kind: "concept", heading: "Hierarchical resolution",
        body: "DNS resolves a name to data (usually an IP) through a HIERARCHY: a recursive RESOLVER queries a ROOT server (→ which TLD server handles .com), then the TLD server (→ which AUTHORITATIVE server handles example.com), then the authoritative server (→ the actual A record). This delegation by zone is what lets DNS scale to the whole internet without any single server knowing everything. An authoritative DNS service answers for the zones it owns." },
      { kind: "concept", heading: "Caching makes it fast",
        body: "The internet would melt if every lookup walked the full hierarchy, so CACHING is central: resolvers (and OS/browser) cache answers for the record's TTL. Most queries are served from cache, never reaching authoritative servers. TTL is the key knob: low TTL = fresher (faster failover/changes) but more load on authoritative + resolvers; high TTL = less load but slower to propagate changes. This caching layer is why DNS is both fast and globally scalable." },
      { kind: "concept", heading: "Anycast + availability",
        body: "Authoritative DNS must be HIGHLY available (if DNS is down, your whole service is unreachable) and low-latency globally. Use ANYCAST: announce the same nameserver IPs from MANY PoPs worldwide via BGP; queries route to the NEAREST PoP (low latency) and a failed PoP simply drops out of routing (resilience). Replicate zone data to all PoPs. Anycast also helps absorb DDoS (spread across many PoPs). UDP is the default transport (fast; falls back to TCP for large responses / DNSSEC)." },
      { kind: "concept", heading: "Records, security & follow-ups",
        body: "Records: A/AAAA (IPv4/IPv6), CNAME (alias), MX (mail), NS (delegation), TXT (verification/SPF). DNS is a prime DDoS target (amplification attacks); defend with anycast capacity, rate limiting, and response-rate limiting. DNSSEC signs records to prevent spoofing/cache-poisoning. Follow-ups: 'GeoDNS / latency-based routing (overlaps GSLB)', 'DNS-based load balancing', 'propagation delay = TTL', 'why UDP'. Signal: hierarchical delegated resolution + TTL caching (the scalability key) + anycast authoritative servers (low latency, HA, DDoS absorption) + record types + DNSSEC.",
      },
    ],
    "A DNS service tests hierarchical delegated resolution (root→TLD→authoritative), TTL CACHING as the scalability key (most queries never reach authoritative), and anycast authoritative servers for low latency + HA + DDoS absorption. Records map names to data; DNSSEC prevents spoofing. Propagation delay = TTL.",
    ["Ignoring caching/TTL — the mechanism that makes DNS scale (most lookups are cache hits).",
     "Not using anycast for authoritative servers (low-latency, HA, DDoS absorption).",
     "Forgetting DNS is a prime DDoS/amplification target needing defenses + DNSSEC against spoofing."],
    0.6, { type: "DNS resolution", description: "Resolver → Root (→ .com TLD) → TLD (→ authoritative NS) → Authoritative (A record). Answer cached per TTL (most queries = cache hits). Authoritative servers on ANYCAST (nearest PoP, HA, DDoS spread). DNSSEC signs records.", alt: "DNS: hierarchical root→TLD→authoritative resolution with TTL caching on anycast servers." }),

  T("sysd_m22_t2", 2, "Design a Load Balancer", "design-load-balancer-internals",
    ["case-study", "load-balancing", "l4-l7", "health-checks"],
    "Build the load balancer that distributes traffic across backend servers. What's the difference between L4 and L7 balancing, how does it pick a backend, and how does it avoid sending traffic to dead servers?",
    "A load balancer distributes requests across a backend POOL. L4 (transport) balances by IP/port — fast, connection-level, protocol-agnostic; L7 (application) parses HTTP — can route by path/host/cookie and do TLS termination (richer, costlier). It picks backends via an ALGORITHM (round-robin, least-connections, hashing). HEALTH CHECKS remove unhealthy backends. The LB itself must be HA (redundant) since it's a SPOF + bottleneck.",
    [
      { kind: "concept", heading: "What it does",
        body: "A load balancer sits in front of a POOL of backend servers and DISTRIBUTES incoming requests across them — enabling horizontal scale, high availability (route around dead servers), and even load. Clients hit the LB's address; the LB forwards to a chosen backend. It's a fundamental building block; the design questions are at-which-layer, by-what-algorithm, and how-to-detect-failures." },
      { kind: "concept", heading: "L4 vs L7 (the key distinction)",
        body: "LAYER 4 (transport): balances by IP + PORT, forwarding TCP/UDP connections without inspecting payload — very fast, protocol-agnostic, connection-level (a connection sticks to one backend). LAYER 7 (application): parses the HTTP request, so it can route by PATH/HOST/HEADER/COOKIE, terminate TLS, do content-based routing and sticky sessions, modify headers — far richer but more CPU per request. Choose L4 for raw throughput/non-HTTP, L7 for smart HTTP routing (often both: L4 in front of L7)." },
      { kind: "concept", heading: "Selection algorithms",
        body: "How the LB picks a backend: ROUND-ROBIN (rotate evenly), LEAST-CONNECTIONS (send to the least-busy — better under uneven request costs), WEIGHTED (bigger servers get more), IP/consistent HASH (sticky — same client → same backend, for session affinity or cache locality). The algorithm trades simplicity vs awareness of actual backend load. Connection draining lets a backend finish in-flight requests before removal." },
      { kind: "concept", heading: "Health checks, HA & follow-ups",
        body: "HEALTH CHECKS are essential: the LB probes each backend (TCP connect / HTTP /health) and removes unhealthy ones from rotation, re-adding on recovery — so traffic never goes to dead servers. The LB is itself a SPOF + potential bottleneck, so it must be HIGHLY AVAILABLE (active-passive with a floating/virtual IP + failover, or active-active behind anycast/DNS — the GSLB layer above). Follow-ups: 'sticky sessions vs stateless', 'TLS termination', 'L4+L7 together', 'hardware vs software (HAProxy/Envoy/nginx) vs cloud LB'. Signal: backend pool + L4 (fast, connection-level) vs L7 (HTTP-aware routing) + selection algorithm (round-robin/least-conn/hash) + health checks (remove dead) + LB-is-HA.",
      },
    ],
    "A load balancer tests distributing traffic across a backend pool: L4 (fast, connection-level, IP/port) vs L7 (HTTP-aware — route by path/host/cookie, TLS termination), a selection algorithm (round-robin/least-connections/hash), health checks to remove dead backends, and making the LB itself HA (it's a SPOF). L4-vs-L7 is the defining distinction.",
    ["Not distinguishing L4 (connection-level, fast) from L7 (HTTP-aware routing, TLS).",
     "No health checks — sending traffic to dead backends.",
     "Treating the LB as a single point of failure without making it HA."],
    0.5, { type: "Load balancer", description: "Clients → LB → backend pool. L4: forward by IP/port (fast, connection-level). L7: parse HTTP → route by path/host/cookie, TLS term. Algorithm: round-robin / least-connections / hash (sticky). Health checks remove dead backends. LB is HA (redundant/floating IP).", alt: "Load balancer: L4 vs L7 distribution over a health-checked backend pool, itself made HA." }),

  T("sysd_m22_t3", 3, "Design a DDoS Protection System", "design-ddos-protection",
    ["case-study", "security", "mitigation", "scrubbing"],
    "Build protection against distributed denial-of-service attacks that flood a service with traffic from many sources. You can't just block one IP. How do you absorb/filter massive malicious traffic while letting legitimate users through?",
    "Defense in depth: ABSORB volume with massive distributed CAPACITY (anycast + CDN spread the flood across many PoPs), DETECT attacks via traffic anomaly analysis, then FILTER/SCRUB malicious traffic (rate limiting, signatures, challenges, blocklists) as close to the edge/source as possible — distinguishing bots from humans (the bot-detection ideas). Different attack types (volumetric / protocol / application-layer) need different defenses; the goal is to drop bad traffic while passing good.",
    [
      { kind: "concept", heading: "The problem & attack types",
        body: "A DDoS attack floods a target with traffic from MANY distributed sources (a botnet) to exhaust its capacity, so blocking a single IP is useless. Attacks come in layers: VOLUMETRIC (raw bandwidth flood — UDP/amplification, saturate the pipe), PROTOCOL (exhaust connection state — SYN floods), and APPLICATION-LAYER (L7 — many 'valid-looking' requests to expensive endpoints, hardest to distinguish from real users). Each needs a different defense; the overall goal is to keep the service available for legitimate users." },
      { kind: "concept", heading: "Absorb with capacity",
        body: "The first line is having far MORE CAPACITY than any attacker can muster, spread out: ANYCAST + a global CDN/edge network means the attack is DISTRIBUTED across hundreds of PoPs rather than hitting one datacenter — no single point is overwhelmed (the same anycast property as DNS). Large scrubbing providers (Cloudflare, AWS Shield) have terabits of capacity precisely to absorb volumetric floods. Absorption buys time to filter." },
      { kind: "concept", heading: "Detect + filter (scrubbing)",
        body: "DETECT via traffic ANOMALY analysis (sudden spikes, unusual patterns, geographic/protocol anomalies — ML baselines). Then FILTER/SCRUB: drop traffic matching attack SIGNATURES, RATE-LIMIT per source, BLOCKLIST known-bad IPs/networks, and for L7 floods, CHALLENGE suspicious requests (CAPTCHA / JS challenge / proof-of-work — the bot-detection design) to separate bots from humans. Do this as close to the EDGE/source as possible (drop bad traffic before it reaches origin). The hard part is precision — minimize blocking legitimate users (false positives) while dropping the flood." },
      { kind: "concept", heading: "Architecture & follow-ups",
        body: "Traffic flows through scrubbing/edge infrastructure that filters before forwarding clean traffic to origin (origin IP hidden/protected). Always-on vs on-demand (reroute to scrubbing when an attack is detected, e.g. BGP rerouting). Follow-ups: 'L7 vs volumetric defenses', 'false positives (legit users blocked)', 'amplification reflection attacks', 'rate limiting (the m1 design) as one layer'. Signal: distributed absorption (anycast/CDN capacity) + anomaly detection + edge filtering/scrubbing (signatures, rate limits, challenges, blocklists) + per-attack-type defenses; keep good traffic flowing while dropping the flood close to the source.",
      },
    ],
    "DDoS protection tests defense-in-depth: absorb volume via distributed anycast/CDN capacity (no single point overwhelmed), detect via traffic anomaly analysis, and filter/scrub malicious traffic (signatures, rate limits, challenges, blocklists) at the edge — with different defenses for volumetric/protocol/application-layer attacks. Precision (dropping bad, passing good) is the crux.",
    ["Trying to block a single IP — DDoS comes from many distributed sources.",
     "No absorption capacity (anycast/CDN) to spread/withstand volumetric floods.",
     "One-size defense — volumetric, protocol, and L7 attacks need different mitigations; ignoring false positives."],
    0.6, { type: "DDoS mitigation", description: "Flood (botnet) → edge/scrubbing network: ABSORB via anycast/CDN capacity (distributed, no single overwhelm) → DETECT anomalies → FILTER (signatures, rate-limit, blocklist, L7 challenges) → forward CLEAN traffic to (hidden) origin. Per-attack-type (volumetric/protocol/L7) defenses.", alt: "DDoS protection: distributed absorption then edge detection and scrubbing before clean traffic reaches origin." }),

  T("sysd_m22_t4", 4, "Design a Web Application Firewall (WAF)", "design-waf",
    ["case-study", "security", "rules", "inspection"],
    "Build a WAF that inspects HTTP requests and blocks application-layer attacks (SQL injection, XSS, etc.) before they reach your app. How does it decide what's malicious, and what's the precision challenge?",
    "A WAF sits at the edge (L7) inspecting each HTTP request against RULES — signature/pattern matching for known attack payloads (SQLi, XSS, path traversal — e.g. OWASP Core Rule Set), plus anomaly scoring and rate/behavior rules. Malicious requests are BLOCKED/challenged before reaching the app. The crux is PRECISION (false positives block legit users; false negatives let attacks through) — tune rules, use detection vs blocking modes, and keep rules updated.",
    [
      { kind: "concept", heading: "What a WAF does",
        body: "A Web Application Firewall sits at LAYER 7 (in front of the app / at the edge — often part of the CDN/reverse-proxy or LB) and INSPECTS each HTTP request (and sometimes response): URL, headers, query params, body, cookies. It applies RULES to decide if the request looks malicious, and BLOCKS (or challenges/logs) those — protecting against application-layer attacks the network firewall can't see. It's a focused security filter for web traffic, distinct from volumetric DDoS defense." },
      { kind: "concept", heading: "How it detects attacks",
        body: "Detection methods: (1) SIGNATURE / pattern matching against known attack payloads — SQL injection (' OR 1=1), XSS (<script>), path traversal (../), command injection — using curated rule sets like the OWASP Core Rule Set; (2) ANOMALY scoring (request deviates from normal — too many params, abnormal sizes); (3) behavioral/rate rules and reputation. A request accumulating enough 'suspicion' is blocked. Positive (allowlist) vs negative (blocklist) security models trade strictness vs maintenance." },
      { kind: "concept", heading: "The precision challenge (the crux)",
        body: "The hard part is PRECISION. FALSE POSITIVES block legitimate users/requests (a user's comment containing 'select' or '<' wrongly flagged) — very damaging to UX/business. FALSE NEGATIVES let real attacks through. Mitigate by: running in DETECTION/log-only mode first to tune rules before enforcing, anomaly thresholds, per-app exceptions/tuning, and continuously updating rules for new attack patterns. This false-positive-vs-negative balance (the recurring security trade) defines WAF operation." },
      { kind: "concept", heading: "Deployment & follow-ups",
        body: "Deployed inline at the edge (cloud WAF / CDN-integrated, or a reverse-proxy module like ModSecurity). Must add minimal LATENCY (it's on every request's hot path). Combine with rate limiting, bot management (bot-detection design), and DDoS protection as layered edge security. Follow-ups: 'managed rule sets + custom rules', 'WAF bypass/evasion (encoding tricks)', 'virtual patching (block an exploit before the app is fixed)', 'detection vs blocking mode'. Signal: L7 request inspection + rule-based detection (signatures/OWASP CRS + anomaly scoring) + block/challenge malicious requests + tune for precision (false-positive vs negative) + updated rules; edge-deployed, low-latency.",
      },
    ],
    "A WAF tests L7 request inspection against rules (signature/pattern matching for SQLi/XSS/etc. via OWASP CRS + anomaly scoring) to block application-layer attacks at the edge, where the crux is PRECISION — tuning to avoid false positives (blocking legit users) and false negatives (missed attacks), often starting in detection mode. It's a low-latency edge security layer.",
    ["No tuning / running straight in blocking mode — false positives block legitimate users.",
     "Relying on signatures alone (evasion via encoding) without anomaly scoring / updated rules.",
     "Ignoring the latency budget (a WAF is on every request) or treating it as DDoS/volumetric defense."],
    0.5, { type: "WAF", description: "HTTP request → WAF (edge, L7): inspect URL/headers/params/body → rules (signatures: SQLi/XSS/traversal via OWASP CRS + anomaly score) → block/challenge if malicious, else forward to app. Tune for precision (FP vs FN); detection mode first; rules updated.", alt: "WAF: edge L7 inspection of HTTP requests against attack-signature and anomaly rules." }),

  T("sysd_m22_t5", 5, "Design a Certificate Authority / PKI", "design-certificate-authority",
    ["case-study", "pki", "trust", "revocation"],
    "Build a system like Let's Encrypt that issues TLS certificates at massive scale. How does a certificate establish trust, how do you prove domain ownership before issuing, and how are compromised certs revoked?",
    "A CA issues digitally SIGNED certificates binding a domain to a public key; clients trust them via a CHAIN up to a ROOT CA in the trust store. Before issuing, VALIDATE control of the domain (ACME challenge: prove you control the domain via DNS/HTTP). Protect the signing KEY (HSM — it's the root of all trust). Handle REVOCATION (CRL / OCSP / short-lived certs) for compromised certs. It's trust + validation + key protection + revocation at scale.",
    [
      { kind: "concept", heading: "Certificates & the chain of trust",
        body: "A TLS CERTIFICATE binds a DOMAIN to a PUBLIC KEY, digitally SIGNED by a Certificate Authority. Browsers/clients trust a certificate if it CHAINS up to a ROOT CA already in their trust store (root → intermediate → leaf). So when you visit https://site, the cert proves 'this public key belongs to site' because a trusted CA vouched for it (signed it). The CA's job is to issue these trustworthy bindings — its signature IS the trust." },
      { kind: "concept", heading: "Domain validation before issuance (the crux)",
        body: "A CA must NOT issue a cert for a domain to someone who doesn't control it (or the whole trust model collapses). So before issuing, VALIDATE control: Let's Encrypt uses the ACME protocol — the requester proves domain control by satisfying a CHALLENGE (place a specific token at http://domain/.well-known/... HTTP-01, or a DNS TXT record DNS-01). Only on passing does the CA issue. Automating this validation + issuance is what let Let's Encrypt issue billions of certs free. Higher assurance (OV/EV) adds organizational vetting." },
      { kind: "concept", heading: "Protecting the signing key",
        body: "The CA's PRIVATE SIGNING KEY is the crown jewel — anyone with it can forge trusted certs for ANY domain. It MUST be protected in an HSM (hardware security module, never extractable), ideally with the root key kept OFFLINE and only intermediate keys used online for signing (so a compromise is contained and the root can re-issue). Strict access control + audit. This key protection is existential for a CA." },
      { kind: "concept", heading: "Revocation & follow-ups",
        body: "If a cert's private key is compromised (or mis-issued), it must be REVOKED before its expiry. Mechanisms: CRL (certificate revocation lists — clients download lists of revoked serials; bulky), OCSP (online status check per cert; adds latency/privacy issues — OCSP stapling mitigates), and the modern trend: SHORT-LIVED certificates (90 days, auto-renewed) so revocation matters less (compromise window is small). Certificate Transparency logs publicly record issued certs (detect mis-issuance). Follow-ups: 'why short-lived', 'CT logs', 'root vs intermediate', 'wildcard/SAN certs'. Signal: signed cert binding domain↔key + chain-to-trusted-root + domain-control validation (ACME challenges) before issuance + HSM-protected signing key (root offline) + revocation (CRL/OCSP/short-lived) + CT logs.",
      },
    ],
    "A CA/PKI tests trust establishment: signed certs binding domain↔public-key that chain to a trusted root, domain-control VALIDATION (ACME HTTP/DNS challenges) before issuance, HSM-protected signing keys (root offline — the existential secret), and revocation (CRL/OCSP, trending to short-lived auto-renewed certs) plus CT logs. Validation-before-issuance and key protection are the crux.",
    ["Issuing a cert without validating domain control (collapses the trust model).",
     "Not protecting the signing key in an HSM / keeping the root offline (forging any cert if leaked).",
     "Ignoring revocation of compromised certs (CRL/OCSP/short-lived) and Certificate Transparency."],
    0.6, { type: "Certificate issuance", description: "Request → VALIDATE domain control (ACME challenge: HTTP token / DNS TXT) → CA signs cert (domain ↔ public key) with HSM-protected key (root offline) → cert chains to trusted root in clients. Revoke via CRL/OCSP or use short-lived auto-renewed certs. CT logs record issuance.", alt: "Certificate Authority: domain-validated, HSM-signed certs chaining to a trusted root, with revocation." }),

  T("sysd_m22_t6", 6, "Design a Key Management Service (KMS)", "design-kms",
    ["case-study", "encryption", "envelope", "key-rotation"],
    "Build a KMS (AWS KMS-style) that manages cryptographic keys for encrypting data across many services — without ever exposing the keys. How do services encrypt large data without the master key leaving the KMS, and how are keys rotated?",
    "ENVELOPE ENCRYPTION: the KMS holds MASTER keys (in HSMs, never exported); to encrypt data, a service asks KMS to generate a DATA key — KMS returns it in plaintext (use once, in memory) PLUS encrypted-by-the-master; the service encrypts data locally with the data key, stores the encrypted data key alongside, and discards the plaintext. To decrypt, send the encrypted data key to KMS to unwrap. Master keys never leave; access is IAM-controlled + fully audited; rotation re-wraps without re-encrypting data.",
    [
      { kind: "concept", heading: "The problem",
        body: "Many services need to encrypt data, but you don't want encryption keys scattered/hardcoded (leaked keys = leaked data) and you can't send a huge dataset to a central service to encrypt. A KMS centrally MANAGES keys — generation, storage, access control, rotation, audit — while ensuring the high-value MASTER keys NEVER leave the KMS (kept in HSMs). The design challenge: let services encrypt arbitrary data without ever exposing or moving the master key." },
      { kind: "concept", heading: "Envelope encryption (the key technique)",
        body: "ENVELOPE ENCRYPTION solves it. The KMS holds MASTER keys (KEKs — key-encryption keys, in HSMs, non-exportable). To encrypt: a service calls KMS GenerateDataKey → KMS creates a fresh DATA key (DEK) and returns BOTH a plaintext copy (used in memory, immediately) AND the DEK ENCRYPTED by the master key. The service encrypts its data LOCALLY with the plaintext DEK, stores the ENCRYPTED DEK alongside the ciphertext, then DISCARDS the plaintext DEK. The master key never left the KMS; only small data keys are wrapped/unwrapped. (This is the same envelope pattern used by the secrets manager.)" },
      { kind: "concept", heading: "Decryption & access control",
        body: "To DECRYPT: the service sends the stored ENCRYPTED data key to KMS Decrypt → KMS unwraps it with the master key (in the HSM) and returns the plaintext data key → the service decrypts its data locally → discards the key. Every KMS operation is gated by fine-grained ACCESS POLICIES (IAM: which principal can use which key for what) and fully AUDITED (who used which key when — critical for compliance and forensics). KMS does the small crypto (wrap/unwrap); services do the bulk crypto." },
      { kind: "concept", heading: "Rotation, availability & follow-ups",
        body: "KEY ROTATION: rotate master keys on a schedule — but you DON'T re-encrypt all data; new data uses the new master, and old encrypted data keys are unwrappable by retaining old master versions (or re-wrapping the small DEKs). This makes rotation cheap (re-wrap keys, not data). The KMS must be HIGHLY AVAILABLE (services can't decrypt anything if it's down) and durable (lose a master key = lose all data encrypted under it). Follow-ups: 'BYOK (bring your own key)', 'per-tenant keys (crypto-shredding for GDPR — the deletion design)', 'HSM clustering', 'KMS vs secrets manager'. Signal: master keys in HSMs (never exported) + envelope encryption (KMS wraps/unwraps small data keys; services do bulk crypto locally) + IAM access policies + full audit + cheap rotation (re-wrap not re-encrypt) + HA/durability.",
      },
    ],
    "A KMS tests envelope encryption: master keys stay in HSMs (never exported) while services encrypt bulk data locally with KMS-generated data keys that are wrapped/unwrapped by the master — so the master never moves. Add IAM access policies, full audit, cheap rotation (re-wrap small keys, not re-encrypt data), and HA/durability. It underpins the secrets-manager and per-tenant crypto-shredding designs.",
    ["Exporting/moving the master key to encrypt data instead of envelope encryption (wrap data keys).",
     "No per-key access policies or audit trail of key usage.",
     "Re-encrypting all data on rotation (instead of re-wrapping data keys), or ignoring KMS availability/durability."],
    0.6, { type: "Envelope encryption", description: "KMS holds master keys (HSM, never exported). Encrypt: GenerateDataKey → plaintext DEK (use in memory) + DEK-wrapped-by-master (store with ciphertext); encrypt data locally; discard plaintext DEK. Decrypt: send wrapped DEK → KMS unwraps → decrypt locally. IAM-gated, audited; rotate by re-wrapping.", alt: "KMS: envelope encryption where master keys stay in HSMs and only small data keys are wrapped/unwrapped." }),

  T("sysd_m22_t7", 7, "Design Zero-Trust Access (BeyondCorp)", "design-zero-trust",
    ["case-study", "security", "identity", "access"],
    "Build modern corporate access (Google BeyondCorp-style): employees access internal apps securely from anywhere, without a traditional VPN perimeter. Why abandon 'trust the internal network', and what replaces the perimeter?",
    "ZERO TRUST: 'never trust, always verify' — trust no network location; instead authenticate and authorize EVERY request based on strong IDENTITY (user + device), regardless of where it comes from. An identity-aware PROXY/gateway sits in front of every app, checking the user (SSO/MFA), the DEVICE posture (managed, patched, healthy), and policy on each access — granting least-privilege access to specific apps, not the whole network. The network perimeter is replaced by per-request identity verification.",
    [
      { kind: "concept", heading: "Why kill the perimeter",
        body: "The traditional model: a VPN puts you 'inside' the corporate network, and internal services TRUST anyone inside (a hard shell, soft center). Problem: once an attacker is inside (phished credential, compromised device), they have broad lateral access; and it doesn't fit remote work / cloud / BYOD. ZERO TRUST abandons 'trust by network location' entirely — the internal network is treated as just as hostile as the internet. 'Never trust, always verify.'" },
      { kind: "concept", heading: "Identity + device, every request",
        body: "Instead of network location, access decisions are based on strong IDENTITY and CONTEXT, checked on EVERY request: WHO (authenticated user — SSO + MFA, the identity-provider design), WHAT DEVICE (is it managed, encrypted, patched, healthy — device posture/attestation), and the policy for the specific resource. There's no 'inside' — every access to every app is independently authenticated and authorized. Continuous verification, not one-time VPN login." },
      { kind: "concept", heading: "Identity-aware proxy",
        body: "The architectural piece: an IDENTITY-AWARE PROXY / access gateway sits in front of internal apps (no app is directly reachable; the perimeter moves to the proxy). Each request hits the proxy → it verifies user identity + device trust + policy → grants access to that SPECIFIC app only if allowed (LEAST PRIVILEGE — access an app, not the network). Apps can stay oblivious (the proxy enforces). This replaces the VPN: users reach apps through the proxy from anywhere, securely." },
      { kind: "concept", heading: "Policy, micro-segmentation & follow-ups",
        body: "Fine-grained POLICY engine decides access per (user, device, app, context) — e.g. 'engineers on managed laptops can reach the deploy tool; contractors cannot'. MICRO-SEGMENTATION limits lateral movement (each service requires its own auth). Continuous monitoring re-evaluates trust (revoke if device falls out of compliance). Follow-ups: 'zero trust vs VPN', 'device attestation', 'least privilege', 'SASE/ZTNA products'. Signal: never-trust-network + per-request authn/authz on identity (SSO/MFA) + device posture + identity-aware proxy in front of every app (least-privilege app access, not network access) + policy engine + micro-segmentation.",
      },
    ],
    "Zero-trust access tests replacing the network perimeter with per-request identity verification: never trust network location, authenticate/authorize every request on strong identity (SSO/MFA) + device posture via an identity-aware proxy that grants least-privilege access to specific apps (not the whole network). It defeats lateral movement and fits remote/cloud/BYOD; it builds on the SSO/identity-provider design.",
    ["Trusting the internal network (VPN-inside model) — enabling broad lateral movement once breached.",
     "One-time login instead of verifying identity + device posture on every request.",
     "Granting network access instead of least-privilege access to specific apps via an identity-aware proxy."],
    0.6, { type: "Zero trust", description: "No trusted network. Every request → identity-aware proxy: verify user (SSO+MFA) + device posture (managed/patched) + policy for that specific app → grant least-privilege access to THAT app only (not the network). Continuous re-evaluation; micro-segmentation limits lateral movement.", alt: "Zero-trust access: an identity-aware proxy verifying user + device per request for least-privilege app access." }),

  T("sysd_m22_t8", 8, "Design a Cloud Pub/Sub Messaging Service", "design-cloud-pubsub",
    ["case-study", "messaging", "push", "decoupling"],
    "Build a managed pub/sub service (Google Pub/Sub / AWS SNS+SQS): publishers send messages to TOPICS, and many subscribers receive them, decoupled and at scale — including PUSH delivery to HTTP endpoints. How does it differ from the Kafka log, and how is at-least-once + ordering handled?",
    "Publishers publish to a TOPIC; each SUBSCRIPTION gets its own copy of matching messages (fan-out). Delivery is PUSH (the service POSTs to subscriber endpoints) or PULL, with at-least-once semantics → ACK on success, REDELIVER (with backoff) until acked, then DEAD-LETTER. Unlike a Kafka log (consumers track offsets in a retained log), this is a managed broker that tracks per-message ack state per subscription. Decouples producers from consumers elastically.",
    [
      { kind: "concept", heading: "Topics, subscriptions, fan-out",
        body: "Publishers send messages to a TOPIC without knowing the consumers. Each SUBSCRIPTION attached to the topic receives its OWN independent copy of every message (fan-out — multiple services can each process all messages). This decouples producers from consumers (add/remove subscribers freely) and absorbs load spikes (the broker buffers). It's the messaging backbone for event-driven architectures — publish once, deliver to many." },
      { kind: "concept", heading: "Push vs pull delivery",
        body: "Two delivery modes. PULL: subscribers request (pull) messages when ready (they control pace; good for high-throughput workers — like a queue). PUSH: the service actively POSTs each message to a subscriber's HTTP endpoint (a webhook-style delivery — good for serverless/event-driven, no consumer to run continuously). Push is a key differentiator from raw Kafka (where consumers always pull). The service handles flow control / backoff for push." },
      { kind: "concept", heading: "Delivery guarantees & acks",
        body: "Delivery is typically AT-LEAST-ONCE: the broker delivers a message and waits for an ACK; if not acked within a deadline (consumer crashed/slow), it REDELIVERS (with backoff) — so consumers must be IDEMPOTENT (duplicates happen). After max attempts, route to a DEAD-LETTER topic for inspection. The broker tracks per-message ACK STATE PER SUBSCRIPTION (unlike Kafka's consumer-tracked offsets over a retained log) — this is a managed-broker model vs a log model. Exactly-once and ordering (per ordering-key) are optional, costlier features." },
      { kind: "concept", heading: "vs Kafka & follow-ups",
        body: "KAFKA = a partitioned, retained LOG; consumers track OFFSETS and can replay; strong per-partition ordering; you run/scale it. CLOUD PUB/SUB = a managed BROKER; tracks per-message acks; native PUSH delivery; elastic/serverless; ordering is opt-in per key; messages typically dropped after ack (no long replay by default). Choose pub/sub for managed fan-out + push + elasticity, Kafka for replay/ordering/streaming. Follow-ups: 'message filtering per subscription', 'ordering keys', 'exactly-once', 'flow control', 'when Kafka vs Pub/Sub'. Signal: topic→subscriptions fan-out + push & pull delivery + at-least-once with ack/redeliver/dead-letter (idempotent consumers) + per-subscription ack tracking (managed broker, not a replayable log); decouples producers/consumers elastically.",
      },
    ],
    "A cloud pub/sub service tests managed fan-out messaging: publish to a topic, each subscription gets its own copy, delivered by PUSH (POST to endpoints) or PULL, at-least-once with ack/redeliver-with-backoff/dead-letter (idempotent consumers), and per-subscription ack tracking — a managed-broker model vs Kafka's retained replayable log. Push delivery + elasticity are the differentiators.",
    ["Conflating it with Kafka — pub/sub is a managed broker (per-message acks, push) not a replayable offset log.",
     "Ignoring at-least-once semantics — consumers must be idempotent; provide redelivery + dead-letter.",
     "No push-delivery option (the key differentiator) or per-subscription independent fan-out."],
    0.5, { type: "Cloud pub/sub", description: "Publisher → Topic → each Subscription gets its own copy (fan-out). Deliver: PUSH (POST to endpoint) or PULL. At-least-once: deliver → wait ack → redeliver w/ backoff → dead-letter (idempotent consumers). Broker tracks per-message ack per subscription (vs Kafka's retained offset log).", alt: "Cloud pub/sub: topic fan-out to subscriptions with push/pull at-least-once delivery and acks." }),
];

const EXERCISES = [
  // DNS
  pm({ topicId: "sysd_m22_t1", exerciseId: "sysd_m22_t1_pm_1", position: 1, level: "medium", title: "Resolution",
    scenario: "Resolving a name walks…",
    options: ["Root → TLD → authoritative servers (delegated hierarchy)", "A single global server", "An alphabetical index", "The client's hosts file only"], correct: "Root → TLD → authoritative servers (delegated hierarchy)",
    explanation: "DNS delegates by zone: root points to TLD, TLD to authoritative — no server knows everything." }),
  pm({ topicId: "sysd_m22_t1", exerciseId: "sysd_m22_t1_pm_2", position: 2, level: "hard", title: "What makes it scale",
    scenario: "DNS scales to the whole internet primarily because of…",
    options: ["TTL caching (most lookups are cache hits)", "Fast disks", "A huge central database", "Compression"], correct: "TTL caching (most lookups are cache hits)",
    explanation: "Resolvers cache answers per TTL, so most queries never reach authoritative servers." }),
  pm({ topicId: "sysd_m22_t1", exerciseId: "sysd_m22_t1_pm_3", position: 3, level: "medium", title: "HA + DDoS",
    scenario: "Authoritative DNS achieves low latency, HA, and DDoS absorption via…",
    options: ["Anycast (same IP from many PoPs)", "A single big server", "Round-robin DNS only", "TCP only"], correct: "Anycast (same IP from many PoPs)",
    explanation: "Anycast routes to the nearest PoP, drops failed PoPs, and spreads attack traffic." }),
  // Load balancer
  pm({ topicId: "sysd_m22_t2", exerciseId: "sysd_m22_t2_pm_1", position: 1, level: "hard", title: "L4 vs L7",
    scenario: "The key difference between L4 and L7 load balancing is…",
    options: ["L4 forwards by IP/port (fast, connection-level); L7 parses HTTP (route by path/host/cookie, TLS)", "L4 is for HTTP, L7 for TCP", "L7 is always faster", "They're identical"], correct: "L4 forwards by IP/port (fast, connection-level); L7 parses HTTP (route by path/host/cookie, TLS)",
    explanation: "L4 is fast and protocol-agnostic; L7 understands HTTP for content-based routing — at higher CPU cost." }),
  pm({ topicId: "sysd_m22_t2", exerciseId: "sysd_m22_t2_pm_2", position: 2, level: "medium", title: "Avoid dead backends",
    scenario: "The LB avoids sending traffic to dead servers via…",
    options: ["Health checks (remove unhealthy backends from rotation)", "Guessing", "Round-robin only", "Trusting backends"], correct: "Health checks (remove unhealthy backends from rotation)",
    explanation: "Probing backends (TCP/HTTP /health) and removing unhealthy ones keeps traffic on live servers." }),
  pm({ topicId: "sysd_m22_t2", exerciseId: "sysd_m22_t2_pm_3", position: 3, level: "medium", title: "The LB itself",
    scenario: "Since the load balancer is a SPOF, it must be…",
    options: ["Highly available (redundant, floating/virtual IP or active-active)", "A single server", "Stateful per request", "Ignored"], correct: "Highly available (redundant, floating/virtual IP or active-active)",
    explanation: "The LB is a SPOF + bottleneck; run it redundantly (failover or active-active behind anycast/DNS)." }),
  // DDoS
  pm({ topicId: "sysd_m22_t3", exerciseId: "sysd_m22_t3_pm_1", position: 1, level: "medium", title: "Why not block one IP",
    scenario: "You can't stop a DDoS by blocking one IP because…",
    options: ["The flood comes from many distributed sources (a botnet)", "IPs can't be blocked", "It's not really traffic", "Firewalls don't work"], correct: "The flood comes from many distributed sources (a botnet)",
    explanation: "DDoS is distributed across countless sources; defense must absorb/filter at scale, not block one IP." }),
  pm({ topicId: "sysd_m22_t3", exerciseId: "sysd_m22_t3_pm_2", position: 2, level: "hard", title: "Absorb volume",
    scenario: "Volumetric floods are absorbed by…",
    options: ["Distributed anycast/CDN capacity (no single point overwhelmed)", "A bigger origin server", "Turning off the site", "A single firewall"], correct: "Distributed anycast/CDN capacity (no single point overwhelmed)",
    explanation: "Spreading traffic across hundreds of PoPs (anycast/CDN) absorbs floods no single datacenter could." }),
  pm({ topicId: "sysd_m22_t3", exerciseId: "sysd_m22_t3_pm_3", position: 3, level: "hard", title: "Hardest layer",
    scenario: "Application-layer (L7) DDoS is hardest because…",
    options: ["Requests look valid — distinguishing bots from real users is the challenge (challenges/scrubbing)", "It uses the most bandwidth", "It's encrypted", "It's rare"], correct: "Requests look valid — distinguishing bots from real users is the challenge (challenges/scrubbing)",
    explanation: "L7 floods mimic real requests; mitigate with challenges/rate-limits (bot detection), minimizing false positives." }),
  // WAF
  pm({ topicId: "sysd_m22_t4", exerciseId: "sysd_m22_t4_pm_1", position: 1, level: "medium", title: "What it blocks",
    scenario: "A WAF protects against…",
    options: ["Application-layer attacks (SQLi, XSS, traversal) by inspecting HTTP requests", "Volumetric bandwidth floods", "DNS spoofing", "Disk failures"], correct: "Application-layer attacks (SQLi, XSS, traversal) by inspecting HTTP requests",
    explanation: "A WAF inspects L7 requests against attack signatures (OWASP CRS) + anomaly rules and blocks malicious ones." }),
  pm({ topicId: "sysd_m22_t4", exerciseId: "sysd_m22_t4_pm_2", position: 2, level: "hard", title: "The crux",
    scenario: "The main operational challenge of a WAF is…",
    options: ["Precision — false positives block legit users; false negatives let attacks through", "Storage", "Network speed", "Choosing a database"], correct: "Precision — false positives block legit users; false negatives let attacks through",
    explanation: "Tune rules (start in detection mode) to balance blocking attacks vs blocking legitimate traffic." }),
  pm({ topicId: "sysd_m22_t4", exerciseId: "sysd_m22_t4_pm_3", position: 3, level: "medium", title: "Roll out safely",
    scenario: "Before enforcing, a WAF should run in…",
    options: ["Detection/log-only mode to tune rules and measure false positives", "Full blocking immediately", "Off", "Random mode"], correct: "Detection/log-only mode to tune rules and measure false positives",
    explanation: "Detection mode reveals false positives so you can tune before blocking real users." }),
  // CA / PKI
  pm({ topicId: "sysd_m22_t5", exerciseId: "sysd_m22_t5_pm_1", position: 1, level: "hard", title: "Before issuing",
    scenario: "Before issuing a cert for a domain, a CA must…",
    options: ["Validate the requester controls the domain (ACME HTTP/DNS challenge)", "Charge a fee", "Check the IP geolocation", "Nothing"], correct: "Validate the requester controls the domain (ACME HTTP/DNS challenge)",
    explanation: "Domain-control validation prevents issuing certs to imposters; ACME automates HTTP-01/DNS-01 challenges." }),
  pm({ topicId: "sysd_m22_t5", exerciseId: "sysd_m22_t5_pm_2", position: 2, level: "medium", title: "Trust",
    scenario: "A certificate is trusted by a client because…",
    options: ["It chains up to a root CA in the client's trust store", "It looks official", "It's encrypted", "It has a long expiry"], correct: "It chains up to a root CA in the client's trust store",
    explanation: "The chain root→intermediate→leaf, anchored to a trusted root, is what establishes trust." }),
  pm({ topicId: "sysd_m22_t5", exerciseId: "sysd_m22_t5_pm_3", position: 3, level: "hard", title: "Compromised cert",
    scenario: "A compromised cert before expiry is handled by…",
    options: ["Revocation (CRL/OCSP) — or use short-lived auto-renewed certs", "Waiting for expiry only", "Nothing", "Re-issuing the root"], correct: "Revocation (CRL/OCSP) — or use short-lived auto-renewed certs",
    explanation: "CRL/OCSP revoke certs; short-lived certs shrink the compromise window (the modern trend). Protect the signing key in an HSM." }),
  // KMS
  pm({ topicId: "sysd_m22_t6", exerciseId: "sysd_m22_t6_pm_1", position: 1, level: "hard", title: "Encrypt big data",
    scenario: "A service encrypts large data without the master key leaving the KMS via…",
    options: ["Envelope encryption (KMS generates a data key; service encrypts locally; stores the wrapped data key)", "Sending all data to the KMS", "Exporting the master key", "Hashing"], correct: "Envelope encryption (KMS generates a data key; service encrypts locally; stores the wrapped data key)",
    explanation: "The master key wraps small data keys; bulk crypto happens locally — the master never moves." }),
  pm({ topicId: "sysd_m22_t6", exerciseId: "sysd_m22_t6_pm_2", position: 2, level: "medium", title: "Master keys",
    scenario: "KMS master keys are…",
    options: ["Held in HSMs and never exported", "Returned to clients on request", "Stored in plaintext config", "Shared widely"], correct: "Held in HSMs and never exported",
    explanation: "Non-exportable HSM-held master keys are the root of trust; only data keys are wrapped/unwrapped." }),
  pm({ topicId: "sysd_m22_t6", exerciseId: "sysd_m22_t6_pm_3", position: 3, level: "medium", title: "Rotation",
    scenario: "Rotating a master key…",
    options: ["Re-wraps data keys / uses new key for new data — no re-encrypting all data", "Requires re-encrypting all data", "Is impossible", "Deletes all data"], correct: "Re-wraps data keys / uses new key for new data — no re-encrypting all data",
    explanation: "Cheap rotation: new master for new data, retain old versions to unwrap old data keys (re-wrap, not re-encrypt)." }),
  // Zero trust
  pm({ topicId: "sysd_m22_t7", exerciseId: "sysd_m22_t7_pm_1", position: 1, level: "hard", title: "The core idea",
    scenario: "Zero trust replaces the network perimeter with…",
    options: ["Per-request authn/authz on identity + device (never trust network location)", "A bigger VPN", "Trusting the internal network more", "IP allowlists only"], correct: "Per-request authn/authz on identity + device (never trust network location)",
    explanation: "'Never trust, always verify' — every request is verified on identity + device, regardless of network." }),
  pm({ topicId: "sysd_m22_t7", exerciseId: "sysd_m22_t7_pm_2", position: 2, level: "medium", title: "The architecture",
    scenario: "Access to internal apps is mediated by…",
    options: ["An identity-aware proxy in front of every app (least-privilege per app)", "Direct network access once on VPN", "A shared admin login", "Public endpoints"], correct: "An identity-aware proxy in front of every app (least-privilege per app)",
    explanation: "The proxy verifies user + device + policy and grants access to a specific app, not the network." }),
  pm({ topicId: "sysd_m22_t7", exerciseId: "sysd_m22_t7_pm_3", position: 3, level: "medium", title: "Why ditch VPN",
    scenario: "The VPN 'trust the internal network' model is risky because…",
    options: ["Once inside, an attacker has broad lateral access (soft center)", "VPNs are slow", "It's too secure", "It encrypts too much"], correct: "Once inside, an attacker has broad lateral access (soft center)",
    explanation: "A breached credential/device inside the perimeter gets wide access; zero trust + micro-segmentation limits this." }),
  // Cloud pub/sub
  pm({ topicId: "sysd_m22_t8", exerciseId: "sysd_m22_t8_pm_1", position: 1, level: "hard", title: "vs Kafka",
    scenario: "How does cloud pub/sub differ from a Kafka log?",
    options: ["Managed broker tracking per-message acks + push delivery (vs Kafka's retained, replayable offset log)", "It's the same", "It can't fan out", "It has no subscribers"], correct: "Managed broker tracking per-message acks + push delivery (vs Kafka's retained, replayable offset log)",
    explanation: "Pub/sub is a managed broker (per-message acks, native push); Kafka is a retained log with consumer offsets/replay." }),
  pm({ topicId: "sysd_m22_t8", exerciseId: "sysd_m22_t8_pm_2", position: 2, level: "medium", title: "Push delivery",
    scenario: "Push subscriptions deliver messages by…",
    options: ["The service POSTing each message to the subscriber's HTTP endpoint", "The subscriber polling a log", "Email", "Shared memory"], correct: "The service POSTing each message to the subscriber's HTTP endpoint",
    explanation: "Push (POST to endpoint) suits serverless/event-driven consumers; pull lets workers control their pace." }),
  pm({ topicId: "sysd_m22_t8", exerciseId: "sysd_m22_t8_pm_3", position: 3, level: "medium", title: "Delivery guarantee",
    scenario: "With at-least-once delivery, consumers must be…",
    options: ["Idempotent (redelivery causes duplicates) — ack on success, dead-letter after max retries", "Exactly-once for free", "Stateless and orderless", "Single-threaded"], correct: "Idempotent (redelivery causes duplicates) — ack on success, dead-letter after max retries",
    explanation: "Unacked messages are redelivered (with backoff); consumers dedupe; give-ups go to a dead-letter topic." }),
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
  console.log(`\nDone — M22 Networking & Security Infra seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
