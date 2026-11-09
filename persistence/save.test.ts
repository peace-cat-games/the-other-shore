import assert from "node:assert/strict";
import { test } from "node:test";

import { STORY } from "../content/index.ts";
import { walk } from "../content/walk.ts";
import { ROLE_IDS } from "../engine/types.ts";
import { loadText, makeSave, parseSave, serialize } from "./save.ts";
import { readAuto, saveProgress, writeAuto, type KeyValueStore } from "./storage.ts";

function memory(): KeyValueStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) };
}

test("a save restores every campaign exactly, mid-story and at the end", () => {
  for (const role of ROLE_IDS) {
    for (const seed of [3, 77]) {
      const end = walk(STORY, role, "standard", seed, "random").state;
      const r = loadText(STORY, serialize(makeSave(end, "test", "2026-11-08T00:00:00Z")));
      assert.ok(!("error" in r));
      if ("error" in r) return;
      assert.equal(r.partial, false);
      assert.deepEqual(r.state, end);
      const mid = loadText(STORY, serialize({ ...makeSave(end, "", ""), choices: end.choices.slice(0, 7) }));
      assert.ok(!("error" in mid) && mid.state.choices.length === 7 && !mid.state.ending);
    }
  }
});

test("damaged, foreign and future saves are refused with a reason; stale choices rebuild partially", () => {
  assert.match((loadText(STORY, "not json") as { error: string }).error, /isn't a save/);
  assert.match((loadText(STORY, JSON.stringify({ kind: "pcg:iberlebn" })) as { error: string }).error, /isn't a save/);
  assert.match((loadText(STORY, JSON.stringify({ kind: "pcg:the-other-shore", version: 2 })) as { error: string }).error, /different version/);
  assert.match((loadText(STORY, JSON.stringify({ kind: "pcg:the-other-shore", version: 1, role: "pirate", mode: "story", seed: 1, choices: [] })) as { error: string }).error, /damaged/);
  const stale = loadText(STORY, JSON.stringify({ kind: "pcg:the-other-shore", version: 1, role: "household", mode: "story", seed: 1, choices: ["bech", "no-such-choice", "plan"] }));
  assert.ok(!("error" in stale) && stale.partial && stale.state.choices.length === 1);
});

test("the autosave survives a broken or missing store", () => {
  const s = walk(STORY, "receiver", "story", 5, "careful").state;
  const store = memory();
  assert.equal(writeAuto(store, s, "Swedish receiver", "now"), true);
  const raw = readAuto(store, "receiver");
  assert.ok(raw && parseSave(raw).ok);
  assert.equal(readAuto(store, "household"), null);
  assert.equal(writeAuto(null, s, "x", "now"), false);
  const broken: KeyValueStore = { getItem: () => "{garbage", setItem: () => { throw new Error("full"); }, removeItem: () => {} };
  assert.equal(readAuto(broken, "receiver"), null);
  assert.equal(writeAuto(broken, s, "x", "now"), false);
});

test("a finished campaign's autosave is cleared, so it can't be continued", () => {
  const store = memory();
  const done = walk(STORY, "household", "story", 9, "careful").state;
  const mid = loadText(STORY, serialize({ ...makeSave(done, "", ""), choices: done.choices.slice(0, 5) }));
  assert.ok(!("error" in mid));
  if ("error" in mid) return;
  assert.equal(saveProgress(store, mid.state, "Jewish household", "now"), true);
  assert.ok(readAuto(store, "household"), "mid-campaign: kept for continuing");
  assert.ok(done.ending);
  assert.equal(saveProgress(store, done, "Jewish household", "now"), true);
  assert.equal(readAuto(store, "household"), null, "ended: nothing to continue");
});
