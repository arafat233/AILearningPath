# Topic 26.5: Testing AI Applications

**Module**: M26 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 26 Progress**: 5/5 ✅ | **Course Progress**: 130 topics (76.5%)

## Key Concepts
- **Don't call real AI in unit/integration tests** — costs money, is slow, is non-deterministic
- **FakeAiService**: keyword→response Map; deterministic, free, `addResponse()` for test setup
- **Mock ChatClient.Builder** (`@MockBean`): prevents real API calls in `@SpringBootTest`
- **Factual assertions**: `assertTrue(response.contains("700"))` — not `assertEquals(exactText)` (wording varies)
- **Anti-hallucination**: `assertFalse(response.contains("guaranteed"))` — check AI didn't invent false promises
- **WireMock for AI API**: stub `POST /v1/messages`; `@DynamicPropertySource` redirects `base-url` to WireMock
- **Fallback test**: mock AI to throw → service returns cached response → assert fallback
- **EvalCase record**: `question, expectedFacts, bannedTerms` — structured test cases
- **EvalRunner**: measures accuracy against known Q&A pairs (aim for >80%)
- **LLM-as-judge**: second AI call evaluates first response (score 1-5); score ≥ 3 = acceptable
- **AI test pyramid**:
  - Unit (70%): FakeAi/Mock, free, deterministic, <30s
  - Integration (20%): WireMock AI, test wiring, free, 2-3 min
  - Evaluation (10%): real AI, weekly, ~₹50/run, catches quality regressions
- **Latency tracking**: `AiLatencyTracker.p99()` — alert if p99 regresses >20% vs baseline
- **Temperature=0** for deterministic tests (still varies — use Fake/Mock for true determinism)
- **Max response length contract**: `response.length() < 2000` — prevents token runaway

## Files: topic.json (~12KB), exercises.json (~28KB), project.json, README.md
