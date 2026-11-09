/**
 * Campaign 3, the Swedish receiver: Märta Lindqvist, a schoolteacher and Red
 * Cross volunteer in Helsingborg, from an ordinary Friday to the middle of
 * October 1943.
 *
 * The reception building, the church hall, the summer hotel inland and every
 * volunteer and host are fictional. Ramlösa, the radio statement, the move
 * inland, the emergency visa and the police form with its "Jude" box are from
 * docs/history/sweden-finland.md, Part A.
 */
import { at } from "../engine/calendar.ts";
import type { Campaign, PlaceDef } from "../engine/types.ts";
import { SCENES_1 } from "./receiver-1.ts";
import { SCENES_2 } from "./receiver-2.ts";
import { ENDINGS, SCENES_3 } from "./receiver-3.ts";

/** Places only this campaign uses; merge them into PLACES. */
export const RECEIVER_PLACES: PlaceDef[] = [
  { id: "school-se", name: "Märta's school, Helsingborg", side: "sweden" },
  { id: "hall", name: "the church hall on the harbor, Helsingborg", side: "sweden" },
  { id: "ramlosa", name: "the refugee camp at the Ramlösa spa, Helsingborg", side: "sweden" },
  { id: "inland", name: "a summer hotel inland", side: "sweden" },
  { id: "viken", name: "Viken, up the coast north of Helsingborg", side: "sweden" },
];

const start = at("1943-10-01", 14, 30);
const home = { condition: "home" as const, since: start };
const hidden = { condition: "hidden" as const, since: start };

export const RECEIVER: Campaign = {
  role: "receiver",
  label: "Swedish receiver",
  pitch: "Märta Lindqvist teaches geography in Helsingborg, four kilometers from Denmark. When the boats start coming at night, she has a Red Cross armband, a husband at the harbor office, a doctor who will come at any hour, and a great many names to spell.",
  protagonist: "marta",
  cast: ["marta", "nils", "gunnar", "ivar", "elsa", "folke", "hanna", "david", "ruth", "benny", "sara", "peter", "klara", "moritz", "lis", "aron", "anders", "poul"],
  vars: [
    { id: "beds", label: "Beds", min: 0, max: 60, start: 0, words: (v) => (v === 0 ? "No beds free tonight" : v === 1 ? "One bed free tonight" : `${v} beds free tonight`) },
    { id: "clothes", label: "Dry clothes", min: 0, max: 12, start: 2, words: (v) => (v === 0 ? "Nothing dry left to give anyone" : v === 1 ? "One bundle of dry clothes, a family's worth" : `${v} bundles of dry clothes, a family's worth each`) },
    { id: "bus", label: "Transport", min: 0, max: 3, start: 0, words: (v) => ["No bus of your own to call on", "Folke can spare a bus for one run", "Folke can spare a bus for two runs", "Folke can spare a bus for three runs"][v]! },
    {
      id: "tired",
      label: "The volunteers",
      min: 0,
      max: 10,
      start: 1,
      words: (v) => (v <= 1 ? "Rested" : v <= 3 ? "Tired" : v <= 5 ? "Very tired; small mistakes are creeping in" : v <= 7 ? "Exhausted; people fall asleep sitting up" : "At the end of everyone's strength, yours included"),
    },
    {
      id: "lists",
      label: "The name lists",
      min: 0,
      max: 5,
      start: 0,
      words: (v) =>
        [
          "No lists of your own yet",
          "Names in an exercise book, spelled as heard",
          "Names spelled back, families kept together",
          "Names spelled back and cross-checked",
          "Cross-checked, with other spellings noted",
          "Every name spelled back, linked and cross-referenced",
        ][v]!,
    },
    { id: "found", label: "Matched by your lists", min: 0, max: 6, start: 0, words: (v) => (v === 0 ? "Nobody matched to their family yet" : v === 1 ? "One person matched to their family" : `${v} people matched to their families`) },
  ],
  start: {
    scene: "s-friday",
    time: start,
    where: {
      marta: { place: "school-se", ...home },
      nils: { place: "lindqvist", ...home },
      gunnar: { place: "hospital-se", ...home },
      ivar: { place: "helsingborg", ...home },
      elsa: { place: "nystrom", ...home },
      folke: { place: "helsingborg", ...home },
      hanna: { place: "copenhagen", ...hidden },
      david: { place: "copenhagen", ...hidden },
      ruth: { place: "copenhagen", ...hidden },
      benny: { place: "copenhagen", ...hidden },
      sara: { place: "parsonage", ...hidden },
      peter: { place: "farm", ...home },
      klara: { place: "copenhagen", ...hidden },
      moritz: { place: "copenhagen", ...hidden },
      lis: { place: "copenhagen", ...hidden },
      aron: { place: "copenhagen", ...hidden },
      anders: { place: "snekkersten", ...home },
      poul: { place: "snekkersten", ...home },
    },
    known: ["nils"],
  },
  scenes: [...SCENES_1, ...SCENES_2, ...SCENES_3],
  endings: ENDINGS,
};
