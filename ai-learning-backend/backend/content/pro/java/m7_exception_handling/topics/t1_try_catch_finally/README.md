# Topic 7.1: try / catch / finally

**Module**: M7 - Exception Handling
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: M3 (Strings), M4 (classes), M6 (collections)

---

## 🚀 Module 7 Begins — Your Programs Stop Crashing

This is the module that separates amateur Java from production Java. After Module 7, code doesn't die on bad input — it responds to it.

---

## What This Topic Teaches

1. What exceptions are (runtime objects representing errors)
2. `try / catch / finally` syntax and flow
3. Execution jumps immediately on exception — remaining try lines skipped
4. Multiple catch blocks — specific types before general
5. Catch order matters (compile error if wrong)
6. Multi-catch: `catch (TypeA | TypeB e)`
7. `finally` — always runs (even with return)
8. Reading stack traces (bottom-up)
9. Common runtime exceptions
10. Exception propagation up the call stack
11. Rethrowing and wrapping exceptions

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~28KB | Main content |
| `exercises.json` | ~34KB | 15 exercises |
| `project.json` | ~8KB | Zerodha Stock Order Validator |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
User types 'abc' where a number is expected → program crashes with stack trace. With try-catch → friendly message, program continues. Immediate visceral motivation.

### 📚 Teaching (11 Sub-sections)
1. **What exceptions are**: objects, thrown, propagate, carry message/stack trace
2. **try-catch syntax**: execution flow, skip after throw point
3. **Exception object**: getMessage(), getClass(), printStackTrace()
4. **Multiple catch blocks**: specific first, general last
5. **Catch order**: compile error for unreachable — enforced
6. **finally**: always runs, even with return
7. **Common exceptions table**: NullPointerException, ArrayIndexOutOfBoundsException, etc.
8. **Propagation**: call stack, stack trace reading guide
9. **Rethrowing**: rethrow same, or wrap in new exception with cause

### 🛠️ Worked Example: EMI Calculator
Real-world Indian fintech context. Three fields parsed (principal, rate, tenure), each can fail. Pattern: parse in try-catch → validate values with if-checks → compute. All error paths return clean Strings, never crash.

### 🏢 4 Industry Examples
- Razorpay payment forms (per-exception handling)
- HDFC NetBanking (never crash, always log)
- Zerodha trading (exception per error type)
- Android (forced exception handling architecture)

### 🎤 Interview Section
- checked vs unchecked (teaser for 7.2)
- finally guarantee
- why not catch Exception everywhere
- logging exceptions correctly

### ⚠️ 5 Common Gaps
1. **catching_exception_too_broadly** — specific types, not Exception
2. **swallowing_exceptions_silently** — never empty catch
3. **wrong_catch_order** — compile error
4. **validating_before_parsing** — parse first, validate value after
5. **using_exceptions_for_control_flow** — not an if/else substitute

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 4 (debug)**: Fix wrong catch order — compilation error
- **Ex 7**: Finally-with-return trace — surprising but logical
- **Ex 11**: Retry logic — exception in a loop
- **Ex 13**: 3-level propagation with rethrow
- **Ex 14**: Nested try-catch (outer finally + inner per-item catch)
- **Ex 15 (95 XP)**: Payment form validator — collects ALL errors, not just first

### 🚀 Mini-Project: Stock Order Validator
Zerodha/Groww style. Validates all fields with specific errors per field. finally for guaranteed logging. OrderBook (Module 6 Map) for accepted orders. Complete production-pattern demo.

---

## Connections

- **M6.2 (HashMap)**: OrderBook uses computeIfAbsent — direct application of Module 6
- **M6.3 (Collections.unmodifiable)**: ordersFor() returns unmodifiable list
- **T7.2 (next)**: Checked vs unchecked exceptions — fully explained after this foundation
- **T7.3**: Custom exceptions — build on this syntax knowledge
- **T7.5**: Try-with-resources — replaces most finally patterns for closeable resources

---

## Review Checklist

- [ ] Execution flow diagram is clear (skip remaining try lines after throw)
- [ ] finally-with-return behavior explained correctly
- [ ] Common exceptions table is accurate and complete
- [ ] Stack trace reading guide (bottom-up) included
- [ ] Ex 15 collects ALL errors — not just first — design is intentional
- [ ] Project finally block logging is feasible with a simple boolean/counter

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M6 avg | T7.1 | Note |
|--------|--------|------|------|
| Generation time | ~67 min | ~70 min | Stable |
| Word count | ~14.1K | ~15K | Slightly up (rich examples) |
| Exercises | 13.3 | 15 | Full set |
| XP available | 717 | 735 | Stable high |

**Module 7 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~15,000 words
- **Files**: 4

**Course Progress**: 33 topics complete (19.4% of 170)

**Next**: Topic 7.2 — Exception Types (checked vs unchecked)
