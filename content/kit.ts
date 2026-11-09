/** Small helpers shared by the campaigns' scenes. */
import type { Ctx, PersonId, Read } from "../engine/types.ts";

/** "Ruth", "Ruth and Benny", "Ruth, Benny and David". */
export function list(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

export function shorts(r: Read, ids: PersonId[]): string {
  return list(ids.map((p) => r.person(p).short));
}

/** Who is with the protagonist now, by the world's truth. */
export function together(r: Read, me: PersonId, ids: PersonId[]): PersonId[] {
  const here = r.truth(me).place;
  return ids.filter((p) => r.truth(p).place === here);
}

/** Move several people at once, and let the protagonist see it. */
export function moveAll(c: Ctx, ids: PersonId[], place: string, condition: Parameters<Ctx["move"]>[2], via = "saw"): void {
  for (const p of ids) {
    c.move(p, place, condition);
    c.learn(p, via);
  }
}

export function kroner(hundreds: number): string {
  return `${(hundreds * 100).toLocaleString("en-US")} kroner`;
}
