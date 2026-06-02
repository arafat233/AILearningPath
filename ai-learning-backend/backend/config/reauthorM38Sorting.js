/**
 * reauthorM38Sorting.js — Fix duplicate-exercise bug in M38 (Sorting Algorithms).
 *
 * Same fix shape as reauthorM37Graphs.js. Overwrites duplicated ex_1..ex_N per
 * topic with topic-specific content (preserves exerciseIds). KEEPS Section-B's
 * elementary sorts in T1 (ex_13..ex_18: bubble/selection/insertion/shell + traces).
 * Deletes leftover duplicate slots. Idempotent.
 *
 * Usage: node config/reauthorM38Sorting.js
 */
import "dotenv/config";
import mongoose from "mongoose";

const MODULE_ID = "java_m38";
const DIFF = { warmup: 0.17, easy: 0.40, medium: 0.65, hard: 0.90 };
const XP = { warmup: 10, easy: 15, medium: 20, hard: 30 };
function mk(o) {
  const topicId = o.exerciseId.replace(/_(ex|pm)_\d+$/, "");
  return { exerciseId:o.exerciseId, topicId, moduleId:MODULE_ID, trackKey:"pro_java",
    position:o.position, level:o.level, type:o.type, title:o.title, scenario:o.scenario||"",
    instructions:o.instructions, starterCode:o.starterCode||"", expectedSolution:o.expectedSolution,
    blanks:[], testCases:o.testCases, hints:o.hints, difficulty:DIFF[o.level]??0.5, xpReward:XP[o.level]??15 };
}
const run = (...s) => [{ type:"execution", expected_stdout_contains:s }];
const txt = (e) => [{ type:"text_match", expected:e }];

const EXERCISES = [
  // ═══ T1 — Comparison Sorts (keep Section-B ex_13..18) ═══
  mk({ exerciseId:"java_m38_t1_ex_1", position:1, level:"easy", type:"code_scratch",
    title:"Merge Sort",
    instructions:"Implement merge sort. Sort [5,2,4,1,3] and print the result and complexity.",
    expectedSolution:`import java.util.*;
public class MergeSort {
    static void ms(int[] a,int l,int r){ if(l>=r) return; int m=(l+r)/2; ms(a,l,m); ms(a,m+1,r); merge(a,l,m,r); }
    static void merge(int[] a,int l,int m,int r){ int[] t=new int[r-l+1]; int i=l,j=m+1,k=0;
        while(i<=m&&j<=r) t[k++]=a[i]<=a[j]?a[i++]:a[j++];
        while(i<=m) t[k++]=a[i++]; while(j<=r) t[k++]=a[j++];
        System.arraycopy(t,0,a,l,t.length); }
    public static void main(String[] x){ int[] a={5,2,4,1,3}; ms(a,0,a.length-1);
        System.out.println(Arrays.toString(a)); System.out.println("O(n log n)"); }
}`,
    hints:["Divide at the midpoint, sort halves, merge","Merge compares fronts of both halves","Stable, O(n log n) time, O(n) space"],
    testCases:run("[1, 2, 3, 4, 5]","O(n log n)") }),

  mk({ exerciseId:"java_m38_t1_ex_2", position:2, level:"easy", type:"code_scratch",
    title:"Quick Sort (Lomuto partition)",
    instructions:"Implement quick sort. Sort [5,2,4,1,3] and print the result and average complexity.",
    expectedSolution:`import java.util.*;
public class QuickSort {
    static void qs(int[] a,int l,int r){ if(l>=r) return; int p=part(a,l,r); qs(a,l,p-1); qs(a,p+1,r); }
    static int part(int[] a,int l,int r){ int piv=a[r],i=l; for(int j=l;j<r;j++) if(a[j]<piv){ int t=a[i];a[i]=a[j];a[j]=t;i++; }
        int t=a[i];a[i]=a[r];a[r]=t; return i; }
    public static void main(String[] x){ int[] a={5,2,4,1,3}; qs(a,0,a.length-1);
        System.out.println(Arrays.toString(a)); System.out.println("O(n log n) average"); }
}`,
    hints:["Partition around a pivot, recurse on both sides","Worst case O(n²) on sorted input with bad pivot","In-place, average O(n log n)"],
    testCases:run("[1, 2, 3, 4, 5]","O(n log n) average") }),

  mk({ exerciseId:"java_m38_t1_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Heap Sort",
    instructions:"Implement heap sort using an in-place max-heap. Sort [5,2,4,1,3] and print the result and complexity.",
    expectedSolution:`import java.util.*;
public class HeapSort {
    static void heapify(int[] a,int n,int i){ int big=i,l=2*i+1,r=2*i+2;
        if(l<n&&a[l]>a[big]) big=l; if(r<n&&a[r]>a[big]) big=r;
        if(big!=i){ int t=a[i];a[i]=a[big];a[big]=t; heapify(a,n,big); } }
    public static void main(String[] x){ int[] a={5,2,4,1,3}; int n=a.length;
        for(int i=n/2-1;i>=0;i--) heapify(a,n,i);
        for(int i=n-1;i>0;i--){ int t=a[0];a[0]=a[i];a[i]=t; heapify(a,i,0); }
        System.out.println(Arrays.toString(a)); System.out.println("O(n log n)"); }
}`,
    hints:["Build a max-heap bottom-up","Swap root (max) to the end, shrink heap, re-heapify","In-place, O(n log n), NOT stable"],
    testCases:run("[1, 2, 3, 4, 5]","O(n log n)") }),

  mk({ exerciseId:"java_m38_t1_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"3-Way Quick Sort (handles duplicates)",
    instructions:"Implement 3-way quicksort (Dutch-flag partition) which is efficient with many duplicates. Sort [2,2,1,1,3,2,1] and print the result and complexity.",
    expectedSolution:`import java.util.*;
public class ThreeWayQS {
    static void qs(int[] a,int lo,int hi){ if(lo>=hi) return; int lt=lo,gt=hi,i=lo,p=a[lo];
        while(i<=gt){ if(a[i]<p){ int t=a[lt];a[lt++]=a[i];a[i++]=t; }
            else if(a[i]>p){ int t=a[i];a[i]=a[gt];a[gt--]=t; } else i++; }
        qs(a,lo,lt-1); qs(a,gt+1,hi); }
    public static void main(String[] x){ int[] a={2,2,1,1,3,2,1}; qs(a,0,a.length-1);
        System.out.println(Arrays.toString(a)); System.out.println("O(n log n)"); }
}`,
    hints:["Partition into <pivot, ==pivot, >pivot regions","Equal elements are skipped — great with duplicates","Recurse only on the < and > regions"],
    testCases:run("[1, 1, 1, 2, 2, 2, 3]","O(n log n)") }),

  mk({ exerciseId:"java_m38_t1_ex_5", position:5, level:"medium", type:"code_scratch",
    title:"Count Inversions (merge sort)",
    instructions:"Count inversions (pairs i<j with a[i]>a[j]) using merge sort. Test [2,4,1,3,5] and print the count and complexity.",
    expectedSolution:`import java.util.*;
public class Inversions {
    static long count(int[] a,int l,int r){ if(l>=r) return 0; int m=(l+r)/2;
        long c=count(a,l,m)+count(a,m+1,r); int[] t=new int[r-l+1]; int i=l,j=m+1,k=0;
        while(i<=m&&j<=r){ if(a[i]<=a[j]) t[k++]=a[i++]; else { t[k++]=a[j++]; c+=(m-i+1); } }
        while(i<=m) t[k++]=a[i++]; while(j<=r) t[k++]=a[j++];
        System.arraycopy(t,0,a,l,t.length); return c; }
    public static void main(String[] x){ int[] a={2,4,1,3,5};
        System.out.println("inversions=" + count(a,0,a.length-1)); System.out.println("O(n log n)"); }
}`,
    hints:["During merge, a right-element jumping ahead of left ones counts (m-i+1) inversions","Brute force is O(n²); merge sort gives O(n log n)","Pairs here: (2,1),(4,1),(4,3) = 3"],
    testCases:run("inversions=3","O(n log n)") }),

  // ═══ T2 — Non-Comparison Sorts: Counting, Radix, Bucket ═══
  mk({ exerciseId:"java_m38_t2_ex_1", position:1, level:"easy", type:"code_scratch",
    title:"Counting Sort",
    instructions:"Implement counting sort for non-negative ints. Sort [3,1,3,2,1,0] and print the result and complexity.",
    expectedSolution:`import java.util.*;
public class CountingSort {
    public static void main(String[] x){ int[] a={3,1,3,2,1,0}; int max=0; for(int v:a) max=Math.max(max,v);
        int[] cnt=new int[max+1]; for(int v:a) cnt[v]++;
        int[] out=new int[a.length]; int k=0;
        for(int v=0;v<=max;v++) while(cnt[v]-->0) out[k++]=v;
        System.out.println(Arrays.toString(out)); System.out.println("O(n+k)"); }
}`,
    hints:["Count occurrences of each value","Emit values in order by their counts","O(n+k) — k is the value range, no comparisons"],
    testCases:run("[0, 1, 1, 2, 3, 3]","O(n+k)") }),

  mk({ exerciseId:"java_m38_t2_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Radix Sort (LSD)",
    instructions:"Implement LSD radix sort for non-negative ints. Sort [170,45,75,90,2,802,24,66] and print the result and complexity.",
    expectedSolution:`import java.util.*;
public class RadixSort {
    public static void main(String[] x){ int[] a={170,45,75,90,2,802,24,66}; int max=0; for(int v:a) max=Math.max(max,v);
        for(int exp=1; max/exp>0; exp*=10){ int[] out=new int[a.length]; int[] cnt=new int[10];
            for(int v:a) cnt[(v/exp)%10]++;
            for(int i=1;i<10;i++) cnt[i]+=cnt[i-1];
            for(int i=a.length-1;i>=0;i--){ int d=(a[i]/exp)%10; out[--cnt[d]]=a[i]; }
            a=out; }
        System.out.println(Arrays.toString(a)); System.out.println("O(d*(n+k))"); }
}`,
    hints:["Stable counting-sort by each digit, least-significant first","Iterate exp = 1,10,100,...","Stability across passes is essential"],
    testCases:run("[2, 24, 45, 66, 75, 90, 170, 802]","O(d*(n+k))") }),

  mk({ exerciseId:"java_m38_t2_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Bucket Sort (integers into buckets)",
    instructions:"Implement bucket sort by distributing ints 0..99 into 10 buckets by their tens digit, sorting each bucket, then concatenating. Sort [29,25,3,49,9,37,21,43] and print the result and complexity.",
    expectedSolution:`import java.util.*;
public class BucketSort {
    public static void main(String[] x){ int[] a={29,25,3,49,9,37,21,43};
        List<List<Integer>> b=new ArrayList<>(); for(int i=0;i<10;i++) b.add(new ArrayList<>());
        for(int v:a) b.get(v/10).add(v);
        List<Integer> out=new ArrayList<>();
        for(List<Integer> bucket:b){ Collections.sort(bucket); out.addAll(bucket); }
        System.out.println(out); System.out.println("O(n+k)"); }
}`,
    hints:["Distribute into buckets by a high-order key (tens digit)","Sort each bucket, then concatenate in bucket order","Fast when input is uniformly distributed"],
    testCases:run("[3, 9, 21, 25, 29, 37, 43, 49]","O(n+k)") }),

  mk({ exerciseId:"java_m38_t2_ex_4", position:4, level:"warmup", type:"predict_output",
    title:"Trace: radix sort first (ones) pass",
    instructions:"LSD radix sort on [53, 11, 42, 30, 25]. After the FIRST pass (sorting by the ONES digit, stable), what is the array order?",
    expectedSolution:"Ones digits: 53→3, 11→1, 42→2, 30→0, 25→5\nStable counting sort by ones digit (ascending): 0,1,2,3,5\n  30(0), 11(1), 42(2), 53(3), 25(5)\n\nAfter pass 1: [30, 11, 42, 53, 25]",
    hints:["Sort only by the ones digit this pass","Keep equal-digit elements in their original relative order (stable)","Order the digits 0..9"],
    testCases:txt("[30, 11, 42, 53, 25]") }),

  mk({ exerciseId:"java_m38_t2_ex_5", position:5, level:"easy", type:"predict_output",
    title:"When does counting sort beat comparison sorts?",
    instructions:"Counting sort is O(n+k) where k is the value range. For which scenario is it clearly BETTER than O(n log n) comparison sort, and for which is it WORSE? Give one of each.",
    expectedSolution:"BETTER: sorting 10,000,000 exam scores in range 0..100 (k=101 tiny vs n huge) → O(n+k) ≈ O(n), beats O(n log n).\nWORSE: sorting 1,000 distinct 64-bit IDs (k ≈ 2^64 enormous) → O(n+k) dominated by k → far worse than O(n log n).\n\nRule: counting sort wins when k = O(n); loses when k >> n.",
    hints:["k is the size of the value range","Small range + many items → counting sort wins","Huge range → the count array is wasteful"],
    testCases:txt("k = O(n)") }),

  // ═══ T3 — Sorting Applications: Intervals, Largest Number, Relative Sort ═══
  mk({ exerciseId:"java_m38_t3_ex_1", position:1, level:"medium", type:"code_scratch",
    title:"Merge Intervals (LeetCode #56)",
    instructions:"Sort by start, then merge overlapping intervals. Test [[1,3],[2,6],[8,10],[15,18]] and print the merged result and complexity.",
    expectedSolution:`import java.util.*;
public class MergeIntervals {
    public static void main(String[] x){ int[][] iv={{1,3},{2,6},{8,10},{15,18}};
        Arrays.sort(iv,(a,b)->a[0]-b[0]); List<int[]> res=new ArrayList<>();
        for(int[] i:iv){ if(res.isEmpty()||res.get(res.size()-1)[1]<i[0]) res.add(i);
            else res.get(res.size()-1)[1]=Math.max(res.get(res.size()-1)[1],i[1]); }
        System.out.println(Arrays.deepToString(res.toArray(new int[0][]))); System.out.println("O(n log n)"); }
}`,
    hints:["Sort by start time first","Merge when current start <= last end","Sorting dominates → O(n log n)"],
    testCases:run("[[1, 6], [8, 10], [15, 18]]","O(n log n)") }),

  mk({ exerciseId:"java_m38_t3_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Meeting Rooms II (LeetCode #253)",
    instructions:"Return the minimum number of meeting rooms required. Test [[0,30],[5,10],[15,20]] and print the count and complexity.",
    expectedSolution:`import java.util.*;
public class MeetingRooms2 {
    public static void main(String[] x){ int[][] m={{0,30},{5,10},{15,20}}; int n=m.length;
        int[] starts=new int[n], ends=new int[n];
        for(int i=0;i<n;i++){ starts[i]=m[i][0]; ends[i]=m[i][1]; }
        Arrays.sort(starts); Arrays.sort(ends);
        int rooms=0,maxR=0,j=0;
        for(int i=0;i<n;i++){ while(j<n&&ends[j]<=starts[i]){ rooms--; j++; } rooms++; maxR=Math.max(maxR,rooms); }
        System.out.println("rooms=" + maxR); System.out.println("O(n log n)"); }
}`,
    hints:["Sort start times and end times separately","Sweep: a new meeting needs a room unless one freed up","Peak concurrent meetings = rooms needed"],
    testCases:run("rooms=2","O(n log n)") }),

  mk({ exerciseId:"java_m38_t3_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Largest Number (LeetCode #179)",
    instructions:"Arrange numbers to form the largest number via a custom comparator. Test [3,30,34,5,9] and print the result string and complexity.",
    expectedSolution:`import java.util.*;
public class LargestNumber {
    public static void main(String[] x){ int[] nums={3,30,34,5,9};
        String[] s=new String[nums.length]; for(int i=0;i<nums.length;i++) s[i]=String.valueOf(nums[i]);
        Arrays.sort(s,(a,b)->(b+a).compareTo(a+b));
        StringBuilder sb=new StringBuilder(); for(String t:s) sb.append(t);
        String res=sb.charAt(0)=='0'?"0":sb.toString();
        System.out.println(res); System.out.println("O(n log n)"); }
}`,
    hints:["Compare by concatenation: (b+a) vs (a+b)","'9' before '5' before '34' before '3' before '30'","Handle all-zeros edge case"],
    testCases:run("9534330","O(n log n)") }),

  mk({ exerciseId:"java_m38_t3_ex_4", position:4, level:"easy", type:"code_scratch",
    title:"Relative Sort Array (LeetCode #1122)",
    instructions:"Sort arr1 so elements appear in the order given by arr2; elements not in arr2 go last in ascending order. arr1=[2,3,1,3,2,4,6,7,9,2,19], arr2=[2,1,4,3,9,6]. Print the result and complexity.",
    expectedSolution:`import java.util.*;
public class RelativeSort {
    public static void main(String[] x){ int[] arr1={2,3,1,3,2,4,6,7,9,2,19}, arr2={2,1,4,3,9,6};
        int[] cnt=new int[1001]; for(int v:arr1) cnt[v]++;
        List<Integer> out=new ArrayList<>();
        for(int v:arr2) while(cnt[v]-->0) out.add(v);
        for(int v=0;v<=1000;v++) while(cnt[v]-->0) out.add(v);
        System.out.println(out); System.out.println("O(n + maxVal)"); }
}`,
    hints:["Count arr1 values","Emit arr2's order first, draining counts","Then emit leftovers ascending"],
    testCases:run("[2, 2, 2, 1, 4, 3, 3, 9, 6, 7, 19]","O(n + maxVal)") }),

  mk({ exerciseId:"java_m38_t3_ex_5", position:5, level:"easy", type:"code_scratch",
    title:"Sort Array By Parity (evens asc, then odds asc)",
    instructions:"Rearrange so all evens come first (ascending) then all odds (ascending). Test [3,1,2,4,6,5] and print the result and complexity.",
    expectedSolution:`import java.util.*;
public class ByParity {
    public static void main(String[] x){ int[] a={3,1,2,4,6,5};
        Integer[] b=new Integer[a.length]; for(int i=0;i<a.length;i++) b[i]=a[i];
        Arrays.sort(b,(p,q)->{ int pp=p%2,qq=q%2; if(pp!=qq) return pp-qq; return p-q; });
        System.out.println(Arrays.toString(b)); System.out.println("O(n log n)"); }
}`,
    hints:["Comparator: parity first (even=0 before odd=1)","Tie-break by value ascending","Evens [2,4,6] then odds [1,3,5]"],
    testCases:run("[2, 4, 6, 1, 3, 5]","O(n log n)") }),

  // ═══ T4 — Custom Sort: Comparators, Stability, Multiple Keys ═══
  mk({ exerciseId:"java_m38_t4_ex_1", position:1, level:"warmup", type:"code_scratch",
    title:"Sort Integers Descending with a Comparator",
    instructions:"Sort [5,2,4,1,3] in DESCENDING order using a Comparator. Print the result and complexity.",
    expectedSolution:`import java.util.*;
public class Descending {
    public static void main(String[] x){ Integer[] a={5,2,4,1,3};
        Arrays.sort(a,Comparator.reverseOrder());
        System.out.println(Arrays.toString(a)); System.out.println("O(n log n)"); }
}`,
    hints:["Comparator.reverseOrder() for descending","Must use Integer[] (objects), not int[]","Or (a,b)->b-a"],
    testCases:run("[5, 4, 3, 2, 1]","O(n log n)") }),

  mk({ exerciseId:"java_m38_t4_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Sort by Two Keys (length asc, then alphabetical)",
    instructions:"Sort words by length ascending, then alphabetically for ties. Test [\"banana\",\"apple\",\"fig\",\"kiwi\",\"date\"]. Print the result and complexity.",
    expectedSolution:`import java.util.*;
public class TwoKeys {
    public static void main(String[] x){ String[] w={"banana","apple","fig","kiwi","date"};
        Arrays.sort(w,Comparator.comparingInt(String::length).thenComparing(Comparator.naturalOrder()));
        System.out.println(Arrays.toString(w)); System.out.println("O(n log n)"); }
}`,
    hints:["comparingInt(String::length).thenComparing(naturalOrder())","Primary key length, secondary key alphabetical","fig(3) < date/kiwi(4) < apple(5) < banana(6)"],
    testCases:run("[fig, date, kiwi, apple, banana]","O(n log n)") }),

  mk({ exerciseId:"java_m38_t4_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Stable Sort Demonstration",
    instructions:"Sort pairs {value,originalIndex} by value only, using a STABLE sort. Show that equal values keep their original order. Test pairs (2,0),(1,1),(2,2),(1,3). Print the result as [value:index ...] and note stability.",
    expectedSolution:`import java.util.*;
public class StableDemo {
    public static void main(String[] x){ int[][] p={{2,0},{1,1},{2,2},{1,3}};
        Arrays.sort(p,(a,b)->a[0]-b[0]);  // Arrays.sort on objects is stable (TimSort)
        StringBuilder sb=new StringBuilder(); for(int[] q:p) sb.append(q[0]+":"+q[1]+" ");
        System.out.println(sb.toString().trim());  // 1:1 1:3 2:0 2:2
        System.out.println("stable"); }
}`,
    hints:["Arrays.sort(Object[]) uses TimSort — STABLE","Equal values 1:1 before 1:3, and 2:0 before 2:2","Arrays.sort(int[]) uses dual-pivot quicksort — NOT stable"],
    testCases:run("1:1 1:3 2:0 2:2","stable") }),

  mk({ exerciseId:"java_m38_t4_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Sort 2D Array by a Chosen Column",
    instructions:"Sort rows of a 2D array by column index 1 ascending. Test [[1,3],[2,1],[3,2]]. Print the result and complexity.",
    expectedSolution:`import java.util.*;
public class SortByColumn {
    public static void main(String[] x){ int[][] a={{1,3},{2,1},{3,2}};
        Arrays.sort(a,(p,q)->p[1]-q[1]);
        System.out.println(Arrays.deepToString(a)); System.out.println("O(n log n)"); }
}`,
    hints:["Comparator on p[1]-q[1] sorts by column 1","Rows reorder; columns stay intact","Use Integer.compare to avoid overflow for large values"],
    testCases:run("[[2, 1], [3, 2], [1, 3]]","O(n log n)") }),

  mk({ exerciseId:"java_m38_t4_ex_5", position:5, level:"hard", type:"code_scratch",
    title:"Comparator Chaining (multi-key, mixed direction)",
    instructions:"Sort people {name,age} by age DESCENDING, then name ascending for ties. Test (Ann,30),(Bob,25),(Cara,30),(Dan,25). Print 'name:age' space-separated and complexity.",
    expectedSolution:`import java.util.*;
public class ChainCmp {
    record P(String name,int age){}
    public static void main(String[] x){ List<P> ps=new ArrayList<>(List.of(new P("Ann",30),new P("Bob",25),new P("Cara",30),new P("Dan",25)));
        ps.sort(Comparator.comparingInt(P::age).reversed().thenComparing(P::name));
        StringBuilder sb=new StringBuilder(); for(P p:ps) sb.append(p.name()+":"+p.age()+" ");
        System.out.println(sb.toString().trim());  // Ann:30 Cara:30 Bob:25 Dan:25
        System.out.println("O(n log n)"); }
}`,
    hints:["comparingInt(P::age).reversed().thenComparing(P::name)","reversed() flips only the age key, not the name key","Age 30 group first (Ann,Cara), then age 25 (Bob,Dan)"],
    testCases:run("Ann:30 Cara:30 Bob:25 Dan:25","O(n log n)") }),

  // ═══ T5 — Sort Synthesis: When to use which ═══
  mk({ exerciseId:"java_m38_t5_ex_1", position:1, level:"easy", type:"predict_output",
    title:"Which common sorts are stable?",
    instructions:"Classify each as STABLE or NOT stable: (a) Merge sort, (b) Quick sort, (c) Heap sort, (d) Insertion sort, (e) Counting sort.",
    expectedSolution:"(a) Merge sort — STABLE\n(b) Quick sort — NOT stable\n(c) Heap sort — NOT stable\n(d) Insertion sort — STABLE\n(e) Counting sort — STABLE (when implemented with a stable emit)\n\nRule of thumb: merge/insertion/counting preserve equal-key order; quick/heap do not.",
    hints:["Stable = equal keys keep their original relative order","Merge & insertion are the classic stable ones","Heap and quick reorder equal elements"],
    testCases:txt("Merge sort — STABLE") }),

  mk({ exerciseId:"java_m38_t5_ex_2", position:2, level:"easy", type:"predict_output",
    title:"When does quicksort degrade to O(n²)?",
    instructions:"Describe the input that triggers quicksort's worst case with a naive (last-element) pivot, and the fix.",
    expectedSolution:"Worst case O(n²): already-sorted (or reverse-sorted) input with a fixed last/first-element pivot — every partition is maximally unbalanced (size n-1 and 0).\n\nFix: randomized pivot OR median-of-three pivot — makes the worst case astronomically unlikely and restores expected O(n log n).",
    hints:["Bad pivot → unbalanced partitions","Sorted input is the classic trap for last-element pivot","Randomize or median-of-three"],
    testCases:txt("O(n²)") }),

  mk({ exerciseId:"java_m38_t5_ex_3", position:3, level:"medium", type:"predict_output",
    title:"Choose the right sort for the scenario",
    instructions:"Pick the best sort for each: (1) nearly-sorted array, (2) sort 1B integers in range 0..255, (3) need guaranteed O(n log n) worst case + stability, (4) in-place with O(1) extra space and O(n log n).",
    expectedSolution:"(1) nearly-sorted → INSERTION SORT (O(n) best case on almost-sorted data).\n(2) 1B ints in 0..255 → COUNTING SORT (k=256 tiny, O(n+k)≈O(n)).\n(3) guaranteed O(n log n) + stable → MERGE SORT.\n(4) in-place, O(1) space, O(n log n) → HEAP SORT (quicksort is in-place but O(n²) worst case).",
    hints:["Nearly sorted favours insertion sort","Tiny value range favours counting sort","Merge = stable guaranteed n log n; heap = in-place guaranteed n log n"],
    testCases:txt("INSERTION SORT") }),

  mk({ exerciseId:"java_m38_t5_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Insertion sort wins on nearly-sorted data",
    instructions:"Implement insertion sort and sort the nearly-sorted array [1,2,4,3,5,6]. Print the result and the BEST-case complexity.",
    expectedSolution:`import java.util.*;
public class InsertionNearly {
    public static void main(String[] x){ int[] a={1,2,4,3,5,6};
        for(int i=1;i<a.length;i++){ int key=a[i],j=i-1; while(j>=0&&a[j]>key){ a[j+1]=a[j]; j--; } a[j+1]=key; }
        System.out.println(Arrays.toString(a)); System.out.println("O(n) best case"); }
}`,
    hints:["Insertion sort does ~n comparisons on already-sorted data","Each element shifts only as far as needed","Best case O(n), worst O(n²)"],
    testCases:run("[1, 2, 3, 4, 5, 6]","O(n) best case") }),

  mk({ exerciseId:"java_m38_t5_ex_5", position:5, level:"easy", type:"predict_output",
    title:"In-place vs extra-space sorts",
    instructions:"Classify the extra space: (a) Merge sort, (b) Quick sort, (c) Heap sort, (d) Counting sort.",
    expectedSolution:"(a) Merge sort — O(n) extra (the merge buffer).\n(b) Quick sort — O(log n) extra (recursion stack) — considered in-place.\n(c) Heap sort — O(1) extra — truly in-place.\n(d) Counting sort — O(n+k) extra (count + output arrays).\n\nIf memory is tight, heap sort is the in-place O(n log n) choice.",
    hints:["Merge needs a buffer; counting needs count+output arrays","Quicksort's only extra is the recursion stack","Heap sort sorts within the original array"],
    testCases:txt("Heap sort — O(1)") }),
];

const KEEP = new Set([
  ...EXERCISES.map(e => e.exerciseId),
  // Section-B elementary sorts in T1:
  "java_m38_t1_ex_13","java_m38_t1_ex_14","java_m38_t1_ex_15","java_m38_t1_ex_16","java_m38_t1_ex_17","java_m38_t1_ex_18",
]);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const E = mongoose.connection.collection("proexercises");
  for (const e of EXERCISES) await E.updateOne({ exerciseId: e.exerciseId }, { $set: e }, { upsert: true });
  console.log(`✓ ${EXERCISES.length} topic-specific exercises written`);
  const all = await E.find({ moduleId: MODULE_ID }, { projection: { exerciseId: 1 } }).toArray();
  const del = all.map(d => d.exerciseId).filter(id => !KEEP.has(id));
  if (del.length) { await E.deleteMany({ exerciseId: { $in: del } }); console.log(`✓ deleted ${del.length} leftover duplicate slots`); }
  const total = await E.countDocuments({ moduleId: MODULE_ID });
  const titles = new Set((await E.find({ moduleId: MODULE_ID }, { projection: { title: 1 } }).toArray()).map(d => d.title));
  console.log(`\n✅ M38 re-authored. ${total} docs, ${titles.size} distinct titles.`);
  await mongoose.disconnect();
}
main().catch((err) => { console.error(err); process.exit(1); });
