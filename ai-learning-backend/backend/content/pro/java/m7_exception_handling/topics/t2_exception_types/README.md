# Topic 7.2: Exception Types — Checked vs Unchecked

**Module**: M7 - Exception Handling
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T7.1 (try/catch/finally)

---

## What This Topic Teaches

1. The full Throwable hierarchy (Error → Exception → checked/unchecked)
2. Errors — never catch (OutOfMemoryError, StackOverflowError)
3. Checked exceptions — compiler enforces handling
4. Unchecked exceptions — RuntimeException family, optional handling
5. `throws` keyword — declaration in method signature
6. When to catch vs when to declare throws
7. Wrapping checked in unchecked — the Spring pattern
8. Common examples of each type
9. The design philosophy behind the split

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~35KB | 15 exercises |
| `project.json` | ~8KB | Layered Banking System |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
`new FileReader('data.txt')` won't compile without handling. `arr[10]` compiles fine. Why? Checked vs unchecked. The hook makes the distinction immediately concrete.

### 📚 Teaching (9 Sub-sections)
1. **Throwable hierarchy**: complete tree diagram (Error, checked, unchecked)
2. **Errors**: never catch — fix the code
3. **Checked**: compiler enforces, external failures
4. **Unchecked**: optional, programming bugs
5. **throws keyword**: declare or catch — two options
6. **Catch vs throws**: when each is appropriate
7. **Design philosophy**: checked=external failure, unchecked=bug
8. **Modern view**: Spring's preference for unchecked

### 🛠️ Worked Example: Three-Layer Application
DataAccess declares `throws IOException`. UserService catches IOException and rethrows as unchecked ServiceException. UserController catches ServiceException at the boundary. This is the exact architecture of every Spring Boot application.

### 🏢 3 Industry Examples
- Spring Boot DataAccessException (checked→unchecked translation)
- Bank statement import pipelines (multiple checked exceptions)
- Android APIs (checked for external resources)

### 🎤 Interview Section
THE most common exception interview question: checked vs unchecked. Full answer framework provided. Also: why Spring uses unchecked, what `throws` means, whether to catch RuntimeException.

### ⚠️ 4 Common Gaps
1. **confusing_checked_unchecked** — runtime test: does it compile without try-catch?
2. **forgetting_throws_on_checked** — compile error: 'Unhandled exception type'
3. **catching_error** — never catch Error
4. **throws_means_throw** — declaration vs statement

### 💪 15 Exercises (745 XP)
Key exercises:
- **Ex 4 (debug)**: Fix missing throws — compile error that teaches the rule
- **Ex 8**: Spring-style checked→unchecked wrapping
- **Ex 10**: Three-layer architecture
- **Ex 13**: Library API with correct exception design choices
- **Ex 14**: JDBC-style layered flow
- **Ex 15 (95 XP)**: Full payment exception hierarchy — checked PaymentException, unchecked InvalidPaymentException family

### 🚀 Mini-Project: Layered Banking System
DataLayerException (checked) in repository, BankingException family (unchecked) in service, full exception handling in presentation. With InsufficientFundsException carrying available/attempted fields.

---

## Key Design Insight

Ex 15 and the project both demonstrate **exception hierarchy design** — the hardest skill here. Rule of thumb:
- External failures that callers MUST plan for → checked
- Business rule violations that indicate invalid usage → unchecked (IllegalArgument, InsufficientFunds)
- Infrastructure errors that bubble up → unchecked wrapper (DataAccessException)

---

## Connections

- **T7.1**: try/catch/finally syntax — builds directly on it
- **T7.3 (next)**: Custom exceptions — design your own hierarchy
- **T7.4**: Defensive programming — when to throw vs when to return null
- **T7.5**: Try-with-resources — handles checked IOException from Closeable

---

## Review Checklist

- [ ] Exception hierarchy diagram is accurate and complete
- [ ] checked=external failure / unchecked=bug distinction is clear
- [ ] throws vs throw confusion addressed
- [ ] Ex 15 payment hierarchy — verify catch order (specific before general)
- [ ] Project DataLayerException is checked, BankingException is unchecked — this is the key design choice
- [ ] Spring pattern (checked→unchecked wrap) explained in teaching and demonstrated in ex 8

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T7.1 | T7.2 | Trend |
|--------|------|------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~15K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 735 | 745 | Stable |

**Module 7 Progress**: 2/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 34 topics complete (20% of 170 — a milestone!)

**Next**: Topic 7.3 — Custom Exceptions
