"use client";

import { Closing } from "./Closing";
import { Play } from "./Play";
import { Title } from "./Title";
import { useGame } from "./useGame";

export function App() {
  const api = useGame();
  if (api.screen === "play" && api.state && !api.state.ending) return <Play api={api} />;
  if (api.screen === "closing" && api.state?.ending) return <Closing api={api} />;
  return <Title api={api} />;
}
