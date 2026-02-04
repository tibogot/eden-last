"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap, ScrollTrigger } from "../lib/gsapConfig";
import { usePathname } from "next/navigation";

export default function StickyClipReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  // Wait for page transition to finish before creating ScrollTrigger (GSAP recommendation).
  // If we init too early, view transition styles/layout interfere and the animation appears finished.
  useEffect(() => {
    let mounted = true;
    let readyTimeoutId: ReturnType<typeof setTimeout>;

    const setReady = () => {
      if (!mounted) return;
      clearTimeout(fallbackId);
      readyTimeoutId = setTimeout(() => {
        if (mounted) setIsReady(true);
      }, 150); // After Lenis scroll + ScrollTrigger.refresh (100ms) so layout is stable
    };

    const onTransitionComplete = () => {
      setReady();
    };

    window.addEventListener("pageTransitionComplete", onTransitionComplete, {
      once: true,
    });

    // Fallback: first load or when event never fires (no transition)
    const fallbackId = setTimeout(() => {
      if (!mounted) return;
      window.removeEventListener(
        "pageTransitionComplete",
        onTransitionComplete,
      );
      setIsReady(true);
    }, 800);

    return () => {
      mounted = false;
      clearTimeout(readyTimeoutId);
      clearTimeout(fallbackId);
      setIsReady(false);
      window.removeEventListener(
        "pageTransitionComplete",
        onTransitionComplete,
      );
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (!sectionRef.current || !imageWrapperRef.current || !isReady) return;

      const section = sectionRef.current;
      const imageWrapper = imageWrapperRef.current;
      const text = textRef.current;

      const viewportHeight = window.innerHeight;

      // Initial clip-path: small circle at center-bottom
      const initialRadius = isMobile ? 15 : 10; // percentage
      gsap.set(imageWrapper, {
        clipPath: `circle(${initialRadius}% at 50% 70%)`,
      });

      // Text starts below viewport
      if (text) {
        gsap.set(text, {
          y: viewportHeight,
        });
      }

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;

          // Phase 1: Clip-path expands (0% to 40% of scroll)
          // Phase 2: Text rises (40% to 100% of scroll)

          if (progress <= 0.4) {
            // Clip-path animation: 0 to 0.4 progress maps to initialRadius to 100%
            const clipProgress = progress / 0.4;
            const radius = initialRadius + (100 - initialRadius) * clipProgress;
            gsap.set(imageWrapper, {
              clipPath: `circle(${radius}% at 50% 50%)`,
            });
          } else {
            // Ensure clip-path is fully open
            gsap.set(imageWrapper, {
              clipPath: `circle(100% at 50% 50%)`,
            });
          }

          // Text animation: starts at 40%, ends at 100%
          if (text) {
            if (progress >= 0.4) {
              const textProgress = (progress - 0.4) / 0.6;
              const y = viewportHeight * (1 - textProgress);
              gsap.set(text, { y });
            } else {
              gsap.set(text, { y: viewportHeight });
            }
          }
        },
      });

      // Cleanup: kill ScrollTrigger and revert gsap.set() so nothing persists on navigate
      return () => {
        trigger.kill();
        gsap.set(imageWrapper, { clearProps: "clipPath" });
        if (text) gsap.set(text, { clearProps: "y" });
      };
    },
    { scope: sectionRef, dependencies: [isReady, isMobile] },
  );

  // Section height controls total scroll distance
  const sectionHeight = isMobile ? "250vh" : "350vh";

  return (
    <section
      ref={sectionRef}
      className="bg-secondary relative w-full"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Image with clip-path */}
        <div ref={imageWrapperRef} className="absolute inset-0">
          <Image
            src="/images/ovinuchi-ejiohuo.jpg"
            alt="Eden Garden atmosphere"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text overlay */}
        <div
          ref={textRef}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="max-w-3xl px-4 text-center text-white md:px-8">
            <h2 className="font-ivy-headline mb-6 text-4xl leading-tight md:text-6xl">
              A place where stories unfold
            </h2>
            <p className="text-lg opacity-90 md:text-xl">
              Every corner holds a new adventure, every moment a chance to
              connect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
