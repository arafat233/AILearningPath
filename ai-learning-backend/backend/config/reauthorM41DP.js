/**
 * reauthorM41DP.js — Fix duplicate-exercise bug in M41 (Dynamic Programming).
 * Overwrites duplicated ex_1..ex_N per topic with topic-specific content; KEEPS
 * each topic's pm_1 (pattern_match); deletes leftover duplicate slots. Idempotent.
 * Usage: node config/reauthorM41DP.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const MODULE_ID = "java_m41";
const DIFF = { warmup:0.17, easy:0.40, medium:0.65, hard:0.90 }, XP = { warmup:10, easy:15, medium:20, hard:30 };
function mk(o){ const topicId=o.exerciseId.replace(/_(ex|pm)_\d+$/,"");
  return { exerciseId:o.exerciseId, topicId, moduleId:MODULE_ID, trackKey:"pro_java", position:o.position,
    level:o.level, type:o.type, title:o.title, scenario:o.scenario||"", instructions:o.instructions,
    starterCode:o.starterCode||"", expectedSolution:o.expectedSolution, blanks:[], testCases:o.testCases,
    hints:o.hints, difficulty:DIFF[o.level]??0.5, xpReward:XP[o.level]??15 }; }
const run=(...s)=>[{type:"execution",expected_stdout_contains:s}];
const txt=(e)=>[{type:"text_match",expected:e}];

const EXERCISES = [
  // ═══ T1 — DP Fundamentals: Memoization, Tabulation, Optimal Substructure ═══
  mk({ exerciseId:"java_m41_t1_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Memoization vs tabulation — same recurrence",
    instructions:"Fibonacci: F(n)=F(n-1)+F(n-2). Contrast top-down memoization with bottom-up tabulation. What do both turn the O(2^n) naive recursion into, and what's the space difference?",
    expectedSolution:"Both apply the SAME recurrence but cache results → O(n) time (each F(i) computed once).\n\nMemoization (top-down): recursion + a cache map/array; O(n) space for cache + O(n) recursion stack.\nTabulation (bottom-up): fill an array F[0..n] iteratively; O(n) space, no recursion stack — and can often be reduced to O(1) by keeping only the last two values.\n\nNaive O(2^n) → O(n) once overlapping subproblems are cached.",
    hints:["Overlapping subproblems → cache them","Top-down recurses + memo; bottom-up fills a table","Tabulation can drop to O(1) space for 1D rolling"],
    testCases:txt("O(n)") }),
  mk({ exerciseId:"java_m41_t1_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Fibonacci — O(1) space tabulation",
    instructions:"Compute F(10) (F(0)=0,F(1)=1) with O(1) space. Print the value and complexity.",
    expectedSolution:`public class Fib {
    public static void main(String[] x){ int n=10; if(n<2){ System.out.println("fib=" + n); return; }
        int a=0,b=1; for(int i=2;i<=n;i++){ int c=a+b; a=b; b=c; }
        System.out.println("fib=" + b); System.out.println("O(n) time, O(1) space"); }
}`,
    hints:["Keep only the last two values","Roll them forward n-1 times","F(10)=55"],
    testCases:run("fib=55","O(n) time, O(1) space") }),
  mk({ exerciseId:"java_m41_t1_ex_3", position:3, level:"easy", type:"code_scratch",
    title:"Climbing Stairs (LeetCode #70)",
    instructions:"Count distinct ways to climb n stairs taking 1 or 2 steps. Test n=5. Print the count and complexity.",
    expectedSolution:`public class ClimbStairs {
    public static void main(String[] x){ int n=5,a=1,b=1; for(int i=2;i<=n;i++){ int c=a+b; a=b; b=c; }
        System.out.println("ways=" + b); System.out.println("O(n) time, O(1) space"); }
}`,
    hints:["ways(n)=ways(n-1)+ways(n-2) — it's Fibonacci","Base: ways(0)=ways(1)=1","n=5 → 8"],
    testCases:run("ways=8","O(n) time, O(1) space") }),
  mk({ exerciseId:"java_m41_t1_ex_4", position:4, level:"easy", type:"code_scratch",
    title:"Min Cost Climbing Stairs (LeetCode #746)",
    instructions:"Each step has a cost; you may start at index 0 or 1 and climb 1 or 2 at a time. Min cost to reach the top. Test cost=[10,15,20]. Print the min cost and complexity.",
    expectedSolution:`public class MinCostStairs {
    public static void main(String[] x){ int[] c={10,15,20}; int n=c.length,a=0,b=0;
        for(int i=2;i<=n;i++){ int cur=Math.min(b+c[i-1],a+c[i-2]); a=b; b=cur; }
        System.out.println("minCost=" + b); System.out.println("O(n) time, O(1) space"); }
}`,
    hints:["dp[i]=min(dp[i-1]+cost[i-1], dp[i-2]+cost[i-2])","Top is index n (beyond the last step)","[10,15,20] → 15 (start at 1, pay 15, step 2 to top)"],
    testCases:run("minCost=15","O(n) time, O(1) space") }),

  // ═══ T2 — 1D DP: House Robber, Coin Change, LIS, Jump Game ═══
  mk({ exerciseId:"java_m41_t2_ex_1", position:1, level:"easy", type:"code_scratch",
    title:"House Robber (LeetCode #198)",
    instructions:"Max sum of non-adjacent houses. Test [2,7,9,3,1]. Print the max and complexity.",
    expectedSolution:`public class HouseRobber {
    public static void main(String[] x){ int[] a={2,7,9,3,1}; int prev=0,cur=0;
        for(int v:a){ int t=Math.max(cur,prev+v); prev=cur; cur=t; }
        System.out.println("max=" + cur); System.out.println("O(n) time, O(1) space"); }
}`,
    hints:["dp[i]=max(dp[i-1], dp[i-2]+a[i])","Either skip this house or rob it + dp two back","[2,_,9,_,1] → 2+9+1 = 12"],
    testCases:run("max=12","O(n) time, O(1) space") }),
  mk({ exerciseId:"java_m41_t2_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Coin Change (LeetCode #322)",
    instructions:"Fewest coins to make an amount (unbounded). Test coins=[1,2,5], amount=11. Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class CoinChange {
    public static void main(String[] x){ int[] coins={1,2,5}; int amt=11;
        int[] dp=new int[amt+1]; Arrays.fill(dp,amt+1); dp[0]=0;
        for(int a=1;a<=amt;a++) for(int c:coins) if(c<=a) dp[a]=Math.min(dp[a],dp[a-c]+1);
        System.out.println("coins=" + (dp[amt]>amt?-1:dp[amt])); System.out.println("O(amount*coins)"); }
}`,
    hints:["dp[a]=min over coins of dp[a-coin]+1","Initialize to amount+1 (infinity)","11 = 5+5+1 → 3 coins"],
    testCases:run("coins=3","O(amount*coins)") }),
  mk({ exerciseId:"java_m41_t2_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Longest Increasing Subsequence (LeetCode #300)",
    instructions:"Length of the LIS. Test [10,9,2,5,3,7,101,18]. Print the length and complexity (O(n²) DP is fine).",
    expectedSolution:`import java.util.*;
public class LIS {
    public static void main(String[] x){ int[] a={10,9,2,5,3,7,101,18}; int n=a.length;
        int[] dp=new int[n]; Arrays.fill(dp,1); int best=1;
        for(int i=1;i<n;i++) for(int j=0;j<i;j++) if(a[j]<a[i]) dp[i]=Math.max(dp[i],dp[j]+1);
        for(int v:dp) best=Math.max(best,v);
        System.out.println("lis=" + best); System.out.println("O(n^2)"); }
}`,
    hints:["dp[i]=longest increasing subseq ending at i","dp[i]=max(dp[j]+1) for j<i with a[j]<a[i]","[2,3,7,101] or [2,5,7,18] → length 4"],
    testCases:run("lis=4","O(n^2)") }),
  mk({ exerciseId:"java_m41_t2_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Jump Game (LeetCode #55)",
    instructions:"Can you reach the last index? a[i] = max jump from i. Test [2,3,1,1,4]. Print true/false and complexity.",
    expectedSolution:`public class JumpGame {
    public static void main(String[] x){ int[] a={2,3,1,1,4}; int reach=0;
        for(int i=0;i<a.length;i++){ if(i>reach){ System.out.println("canReach=false"); return; } reach=Math.max(reach,i+a[i]); }
        System.out.println("canReach=true"); System.out.println("O(n) greedy"); }
}`,
    hints:["Track the furthest reachable index","If i ever exceeds reach, you're stuck","Greedy O(n) beats O(n²) DP here"],
    testCases:run("canReach=true","O(n) greedy") }),

  // ═══ T3 — 2D DP: Grid Paths, Edit Distance, Knapsack ═══
  mk({ exerciseId:"java_m41_t3_ex_1", position:1, level:"easy", type:"code_scratch",
    title:"Unique Paths (LeetCode #62)",
    instructions:"Count paths from top-left to bottom-right of an m×n grid (right/down only). Test m=3, n=7. Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class UniquePaths {
    public static void main(String[] x){ int m=3,n=7; int[] dp=new int[n]; Arrays.fill(dp,1);
        for(int r=1;r<m;r++) for(int c=1;c<n;c++) dp[c]+=dp[c-1];
        System.out.println("paths=" + dp[n-1]); System.out.println("O(m*n)"); }
}`,
    hints:["dp[c] += dp[c-1] (above + left)","First row/col all 1s","3×7 → 28"],
    testCases:run("paths=28","O(m*n)") }),
  mk({ exerciseId:"java_m41_t3_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Edit Distance (LeetCode #72)",
    instructions:"Min insert/delete/replace to convert word1 to word2. Test \"horse\"→\"ros\". Print the distance and complexity.",
    expectedSolution:`public class EditDistance {
    public static void main(String[] x){ String a="horse",b="ros"; int m=a.length(),n=b.length();
        int[][] dp=new int[m+1][n+1]; for(int i=0;i<=m;i++) dp[i][0]=i; for(int j=0;j<=n;j++) dp[0][j]=j;
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)
            dp[i][j]=a.charAt(i-1)==b.charAt(j-1)?dp[i-1][j-1]
                :1+Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1]));
        System.out.println("dist=" + dp[m][n]); System.out.println("O(m*n)"); }
}`,
    hints:["Match → diagonal; else 1+min(replace,delete,insert)","Base: dp[i][0]=i, dp[0][j]=j","horse→ros = 3"],
    testCases:run("dist=3","O(m*n)") }),
  mk({ exerciseId:"java_m41_t3_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"0/1 Knapsack",
    instructions:"Max value with capacity W, each item used once. weights=[1,3,4,5], values=[1,4,5,7], W=7. Print the max value and complexity.",
    expectedSolution:`public class Knapsack {
    public static void main(String[] x){ int[] wt={1,3,4,5},val={1,4,5,7}; int W=7,n=wt.length;
        int[] dp=new int[W+1];
        for(int i=0;i<n;i++) for(int w=W;w>=wt[i];w--) dp[w]=Math.max(dp[w],dp[w-wt[i]]+val[i]);
        System.out.println("maxValue=" + dp[W]); System.out.println("O(n*W)"); }
}`,
    hints:["1D dp[w], iterate weight DOWNWARD for 0/1 (each item once)","dp[w]=max(dp[w], dp[w-wt]+val)","items wt3+wt4 → val4+val5 = 9"],
    testCases:run("maxValue=9","O(n*W)") }),
  mk({ exerciseId:"java_m41_t3_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Longest Common Subsequence (LeetCode #1143)",
    instructions:"Length of the LCS of two strings. Test \"abcde\" and \"ace\". Print the length and complexity.",
    expectedSolution:`public class LCS {
    public static void main(String[] x){ String a="abcde",b="ace"; int m=a.length(),n=b.length();
        int[][] dp=new int[m+1][n+1];
        for(int i=1;i<=m;i++) for(int j=1;j<=n;j++)
            dp[i][j]=a.charAt(i-1)==b.charAt(j-1)?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
        System.out.println("lcs=" + dp[m][n]); System.out.println("O(m*n)"); }
}`,
    hints:["Match → diagonal+1; else max(left, above)","Base row/col are 0","abcde & ace → 'ace' length 3"],
    testCases:run("lcs=3","O(m*n)") }),

  // ═══ T4 — Tree DP, Interval DP ═══
  mk({ exerciseId:"java_m41_t4_ex_1", position:1, level:"hard", type:"code_scratch",
    title:"House Robber III (LeetCode #337) — tree DP",
    instructions:"Rob a binary tree where no two directly-linked houses can both be robbed. Build tree [3,2,3,null,3,null,1] and print the max and complexity.",
    expectedSolution:`public class HouseRobber3 {
    static class N{ int v; N l,r; N(int v){this.v=v;} }
    static int[] rob(N n){ if(n==null) return new int[]{0,0};
        int[] L=rob(n.l),R=rob(n.r);
        int withN=n.v+L[1]+R[1];                 // rob n → skip children
        int withoutN=Math.max(L[0],L[1])+Math.max(R[0],R[1]);
        return new int[]{withN,withoutN}; }
    public static void main(String[] x){ N root=new N(3); root.l=new N(2); root.r=new N(3);
        root.l.r=new N(3); root.r.r=new N(1);
        int[] r=rob(root); System.out.println("max=" + Math.max(r[0],r[1])); System.out.println("O(n)"); }
}`,
    hints:["Each node returns {robThis, skipThis}","robThis = node.val + skip(left) + skip(right)","3 + 3 + 1 = 7"],
    testCases:run("max=7","O(n)") }),
  mk({ exerciseId:"java_m41_t4_ex_2", position:2, level:"hard", type:"code_scratch",
    title:"Burst Balloons (LeetCode #312) — interval DP",
    instructions:"Max coins from bursting all balloons (coins = left*cur*right of the chosen-last balloon in each interval). Test [3,1,5,8]. Print the max and complexity.",
    expectedSolution:`public class BurstBalloons {
    public static void main(String[] x){ int[] nums={3,1,5,8}; int n=nums.length;
        int[] a=new int[n+2]; a[0]=1; a[n+1]=1; for(int i=0;i<n;i++) a[i+1]=nums[i];
        int[][] dp=new int[n+2][n+2];
        for(int len=1;len<=n;len++) for(int l=1;l+len-1<=n;l++){ int r=l+len-1;
            for(int k=l;k<=r;k++) dp[l][r]=Math.max(dp[l][r], dp[l][k-1]+a[l-1]*a[k]*a[r+1]+dp[k+1][r]); }
        System.out.println("maxCoins=" + dp[1][n]); System.out.println("O(n^3)"); }
}`,
    hints:["dp[l][r] = max coins bursting all balloons in (l,r)","Pick k as the LAST burst → a[l-1]*a[k]*a[r+1]","Pad with 1s on both ends; [3,1,5,8] → 167"],
    testCases:run("maxCoins=167","O(n^3)") }),
  mk({ exerciseId:"java_m41_t4_ex_3", position:3, level:"hard", type:"code_scratch",
    title:"Matrix Chain Multiplication — interval DP",
    instructions:"Given matrix dimensions p=[1,2,3,4] (matrices A1:1×2, A2:2×3, A3:3×4), find the minimum scalar multiplications to multiply the chain. Print the min and complexity.",
    expectedSolution:`public class MatrixChain {
    public static void main(String[] x){ int[] p={1,2,3,4}; int n=p.length-1;  // n matrices
        int[][] dp=new int[n+1][n+1];
        for(int len=2;len<=n;len++) for(int i=1;i+len-1<=n;i++){ int j=i+len-1; dp[i][j]=Integer.MAX_VALUE;
            for(int k=i;k<j;k++) dp[i][j]=Math.min(dp[i][j], dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j]); }
        System.out.println("minMult=" + dp[1][n]); System.out.println("O(n^3)"); }
}`,
    hints:["dp[i][j] = min cost to multiply matrices i..j","Split at k: dp[i][k]+dp[k+1][j]+p[i-1]*p[k]*p[j]","(A1A2)A3 = 6+12 = 18"],
    testCases:run("minMult=18","O(n^3)") }),

  // ═══ T5 — DP Synthesis ═══
  mk({ exerciseId:"java_m41_t5_ex_1", position:1, level:"medium", type:"code_scratch",
    title:"Partition Equal Subset Sum (LeetCode #416)",
    instructions:"Can the array be split into two equal-sum subsets? Test [1,5,11,5]. Print true/false and complexity.",
    expectedSolution:`public class PartitionEqual {
    public static void main(String[] x){ int[] a={1,5,11,5}; int sum=0; for(int v:a) sum+=v;
        if((sum&1)==1){ System.out.println("canPartition=false"); return; }
        int t=sum/2; boolean[] dp=new boolean[t+1]; dp[0]=true;
        for(int v:a) for(int w=t;w>=v;w--) dp[w]=dp[w]||dp[w-v];
        System.out.println("canPartition=" + dp[t]); System.out.println("O(n*sum)"); }
}`,
    hints:["Target = sum/2 (odd sum → impossible)","0/1 subset-sum: dp[w] reachable?","[1,5,5] and [11] both = 11 → true"],
    testCases:run("canPartition=true","O(n*sum)") }),
  mk({ exerciseId:"java_m41_t5_ex_2", position:2, level:"easy", type:"predict_output",
    title:"Spotting the DP pattern",
    instructions:"Match each problem to its DP pattern: (1) House Robber, (2) Edit Distance, (3) Coin Change, (4) Burst Balloons.",
    expectedSolution:"(1) House Robber → 1D linear DP (dp[i] from dp[i-1], dp[i-2]).\n(2) Edit Distance → 2D grid DP (dp[i][j] from 3 neighbours).\n(3) Coin Change → unbounded knapsack (dp[a] from dp[a-coin]).\n(4) Burst Balloons → interval DP (dp[l][r] splitting on a last/k element).\n\nRecognising the pattern picks the state shape and the transition.",
    hints:["1D linear, 2D grid, knapsack, interval are the big four here","The state's dimensions follow the inputs","Interval DP iterates by increasing length"],
    testCases:txt("interval DP") }),
  mk({ exerciseId:"java_m41_t5_ex_3", position:3, level:"medium", type:"predict_output",
    title:"DP space optimization",
    instructions:"Many 2D DPs (Unique Paths, Edit Distance, Knapsack) reduce to O(n) or O(1) space. What property allows this, and what's the catch for 0/1 knapsack?",
    expectedSolution:"If dp[i][*] depends only on row i-1 (and the same row), you can keep ONE rolling array instead of the full table → O(n) space.\n\nCatch for 0/1 knapsack: with a single 1D array you must iterate the weight DESCENDING. Ascending would let one item be used multiple times (that's the UNBOUNDED knapsack). Direction encodes the 0/1-vs-unbounded distinction.\n\nUnique Paths / Edit Distance: keep the previous row (or two values) and update in place.",
    hints:["Only the previous row is needed → roll it","0/1 knapsack: iterate weight downward","Ascending weight = unbounded (item reused)"],
    testCases:txt("DESCENDING") }),
];

// KEEP authored + each topic's pm_1
const KEEP = new Set([
  ...EXERCISES.map(e => e.exerciseId),
  "java_m41_t1_pm_1","java_m41_t2_pm_1","java_m41_t3_pm_1","java_m41_t4_pm_1","java_m41_t5_pm_1",
]);
async function main(){ await mongoose.connect(process.env.MONGO_URI); const E=mongoose.connection.collection("proexercises");
  for(const e of EXERCISES) await E.updateOne({exerciseId:e.exerciseId},{$set:e},{upsert:true});
  console.log(`✓ ${EXERCISES.length} topic-specific exercises written`);
  const all=await E.find({moduleId:MODULE_ID},{projection:{exerciseId:1}}).toArray();
  const del=all.map(d=>d.exerciseId).filter(id=>!KEEP.has(id));
  if(del.length){ await E.deleteMany({exerciseId:{$in:del}}); console.log(`✓ deleted ${del.length} leftover duplicate slots`); }
  const total=await E.countDocuments({moduleId:MODULE_ID});
  const titles=new Set((await E.find({moduleId:MODULE_ID},{projection:{title:1}}).toArray()).map(d=>d.title));
  console.log(`\n✅ M41 re-authored. ${total} docs, ${titles.size} distinct titles.`);
  await mongoose.disconnect(); }
main().catch(e=>{console.error(e);process.exit(1);});
