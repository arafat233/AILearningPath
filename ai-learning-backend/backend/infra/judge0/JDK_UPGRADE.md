# Judge0 JDK Upgrade — getting Java 17/21 into the sandbox

## The problem (confirmed 2026-06-02)

The running Judge0 (`178.105.219.13:2358`, Judge0 **1.13.0**) exposes exactly one
Java language:

```
GET /languages  →  62  Java (OpenJDK 13.0.1)
```

OpenJDK 13 **cannot compile Java 14–21 features** — records (16), text blocks
(15), switch expressions (14), sealed classes (17), pattern matching (16–21).
This surfaced building **M49 "Modern Java Features"** (ROADMAP J1): `execution`
exercises returned *Compilation Error* on correct answers.

**Interim already in place:** M49 uses `predict_output` (read modern syntax →
predict output, graded by `text_match`) — no compiler needed, ships today.
This upgrade is what unblocks *runnable* modern-Java exercises (and lets M49
move back to real code exercises if desired).

## Why a version bump alone won't fix it

Judge0 CE pins its compilers in the `judge0/compilers` image and does **not**
update language versions across the 1.x line. Pulling a newer `judge0/judge0`
tag still ships OpenJDK 13. You must add a newer JDK yourself.

## The code is already ready

`services/codeExecutionService.js` reads the Java language ID from an env var:

```js
const JAVA_LANGUAGE_ID = Number(process.env.JUDGE0_JAVA_LANGUAGE_ID) || 62;
```

So once a newer JDK is registered as a new Judge0 language ID, the app side is a
**one-line env change** — no code deploy:

```
JUDGE0_JAVA_LANGUAGE_ID=<new id>
```

---

## Option A — Custom Judge0 compilers image with JDK 21 (recommended)

Judge0 runs each submission via `isolate` using the compiler binaries baked into
the worker image. Add JDK 21 and register a language row.

1. **Build a worker image with JDK 21.** On the box, create a Dockerfile:
   ```dockerfile
   FROM judge0/judge0:1.13.0
   # Install Temurin/OpenJDK 21 alongside the existing 13
   RUN apt-get update && apt-get install -y wget gnupg \
       && wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | apt-key add - \
       && echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/VERSION_CODENAME/{print$2}' /etc/os-release) main" > /etc/apt/sources.list.d/adoptium.list \
       && apt-get update && apt-get install -y temurin-21-jdk
   ```
   Build + tag: `docker build -t stellar-judge0:jdk21 .`
   Point both `server` and `workers` in `docker-compose.judge0.yml` at this tag.

2. **Register the new language** (Judge0 stores languages in its Postgres DB).
   Insert a row whose `compile_cmd` / `run_cmd` use the JDK 21 paths
   (`/opt/java/openjdk-21/bin/javac` etc.), e.g. via the Judge0 admin or SQL.
   Note the assigned `id`.

3. **Verify** the new id appears:
   ```
   curl -H "X-Auth-Token: $TOKEN" http://localhost:2358/languages | grep -i 'openjdk 21'
   ```

4. **Flip the app:** set `JUDGE0_JAVA_LANGUAGE_ID=<new id>` in the backend `.env`,
   restart the backend.

## Option B — Migrate the sandbox to Piston

[engineer-man/piston](https://github.com/engineer-man/piston) self-hosts cleanly
and installs language versions on demand (`piston pkg install java <version>`).
Larger change: `codeExecutionService.js` speaks the Judge0 REST shape, so you'd
add a Piston adapter. Worth it only if you also want easy multi-language /
multi-version support beyond Java.

---

## Post-upgrade verification checklist

- [ ] `GET /languages` shows the new JDK id.
- [ ] `JUDGE0_JAVA_LANGUAGE_ID=<id>` set in backend `.env`; backend restarted.
- [ ] Probe: submit a record/text-block/switch-expression program → compiles + runs.
- [ ] (Optional) convert M49 `predict_output` exercises back to `execution` and
      re-run `npm run acceptance:pro-content`.
- [ ] Existing classic-Java modules (M47 Bitwise, etc.) still pass — they used
      no 14+ syntax, so the new JDK is backward-compatible.

## Safety notes

- This is a change to a **production sandbox box** — do it in a maintenance
  window; keep the JDK 13 language registered as a fallback during cutover.
- Never expose Judge0's port beyond `127.0.0.1` (see docker-compose header).
- Keep image tags pinned; never `:latest`.
