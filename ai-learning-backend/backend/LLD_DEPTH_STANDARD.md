# LLD — Topic Depth Standard

> Same rationale as `SD_DEPTH_STANDARD.md`: the `pro_lld` track hit topic-COUNT
> parity with AlgoMaster (172 vs 173) while depth per topic was never gated.
> Count parity ≠ depth parity. This standard defines **depth** for LLD topics and
> `config/auditLldDepth.mjs` gates "done" on it.

## Definition of a DEEP LLD case-study topic

A case-study topic (one that designs a system/class — Parking Lot, Chess,
LRU Cache, …) is **DEEP** only when its `teaching.blocks` cover the full
LLD-interview framework, each block tagged with a `section` key:

| `section` value | Must contain | Min |
|---|---|---|
| `requirements` | Functional requirements + constraints, explicit | 1 block |
| `entities` | Core entities/classes and their responsibilities | 1 block |
| `design` | Class design narrative — relationships, interfaces, patterns chosen and WHY | 1 block |
| `code` | Working code for the core classes (`kind:"code"`) | 1 block |
| `deep_dive` | A mechanism that carries the real difficulty (concurrency, state machine, algorithm) | **≥ 2 blocks** |
| `tradeoffs` | Alternatives considered, extension points, what breaks at scale | 1 block |

Plus:

- **Real diagram:** `teaching.visual_aid.svg` present and well-formed — a UML-style
  class/relationship diagram (boxes + relations), not a text flow.
- **Word count:** total teaching prose **≥ 1,000 words** (target 1,800+).
- **Exercises:** **≥ 3** well-formed graded exercises on the topic.
- **Framing kept:** `hook`, `interviewRelevance`, `commonGaps` (≥ 3) present.

## Scope

Applies to **case-study topics** (tagged `case-study`, or named "Design a …" /
game/system names). Pattern/principle topics (Singleton, SOLID, …) are concept
topics held to a lighter bar (≥ 4 blocks, ≥ 600 words, a visual aid, ≥ 2 exercises)
and reported separately.

## How "done" is gated

`node config/auditLldDepth.mjs` (npm run audit:lld-depth) enumerates every
case-study topic and prints `deep/total` + per-topic missing pieces. PARTIAL
(started but incomplete) is a hard FAIL. Deepen in batches like
`seed:sysd-depth-*` did; verify each batch with `--require id,id,…`.
