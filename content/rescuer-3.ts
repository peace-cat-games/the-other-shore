/**
 * The Danish rescuer, chapters 6 and 7: after Gilleleje, the old woman with
 * the folding stool, and what Anders does next.
 *
 * Fictional parameter: in standard mode only, with two or more ignored
 * warnings (r:risk-*), the Gestapo may be waiting when he comes home:
 * 25% with two, 50% with three or more. His passengers are already safe in
 * Sweden. Helpers who were caught were handed to the Danish police; the
 * law allowed up to three months' prison, and many cases were dropped
 * (docs/history/denmark.md §5).
 */
import type { Ctx, Ending, PersonOutcome, Read, Scene } from "../engine/types.ts";
import { boardPassengers, cross } from "./rescuer-1.ts";

const RISKS = ["r:risk-talk", "r:risk-nosignal", "r:risk-warning", "r:risk-harbor"];
const risk = (r: Read) => RISKS.filter((f) => r.has(f)).length;

export const R_SCENES_3: Scene[] = [
  {
    id: "r-gilleleje",
    role: "rescuer",
    chapter: "After Gilleleje",
    place: "kroghouse",
    title: "News from up the coast",
    body: (r) => [
      "Thursday morning the news comes down the coast faster than any boat: in Gilleleje the harbor was so crowded with people waiting that the coast police closed it, and last night the Gestapo came for those hidden in the church loft. More than a hundred taken, they say, in one night. Someone told.",
      `Inger sets the coffee pot down too hard. ${r.has("r:poul-weather") ? "Poul says nothing; he has been reading the sky all morning and you know he means to go out again tonight." : "Poul says they cannot stop now."} The doctor has a group for tonight: some families, and an old woman from Copenhagen who has, the doctor says, very definite views.`,
      r.has("r:warned") ? "You remember what the Swedish constable said: it is the Gestapo from Helsingør, working from tips." : "Everyone knows whose men they were: the Gestapo from Helsingør.",
    ],
    options: [
      {
        id: "careful",
        label: "Go on tonight, but change the beach and ask the police for word before you sail",
        hint: "More work, and fewer surprises.",
        act: (c) => {
          c.set("r:careful");
          c.say("You and the doctor pick another stretch of beach, a little south, where the trees come down close. Constable Rasmussen agrees to have a boy bring word if any cars come along the road. Inger says that if anything happens to Poul she will drown you herself.");
          c.pass(10 * 60);
          c.go("r-board3");
        },
      },
      {
        id: "viggo",
        label: "First, have a hard word with Viggo about keeping his mouth shut",
        show: (r) => r.has("r:risk-talk"),
        hint: "Half the coast talks to Viggo, and Viggo talks to the other half.",
        act: (c) => {
          c.unset("r:risk-talk");
          c.learn("viggo", "saw");
          c.say("You find Viggo mending a net and tell him what happened in Gilleleje, and that the next man to talk might be talking about him. He goes quiet. 'I take their money,' he says at last. 'I don't sell them.' You believe him, and you believe he has been talking too much. So, you think, have you.");
          c.pass(10 * 60);
          c.go("r-board3");
        },
      },
      {
        id: "poul",
        label: "Send Poul to his aunt inland for a while; take Holger as crew instead",
        hint: "Your son out of it. Holger is slow on the oars and very good with engines.",
        act: (c) => {
          c.set("r:poul-away");
          c.move("poul", "zealand", "home");
          c.learn("poul", "saw");
          c.learn("holger", "saw");
          c.say("Poul argues for an hour and then goes, white with fury, on the afternoon bus. Holger arrives at dusk in his old jersey and says he has not rowed a boat in twelve years and is looking forward to it.");
          c.pass(10 * 60);
          c.go("r-board3");
        },
      },
      {
        id: "pause",
        label: "Stay in tonight. Let the coast go quiet for a day",
        hint: "Safer, perhaps. The people waiting wait one more night.",
        act: (c) => {
          c.set("r:paused");
          c.add("tired", -3);
          c.say("You send word to the doctor. She takes it without complaint, but you know there are people in summer houses and lofts who will spend another night listening to every car on the road. On Friday the coast is quiet, and you go.");
          c.pass(34 * 60);
          c.go("r-board3");
        },
      },
    ],
  },
  {
    id: "r-board3",
    role: "rescuer",
    chapter: "After Gilleleje",
    place: "beach",
    title: "The folding stool",
    body: (r) => [
      `${r.has("r:paused") ? "Friday" : "Thursday"} night, and the wind has gone round to the south-west and freshened. The Sound is lumpy and grey under a sky with no stars.`,
      "The doctor's people bring down a dozen, among them an old woman in a good black coat, walking with a stick in one hand and a folding stool in the other. She is accompanied as far as the water by a firm woman in a parson's widow's hat, who kisses her on both cheeks and goes back up the bank without looking round.",
      "The old woman looks at the shingle, the dark water and the rowing boat, and then at you. 'Young man,' she says, 'I am seventy-seven, and I would like a chair.'",
      r.has("r:poul-away") ? "Holger, at the oars, says the jetty would be easier for her." : "Poul, at the oars, says the jetty would be easier for her.",
    ],
    options: [
      {
        id: "carry",
        label: "Carry her down to the boat yourself, stool and all",
        hint: "The dark beach, as always.",
        act: (c) => {
          c.set("r:carried-her");
          c.move("sara", "beach", "travelling");
          c.learn("sara", "saw");
          c.say("She weighs about as much as a wet net and says, as you wade out with her, that you are holding her like a sack of potatoes and that her late husband held her better at their wedding. Her name, she informs you from the rowing boat, is Sara.");
          board3(c);
        },
      },
      {
        id: "jetty",
        label: "Bring the Ternen into the jetty so she needn't wade",
        hint: "Easier for her. The jetty can be seen from the road.",
        act: (c) => {
          c.set("r:risk-harbor");
          c.move("sara", "beach", "travelling");
          c.learn("sara", "saw");
          c.say("You bring the boat in alongside the little jetty and hand her down onto the deck like a duchess. She approves. Anyone on the coast road with a pair of eyes could have watched you do it. Her name, she says, is Sara.");
          board3(c);
        },
      },
      {
        id: "wait",
        label: "Wait an hour for the wind to drop before you take anyone aboard",
        hint: "A calmer crossing for an old woman, if the wind obliges. An hour longer on the beach for everyone.",
        act: (c) => {
          c.add("tired", 1);
          c.pass(60);
          c.move("sara", "beach", "travelling");
          c.learn("sara", "saw");
          c.say("The wind does not drop, much. But the waiting gives you time to make a seat of fish boxes and sacking in the hold for the old woman, who tries it, pronounces it a chair, and tells you her name is Sara.");
          board3(c);
        },
      },
    ],
  },
  {
    id: "r-raa",
    role: "rescuer",
    chapter: "After Gilleleje",
    place: "raa",
    title: "Råå",
    body: (r) => [
      "The south-westerly pushes you north and you fight it all the way. Helsingborg's harbor is full of lights and boats, and in this sea you will not get in safely. You run south instead for the little harbor at Råå and come in at first light, soaked to the skin.",
      "Swedish fishermen take your lines. A local policeman arrives on a bicycle, buttoning his coat. Somebody brings a real chair for Sara, who sits on it on the quay like a queen receiving a delegation.",
      r.has("r:knows-levin") ? "Levin, she said her name was. You have heard that name before this week: a woman called Hanna, spelling it twice on the quay at Helsingborg." : "The policeman is writing down names, and making a hash of the Danish ones.",
    ],
    options: [
      {
        id: "spell",
        label: "Tell the policeman: Levin, with a V. Her family landed at Helsingborg on Wednesday",
        show: (r) => r.has("r:knows-levin"),
        hint: "You know something that will save them days.",
        act: (c) => {
          c.set("r:sara-spelled");
          c.say("The policeman writes LEVIN in capitals, underlines it, and promises to telephone Helsingborg as soon as the exchange opens. Sara looks at you properly for the first time. 'You took my son across,' she says. It is not a question. You say you do not discuss your passengers. She says that is the correct answer and pats your hand.");
          home3(c);
        },
      },
      {
        id: "warm",
        label: "See the passengers into the warm, and let the Swedes do their work",
        hint: "They know what to do. You have to get home.",
        act: (c) => {
          c.say("The policeman writes her down as LEWIN, Sara, 77, which is near enough, and someone takes her off to a fisherman's kitchen. She waves her stick at you from the door.");
          home3(c);
        },
      },
      {
        id: "phone",
        label: "Ask the fishermen to telephone Helsingborg so the names reach the lists there",
        hint: "A small thing. Lists are how people find each other.",
        act: (c) => {
          c.set("r:phoned");
          c.say("A fisherman's wife makes the call herself, reading the names off the policeman's sheet in a loud clear voice. Somewhere in Helsingborg, she tells you, they are keeping lists of everyone who lands anywhere on this coast.");
          home3(c);
        },
      },
    ],
  },
  {
    id: "r-decide",
    role: "rescuer",
    chapter: "What comes next",
    place: "kroghouse",
    title: "What comes next",
    body: (r) => [
      `By the middle of October the summer houses are emptying and the beaches are quiet. You have carried ${r.v("carried")} people across the Sound. ${r.has("r:dear") ? `Inger's tin is fuller than it has ever been, and neither of you likes to look at it.` : r.has("r:free") ? "Inger's tin is emptier than it has ever been, and the doctor's fund has paid for every drop of fuel." : "Inger's tin holds about what it held in September. The fund paid for the fuel."}`,
      "Most of the people who needed to cross have crossed. Some still need to: people hidden in the country, people who waited, and soon the young men of the resistance who will need to go the other way.",
      r.has("r:warned") || risk(r) >= 1 ? "And there is the other thing. Constable Rasmussen stops you in the street to say, looking at a lamp-post, that the Gestapo in Helsingør have been asking about boats from Snekkersten." : "Constable Rasmussen stops you in the street to say that the Germans in Helsingør are busy with other things now, and that you look tired.",
    ],
    options: [
      {
        id: "continue",
        label: "Keep going with the doctor's people, as long as anyone needs a boat",
        hint: "Fewer crossings, harder ones, for longer.",
        act: (c) => {
          c.set("r:continued");
          c.say("You tell the doctor yes, for as long as it is needed. She says it will be needed for some time.");
          c.pass(5 * 24 * 60);
          c.end("r-continue");
        },
      },
      {
        id: "fish",
        label: "Go back to the herring. You have done what was asked",
        hint: "Inger will sleep again. So will you.",
        act: (c) => {
          c.set("r:stopped");
          c.say("You tell the doctor the Ternen is going back to fishing. She shakes your hand and says that is what most men did, and that most men did not do as much as you.");
          c.pass(5 * 24 * 60);
          c.end("r-home");
        },
      },
      {
        id: "sweden",
        label: "Take Inger and Poul across to Sweden yourselves, before anyone comes asking",
        show: (r) => r.has("r:warned") || risk(r) >= 1,
        hint: "Some helpers did, when they had been noticed. You would leave the house, and the boat would have to go to someone.",
        act: (c) => {
          c.set("r:fled");
          c.move("anders", "sweden", "safe");
          c.move("inger", "sweden", "safe");
          c.move("poul", "sweden", "safe");
          c.learn("inger", "saw");
          c.learn("poul", "saw");
          c.say("You leave Holger the key to the house and the Ternen to the doctor's people, and cross one last time with your own family below deck, which is a thing you had not imagined. Inger sits on the sacking with her handbag on her knees, exactly where Sara sat.");
          c.pass(5 * 24 * 60);
          c.end("r-sweden");
        },
      },
    ],
  },
];

function board3(c: Ctx): void {
  boardPassengers(c, Math.min(12, c.v("capacity")));
  c.pass(40);
  c.move("sara", "sound", "at-sea");
  c.learn("sara", "saw");
  c.pass(100);
  cross(c, c.v("aboard"));
  boardPassengers(c, 0);
  c.move("sara", "raa", "safe");
  c.learn("sara", "saw");
  c.go("r-raa");
}

/** Home across the Sound; in standard mode, with warnings ignored, the Gestapo may be waiting. */
function home3(c: Ctx): void {
  c.pass(5 * 60);
  const r = risk(c);
  if (c.mode === "standard" && r >= 2 && c.roll("arrest", r >= 3 ? 0.5 : 0.25)) {
    c.move("anders", "helsingor", "held");
    c.say("When you tie up at Snekkersten there are two men in long coats on the jetty, and a car on the road. They know your name. Someone told.");
    c.log("Arrested by the Gestapo on the jetty at Snekkersten.");
    c.end("r-held");
    return;
  }
  c.move("anders", "snekkersten", "home");
  if (!c.has("r:poul-away")) c.move("poul", "snekkersten", "home");
  c.pass(6 * 24 * 60);
  c.go("r-decide");
}

function people(r: Read): PersonOutcome[] {
  const out: PersonOutcome[] = [];
  if (r.knows("hanna")) out.push({ person: "hanna", kind: "safety", text: r.has("r:knows-levin") ? "Hanna Levin and her family reached Sweden on the Ternen. After the war a card came, addressed to 'the skipper of the Ternen, Snekkersten', with a drawing of a lighthouse on it by a girl called Ruth." : "The woman called Hanna who organized everyone on the beach reached Sweden with her family. You never learned her surname." });
  if (r.knows("lis")) out.push({ person: "lis", kind: "safety", text: "The pale young woman, Lis, was seasick all the way and safe at the end of it. In December, you heard much later, she had a daughter in Sweden." });
  if (r.knows("klara")) out.push({ person: "klara", kind: "safety", text: "Klara and Moritz Feld, who had fled Berlin in 1938, reached Sweden with one small case between them." });
  out.push({ person: "sara", kind: r.has("r:sara-spelled") || r.has("r:phoned") ? "reunion" : "safety", text: r.has("r:sara-spelled") ? "Sara Levin, seventy-seven, landed at Råå and was with her family in Helsingborg by evening, because a fisherman knew how to spell her name." : r.has("r:phoned") ? "Sara landed at Råå. The names went to Helsingborg by telephone, and she found her family there the next day." : "The old woman with the folding stool landed at Råå, written down as Lewin, Sara, 77. The lists found her family in the end." });
  return out;
}

function family(r: Read): PersonOutcome[] {
  const sweden = r.has("r:fled");
  return [
    { person: "inger", kind: sweden ? "accommodation" : "ordinary", text: sweden ? "Kept house in two rooms in Helsingborg until May 1945, and kept the accounts of the Danish refugee club as well, to the krone." : r.has("r:dear") ? "Kept the money in the tin until the war was over, and then gave most of it to the fund for the families who came home with nothing." : "Kept the accounts and her own counsel, and the house, through the rest of the war." },
    r.has("r:poul-away")
      ? { person: "poul", kind: "ordinary", text: "Sat out October at his aunt's, furious, and never quite forgave you for it. He has his own boat now." }
      : { person: "poul", kind: sweden ? "accommodation" : "ordinary", text: sweden ? "Finished his schooling in Sweden and came home a man in 1945. He has his own boat now." : r.has("r:poul-helm") ? "Brought the Ternen into Helsingborg harbor at seventeen as neatly as his father. He has his own boat now." : "Rowed every passenger out to the Ternen without a splash. He has his own boat now." },
    { person: "else", kind: "ordinary", text: "Went on with her list of addresses as long as there was anyone on it." },
  ];
}

export const R_ENDINGS: Ending[] = [
  {
    id: "r-continue",
    title: "As long as it is needed",
    body: (r) => [
      `In October 1943 the Ternen carried ${r.v("carried")} people across the Sound. Through the winter there were fewer crossings, and harder ones: people who had hidden in the country, and later young men of the resistance, crossing in both directions.`,
      "Along the coasts of Zealand that autumn there were six or seven hundred crossings, and some seven thousand people reached Sweden. Most fishermen were paid; a few took nothing; some took far too much. Those who sailed with the organized groups kept to agreed prices, which the helpers on shore held down.",
      "The water between Snekkersten and Sweden is four kilometers wide. You crossed it more times than you could count, and you never got used to the lights.",
    ],
    outcomes: (r) => [{ person: "anders", kind: "ordinary", text: "Fished by day and crossed by night, on and off, until the danger grew too great in 1944. After the war he went back to the herring." }, ...family(r), ...people(r)],
  },
  {
    id: "r-home",
    title: "Back to the herring",
    body: (r) => [
      `In October 1943 the Ternen carried ${r.v("carried")} people across the Sound. Then she went back to fishing, and so did you.`,
      "That was what most of the fishermen on the coast did: they sailed while they were needed, during the few weeks when almost everyone crossed, and then went back to their nets. Some seven thousand people reached Sweden that autumn, in six or seven hundred crossings, and the fishermen of the coast made most of them.",
      "On clear nights you can still see the lights on the Swedish shore. You notice them now.",
    ],
    outcomes: (r) => [{ person: "anders", kind: "ordinary", text: "Went back to fishing from Snekkersten. He never talked about October 1943 unless someone asked him directly, and then only about the weather." }, ...family(r), ...people(r)],
  },
  {
    id: "r-sweden",
    title: "The other shore, for you too",
    body: (r) => [
      `In October 1943 the Ternen carried ${r.v("carried")} people across the Sound, and finally her own skipper's family.`,
      "Some of the helpers who had been noticed went to Sweden themselves that autumn, among them fishermen, couriers and doctors. They lived as refugees among the refugees, and went home in the summer of 1945.",
      "The doctor's people kept the Ternen working. When you came home, she was tied up at Snekkersten with a new coat of paint and a full tank, and a note in the wheelhouse that said: thank you for the loan.",
    ],
    outcomes: (r) => [{ person: "anders", kind: "accommodation", text: "Worked in a Helsingborg boatyard until May 1945, close enough to see the Danish shore every day. He came home on one of the first ferries." }, ...family(r), ...people(r)],
  },
  {
    id: "r-held",
    title: "Arrested",
    body: () => [
      "The Gestapo took you to Helsingør for questioning. Someone on the coast had talked: about lamps, about jetties, about a boat that was out at night.",
      "That autumn, helpers caught by the Germans were mostly handed over to the Danish police and courts. The law allowed up to three months in prison for helping people leave the country illegally, and many cases were dropped or never came to court. The Ternen was seized, and you did not get her back until the war was over.",
      "Your passengers were already safe in Sweden. None of them ever knew.",
    ],
    outcomes: (r) => [{ person: "anders", kind: "held", text: "Held for some weeks and then released, his case one of many that never came to trial. He got the Ternen back in 1945, and fished from her for twenty more years." }, ...family(r), ...people(r)],
  },
];
