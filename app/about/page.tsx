"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import HeroParallax from "@/app/components/HeroParallax";
import TextReveal from "@/app/components/TextReveal";
import AnimatedText from "@/app/components/AnimatedText3";
import ExperiencesImageTimeline from "@/app/components/ExperiencesImageTimeline";
import StickyClipRevealText from "@/app/components/StickyClipRevealText";

export default function About() {
  return (
    <main className="bg-secondary text-primary">
      <HeroParallax
        imageSrc="/images/chuntung-kam.jpg"
        imageAlt="Eden Park & Garden"
      >
        <div className="absolute inset-0 flex items-end justify-center px-4 pb-24 md:pb-32">
          <h1 className="font-ivy-headline max-w-4xl text-center text-5xl leading-tight text-white drop-shadow-md md:text-8xl">
            The Story of Eden Garden
          </h1>
        </div>
      </HeroParallax>

      <section className="bg-secondary text-primary pt-32">
        <div className="container px-4 md:px-8">
          <AnimatedText>
            <div className="flex flex-col">
              <span className="font-neue-haas text-primary mb-6 text-xs tracking-wider uppercase">
                OUR STORY
              </span>
              <h2 className="font-ivy-headline text-primary max-w-2xl text-4xl leading-tight md:text-5xl">
                A place rooted in connection.
              </h2>
            </div>
          </AnimatedText>
        </div>
      </section>

      <section className="bg-secondary text-primary pt-20 pb-32">
        <div className="container px-4 md:px-8">
          <div className="flex flex-col gap-8 md:ml-auto md:w-1/2">
            <p className="font-neue-haas text-primary text-lg">
              Eden Park & Garden was born from a simple belief: the best
              experiences happen when people gather. In the heart of Abuja, we
              created a space where entertainment and tranquility coexist—where
              live music fills the air, gardens invite reflection, and every
              corner holds the possibility of connection.
            </p>
            <p className="font-neue-haas text-primary text-lg">
              From our restaurant&apos;s culinary artistry to our open-air
              stage, terrace bar, and vibrant events, we bring together the
              rhythms of city life with the calm of nature. Whether you&apos;re
              here for football, food, or simply the atmosphere, Eden Garden is
              where moments become memories.
            </p>
            <Link
              href="/experiences"
              className="font-neue-haas text-primary mt-4 text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              EXPLORE EXPERIENCES
            </Link>
          </div>
        </div>
      </section>

      <StickyClipRevealText
        imageSrc="/images/real.jpg"
        imageAlt="Eden Garden"
        textContent={
          <>
            <span className="font-neue-haas mb-6 block text-xs tracking-wider uppercase">
              ABOUT
            </span>
            <h2 className="font-ivy-headline mb-6 max-w-3xl text-3xl md:text-6xl">
              A vibrant oasis in the heart of Abuja where entertainment meets
              relaxation, where live music fills the air.
            </h2>
          </>
        }
        overlayContent={
          <>
            <h2 className="font-ivy-headline mb-6 text-4xl leading-tight md:text-6xl">
              Where every corner holds the possibility of connection.
            </h2>
            <p className="text-lg opacity-90 md:text-xl">
              Live music, garden dining, events, and moments that linger.
            </p>
          </>
        }
      />

      <section className="py-32 md:py-80">
        <TextReveal
          className="mx-auto w-full px-4 text-center md:px-8"
          startColor="rgba(70, 86, 67, 0.2)"
          endColor="rgb(70, 86, 67)"
        >
          <h4 className="font-ivy-headline text-4xl leading-tight md:text-6xl">
            Fragments of thought arranged in sequence become patterns. They
            unfold step by step, shaping meaning as they move forward.
          </h4>
        </TextReveal>
      </section>

      <section className="bg-secondary text-primary py-20">
        <div className="px-4 md:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-stretch md:gap-12">
            <div className="relative h-[800px] w-full md:w-1/2">
              <Image
                src="/images/colin.jpg"
                alt="Eden Garden atmosphere"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex w-full flex-col md:w-1/2">
              <div className="flex flex-col justify-start md:sticky md:top-24">
                <span className="font-neue-haas text-primary mb-4 text-xs tracking-wider uppercase">
                  THE PLACE
                </span>
                <h2 className="font-ivy-headline text-primary mb-6 max-w-xl text-3xl leading-tight md:text-4xl">
                  An oasis in the heart of Abuja.
                </h2>
                <p className="font-neue-haas text-primary max-w-xl text-lg">
                  Our grounds blend lush gardens with open-air venues, creating
                  a destination that feels both intimate and expansive. From the
                  terrace bar to the open stage, every space is designed for
                  gathering—for sharing a meal, celebrating an evening, or
                  simply being present.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExperiencesImageTimeline
        title="Eden Garden at a Glance"
        body="Eden Park & Garden is a vibrant oasis in Abuja, offering a unique blend of entertainment and relaxation. From live music and dance shows to thrilling football matches, fine dining, and award-winning hospitality—there's something for everyone. Every visit unfolds as a new chapter in our story."
        slides={[
          { src: "/images/iris-lavoie.jpg", alt: "Live music at Eden Garden" },
          { src: "/images/colin.jpg", alt: "Garden dining" },
          { src: "/images/ani-augustine.jpg", alt: "Atmosphere" },
          { src: "/images/roberto-nickson.jpg", alt: "Events" },
        ]}
      />

      <section className="bg-secondary text-primary py-32">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center justify-center text-center">
            <TextReveal
              className="max-w-4xl"
              startColor="rgba(70, 86, 67, 0.2)"
              endColor="rgb(70, 86, 67)"
            >
              <p className="font-ivy-headline text-primary text-3xl leading-tight md:text-4xl">
                Where every moment becomes an unforgettable experience.
              </p>
            </TextReveal>
          </div>
        </div>
      </section>

      <StickyClipRevealText
        imageSrc="/images/shourav-sheikh.jpg"
        imageAlt="Eden Garden"
        textContent={
          <>
            <span className="font-neue-haas mb-6 block text-xs tracking-wider uppercase">
              DISCOVER
            </span>
            <h2 className="font-ivy-headline mb-6 max-w-3xl text-3xl md:text-6xl">
              A place where stories unfold
            </h2>
            <p className="text-primary/70 mx-auto max-w-xl text-base md:text-lg">
              Come experience the magic of Eden Garden for yourself.
            </p>
          </>
        }
        overlayContent={
          <>
            <h2 className="font-ivy-headline mb-6 text-4xl leading-tight md:text-6xl">
              We can&apos;t wait to welcome you.
            </h2>
            <p className="text-lg opacity-90 md:text-xl">
              Plan your visit, make a reservation, or get in touch.
            </p>
            <Link
              href="/contact"
              className="font-neue-haas mt-6 inline-block text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              GET IN TOUCH
            </Link>
          </>
        }
      />
    </main>
  );
}
