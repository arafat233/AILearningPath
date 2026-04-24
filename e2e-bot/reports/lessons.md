# lessons — E2E Report

| Metric | Value |
|---|---|
| Date | 12/4/2026, 4:23:56 pm |
| Passed | 4 |
| Issues | 1 |
| Skipped | 0 |

## ❌ Issues — Fix These

### Issue 1: page loads without crash

**Error:**
```
Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed

Expected pattern: [32m/lessons/[39m
Received string:  [31m"http://localhost:5173/start"[39m
Timeout: 5000ms

Call log:
[2m  - Expect "toHaveURL" with timeout 5000ms[22m
[2m    9 × unexpected value "http://localhost:5173/start"[22m

```
</details>

_Duration: 6.9s_

---

## ✅ Checks That Passed

- ✅ page heading is visible
- ✅ lesson cards or empty state is shown
- ✅ clicking a lesson navigates into it
- ✅ Next and Prev buttons work inside a lesson

