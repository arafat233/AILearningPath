# Topic 20.3: Structured Logging

**Module**: M20 | **Difficulty**: ⭐⭐⭐⭐⭐ (5/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 20 Progress**: 3/5 | **Course Progress**: 98 topics (57.6%)

## Key Concepts
- Structured logs: JSON format; machine-parseable; queryable in Loki
- `MDC.put(key, value)`: adds key-value to thread-local log context
- `%X{key}`: Logback pattern reads MDC value
- `MDC.clear()` in finally: mandatory — thread pool reuse leaks context without it
- `LogstashEncoder`: converts all log statements + MDC to JSON automatically
- Log levels: ERROR (broken), WARN (degraded), INFO (business events), DEBUG (disabled in prod)
- Never log: card numbers, CVV, API keys, passwords, PAN
- Parameterized logging: `log.info("{}", value)` NOT `log.info("" + value)`
- Loki query: `{app='x'} | json | field > value`
- MDC in async: `getCopyOfContextMap()` → pass → `setContextMap()` in async thread

## Files: topic.json (~10KB), exercises.json (~28KB), project.json (~2KB), README.md
