# Topic 14.4: @ConfigurationProperties and Profiles

**Module**: M14 - Advanced Spring Boot
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.1 (Spring Boot Introduction)

---

## What This Topic Teaches

1. `@ConfigurationProperties(prefix="my.service")` — bind property group to Java record
2. Kebab-case → camelCase relaxed binding: `max-retries` → `maxRetries`
3. `@ConfigurationPropertiesScan` — auto-discover all @ConfigurationProperties
4. `@EnableConfigurationProperties(MyProps.class)` — manual registration
5. `@Validated` on record class — trigger startup validation
6. `@NotBlank`, `@Min`, `@Max`, `@Pattern` on record fields
7. Nested records — bind sub-prefixes (`notification.email.*`)
8. `@Valid` on nested record fields — propagate validation
9. `application-{profile}.properties` — profile-specific overrides
10. `spring.profiles.active=dev` — activate in properties
11. `SPRING_PROFILES_ACTIVE=prod` — activate via env var
12. `--spring.profiles.active=prod` — activate via CLI
13. `@Profile("dev")` on beans — created only when profile is active
14. `@Profile({"dev","test"})` — active in multiple profiles
15. `@ActiveProfiles("dev")` in tests — load test with specific profile
16. `@TestPropertySource(properties={...})` — override individual properties in test
17. `${ENV_VAR}` in properties — inject env var into property

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~21KB | Main content |
| `exercises.json` | ~35KB | 15 exercises |
| `project.json` | ~7KB | Zerodha Trading Multi-Env Config |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
20 scattered @Value fields across 4 classes → 2 typed @ConfigurationProperties records with IDE autocomplete, validation, and environment switching.

### 📚 Teaching (4 Sub-sections)
1. **@ConfigurationProperties basics**: record binding, kebab-to-camel, @ConfigurationPropertiesScan
2. **@Validated**: startup validation, fail-fast, @NotBlank/@Min on record fields
3. **Nested records**: sub-prefix binding, @Valid propagation
4. **Spring profiles**: property file naming, activation methods, @Profile beans, @ActiveProfiles in tests

### 🛠️ Worked Example: Payment Service Config Refactor
Scatter @Value → PaymentGatewayProps + DatabaseProps records. @Validated with HTTPS URL constraint. Dev/prod property files. MockEmailService @Profile(dev,test) vs SmtpEmailService @Profile(prod).

### ⚠️ 3 Common Gaps
1. **forgetting_enable** — @ConfigurationPropertiesScan or @EnableConfigurationProperties required
2. **profile_not_active** — application-prod.properties ignored until profile activated
3. **validation_missing_validated** — @NotBlank on field without @Validated on class = no validation

### 💪 15 Exercises (710 XP)
Key exercises:
- **Ex 9 (55 XP)**: Nested @ConfigurationProperties (NotificationProps with Email and Sms)
- **Ex 11 (65 XP)**: Zerodha trading config — TradingProps, DatabaseProps, 3 profiles, tests
- **Ex 14 (70 XP)**: Feature flag system with @SpringBootTest for both dev and prod profiles
- **Ex 15 (95 XP)**: Complete payment config — nested records, 3 files, @Profile beans, 4 tests

### 🚀 Mini-Project: Zerodha Trading Multi-Env Config
TradingConfig (nested Market + RiskLimits). NotificationConfig (nested Sms + Email). Three property files. @Profile beans. 4 @SpringBootTest assertions.

---

## The @ConfigurationProperties Pattern

```java
// Instead of 5 @Value fields:
@Value("${payment.gateway.url}") String url;
@Value("${payment.gateway.timeout}") int timeout;
// ...

// Use ONE typed record:
@ConfigurationProperties(prefix = "payment.gateway")
@Validated
public record PaymentGatewayProps(
    @NotBlank @Pattern(regexp="https://.*") String url,
    @Min(100) @Max(30000)                  int timeoutMs,
    @Min(1)   @Max(5)                      int maxRetries,
    @NotBlank                              String apiKey
) {}

// Inject wherever needed:
@Service class PaymentService {
    private final PaymentGatewayProps props;
    PaymentService(PaymentGatewayProps p) { props = p; }
    void call() { doCall(props.url(), props.timeoutMs(), props.apiKey()); }
}
```

## The Profile Pattern

```
application.properties          ← always loaded (shared)
application-dev.properties      ← overlaid when dev active
application-prod.properties     ← overlaid when prod active

# Dev: spring.profiles.active=dev (in application.properties)
# Prod: SPRING_PROFILES_ACTIVE=prod (env var) or --spring.profiles.active=prod (CLI)
```

```java
@Service @Profile({"dev","test"}) class MockEmailService implements EmailService { ... }
@Service @Profile("prod")         class SmtpEmailService implements EmailService { ... }

// Test: @ActiveProfiles("dev") → MockEmailService injected automatically
```

---

## Review Checklist

- [ ] Relaxed binding: kebab-case → camelCase clearly shown
- [ ] @Validated required for constraints to run at startup
- [ ] @ConfigurationPropertiesScan: one annotation covers all records
- [ ] Ex 10: property override order correct (profile overrides base)
- [ ] @Profile({'dev','test'}): test profile gets MockEmailService without @MockBean

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T14.3 | T14.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~60 min | Faster (simpler topic) |
| Word count | ~13K | ~12K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 730 | 710 | Stable |

**Module 14 Progress**: 4/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 69 topics complete (40.6% of 170)

**Next**: Topic 14.5 — Actuator and Production Observability (Module 14 Final)
