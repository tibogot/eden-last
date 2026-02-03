"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap, ScrollTrigger } from "../lib/gsapConfig";
import { usePathname } from "next/navigation";

export default function StickyImageTextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const handleTransitionComplete = () => {
      if (!mounted) return;
      timeoutId = setTimeout(() => {
        if (mounted) {
          setIsReady(true);
        }
      }, 100);
    };

    const checkAndInit = () => {
      if (!mounted) return;

      const contentContainer = document.querySelector(
        ".content-container"
      ) as HTMLElement;
      if (contentContainer) {
        const transform = window.getComputedStyle(contentContainer).transform;
        if (transform && transform !== "none") {
          window.addEventListener(
            "pageTransitionComplete",
            handleTransitionComplete,
            { once: true }
          );
        } else {
          timeoutId = setTimeout(() => {
            if (mounted) setIsReady(true);
          }, 50);
        }
      } else {
        timeoutId = setTimeout(() => {
          if (mounted) setIsReady(true);
        }, 200);
      }
    };

    requestAnimationFrame(checkAndInit);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener(
        "pageTransitionComplete",
        handleTransitionComplete
      );
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (!sectionRef.current || !isReady) return;

      const section = sectionRef.current;
      const text = textRef.current;

      if (!text) return;

      // Text starts below viewport
      const viewportHeight = window.innerHeight;
      gsap.set(text, {
        y: viewportHeight,
      });

      // Animate text from bottom to center as we scroll through the section
      // No pin needed - the sticky image handles the "fixed" behavior
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          // Text animates throughout the entire scroll - no hold
          const y = viewportHeight * (1 - self.progress);
          gsap.set(text, { y });
        },
      });
    },
    { scope: sectionRef, dependencies: [isReady, isMobile] }
  );

  // Section height controls the scroll distance - shorter for snappier animation
  const sectionHeight = isMobile ? "150vh" : "200vh";

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: sectionHeight }}
    >
      {/* Sticky image - stays fixed at top while scrolling through section */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <Image
          src="/images/ovinuchi-ejiohuo.jpg"
          alt="Eden Garden atmosphere"
          fill
          className="object-cover"
          priority
        />

        {/* Text overlay - animated with GSAP */}
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
