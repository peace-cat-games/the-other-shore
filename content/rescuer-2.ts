/**
 * The Danish rescuer, chapters 3 to 5: the first crossing, the night
 * there were too many people, and the Levins' crossing.
 *
 * Fictional parameters: without Holger's work on the engine it stalls
 * mid-Sound half the time (a delay, never worse; engines did fail, see the
 * Nivå schooner in docs/history/corridor.md §3).
 */
import { at } from "../engine/calendar.ts";
import type { Ctx, Scene } from "../engine/types.ts";
import { boardPassengers, cross } from "./rescuer-1.ts";

const TUESDAY_GROUP = 19;

/** The people on Tuesday's boat whom the rescuer can come to know. */
const GROUP = ["hanna", "david", "ruth", "benny", "klara", "moritz", "lis", "aron"];

export function moveGroup(c: Ctx, ids: string[], place: string, condition: Parameters<Ctx["move"]>[2]): void {
  for (const p of ids) {
    c.move(p, place, condition);
    if (c.knows(p)) c.learn(p, "saw");
  }
}

function engineTrouble(c: Ctx, key: string): void {
  if (!c.has("r:engine") && c.roll(key, 0.5)) {
    c.add("tired", 1);
    c.say("Halfway across, the engine coughs, races and dies. In the silence you can hear everyone below trying not to breathe. Poul has the cover off before you can ask, and after twenty long minutes, with oil to his elbows and your torch held under your coat, the old injector catches again.");
  }
}

function land(c: Ctx, where: "helsingborg" | "raa"): void {
  const n = c.v("aboard");
  cross(c, n);
  boardPassengers(c, 0);
  c.move("anders", where, "safe");
  c.move("poul", where, "safe");
}

export const R_SCENES_2: Scene[] = [
  {
    id: "r-board1",
    role: "rescuer",
    chapter: "The first crossing",
    place: "beach",
    title: "Sunday night",
    body: (r) => [
      "No moon, a light wind from the land, and the beach below Snekkersten as black as the inside of a boot. The Ternen lies at anchor fifty meters out. Poul waits in the rowing boat with the oars muffled in rags.",
      `Out of the trees come the people the courier has brought, in a line, holding each other's coats: an old couple who walk as if the shingle might break, a mother with a baby and a boy of seven, three students, a doctor and his wife, and a man who gives no name at all. Twelve.${r.v("capacity") > 12 ? " Behind them, out of breath, a young couple who were not on anyone's list." : ""}`,
      r.has("r:signals") ? "From the road above, nothing yet: the courier's lamp is dark. Dark means wait." : "You never agreed any signal with the courier. You will have to judge the road yourself.",
    ],
    options: [
      {
        id: "wait",
        label: (r) => (r.has("r:signals") ? "Wait for the green lamp, then row them out in twos and threes" : "Wait and listen to the road for ten minutes, then row them out"),
        hint: "Slow and quiet.",
        act: (c) => {
          c.pass(40);
          boardPassengers(c, 12);
          c.say(c.has("r:signals") ? "After twenty minutes the lamp shows green, a little blur of colour on the bank. Poul rows them out four trips, without a splash." : "Nothing on the road. Poul rows them out four trips, without a splash.");
          if (c.v("capacity") > 12) c.say("The young couple stand on the beach and watch the last boat go. The courier takes them back up into the trees: tomorrow, he promises them, or the night after.");
          c.go("r-cross1");
        },
      },
      {
        id: "more",
        label: "Take the young couple too: there is room below",
        show: (r) => r.v("capacity") > 12,
        hint: "Fourteen is what the Ternen can carry, now that the hold is clear.",
        act: (c) => {
          c.set("r:took-extra");
          c.pass(45);
          boardPassengers(c, 14);
          c.say("They nearly weep. There is room, just, if the students sit with their knees under their chins. They do not complain.");
          c.go("r-cross1");
        },
      },
      {
        id: "now",
        label: "Go now, without waiting: the night is short",
        hint: "You don't know what is on the road.",
        act: (c) => {
          c.set("r:risk-warning");
          c.pass(25);
          boardPassengers(c, 12);
          c.say("You hurry them down to the water in a clatter of shingle. The baby wakes and cries. Somewhere up on the road a car goes by, and keeps going.");
          c.go("r-cross1");
        },
      },
    ],
  },
  {
    id: "r-cross1",
    role: "rescuer",
    chapter: "The first crossing",
    place: "sound",
    title: "Across",
    sea: true,
    body: (r) => [
      `${r.v("aboard")} people below and the hatch closed over them. Poul at the bow, you at the wheel, the engine low.`,
      "You have crossed this water ten thousand times for herring. You have never crossed it like this, with every light on the Danish shore an eye and every light ahead a promise. The wind is off the land; the sea is short and choppy. Somebody below is being sick, quietly and continuously.",
      "Helsingborg's harbor lights are straight ahead. To the south, down the Swedish coast, are the smaller harbors.",
    ],
    options: [
      {
        id: "straight",
        label: "Hold your course and your speed, straight for Helsingborg",
        hint: "The shortest way across.",
        act: (c) => {
          engineTrouble(c, "engine1");
          c.pass(55);
          c.say("You cross the middle of the Sound, where the line runs between the two countries, and nothing happens at all. The lights of Helsingborg come up out of the dark. On the quay there are Swedish policemen and women in grey uniforms with blankets, as if they had been waiting all their lives for exactly this boat.");
          land(c, "helsingborg");
          c.go("r-shore1");
        },
      },
      {
        id: "poul",
        label: "Give Poul the wheel and go below to the passengers",
        hint: "He can steer. They are frightened.",
        act: (c) => {
          c.set("r:poul-helm");
          engineTrouble(c, "engine1");
          c.pass(55);
          c.say("Below it smells of fear and fish. You sit on the steps and tell them what you can see: there is Kronborg behind us, here is the middle of the Sound, now we are in Swedish water. The boy of seven asks if you have ever seen a whale. Above you Poul brings the Ternen in to Helsingborg as neatly as you could have done it yourself.");
          land(c, "helsingborg");
          c.go("r-shore1");
        },
      },
      {
        id: "south",
        label: "Bear south and come in at a smaller harbor, away from the big lights",
        hint: "Longer at sea, and a quieter landing.",
        act: (c) => {
          c.set("r:landed-raa");
          engineTrouble(c, "engine1");
          c.add("tired", 1);
          c.pass(85);
          c.say("You come in under the low Swedish shore to the little fishing harbor at Råå. A Swedish fisherman in his nightshirt takes your line, looks down into the hold, and runs for the policeman without a word.");
          land(c, "raa");
          c.go("r-shore1");
        },
      },
    ],
  },
  {
    id: "r-shore1",
    role: "rescuer",
    chapter: "The first crossing",
    place: "helsingborg",
    title: "The Swedish side",
    body: (r) => [
      `The passengers climb out stiff and wet and blinking. The old man shakes your hand for a long time and says nothing. The man with no name says his name, finally, to a Swedish policeman, and then turns and nods to you. ${r.has("r:took-extra") ? "The young couple who were not on anyone's list stand on Swedish stone holding hands." : ""}`.trim(),
      "It is a little after one in the morning. The Ternen has to be back at her mooring in Snekkersten by the time the street is awake, or somebody will wonder where she has been fishing.",
    ],
    options: [
      {
        id: "back",
        label: "Turn straight back across before first light",
        hint: "Home by dawn, as if from an ordinary night's fishing. Tiring.",
        act: (c) => {
          c.add("tired", 1);
          c.pass(5 * 60);
          c.move("anders", "snekkersten", "home");
          c.move("poul", "snekkersten", "home");
          c.say("You are tied up at Snekkersten with an empty hold by six. Inger has coffee on and asks no questions until you have drunk it.");
          c.go("r-home");
        },
      },
      {
        id: "news",
        label: "Ask the Swedish police what they hear from the Danish side, then go back",
        hint: "They talk to everyone who lands.",
        act: (c) => {
          c.set("r:warned");
          c.add("tired", 1);
          c.pass(6 * 60);
          c.move("anders", "snekkersten", "home");
          c.move("poul", "snekkersten", "home");
          c.say("A Swedish constable with a notebook tells you what the arrivals have been saying all week: the Gestapo in Helsingør are the ones to fear, more than the soldiers or the navy, and they are working from tips. Somebody on the coast is talking. You are home a little after dawn, and the street is already up.");
          c.go("r-home");
        },
      },
      {
        id: "stay",
        label: "Sleep a few hours in Helsingborg and cross back the next night",
        hint: "Rested. The boat away from her mooring for a day, and Inger waiting.",
        act: (c) => {
          c.set("r:stayed-se");
          c.add("tired", -2);
          c.pass(20 * 60);
          c.move("anders", "snekkersten", "home");
          c.move("poul", "snekkersten", "home");
          c.say("You sleep in a seamen's hostel on the harbor and eat a Swedish breakfast with real butter, which feels like a betrayal of everyone at home. You cross back empty on Monday night. Inger has told the neighbors you are fishing off Hven. She is not pleased.");
          c.go("r-home");
        },
      },
    ],
  },
  {
    id: "r-home",
    role: "rescuer",
    chapter: "Too many people",
    place: "kroghouse",
    title: "Monday",
    body: (r) => [
      `You have carried ${r.v("carried")} people to Sweden, and nobody on the street knows it, or everybody does. It is hard to tell which.`,
      `${r.v("tired") >= 5 ? "You are more tired than you have ever been from fishing." : "You are tired, in a way that sleep does not quite reach."} Poul is restless and proud. Inger watches the road.`,
      "The doctor sends word: tomorrow night, a bigger group.",
    ],
    options: [
      {
        id: "rest",
        label: "Sleep. Make Poul sleep too",
        hint: "Tired men make mistakes on the water.",
        act: (c) => {
          c.add("tired", -4);
          c.say("You sleep twelve hours and wake to the smell of fried herring. Poul is still asleep, one arm over his face, looking about nine years old.");
          c.pass(20 * 60);
          c.go("r-tuesday");
        },
      },
      {
        id: "fish",
        label: "Go out fishing in daylight, so the Ternen is seen working",
        hint: "Ordinary business, ordinary catch, ordinary money. And you will be tired.",
        act: (c) => {
          c.set("r:cover");
          c.add("funds", 2);
          c.add("tired", 1);
          c.say("You fish off Snekkersten all day in plain sight of the coast road. The catch is poor and the cover is good. Viggo, passing, calls out that you must be the only man on the coast still interested in herring.");
          c.pass(20 * 60);
          c.go("r-tuesday");
        },
      },
      {
        id: "hold",
        label: "Spend the day clearing the hold to take more people",
        show: (r) => !r.has("r:hold"),
        hint: "Two more people each crossing.",
        act: (c) => {
          c.set("r:hold");
          c.add("capacity", 2);
          c.add("ready", 1);
          c.say("You and Poul scrub out the hold and lay boards and sacking. Fourteen, now, if they are friends.");
          c.pass(20 * 60);
          c.go("r-tuesday");
        },
      },
    ],
  },
  {
    id: "r-tuesday",
    role: "rescuer",
    chapter: "Too many people",
    place: "kroghouse",
    title: "Nineteen",
    body: (r) => [
      `Dr Brandt comes at noon, without her bag this time. For tonight she has ${TUESDAY_GROUP} people waiting in two houses above the beach: families, an elderly couple, a German-speaking pair who came from Berlin in 1938, a young woman expecting a baby, and a little boy who, the doctor says, is very frightened of the dark.`,
      `The Ternen carries ${r.v("capacity")} safely. You have fuel for ${r.v("fuel") === 1 ? "one crossing" : `${r.v("fuel")} crossings`}.`,
      "Everybody at the table can count. Nobody says the obvious thing, which is that this is not a question of who goes. They will all go. It is a question of how.",
    ],
    options: [
      {
        id: "tomorrow",
        label: "Take a full boat tonight; ask the doctor to keep the rest hidden until tomorrow",
        hint: "Safe and slow. Some of them wait another night in a cold house.",
        act: (c) => {
          c.set("r:resched");
          c.say("The doctor nods. The ones who stay behind will be those with somewhere warm to wait, and another skipper from further down the coast will take them on Wednesday night. 'It is not a hardship,' she says, 'to be in Denmark one more day.' Then she thinks about it and says, 'Well. It is a small one.'");
          c.pass(9 * 60);
          c.go("r-board2");
        },
      },
      {
        id: "twice",
        label: "Cross twice tonight",
        needs: (r) => (r.v("fuel") >= 2 ? null : "There isn't fuel for two crossings."),
        hint: "Everyone over in one night. Two round trips, and you will be exhausted.",
        act: (c) => {
          c.set("r:double");
          c.say("Poul grins. Inger does not. Two crossings means the second landing will be close to dawn, but the doctor says she can have the second group on the beach by one o'clock.");
          c.pass(9 * 60);
          c.go("r-board2");
        },
      },
      {
        id: "viggo",
        label: "Ask Viggo to take the others, and let the fund pay him",
        needs: (r) => (r.v("funds") >= 6 ? null : "The fund would need more than you can put in."),
        hint: "His price will be high. His boat is big and his mouth is bigger.",
        act: (c) => {
          c.set("r:viggo-deal");
          c.add("funds", -6);
          c.learn("viggo", "saw");
          c.say("Viggo names a price, then a lower one when you tell him whose money it is. 'I am not a monster,' he says. 'I am a businessman.' The others go on his boat from the beach north of Helsingør, and they get there, and he does not let anyone forget that they got there.");
          c.pass(9 * 60);
          c.go("r-board2");
        },
      },
      {
        id: "all",
        label: "Take all nineteen at once",
        needs: () => "Nineteen is more than the Ternen can carry safely.",
        act: (c) => c.go("r-board2"),
      },
    ],
  },
  {
    id: "r-board2",
    role: "rescuer",
    chapter: "Too many people",
    place: "beach",
    title: "Tuesday night",
    body: (r) => [
      "At dusk a message comes from the police station by way of a boy with a bicycle: Gestapo cars were along the coast road this evening, stopping at the beaches. You send word up to the houses: after eleven, and only on the courier's signal.",
      "They come down out of the trees at half past eleven. A woman organizes everyone in whispers as if she has been doing it all her life; she tells you her name is Hanna. A girl of about thirteen holds the hand of a little boy with a one-eared cloth rabbit pressed against his face. A tall pale young woman leans on her husband. The German-speaking couple carry one small case between them.",
      r.has("r:double") ? "The rest of the group waits up in the houses for the second trip." : "",
    ].filter(Boolean),
    options: [
      {
        id: "names",
        label: "Ask each family their name as they board, and tell them yours",
        hint: "Names are a risk if you are caught. They are also how people find each other.",
        act: (c) => {
          c.set("r:names");
          c.set("r:knows-levin");
          moveGroup(c, GROUP, "beach", "travelling");
          for (const p of ["hanna", "ruth", "benny", "klara", "moritz", "lis", "aron", "david"]) c.learn(p, "saw");
          c.say("Levin, says the organized woman, with a V; her husband David; Ruth; Benny, who will not be parted from the rabbit. Feld, Klara and Moritz. Melby, Lis and Aron; Lis is not Jewish, Aron says, and could have stayed, and would not. You say: Anders. And this is Poul.");
          boarding(c);
        },
      },
      {
        id: "quiet",
        label: "No names. Just get them aboard, quietly and quickly",
        hint: "What you don't know you can't be made to tell.",
        act: (c) => {
          moveGroup(c, GROUP, "beach", "travelling");
          for (const p of ["hanna", "ruth", "benny", "lis"]) c.learn(p, "saw");
          c.say("You learn only what you cannot help learning: the woman who organizes everything is called Hanna, because her husband calls her that; the little boy is Benny; the pale young woman is Lis.");
          boarding(c);
        },
      },
      {
        id: "early",
        label: "Start the first trip early, so the second can be over before dawn",
        show: (r) => r.has("r:double"),
        hint: "The police have said why they want you to wait.",
        act: (c) => {
          c.set("r:risk-warning");
          moveGroup(c, GROUP, "beach", "travelling");
          for (const p of ["hanna", "benny"]) c.learn(p, "saw");
          c.say("You bring them down before the signal. Nothing happens. You do not know whether that was luck.");
          boarding(c);
        },
      },
    ],
  },
  {
    id: "r-cross2",
    role: "rescuer",
    chapter: "Too many people",
    place: "sound",
    title: "A light to the north",
    sea: true,
    body: (r) => [
      "Halfway across: a light to the north, low on the water, where no light should be.",
      `You cut the engine. The Ternen rolls in the swell. Below, ${r.v("aboard")} people go silent at once, as if they had practiced. You lean down to the hatch and say it, very low and very calm: a light to the north. Everyone keep absolutely still. Not a word.`,
      "Everyone on this coast has heard stories about German patrol boats with searchlights, and nobody knows which stories are true.",
    ],
    options: [
      {
        id: "wait",
        label: "Wait in silence and watch the light",
        hint: "If it comes closer you will see it first.",
        act: (c) => {
          c.pass(15);
          c.say("The light hangs there for a long minute, moves north, and is gone. You will never know whose it was. You start the engine and Poul lets out a breath he seems to have been holding since Sunday.");
          after2(c, "helsingborg");
        },
      },
      {
        id: "run",
        label: "Start up again and run for Swedish water at full speed",
        hint: "Loud. Fast. Hard on the people below.",
        act: (c) => {
          c.add("tired", 1);
          c.say("The engine roars. The Ternen slams into every wave and somebody below is sick again, and then somebody else. The light does not follow. In ten minutes you are across the line.");
          after2(c, "helsingborg");
        },
      },
      {
        id: "south",
        label: "Turn south, away from the light, and come in at Råå",
        hint: "Longer, and away from it.",
        act: (c) => {
          c.set("r:landed-raa");
          c.add("tired", 1);
          c.pass(30);
          c.say("You bring her round slowly and creep south under the Swedish shore, and come in at Råå an hour later than you meant.");
          after2(c, "raa");
        },
      },
    ],
  },
  {
    id: "r-wednesday",
    role: "rescuer",
    chapter: "Too many people",
    place: "kroghouse",
    title: "Wednesday",
    body: (r) => [
      `Wednesday. You sleep until noon and wake with salt in your eyelashes. ${r.v("tired") >= 7 ? "Your hands are not steady yet." : "The house is very quiet."}`,
      r.has("r:dear")
        ? `In the afternoon the doctor brings the money from Tuesday's passengers: ${(r.v("funds") * 100).toLocaleString("en-US")} kroner in Inger's tin, now, more than the Ternen earns in a season. With it comes a note from a family who could not pay your price and went with someone else.`
        : r.has("r:free")
          ? "In the afternoon the doctor brings an envelope anyway: from one of Tuesday's passengers, a man who insisted, she says, and would not be refused. It is fuel money, he told her, not payment."
          : "In the afternoon the doctor brings what the fund owes you for fuel and upkeep, and a little more, from a passenger who insisted on paying extra for those who could not.",
      r.has("r:viggo-deal") ? "She also says that Viggo has been telling the whole harbor what the fund paid him." : "Holger looks in to ask how the old injector is behaving.",
    ],
    options: [
      {
        id: "rest",
        label: "Rest, and let Poul rest",
        hint: "Another group is coming. Tired men make mistakes.",
        act: (c) => {
          c.add("tired", -4);
          c.say("You sleep again, properly this time, and dream about nothing at all.");
          c.pass(20 * 60);
          c.go("r-gilleleje");
        },
      },
      {
        id: "fund",
        label: (r) => (r.has("r:dear") ? "Give most of the money back to the fund, for families who can't pay" : "Put the extra into the fund for the families who can't pay"),
        show: (r) => r.v("funds") >= 4,
        hint: "Inger keeps the accounts. She will have an opinion.",
        act: (c) => {
          c.set("r:gave");
          const wasDear = c.has("r:dear");
          c.add("funds", -(wasDear ? c.v("funds") - 3 : Math.min(4, c.v("funds"))));
          if (wasDear) {
            c.unset("r:dear");
            c.set("r:cost");
          }
          c.say(wasDear ? "Inger counts it out onto the kitchen table and pushes it across to the doctor without a word. Afterwards she says, 'Costs, and the risk to the boat. You could have said that on Saturday.' From now on, you tell the doctor, that is your price." : "The doctor writes nothing down. Somewhere a family who could not pay will cross next week, and never know whose fuel money it was.");
          c.add("tired", -2);
          c.pass(20 * 60);
          c.go("r-gilleleje");
        },
      },
      {
        id: "repair",
        label: "Spend the day on the boat with Holger",
        hint: "The Ternen has done more this week than in a month of fishing.",
        act: (c) => {
          if (!c.has("r:engine")) {
            c.set("r:engine");
            c.add("ready", 1);
          }
          c.learn("holger", "saw");
          c.add("tired", -1);
          c.say("Holger goes over the engine, the shaft, the pump and the hull, and finds a seam that has started to weep. By dark it is caulked and the engine is running like a sewing machine. 'Now she can do it every night,' he says, 'even if you can't.'");
          c.pass(20 * 60);
          c.go("r-gilleleje");
        },
      },
      {
        id: "viggo",
        label: "Go and tell Viggo to stop talking about the fund's money",
        show: (r) => r.has("r:viggo-deal"),
        hint: "He did take them across. He will not like being told.",
        act: (c) => {
          c.learn("viggo", "saw");
          c.say("Viggo hears you out with his arms folded. Then he says that every one of the people he took on Tuesday is in Sweden, which is more than some men with nicer manners can say, and that he will talk about his money as he likes. But he talks less, after that.");
          c.add("tired", 1);
          c.pass(20 * 60);
          c.go("r-gilleleje");
        },
      },
    ],
  },
];

function boarding(c: Ctx): void {
  if (c.time < at("1943-10-05", 23)) c.pass(at("1943-10-05", 23) - c.time);
  boardPassengers(c, c.v("capacity"));
  c.pass(40);
  moveGroup(c, GROUP, "sound", "at-sea");
  c.go("r-cross2");
}

function after2(c: Ctx, where: "helsingborg" | "raa"): void {
  engineTrouble(c, "engine2");
  c.pass(45);
  land(c, where);
  moveGroup(c, GROUP, where, "safe");
  if (where === "helsingborg") c.say("On the quay a schoolteacher with a Red Cross armband is writing names at a folding table, slowly, asking each person to spell them. Hanna spells hers twice.");
  else c.say("At Råå a Swedish policeman telephones Helsingborg so that the names will reach the lists there.");
  if (c.has("r:double")) {
    c.add("fuel", -1);
    c.add("tired", 3);
    c.add("carried", TUESDAY_GROUP - c.v("capacity"));
    c.add("funds", c.has("r:free") ? 0 : 2);
    c.pass(3 * 60);
    c.say("You go back across empty for the second group and land them too, with the sky going grey in the east. When you tie up at Snekkersten your hands will not stop shaking for an hour.");
  }
  c.move("anders", "snekkersten", "home");
  c.move("poul", "snekkersten", "home");
  c.pass(4 * 60);
  c.go("r-wednesday");
}
