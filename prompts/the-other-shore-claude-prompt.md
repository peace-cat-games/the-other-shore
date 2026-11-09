# Claude implementation prompt: The Other Shore — October 1943

Build a complete, polished, free historical narrative strategy game for Peace Cat Games (PCG), working title **The Other Shore: October 1943**. “Viking Boats 1943” is only a development nickname.

Work in the existing repository. Read its instructions, inspect the current game architecture, and reuse established narrative, save, accessibility, and catalog conventions. Implement the game, not just a design document. Make reasonable implementation decisions without repeatedly requesting confirmation. Do not invent existing APIs or claim checks passed without running them. Do not publish externally unless the surrounding task authorizes publication.

## Product purpose

This is a complete free game and an introduction to the narrative model used by PCG’s paid games. All three perspectives are free and immediately available. No paywall, mandatory account, advertising interruptions, or truncated ending.

The emotional promise is: ordinary people can cooperate successfully to protect their neighbors. The crossing is usually completed. This must not inherit the near-certain-death balance of other historical games. Danger and uncertainty coexist with competence, hospitality, humor in ordinary life, relief, and hope.

Present it as a historical rescue game. Follow existing catalog conventions for placement; do not automatically label it horror. If placed in After Dark, identify its hopeful character clearly.

## Historical setting and research

Set the main action in late September and October 1943, during the escape of Jews from occupied Denmark to neutral Sweden. Use fictional protagonists and supporting characters, real researched geography, and historically grounded circumstances.

About 7,200 Jews and several hundred non-Jewish relatives escaped. Jewish initiative, warnings, Danish assistance, and Swedish reception all matter. Do not depict Jewish people as passive cargo, all Danes as identical saints, or every German official as equally active in preventing escape.

Choose one historically supported coastal corridor for the initial release. Research departure and arrival arrangements, boats, communications, travel times, expenses, and geography before writing detailed scenes. Do not silently turn invented procedures into historical claims.

Source starting points:
- US Holocaust Memorial Museum, Denmark:
  https://encyclopedia.ushmm.org/content/en/article/denmark
- USHMM, Rescue in Denmark:
  https://encyclopedia.ushmm.org/content/en/article/rescue-in-denmark
- Danish Jewish Museum, Safe Haven (Swedish arrival protocols):
  https://www.jewmus.dk/en/udforsk/safe-haven
- Jewish Community of Helsinki, historical overview:
  https://fennojudaica.jchelsinki.fi/historia.en.html
- University of Southern Denmark, German minority after 1945:
  https://portal.findresearcher.sdu.dk/en/publications/a-glass-half-full-or-half-empty-the-postwar-treatment-of-the-germ/
- Danish official information on its German minority:
  https://denmark.dk/people-and-culture/history/the-german-minority/

Verify detailed claims against authoritative sources. Keep a concise historical notes/source file and an accessible in-game history page. Distinguish documented events, fictional composites, and gameplay abstractions. Never invent survivor quotations. Do not copy long passages from sources.

## Three campaigns

The role labels are “Jewish household,” “Danish rescuer,” and “Swedish receiver.” Jewish and Danish identities overlap; do not present them as mutually exclusive national categories.

### 1. Jewish household

Play a member of a Jewish household in Denmark. Establish ordinary life and relationships before the warning. Let the player organize the escape, contact people, contribute skills and resources, and help fellow travelers.

Progression: warning → contact relatives → pack → reach shelter → arrange passage → reach the coast → cross → arrival and reunion.

Decisions concern credible contacts, incomplete information, timing, manageable luggage, household needs, money, and separation. More than one reasonable strategy should work. An emotionally significant possession must not become a hidden mandatory key to survival.

Example dilemma: a relative is in another shelter and your passage leaves tonight. Options include seeking information, arranging separate crossings with a reunion plan, or waiting. Avoid obvious saint-versus-monster buttons.

### 2. Danish rescuer

Play a boat owner working with a small shore network.

Loop: receive requests → confirm shelter and passage → arrange funds and supplies → prepare boat → board → cross → rest or repair → decide whether to return.

Track safe capacity, fuel/expenses, crew fatigue, shelters, contacts, and information freshness. Represent payments with nuance: operating costs, risk, pooled support, and exploitative demands can differ. Do not imply every fisherman acted for the same motive.

When space is insufficient, players can arrange another boat, improve shelter, obtain funds, or reschedule. Cooperation should create options; not every departure is an artificial choice of who must die.

### 3. Swedish receiver

Play a civilian reception organizer collaborating with officials, medical staff, transport providers, and host households.

Core work: locate arrivals, arrange dry clothing and care, find beds, coordinate transport, record names accurately, and reunite people across landing points.

Admission is not a rejection puzzle. Registration supports care and reunion. Give this role meaningful decisions and narrative weight without inventing combat or equivalent personal persecution.

Example challenges: changed landing place, delayed transport, inconsistent name spellings, separated relatives, arrivals needing assistance, and temporarily uneven accommodation capacity.

## Shared narrative and crossing

Use recurring households and helpers across campaigns, with consistent identities and chronology. Each campaign remains independently understandable. Do not leak information a protagonist could not know.

The sea crossing is the emotional centerpiece. Use a short sequence of consequential choices, atmospheric text and optional sound. No mandatory reflex test or combat. Household members care for one another; the skipper assesses conditions; the receiver responds to uncertain arrivals.

Avoid a constant patrol-chase fantasy. Weather, delay, discomfort, fear, incomplete information, and logistics can sustain tension. Route and hazard details must fit the researched corridor.

## Mechanics and balance

Use an explicit, data-driven state and event model, compatible with the repository. Track only variables that affect understandable choices. Suggested state: time, household whereabouts, fatigue, supplies, funds, boat readiness/capacity, shelter status, contacts, and known information.

Surface useful qualitative information rather than inscrutable hidden morality scores. Distinguish what the player knows from underlying world state.

Ordinary competent play should usually succeed. Most setbacks mean delay, cost, temporary separation, or changed plans. Serious risks need understandable signals. Historical aggregate survival figures are not per-voyage dice probabilities.

Capture and death can occur when historically plausible, with restrained treatment. Capture is not automatically immediate death. A brief sourced outcome can close that branch; do not expand into a second prison game. Never suggest that historical victims died because they played badly.

Difficulty should increase coordination demands rather than manufacture mass casualties. Offer a forgiving story mode and accessible retry/checkpoint behavior. No leaderboard ranking Holocaust suffering.

## Scope and presentation

Target roughly 45–75 minutes per role, around twelve substantial scenes per role with meaningful branches and shared supporting events. Prioritize a finished compact game over a huge empty framework.

Use an accessible mobile-first interface, readable typography, restrained coastal colors, clear choices, keyboard support, visible focus, reduced-motion support, and optional audio. No autoplay audio. Include save/resume, restart, role selection, historical notes, credits, and content information.

Different choices must materially change relationships, available options, timing, or epilogues. Avoid three cosmetic reskins of the same campaign.

Finish with named-person outcomes: safety, reunion, temporary accommodation, unresolved whereabouts, and ordinary life continuing. A concise researched 1945 return epilogue can provide closure. Do not guarantee that every home and possession was perfectly preserved.

## Free release and commercial relationship

The game demonstrates PCG’s narrative format through a complete experience. Reuse its established engine where available, but do not impose the darker games’ balance.

Only after the full ending and credits, offer an unobtrusive “Explore more stories” link to verified existing catalog routes. Clearly describe darker paid titles. No invented products, prices, or destinations. Never interrupt the rescue story with a sales pitch.

## Author’s Christian closing and exact travel correction

The author wants a warm, explicitly personal Christian thanksgiving, love for Denmark, Finland, and Sweden, and admiration for acts of protection and hospitality. Preserve this voice rather than replacing it with impersonal corporate copy.

Travel facts are EXACTLY:
- The author has visited Finland. Do not invent details or an itinerary.
- The author’s experience of Denmark has so far been limited to Copenhagen airport.
- The author’s experience of Sweden has so far included Arlanda airport and Haparanda.
- Do not infer lengths of stay, or visits to Copenhagen or Stockholm.
- The author has learned from these countries beyond direct travel and feels love and admiration for them.
- Imagining unseen places is not firsthand experience. Do not describe imagined scenes as memories.

Use this author-note passage as the wording baseline:

“My connection with these countries is still growing. I have visited Finland; my experience of Denmark has so far been limited to Copenhagen airport, and of Sweden to Arlanda airport and Haparanda. There is much I have yet to see. Through what I have experienced and what I have learned about them, I have developed a deep love and admiration for Denmark, Finland, Sweden, and their people.

“I thank God for those who sheltered their neighbors in a time of persecution: the people of Denmark who helped Jews escape, and the people of Sweden who welcomed them. I also honor Finland’s protection of its Jewish citizens, a story we intend to explore in another game.

“In these acts of courage and hospitality, I see people living up to the Christian calling represented by the crosses on their flags: to welcome the stranger, protect the vulnerable, and overcome evil with good.

“This game is offered freely, with gratitude.”

Keep the future Finland game as an intention, not a release-date promise.

Also honor Denmark’s refusal to collectively expel its established German minority after the war, preferably in a separate, sourced reflection on rejecting collective punishment. Do not claim all three countries uniformly retained all ethnic Germans, German citizens, refugees, or soldiers. These are different categories.

Historical notes must acknowledge Finland’s deportation of eight Jewish refugees, seven of whom were killed; distinguish that from protection of Jewish citizens. Do not imply the whole wartime record was flawless. Keep contextual notes clear and proportionate without turning the personal thanksgiving into a catalogue of disclaimers.

Keep Jewish characters’ own faith and voices intact. The author’s Christian interpretation belongs to the author’s note; do not attribute it to Jewish refugees or make conversion a victory condition.

Include these KJV excerpts at the ending, with references and translation identified:
- “I was a stranger, and ye took me in.” — Matthew 25:35
- “Be not overcome of evil, but overcome evil with good.” — Romans 12:21

Encourage people to help the poor, the sick (including drug addicts and the mentally ill) and strangers. Do not follow the player to do evil but to overcome evil with good.

End order: individual outcomes → historical epilogue → author’s thanksgiving and Bible verses → credits → optional catalog invitation.

## Delivery and acceptance

Implement all three playable campaigns, complete endings, the historical notes, and the corrected author’s note. No placeholder scenes or “coming soon” role buttons.

Test meaningful invariants: each campaign can reach its ending, saves restore correctly, family whereabouts remain consistent, capacity and resources behave correctly, choices have effects, role knowledge is bounded, and historical notes/credits are reachable. Run relevant repository checks and manually inspect mobile and desktop layouts if tooling permits.

Before delivery, check every travel claim against the exact author facts above and every categorical historical claim against the source notes.

Report what you built, how to run it, what you verified, and any remaining historical uncertainties. Do not claim publication or completed verification that did not occur.

