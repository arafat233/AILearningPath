/**
 * Static problem bank for the Stellar Pro Interview Simulator.
 * 25 problems across 5 topics: arrays, strings, trees, graphs, dp.
 */

const problems = [
  // ─── ARRAYS (5) ────────────────────────────────────────────────────────────

  {
    id: "prob_001",
    title: "Two Sum",
    difficulty: "easy",
    topic: "arrays",
    description:
      "Given an array of integers and a target integer, return the indices of the two numbers that add up to the target. " +
      "Each input has exactly one valid answer, and you may not use the same element twice. " +
      "The returned indices can be in any order.",
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6",
      },
    ],
    followUps: [
      "If the array were sorted, could you solve it in O(n) time without extra space?",
      "What if there could be multiple valid pairs — how would you return all of them?",
      "If the array had 10 billion elements stored on disk, what data structure or algorithm would you use?",
    ],
    tags: ["hash-map", "two-pointer"],
  },

  {
    id: "prob_002",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "easy",
    topic: "arrays",
    description:
      "You are given an array where the i-th element is the price of a stock on day i. " +
      "You want to maximise profit by choosing one day to buy and a later day to sell. " +
      "Return the maximum profit you can achieve; if no profit is possible, return 0.",
    constraints: [
      "1 ≤ prices.length ≤ 10⁵",
      "0 ≤ prices[i] ≤ 10⁴",
    ],
    examples: [
      {
        input: "prices = [7, 1, 5, 3, 6, 4]",
        output: "5",
        explanation: "Buy on day 2 (price 1), sell on day 5 (price 6), profit = 5",
      },
      {
        input: "prices = [7, 6, 4, 3, 1]",
        output: "0",
        explanation: "Prices only fall; no profitable transaction is possible",
      },
    ],
    followUps: [
      "What if you were allowed to make at most two transactions (buy-sell-buy-sell)?",
      "What if there is a cooldown of one day after every sale before you can buy again?",
      "What if each transaction has a fixed transaction fee — how does that change your approach?",
    ],
    tags: ["sliding-window", "greedy"],
  },

  {
    id: "prob_003",
    title: "Maximum Subarray",
    difficulty: "medium",
    topic: "arrays",
    description:
      "Given an integer array, find the contiguous subarray (containing at least one element) that has the largest sum and return that sum. " +
      "The subarray must be contiguous — you cannot skip elements.",
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
    ],
    examples: [
      {
        input: "nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]",
        output: "6",
        explanation: "The subarray [4, -1, 2, 1] has the largest sum of 6",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "Single element; the only subarray is [1]",
      },
    ],
    followUps: [
      "Can you return the actual subarray (start and end indices) in addition to the sum?",
      "What if the array wraps around — i.e., you can take a circular subarray?",
      "Can you solve it using divide-and-conquer in O(n log n) and explain when that approach might be preferable?",
    ],
    tags: ["dynamic-programming", "kadane"],
  },

  {
    id: "prob_004",
    title: "Container With Most Water",
    difficulty: "medium",
    topic: "arrays",
    description:
      "You are given an array of non-negative integers where each element represents the height of a vertical line drawn on a coordinate plane. " +
      "Find the two lines that, together with the x-axis, form a container that holds the most water. " +
      "Return the maximum amount of water the container can store. You may not slant the container.",
    constraints: [
      "2 ≤ height.length ≤ 10⁵",
      "0 ≤ height[i] ≤ 10⁴",
    ],
    examples: [
      {
        input: "height = [1, 8, 6, 2, 5, 4, 8, 3, 7]",
        output: "49",
        explanation: "Lines at indices 1 and 8 (heights 8 and 7) form the largest container: min(8,7) × 7 = 49",
      },
    ],
    followUps: [
      "Why does the two-pointer approach work here — can you give a formal proof of its correctness?",
      "What if you were allowed to pick three lines to form a 3D tank — how would you approach that?",
      "What if line heights could be negative — does your solution still hold?",
    ],
    tags: ["two-pointer", "greedy"],
  },

  {
    id: "prob_005",
    title: "Trapping Rain Water",
    difficulty: "hard",
    topic: "arrays",
    description:
      "Given an array of non-negative integers representing an elevation map where each element is the width of a bar, " +
      "compute how much rainwater can be trapped after raining. " +
      "Water can only be trapped between bars — it flows off the edges.",
    constraints: [
      "1 ≤ height.length ≤ 2 × 10⁴",
      "0 ≤ height[i] ≤ 10⁵",
    ],
    examples: [
      {
        input: "height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]",
        output: "6",
        explanation: "The elevation map traps a total of 6 units of water",
      },
      {
        input: "height = [4, 2, 0, 3, 2, 5]",
        output: "9",
        explanation: "Water fills up between the walls to trap 9 units",
      },
    ],
    followUps: [
      "You solved it in O(n) time with O(n) space using prefix arrays — can you bring space down to O(1)?",
      "What if the map is two-dimensional (a matrix)? How would you trap water in a 2D grid?",
      "What if bars can have varying widths instead of always being width 1?",
    ],
    tags: ["two-pointer", "stack", "prefix-sum"],
  },

  // ─── STRINGS (5) ───────────────────────────────────────────────────────────

  {
    id: "prob_006",
    title: "Valid Anagram",
    difficulty: "easy",
    topic: "strings",
    description:
      "Given two strings, determine whether the second string is an anagram of the first. " +
      "An anagram uses all the original letters exactly once, possibly in a different order. " +
      "Both strings consist of lowercase English letters.",
    constraints: [
      "1 ≤ s.length, t.length ≤ 5 × 10⁴",
      "s and t consist of lowercase English letters",
    ],
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
        explanation: "Both strings contain the same characters with the same frequencies",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
        explanation: '"rat" and "car" do not share the same character frequencies',
      },
    ],
    followUps: [
      "What if the inputs contain Unicode characters beyond ASCII? How does that change your frequency-count approach?",
      "Can you solve it in O(n log n) without extra space, and when would that trade-off be worthwhile?",
      "What if you needed to check whether one string is an anagram of any substring of another string?",
    ],
    tags: ["hash-map", "sorting", "frequency-count"],
  },

  {
    id: "prob_007",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    topic: "strings",
    description:
      "Given a string, find the length of the longest substring that contains no repeating characters. " +
      "A substring is a contiguous part of the string — characters must appear sequentially with no gaps.",
    constraints: [
      "0 ≤ s.length ≤ 5 × 10⁴",
      "s consists of English letters, digits, symbols, and spaces",
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The longest substring without repeating characters is "abc", with length 3',
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The longest such substring is "b", with length 1',
      },
    ],
    followUps: [
      "What if you needed to return the actual substring, not just its length?",
      "What if the definition of 'repeating' changed to: no character appears more than k times?",
      "How would your approach change if the string were a stream of characters arriving in real time?",
    ],
    tags: ["sliding-window", "hash-map"],
  },

  {
    id: "prob_008",
    title: "Group Anagrams",
    difficulty: "medium",
    topic: "strings",
    description:
      "Given an array of strings, group the strings that are anagrams of each other together. " +
      "Each group should be in a list, and the order of groups or strings within a group does not matter. " +
      "An anagram is a word formed by rearranging all letters of another word.",
    constraints: [
      "1 ≤ strs.length ≤ 10⁴",
      "0 ≤ strs[i].length ≤ 100",
      "strs[i] consists of lowercase English letters",
    ],
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: "eat/tea/ate are mutual anagrams; tan/nat are mutual anagrams; bat has no match",
      },
    ],
    followUps: [
      "Your current key is the sorted string — can you design a key that avoids sorting entirely?",
      "What if strings could be very long (up to 10⁵ characters each)? How would you optimise the key generation?",
      "How would you stream-group anagrams if strings arrive one by one without knowing the total count upfront?",
    ],
    tags: ["hash-map", "sorting", "frequency-count"],
  },

  {
    id: "prob_009",
    title: "Minimum Window Substring",
    difficulty: "hard",
    topic: "strings",
    description:
      "Given two strings s and t, return the shortest substring of s that contains every character of t (including duplicates). " +
      "If no such substring exists, return an empty string. " +
      "The answer is guaranteed to be unique when it exists.",
    constraints: [
      "1 ≤ s.length ≤ 10⁵",
      "1 ≤ t.length ≤ 10⁵",
      "s and t consist of uppercase and lowercase English letters",
    ],
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: '"BANC" is the smallest window that contains A, B, and C',
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: "t requires two a's but s contains only one",
      },
    ],
    followUps: [
      "Your solution is O(|s| + |t|) — is there any sub-linear approach, and if not, why not?",
      "What if t could contain wildcards where '?' matches any single character?",
      "What if you needed all minimum windows, not just the first one found?",
    ],
    tags: ["sliding-window", "hash-map", "two-pointer"],
  },

  {
    id: "prob_010",
    title: "Longest Palindromic Substring",
    difficulty: "medium",
    topic: "strings",
    description:
      "Given a string, return the longest substring that reads the same forwards and backwards. " +
      "If there are multiple substrings of the same maximum length, return any one of them. " +
      "A single character is always a valid palindrome.",
    constraints: [
      "1 ≤ s.length ≤ 1000",
      "s consists of digits and English letters",
    ],
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"bab" is a valid palindromic substring; "aba" is also acceptable',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
        explanation: '"bb" is the longest palindromic substring',
      },
    ],
    followUps: [
      "Can you bring the time complexity down from O(n²) to O(n) — and what algorithm achieves that?",
      "What if you needed to count all distinct palindromic substrings, not just the longest?",
      "What if the string wraps around (circular) — how does that change the problem?",
    ],
    tags: ["dynamic-programming", "expand-around-center", "manacher"],
  },

  // ─── TREES (5) ─────────────────────────────────────────────────────────────

  {
    id: "prob_011",
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    topic: "trees",
    description:
      "Given the root of a binary tree, return its maximum depth. " +
      "The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node. " +
      "An empty tree has a depth of 0.",
    constraints: [
      "0 ≤ number of nodes ≤ 10⁴",
      "-100 ≤ Node.val ≤ 100",
    ],
    examples: [
      {
        input: "root = [3, 9, 20, null, null, 15, 7]",
        output: "3",
        explanation: "The longest root-to-leaf path is 3 → 20 → 15 (or 3 → 20 → 7), which has 3 nodes",
      },
      {
        input: "root = [1, null, 2]",
        output: "2",
        explanation: "The only leaf is node 2; the path 1 → 2 has depth 2",
      },
    ],
    followUps: [
      "Can you solve this iteratively without recursion — what data structure would you use?",
      "What is the minimum depth instead of the maximum, and how does that change the traversal strategy?",
      "If the tree has 10 million nodes and is heavily skewed, what are the stack-overflow risks and how do you mitigate them?",
    ],
    tags: ["dfs", "bfs", "recursion"],
  },

  {
    id: "prob_012",
    title: "Validate Binary Search Tree",
    difficulty: "medium",
    topic: "trees",
    description:
      "Given the root of a binary tree, determine whether it is a valid binary search tree. " +
      "A valid BST requires that the left subtree of every node contains only nodes with values strictly less than the node's value, " +
      "the right subtree contains only nodes with values strictly greater, and both subtrees are themselves valid BSTs.",
    constraints: [
      "1 ≤ number of nodes ≤ 10⁴",
      "-2³¹ ≤ Node.val ≤ 2³¹ - 1",
    ],
    examples: [
      {
        input: "root = [2, 1, 3]",
        output: "true",
        explanation: "Left child 1 < 2 and right child 3 > 2; both subtrees are valid BSTs",
      },
      {
        input: "root = [5, 1, 4, null, null, 3, 6]",
        output: "false",
        explanation: "Node 4 is in the right subtree of 5 but 4 < 5, violating the BST property",
      },
    ],
    followUps: [
      "A common mistake is only checking parent-child comparisons — can you construct a tree that passes naive checks but fails the real BST property?",
      "What if the tree allows duplicate values — how would you adjust the validation rules?",
      "Can you validate using an in-order traversal and a single pass without extra space beyond the call stack?",
    ],
    tags: ["dfs", "bst", "recursion"],
  },

  {
    id: "prob_013",
    title: "Binary Tree Level Order Traversal",
    difficulty: "medium",
    topic: "trees",
    description:
      "Given the root of a binary tree, return the level-order traversal of its nodes' values as a list of lists — " +
      "each inner list contains the values at one level, from left to right. " +
      "If the tree is empty, return an empty list.",
    constraints: [
      "0 ≤ number of nodes ≤ 2000",
      "-1000 ≤ Node.val ≤ 1000",
    ],
    examples: [
      {
        input: "root = [3, 9, 20, null, null, 15, 7]",
        output: "[[3], [9, 20], [15, 7]]",
        explanation: "Level 0: [3]; Level 1: [9, 20]; Level 2: [15, 7]",
      },
      {
        input: "root = [1]",
        output: "[[1]]",
        explanation: "Single node; one level with one element",
      },
    ],
    followUps: [
      "How would you modify your solution to return the levels in reverse order (bottom-up)?",
      "What if you needed the zigzag traversal — left-to-right on even levels, right-to-left on odd levels?",
      "Can you do this with DFS instead of BFS? What are the trade-offs?",
    ],
    tags: ["bfs", "queue"],
  },

  {
    id: "prob_014",
    title: "Lowest Common Ancestor of a Binary Tree",
    difficulty: "medium",
    topic: "trees",
    description:
      "Given the root of a binary tree and two nodes p and q, find their lowest common ancestor (LCA). " +
      "The LCA is the deepest node that has both p and q as descendants (a node is considered a descendant of itself). " +
      "It is guaranteed that both p and q exist in the tree.",
    constraints: [
      "2 ≤ number of nodes ≤ 10⁵",
      "-10⁹ ≤ Node.val ≤ 10⁹",
      "All Node.val values are unique",
      "p ≠ q",
    ],
    examples: [
      {
        input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1",
        output: "3",
        explanation: "Node 3 is the deepest ancestor that has both node 5 and node 1 in its subtree",
      },
      {
        input: "root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4",
        output: "5",
        explanation: "Node 4 is a descendant of node 5, so the LCA is node 5 itself",
      },
    ],
    followUps: [
      "What if the tree is a BST — can you exploit that property to speed up the search?",
      "What if p or q might not be in the tree — how does that change your base cases?",
      "If LCA queries are made repeatedly on the same tree, what preprocessing would reduce each query to O(log n)?",
    ],
    tags: ["dfs", "recursion", "tree-traversal"],
  },

  {
    id: "prob_015",
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "hard",
    topic: "trees",
    description:
      "Design an algorithm to convert a binary tree to a string representation and reconstruct the original tree from that string. " +
      "There are no restrictions on your serialization format — choose whatever works correctly for all binary trees, including those with duplicate values or unbalanced structures. " +
      "The encoded string must be decodable back to the exact original tree.",
    constraints: [
      "0 ≤ number of nodes ≤ 10⁴",
      "-1000 ≤ Node.val ≤ 1000",
    ],
    examples: [
      {
        input: "root = [1, 2, 3, null, null, 4, 5]",
        output: '"1,2,null,null,3,4,null,null,5,null,null" (or any valid encoding)',
        explanation: "Pre-order DFS with explicit null markers allows unambiguous reconstruction",
      },
    ],
    followUps: [
      "How would you minimise the size of the serialized string — what encoding schemes could you use?",
      "What if the tree were a BST — can you exploit its properties to serialize with fewer characters?",
      "How would your approach change for an N-ary tree where nodes can have any number of children?",
    ],
    tags: ["dfs", "bfs", "design", "serialization"],
  },

  // ─── GRAPHS (5) ────────────────────────────────────────────────────────────

  {
    id: "prob_016",
    title: "Number of Islands",
    difficulty: "medium",
    topic: "graphs",
    description:
      "Given a 2D grid of '1's (land) and '0's (water), count the number of islands. " +
      "An island is a group of adjacent land cells connected horizontally or vertically (not diagonally). " +
      "The grid is surrounded by water on all four sides.",
    constraints: [
      "1 ≤ m, n ≤ 300",
      "grid[i][j] is '0' or '1'",
    ],
    examples: [
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
        explanation: "There are three separate groups of connected land cells",
      },
    ],
    followUps: [
      "Can you solve this with Union-Find instead of DFS/BFS, and what are the trade-offs?",
      "What if the grid is so large it does not fit in memory — how would you handle it as a stream of rows?",
      "What if diagonal connections also count as adjacent — what changes in your traversal?",
    ],
    tags: ["dfs", "bfs", "union-find", "matrix"],
  },

  {
    id: "prob_017",
    title: "Course Schedule",
    difficulty: "medium",
    topic: "graphs",
    description:
      "You must take numCourses courses labelled 0 to numCourses-1. " +
      "You are given a list of prerequisite pairs where [a, b] means you must take course b before course a. " +
      "Determine whether it is possible to finish all courses, i.e., whether the prerequisite graph is cycle-free.",
    constraints: [
      "1 ≤ numCourses ≤ 2000",
      "0 ≤ prerequisites.length ≤ 5000",
      "prerequisites[i].length == 2",
      "0 ≤ ai, bi < numCourses",
      "All prerequisite pairs are unique",
    ],
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "Take course 0, then course 1; no cycle exists",
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "Course 0 requires 1 and course 1 requires 0 — a cycle makes completion impossible",
      },
    ],
    followUps: [
      "If it is possible, can you return a valid ordering of all courses — which algorithm gives you that directly?",
      "How would you handle the case where some prerequisites are optional (soft prerequisites)?",
      "What if new courses and prerequisites are added dynamically in real time — how would you maintain cycle detection efficiently?",
    ],
    tags: ["topological-sort", "dfs", "bfs", "cycle-detection"],
  },

  {
    id: "prob_018",
    title: "Clone Graph",
    difficulty: "medium",
    topic: "graphs",
    description:
      "Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph. " +
      "Each node contains a value and a list of its neighbours. " +
      "The cloned graph must be a completely independent copy — modifying the clone must not affect the original.",
    constraints: [
      "0 ≤ number of nodes ≤ 100",
      "1 ≤ Node.val ≤ 100",
      "Node.val is unique for each node",
      "No repeated edges, no self-loops",
    ],
    examples: [
      {
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]",
        explanation: "The cloned graph has the same structure; node 1 connects to 2 and 4, etc.",
      },
    ],
    followUps: [
      "What data structure prevents you from creating duplicate copies of the same node when the graph has cycles?",
      "How would your approach change for a directed graph versus an undirected one?",
      "What if the graph were disconnected — how would you ensure all components are cloned?",
    ],
    tags: ["dfs", "bfs", "hash-map"],
  },

  {
    id: "prob_019",
    title: "Word Ladder",
    difficulty: "hard",
    topic: "graphs",
    description:
      "Given a begin word, an end word, and a dictionary of words, find the length of the shortest transformation sequence from the begin word to the end word. " +
      "Each step must change exactly one letter and every intermediate word must exist in the dictionary. " +
      "Return 0 if no such sequence exists.",
    constraints: [
      "1 ≤ beginWord.length ≤ 10",
      "endWord.length == beginWord.length",
      "1 ≤ wordList.length ≤ 5000",
      "wordList[i].length == beginWord.length",
      "All words consist of lowercase English letters",
      "beginWord ≠ endWord",
      "All words in wordList are unique",
    ],
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: "5",
        explanation: '"hit" → "hot" → "dot" → "dog" → "cog" is the shortest path with 5 words',
      },
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]',
        output: "0",
        explanation: '"cog" is not in the word list so no transformation sequence exists',
      },
    ],
    followUps: [
      "How would you return all shortest transformation sequences, not just the length of one?",
      "Can bidirectional BFS reduce your search time, and by approximately how much?",
      "What if letters could be swapped as well as changed — how does adding swap edges affect the graph construction?",
    ],
    tags: ["bfs", "graph", "string-manipulation"],
  },

  {
    id: "prob_020",
    title: "Pacific Atlantic Water Flow",
    difficulty: "medium",
    topic: "graphs",
    description:
      "You are given an m × n rectangular island that borders both the Pacific Ocean (top/left edges) and the Atlantic Ocean (bottom/right edges). " +
      "Rain water flows to adjacent cells (up, down, left, right) only if the neighbouring cell's height is less than or equal to the current cell's height; it then drains into an ocean if it reaches a border. " +
      "Return a list of grid coordinates from which water can flow to both oceans.",
    constraints: [
      "1 ≤ m, n ≤ 200",
      "0 ≤ heights[r][c] ≤ 10⁵",
    ],
    examples: [
      {
        input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
        output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
        explanation: "Each listed cell can drain to both the Pacific (top/left) and the Atlantic (bottom/right)",
      },
    ],
    followUps: [
      "You reversed the flow direction and ran BFS from ocean borders — explain why this inversion is correct.",
      "What if there were internal sinks (cells from which water cannot leave) — how would you identify them?",
      "What if the grid updates dynamically (heights change) — how would you maintain the reachable-cell sets efficiently?",
    ],
    tags: ["dfs", "bfs", "matrix"],
  },

  // ─── DYNAMIC PROGRAMMING (5) ───────────────────────────────────────────────

  {
    id: "prob_021",
    title: "Climbing Stairs",
    difficulty: "easy",
    topic: "dp",
    description:
      "You are climbing a staircase with n steps to reach the top. " +
      "Each time you can either climb 1 step or 2 steps. " +
      "In how many distinct ways can you climb to the top?",
    constraints: [
      "1 ≤ n ≤ 45",
    ],
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "Two ways: (1 step + 1 step) or (2 steps)",
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "Three ways: (1+1+1), (1+2), (2+1)",
      },
    ],
    followUps: [
      "What if you could take up to k steps at a time instead of just 1 or 2?",
      "What if certain steps are broken and cannot be landed on — how do you adapt your recurrence?",
      "This sequence is the Fibonacci sequence — can you compute the n-th term in O(log n) using matrix exponentiation?",
    ],
    tags: ["dynamic-programming", "fibonacci", "memoization"],
  },

  {
    id: "prob_022",
    title: "Coin Change",
    difficulty: "medium",
    topic: "dp",
    description:
      "You are given an array of coin denominations and a target amount. " +
      "Find the minimum number of coins needed to make up the target amount. " +
      "You have an infinite supply of each coin denomination; if the amount cannot be made, return -1.",
    constraints: [
      "1 ≤ coins.length ≤ 12",
      "1 ≤ coins[i] ≤ 2³¹ - 1",
      "0 ≤ amount ≤ 10⁴",
    ],
    examples: [
      {
        input: "coins = [1, 5, 6, 9], amount = 11",
        output: "2",
        explanation: "11 = 5 + 6; two coins are sufficient",
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        explanation: "Amount 3 cannot be formed with only coin denomination 2",
      },
    ],
    followUps: [
      "Why does a greedy strategy (always pick the largest coin) fail for arbitrary denominations — can you give a counterexample?",
      "What if you wanted to count the total number of ways to make the amount, not just the minimum coins?",
      "What if each coin denomination had a limited supply — how does that change the DP from unbounded to bounded knapsack?",
    ],
    tags: ["dynamic-programming", "bfs", "unbounded-knapsack"],
  },

  {
    id: "prob_023",
    title: "Longest Increasing Subsequence",
    difficulty: "medium",
    topic: "dp",
    description:
      "Given an array of integers, return the length of the longest strictly increasing subsequence. " +
      "A subsequence is derived from the array by deleting some elements without changing the order of the remaining elements — the elements do not need to be contiguous.",
    constraints: [
      "1 ≤ nums.length ≤ 2500",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
    ],
    examples: [
      {
        input: "nums = [10, 9, 2, 5, 3, 7, 101, 18]",
        output: "4",
        explanation: "The longest increasing subsequence is [2, 3, 7, 101], length 4",
      },
      {
        input: "nums = [0, 1, 0, 3, 2, 3]",
        output: "4",
        explanation: "One valid LIS is [0, 1, 2, 3], length 4",
      },
    ],
    followUps: [
      "Your DP solution is O(n²) — can you do it in O(n log n) using a patience sorting approach?",
      "What if you needed to return one actual subsequence, not just its length?",
      "What if the sequence were 2D — pairs (a, b) where both a and b must increase — how does that generalise?",
    ],
    tags: ["dynamic-programming", "binary-search", "patience-sort"],
  },

  {
    id: "prob_024",
    title: "Edit Distance",
    difficulty: "hard",
    topic: "dp",
    description:
      "Given two strings, return the minimum number of single-character operations needed to transform one string into the other. " +
      "The allowed operations are: insert a character, delete a character, or replace a character. " +
      "This is also known as the Levenshtein distance.",
    constraints: [
      "0 ≤ word1.length ≤ 500",
      "0 ≤ word2.length ≤ 500",
      "word1 and word2 consist of lowercase English letters",
    ],
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation: 'horse → rorse (replace h→r) → rose (delete r) → ros (delete e): 3 operations',
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: "5",
        explanation: "Five operations are needed to transform intention into execution",
      },
    ],
    followUps: [
      "Can you reduce the space complexity from O(m×n) to O(min(m,n)) while still computing the correct distance?",
      "What if you needed to return the actual sequence of edit operations, not just the count?",
      "How is edit distance used in DNA sequence alignment, and what domain-specific modifications are made to the cost function?",
    ],
    tags: ["dynamic-programming", "string", "levenshtein"],
  },

  {
    id: "prob_025",
    title: "Word Break",
    difficulty: "medium",
    topic: "dp",
    description:
      "Given a string and a dictionary of words, determine whether the string can be segmented into a space-separated sequence of one or more dictionary words. " +
      "Dictionary words may be reused as many times as needed. " +
      "Return true if such a segmentation exists, false otherwise.",
    constraints: [
      "1 ≤ s.length ≤ 300",
      "1 ≤ wordDict.length ≤ 1000",
      "1 ≤ wordDict[i].length ≤ 20",
      "s and wordDict[i] consist of lowercase English letters",
      "All wordDict entries are unique",
    ],
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: '"leetcode" can be segmented as "leet code"',
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false",
        explanation: "No valid segmentation of the entire string exists using the given dictionary",
      },
    ],
    followUps: [
      "What if you needed to return all valid segmentations, not just whether one exists?",
      "How does storing the word dictionary in a Trie improve lookup performance for large dictionaries?",
      "What if a word can only be used a limited number of times — how does that change the DP recurrence?",
    ],
    tags: ["dynamic-programming", "trie", "memoization"],
  },
];

export default problems;
