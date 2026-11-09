/**
 * Time in the game: whole minutes since midnight at the start of Tuesday
 * 28 September 1943, local time. The campaigns run from late September into
 * October 1943; the epilogues look ahead to 1945 in words, not in minutes.
 */

export const EPOCH_UTC = Date.UTC(1943, 8, 28);
const MINUTE = 60_000;

export type Minute = number;

/** Minutes for a date and time, e.g. at("1943-10-02", 21, 30). */
export function at(date: string, hour = 0, minute = 0): Minute {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  return Math.round((Date.UTC(y, m - 1, d, hour, minute) - EPOCH_UTC) / MINUTE);
}

function parts(t: Minute): Date {
  return new Date(EPOCH_UTC + t * MINUTE);
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function dayText(t: Minute): string {
  const d = parts(t);
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} 1943`;
}

/** Part of the day, as people say it. */
export function partOfDay(t: Minute): string {
  const h = parts(t).getUTCHours();
  if (h < 5) return "night";
  if (h < 9) return "early morning";
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  if (h < 21) return "evening";
  return "night";
}

export function whenText(t: Minute): string {
  return `${dayText(t)}, ${partOfDay(t)}`;
}

export function clockText(t: Minute): string {
  const d = parts(t);
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}
