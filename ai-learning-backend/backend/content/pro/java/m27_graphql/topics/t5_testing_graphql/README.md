# Topic 27.5: Testing GraphQL APIs

**Module**: M27 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 27 Progress**: 5/5 ✅ | **Course Progress**: 135 topics (79.4%)

## Key Concepts
- **`@GraphQlTest`**: Spring test slice — loads only `@Controller` + GraphQL beans (no full context)
- **`GraphQlTester`**: Spring's type-safe GraphQL test client (not MockMvc)
- **`.documentName("name")`**: loads from `src/test/resources/graphql-test/name.graphql`
- **`.document(gqlString)`**: inline GraphQL query/mutation (no file needed)
- **`.variable("key", value)`**: pass typed variable to query — REQUIRED for all declared `$vars`
- **`.execute().errors().verify()`**: asserts ZERO errors — call BEFORE any `.path()` assertions
- **`.execute().errors().satisfy(list -> ...)`**: inspect errors when errors ARE expected
- **`.path("field.subField")`**: dot-notation traversal of `data` object
- **`.entity(Type.class).isEqualTo()`**: type-safe single value assertion
- **`.entityList(Type.class).hasSize(N)`**: assert list response size and contents
- **`.path("list[0].field")`**: access specific list index via bracket notation
- **Subscriptions**: `.executeSubscription().toFlux().take(N).collectList().block(Duration.ofSeconds(5))`
- **`HttpGraphQlTester`**: full HTTP stack integration test (needs `@SpringBootTest(RANDOM_PORT)`)
- **`@WithMockUser`**: set up Spring Security context for authenticated GraphQL tests
- **DataLoader test**: `verify(repo, atMost(1)).findBySymbols(argThat(list -> ...))`
- **Test files**: `src/test/resources/graphql-test/*.graphql` — separate from production schemas

## Files: topic.json (~11KB), exercises.json (~27KB), project.json, README.md
