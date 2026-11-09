/**
 * The Swedish receiver, chapters 3 and 4: the boat that lands before dawn on
 * Wednesday 6 October, the names, the form, the doctor; then the decision to
 * move the Jewish refugees inland, the night the boats go to Råå, and the
 * list that comes back from there.
 *
 * Fictional simulation parameters:
 *  - In standard mode, if Lis Melby sat wet or waiting on the quay and is
 *    kept on a mattress in the reception rather than in a bed, she worsens
 *    in the night half the time and goes to the hospital after all.
 *  - Sara's name reaches Märta as "Lewin, Sara, 77". Märta matches it to the
 *    Levins through a card with other spellings, through the family hearing
 *    it read aloud, or through Hanna on the telephone; otherwise it waits in
 *    the tray, and the reunion comes days later.
 */
import { at } from "../engine/calendar.ts";
import type { Ctx, Read, Scene } from "../engine/types.ts";
import { FELDS, LEVINS, MELBYS, base, dry, goTo, night, refresh, room, shift, until } from "./receiver-1.ts";

const ARRIVED = [...LEVINS, ...FELDS, ...MELBYS];

/** The Levins are still in Helsingborg, where a list can be read to them. */
export const local = (r: Read) => r.has("s:levins-here") || r.has("s:levins-elsa");

/** Where the Levins are, in Märta's words. */
export function levinsAt(r: Read): string {
  if (r.has("s:levins-elsa")) return "at Mrs Nyström's, ten minutes' walk away";
  if (r.has("s:levins-inland")) return "at a summer hotel inland, since Thursday";
  return `in ${room(r)}`;
}

function clothesLine(r: Read): string {
  const v = r.v("clothes");
  if (v >= 3) return "There are dry things in bundles at your feet.";
  if (v >= 1) return "There is very little left that is dry.";
  return "There is nothing dry left to give anyone.";
}

/** The rest of the night, after the Ternen: the arrivals take beds, and the quay takes it out of you. */
function afterLanding(c: Ctx): void {
  for (const p of ARRIVED) c.move(p, "helsingborg", "safe");
  night(c, "ternen", 24, 30);
  shift(c, 2);
  c.set("s:levins-here");
  c.set("s:felds-here");
  c.pass(30);
  c.go("s-names");
}

/** Everyone from the Ternen goes indoors; Märta sees whoever she knows by now. */
function indoors(c: Ctx): void {
  until(c, at("1943-10-06", 8));
  goTo(c, base(c));
  for (const p of ARRIVED) {
    c.move(p, base(c), "safe");
    if (c.knows(p)) c.learn(p, "saw");
  }
}

function wednesdayNight(c: Ctx): void {
  refresh(c);
  if (c.has("s:rota")) c.say("Your name is not on the rota for Wednesday night. You go home at six and sleep for eleven hours, and dream about spelling.");
  else {
    shift(c, 2);
    c.say("Without a rota there is nobody else down for Wednesday night, so you are.");
  }
  until(c, at("1943-10-07", 10));
  goTo(c, base(c));
  c.go("s-inland");
}

/** Sara's name has been matched to her family's. */
function matched(c: Ctx): void {
  c.set("s:sara-found");
  c.add("found", 1);
}

/** Sara and her family, together again: how depends on where they are. */
function together(c: Ctx): void {
  const fromCamp = c.truth("sara").place === "ramlosa";
  if (c.has("s:levins-here")) {
    c.set("s:sara-here");
    if (fromCamp) c.say(`${c.has("s:ruth-heard") ? "" : "You go and find the Levins yourself, to tell them. "}A Lotta brings Sara up from Ramlösa in the camp lorry, sitting in front, with her stick across her knees.`);
    c.move("sara", base(c), "safe");
    c.say("Benny gets to her first. Ruth gets there second and says, 'They spelled you wrong, Grandmother,' and Sara says the Swedes may spell her however they like, since they have been so kind. David stands with his hand over his mouth and says nothing at all. It is Friday, and at sundown the Day of Atonement begins; Sara has not crossed the Sound, she tells you, to spend it among people who cannot spell her name.");
    c.learn("sara", "saw");
  } else if (c.has("s:levins-elsa")) {
    c.move("sara", "nystrom", "safe");
    c.say("You walk her to Mrs Nyström's yourself. Mrs Nyström and Sara Levin meet in the hallway, among the umbrellas, and are in disagreement about fish within a quarter of an hour. Then Sara explains that at sundown the Day of Atonement begins, and that she will be eating nothing at all until Saturday night, and Mrs Nyström, who has never been told anything of the kind in her own hallway, goes away to think about soup for Saturday night.");
    c.learn("sara", "saw");
  } else {
    c.move("sara", "inland", "safe");
    c.say("She goes inland on the noon bus with a Lotta and a letter. At six Hanna Levin telephones from the hotel to say that Sara has arrived, that she has complained about the bus, and that they are lighting the candles: at sundown the Day of Atonement begins.");
    c.learn("sara", "telephone");
  }
  c.log("Sara Levin is with her family.");
}

/** Friday night into Saturday: the busiest night yet. */
function weekend(c: Ctx): void {
  if (c.has("s:school")) c.set("s:classrooms-back");
  refresh(c);
  night(c, "peak", 30, 40);
  shift(c, 2);
  until(c, at("1943-10-10", 17));
  goTo(c, base(c));
  c.go("s-peak");
}

export const SCENES_2: Scene[] = [
  {
    id: "s-ternen",
    role: "receiver",
    chapter: "Wednesday",
    place: "helsingborg",
    title: "In the night, Wednesday",
    body: (r) => [
      "Wednesday, not yet two in the morning. It has been a long night already: a boat at midnight, and the kettle on the quay filled twice. Now another comes in out of the dark, a fishing boat sitting low in the water, and her skipper brings her alongside so gently that the fenders hardly creak. A tall boy in the bow has a coil of rope over his shoulder, and throws it before anyone asks.",
      "Fourteen people come up the ladder into the lamplight. A family of four: a father with a little boy over his shoulder, a girl of about thirteen with her chin up, a mother counting heads. A couple who speak to each other in German, very low, with one small case between them. A young woman who cannot stand without her husband's arm and is trying very hard to apologize for it.",
      `${r.knows("ivar") ? "Constable Persson" : "The constable"} is handing out the emergency visa slips. ${clothesLine(r)} ${r.has("s:doctor") ? "Dr Sjöberg said any hour." : "You have no doctor of your own to call; the hospital has a night porter."}`,
    ],
    options: [
      {
        id: "care",
        label: "Blankets and dry things first, a doctor for the young woman, and then the names",
        hint: (r) => (r.has("s:doctor") ? "Dr Sjöberg said any hour, and meant it." : "The hospital's porter will find someone, in time."),
        act: (c) => {
          dry(c, "ternen", 3);
          c.say("You kneel to put a blanket round the little boy, who opens one eye and asks, in Danish, whether this is Sweden. It is. He goes back to sleep, satisfied.");
          if (c.has("s:doctor")) {
            c.set("s:lis-seen");
            c.learn("gunnar", "saw");
            c.say("Dr Sjöberg arrives in an overcoat buttoned over what are certainly pyjamas, takes one look at the young woman and sits her on a crate with her head down and his own scarf round her.");
          } else {
            c.set("s:lis-porter");
            c.say("The night porter at the hospital promises a doctor 'directly', which turns out to mean nine o'clock.");
          }
          afterLanding(c);
        },
      },
      {
        id: "names",
        label: "Take the names first, while everyone is still together, and then the blankets",
        hint: "Families come apart between the quay and a bed. Fourteen wet people, waiting in the wind.",
        act: (c) => {
          c.set("s:lis-waited");
          c.add("lists", 1);
          c.add("tired", 1);
          c.say("You take them down family by family, standing, with the wind turning the pages: who belongs to whom, who is missing, who is coming. The young woman's husband holds her up the whole time and does not complain once, which is worse than if he had.");
          dry(c, "ternen", 3);
          c.set(c.has("s:doctor") ? "s:lis-seen" : "s:lis-porter");
          if (c.has("s:doctor")) c.say("When the last name is down you telephone Dr Sjöberg, who is there in twenty minutes, and says nothing about the wait, and looks at the young woman's wet coat in a way that says it for him.");
          afterLanding(c);
        },
      },
      {
        id: "skipper",
        label: "Go down the quay to thank the skipper before he turns back",
        hint: "He has to be out of the harbor before full light. The Lottas can start the blankets, and Persson the names.",
        act: (c) => {
          c.set("s:skipper");
          c.set("s:persson-names");
          c.move("anders", "helsingborg", "travelling");
          c.move("poul", "helsingborg", "travelling");
          c.learn("anders", "saw");
          c.learn("poul", "saw");
          c.say("The skipper is a broad, quiet man of about your own age, with a face that has been out in every kind of weather. He shakes your hand as if he were not sure it was allowed. 'Krogh,' he says. 'Anders. That is my son, Poul.' The tall boy nods from the bow. Then the skipper asks what every skipper will ask you that month: who should he tell people to ask for, on this side? 'Märta,' you say. 'Lindqvist. The Red Cross table.' He repeats it twice, to be sure of the ä, and casts off.");
          c.log("The skipper of the boat was Anders Krogh, with his son Poul. He will tell people to ask for me.");
          c.move("anders", "sound", "at-sea");
          c.move("poul", "sound", "at-sea");
          dry(c, "ternen", 3);
          c.set(c.has("s:doctor") ? "s:lis-seen" : "s:lis-porter");
          afterLanding(c);
        },
      },
    ],
  },
  {
    id: "s-names",
    role: "receiver",
    chapter: "Wednesday",
    place: "helsingborg",
    title: "Names, slowly",
    body: (r) => [
      "The mother of the family sits down across the folding table from you, with the little boy on her lap. She has the look of someone who keeps accounts: she is already reading your columns upside down. 'Märta,' you say, pointing at yourself, because it seems the right way to begin. 'Names, please, and slowly. Danish names have letters we spell differently.'",
      "She gives them in order. Hanna. David, her husband, a teacher. Ruth, thirteen. Benjamin, five, called Benny. Then, before you can write the surname, two people who are not here: David's mother, Sara, seventy-seven, who stayed behind with friends and will cross when they can bring her; and a boy called Peter Weil, seventeen, from Vienna, who works on a farm in Zealand and has not been heard from for days.",
      r.has("s:persson-names")
        ? "Constable Persson started a sheet while you were down the quay. At the top of it, in his square police capitals, it says LEVÉN, with an accent on the e, as if they were Swedish."
        : "The girl, Ruth, watches your pen as though she means to catch it making a mistake.",
    ],
    options: [
      {
        id: "spell",
        label: "Ask her to spell every name, write it in capitals and read it back; make cards for Sara and Peter with every other spelling you can think of",
        hint: "Ten minutes more, with the others waiting. The lists are how people find each other here.",
        act: (c) => {
          c.set("s:levin-right");
          c.set("s:card-sara");
          c.set("s:card-peter");
          if (c.v("tired") < 6) c.add("lists", 1);
          c.add("tired", 1);
          meetLevins(c);
          c.say(`L-E-V-I-N. With a V. You write it in capitals and read it back, and Ruth nods once, satisfied.${c.has("s:persson-names") ? " You cross out Persson's LEVÉN, gently, and he pretends not to mind." : ""} On a fresh card: LEVIN, Sara, 77, Copenhagen; also LEWIN, LÖWIN, LEVINE. On another: WEIL, Peter, 17, from Vienna, a farm in Zealand; also WEILL, VEIL. Ruth and Benny go on their parents' sheet, as children under sixteen do. Ruth says this is unjust. You agree, and do it anyway.`);
          c.log("Registered the Levin family. Cards for Sara Levin, 77, and Peter Weil, 17, with other spellings.");
          c.pass(50);
          indoors(c);
          c.go("s-felds");
        },
      },
      {
        id: "ruth",
        label: "Hand the pen to the girl, who is watching it, and let her write her family's names herself",
        hint: "She is thirteen and furious with the world. She will spell them right, and she will want to do more.",
        act: (c) => {
          c.set("s:levin-right");
          c.set("s:ruth-wrote");
          c.set("s:sara-noted");
          meetLevins(c);
          c.say(`Ruth takes the pen as if she had been waiting all her life for somebody to offer it. LEVIN, in capitals, underlined twice.${c.has("s:persson-names") ? " She looks at Persson's sheet, and then at Persson, and he hands it over without a word." : ""} Then her grandmother and Peter, on cards of her own, in a hand so neat you could frame it. She asks what the other columns are for. By the time you have explained, she has filled them in, and asked whether she may come back and help.`);
          c.log("Ruth Levin wrote her family's names herself. She wants to help at the table.");
          c.pass(30);
          indoors(c);
          c.go("s-felds");
        },
      },
      {
        id: "quick",
        label: (r) => (r.has("s:persson-names") ? "Let Persson's sheet stand and move on: there are ten more people waiting" : "Write what you hear and move on: there are ten more people waiting"),
        hint: (r) => (r.has("s:persson-names") ? "It says LEVÉN. It would be quicker to put it right later." : "Quicker. A Swedish ear may not catch a Danish name."),
        act: (c) => {
          c.set("s:levin-swedish");
          c.set("s:sara-noted");
          meetLevins(c);
          c.say(c.has("s:persson-names") ? "You leave Persson's LEVÉN where it is and add the missing two underneath: grandmother, Sara, coming later; a friend, Peter, a boy. Hanna Levin opens her mouth to say something about the spelling, looks at the queue behind her, and closes it again." : "LEVÉN, you write, the way it sounds to you, and Hanna Levin opens her mouth to correct it, looks at the queue behind her, and closes it again. Under the family you write: grandmother, Sara, coming later; a friend, Peter, a boy.");
          c.pass(15);
          indoors(c);
          c.go("s-felds");
        },
      },
    ],
  },
  {
    id: "s-felds",
    role: "receiver",
    chapter: "Wednesday",
    place: "reception",
    title: "The box on the form",
    body: (r) => [
      `By eight the fourteen are in ${room(r)} with soup inside them${r.has("s:soup") ? ", Mrs Nyström's, which she brought round herself in a bucket with a lid" : ""}. Constable Persson has set up at the end of your table with the police forms, which are longer than yours and have boxes: name, born where and when, occupation, address, money brought. He is not unkind. He is thorough, and he has been told the forms must be complete.`,
      "The German-speaking couple from the boat are next: Klara and Moritz Feld. They came to Copenhagen from Berlin in 1938, Mr Feld says, in a careful Danish that runs out after the second sentence. Mrs Feld keeps her hands folded on the table, very tightly, as if they might otherwise do something on their own.",
      "Among the printed boxes is one with a single word beside it: Jude. Yes or no. It is the Swedish word. It is also the German one. Mr Feld reads it upside down across the table, and stops in the middle of a sentence.",
    ],
    options: [
      {
        id: "sit",
        label: "Sit down with them, put every question into German yourself, and tell them plainly what you know the form is for here",
        hint: "Your school German is rusty, but honest. It will take an hour you don't have, and they will understand everything they sign.",
        act: (c) => {
          c.set("s:felds-care");
          c.set("s:persson-ok");
          c.add("lists", 1);
          c.add("tired", 1);
          meetFelds(c);
          c.say("You pull up a chair and take the questions one at a time, in your classroom German, slowly. When you reach the box you tell them what you know: here, this paper is for finding them a bed, and help, and the right to stay. What the board in Stockholm does with every answer, you do not know, and you say so. Mrs Feld asks you to read the word aloud. Then she answers it herself, in a clear voice: ja. Persson writes it down and, after a moment, thanks her.");
          c.log("Helped Klara and Moritz Feld with the police form, in German.");
          c.pass(60);
          c.go("s-lis");
        },
      },
      {
        id: "later",
        label: "Ask Persson to leave their forms until the afternoon, when an interpreter is due, and let them sleep",
        hint: "They have not slept for two nights. Persson does not like a form left half done.",
        act: (c) => {
          c.set("s:felds-rest");
          c.set("s:persson-cross");
          meetFelds(c);
          c.say(`Persson closes his folder with the air of a man who will remember this. The Felds sleep for six hours in ${room(c)}, with their shoes side by side. In the afternoon a Lotta who grew up in Hamburg goes through the form with them, and Mrs Feld answers the box herself.`);
          c.pass(15);
          c.go("s-lis");
        },
      },
      {
        id: "danish",
        label: "Let Mr Feld manage in his careful Danish; Persson is patient, and you are needed at the door",
        hint: "Quicker. Some words are hard in a third language, and 'nationality' is one of them.",
        act: (c) => {
          c.set("s:felds-muddle");
          meetFelds(c);
          c.say("You leave them to it. When you look back, Persson is writing steadily and Mr Feld is nodding at everything, the way people nod in a third language. Later you see the sheet: nationality, German, which is not what Mr Feld would have said; an address in Berlin five years out of date. The box has been answered for them.");
          c.pass(20);
          c.go("s-lis");
        },
      },
    ],
  },
  {
    id: "s-lis",
    role: "receiver",
    chapter: "Wednesday",
    place: "reception",
    title: "Dr Sjöberg",
    body: (r) => [
      r.has("s:lis-seen")
        ? "Dr Sjöberg has been in the building since six, listening to chests and looking down throats, brisk and kind and apologizing to nobody."
        : "The doctor the hospital promised turns out to be Dr Sjöberg himself, at nine, who says that next time you should telephone him directly and not wake a porter.",
      "The young woman from the boat is Lis Melby. She is expecting a child in December. She was sick the whole crossing, and since the landing she has had pains that frighten her more than the sea did. Her husband Aron, a furrier with large careful hands, has not let go of her coat. Lis is not Jewish, he says, as if it needed explaining; she could have stayed. Lis says she has heard quite enough about what she could have done.",
      `Dr Sjöberg listens, and presses, and asks questions in Swedish that she answers in Danish, and straightens up. ${r.has("s:lis-waited") || r.has("s:wet-ternen") ? "She sat too long on the quay in wet clothes, and he does not like that. " : ""}Rest, warmth, something to drink, and someone watching her for a day or two. Where is up to you.`,
    ],
    options: [
      {
        id: "hospital",
        label: "The hospital, for a night or two, and Aron as near to her as they will let him be",
        hint: "The safest place for her. They would be apart at night, and Aron hates the idea already.",
        act: (c) => {
          c.set("s:lis-hospital");
          for (const p of MELBYS) c.move(p, "hospital-se", "safe");
          meetMelbys(c);
          c.say("The night sister, who has seen husbands before, finds Aron a chair in the corridor outside the ward and pretends all night not to see him in it. Lis sleeps for fourteen hours. In the morning the pains have stopped and she is cross about the porridge, which Dr Sjöberg says is an excellent sign.");
          c.log("Lis Melby is in the hospital for a night or two. Aron is in the corridor.");
          wednesdayNight(c);
        },
      },
      {
        id: "elsa",
        label: "Mrs Nyström's spare room, the two of them together, with Dr Sjöberg calling twice a day",
        show: (r) => r.has("s:elsa-rooms"),
        hint: "A real bed, a kitchen, and Mrs Nyström, all at once. They would be together.",
        act: (c) => {
          c.set("s:lis-elsa");
          c.add("clothes", 2);
          for (const p of MELBYS) c.move(p, "nystrom", "safe");
          meetMelbys(c);
          c.say("Mrs Nyström puts Lis to bed in the room with the good eiderdown and Aron in the armchair beside it, and feeds them both until they beg her to stop. By evening Aron has found her late husband's winter coats in the wardrobe and is taking them in at the seams for whoever needs them next. 'He would have liked that,' Mrs Nyström says. 'He never liked anyone else.'");
          c.log("Lis and Aron Melby are at Mrs Nyström's.");
          wednesdayNight(c);
        },
      },
      {
        id: "here",
        label: "A mattress in a quiet corner here, where you can keep an eye on her yourself",
        hint: "They stay together, and close. You have forty other people to keep an eye on as well.",
        act: (c) => {
          c.set("s:lis-here");
          c.add("tired", 1);
          c.add("clothes", 1);
          for (const p of MELBYS) c.move(p, base(c), "safe");
          meetMelbys(c);
          c.say(`You make up a corner with two mattresses and ${c.has("s:school") ? "a screen borrowed from the school nurse's room" : "a clothes horse hung with blankets for a screen"}. Aron, who cannot sit still, mends every coat in the clothing pile that needs it, with a needle the size of a nail.`);
          const worse = c.mode === "standard" && (c.has("s:lis-waited") || c.has("s:wet-ternen")) && c.roll("lis-night", 0.5);
          if (worse) {
            c.unset("s:lis-here");
            c.set("s:lis-hospital");
            c.set("s:lis-worse");
            c.add("tired", 1);
            for (const p of MELBYS) c.move(p, "hospital-se", "safe");
            c.learn("lis", "saw");
            c.learn("aron", "saw");
            c.say("At two in the morning the pains come back. Dr Sjöberg comes in his overcoat and takes her to the hospital himself, with Aron in the back of the car holding her hand. By morning she is all right. You are not, for a while.");
          } else c.say("Lis sleeps behind the screen most of the day, and so, eventually, does Aron.");
          wednesdayNight(c);
        },
      },
    ],
  },
  {
    id: "s-inland",
    role: "receiver",
    chapter: "Inland",
    place: "reception",
    title: "Away from the coast",
    body: (r) => [
      "On Thursday morning Constable Persson comes in with a paper from the office of the police superintendent, Friberg, who is organizing the town's reception. The welfare authorities have decided that the Jewish refugees from Denmark are to be moved away from the coastal districts: inland, to camps and hotels, wherever the board in Stockholm finds room. Buses this afternoon, and more tomorrow.",
      `People from the Jewish community in Stockholm have come down too, with money for the relief committees, and want to know what you need. You say: socks, and shoes for children, and a bus of your own. They write it all down, which you find you like in a person.${r.has("s:school") ? " In a corner of the gymnasium David Levin has been teaching the children the kings of Denmark in order, and three Swedish children who came to stare now know them as well." : ""}`,
      "Hanna Levin finds you by the door. Every morning she has asked whether a list has come in from anywhere with her mother-in-law's name on it. If the family goes inland today, she says, how will Sara find them? She asks it the way someone who keeps accounts would: as a question of which page the entry goes on.",
    ],
    options: [
      {
        id: "later",
        label: "Ask Persson to put the families who are waiting for relatives on the later buses",
        needs: (r) => (r.has("s:persson-cross") ? "Persson is still sore about the form you left half done yesterday. He will not bend his list for you this week." : null),
        hint: "He can bend the order of the list, if not the order itself.",
        act: (c) => {
          c.set("s:levins-stay");
          c.say(`Persson looks at Hanna Levin, and at his list, and moves a line with a ruler. 'Monday,' he says. 'Not later than Monday.' Hanna thanks him in Danish, and then in careful Swedish, which makes him go red to the ears.${c.has("s:persson-ok") ? " On his way out he tells you, not looking at you, that the Felds' form was the best-kept form he has seen all week." : ""}`);
          c.log("The Levins may wait in Helsingborg until Monday.");
          inland(c);
        },
      },
      {
        id: "elsa",
        label: "Ask Mrs Nyström to take the Levins in as her own guests, until the board decides",
        show: (r) => r.has("s:elsa-rooms"),
        needs: (r) => (r.has("s:lis-elsa") ? "Lis and Aron Melby already have her spare rooms." : null),
        hint: "People with Swedish hosts may stay with them for now. She would feed them to within an inch of their lives.",
        act: (c) => {
          c.set("s:levins-elsa");
          c.unset("s:levins-here");
          for (const p of LEVINS) c.move(p, "nystrom", "safe");
          for (const p of LEVINS) c.learn(p, "saw");
          c.say("Mrs Nyström arrives at the door in her hat within the hour, inspects the Levins as if they were a delivery, and approves of them. Benny is carried off on her arm, already eating something.");
          c.log("The Levins are staying with Mrs Nyström.");
          inland(c);
        },
      },
      {
        id: "go",
        label: "Let them go on this afternoon's bus, and write the hotel's address on every card, theirs and Sara's",
        hint: "It frees four beds for tonight. Sara's card would have to do the rest.",
        act: (c) => {
          c.set("s:levins-inland");
          c.unset("s:levins-here");
          for (const p of LEVINS) c.move(p, "inland", "safe");
          for (const p of LEVINS) c.hear(p, "inland", "safe", "the bus list");
          c.say("The bus is one of Folke Berg's, with a driver who has been up since four. Hanna Levin sits by the window with Benny on her knee and does not take her eyes off you until the bus turns the corner. On Sara's card, under the family's name, you write the name of a summer hotel inland, in capitals, twice.");
          c.log("The Levins have gone inland, to a summer hotel. Its address is on Sara's card.");
          inland(c);
        },
      },
    ],
  },
  {
    id: "s-raa",
    role: "receiver",
    chapter: "Inland",
    place: "reception",
    title: "The wind goes round",
    body: (r) => [
      "On Thursday evening the wind goes round into the south-west and gets up, and the Sound, grey all day, goes white along its edges.",
      "Nils telephones from the harbor office, where he has been on late duty all week. The inner harbor is crowded with boats that came in last night and have not gone back, and in this sea nobody wants to try the harbor mouth in the dark. The talk on the quay is that tonight's boats will run south for Råå, where the harbor is small and the fishermen's wives are already putting the kettles on.",
      `Råå has its own constable, its own kettles and its own way of spelling. Your quay will be quiet tonight. ${r.v("bus") > 0 ? "Folke's bus is in his yard, with a driver who owes you nothing and says so cheerfully." : "You have no bus of your own to send anywhere."}`,
    ],
    options: [
      {
        id: "send",
        label: "Send Folke's bus to Råå with blankets and dry clothes; stay at your table, and ask the Råå constable to telephone his list at first light",
        needs: (r) => (r.v("bus") < 1 ? "You have no bus of your own to send." : r.v("clothes") < 2 ? "You have nothing dry left to send." : null),
        hint: "The dry things go where the people are. You would see the names only on paper.",
        act: (c) => {
          c.set("s:raa-sent");
          c.set("s:raa-list");
          c.add("bus", -1);
          c.add("clothes", -2);
          shift(c, 1);
          c.say("Folke's driver goes south at ten with the bus full of blankets, and comes back at dawn full of people wrapped in them, who have been given hot drinks by half of Råå. You spend the night at your table with very little to do, which is its own kind of tiring.");
          toFriday(c, at("1943-10-08", 7));
        },
      },
      {
        id: "go",
        label: "Go down to Råå yourself on Folke's bus, with everything dry you have",
        needs: (r) => (r.v("bus") < 1 ? "You have no bus of your own to take." : null),
        hint: "A cold night on a strange quay. You would see every face, and spell every name.",
        act: (c) => {
          c.set("s:at-raa");
          c.add("bus", -1);
          c.add("clothes", -Math.min(2, c.v("clothes")));
          c.add("tired", 2);
          goTo(c, "raa");
          until(c, at("1943-10-08", 6, 15));
          c.move("sara", "raa", "safe");
          c.learn("sara", "saw");
          matched(c);
          c.say("You wait all night in a fisherman's kitchen with the kettle and the fisherman's wife. At first light a boat comes in under the low shore, soaked to the gunwales, and among the people helped up onto the stones is an old woman with a stick and a folding stool, who looks at the quay as if it had been built to the wrong specifications. You fetch a kitchen chair from the nearest house and carry it down to her. She sits on it as if it were the least the Swedish government could do.");
          c.say(`'Levin,' she says, before you can ask. 'With a V. My son is a teacher; he will have spelled it for you properly.'${c.has("s:levin-swedish") ? " He did, and you did not; you will put that right this morning." : ""} Her son's family landed on Wednesday, you tell her, and they are ${levinsAt(c)}. She closes her eyes for a moment. Then she asks whether there is coffee in Sweden, or only this.`);
          if (c.has("s:skipper")) {
            c.move("poul", "raa", "travelling");
            c.learn("poul", "saw");
            c.say("In the boat's bow is the tall boy with the rope from Wednesday. He sees you, and lifts a hand.");
          }
          c.log("Sara Levin landed at Råå at first light. I wrote her name down myself.");
          c.move("sara", base(c), "safe");
          toFriday(c, at("1943-10-08", 7));
        },
      },
      {
        id: "stay",
        label: "Stay at your table, and ask the Råå constable to telephone his list in the morning",
        hint: "Råå's people know their business. You would keep the bus, and the dry things, for tomorrow.",
        act: (c) => {
          c.set("s:raa-list");
          shift(c, 1);
          c.say("The constable at Råå, when you get through, sounds like a man who has been asked to spell things all week. He will telephone his list as soon as the exchange opens. You spend the night at your table, with the wind in the windows and very little to do.");
          toFriday(c, at("1943-10-08", 7));
        },
      },
      {
        id: "sleep",
        label: "Go home and sleep: tonight is Råå's night",
        hint: "You have not slept a whole night since Saturday. The list from Råå would come up by the post.",
        act: (c) => {
          c.set("s:raa-post");
          c.add("tired", -2);
          goTo(c, "lindqvist");
          c.learn("nils", "saw");
          c.say("You sleep for nine hours without moving. Nils says you snored, which you deny, and that the wind took a slate off the Ekbergs' roof, which is true.");
          toFriday(c, at("1943-10-08", 12, 30));
        },
      },
    ],
  },
  {
    id: "s-sara",
    role: "receiver",
    chapter: "Inland",
    place: "reception",
    title: "Lewin, Sara, 77",
    body: (r) =>
      r.has("s:at-raa")
        ? [
            "You came back from Råå at seven in Folke's bus, with nineteen people wrapped in blankets and an old woman in the front seat who told the driver how to take the corners. The fisherman's wife gave her a jumper for the journey, knitted for a much larger fisherman, and she wore it over her good black coat with the sleeves turned back three times, and said it was very kind and very ugly.",
            `Sara Levin is asleep now on a mattress in ${room(r)}, with her shoes side by side and her stick within reach. ${r.has("s:levins-here") ? "Her family is asleep at the other end of the room, and does not know yet." : `Her family is ${levinsAt(r)}.`} On the bus she asked you what day it was. Friday, you said. Then she had come just in time, she said, and would explain later, and went to sleep.`,
            "On the Råå constable's list, which he gave you to carry up, she is written LEWIN. You have put it right in pencil, and initialled the correction, the way you would in a school register.",
          ]
        : [
            r.has("s:raa-post")
              ? "The list from Råå comes up with the midday post on Friday, in pencil, on the back of a fish merchant's invoice."
              : "At seven on Friday morning the telephone rings: the constable at Råå, reading his night's list in a slow, patient voice while you write it down. Twenty-two names, landed at first light.",
            `Halfway down: Lewin, Sara, 77, Copenhagen.${r.has("s:raa-sent") ? " Folke's bus took her up to Ramlösa with the others, in a fisherman's jumper." : " She has been taken up to Ramlösa with the others."}`,
            `There are perhaps a thousand cards in Helsingborg by now, and three spellings of every second name. The Levins are ${levinsAt(r)}${r.has("s:levin-swedish") ? ", written down in your own book as LEVÉN" : ""}. It is Friday, the eighth of October.`,
          ],
    options: [
      {
        id: "cards",
        label: "Look the name up in your card box, under every spelling",
        show: (r) => !r.has("s:at-raa"),
        needs: (r) => (r.has("s:cards") || r.has("s:card-sara") ? null : "You have no index of other spellings, and no card for anyone called Lewin."),
        hint: "This is what the cards were for.",
        act: (c) => {
          matched(c);
          c.say(
            c.has("s:card-sara")
              ? "LEWIN: see LEVIN. The card is in your own handwriting, from Wednesday morning, and it has been waiting for this."
              : "Under L there is no Lewin, and no Levin either: only your own LEVÉN from Wednesday, with an empty line beneath it for other spellings. You look at it for a long moment, and say the two names aloud, and hear that they are the same.",
          );
          if (c.has("s:levins-inland")) c.say("You telephone the hotel inland, and Hanna Levin says yes before you have finished the name.");
          together(c);
          weekend(c);
        },
      },
      {
        id: "aloud",
        label: (r) => (r.has("s:levins-elsa") ? "Take the list round to Mrs Nyström's and read it to the Levins over breakfast" : "Read the list aloud at breakfast, slowly, to everyone"),
        show: (r) => !r.has("s:at-raa") && local(r),
        hint: (r) => (r.has("s:ruth-wrote") ? "Ruth Levin has been helping at your table since Wednesday. She listens to every list." : "Someone may know a name you don't."),
        act: (c) => {
          c.set("s:ruth-heard");
          matched(c);
          c.say("You are four names in when Ruth Levin stands up so fast that her chair goes over. 'That's Grandmother,' she says. 'They've spelled her wrong.'");
          together(c);
          weekend(c);
        },
      },
      {
        id: "phone",
        label: "Telephone the hotel inland and read the list to Hanna Levin",
        show: (r) => !r.has("s:at-raa") && r.has("s:levins-inland"),
        needs: (r) => (r.v("lists") >= 2 ? null : "You wrote the hotel's number down somewhere, but your lists are in such a muddle that you cannot find it."),
        hint: "If anyone knows her own mother-in-law under any spelling, it is Hanna.",
        act: (c) => {
          matched(c);
          c.say("Hanna Levin comes to the hotel's telephone out of breath. You read her the list from the top. At the seventh name she stops you, and says nothing for a moment, and then says, in a bookkeeper's voice, 'That is a W where there should be a V.'");
          together(c);
          weekend(c);
        },
      },
      {
        id: "tray",
        label: "Put the list in the tray with the others: there are twenty-one other names on it to see to",
        show: (r) => !r.has("s:at-raa"),
        hint: "There will be time this afternoon. There is never time this afternoon.",
        act: (c) => {
          c.set("s:sara-late");
          c.hear("sara", null, "unknown", "nobody");
          c.say("You put it in the tray. By the afternoon the tray is a hand deep, and by the evening two hands. On Friday evening at Ramlösa an old woman sits on a camp bed among strangers, with her stick across her knees, and lights a candle that a Lotta has found for her.");
          weekend(c);
        },
      },
      {
        id: "bring",
        label: (r) => (local(r) ? "Wake her gently and take her to her family before breakfast" : "Telephone the hotel inland, and put her on the noon bus with a letter for her family"),
        show: (r) => r.has("s:at-raa"),
        hint: (r) => (local(r) ? "They have waited since Wednesday." : "She would be with them by evening."),
        act: (c) => {
          c.set("s:sara-early");
          c.say("She wakes at once, as if she had only been resting her eyes, and asks where her shoes are, although they are next to her.");
          together(c);
          weekend(c);
        },
      },
      {
        id: "rest",
        label: (r) => (local(r) ? "Let her sleep, and send word to her family to come to her" : "Let her sleep today, telephone the hotel, and send her inland on Monday's bus"),
        show: (r) => r.has("s:at-raa"),
        hint: (r) => (local(r) ? "She is seventy-seven and has been up all night. They are a few minutes away." : "She would rest first, and they would know she is safe. They would wait three more days to see her."),
        act: (c) => {
          c.set("s:sara-slept");
          if (local(c)) {
            c.pass(4 * 60);
            c.say("You let her sleep until eleven, and when she opens her eyes her family is standing round her mattress, which she says is a very inconsiderate way to wake anyone.");
            if (c.has("s:levins-elsa")) c.say("Then she insists on walking to Mrs Nyström's on her own two feet, with her stick, and her grandson carrying the folding stool.");
            together(c);
          } else {
            c.set("s:sara-monday");
            c.set("s:sara-waited");
            c.learn("sara", "saw");
            c.say("Hanna Levin, on the telephone, is silent for so long that you think the line has gone. Then she thanks you, and asks you to tell Sara that they will light the candles at the same time, there and in Helsingborg, because at sundown the Day of Atonement begins. You find two candles, and a Lotta finds a third, and at sundown Sara lights them on a borrowed table in a borrowed shawl, and does not need anyone to tell her the words.");
            c.log("Sara Levin is resting in Helsingborg. She goes inland to her family on Monday.");
          }
          weekend(c);
        },
      },
    ],
  },
];

function meetLevins(c: Ctx): void {
  for (const p of LEVINS) c.learn(p, "saw");
  c.hear("sara", "copenhagen", "hidden", "Hanna");
  c.hear("peter", null, "unknown", "Hanna");
}

function meetFelds(c: Ctx): void {
  for (const p of FELDS) c.learn(p, "saw");
}

function meetMelbys(c: Ctx): void {
  c.learn("gunnar", "saw");
  for (const p of MELBYS) c.learn(p, "saw");
}

/** Thursday afternoon: the buses inland. */
function inland(c: Ctx): void {
  c.add("clothes", 2);
  c.unset("s:felds-here");
  for (const p of FELDS) c.move(p, "inland", "safe");
  if (c.has("s:felds-muddle")) {
    for (const p of FELDS) c.hear(p, "sweden", "safe", "another list");
    c.say("The Felds go on a different bus from the other Danish families, because their papers say German. Nobody can tell you where it is going, except inland.");
  } else {
    for (const p of FELDS) c.learn(p, "the bus list");
    c.say("The Felds go on the first bus. Mr Feld shakes your hand and gives you, as payment for nothing, a pencil with a bookshop's name on it, from Berlin.");
  }
  refresh(c);
  until(c, at("1943-10-07", 21));
  c.go("s-raa");
}

function toFriday(c: Ctx, t: number): void {
  if (!c.has("s:at-raa")) {
    c.move("sara", "raa", "safe");
    c.move("sara", "ramlosa", "safe");
  }
  until(c, t);
  goTo(c, base(c));
  c.go("s-sara");
}
