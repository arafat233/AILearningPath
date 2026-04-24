# profile — E2E Report

| Metric | Value |
|---|---|
| Date | 12/4/2026, 4:21:29 pm |
| Passed | 3 |
| Issues | 4 |
| Skipped | 0 |

## ❌ Issues — Fix These

### Issue 1: avatar / user name is visible

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: [class*="rounded-full"], text=Test Bot >> nth=0
Expected: visible
Error: Unexpected token "=" while parsing css selector "[class*="rounded-full"], text=Test Bot". Did you mean to CSS.escape it?

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for [class*="rounded-full"], text=Test Bot >> nth=0[22m

```
</details>

_Duration: 1.9s_

---

### Issue 2: plan badge or subscription info is visible

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: [class*="badge"], text=Free, text=Pro, text=Plan >> nth=0
Expected: visible
Error: Unexpected token "=" while parsing css selector "[class*="badge"], text=Free, text=Pro, text=Plan". Did you mean to CSS.escape it?

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for [class*="badge"], text=Free, text=Pro, text=Plan >> nth=0[22m

```
</details>

_Duration: 5.2s_

---

### Issue 3: profile input fields are visible and editable

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('input, select').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('input, select').first()[22m

```
</details>

_Duration: 9.4s_

---

### Issue 4: Save button is present and clickable

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('button[type="submit"], button:has-text("Save")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('button[type="submit"], button:has-text("Save")').first()[22m

```
</details>

_Duration: 9.1s_

---

## ✅ Checks That Passed

- ✅ page loads at /profile without crash
- ✅ page heading is visible
- ✅ Save button submits and stays on /profile

