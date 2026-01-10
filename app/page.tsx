import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-secondary text-primary">
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/hero-2.jpg"
          alt="Hero image"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <div className="container mx-auto px-4">
            <h1
              className="font-ivy-light mb-4 text-4xl text-white"
              style={{ fontFamily: "var(--font-ivy-presto-headline)" }}
            >
              Welcome Home
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white">
              Discover our restaurant, experiences, and events.
            </p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="font-ivy-light mb-4 text-3xl">About Us</h2>
          <p className="max-w-2xl text-lg">
            Experience excellence in every detail of your journey with us.
          </p>
        </div>
      </section>
    </main>
  );
}
