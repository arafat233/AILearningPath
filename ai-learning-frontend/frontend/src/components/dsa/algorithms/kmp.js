/**
 * kmp — KMP pattern-matching step generator.
 *
 * Used by M31-T2 (Pattern Matching — KMP). Failure table is pre-built
 * and shown statically; the animation focuses on the matching phase,
 * which is where KMP's "text pointer never backs up" insight pays off.
 *
 * Frame shape:
 *   {
 *     text: string,
 *     pattern: string,
 *     fail: number[],
 *     i: number,            // text index
 *     j: number,            // pattern index
 *     matches: number[],    // start indices of completed matches
 *     action: 'init'|'compare'|'advance'|'fallback'|'match'|'mismatch_start',
 *     step: { description, detail }
 *   }
 */

export const KMP_CODE = `// KMP search — text pointer never backs up
int[] kmp(String t, String p) {
  int[] fail = buildFailure(p);
  List<Integer> matches = new ArrayList<>();
  int j = 0;
  for (int i = 0; i < t.length(); i++) {
    while (j > 0 && p.charAt(j) != t.charAt(i)) {
      j = fail[j - 1];        // fall back via failure table
    }
    if (p.charAt(j) == t.charAt(i)) j++;
    if (j == p.length()) {
      matches.add(i - j + 1);
      j = fail[j - 1];        // keep going for overlapping matches
    }
  }
  return matches.stream().mapToInt(x -> x).toArray();
}

int[] buildFailure(String p) {
  int[] fail = new int[p.length()];
  int k = 0;
  for (int i = 1; i < p.length(); i++) {
    while (k > 0 && p.charAt(k) != p.charAt(i)) k = fail[k - 1];
    if (p.charAt(k) == p.charAt(i)) k++;
    fail[i] = k;
  }
  return fail;
}`;

export function buildFailureTable(pattern) {
  const fail = new Array(pattern.length).fill(0);
  let k = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (k > 0 && pattern[k] !== pattern[i]) k = fail[k - 1];
    if (pattern[k] === pattern[i]) k++;
    fail[i] = k;
  }
  return fail;
}

export function generateKMPSteps(text, pattern) {
  const fail = buildFailureTable(pattern);
  const frames = [];
  const matches = [];

  if (pattern.length === 0) {
    frames.push({
      text, pattern, fail, i: 0, j: 0, matches: [], action: "init",
      step: { description: "Empty pattern — nothing to search.", detail: "" },
    });
    return frames;
  }

  frames.push({
    text, pattern, fail, i: 0, j: 0, matches: [], action: "init",
    step: {
      description: `Search "${pattern}" in "${text}".`,
      detail: `Failure table: [${fail.join(", ")}]. Text pointer i never backs up.`,
    },
  });

  let j = 0;
  for (let i = 0; i < text.length; i++) {
    // Fall-back loop — emit a frame for each fallback step
    while (j > 0 && pattern[j] !== text[i]) {
      frames.push({
        text, pattern, fail, i, j, matches: [...matches], action: "fallback",
        step: {
          description: `Mismatch at text[${i}]="${text[i]}" vs pattern[${j}]="${pattern[j]}".`,
          detail: `Fall back: j = fail[${j - 1}] = ${fail[j - 1]}. (Text index i stays — no backtrack!)`,
        },
      });
      j = fail[j - 1];
    }

    const matched = pattern[j] === text[i];
    frames.push({
      text, pattern, fail, i, j, matches: [...matches], action: "compare",
      step: {
        description: `Compare text[${i}]="${text[i]}" with pattern[${j}]="${pattern[j]}".`,
        detail: matched ? "Match — advance both." : "Mismatch — will fall back via failure table.",
      },
    });

    if (matched) {
      j++;
      if (j === pattern.length) {
        const startIdx = i - j + 1;
        matches.push(startIdx);
        frames.push({
          text, pattern, fail, i, j, matches: [...matches], action: "match",
          step: {
            description: `Found match at text[${startIdx}..${i}].`,
            detail: `Continue: j = fail[${j - 1}] = ${fail[j - 1]} (allows overlapping matches).`,
          },
        });
        j = fail[j - 1];
      }
    }
  }

  frames.push({
    text, pattern, fail, i: text.length, j, matches: [...matches], action: "init",
    step: {
      description: `Done — ${matches.length} match${matches.length === 1 ? "" : "es"} found.`,
      detail: matches.length === 0 ? "Pattern not present in text." : `At indices: [${matches.join(", ")}].`,
    },
  });

  return frames;
}
