"use client";

import { useEffect, useState } from "react";
import AnimatedTextChars from "@/app/components/AnimatedTextChars";

const DEFAULT_TITLE = "Where food brings us together.";

interface RestaurantHeroTitleProps {
  title?: string;
}

export default function RestaurantHeroTitle({ title = DEFAULT_TITLE }: RestaurantHeroTitleProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    let readyTimeoutId: ReturnType<typeof setTimeout>;

    const setReady = () => {
      if (!mounted) return;
      readyTimeoutId = setTimeout(() => {
        if (mounted) setIsReady(true);
      }, 150);
    };

    const onTransitionComplete = () => {
      setReady();
    };

    window.addEventListener("pageTransitionComplete", onTransitionComplete, {
      once: true,
    });

    // Fallback: direct load when event never fires (no view transition)
    const fallbackId = setTimeout(() => {
      if (!mounted) return;
      window.removeEventListener(
        "pageTransitionComplete",
        onTransitionComplete,
      );
      setReady();
    }, 500);

    return () => {
      mounted = false;
      clearTimeout(readyTimeoutId);
      clearTimeout(fallbackId);
      window.removeEventListener(
        "pageTransitionComplete",
        onTransitionComplete,
      );
    };
  }, []);

  const titleClasses =
    "font-ivy-headline mx-auto max-w-4xl text-5xl leading-tight text-white md:text-8xl";

  // Placeholder: reserves layout, no visible text (avoids FOUC until transition done)
  if (!isReady) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center"
        aria-hidden
      >
        <div className="w-full px-4 md:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className={titleClasses}>
              <span className="invisible" style={{ display: "block" }}>
                {title}
              </span>
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full px-4 md:px-8">
        <div className="flex flex-col items-center text-center">
          <h1>
            <AnimatedTextChars isHero className={titleClasses}>
              <span>{title}</span>
            </AnimatedTextChars>
          </h1>
        </div>
      </div>
    </div>
  );
}
