/** Small shared pieces of the interface. */
import Link from "next/link";
import type { ReactNode } from "react";

export function Button({ children, onClick, kind = "primary", disabled, type = "button", describedBy }: { children: ReactNode; onClick?: () => void; kind?: "primary" | "quiet"; disabled?: boolean; type?: "button" | "submit"; describedBy?: string }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-describedby={describedBy} className={`btn ${kind === "primary" ? "btn-primary" : "btn-quiet"}`}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <section aria-label={label} className={`card p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="muted text-sm tracking-wide uppercase">{children}</p>;
}

export function Footer() {
  return (
    <footer className="rule mt-auto border-t px-4 py-6 text-center text-sm">
      <span className="muted">
        <a href="https://www.peacecatgames.com" className="underline">
          Peace Cat Games
        </a>{" "}
        ·{" "}
        <Link href="/history" className="underline">
          The history
        </Link>{" "}
        ·{" "}
        <Link href="/credits" className="underline">
          Credits
        </Link>
      </span>
    </footer>
  );
}

export function Page({ children, width = "max-w-3xl" }: { children: ReactNode; width?: string }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main id="main" className={`mx-auto w-full ${width} flex-1 px-4 py-8 sm:py-12`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
