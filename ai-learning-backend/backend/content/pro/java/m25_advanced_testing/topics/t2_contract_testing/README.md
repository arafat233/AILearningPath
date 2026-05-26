# Topic 25.2: Contract Testing with Pact

**Module**: M25 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 25 Progress**: 2/5 | **Course Progress**: 122 topics (71.8%)

## Key Concepts
- **Consumer-driven contracts**: consumer defines what IT needs (not provider-dictated)
- `@ExtendWith(PactConsumerTestExt.class)` + `@PactTestFor(providerName=..., port=...)`: test setup
- `@Pact(consumer=..., provider=...)`: annotates the contract-building method
- `PactDslWithProvider`: builder for request-response interactions
- `PactDslJsonBody` matchers — prefer **type matchers** (flexible):
  - `stringType("field", "example")`: any String
  - `numberType("field", 100L)`: any Number
  - `stringMatcher("status", "SUCCESS|FAILED", "SUCCESS")`: regex validation
  - `stringValue("error", "PAYMENT_NOT_FOUND")`: exact match (for error codes)
  - `minArrayLike("items", 1, ...)`: array with at least 1 item of shape
- `.toPact()`: terminal builder method — generates the contract
- `@Test @PactTestFor(pactMethod="xxx")`: links test to the `@Pact` method; uses `MockServer`
- **PactStates constants**: prevent `@State` vs `.given()` typo mismatches
- **Pact Broker**: centralized contract storage; `can-i-deploy` gates deployment
- `@PactFolder`: reads local pact JSON for provider tests
- `@PactBroker`: downloads from broker in CI
- **MessagePact**: for async contracts (Kafka, RabbitMQ event schema)
- **vs Integration tests**: Pact = contract shape; Testcontainers = behavior (complementary)

## Files: topic.json (~12KB), exercises.json (~28KB), project.json (~2KB), README.md
