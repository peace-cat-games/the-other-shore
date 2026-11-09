/**
 * What the screen shows, derived from a campaign: only what the protagonist
 * knows. People appear with where the protagonist last had word of them, and
 * when; the world's truth stays in the state.
 */
import { dayText, whenText } from "./calendar.ts";
import { endingOf, indexOf, optionsOf, reader, sceneOf, type OptionView } from "./play.ts";
import type { Condition, PersonOutcome, State, Story } from "./types.ts";

export const CONDITION_WORDS: Record<Condition, string> = {
  home: "at home",
  hidden: "in hiding",
  travelling: "on the way",
  "at-sea": "at sea",
  safe: "safe",
  held: "held",
  unknown: "whereabouts unknown",
};

const VIA_WORDS: Record<string, string> = {
  saw: "seen",
  telephone: "by telephone",
  message: "by message",
  letter: "by letter",
  list: "from a list",
  rumor: "a rumor",
  nobody: "no word",
};

export function viaWords(via: string): string {
  return VIA_WORDS[via] ?? via;
}

export interface PersonLine {
  id: string;
  name: string;
  about: string;
  where: string;
  asOf: string;
}

export interface View {
  role: string;
  roleLabel: string;
  mode: State["mode"];
  chapter: string;
  when: string;
  place: string;
  title: string;
  body: string[];
  last: string[];
  options: OptionView[];
  status: { label: string; words: string }[];
  people: PersonLine[];
  journal: { when: string; text: string }[];
  checkpoints: string[];
  sea: boolean;
  ending: { title: string; body: string[]; outcomes: (PersonOutcome & { name: string })[] } | null;
}

export function viewOf(story: Story, s: State): View {
  const { campaign } = indexOf(story, s.role);
  const r = reader(story, s);
  const scene = sceneOf(story, s);
  const ending = endingOf(story, s);
  const people = campaign.cast
    .filter((p) => p !== campaign.protagonist && s.known[p])
    .map((p) => {
      const k = s.known[p]!;
      const d = r.person(p);
      const where = k.place ? `${CONDITION_WORDS[k.condition]}, ${r.place(k.place).name}` : CONDITION_WORDS[k.condition];
      return { id: p, name: d.name, about: d.about, where, asOf: `${whenText(k.at)}, ${viaWords(k.via)}` };
    });
  return {
    role: s.role,
    roleLabel: campaign.label,
    mode: s.mode,
    chapter: scene.chapter,
    when: whenText(s.time),
    place: r.place(r.truth(campaign.protagonist).place).name,
    title: scene.title,
    body: scene.body(r),
    last: s.last,
    options: optionsOf(story, s),
    status: campaign.vars.map((v) => ({ label: v.label, words: v.words(s.vars[v.id]!) })),
    people,
    journal: s.journal.map((j) => ({ when: dayText(j.at), text: j.text })),
    checkpoints: s.checkpoints.map((c) => c.chapter),
    sea: Boolean(scene.sea) && !s.ending,
    ending: ending ? { title: ending.title, body: ending.body(r), outcomes: ending.outcomes(r).map((o) => ({ ...o, name: r.person(o.person).name })) } : null,
  };
}
