"use client";

import Image from "next/image";
import PinnedImageReveal from "@/app/components/PinnedImageReveal";

export default function About() {
  return (
    <main className="bg-secondary text-primary">
      <section className="relative h-svh w-full overflow-hidden">
        <Image
          src="/images/jordan.jpg"
          alt="About image"
          fill
          priority
          className="object-cover"
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <div className="w-full px-4 md:px-8">
            <div className="flex flex-col items-start">
              <h1 className="font-ivy-headline mb-4 text-5xl leading-tight text-white md:text-7xl">
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
      {/* <section className="container mx-auto px-4 py-16 pb-8 md:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="font-neue-haas mb-4 text-xs tracking-wider uppercase">
            ABOUT
          </span>
          <h2 className="font-ivy-headline mb-6 max-w-3xl text-5xl leading-tight">
            A vibrant oasis in the heart of Abuja where entertainment meets
            relaxation, where live music fills the air.
          </h2>
          <p className="text-primary/80 max-w-sm text-sm">
            Eden Park & Garden is a vibrant oasis in Abuja, offering a unique
            blend of entertainment and relaxation. From live music and dance
            shows to thrilling football matches, we create unforgettable
            experiences that bring people together.
          </p>
        </div>
      </section> */}
      <div className="pt-20">
        <PinnedImageReveal
          imageSrc="/images/hero-2.jpg"
          imageAlt="Eden Garden"
          textContent={
            <>
              <span className="font-neue-haas mb-4 text-xs tracking-wider uppercase">
                ABOUT
              </span>
              <h2 className="font-ivy-headline mb-6 max-w-3xl text-5xl leading-tight">
                A vibrant oasis in the heart of Abuja where entertainment meets
                relaxation, where live music fills the air.
              </h2>
            </>
          }
        />
      </div>
      <section className="container mx-auto px-4 py-32">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="font-ivy-headline text-primary max-w-4xl text-6xl leading-tight md:text-8xl">
            A place where nature meets celebration
          </h2>
        </div>
      </section>
    </main>
  );
}
