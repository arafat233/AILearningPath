/**
 * anagram — frequency-counting anagram check.
 *
 * Used by M31-T4 (Anagram & Frequency Problems). Standard recipe:
 * single freq map; +1 for each char in s1, −1 for each char in s2.
 * If any cell goes negative at -1 time, not an anagram. At the end
 * all cells must be zero.
 *
 * Frame shape:
 *   {
 *     s1: string, s2: string,
 *     freq: Record<char, number>,
 *     phase: 'init'|'inc'|'dec'|'mismatch'|'done',
 *     activeChar: string|null,
 *     activeS1Idx: number, activeS2Idx: number,
 *     isAnagram: boolean | null,
 *     step: { description, detail }
 *   }
 */

export const ANAGRAM_CODE = `// Are s1 and s2 anagrams?
boolean isAnagram(String s1, String s2) {
  if (s1.length() != s2.length()) return false;
  int[] freq = new int[26];                       // a-z only for demo
  for (char c : s1.toCharArray()) freq[c - 'a']++;
  for (char c : s2.toCharArray()) {
    if (--freq[c - 'a'] < 0) return false;        // dipped below zero
  }
  return true;
}`;

export function generateAnagramSteps(s1, s2) {
  const frames = [];

  if (s1.length !== s2.length) {
    frames.push({
      s1, s2, freq: {}, phase: "done",
      activeChar: null, activeS1Idx: -1, activeS2Idx: -1,
      isAnagram: false,
      step: { description: `Length mismatch (${s1.length} vs ${s2.length}).`, detail: "Can't be anagrams." },
    });
    return frames;
  }

  const freq = {};
  const allChars = new Set([...s1, ...s2]);
  for (const c of allChars) freq[c] = 0;

  frames.push({
    s1, s2, freq: { ...freq }, phase: "init",
    activeChar: null, activeS1Idx: -1, activeS2Idx: -1, isAnagram: null,
    step: { description: `Check if "${s1}" and "${s2}" are anagrams.`, detail: "Count chars in s1, subtract chars in s2. End at all-zero ⇒ yes." },
  });

  // Phase 1: count s1
  for (let i = 0; i < s1.length; i++) {
    const c = s1[i];
    freq[c]++;
    frames.push({
      s1, s2, freq: { ...freq }, phase: "inc",
      activeChar: c, activeS1Idx: i, activeS2Idx: -1, isAnagram: null,
      step: { description: `s1[${i}] = '${c}' → freq['${c}']++ = ${freq[c]}.`, detail: "" },
    });
  }

  // Phase 2: decrement from s2
  for (let i = 0; i < s2.length; i++) {
    const c = s2[i];
    if (!(c in freq)) freq[c] = 0;
    freq[c]--;
    if (freq[c] < 0) {
      frames.push({
        s1, s2, freq: { ...freq }, phase: "mismatch",
        activeChar: c, activeS1Idx: -1, activeS2Idx: i, isAnagram: false,
        step: { description: `s2[${i}] = '${c}' → freq['${c}']−− = ${freq[c]}.`, detail: `Below zero — '${c}' appears more in s2 than in s1. Not anagrams.` },
      });
      return frames;
    }
    frames.push({
      s1, s2, freq: { ...freq }, phase: "dec",
      activeChar: c, activeS1Idx: -1, activeS2Idx: i, isAnagram: null,
      step: { description: `s2[${i}] = '${c}' → freq['${c}']−− = ${freq[c]}.`, detail: "" },
    });
  }

  frames.push({
    s1, s2, freq: { ...freq }, phase: "done",
    activeChar: null, activeS1Idx: -1, activeS2Idx: -1, isAnagram: true,
    step: { description: "All frequencies are zero.", detail: `"${s1}" and "${s2}" are anagrams.` },
  });
  return frames;
}
