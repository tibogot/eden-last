"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface HeroParallaxProps {
  imageSrc: string;
  imageAlt: string;
  children: React.ReactNode;
  className?: string;
}

export default function HeroParallax({
  imageSrc,
  imageAlt,
  children,
  className = "",
}: HeroParallaxProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      const scrollY = window.scrollY;
      // Move the image at 40% of scroll speed for parallax effect
      imageRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={`relative h-svh w-full overflow-hidden ${className}`}>
      <div ref={imageRef} className="absolute inset-0 h-[120%] w-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 z-1 bg-black/20" aria-hidden />
      <div className="relative z-10 h-full">{children}</div>
    </section>
  );
}
