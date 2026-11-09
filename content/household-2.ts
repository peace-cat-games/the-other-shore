/**
 * The Jewish household, chapters 4 to 6: the passage, the coast, the
 * crossing and the other shore.
 *
 * Fictional simulation parameters (documented here, never shown as odds):
 *  - risk counts the clear warnings the player chose to ignore (h:risk-*).
 *    Only in standard mode, and only with two or more, can the household be
 *    arrested, and only on land, at the beach: 20% with two, 45% with
 *    three, 70% with four. (German police caught no refugee boat at sea in
 *    October 1943; arrests came on land, often through informers. See
 *    docs/history/corridor.md, section 6.)
 *  - weather turns a boat back for a night 20% of the time, in any mode.
 */
import type { Ctx, Read, Scene } from "../engine/types.ts";
import { FAMILY, moveParty, party } from "./household-1.ts";
import { kroner, list } from "./kit.ts";

const RISKS = ["h:risk-harbor", "h:risk-early", "h:risk-bags", "h:risk-noise"];
export const risk = (r: Read) => RISKS.filter((f) => r.has(f)).length;
const tern = (r: Read) => r.has("h:boat-tern");
const apart = (r: Read, p: string) => r.truth(p).place !== r.truth("hanna").place;
const people = (r: Read) => party(r).length;

/**
 * Prices, in hundreds of kroner. Fictional, inside the documented range: an
 * average of about 1,000 kroner a person that October, more at first, some
 * crossings free, and cost-only groups where the better-off paid for others.
 * The skipper of the Ternen works like such a group: 500 a person from those
 * who can. Viggo profiteers: 1,500 a person.
 */
const levins = (r: Read) => party(r).filter((p) => !["klara", "moritz"].includes(p)).length;
const share = (r: Read) => 5 * levins(r);
const FELDS_SHARE = 10;
const viggo = (r: Read) => 15 * people(r);

function toCoast(c: Ctx): void {
  c.go(apart(c, "sara") || apart(c, "peter") ? "h-dilemma" : "h-coast");
}

export const SCENES_2: Scene[] = [
  {
    id: "h-passage",
    role: "household",
    chapter: "In hiding",
    place: "flat",
    title: "Finding a boat",
    body: (r) => [
      `There are ${people(r)} of you now${r.has("h:felds") ? ", counting the Felds" : ""}, and a crossing has to be found for all of you: someone who knows a boat, someone who knows the someone, a night, a beach, a price.`,
      r.has("h:radio") ? "Since Saturday's broadcast everyone knows that Sweden will take you. The hard part is getting to the water: the Gestapo are watching the harbors, and they have informers." : "Everyone is talking about Sweden, just across the water. The hard part is getting to the water: the Gestapo are watching the harbors, and they have informers.",
      "Everyone knows a fisherman. Not every fisherman can be trusted to keep quiet, or to charge what is fair.",
    ],
    options: [
      {
        id: "brandt",
        label: "Through the doctor in Helsingør whom Ole's aunt's neighbor knows",
        show: (r) => r.has("h:at-summer"),
        hint: "Slow and careful. She works with a small group of local people and boats.",
        act: (c) => {
          c.set("h:via-brandt");
          c.set("h:boat-tern");
          c.learn("else", "saw");
          c.say("Dr Brandt comes to the summer house on her bicycle with her black bag, examines Benny's throat for the look of it, and talks about boats. A fisherman from Snekkersten, Anders Krogh, a careful man with a sound engine. Tuesday night, if the weather holds.");
          c.pass(24 * 60);
          c.go("h-money");
        },
      },
      {
        id: "students",
        label: "Through Ole's students",
        show: (r) => r.has("h:ole") && !r.has("h:at-summer"),
        hint: "They are organized and they move a great many people. You will wait your turn.",
        act: (c) => {
          c.set("h:via-students");
          c.set("h:boat-tern");
          c.say("A student with a bicycle and a very serious face takes your names on a cigarette paper. On Tuesday a taxi will take you north to Snekkersten, where a doctor's people will put you on a fishing boat, the Ternen.");
          c.pass(30 * 60);
          c.go("h-money");
        },
      },
      {
        id: "hospital",
        label: "Through the hospital staff",
        show: (r) => r.has("h:at-hospital"),
        hint: "Their ambulances drive north with patients who are not patients.",
        act: (c) => {
          c.set("h:via-hospital");
          c.set("h:boat-tern");
          c.say("The nurse with the admission cards comes back with a plan: an ambulance north on Tuesday afternoon to a doctor in Helsingør, and from there a fishing boat called the Ternen.");
          c.pass(30 * 60);
          c.go("h-money");
        },
      },
      {
        id: "church",
        label: "Ask Mrs Bech to ask the people she trusts at her church",
        show: (r) => r.has("h:at-bech"),
        hint: "The pastor is said to know a doctor on the coast.",
        act: (c) => {
          c.set("h:via-church");
          c.set("h:boat-tern");
          c.say("Mrs Bech goes to evensong with a shopping basket and comes back with a name and a date. A doctor in Helsingør, a fishing boat called the Ternen, Tuesday night. 'The pastor,' she says, 'did not even blink.'");
          c.pass(30 * 60);
          c.go("h-money");
        },
      },
      {
        id: "harbor",
        label: "Go to the harbor at Helsingør yourselves and find a fisherman",
        hint: "Faster, and more expensive. Asking openly on a harbor is noticed.",
        act: (c) => {
          c.set("h:via-harbor");
          c.set("h:boat-viggo");
          c.set("h:risk-harbor");
          c.learn("viggo", "saw");
          c.say("David spends Sunday on the harbor in Helsingør, trying to look like a man interested in herring. By evening a fisherman called Viggo Hansen has found him, and named a price that makes David sit down on a bollard.");
          c.pass(24 * 60);
          c.go("h-money");
        },
      },
    ],
  },
  {
    id: "h-money",
    role: "household",
    chapter: "In hiding",
    place: "flat",
    title: "The price",
    body: (r) =>
      tern(r)
        ? [
            `The skipper of the Ternen asks for his fuel and the risk to his boat, and no more. The doctor's people ask those who can pay to pay five hundred kroner a person, and more if they can, so that those who cannot may cross too. Your family's share is ${kroner(share(r))}${r.has("h:felds") ? `; the Felds' would be ${kroner(FELDS_SHARE)}, which is more than they have` : ""}.`,
            `You have ${kroner(r.v("funds"))}. On other beaches, people say, fishermen are asking a thousand a person or more. Here nobody will be left behind for want of money, the doctor says, but every krone you can give puts someone else on a boat.`,
          ]
        : [`Viggo Hansen wants ${kroner(viggo(r))}, fifteen hundred a head, cash, before anyone sets foot on his boat on Monday night. He has a bigger boat than most and he knows it.`, `You have ${kroner(r.v("funds"))}. Other fishermen on the coast, people say, take far less, and a few take nothing at all.`],
    options: [
      {
        id: "share",
        label: "Pay your family's share",
        show: (r) => tern(r),
        needs: (r) => (r.v("funds") >= share(r) ? null : `You have only ${kroner(r.v("funds"))}.`),
        act: (c) => {
          c.set("h:paid");
          c.add("funds", -share(c));
          c.say("You count the notes into the doctor's envelope. It is the strangest bill you have ever paid, and the most worth it.");
          toCoast(c);
        },
      },
      {
        id: "felds",
        label: "Pay your share and the Felds' too",
        show: (r) => tern(r) && r.has("h:felds"),
        needs: (r) => (r.v("funds") >= share(r) + FELDS_SHARE ? null : `That would take ${kroner(share(r) + FELDS_SHARE)}; you have ${kroner(r.v("funds"))}.`),
        hint: "Moritz will protest. Klara will not let him.",
        act: (c) => {
          c.set("h:paid");
          c.set("h:paid-felds");
          c.add("funds", -(share(c) + FELDS_SHARE));
          c.say("Moritz protests in two languages. Klara puts her hand on his arm and says thank you in Danish, carefully, as if the word were made of glass.");
          toCoast(c);
        },
      },
      {
        id: "fund",
        label: "Give what you have and let the fund cover the rest",
        show: (r) => tern(r),
        hint: (r) => (r.v("funds") >= share(r) ? "You could pay in full. The fund is for those who can't." : "There is no shame in it. That is what the fund is for."),
        act: (c) => {
          c.set("h:helped");
          c.add("funds", -c.v("funds"));
          c.say("The doctor writes nothing down. 'Someone paid for you,' she says, 'and one day you will pay for someone. That is the whole system.'");
          toCoast(c);
        },
      },
      {
        id: "give",
        label: "Pay your share and put everything else into the fund for others",
        show: (r) => tern(r) && r.v("funds") > share(r),
        hint: "You would land in Sweden with nothing in your pockets.",
        act: (c) => {
          c.set("h:paid");
          c.set("h:gave");
          c.add("funds", -c.v("funds"));
          c.say("The doctor looks at the envelope, then at you, and says that this will put a whole family on a boat next week. You do not ask which family. It is better not to know.");
          toCoast(c);
        },
      },
      {
        id: "viggo-pay",
        label: (r) => (r.v("funds") >= viggo(r) ? "Pay Viggo what he asks" : "Offer Viggo everything you have"),
        show: (r) => !tern(r),
        needs: (r) => (r.v("funds") >= 20 ? null : `You have only ${kroner(r.v("funds"))}; he won't sail for that.`),
        hint: "It would be nearly everything you own.",
        act: (c) => {
          c.set("h:paid");
          const all = c.v("funds") < viggo(c);
          c.add("funds", -(all ? c.v("funds") : viggo(c)));
          c.say(all ? "Viggo counts your money twice, in the open, on the harbor, and says it will have to do, since he is a soft-hearted man. Monday, eleven o'clock, the beach north of the town. Bring nothing that rattles." : "Viggo counts it twice, in the open, on the harbor, and says Monday, eleven o'clock, the beach north of the town. Bring nothing that rattles.");
          toCoast(c);
        },
      },
      {
        id: "viggo-no",
        label: "Walk away and find another way through a doctor or a pastor",
        show: (r) => !tern(r),
        hint: "A day lost, but people say there are better ways than Viggo.",
        act: (c) => {
          c.unset("h:boat-viggo");
          c.set("h:boat-tern");
          c.set("h:via-brandt");
          c.learn("else", "saw");
          c.say("A woman selling eel on the harbor, who has watched David all afternoon, tells him quietly to go to the doctor's house on the hill and say the eel woman sent him. Dr Brandt finds you a place on the Ternen, Tuesday night, at a price that does not make anyone sit down.");
          c.pass(20 * 60);
          c.go("h-money");
        },
      },
    ],
  },
  {
    id: "h-dilemma",
    role: "household",
    chapter: "In hiding",
    place: "flat",
    title: "Tonight's boat",
    body: (r) => {
      const who = apart(r, "sara") ? "Grandmother Sara" : "Peter";
      const k = r.knows(apart(r, "sara") ? "sara" : "peter");
      const known = k?.place && k.condition !== "unknown" ? `The last you heard, ${apart(r, "sara") ? "she" : "he"} was ${k.condition === "hidden" ? "hidden" : "staying"} at ${r.place(k.place).name}.` : `You do not know where ${apart(r, "sara") ? "she" : "he"} is.`;
      return [
        `The place on the boat is for tonight. ${who} is not with you. ${known}`,
        "Places do not wait. Neither do the people who hold them for you. But there will be other boats; the coast is full of them now, and of people who want to help.",
        `${list(FAMILY.map((p) => r.person(p).short))} look at you. Everyone has an opinion, and none of them is wrong.`,
      ];
    },
    options: [
      {
        id: "ask",
        label: (r) => (apart(r, "sara") ? "Find out how she is getting across before you go" : "Telephone the farm and find out where Peter has gone"),
        hint: "A few hours of telephone calls and messengers. You would still make the boat.",
        act: (c) => {
          c.set("h:informed");
          c.pass(4 * 60);
          if (apart(c, "sara")) {
            c.learn("sara", "message");
            c.say("Word comes back by way of the pastor: Mrs Holst's people have a place for Sara on a boat on Thursday, and Mrs Holst is going with her as far as the beach. 'She has asked whether there will be a chair,' the message says.");
            c.log("Sara crosses on Thursday with Mrs Holst's people.");
          }
          if (apart(c, "peter")) {
            c.hear("peter", "zealand", "travelling", "telephone");
            c.say("The farmer's wife says Peter left on Friday with two other boys from the farm training groups, heading north to the coast. He left a note for you, which she reads out: he will find you in Sweden.");
            c.log("Peter left the farm for the coast with two friends.");
          }
          c.go("h-coast");
        },
      },
      {
        id: "plan",
        label: "Go tonight, and leave word of where to find you in Sweden",
        hint: "A reunion plan: a place to ask and names to give.",
        act: (c) => {
          c.set("h:reunion-plan");
          c.say("You write it out twice and send it by two different hands: we will register with the police and the Red Cross in Helsingborg as LEVIN, with a V. Ask for us there. If we have moved on, they will know where.");
          c.go("h-coast");
        },
      },
      {
        id: "wait",
        label: (r) => (apart(r, "sara") ? "Give up tonight's places and cross later with her" : "Wait one more day for Peter"),
        hint: "Two more nights of waiting, and the children are tired. Places can be found again.",
        act: (c) => {
          c.set("h:waited");
          c.add("tired", 2);
          c.pass(48 * 60);
          if (apart(c, "sara")) {
            c.move("sara", c.truth("hanna").place, "hidden");
            c.learn("sara", "saw");
            c.say("Thursday afternoon Sara arrives with Mrs Holst, two bags and a folding stool, and announces that she is ready to cross any sea that has a chair on it. The doctor's people find you all places for the same night.");
          } else {
            c.say("Peter does not come. On the second evening the farmer's wife sends word that he left with friends for the coast days ago. You have lost two nights and gained a little certainty.");
            c.hear("peter", "zealand", "travelling", "message");
          }
          c.go("h-coast");
        },
      },
      {
        id: "split",
        label: "David goes to fetch his mother; the rest of you go tonight",
        show: (r) => apart(r, "sara"),
        hint: "Two crossings instead of one, and a day not knowing.",
        act: (c) => {
          c.set("h:david-split");
          c.move("david", "parsonage", "hidden");
          c.learn("david", "saw");
          c.say("David holds Benny a long moment and gives you the address of the parsonage written inside a matchbox. 'Helsingborg,' he says. 'Levin, with a V.' Then he is gone up the road on a borrowed bicycle.");
          c.log("David went back for his mother. We are to meet in Helsingborg.");
          c.go("h-coast");
        },
      },
    ],
  },
  {
    id: "h-coast",
    role: "household",
    chapter: "The coast",
    place: "waiting",
    title: "Waiting above the beach",
    body: (r) => [
      tern(r)
        ? "The house above the beach at Snekkersten belongs to people you will never see again: a retired couple who leave the back door open, coffee on the stove and the curtains drawn. Other families are already waiting in the sitting room, very quietly."
        : "Viggo's beach is north of Helsingør, a strip of shingle under a bank of wet grass. You wait in a fisherman's shed with a dozen strangers and the smell of tar.",
      tern(r) ? "At dusk Dr Brandt looks in. A friend in the Helsingør police has sent word: Gestapo cars have been driving the coast road this evening, stopping at the beaches. The skipper wants to wait until after eleven, and for the courier's signal." : "Someone says the Gestapo from Helsingør have been along the coast road this evening. Viggo, when he comes, says he has never seen any Gestapo, and that anyone who wants to wait can wait without him.",
      `${r.v("luggage") >= 3 ? "Your bags are piled by the door, more of them than anyone else's." : "Your bags are by the door."} Across the water, very faint, there are lights on the Swedish shore.`,
    ],
    options: [
      {
        id: "wait",
        label: (r) => (tern(r) ? "Wait, as the skipper asks, and let the children sleep" : "Wait quietly and do exactly as you are told"),
        hint: "The skipper knows this water.",
        act: (c) => {
          c.add("tired", -1);
          c.say("You doze sitting up, Benny's head in your lap. Ruth counts the lights across the water and gets a different number every time.");
          c.pass(5 * 60);
          moveParty(c, "beach", "travelling");
          c.go("h-board");
        },
      },
      {
        id: "leave-bags",
        label: "Leave some of the bags with the people of the house",
        show: (r) => r.v("luggage") >= 2 && !r.has("h:left-bags"),
        hint: "Lighter on the beach. What stays behind may not be seen again.",
        act: (c) => {
          c.set("h:left-bags");
          c.add("luggage", -(c.v("luggage") - 1));
          if (c.has("h:candlesticks")) c.set("h:candles-left");
          c.say("You keep one bag: the warm things, the food, the papers. The rest goes into a cupboard under the stairs with a label in pencil, LEVIN, as if you might come back for it next week.");
          c.pass(20);
          c.go("h-coast");
        },
      },
      {
        id: "early",
        label: "Go down to the beach early, before the children tire",
        hint: "The skipper has asked everyone to wait for the signal.",
        act: (c) => {
          c.set("h:risk-early");
          c.say("Nobody likes it, but the children are tired. You go down through the dark garden to wait on the beach itself, where at least you will be first, and where anyone on the coast road could see you.");
          c.pass(2 * 60);
          moveParty(c, "beach", "travelling");
          c.go("h-board");
        },
      },
    ],
  },
  {
    id: "h-board",
    role: "household",
    chapter: "The coast",
    place: "beach",
    title: "The beach at night",
    body: (r) => [
      "No moon. The shingle is loud under your shoes however softly you walk. At the water's edge a rowing boat waits to take people out to the boat, which is only a darker shape on the dark water.",
      tern(r) ? `'One bag each, no more,' the skipper's son whispers, a tall boy of seventeen with a coil of rope over his shoulder.${r.v("luggage") >= 3 ? " He looks at your pile of luggage and then at you." : ""}` : "Viggo's man counts heads and money, not bags.",
      "Benny is awake and frightened of the dark, and the dark is everywhere. Sound carries over water, and up the bank to the road.",
      tern(r) ? "Dr Brandt kneels by him with her bag. For small children, she says quietly, she has a few drops that will help him sleep through the crossing. Many parents have taken them. It is your choice." : "",
    ].filter(Boolean),
    options: [
      {
        id: "rabbit",
        label: "Ruth tells Benny the lighthouse story, with the rabbit",
        needs: (r) => (r.has("h:rabbit") ? null : "The rabbit is at home on his bed."),
        hint: "It has worked before, at home, in the light.",
        act: (c) => {
          c.set("h:story");
          c.say("Ruth whispers the story of the keepers who climbed the stairs every night so the ships would know where they were. Benny holds the one-eared rabbit up against the dark like a lantern, and is asleep before the rowing boat touches the hull.");
          board(c);
        },
      },
      {
        id: "drops",
        label: "Accept the doctor's drops for Benny",
        show: (r) => tern(r),
        hint: "He will sleep. He will be groggy in the morning.",
        act: (c) => {
          c.set("h:drops");
          c.say("Dr Brandt measures the drops onto a lump of sugar. Benny takes it as if it were a treat and goes heavy in David's arms by the time you reach the water.");
          board(c);
        },
      },
      {
        id: "carry",
        label: "Carry him yourself and hum to him",
        hint: "He might sleep. He might not.",
        act: (c) => {
          if (!c.roll("benny-sleeps", 0.6)) c.set("h:risk-noise");
          c.say(c.has("h:risk-noise") ? "He cries once, a thin high sound that goes out over the water and does not come back. Then he buries his face in your coat." : "You hum the tune your mother hummed, so low it is almost only breath, and he goes quiet against your shoulder.");
          board(c);
        },
      },
      {
        id: "insist",
        label: "Insist on bringing all your bags",
        show: (r) => r.v("luggage") >= 3,
        hint: "The boy has asked you not to.",
        act: (c) => {
          c.set("h:risk-bags");
          c.say("The boy says nothing more, and makes two trips in the rowing boat instead of one, while everyone waits on the open beach.");
          board(c);
        },
      },
    ],
  },
  {
    id: "h-sea",
    role: "household",
    chapter: "The crossing",
    place: "sound",
    title: "Below deck",
    sea: true,
    body: (r) => [
      tern(r) ? "The hold of the Ternen smells of fish, diesel and wet wool. There are fourteen of you lying close together in the dark below deck, and the boat moves under you like something breathing." : "Viggo's hold is full: twenty-five people, maybe more, packed shoulder to shoulder in the dark. The boat rolls heavily.",
      "The engine settles into a low thud. Through a gap in the planking you can see a sliver of black water and, sometimes, a light.",
      tern(r) ? "Beside you a young woman is being quietly and thoroughly seasick. Her husband holds her hair. She says, between bouts, that she is Lis, and that the baby is not due until December, thank God." : "Somebody near you is praying in Yiddish, very softly. Somebody else is praying in Danish.",
    ],
    options: [
      {
        id: "children",
        label: "Hold the children close and keep them warm",
        hint: (r) => (r.v("supplies") >= 2 ? "You have blankets and dry socks." : "You have very little to keep them warm with."),
        act: (c) => {
          c.add("tired", c.v("supplies") >= 2 ? 0 : 1);
          c.say(c.v("supplies") >= 2 ? "Wool socks, the blanket, Ruth's head on your arm. Benny sleeps through all of it." : "There is only your coat. You put it over both children and feel the cold come straight through your blouse.");
          c.pass(20);
          c.go("h-sea-2");
        },
      },
      {
        id: "lis",
        label: "Help Lis: a damp cloth, a hand to hold, a little bread",
        show: (r) => tern(r),
        hint: "There isn't much you can do. There is something.",
        act: (c) => {
          c.set("h:helped-lis");
          c.learn("lis", "saw");
          c.learn("aron", "saw");
          c.say("You wet your handkerchief from your water bottle and hold it to her forehead. Her husband, Aron, a furrier with enormous careful hands, whispers that she is not Jewish and could have stayed, and would not. Lis says that is quite enough of her life story for one boat.");
          c.pass(20);
          c.go("h-sea-2");
        },
      },
      {
        id: "watch",
        label: "Watch through the gap in the planks",
        hint: "You would see what is coming before anyone told you.",
        act: (c) => {
          c.add("tired", 1);
          c.log("From the hold of the boat I watched the lights of Denmark go small.");
          c.say("Kronborg is a black shape against a blacker sky. Then it is behind you, and there is only the water and the faint lights of the other side, never seeming to come nearer.");
          c.pass(20);
          c.go("h-sea-2");
        },
      },
    ],
  },
  {
    id: "h-sea-2",
    role: "household",
    chapter: "The crossing",
    place: "sound",
    title: "The engine stops",
    sea: true,
    body: (r) => [
      "The engine stops. In the sudden quiet you can hear the water slapping the hull and someone's heart, possibly your own.",
      tern(r) ? "The skipper's voice comes down through the hatch, very low and very calm: a light to the north. Everyone keep absolutely still. Not a word." : "Viggo swears, once. Somebody says there is a light to the north.",
      "Everyone has heard the stories about German patrol boats and searchlights. Nobody knows which of them are true.",
      "Benny stirs in his sleep.",
    ],
    options: [
      {
        id: "still",
        label: "Keep absolutely still, your hand on Benny's back",
        hint: "The skipper has asked for silence.",
        act: (c) => crossing(c),
      },
      {
        id: "ruth",
        label: "Whisper to Ruth to hold Benny if he wakes",
        hint: "A whisper is not silence, but she would know what to do.",
        act: (c) => {
          c.set("h:ruth-held");
          c.say("Ruth nods against your shoulder and takes Benny's hand. She does not make a sound. Neither does he.");
          crossing(c);
        },
      },
      {
        id: "ask",
        label: "Call up to ask what is happening",
        hint: "Not knowing is very hard.",
        act: (c) => {
          c.add("tired", 1);
          c.say("Your own voice sounds enormous. Someone's hand closes on your arm in the dark, firm and not unkind, and the skipper's son leans down through the hatch to whisper that it is nothing, probably nothing, and please.");
          crossing(c);
        },
      },
    ],
  },
];

function board(c: Ctx): void {
  if (!c.has("h:risk-bags") && c.v("luggage") >= 3) {
    c.add("luggage", -(c.v("luggage") - 2));
    c.set("h:lost-bags");
    if (c.has("h:candlesticks") && !c.has("h:candles-left")) c.set("h:candles-beach");
    c.say("The extra bags stay on the beach above the tide line. The boy promises they will be looked after. You do not believe him and do not blame him.");
  }
  const r = risk(c);
  const taken = c.mode === "standard" && r >= 2 && c.roll("taken", r >= 4 ? 0.7 : r === 3 ? 0.45 : 0.2);
  if (taken) {
    c.say("Headlights swing down the coast road and stop above the beach. Torches come down the bank. Someone has telephoned someone. The men are German police, with a Danish civilian who will not look at anyone. Nobody runs: there are children on the beach.");
    c.pass(6 * 60);
    moveParty(c, "horserod", "held");
    c.log("We were arrested on the beach before we could board, and taken to the camp at Horserød.");
    c.end("h-held");
    return;
  }
  c.pass(40);
  moveParty(c, "sound", "at-sea");
  c.go("h-sea");
}

/** The middle of the Sound: fear, sometimes a turned-back night, and then Swedish water. */
function crossing(c: Ctx): void {
  if (c.roll("weather", 0.2)) {
    c.set("h:turned-back");
    c.add("tired", 2);
    c.say("The light passes. But the wind has been rising, and the skipper decides the Sound is too rough for a boat this full. He turns back. You spend another day hidden above the beach, sick with disappointment, and cross the following night on a calmer sea.");
    c.pass(24 * 60);
  } else {
    c.say("The light moves away to the north, slowly, then all at once. Nobody will ever know whose it was. After a very long minute the engine coughs and catches.");
  }
  c.pass(50);
  c.say("Then the skipper's voice, louder than it has been all night: 'Swedish water. You can talk now.' Someone laughs. Someone starts to cry. Somebody begins to pray aloud, and others join in, in Hebrew and in Danish. The lights of Helsingborg come up out of the dark, and they do not move away.");
  moveParty(c, "helsingborg", "safe");
  c.go("h-shore");
}
