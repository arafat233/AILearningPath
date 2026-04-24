# practice — E2E Report

| Metric | Value |
|---|---|
| Date | 12/4/2026, 4:23:56 pm |
| Passed | 1 |
| Issues | 4 |
| Skipped | 13 |

## ❌ Issues — Fix These

### Issue 1: page loads with "Practice" heading

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed

Locator: locator('h1')
Expected substring: [32m"Practice"[39m
Received string:    [31m"Your personalAI study coach"[39m
Timeout: 5000ms

Call log:
[2m  - Expect "toContainText" with timeout 5000ms[22m
[2m  - waiting for locator('h1')[22m
[2m    9 × locator resolved to <h1 class="text-[32px] font-black text-[var(--label)] tracking-tight leading-tight mb-3">…</h1>[22m
[2m      - unexpected value "Your personalAI study coach"[22m

```
</details>

_Duration: 6.9s_

---

### Issue 2: "Select Topic" section is visible

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed

Locator: locator('text=Select Topic')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeVisible" with timeout 5000ms[22m
[2m  - waiting for locator('text=Select Topic')[22m

```
</details>

_Duration: 8.3s_

---

### Issue 3: topic buttons are visible

**Error:**
```
Error: No topic buttons and no loading indicator — topics failed to load
```

_Duration: 3.1s_

---

### Issue 4: "Start Practice →" is disabled when no topic selected

**Error:**
```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeDisabled[2m([22m[2m)[22m failed
```

<details><summary>Full stack</summary>

```
Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeDisabled[2m([22m[2m)[22m failed

Locator: locator('button:has-text("Start Practice")')
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
[2m  - Expect "toBeDisabled" with timeout 5000ms[22m
[2m  - waiting for locator('button:has-text("Start Practice")')[22m

```
</details>

_Duration: 10.1s_

---

## ✅ Checks That Passed

- ✅ selecting a topic enables "Start Practice →"

## ⏭️ Skipped

- ⏭️ question text and answer options are visible
- ⏭️ "← Topics" back button is visible
- ⏭️ session score counter is visible
- ⏭️ confidence buttons (low / medium / high) are visible
- ⏭️ clicking a confidence level highlights it
- ⏭️ "💡 Get Hint" button is visible before answering
- ⏭️ "Get Hint" fetches and shows a hint
- ⏭️ clicking answer option shows feedback (Correct / Incorrect)
- ⏭️ feedback card has "Next Question →" button
- ⏭️ "Report this question" flag button is visible after answering
- ⏭️ "Report" flag changes to "Reported — thanks"
- ⏭️ "Next Question →" loads next question
- ⏭️ "← Topics" returns to topic selector
