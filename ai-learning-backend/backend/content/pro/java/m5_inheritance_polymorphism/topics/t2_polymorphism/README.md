# Topic 5.2: Polymorphism

**Module**: M5 - Inheritance & Polymorphism
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: Topic 5.1 (Inheritance Basics)

---

## What This Topic Teaches

Students will:
1. Define polymorphism precisely ('many forms')
2. Understand upcasting (subclass as parent type — implicit, safe)
3. Master runtime method dispatch (object type determines which override runs)
4. Distinguish compile-time type (reference) from runtime type (actual object)
5. Write polymorphic methods (accept parent type, works for all subclasses)
6. Apply the Open/Closed Principle via polymorphism
7. Understand the Liskov Substitution Principle (and its classic violation)
8. Downcast safely using instanceof
9. Know when instanceof is a design smell

---

## Why This Topic Matters

Polymorphism is THE reason Java's design philosophy works. Without it:
- Spring dependency injection fails
- Collections framework breaks
- Every library API that accepts interfaces/abstract types stops working

With it: you write code once that handles types you haven't even defined yet. This is the killer app.

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~30KB | Main content |
| `exercises.json` | ~34KB | 15 progressive exercises |
| `project.json` | ~8KB | Content Delivery System (OTT) |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Payment platform problem — adding new payment types requires adding if-else branches everywhere. Polymorphism solution: `processPayment(PaymentMethod)` works for ALL types, now and forever. Students FEEL the payoff before the formal explanation.

### 📚 Teaching (8 Sub-sections)
1. **Intro**: Definition, preview of what was already seen in 5.1
2. **Upcasting**: Storing subclass as parent — safe, implicit
3. **Runtime dispatch**: The heart — reference type for compile, object type for runtime
4. **Polymorphic method**: Write once, works for all — Open/Closed
5. **Liskov Substitution**: The formal rule + Square/Rectangle violation
6. **Downcasting**: Explicit cast + ClassCastException risk
7. **instanceof**: Safe guard before downcast, pattern matching syntax
8. **Reference vs object type**: The unifying concept, getClass() clarity

### 🛠️ Worked Example: Payment Processing System
Four payment types (CreditCard, UPI, NetBanking) + PaymentEngine that handles all:
- PaymentMethod base with validate() and pay()
- Each subclass overrides both
- PaymentEngine.processPayment() calls polymorphically — NEVER changes
- Rejected payment (CreditCard over limit) demonstrates validate() polymorphism

Real Razorpay/Stripe architecture.

### 🏢 4 Industry Examples
- Spring DI (the premier real-world polymorphism use case)
- Payment gateways (Stripe, Razorpay)
- Java Collections (List, Collection interfaces)
- Game AI (enemy attack patterns)

### 🎤 Interview Section
Top-tier questions:
- What is runtime polymorphism (dynamic dispatch)?
- Liskov Substitution Principle
- Compile-time vs runtime polymorphism
- instanceof usage and when it's a design smell
- Open/Closed Principle

### ⚠️ 5 Common Gaps
1. calling_subclass_method_on_parent_ref — compile error
2. unsafe_downcast_without_instanceof — runtime crash
3. confusing_reference_type_object_type — fundamental misunderstanding
4. overusing_instanceof — design smell
5. lsp_violation — design flaw

### 💪 15 Exercises (735 XP)
Highlights:
- **Ex 4**: Fix compile error (parent ref can't call subclass method)
- **Ex 9**: Fix unsafe downcast → ClassCastException
- **Ex 10**: Tax calculator (SalaryIncome, FreelanceIncome, RentalIncome)
- **Ex 13**: Logger strategy (NullLogger silences — real pattern)
- **Ex 14**: Discount pipeline (chainable discounts via polymorphism)
- **Ex 15 (100 XP)**: Event processing pipeline — real framework design

Exercise 15 is the capstone: AuditHandler logs everything, AlertHandler uses instanceof to filter. Mirrors Spring's ApplicationEventPublisher.

### 🚀 Mini-Project: Content Delivery System (OTT)
- Movie, Series, Podcast, LiveStream extending ContentItem
- DeliveryEngine.deliver(ContentItem) — the polymorphic engine
- Adding a 5th type (bonus) proves engine needs no changes
- Real Hotstar/Netflix backend architecture

The bonus `generateReport()` using instanceof (counting types) shows acceptable instanceof use — NOT as a design smell but as a reporting tool.

---

## Key Pedagogical Moment

The phrase students need to internalize:

> "Reference type determines WHAT you can call. Object type determines WHICH implementation runs."

This is taught in the worked example, reinforced in exercises 1, 2, 12. When students get this, polymorphism clicks.

---

## Connections

- **Topic 5.1**: Polymorphism was teased — now formalized
- **Topic 5.3 (next)**: Abstract classes make pay()/deliver() mandatory
- **Topic 5.4**: Interfaces enable polymorphism without inheritance
- **Future Spring topics**: DI is polymorphism at scale
- **Future Collections**: ArrayList<Shape> uses polymorphism implicitly

---

## Review Checklist

### Technical Accuracy
- [ ] Upcasting is implicit/safe, downcasting explicit/risky
- [ ] Runtime dispatch correctly explained
- [ ] LSP violation (Square/Rectangle) accurate
- [ ] instanceof syntax correct (including pattern matching)

### Content Quality
- [ ] Hook compelling (payment system)
- [ ] Open/Closed Principle explained clearly
- [ ] Worked example shows engine + all payment types

### Exercises
- [ ] Fix parent-ref compile error (ex 4)
- [ ] Fix unsafe downcast (ex 9)
- [ ] Polymorphic accumulation (ex 6, 10)
- [ ] Logger/strategy pattern (ex 13)
- [ ] Discount pipeline (ex 14)
- [ ] Event system (ex 15)

### Project
- [ ] OTT system is realistic
- [ ] DeliveryEngine doesn't change with new types
- [ ] Bonus 5th type proves Open/Closed

---

## Pipeline Performance

| Metric | T5.1 | T5.2 | Trend |
|--------|------|------|-------|
| Generation time | ~70 min | ~70 min | Stable |
| Word count | ~16K | ~15K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 715 | 735 | Stable |

**Module 5 Progress**: 2/? topics (estimated 6 total)

---

## Production Stats

- **Generation time**: ~70 minutes
- **Word count**: ~15,000 words
- **Files**: 4

**Course Progress**: 23 topics complete (13.5% of 170)

**Next**: Topic 5.3 — Abstract Classes
