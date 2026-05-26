# Topic 17.4: JPA Advanced Relationships

**Module**: M17 - Advanced Database Engineering
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 55 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T17.3 (Connection Pooling & Query Optimization)

---

## What This Topic Teaches

1. `@ManyToMany` — bidirectional with `@JoinTable` (owning side) and `mappedBy` (inverse)
2. `@JoinTable(name, joinColumns, inverseJoinColumns)` — join table configuration
3. Cascade safety rule: `cascade = {CascadeType.PERSIST, CascadeType.MERGE}` on `@ManyToMany`
4. **NEVER** `CascadeType.REMOVE` or `CascadeType.ALL` on `@ManyToMany` — deletes shared entities!
5. Bidirectional helper methods: always update BOTH sides in `addX()`/`removeX()`
6. `orphanRemoval = true` — deletes child when removed from parent's collection
7. `orphanRemoval` safe only for **exclusive ownership** (`Order → OrderItem`)
8. `CascadeType.ALL + orphanRemoval` — for exclusively-owned children only
9. `@Embeddable` — value object stored as columns in parent table (no separate table, no JOIN)
10. `@Embedded` — places `@Embeddable` columns into the owning entity's row
11. `@AttributeOverrides` — required when embedding the same `@Embeddable` type twice
12. `@ElementCollection` — stores simple values or embeddables in a separate collection table
13. `@CollectionTable(name, joinColumns)` — configures the collection table
14. `@OrderColumn` — maintains `List` order in `@ElementCollection`
15. `@ElementCollection` limitation: DELETE all + re-INSERT on every collection save
16. Use separate `@Entity` (not `@ElementCollection`) for large or queryable collections
17. Soft delete: `boolean deleted = false` + `@SQLDelete` + `@Where(clause='deleted=false')`
18. `@SQLDelete(sql="UPDATE table SET deleted=true WHERE id=?")` — intercepts DELETE
19. `@Where(clause="deleted=false")` — automatically filters ALL JPA queries
20. Explicit join entity pattern: when join table needs extra columns (timestamps, grades)

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~22KB | Main content |
| `exercises.json` | ~44KB | 15 exercises |
| `project.json` | ~8KB | Flipkart Product Catalog |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
`cascade=CascadeType.ALL` on `@ManyToMany` → deleting one product deletes the Electronics category, breaking 10,000 other products. The correct cascade ({PERSIST, MERGE}) is a safety boundary.

### 📚 Teaching (4 Sub-sections)
1. **@ManyToMany**: @JoinTable, owning/inverse sides, bidirectional helper methods
2. **Cascade types**: safety matrix, when to use each, orphanRemoval rules
3. **@Embeddable**: value objects, @AttributeOverrides, vs @Entity
4. **@ElementCollection + soft delete**: collection table, limitations, @SQLDelete/@Where

### 🛠️ Worked Example: Flipkart Product Catalog
Product ↔ Category @ManyToMany (correct cascade), WarehouseAddress @Embeddable, tags @ElementCollection, soft delete with @SQLDelete + @Where. @DataJpaTest verifying all behaviors.

### ⚠️ 3 Common Gaps
1. **cascade_all_on_many_to_many** — CascadeType.ALL deletes shared Category entities
2. **forgetting_helper_methods** — one-sided update causes stale in-session state
3. **element_collection_performance** — DELETE all + re-INSERT on every save for large collections

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 7 (55 XP)**: @DataJpaTest for @ManyToMany — 3 tests, delete doesn't cascade
- **Ex 8 (60 XP)**: Classify 5 relationships with correct cascade + orphanRemoval
- **Ex 9 (60 XP)**: Soft delete — @SQLDelete + @Where + 3 tests
- **Ex 12 (65 XP)**: Explicit join entity (Enrollment with grade and timestamp)
- **Ex 13 (75 XP)**: Full Flipkart catalog — @ManyToMany + soft delete + tags — 4 tests
- **Ex 15 (95 XP)**: HDFC loan system — all advanced patterns combined — 3 tests

### 🚀 Mini-Project: Flipkart Product Catalog
Category self-reference + Product @ManyToMany + @Embeddable + @ElementCollection + soft delete + 5 @DataJpaTest tests.

---

## The Cascade Safety Matrix

| Relationship | Cascade | orphanRemoval | Reason |
|-------------|---------|---------------|--------|
| Order → OrderItem | ALL | true | Exclusive ownership |
| Blog → Comment | ALL | true | Exclusive ownership |
| Product → Category | {PERSIST, MERGE} | false | Shared reference |
| User → Role | {PERSIST, MERGE} | false | Shared reference |
| User → Address | — | — | @Embeddable, not a relationship |

---

## The @ManyToMany Template

```java
// OWNING SIDE (has @JoinTable):
@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})  // NEVER REMOVE!
@JoinTable(
    name = "product_categories",
    joinColumns = @JoinColumn(name = "product_id"),
    inverseJoinColumns = @JoinColumn(name = "category_id")
)
private Set<Category> categories = new HashSet<>();

// Helper method (ALWAYS update both sides):
public void addCategory(Category cat) {
    categories.add(cat);          // ← owning side
    cat.getProducts().add(this);  // ← inverse side (in-session consistency)
}

// NON-OWNING SIDE (has mappedBy):
@ManyToMany(mappedBy = "categories")  // 'categories' = field on Product
private Set<Product> products = new HashSet<>();
```

---

## Review Checklist

- [ ] CASCADE REMOVE on @ManyToMany: emphasized as DANGEROUS with concrete example
- [ ] Helper methods: addCategory updates BOTH sides — why this matters for same-session reads
- [ ] @Where + @SQLDelete: both annotations needed for complete soft delete
- [ ] @AttributeOverrides: required when embedding same type twice — tested in Ex 10
- [ ] @ElementCollection DELETE-all behavior: limitations clearly explained

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T17.3 | T17.4 | Trend |
|--------|-------|-------|-------|
| Generation time | ~72 min | ~75 min | Slightly higher (complex domain) |
| Word count | ~15K | ~16K | Higher |
| Exercises | 15 | 15 | Consistent |
| XP available | 745 | 735 | Stable |

**Module 17 Progress**: 4/5 topics complete

---

## Production Stats

- **Files**: 4
- **Course Progress**: 84 topics complete (49.4% of 170)

**Next**: Topic 17.5 — Database Transactions & Locking (Module 17 Final)
