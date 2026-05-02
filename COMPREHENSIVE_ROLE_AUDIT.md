# Comprehensive Multi-Role Project Audit & Action Plan

**Project:** AI Learning Path (CBSE Class 10 Platform)
**Date:** May 2026
**Status:** Pre-Launch / RC Phase

This document contains a localized, role-by-role security, stability, UI/UX, and architectural audit. Each specialized agent has evaluated the current codebase, identifying **incomplete features, critical breaking points, and specific checklists** to make the system production-ready.

---

## 1. Executive Board (CEO, CTO, CMO)

### 👔 CEO Review
**Focus: Business Continuity, Legal Liability, Monetization**
* **The "Break the Business" Risk:** The platform claims to offer "CBSE Grade Prediction" and "CBSE Textbook Curriculum" but currently relies on **placeholder NCERT text** and lacks real PYQ (Past Year Question) seed data. Charging users ₹199/month for dummy content will result in immediate chargebacks, reputational destruction, and potential Consumer Protection Act violations.
* **Incomplete:** Real content acquisition pipeline. 
* **Checklist:**
  - [ ] **Content Licensing/Sourcing:** Replace all placeholder NCERT content with legally compliant educational material before launching subscriptions.
  - [ ] **TOS / Liability Shield:** Ensure the Terms of Service explicitly states that AI predictions are estimates and not guaranteed board results.

### 🛠️ CTO Review
**Focus: Velocity, Scalability, Technical Debt**
* **The "Break the Project" Risk:** The database lacks a migration tool (e.g., `migrate-mongo`). Because the system relies heavily on nested `UserProfile` structures, making schema changes or adding new tracking metrics post-launch without a structured migration strategy will corrupt user data and cause widespread application crashes.
* **Incomplete:** Automated deployment and schema management.
* **Checklist:**
  - [ ] **Database Migrations:** Introduce `migrate-mongo` into the stack.
  - [ ] **Continuous Deployment:** The current CI/CD (`ci.yml`) lacks a `deploy` stage. Automate PM2/Docker rollouts to prevent manual deployment outages.

### 📈 CMO / Marketing Head Review
**Focus: SEO, Acquisition, User Retention**
* **The "Break the Marketing" Risk:** The application lacks a `sitemap.xml` and potentially SSR (Server-Side Rendering) for public pages. Organic search traffic will be zero if Google cannot index the core offerings (e.g., CBSE syllabus endpoints). 
* **Incomplete:** SEO fundamentals and viral loops.
* **Checklist:**
  - [~] **SEO:** Created initial static `sitemap.xml`. (Next step: Generate a dynamic sitemap mapping to all NCERT chapters and PYQ pages).
  - [ ] **Social Proof:** Tooltips missing on the Badges grid (`Profile.jsx`). Give users clear, brag-worthy descriptions so they share their achievements on social media.
  - [x] **Retention:** Added \`onboardingEmailService.js\` for 2-day and 7-day recall loops! (Still requires dark mode toggle persistence fix).

---

## 2. Product & Project Management

### 📊 Product Manager Review
**Focus: User Journey, Feature Completeness**
* **The "Break the UX" Risk:** "Blank screens during data fetch." Because there are no skeleton loaders, users on slow 3G/4G networks in India will assume the application is broken and bounce. 
* **Incomplete:** Mobile-responsive polish and loading states.
* **Checklist:**
  - [ ] **Loading States:** Implement skeleton loaders across all dashboards and practice views.
  - [ ] **Mobile Usability:** Fix `Layout.jsx` where the sidebar overlaps content on screens < 375px. 

### 📋 Project Manager Review
**Focus: Tracking, Backlog, Deadlines**
* **The "Break the Timeline" Risk:** There are multiple `// TODO:` comments scattered across the codebase without linked Jira/Linear tickets. These represent hidden scope that will derail the launch date.
* **Incomplete:** Issue tracking hygiene.
* **Checklist:**
  - [ ] **TODO Scrub:** Run a regex search for `TODO`, convert them into tracked tickets, and remove them from the source code.
  - [ ] **Documentation:** Write standard `CONTRIBUTING.md` and `CHANGELOG.md` to establish developer guidelines before expanding the team.

---

## 3. Architecture & Core Engineering

### 🏗️ System Design Architect
**Focus: Bottlenecks, Distributed Systems**
* **The "Break the Architecture" Risk:** The Socket.IO implementation for the "Live Competition Rooms" currently works well on a single instance. If traffic spikes and we must scale to multiple PM2 instances or Docker containers, the WebSocket connections will break unless a `Redis Adapter` is strictly enforced for pub/sub event broadcasting.
* **Incomplete:** Multi-node Socket.IO setup.
* **Checklist:**
  - [ ] **Socket Scaling:** Audit `server.js` to ensure `@socket.io/redis-adapter` is fully configured for multi-instance scaling.

### 🧠 Sr. Software Architect
**Focus: Code Structure, API Contracts**
* **The "Break the Integration" Risk:** The backend defines ~50+ REST endpoints (seen in `BLUEPRINT.md`) but lacks an OpenAPI / Swagger spec. Frontend developers are guessing payload structures, leading to integration bugs.
* **Incomplete:** API Documentation.
* **Checklist:**
  - [ ] **Swagger Setup:** Generate `swagger.json` and host a `/api-docs` endpoint so frontend/mobile teams can auto-generate API clients.

### 💻 Sr. Developer / MERN Full Stack
**Focus: Implementation, Clean Code**
* **The "Break the Code" Risk:** Unused custom classes in `tailwind.config.js` bloat the CSS bundle. 
* **Incomplete:** Final cleanup & App load UX.
* **Checklist:**
  - [ ] **CSS Purge:** Clean up `tailwind.config.js`.
  - [ ] **App Load:** Add a full-page spinner in `App.jsx` during initial bundle load to prevent white flashes.

---

## 4. Frontend Experience (UI/UX)

### 🎨 UI/UX Engineer Review
**Focus: Aesthetics, Micro-interactions, Accessibility**
* **The "Break the Experience" Risk:** In the `Practice.jsx` interface, the confidence slider label is too small to read on mobile. Since the entire adaptive AI depends on accurate student confidence reporting, a bad mobile UI will poison the AI data model.
* **Incomplete:** Mobile accessibility and state persistence.
* **Checklist:**
  - [ ] **Mobile Touch Targets:** Enlarge the Confidence Slider in `Practice.jsx`.
  - [ ] **Dark Mode:** Save dark mode state to `localStorage` and `UserProfile` so it persists across sessions. 
  - [ ] **Interactions:** Add hover descriptions to the badge grid. 

---

## 5. Quality Assurance & Testing

### 🧪 QA Tester Review
**Focus: Edge Cases, Flaky Tests, E2E**
* **The "Break the QA" Risk:** The project has Jest unit tests and Vitest frontend tests, but **ZERO End-to-End (E2E) tests with Playwright or Cypress**. An API change could break the checkout or practice flow silently because unit tests mock the DB.
* **Incomplete:** High-level user interaction testing.
* **Checklist:**
  - [ ] **Integration Tests:** Implement API tests against a real (test) MongoDB instance.
  - [ ] **E2E Testing:** Write Cypress/Playwright flows for 1. User Registration, 2. Completing a Practice Session, and 3. Subscription Checkout.
  - [ ] **Load Tests:** Update `load-tests/practice-session.js` (k6) to include explicit error-rate assertions (e.g., fail the test if 500 errors > 1%).

---

## 6. Data & AI Roles

### 🤖 AI/ML Engineer Review
**Focus: LLM Prompts, Persona Accuracy, Hallucinations**
* **The "Break the AI" Risk:** Claude Haiku heavily relies on precise prompts. If prompt injection isn't securely fenced, students could instruct the Voice Tutor to bypass the curriculum and act as a generic chatbot, running up our Anthropics API bill. Furthermore, "PredictionService" uses simple heuristic math instead of real ML models.
* **Incomplete:** AI safety bounds, real prediction models.
* **Checklist:**
  - [ ] **Prompt Audits:** Strictly fence system prompts in the Voice Tutor against role-breaking instructions from students.
  - [ ] **Score Calibration:** Add disclaimer UI stating predictions are estimates, while we gather enough raw data to train a real XGBoost or Neural Net model.

### 🧮 Data Scientist Review
**Focus: Algorithmic Logic, Thinking Profiles**
* **The "Break the Trust" Risk:** The code labels a student's "Thinking Profile" (e.g. Overthinker, Guesser) too quickly. Sticking a label on a user after poor initial performance will demotivate them and cause churn.
* **Incomplete:** Minimum sample size logic for analytics.
* **Checklist:**
  - [ ] **Analytics Gate:** Suppress the "Thinking Profile" in the UI until the user has completed at least N attempts (e.g., 50 questions) to ensure statistical significance.

### 💾 Data Engineer / BI Developer Review
**Focus: Analytics pipelines, Data Warehousing**
* **The "Break the Analytics" Risk:** Right now, DAU/MAU reporting queries directly against the production MongoDB. As the database grows to hundreds of gigabytes, generating admin analytics will lock DB collections and impact live student practice.
* **Incomplete:** Read-Replica or OLAP architecture.
* **Checklist:**
  - [ ] **Analytics DB:** Route all BI dashboard queries to a secondary read-replica MongoDB instance, or set up a pipeline pushing user events to BigQuery/Redshift.

---

## 7. Infrastructure & Security

### 🛡️ Sr. Cybersecurity Developer Review
**Focus: Compliance, Attack Vectors, Data Leaks**
* **The "Break the Security" Risk:** `Cookie domain` is not explicitly set or restricted. This allows potential cookie tossing attacks if other subdomains are compromised.
* **Incomplete:** Final hardening of session/cookie constraints.
* **Checklist:**
  - [ ] **Cookie Hardening:** Set exact `domain` matching for session cookies in production.
  - [ ] **Rate Limiter Review:** Ensure WebSocket connections are also rate-limited so abusers can't spam rooms and crash the server.

### ⚙️ DevOps Engineer Review
**Focus: Containers, Uptime, CI/CD**
* **The "Break the Servers" Risk:** Deployments are manual ("no deploy stage"). Also, container memory/CPU limits aren't enforced aggressively enough in production Docker Compose files. 
* **Incomplete:** CD pipelines and container constraints.
* **Checklist:**
  - [ ] **CD Pipeline:** Implement a GitHub Action to deploy directly to the EC2/Production server using SSH or a proper orchestrator mechanism.
  - [ ] **Resource Limiting:** Add `deploy.resources.limits.memory` to `docker-compose.yml` to prevent accidental Out of Memory (OOM) cascading failures.
