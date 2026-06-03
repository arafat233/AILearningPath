# Java Visual-Aid Audit (one-by-one)

Scope: 172 pro_java visual_aids (M1–M33 + M30.5). M34–M51 have **no** visual_aid (content gap, 90 topics).

Per topic: what the brief SAYS vs what it currently PRODUCES, and the fix verdict. Check off as fixed.

Legend — flag: ❌ MISMATCH (needs real diagram) · 🔎 REVIEW(svg) · 🔶 REVIEW · ✅ ok


## M1

- [ ] ✅ **java_m1_t1** — Hello World & Setup
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Show the Java execution pipeline: HelloWorld.java → javac → HelloWorld.class → java → JVM → Output. Arrows indicate flow. Each stage has icons (source file, compiler, bytecode file, VM, terminal output).
- [ ] ✅ **java_m1_t2** — Variables & Data Types
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a memory diagram with 8 boxes representing each primitive type. Each box shows: type name, size in bits, range, and one example value. Group by category: integers (byte, short, int, long), decimals (float, double), other (char, boolean). To the right, show one larger box for String labeled 'reference type — actually points to memory elsewhere'.
- [ ] ✅ **java_m1_t3** — Operators & Expressions
  - req: `FLOW/PIPELINE` · now: `svg-diagram`
  - brief: Show a precedence pyramid: parentheses at top, then unary operators, then arithmetic (* / % above + -), then comparison, then equality, then logical AND, then OR, then assignment at bottom. Arrows showing 'evaluated first' at top. Side annotation: 'Use parens to make intent explicit'.
- [ ] 🔎 **java_m1_t4** — Control Flow: if/else & switch
  - req: `FLOWCHART` · now: `svg-diagram`
  - brief: Show a flowchart with diamond decision boxes. Left side: a simple if/else (one diamond, two paths). Middle: an if/else if chain (cascade of diamonds, with arrows showing only first-true gets executed). Right side: a switch (single value entering, multiple parallel cases, default at bottom). Each example labeled with when to use it.
- [ ] 🔎 **java_m1_t5** — Loops: for, while, do-while
  - req: `FLOWCHART` · now: `svg-diagram`
  - brief: Show side-by-side flowcharts of for, while, and do-while loops. For: shows init → condition diamond → body → update → back to condition. While: shows condition diamond → body → back to condition. Do-while: shows body → condition diamond → back to body. Annotation: 'do-while runs at least once'. Below: a single 'infinite loop trap' diagram showing what happens when update never changes condition.
- [ ] 🔎 **java_m1_t6** — Reading User Input with Scanner
  - req: `MEMORY` · now: `svg-diagram`
  - brief: Show a keyboard at top. Arrow flowing down into a box labeled 'System.in (stdin stream)'. Arrow flowing right into 'Scanner sc'. From Scanner, branches to nextInt() (returns 42), nextLine() (returns 'Aisha Khan'), nextDouble() (returns 19.99). Below: a buffer diagram showing the newline bug — user types '28\n', nextInt() takes '28', leaves '\n' in buffer, next nextLine() instantly returns '' (empty). Bottom: the fix — extra throwaway nextLine() consumes the '\n'.

## M2

- [ ] 🔶 **java_m2_t1** — Introduction to Methods
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a flow diagram with main() on the left containing 3 boxes representing method calls. Arrows lead RIGHT to the actual method definitions (boxes labeled showHeader, showContent, showFooter). showContent has an arrow back to a helper method showDivider, which is ALSO called from showFooter (two arrows pointing to it). Annotation: 'Methods are reusable — called from multiple places.' Below: a comparison diagram showing 'BEFORE: 80-line main() — all logic crammed in' vs 'AFTER: 8-line main() calling 5 well-named methods — same program, way clearer.'
- [ ] 🔶 **java_m2_t2** — Parameters & Return Values
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a method as a box with arrows flowing IN (parameters labeled with type+name) and arrows flowing OUT (return value, labeled with type). Below it, show the same method being called from main with arguments going in and the returned value being assigned to a variable. Side comparison: 'OLD WAY: class-level static variables (data leaks everywhere)' vs 'NEW WAY: parameters in, return out (data flows cleanly)'. Use arrows to emphasize directional data flow.
- [ ] 🔶 **java_m2_t3** — Method Overloading
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show three method boxes labeled 'add(int, int)', 'add(double, double)', 'add(int, int, int)' — all in the same class, all named 'add'. Three call examples below: add(5,3) with arrow pointing to int,int version; add(2.5, 1.5) pointing to double,double; add(1,2,3) pointing to triple-int version. Below: a 'NOT VALID' section showing two methods that ONLY differ in return type — with a red X showing the compiler rejects this. Annotation: 'Java picks the overload based on argument TYPES and COUNT, never return type.'
- [ ] ✅ **java_m2_t4** — Variable Scope & Lifetime
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a nested boxes diagram: outermost box is 'Class scope (static variables)' containing inner box 'Method scope (parameters + locals)' which contains 'Block scope (loop/if variables)'. Each level labeled with what's visible at that level. Arrows show variables 'falling out of scope' when their block closes. Side note: 'Inner scopes can see outer; outer cannot see inner.' Below: a 'lifetime timeline' showing when each variable type is created and destroyed during program execution.
- [x] ✅(fixed) **java_m2_t5** — Recursion Basics
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a call stack diagram for factorial(4). Visualize 5 stacked frames: factorial(4), factorial(3), factorial(2), factorial(1), factorial(0). Each labeled with its parameter value. Show factorial(0) at top (currently executing). Annotate: 'When factorial(0) returns 1, this frame is removed. factorial(1) gets the result and completes its multiplication...' Continue showing frames being popped as values bubble up. Final result: 24. Right side shows the SAME calculation done iteratively with a single loop — no stack growth.

## M3

- [x] ✅(fixed) **java_m3_t1** — Introduction to Arrays
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show an array represented as a row of 5 boxes labeled `scores[0]` through `scores[4]` containing values 85, 90, 78, 92, 88. Below each box: the index (0, 1, 2, 3, 4). Annotation: 'Zero-indexed: first element is index 0, last is length - 1.' Side panel: shows what happens if you try `scores[5]` — red X with 'ArrayIndexOutOfBoundsException at runtime.' Another panel shows the two iteration styles side-by-side: classic for loop with `i` and `scores[i]` vs for-each loop with `score : scores`.
- [x] ✅(fixed) **java_m3_t2** — Array Operations & Algorithms
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show two parallel diagrams. LEFT: Linear search trying to find 17 in [5, 12, 3, 8, 17, 22] — checks each element in order with arrows: 5 (no), 12 (no), 3 (no), 8 (no), 17 (yes!). RIGHT: Binary search in sorted array [3, 5, 8, 12, 17, 22] — middle element 12 (low), check right half [17, 22], middle is 17 (match!). Annotation: 'Linear: O(n), checks each. Binary: O(log n), eliminates half each step. BUT binary requires sorted input.' Below: two-pointer reversal animation showing left/right pointers moving toward center, swapping at each step.
- [x] ✅(fixed) **java_m3_t3** — Multi-Dimensional Arrays
  - req: `TABLE/GRID` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a 3×4 grid with cells labeled grid[0][0] through grid[2][3], with example values inside (1-12). Row labels on the left (Row 0, Row 1, Row 2). Column labels on top (Col 0, Col 1, Col 2, Col 3). Annotation: 'grid[row][col] — row first, then column.' Below: two parallel iteration diagrams. LEFT: 'Row-major iteration: 1, 2, 3, 4, 5, 6, 7...' arrow path goes left-to-right, top-to-bottom. RIGHT: 'Column-major iteration: 1, 5, 9, 2, 6, 10...' arrow path goes top-to-bottom, left-to-right.
- [ ] 🔶 **java_m3_t4** — Introduction to Strings
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show three boxes representing Strings. Top: 'String a = "hello";' and 'String b = "hello";' both pointing to a single string "hello" in a 'String Pool' area. Below: 'String c = new String("hello");' pointing to a SEPARATE "hello" object outside the pool. Arrows show: a == b is true (same object), a == c is false (different objects), but a.equals(c) is true (same content). Side panel: visualize immutability — show 's = "hello"' becoming 's = s.toUpperCase()' as creating a NEW "HELLO" object, with the original "hello" still existing (greyed out, awaiting garbage collection).
- [ ] 🔎 **java_m3_t5** — StringBuilder & String Manipulation
  - req: `CURVE` · now: `svg-diagram`
  - brief: Side-by-side comparison. LEFT: 'String concatenation in loop' — shows 5 boxes labeled 'hello', 'hello ', 'hello w', 'hello wo', 'hello wor' — each is a NEW string object, previous ones discarded. Annotation: 'N strings created. O(N²) work for N chars.' RIGHT: 'StringBuilder' — shows ONE box growing internally as 'hello → hello [w] → hello w[o] → hello wo[r]' — same buffer expanding. Annotation: 'One object. O(N) work.' Below: a chart showing time (Y) vs N (X) — String shows quadratic curve, StringBuilder linear.

## M4

- [ ] 🔎 **java_m4_t1** — Classes & Objects
  - req: `MEMORY` · now: `svg-diagram`
  - brief: Show a 'Class blueprint' on the LEFT — Dog class with fields (name: String, age: int) and methods (bark()). Right side shows three 'instantiated' Dog objects: Rex (age 3), Buddy (age 5), Luna (age 2) — each as a separate box with its own field values. Arrows from class to each object labeled 'new Dog()'. Below: comparison of parallel arrays vs object array. LEFT: three arrays for names/ages/breeds with index correlation. RIGHT: single array of Dog objects, each self-contained. Annotation: 'Same data, dramatically different organization.'
- [ ] ✅ **java_m4_t2** — Constructors
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a timeline of `new Product(101, "Mouse", 45, 599.99)` execution. Step 1: 'new keyword' — empty Product box appears (id=0, name=null, stock=0, price=0). Step 2: 'Constructor runs' — body executes, fields populate (id=101, name=Mouse, stock=45, price=599.99). Step 3: 'Reference returned' — variable gets the reference. Side panel: invalid construction. Show `new Product(-1, ...)` — constructor validates, throws IllegalArgumentException, partially-built object discarded, variable never assigned. Annotation: 'Constructors are the gatekeeper. Invalid data never enters the system.'
- [ ] 🔶 **java_m4_t3** — Encapsulation
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a BankAccount class as a 'safe' box. Inside: 'PRIVATE: holderName, balance' (locked vault). Outside: 'PUBLIC: getHolderName(), setBalance(amount), getBalance()' as labeled doors. Arrows from outside: external code can only enter through the public doors. Direct attempts to access private fields hit a wall labeled 'COMPILATION ERROR'. Side panel: comparison of public fields (arrows going in and out freely, including bad values like '-50000') vs encapsulated (arrows must pass through setter which has a validation gate that filters bad values).
- [ ] 🔎 **java_m4_t4** — Object Methods (toString, equals, hashCode)
  - req: `TREE` · now: `svg-diagram`
  - brief: Show the Java class hierarchy: Object at the top, with arrows down to Product, String, Integer, MyClass, etc. — every class. Annotation: 'Every class inherits toString(), equals(), hashCode() from Object.' Side-by-side: LEFT shows 'Default Object methods' with println printing 'Product@1b6d3586', equals returning false even for identical objects. RIGHT shows 'Overridden methods' with println printing 'Product[id=101, name=Mouse]', equals returning true for content-equal objects. Bottom panel: the equals/hashCode contract — two equal objects must have equal hashCodes (arrows showing this requirement). Diagram of HashSet with two 'equal' but different-hashCode objects ending up in different buckets — illustrating the bug when contract is violated.
- [x] ✅(fixed) **java_m4_t5** — Static Members & Class-Level Data
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a memory layout with class-level data on the LEFT and instance data on the RIGHT. Class-level (Product class): 'count = 3 (shared, static)'. Three Product objects: p1[id=101, name=Mouse], p2[id=102, name=Keyboard], p3[id=103, name=Monitor] — each with their own instance fields. Arrows from all three objects pointing to the same 'count' field — one counter, three objects sharing it. Below: constants panel showing 'static final int MAX_PRICE = 99999' — one value, never changes. Side panel shows: 'Static method called on class name: Product.getCount()' vs 'Instance method called on object: p1.getPrice()'.
- [x] ✅(fixed) **java_m4_t6** — Composition & Complete OOP Design
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show a UML-style class diagram. Three classes: Customer, Order, LineItem, Product. Arrows: Order 'has-a' Customer (one customer per order). Order 'has-many' LineItems (array). LineItem 'has-a' Product. Labels on relationships: '1' for single, '1..*' for array. Each class box shows key fields and methods. Below: Timeline showing Module 4 concept stack — 4.1 Class, 4.2 Constructor, 4.3 Encapsulation, 4.4 Object Methods, 4.5 Static, 4.6 Composition — all stacking to show how each builds on previous.

## M5

- [ ] 🔎 **java_m5_t1** — Inheritance Basics
  - req: `TREE` · now: `svg-diagram`
  - brief: Show a class hierarchy tree. Top: Object (Java root). Below it: Animal. Below Animal: three branches — Dog, Cat, Bird. Each has a box showing fields (Dog: breed; Cat: isIndoor; Bird: wingspan) plus the inherited Animal fields shown in lighter color (name, age). Arrows pointing UP labeled 'extends'. Right side: memory diagram showing a Dog object in memory containing BOTH inherited Animal fields and Dog-specific fields, all in one object. Side panel: the access modifier table showing which modifiers allow subclass access — private (no), default (same package), protected (yes, any package), public (yes).
- [ ] 🔶 **java_m5_t2** — Polymorphism
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Show two parallel timelines. LEFT (Compile time): compiler sees 'Animal a' → allows makeSound(), rejects fetch(). RIGHT (Runtime): JVM sees actual Dog object → runs Dog.makeSound(). Connected by an arrow labeled 'Runtime dispatch bridges the gap.' Below: a method `processPayment(PaymentMethod pm)` box in the center. Arrows coming IN from: CreditCard, UPI, NetBanking — all labeled 'at runtime, Java calls the right pay()'. Arrow from processPayment box labeled 'one method, unlimited implementations.' Bottom: Liskov panel — 'Dog works here ✓' vs 'Square breaks Rectangle ✗' — visual contrast.
- [x] ✅(fixed) **java_m5_t3** — Abstract Classes
  - req: `TREE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show three boxes arranged vertically: 'abstract Shape' at top (with italicized 'area()' showing it's abstract, and 'printInfo()' in normal text showing it's concrete). Below: 'Circle' and 'Rectangle' both with concrete 'area()' implementations. Annotation: 'Cannot: new Shape()'. 'Can: new Circle()'. Arrow from Shape.printInfo() calling area() → pointing down to show it calls the subclass version. Right side: Template Method pattern diagram — abstract class with process() calling readData(), validateData(), transformData() (all abstract, italicized). Two concrete classes below each implementing the steps differently. Title: 'Template Method: parent defines when, child defines how.'
- [x] ✅(fixed) **java_m5_t4** — Interfaces
  - req: `STATE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show the abstract class vs interface comparison table visually. Left column: abstract class with state (fields shown), constructors, concrete+abstract methods, 'extends one'. Right column: interface with no fields (crossed out), no constructors (crossed out), abstract methods by default, 'implements many'. Middle: arrow labeled 'When to use'. Below: a class diagram showing Employee (abstract class hierarchy) on the left, and interfaces (Comparable, Serializable, Loggable) on the right — arrows showing Employee EXTENDS AbstractEmployee and IMPLEMENTS all three interfaces. Annotation: 'Mix class hierarchy with multiple interface capabilities.' Bottom: Comparable.compareTo() contract diagram — negative (this first), zero (equal), positive (this second).
- [ ] 🔎 **java_m5_t5** — Comparator & Polymorphism in Practice
  - req: `FLOWCHART` · now: `svg-diagram`
  - brief: Show side-by-side: Comparable (built INTO the class — arrow from class to sort box labeled 'fixed natural order') vs Comparator (EXTERNAL object — three separate boxes for ByName, ByPrice, ByDiscount comparators, each with arrow to the SAME array being sorted). Below: decision flowchart — 'Is there ONE obvious natural order?' → YES → Comparable. 'Need multiple/flexible orders?' → YES → Comparator. 'Need both?' → Comparable for natural + Comparators for alternatives. Bottom: Module 5 OOP tool selector — quick reference table: inheritance for is-a, abstract for forced contract + partial impl, interface for capability + multiple roles, polymorphism for one-call many behaviors, Comparator for flexible sorting.

## M6

- [x] ✅(fixed) **java_m6_t1** — ArrayList
  - req: `TREE` · now: `auto-PANELS`
  - brief: Show side-by-side: LEFT — manual array approach with array of 5 slots, count=3 pointer, null slots shown, arrows showing pain points (null slots, manual count, fixed size). RIGHT — ArrayList: dynamic, no null slots, size() method, clean. CENTER: ArrayList internal model showing 'backing array' that doubles when full (resizing diagram). Below: autoboxing diagram showing 'scores.add(95)' → Java auto-wraps to Integer(95). Bottom: class hierarchy diagram: Iterable → Collection → List → ArrayList (and also LinkedList, Vector). Shows 'List<String> names' as interface reference type pointing to ArrayList implementation.
- [x] ✅(fixed) **java_m6_t2** — HashMap
  - req: `MEMORY` · now: `auto-PANELS`
  - brief: Show three diagrams: (1) HashMap internal structure — array of 'buckets', each bucket is a linked list. Key's hashCode() maps to a bucket index. Arrows showing put('Mouse', product) → hash → bucket. (2) Side-by-side performance: ArrayList.contains() — O(n) linear scan animation. HashMap.get() — O(1) hash jump. For n=1000: 500 avg comparisons vs 1. (3) Three common patterns: Frequency counting (word→count table being built word by word), Grouping (products flowing into category buckets), Lookup table (barcode → product one-step). All three with code snippets alongside.
- [x] ✅(fixed) **java_m6_t3** — HashSet
  - req: `VENN` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show the Collections Triangle completed: List (ordered sequence, allows duplicates), Map (key→value pairs), Set (unique elements, O(1) lookup) — three boxes with arrows labeled 'ordered', 'keyed', 'unique'. Center annotation: 'Together they cover 90% of data structure needs.' Right side: HashSet internal structure (backed by HashMap, values are dummy). Performance table: List.contains O(n) shown as long bar; Set.contains O(1) shown as tiny bar. Bottom: three set operation diagrams with Venn circles: Union (all), Intersection (overlap), Difference (A minus B).
- [x] ✅(fixed) **java_m6_t4** — Iterating Collections & the Collections Utility Class
  - req: `STATE` · now: `auto-PANELS`
  - brief: Show three diagrams: (1) Iterator state machine — hasNext? → next() → [can remove()] → repeat. Safe removal shown with arrow: next() returns element, then remove() removes THAT element. Contrast with for-each: no safe removal. (2) Collections utility class as a toolbox — grid of utility methods organized by category: Sort (sort, reverse, shuffle), Extremes (min, max), Counts (frequency, disjoint), Protection (unmodifiable*), Creation (nCopies, fill). (3) Stream pipeline preview: source (list) → filter → map → collect, with each step labeled. Caption: 'Streams = functional loops. Full coverage in Module 9.'
- [ ] 🔎 **java_m6_t5** — Choosing the Right Collection
  - req: `TREE` · now: `svg-diagram`
  - brief: Large decision tree diagram. Root node: 'What collection do I need?' First branch: 'Need to look up by key?' YES → Map family (HashMap/TreeMap/LinkedHashMap with comparison table). NO → 'Need uniqueness?' YES → Set family (HashSet/TreeSet/LinkedHashSet). NO → List family (ArrayList/LinkedList with comparison). Below the decision tree: Performance big-O table for all six collection types. Bottom: 5 antipatterns shown as 'red code' vs 'green code' pairs.
- [ ] ✅ **java_m6_t6** — Module 6 Capstone — Collections in the Wild
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Show the JobBoard class as a central box with six collection fields radiating out, each labeled with its purpose. Arrows show which user action hits which collection: 'Browse all' → List, 'Search by ID' → HashMap, 'Filter by category' → Map of Lists, 'Date range' → TreeMap, 'View applicants' → Map<String, List>, 'Check if open' → HashSet. Below: the Module 6 complete summary table — all tools, operations, and when-to-use.

## M7

- [x] ✅(fixed) **java_m7_t1** — try / catch / finally
  - req: `TREE` · now: `auto-PANELS`
  - brief: Show three flow diagrams: (1) try-catch happy path — try block runs fully, catch is skipped, execution continues. (2) try-catch exception path — exception thrown mid-try, arrow jumps to catch, remaining try lines grayed out, execution continues after catch. (3) finally — three scenarios side-by-side: no exception (try→finally→continue), caught exception (try-partial→catch→finally→continue), uncaught exception (try-partial→finally→program crash). Below: Java exception hierarchy teaser — Throwable → Error | Exception, with common examples under each. Stack trace reading guide: arrow pointing upward through method calls labeled 'read bottom-up to find YOUR code'.
- [ ] 🔎 **java_m7_t2** — Exception Types — Checked vs Unchecked
  - req: `FLOWCHART` · now: `svg-diagram`
  - brief: Large tree diagram of the Throwable hierarchy. Root: Throwable. Two main branches: Error (red — don't catch) and Exception (green — two sub-branches). Exception left branch: RuntimeException with all unchecked subclasses listed (NullPointerException, ArrayIndexOutOfBoundsException, etc.) — labeled UNCHECKED. Exception right branch: IOException, SQLException, etc. — labeled CHECKED. Decision flowchart below: 'Does it extend RuntimeException?' YES → Unchecked (compiler optional). NO + extends Exception → Checked (compiler mandatory). Right column: 'throws vs catch decision' flowchart — 'Can I recover?' YES → catch. 'Does caller have more context?' YES → throws.
- [x] ✅(fixed) **java_m7_t3** — Custom Exceptions
  - req: `FLOWCHART` · now: `auto-PANELS`
  - brief: Show three things: (1) Custom exception class anatomy — class declaration extending RuntimeException or Exception, field declarations (final), two constructors (message, message+cause), getters. Each part labeled. (2) Exception hierarchy design example: PaymentException at top (checked), CardDeclinedException and PaymentTimeoutException below (also checked), with catch block showing catch-specific first, catch-base last. (3) 'Create custom vs use built-in' decision flowchart: 'Do callers need to catch it by name?' YES → custom. 'Does it carry domain data?' YES → custom. 'Is it a programmer error?' YES → built-in IllegalArgumentException. 'Just need a message?' YES → built-in RuntimeException.
- [x] ✅(fixed) **java_m7_t4** — Defensive Programming
  - req: `MEMORY` · now: `auto-PANELS`
  - brief: Three diagrams: (1) 'Fail fast vs fail slow' — two call stacks side by side. Left (fail slow): arrow going through 10 methods before NPE. Right (fail fast): NPE at entry point with clear message. (2) 'Defensive copy' diagram: caller has list → passes reference to constructor → mutable object (WRONG: both point to same list). vs caller has list → passes to constructor → new ArrayList<>(items) creates new box → both lists independent (CORRECT). (3) 'Guard clause' refactoring: nested if/else pyramid (left) → flat guard clauses at top, main logic flat below (right). The validation boundary diagram: external world enters through a gate labeled 'VALIDATE HERE' into internal logic.
- [ ] 🔶 **java_m7_t5** — Try-With-Resources
  - req: `TIMELINE` · now: `auto-FLOW`
  - brief: Show three flow diagrams: (1) Old finally pattern — verbose, null check needed, nested try in finally, exception overwrite risk — all highlighted as pain points. (2) Try-with-resources happy path — try block runs, exit, close() called automatically, execution continues. (3) Try-with-resources exception path — exception in try body, close() called first (may suppress its exception), then catch block runs, then finally. Timeline showing order: try-body → exception → close() → catch → finally. Right side: AutoCloseable implementation checklist: closed flag, idempotent close(), IllegalStateException if used after close. Bottom: multiple resources closing in REVERSE order (stack diagram).

## M8

- [ ] 🔶 **java_m8_t1** — Lambda Expressions
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Show three things: (1) Lambda syntax breakdown — annotated arrow diagram: (params) -> body. Parameters on left, arrow in middle, body on right. Three forms shown: no-params `() -> ...`, single-param `x -> ...`, block `(x,y) -> { ...; return ...; }`. (2) Functional interface + lambda connection — interface box with one abstract method, arrow labeled 'lambda IS this method'. (3) Before/after comparison: 5-line anonymous Comparator vs 1-line lambda. Side arrows pointing to the same output (they're equivalent). Bottom: variable capture — effectively final rule with visual of variable being 'locked' after first assignment.
- [ ] 🔶 **java_m8_t2** — Functional Interfaces
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show four boxes for the four primary interfaces, each with: name, arrow diagram (input → output or just output for Supplier), primary method signature, and one real-world use case. Colors: Predicate=blue (test/filter), Function=green (transform), Consumer=orange (act), Supplier=purple (produce). Center: method reference cheat sheet — four types with examples. Bottom: composition diagram — two Predicates combined with .and() producing a third; two Functions chained with .andThen().
- [ ] ✅ **java_m8_t3** — Stream API Fundamentals
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Show a stream pipeline as a horizontal conveyor belt: source (List) → filter (removes some items) → map (transforms items) → sorted (reorders) → collect (bucket at end). Each stage labeled with the functional interface type it uses. Below: lazy evaluation diagram — all operations queued but not executing until terminal operation arrow pulls items through. Intermediate vs Terminal operation table. Short-circuit visualization: findFirst() stops the belt early. Optional diagram showing: some operations return Optional<T>, use orElse/ifPresent/isPresent.
- [ ] 🔶 **java_m8_t4** — Stream Collectors
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Show: (1) groupingBy pipeline — stream of mixed elements → groupingBy classifier arrows elements into buckets by key → resulting Map<K, List<V>>. (2) Downstream collector diagram — groupingBy box with second input labeled 'downstream': counting → Long, averagingDouble → Double, summarizingDouble → DoubleSummaryStatistics, joining → String. (3) partitioningBy as a Y-split: stream → predicate → true bucket and false bucket → Map<Boolean, List<T>>. (4) toMap: each element split into key+value pairs → Map<K,V>. Side: Module 6 vs Module 8 comparison — 7 lines of computeIfAbsent loop → 1 line groupingBy.
- [ ] 🔶 **java_m8_t5** — Optional
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Show Optional as a box that either contains a value or is empty. Three rows: (1) Creation — Optional.of (non-null), Optional.ofNullable (might be null), Optional.empty. (2) Transformation chain — Optional<User>.map(getName) → Optional<String>.filter(long).orElse('?') — value flows through each step; empty propagates. (3) Terminal extraction — orElse, orElseGet (lazy), orElseThrow, ifPresent, isPresent+get. Right side: null return vs Optional return comparison — without Optional: method → null → caller forgets to check → NPE. With Optional: method → Optional → caller must handle → no NPE.

## M9

- [ ] 🔶 **java_m9_t1** — Generic Classes
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show the generic class 'recipe' with type parameter: Box<T> class definition with T highlighted everywhere it appears (field type, constructor param, method return type). Below: three instantiations side by side — Box<String>, Box<Integer>, Box<Product> — each showing how T is substituted. Center: before/after comparison — Object-based container (with casts, ClassCastException arrow) vs generic container (no casts, compile error arrow for wrong type). Bottom: Pair<A,B> showing two type parameters, swap() returning Pair<B,A>.
- [ ] 🔶 **java_m9_t2** — Generic Methods
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show generic method anatomy: access modifier, `<T>` (highlighted as 'type param declaration'), return type T, method name, parameters using T. Arrow from `<T>` to each usage of T. Below: type inference diagram — List<String> passed as argument → compiler identifies T=String → return type becomes String → no cast needed. Side-by-side: method-level `<T>` vs class-level `<T>` — when each is appropriate. Bottom: Java library method signatures showing `<T>` placement in real APIs.
- [ ] 🔎 **java_m9_t3** — Bounded Type Parameters
  - req: `VENN` · now: `svg-diagram`
  - brief: Show bound syntax as a Venn diagram: all types (large circle), inside it 'Types extending Number' (medium circle containing Integer, Double, Long, Float, BigDecimal), inside that 'Types extending Comparable' (overlapping). The intersection shows what `<T extends Number & Comparable<T>>` accepts. Below: before/after comparison — without bound: T can be anything, calling compareTo() fails; with bound: T constrained, compareTo() allowed. Side: class hierarchy showing Integer → Number → Object, Integer → Comparable<Integer>. Multiple bounds rule: class first, then interfaces, separated by &.
- [ ] ❌ **java_m9_t4** — Wildcards
  - req: `TREE` · now: `auto-PANELS`
  - brief: Three stacked diagrams: (1) Invariance: Number hierarchy (Integer → Number → Object) on left; List hierarchy on right — List<Integer>, List<Number>, List<Object> are INDEPENDENT (no arrows between them). (2) ? extends Number: a wide funnel accepting List<Integer>, List<Double>, List<Long>, List<Float>, List<Number> — all pour in. Data flows OUT (arrow labeled READING ONLY). X on adding. (3) ? super Integer: a funnel accepting List<Integer>, List<Number>, List<Object>. Data flows IN (arrow labeled WRITING ONLY, Integer goes in). Only Object comes out when reading. Bottom: PECS visual — data flowing OUT = extends; data flowing IN = super.
- [ ] ❌ **java_m9_t5** — Generic Interfaces & Design Patterns
  - req: `TREE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show four pattern boxes side by side: Repository<T,ID> (CRUD methods + default exists()), Mapper<S,T> (mapTo/mapFrom + default mapAllTo()), Strategy<T> (algorithm method + name()), Builder<T> (build()). Each box has: interface declaration, one concrete implementation class below with arrows, and a real-world use case label. Center: the Spring Data hierarchy — CrudRepository<T,ID> → JpaRepository<T,ID> → UserRepository (extends) — showing the full chain that students now understand.

## M10

- [ ] 🔎 **java_m10_t1** — Thread Basics
  - req: `STATE` · now: `svg-diagram`
  - brief: Show a timeline of 3 threads starting simultaneously from a main thread. Three colored bars (Thread-0, Thread-1, Thread-2) start at different times due to scheduling, each running for a period, potentially overlapping. Below: thread lifecycle state machine — boxes for NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED with arrows showing transitions. Side: start() vs run() — two code paths: start() creates new thread stack (separate arrow), run() stays on same thread stack. Daemon thread visual: main thread exits, non-daemon thread keeps JVM alive, daemon thread is killed.
- [ ] ✅ **java_m10_t2** — Synchronization
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Three diagrams: (1) Race condition timeline — Thread A and Thread B both executing counter++ with READ/ADD/WRITE steps shown on a timeline; interleaving causes lost update. Arrow shows expected=7 but actual=6. (2) synchronized block diagram — Thread A holding lock (green), Thread B blocked (red with BLOCKED label), B enters only after A exits. (3) volatile memory model — without volatile: each thread has its own cached copy in CPU register, changes don't propagate. With volatile: all threads read/write main memory directly. Bottom: atomicity vs visibility table.
- [ ] ❌ **java_m10_t3** — ExecutorService and Thread Pools
  - req: `STATE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Show the thread pool as a factory: on the left, a queue of incoming tasks (Callable/Runnable boxes). In the middle, a pool of N worker threads (Thread-1 through Thread-N circles). Threads pull from the queue, process, return to the pool, pull again. On the right, Future<T> bubbles floating out — each linking back to the task that produced it. Future.get() arrows from client code to the bubbles, blocking until the bubble fills with a result. Below: shutdown lifecycle — pool.shutdown() stops intake but finishes queue; shutdownNow() cancels queued and interrupts running.
- [ ] ✅ **java_m10_t4** — Concurrent Collections and Atomic Types
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: Three panels: (1) ConcurrentHashMap internals — show the map partitioned into 16 segments/buckets, multiple threads accessing different buckets simultaneously (no blocking), vs. synchronized map with one giant lock blocking all threads. (2) Producer-Consumer with LinkedBlockingQueue — Producer thread adding to queue (blocks when full, shown with a wall), Consumer thread taking from queue (blocks when empty, shown with empty-box pause). Queue shown as a conveyor belt between them. (3) Atomic operations — CPU CAS instruction: compare current value with expected, if match update atomically (one indivisible CPU instruction). No thread blocking, no OS involvement. Counter: AtomicInteger.incrementAndGet() internal loop with CAS retry.
- [ ] 🔶 **java_m10_t5** — CompletableFuture
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Three-tier diagram: (1) Blocking Future pipeline — three thread bars each with a long BLOCKED section (thread waiting for get()), only a small ACTIVE section (actual work). Total latency = sum of all waits. (2) CompletableFuture pipeline — same three stages as callbacks: supplyAsync (thread active briefly), arrow to thenApply (triggers automatically), arrow to thenAccept (triggers automatically). No thread blocked between stages. Total latency = only the active work time. (3) allOf fan-out — one root CF spawning 5 simultaneous branches (arrow down), all converging at allOf(), then one thenRun at the bottom. Compare: sequential = sum(5 times), parallel = max(5 times).

## M11

- [ ] ❌ **java_m11_t1** — NIO File API
  - req: `TREE` · now: `auto-FLOW`
  - brief: Show a filesystem tree diagram with annotated Path operations: Path.of('data/orders.csv') with arrows pointing to: getParent() → 'data', getFileName() → 'orders.csv', resolve('backup') → 'data/backup'. Below: Files utility class as a toolbox — with icons for each operation: readAllLines (list icon), writeString (pen icon), copy (two-file icon), move (arrow icon), walk (tree icon), exists/isFile/isDirectory (checkbox icons). On the right: StandardOpenOption enum — CREATE, APPEND, TRUNCATE listed with use cases. Bottom: old File vs new Path comparison side by side.
- [ ] ❌ **java_m11_t2** — Buffered I/O and Character Streams
  - req: `MEMORY` · now: `auto-PANELS`
  - brief: Show the decorator stack as nested boxes: innermost box = FileInputStream/SocketInputStream (raw bytes). Next layer = InputStreamReader (adds encoding, bytes→chars). Next layer = BufferedReader (adds 8KB buffer, readLine()). Arrow from left: 'raw bytes from disk/network' flows through each layer, emerging as 'String line' on the right. Parallel stack on output side: String content → PrintWriter → BufferedWriter → OutputStreamWriter → FileOutputStream/SocketOutputStream. Below: comparison table BufferedReader.readLine() vs Scanner.nextLine() — speed, use cases. Bottom: the three common starting points: FileInputStream (file), socket.getInputStream() (network), System.in (keyboard).
- [ ] ❌ **java_m11_t3** — CSV and Structured Data Processing
  - req: `STATE` · now: `auto-PANELS`
  - brief: Three panels: (1) CSV parsing state machine — a string character by character: normal mode (comma splits fields) vs quoted mode (comma is literal). Show the toggle on " and the escape on "". Example: `"Dell, 27",18999` → two fields. (2) Jackson object model: JSON string ↔ ObjectMapper ↔ Java POJO (arrows for readValue and writeValueAsString). POJO shown as a class with getters/setters. Below: JsonNode tree — root → fields → values, path() navigation. (3) CSV→JSON transformation pipeline: CSV file → BufferedReader → parseCSVLine per row → ObjectNode per row → ArrayNode → writeValueAsString → JSON file.
- [ ] ❌ **java_m11_t4** — Java HttpClient
  - req: `STATE` · now: `svg-PANELS(text-in-boxes)`
  - brief: HTTP request/response lifecycle diagram: Client code → HttpClient.send() → [network] → Server. Request box shows: method (GET/POST), URI, headers (Authorization, Content-Type), body (for POST/PUT). Response box shows: statusCode (200/404/500), headers (Content-Type, Retry-After), body (JSON string). Below: HttpRequest.Builder fluent chain with each method: .uri() → .GET()/.POST() → .header() → .timeout() → .build(). Status code ranges: 2xx success (green), 4xx client error (orange), 5xx server error (red). Jackson integration: response.body() → mapper.readValue() → Java object.
- [ ] 🔶 **java_m11_t5** — Async I/O with HttpClient and CompletableFuture
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Two-part timing diagram: (1) Blocking - 5 HTTP calls sequential, each a solid bar taking 100ms, total = 500ms. One thread active throughout, labeled 'BLOCKED'. (2) Async - 5 HTTP calls all starting at t=0 as thin launch arrows, all completing around t=100ms. Thread only active at start (launch) and end (process results). Total = ~100ms. Below: the CF chain diagram for sendAsync: sendAsync() → thenApply(check status) → thenApply(parse JSON) → exceptionally(fallback) — each as a connected box. Bottom: allOf fan-out visual — one root launching 5 parallel branches, all converging at allOf, then one final thenRun callback.

## M12

- [ ] ❌ **java_m12_t1** — JUnit 5 Basics
  - req: `STATE` · now: `auto-FLOW`
  - brief: Test lifecycle timeline: @BeforeAll fires once at top. Then for each test: @BeforeEach → @Test method runs → @AfterEach fires. Repeat for each test. @AfterAll once at bottom. Color coding: setup=blue, test=green, teardown=orange. Second panel: Arrange-Act-Assert in a test method with color-coded sections. Third panel: test report showing green checkmarks for passing tests and red X for failing ones with the assertion message. Bottom: Maven directory structure showing src/main/java vs src/test/java mirroring.
- [ ] ✅ **java_m12_t2** — Parameterized Tests and Edge Cases
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Three panels: (1) @CsvSource structure: table with header row (param1 | param2 | expected) and 5 data rows, arrow pointing to one test method with those parameters. JUnit expands to 5 test runs shown as 5 green check marks. (2) Boundary value diagram: number line showing 0→9 (no discount zone), 10→49 (10% zone), 50+ (20% zone). Red X marks at: 9, 10, 49, 50 labeled as boundary values to test. Green check marks at: 1 (middle of zone 1), 25 (middle of zone 2), 75 (middle of zone 3). (3) @MethodSource: static method returning Stream<Arguments> arrow into @ParameterizedTest, which fans out to N test executions.
- [ ] ✅ **java_m12_t3** — Mocking with Mockito
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Three panels: (1) Without mocking: OrderService box in center, arrows to OrderRepository (with real database cylinder), EmailService (with real email icon). Label: 'Tests need real infrastructure — slow, fragile'. (2) With Mockito: same OrderService box, but arrows now go to @Mock boxes (fake repository with no database, fake email with no SMTP). Label: 'Tests control all dependencies — fast, isolated'. (3) Test flow diagram: @ExtendWith → @Mock creates fakes → @InjectMocks creates service with fakes → when().thenReturn() programs responses → call service method → verify() checks interactions. Bottom: spy as a real object with one stubbed method shown as a half-transparent cylinder with one method highlighted.
- [ ] ❌ **java_m12_t4** — Testing I/O and HTTP
  - req: `STATE` · now: `auto-PANELS`
  - brief: Three panels: (1) @TempDir lifecycle — timeline showing: JUnit creates temp dir → @BeforeEach → @Test runs (writes/reads files inside tempDir) → @AfterEach → JUnit deletes temp dir (even if test failed). Contrast with manual approach: files left on disk if test throws. (2) HttpClient mock setup: HttpClient (mock) → returns HttpResponse (mock) → response.statusCode() = 200, response.body() = JSON string → ApiClient parses with Jackson. Arrow from 'when(client.send(...))' to stubbed response. (3) StringReader/StringWriter as I/O surrogates: String → StringReader → BufferedReader → class under test vs class under test → PrintWriter → StringWriter → String. Both avoid filesystem entirely.
- [ ] ❌ **java_m12_t5** — Test-Driven Development (TDD)
  - req: `STATE` · now: `auto-FLOW`
  - brief: Circular workflow diagram: three states in a loop — RED (red circle, test written, code missing), GREEN (green circle, minimum code written, test passes), REFACTOR (blue circle, code improved, tests still pass). Arrow from RED to GREEN labeled 'write minimum code'. Arrow from GREEN to REFACTOR labeled 'improve code'. Arrow from REFACTOR back to RED labeled 'write next test'. In the center: 'repeat every 2-5 min'. Outside the circle: examples at each stage — RED: '@Test void discount_qty10...' (test code with no implementation), GREEN: 'class Calc { double disc(int n) { return 0.10; } }' (minimal), REFACTOR: 'if (n>=50) 0.20; if (n>=10) 0.10; else 0' (complete logic). Bottom: triangulation diagram — single test → fake implementation possible; two tests → real logic required.

## M13

- [ ] ❌ **java_m13_t1** — Spring Boot Introduction
  - req: `TREE` · now: `auto-PANELS`
  - brief: Three panels: (1) Spring Boot startup sequence: main() → SpringApplication.run() → ApplicationContext created → @ComponentScan finds all @Components → @Autowired wires dependencies → Auto-configuration reads classpath → Embedded Tomcat starts on :8080 → 'Started Application in 2.3s'. (2) Dependency injection diagram: @Service OrderService box with arrows from @Repository OrderRepo and @Service EmailSvc being injected. Label 'Spring creates all three and connects them'. (3) Auto-configuration decision tree: is spring-web on classpath? → configure Jackson, DispatcherServlet, Tomcat. Is spring-data-jpa on classpath? → configure EntityManagerFactory, DataSource. Each auto-config shows the property that overrides it.
- [ ] 🔶 **java_m13_t2** — REST Controllers
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: HTTP request/response flow through Spring Boot: (1) HTTP Request arrives → DispatcherServlet → @RestController method matched. (2) Input: URL path → @PathVariable extracted; query string → @RequestParam extracted; JSON body → Jackson deserializes to @RequestBody. (3) Method executes, calls service. (4) Output: return value serialized to JSON by Jackson; ResponseEntity wraps with status code and headers. (5) HTTP Response sent. Second panel: URL pattern table: GET /api/products (getAll), GET /api/products/{id} (getById), POST /api/products (create), PUT /api/products/{id} (update), DELETE /api/products/{id} (delete) — each with status code and description.
- [ ] 🔶 **java_m13_t3** — Spring Data JPA
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) JPA layers: Java @Entity class ↔ Hibernate ↔ JDBC ↔ Database. Show Product.java with @Entity → generates SQL CREATE TABLE. (2) JpaRepository method name parser: 'findByCategory' splits into find + By + Category → generates 'SELECT * FROM products WHERE category = ?'. 'findByCategoryAndPriceLessThan' → compound WHERE clause. (3) @DataJpaTest scope: full Spring Boot context (grey, inactive) vs @DataJpaTest context (green, active — only @Repository, JPA, H2). Shows what's loaded vs skipped. Side note: transaction rollback between tests — database is clean for each test.
- [ ] ❌ **java_m13_t4** — Validation and Exception Handling
  - req: `STATE` · now: `auto-PANELS`
  - brief: Request lifecycle with validation and exception handling: (1) HTTP request arrives → DispatcherServlet → @Valid on @RequestBody → Jakarta Validation runs constraints. Two paths: PASS → controller method executes → response. FAIL → MethodArgumentNotValidException thrown → @ControllerAdvice catches → 400 response with field errors map. (2) Custom exception flow: service throws ResourceNotFoundException → bubbles up through controller → @ExceptionHandler in @ControllerAdvice catches → 404 response. (3) Exception-to-status mapping table: MethodArgumentNotValidException → 400, ResourceNotFoundException → 404, DuplicateResourceException → 409, BusinessRuleException → 422, Exception → 500.
- [ ] 🔶 **java_m13_t5** — Testing Spring Boot
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three-column diagram: (1) @WebMvcTest — shows the HTTP request → MockMvc → Controller → @MockBean Service (returns stub). Arrow says 'No DB, no full context'. Loads: Controller, ControllerAdvice, Jackson. Mocked: Service, Repository. (2) @DataJpaTest — shows Service → Repository → H2 Database. @Import(Service.class) shown as dotted line. No HTTP. Rollback arrow shows each test gets clean state. (3) @SpringBootTest RANDOM_PORT — full stack: TestRestTemplate sends HTTP → real Tomcat → Controller → Service → Repository → H2. Label: 'slowest but most realistic'. Below: timing comparison bar chart: @WebMvcTest ~500ms, @DataJpaTest ~2s, @SpringBootTest ~5-10s.

## M14

- [ ] 🔶 **java_m14_t1** — Spring Security and JWT Authentication
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) JWT structure diagram — three base64-encoded sections separated by dots. Header decodes to algorithm JSON. Payload decodes to claims (sub, roles, iat, exp). Signature shown as HMAC operation over header.payload with secret key. (2) Request flow with JWT: Client → [JwtAuthFilter intercepts] → extract 'Authorization: Bearer ...' header → JwtService.extractUsername() → UserDetailsService.loadByUsername() → JwtService.isValid() → SecurityContextHolder.setAuthentication() → Controller method proceeds. Rejected path: invalid/expired token → 401 Unauthorized. (3) SecurityFilterChain rules table: /api/auth/** → permitAll, GET /api/products/** → permitAll, /api/admin/** → ADMIN role only, everything else → authenticated.
- [ ] 🔶 **java_m14_t2** — @Async and @Scheduled
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Two panels: (1) @Async flow: HTTP request arrives → Controller calls notificationSvc.sendEmail(order) → Spring's proxy intercepts → submits to thread pool → HTTP thread returns 201 immediately (60ms). Meanwhile: thread pool executes sendEmail (2000ms) in background. Arrow shows HTTP response returning while background work continues. Compare with blocking: single timeline bar with all operations sequential. (2) @Scheduled timeline: horizontal axis is time. fixedRate = bar every 30s regardless of duration (may overlap). fixedDelay = bar starts after previous bar ends + 60s gap. Cron = bars only at specific times (8:00 AM on weekdays). Shows: @EnableScheduling required label. CronExpression decoder showing '0 0 8 * * MON-FRI' split into second/minute/hour/day/month/dow fields.
- [ ] ❌ **java_m14_t3** — Spring Cache with @Cacheable
  - req: `TABLE/GRID` · now: `auto-PANELS`
  - brief: Three panels: (1) Cache hit/miss flow: Request 1 → @Cacheable method → MISS → DB query → store result in cache → return. Request 2 (same key) → @Cacheable method → HIT → return cached value (no DB query). Counter: DB queries: 1 for N requests. (2) Cache annotations comparison table: @Cacheable (reads cache, skips method on hit), @CachePut (always runs method, always updates cache), @CacheEvict (removes entry, next call re-fetches from DB). Use case column: read, write, delete. (3) Caffeine cache config: maximumSize=1000 (horizontal bar showing slots), expireAfterWrite=10min (clock icon with TTL), recordStats (hit rate metric). Per-cache TTL table: products=5min, prices=30sec, users=1hr.
- [ ] 🔶 **java_m14_t4** — @ConfigurationProperties and Profiles
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) @Value vs @ConfigurationProperties comparison: Left column - @Value scattered, no autocomplete, string keys, no validation. Right column - @ConfigurationProperties record, IDE autocomplete (dropdown shown), type-safe, @Validated. (2) Profile loading diagram: Base application.properties always loaded. Active profile (dev/prod) overlays on top — profile properties override base. Environment variable SPRING_PROFILES_ACTIVE shown as the switch. Table of what differs: datasource URL, JPA ddl-auto, logging level, external API URL. (3) @ConfigurationProperties record anatomy: annotation prefix, record fields, kebab-to-camel mapping ('max-retries' → maxRetries), @Validated + @NotBlank constraints, injection via constructor.
- [ ] ❌ **java_m14_t5** — Actuator and Production Observability
  - req: `TREE` · now: `auto-PANELS`
  - brief: Three panels: (1) Actuator endpoint map: Application box with /actuator/* routes labeled. /health → green UP badge with DB, Gateway, DiskSpace components. /info → JSON with name, version, buildTime. /metrics → list of metric names. /metrics/orders.placed → COUNT:15234. /loggers → log level table. Kubernetes probe arrows pointing to /health/liveness and /health/readiness. Prometheus scraper arrow to /actuator/prometheus. (2) Custom HealthIndicator hierarchy: HealthIndicator interface → DB (auto), DiskSpace (auto), Ping (auto), PaymentGatewayHealthIndicator (custom) → all aggregate into /actuator/health response. Status rules: any DOWN → overall DOWN. (3) Micrometer types: Counter (orders.placed: 15234, ever-increasing), Gauge (orders.active: 42, current snapshot), Timer (order.processing.time: p50=45ms, p95=120ms, p99=250ms). All register into MeterRegistry → /actuator/metrics.

## M15

- [ ] 🔶 **java_m15_t1** — Introduction to Microservices Architecture
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) Swiggy-style system diagram: Mobile App → API Gateway → fan-out to User Service, Restaurant Service, Order Service, Payment Service, Delivery Service, Notification Service. Each service has its own database cylinder. Services communicate to each other with HTTP arrows (Order→Inventory, Order→Payment, Order→Notification). (2) HTTP inter-service call flow: OrderService.placeOrder() → RestTemplate.getForObject('http://inventory-service/...') → HTTP GET → InventoryController.checkStock() → 200 {stock:50} → back to OrderService. (3) Monolith vs microservices scaling: monolith needs to scale all components; microservices shows only Search Service scaled (3 instances) while others stay at 1, demonstrating independent scaling.
- [ ] ❌ **java_m15_t2** — Feign Client
  - req: `STATE` · now: `auto-PANELS`
  - brief: Two panels: (1) Feign Client generation at startup: Developer writes @FeignClient interface with @GetMapping methods. Feign reads annotations at runtime → generates proxy class that makes real HTTP calls. Proxy implements the interface. OrderService injects the interface and calls methods as if local. Spring Cloud OpenFeign shown as the generator. (2) Feign request lifecycle: OrderService calls marketClient.getQuote('TCS','INR') → Feign proxy intercepts → builds URL (http://market-service/api/stocks/TCS/quote?currency=INR) → sends HTTP GET → receives JSON response → Jackson deserializes to StockQuote → returned to OrderService. Error path: 404 response → ErrorDecoder → SymbolNotFoundException thrown.
- [ ] 🔶 **java_m15_t3** — Eureka Service Discovery
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three-panel diagram: (1) Startup sequence: market-service starts → sends POST /eureka/apps/MARKET-SERVICE to Eureka Server → appears in registry. order-service starts → fetches registry from Eureka → caches locally. (2) Request flow with discovery: Feign.getQuote('TCS') → check local registry cache [market-service: 45:8081, 67:8081] → LoadBalancer picks 45:8081 (round-robin) → HTTP GET 45:8081/api/stocks/TCS/quote → response → returned. Heartbeat arrow every 10s from market-service to Eureka. (3) Failure scenario: market-service-1 dies → stops heartbeating → Eureka removes it after 30s → next getQuote() only routes to market-service-2 and market-service-3. order-service never hard-coded an IP — transparent failover.
- [ ] 🔎 **java_m15_t4** — Resilience4j Circuit Breaker
  - req: `STATE` · now: `svg-diagram`
  - brief: Three panels: (1) Without circuit breaker — cascade failure timeline: market-service goes DOWN at t=0. order-service threads block (30s timeout each). Thread pool fills at t=10s. New requests queued then rejected. order-service DOWN at t=20s. payment-service also fails. Total cascade by t=30s. Red X on all services. (2) With circuit breaker — state machine diagram: CLOSED box with counters (8 success, 2 fail). Arrow labeled 'failure rate 50% exceeded' → OPEN box (lightning bolt icon, 'fallback returned instantly'). Arrow labeled 'wait 60s' → HALF-OPEN box ('3 test calls'). Arrow labeled 'tests pass' → back to CLOSED. Arrow labeled 'tests fail' → back to OPEN. (3) @CircuitBreaker + @Retry ordering: inner = @Retry (3 attempts, 500ms gap), outer = @CircuitBreaker (counts failure after retries). Diagram shows: call fails → wait 500ms → retry → fail → wait 500ms → retry → all fail → 1 failure recorded to circuit breaker count. If 6/10 fail → circuit opens.
- [ ] ✅ **java_m15_t5** — Distributed Tracing
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Three panels: (1) Trace structure diagram: horizontal timeline. Top bar: order-service, spans entire width (3050ms). Below: market-service bar starting at 10ms (2850ms wide). Below market: db-query bar (2800ms wide, labeled 'BOTTLENECK'). Below market: payment-service bar starting at 2860ms (150ms wide). Each bar labeled with spanId. traceId=abc123 shown at top connecting all bars. (2) Log correlation: two log files (order-service left, market-service right) both showing [abc123] in the brackets. Arrow labeled 'search by traceId' pointing to aggregated log view showing both services' logs interleaved in time order. (3) Zipkin UI mockup: search box with traceId entered, result showing the waterfall chart with labeled spans and durations. Mouse hovering over db-query span showing tooltip: duration=2800ms, service=market-service, tags={query=SELECT * FROM stocks}.

## M16

- [ ] ❌ **java_m16_t1** — Introduction to Apache Kafka
  - req: `MEMORY` · now: `auto-PANELS`
  - brief: Two panels: (1) Kafka architecture: Central 'Kafka Cluster' box containing 3 Broker boxes and a Topic 'order-events' with 3 Partition bars (P0, P1, P2). Each partition has offset numbers [0][1][2][3]. Order-service (Producer) arrow goes in from left. Two Consumer Group boxes on right: 'notification-service' with 3 Consumer instances (each pointing to one partition), 'analytics-service' with 1 Consumer (pointing to all 3 partitions). Arrow labeled '7-day retention' on topic. (2) Kafka vs REST comparison: Left side shows REST flow — order-service → restaurant-svc (wait 150ms) → delivery-svc (wait 200ms) → SMS-svc (wait 180ms). Total 530ms. If SMS-svc down → order fails. Right side shows Kafka — order-service publishes ONE message (5ms), 3 services all read it in parallel, total 25ms. SMS-svc down → messages buffered.
- [ ] 🔶 **java_m16_t2** — Spring Kafka Producer
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Two panels: (1) KafkaTemplate flow: Service code box shows 'kafkaTemplate.send(topic, key, value)'. Arrow labeled 'serializes to JSON' goes to ProducerRecord box (topic='order-events', partition=hash(key)%3, key='ORD-001', value=JSON). Arrow goes to Kafka Broker showing partition selection (key='TCS' always → partition 0, key='INFY' always → partition 1). (2) Send callback flow: kafkaTemplate.send() returns CompletableFuture. .whenComplete((result, ex) -> ...) splits into two paths: success path shows result.getRecordMetadata() with topic/partition/offset details; error path shows ex.getMessage() → retry/DLQ/alert logic. Side note: returns immediately, callback fires when broker acknowledges.
- [ ] 🔶 **java_m16_t3** — Spring Kafka Consumer
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Two panels: (1) @KafkaListener method flow: Kafka broker delivers message from 'trade-executed' topic. Spring Kafka container intercepts, deserializes JSON→TradeExecutedEvent using JsonDeserializer. Calls handleTradeExecuted(event) on the @Service. Method processes (SMS send). Offset committed back to Kafka. Error path: exception thrown → @RetryableTopic retries up to 3 times → after 3 failures → message goes to 'trade-executed-dlt' → @DltHandler called. (2) Consumer groups: trade-executed topic (3 partitions P0, P1, P2). notification-group: 3 consumers C1→P0, C2→P1, C3→P2. portfolio-group: 1 consumer C4→P0,P1,P2 (reads all partitions). Both groups receive the SAME messages independently.
- [ ] 🔶 **java_m16_t4** — Kafka Streams
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) Kafka Streams topology as a DAG: boxes connected by arrows. Source: 'trade-executed' topic → filter (BUY only) → selectKey (symbol) → groupByKey → aggregate (sum totalValue) → windowedBy (5-min tumbling) → toStream → Sink: 'trade-volume-5min' topic. Each box labeled with the operation name. (2) Tumbling vs hopping windows on a timeline: events shown as dots. Tumbling: 5-min blocks side by side, each event in exactly one block. Hopping: overlapping blocks advancing every 1 minute, each event appears in multiple blocks. Table: tumbling=non-overlapping for totals, hopping=sliding window for 'last N minutes'. (3) KTable vs KStream: KTable shows current state for each key (TCS→₹15,67,000; INFY→₹4,23,000; latest value per key). KStream shows all events in order (immutable log). Comparison: KStream=every event, KTable=current state per key.
- [ ] 🔶 **java_m16_t5** — Kafka Schema Registry & Avro
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) Schema Registry flow: Producer builds TradeExecutedEvent using generated class. KafkaAvroSerializer asks Schema Registry: 'Is this schema registered?' → Registry assigns schema ID 42. Serialized bytes on wire: [magic byte][schema ID 4 bytes][Avro binary data]. Consumer receives bytes. KafkaAvroDeserializer reads schema ID 42 → fetches schema from Registry → deserializes binary to TradeExecutedEvent Java object. (2) Compatibility matrix table: rows=change type (add with default, add without default, remove with default, remove without default, rename, type change). Columns: Backward Compatible, Forward Compatible, Full Compatible. Green checkmarks and red X marks per cell. (3) Schema evolution timeline: version 1 (3 fields) → producer adds totalValue with default=0 → version 2 registered (backward compatible) → consumers can still read v1 events → v2 consumers read v2 events with actual totalValue.

## M17

- [ ] 🔶 **java_m17_t1** — PostgreSQL & Flyway Migrations
  - req: `TIMELINE` · now: `auto-FLOW`
  - brief: Two panels: (1) Flyway migration timeline: horizontal arrow labeled 'deployments'. V1 box (deploy 1: creates orders table), V2 box (deploy 2: adds discount column), V3 box (deploy 3: creates order_items), V4 box (deploy 4: adds index). flyway_schema_history table shown with version/description/checksum/success columns. Arrow from 'App Startup' → Flyway reads table → finds V4 unapplied → runs V4.sql → updates table. (2) Environments diagram: Developer laptop (H2, no Flyway, ddl-auto=create-drop), Test environment (H2, no Flyway, @DataJpaTest), Staging (PostgreSQL + Flyway), Production (PostgreSQL + Flyway). Migration SQL files checked into git and deployed to all PostgreSQL environments.
- [ ] ❌ **java_m17_t2** — The N+1 Query Problem
  - req: `TREE` · now: `auto-PANELS`
  - brief: Three panels: (1) N+1 timeline: horizontal axis=time, vertical=database queries. First: 1 query for orders (SELECT * FROM orders). Then: N individual queries for users firing sequentially (SELECT * FROM users WHERE id=?), each a short red bar. Label 'N=100 → 101 total queries'. Total time: 300ms. (2) JOIN FETCH timeline: Same axis. One wide green bar: SELECT o.*, u.* FROM orders JOIN users. Total time: 25ms. Massive difference shown. (3) When to use which fix: decision tree. @ManyToOne → JOIN FETCH or @EntityGraph. @OneToMany (small collection) → JOIN FETCH DISTINCT. @OneToMany (large collection) → @BatchSize. Many associations → DTO projection.
- [ ] ❌ **java_m17_t3** — Connection Pooling & Query Optimization
  - req: `STATE` · now: `auto-PANELS`
  - brief: Three panels: (1) HikariCP pool lifecycle: pool of 10 connection slots shown as boxes. Request 1-10 arrive → each borrows a connection (box turns red=active). Request 11 arrives → all 10 red → waits in queue. connection-timeout timer starts. If a connection returns before timeout (box turns green=idle) → request 11 gets it. If no connection returns before timeout → HikariPool Connection not available exception. (2) EXPLAIN ANALYZE output annotated: 'Seq Scan' circled in red with label 'MISSING INDEX'. 'Rows Removed by Filter: 49M' circled red with label 'SCANNING ENTIRE TABLE'. After CREATE INDEX: 'Index Scan' circled green with label 'USING INDEX'. 'Execution Time: 0.3ms' with label '16000x faster'. (3) Composite index leftmost prefix rule: index (user_id, status, created_at) shown as three-column B-tree. Green checkmarks for WHERE user_id=? and WHERE user_id=? AND status=?. Red X for WHERE status=? (no user_id prefix). Rule: must start from leftmost column.
- [ ] ❌ **java_m17_t4** — JPA Advanced Relationships
  - req: `TABLE/GRID` · now: `svg-PANELS(text-in-boxes)`
  - brief: Three panels: (1) @ManyToMany join table: Product entity box and Category entity box connected by 'product_categories' join table in the middle. product_categories has two FK columns: product_id and category_id. Arrow from Product labeled '@JoinTable(joinColumns=product_id, inverseJoinColumns=category_id)'. Arrow from Category labeled '@ManyToMany(mappedBy=categories)'. Helper methods addCategory/removeCategory shown updating both sides. (2) Cascade type safety matrix: rows=relationship type (@OneToMany, @ManyToMany, @ManyToOne), columns=cascade type (PERSIST, MERGE, REMOVE, ALL, orphanRemoval). Color coding: green for safe, red for dangerous. @ManyToMany + REMOVE = red X with label 'DELETES SHARED ENTITY'. @OneToMany + ALL + orphanRemoval = green checkmark. (3) @Embeddable storage: Order table columns shown including id, status, street, city, pincode (from @Embedded Address) — all in one table. Compare to @Entity Address: separate table with FK join. Label: '@Embeddable = no extra table, no extra query'.
- [ ] 🔶 **java_m17_t5** — Database Transactions & Locking
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) Optimistic locking timeline: Two threads A and B on a horizontal timeline. Both read version=1 at t=0. Thread A updates at t=1 (version becomes 2, 1 row affected → success). Thread B updates at t=2 (WHERE version=1 but it's now 2 → 0 rows affected → OptimisticLockException → retry reads version=2). Labels: 'No DB lock, detect conflict at commit time'. (2) Pessimistic locking timeline: Thread A issues SELECT FOR UPDATE at t=0 → acquires row lock. Thread B issues SELECT FOR UPDATE at t=1 → BLOCKED (shows waiting indicator). Thread A commits at t=2 → releases lock. Thread B unblocks at t=2, reads fresh data, proceeds. Label: 'DB lock held during entire transaction'. (3) Isolation levels table: 4 rows (READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE) × 3 columns (prevents: dirty read, non-repeatable read, phantom read). Green checkmarks for prevented, red X for possible. PostgreSQL default (READ_COMMITTED) highlighted.

## M18

- [ ] 🔶 **java_m18_t1** — Redis Fundamentals & Spring Cache
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Two panels: (1) Cache hit vs miss flow: incoming HTTP request → Spring Cache interceptor. Cache MISS path: interceptor checks Redis (empty) → calls actual service method → method queries PostgreSQL (15ms) → result returned to interceptor → stored in Redis with TTL → returned to client. Cache HIT path: interceptor checks Redis → finds entry → returns immediately from Redis (0.3ms) → method NOT called, PostgreSQL NOT queried. Labels: 'Cache miss: DB hit + store in Redis', 'Cache hit: no DB, no method call'. (2) Key structure diagram: shows Redis keys 'restaurants::Hyderabad', 'restaurants::Mumbai', 'stock-prices::TCS', 'cities::ALL' with TTL values shown (10min, 10min, 30s, 24h). Arrow: '@CacheEvict(restaurants, Hyderabad)' removes the Hyderabad key. Arrow: '@CachePut updates Hyderabad entry without deleting it'.
- [ ] ❌ **java_m18_t2** — Cache-Aside Pattern & Advanced Strategies
  - req: `MEMORY` · now: `auto-PANELS`
  - brief: Three panels: (1) Cache stampede: timeline showing TTL=0 at T=0. Before: 1 steady request/second hitting cache. At T=0: 50,000 simultaneous cache misses all hitting DB. DB connection pool (20 connections) shown saturating. 49,980 requests queue up. 'Thundering herd' label. After mutex fix: only 1 thread rebuilds (gets SETNX lock), other threads wait 50ms then get cached result. (2) Redis data structure usage guide: String → single values (product JSON), Hash → multiple fields per key (user profile), List → ordered sequence (activity feed), Sorted Set → ranked data (leaderboard), Set → unique members (session IDs). (3) Multi-level cache diagram: Request → L1 (JVM heap, Caffeine, 1ms, 100 entries) → L2 (Redis, 0.3ms, 1M entries) → L3 (PostgreSQL, 15ms, unlimited). On hit: return from L1. L1 miss: check L2, populate L1. L2 miss: check DB, populate L2+L1.
- [ ] 🔶 **java_m18_t3** — Redis Rate Limiting
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Three panels: (1) Fixed window counter: horizontal timeline showing minute windows (0:00-0:59, 1:00-1:59). For window 0:00-0:59: 80 requests shown as green bars. Counter in Redis: 'rate:M001:28543210 = 80'. At request 101: counter hits limit → 429 returned. Counter auto-expires at end of window. Window resets at 1:00. (2) Filter architecture: HTTP request → RateLimitFilter → check Redis counter → if allowed: add X-RateLimit headers → Controller. If not allowed: return 429 with Retry-After header, filter chain stops. Shows Redis key: 'rate:apikey:rz_M001:28543210 = 47/100'. (3) Per-endpoint limits table: /api/payments = 50/min, /api/payments/status = 200/min, /api/search = 100/min, /api/reports = 10/min. Shows how different endpoints have different keys: rate:M001:/api/payments:window vs rate:M001:/api/search:window.
- [ ] ❌ **java_m18_t4** — Redis Distributed Locks
  - req: `STATE` · now: `auto-PANELS`
  - brief: Two panels: (1) Distributed lock lifecycle: 5 app instances shown as boxes. All fire @Scheduled at 3:30pm simultaneously. Instance 1: SETNX 'lock:settlement:today' → true → acquires lock (box turns green). Instances 2-5: SETNX → false → skip (boxes show 'skipped'). Instance 1 runs settlement. At finish: DELETE 'lock:settlement:today'. Next day: all 5 can compete for the new key. (2) Idempotency key flow: Client sends POST /payments with X-Idempotency-Key: abc123. Server: check 'idem:result:abc123' in Redis → miss → acquire 'idem:lock:abc123' → process → store result in 'idem:result:abc123'. Second identical request (network retry): check 'idem:result:abc123' → HIT → return cached result. No duplicate charge. Timeline shows result cached for 24 hours.
- [ ] ✅ **java_m18_t5** — Redis Pub/Sub & Cache Invalidation
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Fan-out diagram: Redis Pub/Sub server in center. Publisher (Instance 1) sends arrow to Redis labeled 'PUBLISH cache.invalidate.products P001'. Redis broadcasts to Instances 2-10 simultaneously (10 arrows radiating out). Each instance has a box labeled 'L1 Cache' with P001 crossed out (evicted). Timeline shows: T=0 price updated on Instance 1, T=1ms message delivered to all, T=2ms all L1 caches evicted, T=next request all serve fresh data. Compare to without Pub/Sub: T=29min for TTL expiry on all instances.

## M19

- [ ] 🔎 **java_m19_t1** — Resilience4j Circuit Breaker
  - req: `STATE` · now: `svg-diagram`
  - brief: State machine diagram: Three boxes labeled CLOSED, OPEN, HALF-OPEN. CLOSED box: shows sliding window of 10 calls, 6 red (failed), 4 green (success). '60% failure rate ≥ 50% threshold → OPEN' arrow pointing right. OPEN box: shows all incoming requests going to fallback immediately (0ms). Clock icon labeled 'waitDuration=30s'. After 30s → HALF-OPEN arrow. HALF-OPEN box: shows 3 test calls (permittedCalls=3). If all 3 green → CLOSED arrow (recovered!). If any red → OPEN arrow (still broken). Below: timeline showing payment service behavior without CB (5000 threads blocked) vs with CB (immediate fallback, 0 blocking). Labels: 'CLOSED=business as usual', 'OPEN=fast fail', 'HALF-OPEN=probe recovery'.
- [ ] 🔶 **java_m19_t2** — Retry & Rate Limiter
  - req: `TIMELINE` · now: `auto-PANELS`
  - brief: Two panels: (1) @Retry timeline for a transient failure: T=0 attempt 1 fails (red X), wait 100ms, T=100ms attempt 2 fails (red X), wait 200ms, T=300ms attempt 3 succeeds (green checkmark). Total user-visible latency: 300ms. Compare: without retry: T=0 fail → user sees error. (2) @RateLimiter token bucket: bucket of 100 tokens refills every 1 second. Each call consumes 1 token. When bucket empty: new calls wait up to 500ms (timeoutDuration) for a token. After 500ms: RequestNotPermittedException → fallback (drop/queue).
- [ ] ✅ **java_m19_t3** — Bulkhead Isolation
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: Ship bulkhead metaphor: ship divided into compartments. One compartment floods (tracking overloaded) but others stay dry (payments, search unaffected). Java: thread pool as compartments. 200 total threads: tracking pool=100, payment pool=50, search pool=50. When tracking is full (100 calls): fallback fires. Payments unaffected — their 50 threads are isolated.
- [ ] ✅ **java_m19_t4** — Timeout & Fallback Strategies
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Timeline: external call starts at T=0. Without timeout: thread blocked until T=30s (server timeout). With @TimeLimiter(2s): at T=2s, TimeoutException thrown, fallback called at T=2.001s. Thread freed. Response time: 2.1s vs 30s. Fallback options shown as 4 tiers: static default (fastest), cached (fast), degraded (medium), fail fast (surfaces error).
- [ ] ✅ **java_m19_t5** — Spring Cloud Gateway with Resilience
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Gateway as single entry point: Client → Gateway → [Rate Limiter] → [Circuit Breaker] → [Retry] → Microservice. If circuit OPEN: → Fallback Controller → returns degraded response. All 15 microservices have the same gateway protection without needing their own implementations. Redis stores rate limiter counters shared across gateway instances.

## M20

- [ ] 🔶 **java_m20_t1** — Spring Boot Actuator & Micrometer
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Observability stack: Spring Boot app emits metrics via Micrometer → /actuator/prometheus endpoint. Prometheus scrapes every 15 seconds. Grafana queries Prometheus and renders dashboard: 4 panels showing payment rate (line chart), p99 latency (line chart), error rate (stat), DB pool utilization (gauge). Alert rule: p99 > 500ms → PagerDuty → on-call engineer. Labels: 'Three pillars: Metrics (this topic), Traces (T20.2), Logs (T20.3)'.
- [ ] ✅ **java_m20_t2** — Distributed Tracing
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: Zipkin waterfall diagram: horizontal bars showing span duration. Root: POST /payments (2,855ms). Three child spans below: validateCard (3ms, short bar), callVisa (2,800ms, very long bar highlighted red), savePayment (44ms, short bar). callVisa has one grandchild in the Visa service: processCharge (2,795ms). Annotations: 'traceId propagated in HTTP header X-B3-TraceId'. Bottom: log line showing traceId=[abc123] in MDC context.
- [ ] 🔶 **java_m20_t3** — Structured Logging
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Three-column comparison: Unstructured log (text blob, hard to parse), Structured JSON log (key-value pairs, machine-readable), Loki query result (filtered by json fields). MDC filter diagram: request comes in → filter adds requestId/userId to MDC → controller → service → all log statements include MDC context automatically.
- [ ] ❌ **java_m20_t4** — Prometheus & Grafana Dashboards
  - req: `TABLE/GRID` · now: `auto-FLOW`
  - brief: Grafana dashboard with 4 panels. Top-left: payment rate time series (green line drops to red at 7pm). Top-right: p99 latency (spikes to 2.8s). Bottom-left: error rate gauge (0.2% → 15%). Bottom-right: table showing circuit breakers — payment-cb=OPEN. Red shading shows incident window.
- [ ] ✅ **java_m20_t5** — Alerting & SLO Monitoring
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Error budget consumption chart: 30-day period, horizontal axis = days, vertical axis = error budget remaining (%). Blue shaded area shows allowed 0.05% error budget. Red line shows actual error consumption. Day 15: budget at 60% remaining (good). Day 20: fast burn event → budget drops to 30%. Day 25: alert fires at 20% remaining (freeze deployments). SLO breach at 0%.

## M21

- [ ] 🔶 **java_m21_t1** — Dockerfile & Docker Compose for Spring Boot
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Multi-stage Docker build: Stage 1 (builder, JDK 21): Maven compiles JAR → layertools extracts layers. Stage 2 (runtime, JRE 21-alpine): 4 COPY commands for dependency/loader/snapshot/app layers. Final image: 180MB (vs 450MB with JDK). Docker Compose: app → depends_on → postgres (healthcheck) + redis (healthcheck) + zipkin. Arrows showing TCP connections between services.
- [ ] 🔶 **java_m21_t2** — Kubernetes Deployments & Services
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Kubernetes cluster diagram: 3 nodes. Payment Service Deployment: 3 pods spread across nodes. ClusterIP Service sits in front with internal IP. Requests from other pods → ClusterIP → round-robin to 3 pods. Rolling update: new pod starts → readiness probe passes → old pod terminated. Labels shown on pods as tags (app: payment-service).
- [ ] 🔶 **java_m21_t3** — Kubernetes ConfigMaps, Secrets & Probes
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: ConfigMap and Secret flow: ConfigMap mounted as file at /app/config/application.yml → Spring Boot reads it. Secret injected as env var SPRING_DATASOURCE_PASSWORD. Both separate from Docker image. Three environments shown with same image tag but different ConfigMap/Secret values.
- [ ] 🔶 **java_m21_t4** — CI/CD with GitHub Actions
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: GitHub Actions pipeline: git push → GitHub Actions triggers. 3 jobs: test (parallel: unit + integration) → build-push (Docker build → GHCR push) → deploy-staging (kubectl set image → rollout status). Arrows show dependencies (test → build-push → deploy-staging). Secret icons on GHCR login and kubectl steps. GitHub Environment 'staging' shown as approval gate.
- [ ] 🔶 **java_m21_t5** — Blue-Green & Canary Deployments
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Blue-green: two Deployment sets (blue=v1, green=v2) both running. Service selector points to blue. Arrow shows 'kubectl patch' switching to green. Old blue pods continue running for rollback. Canary: single Ingress splits traffic — 95% to stable pods, 5% to canary pods. Prometheus panel showing: error rate canary (5%) vs stable (0.1%). Decision arrow: rollback at 2% canary error threshold.

## M22

- [ ] ❌ **java_m22_t1** — JVM Tuning & Garbage Collection
  - req: `MEMORY` · now: `auto-FLOW`
  - brief: JVM heap diagram: Eden (left, large, green), Survivor S0+S1 (small, yellow), Old Gen (right, blue). Arrow: object created → Eden. Arrow: Eden full → Minor GC → surviving objects → S0. Arrow: after several Minor GCs → Old Gen (promotion). Arrow: Old Gen full → Major GC (STOP THE WORLD). Timeline below: normal operations, then Major GC pause bar (tall red block at 30s intervals without tuning). After tuning: many small G1GC incremental collection bars (no tall spikes).
- [ ] ❌ **java_m22_t2** — Database Query Optimization
  - req: `TREE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Side-by-side comparison: Seq Scan (left) — database reads all 50M rows one by one, arrow sweeping through table, most rows crossed out (not matching). Time: 4.2s. Index Scan (right) — B-tree index structure, arrow goes directly to matching node, retrieves 23 rows from table. Time: 0.3ms. Below: execution plan tree for each, showing cost estimates and actual times.
- [ ] ✅ **java_m22_t3** — Connection Pool Tuning (HikariCP)
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: HikariCP diagram: pool of 10 connections. Application threads (20) requesting connections. 10 threads get connections immediately. 10 threads wait in queue. connectionTimeout=3s: after 3s waiting, throws exception (fast failure). Metrics panel: hikaricp_connections_active (busy), hikaricp_connections_idle (free), hikaricp_connections_pending (waiting). Alert: pending > 5 for 30s → pool exhaustion warning.
- [ ] ❌ **java_m22_t4** — Caching Strategies (L1 + L2)
  - req: `TREE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Cache hierarchy: Request → L1 Caffeine (in-process, 30s TTL, 1000 entries) → L1 hit? return (0.1ms). L1 miss → L2 Redis (shared, 5min TTL) → L2 hit? populate L1 + return (1ms). L2 miss → DB (5ms) → populate Redis + Caffeine + return. Metrics panel showing hit rate by level: L1=40%, L2=55%, DB=5%. Right panel: stampede protection with mutex on cache-miss.
- [ ] ✅ **java_m22_t5** — Load Testing with Gatling
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Gatling report page: top chart shows users over time (ramp from 0 to 100 over 30s, then constant 100). Bottom-left: response time percentiles over time (p50=45ms, p95=120ms, p99=195ms, all stable). Bottom-right: requests per second (steady 498 req/s). Summary table: total requests=14,940, KO=3 (0.02%), min=12ms, mean=51ms, p95=120ms, p99=195ms, max=312ms. All assertions: PASS (green checkmarks).

## M23

- [ ] 🔶 **java_m23_t1** — JWT Authentication
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: JWT flow: Client → POST /auth/token (credentials) → Auth Server → returns JWT. Client → GET /api/payments (Authorization: Bearer JWT) → Spring Security Filter Chain → JWT filter decodes + validates signature (JWK endpoint) + extracts claims → SecurityContext populated → Controller receives @AuthenticationPrincipal Jwt → extracts merchant_id → queries DB by merchant_id only. Attacker tries forged JWT → signature validation fails → 401 Unauthorized.
- [ ] 🔶 **java_m23_t2** — OAuth2 with Spring Security
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Two flow diagrams side by side. Left: Authorization Code — User browser → Zerodha Auth Server (login+consent) → redirect with code → Quicko backend exchanges code for token → calls Zerodha API. Right: Client Credentials — HDFC Bank service → Razorpay Auth Server (client_id+secret) → access_token → calls Razorpay payment API. Both show scopes as labels on the token arrows.
- [ ] 🔶 **java_m23_t3** — Secrets Management (HashiCorp Vault)
  - req: `TIMELINE` · now: `auto-FLOW`
  - brief: Vault architecture: payment-service pod → k8s ServiceAccount token → Vault Kubernetes Auth → Vault issues lease → returns credentials. Vault Database Engine: connected to PostgreSQL, generates short-lived user per request. Key comparison: left side shows static credentials in git (red: dangerous), right side shows dynamic Vault credentials (green: safe). Lease timeline showing auto-renewal at 80% TTL.
- [ ] ✅ **java_m23_t4** — Input Validation & OWASP Top 10
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: OWASP Top 10 attack/defense grid. Left: attack type (SQL injection, XSS, mass assignment, path traversal). Middle: vulnerable code snippet (red). Right: secure code snippet (green). Bottom: security header panel showing CSP, X-Frame-Options, X-Content-Type-Options all set. Arrow from @Valid annotation → validation failure → 400 Bad Request with field errors JSON.
- [ ] ✅ **java_m23_t5** — Rate Limiting & API Security
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Token bucket diagram: bucket fills at 100 tokens/min. Each request consumes 1 token. Normal traffic: bucket stays full. Attack: bucket empties → 429 returned. Distributed: Redis bucket shared across 3 pods (each pod reads/writes same Redis key). Rate limit headers shown: X-RateLimit-Limit=100, X-RateLimit-Remaining=45, Retry-After=60.

## M24

- [ ] 🔶 **java_m24_t1** — CQRS — Command Query Responsibility Segregation
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: CQRS architecture diagram. Left side: Command flow — Client → Command (PlaceOrder) → CommandHandler → Write DB (normalized). Right side: Query flow — Client → Query (GetPortfolio) → QueryHandler → Read DB (denormalized portfolio view). Center: Event bus connecting write to read (OrderPlaced event → Projection → updates Read DB). Annotations: Write DB: strong consistency, ACID. Read DB: eventual consistency, fast reads, pre-aggregated.
- [ ] ❌ **java_m24_t2** — Event Sourcing
  - req: `STATE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Event Sourcing timeline for payment PAY-001. Top row: event log (append-only DB table) showing 4 events in sequence: PaymentInitiated(5000) → ProcessingStarted(bankRef:B123) → BankTimeout → PaymentFailed(reason:timeout). Bottom: aggregate state at each point reconstructed by replaying. Right side: snapshot optimization — after N events, snapshot the state to avoid full replay. Arrow from events → current state (replay). Temporal query: 'state at t=2' shows PROCESSING.
- [ ] 🔎 **java_m24_t3** — Saga Pattern — Distributed Transactions
  - req: `STATE` · now: `svg-diagram`
  - brief: Two diagrams side by side. Left (Choreography): services arranged in a circle with arrows showing events between them (OrderCreated → InventoryService → InventoryReserved → PaymentService → PaymentFailed → OrderService → OrderCancelled). Right (Orchestration): central SagaOrchestrator box with arrows to 4 service boxes (Inventory, Order, Payment, Notification). Compensation arrows shown in red going backwards. State machine: boxes STEP_1 → STEP_2 → STEP_3 → STEP_4 with red compensation path going right to left.
- [ ] ✅ **java_m24_t4** — Strangler Fig Pattern — Legacy Migration
  - req: `TIMELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Migration timeline diagram. Left: Legacy ODIN monolith (large box). Right: New microservices (smaller boxes: OrderService, TradeService, PositionService). Center: Proxy/Router with feature flag showing traffic split percentages: Week 1: 0% new, Week 4: 10% new, Month 3: 50% new, Month 6: 100% new. Legacy box gradually shrinks as new boxes grow. Arrow from dark launch: 'shadow traffic' hits both systems. Comparison chart shows old vs new output equality verification.
- [ ] 🔶 **java_m24_t5** — Bulkhead & Sidecar Patterns
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Two diagrams. Left (Bulkhead): Payment service box with 3 isolated thread pools inside — HDFC Pool (40 threads), VISA Pool (40 threads), KYC Pool (20 threads). Arrow: HDFC gateway slowdown fills HDFC pool, VISA pool untouched. BulkheadFullException shown on 41st HDFC call. Right (Sidecar): Kubernetes Pod box containing 4 containers: payment-service (main), Fluent-Bit sidecar (logs), Envoy proxy sidecar (traffic), Vault Agent sidecar (secrets). Shared volume between all. Network namespace shared: all containers on localhost.

## M25

- [ ] ❌ **java_m25_t1** — Testcontainers — Real Dependencies in Tests
  - req: `STATE` · now: `auto-PANELS`
  - brief: Two parallel flows. Left (H2 tests): Java test → H2 in-memory DB (fake). Bug in production because H2 ≠ PostgreSQL. Right (Testcontainers): Java test → Docker daemon → PostgreSQL container (real) → real JDBC connection. Same PostgreSQL version as production. CI/CD pipeline shows Docker socket mounted in GitHub Actions. Container lifecycle: @BeforeAll start, @AfterAll stop. Container reuse: static @Container = one container for all test methods.
- [ ] ❌ **java_m25_t2** — Contract Testing with Pact
  - req: `STATE` · now: `auto-PANELS`
  - brief: Contract testing flow diagram. Left: Flipkart (Consumer) team writes @PactConsumerTest → generates pact.json file → uploads to Pact Broker. Right: Razorpay (Provider) team runs @PactProviderTest → downloads pact.json from Pact Broker → runs provider states → verifies real API matches contract. Center: Pact Broker (can-i-deploy tool: red/green). CI/CD arrows: Consumer CI → generate pact → Broker. Provider CI → verify → Broker. Breaking change: Provider CI fails before deploy.
- [ ] 🔶 **java_m25_t3** — Mutation Testing with PITest
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: PITest mutation cycle diagram. Center: Source code file. Left: PITest introduces mutations (4 boxes: conditional boundary, negate conditional, return value, remove void call). Each mutation spawns right-pointing arrows to 'Run tests' boxes. Green arrows: tests fail = mutant KILLED (good!). Red arrows: tests pass = mutant SURVIVED (test gap). Bottom bar: mutation score = killed / (killed + survived). HTML report shown with colored class-level breakdown.
- [ ] ✅ **java_m25_t4** — Performance Testing (Gatling & k6)
  - req: `FLOW/PIPELINE` · now: `svg-diagram`
  - brief: Three side-by-side graphs. Graph 1 (Load test): steady ramp to 1000 users, flat for 10min, stable p99 response time. Graph 2 (Stress test): staircase ramp 100→1000→5000, error rate spikes and p99 explodes at 5000 — breaking point identified. Graph 3 (Soak test): 500 users flat for 8 hours, response time gradually increasing (memory leak pattern). Below: Gatling HTML report screenshot with request count, mean, p95, p99, max, error rate columns.
- [ ] ❌ **java_m25_t5** — Chaos Engineering
  - req: `STATE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Chaos Engineering cycle diagram. Center: Spring Boot app. Outer ring: 5-step cycle going clockwise — (1) Steady State: green metrics baseline, (2) Hypothesize: speech bubble 'CB opens if HDFC has 3s latency', (3) Inject Chaos: red lightning bolt into HDFC Gateway box, (4) Observe: Prometheus dashboard showing CB state OPEN + fallback counter spike, (5) Improve: wrench icon + 'fixed DNS exception handling'. Second diagram: Chaos Monkey for Spring Boot — @Service bean with chaos monkey agent sitting on top, randomly injecting latency arrows or exception bombs into method calls.

## M26

- [ ] ✅ **java_m26_t1** — Spring AI Basics — Chat, Prompts & Models
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Spring AI architecture diagram. Left: Spring Boot Controller (HTTP request). Center: ChatClient with arrows showing: (1) SystemMessage (static bank instructions), (2) UserMessage (customer question), (3) Model options (temperature, max-tokens). Right: AI Model (Claude/GPT-4). Response path: AI → ChatResponse → content() → HTTP response. Below: streaming variant showing Flux<String> flowing back to browser via SSE. Bottom row: three model boxes (Anthropic Claude, OpenAI GPT, local Ollama) showing same ChatClient works with all.
- [ ] 🔶 **java_m26_t2** — RAG — Retrieval Augmented Generation
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Two-phase RAG diagram. Phase 1 (Ingestion — top lane, happens once): Policy PDFs → DocumentReader → TextSplitter (chunks) → EmbeddingModel → Vectors → VectorStore (pgvector DB). Phase 2 (Query — bottom lane, every request): User Question → EmbeddingModel → Query Vector → Similarity Search in VectorStore → Top-3 Relevant Chunks → ChatClient (chunks + question in prompt) → Claude → Answer. Key labels: 'pgvector: PostgreSQL with vector extension', 'Similarity: cosine distance', 'Top-K=3: retrieve 3 most relevant paragraphs'.
- [ ] 🔶 **java_m26_t3** — AI-Powered Features — Classification, Extraction & Summarization
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three AI feature pipelines side by side. Left (Extraction): PDF text → ChatClient (extract prompt + BeanOutputConverter schema) → SalarySlipExtract record → DB. Center (Classification): Support ticket text → ChatClient (classify prompt) → TicketClassification record → routing (urgency 5 → human, 1-3 → automated). Right (Summarization): Long document (500 words) → ChatClient (summarize in 3 bullets) → SummaryResult → dashboard card. Each shows the same pattern: text in → structured record out.
- [ ] ✅ **java_m26_t4** — LangChain4j — AI Services & Agents
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: LangChain4j architecture diagram. Left: Interface declaration (RazorpaySupportAI) with @SystemMessage and @UserMessage annotations. Center: AiServices.builder().chatLanguageModel().chatMemoryProvider().contentRetriever().build() — the builder pattern. Right: Generated implementation proxy at runtime. Below: comparison table — Spring AI row (ChatClient, manual wiring, programmatic) vs LangChain4j row (AiServices interface, declarative, annotation-driven). Both connect to the same AI models (Anthropic Claude, OpenAI, Ollama).
- [ ] ✅ **java_m26_t5** — Testing AI Applications
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Testing pyramid for AI applications. Bottom layer (most tests): Unit tests with mocked ChatClient (instant, free). Middle layer: Integration tests with WireMock stubbing Anthropic API (fast, controlled responses). Upper middle: RAG evaluation tests (InMemoryVectorStore + known test cases, measure accuracy). Top layer (fewest): End-to-end tests against real AI API (slow, expensive, non-deterministic — run nightly only). Sidebar: Fallback testing — inject AI error → verify rule-based fallback activates → assert 200 response.

## M27

- [ ] ✅ **java_m27_t1** — GraphQL Basics — Schema, Queries & Mutations
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: GraphQL schema diagram. Center: single /graphql endpoint. Left side: three clients (Web, iOS Android, Admin dashboard) each sending different query shapes to the same endpoint. Right side: GraphQL resolvers connecting to different data sources (Product DB, Reviews Service, Seller DB, Shipping API). Schema box in the middle shows: type Query { product, products }, type Mutation { createProduct, updatePrice }. Annotation: 'One schema, many clients, each gets exactly the fields they need.'
- [ ] ✅ **java_m27_t2** — Spring for GraphQL — Resolvers & Controllers
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: Spring for GraphQL architecture. Left: HTTP client sends POST /graphql with query body. Center-left: Spring Web layer receives request. Center: GraphQL Engine (parses query, validates against schema). Center-right: @Controller with @QueryMapping methods (product, products, searchProducts) and @SchemaMapping (Product.reviews, Product.seller). Right: @Service and @Repository beans (existing Spring beans, no changes needed). Bottom: schema.graphqls file (in resources/graphql/) being read at startup. Annotation: 'Same @Service beans as REST — just new @Controller annotations'.
- [ ] 🔶 **java_m27_t3** — DataLoader — Solving the N+1 Problem
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Two diagrams. Left (N+1, naive): 200 product boxes each with their own arrow going down to the DB (200 arrows = 200 queries). Right (DataLoader/BatchMapping): 200 products collected into one batch, single arrow to DB with 'IN (P1, P2... P200)', results grouped and distributed back. Performance numbers: N+1: 201 queries, 2500ms. DataLoader: 2 queries, 80ms.
- [ ] 🔶 **java_m27_t4** — GraphQL Subscriptions — Real-Time Data
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Two-part diagram. Left: HTTP polling (bad) — Browser → Server: repeated arrows labeled 'GET /prices every 1s', each arrow has a response arrow back. 1000 users = 1000 req/s. Right: WebSocket subscription (good) — 1000 browser arrows connect once to Server (WebSocket upgrade). Server has a single Flux<PriceUpdate> publishing to all connected clients via subscription protocol. Only one arrow per price change (not one per user). Price update source: Trade Engine → Publisher → Flux → all subscribed WebSockets. Labels: 'graphql-ws: subprotocol over WebSocket', 'Flux<T>: reactive stream from server'.
- [ ] 🔶 **java_m27_t5** — Testing GraphQL APIs
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Two paths: Test → GraphQlTester → Spring GraphQL execution engine (resolvers, schema validation, error handling) → Response assertions. Compare with: Test → MockMvc → HTTP layer (just checks status code + raw JSON). GraphQlTester goes deeper: validates GraphQL-specific semantics. Second part: @GraphQlTest components — only loads @Controller, Schema, and @MockBean services (not full Spring context). Faster than @SpringBootTest.

## M28

- [ ] 🔶 **java_m28_t1** — gRPC Basics — Protocol Buffers & Service Definitions
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: gRPC flow diagram. Left: Java client code. Center-left: Protobuf message (PaymentRequest). Center: wire format — binary bytes over HTTP/2 (much smaller than JSON). Center-right: Protobuf decode. Right: Java server code. Below: comparison table — REST/JSON vs gRPC/Protobuf: serialization speed, message size, HTTP version, type safety, browser support. Bottom: 4 RPC types shown as arrows: unary (single↔single), server-stream (single→multiple), client-stream (multiple→single), bidi (multiple↔multiple).
- [ ] 🔶 **java_m28_t2** — Spring Boot gRPC — Server & Client
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Two boxes side by side. Left (Payment Service): @Service PaymentService with @GrpcClient injected RiskServiceBlockingStub. Arrow showing: stub.checkPayment(request) → gRPC binary over HTTP/2 → Right box. Right (Risk Engine): @GrpcService RiskServiceImpl extending RiskServiceImplBase. responseObserver.onNext(response) → back to left. Below: Spring Boot auto-wiring diagram: grpc-spring-boot-starter creates ManagedChannel, injects as BlockingStub/FutureStub. application.yml: grpc.client.risk-engine.address → channel target.
- [ ] 🔶 **java_m28_t3** — gRPC Streaming — Server, Client & Bidirectional
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Three diagrams side by side. (1) Server streaming: Client sends WatchRequest → Server sends stream of Quote messages continuously (arrow from server to client with multiple arrows). (2) Client streaming: Client sends multiple TradeRecord messages → Server responds once with UploadSummary (multiple arrows client to server, one back). (3) Bidirectional: OrderRequest messages going up, OrderUpdate messages coming down simultaneously (two-way arrows). Labels: 'Zerodha: server streaming for live prices', 'Razorpay: client streaming for batch payments', 'Order book: bidi for interactive trading'.
- [ ] 🔶 **java_m28_t4** — gRPC Security — TLS, Authentication & Authorization
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Security flow diagram. Left: PaymentService pod with valid cert + Bearer token. Right: FraudDetectionService pod. Flow: (1) TLS handshake → cert verified (mTLS). (2) gRPC call with 'authorization: Bearer <token>' in Metadata. (3) AuthInterceptor extracts token, calls TokenValidator. (4) TokenValidator: JWT valid, returns serviceId='payment-service'. (5) Context.withValue(SERVICE_ID, 'payment-service'). (6) Service method: AuthInterceptor.SERVICE_ID.get() = 'payment-service' → allowed. Bottom: same flow from malicious pod — cert invalid OR token missing → UNAUTHENTICATED → rejected at step 3.
- [ ] ✅ **java_m28_t5** — Testing gRPC Services
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: gRPC InProcess test architecture. Left: Test class with @BeforeEach setup. Center: InProcessServer (no network, in JVM memory) containing the real PaymentServiceImpl. Right: Test stub connected via InProcessChannel (same JVM, no TCP). Arrows: test → stub (blocking/async) → InProcessChannel → InProcessServer → PaymentServiceImpl → response back. Below: TestStreamObserver diagram showing onNext()/onCompleted()/onError() callbacks and CountDownLatch for async synchronization.

## M29

- [ ] 🔎 **java_m29_t1** — Big-O Notation — The Language of Efficiency
  - req: `CURVE` · now: `svg-diagram`
  - brief: Big-O growth rate graph. X-axis: input size n (0 to 100). Y-axis: operations (0 to 10,000). Six curves: O(1) flat at bottom, O(log n) barely rising, O(n) diagonal, O(n log n) slightly above diagonal, O(n²) steep parabola, O(2ⁿ) rockets off the chart. Each curve labeled with color and typical example: O(1)=HashMap.get(), O(log n)=Binary Search, O(n)=Linear Search, O(n log n)=Merge Sort, O(n²)=Bubble Sort, O(2ⁿ)=All Subsets. Key annotation: 'At n=100, O(n²)=10,000 ops vs O(n log n)=664 ops'
- [ ] ❌ **java_m29_t2** — Analyzing Code Complexity — Step by Step
  - req: `TREE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Recursion tree for merge sort. Root: T(n) splits into two T(n/2), each splits into two T(n/4), down to T(1) leaves. Each level: work = n (merge step). Number of levels = log n. Total work = n × log n = O(n log n). Labeled: 'Level 0: n work, Level 1: n/2 + n/2 = n work, Level log n: 1+1+...=n work. Total = n × log n levels'.
- [ ] ❌ **java_m29_t3** — Space Complexity — Memory Matters
  - req: `MEMORY` · now: `auto-PANELS`
  - brief: Two diagrams side by side. Left: Recursion call stack for binarySearch(n=16) — 4 stack frames (log₂16=4), each frame holds lo, hi, mid, target. Labeled 'O(log n) space'. Right: Fibonacci recursion — deep left branch fib(n)→fib(n-1)→...→fib(0), depth n frames. Labeled 'O(n) space'. Bottom: comparison table: Algorithm | Time | Space. Iterative binary search: O(log n) | O(1). Recursive binary search: O(log n) | O(log n). Merge sort: O(n log n) | O(n). In-place sort (heapsort): O(n log n) | O(1).
- [ ] ❌ **java_m29_t4** — Best/Worst/Average Case & Amortized Analysis
  - req: `CURVE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Two diagrams. Left: Three-case comparison table for Quicksort, Binary Search, Linear Search, HashMap. Columns: Algorithm | Best | Worst | Average. Rows filled in with correct values, color-coded (green=good, yellow=ok, red=bad). Right: ArrayList amortized analysis timeline. X-axis: number of add() operations (1 to 16). Y-axis: cost of each operation. Most bars height 1 (O(1) add). At positions 2, 4, 8, 16: tall bars showing resize cost (2, 4, 8, 16). Arrow showing: 'total cost = 2n, amortized per op = 2n/n = O(1)'.

## M30

- [ ] ❌ **java_m30_t1** — Two Pointers — O(n) Pair Problems
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Two-pointer inward diagram. Array: [1, 3, 5, 7, 9, 11], target=12. Step-by-step: Step 1: lo=0(1), hi=5(11), sum=12 → FOUND! Return true. Alternate scenario target=14: Step 1: lo=0(1)+hi=5(11)=12 < 14 → lo++. Step 2: lo=1(3)+hi=5(11)=14 = target → FOUND. Arrows show lo moving right, hi moving left. Bottom: 'At most n steps: lo+hi pointers together traverse the array once total → O(n)'.
- [ ] ✅ **java_m30_t2** — Sliding Window — Contiguous Subarray Problems
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: Two diagrams. Left: Fixed window k=3 on array [2,3,1,4,5]. Window slides: [2,3,1]=6, [3,1,4]=8, [1,4,5]=10 (max). Each step: add right element, remove left element. Right: Variable window for 'longest substring without repeat' on 'abcabcbb'. Window expands right. When duplicate found: shrink from left until no duplicate. Shows window [a,b,c]=3, then [b,c,a]=3, then [c,a,b]=3.
- [ ] 🔶 **java_m30_t3** — Prefix Sums — O(1) Range Queries
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Prefix sum array diagram. Top: original array [3,1,2,5,8]. Bottom: prefix array [0,3,4,6,11,19]. Arrows show: prefix[i+1] = prefix[i] + nums[i]. Range query: rangeSum(1,3) = prefix[4]-prefix[1] = 11-3=8 highlighted with bracket.
- [ ] 🔶 **java_m30_t4** — Dutch National Flag — 3-Way Partition
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: DNF array partitioned into 4 regions: [0..low-1] all 0s (red), [low..mid-1] all 1s (white), [mid..high] unknown (to process), [high+1..n-1] all 2s (blue). Arrows: low and mid advance together on 0, only mid advances on 1, high recedes on 2.
- [ ] 🔎 **java_m30_t5** — Array Patterns Synthesis — Multi-Pattern Problems
  - req: `TREE` · now: `svg-diagram`
  - brief: Decision tree for array patterns. Root: 'What type of problem?' Branch 1: 'Pair/triplet?' → Two Pointers. Branch 2: 'Contiguous subarray?' → Sliding Window. Branch 3: 'Range query?' → Prefix Sum. Branch 4: '3 categories?' → DNF. Branch 5: 'Max sum?' → Kadane. Each branch shows time/space complexity.

## M30.5

- [ ] ❌ **java_m30_5_t1** — Matrix Traversal — Row/Column/Diagonal/Spiral
  - req: `TABLE/GRID` · now: `auto-PANELS`
  - brief: 3×3 matrix spiral: → top row, ↓ right col, ← bottom row, ↑ left col. Boundaries shrink: top++, right--, bottom--, left++. Next inner ring repeats.
- [ ] ❌ **java_m30_5_t2** — Grid BFS / DFS — Islands and Flood Fill
  - req: `TABLE/GRID` · now: `svg-PANELS(text-in-boxes)`
  - brief: Grid with '1's forming two islands. BFS wave ripples from source. DFS dives deep marking cells. visited[][] prevents revisiting.
- [ ] ❌ **java_m30_5_t3** — Grid DP — Paths, Costs, and Edit Distance
  - req: `TABLE/GRID` · now: `svg-PANELS(text-in-boxes)`
  - brief: 3×3 grid with dp values filled row by row. Arrows show each cell pulling from cell-above and cell-left. Edit distance table shown with 'match/insert/delete' arrows.
- [ ] ❌ **java_m30_5_t4** — 2D Binary Search — Search in Sorted Matrix
  - req: `TABLE/GRID` · now: `svg-PANELS(text-in-boxes)`
  - brief: Pattern 1: 4×4 matrix flattened to 16-element array with binary search. Pattern 2: starting top-right, arrows show left/down decisions eliminating rows/columns.
- [ ] 🔎 **java_m30_5_t5** — 2D Array Synthesis — Multi-Pattern Problems
  - req: `FLOWCHART` · now: `svg-diagram`
  - brief: Decision flowchart: 'Do you need shortest path?' → BFS. 'Do you need connected component?' → DFS. 'Do you need min-cost over all paths?' → DP. 'Is the grid sorted?' → Binary search. 'Just visit in order?' → Traversal.

## M31

- [ ] ❌ **java_m31_t1** — String Fundamentals — Immutability, Operations, Complexity
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: String pool diagram: String literals point to same pool object ('hello' shared). String s = new String('hello') creates separate heap object (avoid this). Comparison: s1 == s2 checks reference; s1.equals(s2) checks content. StringBuilder internal: char[] buffer that doubles when full (same as ArrayList amortized O(1) append).
- [ ] ❌ **java_m31_t2** — Pattern Matching — KMP Algorithm
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: KMP diagram. Top: LPS array construction for 'AABAAB': table showing index, char, prefix-suffix matches, lps value. Bottom: KMP search on text='AABAABAAB', pattern='AABAAB'. Show how mismatch at j=5 jumps to j=lps[4]=2 instead of restarting at i+1. Mark: 'i stays, j jumps back via LPS — never re-examine text chars'. Final: match found at position 3.
- [ ] 🔶 **java_m31_t3** — Palindromes — Detection and Expansion
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Expand around center diagram on 'babad'. Show 5 odd centers: b(0), a(1), b(2), a(3), d(4). Center 1 (a): expand → b≠d, stop → palindrome 'a' len 1. Center 2 (b): expand left a, right a → a==a → continue → b,a == a,b? → no → palindrome 'aba' len 3. Also check even centers. Final: longest = 'bab' or 'aba' len 3.
- [ ] 🔶 **java_m31_t4** — Anagram & Frequency Problems
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Group anagrams diagram. Input: ['eat','tea','tan','ate','nat','bat']. Process: sort each word as key. 'eat'→'aet', 'tea'→'aet', 'tan'→'ant', 'ate'→'aet', 'nat'→'ant', 'bat'→'abt'. HashMap: 'aet'→[eat,tea,ate], 'ant'→[tan,nat], 'abt'→[bat]. Output: [[eat,tea,ate],[tan,nat],[bat]]
- [ ] 🔶 **java_m31_t5** — String DP — LCS, Edit Distance, Palindromic Subsequence
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: LCS DP table for s1='ABCBDAB' and s2='BDCAB'. 8×6 table (including row/col 0). Filled cell by cell: match diagonal+1, no-match max(above,left). Arrows show the optimal alignment traced back. Answer: dp[7][5]=4 (BCAB or BDAB). Second diagram: Edit distance table for 'horse' to 'ros'.

## M32

- [ ] ❌ **java_m32_t1** — Linked List Basics — Node, Traversal, Dummy Head
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Singly linked list 1→2→3→null. Node structure: [val|next]. Dummy node pattern: [dummy|→] → [1|→] → [2|→] → [3|null]. Delete node 2: prev.next = curr.next. Insert after 1: newNode.next=curr.next; curr.next=newNode.
- [ ] 🔶 **java_m32_t2** — Two-Pointer Techniques on Linked Lists
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: Two diagrams. Left: Find middle of 1→2→3→4→5. Slow/fast both start at 1. Iteration 1: slow=2,fast=3. Iteration 2: slow=3,fast=5. fast.next=null → stop. Middle=slow=3. Right: Cycle detection on 1→2→3→4→5→3(cycle). Iteration 1: slow=2,fast=3. Iter 2: slow=3,fast=5. Iter 3: slow=4,fast=4. slow==fast: CYCLE!
- [ ] ❌ **java_m32_t3** — Linked List Reversal — Full, Partial, K-Groups
  - req: `STATE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Step-by-step reversal of 1→2→3→null. State at each step: prev/curr/next arrows. Step 0: prev=null,curr=1,next=?. Step 1: save next=2, reverse 1.next=null, prev=1,curr=2. Step 2: save next=3, reverse 2.next=1, prev=2,curr=3. Step 3: save next=null, reverse 3.next=2, prev=3,curr=null. Return prev=3. Result: 3→2→1→null.
- [ ] ❌ **java_m32_t4** — Cycle Detection — Floyd's Algorithm
  - req: `MEMORY` · now: `svg-PANELS(text-in-boxes)`
  - brief: Linked list with cycle: 1→2→3→4→5→3(cycle). Phase 1: fast/slow both start at 1. After 3 iterations: slow=4, fast=4 (meeting point inside cycle). Phase 2: reset slow to 1. Advance both at speed 1. slow goes 1→2→3, fast goes 4→5→3. Meet at 3 = cycle entry. Phase 3: count from 3 until return to 3: 3→4→5→3 = length 3.
- [ ] ❌ **java_m32_t5** — Merge and Sort Linked Lists
  - req: `MEMORY` · now: `auto-FLOW`
  - brief: Merge K sorted lists with min-heap. 3 lists: [1,4,7], [2,5,8], [3,6,9]. Heap starts with heads: {1,2,3}. Extract 1(min), push 4 → heap {2,3,4}. Extract 2, push 5 → {3,4,5}. Continues producing 1,2,3,4,5,6,7,8,9. Total: N=9 extractions, each O(log K=log3). Total O(N log K).

## M33

- [ ] ✅ **java_m33_t1** — Stack Fundamentals — LIFO, Deque, Classic Problems
  - req: `PANELS/CONCEPT` · now: `svg-PANELS(text-in-boxes)`
  - brief: Stack as vertical box. Push operations add to top: 1 at bottom, 2 middle, 3 at top. Pop removes 3 first (LIFO). Beside it: balanced parens trace for '([{}])'. Each open bracket pushed: stack grows. Each close bracket: pop and verify match. Empty stack at end = valid.
- [ ] ✅ **java_m33_t2** — Monotonic Stack — Next Greater, Histogram, Trapping Rain
  - req: `FLOW/PIPELINE` · now: `auto-FLOW`
  - brief: Monotonic stack trace for nextGreater([2,1,2,4,3]). Process each index: push 2(idx0). Push 1(idx1)—1<2 ok. See 2(idx2): 2>1(top) → pop idx1, result[1]=2. 2==2(top) → stop. Push idx2. See 4(idx3): 4>2(idx2)→pop,result[2]=4. 4>2(idx0)→pop,result[0]=4. Stack empty→push idx3. See 3(idx4): 3<4(top)→push. End. Stack has [idx3,idx4]: result stays -1.
- [ ] ❌ **java_m33_t3** — Queue Fundamentals — FIFO, BFS, Implement with Stacks
  - req: `TREE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Queue as horizontal pipe: offer() adds to right (tail), poll() removes from left (head). Arrow 'FIFO'. Beside: BFS level-order on tree. Level 0: root. Level 1: left, right. Level 2: all grandchildren. Queue state at each level shown with size snapshot.
- [ ] 🔶 **java_m33_t4** — Deque & Sliding Window Maximum
  - req: `FLOW/PIPELINE` · now: `svg-PANELS(text-in-boxes)`
  - brief: Deque trace for [1,3,-1,-3,5,3,6,7] k=3. Show deque contents (indices with values) at each step. i=0: deque=[0(1)]. i=1: 3>1 → remove 0, add 1 → deque=[1(3)]. i=2: -1<3 → add 2 → deque=[1(3),2(-1)]. Window full: result[0]=nums[1]=3. i=3: -3<-1 → add 3 → deque=[1(3),2(-1),3(-3)]. result[1]=nums[1]=3. i=4: 5>all → clear deque, add 4 → deque=[4(5)]. result[2]=5. Continue...
- [ ] 🔶 **java_m33_t5** — Stack & Queue Synthesis — Calculator, LRU Cache, Task Scheduler
  - req: `FLOW/PIPELINE` · now: `auto-PANELS`
  - brief: LRU Cache with capacity 3. Initial state: head↔tail (empty). put(1): head↔[1]↔tail. put(2): head↔[2]↔[1]↔tail. put(3): head↔[3]↔[2]↔[1]↔tail. get(1): move 1 to front → head↔[1]↔[3]↔[2]↔tail. put(4): evict LRU (2, at tail.prev) → head↔[4]↔[1]↔[3]↔tail. Map updated at each step.
