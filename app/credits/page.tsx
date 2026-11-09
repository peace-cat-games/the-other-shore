import type { Metadata } from "next";
import Link from "next/link";

import { HonorRoll } from "@/components/HonorRoll";
import { Page } from "@/components/kit";
import { CREDITS } from "@/content/closing";

export const metadata: Metadata = { title: "Credits", description: "Credits for The Other Shore, and every Danish and Swedish Righteous Among the Nations." };

export default function Credits() {
  return (
    <Page>
      <p>
        <Link href="/" className="underline">
          Back to The Other Shore
        </Link>
      </p>
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">In honor</h1>
      <div className="mt-6">
        <HonorRoll />
      </div>
      <h2 className="mt-10 text-2xl font-semibold">Credits</h2>
      <ul className="mt-4 space-y-3">
        {CREDITS.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
      <h2 className="mt-10 text-2xl font-semibold">Content information</h2>
      <p className="mt-3">
        The Other Shore is about persecution and rescue. It includes the threat of arrest and deportation, fear, families separated for a time, and night crossings at sea. Nothing is shown graphically. It is hopeful in character and suitable for teenagers and adults. It is free, with no
        accounts, advertising or tracking; progress is saved only in your browser.
      </p>
    </Page>
  );
}
