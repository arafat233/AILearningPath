# Topic 23.4: Input Validation & OWASP Top 10

**Module**: M23 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 23 Progress**: 4/5 | **Course Progress**: 114 topics (67.1%)

## Key Concepts
- Mass assignment: **never use JPA Entity as @RequestBody** — use a DTO with only safe fields
- `@Valid` on `@RequestBody`: validates all constraints; failure → `MethodArgumentNotValidException` → 400
- `@RestControllerAdvice`: global handler returning structured `{field: errorMessage}` JSON
- JPA always uses `PreparedStatement` with `@Param` — SQL injection impossible by default
- **Never concatenate** user input into SQL strings — ever
- Custom `@Constraint` + `ConstraintValidator`: complex validation (valid ticker symbol, IBAN, etc.)
- Path traversal: `Path.resolve(input).normalize().startsWith(BASE_DIR)` — always verify
- XSS: sanitize stored user input (Jsoup), escape output (Thymeleaf), set CSP header
- `Content-Security-Policy: default-src 'self'`: browser blocks scripts from other origins
- `X-Frame-Options: DENY`: prevents clickjacking (your page embedded in attacker's iframe)
- CSRF: enable for session-based web apps, disable for JWT REST APIs
- `@Pattern(regexp=...)`: regex constraint for string format validation

## Files: topic.json (~12KB), exercises.json (~28KB), project.json (~2KB), README.md
