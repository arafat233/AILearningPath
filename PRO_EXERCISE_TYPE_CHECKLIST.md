# Pro Exercise Type / ID-Format Checklist

> Run this **every time** you add a new pro-track exercise `type`, a new
> exercise/topic/module **id suffix**, or any new shape that travels through a
> validated route. Born from the 2026-06-01 `_pm_` incident: pattern_match
> exercises seeded fine and the frontend built clean, but the route param
> validator only accepted `_ex_` ids → every one returned **422** and was
> unreachable. A green build + a successful seed do **not** prove a route works.

**The one rule:** Build = compiles. Seed = rows in Mongo. Neither sends an HTTP
request through `auth → featureFlag → validate → trackFilter → controller`.
Only a real round-trip exercises the Joi `validate(...)` layer.

---

## When adding a new exercise `type` (e.g. `pattern_match`)

- [ ] **Backend grader** — add a `case "<type>"` to `runTestCases` in
      `services/codeExecutionService.js`. Decide: does it need the sandbox
      (`needsSandbox`) or is it pure text/string compare (no Judge0)?
- [ ] **Client-safe payload** — confirm `proService.getExercise` strips any
      answer key (`testCases`, `expectedSolution`, `correct`) from the
      response. Confirm `getExercises` (topic list) `.select(...)` includes
      every field the renderer needs (e.g. `blanks` for option buttons).
- [ ] **Frontend dispatch** — `ProExerciseRunner.jsx` routes the new type to
      its runner (early-return or switch). New runner component handles
      submit + result + explanation.
- [ ] **Lazy chunk** — verify `npm run build` emits a separate chunk for the
      new runner (not bloating the default exercise bundle).

## When adding a new id suffix / format (e.g. `_pm_`, `_quiz_`)

- [ ] **Grep the validators** — open `validators/proValidator.js` and check
      every regex the new id flows through:
      `exerciseIdPattern`, `topicIdPattern`, `moduleIdPattern`, and the
      `tutorAskBodySchema.exerciseId`. Widen with an **explicit allowlist**
      (`_(ex|pm)_`), never a loose `_[a-z]+_` (a typo'd suffix must fail loud).
- [ ] **Check both param AND body schemas** — the same id can be validated as
      a path param (`exerciseParamsSchema`) and inside a body
      (`tutorAskBodySchema`). One constant feeding both is ideal; confirm it.
- [ ] **Frontend id assumptions** — grep the frontend for `_ex_` / hardcoded
      suffix logic (e.g. `ProBookmarks.jsx` slug extraction). Prefer
      `split("_")[0]`-style format-agnostic parsing.

## Verify (mandatory — this is the gate that was missing)

- [ ] **Live round-trip per new shape** — `GET` the new resource and assert
      `status === 200` (NOT 422). Confirm answer-keys are absent from the body.
- [ ] **Submit path** — POST a wrong answer (→ `passed:false`, 0 XP,
      actionable message) and a correct answer (→ `passed:true`, XP > 0).
- [ ] **Add to acceptance** — encode the round-trip in
      `scripts/acceptanceTestV3.mjs` (or a new `acceptanceTestV*.mjs`) and run
      `npm run acceptance:pro-java-v3`. Pattern Recognition lives there now.
- [ ] **Seed re-runnable** — `npm run seed:<thing>` is idempotent (upserts,
      no dupes on re-run).

## Docs

- [ ] Update `BLUEPRINT.md` + `ROADMAP.md` checkboxes only **after** the
      round-trip passes — never from a green build alone.

---

**Automated enforcement today:** `npm run acceptance:pro-java-v3` —
16 assertions covering the pattern_match GET (422 guard + no key leak),
topic-list `blanks` projection, wrong-answer, and correct-answer paths.

**Memory:** `feedback-api-roundtrip-validation` (auto-recalled each session).
