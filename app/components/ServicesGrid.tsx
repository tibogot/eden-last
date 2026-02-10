"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Card speed factors for scroll parallax (each card moves at a different rate)
const CARD_SPEEDS = [0.17, 0.3, 0.12, 0.25];
// Image inner parallax: how much the image moves inside its container (percentage)
const IMAGE_PARALLAX_RANGE = 18;

const SERVICES = [
  {
    title: "Bar lounge",
    description:
      "Unwind with crafted drinks and a relaxed atmosphere in the heart of the garden.",
    image: "/images/iris-lavoie.jpg",
    imageClass: "aspect-4/3 w-full max-w-[560px]",
    textMaxWidth: "max-w-[360px]",
  },
  {
    title: "Pool game",
    description: "Friendly games and tournaments in a laid-back setting.",
    image: "/images/pool-game.jpg",
    imageClass: "aspect-[3/4] w-full max-w-[520px]",
    textMaxWidth: "max-w-[520px]",
  },
  {
    title: "Table tennis",
    description: "Quick matches and casual play for all skill levels.",
    image: "/images/table-tennis.jpg",
    imageClass: "aspect-square w-full max-w-[280px]",
    textMaxWidth: "max-w-[280px]",
  },
  {
    title: "Traditional food",
    description: "Authentic flavours and seasonal dishes in a unique setting.",
    image: "/images/chicken.jpg",
    imageClass: "aspect-4/3 w-full max-w-[320px]",
    textMaxWidth: "max-w-[320px]",
  },
];

export default function ServicesGrid() {
  const [barLounge, poolGame, tableTennis, traditionalFood] = SERVICES;
  const sectionRef = useRef<HTMLElement>(null);
  const [parallax, setParallax] = useState<{
    cardY: number[];
    imageY: number[];
  }>({
    cardY: [0, 0, 0, 0],
    imageY: [0, 0, 0, 0],
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

      // Scroll progress: 0 when section top at bottom of viewport, 1 when section bottom at top
      const scrollProgress =
        (viewportHeight - rect.top) / (viewportHeight + sectionHeight);
      const normalized = Math.max(0, Math.min(1, scrollProgress));
      const centered = (normalized - 0.5) * 2; // -1 to 1 as section crosses viewport

      const CARD_STRENGTH = 110;
      const cardY = CARD_SPEEDS.map(
        (speed) => -centered * CARD_STRENGTH * speed
      );
      const imageY = CARD_SPEEDS.map(
        (speed) => -centered * IMAGE_PARALLAX_RANGE * speed * 2
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
      aria-label="Our services"
    >
      {/* First two images in grid */}
      <div className="grid h-auto grid-cols-1 grid-rows-2 gap-8 md:gap-4 md:h-[680px] md:grid-cols-8 md:grid-rows-5">
        <div
          className="col-span-1 row-span-1 flex flex-col will-change-transform md:col-span-3 md:row-span-4"
          style={{ transform: `translateY(${parallax.cardY[0]}px)` }}
        >
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <div
              className="absolute inset-0 h-[130%] w-full -top-[15%] will-change-transform"
              style={{
                transform: `translateY(${parallax.imageY[0]}%)`,
              }}
            >
              <Image
                src={barLounge.image}
                alt={barLounge.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 38vw"
              />
            </div>
          </div>
          <div className={`w-full text-left ${barLounge.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-2xl font-normal md:text-2xl">
              {barLounge.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-full text-lg md:max-w-[240px] md:text-base">
              {barLounge.description}
            </p>
          </div>
        </div>
        <div
          className="col-span-1 row-span-1 row-start-2 flex flex-col will-change-transform md:col-span-2 md:col-start-6 md:row-span-4 md:row-start-2 md:items-end"
          style={{ transform: `translateY(${parallax.cardY[1]}px)` }}
        >
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <div
              className="absolute inset-0 h-[130%] w-full -top-[15%] will-change-transform"
              style={{
                transform: `translateY(${parallax.imageY[1]}%)`,
              }}
            >
              <Image
                src={poolGame.image}
                alt={poolGame.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
          <div className={`w-full text-left ${poolGame.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-2xl font-normal md:text-2xl">
              {poolGame.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-full text-lg md:max-w-[240px] md:text-base">
              {poolGame.description}
            </p>
          </div>
        </div>
      </div>

      {/* Table tennis and Traditional food in grid */}
      <div className="mt-12 grid h-auto grid-cols-1 grid-rows-2 gap-8 md:mt-12 md:gap-4 md:h-[680px] md:grid-cols-8 md:grid-rows-5">
        <div
          className="col-span-1 row-span-1 flex flex-col will-change-transform md:col-span-2 md:col-start-2 md:row-span-4"
          style={{ transform: `translateY(${parallax.cardY[2]}px)` }}
        >
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <div
              className="absolute inset-0 h-[130%] w-full -top-[15%] will-change-transform"
              style={{
                transform: `translateY(${parallax.imageY[2]}%)`,
              }}
            >
              <Image
                src={tableTennis.image}
                alt={tableTennis.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
          <div className={`w-full text-left ${tableTennis.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-2xl font-normal md:text-2xl">
              {tableTennis.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-full text-lg md:max-w-[240px] md:text-base">
              {tableTennis.description}
            </p>
          </div>
        </div>
        <div
          className="col-span-1 row-span-1 row-start-2 flex flex-col will-change-transform md:col-span-3 md:col-start-6 md:row-span-4 md:row-start-2"
          style={{ transform: `translateY(${parallax.cardY[3]}px)` }}
        >
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <div
              className="absolute inset-0 h-[130%] w-full -top-[15%] will-change-transform"
              style={{
                transform: `translateY(${parallax.imageY[3]}%)`,
              }}
            >
              <Image
                src={traditionalFood.image}
                alt={traditionalFood.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 38vw"
              />
            </div>
          </div>
          <div className={`w-full text-left ${traditionalFood.textMaxWidth}`}>
            <h3 className="font-ivy-headline text-primary mt-3 text-2xl font-normal md:text-2xl">
              {traditionalFood.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 max-w-full text-lg md:max-w-[240px] md:text-base">
              {traditionalFood.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
