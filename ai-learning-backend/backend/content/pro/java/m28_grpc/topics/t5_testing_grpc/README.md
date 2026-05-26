# Topic 28.5: Testing gRPC Services

**Module**: M28 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 28 Progress**: 5/5 ✅ | **Course Progress**: 140 topics (82.4%)

## Key Concepts
- **InProcessServerBuilder**: gRPC server in same JVM — no network, ~10-50ms per test
  - `InProcessServerBuilder.generateName()`: unique name per test class
  - `.directExecutor()`: single-threaded — deterministic, no race conditions
  - `InProcessChannelBuilder.forName(same name)`: connects to in-process server
- **Always @AfterEach**: `channel.shutdownNow().awaitTermination(5, SECONDS)` + server
- **TestStreamObserver<T>**: `CopyOnWriteArrayList` + `CountDownLatch(1)`
  - `onCompleted()` and `onError()` both call `countDown()`
  - `awaitCompletion(5, SECONDS)`: always before asserting stream values
- **Missing `awaitCompletion()`** = #1 streaming test bug (values are 0, not expected count)
- `assertThrows(StatusRuntimeException.class)` — NOT `Exception.class`
- `ex.getStatus().getCode()` — compare to `Status.Code.INVALID_ARGUMENT` etc.
- **InProcess tests real gRPC**: proto serialization, framework lifecycle — catches what pure unit tests miss
- **Parameterized streaming tests**: `@ParameterizedTest @MethodSource` for boundary values
- **Mock dependencies**: `@Mock` repo, inject into service, verify `repo.save()` called
- `Status.INTERNAL`: wrap unexpected exceptions (never let raw `RuntimeException` escape gRPC)
- **Pure unit test**: test business logic without gRPC at all (fastest)
- **InProcess**: test gRPC layer with real impl (best for integration-level gRPC)
- **Real network**: load tests only (ghz tool), against staging, never production

## Files: topic.json (~11KB), exercises.json (~27KB), project.json, README.md
