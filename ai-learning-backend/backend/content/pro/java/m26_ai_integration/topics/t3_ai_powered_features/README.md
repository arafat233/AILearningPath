# Topic 26.3: AI-Powered Features — Classification, Extraction & Summarization

**Module**: M26 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 26 Progress**: 3/5 | **Course Progress**: 128 topics (75.3%)

## Key Concepts
- **BeanOutputConverter<T>**: AI returns JSON → Java record automatically
  - `converter.getFormat()`: JSON schema — ALWAYS include as `.param()` in user message
- **Temperature=0**: for extraction — deterministic, same doc → same output every time
- **Confidence field**: AI rates own certainty (0-100) — use >= 70 threshold for auto-processing
- **`extractSafe()` → `Optional<T>`**: low confidence → `Optional.empty()` → human review queue
- **Amounts in paise** (not rupees): long integer, no floating-point precision issues
- **Classification**: text → enum + urgency + requiresHuman routing metadata
- **Urgency 5** for fraud tickets: always routes to human immediately
- **Summarization**: "exactly 3 bullets, max 25 words each" — constraints in system prompt
- **Document classifier**: rule-based keyword matching (fast, cheap, always available)
- **Fallback**: rule-based classifier when AI is unavailable — ALWAYS have a non-AI fallback
- **Batch processing**: virtual threads (`newVirtualThreadPerTaskExecutor()`) for parallel AI calls
- **Semantic search in REST**: `vectorStore.similaritySearch()` in `@GetMapping` handler
- **Validation**: check confidence AND required fields — both must pass before auto-processing
- **90% accuracy ≠ good enough** for financial documents: need 99%+ for loan decisions

## Files: topic.json (~12KB), exercises.json (~28KB), project.json, README.md
