# Topic 9.1: Generic Classes

**Module**: M9 - Generics
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T4.1 (OOP), T5.4 (Interfaces), T8.2 (Functional Interfaces)

---

## 🚀 Module 9 Begins — Writing Generic Code

Students have been CONSUMING generics since Module 3. Now they learn to PRODUCE them.

---

## What This Topic Teaches

1. Why generics exist — type safety vs Object + casts
2. Generic class syntax — `class Name<T>`
3. Type parameter naming conventions (T, E, K, V, R, N)
4. Multiple type parameters — `class Pair<A, B>`
5. Fields, constructors, and methods using T
6. Diamond operator `<>` for type inference
7. Type erasure — what happens at runtime
8. Raw types — what they are and why never to use them
9. Generic class with a transformation method (map-style)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Type-Safe Data Pipeline Library |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Before generics: Object + casts → ClassCastException at runtime. After generics: type errors caught at compile time. Side-by-side demonstration with the Pair class.

### 📚 Teaching (7 Sub-sections)
1. **Why generics exist**: the two problems (casts, runtime errors)
2. **Generic class syntax**: `class Name<T>`, where T can appear
3. **Naming conventions**: T, E, K, V, R table
4. **Multiple type parameters**: Pair<A,B>, swap() returning Pair<B,A>
5. **Methods on generic classes**: Stack<T> full implementation
6. **Type erasure**: what the JVM actually sees, why new T() fails
7. **Raw types**: exist for backwards compat only — never use

### 🛠️ Worked Example: Result<T>
A real production pattern — success/failure without exceptions. Shows generic class with two factory methods, map() with its own type parameter, and natural chaining. Used in functional programming styles (Rust/Kotlin inspired).

### 🏢 3 Industry Examples
- Java Collections Framework — ArrayList<E>, HashMap<K,V>
- Spring's ResponseEntity<T> and CrudRepository<T, ID>
- ApiResponse<T> wrapper (universal REST pattern)

### ⚠️ 3 Common Gaps
1. **raw_type_usage** — always provide type parameter
2. **new_T_instantiation** — type parameters can't be instantiated
3. **diamond_operator_confusion** — use `<>` not full type on right side

### 💪 15 Exercises (710 XP)
Progression:
- **Ex 1-3**: Trace, fill-blank, basic Box<T>
- **Ex 4**: Pair<A,B> with swap()
- **Ex 5-6**: Stack<T>, TimedEntry<T>
- **Ex 7**: Triple<A,B,C>
- **Ex 8**: Queue<T>
- **Ex 9**: ApiResponse<T> (real production pattern)
- **Ex 10**: Type safety analysis — C or E
- **Ex 11**: Wrapper<T> with map()
- **Ex 12**: KeyValue<K,V> immutable pair
- **Ex 13 (75 XP)**: Result<T> with chaining
- **Ex 14 (75 XP)**: Page<T> pagination object
- **Ex 15 (95 XP)**: EventBus<E> — type-safe event dispatch

### 🚀 Mini-Project: Type-Safe Data Pipeline Library
Four generic utility classes (Pair, Result, Page, EventBus) as a real mini-library. Key requirement: zero casts in client code.

---

## Key Insight: Producer vs Consumer

Before Module 9:
```java
List<String> names = new ArrayList<>();  // consuming generics
```

After Topic 9.1:
```java
class Box<T> { ... }  // producing generics
Box<String> b = new Box<>("hello");  // back to consuming
```

This mental shift — from "using List<String>" to "writing Box<T>" — unlocks library-level code reuse.

---

## Review Checklist

- [ ] Type erasure section explains why `new T()` fails clearly
- [ ] Raw types — compile vs warning distinction
- [ ] Pair.swap() return type is Pair<B,A> — not Pair<A,B>
- [ ] Result.map() uses `<R>` as its own type parameter
- [ ] Ex 10: Line 6 (raw type) compiles WITH WARNING, not error
- [ ] Ex 15 EventBus: Consumer<E> is the listener type

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M8 avg | T9.1 | Note |
|--------|--------|------|------|
| Generation time | ~65 min | ~65 min | Stable |
| Word count | ~13.4K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 719 | 710 | Stable |

**Module 9 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 43 topics complete (25.3% of 170)

**Next**: Topic 9.2 — Generic Methods
