/**
 * reauthorM40Backtracking.js — Fix duplicate-exercise bug in M40 (Backtracking).
 * Overwrites duplicated ex_1..ex_N per topic with topic-specific content; deletes
 * leftover duplicate slots. No pm_ to preserve. Idempotent.
 * Usage: node config/reauthorM40Backtracking.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const MODULE_ID = "java_m40";
const DIFF = { warmup:0.17, easy:0.40, medium:0.65, hard:0.90 }, XP = { warmup:10, easy:15, medium:20, hard:30 };
function mk(o){ const topicId=o.exerciseId.replace(/_(ex|pm)_\d+$/,"");
  return { exerciseId:o.exerciseId, topicId, moduleId:MODULE_ID, trackKey:"pro_java", position:o.position,
    level:o.level, type:o.type, title:o.title, scenario:o.scenario||"", instructions:o.instructions,
    starterCode:o.starterCode||"", expectedSolution:o.expectedSolution, blanks:[], testCases:o.testCases,
    hints:o.hints, difficulty:DIFF[o.level]??0.5, xpReward:XP[o.level]??15 }; }
const run=(...s)=>[{type:"execution",expected_stdout_contains:s}];
const txt=(e)=>[{type:"text_match",expected:e}];

const EXERCISES = [
  // ═══ T1 — Backtracking Template: Choose, Explore, Undo ═══
  mk({ exerciseId:"java_m40_t1_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace the choose / explore / undo template on subsets of [1,2]",
    instructions:"Backtracking generates all subsets of [1,2] by, at each index, exploring 'skip' then 'take'. List the subsets produced (in generation order).",
    expectedSolution:"start []:\n  include 1 → [1]\n    include 2 → [1,2]   (record)\n    undo 2 → [1]          (record on entry)\n  undo 1 → []\n  include 2 → [2]         (record)\nWith 'record at every node': [], [1], [1,2], [2]\n\nSubsets: [], [1], [1,2], [2]  (4 total = 2^2)",
    hints:["Each element: choose to include or not","Record the current partial at each node","Undo the choice before trying the next branch"],
    testCases:txt("[], [1], [1,2], [2]") }),
  mk({ exerciseId:"java_m40_t1_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Generate All Subsets (Power Set)",
    instructions:"Generate all subsets of [1,2,3] with backtracking and print HOW MANY there are, plus the complexity.",
    expectedSolution:`import java.util.*;
public class Subsets {
    static List<List<Integer>> res=new ArrayList<>();
    static void bt(int[] a,int i,List<Integer> cur){ if(i==a.length){ res.add(new ArrayList<>(cur)); return; }
        bt(a,i+1,cur);                       // skip
        cur.add(a[i]); bt(a,i+1,cur); cur.remove(cur.size()-1); }  // take + undo
    public static void main(String[] x){ bt(new int[]{1,2,3},0,new ArrayList<>());
        System.out.println("count=" + res.size()); System.out.println("O(2^n)"); }
}`,
    hints:["At each index: skip or take","2 choices per element → 2^n subsets","Undo (remove last) after the 'take' branch"],
    testCases:run("count=8","O(2^n)") }),
  mk({ exerciseId:"java_m40_t1_ex_3", position:3, level:"easy", type:"code_scratch",
    title:"Count Leaf Paths in a Decision Tree",
    instructions:"With k=2 choices at each of n=3 levels, count the number of complete root-to-leaf decision paths via backtracking. Print the count and complexity.",
    expectedSolution:`public class DecisionPaths {
    static int count=0;
    static void bt(int level,int n,int k){ if(level==n){ count++; return; } for(int c=0;c<k;c++) bt(level+1,n,k); }
    public static void main(String[] x){ bt(0,3,2); System.out.println("paths=" + count); System.out.println("O(k^n)"); }
}`,
    hints:["k branches per level, n levels","Leaves = k^n","Count when level == n"],
    testCases:run("paths=8","O(k^n)") }),

  // ═══ T2 — Permutations, Combinations, Subsets ═══
  mk({ exerciseId:"java_m40_t2_ex_1", position:1, level:"easy", type:"code_scratch",
    title:"All Permutations (LeetCode #46)",
    instructions:"Generate all permutations of [1,2,3] with backtracking. Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class Permutations {
    static int count=0;
    static void bt(int[] a,boolean[] used,int depth){ if(depth==a.length){ count++; return; }
        for(int i=0;i<a.length;i++) if(!used[i]){ used[i]=true; bt(a,used,depth+1); used[i]=false; } }
    public static void main(String[] x){ int[] a={1,2,3}; bt(a,new boolean[a.length],0);
        System.out.println("count=" + count); System.out.println("O(n!)"); }
}`,
    hints:["Track used[] elements","Pick each unused element at each depth","n! permutations"],
    testCases:run("count=6","O(n!)") }),
  mk({ exerciseId:"java_m40_t2_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Combinations (LeetCode #77)",
    instructions:"Generate all C(n,k) combinations for n=4, k=2 with backtracking. Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class Combinations {
    static int count=0;
    static void bt(int start,int n,int k,int chosen){ if(chosen==k){ count++; return; }
        for(int i=start;i<=n;i++) bt(i+1,n,k,chosen+1); }
    public static void main(String[] x){ bt(1,4,2,0); System.out.println("count=" + count); System.out.println("O(C(n,k))"); }
}`,
    hints:["Use a start index to avoid duplicates","Pick k elements in increasing order","C(4,2)=6"],
    testCases:run("count=6","O(C(n,k))") }),
  mk({ exerciseId:"java_m40_t2_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Combination Sum (LeetCode #39)",
    instructions:"Count distinct combinations (reuse allowed) of [2,3,6,7] summing to 7. Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class CombinationSum {
    static int count=0;
    static void bt(int[] c,int start,int rem){ if(rem==0){ count++; return; } if(rem<0) return;
        for(int i=start;i<c.length;i++) bt(c,i,rem-c[i]); }   // i (not i+1) → reuse allowed
    public static void main(String[] x){ bt(new int[]{2,3,6,7},0,7);
        System.out.println("count=" + count); System.out.println("O(2^target)"); }
}`,
    hints:["Pass i (not i+1) to allow reusing a candidate","Prune when remaining < 0","[2,2,3] and [7] → 2 combinations"],
    testCases:run("count=2","O(2^target)") }),
  mk({ exerciseId:"java_m40_t2_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Subsets II — with duplicates (LeetCode #90)",
    instructions:"Count unique subsets of [1,2,2] (no duplicate subsets). Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class SubsetsII {
    static int count=0;
    static void bt(int[] a,int start,List<Integer> cur){ count++;
        for(int i=start;i<a.length;i++){ if(i>start&&a[i]==a[i-1]) continue;  // skip duplicate at same level
            cur.add(a[i]); bt(a,i+1,cur); cur.remove(cur.size()-1); } }
    public static void main(String[] x){ int[] a={1,2,2}; Arrays.sort(a); bt(a,0,new ArrayList<>());
        System.out.println("count=" + count); System.out.println("O(2^n)"); }
}`,
    hints:["Sort first so duplicates are adjacent","Skip a[i]==a[i-1] when i>start (same tree level)","Unique subsets of [1,2,2] = 6"],
    testCases:run("count=6","O(2^n)") }),

  // ═══ T3 — Sudoku and N-Queens: Constraint Satisfaction ═══
  mk({ exerciseId:"java_m40_t3_ex_1", position:1, level:"medium", type:"code_scratch",
    title:"N-Queens — count solutions for n=4 (LeetCode #51/#52)",
    instructions:"Count the number of distinct solutions to the 4-Queens problem with backtracking. Print the count and complexity.",
    expectedSolution:`public class NQueens4 {
    static int n=4,count=0; static boolean[] col,d1,d2;
    static void bt(int r){ if(r==n){ count++; return; }
        for(int c=0;c<n;c++){ int x=r+c,y=r-c+n;
            if(col[c]||d1[x]||d2[y]) continue;
            col[c]=d1[x]=d2[y]=true; bt(r+1); col[c]=d1[x]=d2[y]=false; } }
    public static void main(String[] a){ col=new boolean[n]; d1=new boolean[2*n]; d2=new boolean[2*n];
        bt(0); System.out.println("solutions=" + count); System.out.println("O(n!)"); }
}`,
    hints:["Place one queen per row","Track attacked columns and both diagonals (r+c, r-c)","4-Queens has 2 solutions"],
    testCases:run("solutions=2","O(n!)") }),
  mk({ exerciseId:"java_m40_t3_ex_2", position:2, level:"hard", type:"code_scratch",
    title:"N-Queens — count solutions for n=8",
    instructions:"Count distinct 8-Queens solutions. Print the count and complexity.",
    expectedSolution:`public class NQueens8 {
    static int n=8,count=0; static boolean[] col,d1,d2;
    static void bt(int r){ if(r==n){ count++; return; }
        for(int c=0;c<n;c++){ int x=r+c,y=r-c+n;
            if(col[c]||d1[x]||d2[y]) continue;
            col[c]=d1[x]=d2[y]=true; bt(r+1); col[c]=d1[x]=d2[y]=false; } }
    public static void main(String[] a){ col=new boolean[n]; d1=new boolean[2*n]; d2=new boolean[2*n];
        bt(0); System.out.println("solutions=" + count); System.out.println("O(n!)"); }
}`,
    hints:["Same as 4-Queens with n=8","Diagonal indices: r+c (0..2n-2) and r-c+n","8-Queens has 92 solutions"],
    testCases:run("solutions=92","O(n!)") }),
  mk({ exerciseId:"java_m40_t3_ex_3", position:3, level:"hard", type:"code_scratch",
    title:"Sudoku Solver (LeetCode #37)",
    instructions:"Solve a Sudoku board in place with backtracking. After solving the given board, print whether it is solved and the value at cell (0,0). Print complexity.",
    expectedSolution:`public class Sudoku {
    static boolean ok(char[][] b,int r,int c,char v){ for(int i=0;i<9;i++){ if(b[r][i]==v||b[i][c]==v) return false;
        if(b[3*(r/3)+i/3][3*(c/3)+i%3]==v) return false; } return true; }
    static boolean solve(char[][] b){ for(int r=0;r<9;r++) for(int c=0;c<9;c++) if(b[r][c]=='.'){
        for(char v='1';v<='9';v++) if(ok(b,r,c,v)){ b[r][c]=v; if(solve(b)) return true; b[r][c]='.'; } return false; } return true; }
    public static void main(String[] x){ char[][] b={
        "53..7....".toCharArray(),"6..195...".toCharArray(),".98....6.".toCharArray(),
        "8...6...3".toCharArray(),"4..8.3..1".toCharArray(),"7...2...6".toCharArray(),
        ".6....28.".toCharArray(),"...419..5".toCharArray(),"....8..79".toCharArray()};
        boolean done=solve(b);
        System.out.println("solved=" + done + " cell00=" + b[0][0]); System.out.println("O(9^cells)"); }
}`,
    hints:["Find an empty cell, try digits 1-9 that don't conflict","Recurse; undo if the branch fails","The classic board's (0,0) stays 5"],
    testCases:run("solved=true cell00=5","O(9^cells)") }),

  // ═══ T4 — Word Search: Grid Backtracking ═══
  mk({ exerciseId:"java_m40_t4_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Why grid backtracking marks-and-unmarks cells",
    instructions:"In Word Search, before recursing into a neighbour we set board[r][c]='#', and we restore it afterward. Why is the RESTORE essential?",
    expectedSolution:"Marking '#' prevents reusing the same cell within the CURRENT path (a letter can't be used twice in one match).\n\nRestoring it on the way back (un-marking) frees the cell for OTHER paths that branch differently. Without the restore, a cell consumed by one failed/parallel attempt would be permanently blocked, causing valid matches to be missed.\n\nThis is the 'undo' step of choose→explore→undo applied to a grid.",
    hints:["Mark = don't reuse a cell in the current word path","Unmark = let sibling/other paths use it","It's the backtracking 'undo' on a grid"],
    testCases:txt("restore") }),
  mk({ exerciseId:"java_m40_t4_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Word Search (LeetCode #79)",
    instructions:"Return whether a word exists in the grid via 4-dir backtracking (each cell once). Test board {{A,B,C,E},{S,F,C,S},{A,D,E,E}}, word=\"ABCCED\". Print true/false and complexity.",
    expectedSolution:`public class WordSearch {
    static int R,C; static char[][] b;
    static boolean dfs(int r,int c,String w,int i){ if(i==w.length()) return true;
        if(r<0||r>=R||c<0||c>=C||b[r][c]!=w.charAt(i)) return false;
        char t=b[r][c]; b[r][c]='#';
        boolean f=dfs(r+1,c,w,i+1)||dfs(r-1,c,w,i+1)||dfs(r,c+1,w,i+1)||dfs(r,c-1,w,i+1);
        b[r][c]=t; return f; }
    public static void main(String[] x){ b=new char[][]{{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};
        R=b.length; C=b[0].length; boolean found=false;
        for(int r=0;r<R&&!found;r++) for(int c=0;c<C&&!found;c++) found=dfs(r,c,"ABCCED",0);
        System.out.println("found=" + found); System.out.println("O(R*C*4^L)"); }
}`,
    hints:["DFS from each cell; match characters in order","Mark visited with '#', restore on return","Try all 4 directions"],
    testCases:run("found=true","O(R*C*4^L)") }),
  mk({ exerciseId:"java_m40_t4_ex_3", position:3, level:"hard", type:"code_scratch",
    title:"Count Paths in a Maze (grid backtracking)",
    instructions:"Count paths from top-left to bottom-right of a grid moving only right/down through open cells (0=open,1=wall). Test {{0,0,0},{0,1,0},{0,0,0}}. Print the path count and complexity.",
    expectedSolution:`public class MazePaths {
    static int R,C,count=0; static int[][] g;
    static void bt(int r,int c){ if(r<0||r>=R||c<0||c>=C||g[r][c]==1) return;
        if(r==R-1&&c==C-1){ count++; return; } bt(r+1,c); bt(r,c+1); }
    public static void main(String[] x){ g=new int[][]{{0,0,0},{0,1,0},{0,0,0}}; R=g.length; C=g[0].length;
        bt(0,0); System.out.println("paths=" + count); System.out.println("O(2^(R+C))"); }
}`,
    hints:["From each cell, branch right and down","Walls and out-of-bounds end a branch","Count when reaching the bottom-right; here 2 paths"],
    testCases:run("paths=2","O(2^(R+C))") }),

  // ═══ T5 — Backtracking Synthesis: Patterns and Optimizations ═══
  mk({ exerciseId:"java_m40_t5_ex_1", position:1, level:"medium", type:"code_scratch",
    title:"Letter Combinations of a Phone Number (LeetCode #17)",
    instructions:"Count letter combinations for the digits \"23\" (2→abc, 3→def). Print the count and complexity.",
    expectedSolution:`public class LetterCombos {
    static String[] map={"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"};
    static int count=0;
    static void bt(String d,int i){ if(i==d.length()){ count++; return; }
        for(char ch:map[d.charAt(i)-'0'].toCharArray()) bt(d,i+1); }
    public static void main(String[] x){ bt("23",0); System.out.println("count=" + count); System.out.println("O(4^n)"); }
}`,
    hints:["Each digit maps to 3-4 letters","Branch over each letter for each digit","\"23\" → 3*3 = 9"],
    testCases:run("count=9","O(4^n)") }),
  mk({ exerciseId:"java_m40_t5_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Palindrome Partitioning (LeetCode #131)",
    instructions:"Count the ways to partition \"aab\" into palindromic substrings. Print the count and complexity.",
    expectedSolution:`public class PalPartition {
    static int count=0;
    static boolean pal(String s,int l,int r){ while(l<r) if(s.charAt(l++)!=s.charAt(r--)) return false; return true; }
    static void bt(String s,int start){ if(start==s.length()){ count++; return; }
        for(int end=start;end<s.length();end++) if(pal(s,start,end)) bt(s,end+1); }
    public static void main(String[] x){ bt("aab",0); System.out.println("count=" + count); System.out.println("O(2^n * n)"); }
}`,
    hints:["Try every prefix that is a palindrome, then recurse on the rest","\"aab\" → [a,a,b] and [aa,b] = 2","Check palindrome with two pointers"],
    testCases:run("count=2","O(2^n * n)") }),
  mk({ exerciseId:"java_m40_t5_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Generate Parentheses (LeetCode #22)",
    instructions:"Count valid combinations of n=3 pairs of parentheses via backtracking with pruning. Print the count and complexity.",
    expectedSolution:`public class GenParens {
    static int count=0;
    static void bt(int open,int close,int n){ if(open==n&&close==n){ count++; return; }
        if(open<n) bt(open+1,close,n);
        if(close<open) bt(open,close+1,n); }
    public static void main(String[] x){ bt(0,0,3); System.out.println("count=" + count); System.out.println("O(Catalan(n))"); }
}`,
    hints:["Add '(' while open<n","Add ')' only while close<open (validity pruning)","n=3 → 5 (the 3rd Catalan number)"],
    testCases:run("count=5","O(Catalan(n))") }),
  mk({ exerciseId:"java_m40_t5_ex_4", position:4, level:"easy", type:"predict_output",
    title:"Pruning: the key to fast backtracking",
    instructions:"Name three pruning techniques that make backtracking practical, with a one-line example each.",
    expectedSolution:"1. CONSTRAINT pruning — abandon a branch the moment it violates a rule (N-Queens: skip a column/diagonal already attacked).\n2. BOUND pruning — stop if the partial can't beat the best so far (branch-and-bound).\n3. DUPLICATE pruning — sort + skip equal siblings (Subsets II: skip a[i]==a[i-1] at the same level).\n\nWithout pruning, backtracking explores the full exponential tree; pruning cuts whole subtrees early.",
    hints:["Cut branches that can't lead to a valid/better answer","Constraint checks, bounds, and duplicate-skipping","Pruning early near the root saves the most work"],
    testCases:txt("CONSTRAINT") }),
];

const KEEP = new Set(EXERCISES.map(e => e.exerciseId));
async function main(){ await mongoose.connect(process.env.MONGO_URI); const E=mongoose.connection.collection("proexercises");
  for(const e of EXERCISES) await E.updateOne({exerciseId:e.exerciseId},{$set:e},{upsert:true});
  console.log(`✓ ${EXERCISES.length} topic-specific exercises written`);
  const all=await E.find({moduleId:MODULE_ID},{projection:{exerciseId:1}}).toArray();
  const del=all.map(d=>d.exerciseId).filter(id=>!KEEP.has(id));
  if(del.length){ await E.deleteMany({exerciseId:{$in:del}}); console.log(`✓ deleted ${del.length} leftover duplicate slots`); }
  const total=await E.countDocuments({moduleId:MODULE_ID});
  const titles=new Set((await E.find({moduleId:MODULE_ID},{projection:{title:1}}).toArray()).map(d=>d.title));
  console.log(`\n✅ M40 re-authored. ${total} docs, ${titles.size} distinct titles.`);
  await mongoose.disconnect(); }
main().catch(e=>{console.error(e);process.exit(1);});
