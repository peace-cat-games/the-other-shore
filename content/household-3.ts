/**
 * The Jewish household, chapter 6 and the endings: landing in Helsingborg,
 * the lists, reunion, and what became of everyone.
 */
import type { Ending, PersonOutcome, Read, Scene } from "../engine/types.ts";
import { FAMILY } from "./household-1.ts";

const apart = (r: Read, p: string) => r.truth(p).place !== r.truth("hanna").place;
const found = (r: Read) => r.has("h:spelled") || r.has("h:reunion-plan") || r.has("h:informed");

export const SCENES_3: Scene[] = [
  {
    id: "h-shore",
    role: "household",
    chapter: "The other shore",
    place: "helsingborg",
    title: "Helsingborg",
    body: (r) => [
      `Lamps on a stone quay in the middle of the night, and people waiting for you: Swedish policemen in unfamiliar uniforms, women of the Lotta corps in grey with blankets and jugs of something hot. Nobody shouts. ${r.has("h:turned-back") ? "It has taken two nights to get here." : "It is not yet three in the morning."}`,
      "A policeman gives each adult a slip of paper, an emergency visa, and says the questions will come later. A schoolteacher with a Red Cross armband kneels to put a blanket round Benny, then sits at a folding table with a pen. 'Märta,' she says, pointing at herself. 'Names, please, and slowly. Danish names have letters we spell differently.'",
      `${r.has("h:drops") ? "Benny is still heavy with sleep." : "Benny is awake and wants to know if this is Sweden, and if Swedish children have rabbits."} Ruth's teeth are chattering. You are standing on dry land, and it does not move.`,
    ],
    options: [
      {
        id: "spell",
        label: "Spell every name carefully, and give Sara's and Peter's names for the lists too",
        hint: "The lists are how people find each other here.",
        act: (c) => {
          c.set("h:spelled");
          c.learn("marta", "saw");
          c.say("L-E-V-I-N. With a V. Märta writes it in capitals and reads it back. Then Sara Levin, seventy-seven; then Peter Weil, seventeen, from Vienna, last seen on a farm in Zealand. 'If they come through any landing in Skåne,' she says, 'their names will reach these lists.'");
          c.pass(3 * 60);
          c.go("h-reunion");
        },
      },
      {
        id: "ask",
        label: "Ask first whether anyone has seen Grandmother Sara or Peter",
        hint: "You can't think of anything else.",
        act: (c) => {
          c.set("h:asked-se");
          c.learn("marta", "saw");
          c.say("Märta runs her finger down three sheets of names, slowly, twice. Not yet, she says. Boats are landing all along the coast. She writes their names on a separate card and pins it to the board behind her, where many other cards are already pinned.");
          c.pass(3 * 60);
          c.go("h-reunion");
        },
      },
      {
        id: "sleep",
        label: "Let the children sleep first; the names can wait",
        hint: "Everyone is exhausted.",
        act: (c) => {
          c.set("h:late-register");
          c.add("tired", -2);
          c.say("You sleep for four hours on straw mattresses in the old spa buildings at Ramlösa, which have been turned over to refugees. When you register at last, it is with a tired policeman, who writes LEWIN.");
          c.pass(6 * 60);
          c.go("h-reunion");
        },
      },
    ],
  },
  {
    id: "h-reunion",
    role: "household",
    chapter: "The other shore",
    place: "reception",
    title: "The lists",
    body: (r) => {
      const out = ["The days in Helsingborg run together: soup, a doctor listening to Benny's chest, a police interview with a long printed form (name, birthplace, occupation, religion, money brought), and Ruth asking a Swedish girl the word for everything."];
      if (r.has("h:david-split")) out.push(found(r) ? "On Thursday night David comes up the steps of the school with his mother on his arm. She is demanding a chair. He is laughing, which he has not done in a week." : "On Friday a policeman comes to find you with a list from Råå: David Lewin and Sara Lewin, landed Thursday night. You run the whole way.");
      else if (apart(r, "sara")) out.push(found(r) ? "On Friday morning Märta comes to find you herself: Sara Levin, seventy-seven, landed at Råå in the night with a pastor's widow's blessing and a folding stool. She is asking for a chair." : "For four days there is no word of Sara. Then her name appears on a list sent up from Råå: Lewin, Sara, 77. She had been in the next town all along, asking for you as Levin.");
      if (apart(r, "peter")) out.push(found(r) ? "On Tuesday a card arrives through the Red Cross: Peter Weil has landed north of Helsingborg with two boys from the farm, and wants to know if Ruth has been practicing her chess." : "Of Peter there is no word. His name is on a card on Märta's board, among many others.");
      return out;
    },
    options: [
      {
        id: "host",
        label: "Accept rooms with a family in Lund who have offered to take a Danish family",
        hint: "A real home for a while, in a university town full of Danes.",
        act: (c) => {
          c.set("h:with-family");
          c.say("The family in Lund are a professor of botany, his wife and three silent sons. They give Benny a wooden horse that belonged to the youngest, and Ruth a Swedish grammar, and you the key to the front door on the first evening. In November a Danish school opens in the town.");
          finish(c);
        },
      },
      {
        id: "hostel",
        label: "Go with the others to a hostel for Danish refugees",
        hint: "With other Danish families, sharing everything.",
        act: (c) => {
          c.set("h:hostel");
          c.say("The authorities are moving the Jewish refugees away from the coast. A bus takes you inland through flat brown fields to a summer hotel, empty for the season, full now of Danish voices. There are lessons in the dining room by the second week. Ruth corrects the teacher's spelling and is made a monitor.");
          finish(c);
        },
      },
      {
        id: "stay",
        label: "Stay at Ramlösa for now, near the boats, to wait for news of Peter",
        show: (r) => apart(r, "peter") && !found(r),
        hint: "Crowded, and close to the lists.",
        act: (c) => {
          c.set("h:waited-peter");
          c.say("You keep your straw mattresses at Ramlösa and walk into town every morning to read the lists. Märta learns to recognise you from across the square, and shakes her head before you reach her, kindly, so that you do not have to ask.");
          finish(c);
        },
      },
    ],
  },
];

function finish(c: Parameters<Scene["options"][number]["act"]>[0]): void {
  c.pass(6 * 24 * 60);
  const unresolved = apart(c, "peter") && !found(c);
  for (const p of FAMILY) if (!c.has("h:david-split") || p !== "david") c.move(p, c.has("h:waited-peter") ? "helsingborg" : "sweden", "safe");
  if (c.has("h:david-split")) c.move("david", c.truth("hanna").place, "safe");
  if (apart(c, "sara")) c.move("sara", c.truth("hanna").place, "safe");
  c.learn("sara", "saw");
  c.learn("david", "saw");
  if (!unresolved && apart(c, "peter")) {
    c.move("peter", "sweden", "safe");
    c.learn("peter", "letter");
  }
  c.end(unresolved ? "h-apart" : "h-together");
}

const KEEPSAKES = (r: Read): string => {
  if (r.has("h:candles-beach")) return "The candlesticks stayed on a beach in Snekkersten. Some things that were left behind found their way back after the war, and some did not.";
  if (r.has("h:candles-left")) return "The candlesticks waited in a cupboard under the stairs at Snekkersten, labelled LEVIN in pencil.";
  if (r.has("h:candlesticks")) return "On the first Friday in Sweden the candlesticks were lit on a borrowed table, and everyone who came into the room stood still for a moment.";
  return "The candlesticks stayed in the flat in Østerbro.";
};

function household(r: Read): PersonOutcome[] {
  const where = r.has("h:with-family") ? "with a family in Lund" : r.has("h:hostel") ? "in a hostel for Danish refugees" : "at Ramlösa, near Helsingborg, until news came";
  const out: PersonOutcome[] = [
    { person: "hanna", kind: "accommodation", text: `In Sweden, ${where}. She kept the accounts for a refugee committee and did not let a single krone go astray. ${KEEPSAKES(r)}` },
    { person: "david", kind: r.has("h:david-split") ? "reunion" : "safety", text: r.has("h:david-split") ? "Crossed a night later with his mother and found his family through the lists. He taught Danish history to Danish children in Sweden, and was not, he said, short of material." : "In Sweden with his family. He taught Danish history to Danish children in Sweden, and was not, he said, short of material." },
    { person: "ruth", kind: "safety", text: `${r.has("h:with-family") ? "Went to the Danish school in Lund. " : ""}${r.has("h:essay") ? "Finished her lighthouse essay in Sweden, in Danish, with a new last paragraph about a light on the other shore." : "Learned Swedish in a month and corrected everyone's spelling in two languages."} She did become a doctor.` },
    { person: "benny", kind: "safety", text: r.has("h:rabbit") ? "Kept the one-eared rabbit and does not remember the crossing, only the lighthouse game." : "Does not remember the crossing. He remembers a wooden horse, and snow." },
  ];
  out.push(
    !r.has("h:sara-with") && !r.has("h:waited") && !r.has("h:david-split")
      ? { person: "sara", kind: "reunion", text: "Crossed with a pastor's widow's people and landed at Råå, and was found through the lists. She told everyone who would listen that the Swedish coffee was weaker than the parsonage's." }
      : { person: "sara", kind: "safety", text: "Crossed with her family and complained about the boat's lack of chairs all the way to Sweden. She lived to see the family home again." },
  );
  out.push(
    r.has("h:peter-reached") || r.has("h:letter")
      ? { person: "peter", kind: "safety", text: "Crossed with the Levins. After the war he went to Palestine with friends from the farm training groups, and wrote to Ruth every month, about chess." }
      : r.truth("peter").condition === "safe"
        ? { person: "peter", kind: "reunion", text: "Crossed on his own with two boys from the farm and was found through the Red Cross lists. He visited every Sunday and lost to Ruth at chess." }
        : { person: "peter", kind: "unresolved", text: "When this account ends, his name is still on a card on the board in Helsingborg. A letter came in November: he had landed further up the coast and been sent to work on a farm in Skåne." },
  );
  if (r.has("h:felds")) out.push({ person: "klara", kind: "safety", text: `Crossed with the Levins${r.has("h:paid-felds") ? ", her passage paid by them, a debt she repaid in Sweden in German lessons for Ruth" : ""}. She and Moritz stayed in Sweden after the war.` }, { person: "moritz", kind: "safety", text: "Opened a small bookshop in Sweden after the war, with Heine in the window." });
  if (r.has("h:helped-lis")) out.push({ person: "lis", kind: "safety", text: "Her daughter was born in Sweden in December. She was named after nobody in particular, and Hanna was asked to be there." });
  return out;
}

function home(r: Read): PersonOutcome[] {
  const out: PersonOutcome[] = [];
  if (r.has("h:keys")) out.push({ person: "kirsten", kind: "ordinary", text: "Watered the geraniums for nineteen months and kept the Levins' flat for them. When they came home in 1945 the key was on the nail beside her own." });
  else out.push({ person: "kirsten", kind: "ordinary", text: "Went on singing in the church choir. The Levins' flat was let to other people while they were away; Mrs Bech saved what she could of their things." });
  if (r.has("h:ole")) out.push({ person: "ole", kind: "ordinary", text: "Went on teaching, and went on arranging 'excursions to the coast' for as long as anyone needed one." });
  if (r.has("h:boat-tern")) out.push({ person: "anders", kind: "ordinary", text: "The skipper who took them across. The Levins never learned what it cost him, and he never asked them for more." });
  return out;
}

export const ENDINGS: Ending[] = [
  {
    id: "h-together",
    title: "On the other shore",
    body: () => [
      "You came across the water in the dark, and the other shore was waiting with blankets, soup and a schoolteacher who spelled your name right.",
      "For the next nineteen months you lived as guests in a country that had chosen to take you in. The children went to school. You worked. You waited for news from home, and argued about it, and celebrated the festivals in borrowed rooms.",
      "In the early summer of 1945 you went home to Copenhagen.",
    ],
    outcomes: (r) => [...household(r), ...home(r)],
  },
  {
    id: "h-apart",
    title: "Not yet together",
    body: () => [
      "You came across the water in the dark, and the other shore was waiting. Not everyone you love came with you, and when this account ends you are still waiting for one name on a list.",
      "That was how it was for many families that October: safe, and incomplete, and checking the lists every morning. Most of the waiting ended in a letter or a knock on the door. Yours did too.",
      "In the early summer of 1945 you went home to Copenhagen.",
    ],
    outcomes: (r) => [...household(r), ...home(r)],
  },
  {
    id: "h-held",
    title: "Taken",
    body: () => [
      "You were arrested on the beach, a few meters from the boat. That October about two hundred people were caught trying to reach Sweden, most of them on land, many betrayed by informers. Thousands more crossed safely. Arrest came by chance and by betrayal, never because anyone deserved it.",
      "You were held in the camp at Horserød, and in the middle of October you were deported with others to Theresienstadt, a ghetto and camp in occupied Czechoslovakia.",
      "Denmark did not forget you. Danish officials and the Danish Red Cross demanded, again and again, to know what had become of the Danish Jews held there. That pressure helped keep them from being sent on further east. Parcels of clothes came from home that winter, and food parcels the next year. In April 1945 the white buses of the Swedish Red Cross brought you out to Sweden. Of the nearly five hundred Danish Jews deported to Theresienstadt, about fifty died there. The rest came home.",
    ],
    outcomes: (r) => [
      { person: "hanna", kind: "held", text: "Held in Theresienstadt until April 1945, when the Swedish Red Cross brought her out to Sweden with her family. She went home to Copenhagen that summer, and kept every letter the parcels had brought." },
      { person: "david", kind: "held", text: "Held with his family. Freed in April 1945." },
      { person: "ruth", kind: "held", text: "Held with her family. Freed in April 1945. She did become a doctor." },
      { person: "benny", kind: "held", text: "Held with his family. Freed in April 1945. He remembers the white buses." },
      ...(r.truth("sara").condition === "held" ? [{ person: "sara", kind: "held" as const, text: "Held with her family, one of the oldest of the Danish Jews in Theresienstadt. She lived to come home." }] : [{ person: "sara", kind: "safety" as const, text: "Crossed safely with her own helpers, and waited in Sweden for news of her family." }]),
      ...(r.truth("peter").condition === "held" ? [{ person: "peter", kind: "held" as const, text: "Held with the Levins. Freed in April 1945. After the war he went to Palestine with friends from the farm training groups." }] : [{ person: "peter", kind: "safety" as const, text: "Crossed on his own and was safe in Sweden. He wrote to the Danish Red Cross every month asking for news of the Levins, until there was news." }]),
      ...(r.truth("klara").condition === "held" ? [{ person: "klara", kind: "held" as const, text: "Held in Theresienstadt with Moritz. Stateless, she was among those Denmark went on asking for. Both were freed in April 1945." }] : []),
      ...home(r),
    ],
  },
];
