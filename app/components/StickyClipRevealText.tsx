"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap, ScrollTrigger } from "../lib/gsapConfig";
import { usePathname } from "next/navigation";

interface StickyClipRevealTextProps {
  imageSrc: string;
  imageAlt?: string;
  textContent?: React.ReactNode;
  overlayContent?: React.ReactNode;
}

export default function StickyClipRevealText({
  imageSrc,
  imageAlt = "Background image",
  textContent,
  overlayContent,
}: StickyClipRevealTextProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Circle configuration (viewport percentages)
  const initialRadius = isMobile ? 15 : 10;
  const initialCenterY = isMobile ? 68 : 65;
  const finalCenterY = 50;
  const finalRadius = 100;

  // Circle top edge = centerY - radius
  const initialTopEdge = initialCenterY - initialRadius;
  const textGap = isMobile ? 8 : 10; // gap between text bottom and circle top (vh%)

  // Wait for page transition to finish before creating ScrollTrigger.
  // Also detects mobile here to batch both state updates and avoid cascading renders.
  useEffect(() => {
    let mounted = true;
    let readyTimeoutId: ReturnType<typeof setTimeout>;

    const markReady = () => {
      if (!mounted) return;
      clearTimeout(fallbackId);
      readyTimeoutId = setTimeout(() => {
        if (mounted) {
          setIsMobile(window.innerWidth < 768);
          setIsReady(true);
        }
      }, 150);
    };

    const onTransitionComplete = () => {
      markReady();
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
      setIsMobile(window.innerWidth < 768);
      setIsReady(true);
    }, 800);

    return () => {
      mounted = false;
      clearTimeout(readyTimeoutId);
      clearTimeout(fallbackId);
      setIsReady(false);
      setIsMobile(false);
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
      const overlay = overlayRef.current;

      const viewportHeight = window.innerHeight;

      // Set initial clip-path: small circle at center-bottom
      gsap.set(imageWrapper, {
        clipPath: `circle(${initialRadius}% at 50% ${initialCenterY}%)`,
      });

      // Overlay text starts below viewport
      if (overlay) {
        gsap.set(overlay, { y: viewportHeight });
      }

      // Phase 1: circle expands + push text (0% to 40%)
      // Phase 2: overlay text rises from bottom (40% to 100%)
      const clipPhaseEnd = 0.4;
      const overlayPhaseStart = 0.4;

      // Text moves faster than the circle's top edge for a stronger "push" feel
      const textSpeedMultiplier = isMobile ? 1.6 : 1.4;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // --- Phase 1: Circle expansion + text push ---
          if (progress <= clipPhaseEnd) {
            const clipProgress = progress / clipPhaseEnd;

            // Circle expansion + center movement
            const radius =
              initialRadius + (finalRadius - initialRadius) * clipProgress;
            const centerY =
              initialCenterY + (finalCenterY - initialCenterY) * clipProgress;

            gsap.set(imageWrapper, {
              clipPath: `circle(${radius}% at 50% ${centerY}%)`,
            });

            // Push text up: track circle top edge movement, amplified
            if (text) {
              const currentTopEdge = centerY - radius;
              const delta = initialTopEdge - currentTopEdge;
              const pixelShift =
                (delta / 100) * viewportHeight * textSpeedMultiplier;
              gsap.set(text, { y: -pixelShift });
            }
          } else {
            // Fully open
            gsap.set(imageWrapper, {
              clipPath: `circle(100% at 50% 50%)`,
            });

            // Hold push text at final position
            if (text) {
              const finalTopEdge = finalCenterY - finalRadius;
              const totalDelta = initialTopEdge - finalTopEdge;
              const pixelShift =
                (totalDelta / 100) * viewportHeight * textSpeedMultiplier;
              gsap.set(text, { y: -pixelShift });
            }
          }

          // --- Phase 2: Overlay text rises from bottom ---
          if (overlay) {
            if (progress >= overlayPhaseStart) {
              const overlayProgress =
                (progress - overlayPhaseStart) / (1 - overlayPhaseStart);
              const y = viewportHeight * (1 - overlayProgress);
              gsap.set(overlay, { y });
            } else {
              gsap.set(overlay, { y: viewportHeight });
            }
          }
        },
      });

      return () => {
        trigger.kill();
        gsap.set(imageWrapper, { clearProps: "clipPath" });
        if (text) gsap.set(text, { clearProps: "y" });
        if (overlay) gsap.set(overlay, { clearProps: "y" });
      };
    },
    { scope: sectionRef, dependencies: [isReady, isMobile] },
  );

  const sectionHeight = isMobile ? "300vh" : "400vh";

  return (
    <section
      ref={sectionRef}
      className="bg-secondary relative w-full"
      style={{ height: sectionHeight }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Text content - positioned above the circle, pushed up on scroll */}
        {textContent && (
          <div
            ref={textRef}
            className="absolute inset-x-0 z-20 flex items-end justify-center px-8 md:px-16"
            style={{
              top: 0,
              bottom: `${100 - initialTopEdge + textGap}%`,
            }}
          >
            <div className="max-w-3xl text-center">{textContent}</div>
          </div>
        )}

        {/* Image with clip-path */}
        <div ref={imageWrapperRef} className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay text - rises from bottom after image fully reveals */}
        {overlayContent && (
          <div
            ref={overlayRef}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="max-w-3xl px-4 text-center text-white md:px-8">
              {overlayContent}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
