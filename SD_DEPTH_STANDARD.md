# System Design — Topic Depth Standard

> **Why this exists.** The `pro_sysd` track was built to *topic-count* parity
> ("179 topics > AlgoMaster's 177") — a **count** metric. A user comparing the
> actual articles found ours far thinner in explanation: ~500 words of prose +
> a multiple-choice quiz per topic, **0 real diagrams**, and no
> capacity/API/schema scaffolding — vs AlgoMaster's ~4,500–5,000-word
> illustrated articles. Count parity ≠ depth parity. This standard defines
> **depth** as the bar, and `config/auditSysdDepth.mjs` **gates "done" on it** so
> the drift cannot silently recur.

## Definition of a DEEP System-Design case-study topic

A case-study topic (one that designs a system — URL shortener, chat, feed, …) is
**DEEP** only when its `teaching.blocks` cover the full interview framework, each
block tagged with a `section` key (preserved because `teaching` is Mixed; the
frontend renderer ignores the extra key). Required sections:

| `section` value | Must contain | Min |
|---|---|---|
| `requirements` | Functional **and** non-functional requirements, explicit | 1 block |
| `estimation` | Back-of-the-envelope capacity math **with real numbers** (QPS, storage, bandwidth) | 1 block |
| `hld` | High-level design narrative | 1 block |
| `api` | API design — concrete endpoints (HTTP verb + path) | 1 block (`kind:"code"`) |
| `data_model` | Data model / schema — tables/columns or key structure | 1 block (`kind:"code"`) |
| `deep_dive` | Deep dive into a core component / mechanism | **≥ 2 blocks** |
| `bottlenecks` | Bottlenecks, scaling limits, trade-offs | 1 block |

Plus:

- **Real diagram:** `teaching.visual_aid.svg` present and well-formed (balanced
  tags, `<svg …>…</svg>`). A text `description`/flow alone does **not** count for
  a case study — it must have an authored architecture SVG.
- **Word count:** total teaching prose **≥ 1,200 words** (target 2,000+).
- **Exercises:** **≥ 3** exercises on the topic, all well-formed + correctly
  graded (see `auditProGrading`).
- **Framing kept:** `hook`, `interviewRelevance`, and `commonGaps` (≥ 3) present.

## Scope: which topics must be DEEP

Not every one of the 179 topics is a full system design. The standard applies to
**case-study / "Design a …" topics** (tagged `case-study`, or whose name starts
with "Design a"/"Case Study:"). Fundamentals/building-block topics (estimation
theory, CAP, load balancing concept, etc.) are **concept topics** and are held to
a lighter bar (≥ 4 concept blocks, ≥ 600 words, a visual aid, ≥ 2 exercises) — the
audit reports them separately and does **not** require API/schema/SVG on them.

## Build checklist (per case-study topic)

- [ ] `requirements` block — functional list + non-functional qualities (scale, latency, consistency, availability)
- [ ] `estimation` block — users/DAU → QPS (read vs write), storage/yr, bandwidth, with the arithmetic shown
- [ ] `hld` block — components + data flow, paired with the SVG
- [ ] `teaching.visual_aid.svg` — authored architecture diagram (boxes + arrows + labels)
- [ ] `api` block (`kind:"code"`) — the real endpoints
- [ ] `data_model` block (`kind:"code"`) — schema / key design
- [ ] ≥ 2 `deep_dive` blocks — the components that carry the actual difficulty
- [ ] `bottlenecks` block — SPOFs, hot keys, scaling ceilings, the trade-offs
- [ ] ≥ 3 graded exercises
- [ ] hook + interviewRelevance + ≥ 3 commonGaps
- [ ] **`node config/auditSysdDepth.mjs` reports the topic as DEEP**

## How "done" is gated

`done` for a depth task = `auditSysdDepth.mjs` reports the target topics as DEEP
with **0 depth violations**, locally and on prod. The audit enumerates **every**
case-study topic and prints `deep/total` + per-topic missing sections — never a
sample, never a hand tally. Registered in `AUDITS.md`.
