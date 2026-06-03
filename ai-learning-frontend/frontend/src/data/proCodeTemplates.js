/**
 * proCodeTemplates — reusable per-pattern Java skeletons (Track-2 "code template
 * library", DSA Animator parity). Keyed by the `pattern` tag attached to each
 * ProExercise by config/seedProExerciseMetadata.js, so the exercise runner can
 * surface the right skeleton(s) to copy/insert for the problem at hand.
 *
 * Pure static data — no backend. Add a key here and it lights up for every
 * exercise tagged with that pattern.
 */
const TEMPLATES = {
  "two-pointers": [
    {
      title: "Converging pointers (sorted array)",
      code: `int l = 0, r = nums.length - 1;
while (l < r) {
    int sum = nums[l] + nums[r];
    if (sum == target) return new int[]{l, r};
    else if (sum < target) l++;
    else r--;
}`,
    },
    {
      title: "Fast / slow (read & write)",
      code: `int slow = 0;
for (int fast = 0; fast < nums.length; fast++) {
    if (keep(nums[fast])) {
        nums[slow++] = nums[fast];
    }
}
return slow; // length of the kept prefix`,
    },
  ],
  "sliding-window": [
    {
      title: "Fixed-size window",
      code: `int sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
int best = sum;
for (int i = k; i < nums.length; i++) {
    sum += nums[i] - nums[i - k];
    best = Math.max(best, sum);
}
return best;`,
    },
    {
      title: "Variable window (shrink on violation)",
      code: `int left = 0, best = 0;
for (int right = 0; right < n; right++) {
    add(arr[right]);
    while (invalid()) {           // e.g. window has > k zeros
        remove(arr[left++]);
    }
    best = Math.max(best, right - left + 1);
}
return best;`,
    },
  ],
  "prefix-sum": [{
    title: "Prefix sum + hashmap (subarray sum == k)",
    code: `Map<Integer,Integer> seen = new HashMap<>();
seen.put(0, 1);
int sum = 0, count = 0;
for (int x : nums) {
    sum += x;
    count += seen.getOrDefault(sum - k, 0);
    seen.merge(sum, 1, Integer::sum);
}
return count;`,
  }],
  "binary-search": [{
    title: "Classic binary search",
    code: `int lo = 0, hi = nums.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;`,
  }, {
    title: "Leftmost / rightmost (bias)",
    code: `int lo = 0, hi = nums.length - 1, res = -1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) { res = mid; hi = mid - 1; /* first: hi=mid-1, last: lo=mid+1 */ }
    else if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return res;`,
  }],
  "binary-search-on-answer": [{
    title: "Binary search on the answer",
    code: `int lo = minPossible, hi = maxPossible;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) hi = mid;   // mid works → try smaller
    else lo = mid + 1;
}
return lo; // smallest feasible value`,
  }],
  hashing: [{
    title: "Frequency map",
    code: `Map<Character,Integer> freq = new HashMap<>();
for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);
// look up / compare counts as needed`,
  }, {
    title: "Seen-before lookup (two sum)",
    code: `Map<Integer,Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(nums[i], i);
}`,
  }],
  stack: [{
    title: "Stack (balanced / eval)",
    code: `Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (isOpen(c)) st.push(c);
    else if (st.isEmpty() || !matches(st.pop(), c)) return false;
}
return st.isEmpty();`,
  }],
  "monotonic-stack": [{
    title: "Monotonic stack (next greater)",
    code: `int[] res = new int[n];
Arrays.fill(res, -1);
Deque<Integer> st = new ArrayDeque<>(); // indices, decreasing values
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && nums[i] > nums[st.peek()]) {
        res[st.pop()] = nums[i];   // or i - popped for distances
    }
    st.push(i);
}
return res;`,
  }],
  "tree-traversal": [{
    title: "BFS level order",
    code: `List<List<Integer>> res = new ArrayList<>();
Queue<TreeNode> q = new LinkedList<>();
if (root != null) q.add(root);
while (!q.isEmpty()) {
    int size = q.size();
    List<Integer> level = new ArrayList<>();
    for (int i = 0; i < size; i++) {
        TreeNode n = q.poll();
        level.add(n.val);
        if (n.left != null) q.add(n.left);
        if (n.right != null) q.add(n.right);
    }
    res.add(level);
}
return res;`,
  }],
  "tree-dfs": [{
    title: "DFS recursion (return info up)",
    code: `int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = dfs(node.left);
    int right = dfs(node.right);
    // combine left/right with node here
    return 1 + Math.max(left, right);
}`,
  }],
  bst: [{
    title: "BST search / insert",
    code: `TreeNode cur = root;
while (cur != null) {
    if (target == cur.val) return cur;
    cur = target < cur.val ? cur.left : cur.right;
}
return null;`,
  }],
  trie: [{
    title: "Trie node + insert",
    code: `class Node { Node[] next = new Node[26]; boolean end; }
void insert(Node root, String w) {
    Node cur = root;
    for (char c : w.toCharArray()) {
        int i = c - 'a';
        if (cur.next[i] == null) cur.next[i] = new Node();
        cur = cur.next[i];
    }
    cur.end = true;
}`,
  }],
  "graph-traversal": [{
    title: "Build adjacency list + BFS",
    code: `List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }

boolean[] seen = new boolean[n];
Queue<Integer> q = new LinkedList<>();
q.add(src); seen[src] = true;
while (!q.isEmpty()) {
    int u = q.poll();
    for (int v : adj.get(u)) if (!seen[v]) { seen[v] = true; q.add(v); }
}`,
  }, {
    title: "Grid DFS (flood / islands)",
    code: `void dfs(char[][] g, int r, int c) {
    if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '0';                 // mark visited
    dfs(g, r+1, c); dfs(g, r-1, c); dfs(g, r, c+1); dfs(g, r, c-1);
}`,
  }],
  "topological-sort": [{
    title: "Kahn's algorithm (BFS)",
    code: `int[] indeg = new int[n];
for (int[] e : edges) indeg[e[1]]++;
Queue<Integer> q = new LinkedList<>();
for (int i = 0; i < n; i++) if (indeg[i] == 0) q.add(i);
List<Integer> order = new ArrayList<>();
while (!q.isEmpty()) {
    int u = q.poll(); order.add(u);
    for (int v : adj.get(u)) if (--indeg[v] == 0) q.add(v);
}
return order.size() == n ? order : List.of(); // cycle if not all emitted`,
  }],
  "shortest-path": [{
    title: "Dijkstra (PQ)",
    code: `int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE); dist[src] = 0;
PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[1] - b[1]);
pq.offer(new int[]{src, 0});
while (!pq.isEmpty()) {
    int[] top = pq.poll(); int u = top[0], d = top[1];
    if (d > dist[u]) continue;
    for (int[] nb : adj.get(u)) {
        if (dist[u] + nb[1] < dist[nb[0]]) {
            dist[nb[0]] = dist[u] + nb[1];
            pq.offer(new int[]{nb[0], dist[nb[0]]});
        }
    }
}`,
  }],
  "union-find": [{
    title: "Union-Find (path compression)",
    code: `int[] parent = new int[n];
for (int i = 0; i < n; i++) parent[i] = i;
int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
void union(int a, int b) { parent[find(a)] = find(b); }`,
  }],
  backtracking: [{
    title: "Backtracking (choose / explore / undo)",
    code: `void backtrack(List<Integer> path, int start) {
    res.add(new ArrayList<>(path));        // or check a goal condition
    for (int i = start; i < n; i++) {
        if (skip(i)) continue;             // e.g. dedupe: i>start && a[i]==a[i-1]
        path.add(nums[i]);                 // choose
        backtrack(path, i + 1);            // explore
        path.remove(path.size() - 1);      // undo
    }
}`,
  }],
  "dynamic-programming": [{
    title: "1D DP",
    code: `int[] dp = new int[n + 1];
dp[0] = base0; dp[1] = base1;
for (int i = 2; i <= n; i++) {
    dp[i] = combine(dp[i-1], dp[i-2]);   // e.g. Math.min(...) + cost[i]
}
return dp[n];`,
  }, {
    title: "2D DP (grid / two strings)",
    code: `int[][] dp = new int[m + 1][n + 1];
for (int i = 1; i <= m; i++)
    for (int j = 1; j <= n; j++)
        dp[i][j] = (a[i-1] == b[j-1])
            ? dp[i-1][j-1] + 1
            : Math.max(dp[i-1][j], dp[i][j-1]);
return dp[m][n];`,
  }],
  greedy: [{
    title: "Greedy scan (running best + reset)",
    code: `int total = 0, run = 0, start = 0;
for (int i = 0; i < n; i++) {
    int gain = value(i);
    total += gain; run += gain;
    if (run < 0) { start = i + 1; run = 0; } // reset when locally hopeless
}
return total >= 0 ? start : -1;`,
  }],
  intervals: [{
    title: "Sort by end → greedy keep / sort by start → merge",
    code: `// Non-overlapping / min-arrows: sort by END, keep when start >= lastEnd
Arrays.sort(iv, (a, b) -> Integer.compare(a[1], b[1]));
int end = Integer.MIN_VALUE, kept = 0;
for (int[] x : iv) if (x[0] >= end) { end = x[1]; kept++; }

// Merge: sort by START, extend cur[1] = max(cur[1], x[1]) on overlap`,
  }],
  "bit-manipulation": [{
    title: "Bit tricks",
    code: `n & (n - 1)        // clears the lowest set bit (count set bits / power-of-two)
n & (-n)           // isolates the lowest set bit
a ^ b              // XOR: pairs cancel (find the unique element)
(x >> i) & 1       // read bit i;   x |= (1 << i) // set bit i`,
  }],
  heap: [{
    title: "Top-K with a heap",
    code: `PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap
for (int x : nums) {
    pq.offer(x);
    if (pq.size() > k) pq.poll();   // keep only the k largest
}
return pq.peek(); // kth largest`,
  }],
  "linked-list": [{
    title: "Reverse a linked list",
    code: `ListNode prev = null, cur = head;
while (cur != null) {
    ListNode next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
}
return prev;`,
  }, {
    title: "Fast / slow (cycle, middle)",
    code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true; // cycle; for middle: return slow at end
}
return false;`,
  }],
  recursion: [{
    title: "Recursion with memoization",
    code: `Map<Integer,Integer> memo = new HashMap<>();
int solve(int state) {
    if (isBase(state)) return baseValue;
    if (memo.containsKey(state)) return memo.get(state);
    int ans = combine(solve(next1), solve(next2));
    memo.put(state, ans);
    return ans;
}`,
  }],
  sorting: [{
    title: "Custom comparator",
    code: `Arrays.sort(arr, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
// stable, O(n log n). For primitives needing custom order, box to Integer[].`,
  }],
  queue: [{
    title: "BFS with a queue (level by level)",
    code: `Queue<Integer> q = new LinkedList<>();
q.add(start);
int level = 0;
while (!q.isEmpty()) {
    int size = q.size();           // freeze this level's count
    for (int i = 0; i < size; i++) {
        int cur = q.poll();
        for (int nxt : neighbors(cur)) q.add(nxt);
    }
    level++;
}`,
  }],
  matrix: [{
    title: "4-directional traversal with bounds",
    code: `int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
for (int[] d : dirs) {
    int nr = r + d[0], nc = c + d[1];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;  // bounds-check first
    // process grid[nr][nc]
}`,
  }],
  palindrome: [{
    title: "Expand around center",
    code: `int expand(String s, int l, int r) {
    while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }
    return r - l - 1;              // length of the palindrome
}
// for each i: max(expand(s,i,i), expand(s,i,i+1)) — odd & even centers`,
  }],
  "pattern-matching": [{
    title: "KMP — prefix (LPS) table + search",
    code: `int[] lps = new int[pat.length()];        // longest proper prefix == suffix
for (int i = 1, len = 0; i < pat.length();) {
    if (pat.charAt(i) == pat.charAt(len)) lps[i++] = ++len;
    else if (len > 0) len = lps[len - 1];
    else lps[i++] = 0;
}
// then scan text: on mismatch, jump j = lps[j-1] instead of restarting`,
  }],
};

export default TEMPLATES;
