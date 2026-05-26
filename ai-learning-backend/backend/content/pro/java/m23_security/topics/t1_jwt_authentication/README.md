# Topic 23.1: JWT Authentication

**Module**: M23 - Security | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)  
**Status**: 🟡 READY FOR REVIEW | **Course Progress**: 111 topics (65.3%)

## 🆕 Module 23 Begins — Security

After building (M1-M17), observing (M18-M20), deploying (M21), and optimizing (M22), Module 23 covers **securing the service**. JWT, OAuth2, Vault secrets, OWASP input validation, and rate limiting.

---

## Key Concepts
- JWT: `header.payload.signature` — payload is **base64, NOT encrypted**. Anyone can decode it.
- RS256 (asymmetric): sign with private key, verify with public key — production standard
- HS256 (symmetric): shared secret — dev/testing only (secret leaks = all tokens compromised)
- `@EnableWebSecurity` + `@EnableMethodSecurity`: both required for full Spring Security JWT
- **`@EnableMethodSecurity` is critical** — without it, `@PreAuthorize` is silently ignored
- `SessionCreationPolicy.STATELESS`: no HTTP sessions; every request must carry its own JWT
- `.csrf().disable()`: safe for stateless REST APIs (CSRF requires session-based auth)
- `JwtAuthenticationConverter`: maps JWT claims → Spring Security `GrantedAuthority`
- `setAuthoritiesClaimName("roles")`: extracts roles from the `roles` claim
- `@AuthenticationPrincipal Jwt`: inject validated JWT directly into controller method
- `jwt.getClaimAsString("merchant_id")`: tamper-proof claim extraction
- **merchant_id from JWT** (not request param): params are forgeable; JWT claims are signed
- `@PreAuthorize("hasRole('MERCHANT')")`: method-level security check
- `jwt()` MockMvc processor: test JWT authentication without real token issuer
- **401** = unauthenticated (no/invalid JWT) | **403** = authenticated but unauthorized (wrong role)
- Short expiry (15-60 min): limit blast radius of stolen tokens
- Never log JWT tokens: they are credentials valid until expiry

---

## Production Checklist

```yaml
# application.yml:
spring.security.oauth2.resourceserver.jwt:
  jwk-set-uri: https://auth.razorpay.com/.well-known/jwks.json
  issuer-uri: https://auth.razorpay.com
```

```java
// @Configuration — always both annotations:
@EnableWebSecurity
@EnableMethodSecurity   ← CRITICAL: don't forget this
```

## Files: topic.json (~18KB), exercises.json (~36KB), project.json (~3KB), README.md
