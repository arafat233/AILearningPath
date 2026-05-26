# Topic 28.4: gRPC Security — TLS, Auth & Authorization

**Module**: M28 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 28 Progress**: 4/5 | **Course Progress**: 139 topics (81.8%)

## Key Concepts
- **Status.UNAUTHENTICATED**: missing auth, invalid token, expired token (HTTP 401 equivalent)
- **Status.PERMISSION_DENIED**: valid identity, insufficient role (HTTP 403 equivalent)
- **Status.RESOURCE_EXHAUSTED**: rate limit exceeded (HTTP 429 equivalent)
- `Metadata.Key.of("authorization", ASCII_STRING_MARSHALLER)`: lowercase key (HTTP/2 canonicalization)
- `call.close(Status.UNAUTHENTICATED, new Metadata())` + return empty Listener — aborts the RPC
- **Return empty `ServerCall.Listener<>() {}`** after `call.close()` — mandatory, prevents NPE
- `next.startCall(call, headers)` — pass to actual handler when auth succeeds
- **Interceptor order**: RateLimit → Auth → RBAC → Logging (rate limit first = fast-fail, no JWT parsing wasted)
- `@GrpcGlobalServerInterceptor`: applied to all gRPC services automatically
- **Context.key("auth-context")**: propagate identity from interceptor to service method
- `ctx.attach()` / `ctx.detach(previous)` — thread-local context management
- **mTLS**: certificate = identity (no JWT needed); `TlsChannelCredentials` with `keyManager` for client cert
- `grpc.server.security.enabled=true` + `certificate-chain` + `private-key` — server TLS config
- Per-RPC credentials: `stub.withCallCredentials(creds)` — refreshes token per call
- `MetadataUtils.newAttachHeadersInterceptor(headers)` — client-side header injection

## Files: topic.json (~12KB), exercises.json (~27KB), project.json, README.md
