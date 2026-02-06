"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";

export default function ParallaxHeroImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let id: number;
    let revealed = false;

    const tick = () => {
      const rect = container.getBoundingClientRect();
      inner.style.transform = `translateY(${-rect.top * 0.25}px)`;
      if (!revealed) {
        inner.style.visibility = "visible";
        revealed = true;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-[70vh] w-full overflow-hidden ${className}`}
    >
      <div
        ref={innerRef}
        className="absolute inset-x-0 -top-[20%] -bottom-[20%]"
        style={{ willChange: "transform", visibility: "hidden" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
