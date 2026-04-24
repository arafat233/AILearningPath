# E2E Bot — Summary Report

| | |
|---|---|
| Run at | 12/4/2026, 4:23:56 pm |
| Duration | 175s |
| Total checks | 22 |
| ✅ Passed | 14 |
| ❌ Failed | 8 |

## 🔴 Components With Issues

> Fix these, then re-run `npm test` to confirm.

### auth  _(3 issues)_

- ❌ **page loads: heading, email/password inputs and Sign In button visible**
  > `Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed`
- ❌ **invalid credentials show error and stay on login page**
  > `TimeoutError: page.click: Timeout 20000ms exceeded.`
- ❌ **valid credentials log in and redirect to dashboard**
  > `TimeoutError: page.click: Timeout 20000ms exceeded.`

### lessons  _(1 issue)_

- ❌ **page loads without crash**
  > `Error: [2mexpect([22m[31mpage[39m[2m).[22mtoHaveURL[2m([22m[32mexpected[39m[2m)[22m failed`

### practice  _(4 issues)_

- ❌ **page loads with "Practice" heading**
  > `Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoContainText[2m([22m[32mexpected[39m[2m)[22m failed`
- ❌ **"Select Topic" section is visible**
  > `Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeVisible[2m([22m[2m)[22m failed`
- ❌ **topic buttons are visible**
  > `Error: No topic buttons and no loading indicator — topics failed to load`
- ❌ **"Start Practice →" is disabled when no topic selected**
  > `Error: [2mexpect([22m[31mlocator[39m[2m).[22mtoBeDisabled[2m([22m[2m)[22m failed`

---
_Individual reports are in the same `reports/` folder._
