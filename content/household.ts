/**
 * Campaign 1, the Jewish household: Hanna Levin of Østerbro, Copenhagen,
 * from an ordinary Tuesday to the other shore.
 */
import { at } from "../engine/calendar.ts";
import type { Campaign } from "../engine/types.ts";
import { SCENES_1 } from "./household-1.ts";
import { SCENES_2 } from "./household-2.ts";
import { ENDINGS, SCENES_3 } from "./household-3.ts";
import { kroner } from "./kit.ts";

const start = at("1943-09-28", 18);
const home = { condition: "home" as const, since: start };

export const HOUSEHOLD: Campaign = {
  role: "household",
  label: "Jewish household",
  pitch: "Hanna Levin, a bookkeeper in Copenhagen, has a husband, two children, a mother-in-law with opinions and a young friend from Vienna. When the warning comes, she has three days to get them all to the other shore.",
  protagonist: "hanna",
  cast: ["hanna", "david", "ruth", "benny", "sara", "peter", "kirsten", "ole", "klara", "moritz", "else", "anders", "poul", "viggo", "marta", "lis", "aron"],
  vars: [
    { id: "funds", label: "Money", min: 0, max: 40, start: 4, words: (v) => (v === 0 ? "Nothing left but coins" : `About ${kroner(v)} in cash`) },
    { id: "supplies", label: "For the journey", min: 0, max: 4, start: 0, words: (v) => ["Nothing packed for the journey", "A little food, one spare jumper", "Warm things for the children, food for a day", "Warm clothes for everyone, food for two days", "Well supplied: blankets, food, dry socks"][v]! },
    { id: "luggage", label: "Luggage", min: 0, max: 6, start: 0, words: (v) => (v === 0 ? "Nothing to carry" : v === 1 ? "One bag, easy to carry at a run" : v === 2 ? "Two bags" : `${v} bags: a lot to carry down a beach at night`) },
    { id: "tired", label: "The family", min: 0, max: 10, start: 1, words: (v) => (v <= 1 ? "Rested enough" : v <= 3 ? "Tired" : v <= 6 ? "Very tired; the children are fretful" : "Exhausted; everyone is near the end of their strength") },
    { id: "helpers", label: "People helping you", min: 0, max: 6, start: 0, words: (v) => (v === 0 ? "Nobody yet" : v === 1 ? "One person you can call on" : `${v} people you can call on`) },
  ],
  start: {
    scene: "h-evening",
    time: start,
    where: {
      hanna: { place: "flat", ...home },
      david: { place: "flat", ...home },
      ruth: { place: "flat", ...home },
      benny: { place: "flat", ...home },
      sara: { place: "frederiksberg", ...home },
      peter: { place: "farm", ...home },
      kirsten: { place: "flat", ...home },
      ole: { place: "copenhagen", ...home },
      klara: { place: "copenhagen", ...home },
      moritz: { place: "copenhagen", ...home },
      else: { place: "helsingor", ...home },
      anders: { place: "snekkersten", ...home },
      poul: { place: "snekkersten", ...home },
      viggo: { place: "helsingor", ...home },
      marta: { place: "helsingborg", ...home },
      lis: { place: "copenhagen", ...home },
      aron: { place: "copenhagen", ...home },
    },
    known: ["david", "ruth", "benny", "sara", "peter"],
  },
  scenes: [...SCENES_1, ...SCENES_2, ...SCENES_3],
  endings: ENDINGS,
};
