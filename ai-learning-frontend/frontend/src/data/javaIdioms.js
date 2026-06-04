/**
 * javaIdioms — a catalog of Java idioms & code-tricks for interview prep
 * (GAP #7, DSA-Animator parity). Pure static data — no backend.
 *
 * Each idiom: { id, title, category, tags[], code, explanation, whenToUse }.
 * Browsed/searched by pages/Idioms.jsx; validated by scripts/auditIdioms.mjs.
 * Add an entry here and it appears immediately (and the audit counts it).
 */
const IDIOMS = [
  // ── Fast I/O ──────────────────────────────────────────────────────────────
  { id: "io-bufferedreader", title: "Fast input with BufferedReader", category: "Fast I/O", tags: ["io", "scanner", "performance"],
    code: `BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
StringTokenizer st = new StringTokenizer(br.readLine());
int[] a = new int[n];
for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());`,
    explanation: "Scanner is convenient but slow (regex + autoboxing). BufferedReader + StringTokenizer reads large inputs an order of magnitude faster.",
    whenToUse: "Competitive problems or any input with 10^5+ tokens where Scanner TLEs." },
  { id: "io-stringbuilder-output", title: "Batch output with StringBuilder", category: "Fast I/O", tags: ["io", "stringbuilder", "performance"],
    code: `StringBuilder sb = new StringBuilder();
for (int x : answers) sb.append(x).append('\\n');
System.out.print(sb);`,
    explanation: "Each System.out.println flushes — thousands of calls are slow. Accumulate into one StringBuilder and print once.",
    whenToUse: "Printing many lines of output in a tight loop." },

  // ── Strings ────────────────────────────────────────────────────────────────
  { id: "str-builder-loop", title: "Never += String in a loop", category: "Strings", tags: ["string", "stringbuilder", "performance"],
    code: `// BAD: O(n^2) — new String each iteration
String s = "";
for (String w : words) s += w;
// GOOD: O(n)
StringBuilder sb = new StringBuilder();
for (String w : words) sb.append(w);
String s2 = sb.toString();`,
    explanation: "String is immutable, so += allocates and copies the whole string every time → O(n^2). StringBuilder appends into one growing buffer.",
    whenToUse: "Any time you build a string by repeated concatenation." },
  { id: "str-freq-array", title: "Char frequency with int[26]", category: "Strings", tags: ["string", "frequency", "anagram"],
    code: `int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;`,
    explanation: "For lowercase a–z, a fixed 26-int array is faster and lighter than a HashMap<Character,Integer>.",
    whenToUse: "Anagrams, frequency counts, sliding-window letter matching (lowercase only)." },
  { id: "str-reverse", title: "Reverse a string", category: "Strings", tags: ["string", "reverse"],
    code: `String r = new StringBuilder(s).reverse().toString();`,
    explanation: "StringBuilder.reverse() is the idiomatic one-liner. (Beware: it can break surrogate pairs for non-BMP characters.)",
    whenToUse: "Palindrome checks, reversing words/digits." },
  { id: "str-split-limit", title: "split with a limit keeps trailing empties", category: "Strings", tags: ["string", "split", "gotcha"],
    code: `"a,b,,".split(",")      // ["a","b"]      — trailing empties dropped
"a,b,,".split(",", -1)  // ["a","b","",""] — kept`,
    explanation: "split() silently drops trailing empty strings unless you pass a negative limit.",
    whenToUse: "Parsing CSV-like input where empty trailing fields matter." },

  // ── Arrays ──────────────────────────────────────────────────────────────────
  { id: "arr-fill", title: "Initialise an array to a value", category: "Arrays", tags: ["array", "init"],
    code: `int[] dp = new int[n];
Arrays.fill(dp, Integer.MAX_VALUE);
int[][] grid = new int[r][c];
for (int[] row : grid) Arrays.fill(row, -1);`,
    explanation: "Arrays.fill sets every element; for 2-D, fill each row (a single fill only touches the outer array of references).",
    whenToUse: "DP tables seeded with ∞ / -1, visited grids." },
  { id: "arr-sort-desc", title: "Sort descending (needs boxed type)", category: "Arrays", tags: ["array", "sort", "comparator"],
    code: `Integer[] a = {3, 1, 2};
Arrays.sort(a, Collections.reverseOrder());
// int[] can't take a comparator — box it, or sort asc then reverse.`,
    explanation: "Comparators only work on objects. Primitive int[] has no descending overload — use Integer[] or sort then reverse.",
    whenToUse: "Top-K, greedy by largest-first." },
  { id: "arr-copy", title: "Copy / slice an array", category: "Arrays", tags: ["array", "copy"],
    code: `int[] full = Arrays.copyOf(a, a.length);
int[] slice = Arrays.copyOfRange(a, l, r); // [l, r)`,
    explanation: "copyOf duplicates; copyOfRange takes a half-open slice. Both avoid manual loops.",
    whenToUse: "Divide-and-conquer halves, snapshotting before mutation." },
  { id: "arr-aslist-gotcha", title: "Arrays.asList on int[] gotcha", category: "Arrays", tags: ["array", "list", "gotcha"],
    code: `Arrays.asList(new int[]{1,2,3});     // List<int[]> of size 1 (!)
Arrays.asList(1, 2, 3);               // List<Integer> of size 3
Arrays.stream(new int[]{1,2,3}).boxed().collect(Collectors.toList());`,
    explanation: "asList on a primitive array treats the whole array as ONE element. Use boxed Integer[] or a stream.",
    whenToUse: "Converting an int[] to a List." },

  // ── Collections ──────────────────────────────────────────────────────────────
  { id: "col-getordefault", title: "Counting with getOrDefault / merge", category: "Collections", tags: ["hashmap", "frequency"],
    code: `map.put(k, map.getOrDefault(k, 0) + 1);
// or, more concise:
map.merge(k, 1, Integer::sum);`,
    explanation: "Both increment a count without a null check. merge is the cleanest for accumulation.",
    whenToUse: "Frequency maps, grouping counts." },
  { id: "col-computeifabsent", title: "Build nested structures with computeIfAbsent", category: "Collections", tags: ["hashmap", "grouping"],
    code: `Map<String, List<Integer>> g = new HashMap<>();
g.computeIfAbsent(key, x -> new ArrayList<>()).add(value);`,
    explanation: "Creates the inner list on first access, then adds — no manual containsKey/put dance.",
    whenToUse: "Group-anagrams, adjacency lists, bucketing." },
  { id: "col-deque-stack", title: "Use ArrayDeque, not Stack", category: "Collections", tags: ["stack", "queue", "deque"],
    code: `Deque<Integer> stack = new ArrayDeque<>();
stack.push(1); stack.pop(); stack.peek();
Deque<Integer> queue = new ArrayDeque<>();
queue.offer(1); queue.poll(); queue.peek();`,
    explanation: "Legacy Stack is synchronized and slow; Vector-based. ArrayDeque is the modern stack AND queue, all O(1).",
    whenToUse: "Any stack, queue, or deque (monotonic stack, BFS, sliding-window max)." },
  { id: "col-pq", title: "PriorityQueue as min/max heap", category: "Collections", tags: ["heap", "priorityqueue"],
    code: `PriorityQueue<Integer> min = new PriorityQueue<>();              // min-heap
PriorityQueue<Integer> max = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<int[]> bySecond = new PriorityQueue<>((a, b) -> a[1] - b[1]);`,
    explanation: "Default is a min-heap. Reverse the comparator for a max-heap; pass a custom comparator for objects.",
    whenToUse: "Top-K, Dijkstra, merge-K-lists, scheduling." },
  { id: "col-treemap", title: "TreeMap for floor/ceiling & ranges", category: "Collections", tags: ["treemap", "sorted"],
    code: `TreeMap<Integer,Integer> tm = new TreeMap<>();
tm.floorKey(x);    // largest key <= x
tm.ceilingKey(x);  // smallest key >= x
tm.subMap(lo, hi); // range view`,
    explanation: "A sorted map with O(log n) floor/ceiling/range queries that a HashMap can't do.",
    whenToUse: "Calendar booking, nearest-value lookups, sweep-line." },

  // ── Comparators & Sorting ──────────────────────────────────────────────────
  { id: "cmp-chaining", title: "Multi-key comparator chaining", category: "Comparators", tags: ["comparator", "sort"],
    code: `list.sort(Comparator.comparingInt((int[] p) -> p[0])
                   .thenComparing(p -> p[1], Comparator.reverseOrder()));`,
    explanation: "comparingInt picks the primary key; thenComparing adds tie-breakers (here the second key descending).",
    whenToUse: "Sort intervals by start then end, leaderboard by score then name." },
  { id: "cmp-overflow", title: "Comparator subtraction overflow", category: "Comparators", tags: ["comparator", "overflow", "gotcha"],
    code: `// BAD: (a - b) overflows for large/negative ints
(a, b) -> a - b
// GOOD:
(a, b) -> Integer.compare(a, b)`,
    explanation: "a - b can overflow int and return the wrong sign. Integer.compare is always correct.",
    whenToUse: "Any custom comparator over ints that may be large or negative." },
  { id: "cmp-largest-number", title: "Custom string-concat comparator", category: "Comparators", tags: ["comparator", "string"],
    code: `// 'Largest Number' (#179): order so concatenation is biggest
arr.sort((a, b) -> (b + a).compareTo(a + b));`,
    explanation: "Compare by which concatenation order yields the larger string, not by numeric value.",
    whenToUse: "Largest/Smallest number from array, custom lexical orderings." },

  // ── Bit Tricks ─────────────────────────────────────────────────────────────
  { id: "bit-lowest-set", title: "Isolate / clear the lowest set bit", category: "Bit Tricks", tags: ["bit", "kernighan"],
    code: `int lowest = x & (-x);   // isolate lowest set bit
x = x & (x - 1);          // clear lowest set bit (Kernighan)`,
    explanation: "x & -x leaves only the lowest 1-bit; x & (x-1) removes it — count set bits in O(popcount).",
    whenToUse: "Counting bits, subset enumeration, Fenwick trees." },
  { id: "bit-power-of-two", title: "Power-of-two check", category: "Bit Tricks", tags: ["bit", "math"],
    code: `boolean isPow2 = n > 0 && (n & (n - 1)) == 0;`,
    explanation: "A power of two has exactly one set bit, so n & (n-1) clears it to 0. Guard n > 0.",
    whenToUse: "Capacity checks, fast modulo by powers of two." },
  { id: "bit-xor-swap-missing", title: "XOR to find the unique / missing number", category: "Bit Tricks", tags: ["bit", "xor"],
    code: `int x = 0;
for (int v : nums) x ^= v;   // pairs cancel → lone value survives
// Missing in [0..n]:
for (int i = 0; i <= n; i++) x ^= i;`,
    explanation: "a ^ a == 0 and a ^ 0 == a, so XOR-ing everything cancels pairs, leaving the odd one out — O(1) space.",
    whenToUse: "Single Number, Missing Number, find-the-duplicate variants." },
  { id: "bit-builtins", title: "Integer bit built-ins", category: "Bit Tricks", tags: ["bit", "builtin"],
    code: `Integer.bitCount(x);          // # set bits
Integer.highestOneBit(x);     // highest power-of-two <= x
Integer.numberOfTrailingZeros(x);
Long.bitCount(x);`,
    explanation: "The JDK has fast intrinsics for common bit operations — don't hand-roll them.",
    whenToUse: "Hamming weight, masks, DP over subsets." },

  // ── Math ────────────────────────────────────────────────────────────────────
  { id: "math-ceil-div", title: "Integer ceiling division", category: "Math", tags: ["math", "division"],
    code: `int up = (a + b - 1) / b;   // ceil(a/b) for positive a, b
// or:
int up2 = Math.floorDiv(a + b - 1, b);`,
    explanation: "Integer / truncates toward zero. Adding (b-1) before dividing gives the ceiling for non-negatives.",
    whenToUse: "Pagination, bucketing, 'minimum groups of size b'." },
  { id: "math-overflow-mid", title: "Overflow-safe midpoint", category: "Math", tags: ["math", "binary-search", "overflow"],
    code: `int mid = lo + (hi - lo) / 2;   // not (lo + hi) / 2`,
    explanation: "(lo + hi) can overflow int when both are large. lo + (hi - lo)/2 never does.",
    whenToUse: "Every binary search." },
  { id: "math-gcd", title: "GCD via Euclid", category: "Math", tags: ["math", "gcd"],
    code: `int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }
long lcm = (long) a / gcd(a, b) * b;   // divide first to avoid overflow`,
    explanation: "Euclid's algorithm is O(log min(a,b)). For LCM, divide before multiplying to stay in range.",
    whenToUse: "Fractions, cycle lengths, ratio problems." },
  { id: "math-mod", title: "Non-negative modulo", category: "Math", tags: ["math", "modulo", "gotcha"],
    code: `int m = ((x % n) + n) % n;   // always in [0, n)`,
    explanation: "Java's % keeps the sign of the dividend, so -1 % 3 == -1. The double-mod normalises to a non-negative result.",
    whenToUse: "Circular arrays, hashing, wrap-around indices." },

  // ── Streams ─────────────────────────────────────────────────────────────────
  { id: "stream-toarray", title: "Stream to int[] / sum / max", category: "Streams", tags: ["stream", "array"],
    code: `int[] a = list.stream().mapToInt(Integer::intValue).toArray();
int sum = Arrays.stream(nums).sum();
int max = Arrays.stream(nums).max().getAsInt();`,
    explanation: "mapToInt avoids boxing; IntStream has sum/max/average built in.",
    whenToUse: "Quick aggregates without explicit loops (readability over hot-path speed)." },
  { id: "stream-group", title: "Group + count with Collectors", category: "Streams", tags: ["stream", "grouping"],
    code: `Map<Integer, Long> byLen = words.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));`,
    explanation: "groupingBy + a downstream collector expresses 'bucket then aggregate' declaratively.",
    whenToUse: "Frequency-by-key summaries when clarity matters." },

  // ── Two-Pointer / Window snippets ───────────────────────────────────────────
  { id: "tp-template", title: "Variable sliding window template", category: "Patterns", tags: ["sliding-window", "two-pointers"],
    code: `int l = 0;
for (int r = 0; r < n; r++) {
    add(a[r]);
    while (invalid()) { remove(a[l]); l++; }
    best = Math.max(best, r - l + 1);
}`,
    explanation: "Expand the right edge, shrink the left while the window is invalid, record the answer each step.",
    whenToUse: "Longest substring/array satisfying a constraint." },
  { id: "tp-prefix", title: "Prefix sum + HashMap for subarray sums", category: "Patterns", tags: ["prefix-sum", "hashmap"],
    code: `Map<Integer,Integer> seen = new HashMap<>();
seen.put(0, 1);              // empty prefix
int sum = 0, count = 0;
for (int v : nums) {
    sum += v;
    count += seen.getOrDefault(sum - k, 0);
    seen.merge(sum, 1, Integer::sum);
}`,
    explanation: "Seeding {0:1} lets subarrays starting at index 0 count. Works with negatives where a pure window fails.",
    whenToUse: "Subarray sum equals K, count of nice subarrays." },

  // ── Common Gotchas ──────────────────────────────────────────────────────────
  { id: "gotcha-integer-cache", title: "== on Integer objects", category: "Gotchas", tags: ["autoboxing", "equals"],
    code: `Integer a = 1000, b = 1000;
a == b;        // false (different objects)
a.equals(b);   // true
// -128..127 are cached, so small values may == by luck — never rely on it.`,
    explanation: "== compares references for boxed Integers. Always use .equals (or unbox to int) for value equality.",
    whenToUse: "Comparing values pulled from collections/maps as Integer." },
  { id: "gotcha-list-remove", title: "list.remove(int) vs remove(Object)", category: "Gotchas", tags: ["list", "overload"],
    code: `List<Integer> l = new ArrayList<>(List.of(10, 20, 30));
l.remove(1);                  // removes INDEX 1 → 20
l.remove(Integer.valueOf(20)); // removes the VALUE 20`,
    explanation: "remove(int) is by index; remove(Object) is by value. With Integer lists this overload is a classic trap.",
    whenToUse: "Removing a value (not a position) from an Integer list." },
  { id: "gotcha-modify-while-iterating", title: "ConcurrentModificationException", category: "Gotchas", tags: ["iterator", "list"],
    code: `// BAD: throws CME
for (Integer x : list) if (x % 2 == 0) list.remove(x);
// GOOD: iterator.remove() or removeIf
list.removeIf(x -> x % 2 == 0);`,
    explanation: "Structurally modifying a collection during a for-each invalidates the iterator. Use removeIf or an explicit Iterator.",
    whenToUse: "Filtering a collection in place." },
  { id: "gotcha-char-int", title: "char arithmetic returns int", category: "Gotchas", tags: ["char", "type"],
    code: `char c = 'a';
int idx = c - 'a';       // 0  (int)
char next = (char) (c + 1); // 'b' — must cast back`,
    explanation: "Arithmetic on char promotes to int; cast back to char to store the result.",
    whenToUse: "Indexing freq arrays, shifting letters (Caesar cipher)." },
  { id: "gotcha-array-default", title: "Default values & 2-D jagged arrays", category: "Gotchas", tags: ["array", "init"],
    code: `int[] a = new int[3];        // {0, 0, 0}
boolean[] b = new boolean[3]; // {false, false, false}
Integer[] o = new Integer[3]; // {null, null, null} — NPE if unboxed!`,
    explanation: "Primitive arrays default to 0/false; object arrays default to null (unboxing a null throws NPE).",
    whenToUse: "Relying on zero-initialised DP tables vs object arrays." },
];

export default IDIOMS;
