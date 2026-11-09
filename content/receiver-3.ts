/**
 * The Swedish receiver, chapter 5 and the endings: the busiest nights, the
 * card for Peter Weil, the school given back, and what became of everyone.
 *
 * Fictional simulation parameters:
 *  - The volunteers are worn out when their tiredness reaches 8 of 10 at the
 *    end; then Dr Sjöberg sends Märta home and the ending is s-worn.
 *  - Peter's entry on the Viken list is found by telephone if Nils's pilot
 *    named Viken, or if the lists and Peter's card together are good enough
 *    (lists plus 2 for a card with other spellings, plus 1 for Ruth's card,
 *    at least 4). A card on the Danish club's noticeboard is seen by someone
 *    who knows him half the time in story mode, a third in standard mode.
 */
import { at } from "../engine/calendar.ts";
import type { Ctx, Ending, PersonOutcome, Read, Scene } from "../engine/types.ts";
import { LEVINS, base, chairs, goTo, refresh, room, until } from "./receiver-1.ts";
import { local } from "./receiver-2.ts";

const WORN = 8;
const COUNT = ["no", "one", "two", "three", "four", "five", "six"];
const worn = (r: Read) => r.v("tired") >= WORN;

function weary(v: number): string {
  if (v <= 1) return "rested, for once";
  if (v <= 3) return "tired";
  if (v <= 5) return "very tired, and small mistakes are creeping in";
  if (v <= 7) return "exhausted; people fall asleep sitting up";
  return "at the end of their strength, and so are you";
}

const peterCard = (r: Read) => (r.has("s:card-peter") ? 2 : r.has("s:ruth-wrote") ? 1 : 0);
const peterFound = (r: Read) => r.has("s:peter-found");

/** Sunday: what happened over the weekend, before the choice. */
function sunday(c: Ctx): void {
  c.move("peter", "viken", "safe");
  if (c.has("s:sara-late") && local(c)) {
    c.set("s:sara-ruth");
    c.move("sara", c.has("s:levins-elsa") ? "nystrom" : base(c), "safe");
    c.learn("sara", "saw");
  }
  c.unset("s:lis-here");
  // On Monday the families who were kept back go inland; Märta sees them onto the bus.
  if (c.has("s:levins-here")) {
    c.unset("s:levins-here");
    c.unset("s:sara-here");
    const going = c.has("s:sara-found") || c.has("s:sara-ruth") ? [...LEVINS, "sara"] : LEVINS;
    for (const p of going) {
      c.move(p, "inland", "safe");
      c.learn(p, "saw");
    }
  }
  if (c.has("s:sara-monday")) {
    c.unset("s:sara-monday");
    c.move("sara", "inland", "safe");
    c.learn("sara", "saw");
  }
  refresh(c);
}

function toTuesday(c: Ctx): void {
  until(c, at("1943-10-12", 19));
  goTo(c, "lindqvist");
  c.go("s-peter");
}

function toThursday(c: Ctx): void {
  if (c.has("s:sara-late") && !c.has("s:sara-ruth")) {
    c.set("s:sara-tray");
    c.add("found", 1);
    c.move("sara", "inland", "safe");
    c.learn("sara", "telephone");
    c.log("Found Sara Levin in my own tray, under W. She has gone inland to her family.");
  }
  until(c, at("1943-10-14", 8));
  goTo(c, "school-se");
  c.go("s-last");
}

function peterIsFound(c: Ctx, via: string, text: string): void {
  c.set("s:peter-found");
  c.add("found", 1);
  c.learn("peter", via);
  c.say(text);
  c.log("Peter Weil landed at Viken on Sunday. The Levins know.");
}

export const SCENES_3: Scene[] = [
  {
    id: "s-peak",
    role: "receiver",
    chapter: "Mid-October",
    place: "reception",
    title: "The busiest nights",
    body: (r) => {
      const out = [
        "The night between Friday and Saturday was the busiest yet, and Saturday night was no quieter. Boats came in until it was light and after: fishing boats, rowing boats, a navy boat with the passengers of a rowing boat it had taken aboard halfway across. Constable Persson, who stopped pretending to count on Thursday, says the superintendent's office is talking of thousands in two days, all down the coast.",
      ];
      const beds = r.has("s:chairs-peak") ? `On Friday night your beds were full by two, and the rest slept ${chairs(r)}, or walked out to Ramlösa in the dark.` : r.has("s:ramlosa-peak") ? "On Friday night your beds were full by two, and the Lottas' lorry went out to Ramlösa three times." : "By some miracle of arithmetic, everyone had a bed.";
      let levins = "";
      if (r.has("s:sara-late") && local(r)) levins = " On Saturday Ruth Levin, who walks out to Ramlösa every day to read the noticeboard, found her grandmother on a bench outside the old spa hotel, where she had been since Friday, under W.";
      else if (r.has("s:sara-found") && local(r) && !r.has("s:sara-monday"))
        levins =
          r.has("s:soup") || r.has("s:levins-elsa")
            ? " The Levins kept the fast of Yom Kippur all Saturday, and when it ended at nightfall Mrs Nyström's soup was eaten to the last drop and declared the best in Sweden. Mrs Nyström has been insufferable since."
            : " The Levins kept the fast of Yom Kippur all Saturday, and broke it at nightfall with bread and herring from the Lotta kitchen, over which Sara said a blessing.";
      out.push(beds + levins);
      out.push(`The volunteers are ${weary(r.v("tired"))}. Nils has not seen you awake since ${r.has("s:raa-post") ? "Thursday" : "Wednesday"}. This morning there was a crossword clue on the kitchen table in his handwriting: 'Seen less often than the sun (5).' The answer is MÄRTA.`);
      return out;
    },
    options: [
      {
        id: "rota",
        label: (r) => (r.has("s:ramlosa") ? "Make everyone take a full night off in turn, yourself first, and send the overflow to Ramlösa" : "Make everyone take a full night off in turn, yourself first"),
        hint: "One night short-handed each. Everyone still standing next week.",
        act: (c) => {
          sunday(c);
          c.set("s:rested-peak");
          c.add("tired", -3);
          c.say("You sleep from Sunday evening until Monday noon in your own bed. The table runs without you, and runs well, which is slightly annoying.");
          toTuesday(c);
        },
      },
      {
        id: "on",
        label: "Keep everyone on through the next two nights: then it will ease",
        hint: "More hands at the table, and more names matched. Nobody will be fit for anything by Wednesday.",
        act: (c) => {
          const muddled = c.v("tired") >= 6;
          sunday(c);
          c.set("s:kept-on");
          c.add("tired", 3);
          c.add("found", 1);
          c.say("At four on Monday morning a man from your list and a woman from the Landskrona list turn out to be married to each other, and you are there to see it, and it is worth a great deal.");
          if (muddled) {
            c.add("lists", -1);
            c.say("By Monday evening you have written a Hansen as a Jensen and a Jensen as nobody at all, and caught only one of them.");
          }
          toTuesday(c);
        },
      },
      {
        id: "home",
        label: "Go home to Nils for one evening, and leave the night to the others",
        hint: "Your own bed, a hot supper, and Nils, who says he has news from the pilots.",
        act: (c) => {
          sunday(c);
          c.set("s:nils-evening");
          c.set("s:viken-lead");
          c.add("tired", -2);
          goTo(c, "lindqvist");
          c.learn("nils", "saw");
          c.say("Nils has made pea soup, although it is not Thursday, and made it badly, and is proud of it. He has news, too. The pilot from Viken was in at the harbor office this afternoon: they had a boat in this morning from up the coast, and among its passengers three young lads off a farm, one of them talking Danish with a German accent and asking the way to Helsingborg.");
          c.log("Nils's pilot: three lads off a farm landed at Viken on Sunday morning.");
          toTuesday(c);
        },
      },
    ],
  },
  {
    id: "s-peter",
    role: "receiver",
    chapter: "Mid-October",
    place: "lindqvist",
    title: "A card for Peter Weil",
    body: (r) => {
      const card = r.has("s:card-peter")
        ? "Peter Weil's card is still open: WEIL, Peter, 17, from Vienna, a farm in Zealand; also WEILL, VEIL."
        : r.has("s:ruth-wrote")
          ? "Peter Weil's card is still open, in Ruth Levin's beautiful hand: Peter Weil, 17, from Vienna. Friend of the family."
          : "Under the Levins in your book there is a line that says only: a friend, Peter, a boy.";
      const asks = r.has("s:levins-elsa")
        ? "Ruth asks about him every day, on her way past to read the lists."
        : "A letter has come from Hanna Levin at the hotel inland, asking in a bookkeeper's hand whether there is any news of Peter, and saying that Ruth has stopped playing chess.";
      const tray = r.has("s:sara-late") && !r.has("s:sara-ruth") ? " The same letter asks, very carefully, whether there has been any word at all of her mother-in-law. You go to the tray from Friday, and find her there, under W, where she has been all along, and sit very still for a moment. Then you telephone Ramlösa." : "";
      const lead = r.has("s:viken-lead")
        ? "Nils's pilot said Viken: three lads off a farm, one with a German accent."
        : r.v("tired") >= 7
          ? "The columns of names swim when you look at them. You have read the Viken list twice tonight and could not tell anyone what is on it."
          : "Nothing in tonight's lists looks like him. The lists from the north come in late, and in pencil.";
      return [
        "The lists come in from everywhere now, from Höganäs and Viken in the north to Landskrona and Malmö in the south: typed, handwritten, pencilled on the backs of invoices. You go through them every evening at the kitchen table while Nils does the crossword, and the cards in your box get their second lines: found, and where.",
        `${card} ${asks}${tray}`,
        lead,
      ];
    },
    options: [
      {
        id: "phone",
        label: "Telephone the police up the coast, one harbor after another, and read them Peter's card",
        needs: (r) => (r.v("tired") >= WORN ? "You are too tired to hold a telephone conversation that makes sense. You tried on Monday, and asked the exchange for Denmark." : null),
        hint: (r) => (r.has("s:viken-lead") ? "Nils's pilot said Viken." : "Höganäs, Viken, Mölle, Arild: a long evening on the telephone."),
        act: (c) => {
          const lead = c.has("s:viken-lead");
          c.pass(lead ? 30 : 180);
          if (lead || c.v("lists") + peterCard(c) >= 4) {
            peterIsFound(c, "telephone", "The constable at Viken reads his Sunday list down the line in a slow voice. Three boys from a farm. 'Weihl, P., seventeen,' he says. 'Wien.' You ask him to spell it, and he does, and you shut your eyes. Peter Weil, from Vienna, landed at Viken on Sunday morning with two friends from the farm, and is asking anyone who will listen for a family called Levin. You telephone the hotel inland that night, and Ruth comes to the telephone and says nothing at all for a while, and then asks whether he has been practicing his chess.");
          } else {
            c.set("s:peter-almost");
            c.say("By ten o'clock you have telephoned six harbors and nobody has a Weil. At Höganäs a constable thinks somebody had a Weihl, perhaps, but the man who wrote it has gone home with the list in his pocket. You put a pencil question mark on the card and go to bed.");
          }
          toThursday(c);
        },
      },
      {
        id: "letter",
        label: "Write to the Red Cross, with every spelling of his name you can think of",
        hint: "Slow and thorough. Their letters go everywhere.",
        act: (c) => {
          c.set("s:peter-letter");
          c.say("WEIL, WEILL, VEIL, VAIL, WEIHL: you write them all, with Vienna and the farm in Zealand and the Levins' address, and post it on your way to school.");
          toThursday(c);
        },
      },
      {
        id: "club",
        label: "Pin his card on the noticeboard at the Danish club in town, where Danes come to read the newspapers",
        hint: "Danes from all along the coast pass through it. Someone may know a boy from Vienna.",
        act: (c) => {
          c.set("s:peter-club");
          c.say("The club's noticeboard is three layers deep in cards already. You pin Peter's at eye level, in the middle, with two pins.");
          if (c.roll("peter-club", c.mode === "standard" ? 0.35 : 0.5)) {
            peterIsFound(c, "a note on the club's board", "On Wednesday there is a note pinned under it in pencil, in Danish: Peter Weil is at Viken, he came over with Leo and me on Sunday, he says hello to Ruth. It is signed only with a first name and the word 'farm'. You telephone Viken, and it is true.");
          }
          toThursday(c);
        },
      },
    ],
  },
  {
    id: "s-last",
    role: "receiver",
    chapter: "Mid-October",
    place: "school-se",
    title: "Thursday, the fourteenth",
    body: (r) => [
      r.has("s:school")
        ? "On Thursday morning the gymnasium is a gymnasium again. The mats are stacked against the wall bars, there is a child's sock under the vaulting horse that nobody will claim, and the smell of soup will be in the curtains until spring."
        : r.has("s:hall")
          ? "On Thursday the church hall goes back to its verger with fourteen mattresses, an urn that has boiled more water in a fortnight than in the ten years before, and a child's sock under the stage that nobody will claim."
          : "On Thursday the room above the shipping agent's goes back to the committee, with eight camp beds folded against the wall and a child's sock under the bench that nobody will claim.",
      `The boats still come, but fewer: most of those who were going to cross have crossed. The shoebox of cards has gone to the police station, tied with string, with your name on the lid. ${r.v("found") > 0 ? `Your cards have matched ${COUNT[r.v("found")] ?? r.v("found")} ${r.v("found") === 1 ? "person to their family" : "people to their families"}. ` : ""}At Ramlösa people are learning the Swedish words for things, and correcting each other.`,
      worn(r)
        ? "Your hand shakes when you hold the chalk. Dr Sjöberg, passing the school on his rounds, has seen you through the window, and is coming up the steps with the look of a man about to give orders."
        : "Your class comes back from the library. Gösta wants to know whether the Danish children will come to school here. You don't know, and you tell him so, and he says it is the first time a teacher has ever said that to him.",
    ],
    options: [
      {
        id: "rota",
        label: "Put your name down for two evenings a week at the Red Cross table, for as long as the boats keep coming",
        act: (c) => finish(c, "s:end-rota"),
      },
      {
        id: "letters",
        label: "Set your class to write letters to the Danish children who have gone inland",
        act: (c) => finish(c, "s:end-letters"),
      },
      {
        id: "sleep",
        label: "Go home after school and sleep until Saturday",
        hint: "You have earned it, and nobody would dare say otherwise.",
        act: (c) => finish(c, "s:end-sleep", 3),
      },
    ],
  },
];

/** The ending is settled by how things stand on Thursday morning; the last choice colors the epilogue. */
function finish(c: Ctx, flag: string, rest = 0): void {
  const ending = worn(c) ? "s-worn" : peterFound(c) ? "s-every-name" : "s-one-card";
  c.add("tired", -rest);
  c.set(flag);
  if (ending === "s-worn") c.set("s:worn");
  c.end(ending);
}

const FINALE = [
  "The Danes stayed for nineteen months. They worked, and went to school, and argued about the news from home in Danish in Swedish kitchens. Many of them stayed in Helsingborg itself and worked in its factories, and the town grew used to the sound of them.",
  "In May 1945 the war ended. On 28 May two ferries, full, took the first large group of Helsingborg's refugees home across the Sound. That same month a monument was unveiled in the town: a police officer and a Lotta, receiving a boat. There is no schoolteacher on it. You think that is right. There were far too many of you to fit.",
];

function mus(r: Read): string {
  if (!r.has("s:mus-found"))
    return r.has("s:mus-home")
      ? "Mus's mother found her on the Tuesday, on your own landing, sent by a constable at Landskrona who had heard of a teacher called Lindqvist with a little girl, without any help from you, which is how it should sometimes be."
      : "Mus's mother found her at Ramlösa on the Tuesday, through the Lottas, without any help from you, which is how it should sometimes be.";
  return "Mus's real name, it turned out, was Miriam. She went on answering to Mus.";
}

function people(r: Read): PersonOutcome[] {
  const end = r.has("s:worn")
    ? "Spent a week in bed on Dr Sjöberg's orders, and the rest of October being reminded of it by everyone. In November she went back to teaching geography to thirty-one children who now knew exactly where Denmark was."
    : r.has("s:end-rota")
      ? "Kept two evenings a week at the Red Cross table for as long as the boats came, and afterwards kept the cards, in the shoebox, on top of the wardrobe. She went back to teaching geography to thirty-one children who now knew exactly where Denmark was."
      : r.has("s:end-letters")
        ? "Her class wrote to the Danish children inland all winter. Three letters were answered in Danish, one in Swedish, and one, from a boy of eight, entirely in drawings of boats, which she pinned up beside the map of Skåne."
        : "Slept from Thursday afternoon until Saturday morning, and woke to find that Nils had finished the crossword in her name. Then she went back to teaching geography, and to the Red Cross table on Thursdays.";
  const out: PersonOutcome[] = [
    { person: "marta", kind: "ordinary", text: end },
    {
      person: "nils",
      kind: "ordinary",
      text: r.has("s:mus-home")
        ? "Kept a small blue cup on the kitchen shelf that nobody else was allowed to use, because Mus had drunk her milk from it."
        : r.has("s:nils-evening")
          ? "Made pea soup again the following Sunday, although it was still not Thursday, and was still proud of it."
          : "Went on keeping the harbor office's books, and kept a column of his own in pencil of every boat from Denmark he heard of that autumn.",
    },
    {
      person: "gunnar",
      kind: "ordinary",
      text: r.has("s:lis-worse")
        ? "Drove Lis Melby to the hospital at two in the morning in his own car, and told Märta afterwards that she had been right to call him, which was the nearest he ever came to a compliment."
        : r.has("s:doctor")
          ? "Came at any hour, as he had promised, and was never once asked whether he was coming."
          : "Told Märta, at length, that next time she should telephone him first, and wrote his number on the back of a prescription so that she could.",
    },
    {
      person: "ivar",
      kind: "ordinary",
      text: r.has("s:persson-ok")
        ? "Kept the Felds' form as an example of how it should be done. The next time a German-speaking couple came to his table, he had a German grammar from the school library open beside his ledger."
        : r.has("s:persson-cross")
          ? "Finished every form, the Felds' included, eventually. He and Märta were polite to each other until Christmas, and friends after it."
          : "Learned from the Felds' papers that a third language is a poor place to answer questions in, and found a German speaker for his table after that.",
    },
    {
      person: "elsa",
      kind: "ordinary",
      text: r.has("s:levins-elsa")
        ? "Kept the Levins until the board found them rooms inland, and wrote to Sara Levin for the rest of their lives, chiefly about fish."
        : r.has("s:lis-elsa")
          ? "Kept Lis and Aron Melby until Lis was fit to travel, and knitted for the baby with alarming speed."
          : r.has("s:soup")
            ? "Brought soup to the night shift every evening until November, and never forgave the Lotta corps theirs."
            : "Heard all about it afterwards, and said that if anybody had asked her, there would have been soup.",
    },
    {
      person: "folke",
      kind: "ordinary",
      text:
        r.has("s:folke") && (r.has("s:raa-sent") || r.has("s:at-raa"))
          ? "Sent his bus to Råå in a south-westerly without asking why, and in November sent the Red Cross a bill for the driver's coffee and nothing else."
          : r.has("s:folke")
            ? "Kept a bus and a driver for Märta's telephone calls all that autumn. They argued in November about who would pay, as agreed, and neither of them won."
            : "His buses carried refugees inland for the authorities all that autumn. Märta never did ask him for a run of her own.",
    },
  ];
  return out;
}

function arrivals(r: Read): PersonOutcome[] {
  const hotel = r.has("s:levins-elsa")
    ? "Lived with her family in Mrs Nyström's spare rooms until the welfare board found them rooms inland, and kept Mrs Nyström's household accounts to the öre, which nobody had done for years."
    : r.has("s:levins-inland")
      ? "At a summer hotel inland, empty for the season and full of Danes, from the Thursday after they landed. She kept its accounts for the refugee committee."
      : "Went inland with her family on the Monday bus, to a summer hotel empty for the season and full of Danes, and kept its accounts for the refugee committee.";
  const sara = r.has("s:at-raa")
    ? `Landed at Råå at first light and was met with a kitchen chair. ${r.has("s:sara-waited") ? "She kept Yom Kippur in Helsingborg among strangers who did their best, and went inland to her family on Monday." : "She was with her family the same day, in time for Yom Kippur."}`
    : r.has("s:sara-ruth")
      ? "Sat at Ramlösa under W from Friday to Saturday, and was found by her granddaughter, who reads noticeboards."
      : r.has("s:sara-tray")
        ? "Waited at Ramlösa under W until Tuesday, when Hanna's letter and Märta's tray met at last. She went inland to her family the next day and told everyone at the hotel how the Swedes spell."
        : "Lewin, Sara, 77, on the list from Råå, was Sara Levin. She was with her family the same day, in time for Yom Kippur.";
  const out: PersonOutcome[] = [
    { person: "hanna", kind: "accommodation", text: hotel },
    { person: "david", kind: "safety", text: r.has("s:school") ? "Taught the kings of Denmark in a corner of Märta's gymnasium, and then to Danish children inland, all winter." : "Taught Danish children inland all winter, mostly the kings of Denmark, in order." },
    {
      person: "ruth",
      kind: "safety",
      text: r.has("s:ruth-wrote")
        ? "Wrote her family's name at Märta's table in capitals, underlined twice, and read every list that came in for a week. Märta thought she would make a very good doctor, or a very alarming policewoman."
        : r.has("s:ruth-heard")
          ? "Heard her grandmother's name in a list read aloud at breakfast, under the wrong letter, and was the only person in the room who did."
          : r.has("s:levin-swedish")
            ? "Told Märta on the second day, very politely, that their name was spelled with an I and no accent. Märta corrected every card."
            : "Watched Märta's pen on the quay as if to catch it in a mistake, and did not catch it.",
    },
    { person: "benny", kind: "safety", text: `Asked on the quay whether this was Sweden, and was satisfied with the answer. He slept that first morning in ${room(r)} with his boots on.` },
    { person: "sara", kind: "reunion", text: sara },
    peterFound(r)
      ? { person: "peter", kind: "reunion", text: "Weihl, P., 17, Wien, on a list from Viken, was Peter Weil, who had come over with two boys from the farm. Ruth started playing chess again." }
      : {
          person: "peter",
          kind: "unresolved",
          text: `When this account ends, his card is still open in Märta's box${r.has("s:card-peter") ? ", with every spelling she could think of written under his name" : ""}. ${r.has("s:peter-letter") ? "In November a letter came from the Red Cross: a Peter Weil, seventeen, had landed up the coast and been sent to work on a farm in Skåne." : r.has("s:peter-club") ? "In November somebody wrote under his card on the Danish club's noticeboard, in pencil: on a farm in Skåne, and well." : "In November a postcard came, addressed to the Red Cross table, in careful Danish: he had landed up the coast, and was working on a farm in Skåne, and would someone please tell Ruth."}`,
        },
    {
      person: "klara",
      kind: "safety",
      text: r.has("s:felds-care")
        ? "Answered the box on the form herself, in a clear voice. She and Moritz went inland on the first bus, together, and stayed in Sweden after the war."
        : r.has("s:felds-rest")
          ? "Slept for six hours under a Swedish roof before anyone asked her anything, and answered the box herself that afternoon. She and Moritz stayed in Sweden after the war."
          : "Spent a month untangling papers that called her German and placed her in Berlin, in three languages, and won. She and Moritz stayed in Sweden after the war.",
    },
    { person: "moritz", kind: "safety", text: r.has("s:felds-muddle") ? "Nodded at every question in a third language, and spent the winter putting the answers right. Later he found work with a Swedish bookseller who needed someone who knew German books." : "Gave Märta a pencil from his old bookshop in Berlin. Later he found work with a Swedish bookseller who needed someone who knew German books." },
    { person: "lis", kind: "safety", text: `Her daughter was born in Sweden in December.${r.has("s:lis-elsa") ? " Mrs Nyström was there, and took charge." : r.has("s:lis-hospital") ? " The night sister sent a card." : " Aron sent Märta a photograph."}` },
    {
      person: "aron",
      kind: "safety",
      text: r.has("s:lis-elsa")
        ? "Took in the late Mr Nyström's winter coats for the clothing store, and then, because Mrs Nyström asked, one for her."
        : r.has("s:lis-hospital")
          ? "Spent his first nights in Sweden on a chair in a hospital corridor, and said afterwards that they were the best nights of his life, because of how they ended."
          : "Mended every coat in the clothing pile with a needle the size of a nail, and then started on the volunteers'.",
    },
  ];
  if (r.has("s:skipper")) {
    out.push(
      { person: "anders", kind: "unresolved", text: "Gave his name on the quay and asked hers, and took his boat back across before full light. She never learned his story, and hoped, whenever she heard of a fishing boat from the other side, that it was his." },
      { person: "poul", kind: "unresolved", text: r.has("s:at-raa") ? "Lifted a hand to her from the bow of a boat at Råå on Friday morning. She did not see him again." : "Threw the first line onto the quay before anyone asked. She did not see him again." },
    );
  }
  return [...people(r), ...out];
}

export const ENDINGS: Ending[] = [
  {
    id: "s-every-name",
    title: "Every card answered",
    body: (r) => [
      `By the middle of October every card in your box with your handwriting on it has a second line: found, and where. Not every card in Helsingborg has. Yours have, and you let yourself be proud of that for one evening, and then you go back to marking compositions. ${mus(r)}`,
      ...FINALE,
    ],
    outcomes: arrivals,
  },
  {
    id: "s-one-card",
    title: "One card still open",
    body: (r) => [
      `By the middle of October nearly every card in your box has a second line: found, and where. One has a pencil question mark instead. You carry it in your handbag, so that nobody tidier than you can file it away. ${mus(r)}`,
      "That was how it was for many families that October: safe, and on different lists, and waiting for a letter. Most of the waiting ended in a letter or a knock on the door.",
      ...FINALE,
    ],
    outcomes: arrivals,
  },
  {
    id: "s-worn",
    title: "Doctor's orders",
    body: (r) => [
      "Dr Sjöberg sends you home on Thursday, and comes round on Friday to make sure you went. You sleep for most of a week. Nils brings the lists home every evening and reads them aloud to you, mispronouncing every Danish name on purpose until you correct him from the pillow.",
      `The work goes on without you. That is how you know it was done properly: other people pick up your cards and understand them. ${peterFound(r) ? "Peter Weil's card has its second line." : "Peter Weil's card is still open, and someone else is carrying it now."} ${mus(r)}`,
      ...FINALE,
    ],
    outcomes: arrivals,
  },
];

