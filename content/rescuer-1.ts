/**
 * The Danish rescuer, chapters 1 to 3: the Sound in ordinary time, the
 * request, the preparations and the first crossing. Anders Krogh fishes
 * from Snekkersten in the Ternen with his son Poul.
 *
 * Fictional simulation parameters, documented where used. The Ternen is a
 * motor fishing boat; twelve to fourteen passengers below deck is the
 * documented range for boats of her size (docs/history/corridor.md §3).
 */
import { at } from "../engine/calendar.ts";
import type { Ctx, Read, Scene } from "../engine/types.ts";

/** What the passengers pay into the network's fund, per crossing, by the skipper's terms (hundreds of kroner). */
export function takings(r: Read): number {
  if (r.has("r:free")) return 0;
  if (r.has("r:dear")) return 12;
  return 4;
}

/** A round trip uses one crossing's worth of fuel and tires the crew. */
export function cross(c: Ctx, passengers: number): void {
  c.add("fuel", -1);
  c.add("tired", 3);
  c.add("carried", passengers);
  c.add("funds", takings(c));
}

export function boardPassengers(c: Ctx, n: number): void {
  c.add("aboard", n - c.v("aboard"));
}

const PREP_END = at("1943-10-03", 20);

export const R_SCENES_1: Scene[] = [
  {
    id: "r-morning",
    role: "rescuer",
    chapter: "The Sound",
    place: "snekkersten",
    title: "Thursday on the water",
    body: () => [
      "Before dawn the Sound is the colour of a slate roof. You take the Ternen out past the end of the little harbor with Poul in the bow, half asleep and pretending not to be, and the engine settles into the beat you have known for twenty years.",
      "Across the water Sweden is a low dark line with lights in it. You stopped noticing the lights years ago. This autumn you notice them again.",
      "The nets come up with enough herring to pay for the week and not much more. On the way in you pass a grey German boat going about its business, which this year seems to be mines. Nobody waves.",
    ],
    options: [
      {
        id: "holger",
        label: "Spend the afternoon with Holger in his boatshed, mending nets",
        hint: "Holger can hear what is wrong with an engine from the end of the jetty.",
        act: (c) => {
          c.set("r:holger");
          c.learn("holger", "saw");
          c.say("Holger listens to the Ternen idle for a whole minute with his eyes shut, like a doctor with a stethoscope, and says the injector is tired and so is he. He will look at it properly when you need it. 'And you will need it,' he adds, and does not explain.");
          c.pass(8 * 60);
          c.go("r-rumor");
        },
      },
      {
        id: "market",
        label: "Take the catch to the market in Helsingør yourself",
        hint: "Better prices, and all the news of the town.",
        act: (c) => {
          c.set("r:market");
          c.add("funds", 2);
          c.learn("erik", "saw");
          c.say("You get a fair price and a great deal of talk. Erik Lund, who drives a taxi, buys two herring he does not want and says he has been driving a lot of people north lately, nice people with too much luggage, who all want to go to the coast for a holiday in October.");
          c.pass(6 * 60);
          c.go("r-rumor");
        },
      },
      {
        id: "poul",
        label: "Stay out longer and teach Poul to read the weather",
        hint: "He wants to skipper his own boat one day.",
        act: (c) => {
          c.set("r:poul-weather");
          c.learn("poul", "saw");
          c.say("You show him how the wind backs before rain, how the swell comes round the point at Kullen before a westerly, how the gulls sit. He asks a hundred questions and, for once, listens to the answers.");
          c.pass(5 * 60);
          c.go("r-rumor");
        },
      },
    ],
  },
  {
    id: "r-rumor",
    role: "rescuer",
    chapter: "The Sound",
    place: "kroghouse",
    title: "Strangers on the coast road",
    body: (r) => [
      "Friday evening. Inger has a letter from her sister in Copenhagen that says, between the lines about the weather and the price of butter, that something is going to happen to the Jews tonight.",
      `On the coast road there are people walking who do not walk like people from here: city shoes, good coats, a suitcase too heavy for the woman carrying it. ${r.has("r:market") ? "You think of Erik's nice people with too much luggage." : "One of them asks you the way to the station, and then, quietly, whether you have a boat."}`,
      "Inger stands at the window a long time. 'Well,' she says at last. 'You have a boat.'",
    ],
    options: [
      {
        id: "inger",
        label: "Sit down with Inger and talk it through properly",
        hint: "If you do this, you do it together, or not at all.",
        act: (c) => {
          c.set("r:inger");
          c.learn("inger", "saw");
          c.say("You talk until the stove goes out. She asks what happens to the boat if you are caught, and to you, and to Poul. You say you do not know. She says that is the first honest thing anyone has said about it. Then she says: 'Ask the doctor what they need.'");
          c.pass(3 * 60);
          c.go("r-request");
        },
      },
      {
        id: "shed",
        label: "Leave a lamp burning in the boatshed for anyone who needs a roof tonight",
        hint: "Kind, and noticed by anyone who is watching.",
        act: (c) => {
          c.set("r:shed");
          c.set("r:risk-talk");
          c.say("In the morning there are seven people asleep among the nets: a family with a baby, two old sisters and a young man who says he is a dentist. They are gone again by noon, on a boat from further down the coast. Half the street saw them leave.");
          c.pass(12 * 60);
          c.go("r-request");
        },
      },
      {
        id: "wait",
        label: "Keep your head down tonight. See what tomorrow brings",
        hint: "There is no shame in thinking first.",
        act: (c) => {
          c.set("r:waited");
          c.say("You lock the boatshed and go to bed, and do not sleep. Towards midnight cars go by on the coast road, fast, and then nothing.");
          c.pass(12 * 60);
          c.go("r-request");
        },
      },
    ],
  },
  {
    id: "r-request",
    role: "rescuer",
    chapter: "The request",
    place: "kroghouse",
    title: "The doctor's question",
    body: (r) => [
      "On Saturday Dr Brandt comes up the path with her black bag, as if somebody in the house were ill. Inger gives her coffee. The doctor does not waste time.",
      "There are people hidden all along this coast, she says: in summer houses, in hotels, in the brickworks lofts, in her own surgery. Sweden will take them; it will be on the Swedish radio tonight. What they need is boats, and men who can keep their mouths shut. A small group of people here can bring them to the beach and feed them and keep watch. Will you take them across?",
      `${r.has("r:inger") ? "Inger is watching you, and you already know her answer." : "Inger is watching you over the coffee pot."} Then the doctor asks the other question, the one that is always asked: what will it cost?`,
    ],
    options: [
      {
        id: "cost",
        label: "Your costs, and the risk to the boat, and no more: let the network's fund handle the rest",
        hint: "The way the doctor's people prefer: those who can pay, pay more, so that those who cannot still go.",
        act: (c) => {
          c.set("r:cost");
          c.set("r:yes");
          c.learn("else", "saw");
          c.say("The doctor nods as if you had passed a test she was too polite to mention. Fuel, upkeep, a little for the risk; she will collect it and pay you, and nobody on your boat will ever be asked for money by you. 'That way,' she says, 'nobody has to look anyone in the eye about it.'");
          c.pass(60);
          c.go("r-prepare");
        },
      },
      {
        id: "free",
        label: "Nothing. You will not take money for this",
        hint: "Fuel and repairs still have to be paid for, and Inger keeps the accounts.",
        act: (c) => {
          c.set("r:free");
          c.set("r:yes");
          c.learn("else", "saw");
          c.say("Inger says nothing, which is worse than anything she could say. The doctor says she understands, and that the fund will buy your fuel whether you like it or not, because the people in the summer houses cannot swim.");
          c.pass(60);
          c.go("r-prepare");
        },
      },
      {
        id: "dear",
        label: "A thousand kroner a head. The risk is real, and others are asking more",
        hint: "Some fishermen asked that, and some far more. The doctor will not like it.",
        act: (c) => {
          c.set("r:dear");
          c.set("r:yes");
          c.learn("else", "saw");
          c.say("The doctor writes the figure down without comment. 'Some of them can pay that,' she says. 'Some cannot. I shall send you the ones who can.' It is a fair answer. You find you do not like it as much as you expected to.");
          c.pass(60);
          c.go("r-prepare");
        },
      },
      {
        id: "think",
        label: "Ask for a day to think it over",
        hint: "A day is a day for the people waiting, too.",
        act: (c) => {
          c.set("r:thought");
          c.set("r:cost");
          c.set("r:yes");
          c.learn("else", "saw");
          c.say("The doctor says of course. That night the Swedish radio says it plainly: Sweden will receive Denmark's Jews. On Sunday morning Poul comes in from the harbor and says that Viggo Hansen took twenty people across last night and charged them each more than a month's wages. You put on your coat and walk to the doctor's house, and say: costs, and the risk to the boat, and no more.");
          c.pass(18 * 60);
          c.go("r-prepare");
        },
      },
    ],
  },
  {
    id: "r-prepare",
    role: "rescuer",
    chapter: "Preparations",
    place: "snekkersten",
    title: "Getting ready",
    body: (r) => {
      const done = ["r:signals", "r:engine", "r:hold", "r:police", "r:fuel"].filter((f) => r.has(f)).length;
      return [
        r.time < at("1943-10-03", 6) ? "Saturday afternoon. The first group could go tomorrow night, if the boat and the shore are ready." : "Sunday. The first group goes tonight, if the boat and the shore are ready.",
        done === 0 ? "There is a great deal to do, and it all has to look like ordinary fishing." : done >= 4 ? "Most of it is done. The rest you will have to manage on the night." : "Some of it is done. Every hour you spend is an hour somebody waits in a cold summer house.",
        `The Ternen can carry ${r.v("capacity")} people below deck as she is. You have fuel for ${r.v("fuel") === 1 ? "one crossing" : `${r.v("fuel")} crossings`}.`,
      ];
    },
    options: [
      {
        id: "signals",
        label: "Agree signals with the doctor's courier",
        show: (r) => !r.has("r:signals"),
        hint: "Coloured lamps from the shore: safe, wait, danger. Then nobody has to shout.",
        act: (c) => {
          c.set("r:signals");
          c.add("ready", 1);
          c.say("The courier is a schoolboy with a bicycle and a torch with three coloured glasses. Green: come in. Red: stay off. Nothing: wait. You make him say it back twice, and he makes you say it back three times.");
          c.pass(90);
          c.go("r-prepare");
        },
      },
      {
        id: "engine",
        label: "Ask Holger to look at the engine",
        show: (r) => !r.has("r:engine"),
        hint: (r) => (r.has("r:holger") ? "He has been waiting for you to ask." : "He has not been asked a favor by you in years."),
        act: (c) => {
          c.set("r:engine");
          c.add("ready", 1);
          c.learn("holger", "saw");
          c.say(c.has("r:holger") ? "Holger has the injector out and cleaned and back in by dark, and charges you a bottle of schnapps, payable after the war." : "Holger grumbles, then spends four hours on his back under your engine and comes out black to the elbows. 'Tired injector,' he says. 'Like everyone on this coast.'");
          c.pass(c.has("r:holger") ? 150 : 240);
          c.go("r-prepare");
        },
      },
      {
        id: "hold",
        label: "Make room below deck: clear the hold, lay boards and sacking",
        show: (r) => !r.has("r:hold"),
        hint: "Two more people below, in more comfort, out of sight of anyone on deck.",
        act: (c) => {
          c.set("r:hold");
          c.add("ready", 1);
          c.add("capacity", 2);
          c.say("You and Poul clear out the fish boxes, scrub the hold with seawater until it smells of salt instead of herring, lay planks across the bilges and old sacks on the planks. Fourteen people, if they are friends. They will be friends by Sweden.");
          c.pass(4 * 60);
          c.go("r-prepare");
        },
      },
      {
        id: "police",
        label: "Have a quiet word with a policeman you were at school with",
        show: (r) => !r.has("r:police"),
        hint: "The Danish police know where the Germans will be. Many of them will tell a friend.",
        act: (c) => {
          c.set("r:police");
          c.say("Constable Rasmussen is mending his garden fence and does not look up. He says he hears things in the station, now and then, about where the Gestapo from Helsingør mean to drive of an evening, and that a man might ask him over a beer. He also says he never said that.");
          c.pass(60);
          c.go("r-prepare");
        },
      },
      {
        id: "fuel",
        label: "See about fuel",
        show: (r) => !r.has("r:fuel"),
        hint: "Every crossing there and back burns fuel you would otherwise fish with.",
        act: (c) => {
          c.pass(30);
          c.go("r-fuel");
        },
      },
      {
        id: "go",
        label: (r) => (r.time < PREP_END ? "Enough. Tell the doctor you are ready" : "It is time. The courier is waiting"),
        hint: (r) => (r.v("fuel") < 1 ? "You have no fuel for a crossing." : r.v("ready") < 2 ? "Not everything is ready." : undefined),
        needs: (r) => (r.v("fuel") >= 1 ? null : "The Ternen has no fuel for a crossing."),
        act: (c) => {
          if (c.time < at("1943-10-03", 21)) c.pass(at("1943-10-03", 21) - c.time);
          if (!c.has("r:signals")) c.set("r:risk-nosignal");
          c.go("r-board1");
        },
      },
    ],
  },
  {
    id: "r-fuel",
    role: "rescuer",
    chapter: "Preparations",
    place: "snekkersten",
    title: "Fuel",
    body: (r) => [
      `The Ternen has fuel for ${r.v("fuel") === 1 ? "one crossing" : `${r.v("fuel")} crossings`} there and back, and fuel this autumn is short and dear. Everyone on the coast wants it now.`,
      `Inger's tin holds ${r.v("funds") * 100} kroner. The doctor's fund holds more, and has more calls on it.`,
    ],
    options: [
      {
        id: "fund",
        label: "Let the doctor's fund buy it, as she offered",
        hint: "Fuel bought with money given for this. The fund has other calls on it.",
        act: (c) => {
          c.set("r:fuel");
          c.add("fuel", 3);
          c.say("By evening four drums stand in Holger's shed under a tarpaulin, paid for by people you will never meet. The doctor gives you a receipt you are to burn.");
          c.pass(3 * 60);
          c.go("r-prepare");
        },
      },
      {
        id: "holger",
        label: "Ask Holger about the drums he swears he does not have",
        needs: (r) => (r.has("r:holger") || r.has("r:engine") ? null : "You would have to be on better terms with Holger first."),
        hint: "Old fuel, and old friendship.",
        act: (c) => {
          c.set("r:fuel");
          c.set("r:holger-fuel");
          c.add("fuel", 2);
          c.say("Holger looks at you for a long time and then says that a man who builds boats keeps a little something under the floor for emergencies, and this is one. Two drums. He will not take money for them.");
          c.pass(90);
          c.go("r-prepare");
        },
      },
      {
        id: "viggo",
        label: "Buy from Viggo, who always has fuel and always has a price",
        hint: "Quick. Expensive. Viggo will know your business.",
        needs: (r) => (r.v("funds") >= 4 ? null : "You haven't the money for Viggo's prices."),
        act: (c) => {
          c.set("r:fuel");
          c.set("r:viggo-fuel");
          c.set("r:risk-talk");
          c.add("fuel", 2);
          c.add("funds", -4);
          c.learn("viggo", "saw");
          c.say("Viggo sells you two drums at twice what they are worth and asks, with a grin, whether you have taken up night fishing. You say the herring are running late this year. 'Everything is running this year,' says Viggo.");
          c.pass(60);
          c.go("r-prepare");
        },
      },
      {
        id: "own",
        label: "Use what you have and fish less for a while",
        hint: "No one else involved. The family will feel it.",
        act: (c) => {
          c.set("r:fuel");
          c.add("fuel", 1);
          c.add("funds", -1);
          c.say("Inger moves some figures from one column to another and says the family can manage on porridge until Christmas if it comes to that. It may.");
          c.pass(30);
          c.go("r-prepare");
        },
      },
    ],
  },
];
