/**
 * Playing campaigns automatically, for the tests and `npm run walk`.
 *  - careful: the first available option (each scene lists the prudent
 *    course first);
 *  - random: any available option, chosen by a keyed draw.
 */
import { apply, endingOf, optionsOf, reader, sceneOf, start } from "../engine/play.ts";
import { rand } from "../engine/rng.ts";
import type { Mode, RoleId, State, Story } from "../engine/types.ts";

export type Policy = "careful" | "random";

export interface Walk {
  state: State;
  scenes: string[];
  /** Every text the player saw, ending included. */
  texts: string[];
}

export function walk(story: Story, role: RoleId, mode: Mode, seed: number, policy: Policy, check?: (s: State) => void, maxSteps = 300): Walk {
  const s = start(story, role, mode, seed);
  const scenes: string[] = [];
  const texts: string[] = [];
  for (let i = 0; i < maxSteps; i++) {
    if (s.ending) {
      const e = endingOf(story, s)!;
      const r = reader(story, s);
      texts.push(e.title, ...e.body(r), ...e.outcomes(r).map((o) => o.text), ...s.journal.map((j) => j.text));
      return { state: s, scenes, texts };
    }
    const scene = sceneOf(story, s);
    scenes.push(scene.id);
    const opts = optionsOf(story, s);
    texts.push(scene.title, ...scene.body(reader(story, s)), ...opts.flatMap((o) => [o.label, o.hint ?? "", o.blocked ?? ""]));
    const open = opts.filter((o) => !o.blocked);
    if (open.length === 0) throw new Error(`${role}/${scene.id}: no available option (seed ${seed})`);
    const pick = policy === "careful" ? open[0]! : open[Math.floor(rand(seed, `walk:${i}`) * open.length)]!;
    apply(story, s, pick.id);
    texts.push(...s.last);
    check?.(s);
  }
  throw new Error(`${role} (${mode}, ${policy}, seed ${seed}) did not end within ${maxSteps} steps`);
}
