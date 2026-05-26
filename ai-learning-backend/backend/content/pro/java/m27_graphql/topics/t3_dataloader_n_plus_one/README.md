# Topic 27.3: DataLoader — Solving the N+1 Problem

**Module**: M27 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 27 Progress**: 3/5 | **Course Progress**: 133 topics (78.2%)

## Key Concepts
- **N+1 problem**: 10 products with `@SchemaMapping reviews()` = **11 DB queries** (1 + 10)
- **`@BatchMapping`**: Spring's solution — receives `List<Parent>`, returns `Map<Parent, FieldType>`
- Spring collects ALL parent instances from the query, then calls `@BatchMapping` **once**
- `findByProductIdIn(ids)`: **1 SQL IN query** replacing N individual queries
- **Deduplication**: `distinct()` before batch query (same seller on multiple products → 1 lookup)
- **Return type**: `Map<Product, Seller>` (single value) or `Map<Product, List<Review>>` (list)
- **Grouping**: `reviews.stream().filter(r -> r.productId().equals(p.id()))` maps results back
- **Scaling**: `@BatchMapping` = O(1) queries; `@SchemaMapping` on list = O(N) queries
- **3-level nesting**: orders→payments→merchants = 3 queries (not 1+N+N²)
- **DataLoader caching**: same key in one request = cache hit (free, no DB call)
- `distinct()` for IDs: prevents duplicate batch keys
- **Query complexity limiting**: `depth × breadth` formula; reject above MAX=100
- **Partial failure**: some batch items fail → return error per item, succeed for others

## Files: topic.json (~12KB), exercises.json (~28KB), project.json, README.md
