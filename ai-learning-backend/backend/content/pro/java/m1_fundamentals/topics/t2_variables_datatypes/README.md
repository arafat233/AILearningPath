# Topic 1.2: Variables & Data Types

**Module**: M1 - Java Fundamentals
**Difficulty**: ⭐⭐ (2/10)
**Estimated Time**: 45 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topic 1.1 (Hello World & Setup)

---

## What This Topic Teaches

Students will:
1. Understand all 8 Java primitive types (byte, short, int, long, float, double, char, boolean)
2. Choose appropriate types based on data characteristics
3. Use `String` (reference type) for text
4. Apply `final` keyword for constants
5. Follow Java naming conventions (camelCase, SCREAMING_SNAKE_CASE)
6. Recognize integer overflow risks
7. Understand why `double` shouldn't be used for money
8. Spot integer division gotchas

---

## Why This Topic Matters

This is THE foundation. Every line of Java code uses variables. Beyond syntax, choosing types is engineering judgment. Senior devs distinguish themselves by type choices. We're treating types with the seriousness they deserve — not just "here's how to make a variable."

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | 17KB | Main content — hook through reflection |
| `exercises.json` | 28KB | 15 progressive exercises |
| `project.json` | 8KB | "Profile Card Generator" mini-project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 The Hook
Opens with the Citibank $900M error — a real-world disaster caused by misunderstanding types. Sets the stakes: types matter in production.

### 📚 Direct Teaching
- **8 primitives explained** — when to use each, with size/range
- **Real engineering thinking** — when `int` is wrong, when `double` causes bugs
- **String as reference type** — clear distinction from primitives
- **`final` keyword** — proper constant declaration
- **`var` keyword (Java 10+)** — modern type inference

### 🛠️ Worked Example: Payroll Calculator
Real scenario: building a payroll system for a startup. Demonstrates type choice reasoning. Calculates tax, take-home pay. Output is a clean payroll summary.

### 🏢 Industry Examples
- Razorpay/Stripe: using `long` for paise/cents
- Uber/Ola: lat/long as double, IDs as long
- Twitter: famous int→long migration when users exceeded 2.1B
- Banking: BigDecimal for production money

### 🎤 Interview Relevance
5 common interview questions related to types:
- int vs Integer
- Why not double for money
- Range of int
- When to use long
- Primitive vs reference types

### ⚠️ 6 Common Gaps Tracked
1. `int_overflow` — using int for huge numbers
2. `double_for_money` — precision issues
3. `primitive_vs_reference_confusion` — String quotes mix-ups
4. `uninitialized_variable` — using before assigning
5. `type_mismatch_assignment` — wrong type conversions
6. `naming_too_short` — cryptic variable names

### 💪 15 Exercises (615 XP total)
- 3 warmup (fill-in-blank)
- 3 easy (code from scratch + predict output)
- 6 medium (debug, refactor, type challenges)
- 3 hard (build full apps with calculations)

Specifically tests:
- Integer division gotcha (3/2 = 1 in int math)
- int overflow (5+ billion needs long)
- Type conversion and casting
- `final` keyword semantics
- Naming conventions

### 🚀 Mini-Project: Profile Card Generator
Build a developer profile card for a community platform. Forces students to use 6+ variables with correct types, calculate derived values (engagement score), use constants, format output professionally. AI hints limited to 5 (project teaches type thinking — must do it themselves).

---

## Tone Calibration (Matching Topic 1)

Same tone profile: Professional & Friendly, Encouraging, Modern Casual.

Examples:
- ❌ "Variables are like little boxes that hold stuff!" (too kiddy)
- ❌ "A variable is a memory location with a type-bound symbolic identifier..." (too academic)
- ✅ "A variable is a named storage location with a specific type. Three parts: a TYPE, a NAME, and a VALUE."
- ✅ "Last year, Citibank made a $900 million payment error. The cause? Software that didn't validate which type of payment was being sent."

---

## Diversity & Inclusion

Real names from various backgrounds throughout: Priya Sharma, Aisha Khan, Raj Patel. Indian-context examples (₹ for currency, Razorpay) alongside global (Twitter, banking). No assumed prior context.

---

## What I'm Uncertain About

1. **Exercise difficulty curve** — Exercise 15 (Savings Goal) might be borderline too complex for "Topic 2" — uses 5+ variables and chained calculations. Could simplify if needed.

2. **var keyword introduction** — Mentioned briefly in teaching section. Should we cover it more explicitly or save for later? My call: brief mention now, full coverage when it adds value.

3. **BigDecimal mention** — Referenced for "production money" but not taught yet. Some students might want to learn it immediately. Should we add a sidebar?

4. **Long literal suffix** — Taught L suffix (5234891753L) but didn't explain why lowercase 'l' is discouraged. Should add note.

5. **Project's engagement score formula** — Left open-ended (bonus). Some students might want explicit formula. Trade-off: creativity vs guidance.

---

## Review Checklist

### Technical Accuracy
- [ ] All 8 primitive types correctly described
- [ ] All code samples compile
- [ ] All test cases match expected output
- [ ] Integer division behavior accurate
- [ ] Floating-point precision examples correct

### Content Quality
- [ ] Hook compelling (Citibank example)
- [ ] Type choice reasoning explained, not just "use X"
- [ ] Worked example realistic
- [ ] Real-world examples accurate

### Tone
- [ ] Adult-appropriate
- [ ] Not condescending
- [ ] Career-relevant without being pushy

### Exercises
- [ ] Difficulty curve smooth from 1→6
- [ ] Variety of types
- [ ] Hints helpful but not solutions
- [ ] Gap detection mapped correctly

### Project
- [ ] Achievable in 30 min
- [ ] Realistic scenario (developer profile)
- [ ] AI policy appropriate (limited hints)

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Production Stats

- **Generation time**: ~50 minutes
- **Total word count**: ~10,500 words
- **Exercise count**: 15 (615 XP available)
- **Files created**: 4

This is **Topic 2 of 170** for Java. Pipeline holding steady.

---

## Pipeline Performance Tracking

| Metric | Topic 1 | Topic 2 | Notes |
|--------|---------|---------|-------|
| Generation time | ~45 min | ~50 min | Slight increase (more complex topic) |
| Word count | 7,500 | 10,500 | Variables needs more explanation |
| Exercises | 15 | 15 | Consistent |
| XP available | 545 | 615 | Slightly more due to harder problems |
| Tone consistency | ✓ | ✓ | Same profile maintained |

**Pace projection**: At 50 min per topic, 170 topics ≈ 140 hours of generation. At 3 sessions/week (2 topics each), ≈ 14 months. At 5 sessions/week, ≈ 8.5 months.
