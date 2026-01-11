"use client";

import { useRef, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/app/lib/gsapConfig";
import GradientTextReveal from "@/app/components/GradientTextReveal";

interface GradientTextSectionProps {
  children: ReactNode;
  textColor?: string;
  highlightColor?: string;
  scrollDistance?: string; // For pinned sections - controls pin duration
  stagger?: number;
  className?: string;
  pin?: boolean;
  contentClassName?: string; // For styling the content container
  animationStart?: string; // ScrollTrigger start for animation (default: "top bottom" for non-pinned, "top top" for pinned)
  animationEnd?: string; // ScrollTrigger end for animation (default: "bottom top" for non-pinned, uses scrollDistance for pinned)
}

export default function GradientTextSection({
  children,
  textColor = "#808080", // Grey color for initial state
  highlightColor = "#000000", // Black color for final state
  scrollDistance = "+=200%",
  stagger = 0.8,
  className = "",
  pin = true,
  contentClassName = "", // Default empty, user can add their own styling
  animationStart, // When animation starts
  animationEnd, // When animation ends (defaults to "bottom top" for non-pinned, uses scrollDistance for pinned)
}: GradientTextSectionProps) {
  const pinContainerRef = useRef<HTMLDivElement>(null);

  // Handle pinning for pinned sections
  useGSAP(
    () => {
      if (!pin || !pinContainerRef.current) return;

      const textSection =
        pinContainerRef.current.querySelector(".text-section");
      if (!textSection) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: textSection,
          start: "top top",
          end: scrollDistance,
          scrub: true,
          pin: true,
          pinSpacing: false,
        },
      });
    },
    { scope: pinContainerRef, dependencies: [pin, scrollDistance] },
  );

  // For non-pinned sections, use a simpler layout without the 300vh container
  if (!pin) {
    return (
      <section className={`relative w-full overflow-hidden ${className}`}>
        <div className="gradient-text-trigger flex h-auto w-full items-center justify-center text-center">
          <GradientTextReveal
            textColor={textColor}
            highlightColor={highlightColor}
            scrollDistance={animationEnd || "bottom top"}
            stagger={stagger}
            trigger=".gradient-text-trigger"
            start={animationStart || "top bottom"}
            className={contentClassName}
          >
            {children}
          </GradientTextReveal>
        </div>
      </section>
    );
  }

  // For pinned sections, use the original 300vh container layout
  return (
    <section
      ref={pinContainerRef}
      className={`relative w-full overflow-hidden ${className}`}
    >
      {/* Container with 300vh height for scroll animation */}
      <div className="relative" style={{ height: "300vh" }}>
        {/* Text section positioned absolutely, centered - matches original Section2 */}
        <div className="text-section absolute top-0 left-0 flex h-screen w-full items-center justify-center text-center">
          <GradientTextReveal
            textColor={textColor}
            highlightColor={highlightColor}
            scrollDistance={animationEnd || scrollDistance}
            stagger={stagger}
            trigger=".text-section"
            start={animationStart || "top top"}
            className={contentClassName}
          >
            {children}
          </GradientTextReveal>
        </div>
      </div>
    </section>
  );
}
