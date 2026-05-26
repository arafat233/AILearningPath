# Topic 4.4: Object Methods (toString, equals, hashCode)

**Module**: M4 - Object-Oriented Programming Fundamentals
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topics 4.1 (Classes), 4.2 (Constructors), 4.3 (Encapsulation)

---

## What This Topic Teaches

Students will:
1. Understand the Object class as Java's root class
2. Use `@Override` annotation correctly
3. Override `toString()` for readable object representation
4. Override `equals()` following the standard template
5. Use `instanceof` for type checking (with null safety bonus)
6. Override `hashCode()` and understand the equals/hashCode contract
7. Use `Objects.equals` and `Objects.hash` helpers (null-safe, idiomatic)
8. Decide when to override (value classes) vs when not to (services)

---

## Why This Topic Matters

These three methods are THE most consistently overridden in Java. Every JPA entity, every DTO, every value class implements them. Code reviews catch missing/incorrect implementations daily. Misunderstanding the equals/hashCode contract causes silent bugs in HashMap/HashSet behavior at every major company.

Plus: `@Override`, `instanceof`, and `Objects.hash/equals` are core Java vocabulary used daily.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~33KB | Main content |
| `exercises.json` | ~36KB | 15 progressive exercises |
| `project.json` | ~10KB | Contact Deduplication System project |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Direct callback to Module 3's `.equals()` lesson on Strings. Now students understand WHY String.equals worked — it was overridden. Their own classes don't get this for free. Sets up the topic as 'finish what Module 3 started.'

### 📚 Comprehensive Teaching (10 Sub-sections)
1. **Intro**: Object as root class, every class inherits these methods
2. **`@Override` annotation**: Compile-time safety, the trap it prevents
3. **toString**: Default vs custom, called implicitly by println/concat
4. **equals**: The standard template — `==`, `instanceof`, cast, compare
5. **`instanceof`**: Type check + null safety, modern pattern matching mentioned
6. **hashCode**: The equals/hashCode contract, why it matters
7. **Objects utility class**: `Objects.equals` and `Objects.hash` helpers
8. **When to override**: Value classes yes, service classes no
9. **Complete pattern**: Putting it all together

### 🛠️ Worked Example: Product V4
**Completes the Product class evolution arc**:
- Module 3.2: Parallel arrays
- Topic 4.1: Class with public fields
- Topic 4.2: Validating constructor
- Topic 4.3: Encapsulated (private fields, getters/setters)
- **Topic 4.4: First-class Java citizen** (toString, equals, hashCode)

The same Product class now:
- Prints readable info via println
- Compares correctly by id
- Maintains hashCode contract

Real Spring/JPA entities look EXACTLY like this final form.

### 🏢 4 Industry Examples
- JPA / Spring Data entities
- Collections framework (HashSet, HashMap)
- Logging and debugging
- Testing (JUnit's assertEquals)

### 🎤 Interview Section
Top-tier interview topics:
- equals/hashCode contract
- What happens if you override one but not the other
- @Override importance
- Live coding equals()
- instanceof basics
- Records preview (Java 14+)

### ⚠️ 8 Common Gaps Tracked
1. **overriding_equals_not_hashcode** — THE classic violation
2. **equals_wrong_signature** — `Product other` instead of `Object other`
3. **using_double_equals_in_equals** — `==` for Strings inside equals
4. **forgetting_null_check** — NPE in equals
5. **using_at_override_wrong** — compiler errors
6. **inconsistent_fields_equals_hashcode** — different fields in each
7. **using_classes_as_keys_without_override** — HashMap lookups fail
8. **expensive_tostring** — performance issue

### 💪 15 Exercises (740 XP — high)
Strong progression:
- **Warmup**: Add toString, predict default behavior, Person with toString
- **Easy**: Override equals (single field), **fix wrong signature debug**, hashCode with Objects.hash
- **Medium**: **Fix missing hashCode debug**, multi-field equals (Book), complete value class (Money), predict equals trace, find duplicates in array, toString with computed value
- **Hard**: Complete Coordinate class, **fix equals/hashCode mismatch debug**, **Address+Person composition with full Object methods**

The hard finale (ex 15) shows COMPOSITION — Person contains Address — and requires both classes to have proper Object methods for the outer equals to work. Real domain modeling.

### 🚀 Mini-Project: Contact Deduplication System
Build a REAL CRM dedup engine:
- Contact class with case-insensitive email equality
- ContactBook with addContact that detects duplicates
- Bonus: findByEmail, removeByEmail, mergeContact, countByDomain

This is the architecture every CRM (Salesforce, HubSpot, Zoho) uses. Real production logic worth millions to companies.

---

## Tone Calibration

Strong examples:
- ✅ "After today, your classes are FIRST-CLASS Java citizens."
- ✅ "Misunderstanding the equals/hashCode contract has caused real production bugs at every major company."
- ✅ "Every IDE has 'Generate equals and hashCode' shortcuts — these methods are SO standard that tooling auto-generates them."

Direct about real-world stakes, career-aware.

---

## Connections to Other Topics

- **Module 3 .equals on Strings**: Now they implement what String already did
- **Topic 4.3 encapsulation**: Object methods rely on encapsulated state
- **Topic 4.5 (next)**: Static will complete the OOP toolkit
- **Module 5 (Inheritance)**: Object as root makes full sense after inheritance
- **Future Collections module**: HashMap/HashSet require hashCode contract
- **Future Java Records**: Auto-generated equivalent of these patterns

---

## Diversity & Inclusion

- Indian names: Aisha, Raj, Priya, Vikram, Anita
- ₹ currency in examples (Money class)
- Indian context: addresses (Hyderabad, Mumbai)
- Global: CRM scenario applies worldwide

---

## What I'm Uncertain About

1. **`instanceof` pattern matching (Java 16+)** — Mentioned but not deeply taught. Decision: brief mention, traditional form used in main examples. Pattern matching available for advanced learners.

2. **Java records mentioned but deferred** — Records auto-generate these methods. Decision: defer to advanced OOP topic; teach manual implementation first because interviewers ask about it.

3. **Lombok annotations** — Mentioned in industry section. Decision: not formally taught, students should understand the underlying pattern first.

4. **MessageDigest for hashCode** — Some confusion possible between hashCode (collection identity) and cryptographic hashes (security). Decision: stay focused on Object.hashCode purpose.

5. **Comparable interface** — Related but separate (sorting). Decision: defer to dedicated topic when needed.

6. **`Double.compare` for floating-point** — Used in examples without deep explanation. Decision: brief mention, full coverage when relevant for sorting.

7. **CRM project complexity** — High end of mini-project difficulty. Decision: kept because the dedup logic perfectly demonstrates equals/hashCode application.

---

## Review Checklist

### Technical Accuracy
- [ ] Object class hierarchy correctly explained
- [ ] @Override usage and benefits accurate
- [ ] equals template correct (==, instanceof, cast, compare)
- [ ] hashCode contract correctly stated
- [ ] Objects.hash/equals usage accurate

### Content Quality
- [ ] Hook references Module 3 strings
- [ ] Worked example completes the Product arc
- [ ] equals/hashCode contract emphasized strongly
- [ ] Industry examples concrete

### Exercises
- [ ] Override toString (ex 1-3)
- [ ] Override equals basic template (ex 4)
- [ ] Fix wrong signature debug (ex 5)
- [ ] Add hashCode (ex 6)
- [ ] Fix missing hashCode debug (ex 7)
- [ ] Multi-field equals (ex 8)
- [ ] Complete value class (ex 9, 13)
- [ ] Find duplicates (ex 11)
- [ ] Fix mismatch debug (ex 14)
- [ ] Composition with Object methods (ex 15)

### Project
- [ ] Contact dedup is realistic
- [ ] Case-insensitive equality challenge
- [ ] Multiple bonus features available

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance Tracking

| Metric | T4.1 | T4.2 | T4.3 | T4.4 | Trend |
|--------|------|------|------|------|-------|
| Generation time | ~65 min | ~65 min | ~65 min | ~70 min | Stable, slightly up |
| Word count | ~15K | ~16K | ~15K | ~16K | Stable |
| Exercises | 15 | 15 | 15 | 15 | Consistent |
| XP available | 675 | 730 | 725 | 740 | Stable high |
| Tone match | ✓ | ✓ | ✓ | ✓ | Stable |

**Module 4 Progress**: 4/? topics complete (estimated 6-8 total)

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~16,000 words
- **Files**: 4

**Course Progress**: 19 topics complete (11.2% of 170 total)

**Next**: Topic 4.5 — Static Members & Class-Level Data
