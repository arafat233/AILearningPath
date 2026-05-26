# Topic 14.1: Spring Security and JWT Authentication

**Module**: M14 - Advanced Spring Boot
**Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.5 (Testing Spring Boot)

---

## 🚀 Module 14 Begins — Advanced Spring Boot Patterns

After Module 13's full-stack REST API, Module 14 adds the professional-grade capabilities every production system needs: security, async operations, caching, configuration, and observability.

---

## What This Topic Teaches

1. JWT (JSON Web Token): header.payload.signature structure
2. Stateless authentication: no sessions, token contains identity
3. `@EnableWebSecurity` + `SecurityFilterChain` — Spring Security config
4. `csrf().disable()` — safe for stateless REST APIs
5. `SessionCreationPolicy.STATELESS` — mandatory for JWT
6. `authorizeHttpRequests`: permitAll, authenticated, hasRole, hasAnyRole
7. `addFilterBefore(jwtFilter, ...)` — inject custom filter
8. `JwtService`: generateToken, extractUsername, isValid
9. `io.jsonwebtoken (jjwt)` library usage
10. `OncePerRequestFilter` — runs once per request
11. `SecurityContextHolder.setAuthentication()` — tell Spring who the caller is
12. `BCryptPasswordEncoder` — password hashing (never plain text)
13. `UserDetailsService` / `loadUserByUsername`
14. `Authentication auth` parameter in controllers
15. 401 Unauthorized vs 403 Forbidden
16. `@WithMockUser` in @WebMvcTest for auth simulation

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Razorpay Payment API secured |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Open API → anyone can DELETE your products. JWT-secured API → only ADMIN role with valid token.

### 📚 Teaching (5 Sub-sections)
1. **JWT basics**: structure, how it works, stateless benefit
2. **Spring Security setup**: dependency, @EnableWebSecurity, SecurityFilterChain
3. **JwtService**: jjwt Jwts.builder/parser, signing key, generate/validate
4. **JwtAuthFilter**: OncePerRequestFilter, header extraction, SecurityContextHolder
5. **AuthController + UserDetailsService**: login, register, BCrypt

### 🛠️ Worked Example: Secured Product API
SecurityFilterChain with public GET, authenticated POST, ADMIN-only DELETE. JwtAuthFilter intercepts every request. AuthController returns JWT on login.

### ⚠️ 3 Common Gaps
1. **missing STATELESS** — Spring creates sessions without it
2. **wrong filter order** — addFilterBefore is critical
3. **jwt secret in code** — always @Value + environment variable

### 💪 15 Exercises (740 XP)
Key exercises:
- **Ex 6 (45 XP)**: JwtAuthFilter complete implementation
- **Ex 8 (60 XP)**: @WebMvcTest with @WithMockUser for all auth scenarios
- **Ex 11 (65 XP)**: Get current user in controller + role-based access control
- **Ex 14 (75 XP)**: @SpringBootTest full login → use token → 401/403 flow
- **Ex 15 (95 XP)**: Complete JWT security stack

### 🚀 Mini-Project: Razorpay Payment API — JWT Secured
All 7 security classes implemented. Role-based endpoint rules. @WebMvcTest with @WithMockUser. Register → login → pay → refund (ADMIN only).

---

## The JWT Pattern in 5 Lines

```java
// 1. SecurityConfig:
.sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
.authorizeHttpRequests(a -> a.requestMatchers("/api/auth/**").permitAll().anyRequest().authenticated())
.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

// 2. JwtAuthFilter: extracts Bearer token, validates, sets SecurityContextHolder

// 3. JwtService: Jwts.builder().subject(username).signWith(key).compact()

// 4. AuthController: authManager.authenticate() → jwtService.generateToken()

// 5. Test: @WithMockUser → simulates authenticated user in @WebMvcTest
```

---

## Review Checklist

- [ ] JWT structure: header.payload.signature all explained
- [ ] STATELESS session: emphasized as mandatory
- [ ] CSRF disable: explained why safe for REST
- [ ] Ex 3: Base64.getUrlDecoder() not getDecoder() for JWT
- [ ] @WithMockUser needs @MockBean JwtService + UserDetailsService

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M13 avg | M14 T1 |
|--------|---------|--------|
| Generation time | ~68 min | ~70 min |
| Word count | ~14K | ~15K |
| Exercises | 15 | 15 |
| XP available | ~713 | 740 |

**Module 14 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Files**: 4

**Course Progress**: 66 topics complete (38.8% of 170)

**Next**: Topic 14.2 — @Async and @Scheduled
