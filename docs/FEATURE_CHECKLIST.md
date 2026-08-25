# Stellar Feature Checklist

This checklist is based on the current route, page, service, and mobile-app surface. Use it to track features that are missing, incomplete, or important before a production-quality release.

## Must-Have Gaps

- [ ] Wire the pro-track recommendation engine.
  - Add a real "today's exercise" source instead of the placeholder nudge.
  - Use weak topics, incomplete modules, recent submissions, and review cadence to choose the next exercise.
  - Expose the recommendation through an API consumed by the pro dashboard.

- [ ] Add pro-track submission history and activity timeline.
  - Add a `/v1/pro/submissions` API or equivalent.
  - Show recent attempts, scores, failed test cases, fixes, and streak impact.
  - Link each activity item back to the exercise/topic/project.

- [ ] Complete mobile feature parity for core learning flows.
  - Add AI tutor, DoubtChat, image doubt, voice tutor, planner, bookmarks, notes, mistakes, and revision.
  - Add payments/subscription state, certificates, community, and public/shared content where mobile users need them.
  - Add parent, school, and pro-track mobile entry points or explicitly mark them web-only.

- [ ] Replace the live-room push-to-talk visual stub with real behavior.
  - Implement voice transport, mute/unmute state, permission handling, and participant status.
  - Add graceful fallback when browser audio permissions or network conditions fail.
  - If voice is not part of the near-term product, remove or hide the PTT UI.

- [ ] Remove subject chapter dead ends.
  - Audit every board/grade/subject shown in the UI.
  - Hide unavailable subject tabs or show a useful empty state with a next action.
  - Ensure seeded subjects and frontend subject selectors use the same availability rules.

- [ ] Harden school-group permissions.
  - Restrict assignment, worksheet, challenge, teacher-post, and class-report actions to teacher/admin roles.
  - Add backend tests for student, teacher, and admin access paths.
  - Make the frontend hide restricted controls for non-teacher users.

- [ ] Rebuild project documentation.
  - Add an accurate architecture/spec document.
  - Add an accurate roadmap.
  - Document the full content pipeline and seed order.
  - Keep README links aligned with files that actually exist.

- [ ] Publish a current API contract.
  - Document every mounted route from `server.js`, including v2 and pro endpoints.
  - Include auth, request body, response shape, role requirements, and error codes.
  - Add examples for high-risk flows: payment verification, child switching, school assignments, pro exercise submission.

- [ ] Add end-to-end tests for critical workflows.
  - Register/login/logout/refresh.
  - Onboarding and board/grade/track selection.
  - Practice start, submit, explanation, mistake notebook.
  - Planner create/share/reschedule.
  - Payment order, verify, coupon, subscription state.
  - Parent child switching and school-group assignment.
  - Pro exercise run, submit, review, certificate.

## High-Value Product Features

- [ ] Add adaptive daily learning paths across subjects.
  - Generate a daily plan from weak topics, upcoming exam date, revision due items, and recent practice mistakes.
  - Let students switch between quick, normal, and intense daily plans.

- [ ] Add a prerequisite gap map.
  - Show why a topic is weak by linking it to prerequisite topics.
  - Offer remedial practice for the prerequisite before retrying the current topic.

- [ ] Add a visible revision schedule.
  - Show upcoming spaced-repetition reviews by date and topic.
  - Let students complete, defer, or jump into revision practice from the schedule.

- [ ] Add chapter and subject certificates.
  - Issue certificates for school-track chapter, subject, or grade milestones.
  - Add share/download controls and certificate verification links.

- [ ] Add downloadable worksheets.
  - Generate topic, chapter, and weak-area worksheets.
  - Include answer keys and teacher/parent variants.

- [ ] Add a dedicated doubt history page.
  - List all doubt threads by topic, subject, status, and date.
  - Mark doubts as resolved/unresolved and reopen old doubts.

- [ ] Surface "ask from my notes/uploads" across learning flows.
  - Add the option inside lessons, practice review, voice tutor, and notebook.
  - Show which uploaded source or note was used in the answer.

- [ ] Add a unified student calendar.
  - Combine study plan tasks, exam dates, revision due items, school assignments, reminders, and streak goals.

- [ ] Add an in-app notification center.
  - Persist push notifications, reminders, parent messages, assignment updates, badge events, payment notices, and AI quota warnings.

- [ ] Add universal search.
  - Search lessons, NCERT topics, notes, bookmarks, PYQs, uploaded documents, community posts, pro topics, and exercises.

- [ ] Add teacher/class export tools.
  - Export assignment reports, weak-topic heatmaps, student progress, and attendance/streak summaries as CSV/PDF.

- [ ] Add a content quality dashboard.
  - Track topic coverage, stale content, low-quality questions, repeated flags, missing diagrams, RAG chunk health, and AI feedback ratings.

- [ ] Add stronger community moderation.
  - Add moderation queue, report triage, user restrictions, keyword filters, deleted-content audit logs, and admin resolution notes.

- [ ] Add billing self-service.
  - Support invoice/payment history, plan change, cancel subscription, retry failed payment, and renewal/trial emails from the user settings page.

- [ ] Add student data export.
  - Export notes, bookmarks, progress, certificates, practice history, and planner data.

- [ ] Add accessibility and localization coverage.
  - Audit keyboard navigation, contrast, screen-reader labels, focus management, responsive text, and Hindi/multilingual flows.

## AI Feature Gaps

- [ ] Add AI-generated mini tests after each lesson.
  - Generate short checks from the lesson content and current mastery state.
  - Save results into mastery, mistakes, and revision history.

- [ ] Add AI lesson summaries by mode.
  - Support easy, exam-focused, and advanced summary modes.
  - Allow summary export into notebook notes.

- [ ] Add AI mistake clustering.
  - Group repeated mistakes into patterns such as formula recall, sign errors, careless reading, concept gaps, or time pressure.
  - Show targeted fixes and practice recommendations for each cluster.

- [ ] Add AI parent and teacher summaries.
  - Generate weekly plain-language summaries from progress, weak topics, effort, and upcoming deadlines.
  - Let guardians/teachers configure digest frequency and channels.

- [ ] Add an AI quality feedback loop.
  - Track bad explanations, bad generated questions, unsafe responses, and low-rated hints.
  - Feed review status into admin dashboards and future generation rules.

- [ ] Add AI cost analytics by feature.
  - Break down spend by user tier, model, feature, subject, cache hit rate, and failure reason.
  - Add alert thresholds for unusual usage spikes.

## Assessment Gaps

- [ ] Add full mock-test mode.
  - Include timer, sections, review screen, auto-submit, pause rules, and optional negative marking.

- [ ] Add PYQ attempt mode.
  - Let students attempt previous-year questions as a test, not only browse/filter them.
  - Save attempts and show year/topic-wise performance.

- [ ] Add exam readiness scoring.
  - Show readiness by subject, chapter, topic, and expected grade band.
  - Explain which topics have the biggest score impact.

- [ ] Add printable report cards.
  - Generate student/parent-friendly PDFs with progress, effort, mastery, weak areas, and next steps.

- [ ] Add mastery retake remediation.
  - When a mastery test fails, route the student through targeted lesson sections and prerequisite practice before retake.

## Parent And Teacher Gaps

- [ ] Add parent approval controls.
  - Require guardian approval for payments, public profile sharing, community posting, and optional social features.

- [ ] Add parent digest UI.
  - Show weekly digest history inside the app, not only through email.
  - Include child progress, weak areas, reminders, and suggested support actions.

- [ ] Add teacher roster management.
  - Support class roles, student invite/removal, transfer between classes, and group ownership.

- [ ] Add assignment due dates and submission review.
  - Track submitted, late, missing, reviewed, and returned states.
  - Let teachers comment on submissions and assign retry work.

- [ ] Add teacher-created custom questions.
  - Let teachers create, import, tag, and assign questions.
  - Add review controls before custom questions affect analytics.

- [ ] Add school admin dashboards.
  - Support multiple classes, teachers, student cohorts, and aggregate school-level reports.

## Community Gaps

- [ ] Add follow controls for users and topics.
  - Let students follow topics, classmates, teachers, and community authors.

- [ ] Add saved community posts.
  - Let users save posts separately from learning bookmarks.

- [ ] Add verified answers.
  - Mark answers from teachers/admins as verified.
  - Surface verified explanations above regular replies.

- [ ] Add report resolution workflow.
  - Track reported content status, assigned moderator, resolution note, and action taken.

- [ ] Add private study groups.
  - Support invite-only discussion and shared goals for small groups.

## Business And Account Gaps

- [ ] Add referral dashboard.
  - Show referral code, invited users, reward status, and anti-abuse state.

- [ ] Add invoice and payment history.
  - Let users view/download invoices and see failed, pending, refunded, and successful payments.

- [ ] Add subscription management.
  - Support plan change, cancellation, renewal reminders, failed-payment retry, and trial expiry notices.

- [ ] Add support/help center.
  - Add contact support, FAQ, issue category, attachment, and ticket status.

- [ ] Add account audit and session history for users.
  - Show logins, active sessions, password changes, payment events, and security-sensitive changes.

## Mobile Gaps

- [ ] Add offline lesson downloads.
  - Let students download lessons, worksheets, and revision packs for offline study.

- [ ] Add push-notification onboarding on mobile.
  - Explain reminder types and request permissions at the right moment.

- [ ] Add mobile planner and reminders.
  - Support daily plan, revision due items, exam calendar, and reminder editing.

- [ ] Add mobile payments and subscription state.
  - Show current plan, trial state, upgrade CTA, coupon validation, and billing status.

- [ ] Add mobile pro-track support.
  - Include pro modules, topic lessons, exercise runner, reviews, projects, interview practice, and certificates.

## Admin And Ops Gaps

- [ ] Add support impersonation with audit logs.
  - Let admins view user state for support without exposing credentials.
  - Record who used impersonation, when, why, and what changed.

- [ ] Add admin audit logs.
  - Track role changes, question edits, topic edits, coupon changes, certificate actions, and moderation decisions.

- [ ] Add feature flag management UI.
  - Let admins change rollout percentage, cohorts, and environment overrides safely.

- [ ] Add production health dashboards.
  - Show database, Redis, AI provider, payments, push, email, background jobs, and slow endpoints.

- [ ] Add backup and restore verification UI.
  - Show last backup, restore drill status, archive size, retention status, and failure reasons.

## Technical Readiness

- [ ] Add route-level smoke tests for all mounted backend route groups.
- [ ] Add frontend route smoke tests for all app routes in `App.jsx`.
- [ ] Add mobile integration tests for auth, practice, lessons, analytics, and offline practice.
- [ ] Add seeded-data validation in CI for every advertised board/grade/subject.
- [ ] Add monitoring dashboards for API errors, payment failures, AI spend, queue failures, push delivery, and slow endpoints.
- [ ] Add backup restore drills and document the restore procedure.
- [ ] Add a release checklist covering migrations, seed scripts, feature flags, smoke tests, rollback, and admin verification.

## Suggested Priority

1. Finish visible placeholders and dead ends.
2. Harden school/teacher permissions.
3. Bring docs and API contracts up to date.
4. Add e2e coverage for auth, learning, payment, parent/school, and pro flows.
5. Expand mobile beyond the basic five-tab shell.
