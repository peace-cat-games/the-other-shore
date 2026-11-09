"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { STORY } from "@/content";
import type { Mode, RoleId } from "@/engine/types";

import { Button, Card, Eyebrow, Footer } from "./kit";
import type { GameApi } from "./useGame";

const MODES: { id: Mode; label: string; text: string }[] = [
  { id: "story", label: "Story mode", text: "Setbacks bring delay, cost or a change of plan. No crossing ends in arrest." },
  { id: "standard", label: "Standard mode", text: "As in story mode, but ignoring clear warnings at the coast can end in arrest. Most competent crossings still succeed." },
];

export function Title({ api }: { api: GameApi }) {
  const [mode, setMode] = useState<Mode>("story");
  const file = useRef<HTMLInputElement>(null);
  return (
    <div className="flex min-h-dvh flex-col">
      <main id="main" className="mx-auto w-full max-w-3xl flex-1 space-y-8 px-4 py-10 sm:py-14">
        <header>
          <Eyebrow>Peace Cat Games · a free historical rescue game</Eyebrow>
          <h1 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">The Other Shore</h1>
          <p className="mt-1 font-serif text-xl text-[var(--color-sea-3)] sm:text-2xl">October 1943</p>
        </header>

        <div className="story font-serif text-lg">
          <p>
            In the autumn of 1943 the German occupiers of Denmark prepared to arrest the country&apos;s Jews. Warned in time, about 7,200 Jews and several hundred of their non-Jewish relatives crossed the Øresund to neutral Sweden in a few weeks, in fishing boats and small craft, helped by neighbors,
            strangers and Swedes waiting on the other shore.
          </p>
          <p>Ordinary people worked together to protect their neighbors, and most crossings succeeded. Play the story from three shores.</p>
        </div>

        <aside className="card p-4 text-base" aria-label="Content information">
          <p className="font-semibold">Content information</p>
          <p className="muted mt-1">
            This game is about persecution and rescue. It includes the threat of arrest and deportation, fear, families separated for a time, and night crossings at sea. Nothing is shown graphically. It is hopeful in character, and suitable for teenagers and adults. Each campaign takes
            about an hour, and you can save and stop at any time.
          </p>
        </aside>

        <fieldset className="space-y-2">
          <legend className="font-semibold">How forgiving should the story be?</legend>
          {MODES.map((m) => (
            <label key={m.id} className="card flex cursor-pointer items-start gap-3 p-3">
              <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} className="mt-1.5 size-4" />
              <span>
                <span className="font-semibold">{m.label}.</span> <span className="muted">{m.text}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <section aria-labelledby="roles-h" className="space-y-4">
          <h2 id="roles-h" className="text-2xl font-semibold">
            Choose a campaign
          </h2>
          {STORY.campaigns.map((c) => (
            <Card key={c.role}>
              <h3 className="text-xl font-semibold">{c.label}</h3>
              <p className="muted mt-1">{c.pitch}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={() => api.begin(c.role, mode)}>Begin: {c.label}</Button>
                {api.autos[c.role] ? (
                  <Button kind="quiet" onClick={() => api.resume(c.role as RoleId)}>
                    Continue where you stopped
                  </Button>
                ) : null}
              </div>
            </Card>
          ))}
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <Button kind="quiet" onClick={() => file.current?.click()}>
            Load a save file
          </Button>
          <input
            ref={file}
            type="file"
            accept=".json,application/json"
            className="sr-only"
            aria-label="Choose a save file"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) api.loadText(await f.text());
              e.target.value = "";
            }}
          />
          <Link href="/history" className="underline">
            The history behind the game
          </Link>
          <Link href="/credits" className="underline">
            Credits
          </Link>
        </div>
        {api.notice ? (
          <p role="alert" className="card border-[var(--color-amber)] p-3">
            {api.notice}
          </p>
        ) : null}
        {api.saved === "unavailable" ? <p className="muted text-sm">This browser isn&apos;t saving progress (storage is unavailable). You can still save to a file during play.</p> : null}
      </main>
      <Footer />
    </div>
  );
}
