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
        kicker: "Rice",
        title: "Jollof Rice",
        body: "Spiced tomato rice cooked with peppers, onions and stock—the dish that sparks friendly rivalry across West Africa. Often served with plantain and coleslaw.",
        imageSrc: "/images/food1.jpeg",
      },
      {
        kicker: "Soup",
        title: "Pounded Yam & Egusi",
        body: "Smooth pounded yam paired with egusi soup—melon seed paste simmered with leafy greens and meat or fish. A beloved comfort combo across Nigeria.",
        imageSrc: "/images/food2.jpeg",
      },
      {
        kicker: "Grill",
        title: "Suya",
        body: "Skewered beef or chicken rubbed with yaji (suya spice), grilled over open flame and finished with onions and pepper. A must at any Nigerian gathering.",
        imageSrc: "/images/food3.jpeg",
      },
      {
        kicker: "Snack",
        title: "Puff Puff & Chin Chin",
        body: "Puff puff: soft, fried dough balls. Chin chin: crunchy bite-sized treats. Sweet or spiced—the perfect finish or street snack with a cold drink.",
        imageSrc: "/images/food4.jpeg",
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
      className={`bg-secondary text-primary relative w-full ${className}`}
      style={{ isolation: "isolate" }}
    >
      <div className="relative w-full py-24">
        <div className="px-4 md:px-8">
          <div className="font-neue-haas mx-auto mb-14 max-w-3xl text-center">
            <span className="text-primary mb-6 block text-xs tracking-wider uppercase">
              OUR DISHES
            </span>
            <h2 className="font-ivy-headline text-primary mx-auto mt-3 max-w-2xl text-4xl leading-tight md:text-5xl">
              Signature flavours, one scroll at a time
            </h2>
            <p className="font-neue-haas text-primary/70 mx-auto mt-4 max-w-xl text-lg">
              Discover a few of our favourite Nigerian dishes—each card brings
              you closer to the taste of home.
            </p>
          </div>

          {/* Cards container */}
          <div ref={cardsContainerRef} className="flex justify-center pt-16">
            <div className="w-[92%] md:w-[70%]">
              {cards.map((card, index) => (
                <article
                  key={card.title}
                  data-stacking-card-3d
                  className="border-primary/10 bg-primary/5 relative mb-12 w-full overflow-hidden border will-change-transform"
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
                    <div className="absolute inset-0 bg-black/5" />

                    {/* Dark overlay that animates with GSAP (from StickyCards3D) */}
                    <div
                      className="pointer-events-none absolute inset-0 z-2 bg-black/50 transition-opacity duration-100 ease-linear"
                      style={{
                        opacity: "var(--after-opacity, 0)",
                      }}
                    />

                    <div className="absolute inset-0 z-3 flex flex-col justify-between p-6 md:p-10">
                      <div className="flex items-start justify-between gap-6">
                        <div className="font-neue-haas text-secondary/70 text-xs tracking-wider uppercase md:text-sm">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(cards.length).padStart(2, "0")}
                        </div>
                        <div className="font-neue-haas text-secondary/50 text-xs tracking-wider uppercase md:text-sm">
                          {card.kicker}
                        </div>
                      </div>

                      <div className="max-w-2xl">
                        <h3 className="font-ivy-headline text-secondary text-3xl leading-tight md:text-5xl">
                          {card.title}
                        </h3>
                        <p className="font-neue-haas text-secondary mt-3 max-w-md text-lg">
                          {card.body}
                        </p>
                        <div className="bg-secondary/20 mt-6 h-px w-full" />
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
