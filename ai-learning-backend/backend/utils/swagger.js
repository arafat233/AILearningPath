import swaggerUi from "swagger-ui-express";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Stellar API",
    version: "1.0.0",
    description: "Stellar — Building Stars. Adaptive learning platform REST API reference.",
  },
  servers: [
    { url: "/api",    description: "Stable v0 routes" },
    { url: "/api/v1", description: "Versioned routes (payment, NCERT, PYQ, curriculum)" },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "token" },
      csrfHeader: { type: "apiKey", in: "header", name: "x-csrf-token" },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error:   { type: "string" },
          message: { type: "string" },
        },
      },
      User: {
        type: "object",
        properties: {
          _id:          { type: "string" },
          name:         { type: "string" },
          email:        { type: "string", format: "email" },
          plan:         { type: "string", enum: ["free", "pro", "premium", "pro_annual", "premium_annual"] },
          isPaid:       { type: "boolean" },
          role:         { type: "string", enum: ["student", "parent", "teacher", "admin"] },
          grade:        { type: "string" },
          aiCallsToday: { type: "integer" },
          streakDays:   { type: "integer" },
        },
      },
      Question: {
        type: "object",
        properties: {
          _id:          { type: "string" },
          topic:        { type: "string" },
          subject:      { type: "string" },
          questionText: { type: "string" },
          questionType: { type: "string", enum: ["mcq", "case_based", "assertion_reason", "pyq"] },
          difficulty:   { type: "string", enum: ["easy", "medium", "hard"] },
          options:      { type: "array", items: { type: "object", properties: { text: { type: "string" }, isCorrect: { type: "boolean" } } } },
          isPYQ:        { type: "boolean" },
          pyqYear:      { type: "integer" },
          marks:        { type: "integer" },
        },
      },
    },
  },
  security: [{ cookieAuth: [], csrfHeader: [] }],
  paths: {
    // ── Auth ───────────────────────────────────────────────────────────
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new student account",
        security: [],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name", "email", "password"], properties: { name: { type: "string" }, email: { type: "string", format: "email" }, password: { type: "string", minLength: 8 }, grade: { type: "string" }, referralCode: { type: "string" } } } } } },
        responses: { 201: { description: "User created; auth cookies set" }, 400: { description: "Validation error or duplicate email", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email + password",
        security: [],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password"], properties: { email: { type: "string" }, password: { type: "string" } } } } } },
        responses: { 200: { description: "Auth cookies set; user object returned" }, 401: { description: "Invalid credentials or account locked" } },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout — clears auth cookies",
        responses: { 200: { description: "Cookies cleared" } },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Rotate access token using refresh cookie",
        security: [],
        responses: { 200: { description: "New access token issued" }, 401: { description: "Refresh token invalid or expired" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Return the authenticated user",
        responses: { 200: { description: "User object", content: { "application/json": { schema: { type: "object", properties: { data: { $ref: "#/components/schemas/User" } } } } } } },
      },
    },
    "/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Request a password-reset email",
        security: [],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email"], properties: { email: { type: "string" } } } } } },
        responses: { 200: { description: "Reset email dispatched" } },
      },
    },
    // ── Practice ───────────────────────────────────────────────────────
    "/practice/start": {
      post: {
        tags: ["Practice"],
        summary: "Start a new adaptive practice session",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["topicId"], properties: { topicId: { type: "string" }, subject: { type: "string" } } } } } },
        responses: { 200: { description: "Session created; first question returned" } },
      },
    },
    "/practice/submit": {
      post: {
        tags: ["Practice"],
        summary: "Submit an answer for the current practice question",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["selectedOptionIndex"], properties: { selectedOptionIndex: { type: "integer" }, timeTaken: { type: "integer" }, confidence: { type: "string", enum: ["low", "medium", "high"] } } } } } },
        responses: { 200: { description: "Feedback, explanation, and next question returned" } },
      },
    },
    // ── AI ─────────────────────────────────────────────────────────────
    "/ai/explain": {
      post: {
        tags: ["AI"],
        summary: "Get an AI explanation for a question",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["questionId"], properties: { questionId: { type: "string" }, mistakeType: { type: "string" }, userExplanation: { type: "string" } } } } } },
        responses: { 200: { description: "Explanation text returned" }, 429: { description: "Daily AI quota exceeded" } },
      },
    },
    "/ai/usage": {
      get: {
        tags: ["AI"],
        summary: "Return the authenticated user's AI call usage for today",
        responses: { 200: { description: "{ used, limit, plan }" } },
      },
    },
    // ── Analytics ──────────────────────────────────────────────────────
    "/analysis/report": {
      get: {
        tags: ["Analytics"],
        summary: "Full performance report — accuracy, weak topics, streak, badges",
        responses: { 200: { description: "Report object" } },
      },
    },
    "/analysis/error-memory": {
      get: {
        tags: ["Analytics"],
        summary: "Persistent error patterns for the user",
        responses: { 200: { description: "Error memory entries" } },
      },
    },
    // ── Exam ───────────────────────────────────────────────────────────
    "/exam/start": {
      post: {
        tags: ["Exam"],
        summary: "Generate a timed exam for a topic",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["topic"], properties: { topic: { type: "string" }, numQuestions: { type: "integer" }, timeLimit: { type: "integer" } } } } } },
        responses: { 200: { description: "Exam created; questions returned" } },
      },
    },
    "/exam/submit": {
      post: {
        tags: ["Exam"],
        summary: "Submit a completed exam",
        responses: { 200: { description: "Score, analysis, and question-level feedback" } },
      },
    },
    // ── Revision ───────────────────────────────────────────────────────
    "/revision/due": {
      get: {
        tags: ["Revision"],
        summary: "List topics due for spaced-repetition review",
        responses: { 200: { description: "Array of due topics" } },
      },
    },
    "/revision/done": {
      post: {
        tags: ["Revision"],
        summary: "Mark a topic as reviewed today",
        responses: { 200: { description: "Updated revision schedule" } },
      },
    },
    // ── Lessons ────────────────────────────────────────────────────────
    "/lessons": {
      get: {
        tags: ["Lessons"],
        summary: "List lessons; filter by subject and/or grade",
        parameters: [
          { in: "query", name: "subject", schema: { type: "string" } },
          { in: "query", name: "grade",   schema: { type: "string" } },
        ],
        responses: { 200: { description: "Array of lesson documents" } },
      },
    },
    // ── PYQ (v1) ───────────────────────────────────────────────────────
    "/pyq": {
      get: {
        tags: ["PYQ"],
        summary: "List past-year questions with filtering and pagination",
        parameters: [
          { in: "query", name: "topic",      schema: { type: "string" } },
          { in: "query", name: "year",       schema: { type: "integer" } },
          { in: "query", name: "subject",    schema: { type: "string" } },
          { in: "query", name: "difficulty", schema: { type: "string", enum: ["easy", "medium", "hard"] } },
          { in: "query", name: "page",       schema: { type: "integer", default: 1 } },
          { in: "query", name: "limit",      schema: { type: "integer", default: 20 } },
        ],
        responses: { 200: { description: "{ questions, total, pages }" } },
      },
    },
    "/pyq/topics": {
      get: { tags: ["PYQ"], summary: "List unique PYQ topics with question counts", responses: { 200: { description: "Topic summary array" } } },
    },
    "/pyq/years": {
      get: { tags: ["PYQ"], summary: "List years for which PYQs are available", responses: { 200: { description: "Array of years" } } },
    },
    // ── NCERT (v1) ─────────────────────────────────────────────────────
    "/ncert/chapters": {
      get: {
        tags: ["NCERT"],
        summary: "List NCERT chapters; defaults to CBSE Class 10 Mathematics",
        parameters: [
          { in: "query", name: "board",   schema: { type: "string", default: "CBSE" } },
          { in: "query", name: "grade",   schema: { type: "string", default: "10" } },
          { in: "query", name: "subject", schema: { type: "string", default: "Mathematics" } },
        ],
        responses: { 200: { description: "Array of chapter summaries" } },
      },
    },
    "/ncert/chapters/{chapterId}": {
      get: {
        tags: ["NCERT"],
        summary: "Get full chapter content including subchapters and practice questions",
        parameters: [{ in: "path", name: "chapterId", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Full chapter document" }, 404: { description: "Not found" } },
      },
    },
    // ── Payment (v1) ───────────────────────────────────────────────────
    "/payment/create-order": {
      post: {
        tags: ["Payment"],
        summary: "Create a Razorpay order for plan upgrade",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["plan"], properties: { plan: { type: "string" }, couponCode: { type: "string" } } } } } },
        responses: { 200: { description: "Razorpay order id, amount, currency" }, 402: { description: "Invalid plan or coupon" } },
      },
    },
    "/payment/verify": {
      post: {
        tags: ["Payment"],
        summary: "Verify Razorpay signature and upgrade user plan",
        responses: { 200: { description: "Plan upgraded" }, 400: { description: "Signature mismatch" } },
      },
    },
    // ── Admin ──────────────────────────────────────────────────────────
    "/admin/stats": {
      get: {
        tags: ["Admin"],
        summary: "Dashboard stats: DAU, MAU, revenue, plan distribution",
        responses: { 200: { description: "Stats object" }, 403: { description: "Admin only" } },
      },
    },
    "/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Paginated user list",
        parameters: [
          { in: "query", name: "page",  schema: { type: "integer", default: 1 } },
          { in: "query", name: "limit", schema: { type: "integer", default: 50 } },
        ],
        responses: { 200: { description: "{ users, total }" }, 403: { description: "Admin only" } },
      },
    },
    // ── Health ────────────────────────────────────────────────────────
    "/health": {
      get: {
        tags: ["System"],
        summary: "Liveness check — verifies MongoDB and Redis connectivity",
        security: [],
        responses: { 200: { description: "{ status: 'ok', mongo: 'connected', redis: 'connected' }" }, 503: { description: "A dependency is degraded" } },
      },
    },
  },
};

export function setupSwagger(app) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      customSiteTitle: "Stellar — API Docs",
      swaggerOptions: { persistAuthorization: true },
    }),
  );
  app.get("/api-docs.json", (_req, res) => res.json(spec));
}
