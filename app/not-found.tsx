import { Link } from "next-view-transitions";

export default function NotFound() {
  return (
    <main className="bg-secondary text-primary flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-[family-name:var(--font-ivy-presto-headline)] text-8xl font-light tracking-tight text-primary/20 md:text-9xl">
          404
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-ivy-presto-headline)] text-3xl font-light text-primary md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-primary/80">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block border border-primary bg-primary px-8 py-3 text-secondary transition-colors hover:bg-primary/90"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
