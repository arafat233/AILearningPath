/**
 * searchOnAnswer — Koko-eating-bananas demo of binary search on the
 * ANSWER SPACE (not on the input array).
 *
 * Used by M39-T2 (Search on Answer — Koko, Split Array, Median of Arrays).
 *
 * Find the minimum eating speed K such that eating-time at K ≤ H hours.
 * Search space is speeds 1..max(piles); predicate is "can finish in H".
 *
 * Frame shape:
 *   {
 *     piles: number[], H: number,
 *     L: number, R: number, mid: number,
 *     hoursAtMid: number,
 *     predicate: 'ok'|'too-slow' | null,
 *     bestSoFar: number | null,
 *     phase: 'init'|'compute'|'decide'|'found',
 *     step: { description, detail }
 *   }
 */

export const SEARCH_ON_ANSWER_CODE = `// Koko-eating bananas — min K such that totalHours(K) ≤ H
int minSpeed(int[] piles, int H) {
  int L = 1, R = 0;
  for (int p : piles) R = Math.max(R, p);
  while (L < R) {
    int mid = (L + R) >>> 1;
    if (canFinish(piles, mid, H)) R = mid;     // try smaller
    else                          L = mid + 1; // need faster
  }
  return L;
}
boolean canFinish(int[] piles, int speed, int H) {
  long h = 0;
  for (int p : piles) h += (p + speed - 1) / speed;  // ceil(p / speed)
  return h <= H;
}`;

export const LINE_BY_PHASE = { init: 3, compute: 14, decide: 7, found: 10 };

function hoursToEat(piles, speed) {
  let h = 0;
  for (const p of piles) h += Math.ceil(p / speed);
  return h;
}

export function generateSearchOnAnswerSteps(piles, H) {
  const frames = [];
  let L = 1;
  let R = Math.max(...piles);

  frames.push({
    piles: [...piles], H, L, R, mid: -1, hoursAtMid: 0,
    predicate: null, bestSoFar: null, phase: "init",
    step: {
      description: `Find min speed to eat all bananas in ≤ ${H} hours.`,
      detail: `Search space: speed in [1, ${R}]. Predicate: "can finish at speed K".`,
    },
  });

  let answer = R;
  while (L < R) {
    const mid = (L + R) >>> 1;
    const hours = hoursToEat(piles, mid);
    const ok = hours <= H;
    frames.push({
      piles: [...piles], H, L, R, mid, hoursAtMid: hours,
      predicate: ok ? "ok" : "too-slow",
      bestSoFar: ok ? mid : answer, phase: "compute",
      step: {
        description: `Try speed mid = ${mid}. Hours needed = sum of ceil(p / ${mid}) = ${hours}.`,
        detail: ok ? `${hours} ≤ ${H} — feasible. Try smaller.` : `${hours} > ${H} — too slow. Need faster.`,
      },
    });
    if (ok) {
      R = mid;
      answer = mid;
    } else {
      L = mid + 1;
    }
    frames.push({
      piles: [...piles], H, L, R, mid, hoursAtMid: hours,
      predicate: ok ? "ok" : "too-slow",
      bestSoFar: answer, phase: "decide",
      step: {
        description: `Narrow space to [${L}, ${R}].`,
        detail: ok ? `R = mid (this speed works, try slower).` : `L = mid + 1 (this speed fails, try faster).`,
      },
    });
  }

  frames.push({
    piles: [...piles], H, L, R, mid: -1, hoursAtMid: hoursToEat(piles, L),
    predicate: null, bestSoFar: L, phase: "found",
    step: {
      description: `Min speed = ${L}.`,
      detail: `At speed ${L}, total hours = ${hoursToEat(piles, L)}.`,
    },
  });
  return frames;
}

export const DEMO_PILES = [3, 6, 7, 11];
export const DEMO_H = 8;
