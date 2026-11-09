/**
 * Saves: the role, mode, seed and choices, replayed on load. Anything else in
 * a save file is ignored; a save that doesn't parse is refused with a
 * reason, never half-loaded.
 */
import { replay } from "../engine/play.ts";
import { ROLE_IDS, type Mode, type RoleId, type State, type Story } from "../engine/types.ts";

export const SAVE_KIND = "pcg:the-other-shore";

export interface SaveFile {
  kind: typeof SAVE_KIND;
  version: 1;
  role: RoleId;
  mode: Mode;
  seed: number;
  choices: string[];
  label: string;
  savedAt: string;
}

export function makeSave(s: State, label: string, savedAt: string): SaveFile {
  return { kind: SAVE_KIND, version: 1, role: s.role, mode: s.mode, seed: s.seed, choices: [...s.choices], label, savedAt };
}

export function serialize(f: SaveFile): string {
  return JSON.stringify(f);
}

export type Parsed = ({ ok: true } & SaveFile) | { ok: false; error: string };

export function parseSave(text: string): Parsed {
  let o: unknown;
  try {
    o = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't a save from The Other Shore." };
  }
  const f = o as Partial<SaveFile>;
  if (!f || typeof f !== "object" || f.kind !== SAVE_KIND) return { ok: false, error: "That file isn't a save from The Other Shore." };
  if (f.version !== 1) return { ok: false, error: "That save comes from a different version of the game." };
  if (!ROLE_IDS.includes(f.role as RoleId) || (f.mode !== "story" && f.mode !== "standard")) return { ok: false, error: "That save is damaged." };
  if (typeof f.seed !== "number" || !Number.isFinite(f.seed) || !Array.isArray(f.choices) || !f.choices.every((c) => typeof c === "string" && c.length < 80) || f.choices.length > 2000) {
    return { ok: false, error: "That save is damaged." };
  }
  return { ok: true, kind: SAVE_KIND, version: 1, role: f.role as RoleId, mode: f.mode, seed: f.seed >>> 0, choices: f.choices, label: typeof f.label === "string" ? f.label.slice(0, 80) : "", savedAt: typeof f.savedAt === "string" ? f.savedAt.slice(0, 40) : "" };
}

export function loadText(story: Story, text: string): { state: State; partial: boolean } | { error: string } {
  const p = parseSave(text);
  if (!p.ok) return { error: p.error };
  const { state, applied } = replay(story, p.role, p.mode, p.seed, p.choices);
  return { state, partial: applied < p.choices.length };
}
