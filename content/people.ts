/**
 * The people of The Other Shore. All are fictional, composed to fit the
 * historical record; none portrays a real person. The same households and
 * helpers recur across the three campaigns with the same identities, ages
 * and chronology. `about` is only what anyone meeting them could see or be
 * told; each campaign decides what its protagonist learns.
 */
import type { PersonDef } from "../engine/types.ts";

export const PEOPLE: PersonDef[] = [
  // The Levin household, Østerbro, Copenhagen: Danish Jews for generations.
  { id: "hanna", name: "Hanna Levin", short: "Hanna", about: "Thirty-nine, bookkeeper at a printing works in Copenhagen.", household: "levin" },
  { id: "david", name: "David Levin", short: "David", about: "Forty-three, teaches Danish and history at a municipal school.", household: "levin" },
  { id: "ruth", name: "Ruth Levin", short: "Ruth", about: "Thirteen. Reads everything; wants to be a doctor.", household: "levin" },
  { id: "benny", name: "Benjamin Levin", short: "Benny", about: "Five. Called Benny. Afraid of the dark, not of dogs.", household: "levin" },
  { id: "sara", name: "Sara Levin", short: "Grandmother Sara", about: "Seventy-seven, David's mother, a widow in Frederiksberg. Keeps the festivals; walks with a stick.", household: "levin" },
  { id: "peter", name: "Peter Weil", short: "Peter", about: "Seventeen, from Vienna. Came to Denmark in 1939 with a group of Jewish young people to train in farming; works on a farm in central Zealand. The Levins' friend." },

  // Copenhagen helpers.
  { id: "kirsten", name: "Kirsten Bech", short: "Mrs Bech", about: "The Levins' neighbor across the landing. A widow; sings in the church choir." },
  { id: "ole", name: "Ole Thomsen", short: "Ole", about: "David's colleague, a young teacher. Knows people who know people." },

  // The north Zealand coast.
  { id: "anders", name: "Anders Krogh", short: "Anders", about: "Forty-six, fishes the Sound from Snekkersten in his boat, the Ternen." },
  { id: "inger", name: "Inger Krogh", short: "Inger", about: "Anders's wife. Keeps the accounts and the house, and her own counsel." },
  { id: "poul", name: "Poul Krogh", short: "Poul", about: "Seventeen, Anders's son and his crew. Quick with knots, slow to sleep." },
  { id: "else", name: "Else Brandt", short: "Dr Brandt", about: "A physician in Helsingør. Calm voice, a black bag, a long list of addresses." },
  { id: "erik", name: "Erik Lund", short: "Erik", about: "Drives a taxi in Helsingør and knows every road along the coast." },
  { id: "holger", name: "Holger Mikkelsen", short: "Holger", about: "A retired boatbuilder who can mend any engine on the coast." },
  { id: "viggo", name: "Viggo Hansen", short: "Viggo", about: "Another fisherman from along the coast, with a bigger boat and bigger prices." },

  // Helsingborg.
  { id: "marta", name: "Märta Lindqvist", short: "Märta", about: "Forty-four, a schoolteacher in Helsingborg and a Red Cross volunteer." },
  { id: "nils", name: "Nils Lindqvist", short: "Nils", about: "Märta's husband, a clerk at the harbor office." },
  { id: "gunnar", name: "Gunnar Sjöberg", short: "Dr Sjöberg", about: "A physician in Helsingborg, brisk and kind." },
  { id: "ivar", name: "Ivar Persson", short: "Constable Persson", about: "A Helsingborg police constable assigned to register arrivals." },
  { id: "elsa", name: "Elsa Nyström", short: "Mrs Nyström", about: "A widow with a large flat near the station and strong opinions about soup." },
  { id: "folke", name: "Folke Berg", short: "Folke", about: "Runs a bus and haulage firm in Helsingborg." },

  // Others crossing that October.
  { id: "klara", name: "Klara Feld", short: "Mrs Feld", about: "Came to Copenhagen from Berlin in 1938. Speaks German and careful Danish.", household: "feld" },
  { id: "moritz", name: "Moritz Feld", short: "Mr Feld", about: "Klara's husband, a former bookseller. Speaks German and careful Danish.", household: "feld" },
  { id: "aron", name: "Aron Melby", short: "Aron", about: "A Copenhagen furrier, Jewish, married to Lis.", household: "melby" },
  { id: "lis", name: "Lis Melby", short: "Lis", about: "Aron's wife, not Jewish, crossing with him. Expecting a child in December.", household: "melby" },
];
