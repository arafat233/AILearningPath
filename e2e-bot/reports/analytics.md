# analytics — E2E Report

| Metric | Value |
|---|---|
| Date | 12/4/2026, 4:21:29 pm |
| Passed | 4 |
| Issues | 1 |
| Skipped | 0 |

## ❌ Issues — Fix These

### Issue 1: Accuracy stat is displayed

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=Accuracy, text=Overall, text=Score').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('text=Accuracy, text=Overall, text=Score').first()[22m

```
</details>

_Duration: 7.4s_

---

## ✅ Checks That Passed

- ✅ page loads at /analytics without crash
- ✅ page heading is visible
- ✅ stat cards or data sections are visible
- ✅ no critical JS console errors on load

