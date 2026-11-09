"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { STORY } from "@/content";
import { viewOf } from "@/engine/view";

import { Button, Card, Eyebrow } from "./kit";
import { setSea } from "./sea";
import type { GameApi } from "./useGame";

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function Play({ api }: { api: GameApi }) {
  const s = api.state!;
  const v = useMemo(() => viewOf(STORY, s), [s]);
  const heading = useRef<HTMLHeadingElement>(null);
  const [panel, setPanel] = useState<"none" | "people" | "journal" | "menu">("none");

  useEffect(() => {
    heading.current?.focus();
  }, [s.step]);

  useEffect(() => {
    setSea(api.settings.sound && v.sea);
    return () => setSea(false);
  }, [api.settings.sound, v.sea]);

  const toggle = (p: typeof panel) => setPanel(panel === p ? "none" : p);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="rule border-b bg-[var(--card)]">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm">
          <span className="font-semibold">{v.roleLabel}</span>
          <span className="muted">{v.chapter}</span>
          <span className="muted ml-auto">{v.mode === "story" ? "Story mode" : "Standard mode"}</span>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <main id="main" className="min-w-0 space-y-5">
          <p className="muted text-sm">
            {v.when} · {v.place}
          </p>

          {v.last.length ? (
            <div className="fade-in card border-l-4 border-l-[var(--color-sea-3)] p-4" role="status" aria-live="polite">
              <div className="story">
                {v.last.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </div>
          ) : null}

          <article className="fade-in" key={s.step}>
            <h1 ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none sm:text-3xl">
              {v.title}
            </h1>
            <div className="story mt-4 font-serif text-lg">
              {v.body.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          </article>

          <nav aria-label="Choices">
            <ol className="space-y-3">
              {v.options.map((o, i) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => api.choose(o.id)}
                    disabled={Boolean(o.blocked)}
                    aria-describedby={o.hint || o.blocked ? `hint-${o.id}` : undefined}
                    className="btn btn-quiet w-full flex-col items-start bg-[var(--card)] py-3"
                  >
                    <span className="font-semibold">
                      <span className="muted mr-2 font-normal">{i + 1}.</span>
                      {o.label}
                    </span>
                    {o.hint || o.blocked ? (
                      <span id={`hint-${o.id}`} className="muted mt-1 text-sm">
                        {o.blocked ?? o.hint}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          {api.notice ? (
            <p role="alert" className="card p-3">
              {api.notice}
            </p>
          ) : null}
        </main>

        <aside className="space-y-4" aria-label="Your situation">
          <Card className="!p-4">
            <Eyebrow>Your situation</Eyebrow>
            <dl className="mt-2 space-y-2 text-sm">
              {v.status.map((x) => (
                <div key={x.label}>
                  <dt className="font-semibold">{x.label}</dt>
                  <dd className="muted">{x.words}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <div className="flex flex-wrap gap-2 text-sm">
            <Button kind="quiet" onClick={() => toggle("people")}>
              People {panel === "people" ? "▴" : "▾"}
            </Button>
            <Button kind="quiet" onClick={() => toggle("journal")}>
              Journal {panel === "journal" ? "▴" : "▾"}
            </Button>
            <Button kind="quiet" onClick={() => toggle("menu")}>
              Menu {panel === "menu" ? "▴" : "▾"}
            </Button>
          </div>
          {panel === "people" ? (
            <Card className="!p-4" label="People">
              <p className="muted text-sm">Where you last had word of them, and when. What you know may be out of date.</p>
              <ul className="mt-3 space-y-3 text-sm">
                {v.people.length === 0 ? <li className="muted">No one yet.</li> : null}
                {v.people.map((p) => (
                  <li key={p.id}>
                    <p className="font-semibold">{p.name}</p>
                    <p className="muted">{p.about}</p>
                    <p>{p.where}</p>
                    <p className="muted text-xs">As of {p.asOf}</p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
          {panel === "journal" ? (
            <Card className="!p-4" label="Journal">
              <ul className="space-y-2 text-sm">
                {v.journal.length === 0 ? <li className="muted">Nothing written yet.</li> : null}
                {[...v.journal].reverse().map((j, i) => (
                  <li key={i}>
                    <span className="muted">{j.when}: </span>
                    {j.text}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
          {panel === "menu" ? (
            <Card className="!p-4 space-y-3 text-sm" label="Menu">
              <p className="muted">
                Your progress is saved after every choice{api.saved === "failed" || api.saved === "unavailable" ? " (not in this browser: save to a file instead)" : ""}.
              </p>
              <div>
                <p className="font-semibold">Retry from the start of a chapter</p>
                <ul className="mt-2 space-y-2">
                  {v.checkpoints.map((c) => (
                    <li key={c}>
                      <Button kind="quiet" onClick={() => api.retry(c)}>
                        {c}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button kind="quiet" onClick={() => download(`the-other-shore-${s.role}.json`, api.exportText())}>
                  Save to a file
                </Button>
                <Button kind="quiet" onClick={() => api.setScreen("title")}>
                  Back to the title
                </Button>
              </div>
              <fieldset className="space-y-2">
                <legend className="font-semibold">Settings</legend>
                <label className="flex items-center gap-2">
                  Text size
                  <select value={api.settings.textSize} onChange={(e) => api.changeSettings({ ...api.settings, textSize: e.target.value as typeof api.settings.textSize })} className="rule min-h-11 rounded border bg-transparent px-2">
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                    <option value="larger">Larger</option>
                  </select>
                </label>
                <label className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" checked={api.settings.reduceMotion} onChange={(e) => api.changeSettings({ ...api.settings, reduceMotion: e.target.checked })} className="size-4" />
                  Reduce motion
                </label>
                <label className="flex min-h-11 items-center gap-2">
                  <input type="checkbox" checked={api.settings.sound} onChange={(e) => api.changeSettings({ ...api.settings, sound: e.target.checked })} className="size-4" />
                  Sound of the sea during the crossing
                </label>
              </fieldset>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
