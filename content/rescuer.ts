/**
 * Campaign 2, the Danish rescuer: Anders Krogh, a fisherman of Snekkersten,
 * and his boat the Ternen, from an ordinary Thursday in September to the
 * middle of October 1943.
 */
import { at } from "../engine/calendar.ts";
import type { Campaign } from "../engine/types.ts";
import { kroner } from "./kit.ts";
import { R_SCENES_1 } from "./rescuer-1.ts";
import { R_SCENES_2 } from "./rescuer-2.ts";
import { R_ENDINGS, R_SCENES_3 } from "./rescuer-3.ts";

const start = at("1943-09-30", 5);
const home = { condition: "home" as const, since: start };

export const RESCUER: Campaign = {
  role: "rescuer",
  label: "Danish rescuer",
  pitch: "Anders Krogh fishes the Sound from Snekkersten with his son. When a doctor asks whether he will take people across to Sweden, he has a boat, a family, a fuel problem and four kilometers of water to think about.",
  protagonist: "anders",
  cast: ["anders", "inger", "poul", "else", "erik", "holger", "viggo", "hanna", "david", "ruth", "benny", "klara", "moritz", "lis", "aron", "sara"],
  vars: [
    { id: "capacity", label: "Room below deck", min: 10, max: 14, start: 12, words: (v) => `${v} people, safely` },
    { id: "aboard", label: "Aboard now", min: 0, max: 14, start: 0, words: (v) => (v === 0 ? "Nobody" : `${v} passengers below`) },
    { id: "fuel", label: "Fuel", min: 0, max: 8, start: 2, words: (v) => (v === 0 ? "None: the Ternen cannot cross" : v === 1 ? "Enough for one crossing there and back" : `Enough for ${v} crossings there and back`) },
    { id: "funds", label: "Money in Inger's tin", min: 0, max: 80, start: 3, words: (v) => (v === 0 ? "Nothing" : `About ${kroner(v)}`) },
    { id: "tired", label: "You and your crew", min: 0, max: 14, start: 1, words: (v) => (v <= 2 ? "Rested" : v <= 5 ? "Tired" : v <= 8 ? "Very tired: slow hands, short tempers" : "Exhausted: the kind of tired that makes mistakes at sea") },
    { id: "ready", label: "The Ternen", min: 0, max: 3, start: 0, words: (v) => ["An old fishing boat, as she always was", "Partly ready for passengers", "Nearly ready for passengers", "Ready: engine sound, hold clear, signals agreed"][v]! },
    { id: "carried", label: "Carried to Sweden", min: 0, max: 99, start: 0, words: (v) => (v === 0 ? "Nobody yet" : `${v} people`) },
  ],
  start: {
    scene: "r-morning",
    time: start,
    where: {
      anders: { place: "snekkersten", ...home },
      inger: { place: "kroghouse", ...home },
      poul: { place: "snekkersten", ...home },
      else: { place: "helsingor", ...home },
      erik: { place: "helsingor", ...home },
      holger: { place: "boathouse", ...home },
      viggo: { place: "helsingor", ...home },
      hanna: { place: "copenhagen", ...home },
      david: { place: "copenhagen", ...home },
      ruth: { place: "copenhagen", ...home },
      benny: { place: "copenhagen", ...home },
      klara: { place: "copenhagen", ...home },
      moritz: { place: "copenhagen", ...home },
      lis: { place: "copenhagen", ...home },
      aron: { place: "copenhagen", ...home },
      sara: { place: "frederiksberg", ...home },
    },
    known: ["inger", "poul"],
  },
  scenes: [...R_SCENES_1, ...R_SCENES_2, ...R_SCENES_3],
  endings: R_ENDINGS,
};
