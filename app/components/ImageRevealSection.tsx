"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/app/lib/gsapConfig";

export interface ImageRevealItem {
  src: string;
  alt: string;
  /** Grid span: "sm" = 1x1, "wide" = 2x1, "tall" = 1x2, "large" = 2x2 */
  span?: "sm" | "wide" | "tall" | "large";
}

const defaultImages: ImageRevealItem[] = [
  { src: "/images/colin.jpg", alt: "Dining at Eden Garden", span: "wide" },
  { src: "/images/food1.jpeg", alt: "Jollof Rice", span: "tall" },
  { src: "/images/shourav-sheikh.jpg", alt: "Garden dining", span: "sm" },
  { src: "/images/iris-lavoie.jpg", alt: "Atmosphere", span: "large" },
  { src: "/images/roberto-nickson.jpg", alt: "Ambiance", span: "sm" },
  { src: "/images/annie-lang.jpg", alt: "Experience", span: "wide" },
  { src: "/images/pool-game.jpg", alt: "Recreation", span: "tall" },
  { src: "/images/food2.jpeg", alt: "Grilled Suya", span: "sm" },
  { src: "/images/diego.jpg", alt: "Eden Garden", span: "wide" },
];

interface ImageRevealSectionProps {
  images?: ImageRevealItem[];
  /** Overlay color that slides away to reveal the image */
  overlayColor?: string;
  /** Optional section title */
  title?: string;
  /** Optional section subtitle */
  subtitle?: string;
  className?: string;
}

export default function ImageRevealSection({
  images = defaultImages,
  overlayColor = "#c1b294",
  title,
  subtitle,
  className = "",
}: ImageRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const boxes = containerRef.current?.querySelectorAll(".reveal-box");
      if (!boxes?.length) return;

      const triggers: ScrollTrigger[] = [];

      boxes.forEach((box) => {
        const inner = box.querySelector(".reveal-box__inner") as HTMLElement;
        const overlay = box.querySelector(".reveal-box__overlay") as HTMLElement;
        const img = box.querySelector(".reveal-box__image") as HTMLElement;

        if (!inner || !overlay || !img) return;

        // Initial state
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
          defaults: {
            ease: "power2.inOut",
          },
        });

        // Inner slides in from left (0.9s)
        tl.to(inner, { x: "0%", duration: 0.9 }, 0);

        // Overlay slides out to the right (0.9s) — starts 0.6s in
        tl.to(overlay, { x: "100%", duration: 0.9 }, 0.6);

        // Image scales down from 1.3 to 1 (1.5s) — starts 0.3s in
        tl.to(img, { scale: 1, duration: 1.5 }, 0.3);

        if (tl.scrollTrigger) {
          triggers.push(tl.scrollTrigger);
        }
      });

      return () => {
        triggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef, dependencies: [images.length] }
  );

  const getSpanClass = (span?: ImageRevealItem["span"]) => {
    switch (span) {
      case "wide":
        return "col-span-2 row-span-1 md:col-span-2 md:row-span-1";
      case "tall":
        return "col-span-1 row-span-2";
      case "large":
        return "col-span-2 row-span-2";
      default:
        return "col-span-1 row-span-1";
    }
  };

  return (
    <section
      ref={containerRef}
      className={`bg-secondary py-24 md:py-40 ${className}`}
    >
      <div className="container mx-auto px-4 md:px-8">
        {(title || subtitle) && (
          <div className="mb-20 flex flex-col items-center text-center md:mb-24">
            {title && (
              <h2 className="font-ivy-headline text-primary mb-4 max-w-2xl text-4xl leading-tight md:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-neue-haas text-primary/80 max-w-xl text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="reveal-grid mx-auto grid max-w-6xl auto-rows-[minmax(180px,22vh)] grid-cols-2 gap-4 md:auto-rows-[minmax(220px,28vh)] md:grid-cols-4 md:gap-6">
          {images.map((item, index) => (
            <div
              key={index}
              className={`reveal-box relative min-h-0 overflow-hidden ${getSpanClass(item.span)}`}
            >
              <div className="reveal-box__inner relative h-full w-full overflow-hidden">
                <div
                  className="reveal-box__overlay absolute inset-0 z-10"
                  style={{ backgroundColor: overlayColor }}
                  aria-hidden
                />
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="reveal-box__image object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  unoptimized={item.src.startsWith("http")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
