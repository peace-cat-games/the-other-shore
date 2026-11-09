import assert from "node:assert/strict";
import { test } from "node:test";

import { apply, indexOf, optionsOf, reader, sceneOf, start } from "../engine/play.ts";
import { ROLE_IDS, type Mode, type RoleId, type State } from "../engine/types.ts";
import { AUTHOR_NOTE, CREDITS, ENCOURAGEMENT, EPILOGUE, EXPLORE, VERSES } from "./closing.ts";
import { HISTORY } from "./history.ts";
import { STORY } from "./index.ts";
import { walk, type Policy } from "./walk.ts";

const SEEDS = Array.from({ length: 60 }, (_, i) => i * 7919 + 13);
const MODES: Mode[] = ["story", "standard"];

/** Invariants checked after every choice. */
function invariants(s: State): void {
  const { campaign } = indexOf(STORY, s.role);
  for (const v of campaign.vars) assert.ok(s.vars[v.id]! >= v.min && s.vars[v.id]! <= v.max, `${s.role}: ${v.id} out of bounds`);
  for (const [p, k] of Object.entries(s.known)) {
    assert.ok(campaign.cast.includes(p), `${s.role} knows of ${p}, who is not in its cast`);
    assert.ok(k.at <= s.time, `${s.role}: knowledge of ${p} from the future`);
  }
  for (const p of campaign.cast) assert.ok(s.where[p], `${s.role}: ${p} has no whereabouts`);
  if (s.role === "rescuer") assert.ok(s.vars.aboard! <= s.vars.capacity!, "more people aboard than the boat can safely carry");
  if (s.role === "receiver") assert.ok(s.vars.beds! >= 0, "negative beds");
}

const runs: { role: RoleId; mode: Mode; policy: Policy; seed: number; ending: string; scenes: string[]; texts: string[] }[] = [];
for (const role of ROLE_IDS)
  for (const mode of MODES)
    for (const policy of ["careful", "random"] as Policy[])
      for (const seed of SEEDS) {
        const w = walk(STORY, role, mode, seed, policy, invariants);
        runs.push({ role, mode, policy, seed, ending: w.state.ending!, scenes: w.scenes, texts: w.texts });
      }

test("every campaign reaches an ending in every mode and policy, keeping its invariants", () => {
  assert.equal(runs.length, ROLE_IDS.length * MODES.length * 2 * SEEDS.length);
});

test("careful play almost always ends in safety; story mode never ends in arrest", () => {
  for (const role of ROLE_IDS) {
    const careful = runs.filter((r) => r.role === role && r.policy === "careful");
    const held = careful.filter((r) => r.ending.includes("held"));
    assert.ok(held.length / careful.length <= 0.03, `${role}: careful play ended in arrest ${held.length} times of ${careful.length}`);
    const storyHeld = runs.filter((r) => r.role === role && r.mode === "story" && r.ending.includes("held"));
    assert.equal(storyHeld.length, 0, `${role}: story mode ended in arrest`);
    const random = runs.filter((r) => r.role === role && r.policy === "random" && r.mode === "standard");
    const randomSafe = random.filter((r) => !r.ending.includes("held"));
    assert.ok(randomSafe.length / random.length >= 0.75, `${role}: random standard play was safe only ${randomSafe.length} of ${random.length}`);
  }
});

test("every scene and every ending can be reached; no placeholders", () => {
  for (const c of STORY.campaigns) {
    const seen = new Set(runs.filter((r) => r.role === c.role).flatMap((r) => r.scenes));
    const unseen = c.scenes.filter((s) => !seen.has(s.id)).map((s) => s.id);
    assert.deepEqual(unseen, [], `${c.role}: scenes never reached`);
    const endings = new Set(runs.filter((r) => r.role === c.role).map((r) => r.ending));
    const missing = c.endings.filter((e) => !endings.has(e.id)).map((e) => e.id);
    assert.deepEqual(missing, [], `${c.role}: endings never reached`);
    assert.ok(c.scenes.length >= 12, `${c.role}: only ${c.scenes.length} scenes`);
  }
  const all = runs.flatMap((r) => r.texts).join("\n");
  assert.doesNotMatch(all, /coming soon|TODO|lorem|placeholder|TBD/i);
});

test("choices have effects: in every scene with several options, they don't all lead to the same place", () => {
  for (const c of STORY.campaigns) {
    for (const r of runs.filter((x) => x.role === c.role).slice(0, 8)) {
      const s = start(STORY, c.role, r.mode, r.seed);
      for (let i = 0; i < 300 && !s.ending; i++) {
        const open = optionsOf(STORY, s).filter((o) => !o.blocked);
        if (open.length > 1) {
          const outcomes = new Set(
            open.map((o) => {
              const t = structuredClone(s);
              apply(STORY, t, o.id);
              return JSON.stringify([t.scene, t.vars, t.flags, t.where, t.known, t.last, t.ending]);
            }),
          );
          assert.ok(outcomes.size > 1, `${c.role}/${sceneOf(STORY, s).id}: every option has the same effect`);
        }
        apply(STORY, s, open[0]!.id);
      }
    }
  }
});

test("each protagonist names only people they can know", () => {
  for (const c of STORY.campaigns) {
    const outsiders = STORY.people.filter((p) => !c.cast.includes(p.id));
    const text = runs
      .filter((r) => r.role === c.role)
      .flatMap((r) => r.texts)
      .join("\n");
    for (const p of outsiders) {
      assert.ok(!text.includes(p.name), `${c.role} text names ${p.name}, who is not in its cast`);
    }
  }
});

test("the people in the closing account are the campaign's own", () => {
  for (const c of STORY.campaigns) {
    for (const e of c.endings) {
      const sample = runs.find((r) => r.role === c.role && r.ending === e.id);
      if (!sample) continue;
      const w = walk(STORY, c.role, sample.mode, sample.seed, sample.policy);
      for (const o of e.outcomes(reader(STORY, w.state))) assert.ok(c.cast.includes(o.person), `${c.role}/${e.id}: ${o.person} not in cast`);
    }
  }
});

test("the author's note keeps the exact travel facts and the baseline wording", () => {
  const note = AUTHOR_NOTE.join("\n");
  for (const line of [
    "I have visited Finland; my experience of Denmark has so far been limited to Copenhagen airport, and of Sweden to Arlanda airport and Haparanda.",
    "There is much I have yet to see.",
    "a story we intend to explore in another game",
    "This game is offered freely, with gratitude.",
  ])
    assert.ok(note.includes(line), `missing: ${line}`);
  assert.doesNotMatch(note, /Stockholm|I (?:walked|stood|saw the|remember)|when I was in (?:Denmark|Sweden)/);
  assert.doesNotMatch(note.replace("Copenhagen airport", ""), /Copenhagen/);
  assert.deepEqual(
    VERSES.map((v) => [v.text, v.ref, v.translation]),
    [
      ["I was a stranger, and ye took me in.", "Matthew 25:35", "King James Version"],
      ["Be not overcome of evil, but overcome evil with good.", "Romans 12:21", "King James Version"],
    ],
  );
  assert.ok(ENCOURAGEMENT.join(" ").match(/addict/) && ENCOURAGEMENT.join(" ").match(/mental/));
});

test("the history, credits and invitation exist and link only to real Peace Cat Games pages", () => {
  assert.ok(EPILOGUE.paragraphs.length >= 3);
  assert.ok(CREDITS.length >= 3);
  assert.ok(HISTORY.sections.length >= 5);
  assert.ok(HISTORY.sources.length >= 8);
  const cited = new Set(HISTORY.sections.flatMap((s) => s.sources));
  for (const id of cited) assert.ok(HISTORY.sources.some((x) => x.id === id), `uncited source ${id}`);
  for (const l of EXPLORE.links) assert.match(l.href, /^https:\/\/www\.peacecatgames\.com\/(games|after-dark)?$/);
  assert.match(HISTORY.sections.map((s) => s.paragraphs.join(" ")).join(" "), /eight Jewish refugees/);
});

test("Jewish characters never voice the author's Christian interpretation", () => {
  const story = runs.flatMap((r) => r.texts).join("\n");
  assert.doesNotMatch(story, /crosses on (?:their|the) flags|Christian calling|convert/i);
});
