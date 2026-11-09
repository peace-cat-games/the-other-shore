# Design decisions

Where the specification (`prompts/the-other-shore-claude-prompt.md`) left room, here is what we chose and why.

## Placement and price

- **Free, complete and hopeful.**
  - No accounts, ads, tracking or paywall.
  - Progress is saved only in the player's browser.
- **Not part of After Dark.** The owner decided this on 2026-11-08. The game belongs with the main Peace Cat Games catalogue.
- **The invitation at the end.** "Explore more stories" appears only after the credits. It links to two real routes, `/games` and `/after-dark`, and describes the After Dark games honestly: darker, with content notices, planned as paid.

## History

- **The corridor** is the northern Øresund: Snekkersten, just south of Helsingør, to Helsingborg and Råå.
  - It was heavily used. About 1,000 people left from Snekkersten alone.
  - It has the best-documented local organization.
  - The reasons are in `docs/history/corridor.md`.
- **Danger comes from land, not sea.**
  - German police caught no refugee boat at sea in October 1943. Arrests happened on beaches, in harbors and in hiding places, often through informers.
  - So a light seen at sea frightens people and passes, and in standard mode an arrest can happen only on the shore.
- **Prices are one skipper's prices, inside the documented range.**
  - The *Ternen* charges what the organized groups charged: 500 kroner a person from those who can, with a fund for those who can't.
  - Viggo charges 1,500, like the profiteers did.
  - The average that October was about 1,000.
- **The boat's name.** The research flagged that "Ellen" was the first name of a real Snekkersten rescuer, Ellen Margrethe Thomsen. The boat was renamed *Ternen* (the tern), which matches no documented boat.
- **Fiction is marked.**
  - The history page has a section, "What is history and what is fiction".
  - The credits say the people, the boat and the houses are invented.

## The model

- **The state.** A campaign's state is its role, mode, seed and the list of choices. Everything else is replayed from those. A save file is tiny, reloading cannot reroll a crossing, and retrying a chapter means replaying the choices made before it.
- **Truth and knowledge are kept apart.**
  - `where` holds where each person really is.
  - `known` holds what the protagonist last heard, and how. The People panel shows only `known`, with "as of" and the source.
- **Bounded knowledge is enforced.**
  - Each campaign has a cast and its own flag prefix.
  - The engine refuses anything outside them.
  - A test fails if a campaign's text names someone outside its cast.
- **No hidden morality.** Variables are things the protagonist could count or feel, such as kroner, seats, fuel, beds and tiredness. They are shown in words.
- **Risk counts ignored warnings.**
  - The only hidden number is the count of clear warnings the player chose to ignore: a skipper's request to wait, a police warning, a crowded jetty, a noisy beach.
  - It matters only in standard mode.
  - The chances are fictional simulation rules, documented in the scene files and on the history page. They are never presented as historical odds.
- **Cooperation creates options.**
  - When there are more people than seats, the choices are another boat, two crossings, or another night.
  - Taking everyone at once is shown but blocked: nineteen is more than the boat can carry safely.
  - Nobody is ever chosen to be left behind.

## Modes

- **Story mode.** Setbacks bring delay, cost, seasickness, a changed landing place or a night turned back. Nothing ends in arrest.
- **Standard mode.** Ignoring two or more clear warnings can end in arrest:
  - for the household, on the beach;
  - for the rescuer, at home after landing his passengers.

  Arrest closes the branch with a short, sourced outcome:
  - for the household, Horserød, Theresienstadt, Danish parcels and pressure, and the white buses;
  - for the rescuer, the Danish police and courts, the case dropped, and the boat seized until 1945.

  It is not death, and the text never blames the arrested.
- **Retry.** The menu lists every chapter reached. Retrying one replays the campaign with the same seed up to that chapter.

## The three campaigns

- **One shared world, three independent stories.** The campaigns share people, dates and a default course (`docs/CHRONOLOGY.md`).
- **The Levins in each campaign.** The household crosses on Tuesday night on the *Ternen*. The rescuer carries them, and later Sara. The receiver registers them, and later reunites them with Sara, whose name arrives from Råå misspelled.
- **Branches stay local.** Each campaign can branch away from the default course. Its branches do not leak into the others.
- **Different mechanics, not reskins.**
  - The household's play is about errands under time pressure, packing, shelter, money and separation.
  - The rescuer's is about capacity, fuel, readiness, signals and fatigue.
  - The receiver's is about beds, clothes, transport, accurate names and reunions.

## Presentation

- **Mobile first.** Layouts are tested at phone and desktop widths.
- **Style.** Restrained coastal colors (sea-slate, fog and sand, with amber used sparingly), a light and a dark scheme, and Literata for the story with Atkinson Hyperlegible for the interface.
- **Keyboard support.** Every choice is a button. Focus moves to each new scene heading, and focus is always visible. There are settings for text size and reduced motion.
- **Sound.** The optional sea sound is synthesized in the browser. It plays only during crossings, and only after the player turns it on; nothing plays automatically.
- **The order of the end.** It is fixed: outcomes, historical epilogue, the author's thanksgiving and verses, credits, then the invitation.

## Balance (from `npm run walk`)

The "careful" policy takes the first available option in each scene. The scenes list the prudent course first. Careful play reaches a safe ending in every seed and both modes. Random play in standard mode ends in arrest in roughly one campaign in ten. Run `npm run walk` for current figures.
