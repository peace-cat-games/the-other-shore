# The Other Shore: October 1943

A free historical rescue game by Peace Cat Games about the escape of Denmark's Jews to Sweden in October 1943. It has three campaigns, each about an hour long:

- **Jewish household**: Hanna Levin of Copenhagen gets her family to the other shore.
- **Danish rescuer**: Anders Krogh, a fisherman of Snekkersten, takes people across in his boat.
- **Swedish receiver**: Märta Lindqvist, a Helsingborg schoolteacher, meets the boats, finds beds and reunites families.

Ordinary people cooperating to protect their neighbors usually succeed here. The characters are fictional; the history is sourced, and the in-game history page says where the game invents.

## Running it

```sh
npm install
npm run dev        # http://localhost:3000
npm test           # engine, story invariants, saves
npm run typecheck
npm run lint
npm run build
npm run walk       # endings and coverage for every campaign
```

## Layout

| Path | Contents |
|---|---|
| `engine/` | The narrative engine: pure TypeScript, keyed randomness, replayable campaigns. |
| `content/` | The story: people, places, the three campaigns, the closing pages and the history page. |
| `persistence/` | Saves (role, mode, seed and choices) and browser storage. |
| `components/`, `app/` | The interface. |
| `docs/` | `CONTENT-GUIDE.md` (how to write scenes), `DESIGN.md` (decisions), `CHRONOLOGY.md` (the shared timeline), `history/` (research notes with sources). |

The specification is `prompts/the-other-shore-claude-prompt.md`.

## License

The source code, story, research notes and documentation are released under the [Christian Open Source License (COSL) v1.0](LICENSE.md): free to use, change and share, including commercially, under the same license and subject to its ethical use restrictions. Fonts, the Peace Cat Games name and logo, and cited sources keep their own terms; see [NOTICE.md](NOTICE.md).
