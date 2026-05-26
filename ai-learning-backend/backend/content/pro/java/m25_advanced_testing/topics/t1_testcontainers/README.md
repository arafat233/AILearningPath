# Topic 25.1: Testcontainers — Real Dependencies in Tests

**Module**: M25 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 25 Progress**: 1/5 | **Course Progress**: 121 topics (71.2%)

## Key Concepts
- **Why not H2**: JSONB enforcement, `ON CONFLICT`, `RETURNING`, sequences differ from PostgreSQL
- `@Testcontainers` + `@Container static`: one container per class lifecycle (fast)
- `@DynamicPropertySource static void props(DynamicPropertyRegistry r)`: override Spring datasource
  - `r.add("spring.datasource.url", postgres::getJdbcUrl)` — dynamic port
- `@AutoConfigureTestDatabase(replace=NONE)`: prevent H2 substitution in `@DataJpaTest`
- `getMappedPort(6379)`: Testcontainers maps to random host port — never hardcode
- **Container reuse**: abstract base class with static container → shared across test classes
- **@BeforeEach**: `repo.deleteAll()` + `flushAll()` — isolation without container restart
- `GenericContainer<>("redis:7-alpine").withExposedPorts(6379)`: any Docker image
- `ConfluentKafkaContainer`: real Kafka — test exact producer/consumer behavior
- `CountDownLatch.await(10, SECONDS)`: wait for async Kafka consumer in tests
- **CI**: Docker daemon built-in on `ubuntu-latest` — zero config for GitHub Actions
- `withReuse(true)`: keep container alive across test runs (local dev speed)

## Files: topic.json (~12KB), exercises.json (~28KB), project.json (~2KB), README.md
