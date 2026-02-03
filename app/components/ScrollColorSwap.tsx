"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Rgb = { r: number; g: number; b: number };

const PRIMARY_FALLBACK = "#465643";
const SECONDARY_FALLBACK = "#fffdf6";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const parseColor = (value: string): Rgb => {
  const trimmed = value.trim();
  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return {
        r: Number.parseInt(hex[0] + hex[0], 16),
        g: Number.parseInt(hex[1] + hex[1], 16),
        b: Number.parseInt(hex[2] + hex[2], 16),
      };
    }
    if (hex.length === 6) {
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
      };
    }
  }
  const rgbMatch = trimmed.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch) {
    const [r, g, b] = rgbMatch[1].split(",").map((p) => Number.parseFloat(p.trim()));
    if ([r, g, b].every(Number.isFinite)) {
      return {
        r: clamp(Math.round(r), 0, 255),
        g: clamp(Math.round(g), 0, 255),
        b: clamp(Math.round(b), 0, 255),
      };
    }
  }
  return { r: 0, g: 0, b: 0 };
};

const mixColor = (from: Rgb, to: Rgb, t: number): Rgb => ({
  r: Math.round(from.r + (to.r - from.r) * t),
  g: Math.round(from.g + (to.g - from.g) * t),
  b: Math.round(from.b + (to.b - from.b) * t),
});

const rgbToString = (c: Rgb) => `rgb(${c.r} ${c.g} ${c.b})`;

interface Props {
  children: ReactNode;
  className?: string;
}

export default function ScrollColorSwap({ children, className = "" }: Props) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rootStyles = getComputedStyle(document.documentElement);
    const primary = rootStyles.getPropertyValue("--color-primary").trim() || PRIMARY_FALLBACK;
    const secondary = rootStyles.getPropertyValue("--color-secondary").trim() || SECONDARY_FALLBACK;
    const primaryRgb = parseColor(primary);
    const secondaryRgb = parseColor(secondary);

    let ticking = false;

    const updateColors = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      // How far past the top of viewport is the container top?
      // When container top hits viewport top, scrolled = 0
      // When we've scrolled 100vh into container, scrolled = vh
      const scrolled = -rect.top;

      // Animation zones (in pixels based on vh):
      // 0 to 50vh: quick fade in to green
      // 50vh to 150vh: hold green (100vh)
      // 150vh to 250vh: smooth fade back to original
      const fadeInEnd = 0.5 * vh;
      const holdEnd = fadeInEnd + vh;
      const fadeOutEnd = holdEnd + vh;

      let mix = 0;
      if (scrolled <= 0) {
        mix = 0;
      } else if (scrolled <= fadeInEnd) {
        mix = scrolled / fadeInEnd;
      } else if (scrolled <= holdEnd) {
        mix = 1;
      } else if (scrolled <= fadeOutEnd) {
        mix = 1 - (scrolled - holdEnd) / vh;
      } else {
        mix = 0;
      }
      mix = clamp(mix, 0, 1);

      const bg = mixColor(secondaryRgb, primaryRgb, mix);
      const text = mixColor(primaryRgb, secondaryRgb, mix);

      container.style.setProperty("--scroll-bg", rgbToString(bg));
      container.style.setProperty("--scroll-text", rgbToString(text));
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateColors();
        ticking = false;
      });
    };

    updateColors();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={className}
      style={{
        backgroundColor: "var(--scroll-bg, #fffdf6)",
        color: "var(--scroll-text, #465643)",
      }}
    >
      {children}
    </section>
  );
}
