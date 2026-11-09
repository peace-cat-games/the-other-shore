/** The whole story: the people, the places and the three campaigns. */
import type { Story } from "../engine/types.ts";
import { HOUSEHOLD } from "./household.ts";
import { PEOPLE } from "./people.ts";
import { PLACES } from "./places.ts";
import { RESCUER } from "./rescuer.ts";

export const STORY: Story = { people: PEOPLE, places: PLACES, campaigns: [HOUSEHOLD, RESCUER] };
