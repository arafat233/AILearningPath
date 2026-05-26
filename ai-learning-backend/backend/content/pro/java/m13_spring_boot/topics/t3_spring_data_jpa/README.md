# Topic 13.3: Spring Data JPA

**Module**: M13 - Spring Boot Fundamentals
**Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10)
**Estimated Time**: 65 minutes
**Status**: 🟡 READY FOR REVIEW
**Prerequisites**: T13.2 (REST Controllers), T5.1 (Classes)

---

## What This Topic Teaches

1. `@Entity` — maps a Java class to a database table
2. `@Table(name="...")` — customize table name
3. `@Id` + `@GeneratedValue` — primary key + auto-generation
4. `@Column(nullable, length, name, unique, updatable)` — column config
5. Protected no-arg constructor — required by JPA/Hibernate
6. `JpaRepository<EntityType, IdType>` — free CRUD operations
7. Free methods: `save`, `findById`, `findAll`, `deleteById`, `existsById`, `count`
8. Derived queries: `findByCategory`, `findByPriceLessThan`, `findByNameContainingIgnoreCase`
9. Derived query keywords: `And`, `Or`, `Between`, `IgnoreCase`, `OrderBy`, `Top`, `Containing`
10. `@Query` — custom JPQL (entity field names, not column names)
11. `@Modifying` + `@Transactional` for UPDATE/DELETE @Query
12. `@Transactional` on service — all-or-nothing transaction boundary
13. H2 datasource in application.properties
14. `@DataJpaTest` — narrow JPA test slice with H2, rollback per test

---

## Files in This Topic

| File | Size | Purpose |
|------|------|---------|
| `topic.json` | ~24KB | Main content |
| `exercises.json` | ~40KB | 15 exercises |
| `project.json` | ~8KB | Flipkart Product Import Pipeline |
| `README.md` | This file |

---

## Content Highlights

### 🎯 Hook
Raw JDBC: 15 lines to query one row, manual connection management, boilerplate everywhere. Spring Data JPA: declare an interface, get all CRUD for free, add derived queries by naming methods.

### 📚 Teaching (5 Sub-sections)
1. **@Entity mapping**: annotations, protected constructor, field → column
2. **JpaRepository**: free CRUD methods, type parameters
3. **Derived queries**: method name parsing, all keywords
4. **@Query + @Transactional**: JPQL vs native, modifying queries, transactions
5. **H2 + @DataJpaTest**: test configuration, rollback per test, @Import for services

### 🛠️ Worked Example: Product JPA Migration
Converts HashMap-based ProductService to JPA. @Entity, @Column, JpaRepository, derived queries, @Transactional service, @DataJpaTest verification.

### ⚠️ 3 Common Gaps
1. **missing_no_arg_constructor** — HibernateException if absent
2. **jpql_uses_class_field_names** — @Column(name='x') changes DB column but JPQL still uses field name
3. **missing_transactional_on_modifying** — TransactionRequiredException at runtime

### 💪 15 Exercises (735 XP)
Key exercises:
- **Ex 8 (60 XP)**: @Query JPQL + aggregation + @DataJpaTest
- **Ex 9 (65 XP)**: @Transactional transfer service with rollback test
- **Ex 11 (70 XP)**: Full CRUD service with 6-test @DataJpaTest suite
- **Ex 13 (75 XP)**: REST + JPA complete stack
- **Ex 15 (95 XP)**: Zerodha portfolio tracker — @Query + @DataJpaTest

### 🚀 Mini-Project: Flipkart Product Import Pipeline
5 entities at startup via CommandLineRunner. 4 derived queries + @Query. @Transactional service. Full REST layer. @DataJpaTest for repository. H2 configured.

---

## The JPA Pattern

```java
// 1. Entity:
@Entity @Table(name="products")
public class Product {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private String id;
    @Column(nullable=false, length=200)              private String name;
    @Column(nullable=false)                           private double price;
    protected Product() {}  // required by JPA
    public Product(String name, double price) { ... }
    // getters + setters
}

// 2. Repository (zero implementation):
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product>    findByCategory(String category);
    List<Product>    findByPriceLessThan(double max);
    boolean          existsByName(String name);
    @Query("SELECT COUNT(DISTINCT p.category) FROM Product p")
    long             countDistinctCategories();
}

// 3. Service:
@Service @Transactional
public class ProductService {
    private final ProductRepository repo;
    ProductService(ProductRepository r) { repo = r; }
    // ... all methods use repo
}

// 4. Test:
@DataJpaTest
class ProductRepositoryTest {
    @Autowired ProductRepository repo;
    @Test void findByCategory_returns_correct_count() { ... }
}
```

---

## Review Checklist

- [ ] No-arg constructor requirement clearly stated
- [ ] JPQL field names vs column names distinction
- [ ] @Transactional on service, not repository
- [ ] @DataJpaTest: rollback per test, @Import for services
- [ ] Ex 10: JPQL correct (B and D) — verified

---

## Review Outcome

**Reviewer**: _________________
**Date**: _________________
**Status**: [ ] APPROVED [ ] APPROVED WITH EDITS [ ] NEEDS REVISION [ ] REJECTED

---

## Pipeline Performance

| Metric | T13.2 | T13.3 | Trend |
|--------|-------|-------|-------|
| Generation time | ~70 min | ~70 min | Stable |
| Word count | ~14K | ~15K | Slight increase (JPA coverage) |
| Exercises | 15 | 15 | Consistent |
| XP available | 710 | 735 | Slightly higher (harder topic) |

**Module 13 Progress**: 3/5 topics complete

---

## Production Stats

- **Generation time**: ~70 minutes
- **Files**: 4

**Course Progress**: 63 topics complete (37.1% of 170)

**Next**: Topic 13.4 — Request Handling, Validation, and Exception Handling
