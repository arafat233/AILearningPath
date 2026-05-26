# Topic 26.2: RAG — Retrieval Augmented Generation

**Module**: M26 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 26 Progress**: 2/5 | **Course Progress**: 127 topics (74.7%)

## Key Concepts
- **RAG**: ground AI in your private docs — not training data (which is outdated/public)
- **Embedding**: text → float[] vector capturing semantic meaning (not keywords)
- **Similarity search**: `vectorStore.similaritySearch(SearchRequest.query(q).withTopK(3))`
- **`withSimilarityThreshold(0.7)`**: reject chunks below 70% relevance
- **`'Answer based ONLY on context'`**: critical — prevents hallucination from training data
- **Early return on empty results**: check for empty chunks BEFORE calling AI (no context = hallucination)
- **Document metadata**: always include `source` key — enables citations and filtering
- **VectorStore.add(docs)**: embeds each document and stores vector (pgvector/Chroma/InMemory)
- **InMemoryVectorStore**: for tests only — lost on restart
- **pgvector**: PostgreSQL extension — same DB, no new infrastructure needed
- **HNSW index**: fast approximate nearest-neighbor search (`index-type: HNSW`)
- **Chunk size**: 500 tokens, 10% overlap — Spring AI's `TokenTextSplitter` default
- **Metadata filtering**: `FilterExpressionBuilder.eq("department", "LOANS")` — restrict search scope
- **RAG evaluation**: `RagEvaluator` — measure % of questions where correct doc is in top-K
- **Hybrid search**: keyword (exact) + semantic (meaning) — higher recall than either alone
- **Scheduled re-ingestion**: `@Scheduled(cron="0 0 2 * * *")` — nightly re-ingest on doc change
- **RAG vs fine-tuning**: RAG for frequently-updated private docs; fine-tuning for permanent behavior

## Files: topic.json (~13KB), exercises.json (~29KB), project.json, README.md
