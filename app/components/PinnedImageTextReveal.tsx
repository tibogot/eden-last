"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "../lib/gsapConfig";
import { usePathname } from "next/navigation";

export default function PinnedImageTextReveal() {
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

      // Responsive scroll distance - longer for slower animation
      const scrollDistance = isMobile ? "600vh" : "1200vh";

      // Text starts below viewport
      const viewportHeight = window.innerHeight;
      const textStartY = viewportHeight;

      if (text) {
        gsap.set(text, {
          y: textStartY,
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          pinType: "transform", // Important for Lenis smooth scroll integration
          scrub: true, // Instant response, no lag
          invalidateOnRefresh: true,
          refreshPriority: -1,
          ...(isMobile && {
            fastScrollEnd: true,
          }),
        },
      });

      // Text rises from bottom to center (0 to 0.6)
      if (text) {
        tl.to(
          text,
          {
            y: 0,
            ease: "none",
            duration: 0.6,
          },
          0
        );
      }

      // Hold at the end (0.6 to 1.0)
      tl.to({}, { duration: 0.4 }, 0.6);
    },
    { scope: sectionRef, dependencies: [isReady, isMobile] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-svh w-full overflow-hidden"
    >
      {/* Full-width background image */}
      <div className="absolute inset-0">
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
            Every corner holds a new adventure, every moment a chance to connect.
          </p>
        </div>
      </div>
    </section>
  );
}
