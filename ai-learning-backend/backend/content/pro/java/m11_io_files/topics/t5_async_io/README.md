# Topic 11.5: Async I/O with HttpClient and CompletableFuture

**Module**: M11 - I/O, Files, and Networking
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 60 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T10.5 (CompletableFuture), T11.4 (HttpClient)

---

## 🎉 Module 11 Final Topic

Topic 11.5 is the convergence point of two modules: **Module 10 (Concurrency)** and **Module 11 (I/O)**. sendAsync is the bridge — it applies CompletableFuture to real-world HTTP calls.

---

## What This Topic Teaches

1. `client.sendAsync(request, bodyHandler)` → `CompletableFuture<HttpResponse<T>>`
2. Returns immediately — no thread blocked
3. Chain: `.thenApply(r -> checkStatus(r))` → `.thenApply(body -> parseJson(body))`
4. Checked exceptions in thenApply → wrap as RuntimeException
5. Per-request `exceptionally(ex -> defaultValue)` for graceful degradation
6. Fan-out: stream → map to sendAsync → collect List of CFs
7. `allOf(futures.toArray()).thenRun(() -> join each)` — wait for all
8. `join()` inside thenRun is instant (futures already done)
9. `anyOf()` — fastest CDN / fastest replica wins
10. `thenCompose` for sequential async HTTP steps
11. Main thread needs `.join()` on final CF (or return CF to framework)
12. Blocking vs async: when each wins

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~42KB | 15 exercises |
| `project.json` | ~8KB | Razorpay Async Payment Dashboard (no_ai) |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Sequential HTTP with Future.get() = threads blocked. sendAsync + allOf = all fire simultaneously, total time = slowest one. Flipkart search page: 8 microservices in ~100ms instead of ~800ms.

### 📚 Teaching (6 Sub-sections)
1. **sendAsync vs send**: returns CF immediately; chain is identical to any CF
2. **Chaining parse**: thenApply status check → thenApply Jackson parse; exception handling
3. **Fan-out collect**: stream → map to sendAsync → List<CF> → allOf → thenRun
4. **Error handling**: exceptionally per CF; don't let one failure break all
5. **anyOf**: redundant requests to multiple sources; fastest wins
6. **Blocking vs async**: decision guide

### 🛠️ Worked Example: Async Stock Aggregator
6 symbols fetched in parallel with simulated 50-130ms delays. Total: ~80ms vs ~540ms sequential. BADSTOCK triggers 404 → exceptionally → StockQuote.unknown(). Sorted dashboard with portfolio value.

### ⚠️ 3 Common Gaps
1. **join_in_stream_map** — joins inside .map() makes it sequential; no speedup
2. **exception_wrapping_in_then_apply** — checked exceptions → RuntimeException wrapper
3. **not_joining_main_thread** — .join() at end or program exits before async work

### 💪 15 Exercises (715 XP)
Key exercises:
- **Ex 4 (30 XP)**: Sequential vs parallel timing — see the speedup
- **Ex 9 (60 XP)**: Full async stock dashboard with Jackson parse
- **Ex 11 (60 XP)**: Product page with 3 parallel services
- **Ex 13 (70 XP)**: Async price comparison — best price wins
- **Ex 14 (75 XP)**: Retry with exponential backoff
- **Ex 15 (95 XP)**: Full async payment aggregation — M11 synthesis

### 🚀 Module 11 Capstone: Razorpay Async Payment Dashboard (no_ai)
3 regional APIs, sendAsync fan-out, TypeReference JSON parse, allOf collect, Files.writeString + PrintWriter output. Full Module 11 synthesis. Total time ≈ slowest region.

---

## The Key Pattern

```java
// ❌ Sequential — defeats async purpose:
futures.stream()
    .map(sym -> client.sendAsync(req(sym), h).thenApply(parse).join()) // blocks each!
    .collect();

// ✅ Correct fan-out:
List<CompletableFuture<Quote>> futures = symbols.stream()
    .map(sym -> client.sendAsync(req(sym), h)
        .thenApply(r -> parse(r.body()))
        .exceptionally(ex -> Quote.empty()))
    .collect(Collectors.toList());                // all fire NOW

CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
    .thenRun(() -> futures.stream()
        .map(CompletableFuture::join)             // instant — already done
        .forEach(System.out::println))
    .join();                                      // main blocks once
```

---

## Module 11 Complete — Statistics

| Topic | Title | XP |
|-------|-------|----|
| 11.1 | NIO File API | 675 |
| 11.2 | Buffered I/O | 700 |
| 11.3 | CSV and JSON | 710 |
| 11.4 | Java HttpClient | 690 |
| 11.5 | Async I/O | 715 |
| **TOTAL** | | **~3,490** |

**5 topics · 75 exercises · 5 mini-projects · ~66,000 words**

---

## Review Checklist

- [ ] Join inside thenRun clearly explained as instant (allOf guarantees completion)
- [ ] Main thread .join() requirement: in demo yes; in server framework no
- [ ] Ex 10: output is submission order (f1, f2, f3) not completion order
- [ ] Ex 15 totals: 7 SUCCESS, 3 FAILED, 2 PENDING = 12 total; ₹15,748 SUCCESS
- [ ] Capstone: no_ai policy clearly stated

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Course Progress After Module 11

| Metric | Value |
|--------|-------|
| Topics complete | **57 / 170 (33.5%)** |
| Modules complete | **11 / 34** |
| Total XP | ~40,175 |
| Total exercises | 850 |

---

## 🔜 Module 12: Databases with JDBC

```java
// Connect:
Connection conn = DriverManager.getConnection(url, user, password);

// Query:
PreparedStatement stmt = conn.prepareStatement(
    "SELECT * FROM products WHERE price < ?");
stmt.setDouble(1, 2000.0);
ResultSet rs = stmt.executeQuery();
while (rs.next()) {
    System.out.println(rs.getString("name") + ": ₹" + rs.getInt("price"));
}
```

Module 12 topics:
- 12.1: JDBC Basics — connect, query, insert, update, delete
- 12.2: PreparedStatement and SQL injection prevention
- 12.3: Transactions and ACID properties
- 12.4: Connection pooling with HikariCP
- 12.5: Introduction to JPA/Hibernate

**The progression**: Module 12 adds persistence — your Java apps now survive restarts.
