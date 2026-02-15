"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDE_DURATION_MS = 6000;
const PROGRESS_TICK_MS = 50;

export type TimelineSlide = {
  src: string;
  alt: string;
};

type ExperiencesImageTimelineProps = {
  title: string;
  body: string;
  slides: TimelineSlide[];
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export default function ExperiencesImageTimeline({
  title,
  subtitle,
  body,
  ctaLabel,
  ctaHref,
  slides,
  className = "",
}: ExperiencesImageTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const slideStartRef = useRef<number>(0);

  useEffect(() => {
    slideStartRef.current = Date.now();
  }, []);

  // Update progress every tick and advance to next slide when duration is reached
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - slideStartRef.current;
      const value = Math.min(elapsed / SLIDE_DURATION_MS, 1);
      if (value >= 1) {
        setActiveIndex((i) => (i + 1) % slides.length);
        setProgress(0);
        slideStartRef.current = Date.now();
      } else {
        setProgress(value);
      }
    }, PROGRESS_TICK_MS);
    return () => clearInterval(interval);
  }, [activeIndex, slides.length]);

  const items = slides.slice(0, 4);

  return (
    <section className={`bg-secondary text-primary ${className}`}>
      <div className="px-4 py-10 md:px-8 md:py-24">
        {/* Two columns: items-stretch so left column is tall; sticky needs a tall containing block (like WhyUs) */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:items-stretch md:gap-12">
          {/* Left: wrapper stretches to row height; inner div is sticky */}
          <div className="flex flex-col md:col-span-5">
            <div className="flex flex-col justify-start md:sticky md:top-24">
              <h2 className="font-ivy-headline text-primary mb-6 max-w-sm text-3xl leading-tight md:text-4xl">
                {title}
              </h2>
              {subtitle ? (
                <p className="font-neue-haas text-primary/80 mb-6 text-lg md:text-xl">
                  {subtitle}
                </p>
              ) : null}
              <p className="font-neue-haas text-primary/90 text-base md:text-lg">
                {body}
              </p>
              {ctaLabel && ctaHref ? (
                <Link
                  href={ctaHref}
                  className="font-neue-haas inline-flex items-center gap-1 text-xs tracking-wider text-red-600 uppercase transition-colors hover:text-red-700"
                >
                  {ctaLabel}
                  <span aria-hidden>►</span>
                </Link>
              ) : null}
            </div>
          </div>

          {/* Right: on mobile = big image full width + thumbnails row; on md = thumb column + big image */}
          <div className="flex w-full flex-col gap-3 md:col-span-7 md:w-auto md:flex-row md:gap-4">
            {/* Big image: full width on mobile, right side on md; order-first on mobile so it appears above thumbs */}
            <div className="bg-primary/5 relative order-1 min-h-[500px] flex-1 overflow-hidden md:order-2 md:min-h-[100vh]">
              {items.map((slide, i) => (
                <div
                  key={i}
                  className="absolute inset-0 transition-opacity duration-500 ease-out"
                  style={{
                    opacity: i === activeIndex ? 1 : 0,
                    pointerEvents: i === activeIndex ? "auto" : "none",
                  }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Thumbnails: row on mobile, column on md; sticky on md so it stays in view like the text col */}
            <div className="order-2 flex shrink-0 flex-row gap-2 md:sticky md:top-8 md:order-1 md:w-[112px] md:flex-col md:gap-3 md:self-start">
              {items.map((slide, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setActiveIndex(i);
                      setProgress(0);
                      slideStartRef.current = Date.now();
                    }}
                    className="relative aspect-[3/4] min-w-0 flex-1 cursor-pointer overflow-hidden focus:outline-none md:w-full md:flex-none"
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={isActive}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="(max-width: 768px) 25vw, 112px"
                      quality={60}
                      className="object-cover"
                    />
                    {/* Inactive: faded */}
                    {!isActive && (
                      <div
                        className="absolute inset-0 bg-white/50 transition-opacity"
                        aria-hidden
                      />
                    )}
                    {/* Active: loading overlay – grows from top to bottom (starts clear, ends fully faded) */}
                    {isActive && (
                      <div
                        className="pointer-events-none absolute -inset-px bg-white/60 transition-none"
                        style={{
                          clipPath: `inset(0 0 ${(1 - progress) * 100}% 0)`,
                        }}
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
