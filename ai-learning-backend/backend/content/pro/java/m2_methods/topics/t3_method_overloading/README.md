# Topic 2.3: Method Overloading

**Module**: M2 - Methods & Code Organization
**Difficulty**: ⭐⭐⭐ (3/10)
**Estimated Time**: 45 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topics 2.1, 2.2

---

## What This Topic Teaches

Students will:
1. Understand method overloading (same name, different signatures)
2. Recognize what makes overloads legal vs invalid
3. Predict which overload Java calls based on argument types
4. Understand type promotion rules in overload resolution
5. Distinguish overloading from overriding (preview)
6. Use varargs (`...`) for flexible argument counts
7. Recognize when to overload vs when to use different method names
8. Read overloaded APIs in the Java standard library

---

## Why This Topic Matters

Overloading is everywhere in Java. `System.out.println()` has 10+ overloads. `Math.max()` has 4. `StringBuilder.append()` has 15+. If you can't read overloads, you can't read Java documentation.

But equally important: knowing when NOT to overload. Over-overloading is a real anti-pattern in messy codebases.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~28KB | 15 progressive exercises |
| `project.json` | ~9KB | Build Your Own Print Library project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Opens with the realization that `System.out.println()` has 10 overloads — and students have been using overloaded methods since Hello World without knowing. Establishes the topic as something they've been benefiting from already.

### 📚 Comprehensive Teaching (8 Sub-sections)
1. **Intro**: Definition + simple example
2. **What makes overload legal**: 3 ways to differ + 2 things that don't differ
3. **How Java picks**: Compile-time resolution + type promotion
4. **Real-world overloading**: println, Math.max, Math.abs, StringBuilder.append
5. **When to overload**: Good reasons vs bad reasons (with code examples)
6. **Overloading vs overriding**: Quick comparison, defers full coverage
7. **Varargs introduction**: `int... numbers` syntax, when to use
8. **Constructor overloading preview**: Sets up OOP module

### 🛠️ Worked Example: Build a Logger
Builds an overloaded Logger class — directly mirroring how Log4j/SLF4J work in production. Four overloads of `log()`. Demonstrates:
- Same intent, different parameter combinations
- How Java picks based on types (String, String) vs (String, int)
- Convenience overloads for common cases

This is exactly the pattern students will see in every Java backend service.

### 🏢 4 Industry Examples
- Java standard library (println, Math, String)
- Logging libraries (Log4j, SLF4J)
- Spring Framework (JdbcTemplate.query overloads)
- JSON libraries (ObjectMapper.readValue)

### 🎤 Interview Section
Covers common questions:
- 'What is method overloading?'
- 'Can two methods differ only in return type?' (NO — common trick)
- 'What's the difference between overloading and overriding?' (common confusion)
- Output prediction with type promotion

### ⚠️ 6 Common Gaps Tracked
1. differ_by_return_type_only — most common attempt
2. differ_by_parameter_name_only — sneaky mistake
3. ambiguous_overloads
4. overloading_unrelated_operations
5. confusing_overloading_with_overriding
6. too_many_overloads

### 💪 15 Exercises (635 XP)
Strong progression:
- **Warmup**: which overload runs, fill in overload, add three-param overload
- **Easy**: fix illegal overload (return-type only), String concatenation overload, type promotion prediction
- **Medium**: area calculator, print method overloads, fix parameter-name-only attempt, greeting library, **varargs introduction**, complex promotion trace
- **Hard**: overloaded logger, currency format overloads, shape calculator with overloading + varargs

### 🚀 Mini-Project: Build Your Own Print Library
Build a Display class with multiple `print` overloads — exactly how System.out.println is structured. Goal: clean CLI library API. Bonus features add varargs, semantic methods (error/success/warning), and aligned formatting.

After this project, students understand HOW the Java standard library is built.

---

## Tone Calibration

Strong examples:
- ✅ "Java picks the right one based on what you pass in. That's method overloading — multiple methods with the same name, different parameters."
- ✅ "Overloading isn't a fancy technique — it's how Java's core library is built."
- ✅ "Bad API design feels like fighting your tools; good API design feels invisible."

Industry-relevant throughout. Honest about when overloading is overkill.

---

## Connections to Other Topics

- **Module 1 Topic 1.2**: Type promotion rules referenced
- **Module 2 Topic 2.2**: Method signatures fully introduced
- **Module 2 Topic 2.4**: Scope follows naturally
- **Future OOP module**: Constructor overloading + overriding contrast

---

## Diversity & Inclusion

Maintained. Examples reference Indian and global tech contexts (Indian fintech for logging, global standard library examples).

---

## What I'm Uncertain About

1. **Type promotion depth** — Covered with examples but not exhaustive table. Risk: students hit edge cases. Decision: keep practical, full reference can be linked.

2. **Varargs introduction** — Mentioned but not deeply taught. Used in some exercises and project bonus. Risk: feels incomplete. Decision: brief intro now, full coverage doesn't have a dedicated topic but reappears in collection-related modules.

3. **Constructor overloading preview** — Mentioned to plant seed. Risk: confusing if OOP feels far away. Decision: brief mention, points to OOP module.

4. **Ex 7 area calculator with boolean param** — Triangle uses a boolean param just to differentiate from rectangle. This is mildly awkward (real code would use different names). Note added to exercise. Decision: teaches the concept, even if not best practice.

5. **No 'method resolution' diagram in worked example** — Could add visual showing how Java picks. Decision: visual_aid description covers this, full diagram in companion visualizations.

---

## Review Checklist

### Technical Accuracy
- [ ] Overload rules correctly stated
- [ ] Type promotion path accurate (byte → short → int → long → float → double)
- [ ] All compilation error explanations correct
- [ ] Varargs syntax correct

### Content Quality
- [ ] Hook surprising (println has 10 overloads)
- [ ] Worked example mirrors real libraries
- [ ] Industry examples concrete
- [ ] When-NOT-to-overload section helpful

### Exercises
- [ ] Multiple compile-error debugging exercises
- [ ] Type promotion thoroughly tested
- [ ] Varargs introduced gently
- [ ] FizzBuzz-equivalent: logger overloads

### Project
- [ ] Print library scenario realistic
- [ ] All overload types exercised
- [ ] Bonus features valuable but optional

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance Tracking

| Metric | T2.1 | T2.2 | T2.3 | Trend |
|--------|------|------|------|-------|
| Generation time | ~50 min | ~55 min | ~50 min | Stable around 50-55 |
| Word count | ~12,000 | ~13,500 | ~12,500 | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 630 | 750 | 635 | Varies by topic complexity |
| Tone match | ✓ | ✓ | ✓ | Stable |

**Module 2 Progress**: 3/5 topics complete (60%)

**Module 2 Running Totals**:
- Words: ~38,000
- Exercises: 45
- XP: 2,015
- Mini-projects: 3

---

## Production Stats

- **Generation time**: ~50 minutes
- **Word count**: ~12,500 words
- **Files**: 4

**Next**: Topic 2.4 — Variable Scope & Lifetime
