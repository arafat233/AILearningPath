# Missing Unit Tests Checklist

This checklist identifies all backend and frontend services, controllers, and components that currently lack unit test coverage based on the AILearningPath blueprint and file system audit.

I have strictly provided the requirements without writing the implementation code, as requested. You can check these off as you write the tests.

---

## 🟢 Backend Services (Business Logic)
These files contain critical business logic and math, making them the highest priority for unit testing.

- [x] **`__tests__/coupon.service.test.js`**
  - Should test `validateCoupon()` for `isActive`, `validUntil`, `maxUses`, and `planFilter` validation.
  - Should test `computeDiscount()` calculation logic (percent vs. fixed).
  - Should test `redeemCoupon()` for atomic `$inc` updates and race-condition safety.
- [x] **`__tests__/prediction.service.test.js`**
  - Should test the exam score prediction formula.
  - Should verify the `timeAdjustment` bounds (daysLeft > 60 vs daysLeft < 7).
  - Should test clipping of bounds (e.g., predicted grade shouldn't drop below 0 or exceed 80).
- [x] **`__tests__/badge.service.test.js`**
  - Should test `checkAndAwardBadges()` awarding logic based on streak, score, and attempts.
  - Should verify atomic upserts to prevent double-awarding of the same badge.
- [x] **`__tests__/ai.service.test.js`** *(Note: `aiRouter` is tested, but core `aiService` is missing)*
  - Should test fallback behaviors if Claude's API returns a 500 error.
  - Should ensure `getSystemPrompt(subject)` loads the exact persona based on the subject request.
- [x] **`__tests__/profile.service.test.js`**
  - Should verify the behavior stat aggregates logic (accuracy averaging, calculating `avgTime`).
- [x] **`__tests__/selfLearning.service.test.js` & `foundation.service.test.js`**
  - Should check if missing prerequisites match correctly against `UserProfile.weakAreas`.
- [x] **`__tests__/onboardingEmailService.test.js`** *(Newly Added!)*
  - Should mock `sendEmail` and ensure it only targets users who registered 2 or 7 days ago.
  - Should verify it filters out users who already have > 3 attempts (for Day-2).
- [x] **`__tests__/push.service.test.js` & `weeklyParentEmailService.test.js`**
  - Ensure the CRON timings and iteration over user subscriptions logic executes safely.

---

## 🟡 Backend Controllers & Routes (Endpoints)
These files manage the HTTP lifecycle and route validation. 

- [x] **`__tests__/adminStats.controller.test.js`**
  - Should ensure DAU/MAU calculations process dates correctly (timezone edge cases).
  - Should verify revenue aggregates do not double-count transactions.
- [x] **`__tests__/admin.routes.test.js`**
  - Should test role-guarding (`adminAuth`) on all API endpoints.
  - Should test the Question/Topic CRUD validation logic (rejecting unknown payload fields).
- [x] **`__tests__/user.controller.test.js`**
  - Should test rate limit overrides (`PUT /api/user/me`).
  - Should test GDPR delete logic (`DELETE /api/user/me`) cascading successfully.
- [x] **`__tests__/competition.controller.test.js` / WebSocket Logic**
  - Should unit test Score updating logic and leaderboard placement before pushing via Socket.IO.

---

## 🔵 Frontend (React / Vite)
The frontend `src/__tests__` folder currently only covers the `authStore`, API interceptors, and `NPSSurveyBanner`. Critical interactive views are missing unit testing.

- [x] **`__tests__/Practice.test.jsx`**
  - Should test the confidence slider state bounds (low -> high).
  - Should verify that "End Session" triggers the summary screen correctly.
  - Should mock API response and test the adaptive question progression.
- [x] **`__tests__/Pricing.test.jsx` & Subscription Logic**
  - Should test the `CouponInput` logic (mocking success vs invalid code API hits).
  - Should verify that clicking a plan correctly initializes the Razorpay API SDK hook.
- [x] **`__tests__/VoiceTutor.test.jsx`**
  - Should mock browser microphone APIs and test state transitions (recording -> processing -> TTS).
- [x] **`__tests__/useFeatureFlags.test.js`**
  - Should verify the hook falls back gracefully if the `/api/flags` endpoint fails.
- [x] **`__tests__/DoubtChat.test.jsx`**
  - Should test that the chat correctly auto-scrolls when a new message is appended.
  - Should test input validation (e.g., blocking empty submissions).
- [x] **`__tests__/Layout.test.jsx`** / Protections
  - Should verify that non-authenticated users get immediately pushed to `/login`.
  - Should verify Admin layouts strictly boot student users to `/`.
