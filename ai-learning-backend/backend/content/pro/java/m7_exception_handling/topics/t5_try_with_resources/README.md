# Topic 7.5: Try-With-Resources

**Module**: M7 - Exception Handling  
**Difficulty**: ⭐⭐⭐⭐ (4/10)  
**Estimated Time**: 50 minutes  
**Status**: 🟡 READY FOR REVIEW  
**Prerequisites**: T7.1 (try/catch/finally), T5.4 (interfaces)

---

## What This Topic Teaches

1. `AutoCloseable` interface — what makes a class usable in try-with-resources
2. Basic try-with-resources syntax — close() called automatically
3. Close is guaranteed — on normal exit AND on exception
4. Multiple resources — declared together, closed in reverse order
5. Suppressed exceptions — when close() also throws
6. Implementing `AutoCloseable` in custom classes
7. Idempotent close() — safe to call multiple times
8. When try-with-resources vs when finally is still needed
9. Common patterns: file reading, file writing, JDBC

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~36KB | 15 exercises |
| `project.json` | ~6KB | Inventory CSV Import System |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Side-by-side: 15-line finally boilerplate (with 3 pain points highlighted) vs 3-line try-with-resources. Immediate visceral motivation.

### 📚 Teaching (8 Sub-sections)
1. **AutoCloseable**: the interface, common implementors table
2. **Basic syntax**: declaration in try header, scope, close order
3. **Multiple resources**: semicolons, reverse close order (LIFO, with reason)
4. **Suppressed exceptions**: primary survives, close() exception attached not lost
5. **Custom AutoCloseable**: closed flag, idempotent, IllegalStateException guard
6. **When still use finally**: non-resource cleanup (logging, timing, lock release)
7. **Common patterns**: file read, file write, JDBC triple-resource

### 🛠️ Worked Example: CSV Report Generator
BufferedReader + PrintWriter + custom ReportSession — three resources, two in one try. Shows real pattern of StringWriter declared outside (to read result after close).

### 🏢 3 Industry Examples
- Spring Boot / JDBC (connection pool exhaustion without proper close)
- Zerodha settlement file processing (read + write with guaranteed cleanup)
- Android StrictMode (flags resource leaks in development)

### 🎤 Interview Section
Key questions: how to ensure resources are always closed, what is AutoCloseable, resource leak definition, suppressed exceptions, when NOT to use try-with-resources.

### ⚠️ 4 Common Gaps
1. **declaring_resource_outside_try** — not managed by try-with-resources
2. **catching_exception_from_close** — suppressed, not directly catchable
3. **non_autocloseable_in_try_header** — compile error
4. **not_closing_multiple_jdbc_resources** — all three JDBC resources need closing

### 💪 15 Exercises (715 XP)
Key exercises:
- **Ex 1, 2**: Predict output — closing order fundamentals
- **Ex 7**: Idempotent close() with state flag
- **Ex 8**: Three resources, verified LIFO order
- **Ex 9 (60 XP)**: Suppressed exceptions demo
- **Ex 11**: Refactor old finally code to try-with-resources
- **Ex 13 (80 XP)**: TransactionManager — full AutoCloseable with commit/rollback
- **Ex 15 (95 XP)**: Complete JDBC simulation — all three resources, suppressed exceptions

### 🚀 Mini-Project: Inventory CSV Import System
Full data pipeline: read CSV (BufferedReader), validate each row (ImportException), write reports (PrintWriter). All resources in try-with-resources. Per-row exception handling for partial batch success. Entire Module 7 toolkit in one project.

---

## Module 7 Complete — Summary

---

## 📊 Module 7 Statistics

| Topic | Title | XP | Status |
|-------|-------|----|--------|
| 7.1 | try/catch/finally | 735 | ✅ |
| 7.2 | Exception Types | 745 | ✅ |
| 7.3 | Custom Exceptions | 730 | ✅ |
| 7.4 | Defensive Programming | 740 | ✅ |
| 7.5 | Try-With-Resources | 715 | ✅ |
| **TOTAL** | | **3,665** | **✅ COMPLETE** |

**5 topics · 75 exercises · 5 mini-projects**

---

## 🎓 Module 7 — What Students Can Now Do

After Modules 1-7, a student can write professional-quality Java that:
- **Handles failures gracefully** — try/catch/finally for all exception paths
- **Communicates failures clearly** — custom exceptions with domain data
- **Validates inputs defensively** — fail fast, guard clauses, null safety
- **Manages resources safely** — try-with-resources, no leaks
- **Designs exception hierarchies** — checked vs unchecked, appropriate parent types
- **Reads stack traces** — find where the actual bug is

This is the standard for production Java backend code.

---

## 🔜 Module 8: Lambda Expressions & Streams

The paradigm shift from imperative to functional programming:

```java
// Before (Module 6 Collections style):
List<String> names = new ArrayList<>();
for (Employee e : employees) {
    if (e.getSalary() > 80000) {
        names.add(e.getName());
    }
}
Collections.sort(names);

// After (Module 8 Streams):
List<String> names = employees.stream()
    .filter(e -> e.getSalary() > 80000)
    .map(Employee::getName)
    .sorted()
    .collect(Collectors.toList());
```

Planned topics:
- **8.1** Lambda Expressions — anonymous functions
- **8.2** Functional Interfaces — Predicate, Function, Consumer, Supplier
- **8.3** Stream API — filter, map, sorted, collect
- **8.4** Stream collectors — groupingBy, counting, joining
- **8.5** Optional — null-safe functional chaining

---

## Review Checklist

- [ ] Suppressed exceptions section clear and accurate
- [ ] Multiple resources LIFO order explained with the *why*
- [ ] AutoCloseable idempotent pattern shown in teaching and exercise 7
- [ ] Ex 15 JDBC simulation — verify output is correct
- [ ] Project uses only try-with-resources (no manual finally) — verify
- [ ] Module 7 complete summary stats are correct

---

## Review Outcome

**Reviewer**: _________________  
**Date**: _________________  
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T7.3 | T7.4 | T7.5 | Trend |
|--------|------|------|------|-------|
| Generation time | ~65 min | ~65 min | ~60 min | Stable |
| Word count | ~13K | ~14K | ~12K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 730 | 740 | 715 | Stable |

**Module 7 Progress**: 5/5 topics ✅ COMPLETE

---

## Production Stats

- **Generation time**: ~60 minutes
- **Word count**: ~12,000 words  
- **Files**: 4

**Course Progress**: 37 topics complete (21.8% of 170)
