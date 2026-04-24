@echo off
setlocal

echo.
echo  ============================================================
echo    AI Learning E2E Test Bot
echo    Opens a real Chrome browser, logs in, and tests every
echo    button on every page — just like a human would.
echo  ============================================================
echo.

:: ── Step 1: Create .env if it doesn't exist ──────────────────────
if not exist ".env" (
  copy .env.example .env >nul
  echo  Created .env from .env.example
  echo  Edit .env to set TEST_EMAIL and TEST_PASSWORD if needed.
  echo.
)

:: ── Step 2: Install npm packages if needed ────────────────────────
if not exist "node_modules\" (
  echo  Installing dependencies...
  call npm install
  echo.
)

:: ── Step 3: Install Chromium browser if needed ───────────────────
npx playwright install chromium --dry-run >nul 2>&1
if %errorlevel% neq 0 (
  echo  Installing Playwright Chromium browser...
  call npx playwright install chromium
  echo.
)

:: ── Step 4: Check frontend is running ────────────────────────────
echo  Checking that frontend is running at http://localhost:5173...
curl -s --head http://localhost:5173 >nul 2>&1
if %errorlevel% neq 0 (
  echo.
  echo  *** WARNING: Frontend does not seem to be running! ***
  echo.
  echo  Please start your servers first:
  echo    Terminal 1: cd ai-learning-backend\backend  ^&^& npm run dev
  echo    Terminal 2: cd ai-learning-frontend\frontend ^&^& npm run dev
  echo.
  echo  Then run this file again.
  echo.
  pause
  exit /b 1
)
echo  Frontend is up!
echo.

:: ── Step 5: Run the tests ─────────────────────────────────────────
echo  Launching bot...
echo  Chrome will open automatically. Watch it navigate your app.
echo  Reports will be saved to: reports\
echo.

call npm test

echo.
echo  ============================================================
echo    Bot finished!
echo    Open reports\SUMMARY.md to see all issues found.
echo  ============================================================
echo.
pause
endlocal
