# The Other Shore: rules for AI sessions

The specification is `prompts/the-other-shore-claude-prompt.md`. How to write scenes is in `docs/CONTENT-GUIDE.md`, design decisions in `docs/DESIGN.md`, the shared chronology in `docs/CHRONOLOGY.md`, and the research behind every historical claim in `docs/history/`.

- **Licensed under COSL 1.0** (owner's decision, 2026-11-08). `LICENSE.md` is an unmodified copy of `~/Documents/projects/cosl/LICENSE.md`; never edit it. Third-party terms (fonts, the Peace Cat Games logo, cited sources) are in `NOTICE.md`.
- **Free and hopeful.** No paywall, no account, no ads, no truncated ending. Not part of After Dark: the owner decided (2026-11-08) that it belongs with the main catalogue. Ordinary competent play usually succeeds; setbacks are mostly delay, cost or separation.
- **History is sourced or general.** State as fact only what `docs/history/*.md` supports with a source. Never invent a survivor quotation, a citation, a statistic or a real person's words. The people, the boat *Ternen*, and particular houses and coves are fiction, and the history page says so.
- **The author's words are fixed.** `AUTHOR_NOTE` in `content/closing.ts` follows the spec's baseline wording, with the exact travel facts (a test checks them). Never add travel the author didn't make. The Christian interpretation belongs only to the author's note, never to Jewish characters.
- **Knowledge is bounded.** Each campaign has a cast and namespaced flags (`h:`, `r:`, `s:`); the engine and tests enforce both.
- **Layers.** `engine/` is pure TypeScript (no React, DOM, I/O, `Date` or `Math.random`); randomness only through keyed draws. `content/` is the authored story. `persistence/` saves and replays. `components/` and `app/` are the UI.
- **Never push to `main`.** Work on a branch, open a PR, merge only when CI is green. Not deployed, and not listed on peacecatgames.com, unless the owner asks.
- Relative imports with `.ts` extensions in anything a test imports.
- `npm test`, `npm run typecheck`, `npm run lint` and `npm run build` must pass. `npm run walk` reports endings and coverage for every campaign.
