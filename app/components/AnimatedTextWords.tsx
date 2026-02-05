"use client";
import { useRef, ReactNode, useState, useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/app/lib/gsapConfig";

interface AnimatedTextWordsProps {
  children: ReactNode;
  trigger?: string | HTMLElement;
  start?: string;
  toggleActions?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  className?: string;
  isHero?: boolean;
  /** Animation style: "lift" (opacity + y), "scale" (pop in), "fade" (opacity only) */
  variant?: "lift" | "scale" | "fade";
}

function AnimatedTextWords({
  children,
  trigger,
  start = "top 75%",
  toggleActions = "play reverse play reverse",
  stagger = 0.04,
  duration = 0.5,
  delay = 0,
  ease = "power2.out",
  className = "",
  isHero = false,
  variant = "lift",
}: AnimatedTextWordsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<Array<ReturnType<typeof SplitText.create>>>([]);
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([]);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    const checkFontsLoaded = async () => {
      try {
        if (document.fonts?.ready) {
          await document.fonts.ready;
          setTimeout(() => setFontsReady(true), 50);
        } else {
          setTimeout(() => setFontsReady(true), 100);
        }
      } catch {
        setTimeout(() => setFontsReady(true), 100);
      }
    };
    checkFontsLoaded();
  }, []);

  useEffect(() => {
    const styleId = "animated-text-words-fouc";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .animated-text-words-wrapper { overflow: hidden; }
        .animated-text-words-wrapper.fouc-prevent { visibility: hidden !important; opacity: 0 !important; }
        .animated-text-words-wrapper .word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .animated-text-words-wrapper .word-wrap .word-inner { display: inline-block; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useGSAP(
    () => {
      if (!wrapperRef.current || !fontsReady) return;

      wrapperRef.current.classList.add("fouc-prevent");

      const runSplit = () => {
        splitRefs.current.forEach((s) => s?.revert());
        splitRefs.current = [];

        const childElements = Array.from(
          wrapperRef.current!.children,
        ) as HTMLElement[];

        if (childElements.length === 0) return;

        let ok = true;

        childElements.forEach((child, index) => {
          try {
            gsap.set(child, { visibility: "hidden", opacity: 0 });
            void child.offsetHeight;

            const split = SplitText.create(child, {
              type: "words",
              wordsClass: "word-inner",
              tag: "span",
              aria: "none",
            });

            if (!split.words?.length) {
              ok = false;
              return;
            }

            splitRefs.current.push(split);

            // Wrap each word in a span for overflow hidden (optional, for lift/scale)
            const words = split.words as HTMLElement[];
            gsap.set(words, { display: "inline-block" });

            const from: gsap.TweenVars = {};
            const to: gsap.TweenVars = {};

            switch (variant) {
              case "lift":
                Object.assign(from, { y: 14, autoAlpha: 0 });
                Object.assign(to, { y: 0, autoAlpha: 1 });
                break;
              case "scale":
                Object.assign(from, { scale: 0.6, autoAlpha: 0 });
                Object.assign(to, { scale: 1, autoAlpha: 1 });
                break;
              case "fade":
                Object.assign(from, { autoAlpha: 0 });
                Object.assign(to, { autoAlpha: 1 });
                break;
            }

            gsap.set(words, from);

            if (isHero) {
              if (wrapperRef.current) wrapperRef.current.classList.remove("fouc-prevent");
              gsap.set(child, { visibility: "visible", opacity: 1 });
              gsap.to(words, {
                ...to,
                stagger,
                duration,
                ease,
                delay: delay + index * 0.05,
              });
            } else {
              const stConfig = {
                trigger: trigger || wrapperRef.current || child,
                start,
                toggleActions,
                onEnter: () => {
                  if (wrapperRef.current) wrapperRef.current.classList.remove("fouc-prevent");
                  gsap.set(child, { visibility: "visible", opacity: 1 });
                },
              };
              const tween = gsap.to(words, {
                ...to,
                stagger,
                duration,
                ease,
                delay,
                scrollTrigger: stConfig,
              });
              if (tween.scrollTrigger) scrollTriggerRefs.current.push(tween.scrollTrigger);
            }
          } catch {
            ok = false;
          }
        });

        if (!ok) setTimeout(runSplit, 100);
      };

      requestAnimationFrame(() => setTimeout(runSplit, 100));

      return () => {
        scrollTriggerRefs.current.forEach((st) => st?.kill());
        scrollTriggerRefs.current = [];
        splitRefs.current.forEach((s) => s?.revert());
        splitRefs.current = [];
      };
    },
    [
      trigger,
      start,
      toggleActions,
      stagger,
      duration,
      delay,
      ease,
      fontsReady,
      isHero,
      variant,
    ],
  );

  return (
    <div
      ref={wrapperRef}
      className={`animated-text-words-wrapper fouc-prevent ${className}`}
    >
      {children}
    </div>
  );
}

export default AnimatedTextWords;
