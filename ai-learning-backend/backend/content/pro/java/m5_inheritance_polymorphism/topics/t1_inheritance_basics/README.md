# Topic 5.1: Inheritance Basics

**Module**: M5 - Inheritance & Polymorphism
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: All of Module 4

---

## 🚀 Module 5 Begins — The Second OOP Pillar

Module 4 gave students the first pillar (encapsulation). Module 5 introduces INHERITANCE — the mechanism behind every Java framework.

---

## What This Topic Teaches

Students will:
1. Understand inheritance as the 'is-a' relationship
2. Use the `extends` keyword
3. Understand what subclasses inherit (public/protected members)
4. Call parent constructors with `super(args)`
5. Call parent methods with `super.method()`
6. Override methods with `@Override`
7. Use `protected` access correctly
8. Follow multi-level inheritance chains
9. Know when to use `final` class/method
10. Distinguish private (not inherited) from protected (inherited)
11. Distinguish composition (has-a) from inheritance (is-a)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~32KB | Main content |
| `exercises.json` | ~34KB | 15 progressive exercises |
| `project.json` | ~9KB | Insurance Policy Hierarchy project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
The zoo management problem — Dog, Cat, Bird all duplicating `name`, `age`, `makeSound`. Clear, concrete motivation for inheritance. Students immediately see the code duplication problem.

### 📚 Teaching (10 Sub-sections)
1. **Intro**: Inheritance = is-a relationship, subclass gets parent's members
2. **is-a vs has-a**: The most important design decision in OOP
3. **extends + protected**: Syntax, what's inherited, protected access
4. **super keyword**: Constructor chaining + method reuse
5. **Method overriding**: Same signature, @Override, rules
6. **protected access**: Full access modifier table
7. **Inheritance chain**: Multi-level, single inheritance, method lookup
8. **final class/method**: Preventing extension, String as example
9. **What's NOT inherited**: Private fields, constructors — and how to work around

### 🛠️ Worked Example: Employee Hierarchy
Manager, Developer extending Employee:
- Static auto-ID in Employee
- super() first in each subclass
- getDescription() extended with super.getDescription()
- Employee[] holding all types — POLYMORPHISM preview
- giveRaise() works for all via inheritance

### 🏢 4 Industry Examples
- Spring Framework (Controller → BaseController chains)
- Android development (Activity → AppCompatActivity)
- Exception hierarchies (Throwable → Exception → RuntimeException)
- Game engines (GameObject → Enemy → Boss)

### 🎤 Interview Section
Mainstay questions:
- What is inheritance? What problem does it solve?
- Inheritance vs composition — key differences
- super keyword uses
- final class/method
- Single vs multiple inheritance

### ⚠️ 7 Common Gaps Tracked
1. **forgetting_super_constructor** — compilation error
2. **super_not_first** — ordering error
3. **inheriting_without_is_a** — design mistake
4. **accessing_private_field_directly** — compile error
5. **overriding_with_wrong_signature** — silent overload instead
6. **forgetting_override_annotation** — silently missing
7. **narrowing_access_in_override** — weaker access

### 💪 15 Exercises (715 XP)
Strong progression covering all patterns:
- **Warmup**: Trace inherited method, fill blank extends/super, simple hierarchy
- **Easy**: Override method, **fix missing super()**, super.method() pattern
- **Medium**: Three-level chain, **Animal[] polymorphism preview**, **fix private access debug**, Account hierarchy, override toString hierarchy, trace resolution
- **Hard**: Complete vehicle chain, Employee salary polymorphism, Notification framework hierarchy

Ex 14 (salary calculation) is particularly elegant: Employee[] with different calculateSalary() implementations — pure polymorphism preview.

Ex 15 (Notification) mimics real framework patterns (Spring's @EventListener, Android's onResume, etc.).

### 🚀 Mini-Project: Insurance Policy Hierarchy
Real insurance product catalog:
- InsurancePolicy base (auto-id, validated, Object methods)
- HealthInsurance: coverage + deductible (added to annual cost)
- CarInsurance: own-damage % (added to annual cost)
- LifeInsurance: sum assured + nominee
- Polymorphic array + total cost calculation

PolicyBazaar/HDFC Life style architecture.

---

## Connections

- **Module 4 ALL**: Private/protected, constructors with super(), @Override from toString
- **Topic 5.2 (next)**: Polymorphism formalized — what we previewed in ex 8 and ex 14
- **Topic 5.3**: Abstract classes — forcing subclasses to implement methods
- **Topic 5.4**: Interfaces — multiple 'inheritance' style in Java

---

## Diversity & Inclusion

- Indian names: Aisha, Raj, Priya, Vikram
- Insurance scenario set in Indian context (PolicyBazaar, HDFC)
- Globally applicable: vehicle hierarchy (Toyota, Honda, Tesla)

---

## What I'm Uncertain About

1. **Protected vs private in fields** — Used protected name in Employee (not ideal from encapsulation standpoint). Decision: demonstrate it, note that private + getter is preferred.

2. **Polymorphism teased before formal coverage** — Ex 8 and the worked example use Animal[]/Employee[]. Decision: intentional teaser for Topic 5.2.

3. **Multiple inheritance** — Mentioned briefly (Java doesn't support it). Decision: brief mention, interfaces in 5.4.

4. **super() when parent has no-arg constructor** — Not explicitly shown (Java adds it automatically). Decision: covered in gap: when it matters.

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M4 avg | T5.1 | Trend |
|--------|--------|------|-------|
| Generation time | ~67 min | ~70 min | Stable |
| Word count | ~15.2K | ~16K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | ~720 | 715 | Stable |

**Module 5 Progress**: 1/? topics (estimated 6 topics)

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~16,000 words
- **Files**: 4

**Course Progress**: 22 topics complete (12.9% of 170)

**Next**: Topic 5.2 — Polymorphism (formalizing what we previewed here)
