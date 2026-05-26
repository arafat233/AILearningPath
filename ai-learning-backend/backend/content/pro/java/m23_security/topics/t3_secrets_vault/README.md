# Topic 23.3: Secrets Management (HashiCorp Vault)

**Module**: M23 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 23 Progress**: 3/5 | **Course Progress**: 113 topics (66.5%)

## Key Concepts
- Dynamic secrets: unique credential per service instance, 1-hour TTL — leaked cred expires automatically
- Vault database engine: generates short-lived PostgreSQL users (`v-k8s-pay-abc123`) per service
- **Kubernetes auth**: pod's SA token authenticates to Vault — no static credential needed
- `bootstrap.yml`: Vault config must load before application context (before `application.yml`)
- `@Value("${key:default}")`: Spring Cloud Vault maps Vault KV → Spring properties automatically
- `VaultTemplate`: programmatic secret access for dynamic paths, writing, checking existence
- Vault policy: `capabilities = ["read"]` — least privilege; all other paths implicitly denied
- Lease renewal: Spring Cloud Vault auto-renews at 80% TTL
- `fail-fast: false`: allow startup without Vault (use fallback emergency credentials)
- **Audit log**: never log secret values — only path, operation, and timestamp
- ESO (External Secrets Operator): language-agnostic alternative — Vault → k8s Secret sync
- Vault PKI engine: dynamic TLS certificates with 24h TTL + auto-renewal

## Files: topic.json (~14KB), exercises.json (~26KB), project.json (~2KB), README.md
