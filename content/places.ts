/**
 * Places. Towns, harbors and institutions are real (see docs/history/);
 * particular flats, houses, coves and schools are fictional and the
 * history page says so.
 */
import type { PlaceDef } from "../engine/types.ts";

export const PLACES: PlaceDef[] = [
  // Copenhagen and Zealand.
  { id: "flat", name: "the Levins' flat, Østerbro, Copenhagen", side: "denmark" },
  { id: "frederiksberg", name: "Grandmother Sara's flat, Frederiksberg", side: "denmark" },
  { id: "bech", name: "Mrs Bech's flat, across the landing", side: "denmark" },
  { id: "school", name: "David's school, Copenhagen", side: "denmark" },
  { id: "hospital", name: "Bispebjerg Hospital, Copenhagen", side: "denmark" },
  { id: "parsonage", name: "a parsonage in Frederiksberg", side: "denmark" },
  { id: "farm", name: "a farm in central Zealand", side: "denmark" },
  { id: "summerhouse", name: "a summer house near Espergærde", side: "denmark" },
  { id: "copenhagen", name: "Copenhagen", side: "denmark" },
  { id: "zealand", name: "the north coast of Zealand", side: "denmark" },

  // The north Øresund coast.
  { id: "snekkersten", name: "Snekkersten", side: "denmark" },
  { id: "kroghouse", name: "the Kroghs' house, Snekkersten", side: "denmark" },
  { id: "boathouse", name: "Holger's boatshed, Snekkersten", side: "denmark" },
  { id: "helsingor", name: "Helsingør", side: "denmark" },
  { id: "waiting", name: "a villa above the beach, Snekkersten", side: "denmark" },
  { id: "beach", name: "the beach below Snekkersten", side: "denmark" },
  { id: "sound", name: "the Øresund", side: "sea" },

  // Sweden.
  { id: "helsingborg", name: "Helsingborg harbor", side: "sweden" },
  { id: "raa", name: "Råå, south of Helsingborg", side: "sweden" },
  { id: "reception", name: "the reception center at a Helsingborg school", side: "sweden" },
  { id: "nystrom", name: "Mrs Nyström's flat, Helsingborg", side: "sweden" },
  { id: "hospital-se", name: "the hospital, Helsingborg", side: "sweden" },
  { id: "lindqvist", name: "the Lindqvists' flat, Helsingborg", side: "sweden" },
  { id: "sweden", name: "Sweden", side: "sweden" },

  // For the arrested, in standard mode.
  { id: "horserod", name: "the Horserød camp", side: "denmark" },
  { id: "theresienstadt", name: "Theresienstadt", side: "elsewhere" },
];
