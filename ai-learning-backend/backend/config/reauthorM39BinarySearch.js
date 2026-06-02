/**
 * reauthorM39BinarySearch.js — Fix duplicate-exercise bug in M39 (Binary Search).
 * Overwrites duplicated ex_1..ex_N per topic with topic-specific content; deletes
 * leftover duplicate slots. No pm_ to preserve. Idempotent.
 * Usage: node config/reauthorM39BinarySearch.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const MODULE_ID = "java_m39";
const DIFF = { warmup:0.17, easy:0.40, medium:0.65, hard:0.90 }, XP = { warmup:10, easy:15, medium:20, hard:30 };
function mk(o){ const topicId=o.exerciseId.replace(/_(ex|pm)_\d+$/,"");
  return { exerciseId:o.exerciseId, topicId, moduleId:MODULE_ID, trackKey:"pro_java", position:o.position,
    level:o.level, type:o.type, title:o.title, scenario:o.scenario||"", instructions:o.instructions,
    starterCode:o.starterCode||"", expectedSolution:o.expectedSolution, blanks:[], testCases:o.testCases,
    hints:o.hints, difficulty:DIFF[o.level]??0.5, xpReward:XP[o.level]??15 }; }
const run=(...s)=>[{type:"execution",expected_stdout_contains:s}];
const txt=(e)=>[{type:"text_match",expected:e}];

const EXERCISES = [
  // ═══ T1 — Binary Search Basics ═══
  mk({ exerciseId:"java_m39_t1_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace classic binary search",
    instructions:"Array [1,3,5,7,9,11], target=9. Trace binary search (lo,hi,mid,value) until found.",
    expectedSolution:"lo=0,hi=5: mid=2 → a[2]=5 < 9 → lo=3\nlo=3,hi=5: mid=4 → a[4]=9 == 9 → FOUND at index 4\n\nResult: index 4 (2 comparisons)",
    hints:["mid = lo + (hi-lo)/2","value < target → search right half (lo=mid+1)","Halves the range each step → O(log n)"],
    testCases:txt("index 4") }),
  mk({ exerciseId:"java_m39_t1_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Classic Binary Search",
    instructions:"Return the index of target in a sorted array, or -1. Test [1,3,5,7,9], target=7. Print index and complexity.",
    expectedSolution:`public class BSearch {
    static int bs(int[] a,int t){ int lo=0,hi=a.length-1; while(lo<=hi){ int m=lo+(hi-lo)/2;
        if(a[m]==t) return m; if(a[m]<t) lo=m+1; else hi=m-1; } return -1; }
    public static void main(String[] x){ System.out.println("index=" + bs(new int[]{1,3,5,7,9},7)); System.out.println("O(log n)"); }
}`,
    hints:["lo<=hi loop condition","mid=lo+(hi-lo)/2 avoids overflow","Move lo or hi past mid"],
    testCases:run("index=3","O(log n)") }),
  mk({ exerciseId:"java_m39_t1_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"First and Last Occurrence",
    instructions:"Find the first and last index of target in a sorted array with duplicates. Test [1,2,2,2,3], target=2. Print 'first=.. last=..' and complexity.",
    expectedSolution:`public class FirstLast {
    static int bound(int[] a,int t,boolean first){ int lo=0,hi=a.length-1,res=-1;
        while(lo<=hi){ int m=lo+(hi-lo)/2;
            if(a[m]==t){ res=m; if(first) hi=m-1; else lo=m+1; }
            else if(a[m]<t) lo=m+1; else hi=m-1; } return res; }
    public static void main(String[] x){ int[] a={1,2,2,2,3};
        System.out.println("first=" + bound(a,2,true) + " last=" + bound(a,2,false)); System.out.println("O(log n)"); }
}`,
    hints:["On a match, keep searching left (first) or right (last)","Record the match but don't stop","Two binary searches → still O(log n)"],
    testCases:run("first=1 last=3","O(log n)") }),
  mk({ exerciseId:"java_m39_t1_ex_4", position:4, level:"easy", type:"code_scratch",
    title:"Search Insert Position (LeetCode #35)",
    instructions:"Return the index where target is, or where it would be inserted. Test [1,3,5,6], target=5 then target=2. Print both and complexity.",
    expectedSolution:`public class InsertPos {
    static int ins(int[] a,int t){ int lo=0,hi=a.length; while(lo<hi){ int m=lo+(hi-lo)/2;
        if(a[m]<t) lo=m+1; else hi=m; } return lo; }
    public static void main(String[] x){ int[] a={1,3,5,6};
        System.out.println("pos5=" + ins(a,5) + " pos2=" + ins(a,2)); System.out.println("O(log n)"); }
}`,
    hints:["Lower-bound style: lo<hi, hi=mid (not mid-1)","Returns the first index >= target","5 is at index 2; 2 would insert at index 1"],
    testCases:run("pos5=2 pos2=1","O(log n)") }),
  mk({ exerciseId:"java_m39_t1_ex_5", position:5, level:"easy", type:"code_scratch",
    title:"Integer Square Root (LeetCode #69)",
    instructions:"Return floor(sqrt(x)) using binary search. Test x=8 and x=16. Print 'sqrt8=.. sqrt16=..' and complexity.",
    expectedSolution:`public class Sqrt {
    static int sq(int x){ if(x<2) return x; long lo=1,hi=x,ans=1; while(lo<=hi){ long m=lo+(hi-lo)/2;
        if(m*m<=x){ ans=m; lo=m+1; } else hi=m-1; } return (int)ans; }
    public static void main(String[] a){ System.out.println("sqrt8=" + sq(8) + " sqrt16=" + sq(16)); System.out.println("O(log n)"); }
}`,
    hints:["Search for the largest m with m*m <= x","Use long to avoid overflow on m*m","floor(sqrt(8))=2, sqrt(16)=4"],
    testCases:run("sqrt8=2 sqrt16=4","O(log n)") }),

  // ═══ T2 — Search on Answer ═══
  mk({ exerciseId:"java_m39_t2_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Why 'binary search on the answer' works",
    instructions:"Koko eats bananas at speed s. 'Can she finish within h hours at speed s?' is MONOTONIC in s. Explain why that lets us binary search the speed.",
    expectedSolution:"Define feasible(s) = 'can finish in ≤ h hours at speed s'.\nIf feasible(s) is true, then feasible(s+1) is also true (faster never hurts) — the predicate is monotonic: false…false TRUE…true.\n\nSo we binary search for the SMALLEST s where feasible(s) flips to true — O(log(maxSpeed)) feasibility checks instead of trying every speed.",
    hints:["The yes/no predicate must be monotonic in the answer","Search the boundary where false flips to true","Each check evaluates feasibility, not the array directly"],
    testCases:txt("monotonic") }),
  mk({ exerciseId:"java_m39_t2_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Koko Eating Bananas (LeetCode #875)",
    instructions:"Find the minimum eating speed to finish piles within h hours. Test piles=[3,6,7,11], h=8. Print speed and complexity.",
    expectedSolution:`public class Koko {
    static boolean ok(int[] p,int h,int s){ long hrs=0; for(int v:p) hrs+=(v+s-1)/s; return hrs<=h; }
    static int minSpeed(int[] p,int h){ int lo=1,hi=0; for(int v:p) hi=Math.max(hi,v);
        while(lo<hi){ int m=lo+(hi-lo)/2; if(ok(p,h,m)) hi=m; else lo=m+1; } return lo; }
    public static void main(String[] x){ System.out.println("speed=" + minSpeed(new int[]{3,6,7,11},8)); System.out.println("O(n log maxPile)"); }
}`,
    hints:["Search speed in [1, maxPile]","Hours at speed s = sum of ceil(pile/s)","Find smallest s with hours <= h"],
    testCases:run("speed=4","O(n log maxPile)") }),
  mk({ exerciseId:"java_m39_t2_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Capacity to Ship Packages in D Days (LeetCode #1011)",
    instructions:"Find the least ship capacity to ship all weights within 'days'. Test weights=[1,2,3,4,5,6,7,8,9,10], days=5. Print capacity and complexity.",
    expectedSolution:`public class ShipCapacity {
    static boolean ok(int[] w,int days,int cap){ int d=1,cur=0; for(int x:w){ if(cur+x>cap){ d++; cur=0; } cur+=x; } return d<=days; }
    static int least(int[] w,int days){ int lo=0,hi=0; for(int x:w){ lo=Math.max(lo,x); hi+=x; }
        while(lo<hi){ int m=lo+(hi-lo)/2; if(ok(w,days,m)) hi=m; else lo=m+1; } return lo; }
    public static void main(String[] x){ System.out.println("capacity=" + least(new int[]{1,2,3,4,5,6,7,8,9,10},5)); System.out.println("O(n log sum)"); }
}`,
    hints:["Capacity range: [max single weight, total sum]","Greedily count days needed for a candidate capacity","Smallest capacity with days <= D"],
    testCases:run("capacity=15","O(n log sum)") }),
  mk({ exerciseId:"java_m39_t2_ex_4", position:4, level:"hard", type:"code_scratch",
    title:"Split Array Largest Sum (LeetCode #410)",
    instructions:"Split the array into k subarrays minimizing the largest subarray sum. Test [7,2,5,10,8], k=2. Print result and complexity.",
    expectedSolution:`public class SplitArray {
    static boolean ok(int[] a,int k,int cap){ int parts=1,cur=0; for(int x:a){ if(cur+x>cap){ parts++; cur=0; } cur+=x; } return parts<=k; }
    static int split(int[] a,int k){ int lo=0,hi=0; for(int x:a){ lo=Math.max(lo,x); hi+=x; }
        while(lo<hi){ int m=lo+(hi-lo)/2; if(ok(a,k,m)) hi=m; else lo=m+1; } return lo; }
    public static void main(String[] x){ System.out.println("largest=" + split(new int[]{7,2,5,10,8},2)); System.out.println("O(n log sum)"); }
}`,
    hints:["Same shape as ship-capacity: search the largest-sum value","feasible(cap) = can split into <= k parts each <= cap","[7,2,5][10,8] → max 18"],
    testCases:run("largest=18","O(n log sum)") }),
  mk({ exerciseId:"java_m39_t2_ex_5", position:5, level:"hard", type:"code_scratch",
    title:"Median of Two Sorted Arrays (LeetCode #4)",
    instructions:"Find the median of two sorted arrays. Test [1,3] and [2]. Print the median (one decimal) and complexity.",
    expectedSolution:`public class MedianTwo {
    static double median(int[] a,int[] b){ if(a.length>b.length) return median(b,a);
        int m=a.length,n=b.length,lo=0,hi=m,half=(m+n+1)/2;
        while(lo<=hi){ int i=lo+(hi-lo)/2,j=half-i;
            int aL=i==0?Integer.MIN_VALUE:a[i-1], aR=i==m?Integer.MAX_VALUE:a[i];
            int bL=j==0?Integer.MIN_VALUE:b[j-1], bR=j==n?Integer.MAX_VALUE:b[j];
            if(aL<=bR&&bL<=aR){ if(((m+n)&1)==1) return Math.max(aL,bL);
                return (Math.max(aL,bL)+Math.min(aR,bR))/2.0; }
            else if(aL>bR) hi=i-1; else lo=i+1; } return 0; }
    public static void main(String[] x){ System.out.println("median=" + median(new int[]{1,3},new int[]{2})); System.out.println("O(log(min(m,n)))"); }
}`,
    hints:["Binary search the partition of the smaller array","Ensure left parts <= right parts across both","Odd total → max of left parts; here median=2.0"],
    testCases:run("median=2.0","O(log(min(m,n)))") }),

  // ═══ T3 — Rotated Arrays ═══
  mk({ exerciseId:"java_m39_t3_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace search in a rotated array",
    instructions:"Array [4,5,6,7,0,1,2], target=0. At each step decide which half is sorted and whether the target lies in it.",
    expectedSolution:"lo=0,hi=6: mid=3 → a[3]=7. Left [4..7] sorted; target 0 not in [4,7] → go right, lo=4.\nlo=4,hi=6: mid=5 → a[5]=1. Left [0,1] sorted (a[4]=0..a[5]=1); target 0 in [0,1] → go left, hi=4.\nlo=4,hi=4: mid=4 → a[4]=0 == target → FOUND at index 4.",
    hints:["One half of a rotated array is always sorted","Check if target lies within the sorted half","Recurse into the half that could contain target"],
    testCases:txt("index 4") }),
  mk({ exerciseId:"java_m39_t3_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Search in Rotated Sorted Array (LeetCode #33)",
    instructions:"Search target in a rotated sorted array (no duplicates). Test [4,5,6,7,0,1,2], target=0. Print index and complexity.",
    expectedSolution:`public class SearchRotated {
    static int search(int[] a,int t){ int lo=0,hi=a.length-1; while(lo<=hi){ int m=lo+(hi-lo)/2;
        if(a[m]==t) return m;
        if(a[lo]<=a[m]){ if(a[lo]<=t&&t<a[m]) hi=m-1; else lo=m+1; }
        else { if(a[m]<t&&t<=a[hi]) lo=m+1; else hi=m-1; } } return -1; }
    public static void main(String[] x){ System.out.println("index=" + search(new int[]{4,5,6,7,0,1,2},0)); System.out.println("O(log n)"); }
}`,
    hints:["If a[lo]<=a[mid], left half is sorted","Check whether target is within the sorted half's range","Otherwise the right half is sorted"],
    testCases:run("index=4","O(log n)") }),
  mk({ exerciseId:"java_m39_t3_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Find Minimum in Rotated Sorted Array (LeetCode #153)",
    instructions:"Find the minimum of a rotated sorted array (no duplicates). Test [3,4,5,1,2]. Print the min and complexity.",
    expectedSolution:`public class FindMin {
    static int findMin(int[] a){ int lo=0,hi=a.length-1; while(lo<hi){ int m=lo+(hi-lo)/2;
        if(a[m]>a[hi]) lo=m+1; else hi=m; } return a[lo]; }
    public static void main(String[] x){ System.out.println("min=" + findMin(new int[]{3,4,5,1,2})); System.out.println("O(log n)"); }
}`,
    hints:["Compare a[mid] with a[hi]","a[mid] > a[hi] → min is to the right (lo=mid+1)","else min is at mid or left (hi=mid)"],
    testCases:run("min=1","O(log n)") }),
  mk({ exerciseId:"java_m39_t3_ex_4", position:4, level:"hard", type:"code_scratch",
    title:"Search in Rotated Sorted Array II (LeetCode #81, with duplicates)",
    instructions:"Search target in a rotated sorted array that MAY contain duplicates. Test [2,5,6,0,0,1,2], target=0. Print true/false and worst-case complexity.",
    expectedSolution:`public class SearchRotated2 {
    static boolean search(int[] a,int t){ int lo=0,hi=a.length-1; while(lo<=hi){ int m=lo+(hi-lo)/2;
        if(a[m]==t) return true;
        if(a[lo]==a[m]&&a[m]==a[hi]){ lo++; hi--; }
        else if(a[lo]<=a[m]){ if(a[lo]<=t&&t<a[m]) hi=m-1; else lo=m+1; }
        else { if(a[m]<t&&t<=a[hi]) lo=m+1; else hi=m-1; } } return false; }
    public static void main(String[] x){ System.out.println("found=" + search(new int[]{2,5,6,0,0,1,2},0)); System.out.println("O(n) worst case"); }
}`,
    hints:["Duplicates can make a[lo]==a[mid]==a[hi] ambiguous","In that case shrink both ends by 1","Worst case degrades to O(n)"],
    testCases:run("found=true","O(n) worst case") }),
  mk({ exerciseId:"java_m39_t3_ex_5", position:5, level:"medium", type:"code_scratch",
    title:"Find Peak Element (LeetCode #162)",
    instructions:"Return the index of any peak element (a[i] > neighbours). Test [1,2,3,1]. Print the peak index and complexity.",
    expectedSolution:`public class FindPeak {
    static int peak(int[] a){ int lo=0,hi=a.length-1; while(lo<hi){ int m=lo+(hi-lo)/2;
        if(a[m]<a[m+1]) lo=m+1; else hi=m; } return lo; }
    public static void main(String[] x){ System.out.println("peakIndex=" + peak(new int[]{1,2,3,1})); System.out.println("O(log n)"); }
}`,
    hints:["If a[mid] < a[mid+1], a peak lies to the right","else a peak is at mid or left","Index 2 (value 3) is the peak"],
    testCases:run("peakIndex=2","O(log n)") }),

  // ═══ T4 — 2D Binary Search ═══
  mk({ exerciseId:"java_m39_t4_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Flat-index mapping for a fully sorted matrix",
    instructions:"A 3×4 fully sorted matrix is treated as a length-12 sorted array. For flat index k=7, what (row, col) does it map to? Give the formula.",
    expectedSolution:"cols = 4\nrow = k / cols = 7 / 4 = 1\ncol = k % cols = 7 % 4 = 3\n\n(row, col) = (1, 3). Formula: row=k/cols, col=k%cols.",
    hints:["row = k / cols","col = k % cols","Lets you binary search a matrix as a 1D array"],
    testCases:txt("(1, 3)") }),
  mk({ exerciseId:"java_m39_t4_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Search a 2D Matrix (LeetCode #74) — flat index",
    instructions:"Binary search a fully sorted matrix via flat-index mapping. Test [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=11. Print true/false and complexity.",
    expectedSolution:`public class Search2D {
    static boolean search(int[][] mat,int t){ int rows=mat.length,cols=mat[0].length,lo=0,hi=rows*cols-1;
        while(lo<=hi){ int m=lo+(hi-lo)/2,v=mat[m/cols][m%cols];
            if(v==t) return true; if(v<t) lo=m+1; else hi=m-1; } return false; }
    public static void main(String[] x){ int[][] mat={{1,3,5,7},{10,11,16,20},{23,30,34,60}};
        System.out.println("found=" + search(mat,11)); System.out.println("O(log(m*n))"); }
}`,
    hints:["Treat the matrix as a sorted 1D array of m*n","mid → mat[mid/cols][mid%cols]","Standard binary search otherwise"],
    testCases:run("found=true","O(log(m*n))") }),
  mk({ exerciseId:"java_m39_t4_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Search a 2D Matrix II (LeetCode #240) — staircase",
    instructions:"Search a row+column sorted matrix from the top-right corner. Test [[1,4,7],[2,5,8],[3,6,9]], target=5. Print true/false and complexity.",
    expectedSolution:`public class Search2DII {
    static boolean search(int[][] mat,int t){ int r=0,c=mat[0].length-1;
        while(r<mat.length&&c>=0){ if(mat[r][c]==t) return true; if(mat[r][c]>t) c--; else r++; } return false; }
    public static void main(String[] x){ int[][] mat={{1,4,7},{2,5,8},{3,6,9}};
        System.out.println("found=" + search(mat,5)); System.out.println("O(m+n)"); }
}`,
    hints:["Start at top-right","value > target → move left; value < target → move down","Each step eliminates a full row or column"],
    testCases:run("found=true","O(m+n)") }),
  mk({ exerciseId:"java_m39_t4_ex_4", position:4, level:"hard", type:"code_scratch",
    title:"Kth Smallest Element in a Sorted Matrix (LeetCode #378)",
    instructions:"Binary search on the value range; count elements <= mid via staircase. Test [[1,5,9],[10,11,13],[12,13,15]], k=8. Print the kth smallest and complexity.",
    expectedSolution:`public class KthSmallest {
    static int countLE(int[][] m,int v){ int n=m.length,r=n-1,c=0,cnt=0;
        while(r>=0&&c<n){ if(m[r][c]<=v){ cnt+=r+1; c++; } else r--; } return cnt; }
    static int kth(int[][] m,int k){ int n=m.length,lo=m[0][0],hi=m[n-1][n-1];
        while(lo<hi){ int mid=lo+(hi-lo)/2; if(countLE(m,mid)<k) lo=mid+1; else hi=mid; } return lo; }
    public static void main(String[] x){ int[][] m={{1,5,9},{10,11,13},{12,13,15}};
        System.out.println("kth=" + kth(m,8)); System.out.println("O(n log(max-min))"); }
}`,
    hints:["Binary search on the VALUE range [min,max]","Count elements <= mid using a staircase from bottom-left","Shrink to the smallest value whose count >= k"],
    testCases:run("kth=13","O(n log(max-min))") }),

  // ═══ T5 — Binary Search Synthesis ═══
  mk({ exerciseId:"java_m39_t5_ex_1", position:1, level:"easy", type:"predict_output",
    title:"lower_bound vs upper_bound",
    instructions:"For sorted [1,2,2,2,3] and target=2: what index does lower_bound return, and what does upper_bound return?",
    expectedSolution:"lower_bound(2) = first index with value >= 2 = index 1.\nupper_bound(2) = first index with value > 2 = index 4.\n\ncount of 2s = upper_bound - lower_bound = 4 - 1 = 3.",
    hints:["lower_bound: first element >= target","upper_bound: first element > target","Their difference = number of occurrences"],
    testCases:txt("lower_bound(2) = first index with value >= 2 = index 1") }),
  mk({ exerciseId:"java_m39_t5_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Implement lower_bound",
    instructions:"Return the first index whose value is >= target (or array length if none). Test [1,2,2,2,3], target=2. Print index and complexity.",
    expectedSolution:`public class LowerBound {
    static int lb(int[] a,int t){ int lo=0,hi=a.length; while(lo<hi){ int m=lo+(hi-lo)/2;
        if(a[m]<t) lo=m+1; else hi=m; } return lo; }
    public static void main(String[] x){ System.out.println("lb=" + lb(new int[]{1,2,2,2,3},2)); System.out.println("O(log n)"); }
}`,
    hints:["Half-open [lo,hi) with hi=length","a[mid] < target → lo=mid+1, else hi=mid","Converges to first >= target"],
    testCases:run("lb=1","O(log n)") }),
  mk({ exerciseId:"java_m39_t5_ex_3", position:3, level:"easy", type:"predict_output",
    title:"The lo<=hi vs lo<hi off-by-one",
    instructions:"Why do some binary searches use 'while (lo <= hi)' with hi=n-1, and others 'while (lo < hi)' with hi=n? When does each terminate correctly?",
    expectedSolution:"`lo<=hi` with hi=n-1 (inclusive range): used for EXACT-match search; both ends are valid indices, terminates when lo>hi (range empty).\n`lo<hi` with hi=n (half-open): used for BOUNDARY search (lower/upper bound, insert position); hi never reads a value, terminates when lo==hi pointing at the boundary.\n\nMixing them (e.g. lo<=hi with hi=mid) causes infinite loops or off-by-one. Pick one convention and keep it consistent.",
    hints:["Inclusive [lo,hi]: exact search, lo<=hi","Half-open [lo,hi): boundary search, lo<hi","Match the update (mid±1 vs mid) to the convention"],
    testCases:txt("boundary") }),
  mk({ exerciseId:"java_m39_t5_ex_4", position:4, level:"medium", type:"predict_output",
    title:"Which binary-search variant fits the problem?",
    instructions:"Match each to a variant: (1) find exact value, (2) count occurrences of a value, (3) minimum capacity to ship in D days, (4) find min in rotated array.",
    expectedSolution:"(1) find exact value → classic binary search (lo<=hi).\n(2) count occurrences → upper_bound - lower_bound.\n(3) minimum capacity in D days → binary search ON THE ANSWER (monotonic feasibility).\n(4) min in rotated array → modified binary search comparing a[mid] vs a[hi].\n\nKey: classic for membership, bounds for counts/ranges, search-on-answer for optimization, modified for rotated/unsorted-but-structured.",
    hints:["Exact → classic","Counts/ranges → lower/upper bound","Optimization with monotonic check → search on answer"],
    testCases:txt("search on answer") }),
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
  console.log(`\n✅ M39 re-authored. ${total} docs, ${titles.size} distinct titles.`);
  await mongoose.disconnect(); }
main().catch(e=>{console.error(e);process.exit(1);});
