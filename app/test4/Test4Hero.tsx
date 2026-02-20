"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

export default function Test4Hero() {
  const imageRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const applyParallax = () => {
      if (!imageRef.current) return;
      const scrollY = lenis.scroll;
      imageRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
    };

    applyParallax();
    lenis.on("scroll", applyParallax);
    return () => lenis.off("scroll", applyParallax);
  }, [lenis]);

  return (
    <section className="relative flex min-h-[150vh] w-full flex-col items-center justify-center gap-5 overflow-hidden px-4 md:gap-6 md:px-8">
      {/* Only the image bg has parallax (same as home HeroParallax) */}
      <div
        ref={imageRef}
        className="absolute inset-0 h-[120%] w-full -top-[10%] will-change-transform"
      >
        <Image
          src="/images/diego.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
      {/* Text layer: no parallax, scrolls with the section */}
      <div className="relative z-10 flex min-h-[150vh] w-full flex-col items-center justify-center gap-5 px-4 md:gap-6 md:px-8">
        <div className="w-full max-w-4xl text-center">
          <h1 className="font-ivy-headline mx-auto w-full text-5xl leading-tight text-white drop-shadow-md md:text-8xl">
            Where Every Meal Becomes a Moment
          </h1>
          <p className="mx-auto mt-10 max-w-lg text-center text-sm leading-relaxed text-white/90 drop-shadow-sm md:max-w-md md:text-base md:leading-relaxed">
            Our restaurant brings together seasonal ingredients, traditional
            recipes, and the warmth of the garden. Come for the food; stay for
            the experience.
          </p>
        </div>
        <p className="font-neue-haas absolute right-4 bottom-8 left-4 z-10 max-w-lg text-left text-sm leading-relaxed text-white/80 md:right-auto md:bottom-40 md:left-8 md:text-lg">
          Dinner in the garden is more than a meal—it’s a chance to slow down,
          taste the season, and share the table with people you care about. We
          welcome you to stay as long as you like.
        </p>
      </div>
    </section>
  );
}
