# Topic 7.3: Custom Exceptions

**Module**: M7 - Exception Handling
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T7.1, T7.2

---

## What This Topic Teaches

1. Defining custom exception classes (minimal structure)
2. Choosing the right parent: RuntimeException vs Exception
3. Two-constructor pattern: (message) and (message, cause)
4. Domain-specific final fields with getters
5. Exception message conventions (entity + operation + reason)
6. Exception hierarchy design (base + subclasses)
7. When to create custom vs use built-in exceptions
8. Wrapping third-party exceptions in custom ones
9. Exceptions as API contracts (self-documenting method signatures)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~8KB | Flipkart Order System |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Side-by-side: `throw new RuntimeException("Not enough money")` vs `throw new InsufficientFundsException(from, balance, amount)`. The second version's catch block can display amounts, offer top-up — the first can only show a generic message.

### 📚 Teaching (8 Sub-sections)
1. **Minimal structure**: extends RuntimeException, super(message), two constructors
2. **Domain fields**: final, in constructor, getters — carry structured data
3. **Message conventions**: entity + operation + reason in message
4. **Hierarchy design**: base → specific subclasses; catch specific first
5. **When custom vs built-in**: callers need to catch by name? domain data? API contract?
6. **Exceptions as API contracts**: method signature declares failures
7. **Message quality**: bad 'error' vs good 'User ID-42: email invalid'

### 🛠️ Worked Example: Zomato Order Service
Four-exception hierarchy for order placement. RestaurantClosedException carries openTime. ItemUnavailableException carries itemName. Caller takes specific action on each — not possible with generic exceptions.

### 🏢 3 Industry Examples
- Razorpay SDK custom exceptions with HTTP codes
- Spring Data hierarchy (DataIntegrityViolationException, EmptyResultDataAccessException)
- AWS SDK (AWSServiceException hierarchy with request IDs)

### 🎤 Interview Section
Senior-level: 'Design exceptions for a payment service.' What fields. Why custom vs built-in. userMessage vs technical message separation.

### ⚠️ 4 Common Gaps
1. **forgetting_super_call** — getMessage() returns null
2. **mutable_fields_in_exception** — should be final
3. **overly_generic_hierarchy** — one AppException = still can't catch specifically
4. **exception_message_too_vague** — always include entity ID and constraint

### 💪 15 Exercises (730 XP)
Key exercises:
- **Ex 4**: Domain fields + getters (InsufficientStockException)
- **Ex 7**: Login exception hierarchy (AccountLockedException + InvalidCredentialsException)
- **Ex 8**: Rich OrderException with nullable failedItem
- **Ex 9**: Wrap ParseException in domain exception
- **Ex 13**: Full e-commerce hierarchy (5-class tree)
- **Ex 14 (80 XP)**: API exception with HTTP status codes
- **Ex 15 (95 XP)**: Complete Razorpay-style payment hierarchy

### 🚀 Mini-Project: Flipkart Order Management
`FlipkartException` with errorCode + userMessage separation. CartException/PaymentException branches. ApiController maps types to HTTP status codes. The userMessage distinction is the unique design challenge in this project.

---

## Design Highlight: userMessage vs getMessage()

The project introduces an important real-world pattern:

```java
class FlipkartException extends RuntimeException {
    private final String errorCode;   // for logs: "OUT_OF_STOCK"
    private final String userMessage; // for UI: "Not enough stock"
    
    FlipkartException(String errorCode, String userMessage) {
        super("[" + errorCode + "] " + userMessage);  // technical
        this.userMessage = userMessage;
    }
    
    String getUserMessage() { return userMessage; } // safe for users
}
```

Logs see `[OUT_OF_STOCK] MOUSE-01: requested 100, available 35`. Users see `Not enough stock for your order`. Both from the same exception, cleanly separated.

---

## Review Checklist

- [ ] Two-constructor pattern always provided in examples
- [ ] final fields throughout — no setters on exception fields
- [ ] userMessage vs getMessage() distinction in project is novel and clear
- [ ] Ex 13 hierarchy — verify the tree is implemented correctly
- [ ] Ex 15 Razorpay hierarchy — verify all 5 classes and catch blocks
- [ ] Message conventions: entity + operation + reason

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T7.1 | T7.2 | T7.3 | Trend |
|--------|------|------|------|-------|
| Generation time | ~70 min | ~65 min | ~65 min | Stable |
| Word count | ~15K | ~14K | ~13K | Stable |
| Exercises | 15 | 15 | 15 | Consistent |
| XP available | 735 | 745 | 730 | Stable |

**Module 7 Progress**: 3/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 35 topics complete (20.6% of 170)

**Next**: Topic 7.4 — Defensive Programming
