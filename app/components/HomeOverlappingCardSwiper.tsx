"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap, Draggable } from "@/app/lib/gsapConfig";

const TAP_THRESHOLD = 12;
const GAP_VW = 0.02;
const FLING_ROTATE = 15;
const FLING_SCALE = 0.4;
const VW_OFFSET = 0.1;
const CARD_WIDTH_VW = 0.22;
const CARD_HEIGHT_VW = 0.32;
const SLIDE_COUNT = 5;

const BACKGROUND_COLORS = [
  "#FFFF00",
  "#55DB9C",
  "#E9CCFF",
  "#FB4903",
  "#4DA2FF",
];

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

export default function HomeOverlappingCardSwiper() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);

  const updateFling = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const x = (draggableRef.current?.x ?? 0) as number;
    applyFlingToSlides(track, x, SLIDE_COUNT, BACKGROUND_COLORS);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const trackSlides = gsap.utils.toArray(track.children) as HTMLElement[];
    if (trackSlides.length === 0) return;

    const gap = window.innerWidth * GAP_VW;
    const cardWidth = window.innerWidth * CARD_WIDTH_VW;
    const totalWidth = SLIDE_COUNT * cardWidth + (SLIDE_COUNT - 1) * gap;
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
      const newCardWidth = window.innerWidth * CARD_WIDTH_VW;
      const newTotalWidth =
        SLIDE_COUNT * newCardWidth + (SLIDE_COUNT - 1) * newGap;
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
  }, [updateFling]);

  const gapVw = GAP_VW * 100;
  const widthVw = CARD_WIDTH_VW * 100;
  const heightVw = CARD_HEIGHT_VW * 100;

  return (
    <section
      className="flex w-full items-start gap-[2vw] overflow-hidden bg-secondary py-20 text-primary"
      style={{ minHeight: "80vh" }}
    >
      <div className="flex w-1/2 shrink-0 flex-col items-start justify-start px-[4vw]">
        <span className="font-neue-haas mb-4 block text-xs tracking-wider uppercase">
          TESTIMONIALS
        </span>
        <h2 className="font-ivy-headline max-w-lg text-4xl leading-tight md:text-5xl">
          What our guests say about Eden Garden
        </h2>
      </div>
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
          {/* Card 1 */}
          <div
            className="pointer-events-none relative flex shrink-0 flex-col justify-between overflow-hidden p-[2vw]"
            style={{
              width: `${widthVw}vw`,
              height: `${heightVw}vw`,
              backgroundColor: BACKGROUND_COLORS[0],
            }}
          >
            <div className="text-white">
              <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
                Success is not final, failure is not fatal: it is the courage
                to continue that counts.
              </p>
              <p className="font-neue-haas text-sm font-medium text-black/60">
                @john_doe
              </p>
            </div>
          </div>
          {/* Card 2 */}
          <div
            className="pointer-events-none relative flex shrink-0 flex-col justify-between overflow-hidden p-[2vw]"
            style={{
              width: `${widthVw}vw`,
              height: `${heightVw}vw`,
              backgroundColor: BACKGROUND_COLORS[1],
            }}
          >
            <div className="text-white">
              <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
                The only way to do great work is to love what you do.
                Don&apos;t settle.
              </p>
              <p className="font-neue-haas text-sm font-medium text-black/60">
                @jane_smith
              </p>
            </div>
          </div>
          {/* Card 3 */}
          <div
            className="pointer-events-none relative flex shrink-0 flex-col justify-between overflow-hidden p-[2vw]"
            style={{
              width: `${widthVw}vw`,
              height: `${heightVw}vw`,
              backgroundColor: BACKGROUND_COLORS[2],
            }}
          >
            <div className="text-white">
              <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
                Believe you can and you&apos;re halfway there. Push yourself.
              </p>
              <p className="font-neue-haas text-sm font-medium text-black/60">
                @mike_wilson
              </p>
            </div>
          </div>
          {/* Card 4 */}
          <div
            className="pointer-events-none relative flex shrink-0 flex-col justify-between overflow-hidden p-[2vw]"
            style={{
              width: `${widthVw}vw`,
              height: `${heightVw}vw`,
              backgroundColor: BACKGROUND_COLORS[3],
            }}
          >
            <div className="text-white">
              <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
                The journey of a thousand miles begins with a single step.
              </p>
              <p className="font-neue-haas text-sm font-medium text-black/60">
                @sarah_jones
              </p>
            </div>
          </div>
          {/* Card 5 */}
          <div
            className="pointer-events-none relative flex shrink-0 flex-col justify-between overflow-hidden p-[2vw]"
            style={{
              width: `${widthVw}vw`,
              height: `${heightVw}vw`,
              backgroundColor: BACKGROUND_COLORS[4],
            }}
          >
            <div className="text-white">
              <p className="font-neue-haas text-base leading-tight font-medium text-black md:text-lg">
                Dream big, work hard, stay focused, and surround yourself with
                good people.
              </p>
              <p className="font-neue-haas text-sm font-medium text-black/60">
                @emma_davis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
