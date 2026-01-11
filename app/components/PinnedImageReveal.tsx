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

      // Initial circle size - small, close to text
      const initialRadiusPx = 150; // pixels

      // Position circle centered horizontally, just below text
      let initialCenterXPercent = 50; // Centered horizontally
      let initialCenterYPercent = 55; // Default position below text area

      if (text) {
        // Find the actual text content element (h1, h2, p, etc.) inside the text container
        const textContent = text.querySelector("h1, h2, h3, h4, h5, h6, p");
        const textElement = textContent || text;
        const textRect = textElement.getBoundingClientRect();

        // Keep circle centered horizontally
        initialCenterXPercent = 50;
        // Position circle just below the text with minimal spacing
        const textBottomY = textRect.bottom - wrapperRect.top;
        const spacing = 100; // DEBUG: Large spacing to test if positioning works
        initialCenterYPercent =
          ((textBottomY + initialRadiusPx + spacing) / wrapperHeight) * 100;
      }

      // Convert radius to percentage for smooth animation
      const wrapperDiagonal = Math.sqrt(wrapperWidth ** 2 + wrapperHeight ** 2);
      const initialRadiusPercent = (initialRadiusPx / wrapperDiagonal) * 100;

      // Set initial clip path - small circle positioned close to text
      gsap.set(imageWrapper, {
        clipPath: `circle(${initialRadiusPercent}% at ${initialCenterXPercent}% ${initialCenterYPercent}%)`,
      });

      // Create timeline for coordinated animation - longer scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=800vh", // Longer scroll distance so circle and text move together smoothly
          pin: true,
          pinReparent: true,
          scrub: 1,
          // markers: true,
          pinSpacing: true,
        },
      });

      // Text animation - separate ScrollTrigger so it completes earlier
      // Text moves at same linear rate as circle to maintain constant distance
      // Text is pushed out of view before circle reaches full screen
      if (text) {
        const textContent = text.querySelector("h1, h2, h3, h4, h5, h6, p");
        const textElement = textContent || text;
        const textRect = textElement.getBoundingClientRect();
        const textTop = textRect.top - wrapperRect.top;
        const textHeight = textRect.height;

        // Calculate distance to move text completely out of view
        const textMoveDistance = textTop + textHeight + 200;

        // Create separate ScrollTrigger for text that completes in 400vh
        // This means text finishes moving while circle continues to 800vh
        gsap.to(text, {
          y: -textMoveDistance,
          ease: "none", // Linear - same rate as circle to maintain constant distance
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=400vh", // Text completes in first 400vh (50% of circle's 800vh)
            pin: false, // Don't pin again, section is already pinned
            scrub: 1,
          },
        });
      }

      // Circle animation - continues to full screen after text is gone
      const finalRadiusPercent = 100; // Full coverage - image takes full screen
      const finalCenterXPercent = 50; // Center horizontally
      const finalCenterYPercent = 50; // Center vertically

      tl.to(imageWrapper, {
        clipPath: `circle(${finalRadiusPercent}% at ${finalCenterXPercent}% ${finalCenterYPercent}%)`,
        ease: "none", // Linear growth - maintains constant rate
      });
    },
    { scope: sectionRef, dependencies: [isReady] },
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
