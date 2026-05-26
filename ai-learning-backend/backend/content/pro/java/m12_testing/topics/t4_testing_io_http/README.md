# Topic 12.4: Testing I/O and HTTP

**Module**: M12 - Unit Testing with JUnit 5
**Difficulty**: ⭐⭐⭐⭐⭐ (5/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T12.3 (Mockito), T11.1 (NIO Files), T11.4 (HttpClient)

---

## What This Topic Teaches

1. `@TempDir Path tempDir` — JUnit creates + auto-deletes a real temp directory
2. `tempDir.resolve("file.csv")` — create path inside temp dir
3. `Files.writeString(path, csvContent)` — write test data to @TempDir
4. `Files.readAllLines(path)` — assert on file output
5. `Files.readString(path)` — assert on full file content
6. `Files.exists(path)` — verify file was created
7. `Files.createFile(path)` — create empty test file
8. `static @TempDir Path sharedDir` — shared across all tests vs per-test
9. `StringReader` → `BufferedReader` — test I/O without files
10. `StringWriter` → `PrintWriter` — capture output as String
11. `@Mock HttpResponse<String> response` — typed mock for HTTP
12. `when(response.statusCode()).thenReturn(200)` — stub status
13. `when(response.body()).thenReturn(jsonString)` — stub body
14. `when(client.send(any(), any())).thenReturn(response)` — stub HTTP call
15. `ArgumentCaptor<HttpRequest>` — capture and verify URL

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | Data Pipeline Test Suite |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Manual file cleanup in tests breaks when tests fail. @TempDir is JUnit's built-in solution — real files, zero cleanup code, always safe.

### 📚 Teaching (5 Sub-sections)
1. **@TempDir**: lifecycle, resolve(), per-test vs shared static
2. **Writing test files**: Files.writeString, multiple files per dir
3. **Asserting file output**: exists(), readAllLines(), readString()
4. **StringReader/Writer**: test I/O without filesystem
5. **Mocking HttpClient**: typed @Mock, stub statusCode + body, requestCaptor

### 🛠️ Worked Example: InventoryReportService
6 tests: valid CSV, empty, malformed rows, non-existent file, write report, full round-trip. All @TempDir. Zero file cleanup code.

### ⚠️ 3 Common Gaps
1. **hardcoded_temp_paths** — always tempDir.resolve(), never /tmp/test.csv
2. **not_checking_tempdir_file_exists** — assertTrue(Files.exists(path)) before reading
3. **httpclient_response_type_mismatch** — @Mock HttpResponse<String> response (typed!)

### 💪 15 Exercises (720 XP)
Key exercises:
- **Ex 7 (55 XP)**: CSV parser — 4 tests including quoted fields
- **Ex 11 (65 XP)**: Full log analyser — read + analyse + write report
- **Ex 12 (65 XP)**: API client URL captor — verify correct URL
- **Ex 13 (70 XP)**: CSV-to-JSON converter — 5 tests including round-trip
- **Ex 14 (75 XP)**: Zerodha stock client — 5 HTTP tests
- **Ex 15 (95 XP)**: Inventory sync — @TempDir + @Mock combined

### 🚀 Mini-Project: Data Pipeline Test Suite
CSV reading + HTTP enrichment + JSON report writing. @TempDir for files, @Mock HttpClient for API. 6+ tests covering all paths including partial failures and URL verification.

---

## The Two Patterns

### File Testing with @TempDir
```java
@Test
void writeReport_creates_correctContent(@TempDir Path tempDir) throws Exception {
    // 1. Write input:
    Path csvFile = tempDir.resolve("input.csv");
    Files.writeString(csvFile, "name,price\nMouse,799\n");

    // 2. Run service:
    Path report = tempDir.resolve("report.txt");
    service.generateReport(csvFile, report);

    // 3. Assert output:
    assertTrue(Files.exists(report));
    String content = Files.readString(report);
    assertTrue(content.contains("Mouse"));
}
// tempDir auto-deleted — no cleanup needed
```

### HTTP Testing with @Mock
```java
@Mock HttpClient httpClient;
@Mock HttpResponse<String> httpResponse;  // MUST be typed!

@Test
void fetchData_200_returnsResult() throws Exception {
    when(httpResponse.statusCode()).thenReturn(200);
    when(httpResponse.body()).thenReturn("{\"data\":\"value\"}");
    when(httpClient.send(any(), any())).thenReturn(httpResponse);

    Result r = service.fetchData("url");
    assertEquals("value", r.getData());
}
```

---

## Review Checklist

- [ ] @Mock HttpResponse<String> — typed parameter shown clearly
- [ ] @TempDir per-method vs static @TempDir distinction
- [ ] Ex 3: StringReader wraps the string — try-with-resources for BufferedReader
- [ ] Ex 15: when(response.statusCode()).thenReturn(200, 500) — first/second call
- [ ] Worked example: malformed row skips via null + filter(nonNull)

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T12.3 | T12.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~70 min | ~65 min | Stable |
| Word count | ~14K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 720 | 720 | Stable |

**Module 12 Progress**: 4/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Files**: 4

**Course Progress**: 59 topics complete (34.7% of 170)

**Next**: Topic 12.5 — Test-Driven Development (TDD) — Module 12 Final
