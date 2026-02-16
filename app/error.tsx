"use client";

import { useEffect } from "react";
import { Link } from "next-view-transitions";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-secondary text-primary flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-[family-name:var(--font-ivy-presto-headline)] text-3xl font-light text-primary md:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-primary/80">
          We encountered an error. You can try again or return to the home page.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="border border-primary bg-primary px-8 py-3 text-secondary transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-block border border-primary px-8 py-3 text-primary transition-colors hover:bg-primary/10"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
