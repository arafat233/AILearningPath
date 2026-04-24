# auth — E2E Report

| Metric | Value |
|---|---|
| Date | 12/4/2026, 4:23:56 pm |
| Passed | 9 |
| Issues | 3 |
| Skipped | 0 |

## ❌ Issues — Fix These

### Issue 1: page loads: heading, email/password inputs and Sign In button visible

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('button[type="submit"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('button[type="submit"]')[22m

```
</details>

_Duration: 9.9s_

---

### Issue 2: invalid credentials show error and stay on login page

**Error:**
```
TimeoutError: page.click: Timeout 20000ms exceeded.
```

<details><summary>Full stack</summary>

```
TimeoutError: page.click: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for locator('button[type="submit"]')[22m

```
</details>

_Duration: 22.3s_

---

### Issue 3: valid credentials log in and redirect to dashboard

**Error:**
```
TimeoutError: page.click: Timeout 20000ms exceeded.
```

<details><summary>Full stack</summary>

```
TimeoutError: page.click: Timeout 20000ms exceeded.
Call log:
[2m  - waiting for locator('button[type="submit"]')[22m

```
</details>

_Duration: 21.9s_

---

## ✅ Checks That Passed

- ✅ Show/Hide password toggle switches input type
- ✅ "Forgot password?" link navigates to /forgot-password
- ✅ "Create Account" link navigates to /register
- ✅ page loads: heading and all required fields visible
- ✅ password strength bar appears and updates while typing
- ✅ Show/Hide password toggle on register form works
- ✅ "Sign In" link navigates back to /login
- ✅ page loads with email input
- ✅ submitting an email shows confirmation or error (not crash)

