import type { Metadata } from "next";
import { page } from "@/lib/paths";

import { Page } from "@/components/kit";
import { HISTORY } from "@/content/history";

export const metadata: Metadata = { title: "The history", description: "What happened in October 1943, where the figures come from, and where The Other Shore invents." };

export default function History() {
  const n = new Map(HISTORY.sources.map((s, i) => [s.id, i + 1]));
  return (
    <Page>
      <p>
        <a href={page("/")} className="underline">
          Back to The Other Shore
        </a>
      </p>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">The history</h1>
      <div className="story mt-4 font-serif text-lg">
        {HISTORY.intro.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
      {HISTORY.sections.map((s) => (
        <section key={s.title} className="mt-8">
          <h2 className="text-2xl font-semibold">{s.title}</h2>
          <div className="story mt-3 font-serif text-lg">
            {s.paragraphs.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          {s.sources.length ? (
            <p className="muted mt-2 text-sm">
              Sources:{" "}
              {s.sources.map((id, i) => (
                <span key={id}>
                  {i ? ", " : ""}
                  <a href={`#source-${id}`} className="underline">
                    {n.get(id)}
                  </a>
                </span>
              ))}
            </p>
          ) : null}
        </section>
      ))}
      <section className="mt-10" aria-labelledby="sources-h">
        <h2 id="sources-h" className="text-2xl font-semibold">
          Sources
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm">
          {HISTORY.sources.map((s) => (
            <li key={s.id} id={`source-${s.id}`}>
              <a href={s.url} className="underline">
                {s.title}
              </a>
              <span className="muted">. {s.publisher}.</span>
            </li>
          ))}
        </ol>
      </section>
    </Page>
  );
}
