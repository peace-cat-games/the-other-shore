/**
 * The roll of honour: every person Yad Vashem has recognized as Righteous
 * Among the Nations from Denmark and from Sweden, wherever they rescued, in
 * Yad Vashem's spellings, with a line each from Yad Vashem's own account.
 * Research and sources: docs/history/righteous.md. Counts as of Yad Vashem's
 * statistics of 1 January 2024, checked against its database on
 * 8 November 2026. Re-check the database before each release.
 */

export interface Righteous {
  name: string;
  /** People recognized together count separately. */
  people: number;
  where: string;
}

export const RIGHTEOUS = {
  asOf: "Yad Vashem's lists as of 1 January 2024, checked against its Righteous Database on 8 November 2026.",
  intro: [
    "Yad Vashem, Israel's memorial to the victims of the Holocaust, honors non-Jews who risked their lives to save Jews as Righteous Among the Nations. These are all those it has recognized from Denmark and from Sweden, wherever they helped.",
    "The title is given to individuals. The members of the Danish resistance saw the rescue of October 1943 as a collective act and asked not to be recognized one by one, and Yad Vashem respected their wish. Instead it planted a tree in honor of the Danish resistance, and one of the boats that carried Jews out from Gilleleje stands in its museum. That is why the Danish list is short. As Yad Vashem says, its numbers reflect the cases brought before it, not how many people helped.",
  ],
  denmark: [
    { name: "Anna Christensen", people: 1, where: "Nyborg: hid a group of Jewish children and brought them to Sweden in 1943." },
    { name: "Knud Dyby", people: 1, where: "Copenhagen: a policeman who brought Jews to fishing boats for Sweden." },
    { name: "Ellen Fogh and her son Fredrik Fogh", people: 2, where: "Copenhagen: hid family and friends and hired the boat that took them to Sweden." },
    { name: "Pastor Arnold Gunnerso and Karen Gunnerso", people: 2, where: "Gjerslev, Zealand: arranged the crossing of two young pioneers to Sweden." },
    { name: "Ester Handberg", people: 1, where: "Funen and Copenhagen: sheltered a family of five and found them a boat." },
    { name: "Esben Hansen and his sister Helga Hansen", people: 2, where: "Near Høng, Zealand: sheltered two young pioneers on their farm." },
    { name: "Knud Marstrand Christiansen and Karen Marstrand Christiansen", people: 2, where: "Copenhagen and Espergærde: sheltered refugees, and Knud took them across to Sweden by small boat." },
    { name: "Svend Norrild and Inga Norrild", people: 2, where: "The Lyngby group: found safe houses and food for Jews waiting to cross." },
    { name: "Harald Petersen", people: 1, where: "Herstedvester: drove a family to a fisherman and secretly paid their fare." },
    { name: "Robert Petersen and Gertrud Petersen", people: 2, where: "Copenhagen and Køge: took in a family of fourteen and found them a boat." },
    { name: "Henry Christian Thomsen and Ellen Margrethe Thomsen", people: 2, where: "Snekkersten: innkeepers whose inn was the meeting place of the rescue's fishermen. Henry died in Neuengamme in 1944." },
    { name: "Gerda Valentiner", people: 1, where: "A teacher who hid three children and brought them to Sweden by fishing boat." },
    { name: "Helga Holbek", people: 1, where: "Southern France: cared for Jewish children taken from the camp at Gurs." },
    { name: "Sigurd Larsen", people: 1, where: "Berlin: hid three people in a furniture shipment and went with them to Sweden." },
    { name: "Dagmar Lustrup", people: 1, where: "Thisted, 1940: moved twenty Jewish teenagers to safety; they reached Sweden and then Palestine." },
  ] as Righteous[],
  sweden: [
    { name: "Per Anger", people: 1, where: "Budapest: a diplomat at the Swedish legation who issued Swedish passports." },
    { name: "Lars Berg", people: 1, where: "Budapest: an attaché on Raoul Wallenberg's team." },
    { name: "Carl Iwan Danielsson", people: 1, where: "Budapest: head of the Swedish legation, who supported its rescue work." },
    { name: "Elisabetta Hesselblad", people: 1, where: "Rome: a Mother Superior who sheltered twelve people in her convent." },
    { name: "Elow Kihlgren", people: 1, where: "Genoa: the Swedish consul, who hid two families and arranged their escape to Switzerland." },
    { name: "Valdemar Langlet and Nina Langlet", people: 2, where: "Budapest: for the Swedish Red Cross, issued letters of protection and sheltered Jews in their home." },
    { name: "Pastor Erik Myrgren", people: 1, where: "Berlin: hid Jews in the basement of the Swedish church." },
    { name: "Erik Perwe", people: 1, where: "Berlin: pastor of the Swedish church, who hid Jews there. He was killed in a plane crash in 1944." },
    { name: "Raoul Wallenberg", people: 1, where: "Budapest: issued protective passports and ran the Swedish houses. Taken by the Soviets in January 1945, he disappeared." },
  ] as Righteous[],
  others: [{ name: "Georg Ferdinand Duckwitz", people: 1, where: "Recognized by Yad Vashem as a German. In Copenhagen he passed on the warning that the arrests were coming." }] as Righteous[],
};
