# Topic 9.4: Wildcards

**Module**: M9 - Generics
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T9.3 (Bounded Type Parameters), T5.1 (Inheritance)

---

## What This Topic Teaches

1. Generic invariance — why `List<Integer>` is NOT `List<Number>`
2. Why invariance causes problems and how wildcards solve them
3. Unbounded `?` — accepts any parameterized type; reads as Object; can't add
4. Upper bounded `? extends T` — accepts T and subtypes; READ as T; can't add
5. Lower bounded `? super T` — accepts T and supertypes; ADD T; reads as Object
6. PECS rule — Producer Extends, Consumer Super
7. When to use wildcard vs named type parameter
8. Reading Java library signatures with wildcards

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Zomato Search V3 |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
`printAll(List<Number>)` fails to accept `List<Integer>` — even though Integer IS-A Number. Invariance explained. Wildcard solution shown.

### 📚 Teaching (6 Sub-sections)
1. **Invariance**: why it exists, what problem it solves
2. **Unbounded ?**: accepts any list; use for container operations
3. **Upper bounded ? extends T**: reading from a producer
4. **Lower bounded ? super T**: writing to a consumer
5. **PECS rule**: the mnemonic that makes wildcards click
6. **Wildcard vs type parameter**: which to use when

### 🛠️ Worked Example: WildcardUtils
Four methods: sumAll (? extends), fillDefaults (? super), copy (PECS), printInfo (?). Direct analogs to Java's own Collections utility methods.

### 🏢 3 Industry Examples
- Collections.copy / Collections.sort with wildcard signatures
- Stream API — map/flatMap use `? super T`/`? extends R`
- Spring Framework — ApplicationListener, HandlerMethodArgumentResolver

### ⚠️ 3 Common Gaps
1. **cannot_add_to_extends_wildcard** — ? extends = read only
2. **only_object_reads_from_super** — ? super = write + Object reads
3. **list_object_vs_list_wildcard** — List<Object> ≠ List<?>

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 1**: Invariance compile/error — foundational
- **Ex 6 (45 XP)**: PECS copy — the archetypal example
- **Ex 7**: Trace allowed/disallowed operations on wildcards
- **Ex 9**: Shape hierarchy with totalArea — classic OOP+generics
- **Ex 13 (75 XP)**: Merge with nested wildcards
- **Ex 14 (75 XP)**: Sorter<T> with wildcard-based sorted() method
- **Ex 15 (95 XP)**: WildcardCollections — 6 methods, all three wildcard forms

### 🚀 Mini-Project: Zomato Search V3
ChainRestaurant + LocalRestaurant subtypes. All search methods accept `Collection<? extends Restaurant>`. PECS merge. Wildcard in every API boundary.

---

## PECS Quick Reference Card

```
Direction of data flow:
Data flows OUT (reading/iteration) → Producer → ? extends T
Data flows IN (adding/writing)     → Consumer → ? super T
Don't care about type at all       →           → ?

Examples:
void sum(List<? extends Number>)    // reads as Number — extends
void fill(List<? super String>)     // adds Strings — super
void print(List<?>)                 // just needs size/items — unbounded
void copy(List<? super T>, List<? extends T>) // PECS master
```

---

## Review Checklist

- [ ] Invariance motivation clearly explained (the safety argument)
- [ ] All three wildcard forms with cannot-do examples
- [ ] PECS rule presented as a memorable rule with both parts
- [ ] Ex 7 trace — verify all 6 operations are correctly classified
- [ ] Ex 9 Shape hierarchy — verify π×5² ≈ 78.54, 6×10 = 60
- [ ] Project: ChainRestaurant and LocalRestaurant both extend Restaurant

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T9.3 | T9.4 | Trend |
|--------|------|------|-------|
| Generation time | ~65 min | ~65 min | Stable |
| Word count | ~13K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 745 | 720 | Stable |

**Module 9 Progress**: 4/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 46 topics complete (27.1% of 170)

**Next**: Topic 9.5 — Generic Interfaces and Design Patterns (Module 9 Capstone)
