"use client";

import Link from "next/link";
import { useRef, useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, Draggable } from "@/app/lib/gsapConfig";

const TAP_THRESHOLD = 12;
const GAP_VW = 0.02;
const FLING_ROTATE = 15;
const FLING_SCALE = 0.4;
const VW_OFFSET = 0.1;
const CARD_WIDTH_VW = 0.28;
const CARD_HEIGHT_VW = 0.38;
const MOBILE_CARD_WIDTH_VW = 0.58;
const MOBILE_CARD_HEIGHT_VW = 0.62;
const SLIDE_COUNT = 5;
const MOBILE_BREAKPOINT = 1024;

const CARD_IMAGES = [
  "/images/susie.jpg",
  "/images/connor.jpg",
  "/images/keesha.jpg",
  "/images/solo-seafood.jpg",
  "/images/shourav-sheikh.jpg",
];

function applyFlingToSlides(
  track: HTMLElement,
  currentX: number,
  slideCount: number,
) {
  const slides = [...track.children] as HTMLElement[];
  const vwOffset =
    typeof window !== "undefined" ? window.innerWidth * VW_OFFSET : 0;

  slides.forEach((slide, i) => {
    const slideWidth = slide.offsetWidth;
    const slideLeft = slide.offsetLeft + currentX;
    const isLast = i === slideCount - 1;

    if (slideLeft < 0 && !isLast) {
      const ratio = Math.min(1, Math.abs(slideLeft) / slideWidth);
      gsap.set(slide, {
        transformOrigin: "left 80%",
        x: Math.abs(slideLeft) + ratio * vwOffset,
        rotation: -FLING_ROTATE * ratio,
        scale: 1 - FLING_SCALE * ratio,
        zIndex: i + 1,
      });
    } else {
      gsap.set(slide, {
        clearProps: "transformOrigin,rotation,scale",
        x: 0,
        zIndex: i + 1,
      });
    }
  });
}

export default function HomeOverlappingCardSwiper() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const boundsRef = useRef<{ maxScroll: number; step: number }>({
    maxScroll: 0,
    step: 0,
  });
  const [trackState, setTrackState] = useState({
    trackX: 0,
    maxScroll: 0,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () =>
      setIsMobile(
        typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const syncTrackState = useCallback(() => {
    const track = trackRef.current;
    const draggable = draggableRef.current;
    const { maxScroll } = boundsRef.current;
    const x =
      track && draggable
        ? ((draggable.x ?? gsap.getProperty(track, "x")) as number)
        : 0;
    setTrackState((prev) =>
      prev.trackX === x && prev.maxScroll === maxScroll
        ? prev
        : { trackX: x, maxScroll },
    );
  }, []);

  const updateFling = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const x = (gsap.getProperty(track, "x") as number) ?? 0;
    applyFlingToSlides(track, x, SLIDE_COUNT);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const trackSlides = gsap.utils.toArray(track.children) as HTMLElement[];
    if (trackSlides.length === 0) return;

    const gap = window.innerWidth * GAP_VW;
    const cardWidthVw = isMobile ? MOBILE_CARD_WIDTH_VW : CARD_WIDTH_VW;
    const cardWidth = window.innerWidth * cardWidthVw;
    const totalWidth = SLIDE_COUNT * cardWidth + (SLIDE_COUNT - 1) * gap;
    const viewportWidth = viewport.offsetWidth;
    // End position: last card's left edge at viewport left (no scroll past that)
    const lastCardAtLeft = -(SLIDE_COUNT - 1) * (cardWidth + gap);
    const maxScroll = Math.min(0, viewportWidth - totalWidth, lastCardAtLeft);
    const step = cardWidth + gap;
    boundsRef.current = { maxScroll, step };

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
      onDragEnd: syncTrackState,
      onThrowComplete: syncTrackState,
    })[0];

    draggableRef.current = draggableInstance;
    updateFling();
    setTrackState({ trackX: 0, maxScroll });

    const handleResize = () => {
      const nowMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const newCardWidthVw = nowMobile ? MOBILE_CARD_WIDTH_VW : CARD_WIDTH_VW;
      const newGap = window.innerWidth * GAP_VW;
      const newCardWidth = window.innerWidth * newCardWidthVw;
      const newTotalWidth =
        SLIDE_COUNT * newCardWidth + (SLIDE_COUNT - 1) * newGap;
      const newViewportWidth = viewport.offsetWidth;
      const newLastCardAtLeft = -(SLIDE_COUNT - 1) * (newCardWidth + newGap);
      const newMaxScroll = Math.min(
        0,
        newViewportWidth - newTotalWidth,
        newLastCardAtLeft,
      );
      boundsRef.current = {
        maxScroll: newMaxScroll,
        step: newCardWidth + newGap,
      };
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
      setTrackState((prev) => ({
        ...prev,
        trackX: clampedX,
        maxScroll: newMaxScroll,
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      draggableInstance.kill();
      draggableRef.current = null;
    };
  }, [updateFling, syncTrackState, isMobile]);

  const go = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      const draggable = draggableRef.current;
      const { maxScroll, step } = boundsRef.current;
      if (!track || !draggable || step <= 0) return;
      const currentX = (draggable.x ?? gsap.getProperty(track, "x")) as number;
      const newX = Math.max(
        maxScroll,
        Math.min(0, currentX - direction * step),
      );
      if (newX === currentX) return;
      gsap.to(track, {
        x: newX,
        duration: 0.35,
        ease: "power2.out",
        onUpdate: updateFling,
        onComplete: () => {
          draggable.update();
          setTrackState((prev) => ({ ...prev, trackX: newX }));
        },
      });
    },
    [updateFling],
  );

  const atStart = trackState.trackX >= -1;
  const atEnd = trackState.trackX <= trackState.maxScroll + 1;

  const gapVw = GAP_VW * 100;
  const widthVw = (isMobile ? MOBILE_CARD_WIDTH_VW : CARD_WIDTH_VW) * 100;
  const heightVw = (isMobile ? MOBILE_CARD_HEIGHT_VW : CARD_HEIGHT_VW) * 100;

  return (
    <section className="bg-secondary text-primary w-full overflow-hidden py-8 md:py-20">
      <div className="px-4 md:px-8">
        <span className="font-neue-haas text-primary mb-6 block text-xs tracking-wider uppercase">
          Experiences
        </span>
      </div>
      <div className="mt-12 flex w-full flex-col items-stretch gap-8 lg:mt-30 lg:flex-row lg:gap-[2vw]">
        <div className="flex w-full shrink-0 flex-col items-start justify-between self-stretch px-4 md:px-8 lg:w-1/2">
          <div>
            <h2 className="font-ivy-headline max-w-lg text-4xl leading-tight md:text-5xl">
              Discover the best of Eden Park & Garden
            </h2>
            <Link
              href="/experiences"
              className="font-neue-haas text-primary mt-6 inline-block text-xs tracking-wider uppercase underline transition-opacity hover:opacity-70"
            >
              View all experiences
            </Link>
          </div>
          <div className="mt-6 flex gap-3 lg:mt-0">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={atStart}
              className="bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/50 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-default disabled:opacity-40 disabled:hover:opacity-40"
              aria-label="Previous testimonial"
              aria-disabled={atStart}
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={atEnd}
              className="bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/50 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center transition-opacity focus:outline-none focus-visible:ring-2 disabled:cursor-default disabled:opacity-40 disabled:hover:opacity-40"
              aria-label="Next testimonial"
              aria-disabled={atEnd}
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
        <div
          ref={viewportRef}
          className="relative w-full cursor-grab overflow-hidden active:cursor-grabbing lg:flex-1"
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
            {CARD_IMAGES.map((src, i) => (
              <div
                key={i}
                className="pointer-events-none relative shrink-0 overflow-hidden bg-cover bg-center"
                style={{
                  width: `${widthVw}vw`,
                  height: `${heightVw}vw`,
                  backgroundImage: `url(${src})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
