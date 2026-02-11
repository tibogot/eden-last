"use client";

import { useRef, ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/app/lib/gsapConfig";

// Wait for document height to stabilize (e.g. after PinnedImageReveal adds pin spacing)
// before creating ScrollTrigger; otherwise start/end are wrong and animation appears already finished.
const STABLE_DELAY_MS = 200;
const MAX_WAIT_MS = 2500;

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

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    let splitText: InstanceType<typeof SplitText> | null = null;
    let stableTimeoutId: ReturnType<typeof setTimeout>;
    let lastHeight = 0;
    let mounted = true;
    let didSetup = false;

    const setup = () => {
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
      );

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

      gsap.to(nonEmptyLines, {
        backgroundPosition: "-100% 0%",
        duration: 1,
        stagger: 0.8,
        ease: "linear",
        scrollTrigger: {
          trigger: textElement,
          scrub: 1,
          start: "top bottom-=20%",
          end: "bottom center",
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      ScrollTrigger.refresh();
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

    // Start checking after a short delay so pin has time to add spacer
    stableTimeoutId = setTimeout(checkStable, 400);
    const maxWaitId = setTimeout(() => {
      if (!splitText && mounted) setup();
    }, MAX_WAIT_MS);

    return () => {
      mounted = false;
      clearTimeout(stableTimeoutId);
      clearTimeout(maxWaitId);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === textElement) {
          trigger.kill();
        }
      });
      splitText?.revert();
    };
  }, [startColor, endColor]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
