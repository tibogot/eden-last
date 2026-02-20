"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const BASE_SPEED = -55; // px/s, negative = ticker moves left
const SCROLL_SENSITIVITY = -0.8; // scroll down = positive delta = add negative boost (faster)
const SCROLL_BOOST_MAX = 500; // max throw/accelerate strength (px/s)
const SCROLL_DECAY = 0.965; // inertia: higher = longer throw/coast

const DEFAULT_IMAGES = [
  { src: "/images/colin.jpg", alt: "Eden Garden dining" },
  { src: "/images/iris-lavoie.jpg", alt: "Live music at Eden Garden" },
  { src: "/images/ani-augustine.jpg", alt: "Eden Garden atmosphere" },
  { src: "/images/roberto-nickson.jpg", alt: "Events at Eden Garden" },
  { src: "/images/shourav-sheikh.jpg", alt: "Eden Garden" },
];

export interface ScrollCoupledTickerProps {
  images?: Array<{ src: string; alt: string }>;
  baseSpeed?: number;
  className?: string;
}

export default function ScrollCoupledTicker({
  images = DEFAULT_IMAGES,
  baseSpeed = BASE_SPEED,
  className = "",
}: ScrollCoupledTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef<number>(0);
  const carouselXRef = useRef<number>(0);
  const scrollVelocityBoostRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure loop width: distance from start to beginning of second (duplicate) set
    // This ensures perfect loop - no manual gap math, uses actual layout
    const measureLoopWidth = () => {
      const items = track.querySelectorAll<HTMLElement>(".ticker-card");
      if (items.length < 2) return;
      const halfCount = Math.floor(items.length / 2);
      const firstLeft = items[0].offsetLeft;
      const secondSetLeft = items[halfCount].offsetLeft;
      loopWidthRef.current = secondSetLeft - firstLeft;
    };

    // Defer measurement until layout is ready
    const rafMeasure = requestAnimationFrame(() => {
      measureLoopWidth();
      if (loopWidthRef.current === 0) {
        requestAnimationFrame(measureLoopWidth);
      }
    });

    // Re-measure when track resizes (e.g. images load, viewport change)
    const resizeObserver = new ResizeObserver(() => measureLoopWidth());
    resizeObserver.observe(track);

    lastTimeRef.current = performance.now();

    // Native wheel: direct capture (deltaY + = scroll down = accelerate, - = scroll up = throw opposite)
    const handleWheel = (e: WheelEvent) => {
      scrollVelocityBoostRef.current += e.deltaY * SCROLL_SENSITIVITY;
      scrollVelocityBoostRef.current = Math.max(
        -SCROLL_BOOST_MAX,
        Math.min(SCROLL_BOOST_MAX, scrollVelocityBoostRef.current),
      );
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // Inertia: decay boost when not scrolling (creates "throw" effect)
      scrollVelocityBoostRef.current *= SCROLL_DECAY;
      scrollVelocityBoostRef.current = Math.max(
        -SCROLL_BOOST_MAX,
        Math.min(SCROLL_BOOST_MAX, scrollVelocityBoostRef.current),
      );

      const speed = baseSpeed + scrollVelocityBoostRef.current;
      carouselXRef.current += speed * dt;

      const loopWidth = loopWidthRef.current;
      if (loopWidth > 0) {
        while (carouselXRef.current < -loopWidth) {
          carouselXRef.current += loopWidth;
        }
        while (carouselXRef.current > 0) {
          carouselXRef.current -= loopWidth;
        }
      }

      track.style.transform = `translate3d(${carouselXRef.current}px, 0, 0)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const handleResize = () => measureLoopWidth();
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafMeasure);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [baseSpeed]);

  return (
    <section
      className={`overflow-hidden bg-secondary py-16 md:py-24 ${className}`}
    >
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-max gap-6 will-change-transform"
          style={{ touchAction: "pan-y" }}
        >
          {[...images, ...images].map((img, index) => (
            <div
              key={index}
              className="ticker-card relative h-[420px] w-[560px] shrink-0 overflow-hidden md:h-[576px] md:w-[768px]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 768px, 560px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
