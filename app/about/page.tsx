"use client";

import Image from "next/image";
import PinnedImageReveal from "@/app/components/PinnedImageReveal";

export default function About() {

  return (
    <main className="bg-secondary text-primary">
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/macdavis.jpg"
          alt="About image"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <div className="w-full px-4 md:px-8">
            <div className="flex flex-col items-start">
              <h1 className="font-ivy-headline mb-4 text-7xl leading-tight text-white md:text-7xl">
                Drawing people together.
              </h1>
              <p className="mt-16 max-w-lg text-lg text-white">
                Eden Park & Garden is a vibrant oasis in Abuja, offering a
                unique blend of entertainment and relaxation. From live music
                and dance shows to thrilling football matches, there.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h2 className="font-ivy-headline mb-4 text-3xl">About Us</h2>
          <p className="max-w-2xl text-lg">
            Experience excellence in every detail of your journey with us.
          </p>
        </div>
      </section>
      <PinnedImageReveal imageSrc="/images/hero-2.jpg" imageAlt="Eden Garden" />
      <section className="container mx-auto px-4 py-32">
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <h2 className="font-ivy-headline text-primary max-w-4xl text-6xl leading-tight md:text-8xl">
            A place where nature meets celebration
          </h2>
        </div>
      </section>
    </main>
  );
}
