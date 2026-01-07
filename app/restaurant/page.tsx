export default function Restaurant() {
  return (
    <main className="bg-secondary text-primary">
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-4xl font-ivy-light mb-4">
            Restaurant
          </h1>
          <p className="text-lg max-w-2xl">
            Experience our culinary excellence and fine dining.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h2 className="text-3xl font-ivy-light mb-4">
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

