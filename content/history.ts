/**
 * The in-game history page: what happened, with sources, and where the game
 * invents. Every claim here is in docs/history/*.md with its source; the
 * source ids below are this page's own numbering.
 */

export interface HistorySource {
  id: string;
  title: string;
  publisher: string;
  url: string;
}

export interface HistorySection {
  title: string;
  paragraphs: string[];
  sources: string[];
}

export const HISTORY: { intro: string[]; sections: HistorySection[]; sources: HistorySource[] } = {
  intro: [
    "The Other Shore is fiction set inside real events. Its people are invented; the warning, the night of 1 October, the crossings from north Zealand, the reception in Sweden, the deportation to Theresienstadt and the return in 1945 are history. This page sets out what happened, where the figures come from, and where the game invents.",
    "Sources often disagree on numbers. Where they do, this page gives a range.",
  ],
  sections: [
    {
      title: "Before October 1943",
      paragraphs: [
        "When Germany occupied Denmark in April 1940, about 7,500 Jews lived in the country, most of them in Copenhagen. About 6,000 were Danish citizens. Some families had been Danish for centuries; others descended from Russian Jews who came around 1900; others were refugees from Germany and central Europe, among them young pioneers training on Danish farms for a life in Palestine.",
        "For three years the Danish government's policy of cooperation with the occupiers also protected the Jews. On 29 August 1943 the government resigned rather than accept new German demands, and that protection ended. In September the German plenipotentiary, Werner Best, proposed deporting Denmark's Jews, and Berlin approved.",
      ],
      sources: ["ushmm-denmark", "bak-2009", "ruhl"],
    },
    {
      title: "The warning",
      paragraphs: [
        "On 28 September Best told Georg F. Duckwitz, the shipping expert at the German legation, the date of the action. Duckwitz passed it to Danish Social Democrats, among them Hans Hedtoft, who carried it to the leaders of the Jewish community. On 29 September, the eve of Rosh Hashanah, Rabbi Marcus Melchior warned his congregation and urged them to hide.",
        "Rumor had already begun to spread, and the warning spread 'like wildfire'. Most families left home within days, to friends, neighbors, colleagues, strangers, summer houses, churches and hospitals. Several Copenhagen hospitals, Bispebjerg among them, hid people under false names and moved them out in ambulances.",
        "German officials did not act alike. Historians argue that Best ran a double game, and that Duckwitz's leak served it. The German navy kept its boats on naval work, and German police did not patrol the Øresund for refugees. But a small group of Gestapo men did hunt the fleeing Jews, with the help of Danish informers, and one Gestapo chief in Helsingør, Hans Juhl, made about half of all the arrests.",
      ],
      sources: ["kirchhoff-duckwitz", "ruhl", "time-1943", "bak-flugten", "bak-hjaelpen", "bispebjerg"],
    },
    {
      title: "The night of 1 October",
      paragraphs: [
        "The action began at about nine o'clock on Friday evening, 1 October, when the Germans expected Jews to be at home for the New Year. Police were ordered not to break down doors. Most homes were empty. German records count 232 people arrested that night; another count gives 202 in Copenhagen.",
      ],
      sources: ["ruhl", "bak-2009", "bak-flugten"],
    },
    {
      title: "The crossing from north Zealand",
      paragraphs: [
        "The game is set on the coast just south of Helsingør, where the Sound is four kilometers wide. About a thousand people left from Snekkersten alone. Couriers met refugees at stations and led them to houses and inns near the shore. Local police warned helpers where German patrols were expected, and coloured lamps signalled from the dark beaches. A doctor in the area used sedatives to keep small children quiet on the crossing; on some routes children under five were refused for fear of the noise.",
        "The Helsingør Sewing Club, a group of four friends under a deliberately dull name, ferried more than 700 Jews in a small grey motorboat that carried twelve to fourteen passengers and charged only its costs. Most boats were fishing boats. A crossing in the narrows took about forty-five minutes to an hour.",
        "Crossings cost between 500 and 2,000 kroner a person that October, about 1,000 on average, when a skilled worker earned about 414 kroner a month. Some families paid far more at the start, a few fishermen took nothing, and organized groups held prices down so that the better-off paid for those who could not. Jewish families paid about half of the total cost; collections paid the rest.",
        "No boat carrying refugees was caught by German police at sea. About 200 people were arrested while trying to flee, on land: on beaches, in harbors and in hiding places, many through informers. On the night of 6 to 7 October the Gestapo raided the church loft in Gilleleje, farther up the coast, and took more than a hundred people there and in the parish hall.",
      ],
      sources: ["ushmm-rescue", "ushmm-lurifax", "folkedrab-flugten", "jfr-thomsen", "jfr-munch", "nivaa", "bak-2009", "bak-hjaelpen"],
    },
    {
      title: "Sweden's reception",
      paragraphs: [
        "Until late 1942 Sweden's policy toward Jewish refugees was restrictive. The deportation of Norway's Jews in November 1942 changed it. On 2 October 1943 Swedish radio announced that Sweden would receive the Jews of Denmark.",
        "In Helsingborg hundreds of people landed every night that October. Police officers and the women of the Lotta corps were often the first to meet them. Each refugee received an emergency visa, then a medical examination and a police interview recorded on printed forms: name, birthplace, occupation, religion, how they came, money brought. A camp opened at the Ramlösa spa on 4 October. About 7 October the authorities decided to move Jewish refugees away from the coast, to camps, hostels, hotels and private homes inland.",
        "The Danish legation's refugee office in Stockholm paid support, kept a card index of refugees and planned the return. Danish schools opened in Lund, Göteborg, Helsingborg and Norrköping. In May and June 1945 nearly all the refugees went home.",
      ],
      sources: ["levande-historia", "helsingborg-flykting", "helsingborg-monument", "safe-haven-forms", "lex-socialhjaelp", "svenson-lund"],
    },
    {
      title: "Theresienstadt",
      paragraphs: [
        "Between 470 and 481 Danish Jews were deported to Theresienstadt, about a third of them stateless refugees, the oldest 89 years old. Danish officials and the Danish Red Cross demanded information again and again, and their pressure may have kept the Danish prisoners from being sent on to the killing centers. Clothing parcels from Denmark were allowed from December 1943 and food parcels from 1944. A Danish and Red Cross delegation visited the camp on 23 June 1944, after the Germans had staged its appearance.",
        "About fifty Danish Jews died in Theresienstadt. In April 1945 the Swedish Red Cross's white buses brought out 423 people, most of them Danish, to Sweden.",
      ],
      sources: ["ushmm-denmark", "ushmm-redcross", "folkedrab-persecution", "folkedrab-theresienstadt", "folkedrab-whitebuses"],
    },
    {
      title: "Coming home",
      paragraphs: [
        "Some returning families found their homes intact and well kept by neighbors. Copenhagen's municipal social service had inspected empty homes, paid rent on some flats and stored the furniture of hundreds of households. Others found their flats let to strangers and their belongings sold or stolen. At least 65 percent of Denmark's Jews needed financial help after their return.",
      ],
      sources: ["bak-return", "bak-socialtjenesten"],
    },
    {
      title: "A record that was not flawless",
      paragraphs: [
        "During the occupation Danish authorities expelled about twenty Jewish refugees to Germany.",
        "Finland, which fought alongside Germany against the Soviet Union, did not hand over its Jewish citizens; Finnish Jews served in the Finnish army. But on 6 November 1942 Finland handed eight Jewish refugees to the Gestapo in Helsinki harbor. Seven of them died; one, Georg Kollmann, survived Auschwitz, having lost his wife and child there. In November 2000 the Finnish prime minister apologized to the Jewish community on behalf of the government.",
      ],
      sources: ["folkedrab-persecution", "fenno-history", "fenno-war", "fenno-refugees"],
    },
    {
      title: "After the war: no collective punishment",
      paragraphs: [
        "Denmark did not expel its established German minority in South Jutland. About 3,500 of its members were interned and about 3,000 sentenced, mostly for service in German units. Many in the minority saw the internment and the trials as unjust; one Danish historian judges them reasonable for their time. Either way the response was judicial, individual and limited, while Germans were being summarily driven out of Poland, Czechoslovakia and Yugoslavia. In 1955 Denmark and West Germany set out the rights of the minorities on both sides of the border.",
        "This is a different matter from the roughly 250,000 German refugees who fled to Denmark in 1945. They were held in guarded camps, cut off from Danes, until they were sent back to Germany; the last left in February 1949.",
        "Sweden and Finland faced different questions. Sweden handed over to the Soviet Union soldiers who had served in German forces; Finland interned German civilians under the armistice and handed German prisoners of war to the Soviet Union. None of the three countries kept every German, and the game does not claim they did.",
      ],
      sources: ["denmark-minority", "thaler", "sdu-kristensen", "lex-oksbol"],
    },
    {
      title: "Righteous Among the Nations",
      paragraphs: [
        "Yad Vashem recognizes 22 Danes and 10 Swedes as Righteous Among the Nations (as of 1 January 2024); their names are on the credits page, with where each of them helped. Most of the Danes helped in October 1943. The Swedes helped in Budapest, Berlin, Rome and Genoa. At their own request the members of the Danish resistance were not recognized individually; Yad Vashem planted a tree in their honor, and a boat from Gilleleje stands in its museum. Georg F. Duckwitz is recognized as a German.",
      ],
      sources: ["yv-statistics", "yv-database"],
    },
    {
      title: "What is history and what is fiction",
      paragraphs: [
        "History: the dates, the warning, the night of 1 October, Snekkersten, Helsingør, Gilleleje, Helsingborg, Råå and Ramlösa, the Swedish forms, the prices' range, the Danish authorities' pressure on behalf of the deportees, Theresienstadt and the white buses.",
        "Fiction: every named character in the story, the boat Ternen, the summer house, the parsonage, the villa above the beach, the reception rooms, Märta's noticeboard of names, and every conversation. The doctor who calms children is fictional, though such doctors were real. The skipper of the Ternen charges like the organized groups did; Viggo charges like the profiteers did.",
        "Gameplay: the game's chances, such as an engine stalling or a boat turned back by the wind, are simulation rules, not historical probabilities. In standard mode an arrest can happen only on land, and only after clear warnings are ignored, because that is where the October arrests happened; in history, most of the people arrested did nothing wrong. Nobody's fate in history was decided by how well they played.",
      ],
      sources: [],
    },
  ],
  sources: [
    { id: "yv-statistics", title: "Names of Righteous by Country (as of 1 January 2024)", publisher: "Yad Vashem", url: "https://www.yadvashem.org/righteous/statistics.html" },
    { id: "yv-database", title: "The Righteous Among the Nations Database", publisher: "Yad Vashem", url: "https://collections.yadvashem.org/en/righteous" },
    { id: "ushmm-denmark", title: "Denmark", publisher: "United States Holocaust Memorial Museum", url: "https://encyclopedia.ushmm.org/content/en/article/denmark" },
    { id: "ushmm-rescue", title: "Rescue in Denmark", publisher: "United States Holocaust Memorial Museum", url: "https://encyclopedia.ushmm.org/content/en/article/rescue-in-denmark" },
    { id: "ushmm-redcross", title: "Theresienstadt: Red Cross Visit", publisher: "United States Holocaust Memorial Museum", url: "https://encyclopedia.ushmm.org/content/en/article/theresienstadt-red-cross-visit" },
    { id: "ushmm-lurifax", title: "Motorboat used to take Jewish people in Denmark to safety in Sweden", publisher: "USHMM Collections", url: "https://collections.ushmm.org/search/catalog/irn939" },
    { id: "bak-2009", title: "From rescue to escape in 1943 (Sofie Lene Bak)", publisher: "Danish Jewish Museum", url: "https://jewmus.dk/fileadmin/files/webpage/documents/Forskning/Publikationer/Sofie_Lene_Bak_-_From_rescue_to_escape_in_1943.pdf" },
    { id: "bak-flugten", title: "Flugten til Sverige (Sofie Lene Bak)", publisher: "folkedrab.dk, Danish Institute for International Studies", url: "https://folkedrab.dk/temaer/oktober-43-flugten-til-sverige/artikler-om-oktober-43/flugten-til-sverige" },
    { id: "bak-hjaelpen", title: "Hjælpen til de danske jøder (Sofie Lene Bak)", publisher: "folkedrab.dk", url: "https://folkedrab.dk/temaer/oktober-43-flugten-til-sverige/artikler-om-oktober-43/hjaelpen-til-danske-joeder-hvorfor-hjalp-saa-mange-hvad-var-risikoen" },
    { id: "bak-return", title: "De danske jøders tilbagevenden efter Besættelsen (Sofie Lene Bak)", publisher: "folkedrab.dk", url: "https://folkedrab.dk/temaer/oktober-43-flugten-til-sverige/artikler-om-oktober-43/danske-joeders-tilbagevenden-efter-besaettelsen" },
    { id: "bak-socialtjenesten", title: "Det danske særtilfælde (Sofie Lene Bak)", publisher: "folkedrab.dk", url: "https://folkedrab.dk/temaer/oktober-43-flugten-til-sverige/artikler-om-oktober-43/danske-saertilfaelde-socialtjenestens-hjaelp-til-danske-joeder-eksil-fangenskab" },
    { id: "ruhl", title: "Den danske samarbejdspolitik og jødeaktionen (Otto Rühl)", publisher: "folkedrab.dk", url: "https://folkedrab.dk/temaer/oktober-43-flugten-til-sverige/artikler-om-oktober-43/danske-samarbejdspolitik-joedeaktionen" },
    { id: "kirchhoff-duckwitz", title: "Georg Ferdinand Duckwitz: The Rescue of the Danish Jews (Hans Kirchhoff)", publisher: "German Federal Foreign Office, 2013", url: "https://www.auswaertiges-amt.de/blob/216886/6b1cc4e9ee4b83c52ea396bf8bf92450/duckwitz-data.pdf" },
    { id: "time-1943", title: "Rosh Hashanah 1943 (Lily Rothman)", publisher: "TIME, 2015", url: "https://time.com/4026472/rosh-hashanah-world-war-ii-denmark" },
    { id: "bispebjerg", title: "Letter to Copenhagen's street-naming committee, 2016", publisher: "Bispebjerg and Frederiksberg Hospital", url: "https://edagsorden.regionh.dk/committee_1444/agenda_263860/documents/5cab311e-aefd-4bd6-b43c-ca4f146b43f7.pdf" },
    { id: "folkedrab-flugten", title: "Flugten til Sverige", publisher: "folkedrab.dk", url: "https://folkedrab.dk/artikler/flugten-til-sverige" },
    { id: "jfr-thomsen", title: "Henry Christen and Ellen Margrethe Thomsen", publisher: "Jewish Foundation for the Righteous", url: "https://www.jfr.org/rescuer/thomsen-henry-christen-and-ellen-margrethe" },
    { id: "jfr-munch", title: "Preben Munch Nielsen", publisher: "Jewish Foundation for the Righteous", url: "https://www.jfr.org/rescuer/nielsen-preben-munch" },
    { id: "nivaa", title: "Flugten gennem Nivå", publisher: "Fredensborg Kommune", url: "https://fredensborg.dk/p/Gang%20i%20Fredensborg/BORGER-Flugten-gennem-Niv%C3%A5.pdf" },
    { id: "levande-historia", title: "Tidslinje: Sverige och Förintelsen", publisher: "Forum för levande historia", url: "https://www.levandehistoria.se/fakta/forintelsen/tidslinje-sverige-och-forintelsen" },
    { id: "helsingborg-flykting", title: "Flyktingströmmar", publisher: "Helsingborgs stadslexikon", url: "https://stadslexikon.helsingborg.se/flyktingstrmmar/" },
    { id: "helsingborg-monument", title: "Flyktingmonumentet", publisher: "Helsingborgs stadslexikon", url: "https://stadslexikon.helsingborg.se/flyktingmonumentet/" },
    { id: "safe-haven-forms", title: "Vejledning til rapporttyper (Safe Haven)", publisher: "Danish Jewish Museum", url: "https://safe-haven.dk/fileadmin/user_upload/Vejledning_til_rapporttyper.pdf" },
    { id: "lex-socialhjaelp", title: "Socialhjælp til eksildanskerne i Sverige, 1940-1945", publisher: "lex.dk", url: "https://lex.dk/Socialhj%C3%A6lp_til_eksildanskerne_i_Sverige,_1940-1945" },
    { id: "svenson-lund", title: "Skola i exil: den danska skolan i Lund 1943-1945 (Anna Svenson)", publisher: "Rambam", url: "https://tidsskrift.dk/rambam/article/download/127721/173978/269758" },
    { id: "folkedrab-persecution", title: "The Persecution of Danish Jews", publisher: "folkedrab.dk", url: "https://folkedrab.dk/temaer/theresienstadt/danish-jews-in-theresienstadt-english/historical-background/the-persecution-of-danish-jews" },
    { id: "folkedrab-theresienstadt", title: "In Theresienstadt", publisher: "folkedrab.dk", url: "https://folkedrab.dk/temaer/theresienstadt/danish-jews-in-theresienstadt-english/historical-background/in-theresienstadt" },
    { id: "folkedrab-whitebuses", title: "The White Busses", publisher: "folkedrab.dk", url: "https://folkedrab.dk/temaer/theresienstadt/danish-jews-in-theresienstadt-english/historical-background/the-white-busses" },
    { id: "fenno-history", title: "History", publisher: "Fenno Judaica, Jewish Community of Helsinki", url: "https://fennojudaica.jchelsinki.fi/historia.en.html" },
    { id: "fenno-war", title: "The Second World War", publisher: "Fenno Judaica, Jewish Community of Helsinki", url: "https://fennojudaica.jchelsinki.fi/toinen-maailmansota.en.html" },
    { id: "fenno-refugees", title: "Refugees", publisher: "Fenno Judaica, Jewish Community of Helsinki", url: "https://fennojudaica.jchelsinki.fi/pakolaiset.en.html" },
    { id: "denmark-minority", title: "The German minority", publisher: "denmark.dk", url: "https://denmark.dk/people-and-culture/history/the-german-minority/" },
    { id: "thaler", title: "A Glass Half Full or Half Empty? The Post-war Treatment of the German Minority in Denmark (Peter Thaler)", publisher: "University of Southern Denmark", url: "https://portal.findresearcher.sdu.dk/en/publications/a-glass-half-full-or-half-empty-the-postwar-treatment-of-the-germ/" },
    { id: "sdu-kristensen", title: "Disputats om det tyske mindretal (Henrik Skov Kristensen)", publisher: "University of Southern Denmark", url: "https://www.sdu.dk/da/om-sdu/fakulteterne/humaniora/nyt_hum/disputats_om_tysk_mindretal" },
    { id: "lex-oksbol", title: "Hjemsendelser og de sidste spor af flygtninge, 1945-1953", publisher: "lex.dk", url: "https://lex.dk/Hjemsendelser_og_de_sidste_spor_af_flygtninge,_1945-1953" },
  ],
};
