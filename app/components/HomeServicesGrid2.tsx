"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const CARD_SPEEDS = [0.17, 0.3];
const IMAGE_PARALLAX_RANGE = 18;

const HOME_SERVICES = [
  {
    title: "Our Garden",
    description:
      "Lush greenery, open skies, and tranquil corners—the heart of Eden is a space where nature and hospitality meet. Every pathway, every shaded spot, every bloom has been crafted to invite you in, to slow down, and to feel at home in the midst of Abuja.",
    image: "/images/iris-lavoie.jpg",
  },
  {
    title: "The Experience",
    description:
      "Where entertainment and tranquility coexist. Whether you're here for a quiet meal, a celebration with friends, or a night of live music under the stars—Eden is designed to bring people together. It's a place where moments become memories and the ordinary turns extraordinary.",
    image: "/images/olena.jpg",
  },
];

export default function HomeServicesGrid() {
  const [ourGarden, theExperience] = HOME_SERVICES;
  const sectionRef = useRef<HTMLElement>(null);
  const [parallax, setParallax] = useState<{
    cardY: number[];
    imageY: number[];
  }>({
    cardY: [0, 0],
    imageY: [0, 0],
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const isVisible =
        rect.bottom >= 0 && rect.top <= viewportHeight + sectionHeight;

      if (!isVisible) {
        rafId = requestAnimationFrame(update);
        return;
      }

      const scrollProgress =
        (viewportHeight - rect.top) / (viewportHeight + sectionHeight);
      const normalized = Math.max(0, Math.min(1, scrollProgress));
      const centered = (normalized - 0.5) * 2;

      const CARD_STRENGTH = 110;
      const cardY = CARD_SPEEDS.map(
        (speed) => -centered * CARD_STRENGTH * speed,
      );
      const imageY = CARD_SPEEDS.map(
        (speed) => -centered * IMAGE_PARALLAX_RANGE * speed * 2,
      );

      setParallax({ cardY, imageY });
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-secondary text-primary w-full px-4 py-12 md:px-8 md:py-20"
      aria-label="About Eden"
    >
      <div className="grid grid-cols-12 grid-rows-2 gap-4 md:min-h-[1020px] md:grid-rows-[repeat(17,minmax(0,1fr))] md:gap-6">
        {/* Left card - 6 cols, full height (way bigger height) */}
        <div
          className="col-span-12 row-span-1 flex flex-col will-change-transform md:col-span-6 md:row-span-12"
          style={{ transform: `translateY(${parallax.cardY[0]}px)` }}
        >
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <div
              className="absolute inset-0 -top-[15%] h-[130%] w-full will-change-transform"
              style={{
                transform: `translateY(${parallax.imageY[0]}%)`,
              }}
            >
              <Image
                src={ourGarden.image}
                alt={ourGarden.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 38vw"
              />
            </div>
          </div>
          <div className="w-full text-left">
            <h3 className="font-ivy-headline text-primary mt-3 text-2xl font-normal md:text-2xl">
              {ourGarden.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 w-full max-w-xl text-lg md:text-base">
              {ourGarden.description}
            </p>
          </div>
        </div>

        {/* Right card - 4 cols, anchored at right, pushed down 5 rows */}
        <div
          className="col-span-12 row-span-1 row-start-2 flex flex-col will-change-transform md:col-span-4 md:col-start-9 md:row-span-12 md:row-start-6 md:items-end"
          style={{ transform: `translateY(${parallax.cardY[1]}px)` }}
        >
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <div
              className="absolute inset-0 -top-[15%] h-[130%] w-full will-change-transform"
              style={{
                transform: `translateY(${parallax.imageY[1]}%)`,
              }}
            >
              <Image
                src={theExperience.image}
                alt={theExperience.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
            </div>
          </div>
          <div className="w-full text-left">
            <h3 className="font-ivy-headline text-primary mt-3 text-2xl font-normal md:text-2xl">
              {theExperience.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 w-full max-w-xl text-lg md:text-base">
              {theExperience.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
