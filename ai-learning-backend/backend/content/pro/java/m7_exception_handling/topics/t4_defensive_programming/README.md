# Topic 7.4: Defensive Programming

**Module**: M7 - Exception Handling
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T7.1, T7.2, T7.3

---

## What This Topic Teaches

1. Fail-fast principle — detect bad input at the entry point
2. `Objects.requireNonNull()` — standard Java null rejection
3. Guard clauses — flat validation, early return/throw
4. Defensive copies — `new ArrayList<>(list)` in constructors, `Collections.unmodifiableList` in getters
5. Precondition pattern — explicit method contracts
6. Immutable class design — `final` fields, no setters
7. Optional — null-safe return for 'might not exist' results
8. Validation boundary — validate at public, trust at private
9. Never use `assert` for production validation

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~23KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~8KB | Healthcare Patient Record System |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Two bugs: NPE buried 12 frames deep in logic (fail slow) vs NPE at entry point with clear message (fail fast). Shared mutable list corrupts object internals. Both are classic production bugs; both prevented by defensive programming.

### 📚 Teaching (9 Sub-sections)
1. **Fail fast**: detect at entry point, not deep in logic
2. **Objects.requireNonNull**: standard pattern, inline assignment
3. **Guard clauses**: nested pyramid → flat top-guards
4. **Defensive copies**: constructor input copy + getter unmodifiable view
5. **Precondition pattern**: state the contract at method start
6. **Immutable design**: final class, final fields, no setters, return new objects
7. **Null returns**: Optional vs throw
8. **Validation boundary**: public methods validate, private trust
9. **Never use assert** for production validation

### 🛠️ Worked Example: BankAccount refactoring
Before: public mutable fields, no validation, returns internal list.
After: final fields, requireNonNull + guard clauses in constructor, IllegalStateException for overdraft, Collections.unmodifiableList for history.

### 🏢 3 Industry Examples
- Google Guava Preconditions (production standard)
- HDFC banking systems (fail-fast mandate in financial software)
- Spring Framework (catch configuration errors at startup)

### 🎤 Interview Section
Code review questions: 'What could go wrong here?' Guard clause definition. Defensive copy need. Fail-fast definition.

### ⚠️ 4 Common Gaps
1. **validating_after_using** — null check after the line that NPEs
2. **not_copying_constructor_list** — shared mutable state
3. **using_assert_for_validation** — disabled at runtime
4. **over_validating_private_methods** — noise; focus on public boundary

### 💪 15 Exercises (740 XP)
Key exercises:
- **Ex 4**: Demonstrate corruption then fix with defensive copy
- **Ex 5**: Full defensive constructor (3 patterns combined)
- **Ex 6 (debug)**: Fix null check that comes after usage
- **Ex 8**: Immutable Money class
- **Ex 9**: Optional for nullable lookup
- **Ex 12**: UserProfile combining all patterns
- **Ex 14**: TransactionValidator with ValidationResult
- **Ex 15 (95 XP)**: AuditedPaymentService — every defensive pattern in one class

### 🚀 Mini-Project: Healthcare Patient Record System
Medical domain forces extreme care. PatientRecord with defensive copies in/out. PatientRegistry with Optional returns. BloodType with static factory validation. TransferRequest with ValidationResult. High stakes = high defensive standard.

---

## Module 7 Progress

After T7.4, students have:
- T7.1: try/catch/finally — catching exceptions
- T7.2: checked vs unchecked — hierarchy and `throws`
- T7.3: custom exceptions — domain-specific types
- **T7.4: defensive programming — preventing exceptions**

One topic remains (T7.5: try-with-resources) to complete the module.

---

## Review Checklist

- [ ] Fail-fast vs fail-slow contrast is clear and concrete
- [ ] Objects.requireNonNull inline assignment pattern shown
- [ ] Defensive copy both ways (constructor in, getter out)
- [ ] Guard clause pyramid → flat refactoring is clean
- [ ] assert vs if+throw distinction clearly stated
- [ ] Optional: isPresent/orElse/map — correct API usage
- [ ] Ex 15 defensive copy of Set in constructor — unique pattern

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T7.2 | T7.3 | T7.4 | Trend |
|--------|------|------|------|-------|
| Generation time | ~65 min | ~65 min | ~65 min | Stable |
| Word count | ~14K | ~13K | ~14K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 745 | 730 | 740 | Stable |

**Module 7 Progress**: 4/5 topics complete — one topic remaining!

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~14,000 words
- **Files**: 4

**Course Progress**: 36 topics complete (21.2% of 170)

**Next**: Topic 7.5 — Try-with-resources (Module 7 final topic)
