# Topic 11.1: NIO File API

**Module**: M11 - I/O, Files, and Networking
**Difficulty**: ⭐⭐⭐ (3/10)
**Estimated Time**: 50 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T7.5 (try-with-resources), T8.3 (Stream API)

---

## 🚀 Module 11 Begins — Connecting Java to the Outside World

After 10 modules of in-memory computation, Module 11 teaches Java to talk to the outside world: files, network streams, HTTP APIs.

---

## What This Topic Teaches

1. `Path` interface — OS-independent file/directory location
2. `Path.of('dir', 'file')` — safe path creation
3. `path.resolve()`, `getParent()`, `getFileName()`, `normalize()`
4. `Files` utility class — the NIO.2 workhorse
5. `Files.readAllLines(path)` → `List<String>` — all at once
6. `Files.lines(path)` → `Stream<String>` — lazy (large files)
7. `Files.readString(path)` → `String` (Java 11+)
8. `Files.writeString(path, content, options...)`
9. `Files.write(path, lines, options...)`
10. `StandardOpenOption`: CREATE, APPEND, TRUNCATE_EXISTING
11. `Files.createDirectories(path)` — mkdir -p equivalent
12. `Files.copy()`, `Files.move()` with `StandardCopyOption`
13. `Files.walk(dir)`, `Files.list(dir)` — directory traversal
14. try-with-resources MANDATORY for Files.lines/walk/list

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~38KB | 15 exercises |
| `project.json` | ~7KB | Inventory CSV Import System |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Old java.io.File: BufferedReader, manual close, no streams. New NIO.2: `Files.readAllLines(Path.of('file.csv'))` — one line. The difference is dramatic.

### 📚 Teaching (6 Sub-sections)
1. **Path interface**: create, navigate, resolve, normalize
2. **Reading**: readAllLines, readString, lines (lazy + try-with-resources)
3. **Writing**: writeString, write, StandardOpenOption
4. **Metadata**: exists, isRegularFile, isDirectory, size, createDirectories
5. **Copy/Move**: with StandardCopyOption
6. **Walking**: walk, list, find — all need try-with-resources

### 🛠️ Worked Example: Order Archiver
Creates directory tree, writes CSVs, processes them with stream operations, writes report, moves files to backup. End-to-end file pipeline using only NIO APIs.

### ⚠️ 3 Common Gaps
1. **not_closing_files_lines_stream** — file handle leak; always try-with-resources
2. **checked_ioexception_in_lambda** — use UncheckedIOException or extract method
3. **path_separator_hardcoding** — use Path.of() not string concatenation

### 💪 15 Exercises (675 XP)
Key exercises:
- **Ex 9 (55 XP)**: Process CSV with Files.lines — skip header, filter+sort
- **Ex 11 (60 XP)**: Archive pattern — move processed files
- **Ex 13 (70 XP)**: Word frequency from file — Files.lines + stream pipeline
- **Ex 14 (70 XP)**: Directory diff — walk two dirs, compare sets
- **Ex 15 (95 XP)**: Full CSV import pipeline with validation and output

### 🚀 Mini-Project: Inventory CSV Import System
Three CSV files → validate → archive or quarantine → summary report. The complete data pipeline pattern used in every ETL system.

---

## The Key Rule

```java
// WRONG — file handle leak:
Stream<String> lines = Files.lines(path);
lines.count();

// RIGHT — always try-with-resources:
try (Stream<String> lines = Files.lines(path)) {
    lines.count();
}
```

This applies to **all three**: `Files.lines()`, `Files.walk()`, `Files.list()`

---

## Review Checklist

- [ ] try-with-resources emphasized for all three stream-returning methods
- [ ] IOException in lambda → UncheckedIOException pattern shown
- [ ] Ex 6: two separate try-with-resources for count and filter (stream single-use)
- [ ] Ex 11: collect to List before iterating (can't move while walking)
- [ ] Ex 15: total revenue calculation verified

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | M11 T1 | Note |
|--------|--------|------|
| Generation time | ~60 min | First M11 topic |
| Word count | ~13K | Stable |
| Exercises | 15 | Consistent |
| XP available | 675 | Slightly lower (simpler topic) |

**Module 11 Progress**: 1/5 topics complete

---

## Production Stats

- **Generation time**: ~60 minutes
- **Word count**: ~13,000 words
- **Files**: 4

**Course Progress**: 51 topics complete (30% of 170)

**Next**: Topic 11.2 — Buffered I/O and Character Streams
