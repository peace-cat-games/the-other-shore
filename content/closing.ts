/**
 * The end of every campaign, in the order the author asked for: the
 * historical epilogue, the author's thanksgiving and the verses, the
 * credits, and only then an invitation to other stories.
 *
 * AUTHOR_NOTE is the author's own wording (the specification's baseline)
 * and states exactly the author's travel: Finland visited; Denmark only
 * Copenhagen airport; Sweden only Arlanda airport and Haparanda. Do not add
 * to it. `content/content.test.ts` checks it.
 */

export const EPILOGUE = {
  title: "What happened",
  paragraphs: [
    "In October 1943 about seven thousand Jews, nearly all of Denmark's Jewish community, crossed the Øresund to Sweden, with several hundred of their non-Jewish husbands, wives and relatives. Most of them crossed within three weeks, in six or seven hundred crossings from the coasts of Zealand.",
    "They were warned. A German official, Georg F. Duckwitz, passed on the date of the planned action to Danish Social Democrats, who carried the warning to the Jewish community, and on the eve of the New Year Rabbi Marcus Melchior told his congregation to hide. Jewish families organized their own flight and paid for much of it. Tens of thousands of Danes helped: doctors and nurses, students and teachers, pastors, taxi drivers, police officers, and the fishermen of the coast. On 2 October Sweden announced on the radio that it would take them in.",
    "Not everyone escaped. About 470 Danish Jews were arrested and deported to Theresienstadt, some on the night of 1 to 2 October and others on the coast, many of them betrayed by informers. Danish officials and the Danish Red Cross never stopped demanding news of them, parcels followed them, and in April 1945 the white buses of the Swedish Red Cross brought the survivors out. About fifty of them died in Theresienstadt. Counting those who drowned or died during the flight, some 120 Danish Jews lost their lives.",
    "In Sweden the refugees were met by police, Red Cross volunteers and the women of the Lotta corps, given emergency visas, examined and housed, then sent on to camps, hostels and private homes across the country. Danish schools opened in exile. In the early summer of 1945 nearly all of them went home. Many found their homes cared for by neighbors, or by Copenhagen's municipal social service. Others found their flats let to strangers and their belongings sold or stolen, and most needed help to begin again.",
    "The rescue was not the whole story. Until late 1942 Sweden's policy toward Jewish refugees had been restrictive, and during the occupation Danish authorities had expelled some twenty Jewish refugees to Germany. And it was an exception: across occupied Europe, millions of Jews were murdered, with no other shore to reach.",
    "After the war, Denmark did not expel its German minority in South Jutland. Members who had served the occupiers were interned and tried, and about three thousand were sentenced, as individuals, for what each had done. Many in the minority felt the internment and trials were unjust; one Danish historian has judged them reasonable for their time. Either way, it was a choice against collective punishment, made while Germans were being driven out of Poland, Czechoslovakia and Yugoslavia. (The quarter of a million German refugees who had fled to Denmark in 1945 were a different group: they were held in guarded camps until they could be sent back, the last of them in 1949.)",
  ],
};

export const AUTHOR_NOTE: string[] = [
  "My connection with these countries is still growing. I have visited Finland; my experience of Denmark has so far been limited to Copenhagen airport, and of Sweden to Arlanda airport and Haparanda. There is much I have yet to see. Through what I have experienced and what I have learned about them, I have developed a deep love and admiration for Denmark, Finland, Sweden, and their people.",
  "I thank God for those who sheltered their neighbors in a time of persecution: the people of Denmark who helped Jews escape, and the people of Sweden who welcomed them. I also honor Finland's protection of its Jewish citizens, a story we intend to explore in another game.",
  "In these acts of courage and hospitality, I see people living up to the Christian calling represented by the crosses on their flags: to welcome the stranger, protect the vulnerable, and overcome evil with good.",
  "This game is offered freely, with gratitude.",
];

export const VERSES = [
  { text: "I was a stranger, and ye took me in.", ref: "Matthew 25:35", translation: "King James Version" },
  { text: "Be not overcome of evil, but overcome evil with good.", ref: "Romans 12:21", translation: "King James Version" },
];

export const ENCOURAGEMENT: string[] = [
  "If this story has meant something to you, look for the stranger near you. Help the poor. Visit the sick, and do not forget those who struggle with addiction or mental illness, who are so often left alone. Welcome people who are far from home.",
  "Do not follow a crowd to do evil. Overcome evil with good.",
];

export const CREDITS: string[] = [
  "The Other Shore: October 1943. A game by Peace Cat Games.",
  "Story, design, historical research and browser implementation by Peace Cat Games.",
  "The people of the story, the boat Ternen, and its houses, coves and reception rooms are fictional. The history comes from the sources listed on the history page, chief among them the United States Holocaust Memorial Museum, the Danish Jewish Museum and its Safe Haven archive of Swedish refugee records, folkedrab.dk of the Danish Institute for International Studies, the Helsingborg city encyclopedia, and Fenno Judaica of the Jewish Community of Helsinki.",
  "Typefaces: Atkinson Hyperlegible, by the Braille Institute, and Literata, by TypeTogether, both under the SIL Open Font License.",
  "The sound of the sea is made in your browser; there are no recordings.",
  "The game's source code and story are released under the Christian Open Source License (COSL) 1.0.",
  "In memory of those who did not reach the other shore, and with gratitude to everyone who helped others reach it.",
];

export const EXPLORE = {
  paragraphs: ["The Other Shore is complete and free. If you would like more from Peace Cat Games, here is where to find it."],
  links: [
    { href: "https://www.peacecatgames.com/games", label: "Peace Cat Games", text: "the main catalogue of browser games." },
    {
      href: "https://www.peacecatgames.com/after-dark",
      label: "After Dark",
      text: "a separate collection of historical games for adults about persecution and institutional terror. They are much darker than The Other Shore, carry content notices, and are planned as paid games.",
    },
  ],
};
