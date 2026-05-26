# Topic 23.2: OAuth2 with Spring Security

**Module**: M23 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 23 Progress**: 2/5 | **Course Progress**: 112 topics (65.9%)

## Key Concepts
- Auth Code flow: user consents → redirect → code exchange → token (Quicko reading Zerodha trades)
- Client Credentials: service-to-service, no user, single POST /token (HDFC calling Razorpay)
- `SCOPE_` prefix: Spring Security maps OAuth2 scopes → `SCOPE_xxx` GrantedAuthority
- `hasAuthority('SCOPE_payments:read')` — NOT `hasRole('payments:read')`
- `OAuth2AuthorizedClientManager`: auto token lifecycle (cache, expiry check, refresh)
- `ServerOAuth2AuthorizedClientExchangeFilterFunction`: injects Bearer token into WebClient requests
- `setDefaultClientRegistrationId`: ties a WebClient to one OAuth2 registration
- Token propagation: forward user JWT downstream when user identity matters
- Client Credentials for downstream: when service calls generic service (no user context needed)
- OIDC = OAuth2 + `openid` scope + `id_token` → user identity (for login flows)
- PKCE: required for SPAs/mobile apps in Auth Code flow

## Files: topic.json (~14KB), exercises.json (~30KB), project.json (~2KB), README.md
