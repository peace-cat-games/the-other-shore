import assert from "node:assert/strict";
import { test } from "node:test";

import { at } from "./calendar.ts";
import { apply, choose, IllegalChoice, optionsOf, replay, retry, start } from "./play.ts";
import type { Story } from "./types.ts";

/** A three-scene fixture, so the engine's rules are tested apart from the authored story. */
const FIXTURE: Story = {
  people: [
    { id: "a", name: "A", short: "A", about: "" },
    { id: "b", name: "B", short: "B", about: "" },
    { id: "z", name: "Z", short: "Z", about: "" },
  ],
  places: [
    { id: "home", name: "Home", side: "denmark" },
    { id: "shore", name: "Shore", side: "sweden" },
  ],
  campaigns: [
    {
      role: "household",
      label: "Fixture",
      pitch: "",
      protagonist: "a",
      cast: ["a", "b"],
      vars: [{ id: "money", label: "Money", min: 0, max: 10, start: 3, words: (v) => `${v}` }],
      start: { scene: "one", time: at("1943-09-29", 9), where: { a: { place: "home", condition: "home", since: 0 }, b: { place: "home", condition: "home", since: 0 } }, known: ["b"] },
      scenes: [
        {
          id: "one",
          role: "household",
          chapter: "First",
          place: "home",
          title: "One",
          body: () => ["x"],
          options: [
            { id: "spend", label: "Spend", needs: (r) => (r.v("money") < 5 ? "Not enough money." : null), act: (c) => c.go("two") },
            { id: "save", label: "Save", act: (c) => (c.add("money", 20), c.set("h:saved"), c.pass(60), c.go("two")) },
            { id: "peek", label: "Peek", act: (c) => (c.has("r:other"), c.go("two")) },
            { id: "stranger", label: "Stranger", act: (c) => (c.learn("z", "saw"), c.go("two")) },
          ],
        },
        {
          id: "two",
          role: "household",
          chapter: "Second",
          place: "home",
          title: "Two",
          body: () => [],
          options: [
            { id: "cross", label: "Cross", act: (c) => (c.move("a", "shore", "safe"), c.move("b", "shore", "safe"), c.say(c.roll("sea", 0.5) ? "calm" : "rough"), c.go("three")) },
            { id: "hidden", label: "Hidden", show: () => false, act: (c) => c.go("three") },
          ],
        },
        { id: "three", role: "household", chapter: "Second", place: "shore", title: "Three", body: () => [], options: [{ id: "end", label: "End", act: (c) => c.end("safe") }] },
      ],
      endings: [{ id: "safe", title: "Safe", body: () => [], outcomes: () => [] }],
    },
  ],
};

test("variables stay within bounds; blocked and hidden options can't be chosen", () => {
  const s = start(FIXTURE, "household", "story", 1);
  const opts = optionsOf(FIXTURE, s);
  assert.equal(opts.find((o) => o.id === "spend")?.blocked, "Not enough money.");
  assert.throws(() => apply(FIXTURE, structuredClone(s), "spend"), IllegalChoice);
  const t = choose(FIXTURE, s, "save");
  assert.equal(t.vars.money, 10, "clamped at the maximum");
  assert.equal(t.time, s.time + 60);
  assert.deepEqual(t.flags, ["h:saved"]);
  assert.equal(s.vars.money, 3, "choose leaves the original alone");
  assert.ok(!optionsOf(FIXTURE, t).some((o) => o.id === "hidden"));
  assert.throws(() => apply(FIXTURE, structuredClone(t), "hidden"), IllegalChoice);
});

test("a campaign can't read another campaign's flags or learn of people outside its cast", () => {
  const s = start(FIXTURE, "household", "story", 1);
  assert.throws(() => apply(FIXTURE, structuredClone(s), "peek"), /cannot use the flag/);
  assert.throws(() => apply(FIXTURE, structuredClone(s), "stranger"), /not someone/);
});

test("the same seed and choices replay to the same state; retrying a chapter replays its prefix", () => {
  let s = start(FIXTURE, "household", "standard", 42);
  for (const id of ["save", "cross", "end"]) s = choose(FIXTURE, s, id);
  assert.equal(s.ending, "safe");
  const again = replay(FIXTURE, "household", "standard", 42, s.choices);
  assert.deepEqual(again.state, s);
  assert.deepEqual(
    s.checkpoints.map((c) => [c.chapter, c.at]),
    [
      ["First", 0],
      ["Second", 1],
    ],
  );
  const back = retry(FIXTURE, s, "Second");
  assert.equal(back.scene, "two");
  assert.deepEqual(back.choices, ["save"]);
  const partial = replay(FIXTURE, "household", "standard", 42, ["save", "no-such-choice", "end"]);
  assert.equal(partial.applied, 1);
});

test("keyed draws depend on the seed, not on how often the screen is drawn", () => {
  const outcomes = new Set<string>();
  for (let seed = 0; seed < 40; seed++) {
    const s = choose(FIXTURE, choose(FIXTURE, start(FIXTURE, "household", "story", seed), "save"), "cross");
    optionsOf(FIXTURE, s);
    optionsOf(FIXTURE, s);
    outcomes.add(s.last[0]!);
    assert.deepEqual(choose(FIXTURE, choose(FIXTURE, start(FIXTURE, "household", "story", seed), "save"), "cross").last, s.last);
  }
  assert.deepEqual([...outcomes].sort(), ["calm", "rough"]);
});
