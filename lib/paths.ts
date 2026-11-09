/**
 * The game is served at peacecatgames.com/the-other-shore through the site's
 * rewrite (Next.js multi-zones). Links between its own pages are plain <a>
 * tags with the base path: the host doesn't pass Next.js's client-side
 * navigation requests through its rewrite, so soft navigation would fail.
 * next.config.ts takes its basePath from here.
 */
export const BASE_PATH = "/the-other-shore";

export const page = (path: "/" | "/history" | "/credits"): string => (path === "/" ? BASE_PATH : `${BASE_PATH}${path}`);
