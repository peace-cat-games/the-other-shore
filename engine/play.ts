/**
 * Running a campaign. A campaign is its role, mode, seed and the list of
 * option ids chosen; everything else is replayed from those, so a save is
 * tiny, reloading cannot reroll a crossing, and retrying a chapter is
 * replaying a prefix of the choices.
 */
import { rand } from "./rng.ts";
import type { Campaign, Ctx, Ending, Mode, Option, PersonId, Read, RoleId, Scene, State, Story } from "./types.ts";
import { FLAG_PREFIX } from "./types.ts";

export class IllegalChoice extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IllegalChoice";
  }
}

interface Index {
  story: Story;
  campaign: Campaign;
  scenes: Map<string, Scene>;
  endings: Map<string, Ending>;
}

const cache = new WeakMap<Story, Map<RoleId, Index>>();

export function indexOf(story: Story, role: RoleId): Index {
  let byRole = cache.get(story);
  if (!byRole) cache.set(story, (byRole = new Map()));
  let ix = byRole.get(role);
  if (!ix) {
    const campaign = story.campaigns.find((c) => c.role === role);
    if (!campaign) throw new Error(`No campaign for ${role}`);
    ix = { story, campaign, scenes: new Map(campaign.scenes.map((s) => [s.id, s])), endings: new Map(campaign.endings.map((e) => [e.id, e])) };
    byRole.set(role, ix);
  }
  return ix;
}

function checkFlag(role: RoleId, flag: string): void {
  if (!flag.startsWith(FLAG_PREFIX[role])) throw new Error(`The ${role} campaign cannot use the flag "${flag}"`);
}

function checkCast(ix: Index, p: PersonId): void {
  if (!ix.campaign.cast.includes(p)) throw new Error(`${p} is not someone the ${ix.campaign.role} protagonist can know`);
}

export function reader(story: Story, s: State): Read {
  const ix = indexOf(story, s.role);
  return {
    role: s.role,
    mode: s.mode,
    time: s.time,
    step: s.step,
    has: (flag) => (checkFlag(s.role, flag), s.flags.includes(flag)),
    v: (id) => {
      if (!(id in s.vars)) throw new Error(`No variable ${id} in the ${s.role} campaign`);
      return s.vars[id]!;
    },
    truth: (p) => {
      checkCast(ix, p);
      const w = s.where[p];
      if (!w) throw new Error(`No whereabouts for ${p}`);
      return w;
    },
    knows: (p) => (checkCast(ix, p), s.known[p] ?? null),
    person: (p) => {
      const d = story.people.find((x) => x.id === p);
      if (!d) throw new Error(`No person ${p}`);
      return d;
    },
    place: (id) => {
      const d = story.places.find((x) => x.id === id);
      if (!d) throw new Error(`No place ${id}`);
      return d;
    },
  };
}

function context(story: Story, s: State): Ctx & { next: { scene?: string; ending?: string } } {
  const ix = indexOf(story, s.role);
  const r = reader(story, s);
  const next: { scene?: string; ending?: string } = {};
  const vars = new Map(ix.campaign.vars.map((v) => [v.id, v]));
  return {
    ...r,
    get time() {
      return s.time;
    },
    next,
    add: (id, n) => {
      const def = vars.get(id);
      if (!def) throw new Error(`No variable ${id}`);
      s.vars[id] = Math.max(def.min, Math.min(def.max, s.vars[id]! + n));
    },
    set: (flag) => {
      checkFlag(s.role, flag);
      if (!s.flags.includes(flag)) s.flags = [...s.flags, flag].sort();
    },
    unset: (flag) => {
      checkFlag(s.role, flag);
      s.flags = s.flags.filter((f) => f !== flag);
    },
    move: (p, place, condition) => {
      checkCast(ix, p);
      r.place(place);
      s.where[p] = { place, condition, since: s.time };
    },
    learn: (p, via) => {
      checkCast(ix, p);
      const w = s.where[p]!;
      s.known[p] = { place: w.place, condition: w.condition, at: s.time, via };
    },
    hear: (p, place, condition, via) => {
      checkCast(ix, p);
      if (place) r.place(place);
      s.known[p] = { place, condition, at: s.time, via };
    },
    pass: (minutes) => {
      if (minutes < 0) throw new Error("Time does not run backwards");
      s.time += minutes;
    },
    say: (text) => s.last.push(text),
    log: (text) => s.journal.push({ at: s.time, text }),
    roll: (key, chance) => rand(s.seed, `${s.role}:${key}`) < chance,
    go: (scene) => {
      if (!ix.scenes.has(scene)) throw new Error(`No scene ${scene} in the ${s.role} campaign`);
      next.scene = scene;
    },
    end: (ending) => {
      if (!ix.endings.has(ending)) throw new Error(`No ending ${ending} in the ${s.role} campaign`);
      next.ending = ending;
    },
  };
}

export function start(story: Story, role: RoleId, mode: Mode, seed: number): State {
  const { campaign } = indexOf(story, role);
  const s: State = {
    version: 1,
    role,
    mode,
    seed: seed >>> 0,
    scene: campaign.start.scene,
    step: 0,
    time: campaign.start.time,
    vars: Object.fromEntries(campaign.vars.map((v) => [v.id, v.start])),
    flags: [...(campaign.start.flags ?? [])].sort(),
    where: structuredClone(campaign.start.where),
    known: {},
    journal: [],
    last: [],
    choices: [],
    checkpoints: [{ chapter: indexOf(story, role).scenes.get(campaign.start.scene)!.chapter, at: 0 }],
    ending: null,
  };
  for (const p of campaign.start.known) {
    const w = s.where[p]!;
    s.known[p] = { place: w.place, condition: w.condition, at: s.time, via: "saw" };
  }
  return s;
}

export function sceneOf(story: Story, s: State): Scene {
  const sc = indexOf(story, s.role).scenes.get(s.scene);
  if (!sc) throw new Error(`No scene ${s.scene}`);
  return sc;
}

export function endingOf(story: Story, s: State): Ending | null {
  return s.ending ? (indexOf(story, s.role).endings.get(s.ending) ?? null) : null;
}

export interface OptionView {
  id: string;
  label: string;
  hint?: string;
  /** Why it can't be chosen now, if it can't. */
  blocked?: string;
}

export function optionsOf(story: Story, s: State): OptionView[] {
  if (s.ending) return [];
  const r = reader(story, s);
  return sceneOf(story, s)
    .options.filter((o) => !o.show || o.show(r))
    .map((o) => {
      const label = typeof o.label === "function" ? o.label(r) : o.label;
      const hint = typeof o.hint === "function" ? o.hint(r) : o.hint;
      const blocked = o.needs?.(r) ?? undefined;
      return { id: o.id, label, ...(hint ? { hint } : {}), ...(blocked ? { blocked } : {}) };
    });
}

/** Apply a choice in place. */
export function apply(story: Story, s: State, optionId: string): void {
  if (s.ending) throw new IllegalChoice("The campaign has ended.");
  const scene = sceneOf(story, s);
  const r = reader(story, s);
  const option: Option | undefined = scene.options.find((o) => o.id === optionId && (!o.show || o.show(r)));
  if (!option) throw new IllegalChoice(`"${optionId}" is not a choice here.`);
  const blocked = option.needs?.(r);
  if (blocked) throw new IllegalChoice(blocked);
  s.last = [];
  const c = context(story, s);
  option.act(c);
  if (!c.next.scene && !c.next.ending) throw new Error(`Option ${scene.id}/${optionId} leads nowhere`);
  s.choices.push(optionId);
  s.step += 1;
  if (c.next.ending) {
    s.ending = c.next.ending;
    return;
  }
  const before = scene.chapter;
  s.scene = c.next.scene!;
  const chapter = sceneOf(story, s).chapter;
  if (chapter !== before && !s.checkpoints.some((k) => k.chapter === chapter)) s.checkpoints.push({ chapter, at: s.choices.length });
}

/** Apply a choice to a copy. */
export function choose(story: Story, s: State, optionId: string): State {
  const next = structuredClone(s);
  apply(story, next, optionId);
  return next;
}

/** Rebuild a campaign from its choices. Stops at the first choice that no longer applies. */
export function replay(story: Story, role: RoleId, mode: Mode, seed: number, choices: readonly string[]): { state: State; applied: number } {
  const s = start(story, role, mode, seed);
  let applied = 0;
  for (const id of choices) {
    try {
      apply(story, s, id);
      applied += 1;
    } catch (e) {
      if (e instanceof IllegalChoice) break;
      throw e;
    }
  }
  return { state: s, applied };
}

/** Back to the start of a chapter: the same seed, the choices before it. */
export function retry(story: Story, s: State, chapter: string): State {
  const k = s.checkpoints.find((c) => c.chapter === chapter);
  if (!k) throw new IllegalChoice("No such chapter yet.");
  return replay(story, s.role, s.mode, s.seed, s.choices.slice(0, k.at)).state;
}
