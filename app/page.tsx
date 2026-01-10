export default function Home() {
  return (
    <main className="bg-secondary text-primary">
      <section className="h-screen flex flex-col items-center justify-center text-center">
        <div className="container mx-auto px-4">
          <h1
            className="font-ivy-light mb-4 text-4xl"
            style={{ fontFamily: "var(--font-ivy-presto-headline)" }}
          >
            Welcome Home
          </h1>
          <p className="max-w-2xl text-lg mx-auto">
            Discover our restaurant, experiences, and events.
          </p>
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
