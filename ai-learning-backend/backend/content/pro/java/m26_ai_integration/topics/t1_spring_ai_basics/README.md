# Topic 26.1: Spring AI Basics — Chat, Prompts & Models

**Module**: M26 | **Difficulty**: ⭐⭐⭐⭐⭐⭐ (6/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 26 Progress**: 1/5 | **Course Progress**: 126 topics (74.1%)

## Key Concepts
- **Spring AI starter**: `spring-ai-anthropic-spring-boot-starter` (or OpenAI, Ollama)
- **`ChatClient.Builder`**: Spring-autoconfigured — inject and call `.defaultSystem().build()`
- **`.defaultSystem()`**: sets AI persona/constraints for ALL conversations in that ChatClient
- **`.call().content()`**: synchronous — waits for full response, returns `String`
- **`.stream().content()`**: streaming — returns `Flux<String>`, tokens as generated (SSE for UI)
- **Parameterized prompts**: `.user(u -> u.text(template).param(k,v))` — prevents injection
- **Never**: `"Answer: " + userInput` — user can inject instructions via string concat
- **`@Tool`**: marks method as callable by AI; register with `.defaultTools(bean)`
- **`BeanOutputConverter<T>`**: AI returns JSON → auto-convert to Java record
  - `.getFormat()`: pass as param so AI knows exact JSON schema to produce
- **Temperature**: 0.0-0.3 for factual (banking), 0.7-1.0 for creative
- **API key**: `spring.ai.anthropic.api-key: ${ANTHROPIC_API_KEY}` — always env var
- **Rate limiting**: Bucket4j per-user to control AI costs
- **Prompt injection**: detect 'ignore previous', 'you are now', 'system:' patterns
- **Audit logging**: every AI call logged for compliance (RBI/SEBI requirements)
- **Multi-turn history**: `List<Message>` (UserMessage + AssistantMessage) per session

## Files: topic.json (~13KB), exercises.json (~28KB), project.json, README.md
