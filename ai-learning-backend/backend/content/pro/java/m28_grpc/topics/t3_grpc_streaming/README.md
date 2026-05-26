# Topic 28.3: gRPC Streaming — Server, Client & Bidirectional

**Module**: M28 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐⭐ (8/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 28 Progress**: 3/5 | **Course Progress**: 138 topics (81.2%)

## Key Concepts
- **Server streaming** (`returns (stream T)`): one request → many responses (live price feed)
  - `isCancelled()`: MANDATORY check before each `onNext()` — prevents resource leaks
  - `setOnCancelHandler()`: cleanup callback when client disconnects
  - Infinite streams: don't call `onCompleted()` (stays open until client cancels)
- **Client streaming** (`stream T`) → one response): many requests → one response (batch upload)
  - Service method **returns** `StreamObserver<RequestType>` (receives client messages)
  - `responseObserver` is a parameter (sends the final response)
  - `onCompleted()` of returned StreamObserver → call `responseObserver.onNext()` then `responseObserver.onCompleted()`
- **Bidirectional streaming**: `stream T` → `stream R` — both sides stream independently
  - Immediately respond to each incoming message OR batch — your choice
  - Both sides can end independently
- **Cast**: `(ServerCallStreamObserver<T>) responseObserver` — needed for `isCancelled()` and `setOnCancelHandler()`
- **`isReady()`**: true = client buffer has space; false = slow consumer (back-pressure)
- **`setOnReadyHandler()`**: callback when client buffer drains — resume sending
- **`TestStreamObserver`**: captures `onNext` values, `error`, `completed` flag for testing
- Back-pressure pattern: `if (sobs.isReady()) onNext(); else queue.add(); `
- Client streaming fatal vs non-fatal errors: fatal calls `responseObserver.onError()` and stops; non-fatal accumulated
- `Status.DATA_LOSS`: data integrity error; `Status.INVALID_ARGUMENT`: bad request

## Files: topic.json (~12KB), exercises.json (~28KB), project.json, README.md
