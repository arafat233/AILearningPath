# Topic 26.4: LangChain4j — AI Services & Agents

**Module**: M26 | **Difficulty**: ⭐⭐⭐⭐⭐⭐⭐ (7/10) | **Status**: 🟡 READY FOR REVIEW  
**Module 26 Progress**: 4/5 | **Course Progress**: 129 topics (75.9%)

## Key Concepts
- **AiServices**: declare interface → LangChain4j generates the AI-powered implementation
- **`@SystemMessage`**: AI persona/constraints on the interface method
- **`@UserMessage`**: marks the user input parameter
- **`@MemoryId`**: per-session conversation memory — LangChain4j manages history automatically
  - **Never hardcode**: `ai.chat(msg, "default")` — all users share memory = security violation
  - **Best practice**: composite key `merchantId + ":" + conversationId`
- **`MessageWindowChatMemory(maxMessages=10)`**: sliding window — oldest dropped at limit
- **`ChatMemoryProvider` @Bean**: provides one `ChatMemory` per unique memory ID
- **`@Tool("description")`**: marks methods callable by the AI (same concept as Spring AI)
- **`TokenStream`**: streaming return type (vs `Flux<String>` in Spring AI)
- **`ContentRetriever`**: `EmbeddingStoreContentRetriever` for RAG — wired via builder
- **`AiServices.create(I.class, model)`**: simple factory (no memory/RAG)
- **`AiServices.builder(I.class).chatLanguageModel().chatMemoryProvider().build()`**: full setup
- **Structured output**: declare record as return type → LangChain4j infers JSON schema automatically
- **Spring AI vs LangChain4j**: same models, different APIs — Spring AI = programmatic, LangChain4j = declarative
- Multi-tenant isolation: `merchantId:conversationId` composite key prevents cross-tenant memory leaks

## Files: topic.json (~12KB), exercises.json (~27KB), project.json, README.md
