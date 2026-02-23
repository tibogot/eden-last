"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/app/lib/gsapConfig";

const CARD_SPEEDS = [0.2, 0.25];
const IMAGE_PARALLAX_RANGE = 18;

const HOME_SERVICES_ALT = [
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

const REVEAL_OVERLAY_COLOR = "#465643";

export default function HomeServicesGridAlt() {
  const [card1, card2] = HOME_SERVICES_ALT;
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

  useGSAP(
    () => {
      const boxes = sectionRef.current?.querySelectorAll(".reveal-box-alt");
      if (!boxes?.length) return;

      const triggers: ReturnType<typeof gsap.timeline>[] = [];

      boxes.forEach((box) => {
        const inner = box.querySelector(".reveal-box-alt__inner") as HTMLElement;
        const overlay = box.querySelector(
          ".reveal-box-alt__overlay",
        ) as HTMLElement;
        const img = box.querySelector(".reveal-box-alt__image") as HTMLElement;

        if (!inner || !overlay || !img) return;

        gsap.set(inner, { x: "-100%" });
        gsap.set(overlay, { x: "0%" });
        gsap.set(img, { scale: 1.3 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: box,
            start: "top 75%",
            end: "top 25%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power2.inOut" },
        });

        tl.to(inner, { x: "0%", duration: 0.9 }, 0);
        tl.to(overlay, { x: "100%", duration: 0.9 }, 0.6);
        tl.to(img, { scale: 1, duration: 1.5 }, 0.3);

        if (tl.scrollTrigger) triggers.push(tl);
      });

      return () => triggers.forEach((t) => t.scrollTrigger?.kill());
    },
    { scope: sectionRef, dependencies: [] },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-secondary text-primary w-full px-4 py-12 md:px-8 md:py-20"
      aria-label="About Eden"
    >
      {/* Grid: cards fill most of the height. Our Garden = tall left. The Experience = narrower right. */}
      <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-4 md:min-h-[85vh] md:grid-rows-20 md:gap-6">
        {/* Our Garden - Left, fills height (5 cols, 18 rows from top) */}
        <div
          className="col-span-12 row-span-1 flex flex-col will-change-transform md:col-span-5 md:col-start-2 md:row-span-18 md:row-start-1 md:items-start"
          style={{ transform: `translateY(${parallax.cardY[0]}px)` }}
        >
          <div className="relative min-h-[280px] w-full flex-1 overflow-hidden md:min-h-0">
            <div className="reveal-box-alt absolute inset-0">
              <div className="reveal-box-alt__inner relative h-full w-full overflow-hidden">
                <div
                  className="reveal-box-alt__overlay absolute inset-0 z-10"
                  style={{ backgroundColor: REVEAL_OVERLAY_COLOR }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 -top-[15%] h-[130%] w-full will-change-transform"
                  style={{
                    transform: `translateY(${parallax.imageY[0]}%)`,
                  }}
                >
                  <Image
                    src={card1.image}
                    alt={card1.title}
                    fill
                    className="reveal-box-alt__image object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 35vw"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full text-left">
            <h3 className="font-ivy-headline text-primary mt-3 text-2xl font-normal md:text-2xl">
              {card1.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 w-full max-w-xl text-lg md:text-base">
              {card1.description}
            </p>
          </div>
        </div>

        {/* The Experience - Right, smaller width (3 cols, 12 rows), fills height */}
        <div
          className="col-span-12 row-span-1 row-start-2 flex flex-col will-change-transform md:col-span-3 md:col-start-9 md:row-span-12 md:row-start-5 md:items-end"
          style={{ transform: `translateY(${parallax.cardY[1]}px)` }}
        >
          <div className="relative min-h-[240px] w-full max-w-sm flex-1 overflow-hidden md:min-h-0 md:max-w-none">
            <div className="reveal-box-alt absolute inset-0">
              <div className="reveal-box-alt__inner relative h-full w-full overflow-hidden">
                <div
                  className="reveal-box-alt__overlay absolute inset-0 z-10"
                  style={{ backgroundColor: REVEAL_OVERLAY_COLOR }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 -top-[15%] h-[130%] w-full will-change-transform"
                  style={{
                    transform: `translateY(${parallax.imageY[1]}%)`,
                  }}
                >
                  <Image
                    src={card2.image}
                    alt={card2.title}
                    fill
                    className="reveal-box-alt__image object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 22vw"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full text-left">
            <h3 className="font-ivy-headline text-primary mt-3 text-xl font-normal md:text-xl">
              {card2.title}
            </h3>
            <p className="font-neue-haas text-primary/80 mt-2 w-full max-w-sm text-base md:text-sm">
              {card2.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
