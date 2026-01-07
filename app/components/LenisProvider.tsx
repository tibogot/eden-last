"use client";

import { ReactNode, useEffect, useRef } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

interface LenisProviderProps {
  children: ReactNode;
}

function LenisController() {
  const lenis = useLenis();
  const pathname = usePathname();

  // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
  // This is the official recommendation from Lenis documentation
  useEffect(() => {
    if (!lenis) return;

    // Update ScrollTrigger on every Lenis scroll event
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      // Clean up the scroll listener
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  // Handle page transitions - stop/start Lenis
  useEffect(() => {
    if (!lenis) return;

    const handlePageTransitionStart = () => {
      // Stop Lenis scrolling during page transitions to prevent jitter
      lenis.stop();
    };

    const handlePageTransitionComplete = () => {
      // Scroll to top on route change
      lenis.scrollTo(0, { immediate: true });

      // Resume Lenis after page transition completes
      // Small delay to ensure animations have settled
      setTimeout(() => {
        lenis.start();
      }, 100);
    };

    window.addEventListener("pageTransitionStart", handlePageTransitionStart);
    window.addEventListener(
      "pageTransitionComplete",
      handlePageTransitionComplete,
    );

    return () => {
      window.removeEventListener(
        "pageTransitionStart",
        handlePageTransitionStart,
      );
      window.removeEventListener(
        "pageTransitionComplete",
        handlePageTransitionComplete,
      );
    };
  }, [lenis, pathname]);

  return null;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<LenisRef>(null);

  // CRITICAL: Integrate Lenis with GSAP ticker
  // This is the official pattern from Lenis documentation
  // https://github.com/darkroomengineering/lenis
  useEffect(() => {
    function update(time: number) {
      // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
      // Convert time from seconds (GSAP) to milliseconds (Lenis)
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    // Add the update function to GSAP's ticker
    gsap.ticker.add(update);

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    // This is required for proper Lenis + GSAP integration
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Clean up: remove the update function from GSAP's ticker
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        // CRITICAL: Must be false when using GSAP ticker integration
        autoRaf: false,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // syncTouch: false is recommended unless you need infinite scrolling on mobile
        // See: https://github.com/darkroomengineering/lenis/discussions/322
        // Note: syncTouch may behave unexpectedly on iOS < 16
        syncTouch: false,
        // Additional smooth scrolling options
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <LenisController />
      {children}
    </ReactLenis>
  );
}
