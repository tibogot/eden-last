"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/app/lib/gsapConfig";

export type TitleImageItem = {
  title: string;
  imageSrc: string;
  imageAlt: string;
};

const defaultItems: TitleImageItem[] = [
  {
    title: "First Experience",
    imageSrc: "https://picsum.photos/id/180/1200/700",
    imageAlt: "First",
  },
  {
    title: "Second Moment",
    imageSrc: "https://picsum.photos/id/60/1200/700",
    imageAlt: "Second",
  },
  {
    title: "Third Chapter",
    imageSrc: "https://picsum.photos/id/137/1200/700",
    imageAlt: "Third",
  },
  {
    title: "Fourth Journey",
    imageSrc: "https://picsum.photos/id/96/1200/700",
    imageAlt: "Fourth",
  },
];

export interface CenteredTitleImageScrollProps {
  /** Total scroll height in vh units. Optional; omit for natural document height. */
  scrollHeightVh?: number;
  /** Section items: title + image. Defaults to built-in list. */
  items?: TitleImageItem[];
  /** Optional class for the root container */
  className?: string;
}

export default function CenteredTitleImageScroll({
  scrollHeightVh,
  items = defaultItems,
  className = "",
}: CenteredTitleImageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const sectionEls = gsap.utils.toArray<HTMLElement>(".title-image-section");
      if (sectionEls.length === 0) return;

      const startSize = 80;
      const endHeightPx = 420;
      const startHeight = 220;
      const endHeight = 540;

      // Throttled refresh: section height changes push sections below down, so we must refresh
      // ScrollTrigger positions (otherwise the 4th section's animation runs way too early).
      let refreshRaf: number | null = null;
      const scheduleRefresh = () => {
        if (refreshRaf != null) return;
        refreshRaf = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          refreshRaf = null;
        });
      };

      sectionEls.forEach((section) => {
        const imgWrap = section.querySelector<HTMLElement>(".title-image-img-wrap");
        if (!imgWrap) return;

        const endWidthPx = section.offsetWidth * 0.8;

        const st1 = ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.to(imgWrap, {
              width: startSize + (endWidthPx - startSize) * p,
              height: startSize + (endHeightPx - startSize) * p,
              duration: 0.1,
              ease: "none",
            });
          },
        });

        const st2 = ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            gsap.to(section, {
              height: `${startHeight + (endHeight - startHeight) * self.progress}px`,
              duration: 0.1,
              ease: "none",
            });
            scheduleRefresh();
          },
        });

        scrollTriggersRef.current.push(st1, st2);
      });

      ScrollTrigger.refresh();

      return () => {
        if (refreshRaf != null) cancelAnimationFrame(refreshRaf);
        scrollTriggersRef.current.forEach((st) => st.kill());
        scrollTriggersRef.current = [];
      };
    },
    { scope: containerRef, dependencies: [items.length] },
  );

  const rootStyle = scrollHeightVh != null ? { height: `${scrollHeightVh}vh` } : undefined;

  return (
    <div
      ref={containerRef}
      className={`font-sans text-white antialiased ${className}`}
      style={rootStyle}
    >
      <section className="flex flex-col items-center bg-black px-6 py-16 md:px-10">
        {items.map((item, index) => (
          <div
            key={index}
            className="title-image-section flex h-[220px] min-h-[220px] flex-col items-center justify-start gap-4 overflow-hidden border-b border-white/15 last:border-b-0"
          >
            <h2 className="mt-6 text-center text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.1] tracking-tight text-white">
              {item.title}
            </h2>
            <div className="title-image-img-wrap flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                className="block h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
