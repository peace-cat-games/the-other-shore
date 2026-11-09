/**
 * Browser storage: one autosave per campaign, updated after every choice,
 * and settings. Storage that is missing, full, blocked or corrupted reads as
 * empty and never stops the game; writes report whether they worked.
 */
import type { RoleId, State } from "../engine/types.ts";
import { makeSave, parseSave, serialize } from "./save.ts";

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const PREFIX = "pcg:the-other-shore:";

export function browserStore(): KeyValueStore | null {
  try {
    if (typeof window === "undefined") return null;
    const ls = window.localStorage;
    const probe = `${PREFIX}probe`;
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    return ls;
  } catch {
    return null;
  }
}

const key = (role: RoleId) => `${PREFIX}auto:${role}`;

export function readAuto(store: KeyValueStore | null, role: RoleId): string | null {
  try {
    const raw = store?.getItem(key(role)) ?? null;
    return raw && parseSave(raw).ok ? raw : null;
  } catch {
    return null;
  }
}

export function writeAuto(store: KeyValueStore | null, s: State, label: string, savedAt: string): boolean {
  try {
    if (!store) return false;
    store.setItem(key(s.role), serialize(makeSave(s, label, savedAt)));
    return true;
  } catch {
    return false;
  }
}

export function clearAuto(store: KeyValueStore | null, role: RoleId): void {
  try {
    store?.removeItem(key(role));
  } catch {
    /* nothing to do */
  }
}

export interface Settings {
  textSize: "normal" | "large" | "larger";
  reduceMotion: boolean;
  /** Optional sea sound during the crossing. Off unless the player turns it on. */
  sound: boolean;
}

export const DEFAULT_SETTINGS: Settings = { textSize: "normal", reduceMotion: false, sound: false };

export function readSettings(store: KeyValueStore | null): Settings {
  try {
    const raw = store?.getItem(`${PREFIX}settings`);
    if (!raw) return DEFAULT_SETTINGS;
    const o = JSON.parse(raw) as Partial<Settings>;
    return { textSize: o.textSize === "large" || o.textSize === "larger" ? o.textSize : "normal", reduceMotion: o.reduceMotion === true, sound: o.sound === true };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeSettings(store: KeyValueStore | null, s: Settings): void {
  try {
    store?.setItem(`${PREFIX}settings`, JSON.stringify(s));
  } catch {
    /* settings are a convenience */
  }
}
