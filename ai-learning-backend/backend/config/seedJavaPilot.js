/**
 * Pro-track Java seed.
 *
 * Walks `ai-learning-backend/backend/content/pro/java/m*\/topics/t*\/` and
 * upserts all modules / topics / exercises / projects into MongoDB.
 *
 * Idempotent: safe to re-run. Uses upsert on unique keys.
 *
 * Usage:  node config/seedJavaPilot.js
 *  npm script:  npm run seed:pro-java-pilot
 */

import "dotenv/config";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ProTrack, ProModule, ProTopic, ProExercise, ProProject,
} from "../models/proModels.js";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const JAVA_ROOT  = path.resolve(__dirname, "..", "content", "pro", "java");

// ── Module metadata (drives ProModule docs) ─────────────────────────────────
// Folder-name → { moduleId, moduleNumber, slug, description, estimatedHours,
// prerequisites }.
// The display `name` lives here as `displayName` — authoritative for the
// module card heading. Previously this came from topic.json's `module_name`
// but 13 modules (M34-M46) shipped without it, leaving "Java Module 34"-
// style placeholders in the UI. MODULE_META is now the single source.
const MODULE_META = {
  m1_fundamentals: {
    moduleId: "java_m1", moduleNumber: 1, displayName: "Java Fundamentals", slug: "fundamentals",
    description: "Setting up Java, your first program, variables, operators, conditionals, loops, and reading user input. The building blocks every Java developer uses every day.",
    estimatedHours: 10, prerequisites: [],
  },
  m2_methods: {
    moduleId: "java_m2", moduleNumber: 2, displayName: "Methods & Code Organization", slug: "methods",
    description: "Breaking programs into named, reusable pieces. Parameters, return values, overloading, scope, and recursion — where 'writing code' becomes 'engineering software'.",
    estimatedHours: 10, prerequisites: ["java_m1"],
  },
  m3_arrays_strings: {
    moduleId: "java_m3", moduleNumber: 3, displayName: "Arrays & Strings", slug: "arrays-strings",
    description: "Arrays for handling multiple values, the Arrays utility class, multidimensional arrays, and the full Java String API including StringBuilder for performance.",
    estimatedHours: 12, prerequisites: ["java_m2"],
  },
  m4_oop_fundamentals: {
    moduleId: "java_m4", moduleNumber: 4, displayName: "Object-Oriented Programming Fundamentals", slug: "oop-fundamentals",
    description: "Classes, objects, constructors, encapsulation, instance vs static, and composition. The leap from procedural to object-oriented thinking.",
    estimatedHours: 14, prerequisites: ["java_m3"],
  },
  m5_inheritance_polymorphism: {
    moduleId: "java_m5", moduleNumber: 5, displayName: "Inheritance & Polymorphism", slug: "inheritance-polymorphism",
    description: "Inheritance, polymorphism, abstract classes, interfaces, and the Comparator pattern. The mechanisms behind every Java framework.",
    estimatedHours: 12, prerequisites: ["java_m4"],
  },
  m6_collections: {
    moduleId: "java_m6", moduleNumber: 6, displayName: "Collections Framework", slug: "collections",
    description: "ArrayList, HashMap, HashSet, Iterator, and choosing the right collection. The data structures behind every Java backend.",
    estimatedHours: 12, prerequisites: ["java_m5"],
  },
  m7_exception_handling: {
    moduleId: "java_m7", moduleNumber: 7, displayName: "Exception Handling", slug: "exception-handling",
    description: "try / catch / finally, exception types, custom exceptions, defensive programming, and try-with-resources. Stop crashing on bad input — respond to it professionally.",
    estimatedHours: 10, prerequisites: ["java_m6"],
  },
  m8_lambdas_streams: {
    moduleId: "java_m8", moduleNumber: 8, displayName: "Lambda Expressions & Streams", slug: "lambdas-streams",
    description: "Lambda expressions, functional interfaces (Predicate/Function/Consumer/Supplier), Stream API, Collectors, and Optional. Modern Java's functional programming model — the vocabulary of every Spring Boot codebase.",
    estimatedHours: 12, prerequisites: ["java_m7"],
  },
  m9_generics: {
    moduleId: "java_m9", moduleNumber: 9, displayName: "Generics", slug: "generics",
    description: "Generic classes, generic methods, bounded type parameters, wildcards (PECS), and generic interfaces (Repository, Mapper, Strategy patterns). Stop being a generics consumer — become a producer.",
    estimatedHours: 10, prerequisites: ["java_m8"],
  },
  m10_concurrency: {
    moduleId: "java_m10", moduleNumber: 10, displayName: "Concurrency and Threads", slug: "concurrency",
    description: "Thread basics, synchronization, ExecutorService, concurrent collections, and CompletableFuture. The skills behind every scalable backend and every responsive UI.",
    estimatedHours: 14, prerequisites: ["java_m9"],
  },
  m11_io_files: {
    moduleId: "java_m11", moduleNumber: 11, displayName: "I/O, Files, and Networking", slug: "io-files",
    description: "NIO file API (Path + Files), buffered I/O, CSV/JSON parsing, Java HttpClient, and async I/O combining CompletableFuture + HttpClient. The bridge from in-memory Java to the real world.",
    estimatedHours: 12, prerequisites: ["java_m10"],
  },
  m12_testing: {
    moduleId: "java_m12", moduleNumber: 12, displayName: "Unit Testing with JUnit 5", slug: "testing",
    description: "JUnit 5 basics, parameterized tests, Mockito, testing I/O & HTTP, and Test-Driven Development. The skill that separates senior from junior engineers.",
    estimatedHours: 12, prerequisites: ["java_m11"],
  },
  m13_spring_boot: {
    moduleId: "java_m13", moduleNumber: 13, displayName: "Spring Boot Fundamentals", slug: "spring-boot",
    description: "Spring Boot intro, REST controllers, Spring Data JPA, validation & exception handling, and Spring Boot testing. The #1 Java framework in industry — 85% of Java job postings.",
    estimatedHours: 14, prerequisites: ["java_m12"],
  },
  m14_spring_advanced: {
    moduleId: "java_m14", moduleNumber: 14, displayName: "Advanced Spring Boot", slug: "spring-advanced",
    description: "Spring Security + JWT, async/scheduled tasks, Spring Cache, configuration properties, and Actuator. The production-grade Spring Boot toolkit.",
    estimatedHours: 14, prerequisites: ["java_m13"],
  },
  m15_microservices: {
    moduleId: "java_m15", moduleNumber: 15, displayName: "Microservices Architecture", slug: "microservices",
    description: "Microservices intro, Feign client, Eureka service discovery, Resilience4j circuit breaker, and distributed tracing. How Flipkart, Swiggy, Razorpay run hundreds of services.",
    estimatedHours: 14, prerequisites: ["java_m14"],
  },
  m16_kafka: {
    moduleId: "java_m16", moduleNumber: 16, displayName: "Apache Kafka & Event-Driven Architecture", slug: "kafka",
    description: "Apache Kafka intro, producers, consumers, Kafka Streams, and schema registry. The event-streaming backbone of every modern Indian tech company.",
    estimatedHours: 12, prerequisites: ["java_m15"],
  },
  m17_database: {
    moduleId: "java_m17", moduleNumber: 17, displayName: "Advanced Database Engineering", slug: "database",
    description: "PostgreSQL + Flyway migrations, N+1 query problem, connection pooling, JPA relationships, and transactions/locking. Database engineering for production.",
    estimatedHours: 12, prerequisites: ["java_m13"],
  },
  m18_redis: {
    moduleId: "java_m18", moduleNumber: 18, displayName: "Redis Caching & Rate Limiting", slug: "redis",
    description: "Redis fundamentals + Spring Cache, cache-aside, rate limiting, distributed locks, pub/sub. The universal caching layer for production Java.",
    estimatedHours: 10, prerequisites: ["java_m17"],
  },
  m19_resilience: {
    moduleId: "java_m19", moduleNumber: 19, displayName: "Microservice Resilience", slug: "resilience",
    description: "Microservice resilience deep-dive: Resilience4j circuit breaker, retry + rate limiter, bulkhead, timeout + fallback, gateway resilience. Stop cascade failures.",
    estimatedHours: 10, prerequisites: ["java_m18"],
  },
  m20_observability: {
    moduleId: "java_m20", moduleNumber: 20, displayName: "Observability", slug: "observability",
    description: "Actuator + Micrometer, distributed tracing, structured logging, Prometheus + Grafana, and alerting + SLOs. The three pillars of observability for production.",
    estimatedHours: 10, prerequisites: ["java_m19"],
  },
  m21_deployment: {
    moduleId: "java_m21", moduleNumber: 21, displayName: "Production Deployment", slug: "deployment",
    description: "Docker, Kubernetes, K8s config (ConfigMaps/Secrets), CI/CD with GitHub Actions, and blue-green deployments. From localhost to production.",
    estimatedHours: 12, prerequisites: ["java_m20"],
  },
  m22_performance: {
    moduleId: "java_m22", moduleNumber: 22, displayName: "Performance & Optimization", slug: "performance",
    description: "JVM tuning, DB query optimization, HikariCP connection pool tuning, caching strategies, and load testing. Production-grade performance engineering.",
    estimatedHours: 10, prerequisites: ["java_m21"],
  },
  m23_security: {
    moduleId: "java_m23", moduleNumber: 23, displayName: "Security", slug: "security",
    description: "JWT authentication, OAuth2, secrets management (Vault), input validation, and rate limiting. Production security beyond basic auth.",
    estimatedHours: 10, prerequisites: ["java_m22"],
  },
  m24_system_design: {
    moduleId: "java_m24", moduleNumber: 24, displayName: "System Design Patterns", slug: "system-design",
    description: "CQRS, event sourcing, saga pattern, strangler fig, bulkhead/sidecar. Senior-level distributed system patterns.",
    estimatedHours: 12, prerequisites: ["java_m23"],
  },
  m25_advanced_testing: {
    moduleId: "java_m25", moduleNumber: 25, displayName: "Advanced Testing Strategies", slug: "advanced-testing",
    description: "Testcontainers, contract testing (Pact), mutation testing (PIT), performance testing, chaos engineering. Beyond unit tests.",
    estimatedHours: 10, prerequisites: ["java_m24"],
  },
  m26_ai_integration: {
    moduleId: "java_m26", moduleNumber: 26, displayName: "AI-Powered Java Applications", slug: "ai-integration",
    description: "Spring AI basics, RAG with vector stores, AI-powered features, LangChain4j, testing AI apps. LLM integration for Java backends.",
    estimatedHours: 10, prerequisites: ["java_m25"],
  },
  m27_graphql: {
    moduleId: "java_m27", moduleNumber: 27, displayName: "GraphQL with Spring Boot", slug: "graphql",
    description: "GraphQL basics, Spring for GraphQL, DataLoader for N+1, subscriptions, testing GraphQL. Modern alternative to REST.",
    estimatedHours: 10, prerequisites: ["java_m26"],
  },
  m28_grpc: {
    moduleId: "java_m28", moduleNumber: 28, displayName: "gRPC with Spring Boot", slug: "grpc",
    description: "gRPC basics, Spring gRPC, streaming (unary/server/client/bidi), gRPC security, testing with InProcessServer. High-performance binary RPC.",
    estimatedHours: 10, prerequisites: ["java_m27"],
  },
  m29_dsa1_complexity: {
    moduleId: "java_m29", moduleNumber: 29, displayName: "DSA1: Big-O & Complexity Analysis", slug: "dsa-complexity",
    description: "Big O notation, analyzing code, space complexity, best/worst/amortized cases. The DSA foundation.",
    estimatedHours: 6, prerequisites: ["java_m6"],
  },
  m30_dsa2_arrays: {
    moduleId: "java_m30", moduleNumber: 30, displayName: "DSA2: Array Patterns", slug: "dsa-arrays",
    description: "Two pointers, sliding window, prefix sums, Dutch national flag, array synthesis. Core array patterns for interviews.",
    estimatedHours: 8, prerequisites: ["java_m29"],
  },
  m31_dsa3_strings: {
    moduleId: "java_m31", moduleNumber: 31, displayName: "DSA3: String Algorithms", slug: "dsa-strings",
    description: "String fundamentals, pattern matching, palindromes, anagrams/frequency, string DP. Interview string problems.",
    estimatedHours: 8, prerequisites: ["java_m30"],
  },
  m32_dsa4_linked_lists: {
    moduleId: "java_m32", moduleNumber: 32, displayName: "DSA4: Linked Lists", slug: "dsa-linked-lists",
    description: "Linked list basics, two-pointer technique, reversal, cycle detection (Floyd's), merge sort on LL. Classic interview territory.",
    estimatedHours: 8, prerequisites: ["java_m31"],
  },
  m33_dsa5_stacks_queues: {
    moduleId: "java_m33", moduleNumber: 33, displayName: "DSA5: Stacks & Queues", slug: "dsa-stacks-queues",
    description: "Stack fundamentals, monotonic stack, queue fundamentals, deque + sliding window, synthesis problems.",
    estimatedHours: 8, prerequisites: ["java_m32"],
  },
  m34_dsa6_hash_tables: {
    moduleId: "java_m34", moduleNumber: 34, displayName: "DSA6: Hash Tables", slug: "dsa-hash-tables",
    description: "Hash fundamentals, HashMap patterns, HashSet applications, custom hash keys, synthesis problems.",
    estimatedHours: 8, prerequisites: ["java_m33"],
  },
  m35_dsa7_trees_bst: {
    moduleId: "java_m35", moduleNumber: 35, displayName: "DSA7: Trees & BST", slug: "dsa-trees-bst",
    description: "Tree traversals (DFS/BFS), classic tree problems, BST operations, path problems, Trie. The tree toolkit.",
    estimatedHours: 10, prerequisites: ["java_m34"],
  },
  m36_dsa8_heaps: {
    moduleId: "java_m36", moduleNumber: 36, displayName: "DSA8: Heaps & Priority Queues", slug: "dsa-heaps",
    description: "Heap fundamentals, top-K patterns, custom priority queue design, K-way merge problems, synthesis. Heap mastery.",
    estimatedHours: 8, prerequisites: ["java_m35"],
  },
  m37_dsa9_graphs: {
    moduleId: "java_m37", moduleNumber: 37, displayName: "DSA9: Graphs", slug: "dsa-graphs",
    description: "Graph representation, BFS/DFS, topological sort, shortest path (Dijkstra/BFS), synthesis problems.",
    estimatedHours: 10, prerequisites: ["java_m36"],
  },
  m38_dsa10_sorting: {
    moduleId: "java_m38", moduleNumber: 38, displayName: "DSA10: Sorting Algorithms", slug: "dsa-sorting",
    description: "Comparison sorts (quick/merge/heap), non-comparison sorts (counting/radix), applications, custom Comparator sort, synthesis.",
    estimatedHours: 8, prerequisites: ["java_m37"],
  },
  m39_dsa11_binary_search: {
    moduleId: "java_m39", moduleNumber: 39, displayName: "DSA11: Binary Search", slug: "dsa-binary-search",
    description: "Binary search basics, search on answer space, rotated arrays, 2D binary search, synthesis problems.",
    estimatedHours: 8, prerequisites: ["java_m38"],
  },
  m40_dsa12_backtracking: {
    moduleId: "java_m40", moduleNumber: 40, displayName: "DSA12: Backtracking", slug: "dsa-backtracking",
    description: "Backtracking template, permutations/combinations, Sudoku + N-Queens, word search, synthesis problems.",
    estimatedHours: 8, prerequisites: ["java_m39"],
  },
  m41_dsa13_dynamic_programming: {
    moduleId: "java_m41", moduleNumber: 41, displayName: "DSA13: Dynamic Programming", slug: "dsa-dynamic-programming",
    description: "DP fundamentals, 1D DP, 2D DP, tree + interval DP, synthesis problems. The interview-final boss.",
    estimatedHours: 12, prerequisites: ["java_m40"],
  },
  m42_interview_prep_1: {
    moduleId: "java_m42", moduleNumber: 42, displayName: "Interview Prep 1: Coding Foundations", slug: "interview-prep-1",
    description: "Interview mindset, problem-solving framework, communicating time complexity, common patterns review, coding interview synthesis.",
    estimatedHours: 6, prerequisites: ["java_m41"],
  },
  m43_interview_prep_2: {
    moduleId: "java_m43", moduleNumber: 43, displayName: "Interview Prep 2: System Design", slug: "interview-prep-2",
    description: "System design basics, scalability patterns, database design, API design, system design synthesis.",
    estimatedHours: 6, prerequisites: ["java_m42"],
  },
  m44_interview_prep_3: {
    moduleId: "java_m44", moduleNumber: 44, displayName: "Interview Prep 3: Behavioral", slug: "interview-prep-3",
    description: "Behavioral interviews: STAR method, leadership/collaboration stories, technical decisions, career narrative, synthesis.",
    estimatedHours: 5, prerequisites: ["java_m43"],
  },
  m45_interview_prep_4: {
    moduleId: "java_m45", moduleNumber: 45, displayName: "Interview Prep 4: Mock Coding Rounds", slug: "interview-prep-4",
    description: "Mock coding rounds: easy / medium / hard / timed practice / synthesis. Real interview pacing.",
    estimatedHours: 8, prerequisites: ["java_m44"],
  },
  m46_interview_prep_5: {
    moduleId: "java_m46", moduleNumber: 46, displayName: "Interview Prep 5: Company-Specific", slug: "interview-prep-5",
    description: "Company-specific prep: Zerodha, Flipkart, Razorpay, HDFC/CTS, plus final readiness checklist. Interview day ready.",
    estimatedHours: 6, prerequisites: ["java_m45"],
  },
};

const TRACK_KEY = "pro_java";

// ── helpers ─────────────────────────────────────────────────────────────────
async function readJson(file) {
  try {
    const text = await fs.readFile(file, "utf8");
    return JSON.parse(text);
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw new Error(`Failed to parse ${file}: ${err.message}`);
  }
}

function defaultXpForLevel(level) {
  return { warmup: 5, easy: 10, medium: 20, hard: 40 }[level] ?? 10;
}

function mapExercise(raw, moduleId, topicId, position) {
  return {
    trackKey:         TRACK_KEY,
    moduleId,
    topicId,
    exerciseId:       raw.id,
    position,
    level:            raw.level,
    type:             raw.type,
    title:            raw.title || "",
    scenario:         raw.scenario || "",
    instructions:     raw.instructions || "",
    starterCode:      raw.starter_code || "",
    expectedSolution: raw.expected_solution || "",
    blanks:           raw.blanks || [],
    testCases:        raw.test_cases || [],
    hints:            raw.hints || [],
    xpReward:         raw.xp_reward ?? defaultXpForLevel(raw.level),
    difficulty:       typeof raw.difficulty === "number" ? Math.min(1, raw.difficulty / 6) : 0.3,
  };
}

function flattenRequirements(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const out = [];
    for (const [category, list] of Object.entries(raw)) {
      if (!Array.isArray(list)) continue;
      for (const r of list) {
        out.push({
          id:          r.id ? `${category}_${r.id}` : `${category}_${out.length + 1}`,
          description: r.description || (typeof r === "string" ? r : ""),
          weight:      typeof r.weight === "number" ? r.weight : 1,
        });
      }
    }
    return out;
  }
  return [];
}

function mapProject(raw, moduleId, topicId) {
  return {
    trackKey:         TRACK_KEY,
    moduleId,
    topicId,
    projectId:        raw.project_id || raw.id || `${topicId}_proj`,
    name:             raw.name || raw.title || "Project",
    scenario:         raw.scenario || "",
    description:      raw.description || "",
    requirements:     flattenRequirements(raw.requirements),
    estimatedMinutes: raw.estimated_minutes || raw.estimatedMinutes || 0,
    difficulty:       typeof raw.difficulty === "number" ? Math.min(1, raw.difficulty / 6) : 0.5,
  };
}

// ── Interactive visualizer wiring (v3 Phase 1.A) ────────────────────────────
// topicId → ProTopic.visualizer payload. Kept here (an integration concern)
// instead of in topic.json files so content authoring stays focused on
// teaching text. Frontend lazy-loads VisualizerShell, so adding a topic to
// this map costs ~0 KB on the bundles for topics not in the map.
//
// kind values must match the dispatch in components/dsa/VisualizerShell.jsx:
//   "sorting-sandbox" | "binary-search" | "linked-list" | "stack" |
//   "tree" | "array-pointers"
const TOPIC_VISUALIZERS = {
  // A11 — proof topic (sorting).
  "java_m38_t1": { kind: "sorting-sandbox",   config: {} },
  // A13 — Two Pointers — O(n) Pair Problems.
  "java_m30_t1": { kind: "array-pointers",    config: {} },
  // A14 — Linked List Basics + Reversal share the same replay widget for now.
  "java_m32_t1": { kind: "linked-list",       config: {} },
  "java_m32_t3": { kind: "linked-list",       config: {} },
  // A15 — Stack Fundamentals (LIFO, push/pop/peek).
  "java_m33_t1": { kind: "stack",             config: {} },
  // A16 (re-wired) — M35-T1 is actually "Tree Traversals" per content;
  // the BST insert/search demo moved to M35-T3 "BST Operations".
  "java_m35_t1": { kind: "tree-traversal",    config: {} },   // was: tree
  "java_m35_t3": { kind: "tree",              config: {} },   // new home for BST demo
  // A17 — Binary Search Basics.
  "java_m39_t1": { kind: "binary-search",     config: {} },
  // A18 — Heap Fundamentals (min-heap insert + extract, array+tree paired).
  "java_m36_t1": { kind: "heap",              config: {} },
  // A19 — Hash Fundamentals (separate-chaining put/get, collisions visible).
  "java_m34_t1": { kind: "hash-table",        config: {} },
  // A20 — Pattern Matching — KMP (text + pattern + failure table view).
  "java_m31_t2": { kind: "string-matching",   config: {} },
  // A21 — Graph Representation (BFS + DFS on a 7-node graph with cycle).
  "java_m37_t1": { kind: "graph",             config: {} },
  // A22-A33 — T2-T5 coverage across DSA modules.
  "java_m30_t2": { kind: "sliding-window",    config: {} },   // A22
  "java_m30_t4": { kind: "dutch-flag",        config: {} },   // A23
  "java_m31_t3": { kind: "palindrome",        config: {} },   // A24
  "java_m31_t5": { kind: "dp-grid",           config: {} },   // A25 (LCS)
  "java_m32_t2": { kind: "linked-list-cycle", config: {} },   // A26 (two-pointer on LL ≈ Floyd's)
  "java_m32_t4": { kind: "linked-list-cycle", config: {} },   // A26 (Floyd's exact)
  "java_m33_t2": { kind: "monotonic-stack",   config: {} },   // A27
  "java_m35_t5": { kind: "trie",              config: {} },   // A28
  "java_m36_t2": { kind: "k-largest",         config: {} },   // A29
  "java_m37_t3": { kind: "graph-topo",        config: {} },   // A30
  "java_m37_t4": { kind: "graph-dijkstra",    config: {} },   // A31
};

function mapTopic(raw, moduleId) {
  return {
    trackKey:              TRACK_KEY,
    moduleId,
    topicId:               raw.topic_id,
    topicNumber:           raw.topic_number || 1,
    name:                  raw.name,
    slug:                  raw.slug || "",
    metadata:              raw.metadata || {},
    hook:                  raw.hook || {},
    teaching:              raw.teaching || {},
    industryApplications:  raw.applications?.industry_examples || raw.industry_applications || {},
    interviewRelevance:    raw.applications?.interview_relevance || raw.interview_relevance || "",
    commonGaps:            raw.common_gaps || {},
    prerequisites:         raw.metadata?.prerequisites || [],
    estimatedMinutes:      raw.metadata?.estimated_minutes || 30,
    difficulty:            typeof raw.metadata?.difficulty === "number" ? Math.min(1, raw.metadata.difficulty / 6) : 0.2,
    xpReward:              50,
    visualizer:            TOPIC_VISUALIZERS[raw.topic_id] || null,
  };
}

// ── main ────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`Reading from: ${JAVA_ROOT}\n`);

  // ── 1. ProTrack ────────────────────────────────────────────────────────────
  const trackDoc = {
    key:         TRACK_KEY,
    slug:        "java",
    name:        "Java — From Zero to Job-Ready",
    description: "Industrial-strength Java for first jobs, internships, and interviews.",
    language:    "java",
    iconUrl:     null,
    coverUrl:    null,
    status:      "live",
  };
  await ProTrack.findOneAndUpdate({ key: TRACK_KEY }, trackDoc, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log(`✓ ProTrack: ${TRACK_KEY}\n`);

  // ── 2. Walk modules ────────────────────────────────────────────────────────
  const moduleFolders = (await fs.readdir(JAVA_ROOT, { withFileTypes: true }))
    .filter(d => d.isDirectory() && MODULE_META[d.name])
    .sort((a, b) => MODULE_META[a.name].moduleNumber - MODULE_META[b.name].moduleNumber);

  let totalTopics = 0, totalExercises = 0, totalProjects = 0;

  for (const moduleDir of moduleFolders) {
    const meta = MODULE_META[moduleDir.name];
    const moduleId = meta.moduleId;
    const topicsDir = path.join(JAVA_ROOT, moduleDir.name, "topics");
    if (!existsSync(topicsDir)) {
      console.log(`  · no topics in ${moduleDir.name} — skipping`);
      continue;
    }

    // Discover topic folders, sorted by their topic_number in topic.json
    const topicFolders = (await fs.readdir(topicsDir, { withFileTypes: true }))
      .filter(d => d.isDirectory());

    // Read each topic.json to get module_name (for display) and sort
    const topicEntries = [];
    for (const tf of topicFolders) {
      const tjsonPath = path.join(topicsDir, tf.name, "topic.json");
      const topic = await readJson(tjsonPath);
      if (!topic) {
        console.log(`  · skipping ${tf.name} — no topic.json`);
        continue;
      }
      topicEntries.push({ folder: tf.name, topic });
    }
    topicEntries.sort((a, b) => (a.topic.topic_number || 0) - (b.topic.topic_number || 0));

    // ProModule upsert (use the first topic's module_name)
    // MODULE_META.displayName is the authoritative name (single source of truth).
    // Fall back to the first topic's module_name only if displayName is missing,
    // and finally to a generic placeholder.
    const moduleName = meta.displayName
      || topicEntries[0]?.topic.module_name
      || `Java Module ${meta.moduleNumber}`;
    await ProModule.findOneAndUpdate(
      { moduleId },
      {
        trackKey:       TRACK_KEY,
        moduleId,
        moduleNumber:   meta.moduleNumber,
        name:           moduleName,
        slug:           meta.slug,
        description:    meta.description,
        estimatedHours: meta.estimatedHours,
        prerequisites:  meta.prerequisites,
        status:         "live",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`▼ ProModule ${moduleId}: ${moduleName} (${topicEntries.length} topics)`);

    // Topics
    for (const { folder, topic } of topicEntries) {
      const topicDir = path.join(topicsDir, folder);
      const topicDoc = mapTopic(topic, moduleId);
      await ProTopic.findOneAndUpdate({ topicId: topicDoc.topicId }, topicDoc, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log(`  ✓ ProTopic ${topicDoc.topicId}: ${topicDoc.name}`);
      totalTopics++;

      // Exercises
      const exercises = await readJson(path.join(topicDir, "exercises.json"));
      const rawExercises = exercises?.exercises || [];
      for (let i = 0; i < rawExercises.length; i++) {
        const doc = mapExercise(rawExercises[i], moduleId, topicDoc.topicId, i + 1);
        await ProExercise.findOneAndUpdate({ exerciseId: doc.exerciseId }, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
        totalExercises++;
      }
      if (rawExercises.length) console.log(`    + ${rawExercises.length} exercises`);

      // Project
      const project = await readJson(path.join(topicDir, "project.json"));
      if (project) {
        const doc = mapProject(project, moduleId, topicDoc.topicId);
        await ProProject.findOneAndUpdate({ projectId: doc.projectId }, doc, { upsert: true, new: true, setDefaultsOnInsert: true });
        totalProjects++;
      }
    }
  }

  // ── 3. Update aggregate counts on ProTrack ─────────────────────────────────
  const [totalModules, exAgg] = await Promise.all([
    ProModule.countDocuments({ trackKey: TRACK_KEY }),
    ProExercise.aggregate([{ $match: { trackKey: TRACK_KEY } }, { $group: { _id: null, xp: { $sum: "$xpReward" } } }]),
  ]);
  const totalXp = (exAgg[0]?.xp || 0) + totalTopics * 50;
  await ProTrack.updateOne(
    { key: TRACK_KEY },
    { $set: { totalModules, totalTopics, totalExercises, totalXp } }
  );

  console.log(`\n✓ Java seed complete.`);
  console.log(`  ${totalModules} modules / ${totalTopics} topics / ${totalExercises} exercises / ${totalProjects} projects / ${totalXp} XP`);

  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
