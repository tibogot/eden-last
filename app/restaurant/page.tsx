export default function Restaurant() {
  return (
    <main className="bg-secondary text-primary pt-20">
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="mb-4 text-4xl font-ivy-headline">
            Restaurant
          </h1>
          <p className="text-lg max-w-2xl">
            Experience our culinary excellence and fine dining.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="mb-4 text-3xl font-ivy-headline">
            Our Menu
          </h2>
          <p className="text-lg max-w-2xl">
            Discover our carefully crafted dishes made with the finest ingredients.
          </p>
        </div>
      </section>
    </main>
  );
}

