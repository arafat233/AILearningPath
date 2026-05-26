# Topic 12.3: Mocking with Mockito

**Module**: M12 - Unit Testing with JUnit 5
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T12.1 (JUnit 5 Basics), T5.3 (Interfaces)

---

## What This Topic Teaches

1. Why mocking — test one class in isolation, no real infrastructure
2. `@ExtendWith(MockitoExtension.class)` — activates Mockito annotations
3. `@Mock` — creates a fake implementation of an interface/class
4. `@InjectMocks` — creates the class under test, injects `@Mock` fields
5. `when(mock.method(arg)).thenReturn(value)` — stub return values
6. `when(mock.method(arg)).thenThrow(exception)` — stub exceptions
7. `doNothing().when(mock).voidMethod()` — stub void methods
8. `doThrow().when(spy).voidMethod()` — stub void on spies
9. `verify(mock).method(arg)` — assert a method was called
10. `verify(mock, times(n)).method()` — assert call count
11. `verify(mock, never()).method()` — assert NOT called
12. `verifyNoInteractions(mock)` — assert nothing called
13. `any()`, `anyString()`, `eq(literal)` — argument matchers (all or none)
14. `@Captor` / `ArgumentCaptor` — capture what was passed
15. `InOrder` — verify call sequence
16. `@Spy` / `Mockito.spy()` — real object with stubbed methods

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Flipkart Order Service Test Suite |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
OrderService depends on OrderRepository and EmailService. Without mocking: need real DB, real SMTP server, tests are slow and fragile. With Mockito: 5ms, no infrastructure, full control.

### 📚 Teaching (6 Sub-sections)
1. **Mockito setup**: Maven dep, @ExtendWith, @Mock, @InjectMocks
2. **Stubbing**: when().thenReturn(), successive calls, thenAnswer()
3. **Exception stubbing**: when().thenThrow(), doThrow() for void
4. **verify()**: basic, times(), never(), verifyNoInteractions, InOrder
5. **Argument matchers**: any(), anyString(), eq() — all or none rule
6. **Captor + Spy**: @Captor, getValue(), @Spy doReturn()

### 🛠️ Worked Example: OrderService
5 tests covering happy path, repo failure, zero-qty validation, ArgumentCaptor, and InOrder. All 5 pass with zero real infrastructure.

### ⚠️ 3 Common Gaps
1. **mixing_matchers_and_literals** — must use eq() to wrap literals with matchers
2. **when_on_spy_calls_real_method** — use doReturn().when(spy) for spy methods
3. **verify_without_stubbing** — unstubbed reference returns null → NPE in service

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 11 (60 XP)**: InOrder — debit → credit → audit sequence
- **Ex 12 (65 XP)**: Full user registration — happy path + 3 failure modes
- **Ex 13 (70 XP)**: Spy with doReturn — stub tax rate, real sum logic
- **Ex 14 (75 XP)**: ArgumentCaptor for AuditEntry — 4-field assertAll
- **Ex 15 (95 XP)**: Razorpay payment service — 6 tests, all Mockito features

### 🚀 Mini-Project: Flipkart Order Service
4 dependencies mocked. 6 tests covering: happy path, out-of-stock, payment failure with inventory rollback, invalid input, ArgumentCaptor, InOrder. This is production-quality test coverage.

---

## The Mockito Cheat Sheet

```java
// Setup:
@ExtendWith(MockitoExtension.class)
class MyTest {
    @Mock  MyRepository repo;      // fake
    @Mock  EmailService  emailSvc; // fake
    @InjectMocks MyService service; // real, injected with fakes
    @Captor ArgumentCaptor<Order> captor;

// Stub:
    when(repo.findById("U01")).thenReturn(Optional.of(user));
    when(repo.save(any())).thenReturn(savedUser);
    when(repo.findById("bad")).thenThrow(new NotFoundException());
    doThrow(new EmailException()).when(emailSvc).send(any());

// Act:
    User result = service.getUser("U01");

// Assert result + verify interactions:
    assertEquals("Aisha", result.getName());
    verify(repo).findById("U01");
    verify(emailSvc, never()).send(any());
    verifyNoInteractions(emailSvc);  // nothing called

// Captor:
    verify(repo).save(captor.capture());
    assertEquals("PENDING", captor.getValue().getStatus());

// InOrder:
    InOrder order = inOrder(repo, emailSvc);
    order.verify(repo).save(any());
    order.verify(emailSvc).send(any());
}
```

---

## The #1 Rule: If you use ANY matcher, ALL args must be matchers

```java
// WRONG:
when(repo.find("Aisha", anyInt())).thenReturn(user);

// RIGHT:
when(repo.find(eq("Aisha"), anyInt())).thenReturn(user);
```

---

## Review Checklist

- [ ] eq() requirement for mixed matchers — clearly demonstrated
- [ ] doReturn() vs when() for spies — emphasized
- [ ] Ex 5: doThrow for void method (deleteById) — not thenThrow
- [ ] Ex 15: inventory.restoreStock called after gateway throws
- [ ] Unstubbed mock returns — ex 1 predictions correct

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T12.2 | T12.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~65 min | ~70 min | Stable |
| Word count | ~13K | ~14K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 700 | 720 | Stable |

**Module 12 Progress**: 3/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Files**: 4

**Course Progress**: 58 topics complete (34.1% of 170)

**Next**: Topic 12.4 — Testing I/O and HTTP
