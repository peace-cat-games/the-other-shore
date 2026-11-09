import Link from "next/link";

import { Page } from "@/components/kit";

export default function NotFound() {
  return (
    <Page>
      <h1 className="text-3xl font-semibold">Not found</h1>
      <p className="mt-4">
        <Link href="/" className="underline">
          Back to The Other Shore
        </Link>
      </p>
    </Page>
  );
}
