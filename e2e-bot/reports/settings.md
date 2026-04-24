# settings — E2E Report

| Metric | Value |
|---|---|
| Date | 12/4/2026, 4:21:29 pm |
| Passed | 8 |
| Issues | 2 |
| Skipped | 0 |

## ❌ Issues — Fix These

### Issue 1: "Save changes" shows success message

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=updated successfully, text=Saving').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 10000ms[22m
[2m  - waiting for locator('text=updated successfully, text=Saving').first()[22m

```
</details>

_Duration: 12.0s_

---

### Issue 2: Subscription / plan info is visible

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=Current Plan, text=Free, text=Upgrade').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('text=Current Plan, text=Free, text=Upgrade').first()[22m

```
</details>

_Duration: 8.9s_

---

## ✅ Checks That Passed

- ✅ page loads at /settings without crash
- ✅ "Settings" heading is visible
- ✅ Full Name input is visible and editable
- ✅ Exam Date input is visible
- ✅ Grade select dropdown has options
- ✅ Study Goal select has 4 goal options
- ✅ "Save changes" button is visible and enabled
- ✅ "Upgrade"/"Manage" button navigates to /pricing

