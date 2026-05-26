/**
 * hashGrouping — Group Anagrams via HashMap.
 *
 * Used by M34-T2 (HashMap Patterns — Grouping, Frequency, Sliding Window).
 *
 * Canonical pattern: key = some derived value (sorted chars), value =
 * list of inputs sharing that key. `computeIfAbsent` is the central
 * idiom — visualised explicitly as "key seen → append" vs "key new →
 * create bucket".
 *
 * Frame shape:
 *   {
 *     words: string[],
 *     currentIdx: number,             // word being processed (-1 before start)
 *     currentKey: string | null,      // sorted form of current word
 *     groups: Record<key, string[]>,
 *     activeKey: string | null,
 *     phase: 'init'|'compute-key'|'append-existing'|'create-bucket'|'done',
 *     step: { description, detail }
 *   }
 */

export const HASH_GROUPING_CODE = `// Group anagrams (HashMap<String, List<String>>)
List<List<String>> groupAnagrams(String[] words) {
  Map<String, List<String>> groups = new HashMap<>();
  for (String w : words) {
    char[] chars = w.toCharArray();
    Arrays.sort(chars);
    String key = new String(chars);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
  }
  return new ArrayList<>(groups.values());
}`;

export const LINE_BY_PHASE = { init: 3, "compute-key": 7, "append-existing": 8, "create-bucket": 8, done: 10 };

function sortedKey(s) {
  return s.toLowerCase().split("").sort().join("");
}

export function generateGroupAnagramsSteps(words) {
  const groups = {};
  const frames = [];

  frames.push({
    words: [...words],
    currentIdx: -1, currentKey: null,
    groups: { ...groups },
    activeKey: null,
    phase: "init",
    step: {
      description: `Group ${words.length} strings by anagram class.`,
      detail: "Derived key = sorted chars. Two words are anagrams iff their sorted forms match.",
    },
  });

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const key = sortedKey(w);

    frames.push({
      words: [...words],
      currentIdx: i, currentKey: key,
      groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, [...v]])),
      activeKey: key,
      phase: "compute-key",
      step: {
        description: `Word "${w}" → sort chars → key "${key}".`,
        detail: groups[key] ? `Bucket exists — will append.` : `Bucket doesn't exist — will create.`,
      },
    });

    const existed = !!groups[key];
    if (!existed) groups[key] = [];
    groups[key].push(w);

    frames.push({
      words: [...words],
      currentIdx: i, currentKey: key,
      groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, [...v]])),
      activeKey: key,
      phase: existed ? "append-existing" : "create-bucket",
      step: {
        description: existed
          ? `groups["${key}"].add("${w}") — now ${groups[key].length} word${groups[key].length === 1 ? "" : "s"}.`
          : `New bucket: groups["${key}"] = ["${w}"].`,
        detail: `computeIfAbsent does both moves in one call.`,
      },
    });
  }

  frames.push({
    words: [...words],
    currentIdx: words.length, currentKey: null,
    groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, [...v]])),
    activeKey: null,
    phase: "done",
    step: {
      description: `Done — ${Object.keys(groups).length} anagram group${Object.keys(groups).length === 1 ? "" : "s"}.`,
      detail: "O(n · k log k) total — one sort per word.",
    },
  });
  return frames;
}

export const DEMO_WORDS = ["eat", "tea", "tan", "ate", "nat", "bat", "tab", "rat"];
