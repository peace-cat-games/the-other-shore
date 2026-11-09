/**
 * The Jewish household, chapters 1 to 3: ordinary days, the warning,
 * leaving home and hiding. Hanna Levin is the protagonist.
 *
 * Simulation parameters here are fictional and documented where used.
 */
import { at } from "../engine/calendar.ts";
import type { Ctx, Read, Scene } from "../engine/types.ts";
import { kroner, moveAll } from "./kit.ts";

export const FAMILY = ["hanna", "david", "ruth", "benny"];

/** The household moves together: Peter and Sara only when they are with you. */
export function party(r: Read): string[] {
  const here = r.truth("hanna").place;
  return [...FAMILY, "sara", "peter", "klara", "moritz"].filter((p) => r.truth(p).place === here);
}

export function moveParty(c: Ctx, place: string, condition: Parameters<Ctx["move"]>[2]): void {
  moveAll(c, party(c), place, condition);
}

/** Wednesday 29 September: the day of telephone calls and errands, until Thursday evening. */
const TASKS_END = at("1943-09-30", 17);

function task(c: Ctx, hours: number): void {
  c.pass(hours * 60);
  // Nobody runs errands through the night: the day resumes on Thursday morning.
  if (c.time > at("1943-09-29", 21) && c.time < at("1943-09-30", 8)) c.pass(at("1943-09-30", 8) - c.time);
}

const tasksOpen = (r: Read) => r.time < TASKS_END;

/** From Tuesday evening to Wednesday, when David comes home from the synagogue. */
function wednesday(c: Ctx): void {
  c.pass(at("1943-09-29", 10) - c.time);
  c.go("h-warning");
}

export const SCENES_1: Scene[] = [
  {
    id: "h-evening",
    role: "household",
    chapter: "Ordinary days",
    place: "flat",
    title: "An ordinary Tuesday",
    body: () => [
      "The blackout curtains are drawn before supper, as they have been for three years. Under the lamp the table holds a honey cake cooling for the New Year, Ruth's Danish exercise book, and a column of figures from the printing works that will not add up.",
      "David reads the evening paper and says nothing about it, which is how you know it is bad. Since the end of August, when the government stopped working with the Germans, there have been soldiers at the bridges and rumors in every queue. Benny is building a harbor out of spoons.",
      "Tomorrow evening the New Year begins. Grandmother Sara will expect everyone at her table in Frederiksberg, the good tablecloth, and an argument about the fish.",
    ],
    options: [
      {
        id: "bech",
        label: "Take a slice of the honey cake across the landing to Mrs Bech",
        hint: "She is alone this year.",
        act: (c) => {
          c.set("h:bech");
          c.learn("kirsten", "saw");
          c.say("Mrs Bech holds the plate as if it were warm bread from her own childhood. She asks after Sara, and then, lowering her voice, whether you are 'all right, with things as they are.' You say yes. She says, 'If you ever aren't, you knock.'");
          c.log("Mrs Bech across the landing said: if you ever aren't all right, knock.");
          c.pass(40);
          wednesday(c);
        },
      },
      {
        id: "letter",
        label: "Write to Peter on the farm: come to Copenhagen for the holiday",
        hint: "A postcard would reach him by Thursday.",
        act: (c) => {
          c.set("h:letter");
          c.say("You write it in the plain Danish he likes to practice: come Thursday, there will be cake, Ruth wants to beat you at chess again. David adds a line in German at the bottom and you pretend not to see it.");
          c.log("Wrote to Peter inviting him for the New Year.");
          c.pass(30);
          wednesday(c);
        },
      },
      {
        id: "essay",
        label: "Help Ruth with her essay on Danish lighthouses",
        hint: "She has been stuck on it for a week.",
        act: (c) => {
          c.set("h:essay");
          c.say("Ruth wants to begin with the light at Kronborg, 'because Hamlet.' You make her begin with the keepers instead: who climbed the stairs every night, and why. She writes three pages and forgets to be cross with you.");
          c.pass(60);
          wednesday(c);
        },
      },
      {
        id: "accounts",
        label: "Stay up and finish the printing works' accounts",
        hint: "Mr Winther has asked for them by Wednesday, and he pays an advance for good work.",
        act: (c) => {
          c.set("h:boss");
          c.add("funds", 2);
          c.say("By midnight the figures add up. The ink is on your fingers and the honey cake is half gone; David brings tea and does not ask how much is left in the savings tin, because he knows.");
          c.pass(240);
          wednesday(c);
        },
      },
    ],
  },
  {
    id: "h-warning",
    role: "household",
    chapter: "The warning",
    place: "flat",
    title: "What the rabbi said",
    body: (r) => [
      "On Wednesday, the eve of the New Year, David comes home from the synagogue far too early, still in his good coat, and closes the door behind him with both hands.",
      "There was no service, he says. The rabbi stood up and told everyone to go home: the Germans mean to arrest the Jews of Denmark in their homes on Friday night, as the New Year ends and the Sabbath begins. Do not be at home. Hide. Get away. Tell everyone you know, and tell those who were not there.",
      `'He didn't say where to go,' David says. 'Nobody knows where to go.' Ruth is standing in the doorway of the kitchen with ${r.has("h:essay") ? "her lighthouse essay" : "her school satchel"}, listening.`,
    ],
    options: [
      {
        id: "plan",
        label: "Sit everyone down and make a plan before anyone leaves the flat",
        hint: "Half an hour now could save hours later.",
        act: (c) => {
          c.set("h:plan");
          c.say("You put the kettle on because your hands need something to do. Ruth writes the list: Grandmother, Peter, the bank, Ole, the Felds from the synagogue who have nobody here. David takes the telephone; you take the errands. Benny is given the important job of guarding the honey cake.");
          c.pass(30);
          c.go("h-tasks");
        },
      },
      {
        id: "sara",
        label: "Go straight to Frederiksberg to tell Grandmother Sara",
        hint: "She will have heard something at the synagogue, but not decided anything.",
        act: (c) => {
          c.pass(45);
          c.move("hanna", "frederiksberg", "home");
          c.say("You take the tram with your hat pulled low, though nobody looks at you twice.");
          c.go("h-sara");
        },
      },
      {
        id: "ole",
        label: "Telephone Ole at the school: he knows people",
        hint: "Telephones may be listened to. You would have to speak carefully.",
        act: (c) => {
          c.set("h:ole");
          c.add("helpers", 1);
          c.learn("ole", "telephone");
          c.say("You ask Ole whether the school excursion is still on. There is a pause, and then he says, quite casually, that he has heard the weather on the coast is changing, and that he will come by this evening with the timetable. You both hang up and breathe. That evening he arrives with the key to his aunt's empty summer house near Espergærde in his pocket, and the names of students who are 'arranging excursions to the coast.'");
          c.pass(20);
          c.go("h-tasks");
        },
      },
    ],
  },
  {
    id: "h-sara",
    role: "household",
    chapter: "The warning",
    place: "frederiksberg",
    title: "Grandmother Sara",
    body: () => [
      "Sara has the good tablecloth on already, and the candlesticks polished, and her coat over a chair because she was at the synagogue too and has heard every word.",
      "'I am seventy-seven,' she says. 'I have been an old Jewish woman in Copenhagen since before your Benny's grandfather could tie his shoes. Nobody came for me in 1914 or in 1940. And it is the New Year.' Then, more quietly: 'Mrs Holst at the parsonage has asked me to stay with her. She was very firm. Pastors' widows are always very firm.'",
      "She looks at you over her glasses, waiting to see whether you will be firm too.",
    ],
    options: [
      {
        id: "with",
        label: "Ask her to come and stay with you, so the family stays together",
        hint: "Together you'd move more slowly, but you would never have to wonder where she was.",
        act: (c) => {
          c.set("h:sara-told");
          c.set("h:sara-with");
          c.say("'If I come, the candlesticks come,' she says, which is a yes. You agree to fetch her tomorrow with a taxi and a very small suitcase. She says the suitcase will be the size she decides.");
          c.log("Grandmother Sara will come to us on Thursday, with the candlesticks.");
          c.hear("sara", "frederiksberg", "home", "saw");
          c.pass(120);
          c.move("hanna", "flat", "home");
          c.go("h-tasks");
        },
      },
      {
        id: "parsonage",
        label: "Help her pack for the parsonage tonight: Mrs Holst can look after her",
        hint: "Comfortable and safe, but she would be somewhere else when your own way opens.",
        act: (c) => {
          c.set("h:sara-told");
          c.set("h:sara-friend");
          c.move("sara", "parsonage", "hidden");
          c.learn("sara", "saw");
          c.say("You carry her bag the four streets to the parsonage. Mrs Holst opens the door before you knock, takes the bag from you, and says the spare room has been aired since Monday, as if she had known. Sara tells her the fish must be carp.");
          c.log("Grandmother Sara is staying at the parsonage with Mrs Holst.");
          c.pass(150);
          c.move("hanna", "flat", "home");
          c.go("h-tasks");
        },
      },
      {
        id: "later",
        label: "Leave the decision until tomorrow, when David can talk to her",
        hint: "She is not ready to decide. Neither are you.",
        act: (c) => {
          c.set("h:sara-told");
          c.say("You drink a cup of tea you do not want, and promise to come back with David. On the tram home you realise you never asked where she would go if nobody came back.");
          c.pass(90);
          c.move("hanna", "flat", "home");
          c.go("h-tasks");
        },
      },
    ],
  },
  {
    id: "h-tasks",
    role: "household",
    chapter: "The warning",
    place: "flat",
    title: "A day of errands",
    body: (r) => {
      const left = r.time < at("1943-09-29", 21) ? "It is still Wednesday, and tonight the New Year begins." : "It is Thursday, the first day of the New Year, and the streets are ordinary in a way that feels like a trick.";
      return [
        `${left} There is more to do than there are hours, and every errand has to look like something else: a visit, a walk, a trip to the bank.`,
        r.has("h:plan") ? "Ruth's list lies on the table, with ticks beside some names in her careful hand." : "You keep a list in your head and keep losing it.",
        r.time >= at("1943-09-30", 12) ? "By the evening you will have to stop and pack, whatever is left undone." : "By Thursday evening you will have to stop and pack, whatever is left undone.",
      ];
    },
    options: [
      {
        id: "go-sara",
        label: "Go to Frederiksberg and talk to Grandmother Sara",
        show: (r) => tasksOpen(r) && !r.has("h:sara-told"),
        hint: "About two hours there and back.",
        act: (c) => {
          task(c, 1);
          c.move("hanna", "frederiksberg", "home");
          c.go("h-sara");
        },
      },
      {
        id: "peter",
        label: "Telephone the farm where Peter works",
        show: (r) => tasksOpen(r) && !r.has("h:peter-reached"),
        hint: (r) => (r.has("h:letter") ? "Your postcard should reach him tomorrow anyway, but it says nothing of this." : "The farmer has a telephone in his hall. Peter may be out in the fields."),
        act: (c) => {
          c.set("h:peter-reached");
          c.say("The farmer's wife fetches Peter from the beet field. You talk about the holiday and the weather in Copenhagen, which is 'changing very suddenly.' Peter is quiet, then says he understands, he will take the train tomorrow with only a small bag. In his Viennese Danish he adds, 'I have done this before, you know.'");
          c.hear("peter", "farm", "home", "telephone");
          c.log("Peter will come to Copenhagen on Thursday.");
          task(c, 1.5);
          c.go("h-tasks");
        },
      },
      {
        id: "bank",
        label: "Go to the bank and draw out the savings",
        show: (r) => tasksOpen(r) && !r.has("h:bank"),
        hint: "The queue may be long. Money will matter on the coast.",
        act: (c) => {
          c.set("h:bank");
          c.add("funds", 30);
          c.say(`The clerk counts out the notes twice and says, without looking up, 'Going on a little holiday, Mrs Levin?' You say yes. She says, 'Good. Take warm things.' You come home with ${kroner(30)}, nearly all your savings, in an envelope inside your blouse.`);
          task(c, 2);
          c.go("h-tasks");
        },
      },
      {
        id: "felds",
        label: "Go to the Felds in Nørrebro: they came from Berlin and know almost no one here",
        show: (r) => tasksOpen(r) && !r.has("h:felds"),
        hint: "They will need help with the language and the arrangements. They have less money than you.",
        act: (c) => {
          c.set("h:felds");
          c.add("helpers", 1);
          c.learn("klara", "saw");
          c.learn("moritz", "saw");
          c.say("Klara Feld opens the door already dressed to leave, with nowhere to leave to. In 1938 they waited too long in Berlin, Moritz says, and he will not wait again. You agree that whoever finds a way first sends word to the other. Klara presses a book on you as payment for nothing: Heine, in German, with Moritz's old bookshop stamp inside.");
          c.log("The Felds will travel with us if they can.");
          task(c, 2);
          c.go("h-tasks");
        },
      },
      {
        id: "keys",
        label: "Ask Mrs Bech to keep a key and look in on the flat",
        show: (r) => tasksOpen(r) && !r.has("h:keys"),
        hint: (r) => (r.has("h:bech") ? "She told you to knock." : "You have hardly spoken to her this year."),
        act: (c) => {
          c.set("h:keys");
          c.learn("kirsten", "saw");
          if (c.has("h:bech")) {
            c.set("h:bech-room");
            c.add("helpers", 1);
            c.say("Mrs Bech takes the key and hangs it on the nail beside her own. 'And if you need a bed for a night,' she says, 'my late husband snored louder than four Levins.'");
          } else {
            c.say("Mrs Bech takes the key with a little frown, as if she had been waiting a long time to be asked something. She promises to water the geraniums.");
          }
          task(c, 0.5);
          c.go("h-tasks");
        },
      },
      {
        id: "see-ole",
        label: "Go to the school to see Ole",
        show: (r) => tasksOpen(r) && !r.has("h:ole"),
        hint: "David's young colleague is said to know people who know people.",
        act: (c) => {
          c.set("h:ole");
          c.add("helpers", 1);
          c.learn("ole", "saw");
          c.say("Ole walks you around the schoolyard as if discussing the timetable. His aunt has a summer house near Espergærde, empty since August, a few minutes from the shore. Students he knows are 'arranging excursions to the coast.' He writes nothing down.");
          task(c, 1.5);
          c.go("h-tasks");
        },
      },
      {
        id: "pack",
        label: (r) => (tasksOpen(r) ? "Stop the errands and start packing" : "It is evening: start packing"),
        hint: (r) => (tasksOpen(r) ? "Whatever is not done will stay undone." : undefined),
        act: (c) => {
          if (c.time < at("1943-09-30", 18)) c.pass(at("1943-09-30", 18) - c.time);
          if (c.has("h:letter") || c.has("h:peter-reached")) {
            c.move("peter", "flat", "home");
            c.learn("peter", "saw");
            c.say("Peter arrives on Thursday afternoon with one small bag and a cabbage from the farmer's wife, and the flat feels braver for it.");
          } else {
            c.hear("peter", "farm", "unknown", "nobody");
          }
          if (c.has("h:sara-with")) {
            c.move("sara", "flat", "home");
            c.learn("sara", "saw");
            c.say("Sara arrives by taxi with a suitcase twice the agreed size, the candlesticks wrapped in a tea towel on top.");
          } else if (!c.has("h:sara-told")) {
            // She heard the rabbi herself and went to the parsonage, but the family doesn't know that yet.
            c.set("h:sara-friend");
            c.move("sara", "parsonage", "hidden");
            c.hear("sara", "frederiksberg", "unknown", "nobody answers her telephone");
          }
          if (c.has("h:felds")) {
            c.move("klara", "flat", "home");
            c.move("moritz", "flat", "home");
            c.learn("klara", "saw");
            c.learn("moritz", "saw");
          }
          c.go("h-pack");
        },
      },
    ],
  },
  {
    id: "h-pack",
    role: "household",
    chapter: "Leaving home",
    place: "flat",
    title: "What fits in a bag",
    body: (r) => [
      "Thursday evening, the second night of the New Year. You light the candles because it would be worse not to, and say the blessing, and then you open the suitcases on the bed.",
      `Everything in the flat is suddenly either necessary or impossible. ${r.v("luggage") === 0 ? "The bags are empty." : `You have packed ${r.v("luggage") === 1 ? "one bag" : `${r.v("luggage")} bags`} so far.`} Ole said: whatever you take, you must be able to carry it at a run, at night, down a beach.`,
    ],
    options: [
      {
        id: "warm",
        label: "Warm clothes for everyone: coats, wool socks, the children's hats",
        show: (r) => !r.has("h:warm"),
        hint: "October nights on the water are cold.",
        act: (c) => (c.set("h:warm"), c.add("supplies", 2), c.add("luggage", 1), c.say("Wool, wool and more wool. Benny protests the hat."), c.pass(20), c.go("h-pack")),
      },
      {
        id: "food",
        label: "Food for two days: bread, cheese, the rest of the honey cake",
        show: (r) => !r.has("h:food"),
        hint: "Nobody knows how long the waiting will be.",
        act: (c) => (c.set("h:food"), c.add("supplies", 1), c.add("luggage", 1), c.say("You wrap the honey cake in a napkin. It seems important that the New Year comes with you."), c.pass(15), c.go("h-pack")),
      },
      {
        id: "papers",
        label: "Papers and money, sewn into a belt under your clothes",
        show: (r) => !r.has("h:papers"),
        hint: "Takes no room. Proof of who you are will help on the other side.",
        act: (c) => (c.set("h:papers"), c.say("Birth certificates, the marriage certificate, Ruth's school report, and the money, stitched flat in a belt of old curtain."), c.pass(40), c.go("h-pack")),
      },
      {
        id: "rabbit",
        label: "Benny's cloth rabbit",
        show: (r) => !r.has("h:rabbit"),
        hint: "Weighs nothing. He does not sleep without it.",
        act: (c) => (c.set("h:rabbit"), c.say("The rabbit has one ear and a long history. It goes in your coat pocket."), c.pass(2), c.go("h-pack")),
      },
      {
        id: "photos",
        label: "The family photographs, out of their frames",
        show: (r) => !r.has("h:photos"),
        hint: "A flat envelope.",
        act: (c) => (c.set("h:photos"), c.say("Your parents' wedding, David at his first school, Ruth on the beach at Hornbæk in 1938 with a bucket on her head."), c.pass(10), c.go("h-pack")),
      },
      {
        id: "candles",
        label: (r) => (r.truth("sara").place === r.truth("hanna").place ? "Make room for Grandmother Sara's candlesticks" : "Take your own Sabbath candlesticks"),
        show: (r) => !r.has("h:candlesticks"),
        hint: "Heavy, and not needed for anything but remembering.",
        act: (c) => (c.set("h:candlesticks"), c.add("luggage", 1), c.say("They go in wrapped in a pillowcase, and the bag is heavier by exactly the weight of every Friday night you can remember."), c.pass(5), c.go("h-pack")),
      },
      {
        id: "close",
        label: "Close the bags",
        hint: (r) => (r.v("luggage") >= 3 ? "That is a lot to carry for two adults, a girl and a small boy." : r.v("supplies") === 0 ? "You would be travelling with nothing but what you wear." : undefined),
        act: (c) => {
          if (!c.has("h:warm") && !c.has("h:food")) c.say("You take what you are wearing and a little money. It feels like leaving for an afternoon.");
          c.pass(60);
          c.go("h-leave");
        },
      },
    ],
  },
  {
    id: "h-leave",
    role: "household",
    chapter: "Leaving home",
    place: "flat",
    title: "Leaving home",
    body: (r) => [
      "Friday morning, the second day of the New Year. By tonight nobody should be sleeping here.",
      `You go through the rooms once. The geraniums, the piano nobody plays, Ruth's lighthouse drawings pinned above her bed. ${r.has("h:keys") ? "Mrs Bech has the spare key." : "You lock the door and keep the key, though you do not know what it will open when you come back."}`,
      "There are only so many places a family of this size can go without being noticed.",
    ],
    options: [
      {
        id: "summer",
        label: "To Ole's aunt's summer house near Espergærde, close to the coast",
        needs: (r) => (r.has("h:ole") ? null : "You would need Ole to arrange it."),
        hint: "Cold and out of the way, with little news, but close to where boats leave.",
        act: (c) => {
          c.set("h:at-summer");
          c.pass(150);
          moveParty(c, "summerhouse", "hidden");
          c.say("Ole drives you north in a borrowed delivery van that smells of apples, with the luggage under sacks. The summer house is shuttered and cold and has a view of the Sound through the pines. On a clear day, Ole says, you can see Sweden.");
          c.log("Hiding at the summer house near Espergærde.");
          c.go("h-night");
        },
      },
      {
        id: "hospital",
        label: "To Bispebjerg Hospital, where the staff are said to be hiding people",
        hint: "Warm, crowded and full of news; far from the coast.",
        act: (c) => {
          c.set("h:at-hospital");
          c.pass(90);
          moveParty(c, "hospital", "hidden");
          c.say("A porter takes one look at your luggage and walks you through a side entrance. A nurse writes names on admission cards, not yours, and gives the children ward pyjamas. In the next bed an old man reads the racing results as if nothing at all were happening.");
          c.log("Hiding at Bispebjerg Hospital under other names.");
          c.go("h-night");
        },
      },
      {
        id: "bech",
        label: "Across the landing, to Mrs Bech",
        needs: (r) => (r.has("h:bech-room") ? null : "You would have to have asked her, and she would have to have offered."),
        hint: "Warm and close to everything you know, which is also its danger.",
        act: (c) => {
          c.set("h:at-bech");
          c.pass(5);
          moveParty(c, "bech", "hidden");
          c.say("Four steps across the landing. Mrs Bech has made up beds on the floor and put the radio on loud. 'Nobody,' she says, 'searches the flat of a widow who sings in the church choir.' You hope she is right.");
          c.log("Hiding with Mrs Bech across the landing.");
          c.go("h-night");
        },
      },
    ],
  },
  {
    id: "h-night",
    role: "household",
    chapter: "In hiding",
    place: "flat",
    title: "The night of the first of October",
    body: (r) => {
      const where = r.has("h:at-summer") ? "In the summer house the wind finds every crack." : r.has("h:at-hospital") ? "On the ward the night lights burn low and the nurses walk softly." : "In Mrs Bech's sitting room the clock is very loud.";
      return [
        `${where} Nobody sleeps much. Ruth lies awake with her eyes open, the way David does.`,
        "Somewhere in the city tonight, they say, the police will be knocking on doors. You have closed one door behind you and do not know yet whether it was enough.",
        "Benny asks if the Germans know where everybody lives. Ruth tells him that Grandmother Sara says they cannot even find the right tram.",
      ];
    },
    options: [
      {
        id: "calm",
        label: "Keep the children busy: cards, stories, whispering games",
        hint: "Nobody rests if the children don't.",
        act: (c) => {
          c.add("tired", -1);
          c.say("You teach Benny a whispering game called Lighthouse: one person is the light, everyone else is a ship, and the ships must say where they are without being heard. He wins by falling asleep.");
          c.pass(9 * 60);
          c.go("h-morning");
        },
      },
      {
        id: "radio",
        label: "Listen to the radio, low, for news",
        hint: "News from Sweden comes over the water some evenings.",
        act: (c) => {
          c.set("h:radio");
          c.add("tired", 1);
          c.say("Static, music, static. You fall asleep with the earpiece on your pillow. On Saturday evening the news from Sweden says it plainly: Sweden will take in Denmark's Jews. David reads the words back to you twice from the scrap of paper where he wrote them down.");
          c.log("Heard on the radio: Sweden will take in the Jews of Denmark.");
          c.pass(9 * 60);
          c.go("h-morning");
        },
      },
      {
        id: "word",
        label: "Try to get word of Grandmother Sara",
        show: (r) => r.truth("sara").place !== r.truth("hanna").place,
        hint: "A message could pass through two or three people before it reached her.",
        act: (c) => {
          c.set("h:asked");
          c.add("tired", 1);
          c.learn("sara", "message");
          c.say("It takes most of the night and three people. In the morning a note comes back in Mrs Holst's square hand: your mother-in-law is well, eats everything, and has views on the parsonage's coffee.");
          c.pass(9 * 60);
          c.go("h-morning");
        },
      },
    ],
  },
  {
    id: "h-morning",
    role: "household",
    chapter: "In hiding",
    place: "flat",
    title: "Saturday",
    body: (r) => [
      r.has("h:keys") ? "Word comes from Mrs Bech by way of a delivery boy: in the night men came to the building and knocked on your door, and went away when no one answered. The door is still on its hinges. The geraniums have been watered." : "Word comes the way it comes now, sideways: in the night there were arrests in the city, though far fewer than the Germans had wanted. Most doors they knocked on had nobody behind them.",
      "The city is full of people who are not where they live. You are now one of them, and every hour of waiting costs something: patience, money, the children's sleep.",
      "The coast is where everyone is going. The question is how.",
    ],
    options: [
      {
        id: "on",
        label: "Start arranging a crossing",
        act: (c) => {
          c.add("tired", 1);
          c.pass(120);
          c.go("h-passage");
        },
      },
      {
        id: "rest",
        label: "Rest first: one quiet morning, then begin",
        hint: "Rested people make fewer mistakes. A morning is a morning.",
        act: (c) => {
          c.add("tired", -2);
          c.say(c.truth("peter").place === c.truth("hanna").place ? "You let everyone sleep until the light is high. Peter plays chess with Ruth on a board drawn on the back of a calendar. Nobody wins, which is a kind of peace." : "You let everyone sleep until the light is high. Ruth plays chess against herself on a board drawn on the back of a calendar, and declares a draw.");
          c.pass(6 * 60);
          c.go("h-passage");
        },
      },
    ],
  },
];
