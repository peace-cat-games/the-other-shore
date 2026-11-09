"use client";

import { page } from "@/lib/paths";
import { useEffect, useMemo, useRef, useState } from "react";

import { STORY } from "@/content";
import { AUTHOR_NOTE, CREDITS, ENCOURAGEMENT, EPILOGUE, EXPLORE, VERSES } from "@/content/closing";
import { viewOf } from "@/engine/view";

import { Button, Card, Eyebrow, Page } from "./kit";
import { HonorRoll } from "./HonorRoll";
import type { GameApi } from "./useGame";

const KIND_WORDS = { safety: "Safe", reunion: "Reunited", accommodation: "In temporary accommodation", unresolved: "Whereabouts unresolved", ordinary: "Ordinary life continuing", held: "Held" } as const;

/** The end, in a fixed order: outcomes, the history, the author's thanksgiving and verses, credits, then (only then) an invitation. */
const STEPS = ["outcomes", "history", "thanks", "credits", "explore"] as const;

export function Closing({ api }: { api: GameApi }) {
  const s = api.state!;
  const v = useMemo(() => viewOf(STORY, s), [s]);
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);
  if (!v.ending) return null;
  const at = STEPS[step]!;
  const next = step < STEPS.length - 1 ? () => setStep(step + 1) : null;

  return (
    <Page>
      <Eyebrow>
        {v.roleLabel} · {["Outcomes", "The history", "Thanksgiving", "In honor and credits", "More stories"][step]}
      </Eyebrow>
      {at === "outcomes" ? (
        <section className="mt-2 space-y-5">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold outline-none">
            {v.ending.title}
          </h1>
          {v.last.length ? (
            <div className="story card p-4">
              {v.last.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
          ) : null}
          <div className="story font-serif text-lg">
            {v.ending.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <Card label="What became of them">
            <h2 className="text-xl font-semibold">What became of them</h2>
            <ul className="mt-3 space-y-3">
              {v.ending.outcomes.map((o) => (
                <li key={o.person}>
                  <p className="font-semibold">
                    {o.name} <span className="muted font-normal">· {KIND_WORDS[o.kind]}</span>
                  </p>
                  <p className="muted">{o.text}</p>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ) : null}

      {at === "history" ? (
        <section className="mt-2 space-y-4">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold outline-none">
            {EPILOGUE.title}
          </h1>
          <div className="story font-serif text-lg">
            {EPILOGUE.paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <p className="muted text-sm">
            Sources and the line between history and fiction are on{" "}
            <a href={page("/history")} className="underline">
              the history page
            </a>
            .
          </p>
        </section>
      ) : null}

      {at === "thanks" ? (
        <section className="mt-2 space-y-5">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold outline-none">
            From the author
          </h1>
          <div className="story font-serif text-lg">
            {AUTHOR_NOTE.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <div className="space-y-3">
            {VERSES.map((x) => (
              <blockquote key={x.ref} className="rule border-l-4 pl-4 font-serif text-lg">
                <p>&ldquo;{x.text}&rdquo;</p>
                <footer className="muted mt-1 text-sm">
                  {x.ref} ({x.translation})
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="story font-serif text-lg">
            {ENCOURAGEMENT.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </section>
      ) : null}

      {at === "credits" ? (
        <section className="mt-2 space-y-4">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold outline-none">
            In honor
          </h1>
          <HonorRoll />
          <h2 className="pt-6 text-2xl font-semibold">Credits</h2>
          <ul className="space-y-2">
            {CREDITS.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {at === "explore" ? (
        <section className="mt-2 space-y-4">
          <h1 ref={heading} tabIndex={-1} className="text-3xl font-semibold outline-none">
            Thank you for playing
          </h1>
          <div className="story">
            {EXPLORE.paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          <ul className="space-y-2">
            {EXPLORE.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="underline">
                  {l.label}
                </a>
                <span className="muted">: {l.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {next ? <Button onClick={next}>Continue</Button> : null}
        {step > 0 ? (
          <Button kind="quiet" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        ) : null}
        <Button kind="quiet" onClick={() => api.setScreen("title")}>
          Back to the title
        </Button>
      </div>
    </Page>
  );
}
