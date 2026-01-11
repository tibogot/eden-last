"use client";

import { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText } from "@/app/lib/gsapConfig";

interface GradientTextRevealProps {
  children: ReactNode;
  textColor?: string; // Grey color for initial state (default: #808080)
  highlightColor?: string; // Final color for reveal (default: #000000)
  scrollDistance?: string; // Scroll distance for animation (default: "+=200%")
  stagger?: number; // Stagger between lines (default: 0.8)
  className?: string;
  trigger?: string | HTMLElement; // Custom trigger element
  start?: string; // ScrollTrigger start (default: "top top")
}

export default function GradientTextReveal({
  children,
  textColor = "#808080", // Grey color for initial state
  highlightColor = "#000000", // Black color for final state
  scrollDistance = "+=200%",
  stagger = 0.8,
  className = "",
  trigger,
  start = "top top",
}: GradientTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<ReturnType<typeof SplitText.create>[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Ensure element is in the DOM
    if (!containerRef.current.isConnected) return;

    // Wait for fonts to load
    const initAnimation = async () => {
      await document.fonts.ready;

      // Small delay to ensure fonts are rendered
      timeoutRef.current = setTimeout(() => {
        if (!containerRef.current || !containerRef.current.isConnected) return;

        // Clean up previous instances
        if (timelineRef.current) {
          timelineRef.current.kill();
          timelineRef.current = null;
        }
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
          scrollTriggerRef.current = null;
        }
        splitRefs.current.forEach((split) => {
          if (split) split.revert();
        });
        splitRefs.current = [];

        // Find all heading elements (h1, h2, h3, h4, h5, h6) or use container directly
        const headings = containerRef.current.querySelectorAll<HTMLElement>(
          "h1, h2, h3, h4, h5, h6",
        );

        const elementsToAnimate =
          headings.length > 0 ? Array.from(headings) : [containerRef.current];

        // Get trigger element
        const triggerElement = trigger
          ? typeof trigger === "string"
            ? document.querySelector(trigger) || containerRef.current
            : trigger
          : containerRef.current;

        // Collect all lines from all elements
        const allLines: HTMLElement[] = [];

        elementsToAnimate.forEach((element) => {
          // Create SplitText instance with lines only (no need for words)
          const split = SplitText.create(element, {
            type: "lines",
            linesClass: "gradient-text-line++",
          });

          if (!split.lines || split.lines.length === 0) return;

          splitRefs.current.push(split);

          // Apply gradient styling to each line
          split.lines.forEach((line) => {
            if (
              !line ||
              !(line instanceof HTMLElement) ||
              line.textContent?.trim() === ""
            )
              return;

            // Text starts visible as grey, then smoothly transitions to black
            // Gradient: black (left 50%) -> grey (right 50%)
            Object.assign(line.style, {
              background: `linear-gradient(to left, ${highlightColor} 50%, ${textColor} 50%)`,
              backgroundSize: "200% 100%",
              backgroundPosition: "0% 0%", // Start position - showing grey (right side)
              color: "transparent",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              display: "inline-block",
              whiteSpace: "pre-wrap",
            });

            allLines.push(line as HTMLElement);
          });
        });

        // Create single timeline for all elements
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: start,
            end: scrollDistance,
            scrub: true,
          },
        });

        // Animate background position for all lines
        // Text starts as grey, smoothly transitions to black as you scroll
        // Start at 0% (showing grey), animate to -100% (revealing black)
        if (allLines.length > 0) {
          // Animate background position to reveal black color
          tl.to(allLines, {
            backgroundPosition: "-100% 0%",
            duration: 1,
            stagger: stagger,
            ease: "none",
          });
        }

        timelineRef.current = tl;
        scrollTriggerRef.current = tl.scrollTrigger as ScrollTrigger;
      }, 100);
    };

    initAnimation();

    return () => {
      // Clear timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Cleanup timeline and scroll trigger
      if (timelineRef.current) {
        try {
          timelineRef.current.kill();
        } catch {
          // Ignore errors if already killed
        }
        timelineRef.current = null;
      }

      if (scrollTriggerRef.current) {
        try {
          scrollTriggerRef.current.kill();
        } catch {
          // Ignore errors if already killed
        }
        scrollTriggerRef.current = null;
      }

      // Revert SplitText instances
      splitRefs.current.forEach((split) => {
        try {
          if (split) split.revert();
        } catch {
          // Ignore errors if already reverted
        }
      });
      splitRefs.current = [];
    };
  }, [textColor, highlightColor, scrollDistance, stagger, trigger, start]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
