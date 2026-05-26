# Topic 27.1: GraphQL Basics — Schema, Queries & Mutations

**Module**: M27 | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 27 Progress**: 1/5 | **Course Progress**: 131 topics (77.1%)

## Key Concepts
- **GraphQL**: one endpoint (`/graphql`), client specifies exactly which fields to return
- **Zero over-fetching**: only requested fields sent; **zero under-fetching**: nested data in one query
- **Schema Definition Language (SDL)**: `type`, `input`, `enum`, `scalar`, `interface`, `union`
- **Non-null (`!`)**: `String!` = required; `String` = nullable; `[Product!]!` = non-null list of non-null items
- **Object types** (`type`): for query/mutation return values; **Input types** (`input`): for mutation arguments — can't mix!
- **Query type**: read-only operations; **Mutation type**: write operations (side effects)
- **Nullable single-entity query**: `product(id: ID!): Product` (no `!`) — returns null if not found, not an error
- **Fragment**: reusable field set, spread with `...FragmentName`
- **Introspection**: `__schema`, `__type` — clients can query the schema itself (disable in production)
- **Schema evolution**:
  - ✅ Safe: add nullable field, add new query/mutation, add optional argument
  - ❌ Breaking: remove field, rename field, add required argument, nullable→non-null
  - Use `@deprecated(reason: "...")` before removing fields
- **Union type**: heterogeneous results (`SearchResult = Product | Category`)
- **Interface**: shared fields across types (`Node { id: ID! }`)
- **Custom scalars**: `DateTime`, `Rupee` (Long paise), `PAN` — for domain-specific types with validation
- **Pagination**: `ProductPage { items, total, page, hasNext }` — more extensible than raw list
- **GraphQL vs REST**: use GraphQL for interconnected data + multiple clients; REST for simple CRUD + files

## Files: topic.json (~12KB), exercises.json (~28KB), project.json, README.md
