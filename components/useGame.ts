"use client";

/**
 * The game in the browser. The engine is pure and runs here; every choice
 * is autosaved for its campaign until the campaign ends; a finished campaign's
 * autosave is cleared, so the title offers only a fresh start. Leaving is
 * never penalised. Retrying a
 * chapter replays the same campaign up to the chapter's start.
 */
import { useCallback, useEffect, useMemo, useState } from "react";

import { choose as engineChoose, retry as engineRetry, start } from "@/engine/play";
import type { Mode, RoleId, State } from "@/engine/types";
import { ROLE_IDS } from "@/engine/types";
import { STORY } from "@/content";
import { loadText as parseAndReplay, makeSave, serialize } from "@/persistence/save";
import { browserStore, clearAuto, DEFAULT_SETTINGS, readAuto, readSettings, saveProgress, writeSettings, type Settings } from "@/persistence/storage";

export type Screen = "title" | "play" | "closing";

function labelOf(s: State): string {
  const c = STORY.campaigns.find((x) => x.role === s.role)!;
  return `${c.label}, ${s.mode === "story" ? "story mode" : "standard mode"}`;
}

export function useGame() {
  const store = useMemo(() => browserStore(), []);
  const [state, setState] = useState<State | null>(null);
  const [screen, setScreen] = useState<Screen>("title");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [autos, setAutos] = useState<Partial<Record<RoleId, string>>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [saved, setSaved] = useState<"saved" | "failed" | "unavailable" | "idle">("idle");

  const refreshAutos = useCallback(() => {
    const out: Partial<Record<RoleId, string>> = {};
    for (const r of ROLE_IDS) {
      const raw = readAuto(store, r);
      if (!raw) continue;
      // An autosave of a finished campaign (from before finished ones were cleared) is not offered.
      const replayed = parseAndReplay(STORY, raw);
      if (!("error" in replayed) && replayed.state.ending) clearAuto(store, r);
      else out[r] = raw;
    }
    setAutos(out);
  }, [store]);

  useEffect(() => {
    // Reading storage once on mount is the external-system sync this effect is for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(readSettings(store));
    refreshAutos();
    if (!store) setSaved("unavailable");
  }, [store, refreshAutos]);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.text = settings.textSize;
    if (settings.reduceMotion) html.dataset.motion = "reduce";
    else delete html.dataset.motion;
  }, [settings]);

  const autosave = useCallback(
    (s: State) => {
      if (!store) return setSaved("unavailable");
      setSaved(saveProgress(store, s, labelOf(s), new Date().toISOString()) ? "saved" : "failed");
      refreshAutos();
    },
    [store, refreshAutos],
  );

  const show = useCallback((s: State) => {
    setState(s);
    setScreen(s.ending ? "closing" : "play");
    window.scrollTo({ top: 0 });
  }, []);

  const begin = useCallback(
    (role: RoleId, mode: Mode) => {
      const seed = crypto.getRandomValues(new Uint32Array(1))[0]! >>> 0;
      const s = start(STORY, role, mode, seed);
      autosave(s);
      setNotice(null);
      show(s);
    },
    [autosave, show],
  );

  const loadText = useCallback(
    (text: string): boolean => {
      const r = parseAndReplay(STORY, text);
      if ("error" in r) {
        setNotice(r.error);
        return false;
      }
      setNotice(r.partial ? "This save was made with an earlier version of the game; the story was rebuilt up to the last choice it could replay." : null);
      autosave(r.state);
      show(r.state);
      return true;
    },
    [autosave, show],
  );

  const resume = useCallback(
    (role: RoleId) => {
      const raw = readAuto(store, role);
      if (!raw) return setNotice("That story could not be read.");
      loadText(raw);
    },
    [store, loadText],
  );

  const choose = useCallback(
    (optionId: string) => {
      if (!state) return;
      try {
        const next = engineChoose(STORY, state, optionId);
        autosave(next);
        setNotice(null);
        setState(next);
        if (next.ending) setScreen("closing");
      } catch (e) {
        setNotice(e instanceof Error ? e.message : "That choice could not be made.");
      }
    },
    [state, autosave],
  );

  const retry = useCallback(
    (chapter: string) => {
      if (!state) return;
      const s = engineRetry(STORY, state, chapter);
      autosave(s);
      setNotice(null);
      show(s);
    },
    [state, autosave, show],
  );

  const forget = useCallback(
    (role: RoleId) => {
      clearAuto(store, role);
      refreshAutos();
    },
    [store, refreshAutos],
  );

  const exportText = useCallback(() => (state ? serialize(makeSave(state, labelOf(state), new Date().toISOString())) : ""), [state]);

  const changeSettings = useCallback(
    (next: Settings) => {
      setSettings(next);
      writeSettings(store, next);
    },
    [store],
  );

  return { state, screen, setScreen, settings, changeSettings, autos, notice, setNotice, saved, begin, resume, loadText, choose, retry, forget, exportText };
}

export type GameApi = ReturnType<typeof useGame>;
