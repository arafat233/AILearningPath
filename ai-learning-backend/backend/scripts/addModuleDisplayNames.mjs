/**
 * One-off: inject `displayName: "..."` into each MODULE_META entry in
 * seedJavaPilot.js so the seeder has authoritative module display names
 * (the previous topic.json fallback left 13 modules showing "Java Module N").
 * Safe to re-run; skips entries already containing a displayName.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath  = path.resolve(__dirname, "..", "config", "seedJavaPilot.js");

const names = {
  m1_fundamentals: "Java Fundamentals",
  m2_methods: "Methods & Code Organization",
  m3_arrays_strings: "Arrays & Strings",
  m4_oop_fundamentals: "Object-Oriented Programming Fundamentals",
  m5_inheritance_polymorphism: "Inheritance & Polymorphism",
  m6_collections: "Collections Framework",
  m7_exception_handling: "Exception Handling",
  m8_lambdas_streams: "Lambda Expressions & Streams",
  m9_generics: "Generics",
  m10_concurrency: "Concurrency and Threads",
  m11_io_files: "I/O, Files, and Networking",
  m12_testing: "Unit Testing with JUnit 5",
  m13_spring_boot: "Spring Boot Fundamentals",
  m14_spring_advanced: "Advanced Spring Boot",
  m15_microservices: "Microservices Architecture",
  m16_kafka: "Apache Kafka & Event-Driven Architecture",
  m17_database: "Advanced Database Engineering",
  m18_redis: "Redis Caching & Rate Limiting",
  m19_resilience: "Microservice Resilience",
  m20_observability: "Observability",
  m21_deployment: "Production Deployment",
  m22_performance: "Performance & Optimization",
  m23_security: "Security",
  m24_system_design: "System Design Patterns",
  m25_advanced_testing: "Advanced Testing Strategies",
  m26_ai_integration: "AI-Powered Java Applications",
  m27_graphql: "GraphQL with Spring Boot",
  m28_grpc: "gRPC with Spring Boot",
  m29_dsa1_complexity: "DSA1: Big-O & Complexity Analysis",
  m30_dsa2_arrays: "DSA2: Array Patterns",
  m31_dsa3_strings: "DSA3: String Algorithms",
  m32_dsa4_linked_lists: "DSA4: Linked Lists",
  m33_dsa5_stacks_queues: "DSA5: Stacks & Queues",
  m34_dsa6_hash_tables: "DSA6: Hash Tables",
  m35_dsa7_trees_bst: "DSA7: Trees & BST",
  m36_dsa8_heaps: "DSA8: Heaps & Priority Queues",
  m37_dsa9_graphs: "DSA9: Graphs",
  m38_dsa10_sorting: "DSA10: Sorting Algorithms",
  m39_dsa11_binary_search: "DSA11: Binary Search",
  m40_dsa12_backtracking: "DSA12: Backtracking",
  m41_dsa13_dynamic_programming: "DSA13: Dynamic Programming",
  m42_interview_prep_1: "Interview Prep 1: Coding Foundations",
  m43_interview_prep_2: "Interview Prep 2: System Design",
  m44_interview_prep_3: "Interview Prep 3: Behavioral",
  m45_interview_prep_4: "Interview Prep 4: Mock Coding Rounds",
  m46_interview_prep_5: "Interview Prep 5: Company-Specific",
};

let src = fs.readFileSync(seedPath, "utf8");
let applied = 0, skipped = 0, missing = 0;

for (const [key, displayName] of Object.entries(names)) {
  // Match the entry header. Captures the moduleNumber line; inserts a
  // displayName line right after it (before slug).
  const re = new RegExp(
    `(  ${key}: \\{\\s*\\n    moduleId: "java_m\\d+", moduleNumber: \\d+,)( slug:)`
  );
  const m = src.match(re);
  if (!m) {
    // Already injected?
    if (src.includes(`  ${key}:`) && new RegExp(`${key}:[\\s\\S]*?displayName:`).test(src)) {
      skipped++;
    } else {
      missing++;
      console.log("  NO MATCH for", key);
    }
    continue;
  }
  src = src.replace(re, `$1 displayName: ${JSON.stringify(displayName)},$2`);
  applied++;
}

fs.writeFileSync(seedPath, src);
console.log(`Applied: ${applied} · Skipped (already had displayName): ${skipped} · Missing entries: ${missing}`);
