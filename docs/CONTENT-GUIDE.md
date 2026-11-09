# Writing The Other Shore

How to write scenes for the three campaigns. Read `prompts/the-other-shore-claude-prompt.md` first. Then read the research notes in `docs/history/` (they are the only source of historical claims), `engine/types.ts` (the API), and `content/household.ts` (the reference campaign).

## The promise

Ordinary people can work together to protect their neighbors. The crossing usually succeeds. Danger and uncertainty are real, but so are competence, hospitality, humor in ordinary life, relief and hope. This is not a game where everyone dies, and it is not a chase game.

## Voice

- **Person and tense.** Second person, present tense: "You fold the blanket twice."
- **Tone.** Plain, concrete and warm. Short paragraphs, two to four of them per scene, about 120 to 260 words.
- **Detail.** Each scene has one sensory detail that fixes it in time and place: the smell of the harbor, the blackout curtains, a ration coupon, a bicycle.
- **Humor.** Allowed where people really found it: a grandmother's opinions, a child's questions, a stubborn engine.
- **Restraint.** No graphic violence, no melodrama, no saints or monsters.
  - Danes are not all heroes. Viggo charges too much, and some people look away.
  - German officials are not all equally zealous.
  - Jewish characters act. They organize, pay, decide, help others and argue. They are not cargo.
- **Faith.** Jewish characters keep their own faith and voices: the New Year, the candlesticks, prayer, doubt. They never speak the author's Christian interpretation. Conversion is never a theme.

## History

- **Sources.** A historical claim, whether a date, a number, an institution or a procedure, appears only if it is in `docs/history/*.md` with a source. Otherwise keep it general, or make it clearly part of the fictional story.
- **Fiction.** The fictional parts are the people, the boat *Ternen*, and particular houses and coves. The notes list which inventions are safe ("Safe gameplay abstractions").
- **No quotations.** Never quote a survivor, and never invent a quotation from a real person.
- **Real people.** Real public figures appear only as names in the news (for example Niels Bohr, Duckwitz or Rabbi Melchior), at the level the notes support. They never speak in a scene.

## Knowledge

- **Each campaign knows only its own world.**
  - The rescuer doesn't know the Levins' history unless they tell him.
  - The receiver knows names only as they are spoken or written, sometimes misspelled.
- **Engine rules.**
  - Use `c.learn(person, via)` when the protagonist sees someone, and `c.hear(person, place, condition, via)` for rumors, which may be wrong.
  - Flags are namespaced: `h:` household, `r:` rescuer, `s:` receiver. The engine refuses any other campaign's flags.
- **Cast.** A campaign's `cast` lists everyone its protagonist can meet or learn of. The test suite fails if a name from outside the cast appears in that campaign's text.

## Choices

- **Real choices.** Every option changes something you can see: relationships, money, time, who is where, what is possible later, or the epilogue. Never offer two options with the same effect.
- **Order.** List the prudent course first. The test policy "careful" takes the first available option, and it should reach a good ending almost every time.
- **Hints.** Say what the character can foresee ("Slower, but you would know where she is"), never odds.
- **Unavailable options.** Use `needs` to show an option with the reason it can't be taken ("You have no way to reach the farm by telephone"). Use `show` to hide options that make no sense.
- **No hidden keys.** No single possession or choice is a hidden key to survival. Cherished things change comfort and memory, not fate.
- **No artificial triage.** There is no "choose who must die" dilemma. When space or money runs short, cooperation creates options: another boat, a pooled fund, another night.

## Risk and balance

- **Setbacks.** Most setbacks mean delay, cost, a wet night, seasickness, a changed landing place, or a temporary separation.
- **Arrest.** Arrest is possible only in standard mode (`r.mode === "standard"`), and only after the player ignores clear signals. Examples: a skipper's warning, a patrol seen that afternoon, a crowded and noisy beach.
- **Probabilities.** Use `c.roll(key, chance)` with stable keys. Keep the chances simple and document them in the scene's comment as fictional parameters.
- **Arrest is not death.** Arrest closes the branch with a brief, sourced outcome (see the notes on Theresienstadt and the Danish monitoring). Never imply that people who were arrested historically had played badly.

## The state

- **Variables.** Variables are concrete things: kroner, seats, fuel, beds, dry clothes and tiredness.
  - Each variable's `words` describes it the way the character would.
  - Keep each campaign to five to seven variables.
- **Time.** Time passes with `c.pass(minutes)`. Keep the chronology consistent with `docs/CHRONOLOGY.md`.

## Shape of a campaign

- **Length.** About twelve to fifteen substantial scenes, 45 to 75 minutes to play.
- **Chapters.** Chapters are the checkpoints for retrying.
- **Endings.** The campaign ends with named-person outcomes, each one of: safety, reunion, temporary accommodation, unresolved whereabouts, ordinary life continuing, or held.
- **Chronology.** The default course of each campaign matches the others. Where a campaign's choices change who crosses when, that change stays within that campaign.
