# Topic 5.3: Abstract Classes

**Module**: M5 - Inheritance & Polymorphism
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topics 5.1, 5.2

---

## What This Topic Teaches

Students will:
1. Declare abstract classes (cannot be instantiated)
2. Declare abstract methods (no body, must be overridden)
3. Mix concrete and abstract methods in one class
4. Use the Template Method design pattern
5. Understand the abstract class hierarchy (abstract extending abstract)
6. Know when a class should be abstract vs concrete
7. Preview the abstract class vs interface decision

---

## Why This Topic Matters

Abstract classes formalize the implied contract of Topic 5.1 inheritance. Every major framework uses them: Spring's AbstractController, Android's Activity lifecycle, JUnit's TestCase, Java's AbstractList. The Template Method pattern is one of the GoF patterns appearing in virtually every enterprise codebase. After this topic, students understand how frameworks CALL your code.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~29KB | Main content |
| `exercises.json` | ~34KB | 15 progressive exercises |
| `project.json` | ~7KB | Media Player Framework project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Shape.area() returning 0.0 — the silent wrong value problem from Topic 5.2. Makes the case that abstract is needed to FORCE subclasses to provide real implementations.

### 📚 Teaching (9 Sub-sections)
1. **Intro**: abstract class and abstract method definitions
2. **Cannot instantiate**: compile-time enforcement
3. **Must implement**: concrete subclass must implement ALL abstract methods
4. **Partial abstract**: concrete + abstract in same class — the common case
5. **Template Method pattern**: parent defines algorithm, abstract = the steps
6. **Abstract in chain**: abstract extending abstract
7. **When to use abstract**: decision framework
8. **vs Interface preview**: key differences ahead of Topic 5.4

### 🛠️ Worked Example: Two systems
1. **Abstract Shape hierarchy** — fixes Topic 5.2 by forcing real area() and describe()
2. **ReportGenerator** — Template Method producing PlainText and HTML from same algorithm

### 🏢 4 Industry Examples
- Spring MVC (AbstractController)
- Android (Activity lifecycle)
- JUnit (TestCase)
- Java Collections (AbstractList)

### ⚠️ 5 Common Gaps Tracked
1. **trying_to_instantiate_abstract** — compilation error
2. **forgetting_to_implement_abstract_method** — must implement all
3. **abstract_method_with_body** — no body allowed
4. **making_concrete_method_abstract** — overuse
5. **confusing_abstract_class_with_interface** — key interview question

### 💪 15 Exercises (760 XP — new high)
Strong progression covering all patterns:
- **Warmup**: Dispatch trace, declare abstract, basic Shape
- **Easy**: Fix instantiation error (debug), fix missing implementation (debug), concrete + abstract mix
- **Medium**: **Template Method coffee** (classic!), payment processor, abstract chain, Tax polymorphism, trace template execution, Report generator template
- **Hard**: Abstract Employee with total cost, Game character + template, **Abstract data pipeline** (ETL preview)

Exercise 15 (100 XP) uses ArrayList (preview of Collections) — noted in hints.

### 🚀 Mini-Project: Media Player Framework
Template Method for audio/video playback lifecycle:
- `final play()` = fixed algorithm
- `loadMedia()`, `startPlayback()`, `stopPlayback()` = abstract steps
- AudioPlayer, VideoPlayer, PodcastPlayer (bonus)
- Mirrors VLC/ffmpeg/Android MediaPlayer architecture

---

## Connections

- **Topic 5.2**: Abstract Shape replaces the placeholder area()=0 design
- **Topic 5.4 (next)**: Interfaces — the other side of the abstract/interface decision
- **Design Patterns**: Template Method (GoF), Strategy (uses interfaces), Factory Method

---

## Review Checklist

- [ ] Abstract cannot instantiate (compile-time enforcement) clearly explained
- [ ] Template method pattern demonstrated concretely
- [ ] Coffee exercise (ex 7) is the classic template method — ensure correctness
- [ ] Abstract in chain (ex 9) — Animal extends Living both abstract
- [ ] Data pipeline (ex 15) uses ArrayList — note this is a preview

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T5.1 | T5.2 | T5.3 | Trend |
|--------|------|------|------|-------|
| Generation time | ~70 min | ~65 min | ~65 min | Stable |
| Word count | ~16K | ~14K | ~14K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 715 | 735 | 760 | Rising |

**Module 5 Progress**: 3/~6 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 24 topics complete (14.1% of 170)

**Next**: Topic 5.4 — Interfaces
