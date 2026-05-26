# Topic 13.1: Spring Boot Introduction

**Module**: M13 - Spring Boot Fundamentals
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T12.1 (JUnit 5), T5.3 (Interfaces), T8.1 (Lambdas)

---

## 🚀 Module 13 Begins — The Industry's #1 Java Framework

After 12 modules of core Java and testing, Module 13 introduces Spring Boot — what 85% of Java job postings require.

---

## What This Topic Teaches

1. What Spring Boot is and why it exists (vs plain Spring)
2. Auto-configuration — classpath-driven zero-config setup
3. `@SpringBootApplication` = @Configuration + @EnableAutoConfiguration + @ComponentScan
4. `SpringApplication.run()` — starts ApplicationContext + Embedded Tomcat
5. `@Component`, `@Service`, `@Repository`, `@Controller` — stereotype annotations
6. Constructor injection — preferred over field injection
7. `@Autowired` — implicit on single constructors
8. `@Value("${property:default}")` — read from application.properties
9. `@PostConstruct` — initialization after all injection complete
10. `@PreDestroy` — cleanup before bean destruction
11. `application.properties` — configure everything without recompiling
12. Spring profiles — `application-dev.properties` vs `application-prod.properties`
13. `@SpringBootTest(webEnvironment = NONE)` — test Spring context without HTTP
14. `CommandLineRunner` — run code after Spring starts

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Inventory Management App |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Building a REST server from scratch: 2 hours, 500 lines, XML config. With Spring Boot: 10 lines, zero XML, embedded Tomcat included.

### 📚 Teaching (6 Sub-sections)
1. **What is Spring Boot**: Spring framework + auto-config + embedded server + starters
2. **Project setup**: Spring Initializr, pom.xml starter parent
3. **@SpringBootApplication**: the three annotations, what run() does
4. **Dependency injection**: @Service + constructor injection + @Autowired
5. **Auto-configuration + properties**: classpath detection, @Value, application.properties
6. **Bean lifecycle**: @PostConstruct, @PreDestroy, singleton scope

### 🛠️ Worked Example: Product Catalog Service
@SpringBootApplication + @Service with @Value + @PostConstruct + CommandLineRunner. Demonstrates the full Spring Boot startup lifecycle.

### ⚠️ 3 Common Gaps
1. **field_injection_instead_of_constructor** — always prefer constructor injection
2. **component_scan_scope** — classes must be in sub-packages of Application
3. **circular_dependency** — A→B→A fails in Spring Boot 2.6+

### 💪 15 Exercises (685 XP)
Key exercises:
- **Ex 7 (50 XP)**: Three-layer Spring Bean wiring (Controller → Service → Repository)
- **Ex 12 (60 XP)**: Unit test a @Service without Spring context
- **Ex 13 (70 XP)**: Full Spring Boot application skeleton
- **Ex 14 (70 XP)**: @SpringBootTest integration test
- **Ex 15 (95 XP)**: Complete PaymentConfigService with integration tests

### 🚀 Mini-Project: Inventory Management App
InventoryRepository → InventoryService → AlertService + CommandLineRunner. application.properties with 4 properties. @Value threshold. @PostConstruct prints config. Demonstrates complete Spring Boot service layer.

---

## The Spring Boot Mental Model

```
@SpringBootApplication        ← "start scanning from here"
         ↓
  Classpath detection          ← "spring-web on classpath → configure Tomcat"
         ↓
  Component scan               ← finds @Service, @Repository, @Controller
         ↓
  Dependency injection         ← wires all constructors
         ↓
  @PostConstruct               ← initialization after injection
         ↓
  Embedded Tomcat starts       ← ready to serve HTTP
```

---

## The Injection Pattern to Always Use

```java
// DON'T — field injection:
@Service class Bad {
    @Autowired private Dep dep;  // not final, not testable without Spring
}

// DO — constructor injection:
@Service class Good {
    private final Dep dep;
    Good(Dep dep) { this.dep = dep; }  // final, testable, implicit @Autowired
}

// TEST without Spring:
Dep mockDep = Mockito.mock(Dep.class);
Good service = new Good(mockDep);  // no @SpringBootTest needed!
```

---

## Review Checklist

- [ ] @SpringBootApplication = three annotations — all named
- [ ] Constructor injection clearly preferred over field injection
- [ ] @PostConstruct: runs AFTER @Value injection
- [ ] Component scan: classes must be in sub-packages of Application
- [ ] Ex 12: unit test with new Service(mock) — no Spring context
- [ ] Ex 14: @SpringBootTest(WebEnvironment.NONE) — no Tomcat

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M13 T1 |
|--------|--------|
| Generation time | ~65 min |
| Word count | ~14K |
| Exercises | 15 |
| XP available | 685 |

**Module 13 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Files**: 4

**Course Progress**: 61 topics complete (35.9% of 170)

**Next**: Topic 13.2 — REST Controllers
