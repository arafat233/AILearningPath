/**
 * Seed — System Design module M18: AI/ML & Data Infrastructure:
 * Vector DB/Semantic Search, RAG Pipeline, LLM Inference Serving, ML Model
 * Registry/Deployment, Distributed Model Training, PII Anonymization Pipeline,
 * Distributed Graph DB, Geo Load Balancing (GSLB). Extends pro_sysd.
 * Idempotent; recomputes totals. All pattern_match.
 * Usage:  node config/seedSysdCases13.js   ·   npm: npm run seed:sysd-cases13
 */
import "dotenv/config";
import mongoose from "mongoose";
import { ProModule, ProTopic, ProExercise } from "../models/proModels.js";
import { recomputeTrackTotals } from "./proTrackTotals.mjs";

const TRACK_KEY = "pro_sysd";
const MODULE_ID = "sysd_m18";
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
  trackKey: TRACK_KEY, moduleId: MODULE_ID, moduleNumber: 18,
  name: "AI/ML & Data Infrastructure", slug: "ai-ml-data-infra",
  description: "Eight modern AI/ML and data-infrastructure designs: a vector database / semantic search, a RAG pipeline, LLM inference serving, an ML model registry & deployment, distributed model training, a PII-anonymization pipeline, a distributed graph database, and geo load balancing.",
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
  T("sysd_m18_t1", 1, "Design a Vector Database / Semantic Search", "design-vector-db",
    ["case-study", "embeddings", "ann", "semantic-search"],
    "Build search by MEANING, not keywords ('find documents similar to this'). Comparing a query embedding to billions of vectors exactly is too slow. What index makes nearest-neighbor search fast, and what's the trade-off?",
    "Encode items as EMBEDDINGS (high-dimensional vectors); similarity = vector distance (cosine/dot). Exact nearest-neighbor over billions is infeasible, so use an APPROXIMATE nearest-neighbor (ANN) index — HNSW (a navigable graph) or IVF/PQ — trading a little recall for huge speed. Shard by vectors, filter by metadata, and (re)build the index as data grows. It powers semantic search and RAG retrieval.",
    [
      { kind: "concept", heading: "Embeddings + similarity",
        body: "Semantic search represents each item (text, image) as an EMBEDDING — a high-dimensional vector from an ML model where SIMILAR meanings map to NEARBY vectors. A query is embedded the same way; finding relevant items = finding the vectors CLOSEST to the query vector (by cosine similarity or dot product). This captures meaning ('car' near 'automobile') unlike keyword matching. The system stores vectors and answers nearest-neighbor queries." },
      { kind: "concept", heading: "Why approximate (ANN)",
        body: "EXACT nearest-neighbor means comparing the query to EVERY stored vector — O(n·d) per query, impossible at billions of high-dimensional vectors (and brute-force distance is expensive). So vector DBs use APPROXIMATE nearest-neighbor (ANN) indexes that return the top-K with high probability while examining a tiny fraction of vectors — trading a small loss of RECALL for orders-of-magnitude speedup. Accepting approximate results is the key design decision (exact isn't needed for relevance)." },
      { kind: "concept", heading: "ANN index structures",
        body: "Common ANN indexes: HNSW (Hierarchical Navigable Small World) — a multi-layer proximity GRAPH you greedily navigate toward the query (fast, high recall, the popular default; note the skip-list-like layered idea); IVF (inverted file) — cluster vectors and search only the nearest clusters; PQ (product quantization) — compress vectors to save memory at some accuracy cost. These build an index so queries skip most of the data — the vector-DB analog of the inverted index for keyword search." },
      { kind: "concept", heading: "Scale, filtering & follow-ups",
        body: "At scale: SHARD vectors across nodes (scatter-gather top-K), keep hot indexes in memory, and combine with METADATA FILTERING (e.g. 'similar AND category=docs AND tenant=X' — pre/post-filter). Index building is expensive (rebuild/incremental on inserts). Follow-ups: 'recall vs latency vs memory tuning', 'hybrid search (vector + keyword/BM25)', 're-ranking the ANN candidates with a heavier model (the retrieval→rank funnel)', 'embedding model drift (re-embed)'. Signal: embeddings + vector-distance similarity + ANN index (HNSW/IVF/PQ, approximate for speed) + sharding + metadata filtering; the engine behind semantic search and RAG.",
      },
    ],
    "A vector DB tests semantic search: embeddings + vector-distance similarity, answered by an APPROXIMATE nearest-neighbor index (HNSW/IVF/PQ — trade a little recall for huge speed vs exact brute force), sharded with metadata filtering. It's the meaning-based analog of the inverted index and the retrieval engine behind RAG; hybrid + re-ranking are follow-ups.",
    ["Doing exact brute-force nearest-neighbor over all vectors instead of an ANN index.",
     "Not knowing ANN trades a little recall for speed (HNSW/IVF/PQ).",
     "Ignoring metadata filtering / sharding / re-embedding when the model changes."],
    0.6, { type: "Vector search", description: "Items → embeddings (vectors). Query → embed → ANN index (HNSW graph / IVF clusters / PQ) returns approximate top-K nearest by cosine/dot (skips most vectors). Sharded scatter-gather; metadata filtering; optional heavier re-rank.", alt: "Vector DB: embeddings indexed by ANN (HNSW/IVF/PQ) for fast approximate nearest-neighbor search." }),

  T("sysd_m18_t2", 2, "Design a RAG Pipeline (LLM Knowledge Base)", "design-rag-pipeline",
    ["case-study", "rag", "retrieval", "llm"],
    "Build a system that answers questions over YOUR private documents using an LLM, without retraining the model and without it hallucinating. How do you ground the LLM in your data?",
    "RETRIEVAL-AUGMENTED GENERATION: offline, CHUNK documents, embed them, and store in a vector DB (the index). At query time, embed the question, RETRIEVE the most relevant chunks (ANN search), build a PROMPT with those chunks as context, and have the LLM GENERATE an answer grounded in them (with citations). It grounds the LLM in current/private data without retraining, reducing hallucination.",
    [
      { kind: "concept", heading: "Why RAG (not retraining / not raw LLM)",
        body: "An LLM alone doesn't know your PRIVATE or CURRENT data and may HALLUCINATE. Fine-tuning/retraining on your docs is expensive, slow to update, and still hallucination-prone. RAG instead RETRIEVES relevant facts at query time and feeds them to the LLM as context — so answers are GROUNDED in your actual documents, update instantly when docs change (just re-index), and can cite sources. It's the standard way to build a Q&A assistant over a knowledge base." },
      { kind: "concept", heading: "Offline: ingest & index",
        body: "Build the knowledge base offline: load documents, CHUNK them into passages (size matters — too big dilutes relevance, too small loses context; overlap helps), EMBED each chunk (an embedding model), and store the vectors + source metadata in a VECTOR DB (the previous design). This index is updated as documents change (re-chunk/re-embed). Chunking strategy strongly affects retrieval quality." },
      { kind: "concept", heading: "Online: retrieve → augment → generate",
        body: "At query time: (1) EMBED the user's question; (2) RETRIEVE the top-K most relevant chunks via ANN search (optionally hybrid keyword+vector, then RE-RANK); (3) AUGMENT — construct a prompt that includes the retrieved chunks as context plus the question; (4) GENERATE — the LLM answers using that context, ideally citing which chunks it used. The retrieved context is what grounds the answer and curbs hallucination." },
      { kind: "concept", heading: "Quality, evaluation & follow-ups",
        body: "RAG quality depends on RETRIEVAL quality (garbage retrieved → garbage answer) — tune chunking, embeddings, top-K, and re-ranking. Guard the CONTEXT WINDOW (can't stuff unlimited chunks — select the best). EVALUATE faithfulness (does the answer stick to retrieved context?) and relevance. Follow-ups: 'citations / source attribution', 'handling no-good-match (say I-don't-know)', 'caching common Q&A', 'multi-hop / agentic retrieval', 'access control on retrieved docs (don't leak)'. Signal: offline chunk+embed+index (vector DB) → online retrieve (ANN, re-rank) → augment prompt with context → LLM generates grounded answer with citations; grounds the LLM without retraining.",
      },
    ],
    "RAG tests grounding an LLM in private/current data without retraining: offline chunk+embed+index documents into a vector DB, then at query time retrieve relevant chunks (ANN + re-rank), augment the prompt with them as context, and have the LLM generate a grounded, cited answer. Retrieval quality drives answer quality; it builds on the vector-DB design.",
    ["Fine-tuning/retraining the model on docs instead of retrieving context at query time.",
     "Ignoring chunking/retrieval quality (bad retrieval → bad answer) or the context-window limit.",
     "No grounding/citations — letting the raw LLM answer (hallucination)."],
    0.6, { type: "RAG pipeline", description: "Offline: docs → chunk → embed → vector DB. Online: question → embed → retrieve top-K chunks (ANN + re-rank) → build prompt with chunks as context → LLM generates grounded answer + citations.", alt: "RAG: offline chunk/embed/index, then retrieve-augment-generate to ground an LLM in your documents." }),

  T("sysd_m18_t3", 3, "Design an LLM Inference Serving Platform", "design-llm-inference",
    ["case-study", "gpu", "batching", "kv-cache"],
    "Serve a large language model to many users with good throughput and latency — on expensive, scarce GPUs. Naively running one request at a time wastes the GPU. What techniques maximize GPU utilization?",
    "LLM inference is GPU-bound and autoregressive (token-by-token). Maximize expensive-GPU throughput with BATCHING (process many requests together — continuous/in-flight batching adds/removes requests per step) and a KV-CACHE (reuse attention keys/values across tokens so each new token is cheap). STREAM tokens to users as generated. Scale across GPUs/replicas with a queue; model sharding for huge models. Throughput vs latency is the core trade.",
    [
      { kind: "concept", heading: "What makes LLM serving special",
        body: "LLM inference is GPU-bound, memory-hungry, and AUTOREGRESSIVE: the model generates one TOKEN at a time, each depending on all previous ones, so a response of N tokens needs N sequential forward passes. GPUs are expensive and scarce, so the whole game is MAXIMIZING GPU UTILIZATION (throughput per GPU) while keeping per-request latency acceptable. Naive one-request-at-a-time serving leaves the GPU massively underused." },
      { kind: "concept", heading: "Batching",
        body: "GPUs are most efficient processing many inputs at once, so BATCH requests together. Static batching (wait to fill a batch) adds latency and wastes slots when requests finish at different times. CONTINUOUS / IN-FLIGHT BATCHING (vLLM/TGI) is the modern technique: dynamically add new requests and evict finished ones from the batch at EACH generation step — keeping the GPU busy with a full batch even as requests start/finish at different times. This dramatically raises throughput." },
      { kind: "concept", heading: "KV-cache",
        body: "Recomputing attention over all previous tokens for every new token would be O(n²) and wasteful. The KV-CACHE stores the attention KEY/VALUE tensors for tokens already processed, so generating the next token only computes the new token's contribution and reuses the cache — making each step cheap. The KV-cache is large (grows with sequence length × batch), so GPU MEMORY management of it (e.g. paged attention) is a central concern and often the capacity bottleneck." },
      { kind: "concept", heading: "Scaling, streaming & follow-ups",
        body: "Front with a QUEUE + scheduler distributing requests across GPU replicas (autoscale on load). For models too big for one GPU, use MODEL PARALLELISM (shard the model across GPUs — tensor/pipeline parallel). STREAM tokens to the user as they're generated (low time-to-first-token; better UX). The core trade is THROUGHPUT (bigger batches) vs LATENCY (smaller batches respond faster). Follow-ups: 'quantization (smaller/faster models)', 'speculative decoding', 'prompt caching', 'cost per token', 'multi-tenancy/fairness'. Signal: GPU-bound autoregressive serving + continuous batching + KV-cache (+ memory mgmt) + token streaming + multi-GPU sharding/queueing; throughput-vs-latency trade.",
      },
    ],
    "LLM inference serving tests maximizing scarce-GPU throughput for autoregressive generation: continuous/in-flight batching (keep the GPU full as requests start/finish), a KV-cache (reuse attention K/V so each token is cheap — with careful GPU-memory management), token streaming, and multi-GPU sharding for huge models behind a queue. Throughput vs latency is the core trade.",
    ["Serving one request at a time (idle GPU) instead of (continuous) batching.",
     "Recomputing attention each token instead of a KV-cache (and ignoring its GPU-memory cost).",
     "Not streaming tokens, or no plan for models bigger than one GPU (model parallelism)."],
    0.6, { type: "LLM serving", description: "Requests → queue → GPU workers. Continuous/in-flight batching keeps the batch full across token-generation steps. KV-cache reuses attention K/V (each new token cheap; manage GPU memory). Tokens streamed to users. Big models sharded across GPUs.", alt: "LLM inference serving: continuous batching and KV-cache on GPUs with token streaming." }),

  T("sysd_m18_t4", 4, "Design an ML Model Registry & Deployment (MLOps)", "design-ml-model-registry",
    ["case-study", "mlops", "versioning", "canary"],
    "Build the system that takes trained models to production: version them, deploy safely, monitor, and roll back. Why is shipping an ML model harder than shipping code, and what guards a bad model?",
    "A MODEL REGISTRY versions models with their metadata (training data, metrics, lineage) for reproducibility. Deployment serves a model behind an API and rolls out SAFELY — shadow/CANARY/A-B with metric checks and instant ROLLBACK. Crucially, MONITOR for DATA & CONCEPT DRIFT (the world changes, so accuracy silently decays) and trigger retraining. It's a lifecycle of versioning + safe rollout + drift monitoring (MLOps).",
    [
      { kind: "concept", heading: "Why ML deployment is harder than code",
        body: "Unlike code, a model's behavior depends on its TRAINING DATA and can degrade silently as the real world shifts — there's no exception, just quietly worse predictions. You also must reproduce results (same data + code + params), compare model versions on metrics, and worry about train/serve consistency (the feature-store skew issue). So MLOps adds versioning of DATA + MODEL + features, metric-gated rollout, and ongoing monitoring on top of normal deployment." },
      { kind: "concept", heading: "The model registry",
        body: "A central MODEL REGISTRY stores trained models as versioned ARTIFACTS with rich metadata: the training dataset version, hyperparameters, evaluation METRICS, lineage (which code/data produced it), and stage (staging/production/archived). This gives reproducibility, audit, and the ability to compare and roll back to a known-good version. The artifact itself (weights) often lives in object storage, referenced by the registry." },
      { kind: "concept", heading: "Safe deployment",
        body: "Don't flip 100% of traffic to a new model. Roll out gradually: SHADOW (run the new model alongside, compare predictions without serving them), CANARY (serve to a small % and watch metrics), or A/B (compare models on business outcomes — the A/B-testing design), with automatic ROLLBACK if metrics regress. Serve behind a stable API (the model can change without clients changing); the inference service (previous topic for LLMs) does the actual serving." },
      { kind: "concept", heading: "Monitoring drift & retraining — follow-ups",
        body: "The ongoing job: MONITOR production. DATA DRIFT (input distribution shifts from training) and CONCEPT DRIFT (the relationship being modeled changes) silently erode accuracy — detect via input/prediction monitoring and (delayed) ground-truth comparison, then trigger RETRAINING (a training pipeline → register new version → re-deploy), closing the loop. Follow-ups: 'feature store integration (consistency)', 'model lineage/governance/compliance', 'cost/latency monitoring', 'rollback automation'. Signal: registry (versioned model+data+metrics, reproducible) + safe rollout (shadow/canary/A-B + auto-rollback) + drift monitoring → retraining loop; the MLOps lifecycle.",
      },
    ],
    "An ML model registry/deployment tests the MLOps lifecycle: version models with data/metrics/lineage (reproducibility) in a registry, deploy safely (shadow/canary/A-B + auto-rollback), and — uniquely vs code — monitor for data/concept DRIFT that silently degrades accuracy, triggering retraining. Models fail quietly, so monitoring + safe rollout are the crux.",
    ["Treating model deployment like code deployment — ignoring data/concept drift (silent decay).",
     "No versioning of data/model/metrics (irreproducible, can't compare or roll back).",
     "Flipping 100% traffic to a new model with no shadow/canary/rollback."],
    0.6, { type: "MLOps lifecycle", description: "Train → register model (version + data + metrics + lineage). Deploy: shadow/canary/A-B with metric checks → promote or auto-rollback → serve behind a stable API. Monitor production for data/concept drift → trigger retraining → register new version (loop).", alt: "ML model registry & deployment: versioned models, canary rollout, and drift-monitoring retraining loop." }),

  T("sysd_m18_t5", 5, "Design Distributed Model Training", "design-distributed-training",
    ["case-study", "data-parallelism", "model-parallelism", "gpu"],
    "Train a large model on huge data faster than one GPU allows. The model might not even fit on one GPU. What are the parallelism strategies, and what's the communication bottleneck?",
    "Two axes of parallelism: DATA PARALLELISM (replicate the model on each GPU, split the data into batches, then SYNCHRONIZE gradients across GPUs each step — all-reduce) scales throughput; MODEL PARALLELISM (split the model itself across GPUs — tensor/pipeline parallel) is needed when the model is too big for one GPU. The bottleneck is GRADIENT/activation COMMUNICATION between GPUs (interconnect bandwidth); checkpointing handles failures.",
    [
      { kind: "concept", heading: "Why distribute",
        body: "Training large models is bottlenecked two ways: TOO MUCH DATA / too slow on one GPU (need more compute), and the MODEL TOO BIG to fit one GPU's memory (need to split it). Distributed training uses many GPUs/nodes to attack both — but introduces COORDINATION and COMMUNICATION costs that don't exist single-GPU. The strategy depends on which bottleneck dominates." },
      { kind: "concept", heading: "Data parallelism",
        body: "DATA PARALLELISM: put a full COPY of the model on each GPU, split the training batch so each GPU processes a different shard, compute gradients locally, then SYNCHRONIZE — average the gradients across all GPUs (an ALL-REDUCE) so every replica updates identically. This scales THROUGHPUT (more data per step) and is the most common approach. The cost: the gradient synchronization each step is communication-heavy (the bottleneck) — large models mean large gradients to exchange." },
      { kind: "concept", heading: "Model parallelism",
        body: "When the model itself doesn't FIT on one GPU, split the MODEL across GPUs: TENSOR parallelism (split individual layers' matrices across GPUs) and PIPELINE parallelism (put different layers on different GPUs, pass activations forward like an assembly line — micro-batching keeps GPUs busy). These let you train models bigger than one GPU's memory but add inter-GPU dependency/communication. Large-model training combines data + tensor + pipeline parallelism (3D parallelism)." },
      { kind: "concept", heading: "Communication, faults & follow-ups",
        body: "The recurring bottleneck is COMMUNICATION between GPUs (gradients in data-parallel, activations in pipeline) — limited by interconnect bandwidth (NVLink/InfiniBand); overlapping computation with communication and gradient compression help. FAULTS: long training runs span days on thousands of GPUs where failures are common → periodic CHECKPOINTING of model state to resume (the workflow/durability idea). Follow-ups: 'sync vs async updates (parameter server)', 'ZeRO/sharded optimizer state (memory)', 'gradient accumulation', 'elastic training'. Signal: data parallelism (replicate + all-reduce gradients, scale throughput) vs model parallelism (tensor/pipeline, fit big models) + communication bottleneck + checkpointing for fault tolerance.",
      },
    ],
    "Distributed training tests parallelism strategy: data parallelism (replicate model, shard data, all-reduce gradients each step — scales throughput) vs model parallelism (tensor/pipeline — fit a model too big for one GPU), with inter-GPU COMMUNICATION (gradients/activations over the interconnect) as the bottleneck and checkpointing for fault tolerance over long runs.",
    ["Not distinguishing data parallelism (more data/throughput) from model parallelism (model too big).",
     "Ignoring the gradient/activation communication bottleneck (interconnect bandwidth).",
     "No checkpointing for long multi-GPU runs where failures are common."],
    0.6, { type: "Training parallelism", description: "Data parallel: model replicated per GPU, batch sharded, gradients averaged via all-reduce each step (scales throughput; comm-heavy). Model parallel: split layers (tensor) / stages (pipeline) across GPUs when model > 1 GPU. Communication = bottleneck; checkpoint to survive failures.", alt: "Distributed training: data parallelism (all-reduce gradients) and model parallelism (tensor/pipeline)." }),

  T("sysd_m18_t6", 6, "Design a PII Anonymization Pipeline", "design-pii-anonymization",
    ["case-study", "privacy", "detection", "transformation"],
    "Build a pipeline that lets you use production data for analytics/testing/ML WITHOUT exposing personal data — detect PII across datasets and transform it so individuals can't be re-identified. Why is masking individual fields often not enough?",
    "DISCOVER PII across data (classifiers + pattern matching find names, emails, SSNs, etc. — including in free text), then apply transformations: MASKING/redaction, TOKENIZATION (reversible mapping), generalization, or pseudonymization. The hard part: anonymization must prevent RE-IDENTIFICATION from combining QUASI-IDENTIFIERS (zip+age+gender can re-identify) — use k-anonymity / differential privacy. Preserve utility while guaranteeing privacy.",
    [
      { kind: "concept", heading: "Discover PII first",
        body: "You can't protect what you haven't found. A PII pipeline first DISCOVERS personal data across datasets: structured columns (flag email/phone/SSN columns by name + value patterns/regex) AND UNSTRUCTURED text (names, addresses buried in free-text fields — needs ML/NER classifiers). Build a data catalog of where PII lives and its sensitivity. Missing PII (especially in free text) is the silent failure — incomplete discovery means leaked data." },
      { kind: "concept", heading: "Transformation techniques",
        body: "Apply the right transform per field/use case: MASKING/redaction (replace with ***), TOKENIZATION (swap with a reversible token via a secure mapping — lets you re-identify if authorized, e.g. payments), PSEUDONYMIZATION (consistent fake id, preserving joins), GENERALIZATION/bucketing (exact age → age range), and SUPPRESSION (drop the field). The choice trades PRIVACY vs UTILITY — masking destroys analytical value; generalization/pseudonymization keep more." },
      { kind: "concept", heading: "The re-identification trap (the core)",
        body: "The subtle, critical point: masking obvious identifiers (name, SSN) is NOT enough — QUASI-IDENTIFIERS can re-identify individuals when combined (the famous result: ZIP + birthdate + gender uniquely identifies most people). True anonymization must defend against this linkage. Techniques: K-ANONYMITY (generalize so each record is indistinguishable from at least k−1 others), l-diversity, and DIFFERENTIAL PRIVACY (add calibrated noise to aggregates so individual presence can't be inferred). This is what separates real anonymization from naive field masking." },
      { kind: "concept", heading: "Pipeline & follow-ups",
        body: "Run it as a data pipeline (batch or streaming — the ETL/CDC ideas): source data → discover → transform → output a sanitized dataset for analytics/test/ML, with the mapping (for tokenization) stored securely + access-controlled (the secrets-manager idea). Consistency (same person → same pseudonym across tables) preserves joins. Follow-ups: 'reversible vs irreversible', 'utility-vs-privacy measurement', 'on-the-fly masking (dynamic data masking) vs pre-computed', 'GDPR/HIPAA compliance', 'free-text scrubbing accuracy'. Signal: PII discovery (structured + free text) + per-field transformation (mask/tokenize/generalize) + defend against re-identification (k-anonymity / differential privacy) — not just masking obvious fields.",
      },
    ],
    "A PII pipeline tests privacy engineering: discover PII (structured + free text via NER), transform per use case (mask/tokenize/pseudonymize/generalize), and — the core insight — defend against RE-IDENTIFICATION from quasi-identifiers (ZIP+age+gender) using k-anonymity / differential privacy, not just masking obvious fields. It balances privacy vs data utility for safe analytics/ML.",
    ["Masking only obvious identifiers, ignoring re-identification via quasi-identifiers (k-anonymity/DP).",
     "Incomplete discovery — missing PII buried in free-text fields (needs NER, not just column names).",
     "Destroying all utility (over-masking) or storing the tokenization mapping insecurely."],
    0.6, { type: "Anonymization pipeline", description: "Source data → DISCOVER PII (patterns + NER on free text) → TRANSFORM per field (mask / tokenize / pseudonymize / generalize) → sanitized output. Defend re-identification via k-anonymity / differential privacy. Mapping stored securely; pseudonyms consistent for joins.", alt: "PII pipeline: discover, transform, and anonymize against re-identification for safe data use." }),

  T("sysd_m18_t7", 7, "Design a Distributed Graph Database", "design-distributed-graph-db",
    ["case-study", "graph", "partitioning", "traversal"],
    "Build a graph database storing billions of nodes/edges with fast relationship TRAVERSALS ('friends of friends', recommendation paths). Why are graph traversals hard to scale, and what's the partitioning challenge?",
    "Store nodes + edges so adjacency (a node's edges) is a fast local lookup (index-free adjacency). The hard part is PARTITIONING: graphs don't shard cleanly — any partition CUTS edges, so traversals hop ACROSS machines (cross-partition = expensive network). Minimize edge cuts (graph partitioning), replicate hot/boundary nodes, and push computation to data. Super-nodes (celebrity-degree) need special handling. It's traversal-optimized storage + a hard partitioning problem.",
    [
      { kind: "concept", heading: "Graph storage & traversal",
        body: "A graph DB stores NODES and EDGES (with properties) optimized for RELATIONSHIP queries — traversing edges ('this node's neighbors', multi-hop paths). The key technique is INDEX-FREE ADJACENCY: each node directly references its edges, so getting a node's neighbors is an O(1) local pointer-follow, not a costly join/index lookup (how relational DBs simulate graphs). This makes deep traversals (friends-of-friends, shortest paths) fast — the whole reason to use a graph DB." },
      { kind: "concept", heading: "Why partitioning is hard (the core)",
        body: "The defining scaling challenge: graphs DON'T partition cleanly. Sharding tabular data by key is easy; but however you split a graph across machines, you inevitably CUT EDGES — edges whose endpoints land on different partitions. A traversal that crosses a cut edge becomes a CROSS-MACHINE network hop, orders of magnitude slower than a local one. A deep traversal can bounce across many machines. So the goal is to partition to MINIMIZE edge cuts (keep tightly-connected nodes together) — itself a hard (NP-hard) graph-partitioning problem." },
      { kind: "concept", heading: "Coping strategies",
        body: "Minimize and tolerate cross-partition cost: graph PARTITIONING heuristics (community-aware placement so dense clusters stay co-located), REPLICATING boundary/hot nodes on multiple partitions, and PUSHING COMPUTATION to the data (run traversal steps where the data lives, gather results — vertex-centric / Pregel-style for analytics) rather than pulling everything to one place. Some systems keep the graph on big single machines as long as possible (vertical scaling) precisely because distribution is so costly." },
      { kind: "concept", heading: "Super-nodes & follow-ups",
        body: "SUPER-NODES (extremely high-degree nodes — a celebrity with 100M followers) are the graph version of the hot-key/celebrity problem: traversing them explodes and they're hard to place. Handle with special storage/sharding for their edges. Follow-ups: 'OLTP graph queries (Cypher/Gremlin) vs OLAP graph analytics (PageRank via Pregel)', 'replication/consistency', 'why not a relational DB (join explosion on deep traversals)', 'property graph vs RDF'. Signal: index-free adjacency (fast local traversal) + the hard edge-cut partitioning problem (cross-machine hops) → minimize cuts + replicate boundaries + push compute + super-node handling.",
      },
    ],
    "A distributed graph DB tests traversal-optimized storage (index-free adjacency for fast local neighbor lookups) and the hard partitioning problem: graphs can't shard without cutting edges, so cross-partition traversals are costly network hops — minimize edge cuts, replicate boundary/hot nodes, push computation to data, and special-case super-nodes. Deep traversals are why relational joins don't suffice.",
    ["Ignoring that graphs partition poorly — every split cuts edges, making traversals cross-machine.",
     "Simulating a graph with relational joins (join explosion on deep traversals) instead of index-free adjacency.",
     "Not handling super-nodes (celebrity-degree) — the graph hot-key problem."],
    0.7, { type: "Graph DB", description: "Nodes reference their edges directly (index-free adjacency → O(1) neighbor lookup, fast traversal). Partitioning cuts edges → cross-machine hops (slow); minimize edge cuts (community-aware), replicate boundary/hot nodes, push computation to data. Super-nodes special-cased.", alt: "Distributed graph DB: index-free adjacency with edge-cut-minimizing partitioning." }),

  T("sysd_m18_t8", 8, "Design Geo Load Balancing (GSLB)", "design-geo-load-balancing",
    ["case-study", "dns", "anycast", "failover"],
    "Build global traffic routing for a service running in multiple regions: send each user to the best (nearest/healthy) region, fail over instantly when a region goes down, and balance load across regions. What mechanisms route users globally, and how is failover triggered?",
    "Route users to the optimal region using DNS-based GSLB (return the best region's IP per user location/latency/health) and/or ANYCAST (same IP announced from all regions; the network routes to the nearest). Continuous HEALTH CHECKS remove unhealthy regions from rotation (automatic FAILOVER). Routing policies: geo/latency-proximity, weighted, failover. DNS TTL governs how fast failover propagates.",
    [
      { kind: "concept", heading: "The goal",
        body: "A service deployed in MULTIPLE regions (the multi-region design) needs GLOBAL traffic management: send each user to the BEST region (low latency = nearest healthy one), BALANCE load across regions, and FAIL OVER automatically when a region degrades. Global Server Load Balancing (GSLB) operates ABOVE regional load balancers — it decides WHICH region, then a regional LB picks the instance. It's about routing at the planet scale, distinct from in-region balancing." },
      { kind: "concept", heading: "DNS-based routing",
        body: "The most common mechanism: DNS-BASED GSLB. When a client resolves your domain, the authoritative DNS returns the IP of the BEST region for that client — chosen by GEO/latency proximity (route to the closest region), WEIGHTED (split load by capacity), or FAILOVER policy. Because it's DNS, the choice happens at resolution time. Caveat: DNS is CACHED (resolvers honor TTL), so a low TTL is needed for fast failover, but very low TTLs add DNS load — a trade-off." },
      { kind: "concept", heading: "Anycast routing",
        body: "ANYCAST: announce the SAME IP address from servers in MANY regions via BGP; the internet's routing naturally delivers a client's packets to the NEAREST (network-topology-wise) announcement. No DNS dependency for region selection, and failover is fast (if a region withdraws the route, traffic reroutes at the network layer). Used heavily by CDNs and DNS providers. Trade-off: less application-level control over exactly which region than DNS policies, and stateful connections can be disrupted on reroute." },
      { kind: "concept", heading: "Health checks & failover — follow-ups",
        body: "The reliability core: continuous HEALTH CHECKS probe each region; an unhealthy region is REMOVED from rotation so new traffic routes to healthy regions (automatic FAILOVER) and re-added when it recovers. The speed of failover depends on health-check frequency + (for DNS) TTL propagation. Follow-ups: 'DNS vs anycast trade-offs', 'session affinity / data locality (a user pinned to a region for their data — the multi-region DB)', 'split-brain on partition', 'gradual region drain for deploys'. Signal: GSLB routes users to the best region via DNS-based (geo/latency/weighted/failover policies, TTL-governed) and/or anycast routing + continuous health checks for automatic failover; sits above regional LBs.",
      },
    ],
    "Geo load balancing (GSLB) tests global traffic routing above regional LBs: route users to the best region via DNS-based policies (geo/latency/weighted/failover, TTL-governed propagation) and/or anycast (nearest by network routing), with continuous health checks driving automatic failover when a region degrades. DNS-vs-anycast and failover speed (TTL) are the key trades.",
    ["Confusing global region selection (GSLB) with in-region instance load balancing.",
     "Ignoring DNS caching/TTL's effect on failover speed (or using anycast without noting connection-reroute caveats).",
     "No health-check-driven automatic failover (manual region switching)."],
    0.5, { type: "Geo load balancing", description: "User → GSLB picks the best REGION: DNS-based (return best region's IP by geo/latency/weighted/failover policy; TTL governs failover speed) and/or anycast (same IP, network routes to nearest). Health checks remove unhealthy regions (auto-failover). Regional LB then picks the instance.", alt: "GSLB: DNS/anycast routing users to the best healthy region with health-check failover." }),
];

const EXERCISES = [
  // Vector DB
  pm({ topicId: "sysd_m18_t1", exerciseId: "sysd_m18_t1_pm_1", position: 1, level: "hard", title: "Fast similarity",
    scenario: "Finding the most similar vectors among billions is made fast by…",
    options: ["An approximate nearest-neighbor (ANN) index (HNSW/IVF/PQ)", "Exact brute-force distance to every vector", "A B+Tree on the vectors", "A hash of the vector"], correct: "An approximate nearest-neighbor (ANN) index (HNSW/IVF/PQ)",
    explanation: "ANN indexes examine a tiny fraction of vectors, trading a little recall for huge speed vs exact search." }),
  pm({ topicId: "sysd_m18_t1", exerciseId: "sysd_m18_t1_pm_2", position: 2, level: "medium", title: "Similarity",
    scenario: "Semantic similarity between items is measured as…",
    options: ["Distance between their embedding vectors (cosine/dot)", "Keyword overlap", "Edit distance of the text", "File size"], correct: "Distance between their embedding vectors (cosine/dot)",
    explanation: "Embeddings place similar meanings near each other; closeness in vector space = semantic similarity." }),
  pm({ topicId: "sysd_m18_t1", exerciseId: "sysd_m18_t1_pm_3", position: 3, level: "medium", title: "The trade-off",
    scenario: "Using ANN instead of exact search trades…",
    options: ["A small loss of recall for orders-of-magnitude speedup", "Accuracy for nothing", "Memory for correctness", "Latency for recall"], correct: "A small loss of recall for orders-of-magnitude speedup",
    explanation: "Approximate results are fine for relevance; the speed gain is the point. Hybrid + re-rank can recover quality." }),
  // RAG
  pm({ topicId: "sysd_m18_t2", exerciseId: "sysd_m18_t2_pm_1", position: 1, level: "hard", title: "Ground the LLM",
    scenario: "To answer over private docs without retraining and reduce hallucination, you…",
    options: ["Retrieve relevant chunks and feed them as context to the LLM (RAG)", "Fine-tune the model on every doc change", "Trust the raw LLM", "Keyword-search and return links only"], correct: "Retrieve relevant chunks and feed them as context to the LLM (RAG)",
    explanation: "RAG grounds answers in retrieved context — updates instantly on doc change and curbs hallucination, no retraining." }),
  pm({ topicId: "sysd_m18_t2", exerciseId: "sysd_m18_t2_pm_2", position: 2, level: "medium", title: "Offline step",
    scenario: "Building the knowledge base means…",
    options: ["Chunk docs → embed → store in a vector DB", "Train a new model", "Cache the LLM's answers", "Index by keyword only"], correct: "Chunk docs → embed → store in a vector DB",
    explanation: "Offline ingestion chunks and embeds documents into a vector index for retrieval at query time." }),
  pm({ topicId: "sysd_m18_t2", exerciseId: "sysd_m18_t2_pm_3", position: 3, level: "hard", title: "Quality driver",
    scenario: "RAG answer quality is most limited by…",
    options: ["Retrieval quality (bad chunks retrieved → bad answer)", "The LLM's parameter count only", "Network latency", "The UI"], correct: "Retrieval quality (bad chunks retrieved → bad answer)",
    explanation: "Garbage retrieved = garbage generated; tune chunking, embeddings, top-K, and re-ranking." }),
  // LLM serving
  pm({ topicId: "sysd_m18_t3", exerciseId: "sysd_m18_t3_pm_1", position: 1, level: "hard", title: "GPU utilization",
    scenario: "To keep an expensive GPU busy across requests that start/finish at different times, use…",
    options: ["Continuous / in-flight batching", "One request at a time", "A bigger queue only", "Static one-size batches"], correct: "Continuous / in-flight batching",
    explanation: "Continuous batching adds/evicts requests per generation step, keeping the batch full and the GPU utilized." }),
  pm({ topicId: "sysd_m18_t3", exerciseId: "sysd_m18_t3_pm_2", position: 2, level: "hard", title: "Cheap next token",
    scenario: "Generating each new token cheaply (not recomputing all prior tokens) uses…",
    options: ["A KV-cache of attention keys/values (manage GPU memory)", "Re-running the full model each token", "A bigger batch", "A CPU fallback"], correct: "A KV-cache of attention keys/values (manage GPU memory)",
    explanation: "The KV-cache reuses prior tokens' attention K/V so each step is cheap; its GPU memory is the bottleneck." }),
  pm({ topicId: "sysd_m18_t3", exerciseId: "sysd_m18_t3_pm_3", position: 3, level: "medium", title: "Model too big",
    scenario: "A model that doesn't fit on one GPU is served using…",
    options: ["Model parallelism (shard the model across GPUs)", "A smaller batch", "More CPU RAM", "Disabling the KV-cache"], correct: "Model parallelism (shard the model across GPUs)",
    explanation: "Tensor/pipeline parallelism splits the model across GPUs; tokens are streamed to users as generated." }),
  // Model registry
  pm({ topicId: "sysd_m18_t4", exerciseId: "sysd_m18_t4_pm_1", position: 1, level: "hard", title: "Harder than code",
    scenario: "Why is shipping an ML model harder than shipping code?",
    options: ["It degrades silently as data/world shifts (drift) — no exception, just worse predictions", "Models are bigger files", "Code never changes", "Models can't be versioned"], correct: "It degrades silently as data/world shifts (drift) — no exception, just worse predictions",
    explanation: "Data/concept drift erodes accuracy invisibly, so MLOps adds drift monitoring + retraining on top of deployment." }),
  pm({ topicId: "sysd_m18_t4", exerciseId: "sysd_m18_t4_pm_2", position: 2, level: "medium", title: "Safe rollout",
    scenario: "A new model should be rolled out via…",
    options: ["Shadow/canary/A-B with metric checks + auto-rollback", "100% of traffic immediately", "Manual switch with no monitoring", "Only in dev"], correct: "Shadow/canary/A-B with metric checks + auto-rollback",
    explanation: "Gradual rollout with metric gates and rollback prevents a bad model from harming all traffic." }),
  pm({ topicId: "sysd_m18_t4", exerciseId: "sysd_m18_t4_pm_3", position: 3, level: "medium", title: "The registry",
    scenario: "A model registry versions models with…",
    options: ["Training data version, metrics, lineage (for reproducibility + rollback)", "Just the weights file", "Only a name", "The serving latency"], correct: "Training data version, metrics, lineage (for reproducibility + rollback)",
    explanation: "Rich metadata enables reproducibility, version comparison, and rollback to a known-good model." }),
  // Distributed training
  pm({ topicId: "sysd_m18_t5", exerciseId: "sysd_m18_t5_pm_1", position: 1, level: "hard", title: "Two strategies",
    scenario: "Data parallelism vs model parallelism differ in that…",
    options: ["Data parallel replicates the model + shards data; model parallel splits the model itself (too big for 1 GPU)", "They're the same", "Data parallel needs one GPU", "Model parallel shards the data"], correct: "Data parallel replicates the model + shards data; model parallel splits the model itself (too big for 1 GPU)",
    explanation: "Data parallelism scales throughput; model parallelism (tensor/pipeline) fits models bigger than one GPU." }),
  pm({ topicId: "sysd_m18_t5", exerciseId: "sysd_m18_t5_pm_2", position: 2, level: "hard", title: "Sync gradients",
    scenario: "In data parallelism, GPUs stay consistent by…",
    options: ["Averaging gradients across GPUs each step (all-reduce)", "Never communicating", "Using different models", "Random gradient picks"], correct: "Averaging gradients across GPUs each step (all-reduce)",
    explanation: "All-reduce synchronizes gradients so every replica updates identically — and is the communication bottleneck." }),
  pm({ topicId: "sysd_m18_t5", exerciseId: "sysd_m18_t5_pm_3", position: 3, level: "medium", title: "Long runs",
    scenario: "Training spans days on many GPUs where failures are common, so you…",
    options: ["Checkpoint model state periodically to resume", "Restart from scratch on any failure", "Ignore failures", "Train on one GPU to be safe"], correct: "Checkpoint model state periodically to resume",
    explanation: "Periodic checkpointing lets a failed run resume from the last checkpoint instead of restarting." }),
  // PII anonymization
  pm({ topicId: "sysd_m18_t6", exerciseId: "sysd_m18_t6_pm_1", position: 1, level: "hard", title: "Why masking isn't enough",
    scenario: "Masking name + SSN is insufficient because…",
    options: ["Quasi-identifiers (ZIP+age+gender) can re-identify individuals — need k-anonymity / differential privacy", "Masking is reversible", "Names aren't PII", "Masking is too slow"], correct: "Quasi-identifiers (ZIP+age+gender) can re-identify individuals — need k-anonymity / differential privacy",
    explanation: "Combining quasi-identifiers re-identifies people; real anonymization defends against linkage, not just obvious fields." }),
  pm({ topicId: "sysd_m18_t6", exerciseId: "sysd_m18_t6_pm_2", position: 2, level: "medium", title: "Discovery",
    scenario: "Finding PII must cover…",
    options: ["Structured columns AND free text (via NER/classifiers)", "Only columns named 'email'", "Only the primary key", "Nothing — assume it's labeled"], correct: "Structured columns AND free text (via NER/classifiers)",
    explanation: "PII hides in free-text fields too; incomplete discovery (missing free text) silently leaks data." }),
  pm({ topicId: "sysd_m18_t6", exerciseId: "sysd_m18_t6_pm_3", position: 3, level: "medium", title: "Reversible swap",
    scenario: "Replacing a value with a reversible token (re-identifiable if authorized) is…",
    options: ["Tokenization", "Generalization", "Suppression", "Differential privacy"], correct: "Tokenization",
    explanation: "Tokenization swaps values via a secure reversible mapping; generalization buckets, suppression drops." }),
  // Graph DB
  pm({ topicId: "sysd_m18_t7", exerciseId: "sysd_m18_t7_pm_1", position: 1, level: "hard", title: "Why hard to scale",
    scenario: "Distributing a graph DB is hard because…",
    options: ["Any partition cuts edges → traversals become cross-machine network hops", "Graphs can't be stored", "Nodes are too big", "Edges have no direction"], correct: "Any partition cuts edges → traversals become cross-machine network hops",
    explanation: "Graphs don't shard cleanly; cut edges turn local traversals into slow cross-partition hops." }),
  pm({ topicId: "sysd_m18_t7", exerciseId: "sysd_m18_t7_pm_2", position: 2, level: "medium", title: "Fast neighbors",
    scenario: "Fast traversal comes from…",
    options: ["Index-free adjacency (a node directly references its edges)", "A relational join per hop", "A full scan", "Hashing edges"], correct: "Index-free adjacency (a node directly references its edges)",
    explanation: "Index-free adjacency makes neighbor lookup an O(1) pointer-follow, enabling fast deep traversals." }),
  pm({ topicId: "sysd_m18_t7", exerciseId: "sysd_m18_t7_pm_3", position: 3, level: "hard", title: "Super-nodes",
    scenario: "A celebrity node with 100M edges is a…",
    options: ["Super-node — the graph hot-key problem needing special handling", "Normal node", "An error", "A partition key"], correct: "Super-node — the graph hot-key problem needing special handling",
    explanation: "High-degree super-nodes explode traversals and resist clean placement — special-case their edges." }),
  // GSLB
  pm({ topicId: "sysd_m18_t8", exerciseId: "sysd_m18_t8_pm_1", position: 1, level: "medium", title: "Route globally",
    scenario: "Sending each user to the best region is done via…",
    options: ["DNS-based routing (geo/latency/weighted/failover) and/or anycast", "A single regional load balancer", "Round-robin across all instances globally", "Client choice only"], correct: "DNS-based routing (geo/latency/weighted/failover) and/or anycast",
    explanation: "GSLB selects the region (DNS policies or anycast); a regional LB then picks the instance." }),
  pm({ topicId: "sysd_m18_t8", exerciseId: "sysd_m18_t8_pm_2", position: 2, level: "hard", title: "Failover speed",
    scenario: "With DNS-based GSLB, failover speed is governed by…",
    options: ["DNS TTL (cached resolvers) + health-check frequency", "The CPU of the origin", "The number of regions", "Anycast only"], correct: "DNS TTL (cached resolvers) + health-check frequency",
    explanation: "Resolvers cache DNS per TTL, so low TTL speeds failover (at higher DNS load); health checks detect the failure." }),
  pm({ topicId: "sysd_m18_t8", exerciseId: "sysd_m18_t8_pm_3", position: 3, level: "medium", title: "Auto-failover",
    scenario: "A region going down is handled by…",
    options: ["Health checks removing it from rotation (traffic reroutes to healthy regions)", "Manually editing DNS", "Waiting for users to complain", "Nothing"], correct: "Health checks removing it from rotation (traffic reroutes to healthy regions)",
    explanation: "Continuous health checks drive automatic failover, re-adding the region when it recovers." }),
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
  console.log(`\nDone — M18 AI/ML & Data Infra seeded. Track now: ${totals.totalModules} modules, ${totals.totalTopics} topics, ${totals.totalExercises} exercises, ${totals.totalXp} XP`);
  await mongoose.disconnect();
}
run().catch((err) => { console.error(err.message); process.exit(1); });
process.on("exit", () => process.exit(0));
