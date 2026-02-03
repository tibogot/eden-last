"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "../lib/gsapConfig";
import { usePathname } from "next/navigation";

interface ExpandingImageRevealProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description?: string;
}

export default function ExpandingImageReveal({
  imageSrc,
  imageAlt = "Background image",
  title,
  description,
}: ExpandingImageRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

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
      if (!sectionRef.current || !imageWrapperRef.current || !isReady) return;

      const section = sectionRef.current;
      const imageWrapper = imageWrapperRef.current;
      const text = textRef.current;

      // Responsive scroll distance - much longer for smoother animation
      const scrollDistance = isMobile ? "500vh" : "1000vh";

      // Initial scale for the image
      const initialScale = isMobile ? 0.6 : 0.5;

      // Calculate text start position - fully below viewport so it's hidden
      const viewportHeight = window.innerHeight;
      const textStartY = viewportHeight; // Start from 100% below (off-screen)

      // Set initial states
      gsap.set(imageWrapper, {
        scale: initialScale,
      });

      if (text) {
        gsap.set(text, {
          y: textStartY,
        });
      }

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: 2, // Smooth scrubbing with 2 second catch-up
          invalidateOnRefresh: true,
          refreshPriority: -1,
          ...(isMobile && {
            fastScrollEnd: true,
          }),
        },
      });

      // Phase 1: Image scales from small to full (0 to 0.25)
      tl.to(
        imageWrapper,
        {
          scale: 1,
          ease: "none",
          duration: 0.25,
        },
        0
      );

      // Phase 2: Text rises from bottom to center (0.25 to 0.65) - 40% of scroll = 400vh
      if (text) {
        tl.to(
          text,
          {
            y: 0,
            ease: "none",
            duration: 0.4,
          },
          0.25
        );
      }

      // Phase 3: Hold at the end (0.65 to 1.0) - 35% hold before unpinning = 350vh
      tl.to({}, { duration: 0.35 }, 0.65);
    },
    { scope: sectionRef, dependencies: [isReady, isMobile] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-svh w-full overflow-hidden bg-black"
    >
      {/* Image wrapper - scales from center */}
      <div
        ref={imageWrapperRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: "center center" }}
      >
        <div className="relative h-full w-full">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Text overlay */}
      <div
        ref={textRef}
        className="absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="max-w-3xl px-4 text-center text-white md:px-8">
          <h2 className="font-ivy-headline mb-6 text-4xl leading-tight md:text-6xl">
            {title}
          </h2>
          {description && (
            <p className="text-lg opacity-90 md:text-xl">{description}</p>
          )}
        </div>
      </div>
    </section>
  );
}
