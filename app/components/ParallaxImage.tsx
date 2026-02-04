"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ParallaxImageProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export default function ParallaxImage({
  children,
  speed = 0.5,
  className = "",
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    let rafId: number;

    const updateParallax = () => {
      const rect = container.getBoundingClientRect();
      const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight;

      if (isVisible) {
        const scrollProgress =
          (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const parallaxOffset = (scrollProgress - 0.5) * 100 * speed;
        content.style.transform = `translateY(${parallaxOffset}px)`;
      }

      rafId = requestAnimationFrame(updateParallax);
    };

    rafId = requestAnimationFrame(updateParallax);

    return () => cancelAnimationFrame(rafId);
  }, [speed]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={contentRef} className="relative h-full w-full">
        {children}
      </div>
    </div>
  );
}
