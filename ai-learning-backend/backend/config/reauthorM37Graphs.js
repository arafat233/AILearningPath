/**
 * reauthorM37Graphs.js — Fix pre-existing duplicate-exercise bug in M37 (Graphs).
 *
 * The original seed wrote the SAME 12 base exercises into every topic t1–t5.
 * This OVERWRITES the duplicated ex_1..ex_N slots per topic with TOPIC-SPECIFIC
 * content (preserves exerciseIds → no orphaned progress), KEEPS each topic's
 * pm_1 and T4's Section-B additions (ex_13 Bellman-Ford, ex_14 trace), and
 * DELETES the leftover duplicate slots.
 *
 * Format matches existing M37 docs:
 *   code_scratch   → expectedSolution is a complete runnable program that PRINTS
 *                    its result; testCases:[{type:"execution",
 *                    expected_stdout_contains:[...]}].
 *   predict_output → testCases:[{type:"text_match", expected:"..."}].
 *
 * Idempotent. Usage: node config/reauthorM37Graphs.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const MODULE_ID = "java_m37";
const DIFF = { warmup: 0.17, easy: 0.40, medium: 0.65, hard: 0.90 };
const XP = { warmup: 10, easy: 15, medium: 20, hard: 30 };

function mk(o) {
  const topicId = o.exerciseId.replace(/_(ex|pm)_\d+$/, "");
  return {
    exerciseId: o.exerciseId, topicId, moduleId: MODULE_ID, trackKey: "pro_java",
    position: o.position, level: o.level, type: o.type, title: o.title,
    scenario: o.scenario || "", instructions: o.instructions,
    starterCode: o.starterCode || "", expectedSolution: o.expectedSolution,
    blanks: [], testCases: o.testCases, hints: o.hints,
    difficulty: DIFF[o.level] ?? 0.5, xpReward: XP[o.level] ?? 15,
  };
}
const run = (...subs) => [{ type: "execution", expected_stdout_contains: subs }];
const txt = (expected) => [{ type: "text_match", expected }];

const EXERCISES = [
  // ════════════════════ T1 — Graph Representation: Adjacency List, BFS, DFS ════════════════════
  mk({ exerciseId:"java_m37_t1_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace BFS visiting order",
    instructions:"Graph (undirected), adjacency list:\n0:[1,2]  1:[0,3]  2:[0,3]  3:[1,2,4]  4:[3]\nBFS from node 0 (neighbours visited in listed order). List the visiting order.",
    expectedSolution:"Queue start [0], visited{0}\nPop 0 → enqueue 1,2 → [1,2], order=0\nPop 1 → enqueue 3 → [2,3], order=0,1\nPop 2 → 3 already queued → [3], order=0,1,2\nPop 3 → enqueue 4 → [4], order=0,1,2,3\nPop 4 → order=0,1,2,3,4\n\nBFS order: 0 1 2 3 4",
    hints:["BFS uses a FIFO queue","Mark a node visited when you ENQUEUE it (not when you pop)","Neighbours added in adjacency-list order"],
    testCases:txt("0 1 2 3 4") }),

  mk({ exerciseId:"java_m37_t1_ex_2", position:2, level:"warmup", type:"code_scratch",
    title:"Build an adjacency list from an edge list",
    instructions:"Given n nodes (0..n-1) and an undirected edge list, build an adjacency list and print each node's neighbours sorted ascending.",
    expectedSolution:`import java.util.*;
public class BuildAdj {
    public static void main(String[] a){
        int n=4; int[][] edges={{0,1},{0,2},{1,3},{2,3}};
        List<List<Integer>> adj=new ArrayList<>();
        for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] e:edges){ adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        for(List<Integer> l:adj) Collections.sort(l);
        System.out.println(adj);          // [[1, 2], [0, 3], [0, 3], [1, 2]]
        System.out.println("O(V+E)");
    }
}`,
    hints:["Undirected: add the edge BOTH ways","One inner list per node","Sort each list before printing"],
    testCases:run("[[1, 2], [0, 3], [0, 3], [1, 2]]","O(V+E)") }),

  mk({ exerciseId:"java_m37_t1_ex_3", position:3, level:"easy", type:"code_scratch",
    title:"BFS traversal order (queue + visited)",
    instructions:"Print the BFS traversal order from node 0 of a graph with 6 nodes, edges {0-1,0-2,1-3,2-4,3-5}. Then print the time complexity.",
    expectedSolution:`import java.util.*;
public class BFS {
    public static void main(String[] x){
        int n=6; int[][] e={{0,1},{0,2},{1,3},{2,4},{3,5}};
        List<List<Integer>> adj=new ArrayList<>();
        for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e){ adj.get(ed[0]).add(ed[1]); adj.get(ed[1]).add(ed[0]); }
        boolean[] vis=new boolean[n]; List<Integer> order=new ArrayList<>();
        Deque<Integer> q=new ArrayDeque<>(); q.add(0); vis[0]=true;
        while(!q.isEmpty()){ int u=q.poll(); order.add(u);
            for(int v:adj.get(u)) if(!vis[v]){ vis[v]=true; q.add(v); } }
        System.out.println(order);         // [0, 1, 2, 3, 4, 5]
        System.out.println("O(V+E)");
    }
}`,
    hints:["FIFO queue (ArrayDeque)","Mark visited on enqueue","Each vertex + edge processed once → O(V+E)"],
    testCases:run("[0, 1, 2, 3, 4, 5]","O(V+E)") }),

  mk({ exerciseId:"java_m37_t1_ex_4", position:4, level:"easy", type:"code_scratch",
    title:"DFS recursive traversal order",
    instructions:"Print the recursive DFS order from node 0 of the same graph (edges {0-1,0-2,1-3,2-4,3-5}), visiting neighbours in ascending order. Then print complexity.",
    expectedSolution:`import java.util.*;
public class DFS {
    static List<List<Integer>> adj; static boolean[] vis; static List<Integer> order=new ArrayList<>();
    static void dfs(int u){ vis[u]=true; order.add(u);
        for(int v:adj.get(u)) if(!vis[v]) dfs(v); }
    public static void main(String[] x){
        int n=6; int[][] e={{0,1},{0,2},{1,3},{2,4},{3,5}};
        adj=new ArrayList<>(); for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e){ adj.get(ed[0]).add(ed[1]); adj.get(ed[1]).add(ed[0]); }
        for(List<Integer> l:adj) Collections.sort(l);
        vis=new boolean[n]; dfs(0);
        System.out.println(order);         // [0, 1, 3, 5, 2, 4]
        System.out.println("O(V+E)");
    }
}`,
    hints:["Recursion = implicit stack","Mark visited at the start of dfs(u)","Dive deep before backtracking"],
    testCases:run("[0, 1, 3, 5, 2, 4]","O(V+E)") }),

  mk({ exerciseId:"java_m37_t1_ex_5", position:5, level:"medium", type:"code_scratch",
    title:"DFS iterative with an explicit stack",
    instructions:"Implement DFS iteratively using an explicit stack. Print the order from node 0 (edges {0-1,0-2,1-3}), pushing neighbours in ascending order. Print complexity.",
    expectedSolution:`import java.util.*;
public class DFSIter {
    public static void main(String[] x){
        int n=4; int[][] e={{0,1},{0,2},{1,3}};
        List<List<Integer>> adj=new ArrayList<>();
        for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e){ adj.get(ed[0]).add(ed[1]); adj.get(ed[1]).add(ed[0]); }
        for(List<Integer> l:adj) Collections.sort(l);
        boolean[] vis=new boolean[n]; List<Integer> order=new ArrayList<>();
        Deque<Integer> st=new ArrayDeque<>(); st.push(0);
        while(!st.isEmpty()){ int u=st.pop(); if(vis[u]) continue; vis[u]=true; order.add(u);
            List<Integer> nb=adj.get(u);
            for(int i=nb.size()-1;i>=0;i--) if(!vis[nb.get(i)]) st.push(nb.get(i)); }
        System.out.println(order);         // [0, 1, 3, 2]
        System.out.println("O(V+E)");
    }
}`,
    hints:["Push neighbours in REVERSE so smallest pops first","Check visited on pop (a node may be pushed twice)","LIFO stack mimics recursion"],
    testCases:run("[0, 1, 3, 2]","O(V+E)") }),

  mk({ exerciseId:"java_m37_t1_ex_6", position:6, level:"medium", type:"code_scratch",
    title:"Number of Connected Components",
    instructions:"Count connected components in an undirected graph of 5 nodes with edges {0-1,1-2,3-4}. Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class CC {
    static List<List<Integer>> adj; static boolean[] vis;
    static void dfs(int u){ vis[u]=true; for(int v:adj.get(u)) if(!vis[v]) dfs(v); }
    public static void main(String[] x){
        int n=5; int[][] e={{0,1},{1,2},{3,4}};
        adj=new ArrayList<>(); for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e){ adj.get(ed[0]).add(ed[1]); adj.get(ed[1]).add(ed[0]); }
        vis=new boolean[n]; int comp=0;
        for(int i=0;i<n;i++) if(!vis[i]){ dfs(i); comp++; }
        System.out.println("components=" + comp);   // components=2
        System.out.println("O(V+E)");
    }
}`,
    hints:["Each unvisited node starts a new component","DFS/BFS marks the whole component","Increment count per fresh start"],
    testCases:run("components=2","O(V+E)") }),

  mk({ exerciseId:"java_m37_t1_ex_7", position:7, level:"medium", type:"code_scratch",
    title:"Detect a cycle in an undirected graph",
    instructions:"Return whether an undirected graph contains a cycle. Test on 4 nodes, edges {0-1,1-2,2-0,2-3} (has a cycle 0-1-2-0). Print true/false and complexity.",
    expectedSolution:`import java.util.*;
public class UndirCycle {
    static List<List<Integer>> adj; static boolean[] vis;
    static boolean dfs(int u,int parent){ vis[u]=true;
        for(int v:adj.get(u)){ if(!vis[v]){ if(dfs(v,u)) return true; }
            else if(v!=parent) return true; }   // visited & not parent → cycle
        return false; }
    public static void main(String[] x){
        int n=4; int[][] e={{0,1},{1,2},{2,0},{2,3}};
        adj=new ArrayList<>(); for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e){ adj.get(ed[0]).add(ed[1]); adj.get(ed[1]).add(ed[0]); }
        vis=new boolean[n]; boolean cyc=false;
        for(int i=0;i<n && !cyc;i++) if(!vis[i]) cyc=dfs(i,-1);
        System.out.println("hasCycle=" + cyc);   // hasCycle=true
        System.out.println("O(V+E)");
    }
}`,
    hints:["Track the parent to ignore the edge you came from","A visited neighbour that isn't the parent = back edge = cycle","Run across all components"],
    testCases:run("hasCycle=true","O(V+E)") }),

  // ════════════════════ T2 — BFS/DFS Applications: Islands, Clone, Walls ════════════════════
  mk({ exerciseId:"java_m37_t2_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace multi-source BFS on rotting oranges",
    instructions:"Grid (2=rotten, 1=fresh, 0=empty):\n2 1 1\n1 1 0\n0 1 1\nMulti-source BFS from all 2s. After how many minutes are ALL oranges rotten? (4-directional)",
    expectedSolution:"Minute 0: only (0,0) rotten.\nMin 1: (0,1),(1,0) rot.\nMin 2: (0,2),(1,1) rot.\nMin 3: (2,1) rots (from (1,1)).\nMin 4: (2,2) rots (from (2,1)).\nAll fresh oranges rotten at minute 4.\n\nAnswer: 4",
    hints:["All initial rotten cells start at minute 0 together","Each BFS level = one minute","Answer = last level reached"],
    testCases:txt("4") }),

  mk({ exerciseId:"java_m37_t2_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Number of Islands (LeetCode #200)",
    instructions:"Count islands ('1'=land,'0'=water, 4-directional) via DFS. Test grid {{1,1,0},{0,1,0},{0,0,1}}. Print count and complexity.",
    expectedSolution:`public class Islands {
    static int R,C; static char[][] g;
    static void sink(int r,int c){ if(r<0||r>=R||c<0||c>=C||g[r][c]!='1') return;
        g[r][c]='0'; sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1); }
    public static void main(String[] x){
        g=new char[][]{{'1','1','0'},{'0','1','0'},{'0','0','1'}};
        R=g.length; C=g[0].length; int n=0;
        for(int r=0;r<R;r++) for(int c=0;c<C;c++) if(g[r][c]=='1'){ sink(r,c); n++; }
        System.out.println("islands=" + n);   // islands=2
        System.out.println("O(R*C)");
    }
}`,
    hints:["For each unvisited '1', DFS-sink the whole island","Sinking sets land to '0' so it isn't recounted","Visit each cell once → O(R*C)"],
    testCases:run("islands=2","O(R*C)") }),

  mk({ exerciseId:"java_m37_t2_ex_3", position:3, level:"easy", type:"code_scratch",
    title:"Max Area of Island (LeetCode #695)",
    instructions:"Return the largest island area (count of connected 1s, 4-dir). Test {{1,1,0,0},{1,0,0,1},{0,0,1,1}}. Print max area and complexity.",
    expectedSolution:`public class MaxArea {
    static int R,C; static int[][] g;
    static int area(int r,int c){ if(r<0||r>=R||c<0||c>=C||g[r][c]==0) return 0;
        g[r][c]=0; return 1+area(r+1,c)+area(r-1,c)+area(r,c+1)+area(r,c-1); }
    public static void main(String[] x){
        g=new int[][]{{1,1,0,0},{1,0,0,1},{0,0,1,1}};
        R=g.length; C=g[0].length; int best=0;
        for(int r=0;r<R;r++) for(int c=0;c<C;c++) if(g[r][c]==1) best=Math.max(best,area(r,c));
        System.out.println("maxArea=" + best);   // maxArea=3
        System.out.println("O(R*C)");
    }
}`,
    hints:["DFS returns 1 + areas of 4 neighbours","Zero out visited cells","Track the max across all starts"],
    testCases:run("maxArea=3","O(R*C)") }),

  mk({ exerciseId:"java_m37_t2_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Rotting Oranges (LeetCode #994) — multi-source BFS",
    instructions:"Return minutes until no fresh orange remains, or -1 if impossible. Test {{2,1,1},{1,1,0},{0,1,1}}. Print result and complexity.",
    expectedSolution:`import java.util.*;
public class Rot {
    public static void main(String[] x){
        int[][] g={{2,1,1},{1,1,0},{0,1,1}};
        int R=g.length,C=g[0].length,fresh=0,min=0;
        Deque<int[]> q=new ArrayDeque<>();
        for(int r=0;r<R;r++) for(int c=0;c<C;c++){ if(g[r][c]==2) q.add(new int[]{r,c}); else if(g[r][c]==1) fresh++; }
        int[][] d={{1,0},{-1,0},{0,1},{0,-1}};
        while(!q.isEmpty() && fresh>0){ int sz=q.size(); min++;
            for(int i=0;i<sz;i++){ int[] cur=q.poll();
                for(int[] dd:d){ int nr=cur[0]+dd[0],nc=cur[1]+dd[1];
                    if(nr>=0&&nr<R&&nc>=0&&nc<C&&g[nr][nc]==1){ g[nr][nc]=2; fresh--; q.add(new int[]{nr,nc}); } } } }
        System.out.println("minutes=" + (fresh==0?min:-1));   // minutes=4
        System.out.println("O(R*C)");
    }
}`,
    hints:["Enqueue ALL rotten cells first (level 0)","Each BFS level = one minute","If fresh remain after BFS → -1"],
    testCases:run("minutes=4","O(R*C)") }),

  mk({ exerciseId:"java_m37_t2_ex_5", position:5, level:"medium", type:"code_scratch",
    title:"Flood Fill (LeetCode #733)",
    instructions:"Flood fill from (sr,sc) with newColor (4-dir). Test image {{1,1,1},{1,1,0},{1,0,1}}, sr=1,sc=1,newColor=2. Print resulting grid and complexity.",
    expectedSolution:`import java.util.*;
public class Flood {
    static int R,C,old,nc; static int[][] g;
    static void fill(int r,int c){ if(r<0||r>=R||c<0||c>=C||g[r][c]!=old) return;
        g[r][c]=nc; fill(r+1,c); fill(r-1,c); fill(r,c+1); fill(r,c-1); }
    public static void main(String[] x){
        g=new int[][]{{1,1,1},{1,1,0},{1,0,1}}; R=g.length; C=g[0].length;
        int sr=1,sc=1,color=2; old=g[sr][sc];
        if(old!=color){ nc=color; fill(sr,sc); }
        System.out.println(Arrays.deepToString(g));  // [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
        System.out.println("O(R*C)");
    }
}`,
    hints:["Guard: if old==new, return (avoid infinite recursion)","Replace old color with new, then recurse 4 ways","Only cells matching the original color change"],
    testCases:run("[[2, 2, 2], [2, 2, 0], [2, 0, 1]]","O(R*C)") }),

  mk({ exerciseId:"java_m37_t2_ex_6", position:6, level:"medium", type:"code_scratch",
    title:"Clone Graph (LeetCode #133)",
    instructions:"Deep-clone an undirected graph (node values 1..n). Build nodes 1-2-3-4 in a square (1-2,2-3,3-4,4-1), clone it, and print each cloned node's neighbour values to prove the structure is copied. Print complexity.",
    expectedSolution:`import java.util.*;
public class Clone {
    static class Node{ int val; List<Node> nb=new ArrayList<>(); Node(int v){val=v;} }
    static Map<Node,Node> seen=new HashMap<>();
    static Node clone(Node n){ if(n==null) return null;
        if(seen.containsKey(n)) return seen.get(n);
        Node c=new Node(n.val); seen.put(n,c);
        for(Node x:n.nb) c.nb.add(clone(x));
        return c; }
    public static void main(String[] a){
        Node[] v=new Node[5]; for(int i=1;i<=4;i++) v[i]=new Node(i);
        int[][] e={{1,2},{2,3},{3,4},{4,1}};
        for(int[] ed:e){ v[ed[0]].nb.add(v[ed[1]]); v[ed[1]].nb.add(v[ed[0]]); }
        Node c=clone(v[1]);
        List<Integer> nbVals=new ArrayList<>(); for(Node x:c.nb) nbVals.add(x.val);
        Collections.sort(nbVals);
        System.out.println("node1 neighbours=" + nbVals);  // node1 neighbours=[2, 4]
        System.out.println("O(V+E)");
    }
}`,
    hints:["HashMap<original, clone> prevents infinite recursion on cycles","Create the clone BEFORE recursing into neighbours","Return the cached clone if already made"],
    testCases:run("node1 neighbours=[2, 4]","O(V+E)") }),

  // ════════════════════ T3 — Topological Sort: Kahn's, DFS post-order, Course Schedule ════════════════════
  mk({ exerciseId:"java_m37_t3_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace Kahn's algorithm (in-degrees)",
    instructions:"DAG edges (u→v): 0→1, 0→2, 1→3, 2→3. Run Kahn's topological sort (pick the smallest-numbered zero-in-degree node when tied). Give the topological order.",
    expectedSolution:"In-degrees: 0:0, 1:1, 2:1, 3:2\nQueue (in-deg 0): [0]\nPop 0 → dec 1,2 → in-deg 1:0,2:0 → queue [1,2], order=0\nPop 1 → dec 3 → 3:1 → queue [2], order=0,1\nPop 2 → dec 3 → 3:0 → queue [3], order=0,1,2\nPop 3 → order=0,1,2,3\n\nTopological order: 0 1 2 3",
    hints:["Start with all in-degree-0 nodes","Removing a node decrements its successors' in-degrees","A node enters the queue when its in-degree hits 0"],
    testCases:txt("0 1 2 3") }),

  mk({ exerciseId:"java_m37_t3_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Topological Sort — Kahn's BFS",
    instructions:"Return a topological order of a DAG with 4 nodes, edges 0→1,0→2,1→3,2→3 (smallest zero-in-degree first). Print the order and complexity.",
    expectedSolution:`import java.util.*;
public class Kahn {
    public static void main(String[] x){
        int n=4; int[][] e={{0,1},{0,2},{1,3},{2,3}};
        List<List<Integer>> adj=new ArrayList<>(); int[] indeg=new int[n];
        for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e){ adj.get(ed[0]).add(ed[1]); indeg[ed[1]]++; }
        PriorityQueue<Integer> q=new PriorityQueue<>();
        for(int i=0;i<n;i++) if(indeg[i]==0) q.add(i);
        List<Integer> order=new ArrayList<>();
        while(!q.isEmpty()){ int u=q.poll(); order.add(u);
            for(int v:adj.get(u)) if(--indeg[v]==0) q.add(v); }
        System.out.println(order);   // [0, 1, 2, 3]
        System.out.println("O(V+E)");
    }
}`,
    hints:["Compute in-degrees from the directed edges","Use a (priority) queue of in-degree-0 nodes","Decrement successors; enqueue when in-degree hits 0"],
    testCases:run("[0, 1, 2, 3]","O(V+E)") }),

  mk({ exerciseId:"java_m37_t3_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Topological Sort — DFS post-order",
    instructions:"Produce a topological order using DFS post-order + reversal. Same DAG (0→1,0→2,1→3,2→3). Print the order and complexity.",
    expectedSolution:`import java.util.*;
public class TopoDFS {
    static List<List<Integer>> adj; static boolean[] vis; static Deque<Integer> stack=new ArrayDeque<>();
    static void dfs(int u){ vis[u]=true; for(int v:adj.get(u)) if(!vis[v]) dfs(v); stack.push(u); }
    public static void main(String[] x){
        int n=4; int[][] e={{0,1},{0,2},{1,3},{2,3}};
        adj=new ArrayList<>(); for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e) adj.get(ed[0]).add(ed[1]);
        vis=new boolean[n]; for(int i=0;i<n;i++) if(!vis[i]) dfs(i);
        List<Integer> order=new ArrayList<>(); while(!stack.isEmpty()) order.add(stack.pop());
        System.out.println(order);   // [0, 2, 1, 3]
        System.out.println("O(V+E)");
    }
}`,
    hints:["Push a node AFTER visiting all its descendants (post-order)","Popping the stack reverses post-order → topological order","Works only on a DAG"],
    testCases:run("[0, 2, 1, 3]","O(V+E)") }),

  mk({ exerciseId:"java_m37_t3_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Course Schedule (LeetCode #207) — can finish?",
    instructions:"Given numCourses=4 and prerequisites [[1,0],[2,0],[3,1],[3,2]] (pair [a,b] = b before a), return whether all courses can be finished (no cycle). Print true/false and complexity.",
    expectedSolution:`import java.util.*;
public class CourseSchedule {
    public static void main(String[] x){
        int n=4; int[][] pre={{1,0},{2,0},{3,1},{3,2}};
        List<List<Integer>> adj=new ArrayList<>(); int[] indeg=new int[n];
        for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] p:pre){ adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
        Deque<Integer> q=new ArrayDeque<>();
        for(int i=0;i<n;i++) if(indeg[i]==0) q.add(i);
        int done=0;
        while(!q.isEmpty()){ int u=q.poll(); done++;
            for(int v:adj.get(u)) if(--indeg[v]==0) q.add(v); }
        System.out.println("canFinish=" + (done==n));   // canFinish=true
        System.out.println("O(V+E)");
    }
}`,
    hints:["This is cycle detection on a directed graph","Kahn's: if you process all n nodes, there's no cycle","[a,b] means edge b→a"],
    testCases:run("canFinish=true","O(V+E)") }),

  mk({ exerciseId:"java_m37_t3_ex_5", position:5, level:"medium", type:"code_scratch",
    title:"Course Schedule II (LeetCode #210) — return the order",
    instructions:"Same input as #207 (n=4, prereqs [[1,0],[2,0],[3,1],[3,2]]). Return a valid order to finish all courses (smallest-first on ties), or empty if impossible. Print the order and complexity.",
    expectedSolution:`import java.util.*;
public class CourseSchedule2 {
    public static void main(String[] x){
        int n=4; int[][] pre={{1,0},{2,0},{3,1},{3,2}};
        List<List<Integer>> adj=new ArrayList<>(); int[] indeg=new int[n];
        for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] p:pre){ adj.get(p[1]).add(p[0]); indeg[p[0]]++; }
        PriorityQueue<Integer> q=new PriorityQueue<>();
        for(int i=0;i<n;i++) if(indeg[i]==0) q.add(i);
        List<Integer> order=new ArrayList<>();
        while(!q.isEmpty()){ int u=q.poll(); order.add(u);
            for(int v:adj.get(u)) if(--indeg[v]==0) q.add(v); }
        if(order.size()!=n) order.clear();
        System.out.println(order);   // [0, 1, 2, 3]
        System.out.println("O(V+E)");
    }
}`,
    hints:["Same as #207 but record the popped order","Empty result if a cycle prevents finishing all","PriorityQueue gives the smallest-first tie-break"],
    testCases:run("[0, 1, 2, 3]","O(V+E)") }),

  mk({ exerciseId:"java_m37_t3_ex_6", position:6, level:"hard", type:"code_scratch",
    title:"Detect a cycle in a directed graph (DFS colors)",
    instructions:"Detect a cycle in a directed graph using the 3-color (white/gray/black) DFS. Test 3 nodes, edges 0→1,1→2,2→0 (a cycle). Print true/false and complexity.",
    expectedSolution:`import java.util.*;
public class DirCycle {
    static List<List<Integer>> adj; static int[] color; // 0 white,1 gray,2 black
    static boolean dfs(int u){ color[u]=1;
        for(int v:adj.get(u)){ if(color[v]==1) return true; if(color[v]==0 && dfs(v)) return true; }
        color[u]=2; return false; }
    public static void main(String[] x){
        int n=3; int[][] e={{0,1},{1,2},{2,0}};
        adj=new ArrayList<>(); for(int i=0;i<n;i++) adj.add(new ArrayList<>());
        for(int[] ed:e) adj.get(ed[0]).add(ed[1]);
        color=new int[n]; boolean cyc=false;
        for(int i=0;i<n && !cyc;i++) if(color[i]==0) cyc=dfs(i);
        System.out.println("hasCycle=" + cyc);   // hasCycle=true
        System.out.println("O(V+E)");
    }
}`,
    hints:["Gray = currently on the recursion stack","Reaching a GRAY node = back edge = cycle","Mark black when fully explored"],
    testCases:run("hasCycle=true","O(V+E)") }),

  // ════════════════════ T4 — Shortest Path: Dijkstra, Bellman-Ford, Floyd-Warshall ════════════════════
  // (ex_13 Bellman-Ford & ex_14 trace already added by Section B — keep them; pm_1 kept)
  mk({ exerciseId:"java_m37_t4_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace Dijkstra relaxation",
    instructions:"Weighted graph (u-w-v): 0-4-1, 0-1-2, 2-2-1, 1-5-3, 2-8-3. Dijkstra from 0. Give the final shortest distances to nodes 0,1,2,3.",
    expectedSolution:"dist0=0\nFrom 0: dist2=1 (via 0-2), dist1=4 (via 0-1)\nFrom 2 (d=1): relax 1 → 1+2=3 < 4 → dist1=3; relax 3 → 1+8=9 → dist3=9\nFrom 1 (d=3): relax 3 → 3+5=8 < 9 → dist3=8\nFrom 3 (d=8): done\n\nDistances: 0→0, 1→3, 2→1, 3→8",
    hints:["Always expand the closest unfinalized node","Relax: if dist[u]+w < dist[v], update","A node's distance is final once popped from the min-heap"],
    testCases:txt("0→0, 1→3, 2→1, 3→8") }),

  mk({ exerciseId:"java_m37_t4_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Dijkstra shortest path (PriorityQueue)",
    instructions:"Implement Dijkstra from node 0. Graph: edges {0-1(4),0-2(1),2-1(2),1-3(5),2-3(8)} (undirected weights). Print the distance array and complexity.",
    expectedSolution:`import java.util.*;
public class Dijkstra {
    public static void main(String[] x){
        int n=4; int[][] e={{0,1,4},{0,2,1},{2,1,2},{1,3,5},{2,3,8}};
        List<int[]>[] adj=new List[n]; for(int i=0;i<n;i++) adj[i]=new ArrayList<>();
        for(int[] ed:e){ adj[ed[0]].add(new int[]{ed[1],ed[2]}); adj[ed[1]].add(new int[]{ed[0],ed[2]}); }
        int[] dist=new int[n]; Arrays.fill(dist,Integer.MAX_VALUE); dist[0]=0;
        PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[1]-b[1]); pq.add(new int[]{0,0});
        while(!pq.isEmpty()){ int[] cur=pq.poll(); int u=cur[0],d=cur[1];
            if(d>dist[u]) continue;
            for(int[] nx:adj[u]){ int v=nx[0],w=nx[1];
                if(d+w<dist[v]){ dist[v]=d+w; pq.add(new int[]{v,dist[v]}); } } }
        System.out.println(Arrays.toString(dist));  // [0, 3, 1, 8]
        System.out.println("O(E log V)");
    }
}`,
    hints:["Min-heap ordered by distance","Skip stale heap entries (d > dist[u])","Relax each neighbour and push if improved"],
    testCases:run("[0, 3, 1, 8]","O(E log V)") }),

  mk({ exerciseId:"java_m37_t4_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Floyd-Warshall all-pairs shortest paths",
    instructions:"Compute all-pairs shortest paths with Floyd-Warshall. Directed graph, 3 nodes, edges 0→1(3),1→2(1),0→2(10). Print dist[0][2] and complexity.",
    expectedSolution:`import java.util.*;
public class Floyd {
    public static void main(String[] x){
        int n=3, INF=1000000; int[][] d=new int[n][n];
        for(int[] row:d) Arrays.fill(row,INF);
        for(int i=0;i<n;i++) d[i][i]=0;
        d[0][1]=3; d[1][2]=1; d[0][2]=10;
        for(int k=0;k<n;k++) for(int i=0;i<n;i++) for(int j=0;j<n;j++)
            if(d[i][k]+d[k][j]<d[i][j]) d[i][j]=d[i][k]+d[k][j];
        System.out.println("dist[0][2]=" + d[0][2]);   // dist[0][2]=4
        System.out.println("O(V^3)");
    }
}`,
    hints:["Triple loop: intermediate k is the OUTERMOST loop","d[i][j] = min(d[i][j], d[i][k]+d[k][j])","0→1→2 = 4 beats direct 0→2 = 10"],
    testCases:run("dist[0][2]=4","O(V^3)") }),

  mk({ exerciseId:"java_m37_t4_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Network Delay Time (LeetCode #743)",
    instructions:"times=[[2,1,1],[2,3,1],[3,4,1]] (u→v(w)), n=4, k=2. Return the time for all nodes to receive the signal, or -1. Print result and complexity.",
    expectedSolution:`import java.util.*;
public class NetDelay {
    public static void main(String[] x){
        int n=4,k=2; int[][] times={{2,1,1},{2,3,1},{3,4,1}};
        List<int[]>[] adj=new List[n+1]; for(int i=1;i<=n;i++) adj[i]=new ArrayList<>();
        for(int[] t:times) adj[t[0]].add(new int[]{t[1],t[2]});
        int[] dist=new int[n+1]; Arrays.fill(dist,Integer.MAX_VALUE); dist[k]=0;
        PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[1]-b[1]); pq.add(new int[]{k,0});
        while(!pq.isEmpty()){ int[] c=pq.poll(); if(c[1]>dist[c[0]]) continue;
            for(int[] nx:adj[c[0]]) if(c[1]+nx[1]<dist[nx[0]]){ dist[nx[0]]=c[1]+nx[1]; pq.add(new int[]{nx[0],dist[nx[0]]}); } }
        int ans=0; for(int i=1;i<=n;i++) ans=Math.max(ans,dist[i]);
        System.out.println("delay=" + (ans==Integer.MAX_VALUE?-1:ans));  // delay=2
        System.out.println("O(E log V)");
    }
}`,
    hints:["Dijkstra from source k","Answer = the MAX shortest-distance (last node to hear)","Unreachable node → -1"],
    testCases:run("delay=2","O(E log V)") }),

  mk({ exerciseId:"java_m37_t4_ex_5", position:5, level:"hard", type:"code_scratch",
    title:"Path with Maximum Probability (LeetCode #1514)",
    instructions:"n=3, edges [[0,1],[1,2],[0,2]] with succProb [0.5,0.5,0.2], start=0,end=2. Return the max success probability path (modified Dijkstra, max-heap). Print probability and complexity.",
    expectedSolution:`import java.util.*;
public class MaxProb {
    public static void main(String[] x){
        int n=3; int[][] edges={{0,1},{1,2},{0,2}}; double[] prob={0.5,0.5,0.2};
        List<double[]>[] adj=new List[n]; for(int i=0;i<n;i++) adj[i]=new ArrayList<>();
        for(int i=0;i<edges.length;i++){ int u=edges[i][0],v=edges[i][1];
            adj[u].add(new double[]{v,prob[i]}); adj[v].add(new double[]{u,prob[i]}); }
        double[] best=new double[n]; best[0]=1.0;
        PriorityQueue<double[]> pq=new PriorityQueue<>((a,b)->Double.compare(b[1],a[1]));
        pq.add(new double[]{0,1.0});
        while(!pq.isEmpty()){ double[] c=pq.poll(); int u=(int)c[0]; double p=c[1];
            if(p<best[u]) continue;
            for(double[] nx:adj[u]){ int v=(int)nx[0]; double np=p*nx[1];
                if(np>best[v]){ best[v]=np; pq.add(new double[]{v,np}); } } }
        System.out.println("prob=" + best[2]);   // prob=0.25
        System.out.println("O(E log V)");
    }
}`,
    hints:["Maximise a PRODUCT of probabilities → use a MAX-heap","Relax: np = p * edgeProb, keep if larger","0→1→2 = 0.25 beats direct 0→2 = 0.2"],
    testCases:run("prob=0.25","O(E log V)") }),

  // ════════════════════ T5 — Graph Synthesis: MST, Kruskal, Union-Find ════════════════════
  mk({ exerciseId:"java_m37_t5_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace Union-Find with union by rank",
    instructions:"Start with 5 singletons {0..4}. Apply union(0,1), union(2,3), union(1,3). How many connected components remain, and are 0 and 2 connected?",
    expectedSolution:"union(0,1): {0,1} {2} {3} {4} → 4 comps\nunion(2,3): {0,1} {2,3} {4} → 3 comps\nunion(1,3): merges {0,1} with {2,3} → {0,1,2,3} {4} → 2 comps\n\nComponents: 2\nfind(0)==find(2)? YES (both in {0,1,2,3})",
    hints:["Each union merges two sets (if not already joined)","Components decrease by 1 per effective union","0 and 2 end up in the same set after union(1,3)"],
    testCases:txt("Components: 2") }),

  mk({ exerciseId:"java_m37_t5_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Union-Find with path compression + union by rank",
    instructions:"Implement DSU. Do union(0,1),union(2,3),union(1,3) on 5 elements, then print the number of components and whether find(0)==find(2). Print complexity.",
    expectedSolution:`public class DSU {
    static int[] par, rank;
    static int find(int x){ while(par[x]!=x){ par[x]=par[par[x]]; x=par[x]; } return x; }
    static boolean union(int a,int b){ int ra=find(a),rb=find(b); if(ra==rb) return false;
        if(rank[ra]<rank[rb]){ int t=ra; ra=rb; rb=t; }
        par[rb]=ra; if(rank[ra]==rank[rb]) rank[ra]++; return true; }
    public static void main(String[] x){
        int n=5; par=new int[n]; rank=new int[n]; for(int i=0;i<n;i++) par[i]=i;
        int comp=n;
        if(union(0,1)) comp--; if(union(2,3)) comp--; if(union(1,3)) comp--;
        System.out.println("components=" + comp);          // components=2
        System.out.println("sameSet(0,2)=" + (find(0)==find(2)));  // sameSet(0,2)=true
        System.out.println("near O(1) amortized");
    }
}`,
    hints:["find: follow parents to the root, compressing along the way","union by rank attaches the shorter tree under the taller","A successful union reduces component count by 1"],
    testCases:run("components=2","sameSet(0,2)=true") }),

  mk({ exerciseId:"java_m37_t5_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Kruskal's Minimum Spanning Tree",
    instructions:"Compute the MST total weight with Kruskal. 4 nodes, edges {0-1(1),1-2(2),0-2(2),2-3(3),0-3(4)}. Print total weight and complexity.",
    expectedSolution:`import java.util.*;
public class Kruskal {
    static int[] par;
    static int find(int x){ while(par[x]!=x){ par[x]=par[par[x]]; x=par[x]; } return x; }
    public static void main(String[] x){
        int n=4; int[][] e={{0,1,1},{1,2,2},{0,2,2},{2,3,3},{0,3,4}};
        Arrays.sort(e,(a,b)->a[2]-b[2]);
        par=new int[n]; for(int i=0;i<n;i++) par[i]=i;
        int total=0,used=0;
        for(int[] ed:e){ int ra=find(ed[0]),rb=find(ed[1]); if(ra!=rb){ par[ra]=rb; total+=ed[2]; used++; if(used==n-1) break; } }
        System.out.println("mstWeight=" + total);   // mstWeight=6
        System.out.println("O(E log E)");
    }
}`,
    hints:["Sort edges by weight ascending","Add an edge only if it joins two different sets (no cycle)","Stop after V-1 edges"],
    testCases:run("mstWeight=6","O(E log E)") }),

  mk({ exerciseId:"java_m37_t5_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Number of Provinces (LeetCode #547)",
    instructions:"Given isConnected={{1,1,0},{1,1,0},{0,0,1}}, return the number of provinces (connected groups of cities) using Union-Find. Print count and complexity.",
    expectedSolution:`public class Provinces {
    static int[] par;
    static int find(int x){ while(par[x]!=x){ par[x]=par[par[x]]; x=par[x]; } return x; }
    public static void main(String[] x){
        int[][] m={{1,1,0},{1,1,0},{0,0,1}}; int n=m.length;
        par=new int[n]; for(int i=0;i<n;i++) par[i]=i; int comp=n;
        for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) if(m[i][j]==1){ int a=find(i),b=find(j); if(a!=b){ par[a]=b; comp--; } }
        System.out.println("provinces=" + comp);   // provinces=2
        System.out.println("O(N^2)");
    }
}`,
    hints:["Each city is a node; m[i][j]==1 is an edge","Union connected cities","Provinces = remaining components"],
    testCases:run("provinces=2","O(N^2)") }),

  mk({ exerciseId:"java_m37_t5_ex_5", position:5, level:"hard", type:"code_scratch",
    title:"Min Cost to Connect All Points (LeetCode #1584)",
    instructions:"points=[[0,0],[2,2],[3,10]]. Connect all with minimum total Manhattan-distance edges (Prim's or Kruskal MST). Print total cost and complexity.",
    expectedSolution:`import java.util.*;
public class ConnectPoints {
    public static void main(String[] x){
        int[][] p={{0,0},{2,2},{3,10}}; int n=p.length;
        boolean[] in=new boolean[n]; int[] minD=new int[n]; Arrays.fill(minD,Integer.MAX_VALUE);
        minD[0]=0; int total=0;
        for(int it=0;it<n;it++){ int u=-1;
            for(int i=0;i<n;i++) if(!in[i] && (u==-1||minD[i]<minD[u])) u=i;
            in[u]=true; total+=minD[u];
            for(int v=0;v<n;v++) if(!in[v]){ int d=Math.abs(p[u][0]-p[v][0])+Math.abs(p[u][1]-p[v][1]); if(d<minD[v]) minD[v]=d; } }
        System.out.println("cost=" + total);   // cost=13
        System.out.println("O(N^2)");
    }
}`,
    hints:["Edge weight = Manhattan distance |dx|+|dy|","Prim's: repeatedly add the cheapest edge to the growing tree","0-1 dist=4, 1-2 dist=9 → total 13? Recompute: 0-1=4, then nearest to {0,1} is 2 via 1 = |2-3|+|2-10|=9 → 13. But 0-2=13. MST=4+9=13"],
    testCases:run("cost=13","O(N^2)") }),
];

// IDs to KEEP (do not delete): all of the above + each topic's pm_1 + T4 Section-B ex_13/ex_14.
const KEEP = new Set([
  ...EXERCISES.map(e => e.exerciseId),
  "java_m37_t1_pm_1","java_m37_t2_pm_1","java_m37_t3_pm_1","java_m37_t4_pm_1","java_m37_t5_pm_1",
  "java_m37_t4_ex_13","java_m37_t4_ex_14",
]);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const E = mongoose.connection.collection("proexercises");

  // 1. Overwrite/insert the topic-specific exercises
  for (const e of EXERCISES) {
    await E.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
  }
  console.log(`✓ ${EXERCISES.length} topic-specific exercises written`);

  // 2. Delete leftover duplicate slots in this module not in KEEP
  const all = await E.find({ moduleId: MODULE_ID }, { projection: { exerciseId: 1 } }).toArray();
  const toDelete = all.map(d => d.exerciseId).filter(id => !KEEP.has(id));
  if (toDelete.length) {
    await E.deleteMany({ exerciseId: { $in: toDelete } });
    console.log(`✓ deleted ${toDelete.length} leftover duplicate slots`);
  }

  // 3. Report
  const total = await E.countDocuments({ moduleId: MODULE_ID });
  const titles = new Set((await E.find({ moduleId: MODULE_ID }, { projection: { title: 1 } }).toArray()).map(d => d.title));
  console.log(`\n✅ M37 re-authored. ${total} docs, ${titles.size} distinct titles.`);
  await mongoose.disconnect();
}
main().catch((err) => { console.error(err); process.exit(1); });
