# Topic 4: API Design — REST, Versioning, Idempotency

**Module**: M43 | **Difficulty**: ⭐⭐⭐⭐⭐

## Key Concepts
- REST status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauth, 403 Forbidden, 404, 429, 500
- Idempotency key: client generates UUID; server deduplicates on retry; critical for payments
- Versioning: /v1/path is most common; header-based is cleaner but harder to test
- Rate limiting headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After
- Pagination response: {data:[], next_cursor:'xyz', has_more:true}
- HATEOAS: include links to related resources; rarely used in practice

## Files: topic.json, exercises.json, project.json, README.md
