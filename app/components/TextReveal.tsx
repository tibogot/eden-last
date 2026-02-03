"use client";

import { useRef, ReactNode, useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/app/lib/gsapConfig";

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

    // Find all paragraphs, headings, or use the container directly
    const elements = textElement.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
    const elementsToSplit = elements.length > 0 ? elements : [textElement];

    // Split text into lines with nested wrapper to prevent clipping
    const splitText = SplitText.create(elementsToSplit, {
      type: "lines",
      linesClass: "line-child++",
    });

    // Filter out empty lines
    const nonEmptyLines = Array.from(splitText.lines).filter(
      (line) => line.textContent?.trim() !== "",
    );

    // Set overflow visible on all parent wrappers
    elementsToSplit.forEach((el) => {
      (el as HTMLElement).style.overflow = "visible";
    });

    const lineParents =
      textElement.querySelectorAll<HTMLElement>(".line-child");
    lineParents.forEach((parent) => {
      parent.style.overflow = "visible";
      parent.style.paddingBottom = "0.1em"; // Add small padding for descenders
    });

    // Apply gradient styling to each line
    nonEmptyLines.forEach((line) => {
      const lineElement = line as HTMLElement;
      lineElement.style.background = `linear-gradient(to left, ${endColor} 50%, ${startColor} 50%)`;
      lineElement.style.backgroundSize = "200% 100%";
      lineElement.style.color = "transparent";
      lineElement.style.backgroundClip = "text";
      lineElement.style.webkitBackgroundClip = "text";
      lineElement.style.display = "inline-block";
      lineElement.style.whiteSpace = "pre-wrap";
      lineElement.style.verticalAlign = "bottom"; // Align to bottom to prevent clipping
    });

    // Animate the gradient reveal on scroll
    gsap.to(nonEmptyLines, {
      backgroundPosition: "-100% 0%",
      duration: 1,
      stagger: 0.8,
      ease: "linear",
      scrollTrigger: {
        trigger: textElement,
        scrub: 1,
        start: "top bottom-=20%",
        end: "center center",
        // markers: true,
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === textElement) {
          trigger.kill();
        }
      });
      splitText.revert();
    };
  }, [startColor, endColor]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
}
