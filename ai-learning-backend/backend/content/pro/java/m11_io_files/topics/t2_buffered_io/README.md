# Topic 11.2: Buffered I/O and Character Streams

**Module**: M11 - I/O, Files, and Networking
**Difficulty**: ⭐⭐⭐⭐ (4/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T11.1 (NIO File API), T7.5 (try-with-resources)

---

## What This Topic Teaches

1. Java I/O hierarchy: byte streams (InputStream/OutputStream) vs char streams (Reader/Writer)
2. `BufferedReader` — adds 8KB buffer + `readLine()` to any Reader
3. `Files.newBufferedReader(path)` — preferred file→BufferedReader
4. `readLine()` returns null at EOF — the loop termination idiom
5. `BufferedWriter` — buffers writes for efficiency
6. `PrintWriter` — adds print/println/printf formatting to any Writer
7. Production stack: `PrintWriter → BufferedWriter → FileWriter`
8. `InputStreamReader` — byte-to-char bridge with encoding
9. `OutputStreamWriter` — char-to-byte bridge
10. `Scanner` — convenient but slow; nextInt/nextLine mismatch trap
11. `StringReader/StringWriter` — in-memory I/O (useful for testing)
12. Why buffering matters — system call reduction, 10-100x speedup

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Server Log Analyser |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Files.readAllLines() works for files. But network sockets? Console input? Process streams? Those need `BufferedReader wrapping InputStreamReader wrapping InputStream`. Understanding this reveals how Spring MVC reads HTTP request bodies.

### 📚 Teaching (6 Sub-sections)
1. **I/O hierarchy**: byte vs char streams; InputStreamReader as bridge
2. **BufferedReader**: wrapping, readLine(), Files.newBufferedReader()
3. **BufferedWriter + PrintWriter**: production output stack
4. **InputStreamReader**: from InputStream to readable chars; charset matters
5. **Scanner**: convenience vs speed; the nextInt+nextLine trap
6. **StringReader/StringWriter**: in-memory I/O for testing

### 🛠️ Worked Example: Log Analyser
BufferedReader readLine loop → parse ERROR/WARN/INFO → aggregate by level and endpoint → PrintWriter formatted report. Classic read-process-write pipeline.

### ⚠️ 3 Common Gaps
1. **forgetting_to_wrap_with_buffered** — FileReader alone is 100x slower
2. **scanner_nextint_nextline_mismatch** — consume leftover \\n after nextInt()
3. **printwriter_no_buffered_wrapper** — PrintWriter alone is unbuffered

### 💪 15 Exercises (700 XP)
Key exercises:
- **Ex 10 (40 XP)**: Scanner trap — trace the nextInt + nextLine mismatch
- **Ex 11 (60 XP)**: Formatted portfolio table with printf alignment
- **Ex 13 (70 XP)**: Line number file merger — two BufferedReaders
- **Ex 15 (95 XP)**: Multi-file sales aggregator

### 🚀 Mini-Project: Server Log Analyser
15-line server log → BufferedReader parse → per-endpoint stats → PrintWriter formatted report. Error rates, slow request detection, aligned tabular output.

---

## The Stack to Memorise

```
Reading text from any source:
  InputStream (bytes) → InputStreamReader (charset) → BufferedReader (readLine)

Writing formatted text:
  PrintWriter (printf) → BufferedWriter (buffer) → FileWriter/OutputStream

For files specifically:
  Files.newBufferedReader(path)   ← preferred read
  Files.newBufferedWriter(path)   ← preferred write
  new PrintWriter(Files.newBufferedWriter(path))  ← formatted write
```

---

## Review Checklist

- [ ] Ex 3 word count: "Aisha"(5)+"Raj"(3)+"Priya"(5) = 13 chars (not 15 — fix the exercise hint)
- [ ] Ex 10 Scanner trap: s1='' (empty), s2='Aisha' — confirmed
- [ ] Ex 15 revenue calculation: verify totals match test output
- [ ] Production wrapping order: PrintWriter → BufferedWriter → FileWriter (class MUST go in this order)
- [ ] InputStreamReader charset example includes StandardCharsets.UTF_8

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T11.1 | T11.2 | Trend |
|--------|-------|-------|-------|
| Generation time | ~60 min | ~65 min | Stable |
| Word count | ~13K | ~13K | Stable |
| Exercises | 15 | 15 | Consistent |
| XP available | 675 | 700 | Stable |

**Module 11 Progress**: 2/5 topics complete

---

## Production Stats

- **Generation time**: ~65 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 52 topics complete (30.6% of 170)

**Next**: Topic 11.3 — CSV and Structured Data Processing
