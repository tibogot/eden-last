"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "../lib/gsapConfig";
import { usePathname } from "next/navigation";

interface PinnedImageRevealProps {
  imageSrc: string;
  imageAlt?: string;
}

export default function PinnedImageReveal({
  imageSrc,
  imageAlt = "Background image",
}: PinnedImageRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  // Wait for page transition to complete before creating ScrollTrigger
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const handleTransitionComplete = () => {
      if (!mounted) return;
      // Wait a bit longer to ensure content is fully settled
      timeoutId = setTimeout(() => {
        if (mounted) {
          setIsReady(true);
        }
      }, 100);
    };

    const checkAndInit = () => {
      if (!mounted) return;

      // Check if we're currently in a page transition
      const contentContainer = document.querySelector(".content-container") as HTMLElement;
      if (contentContainer) {
        const transform = window.getComputedStyle(contentContainer).transform;
        // Check if content is currently transformed (mid-animation)
        if (transform && transform !== "none") {
          // Wait for transition to complete
          window.addEventListener("pageTransitionComplete", handleTransitionComplete, { once: true });
        } else {
          // No animation in progress, ready after a small delay
          timeoutId = setTimeout(() => {
            if (mounted) setIsReady(true);
          }, 50);
        }
      } else {
        // Fallback: just wait a bit
        timeoutId = setTimeout(() => {
          if (mounted) setIsReady(true);
        }, 200);
      }
    };

    // Use RAF to avoid synchronous setState in effect
    requestAnimationFrame(checkAndInit);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      window.removeEventListener("pageTransitionComplete", handleTransitionComplete);
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (!sectionRef.current || !overlayRef.current || !isReady) return;

      gsap.fromTo(
        overlayRef.current,
        {
          clipPath: "circle(10% at 50% 50%)",
        },
        {
          clipPath: "circle(100% at 50% 50%)",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=400vh",
            pin: true,
            pinReparent: true,
            scrub: 1,
            markers: true,
            pinSpacing: true,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [isReady] },
  );

  return (
    <section ref={sectionRef} className="bg-secondary relative h-screen w-full">
      <div ref={overlayRef} className="absolute inset-0 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
