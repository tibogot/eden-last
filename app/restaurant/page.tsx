"use client";

import Image from "next/image";

export default function Restaurant() {
  return (
    <main className="bg-secondary text-primary">
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/daniel-park.jpg"
          alt="Restaurant image"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 z-[1] bg-black/20"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <div className="w-full px-4 md:px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-ivy-headline mb-4 text-5xl leading-tight text-white md:text-7xl">
                Where food brings us together.
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="font-ivy-headline mb-4 text-3xl">Our Menu</h2>
          <p className="max-w-2xl text-lg">
            Discover our carefully crafted dishes made with the finest
            ingredients.
          </p>
        </div>
      </section>
    </main>
  );
}
