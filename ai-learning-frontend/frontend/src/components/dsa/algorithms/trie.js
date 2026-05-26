/**
 * trie — prefix tree insert + search step generators.
 *
 * Used by M35-T5 (Trie — Prefix Tree for Autocomplete and Word Search).
 *
 * Trie node shape (used in frames):
 *   { id: string, label: string, isWord: boolean, children: TrieNode[], state }
 *
 * "label" is the single character on the edge into this node (root has
 * label "*"). state is used by the renderer.
 */

export const TRIE_CODE = `// Trie insert + search
class TrieNode {
  Map<Character, TrieNode> children = new HashMap<>();
  boolean isWord;
}

void insert(TrieNode root, String word) {
  TrieNode n = root;
  for (char c : word.toCharArray()) {
    n = n.children.computeIfAbsent(c, k -> new TrieNode());
  }
  n.isWord = true;
}

boolean search(TrieNode root, String word) {
  TrieNode n = root;
  for (char c : word.toCharArray()) {
    n = n.children.get(c);
    if (n == null) return false;
  }
  return n.isWord;
}`;

export const LINE_BY_PHASE = { init: 7, examine: 10, descend: 10, create: 10, "not-found": 19, found: 21, done: 12 };

let _id = 0;
const uid = () => `t${_id++}`;

export function makeTrie() {
  _id = 0;
  return { id: uid(), label: "·", isWord: false, children: {}, state: "default" };
}

// Deep clone (used to snapshot the root per frame). Excludes state field,
// which the frame sets fresh.
function clone(node, stateByPath = {}, path = "") {
  const childrenKeys = Object.keys(node.children).sort();
  const cloned = {
    id: node.id,
    label: node.label,
    isWord: node.isWord,
    children: {},
    state: stateByPath[path] || "default",
  };
  for (const k of childrenKeys) {
    cloned.children[k] = clone(node.children[k], stateByPath, path + k);
  }
  return cloned;
}

// Insert a word — returns updated root (mutates).
export function insertWord(root, word) {
  let n = root;
  for (const ch of word) {
    if (!n.children[ch]) {
      n.children[ch] = { id: uid(), label: ch, isWord: false, children: {}, state: "default" };
    }
    n = n.children[ch];
  }
  n.isWord = true;
  return root;
}

export function generateTrieInsertSteps(root, word) {
  const frames = [];

  frames.push({
    root: clone(root),
    word,
    cursor: 0,
    pathSoFar: "",
    phase: "init",
    step: {
      description: `insert("${word}") into the trie.`,
      detail: "Walk down character by character. Create missing children as needed.",
    },
  });

  let n = root;
  let pathSoFar = "";
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const childExists = !!n.children[ch];
    pathSoFar += ch;

    frames.push({
      root: clone(root, { [pathSoFar.slice(0, -1)]: "active" }),
      word,
      cursor: i,
      pathSoFar: pathSoFar.slice(0, -1),
      phase: "examine",
      step: {
        description: `At node "${pathSoFar.slice(0, -1) || "·"}", char '${ch}'.`,
        detail: childExists ? `Edge '${ch}' exists — descend.` : `Edge '${ch}' missing — create new child.`,
      },
    });

    if (!childExists) {
      n.children[ch] = { id: uid(), label: ch, isWord: false, children: {}, state: "default" };
    }
    n = n.children[ch];

    frames.push({
      root: clone(root, { [pathSoFar]: "new" }),
      word,
      cursor: i + 1,
      pathSoFar,
      phase: childExists ? "descend" : "create",
      step: {
        description: childExists ? `Descended into existing node '${ch}'.` : `Created and descended into new node '${ch}'.`,
        detail: `Path so far: ${pathSoFar}`,
      },
    });
  }

  n.isWord = true;
  frames.push({
    root: clone(root, { [pathSoFar]: "found" }),
    word,
    cursor: word.length,
    pathSoFar,
    phase: "done",
    step: {
      description: `Set isWord = true on terminal node.`,
      detail: `"${word}" is now in the trie.`,
    },
  });

  return frames;
}

export function generateTrieSearchSteps(root, word) {
  const frames = [];

  frames.push({
    root: clone(root),
    word,
    cursor: 0,
    pathSoFar: "",
    phase: "init",
    step: {
      description: `search("${word}").`,
      detail: "Walk character by character. Miss → return false.",
    },
  });

  let n = root;
  let pathSoFar = "";
  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const childExists = !!n.children[ch];
    pathSoFar += ch;

    frames.push({
      root: clone(root, { [pathSoFar.slice(0, -1)]: "active" }),
      word,
      cursor: i,
      pathSoFar: pathSoFar.slice(0, -1),
      phase: "examine",
      step: {
        description: `At "${pathSoFar.slice(0, -1) || "·"}", look for edge '${ch}'.`,
        detail: childExists ? "Found — descend." : "Missing — abort.",
      },
    });

    if (!childExists) {
      frames.push({
        root: clone(root, { [pathSoFar.slice(0, -1)]: "not-found" }),
        word,
        cursor: i,
        pathSoFar: pathSoFar.slice(0, -1),
        phase: "not-found",
        step: { description: `Edge '${ch}' missing — return false.`, detail: "" },
      });
      return frames;
    }

    n = n.children[ch];
    frames.push({
      root: clone(root, { [pathSoFar]: "active" }),
      word,
      cursor: i + 1,
      pathSoFar,
      phase: "descend",
      step: { description: `Descended into '${ch}'.`, detail: `Path so far: ${pathSoFar}` },
    });
  }

  if (n.isWord) {
    frames.push({
      root: clone(root, { [pathSoFar]: "found" }),
      word,
      cursor: word.length,
      pathSoFar,
      phase: "found",
      step: { description: `Terminal node has isWord = true.`, detail: `"${word}" is in the trie — return true.` },
    });
  } else {
    frames.push({
      root: clone(root, { [pathSoFar]: "not-found" }),
      word,
      cursor: word.length,
      pathSoFar,
      phase: "not-found",
      step: { description: `Reached node but isWord = false.`, detail: `"${word}" is a prefix only — return false.` },
    });
  }
  return frames;
}

export function buildDemoTrie() {
  const root = makeTrie();
  for (const w of ["cat", "car", "card", "care", "dog", "do", "dot"]) {
    insertWord(root, w);
    // Wipe state from insert side-effects so initial render is clean.
  }
  return clone(root);
}
