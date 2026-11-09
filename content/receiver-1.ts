/**
 * The Swedish receiver, chapters 1 and 2: an ordinary Friday in
 * Helsingborg, the radio, getting ready, the first boats and Ramlösa.
 * Märta Lindqvist is the protagonist. Also the helpers the later chapters
 * share.
 *
 * Fictional simulation parameters (shown on screen only as counts in words):
 *  - Beds. The building Märta runs sleeps 24 (her school's gymnasium and two
 *    classrooms; 18 once the classrooms go back to lessons on Friday 8
 *    October), 14 (the church hall) or 8 (a room on the quay). Mrs Nyström's
 *    flat adds 4 and the parents' spare rooms 6. People Märta keeps back hold
 *    beds; everyone else moves on to Ramlösa or inland the day after landing,
 *    so each morning the free beds are the capacity less those kept back.
 *  - Arrivals at Märta's quay: 20 on the night of 3-4 October, 24 on 5-6
 *    October, 30 on 8-9 October; about a third more in standard mode. Those
 *    without a bed sleep on chairs (the volunteers tire) or, once agreed, go
 *    out to Ramlösa.
 *  - A boatload needs two or three bundles of dry clothes.
 *  - A night on duty tires the volunteers by 2; hot food for the night shift
 *    and a rota each make it 1 lighter.
 */
import { at } from "../engine/calendar.ts";
import type { Ctx, PersonId, Read, Scene } from "../engine/types.ts";

export const LEVINS: PersonId[] = ["hanna", "david", "ruth", "benny"];
export const FELDS: PersonId[] = ["klara", "moritz"];
export const MELBYS: PersonId[] = ["lis", "aron"];

export function until(c: Ctx, t: number): void {
  if (c.time < t) c.pass(t - c.time);
}

export function goTo(c: Ctx, place: string): void {
  c.move("marta", place, "home");
}

/** Where Märta's reception is. */
export function base(r: Read): string {
  if (r.has("s:school")) return "reception";
  if (r.has("s:hall")) return "hall";
  if (r.has("s:desk")) return "helsingborg";
  return "school-se";
}

export function room(r: Read): string {
  if (r.has("s:school")) return "the gymnasium";
  if (r.has("s:hall")) return "the church hall";
  return "your room on the quay";
}

export function chairs(r: Read): string {
  if (r.has("s:school")) return "on chairs and coats between the mats";
  if (r.has("s:hall")) return "on the hall's chairs and under the stage";
  return "on the benches and the stairs";
}

function building(r: Read): number {
  if (r.has("s:school")) return r.has("s:classrooms-back") ? 18 : 24;
  if (r.has("s:hall")) return 14;
  if (r.has("s:desk")) return 8;
  return 0;
}

function elsaRooms(r: Read): number {
  if (!r.has("s:elsa-rooms")) return 0;
  return Math.max(0, 4 - (r.has("s:lis-elsa") ? 2 : 0) - (r.has("s:levins-elsa") ? 4 : 0));
}

export function capacity(r: Read): number {
  return building(r) + elsaRooms(r) + (r.has("s:homes") ? 6 : 0);
}

/** People Märta is keeping back, who hold beds from one night to the next. */
export function staying(r: Read): number {
  const levins = r.has("s:levins-here") ? 4 + (r.has("s:sara-here") ? 1 : 0) : 0;
  return levins + (r.has("s:sara-monday") ? 1 : 0) + (r.has("s:felds-here") ? 2 : 0) + (r.has("s:lis-here") ? 2 : 0);
}

/** Morning: last night's arrivals have moved on; tonight's free beds are what is left. */
export function refresh(c: Ctx): void {
  const free = Math.max(0, capacity(c) - staying(c));
  c.add("beds", free - c.v("beds"));
}

/** A night's arrivals take beds; the rest sleep on chairs or go out to Ramlösa. */
export function night(c: Ctx, key: string, story: number, standard: number): void {
  const n = c.mode === "standard" ? standard : story;
  const free = c.v("beds");
  const over = Math.max(0, n - free);
  c.add("beds", -Math.min(n, free));
  if (over === 0) {
    c.say(`${n} people that night, and a bed for every one of them.`);
  } else if (c.has("s:ramlosa")) {
    c.set(`s:ramlosa-${key}`);
    c.say(`${n} people that night, and beds for ${free}. You telephone Ramlösa as agreed, and the Lottas' lorry comes for the other ${over}.`);
  } else {
    c.set(`s:chairs-${key}`);
    c.add("tired", 1);
    const elsewhere = key === "first" ? "the seamen's hostel on the harbor, which finds mattresses for them in its corridors" : "Ramlösa, on foot in the dark behind a Lotta with a torch";
    c.say(
      over <= 12
        ? `${n} people that night, and beds for ${free}. The other ${over} spend what is left of it ${chairs(c)}, and the volunteers spend it fetching blankets.`
        : `${n} people that night, and beds for ${free}. A dozen of the rest spend what is left of it ${chairs(c)}; the others go to ${elsewhere}. The volunteers spend the night fetching blankets and saying sorry.`,
    );
  }
}

/** Dry clothes for a landing; without enough, people sit wet and the volunteers scramble. */
export function dry(c: Ctx, key: string, n: number): void {
  if (c.v("clothes") >= n) {
    c.add("clothes", -n);
    return;
  }
  c.add("clothes", -c.v("clothes"));
  c.set(`s:wet-${key}`);
  c.add("tired", 1);
  c.say("There are not enough dry things to go round. Some of them sit in wet clothes until morning, wrapped in whatever the volunteers can take off their own backs.");
}

export const fed = (r: Read) => r.has("s:soup") || r.has("s:hall");

/** A night on duty. Hot food for the night shift and a rota both make it lighter. */
export function shift(c: Ctx, hard: number): void {
  const easier = (fed(c) ? 1 : 0) + (c.has("s:rota") ? 1 : 0);
  c.add("tired", Math.max(0, hard - easier));
}

const hourOf = (t: number) => Math.floor((t % 1440) / 60);

/** Monday and Tuesday: lessons in the morning, errands from one o'clock until nine at night. */
function errand(c: Ctx, hours: number): void {
  c.pass(hours * 60);
  const day = c.time - (c.time % 1440);
  if (hourOf(c.time) >= 21) c.pass(day + 1440 + 13 * 60 - c.time);
  else if (hourOf(c.time) < 13) c.pass(day + 13 * 60 - c.time);
}

const SUNDAY_END = at("1943-10-03", 16);
const sunday = (r: Read) => r.time < SUNDAY_END;
const TUESDAY_END = at("1943-10-05", 17);
const errands = (r: Read) => r.time < TUESDAY_END;

function toSaturday(c: Ctx): void {
  until(c, at("1943-10-02", 18, 30));
  goTo(c, "lindqvist");
  c.go("s-saturday");
}

function building0(c: Ctx, flag: string, text: string): void {
  c.set(flag);
  refresh(c);
  c.say(text);
  c.log(`The reception is to be ${room(c)}.`);
  until(c, at("1943-10-03", 9));
  goTo(c, base(c));
  c.go("s-sunday");
}

function folke(c: Ctx, hours: number, next: (c: Ctx, h: number) => void): void {
  c.set("s:folke");
  c.add("bus", 1);
  c.learn("folke", "saw");
  c.say("Folke Berg is under a bus when you arrive, and stays there while you talk. When he slides out on his trolley he has decided: one bus and one driver, at night, whenever you telephone. 'Who pays,' he says, wiping his hands, 'we can argue about in November.'");
  c.log("Folke Berg will lend a bus and a driver at night.");
  next(c, hours);
}

export const SCENES_1: Scene[] = [
  {
    id: "s-friday",
    role: "receiver",
    chapter: "Ordinary days",
    place: "school-se",
    title: "Friday, the first of October",
    body: () => [
      "The last lesson on a Friday is geography. The map of Skåne has hung beside the blackboard so long that the Sound has faded paler than the sea, and thirty-one children in wool stockings chant the harbors down the coast: Höganäs, Helsingborg, Råå, Landskrona. Gösta in the back row adds 'Denmark', because it is right there, and gets his laugh.",
      "Denmark has been right there all autumn. Since the end of August, Danish soldiers and policemen have been coming over in twos and threes. This morning, over breakfast, Nils said it was families now: the harbor office had a night of small boats, here and down at Landskrona, full of people in town clothes, wet to the knees. Jews, people are saying, and they say it quietly.",
      "Your Red Cross circle has been knitting socks since the mayor and the police put their appeal for money for refugees in Helsingborgs Dagblad a month ago. In your bag are the class register, your ration cards and thirty-one compositions on 'My Autumn', unmarked.",
    ],
    options: [
      {
        id: "coats",
        label: "Ask the class to bring outgrown coats and jumpers on Monday, for the Red Cross",
        hint: "Children are very good at emptying wardrobes. Their parents will want to know what for, which is no bad thing.",
        act: (c) => {
          c.set("s:parents");
          c.say("A forest of hands. Gösta asks whether a coat with one sleeve counts. Britt says her mother has three of her father's, and her father does not know yet. You write a note for every child to take home, and sign thirty-one of them.");
          c.log("Asked the class for coats and jumpers for the Red Cross.");
          c.pass(40);
          toSaturday(c);
        },
      },
      {
        id: "elsa",
        label: "Walk home by way of Mrs Nyström's, near the station, and ask about her empty rooms",
        hint: "She has a large flat, three empty rooms and opinions about everything, soup first.",
        act: (c) => {
          c.set("s:elsa");
          c.set("s:elsa-rooms");
          goTo(c, "nystrom");
          c.learn("elsa", "saw");
          c.say("Mrs Nyström hears you out in her hallway, among the umbrellas. 'Refugees,' she says. 'Then they will want soup. Proper soup, Märta, with a bone in it, not the grey water the Lotta corps boil.' She will have two rooms aired by Sunday, four beds in all, and she will be making soup whether anyone asks her or not.");
          c.log("Mrs Nyström will have four beds aired by Sunday.");
          c.pass(90);
          toSaturday(c);
        },
      },
      {
        id: "harbor",
        label: "Go down to the harbor and meet Nils off his shift",
        hint: "You would see for yourself what is arriving, and who is writing it down.",
        act: (c) => {
          c.set("s:harbor");
          c.add("lists", 1);
          goTo(c, "helsingborg");
          c.learn("ivar", "saw");
          c.say("Nils walks you along the quay in the last of the light. By the police hut a young constable is copying names from scraps of paper into a ledger, with his tongue between his teeth. Persson, he says, Ivar Persson; and are you the teacher? Then perhaps you can tell him whether Danes really spell Jacobsen with a c. You can. He asks whether you would come and help some evening. Walking home, Nils says you have just been recruited, and is not altogether pleased about it.");
          c.log("Met Constable Persson at the harbor. He wants help with the names.");
          c.pass(120);
          toSaturday(c);
        },
      },
      {
        id: "mark",
        label: "Go home, mark the compositions and keep the weekend for yourself",
        hint: "You are tired already, and it is only October.",
        act: (c) => {
          c.set("s:rested");
          c.add("tired", -1);
          goTo(c, "lindqvist");
          c.say("Most of the compositions are about apples. One is about a Danish boy's uncle, who came across in a rowing boat in September and ate four herrings at one sitting. You give it a star, go to bed at nine and sleep like a stone.");
          c.pass(180);
          toSaturday(c);
        },
      },
    ],
  },
  {
    id: "s-saturday",
    role: "receiver",
    chapter: "Ordinary days",
    place: "lindqvist",
    title: "The radio",
    body: () => [
      "Saturday evening in the kitchen: potatoes, a little pork, and Nils doing the crossword in the margin of the newspaper with a pencil he sharpens with his penknife. The radio is on for the news, because it is always on for the news.",
      "Then comes a statement from the government, read slowly, as if every word were meant to be written down. The Swedish minister in Berlin has told the Germans what their measures against the Jews of Denmark will mean in Sweden, and has offered, on behalf of the Swedish government, to receive all the Jews of Denmark. Nils puts the pencil down. Across four kilometers of dark water, the lights of Helsingør look exactly as they always do.",
      "The telephone rings before the weather forecast. It is Mrs Wallin of the Red Cross circle, who never telephones after seven. The police cannot keep everyone who lands in a waiting room, the Lotta corps are getting the old spa at Ramlösa ready for Monday, and the circle needs a building near the harbor by tomorrow night, with beds in it. 'You are a teacher,' she says, as if that settled it.",
    ],
    options: [
      {
        id: "school",
        label: "Ask the headmaster for your school: the gymnasium and two classrooms",
        hint: "Room for a boatload, ten minutes from the quay. Your class would have to squeeze into the library.",
        act: (c) =>
          building0(c, "s:school", "Mr Ahlgren comes to the door in his slippers and hears you out with his reading glasses pushed up on his forehead. 'The wall bars stay,' he says at last. 'The children will want them back.' Then he goes to find the keys. Twenty-four beds, if you count the camp beds in the classrooms."),
      },
      {
        id: "hall",
        label: "Ask the verger for the church hall on the harbor",
        hint: "Right by the quay, with a kitchen that can feed the night shift. Smaller: beds for a dozen or so.",
        act: (c) =>
          building0(c, "s:hall", "The verger keeps the key on a string round his neck and the kitchen in excellent order. The hall will take fourteen on mattresses, he says, and the urn holds forty cups, and the volunteers will not go hungry while he has anything to say about it."),
      },
      {
        id: "desk",
        label: "Leave the building to the committee, and offer yourself to the police to write the names",
        hint: "Someone has to write the names down properly. The room would be whatever the committee finds, and small.",
        act: (c) => {
          c.add("lists", 2);
          c.learn("ivar", "telephone");
          building0(c, "s:desk", "The committee finds a room above a shipping agent's office on the quay: a table, two benches and eight camp beds. Constable Persson, on the telephone, sounds very relieved that someone who can spell is coming, and says so twice.");
        },
      },
    ],
  },
  {
    id: "s-sunday",
    role: "receiver",
    chapter: "The first nights",
    place: "reception",
    title: "Sunday: getting ready",
    body: (r) => [
      r.has("s:school")
        ? "By nine on Sunday morning the gymnasium smells of floor polish and wet wool. The mats are down in rows under the wall bars, the vaulting horse is pushed into a corner with a tablecloth over it, and the two classrooms next door have camp beds where the desks were."
        : r.has("s:hall")
          ? "By nine on Sunday morning the church hall smells of coffee and radiators. Fourteen mattresses lie in two rows under the noticeboard, and the urn is already warming in the kitchen."
          : "By nine on Sunday morning your room above the shipping agent's smells of tar and new blankets: eight camp beds, two benches, a table under the window, and the whole harbor outside it.",
      "Everything else is still to do. There are dry clothes in two sacks from the Red Cross store, unsorted. Nobody has asked a doctor. There is no way of moving anyone at night, and no system for names beyond a school exercise book.",
      sunday(r) ? "The boats come at night. By this evening something has to be ready." : "It is evening. Whatever isn't ready will have to be done on the quay.",
    ],
    options: [
      {
        id: "doctor",
        label: "Telephone Dr Sjöberg and ask him to come at night when he is needed",
        show: (r) => sunday(r) && !r.has("s:doctor"),
        hint: "He is brisk with everyone, and kind under it.",
        act: (c) => {
          c.set("s:doctor");
          c.learn("gunnar", "telephone");
          c.say("Dr Sjöberg says he will come at any hour, provided nobody wakes him to ask whether he is coming. He gives you the hospital's night number as well, in case he is already somewhere else.");
          c.log("Dr Sjöberg will come at night when he is needed.");
          c.pass(60);
          c.go("s-sunday");
        },
      },
      {
        id: "cards",
        label: "Make a card for every name and a box to file them in, with room on each card for other spellings",
        show: (r) => sunday(r) && !r.has("s:cards"),
        hint: "Slow work now. Names will be spelled a dozen ways by people who are cold and frightened.",
        act: (c) => {
          c.set("s:cards");
          c.add("lists", 1);
          c.say("Nils brings a shoebox down from the wardrobe and a packet of index cards from the harbor office, which he says is not stealing if it is for the Red Cross. On every card you rule a line for the other ways a name might be written: Hansen, Hanssen; Jacobsen, Jakobsen; Meyer, Meier, Mejer.");
          c.pass(120);
          c.go("s-sunday");
        },
      },
      {
        id: "sort",
        label: "Sort the sacks into bundles: a full set of dry things for each family",
        show: (r) => sunday(r) && !r.has("s:sorted"),
        hint: "Two hours now saves twenty minutes on a cold quay, with a child shivering.",
        act: (c) => {
          c.set("s:sorted");
          c.add("clothes", 2);
          c.say("The two sacks turn out to hold four families' worth, once the socks are paired. There is a christening gown in one, and a dinner jacket, which you put aside for an emergency of a different kind.");
          c.pass(120);
          c.go("s-sunday");
        },
      },
      {
        id: "elsa",
        label: (r) => (r.has("s:elsa") ? "Go back to Mrs Nyström: you need her rooms, and her soup for the night shift" : "Go and ask Mrs Nyström, near the station, for her empty rooms and her soup"),
        show: (r) => sunday(r) && !r.has("s:soup"),
        hint: (r) => (r.has("s:elsa") ? "She said Sunday. She will have made soup already." : "Three empty rooms, and a stockpot the size of a bucket."),
        act: (c) => {
          const known = c.has("s:elsa");
          c.set("s:soup");
          c.set("s:elsa");
          c.set("s:elsa-rooms");
          c.learn("elsa", "saw");
          refresh(c);
          c.say(
            known
              ? "Mrs Nyström has the rooms aired and the soup made, and a list of the volunteers' names so that she can disapprove of each of them personally. She will bring a pot to the night shift every evening. 'Hot,' she says. 'People make mistakes when they are cold.'"
              : "Mrs Nyström hears you out in her hallway, among the umbrellas, and says that refugees will want soup, proper soup, with a bone in it, not the grey water the Lotta corps boil. Two rooms, four beds, and a pot for the night shift every evening. 'People make mistakes when they are cold,' she says.",
          );
          c.log("Mrs Nyström: four beds, and soup for the night shift.");
          c.pass(known ? 60 : 120);
          c.go("s-sunday");
        },
      },
      {
        id: "folke",
        label: "Walk round to Folke Berg's garage and ask about a bus for nights",
        show: (r) => sunday(r) && !r.has("s:folke"),
        hint: "His buses have their ordinary work all day. He might spare one at night.",
        act: (c) =>
          folke(c, 1.5, (x, h) => {
            x.pass(h * 60);
            x.go("s-sunday");
          }),
      },
      {
        id: "ready",
        label: (r) => (sunday(r) ? "Go home and sleep a few hours before the night" : "It is evening: go home and sleep before the night"),
        hint: (r) => (sunday(r) ? "Whatever isn't ready will have to be done on the quay." : undefined),
        act: (c) => {
          c.add("tired", -1);
          goTo(c, "lindqvist");
          c.say("You sleep for a few hours in your clothes, with the alarm clock on the chair. Nils wakes you before midnight with something hot and your Red Cross armband.");
          until(c, at("1943-10-04", 0, 45));
          goTo(c, "helsingborg");
          c.go("s-first-night");
        },
      },
    ],
  },
  {
    id: "s-first-night",
    role: "receiver",
    chapter: "The first nights",
    place: "helsingborg",
    title: "The first boats",
    body: (r) => [
      `A little after one on Monday morning a fishing boat with no lights comes in past the end of the pier, and the men on the quay take her lines without a word. Twelve people climb the iron ladder. The last of them, a man in a good coat, will not give his name to anyone until his boat has gone back out into the dark, and then gives it to ${r.knows("ivar") ? "Constable Persson" : "a young constable called Persson"} as if he were handing over a key.`,
      `Persson gives every adult a slip of paper, an emergency visa, and says the questions will come later. A Lotta in grey pours something hot from a jug. Your table is ${r.has("s:school") ? "a card table from the staff room" : r.has("s:hall") ? "the hall's best trestle" : "the one from your room, carried down the stairs"}, under a hooded lamp, and ${r.v("clothes") >= 4 ? "the dry clothes are in bundles at your feet" : "there are fewer dry clothes than there are people"}.`,
      "A second boat, at three, is smaller and wetter. At the end of its line is a girl of about four in a coat too big for her, holding the hand of a woman who is not her mother. Her mother, the woman says, went to another beach for another boat; there was no room for them all together. The girl says her name is Mus. Mouse. That is all she will say.",
    ],
    options: [
      {
        id: "card",
        label: "Write Mus a card with everything the woman knows: the street, the floor, the mother's name, the beach",
        hint: "Ten more minutes in the cold, for both of them. The card is how her mother will find her.",
        act: (c) => {
          c.set("s:mus-card");
          c.add("lists", 1);
          c.add("tired", 1);
          c.say("The woman knows more than she thought she did, once you ask. The mother is Esther. Nørrebro, third floor, the green door. A beach somewhere near Humlebæk, perhaps. You write it all down while the girl watches your pen. When you write MUS in capitals she says, very quietly, that it is not her real name. You agree that it will do for now.");
          c.log("Mus, about four, separated from her mother Esther, who crossed from near Humlebæk.");
          firstNight(c, 2);
        },
      },
      {
        id: "home",
        label: "Take Mus home to your own flat for what is left of the night",
        hint: "A bed, warm milk and Nils, instead of a mat among strangers. On the lists she would be only 'with Mrs Lindqvist'.",
        act: (c) => {
          c.set("s:mus-home");
          c.learn("nils", "saw");
          c.say("You carry her up the hill asleep. Nils, in his dressing gown, warms milk without being asked and finds a hot-water bottle you did not know you owned. She sleeps in the middle of your bed, and you and Nils sleep at its edges, and nobody sleeps very much.");
          c.log("Mus is asleep in our bed. Her mother crossed on another boat.");
          firstNight(c, 1);
        },
      },
      {
        id: "stay",
        label: "Leave her with the woman she knows, and get the boat's names down",
        hint: "She knows that woman, and there are more people waiting in the wind.",
        act: (c) => {
          c.set("s:mus-woman");
          c.say("The woman says of course she will keep her. Mus goes to sleep on her lap on a bench, with her boots on, while you write the rest of the boat's names and spell half of them twice.");
          firstNight(c, 2);
        },
      },
    ],
  },
  {
    id: "s-monday",
    role: "receiver",
    chapter: "The first nights",
    place: "ramlosa",
    title: "Ramlösa opens",
    body: (r) => [
      "On Monday the old spa at Ramlösa, where people came for years to drink the waters, opens its doors to refugees. The Red Cross and the Lotta corps have been at work there all weekend. After breakfast last night's arrivals walk out to it in a straggling line, carrying what they came with, which is not much.",
      `${r.has("s:school") ? "You teach in the mornings, in the library, on three hours' sleep; Gösta has discovered the atlas of the world and wants to know why Denmark is so small." : "You teach in the mornings, on three hours' sleep."} The afternoons and evenings are yours, until Tuesday night. ${r.has("s:mus-found") ? "" : r.has("s:mus-home") ? "Mus is at home at the kitchen table with Nils, who has taken the day off and is teaching her the crossword." : "Mus has gone out to Ramlösa with the woman who brought her."}`.trim(),
      errands(r) ? "Tuesday night will be busy, Nils says. Everybody at the harbor office says so." : "It is Tuesday evening. The boats will be coming.",
    ],
    options: [
      {
        id: "mus",
        label: (r) => (r.has("s:mus-card") ? "Telephone the police down the coast with Mus's card" : "Telephone the police down the coast about a girl called Mus"),
        show: (r) => errands(r) && !r.has("s:mus-found"),
        hint: (r) => (r.has("s:mus-card") ? "You have a street, a beach and a mother's name." : "You have a nickname, and a coat too big for her."),
        act: (c) => {
          const card = c.has("s:mus-card");
          c.set("s:mus-found");
          c.add("found", 1);
          if (card) c.say("The second call, to Landskrona, finds her. Esther, thirty, from Nørrebro, landed on Sunday night and has asked every policeman she has seen for her daughter. By evening she is at Ramlösa, kneeling on the floor of the old dining room with her arms full of a child in a coat too big for her.");
          else if (c.has("s:mus-home")) c.say("It takes the whole afternoon and most of the telephone exchange. At last a constable at Landskrona has a woman called Esther who is asking for a little girl. 'Is she called Mus?' you ask. There is a pause, and some shouting at the other end. 'She says of course she is called Mus, what else would she be called?' By evening the mother is on your landing, and Nils has to go and stand in the kitchen for a while.");
          else c.say("Three calls and four hours. At last a constable at Landskrona has a woman called Esther who is asking for a little girl. 'Is she called Mus?' you ask, and hear the answer from across his office before he can repeat it. By evening the mother is at Ramlösa, on her knees on the floor of the old dining room.");
          c.log("Mus found her mother, who had landed at Landskrona.");
          errand(c, card ? 1 : 4);
          c.go("s-monday");
        },
      },
      {
        id: "ramlosa",
        label: "Go out to Ramlösa and agree with the Lottas where your overflow can go on a full night",
        show: (r) => errands(r) && !r.has("s:ramlosa"),
        hint: "Better somewhere to send people at three in the morning than chairs.",
        act: (c) => {
          c.set("s:ramlosa");
          goTo(c, "ramlosa");
          c.say("The Lotta in charge has a clipboard, a whistle and a cold. She agrees: on a full night you telephone, and their lorry comes for whoever you cannot bed. In return you will send her your lists, because hers, she says, are a disgrace, and the disgrace is spelled four different ways.");
          c.log("Ramlösa will take our overflow on a full night.");
          errand(c, 2);
          goTo(c, base(c));
          c.go("s-monday");
        },
      },
      {
        id: "homes",
        label: (r) => (r.has("s:parents") ? "Ask the parents who sent coats whether any of them have a spare room" : "Go door to door along your street for spare rooms"),
        show: (r) => errands(r) && !r.has("s:homes"),
        hint: (r) => (r.has("s:parents") ? "They already know what it is for." : "A slow afternoon. People say yes more often face to face."),
        act: (c) => {
          const quick = c.has("s:parents");
          c.set("s:homes");
          refresh(c);
          c.say("Six beds in ordinary homes, for a night or two at a time: the baker's wife, the widower with the canary, and the Ekbergs, who have twins and say two more children will hardly be noticed.");
          c.log("Six beds in private homes, for a night or two at a time.");
          errand(c, quick ? 2 : 3);
          c.go("s-monday");
        },
      },
      {
        id: "coats",
        label: "Collect the coats your class has brought",
        show: (r) => errands(r) && r.has("s:parents") && !r.has("s:coats"),
        hint: "Gösta has promised a coat with one sleeve.",
        act: (c) => {
          c.set("s:coats");
          c.add("clothes", 3);
          c.say("Thirty-one children bring nineteen coats, eleven jumpers, a muff, a fur hat that smells of mothballs and an uncle, and Gösta's coat with one sleeve, which his mother has sewn a second sleeve onto, in a different tweed.");
          errand(c, 1);
          c.go("s-monday");
        },
      },
      {
        id: "folke",
        label: "Go to Folke Berg's garage and ask about a bus for nights",
        show: (r) => errands(r) && !r.has("s:folke"),
        hint: "His buses have their ordinary work all day. He might spare one at night.",
        act: (c) =>
          folke(c, 1.5, (x, h) => {
            errand(x, h);
            x.go("s-monday");
          }),
      },
      {
        id: "rota",
        label: "Draw up a rota so that nobody, yourself included, works two nights running",
        show: (r) => errands(r) && !r.has("s:rota"),
        hint: "Some nights will be short-handed. Everyone will still be standing next week.",
        act: (c) => {
          c.set("s:rota");
          c.add("tired", -1);
          c.say("Mrs Wallin reads it, says it is the first sensible piece of paper anyone has given her since Saturday, and pins it up. Your own name is down for Tuesday night and Thursday night, and Wednesday is free.");
          c.log("Drew up a rota: nobody works two nights running.");
          errand(c, 0.5);
          c.go("s-monday");
        },
      },
      {
        id: "on",
        label: (r) => (errands(r) ? "Go home early and sleep before Tuesday night" : "It is Tuesday evening: go down to the quay"),
        hint: (r) => (errands(r) ? "Whatever isn't done will stay undone." : undefined),
        act: (c) => {
          if (errands(c)) {
            c.add("tired", -1);
            c.say("You sleep through Tuesday afternoon with the curtains drawn, and go down to the quay at eleven feeling almost like a person.");
          }
          until(c, at("1943-10-06", 1, 40));
          goTo(c, "helsingborg");
          c.go("s-ternen");
        },
      },
    ],
  },
];

function firstNight(c: Ctx, hard: number): void {
  c.learn("ivar", "saw");
  dry(c, "first", 2);
  night(c, "first", 20, 26);
  shift(c, hard);
  until(c, at("1943-10-04", 13));
  refresh(c);
  goTo(c, base(c));
  c.go("s-monday");
}
