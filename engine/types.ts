/**
 * The Other Shore: the shapes shared by the engine and the authored story.
 *
 * Two things are kept apart on purpose:
 *  - the world as it is (`where`: each person's real whereabouts);
 *  - what the protagonist knows (`known`: what they last heard, and when).
 * There is no hidden morality or suspicion score. Every number the engine
 * tracks is a concrete thing the protagonist could count or feel (kroner,
 * seats, fuel, beds, tiredness), and the screen describes it in words.
 */
import type { Minute } from "./calendar.ts";

export type RoleId = "household" | "rescuer" | "receiver";
export const ROLE_IDS: readonly RoleId[] = ["household", "rescuer", "receiver"];

/** Story mode never ends a crossing in capture; standard mode can, with clear warnings first. */
export type Mode = "story" | "standard";

export type PersonId = string;
export type PlaceId = string;

/** Flags belong to one campaign: "h:" household, "r:" rescuer, "s:" receiver (Sweden). */
export const FLAG_PREFIX: Record<RoleId, string> = { household: "h:", rescuer: "r:", receiver: "s:" };

export interface PersonDef {
  id: PersonId;
  name: string;
  /** How the protagonist usually says the name. */
  short: string;
  /** A few words: who they are, as anyone meeting them could see. */
  about: string;
  /** Recurring households share an id across campaigns. */
  household?: string;
}

export interface PlaceDef {
  id: PlaceId;
  name: string;
  side: "denmark" | "sweden" | "sea" | "elsewhere";
}

export type Condition = "home" | "hidden" | "travelling" | "at-sea" | "safe" | "held" | "unknown";

export interface Whereabouts {
  place: PlaceId;
  condition: Condition;
  since: Minute;
}

export interface Knowledge {
  place: PlaceId | null;
  condition: Condition;
  /** When the protagonist last had word. */
  at: Minute;
  /** How: "saw", "letter", "telephone", "list", "rumor"... */
  via: string;
}

export interface JournalEntry {
  at: Minute;
  text: string;
}

export interface State {
  version: 1;
  role: RoleId;
  mode: Mode;
  seed: number;
  scene: string;
  step: number;
  time: Minute;
  vars: Record<string, number>;
  flags: string[];
  where: Record<PersonId, Whereabouts>;
  known: Record<PersonId, Knowledge>;
  journal: JournalEntry[];
  /** What the last choice led to, in a few sentences. */
  last: string[];
  choices: string[];
  /** Choice counts at which a chapter began: retrying replays up to one. */
  checkpoints: { chapter: string; at: number }[];
  ending: string | null;
}

/** A tracked quantity, described in words on the screen. */
export interface VarDef {
  id: string;
  label: string;
  min: number;
  max: number;
  start: number;
  words: (v: number) => string;
}

/** What scenes and options may read. Flags of other campaigns are refused. */
export interface Read {
  readonly role: RoleId;
  readonly mode: Mode;
  readonly time: Minute;
  readonly step: number;
  has(flag: string): boolean;
  v(id: string): number;
  /** Where the person really is (for the story's logic, not for its words). */
  truth(p: PersonId): Whereabouts;
  /** What the protagonist knows of the person, if anything. */
  knows(p: PersonId): Knowledge | null;
  person(p: PersonId): PersonDef;
  place(id: PlaceId): PlaceDef;
}

/** What an option's action may do. */
export interface Ctx extends Read {
  add(id: string, n: number): void;
  set(flag: string): void;
  unset(flag: string): void;
  move(p: PersonId, place: PlaceId, condition: Condition): void;
  /** The protagonist sees or hears reliably where the person is now. */
  learn(p: PersonId, via: string): void;
  /** The protagonist hears something that may be out of date or wrong. */
  hear(p: PersonId, place: PlaceId | null, condition: Condition, via: string): void;
  pass(minutes: number): void;
  /** A sentence of what happened, shown after the choice. */
  say(text: string): void;
  log(text: string): void;
  /** A keyed draw: the same seed and choices give the same answer. */
  roll(key: string, chance: number): boolean;
  go(scene: string): void;
  end(ending: string): void;
}

export interface Option {
  id: string;
  label: string | ((r: Read) => string);
  /** What the protagonist can foresee: qualitative, never odds. */
  hint?: string | ((r: Read) => string | undefined);
  /** Hidden when false. */
  show?: (r: Read) => boolean;
  /** Shown but unavailable, with the reason, when it returns text. */
  needs?: (r: Read) => string | null;
  act: (c: Ctx) => void;
}

export interface Scene {
  id: string;
  role: RoleId;
  /** Chapters are the checkpoints for retrying. */
  chapter: string;
  place: PlaceId;
  title: string;
  body: (r: Read) => string[];
  options: Option[];
  /** At sea: the optional sound of the water plays here, if the player turned it on. */
  sea?: boolean;
}

/** One person's outcome, in the closing account. */
export interface PersonOutcome {
  person: PersonId;
  kind: "safety" | "reunion" | "accommodation" | "unresolved" | "ordinary" | "held";
  text: string;
}

export interface Ending {
  id: string;
  title: string;
  body: (r: Read) => string[];
  outcomes: (r: Read) => PersonOutcome[];
}

export interface Campaign {
  role: RoleId;
  label: string;
  /** One line on the role-selection screen. */
  pitch: string;
  protagonist: PersonId;
  /** Everyone this protagonist can meet or learn of. */
  cast: PersonId[];
  vars: VarDef[];
  start: { scene: string; time: Minute; where: Record<PersonId, Whereabouts>; known: PersonId[]; flags?: string[] };
  scenes: Scene[];
  endings: Ending[];
}

export interface Story {
  people: PersonDef[];
  places: PlaceDef[];
  campaigns: Campaign[];
}
