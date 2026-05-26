# Topic 28.1: gRPC Basics — Protocol Buffers & Service Definitions

**Module**: M28 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 28 Progress**: 1/5 | **Course Progress**: 136 topics (80.0%)

## Key Concepts
- **gRPC**: Google RPC — binary protocol over HTTP/2 (5-10x faster than REST/JSON)
- **Protocol Buffers (protobuf)**: binary serialization format; schema = `.proto` file
- **`syntax = "proto3"`**: required first line; must match between client and server
- **Field numbers**: permanent identifiers (`= 1`, `= 2`); NEVER reuse after removal
- **`reserved N; reserved "name";`**: prevents accidental reuse of removed field numbers/names
- **Field numbers 1-15**: encoded in 1 byte — use for most common fields
- **Enum**: first value MUST be 0 (`ORDER_TYPE_UNSPECIFIED = 0`) in proto3
- **Proto3 defaults**: no null — empty string `""`, 0, false, first-enum-value
- **Service definition**: `rpc MethodName(RequestType) returns (ResponseType);`
- **4 RPC types**: unary, server-stream (`stream Response`), client-stream (`stream Request`), bidi
- **`java_multiple_files = true`**: one `.java` file per message (recommended)
- **`java_package`**: overrides proto package for generated Java class package
- **Generated stubs**: `ServiceGrpc.ServiceBlockingStub` (sync), `ServiceFutureStub` (async), `ServiceImplBase` (server)
- **Builder pattern**: `MessageType.newBuilder().setField(val).build()` — immutable result
- **Backward compat**: add new fields (safe), remove with `reserved` (safe), never reuse numbers
- **gRPC vs REST vs GraphQL**: gRPC = internal microservices (speed); REST = public APIs; GraphQL = variable fields

## Files: topic.json (~13KB), exercises.json (~28KB), project.json, README.md
