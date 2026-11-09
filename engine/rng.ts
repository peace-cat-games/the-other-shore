/**
 * Keyed randomness. Every draw is a pure function of the run's seed and a
 * stable key such as "household:12:crossing", so the same seed and choices
 * always give the same outcomes, reloading cannot reroll a night, and
 * opening a panel (which draws nothing) cannot change anyone's fate.
 */

export function hash(text: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

/** A number in [0, 1) fixed by the seed and the key. */
export function rand(seed: number, key: string): number {
  return hash(`${seed >>> 0}|${key}`) / 4294967296;
}

/** An integer in [lo, hi] fixed by the seed and the key. */
export function between(seed: number, key: string, lo: number, hi: number): number {
  return lo + Math.floor(rand(seed, key) * (hi - lo + 1));
}

