"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import { gsap, Draggable } from "@/app/lib/gsapConfig";

const TAP_THRESHOLD = 12;
const GAP_VW = 0.02;
const FLING_ROTATE = 15;
const FLING_SCALE = 0.4;
const VW_OFFSET = 0.1;

export interface OverlappingSlide {
  id?: string;
  content: React.ReactNode;
  /** Background color (e.g. #FFFF00 or tailwind class as fallback) */
  backgroundColor?: string;
  /** Optional image path (e.g. /images/food1.jpeg) - used as cover on the card */
  imageSrc?: string;
  imageAlt?: string;
}

interface OverlappingCardSwiperProps {
  slides: OverlappingSlide[];
  /** Optional title / left column content */
  title?: React.ReactNode;
  /** Card width as fraction of viewport (e.g. 0.3 = 30vw) */
  cardWidthVw?: number;
  /** Card height as fraction of viewport (e.g. 0.4 = 40vw) */
  cardHeightVw?: number;
  className?: string;
}

function applyFlingToSlides(
  track: HTMLElement,
  currentX: number,
  slideCount: number,
  backgroundColorMap: string[],
) {
  const slides = [...track.children] as HTMLElement[];
  const vwOffset =
    typeof window !== "undefined" ? window.innerWidth * VW_OFFSET : 0;

  slides.forEach((slide, i) => {
    const slideWidth = slide.offsetWidth;
    const slideLeft = slide.offsetLeft + currentX;
    const bgColor = backgroundColorMap[i] ?? "var(--color-primary)";
    const isLast = i === slideCount - 1;

    if (slideLeft < 0 && !isLast) {
      const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth);
      gsap.set(slide, {
        transformOrigin: "left 80%",
        x: Math.abs(slideLeft) + ratio * vwOffset,
        rotation: -FLING_ROTATE * ratio,
        scale: 1 - FLING_SCALE * ratio,
        zIndex: i + 1,
        backgroundColor: bgColor,
      });
    } else {
      gsap.set(slide, {
        clearProps: "transformOrigin,rotation,scale",
        x: 0,
        zIndex: i + 1,
        backgroundColor: bgColor,
      });
    }
  });
}

export default function OverlappingCardSwiper({
  slides,
  title,
  cardWidthVw = 0.22,
  cardHeightVw = 0.32,
  className = "",
}: OverlappingCardSwiperProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  const updateFling = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const x = (draggableRef.current?.x ?? 0) as number;
    applyFlingToSlides(
      track,
      x,
      slides.length,
      slides.map((s) => s.backgroundColor ?? "var(--color-primary)"),
    );
  }, [slides]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track || slides.length === 0) return;

    const trackSlides = gsap.utils.toArray(track.children) as HTMLElement[];
    if (trackSlides.length === 0) return;

    const gap = window.innerWidth * GAP_VW;
    const cardWidth = window.innerWidth * cardWidthVw;
    const totalWidth = slides.length * cardWidth + (slides.length - 1) * gap;
    const viewportWidth = viewport.offsetWidth;
    const maxScroll = Math.min(0, viewportWidth - totalWidth);

    gsap.set(track, { x: 0, force3D: true });

    const draggableInstance = Draggable.create(track, {
      trigger: viewport,
      type: "x",
      inertia: true,
      dragClickables: false,
      minimumMovement: TAP_THRESHOLD,
      bounds: { minX: maxScroll, maxX: 0 },
      onDrag() {
        updateFling();
      },
      onThrowUpdate() {
        updateFling();
      },
    })[0];

    draggableRef.current = draggableInstance;
    updateFling();

    const handleResize = () => {
      const newGap = window.innerWidth * GAP_VW;
      const newCardWidth = window.innerWidth * cardWidthVw;
      const newTotalWidth =
        slides.length * newCardWidth + (slides.length - 1) * newGap;
      const newViewportWidth = viewport.offsetWidth;
      const newMaxScroll = Math.min(0, newViewportWidth - newTotalWidth);
      draggableInstance.applyBounds({
        minX: newMaxScroll,
        maxX: 0,
      });
      const clampedX = Math.max(
        newMaxScroll,
        Math.min(0, draggableInstance.x as number),
      );
      gsap.set(track, { x: clampedX });
      draggableInstance.update();
      updateFling();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      draggableInstance.kill();
      draggableRef.current = null;
    };
  }, [slides.length, cardWidthVw, cardHeightVw, updateFling]);

  const gapVw = GAP_VW * 100;
  const widthVw = cardWidthVw * 100;
  const heightVw = cardHeightVw * 100;

  return (
    <section
      className={`flex w-full items-start gap-[2vw] overflow-hidden ${className}`}
      style={{ minHeight: "80vh" }}
    >
      {title ? (
        <div className="flex w-1/2 shrink-0 flex-col items-start justify-start px-[4vw]">
          {title}
        </div>
      ) : null}
      <div
        ref={viewportRef}
        className="relative flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
        style={{
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div
          ref={trackRef}
          className="flex h-full min-h-full cursor-grab items-center will-change-transform active:cursor-grabbing"
          style={{ gap: `${gapVw}vw` }}
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id ?? index}
              className="pointer-events-none relative flex shrink-0 flex-col justify-between overflow-hidden p-[2vw]"
              style={{
                width: `${widthVw}vw`,
                height: `${heightVw}vw`,
                backgroundColor:
                  slide.backgroundColor ?? "var(--color-primary)",
              }}
            >
              {slide.imageSrc ? (
                <>
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt ?? ""}
                    fill
                    className="object-cover"
                    sizes={`${widthVw}vw`}
                  />
                  <div
                    className="absolute inset-0 z-[1] bg-black/10"
                    aria-hidden
                  />
                  <div className="relative z-10 flex flex-1 flex-col justify-between text-white">
                    {slide.content}
                  </div>
                </>
              ) : (
                <div className="text-white">{slide.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Sample slides for quick testing - customize or replace with your own */
export const SAMPLE_OVERLAPPING_SLIDES: OverlappingSlide[] = [
  {
    backgroundColor: "#FFFF00",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
          Success is not final, failure is not fatal: it is the courage to
          continue that counts.
        </p>
        <p className="font-neue-haas text-sm font-medium text-black/60">
          @john_doe
        </p>
      </>
    ),
  },
  {
    backgroundColor: "#55DB9C",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
          The only way to do great work is to love what you do. Don&apos;t
          settle.
        </p>
        <p className="font-neue-haas text-sm font-medium text-black/60">
          @jane_smith
        </p>
      </>
    ),
  },
  {
    backgroundColor: "#E9CCFF",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
          Believe you can and you&apos;re halfway there. Push yourself.
        </p>
        <p className="font-neue-haas text-sm font-medium text-black/60">
          @mike_wilson
        </p>
      </>
    ),
  },
  {
    backgroundColor: "#FB4903",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
          The journey of a thousand miles begins with a single step.
        </p>
        <p className="font-neue-haas text-sm font-medium text-black/60">
          @sarah_jones
        </p>
      </>
    ),
  },
  {
    backgroundColor: "#4DA2FF",
    content: (
      <>
        <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
          Dream big, work hard, stay focused, and surround yourself with good
          people.
        </p>
        <p className="font-neue-haas text-sm font-medium text-black/60">
          @emma_davis
        </p>
      </>
    ),
  },
];
