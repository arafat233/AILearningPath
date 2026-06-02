/**
 * reauthorM36Heaps.js — Fix partial duplicate-exercise bug in M36 (Heaps).
 *
 * In M36, T1 and T2 already have correct unique content; T3, T4, T5 are
 * IDENTICAL (same 11 exercises). This re-authors ONLY T3/T4/T5 with
 * topic-specific content (problems NOT used in T1/T2), overwriting ex_1..ex_N
 * slots in place, and deletes leftover duplicate slots in those three topics.
 * T1 and T2 are left untouched. Idempotent.
 *
 * Usage: node config/reauthorM36Heaps.js
 */
import "dotenv/config";
import mongoose from "mongoose";
const MODULE_ID = "java_m36";
const DIFF = { warmup:0.17, easy:0.40, medium:0.65, hard:0.90 }, XP = { warmup:10, easy:15, medium:20, hard:30 };
function mk(o){ const topicId=o.exerciseId.replace(/_(ex|pm)_\d+$/,"");
  return { exerciseId:o.exerciseId, topicId, moduleId:MODULE_ID, trackKey:"pro_java", position:o.position,
    level:o.level, type:o.type, title:o.title, scenario:o.scenario||"", instructions:o.instructions,
    starterCode:o.starterCode||"", expectedSolution:o.expectedSolution, blanks:[], testCases:o.testCases,
    hints:o.hints, difficulty:DIFF[o.level]??0.5, xpReward:XP[o.level]??15 }; }
const run=(...s)=>[{type:"execution",expected_stdout_contains:s}];
const txt=(e)=>[{type:"text_match",expected:e}];

const EXERCISES = [
  // ═══ T3 — Priority Queue Design: Lazy Deletion, Custom Comparators ═══
  mk({ exerciseId:"java_m36_t3_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Lazy deletion — why heaps can't remove arbitrary elements directly",
    instructions:"A binary heap supports O(log n) insert and extract-min/max, but not O(log n) removal of an ARBITRARY value (finding it is O(n)). Explain the 'lazy deletion' workaround.",
    expectedSolution:"Problem: a heap finds an arbitrary element in O(n) — removal would be slow.\n\nLazy deletion: keep a 'toDelete' multiset (HashMap value→count). To 'remove(x)', just record it. Before any peek/poll, repeatedly check the top: if it's marked deleted, pop it and decrement its count. The element is only physically removed when it bubbles to the top.\n\nResult: remove(x) is O(1) to mark; the cost is paid lazily during poll/peek. Used in Sliding Window Median, Stock Price Fluctuation, etc.",
    hints:["Marking is O(1); cleanup happens at the top","Skip/discard deleted entries when they reach the top","Pair two heaps or a balance counter to keep sizes right"],
    testCases:txt("lazy") }),
  mk({ exerciseId:"java_m36_t3_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Design a Binary Max-Heap from scratch",
    instructions:"Implement an array-backed max-heap with insert and extractMax (siftUp/siftDown). Insert 3,1,4,1,5,9,2,6 then extractMax until empty. Print the extraction sequence and complexity.",
    expectedSolution:`import java.util.*;
public class MaxHeap {
    static int[] h=new int[100]; static int n=0;
    static void push(int v){ h[n]=v; int i=n++; while(i>0&&h[(i-1)/2]<h[i]){ int t=h[i];h[i]=h[(i-1)/2];h[(i-1)/2]=t; i=(i-1)/2; } }
    static int pop(){ int top=h[0]; h[0]=h[--n]; int i=0;
        while(true){ int l=2*i+1,r=2*i+2,big=i; if(l<n&&h[l]>h[big]) big=l; if(r<n&&h[r]>h[big]) big=r;
            if(big==i) break; int t=h[i];h[i]=h[big];h[big]=t; i=big; } return top; }
    public static void main(String[] x){ for(int v:new int[]{3,1,4,1,5,9,2,6}) push(v);
        StringBuilder sb=new StringBuilder(); while(n>0) sb.append(pop()+" ");
        System.out.println(sb.toString().trim());  // 9 6 5 4 3 2 1 1
        System.out.println("O(log n) per op"); }
}`,
    hints:["siftUp on insert: swap with parent while bigger","siftDown on extract: swap with the larger child","Extracting all yields descending order"],
    testCases:run("9 6 5 4 3 2 1 1","O(log n) per op") }),
  mk({ exerciseId:"java_m36_t3_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"PriorityQueue with a Custom Comparator (by frequency, then value)",
    instructions:"Order distinct numbers by frequency DESCENDING, breaking ties by value ASCENDING. For [1,1,2,2,2,3], print the order they'd be polled and complexity.",
    expectedSolution:`import java.util.*;
public class CustomCmpPQ {
    public static void main(String[] x){ int[] a={1,1,2,2,2,3};
        Map<Integer,Integer> f=new HashMap<>(); for(int v:a) f.merge(v,1,Integer::sum);
        PriorityQueue<Integer> pq=new PriorityQueue<>((p,q)-> f.get(p).equals(f.get(q)) ? p-q : f.get(q)-f.get(p));
        pq.addAll(f.keySet());
        StringBuilder sb=new StringBuilder(); while(!pq.isEmpty()) sb.append(pq.poll()+" ");
        System.out.println(sb.toString().trim());  // 2 1 3
        System.out.println("O(n log n)"); }
}`,
    hints:["Comparator: compare frequencies first (descending)","Tie-break on value ascending","2 (freq 3), 1 (freq 2), 3 (freq 1)"],
    testCases:run("2 1 3","O(n log n)") }),
  mk({ exerciseId:"java_m36_t3_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Find K Pairs with Smallest Sums (LeetCode #373)",
    instructions:"Given nums1=[1,7,11], nums2=[2,4,6], k=3, return the k pairs with the smallest sums (min-heap). Print the pairs and complexity.",
    expectedSolution:`import java.util.*;
public class KSmallestPairs {
    public static void main(String[] x){ int[] n1={1,7,11},n2={2,4,6}; int k=3;
        PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->(n1[a[0]]+n2[a[1]])-(n1[b[0]]+n2[b[1]]));
        for(int i=0;i<n1.length&&i<k;i++) pq.add(new int[]{i,0});
        StringBuilder sb=new StringBuilder();
        while(k-->0&&!pq.isEmpty()){ int[] c=pq.poll(); sb.append("["+n1[c[0]]+","+n2[c[1]]+"] ");
            if(c[1]+1<n2.length) pq.add(new int[]{c[0],c[1]+1}); }
        System.out.println(sb.toString().trim());  // [1,2] [1,4] [1,6]
        System.out.println("O(k log k)"); }
}`,
    hints:["Seed the heap with pairs (i,0)","Pop the smallest; push its (i, j+1) neighbour","First three: (1,2),(1,4),(1,6)"],
    testCases:run("[1,2] [1,4] [1,6]","O(k log k)") }),
  mk({ exerciseId:"java_m36_t3_ex_5", position:5, level:"hard", type:"code_scratch",
    title:"Heap with Lazy Deletion supporting remove(x)",
    instructions:"Build a min-heap that supports remove(arbitrary x) via lazy deletion. Sequence: add 5, add 3, add 8, remove(3), then poll. Print the polled value and complexity of remove.",
    expectedSolution:`import java.util.*;
public class LazyHeap {
    static PriorityQueue<Integer> pq=new PriorityQueue<>(); static Map<Integer,Integer> del=new HashMap<>();
    static void add(int v){ pq.add(v); }
    static void remove(int v){ del.merge(v,1,Integer::sum); }   // O(1) lazy mark
    static void prune(){ while(!pq.isEmpty()&&del.getOrDefault(pq.peek(),0)>0){ del.merge(pq.peek(),-1,Integer::sum); pq.poll(); } }
    static int poll(){ prune(); return pq.poll(); }
    public static void main(String[] x){ add(5); add(3); add(8); remove(3);
        System.out.println("polled=" + poll());   // polled=5 (3 was lazily deleted)
        System.out.println("remove is O(1)"); }
}`,
    hints:["remove(x) just records x in a 'deleted' map — O(1)","Before poll/peek, discard any top that is marked deleted","3 is skipped, so poll returns 5"],
    testCases:run("polled=5","remove is O(1)") }),

  // ═══ T4 — K-Way Merge: K Sorted Lists, K Closest Points ═══
  mk({ exerciseId:"java_m36_t4_ex_1", position:1, level:"warmup", type:"predict_output",
    title:"Trace a k-way merge with a min-heap",
    instructions:"Merge 3 sorted lists [1,4], [2,5], [3,6] using a min-heap of (value, listIndex). List the output order and explain what the heap holds at each step.",
    expectedSolution:"Heap seeded with first of each list: {1,2,3}.\nPoll 1 → output 1, push 4 (next in list0) → heap {2,3,4}\nPoll 2 → output 2, push 5 → {3,4,5}\nPoll 3 → output 3, push 6 → {4,5,6}\nPoll 4 → output 4 → {5,6}\nPoll 5 → output 5 → {6}\nPoll 6 → output 6 → {}\n\nOutput: 1 2 3 4 5 6. Heap holds at most k elements (one frontier per list).",
    hints:["Heap holds the current front of each list (≤ k items)","Poll the min, then push the next element from THAT list","Total O(N log k)"],
    testCases:txt("1 2 3 4 5 6") }),
  mk({ exerciseId:"java_m36_t4_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Merge K Sorted Arrays",
    instructions:"Merge k sorted arrays into one sorted array using a min-heap of (value, array, index). Test [[1,4,7],[2,5,8],[3,6,9]]. Print the merged array and complexity.",
    expectedSolution:`import java.util.*;
public class MergeKArrays {
    public static void main(String[] x){ int[][] a={{1,4,7},{2,5,8},{3,6,9}};
        PriorityQueue<int[]> pq=new PriorityQueue<>((p,q)->p[0]-q[0]); // [val, arr, idx]
        for(int i=0;i<a.length;i++) if(a[i].length>0) pq.add(new int[]{a[i][0],i,0});
        List<Integer> out=new ArrayList<>();
        while(!pq.isEmpty()){ int[] c=pq.poll(); out.add(c[0]); int arr=c[1],idx=c[2]+1;
            if(idx<a[arr].length) pq.add(new int[]{a[arr][idx],arr,idx}); }
        System.out.println(out); System.out.println("O(N log k)"); }
}`,
    hints:["Heap entry = [value, whichArray, indexInArray]","Pop min, push the next element from the same array","Heap size stays <= k"],
    testCases:run("[1, 2, 3, 4, 5, 6, 7, 8, 9]","O(N log k)") }),
  mk({ exerciseId:"java_m36_t4_ex_3", position:3, level:"medium", type:"code_scratch",
    title:"Ugly Number II (LeetCode #264) — k-way merge flavour",
    instructions:"The nth ugly number (only prime factors 2,3,5). Use a min-heap with a dedup set. Test n=10. Print the value and complexity.",
    expectedSolution:`import java.util.*;
public class UglyII {
    public static void main(String[] x){ int n=10;
        PriorityQueue<Long> pq=new PriorityQueue<>(); Set<Long> seen=new HashSet<>();
        pq.add(1L); seen.add(1L); long u=1;
        for(int i=0;i<n;i++){ u=pq.poll(); for(long f:new long[]{2,3,5}){ long nx=u*f; if(seen.add(nx)) pq.add(nx); } }
        System.out.println("ugly=" + u); System.out.println("O(n log n)"); }
}`,
    hints:["Min-heap pops ugly numbers in order","Each popped u spawns 2u, 3u, 5u (dedup with a set)","1,2,3,4,5,6,8,9,10,12 → 10th = 12"],
    testCases:run("ugly=12","O(n log n)") }),
  mk({ exerciseId:"java_m36_t4_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Find K Closest Elements (LeetCode #658)",
    instructions:"Return the k elements closest to x (ties prefer smaller). Test arr=[1,2,3,4,5], k=4, x=3. Print the result and complexity.",
    expectedSolution:`import java.util.*;
public class KClosest {
    public static void main(String[] x){ int[] arr={1,2,3,4,5}; int k=4,target=3;
        int lo=0,hi=arr.length-k;
        while(lo<hi){ int m=lo+(hi-lo)/2;
            if(target-arr[m] > arr[m+k]-target) lo=m+1; else hi=m; }
        List<Integer> res=new ArrayList<>(); for(int i=lo;i<lo+k;i++) res.add(arr[i]);
        System.out.println(res); System.out.println("O(log(n-k) + k)"); }
}`,
    hints:["Binary search the left edge of the k-window","Compare distance of arr[m] vs arr[m+k] to x","[1,2,3,4] is closest to 3"],
    testCases:run("[1, 2, 3, 4]","O(log(n-k) + k)") }),

  // ═══ T5 — Heap Synthesis: Scheduling, Greedy + Heap ═══
  mk({ exerciseId:"java_m36_t5_ex_1", position:1, level:"easy", type:"predict_output",
    title:"When should you reach for a heap?",
    instructions:"Give the signals that a problem wants a heap (priority queue) rather than sorting or a plain array, with a one-line example each.",
    expectedSolution:"Use a heap when:\n1. You need the MIN/MAX repeatedly while inserting — e.g. Dijkstra, task scheduling.\n2. 'Top K' / 'Kth largest' — keep a size-k heap → O(n log k) beats full sort.\n3. STREAMING data where the full set isn't known up front — e.g. median of a data stream (two heaps).\n4. K-WAY MERGE — one heap entry per source.\n\nPrefer sorting when you need ALL elements ordered once; prefer quickselect for a single Kth element with no streaming.",
    hints:["Repeated min/max during inserts → heap","Top-K with a bounded heap → O(n log k)","Streaming / k-way merge → heap shines"],
    testCases:txt("Top K") }),
  mk({ exerciseId:"java_m36_t5_ex_2", position:2, level:"medium", type:"code_scratch",
    title:"Minimum Cost to Connect Sticks (LeetCode #1167) — Huffman/greedy",
    instructions:"Repeatedly connect the two cheapest sticks (cost = their sum) until one remains; minimise total cost. Test [2,4,3]. Print the total cost and complexity.",
    expectedSolution:`import java.util.*;
public class ConnectSticks {
    public static void main(String[] x){ int[] s={2,4,3}; PriorityQueue<Integer> pq=new PriorityQueue<>();
        for(int v:s) pq.add(v); int total=0;
        while(pq.size()>1){ int a=pq.poll(),b=pq.poll(); total+=a+b; pq.add(a+b); }
        System.out.println("cost=" + total); System.out.println("O(n log n)"); }
}`,
    hints:["Always merge the two smallest (greedy / Huffman)","Push the merged stick back","2+3=5, then 5+4=9 → total 14"],
    testCases:run("cost=14","O(n log n)") }),
  mk({ exerciseId:"java_m36_t5_ex_3", position:3, level:"hard", type:"code_scratch",
    title:"Minimum Number of Refueling Stops (LeetCode #871) — max-heap greedy",
    instructions:"Reach target with startFuel; at each passed station you may later refuel (max-heap of seen fuels). Test target=100, startFuel=10, stations=[[10,60],[20,30],[30,30],[60,40]]. Print the min stops and complexity.",
    expectedSolution:`import java.util.*;
public class Refuel {
    public static void main(String[] x){ int target=100,fuel=10; int[][] st={{10,60},{20,30},{30,30},{60,40}};
        PriorityQueue<Integer> pq=new PriorityQueue<>(Collections.reverseOrder());
        int i=0,stops=0,pos=0;
        while(fuel<target){ while(i<st.length&&st[i][0]<=fuel){ pq.add(st[i][1]); i++; }
            if(pq.isEmpty()){ stops=-1; break; } fuel+=pq.poll(); stops++; }
        System.out.println("stops=" + stops); System.out.println("O(n log n)"); }
}`,
    hints:["Add every reachable station's fuel to a max-heap","When you can't reach target, refuel with the biggest seen tank","target=100 needs 2 stops"],
    testCases:run("stops=2","O(n log n)") }),
  mk({ exerciseId:"java_m36_t5_ex_4", position:4, level:"medium", type:"code_scratch",
    title:"Maximum Events That Can Be Attended (LeetCode #1353) — greedy + heap",
    instructions:"Attend at most one event per day, each event [start,end] attendable on any day in range. Maximise events attended (min-heap of end days). Test [[1,2],[2,3],[3,4]]. Print the count and complexity.",
    expectedSolution:`import java.util.*;
public class MaxEvents {
    public static void main(String[] x){ int[][] ev={{1,2},{2,3},{3,4}};
        Arrays.sort(ev,(a,b)->a[0]-b[0]); PriorityQueue<Integer> pq=new PriorityQueue<>();
        int i=0,day=0,count=0,n=ev.length;
        while(i<n||!pq.isEmpty()){ if(pq.isEmpty()) day=ev[i][0];
            while(i<n&&ev[i][0]<=day) pq.add(ev[i++][1]);
            pq.poll(); count++; day++;
            while(!pq.isEmpty()&&pq.peek()<day) pq.poll(); }
        System.out.println("events=" + count); System.out.println("O(n log n)"); }
}`,
    hints:["Sort by start; min-heap of end days for currently-open events","Each day attend the event ending soonest","All 3 events can be attended → 3"],
    testCases:run("events=3","O(n log n)") }),
  mk({ exerciseId:"java_m36_t5_ex_5", position:5, level:"easy", type:"predict_output",
    title:"Heap vs Sort vs Quickselect for 'Kth largest'",
    instructions:"For finding the Kth largest element, compare three approaches by time/space and when each wins.",
    expectedSolution:"Sort then index: O(n log n) time, simple — fine when you also need the full order or n is small.\nMin-heap of size k: O(n log k) time, O(k) space — best for STREAMING or when k << n (keep only the top k).\nQuickselect: O(n) average time, O(1) extra — fastest for a ONE-OFF Kth element in memory, but O(n²) worst case and not streaming-friendly.\n\nRule: streaming/top-k → heap; single in-memory Kth → quickselect; need everything sorted → sort.",
    hints:["Heap: O(n log k), great for streams / small k","Quickselect: O(n) average, in place, one-off","Sort: O(n log n), when you need full order"],
    testCases:txt("quickselect") }),
];

// Re-author ONLY t3/t4/t5; never touch t1/t2.
const NEW_IDS = new Set(EXERCISES.map(e => e.exerciseId));
async function main(){ await mongoose.connect(process.env.MONGO_URI); const E=mongoose.connection.collection("proexercises");
  for(const e of EXERCISES) await E.updateOne({exerciseId:e.exerciseId},{$set:e},{upsert:true});
  console.log(`✓ ${EXERCISES.length} topic-specific exercises written (T3/T4/T5)`);
  // delete leftover dup slots ONLY in t3/t4/t5
  const reauthored = await E.find({ topicId: { $in: ["java_m36_t3","java_m36_t4","java_m36_t5"] } }, { projection:{exerciseId:1} }).toArray();
  const del = reauthored.map(d=>d.exerciseId).filter(id=>!NEW_IDS.has(id));
  if(del.length){ await E.deleteMany({exerciseId:{$in:del}}); console.log(`✓ deleted ${del.length} leftover duplicate slots in T3/T4/T5`); }
  const all=await E.find({moduleId:MODULE_ID},{projection:{title:1}}).toArray();
  console.log(`\n✅ M36 re-authored. ${all.length} docs, ${new Set(all.map(d=>d.title)).size} distinct titles.`);
  await mongoose.disconnect(); }
main().catch(e=>{console.error(e);process.exit(1);});
