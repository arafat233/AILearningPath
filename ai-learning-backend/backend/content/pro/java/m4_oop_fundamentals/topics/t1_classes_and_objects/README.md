# Topic 4.1: Classes & Objects

**Module**: M4 - Object-Oriented Programming Fundamentals
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Module 2 (methods), Module 3 (especially Topic 3.2 inventory)

---

## 🚀 Module 4 Begins — The Biggest Conceptual Leap

This is THE topic that transforms students from procedural Java programmers to object-oriented Java programmers. Until now, code has been: methods + parallel arrays. After this module: classes + objects.

---

## What This Topic Teaches

Students will:
1. Understand what a class is (blueprint) and an object is (instance)
2. Define classes with fields and instance methods
3. Create objects with the `new` keyword
4. Access fields and methods with dot notation
5. Work with arrays of objects (and the NPE trap)
6. Understand object references (same as array refs)
7. Distinguish instance methods from static methods (clarifies Module 2)
8. Follow Java naming conventions (PascalCase classes, camelCase methods)
9. See the OOP advantage by REFACTORING parallel arrays into classes

---

## Why This Topic Matters

OOP is THE dominant paradigm in production Java. Every Spring service, Android app, banking backend, every modern Java codebase is class-based. Students who understand classes can:
- Read any open-source Java project
- Pass senior interviews
- Build maintainable software
- Think in 'objects' the way professional developers do

The Module 3 parallel-arrays pain becomes the Module 4 OOP solution.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~32KB | Main content |
| `exercises.json` | ~33KB | 15 progressive exercises |
| `project.json` | ~10KB | Movie Library refactor project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
**Directly callbacks Module 3's Inventory Manager pain** — parallel productIds/stocks/prices arrays. Sets up OOP as THE solution. Students immediately understand the WHY.

### 📚 Comprehensive Teaching (10 Sub-sections)
1. **Intro**: Class = blueprint, Object = instance
2. **First class**: Complete Dog example with fields and bark() method
3. **Fields and dot notation**: Default values, accessing members
4. **Instance methods**: Vs static methods, the key shift
5. **Instance vs static revisited**: Module 2 connection clarified
6. **Object references**: Same semantics as arrays (callback to Module 3)
7. **Multiple objects**: Array of objects, NPE trap
8. **Naming conventions**: PascalCase, file name matches public class
9. **Looking ahead**: Preview of Module 4 topics

### 🛠️ Worked Example: Inventory Refactor
**THE pedagogical payoff** — refactors Topic 3.2's parallel-arrays inventory into a `Product` class.

Side-by-side comparison shows:
- 4 arrays → 1 array of self-contained objects
- Sync-the-arrays burden → one update changes all
- Inline print logic → `p.describe()` self-describes

Students FEEL the OOP advantage.

### 🏢 4 Industry Examples
- Every backend service (Spring, Quarkus) — DTOs
- Banking apps (Account, Transaction, Customer classes)
- Android development (every UI extends a class)
- Game development (Player, Enemy, Weapon)

### 🎤 Interview Section
- 'What is a class? Object?' — Foundational
- 'Design a class for X' — Common pattern
- 'Static vs instance methods'
- System design (senior): heavily class-based

### ⚠️ 8 Common Gaps Tracked
1. **forgetting_new** — `Dog d;` is null
2. **null_object_in_array** — array of nulls, must `new` each slot
3. **calling_instance_method_statically** — needs object
4. **expecting_assignment_to_copy** — references shared
5. **using_static_when_instance_needed** — design mistake
6. **class_naming_lowercase** — convention violation
7. **filename_doesnt_match_public_class** — compiler error
8. **fields_accessed_externally** — encapsulation preview

### 💪 15 Exercises (675 XP)
Progression from basics to a mini banking system:
- **Warmup**: Define class, predict output, two-field Person
- **Easy**: Class with method (Rectangle.area), **fix NPE bug**, BankAccount
- **Medium**: Array of objects, **fix array NPE**, reference semantics demo, Student class with method-calling-method, **refactor parallel arrays to objects (Book)**, find max in object array
- **Hard**: Product with describe(), find most expensive (method returns Object), **mini banking system** (multi-class)

The mini banking system (ex 15) brings everything together.

### 🚀 Mini-Project: Movie Library
First OOP refactor exercise. Build a Movie class with describe() method, populate Movie[] array, implement query methods (findHighestRated, countByDirector). Bonus features push deeper.

The director comparison REQUIRES `.equals()` — callback to Module 3's #1 lesson.

---

## Tone Calibration

Strong examples:
- ✅ "After today, you'll never want to use parallel arrays again."
- ✅ "This single conceptual shift is the most important leap in your Java journey."
- ✅ "Games without OOP are unmaintainable past ~1000 lines of code."

Honest, decisive, transformation-focused.

---

## Connections to Other Topics

- **Module 2 statics**: Now clearer in contrast with instance methods
- **Module 3.2 Inventory**: Worked example REFACTORS this
- **Module 3.3 Tic-Tac-Toe**: Project becomes OOP in extensions
- **Topic 4.2 (Constructors)**: Will eliminate the verbose field assignments
- **Topic 4.3 (Encapsulation)**: Will fix the 'anyone can set price = -100' problem
- **Module 4 continues**: this/equals/toString, then inheritance

---

## Diversity & Inclusion

- Indian names: Aisha, Raj, Priya
- ₹ currency in examples
- Inclusive: Nolan/Tarantino/Hirani in movie project (Indian + international directors)

---

## What I'm Uncertain About

1. **Multiple classes in one file** — Used `class Product` (non-public) alongside `public class Main` for simplicity. Real Java code uses one class per file. Decision: simplify for learning, mention briefly that multi-file is the norm in production.

2. **`this` keyword not yet introduced** — Could mention. Decision: defer to next topic (Constructors) where it's needed. Keeps this topic focused.

3. **Encapsulation deferred to Topic 4.3** — Fields are public. Decision: explicitly call it out in worked example ('anyone can set p.price = -999 — we'll fix this').

4. **`null` for object arrays vs primitive arrays** — Different default behaviors. Decision: address in arrays-of-objects section, reinforce with debug exercise.

5. **Constructor preview** — Worked example shows verbose `p.field = value` repeated. Decision: explicitly note 'constructors fix this' to set up next topic.

6. **Object equality** — Used == for object reference in exercise 9 to show shared reference. Didn't use .equals on custom classes (would need override). Decision: keep simple, full coverage in Topic 4.4.

---

## Review Checklist

### Technical Accuracy
- [ ] Class/object distinction clear
- [ ] Reference semantics accurate
- [ ] Naming conventions correct
- [ ] All code examples compile and run

### Content Quality
- [ ] Hook references Module 3 parallel arrays
- [ ] Worked example is a real refactor
- [ ] Industry examples concrete
- [ ] Multiple-objects illustrated

### Exercises
- [ ] NPE for missing `new` (ex 5)
- [ ] NPE for object array (ex 8)
- [ ] Reference semantics demo (ex 9)
- [ ] Parallel-arrays-to-Object refactor (ex 12)
- [ ] Method returns object (ex 14)
- [ ] Multi-class mini banking (ex 15)

### Project
- [ ] Movie Library is engaging
- [ ] Forces .equals() for director comparison
- [ ] Bonus features valuable

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance Tracking

| Metric | M3 avg | T4.1 | Trend |
|--------|--------|------|-------|
| Generation time | ~60 min | ~65 min | Slightly up (richer concept) |
| Word count | ~14.5K | ~15K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | ~670 | 675 | Stable |
| Tone match | ✓ | ✓ | Stable |

**Module 4 Progress**: 1/? topics complete (estimated 6-8 topics)

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~15,000 words
- **Files**: 4

**Course Progress**: 16 topics complete (9.4% of 170 total)

**Next**: Topic 4.2 — Constructors
