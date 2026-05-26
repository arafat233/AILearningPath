/**
 * palindrome — expand-around-center step generator (longest palindromic
 * substring).
 *
 * Used by M31-T3 (Palindromes — Detection and Expansion).
 *
 * Treats every index AND every gap-between-indices as a potential
 * centre (handles both odd- and even-length palindromes).
 *
 * Frame shape:
 *   {
 *     text: string,
 *     centerL: number, centerR: number,    // current centre
 *     L: number, R: number,                // current expansion bounds
 *     bestL: number, bestR: number,        // longest palindrome found so far
 *     phase: 'center' | 'expand' | 'mismatch' | 'edge' | 'done',
 *     step: { description, detail }
 *   }
 */

export const PALINDROME_CODE = `// Longest palindromic substring (expand around center)
String longestPalindrome(String s) {
  int bestL = 0, bestR = 0;
  for (int i = 0; i < s.length(); i++) {
    expand(s, i, i,     bestRef);       // odd-length centre
    expand(s, i, i + 1, bestRef);       // even-length centre (gap)
  }
  return s.substring(bestL, bestR + 1);
}

void expand(String s, int L, int R) {
  while (L >= 0 && R < s.length() && s.charAt(L) == s.charAt(R)) {
    L--; R++;
  }
  // s[L+1..R-1] is a palindrome
}`;

export const LINE_BY_PHASE = { center: 11, expand: 12, mismatch: 13, edge: 13, done: 7 };

export function generatePalindromeSteps(text) {
  const frames = [];
  let bestL = 0, bestR = 0;

  const push = (centerL, centerR, L, R, phase, note) => frames.push({
    text, centerL, centerR, L, R, bestL, bestR, phase, step: note,
  });

  if (!text || text.length < 2) {
    push(0, 0, 0, 0, "done", {
      description: text.length === 0 ? "Empty string." : `Single character "${text}" is trivially a palindrome.`,
      detail: "",
    });
    return frames;
  }

  for (let i = 0; i < text.length; i++) {
    // ── Odd-length centre at i ──
    push(i, i, i, i, "center", {
      description: `Odd-length centre at index ${i} ("${text[i]}").`,
      detail: "Expand outward while s[L] === s[R].",
    });
    let L = i, R = i;
    while (L >= 0 && R < text.length && text[L] === text[R]) {
      if (R - L > bestR - bestL) { bestL = L; bestR = R; }
      push(i, i, L, R, "expand", {
        description: `s[${L}]="${text[L]}" === s[${R}]="${text[R]}" — expand.`,
        detail: `Palindrome so far: "${text.slice(L, R + 1)}".`,
      });
      L--; R++;
    }
    if (L < 0 || R >= text.length) {
      push(i, i, L, R, "edge", {
        description: `Hit edge (L=${L}, R=${R}). Stop.`,
        detail: "",
      });
    } else {
      push(i, i, L, R, "mismatch", {
        description: `s[${L}]="${text[L]}" ≠ s[${R}]="${text[R]}" — stop.`,
        detail: "",
      });
    }

    // ── Even-length centre between i and i+1 ──
    if (i + 1 >= text.length) continue;
    push(i, i + 1, i, i + 1, "center", {
      description: `Even-length centre between indices ${i} and ${i + 1}.`,
      detail: "Expand outward while s[L] === s[R].",
    });
    L = i; R = i + 1;
    while (L >= 0 && R < text.length && text[L] === text[R]) {
      if (R - L > bestR - bestL) { bestL = L; bestR = R; }
      push(i, i + 1, L, R, "expand", {
        description: `s[${L}]="${text[L]}" === s[${R}]="${text[R]}" — expand.`,
        detail: `Palindrome so far: "${text.slice(L, R + 1)}".`,
      });
      L--; R++;
    }
    if (L < 0 || R >= text.length) {
      push(i, i + 1, L, R, "edge", {
        description: `Hit edge (L=${L}, R=${R}). Stop.`,
        detail: "",
      });
    } else if (text[L] !== text[R]) {
      push(i, i + 1, L, R, "mismatch", {
        description: `s[${L}]="${text[L]}" ≠ s[${R}]="${text[R]}" — stop.`,
        detail: "",
      });
    }
  }

  push(-1, -1, -1, -1, "done", {
    description: `Done — longest palindrome: "${text.slice(bestL, bestR + 1)}".`,
    detail: `At indices [${bestL}..${bestR}], length ${bestR - bestL + 1}.`,
  });
  return frames;
}
