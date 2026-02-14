"use client";

import { useRef, ReactNode, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, SplitText } from "@/app/lib/gsapConfig";

// Wait for document height to stabilize (e.g. after PinnedImageReveal adds pin spacing)
// before creating ScrollTrigger; otherwise start/end are wrong and animation appears already finished.
const STABLE_DELAY_MS = 200;
const MAX_WAIT_MS = 2500;
const MOBILE_BREAKPOINT = 768;

// Match desktop ScrollTrigger: start when top hits bottom-20%, end when bottom hits center
const SCRUB_START_VH = 0.8;
const SCRUB_END_VH = 0.5;
const STAGGER = 0.8;

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  startColor?: string;
  endColor?: string;
}

export default function TextReveal({
  children,
  className = "",
  startColor = "rgb(255, 255, 255, 0.5)", // color-primary/50
  endColor = "rgb(255, 255, 255)", // color-primary
}: TextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLElement[]>(null);
  const lenis = useLenis();
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth < MOBILE_BREAKPOINT,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    let splitText: InstanceType<typeof SplitText> | null = null;
    let stableTimeoutId: ReturnType<typeof setTimeout>;
    let lastHeight = 0;
    let mounted = true;
    let didSetup = false;
    let unsubLenis: (() => void) | undefined;

    const setup = () => {
      if (isMobile && !lenis) return; // wait for Lenis so we can scrub on mobile
      if (!mounted || !textRef.current || didSetup) return;
      didSetup = true;

      const elements = textElement.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6",
      );
      const elementsToSplit = elements.length > 0 ? elements : [textElement];

      splitText = SplitText.create(elementsToSplit, {
        type: "lines",
        linesClass: "line-child++",
      });

      const nonEmptyLines = Array.from(splitText.lines).filter(
        (line) => line.textContent?.trim() !== "",
      ) as HTMLElement[];

      elementsToSplit.forEach((el) => {
        (el as HTMLElement).style.overflow = "visible";
      });

      const lineParents =
        textElement.querySelectorAll<HTMLElement>(".line-child");
      lineParents.forEach((parent) => {
        parent.style.overflow = "visible";
        parent.style.paddingBottom = "0.1em";
      });

      nonEmptyLines.forEach((line) => {
        const lineElement = line as HTMLElement;
        lineElement.style.background = `linear-gradient(to left, ${endColor} 50%, ${startColor} 50%)`;
        lineElement.style.backgroundSize = "200% 100%";
        lineElement.style.color = "transparent";
        lineElement.style.backgroundClip = "text";
        lineElement.style.webkitBackgroundClip = "text";
        lineElement.style.display = "inline-block";
        lineElement.style.whiteSpace = "pre-wrap";
        lineElement.style.verticalAlign = "bottom";
      });

      if (isMobile && lenis) {
        // Mobile: scrub driven by scroll position (not ScrollTrigger) so it works with Lenis.
        // Progress from element position: start when top at bottom-20%, end when bottom at center.
        linesRef.current = nonEmptyLines;
        const n = nonEmptyLines.length;
        const totalDuration = 1 + (n - 1) * STAGGER;

        const updateScrub = () => {
          if (!mounted || !textRef.current || !linesRef.current?.length) return;
          const rect = textElement.getBoundingClientRect();
          const vh = window.innerHeight;
          const startY = SCRUB_START_VH * vh;
          const endY = SCRUB_END_VH * vh - rect.height;
          const range = startY - endY;
          if (range <= 0) return;
          const scrollProgress = Math.max(
            0,
            Math.min(1, (startY - rect.top) / range),
          );
          const timelineTime = scrollProgress * totalDuration;
          nonEmptyLines.forEach((line, i) => {
            const lineProgress = Math.max(
              0,
              Math.min(1, (timelineTime - i * STAGGER) / 1),
            );
            const x = -100 * lineProgress;
            (line as HTMLElement).style.backgroundPosition = `${x}% 0%`;
          });
        };

        updateScrub();
        unsubLenis = lenis.on("scroll", updateScrub);
      } else if (!isMobile) {
        gsap.to(nonEmptyLines, {
          backgroundPosition: "-100% 0%",
          duration: 1,
          stagger: STAGGER,
          ease: "linear",
          scrollTrigger: {
            trigger: textElement,
            scrub: 1,
            start: "top bottom-=20%",
            end: "bottom center",
            invalidateOnRefresh: true,
          },
        });
        ScrollTrigger.refresh();
      }
    };

    const checkStable = () => {
      if (didSetup) return;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight === lastHeight) {
        setup();
        return;
      }
      lastHeight = docHeight;
      stableTimeoutId = setTimeout(checkStable, STABLE_DELAY_MS);
    };

    stableTimeoutId = setTimeout(checkStable, 400);
    const maxWaitId = setTimeout(() => {
      if (!splitText && mounted) setup();
    }, MAX_WAIT_MS);

    return () => {
      mounted = false;
      linesRef.current = null;
      clearTimeout(stableTimeoutId);
      clearTimeout(maxWaitId);
      unsubLenis?.();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === textElement) {
          trigger.kill();
        }
      });
      splitText?.revert();
    };
  }, [startColor, endColor, isMobile, lenis]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
