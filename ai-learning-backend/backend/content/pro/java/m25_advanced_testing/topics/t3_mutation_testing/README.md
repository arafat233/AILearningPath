# Topic 25.3: Mutation Testing with PITest

**Module**: M25 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 25 Progress**: 3/5 | **Course Progress**: 123 topics (72.4%)

## Key Concepts
- **Mutation testing**: introduces code mutations (bugs) and checks if tests catch them
- **Mutation score**: `killed / (total - no_coverage) × 100` — % of mutations your tests catch
- **Killed**: test fails when mutation is present (good — test detected the change)
- **Survived**: test still passes despite mutation (bad — test gap found)
- **PITest operators**: `ConditionalBoundary` (> → >=), `NegateConditionals` (> → <=), `VoidMethodCall` (removes void call), `ReturnValues` (changes return)
- **Killing ConditionalBoundary**: test EXACTLY at the boundary value (amount=0 and amount=1 both needed)
- **Killing VoidMethodCall**: `verify(mock).method(exactArgs)` — proves side-effect happened
- **Equivalent mutant**: mutation that changes code but not behavior (e.g., `log.debug()` removal) — acceptable survivor
- `mutationThreshold=80`: build fails if <80% mutations killed
- `targetClasses`: production classes to mutate (not DTOs/generated code)
- `pitest-junit5-plugin`: required for JUnit 5 support
- `historyInputFile`: incremental mode — skip re-testing unchanged mutations (huge speed boost)
- `threads=4`: parallel execution — each mutation tested in separate JVM
- **PITest in CI**: Maven profile `pitest-ci`, skip locally with `-DskipMutationTests=true`
- **Line coverage ≠ mutation score**: 95% line coverage can still have 60% mutation score (tests don't assert outcomes)

## Files: topic.json, exercises.json (~28KB), project.json, README.md
