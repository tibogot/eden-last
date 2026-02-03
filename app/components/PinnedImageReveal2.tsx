"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "../lib/gsapConfig";
import { usePathname } from "next/navigation";

interface PinnedImageRevealProps {
  imageSrc: string;
  imageAlt?: string;
  textContent?: React.ReactNode;
}

export default function PinnedImageReveal({
  imageSrc,
  imageAlt = "Background image",
  textContent,
}: PinnedImageRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  // Detect mobile viewport
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;

  // Wait for page transition to complete before creating ScrollTrigger
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
        ".content-container",
      ) as HTMLElement;
      if (contentContainer) {
        const transform = window.getComputedStyle(contentContainer).transform;
        if (transform && transform !== "none") {
          window.addEventListener(
            "pageTransitionComplete",
            handleTransitionComplete,
            { once: true },
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
        handleTransitionComplete,
      );
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (!sectionRef.current || !imageWrapperRef.current || !isReady) return;

      const section = sectionRef.current;
      const imageWrapper = imageWrapperRef.current;
      const text = textRef.current;

      // Get wrapper dimensions
      const wrapperRect = imageWrapper.getBoundingClientRect();
      const wrapperWidth = wrapperRect.width;
      const wrapperHeight = wrapperRect.height;

      // Responsive scroll distances - shorter on mobile for better performance
      const scrollDistance = isMobile ? "400vh" : "800vh";

      // Initial circle size - smaller on mobile
      const initialRadiusPx = isMobile ? 100 : 150;
      const spacing = isMobile ? 60 : 100; // Gap between text bottom and circle top edge

      // Get text position
      let textBottomY = wrapperHeight * 0.5; // Default fallback

      if (text) {
        const textContent = text.querySelector("h1, h2, h3, h4, h5, h6, p");
        const textElement = textContent || text;
        const textRect = textElement.getBoundingClientRect();
        textBottomY = textRect.bottom - wrapperRect.top;
      }

      // INITIAL STATE: Circle positioned with its top edge below the text
      // Circle top edge = text bottom + spacing
      // Circle center = circle top edge + radius
      const initialCircleTopEdge = textBottomY + spacing;
      const initialCenterYPx = initialCircleTopEdge + initialRadiusPx;
      const initialCenterYPercent = (initialCenterYPx / wrapperHeight) * 100;
      const initialCenterXPercent = 50;

      // Convert radius to percentage for smooth animation
      const wrapperDiagonal = Math.sqrt(wrapperWidth ** 2 + wrapperHeight ** 2);
      const initialRadiusPercent = (initialRadiusPx / wrapperDiagonal) * 100;

      // FINAL STATE: Circle fills entire screen from center
      const finalRadiusPercent = 100;
      const finalCenterXPercent = 50;
      const finalCenterYPx = wrapperHeight * 0.5;
      const finalCenterYPercent = 50;
      const finalRadiusPx = wrapperDiagonal;

      // FINAL POSITION of circle's top edge when centered
      const finalCircleTopEdge = finalCenterYPx - finalRadiusPx;

      // INITIAL POSITION of circle's top edge
      // The distance the top edge of the circle moves
      const circleTopEdgeMovement = initialCircleTopEdge - finalCircleTopEdge;

      // Text must move by the same distance to maintain constant gap
      const textMovement = circleTopEdgeMovement;

      // Set initial clip path
      gsap.set(imageWrapper, {
        clipPath: `circle(${initialRadiusPercent}% at ${initialCenterXPercent}% ${initialCenterYPercent}%)`,
      });

      // Create single timeline for all animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: -1,
          ...(isMobile && {
            fastScrollEnd: true,
          }),
        },
      });

      // Animate circle from initial position/size to center/full
      tl.to(
        imageWrapper,
        {
          clipPath: `circle(${finalRadiusPercent}% at ${finalCenterXPercent}% ${finalCenterYPercent}%)`,
          ease: "none",
        },
        0,
      );

      // Text moves up by the exact distance the circle's top edge moves
      // This maintains the constant gap as the circle "pushes" the text
      if (text) {
        tl.to(
          text,
          {
            y: -textMovement,
            ease: "none",
          },
          0,
        );
      }
    },
    { scope: sectionRef, dependencies: [isReady, isMobile] },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-secondary relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Text content */}
      {textContent && (
        <div
          ref={textRef}
          className="relative z-20 flex items-center justify-center px-8 py-16 md:px-16"
          style={{ minHeight: "50vh" }}
        >
          <div className="max-w-3xl text-center">{textContent}</div>
        </div>
      )}

      {/* Image wrapper - full size container for clip path */}
      <div ref={imageWrapperRef} className="absolute inset-0">
        {/* Image container - full size, clipped to circle */}
        <div ref={imageContainerRef} className="absolute inset-0 h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
