"use client";

import Image from "next/image";
import { useMemo, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsapConfig";
// import AnimatedCopy from "../components/AnimatedCopy";

type StackingCard = {
  kicker: string;
  title: string;
  body: string;
  imageSrc: string;
};

export default function StackingCardsPin3D({
  className = "",
}: {
  className?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const cards = useMemo<StackingCard[]>(
    () => [
      {
        kicker: "Strategy",
        title: "Align the narrative",
        body: "A pinned moment that turns scrolling into structure. Cards stack with precise spacing, then release back to the page.",
        imageSrc: "/images/hero.jpg",
      },
      {
        kicker: "Execution",
        title: "Build the system",
        body: "Each card translates upward into a clean stack. Smooth, predictable pin behavior (Lenis + ScrollTrigger compatible).",
        imageSrc: "/images/roberto-nickson.jpg",
      },
      {
        kicker: "Outcome",
        title: "Ship with clarity",
        body: "At the end of the pinned range, the stack is complete and the section unpins so you can continue scrolling naturally.",
        imageSrc: "/images/annie-lang.jpg",
      },
      {
        kicker: "Growth",
        title: "Scale with confidence",
        body: "Continuous improvement and optimization ensure your solution evolves with your business needs and market demands.",
        imageSrc: "/images/pool-game.jpg",
      },
    ],
    [],
  );

  useGSAP(
    () => {
      const container = cardsContainerRef.current;
      if (!container) return;

      const cardEls = gsap.utils.toArray<HTMLElement>(
        "[data-stacking-card-3d]",
      );
      if (cardEls.length === 0) return;

      const lastCard = cardEls[cardEls.length - 1] as HTMLElement;

      // Store ScrollTrigger instances for explicit cleanup
      const scrollTriggers: ScrollTrigger[] = [];

      cardEls.forEach((card, index) => {
        // Pin each card except the last one (same as StickyCards3D)
        if (index < cardEls.length - 1) {
          const pinSt = ScrollTrigger.create({
            trigger: card,
            start: "top top+=100", // Pin earlier to account for navbar
            endTrigger: lastCard,
            end: "top top+=100", // Unpin when last card reaches the pin position
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });

          scrollTriggers.push(pinSt);

          // Add 3D animation when next card enters (same as StickyCards3D)
          const nextCard = cardEls[index + 1];
          if (nextCard) {
            const animSt = ScrollTrigger.create({
              trigger: nextCard,
              start: "top bottom",
              end: "top top+=100", // Match the pin end position
              onUpdate: (self) => {
                const progress = self.progress;
                const scale = 1 - progress * 0.25;
                const rotation = (index % 2 === 0 ? 5 : -5) * progress;
                const rotationX = 5 * progress; // 3D rotateX animation
                const afterOpacity = progress;

                gsap.set(card, {
                  scale: scale,
                  rotation: rotation,
                  rotationX: rotationX,
                  transformPerspective: 1000, // Enable 3D transforms via GSAP
                  "--after-opacity": afterOpacity,
                });
              },
            });

            scrollTriggers.push(animSt);
          }
        }
      });

      // Cleanup function - explicitly kill all ScrollTrigger instances
      return () => {
        scrollTriggers.forEach((st) => st.kill());
      };
    },
    { scope: sectionRef, dependencies: [cards.length] },
  );

  return (
    <section
      ref={sectionRef}
      className={`relative w-full bg-black ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div className="relative w-full py-24">
        <div className="px-4 md:px-8">
          <div className="font-pp-neue-montreal mb-14 max-w-3xl">
            {/* <AnimatedCopy colorInitial="#666666" colorAccent="#8202FF" colorFinal="#ffffff"> */}
            <p className="text-xs tracking-wide text-white/60 uppercase md:text-sm">
              GSAP Pin / Stacking Cards 3D
            </p>
            <h2 className="mt-3 text-4xl leading-tight font-normal text-white md:text-6xl">
              Stacking cards (pinned) with 3D animation
            </h2>
            <p className="mt-4 text-base text-white/70 md:text-lg">
              Section pins, cards stack with 3D rotation effects, then unpins to
              next section.
            </p>
            {/* </AnimatedCopy> */}
          </div>

          {/* Cards container */}
          <div ref={cardsContainerRef} className="flex justify-center pt-16">
            <div className="w-[92%] md:w-[70%]">
              {cards.map((card, index) => (
                <article
                  key={card.title}
                  data-stacking-card-3d
                  className="relative mb-12 w-full overflow-hidden rounded-sm border border-white/10 bg-white/5 will-change-transform"
                  style={
                    {
                      height: "600px",
                      "--after-opacity": 0,
                      zIndex: index + 1, // Same as StickyCards3D: first card = 1, last card = 4 (highest)
                    } as React.CSSProperties
                  }
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={card.imageSrc}
                      alt={card.title}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(max-width: 768px) 92vw, 70vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

                    {/* Dark overlay that animates with GSAP (from StickyCards3D) */}
                    <div
                      className="pointer-events-none absolute inset-0 z-2 bg-black/50 transition-opacity duration-100 ease-linear"
                      style={{
                        opacity: "var(--after-opacity, 0)",
                      }}
                    />

                    <div className="absolute inset-0 z-3 flex flex-col justify-between p-6 md:p-10">
                      <div className="flex items-start justify-between gap-6">
                        <div className="font-pp-neue-montreal text-xs text-white/70 uppercase md:text-sm">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(cards.length).padStart(2, "0")}
                        </div>
                        <div className="font-pp-neue-montreal text-xs text-white/50 uppercase md:text-sm">
                          {card.kicker}
                        </div>
                      </div>

                      <div className="max-w-2xl">
                        <h3 className="font-pp-neue-montreal text-3xl leading-tight font-normal text-white md:text-5xl">
                          {card.title}
                        </h3>
                        <p className="font-pp-neue-montreal mt-3 text-sm text-white/75 md:text-lg">
                          {card.body}
                        </p>
                        <div className="mt-6 h-px w-full bg-white/20" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
