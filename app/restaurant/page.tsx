"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";

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
        <div className="absolute inset-0 z-1 bg-black/20"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <div className="w-full px-4 md:px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-ivy-headline mx-auto max-w-4xl text-5xl leading-tight text-white md:text-8xl">
                Where food brings us together.
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
          {/* First Section - PHILOSOPHY label and title */}
          <div className="flex flex-col">
            <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
              PHILOSOPHY
            </span>
            <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl leading-tight md:text-5xl">
              Our restaurant offers a rarefied collection of breathtaking
              culinary experiences.
            </h2>
          </div>
        </div>
      </section>
      <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
          {/* Second Section - Paragraphs and link, aligned to the right */}
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden Restaurant is a vibrant culinary oasis in
              Abuja, offering a unique blend of traditional cuisine and
              contemporary dining experiences. From authentic local dishes to
              innovative culinary creations, there&apos;s something for
              everyone. Indulge in traditional cuisine while enjoying the
              intimate ambiance of our restaurant.
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Our chefs craft each dish with passion and precision, using the
              finest local ingredients to create unforgettable flavors. Every
              meal tells a story of culinary excellence, blending time-honored
              recipes with modern techniques. Experience the artistry of our
              kitchen as we bring together the best of Nigerian cuisine and
              international influences.
            </p>
            <p className="font-neue-haas text-primary text-lg">
              Whether you&apos;re joining us for a romantic dinner, a family
              celebration, or a business gathering, our restaurant provides the
              perfect setting. The warm, inviting atmosphere complements our
              exceptional service, ensuring that every visit is memorable. Come
              and discover why Eden Park & Garden Restaurant is Abuja&apos;s
              premier dining destination.
            </p>
            <Link
              href="/contact"
              className="font-neue-haas text-primary mt-4 text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              MAKE A RESERVATION
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
