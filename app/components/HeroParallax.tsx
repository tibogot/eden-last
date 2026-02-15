"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";

interface HeroParallaxProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
  className?: string;
  /** Reserve space before load to avoid layout shift (e.g. "16/9", "21/9"). Default 16/9. */
  imageAspectRatio?: string;
}

export default function HeroParallax({
  imageSrc,
  imageAlt,
  children,
  className = "",
  imageAspectRatio = "16/9",
}: HeroParallaxProps) {
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
    <section className={`relative h-svh w-full overflow-hidden ${className}`}>
      <div
        ref={imageRef}
        className="absolute inset-0 h-[120%] w-full"
        style={{ aspectRatio: imageAspectRatio }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 z-1 bg-black/20" aria-hidden />
      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}
