# Topic 27.2: Spring for GraphQL — Resolvers & Controllers

**Module**: M27 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 27 Progress**: 2/5 | **Course Progress**: 132 topics (77.6%)

## Key Concepts
- **Starter**: `spring-boot-starter-graphql` + `spring-boot-starter-web`
- **Schema location**: `src/main/resources/graphql/schema.graphqls` (all `.graphqls` files loaded)
- **`@Controller`** (not `@RestController`) for GraphQL controllers
- **`@QueryMapping`**: maps method to `Query` type field (method name = field name by default)
- **`@MutationMapping`**: maps method to `Mutation` type field
- **`@SchemaMapping(typeName="X", field="y")`**: field resolver for `type X { y: ... }`
  - Called **once per parent object** in the result — N+1 risk! (solved by DataLoader in T3)
- **`@Argument`**: extracts GraphQL argument into Java parameter; auto-deserializes input types to records
- **Nullable return**: `product(id): Product` (nullable) → return `null` for not-found (clean)
- **Non-null return**: `createProduct: Product!` → never return null; throw exception if error
- **Error handling**: extend `DataFetcherExceptionResolverAdapter`, return `GraphQLError` with `ErrorType`
- **`@GraphQlTest`**: slice test — loads only GraphQL layer (fast); use `GraphQlTester` to execute queries
- **GraphQlTester**: `.document(query).execute().path("product.name").entity(String.class).isEqualTo(...)`
- **GraphiQL**: `spring.graphql.graphiql.enabled=true` → browser at `http://localhost:8080/graphiql`
- **Authentication**: inject from `GraphQlContext` or `@AuthenticationPrincipal` — never from `@Argument userId` (spoofable)
- **HTTP**: always `POST /graphql`; always HTTP 200 (errors in response body, not HTTP status)
- **`@Argument` for input types**: Spring auto-maps GraphQL input map → Java record by field name

## Files: topic.json (~12KB), exercises.json (~27KB), project.json, README.md
