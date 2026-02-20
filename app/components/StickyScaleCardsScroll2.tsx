"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsapConfig";
import Image from "next/image";

export interface StickyScaleCardItem {
  tag: string;
  image: string;
  imageAlt: string;
}

const defaultCards: StickyScaleCardItem[] = [
  { tag: "Raw Emotion", image: "/images/hero.jpg", imageAlt: "" },
  { tag: "Inner Conflict", image: "/images/roberto-nickson.jpg", imageAlt: "" },
  { tag: "Fury & Flow", image: "/images/colin.jpg", imageAlt: "" },
  { tag: "Rebellion", image: "/images/annie-lang.jpg", imageAlt: "" },
  { tag: "Liberation", image: "/images/pool-game.jpg", imageAlt: "" },
];

interface StickyScaleCardsScrollProps {
  cards?: StickyScaleCardItem[];
  /** Optional intro headline above the sticky cards */
  introHeadline?: string;
  /** Optional outro headline below the sticky cards */
  outroHeadline?: string;
  className?: string;
}

export default function StickyScaleCardsScroll({
  cards = defaultCards,
  introHeadline,
  outroHeadline,
  className = "",
}: StickyScaleCardsScrollProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stickySection = container.current?.querySelector(
        ".sticky-scale-cards-section",
      );
      const cardEls = container.current?.querySelectorAll(".sticky-scale-card");
      const imageEls = container.current?.querySelectorAll(
        ".sticky-scale-card img",
      );

      if (!stickySection || !cardEls?.length || !imageEls?.length) return;

      const totalCards = cardEls.length;

      // Initial state: first card visible, rest below
      gsap.set(cardEls[0], { y: "0%", scale: 1, rotation: 0 });
      gsap.set(imageEls[0], { scale: 1 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cardEls[i], { y: "100%", scale: 1, rotation: 0 });
        gsap.set(imageEls[i], { scale: 1 });
      }

      const endScroll =
        typeof window !== "undefined"
          ? window.innerHeight * (totalCards - 1)
          : 4000;

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: stickySection,
          start: "top top",
          end: `+=${endScroll}`,
          pin: true,
          scrub: 0.5,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardEls[i];
        const currentImage = imageEls[i];
        const nextCard = cardEls[i + 1];
        const position = i;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.5,
            rotation: 10,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          currentImage,
          {
            scale: 1.5,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      return () => {
        scrollTimeline.scrollTrigger?.kill();
        scrollTimeline.kill();
      };
    },
    { scope: container, dependencies: [cards.length] },
  );

  return (
    <div className={`w-full ${className}`} ref={container}>
      {introHeadline && (
        <section className="bg-secondary flex min-h-svh flex-col items-center justify-center px-6 py-16 md:px-8">
          <h2 className="font-ivy-headline text-primary max-w-4xl text-center text-3xl leading-tight antialiased md:text-5xl md:leading-tight">
            {introHeadline}
          </h2>
        </section>
      )}

      <section className="sticky-scale-cards-section bg-secondary text-primary flex min-h-svh items-center justify-center">
        <div className="sticky-scale-cards-container relative h-[50vh] w-[95%] overflow-hidden md:w-1/2">
          {cards.map((item, index) => (
            <div
              key={index}
              className="sticky-scale-card absolute inset-0 overflow-hidden"
            >
              <div className="bg-primary absolute top-4 left-4 z-10 rounded px-2 py-1">
                <p className="font-neue-haas text-secondary text-xs leading-none font-semibold tracking-wide uppercase">
                  {item.tag}
                </p>
              </div>
              <div className="relative h-full w-full">
                <Image
                  src={item.image}
                  alt={item.imageAlt || item.tag}
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority={index === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {outroHeadline && (
        <section className="bg-secondary flex min-h-svh flex-col items-center justify-center px-6 py-16 md:px-8">
          <h2 className="font-ivy-headline text-primary max-w-4xl text-center text-3xl leading-tight antialiased md:text-5xl md:leading-tight">
            {outroHeadline}
          </h2>
        </section>
      )}
    </div>
  );
}
