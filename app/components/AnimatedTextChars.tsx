"use client";
import { useRef, ReactNode, useState, useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/app/lib/gsapConfig";

interface AnimatedTextCharsProps {
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
}

/**
 * Same concept as AnimatedText3 (lines slide up) but per letter:
 * each character appears by coming up (yPercent 100 → 0) with stagger.
 */
function AnimatedTextChars({
  children,
  trigger,
  start = "top 75%",
  toggleActions = "play reverse play reverse",
  stagger = 0.02,
  duration = 0.5,
  delay = 0,
  ease = "power2.out",
  className = "",
  isHero = false,
}: AnimatedTextCharsProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<Array<ReturnType<typeof SplitText.create>>>([]);
  const scrollTriggerRefs = useRef<ScrollTrigger[]>([]);
  const wrapperElementsRef = useRef<HTMLElement[]>([]); // wrappers we create for cleanup
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
    const styleId = "animated-text-chars-fouc";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .animated-text-chars-wrapper { overflow: visible; }
        .animated-text-chars-wrapper.fouc-prevent { visibility: hidden !important; opacity: 0 !important; }
        /* Char mask: overflow visible so g/y/p descenders are never clipped; slide-up still works */
        .animated-text-chars-wrapper .char-mask { display: inline-block; overflow: visible; vertical-align: bottom; }
        .animated-text-chars-wrapper .char-mask .char-inner { display: inline-block; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useGSAP(
    () => {
      if (!wrapperRef.current || !fontsReady) return;

      wrapperRef.current.classList.add("fouc-prevent");

      const runSplit = () => {
        // Remove any wrappers we added (they're not reverted by split.revert)
        wrapperElementsRef.current.forEach((el) => el.remove());
        wrapperElementsRef.current = [];

        splitRefs.current.forEach((s) => s?.revert());
        splitRefs.current = [];
        scrollTriggerRefs.current.forEach((st) => st?.kill());
        scrollTriggerRefs.current = [];

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
              type: "chars",
              tag: "span",
              charsClass: "char-inner",
              smartWrap: true, // keep words together (no mid-word line breaks)
              aria: "none",
            });

            if (!split.chars?.length) {
              ok = false;
              return;
            }

            splitRefs.current.push(split);

            const chars = split.chars as HTMLElement[];

            // Wrap each char in a mask so we can clip the slide-up (same as line version)
            const wrappersForChild: HTMLElement[] = [];
            chars.forEach((charEl) => {
              const wrapper = document.createElement("span");
              wrapper.className = "char-mask";
              wrapper.style.cssText =
                "display:inline-block;overflow:visible;vertical-align:bottom;";
              charEl.parentNode?.insertBefore(wrapper, charEl);
              wrapper.appendChild(charEl);
              wrapperElementsRef.current.push(wrapper);
              wrappersForChild.push(wrapper);
            });

            // Fix descender clipping: inner char has taller line-height; mask extends below with
            // padding so the clip region doesn't cut off g, y, p. Compensate with negative margin.
            const lineHeightValue = gsap.getProperty(child, "line-height", "em");
            const lineHeight = parseFloat(String(lineHeightValue)) || 1.2;
            const baseLineHeight = 1.65; // char box tall enough to include full descender (g, y, p)
            const padBottom = 0.15; // small extra so mask never clips
            const lineHeightDifference = lineHeight - baseLineHeight - padBottom;
            gsap.set(chars, { lineHeight: baseLineHeight });
            wrappersForChild.forEach((mask) => {
              gsap.set(mask, {
                lineHeight: baseLineHeight,
                paddingBottom: `${padBottom}em`,
                marginBottom: `${lineHeightDifference}em`,
              });
            });

            gsap.set(chars, { yPercent: 100, autoAlpha: 0 });

            if (isHero) {
              if (wrapperRef.current)
                wrapperRef.current.classList.remove("fouc-prevent");
              gsap.set(child, { visibility: "visible", opacity: 1 });
              gsap.to(chars, {
                yPercent: 0,
                autoAlpha: 1,
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
                  if (wrapperRef.current)
                    wrapperRef.current.classList.remove("fouc-prevent");
                  gsap.set(child, { visibility: "visible", opacity: 1 });
                },
              };
              const tween = gsap.to(chars, {
                yPercent: 0,
                autoAlpha: 1,
                stagger,
                duration,
                ease,
                delay,
                scrollTrigger: stConfig,
              });
              if (tween.scrollTrigger)
                scrollTriggerRefs.current.push(tween.scrollTrigger);
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
        wrapperElementsRef.current.forEach((el) => el.remove());
        wrapperElementsRef.current = [];
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
    ],
  );

  return (
    <div
      ref={wrapperRef}
      className={`animated-text-chars-wrapper fouc-prevent ${className}`}
    >
      {children}
    </div>
  );
}

export default AnimatedTextChars;
