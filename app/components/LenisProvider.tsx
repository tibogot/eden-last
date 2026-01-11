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

    // Set up scrollerProxy so ScrollTrigger knows about Lenis
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      scrollLeft(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: window.transform ? "transform" : "fixed",
    });

    // Update ScrollTrigger on every Lenis scroll event
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      // Clean up the scroll listener
      lenis.off("scroll", ScrollTrigger.update);
      ScrollTrigger.scrollerProxy(window, false);
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

        // Refresh ScrollTrigger after the slide animation completes
        // This recalculates all trigger positions based on the final layout
        ScrollTrigger.refresh();
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

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        // Let Lenis use its own RAF loop (default behavior)
        // scrollerProxy handles ScrollTrigger integration
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
